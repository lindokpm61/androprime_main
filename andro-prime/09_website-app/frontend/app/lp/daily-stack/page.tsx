import type { Metadata } from 'next'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

const BASE_URL = 'https://andro-prime.com'

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Daily Stack', item: `${BASE_URL}/lp/daily-stack` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'When will the Daily Stack be available?',
          acceptedAnswer: { '@type': 'Answer', text: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
        },
        {
          '@type': 'Question',
          name: 'Is the Daily Stack on sale right now?',
          acceptedAnswer: { '@type': 'Answer', text: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
        },
        {
          '@type': 'Question',
          name: 'What will I get for joining the waitlist?',
          acceptedAnswer: { '@type': 'Answer', text: 'Early dispatch when stock arrives, and a founding-customer discount on your first order. No payment is taken to join.' },
        },
        {
          '@type': 'Question',
          name: 'Can I take this without doing a blood test first?',
          acceptedAnswer: { '@type': 'Answer', text: "Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know what you actually need, and how you know it is working at retest. We always recommend testing first." },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Daily Stack | Launching Shortly | Andro Prime',
  description: 'Zinc, Active B12 (Methylcobalamin), and Vitamin D3 in one daily product. EFSA-approved claims. Launching shortly. Join the waitlist for early dispatch and a founding-customer discount.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Daily Stack | Launching Shortly | Andro Prime',
    description: 'Three active ingredients most men over 35 are missing, in one daily product. Zinc, Active B12, and Vitamin D3. Launching shortly. Join the waitlist.',
    url: 'https://andro-prime.com/lp/daily-stack',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Daily Stack supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Stack | Andro Prime',
    description: 'Zinc, Active B12 (Methylcobalamin), and Vitamin D3. EFSA-approved claims. Launching shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  { question: 'When will the Daily Stack be available?', answer: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { question: 'Is the Daily Stack on sale right now?', answer: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { question: 'What will I get for joining the waitlist?', answer: 'Early dispatch when stock arrives, and a founding-customer discount on your first order. No payment is taken to join.' },
  { question: 'Can I take this without doing a blood test first?', answer: "Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know what you actually need, and how you know it is working at retest. We always recommend testing first." },
  { question: 'What form of B12 will be used?', answer: "Methylcobalamin: the active form your body absorbs directly. Most supplements use cyanocobalamin, a cheaper synthetic form that requires conversion before use. We will use Methylcobalamin at 1,000mcg." },
  { question: 'Why no iron?', answer: "Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We do not include iron in any of our supplements." },
]

export default function DailyStackLpPage() {
  return (
    <>
      <JsonLd data={lpSchema} />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black text-white mb-8 border-2 border-black">
              Supplement // Daily Stack // Launching Shortly
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Stop guessing which supplements you need.
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              The three things most men over 35 are genuinely low in, in one daily product. Zinc, Active B12, and Vitamin D3. Each at a dose that actually moves the needle. Each backed by EFSA-approved health claims. Launching shortly. Join the waitlist for early dispatch and a founding-customer discount.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#join" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Join the waitlist
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">No payment. No commitment.</span>
            </div>
          </div>

          {/* Supplement card */}
          <div className="lg:col-span-5">
            <div className="border-4 border-black p-10 bg-white relative">
              <div className="data-label mb-4 bg-black text-white px-3 py-1.5 inline-block">Formulation</div>
              <h2 className="text-4xl font-sans font-black uppercase tracking-tighter mb-8">Daily Stack</h2>

              <div className="space-y-6 border-t-4 border-black pt-8">
                {[
                  { name: 'Zinc', dose: '30mg', claim: 'Contributes to the maintenance of normal testosterone levels', tag: 'EFSA Claim' },
                  { name: 'Vitamin D3', dose: '4,000 IU', claim: 'Contributes to normal muscle function', tag: 'EFSA Claim' },
                  { name: 'Active B12', dose: '1,000mcg', claim: 'Contributes to normal energy-yielding metabolism', tag: 'EFSA Claim' },
                ].map(({ name, dose, claim, tag }) => (
                  <div key={name} className="border-b-2 border-black pb-6">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-sans font-black uppercase tracking-tighter text-xl">{name}</h3>
                      <span className="font-mono font-black text-lg">{dose}</span>
                    </div>
                    <p className="font-serif text-sm text-gray-600 italic mb-2">&ldquo;{claim}&rdquo;</p>
                    <span className="data-label border border-black px-2 py-0.5 !text-[10px]">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionEyebrow label="The Problem" />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Most supplement stacks are built on guesswork.
            </h2>
            <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
              <p>You are taking five different pills from three different brands that some influencer recommended. You do not know the doses. You do not know if they are working. You do not know if you need them.</p>
              <p>We are building this stack differently. It contains the three supplements most commonly flagged as low in our blood test data, at the doses backed by EFSA-approved health claims.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  This is not a random multivitamin. It is what your blood test would actually recommend.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">Why These Three</h3>
            </div>
            <div className="space-y-4">
              {[
                { marker: 'Zinc (30mg)', body: 'Most men in the UK are borderline low. Zinc contributes to the maintenance of normal testosterone levels (EFSA-approved claim).' },
                { marker: 'Vitamin D3 (4,000 IU)', body: 'Over 40% of UK adults are low in winter. Vitamin D3 contributes to normal muscle function (EFSA-approved claim).' },
                { marker: 'Active B12 (1,000mcg Methylcobalamin)', body: 'Contributes to normal energy-yielding metabolism and to normal psychological function. Particularly relevant for men over 40. Methylcobalamin is the form your body absorbs directly, not the cheaper synthetic cyanocobalamin.' },
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

      {/* CLINICAL OVERSIGHT */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-0 border-4 border-black">
            <div className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="data-label border-2 border-black inline-block px-3 py-1 mb-8 bg-white">Founder</div>
                <p className="font-serif text-2xl leading-relaxed italic mb-12">&ldquo;I was spending £60 a month on five different bottles. Then I got my blood tested and found out I was actually low in just two things. That is when I decided we needed to build something better.&rdquo;</p>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-2xl">Keith Antony</div>
                <div className="data-label mt-2">Founder, Andro Prime</div>
              </div>
            </div>

            <div className="p-12 bg-white flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="data-label border-2 border-black inline-block px-3 py-1 mb-8 bg-black text-white">Clinical Oversight</div>
                <p className="font-serif text-2xl leading-relaxed italic mb-12">&ldquo;Every ingredient in this formulation has a specific, evidence-based reason for being included at its specific dose. We do not add ingredients for marketing purposes.&rdquo;</p>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-2xl">Dr Ewa Lindo</div>
                <div className="data-label mt-2 mb-6">GMC Prescriber &amp; Clinical Lead</div>
                <div className="space-y-4 pt-8 border-t-4 border-black">
                  <div className="data-label text-black mb-4">Verification</div>
                  {['GMC Registered Practice', 'Harley Street TRT-Trained', 'EFSA Compliant Dosage'].map((v) => (
                    <div key={v} className="flex items-center gap-4 text-base text-black font-serif">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + WAITLIST */}
      <section className="py-32 bg-white" id="join">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <SectionEyebrow label="Common Questions" />
              <FaqAccordion items={faqItems} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="border-4 border-black bg-black text-white p-10 md:p-12 relative overflow-hidden mb-6">
                <div className="data-label bg-white text-black px-4 py-2 inline-block border-2 border-black mb-8">Waitlist</div>

                <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-2">Daily Stack</h2>
                <p className="font-serif text-base text-gray-300 mb-6">
                  Launching shortly, as soon as our manufacturing partner is confirmed.
                </p>
                <p className="font-serif text-base text-gray-300 mb-2">
                  Waitlist members get:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="font-serif text-sm text-gray-300 flex gap-3 items-start"><span className="mt-2 w-1.5 h-1.5 bg-white shrink-0" /> Early dispatch ahead of public launch.</li>
                  <li className="font-serif text-sm text-gray-300 flex gap-3 items-start"><span className="mt-2 w-1.5 h-1.5 bg-white shrink-0" /> A founding-customer discount on the first order.</li>
                  <li className="font-serif text-sm text-gray-300 flex gap-3 items-start"><span className="mt-2 w-1.5 h-1.5 bg-white shrink-0" /> No payment, no commitment to join.</li>
                </ul>
              </div>

              <SupplementWaitlistForm interestedInProduct="daily-stack" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
