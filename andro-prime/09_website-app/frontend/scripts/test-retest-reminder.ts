// Unit tests for the Phase 2 retest-reminder attribute (`retest_due_at`) in
// buildCioTraits. Same runner-free style as the other suites: assert loudly,
// exit non-zero on any failure. Run with `npm test` or
// `npx tsx scripts/test-retest-reminder.ts`.
//
// Covers the flag gate and the all-clear gate:
//   (a) flag OFF + all-clear        -> retest_due_at ABSENT (byte-identical)
//   (b) flag ON  + all-clear        -> retest_due_at PRESENT, = asOf + 6 months
//   (c) flag ON  + NOT all-clear    -> retest_due_at ABSENT
//   (d) flag ON  + no scored markers -> retest_due_at ABSENT (no all_clear signal)

import { buildCioTraits, RETEST_REMINDER_MONTHS } from '../lib/results/processResult'
import type { NormalisedBiomarker } from '../lib/results/types'

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

// A fixed reference instant so the expected due date is deterministic (no
// Date.now()). 2026-01-15T00:00:00Z.
const AS_OF = new Date('2026-01-15T00:00:00.000Z')
function expectedDueUnix(asOf: Date): number {
  const due = new Date(asOf)
  due.setMonth(due.getMonth() + RETEST_REMINDER_MONTHS)
  return Math.floor(due.getTime() / 1000)
}

// Whole-panel all-clear energy result (every marker in its clear band).
const allClearEnergy: NormalisedBiomarker[] = [
  { markerName: 'Vitamin D', value: 80, unit: 'nmol/L', referenceLow: 50, referenceHigh: 250 },
  { markerName: 'Active B12', value: 90, unit: 'pmol/L', referenceLow: 25, referenceHigh: 150 },
  { markerName: 'hs-CRP', value: 0.5, unit: 'mg/L', referenceLow: 0, referenceHigh: 1 },
  { markerName: 'Ferritin', value: 120, unit: 'ug/L', referenceLow: 30, referenceHigh: 400 },
]

// Same panel with one marker out of band -> not all-clear.
const notAllClearEnergy: NormalisedBiomarker[] = [
  { markerName: 'Vitamin D', value: 30, unit: 'nmol/L', referenceLow: 50, referenceHigh: 250 }, // low
  { markerName: 'Active B12', value: 90, unit: 'pmol/L', referenceLow: 25, referenceHigh: 150 },
  { markerName: 'hs-CRP', value: 0.5, unit: 'mg/L', referenceLow: 0, referenceHigh: 1 },
  { markerName: 'Ferritin', value: 120, unit: 'ug/L', referenceLow: 30, referenceHigh: 400 },
]

// A marker the classifier does not score for all_clear (no clearVerdict pushed).
const unscoredOnly: NormalisedBiomarker[] = [
  { markerName: 'SHBG', value: 40, unit: 'nmol/L', referenceLow: 17, referenceHigh: 55 },
]

function withFlag(value: boolean, fn: () => void): void {
  const prev = process.env.RETEST_REMINDER_ENABLED
  process.env.RETEST_REMINDER_ENABLED = value ? 'true' : 'false'
  try {
    fn()
  } finally {
    if (prev === undefined) delete process.env.RETEST_REMINDER_ENABLED
    else process.env.RETEST_REMINDER_ENABLED = prev
  }
}

// (a) flag OFF + all-clear -> attribute absent, all_clear still present.
withFlag(false, () => {
  const traits = buildCioTraits('energy-recovery', allClearEnergy, false, AS_OF)
  check('(a) flag OFF: retest_due_at ABSENT', !('retest_due_at' in traits))
  check('(a) flag OFF: results_all_clear still true', traits.results_all_clear === true)
})

// (b) flag ON + all-clear -> attribute present and equal to asOf + 6 months.
withFlag(true, () => {
  const traits = buildCioTraits('energy-recovery', allClearEnergy, false, AS_OF)
  check('(b) flag ON all-clear: retest_due_at PRESENT', 'retest_due_at' in traits)
  check(
    '(b) flag ON all-clear: retest_due_at === asOf + 6 months (unix seconds)',
    traits.retest_due_at === expectedDueUnix(AS_OF),
  )
  check('(b) flag ON all-clear: due date is in the future vs asOf', (traits.retest_due_at as number) > Math.floor(AS_OF.getTime() / 1000))
})

// (c) flag ON + NOT all-clear -> attribute absent.
withFlag(true, () => {
  const traits = buildCioTraits('energy-recovery', notAllClearEnergy, false, AS_OF)
  check('(c) flag ON not-all-clear: results_all_clear false', traits.results_all_clear === false)
  check('(c) flag ON not-all-clear: retest_due_at ABSENT', !('retest_due_at' in traits))
})

// (d) flag ON + no scored markers -> no all_clear signal, no attribute.
withFlag(true, () => {
  const traits = buildCioTraits('testosterone', unscoredOnly, false, AS_OF)
  check('(d) flag ON no scored markers: results_all_clear ABSENT', !('results_all_clear' in traits))
  check('(d) flag ON no scored markers: retest_due_at ABSENT', !('retest_due_at' in traits))
})

if (failures > 0) {
  console.error(`\n${failures} retest-reminder assertion(s) failed (${passes} passed).`)
  process.exit(1)
}
console.log(`\nAll ${passes} retest-reminder assertion(s) passed.`)
process.exit(0)
