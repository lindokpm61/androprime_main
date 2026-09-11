import type { Metadata } from 'next'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { MembershipDisclosure } from '@/components/commerce/MembershipDisclosure'
import { READOUT_KIT_2 } from '@/lib/kits/sampleReadout'

/**
 * /lp/energy-recovery, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Read `/lp/testosterone`'s header first: the frame position, the sample-report
 * extraction and the standing contradiction in the closing block all apply here
 * unchanged.
 *
 * EVERY WORD IS VERBATIM. The headline, the standfirst, the CTA labels, the
 * reality paragraphs, the pull quote, all four "what we test" entries, the four
 * process steps, all four "built for" lines, both attributed quotations, all FAQ
 * answers, the GP paragraph, the five feature lines and the price block are
 * byte-identical to the V2.0 page.
 *
 * 🔴 THE SAMPLE REPORT CARRIED FOUR OF THE TWELVE LIVE VERDICT-VOCABULARY
 * DEFECTS, AND IT IS NOW THE SWEPT DATA. DESIGN.md gap 9 records that the
 * compliance scanner's first run found twelve live instances of the retired
 * Normal / Borderline / Low / Suboptimal / Elevated vocabulary on `main`, **four
 * of them on this page**. The `/kits/*` pages were swept on 2026-09-02 and
 * `/lp/*` never was. The rows now come from `lib/kits/sampleReadout.ts`, the same
 * data `/kits/energy-recovery` renders, so the verdict words are the engine's own
 * from `lib/results/resultSeverity.ts` rather than a second hand-typed set. A
 * redesign may not re-type a clinical verdict.
 *
 * ⚠ THE CLOSING BLOCK STILL READS "Secure checkout. No subscription." Under the
 * 2026-09-07 auto-renew ruling every kit buyer starts a subscription on day 31,
 * so that sentence is false the moment `MEMBERSHIP_ENABLED` goes on. It is
 * rendered UNCHANGED because rewriting approved copy is a pre-flight decision.
 * Registered; `scripts/verify-subscription-claims.js` fails the build if the flag
 * is on while it remains. **Owed to Keith, then pre-flight.**
 */

const BASE_URL = 'https://andro-prime.com'

const FAQ_ITEMS = [
  { question: 'How long do results take?', answer: 'Most results are ready within 2 to 5 working days of the lab receiving your sample. Some can take a little longer, depending on sample quality, postal transit and lab workload.' },
  { question: 'Does the £119 cover everything?', answer: 'Yes. The kit, the lab analysis for all four biomarkers, and the prepaid return postage are all included. No hidden fees.' },
  { question: 'Is my data private?', answer: 'Your results sit in your private dashboard, yours to share with whoever you choose. We do not sell your data, and we do not share it for advertising.' },
  { question: 'I already take supplements. Is this worth it?', answer: "Especially if you already take supplements. Most men are guessing which ones they need. This test tells you which deficiencies you actually have, so you stop spending money on things you don't need." },
]

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Energy & Recovery Check', item: `${BASE_URL}/lp/energy-recovery` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/lp/energy-recovery/#product`,
      name: 'Energy & Recovery Check: At-Home Blood Test Kit',
      description: 'Tests Vitamin D, Active B12, hs-CRP and Ferritin. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-02',
      offers: {
        '@type': 'Offer',
        price: '119.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/energy-recovery`,
        priceValidUntil: '2027-12-31',
        seller: { '@type': 'Organization', name: 'Andro Prime' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
}

export const metadata: Metadata = {
  title: 'Energy & Recovery Blood Test UK | At-Home Kit £119',
  description: 'At-home blood test for energy and recovery. Vitamin D, Active B12, hs-CRP and Ferritin. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days. £119.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Energy & Recovery Blood Test UK | £119 | Andro Prime',
    description: 'Vitamin D, Active B12, hs-CRP and Ferritin. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
    url: 'https://andro-prime.com/lp/energy-recovery',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Energy and Recovery Check: Kit 2' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Energy & Recovery Blood Test UK | £119 | Andro Prime',
    description: 'Vitamin D, Active B12, hs-CRP and Ferritin. Results in 2 to 5 working days.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const WHAT_WE_TEST = [
  { marker: 'Vitamin D', body: 'Drives immunity, bone density, and testosterone synthesis. Most UK men are deficient, especially in winter.' },
  { marker: 'Active B12 (Holotranscobalamin)', body: 'The form of B12 your cells can actually absorb. Standard NHS tests often miss deficiency. Low Active B12 affects energy, nerve function, and recovery speed.' },
  { marker: 'hs-CRP', body: 'Measures systemic inflammation. Elevated levels explain persistent soreness, joint stiffness, and slow recovery.' },
  { marker: 'Ferritin', body: 'Your iron storage marker. Low ferritin means poor oxygen transport, chronic fatigue, and exercise intolerance.' },
]

const STEPS = [
  { num: '01', title: 'Order your kit', body: 'Dispatched same day. Arrives next-day in discreet packaging. No referral needed.' },
  { num: '02', title: 'Take sample at home', body: 'Painless finger-prick collection. First thing in the morning, before food. Five minutes total.' },
  { num: '03', title: 'Post it back', body: 'Pre-paid return envelope included. Drop it in any standard post box. The lab gets it the next working day.' },
  { num: '04', title: 'Read your results', body: 'Your four numbers land in a private dashboard within 2 to 5 working days. Every marker explained in plain English. Every recommendation based on your actual data.' },
]

const BUILT_FOR = [
  { title: 'The man who trains four times a week', body: 'and recovers like he trains once.' },
  { title: "The man who's tried every supplement", body: 'on Amazon and still feels the same.' },
  { title: 'The man whose joints started complaining', body: "at 40 and haven't stopped since." },
  { title: 'The man who sleeps eight hours', body: 'and still wakes up tired.' },
]

const INCLUDED = [
  'Vitamin D, Active B12, hs-CRP, Ferritin (4 markers)',
  'UKAS ISO 15189 accredited lab',
  'Free next-day delivery + return postage',
  'Personal dashboard with plain-English results',
  'Specific recommendation based on your data',
]

const TRUST = ['UKAS ISO 15189 Lab', 'Free Next-Day Delivery', 'GMC-Registered Doctor', 'Results in 2 to 5 working days']

export default function EnergyRecoveryLpPage() {
  return (
    <FPage>
      <JsonLd data={lpSchema} />

      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div
                className="flex items-center justify-between gap-3.5 pb-3.5 mb-1.5"
                style={{ borderBottom: '1px solid var(--hair-2)' }}
              >
                <h2 className="f-h4" style={{ fontSize: 18 }}>Your results</h2>
                <span className="f-kchip">Nothing here is a diagnosis</span>
              </div>

              <div className="f-ro-k" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <span><i className="f-k-lab" aria-hidden="true" />Lab reference range</span>
                <span><i className="f-k-ours" aria-hidden="true" />Our action band</span>
                <span><i className="f-k-you" aria-hidden="true" />Your value</span>
              </div>

              <div>
                {READOUT_KIT_2.map((m) => (
                  <div key={m.name} className={m.split ? 'f-mk f-mk-split' : 'f-mk'}>
                    <div className="f-mk-t">
                      <div className="f-mk-n">
                        {m.name}
                        {m.qualifier ? <small>{m.qualifier}</small> : null}
                      </div>
                      <div className="f-mk-v">{m.value}<i>{m.unit}</i></div>
                    </div>
                    {m.noTrack ? (
                      <div className="f-bar-none" />
                    ) : (
                      <div
                        className="f-track"
                        role="img"
                        aria-label={`${m.name} ${m.value} ${m.unit}. Laboratory reference range: ${m.lab}. Andro Prime action band: ${m.ours}.`}
                      >
                        <div className="f-band f-band-lab" style={{ left: `${m.labLeft}%`, width: `${m.labWidth}%` }} />
                        <div className="f-band f-band-ours" style={{ left: `${m.oursLeft}%`, width: `${m.oursWidth}%` }} />
                        <div className="f-you" style={{ left: `${m.you}%` }} />
                      </div>
                    )}
                    <div className="f-verd">
                      {m.lab ? <span className="f-v-lab">{m.lab}</span> : null}
                      <span className="f-v-ours">{m.ours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Energy &amp; Recovery Check</span>
        </div>
        <h1 className="f-h1">
          You&rsquo;re not lazy.<br /><span className="f-grey">You&rsquo;re depleted.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          If you&rsquo;re training consistently but recovering slowly, the answer is almost certainly in your blood. We test the four markers that drive energy, inflammation, and recovery in active men.
        </p>
        <div className="f-btns" style={{ marginTop: 24 }}>
          <a href="#order" className="f-btn">
            Order the Kit &rarr; &pound;119 {ARROW}
          </a>
          <span className="f-kchip">All-in. No hidden fees.</span>
        </div>
        <p className="f-fine" style={{ marginTop: 14 }}>
          UKAS ISO 15189 accredited lab. 4 biomarkers. Results in 2 to 5 working days.
        </p>

        <div className="f-trustrow">
          {TRUST.map((item) => <div key={item}>{item}</div>)}
        </div>
      </FHero>

      {/* ---------- 01 · THE REALITY ---------- */}
      <FSection>
        <p className="f-blab">The reality</p>
        <div className="f-splitgrid f-rise" style={{ marginTop: 12 }}>
          <div>
            <h2 className="f-h2">
              Stop blaming<br /><span className="f-grey">your age.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              You&rsquo;re training hard. You&rsquo;re eating well. But you&rsquo;re still sore two days later, your joints ache, and your energy crashes by mid-afternoon.
            </p>
            <p className="f-sub" style={{ marginTop: 14 }}>
              Supplements haven&rsquo;t helped because you&rsquo;re guessing which ones you actually need. This test stops the guessing.
            </p>
            <p className="f-pull">
              Most men over 35 are low in at least one of these four markers and don&rsquo;t know it.
            </p>
          </div>

          <div>
            <p className="f-blab">What we test</p>
            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 6 }}>
              {WHAT_WE_TEST.map(({ marker, body }) => (
                <div className="f-bio" key={marker}>
                  <h3>{marker}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · THE PROCESS ---------- */}
      <FSection>
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Five minutes. Done at home.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          No GP referral. No waiting list. No clinic appointment.
        </p>

        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {STEPS.map(({ num, title, body }) => (
            <div className="f-step" key={num}>
              <span className="f-no">{num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 03 · BUILT FOR ---------- */}
      <FSection cont>
        <p className="f-blab">Built for</p>
        <h2 className="f-h2">
          You&rsquo;re not broken.<br />
          <span className="f-grey">You just don&rsquo;t have the data yet.</span>
        </h2>

        {/* Plain `.f-steps`, which is four-up at 1040px, because there are four
            of these. `.f-steps-3` is the three-item modifier and would leave one
            wrapping alone. They carry no `.f-no`: these are audience lines, not a
            numbered sequence. */}
        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {BUILT_FOR.map(({ title, body }) => (
            <div className="f-step" key={title}>
              <h3 className="f-h4 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>

        <div className="f-btns f-rise" style={{ marginTop: 24 }}>
          <a href="#order" className="f-btn">
            Order the Kit &rarr; &pound;119 {ARROW}
          </a>
          <span className="f-kchip">If that sounds familiar, this test was built for you.</span>
        </div>
      </FSection>

      {/* ---------- 04 · CLINICAL OVERSIGHT ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. Both quotations are verbatim. */}
      <FSection>
        <div className="f-invert f-rise">
          <div className="f-splitgrid">
            <div>
              <p className="f-blab f-invert-lab">Clinical oversight</p>
              <h2 className="f-h2 f-invert-h">
                Normal ranges are<br />
                <span style={{ opacity: 0.62 }}>averages, not targets.</span>
              </h2>
              <div style={{ marginTop: 20 }}>
                <p className="f-blab f-invert-lab" style={{ marginBottom: 10 }}>Verification</p>
                <p className="f-sub f-invert-p" style={{ marginTop: 6 }}>GMC Registered</p>
                <p className="f-sub f-invert-p" style={{ marginTop: 6 }}>UKAS ISO 15189 Lab</p>
              </div>
            </div>

            <div className="f-quotecard">
              <div className="f-quotehead">
                <span className="f-initials">EL</span>
                <div>
                  <strong>Dr Ewa Lindo</strong>
                  <span className="f-blab" style={{ marginBottom: 0 }}>GMC-Registered GP &amp; Clinical Lead</span>
                </div>
              </div>
              <blockquote>
                &ldquo;Normal ranges are statistical averages, not targets for how you should actually feel. I review our clinical protocols to ensure your data translates into effective, actionable steps.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        <div className="f-quotecard f-rise" style={{ marginTop: 26 }}>
          <div className="f-quotehead">
            <span className="f-initials">KA</span>
            <div>
              <strong>Keith Antony</strong>
              <span className="f-blab" style={{ marginBottom: 0 }}>Founder, Andro Prime</span>
            </div>
          </div>
          <blockquote>
            &ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this because the standard approach is broken.&rdquo;
          </blockquote>
        </div>
      </FSection>

      {/* ---------- 05 · COMMON QUESTIONS ---------- */}
      <FSection>
        <p className="f-blab">Common questions</p>
        <h2 className="f-h2">Frequently asked.</h2>
        <div className="f-faqgrid f-rise" style={{ marginTop: 22 }}>
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
        <p className="f-sub f-rise" style={{ marginTop: 22 }}>
          Some results need a doctor. Low ferritin, for example, goes to a GP and earns us nothing. The rest get a plain-English reading, and what we offer alongside it is the same whether your numbers are flagged or fine.
        </p>
      </FSection>

      {/* ---------- THE ORDER BLOCK ---------- */}
      <FSection narrow rule={false} cont id="order">
        <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
          <div className="f-core">
            <p className="f-blab">Kit 02</p>
            <h2 className="f-h2" style={{ marginTop: 10 }}>Energy &amp; Recovery Check</h2>
            <div className="f-btns" style={{ marginTop: 12, alignItems: 'baseline' }}>
              <span className="f-price">&pound;119</span>
              <span className="f-kchip">all-in, one-off</span>
            </div>

            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 18 }}>
              {INCLUDED.map((item) => (
                <div className="f-bio" key={item}><p>{item}</p></div>
              ))}
            </div>

            <div className="f-btns" style={{ marginTop: 22 }}>
              <KitCheckoutButton kitType="energy-recovery" className="f-btn">
                Order Now &rarr; &pound;119
              </KitCheckoutButton>
            </div>

            <MembershipDisclosure />

            {/* ⚠ FALSE UNDER THE AUTO-RENEW RULING AND RENDERED UNCHANGED. See
                the file header. */}
            <p className="f-fine" style={{ marginTop: 12 }}>
              Secure checkout. No subscription.
            </p>
          </div>
        </div>
      </FSection>
    </FPage>
  )
}
