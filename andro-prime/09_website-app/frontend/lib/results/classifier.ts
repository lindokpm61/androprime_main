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
}

const GP_BLOCK_STATES: ResultState[] = ['high-crp', 'low-ferritin', 'low-albumin']

const DEFICIENCY_STATES: ResultState[] = [
  'low-testosterone',
  'normal-testosterone',
  'ft-low',
  'critically-low-vitamin-d',
  'low-vitamin-d',
  'elevated-crp',
  'moderate-crp',
  'low-b12',
]

function resolveState(b: NormalisedBiomarker): ResultState {
  const { markerName, value, referenceLow } = b
  switch (markerName) {
    case 'Testosterone':
      if (value < 12) return 'low-testosterone'
      if (value <= 20) return 'normal-testosterone'
      return 'optimal-testosterone'
    case 'SHBG':
      if (value < 17) return 'shbg-low'
      if (value <= 55) return 'shbg-normal'
      return 'shbg-high'
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
    case 'Ferritin':
      if (value < 30) return 'low-ferritin'
      if (value <= 100) return 'suboptimal-ferritin'
      return 'normal-ferritin'
    case 'Active B12':
      if (value < 37.5) return 'low-b12'
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

  // Multi-deficiency overrides individual supplement CTAs (but not GP blocks)
  if (recommendationStrategy === 'multi-deficiency') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery') {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.completeMensStack, secondaryCta }
  }

  if (state === 'low-testosterone') {
    return {
      ...base,
      primaryCta: CTAS.foundingMember,
      secondaryCta: CTAS.dailyStackZinc,
    }
  }

  if (state === 'normal-testosterone') {
    if (input.kitType === 'testosterone') {
      const hasEnergySymptoms = input.symptomAnswers.some(
        (a) => a.questionKey === 'energy_symptoms' && a.answer === true
      )
      return {
        ...base,
        primaryCta: CTAS.dailyStackZinc,
        secondaryCta: hasEnergySymptoms ? CTAS.kit2CrossSell : null,
      }
    }
    return { ...base, primaryCta: CTAS.dailyStackZinc }
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

  if (state === 'critically-low-vitamin-d') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.dailyStackD3, secondaryCta }
  }

  if (state === 'low-vitamin-d') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.dailyStackD3, secondaryCta }
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
    return {
      ...base,
      primaryCta: jointAnswer.answer === true ? CTAS.collagen : CTAS.lifestyleGuidance,
    }
  }

  if (state === 'suboptimal-ferritin') {
    // Dietary guidance only — no supplement CTA per spec
    return { ...base, primaryCta: null }
  }

  if (state === 'low-b12') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.dailyStackB12, secondaryCta }
  }

  // normal state
  return { ...base, primaryCta: CTAS.retestReminder }
}

const FT_LOW_WITH_LOW_T_RECOMMENDATION =
  'Your free testosterone is below range, and your total testosterone is also low. This combination is more significant than either in isolation. The most appropriate next step is clinical assessment for Testosterone Replacement Therapy, which addresses the underlying hormone level rather than just the downstream binding. We are building that service now.'

function resolveBarZones(b: NormalisedBiomarker): BarZone[] {
  switch (b.markerName) {
    case 'Testosterone':
      return [
        { color: 'critical', upTo: 12 },
        { color: 'warning', upTo: 20 },
        { color: 'optimal', upTo: null },
      ]
    case 'SHBG':
      return [
        { color: 'warning', upTo: 17 },
        { color: 'optimal', upTo: 55 },
        { color: 'warning', upTo: null },
      ]
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
      return [
        { color: 'critical', upTo: 30 },
        { color: 'warning', upTo: 100 },
        { color: 'optimal', upTo: null },
      ]
    case 'Active B12':
      return [
        { color: 'critical', upTo: 37.5 },
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

    // When FT-LOW and Total T is also low, override the default FT recommendation
    const recommendation =
      b.state === 'ft-low' && tState === 'low-testosterone'
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
