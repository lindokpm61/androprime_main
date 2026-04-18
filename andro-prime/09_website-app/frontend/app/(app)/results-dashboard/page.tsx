import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth/session'
import { getDashboardData } from '@/lib/results/getDashboardData'
import {
  ResultValue,
  ResultExplain,
  ResultEducate,
  ResultRecommend,
  ResultConvert,
  QualifierGate,
} from '@/components/results-engine'

export const metadata: Metadata = {
  title: 'Your Results',
  robots: { index: false, follow: false },
}

const QUALIFIER_QUESTIONS: Record<string, string> = {
  crp_joint_symptoms: 'Do you experience joint pain or stiffness?',
}

export default async function ResultsDashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const data = await getDashboardData(user.id)

  if (data.state === 'no-results') {
    return (
      <div className="results-dashboard">
        <div className="results-dashboard__inner">
          <div className="results-holding">
            <p className="data-label text-xs mb-4">Your results</p>
            <h1 className="font-black font-sans text-3xl uppercase tracking-tight mb-4">
              Your results are on their way
            </h1>
            <p className="font-serif text-base text-stone-600 max-w-md mx-auto">
              Once your sample reaches the lab, your results will appear here. Most results are
              ready within 2 to 3 working days.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="results-dashboard">
      <div className="results-dashboard__inner">
        <div className="mb-10">
          <p className="data-label text-xs mb-2">Your results</p>
          <h1 className="font-black font-sans text-4xl uppercase tracking-tight">
            What your blood is telling you
          </h1>
        </div>

        {data.markers.map((marker) => (
          <article key={marker.markerName} className="results-panel">
            <div className="results-panel__header">
              <h2 className="font-black font-sans text-xl uppercase tracking-widest">
                {marker.markerName}
              </h2>
            </div>
            <div className="results-panel__body">
              <div className="results-panel__section">
                <ResultValue
                  value={marker.value}
                  unit={marker.unit}
                  state={marker.state}
                  referenceLow={marker.referenceLow}
                  referenceHigh={marker.referenceHigh}
                />
              </div>
              <div className="results-panel__section">
                <ResultExplain
                  stateLabel={marker.stateLabel}
                  explanation={marker.explanation}
                />
              </div>
              <div className="results-panel__section">
                <ResultEducate
                  educationContext={marker.educationContext}
                  markerName={marker.markerName}
                />
              </div>
              {marker.requiresQualifier && marker.qualifierKey && (
                <div className="results-panel__section">
                  <QualifierGate
                    resultId={data.resultId}
                    questionKey={marker.qualifierKey}
                    question={QUALIFIER_QUESTIONS[marker.qualifierKey] ?? marker.qualifierKey}
                  />
                </div>
              )}
              {!marker.requiresQualifier && (
                <>
                  <div className="results-panel__section">
                    <ResultRecommend
                      primaryCta={marker.primaryCta}
                      secondaryCta={marker.secondaryCta}
                      state={marker.state}
                      recommendationStrategy={marker.recommendationStrategy}
                    />
                  </div>
                  <div className="results-panel__section">
                    <ResultConvert
                      primaryCta={marker.primaryCta}
                      secondaryCta={marker.secondaryCta}
                    />
                  </div>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
