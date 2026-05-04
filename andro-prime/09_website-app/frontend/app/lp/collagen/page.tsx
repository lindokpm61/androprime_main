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
        { '@type': 'ListItem', position: 2, name: 'Joint & Recovery Collagen', item: `${BASE_URL}/lp/collagen` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/lp/collagen/#product`,
      name: 'Joint & Recovery Collagen — Men\'s Supplement',
      description: 'Type I hydrolysed marine collagen peptides for joint mobility, tendon recovery, and skin elasticity. 10g per serving. EFSA-compliant. £29.95/month. Cancel anytime.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-SUP-02',
      offers: {
        '@type': 'Offer',
        price: '29.95',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/collagen`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'When will I notice a difference?',
          acceptedAnswer: { '@type': 'Answer', text: 'Joint comfort improvements are typically noticed within 4 to 6 weeks of consistent daily use. Skin elasticity changes take longer — most clinical studies report visible results between 8 and 12 weeks.' },
        },
        {
          '@type': 'Question',
          name: 'What type of collagen is this?',
          acceptedAnswer: { '@type': 'Answer', text: 'Type I hydrolysed marine collagen peptides. Type I makes up approximately 90% of the collagen in your skin, tendons, ligaments, and bones. Marine-sourced collagen has a lower molecular weight than bovine collagen, which means higher bioavailability.' },
        },
        {
          '@type': 'Question',
          name: 'How do I take it?',
          acceptedAnswer: { '@type': 'Answer', text: 'One scoop (10g) mixed into water, coffee, or a protein shake. It dissolves completely with no taste. Take it at any time of day, consistently.' },
        },
        {
          '@type': 'Question',
          name: 'Can I take this alongside the Daily Stack?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. There is no overlap in ingredients. Collagen Pro provides structural protein for joints and connective tissue. The Daily Stack covers micronutrient optimisation. They complement each other.' },
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
  title: 'Collagen Pro | Marine Collagen Powder | Andro Prime',
  description: 'Type I marine collagen peptides for joint mobility, tendon recovery, and skin elasticity. 10g hydrolysed marine collagen per serving. EFSA-compliant. £29.95/month.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Collagen Pro | Marine Collagen Powder | Andro Prime',
    description: '10g hydrolysed marine collagen per serving. EFSA-compliant. Built for active men. £29.95/month.',
    url: 'https://andro-prime.com/lp/collagen',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Collagen Pro supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collagen Pro | £29.95/mo | Andro Prime',
    description: '10g hydrolysed marine collagen per serving. EFSA-compliant. £29.95/month. Cancel anytime.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  { question: 'When will I notice a difference?', answer: 'Joint comfort improvements are typically noticed within 4 to 6 weeks of consistent daily use. Skin elasticity changes take longer. Most clinical studies report visible results between 8 and 12 weeks.' },
  { question: 'What type of collagen is this?', answer: 'Type I hydrolysed marine collagen peptides. Type I makes up approximately 90% of the collagen in your skin, tendons, ligaments, and bones. Marine-sourced collagen has a lower molecular weight than bovine collagen, which means higher bioavailability.' },
  { question: 'How do I take it?', answer: 'One scoop (10g) mixed into water, coffee, or a protein shake. It dissolves completely with no taste. Take it at any time of day, consistently.' },
  { question: 'Is there any taste?', answer: 'No. Collagen Pro is unflavoured and dissolves completely. Most men add it to their morning coffee or plain water without noticing it.' },
  { question: 'Can I take this alongside the Daily Stack?', answer: 'Yes. There is no overlap in ingredients. Collagen Pro provides structural protein for joints and connective tissue. The Daily Stack covers micronutrient optimisation. They complement each other.' },
  { question: 'Can I cancel anytime?', answer: 'Yes. No minimum term. No contract. Cancel from your account dashboard before your next billing date.' },
]

const CheckSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
)

export default function CollagenLpPage() {
  return (
    <>
      <JsonLd data={lpSchema} />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black text-white mb-8 border-2 border-black">
              Supplement // Collagen Pro
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your joints aren&rsquo;t ageing.<br />
              <span className="text-gray-400">They&rsquo;re starving.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              After 30, your body produces less collagen every year. Joints stiffen. Tendons weaken. Recovery slows. Collagen Pro delivers 10g of Type I hydrolysed marine collagen peptides per serving, the dose and form shown to support joint, tendon, and skin health.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Subscribe &mdash; £29.95/mo
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">Cancel anytime. Free delivery.</span>
            </div>
          </div>

          {/* Product card */}
          <div className="lg:col-span-5">
            <div className="border-4 border-black p-10 bg-white relative">
              <div className="data-label mb-4 bg-black text-white px-3 py-1.5 inline-block">Formulation</div>
              <h2 className="text-4xl font-sans font-black uppercase tracking-tighter mb-8">Collagen Pro</h2>

              <div className="border-t-4 border-black pt-8">
                <div className="border-b-2 border-black pb-6 mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-sans font-black uppercase tracking-tighter text-xl">Type I Marine Collagen</h3>
                    <span className="font-mono font-black text-lg">10g</span>
                  </div>
                  <p className="font-serif text-sm text-gray-600 italic mb-2">&ldquo;Hydrolysed peptides for bioavailability&rdquo;</p>
                  <span className="data-label border border-black px-2 py-0.5 !text-[10px]">Per Serving</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Source', value: 'Wild-caught marine fish (skins & scales)' },
                    { label: 'Molecular Weight', value: '<3,000 Daltons: high absorption' },
                    { label: 'Additives', value: 'None. Unflavoured. No sweeteners.' },
                    { label: 'Serving', value: '1 scoop daily, any time' },
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
              <p>After 30, collagen synthesis drops by roughly 1% per year. By 50, you&rsquo;ve lost up to 20% of the collagen that supports your joints, tendons, and skin.</p>
              <p>This isn&rsquo;t something you feel gradually. It hits suddenly: a shoulder that doesn&rsquo;t recover. A knee that starts clicking. Skin that looks tired no matter how much you sleep.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  You can&rsquo;t eat enough collagen through food. Supplementation is the only practical way to restore what your body has lost.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">What It Supports</h3>
            </div>
            <div className="space-y-4">
              {[
                { marker: 'Joint Mobility', body: 'Hydrolysed peptides accumulate in cartilage, supporting joint comfort and reducing stiffness during physical activity.' },
                { marker: 'Tendon Recovery', body: 'Type I collagen is the primary structural protein in tendons and ligaments. Supplementation supports repair after training.' },
                { marker: 'Skin Elasticity', body: 'Clinical studies show 10g of hydrolysed collagen daily improves skin elasticity and hydration within 8-12 weeks.' },
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
                  <strong className="font-sans font-black uppercase text-base tracking-tight text-white">Bone Density.</strong> Type I collagen provides the organic framework of bone. Maintaining collagen intake supports bone mineral density alongside calcium and Vitamin D.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionEyebrow label="Built For" centered />
            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-tight">This isn&rsquo;t a beauty product. It&rsquo;s structural maintenance.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { title: "The man whose joints crack every morning", body: 'and take 20 minutes to loosen up.' },
              { title: "The man who trains consistently", body: 'but takes twice as long to recover as he used to.' },
              { title: "The man who's noticed his skin looks tired", body: 'no matter how much sleep he gets.' },
              { title: "The man over 40 who wants to stay active", body: 'without joint pain dictating what he can and can\'t do.' },
            ].map(({ title, body }) => (
              <div key={title} className="border-2 border-black p-8 bg-white flex items-start gap-4">
                <div className="w-3 h-3 bg-black mt-2 shrink-0" />
                <p className="font-serif text-xl leading-relaxed">
                  <strong className="font-sans font-black uppercase text-lg tracking-tight block mb-1">{title}</strong>{body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="font-serif text-xl mb-8">If that sounds familiar, Collagen Pro was built for you.</p>
            <a href="#order" className="inline-flex bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all items-center justify-center gap-3">
              Subscribe &mdash; £29.95/mo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
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
                &ldquo;I started taking collagen at 39 when my shoulder wouldn&rsquo;t recover. Within 6 weeks, I could train again without pain. I don&rsquo;t know why it took me so long to try it.&rdquo;
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
                &ldquo;10g of hydrolysed Type I collagen is the clinically studied dose. We use marine-sourced peptides with a low molecular weight for maximum bioavailability. No fillers, no additives.&rdquo;
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

      {/* FAQ + ORDER */}
      <section className="py-32 bg-white border-t-4 border-black" id="order">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <SectionEyebrow label="Common Questions" />
              <FaqAccordion items={faqItems} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="border-4 border-black bg-black text-white p-10 md:p-12 relative overflow-hidden">
                <div className="data-label bg-white text-black px-4 py-2 inline-block border-2 border-black mb-8">Subscribe &amp; Save</div>

                <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-2">Collagen Pro</h2>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl font-mono font-black tracking-tighter">£29.95</span>
                  <span className="text-xl font-serif text-gray-400">/mo</span>
                </div>

                <p className="font-serif text-base text-gray-300 mb-8 pb-8 border-b-2 border-gray-800">30 servings per pouch. Free monthly delivery. Cancel anytime.</p>

                <div className="space-y-4 mb-10">
                  {[
                    '10g Type I hydrolysed marine collagen',
                    '<3,000 Dalton molecular weight',
                    'Unflavoured, dissolves completely',
                    'No fillers, sweeteners, or additives',
                    'Free monthly delivery',
                    'Cancel anytime, no contract',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4 text-sm font-serif">
                      <CheckSvg />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <SubscribeButton productSlug="collagen" className="block w-full text-center bg-white text-black hover:bg-gray-200 border-4 border-white font-sans font-black uppercase tracking-widest text-lg px-8 py-5 transition-colors mb-6 disabled:opacity-50">
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
