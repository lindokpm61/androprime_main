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
 * THE BLAST RADIUS IS SMALLER THAN THE RULE SOUNDS, and it is worth stating
 * because it is the thing that makes the rule safe (Keith, 2026-09-12). A man's
 * flagged markers can only come from the panel he bought, so the kit he bought
 * bounds the answer:
 *
 *   bought Kit 1  ->  always Kit 1     (15 of 15 flag combinations)
 *   bought Kit 2  ->  always Kit 2     (15 of 15)
 *   bought Kit 3  ->  Kit 3 in 225 of 255, Kit 1 in 15, Kit 2 in 15
 *
 * So this rule is a NO-OP for every Kit 1 and Kit 2 buyer. The only customer it
 * can change is a Kit 3 buyer, and only when his flags fall entirely inside one
 * half of the panel: 30 of his 255 possible combinations, twelve per cent.
 * Kit 1 is five markers and Kit 2 is four, but FAI is never flagged (Ewa ruling
 * 8, `fai-reported` carries no verdict), so each half contributes 2^4 - 1 = 15.
 *
 * The counts are asserted in section 7 of `scripts/test-retest-panel.ts` rather
 * than left as a claim in a comment.
 *
 * THIS IS NOT A CLINICAL RULING, AND THE REGISTER WAS WRONG TO CALL IT ONE.
 * From 2026-09-08 the defect register said "dropping five markers off a retest
 * is a clinical statement, not a packing decision", and that was repeated into
 * this file. Keith corrected it on 2026-09-13: the system asserts nothing here.
 * It re-measures markers that moved and reports the new numbers, interpreted by
 * the same thresholds and the same copy as before. Not running a test is not a
 * claim that the marker is fine.
 *
 * The governing rule is `03_compliance/CONTEXT.md`: **Ewa signs off the system,
 * not individual reports** — the recommendation logic, meaning thresholds,
 * result-to-product recommendation mapping, and copy. This rule moves no
 * threshold, recommends nothing, and changes no customer-facing word. It
 * selects which box to post against an entitlement the customer already holds.
 *
 * The structural half matters more than the argument: **a flagged marker is
 * never omitted.** The chosen kit always covers every marker the engine
 * flagged, asserted over all 557 subsets in section 4 of the test, so the case
 * that WOULD be a clinical statement cannot occur. What is left out is only
 * ever a marker that came back in range.
 *
 * ⚠ What IS owed, when it exists, is COPY. Nothing currently tells a member
 * what his retest covers (that absence is defect 3c). The sentence that
 * eventually does is external-facing, so it goes through the Guardrail #1
 * pre-flight like any other copy. Ewa re-enters only if that copy makes a claim
 * about clinical sufficiency, e.g. "we re-test what matters".
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
