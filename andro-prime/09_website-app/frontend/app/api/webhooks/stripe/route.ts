import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent, identifyUser, emitOpsAlert } from '@/lib/customerio/emit'
import { cioKeyFromEmail, cioKeyForUserId } from '@/lib/customerio/identity'
import { productName } from '@/lib/subscriptions/products'
import {
  MEMBERSHIP_SLUG,
  createMembership,
  resolveRecurringOwner,
  setRecurringStatus,
} from '@/lib/membership/sync'
import type { Database } from '@/lib/supabase/types'
import { trackEvent } from '@/lib/analytics/events'
import { isBundlesEnabled } from '@/lib/flags'
import { BUNDLE_CONFIG } from '@/lib/bundles/config'
import { isValidBundleType, isValidKitType, computeBundleDueAt } from '@/lib/bundles/checkout'
import { dispatchKit } from '@/lib/vitall/dispatchKit'
import {
  isFullRefund,
  isPartialRefund,
  CANCELLABLE_DISPATCH_STATUSES,
} from '@/lib/orders/refund'
import type { KitType } from '@/lib/results/types'
import { SITE_URL } from '@/lib/site-url'
import { formatOrderRef } from '@/lib/orders/orderRef'
import { formatLongDate } from '@/lib/date/format'

type UserUpdate = Database['public']['Tables']['users']['Update']

type StripeAddress = {
  line1?: string | null
  line2?: string | null
  city?: string | null
  // Stripe's `state` is the UK county field on Checkout addresses. Vitall's
  // /order/create requires a non-empty county, so we capture and forward it.
  state?: string | null
  postal_code?: string | null
  country?: string | null
}

type ShippingDetails = {
  name?: string | null
  address?: StripeAddress | null
} | null | undefined

type CustomerDetails = {
  email?: string | null
  name?: string | null
  phone?: string | null
  address?: StripeAddress | null
} | null | undefined

function splitName(fullName: string | null | undefined): { first: string | null; last: string | null } {
  if (!fullName) return { first: null, last: null }
  const trimmed = fullName.trim()
  if (!trimmed) return { first: null, last: null }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return { first: parts[0], last: null }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

function buildShippingAddressJson(sd: ShippingDetails) {
  if (!sd?.address) return null
  return {
    name: sd.name ?? null,
    line1: sd.address.line1 ?? null,
    line2: sd.address.line2 ?? null,
    city: sd.address.city ?? null,
    state: sd.address.state ?? null,
    postal_code: sd.address.postal_code ?? null,
    country: sd.address.country ?? null,
  }
}

async function upsertUserProfile(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
  shipping: ShippingDetails,
  customer: CustomerDetails,
  metadata: Record<string, string | undefined>,
) {
  const name = shipping?.name ?? customer?.name ?? null
  const { first, last } = splitName(name)
  const address = shipping?.address ?? customer?.address ?? null
  const phone = customer?.phone ?? null

  const update: UserUpdate = {}

  if (first) update.first_name = first
  if (last) update.last_name = last
  if (phone) update.phone = phone

  if (address) {
    if (address.line1) update.address_line1 = address.line1
    if (address.line2 !== undefined) update.address_line2 = address.line2 ?? null
    if (address.city) update.address_city = address.city
    if (address.state) update.address_county = address.state
    if (address.postal_code) update.address_postal_code = address.postal_code
    if (address.country) update.address_country = address.country
  }

  if (metadata.dob) update.date_of_birth = metadata.dob
  if (metadata.sex === 'male' || metadata.sex === 'female') update.sex = metadata.sex

  if (Object.keys(update).length === 0) return

  const { error } = await supabase.from('users').update(update).eq('id', userId)
  if (error) {
    console.error('[stripe-webhook] Failed to update user profile:', error.message)
  }
}

// Subscription Stripe events only carry the stripe_subscription_id. Map it back
// to our user + product so transactional emails (T-06/07/08) can be addressed
// and personalised.
async function resolveSubscriptionUser(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  stripeSubscriptionId: string,
): Promise<{ userId: string; productSlug: string; cioKey: string | null } | null> {
  // Looks in BOTH memberships and supplement_subscriptions: since 2026-08-26 a
  // membership owns its own row, and these events carry only the Stripe id.
  const owner = await resolveRecurringOwner(supabase, stripeSubscriptionId)

  if (!owner) {
    console.error(
      '[stripe-webhook] Could not resolve user for subscription',
      stripeSubscriptionId,
      'no matching row in memberships or supplement_subscriptions',
    )
    return null
  }
  // CIO is keyed on the EMAIL (canonical identifier), so resolve it from the
  // user id for the T-06/07/08 transactional emails. See lib/customerio/identity.
  const cioKey = await cioKeyForUserId(supabase, owner.userId)
  return { userId: owner.userId, productSlug: owner.productSlug, cioKey }
}

// Stripe amounts are integer minor units (pence). Templates render "£{{ amount }}".
function formatGbp(pence: number | null | undefined): string {
  return ((pence ?? 0) / 100).toFixed(2)
}

// Unix seconds → "15 June 2026" for renewal-date merge fields.
function formatStripeDate(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return ''
  return formatLongDate(unixSeconds * 1000)
}

// Structural view of the Stripe Invoice fields the email payloads need, kept
// independent of the installed SDK's exact type surface (mirrors the loose-cast
// pattern used for checkout sessions below).
type InvoiceFields = {
  amount_paid?: number | null
  amount_due?: number | null
  created?: number | null
  period_end?: number | null
  status_transitions?: { paid_at?: number | null } | null
  lines?: { data?: Array<{ period?: { end?: number | null } | null }> } | null
}

/**
 * Structural views of the Stripe Charge and Dispute fields the refund/dispute
 * handlers read, kept independent of the installed SDK's exact type surface —
 * the same loose-cast pattern used for checkout sessions and invoices above.
 */
type ChargeFields = {
  id: string
  amount: number
  amount_refunded: number
  currency?: string | null
  payment_intent?: string | { id?: string | null } | null
}

type DisputeFields = {
  id: string
  amount: number
  currency?: string | null
  reason?: string | null
  status?: string | null
  charge?: string | { id?: string | null } | null
  payment_intent?: string | { id?: string | null } | null
  evidence_details?: { due_by?: number | null } | null
}

/** Stripe returns an id or the expanded object; we only ever want the id. */
function idOf(ref: string | { id?: string | null } | null | undefined): string | null {
  if (typeof ref === 'string') return ref
  return ref?.id ?? null
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed'
    console.error('[stripe-webhook] Signature verification failed:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Idempotency: Stripe delivers at-least-once and retries. Claim the event id
  // before doing any work; a duplicate delivery is acked without re-emitting
  // (critical for T-07 dunning, which would otherwise re-send on every retry).
  const { error: dedupeError } = await supabase
    .from('processed_stripe_events')
    .insert({ event_id: event.id, event_type: event.type })

  if (dedupeError) {
    if (dedupeError.code === '23505') {
      return NextResponse.json({ received: true, deduped: true })
    }
    // A ledger outage must not silently drop live billing events — log and
    // fall through to process the event.
    console.error('[stripe-webhook] dedupe ledger insert failed:', dedupeError.message)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = (session.metadata ?? {}) as Record<string, string | undefined>
      const { user_id, type, kit_type, product_slug } = metadata

      // 3-case user resolution: logged-in / existing-by-email / new guest
      let resolvedUserId: string | null = user_id ?? null

      const sessionRecordEarly = session as Record<string, unknown> & typeof session
      const customerDetailsForEmail = sessionRecordEarly.customer_details as
        | { email?: string | null }
        | null
        | undefined
      const sessionEmail = session.customer_email ?? customerDetailsForEmail?.email ?? null

      if (!resolvedUserId) {
        const email = sessionEmail
        if (email) {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

          if (existingUser) {
            resolvedUserId = existingUser.id
          } else {
            const { data: created, error: createError } = await supabase.auth.admin.createUser({
              email,
              email_confirm: true,
            })

            if (createError) {
              console.error('[stripe-webhook] Failed to create auth user:', createError.message)
            } else if (created.user) {
              resolvedUserId = created.user.id
              // Seed the Customer.io profile with an email straight away, keyed on
              // the EMAIL (canonical CIO identifier — see lib/customerio/identity),
              // so the guest magic-link email (T-09) and every later lifecycle email
              // has an address to send to. Events alone create an email-less profile.
              await identifyUser(cioKeyFromEmail(email), { email })
              const { data: linkData } = await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email,
              })
              await emitEvent(cioKeyFromEmail(email), {
                name: 'guest_purchase_account_created',
                data: {
                  kit_type,
                  magic_link: linkData?.properties?.action_link ?? '',
                },
              })
            }
          }
        }
      }

      if (!resolvedUserId) {
        console.error('[stripe-webhook] Could not resolve user for session', session.id)
        return NextResponse.json({ received: true })
      }

      const sessionRecord = session as Record<string, unknown> & typeof session
      const shippingDetails = sessionRecord.shipping_details as ShippingDetails
      const customerDetails = sessionRecord.customer_details as CustomerDetails

      // Mirror Stripe-collected PII back to our users record (latest-wins)
      await upsertUserProfile(supabase, resolvedUserId, shippingDetails, customerDetails, metadata)

      // Customer.io is keyed on the EMAIL (canonical identifier — see
      // lib/customerio/identity), so a signup profile and this purchase resolve to
      // ONE profile. Without the email we cannot key or deliver, so the CIO calls
      // below are guarded on it. Push the email (plus name) onto the profile here.
      const cioKey = sessionEmail ? cioKeyFromEmail(sessionEmail) : null
      if (cioKey) {
        const cioName = shippingDetails?.name ?? customerDetails?.name ?? null
        const { first: cioFirst, last: cioLast } = splitName(cioName)
        await identifyUser(cioKey, {
          email: sessionEmail as string,
          ...(cioFirst ? { first_name: cioFirst } : {}),
          ...(cioLast ? { last_name: cioLast } : {}),
        })
      }

      // Record the explicit health-data processing consent given at checkout
      // (Art 9(2)(a)). The kit checkout route forwards the version + timestamp via
      // metadata only when it is newly given. Guarded with `.is(..., null)` so the
      // ORIGINAL consent timestamp is preserved across later purchases (Art 7(1)
      // accountability — the record must point at when consent was first given).
      if (metadata.health_consent_version) {
        const { error: consentError } = await supabase
          .from('users')
          .update({
            health_processing_consent_version: metadata.health_consent_version,
            health_processing_consented_at:
              metadata.health_consented_at ?? new Date().toISOString(),
          })
          .eq('id', resolvedUserId)
          .is('health_processing_consent_version', null)
        if (consentError) {
          console.error('[stripe-webhook] Failed to stamp health-processing consent:', consentError.message)
        }
      }

      if (type === 'kit') {
        type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'
        const validKitTypes: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']
        const resolvedKitType = validKitTypes.includes(kit_type as KitType)
          ? (kit_type as KitType)
          : 'testosterone'

        const shippingAddress = buildShippingAddressJson(shippingDetails)

        const { data: order, error } = await supabase
          .from('kit_orders')
          .insert({
            user_id: resolvedUserId,
            kit_type: resolvedKitType,
            stripe_payment_intent: session.payment_intent as string,
            status: 'paid',
            shipping_address: shippingAddress,
          })
          .select('id, order_seq')
          .single()

        if (error) {
          console.error('[stripe-webhook] Failed to insert kit_orders:', error.message)
        } else {
          if (cioKey) {
            await emitEvent(cioKey, {
              name: 'purchase',
              // formatGbp is REQUIRED: the t01 template renders "£{{ event.amount }}"
              // literally, so passing raw pence printed "Amount: £9900" on every kit
              // order confirmation (found live 2026-08-04). The three sibling events
              // below already format; this one was the outlier.
              //
              // order_ref is what t01 shows the customer ("Order ref: AP-10042").
              // order_id (the UUID) is still emitted because it is the join key for
              // every downstream event and for Vitall's partnerOrderId — it is just
              // no longer the thing a human is asked to read out.
              data: {
                kit_type,
                amount: formatGbp(session.amount_total),
                order_id: order?.id,
                order_ref: formatOrderRef(order?.order_seq),
              },
            })
          }

          // First-party analytics + GA4 mirror (best-effort; never throws)
          await trackEvent('kit_purchase', {
            email: sessionEmail,
            anonymousId: resolvedUserId,
            kitId: kit_type ?? resolvedKitType,
            transactionId: session.id,
            value: session.amount_total != null ? session.amount_total / 100 : null,
            currency: session.currency,
            props: { order_id: order?.id ?? null },
          })

          if (order?.id) {
            await triggerVitallDispatch({
              orderId: order.id,
              kitType: kit_type ?? '',
            })

            // Bundle: schedule the owed second kit. Gated on BUNDLES_ENABLED and
            // the bundle_type metadata the checkout route stamps. The first kit
            // is already inserted + dispatched above; this must NEVER throw or
            // block that, so an invalid SKU is logged and skipped and an insert
            // failure is logged + ops-alerted but the webhook still acks.
            if (metadata.bundle_type && isBundlesEnabled()) {
              await createBundleDispatch(supabase, {
                parentOrderId: order.id,
                userId: resolvedUserId,
                bundleType: metadata.bundle_type,
                secondKitType: metadata.second_kit_type,
              })
            }
          }
        }
      } else if (type === 'subscription') {
        if (!product_slug) {
          console.error('[stripe-webhook] Subscription session missing product_slug metadata', session.id)
          return NextResponse.json({ received: true })
        }
        // A membership owns a row in `memberships`, not in
        // `supplement_subscriptions`: it is not a supplement, and its row
        // carries the retest entitlement date that nothing else has. Everything
        // downstream (the CIO emit, the analytics event, and all three status
        // branches below) is identical for both, which is why only the write
        // target forks here.
        const isMembership = product_slug === MEMBERSHIP_SLUG
        let insertError: string | null = null

        if (isMembership) {
          const membershipId = await createMembership(supabase, {
            userId: resolvedUserId,
            stripeSubscriptionId: session.subscription as string,
          })
          if (!membershipId) insertError = 'membership insert failed'
        } else {
          const { error } = await supabase.from('supplement_subscriptions').insert({
            user_id: resolvedUserId,
            stripe_subscription_id: session.subscription as string,
            product_slug,
            status: 'active',
          })
          insertError = error?.message ?? null
        }

        if (insertError) {
          console.error('[stripe-webhook] Failed to record subscription:', insertError)
          // P7. By the time this runs Stripe has already created and charged
          // the subscription, so a failed insert is a customer paying for a row
          // that does not exist — and nothing downstream refunds or cancels on
          // its own. The likeliest cause is `memberships_one_live_per_user`
          // firing on a second membership the checkout gate did not stop, which
          // is the case a human has to unwind by hand. That is what makes this
          // an alert rather than the log line it used to be.
          await emitOpsAlert({
            name: 'subscription_insert_failed',
            data: {
              user_id: resolvedUserId,
              product_slug,
              stripe_subscription_id: session.subscription as string,
              is_membership: isMembership,
              error: insertError,
            },
          })
        } else {
          if (cioKey) {
            await emitEvent(cioKey, {
              name: 'subscription_started',
              data: { product_name: productName(product_slug), amount: formatGbp(session.amount_total) },
            })
            await identifyUser(cioKey, { active_subscriber: true, active_product_slug: product_slug })
          }
          // First-party analytics + GA4 mirror (best-effort; never throws)
          await trackEvent('supplement_subscribe', {
            anonymousId: resolvedUserId,
            transactionId: session.subscription as string,
            value: session.amount_total != null ? session.amount_total / 100 : null,
            currency: session.currency,
            props: { product_slug },
          })
        }
      }
    } else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object
      const subscriptionId = invoice.parent?.subscription_details?.subscription
      const subscriptionIdStr = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id
      if (subscriptionIdStr) {
        const { error } = await setRecurringStatus(supabase, subscriptionIdStr, 'active')

        if (error) {
          console.error('[stripe-webhook] Failed to update subscription on invoice.payment_succeeded:', error)
        }

        // T-06 Renewal receipt. CIO suppresses this when subscription_started
        // fired within 10 min, so first-invoice double-sends are filtered there.
        const resolved = await resolveSubscriptionUser(supabase, subscriptionIdStr)
        if (resolved?.cioKey) {
          const inv = invoice as unknown as InvoiceFields
          await emitEvent(resolved.cioKey, {
            name: 'invoice_payment_succeeded',
            data: {
              product_name: productName(resolved.productSlug),
              amount: formatGbp(inv.amount_paid),
              renewal_date: formatStripeDate(inv.status_transitions?.paid_at ?? inv.created),
              next_renewal_date: formatStripeDate(
                inv.lines?.data?.[0]?.period?.end ?? inv.period_end,
              ),
            },
          })
        }
      }
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object
      const subscriptionId = invoice.parent?.subscription_details?.subscription
      const subscriptionIdStr = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id
      if (subscriptionIdStr) {
        const { error } = await setRecurringStatus(supabase, subscriptionIdStr, 'past_due')

        if (error) {
          console.error('[stripe-webhook] Failed to mark subscription past_due on invoice.payment_failed:', error)
        }

        // T-07 Failed payment. One emit drives the full 3-stage dunning
        // sequence (immediate / +3d / +7d); the staging and stop-on-success
        // goal are configured in Customer.io, not here.
        const resolved = await resolveSubscriptionUser(supabase, subscriptionIdStr)
        if (resolved?.cioKey) {
          const inv = invoice as unknown as InvoiceFields
          await emitEvent(resolved.cioKey, {
            name: 'invoice_payment_failed',
            data: {
              product_name: productName(resolved.productSlug),
              amount: formatGbp(inv.amount_due),
            },
          })
        }
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object
      const { error } = await setRecurringStatus(supabase, sub.id, 'cancelled')

      if (error) {
        console.error('[stripe-webhook] Failed to update subscription on deletion:', error)
      }

      // T-08 Subscription cancelled. CIO suppresses this when the cancel was
      // the T-07 day-7 final notice (customer already warned).
      const resolved = await resolveSubscriptionUser(supabase, sub.id)
      if (resolved?.cioKey) {
        await emitEvent(resolved.cioKey, {
          name: 'subscription_cancelled',
          data: { product_name: productName(resolved.productSlug) },
        })
      }
    } else if (event.type === 'charge.refunded') {
      await handleChargeRefunded(supabase, event.data.object as unknown as ChargeFields)
    } else if (event.type === 'charge.dispute.created') {
      await handleDisputeCreated(supabase, event.data.object as unknown as DisputeFields)
    }
  } catch (err) {
    console.error('[stripe-webhook] Unhandled error processing event:', err)
  }

  return NextResponse.json({ received: true })
}

/**
 * Dispatch the kit this payment bought.
 *
 * Was a `fetch()` to our own public `/api/vitall/dispatch` until 2026-09-15.
 * That endpoint is gone: it was unauthenticated, service-role-backed, and able
 * to post a physical kit to anyone who knew an order id. Calling the function
 * directly removes the door rather than locking it, and removes a network hop
 * from the money path at the same time — no DNS, no TLS, no proxy, no cold
 * start between a completed payment and the kit it owes.
 *
 * Still swallowing errors, deliberately and unchanged: Stripe retries a webhook
 * that does not return 2xx, and a retry re-enters this handler. The order row is
 * already written by the time this runs, so a dispatch failure must not fail the
 * webhook. `dispatchKit` is idempotent, so a Stripe retry cannot double-post.
 */
async function triggerVitallDispatch({
  orderId,
  kitType,
}: {
  orderId: string
  kitType: string
}) {
  try {
    const outcome = await dispatchKit({ orderId, kitType: kitType as KitType })
    if (!outcome.ok) {
      console.error(
        `[stripe-webhook] Vitall dispatch did not succeed for order ${orderId}:`,
        outcome.status,
        outcome.body,
      )
    }
  } catch (err) {
    console.error('[stripe-webhook] Failed to trigger Vitall dispatch:', err)
  }
}

/**
 * A refund landed on a charge. Record it, stop what it should stop, tell Keith.
 *
 * Added 2026-09-15 (S2-9). Before this, a refund moved the money and nothing
 * else: Stripe was not subscribed to the event, the handler had no branch for
 * it, and `kit_orders.status = 'refunded'` had no writer anywhere in the
 * codebase while the account page already rendered a label for it. Proven on a
 * live £99 order — refunded at 01:20, and eighteen minutes later the app still
 * said `dispatched` with a kit in the post.
 *
 * What it cannot do is un-post that kit. So this is deliberately a RECORD-AND-
 * STOP path, not an unwind: it makes our row agree with Stripe, kills the only
 * future spend still attached to the order (an owed second kit), and hands a
 * human the linkage. Everything already physical stays physical.
 *
 * Refunds here are always merchant-initiated — there is no self-serve refund in
 * the product — so this handler never decides whether a refund was correct. It
 * reports one that has already happened.
 */
async function handleChargeRefunded(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  charge: ChargeFields,
) {
  const paymentIntentId = idOf(charge.payment_intent)
  const full = isFullRefund(charge)
  const partial = isPartialRefund(charge)

  const money = {
    charge_id: charge.id,
    payment_intent: paymentIntentId,
    amount_charged: formatGbp(charge.amount),
    amount_refunded: formatGbp(charge.amount_refunded),
    currency: (charge.currency ?? 'gbp').toUpperCase(),
  }

  // No intent means no way to reach an order. Subscription refunds land here by
  // design: `supplement_subscriptions` and `memberships` key on the
  // subscription id and carry no payment intent, so there is no row to mark.
  // Alert rather than return silently — the money moved either way.
  if (!paymentIntentId) {
    console.error('[stripe-webhook] Refund with no payment_intent:', charge.id)
    await emitOpsAlert({ name: 'refund_unmatched', data: { ...money, reason: 'no_payment_intent' } })
    return
  }

  // `.limit(2)` rather than `.single()`: one row is the expectation (a bundle's
  // second kit carries a NULL payment intent, so the charge maps to exactly one
  // order), but an unexpected duplicate should surface as an alert, not as a
  // thrown PostgREST error inside a webhook that must still return 200.
  const { data: orders, error: lookupError } = await supabase
    .from('kit_orders')
    .select('id, user_id, kit_type, status, order_seq, vitall_order_id')
    .eq('stripe_payment_intent', paymentIntentId)
    .limit(2)

  if (lookupError) {
    console.error('[stripe-webhook] Refund order lookup failed:', lookupError.message)
    await emitOpsAlert({ name: 'refund_unmatched', data: { ...money, reason: 'lookup_failed' } })
    return
  }

  const order = orders?.[0]

  if (!order) {
    console.error('[stripe-webhook] Refund matched no kit order:', paymentIntentId)
    await emitOpsAlert({
      name: 'refund_unmatched',
      // Named separately from the kit case so the alert reads as "probably a
      // subscription refund, check Stripe" rather than "we lost an order".
      data: { ...money, reason: 'no_matching_kit_order' },
    })
    return
  }

  if (orders.length > 1) {
    console.error('[stripe-webhook] Refund matched MULTIPLE kit orders:', paymentIntentId)
    await emitOpsAlert({ name: 'refund_unmatched', data: { ...money, reason: 'multiple_matching_orders' } })
    // Fall through: marking the first is still better than marking none, and the
    // alert carries the intent id so a human can reconcile the rest.
  }

  const customerEmail = await cioKeyForUserId(supabase, order.user_id)
  const context = {
    ...money,
    order_id: order.id,
    order_ref: formatOrderRef(order.order_seq),
    customer_email: customerEmail,
    kit_type: order.kit_type,
    status_before: order.status,
    // The question Keith actually has to answer on reading the alert.
    kit_already_shipped: Boolean(order.vitall_order_id),
  }

  // A partial refund is a supported product behaviour (the separately
  // refundable retest portion of a bundle), not a half-broken full refund. The
  // order is still live, so nothing is marked and nothing is cancelled — the
  // whole response is to tell a human, because only a human knows which portion
  // the money came off.
  if (partial) {
    console.warn(`[stripe-webhook] PARTIAL refund on order ${order.id} — status left at '${order.status}'.`)
    await emitOpsAlert({ name: 'order_partially_refunded', data: context })
    return
  }

  if (!full) {
    // amount_refunded of 0: a refund object was created and then failed or was
    // reversed. Nothing to record, but worth seeing.
    console.warn('[stripe-webhook] charge.refunded with nothing refunded:', charge.id)
    await emitOpsAlert({ name: 'refund_unmatched', data: { ...context, reason: 'zero_amount_refunded' } })
    return
  }

  // Full refund. Mark the order — but never over `data_purged`, which records a
  // GDPR erasure carried out on the lab side and is the only proof in our system
  // that it happened. A refund is recoverable from Stripe at any time; that
  // erasure record is not, so where the two collide the erasure wins and the
  // refund is reported instead. See lib/orders/terminalStatus.ts.
  const { data: updated, error: updateError } = await supabase
    .from('kit_orders')
    .update({ status: 'refunded' })
    .eq('id', order.id)
    .neq('status', 'data_purged')
    .select('id')

  if (updateError) {
    console.error('[stripe-webhook] Failed to mark order refunded:', updateError.message)
    await emitOpsAlert({ name: 'refund_write_failed', data: { ...context, error: updateError.message } })
    return
  }

  const statusWritten = (updated?.length ?? 0) > 0
  if (!statusWritten) {
    console.warn(
      `[stripe-webhook] Order ${order.id} refunded but left at 'data_purged' — erasure record preserved.`,
    )
  }

  // Stop the second kit. A bundle is one payment for two kits, so refunding it
  // takes the money back while the daily sweep carries on toward posting kit two
  // at our cost — the one piece of future spend a refund can still reach.
  let secondKitsStopped = 0
  const { data: cancelled, error: cancelError } = await supabase
    .from('bundle_dispatches')
    .update({ status: 'cancelled' })
    .eq('parent_order_id', order.id)
    .in('status', [...CANCELLABLE_DISPATCH_STATUSES])
    .select('id, kit_type, status')

  if (cancelError) {
    // Not fatal to the refund record, but it IS the money half — alert loudly.
    console.error('[stripe-webhook] Failed to cancel owed second kits:', cancelError.message)
    await emitOpsAlert({
      name: 'refund_second_kit_not_stopped',
      data: { ...context, error: cancelError.message },
    })
  } else {
    secondKitsStopped = cancelled?.length ?? 0
  }

  console.warn(
    `[stripe-webhook] REFUNDED order ${order.id} (${context.order_ref}) — ${money.amount_refunded} ${money.currency}; ` +
      `${secondKitsStopped} owed second kit(s) cancelled; kit already shipped: ${context.kit_already_shipped}.`,
  )

  await emitOpsAlert({
    name: 'order_refunded',
    data: {
      ...context,
      status_written: statusWritten,
      second_kits_stopped: secondKitsStopped,
    },
  })
}

/**
 * A customer disputed a charge (chargeback).
 *
 * Handled alongside refunds because it is the same money leaving by a different
 * door, and the one with a deadline: Stripe holds the amount plus a fee and
 * gives a fixed window to submit evidence. Missing that window is the actual
 * cost, and nothing else in this system would surface it.
 *
 * Deliberately does NOT touch the order. A dispute is not an outcome — the money
 * is held pending, and it may come back. `order_status` has no value for "under
 * dispute", and inventing one out of `refunded` would falsify the record on
 * every dispute we go on to win. So this branch alerts and stops; if the dispute
 * is lost, Stripe emits a refund-shaped event and the handler above records it.
 */
async function handleDisputeCreated(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  dispute: DisputeFields,
) {
  const paymentIntentId = idOf(dispute.payment_intent)

  const base = {
    dispute_id: dispute.id,
    charge_id: idOf(dispute.charge),
    payment_intent: paymentIntentId,
    amount: formatGbp(dispute.amount),
    currency: (dispute.currency ?? 'gbp').toUpperCase(),
    reason: dispute.reason ?? 'unknown',
    dispute_status: dispute.status ?? 'unknown',
    // The deadline. Rendered as a date because "respond by 29 September" is the
    // only part of this alert that changes what anyone does today.
    evidence_due_by: formatStripeDate(dispute.evidence_details?.due_by),
  }

  let context: Record<string, unknown> = base

  if (paymentIntentId) {
    const { data: orders } = await supabase
      .from('kit_orders')
      .select('id, user_id, kit_type, status, order_seq, vitall_order_id')
      .eq('stripe_payment_intent', paymentIntentId)
      .limit(2)

    const order = orders?.[0]
    if (order) {
      context = {
        ...base,
        order_id: order.id,
        order_ref: formatOrderRef(order.order_seq),
        customer_email: await cioKeyForUserId(supabase, order.user_id),
        kit_type: order.kit_type,
        order_status: order.status,
        kit_already_shipped: Boolean(order.vitall_order_id),
      }
    }
  }

  console.error(
    `[stripe-webhook] DISPUTE OPENED ${dispute.id} — ${base.amount} ${base.currency}, reason '${base.reason}', ` +
      `evidence due ${base.evidence_due_by || 'unknown'}. Order NOT modified; respond in Stripe.`,
  )

  await emitOpsAlert({ name: 'charge_disputed', data: context })
}

// Create the bundle_dispatches row that owes the customer their second kit. The
// caller has already inserted + dispatched the FIRST kit, so this must never
// throw: an invalid SKU is logged and skipped, and an insert failure is logged +
// ops-alerted (a human then reconciles) without failing the webhook. Runs inside
// the deduped webhook path (processed_stripe_events claimed above), so a Stripe
// retry never double-inserts.
async function createBundleDispatch(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  {
    parentOrderId,
    userId,
    bundleType,
    secondKitType,
  }: {
    parentOrderId: string
    userId: string
    bundleType: string | undefined
    secondKitType: string | undefined
  },
) {
  if (!isValidBundleType(bundleType)) {
    console.error('[stripe-webhook] Invalid bundle_type, skipping bundle_dispatches:', bundleType)
    return
  }

  // kit_type on the row is the SECOND kit. Trust the metadata when valid, else
  // fall back to the bundle config's secondKitType (always a valid kit_type).
  const resolvedSecondKit = isValidKitType(secondKitType)
    ? secondKitType
    : BUNDLE_CONFIG[bundleType].secondKitType

  // Timed bundles (Prove-It / Full-picture) get due_at = now + ~90d; Confirmation
  // is result-triggered, so due_at stays null until the result hook sets it.
  const dueAt = computeBundleDueAt(bundleType, new Date())

  const { error } = await supabase.from('bundle_dispatches').insert({
    parent_order_id: parentOrderId,
    user_id: userId,
    kit_type: resolvedSecondKit,
    bundle_type: bundleType,
    status: 'scheduled',
    due_at: dueAt,
  })

  if (error) {
    console.error('[stripe-webhook] Failed to insert bundle_dispatches:', error.message)
    await emitOpsAlert({
      name: 'bundle_dispatch_insert_failed',
      data: {
        parent_order_id: parentOrderId,
        user_id: userId,
        bundle_type: bundleType,
        second_kit_type: resolvedSecondKit,
        error: error.message,
      },
    })
  }
}
