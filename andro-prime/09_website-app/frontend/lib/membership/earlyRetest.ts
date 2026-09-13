/**
 * What a member's KIT PURCHASE should do about the retest he already holds.
 * PURE: no database, no env, no clock. Defect 3d.
 *
 * ── THE DECISION (Keith, 2026-09-13) ──────────────────────────────────────
 * *"The fix belongs in checkout, not in the nightly job."*
 *
 * The defect was never the missing "retest now" button. It was what the only
 * available workaround did: a member who wanted his retest early had to buy
 * another kit at full price, and **that purchase did not consume the
 * entitlement**. The sweep still fired on the original date and posted a
 * SECOND physical kit. He paid twice, received two kits, and the included one
 * arrived long after he had stopped needing it.
 *
 * The tempting fix — have the nightly job notice the self-bought kit and
 * quietly swallow the entitlement — is WORSE than the defect, because he pays
 * full retail and silently loses something he already owned. So the check
 * happens BEFORE the money: check what he holds, then decide whether to sell.
 *
 * ── WHY THIS FILE SHIPS NOTHING ───────────────────────────────────────────
 * ⚠ Nothing here posts a kit, and nothing here may be made to. The nightly
 * sweep remains the ONLY code path that turns a database row into real
 * postage, which is the same principle A2 is about: one belt, in one place,
 * testable. `'dispatch-held'` does not dispatch — it DECLINES THE SALE, and
 * the kit he is owed goes out on the sweep's next run, because his due date
 * has already passed and he is therefore already in its selection.
 *
 * Pure and clock-injected like everything in `entitlement.ts`, and for the
 * same reason: it decides whether money is taken and whether a kit is posted,
 * and it otherwise only runs inside a request against live data.
 */

import { entitlementState, type MembershipLike } from './entitlement'

/**
 * WHETHER A RESULT STATE MAY PULL A RETEST DATE FORWARD.
 *
 * 🔴 THIS IS THE HALF THAT IS NOT DECIDED, AND IT IS EWA'S, NOT KEITH'S.
 * Deciding checkout over the nightly job did not settle it and was never going
 * to. The question is clinical: which result states justify re-measuring
 * sooner than the standing cadence. That is the result-driven cadence table
 * (`2026-09-06-result-driven-retest-cadence.md`), section 7 of the retest
 * mechanism map, and it is the whole of what is left of 3d.
 *
 * It is modelled as a RULING rather than a boolean so the unruled state is a
 * value the tests can drive, not an absence. The day the table lands, its
 * lookup produces `{ ruled: true, permitted }` and no logic below changes.
 *
 * ⚠ Until then every caller passes `UNRULED`, and the fall-through is
 * DELIBERATE and conservative: an unruled member is sold the kit and has his
 * clock reset, which never moves a date nobody has ruled on, and still closes
 * the half of 3d that costs real postage. Failing the other way — guessing an
 * interval — would be the software inventing a clinical position.
 */
export type EarlyReleaseRuling =
  | { ruled: false }
  | { ruled: true; permitted: boolean }

export const UNRULED: EarlyReleaseRuling = { ruled: false }

/**
 * FOUR OUTCOMES, DELIBERATELY NOT COLLAPSED TO "can he buy?".
 *
 * Same discipline as `decideRetestCadence` and `selectRetestPanel`: the
 * caller needs to know WHICH rule fired, because two of these decline the sale
 * for different reasons and say different things to the customer.
 */
export type EarlyRetestAction =
  /** Not a member, or no live entitlement. An ordinary kit purchase. */
  | 'sell'
  /**
   * Branch 1. His retest is ALREADY DUE. Sell him nothing: he owns this kit
   * and the sweep posts it on its next run. Taking his money here is charging
   * him full retail for a thing that is hours away from being sent to him.
   */
  | 'dispatch-held'
  /**
   * Branch 1's neighbour, and NOT part of what Keith decided — flagged in the
   * report as an extension for him to confirm. The retest has already been
   * claimed and the kit is physically in flight. Selling now produces exactly
   * the two-kits-in-a-fortnight outcome 3d exists to stop, except it is
   * unrecoverable because that kit is already in the post. Declining is the
   * safer error: a lost sale is fixable by a support email, a duplicate kit is
   * not.
   */
  | 'hold-in-flight'
  /** Branch 2. Ewa's table permits going early: move the date, no charge. */
  | 'bring-forward'
  /**
   * Branch 3. Let him buy, and have the PAID RESULT reset the clock rather
   * than run alongside it. Without the reset the sweep still fires on the old
   * date and the duplicate returns by a different route.
   */
  | 'sell-and-reset'

export interface EarlyRetestDecision {
  action: EarlyRetestAction
  /** The date his entitlement currently sits on, when he has one. */
  dueAt: Date | null
  /**
   * True when the outcome is the unruled fall-through rather than a rule
   * firing. Lets the caller log the cases the cadence table would have caught,
   * so there is a number for how often branch 2 would have been used before
   * anyone is asked to rule on it.
   */
  fellThrough: boolean
}

/**
 * THE ONE QUESTION CHECKOUT ASKS BEFORE TAKING A MEMBER'S MONEY.
 *
 * Ordering matters and is asserted in the tests:
 *   1. `claimed` first, because a kit in the post is a fact about the world
 *      and outranks every date arithmetic below it.
 *   2. `due` next: he owns it, it is owed now, decline.
 *   3. `pending` last, where the ruling decides between branches 2 and 3.
 *
 * A non-member, a lapsed member and a member with no date all reach `'sell'`
 * through `entitlementState`'s `'none'`, so this function never has to restate
 * the active-status rule and cannot drift from it.
 */
export function decideKitPurchase(
  membership: MembershipLike | null,
  now: Date,
  ruling: EarlyReleaseRuling = UNRULED,
): EarlyRetestDecision {
  const state = entitlementState(membership, now)

  switch (state.kind) {
    case 'none':
      return { action: 'sell', dueAt: null, fellThrough: false }

    case 'claimed':
      return { action: 'hold-in-flight', dueAt: null, fellThrough: false }

    case 'due':
      return { action: 'dispatch-held', dueAt: state.dueAt, fellThrough: false }

    case 'pending': {
      if (ruling.ruled && ruling.permitted) {
        return { action: 'bring-forward', dueAt: state.dueAt, fellThrough: false }
      }
      // Ruled and NOT permitted is a real answer, so it is not a fall-through.
      // Unruled is, and the flag is the difference.
      return { action: 'sell-and-reset', dueAt: state.dueAt, fellThrough: !ruling.ruled }
    }
  }
}

/** The sale is declined for these, and for no others. */
export function declinesSale(action: EarlyRetestAction): boolean {
  return action === 'dispatch-held' || action === 'hold-in-flight'
}

/* ------------------------------------------- branch 3: resetting the clock */

export interface ClockReset {
  /** Where the entitlement should now sit. */
  dueAt: Date
  /** False when the standing date already sat later and was kept. */
  moved: boolean
}

/**
 * WHERE A MEMBER'S RETEST DATE SITS AFTER HE PAID FOR A KIT HIMSELF.
 *
 * Branch 3 in one function. He bought his own kit, its result has landed, and
 * the entitlement must RESET around that result rather than keep running to a
 * date anchored to a checkout months earlier. Without this the sweep still
 * fires on the old date and the duplicate kit 3d is about returns by a
 * different route — the purchase would have been allowed and nothing would
 * have consumed anything.
 *
 * The new date is the ordinary cadence applied to the new result: day 90 if it
 * flagged something, annual if it did not. No new interval is invented.
 *
 * 🔴 THE CLAMP IS THE WHOLE SAFETY ARGUMENT, AND IT IS WHY THIS IS NOT BRANCH 2.
 * The reset may only ever push the date LATER. Consider an all-clear member on
 * the annual cadence who buys a kit at day 10 and flags something: the cadence
 * rule alone would put his retest at day 100, which is 265 days EARLIER than
 * the date he was on. That is pulling a retest forward on the strength of a
 * result state, which is exactly the question Ewa has not ruled on. Doing it
 * here would implement branch 2 by the back door, using a clinical interval
 * nobody has approved for this mechanism.
 *
 * So a computed date earlier than the standing one is DISCARDED and the
 * standing date is kept. The rule can delay a retest, never hasten one. When
 * the cadence table lands, hastening becomes `'bring-forward'` above, where it
 * belongs and where a ruling governs it.
 *
 * Returns null when there is no standing date to move, which means he has no
 * live entitlement and there is nothing here to reset.
 */
export function resetRetestDueAt(
  currentDueAt: Date | null,
  nextDueAtFromResult: Date,
): ClockReset | null {
  if (!currentDueAt || Number.isNaN(currentDueAt.getTime())) return null
  if (Number.isNaN(nextDueAtFromResult.getTime())) return null

  if (nextDueAtFromResult.getTime() <= currentDueAt.getTime()) {
    return { dueAt: currentDueAt, moved: false }
  }

  return { dueAt: nextDueAtFromResult, moved: true }
}
