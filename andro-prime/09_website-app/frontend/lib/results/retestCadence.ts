/**
 * THE RETEST CADENCE MAP: six rule kinds, thirty signed cells, one reduction.
 * PURE: no database, no env, NO CLOCK. The anchor date is always an argument.
 *
 * The header below is the argument for the `seasonal` kind, which is the one
 * kind that needed designing rather than transcribing. THE MAP ITSELF, the
 * shared rule values and the whole-result reduction are at the bottom of the
 * file, under `THE MAP`.
 *
 * ── WHY A FIFTH KIND EXISTS ───────────────────────────────────────────────
 * `2026-09-15-retest-cadence-by-rule-kind.md` maps every signed result state
 * onto a rule kind. Twenty-five of the twenty-six cells fit one of the four
 * kinds the design proposed. One does not.
 *
 * Ewa, CA-047 round 2 Q5 = A, on `normal-vitamin-d` (50-250 nmol/L):
 * *"retest heading into autumn or winter"*. She was offered "6 to 12 months
 * like the other in-range markers" and declined it, and declined the hybrid.
 *
 * That answer is not an elapsed interval. It is a TIME OF YEAR, and none of
 * `{ days }`, `{ fromMonths, toMonths }` or `clinician-led` can hold it.
 *
 * 🔴 THE FAILURE THIS CLOSES IS SILENT, WHICH IS WHY IT BLOCKED THE BUILD.
 * With four kinds, the seasonal cell falls through to `clinician-led` and the
 * product shows a man NO RETEST DATE AT ALL on a perfectly normal vitamin D —
 * the most common in-range result the UK produces. Not a visible gap: a
 * confident wrong answer, on the majority case.
 *
 * ── THE KIND IS A WINDOW, NOT A DATE, AND THAT IS LOAD-BEARING ────────────
 * Her ruling constrains WHEN THE BLOOD IS DRAWN, not when we prompt. A kit has
 * to be ordered, posted, and used on a morning of the man's choosing, so any
 * mechanism firing off this rule must subtract its own lead time from the
 * window's start. The rule therefore exposes `from` AND `to` and knows nothing
 * about dispatch: the clinical fact and the logistics stay in separate layers.
 *
 * ── THE TWO GUARDS, AND WHERE THEIR NUMBERS COME FROM ─────────────────────
 * A naive "next 1 October" rule is wrong in two ways that only show up on a
 * calendar sweep, so both are guarded:
 *
 *   1. `minGapDays` = 90. Without it a result landing on 30 September yields a
 *      retest ONE DAY later. That is a sub-90-day result-triggered recheck and
 *      it is forbidden: `2026-09-07-fast-recheck-must-be-prepaid-or-included.md`
 *      §1 and §8. ⚠ NOTE `seasonal` IS INSIDE THAT RULE. The `recheck` kind was
 *      carved OUT of it (§2, third row) on the substance — a recheck watches
 *      whether an intervention moved a marker. A seasonal retest of a NORMAL
 *      result is not that; it is a fresh prompt on an in-range number, which is
 *      exactly the species §7 blesses at 6-12 months because it sits outside the
 *      window. So the 90 is inherited, not invented.
 *
 *   2. `minSpanDays` = 30. Without it the reachable remainder of the window
 *      collapses as the anchor moves through autumn: an anchor of 30 December
 *      yields a TWO-DAY window (30-31 March). A mechanism cannot land a kit in
 *      two days, so the opportunity is silently lost and the next one is a year
 *      away. ⚠ THIS IS THE ONE NUMBER HERE THAT IS NEITHER CLINICAL NOR
 *      INHERITED. It is operational, it is Keith's, and it is isolated in one
 *      named constant precisely so it can move without touching the shape.
 *
 * ── THE DISCONTINUITY, NAMED RATHER THAN DISCOVERED LATER ─────────────────
 * A window is an arc and the year is a circle, so ANY rule of this shape has
 * exactly one discontinuity per year. It cannot be removed, only placed. Swept
 * across all 1096 anchor dates in 2026-2028, this placement puts it at
 * 2/3 December: an anchor of 2 Dec gets 90 days, an anchor of 3 Dec gets 302.
 *
 * That is the least harmful place available, and the reason is clinical: the
 * men on the far side of it were sampled in early winter, so they ALREADY hold
 * an in-season reading and the seasonal argument is spent for them. Compare the
 * unguarded rule, whose cliff falls on 30 September / 2 October — men with
 * summer readings, who are precisely the cohort Ewa's ruling exists for.
 *
 * This is the same class of defect as `{ days: 90 }` versus "3 months"
 * (`2026-09-07-...` §2a): a boundary nobody chose, deciding a man's outcome by
 * the month his blood happened to be drawn. Swept, not assumed. See
 * `scripts/test-retest-cadence-seasonal.ts`.
 *
 * ── THE MAP IS NOW HERE (2026-09-16), AND WITH IT ITS OWN VERIFICATION ────
 * ✅ Checklist items 4, 5 and 6 are closed in the `THE MAP` section below:
 * every `recheck` stores the integer `{ days: 90 }` and never a month count
 * (4); the three sub-12 testosterone states carry `clinician-led` AND `confirm`
 * at once, deliberately (5); and all thirty signed cells are restated
 * independently in `scripts/test-retest-cadence-map.ts` (6).
 *
 * 🔴 ITEM 6 EXISTS BECAUSE THE SAFETY PROPERTY THIS MODULE SHIPPED WITH IS
 * SPENT. Until 2026-09-15 only one cell was signed, so the map would have
 * arrived inert and could lean on that. Every cell is signed now: the map is
 * a live clinical instruction the moment anything reads it, so it carries a
 * test that fails when the code and the sign-off disagree, rather than an
 * argument that disagreement cannot matter yet.
 *
 * ── WHAT THIS FILE STILL DELIBERATELY DOES NOT CONTAIN ────────────────────
 * 🔴 NO WIRING. None of the eight mechanisms in `retest-mechanism-map.md`
 * reads this yet, and nothing imports the map but its test. That is the next
 * change and it is deliberately separate: this one is reviewable line by line
 * against a clinical document, and the next one changes what lands in a man's
 * letterbox.
 *
 * 🔴 NO CUSTOMER-FACING SENTENCE. `biomarker-copy.ts` already carries Ewa's
 * approved wording for this state, verbatim, and has for months — which is why
 * her answer changes no copy. Surfacing the COMPUTED window to a customer as a
 * date would be new copy and needs its own pre-flight. Do not.
 */

import type { ResultState } from './types'

/**
 * A recurring calendar window, given as month/day boundaries. It wraps the year
 * when `toMonth` is earlier than `fromMonth`, which is the only case in use
 * (October to March) but not the only case the resolver handles.
 */
export interface SeasonalWindow {
  fromMonth: number
  fromDay: number
  toMonth: number
  toDay: number
}

/**
 * THE SIX KINDS. `Record<ResultState, RetestCell>` over this union is what
 * makes adding a biomarker state without deciding its retest rule a COMPILE
 * ERROR — the reason `BADGES` and `BIOMARKER_COPY` are shaped the same way, and
 * the reason the 2026-08-07 `default:` defect never reached either of them.
 *
 * ⚠ `confirm` and `recheck` share a shape and are NOT interchangeable. They are
 * distinguished because the prepaid-or-included rule reaches one and is carved
 * out of the other, and because the three sub-12 testosterone states carry a
 * `confirm` rule AND are GP-routed at the same time, deliberately.
 */
export type RetestRule =
  /** Fast confirmatory recheck, in days. Prepaid inside a bundle, always. */
  | { kind: 'confirm'; days: number }
  /** Acting on a finding. Stored as an INTEGER of days, never a month count. */
  | { kind: 'recheck'; days: number }
  /** Nothing to fix, long window. */
  | { kind: 'maintenance'; fromMonths: number; toMonths: number }
  /** Retest against a time of year rather than an elapsed interval. */
  | {
      kind: 'seasonal'
      window: SeasonalWindow
      minGapDays: number
      minSpanDays: number
    }
  /** No Andro Prime date at all. The GP directs it. Never a fallthrough. */
  | { kind: 'clinician-led' }
  /**
   * 🔴 REPORT-ONLY. We draw no conclusion from the number, so we recommend
   * nothing about re-measuring it. `fai-reported` is the only one today.
   *
   * ⚠ THIS IS NOT `clinician-led` AND MUST NEVER BE COLLAPSED INTO IT. Both
   * yield no date, and that is the whole reason they have to stay apart: they
   * yield it for opposite reasons, and one of them renders a GP referral.
   *
   *   - `clinician-led` says **a doctor decides the timing**. It is an
   *     assertion about the result, and the card shows a referral.
   *   - `none` says **we have no verdict at all**, so we make no claim in
   *     either direction. The card shows no referral and no date.
   *
   * Borrowing `clinician-led` for FAI would assert a GP route on a marker that
   * carries none — which is the FAI `default:` defect in a new place. Ewa
   * ruling 8 (2026-06-16) was *"report-only, do not band it in men"*, it was
   * implemented by omitting a `case`, and the default branch then told men an
   * out-of-range value was *"within the normal range"*.
   *
   * ✅ MIRRORS `retestGuidance.ts`, DELIBERATELY. That module faced the
   * identical question about GUIDANCE and gave FAI its own `{ kind: 'none' }`
   * rather than reusing a neighbour, with the reason in its own comment:
   * *"nothing is missing here, and a later pass must not mistake it for a gap
   * and fill it in."* Same marker, same ruling, same answer, same shape.
   *
   * 🔴 THE BOUNDARY: this kind records the ABSENCE of a recommendation, which
   * is why it can be derived from ruling 8 without overstating her. **Giving
   * FAI an actual retest date would be a new clinical claim and needs Ewa.**
   */
  | { kind: 'none' }

/**
 * 🔴 UK VITAMIN D SEASON. Ewa's own range, quoted from the approved card copy:
 * *"levels typically fall between October and March even when summer levels are
 * good."* Taken from her sentence rather than from meteorological autumn, which
 * would start in September and is not what she wrote.
 */
export const UK_VITAMIN_D_SEASON: SeasonalWindow = {
  fromMonth: 10,
  fromDay: 1,
  toMonth: 3,
  toDay: 31,
}

/** Inherited from the adopted prepaid-or-included rule. Not a free parameter. */
export const SEASONAL_MIN_GAP_DAYS = 90

/**
 * Operational, not clinical: the shortest remaining window a mechanism can
 * still land a kit inside. Keith's number. Moving it moves the December cliff
 * (14 days puts it at 18/19 Dec, 60 days at 2/3 Nov) and nothing else.
 */
export const SEASONAL_MIN_SPAN_DAYS = 30

/** The one cell that needs this kind today. */
export const NORMAL_VITAMIN_D_RULE: RetestRule = {
  kind: 'seasonal',
  window: UK_VITAMIN_D_SEASON,
  minGapDays: SEASONAL_MIN_GAP_DAYS,
  minSpanDays: SEASONAL_MIN_SPAN_DAYS,
}

/**
 * The one cell that needs `none` today. Free Androgen Index: Ewa ruling 8,
 * 2026-06-16, *"report-only, do not band it in men"*.
 *
 * ⚠ HOW THIS CELL WAS FOUND IS WORTH A LINE, because the next one will be found
 * the same way or not at all. It was in **neither** the sign-off table nor the
 * rule-kind map, and never had been — so it survived two clinical sign-off
 * rounds and three separate recorded counts of "every row is ruled", every one
 * of which counted the rows that existed. It surfaced only by diffing both
 * documents against `ResultState` itself. That diff is now
 * `scripts/verify-cadence-coverage.js`, wired into `npm test`.
 */
export const FAI_REPORTED_RULE: RetestRule = { kind: 'none' }

const DAY_MS = 86_400_000

/**
 * 🔴 SEASONAL IS THE ONLY KIND THAT CAN FAIL TO RESOLVE, AND IT MUST SAY SO
 * OUT LOUD. `recheck` and `maintenance` are elapsed intervals and mean
 * something without a calendar. A time of year does not: with no anchor date
 * there is no answer at all.
 *
 * `SingleResult.collectedAt` is `string | null` (it reads `received_at`, which
 * is nullable), so a null anchor is a real runtime state, not a theoretical
 * one. Returning `{ ok: false }` forces every caller to handle it. Collapsing
 * it to a date, to `clinician-led`, or to "no date" would reproduce the exact
 * defect this kind exists to close — and this repo has already paid twice for
 * a clinical instruction implemented as an omission (FAI ruling 8, and the
 * `BADGES` default).
 */
export type SeasonalResolution =
  | { ok: true; from: string; to: string; gapDays: number; spanDays: number }
  | { ok: false; reason: 'no-anchor' | 'invalid-anchor' }

/**
 * Resolve a seasonal rule against the date the result landed.
 *
 * ⚠ DATE-ONLY, IN UTC, DELIBERATELY. `received_at` is a timestamp, and a UK
 * summer morning before 01:00 BST is the previous day in UTC. Taking the UTC
 * calendar date is a one-day drift in that narrow case, and it is chosen over
 * a timezone conversion because it is deterministic, dependency-free, and keeps
 * this module pure. A one-day drift is immaterial against a 90-day floor and a
 * 30-day minimum span everywhere except exactly on the December boundary.
 */
export function resolveSeasonal(
  rule: Extract<RetestRule, { kind: 'seasonal' }>,
  anchorIso: string | null,
): SeasonalResolution {
  if (!anchorIso) return { ok: false, reason: 'no-anchor' }

  const anchor = Date.parse(anchorIso)
  if (Number.isNaN(anchor)) return { ok: false, reason: 'invalid-anchor' }

  const a = new Date(anchor)
  const anchorDay = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate())
  const earliestPermitted = anchorDay + rule.minGapDays * DAY_MS

  const { fromMonth, fromDay, toMonth, toDay } = rule.window
  // A window whose end month is not after its start month wraps into the next
  // calendar year. October to March does; a hypothetical May to August would
  // not, and is handled rather than rejected.
  const wraps = toMonth < fromMonth || (toMonth === fromMonth && toDay < fromDay)

  // Bounded: start one year behind the anchor so a window already underway is
  // considered, and run far enough forward that the loop cannot fall out. Three
  // forward years is two more than any input needs.
  const y0 = a.getUTCFullYear()
  for (let y = y0 - 1; y <= y0 + 3; y++) {
    const start = Date.UTC(y, fromMonth - 1, fromDay)
    const end = Date.UTC(wraps ? y + 1 : y, toMonth - 1, toDay)

    // Clamp INTO the window rather than requiring the whole of it to be ahead.
    // Requiring the whole window would push an August result to the FOLLOWING
    // October — fourteen months — and an August result is precisely the "summer
    // levels are good" case the ruling was written for.
    const from = Math.max(start, earliestPermitted)
    if (end - from >= (rule.minSpanDays - 1) * DAY_MS) {
      return {
        ok: true,
        from: isoDay(from),
        to: isoDay(end),
        gapDays: Math.round((from - anchorDay) / DAY_MS),
        spanDays: Math.round((end - from) / DAY_MS) + 1,
      }
    }
  }

  // Unreachable: the loop spans four annual occurrences and any anchor reaches
  // one. Typed as invalid rather than thrown, because a results page must not
  // crash over a retest date.
  return { ok: false, reason: 'invalid-anchor' }
}

function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

/**
 * The interval a rule contributes to the whole-result reduction, in days from
 * the anchor, or `null` where it contributes none.
 *
 * ✅ THE REDUCTION AS SIGNED (CA-047 round 1 Q4 = C, Ewa). Cadence is decided
 * PER MARKER, never per panel. A `clinician-led` marker yields no date and
 * SUPPRESSES NOTHING — she rejected the suppression rule both design documents
 * proposed: *"The two markers are unrelated and the GP referral does not
 * conflict with it."*
 *
 * ⚠ A SEASONAL MARKER PARTICIPATES ON ITS `from` DATE, so it can legitimately
 * drive the whole-result date. It can never drive it below 90 days (the floor)
 * and never beyond 302 days (swept), so it is bounded on both sides by rules
 * that already exist: it can tie a `recheck` at 90 and it can never be later
 * than the 12-month edge of `maintenance`.
 *
 * ⚠ THE PER-RULE HALF ONLY, AND THAT SPLIT IS LOAD-BEARING. Rule 2 (`confirm`
 * always wins and is never suppressed) cannot be expressed here, because a
 * function over ONE rule cannot say which of several wins. It lives in
 * `reduceContributions()` at the bottom of this file. Reading a per-rule answer
 * as if it were the whole-result answer is the same class of mistake as the
 * per-card CA-014 guard that passed while sixteen links were live: a per-item
 * check cannot see a per-collection rule.
 */
export function intervalDaysFor(
  rule: RetestRule,
  anchorIso: string | null,
): number | null {
  switch (rule.kind) {
    case 'confirm':
    case 'recheck':
      return rule.days
    case 'maintenance':
      // The window's near edge is what competes; the far edge is presentational.
      return Math.round(rule.fromMonths * 30.4375)
    case 'seasonal': {
      const r = resolveSeasonal(rule, anchorIso)
      return r.ok ? r.gapDays : null
    }
    // Both contribute nothing, for opposite reasons the type keeps apart: a GP
    // decides the timing, versus we have no verdict to act on at all. They are
    // written as separate cases rather than one, so that a future change to
    // either has to state which it means.
    case 'clinician-led':
      return null
    case 'none':
      return null
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// THE MAP — build checklist items 4, 5 and 6 of
// `2026-09-15-retest-cadence-by-rule-kind.md` §5.
//
// 🔴 THIS SECTION MOVES REAL DATES THE MOMENT A MECHANISM READS IT. Until
// 2026-09-15 the safety argument for building any of this was that only one
// cell was signed, so the map would arrive inert. Every cell is signed now, so
// that argument is spent and this section carries its own verification instead:
// `scripts/test-retest-cadence-map.ts` restates all thirty signed cells
// independently and fails if the map and the sign-off drift apart.
//
// ⚠ NOTHING IMPORTS THIS YET. Writing the map and wiring the eight mechanisms
// onto it are separate changes, deliberately: this one is reviewable against a
// clinical document, and the next one changes what lands in a man's letterbox.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The rules one result state carries. **Non-empty by construction**, which is
 * the whole reason it is a tuple type rather than `RetestRule[]`.
 *
 * 🔴 AN EMPTY CELL WOULD BE THE `default:` DEFECT IN ITS THIRD COSTUME. It
 * reads as "nothing decided here" and behaves as "no retest recommended",
 * which is a real clinical position (`none`) that must be STATED rather than
 * implied by an absence. `Record<ResultState, …>` already makes a missing state
 * a compile error; the tuple makes an empty one a compile error too.
 *
 * ⚠ MORE THAN ONE RULE IS NOT A CONFLICT. The three sub-12 testosterone states
 * carry `clinician-led` AND `confirm`, deliberately — see the cells themselves.
 */
export type RetestCell = readonly [RetestRule, ...RetestRule[]]

/**
 * 🔴 BUCKET B IS STORED AS AN INTEGER OF DAYS, NEVER AS "3 months" (item 4).
 * Three calendar months is 89 to 92 days depending on the start date, and 58 of
 * the 1096 start dates across 2026-2028 land UNDER 90 — all of them in late
 * January or February. Stored as a phrase, the prepaid-or-included rule would
 * have applied to roughly 5% of men according to the month their blood happened
 * to be drawn. Keith, 2026-09-15:
 * `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2a.
 *
 * ⚠ THE GUARD: any proposal to shorten this below 90 reopens §2a. "12 weeks"
 * is 84 days and crosses back under the threshold silently.
 */
export const RECHECK_DAYS = 90

/** Ewa, CA-047 round 1 Q2 = A: *"3 months for all of them"*, and round 2 Q1-Q4. */
export const RECHECK_RULE: RetestRule = { kind: 'recheck', days: RECHECK_DAYS }

/**
 * Ewa, CA-047 round 1 Q1 = A: *"6 to 12 months, as currently written"*, and
 * round 2 Q6 for the `normal` fallback. No copy moved when this was signed —
 * the dashboard, the FAQ, how-it-works and both landing pages already said it.
 * Signing made the value binding rather than incidental.
 */
export const MAINTENANCE_RULE: RetestRule = {
  kind: 'maintenance',
  fromMonths: 6,
  toMonths: 12,
}

/**
 * Ewa, CA-047 round 1 Q3 = A: *"No Andro Prime retest interval at all. The GP
 * directs the timing, and our card shows the referral rather than a retest
 * date."* Never a fallthrough: see the `none` kind above for the other state
 * that yields no date, for the opposite reason.
 */
export const CLINICIAN_LED_RULE: RetestRule = { kind: 'clinician-led' }

/**
 * The confirmatory second morning sample on a sub-12 testosterone. Ewa signed
 * the zero on **2026-07-26**; it is due immediately, and it is prepaid inside
 * the Confirmation bundle, so the worst number on a man's dashboard never
 * triggers a checkout.
 *
 * ⚠ THE SAME CLINICAL RULING IS ALSO STORED AS `CONFIRMATION_INTERVAL_DAYS` IN
 * `lib/bundles/config.ts`, AND THAT IS A DUPLICATED FACT. It is not imported
 * here on purpose: `config.ts` imports `classifier.ts`, and `classifier.ts` is
 * where this map gets wired in next — importing it would build the cycle in
 * advance and would drag an env read into a module whose header promises
 * purity. The duplication is instead held shut by an assertion in
 * `scripts/test-retest-cadence-map.ts`, so the two diverging is a failing
 * build rather than a silent disagreement. **If that test is ever deleted,
 * import the constant instead — do not simply leave two copies unwatched.**
 */
export const CONFIRM_DAYS = 0

/** Fast confirmatory recheck. Prepaid inside the Confirmation bundle, always. */
export const CONFIRM_RULE: RetestRule = { kind: 'confirm', days: CONFIRM_DAYS }

/**
 * 🔴 THE SIGNED MAP. Thirty states, thirty cells, every one clinically ruled.
 * Sign-off record: `2026-07-17-retest-cadence-table.md` (CA-047, Ewa,
 * 2026-09-15, two rounds). Build input, keyed by kind:
 * `2026-09-15-retest-cadence-by-rule-kind.md` §2. Business sign-off: Keith.
 *
 * ⚠ READ THE KIND, NEVER THE BUCKET. The sign-off table groups states into
 * three presentational buckets, and after round 2 the buckets and the kinds no
 * longer agree: `shbg-low` and `shbg-high` are IN-RANGE states sitting under an
 * "all-clear / maintenance" heading, and Ewa ruled both at 3 months, which is a
 * `recheck`. A build that derives a kind from a bucket heading gets those two
 * wrong, and gets them wrong silently.
 */
export const RETEST_CADENCE: Record<ResultState, RetestCell> = {
  // ── `clinician-led` — no Andro Prime date at all. 10 states ──────────────
  // Ewa, CA-047 round 1 Q3 = A.
  //
  // ⚠ THE FIRST THREE CARRY TWO RULES AT ONCE, AND IT IS NOT A CONTRADICTION
  // (item 5). They are GP-routed AND get an immediate confirmatory recheck,
  // because the confirmatory second morning sample is precisely the thing a GP
  // needs in order to act. We supply it; we do not diagnose. That framing is
  // the recorded position from the 2026-06-04 low-T routing decision, and it is
  // what makes the immediate recheck defensible rather than opportunistic.
  'severely-low-testosterone': [CLINICIAN_LED_RULE, CONFIRM_RULE], // T < 5.2
  'low-testosterone': [CLINICIAN_LED_RULE, CONFIRM_RULE], //           T 5.2-8
  'equivocal-testosterone': [CLINICIAN_LED_RULE, CONFIRM_RULE], //     T 8-12
  'critically-low-vitamin-d': [CLINICIAN_LED_RULE], //                 < 25 nmol/L
  'high-crp': [CLINICIAN_LED_RULE], //                                 > 10 mg/L
  'low-ferritin': [CLINICIAN_LED_RULE], //                             < 30 µg/L
  'high-ferritin': [CLINICIAN_LED_RULE], //                            > 300 µg/L
  'low-albumin': [CLINICIAN_LED_RULE], //                              < 35 g/L
  // ⚠ These two were signed in the same Q3 answer but had NO ROW in the
  // sign-off table until 2026-09-15 — it was written before the 2026-08-07
  // upper bands existed and never gained them. Her answer covered ten states;
  // the table offered eight rows. Verified at the primary source (the Q3 mail
  // as sent, Gmail `1a0a69ae55223fe0`, ends "testosterone above 29 nmol/L,
  // vitamin D above 250 nmol/L"), never inferred from an adjacent answer.
  // 🔴 Their card COPY is a separate gate and it is still shut: both carry
  // NOT APPROVED markers in `biomarker-copy.ts` and have rendered since
  // 2026-08-07 (CA-044 §2 item A). A `clinician-led` cell carries no date and
  // no copy, so cadence is unaffected — but "row added" is not "card cleared".
  'high-testosterone': [CLINICIAN_LED_RULE], //                        T > 29
  'high-vitamin-d': [CLINICIAN_LED_RULE], //                           > 250 nmol/L

  // ── `recheck` — acting on a finding, 90 days. 10 states ──────────────────
  // Ewa, CA-047 round 1 Q2 = A and round 2 Q1-Q4.
  'normal-testosterone': [RECHECK_RULE], //     T 12-20. ⚠ proposed 3-6 months, NARROWED to 3
  'low-vitamin-d': [RECHECK_RULE], //           25-50 nmol/L
  'low-b12': [RECHECK_RULE], //                 active B12 < 25
  'borderline-b12': [RECHECK_RULE], //          active B12 25-70
  'suboptimal-ferritin': [RECHECK_RULE], //     30-100 µg/L. ⚠ proposed 3-4 months, NARROWED to 3
  // Both CRP states are 90 days on BOTH branches of the joint-symptom question.
  // Round 1 scoped itself to "no joint symptoms", so the joints = yes branch was
  // asked separately (round 2 Q2) rather than inferred. Them agreeing is the
  // answer, not an assumption — which is why cadence needs no joints branch.
  'elevated-crp': [RECHECK_RULE], //            hs-CRP 1-3
  'moderate-crp': [RECHECK_RULE], //            hs-CRP 3-10
  'ft-low': [RECHECK_RULE], //                  free T < lab reference low. Round 2 Q1
  // 🔴 THE TWO CELLS THIS WHOLE PROJECTION EXISTS FOR. In-range states, under an
  // "all-clear" bucket heading, ruled at 3 months. Round 2 Q3 = B and Q4 = B.
  // They also falsified the prepaid rule's original carve-out within 75 minutes,
  // because that carve-out was enumerated by MARKER; it is now scoped by rule
  // KIND, and `recheck` is outside the prepaid rule on the substance.
  'shbg-low': [RECHECK_RULE], //                < lab reference low
  'shbg-high': [RECHECK_RULE], //               > lab reference high

  // ── `maintenance` — nothing to fix, 6 to 12 months. 8 states ─────────────
  // Ewa, CA-047 round 1 Q1 = A and round 2 Q6.
  'optimal-testosterone': [MAINTENANCE_RULE], // T > 20 nmol/L
  'shbg-normal': [MAINTENANCE_RULE],
  'ft-normal': [MAINTENANCE_RULE],
  'normal-crp': [MAINTENANCE_RULE], //           <= 1 mg/L
  'normal-ferritin': [MAINTENANCE_RULE], //      100-300 µg/L
  'normal-b12': [MAINTENANCE_RULE], //           active B12 > 70
  'normal-albumin': [MAINTENANCE_RULE], //       >= 35 g/L
  // ⚠ A REAL DEFAULT, BY HER CHOICE AND AGAINST THIS REPO'S USUAL POSTURE.
  // Round 2 offered "no default at all, every marker ruled individually,
  // anything unruled shows no date" and she DECLINED it (Q6 = A). So a marker
  // added later inherits 6 to 12 months silently rather than showing nothing.
  // Recorded here so the next marker's author knows the default will catch
  // their state whether or not they think about it.
  'normal': [MAINTENANCE_RULE],

  // ── `seasonal` — a time of year, not an elapsed interval. 1 state ────────
  // Ewa, CA-047 round 2 Q5 = A. She declined "6 to 12 months like the other
  // in-range markers" and declined the hybrid. The card has said this for
  // months, so her answer changed no copy. See the file header for the guards.
  'normal-vitamin-d': [NORMAL_VITAMIN_D_RULE], // 50-250 nmol/L

  // ── `none` — report-only. 1 state ────────────────────────────────────────
  // Derived from Ewa ruling 8 (2026-06-16), not signed as cadence. Safe only
  // because the kind records the ABSENCE of a recommendation. 🔴 Giving FAI an
  // actual retest date would be a new clinical claim and needs Ewa.
  'fai-reported': [FAI_REPORTED_RULE],
}

/** The rules a state carries. Total by construction; there is no fallthrough. */
export function cadenceFor(state: ResultState): RetestCell {
  return RETEST_CADENCE[state]
}

/**
 * Whether a rule owes a date at all. The two kinds that owe none owe it for
 * opposite reasons (a GP decides the timing, versus we have no verdict), and
 * both are still an ANSWER rather than a gap — which is why an unresolvable
 * `seasonal` is a different thing from either and is reported separately.
 */
export function ruleOwesDate(rule: RetestRule): boolean {
  return rule.kind !== 'clinician-led' && rule.kind !== 'none'
}

/** One rule of one marker's state, and what it contributes to the reduction. */
export interface CadenceContribution {
  state: ResultState
  rule: RetestRule
  /** Days from the anchor, or `null` where this rule contributes no date. */
  days: number | null
}

/**
 * The whole-result answer. A Kit 3 carries nine markers and the customer needs
 * one date.
 *
 * 🔴 `unresolved` IS NOT DECORATION. A `seasonal` rule with no anchor date has
 * no answer at all, and the difference between "no retest is recommended" and
 * "a retest is recommended and we could not work out when" must survive the
 * reduction. `SingleResult.collectedAt` is nullable in the schema, so this is a
 * real runtime state. Collapsing it into `no-date` would reproduce the exact
 * defect the `seasonal` kind exists to close.
 */
export type ResultCadence =
  | {
      kind: 'scheduled'
      days: number
      driver: ResultState
      rule: RetestRule
      unresolved: readonly ResultState[]
    }
  | { kind: 'no-date'; unresolved: readonly ResultState[] }

/** Every rule of every state, flattened, with its contribution resolved. */
export function contributionsFor(
  states: readonly ResultState[],
  anchorIso: string | null,
): CadenceContribution[] {
  const out: CadenceContribution[] = []
  for (const state of states) {
    for (const rule of cadenceFor(state)) {
      out.push({ state, rule, days: intervalDaysFor(rule, anchorIso) })
    }
  }
  return out
}

/**
 * ✅ THE REDUCTION AS SIGNED — CA-047 round 1 Q4 = C, Ewa, 2026-09-15.
 *
 * 🔴 SHE REJECTED THE SUPPRESSION RULE BOTH DESIGN DOCUMENTS PROPOSED. Her
 * words: *"The vitamin D retest is scheduled normally. The two markers are
 * unrelated and the GP referral does not conflict with it."* So:
 *
 *   1. A `clinician-led` state yields no date for that marker and **suppresses
 *      nothing**. A GP-routed CRP and a low vitamin D on one result return a
 *      referral AND a 3-month vitamin D retest. That is the worked example as
 *      put to her.
 *   2. A `confirm` rule **always wins and is never suppressed**.
 *   3. Otherwise the shortest interval among the states that have one.
 *   4. If no state has one, there is no date.
 *
 * ⚠ RULE 2 IS A RULING, NOT AN OPTIMISATION. Today every `confirm` is zero
 * days, so "wins" and "shortest" happen to agree and the branch looks
 * redundant. It is written as its own branch because the agreement is a
 * coincidence of the current value: if Ewa ever moves the confirmatory recheck
 * off zero, a 90-day `recheck` would start beating it under a pure
 * shortest-wins rule and the confirmatory sample would silently stop being
 * scheduled. `scripts/test-retest-cadence-map.ts` asserts this against a
 * synthetic long `confirm` that no fixture produces.
 *
 * ⚠ TIES KEEP THE EARLIER CONTRIBUTION, so the reduction is deterministic in
 * input order. A tie is reachable: a `seasonal` marker resolving at exactly its
 * 90-day floor ties a `recheck`. Only `driver` differs; `days` is identical, and
 * `days` is what the customer sees.
 *
 * 🔴 WHAT THIS DELIBERATELY DOES NOT DECIDE: whether the result may OFFER the
 * retest for sale. That is `resultMayCarryRetestOffer()` in `retestGuidance.ts`
 * — CA-014 read at the result level — and it is a separate question from when
 * the retest is due. Ewa was asked whether a GP-routed marker changes the
 * SCHEDULE and said no; she was never asked whether it may be SOLD. Do not
 * merge the two here.
 */
export function reduceContributions(
  contributions: readonly CadenceContribution[],
): ResultCadence {
  const unresolved = contributions
    .filter((c) => ruleOwesDate(c.rule) && c.days === null)
    .map((c) => c.state)

  const dated = contributions.filter(
    (c): c is CadenceContribution & { days: number } => c.days !== null,
  )
  const confirms = dated.filter((c) => c.rule.kind === 'confirm')
  const pool = confirms.length > 0 ? confirms : dated

  if (pool.length === 0) return { kind: 'no-date', unresolved }

  let best = pool[0]
  for (const c of pool) if (c.days < best.days) best = c

  return {
    kind: 'scheduled',
    days: best.days,
    driver: best.state,
    rule: best.rule,
    unresolved,
  }
}

/** Nine markers, one date. The reduction applied to a whole result. */
export function resultCadenceFor(
  states: readonly ResultState[],
  anchorIso: string | null,
): ResultCadence {
  return reduceContributions(contributionsFor(states, anchorIso))
}
