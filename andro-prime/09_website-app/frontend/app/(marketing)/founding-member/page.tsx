import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'

export const metadata: Metadata = {
  title: 'Founding Member Programme | Andro Prime',
  description:
    'Secure your place in Andro Prime\'s clinical TRT programme. £75 fully refundable deposit. First access when we launch. GMC-registered GP. Data-first approach.',
}

const CheckSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><polyline points="20 6 9 17 4 12" /></svg>
)

const faqItems = [
  { q: 'Is TRT available now?', a: "No. Andro Prime's clinical service is pending CQC registration. The founding member programme secures your place for when we launch. There is no current clinical service." },
  { q: 'What if you don\'t launch?', a: 'You get your £75 back. All of it. No conditions, no small print.' },
  { q: 'How long until you launch?', a: "We're not publishing a specific date while CQC registration is in progress. Founding members will be the first to know. Realistically, we're building toward launch this year." },
  { q: "What's the monthly price when TRT launches?", a: "We'll confirm founding member pricing before launch. It will be lower than the standard rate, locked in for founding members." },
  { q: 'Do I have to have done an Andro Prime test to join?', a: "No. If you've had private testosterone testing elsewhere and your results show low testosterone, you can still join. We'll review your existing blood work at your first consultation." },
  { q: 'Will I speak to Dr Ewa directly?', a: "Yes. Founding members get priority access to Dr Ewa Lindo for their initial consultation. You won't be triaged through a call handler." },
  { q: 'Is TRT safe?', a: "TRT is a well-established clinical treatment when prescribed and monitored correctly. Side effects exist and will be discussed fully at your initial consultation. We don't prescribe without a proper assessment and we don't leave patients without ongoing monitoring." },
  { q: "What if I'm not sure I want TRT?", a: "That's fine. The deposit holds your place. It doesn't commit you to anything. If you get to the consultation and decide it's not for you, you get your deposit back." },
]

export default function FoundingMemberPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white border-b-4 border-black">
        <div className="hidden absolute inset-0 opacity-[0.03] pointer-events-none md:block" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-black">Founding Member Programme</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
              Be first when we<br />launch TRT.
            </h1>
            <p className="text-lg md:text-2xl text-black font-serif mb-12 max-w-3xl leading-relaxed">
              Andro Prime is building a clinical testosterone replacement service for UK men. Led by a GMC-registered GP. Anchored in blood data, not guesswork. We&rsquo;re not live yet. But you can secure your place now.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16">
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <a href="#deposit" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 transition-all flex items-center justify-center gap-2 w-full text-center">
                  Secure Your Place &ndash; £75
                </a>
                <p className="text-sm font-sans font-bold uppercase tracking-widest text-center text-black">Fully refundable. Applied as credit when we launch. No obligation.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pt-8 border-t-2 border-black data-label">
              {['GMC-Registered Prescriber', 'Harley Street TRT-Trained', 'UKAS Accredited Lab', 'UK-Based'].map(item => (
                <div key={item} className="flex items-center gap-2"><CheckSvg />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS MATTERS */}
      <section className="py-32 relative bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-6">
              <SectionEyebrow label="Why This Matters" />
              <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Your result came back low.<br /><span className="text-gray-400">Now what?</span>
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>If your Andro Prime test showed testosterone below 12 nmol/L, you already know more than most men do. The question is what happens next.</p>
                <p>The NHS threshold for treatment is not set at 12. Most GPs won&rsquo;t act unless you&rsquo;re well below that, and even then the process is slow. Private clinics charge £200 to £300 for a consultation before they&rsquo;ve seen a single blood result. Some will prescribe on the basis of a questionnaire.</p>
                <p className="font-bold border-l-4 border-black pl-6 py-2 my-8">That&rsquo;s not how this should work.</p>
                <p>Andro Prime is building a clinical TRT service that starts with data. Your data. We&rsquo;ll know your Total T, your SHBG, your Free Testosterone before your first consultation. You&rsquo;ll speak to Dr Ewa Lindo, not a call handler. And the protocol will be built around your numbers, not a generic starting dose.</p>
                <p className="bg-gray-100 p-6 border-2 border-black mt-8 text-lg">
                  <span className="font-sans font-black uppercase text-sm block mb-2 tracking-widest">Status Update</span>
                  We&rsquo;re not live yet. We&rsquo;re waiting for CQC registration. The founding member programme exists so that the men who&rsquo;ve already done the work are first in the door when we are.
                </p>
              </div>
            </div>

            {/* Threshold Gap visual */}
            <div className="lg:col-span-6 lg:mt-12">
              <div className="glass-panel p-8 md:p-12 relative overflow-hidden bg-gray-50 h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b-2 border-black">
                  <div className="w-3 h-3 bg-black" />
                  <h3 className="font-sans font-black text-2xl tracking-tighter uppercase text-black m-0">The Threshold Gap</h3>
                </div>
                <div className="space-y-12">
                  {[
                    { label: 'NHS Action Threshold', value: '~8.0', bar: 'w-[20%]', note: 'Requires severe deficiency. Often involves long wait times.' },
                    { label: 'Symptomatic Zone (You)', value: '8.0 - 12.0', bar: null, note: 'The "grey area". Told you are normal, but feeling suboptimal.' },
                    { label: 'Optimal Function', value: '15.0+', bar: null, note: 'The target state. Restored energy, drive, and recovery.' },
                  ].map(({ label, value, note }) => (
                    <div key={label}>
                      <div className="flex justify-between items-end mb-3">
                        <div className="data-label">{label}</div>
                        <div className="font-sans font-black text-xl">{value} <span className="text-sm font-normal">nmol/L</span></div>
                      </div>
                      <div className="h-4 w-full bg-white border-2 border-black relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-black w-[20%]" />
                      </div>
                      <p className="text-sm font-serif mt-2 text-gray-600">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-32 bg-white border-b-4 border-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <SectionEyebrow label="What's Included" />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-none mb-6">
              Secure your place.<br />Hold it with no obligation.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'First Access', body: "You're at the front of the queue when we launch. No waitlist. No cold inquiry. Your place is already confirmed.", dark: false },
              { num: '02', title: '£75 Applied As Credit', body: "The deposit goes straight toward your first month of TRT. You're not paying extra to be here. You're paying early.", dark: true },
              { num: '03', title: 'Founding Pricing', body: "We're locking in a preferential rate for founding members. When TRT launches at full price, you pay less. Permanently.", dark: false },
              { num: '04', title: 'Direct Line To Dr Ewa', body: "Founding members get priority scheduling. You're not going through a queue. You're a known patient before we open.", dark: false },
              { num: '05', title: 'Data Already On File', body: "You've tested. We have your baseline. When we launch, we're not starting from scratch. We're already working from your numbers.", dark: false, wide: true },
            ].map(({ num, title, body, dark, wide }) => (
              <div key={num} className={`glass-panel p-10 relative z-10 transition-transform duration-300 min-h-[320px] flex flex-col ${dark ? 'bg-black' : 'bg-white'} ${wide ? 'md:col-span-2' : ''}`}>
                <div className={`absolute top-0 right-0 p-4 text-[120px] font-sans font-black leading-none select-none pointer-events-none -mt-6 -mr-2 ${dark ? 'text-gray-900' : 'text-gray-100'}`}>{num[1]}</div>
                <div className={`w-12 h-12 flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{num}</div>
                <h3 className={`text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-20 ${dark ? 'text-white' : 'text-black'}`}>{title}</h3>
                <p className={`font-serif text-base leading-relaxed relative z-20 mt-auto ${dark ? 'text-gray-300' : 'text-black'}`}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOSIT CTA */}
      <section id="deposit" className="py-32 bg-gray-50 border-b-4 border-black relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-white border-4 border-black p-10 md:p-16 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white mb-8">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <div className="data-label mb-6">The Deposit</div>
            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-8">Fully refundable. No obligation.</h2>
            <p className="text-xl text-black font-serif mb-6 leading-relaxed max-w-2xl mx-auto">
              The £75 is a deposit, not a payment. It secures your founding member place. If we don&rsquo;t launch within 12 months, or if you change your mind for any reason, you get it back. All of it. No questions asked.
            </p>
            <p className="text-xl text-black font-serif mb-12 leading-relaxed max-w-2xl mx-auto">
              If you stay, the £75 comes off your first month. It costs you nothing to hold your place.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a href="#" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-12 py-6 transition-all flex items-center justify-center w-full md:w-auto">
                Secure Your Place &ndash; £75
              </a>
              <div className="flex items-center gap-2 mt-4 text-sm font-sans font-bold uppercase tracking-widest text-black bg-gray-100 px-4 py-2 border-2 border-black">
                <span className="w-2 h-2 bg-black block" />
                Fully refundable. Cancel any time before we go live.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE'RE BUILDING */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="What We're Building" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">TRT done properly.<br />Data first. Doctor led.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'You test before you start.', body: "We don't prescribe on symptoms alone. You'll have a UKAS-accredited blood panel before your first consultation. Full picture before any protocol begins." },
              { title: 'A real GP, not a portal.', body: "Dr Ewa Lindo is a GMC-registered GP with specialist TRT training from Harley Street. You'll speak to her. She'll review your results personally." },
              { title: 'A protocol built around your numbers.', body: "Starting dose, delivery method, follow-up schedule – all of it based on your specific biomarkers. Not a one-size prescription." },
              { title: 'Ongoing monitoring built in.', body: "Regular blood panels are part of the programme. We track your levels over time. If something needs adjusting, we adjust it. You're not on your own once you start." },
            ].map(({ title, body }) => (
              <div key={title} className="glass-panel p-10 border-l-[12px] border-l-black hover:bg-gray-50 transition-colors">
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4">{title}</h3>
                <p className="text-lg text-black font-serif leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO'S BEHIND THIS */}
      <section className="py-32 relative bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-4 border-black pb-8">
            <div>
              <SectionEyebrow label="Who's Behind This" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-4">A founder who&rsquo;s been through it.<br />A doctor who gets it.</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-10 flex flex-col items-center text-center relative overflow-hidden bg-white">
              <div className="relative mb-8 mt-4">
                <div className="w-32 h-32 border-4 border-black bg-white flex items-center justify-center relative z-10">
                  <span className="text-5xl font-sans font-black text-black uppercase tracking-tighter">KA</span>
                </div>
              </div>
              <h4 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-2">Keith Anthony</h4>
              <p className="data-label text-black mb-8 text-sm">Founder</p>
              <div className="bg-gray-50 border-t-2 border-black -mx-10 -mb-10 p-10 text-left mt-auto">
                <p className="text-lg font-serif italic text-black leading-relaxed">
                  &ldquo;I know exactly how it feels to get a result that says borderline and then be told to come back in six months. I built Andro Prime because that answer isn&rsquo;t good enough. The founding member programme is for men who&rsquo;ve already done the work. You&rsquo;ve tested. You know your numbers. Now you get first access to a clinical service that was built around that data.&rdquo;
                </p>
              </div>
            </div>
            <div className="glass-panel p-10 flex flex-col items-center text-center relative overflow-hidden bg-white">
              <div className="relative mb-8 mt-4">
                <div className="w-32 h-32 border-4 border-black bg-black text-white flex items-center justify-center relative z-10">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </div>
              </div>
              <h4 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-2">Dr Ewa Lindo</h4>
              <p className="data-label text-black mb-8 text-sm">GMC-Registered · Harley St TRT-Trained</p>
              <div className="bg-gray-50 border-t-2 border-black -mx-10 -mb-10 p-10 text-left mt-auto">
                <p className="text-lg font-serif italic text-black leading-relaxed">
                  &ldquo;I&rsquo;ve seen men come to me after years on the wrong side of the NHS threshold. They&rsquo;ve read everything. They know what TRT is. They just want a doctor who takes it seriously. That&rsquo;s what this programme is for. We start from your data. We build from there.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IS THIS YOU */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <SectionEyebrow label="Is This You" />
          <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-16">If any of this sounds familiar, you&rsquo;re in the right place.</h2>
          <ul className="space-y-6">
            {[
              'Your testosterone came back below 12 nmol/L on an Andro Prime test.',
              "Your GP said normal. You don't feel normal.",
              "You've spent months reading about TRT and you want a credible UK option with a real doctor.",
              "You've looked at private clinics but you're not paying £300 for a consultation before anyone looks at your blood.",
              "You want to do this properly, with monitoring, not a prescription and a wave goodbye.",
            ].map(item => (
              <li key={item} className="glass-panel p-6 flex items-start gap-6 border-l-[12px] border-l-black">
                <div className="mt-1 w-8 h-8 border-4 border-black flex flex-shrink-0 items-center justify-center bg-black text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="text-xl text-black font-serif leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <SectionEyebrow label="Common Questions" />
          <div className="border-t-4 border-black mt-12">
            {faqItems.map(({ q, a }) => (
              <details key={q} className="group border-b-2 border-black">
                <summary className="flex justify-between items-center font-sans font-black text-xl md:text-2xl uppercase tracking-tighter py-6 cursor-pointer list-none hover:bg-gray-50 px-4 -mx-4 transition-colors">
                  <span>{q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-45 font-mono text-3xl leading-none">+</span>
                </summary>
                <div className="pb-8 pt-2 px-4 -mx-4 font-serif text-lg leading-relaxed text-black">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-40 relative bg-black text-white overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl lg:text-[80px] font-sans font-black uppercase tracking-tighter leading-[0.9] mb-10">
            You&rsquo;ve already done the hard part. You tested. You know your numbers.
          </h2>
          <p className="text-2xl font-serif mb-16 max-w-3xl mx-auto leading-relaxed text-gray-300">
            Secure your founding member place now. Your £75 is fully refundable. Applied as credit when we launch. No obligation.
          </p>
          <div className="flex flex-col items-center gap-6">
            <a href="#deposit" className="bg-white text-black hover:bg-transparent hover:text-white border-4 border-white font-sans font-black uppercase tracking-widest text-xl px-12 py-6 transition-all flex items-center justify-center gap-4">
              Secure Your Place &ndash; £75
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-sans font-bold uppercase tracking-widest text-gray-400 mt-4">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white" /> Fully refundable</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white" /> First access</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white" /> Founding member pricing locked in for life</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
