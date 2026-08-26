import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { urlFor } from '@/lib/hosts'
import { isMembershipEnabled } from '@/lib/flags'
import { purchasableSlugs, stripePriceIdFor } from '@/lib/subscriptions/products'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { MEMBERSHIP_SLUG } from '@/lib/membership/sync'
import { canJoinMembership } from '@/lib/membership/offer'
import { latestResultReceivedAt } from '@/lib/membership/latestResult'

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
  if (!productSlug || !purchasableSlugs().includes(productSlug)) {
    return NextResponse.json({ error: 'Invalid productSlug' }, { status: 400 })
  }

  // The flag gates the SERVER path, not just the UI. A hidden paywall is not a
  // gate: this route is a public POST behind auth, so without this check anyone
  // could subscribe by hand before compliance has read the framing and before
  // the terms exist.
  if (productSlug === MEMBERSHIP_SLUG && !isMembershipEnabled()) {
    return NextResponse.json({ error: 'Invalid productSlug' }, { status: 400 })
  }

  // THE OFFER WINDOW (Keith, 2026-08-26). A membership may only be joined while
  // the customer has a lab result that came back within the last 30 days.
  //
  // Enforced HERE, on the server, because this is where money changes hands. The
  // paywall hides itself outside the window, but a hidden control is not a gate:
  // this is a public POST behind auth, so without this check anyone could join by
  // hand at any time and the whole protection would be decorative.
  //
  // What it stops: buy a kit, decline, wait, subscribe purely to collect an
  // included retest worth more than a couple of payments, cancel. The way back
  // in is another kit at full retail, which produces a result and opens a new
  // window. It also covers rejoining after a cancellation, for the same reason
  // and with no special case.
  if (productSlug === MEMBERSHIP_SLUG) {
    const admin = createSupabaseAdminClient()
    const latestResultAt = await latestResultReceivedAt(admin, auth.id)
    if (!canJoinMembership(latestResultAt, new Date())) {
      return NextResponse.json(
        {
          error:
            'Membership is offered for 30 days after a result comes back. Order a test to start a new one.',
          reason: 'offer-window-closed',
        },
        { status: 409 },
      )
    }
  }

  const priceId = stripePriceIdFor(productSlug)
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
    // Both are app-host paths now, but they are resolved through urlFor rather
    // than hardcoded so they follow lib/hosts.ts if a route ever moves back.
    // {CHECKOUT_SESSION_ID} is a Stripe placeholder, appended after urlFor so
    // the braces are never URL-encoded.
    success_url: `${urlFor('/subscription/confirmed')}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: urlFor('/subscriptions'),
    currency: 'gbp',
  })

  return NextResponse.json({ url: session.url })
}
