import type { ClassifiedResult, KitType } from '@/lib/results/types'
import { TrafficLightBar } from './TrafficLightBar'
import { StatusBadge } from './StatusBadge'
import { ResultRecommend } from './ResultRecommend'
import { ResultConvert } from './ResultConvert'
import { MaintenanceOfferCta } from './MaintenanceOfferCta'
import { QualifierGate } from './QualifierGate'
import { LowTNurtureConsent } from './LowTNurtureConsent'
import { BorderlineNurtureConsent } from './BorderlineNurtureConsent'
import { isBorderlineTestosterone } from '@/lib/results/classifier'

const MARKER_DISPLAY_NAMES: Record<string, string> = {
  Testosterone: 'Total Testosterone',
  SHBG: 'SHBG',
  'Free Testosterone': 'Free Testosterone',
  Albumin: 'Albumin',
  'Free Androgen Index': 'Free Androgen Index',
  'Vitamin D': 'Vitamin D',
  'hs-CRP': 'Inflammation Marker',
  Ferritin: 'Iron Stores',
  'Active B12': 'Vitamin B12',
}

const QUALIFIER_QUESTIONS: Record<string, string> = {
  crp_joint_symptoms: 'Do you experience joint stiffness or soreness after training?',
}

interface MarkerCardProps {
  marker: ClassifiedResult
  resultId: string
  /** Card position — drives the staggered one-shot load reveal (§8.3 carve-out). */
  index?: number
  /** Kit that produced this result — selects the per-kit maintenance claims block. */
  kitType: KitType
  /**
   * True only for the single card designated to carry the all-clear maintenance
   * offer (dark). The classifier sets the `maintenance-offer` CTA on every in-
   * range card of an all-clear result; the parent (KitTabs) picks one anchor so
   * the offer + its `supplement_offer_shown` event render exactly once. Always
   * false when the flag is OFF (no card carries the CTA). Other in-range cards
   * suppress their footer.
   */
  isMaintenanceAnchor?: boolean
}

export function MarkerCard({
  marker,
  resultId,
  index = 0,
  kitType,
  isMaintenanceAnchor = false,
}: MarkerCardProps) {
  const displayName = MARKER_DISPLAY_NAMES[marker.markerName] ?? marker.markerName
  const isMaintenance = marker.primaryCta?.type === 'maintenance-offer'

  return (
    <article
      className="marker-rise border-b-4 border-black bg-white hover:bg-gray-50 transition-colors duration-200 flex flex-col relative"
      style={{ animationDelay: `${Math.min(index, 6) * 90}ms` }}
    >

      {/* Main body — two-column grid */}
      <div className="p-8 lg:p-12 xl:p-16 grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16 flex-grow relative z-10">

        {/* Left column: value display + traffic light bar */}
        <div className="xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
              <h2 className="text-2xl lg:text-3xl font-sans font-black uppercase tracking-tight">
                {displayName}
              </h2>
              <StatusBadge state={marker.state} />
            </div>

            <div
              className="font-sans font-black tracking-tighter leading-none mb-4"
              style={{ fontSize: 'clamp(72px, 10vw, 140px)' }}
            >
              {marker.value}
            </div>

            <div className="font-mono text-sm tracking-widest uppercase flex items-center gap-3">
              {marker.unit}
              {marker.referenceHigh !== null && (
                <>
                  <span className="w-2 h-2 bg-current" aria-hidden />
                  {marker.referenceLow !== null
                    ? `REF: ${marker.referenceLow}–${marker.referenceHigh}`
                    : `REF: <${marker.referenceHigh}`}
                </>
              )}
            </div>
          </div>

          <div className="mt-12 w-full">
            <TrafficLightBar
              value={marker.value}
              unit={marker.unit}
              referenceLow={marker.referenceLow}
              referenceHigh={marker.referenceHigh}
              displayZones={marker.displayZones}
              state={marker.state}
            />
          </div>
        </div>

        {/* Right column: explanation + evidence */}
        <div className="xl:col-span-7 flex flex-col gap-10 justify-center">

          <div>
            <h3 className="font-sans font-black uppercase tracking-tight text-lg lg:text-xl mb-4 pb-3 border-b-2 border-black flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              What This Means
            </h3>
            <p className="text-base xl:text-lg font-serif leading-relaxed text-gray-800">
              {marker.explanation}
            </p>
          </div>

          <div>
            <h3 className="font-sans font-black uppercase tracking-tight text-lg lg:text-xl mb-4 pb-3 border-b-2 border-black flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden>
                <rect x="4" y="2" width="16" height="20" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="14" x2="20" y2="14" />
              </svg>
              The Evidence
            </h3>
            <p className="text-base xl:text-lg font-serif leading-relaxed text-gray-800">
              {marker.educationContext}
            </p>
          </div>

        </div>
      </div>

      {/* Footer: recommendation + CTA */}
      {marker.requiresQualifier && marker.qualifierKey ? (
        <div className="border-t-4 border-black p-8 lg:px-12 xl:px-16 lg:py-10 bg-gray-50 relative z-10">
          <QualifierGate
            resultId={resultId}
            questionKey={marker.qualifierKey}
            question={QUALIFIER_QUESTIONS[marker.qualifierKey] ?? marker.qualifierKey}
          />
        </div>
      ) : isMaintenance ? (
        // All-clear maintenance offer (dark). Rendered once, on the anchor card,
        // so the offer copy + the `supplement_offer_shown` event fire exactly
        // once per all-clear result. Other in-range cards suppress their footer.
        isMaintenanceAnchor ? (
          <div className="border-t-4 border-black p-8 lg:px-12 xl:px-16 lg:py-8 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-auto relative z-10">
            <div className="max-w-2xl">
              <div className="font-mono text-xs font-bold tracking-widest mb-3 text-black">
                WHAT WE RECOMMEND
              </div>
              <div className="font-serif text-sm lg:text-base text-gray-800">
                <ResultRecommend
                  recommendation={marker.recommendation}
                  primaryCta={marker.primaryCta}
                  secondaryCta={marker.secondaryCta}
                  state={marker.state}
                  recommendationStrategy={marker.recommendationStrategy}
                  showHeading={false}
                  kitType={kitType}
                />
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <MaintenanceOfferCta />
            </div>
          </div>
        ) : null
      ) : (
        <div className="border-t-4 border-black p-8 lg:px-12 xl:px-16 lg:py-8 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-auto relative z-10">
          <div className="max-w-2xl">
            <div className="font-mono text-xs font-bold tracking-widest mb-3 text-black">
              WHAT WE RECOMMEND
            </div>
            <div className="font-serif text-sm lg:text-base text-gray-800">
              <ResultRecommend
                recommendation={marker.recommendation}
                primaryCta={marker.primaryCta}
                secondaryCta={marker.secondaryCta}
                state={marker.state}
                recommendationStrategy={marker.recommendationStrategy}
                showHeading={false}
              />
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <ResultConvert
              primaryCta={marker.primaryCta}
              secondaryCta={marker.secondaryCta}
            />
          </div>
        </div>
      )}

      {/* Low-T nurture explicit opt-in — sits below the GP-referral CTA, on any
          of the three low-T sub-bands (severely-low / low / equivocal). */}
      {(marker.state === 'severely-low-testosterone' ||
        marker.state === 'low-testosterone' ||
        marker.state === 'equivocal-testosterone') && (
        <div className="border-t-4 border-black p-8 lg:px-12 xl:px-16 lg:py-8 bg-gray-50 relative z-10">
          <LowTNurtureConsent />
        </div>
      )}

      {/* Borderline (low-end-of-normal) nurture opt-in — shown on the testosterone
          card when the value sits in the 12–<15 band. The card itself still reads
          as `normal-testosterone` (no clinical reclassification); this opt-in is
          the consent gate that feeds seq-03d, mirroring the low-T opt-in above. */}
      {marker.markerName === 'Testosterone' &&
        isBorderlineTestosterone(marker.value) && (
        <div className="border-t-4 border-black p-8 lg:px-12 xl:px-16 lg:py-8 bg-gray-50 relative z-10">
          <BorderlineNurtureConsent />
        </div>
      )}

    </article>
  )
}
