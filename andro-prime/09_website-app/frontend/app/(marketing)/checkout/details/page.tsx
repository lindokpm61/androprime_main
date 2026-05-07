import type { Metadata } from 'next'
import { CheckoutDetailsForm } from '@/components/commerce/CheckoutDetailsForm'

export const metadata: Metadata = {
  title: 'A few details for the lab — Andro Prime',
  description: 'Two details we need before your kit ships.',
  robots: { index: false, follow: false },
}

const VALID_KIT_TYPES = new Set(['testosterone', 'energy-recovery', 'hormone-recovery'])

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function CheckoutDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const kitParam = readParam(params.kit) ?? 'testosterone'
  const kitType = VALID_KIT_TYPES.has(kitParam) ? kitParam : 'testosterone'

  return (
    <>
      {/* HERO */}
      <section className="pt-40 pb-16 bg-white border-b-4 border-black">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-10">
            <span className="w-2 h-2 bg-black" />
            <span className="data-label !text-black">Step 1 of 2</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            Two details<br />for the lab.
          </h1>
          <p className="text-lg md:text-xl text-black font-serif leading-relaxed max-w-2xl">
            We need your date of birth and sex to register your sample with the lab. The lab uses these to apply the correct reference ranges to your results. Payment and delivery are on the next step.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 bg-gray-50 border-b-4 border-black">
        <div className="max-w-3xl mx-auto px-6">
          <div className="border-4 border-black p-8 md:p-12 bg-white">
            <CheckoutDetailsForm kitType={kitType as 'testosterone' | 'energy-recovery' | 'hormone-recovery'} />
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-8 justify-center">
            {[
              'GDPR compliant',
              'Stored securely in EU',
              '18+ only',
              'Never sold or shared',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 data-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
