import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getCurrentUser } from '@/lib/auth/session'

const KIT_PRICE_IDS: Record<string, string | undefined> = {
  testosterone: process.env.STRIPE_PRICE_KIT_1,
  'energy-recovery': process.env.STRIPE_PRICE_KIT_2,
  'hormone-recovery': process.env.STRIPE_PRICE_KIT_3,
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  let body: { kitType?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { kitType } = body
  if (!kitType || !(kitType in KIT_PRICE_IDS)) {
    return NextResponse.json({ error: 'Invalid kitType' }, { status: 400 })
  }

  const priceId = KIT_PRICE_IDS[kitType]
  if (!priceId) {
    return NextResponse.json({ error: `Price ID for ${kitType} is not configured` }, { status: 400 })
  }

  const metadata: Record<string, string> = { kit_type: kitType, type: 'kit' }
  if (user) metadata.user_id = user.id

  // Guests can't access /account (protected route) — send them to /kits with a success flag instead
  const successPath = user ? '/account?checkout=success' : '/kits?checkout=success'

  let session
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user?.email ?? undefined,
      metadata,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}${successPath}`,
      cancel_url: `${SITE_URL}/kits`,
      currency: 'gbp',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('[checkout/kit]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
