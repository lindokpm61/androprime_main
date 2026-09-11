import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { MembershipDisclosure } from '@/components/commerce/MembershipDisclosure'
import { READOUT_KIT_1 } from '@/lib/kits/sampleReadout'

/**
 * /lp/testosterone, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Frame AC draws the `/lp` shell and a variance table and deliberately draws no
 * page: *"drawing five asserts they should stay five, drawing one asserts a
 * template that does not exist"*. So the shell came from the frame and the layout
 * is decided against DESIGN.md.
 *
 * EVERY WORD IS VERBATIM. The headline, the standfirst, the CTA labels, the
 * reality paragraphs, the pull quote, the three symptom lines and the "GP said
 * I'm fine" line, the Kit 2 routing block, the four process steps, the three
 * outcome pathways, both attributed quotations, all five FAQ answers, the GP
 * line under them and the closing block are byte-identical to the V2.0 page.
 *
 * 🔴 THE SAMPLE REPORT IS NO LONGER TYPED ON THIS PAGE, AND THAT IS A CLINICAL
 * CORRECTNESS FIX RATHER THAN A TIDY-UP. The V2.0 page hand-wrote its own five
 * rows, and one of them was wrong in the way DESIGN.md gap 9 records: **Free
 * Testosterone 0.244 badged "Low"**, when the reference low is 0.198, so the
 * results engine returns `ft-normal` and this page was claiming a deficiency the
 * engine does not find, on the surface with paid spend behind it. The `/kits/*`
 * pages were swept for exactly that on 2026-09-02; `/lp/*` never was. The rows
 * now come from `lib/kits/sampleReadout.ts`, which is the same data
 * `/kits/testosterone` renders, extracted rather than re-transcribed. A redesign
 * may not re-type a clinical verdict, and a second transcription is what produced
 * the defect in the first place.
 *
 * 🔴 THE SUBSCRIPTION PRICE LINE IS HERE, AND THE PAGE STILL CONTRADICTS IT.
 * `MembershipDisclosure` renders under the buy button, per Keith's ruling of
 * 2026-09-11 closing `2026-09-07-auto-renew-at-day-30.md` §4, which had left the
 * three `/lp/` kit pages undecided. It is flag-gated and renders nothing while
 * `MEMBERSHIP_ENABLED` is off.
 *
 * ⚠ **The closing block still reads "One-off purchase. Includes lab fees and
 * delivery. No subscription." and two FAQ answers still say "This is a one-off
 * purchase."** Under the adopted ruling every kit buyer starts a subscription on
 * day 31, so those sentences are false the moment the flag goes on. They are
 * rendered UNCHANGED, deliberately: they are approved customer-facing copy and
 * rewriting them is a copy decision with its own pre-flight, not something a
 * restyle may do. This is the same call `/supplement-waitlist` FAQ 4 got on
 * 2026-09-09 (register row 38a). **Owed to Keith, then pre-flight.** Registered,
 * and `scripts/verify-subscription-claims.js` fails the build if the flag is on
 * while any of them remains.
 */

const BASE_URL = 'https://andro-prime.com'

const FAQ_ITEMS = [
  { question: 'Do I need to fast before taking the test?', answer: 'Yes. For the most accurate hormone baseline, you must take the sample fasted (water is fine) before 10 AM. Testosterone levels peak in the morning and decline throughout the day, and eating can suppress them temporarily.' },
  { question: 'Does taking the sample hurt?', answer: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets in the kit just in case to ensure you can collect enough blood easily at home." },
  { question: 'How long do results take?', answer: 'Most results are ready within 2 to 5 working days of the lab receiving your sample. Some can take a little longer, depending on sample quality, postal transit and lab workload.' },
  { question: 'Does the £99 cover everything?', answer: 'Yes. The kit, the lab analysis, and the prepaid return postage are all included. No hidden fees. This is a one-off purchase.' },
  { question: 'Is my data private?', answer: 'Your results sit in your private dashboard, yours to share with whoever you choose. We do not sell your data, and we do not share it for advertising.' },
]

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
      name: 'Testosterone Health Check: At-Home Blood Test Kit',
      description: 'Find out where your testosterone actually sits. Tests Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-01',
      offers: {
        '@type': 'Offer',
        price: '99.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/testosterone`,
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
  title: 'Testosterone Blood Test UK | At-Home Kit £99',
  description: 'At-home testosterone blood test. Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free Testosterone from a simple finger-prick test. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days. £99.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Testosterone Blood Test UK | At-Home Kit £99 | Andro Prime',
    description: 'At-home testosterone blood test. Total T, SHBG, FAI, Albumin, Free T. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
    url: 'https://andro-prime.com/lp/testosterone',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Testosterone Health Check: Kit 1' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testosterone Blood Test UK | £99 | Andro Prime',
    description: 'At-home testosterone blood test. Total T, SHBG, FAI, Albumin, Free T. Results in 2 to 5 working days.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Kit 1 scope (CA-025 + 04_products/CONTEXT.md §5): testosterone only, so the
   symptom list stays on the hormonal presentation. The fatigue and brain-fog
   cards that used to sit here belong to Kit 2 and are routed to it below.
   Decision: 04_products/2026-08-15-kit1-scope-marketing-pages-decision.md. */
const SYMPTOMS = [
  { title: 'Drive and motivation just gone.', body: 'Libido has flatlined.' },
  { title: 'Training has stalled.', body: 'Strength and muscle going backwards on the same programme.' },
  { title: 'Mood and edge have flattened,', body: 'and it is not just a bad week.' },
  { title: '“GP said I’m fine”,', body: 'but you know you’re not.' },
]

const STEPS = [
  { num: '01', title: 'Order your kit', body: 'Dispatched same day. Fits straight through your letterbox. No clinic, no referral, no waiting room.' },
  { num: '02', title: 'Take sample at home', body: 'A simple, painless finger-prick sample you can do at the kitchen table. Five minutes, first thing in the morning.' },
  { num: '03', title: 'Post it back', body: 'Pre-paid return envelope. Drop it in any standard post box. The lab gets it the next working day.' },
  { num: '04', title: 'Read your results', body: 'Your numbers land in a personal dashboard within 2 to 5 working days. Clear data, plain English, and a specific recommendation based on what your blood actually shows.' },
]

const OUTCOMES = [
  { title: 'Levels are optimal', body: 'Good news confirmed. You get a retest reminder in 6 to 12 months to make sure it stays that way.' },
  { title: 'Borderline or suboptimal', body: "Your dashboard recommends specific supplements based on your result. Our own Daily Stack launches shortly. Join the early-access list, with OTC options pointed out for any markers that need attention now." },
  { title: 'Testosterone below 12 nmol/L', body: 'If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing.' },
]

const TRUST = ['UKAS ISO 15189 Lab', 'Free Next-Day Delivery', 'GMC-Registered Doctor', 'Results in 2 to 5 working days']

export default function TestosteroneLpPage() {
  return (
    <FPage>
      <JsonLd data={lpSchema} />

      <FHero
        aside={
          /* THE SAMPLE REPORT. Same `.f-mk` / `.f-track` / `.f-band` device and
             the same rows as `/kits/testosterone`, from `lib/kits/sampleReadout`.
             A results panel takes status bands, never the marketing accent. */
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
                {READOUT_KIT_1.map((m) => (
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
          <span className="f-eyebrow">Testosterone Health Check</span>
        </div>
        {/* ⚠ Breaks measured, not guessed. "That's not the same as good." is 27
            characters and wrapped with "good." alone; split at 14 / 12 / 18. */}
        <h1 className="f-h1">
          Your GP said<br />normal.<br /><span className="f-grey">That&rsquo;s not the same as good.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Find out exactly where your testosterone sits. We test Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. You get the raw data in plain English, plus a specific recommendation based on your numbers.
        </p>
        <div className="f-btns" style={{ marginTop: 24 }}>
          <a href="#order" className="f-btn">
            Order the Kit &rarr; &pound;99 {ARROW}
          </a>
          <span className="f-kchip">All-in. No hidden fees.</span>
        </div>
        <p className="f-fine" style={{ marginTop: 14 }}>
          UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.
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
              Stop guessing<br /><span className="f-grey">what&rsquo;s wrong.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              You&rsquo;re doing everything right. You&rsquo;re training. You&rsquo;re eating well. But your drive has gone, your training has stalled, and you don&rsquo;t feel like yourself anymore.
            </p>
            <p className="f-sub" style={{ marginTop: 14 }}>
              When you ask a standard doctor, they run a basic test and tell you you&rsquo;re &ldquo;fine&rdquo;. Fine isn&rsquo;t good enough.
            </p>
            <p className="f-pull">
              The NHS sets its threshold to catch severe disease. That&rsquo;s not the same as optimal.
            </p>
          </div>

          <div>
            <p className="f-blab">Symptoms</p>
            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 6 }}>
              {SYMPTOMS.map(({ title, body }) => (
                <div className="f-bio" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            {/* Kit 1 scope routing, carried whole. Deleting the fatigue symptoms
                alone would relocate the problem rather than solve it: the fatigue
                reader would still land here, and this is the surface with spend
                behind it. */}
            <div className="f-tray" style={{ marginTop: 22, marginBottom: 0 }}>
              <div className="f-core">
                <p className="f-sub" style={{ marginTop: 0 }}>
                  <strong>Mainly tired, foggy, or slow to recover?</strong> Testosterone is not the first thing to check. The Energy and Recovery Check looks at Vitamin D, Active B12, inflammation and iron stores instead.
                </p>
                <div className="f-btns" style={{ marginTop: 16 }}>
                  <Link href="/kits/energy-recovery" className="f-btn f-btn-ghost f-btn-sm">
                    See Kit 2: &pound;119
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · THE PROCESS ---------- */}
      <FSection>
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Five minutes. No GP needed.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Testing your hormones shouldn&rsquo;t require three appointments and a waiting list.
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

      {/* ---------- 03 · WHAT HAPPENS NEXT ---------- */}
      <FSection cont>
        <p className="f-blab">What happens next</p>
        <div className="f-splitgrid f-rise" style={{ marginTop: 12 }}>
          <div>
            <h2 className="f-h2">
              We don&rsquo;t just<br /><span className="f-grey">give you numbers.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              A blood test without a plan is useless. Your results come with a clear, specific recommendation based on what the data actually shows. Not a generic leaflet.
            </p>
            <p className="f-sub" style={{ marginTop: 14 }}>
              Five markers. Three possible outcomes. Each one has a pathway.
            </p>
          </div>

          <div className="f-bios" style={{ gridTemplateColumns: '1fr' }}>
            {OUTCOMES.map(({ title, body }) => (
              <div className="f-bio" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </FSection>

      {/* ---------- 04 · CLINICAL OVERSIGHT ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. Both quotations are verbatim, and
          Dr Ewa's outlined-person glyph is gone for the `/contact` reason: a
          verification badge that verifies nothing. */}
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
            &ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this because the standard approach is broken. We test first. Then you know exactly where you stand.&rdquo;
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
          If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing.
        </p>
      </FSection>

      {/* ---------- THE ORDER BLOCK ----------
          `rule={false}`: this is the page's ask, not a topic in its argument. The
          hero CTA and the sticky nav CTA both target `#order`. */}
      <FSection narrow rule={false} cont id="order">
        <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
          <div className="f-core">
            <p className="f-blab">Secure checkout</p>
            <h2 className="f-h2" style={{ marginTop: 10 }}>
              Stop guessing.<br /><span className="f-grey">Start knowing.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              A finger prick. A pre-paid envelope. That&rsquo;s it.
            </p>
            <div className="f-btns" style={{ marginTop: 22 }}>
              <KitCheckoutButton kitType="testosterone" className="f-btn">
                Order Kit &rarr; &pound;99
              </KitCheckoutButton>
            </div>

            {/* Ruled onto this page by Keith on 2026-09-11, closing §4. Renders
                nothing while `MEMBERSHIP_ENABLED` is off. */}
            <MembershipDisclosure />

            {/* ⚠ FALSE UNDER THE AUTO-RENEW RULING AND RENDERED UNCHANGED. See
                the file header: rewriting approved copy is a pre-flight decision,
                not a restyle's. `verify-subscription-claims.js` fails the build if
                the membership flag is on while this sentence is still here. */}
            <p className="f-fine" style={{ marginTop: 12 }}>
              One-off purchase. Includes lab fees &amp; delivery. No subscription.
            </p>
          </div>
        </div>
      </FSection>
    </FPage>
  )
}
