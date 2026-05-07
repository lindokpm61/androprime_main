import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

const factsSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'The Facts', item: `${BASE_URL}/faq` },
  ],
}

export const metadata: Metadata = {
  title: 'The Facts | Andro Prime',
  description: "The facts about testosterone, men's health testing, and why your GP said normal but you still feel terrible. No fluff. Just data.",
  alternates: { canonical: 'https://andro-prime.com/faq' },
  openGraph: {
    title: 'The Facts | Andro Prime',
    description: "The facts about testosterone, men's health testing, and why your GP said normal but you still feel terrible. No fluff. Just data.",
    url: 'https://andro-prime.com/faq',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime — The Facts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Facts | Andro Prime',
    description: "The facts about testosterone, men's health testing, and why your GP said normal but you still feel terrible.",
    images: ['/og/default.png'],
  },
}

const CheckSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
)

const XSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="flex-shrink-0 mt-1 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)

const markerRows = [
  { marker: 'Total Testosterone', measures: 'Total circulating testosterone in the blood', why: 'The primary male sex hormone. Affects energy, libido, muscle mass, mood, and drive.', kit: 'Kit 1 & Kit 3', alt: false },
  { marker: 'SHBG', measures: 'Sex hormone-binding globulin', why: 'Binds to testosterone and renders it inactive. High SHBG means less testosterone available to your cells regardless of total T.', kit: 'Kit 1 & Kit 3', alt: true },
  { marker: 'Free Testosterone', measures: 'Calculated from Total T and SHBG', why: 'The biologically active fraction. This is what your body actually uses. The full picture requires both Total T and SHBG.', kit: 'Kit 1 & Kit 3', alt: false },
  { marker: 'Vitamin D', measures: '25-hydroxyvitamin D (total)', why: 'Supports muscle function, immune response, and energy. Most UK men are below optimal between October and April.', kit: 'Kit 2 & Kit 3', alt: true },
  { marker: 'Active B12', measures: 'Holotranscobalamin (active form)', why: 'The form of B12 your cells can actually use. Standard B12 tests measure total serum B12 which includes inactive fractions. Active B12 shows what is truly available. Deficiency is more common in men over 40 and those on plant-based diets.', kit: 'Kit 2 & Kit 3', alt: false },
  { marker: 'hs-CRP', measures: 'High-sensitivity C-reactive protein', why: 'Systemic inflammation marker. Elevated hs-CRP is directly associated with slower recovery, joint soreness, and reduced training adaptation.', kit: 'Kit 2 & Kit 3', alt: true },
  { marker: 'Ferritin', measures: 'Iron storage marker', why: 'Low ferritin limits oxygen delivery to muscles and tissues. Causes fatigue and stamina decline that is often mistaken for overtraining or low testosterone.', kit: 'Kit 2 & Kit 3', alt: false },
]

export default function FaqPage() {
  return (
    <>
      <JsonLd data={factsSchema} />
      {/* HERO */}
      <header className="pt-24 pb-20 border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 bg-black" /> Evidence-based
            </div>
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">No fluff. Just data.</div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-[90px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
            What&rsquo;s actually<br />happening to<br />men over 35.
          </h1>
          <p className="text-2xl md:text-3xl text-black font-serif leading-relaxed max-w-3xl">
            Testosterone. Vitamin D. Active B12. Inflammation. These aren&rsquo;t wellness buzzwords. They are four of the key systems that directly explain why men over 35 stop feeling like themselves. Here are the facts.
          </p>
        </div>
      </header>

      {/* CONTENTS NAV */}
      <div className="border-b-4 border-black bg-gray-50 py-8 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-6 items-center">
            <span className="data-label text-gray-500">Jump to:</span>
            {['Testosterone', 'Vitamin D', 'Active B12', 'Inflammation', 'The NHS Gap', 'What We Test'].map((label) => {
              const id = label.toLowerCase().replace(/ /g, '-').replace('what-we-test', 'the-test')
              return (
                <a key={label} href={`#${id === 'what-we-test' ? 'the-test' : id}`} className="font-sans font-black uppercase tracking-widest text-xs hover:underline">{label}</a>
              )
            })}
          </div>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="py-20 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
            {[
              { stat: '1%', label: 'Per year', body: 'The rate at which testosterone declines in men from the age of 30. By 45, the average man has lost 10 to 15% of his peak testosterone. By 55, closer to 25%.' },
              { stat: '56%', label: 'Of UK men', body: 'UK men are estimated to be below optimal Vitamin D levels. Between October and April, even outdoor workers cannot produce sufficient Vitamin D from sunlight alone.' },
              { stat: '20%', label: 'Are deficient', body: 'An estimated 20% of UK adults have Active B12 levels below the threshold needed for normal cell function. The figure is higher in men over 40 and those who avoid meat or dairy. Standard B12 tests often miss it because they measure inactive fractions.' },
            ].map(({ stat, label, body }) => (
              <div key={stat} className="p-10 md:p-12">
                <div className="font-sans font-black text-[80px] md:text-[100px] leading-none tracking-tighter text-black">{stat}</div>
                <p className="font-sans font-black uppercase tracking-tight text-lg mt-4 mb-3">{label}</p>
                <p className="font-serif text-base text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTOSTERONE */}
      <section id="testosterone" className="py-32 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <SectionEyebrow label="Testosterone" />
              <h2 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                &ldquo;Normal&rdquo; is not<br />the same as good.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>The NHS reference range for testosterone in men is roughly 8 to 30 nmol/L. That range was built to identify clinical hypogonadism: the level at which a man is medically deficient. A man at 8.5 nmol/L and a man at 24 nmol/L both get the same result from their GP: normal.</p>
                <p>They are not the same. Not in how they feel. Not in their energy, recovery, or mental sharpness. The range exists to identify illness, not to optimise performance.</p>
                <div className="pl-6 border-l-[6px] border-black py-2 my-8 bg-gray-50">
                  <p className="font-bold italic text-2xl leading-snug">&ldquo;GP said normal. That&rsquo;s not the same as good.&rdquo;</p>
                </div>
                <p>Research consistently shows that men with testosterone levels in the lower third of the &ldquo;normal&rdquo; range report significantly higher rates of fatigue, reduced libido, slower recovery, and mood changes than men in the upper third, despite both being technically &ldquo;not ill.&rdquo;</p>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-black text-white p-10 border-4 border-black">
                <div className="data-label text-gray-400 mb-6">Testosterone: what the numbers mean</div>
                <div className="space-y-6">
                  {[
                    { range: '< 8 nmol/L', title: 'Below NHS threshold', desc: 'NHS referral territory. Speak to your GP.' },
                    { range: '8–12 nmol/L', title: 'Borderline', desc: 'Often dismissed by GPs. Symptoms are typically present. Founding Member territory.' },
                    { range: '12–20 nmol/L', title: 'In range. Not optimal.', desc: 'Where most men with symptoms sit. Technically "normal." Functionally below par.' },
                    { range: '> 20 nmol/L', title: 'Healthy range', desc: 'Most men with these levels feel well. Retest in 6 to 12 months.' },
                  ].map(({ range, title, desc }, i, arr) => (
                    <div key={range} className={`flex items-start gap-4 ${i < arr.length - 1 ? 'pb-4 border-b border-gray-700' : ''}`}>
                      <div className="w-24 flex-shrink-0 font-mono font-black text-sm text-gray-400">{range}</div>
                      <div>
                        <strong className="font-sans font-black uppercase tracking-tight block text-white">{title}</strong>
                        <span className="font-serif text-sm text-gray-400">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-8">
                <div className="data-label mb-4">Also tested with testosterone</div>
                <ul className="space-y-4 font-serif text-base">
                  <li className="flex items-start gap-3">
                    <span className="font-sans font-black uppercase tracking-tight text-sm block mt-0.5 flex-shrink-0">SHBG</span>
                    <p className="text-gray-600">Sex hormone-binding globulin. SHBG binds to testosterone and makes it inactive. A high SHBG can leave a man with technically &ldquo;normal&rdquo; total T but very low free T, the form that actually matters.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-sans font-black uppercase tracking-tight text-sm block mt-0.5 flex-shrink-0">Free T</span>
                    <p className="text-gray-600">Calculated from Total T and SHBG. This is what your body can actually use. Two men can have identical total testosterone but very different free testosterone. Total T alone is an incomplete picture.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VITAMIN D */}
      <section id="vitamin-d" className="py-32 border-b-4 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <SectionEyebrow label="Vitamin D" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                You can&rsquo;t eat or train<br />your way out of this one.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>Vitamin D is produced in the skin when it&rsquo;s exposed to UVB radiation from sunlight. Between October and April in the UK, the angle of the sun is too low to trigger this reaction. For roughly six months of the year, no amount of time outdoors will produce meaningful Vitamin D.</p>
                <p>Very few foods contain meaningful amounts of Vitamin D. The NHS advises everyone in the UK to consider supplementation from October to March. Most men don&rsquo;t.</p>
                <p>Vitamin D receptors are present in muscle tissue, the brain, and the immune system. Low Vitamin D directly affects energy, muscle function, and how quickly you recover from training.</p>
              </div>
              <div className="mt-10 p-6 bg-white border-2 border-black">
                <div className="data-label mb-4">EFSA-approved health claim</div>
                <p className="font-serif text-base font-bold italic">&ldquo;Vitamin D contributes to normal muscle function.&rdquo;</p>
                <p className="font-serif text-sm text-gray-600 mt-2">This is the legally verified claim we can make. Not more, not less.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-10 border-l-[12px] border-l-black">
                <div className="data-label mb-6">Vitamin D: what the numbers mean</div>
                <div className="space-y-5">
                  {[
                    { range: '< 25 nmol/L', title: 'Deficient', desc: 'Associated with bone health issues, significant energy loss, muscle weakness. NHS will typically treat at this level.' },
                    { range: '25–50 nmol/L', title: 'Insufficient', desc: 'Where most UK men sit in winter. Noticeable impact on energy and recovery. Common Andro Prime trigger.' },
                    { range: '50–75 nmol/L', title: 'Adequate', desc: 'Functional. Most people feel reasonably well at this level.' },
                    { range: '75–125 nmol/L', title: 'Optimal', desc: 'The range most research associates with peak muscle function, immune support, and energy. Target for supplementation.' },
                  ].map(({ range, title, desc }, i, arr) => (
                    <div key={range} className={`flex items-start gap-4 ${i < arr.length - 1 ? 'pb-4 border-b-2 border-gray-200' : ''}`}>
                      <div className="font-mono font-black text-sm text-gray-500 w-28 flex-shrink-0">{range}</div>
                      <div>
                        <strong className="font-sans font-black uppercase tracking-tight block">{title}</strong>
                        <span className="font-serif text-sm text-gray-600">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-8">
                <div className="data-label mb-4">What we recommend if yours is low</div>
                <p className="font-serif text-base leading-relaxed">The Daily Stack contains 4,000 IU of Vitamin D3. This is the dose most research suggests for moving levels from insufficient to optimal within 8 to 12 weeks. Diet alone is insufficient for most men in the UK.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE B12 */}
      <section id="active-b12" className="py-32 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="glass-panel p-10 border-l-[12px] border-l-black">
                <div className="data-label mb-6">Why standard B12 tests miss the problem</div>
                <div className="space-y-5 font-serif text-base leading-relaxed">
                  <p>Most B12 blood tests measure total serum B12, which includes both the active and inactive fractions. You can have a technically &ldquo;normal&rdquo; total B12 result while your active B12 (the fraction your cells can actually use) is well below optimal.</p>
                  <p>Active B12 (Holotranscobalamin) is the specific marker that shows what&rsquo;s available to your cells. It&rsquo;s a more sensitive and clinically meaningful measure, and it&rsquo;s what we test.</p>
                  <p>Deficiency becomes more common after 40. The stomach produces less intrinsic factor with age, which is required to absorb B12 from food. Plant-based diets significantly increase the risk regardless of age.</p>
                </div>
              </div>
              <div className="bg-black text-white p-8">
                <div className="data-label text-gray-400 mb-4">EFSA-approved health claims</div>
                <p className="font-serif text-lg font-bold italic">&ldquo;Vitamin B12 contributes to normal energy-yielding metabolism.&rdquo;</p>
                <p className="font-serif text-lg font-bold italic mt-3">&ldquo;Vitamin B12 contributes to normal psychological function.&rdquo;</p>
                <p className="font-serif text-sm text-gray-400 mt-3">These are the legally verified claims. Not marketing lines.</p>
              </div>
              <div className="glass-panel p-8">
                <div className="data-label mb-4">What we recommend if yours is low</div>
                <p className="font-serif text-base leading-relaxed">The Daily Stack contains 1,000mcg of Active B12 as Methylcobalamin. Methylcobalamin is the bioactive form: it is used directly by the body without requiring conversion. Most cheaper supplements use Cyanocobalamin, which your body must convert before it can use it. The form matters.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionEyebrow label="Active B12" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Your GP test<br />probably missed it.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>B12 plays a central role in energy metabolism, neurological function, and red blood cell production. When it&rsquo;s low, energy drops, mental sharpness suffers, and recovery slows. These are symptoms easy to attribute to stress, age, or overtraining.</p>
                <p>The problem is that B12 deficiency is routinely underdiagnosed. GPs test total serum B12 when they test it at all. A result that comes back &ldquo;normal&rdquo; on that test can still indicate a functional deficiency when Active B12 is measured directly.</p>
                <p>For men over 40, this is one of the more common findings. It is also one of the most straightforward to address, with the right form of supplementation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFLAMMATION */}
      <section id="inflammation" className="py-32 border-b-4 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <SectionEyebrow label="hs-CRP & Inflammation" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Sore for three days.<br />Not just bad luck.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>hs-CRP (high-sensitivity C-reactive protein) is a marker of systemic inflammation. When inflammation is elevated, the body&rsquo;s ability to repair and recover is compromised. Training feels harder. Recovery takes longer. Joint stiffness becomes a fixture rather than an occasional irritation.</p>
                <p>In active men, mildly elevated hs-CRP often reflects connective tissue stress. The body is dealing with more repair demand than it has the resources to handle, particularly when Vitamin D and Active B12 are also low, both of which support recovery processes.</p>
                <div className="pl-6 border-l-[6px] border-black py-2 my-8 bg-white">
                  <p className="font-bold italic">Elevated inflammation is not something to push through. It&rsquo;s information. It means something is causing the body to remain in a repair state.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-10">
                <div className="data-label mb-6">hs-CRP: what the numbers mean</div>
                <div className="space-y-5">
                  {[
                    { range: '< 1 mg/L', title: 'Low risk', desc: 'Normal. No action required for inflammation specifically.' },
                    { range: '1–3 mg/L', title: 'Mildly elevated', desc: 'Common in active men. Often reflects training stress. Collagen recommended if joint symptoms are present.' },
                    { range: '3–10 mg/L', title: 'Elevated', desc: 'Recovery deficit likely significant. Collagen recommended with joint symptoms. GP review if it stays elevated on retest.' },
                    { range: '> 10 mg/L', title: 'High: see your GP', desc: "At this level, we don't recommend a supplement. We tell you to book a GP appointment. This warrants a conversation with a doctor." },
                  ].map(({ range, title, desc }, i, arr) => (
                    <div key={range} className={`flex items-start gap-4 ${i < arr.length - 1 ? 'pb-4 border-b-2 border-gray-200' : ''}`}>
                      <div className="font-mono font-black text-sm text-gray-500 w-28 flex-shrink-0">{range}</div>
                      <div>
                        <strong className="font-sans font-black uppercase tracking-tight block">{title}</strong>
                        <span className="font-serif text-sm text-gray-600">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-8 border-l-[8px] border-l-black">
                <div className="data-label mb-4">Also tested: Ferritin</div>
                <p className="font-serif text-base leading-relaxed text-gray-700">Ferritin is the body&rsquo;s iron storage marker. Low ferritin means your muscles and tissues aren&rsquo;t getting enough oxygen-carrying capacity, which directly affects stamina and recovery. If ferritin comes back low, we refer you to your GP. Iron supplementation needs to be dosed based on your specific levels. Getting it wrong can cause harm. We won&rsquo;t sell you iron.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE NHS GAP */}
      <section id="the-nhs-gap" className="py-32 border-b-4 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="data-label text-gray-400 flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-gray-600" />The NHS Gap
              </div>
              <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter leading-[0.9] mb-8">
                The system is<br />designed for<br />illness.<br />
                <span className="text-gray-500">Not performance.</span>
              </h2>
              <div className="space-y-6 text-xl font-serif text-gray-300 leading-relaxed">
                <p>The NHS testosterone threshold exists to identify men who are clinically hypogonadal, men who have a diagnosable deficiency that warrants treatment. It was designed for that purpose and it does that job well.</p>
                <p>It was not designed to answer the question: &ldquo;Am I functioning at a level that matches how I should feel at my age?&rdquo; That is a different question. The NHS does not have the infrastructure, the appointment time, or the clinical mandate to answer it for most men.</p>
                <p>This is not a criticism of GPs. It&rsquo;s a structural reality. GPs have eight-minute appointments and clinical thresholds to work within. Optimisation is outside their scope in that context.</p>
                <div className="mt-8 p-8 border-2 border-gray-700">
                  <p className="text-2xl font-serif font-bold italic leading-relaxed">&ldquo;Your GP isn&rsquo;t wrong. They&rsquo;re answering a different question. We answer yours.&rdquo;</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="border-2 border-gray-700 p-8">
                <h3 className="font-sans font-black uppercase tracking-tighter text-xl mb-6 border-b border-gray-700 pb-4">Why men don&rsquo;t get tested</h3>
                <ul className="space-y-5 font-serif text-gray-300">
                  {[
                    'GPs will often decline a testosterone test unless symptoms are severe enough to suggest clinical deficiency. "Tired and unmotivated" doesn\'t usually qualify.',
                    'If a test is granted, the result is returned as "normal" or "abnormal" without contextual interpretation for where in the range you sit.',
                    'Vitamin D, Active B12, and hs-CRP are rarely tested together unless there is a specific clinical reason. A man with fatigue from three combined deficiencies will often get a "you\'re fine" across the board.',
                    'Private comprehensive testing typically starts at £150 to £200, often requiring a consultation before any blood is drawn. Medichecks gives you numbers but no interpretation and no recommendation.',
                  ].map((item) => (
                    <li key={item.slice(0, 30)} className="flex items-start gap-4"><XSvg /><p>{item}</p></li>
                  ))}
                </ul>
              </div>
              <div className="border-2 border-gray-700 p-8">
                <h3 className="font-sans font-black uppercase tracking-tighter text-xl mb-4">What Andro Prime does differently</h3>
                <p className="font-serif text-gray-300 text-base leading-relaxed">We test the markers that matter for how men over 35 feel and perform. We interpret them in plain English. And we make a specific recommendation, only when the data supports one.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE TEST */}
      <section id="the-test" className="py-32 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionEyebrow label="Our Tests" centered />
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Every marker we test.<br />Why it&rsquo;s in there.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">Nothing is included because it sounds impressive. Everything is included because it directly explains something specific about how you feel.</p>
          </div>

          <div className="overflow-x-auto border-4 border-black mb-12">
            <table className="w-full text-left font-serif text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 font-sans font-black uppercase tracking-widest text-xs border-r-2 border-gray-700">Marker</th>
                  <th className="p-4 font-sans font-black uppercase tracking-widest text-xs border-r-2 border-gray-700">What it measures</th>
                  <th className="p-4 font-sans font-black uppercase tracking-widest text-xs border-r-2 border-gray-700">Why it matters</th>
                  <th className="p-4 font-sans font-black uppercase tracking-widest text-xs">Included in</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {markerRows.map(({ marker, measures, why, kit, alt }) => (
                  <tr key={marker} className={`border-b-2 border-gray-200 hover:bg-gray-50 ${alt ? 'bg-gray-50' : ''}`}>
                    <td className="p-4 border-r-2 border-gray-200 font-sans font-black">{marker}</td>
                    <td className="p-4 border-r-2 border-gray-200">{measures}</td>
                    <td className="p-4 border-r-2 border-gray-200">{why}</td>
                    <td className="p-4"><span className="data-label bg-gray-100 px-2 py-1 border border-black">{kit}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-4 p-6 border-2 border-black bg-gray-50 max-w-4xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p className="font-serif text-base leading-relaxed">These markers were chosen because they are the most clinically relevant indicators of the specific symptoms this cohort presents with: fatigue, slow recovery, low drive. We don&rsquo;t test 30 markers to make the panel look impressive. We test the seven that actually answer the question.</p>
          </div>
        </div>
      </section>

      {/* SUPPLEMENT HONESTY */}
      <section className="py-32 border-b-4 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <SectionEyebrow label="On Supplements" />
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                We don&rsquo;t trust<br />supplements either.<br />
                <span className="text-gray-400">Unless there&rsquo;s a reason.</span>
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>We will not recommend a supplement unless your blood result shows a specific deficiency that it directly addresses. If your Vitamin D is fine, you will not see a Daily Stack recommendation. If your inflammation is mildly elevated but you don&rsquo;t have joint symptoms, you won&rsquo;t see a Collagen recommendation.</p>
                <p>Every ingredient in our supplements has an EFSA-approved health claim. That means the European Food Safety Authority has reviewed the evidence and confirmed the claim is substantiated. We use the exact approved language, nothing more.</p>
                <p>Our supplements do not diagnose, treat, or cure. They support normal physiological function where a deficiency has been confirmed. That is an important distinction and we will always be straight about it.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-8 border-l-[8px] border-l-black">
                <h3 className="font-sans font-black uppercase tracking-tight text-xl mb-4">Daily Stack</h3>
                <p className="font-serif text-base text-gray-700 mb-4">Zinc, Active B12 (Methylcobalamin), Vitamin D3. £34.95/month.</p>
                <div className="space-y-2 text-sm font-serif text-gray-600">
                  <p><strong className="font-sans font-black uppercase tracking-tight text-xs">Zinc:</strong> &ldquo;Contributes to the maintenance of normal testosterone levels.&rdquo;</p>
                  <p><strong className="font-sans font-black uppercase tracking-tight text-xs">Active B12:</strong> &ldquo;Contributes to normal energy-yielding metabolism.&rdquo;</p>
                  <p><strong className="font-sans font-black uppercase tracking-tight text-xs">Vitamin D3:</strong> &ldquo;Contributes to normal muscle function.&rdquo;</p>
                </div>
              </div>
              <div className="glass-panel p-8 border-l-[8px] border-l-black">
                <h3 className="font-sans font-black uppercase tracking-tight text-xl mb-4">Joint &amp; Recovery Collagen</h3>
                <p className="font-serif text-base text-gray-700 mb-4">Hydrolysed collagen peptides plus Vitamin C. £29.95/month. Only recommended when hs-CRP is elevated AND joint symptoms are present.</p>
                <div className="text-sm font-serif text-gray-600">
                  <p><strong className="font-sans font-black uppercase tracking-tight text-xs">Vitamin C:</strong> &ldquo;Contributes to normal collagen formation for the normal function of cartilage.&rdquo;</p>
                </div>
              </div>
              <div className="p-6 bg-black text-white">
                <p className="font-sans font-black uppercase tracking-tight text-lg mb-2">We do not recommend supplements when there is nothing to address.</p>
                <p className="font-serif text-sm text-gray-300">If your results come back fully in range, your dashboard will say so. No product, no upsell. Come back in six months for a retest.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionEyebrow label="Ready to find out" centered dark />
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Find out what<br />your blood is<br />telling you.
          </h2>
          <p className="text-xl font-serif text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            £99 to £179. Five minutes. Results in 48 hours. A UKAS-accredited lab. Plain English. A specific recommendation based on your actual numbers.
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
