import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { stripePriceIdFor } from '@/lib/subscriptions/products'
import { MEMBERSHIP_INCLUDED_DAYS } from '@/lib/membership/disclosure'
import { MEMBERSHIP_SLUG, createMembership } from '@/lib/membership/sync'
import { ACTIVE_MEMBER_STATUSES } from '@/lib/membership/entitlement'
import { BORDERLINE_T_FLOOR } from '@/lib/results/classifier'

type Admin = SupabaseClient<Database>

/**
 * THE MECHANIC BEHIND THE SENTENCE. Start the membership when the first result
 * LANDS, with the included days as a Stripe trial, so day 31 charges by itself.
 *
 * ── WHY THIS EXISTS: TWO PRE-FLIGHT FINDINGS THAT TURN OUT TO BE ONE ──────
 * The independent compliance pass of 2026-09-17 returned:
 *
 *   H1 — `MEMBERSHIP_ENABLED` gates the COPY and not the MECHANIC.
 *        `app/api/checkout/kit/route.ts` is `mode: 'payment'` with no
 *        `subscription_data` and no `trial_period_days` in BOTH flag states, so
 *        flipping the flag renders *"on day 31 that card is charged £47 a month"*
 *        in front of a checkout that creates no subscription at all.
 *   H3 — the start date is true to the ruling and false to the build.
 *        `createMembership` stamped `started_at` at checkout completion, while
 *        `2026-09-07-anchor-everything-to-the-result.md` rules that every date
 *        anchors to the result landing, and the homepage now ASSERTS that.
 *
 * 🔴 THE OBVIOUS FIX FOR H1 WOULD HAVE MADE H3 PERMANENT. Turning the kit
 * checkout into `mode: 'subscription'` with `trial_period_days: 30` is the
 * textbook Stripe shape and it starts the clock at CHECKOUT, which is exactly
 * the anchor the ruling overturned. A man whose kit sits in a drawer for two
 * weeks would burn half his included month before seeing a number, and day 31
 * would count from a card charge rather than from his result.
 *
 * So the kit checkout stays `mode: 'payment'` and does one new thing: it SAVES
 * the card (`setup_future_usage: 'off_session'`). The subscription is created
 * here, later, when the result lands. One design satisfies both findings, and
 * it is the one the ruling implies rather than a compromise between them.
 *
 * ── WHAT THE CUSTOMER EXPERIENCES ─────────────────────────────────────────
 * He pays once for the kit, and the card is kept on file with a mandate taken
 * at that moment. Nothing recurring exists yet. When his result lands, the
 * membership begins with `MEMBERSHIP_INCLUDED_DAYS` of Stripe trial, and the
 * first charge falls on day 31 counted from the result. That is the sentence on
 * `/kits`, the three landing pages and the homepage, kept by real code.
 *
 * ⚠ THE INCLUDED DAYS ARE `MEMBERSHIP_INCLUDED_DAYS`, NOT A TYPED 30. Same
 * constant the disclosure line and `subscriptionCopy.ts` render from, so the
 * trial length cannot drift from the promise. If the ruling changes the window,
 * the copy and the mechanic move together or neither moves.
 *
 * ── EVERY GUARD FAILS CLOSED, AND THE ORDER IS DELIBERATE ─────────────────
 * Not starting a membership is a recoverable state a human can correct.
 * Charging a man who should not have been charged is not. So every branch below
 * returns a reason rather than throwing, the caller never lets a failure here
 * touch the customer's result, and the Stripe subscription is created BEFORE
 * the row: if the row insert then fails we cancel the subscription we just
 * made, because an orphaned `memberships` row is a free entitlement and an
 * orphaned Stripe subscription is an unannounced charge.
 */

export type StartOutcome =
  | { started: true; membershipId: string; stripeSubscriptionId: string }
  | { started: false; reason: StartRefusal }

/**
 * The Stripe surface this module touches, and the only reason it is named.
 *
 * Every guard below fails CLOSED, which means the interesting behaviour is all
 * in the refusals and in the compensating cancel — none of which can be
 * exercised against the real client. A seam with a default is the whole cost of
 * making five money-path branches testable, and `scripts/test-membership-start.ts`
 * is what it buys. Callers in the app pass nothing and get the real client.
 */
export interface StripeSeam {
  paymentIntents: { retrieve: (id: string) => Promise<Stripe.PaymentIntent> }
  subscriptions: {
    create: (args: Stripe.SubscriptionCreateParams) => Promise<{ id: string }>
    cancel: (id: string) => Promise<unknown>
  }
}

export type StartRefusal =
  | 'flag-off'
  | 'low-t-routes-to-gp'
  | 'no-price-configured'
  | 'already-a-member'
  | 'kit-was-not-paid-for'
  | 'no-saved-card'
  | 'stripe-failed'
  | 'insert-failed'

/**
 * 🔴 THE PAID-KIT DISCRIMINATOR, AND IT IS THE GUARD THAT MATTERS MOST.
 *
 * `kit_orders.stripe_payment_intent` is stamped by the checkout webhook on every
 * kit somebody bought. `lib/bundles/dispatch.ts` inserts its row with no payment
 * intent at all, because at that moment nobody is paying. So an INCLUDED RETEST
 * and a bundle's second kit both read as unpaid.
 *
 * That is the whole reason a member's own included retest cannot start a second
 * membership when it comes back. `lib/membership/clockReset.ts` relies on the
 * same column for the same reason and documents the same hazard: if the dispatch
 * path ever starts stamping a payment intent, BOTH hooks misfire silently.
 */
async function paidOrderPaymentIntent(supabase: Admin, orderId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('kit_orders')
    .select('stripe_payment_intent')
    .eq('id', orderId)
    .maybeSingle()

  if (error) {
    // Fail closed. A bad read must never be treated as a purchase.
    console.error('[membership-start] Could not read the order:', error.message)
    return null
  }
  return data?.stripe_payment_intent ?? null
}

/** Does this man already hold a membership we would be duplicating? */
async function alreadyAMember(supabase: Admin, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', userId)
    .in('status', [...ACTIVE_MEMBER_STATUSES])
    .limit(1)

  // Fail closed: an unreadable membership table means we do not create another.
  // `memberships_one_live_per_user` would reject the insert anyway, but that
  // would happen AFTER the Stripe subscription existed, which is the expensive
  // order to find out in.
  if (error) {
    console.error('[membership-start] Could not read memberships:', error.message)
    return true
  }
  return (data?.length ?? 0) > 0
}

/**
 * Start the membership for a result that has just landed.
 *
 * `asOf` is the result-landing moment and becomes `started_at`, which is what
 * closes H3: every downstream date, including `next_retest_due_at` and the day
 * the card is charged, counts from here rather than from the checkout.
 */
export async function startMembershipOnResult(
  supabase: Admin,
  userId: string,
  orderId: string,
  asOf: Date,
  /** This panel's testosterone reading, or null where the kit does not measure it. */
  testosteroneValue: number | null,
  deps: { stripe: StripeSeam } = { stripe: stripe as unknown as StripeSeam },
): Promise<StartOutcome> {
  /* 🔴 A RESULT UNDER 12 nmol/L STARTS NO MEMBERSHIP. FIRST GUARD, AND IT IS
     THE ONLY ONE HERE THAT IS ABOUT THE CUSTOMER RATHER THAN ABOUT THE PLUMBING.

     Keith, 2026-09-17: *"If he gets a low result, he goes to his GP, and that's
     the end of the story."* A confirmed testosterone under 12 routes to a GP
     referral with no upsell (Ewa, CA-014, 2026-06-04), and this rule says the
     same man also does not become a member. He is a GP case, not a monitoring
     case, and running a wellness cadence alongside a GP is the Phase-0 boundary
     problem rather than a service.

     ── WHY IT IS THIS AND NOT A COUPON ──────────────────────────────────────
     The alternative considered was emailing him a reduced-price recheck. It is
     forbidden by `04_products/results-engine/`
     `2026-09-07-fast-recheck-must-be-prepaid-or-included.md`, ADOPTED, Keith's
     own: *"A recheck triggered by a result, falling less than 90 days after that
     result, must be prepaid or included in an entitlement the customer already
     holds. It may never trigger a new sale."* A coupon meets all three
     conditions. The rule permits exactly two doors, prepaid or included, and
     included loses GBP 20.47 a head: GBP 96.53 net against two kits at GBP 58.50,
     with the man free to cancel on day 29 having never paid a penny of the GBP 47.

     ── WHAT THIS IS WORTH, AND IT IS THE REASON THE GUARD IS HERE AT ALL ────
     Kit 1 contribution stays at GBP 38.02 instead of turning to -GBP 20.47. It
     fixes that by NOT giving away an included month to a man who was always
     going to cancel before the first charge.

     ⚠ NULL IS NOT LOW. A kit that does not measure testosterone (energy-recovery)
     yields null and enrols normally. Never infer low T from Kit 2's energy and
     recovery markers: that inference is its own named red-flag in
     `03_compliance/CONTEXT.md`, and CA-014 forbids it explicitly.

     ⚠ THE THRESHOLD IS IMPORTED, NEVER TYPED. `BORDERLINE_T_FLOOR` is the same
     constant the classifier and the GP-referral routing read, so the boundary
     Ewa signed cannot drift between the referral and this. 12 or above, including
     borderline 12 to under 15, enrols normally. */
  if (testosteroneValue !== null && testosteroneValue < BORDERLINE_T_FLOOR) {
    return { started: false, reason: 'low-t-routes-to-gp' }
  }

  const priceId = stripePriceIdFor(MEMBERSHIP_SLUG)
  if (!priceId) {
    // Named rather than silent: `STRIPE_PRICE_MEMBERSHIP` unset is the most
    // likely reason the flag is on and nothing happens, and it is listed as an
    // open item on the go-live plan.
    console.error('[membership-start] STRIPE_PRICE_MEMBERSHIP is not set; no membership started.')
    return { started: false, reason: 'no-price-configured' }
  }

  if (await alreadyAMember(supabase, userId)) {
    return { started: false, reason: 'already-a-member' }
  }

  const paymentIntentId = await paidOrderPaymentIntent(supabase, orderId)
  if (!paymentIntentId) {
    return { started: false, reason: 'kit-was-not-paid-for' }
  }

  let customerId: string
  let paymentMethodId: string
  try {
    const pi = await deps.stripe.paymentIntents.retrieve(paymentIntentId)
    const customer = typeof pi.customer === 'string' ? pi.customer : pi.customer?.id
    const pm = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
    // Both are required. A kit bought before the checkout started saving cards
    // has neither, and that customer must simply not be enrolled rather than be
    // enrolled without a way to charge him.
    if (!customer || !pm) {
      console.error('[membership-start] Paid kit has no saved card; no membership started.')
      return { started: false, reason: 'no-saved-card' }
    }
    customerId = customer
    paymentMethodId = pm
  } catch (err) {
    console.error('[membership-start] Could not read the payment intent:', (err as Error).message)
    return { started: false, reason: 'stripe-failed' }
  }

  let stripeSubscriptionId: string
  try {
    const sub = await deps.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: MEMBERSHIP_INCLUDED_DAYS,
      default_payment_method: paymentMethodId,
      // At the end of the included days, charge the saved card. `pause` would
      // quietly leave a man a member without paying, which is neither what the
      // copy says nor what the model assumes.
      trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
      metadata: { product_slug: MEMBERSHIP_SLUG, started_from_order: orderId },
    })
    stripeSubscriptionId = sub.id
  } catch (err) {
    console.error('[membership-start] Stripe refused the subscription:', (err as Error).message)
    return { started: false, reason: 'stripe-failed' }
  }

  const membershipId = await createMembership(supabase, {
    userId,
    stripeSubscriptionId,
    startedAt: asOf,
  })

  if (!membershipId) {
    /* 🔴 THE COMPENSATING CANCEL. The subscription exists and the row does not,
       so nothing in this product knows the man is a member while Stripe is
       preparing to charge him on day 31. That is the one outcome here that
       reaches a customer as money, so it is undone immediately and loudly. */
    try {
      await deps.stripe.subscriptions.cancel(stripeSubscriptionId)
      console.error(
        `[membership-start] Row insert failed; cancelled orphan subscription ${stripeSubscriptionId}.`,
      )
    } catch (err) {
      console.error(
        `[membership-start] 🔴 ORPHAN SUBSCRIPTION ${stripeSubscriptionId} could not be cancelled ` +
          `and WILL charge on day ${MEMBERSHIP_INCLUDED_DAYS + 1}: ${(err as Error).message}`,
      )
    }
    return { started: false, reason: 'insert-failed' }
  }

  return { started: true, membershipId, stripeSubscriptionId }
}
