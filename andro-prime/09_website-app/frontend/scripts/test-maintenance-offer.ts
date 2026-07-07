// Regression suite for the all-clear maintenance offer (dark, behind
// MAINTENANCE_OFFER_ENABLED). Same runner-free style as
// test-classifier-regressions.ts / test-cio-traits-consent-gate.ts: assert
// loudly, exit non-zero on any failure. Run with `npm test` or
// `npx tsx scripts/test-maintenance-offer.ts`.
//
// Proves the three things the plan (PLAN-all-clear-maintenance-offer.md Step 4)
// and supplement-conversion.md require:
//   (a) flag ON  -> all-clear result (each kit type) returns the maintenance CTA,
//                   and the per-kit claims block is the correct verbatim copy.
//   (b) flag OFF -> zero behaviour diff: no fixture/input yields a maintenance
//                   CTA, and non-all-clear output is byte-identical to flag ON
//                   (the branch changes nothing off the all-clear path).
//   (c) low-T, borderline-T, GP-block (incl. critically-low vitamin D + high
//                   ferritin), and deficiency states NEVER get the maintenance
//                   CTA regardless of flag.

import { classify, type ClassifierInput } from '../lib/results/classifier'
import { maintenanceClaimsForKit } from '../lib/results/maintenanceOfferCopy'
import { SCENARIOS } from '../lib/results/fixtures/registry'
import type {
  ClassifiedResult,
  KitType,
  NormalisedBiomarker,
  ScenarioName,
} from '../lib/results/types'

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

const FLAG = 'MAINTENANCE_OFFER_ENABLED'

// Classify with the dark flag forced ON or OFF. The flag is read live from the
// environment on every classify() call, so toggling here is deterministic.
function classifyWithFlag(input: ClassifierInput, on: boolean): ClassifiedResult[] {
  if (on) process.env[FLAG] = 'true'
  else delete process.env[FLAG]
  const out = classify(input)
  delete process.env[FLAG]
  return out
}

function hasMaintenanceCta(cards: ClassifiedResult[]): boolean {
  return cards.some(
    (c) => c.primaryCta?.type === 'maintenance-offer' || c.secondaryCta?.type === 'maintenance-offer',
  )
}

// --- Input builders ---------------------------------------------------------
function bm(
  markerName: string,
  value: number,
  referenceLow: number | null = null,
  referenceHigh: number | null = null,
  unit = 'nmol/L',
): NormalisedBiomarker {
  return { markerName, value, unit, referenceLow, referenceHigh }
}

function input(kitType: KitType, biomarkers: NormalisedBiomarker[]): ClassifierInput {
  return { kitType, biomarkers, symptomAnswers: [], qualifierResponses: [], userAge: 40 }
}

// All-clear panels, one per kit type (every measured marker in its normal band;
// testosterone >= 15 so neither low nor borderline).
const allClearKit1 = input('testosterone', [
  bm('Testosterone', 18, 9, 27.6),
  bm('SHBG', 32, 18.3, 54.1),
  bm('Free Testosterone', 0.4, 0.17, 0.81),
  bm('Albumin', 44, 35, 50, 'g/L'),
  bm('Free Androgen Index', 50, 24, 104, '%'),
])
const allClearKit2 = input('energy-recovery', [
  bm('Vitamin D', 80, 50, 175),
  bm('Active B12', 90, 37.5, 188, 'pmol/L'),
  bm('hs-CRP', 0.5, null, 1.0, 'mg/L'),
  bm('Ferritin', 120, 30, 400, 'ug/L'),
])
const allClearKit3 = input('hormone-recovery', [
  bm('Testosterone', 18, 9, 27.6),
  bm('SHBG', 32, 18.3, 54.1),
  bm('Free Testosterone', 0.4, 0.17, 0.81),
  bm('Albumin', 44, 35, 50, 'g/L'),
  bm('Free Androgen Index', 50, 24, 104, '%'),
  bm('Vitamin D', 80, 50, 175),
  bm('hs-CRP', 0.5, null, 1.0, 'mg/L'),
  bm('Ferritin', 120, 30, 400, 'ug/L'),
  bm('Active B12', 90, 37.5, 188, 'pmol/L'),
])

const allClearCases: Array<{ label: string; input: ClassifierInput; kit: KitType }> = [
  { label: 'Kit 1 (testosterone)', input: allClearKit1, kit: 'testosterone' },
  { label: 'Kit 2 (energy-recovery)', input: allClearKit2, kit: 'energy-recovery' },
  { label: 'Kit 3 (hormone-recovery)', input: allClearKit3, kit: 'hormone-recovery' },
]

// Never-all-clear panels (must never get the maintenance offer, flag on or off).
const lowT = input('testosterone', [
  bm('Testosterone', 7, 9, 27.6),
  bm('SHBG', 32, 18.3, 54.1),
  bm('Free Testosterone', 0.4, 0.17, 0.81),
  bm('Albumin', 44, 35, 50, 'g/L'),
])
const borderlineT = input('testosterone', [
  // 12 <= 13 < 15 -> resolves to normal-testosterone but is NOT all-clear.
  bm('Testosterone', 13, 9, 27.6),
  bm('SHBG', 32, 18.3, 54.1),
  bm('Free Testosterone', 0.4, 0.17, 0.81),
  bm('Albumin', 44, 35, 50, 'g/L'),
])
const gpBlockCritVitD = input('energy-recovery', [
  bm('Vitamin D', 20, 50, 175), // < 25 -> critically-low-vitamin-d (GP block)
  bm('Active B12', 90, 37.5, 188, 'pmol/L'),
  bm('hs-CRP', 0.5, null, 1.0, 'mg/L'),
  bm('Ferritin', 120, 30, 400, 'ug/L'),
])
const gpBlockHighFerritin = input('energy-recovery', [
  bm('Vitamin D', 80, 50, 175),
  bm('Active B12', 90, 37.5, 188, 'pmol/L'),
  bm('hs-CRP', 0.5, null, 1.0, 'mg/L'),
  bm('Ferritin', 350, 30, 400, 'ug/L'), // > 300 -> high-ferritin (GP block)
])
const singleDeficiency = input('energy-recovery', [
  bm('Vitamin D', 30, 50, 175), // low-vitamin-d
  bm('Active B12', 90, 37.5, 188, 'pmol/L'),
  bm('hs-CRP', 0.5, null, 1.0, 'mg/L'),
  bm('Ferritin', 120, 30, 400, 'ug/L'),
])
const highCrpGpBlock = input('energy-recovery', [
  bm('Vitamin D', 80, 50, 175),
  bm('Active B12', 90, 37.5, 188, 'pmol/L'),
  bm('hs-CRP', 12, null, 1.0, 'mg/L'), // > 10 -> high-crp (GP block)
  bm('Ferritin', 120, 30, 400, 'ug/L'),
])

const neverCases: Array<{ label: string; input: ClassifierInput }> = [
  { label: 'low-T (T=7)', input: lowT },
  { label: 'borderline-T (T=13)', input: borderlineT },
  { label: 'GP-block critically-low vitamin D (20)', input: gpBlockCritVitD },
  { label: 'GP-block high ferritin (350)', input: gpBlockHighFerritin },
  { label: 'single deficiency (low vitamin D)', input: singleDeficiency },
  { label: 'GP-block high CRP (12)', input: highCrpGpBlock },
]

// === (a) Flag ON: all-clear returns maintenance + correct per-kit copy ======
for (const c of allClearCases) {
  const cards = classifyWithFlag(c.input, true)
  check(`(a) ${c.label}: flag ON -> maintenance CTA returned`, hasMaintenanceCta(cards))
}

// Per-kit claims-block selection (the copy the anchor card renders).
check(
  '(a) Kit 1 claims = Zinc/testosterone only (no Vitamin D / B12)',
  maintenanceClaimsForKit('testosterone').includes('Zinc contributes to the maintenance of normal testosterone levels') &&
    !maintenanceClaimsForKit('testosterone').includes('Vitamin D') &&
    !maintenanceClaimsForKit('testosterone').includes('Active B12'),
)
check(
  '(a) Kit 2 claims = Vitamin D + Active B12 (no testosterone/Zinc)',
  maintenanceClaimsForKit('energy-recovery').includes('Vitamin D contributes to normal muscle function') &&
    maintenanceClaimsForKit('energy-recovery').includes('Active B12 contributes to normal energy-yielding metabolism and normal psychological function') &&
    !maintenanceClaimsForKit('energy-recovery').includes('Zinc'),
)
check(
  '(a) Kit 3 claims = all three (Zinc + Vitamin D + Active B12)',
  maintenanceClaimsForKit('hormone-recovery').includes('Zinc contributes to the maintenance of normal testosterone levels') &&
    maintenanceClaimsForKit('hormone-recovery').includes('Vitamin D contributes to normal muscle function') &&
    maintenanceClaimsForKit('hormone-recovery').includes('Active B12 contributes to normal energy-yielding metabolism and normal psychological function'),
)
// No em dashes in any rendered maintenance claim.
for (const kit of ['testosterone', 'energy-recovery', 'hormone-recovery'] as KitType[]) {
  check(`(a) ${kit} claims contain no em dash`, !maintenanceClaimsForKit(kit).includes('—'))
}

// === (b) Flag OFF: zero behaviour diff ======================================
// (b1) Across every registry fixture, flag OFF yields no maintenance CTA at all.
for (const name of Object.keys(SCENARIOS) as ScenarioName[]) {
  const fixture = SCENARIOS[name]
  const inp: ClassifierInput = {
    kitType: fixture.payload.kitType as KitType,
    biomarkers: fixture.payload.biomarkers.map((b) => ({
      markerName: b.name,
      value: b.value,
      unit: b.unit,
      referenceLow: b.referenceRange.low,
      referenceHigh: b.referenceRange.high,
    })),
    symptomAnswers: fixture.symptomAnswers,
    qualifierResponses: [],
    userAge: fixture.testAge,
  }
  const off = classifyWithFlag(inp, false)
  check(`(b1) registry "${name}": flag OFF -> no maintenance CTA`, !hasMaintenanceCta(off))
}

// (b2) All-clear inputs, flag OFF -> no maintenance CTA (dark: nothing shows).
for (const c of allClearCases) {
  const off = classifyWithFlag(c.input, false)
  check(`(b2) ${c.label}: flag OFF -> no maintenance CTA (dark)`, !hasMaintenanceCta(off))
}

// (b3) Byte-identity off the all-clear path: for every never-all-clear input the
// flag ON output is identical to flag OFF (the branch touches nothing else).
for (const c of neverCases) {
  const off = JSON.stringify(classifyWithFlag(c.input, false))
  const on = JSON.stringify(classifyWithFlag(c.input, true))
  check(`(b3) ${c.label}: flag ON output byte-identical to flag OFF`, off === on)
}

// === (c) Never-all-clear states never get maintenance, flag ON or OFF =======
for (const c of neverCases) {
  const on = classifyWithFlag(c.input, true)
  const off = classifyWithFlag(c.input, false)
  check(`(c) ${c.label}: flag ON -> no maintenance CTA`, !hasMaintenanceCta(on))
  check(`(c) ${c.label}: flag OFF -> no maintenance CTA`, !hasMaintenanceCta(off))
}

if (failures > 0) {
  console.error(`\n${failures} maintenance-offer assertion(s) failed (${passes} passed).`)
  process.exit(1)
}
console.log(`\nAll ${passes} maintenance-offer assertion(s) passed.`)
process.exit(0)
