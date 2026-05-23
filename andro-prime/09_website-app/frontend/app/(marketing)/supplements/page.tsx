import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

const BASE_URL = 'https://andro-prime.com'

const supplementsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${BASE_URL}/supplements` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Supplements, Launching Shortly',
  description: 'Targeted supplement formulas built around blood data. The Daily Stack and Joint and Recovery Collagen launch shortly. Join the waitlist for early dispatch and a founding-customer discount.',
  alternates: { canonical: 'https://andro-prime.com/supplements' },
  openGraph: {
    title: 'Supplements Launching Shortly | Andro Prime',
    description: 'The Daily Stack and Joint and Recovery Collagen launch shortly. Join the waitlist for early dispatch and a founding-customer discount.',
    url: 'https://andro-prime.com/supplements',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime supplements' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supplements Launching Shortly | Andro Prime',
    description: 'The Daily Stack and Joint and Recovery Collagen launch shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

export default function SupplementsPage() {
  return (
    <>
      <JsonLd data={supplementsSchema} />
      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
                <span className="w-2 h-2 bg-black" />
                <span className="data-label !text-[10px] !text-black">Supplements // Launching Shortly</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Built for what your numbers<br />
                <span className="text-gray-400">actually show.</span>
              </h1>

              <p className="text-lg md:text-xl text-black font-serif mb-8 max-w-2xl leading-relaxed">
                Our supplement range launches shortly, as soon as our manufacturing partner is confirmed. Two targeted formulas, built around blood-data patterns. Not generic men&rsquo;s health products. Join the waitlist for early dispatch and a founding-customer discount.
              </p>

              <ul className="space-y-3 font-serif text-base text-black mb-2">
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> Free to join.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> No payment is taken.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> No supplement orders are being taken right now.</li>
              </ul>
            </div>

            <div className="lg:col-span-5" id="join">
              <SupplementWaitlistForm interestedInProduct="any" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS COMING */}
      <section id="what-is-coming" className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[4px] bg-black" />
              What is coming
            </div>
            <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter max-w-4xl leading-[0.9]">
              Two supplement routes.<br />
              <span className="text-gray-400">Different jobs.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* Daily Stack */}
            <div className="bg-white border-4 border-black flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow flex flex-col">
                <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black self-start mb-8">
                  Daily deficiency support
                </div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-black max-w-[280px] leading-none">Daily Stack</h3>
                  <div className="text-right">
                    <span className="data-label px-3 py-1.5 border-2 border-black bg-white">Coming soon</span>
                  </div>
                </div>
                <p className="text-lg text-black font-serif mb-10 leading-relaxed flex-grow">Built for men whose blood data shows the common gaps behind energy, recovery, and training output. Designed to be the one daily product, not the sixth.</p>
                <div className="space-y-4 mt-auto pt-8 border-t-4 border-black">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest mb-6">EFSA-approved claims</div>
                  <p className="font-serif text-sm leading-relaxed">Zinc contributes to the maintenance of normal testosterone levels. Vitamin D3 contributes to normal muscle function. Active B12 contributes to normal energy-yielding metabolism.</p>
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/supplements/daily-stack" className="block w-full text-center px-6 py-5 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-base hover:bg-black hover:text-white transition-colors">
                  Read about Daily Stack
                </Link>
              </div>
            </div>

            {/* Collagen */}
            <div className="bg-gray-100 border-4 border-black flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow flex flex-col">
                <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white border-2 border-black self-start mb-8">
                  Joint and inflammation support
                </div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-black max-w-[160px] sm:max-w-[280px] leading-none">Joint &amp; Recovery Collagen</h3>
                  <div className="text-right shrink-0 ml-4">
                    <span className="data-label px-3 py-1.5 border-2 border-black bg-white">Coming soon</span>
                  </div>
                </div>
                <p className="text-lg text-black font-serif mb-10 leading-relaxed flex-grow">A recovery-focused collagen formula for active men whose blood data confirmed elevated inflammation markers, and who report joint symptoms.</p>
                <div className="space-y-4 mt-auto pt-8 border-t-4 border-black">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest mb-6">EFSA-approved claim</div>
                  <p className="font-serif text-sm leading-relaxed">Vitamin C contributes to normal collagen formation for the normal function of cartilage.</p>
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/supplements/collagen" className="block w-full text-center px-6 py-5 bg-black text-white border-4 border-black font-sans font-black uppercase tracking-widest text-base hover:bg-white hover:text-black transition-colors">
                  Read about Collagen
                </Link>
              </div>
            </div>

            {/* Complete Men's Stack: concept */}
            <div className="lg:col-span-2 bg-white border-4 border-black p-10">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="data-label mb-3">Coming with the launch</div>
                  <h3 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mb-4">Complete Men&rsquo;s Stack</h3>
                  <p className="font-serif text-base leading-relaxed">
                    A bundle pairing the Daily Stack and Joint and Recovery Collagen, for men whose blood data points in both directions. Pricing is finalised before launch. Waitlist members hear first.
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <a href="#join" className="inline-flex items-center gap-3 border-4 border-black px-6 py-4 font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
                    Join the waitlist
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROUTING GUIDANCE */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[4px] bg-black" />
              In the meantime
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter max-w-4xl leading-[0.9]">
              Test first. Supplement later.
            </h2>
            <p className="mt-8 text-lg text-black font-serif max-w-3xl leading-relaxed">
              The blood test is the part that is live today. We recommend supplements based on your result. Our own range launches shortly. Until then, the result still tells you what is going on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-black p-10 hover:bg-gray-50 transition-colors flex flex-col h-full">
              <div className="font-sans font-black uppercase tracking-tighter text-3xl text-black mb-6 pb-6 border-b-2 border-black">Not sure yet</div>
              <p className="text-black font-serif text-lg leading-relaxed mb-6">Run the test selector first. If the issue might be hormones, deficiency, or inflammation, let the data lead.</p>
              <Link href="/test-selector" className="mt-auto inline-flex items-center gap-3 text-black font-sans font-black uppercase tracking-widest text-sm hover:underline">
                Use the test selector
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="bg-white border-2 border-black p-10 hover:bg-gray-50 transition-colors flex flex-col h-full">
              <div className="font-sans font-black uppercase tracking-tighter text-3xl text-black mb-6 pb-6 border-b-2 border-black">See the kits</div>
              <p className="text-black font-serif text-lg leading-relaxed mb-6">Three kits, covering testosterone, energy and recovery, or both. Results in 2 to 5 working days.</p>
              <Link href="/kits" className="mt-auto inline-flex items-center gap-3 text-black font-sans font-black uppercase tracking-widest text-sm hover:underline">
                Browse kits
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="bg-black hover:bg-gray-900 transition-colors border-2 border-black p-10 flex flex-col h-full">
              <div className="font-sans font-black uppercase tracking-tighter text-3xl text-white mb-6 pb-6 border-b-2 border-gray-800">Save your seat</div>
              <p className="text-white font-serif text-lg leading-relaxed opacity-90 mb-6">Join the waitlist now. Early dispatch and a founding-customer discount when we launch.</p>
              <a href="#join" className="mt-auto inline-flex items-center gap-3 text-white font-sans font-black uppercase tracking-widest text-sm hover:underline">
                Join the waitlist
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
