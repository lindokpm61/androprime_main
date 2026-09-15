/**
 * WHAT A RESULT SAYS ABOUT TESTING AGAIN, held separately from what it SELLS.
 * PURE: no database, no env, no clock. Defect 3f.
 *
 * ── THE DEFECT ────────────────────────────────────────────────────────────
 * `CTAS.retestReminder` is attached in three places in `classifier.ts`:
 * `optimal-testosterone`, the three SHBG states, and the closing `normal`
 * fallback. Every one of those is a result with **nothing to sell against**.
 * A man whose testosterone came back low or equivocal gets `CTAS.gpReferral`
 * instead, correctly, per CA-014 — and therefore **no retest prompt at all,
 * anywhere in the product**. The email that would otherwise catch him stamps
 * only on a whole-result all-clear.
 *
 * So the man most likely to need a second test is the one we never invite to
 * take one. **This is not a bug in either rule.** CA-014 is right that a
 * GP-routed result must carry no upsell, and the retest CTA is right to be a
 * sales control. It is a gap between two rules that are each correct.
 *
 * ── THE FIX, AND WHY IT IS SHAPED LIKE THIS ───────────────────────────────
 * Separate the INFORMATION from the OFFER. "Retest in 6-12 months" is today a
 * call to action, which is a sales control, so it inherited the ban on selling
 * to a GP-routed man — and the information went with it. A result can owe a
 * man guidance about re-measuring without owing him a product.
 *
 * 🔴 THE WORDS ARE NOT OURS AND ARE NOT HERE. What a flagged or GP-routed
 * result should SAY about retesting is a clinical question reserved to Ewa
 * (Owed row 9). Her answer may legitimately be *"his GP decides the interval,
 * not us"*, which is cheaper than a date and may be what she prefers. So this
 * module decides only WHICH OF THREE KINDS of guidance a state is owed, and
 * deliberately carries **no customer-facing sentence for the owed cases**. It
 * is the socket, not the plug.
 *
 * ── DERIVED FROM THE BADGE, NEVER LISTED AGAIN ────────────────────────────
 * The verdict comes from `badgeFor(state)`, the same source `isFlaggedState`
 * uses. `resultSeverity.ts` exists precisely because a second list of "which
 * states mean something is wrong" is a duplicated fact, invisible while the
 * copies agree. A fourth list here would be that mistake for the fourth time.
 */

import { badgeFor } from './resultSeverity'
import type { ResultState } from './types'

export type RetestGuidance =
  /**
   * All-clear. The existing approved CTA is correct and already renders: a
   * retest is a purchase, he has nothing wrong, and inviting him to buy one is
   * legitimate. Nothing about this case changes.
   */
  | { kind: 'offer' }
  /**
   * Flagged, or routed to a GP. He is owed guidance about re-measuring and it
   * must carry NO link and NO price. **The wording does not exist**: it is
   * Ewa's, via Owed row 9. `cohort` is carried because the two may want
   * different answers — a Monitor band is a "check this again" and a See Your
   * GP is a "your GP decides", and she may rule them apart.
   */
  | { kind: 'owed'; cohort: 'flagged' | 'gp-routed' }
  /**
   * Report-only. We draw no conclusion from the number, so we cannot recommend
   * re-measuring it either. FAI is the only one today (Ewa ruling 8: not banded
   * in men). Distinct from `owed` on purpose: nothing is missing here, and a
   * later pass must not mistake it for a gap and fill it in.
   */
  | { kind: 'none' }

/**
 * What this state is owed. Total over `ResultState`, and safe for an unknown
 * state because `badgeFor` already falls back to the verdict-free badge.
 */
export function retestGuidanceFor(state: ResultState): RetestGuidance {
  const { label } = badgeFor(state)

  switch (label) {
    case 'See Your GP':
      return { kind: 'owed', cohort: 'gp-routed' }
    case 'Action Needed':
    case 'Monitor':
      return { kind: 'owed', cohort: 'flagged' }
    case 'Reported':
      return { kind: 'none' }
    // 'Optimal' and 'In range'. An unrecognised label cannot reach here: the
    // badge map is exhaustive over the type and its runtime fallback is
    // 'Reported', handled above.
    default:
      return { kind: 'offer' }
  }
}

/**
 * 🔴 MAY THIS RESULT CARRY A LINK TO A PAID KIT? CA-014, as a function.
 *
 * Two states of the world say no, and they say it for different reasons:
 *   - **GP-routed.** CA-014: a result that sends a man to his doctor must
 *     carry no upsell. This is the one that would harm somebody.
 *   - **Report-only.** We draw no conclusion from the number, so we recommend
 *     nothing off the back of it, purchase or otherwise. `classifier.ts`
 *     already returns no CTA for FAI "under any circumstance".
 *
 * ⚠ IT IS NOT "ONLY AN ALL-CLEAR MAY", WHICH IS WHAT THIS FUNCTION SAID IN ITS
 * FIRST DRAFT, AND THE REGRESSION GUARD CAUGHT IT. A Monitor or Action Needed
 * marker may legitimately carry a CROSS-SELL to a different kit: a man with low
 * vitamin D is offered the testosterone kit, and a normal-testosterone man is
 * offered the energy panel. Three of those ship today and are correct. CA-014
 * is about GP routing, not about flagging, and conflating the two asserted a
 * compliance rule stricter than the one that was actually approved.
 *
 * **The 3f gap is a separate question and is unaffected**: those same flagged
 * states are owed retest GUIDANCE they do not have. Being allowed to sell a man
 * a different kit is not the same as having told him when to re-measure this
 * one.
 */
export function mayCarryPurchaseLink(state: ResultState): boolean {
  const g = retestGuidanceFor(state)
  if (g.kind === 'none') return false
  return !(g.kind === 'owed' && g.cohort === 'gp-routed')
}

/**
 * 🔴 MAY THIS WHOLE RESULT OFFER THE MAN A RETEST TO BUY? CA-014 read at the
 * RESULT level, which is the level its own wording is written at.
 *
 * ── WHY A SECOND FUNCTION, WHEN `mayCarryPurchaseLink` ALREADY EXISTS ──────
 * That one is per CARD and it is correct: a GP-routed card carries no purchase
 * link, and the regression harness asserts it across every scenario. But
 * `classify()` resolves CTAs **per marker**, with no cross-marker pass, so the
 * card next door never knew. A Kit 3 with testosterone under 12 renders a GP
 * referral on the testosterone card **and** "Retest in 6-12 months" pointing at
 * `/kits` on the SHBG card. Both cards obey the per-card rule. The result does
 * not obey CA-014, whose wording is *"a confirmed testosterone **result** < 12
 * nmol/L routes to a GP referral with no kit/supplement upsell"*.
 *
 * ⚠ THIS LOAD USED TO BE CARRIED SOMEWHERE ELSE, AND THAT IS WHY IT SURFACED
 * NOW. Both cadence design docs proposed that a GP-routed marker suppresses the
 * whole-panel retest. Ewa rejected that on 2026-09-15 (CA-047 Q4 = C) and she
 * was right on the question she was asked: *"The two markers are unrelated and
 * the GP referral does not conflict with it."* **She was ruling on whether the
 * retest is SCHEDULED. She was not asked whether it may be SOLD.** The rejected
 * rule was quietly carrying both, so the cadence half went where she put it and
 * the commercial half was left with no home. This is its home.
 *
 * ── THE BOUNDARY, AND IT IS NARROWER THAN IT FIRST LOOKS ───────────────────
 * ✅ A COMPLEMENT CROSS-SELL IS UNAFFECTED. `kit1CrossSell` and `kit2CrossSell`
 * offer a panel we have **not** measured. That is not re-selling the thing that
 * just came back wrong, the "here is the panel we have not checked" framing is
 * the one the 2026-07-17 cadence table explicitly endorses, and it is already
 * carved out of the prepaid-or-included rule on exactly this reasoning.
 *
 * 🔴 Suppressing them too would be the mistake `mayCarryPurchaseLink` above
 * records itself making in its first draft: asserting a compliance rule
 * STRICTER than the one actually approved. The rule is about re-selling a
 * marker we already measured, on a result that just sent a man to a doctor.
 *
 * ── INFORMATION SURVIVES; ONLY THE OFFER GOES ─────────────────────────────
 * The retest INTERVAL is Ewa-signed and already lives in the card copy. What
 * this removes is the link. That is the same split this module's header argues
 * for: a result can owe a man guidance about re-measuring without owing him a
 * product — and here, without being allowed to sell him one.
 *
 * Scoped by the PROPERTY that makes a state qualify, never by a list of
 * markers. The prepaid rule's carve-out was enumerated by marker and was wrong
 * within 75 minutes when four more states joined the set.
 */
export function resultMayCarryRetestOffer(
  states: readonly ResultState[],
): boolean {
  return !states.some((s) => badgeFor(s).label === 'See Your GP')
}

/**
 * The states currently owed wording, as a count rather than an argument.
 *
 * This is the number to put in front of Ewa: not "some flagged results have no
 * retest guidance" but exactly how many states, split by cohort. Derived, so it
 * cannot go stale when a state is added.
 */
export function statesOwedWording(states: readonly ResultState[]): {
  flagged: ResultState[]
  gpRouted: ResultState[]
} {
  const flagged: ResultState[] = []
  const gpRouted: ResultState[] = []
  for (const s of states) {
    const g = retestGuidanceFor(s)
    if (g.kind !== 'owed') continue
    if (g.cohort === 'gp-routed') gpRouted.push(s)
    else flagged.push(s)
  }
  return { flagged, gpRouted }
}
