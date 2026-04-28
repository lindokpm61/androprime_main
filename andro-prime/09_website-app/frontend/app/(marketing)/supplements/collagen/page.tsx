import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

const collagenSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${BASE_URL}/supplements` },
        { '@type': 'ListItem', position: 3, name: 'Joint & Recovery Collagen', item: `${BASE_URL}/supplements/collagen` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/supplements/collagen/#product`,
      name: 'Joint & Recovery Collagen — Men\'s Supplement',
      description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Built for active men whose blood data confirmed elevated hs-CRP. Only recommended when hs-CRP and joint symptoms are both present.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-SUP-02',
      offers: {
        '@type': 'Offer',
        price: '29.95',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/supplements/collagen`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
  ],
}

export const metadata: Metadata = {
  title: 'Joint & Recovery Collagen — Backed by Your Blood Data',
  description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Built for active men whose blood data confirmed elevated hs-CRP. £29.95/month.',
  alternates: { canonical: 'https://andro-prime.com/supplements/collagen' },
  openGraph: {
    title: 'Joint & Recovery Collagen | Andro Prime',
    description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Built for active men whose blood data confirmed elevated hs-CRP. £29.95/month.',
    url: 'https://andro-prime.com/supplements/collagen',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Joint & Recovery Collagen supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joint & Recovery Collagen | Andro Prime',
    description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. £29.95/month.',
    images: ['/og/default.png'],
  },
}

const ingredients = [
  {
    name: 'Hydrolysed Bovine Collagen Peptides (Type I & III)',
    dose: '10g',
    why: 'The building blocks your joints, tendons, and connective tissue are made from. Hydrolysed for absorption. 10g is the researched dose, not the 2–3g you get in most capsule products.',
  },
  {
    name: 'UC-II Undenatured Type II Collagen',
    dose: '40mg',
    why: 'A different form of collagen to standard hydrolysed peptides. UC-II is undenatured Type II collagen, the form found in joint cartilage. 40mg is the researched dose.',
  },
  {
    name: 'Vitamin C',
    dose: '80mg',
    claim: 'Contributes to normal collagen formation for the normal function of cartilage.',
    why: 'Your body can\'t make collagen without vitamin C. This isn\'t an optional add-on. It\'s the ingredient that makes the collagen in this product actually useful.',
  },
  {
    name: 'MSM',
    dose: '500mg',
    why: 'Supports joint comfort and mobility. Works alongside collagen to support your recovery.',
  },
]

const faqItems = [
  { q: 'Can I take this without doing a blood test first?', a: 'Yes. Every ingredient is safe for healthy adults at these doses. But collagen products are most effective when you know you have confirmed inflammation. The blood test tells you whether this is the right product for you, or whether your joint issues have a different cause.' },
  { q: 'When will I notice a difference?', a: 'Most men report improved joint comfort within 4 to 6 weeks. Measurable changes in hs-CRP typically take 8 to 12 weeks. That\'s why we recommend retesting at 90 days.' },
  { q: 'Can I take this alongside the Daily Stack?', a: 'Yes. They\'re designed to work together. The Daily Stack covers your energy and recovery basics (Zinc, Active B12, Vitamin D3). The Collagen focuses on connective tissue and joint comfort support. No ingredient overlap.' },
  { q: 'What does it taste like?', a: 'Nothing. It\'s unflavoured. Mix it into coffee, a shake, water, or anything else. It dissolves fully and doesn\'t change the taste.' },
  { q: 'Why not just take glucosamine?', a: 'You can. But glucosamine doesn\'t address the collagen and vitamin C pathway, and it doesn\'t contain UC-II or MSM. This formulation covers joint support from multiple angles, not just one.' },
  { q: 'What if my hs-CRP is above 10?', a: 'If your hs-CRP is above 10 mg/L, we won\'t recommend a supplement. That level of inflammation needs a GP. Your results report will say this clearly and provide a GP referral template.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No minimum term. No contract. Cancel from your account dashboard before your next billing date.' },
]

export default function CollagenPage() {
  return (
    <>
      <JsonLd data={collagenSchema} />
      {/* HERO */}
      <section className="pt-40 pb-24 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-12 h-[2px] bg-black" />
              Backed by your blood data
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your inflammation marker is elevated.<br />
              <span className="text-gray-400">Your joints already knew.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              10g hydrolysed collagen peptides, UC-II for joint-specific support, Vitamin C, and MSM. Built for active men whose blood data confirmed what their knees have been telling them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Link href="#pricing" className="bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all flex items-center justify-center">
                Subscribe: £29.95/month
              </Link>
              <Link href="#pricing" className="bg-white hover:bg-gray-100 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all flex items-center justify-center">
                One-off purchase: £34.95
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 data-label border-t-2 border-black pt-6 w-full">
              {['UKAS ISO 15189 Accredited Lab', 'EFSA-Approved Claims', 'GP-Led Formulation', 'Free Delivery', 'Cancel Anytime'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Product image placeholder */}
          <div className="lg:col-span-5 bg-gray-50 border-2 border-black aspect-square relative flex flex-col items-center justify-center p-12 text-center w-full">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="w-32 h-32 border-4 border-black bg-white flex items-center justify-center mb-6 relative z-10">
              <span className="font-sans font-black uppercase text-4xl">10g</span>
            </div>
            <h3 className="font-sans font-black uppercase tracking-tighter text-2xl mb-2 relative z-10">Product Photography Placeholder</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 relative z-10 border-t-2 border-gray-300 pt-4 mt-2">Required: Tub shot &amp; Scoop in shake</p>
          </div>

        </div>
      </section>

      {/* THE REALITY */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="data-label flex justify-center items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-black" />
            The Reality
            <span className="w-12 h-[2px] bg-black" />
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">
            Your joints are slowing you down and rest isn&rsquo;t fixing it.
          </h2>
          <div className="space-y-6 text-xl md:text-2xl font-serif leading-relaxed text-black">
            <p>You&rsquo;re stiff in the morning. Your knees ache after every session. Recovery takes longer than it used to, and the soreness hangs around for days.</p>
            <p>You&rsquo;re not injured. You&rsquo;re dealing with low-grade inflammation that your body can&rsquo;t clear on its own.</p>
            <div className="bg-black text-white p-8 mt-10 text-left border-4 border-black font-sans font-black text-2xl uppercase tracking-tighter leading-tight">
              Your blood test confirmed it. Your hs-CRP marker is elevated, which means your body is in a constant state of repair it can&rsquo;t keep up with.
            </div>
          </div>
        </div>
      </section>

      {/* FORMULATION */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <div className="data-label flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Formulation
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter max-w-3xl leading-[0.95] mb-6">
              Targeted joint and recovery support. Not a generic collagen powder.
            </h2>
            <p className="text-xl font-serif max-w-2xl">Every ingredient is here because it directly supports connective tissue, joint comfort, and recovery in men with confirmed inflammation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ingredients.map(({ name, dose, claim, why }) => (
              <div key={name} className="bg-white border-2 border-black border-l-[16px] border-l-black p-8 md:p-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8 gap-4 border-b-2 border-black pb-8">
                  <h3 className="text-3xl font-sans font-black uppercase tracking-tighter leading-none">{name}</h3>
                  <span className="text-4xl font-sans font-black shrink-0">{dose}</span>
                </div>
                {claim && (
                  <div className="mb-8 flex items-start gap-4 border-l-4 border-black pl-4">
                    <div className="data-label text-black mt-1 shrink-0">EFSA Claim:</div>
                    <p className="font-serif text-base italic leading-snug">{claim}</p>
                  </div>
                )}
                <div className="mt-auto">
                  <div className="data-label mb-3">Why it&rsquo;s here:</div>
                  <p className="font-serif text-lg leading-relaxed">{why}</p>
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
            <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-6 leading-[0.9]">One scoop. Every morning. Mix it in anything.</h2>
            <p className="text-xl font-serif leading-relaxed">Unflavoured powder. Add it to your coffee, protein shake, or water. No taste. No fuss. One tub lasts 30 days.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[4px] bg-black -translate-y-1/2 z-0" />
            {[
              { n: '01', t: 'Subscribe', b: 'Delivered to your door every 30 days. No contract. Cancel anytime.', dark: false },
              { n: '02', t: 'Take It', b: 'One scoop (15g) mixed into any drink. Morning is best.', dark: false },
              { n: '03', t: 'Retest', b: 'After 90 days, retest with the same kit. Your hs-CRP marker will show whether inflammation has improved. Real data, not guesswork.', dark: true },
            ].map(({ n, t, b, dark }) => (
              <div key={n} className={`border-2 border-black p-10 relative z-10 ${dark ? 'bg-black border-4 border-black text-white' : 'bg-white'}`}>
                <div className={`absolute top-0 right-0 p-4 text-[120px] font-sans font-black leading-none select-none pointer-events-none -mt-4 -mr-4 ${dark ? 'text-gray-900' : 'text-gray-100'}`}>{n[1]}</div>
                <div className={`w-16 h-16 border-4 flex items-center justify-center font-sans font-black text-2xl mb-8 relative z-20 ${dark ? 'border-white text-black bg-white' : 'border-black text-black bg-white'}`}>{n}</div>
                <h3 className={`text-3xl font-sans font-black uppercase tracking-tighter mb-4 relative z-20 ${dark ? 'text-white' : ''}`}>{t}</h3>
                <p className={`font-serif text-lg leading-relaxed relative z-20 ${dark ? 'text-gray-300' : ''}`}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE DIFFERENCE */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                The Difference
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.9] mb-8">
                You have blood data that says you need this. That changes everything.
              </h2>
              <p className="text-xl font-serif leading-relaxed text-gray-600 mb-12">
                There are hundreds of collagen products on the market. Most are bought on a whim. This one is different because you already know your inflammation marker is elevated. You&rsquo;re not hoping this helps. You&rsquo;re addressing a confirmed result.
              </p>
            </div>

            <div className="space-y-12">
              {[
                { title: 'Confirmed inflammation, not a guess.', body: 'Your hs-CRP marker came back elevated. You reported joint symptoms. This product is recommended based on both. That\'s a more precise starting point than any collagen brand can offer.' },
                { title: '10g of collagen, not 2g.', body: 'Most capsule collagen products contain 2–3g per serving. The research uses 10g. We use 10g. Powder format makes this possible without swallowing 15 capsules a day.' },
                { title: 'Retest and prove it.', body: 'At 90 days, take the same blood test. If your hs-CRP has improved, the product is working. If not, you\'ll know to dig deeper with your GP. No other collagen brand asks you to verify their product works.' },
              ].map(({ title, body }) => (
                <div key={title} className="border-l-[8px] border-black pl-8">
                  <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">{title}</h3>
                  <p className="font-serif text-lg leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DR EWA */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              Clinical Oversight
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-6 leading-[0.9]">Recommended based on your results. Reviewed by a real doctor.</h2>
          </div>

          <div className="bg-white border-2 border-black p-10 md:p-16">
            <p className="font-serif text-2xl md:text-3xl leading-relaxed italic mb-12 pt-8 border-b-2 border-gray-100 pb-12 text-black">
              &ldquo;I only recommend this product for men whose blood data shows elevated hs-CRP and who report joint symptoms. That qualifier matters. Elevated CRP alone could indicate many things. Combined with joint complaints in active men, collagen and vitamin C supplementation is a reasonable, evidence-based starting point.&rdquo;
            </p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 border-4 border-black flex items-center justify-center font-sans font-black text-xl uppercase tracking-tighter bg-gray-100 shrink-0">EL</div>
              <div>
                <div className="font-sans font-black uppercase text-xl tracking-tighter mb-1">Dr Ewa Lindo</div>
                <div className="data-label text-gray-500">Medical Director, GMC Registered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="data-label flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-black" />
            Built For
            <span className="w-12 h-[2px] bg-black" />
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-center max-w-4xl mx-auto leading-[0.9] mb-20">
            Active men whose joints have started fighting back.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
            {[
              'The man whose knees ache after every leg session and it takes three days to recover.',
              'The man who\'s stiff every morning and needs 20 minutes to loosen up.',
              'The man whose hs-CRP came back elevated and whose joints have been complaining for months.',
              'The man who\'s tried glucosamine, fish oil, and turmeric and is still sore.',
            ].map((text, i) => (
              <div key={i} className="border-4 border-black p-8 bg-white flex flex-col md:flex-row items-start gap-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 shrink-0 border-4 border-black bg-black text-white flex items-center justify-center font-sans font-black text-xl">{i + 1}</div>
                <p className="font-serif text-xl leading-relaxed text-black mt-1">{text}</p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-2xl mx-auto bg-black text-white p-8 border-4 border-black">
            <p className="font-sans font-black uppercase text-2xl tracking-tighter leading-tight">If your blood test flagged inflammation and your joints agree, this was built for you.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              Pricing
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.9]">
              £29.95 a month. Less than a physio session.
            </h2>
          </div>

          <div className="overflow-x-auto border-4 border-black bg-white mb-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-black text-white font-sans font-black uppercase tracking-widest text-xs md:text-sm">
                  <th className="p-6 border-b-4 border-r-4 border-gray-800 w-1/4" />
                  <th className="p-6 border-b-4 border-r-4 border-gray-800 w-3/8 text-center bg-gray-900">Monthly Subscription</th>
                  <th className="p-6 border-b-4 border-gray-800 w-3/8 text-center text-gray-400">One-off</th>
                </tr>
              </thead>
              <tbody className="font-serif text-lg">
                {[
                  { label: 'Price', sub: <><span className="font-bold text-2xl">£29.95</span><span className="text-sm font-normal text-gray-500">/mo</span></>, one: <span className="text-gray-500 font-bold text-2xl">£34.95</span> },
                  { label: 'Delivery', sub: 'Free, every 30 days', one: <span className="text-gray-500">Free</span> },
                  { label: 'Cancel', sub: <span className="font-bold">Anytime, no contract</span>, one: <span className="text-gray-500">N/A</span> },
                ].map(({ label, sub, one }) => (
                  <tr key={label}>
                    <td className="p-6 border-b-2 border-r-4 border-black font-sans font-black uppercase tracking-tighter bg-gray-100">{label}</td>
                    <td className="p-6 border-b-2 border-r-4 border-black text-center">{sub}</td>
                    <td className="p-6 border-b-2 border-black text-center">{one}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-4 border-black bg-white p-8">
              <div className="data-label text-black mb-4">Bundle Offer</div>
              <h3 className="font-sans font-black uppercase text-2xl tracking-tighter mb-4">Complete Men&rsquo;s Stack</h3>
              <p className="font-serif text-lg mb-6 leading-relaxed">Taking the Daily Stack too? Bundle both for <span className="font-bold">£54.95/month</span> (save £10/month vs buying separately).</p>
            </div>

            <div className="border-4 border-black bg-white p-8">
              <div className="data-label text-black mb-4">Retest Offer</div>
              <h3 className="font-sans font-black uppercase text-2xl tracking-tighter mb-4">15% Off Your Next Kit</h3>
              <p className="font-serif text-lg leading-relaxed">Subscribe to the Joint &amp; Recovery Collagen and get a 15% discount on your next blood test kit at the 90-day mark.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="data-label flex items-center justify-center gap-4 mb-16">
            <span className="w-12 h-[2px] bg-black" />
            FAQs
            <span className="w-12 h-[2px] bg-black" />
          </div>
          <div className="space-y-6">
            {faqItems.map(({ q, a }) => (
              <div key={q} className={`border-4 border-black bg-white p-8 md:p-10 ${q === 'What if my hs-CRP is above 10?' ? 'border-l-[16px] border-l-red-600' : ''}`}>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4">{q}</h3>
                <p className="font-serif text-lg leading-relaxed text-black">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-40 bg-white overflow-hidden border-b-4 border-black text-center relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-[80px] font-sans font-black uppercase tracking-tighter text-black leading-[0.9] mb-10">
            Your blood confirmed the inflammation.<br />
            <span className="text-gray-400">Your joints already knew. Now sort it.</span>
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-3xl mx-auto leading-relaxed">
            One scoop. Every morning. Backed by your data. Verified by a retest.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link href="#pricing" className="w-full sm:w-auto bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-12 py-6 transition-all flex items-center justify-center">
              Subscribe: £29.95/month
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-lg px-12 py-6 transition-all flex items-center justify-center">
              One-off purchase: £34.95
            </Link>
          </div>
          <div className="data-label text-black flex items-center justify-center gap-4 flex-wrap">
            <span>Free delivery.</span>
            <span className="w-1 h-1 bg-black" />
            <span>Cancel anytime.</span>
            <span className="w-1 h-1 bg-black" />
            <span>Retest at 90 days.</span>
          </div>
        </div>
      </section>
    </>
  )
}
