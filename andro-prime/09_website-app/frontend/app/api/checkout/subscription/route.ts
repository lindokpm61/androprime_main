import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'

const SUB_PRICE_IDS: Record<string, string | undefined> = {
  'daily-stack': process.env.STRIPE_PRICE_DAILY_STACK,
  collagen: process.env.STRIPE_PRICE_COLLAGEN,
  'complete-mens-stack': process.env.STRIPE_PRICE_COMPLETE_STACK,
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedApiUser(request)
  if (auth instanceof NextResponse) return auth

  let body: { productSlug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { productSlug } = body
  if (!productSlug || !(productSlug in SUB_PRICE_IDS)) {
    return NextResponse.json({ error: 'Invalid productSlug' }, { status: 400 })
  }

  const priceId = SUB_PRICE_IDS[productSlug]
  if (!priceId) {
    return NextResponse.json({ error: `Price ID for ${productSlug} is not configured` }, { status: 400 })
  }

  // FirstPromoter referral attribution. The `_fprom_tid` cookie is set
  // client-side by fpr.js when the visitor lands on a `?fpr=<code>` URL;
  // we forward it through Stripe metadata so the Stripe webhook can call
  // FirstPromoter's /track/sale on `checkout.session.completed` with the
  // right tid. Absent cookie = organic purchase, nothing to attribute.
  const metadata: Record<string, string> = {
    user_id: auth.id,
    product_slug: productSlug,
    type: 'subscription',
  }
  const fpTid = request.cookies.get('_fprom_tid')?.value
  if (fpTid) metadata.fp_tid = fpTid

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: auth.email ?? undefined,
    metadata,
    line_items: [{ price: priceId, quantity: 1 }],
    shipping_address_collection: { allowed_countries: ['GB'] },
    phone_number_collection: { enabled: true },
    billing_address_collection: 'required',
    success_url: `${SITE_URL}/subscription/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/subscriptions`,
    currency: 'gbp',
  })

  return NextResponse.json({ url: session.url })
}
