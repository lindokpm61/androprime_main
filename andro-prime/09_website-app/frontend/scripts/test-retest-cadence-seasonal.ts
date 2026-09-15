// Unit tests for the `seasonal` retest rule kind (lib/results/retestCadence.ts),
// build-checklist item 1 of `2026-09-15-retest-cadence-by-rule-kind.md`.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or
// `npx tsx scripts/test-retest-cadence-seasonal.ts`.
//
// 🔴 MOST OF THIS SUITE IS A CALENDAR SWEEP, NOT A HANDFUL OF EXAMPLES, AND
// THAT IS THE POINT. The defect this kind exists to avoid is a boundary nobody
// chose deciding a man's outcome by the month his blood happened to be drawn.
// That is invisible to spot-checks and obvious to a sweep: it is exactly how
// "3 months" was found to be 89 to 92 days
// (`2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2a), and the same
// method is applied here to the rule that replaced it.
//
// Covers:
//   (1) the prepaid-or-included floor, asserted over every anchor date
//   (2) the sampling window always lands inside the UK vitamin D season
//   (3) the minimum usable span, and the December cliff it places
//   (4) the bound against `maintenance`: seasonal is never the later answer
//   (5) a null anchor fails LOUDLY and never resolves to a date
//   (6) the worked examples in the design doc, pinned so the two cannot drift

import {
  FAI_REPORTED_RULE,
  NORMAL_VITAMIN_D_RULE,
  SEASONAL_MIN_GAP_DAYS,
  SEASONAL_MIN_SPAN_DAYS,
  UK_VITAMIN_D_SEASON,
  intervalDaysFor,
  resolveSeasonal,
  type RetestRule,
} from '../lib/results/retestCadence'
import { mayCarryPurchaseLink, retestGuidanceFor } from '../lib/results/retestGuidance'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

const SEASONAL = NORMAL_VITAMIN_D_RULE as Extract<RetestRule, { kind: 'seasonal' }>
const DAY_MS = 86_400_000

// ───────────────────────────────────────────────────────────────────────────
// The sweep: every anchor date across three years, including a leap year.
// ───────────────────────────────────────────────────────────────────────────

interface Row {
  anchor: string
  from: string
  to: string
  gapDays: number
  spanDays: number
}

const rows: Row[] = []
for (
  let t = Date.UTC(2026, 0, 1);
  t <= Date.UTC(2028, 11, 31);
  t += DAY_MS
) {
  const anchor = new Date(t).toISOString().slice(0, 10)
  const r = resolveSeasonal(SEASONAL, anchor)
  if (!r.ok) {
    failures += 1
    console.error(`[FAIL] (0) sweep: ${anchor} did not resolve (${r.reason})`)
    continue
  }
  rows.push({ anchor, from: r.from, to: r.to, gapDays: r.gapDays, spanDays: r.spanDays })
}

check('(0a) the sweep covers 1096 anchor dates, 2026 to 2028 inclusive',
  rows.length === 1096)
check('(0b) 2028 is a leap year and its 29 February is in the sweep',
  rows.some((r) => r.anchor === '2028-02-29'))

// ───────────────────────────────────────────────────────────────────────────
// (1) THE PREPAID-OR-INCLUDED FLOOR
//
// `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §1 and §8: a
// result-triggered recheck landing under 90 days must be prepaid or included,
// and no cadence cell may carry a sub-90-day interval for a customer holding
// neither. `seasonal` is INSIDE that rule — the carve-out in §2 was granted to
// the `recheck` kind on the substance and does not reach this one.
//
// The unguarded rule violates it badly: a result on 30 September yields a
// retest on 1 October, one day later, on a NORMAL result. This is the assertion
// that stops that ever shipping.
// ───────────────────────────────────────────────────────────────────────────

const under90 = rows.filter((r) => r.gapDays < SEASONAL_MIN_GAP_DAYS)
check('(1a) no anchor date produces a retest under 90 days', under90.length === 0)
if (under90.length > 0) {
  console.error(`        first offender: ${under90[0].anchor} -> ${under90[0].from} (${under90[0].gapDays}d)`)
}
check('(1b) the floor is actually reached, so it is a live constraint and not a coincidence',
  rows.some((r) => r.gapDays === SEASONAL_MIN_GAP_DAYS))
check('(1c) the floor constant is the one the prepaid rule sets',
  SEASONAL_MIN_GAP_DAYS === 90)

// ───────────────────────────────────────────────────────────────────────────
// (2) THE SAMPLING DATE IS ALWAYS IN SEASON
//
// The whole ruling is "retest heading into autumn or winter". A window that
// opened in April would satisfy every other assertion here and still be wrong.
// ───────────────────────────────────────────────────────────────────────────

function monthOf(iso: string): number {
  return Number(iso.slice(5, 7))
}

const outOfSeason = rows.filter((r) => {
  const m = monthOf(r.from)
  return !(m >= UK_VITAMIN_D_SEASON.fromMonth || m <= UK_VITAMIN_D_SEASON.toMonth)
})
check('(2a) every window opens inside October to March', outOfSeason.length === 0)
check('(2b) every window closes on 31 March', rows.every((r) => r.to.slice(5) === '03-31'))

// ───────────────────────────────────────────────────────────────────────────
// (3) THE MINIMUM USABLE SPAN, AND WHERE IT PLACES THE CLIFF
//
// A window is an arc and the year is a circle, so a rule of this shape has
// exactly one discontinuity per year. It cannot be removed, only placed, and
// the placement is the design decision. These assertions pin it.
//
// ⚠ (3c) IS THE ONE THAT MATTERS CLINICALLY. Without the minimum span the cliff
// sits at 31 December; without the 90-day floor it sits at 30 September, which
// is the worst possible place because it lands on men with summer readings —
// precisely the cohort the ruling exists for. At 30 days it sits in early
// December, where the men on the far side already hold an in-season reading.
// ───────────────────────────────────────────────────────────────────────────

check('(3a) no window is shorter than the minimum usable span',
  rows.every((r) => r.spanDays >= SEASONAL_MIN_SPAN_DAYS))
check('(3b) the span floor is actually reached',
  rows.some((r) => r.spanDays === SEASONAL_MIN_SPAN_DAYS))

const cliffs: Row[] = []
for (let i = 1; i < rows.length; i++) {
  if (Math.abs(rows[i].gapDays - rows[i - 1].gapDays) > 5) cliffs.push(rows[i])
}
check('(3c) there is exactly one discontinuity per year and no more',
  cliffs.length === 3)
check('(3d) every discontinuity falls in December, never in autumn',
  cliffs.every((r) => monthOf(r.anchor) === 12))
if (cliffs.length !== 3 || !cliffs.every((r) => monthOf(r.anchor) === 12)) {
  console.error(`        cliffs found at: ${cliffs.map((r) => r.anchor).join(', ')}`)
}

// ───────────────────────────────────────────────────────────────────────────
// (4) SEASONAL IS NEVER THE LATER ANSWER
//
// `maintenance` is 6 to 12 months and is what `normal-vitamin-d` would have got
// had Ewa taken the option she declined. This bounds the change she made: the
// seasonal kind can bring a man forward, never push him past the window he
// would otherwise have been given. That is what makes adopting it safe.
// ───────────────────────────────────────────────────────────────────────────

const MAINTENANCE_OUTER_DAYS = 365
check('(4a) no anchor is pushed beyond the 12-month edge of maintenance',
  rows.every((r) => r.gapDays <= MAINTENANCE_OUTER_DAYS))
check('(4b) the longest wait is the December cliff, and it is under ten months',
  Math.max(...rows.map((r) => r.gapDays)) === 302)

// ⚠ REGRESSION GUARD ON A REJECTED FORMULATION. "Require the whole window to be
// ahead of the anchor" is the obvious alternative and it reads correctly. It is
// wrong: it pushes an August result to the FOLLOWING October, fourteen months
// out, missing the winter entirely — and an August result is the exact "summer
// levels are good" case Ewa's sentence describes. The rule clamps INTO the
// window instead, and this is what stops that being quietly reverted.
const august = rows.find((r) => r.anchor === '2026-08-05')!
check('(4c) an August result still reaches the COMING winter, not the next one',
  august.from === '2026-11-03' && august.gapDays === 90)

// ───────────────────────────────────────────────────────────────────────────
// (5) A MISSING ANCHOR FAILS LOUDLY
//
// 🔴 THE DIRECTION THAT WOULD HARM SOMEBODY. `collectedAt` reads `received_at`
// and is nullable, so this is a real runtime state. Seasonal is the only kind
// that cannot answer without a date, and every silent thing it could do instead
// — a date anyway, "no date", `clinician-led` — reproduces the defect the fifth
// kind was created to close. This repo has paid twice for a clinical
// instruction implemented as an omission.
// ───────────────────────────────────────────────────────────────────────────

const noAnchor = resolveSeasonal(SEASONAL, null)
check('(5a) a null anchor does not resolve', !noAnchor.ok)
check('(5b) and says why', !noAnchor.ok && noAnchor.reason === 'no-anchor')

const badAnchor = resolveSeasonal(SEASONAL, 'not-a-date')
check('(5c) an unparseable anchor does not resolve', !badAnchor.ok)
check('(5d) and says why', !badAnchor.ok && badAnchor.reason === 'invalid-anchor')

check('(5e) a timestamp anchor resolves, not just a bare date',
  resolveSeasonal(SEASONAL, '2026-07-03T09:14:00.000Z').ok)

// ───────────────────────────────────────────────────────────────────────────
// (6) THE WORKED EXAMPLES, PINNED
//
// These are the rows printed in the design doc. Pinned here so the document and
// the code cannot drift apart silently, which is the failure this repo traces
// most of its contradictions to.
// ───────────────────────────────────────────────────────────────────────────

const EXPECTED: [string, string, string, number][] = [
  // anchor        from          to            gapDays
  ['2026-04-01', '2026-10-01', '2027-03-31', 183],
  ['2026-06-15', '2026-10-01', '2027-03-31', 108],
  ['2026-07-03', '2026-10-01', '2027-03-31', 90],
  ['2026-08-05', '2026-11-03', '2027-03-31', 90],
  ['2026-09-30', '2026-12-29', '2027-03-31', 90],
  ['2026-10-15', '2027-01-13', '2027-03-31', 90],
  ['2026-12-02', '2027-03-02', '2027-03-31', 90],
  ['2026-12-03', '2027-10-01', '2028-03-31', 302],
  ['2027-01-20', '2027-10-01', '2028-03-31', 254],
  ['2027-03-31', '2027-10-01', '2028-03-31', 184],
]

for (const [anchor, from, to, gapDays] of EXPECTED) {
  const r = resolveSeasonal(SEASONAL, anchor)
  check(`(6) ${anchor} -> ${from} .. ${to} (${gapDays}d)`,
    r.ok && r.from === from && r.to === to && r.gapDays === gapDays)
}

// ───────────────────────────────────────────────────────────────────────────
// (7) THE REDUCTION CONTRIBUTION
//
// ✅ Signed, CA-047 round 1 Q4 = C: cadence is decided per marker, and a
// `clinician-led` marker contributes nothing and suppresses nothing. Ewa
// rejected the suppression rule both design documents proposed.
// ───────────────────────────────────────────────────────────────────────────

check('(7a) clinician-led contributes no interval',
  intervalDaysFor({ kind: 'clinician-led' }, '2026-07-03') === null)
check('(7b) and contributing none is not the same as contributing zero',
  intervalDaysFor({ kind: 'clinician-led' }, '2026-07-03') !== 0)
check('(7c) a recheck contributes its stored integer, unchanged',
  intervalDaysFor({ kind: 'recheck', days: 90 }, '2026-07-03') === 90)
check('(7d) a confirm contributes 0, which must survive the reduction',
  intervalDaysFor({ kind: 'confirm', days: 0 }, '2026-07-03') === 0)
check('(7e) seasonal contributes its gap',
  intervalDaysFor(SEASONAL, '2026-07-03') === 90)
check('(7f) seasonal with no anchor contributes nothing rather than a guess',
  intervalDaysFor(SEASONAL, null) === null)
check('(7g) maintenance contributes its near edge, about six months',
  intervalDaysFor({ kind: 'maintenance', fromMonths: 6, toMonths: 12 }, '2026-07-03') === 183)

// ───────────────────────────────────────────────────────────────────────────
// (8) THE `none` KIND, AND WHY IT IS NOT `clinician-led`
//
// 🔴 THE TWO KINDS THAT BOTH YIELD NO DATE ARE THE EASIEST PAIR IN THIS UNION
// TO COLLAPSE, AND COLLAPSING THEM WOULD DO REAL HARM. `clinician-led` asserts
// that a doctor decides the timing, and the card renders a GP referral.
// `none` asserts nothing at all. Borrowing the former for `fai-reported` would
// put a GP route on a report-only marker — the FAI `default:` defect in a new
// place, and this repo has already paid for that one.
//
// So these assertions are not about arithmetic. They exist to make the
// collapse a test failure rather than a plausible-looking simplification.
// ───────────────────────────────────────────────────────────────────────────

check('(8a) fai-reported carries the `none` kind',
  FAI_REPORTED_RULE.kind === 'none')
check('(8b) none contributes no interval',
  intervalDaysFor(FAI_REPORTED_RULE, '2026-07-03') === null)
check('(8c) and contributing none is not contributing zero',
  intervalDaysFor(FAI_REPORTED_RULE, '2026-07-03') !== 0)
check('(8d) none needs no anchor to answer, unlike seasonal',
  intervalDaysFor(FAI_REPORTED_RULE, null) === null)

// The distinction itself, asserted from both sides.
check('(8e) `none` and `clinician-led` are DIFFERENT kinds, not aliases',
  FAI_REPORTED_RULE.kind !== ({ kind: 'clinician-led' } as RetestRule).kind)
check('(8f) they agree on the interval, which is exactly why the kinds must differ',
  intervalDaysFor(FAI_REPORTED_RULE, '2026-07-03')
    === intervalDaysFor({ kind: 'clinician-led' }, '2026-07-03'))

// ⚠ THE MIRROR THAT JUSTIFIES THE SHAPE. `retestGuidance.ts` faced the identical
// question about GUIDANCE for this same marker and answered it with its own
// `none` rather than reusing a neighbour. If that ever stops being true, the
// argument for this kind's shape has moved and somebody should know.
check('(8g) retestGuidance still gives fai-reported its own `none`, which is the precedent this mirrors',
  retestGuidanceFor('fai-reported').kind === 'none')
check('(8h) and FAI still may not carry a purchase link',
  !mayCarryPurchaseLink('fai-reported'))

// ───────────────────────────────────────────────────────────────────────────

const gaps = rows.map((r) => r.gapDays)
console.log('')
console.log('  The seasonal kind, swept over 1096 anchor dates (2026-2028):')
console.log(`    retest gap:        ${Math.min(...gaps)} to ${Math.max(...gaps)} days`)
console.log(`    sampling window:   ${Math.min(...rows.map((r) => r.spanDays))} to ${Math.max(...rows.map((r) => r.spanDays))} days long`)
console.log(`    under 90 days:     ${under90.length}  (the prepaid rule's threshold)`)
console.log(`    discontinuities:   ${cliffs.length} in three years, at ${cliffs.map((r) => r.anchor).join(', ')}`)
console.log('')

console.log(`test-retest-cadence-seasonal: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
