'use client'

import { useState } from 'react'
import type { ClassifiedResult } from '@/lib/results/types'
import { TrafficLightBar } from './TrafficLightBar'
import { StatusBadge } from './StatusBadge'
import { ResultExplain } from './ResultExplain'
import { ResultEducate } from './ResultEducate'
import { ResultRecommend } from './ResultRecommend'
import { ResultConvert } from './ResultConvert'
import { QualifierGate } from './QualifierGate'

const MARKER_DISPLAY_NAMES: Record<string, string> = {
  Testosterone: 'Testosterone',
  SHBG: 'Sex Hormone Binding Globulin',
  'Free Testosterone': 'Free Testosterone',
  Albumin: 'Albumin',
  'Free Androgen Index': 'Free Androgen Index',
  'Vitamin D': 'Vitamin D',
  'hs-CRP': 'Inflammation Marker',
  Ferritin: 'Iron Stores',
  'Active B12': 'Vitamin B12',
}

const MARKER_SUBTITLES: Record<string, string> = {
  Testosterone: 'Total testosterone',
  SHBG: 'Sex Hormone Binding Globulin',
  'Free Testosterone': 'Bioavailable testosterone',
  Albumin: 'Carrier protein',
  'Free Androgen Index': 'Calculated free androgen ratio',
  'Vitamin D': '25-hydroxyvitamin D',
  'hs-CRP': 'High-sensitivity C-reactive protein',
  Ferritin: 'Iron storage protein',
  'Active B12': 'Holotranscobalamin',
}

const QUALIFIER_QUESTIONS: Record<string, string> = {
  crp_joint_symptoms: 'Do you experience joint pain or stiffness?',
}

function isDefaultExpanded(state: ClassifiedResult['state']): boolean {
  return state !== 'optimal-testosterone' && state !== 'normal'
}

interface MarkerCardProps {
  marker: ClassifiedResult
  resultId: string
}

export function MarkerCard({ marker, resultId }: MarkerCardProps) {
  const [expanded, setExpanded] = useState(() => isDefaultExpanded(marker.state))

  const displayName = MARKER_DISPLAY_NAMES[marker.markerName] ?? marker.markerName
  const subtitle = MARKER_SUBTITLES[marker.markerName] ?? ''

  return (
    <article className="marker-card">
      <button
        className="marker-card__summary"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="marker-card__summary-top">
          <div className="marker-card__name-group">
            <h2 className="marker-card__name">{displayName}</h2>
            {subtitle && <p className="marker-card__subtitle">{subtitle}</p>}
          </div>
          <div className="marker-card__summary-right">
            <StatusBadge state={marker.state} />
            <span className="marker-card__chevron" aria-hidden>
              {expanded ? '▴' : '▾'}
            </span>
          </div>
        </div>
        <div className="marker-card__bar-area">
          <TrafficLightBar
            value={marker.value}
            unit={marker.unit}
            referenceLow={marker.referenceLow}
            referenceHigh={marker.referenceHigh}
            state={marker.state}
          />
        </div>
      </button>

      {expanded && (
        <div className="marker-card__detail">
          <ResultExplain stateLabel={marker.stateLabel} explanation={marker.explanation} />
          <ResultEducate educationContext={marker.educationContext} markerName={marker.markerName} />
          {marker.requiresQualifier && marker.qualifierKey ? (
            <QualifierGate
              resultId={resultId}
              questionKey={marker.qualifierKey}
              question={QUALIFIER_QUESTIONS[marker.qualifierKey] ?? marker.qualifierKey}
            />
          ) : (
            <>
              <ResultRecommend
                primaryCta={marker.primaryCta}
                secondaryCta={marker.secondaryCta}
                state={marker.state}
                recommendationStrategy={marker.recommendationStrategy}
              />
              <ResultConvert
                primaryCta={marker.primaryCta}
                secondaryCta={marker.secondaryCta}
              />
            </>
          )}
        </div>
      )}
    </article>
  )
}
