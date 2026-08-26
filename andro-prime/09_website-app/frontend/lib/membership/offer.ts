/**
 * WHEN the membership may be offered. PURE: no database, no env, no clock.
 *
 * THE RULE, in one line (Keith, 2026-08-26): a customer may join the membership
 * only while he has a lab result that came back within the last 30 days.
 *
 * That single sentence does all the work, and it is worth seeing why, because
 * the obvious alternative is four separate rules that have to be kept in step:
 *
 *   - A new customer's window opens when his first result lands.
 *   - Decline it, and the window closes. The way back in is another kit at full
 *     retail, which produces a new result, which opens a new window.
 *   - A cancelled member rejoining needs a recent result too, so he cannot
 *     cycle: subscribe, claim, cancel, wait, resubscribe.
 *   - Nothing carries over on rejoining. A rejoiner is a new membership with a
 *     new start date and a new retest date.
 *
 * All four are the same rule looked at from different sides.
 *
 * WHAT IT PROTECTS. The failure it exists to prevent is a man buying a kit,
 * declining, waiting, then subscribing purely to collect an included retest
 * worth more than a couple of payments, and cancelling. The entitlement date
 * already blunts that — the earliest retest is 90 days, which is three payments
 * in — but this closes it: you cannot subscribe at all unless you have just
 * paid full retail for a kit.
 *
 * WHAT IT DOES NOT GOVERN. This is a gate on JOINING, never on STAYING. An
 * existing member whose last result is a year old is still a member; his window
 * is irrelevant until he cancels. Nothing here can end a membership.
 */

/** How long the offer stays open after a result lands. */
export const MEMBERSHIP_OFFER_WINDOW_DAYS = 30

const DAY_MS = 24 * 60 * 60 * 1000

export type OfferState =
  /**
   * No result has ever come back, so there is nothing to offer against. The
   * membership sells a dated retest and an interpretation of a number; both are
   * meaningless without a baseline.
   */
  | { kind: 'no-result' }
  /** Inside the window. The only state in which a membership may be bought. */
  | { kind: 'open'; closesAt: Date; daysRemaining: number }
  /** The window has passed. Another kit at full retail opens a new one. */
  | { kind: 'closed'; closedAt: Date }

/**
 * Where this customer stands, as at `now`.
 *
 * `latestResultAt` is the most recent `lab_results.received_at` — when the
 * result came BACK, not when the sample was taken. The window is about how long
 * ago he learned something, not how long ago he bled.
 */
export function offerState(latestResultAt: Date | null, now: Date): OfferState {
  if (!latestResultAt || Number.isNaN(latestResultAt.getTime())) {
    return { kind: 'no-result' }
  }

  const closesAt = new Date(latestResultAt.getTime() + MEMBERSHIP_OFFER_WINDOW_DAYS * DAY_MS)

  if (closesAt.getTime() <= now.getTime()) {
    return { kind: 'closed', closedAt: closesAt }
  }

  return {
    kind: 'open',
    closesAt,
    daysRemaining: Math.ceil((closesAt.getTime() - now.getTime()) / DAY_MS),
  }
}

/**
 * The single question the checkout route asks before taking money.
 *
 * Named separately so the route reads as a rule rather than as a chain of
 * conditions, and so the test can assert it directly — the same shape as
 * `isRetestDispatchable` in ./entitlement.ts.
 */
export function canJoinMembership(latestResultAt: Date | null, now: Date): boolean {
  return offerState(latestResultAt, now).kind === 'open'
}
