import { BIOMARKER_COPY } from './biomarker-copy'
import type {
  NormalisedBiomarker,
  ClassifiedResult,
  ResultState,
  RecommendationStrategy,
  Cta,
  KitType,
  BarZone,
} from './types'

export interface ClassifierInput {
  kitType: KitType
  biomarkers: NormalisedBiomarker[]
  symptomAnswers: Array<{ questionKey: string; answer: unknown }>
  qualifierResponses: Array<{ questionKey: string; answer: unknown }>
  userAge: number | null
}

const CTAS: Record<string, Cta> = {
  foundingMember: {
    type: 'founding-member-list',
    label: 'Join the founding-member list',
    href: '/founding-member',
  },
  dailyStackZinc: {
    type: 'daily-stack-zinc',
    label: 'Try the Daily Stack',
    href: '/supplements/daily-stack',
  },
  dailyStackD3: {
    type: 'daily-stack-d3',
    label: 'Try the Daily Stack',
    href: '/supplements/daily-stack',
  },
  dailyStackB12: {
    type: 'daily-stack-b12',
    label: 'Try the Daily Stack',
    href: '/supplements/daily-stack',
  },
  completeMensStack: {
    type: 'complete-mens-stack',
    label: "Try the Complete Men's Stack",
    href: '/supplements/complete-mens-stack',
  },
  collagen: {
    type: 'collagen',
    label: 'Try Joint & Recovery Collagen',
    href: '/supplements/collagen',
  },
  lifestyleGuidance: {
    type: 'lifestyle-guidance',
    label: 'Read our lifestyle guidance',
    href: '/guides/lifestyle',
  },
  kit2CrossSell: {
    type: 'kit-2-cross-sell',
    label: 'Test your energy markers',
    href: '/kits/energy-recovery',
  },
  kit1CrossSell: {
    type: 'kit-1-cross-sell',
    label: 'Test your testosterone',
    href: '/kits/testosterone-health',
  },
  retestReminder: {
    type: 'retest-reminder',
    label: 'Book a retest in 3 months',
    href: '/kits',
  },
  gpReferral: {
    type: 'gp-referral',
    label: 'Speak to your GP',
    href: '/gp-referral',
  },
  // Phase 0a opt-in CTA: the supplement range is deferred behind the kit
  // launch, so the result cards that would have promoted Daily Stack,
  // Collagen, or Complete Men's Stack now route to a single email-capture
  // form instead. The result card receives the marker `state` via the
  // `ClassifiedResult.state` field and passes it down to
  // `SupplementWaitlistForm` as `sourceMarker`; the CTA object itself
  // stays pure (no per-marker variation) so the `Cta` type does not need
  // to grow a payload field.
  supplementWaitlist: {
    type: 'supplement-waitlist',
    label: 'Join the supplement early-access list',
    href: '/supplement-waitlist',
  },
}

// GP-block states route straight to a GP referral, never a product. Ewa
// threshold sign-off 2026-06-16 added `critically-low-vitamin-d` (<25 nmol/L is
// clinician-managed, not OTC) and `high-ferritin` (>300 µg/L was previously
// silent: a markedly raised ferritin now flags for GP work-up).
const GP_BLOCK_STATES: ResultState[] = [
  'high-crp',
  'low-ferritin',
  'low-albumin',
  'critically-low-vitamin-d',
  'high-ferritin',
]

// All sub-bands of clinically low total testosterone (< 12 nmol/L). Ewa
// sign-off 2026-06-16 split the old single `< 12` low band into three
// (severely-low < 5.2, low 5.2–8, equivocal 8–12). All route to GP; the
// severely-low band additionally flags for endocrinology in its copy. Kept
// out of GP_BLOCK_STATES so the dedicated low-T branch (no upsell + nurture
// consent) still owns the routing.
const LOW_T_STATES: ResultState[] = [
  'severely-low-testosterone',
  'low-testosterone',
  'equivocal-testosterone',
]

// Kit 3 defect fix (2026-05-23): `low-testosterone` and `normal-testosterone`
// were previously counted as deficiencies, which caused Kit 3 results with a
// low-T plus any other low marker to trip the multi-deficiency branch and
// surface the Complete Men's Stack CTA on every card — including the
// testosterone card, where the correct CTA is the GP referral (low-T routing
// decision 2026-06-04; was the founding-member list). Removing them here keeps
// testosterone routing on its own (GP referral or supplement-waitlist) and
// reserves multi-deficiency for genuine nutrient-deficiency stacking
// (Vitamin D + B12 + CRP).
// `critically-low-vitamin-d` was removed here on 2026-06-16: it is now a GP
// block (clinician-managed), so it should not also feed a supplement
// multi-deficiency upsell. `borderline-b12` (the new NG239 25–70 indeterminate
// band) is added so it keeps the multi-deficiency stacking signal the old
// single `< 37.5` low-B12 cut used to carry.
const DEFICIENCY_STATES: ResultState[] = [
  'ft-low',
  'low-vitamin-d',
  'elevated-crp',
  'moderate-crp',
  'low-b12',
  'borderline-b12',
]

function resolveState(b: NormalisedBiomarker): ResultState {
  const { markerName, value, referenceLow, referenceHigh } = b
  switch (markerName) {
    // Testosterone bands (Ewa sign-off 2026-06-16, CA-014): the old single
    // `< 12` low band is split into severely-low (< 5.2, endocrinology flag),
    // low/clear-deficiency (5.2–8) and equivocal (8–12). All three GP-route.
    case 'Testosterone':
      if (value < 5.2) return 'severely-low-testosterone'
      if (value < 8) return 'low-testosterone'
      if (value < 12) return 'equivocal-testosterone'
      if (value <= 20) return 'normal-testosterone'
      return 'optimal-testosterone'
    // SHBG is assay-specific and has no UK consensus range, so band against the
    // lab's own reference interval (Ewa sign-off 2026-06-16: "match the lab, no
    // fixed numbers"). Fall back to the prior 17–55 only if the lab omits a
    // reference range.
    case 'SHBG': {
      const low = referenceLow ?? 17
      const high = referenceHigh ?? 55
      if (value < low) return 'shbg-low'
      if (value <= high) return 'shbg-normal'
      return 'shbg-high'
    }
    case 'Free Testosterone':
      if (referenceLow !== null && value < referenceLow) return 'ft-low'
      return 'ft-normal'
    case 'Albumin':
      if (value < 35) return 'low-albumin'
      return 'normal-albumin'
    case 'Vitamin D':
      if (value < 25) return 'critically-low-vitamin-d'
      if (value < 50) return 'low-vitamin-d'
      return 'normal-vitamin-d'
    case 'hs-CRP':
      if (value > 10) return 'high-crp'
      if (value > 3) return 'moderate-crp'
      if (value > 1) return 'elevated-crp'
      return 'normal-crp'
    // Ferritin (Ewa sign-off 2026-06-16): added a high band (> 300 µg/L) that
    // routes to GP — previously anything over 100 was silently "normal", so a
    // markedly raised ferritin (haemochromatosis, liver, inflammation) was
    // never flagged. 300 chosen from Ewa's "300–400 is fine"; conservative end.
    case 'Ferritin':
      if (value < 30) return 'low-ferritin'
      if (value <= 100) return 'suboptimal-ferritin'
      if (value <= 300) return 'normal-ferritin'
      return 'high-ferritin'
    // Active B12 (Ewa sign-off 2026-06-16): NICE NG239 three-band scheme
    // replaces the old single `< 37.5` cut. < 25 low, 25–70 indeterminate,
    // > 70 normal.
    case 'Active B12':
      if (value < 25) return 'low-b12'
      if (value <= 70) return 'borderline-b12'
      return 'normal-b12'
    default:
      return 'normal'
  }
}

interface CtaResolution {
  primaryCta: Cta | null
  secondaryCta: Cta | null
  requiresQualifier: boolean
  qualifierKey: string | null
}

function resolveCtas(
  state: ResultState,
  recommendationStrategy: RecommendationStrategy,
  input: ClassifierInput
): CtaResolution {
  const base: CtaResolution = {
    primaryCta: null,
    secondaryCta: null,
    requiresQualifier: false,
    qualifierKey: null,
  }

  // GP hard blocks always override — no supplement CTA
  if (GP_BLOCK_STATES.includes(state)) {
    return { ...base, primaryCta: CTAS.gpReferral }
  }

  // Multi-deficiency overrides individual supplement CTAs (but not GP blocks).
  // Phase 0a (2026-05-23): supplement range deferred — was completeMensStack,
  // now routes to the supplement waitlist instead. Kit 2 still keeps the
  // kit-1 cross-sell as secondary.
  if (recommendationStrategy === 'multi-deficiency') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery') {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.supplementWaitlist, secondaryCta }
  }

  if (LOW_T_STATES.includes(state)) {
    // Low-T routing decision 2026-06-04 (Ewa signed off): a clinically-low
    // result routes to GP referral, not the founding-member list. No kit or
    // supplement upsell on this card (a definitive low-T has no ambiguity to
    // resolve). Covers all three sub-bands (severely-low / low / equivocal)
    // added by the 2026-06-16 sign-off; the severely-low card additionally
    // flags endocrinology in its copy. The consent-gated nurture capture that
    // sits alongside GP referral is built separately, pending the solicitor's
    // lawful basis. See 04_products/results-engine/2026-06-04-low-t-routing-decision.md.
    return {
      ...base,
      primaryCta: CTAS.gpReferral,
      secondaryCta: null,
    }
  }

  if (state === 'normal-testosterone') {
    if (input.kitType === 'testosterone') {
      const hasEnergySymptoms = input.symptomAnswers.some(
        (a) => a.questionKey === 'energy_symptoms' && a.answer === true
      )
      return {
        ...base,
        primaryCta: CTAS.supplementWaitlist,
        secondaryCta: hasEnergySymptoms ? CTAS.kit2CrossSell : null,
      }
    }
    // Kit 2 (energy-recovery) and Kit 3 (hormone-recovery): waitlist only.
    return { ...base, primaryCta: CTAS.supplementWaitlist }
  }

  if (state === 'optimal-testosterone') {
    return { ...base, primaryCta: CTAS.retestReminder }
  }

  // SHBG — no direct product CTA per spec
  if (state === 'shbg-low' || state === 'shbg-normal' || state === 'shbg-high') {
    return { ...base, primaryCta: CTAS.retestReminder }
  }

  // Free T — CTA logic follows Total T (FT-LOW with T-LOW handled by T-LOW card; no duplicate)
  if (state === 'ft-low' || state === 'ft-normal') {
    return { ...base, primaryCta: null }
  }

  // Note: `critically-low-vitamin-d` (< 25) is now a GP-block state (handled
  // above, 2026-06-16 sign-off), so it no longer reaches a supplement CTA here.

  if (state === 'low-vitamin-d') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.supplementWaitlist, secondaryCta }
  }

  if (state === 'elevated-crp' || state === 'moderate-crp') {
    const jointAnswer = input.qualifierResponses.find(
      (r) => r.questionKey === 'crp_joint_symptoms'
    )
    if (!jointAnswer) {
      return {
        ...base,
        requiresQualifier: true,
        qualifierKey: 'crp_joint_symptoms',
      }
    }
    // Phase 0a: joints=true was collagen, now supplement waitlist.
    // joints=false unchanged (lifestyle guidance, no supplement claim).
    return {
      ...base,
      primaryCta: jointAnswer.answer === true ? CTAS.supplementWaitlist : CTAS.lifestyleGuidance,
    }
  }

  if (state === 'suboptimal-ferritin') {
    // Dietary guidance only — no supplement CTA per spec
    return { ...base, primaryCta: null }
  }

  if (state === 'low-b12' || state === 'borderline-b12') {
    // Phase 0a: was dailyStackB12, now supplement waitlist. Kit 2 + 40+
    // kit-1 cross-sell secondary preserved. `borderline-b12` (NG239 25–70
    // indeterminate band, 2026-06-16 sign-off) shares this routing.
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.supplementWaitlist, secondaryCta }
  }

  // normal state
  return { ...base, primaryCta: CTAS.retestReminder }
}

const FT_LOW_WITH_LOW_T_RECOMMENDATION =
  'Your free testosterone is below range, and your total testosterone is also low. This combination is more significant than either in isolation. The most appropriate next step is to speak to your GP, who can confirm these results and discuss what they mean for you. Take your results with you.'

function resolveBarZones(b: NormalisedBiomarker): BarZone[] {
  switch (b.markerName) {
    case 'Testosterone':
      return [
        { color: 'critical', upTo: 12 },
        { color: 'warning', upTo: 20 },
        { color: 'optimal', upTo: null },
      ]
    case 'SHBG': {
      // Assay-matched to the lab reference range (2026-06-16 sign-off);
      // fall back to 17–55 only when the lab omits a range.
      const low = b.referenceLow ?? 17
      const high = b.referenceHigh ?? 55
      return [
        { color: 'warning', upTo: low },
        { color: 'optimal', upTo: high },
        { color: 'warning', upTo: null },
      ]
    }
    case 'Free Testosterone':
      return b.referenceLow !== null
        ? [{ color: 'critical', upTo: b.referenceLow }, { color: 'optimal', upTo: null }]
        : [{ color: 'optimal', upTo: null }]
    case 'Albumin':
      return [
        { color: 'critical', upTo: 35 },
        { color: 'optimal', upTo: null },
      ]
    case 'Vitamin D':
      return [
        { color: 'critical', upTo: 25 },
        { color: 'warning', upTo: 50 },
        { color: 'optimal', upTo: null },
      ]
    case 'hs-CRP':
      return [
        { color: 'optimal', upTo: 1.0 },
        { color: 'warning', upTo: 10.0 },
        { color: 'critical', upTo: null },
      ]
    case 'Ferritin':
      // High band (> 300) added 2026-06-16 — markedly raised ferritin now
      // shows as critical and routes to GP.
      return [
        { color: 'critical', upTo: 30 },
        { color: 'warning', upTo: 100 },
        { color: 'optimal', upTo: 300 },
        { color: 'critical', upTo: null },
      ]
    case 'Active B12':
      // NG239 three-band (2026-06-16): < 25 low, 25–70 indeterminate, > 70 normal.
      return [
        { color: 'critical', upTo: 25 },
        { color: 'warning', upTo: 70 },
        { color: 'optimal', upTo: null },
      ]
    default:
      // Fallback: derive from lab reference range
      return b.referenceLow !== null
        ? [{ color: 'critical', upTo: b.referenceLow }, { color: 'optimal', upTo: null }]
        : [{ color: 'optimal', upTo: null }]
  }
}

export function classify(input: ClassifierInput): ClassifiedResult[] {
  // Pass 1 — resolve state for each biomarker
  const withStates = input.biomarkers.map((b) => ({
    ...b,
    state: resolveState(b),
  }))

  // Pass 2 — deficiency count, set recommendation strategy
  const deficiencyCount = withStates.filter((b) =>
    DEFICIENCY_STATES.includes(b.state)
  ).length
  const hasMultiDeficiency = deficiencyCount >= 2

  const tState = withStates.find((b) => b.markerName === 'Testosterone')?.state

  // Pass 3 — resolve CTAs, copy, and build ClassifiedResult[]
  return withStates.map((b) => {
    const strategy: RecommendationStrategy =
      hasMultiDeficiency && DEFICIENCY_STATES.includes(b.state)
        ? 'multi-deficiency'
        : 'single'

    const copy = BIOMARKER_COPY[b.state]
    const ctaResolution = resolveCtas(b.state, strategy, input)

    // When FT-LOW and Total T is also low (any sub-band), override the default
    // FT recommendation with the combined low-T + low-free-T message.
    const recommendation =
      b.state === 'ft-low' && tState !== undefined && LOW_T_STATES.includes(tState)
        ? FT_LOW_WITH_LOW_T_RECOMMENDATION
        : copy.recommendation

    return {
      markerName: b.markerName,
      value: b.value,
      unit: b.unit,
      referenceLow: b.referenceLow,
      referenceHigh: b.referenceHigh,
      displayZones: resolveBarZones(b),
      state: b.state,
      stateLabel: copy.stateLabel,
      explanation: copy.explanation,
      educationContext: copy.educationContext,
      recommendation,
      recommendationStrategy: strategy,
      primaryCta: ctaResolution.primaryCta,
      secondaryCta: ctaResolution.secondaryCta,
      requiresQualifier: ctaResolution.requiresQualifier,
      qualifierKey: ctaResolution.qualifierKey,
    }
  })
}
