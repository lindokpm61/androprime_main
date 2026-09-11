import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/results/getDashboardData'
import { isGpHandoffEnabled } from '@/lib/flags'
import { PrintButton } from '@/components/results-engine/PrintButton'
import type { ClassifiedResult, KitType } from '@/lib/results/types'

export const metadata: Metadata = {
  title: 'Summary for your GP',
  robots: { index: false, follow: false },
}

// F3 / U1 GP handoff pack.
//
// A print-friendly one-page summary a customer can take to their GP. Pure
// advocacy: it presents the numbers, the reference ranges, and the questions to
// ask. It makes NO clinical claim, NO diagnosis, and never says a doctor
// reviewed the result (03_compliance red-flag table). "Ewa-approved
// recommendation logic" framing only.
//
// Dark behind GP_HANDOFF_ENABLED (default OFF → notFound). COPY STATUS:
// APPROVED (CA-023, Ewa via Keith's in-session representation 2026-07-19;
// countersignature recommended; pre-flight 0 HARD). Flipping the flag on
// remains a separate go/no-go.
//
// Zero new dependency: rendered as clean HTML with Tailwind `print:` variants;
// the customer prints or saves as PDF from the browser. A server-generated PDF
// (a real dependency decision) is a later option, not built here.
//
// ─────────────────────────────────────────────────────────────────────────
// TOUCHED 2026-09-11 (batch 3), AND IT IS THE ONE ROUTE IN THE BATCH THAT
// DELIBERATELY LEAVES DIRECTION F.
//
// Frame G's own note is the ruling: this is a print artefact for a clinician,
// not a screen for a customer. It has no tray, no wash, no grain, no ambient
// shadow and no dark mode, because none of those survive a laser printer and
// all of them cost legibility on paper. What it keeps from F is the TYPE and the
// hairline rules. A design system that cannot say "not here" is a style guide
// pretending to be a system.
//
// 🔴 NOT ONE WORD CHANGED. Every sentence here is CA-023 approved, including the
// accreditation line, the three questions and the closing disclaimer. The
// changes below are the type ramp and the print rules, nothing else.
//
// 🔴 THE TYPOGRAPHY CHANGED WITHOUT THIS FILE ASKING, WHICH IS WHY IT IS NOW
// EXPLICIT. The batch-3 layout wraps this tree in `.f-page`, whose
// `.f-page p, .f-page li` rule at (0,1,1) out-specifies Tailwind's `.font-serif`
// at (0,1,0). So every `font-serif` on this page silently became sans the moment
// the layout changed. That is the direction Frame G asks for, so it is kept, but
// it is kept ON PURPOSE and the dead `font-serif` classes are gone rather than
// left sitting there asserting something that no longer happens.
//
// ⚠ THE APP CHROME IS HIDDEN IN PRINT, and that is new. The layout gained a nav
// and a footer in this batch; before it, all six authenticated routes ended with
// the page and nothing under it, so there was no chrome to keep off the paper.
// The rules live in `f-app.css` beside the chrome they hide, not here.

const KIT_LABELS: Record<KitType, string> = {
  testosterone: 'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Not recorded'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? 'Not recorded'
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function referenceRange(m: ClassifiedResult): string {
  if (m.referenceLow !== null && m.referenceHigh !== null) return `${m.referenceLow} to ${m.referenceHigh}`
  if (m.referenceHigh !== null) return `< ${m.referenceHigh}`
  if (m.referenceLow !== null) return `> ${m.referenceLow}`
  return 'See lab report'
}

interface PageProps {
  searchParams: Promise<{ dev?: string }>
}

export default async function GpHandoffPage({ searchParams }: PageProps) {
  if (!isGpHandoffEnabled()) notFound()

  const user = await getCurrentUser()
  if (!user) return null

  // `dev` mirrors the dashboard: it only takes effect in non-production
  // (getDashboardData guards it), letting the handoff be previewed with fixture
  // data. In production it is ignored and real results are used.
  const { dev } = await searchParams
  const data = await getDashboardData(user.id, dev)
  if (data.state !== 'ready') redirect('/results-dashboard')

  const supabase = await createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name, date_of_birth')
    .eq('id', user.id)
    .single()

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')

  return (
    <div className="f-handoff">
      <div className="f-handoff-in">

        {/* Print control (hidden on the printed page) */}
        <div className="f-handoff-ctl print:hidden">
          <a href="/results-dashboard" className="f-tlink">
            Back to results
          </a>
          <PrintButton />
        </div>

        {/* Header */}
        <header className="f-handoff-head">
          <p className="f-blab">Blood test results: summary for your GP</p>
          <h1>{fullName || user.email}</h1>
          <div className="f-handoff-id">
            {fullName && <p>Email: {user.email}</p>}
            <p>Date of birth: {formatDate(profile?.date_of_birth ?? null)}</p>
          </div>
        </header>

        {/* Accreditation line (Vitall agreement §3.6: state accreditation, no UKAS symbol) */}
        <p className="f-handoff-note">
          These samples were analysed by a UKAS ISO 15189 accredited laboratory.
          The reference ranges shown are the laboratory&rsquo;s own.
        </p>

        {/* Results tables, one per kit (most recent result) */}
        {data.kits.map((kit) => {
          const result = kit.results[0]
          if (!result) return null
          return (
            <section key={kit.kitType} className="f-handoff-sec">
              <h2>
                {KIT_LABELS[kit.kitType] ?? kit.kitType}
                <span>Sample collected: {formatDate(result.collectedAt)}</span>
              </h2>
              <table className="f-handoff-t">
                <thead>
                  <tr>
                    <th>Marker</th>
                    <th>Result</th>
                    <th>Reference range</th>
                    <th>Andro Prime reading</th>
                  </tr>
                </thead>
                <tbody>
                  {result.markers.map((m) => (
                    <tr key={m.markerName}>
                      <td>{m.markerName}</td>
                      <td>{m.value} {m.unit}</td>
                      <td>{referenceRange(m)} {m.unit}</td>
                      <td>{m.stateLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )
        })}

        {/* Questions to take to your GP (generic, conservative, no clinical claim) */}
        <section className="f-handoff-q">
          <h2>Questions to ask your GP</h2>
          <ul>
            <li>These are the results I would like to go through with you.</li>
            <li>Are any of these worth repeating or investigating further?</li>
            <li>Do any of them point to something I should follow up on?</li>
          </ul>
        </section>

        {/* Not-a-diagnosis disclaimer (compliant framing) */}
        <p className="f-handoff-fine">
          Andro Prime is a wellness service. This summary is provided to help you
          discuss your results with your GP. It is not a diagnosis and does not
          replace medical advice. The readings shown come from Andro
          Prime&rsquo;s Ewa-approved recommendation logic applied to your
          numbers, not from a review of your individual case by a doctor.
        </p>

      </div>
    </div>
  )
}
