import type { Cta, ResultState, RecommendationStrategy, KitType } from '@/lib/results/types'
import { MAINTENANCE_OFFER_COPY, maintenanceClaimsForKit } from '@/lib/results/maintenanceOfferCopy'
import { GP_BLOCK_STATES, LOW_T_STATES } from '@/lib/results/classifier'

interface ResultRecommendProps {
  recommendation: string
  primaryCta: Cta | null
  secondaryCta: Cta | null
  state: ResultState
  recommendationStrategy: RecommendationStrategy
  showHeading?: boolean
  /** Kit that produced this result — selects the per-kit maintenance claims block. */
  kitType?: KitType
}

function getHeading(state: ResultState, strategy: RecommendationStrategy): string {
  if (strategy === 'multi-deficiency') return 'Your next step'
  // Report-only (FAI): neither "Keep it up" (which is what `normal` gave it)
  // nor "Your next step", since there is no step and nothing to keep up.
  if (state === 'fai-reported') return 'For reference'
  // Derived from the classifier's own sets rather than a copy of them. This was
  // a hand-maintained duplicate of both lists until 2026-08-07, which meant the
  // two new GP-routed bands (high testosterone, high vitamin D) silently got
  // the wrong heading the moment they were added. A list that has to be updated
  // in two files is a list that will be updated in one.
  if (GP_BLOCK_STATES.includes(state) || LOW_T_STATES.includes(state)) {
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
  kitType = 'testosterone',
}: ResultRecommendProps) {
  // All-clear maintenance offer (dark, behind MAINTENANCE_OFFER_ENABLED). The
  // classifier only sets this CTA type when the flag is ON and the whole result
  // is in range, so this branch is inert while the flag is off. Renders the
  // verbatim maintenance copy with the per-kit claims block; the waitlist button
  // and the offer events are rendered separately by MaintenanceOfferCta.
  if (primaryCta?.type === 'maintenance-offer') {
    return (
      <div>
        <h4 className="font-black font-sans text-sm uppercase tracking-widest mb-2">
          {MAINTENANCE_OFFER_COPY.headline}
        </h4>
        <p className="font-serif text-base leading-relaxed">{MAINTENANCE_OFFER_COPY.body1}</p>
        <p className="font-serif text-base leading-relaxed mt-2">{maintenanceClaimsForKit(kitType)}</p>
        <p className="font-serif text-base leading-relaxed mt-2">{MAINTENANCE_OFFER_COPY.body3}</p>
      </div>
    )
  }

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
