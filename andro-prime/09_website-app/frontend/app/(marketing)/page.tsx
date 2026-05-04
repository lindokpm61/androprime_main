import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to take an Andro Prime at-home blood test',
  description: 'Order your kit, collect a finger-prick sample at home, post it back, and receive your results in your dashboard within 48 hours.',
  totalTime: 'PT5M',
  supply: [
    { '@type': 'HowToSupply', name: 'Blood test kit' },
    { '@type': 'HowToSupply', name: 'Lancets (included)' },
    { '@type': 'HowToSupply', name: 'Medical transport vial (included)' },
    { '@type': 'HowToSupply', name: 'Pre-paid return envelope (included)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Order your kit',
      text: 'Select the specific panel you need. Dispatched same-day via tracked delivery in discreet packaging.',
      url: `${BASE_URL}/kits`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Collect your sample',
      text: 'Simple, painless finger-prick collection at home. Takes five minutes. Best performed fasted, first thing in the morning, for accurate hormone baselines.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Post it back',
      text: 'Seal your sample in the medical transport vial and drop it in any Royal Mail priority postbox using the pre-paid return envelope.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'View your results',
      text: 'Access your secure dashboard within 48 hours of lab receipt. Clear data, doctor review, and actionable recommendations in plain English.',
      url: `${BASE_URL}/kits`,
    },
  ],
}

export const metadata: Metadata = {
  title: 'Andro Prime | Premium At-Home Blood Tests for Men',
  description: '5 minutes. No GP needed. Real results from a UKAS accredited lab — in plain English, with a specific recommendation based on your numbers.',
  alternates: { canonical: 'https://andro-prime.com' },
  openGraph: {
    title: 'Andro Prime | Premium At-Home Blood Tests for Men',
    description: '5 minutes. No GP needed. Real results from a UKAS accredited lab — in plain English, with a specific recommendation based on your numbers.',
    url: 'https://andro-prime.com',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime — At-home blood tests for men' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andro Prime | Premium At-Home Blood Tests for Men',
    description: '5 minutes. No GP needed. Real results from a UKAS accredited lab — in plain English, with a specific recommendation based on your numbers.',
    images: ['/og/default.png'],
  },
}

const CheckSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchema} />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pb-16 overflow-hidden bg-white">
        
        <div className="absolute inset-0 z-0">
          <video id="hero-video" autoPlay muted loop playsInline className="w-full h-full object-cover object-[center_30%] opacity-60 grayscale">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px] !text-black">Men&rsquo;s health, data first</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
              Stop guessing.<br />
              Start knowing.
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              5 minutes. No GP needed. Real results from a UKAS accredited lab, in plain English, with a specific recommendation based on your numbers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/kits" className="bg-black hover:bg-white border-2 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-all flex items-center justify-center gap-2">
                Explore Test Kits
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <Link href="/how-it-works" className="bg-white hover:bg-gray-100 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-all flex items-center justify-center">
                How it works
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 data-label">
              <div className="flex items-center gap-2">
                <CheckSvg />
                No GP required
              </div>
              <div className="flex items-center gap-2">
                <CheckSvg />
                Results in 48h
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="border-2 border-black p-8 bg-white relative">
              <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-black font-sans font-black uppercase text-base tracking-tight">Patient Analysis</div>
                    <div className="data-label !text-[10px]">ID: 8492-X · AGE: 42</div>
                  </div>
                </div>
                <div className="px-2 py-1 bg-black border border-black data-label !text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white" />
                  Live Data
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="data-label">Testosterone (Total)</div>
                    <div className="data-value">14.2 <span className="text-xs font-normal">nmol/L</span></div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[28%]" />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-mono font-bold text-black uppercase tracking-widest">
                    <span>Low</span><span>Borderline</span><span>Optimal</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="data-label">Free Testosterone</div>
                    <div className="data-value">0.28 <span className="text-xs font-normal">nmol/L</span></div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="data-label">hs-CRP (Inflammation)</div>
                    <div className="data-value text-amber-600">3.8 <span className="text-xs font-normal">mg/L</span></div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[65%]" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black -mx-8 -mb-8 p-8 bg-white">
                <div className="flex items-start gap-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="shrink-0 mt-1">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <p className="text-sm text-black font-serif leading-relaxed">
                    <span className="font-sans font-black uppercase tracking-tight">Panel Summary:</span> Testosterone is below your optimal range. Inflammation markers are elevated. Your dashboard explains what this means.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y-2 border-black bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x-2 divide-black">
            {[
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, label: 'UKAS ISO 15189', sub: 'Accredited Laboratory' },
              { icon: <><path d="M19 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="23" y2="12" /><line x1="23" y1="8" x2="19" y2="12" /></>, label: 'GMC-Registered', sub: 'Clinical Oversight' },
              { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, label: '48h Turnaround', sub: 'Fast, reliable results' },
              { icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>, label: 'Discreet Packaging', sub: 'Direct to your door' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center justify-center text-center px-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black mb-4">{icon}</svg>
                <span className="text-base font-sans font-black uppercase tracking-tight text-black">{label}</span>
                <span className="text-sm font-serif text-gray-600 mt-2">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLINICAL CONTEXT */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                Clinical Context
              </div>
              <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                &ldquo;Your results are normal.&rdquo;<br />
                <span className="text-gray-400 font-black">That&rsquo;s not an answer.</span>
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>The public health system sets testosterone thresholds to identify clinical deficiency: the baseline before you are officially recognised as ill. That standard is not the same as being optimised.</p>
                <p>Many men experiencing genuine symptoms, fatigue, brain fog, loss of drive, sit technically &ldquo;in range&rdquo; but far below their optimal levels. They are sent home without solutions.</p>
                <div className="pl-8 border-l-[6px] border-black py-4 bg-gray-50 mt-8">
                  <p className="text-black font-serif italic text-2xl leading-snug">Your GP isn&rsquo;t wrong. They&rsquo;re answering a different question. We answer yours.</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-10 md:p-12 relative overflow-hidden bg-white">
              <div className="flex items-center gap-4 mb-10 pb-8 border-b-2 border-black">
                <div className="w-3 h-3 bg-black" />
                <h3 className="font-sans font-black text-2xl tracking-tighter uppercase text-black m-0">Symptom Diagnostic</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Persistent fatigue', detail: ', even after a full night\'s restful sleep.' },
                  { label: 'Prolonged recovery.', detail: ' Sore for days after a workout that used to take hours.' },
                  { label: 'Diminished drive.', detail: ' Loss of motivation, focus, or libido.' },
                  { label: 'Brain fog.', detail: ' Mental sharpness feeling blunted.' },
                ].map(({ label, detail }) => (
                  <div key={label} className="flex items-start gap-5">
                    <div className="mt-1.5 w-6 h-6 border-2 border-black flex shrink-0 items-center justify-center bg-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="text-black font-serif text-lg leading-relaxed">
                      <strong className="text-black font-sans font-black uppercase text-base tracking-tight">{label}</strong>{detail}
                    </p>
                  </div>
                ))}
                <div className="flex items-start gap-5 p-6 bg-black border-2 border-black mt-8">
                  <div className="mt-1.5 w-6 h-6 border-2 border-white bg-white flex shrink-0 items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <p className="text-white font-sans font-black text-lg uppercase tracking-tight leading-tight">Doing everything right: eating, training, sleeping. Nothing&rsquo;s shifting.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              Methodology
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Four steps.<br />Done in a week.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Order your kit, take your sample at home, post it back. Results are in your dashboard within 48 hours of the lab receiving it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-black -translate-y-1/2 z-0" />
            {[
              { num: '01', title: 'Order Kit', body: 'Select the specific panel required. Dispatched same-day via tracked delivery in discreet packaging.', meta: ['Action', 'User'] },
              { num: '02', title: 'Collect Sample', body: 'Simple, painless finger-prick collection at home. Best performed fasted early morning for accurate hormone baselines.', meta: ['Time required', '5 Mins'] },
              { num: '03', title: 'Post Return', body: 'Seal sample in the provided medical transport vial and drop it in any priority postbox using the pre-paid envelope.', meta: ['Transit', 'Tracked 24'] },
            ].map(({ num, title, body, meta }) => (
              <div key={num} className="group border-2 border-black p-10 relative z-10 bg-white hover:bg-black transition-colors duration-200">
                <div className="absolute top-0 right-0 p-4 text-[150px] font-sans font-black text-gray-100 group-hover:text-white leading-none select-none pointer-events-none -mt-8 -mr-4">{num[1]}</div>
                <div className="w-12 h-12 bg-white border-4 border-black text-black group-hover:bg-black group-hover:border-white group-hover:text-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 transition-colors duration-200">{num}</div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 relative z-20 transition-colors duration-200">{title}</h3>
                <p className="text-black group-hover:text-gray-300 font-serif text-base leading-relaxed relative z-20 transition-colors duration-200">{body}</p>
                <div className="mt-8 pt-6 border-t-2 border-black group-hover:border-gray-700 data-label flex justify-between relative z-20 transition-colors duration-200">
                  <span className="group-hover:text-gray-400 transition-colors duration-200">{meta[0]}</span>
                  <span className="font-black group-hover:text-white transition-colors duration-200">{meta[1]}</span>
                </div>
              </div>
            ))}
            <div className="p-10 relative z-10 border-4 border-black bg-black text-white">
              <div className="absolute top-0 right-0 p-4 text-[150px] font-sans font-black text-white leading-none select-none pointer-events-none -mt-8 -mr-4">4</div>
              <div className="w-12 h-12 bg-black text-white border-2 border-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">04</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-white mb-4 relative z-20">View Analytics</h3>
              <p className="text-gray-300 font-serif text-base leading-relaxed relative z-20">Access your secure dashboard within 48 hours of lab receipt. Clear data, doctor review, and actionable protocols.</p>
              <div className="mt-8 pt-6 border-t-2 border-gray-700 data-label flex justify-between relative z-20">
                <span className="text-gray-400">Status</span>
                <span className="text-white font-black">System Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEST KITS */}
      <section id="tests" className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              Diagnostics Catalog
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Start with what&rsquo;s bothering you most.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Each kit targets the markers that matter for what you&rsquo;re feeling. Not sure which one? Take the two-minute quiz.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Kit 1 */}
            <div className="border-2 border-black bg-white flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8">
                  <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black">
                    <span className="w-2 h-2 bg-black" /> Base
                  </div>
                  <span className="text-4xl font-sans font-black text-black">£99</span>
                </div>
                <h3 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-4">Testosterone Profile</h3>
                <p className="text-base text-black font-serif mb-8 leading-relaxed">Baseline hormonal assessment. Essential for men experiencing fatigue, reduced muscle mass, or low drive.</p>
                <div className="space-y-4 mt-10">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">Biomarkers Analyzed</div>
                  {['Total Testosterone', 'SHBG', 'Free Androgen Index (FAI)', 'Albumin', 'Free Testosterone (Calc)'].map((m) => (
                    <div key={m} className="flex items-center gap-4 text-base text-black font-serif"><CheckSvg /> {m}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0 mt-auto">
                <Link href="/kits/testosterone" className="block w-full text-center px-6 py-4 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">Order test</Link>
              </div>
            </div>

            {/* Kit 3 — Featured */}
            <div className="border-4 border-black bg-white flex flex-col h-full relative lg:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black text-white text-[12px] font-sans font-black tracking-widest uppercase px-6 py-2">Most complete</div>
              <div className="p-10 flex-grow mt-6">
                <div className="flex justify-between items-start mb-8">
                  <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white border-2 border-black">
                    <span className="w-2 h-2 bg-white" /> Advanced
                  </div>
                  <span className="text-4xl font-sans font-black text-black">£179</span>
                </div>
                <h3 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-4">Hormone &amp; Recovery</h3>
                <p className="text-base text-black font-serif mb-8 leading-relaxed">The full picture. Combines hormonal data with crucial recovery, energy, and inflammation markers.</p>
                <div className="space-y-4 mt-10">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">Biomarkers Analyzed</div>
                  {['Complete Testosterone Panel', 'Vitamin D (Energy)', 'Active B12 (Energy)', 'hs-CRP (Inflammation)', 'Ferritin (Iron Storage)'].map((m) => (
                    <div key={m} className="flex items-center gap-4 text-base text-black font-serif"><CheckSvg /> {m}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0 mt-auto">
                <Link href="/kits/hormone-recovery" className="block w-full text-center px-6 py-4 bg-black text-white font-sans font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black border-2 border-black transition-colors">Order test</Link>
              </div>
            </div>

            {/* Kit 2 */}
            <div className="border-2 border-black bg-white flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8">
                  <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black">
                    <span className="w-2 h-2 bg-black" /> Targeted
                  </div>
                  <span className="text-4xl font-sans font-black text-black">£119</span>
                </div>
                <h3 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-4">Energy &amp; Recovery</h3>
                <p className="text-base text-black font-serif mb-8 leading-relaxed">Designed for active men experiencing prolonged soreness, lethargy, or joint stiffness despite proper rest.</p>
                <div className="space-y-4 mt-10">
                  <div className="text-xs font-sans font-black text-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">Biomarkers Analyzed</div>
                  {['Vitamin D', 'Active B12', 'hs-CRP (Inflammation)', 'Ferritin'].map((m) => (
                    <div key={m} className="flex items-center gap-4 text-base text-black font-serif"><CheckSvg /> {m}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0 mt-auto">
                <Link href="/kits/energy-recovery" className="block w-full text-center px-6 py-4 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">Order test</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/test-selector" className="inline-flex items-center gap-3 text-black font-sans font-black uppercase tracking-widest text-sm hover:underline">
              Not sure which kit? Take the 2-minute quiz
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SUPPLEMENTS */}
      <section id="supplements" className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-5/12">
              <div className="data-label flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-black" />
                Intervention Protocols
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.95] mb-8">Test first.<br />Then fix it.</h2>
              <p className="text-black font-serif text-xl mb-10 leading-relaxed">
                Your dashboard doesn&rsquo;t just show your numbers. If you&rsquo;re out of range, we recommend evidence-based supplements built exactly for what you&rsquo;re missing. No guesswork. Cancel anytime.
              </p>
              <Link href="/supplements" className="inline-flex items-center gap-3 text-black font-sans font-black uppercase tracking-widest text-sm hover:underline">
                View supplement formulations
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="lg:w-7/12 space-y-0 border-4 border-black divide-y-4 divide-black bg-white">
              {[
                { title: 'Daily Stack', price: '£34.95/mo', tag: 'Deficiency support', href: '/supplements/daily-stack' },
                { title: 'Joint & Recovery Collagen', price: '£99.95/mo', tag: 'Inflammation support', href: '/supplements/collagen' },
              ].map(({ title, price, tag, href }) => (
                <Link key={title} href={href} className="flex justify-between items-center p-10 hover:bg-gray-50 transition-colors group">
                  <div>
                    <h3 className="font-sans font-black text-2xl uppercase tracking-tighter text-black mb-1">{title}</h3>
                    <span className="data-label text-gray-500">{tag}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-sans font-black text-2xl text-black">{price}</div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="ml-auto mt-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDING MEMBER */}
      <section className="py-32 bg-black text-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="data-label !text-white flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-white" />
                Clinical Pipeline
              </div>
              <h2 className="text-5xl md:text-7xl font-sans font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                Founding Member Programme.
              </h2>
              <p className="text-gray-300 font-serif text-xl mb-12 leading-relaxed">
                If your testosterone comes back below 12 nmol/L, you qualify for our founding member programme. Be first in line when our clinical TRT service launches. Fully refundable deposit.
              </p>
              <Link href="/founding-member" className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-200 border-4 border-white font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all">
                Learn more
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="border-4 border-gray-700 p-10 bg-black">
              <div className="space-y-6">
                {[
                  { label: 'Deposit', value: '£75 (fully refundable)' },
                  { label: 'Trigger', value: 'T < 12 nmol/L on Kit 1 or Kit 3' },
                  { label: 'Benefit', value: 'First in line when TRT launches' },
                  { label: 'Status', value: 'Applications open now' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start border-b border-gray-800 pb-6">
                    <span className="data-label !text-gray-400">{label}</span>
                    <span className="font-sans font-black text-white text-right max-w-[200px]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-40 bg-white border-t-4 border-black text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-6xl md:text-[90px] font-sans font-black uppercase tracking-tighter text-black leading-[0.85] mb-10">
            Find out what your blood is telling you.
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-2xl mx-auto leading-relaxed">
            UKAS accredited lab. Results in 48 hours. Plain English. No GP needed.
          </p>
          <Link href="/kits" className="inline-flex bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 transition-all items-center justify-center gap-4">
            Choose your test
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
