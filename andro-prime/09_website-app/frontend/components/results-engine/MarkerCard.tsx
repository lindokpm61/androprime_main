import type { ClassifiedResult } from '@/lib/results/types'
import { TrafficLightBar } from './TrafficLightBar'
import { StatusBadge } from './StatusBadge'
import { ResultRecommend } from './ResultRecommend'
import { ResultConvert } from './ResultConvert'
import { QualifierGate } from './QualifierGate'

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
}

export function MarkerCard({ marker, resultId }: MarkerCardProps) {
  const displayName = MARKER_DISPLAY_NAMES[marker.markerName] ?? marker.markerName
  const gridId = `grid-${marker.markerName.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <article className="border-b-4 border-black bg-white group transition-all duration-500 hover:bg-black hover:text-white flex flex-col relative overflow-hidden">

      {/* Grid pattern overlay — appears on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        </svg>
      </div>

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
              className="font-sans font-black tracking-tighter leading-none mb-4 group-hover:scale-105 transition-transform duration-500 origin-left"
              style={{ fontSize: 'clamp(72px, 10vw, 140px)' }}
            >
              {marker.value}
            </div>

            <div className="font-mono text-sm tracking-widest uppercase flex items-center gap-3 group-hover:text-gray-300 transition-colors">
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

          <div className="group-hover:-translate-y-1 transition-transform duration-500">
            <h3 className="font-sans font-black uppercase tracking-tight text-lg lg:text-xl mb-4 pb-3 border-b-2 border-black group-hover:border-white transition-colors flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              What This Means
            </h3>
            <p className="text-base xl:text-lg font-serif leading-relaxed text-gray-800 group-hover:text-gray-300 transition-colors">
              {marker.explanation}
            </p>
          </div>

          <div className="group-hover:translate-y-1 transition-transform duration-500">
            <h3 className="font-sans font-black uppercase tracking-tight text-lg lg:text-xl mb-4 pb-3 border-b-2 border-black group-hover:border-white transition-colors flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden>
                <rect x="4" y="2" width="16" height="20" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="14" x2="20" y2="14" />
              </svg>
              The Evidence
            </h3>
            <p className="text-base xl:text-lg font-serif leading-relaxed text-gray-800 group-hover:text-gray-300 transition-colors">
              {marker.educationContext}
            </p>
          </div>

        </div>
      </div>

      {/* Footer: recommendation + CTA */}
      {marker.requiresQualifier && marker.qualifierKey ? (
        <div className="border-t-4 border-black group-hover:border-white p-8 lg:px-12 xl:px-16 lg:py-10 bg-gray-50 group-hover:bg-black transition-colors relative z-10">
          <QualifierGate
            resultId={resultId}
            questionKey={marker.qualifierKey}
            question={QUALIFIER_QUESTIONS[marker.qualifierKey] ?? marker.qualifierKey}
          />
        </div>
      ) : (
        <div className="border-t-4 border-black group-hover:border-white p-8 lg:px-12 xl:px-16 lg:py-8 bg-gray-50 group-hover:bg-black transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-auto relative z-10">
          <div className="max-w-2xl">
            <div className="font-mono text-xs font-bold tracking-widest mb-3 text-black group-hover:text-white transition-colors">
              WHAT WE RECOMMEND
            </div>
            <div className="font-serif text-sm lg:text-base text-gray-800 group-hover:text-gray-300 transition-colors">
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

    </article>
  )
}
