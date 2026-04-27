import type { Cta, ResultState, RecommendationStrategy } from '@/lib/results/types'

interface ResultRecommendProps {
  recommendation: string
  primaryCta: Cta | null
  secondaryCta: Cta | null
  state: ResultState
  recommendationStrategy: RecommendationStrategy
  showHeading?: boolean
}

function getHeading(state: ResultState, strategy: RecommendationStrategy): string {
  if (strategy === 'multi-deficiency') return 'Your next step'
  if (state === 'high-crp' || state === 'low-ferritin' || state === 'low-albumin') {
    return 'What to do next'
  }
  if (
    state === 'optimal-testosterone' ||
    state === 'ft-normal' ||
    state === 'shbg-normal' ||
    state === 'normal'
  ) {
    return 'Keep it up'
  }
  return 'Your next step'
}

export function ResultRecommend({
  recommendation,
  primaryCta,
  secondaryCta,
  state,
  recommendationStrategy,
  showHeading = true,
}: ResultRecommendProps) {
  if (!recommendation) return null

  const heading = getHeading(state, recommendationStrategy)

  return (
    <div>
      {showHeading && (
        <h4 className="font-black font-sans text-sm uppercase tracking-widest mb-2">{heading}</h4>
      )}
      <p className="font-serif text-base leading-relaxed">{recommendation}</p>
      {secondaryCta && (
        <p className="text-sm text-gray-500 mt-2 font-serif">
          {secondaryCta.type === 'kit-2-cross-sell' &&
            'Your energy markers were not tested in this kit. Add an Energy & Recovery Check to get the full picture.'}
          {secondaryCta.type === 'kit-1-cross-sell' &&
            'Your testosterone was not tested in this kit. A Testosterone Health Check will show you where your levels sit.'}
        </p>
      )}
    </div>
  )
}
