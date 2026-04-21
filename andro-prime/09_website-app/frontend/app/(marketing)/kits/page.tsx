import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

const kitsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kits', item: `${BASE_URL}/kits` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'At-Home Blood Test Kits for Men',
      description: 'Three diagnostic kits targeting testosterone, energy and recovery, or the full picture.',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Testosterone Health Check — £29',
          url: `${BASE_URL}/kits/testosterone`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Energy & Recovery Check — £44',
          url: `${BASE_URL}/kits/energy-recovery`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Hormone & Recovery Check — £69',
          url: `${BASE_URL}/kits/hormone-recovery`,
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'At-Home Blood Tests for Men',
  description: 'Three diagnostic kits targeting testosterone, energy and recovery, or the full picture. UKAS accredited lab. Results in 48 hours.',
  alternates: { canonical: 'https://andro-prime.com/kits' },
  openGraph: {
    title: 'At-Home Blood Tests for Men | Andro Prime',
    description: 'Three diagnostic kits targeting testosterone, energy and recovery, or the full picture. UKAS accredited lab. Results in 48 hours.',
    url: 'https://andro-prime.com/kits',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime diagnostic kits' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'At-Home Blood Tests for Men | Andro Prime',
    description: 'Three diagnostic kits targeting testosterone, energy and recovery, or the full picture. UKAS accredited lab. Results in 48 hours.',
    images: ['/og/default.png'],
  },
}

const CheckSvg = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className={`shrink-0 mt-0.5 ${className || ''}`}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function KitsPage() {
  return (
    <>
      <JsonLd data={kitsSchema} />
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start fade-up">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-none border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 rounded-none bg-black"></span>
              <span className="data-label !text-[10px] !text-black">Diagnostic Kits</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[90px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
              Stop guessing.<br />
              <span className="text-gray-400">Get the numbers.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              Three at-home blood tests. Each one gives you specific results from a UKAS accredited lab, delivered in plain English, with a clear next step based on what your data actually shows. No GP referral needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="#kits" className="bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 rounded-none transition-all flex items-center justify-center gap-2 shadow-none">
                See the tests
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
              <Link href="/test-selector" className="bg-white hover:bg-gray-100 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 rounded-none transition-all flex items-center justify-center shadow-none">
                Not sure which one?
              </Link>
            </div>
          </div>

          {/* Sidebar panel */}
          <div className="lg:col-span-5 fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-panel p-8 md:p-10 relative border-4 border-black bg-white">
              <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-6">
                <div className="text-black font-sans font-black uppercase text-xl tracking-tight">Available now</div>
                <div className="px-2 py-1 rounded-none bg-black border-2 border-black data-label !text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-none bg-white status-dot-pulse"></span>
                  UKAS Lab
                </div>
              </div>

              <div className="space-y-0 divide-y-2 divide-black">
                <div className="py-5 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors -mx-8 px-8 md:-mx-10 md:px-10">
                  <div>
                    <h3 className="font-sans font-black text-base uppercase tracking-tight text-black mb-0.5">Testosterone Health Check</h3>
                    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Total T · SHBG · FAI · Albumin · Free T</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-sans font-black text-xl text-black">£29</span>
                  </div>
                </div>

                <div className="py-5 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors -mx-8 px-8 md:-mx-10 md:px-10">
                  <div>
                    <h3 className="font-sans font-black text-base uppercase tracking-tight text-black mb-0.5">Energy &amp; Recovery Check</h3>
                    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Vit D · Active B12 · hs-CRP · Ferritin</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-sans font-black text-xl text-black">£44</span>
                  </div>
                </div>

                <div className="py-5 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors -mx-8 px-8 md:-mx-10 md:px-10">
                  <div>
                    <h3 className="font-sans font-black text-base uppercase tracking-tight text-black mb-0.5">Hormone &amp; Recovery Check</h3>
                    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">All 9 markers · Full picture</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-sans font-black text-xl text-black">£69</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-3 -mx-8 px-8 md:-mx-10 md:px-10">
                  <p className="font-serif text-sm text-black leading-relaxed">Not sure which kit fits your symptoms? Use the selector and answer 3 questions.</p>
                  <Link href="/test-selector" className="data-label flex items-center gap-2 hover:underline">
                    Go to test selector
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 KITS */}
      <section id="kits" className="py-32 relative bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-20">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[4px] bg-black"></span>
              The full range
            </div>
            <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter max-w-4xl leading-[0.9]">
              Three tests.<br />
              <span className="text-gray-400">Different questions.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-8">

            {/* Kit 1 */}
            <div className="glass-panel border-4 border-black hover:bg-gray-50 transition-colors">
              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-8 p-10 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                      <div>
                        <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black self-start mb-4 inline-flex">
                          Kit 1
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-black leading-none">Testosterone<br />Health Check</h3>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <span className="block text-4xl font-sans font-black text-black">£29</span>
                        <span className="text-sm font-serif text-gray-500">one-off</span>
                      </div>
                    </div>

                    <p className="text-lg text-black font-serif mb-8 leading-relaxed max-w-2xl">
                      Your GP told you you&apos;re normal. That&apos;s not the same as good. This test shows exactly where your testosterone sits, including free testosterone and SHBG, which standard GP panels often skip. Results in 48 hours with a plain-English explanation of what they mean.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="border-2 border-black p-4">
                        <div className="data-label mb-2">Markers tested</div>
                        <div className="font-sans font-black text-black text-sm leading-snug">Total T · SHBG · FAI · Albumin · Free T</div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="data-label mb-2">Turnaround</div>
                        <div className="font-sans font-black text-black text-sm leading-snug">Results within 48hrs of sample receipt</div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="data-label mb-2">Right for</div>
                        <div className="font-sans font-black text-black text-sm leading-snug">Low energy, low drive, &quot;not myself&quot; symptoms</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t-2 border-black">
                    <div className="data-label mb-3">If your result shows testosterone below 12 nmol/L</div>
                    <p className="font-serif text-sm text-black">You will receive a specific next step, not a generic recommendation. Low T unlocks the founding member pathway for when we launch TRT.</p>
                  </div>
                </div>

                <div className="lg:col-span-4 p-10 flex flex-col justify-between bg-white">
                  <div className="space-y-6">
                    <div>
                      <div className="data-label mb-3">What arrives in the post</div>
                      <ul className="space-y-2 font-serif text-sm text-black">
                        <li className="flex items-start gap-3">
                          <CheckSvg />
                          Finger-prick collection kit
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckSvg />
                          Pre-paid return label
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckSvg />
                          5-minute collection process
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="data-label mb-3">Results delivered to</div>
                      <p className="font-serif text-sm text-black">Your Andro Prime dashboard. Not the lab portal. Plain English with a specific next step.</p>
                    </div>
                  </div>
                  <Link href="/kits/testosterone" className="mt-8 block w-full text-center px-6 py-5 bg-black text-white border-4 border-black font-sans font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors">
                    Order for £29
                  </Link>
                </div>
              </div>
            </div>

            {/* Kit 2 */}
            <div className="glass-panel border-4 border-black hover:bg-gray-50 transition-colors">
              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-8 p-10 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                      <div>
                        <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black self-start mb-4 inline-flex">
                          Kit 2
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-black leading-none">Energy &amp;<br />Recovery Check</h3>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <span className="block text-4xl font-sans font-black text-black">£44</span>
                        <span className="text-sm font-serif text-gray-500">one-off</span>
                      </div>
                    </div>

                    <p className="text-lg text-black font-serif mb-8 leading-relaxed max-w-2xl">
                      Sore for 3 days after a session that used to take 1. Tired all the time. Joints aching. This test looks at the four markers most likely to explain why: Vitamin D, Active B12 (Holotranscobalamin), inflammation (hs-CRP), and iron stores (Ferritin). If the issue is hormones, Kit 1 or Kit 3 is the better fit.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="border-2 border-black p-4">
                        <div className="data-label mb-2">Markers tested</div>
                        <div className="font-sans font-black text-black text-sm leading-snug">Vit D · Active B12 · hs-CRP · Ferritin</div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="data-label mb-2">Turnaround</div>
                        <div className="font-sans font-black text-black text-sm leading-snug">Results within 48hrs of sample receipt</div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="data-label mb-2">Right for</div>
                        <div className="font-sans font-black text-black text-sm leading-snug">Poor recovery, fatigue, joint stress, slow progress</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t-2 border-black">
                    <div className="data-label mb-3">Supplement triggers from this kit</div>
                    <p className="font-serif text-sm text-black">Low D or low Active B12 points to Daily Stack. Elevated hs-CRP with joint symptoms points to Collagen. Multiple deficiencies can route to the bundle. All recommendations are based on your specific numbers.</p>
                  </div>
                </div>

                <div className="lg:col-span-4 p-10 flex flex-col justify-between bg-gray-50">
                  <div className="space-y-6">
                    <div>
                      <div className="data-label mb-3">What arrives in the post</div>
                      <ul className="space-y-2 font-serif text-sm text-black">
                        <li className="flex items-start gap-3">
                          <CheckSvg />
                          Finger-prick collection kit
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckSvg />
                          Pre-paid return label
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckSvg />
                          5-minute collection process
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="data-label mb-3">Results delivered to</div>
                      <p className="font-serif text-sm text-black">Your Andro Prime dashboard. With supplement recommendations matched to your specific markers.</p>
                    </div>
                  </div>
                  <Link href="/kits/energy-recovery" className="mt-8 block w-full text-center px-6 py-5 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
                    Order for £44
                  </Link>
                </div>
              </div>
            </div>

            {/* Kit 3 */}
            <div className="bg-black hover:bg-zinc-900 transition-colors border-4 border-black rounded-none">
              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-8 p-10 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-gray-700">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                      <div>
                        <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-white self-start mb-4 inline-flex text-black">
                          Kit 3 — Most complete
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-white leading-none">Hormone &amp;<br />Recovery Check</h3>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <span className="block text-4xl font-sans font-black text-white">£69</span>
                        <span className="text-sm font-serif text-gray-400">one-off</span>
                      </div>
                    </div>

                    <p className="text-lg text-white font-serif mb-8 leading-relaxed max-w-2xl opacity-90">
                      Nine markers covering hormones, energy, recovery, and inflammation in one kit. The right choice when you are not sure whether the problem is testosterone, deficiency, or both. If there is ambiguity, start here.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="border-2 border-gray-600 p-4">
                        <div className="data-label mb-2 !text-gray-400">Markers tested</div>
                        <div className="font-sans font-black text-white text-sm leading-snug">Total T · SHBG · FAI · Albumin · Free T · Vit D · Active B12 · hs-CRP · Ferritin</div>
                      </div>
                      <div className="border-2 border-gray-600 p-4">
                        <div className="data-label mb-2 !text-gray-400">Turnaround</div>
                        <div className="font-sans font-black text-white text-sm leading-snug">Results within 48hrs of sample receipt</div>
                      </div>
                      <div className="border-2 border-gray-600 p-4">
                        <div className="data-label mb-2 !text-gray-400">Right for</div>
                        <div className="font-sans font-black text-white text-sm leading-snug">Full picture across hormones, energy, and recovery</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t-2 border-gray-700">
                    <div className="data-label mb-3 !text-gray-400">Most supplement conversion pathways</div>
                    <p className="font-serif text-sm text-gray-300">Kit 3 covers both testosterone and deficiency markers. It unlocks the founding member pathway if T is low, and supplement routes for every deficiency pattern. Best choice when the picture is unclear.</p>
                  </div>
                </div>

                <div className="lg:col-span-4 p-10 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <div className="data-label mb-3 !text-gray-400">What arrives in the post</div>
                      <ul className="space-y-2 font-serif text-sm text-gray-300">
                        <li className="flex items-start gap-3">
                          <CheckSvg className="text-white" />
                          Finger-prick collection kit
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckSvg className="text-white" />
                          Pre-paid return label
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckSvg className="text-white" />
                          5-minute collection process
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="data-label mb-3 !text-gray-400">Results delivered to</div>
                      <p className="font-serif text-sm text-gray-300">Your Andro Prime dashboard. Full breakdown across all nine markers with targeted recommendations.</p>
                    </div>
                  </div>
                  <Link href="/kits/hormone-recovery" className="mt-8 block w-full text-center px-6 py-5 bg-white text-black border-4 border-white font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white hover:border-gray-600 transition-colors">
                    Order for £69
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-16">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[4px] bg-black"></span>
              Side by side
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter max-w-4xl leading-[0.9]">
              What each kit tests.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="text-left py-4 pr-8 font-mono text-xs tracking-widest uppercase text-black font-bold w-1/4">Marker</th>
                  <th className="text-center py-4 px-4 font-mono text-xs tracking-widest uppercase text-black font-bold">
                    Kit 1<br />
                    <span className="font-sans font-black text-lg normal-case tracking-normal">£29</span>
                  </th>
                  <th className="text-center py-4 px-4 font-mono text-xs tracking-widest uppercase text-black font-bold">
                    Kit 2<br />
                    <span className="font-sans font-black text-lg normal-case tracking-normal">£44</span>
                  </th>
                  <th className="text-center py-4 px-4 font-mono text-xs tracking-widest uppercase text-black font-bold bg-gray-100 border-l-4 border-r-4 border-black">
                    Kit 3<br />
                    <span className="font-sans font-black text-lg normal-case tracking-normal">£69</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Total Testosterone (nmol/L)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">SHBG (nmol/L)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Free Androgen Index (FAI)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Albumin (g/L)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Free Testosterone (calculated)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Vitamin D (25-OH)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Active B12 (Holotranscobalamin)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">hs-CRP (inflammation)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-serif text-black">Ferritin (iron stores)</td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 border-2 border-gray-300 inline-block"></span></td>
                  <td className="py-4 px-4 text-center"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                  <td className="py-4 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-black"><span className="w-5 h-5 bg-black inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg></span></td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-4 border-black">
                  <td className="pt-6 pr-8 font-mono text-xs tracking-widest uppercase text-black font-bold">Total markers</td>
                  <td className="pt-6 px-4 text-center font-sans font-black text-2xl text-black">5</td>
                  <td className="pt-6 px-4 text-center font-sans font-black text-2xl text-black">4</td>
                  <td className="pt-6 px-4 text-center font-sans font-black text-2xl text-black bg-gray-100 border-l-4 border-r-4 border-black">9</td>
                </tr>
                <tr>
                  <td className="pt-2 pb-6 pr-8"></td>
                  <td className="pt-2 pb-6 px-4 text-center">
                    <Link href="/kits/testosterone" className="inline-block px-4 py-3 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">Order</Link>
                  </td>
                  <td className="pt-2 pb-6 px-4 text-center">
                    <Link href="/kits/energy-recovery" className="inline-block px-4 py-3 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">Order</Link>
                  </td>
                  <td className="pt-2 pb-6 px-4 text-center bg-gray-100 border-l-4 border-r-4 border-b-4 border-black">
                    <Link href="/kits/hormone-recovery" className="inline-block px-4 py-3 bg-black text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors">Order</Link>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* PROCESS STRIP */}
      <section className="py-32 bg-white border-t-4 border-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[4px] bg-black"></span>
              Process
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter max-w-3xl leading-[0.9]">
              Order to results in under a week.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-2 border-black">
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-4 leading-none">01</div>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-3">Order online</h3>
              <p className="font-serif text-sm text-black leading-relaxed">Choose your kit. Pay once. Kit dispatched the same working day.</p>
            </div>

            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-4 leading-none">02</div>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-3">Collect at home</h3>
              <p className="font-serif text-sm text-black leading-relaxed">Five minutes. Finger-prick. Return with the pre-paid label in your kit.</p>
            </div>

            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-4 leading-none">03</div>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-3">Lab processes it</h3>
              <p className="font-serif text-sm text-black leading-relaxed">UKAS ISO 15189 accredited lab. Results ready within 48 hours of receipt.</p>
            </div>

            <div className="p-8">
              <div className="font-sans font-black text-5xl text-gray-200 mb-4 leading-none">04</div>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-black mb-3">Plain-English results</h3>
              <p className="font-serif text-sm text-black leading-relaxed">Your numbers in your dashboard. What they mean. What to do next. Specific to your data.</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Link href="/how-it-works" className="data-label flex items-center gap-2 hover:underline">
              Full process breakdown
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* NOT SURE CTA */}
      <section className="py-32 bg-white border-t-4 border-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass-panel p-10 md:p-16 border-4 border-black bg-gray-50 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 border-b-4 border-l-4 border-black hidden md:flex items-start justify-end p-4 bg-white">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>

            <div className="lg:w-2/3 relative z-10">
              <div className="data-label flex items-center gap-4 mb-8">
                <span className="w-12 h-[4px] bg-black"></span>
                Still not sure
              </div>
              <p className="text-xl md:text-2xl text-black font-serif leading-relaxed">
                <strong className="text-black font-sans font-black uppercase tracking-tight border-b-2 border-black pb-1">Three questions. One clear recommendation.</strong>
                <br /><br />
                The test selector asks about your main symptoms and tells you which kit fits best. Takes less than a minute.
              </p>
            </div>

            <div className="lg:w-1/3 w-full relative z-10 flex lg:justify-end">
              <Link href="/test-selector" className="w-full text-center bg-black hover:bg-white text-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-8 py-8 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]">
                Use the selector
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
