import type { Metadata } from 'next'
import Link from 'next/link'
import { panelCardLabels, panelShortLabels } from '@/lib/kits/panel'
import { JsonLd } from '@/components/shared/JsonLd'

/**
 * /how-it-works, rebuilt in Direction F on 2026-08-30 from
 * design/mockups/journey/learn-F.html Frame S (approved 2026-08-29).
 *
 * COPY CARRIED VERBATIM. The approval covers layouts, not copy, and two blocks
 * here are compliance-bearing: the "Where we stand" standing claim is A1 under
 * CA-026 and rendered word for word, and every supplement line is EFSA-scoped.
 *
 * ONE FRAME NOTE IS STALE, DELIBERATELY NOT FOLLOWED. Frame S records this page
 * listing seven markers where the panel has nine, with FAI and Albumin missing.
 * That defect was fixed on 2026-08-29: the marker lists here render from
 * lib/kits/panel.ts, so they cannot drift from the panel again. The frame drew
 * the page as it shipped that day; the code has since moved. Re-introducing the
 * hand-written list to "match the frame" would restore the defect.
 *
 * SectionEyebrow is not used: it is a V2.0 component whose rules are black,
 * uppercase and square. Its F equivalent is the .f-blab / .f-eyebrow pair.
 */

const BASE_URL = 'https://andro-prime.com'

const howItWorksSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'How It Works', item: `${BASE_URL}/how-it-works` },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to take an Andro Prime at-home blood test',
      description:
        'Order your kit, collect a finger-prick sample at home, post it back, and receive your results in your secure dashboard within 2 to 5 working days.',
      totalTime: 'PT5M',
      supply: [
        { '@type': 'HowToSupply', name: 'Lancets (included)' },
        { '@type': 'HowToSupply', name: 'Medical transport vial (included)' },
        { '@type': 'HowToSupply', name: 'Pre-paid return envelope (included)' },
        { '@type': 'HowToSupply', name: 'Step-by-step instructions (included)' },
      ],
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Choose your kit', text: 'Pick the panel that matches what you are feeling.' },
        { '@type': 'HowToStep', position: 2, name: 'Collect your sample', text: 'A finger-prick at home, fasted, first thing in the morning. Five minutes.' },
        { '@type': 'HowToStep', position: 3, name: 'Post it back', text: 'Seal the sample in the transport vial and post it in the pre-paid envelope.' },
        { '@type': 'HowToStep', position: 4, name: 'Read your results', text: 'Results in your dashboard within 2 to 5 working days of the lab receiving your sample.' },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'How At-Home Blood Tests Work',
  description:
    'Order. Test. Know. A finger-prick, a pre-paid envelope, and a UKAS ISO 15189-accredited lab. Results in 2 to 5 working days.',
  alternates: { canonical: 'https://andro-prime.com/how-it-works' },
  openGraph: {
    title: 'How At-Home Blood Tests Work | Andro Prime',
    description:
      'Order. Test. Know. A finger-prick, a pre-paid envelope, and a UKAS ISO 15189-accredited lab. Results in 2 to 5 working days.',
    url: 'https://andro-prime.com/how-it-works',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'How Andro Prime works' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How At-Home Blood Tests Work | Andro Prime',
    description:
      'Order. Test. Know. A finger-prick, a pre-paid envelope, and a UKAS ISO 15189-accredited lab. Results in 2 to 5 working days.',
    images: ['/og/default.png'],
  },
}

const trustItems = [
  { label: 'UKAS ISO 15189', sub: 'Accredited laboratory' },
  { label: 'GMC-registered', sub: 'Clinical oversight' },
  { label: 'Results turnaround', sub: '2 to 5 working days' },
  { label: 'Discreet delivery', sub: 'Plain packaging' },
]

const steps = [
  {
    num: '01',
    title: 'Choose your kit',
    body: "Pick the panel that matches what you're feeling. Not sure? Take the three-question quiz and we'll point you to the right test.",
    footer: ['Action', 'You'],
  },
  {
    num: '02',
    title: 'Collect your sample',
    body: 'Simple finger-prick at home. Takes five minutes. Do it fasted, first thing in the morning, for the most accurate hormone results.',
    footer: ['Time required', '5 mins'],
  },
  {
    num: '03',
    title: 'Post it back',
    body: 'Seal your sample in the medical transport vial included in your kit. Drop it in any Royal Mail priority postbox using the pre-paid envelope.',
    footer: ['Postage', 'Pre-paid'],
  },
  {
    num: '04',
    title: 'Read your results',
    body: 'Results land in your secure dashboard within 2 to 5 working days of the lab receiving your sample. Plain English. What your numbers mean. What to do next.',
    footer: ['Turnaround', '2 to 5 working days'],
  },
]

const kitContents = [
  { n: '1', title: 'Lancets', desc: 'Single-use, sterile. One small prick on your fingertip. Most men describe it as barely noticeable.' },
  { n: '2', title: 'Medical transport vial', desc: "UKAS-approved collection tube. Drop your blood in, seal it, and it's ready to post." },
  { n: '3', title: 'Pre-paid return envelope', desc: 'Royal Mail priority return. Drop it in any postbox. Nothing to print. Nothing to pay.' },
  { n: '4', title: 'Step-by-step instructions', desc: 'Printed clearly in the kit. Also available in your account. There is no step that requires a clinician.' },
]

const dashboardSteps = [
  { n: '1', title: 'Your result. Plain English.', desc: 'Not a reference range. Not a lab code. "Your Vitamin D is 32 nmol/L." That\'s it. You know what you\'re dealing with.' },
  { n: '2', title: 'What it means for you.', desc: 'Based on your numbers and the symptoms you reported. "This is below optimal for energy and muscle function. In the UK between October and March, this is more common than most men realise."' },
  { n: '3', title: 'What the evidence says.', desc: 'Educational, honest, no sales pitch. The research on what moves numbers at your level. Plain-English explanations follow recommendation logic approved by Dr Ewa Lindo, a GMC-registered GP.' },
  { n: '4', title: 'What we recommend. If anything.', desc: "If your result indicates a specific deficiency, we recommend supplements based on your result, with the exact EFSA-approved reason why. Our own Daily Stack and Joint and Recovery Collagen launch shortly; you can join the early-access list at any time. If your result is fine, we tell you that. No upsell when there's nothing to fix." },
  { n: '5', title: 'What to watch next.', desc: 'Every result tells you when it makes sense to retest.' },
]

const KITS = [
  {
    slug: 'testosterone' as const,
    number: 'Kit 1',
    name: 'Testosterone Health Check',
    price: '£99',
    blurb:
      'For men who suspect testosterone might be behind the fatigue, the flat mood, and the loss of drive. GP said normal. Find out if that’s the full picture.',
    markers: panelCardLabels('testosterone'),
  },
  {
    slug: 'energy-recovery' as const,
    number: 'Kit 2',
    name: 'Energy & Recovery Check',
    price: '£119',
    blurb:
      'For active men who are training right, eating right, sleeping right, and still not recovering. This tests the four markers that most directly explain why.',
    markers: panelCardLabels('energy-recovery'),
  },
  {
    slug: 'hormone-recovery' as const,
    number: 'Kit 3',
    name: 'Hormone & Recovery Check',
    price: '£179',
    blurb:
      'Tired, slow to recover, and you don’t know if it’s hormones, nutrition, or inflammation. This one checks all of them. Nine markers.',
    markers: [panelShortLabels('testosterone').join(', '), ...panelCardLabels('energy-recovery')],
  },
]

const afterResults = [
  { title: 'Low Vitamin D or Active B12', body: 'We will recommend our Daily Stack: Zinc, Active B12 (Methylcobalamin), and Vitamin D3, dosed for EFSA-approved claims. Launching shortly. Join the early-access list at any time.' },
  { title: 'Elevated hs-CRP with joint symptoms', body: 'We will recommend our Joint and Recovery Collagen: hydrolysed collagen peptides plus Vitamin C. Vitamin C contributes to normal collagen formation for the normal function of cartilage. Launching shortly. Join the early-access list at any time.' },
  { title: 'Testosterone below 12 nmol/L', body: 'Your next step is a conversation with a GP. You can take a printable summary to your appointment. That result earns us nothing.' },
  { title: 'All results in range', body: "A retest reminder at 6 to 12 months. That's it. No product pushed when there's no reason for one." },
]

const receipts = [
  'Low testosterone results route to a GP, with no upsell.',
  'A printable GP summary you can take to your appointment.',
  'Export your results as CSV, or request erasure, from your account.',
  'Recommendation logic approved by a GMC-registered GP.',
  'A UKAS ISO 15189-accredited lab.',
]

const faqItems = [
  { q: 'Is a finger-prick test as accurate as a venous blood draw?', a: 'Yes, for the markers we test. UKAS-accredited labs validate their finger-prick collection methods against venous samples. Our lab partner is ISO 15189 certified, the same standard as NHS laboratories. The key requirement is correct collection: fasted, first thing in the morning, with a warm hand to encourage blood flow. The instructions in your kit walk you through all of this.' },
  { q: 'How long does the whole process take?', a: 'Five minutes to collect the sample. Royal Mail priority post to the lab. Results are in your dashboard within 2 to 5 working days of the lab receiving your sample.' },
  { q: 'Do I need to do anything to prepare?', a: 'For the most accurate testosterone result: fast overnight and collect your sample first thing in the morning. Testosterone is at its highest in the morning and drops throughout the day. Collecting at the same time of day matters for comparison when you retest. For Kit 2 (energy and recovery markers), fasting is recommended but the timing window is more flexible.' },
  { q: 'What if my result shows something I wasn’t expecting?', a: 'Your dashboard will explain what the result means and what, if anything, to do about it. For most out-of-range results, there is a clear, safe supplement recommendation. For results that warrant GP attention (elevated hs-CRP above 10 mg/L, very low ferritin, or testosterone below 12 nmol/L), we say so directly and tell you what to say to your GP. We do not diagnose conditions. We tell you what your blood is showing and what the evidence suggests.' },
  { q: 'Can I share my results with my GP?', a: 'Yes. Your dashboard lets you download a PDF of your results. The lab report includes the full panel data from a UKAS-accredited facility. Most GPs will accept this. Some may want to re-run on their own system (which is their right) but having your Andro Prime results in hand puts you in a far stronger position going into that conversation.' },
]

export default function HowItWorksPage() {
  return (
    <div className="f-page">
      <JsonLd data={howItWorksSchema} />

      {/* ---------- HERO ---------- */}
      <section className="f-wrap f-sec">
        <div className="f-rise">
          <div className="f-btns" style={{ marginBottom: 18 }}>
            <span className="f-eyebrow"><i />Methodology</span>
            <span className="f-kchip">5 minutes. No GP needed.</span>
          </div>
          <h1 className="f-h1">
            Order.<br />Test.<br />Know.
          </h1>
          <p className="f-stand" style={{ marginTop: 20 }}>
            A finger-prick, a pre-paid envelope, and a UKAS ISO 15189-accredited lab. Your results
            are in your dashboard in 2 to 5 working days. In plain English, with a specific
            recommendation based on your actual numbers.
          </p>
        </div>
      </section>

      {/*
        ---------- TRUST BAR ----------
        .f-trustrow already IS a card: it draws its own hairline grid, radius and
        clipping. Wrapping it in a tray/core would double the surface and stack
        three lots of padding, which is what the first pass did.
      */}
      <section className="f-wrap">
        <div className="f-trustrow">
          {trustItems.map(({ label, sub }) => (
            <div key={label}>
              <span className="f-trust-l">{label}</span>
              <span className="f-trust-s">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FOUR STEPS ---------- */}
      <section className="f-wrap f-sec">
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Four steps.<br />Done in a week.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Order your kit, take your sample at home, post it back. Results are in your dashboard
          within 2 to 5 working days of the lab receiving it.
        </p>

        <div className="f-steps" style={{ marginTop: 24 }}>
          {steps.map((s) => (
            <div className="f-step" key={s.num}>
              <span className="f-bignum" aria-hidden="true">{s.num}</span>
              <h3 className="f-h4">{s.title}</h3>
              <p className="f-sub" style={{ fontSize: 15, marginTop: 8 }}>{s.body}</p>
              <div className="f-step-foot">
                <span>{s.footer[0]}</span>
                <b>{s.footer[1]}</b>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- THE LAB ---------- */}
      <section className="f-wrap f-sec">
        <div className="f-splitgrid">
          <div>
            <p className="f-blab">The lab</p>
            <h2 className="f-h2">UKAS-accredited.<br />Not a device.<br />An actual lab.</h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              Your sample is analysed by a UK laboratory <strong>accredited to ISO 15189 by
              UKAS</strong>. That&rsquo;s the same standard used by NHS labs.
            </p>
            <p className="f-sub">
              This isn&rsquo;t a home device giving you an approximation. It&rsquo;s a UKAS ISO
              15189-accredited lab test, processed in a certified facility, with a quality standard
              that is independently verified.
            </p>
            <p className="f-pull">
              The result you see is the same class of result your GP would order. You just
              didn&rsquo;t have to wait three weeks for an appointment.
            </p>
            <div className="f-btns" style={{ marginTop: 20 }}>
              <span className="f-kchip">UKAS ISO 15189</span>
              <span className="f-kchip">Results in 2 to 5 working days</span>
            </div>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">What your kit contains</p>
              <div className="f-numlist">
                {kitContents.map(({ n, title, desc }) => (
                  <div key={n}>
                    <span className="f-numdot">{n}</span>
                    <div>
                      <h3 className="f-h4">{title}</h3>
                      <p className="f-sub" style={{ fontSize: 14.5, marginTop: 4 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DASHBOARD ---------- */}
      <section className="f-wrap f-sec">
        <p className="f-blab">Your dashboard</p>
        <h2 className="f-h2">Not a lab report.<br />An actual answer.</h2>

        <div className="f-tray" style={{ marginTop: 22 }}>
          <div className="f-core">
            <div className="f-numlist">
              {dashboardSteps.map(({ n, title, desc }) => (
                <div key={n}>
                  <span className="f-numdot">{n}</span>
                  <div>
                    <h3 className="f-h4">{title}</h3>
                    <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- THREE KITS ---------- */}
      <section className="f-wrap f-sec">
        <p className="f-blab">The three kits</p>
        <h2 className="f-h2">Start with what&rsquo;s bothering you most.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Each kit tests the markers that explain what you&rsquo;re feeling. Not sure which one is
          right? Take the quiz.
        </p>

        <div className="f-bios" style={{ marginTop: 24 }}>
          {KITS.map((k) => (
            <div className="f-bio" key={k.slug}>
              <div className="f-kithead" style={{ marginBottom: 4 }}>
                <span className="f-kchip">{k.number}</span>
                <span className="f-price" style={{ fontSize: 24 }}>{k.price}</span>
              </div>
              <h3>{k.name}</h3>
              <p>{k.blurb}</p>
              <ul className="f-ticks" style={{ marginTop: 14 }}>
                {k.markers.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <Link href={`/kits/${k.slug}`} className="f-btn f-btn-sm f-btn-ghost" style={{ marginTop: 18, justifyContent: 'center' }}>
                Order {k.number}
              </Link>
            </div>
          ))}
        </div>

        <div className="f-btns" style={{ marginTop: 20 }}>
          <Link href="/test-selector" className="f-btn f-btn-ghost f-btn-sm">
            Not sure? Take the quiz <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      </section>

      {/* ---------- AFTER YOUR RESULTS ---------- */}
      <section className="f-wrap f-sec">
        <div className="f-splitgrid">
          <div>
            <p className="f-blab">After your results</p>
            <h2 className="f-h2">The result is the start.<br />Not the end.</h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              If your result shows a deficiency, you&rsquo;ll see a specific supplement
              recommendation. Not a guess. Not a generic &ldquo;support your health&rdquo; product.
              We will recommend supplements based on your result. Our own Daily Stack and Joint and
              Recovery Collagen launch shortly; you can join the early-access waitlist at any time.
            </p>
            <p className="f-sub">
              If your testosterone is in range, we tell you what that means and when to check it
              again. If it comes back below 12 nmol/L, your next step is a conversation with a GP,
              and we give you a printable summary to take to that appointment. That result earns us
              nothing.
            </p>
            <p className="f-sub">
              If everything looks good, we&rsquo;ll tell you that too. No upsell when there&rsquo;s
              nothing to address.
            </p>
          </div>

          <div className="f-faqgrid f-onecol">
            {afterResults.map(({ title, body }) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        ---------- WHERE WE STAND ----------
        A1 under CA-026. The claim below is rendered VERBATIM and is not editable
        without a compliance pre-flight.
      */}
      <section className="f-wrap f-sec">
        <div className="f-splitgrid">
          <div>
            <p className="f-blab">Where we stand</p>
            <p className="f-stand" style={{ marginTop: 12, fontSize: 'clamp(1.25rem, 2.4vw, 1.7rem)' }}>
              Testing and selling are kept apart at Andro Prime. You pay one price for the test. Any
              result that needs a doctor, low testosterone included, goes to a GP, and those results
              earn us nothing.
            </p>
          </div>
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Already live in your account</p>
              <ul className="f-ticks">
                {receipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DR EWA ---------- */}
      <section className="f-wrap f-sec">
        <div className="f-invert">
          <div className="f-splitgrid">
            <div>
              <p className="f-blab f-invert-lab">Clinical oversight</p>
              <h2 className="f-h2 f-invert-h">A real doctor<br />designed your report.</h2>
              <p className="f-sub f-invert-p" style={{ marginTop: 16 }}>
                Dr Ewa Lindo is a GMC-registered GP with specialist training in men&rsquo;s hormonal
                health, and the clinical lead at Andro Prime. She sets and signs off the healthy
                ranges your results are measured against, and the plain-English explanation of every
                marker in your dashboard.
              </p>
              <p className="f-sub f-invert-p">
                This is not AI-generated copy. It is not a generic reference range. The ranges and
                plain-English explanations are set and signed off by a doctor who has seen men with
                exactly these symptoms, and who knows the difference between &ldquo;not clinically
                deficient&rdquo; and &ldquo;not functioning well.&rdquo;
              </p>
            </div>

            <div className="f-quotecard">
              <div className="f-quotehead">
                <span className="f-initials">EL</span>
                <div>
                  <strong>Dr Ewa Lindo</strong>
                  <span className="f-blab" style={{ marginBottom: 0 }}>Clinical Lead, Andro Prime</span>
                </div>
              </div>
              <blockquote>
                &ldquo;The NHS threshold for testosterone deficiency exists to identify men who are
                clinically ill. It was never designed to tell a 45-year-old whether he&rsquo;s
                functioning optimally. Most men I see with classic low-T symptoms have levels that
                would never trigger an NHS referral. That is the gap Andro Prime exists to fill.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="f-wrap f-sec">
        <p className="f-blab">Common questions</p>
        <h2 className="f-h2">Before you order.</h2>

        <div className="f-faqgrid" style={{ marginTop: 22 }}>
          {faqItems.map(({ q, a }) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CLOSE ---------- */}
      <section className="f-wrap f-sec">
        <div className="f-close">
          <p className="f-blab">Ready when you are</p>
          <h2>Order. Test. Know.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            Pick the panel that matches what you&rsquo;re feeling, or let the selector do it for you.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">
              See the tests <span aria-hidden="true">&#8594;</span>
            </Link>
            <Link href="/test-selector" className="f-btn f-btn-ghost">
              Use the selector
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
