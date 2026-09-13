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
import { liveMembershipFor, refusesSecondMembership } from '@/lib/membership/liveMembership'
import { emitOpsAlert } from '@/lib/customerio/emit'

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

  // The two membership gates, in the order they must be asked. Both are
  // enforced HERE, on the server, because this is where money changes hands:
  // the paywall hides itself in either state, and a hidden control is not a
  // gate. This is a public POST behind auth, so a double submit, a stale tab or
  // a hand-rolled request is the way past anything the UI merely declines to
  // render.
  if (productSlug === MEMBERSHIP_SLUG) {
    const admin = createSupabaseAdminClient()

    // ── P7. HE MAY ALREADY BE A MEMBER, AND THE INDEX FINDS OUT TOO LATE ──
    //
    // `memberships_one_live_per_user` makes a second live row impossible, but
    // it fires on the INSERT, which the Stripe webhook does after Stripe has
    // created and charged the subscription. Reached by an existing member
    // without this check, he pays twice for a row that only exists once.
    // Full reasoning in lib/membership/liveMembership.ts.
    //
    // ⚠ ASKED BEFORE THE OFFER WINDOW, DELIBERATELY. An existing member's
    // window is usually shut, so the other order answers him "order a test to
    // start a new one" — wrong, and expensive advice to give a man who is
    // already paying us. Defect 3e makes the collision likelier rather than
    // rarer: a member who reorders a kit gets a fresh result, which re-opens
    // the window he does not need.
    const live = await liveMembershipFor(admin, auth.id)
    if (refusesSecondMembership(live)) {
      if (live.kind === 'unreadable') {
        // Fail CLOSED, and say so out loud. Turning away a willing buyer
        // because our own table would not read is not a log line: nobody is
        // watching for a sale that silently did not happen.
        console.error('[membership] Could not read memberships before checkout:', live.error)
        await emitOpsAlert({
          name: 'membership_checkout_refused_unreadable',
          data: { user_id: auth.id, error: live.error },
        })
      }
      return NextResponse.json(
        live.kind === 'live'
          ? {
              error: 'You are already a member. Manage your membership from your account.',
              reason: 'already-a-member',
            }
          : {
              error: 'We could not confirm your membership status. Please try again in a moment.',
              reason: 'membership-unreadable',
            },
        { status: 409 },
      )
    }

    // ── THE OFFER WINDOW (Keith, 2026-08-26) ──────────────────────────────
    // A membership may only be joined while the customer has a lab result that
    // came back within the last 30 days.
    //
    // What it stops: buy a kit, decline, wait, subscribe purely to collect an
    // included retest worth more than a couple of payments, cancel. The way back
    // in is another kit at full retail, which produces a result and opens a new
    // window. It also covers rejoining after a cancellation, for the same reason
    // and with no special case.
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
