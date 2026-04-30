import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

const kitSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kits', item: `${BASE_URL}/kits` },
        { '@type': 'ListItem', position: 3, name: 'Testosterone Health Check', item: `${BASE_URL}/kits/testosterone` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/kits/testosterone/#product`,
      name: 'Testosterone Health Check — At-Home Blood Test Kit',
      description: 'At-home testosterone blood test. Tests Total Testosterone, SHBG, Free Androgen Index (FAI), Albumin, and Free Testosterone. UKAS ISO 15189 accredited lab. Results in 48 hours.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-01',
      offers: {
        '@type': 'Offer',
        price: '29.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/kits/testosterone`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does this test actually show?',
          acceptedAnswer: { '@type': 'Answer', text: "It shows your Total Testosterone, SHBG (Sex Hormone Binding Globulin), Free Androgen Index (FAI), Albumin, and Free Testosterone. Free T is the testosterone your body can actually use — and it's often the number your GP doesn't test." },
        },
        {
          '@type': 'Question',
          name: 'Does it hurt?',
          acceptedAnswer: { '@type': 'Answer', text: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets just in case." },
        },
        {
          '@type': 'Question',
          name: 'How long do results take?',
          acceptedAnswer: { '@type': 'Answer', text: 'Once our UKAS accredited lab receives your sample, your dashboard is updated within 48 hours.' },
        },
        {
          '@type': 'Question',
          name: 'Does the £99 cover everything?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. The kit, the lab analysis for all five biomarkers, the prepaid return postage, and access to your results dashboard are all included.' },
        },
        {
          '@type': 'Question',
          name: 'What if my testosterone comes back low?',
          acceptedAnswer: { '@type': 'Answer', text: "Your report will explain exactly what your result means and what to consider next. If your testosterone comes back below 12 nmol/L, you'll be invited to join our founding member programme." },
        },
        {
          '@type': 'Question',
          name: 'Is my data private?',
          acceptedAnswer: { '@type': 'Answer', text: 'Completely. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.' },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Testosterone Health Check — Kit 1',
  description: 'At-home testosterone blood test. Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free Testosterone. UKAS ISO 15189 accredited lab. Results in 48 hours. £99.',
  alternates: { canonical: 'https://andro-prime.com/kits/testosterone' },
  openGraph: {
    title: 'Testosterone Health Check — Kit 1 | Andro Prime',
    description: 'At-home testosterone blood test. Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free Testosterone. UKAS ISO 15189 accredited lab. Results in 48 hours. £99.',
    url: 'https://andro-prime.com/kits/testosterone',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Testosterone Health Check — Kit 1' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testosterone Health Check — Kit 1 | Andro Prime',
    description: 'At-home testosterone blood test. Total T, SHBG, FAI, Albumin, and Free T. UKAS accredited. Results in 48 hours. £99.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  {
    question: 'What does this test actually show?',
    answer: 'It shows your Total Testosterone, SHBG (Sex Hormone Binding Globulin), Free Androgen Index (FAI), Albumin, and Free Testosterone. Free T is the testosterone your body can actually use — and it\'s often the number your GP doesn\'t test.',
  },
  {
    question: 'Does it hurt?',
    answer: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets just in case.",
  },
  {
    question: 'How long do results take?',
    answer: 'Once our UKAS accredited lab receives your sample, your dashboard is updated within 48 hours.',
  },
  {
    question: 'Does the £99 cover everything?',
    answer: 'Yes. The kit, the lab analysis for all five biomarkers, the prepaid return postage, and access to your results dashboard are all included.',
  },
  {
    question: 'What if my testosterone comes back low?',
    answer: 'Your report will explain exactly what your result means and what to consider next. If your testosterone comes back below 12 nmol/L, you\'ll be invited to join our founding member programme.',
  },
  {
    question: 'Is my data private?',
    answer: 'Completely. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.',
  },
]

export default function KitTestosteronePage() {
  return (
    <>
      <JsonLd data={kitSchema} />
      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px] !text-black">Kit 01 // Testosterone</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your GP said normal.<br />
              <span className="text-gray-400">That&rsquo;s not the same as good.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              Find out exactly where your testosterone sits. We test Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. You get the raw data in plain English, plus a specific recommendation based on your numbers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mb-12">
              <Link href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 transition-all flex items-center justify-center gap-3">
                Order the Kit — £99
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <span className="data-label">All-in. No hidden fees.</span>
            </div>

            <div className="flex flex-wrap items-center gap-8 data-label border-t-2 border-black pt-6 w-full">
              {['UKAS ISO 15189 Lab', 'Free UK Delivery', 'GMC-Registered Doctor', 'Results in 48h'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Sample results panel */}
          <div className="lg:col-span-5 relative">
            <div className="hidden md:block absolute -top-6 -right-6 data-label bg-white border-2 border-black px-3 py-1 z-10">Sample report</div>
            <div className="hidden md:block absolute -bottom-6 -left-6 data-label bg-white border-2 border-black px-3 py-1 z-10">5 biomarkers</div>

            <div className="border-4 border-black p-8 bg-white relative z-0">
              <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-3 h-3 bg-black" />
                  <span className="font-sans font-black uppercase tracking-tighter text-xl">Your Results</span>
                </div>
                <div className="data-label text-gray-500">Kit 01 // Testosterone</div>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'Total Testosterone', sub: 'Your baseline level', value: '14.2', unit: 'nmol/L', status: 'Borderline', barW: '35%', barColor: 'bg-amber-500' },
                  { label: 'SHBG', sub: 'Binding globulin', value: '38.5', unit: 'nmol/L', status: 'Normal', barW: '55%', statusBg: true, barColor: 'bg-emerald-600' },
                  { label: 'Free Androgen Index', sub: 'Bioavailable testosterone ratio', value: '36.9', unit: '%', status: 'Borderline', barW: '20%', barColor: 'bg-amber-500' },
                  { label: 'Albumin', sub: 'Transport protein', value: '42.0', unit: 'g/L', status: 'Normal', barW: '65%', statusBg: true, barColor: 'bg-emerald-600' },
                  { label: 'Free Testosterone', sub: 'What your body can actually use', value: '0.244', unit: 'nmol/L', status: 'Low', barW: '15%', statusBold: true, barColor: 'bg-amber-500' },
                ].map(({ label, sub, value, unit, status, barW, statusBg, statusBold, barColor }) => (
                  <div key={label}>
                    <div className="flex justify-between items-end mb-1">
                      <div>
                        <div className="data-label">{label}</div>
                        <div className="text-[10px] font-serif text-gray-500 italic">{sub}</div>
                      </div>
                      <div className="text-right">
                        <div className="data-value">{value}</div>
                        <div className={`data-label !text-[10px] mt-1 px-1 ${statusBg ? 'bg-black !text-white' : 'border border-black'} ${statusBold ? 'border-2 border-black font-black' : ''}`}>{status}</div>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 flex">
                      <div className={`h-full ${barColor || 'bg-black'}`} style={{ width: barW }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-6 border-t-4 border-black flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="text-sm font-serif">
                  <strong className="font-sans font-black uppercase tracking-tight">Recommendation:</strong> Further investigation advised
                </div>
                <div className="data-label bg-gray-100 px-2 py-1">48h turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYMPTOMS */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-12 h-[2px] bg-black" />
              The Reality
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Stop guessing what&rsquo;s wrong.
            </h2>
            <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
              <p>You&rsquo;re doing everything right. You&rsquo;re training. You&rsquo;re eating well. But you&rsquo;re still tired, your focus is gone, and you don&rsquo;t feel like yourself anymore.</p>
              <p>When you ask a standard doctor, they run a basic test and tell you you&rsquo;re &ldquo;fine&rdquo;. Fine isn&rsquo;t good enough.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50">
                <p className="text-black font-serif italic font-bold text-2xl leading-snug">
                  The NHS sets its threshold to catch severe disease. That&rsquo;s not the same as optimal.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10 pb-8 border-b-4 border-black">
              <div className="w-4 h-4 bg-black" />
              <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">Symptoms</h3>
            </div>
            <div className="space-y-4">
              {[
                { strong: 'Exhausted by 3pm', rest: ' no matter how much sleep you get.' },
                { strong: 'Brain fog.', rest: ' Losing focus at work. Struggling to stay sharp.' },
                { strong: 'Drive and motivation just gone.', rest: ' Libido has flatlined.' },
              ].map(({ strong, rest }) => (
                <div key={strong} className="border-2 border-black p-6 flex gap-5 hover:bg-gray-50 transition-colors bg-white">
                  <div className="w-3 h-3 bg-black mt-2 shrink-0" />
                  <p className="font-serif text-lg leading-relaxed"><strong className="font-sans font-black uppercase text-base tracking-tight">{strong}</strong>{rest}</p>
                </div>
              ))}
              <div className="border-4 border-black bg-black text-white p-6 flex gap-5">
                <div className="w-3 h-3 bg-white mt-2 shrink-0" />
                <p className="font-serif text-lg leading-relaxed"><strong className="font-sans font-black uppercase text-base tracking-tight text-white">&ldquo;GP said I&rsquo;m fine&rdquo;,</strong> but you know you&rsquo;re not.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-4 divide-y-4 md:divide-y-0 divide-black">
            {[
              { label: 'UKAS ISO 15189 Lab' },
              { label: 'Free Next-Day Delivery' },
              { label: 'GMC-Registered Doctor' },
              { label: 'Results in 48h' },
            ].map(({ label }) => (
              <div key={label} className="p-8 flex items-center justify-center text-center">
                <span className="text-sm font-sans font-black uppercase tracking-widest">{label}</span>
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
              { n: '02', t: 'Collect', b: 'Simple finger-prick at the kitchen table.' },
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

      {/* BIOMARKERS */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Data
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Five numbers.<br />The full testosterone picture.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                num: '01', title: 'Total Testosterone', body: 'The total amount of testosterone in your blood. Your baseline. The number most GPs test — if they test anything at all.',
              },
              {
                num: '02', title: 'SHBG', body: 'Sex Hormone Binding Globulin. It binds to testosterone and makes it unusable. High SHBG means your total T might look fine on paper while you still feel terrible.',
              },
              {
                num: '03', title: 'Free Androgen Index', body: 'The ratio of total testosterone to SHBG, expressed as a percentage. A more sensitive indicator of testosterone availability than Total T alone — especially when SHBG is elevated.',
              },
              {
                num: '04', title: 'Albumin', body: 'The main carrier protein in your blood. Albumin-bound testosterone is considered weakly bioavailable. Testing it allows accurate calculation of your Free Testosterone — without it, the number is an estimate.',
              },
              {
                num: '05', title: 'Free Testosterone', body: 'The testosterone your body can actually use. Calculated from your Total T, SHBG, and Albumin. This is the number that matters most for how you feel day to day.',
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="border-2 border-black p-10 bg-white hover:bg-gray-50 transition-colors flex flex-col">
                <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white border-2 border-black w-max mb-8">
                  <span className="w-2 h-2 bg-white" /> Biomarker {num}
                </div>
                <h3 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-6">{title}</h3>
                <p className="text-lg text-black font-serif leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GMC NOTE */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                The Fix
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Numbers you can actually act on.
              </h2>
              <p className="text-xl text-black font-serif leading-relaxed">
                Every result comes with a specific recommendation. If your testosterone is below where it should be, we tell you what your level means and what to consider next. If something needs a GP, we tell you that too.
              </p>
            </div>
            <div className="p-12 bg-black text-white border-4 border-black">
              <div className="flex items-start gap-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-white shrink-0 mt-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                <p className="text-xl text-white font-serif leading-relaxed">
                  <strong className="font-sans font-black uppercase text-2xl tracking-tight block mb-4">GMC-Registered Review</strong>
                  Your results are reviewed by a GMC-registered doctor. Every recommendation is backed by your actual data, not a guess.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-16 text-center">Frequently Asked Questions</h2>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ORDER CTA */}
      <section className="py-40 bg-white border-b-4 border-black text-center" id="order">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-6xl md:text-[90px] font-sans font-black uppercase tracking-tighter text-black leading-[0.9] mb-10">
            Find out where your testosterone actually sits.
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-2xl mx-auto leading-relaxed">A finger prick. A prepaid envelope. 48 hours. That&rsquo;s it.</p>
          <KitCheckoutButton kitType="testosterone" className="inline-flex bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 transition-all items-center justify-center gap-4 disabled:opacity-50">
            Order the Kit — £99
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </KitCheckoutButton>
          <div className="mt-12 data-label text-gray-500 flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            One-off purchase. Results in your personal dashboard. No GP needed.
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl font-serif font-bold text-black mb-8">Want to check testosterone AND energy/recovery markers? Kit 3 includes everything in Kit 1 plus 4 more biomarkers for £179.</p>
          <Link href="/kits/hormone-recovery" className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-base px-8 py-4 transition-all">
            See Kit 3 — £179
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
