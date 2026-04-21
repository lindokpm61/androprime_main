import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'

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
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/supplements/daily-stack/#product`,
      name: 'Daily Stack — Men\'s Supplement Sachet',
      description: 'Zinc, Magnesium Glycinate, Vitamin D3 and Vitamin B12 in one daily sachet. Dosed properly. EFSA-approved claims. Built around blood test data.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-SUP-01',
      offers: {
        '@type': 'Offer',
        price: '34.95',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/supplements/daily-stack`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
  ],
}

export const metadata: Metadata = {
  title: 'Daily Stack — Supplement Built for Your Blood Data',
  description: 'Zinc, Magnesium Glycinate, Vitamin D3 and B12 in one daily sachet. Dosed properly. EFSA-approved claims. £34.95/month.',
  alternates: { canonical: 'https://andro-prime.com/supplements/daily-stack' },
  openGraph: {
    title: 'Daily Stack — Supplement Built for Your Blood Data | Andro Prime',
    description: 'Zinc, Magnesium Glycinate, Vitamin D3 and B12 in one daily sachet. Dosed properly. EFSA-approved claims. £34.95/month.',
    url: 'https://andro-prime.com/supplements/daily-stack',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Daily Stack supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Stack | Andro Prime',
    description: 'Zinc, Magnesium Glycinate, Vitamin D3 and B12 in one daily sachet. EFSA-approved claims. £34.95/month.',
    images: ['/og/default.png'],
  },
}

const ingredients = [
  {
    name: 'Zinc',
    num: '01',
    dose: '30mg',
    claim: '"Contributes to the maintenance of normal testosterone levels."',
    why: 'Zinc supports testosterone maintenance and immune function. Most UK men don\'t get enough from diet alone, especially if you train hard.',
  },
  {
    name: 'Magnesium',
    num: '02',
    dose: '400mg',
    doseSub: 'Glycinate',
    claim: '"Contributes to the reduction of tiredness and fatigue."',
    why: 'The most bioavailable form of magnesium. Glycinate absorbs better and doesn\'t cause the gut issues cheaper forms do. Addresses the fatigue your results flagged.',
  },
  {
    name: 'Vitamin D3',
    num: '03',
    dose: '4,000 IU',
    claim: '"Contributes to normal muscle function."',
    why: 'If your blood test showed low vitamin D, this is the dose most research supports for correction. Between October and March, sunlight alone won\'t get you there.',
  },
  {
    name: 'Vitamin B12',
    num: '04',
    dose: '1,000mcg',
    doseSub: 'Methylcobalamin',
    claim: '"Contributes to normal energy-yielding metabolism."',
    why: 'Methylcobalamin is the active form your body actually uses. Supports energy metabolism and contributes to normal psychological function. If your Kit 3 result flagged low B12, this addresses it directly.',
  },
]

const faqItems = [
  { q: 'Can I take this without doing a blood test first?', a: 'Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know it\'s working. We\'d always recommend testing first.' },
  { q: 'When will I feel a difference?', a: 'Most men notice energy improvements within 2 to 4 weeks. Vitamin D levels take around 8 to 12 weeks to meaningfully shift. That\'s why we recommend retesting at 90 days.' },
  { q: 'Is it safe to take with other supplements?', a: 'The Daily Stack is designed to be your core supplement, not an addition to five other products. If you\'re already taking individual zinc, magnesium, or D3 supplements, switch to this instead. Don\'t double up. If you\'re on medication, check with your GP.' },
  { q: 'What form is the magnesium?', a: 'Magnesium glycinate. It\'s the most bioavailable form and the one least likely to cause stomach issues. We don\'t use magnesium oxide, which is cheaper but poorly absorbed.' },
  { q: 'Why no iron?', a: 'Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We don\'t include iron in any of our supplements.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No minimum term. No contract. Cancel from your account dashboard before your next billing date.' },
]

export default function DailyStackPage() {
  return (
    <>
      <JsonLd data={dailyStackSchema} />
      {/* HERO */}
      <section className="relative pt-16 pb-24 overflow-hidden bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px]">Backed by your blood data</span>
            </div>

            <h1 className="text-6xl md:text-[85px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your blood test told you what&rsquo;s missing.<br />
              <span className="text-gray-400">This fills the gaps.</span>
            </h1>

            <p className="text-xl text-black font-serif mb-12 leading-relaxed max-w-lg">
              Zinc, Magnesium, Vitamin D3, and B12 in one daily sachet. Dosed properly. No fillers. Built specifically for what your results showed you need.
            </p>

            <div className="flex flex-col w-full sm:w-auto gap-4 mb-8">
              <Link href="#order" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all flex items-center justify-between">
                Subscribe: £34.95/month
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <Link href="#order" className="bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all flex items-center justify-center">
                One-off purchase: £39.95
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 data-label pt-6 border-t-2 border-black w-full">
              {['EFSA-Approved Claims', 'GP-Led Formulation', 'Free Delivery', 'Cancel Anytime'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Product image placeholder */}
          <div>
            <div className="aspect-square bg-gray-100 border-4 border-black p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
              <div className="absolute top-4 left-4 border-t-4 border-l-4 border-black w-8 h-8" />
              <div className="absolute top-4 right-4 border-t-4 border-r-4 border-black w-8 h-8" />
              <div className="absolute bottom-4 left-4 border-b-4 border-l-4 border-black w-8 h-8" />
              <div className="absolute bottom-4 right-4 border-b-4 border-r-4 border-black w-8 h-8" />
              <div className="text-center bg-white border-2 border-black p-4 z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="data-label text-black block mb-1">Placeholder</span>
                <span className="font-sans font-black uppercase text-sm">Product Photography</span>
                <p className="font-serif text-xs mt-2 max-w-[200px]">Sachet shot &amp; lifestyle image required.</p>
              </div>
            </div>
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
            You&rsquo;re already supplementing.<br />
            <span className="text-gray-400">You&rsquo;re probably guessing.</span>
          </h2>
          <div className="space-y-8 text-2xl text-black font-serif leading-relaxed">
            <p>Most men buy supplements based on a blog post, a mate&rsquo;s recommendation, or whatever&rsquo;s on offer at the supermarket. They don&rsquo;t know what they&rsquo;re actually deficient in.</p>
            <p>They take too much of some things and not enough of others. That&rsquo;s money wasted on pills that aren&rsquo;t doing anything.</p>
            <div className="pl-8 border-l-[6px] border-black py-4 bg-gray-50 mt-12">
              <p className="text-black font-serif italic font-bold">Your blood test changed that. You know exactly what&rsquo;s low. The Daily Stack is built around what your results showed.</p>
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
              Four ingredients. Each one backed by an EFSA-approved health claim.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed max-w-2xl">
              Nothing unnecessary. No proprietary blend hiding cheap fillers. Every ingredient is here because your blood data said you need it.
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
                  <div className="data-label text-black mb-3">Why it&rsquo;s here</div>
                  <p className="text-base text-black font-serif leading-relaxed">{why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROUTINE */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Routine
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">
              One sachet.<br />Every morning. Done.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed">
              No pill organiser. No five different bottles cluttering your counter. One sachet with everything in it, dosed at the levels your body actually needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-[4px] bg-black -translate-y-1/2 z-0" />
            {[
              { n: '01', t: 'Subscribe', b: 'Delivered to your door every 30 days. No contract. Cancel anytime.' },
              { n: '02', t: 'Take it', b: 'One sachet with breakfast. That\'s the entire routine.' },
              { n: '03', t: 'Retest', b: 'After 90 days, retest with the same kit. See the difference in your numbers, not just how you feel.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="bg-white border-4 border-black p-10 relative z-10">
                <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-gray-100 leading-none select-none pointer-events-none -mt-4 -mr-2">{n[1]}</div>
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-sans font-black text-2xl mb-8 relative z-20">{n}</div>
                <h3 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-4 relative z-20">{t}</h3>
                <p className="text-black font-serif text-lg leading-relaxed relative z-20">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE DIFFERENCE */}
      <section className="py-32 bg-gray-900 text-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="data-label !text-white flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-white" />
                The Difference
              </div>
              <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter leading-[0.9] mb-8">
                Your blood data chose this.<br />
                <span className="text-gray-500">Not a marketing team.</span>
              </h2>
              <p className="font-serif text-xl leading-relaxed text-gray-300">
                Every supplement brand tells you their product is different. Here&rsquo;s what actually makes this one different: you already have blood data showing you need it.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-8">
              {[
                { title: 'Data-driven, not guesswork.', body: 'You took a blood test. Your results showed specific deficiencies. This product addresses those exact deficiencies. That\'s not a sales pitch. That\'s your data.' },
                { title: 'Properly dosed.', body: '400mg of magnesium glycinate, not 100mg of magnesium oxide. 4,000 IU of D3, not 400 IU. The doses that research supports, not the doses that keep manufacturing costs down.' },
                { title: 'Retest and prove it.', body: 'After 90 days, take the same blood test again. If the Daily Stack is working, your numbers will show it. If it\'s not, you\'ll know that too. No other supplement brand asks you to verify their product with a blood test.' },
              ].map(({ title, body }) => (
                <div key={title} className="border-2 border-gray-700 bg-black p-8 flex gap-6 items-start hover:border-white transition-colors">
                  <div className="w-10 h-10 shrink-0 bg-white flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-3">{title}</h3>
                    <p className="font-serif text-gray-300 text-lg leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
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
                &ldquo;I reviewed this formulation against the biomarkers we test in our kits. The doses are evidence-based, the forms are bioavailable, and every claim is EFSA-approved. If your results show a deficiency, this is what I&rsquo;d recommend.&rdquo;
              </p>
              <div className="pl-8">
                <div className="text-xl font-sans font-black uppercase tracking-tight text-black">Dr Ewa Lindo</div>
                <div className="data-label text-gray-600 mt-1">Medical Director, GMC Registered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="order" className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="data-label flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-black" />
            Pricing
            <span className="w-12 h-[2px] bg-black" />
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter mb-16">
            £34.95 a month.<br />
            <span className="text-gray-400">Less than most men spend guessing.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative overflow-hidden">

            {/* Subscription */}
            <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-50 flex flex-col relative">
              <div className="absolute top-0 right-0 bg-black text-white data-label px-4 py-2 border-b-2 border-l-2 border-black">Recommended</div>
              <h3 className="text-3xl font-sans font-black uppercase tracking-tighter mb-2 mt-4">Monthly Subscription</h3>
              <div className="flex items-baseline gap-2 mb-8 pb-8 border-b-2 border-gray-300">
                <span className="text-5xl font-sans font-black">£34.95</span>
                <span className="font-serif text-gray-500">/month</span>
              </div>
              <ul className="space-y-6 flex-grow mb-10">
                <li className="flex items-start gap-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="font-serif text-lg">Free delivery, every 30 days</span>
                </li>
                <li className="flex items-start gap-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="font-serif text-lg">Cancel anytime, no contract</span>
                </li>
                <li className="flex items-start gap-4 p-4 bg-yellow-100 border-2 border-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="font-serif text-base font-bold">Retest Offer: Subscribe and get 15% off your next blood test kit at the 90-day mark.</span>
                </li>
              </ul>
              <button className="w-full bg-black text-white hover:bg-gray-800 border-4 border-black font-sans font-black uppercase tracking-widest text-lg py-5 transition-colors">
                Select Subscription
              </button>
            </div>

            {/* One-off */}
            <div className="p-10 bg-white flex flex-col">
              <h3 className="text-3xl font-sans font-black uppercase tracking-tighter mb-2 mt-4">One-off Purchase</h3>
              <div className="flex items-baseline gap-2 mb-8 pb-8 border-b-2 border-gray-300">
                <span className="text-5xl font-sans font-black">£39.95</span>
              </div>
              <ul className="space-y-6 flex-grow mb-10">
                <li className="flex items-start gap-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="font-serif text-lg text-black">Free delivery</span>
                </li>
                <li className="flex items-start gap-4 text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-0.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  <span className="font-serif text-lg">No retest discount</span>
                </li>
              </ul>
              <button className="w-full bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-lg py-5 transition-colors">
                Add to Cart
              </button>
            </div>

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

      {/* BOTTOM CTA */}
      <section className="py-40 bg-white overflow-hidden border-b-4 border-black text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-[90px] font-sans font-black uppercase tracking-tighter text-black leading-[0.85] mb-10">
            Your blood told you what&rsquo;s missing.<br />
            <span className="text-gray-400">Stop guessing. Sort it.</span>
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-2xl mx-auto leading-relaxed">
            One sachet. Every morning. Dosed for what your body actually needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <Link href="#order" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-12 py-6 transition-all flex items-center justify-center gap-4">
              Subscribe: £34.95/month
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <Link href="#order" className="bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-12 py-6 transition-all">
              One-off: £39.95
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4 data-label text-gray-600">
            <span>Free delivery</span>
            <span className="w-1.5 h-1.5 bg-black" />
            <span>Cancel anytime</span>
            <span className="w-1.5 h-1.5 bg-black" />
            <span>Retest at 90 days</span>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl font-serif font-bold text-black mb-6">
            Dealing with joint pain or elevated inflammation too? The Collagen works alongside the Daily Stack.
          </p>
          <Link href="/supplements/collagen" className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-base px-8 py-4 transition-all">
            View Joint &amp; Recovery Collagen
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
