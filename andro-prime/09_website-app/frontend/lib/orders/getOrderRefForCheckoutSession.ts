import { stripe } from '@/lib/stripe/client'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { formatOrderRef } from './orderRef'

/**
 * The customer-facing reference for the order a Stripe Checkout session paid for.
 *
 * Resolved through the payment intent rather than "the customer's most recent
 * order", so a repeat buyer landing on /order/confirmed is never shown the
 * reference of a previous purchase.
 *
 * The retry loop is the same race `app/auth/post-checkout/route.ts` documents:
 * Stripe redirects the customer here immediately, but the row is inserted by the
 * webhook, asynchronously. Three attempts covers the observed webhook latency;
 * beyond that we return null and the page falls back to pointing at the
 * confirmation email rather than blocking the render.
 */

const LOOKUP_ATTEMPTS = 3
const LOOKUP_DELAY_MS = 800

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getOrderRefForCheckoutSession(
  sessionId: string | undefined,
): Promise<string | null> {
  if (!sessionId || !isSupabaseConfigured()) return null

  let paymentIntentId: string | null = null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null
  } catch (err) {
    console.error('[order-confirmed] Failed to retrieve Stripe session:', err)
    return null
  }

  if (!paymentIntentId) return null

  const supabase = await createSupabaseServerClient()

  for (let attempt = 1; attempt <= LOOKUP_ATTEMPTS; attempt += 1) {
    const { data, error } = await supabase
      .from('kit_orders')
      .select('order_seq')
      .eq('stripe_payment_intent', paymentIntentId)
      .maybeSingle()

    if (error) {
      console.error('[order-confirmed] kit_orders lookup failed:', error.message)
      return null
    }

    if (data) return formatOrderRef(data.order_seq)

    if (attempt < LOOKUP_ATTEMPTS) await sleep(LOOKUP_DELAY_MS)
  }

  console.warn(
    `[order-confirmed] No kit_orders row for payment intent ${paymentIntentId} after ${LOOKUP_ATTEMPTS} attempts`,
  )
  return null
}
