/*
 * `lib/membership/retestPanel.ts`: which kit an included retest should be.
 *
 *   npx tsx scripts/test-retest-panel.ts
 *
 * The rule (Keith, 2026-09-12, defect D1) is that the retest panel follows what
 * was FLAGGED, not what was bought. Four things here are load-bearing and the
 * rest are worked examples:
 *
 *   (1) THE DUPLICATED FACT. `PANEL_MARKER_ID_BY_RESULT_NAME` restates the nine
 *       marker names `classifier.ts` switches on. Section 1 reads the classifier
 *       source and asserts the two agree, so renaming a marker or adding one
 *       fails here rather than making that marker invisible to the rule.
 *
 *   (2) THE PRICE ORDER. Kit 2 has FOUR markers and Kit 1 has FIVE, but Kit 2 is
 *       the dearer of the two. Anything that sorts by panel size picks the more
 *       expensive kit whenever both cover the set, and the mistake is silent
 *       because the answer is still a kit that measures the right markers.
 *
 *   (3) THE SAFETY INVARIANT. A member can never be sent a panel narrower than
 *       his flagged markers, nor dearer than the kit he took. Section 4 asserts
 *       it over every kit and every non-empty subset of its panel, which is 557
 *       cases, rather than over the three examples in the defect register. 46 of
 *       them narrow to a cheaper kit, so the assertion is not vacuous.
 *
 *   (4) THE BLAST RADIUS. Section 7 answers Keith's question of 2026-09-12: does
 *       this not just come back to whatever they ordered? For Kit 1 and Kit 2
 *       buyers it does, exactly, in all 15 of their flag combinations, because
 *       those two panels share no markers. Only a Kit 3 buyer can be narrowed,
 *       and only in 30 of his 255. That is the property that makes the rule safe
 *       to ship, so it is asserted rather than reasoned about.
 */
import fs from 'fs'
import path from 'path'
import {
  KIT_PANELS,
  KITS_BY_PRICE,
  PANEL_MARKER_ID_BY_RESULT_NAME,
  cheapestKitCovering,
  panelMarkerIdFor,
  type PanelMarkerId,
} from '../lib/kits/panel'
import { PRICING } from '../lib/pricing'
import { selectRetestPanel, type RetestMarker } from '../lib/membership/retestPanel'
import { isFlaggedState } from '../lib/results/resultSeverity'
import type { KitType, ResultState } from '../lib/results/types'
import { SCENARIOS } from '../lib/results/fixtures'
import { DEMO_BASELINE_SCENARIO, DEMO_RETEST_SCENARIO } from '../lib/results/demo'
import { buildDashboardFromScenario } from '../lib/results/buildDashboardFromScenario'

let passed = 0
let failed = 0
function check(name: string, ok: boolean) {
  if (ok) {
    passed += 1
  } else {
    failed += 1
    console.error(`  FAIL ${name}`)
  }
}

function m(markerName: string, state: ResultState): RetestMarker {
  return { markerName, state }
}

const priceOf: Record<KitType, number> = {
  testosterone: PRICING.KIT_1.rrp,
  'energy-recovery': PRICING.KIT_2.rrp,
  'hormone-recovery': PRICING.KIT_3.rrp,
}

// ───────────────────────────────────────────────────────────────────────────
// (1) The map restates the classifier's vocabulary, so it is checked against it
// ───────────────────────────────────────────────────────────────────────────

const classifierSrc = fs.readFileSync(
  path.resolve(__dirname, '..', 'lib', 'results', 'classifier.ts'),
  'utf8',
)
const caseNames = new Set(
  (classifierSrc.match(/case '([^']+)'/g) ?? []).map((s) => s.slice(6, -1)),
)
const mapKeys = new Set(Object.keys(PANEL_MARKER_ID_BY_RESULT_NAME))

check('(1a) the classifier still switches on marker names at all', caseNames.size > 0)
check(
  '(1b) every marker name the classifier handles has a panel id',
  [...caseNames].every((n) => mapKeys.has(n)),
)
check(
  '(1c) the map invents no marker the classifier does not handle',
  [...mapKeys].every((n) => caseNames.has(n)),
)
check(
  '(1d) the map reaches every marker on the panel',
  new Set(Object.values(PANEL_MARKER_ID_BY_RESULT_NAME)).size ===
    new Set(KIT_PANELS['hormone-recovery']).size,
)
check('(1e) an unknown marker name resolves to null', panelMarkerIdFor('Cortisol') === null)

// ───────────────────────────────────────────────────────────────────────────
// (2) Price order, which is NOT panel size
// ───────────────────────────────────────────────────────────────────────────

check(
  '(2a) kits are ordered by price, cheapest first',
  KITS_BY_PRICE.every((kit, i) => i === 0 || priceOf[KITS_BY_PRICE[i - 1]] <= priceOf[kit]),
)
check(
  '(2b) THE TRAP: Kit 2 is dearer than Kit 1 despite measuring fewer markers',
  priceOf['energy-recovery'] > priceOf.testosterone &&
    KIT_PANELS['energy-recovery'].length < KIT_PANELS.testosterone.length,
)
check(
  '(2c) so the order is not the panel-size order',
  KITS_BY_PRICE.join() !== [...KITS_BY_PRICE].sort((a, b) => KIT_PANELS[a].length - KIT_PANELS[b].length).join(),
)

// ───────────────────────────────────────────────────────────────────────────
// (3) Coverage, including the three worked examples from the defect register
// ───────────────────────────────────────────────────────────────────────────

check(
  '(3a) vitamin D and ferritin go to Kit 2, because Kit 1 cannot measure them',
  cheapestKitCovering(['vitamin-d', 'ferritin']) === 'energy-recovery',
)
check(
  '(3b) total testosterone alone goes to Kit 1, the cheapest that covers it',
  cheapestKitCovering(['total-testosterone']) === 'testosterone',
)
check(
  '(3c) one from each half forces Kit 3',
  cheapestKitCovering(['total-testosterone', 'vitamin-d']) === 'hormone-recovery',
)
check(
  '(3d) an empty set covers nothing rather than defaulting to the cheapest kit',
  cheapestKitCovering([]) === null,
)
check(
  '(3e) every Kit 2 marker alone still resolves to Kit 2',
  KIT_PANELS['energy-recovery'].every((id) => cheapestKitCovering([id]) === 'energy-recovery'),
)

// ───────────────────────────────────────────────────────────────────────────
// (4) The safety invariant, over every subset of every panel
// ───────────────────────────────────────────────────────────────────────────

let subsets = 0
let widerThanOwnKit = 0
let notCovered = 0

for (const kit of Object.keys(KIT_PANELS) as KitType[]) {
  const panel = KIT_PANELS[kit]
  // Every non-empty subset. 2^9 - 1 for Kit 3, and that is the point: the
  // register's three examples are three of 557 and prove nothing about the rest.
  for (let mask = 1; mask < 1 << panel.length; mask += 1) {
    const ids = panel.filter((_, i) => mask & (1 << i)) as PanelMarkerId[]
    subsets += 1
    const chosen = cheapestKitCovering(ids)
    if (!chosen) { notCovered += 1; continue }
    if (priceOf[chosen] > priceOf[kit]) widerThanOwnKit += 1
    if (!ids.every((id) => KIT_PANELS[chosen].includes(id))) notCovered += 1
  }
}

check(`(4a) all ${subsets} subsets of a real panel are covered by some kit`, notCovered === 0)
check(
  '(4b) the chosen kit is never dearer than the kit the markers came from',
  widerThanOwnKit === 0,
)

// ───────────────────────────────────────────────────────────────────────────
// (5) The rule end to end, including every fallback
// ───────────────────────────────────────────────────────────────────────────

// The case the demo was ILLUSTRATING: a Kit 3 buyer whose flags all sit inside
// Kit 2. Note this is not the demo fixture, which is flagged on both halves and
// is measured in section 6.
const demoMan = selectRetestPanel(
  [
    m('Testosterone', 'optimal-testosterone'),
    m('SHBG', 'shbg-normal'),
    m('Free Androgen Index', 'fai-reported'),
    m('Albumin', 'normal-albumin'),
    m('Free Testosterone', 'ft-normal'),
    m('Vitamin D', 'low-vitamin-d'),
    m('Active B12', 'normal-b12'),
    m('hs-CRP', 'elevated-crp'),
    m('Ferritin', 'suboptimal-ferritin'),
  ],
  'hormone-recovery',
)
check('(5a) a Kit 3 buyer whose flags all sit inside Kit 2 gets a Kit 2', demoMan.kit === 'energy-recovery')
check('(5b) and the reason says the rule fired', demoMan.reason === 'flagged')
check('(5c) and it names the three markers it followed', demoMan.flagged.length === 3)

const testosteroneOnly = selectRetestPanel(
  [
    m('Testosterone', 'low-testosterone'),
    m('Vitamin D', 'normal-vitamin-d'),
    m('Ferritin', 'normal-ferritin'),
  ],
  'hormone-recovery',
)
check('(5d) a Kit 3 buyer flagged only on testosterone gets a Kit 1', testosteroneOnly.kit === 'testosterone')

const spansBoth = selectRetestPanel(
  [m('Testosterone', 'low-testosterone'), m('Vitamin D', 'low-vitamin-d')],
  'hormone-recovery',
)
check('(5e) flags on both halves keep the full Kit 3', spansBoth.kit === 'hormone-recovery')

const allClear = selectRetestPanel(
  [m('Testosterone', 'optimal-testosterone'), m('Vitamin D', 'normal-vitamin-d')],
  'hormone-recovery',
)
check('(5f) nothing flagged falls back to the kit that produced the result', allClear.kit === 'hormone-recovery')
check('(5g) and says so rather than claiming the rule fired', allClear.reason === 'nothing-flagged')

const unknownMarker = selectRetestPanel(
  [m('Cortisol', 'low-vitamin-d'), m('Vitamin D', 'normal-vitamin-d')],
  'hormone-recovery',
)
check(
  '(5h) a FLAGGED marker with no panel entry refuses to narrow',
  unknownMarker.kit === 'hormone-recovery' && unknownMarker.reason === 'unrecognised-marker',
)
const unknownButClear = selectRetestPanel(
  [m('Cortisol', 'normal'), m('Vitamin D', 'low-vitamin-d')],
  'hormone-recovery',
)
check(
  '(5i) an UNFLAGGED unknown marker does not block the rule',
  unknownButClear.kit === 'energy-recovery' && unknownButClear.reason === 'flagged',
)

// FAI is reported and never interpreted (Ewa ruling 8), so it can never be the
// marker that widens a panel. Asserted because the rule reads states, and a
// future state change here would silently start dispatching on it.
check('(5j) FAI is not a flagged state', !isFlaggedState('fai-reported'))
const faiOnly = selectRetestPanel(
  [m('Free Androgen Index', 'fai-reported'), m('Testosterone', 'optimal-testosterone')],
  'testosterone',
)
check('(5k) so an FAI-only result narrows nothing', faiOnly.reason === 'nothing-flagged')

// A Kit 1 buyer cannot be given a Kit 2, whatever is flagged: his markers are
// not on that panel at all.
const kit1Man = selectRetestPanel(
  [m('Testosterone', 'low-testosterone'), m('SHBG', 'shbg-high')],
  'testosterone',
)
check('(5l) a Kit 1 buyer stays on Kit 1', kit1Man.kit === 'testosterone')

check('(5m) no markers at all is the nothing-flagged path', selectRetestPanel([], 'testosterone').reason === 'nothing-flagged')

// ───────────────────────────────────────────────────────────────────────────
// (6) THE DEMO, WHICH IS THE OTHER HALF OF D1 AND IS NOW CLOSED
//
// D1 said one of two things had to move before /demo went public: the job, or
// the demo. The job moved on 2026-09-12. The demo moved on 2026-09-13, when
// Keith took option 2 of the three this section used to list:
//
//   *"If someone initially purchased Kit 3 and then has markers in Kit 3 that
//   belong to Kit 1 and 2, then we just send out a Kit 3."*
//
// The demo's baseline man is flagged on six markers spanning BOTH halves of the
// panel: equivocal testosterone and low free testosterone on the Kit 1 side,
// low vitamin D, borderline B12, elevated hs-CRP and suboptimal ferritin on the
// Kit 2 side. No rule that follows the flags can send him a Kit 2, because a
// Kit 2 cannot measure his testosterone. The cheapest kit that covers all six
// is the full Kit 3, and that is now the kit `demo-kit3-retest` carries.
//
// ⚠ The suggested fix in the register reads "if a flagged marker only exists on
// Kit 3, send Kit 3", and that condition can never fire: Kit 3 is the union of
// the other two, so no marker is unique to it. The sentence was written
// imagining Kit 3 as the testosterone panel. Implemented literally it would
// send every member a Kit 2, including this one, which would re-measure four of
// his six flagged markers and silently drop his testosterone.
//
// 🔴 THIS IS STILL A TRIPWIRE, IT HAS SIMPLY CHANGED SIGN. It asserts that the
// kit typed into the demo's retest fixture is the kit the shipped rule derives
// from the demo's baseline. Edit either fixture so they diverge and (6b) fails,
// naming both kits, rather than /demo quietly going back to showing a journey
// the nightly job would not produce. That is the failure D1 was raised for and
// it went five days unnoticed.
// ───────────────────────────────────────────────────────────────────────────

const demoBaselineKit = SCENARIOS[DEMO_BASELINE_SCENARIO].payload.kitType as KitType
const demoShownRetestKit = SCENARIOS[DEMO_RETEST_SCENARIO].payload.kitType as KitType

const demoDash = buildDashboardFromScenario([DEMO_BASELINE_SCENARIO]) as unknown as {
  kits?: Array<{ results: Array<{ markers: RetestMarker[] }> }>
}
const demoMarkers = (demoDash.kits ?? []).flatMap((k) => k.results[0]?.markers ?? [])
const demoPanel = selectRetestPanel(demoMarkers, demoBaselineKit)

check('(6a) the demo baseline reads as a Kit 3, because it is flagged on both halves',
  demoPanel.kit === 'hormone-recovery' && demoPanel.flagged.length === 6)
check(`(6b) the demo's retest fixture is the kit the rule derives (rule ${demoPanel.kit}, demo ${demoShownRetestKit})`,
  demoPanel.kit === demoShownRetestKit)
check('(6c) and it could not have been a Kit 2: a Kit 2 cannot measure his testosterone',
  demoPanel.flagged.includes('total-testosterone') &&
    !KIT_PANELS['energy-recovery'].includes('total-testosterone'))
// Option 2 gave up the partial-remeasure teaching point, so assert the thing
// that replaced it: all nine markers are re-measured, and the four that move
// are the four we sell a product against. If someone flattens the hormone half
// back out, or lets testosterone drift UP across a band, this fails.
const demoRetest = SCENARIOS[DEMO_RETEST_SCENARIO].payload.biomarkers
const demoBase = SCENARIOS[DEMO_BASELINE_SCENARIO].payload.biomarkers
const valueOf = (list: typeof demoBase, name: string) =>
  list.find((b) => b.name === name)?.value ?? NaN
check('(6d) every one of the nine baseline markers is re-measured',
  demoBase.length === 9 && demoRetest.length === 9 &&
    demoBase.every((b) => demoRetest.some((r) => r.name === b.name)))
check('(6e) testosterone does NOT rise: we hold no claim that anything we sell moves it',
  valueOf(demoRetest, 'Testosterone') < valueOf(demoBase, 'Testosterone'))
check('(6f) and it stays inside the equivocal band, so no verdict changes on the hormone half',
  valueOf(demoRetest, 'Testosterone') >= 8 && valueOf(demoRetest, 'Testosterone') < 12)
check('(6g) free testosterone stays under its floor, which the T/SHBG ratio forces',
  valueOf(demoRetest, 'Free Testosterone') < 0.198)
// FAI is printed next to copy saying it IS total T as a percentage of SHBG, so
// the number has to actually be that or the screen contradicts its own caption.
const faiDerived =
  (valueOf(demoRetest, 'Testosterone') / valueOf(demoRetest, 'SHBG')) * 100
check(`(6h) FAI is derived, not typed (${faiDerived.toFixed(2)} vs ${valueOf(demoRetest, 'Free Androgen Index')})`,
  Math.abs(faiDerived - valueOf(demoRetest, 'Free Androgen Index')) < 0.05)

// ───────────────────────────────────────────────────────────────────────────
// (7) THE BLAST RADIUS: the kit he bought bounds the answer
//
// Keith's question, 2026-09-12: does this rule not just come back to whatever
// they ordered in the first place? For two of the three kits it does, exactly,
// and that is the property that makes the rule safe to ship.
//
// A man's flagged markers can only come from the panel he bought. Kit 1 and
// Kit 2 share no markers at all, so a Kit 1 buyer's flags are never covered by
// a Kit 2 and vice versa, and each is always sent his own kit back. Only a
// Kit 3 buyer can be narrowed, and only when his flags fall entirely inside one
// half.
//
// FAI is excluded throughout: `fai-reported` carries no verdict (Ewa ruling 8),
// so it can never be a marker the retest follows. That is why each half
// contributes 15 combinations rather than 31 and 15.
// ───────────────────────────────────────────────────────────────────────────

const NEVER_FLAGGED: PanelMarkerId[] = ['fai']

function outcomesFor(bought: KitType): Record<string, number> {
  const flaggable = KIT_PANELS[bought].filter((id) => !NEVER_FLAGGED.includes(id))
  const counts: Record<string, number> = {}
  for (let mask = 1; mask < 1 << flaggable.length; mask += 1) {
    const ids = flaggable.filter((_, i) => mask & (1 << i)) as PanelMarkerId[]
    const sent = cheapestKitCovering(ids)
    const key = sent ?? 'none'
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

check('(7a) the Kit 1 half has five markers but only four can ever be flagged',
  KIT_PANELS.testosterone.length === 5 &&
  KIT_PANELS.testosterone.filter((id) => !NEVER_FLAGGED.includes(id)).length === 4 &&
  !isFlaggedState('fai-reported'))

const k1 = outcomesFor('testosterone')
check('(7b) a Kit 1 buyer is always sent a Kit 1, over all 15 combinations',
  k1.testosterone === 15 && Object.keys(k1).length === 1)

const k2 = outcomesFor('energy-recovery')
check('(7c) a Kit 2 buyer is always sent a Kit 2, over all 15 combinations',
  k2['energy-recovery'] === 15 && Object.keys(k2).length === 1)

const k3 = outcomesFor('hormone-recovery')
check('(7d) a Kit 3 buyer keeps the full panel in 225 of 255 combinations',
  k3['hormone-recovery'] === 225)
check('(7e) and narrows to Kit 1 in 15 and Kit 2 in 15, the two halves',
  k3.testosterone === 15 && k3['energy-recovery'] === 15)
check('(7f) so the rule is a NO-OP for every Kit 1 and Kit 2 buyer',
  Object.keys(k1).length === 1 && Object.keys(k2).length === 1)

// The two halves are disjoint, which is WHY (7b) and (7c) hold. Asserted
// directly, because if a marker were ever added to both panels the counts above
// would still pass while the reasoning behind them quietly stopped being true.
check('(7g) Kit 1 and Kit 2 share no markers, which is what makes 7b and 7c hold',
  KIT_PANELS.testosterone.every((id) => !KIT_PANELS['energy-recovery'].includes(id)))
check('(7h) and Kit 3 is exactly their union, which is why no marker is unique to it',
  KIT_PANELS['hormone-recovery'].length ===
    KIT_PANELS.testosterone.length + KIT_PANELS['energy-recovery'].length &&
  [...KIT_PANELS.testosterone, ...KIT_PANELS['energy-recovery']]
    .every((id) => KIT_PANELS['hormone-recovery'].includes(id)))

console.log(`test-retest-panel: ${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
