// A FIXTURE PER SIGNED CELL — build-checklist item 6 of
// `2026-09-15-retest-cadence-by-rule-kind.md` §5, and the verification items 4
// and 5 owe. Same runner-free style as the other suites: assert loudly, exit
// non-zero on any failure. Run with `npm test` or
// `npx tsx scripts/test-retest-cadence-map.ts`.
//
// 🔴 WHY THIS SUITE HAD TO EXIST BEFORE THE MAP COULD BE WRITTEN. Until
// 2026-09-15 exactly one cadence cell was signed, so the map would have arrived
// INERT and the design doc leaned on that as its safety property. Every cell is
// signed now. The map is a live clinical instruction the moment a mechanism
// reads it, and "it cannot matter yet" has stopped being available as an
// argument — so the map carries a check that fails when the code and the
// sign-off disagree.
//
// ⚠ SECTION (1) IS AN INDEPENDENT RESTATEMENT, NOT A READ-BACK. Every rule is
// written out as a literal, from `2026-09-15-retest-cadence-by-rule-kind.md`
// §2, with the answer that signed it. It deliberately does NOT reuse
// `RECHECK_RULE` and friends: a test built from the same constants as the code
// asserts only that the code equals itself. Changing `RECHECK_DAYS` to 84 must
// fail here, loudly, because that number crosses the prepaid-or-included
// threshold and reopens a commercial decision.
//
// The other half of the coverage question lives in
// `scripts/verify-cadence-coverage.js`, which starts from the `ResultState`
// union and asserts both DOCUMENTS describe every state. That one catches a
// state nobody wrote down; this one catches a value that drifted.
//
// Covers:
//   (1) all thirty signed cells, restated from the sign-off
//   (2) coverage and the count per kind
//   (3) item 4: the integer 90, and nothing sub-90 that is not prepaid
//   (4) item 5: the dual rule on the three sub-12 testosterone states
//   (5) the reduction as signed (CA-047 round 1 Q4 = C), and the worked example
//   (6) `confirm` wins because it was ruled to, not because 0 is small
//   (7) no date and no ANSWER are different outcomes
//   (8) the duplicated 0 in lib/bundles/config.ts, held shut
//   (9) `clinician-led` and the GP badge are the same clinical fact
//  (10) the bucket-versus-kind trap that this projection exists for

import { CONFIRMATION_INTERVAL_DAYS } from '../lib/bundles/config'
import { BADGES, badgeFor } from '../lib/results/resultSeverity'
import {
  CONFIRM_DAYS,
  RECHECK_DAYS,
  RETEST_CADENCE,
  cadenceFor,
  contributionsFor,
  intervalDaysFor,
  reduceContributions,
  resultCadenceFor,
  type CadenceContribution,
  type RetestRule,
} from '../lib/results/retestCadence'
import { resultMayCarryRetestOffer } from '../lib/results/retestGuidance'
import type { ResultState } from '../lib/results/types'

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

/** Key-order-independent structural compare, so a literal can be diffed. */
function canon(v: unknown): string {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']'
  if (v === null || typeof v !== 'object') return JSON.stringify(v)
  const o = v as Record<string, unknown>
  return (
    '{' +
    Object.keys(o)
      .sort()
      .map((k) => JSON.stringify(k) + ':' + canon(o[k]))
      .join(',') +
    '}'
  )
}

// The state list comes from BADGES, which is a separate exhaustive
// `Record<ResultState, …>`, so section (2) is comparing two independently
// maintained maps rather than asking one map about itself.
const ALL_STATES = Object.keys(BADGES) as ResultState[]

const ANCHOR = '2026-07-03'

// ───────────────────────────────────────────────────────────────────────────
// (1) THE THIRTY SIGNED CELLS
//
// `Record<ResultState, …>` here is doing the same job it does in the map: a
// state added to the union without an expectation written for it is a COMPILE
// error in this file, not a silently unasserted cell.
// ───────────────────────────────────────────────────────────────────────────

interface SignedCell {
  /** The rules, as literals, in the order the map stores them. */
  rules: readonly RetestRule[]
  /** The answer that signed it. Quoted so a reviewer can go and check. */
  signed: string
}

const GP = { kind: 'clinician-led' } as const
const CONFIRMATORY = { kind: 'confirm', days: 0 } as const
const THREE_MONTHS = { kind: 'recheck', days: 90 } as const
const SIX_TO_TWELVE = { kind: 'maintenance', fromMonths: 6, toMonths: 12 } as const
const AUTUMN_WINTER = {
  kind: 'seasonal',
  window: { fromMonth: 10, fromDay: 1, toMonth: 3, toDay: 31 },
  minGapDays: 90,
  minSpanDays: 30,
} as const
const REPORT_ONLY = { kind: 'none' } as const

const SIGNED: Record<ResultState, SignedCell> = {
  // ── clinician-led, 10 states. CA-047 round 1 Q3 = A ─────────────────────
  'severely-low-testosterone': {
    rules: [GP, CONFIRMATORY],
    signed: 'r1 Q3 = A (no AP interval) + Ewa 2026-07-26 (the confirmatory 0)',
  },
  'low-testosterone': {
    rules: [GP, CONFIRMATORY],
    signed: 'r1 Q3 = A + Ewa 2026-07-26',
  },
  'equivocal-testosterone': {
    rules: [GP, CONFIRMATORY],
    signed: 'r1 Q3 = A + Ewa 2026-07-26',
  },
  'critically-low-vitamin-d': { rules: [GP], signed: 'r1 Q3 = A' },
  'high-crp': { rules: [GP], signed: 'r1 Q3 = A' },
  'low-ferritin': { rules: [GP], signed: 'r1 Q3 = A' },
  'high-ferritin': { rules: [GP], signed: 'r1 Q3 = A' },
  'low-albumin': { rules: [GP], signed: 'r1 Q3 = A' },
  // Signed in the same Q3 answer; the sign-off table gained their rows only on
  // 2026-09-15, having been written before the 2026-08-07 upper bands existed.
  'high-testosterone': { rules: [GP], signed: 'r1 Q3 = A, band named in the mail as sent' },
  'high-vitamin-d': { rules: [GP], signed: 'r1 Q3 = A, band named in the mail as sent' },

  // ── recheck, 10 states, 90 days. CA-047 r1 Q2 = A and r2 Q1-Q4 ─────────
  'normal-testosterone': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A, narrowed from 3-6 months' },
  'low-vitamin-d': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A' },
  'low-b12': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A' },
  'borderline-b12': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A' },
  'suboptimal-ferritin': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A, narrowed from 3-4 months' },
  'elevated-crp': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A (joints = no) and r2 Q2 (joints = yes)' },
  'moderate-crp': { rules: [THREE_MONTHS], signed: 'r1 Q2 = A (joints = no) and r2 Q2 (joints = yes)' },
  'ft-low': { rules: [THREE_MONTHS], signed: 'r2 Q1 = A' },
  'shbg-low': { rules: [THREE_MONTHS], signed: 'r2 Q3 = B — IN RANGE, and still a recheck' },
  'shbg-high': { rules: [THREE_MONTHS], signed: 'r2 Q4 = B — IN RANGE, and still a recheck' },

  // ── maintenance, 8 states, 6 to 12 months. CA-047 r1 Q1 = A and r2 Q6 ──
  'optimal-testosterone': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'shbg-normal': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'ft-normal': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'normal-crp': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'normal-ferritin': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'normal-b12': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'normal-albumin': { rules: [SIX_TO_TWELVE], signed: 'r1 Q1 = A' },
  'normal': { rules: [SIX_TO_TWELVE], signed: 'r2 Q6 = A — she DECLINED "no default at all"' },

  // ── seasonal, 1 state. CA-047 r2 Q5 = A ────────────────────────────────
  'normal-vitamin-d': { rules: [AUTUMN_WINTER], signed: 'r2 Q5 = A, "retest heading into autumn or winter"' },

  // ── none, 1 state. DERIVED from Ewa ruling 8, not signed as cadence ─────
  'fai-reported': { rules: [REPORT_ONLY], signed: 'ruling 8, 2026-06-16, "report-only, do not band it in men"' },
}

for (const state of ALL_STATES) {
  const expected = SIGNED[state]
  check(
    `(1) ${state} = ${expected.rules.map((r) => r.kind).join(' + ')}  [${expected.signed}]`,
    canon(cadenceFor(state)) === canon(expected.rules),
  )
}

// ───────────────────────────────────────────────────────────────────────────
// (2) COVERAGE, AND THE COUNT PER KIND
//
// The counts are the ones the sign-off document states in its own headings, so
// a cell quietly moving from one kind to another fails here even if both cells
// are individually plausible.
// ───────────────────────────────────────────────────────────────────────────

check('(2a) thirty result states', ALL_STATES.length === 30)
check('(2b) thirty cells', Object.keys(RETEST_CADENCE).length === 30)
check(
  '(2c) the cadence map and the badge map cover exactly the same states',
  canon(Object.keys(RETEST_CADENCE).sort()) === canon([...ALL_STATES].sort()),
)

const cells = ALL_STATES.map((s) => cadenceFor(s))
const allRules = cells.flat()
const countCells = (kind: RetestRule['kind']) =>
  cells.filter((c) => c.some((r) => r.kind === kind)).length

check('(2d) 10 clinician-led cells', countCells('clinician-led') === 10)
check('(2e) 10 recheck cells', countCells('recheck') === 10)
check('(2f) 8 maintenance cells', countCells('maintenance') === 8)
check('(2g) 1 seasonal cell', countCells('seasonal') === 1)
check('(2h) 1 none cell', countCells('none') === 1)
check('(2i) 3 confirm rules, all of them inside a dual cell', countCells('confirm') === 3)
check('(2j) 33 rules over 30 cells — the three duals are the difference', allRules.length === 33)
check('(2k) no cell is empty; an empty cell would be "nothing decided" reading as "nothing recommended"',
  cells.every((c) => c.length >= 1))

// ───────────────────────────────────────────────────────────────────────────
// (3) ITEM 4 — THE INTEGER 90, AND THE PREPAID-OR-INCLUDED FLOOR
//
// 🔴 THE RULE, `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §1: a
// result-triggered recheck landing less than 90 days after that result must be
// prepaid or included in an entitlement the customer already holds. It may
// never trigger a new sale.
//
// Expressed over the map rather than over a list of markers: NO cell may
// contribute a sub-90-day interval, except `confirm`, which is prepaid inside
// the Confirmation bundle by construction. Swept across a year of anchor dates
// because the one kind that resolves against the calendar can only be checked
// that way — "3 months" was found to be 89 to 92 days by exactly this method.
// ───────────────────────────────────────────────────────────────────────────

check('(3a) the recheck interval is the integer 90, never a month count', RECHECK_DAYS === 90)
check('(3b) and it is an integer, so no arithmetic can round it under the floor',
  Number.isInteger(RECHECK_DAYS))
check('(3c) every recheck rule carries exactly that value',
  allRules.filter((r) => r.kind === 'recheck').every((r) => r.days === RECHECK_DAYS))

const DAY_MS = 86_400_000
const violations: string[] = []
for (let t = Date.UTC(2026, 0, 1); t <= Date.UTC(2026, 11, 31); t += DAY_MS) {
  const anchor = new Date(t).toISOString().slice(0, 10)
  for (const state of ALL_STATES) {
    for (const rule of cadenceFor(state)) {
      const days = intervalDaysFor(rule, anchor)
      if (days === null || rule.kind === 'confirm') continue
      if (days < 90) violations.push(`${state} (${rule.kind}) = ${days}d on ${anchor}`)
    }
  }
}
check(`(3d) no cell contributes a sub-90-day interval on any 2026 anchor (${violations.length} violations)`,
  violations.length === 0)
if (violations.length > 0) console.error('    e.g. ' + violations.slice(0, 3).join('; '))

check('(3e) the only sub-90 interval in the whole map is the confirmatory recheck, which is prepaid',
  allRules.filter((r) => (r.kind === 'confirm' || r.kind === 'recheck') && r.days < 90)
    .every((r) => r.kind === 'confirm'))

// ───────────────────────────────────────────────────────────────────────────
// (4) ITEM 5 — THE DUAL RULE
//
// ⚠ TWO RULES ON ONE STATE IS THE DELIBERATE CASE, NOT A DATA ERROR. The three
// sub-12 testosterone states are GP-routed AND get an immediate confirmatory
// recheck, because the confirmatory second morning sample is the thing a GP
// needs in order to act. We supply it; we do not diagnose.
//
// The risk this section guards is a future tidy-up: a reader who sees a cell
// with two rules, decides one must be redundant, and deletes the one that does
// not match the badge. Either deletion does harm — dropping `confirm` removes
// the prepaid second sample, dropping `clinician-led` implies we are managing
// the result ourselves.
// ───────────────────────────────────────────────────────────────────────────

const DUAL_STATES: ResultState[] = [
  'severely-low-testosterone',
  'low-testosterone',
  'equivocal-testosterone',
]

const duals = ALL_STATES.filter((s) => cadenceFor(s).length > 1)
check('(4a) exactly three cells carry more than one rule', duals.length === 3)
check('(4b) and they are the three sub-12 testosterone states',
  canon([...duals].sort()) === canon([...DUAL_STATES].sort()))

for (const state of DUAL_STATES) {
  const kinds = cadenceFor(state).map((r) => r.kind)
  check(`(4c) ${state} carries clinician-led`, kinds.includes('clinician-led'))
  check(`(4d) ${state} carries confirm as well`, kinds.includes('confirm'))
  const reduced = resultCadenceFor([state], ANCHOR)
  check(`(4e) ${state} reduces to the confirmatory recheck, not to "no date"`,
    reduced.kind === 'scheduled' && reduced.rule.kind === 'confirm' && reduced.days === 0)
}

// The reduction must not depend on which rule happens to be written first.
const reversedDual: CadenceContribution[] = [
  { state: 'low-testosterone', rule: { kind: 'confirm', days: 0 }, days: 0 },
  { state: 'low-testosterone', rule: { kind: 'clinician-led' }, days: null },
]
const reversedResult = reduceContributions(reversedDual)
check('(4f) the dual reduces the same way whichever order the cell lists the two rules',
  reversedResult.kind === 'scheduled' &&
    reversedResult.rule.kind === 'confirm' &&
    reversedResult.days === 0)

check('(4h) a dual state still carries the GP badge — the confirm does not soften the routing',
  DUAL_STATES.every((s) => badgeFor(s).label === 'See Your GP'))

// ───────────────────────────────────────────────────────────────────────────
// (5) THE REDUCTION AS SIGNED — CA-047 round 1 Q4 = C, Ewa, 2026-09-15
//
// 🔴 SHE REJECTED THE SUPPRESSION RULE BOTH DESIGN DOCUMENTS PROPOSED.
// "The vitamin D retest is scheduled normally. The two markers are unrelated
// and the GP referral does not conflict with it."
//
// The worked example below is the one that was put to her, so it is pinned
// here rather than paraphrased.
// ───────────────────────────────────────────────────────────────────────────

const worked = resultCadenceFor(['high-crp', 'low-vitamin-d'], ANCHOR)
check('(5a) the worked example schedules a date at all — the GP referral suppresses nothing',
  worked.kind === 'scheduled')
check('(5b) and it is the 3-month vitamin D retest, driven by the vitamin D',
  worked.kind === 'scheduled' && worked.days === 90 && worked.driver === 'low-vitamin-d')
check('(5c) the CRP contributes no date of its own',
  intervalDaysFor({ kind: 'clinician-led' }, ANCHOR) === null)

// 🔴 THE BOUNDARY THAT MUST NOT BE MERGED. Cadence says WHEN. CA-014 at the
// result level says whether we may SELL it. Ewa was asked whether a GP-routed
// marker changes the SCHEDULE (no); she was never asked whether it may be SOLD.
// So on this exact result the retest is scheduled AND the offer is suppressed,
// and both are correct at once.
check('(5d) the same result may NOT carry a retest offer — scheduling it is not selling it',
  !resultMayCarryRetestOffer(['high-crp', 'low-vitamin-d']))

// A whole panel of GP-routed markers: every marker yields no date, and there is
// nothing left to be shortest.
const allGp = resultCadenceFor(['high-crp', 'low-ferritin', 'low-albumin'], ANCHOR)
check('(5e) a wholly GP-routed result has no Andro Prime date', allGp.kind === 'no-date')
check('(5f) and nothing about it is "unresolved" — no date is the ANSWER there',
  allGp.unresolved.length === 0)

// Shortest wins among the states that have one.
const mixed = resultCadenceFor(['optimal-testosterone', 'low-b12', 'normal-crp'], ANCHOR)
check('(5g) the shortest interval wins',
  mixed.kind === 'scheduled' && mixed.days === 90 && mixed.driver === 'low-b12')

const allClear = resultCadenceFor(['optimal-testosterone', 'normal-crp', 'normal-b12'], ANCHOR)
check('(5h) an all-clear panel is the 6-month near edge, not the 12-month far one',
  allClear.kind === 'scheduled' && allClear.days === 183 && allClear.rule.kind === 'maintenance')

// A realistic Kit 3: nine markers, one date.
const kit3: ResultState[] = [
  'equivocal-testosterone',
  'shbg-normal',
  'ft-low',
  'low-vitamin-d',
  'normal-crp',
  'suboptimal-ferritin',
  'normal-b12',
  'normal-albumin',
  'fai-reported',
]
const kit3Cadence = resultCadenceFor(kit3, ANCHOR)
check('(5i) a nine-marker Kit 3 returns exactly one date',
  kit3Cadence.kind === 'scheduled')
check('(5j) and the sub-12 testosterone takes it to the confirmatory recheck',
  kit3Cadence.kind === 'scheduled' && kit3Cadence.days === 0 && kit3Cadence.rule.kind === 'confirm')
check('(5k) nine markers produced ten rules, because one state is dual',
  contributionsFor(kit3, ANCHOR).length === 10)

// ───────────────────────────────────────────────────────────────────────────
// (6) `confirm` WINS BECAUSE IT WAS RULED TO, NOT BECAUSE ZERO IS SMALL
//
// ⚠ TODAY EVERY CONFIRM IS ZERO DAYS, so "always wins" and "shortest wins"
// agree, and the branch that implements rule 2 looks redundant. It is not: the
// agreement is a coincidence of the current value. If Ewa ever moves the
// confirmatory recheck off zero — the BSSM minimum-gap consideration that was
// reviewed and set aside in 2026-07 is exactly the kind of thing that would do
// it — a 90-day recheck on another marker would start beating it under a pure
// shortest-wins rule, and the confirmatory sample would silently stop being
// scheduled.
//
// No fixture produces a long `confirm`, so this is asserted against a synthetic
// contribution built by hand for this assertion alone.
// ───────────────────────────────────────────────────────────────────────────

const synthetic: CadenceContribution[] = [
  { state: 'low-vitamin-d', rule: { kind: 'recheck', days: 90 }, days: 90 },
  { state: 'low-testosterone', rule: { kind: 'confirm', days: 180 }, days: 180 },
]
const syntheticResult = reduceContributions(synthetic)
check('(6a) a LONGER confirm still wins over a shorter recheck',
  syntheticResult.kind === 'scheduled' && syntheticResult.rule.kind === 'confirm')
check('(6b) and it wins with its own interval, not the shorter one',
  syntheticResult.kind === 'scheduled' && syntheticResult.days === 180)
check('(6c) negative control: with the confirm removed, the recheck wins',
  (() => {
    const r = reduceContributions([synthetic[0]])
    return r.kind === 'scheduled' && r.days === 90
  })())

// ───────────────────────────────────────────────────────────────────────────
// (7) "NO DATE" AND "NO ANSWER" ARE DIFFERENT OUTCOMES
//
// 🔴 A `seasonal` rule with no anchor has no answer at all. `collectedAt` is
// nullable in the schema, so this is a real runtime state rather than a
// theoretical one. Collapsing it into "no retest recommended" would reproduce
// the exact defect the seasonal kind exists to close: a confident wrong answer
// on the most common in-range result the UK produces.
// ───────────────────────────────────────────────────────────────────────────

const seasonalNoAnchor = resultCadenceFor(['normal-vitamin-d'], null)
check('(7a) a seasonal cell with no anchor yields no date', seasonalNoAnchor.kind === 'no-date')
check('(7b) and says so out loud, by name',
  seasonalNoAnchor.unresolved.includes('normal-vitamin-d'))

const fai = resultCadenceFor(['fai-reported'], ANCHOR)
check('(7c) a report-only result yields no date', fai.kind === 'no-date')
check('(7d) and reports NOTHING unresolved, because no date IS the answer for it',
  fai.unresolved.length === 0)

check('(7e) the same distinction holds for clinician-led: an answer, not a gap',
  resultCadenceFor(['high-crp'], null).unresolved.length === 0)

// An unresolvable seasonal marker must not take the rest of the panel with it.
const seasonalPlus = resultCadenceFor(['normal-vitamin-d', 'low-b12'], null)
check('(7f) an unresolvable marker does not suppress the markers that did resolve',
  seasonalPlus.kind === 'scheduled' && seasonalPlus.days === 90)
check('(7g) and the unresolved one is still reported',
  seasonalPlus.unresolved.includes('normal-vitamin-d'))

// ───────────────────────────────────────────────────────────────────────────
// (8) THE DUPLICATED ZERO, HELD SHUT
//
// The same clinical ruling (Ewa, 2026-07-26) is stored twice: here, and as
// `CONFIRMATION_INTERVAL_DAYS` in `lib/bundles/config.ts`, which the bundle
// dispatch path reads. The map does not import it, because `config.ts` reaches
// `classifier.ts` and `classifier.ts` is where the map gets wired in next.
//
// ⚠ A DUPLICATED FACT IS INVISIBLE EXACTLY WHILE THE COPIES AGREE, so it gets
// an assertion rather than a comment. If this ever fails, the fix is to decide
// which one is right and make the other read from it — not to update both.
// ───────────────────────────────────────────────────────────────────────────

check('(8a) the map and the bundle config state the same confirmatory interval',
  CONFIRM_DAYS === CONFIRMATION_INTERVAL_DAYS)
check('(8b) and it is still the zero Ewa signed on 2026-07-26', CONFIRM_DAYS === 0)

// ───────────────────────────────────────────────────────────────────────────
// (9) `clinician-led` AND THE GP BADGE ARE THE SAME CLINICAL FACT
//
// Two independently maintained maps encode "this result goes to a doctor":
// `BADGES` renders "See Your GP", and this map withholds an Andro Prime date.
// `resultMayCarryRetestOffer()` derives from the badge, so if the two ever
// disagree the product would route a man to his GP on the card while quietly
// scheduling him a retest, or the reverse.
//
// ⚠ IF YOU ARE HERE BECAUSE THIS FAILED, it is a question, not a typo: decide
// whether the new state is GP-routed, and make BOTH maps say so.
// ───────────────────────────────────────────────────────────────────────────

for (const state of ALL_STATES) {
  const gpBadge = badgeFor(state).label === 'See Your GP'
  const gpCell = cadenceFor(state).some((r) => r.kind === 'clinician-led')
  check(`(9) ${state}: badge and cadence agree on GP routing (${gpBadge ? 'GP' : 'not GP'})`,
    gpBadge === gpCell)
}

// ───────────────────────────────────────────────────────────────────────────
// (10) THE BUCKET-VERSUS-KIND TRAP
//
// 🔴 THIS IS WHY THE PROJECTION EXISTS AT ALL. The sign-off table groups states
// into three presentational buckets. After round 2 the buckets and the kinds no
// longer agree: `shbg-low` and `shbg-high` are IN-RANGE states, sitting under an
// "all-clear / maintenance" heading, ruled at 3 months. A build that derived a
// kind from a bucket heading would get them wrong, and would get them wrong
// silently, because nothing about the result looks alarming.
// ───────────────────────────────────────────────────────────────────────────

for (const state of ['shbg-low', 'shbg-high'] as ResultState[]) {
  check(`(10a) ${state} is a recheck despite sitting in the all-clear bucket`,
    cadenceFor(state)[0].kind === 'recheck')
  check(`(10b) ${state} badges as Monitor, so the bucket heading is not the tell`,
    badgeFor(state).label === 'Monitor')
}
check('(10c) shbg-normal, by contrast, IS maintenance — the trap is the two edges, not SHBG',
  cadenceFor('shbg-normal')[0].kind === 'maintenance')

// ───────────────────────────────────────────────────────────────────────────

const byKind = new Map<string, number>()
for (const r of allRules) byKind.set(r.kind, (byKind.get(r.kind) ?? 0) + 1)
console.log('')
console.log('  RETEST_CADENCE, as built:')
console.log(`    ${ALL_STATES.length} states, ${allRules.length} rules, ${duals.length} dual cells`)
for (const [kind, n] of [...byKind].sort()) console.log(`    ${kind.padEnd(14)} ${n}`)
console.log(`    sub-90-day intervals outside the prepaid confirm: ${violations.length}`)
console.log('')

console.log(`test-retest-cadence-map: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
