import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Andro Prime — built by Keith Antony after his own experience being told his levels were normal while feeling far from it.',
}

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-12 h-[2px] bg-black" />
              About Andro Prime
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[85px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Built by someone who needed it.
            </h1>
            <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-3xl">
              Not a clinic. Not a wellness brand trying to sell you something. A business built by a man who spent two years being told he was fine while feeling anything but.
            </p>
          </div>
        </div>
      </section>

      {/* KEITH'S STORY */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                The Founder
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Keith Antony
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>
                  I spent two years being told my levels were &ldquo;normal for my age&rdquo; while feeling completely burnt out. Exhausted by 3pm. Brain fog that wouldn&rsquo;t shift. Recovery that took three days for a workout that used to take one.
                </p>
                <p>
                  My GP ran a basic panel and told me everything was fine. What he didn&rsquo;t tell me was that &ldquo;fine&rdquo; means you&rsquo;re above the threshold for clinical deficiency, not that you&rsquo;re optimised.
                </p>
                <p>
                  I built Andro Prime because I couldn&rsquo;t find a service that gave me my actual numbers in plain English with a clear recommendation. Everything was either a GP appointment I couldn&rsquo;t get, or a private clinic costing hundreds before I even knew what I was dealing with.
                </p>
                <p>
                  We test first. We tell you what your numbers mean. Then we show you what to do about it.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-2 border-black p-10 bg-white">
                <div className="data-label mb-6 border-b-2 border-black pb-4 flex items-center gap-3">
                  <span className="w-3 h-3 bg-black" />
                  Keith Antony / Founder
                </div>
                <p className="text-2xl font-serif text-black leading-relaxed italic">
                  &ldquo;I built this company because the standard approach is broken. We test first. Then we fix it.&rdquo;
                </p>
                <div className="mt-8 text-xs font-sans font-black text-gray-400 uppercase tracking-widest">[ DRAFT — NOT YET APPROVED ]</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DR EWA */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                Medical Director
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Dr Ewa Lindo
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>
                  GMC-registered GP with specialist training in men&rsquo;s hormonal health and TRT at Harley Street. Dr Lindo reviews our clinical protocols and signs off all results report copy.
                </p>
                <p>
                  She understands the gap between what the NHS flags as deficient and what actually leaves men functioning well. That gap is what Andro Prime exists to close.
                </p>
              </div>
            </div>

            <div className="border-2 border-black p-10 bg-white">
              <div className="data-label mb-6 border-b-2 border-black pb-4 flex items-center gap-3">
                <span className="w-3 h-3 bg-black" />
                Dr Ewa Lindo / Medical Director
              </div>
              <p className="text-2xl font-serif text-black leading-relaxed italic">
                &ldquo;Normal ranges are statistical averages, not targets for how you should actually feel. I review our clinical protocols to ensure your data translates into effective, actionable health steps.&rdquo;
              </p>
              <div className="mt-8 text-xs font-sans font-black text-gray-400 uppercase tracking-widest">[ DRAFT — NOT YET APPROVED ]</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-12 h-[2px] bg-black" />
              How we operate
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-0">
              Four principles. No exceptions.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { num: '01', title: 'Data first', body: 'Every recommendation starts with a result. Not a guess. Not a lifestyle questionnaire. Your blood data.' },
              { num: '02', title: 'Plain English', body: 'No lab reference tables. No clinical jargon. Your numbers in language that tells you what to do next.' },
              { num: '03', title: 'Evidence-led', body: 'EFSA-approved supplement claims. UKAS ISO 15189 accredited lab. GMC-registered doctor. No pseudoscience.' },
              { num: '04', title: 'Anti-corporate', body: 'Smaller. More personal. More direct. We tell you if something needs a GP, not just what sells the next product.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="border-2 border-black p-10 bg-white hover:bg-gray-50 transition-colors">
                <div className="data-label text-gray-400 mb-4">{num}</div>
                <h3 className="font-sans font-black uppercase text-3xl tracking-tighter mb-4">{title}</h3>
                <p className="font-serif text-lg text-black leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAB */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                The Lab
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                UKAS ISO 15189.<br />Not a pop-up kit.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>Your sample is analysed by Vitall, a UKAS ISO 15189 accredited laboratory. That&rsquo;s the same accreditation standard used by the NHS.</p>
                <p>Results are delivered through your private Andro Prime dashboard. Not through the lab&rsquo;s portal. Not in a generic reference range table. In a format built to tell you what matters.</p>
              </div>
            </div>
            <div className="border-4 border-black p-10 bg-white">
              <div className="space-y-6">
                {[
                  { label: 'Lab partner', value: 'Vitall' },
                  { label: 'Accreditation', value: 'UKAS ISO 15189' },
                  { label: 'Turnaround', value: '48 hours from lab receipt' },
                  { label: 'Results delivery', value: 'Private Andro Prime dashboard' },
                  { label: 'Data security', value: 'Bank-level encryption' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start border-b-2 border-black pb-6">
                    <span className="data-label text-gray-500">{label}</span>
                    <span className="font-sans font-black text-black text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-black leading-[0.9] mb-10">
            Ready to find out where you stand?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/kits" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-10 py-5 transition-all flex items-center justify-center gap-3">
              Choose your test
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <Link href="/how-it-works" className="border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-10 py-5 hover:bg-gray-100 transition-all flex items-center justify-center">
              How it works
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
