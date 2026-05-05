import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import type { Database } from '@/lib/supabase/types'

type UserUpdate = Database['public']['Tables']['users']['Update']

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

type StripeAddress = {
  line1?: string | null
  line2?: string | null
  city?: string | null
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

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = (session.metadata ?? {}) as Record<string, string | undefined>
      const { user_id, type, kit_type, product_slug } = metadata

      // 3-case user resolution: logged-in / existing-by-email / new guest
      let resolvedUserId: string | null = user_id ?? null

      if (!resolvedUserId) {
        const email = session.customer_email
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
        }
      } else if (type === 'deposit') {
        const { error } = await supabase.from('founding_member_deposits').insert({
          user_id: resolvedUserId,
          stripe_payment_intent: session.payment_intent as string,
          status: 'paid',
          paid_at: new Date().toISOString(),
        })

        if (error) {
          console.error('[stripe-webhook] Failed to insert founding_member_deposits:', error.message)
        } else {
          await emitEvent(resolvedUserId, {
            name: 'founding_member_deposit',
            data: { amount: session.amount_total },
          })
          await identifyUser(resolvedUserId, { is_founding_member: true })
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
