/**
 * Branch 3 of defect 3d, at the database: when a member's SELF-BOUGHT kit
 * produces a result, his retest entitlement resets around that result instead
 * of running to a date anchored to an older checkout.
 *
 * The rule itself is pure and lives in `earlyRetest.ts` (`resetRetestDueAt`,
 * including the clamp that stops this from ever hastening a retest). This file
 * is only the read, the guard and the write.
 *
 * ⚠ IT MOVES A DATE AND NOTHING ELSE. It never claims, never inserts a
 * dispatch, never touches `retest_claimed_at`. The entitlement is not consumed
 * — that was the option Keith explicitly rejected, because a member who pays
 * full retail and silently loses something he already owned is worse off than
 * under the original defect.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { decideRetestCadence, firstRetestDueAt, type LatestResultOutcome } from './entitlement'
import { resetRetestDueAt } from './earlyRetest'
import { latestClassifiedResult } from './latestResult'

type Admin = SupabaseClient<Database>

/**
 * Did the customer PAY for this kit, or was it posted to him against something
 * he already held?
 *
 * `stripe_payment_intent` is the discriminator and it needs no migration: the
 * checkout webhook stamps it on every kit somebody bought, and the dispatch
 * path (`lib/bundles/dispatch.ts`) inserts its kit_orders row with no payment
 * intent at all, because at that moment nobody is paying. So an included
 * retest, and a bundle's second kit, both read as unpaid — which is correct,
 * and is what keeps this hook off the included retest's own result.
 *
 * 🔴 IF THAT EVER STOPS BEING TRUE THIS HOOK MISFIRES SILENTLY, and the failure
 * is invisible: a member's retest date would quietly slide a cycle every time
 * his included retest came back. The test asserts the dispatch path's insert
 * omits the column, so the assumption fails loudly rather than in production.
 */
async function wasPaidFor(supabase: Admin, orderId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('kit_orders')
    .select('stripe_payment_intent')
    .eq('id', orderId)
    .maybeSingle()

  if (error) {
    // Fail CLOSED: do not reset. Leaving the date alone restores exactly the
    // pre-3d behaviour for this one order, which a human can correct. Resetting
    // on a bad read could push a real retest out by a year.
    console.error('[membership-clock] Could not read the order for a clock reset:', error.message)
    return false
  }

  return Boolean(data?.stripe_payment_intent)
}

/**
 * Reset the member's retest clock after a paid result, if all of this holds:
 * he is a member, the entitlement has a future date, and he paid for this kit.
 *
 * Returns a short reason string for the log. Never throws: the caller wraps it
 * too, but results are the customer's paid deliverable and a membership bug
 * must never break result processing.
 */
export async function resetMembershipClockOnPaidResult(
  supabase: Admin,
  userId: string,
  orderId: string,
  now: Date,
): Promise<string> {
  if (!(await wasPaidFor(supabase, orderId))) return 'not-a-paid-kit'

  const { data: membership, error } = await supabase
    .from('memberships')
    .select('id, status, next_retest_due_at, retest_claimed_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[membership-clock] Could not read the membership:', error.message)
    return 'membership-read-failed'
  }
  if (!membership?.next_retest_due_at) return 'no-entitlement'

  // ⚠ A retest already released is NOT reset. `retest_claimed_at` inside the
  // in-flight window means a kit is physically in the post and the sweep has
  // already rolled the date forward a year; moving it again here would double-
  // move it. Checkout declines a sale in that state anyway ('hold-in-flight'),
  // so reaching this is the edge case of a kit bought BEFORE the claim.
  const currentDueAt = new Date(membership.next_retest_due_at)

  // The cadence for the result that just landed. `latestClassifiedResult` reads
  // the most recent result, which at this point in processResult is the one
  // being processed. It classifies rather than reading a stored verdict, for
  // the reason its own header gives.
  const latest = await latestClassifiedResult(supabase, userId)
  const outcome: LatestResultOutcome = latest
    ? { status: 'classified', states: latest.markers.map((m) => m.state) }
    : { status: 'unreadable' }

  const cadence = decideRetestCadence(outcome)

  // An unreadable read must not move a real date. decideRetestCadence returns
  // the SOONER cadence for 'unreadable' because that failure direction favours
  // the member when a date is being CREATED; here it would shorten an existing
  // entitlement, so the same value means the opposite thing and is refused.
  if (cadence.degraded) {
    console.warn('[membership-clock] Degraded result read for user', userId, '- date left alone')
    return 'degraded-read'
  }

  const reset = resetRetestDueAt(currentDueAt, firstRetestDueAt(now, cadence.hasMarkerToMove))
  if (!reset || !reset.moved) return 'kept-standing-date'

  // Compare-and-set on the old date, the same guard the sweep's claim uses: if
  // anything moved this membership between the read and the write, this updates
  // no rows rather than overwriting it.
  const { data: updated, error: updateError } = await supabase
    .from('memberships')
    .update({ next_retest_due_at: reset.dueAt.toISOString() })
    .eq('id', membership.id)
    .eq('next_retest_due_at', membership.next_retest_due_at)
    .select('id')

  if (updateError) {
    console.error('[membership-clock] Failed to reset the retest date:', updateError.message)
    return 'update-failed'
  }
  if (!updated || updated.length === 0) return 'raced'

  console.log(
    '[membership-clock] Reset retest for membership', membership.id,
    'from', membership.next_retest_due_at,
    'to', reset.dueAt.toISOString(),
    `(${cadence.reason}, ${cadence.flaggedCount} flagged, paid order ${orderId})`,
  )
  return 'reset'
}
