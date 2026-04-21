import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'

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
    {
      '@type': 'ItemList',
      name: 'Supplements Built for Your Blood Data',
      description: 'Two targeted supplement formulas built around blood test results.',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Daily Stack — £34.95/month',
          url: `${BASE_URL}/supplements/daily-stack`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Joint & Recovery Collagen — £29.95/month',
          url: `${BASE_URL}/supplements/collagen`,
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Supplements — Built for Your Blood Data',
  description: 'Two targeted supplement formulas built around blood data. Daily Stack for deficiency and recovery support. Joint & Recovery Collagen for joint stress and inflammation markers.',
  alternates: { canonical: 'https://andro-prime.com/supplements' },
  openGraph: {
    title: 'Supplements Built for Your Blood Data | Andro Prime',
    description: 'Two targeted supplement formulas built around blood data. Daily Stack for deficiency and recovery support. Joint & Recovery Collagen for joint stress and inflammation markers.',
    url: 'https://andro-prime.com/supplements',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime supplements' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supplements Built for Your Blood Data | Andro Prime',
    description: 'Two targeted supplement formulas built around blood data. Daily Stack and Joint & Recovery Collagen.',
    images: ['/og/default.png'],
  },
}

const CheckSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function SupplementsPage() {
  return (
    <>
      <JsonLd data={supplementsSchema} />
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 overflow-hidden bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px] !text-black">Supplements</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[90px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
              Built for what your numbers<br />
              <span className="text-gray-400">actually show.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              These are not generic &ldquo;men&rsquo;s health&rdquo; products. Each formula exists to support a clear blood-data pattern: deficiency and recovery support, or joint and inflammation support. If you do not know what your markers look like yet, start with a test first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="#products" className="bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-all flex items-center justify-center gap-2">
                See the range
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <Link href="/test-selector" className="bg-white hover:bg-gray-100 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-all flex items-center justify-center">
                Need a test first?
              </Link>
            </div>
          </div>

          {/* Sidebar panel */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-black p-8 md:p-10">
              <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-6">
                <div className="text-black font-sans font-black uppercase text-xl tracking-tight">Current range</div>
                <div className="px-2 py-1 bg-black border-2 border-black data-label !text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white" />
                  Live Inventory
                </div>
              </div>

              <div className="space-y-0 divide-y-2 divide-black">
                <div className="py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors -mx-8 px-8">
                  <div>
                    <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-1">Daily Stack</h3>
                    <p className="font-serif text-sm text-black">Daily deficiency and recovery support.</p>
                  </div>
                  <div className="data-label px-3 py-1.5 border-2 border-black bg-white self-start sm:self-auto shrink-0">Deficiency</div>
                </div>

                <div className="py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors -mx-8 px-8">
                  <div>
                    <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-1 max-w-[220px]">Joint &amp; Recovery Collagen</h3>
                    <p className="font-serif text-sm text-black">Joint stress and inflammation support.</p>
                  </div>
                  <div className="data-label px-3 py-1.5 border-2 border-black bg-white self-start sm:self-auto shrink-0">Inflammation</div>
                </div>

                <div className="py-6 flex flex-col justify-between gap-4 bg-gray-100 -mx-8 px-8 border-t-4 border-black">
                  <div className="flex justify-between items-start">
                    <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-2">Test-first rule</h3>
                    <div className="data-label px-3 py-1.5 bg-black !text-white shrink-0 ml-4">Route first</div>
                  </div>
                  <p className="font-serif text-sm text-black leading-relaxed">If you are not sure whether the issue is hormones, inflammation, or nutrient depletion, test before you supplement.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[4px] bg-black" />
              Product hub
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
                    <span className="block text-3xl font-sans font-black text-black">£34.95</span>
                    <span className="text-sm font-serif text-gray-500">/ month</span>
                  </div>
                </div>
                <p className="text-lg text-black font-serif mb-10 leading-relaxed flex-grow">Four essential nutrients in one daily sachet. Built for men whose blood data shows the common gaps behind energy, recovery, and training output.</p>
                <div className="space-y-4 mt-auto pt-8 border-t-4 border-black">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest mb-6">Core Formulation</div>
                  {['Vitamin D3 & Magnesium', 'Zinc & B12'].map((item) => (
                    <div key={item} className="flex items-center gap-4 text-lg text-black font-serif font-bold">
                      <CheckSvg /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/supplements/daily-stack" className="block w-full text-center px-6 py-5 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-base hover:bg-black hover:text-white transition-colors">
                  View Daily Stack
                </Link>
              </div>
            </div>

            {/* Collagen */}
            <div className="bg-gray-100 border-4 border-black flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow flex flex-col">
                <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white border-2 border-black self-start mb-8">
                  Joint &amp; inflammation support
                </div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-black max-w-[280px] leading-none">Joint &amp; Recovery Collagen</h3>
                  <div className="text-right shrink-0 ml-4">
                    <span className="block text-3xl font-sans font-black text-black">£29.95</span>
                    <span className="text-sm font-serif text-gray-500">/ month</span>
                  </div>
                </div>
                <p className="text-lg text-black font-serif mb-10 leading-relaxed flex-grow">A recovery-focused collagen formula for active men with joint stress, heavy training load, or elevated inflammation markers.</p>
                <div className="space-y-4 mt-auto pt-8 border-t-4 border-black">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest mb-6">Core Formulation</div>
                  {['Hydrolysed Collagen & UC-II', 'Vitamin C & MSM'].map((item) => (
                    <div key={item} className="flex items-center gap-4 text-lg text-black font-serif font-bold">
                      <CheckSvg /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/supplements/collagen" className="block w-full text-center px-6 py-5 bg-black text-white border-4 border-black font-sans font-black uppercase tracking-widest text-base hover:bg-white hover:text-black transition-colors">
                  View Collagen
                </Link>
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
              Routing guidance
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter max-w-4xl leading-[0.9]">
              When to supplement, and when to test first.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-black p-10 hover:bg-gray-50 transition-colors flex flex-col h-full">
              <div className="font-sans font-black uppercase tracking-tighter text-3xl text-black mb-6 pb-6 border-b-2 border-black">Daily Stack</div>
              <p className="text-black font-serif text-lg leading-relaxed">Best fit when the pattern is deficiency-driven and you need baseline daily support.</p>
            </div>

            <div className="bg-white border-2 border-black p-10 hover:bg-gray-50 transition-colors flex flex-col h-full">
              <div className="font-sans font-black uppercase tracking-tighter text-3xl text-black mb-6 pb-6 border-b-2 border-black">Collagen</div>
              <p className="text-black font-serif text-lg leading-relaxed">Best fit when the pattern is joint stress, poor recovery, or inflammation-related wear from training.</p>
            </div>

            <div className="bg-black hover:bg-gray-900 transition-colors border-2 border-black p-10 flex flex-col h-full">
              <div className="font-sans font-black uppercase tracking-tighter text-3xl text-white mb-6 pb-6 border-b-2 border-gray-800">Test first</div>
              <p className="text-white font-serif text-lg leading-relaxed opacity-90">If you are not sure whether the issue is hormones, inflammation, or nutrient depletion, use the selector first and let the blood data lead the next move.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM VIEW CTA */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-10 md:p-16 border-4 border-black bg-gray-50 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="lg:w-2/3">
              <div className="data-label flex items-center gap-4 mb-8">
                <span className="w-12 h-[4px] bg-black" />
                System view
              </div>
              <p className="text-xl md:text-2xl text-black font-serif leading-relaxed">
                <strong className="text-black font-sans font-black uppercase tracking-tight border-b-2 border-black pb-1">The supplements are follow-on support, not a substitute for finding the problem.</strong>
                <br /><br />
                If your numbers point in both directions, the bundle route may make sense later. But the first decision should still be driven by your markers, not guesswork.
              </p>
            </div>
            <div className="lg:w-1/3 w-full flex lg:justify-end">
              <Link href="/test-selector" className="w-full text-center bg-black hover:bg-white text-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-8 py-8 transition-all">
                Choose the right route
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
