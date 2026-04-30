import type { Metadata } from 'next'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Testosterone Health Check', item: `${BASE_URL}/lp/testosterone` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/lp/testosterone/#product`,
      name: 'Testosterone Health Check — At-Home Blood Test Kit',
      description: 'Find out where your testosterone actually sits. Tests Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. UKAS accredited lab. Results in 48 hours.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-01',
      offers: {
        '@type': 'Offer',
        price: '29.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/testosterone`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need to fast before taking the test?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. For the most accurate hormone baseline, you must take the sample fasted (water is fine) before 10 AM. Testosterone levels peak in the morning and decline throughout the day, and eating can suppress them temporarily.' },
        },
        {
          '@type': 'Question',
          name: 'Does taking the sample hurt?',
          acceptedAnswer: { '@type': 'Answer', text: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets in the kit just in case to ensure you can collect enough blood easily at home." },
        },
        {
          '@type': 'Question',
          name: 'How long do results take?',
          acceptedAnswer: { '@type': 'Answer', text: 'Once our UKAS accredited lab receives your sample, your private dashboard is updated within 48 hours.' },
        },
        {
          '@type': 'Question',
          name: 'Does the £99 cover everything?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. The kit, the clinical lab analysis, and the prepaid return postage are all included. No hidden fees. This is a one-off purchase.' },
        },
        {
          '@type': 'Question',
          name: 'Is my data private?',
          acceptedAnswer: { '@type': 'Answer', text: 'Completely. We use bank-level encryption. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.' },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Testosterone Health Check | At-Home Blood Test £99 | Andro Prime',
  description: 'Find out where your testosterone actually sits. We test Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T from a simple at-home finger-prick test. UKAS accredited lab. Results in 48 hours.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Testosterone Health Check | At-Home Blood Test £99 | Andro Prime',
    description: 'Find out where your testosterone actually sits. Total T, SHBG, FAI, Albumin, Free T. UKAS accredited lab. Results in 48 hours.',
    url: 'https://andro-prime.com/lp/testosterone',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Testosterone Health Check — Kit 1' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testosterone Health Check | £99 | Andro Prime',
    description: 'Find out where your testosterone actually sits. UKAS accredited lab. Results in 48 hours.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  { question: 'Do I need to fast before taking the test?', answer: 'Yes. For the most accurate hormone baseline, you must take the sample fasted (water is fine) before 10 AM. Testosterone levels peak in the morning and decline throughout the day, and eating can suppress them temporarily.' },
  { question: 'Does taking the sample hurt?', answer: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets in the kit just in case to ensure you can collect enough blood easily at home." },
  { question: 'How long do results take?', answer: 'Once our UKAS accredited lab receives your sample, your private dashboard is updated within 48 hours.' },
  { question: 'Does the £99 cover everything?', answer: 'Yes. The kit, the clinical lab analysis, and the prepaid return postage are all included. No hidden fees. This is a one-off purchase.' },
  { question: 'Is my data private?', answer: 'Completely. We use bank-level encryption. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.' },
]

export default function TestosteroneLpPage() {
  return (
    <>
      <JsonLd data={lpSchema} />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 bg-black !text-white mb-8 border-2 border-black">
              Testosterone Health Check
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Your GP said normal.<br />
              <span className="text-gray-400">That&rsquo;s not the same as good.</span>
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              Find out exactly where your testosterone sits. We test Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. You get the raw data in plain English, plus a specific recommendation based on your numbers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Order the Kit &rarr; £99
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="font-mono text-xs text-black tracking-[0.15em] uppercase font-bold">All-in. No hidden fees.</span>
            </div>
            <div className="mt-8 flex items-center gap-3 data-label border-t-2 border-black pt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              UKAS accredited lab. Results in 48 hours.
            </div>
          </div>

          {/* Sample report preview */}
          <div className="lg:col-span-6 relative">
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
                {/* Total Testosterone */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <div className="data-label">Total Testosterone</div>
                      <div className="text-[10px] font-serif text-gray-500 italic">Your baseline level</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value">14.2</div>
                      <div className="data-label !text-[10px] border border-black px-1 mt-1">Borderline</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 flex"><div className="h-full bg-amber-500 w-[35%]" /></div>
                </div>

                {/* SHBG */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <div className="data-label">SHBG</div>
                      <div className="text-[10px] font-serif text-gray-500 italic">Binding globulin</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value">38.5</div>
                      <div className="data-label !text-[10px] bg-black !text-white px-1 mt-1">Normal</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 flex"><div className="h-full bg-emerald-600 w-[55%]" /></div>
                </div>

                {/* Free Androgen Index */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <div className="data-label">Free Androgen Index</div>
                      <div className="text-[10px] font-serif text-gray-500 italic">Bioavailable testosterone ratio</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value">36.9</div>
                      <div className="data-label !text-[10px] border border-black px-1 mt-1">Borderline</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 flex"><div className="h-full bg-amber-500 w-[20%]" /></div>
                </div>

                {/* Albumin */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <div className="data-label">Albumin</div>
                      <div className="text-[10px] font-serif text-gray-500 italic">Transport protein</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value">42.0</div>
                      <div className="data-label !text-[10px] bg-black !text-white px-1 mt-1">Normal</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 flex"><div className="h-full bg-emerald-600 w-[65%]" /></div>
                </div>

                {/* Free Testosterone */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <div className="data-label">Free Testosterone</div>
                      <div className="text-[10px] font-serif text-gray-500 italic">What your body can actually use</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value">0.244</div>
                      <div className="data-label !text-[10px] border-2 border-black font-black px-1 mt-1">Low</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 flex"><div className="h-full bg-amber-500 w-[15%]" /></div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t-4 border-black flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="text-sm font-serif">
                  <strong className="font-sans font-black uppercase tracking-tight">Recommendation:</strong> Further investigation advised
                </div>
                <div className="data-label bg-gray-100 px-2 py-1 w-fit">48h turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYMPTOM CHECKER */}
      <section className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionEyebrow label="The Reality" />
            <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
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
                { title: 'Exhausted by 3pm', body: 'no matter how much sleep you get.' },
                { title: 'Brain fog.', body: 'Losing focus at work. Struggling to stay sharp.' },
                { title: 'Drive and motivation just gone.', body: 'Libido has flatlined.' },
              ].map(({ title, body }) => (
                <div key={title} className="border-2 border-black rounded-none p-6 flex gap-5 hover:bg-gray-50 transition-colors bg-white">
                  <div className="w-3 h-3 bg-black mt-2 shrink-0" />
                  <p className="font-serif text-lg leading-relaxed">
                    <strong className="font-sans font-black uppercase text-base tracking-tight">{title}</strong> {body}
                  </p>
                </div>
              ))}
              <div className="border-4 border-black bg-black text-white p-6 flex gap-5">
                <div className="w-3 h-3 bg-white mt-2 shrink-0" />
                <p className="font-serif text-lg leading-relaxed">
                  <strong className="font-sans font-black uppercase text-base tracking-tight text-white">&ldquo;GP said I&rsquo;m fine&rdquo;,</strong> but you know you&rsquo;re not.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white">
        <div className="border-b-4 border-black bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-4 divide-y-4 md:divide-y-0 divide-black">
              {[
                { icon: <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />, label: 'UKAS ISO 15189 Lab' },
                { icon: <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />, label: 'Free Next-Day Delivery' },
                { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />, label: 'GMC-Registered Doctor' },
                { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, label: 'Results in 48h' },
              ].map(({ icon, label }) => (
                <div key={label} className="p-8 flex flex-col items-center justify-center text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mb-4">{icon}</svg>
                  <span className="text-sm font-sans font-black uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROCESS STEPS */}
        <div className="py-32 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Process" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Five minutes. No GP needed.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Testing your hormones shouldn&rsquo;t require three appointments and a waiting list.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Order your kit', body: 'Dispatched same day. Fits straight through your letterbox. No clinic, no referral, no waiting room.', meta: ['INIT // SEQ.01', '[SAME-DAY DISPATCH]'] },
              { num: '02', title: 'Take sample at home', body: 'A simple, painless finger-prick sample you can do at the kitchen table. Five minutes, first thing in the morning.', meta: ['USER // ACT.02', '[T: 00:05:00]'] },
              { num: '03', title: 'Post it back', body: 'Pre-paid return envelope. Drop it in any standard post box. The lab gets it the next working day.', meta: ['TRAN // LOG.03', '[ROYAL MAIL 24]'] },
            ].map(({ num, title, body, meta }) => (
              <div key={num} className="border-2 border-black p-8 relative bg-white">
                <div className="absolute top-0 right-0 p-4 text-[100px] font-sans font-black text-gray-100 leading-none select-none pointer-events-none -mt-4 -mr-2">{num[1]}</div>
                <div className="flex justify-between items-start mb-10 border-b-2 border-black pb-4 relative z-10">
                  <div className="data-label px-2 py-1 border border-black">Step {num}</div>
                  <div className="text-right">
                    <div className="data-label !text-[10px]">{meta[0]}</div>
                    <div className="data-label !text-[10px] text-gray-500">{meta[1]}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10">{title}</h3>
                <p className="font-serif text-base leading-relaxed relative z-10">{body}</p>
              </div>
            ))}
            <div className="border-4 border-black p-8 relative bg-black text-white">
              <div className="absolute top-0 right-0 p-4 text-[100px] font-sans font-black text-gray-800 leading-none select-none pointer-events-none -mt-4 -mr-2">4</div>
              <div className="flex justify-between items-start mb-10 border-b-2 border-gray-700 pb-4 relative z-10">
                <div className="data-label px-2 py-1 border border-white !text-white">Step 04</div>
                <div className="text-right">
                  <div className="data-label !text-[10px] !text-white">DATA // RCV.04</div>
                  <div className="data-label !text-[10px] text-gray-400">[SYS.READY]</div>
                </div>
              </div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10 text-white">Read your results</h3>
              <p className="font-serif text-base leading-relaxed relative z-10 text-gray-300">Your numbers land in a personal dashboard within 48 hours. Clear data, plain English, and a specific recommendation based on what your blood actually shows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-32 bg-gray-50 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5">
            <SectionEyebrow label="What happens next" />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              We don&rsquo;t just give you numbers.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed mb-6">
              A blood test without a plan is useless. Your results come with a clear, specific recommendation based on what the data actually shows. Not a generic leaflet.
            </p>
            <p className="text-black font-serif text-xl leading-relaxed mb-10">
              Five markers. Three possible outcomes. Each one has a pathway.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {[
              { title: 'Levels are optimal', body: 'Good news confirmed. You get a retest reminder in 6 months to make sure it stays that way.', icon: <path d="M9 12l2 2 4-4" />, dark: true },
              { title: 'Borderline or suboptimal', body: "Your dashboard recommends a targeted supplement protocol. Daily Stack sachets designed to support what's low.", icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />, dark: false },
              { title: 'Testosterone below 12 nmol/L', body: "You're invited to join the Founding Member programme. First access to our TRT service when it launches, with a fully refundable £75 deposit.", icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />, dark: false },
            ].map(({ title, body, icon, dark }) => (
              <div key={title} className="border-2 border-black p-8 bg-white flex gap-6 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 ${dark ? 'bg-black text-white' : ''}`}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">{icon}</svg>
                </div>
                <div>
                  <h3 className="text-xl font-sans font-black uppercase tracking-tighter text-black mb-2">{title}</h3>
                  <p className="font-serif text-base text-black leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLINICAL OVERSIGHT */}
      <section id="clinical" className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="border-2 border-black p-10 lg:p-16 flex flex-col justify-between h-full bg-white">
            <div>
              <div className="data-label bg-black !text-white px-3 py-1.5 inline-block w-fit mb-10">Founder</div>
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic mb-12">
                &ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this because the standard approach is broken. We test first. Then we fix it.&rdquo;
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
                &ldquo;Normal ranges are statistical averages, not targets for how you should actually feel. I review every protocol to ensure your data translates into effective, actionable health steps.&rdquo;
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

      {/* FAQ */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-sans font-black text-black uppercase tracking-tighter mb-12">Frequently Asked Questions</h2>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section id="order" className="py-40 bg-white border-t-4 border-black relative overflow-hidden">
        <div className="absolute top-12 left-12 data-label opacity-100 hidden md:block text-black text-sm">SYS.READY // UKAS.V1</div>
        <div className="absolute bottom-12 right-12 data-label opacity-100 hidden md:block text-black text-sm">END.SEQ // 892.4</div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-none border-2 border-black bg-white mb-12">
            <span className="w-3 h-3 bg-black" />
            <span className="data-label !text-black text-sm">Secure Checkout</span>
          </div>

          <h2 className="text-6xl md:text-[100px] font-sans font-black uppercase tracking-tighter text-black leading-[0.85] mb-10">
            Stop guessing.<br />Start knowing.
          </h2>
          <p className="text-2xl text-black font-serif mb-16 max-w-3xl mx-auto leading-relaxed">A finger prick. A pre-paid envelope. 48 hours. That&rsquo;s it.</p>

          <div className="flex flex-col items-center gap-4">
            <KitCheckoutButton kitType="testosterone" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 rounded-none transition-all flex items-center justify-center gap-4 w-full md:w-auto disabled:opacity-50">
              Order Kit → £99
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </KitCheckoutButton>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 text-base text-black font-serif font-bold italic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            One-off purchase. Includes lab fees &amp; delivery. No subscription.
          </div>
        </div>
      </section>
    </>
  )
}
