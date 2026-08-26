/**
 * Membership entitlement rules. PURE: no database, no env, no clock.
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
 * be passed `true`.
 */
export function firstRetestDueAt(startedAt: Date, hasMarkerToMove: boolean): Date {
  return addDays(startedAt, hasMarkerToMove ? FIRST_CYCLE_RETEST_DAYS : ANNUAL_RETEST_DAYS)
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
 * Order of checks matters and is deliberate:
 *   1. `claimed` wins over everything, so a replayed webhook or a double sweep
 *      run can never dispatch a second kit. That is real postage and a real
 *      kit, not a bookkeeping error.
 *   2. Then the ACTIVE check, because the entitlement is conditional on being
 *      active ON the date. A lapsed member whose date has passed gets nothing,
 *      which is the whole point of the reframing.
 *   3. Only then the date comparison.
 */
export function entitlementState(m: MembershipLike | null, now: Date): EntitlementState {
  if (!m) return { kind: 'none' }

  if (m.retest_claimed_at) {
    return { kind: 'claimed', claimedAt: new Date(m.retest_claimed_at) }
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
