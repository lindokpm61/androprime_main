import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedApiUser(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createSupabaseAdminClient()

  const { data: sub } = await supabase
    .from('supplement_subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', auth.id)
    .in('status', ['active', 'trialing', 'past_due', 'incomplete', 'unpaid'])
    .limit(1)
    .single()

  if (!sub?.stripe_subscription_id) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${SITE_URL}/subscriptions`,
  })

  return NextResponse.json({ url: portalSession.url })
}
