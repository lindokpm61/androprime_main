import type { Metadata } from 'next'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'

export const metadata: Metadata = {
  title: 'Complete Male Axis | At-Home Blood Test £69 | Andro Prime',
  description:
    'The full picture. 9 biomarkers covering hormones, energy, inflammation, and recovery. One finger-prick test, done at home. UKAS accredited lab. Results in 48 hours.',
}

export default function FoundationsLpPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black text-white mb-8 border-2 border-black">
              Complete Male Axis
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              One test.<br />
              <span className="text-gray-400">The full picture.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              Nine biomarkers. Hormones, energy, inflammation, and recovery in a single at-home test. If you don&rsquo;t know where to start, start here.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Order the Kit &rarr; £69
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">All-in. No hidden fees.</span>
            </div>

            <div className="mt-8 flex items-center gap-3 data-label border-t-2 border-black pt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              UKAS accredited lab. 9 biomarkers. Results in 48 hours.
            </div>
          </div>

          {/* Sample report preview */}
          <div className="lg:col-span-6 relative">
            <div className="hidden md:block absolute -top-6 -right-6 data-label bg-white border-2 border-black px-3 py-1 z-10">Sample report</div>
            <div className="hidden md:block absolute -bottom-6 -left-6 data-label bg-white border-2 border-black px-3 py-1 z-10">9 biomarkers</div>

            <div className="border-4 border-black p-8 bg-white relative z-0">
              <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-3 h-3 bg-black" />
                  <span className="font-sans font-black uppercase tracking-tighter text-xl">Your Results</span>
                </div>
                <div className="data-label text-gray-500">Kit 03 // Complete</div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Total Testosterone', value: '14.2', status: 'Borderline', statusClass: 'border border-black', width: '35%' },
                  { label: 'SHBG', value: '38.5', status: 'Normal', statusClass: 'bg-black text-white', width: '55%' },
                  { label: 'Free Androgen Index', value: '36.9', status: 'Borderline', statusClass: 'border border-black', width: '20%' },
                  { label: 'Albumin', value: '42.0', status: 'Normal', statusClass: 'bg-black text-white', width: '65%' },
                  { label: 'Free Testosterone', value: '0.244', status: 'Low', statusClass: 'border-2 border-black font-black', width: '15%' },
                  { label: 'Vitamin D', value: '32', status: 'Suboptimal', statusClass: 'border border-black', width: '25%' },
                  { label: 'Active B12', value: '31.2', status: 'Low', statusClass: 'border-2 border-black font-black', width: '28%' },
                  { label: 'hs-CRP', value: '4.1', status: 'Elevated', statusClass: 'border-2 border-black font-black', width: '68%' },
                  { label: 'Ferritin', value: '45', status: 'Normal', statusClass: 'bg-black text-white', width: '55%' },
                ].map(({ label, value, status, statusClass, width }) => (
                  <div key={label}>
                    <div className="flex justify-between items-end mb-1">
                      <div className="data-label">{label}</div>
                      <div className="flex items-center gap-3">
                        <span className="data-value">{value}</span>
                        <span className={`data-label !text-[10px] px-1 ${statusClass}`}>{status}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 flex"><div className="h-full bg-black" style={{ width }} /></div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t-4 border-black flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="text-sm font-serif">
                  <strong className="font-sans font-black uppercase tracking-tight">Recommendation:</strong> Protocol advised — see full report
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
            <SectionEyebrow label="The Problem" />
            <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              You know something&rsquo;s off. You just can&rsquo;t pinpoint what.
            </h2>
            <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
              <p>It could be your testosterone. It could be your vitamin D. It could be inflammation you can&rsquo;t see. Or it could be all three working together to make you feel like a worse version of yourself.</p>
              <p>Running one test gives you one answer. This kit gives you the full picture.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  Nine markers. One test. No more guessing which system is letting you down.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">9 Biomarkers</h3>
            </div>
            <div className="space-y-4">
              {[
                { marker: 'Total Testosterone', body: 'Your headline hormone number. Most GPs stop here.' },
                { marker: 'SHBG', body: 'The protein that binds testosterone and controls how much is actually available.' },
                { marker: 'Free Androgen Index', body: 'The ratio of total testosterone to SHBG. A more sensitive read on bioavailable testosterone.' },
                { marker: 'Albumin', body: 'Main blood carrier protein. Required for an accurate Free Testosterone calculation.' },
                { marker: 'Free Testosterone', body: "What your body can actually use. Calculated from Total T, SHBG, and Albumin." },
                { marker: 'Vitamin D', body: 'Drives immunity, bone density, and testosterone synthesis.' },
                { marker: 'Active B12 (Holotranscobalamin)', body: 'The cellular form of B12. Standard tests often miss deficiency — this one catches it.' },
                { marker: 'hs-CRP', body: 'Measures systemic inflammation: joint stiffness, slow recovery, persistent soreness.' },
              ].map(({ marker, body }) => (
                <div key={marker} className="border-2 border-black p-6 flex gap-5 hover:bg-gray-50 transition-colors bg-white">
                  <div className="w-3 h-3 bg-black mt-2 shrink-0" />
                  <p className="font-serif text-lg leading-relaxed">
                    <strong className="font-sans font-black uppercase text-base tracking-tight">{marker}.</strong> {body}
                  </p>
                </div>
              ))}
              <div className="border-4 border-black bg-black text-white p-6 flex gap-5">
                <div className="w-3 h-3 bg-white mt-2 shrink-0" />
                <p className="font-serif text-lg leading-relaxed">
                  <strong className="font-sans font-black uppercase text-base tracking-tight text-white">Ferritin.</strong> Your iron storage marker. Low ferritin means chronic fatigue and exercise intolerance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Process" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Five minutes. No GP needed.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Same simple process. Nine markers instead of three.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Order your kit', body: 'Dispatched same day. Arrives next-day in discreet packaging. No referral needed.', meta: ['INIT // SEQ.01', '[SAME-DAY DISPATCH]'] },
              { num: '02', title: 'Take sample at home', body: 'Painless finger-prick collection first thing in the morning, fasted. Five minutes total.', meta: ['USER // ACT.02', '[T: 00:05:00]'] },
              { num: '03', title: 'Post it back', body: 'Pre-paid return envelope included. Drop it in any standard post box. The lab gets it the next working day.', meta: ['TRAN // LOG.03', '[ROYAL MAIL 24]'] },
            ].map(({ num, title, body, meta }) => (
              <div key={num} className="border-2 border-black p-8 relative bg-white">
                <div className="absolute top-0 right-0 p-4 text-[100px] font-sans font-black text-gray-100 leading-none select-none pointer-events-none -mt-4 -mr-2">{num[1]}</div>
                <div className="flex justify-between items-start mb-10 border-b-2 border-black pb-4 relative z-10">
                  <div className="data-label px-2 py-1 border border-black">Step {num}</div>
                  <div className="text-right">
                    <div className="data-label !text-[10px]">{meta[0]}</div>
                    <div className="data-label !text-[10px] text-gray-500">{meta[1]}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10">{title}</h3>
                <p className="font-serif text-base leading-relaxed relative z-10">{body}</p>
              </div>
            ))}
            <div className="border-4 border-black p-8 relative bg-black text-white">
              <div className="absolute top-0 right-0 p-4 text-[100px] font-sans font-black text-gray-800 leading-none select-none pointer-events-none -mt-4 -mr-2">4</div>
              <div className="flex justify-between items-start mb-10 border-b-2 border-gray-700 pb-4 relative z-10">
                <div className="data-label px-2 py-1 border border-white !text-white">Step 04</div>
                <div className="text-right">
                  <div className="data-label !text-[10px] !text-white">DATA // RCV.04</div>
                  <div className="data-label !text-[10px] text-gray-400">[SYS.READY]</div>
                </div>
              </div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10 text-white">Read your results</h3>
              <p className="font-serif text-base leading-relaxed relative z-10 text-gray-300">Your nine numbers land in a private dashboard within 48 hours. Every marker explained in plain English. Every recommendation based on your actual data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-32 bg-gray-50 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5">
            <SectionEyebrow label="The Fix" />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              We don&rsquo;t just give you numbers.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed mb-10">
              Every biomarker comes with a plain-English explanation and a specific next step. If your vitamin D is low, you&rsquo;ll know exactly what to take. If your testosterone is below optimal, you&rsquo;ll know your options. If something needs a GP, we&rsquo;ll tell you directly.
            </p>

            <div className="border-2 border-black p-6 flex gap-4 bg-white">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="shrink-0"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p className="font-serif text-sm leading-relaxed">Your results are reviewed by a GMC-registered doctor. No guesswork. No generic advice.</p>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {[
              { title: 'All markers in range', body: 'Your baseline confirmed across all nine markers. You get a retest reminder in 6 months and specific advice to maintain what you have.', icon: <path d="M9 12l2 2 4-4" /> },
              { title: 'Clear suboptimal markers', body: 'Your report shows exactly which markers need attention first, so you are not left guessing what matters most or what to act on next.', icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
              { title: 'Hormone picture clarified', body: 'You see where your testosterone markers actually sit, how they relate to one another, and what the data is telling you in plain English.', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
              { title: 'The full picture in one place', body: 'Instead of testing one system and missing the rest, Kit 3 shows hormones, energy, and inflammation together — all nine markers — so the recommendation starts from a complete baseline.', icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
            ].map(({ title, body, icon }) => (
              <div key={title} className="border-2 border-black p-8 bg-white flex flex-col gap-6">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">{icon}</svg>
                </div>
                <div>
                  <h3 className="text-xl font-sans font-black uppercase tracking-tighter text-black mb-3">{title}</h3>
                  <p className="font-serif text-base text-black leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="Built For" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">The men&rsquo;s health check your GP doesn&rsquo;t offer.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { body: "The man who hasn't had a proper check-up in years and wants to know where he actually stands." },
              { body: "The man who isn't sure whether it's his testosterone, his energy, or something else entirely and doesn't want to guess which kit to pick." },
              { body: 'The man who wants one comprehensive test instead of running two kits over two separate mornings.' },
            ].map(({ body }, i) => (
              <div key={i} className="border-2 border-black p-8 bg-white flex flex-col gap-6 hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 bg-black" />
                <p className="font-serif text-lg leading-relaxed">{body}</p>
              </div>
            ))}
            <div className="border-4 border-black p-8 bg-black text-white flex flex-col gap-6">
              <div className="w-4 h-4 bg-white" />
              <p className="font-serif text-lg leading-relaxed text-gray-300">
                <strong className="font-sans font-black uppercase text-base tracking-tight text-white">The man over 40 who knows something has shifted</strong> but can&rsquo;t pinpoint what it is or where to start.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="font-serif text-lg mb-6">Not sure where to start? Start here.</p>
            <a href="#order" className="bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
              Order the Kit &rarr; £69
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* CLINICAL OVERSIGHT */}
      <section id="clinical" className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="border-2 border-black p-10 lg:p-16 flex flex-col justify-between h-full bg-white">
            <div>
              <div className="data-label bg-black text-white px-3 py-1.5 inline-block w-fit mb-10">Founder</div>
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic mb-12">
                &ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this company because the standard approach is broken. We test first. Then we fix it.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-6 border-t-2 border-black pt-8">
              <div className="w-16 h-16 rounded-none border-2 border-black flex items-center justify-center shrink-0">
                <span className="font-sans font-black text-2xl uppercase">KA</span>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-xl">Keith Anthony</div>
                <div className="font-serif text-sm text-gray-600">Founder, Andro Prime</div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-10 lg:p-16 flex flex-col justify-between h-full bg-gray-50">
            <div>
              <div className="data-label border-2 border-black px-3 py-1.5 inline-block w-fit mb-10">Clinical Oversight</div>
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic mb-12">
                &ldquo;Normal ranges are statistical averages, not targets for how you should actually feel. I review our clinical protocols to ensure your data translates into effective, actionable health steps.&rdquo;
              </p>
            </div>
            <div>
              <div className="flex items-center gap-6 border-t-2 border-black pt-8 mb-6">
                <div className="w-16 h-16 rounded-none border-2 border-black bg-white flex items-center justify-center shrink-0">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="23" y2="12" /><line x1="23" y1="8" x2="19" y2="12" />
                  </svg>
                </div>
                <div>
                  <div className="font-sans font-black uppercase tracking-tighter text-xl">Dr Ewa Lindo</div>
                  <div className="font-serif text-sm text-gray-600">GMC Prescriber &amp; Clinical Lead</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 data-label bg-white border border-black px-3 py-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  GMC Registered
                </div>
                <div className="flex items-center gap-2 data-label bg-white border border-black px-3 py-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Harley Street TRT-Trained
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-sans font-black text-black uppercase tracking-tighter mb-12">Frequently Asked Questions</h2>
          <div className="border-t-4 border-black">
            {[
              { q: 'Do I need to fast before taking the test?', a: 'Yes. For the most accurate hormone baseline, you must take the sample fasted (water is fine) before 10 AM. Testosterone levels peak in the morning and decline throughout the day, and eating can suppress them temporarily.' },
              { q: 'How does the finger-prick work? Is it painful?', a: "It's a very quick, small pinch. The kit includes medical-grade lancets that make a tiny puncture on the side of your fingertip. We provide detailed instructions and extra lancets to ensure you can collect enough blood easily at home." },
              { q: 'How accurate is an at-home test vs going to a clinic?', a: 'The sample collection method is different, but the analysis is identical. Your sample is processed by the exact same UKAS ISO 15189 accredited laboratories used by private clinics and the NHS, using the same gold-standard testing equipment.' },
              { q: 'Are there any hidden subscription fees?', a: "No. This is a one-off purchase of £69. You receive your kit, the lab analysis, and a digital report reviewed by a doctor. If you choose to follow any recommended supplement protocols later, those are separate, opt-in purchases with no obligation." },
            ].map(({ q, a }, i) => (
              <details key={i} className="group border-b-2 border-black" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex justify-between items-center font-sans font-black text-xl md:text-2xl uppercase tracking-tighter cursor-pointer py-6">
                  <span>{q}</span>
                  <span className="transition group-open:rotate-180">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M6 9l6 6 6-6" /></svg>
                  </span>
                </summary>
                <div className="font-serif text-lg leading-relaxed pb-8 text-gray-700">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="order" className="py-40 bg-white border-t-4 border-black relative overflow-hidden">
        <div className="absolute top-12 left-12 data-label opacity-100 hidden md:block text-black text-sm">SYS.READY // UKAS.V1</div>
        <div className="absolute bottom-12 right-12 data-label opacity-100 hidden md:block text-black text-sm">END.SEQ // 892.4</div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-none border-2 border-black bg-white mb-12">
            <span className="w-3 h-3 bg-black" />
            <span className="data-label !text-black text-sm">Secure Checkout</span>
          </div>

          <h2 className="text-6xl md:text-[100px] font-sans font-black uppercase tracking-tighter text-black leading-[0.85] mb-10">
            Stop guessing.<br />Start knowing.
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-3xl mx-auto leading-relaxed">A finger prick. A pre-paid envelope. 48 hours. That&rsquo;s it.</p>

          <div className="flex justify-center">
            <KitCheckoutButton kitType="hormone-recovery" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 rounded-none transition-all flex items-center justify-center gap-4 w-full md:w-auto disabled:opacity-50">
              Order Kit → £69
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </KitCheckoutButton>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 text-base text-black font-serif font-bold italic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            One-off purchase. Includes lab fees and delivery. No subscription.
          </div>
        </div>
      </section>
    </>
  )
}
