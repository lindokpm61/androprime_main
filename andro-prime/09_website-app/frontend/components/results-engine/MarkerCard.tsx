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

// Vitall returns three shapes of reference range: a pair ("8.64 - 29.00"), an
// upper bound only ("<1.00", hs-CRP), and a LOWER bound only (">37.5", Active
// B12). This block previously keyed off `referenceHigh` alone, so the third
// shape rendered nothing at all and Active B12 was the one marker on the
// dashboard showing no reference range. The GP handoff sheet already handled
// all three; this brings the card in line. The dev fixtures hid it by giving
// B12 an invented upper bound of 188, which the live assay does not return.
function referenceLabel(marker: ClassifiedResult): string | null {
  const { referenceLow: low, referenceHigh: high } = marker
  if (low !== null && high !== null) return `REF: ${low}–${high}`
  if (high !== null) return `REF: <${high}`
  if (low !== null) return `REF: >${low}`
  return null
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
  /** Collapse "The Evidence" into a closed disclosure. See isEvidenceDisclosureEnabled. */
  collapseEvidence?: boolean
}

export function MarkerCard({
  marker,
  resultId,
  index = 0,
  kitType,
  isMaintenanceAnchor = false,
  collapseEvidence = false,
}: MarkerCardProps) {
  const displayName = MARKER_DISPLAY_NAMES[marker.markerName] ?? marker.markerName
  const isMaintenance = marker.primaryCta?.type === 'maintenance-offer'

  return (
    <article
      className="f-tray f-rise"
      style={{ transitionDelay: `${Math.min(index, 6) * 90}ms` }}
    >
      <div className="f-core">

        {/* The reading. Name, verdict, value, reference, then the bar. One
            column: the V2.0 card put the value and the prose side by side in a
            12-column grid, which at the shell's measure would leave the number
            in a 290px gutter. Frame C draws it stacked for the same reason. */}
        <div className="f-mkname">
          <h3>{displayName}</h3>
        </div>

        <div className="f-mkread">
          <div className="f-mkval">
            {marker.value}
            <span>{marker.unit}</span>
          </div>
          <StatusBadge state={marker.state} />
        </div>

        {referenceLabel(marker) && <p className="f-mkref">{referenceLabel(marker)}</p>}

        <TrafficLightBar
          value={marker.value}
          unit={marker.unit}
          referenceLow={marker.referenceLow}
          referenceHigh={marker.referenceHigh}
          displayZones={marker.displayZones}
          state={marker.state}
        />

        <div className="f-mkblock">
          <p className="f-blab">What this means</p>
          <p>{marker.explanation}</p>
        </div>

          {/* The Evidence. Generic per-marker explainer, identical on every
              visit and for every customer with this marker, so behind
              EVIDENCE_DISCLOSURE_ENABLED it collapses to a disclosure. Native
              <details>: keyboard and screen-reader support for free, no JS, and
              the copy stays in the DOM either way. No words change. */}
        {collapseEvidence ? (
          <details className="f-mkblock f-mkdet">
            <summary>
              <span className="f-blab" style={{ marginBottom: 0 }}>The evidence</span>
            </summary>
            <p style={{ marginTop: 14 }}>{marker.educationContext}</p>
          </details>
        ) : (
          <div className="f-mkblock">
            <p className="f-blab">The evidence</p>
            <p>{marker.educationContext}</p>
          </div>
        )}

      {/* Footer: recommendation + CTA */}
      {marker.requiresQualifier && marker.qualifierKey ? (
        <div className="f-mkgate">
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
          <div className="f-mkfoot">
            <div className="f-mkfoot-b">
              <p className="f-blab">What we recommend</p>
              <div>
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
            <div>
              <MaintenanceOfferCta />
            </div>
          </div>
        ) : null
      ) : (
        <div className="f-mkfoot">
          <div className="f-mkfoot-b">
            <p className="f-blab">What we recommend</p>
            <div>
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
          <div>
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
        <div className="f-mkgate">
          <LowTNurtureConsent />
        </div>
      )}

      {/* Borderline (low-end-of-normal) nurture opt-in — shown on the testosterone
          card when the value sits in the 12–<15 band. The card itself still reads
          as `normal-testosterone` (no clinical reclassification); this opt-in is
          the consent gate that feeds seq-03d, mirroring the low-T opt-in above. */}
      {marker.markerName === 'Testosterone' &&
        isBorderlineTestosterone(marker.value) && (
        <div className="f-mkgate">
          <BorderlineNurtureConsent />
        </div>
      )}

      </div>
    </article>
  )
}
