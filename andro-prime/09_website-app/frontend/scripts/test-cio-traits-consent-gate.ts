// Unit tests for the CA-018 health-processing consent gate on the energy-marker
// Customer.io traits. Same lightweight, runner-free style as
// test-classifier-regressions.ts (the repo has no jest/vitest): assert loudly,
// exit non-zero on any failure. Run with `npm test` or
// `npx tsx scripts/test-cio-traits-consent-gate.ts`.
//
// Covers the three gate paths the compliance change hinges on:
//   (a) consented user           -> all five energy traits present, results_all_clear present
//   (b) non-consented / guest    -> none of the five present, results_all_clear STILL present
//   (c) consent lookup throws/errs -> hasHealthProcessingConsent fails closed (false),
//                                     buildCioTraits(false) never throws -> processing completes

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/types'
import { buildCioTraits } from '../lib/results/processResult'
import { hasHealthProcessingConsent } from '../lib/results/healthProcessingConsent'
import { HEALTH_PROCESSING_CONSENT_VERSION } from '../lib/auth/consentVersions'
import type { NormalisedBiomarker } from '../lib/results/types'

const ENERGY_TRAITS = [
  'low_vitamin_d',
  'low_b12',
  'elevated_crp',
  'crp_level',
  'low_ferritin',
] as const

// An energy-recovery panel with all four markers present (one in each band so
// the boolean flags carry real values, not just defaults).
const energyBiomarkers: NormalisedBiomarker[] = [
  { markerName: 'Vitamin D', value: 30, unit: 'nmol/L', referenceLow: 50, referenceHigh: 250 }, // low
  { markerName: 'Active B12', value: 20, unit: 'pmol/L', referenceLow: 25, referenceHigh: 150 }, // low
  { markerName: 'hs-CRP', value: 4.2, unit: 'mg/L', referenceLow: 0, referenceHigh: 1 }, // elevated
  { markerName: 'Ferritin', value: 20, unit: 'ug/L', referenceLow: 30, referenceHigh: 400 }, // low
]

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

// --- Fake Supabase client ---------------------------------------------------
// Minimal stub of the .from('users').select(...).eq(...).single() chain the
// consent helper uses. `mode` decides what .single() resolves/throws.
type SingleMode =
  | { kind: 'row'; version: string | null }
  | { kind: 'error' }
  | { kind: 'throw' }

function fakeSupabase(mode: SingleMode): SupabaseClient<Database> {
  const single = async () => {
    if (mode.kind === 'throw') throw new Error('simulated connection failure')
    if (mode.kind === 'error') return { data: null, error: { message: 'boom' } }
    return { data: { health_processing_consent_version: mode.version }, error: null }
  }
  const builder = {
    select: () => builder,
    eq: () => builder,
    single,
  }
  const client = { from: () => builder }
  return client as unknown as SupabaseClient<Database>
}

async function run(): Promise<void> {
  // (a) Consented user -> all five energy traits present + results_all_clear.
  {
    const traits = buildCioTraits('energy-recovery', energyBiomarkers, true)
    for (const t of ENERGY_TRAITS) {
      check(`(a) consented: trait "${t}" is present`, t in traits)
    }
    check('(a) consented: elevated_crp is true (crp 4.2 > 1.0)', traits.elevated_crp === true)
    check('(a) consented: crp_level is the raw numeric value (4.2)', traits.crp_level === 4.2)
    check('(a) consented: results_all_clear present', 'results_all_clear' in traits)
    check('(a) consented: results_all_clear is false (markers out of band)', traits.results_all_clear === false)
    check('(a) consented: kit_type_latest still set', traits.kit_type_latest === 'energy-recovery')
  }

  // (b) Non-consented / guest -> NONE of the five present, results_all_clear STILL present.
  {
    const traits = buildCioTraits('energy-recovery', energyBiomarkers, false)
    for (const t of ENERGY_TRAITS) {
      check(`(b) non-consented: trait "${t}" is ABSENT`, !(t in traits))
    }
    check('(b) non-consented: results_all_clear STILL present', 'results_all_clear' in traits)
    check('(b) non-consented: results_all_clear is false (its own rules unchanged)', traits.results_all_clear === false)
    check('(b) non-consented: kit_type_latest still set', traits.kit_type_latest === 'energy-recovery')
  }

  // (b2) All-clear energy panel, non-consented -> still no energy traits, all_clear true.
  {
    const allClear: NormalisedBiomarker[] = [
      { markerName: 'Vitamin D', value: 80, unit: 'nmol/L', referenceLow: 50, referenceHigh: 250 },
      { markerName: 'Active B12', value: 90, unit: 'pmol/L', referenceLow: 25, referenceHigh: 150 },
      { markerName: 'hs-CRP', value: 0.5, unit: 'mg/L', referenceLow: 0, referenceHigh: 1 },
      { markerName: 'Ferritin', value: 120, unit: 'ug/L', referenceLow: 30, referenceHigh: 400 },
    ]
    const traits = buildCioTraits('energy-recovery', allClear, false)
    for (const t of ENERGY_TRAITS) {
      check(`(b2) non-consented all-clear: trait "${t}" ABSENT`, !(t in traits))
    }
    check('(b2) non-consented all-clear: results_all_clear === true', traits.results_all_clear === true)
  }

  // (c) Consent lookup FAIL-CLOSED across missing row / error / throw, and the
  //     resulting boolean drives buildCioTraits without ever throwing.
  {
    const matching = await hasHealthProcessingConsent(
      fakeSupabase({ kind: 'row', version: HEALTH_PROCESSING_CONSENT_VERSION }),
      'user-1',
    )
    check('(c) matching stored version -> consent TRUE', matching === true)

    const mismatched = await hasHealthProcessingConsent(
      fakeSupabase({ kind: 'row', version: '2000-01-01-vOLD' }),
      'user-1',
    )
    check('(c) mismatched stored version -> consent FALSE (version-locked)', mismatched === false)

    const nullVersion = await hasHealthProcessingConsent(
      fakeSupabase({ kind: 'row', version: null }),
      'user-1',
    )
    check('(c) null stored version (guest/pre-existing) -> consent FALSE', nullVersion === false)

    const errored = await hasHealthProcessingConsent(fakeSupabase({ kind: 'error' }), 'user-1')
    check('(c) query error -> consent FALSE (fail closed)', errored === false)

    let threw = false
    let consentAfterThrow = true
    try {
      consentAfterThrow = await hasHealthProcessingConsent(fakeSupabase({ kind: 'throw' }), 'user-1')
    } catch {
      threw = true
    }
    check('(c) lookup throw is swallowed (helper does not rethrow)', threw === false)
    check('(c) lookup throw -> consent FALSE', consentAfterThrow === false)

    // Processing must complete: buildCioTraits(false) returns traits, no throw.
    let buildThrew = false
    let gatedTraits: Record<string, unknown> = {}
    try {
      gatedTraits = buildCioTraits('energy-recovery', energyBiomarkers, consentAfterThrow)
    } catch {
      buildThrew = true
    }
    check('(c) buildCioTraits after failed lookup does not throw', buildThrew === false)
    for (const t of ENERGY_TRAITS) {
      check(`(c) after failed lookup: trait "${t}" ABSENT`, !(t in gatedTraits))
    }
    check('(c) after failed lookup: results_all_clear still emitted', 'results_all_clear' in gatedTraits)
  }
}

run()
  .then(() => {
    if (failures > 0) {
      console.error(`\n${failures} consent-gate assertion(s) failed (${passes} passed).`)
      process.exit(1)
    }
    console.log(`\nAll ${passes} consent-gate assertion(s) passed.`)
    process.exit(0)
  })
  .catch((err) => {
    console.error('[FATAL] consent-gate test harness threw:', err)
    process.exit(1)
  })
