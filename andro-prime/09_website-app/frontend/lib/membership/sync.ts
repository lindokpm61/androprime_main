/**
 * Where a recurring Stripe subscription's state gets written.
 *
 * Two tables now own recurring rows: `memberships` (the membership) and
 * `supplement_subscriptions` (everything else). The Stripe webhook's four
 * lifecycle branches must not care which, so they go through here.
 *
 * Deliberately NOT solved by writing a row to both tables. That would put the
 * status in two places, and a duplicated fact is invisible exactly while the
 * copies agree. One row, one owner, one lookup.
 */

import type { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import * as Sentry from '@sentry/nextjs'
import {
  decideRetestCadence,
  firstRetestDueAt,
  type LatestResultOutcome,
} from './entitlement'
import { latestClassifiedResult } from './latestResult'
import { isDevSubscriptionId } from './testAccounts'

type Admin = ReturnType<typeof createSupabaseAdminClient>
type SubscriptionStatus = Database['public']['Enums']['subscription_status']

export const MEMBERSHIP_SLUG = 'membership'

/**
 * Does this member have a number worth moving in 90 days?
 *
 * 🟢 THE SEAM THIS FILE NAMED IS NOW CLOSED (defect 3a, Keith 2026-09-13:
 * *"point the check at the results engine instead of the row count"*). The v1
 * body asked whether the member had ANY row in `lab_results`. Joining requires
 * a result, so the answer was always yes, `ANNUAL_RETEST_DAYS` could never run,
 * and every all-clear member was posted a 90-day retest at our cost. Its own
 * comment said charging for that would be *"selling a test we do not think he
 * needs"*, while the build gave him exactly that test for nothing.
 *
 * ⚠ THE V1 COMMENT'S REASONING WAS RIGHT AND IS PRESERVED IN THE FIX. It is a
 * CLASSIFIER question and not a SQL one: `biomarker_values` stores only value,
 * reference_low and reference_high, and our action cutoff is deliberately
 * stricter than the lab interval. A SQL range check would call a man all-clear
 * whenever he sits in that gap, which is the whole point of the two-range card.
 * So the verdict comes from `classify()`, via `latestClassifiedResult` and the
 * same `isFlaggedState` predicate `retestPanel.ts` uses.
 *
 * 🔴 THE RULE ITSELF IS PURE AND LIVES IN `entitlement.ts`. This function is the
 * IO half: read, map the read to an outcome, hand it to `decideRetestCadence`,
 * and alert if the answer was a fallback rather than a reading.
 *
 * ⚠ `latestClassifiedResult` RETURNS NULL FOR TWO DIFFERENT THINGS, and this is
 * the one place the difference matters. For the retest PANEL both collapse
 * safely to "send the kit he bought". Here they do not: "no result" is an
 * honest annual, and "could not read it" is a 275-day swing on a silent error.
 * So the cheap existence probe runs first to tell them apart. Two small queries,
 * once per membership creation, is the right price for not moving a dispatch by
 * nine months without saying so.
 */
export async function memberHasMarkerToMove(
  supabase: Admin,
  userId: string,
): Promise<boolean> {
  const outcome = await readLatestResultOutcome(supabase, userId)
  const decision = decideRetestCadence(outcome)

  if (decision.degraded) {
    // An ops alert rather than a console line, because the consequence is a
    // dispatch moved by ANNUAL_RETEST_DAYS - FIRST_CYCLE_RETEST_DAYS = 275 days,
    // in silence, for a member who paid for the sooner one.
    Sentry.captureMessage('[membership] retest cadence fell back: latest result unreadable', {
      level: 'error',
      tags: { area: 'membership', defect: '3a' },
      extra: { userId, reason: decision.reason },
    })
  }

  console.log(
    '[membership] cadence for', userId,
    '->', decision.hasMarkerToMove ? 'day 90' : 'annual',
    `(${decision.reason}, ${decision.flaggedCount} flagged)`,
  )

  return decision.hasMarkerToMove
}

/**
 * The read, mapped onto the pure rule's input.
 *
 * The existence probe is deliberately the FIRST query and deliberately tiny: it
 * is the only thing that can distinguish a member who has no result from one
 * whose result would not load. `latestClassifiedResult` cannot, because it
 * returns null for a read error, for no row, and for a row with no biomarkers.
 */
async function readLatestResultOutcome(
  supabase: Admin,
  userId: string,
): Promise<LatestResultOutcome> {
  const { data, error } = await supabase
    .from('lab_results')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (error) {
    console.error('[membership] Could not read lab_results for cadence:', error.message)
    return { status: 'unreadable' }
  }
  if ((data?.length ?? 0) === 0) return { status: 'no-result' }

  // He has a result, so from here a null is a FAILURE to read it, never an
  // absence of one. That is what makes the two branches separable at all.
  const latest = await latestClassifiedResult(supabase, userId)
  if (!latest) return { status: 'unreadable' }

  return { status: 'classified', states: latest.markers.map((m) => m.state) }
}

/**
 * Create the membership row for a completed checkout, stamping the entitlement
 * date. Returns the row id, or null if the insert failed.
 */
export async function createMembership(
  supabase: Admin,
  args: { userId: string; stripeSubscriptionId: string; startedAt?: Date },
): Promise<string | null> {
  const startedAt = args.startedAt ?? new Date()
  const hasMarker = await memberHasMarkerToMove(supabase, args.userId)

  const { data, error } = await supabase
    .from('memberships')
    .insert({
      user_id: args.userId,
      stripe_subscription_id: args.stripeSubscriptionId,
      status: 'active',
      started_at: startedAt.toISOString(),
      next_retest_due_at: firstRetestDueAt(startedAt, hasMarker).toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    console.error('[membership] Failed to insert membership:', error.message)
    return null
  }
  return data?.id ?? null
}

/** True when this Stripe subscription is a membership rather than a supplement. */
export async function isMembershipSubscription(
  supabase: Admin,
  stripeSubscriptionId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('memberships')
    .select('id')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .maybeSingle()
  return Boolean(data)
}

/**
 * Set the status on whichever table owns this subscription.
 *
 * Checks `memberships` first and falls through to `supplement_subscriptions`,
 * so every existing supplement subscription keeps behaving exactly as it did.
 */
export async function setRecurringStatus(
  supabase: Admin,
  stripeSubscriptionId: string,
  status: SubscriptionStatus,
): Promise<{ table: 'memberships' | 'supplement_subscriptions'; error: string | null }> {
  if (await isMembershipSubscription(supabase, stripeSubscriptionId)) {
    const patch: Database['public']['Tables']['memberships']['Update'] = { status }
    // Record WHEN it ended, so "was this member active on the retest date" is
    // answerable after the fact rather than only in the present tense.
    if (status === 'cancelled' || status === 'unpaid') {
      patch.cancelled_at = new Date().toISOString()
    }
    const { error } = await supabase
      .from('memberships')
      .update(patch)
      .eq('stripe_subscription_id', stripeSubscriptionId)
    return { table: 'memberships', error: error?.message ?? null }
  }

  const { error } = await supabase
    .from('supplement_subscriptions')
    .update({ status })
    .eq('stripe_subscription_id', stripeSubscriptionId)
  return { table: 'supplement_subscriptions', error: error?.message ?? null }
}

/**
 * Map a Stripe subscription id back to our user + product slug, looking in both
 * tables. Subscription events carry only the Stripe id, and the transactional
 * emails (T-06/07/08) need an addressee.
 */
export async function resolveRecurringOwner(
  supabase: Admin,
  stripeSubscriptionId: string,
): Promise<{ userId: string; productSlug: string } | null> {
  const { data: mem } = await supabase
    .from('memberships')
    .select('user_id')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .maybeSingle()

  if (mem) return { userId: mem.user_id, productSlug: MEMBERSHIP_SLUG }

  const { data: sub } = await supabase
    .from('supplement_subscriptions')
    .select('user_id, product_slug')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .maybeSingle()

  if (sub) return { userId: sub.user_id, productSlug: sub.product_slug }

  return null
}

/**
 * Statuses whose subscription a customer may still MANAGE. Deliberately wider
 * than `ACTIVE_MEMBER_STATUSES`, and the difference is the point.
 *
 * 🔴 `unpaid` IS HERE AND IS NOT AN ENTITLEMENT STATUS. Those two lists answer
 * different questions. `ACTIVE_MEMBER_STATUSES` asks *"does this man get a
 * retest?"*, and a man whose dunning has run out does not. This list asks *"may
 * this man reach his billing?"*, and **he is the single customer who most needs
 * to**: his card has died and his only routes back are updating it or
 * cancelling cleanly. Reusing the entitlement list here would lock the portal
 * against exactly the person it exists for, and it would do it silently.
 *
 * `cancelled` is excluded because there is nothing left to manage. Note that a
 * customer who cancels at period end stays `active` in Stripe until the period
 * ends, so he keeps portal access for the whole of the time he has paid for,
 * which is what the terms promise him.
 */
export const PORTAL_MANAGEABLE_STATUSES: readonly SubscriptionStatus[] = [
  'incomplete',
  'trialing',
  'active',
  'past_due',
  'unpaid',
] as const

/**
 * The MIRROR of `resolveRecurringOwner`: user id → the Stripe subscription to
 * manage. Same two tables, same "one row, one owner, one lookup" rule, opposite
 * direction.
 *
 * ── THE DEFECT THIS CLOSES ────────────────────────────────────────────────
 * `app/api/checkout/portal/route.ts` queried `supplement_subscriptions` alone,
 * and a membership owns a row in `memberships`. Under the 2026-09-07 auto-renew
 * ruling every kit buyer becomes a membership-only customer, so **every one of
 * them 404'd on the route that exists to let him cancel.** All three supplement
 * subscriptions are retired, so the table the route did read is one nobody can
 * have a live row in: it was looking in the only place the answer could not be.
 *
 * ⚠ **This is the mechanism behind a contract promise, not a convenience.** The
 * terms say cancellation is available *"from your account, in the same number
 * of steps it took to join"*, and Stripe's portal is what makes that true.
 *
 * ── WHY MEMBERSHIP IS ASKED FIRST ─────────────────────────────────────────
 * `memberships_one_live_per_user` is a partial unique index over the four live
 * statuses, so there can be at most one membership row to find and the order
 * cannot hide a second answer. Supplements have no such guarantee, which is why
 * that half takes the most recent and not an arbitrary one.
 *
 * ⚠ **A FIXTURE'S SUBSCRIPTION ID DOES NOT EXIST IN STRIPE.** `seedMember.ts`
 * writes `sub_dev_…` deliberately, *"so nothing can mistake it for a real
 * subscription"*. Handing one to `subscriptions.retrieve` throws, which reaches
 * the customer as a 500 rather than as the "no subscription" it actually is, so
 * it is filtered here beside every other rule about what is manageable rather
 * than left for the route to remember.
 */
export async function resolveBillingSubscriptionId(
  supabase: Admin,
  userId: string,
): Promise<{ stripeSubscriptionId: string; source: 'membership' | 'supplement' } | null> {
  const statuses = [...PORTAL_MANAGEABLE_STATUSES]

  const { data: mem } = await supabase
    .from('memberships')
    .select('stripe_subscription_id, status')
    .eq('user_id', userId)
    .in('status', statuses)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (mem?.stripe_subscription_id && !isDevSubscriptionId(mem.stripe_subscription_id)) {
    return { stripeSubscriptionId: mem.stripe_subscription_id, source: 'membership' }
  }

  const { data: sub } = await supabase
    .from('supplement_subscriptions')
    .select('stripe_subscription_id, status')
    .eq('user_id', userId)
    .in('status', statuses)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (sub?.stripe_subscription_id && !isDevSubscriptionId(sub.stripe_subscription_id)) {
    return { stripeSubscriptionId: sub.stripe_subscription_id, source: 'supplement' }
  }

  return null
}
