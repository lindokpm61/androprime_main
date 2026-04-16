import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Energy & Recovery Check — Kit 2',
  description: 'At-home blood test for energy, recovery and inflammation. Vitamin D, Magnesium, hs-CRP, Ferritin. UKAS accredited lab. £44.',
}

const faqItems = [
  { q: 'Does it hurt?', a: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets just in case." },
  { q: 'How long do results take?', a: 'Once our UKAS accredited lab receives your sample, your dashboard is updated within 48 hours.' },
  { q: 'Does the £44 cover everything?', a: 'Yes. The kit, the lab analysis for all four biomarkers, the prepaid return postage, and access to your results dashboard are all included.' },
  { q: 'Is my data private?', a: 'Completely. We use bank-level encryption. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.' },
  { q: 'Can I test testosterone as well?', a: 'This kit focuses on energy, recovery, and inflammation. If you also want testosterone checked, Kit 3 includes everything in this kit plus Total T, SHBG, and Free T for £69.' },
  { q: 'I already take supplements. Is this still worth it?', a: 'Especially if you already take supplements. Most men are guessing which ones they need. This test tells you which deficiencies you actually have, so you stop spending money on things you don\'t need.' },
]

export default function KitEnergyRecoveryPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px] !text-black">Data First</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[85px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Sore for three days after a workout that used to take one.
            </h1>

            <p className="text-lg md:text-2xl text-black font-serif mb-12 max-w-3xl leading-relaxed">
              Find out exactly which deficiency is slowing you down. Four biomarkers. One finger prick. Results in 48 hours, in plain English, with a specific recommendation based on your numbers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-start">
              <Link href="#order" className="bg-black hover:bg-white border-2 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                Order the Kit — £44
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 data-label border-t-2 border-black pt-8">
              {['UKAS ISO 15189 Accredited Lab', 'Free UK Delivery', 'GMC-Registered Doctor'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SYMPTOMS */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                The Reality
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                You&rsquo;re doing everything right.<br />
                <span className="text-gray-400 font-black">Something&rsquo;s still off.</span>
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>You train. You eat well. You sleep. But your recovery has slowed, your energy tanks by mid-afternoon, and your joints ache in a way they didn&rsquo;t two years ago.</p>
                <p>You&rsquo;re not injured. You&rsquo;re not lazy. Something in your blood is holding you back, and guessing won&rsquo;t fix it.</p>
              </div>
            </div>

            <div className="border-2 border-black p-10 md:p-12 bg-white">
              <div className="flex items-center gap-4 mb-10 pb-8 border-b-2 border-black">
                <div className="w-3 h-3 bg-black" />
                <h3 className="font-sans font-black text-2xl tracking-tighter uppercase text-black m-0">Symptom Checklist</h3>
              </div>
              <div className="space-y-8">
                {[
                  { label: 'Recovery', detail: 'Sore for days after sessions that used to feel easy.' },
                  { label: 'Energy', detail: "Dragging through the afternoon. Coffee isn't cutting it anymore." },
                  { label: 'Joints', detail: 'Stiff in the morning. Aching after training. Getting worse, not better.' },
                  { label: 'Performance', detail: 'Doing the same work but getting less from it.' },
                ].map(({ label, detail }) => (
                  <div key={label} className="flex items-start gap-5">
                    <div className="mt-1.5 w-6 h-6 border-2 border-black flex shrink-0 items-center justify-center bg-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="text-black font-serif text-lg leading-relaxed">
                      <strong className="text-black font-sans font-black uppercase text-base tracking-tight block mb-1">{label}</strong>
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIOMARKERS */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Data
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Four markers.<br />Four answers.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Each biomarker targets a specific reason your body isn&rsquo;t recovering the way it should.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: '01', title: 'Vitamin D', body: 'Most UK men are deficient between October and March. Low vitamin D directly affects muscle function, recovery speed, and energy. You can\'t tell from how you feel. You can only tell from your blood.' },
              { num: '02', title: 'Magnesium', body: 'The mineral your muscles need to recover and relax. Active men burn through it faster than most. Low magnesium means poor sleep, slower recovery, and persistent fatigue.' },
              { num: '03', title: 'hs-CRP (Inflammation)', body: 'A high-sensitivity inflammation marker. If this is elevated, your body is dealing with inflammation it isn\'t clearing. In active men, this is often linked to joint and connective tissue stress.' },
              { num: '04', title: 'Ferritin', body: 'Your iron stores. Low ferritin is one of the most common and most overlooked causes of fatigue in men. If your energy has dropped off a cliff, this is often why.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="border-2 border-black p-10 bg-white hover:bg-gray-50 transition-colors flex flex-col">
                <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white border-2 border-black w-max mb-8">
                  <span className="w-2 h-2 bg-white" /> Biomarker {num}
                </div>
                <h3 className="text-4xl font-sans font-black uppercase tracking-tighter text-black mb-6">{title}</h3>
                <p className="text-lg text-black font-serif leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Process
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Five minutes.<br />No GP needed.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-black -translate-y-1/2 z-0" />
            {[
              { n: '01', t: 'Order', b: 'Dispatched same day. Fits through your letterbox.' },
              { n: '02', t: 'Collect', b: 'A simple finger-prick sample you can do at the kitchen table.' },
              { n: '03', t: 'Return', b: 'Drop it in a postbox using the prepaid return envelope.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="group border-2 border-black p-10 relative z-10 bg-white hover:bg-black transition-colors duration-200">
                <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-gray-100 group-hover:text-white leading-none select-none pointer-events-none -mt-6 -mr-2">{n[1]}</div>
                <div className="w-12 h-12 bg-white border-4 border-black text-black group-hover:bg-black group-hover:border-white group-hover:text-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 transition-colors duration-200">{n}</div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 relative z-20 transition-colors duration-200">{t}</h3>
                <p className="text-black group-hover:text-gray-300 font-serif text-base leading-relaxed relative z-20 transition-colors duration-200">{b}</p>
              </div>
            ))}
            <div className="border-4 border-black p-10 relative z-10 bg-black text-white">
              <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-white leading-none select-none pointer-events-none -mt-6 -mr-2">4</div>
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">04</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-white mb-4 relative z-20">Read</h3>
              <p className="text-gray-300 font-serif text-base leading-relaxed relative z-20">Your results appear in your private dashboard within 48 hours. Clear, specific, and in plain English.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-20 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqItems.map(({ q, a }) => (
              <div key={q} className="border-2 border-black p-8 bg-gray-50">
                <h3 className="text-xl font-sans font-black uppercase tracking-tighter mb-4 text-black border-b-2 border-black pb-4">{q}</h3>
                <p className="font-serif text-black leading-relaxed text-lg">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER CTA */}
      <section className="py-40 bg-white border-b-4 border-black text-center" id="order">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-6xl md:text-[90px] font-sans font-black uppercase tracking-tighter text-black leading-[0.9] mb-10">
            Stop guessing why you&rsquo;re tired.<br />Find out.
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-2xl mx-auto leading-relaxed">A finger prick. A prepaid envelope. 48 hours. That&rsquo;s it.</p>
          <Link href="#order" className="inline-flex bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 transition-all items-center justify-center gap-4">
            Order the Kit — £44
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* COMPARE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl font-serif font-bold text-black mb-8">Want the full picture? Kit 3 adds testosterone, SHBG, and Free T to everything in Kit 2.</p>
          <Link href="/kits/hormone-recovery" className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-base px-8 py-4 transition-all">
            See Kit 3 — £69
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
