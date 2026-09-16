/**
 * THE SYMPTOM OVERLAY: what a man is shown when every marker is in range and he
 * has said he still does not feel right.
 * PURE: no database, no env, no clock, no React.
 *
 * ── APPROVAL ──────────────────────────────────────────────────────────────
 * CA-048 (Ewa 5 of 5 + Keith, 2026-09-16), with the alert container settled by
 * CA-049 Q5 = A. Record:
 * `03_compliance/content-approval/approval-record-symptom-overlay-screen-2026-09-16.md`.
 * Artefact: `04_products/results-engine/2026-09-16-symptom-overlay-screen-copy.md`.
 *
 * 🔴 EVERY STRING BELOW IS SIGNED COPY. Do not reword, retitle, reorder or
 * "tidy" any of it. `scripts/test-symptom-overlay.ts` asserts each one verbatim
 * against the approved artefact, so a change here is a failing build, which is
 * the intended outcome.
 *
 * ⚠ TWO THINGS A LATER PASS WILL BE TEMPTED TO DO AND MUST NOT.
 *
 *   1. **Do not insert an "Otherwise," before the GP list.** It looks like an
 *      improvement and it is a reversal. Ewa's list opens with an unqualified
 *      "chest pain" while the block above routes *sudden or severe* chest pain
 *      to 999, so a man matches both lists, and the `cholesterol-test` FAQ
 *      solves exactly that after the word "Otherwise". **That option was put to
 *      her as CA-048 Q2 option A, with the conflict named and the precedent
 *      quoted, and she chose B: the lead-in below, as written.** The losing
 *      argument is kept in full in the record's §3.
 *   2. **Do not add a retest interval to the closing paragraph.** CA-049 Q3 = B
 *      ruled that a man acting on a finding is told his GP decides the timing,
 *      not us. The 3-month `recheck` in `RETEST_CADENCE` is a scheduling value
 *      and may not be stated to him as our recommendation.
 *
 * ── WHY IT IS INERT ───────────────────────────────────────────────────────
 * 🔴 THE TRIGGER CANNOT FIRE TODAY, AND THAT IS THE REAL BLOCKER, NOT THE
 * SCREEN. `ClassifierInput.symptomAnswers` is populated by nothing in the
 * product: `energy_symptoms` appears in exactly one fixture and is asked on no
 * surface, so every real result carries `[]`. Building the capture is a
 * separate piece of work and a compliance question of its own, because it
 * collects health information.
 *
 * So this module is written, tested and rendered behind
 * `SYMPTOM_OVERLAY_ENABLED`, which is OFF. It exists so that the copy is under
 * test and the render obligation can be discharged against something real
 * rather than against a description of something.
 */

import { badgeFor } from './resultSeverity'
import type { KitType, ResultState } from './types'

/** The NHS source on the emergency wording, as a link, exactly as the article carries it. */
export const NHS_CHEST_PAIN_URL = 'https://www.nhs.uk/conditions/chest-pain/'

/**
 * The container title. Ewa, CA-049 Q5 = A: the same presentation as on the
 * article, where the block sits inside a `SystemAlert` under this heading.
 */
export const OVERLAY_ALERT_TITLE = 'When to see your GP, not us'

/** Ewa, 2026-08-18. Live on `signs-of-stress-in-men` and `cholesterol-test`. */
export const EMERGENCY_HEADING = 'Read this part first. Call 999 now if:'

/**
 * ⚠ SPLIT AROUND THE CITATION, NOT AROUND A SENTENCE. The link text is "Chest
 * pain" and it sits inside the trailing parenthesis, so the two halves either
 * side are not sentences and must not be treated as such.
 */
export const EMERGENCY_BODY_BEFORE_CITATION =
  'You have sudden or severe chest pain, pain that spreads to your arm, neck, jaw or back, ' +
  "or chest pain with breathlessness, sweating or feeling sick. Don't talk yourself out of it. " +
  'Rule out your heart first, every time (NHS, '
export const EMERGENCY_CITATION_TEXT = 'Chest pain'
export const EMERGENCY_BODY_AFTER_CITATION = ').'

/** ⚠ NEW at draft time, signed by CA-048 Q2 = B. See the header, point 1. */
export const GP_LEAD_IN = 'See your GP now, rather than testing again, if any of these apply:'

/** Ewa, CA-047 round 1 Q5 = A, ratified verbatim rather than in substance. */
export const GP_RED_FLAG_LIST =
  'chest pain, breathlessness at rest or on light exertion, unexplained weight loss, ' +
  'blood in stool or urine, a new lump, fainting, or any symptom that is new and getting ' +
  'worse week on week.'

/** ⚠ NEW at draft time, signed by CA-048 Q3 = A (reader self-triage). */
export const CONNECTIVE = 'If none of the above applies to you:'

/**
 * The closing paragraph, one per kit, and the kit is the whole of what selects
 * it. Ewa, CA-047 round 2 Q7 = A for the first two; CA-048 Q4 = A for Kit 3.
 *
 * 🔴 KIT 3 IS NOT A VARIANT OF THE OTHER TWO AND MUST NEVER BE COLLAPSED INTO
 * THEM. It measures all nine markers (`lib/kits/panel.ts`), so there is no
 * untested panel to widen to and both other wordings would offer a man a panel
 * he has just bought and read. §2a's step-1 table decided his route in July:
 * "Kit 3 (superset) | none left -> GP". This paragraph is that route, worded.
 * It offers nothing to buy, which is the point of it: he has spent the most and
 * has the fewest options left.
 */
export const CLOSING_BY_KIT: Record<KitType, string> = {
  testosterone:
    'Your testosterone results are in range. If you are still not feeling right, the markers ' +
    'behind energy and recovery are the next sensible thing to look at: Vitamin D, Active B12, ' +
    'ferritin and hs-CRP. If you would rather not test again, speak to your GP.',
  'energy-recovery':
    'Your energy and recovery markers are in range. If you are still not feeling right, ' +
    'testosterone is the next sensible thing to look at. If you would rather not test again, ' +
    'speak to your GP.',
  'hormone-recovery':
    'Your results are in range across every marker we measure. If you are still not feeling ' +
    'right, that is worth taking to your GP. There is nothing further we can test for you here.',
}

/**
 * The symptom answer the overlay keys off.
 *
 * ⚠ NOTHING WRITES THIS TODAY. It is the shape the one existing fixture uses
 * (`normal-testosterone-energy.ts`), kept so the trigger is expressed against a
 * real key rather than an invented one. When the capture is built, that build
 * owns whether this key survives.
 */
export const STILL_UNWELL_QUESTION_KEY = 'energy_symptoms'

/**
 * Every marker in range, in the sense the overlay means: nothing flagged and
 * nothing GP-routed.
 *
 * ⚠ DERIVED FROM THE BADGE, NEVER FROM A SECOND LIST OF STATES. `resultSeverity`
 * exists precisely because a duplicated "which states mean something is wrong"
 * list is invisible while the copies agree. `fai-reported` badges `Reported`
 * and is deliberately in range here: we draw no conclusion from it, so it
 * cannot be the thing that is wrong.
 */
export function allMarkersInRange(states: readonly ResultState[]): boolean {
  return states.every((s) => {
    const { label } = badgeFor(s)
    return label === 'In range' || label === 'Optimal' || label === 'Reported'
  })
}

export interface SymptomOverlayInput {
  kitType: KitType
  states: readonly ResultState[]
  symptomAnswers: ReadonlyArray<{ questionKey: string; answer: unknown }>
}

export interface SymptomOverlayCopy {
  alertTitle: string
  emergencyHeading: string
  emergencyBodyBeforeCitation: string
  citationText: string
  citationHref: string
  emergencyBodyAfterCitation: string
  gpLeadIn: string
  gpRedFlagList: string
  connective: string
  closing: string
}

/**
 * Which composite this result gets, or `null` for no overlay at all.
 *
 * 🔴 NULL IS THE COMMON CASE AND MUST STAY CHEAP. The overlay is for a narrow
 * cohort: everything in range, and he has said he still feels wrong. A flagged
 * or GP-routed result already has its own card treatment and is not this.
 */
export function symptomOverlayFor(input: SymptomOverlayInput): SymptomOverlayCopy | null {
  const stillUnwell = input.symptomAnswers.some(
    (a) => a.questionKey === STILL_UNWELL_QUESTION_KEY && a.answer === true,
  )
  if (!stillUnwell) return null
  if (input.states.length === 0) return null
  if (!allMarkersInRange(input.states)) return null

  return {
    alertTitle: OVERLAY_ALERT_TITLE,
    emergencyHeading: EMERGENCY_HEADING,
    emergencyBodyBeforeCitation: EMERGENCY_BODY_BEFORE_CITATION,
    citationText: EMERGENCY_CITATION_TEXT,
    citationHref: NHS_CHEST_PAIN_URL,
    emergencyBodyAfterCitation: EMERGENCY_BODY_AFTER_CITATION,
    gpLeadIn: GP_LEAD_IN,
    gpRedFlagList: GP_RED_FLAG_LIST,
    connective: CONNECTIVE,
    closing: CLOSING_BY_KIT[input.kitType],
  }
}
