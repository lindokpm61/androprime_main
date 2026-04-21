import type { Metadata } from 'next'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { SubscribeButton } from '@/components/commerce/SubscribeButton'
import { JsonLd } from '@/components/shared/JsonLd'

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
      '@type': 'Product',
      '@id': `${BASE_URL}/lp/daily-stack/#product`,
      name: 'Daily Stack — Men\'s Supplement Sachet',
      description: 'The four supplements most men over 35 are missing — in one daily sachet. Zinc, Magnesium Glycinate, Vitamin D3, and B12. EFSA-approved claims. £34.95/month. Cancel anytime.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-SUP-01',
      offers: {
        '@type': 'Offer',
        price: '34.95',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/daily-stack`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I take this without doing a blood test first?',
          acceptedAnswer: { '@type': 'Answer', text: "Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know it's working. We'd always recommend testing first." },
        },
        {
          '@type': 'Question',
          name: 'When will I feel a difference?',
          acceptedAnswer: { '@type': 'Answer', text: "Most men notice energy and sleep improvements within 2 to 4 weeks. Vitamin D levels take around 8 to 12 weeks to meaningfully shift. That's why we recommend retesting at 90 days." },
        },
        {
          '@type': 'Question',
          name: 'Is it safe to take with other supplements?',
          acceptedAnswer: { '@type': 'Answer', text: "The Daily Stack is designed to be your core supplement, not an addition to five other products. If you're already taking individual zinc, magnesium, or D3, switch to this instead. Don't double up. If you're on medication, check with your GP." },
        },
        {
          '@type': 'Question',
          name: 'What form is the magnesium?',
          acceptedAnswer: { '@type': 'Answer', text: "Magnesium glycinate. It's the most bioavailable form and the one least likely to cause stomach issues. We don't use magnesium oxide, which is cheaper but poorly absorbed." },
        },
        {
          '@type': 'Question',
          name: 'Why no iron?',
          acceptedAnswer: { '@type': 'Answer', text: "Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We don't include iron in any of our supplements." },
        },
        {
          '@type': 'Question',
          name: 'Can I cancel anytime?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. No minimum term. No contract. Cancel from your account dashboard before your next billing date.' },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Daily Stack | Zinc, Magnesium, D3, B12 Supplement | Andro Prime',
  description: 'The four supplements most men over 35 are missing — in one daily sachet. Zinc, Magnesium Glycinate, Vitamin D3, and B12. EFSA-approved claims. £34.95/month. Cancel anytime.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Daily Stack | Zinc, Magnesium, D3, B12 | Andro Prime',
    description: 'The four supplements most men over 35 are missing — in one daily sachet. Zinc, Magnesium Glycinate, Vitamin D3, and B12. £34.95/month. Cancel anytime.',
    url: 'https://andro-prime.com/lp/daily-stack',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Daily Stack supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Stack | £34.95/mo | Andro Prime',
    description: 'Zinc, Magnesium Glycinate, Vitamin D3, and B12 in one daily sachet. EFSA-approved claims. Cancel anytime.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  { question: 'Can I take this without doing a blood test first?', answer: "Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know it's working. We'd always recommend testing first." },
  { question: 'When will I feel a difference?', answer: "Most men notice energy and sleep improvements within 2 to 4 weeks. Vitamin D levels take around 8 to 12 weeks to meaningfully shift. That's why we recommend retesting at 90 days." },
  { question: 'Is it safe to take with other supplements?', answer: "The Daily Stack is designed to be your core supplement, not an addition to five other products. If you're already taking individual zinc, magnesium, or D3, switch to this instead. Don't double up. If you're on medication, check with your GP." },
  { question: 'What form is the magnesium?', answer: "Magnesium glycinate. It's the most bioavailable form and the one least likely to cause stomach issues. We don't use magnesium oxide, which is cheaper but poorly absorbed." },
  { question: 'Why no iron?', answer: "Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We don't include iron in any of our supplements." },
  { question: 'Can I cancel anytime?', answer: 'Yes. No minimum term. No contract. Cancel from your account dashboard before your next billing date.' },
]

const CheckSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 text-white mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
)

export default function DailyStackLpPage() {
  return (
    <>
      <JsonLd data={lpSchema} />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black text-white mb-8 border-2 border-black">
              Supplement // Daily Stack
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Stop guessing which supplements you need.
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              The four things most men over 35 are genuinely low in &mdash; in one daily sachet. Zinc, Magnesium, D3, and B12. Each at the dose that actually moves the needle. Each backed by EFSA-approved health claims.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Subscribe &mdash; £34.95/mo
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">Cancel anytime. Free delivery.</span>
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
                  { name: 'Magnesium Glycinate', dose: '400mg', claim: 'Contributes to the reduction of tiredness and fatigue', tag: 'EFSA Claim' },
                  { name: 'Vitamin D3', dose: '4,000 IU', claim: 'Contributes to normal muscle function', tag: 'EFSA Claim' },
                  { name: 'Vitamin B12', dose: '1,000mcg', claim: 'Contributes to normal energy-yielding metabolism', tag: 'EFSA Claim' },
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
              <p>You&rsquo;re taking five different pills from three different brands that some influencer recommended. You don&rsquo;t know the doses. You don&rsquo;t know if they&rsquo;re working. You don&rsquo;t know if you need them.</p>
              <p>We built this stack differently. It contains the four supplements most commonly flagged as low in our blood test data &mdash; at the doses backed by EFSA-approved health claims.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  This isn&rsquo;t a random multivitamin. It&rsquo;s what your blood test would actually recommend.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">Why These Four</h3>
            </div>
            <div className="space-y-4">
              {[
                { marker: 'Zinc (30mg)', body: 'Most men in the UK are borderline deficient. Zinc is critical for testosterone production and immune function.' },
                { marker: 'Magnesium Glycinate (400mg)', body: 'Depleted rapidly by training and stress. The glycinate form absorbs properly, unlike the cheap oxide found in most brands.' },
                { marker: 'Vitamin D3 (4,000 IU)', body: 'Over 40% of UK adults are deficient in winter. Drives testosterone synthesis, bone density, and immunity.' },
                { marker: 'Vitamin B12 (1,000mcg)', body: 'Essential for energy metabolism and nerve function. Particularly important for men over 40, when absorption starts declining.' },
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
                <p className="font-serif text-2xl leading-relaxed italic mb-12">&ldquo;I was spending £60/month on five different bottles. Then I got my blood tested and found out I was actually low in just two things. That&rsquo;s when I decided we needed to build something better.&rdquo;</p>
              </div>
              <div>
                <div className="font-sans font-black uppercase tracking-tighter text-2xl">Keith Antony</div>
                <div className="data-label mt-2">Founder, Andro Prime</div>
              </div>
            </div>

            <div className="p-12 bg-white flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="data-label border-2 border-black inline-block px-3 py-1 mb-8 bg-black text-white">Clinical Oversight</div>
                <p className="font-serif text-2xl leading-relaxed italic mb-12">&ldquo;Every ingredient in this formulation has a specific, evidence-based reason for being included at its specific dose. We don&rsquo;t add ingredients for marketing purposes.&rdquo;</p>
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

      {/* FAQ + ORDER */}
      <section className="py-32 bg-white" id="order">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <SectionEyebrow label="Common Questions" />
              <FaqAccordion items={faqItems} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="border-4 border-black bg-black text-white p-10 md:p-12 relative overflow-hidden">
                <div className="data-label bg-white text-black px-4 py-2 inline-block border-2 border-black mb-8">Subscribe &amp; Save</div>

                <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-2">Daily Stack</h2>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl font-mono font-black tracking-tighter">£34.95</span>
                  <span className="text-xl font-serif text-gray-400">/mo</span>
                </div>

                <p className="font-serif text-base text-gray-300 mb-8 pb-8 border-b-2 border-gray-800">Subscription includes free delivery and cancel-anytime flexibility.</p>

                <div className="space-y-4 mb-10">
                  {[
                    'Zinc 30mg (EFSA claim)',
                    'Magnesium Glycinate 400mg (EFSA claim)',
                    'Vitamin D3 4,000 IU (EFSA claim)',
                    'Vitamin B12 1,000mcg (EFSA claim)',
                    'Free delivery, cancel anytime',
                    '15% off 90-day retest kit',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4 text-sm font-serif">
                      <CheckSvg />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <SubscribeButton productSlug="daily-stack" className="block w-full text-center bg-white text-black hover:bg-gray-200 border-4 border-white font-sans font-black uppercase tracking-widest text-lg px-8 py-5 transition-colors mb-6 disabled:opacity-50">
                  Subscribe Now
                </SubscribeButton>

                <div className="flex items-center justify-center gap-2 data-label !text-gray-400 !text-[10px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Secure checkout. Cancel anytime.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
