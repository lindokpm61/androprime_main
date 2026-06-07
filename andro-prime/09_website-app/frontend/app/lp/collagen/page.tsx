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
        { '@type': 'ListItem', position: 2, name: 'Joint & Recovery Collagen', item: `${BASE_URL}/lp/collagen` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'When will Joint and Recovery Collagen be available?',
          acceptedAnswer: { '@type': 'Answer', text: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
        },
        {
          '@type': 'Question',
          name: 'Is this on sale right now?',
          acceptedAnswer: { '@type': 'Answer', text: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
        },
        {
          '@type': 'Question',
          name: 'What will I get for joining the waitlist?',
          acceptedAnswer: { '@type': 'Answer', text: 'Early dispatch when stock arrives, and a founding-customer discount on your first order. No payment is taken to join.' },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Joint Pain Supplement for Active Men | Joint & Recovery Collagen',
  description: 'Hydrolysed collagen peptides, UC-II, Vitamin C, and MSM. Built for active men with elevated inflammation or joint symptoms. Launching shortly. Join the waitlist for early dispatch.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Joint Pain Supplement for Active Men | Joint & Recovery Collagen | Andro Prime',
    description: '10g hydrolysed collagen peptides, UC-II, Vitamin C, and MSM. Launching shortly. Join the waitlist for early dispatch.',
    url: 'https://andro-prime.com/lp/collagen',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Joint & Recovery Collagen supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joint Pain Supplement for Active Men | Andro Prime',
    description: '10g hydrolysed collagen, UC-II, Vitamin C, MSM. Launching shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  { question: 'When will Joint and Recovery Collagen be available?', answer: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { question: 'Is this on sale right now?', answer: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { question: 'What will I get for joining the waitlist?', answer: 'Early dispatch when stock arrives, and a founding-customer discount on your first order. No payment is taken to join.' },
  { question: 'What will be in the formulation?', answer: '10g hydrolysed collagen peptides, 40mg UC-II undenatured Type II collagen, 80mg Vitamin C, and 500mg MSM. Vitamin C contributes to normal collagen formation for the normal function of cartilage.' },
  { question: 'Will it taste of anything?', answer: 'No. It will be unflavoured. Mix it into coffee, a shake, water, or anything else.' },
]

export default function CollagenLpPage() {
  return (
    <>
      <JsonLd data={lpSchema} />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black text-white mb-8 border-2 border-black">
              Supplement // Joint &amp; Recovery Collagen // Launching Shortly
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your joints are not ageing.<br />
              <span className="text-gray-400">They are starving.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              After 30, your body produces less collagen every year. Joints stiffen. Tendons weaken. Recovery slows. We are building a formula that pairs 10g of hydrolysed collagen peptides with UC-II, Vitamin C, and MSM. Launching shortly. Join the waitlist for early dispatch and a founding-customer discount.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#join" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Join the waitlist
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">No payment. No commitment.</span>
            </div>
          </div>

          {/* Product card */}
          <div className="lg:col-span-5">
            <div className="border-4 border-black p-10 bg-white relative">
              <div className="data-label mb-4 bg-black text-white px-3 py-1.5 inline-block">Formulation (in build)</div>
              <h2 className="text-4xl font-sans font-black uppercase tracking-tighter mb-8">Joint &amp; Recovery Collagen</h2>

              <div className="border-t-4 border-black pt-8">
                <div className="border-b-2 border-black pb-6 mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-sans font-black uppercase tracking-tighter text-xl">Hydrolysed Collagen Peptides</h3>
                    <span className="font-mono font-black text-lg">10g</span>
                  </div>
                  <p className="font-serif text-sm text-gray-600 italic mb-2">&ldquo;Hydrolysed peptides for absorption&rdquo;</p>
                  <span className="data-label border border-black px-2 py-0.5 !text-[10px]">Per Serving</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'UC-II Type II Collagen', value: '40mg, the researched dose' },
                    { label: 'Vitamin C', value: '80mg, EFSA cartilage claim' },
                    { label: 'MSM', value: '500mg, joint comfort support' },
                    { label: 'Additives', value: 'None. Unflavoured.' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4 py-2 border-b border-gray-200">
                      <span className="data-label shrink-0">{label}</span>
                      <span className="font-serif text-sm text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE SCIENCE */}
      <section className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionEyebrow label="The Science" />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Why collagen matters after 30.
            </h2>
            <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
              <p>After 30, collagen synthesis drops by roughly 1% per year. By 50, you have lost up to 20% of the collagen that supports your joints, tendons, and skin.</p>
              <p>This is not something you feel gradually. It hits suddenly: a shoulder that does not recover. A knee that starts clicking. Skin that looks tired no matter how much you sleep.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  You cannot eat enough collagen through food. Supplementation is the only practical way to top up.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">What It Will Support</h3>
            </div>
            <div className="space-y-4">
              {[
                { marker: 'Joint Comfort', body: 'Hydrolysed peptides accumulate in cartilage. Vitamin C contributes to normal collagen formation for the normal function of cartilage.' },
                { marker: 'Recovery', body: 'Type I collagen is the primary structural protein in tendons and ligaments. Supplementation supports repair after training.' },
                { marker: 'Inflammation Marker Tracking', body: 'Built to be paired with a retest at 90 days, so you can see if your hs-CRP marker has moved alongside how you feel.' },
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
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="border-2 border-black p-10 lg:p-16 flex flex-col justify-between h-full bg-white">
            <div>
              <div className="data-label bg-black text-white px-3 py-1.5 inline-block w-fit mb-10">Founder</div>
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic mb-12">
                &ldquo;I started taking collagen at 39 when my shoulder would not recover. Within 6 weeks, I could train again without pain. I do not know why it took me so long to try it.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-6 border-t-2 border-black pt-8">
              <div className="w-16 h-16 rounded-none border-2 border-black flex items-center justify-center shrink-0">
                <span className="font-sans font-black text-2xl uppercase">KA</span>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-xl">Keith Antony</div>
                <div className="font-serif text-sm text-gray-600">Founder, Andro Prime</div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-10 lg:p-16 flex flex-col justify-between h-full bg-gray-50">
            <div>
              <div className="data-label border-2 border-black px-3 py-1.5 inline-block w-fit mb-10">Clinical Oversight</div>
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic mb-12">
                &ldquo;10g of hydrolysed collagen with Vitamin C is the clinically studied combination. UC-II and MSM extend support to joint-specific tissue. No fillers, no additives.&rdquo;
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
                  <div className="font-serif text-sm text-gray-600">GMC-Registered GP &amp; Clinical Lead</div>
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

      {/* FAQ + WAITLIST */}
      <section className="py-32 bg-white border-t-4 border-black" id="join">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <SectionEyebrow label="Common Questions" />
              <FaqAccordion items={faqItems} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="border-4 border-black bg-black text-white p-10 md:p-12 relative overflow-hidden mb-6">
                <div className="data-label bg-white text-black px-4 py-2 inline-block border-2 border-black mb-8">Waitlist</div>

                <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-2">Joint &amp; Recovery</h2>
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

              <SupplementWaitlistForm interestedInProduct="collagen" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
