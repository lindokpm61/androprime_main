/**
 * Which kit a member's included retest should be.
 *
 * THE RULE (Keith, 2026-09-12, defect D1): the retest panel follows what was
 * FLAGGED, not what was bought. Before this, the nightly sweep read the last kit
 * the customer ordered and sent that one again, so a Kit 3 buyer got all nine
 * markers back whatever his result said, and the rebuilt `/demo` — which shows
 * that man receiving a Kit 2 — described a product the system did not build.
 *
 * Keith chose the rule rather than the hard-coded Kit 3 to Kit 2 mapping that
 * was offered as the quick way out. The mapping would have matched the demo and
 * nothing else; this answers the question the demo was illustrating.
 *
 * WHAT IT DOES. Take the markers the classifier flagged on his most recent
 * result, and send the cheapest kit whose panel measures all of them:
 *
 *   flagged {Vitamin D, Ferritin}        -> Kit 2   (Kit 1 cannot measure them)
 *   flagged {Total T}                    -> Kit 1   (cheapest that covers it)
 *   flagged {Total T, Vitamin D}         -> Kit 3   (only Kit 3 spans both)
 *
 * It is cheaper to fulfil wherever it can be, and it is defensible clinically
 * because what gets re-measured is what moved.
 *
 * ⚠ EWA HAS NOT SIGNED THE NARROWING. Dropping five markers off a Kit 3 buyer's
 * retest is a clinical statement, not a packing decision, and the register has
 * said so since 2026-09-08. This file implements the rule Keith chose; the
 * sign-off is still owed before `MEMBERSHIP_ENABLED` goes on. If the answer
 * comes back "always re-measure the full panel he bought", the change is to
 * return the fallback here and nothing else moves.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It never decides WHEN. The interval is
 * `entitlement.ts`, and the two are siblings: this decides what, that decides
 * when, and both should be properties of the RESULT rather than of whichever
 * mechanism happened to fire.
 */

import { cheapestKitCovering, panelMarkerIdFor, type PanelMarkerId } from '@/lib/kits/panel'
import { isFlaggedState } from '@/lib/results/resultSeverity'
import type { KitType, ResultState } from '@/lib/results/types'

/** The shape this rule needs from a classified result. */
export interface RetestMarker {
  markerName: string
  state: ResultState
}

/**
 * Why the panel is what it is. Recorded rather than inferred, because three of
 * the four outcomes send the fallback kit and they are not the same event: one
 * is the rule working, two are the rule declining to act.
 */
export type RetestPanelReason =
  /** Markers were flagged and a kit covers them. The rule fired. */
  | 'flagged'
  /** Every marker was in range. Nothing to re-measure, so nothing to narrow. */
  | 'nothing-flagged'
  /** A flagged marker has no panel entry. Refuse to narrow on an incomplete read. */
  | 'unrecognised-marker'
  /** Flagged markers that no single kit spans. Should be unreachable; see below. */
  | 'no-covering-kit'
  /**
   * No readable result at all, so the rule never ran. Not produced by
   * `selectRetestPanel`; it is here so the caller's degraded path has an honest
   * name rather than borrowing one of the outcomes above, and so the set of
   * reasons a dispatch can carry stays closed.
   */
  | 'no-readable-result'

export interface RetestPanel {
  /** The kit to dispatch. */
  kit: KitType
  reason: RetestPanelReason
  /** The flagged markers the decision was made from, for the log line. */
  flagged: PanelMarkerId[]
}

/**
 * Pick the retest panel.
 *
 * `fallback` is the kit that produced these markers, i.e. the kit type of the
 * result being read. Every path that is not 'flagged' returns it unchanged,
 * which is exactly the behaviour this rule replaced, so a member can never be
 * sent LESS than he would have been before the rule existed.
 *
 * That also carries the safety property worth stating: his own kit always
 * covers his own flagged markers, so the cheapest covering kit is never dearer
 * than the one he took. `scripts/test-retest-panel.ts` asserts it over every
 * kit and every subset of its panel rather than trusting the argument.
 */
export function selectRetestPanel(
  markers: readonly RetestMarker[],
  fallback: KitType,
): RetestPanel {
  const flagged: PanelMarkerId[] = []

  for (const m of markers) {
    if (!isFlaggedState(m.state)) continue
    const id = panelMarkerIdFor(m.markerName)
    if (!id) {
      // A flagged marker this build cannot place. Narrowing now could drop the
      // very marker that needs re-measuring, so send what he took and say why.
      // Fails in the direction of a bigger kit, which costs money rather than
      // information.
      return { kit: fallback, reason: 'unrecognised-marker', flagged }
    }
    flagged.push(id)
  }

  if (flagged.length === 0) {
    // Nothing is flagged, so there is no marker the panel should follow. What an
    // all-clear member is owed at all is defect 3a and is not answered here.
    return { kit: fallback, reason: 'nothing-flagged', flagged }
  }

  const kit = cheapestKitCovering(flagged)
  if (!kit) {
    // Unreachable while Kit 3 is the union of the other two: any set drawn from
    // a real panel is covered by Kit 3. Handled anyway, because "unreachable"
    // is a property of today's panel definitions and not of this function.
    return { kit: fallback, reason: 'no-covering-kit', flagged }
  }

  return { kit, reason: 'flagged', flagged }
}
