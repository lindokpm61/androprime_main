import type { Cta, ResultState, RecommendationStrategy } from '@/lib/results/types'

interface ResultRecommendProps {
  primaryCta: Cta | null
  secondaryCta: Cta | null
  state: ResultState
  recommendationStrategy: RecommendationStrategy
}

function getHeading(state: ResultState, strategy: RecommendationStrategy): string {
  if (strategy === 'multi-deficiency') return 'Your next step'
  if (state === 'high-crp' || state === 'low-ferritin' || state === 'low-albumin') {
    return 'What to do next'
  }
  if (state === 'optimal-testosterone' || state === 'normal') return 'Keep it up'
  return 'Your next step'
}

function getDescription(
  primaryCta: Cta | null,
  state: ResultState,
  strategy: RecommendationStrategy
): string {
  if (primaryCta?.type === 'gp-referral') {
    return 'We recommend speaking to your GP before considering any supplementation.'
  }
  if (strategy === 'multi-deficiency') {
    return 'Your panel shows multiple markers below optimal levels. The Complete Men\'s Stack is formulated to address all of them in one daily dose.'
  }
  if (primaryCta?.type === 'founding-member-deposit') {
    return 'Your testosterone result puts you in the range where clinical TRT may make a significant difference. Secure your place as a founding member now.'
  }
  if (primaryCta?.type === 'daily-stack-zinc' || primaryCta?.type === 'daily-stack-d3' || primaryCta?.type === 'daily-stack-b12') {
    return 'The Daily Stack supports this marker directly with evidence-backed doses. Each sachet delivers what you actually need, in the right form.'
  }
  if (primaryCta?.type === 'collagen') {
    return 'Based on your symptoms, Joint & Recovery Collagen may help. Vitamin C in the formula contributes to normal collagen formation for the normal function of cartilage.'
  }
  if (primaryCta?.type === 'lifestyle-guidance') {
    return 'Inflammation at this level often responds well to lifestyle adjustments. Our guidance covers diet, sleep, and recovery changes that make a measurable difference.'
  }
  if (primaryCta?.type === 'retest-reminder') {
    return 'Your result is in a good place. Testing again in 3 to 6 months will help you track changes and spot anything before it becomes a problem.'
  }
  if (!primaryCta) {
    return 'Retest in 3 to 6 months to track how your levels change over time.'
  }
  return ''
}

export function ResultRecommend({
  primaryCta,
  secondaryCta,
  state,
  recommendationStrategy,
}: ResultRecommendProps) {
  const heading = getHeading(state, recommendationStrategy)
  const description = getDescription(primaryCta, state, recommendationStrategy)

  if (!description) return null

  return (
    <div>
      <h4 className="font-black font-sans text-sm uppercase tracking-widest mb-2">{heading}</h4>
      <p className="font-serif text-base leading-relaxed">{description}</p>
      {secondaryCta && (
        <p className="text-sm text-stone-500 mt-2 font-serif">
          {secondaryCta.type === 'kit-2-cross-sell' &&
            'Your energy markers were not tested in this kit. Add an Energy & Recovery Check to get the full picture.'}
          {secondaryCta.type === 'kit-1-cross-sell' &&
            'Your testosterone was not tested in this kit. A Testosterone Health Check will show you where your levels sit.'}
        </p>
      )}
    </div>
  )
}
