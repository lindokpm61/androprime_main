import type {
  NormalisedBiomarker,
  ClassifiedResult,
  ResultState,
  RecommendationStrategy,
  Cta,
  KitType,
} from './types'

export interface ClassifierInput {
  kitType: KitType
  biomarkers: NormalisedBiomarker[]
  symptomAnswers: Array<{ questionKey: string; answer: unknown }>
  qualifierResponses: Array<{ questionKey: string; answer: unknown }>
  userAge: number | null
}

const COPY: Record<
  ResultState,
  { stateLabel: string; explanation: string; educationContext: string }
> = {
  'low-testosterone': {
    stateLabel: 'Your results indicate low testosterone',
    explanation:
      'Your testosterone is below 12 nmol/L. This is the range where symptoms like fatigue, reduced drive, and slower recovery are most commonly reported.',
    educationContext:
      'Testosterone declines gradually from your mid-30s. A reading below 12 nmol/L is clinically significant. Your GP should review this result before any decisions are made.',
  },
  'normal-testosterone': {
    stateLabel: 'Your results indicate testosterone in the normal range',
    explanation:
      'Your testosterone sits between 12 and 20 nmol/L. This is within the standard reference range, but not at the upper end associated with peak energy and recovery.',
    educationContext:
      'A normal testosterone result does not rule out symptoms. Sleep, stress, and other nutrient deficiencies can affect how you feel regardless of your testosterone level.',
  },
  'optimal-testosterone': {
    stateLabel: 'Your results indicate optimal testosterone levels',
    explanation:
      'Your testosterone is above 20 nmol/L. This is the upper portion of the healthy range, associated with better energy, recovery, and drive.',
    educationContext:
      'Maintaining optimal testosterone involves supporting your overall health. Regular retesting every 6 to 12 months helps you track changes over time.',
  },
  'low-vitamin-d': {
    stateLabel: 'Your results indicate low vitamin D',
    explanation:
      'Your vitamin D is below 50 nmol/L. This is the threshold below which deficiency symptoms, including fatigue, muscle weakness, and reduced immunity, are more likely.',
    educationContext:
      'Vitamin D deficiency is widespread in the UK, especially in winter. Most dietary sources provide very little. Supplementation is the most reliable way to raise and maintain your levels.',
  },
  'elevated-crp': {
    stateLabel: 'Your results indicate elevated inflammation markers',
    explanation:
      'Your hs-CRP is between 1 and 10 mg/L. This suggests a low to moderate level of systemic inflammation. The cause determines the right response.',
    educationContext:
      'hs-CRP is a sensitive marker of inflammation. Low to moderate elevation can reflect lifestyle factors like stress, poor sleep, or diet. It can also indicate joint issues.',
  },
  'high-crp': {
    stateLabel: 'Your results indicate significantly elevated inflammation markers',
    explanation:
      'Your hs-CRP is above 10 mg/L. This level of inflammation warrants a conversation with your GP before considering any supplementation.',
    educationContext:
      'hs-CRP above 10 mg/L can indicate significant systemic inflammation, infection, or an underlying condition that should be reviewed by your GP.',
  },
  'low-ferritin': {
    stateLabel: 'Your results indicate low ferritin',
    explanation:
      'Your ferritin is below 30 ug/L. At this level, iron stores are depleted enough to affect energy, cognitive function, and recovery. Your GP should review this result.',
    educationContext:
      'Ferritin measures your stored iron. Low ferritin is one of the most overlooked causes of persistent fatigue in men. Supplementing iron without GP guidance is not recommended.',
  },
  'low-b12': {
    stateLabel: 'Your results indicate low active B12',
    explanation:
      'Your active B12 is below 37.5 pmol/L. Active B12 is the form your cells can use. Low levels are associated with fatigue and reduced cognitive function.',
    educationContext:
      'Standard B12 tests measure total B12, which can appear normal even when usable levels are low. Active B12 is a more accurate measure of what your body actually has available.',
  },
  'low-albumin': {
    stateLabel: 'Your results indicate low albumin',
    explanation:
      'Your albumin is below 35 g/L. While albumin is included primarily to improve the accuracy of your free testosterone calculation, low albumin can indicate issues your GP should review.',
    educationContext:
      'Albumin is a protein produced by the liver. Very low levels can reflect liver or kidney function issues and should always be reviewed by a GP.',
  },
  normal: {
    stateLabel: 'Your results indicate this marker is within the normal range',
    explanation: 'This marker falls within the standard reference range.',
    educationContext:
      'Regular retesting helps you track changes over time. A normal result today is a useful baseline for the future.',
  },
}

const CTAS: Record<string, Cta> = {
  foundingMember: {
    type: 'founding-member-deposit',
    label: 'Become a founding member',
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
  'elevated-crp',
  'low-vitamin-d',
  'low-b12',
]

function resolveState(markerName: string, value: number): ResultState {
  switch (markerName) {
    case 'Testosterone':
      if (value < 12) return 'low-testosterone'
      if (value <= 20) return 'normal-testosterone'
      return 'optimal-testosterone'
    case 'Albumin':
      if (value < 35) return 'low-albumin'
      return 'normal'
    case 'Vitamin D':
      if (value < 50) return 'low-vitamin-d'
      return 'normal'
    case 'hs-CRP':
      if (value > 10) return 'high-crp'
      if (value > 1) return 'elevated-crp'
      return 'normal'
    case 'Ferritin':
      if (value < 30) return 'low-ferritin'
      return 'normal'
    case 'Active B12':
      if (value < 37.5) return 'low-b12'
      return 'normal'
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
    // Kit 3 normal-testosterone — Daily Stack only, Kit 2 markers already on-panel
    return { ...base, primaryCta: CTAS.dailyStackZinc }
  }

  if (state === 'optimal-testosterone') {
    return { ...base, primaryCta: CTAS.retestReminder }
  }

  if (state === 'low-vitamin-d') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.dailyStackD3, secondaryCta }
  }

  if (state === 'elevated-crp') {
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

export function classify(input: ClassifierInput): ClassifiedResult[] {
  // Pass 1 — resolve state for each biomarker
  const withStates = input.biomarkers.map((b) => ({
    ...b,
    state: resolveState(b.markerName, b.value),
  }))

  // Pass 2 — deficiency count, set recommendation strategy
  const deficiencyCount = withStates.filter((b) =>
    DEFICIENCY_STATES.includes(b.state)
  ).length
  const hasMultiDeficiency = deficiencyCount >= 2

  // Pass 3 — resolve CTAs and build ClassifiedResult[]
  return withStates.map((b) => {
    const strategy: RecommendationStrategy =
      hasMultiDeficiency && DEFICIENCY_STATES.includes(b.state)
        ? 'multi-deficiency'
        : 'single'

    const copy = COPY[b.state]
    const ctaResolution = resolveCtas(b.state, strategy, input)

    return {
      markerName: b.markerName,
      value: b.value,
      unit: b.unit,
      referenceLow: b.referenceLow,
      referenceHigh: b.referenceHigh,
      state: b.state,
      stateLabel: copy.stateLabel,
      explanation: copy.explanation,
      educationContext: copy.educationContext,
      recommendationStrategy: strategy,
      primaryCta: ctaResolution.primaryCta,
      secondaryCta: ctaResolution.secondaryCta,
      requiresQualifier: ctaResolution.requiresQualifier,
      qualifierKey: ctaResolution.qualifierKey,
    }
  })
}
