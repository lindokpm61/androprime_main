import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { productName } from '@/lib/subscriptions/products'
import type { Database } from '@/lib/supabase/types'
import { trackEvent } from '@/lib/analytics/events'

type UserUpdate = Database['public']['Tables']['users']['Update']

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

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
): Promise<{ userId: string; productSlug: string } | null> {
  const { data, error } = await supabase
    .from('supplement_subscriptions')
    .select('user_id, product_slug')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .single()

  if (error || !data) {
    console.error(
      '[stripe-webhook] Could not resolve user for subscription',
      stripeSubscriptionId,
      error?.message ?? 'no matching row',
    )
    return null
  }
  return { userId: data.user_id, productSlug: data.product_slug }
}

// Stripe amounts are integer minor units (pence). Templates render "£{{ amount }}".
function formatGbp(pence: number | null | undefined): string {
  return ((pence ?? 0) / 100).toFixed(2)
}

// Unix seconds → "15 June 2026" for renewal-date merge fields.
function formatStripeDate(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return ''
  return new Date(unixSeconds * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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
              const { data: linkData } = await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email,
              })
              await emitEvent(resolvedUserId, {
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
          .select('id')
          .single()

        if (error) {
          console.error('[stripe-webhook] Failed to insert kit_orders:', error.message)
        } else {
          await emitEvent(resolvedUserId, {
            name: 'purchase',
            data: { kit_type, amount: session.amount_total, order_id: order?.id },
          })

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
              siteUrl: SITE_URL,
            })
          }
        }
      } else if (type === 'subscription') {
        if (!product_slug) {
          console.error('[stripe-webhook] Subscription session missing product_slug metadata', session.id)
          return NextResponse.json({ received: true })
        }
        const { error } = await supabase.from('supplement_subscriptions').insert({
          user_id: resolvedUserId,
          stripe_subscription_id: session.subscription as string,
          product_slug,
          status: 'active',
        })

        if (error) {
          console.error('[stripe-webhook] Failed to insert supplement_subscriptions:', error.message)
        } else {
          await emitEvent(resolvedUserId, {
            name: 'subscription_started',
            data: { product_slug, amount: session.amount_total },
          })
          await identifyUser(resolvedUserId, { active_subscriber: true, active_product_slug: product_slug })
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
        const { error } = await supabase
          .from('supplement_subscriptions')
          .update({ status: 'active' })
          .eq('stripe_subscription_id', subscriptionIdStr)

        if (error) {
          console.error('[stripe-webhook] Failed to update subscription on invoice.payment_succeeded:', error.message)
        }

        // T-06 Renewal receipt. CIO suppresses this when subscription_started
        // fired within 10 min, so first-invoice double-sends are filtered there.
        const resolved = await resolveSubscriptionUser(supabase, subscriptionIdStr)
        if (resolved) {
          const inv = invoice as unknown as InvoiceFields
          await emitEvent(resolved.userId, {
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
        const { error } = await supabase
          .from('supplement_subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionIdStr)

        if (error) {
          console.error('[stripe-webhook] Failed to mark subscription past_due on invoice.payment_failed:', error.message)
        }

        // T-07 Failed payment. One emit drives the full 3-stage dunning
        // sequence (immediate / +3d / +7d); the staging and stop-on-success
        // goal are configured in Customer.io, not here.
        const resolved = await resolveSubscriptionUser(supabase, subscriptionIdStr)
        if (resolved) {
          const inv = invoice as unknown as InvoiceFields
          await emitEvent(resolved.userId, {
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
      const { error } = await supabase
        .from('supplement_subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id)

      if (error) {
        console.error('[stripe-webhook] Failed to update subscription on deletion:', error.message)
      }

      // T-08 Subscription cancelled. CIO suppresses this when the cancel was
      // the T-07 day-7 final notice (customer already warned).
      const resolved = await resolveSubscriptionUser(supabase, sub.id)
      if (resolved) {
        await emitEvent(resolved.userId, {
          name: 'subscription_cancelled',
          data: { product_name: productName(resolved.productSlug) },
        })
      }
    }
  } catch (err) {
    console.error('[stripe-webhook] Unhandled error processing event:', err)
  }

  return NextResponse.json({ received: true })
}

async function triggerVitallDispatch({
  orderId,
  kitType,
  siteUrl,
}: {
  orderId: string
  kitType: string
  siteUrl: string
}) {
  try {
    await fetch(`${siteUrl}/api/vitall/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, kitType }),
    })
  } catch (err) {
    console.error('[stripe-webhook] Failed to trigger Vitall dispatch:', err)
  }
}
