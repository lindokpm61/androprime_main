import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://androprime.co.uk'

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
      const { user_id, type, kit_type, product_slug } = session.metadata ?? {}

      if (!user_id) {
        console.error('[stripe-webhook] Missing user_id in session metadata', session.id)
        return NextResponse.json({ received: true })
      }

      if (type === 'kit') {
        type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'
        const validKitTypes: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']
        const resolvedKitType = validKitTypes.includes(kit_type as KitType)
          ? (kit_type as KitType)
          : 'testosterone'

        const { data: order, error } = await supabase
          .from('kit_orders')
          .insert({
            user_id,
            kit_type: resolvedKitType,
            stripe_payment_intent: session.payment_intent as string,
            status: 'paid',
          })
          .select('id')
          .single()

        if (error) {
          console.error('[stripe-webhook] Failed to insert kit_orders:', error.message)
        } else {
          await emitEvent(user_id, {
            name: 'purchase',
            data: { kit_type, amount: session.amount_total, order_id: order?.id },
          })

          // Trigger Thriva dispatch
          if (order?.id) {
            await triggerThrivaDispatch({
              orderId: order.id,
              kitType: kit_type ?? '',
              userEmail: session.customer_email ?? '',
              siteUrl: SITE_URL,
            })
          }
        }
      } else if (type === 'subscription') {
        const { error } = await supabase.from('supplement_subscriptions').insert({
          user_id,
          stripe_subscription_id: session.subscription as string,
          product_slug,
          status: 'active',
        })

        if (error) {
          console.error('[stripe-webhook] Failed to insert supplement_subscriptions:', error.message)
        } else {
          await emitEvent(user_id, {
            name: 'subscription_started',
            data: { product_slug, amount: session.amount_total },
          })
          await identifyUser(user_id, { active_subscriber: true, active_product_slug: product_slug })
        }
      } else if (type === 'deposit') {
        const { error } = await supabase.from('founding_member_deposits').insert({
          user_id,
          stripe_payment_intent: session.payment_intent as string,
          status: 'paid',
          paid_at: new Date().toISOString(),
        })

        if (error) {
          console.error('[stripe-webhook] Failed to insert founding_member_deposits:', error.message)
        } else {
          await emitEvent(user_id, {
            name: 'founding_member_deposit',
            data: { amount: session.amount_total },
          })
          await identifyUser(user_id, { is_founding_member: true })
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

async function triggerThrivaDispatch({
  orderId,
  kitType,
  userEmail,
  siteUrl,
}: {
  orderId: string
  kitType: string
  userEmail: string
  siteUrl: string
}) {
  try {
    await fetch(`${siteUrl}/api/thriva/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, kitType, userEmail }),
    })
  } catch (err) {
    console.error('[stripe-webhook] Failed to trigger Thriva dispatch:', err)
  }
}
