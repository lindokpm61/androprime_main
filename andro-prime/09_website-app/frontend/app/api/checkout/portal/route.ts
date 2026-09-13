/**
 * The route to Stripe's hosted billing portal, which is where a customer
 * updates a card or cancels.
 *
 * 🔴 IT USED TO READ ONE TABLE AND IT WAS THE WRONG ONE (fixed 2026-09-13). The
 * lookup queried `supplement_subscriptions` only, and a membership owns a row in
 * `memberships`. Under the 2026-09-07 auto-renew ruling every kit buyer becomes
 * a membership-only customer, so **every one of them 404'd here**, on the route
 * that exists to let him cancel. All three supplement subscriptions are retired,
 * so the table it did read is the one table nobody can hold a live row in: the
 * route was looking in the only place the answer could not be.
 *
 * ⚠ **This is a contract term, not a convenience.** The terms say cancellation
 * is available *"from your account, in the same number of steps it took to
 * join"*, and it is the duty the incoming subscription regime is most explicit
 * about. The lookup is `resolveBillingSubscriptionId`, beside the mirror-image
 * `resolveRecurringOwner` that the webhook uses, so the two directions of one
 * mapping cannot drift apart.
 *
 * ⚠ **NOT GATED ON `MEMBERSHIP_ENABLED`, deliberately.** The display half of
 * this (`/subscriptions`) is gated, because rendering a surface for a product
 * that is off is merely wrong. Blocking a route is not symmetric with that: if
 * the flag were ever turned back off with live members on the books, gating here
 * would trap them in a subscription they cannot cancel. **Refusing to render is
 * cosmetic; refusing to cancel is harmful.**
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { resolveBillingSubscriptionId } from '@/lib/membership/sync'
import * as Sentry from '@sentry/nextjs'

import { urlFor } from '@/lib/hosts'

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedApiUser(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createSupabaseAdminClient()

  const found = await resolveBillingSubscriptionId(supabase, auth.id)

  if (!found) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(found.stripeSubscriptionId)
    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: urlFor('/subscriptions'),
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    // ⚠ A THROW HERE IS A CUSTOMER WHO CANNOT CANCEL, so it is an ops event and
    // not a log line. The likeliest cause is not a bug in this file: Stripe
    // throws from `billingPortal.sessions.create` when the account has no saved
    // portal configuration, which is a dashboard setting rather than a deploy,
    // and it can therefore break without anything shipping.
    Sentry.captureException(err, {
      tags: { area: 'billing', route: 'checkout/portal' },
      extra: { userId: auth.id, source: found.source },
    })
    return NextResponse.json({ error: 'Could not open the billing portal' }, { status: 502 })
  }
}
