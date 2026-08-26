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
import { firstRetestDueAt } from './entitlement'

type Admin = ReturnType<typeof createSupabaseAdminClient>
type SubscriptionStatus = Database['public']['Enums']['subscription_status']

export const MEMBERSHIP_SLUG = 'membership'

/**
 * Does this member have a number worth moving in 90 days?
 *
 * THIS IS A DELIBERATE V1 SIMPLIFICATION AND A NAMED SEAM. The adopted cadence
 * (mockup, 2026-08-25) is: day 90 for a member with a flagged marker, annual
 * from the start for an all-clear member. Deciding that properly is a
 * CLASSIFIER question, not a SQL one: `biomarker_values` stores only value,
 * reference_low and reference_high, and our clinical action cutoff is
 * deliberately STRICTER than the lab reference interval (that gap is the whole
 * point of the two-range card). So "inside the lab range" does not mean
 * all-clear, and a SQL range check would wrongly mark a member all-clear when
 * they sit between our cutoff and the lab's.
 *
 * Until the classifier is wired in here, v1 errs in the MEMBER'S FAVOUR: anyone
 * with a result gets the 90-day first-cycle retest. Someone with no result yet
 * has nothing to move, so they go annual. Being wrong in this direction gives a
 * member a retest sooner than the rule strictly requires, which is a cost we
 * can absorb; being wrong the other way withholds the thing they paid for.
 *
 * To make it exact, replace the body with the classifier's verdict over the
 * member's most recent result. Nothing else needs to change.
 */
export async function memberHasMarkerToMove(
  supabase: Admin,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('lab_results')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (error) {
    console.error('[membership] Could not read lab_results for cadence:', error.message)
    // Same principle: on an unreadable result, give the sooner retest.
    return true
  }

  return (data?.length ?? 0) > 0
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
