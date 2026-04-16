import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'

export const metadata: Metadata = {
  title: 'How It Works | Andro Prime',
  description:
    'Order. Test. Know. A finger-prick, a pre-paid envelope, and a UKAS-accredited lab. Your results are in your dashboard in 48 hours.',
}

const CheckSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
)

const trustItems = [
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, label: 'UKAS ISO 15189', sub: 'Accredited Laboratory' },
  { icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="23" y2="12" /><line x1="23" y1="8" x2="19" y2="12" /></>, label: 'GMC-Registered', sub: 'Clinical Oversight' },
  { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, label: '48h Turnaround', sub: 'From lab receipt' },
  { icon: <><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>, label: 'Discreet Delivery', sub: 'Plain packaging' },
]

const steps = [
  { num: '01', title: 'Choose your kit', body: "Pick the panel that matches what you're feeling. Not sure? Take the two-minute quiz and we'll point you to the right test.", footer: ['Action', 'You'], dark: false },
  { num: '02', title: 'Collect your sample', body: 'Simple finger-prick at home. Takes five minutes. Do it fasted, first thing in the morning, for the most accurate hormone results.', footer: ['Time required', '5 mins'], dark: false },
  { num: '03', title: 'Post it back', body: 'Seal your sample in the medical transport vial included in your kit. Drop it in any Royal Mail priority postbox using the pre-paid envelope.', footer: ['Postage', 'Pre-paid'], dark: false },
  { num: '04', title: 'Read your results', body: "Results land in your secure dashboard within 48 hours of the lab receiving your sample. Plain English. What your numbers mean. What to do next.", footer: ['Turnaround', '48 hours'], dark: true },
]

const kitContents = [
  { n: '1', title: 'Lancets', desc: 'Single-use, sterile. One small prick on your fingertip. Most men describe it as barely noticeable.' },
  { n: '2', title: 'Medical transport vial', desc: "UKAS-approved collection tube. Drop your blood in, seal it, and it's ready to post." },
  { n: '3', title: 'Pre-paid return envelope', desc: 'Royal Mail priority return. Drop it in any postbox. Nothing to print. Nothing to pay.' },
  { n: '4', title: 'Step-by-step instructions', desc: 'Printed clearly in the kit. Also available in your account. There is no step that requires a clinician.' },
]

const dashboardSteps = [
  { n: '1', title: 'Your result. Plain English.', desc: 'Not a reference range. Not a lab code. "Your Vitamin D is 32 nmol/L." That\'s it. You know what you\'re dealing with.', accent: false },
  { n: '2', title: 'What it means for you.', desc: 'Personalised to your number and the symptoms you reported. "This is below optimal for energy and muscle function. In the UK between October and March, this is more common than most men realise."', accent: false },
  { n: '3', title: 'What the evidence says.', desc: "Educational, honest, no sales pitch. The research on what moves numbers at your level. Dr Ewa Lindo signs off every result interpretation.", accent: false },
  { n: '4', title: 'What we recommend. If anything.', desc: "If your result indicates a specific deficiency, we recommend the supplement that addresses it — with the exact EFSA-approved reason why. If your result is fine, we tell you that. No upsell when there's nothing to fix.", accent: true },
  { n: '5', title: 'What to watch next.', desc: "Every result tells you when it makes sense to retest. Supplement subscribers get a 20% discount on retests at the three-month mark — so you can see exactly what's moved.", accent: false },
]

const faqItems = [
  { q: 'Is a finger-prick test as accurate as a venous blood draw?', a: "Yes, for the markers we test. UKAS-accredited labs validate their finger-prick collection methods against venous samples. Thriva Solutions, our lab partner, is ISO 15189 certified — the same standard as NHS laboratories. The key requirement is correct collection: fasted, first thing in the morning, with a warm hand to encourage blood flow. The instructions in your kit walk you through all of this." },
  { q: 'How long does the whole process take?', a: "Five minutes to collect the sample. Royal Mail priority post to the lab, usually 24 hours. 48 hours for the lab to process and return results. From the day your kit arrives to results in your dashboard: typically 3 to 4 days. Order on a Monday, results by Friday." },
  { q: 'Do I need to do anything to prepare?', a: "For the most accurate testosterone result: fast overnight and collect your sample first thing in the morning. Testosterone is at its highest in the morning and drops throughout the day. Collecting at the same time of day matters for comparison when you retest. For Kit 2 (energy and recovery markers), fasting is recommended but the timing window is more flexible." },
  { q: "What if my result shows something I wasn't expecting?", a: "Your dashboard will explain what the result means and what, if anything, to do about it. For most out-of-range results, there is a clear, safe supplement recommendation. For results that warrant GP attention — elevated hs-CRP above 10 mg/L, very low ferritin, or testosterone below 6 nmol/L — we say so directly and tell you what to say to your GP. We do not diagnose conditions. We tell you what your blood is showing and what the evidence suggests." },
  { q: 'Can I share my results with my GP?', a: "Yes. Your dashboard lets you download a PDF of your results. The lab report includes the full panel data from a UKAS-accredited facility. Most GPs will accept this. Some may want to re-run on their own system — which is their right — but having your Andro Prime results in hand puts you in a far stronger position going into that conversation." },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* HERO */}
      <header className="pt-24 pb-20 border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2"><span className="w-2 h-2 bg-black" /> Methodology</div>
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">5 minutes. No GP needed.</div>
          </div>
          <h1 className="text-6xl md:text-[90px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
            Order.<br />Test.<br />Know.
          </h1>
          <p className="text-2xl md:text-3xl text-black font-serif leading-relaxed max-w-3xl">
            A finger-prick, a pre-paid envelope, and a UKAS-accredited lab. Your results are in your dashboard in 48 hours. In plain English, with a specific recommendation based on your actual numbers.
          </p>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="border-b-4 border-black bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 md:divide-x-2 divide-black">
            {trustItems.map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center px-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mb-3">{icon}</svg>
                <span className="font-sans font-black uppercase tracking-tight text-sm">{label}</span>
                <span className="text-xs font-serif text-gray-600 mt-1">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOUR STEPS */}
      <section className="py-32 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Process" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Four steps.<br />Done in a week.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Order your kit, take your sample at home, post it back. Results are in your dashboard within 48 hours of the lab receiving it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-[2px] bg-black z-0" />
            {steps.map(({ num, title, body, footer, dark }) => (
              <div key={num} className={`${dark ? 'p-10 relative z-10 border-4 border-black bg-black' : 'bg-white hover:bg-black border-2 border-black group p-10 relative z-10 transition-colors duration-300 cursor-pointer'}`}>
                <div className={`absolute top-0 right-0 text-[140px] font-sans font-black leading-none select-none pointer-events-none -mt-6 -mr-2 ${dark ? 'text-white' : 'text-gray-100 group-hover:text-white'} transition-colors duration-300`}>{num[1]}</div>
                <div className={`w-12 h-12 flex items-center justify-center font-sans font-black text-lg mb-8 relative z-20 transition-colors duration-300 ${dark ? 'border-2 border-white text-white' : 'border-4 border-black group-hover:border-white text-black group-hover:text-white'}`}>{num}</div>
                <h3 className={`text-2xl font-sans font-black uppercase tracking-tighter mb-4 relative z-20 transition-colors duration-300 ${dark ? 'text-white' : 'text-black group-hover:text-white'}`}>{title}</h3>
                <p className={`font-serif text-base leading-relaxed relative z-20 transition-colors duration-300 ${dark ? 'text-gray-300' : 'text-black group-hover:text-gray-300'}`}>{body}</p>
                <div className={`mt-8 pt-6 border-t-2 data-label flex justify-between relative z-20 transition-colors duration-300 ${dark ? 'border-gray-700' : 'border-black group-hover:border-gray-700'}`}>
                  <span className={dark ? 'text-gray-400' : 'group-hover:text-gray-400 transition-colors'}>{footer[0]}</span>
                  <span className={`font-black ${dark ? 'text-white' : 'group-hover:text-white transition-colors'}`}>{footer[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE LAB */}
      <section className="py-32 border-b-4 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <SectionEyebrow label="The Lab" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                UKAS-accredited.<br />Not a device.<br />An actual lab.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>Your sample is analysed by <strong>Thriva Solutions</strong>, a UK laboratory accredited to ISO 15189 by UKAS. That&rsquo;s the same standard used by NHS labs.</p>
                <p>This isn&rsquo;t a home device giving you an approximation. It&rsquo;s a clinical-grade blood test, processed in a certified facility, with a quality standard that is independently verified.</p>
                <div className="pl-6 border-l-[6px] border-black py-2 my-8">
                  <p className="font-bold italic">The result you see is the same class of result your GP would order. You just didn&rsquo;t have to wait three weeks for an appointment.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {['UKAS ISO 15189', 'Thriva Solutions', 'Results in 48h'].map(label => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white data-label">
                    <span className="w-2 h-2 bg-black" />{label}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label flex items-center gap-3 mb-8"><span className="w-8 h-[2px] bg-black" />What your kit contains</div>
              <ul className="space-y-6">
                {kitContents.map(({ n, title, desc }, i, arr) => (
                  <li key={n} className={`flex items-start gap-5 ${i < arr.length - 1 ? 'pb-6 border-b-2 border-gray-200' : ''}`}>
                    <div className="w-10 h-10 border-2 border-black flex-shrink-0 flex items-center justify-center font-sans font-black text-lg">{n}</div>
                    <div>
                      <strong className="font-sans font-black uppercase tracking-tight block mb-1">{title}</strong>
                      <p className="font-serif text-base text-gray-600">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* YOUR RESULTS DASHBOARD */}
      <section className="py-32 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="Your Dashboard" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Not a lab report.<br />An actual answer.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Medichecks and Thriva give you numbers. We give you numbers plus what they mean plus what to do. Every result follows the same structure.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {dashboardSteps.map(({ n, title, desc, accent }) => (
              <div key={n} className={`glass-panel p-8 flex items-start gap-6 ${accent ? 'border-l-[8px] border-l-black' : ''}`}>
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-sans font-black text-xl ${n === '5' ? 'border-2 border-black text-black' : 'bg-black text-white'}`}>{n}</div>
                <div>
                  <strong className="font-sans font-black uppercase tracking-tight text-lg block mb-2">{title}</strong>
                  <p className="font-serif text-base text-gray-700 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE KITS */}
      <section className="py-32 border-b-4 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="The Three Kits" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Start with what&rsquo;s bothering you most.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Each kit tests the markers that explain what you&rsquo;re feeling. Not sure which one is right? Take the quiz.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kit 1 */}
            <div className="glass-panel flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8">
                  <div className="data-label px-3 py-1.5 bg-white border-2 border-black flex items-center gap-2"><span className="w-2 h-2 bg-black" /> Targeted</div>
                  <span className="text-4xl font-sans font-black">£29</span>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-3">Testosterone Health Check</h3>
                <p className="font-serif text-base leading-relaxed mb-8 text-gray-700">For men who suspect testosterone might be behind the fatigue, the flat mood, and the loss of drive. GP said normal. Find out if that&rsquo;s the full picture.</p>
                <div className="border-t-2 border-black pt-6 space-y-3">
                  <div className="data-label mb-4">Markers tested</div>
                  {['Total Testosterone', 'SHBG', 'Free Testosterone (Calc)'].map(m => (
                    <div key={m} className="flex items-center gap-3 font-serif text-base"><CheckSvg />{m}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/kits/testosterone" className="block w-full text-center px-6 py-4 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">Order Kit 1</Link>
              </div>
            </div>
            {/* Kit 2 */}
            <div className="glass-panel flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8">
                  <div className="data-label px-3 py-1.5 bg-white border-2 border-black flex items-center gap-2"><span className="w-2 h-2 bg-black" /> Targeted</div>
                  <span className="text-4xl font-sans font-black">£44</span>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-3">Energy &amp; Recovery Check</h3>
                <p className="font-serif text-base leading-relaxed mb-8 text-gray-700">For active men who are training right, eating right, sleeping right &mdash; and still not recovering. This tests the four markers that most directly explain why.</p>
                <div className="border-t-2 border-black pt-6 space-y-3">
                  <div className="data-label mb-4">Markers tested</div>
                  {['Vitamin D', 'Magnesium', 'hs-CRP (Inflammation)', 'Ferritin (Iron Storage)'].map(m => (
                    <div key={m} className="flex items-center gap-3 font-serif text-base"><CheckSvg />{m}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/kits/energy-recovery" className="block w-full text-center px-6 py-4 border-2 border-black text-black font-sans font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">Order Kit 2</Link>
              </div>
            </div>
            {/* Kit 3 */}
            <div className="border-4 border-black flex flex-col h-full bg-white relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black text-white data-label px-5 py-1.5 border-b-4 border-x-4 border-black">Most complete</div>
              <div className="p-10 flex-grow mt-6">
                <div className="flex justify-between items-start mb-8">
                  <div className="data-label px-3 py-1.5 bg-black text-white border-2 border-black flex items-center gap-2"><span className="w-2 h-2 bg-white" /> Advanced</div>
                  <span className="text-4xl font-sans font-black">£69</span>
                </div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-3">Hormone &amp; Recovery Check</h3>
                <p className="font-serif text-base leading-relaxed mb-8 text-gray-700">Tired, slow to recover, and you don&rsquo;t know if it&rsquo;s hormones, nutrition, or inflammation. This one checks all of them. Seven markers.</p>
                <div className="border-t-2 border-black pt-6 space-y-3">
                  <div className="data-label mb-4">Markers tested</div>
                  {['Total Testosterone, SHBG, Free T', 'Vitamin D', 'Magnesium', 'hs-CRP (Inflammation)', 'Ferritin'].map(m => (
                    <div key={m} className="flex items-center gap-3 font-serif text-base"><CheckSvg />{m}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 pt-0">
                <Link href="/kits/hormone-recovery" className="block w-full text-center px-6 py-4 bg-black text-white font-sans font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black border-2 border-black transition-colors">Order Kit 3</Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/test-selector" className="inline-flex items-center gap-3 font-sans font-black uppercase tracking-widest text-sm border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors">
              Not sure which kit? Take the quiz
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS AFTER */}
      <section className="py-32 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <SectionEyebrow label="After Your Results" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                The result is the start.<br />Not the end.
              </h2>
              <div className="space-y-6 font-serif text-lg leading-relaxed">
                <p>If your result shows a deficiency, you&rsquo;ll see a specific supplement recommendation. Not a guess. Not a generic &ldquo;support your health&rdquo; product. The ingredient directly tied to what your blood is showing.</p>
                <p>If your testosterone is in range, we tell you what that means and when to check it again. If it comes back below 12 nmol/L, you&rsquo;ll see information about the Founding Member programme &mdash; our pathway into TRT once we&rsquo;re CQC registered.</p>
                <p>If everything looks good, we&rsquo;ll tell you that too. No upsell when there&rsquo;s nothing to address.</p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Low Vitamin D or Magnesium', body: 'Daily Stack recommendation. Zinc, Magnesium Glycinate, Vitamin D3, and B12. EFSA-approved claims. Priced at £34.95/month.' },
                { title: 'Elevated hs-CRP with joint symptoms', body: 'Joint & Recovery Collagen recommendation. Hydrolysed collagen peptides plus Vitamin C. Vitamin C contributes to normal collagen formation for the normal function of cartilage. £29.95/month.' },
                { title: 'Testosterone below 12 nmol/L', body: "Founding Member information. A fully refundable £75 deposit that secures your place at the front of the queue when we launch TRT. You're not committing to anything." },
                { title: 'All results in range', body: "A retest reminder at 6 to 12 months. That's it. No product pushed when there's no reason for one." },
              ].map(({ title, body }) => (
                <div key={title} className="glass-panel p-8 border-l-[8px] border-l-black">
                  <strong className="font-sans font-black uppercase tracking-tight text-lg block mb-2">{title}</strong>
                  <p className="font-serif text-base text-gray-700">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DR EWA */}
      <section className="py-32 border-b-4 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="data-label text-gray-400 flex items-center gap-3 mb-8"><span className="w-12 h-[2px] bg-gray-600" />Clinical Oversight</div>
              <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.9] mb-8">
                A real doctor<br />reviewed your result.
              </h2>
              <div className="space-y-6 font-serif text-lg text-gray-300 leading-relaxed">
                <p>Dr Ewa Lindo is a GMC-registered GP, Harley Street-trained in TRT, and the clinical lead at Andro Prime. She signs off every result interpretation that goes into the dashboard.</p>
                <p>This is not AI-generated copy. It is not a generic reference range. It is interpretation written by a doctor who has treated men with exactly these symptoms &mdash; and knows the difference between &ldquo;not clinically deficient&rdquo; and &ldquo;not functioning well.&rdquo;</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-10">
                {['GMC-Registered', 'Harley Street TRT-Trained'].map(label => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 border border-gray-600 data-label !text-gray-400">
                    <span className="w-2 h-2 bg-gray-400" />{label}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-10 bg-white text-black">
              <div className="flex items-start gap-4 mb-8 pb-8 border-b-2 border-black">
                <div className="w-16 h-16 border-2 border-black flex-shrink-0 flex items-center justify-center font-sans font-black text-2xl">EL</div>
                <div>
                  <strong className="font-sans font-black uppercase tracking-tight text-xl block">Dr Ewa Lindo</strong>
                  <span className="data-label text-gray-500">Clinical Lead, Andro Prime</span>
                </div>
              </div>
              <blockquote className="font-serif text-lg leading-relaxed italic">
                &ldquo;The NHS threshold for testosterone deficiency exists to identify men who are clinically ill. It was never designed to tell a 45-year-old whether he&rsquo;s functioning optimally. Most men I see with classic low-T symptoms have levels that would never trigger an NHS referral. That is the gap Andro Prime exists to fill.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ STRIP */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <SectionEyebrow label="Common Questions" />
          <div className="space-y-4 mt-12">
            {faqItems.map(({ q, a }, i) => (
              <details key={q} className="glass-panel group" {...(i === 0 ? { open: true } : {})}>
                <summary className="p-8 cursor-pointer list-none flex items-center justify-between font-sans font-black uppercase tracking-tight text-xl">
                  {q}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="flex-shrink-0 group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
                </summary>
                <div className="px-8 pb-8 font-serif text-lg leading-relaxed text-gray-700 border-t-2 border-black pt-6">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionEyebrow label="Ready" centered dark />
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Stop guessing.<br />Start knowing.
          </h2>
          <p className="text-xl font-serif text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Five minutes. A pre-paid envelope. Results in 48 hours from a UKAS-accredited lab. You already know the GP route hasn&rsquo;t worked. Try the direct route.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#tests" className="bg-white text-black hover:bg-gray-100 font-sans font-black uppercase tracking-widest text-sm px-10 py-4 border-2 border-white transition-colors">Choose your test</Link>
            <Link href="/test-selector" className="border-2 border-white text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-4 transition-colors">Take the quiz first</Link>
          </div>
          <p className="text-sm font-serif text-gray-500 mt-8">No GP required. Discreet packaging. Cancel supplements anytime.</p>
        </div>
      </section>
    </>
  )
}
