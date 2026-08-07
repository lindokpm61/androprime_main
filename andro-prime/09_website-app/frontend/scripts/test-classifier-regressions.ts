// Lightweight classifier regression harness. The repo has no jest/vitest
// configured (Next 15 app router project, all behaviour is integration-
// tested manually against seeded fixtures); this script gives us a fast,
// deterministic way to lock in the CTA matrix without pulling in a test
// runner. Run with `npm test` or `npx tsx scripts/test-classifier-regressions.ts`.
//
// To add a regression: add a new entry to `CASES` with the fixture name
// and per-marker CTA assertions. Each assertion fails loudly with a diff.

import { classify, type ClassifierInput } from '../lib/results/classifier'
import { SCENARIOS } from '../lib/results/fixtures/registry'
import { buildCioTraits } from '../lib/results/processResult'
import type { CtaType, KitType, ScenarioName, NormalisedBiomarker, ResultState } from '../lib/results/types'

interface MarkerAssertion {
  marker: string
  primaryCtaType: CtaType | null
  /** Optional exact-href guard on the resolved primary CTA. */
  primaryCtaHref?: string
  secondaryCtaType?: CtaType | null
  /** Optional exact-href guard on the resolved secondary CTA. */
  secondaryCtaHref?: string
}

interface RegressionCase {
  scenario: ScenarioName
  description: string
  forbidPrimaryCtaTypes?: CtaType[]
  /** Qualifier answers to inject (default none). Needed for CRP joint-symptom
   *  branches, where the primary CTA depends on the qualifier response. */
  qualifierResponses?: Array<{ questionKey: string; answer: unknown }>
  assertions: MarkerAssertion[]
}

// Routes that were removed / never built. No classifier CTA may point at any of
// these: they 404. Guarded across every scenario below so a future edit that
// reintroduces a dead link fails the suite. `/gp-referral` was repointed to the
// live GP handoff summary and `/guides/lifestyle` to the published CRP article
// (2026-07-22).
const DEAD_ROUTES = ['/gp-referral', '/guides/lifestyle']

const CASES: RegressionCase[] = [
  {
    scenario: 'kit3-low-t-plus-vitamin-d-and-b12',
    description:
      'Kit 3 with low T, low Vitamin D, and low B12 must route the testosterone card to GP referral (low-T routing decision 2026-06-04; was the founding-member list), the Vitamin D and B12 cards to the supplement waitlist, and never surface the Complete Men\'s Stack CTA.',
    forbidPrimaryCtaTypes: ['complete-mens-stack'],
    assertions: [
      {
        marker: 'Testosterone',
        primaryCtaType: 'gp-referral',
        // GP referral routes to the live CA-023 handoff page, not the old 404.
        primaryCtaHref: '/results-dashboard/handoff',
        secondaryCtaType: null,
      },
      { marker: 'Vitamin D', primaryCtaType: 'supplement-waitlist' },
      { marker: 'Active B12', primaryCtaType: 'supplement-waitlist' },
    ],
  },
  {
    scenario: 'elevated-crp',
    description:
      'Kit 2 (energy-recovery) moderately elevated hs-CRP with NO joint symptoms (qualifier crp_joint_symptoms=false) routes the hs-CRP card to the lifestyle-guidance CTA, now pointing at the published CRP article (/blog/crp-blood-test), never the old 404 /guides/lifestyle.',
    qualifierResponses: [{ questionKey: 'crp_joint_symptoms', answer: false }],
    assertions: [
      {
        marker: 'hs-CRP',
        primaryCtaType: 'lifestyle-guidance',
        primaryCtaHref: '/blog/crp-blood-test',
      },
    ],
  },
  {
    scenario: 'normal-testosterone-no-energy',
    description:
      'Kit 1 (testosterone) normal-T with NO energy symptoms: waitlist primary, and the complementary Kit 2 cross-sell (/kits/energy-recovery) as secondary. The post-result cross-sell is always the complement Kit 2, never the superset Kit 3, and is now unconditional (independent of the never-captured energy_symptoms signal).',
    assertions: [
      {
        marker: 'Testosterone',
        primaryCtaType: 'supplement-waitlist',
        secondaryCtaType: 'kit-2-cross-sell',
        secondaryCtaHref: '/kits/energy-recovery',
      },
    ],
  },
  {
    scenario: 'normal-testosterone-energy',
    description:
      'Kit 1 (testosterone) normal-T WITH energy symptoms (fixture supplies the energy_symptoms=true row): waitlist primary, complementary Kit 2 cross-sell (/kits/energy-recovery) as secondary — same value as the no-energy case now that the cross-sell is unconditional.',
    assertions: [
      {
        marker: 'Testosterone',
        primaryCtaType: 'supplement-waitlist',
        secondaryCtaType: 'kit-2-cross-sell',
        secondaryCtaHref: '/kits/energy-recovery',
      },
    ],
  },
  {
    scenario: 'low-vitamin-d',
    description:
      'Kit 2 (energy-recovery) single low Vitamin D on a 40+ customer: waitlist primary, Kit 1 cross-sell secondary now pointing at the real /kits/testosterone route (guards the broken /kits/testosterone-health link).',
    assertions: [
      {
        marker: 'Vitamin D',
        primaryCtaType: 'supplement-waitlist',
        secondaryCtaType: 'kit-1-cross-sell',
        secondaryCtaHref: '/kits/testosterone',
      },
    ],
  },
  {
    scenario: 'multi-deficiency-energy',
    description:
      'Kit 2 (energy-recovery) multi-deficiency (low Vitamin D + low B12): waitlist primary, Kit 1 cross-sell secondary at /kits/testosterone on both deficiency cards.',
    assertions: [
      {
        marker: 'Vitamin D',
        primaryCtaType: 'supplement-waitlist',
        secondaryCtaType: 'kit-1-cross-sell',
        secondaryCtaHref: '/kits/testosterone',
      },
      {
        marker: 'Active B12',
        primaryCtaType: 'supplement-waitlist',
        secondaryCtaType: 'kit-1-cross-sell',
        secondaryCtaHref: '/kits/testosterone',
      },
    ],
  },
  {
    scenario: 'multi-deficiency',
    description:
      'Kit 3 (hormone-recovery) normal-T card in a multi-deficiency result gets waitlist only — no kit cross-sell (Kit 2/Kit 3 buyers never get a kit cross-sell on the T card).',
    assertions: [
      {
        marker: 'Testosterone',
        primaryCtaType: 'supplement-waitlist',
        secondaryCtaType: null,
      },
    ],
  },
]

function fixtureToClassifierInput(
  scenarioName: ScenarioName,
  qualifierResponses: Array<{ questionKey: string; answer: unknown }> = [],
): ClassifierInput {
  const fixture = SCENARIOS[scenarioName]
  const biomarkers: NormalisedBiomarker[] = fixture.payload.biomarkers.map((b) => ({
    markerName: b.name,
    value: b.value,
    unit: b.unit,
    referenceLow: b.referenceRange.low,
    referenceHigh: b.referenceRange.high,
  }))
  return {
    kitType: fixture.payload.kitType as KitType,
    biomarkers,
    symptomAnswers: fixture.symptomAnswers,
    qualifierResponses,
    userAge: fixture.testAge,
  }
}

let failures = 0
let passes = 0

for (const testCase of CASES) {
  const input = fixtureToClassifierInput(testCase.scenario, testCase.qualifierResponses)
  const classified = classify(input)

  for (const assertion of testCase.assertions) {
    const card = classified.find((c) => c.markerName === assertion.marker)
    if (!card) {
      console.error(
        `[FAIL] ${testCase.scenario} — marker "${assertion.marker}" not present in classifier output`,
      )
      failures += 1
      continue
    }
    const actualPrimary = card.primaryCta?.type ?? null
    if (actualPrimary !== assertion.primaryCtaType) {
      console.error(
        `[FAIL] ${testCase.scenario} — ${assertion.marker}.primaryCta.type expected ${String(
          assertion.primaryCtaType,
        )}, got ${String(actualPrimary)}`,
      )
      failures += 1
    } else {
      passes += 1
    }
    if (assertion.primaryCtaHref !== undefined) {
      const actualHref = card.primaryCta?.href ?? null
      if (actualHref !== assertion.primaryCtaHref) {
        console.error(
          `[FAIL] ${testCase.scenario} — ${assertion.marker}.primaryCta.href expected ${String(
            assertion.primaryCtaHref,
          )}, got ${String(actualHref)}`,
        )
        failures += 1
      } else {
        passes += 1
      }
    }
    if (assertion.secondaryCtaType !== undefined) {
      const actualSecondary = card.secondaryCta?.type ?? null
      if (actualSecondary !== assertion.secondaryCtaType) {
        console.error(
          `[FAIL] ${testCase.scenario} — ${assertion.marker}.secondaryCta.type expected ${String(
            assertion.secondaryCtaType,
          )}, got ${String(actualSecondary)}`,
        )
        failures += 1
      } else {
        passes += 1
      }
    }
    if (assertion.secondaryCtaHref !== undefined) {
      const actualHref = card.secondaryCta?.href ?? null
      if (actualHref !== assertion.secondaryCtaHref) {
        console.error(
          `[FAIL] ${testCase.scenario} — ${assertion.marker}.secondaryCta.href expected ${String(
            assertion.secondaryCtaHref,
          )}, got ${String(actualHref)}`,
        )
        failures += 1
      } else {
        passes += 1
      }
    }
  }

  if (testCase.forbidPrimaryCtaTypes) {
    for (const card of classified) {
      if (
        card.primaryCta &&
        testCase.forbidPrimaryCtaTypes.includes(card.primaryCta.type)
      ) {
        console.error(
          `[FAIL] ${testCase.scenario} — ${card.markerName}.primaryCta.type is "${card.primaryCta.type}" but this scenario forbids it`,
        )
        failures += 1
      }
    }
    passes += 1
  }

  console.log(`[CASE] ${testCase.scenario}: ${testCase.description}`)
}

// Global dead-route guard: across EVERY registered scenario (and both CRP
// qualifier branches), assert no resolved primary or secondary CTA points at a
// route that 404s. This catches a reintroduced dead link even in a scenario
// that has no explicit href assertion above.
for (const scenarioName of Object.keys(SCENARIOS) as ScenarioName[]) {
  const qualifierVariants: Array<Array<{ questionKey: string; answer: unknown }>> = [
    [],
    [{ questionKey: 'crp_joint_symptoms', answer: true }],
    [{ questionKey: 'crp_joint_symptoms', answer: false }],
  ]
  for (const qualifierResponses of qualifierVariants) {
    const classified = classify(fixtureToClassifierInput(scenarioName, qualifierResponses))
    for (const card of classified) {
      for (const cta of [card.primaryCta, card.secondaryCta]) {
        if (cta && DEAD_ROUTES.includes(cta.href)) {
          console.error(
            `[FAIL] ${scenarioName} — ${card.markerName} CTA "${cta.type}" points at dead route ${cta.href}`,
          )
          failures += 1
        }
      }
    }
  }
}
passes += 1
console.log('[GUARD] no classifier CTA points at a dead route across all scenarios')

// Upper-band boundary guard (Ewa, 2026-08-07). Both bands were added because
// the engine previously had no ceiling on testosterone or vitamin D, so a
// result above the assay's own maximum read as "optimal" or "adequate". These
// assertions pin the exact cut-points, the GP routing, and the knock-on that
// made this more than a classifier change: `results_all_clear` feeds Customer.io
// and had no upper bound either, so a man could be GP-referred on his dashboard
// while being routed into the seq-03c reassurance sequence at the same time.
const boundaryCases: Array<{
  marker: string
  kit: KitType
  value: number
  expectState: ResultState
  expectCta: string | null
}> = [
  // Testosterone: `optimal` is now the bounded band 20 to 29.
  { marker: 'Testosterone', kit: 'testosterone', value: 29, expectState: 'optimal-testosterone', expectCta: 'retest-reminder' },
  { marker: 'Testosterone', kit: 'testosterone', value: 29.1, expectState: 'high-testosterone', expectCta: 'gp-referral' },
  { marker: 'Testosterone', kit: 'testosterone', value: 35, expectState: 'high-testosterone', expectCta: 'gp-referral' },
  // Vitamin D: above the assay ceiling is a clinical-review flag, not a bare
  // out-of-range, and being GP-blocked also suppresses every supplement CTA.
  { marker: 'Vitamin D', kit: 'energy-recovery', value: 250, expectState: 'normal-vitamin-d', expectCta: 'retest-reminder' },
  { marker: 'Vitamin D', kit: 'energy-recovery', value: 250.1, expectState: 'high-vitamin-d', expectCta: 'gp-referral' },
]

for (const c of boundaryCases) {
  const [card] = classify({
    kitType: c.kit,
    biomarkers: [{ markerName: c.marker, value: c.value, unit: 'x', referenceLow: null, referenceHigh: null }],
    symptomAnswers: [],
    qualifierResponses: [],
    userAge: 42,
  })
  if (card.state !== c.expectState) {
    console.error(`[FAIL] ${c.marker} ${c.value} — state is "${card.state}", expected "${c.expectState}"`)
    failures += 1
  } else if ((card.primaryCta?.type ?? null) !== c.expectCta) {
    console.error(`[FAIL] ${c.marker} ${c.value} — CTA is "${card.primaryCta?.type ?? 'none'}", expected "${c.expectCta}"`)
    failures += 1
  } else {
    passes += 1
  }
}
console.log('[GUARD] testosterone and vitamin D upper bands route to GP at the agreed cut-points')

// A result above the ceiling must never report all-clear to Customer.io.
for (const t of [{ v: 24, clear: true }, { v: 35, clear: false }]) {
  const traits = buildCioTraits(
    'testosterone',
    [{ markerName: 'Testosterone', value: t.v, unit: 'nmol/L', referenceLow: 8.64, referenceHigh: 29 }],
    true,
  )
  if (traits.results_all_clear !== t.clear) {
    console.error(`[FAIL] CIO results_all_clear for testosterone ${t.v} is ${traits.results_all_clear}, expected ${t.clear}`)
    failures += 1
  } else {
    passes += 1
  }
}
{
  const traits = buildCioTraits(
    'energy-recovery',
    [{ markerName: 'Vitamin D', value: 300, unit: 'nmol/L', referenceLow: 50, referenceHigh: 250 }],
    true,
  )
  if (traits.results_all_clear !== false) {
    console.error(`[FAIL] CIO results_all_clear for vitamin D 300 is ${traits.results_all_clear}, expected false`)
    failures += 1
  } else {
    passes += 1
  }
}
console.log('[GUARD] an above-ceiling result never reports all-clear to Customer.io')

if (failures > 0) {
  console.error(`\n${failures} regression assertion(s) failed (${passes} passed).`)
  process.exit(1)
}

console.log(`\nAll ${passes} regression assertion(s) passed.`)
process.exit(0)
