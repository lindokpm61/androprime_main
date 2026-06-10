import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'

const BASE_URL = 'https://andro-prime.com'

const dailyStackSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${BASE_URL}/supplements` },
        { '@type': 'ListItem', position: 3, name: 'Daily Stack', item: `${BASE_URL}/supplements/daily-stack` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Men\'s Multivitamin: Zinc, B12 & Vitamin D3',
  description: 'A men\'s multivitamin built around blood data: Zinc, Active B12, and Vitamin D3 in one daily product. EFSA-approved claims. Launching shortly. Join the waitlist for early dispatch and a founding-customer discount.',
  alternates: { canonical: 'https://andro-prime.com/supplements/daily-stack' },
  openGraph: {
    title: 'Men\'s Multivitamin: Daily Stack | Andro Prime',
    description: 'A men\'s multivitamin built around blood data: Zinc, Active B12, and Vitamin D3 in one daily product. Launching shortly. Join the waitlist.',
    url: 'https://andro-prime.com/supplements/daily-stack',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Men\'s multivitamin: Andro Prime Daily Stack' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Men\'s Multivitamin: Daily Stack | Andro Prime',
    description: 'A men\'s multivitamin built around blood data: Zinc, Active B12, and Vitamin D3 in one daily product. Launching shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const ingredients = [
  {
    name: 'Zinc',
    num: '01',
    dose: '30mg',
    claim: '"Contributes to the maintenance of normal testosterone levels."',
    why: 'Zinc supports testosterone maintenance and immune function. Most UK men do not get enough from diet alone, especially if you train hard.',
  },
  {
    name: 'Vitamin D3',
    num: '02',
    dose: '4,000 IU',
    claim: '"Contributes to normal muscle function."',
    why: 'If your blood test showed low Vitamin D, this is the dose most research supports for correction. Between October and March, sunlight alone will not get you there.',
  },
  {
    name: 'Active B12',
    num: '03',
    dose: '1,000mcg',
    doseSub: 'Methylcobalamin',
    claim: '"Contributes to normal energy-yielding metabolism."',
    why: 'Methylcobalamin is the active form your body absorbs directly. Most B12 supplements use cyanocobalamin, a cheaper synthetic form. If your Kit 2 or Kit 3 result flagged low Active B12, this addresses it directly.',
  },
]

const faqItems = [
  { q: 'When will the Daily Stack be available?', a: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { q: 'Is the Daily Stack on sale right now?', a: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { q: 'What will I get for joining the waitlist?', a: 'Early dispatch when stock arrives, and a founding-customer discount on your first order. No payment is taken to join.' },
  { q: 'Can I take this without doing a blood test first?', a: 'Yes, every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know what you actually need, and how you know it is working at retest. We always recommend testing first.' },
  { q: 'Why no iron?', a: 'Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We do not include iron in any of our supplements.' },
]

export default function DailyStackPage() {
  return (
    <>
      <JsonLd data={dailyStackSchema} />
      {/* HERO */}
      <section className="relative pt-16 pb-24 overflow-hidden bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">

          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px]">Daily Stack // Launching Shortly</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your blood test told you what is missing.<br />
              <span className="text-gray-400">This is built to fill the gaps.</span>
            </h1>

            <p className="text-xl text-black font-serif mb-12 leading-relaxed max-w-lg">
              A men&rsquo;s multivitamin built around what your blood data actually shows: Zinc, Active B12, and Vitamin D3 in one daily product. Dosed properly. No fillers. Launching shortly. Join the waitlist for early dispatch and a founding-customer discount.
            </p>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 data-label pt-6 border-t-2 border-black w-full">
              {['EFSA-Approved Claims', 'GP-Led Formulation', 'Coming Soon', 'No Pre-Order'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist form */}
          <div id="join">
            <SupplementWaitlistForm interestedInProduct="daily-stack" />
          </div>

        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="data-label flex items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-black" />
            The Reality
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-12">
            You are already supplementing.<br />
            <span className="text-gray-400">You are probably guessing.</span>
          </h2>
          <div className="space-y-8 text-2xl text-black font-serif leading-relaxed">
            <p>Most men buy supplements based on a blog post, a mate&rsquo;s recommendation, or whatever is on offer at the supermarket. They do not know what they are actually low in.</p>
            <p>They take too much of some things and not enough of others. That is money wasted on pills that are not doing anything.</p>
            <div className="pl-8 border-l-[6px] border-black py-4 bg-gray-50 mt-12">
              <p className="text-black font-serif italic font-bold">Your blood test changes that. You know exactly what is low. The Daily Stack is built around what your results showed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULATION */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <div className="data-label flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Formulation
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6 max-w-3xl">
              A men&rsquo;s multivitamin, done properly. Three active ingredients, each backed by an EFSA-approved health claim.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed max-w-2xl">
              Nothing unnecessary. No proprietary blend hiding cheap fillers. Every ingredient is here because blood data says it is the gap that matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ingredients.map(({ name, num, dose, doseSub, claim, why }) => (
              <div key={num} className="bg-white border-2 border-black p-10 flex flex-col">
                <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-black">
                  <div>
                    <h3 className="text-4xl font-sans font-black uppercase tracking-tighter text-black mb-2">{name}</h3>
                    <div className="data-label !text-white bg-black px-3 py-1.5 inline-flex">Formulation Component {num}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-sans font-black text-black block">{dose}</span>
                    {doseSub && <span className="data-label">{doseSub}</span>}
                  </div>
                </div>
                <div className="mb-10">
                  <div className="data-label text-gray-500 mb-3">EFSA Approved Claim</div>
                  <p className="text-lg font-serif italic text-black border-l-4 border-black pl-4">{claim}</p>
                </div>
                <div className="mt-auto">
                  <div className="data-label text-black mb-3">Why it is here</div>
                  <p className="text-base text-black font-serif leading-relaxed">{why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DR EWA */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="data-label flex items-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-black" />
            Clinical Oversight
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-16 max-w-2xl">
            Formulated with clinical input. Not a marketing department.
          </h2>
          <div className="p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center bg-gray-50 border-2 border-black">
            <div className="w-48 h-48 shrink-0 bg-white border-4 border-black flex items-center justify-center">
              <span className="font-sans font-black uppercase text-4xl">EL</span>
            </div>
            <div>
              <p className="text-2xl md:text-3xl text-black font-serif italic leading-relaxed mb-8 border-l-4 border-black pl-8">
                &ldquo;I reviewed this formulation against the biomarkers we test in our kits. The doses are evidence-based, the forms are bioavailable, and every claim is EFSA-approved. If your results show a deficiency, this is what I would recommend.&rdquo;
              </p>
              <div className="pl-8">
                <div className="text-xl font-sans font-black uppercase tracking-tight text-black">Dr Ewa Lindo</div>
                <div className="data-label text-gray-600 mt-1">Medical Director, GMC Registered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST CTA */}
      <section id="order" className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="data-label flex items-center justify-center gap-4 mb-6 text-center">
            <span className="w-12 h-[2px] bg-black" />
            Waitlist
            <span className="w-12 h-[2px] bg-black" />
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter mb-12 text-center">
            Be first when it ships.
          </h2>
          <p className="text-center text-lg font-serif max-w-2xl mx-auto mb-10">
            We are not taking supplement orders or payments today. Join the waitlist and we will email you the moment the Daily Stack is ready to ship. Waitlist members get early dispatch and a founding-customer discount.
          </p>
          <div className="max-w-xl mx-auto">
            <SupplementWaitlistForm interestedInProduct="daily-stack" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-16 text-center">Frequently Asked Questions</h2>
          <div className="border-t-4 border-black">
            {faqItems.map(({ q, a }) => (
              <div key={q} className="border-b-4 border-black py-8">
                <h3 className="font-sans font-black uppercase text-2xl tracking-tighter text-black mb-4">{q}</h3>
                <p className="font-serif text-xl text-black leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED READING */}
      <RelatedArticles
        slugs={['low-vitamin-d-symptoms', '14-signs-of-vitamin-d-deficiency']}
        limit={2}
        intro="What low vitamin D and B12 actually do, and why testing first beats guessing."
      />

      {/* COMPARE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl font-serif font-bold text-black mb-6">
            Dealing with joint pain or elevated inflammation too? The Joint and Recovery Collagen launches alongside the Daily Stack.
          </p>
          <Link href="/supplements/collagen" className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-base px-8 py-4 transition-all">
            Read about the Collagen
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
