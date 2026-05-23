import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

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
  ],
}

export const metadata: Metadata = {
  title: 'Joint & Recovery Collagen, Launching Shortly | Andro Prime',
  description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Built for active men with confirmed elevated hs-CRP and joint symptoms. Launching shortly. Join the waitlist.',
  alternates: { canonical: 'https://andro-prime.com/supplements/collagen' },
  openGraph: {
    title: 'Joint & Recovery Collagen Launching Shortly | Andro Prime',
    description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Launching shortly. Join the waitlist.',
    url: 'https://andro-prime.com/supplements/collagen',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Joint & Recovery Collagen supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joint & Recovery Collagen | Andro Prime',
    description: '10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Launching shortly.',
    images: ['/og/default.png'],
  },
}

const ingredients = [
  {
    name: 'Hydrolysed Bovine Collagen Peptides (Type I & III)',
    dose: '10g',
    why: 'The building blocks your joints, tendons, and connective tissue are made from. Hydrolysed for absorption. 10g is the researched dose, not the 2 to 3g you get in most capsule products.',
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
    why: 'Your body cannot make collagen without vitamin C. This is not an optional add-on. It is the ingredient that makes the collagen in this product actually useful.',
  },
  {
    name: 'MSM',
    dose: '500mg',
    why: 'Supports joint comfort and mobility. Works alongside collagen to support your recovery.',
  },
]

const faqItems = [
  { q: 'When will Joint and Recovery Collagen be available?', a: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { q: 'Is this on sale right now?', a: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { q: 'What will I get for joining the waitlist?', a: 'Early dispatch when stock arrives, and a founding-customer discount on your first order. No payment is taken to join.' },
  { q: 'Can I take this without doing a blood test first?', a: 'Yes, every ingredient is safe for healthy adults at these doses. But this product is most useful when you have confirmed inflammation. The blood test tells you whether it is the right product for you, or whether your joint issues have a different cause.' },
  { q: 'What if my hs-CRP is above 10?', a: 'If your hs-CRP is above 10 mg/L, we will not recommend a supplement. That level of inflammation needs a GP. Your results report will say this clearly and provide a GP referral template.' },
]

export default function CollagenPage() {
  return (
    <>
      <JsonLd data={collagenSchema} />
      {/* HERO */}
      <section className="pt-40 pb-24 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-start">

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-12 h-[2px] bg-black" />
              Joint &amp; Recovery Collagen // Launching Shortly
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your inflammation marker is elevated.<br />
              <span className="text-gray-400">Your joints already knew.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              10g hydrolysed collagen peptides, UC-II for joint-specific support, Vitamin C, and MSM. Built for active men whose blood data confirmed elevated inflammation, and who report joint symptoms. Launching shortly. Join the waitlist for early dispatch and a founding-customer discount.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 data-label border-t-2 border-black pt-6 w-full">
              {['EFSA-Approved Vitamin C Claim', 'GP-Led Formulation', 'Coming Soon', 'No Pre-Order'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist form */}
          <div className="lg:col-span-5" id="join">
            <SupplementWaitlistForm interestedInProduct="collagen" />
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
            Your joints are slowing you down and rest is not fixing it.
          </h2>
          <div className="space-y-6 text-xl md:text-2xl font-serif leading-relaxed text-black">
            <p>You are stiff in the morning. Your knees ache after every session. Recovery takes longer than it used to, and the soreness hangs around for days.</p>
            <p>You are not injured. You are dealing with low-grade inflammation that your body cannot clear on its own.</p>
            <div className="bg-black text-white p-8 mt-10 text-left border-4 border-black font-sans font-black text-2xl uppercase tracking-tighter leading-tight">
              Your blood test can confirm it. If your hs-CRP marker is elevated, that means your body is in a state of repair it cannot keep up with.
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
                  <div className="data-label mb-3">Why it is here:</div>
                  <p className="font-serif text-lg leading-relaxed">{why}</p>
                </div>
              </div>
            ))}
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
            <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-6 leading-[0.9]">Recommended based on your results. Built on a GMC-registered GP&rsquo;s guidance.</h2>
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

      {/* WAITLIST CTA */}
      <section id="pricing" className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              Waitlist
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.9]">
              Be first when it ships.
            </h2>
            <p className="mt-8 text-lg font-serif max-w-2xl mx-auto">
              We are not taking supplement orders or payments today. Join the waitlist and we will email you the moment the Joint and Recovery Collagen is ready to ship. Waitlist members get early dispatch and a founding-customer discount.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <SupplementWaitlistForm interestedInProduct="collagen" />
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

      {/* COMPARE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl font-serif font-bold text-black mb-6">
            Dealing with low energy or recovery issues too? The Daily Stack launches alongside the Joint and Recovery Collagen.
          </p>
          <Link href="/supplements/daily-stack" className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-base px-8 py-4 transition-all">
            Read about the Daily Stack
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
