/**
 * Membership entitlement rules. PURE: no database, no env, no clock.
 *
 * The one import with behaviour in it is `isFlaggedState`, which is itself a
 * pure predicate over a result state. It is imported rather than restated so
 * that the retest CADENCE and the retest PANEL cannot drift apart on what the
 * word "flagged" means.
 *
 * Every function that needs "now" takes it as an argument, so the whole rule
 * set is drivable from a test table. Same pattern as lib/quiz/wtp.ts,
 * lib/vitall/identity.ts and lib/hosts.ts, and for the same reason: this logic
 * decides whether a real kit gets posted to someone, and it otherwise only ever
 * runs inside a nightly job against live data.
 *
 * THE MODEL, in one line: the retest is not a credit the member owns, it is an
 * entitlement conditional on being an active member on the stated retest date
 * (reframed 2026-08-24). That single sentence is why there is no ledger, no
 * expiry policy, no rollover question and no balance-sheet liability. It also
 * means the active check happens at DISPATCH time, never at sign-up time.
 */

import type { Database } from '@/lib/supabase/types'
import type { ResultState } from '@/lib/results/types'
import { isFlaggedState } from '@/lib/results/resultSeverity'

export type SubscriptionStatus = Database['public']['Enums']['subscription_status']

/**
 * Statuses that mean "currently a member".
 *
 * `past_due` counts deliberately. Stripe marks a subscription past_due while
 * dunning is still running, and the T-07 chain gives the customer three emails
 * to fix a card. Withdrawing the entitlement on the first failed payment would
 * punish an expired card, and Stripe moves the subscription to `cancelled` if
 * dunning ultimately fails, which this list does not include.
 *
 * `incomplete` counts because Stripe uses it between checkout and the first
 * successful payment. It is a few seconds in practice.
 *
 * This list MUST stay in step with the partial unique index
 * `memberships_one_live_per_user` in 20260826_membership_v1.sql. The test
 * asserts the two agree.
 */
export const ACTIVE_MEMBER_STATUSES: readonly SubscriptionStatus[] = [
  'incomplete',
  'trialing',
  'active',
  'past_due',
] as const

export function isActiveStatus(status: SubscriptionStatus | null | undefined): boolean {
  if (!status) return false
  return ACTIVE_MEMBER_STATUSES.includes(status)
}

/**
 * Retest cadence, split by whether the member actually has a number to move
 * (adopted in the membership mockup, 2026-08-25).
 *
 * A member with a flagged marker gets a first-cycle retest at day 90: long
 * enough for vitamin D or B12 to move (8 to 12 weeks), and it is the payoff the
 * whole first cycle is built around. Annual thereafter.
 *
 * An all-clear member goes annual from the start. Retesting a normal panel at
 * 90 days tells him nothing he does not already know, and charging for it would
 * be selling a test we do not think he needs.
 */
export const FIRST_CYCLE_RETEST_DAYS = 90
export const ANNUAL_RETEST_DAYS = 365

/**
 * How long a just-released retest reads as "on its way" (defect 3b, 2026-09-13).
 *
 * Needed because the due date now ROLLS FORWARD on claim. Before, `claimed` was
 * terminal and could sit there forever because nothing came after it. Now the
 * date jumps a year ahead the moment the sweep claims, so without a window the
 * account screen would flip straight from "Due now" to "365 days away" while the
 * kit was still in a jiffy bag, and then, if `claimed` won unconditionally, it
 * would say "On its way" for the following twelve months instead.
 *
 * 14 days covers the real path: the sweep claims, the address-check email goes
 * out, `ADDRESS_CHECK_WINDOW_DAYS` (4) elapses, the kit is ordered and posted.
 * After that he has it, and the useful thing to show him is the countdown to the
 * next one. It is a PRESENTATION boundary and gates nothing that ships a kit.
 */
export const RETEST_IN_FLIGHT_DAYS = 14

const DAY_MS = 24 * 60 * 60 * 1000

function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * DAY_MS)
}

/**
 * When this member's FIRST retest falls due.
 *
 * `hasMarkerToMove` is the member's own result state: true when the results
 * engine flagged at least one marker, false for an all-clear panel. It is a
 * fact about their data, never a guess, so a member with no result yet must not
 * be passed `true`. Use `decideRetestCadence` below to derive it.
 */
export function firstRetestDueAt(startedAt: Date, hasMarkerToMove: boolean): Date {
  return addDays(startedAt, hasMarkerToMove ? FIRST_CYCLE_RETEST_DAYS : ANNUAL_RETEST_DAYS)
}

/* ------------------------------------------------- which cadence, and why */

/**
 * WHAT THE READ OF THE MEMBER'S LATEST RESULT PRODUCED. Four outcomes, and they
 * are deliberately NOT collapsed to a boolean, for the same reason
 * `retestPanel.ts` keeps its three fallback reasons apart: an all-clear panel
 * and an unreadable one both mean "nothing flagged was seen", and only one of
 * them is the rule working.
 */
export type LatestResultOutcome =
  /** The engine ran and these are its verdicts. */
  | { status: 'classified'; states: readonly ResultState[] }
  /** No result row at all. He has nothing to move, and that is not an error. */
  | { status: 'no-result' }
  /** Read failed, or the row had no biomarkers. We do not know, and must say so. */
  | { status: 'unreadable' }

export type RetestCadenceReason = 'flagged' | 'all-clear' | 'no-result' | 'unreadable'

export interface RetestCadenceDecision {
  /** True = the 90-day first cycle. False = annual from the start. */
  hasMarkerToMove: boolean
  reason: RetestCadenceReason
  /** How many markers were flagged. 0 on every path that is not 'flagged'. */
  flaggedCount: number
  /** True when the answer is a fallback rather than a reading of his data. */
  degraded: boolean
}

/**
 * WHICH CADENCE THIS MEMBER GETS, decided by the RESULTS ENGINE rather than by a
 * row count (defect 3a, Keith 2026-09-13: *"point the check at the results
 * engine instead of the row count"*).
 *
 * 🔴 WHAT WAS WRONG. `memberHasMarkerToMove` used to ask whether the member had
 * ANY row in `lab_results`. Joining the membership requires a result, so the
 * answer was always yes and **`ANNUAL_RETEST_DAYS` could never run**: every
 * member got the 90-day retest, all-clear ones included, at our cost. The code
 * argued against itself in its own comment, which said charging an all-clear
 * member for a retest would be *"selling a test we do not think he needs"* while
 * the build posted him exactly that test for nothing.
 *
 * ⚠ THE OLD COMMENT'S REASONING WAS RIGHT AND IS WHY THIS IS NOT SQL. A range
 * check against `reference_low` / `reference_high` would call a man all-clear
 * whenever he sits between OUR action cutoff and the LAB'S interval, and that
 * gap is the entire point of the two-range card. So the verdict has to come from
 * `classify()`, through the same `isFlaggedState` predicate the retest panel
 * rule uses. One definition of "flagged" across both mechanisms.
 *
 * 🔴 THE FAILURE DIRECTION IS UNCHANGED AND STILL FAVOURS THE MEMBER. An
 * unreadable result returns the SOONER retest, because being wrong that way
 * costs us a kit and being wrong the other way withholds the thing he paid for.
 * **But it is now marked `degraded`**, and that is the half that was missing:
 * a silent read error moves a dispatch by 275 days, which is far too large a
 * consequence for a console line nobody reads. The caller raises an ops alert
 * on it.
 *
 * Pure, like everything else in this file: it takes the outcome of the read
 * rather than performing one, so the whole table is drivable from a test.
 */
export function decideRetestCadence(outcome: LatestResultOutcome): RetestCadenceDecision {
  if (outcome.status === 'unreadable') {
    return { hasMarkerToMove: true, reason: 'unreadable', flaggedCount: 0, degraded: true }
  }

  // No result means nothing to move. Annual, and it is a reading rather than a
  // fallback: "he has no numbers yet" is a fact, not a failed lookup.
  if (outcome.status === 'no-result') {
    return { hasMarkerToMove: false, reason: 'no-result', flaggedCount: 0, degraded: false }
  }

  const flaggedCount = outcome.states.filter(isFlaggedState).length
  return {
    hasMarkerToMove: flaggedCount > 0,
    reason: flaggedCount > 0 ? 'flagged' : 'all-clear',
    flaggedCount,
    degraded: false,
  }
}

/** Every retest after the first is annual, regardless of result state. */
export function nextRetestAfter(previousRetestAt: Date): Date {
  return addDays(previousRetestAt, ANNUAL_RETEST_DAYS)
}

/** The shape the entitlement rules need. A subset of the `memberships` row. */
export interface MembershipLike {
  status: SubscriptionStatus | null
  next_retest_due_at: string | null
  retest_claimed_at: string | null
}

export type EntitlementState =
  /** Not a member, or the membership has ended. */
  | { kind: 'none' }
  /** A member, but the retest date has not arrived. */
  | { kind: 'pending'; dueAt: Date; daysRemaining: number }
  /** A member, and the retest is owed right now. */
  | { kind: 'due'; dueAt: Date }
  /** The retest for this cycle has already been dispatched. */
  | { kind: 'claimed'; claimedAt: Date }

/**
 * What this membership is entitled to, as at `now`.
 *
 * 🔴 `claimed` USED TO WIN OVER EVERYTHING, AND THAT WAS DEFECT 3b. It read
 * "this member has ever had a retest" and it was the only gate the sweep had, so
 * one stamp ended the entitlement permanently: GBP 47 a month forever and no
 * second kit, while this file's own screen copy, `/membership` and the year-1
 * forecast all promised one retest per year. Keith, 2026-09-13, took the
 * dispatch-table option: `bundle_dispatches` holds one row per retest and its
 * partial unique index is the double-dispatch guard, which frees the DATE to
 * roll forward and frees this function from having to be the guard.
 *
 * The ordering keeps what that precedence was RIGHT about and drops what it was
 * wrong about:
 *   1. `claimed` still comes first, but only while the kit is genuinely in
 *      flight (`RETEST_IN_FLIGHT_DAYS`). A kit already in the post is a fact
 *      about the world, so it still outranks the status — a man who cancels the
 *      day after his retest ships should be told it is coming, not shown an
 *      empty state. What it no longer does is outrank everything FOREVER.
 *   2. Then the ACTIVE check, because the entitlement is conditional on being
 *      active ON the date. A lapsed member whose date has passed gets nothing.
 *   3. Then the date, which is now the real control: after a claim it sits a
 *      year ahead, so `pending` is reached by arithmetic rather than by a flag.
 *
 * ⚠ THIS FUNCTION NO LONGER PREVENTS A DOUBLE DISPATCH, and must not be relied
 * on to. Two things do: the due date being in the future, and
 * `bundle_dispatches_one_open_per_membership`. The second is the structural one
 * and it was REPAIRED in the same change — its predicate named a status the
 * table has never allowed, so it was guarding one of three open states. See
 * `20260913_membership_retest_rolls_forward.sql`.
 *
 * ⚠ AND THE IN-FLIGHT WINDOW IS NOT A GUARD EITHER. `isRetestDispatchable` only
 * fires on `due`, so nothing here can ship a kit; widening or narrowing the
 * window changes a sentence on a screen and nothing else.
 */
export function entitlementState(m: MembershipLike | null, now: Date): EntitlementState {
  if (!m) return { kind: 'none' }

  // In flight: claimed recently enough that the kit has not reached him yet.
  if (m.retest_claimed_at) {
    const claimedAt = new Date(m.retest_claimed_at)
    if (!Number.isNaN(claimedAt.getTime())) {
      const elapsed = now.getTime() - claimedAt.getTime()
      if (elapsed >= 0 && elapsed <= RETEST_IN_FLIGHT_DAYS * DAY_MS) {
        return { kind: 'claimed', claimedAt }
      }
    }
  }

  if (!isActiveStatus(m.status)) return { kind: 'none' }

  if (!m.next_retest_due_at) return { kind: 'none' }

  const dueAt = new Date(m.next_retest_due_at)
  if (Number.isNaN(dueAt.getTime())) return { kind: 'none' }

  if (dueAt.getTime() <= now.getTime()) return { kind: 'due', dueAt }

  return {
    kind: 'pending',
    dueAt,
    daysRemaining: Math.ceil((dueAt.getTime() - now.getTime()) / DAY_MS),
  }
}

/**
 * The single question the nightly sweep asks. Kept as its own named function so
 * the sweep reads as a rule rather than as a chain of conditions, and so the
 * test can assert it directly.
 */
export function isRetestDispatchable(m: MembershipLike | null, now: Date): boolean {
  return entitlementState(m, now).kind === 'due'
}
