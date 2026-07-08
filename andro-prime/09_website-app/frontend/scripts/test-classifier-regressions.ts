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
import type { CtaType, KitType, ScenarioName, NormalisedBiomarker } from '../lib/results/types'

interface MarkerAssertion {
  marker: string
  primaryCtaType: CtaType | null
  secondaryCtaType?: CtaType | null
  /** Optional exact-href guard on the resolved secondary CTA. */
  secondaryCtaHref?: string
}

interface RegressionCase {
  scenario: ScenarioName
  description: string
  forbidPrimaryCtaTypes?: CtaType[]
  assertions: MarkerAssertion[]
}

const CASES: RegressionCase[] = [
  {
    scenario: 'kit3-low-t-plus-vitamin-d-and-b12',
    description:
      'Kit 3 with low T, low Vitamin D, and low B12 must route the testosterone card to GP referral (low-T routing decision 2026-06-04; was the founding-member list), the Vitamin D and B12 cards to the supplement waitlist, and never surface the Complete Men\'s Stack CTA.',
    forbidPrimaryCtaTypes: ['complete-mens-stack'],
    assertions: [
      { marker: 'Testosterone', primaryCtaType: 'gp-referral', secondaryCtaType: null },
      { marker: 'Vitamin D', primaryCtaType: 'supplement-waitlist' },
      { marker: 'Active B12', primaryCtaType: 'supplement-waitlist' },
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

function fixtureToClassifierInput(scenarioName: ScenarioName): ClassifierInput {
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
    qualifierResponses: [],
    userAge: fixture.testAge,
  }
}

let failures = 0
let passes = 0

for (const testCase of CASES) {
  const input = fixtureToClassifierInput(testCase.scenario)
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

if (failures > 0) {
  console.error(`\n${failures} regression assertion(s) failed (${passes} passed).`)
  process.exit(1)
}

console.log(`\nAll ${passes} regression assertion(s) passed.`)
process.exit(0)
