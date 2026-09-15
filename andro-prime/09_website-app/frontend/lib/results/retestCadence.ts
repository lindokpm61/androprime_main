/**
 * THE `seasonal` RETEST RULE KIND, and the rule union it completes.
 * PURE: no database, no env, NO CLOCK. The anchor date is always an argument.
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
 * ── WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN ──────────────────────────
 * 🔴 NO `RETEST_CADENCE` MAP — STILL, BUT NO LONGER BECAUSE IT IS BLOCKED.
 * ✅ All four blockers closed 2026-09-15: the `seasonal` kind (item 1), the two
 * missing signed rows (item 2), the `fai-reported` cell (item 2b) and the
 * re-homed anti-upsell guard (item 3). **What remains is the build itself**,
 * checklist items 4 to 6, and it is deliberately not done here: writing the map
 * is what makes this module live, and the map moves real dates the moment it is
 * read. Shipping the kinds without it is what keeps this change inert.
 *
 * ⚠ WHOEVER WRITES THE MAP OWNS THREE THINGS THIS FILE DOES NOT. Item 4: store
 * every `recheck` as the integer `{ days: 90 }`, never a month count. Item 5:
 * assert the DUAL rule on the three sub-12 testosterone states, which carry
 * `clinician-led` and `confirm` at once, deliberately. Item 6: a fixture per
 * signed cell — the map can no longer rely on arriving inert, because every
 * cell is signed now.
 *
 * 🔴 NO CUSTOMER-FACING SENTENCE. `biomarker-copy.ts` already carries Ewa's
 * approved wording for this state, verbatim, and has for months — which is why
 * her answer changes no copy. Surfacing the COMPUTED window to a customer as a
 * date would be new copy and needs its own pre-flight. Do not.
 */

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
 * THE SIX KINDS. `Record<ResultState, RetestRule>` over this union is what
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
 * 🔴 NOT THE WHOLE REDUCTION. Rule 2 (`confirm` always wins and is never
 * suppressed) belongs with the map, and the map is still blocked. This function
 * is only the per-rule half, so that the seasonal kind's contribution is
 * defined before anything reduces over it.
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
