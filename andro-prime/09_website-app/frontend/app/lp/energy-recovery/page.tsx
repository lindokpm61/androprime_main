import type { Metadata } from 'next'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'

export const metadata: Metadata = {
  title: 'Energy & Recovery Check | At-Home Blood Test £44 | Andro Prime',
  description:
    "Test Vitamin D, Active B12, hs-CRP, and Ferritin from home. Find out why you're tired, sore, and slow to recover. UKAS accredited lab. Results in 48 hours.",
}

const faqItems = [
  { question: 'Does taking the sample hurt?', answer: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets in the kit just in case." },
  { question: 'How long do results take?', answer: 'Once our UKAS accredited lab receives your sample, your private dashboard is updated within 48 hours.' },
  { question: 'Does the £44 cover everything?', answer: 'Yes. The kit, the lab analysis for all four biomarkers, and the prepaid return postage are all included. No hidden fees.' },
  { question: 'Is my data private?', answer: 'Completely. We use bank-level encryption. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.' },
  { question: 'I already take supplements. Is this worth it?', answer: "Especially if you already take supplements. Most men are guessing which ones they need. This test tells you which deficiencies you actually have, so you stop spending money on things you don't need." },
]

const CheckSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
)

export default function EnergyRecoveryLpPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white mb-8 border-2 border-black">
              Energy &amp; Recovery Check
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              You&rsquo;re not lazy.<br />
              <span className="text-gray-400">You&rsquo;re depleted.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              If you&rsquo;re training consistently but recovering slowly, the answer is almost certainly in your blood. We test the four markers that drive energy, inflammation, and recovery in active men.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Order the Kit &rarr; £44
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">All-in. No hidden fees.</span>
            </div>
            <a href="/lp/hormone-recovery" className="mt-4 inline-flex items-center gap-2 text-sm font-sans font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
              Want testosterone markers too? Get Kit 3 for £69
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>

            <div className="mt-10 flex items-center gap-3 data-label border-t-2 border-black pt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              UKAS accredited lab. 4 biomarkers. Results in 48 hours.
            </div>
          </div>

          {/* Sample report preview */}
          <div className="lg:col-span-6 relative">
            <div className="hidden md:block absolute -top-6 -right-6 data-label bg-white border-2 border-black px-3 py-1 z-10">Sample report</div>
            <div className="hidden md:block absolute -bottom-6 -left-6 data-label bg-white border-2 border-black px-3 py-1 z-10">4 biomarkers</div>

            <div className="border-4 border-black p-8 bg-white relative z-0">
              <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-3 h-3 bg-black" />
                  <span className="font-sans font-black uppercase tracking-tighter text-xl">Your Results</span>
                </div>
                <div className="data-label text-gray-500">Kit 02 // Energy</div>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'Vitamin D', sub: 'Energy & immunity baseline', value: '32', status: 'Suboptimal', statusClass: 'border border-black', width: '25%', barClass: 'bg-orange-500' },
                  { label: 'Active B12', sub: 'Cellular B12 availability', value: '31.2', status: 'Low', statusClass: 'border-2 border-black font-black', width: '28%', barClass: 'bg-amber-500' },
                  { label: 'hs-CRP', sub: 'Systemic inflammation', value: '4.1', status: 'Elevated', statusClass: 'border-2 border-black font-black', width: '68%', barClass: 'bg-red-500' },
                  { label: 'Ferritin', sub: 'Iron storage & oxygen', value: '45', status: 'Normal', statusClass: 'bg-black !text-white', width: '55%', barClass: 'bg-green-500' },
                ].map(({ label, sub, value, status, statusClass, width, barClass }) => (
                  <div key={label}>
                    <div className="flex justify-between items-end mb-1">
                      <div>
                        <div className="data-label">{label}</div>
                        <div className="text-[10px] font-serif text-gray-500 italic">{sub}</div>
                      </div>
                      <div className="text-right">
                        <div className="data-value">{value}</div>
                        <div className={`data-label !text-[10px] px-1 mt-1 ${statusClass}`}>{status}</div>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 flex"><div className={`h-full ${barClass || 'bg-black'}`} style={{ width }} /></div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-6 border-t-4 border-black flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="text-sm font-serif">
                  <strong className="font-sans font-black uppercase tracking-tight">Recommendation:</strong> Supplement protocol advised
                </div>
                <div className="data-label bg-gray-100 px-2 py-1 w-fit">48h turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYMPTOM CHECKER */}
      <section className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionEyebrow label="The Reality" />
            <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Stop blaming your age.
            </h2>
            <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
              <p>You&rsquo;re training hard. You&rsquo;re eating well. But you&rsquo;re still sore two days later, your joints ache, and your energy crashes by mid-afternoon.</p>
              <p>Supplements haven&rsquo;t helped because you&rsquo;re guessing which ones you actually need. This test stops the guessing.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  Most men over 35 are low in at least one of these four markers and don&rsquo;t know it.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">What We Test</h3>
            </div>
            <div className="space-y-4">
              {[
                { marker: 'Vitamin D', body: 'Drives immunity, bone density, and testosterone synthesis. Most UK men are deficient, especially in winter.' },
                { marker: 'Active B12 (Holotranscobalamin)', body: 'The form of B12 your cells can actually absorb. Standard NHS tests often miss deficiency. Low Active B12 affects energy, nerve function, and recovery speed.' },
                { marker: 'hs-CRP', body: 'Measures systemic inflammation. Elevated levels explain persistent soreness, joint stiffness, and slow recovery.' },
                { marker: 'Ferritin', body: 'Your iron storage marker. Low ferritin means poor oxygen transport, chronic fatigue, and exercise intolerance.' },
              ].map(({ marker, body }) => (
                <div key={marker} className="border-2 border-black p-6 flex gap-5 hover:bg-gray-50 transition-colors bg-white">
                  <div className="w-3 h-3 bg-black mt-2 shrink-0" />
                  <p className="font-serif text-lg leading-relaxed">
                    <strong className="font-sans font-black uppercase text-base tracking-tight">{marker}.</strong> {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-4 divide-y-4 md:divide-y-0 divide-black">
            {[
              { icon: <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />, label: 'UKAS ISO 15189 Lab' },
              { icon: <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />, label: 'Free Next-Day Delivery' },
              { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />, label: 'GMC-Registered Doctor' },
              { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, label: 'Results in 48h' },
            ].map(({ icon, label }) => (
              <div key={label} className="p-8 flex flex-col items-center justify-center text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mb-4">{icon}</svg>
                <span className="text-sm font-sans font-black uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROCESS STEPS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Process" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Five minutes. Done at home.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">No GP referral. No waiting list. No clinic appointment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Order your kit', body: 'Dispatched same day. Arrives next-day in discreet packaging. No referral needed.', meta: ['INIT // SEQ.01', '[SAME-DAY DISPATCH]'] },
              { num: '02', title: 'Take sample at home', body: 'Painless finger-prick collection. First thing in the morning, before food. Five minutes total.', meta: ['USER // ACT.02', '[T: 00:05:00]'] },
              { num: '03', title: 'Post it back', body: 'Pre-paid return envelope included. Drop it in any standard post box. The lab gets it the next working day.', meta: ['TRAN // LOG.03', '[ROYAL MAIL 24]'] },
            ].map(({ num, title, body, meta }) => (
              <div key={num} className="group border-2 border-black p-8 relative bg-white hover:bg-black transition-colors duration-300">
                <div className="absolute top-0 right-0 p-4 text-[100px] font-sans font-black text-gray-100 group-hover:text-white transition-colors duration-300 leading-none select-none pointer-events-none -mt-4 -mr-2">{num[1]}</div>
                <div className="flex justify-between items-start mb-10 border-b-2 border-black group-hover:border-gray-700 transition-colors duration-300 pb-4 relative z-10">
                  <div className="data-label px-2 py-1 border border-black group-hover:border-white group-hover:!text-white transition-colors duration-300">Step {num}</div>
                  <div className="text-right">
                    <div className="data-label !text-[10px] group-hover:!text-white transition-colors duration-300">{meta[0]}</div>
                    <div className="data-label !text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors duration-300">{meta[1]}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10 group-hover:text-white transition-colors duration-300">{title}</h3>
                <p className="font-serif text-base leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors duration-300">{body}</p>
              </div>
            ))}
            <div className="group border-4 border-black p-8 relative bg-black text-white hover:bg-black transition-colors duration-300">
              <div className="absolute top-0 right-0 p-4 text-[100px] font-sans font-black text-gray-800 group-hover:text-white transition-colors duration-300 leading-none select-none pointer-events-none -mt-4 -mr-2">4</div>
              <div className="flex justify-between items-start mb-10 border-b-2 border-gray-700 pb-4 relative z-10">
                <div className="data-label px-2 py-1 border border-white !text-white">Step 04</div>
                <div className="text-right">
                  <div className="data-label !text-[10px] !text-white">DATA // RCV.04</div>
                  <div className="data-label !text-[10px] text-gray-400">[SYS.READY]</div>
                </div>
              </div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10 text-white">Read your results</h3>
              <p className="font-serif text-base leading-relaxed relative z-10 text-gray-300">Your four numbers land in a private dashboard within 48 hours. Every marker explained in plain English. Every recommendation based on your actual data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionEyebrow label="Built For" centered />
            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-tight">You&rsquo;re not broken. You just don&rsquo;t have the data yet.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { title: 'The man who trains four times a week', body: 'and recovers like he trains once.' },
              { title: "The man who's tried every supplement", body: 'on Amazon and still feels the same.' },
              { title: "The man whose joints started complaining", body: "at 40 and haven't stopped since." },
              { title: 'The man who sleeps eight hours', body: 'and still wakes up tired.' },
            ].map(({ title, body }) => (
              <div key={title} className="border-2 border-black p-8 bg-white flex items-start gap-4">
                <div className="w-3 h-3 bg-black mt-2 shrink-0" />
                <p className="font-serif text-xl leading-relaxed">
                  <strong className="font-sans font-black uppercase text-lg tracking-tight block mb-1">{title}</strong>{body}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="font-serif text-xl mb-8">If that sounds familiar, this test was built for you.</p>
            <a href="#order" className="inline-flex bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all items-center justify-center gap-3">
              Order the Kit &rarr; £44
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* CLINICAL OVERSIGHT */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-0 border-4 border-black">
            <div className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="data-label border-2 border-black inline-block px-3 py-1 mb-8 bg-white">Founder</div>
                <p className="font-serif text-2xl leading-relaxed italic mb-12">&ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this because the standard approach is broken.&rdquo;</p>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-2xl">Keith Anthony</div>
                <div className="data-label mt-2">Founder, Andro Prime</div>
              </div>
            </div>

            <div className="p-12 bg-white flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="data-label border-2 border-black inline-block px-3 py-1 mb-8 bg-black !text-white">Clinical Oversight</div>
                <p className="font-serif text-2xl leading-relaxed italic mb-12">&ldquo;Normal ranges are statistical averages, not targets for how you should actually feel. I review every protocol to ensure your data translates into effective, actionable steps.&rdquo;</p>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-2xl">Dr Ewa Lindo</div>
                <div className="data-label mt-2 mb-6">GMC Prescriber &amp; Clinical Lead</div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 border border-black px-3 py-1.5 bg-gray-50">
                    <span className="w-1.5 h-1.5 bg-black rounded-none" />
                    <span className="data-label !text-[10px]">GMC Registered</span>
                  </div>
                  <div className="flex items-center gap-2 border border-black px-3 py-1.5 bg-gray-50">
                    <span className="w-1.5 h-1.5 bg-black rounded-none" />
                    <span className="data-label !text-[10px]">Harley St TRT-Trained</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + ORDER */}
      <section className="py-32 bg-white border-t-4 border-black" id="order">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <SectionEyebrow label="Common Questions" />
              <FaqAccordion items={faqItems} />
            </div>

            <div className="lg:col-span-5 sticky top-32">
              <div className="border-4 border-black bg-white p-8">
                <div className="data-label mb-4 border-2 border-black inline-block px-3 py-1">KIT 02</div>
                <h3 className="text-4xl font-sans font-black uppercase tracking-tighter mb-6">Energy &amp; Recovery Check</h3>

                <div className="flex items-end gap-3 mb-8 border-b-2 border-black pb-6">
                  <span className="text-6xl font-sans font-black tracking-tighter leading-none">£44</span>
                  <span className="data-label mb-2">all-in, one-off</span>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    'Vitamin D, Active B12, hs-CRP, Ferritin (4 markers)',
                    'UKAS ISO 15189 accredited lab',
                    'Free next-day delivery + return postage',
                    'Personal dashboard with plain-English results',
                    'Specific recommendation based on your data',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <CheckSvg />
                      <span className="font-serif text-base">{item}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl py-6 rounded-none transition-all flex items-center justify-center gap-3">
                  Order Now &rarr; £44
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>

                <a href="/lp/hormone-recovery" className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-sans font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors py-2">
                  Want testosterone markers too? Kit 3 for £69
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </a>

                <div className="mt-2 flex justify-center items-center gap-2 data-label !text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Secure checkout. No subscription.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
