import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedApiUser(request)
  if (auth instanceof NextResponse) return auth

  const priceId = process.env.STRIPE_PRICE_FOUNDING_MEMBER
  if (!priceId) {
    return NextResponse.json({ error: 'Founding member price ID is not configured' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: auth.email ?? undefined,
    metadata: {
      user_id: auth.id,
      type: 'deposit',
    },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/founding-member-status?checkout=success`,
    cancel_url: `${SITE_URL}/founding-member`,
    currency: 'gbp',
  })

  return NextResponse.json({ url: session.url })
}
