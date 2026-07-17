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
// Dark behind GP_HANDOFF_ENABLED (default OFF → notFound). COPY STATUS: DRAFT,
// pending Ewa sign-off on the template wording before the flag is turned on.
//
// Zero new dependency: rendered as clean HTML with Tailwind `print:` variants;
// the customer prints or saves as PDF from the browser. A server-generated PDF
// (a real dependency decision) is a later option, not built here.

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
    <div className="bg-white text-black">
      <div className="max-w-3xl mx-auto px-8 py-12 print:px-0 print:py-0">

        {/* Print control (hidden on the printed page) */}
        <div className="flex justify-between items-center mb-10 print:hidden">
          <a href="/results-dashboard" className="font-mono text-xs uppercase tracking-wider underline">
            Back to results
          </a>
          <PrintButton />
        </div>

        {/* Header */}
        <header className="border-b-4 border-black pb-6 mb-8">
          <p className="font-mono text-xs font-bold tracking-widest uppercase mb-2">
            Blood test results: summary for your GP
          </p>
          <h1 className="font-black font-sans text-3xl uppercase tracking-tight">
            {fullName || user.email}
          </h1>
          <div className="font-serif text-sm text-gray-700 mt-3 space-y-1">
            {fullName && <p>Email: {user.email}</p>}
            <p>Date of birth: {formatDate(profile?.date_of_birth ?? null)}</p>
          </div>
        </header>

        {/* Accreditation line (Vitall agreement §3.6: state accreditation, no UKAS symbol) */}
        <p className="font-serif text-sm text-gray-700 mb-8">
          These samples were analysed by a UKAS ISO 15189 accredited laboratory.
          The reference ranges shown are the laboratory&rsquo;s own.
        </p>

        {/* Results tables, one per kit (most recent result) */}
        {data.kits.map((kit) => {
          const result = kit.results[0]
          if (!result) return null
          return (
            <section key={kit.kitType} className="mb-10">
              <h2 className="font-black font-sans text-lg uppercase tracking-tight border-b-2 border-black pb-2 mb-4">
                {KIT_LABELS[kit.kitType] ?? kit.kitType}
                <span className="block font-sans font-normal normal-case tracking-normal text-sm text-gray-600 mt-1">
                  Sample collected: {formatDate(result.collectedAt)}
                </span>
              </h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-black text-left font-mono text-xs uppercase tracking-wider">
                    <th className="py-2 pr-4">Marker</th>
                    <th className="py-2 pr-4">Result</th>
                    <th className="py-2 pr-4">Reference range</th>
                    <th className="py-2">Andro Prime reading</th>
                  </tr>
                </thead>
                <tbody className="font-serif">
                  {result.markers.map((m) => (
                    <tr key={m.markerName} className="border-b border-gray-300">
                      <td className="py-2 pr-4 font-medium">{m.markerName}</td>
                      <td className="py-2 pr-4">{m.value} {m.unit}</td>
                      <td className="py-2 pr-4">{referenceRange(m)} {m.unit}</td>
                      <td className="py-2">{m.stateLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )
        })}

        {/* Questions to take to your GP (generic, conservative, no clinical claim) */}
        <section className="border-4 border-black p-6 mb-8">
          <h2 className="font-black font-sans text-lg uppercase tracking-tight mb-4">
            Questions to ask your GP
          </h2>
          <ul className="font-serif text-sm text-gray-800 space-y-2 list-disc pl-5">
            <li>These are the results I would like to go through with you.</li>
            <li>Are any of these worth repeating or investigating further?</li>
            <li>Do any of them point to something I should follow up on?</li>
          </ul>
        </section>

        {/* Not-a-diagnosis disclaimer (compliant framing) */}
        <p className="font-serif text-xs text-gray-600 leading-relaxed">
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
