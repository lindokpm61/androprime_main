import type { Metadata } from 'next'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { JsonLd } from '@/components/shared/JsonLd'
import { PRICING } from '@/lib/pricing'

const BASE_URL = 'https://andro-prime.com'

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Hormone & Recovery Check', item: `${BASE_URL}/lp/hormone-recovery` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/lp/hormone-recovery/#product`,
      name: 'Hormone & Recovery Check — At-Home Blood Test Kit',
      description: 'The most complete at-home blood test for men. All 9 markers: full testosterone panel plus energy, recovery, and inflammation. UKAS accredited lab. Results in 48 hours.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-03',
      offers: {
        '@type': 'Offer',
        price: '69.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/hormone-recovery`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
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
          name: 'Does the £179 cover everything?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included. It is a one-off payment, not a subscription.' },
        },
        {
          '@type': 'Question',
          name: 'Is my data private?',
          acceptedAnswer: { '@type': 'Answer', text: 'Completely. We use bank-level encryption. Your results are strictly between you, Dr Ewa Lindo, and your private dashboard. We never share data with third parties.' },
        },
        {
          '@type': 'Question',
          name: 'Why not just buy Kit 1 and Kit 2 separately?',
          acceptedAnswer: { '@type': 'Answer', text: "You could. They'd cost £218 combined. Kit 3 gives you all nine markers for £179, with one sample instead of two. And testing everything together gives a more complete picture, which means better recommendations." },
        },
        {
          '@type': 'Question',
          name: 'What if my testosterone comes back low?',
          acceptedAnswer: { '@type': 'Answer', text: "Your report will explain exactly what your level means and what to consider next. If your results meet the threshold, we'll invite you to join our founding member programme, which secures your place at the front of the queue when our clinical service launches." },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Kit 3: Hormone & Recovery Check | £179 | Andro Prime',
  description: 'Nine biomarkers — testosterone, SHBG, FAI, albumin, free T, vitamin D, Active B12, hs-CRP, and ferritin — in one at-home test. UKAS accredited lab. Results in 48 hours.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Hormone & Recovery Check | £179 | Andro Prime',
    description: 'Nine biomarkers — testosterone, SHBG, FAI, albumin, free T, vitamin D, Active B12, hs-CRP, and ferritin — in one at-home test. Results in 48 hours.',
    url: 'https://andro-prime.com/lp/hormone-recovery',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Hormone & Recovery Check — Kit 3' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hormone & Recovery Check | £179 | Andro Prime',
    description: 'Nine biomarkers covering hormones, energy, recovery, and inflammation. UKAS accredited lab. Results in 48 hours.',
    images: ['/og/default.png'],
  },
}

const faqItems = [
  { question: 'Does it hurt?', answer: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets just in case." },
  { question: 'How long do results take?', answer: 'Once our UKAS accredited lab receives your sample, your dashboard is updated within 48 hours.' },
  { question: 'Does the £179 cover everything?', answer: 'Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included. It is a one-off payment, not a subscription.' },
  { question: 'Is my data private?', answer: 'Completely. We use bank-level encryption. Your results are strictly between you, Dr Ewa Lindo, and your private dashboard. We never share data with third parties.' },
  { question: 'Why not just buy Kit 1 and Kit 2 separately?', answer: 'You could. They\'d cost £218 combined. Kit 3 gives you all nine markers for £179, with one sample instead of two. And testing everything together gives a more complete picture, which means better recommendations.' },
  { question: 'What if my testosterone comes back low?', answer: "Your report will explain exactly what your level means and what to consider next. If your results meet the threshold, we'll invite you to join our founding member programme, which secures your place at the front of the queue when our clinical service launches." },
]

const biomarkers = [
  {
    num: '01',
    category: 'Hormones',
    icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    iconBg: true,
    title: 'Total Testosterone',
    body: 'The total amount of testosterone in your blood. Your baseline. If this is low, everything else, energy, mood, drive, takes a hit.',
  },
  {
    num: '02',
    category: 'Hormones',
    icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    iconBg: false,
    title: 'SHBG',
    body: 'Sex Hormone Binding Globulin. It binds to testosterone and makes it unusable. High SHBG means your total T might look fine on paper while you still feel terrible.',
  },
  {
    num: '03',
    category: 'Hormones',
    icon: <><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></>,
    iconBg: false,
    title: 'Free Androgen Index',
    body: 'The ratio of total testosterone to SHBG. A more sensitive indicator of testosterone availability than Total T alone, particularly useful when SHBG is high or shifting.',
  },
  {
    num: '04',
    category: 'Hormones',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    iconBg: false,
    title: 'Albumin',
    body: 'The main carrier protein in your blood. Testing albumin allows accurate calculation of Free Testosterone. Without it, the number is an estimate.',
  },
  {
    num: '05',
    category: 'Hormones',
    icon: <><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></>,
    iconBg: false,
    title: 'Free Testosterone',
    body: 'The testosterone your body can actually use. Calculated from your Total T, SHBG, and Albumin. This is the number that matters most for how you feel day to day.',
  },
  {
    num: '06',
    category: 'Energy',
    icon: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
    iconBg: false,
    title: 'Vitamin D',
    body: "Most UK men are deficient, especially October to March. Low vitamin D directly affects muscle function, recovery, and energy. You won't know without testing.",
  },
  {
    num: '07',
    category: 'Energy',
    icon: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    iconBg: false,
    title: 'Active B12',
    body: "Holotranscobalamin: the form of B12 your cells can actually use. Standard tests often miss deficiency. Low Active B12 affects energy, nerve function, and recovery between sessions.",
  },
  {
    num: '08',
    category: 'Inflammation',
    icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    iconBg: false,
    title: 'hs-CRP (Inflammation)',
    body: 'A high-sensitivity inflammation marker. In active men, elevated hs-CRP is often linked to joint and connective tissue stress, but it can have several causes. Your dashboard explains what your specific reading means.',
  },
  {
    num: '09',
    category: 'Iron Stores',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    iconBg: false,
    title: 'Ferritin',
    body: 'Your iron stores. Low ferritin is one of the most common and most overlooked causes of fatigue in men. Often normal on a basic NHS panel. Rarely tested unless you ask for it specifically.',
    highlight: true,
  },
]

export default function HormoneRecoveryLpPage() {
  return (
    <>
      <JsonLd data={lpSchema} />
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="data-label flex items-center gap-2 px-3 py-1.5 border-2 border-black mb-8">
              <span className="w-2 h-2 bg-black" /> DATA FIRST
            </div>

            <h1 className="text-6xl md:text-[90px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
              Nine numbers every man<br />
              <span className="text-gray-400">over 40 should know.</span>
            </h1>

            <p className="text-xl text-black font-serif mb-10 leading-relaxed max-w-xl">
              Hormones, energy, recovery, and inflammation. One test. Nine biomarkers. The full picture of what&apos;s actually going on inside your body, with a specific recommendation based on your data.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <a
                href="#order"
                className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black !text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center justify-center gap-3"
              >
                Order the Kit &mdash; £179
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <div className="flex flex-col gap-2">
                <span className="data-label bg-black !text-white px-2 py-1 w-max">Most complete</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-2 data-label text-black">
              {['UKAS ISO 15189 Accredited Lab', 'Free UK Delivery', 'GMC-Registered Doctor'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Sample report card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-4 -right-4 data-label text-black bg-white px-2 py-1 border-2 border-black z-10">SAMPLE REPORT</div>
            <div className="absolute -bottom-4 -left-4 data-label text-black bg-white px-2 py-1 border-2 border-black z-10">9 BIOMARKERS</div>

            <div className="border-2 border-black p-8 bg-white">
              <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-black" />
                  <span className="font-sans font-black uppercase tracking-tight text-xl">Your Results</span>
                </div>
                <div className="data-label text-right">Kit 03 // Hormone &amp; Recovery</div>
              </div>

              <div className="divide-y-2 divide-black border-b-2 border-black mb-6">
                {[
                  { name: 'Total Testosterone', sub: 'Hormone baseline', value: '13.8', unit: 'nmol/L', status: 'Borderline', dark: true },
                  { name: 'SHBG', sub: 'Binding globulin', value: '41.2', unit: 'nmol/L', status: 'Normal', dark: false },
                  { name: 'Free Androgen Index', sub: 'Bioavailable T ratio', value: '33.5', unit: '%', status: 'Borderline', dark: true },
                  { name: 'Albumin', sub: 'Transport protein', value: '42.0', unit: 'g/L', status: 'Normal', dark: false },
                  { name: 'Free Testosterone', sub: 'Usable hormone', value: '0.231', unit: 'nmol/L', status: 'Low', dark: true },
                  { name: 'Vitamin D', sub: 'Muscle & recovery', value: '35', unit: 'nmol/L', status: 'Low', dark: true },
                  { name: 'Active B12', sub: 'Cellular B12', value: '31.2', unit: 'pmol/L', status: 'Low', dark: true },
                  { name: 'hs-CRP', sub: 'Inflammation marker', value: '3.6', unit: 'mg/L', status: 'Elevated', dark: true },
                  { name: 'Ferritin', sub: 'Iron stores', value: '62', unit: 'ug/L', status: 'Normal', dark: false },
                ].map(({ name, sub, value, unit, status, dark }) => (
                  <div key={name} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-sans font-black uppercase text-base tracking-tight">{name}</div>
                      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-500 font-bold">{sub}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-xl font-black">{value} <span className="text-xs font-normal">{unit}</span></div>
                      <div className={`data-label px-2 py-1 w-24 text-center border ${dark ? 'bg-black !text-white border-black' : 'bg-white text-black border-black'}`}>{status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 border-2 border-black gap-4">
                <span className="text-sm font-serif text-black"><strong className="font-sans font-black uppercase tracking-tight">Recommendation:</strong> Targeted protocol advised</span>
                <span className="data-label border border-black bg-black !text-white px-2 py-1 whitespace-nowrap">ACTION REQUIRED</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── THE REALITY ── */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            <div>
              <SectionEyebrow label="The Reality" />
              <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                You don&apos;t know<br />what you don&apos;t know.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>Maybe it&apos;s your testosterone. Maybe it&apos;s your vitamin D. Maybe it&apos;s inflammation you can&apos;t feel yet. Maybe it&apos;s all three.</p>
                <p>You can spend months guessing, or you can find out in 48 hours. This kit tests the nine markers that matter most for how you feel, recover, and perform. Not 30 markers you&apos;ll never use. Just the ones that actually move the needle.</p>
                <div className="pl-8 border-l-[6px] border-black py-4 mt-8 bg-gray-50 pr-4">
                  <p className="text-black font-serif italic text-2xl leading-snug font-bold">
                    &ldquo;Testing one thing when the real problem could be three things is how men stay stuck.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-10 bg-gray-50">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b-4 border-black">
                <div className="w-4 h-4 bg-black" />
                <h3 className="font-sans font-black text-3xl tracking-tighter uppercase text-black m-0">Sound familiar?</h3>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Not sure if it\'s hormones or energy.', body: 'The symptoms overlap and no one has tested both at once.', dark: false },
                  { title: "Haven't had a proper check in years.", body: 'Want to know where you stand before something goes wrong.', dark: false },
                  { title: 'Slow recovery, low drive, brain fog.', body: "All at once. One test can't explain all three.", dark: false },
                  { title: 'Something has shifted after 40.', body: "You can feel it. You just can't point to what.", dark: true },
                ].map(({ title, body, dark }) => (
                  <div key={title} className={`flex items-start gap-5 p-5 border-2 border-black ${dark ? 'bg-black !text-white' : 'bg-white'}`}>
                    <div className={`mt-1 w-4 h-4 flex-shrink-0 ${dark ? 'bg-white' : 'bg-black'}`} />
                    <p className={`font-serif text-lg leading-snug ${dark ? '!text-white' : 'text-black'}`}>
                      <strong className={`font-sans font-black uppercase text-base tracking-tight ${dark ? '!text-white' : ''}`}>{title}</strong>{' '}{body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THE DATA ── */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Data" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Everything Kit 1 and Kit 2 test.<br />In one kit.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed">Nine biomarkers across hormones, energy, and recovery. Each one tells you something specific about what your body is doing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {biomarkers.map(({ num, category, icon, iconBg, title, body, highlight }) => (
              <div key={num} className={`border-2 border-black p-8 relative overflow-hidden flex flex-col h-full ${highlight ? 'bg-gray-50 md:col-span-2 lg:col-span-1' : 'bg-white'}`}>
                <div className="absolute -top-4 -right-4 text-[120px] font-sans font-black opacity-10 pointer-events-none leading-none" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>{num}</div>
                <div className={`data-label mb-6 border-2 border-black inline-block px-2 py-1 w-max ${highlight ? 'bg-white' : ''}`}>Marker {num}: {category}</div>
                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center mb-6 ${iconBg ? 'bg-black !text-white' : ''} ${highlight ? 'bg-white' : ''}`}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">{icon}</svg>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">{title}</h3>
                <p className="text-base font-serif leading-relaxed mt-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR + THE PROCESS ── */}
      <section className="bg-white border-b-4 border-black">
        <div className="border-b-4 border-black py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            {[
              { icon: <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />, label: 'UKAS ISO 15189 Lab' },
              { icon: <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />, label: 'Free Next-Day Delivery' },
              { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />, label: 'GMC-Registered Doctor' },
              { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, label: 'Results in 48h' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mb-3">{icon}</svg>
                <span className="font-sans font-black uppercase text-sm tracking-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="py-32 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Process" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">
              Five minutes.<br />No GP needed.
            </h2>
            <p className="text-black font-serif text-xl leading-relaxed">No appointment. No waiting room. No referral letter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Order', body: 'Dispatched same day. Fits through your letterbox.', meta: ['INIT // SEQ.01', '[SAME-DAY DISPATCH]'], dark: false },
              { num: '02', title: 'Collect', body: 'A simple finger-prick sample you can do at the kitchen table.', meta: ['USER // ACT.02', '[T: 00:05:00]'], dark: false },
              { num: '03', title: 'Return', body: 'Drop it in a postbox using the prepaid return envelope.', meta: ['TRAN // LOG.03', '[ROYAL MAIL 24]'], dark: false },
              { num: '04', title: 'Read', body: 'Your results appear in your private dashboard within 48 hours. Every marker explained in plain English. Every recommendation based on your actual data.', meta: ['DATA // RCV.04', '[SYS.READY]'], dark: true },
            ].map(({ num, title, body, meta, dark }) => (
              <div key={num} className={`border-2 border-black p-8 relative ${dark ? 'bg-black !text-white border-black' : 'bg-white'}`}>
                <div className={`absolute top-0 right-0 p-4 text-[100px] font-sans font-black leading-none pointer-events-none -mt-4 -mr-2 ${dark ? 'opacity-20' : 'opacity-10'}`} style={{ WebkitTextStroke: dark ? '2px white' : '2px black', color: 'transparent' }}>{num}</div>
                <div className={`flex justify-between items-start mb-12 relative z-10 border-b-2 pb-4 ${dark ? 'border-white' : 'border-black'}`}>
                  <div className={`data-label px-2 py-1 border ${dark ? 'bg-white text-black border-white' : 'bg-black !text-white border-black'}`}>Step {num}</div>
                  <div className="flex flex-col text-right">
                    <span className={`font-mono text-[8px] tracking-[0.15em] uppercase font-bold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{meta[0]}</span>
                    <span className={`font-mono text-[8px] tracking-[0.15em] uppercase font-bold ${dark ? '!text-white' : ''}`}>{meta[1]}</span>
                  </div>
                </div>
                <h3 className={`text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-10 ${dark ? '!text-white' : ''}`}>{title}</h3>
                <p className={`font-serif text-base leading-relaxed relative z-10 ${dark ? 'text-gray-300' : ''}`}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FULL PICTURE ── */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <div className="flex flex-col gap-6">
              <SectionEyebrow label="The Full Picture" />
              <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-black leading-[0.9]">
                One test instead of two.<br />One price instead of two.
              </h2>
              <p className="text-xl font-serif text-black leading-relaxed mt-4">
                Kit 3 includes everything in Kit 1 (testosterone) and Kit 2 (energy and recovery) in a single test. Separately, those two kits cost £218. Kit 3 gives you all nine markers for £179.
              </p>

              <div className="flex items-center gap-6 p-8 border-4 border-black bg-gray-50 mt-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-mono text-gray-400 line-through decoration-2">£218</span>
                  <span className="data-label text-gray-500 mt-2">Kit 1 + Kit 2 separately</span>
                </div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                <div className="flex flex-col">
                  <span className="text-5xl font-sans font-black text-black">£179</span>
                  <span className="data-label bg-black !text-white px-2 py-1 mt-2 text-center w-max">Kit 3 all-in</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { num: '01', title: 'More data, better answers.', body: 'Your testosterone, energy, recovery, and inflammation markers all interact. Testing them together shows the full picture, not just one piece of it.' },
                { num: '02', title: 'One sample, one envelope, one result.', body: 'No need to order two kits and do two finger pricks on two different mornings.' },
                { num: '03', title: 'Strongest recommendations.', body: 'More markers mean more specific advice. If multiple things are off, your report shows exactly which ones and what to do about each.' },
              ].map(({ num, title, body }) => (
                <div key={num} className="border-2 border-black p-8 flex gap-6 items-start bg-white">
                  <div className="font-mono text-2xl font-black border-b-4 border-black pb-1">{num}</div>
                  <div>
                    <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-2">{title}</h3>
                    <p className="font-serif text-base leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── THE FIX ── */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            <div>
              <SectionEyebrow label="The Fix" />
              <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                We don&apos;t just give you numbers.
              </h2>
              <p className="text-xl text-black font-serif leading-relaxed mb-10">
                Every biomarker comes with a plain-English explanation and a specific next step. If your vitamin D is low, you&apos;ll know what to take and the right dose. If your testosterone is below where it should be, your report explains what your level means and what to consider next. If something needs a GP, we&apos;ll tell you directly.
              </p>
              <div className="flex items-start gap-4 p-6 border-2 border-black bg-black !text-white">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mt-1 flex-shrink-0"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <p className="font-serif font-bold text-base">Your results are reviewed by a GMC-registered doctor. No guesswork. No generic advice. Just your data and what it means for you.</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: <path d="M9 12l2 2 4-4" />, title: 'All markers in range', badge: 'OPTIMAL', badgeDark: false, body: 'Your baseline confirmed across all nine markers. You get a retest reminder in 6 months and specific advice to maintain what you have.', iconDark: false },
                { icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />, title: 'Clear suboptimal markers', badge: 'SUBOPTIMAL', badgeDark: true, body: 'Your report shows exactly which markers need attention first, so you are not left guessing what matters most or what to act on next.', iconDark: true },
                { icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />, title: 'Hormone picture clarified', badge: 'REVIEW', badgeDark: false, body: 'You see where your testosterone markers actually sit, how they relate to one another, and what the data is telling you in plain English.', iconDark: false },
                { icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />, title: 'The full picture in one place', badge: 'COMPLETE', badgeDark: false, body: 'Instead of testing one system and missing the rest, Kit 3 shows hormones, energy, and inflammation together so the recommendation starts from a complete baseline.', iconDark: false },
              ].map(({ icon, title, badge, badgeDark, body, iconDark }) => (
                <div key={title} className="border-2 border-black p-6 flex gap-6 items-start bg-white">
                  <div className={`w-12 h-12 border-2 border-black flex items-center justify-center flex-shrink-0 ${iconDark ? 'bg-black !text-white' : 'bg-white'}`}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">{icon}</svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-sans font-black text-xl uppercase tracking-tight">{title}</h3>
                      <span className={`data-label border border-black px-2 py-0.5 ${badgeDark ? 'bg-black !text-white' : ''}`}>{badge}</span>
                    </div>
                    <p className="font-serif text-base leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── BUILT FOR ── */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="Built For" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">
              The men&apos;s health check your GP doesn&apos;t offer.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              { title: "The man who hasn't had a proper check-up in years", body: 'and wants to know where he stands.', dark: false },
              { title: "The man who isn't sure whether it's his testosterone, his energy, or something else entirely.", body: '', dark: false },
              { title: 'The man who wants one comprehensive test', body: 'instead of guessing which single marker to check.', dark: false },
              { title: "The man over 40 who knows something's shifted", body: "but can't pinpoint what.", dark: true },
            ].map(({ title, body, dark }) => (
              <div key={title} className={`border-2 ${dark ? 'border-black bg-black !text-white' : 'border-black bg-white'} p-8 flex gap-5`}>
                <div className={`w-6 h-6 border-2 ${dark ? 'border-white' : 'border-black'} flex-shrink-0 mt-1 flex items-center justify-center`}>
                  <div className={`w-2 h-2 ${dark ? 'bg-white' : 'bg-black'}`} />
                </div>
                <p className="text-xl font-serif leading-relaxed">
                  <strong className={`font-sans font-black uppercase text-lg tracking-tight ${dark ? '!text-white' : ''}`}>{title}</strong>{body ? ` ${body}` : ''}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="font-sans font-black uppercase tracking-widest text-lg mb-6">Not sure where to start? Start here.</p>
            <a href="#order" className="bg-black hover:bg-white border-4 border-black !text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 rounded-none transition-all flex items-center gap-3">
              Order the Kit &mdash; £179
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ── */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tighter text-black mb-4">
              Built by men who needed it.<br />Backed by doctors who understand it.
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-16">

            <div className="border-2 border-black p-10 flex flex-col justify-between">
              <div>
                <div className="data-label flex items-center gap-2 border-2 border-black px-3 py-1.5 w-max mb-8">
                  <span className="w-2 h-2 bg-black" /> FOUNDER
                </div>
                <p className="text-2xl font-serif italic font-bold leading-relaxed mb-10">
                  &ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this company because the standard approach is broken. We test first. Then we fix it.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-6 border-t-4 border-black pt-6">
                <div className="w-16 h-16 border-4 border-black flex items-center justify-center bg-gray-100 flex-shrink-0">
                  <span className="font-sans font-black text-2xl tracking-tighter">KA</span>
                </div>
                <div>
                  <div className="font-sans font-black uppercase text-xl tracking-tight">Keith Antony</div>
                  <div className="data-label text-gray-600">Founder, Andro Prime</div>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-10 flex flex-col justify-between bg-black !text-white">
              <div>
                <div className="data-label flex items-center gap-2 border-2 border-white px-3 py-1.5 w-max mb-8 bg-white text-black">
                  <span className="w-2 h-2 bg-black" /> CLINICAL OVERSIGHT
                </div>
                <p className="text-2xl font-serif italic font-bold leading-relaxed mb-10 text-gray-200">
                  &ldquo;Normal ranges are statistical averages, not targets for how you should actually feel. I review our clinical protocols to ensure your data translates into effective, actionable health steps.&rdquo;
                </p>
              </div>
              <div className="border-t-4 border-white pt-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 border-4 border-white flex items-center justify-center bg-white text-black flex-shrink-0">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="23" y2="12" /><line x1="23" y1="8" x2="19" y2="12" /></svg>
                  </div>
                  <div>
                    <div className="font-sans font-black uppercase text-xl tracking-tight !text-white">Dr Ewa Lindo</div>
                    <div className="data-label text-gray-400">GMC Prescriber &amp; Clinical Lead</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['GMC Registered', 'Harley Street TRT-Trained'].map((badge) => (
                    <div key={badge} className="data-label border border-gray-600 px-3 py-2 flex items-center gap-2 !text-white">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionEyebrow label="Compare" centered />
            <h2 className="text-5xl font-sans font-black uppercase tracking-tighter text-black mb-4">All three kits, side by side.</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-2 border-black min-w-[800px] bg-white">
              <thead>
                <tr className="border-b-4 border-black divide-x-2 divide-black">
                  <th className="p-6 w-1/4" />
                  <th className="p-6 w-1/4 font-sans font-black uppercase tracking-tight text-xl">Kit 1: Testosterone</th>
                  <th className="p-6 w-1/4 font-sans font-black uppercase tracking-tight text-xl">Kit 2: Energy &amp; Recovery</th>
                  <th className="p-6 w-1/4 font-sans font-black uppercase tracking-tight text-xl bg-black !text-white relative">
                    <span className="absolute top-0 right-0 bg-white text-black text-[10px] font-mono font-bold px-2 py-1 border-b-2 border-l-2 border-black">CURRENT</span>
                    Kit 3: Hormone &amp; Recovery
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {[
                  { label: 'Price', k1: `£${PRICING.KIT_1.rrp}`, k2: `£${PRICING.KIT_2.rrp}`, k3: `£${PRICING.KIT_3.rrp}` },
                  { label: 'Markers', k1: 'Total T, SHBG, FAI, Albumin, Free T', k2: 'Vit D, Active B12, hs-CRP, Ferritin', k3: 'All 9 markers' },
                  { label: 'Best for', k1: 'Testosterone only', k2: 'Energy, recovery, joints', k3: 'Full picture' },
                  { label: 'Testosterone?', k1: 'Yes', k2: <span className="text-gray-400">No</span>, k3: 'Yes' },
                  { label: 'Energy + recovery?', k1: <span className="text-gray-400">No</span>, k2: 'Yes', k3: 'Yes' },
                ].map(({ label, k1, k2, k3 }) => (
                  <tr key={label} className="divide-x-2 divide-black">
                    <td className="p-6 font-mono font-bold text-sm uppercase tracking-wider">{label}</td>
                    <td className="p-6 font-serif text-base">{k1}</td>
                    <td className="p-6 font-serif text-base">{k2}</td>
                    <td className="p-6 font-serif text-base font-bold bg-gray-100">{k3}</td>
                  </tr>
                ))}
                <tr className="divide-x-2 divide-black">
                  <td className="p-6" />
                  <td className="p-6"><a href="/kits/testosterone" className="inline-flex font-sans font-black uppercase text-sm tracking-widest border-b-2 border-black hover:bg-black hover:!text-white transition-colors">Order &rarr;</a></td>
                  <td className="p-6"><a href="/kits/energy-recovery" className="inline-flex font-sans font-black uppercase text-sm tracking-widest border-b-2 border-black hover:bg-black hover:!text-white transition-colors">Order &rarr;</a></td>
                  <td className="p-6 bg-gray-100"><span className="inline-flex font-sans font-black uppercase text-sm tracking-widest border-b-2 border-black pb-1">You&apos;re here</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ + ORDER ── */}
      <section className="py-32 bg-white border-b-4 border-black" id="order">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            <div className="lg:col-span-7">
              <SectionEyebrow label="Common Questions" />
              <FaqAccordion items={faqItems} />
            </div>

            <div className="lg:col-span-5 sticky top-32">
              <div className="border-4 border-black bg-white p-8">
                <div className="data-label mb-4 border-2 border-black inline-block px-3 py-1">KIT 03</div>
                <h3 className="text-4xl font-sans font-black uppercase tracking-tighter mb-6">Hormone &amp; Recovery Check</h3>

                <div className="flex items-end gap-3 mb-8 border-b-2 border-black pb-6">
                  <span className="text-6xl font-sans font-black tracking-tighter leading-none">£179</span>
                  <span className="data-label mb-2">all-in, one-off</span>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    'Total T, SHBG, FAI, Albumin, Free T, Vit D, Active B12, hs-CRP, Ferritin (9 markers)',
                    'UKAS ISO 15189 accredited lab',
                    'Free next-day delivery + return postage',
                    'Personal dashboard with plain-English results',
                    'Specific recommendation based on your data',
                    'GMC-registered doctor review',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                      <span className="font-serif text-base">{item}</span>
                    </div>
                  ))}
                </div>

                <KitCheckoutButton kitType="hormone-recovery" className="w-full bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl py-6 rounded-none transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  Order Now. £179
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </KitCheckoutButton>

                <div className="mt-6 flex justify-center items-center gap-2 data-label text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Secure checkout. No subscription.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-[80px] font-sans font-black uppercase tracking-tighter text-black leading-[0.85] mb-10">
            One test.<br />Nine answers.<br />The full picture.
          </h2>
          <p className="text-2xl text-black font-serif mb-12 max-w-2xl mx-auto leading-relaxed">
            A finger prick. A prepaid envelope. 48 hours. That&apos;s it.
          </p>

          <a
            href="#order"
            className="inline-flex bg-black !text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 rounded-none transition-all items-center justify-center gap-4"
          >
            Order the Kit &mdash; £179
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-black font-serif font-bold italic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>One-off purchase.</span>
            <span>Results in your personal dashboard.</span>
            <span>No GP needed.</span>
          </div>
        </div>
      </section>
    </>
  )
}
