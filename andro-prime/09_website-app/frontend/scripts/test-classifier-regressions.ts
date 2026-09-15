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
import { mayCarryPurchaseLink, resultMayCarryRetestOffer } from '../lib/results/retestGuidance'
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

// ── Defect 3f: CA-014 as a guard, not as three hand-written `if` branches ──
//
// A result that routes a man to his GP, or flags him, must carry NO link to a
// paid kit. The current code obeys that by hand in three places and nothing
// structurally stops a fourth from attaching a purchase CTA to a GP-routed
// state. `mayCarryPurchaseLink` is that rule as a function, derived from the
// badge, and this asserts every classified card in every scenario against it.
//
// 🔴 THIS GUARDS THE DIRECTION THAT HARMS SOMEBODY. The gap 3f describes (a
// flagged man gets no retest guidance at all) is a hole we are still waiting on
// Ewa to fill. The opposite error — selling a kit to a man we have just told to
// see his doctor — is the one that must never ship, and it is the one a future
// well-meaning "fix the 3f gap" commit is most likely to introduce by reaching
// for the CTA that was already to hand.
//
// ⚠ IT IS NOT "NO FLAGGED CARD MAY SELL", which is what the first draft of this
// guard asserted, and running it is what corrected the rule. A Monitor or
// Action Needed marker may legitimately carry a CROSS-SELL to a different kit
// and three of those ship today: low vitamin D offers the testosterone kit,
// normal-testosterone offers the energy panel. CA-014 is about GP routing, not
// about flagging. The guard asserted a compliance rule stricter than the one
// actually approved, and four correct behaviours failed it.
const PURCHASE_HREF = /^\/kits(\/|$)|^\/supplements\//
for (const scenarioName of Object.keys(SCENARIOS) as ScenarioName[]) {
  const classified = classify(fixtureToClassifierInput(scenarioName, []))
  for (const card of classified) {
    if (mayCarryPurchaseLink(card.state)) continue
    for (const cta of [card.primaryCta, card.secondaryCta]) {
      if (cta && PURCHASE_HREF.test(cta.href)) {
        console.error(
          `[FAIL] ${scenarioName} — ${card.markerName} is "${card.state}" (no purchase link permitted) ` +
            `but carries CTA "${cta.type}" -> ${cta.href}`,
        )
        failures += 1
      }
    }
  }
}
passes += 1
console.log('[GUARD] no GP-routed or report-only card carries a link to a paid kit (CA-014, defect 3f)')

// ── CA-014 AT THE RESULT LEVEL (Keith, 2026-09-15) ────────────────────────
//
// The guard above is per CARD and it passes: a GP-routed card carries no
// purchase link. **It passed the whole time this was broken**, because
// `classify()` resolves CTAs per marker with no cross-marker pass, so the card
// next door never knew. A Kit 1 with testosterone at 8-12 rendered a GP
// referral on the testosterone card and "Retest in 6-12 months" pointing at
// /kits on the SHBG, free-T and albumin cards. Every card was individually
// correct. The RESULT was not, and CA-014 is written at the result level:
// "a confirmed testosterone RESULT < 12 nmol/L routes to a GP referral with no
// kit/supplement upsell".
//
// 🔴 A PER-ITEM GUARD CANNOT SEE A PER-COLLECTION RULE. That is the lesson,
// and it is why this block sits beside the one above rather than replacing it.
// Measured when the rule was adopted: 16 retest links across 6 fixtures, every
// one on a result that had just told a man to see his doctor.
//
// ⚠ THIS LOAD USED TO SIT IN THE CADENCE REDUCTION. Both design docs proposed
// that a GP-routed marker suppresses the whole-panel retest; Ewa rejected that
// (CA-047 Q4 = C) and was right on the question she was asked — whether the
// retest is SCHEDULED. She was never asked whether it may be SOLD. The cadence
// half went where she put it; this is where the commercial half now lives.
function expectResultRule(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

const gpRoutedScenarios: ScenarioName[] = []
for (const scenarioName of Object.keys(SCENARIOS) as ScenarioName[]) {
  const classified = classify(fixtureToClassifierInput(scenarioName, []))
  if (resultMayCarryRetestOffer(classified.map((c) => c.state))) continue
  gpRoutedScenarios.push(scenarioName)
  for (const card of classified) {
    for (const cta of [card.primaryCta, card.secondaryCta]) {
      if (cta && cta.type === 'retest-reminder') {
        console.error(
          `[FAIL] ${scenarioName} — the result carries a GP referral, but ${card.markerName} ` +
            `("${card.state}") still offers a retest to buy -> ${cta.href}`,
        )
        failures += 1
      }
    }
  }
}
expectResultRule(
  'the result-level guard exercised at least one GP-routed fixture (otherwise it proved nothing)',
  gpRoutedScenarios.length > 0,
)
console.log(
  `[GUARD] no GP-routed RESULT offers a retest to buy (CA-014 at result level; ` +
    `${gpRoutedScenarios.length} fixtures exercised)`,
)

// ✅ AND THE BOUNDARY IN THE OTHER DIRECTION, WHICH NO FIXTURE COVERS.
//
// The rule suppresses the retest OFFER and nothing else. A complement
// cross-sell — a panel we have NOT measured — survives on a GP-routed result,
// because it re-tests nothing and the "here is the panel we have not checked"
// framing is the pattern the cadence table endorses. Suppressing it as well
// would assert a compliance rule stricter than the one approved, which is
// precisely the error the per-card guard above records itself making in its
// first draft.
//
// 🔴 NO FIXTURE PRODUCES THIS COMBINATION, so without this synthetic panel the
// permissive half of the rule is unasserted, and a later "tighten the guard"
// commit would look correct and pass. Built by hand for that reason.
const gpPlusCrossSell = classify({
  kitType: 'energy-recovery',
  userAge: 45,
  symptomAnswers: [],
  qualifierResponses: [],
  biomarkers: [
    { markerName: 'hs-CRP', value: 14, unit: 'mg/L', referenceLow: 0, referenceHigh: 5 },
    { markerName: 'Vitamin D', value: 38, unit: 'nmol/L', referenceLow: 50, referenceHigh: 250 },
  ],
})
const crpCard = gpPlusCrossSell.find((c) => c.markerName === 'hs-CRP')
const vitDCard = gpPlusCrossSell.find((c) => c.markerName === 'Vitamin D')

expectResultRule('(CA-014r a) the synthetic panel really is GP-routed',
  crpCard?.state === 'high-crp' && crpCard?.primaryCta?.type === 'gp-referral')
expectResultRule('(CA-014r b) …and really does carry a complement cross-sell',
  vitDCard?.secondaryCta?.type === 'kit-1-cross-sell')
expectResultRule('(CA-014r c) the cross-sell SURVIVES the GP referral on the same result',
  vitDCard?.secondaryCta?.href === '/kits/testosterone')
expectResultRule('(CA-014r d) the GP-routed card itself still carries no purchase link',
  !!crpCard && ![crpCard.primaryCta, crpCard.secondaryCta].some(
    (c) => c !== null && /^\/kits(\/|$)|^\/supplements\//.test(c.href)))

// ⚠ THE INFORMATION MUST SURVIVE; ONLY THE OFFER GOES. If suppressing the CTA
// also removed the interval, this would be defect 3f again — the man most
// likely to need a second test being the one never told when to take one. The
// interval lives in Ewa-signed card copy, so it is untouched, and that is
// asserted rather than assumed.
const lowTCards = classify(fixtureToClassifierInput('low-testosterone', []))
const shbgCard = lowTCards.find((c) => c.markerName === 'SHBG')
expectResultRule('(CA-014r e) the SHBG card lost its retest LINK',
  shbgCard?.primaryCta === null)
expectResultRule('(CA-014r f) …but kept its Ewa-signed copy, which is where the interval lives',
  !!shbgCard && shbgCard.recommendation.length > 0 && shbgCard.explanation.length > 0)

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
