/**
 * Does this customer ALREADY hold a live membership?
 *
 * One question, asked in one place: the subscription checkout route, before it
 * calls Stripe. It exists because of defect P7.
 *
 * ── WHY A LOOKUP, WHEN THE DATABASE ALREADY FORBIDS THIS ──────────────────
 * `memberships_one_live_per_user` is a partial unique index over exactly the
 * four statuses that mean "currently a member", so a second live row is
 * genuinely impossible. **That protects the DATABASE, not the CARD.** The index
 * fires on the insert, and the insert is done by the Stripe webhook, which runs
 * AFTER Stripe has created and charged the subscription. A data-integrity
 * guarantee was being read as a commercial one. Without this lookup the whole
 * failure is one `console.error`: no refund, no cancellation of the
 * subscription Stripe just made, no alert, and a man paying every month for a
 * row that does not exist.
 *
 * ── THE STATUS LIST IS THE INDEX'S, AND MUST STAY THAT WAY ────────────────
 * This function's job is to PREDICT the insert, so it has to describe the same
 * set of rows the index does — `ACTIVE_MEMBER_STATUSES`, imported rather than
 * retyped. `PORTAL_MANAGEABLE_STATUSES` is one status wider (`unpaid`, whose
 * dunning has finished and failed); using it here would refuse a man the index
 * would have admitted, which is a different bug pointing the other way.
 *
 * ── AND IT DOES NOT SKIP SEEDED ROWS ──────────────────────────────────────
 * `resolveBillingSubscriptionId` filters `sub_dev_…` ids, because Stripe cannot
 * retrieve a fixture subscription and the attempt reaches the customer as a
 * 500. The index has no such opinion: a seeded row occupies the slot exactly
 * like a real one. So a check that skipped fixtures would wave through the one
 * account whose second subscription is CERTAIN to fail on insert. The two
 * filters answer different questions and only one of them is about Stripe.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { ACTIVE_MEMBER_STATUSES, type SubscriptionStatus } from './entitlement'

export type LiveMembershipCheck =
  /** No live row. The only state in which a membership may be bought. */
  | { kind: 'none' }
  /** He is already a member. Refuse, and send him to his account. */
  | { kind: 'live'; status: SubscriptionStatus }
  /**
   * The table would not read, so we do not know. Kept SEPARATE from `none`
   * deliberately: collapsing them would reinstate P7 on any transient database
   * error, which is the quietest possible way to lose the protection.
   */
  | { kind: 'unreadable'; error: string }

/**
 * THE RULE, assertable without a database: a checkout proceeds only when we can
 * see that he holds no live membership.
 *
 * Fails CLOSED, and the asymmetry is the reason. Refusing a willing buyer costs
 * him a retry and us a delayed sale. Admitting one we cannot see costs a second
 * card charge that no row records and nothing reverses. Only one of those two
 * mistakes is recoverable by the person who made it.
 */
export function refusesSecondMembership(check: LiveMembershipCheck): boolean {
  return check.kind !== 'none'
}

/**
 * The IO half. Works with the service-role client, which is what the checkout
 * route holds: the row being looked for belongs to the caller, but the answer
 * has to be trustworthy even if RLS is later narrowed, and an explicit
 * `user_id` filter is what makes it correct under the admin client.
 */
export async function liveMembershipFor(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<LiveMembershipCheck> {
  const { data, error } = await supabase
    .from('memberships')
    .select('status')
    .eq('user_id', userId)
    .in('status', [...ACTIVE_MEMBER_STATUSES])
    .limit(1)
    .maybeSingle()

  if (error) return { kind: 'unreadable', error: error.message }
  if (!data) return { kind: 'none' }
  return { kind: 'live', status: data.status as SubscriptionStatus }
}
