import type { Metadata } from 'next'
import Link from 'next/link'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { BundleChoice } from '@/components/commerce/BundleChoice'
import { JsonLd } from '@/components/shared/JsonLd'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'
import { isBundlesEnabled } from '@/lib/flags'
import { FAI_REPORT_ONLY, PANEL_MARKERS } from '@/lib/kits/panel'

/*
 * REBUILT IN DIRECTION F, 2026-08-29. First page of the app-wide rebuild.
 * Frame: design/mockups/journey/kits-F.html, Frame P (approved 2026-08-29).
 * Primitives: styles/components/f-primitives.css. Tokens: styles/tokens/.
 *
 * Three things changed behaviour, not just styling, and all three come from the
 * frame rather than from preference:
 *   1. The FAQ is an open grid, not FaqAccordion. Standardised across all three
 *      kit pages (Keith, 2026-08-29): Kit 1 was the only one hiding questions
 *      behind a click. FaqAccordion is no longer imported here.
 *   2. Step 04 is no longer an inverted card. On a four-up row an inverted last
 *      card reads as the last step being the important one, when the step that
 *      matters to someone deciding whether to buy is the first.
 *   3. The sample-report bars carry the dashboard status bands rather than a
 *      flat marketing colour, which is what brand-guidelines.md §3.3 asks for in
 *      its own "preview = real" note, and what Keith ruled on 2026-08-29.
 *
 * What did NOT change: every word of copy, the schema graph, the metadata, the
 * commerce components, the bundles flag behaviour, the CA-025 symptom scope, the
 * CA-026 D+ line, and the FAI report-only treatment.
 */

// Render per-request so isBundlesEnabled() reads BUNDLES_ENABLED from the live
// runtime env. Without this the page is statically pre-rendered and the flag is
// baked at build time; the Dockerfile does not pass BUNDLES_ENABLED into the
// build, so a static page would freeze the flag OFF and toggling the deployed
// env var would never surface the bundle. force-dynamic makes the runtime value
// win without a rebuild (matches the flags.ts "deployed value wins" contract).
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://andro-prime.com'

const FAQ_ITEMS = [
  {
    question: 'What does this test show?',
    answer: "It shows your Total Testosterone, SHBG (Sex Hormone Binding Globulin), Free Androgen Index (FAI), Albumin, and Free Testosterone. Free T is the testosterone your body can actually use. It's often the number your GP doesn't test.",
  },
  {
    question: 'Does it hurt?',
    answer: "It's a quick prick on the fingertip. Most men say it's painless. We include extra lancets just in case.",
  },
  {
    question: 'How long do results take?',
    answer: 'Most results are ready within 2 to 5 working days of the lab receiving your sample. Some can take a little longer, depending on sample quality, postal transit and lab workload.',
  },
  {
    question: 'Does the £99 cover everything?',
    answer: 'Yes. The kit, the lab analysis for all five biomarkers, the prepaid return postage, and access to your results dashboard are all included.',
  },
  {
    question: 'What if my testosterone comes back low?',
    answer: 'Your report will explain what your result means and what to consider next. If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing.',
  },
  {
    question: 'Is my data private?',
    answer: 'Your results are private to you, in your own dashboard. We do not sell your data, and we do not share it for advertising. You choose who sees your numbers.',
  },
]

// The FAQPage graph node is generated from the same array the page renders, so
// the two cannot drift. Before the rebuild they were two hand-written copies of
// the same six questions.
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
      name: 'At-Home Testosterone Blood Test Kit (UK)',
      description: 'At-home testosterone blood test. Tests Total Testosterone, SHBG, Free Androgen Index (FAI), Albumin, and Free Testosterone. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-01',
      offers: {
        '@type': 'Offer',
        price: '99.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/kits/testosterone`,
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
  title: 'Testosterone Blood Test at Home (UK)',
  description: 'At-home testosterone blood test (UK): Total T, SHBG, FAI, Albumin, Free Testosterone. UKAS ISO 15189 accredited lab. Results in 2 to 5 days. £99.',
  alternates: { canonical: 'https://andro-prime.com/kits/testosterone' },
  openGraph: {
    title: 'Testosterone Blood Test at Home (UK) | Andro Prime',
    description: 'At-home testosterone blood test. Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free Testosterone. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days. £99.',
    url: 'https://andro-prime.com/kits/testosterone',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'At-home testosterone blood test kit (UK)' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testosterone Blood Test at Home (UK) | Andro Prime',
    description: 'At-home testosterone blood test. Total T, SHBG, FAI, Albumin, and Free T. UKAS accredited. Results in 2 to 5 working days. £99.',
    images: ['/og/default.png'],
  },
}

// The mockups set the arrow as the typographic glyph in the button's own face,
// not as a drawn path. Keeping it as text means it inherits the type ruling.
const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/*
 * The sample report. `band` is what the row's own badge declares, and it drives
 * both the chip underline and the bar fill, so the two cannot disagree.
 * FAI is deliberately bandless: the engine maps it to `fai-reported`, which
 * carries no verdict, and resolveBarZones returns [] for it because a coloured
 * bar IS a verdict. Strings come from lib/kits/panel.ts.
 */
const SAMPLE_ROWS: {
  label: string
  sub: string
  value: string
  unit: string
  status: string
  band: 'ok' | 'warn' | null
  width: string | null
}[] = [
  { label: 'Total testosterone', sub: 'Your baseline level', value: '14.2', unit: 'nmol/L', status: 'Borderline', band: 'warn', width: '35%' },
  { label: 'SHBG', sub: 'Binding globulin', value: '38.5', unit: 'nmol/L', status: 'Normal', band: 'ok', width: '55%' },
  { label: 'Free androgen index', sub: FAI_REPORT_ONLY.sub, value: '36.9', unit: '%', status: FAI_REPORT_ONLY.badge, band: null, width: null },
  { label: 'Albumin', sub: 'Transport protein', value: '42.0', unit: 'g/L', status: 'Normal', band: 'ok', width: '65%' },
  { label: 'Free testosterone', sub: 'What your body can actually use', value: '0.244', unit: 'nmol/L', status: 'Low', band: 'warn', width: '15%' },
]

const BIOMARKERS = [
  { num: '01', title: 'Total testosterone', body: 'The total amount of testosterone in your blood. Your baseline. The number most GPs test, if they test anything at all.' },
  { num: '02', title: 'SHBG', body: 'Sex Hormone Binding Globulin. It binds to testosterone and makes it unusable. High SHBG means your total T might look fine on paper while you still feel terrible.' },
  // Clinically ruled copy, read from the panel rather than written here. This said
  // FAI was "a more sensitive indicator of testosterone availability than Total T
  // alone", the free-T stand-in framing thresholds.md item 8 refuses in men.
  { num: '03', title: PANEL_MARKERS.fai.name, body: `${PANEL_MARKERS.fai.measures}. ${PANEL_MARKERS.fai.why}` },
  { num: '04', title: 'Albumin', body: 'The main carrier protein in your blood. Albumin-bound testosterone is considered weakly bioavailable. Testing it allows accurate calculation of your Free Testosterone. Without it, the number is an estimate.' },
  { num: '05', title: 'Free testosterone', body: 'The testosterone your body can actually use. Calculated from your Total T, SHBG, and Albumin. This is the number that matters most for how you feel day to day.' },
]

const STEPS = [
  { n: '01', t: 'Order', b: 'Dispatched same day. Fits through your letterbox.', metaK: 'Dispatch', metaV: 'Same day' },
  { n: '02', t: 'Collect', b: 'Simple finger-prick at the kitchen table.', metaK: 'Time required', metaV: '5 mins' },
  { n: '03', t: 'Return', b: 'Drop it in a postbox using the prepaid return envelope.', metaK: 'Postage', metaV: 'Prepaid' },
  { n: '04', t: 'Read', b: 'Your results appear in your private dashboard within 2 to 5 working days. Clear, specific, and in plain English.', metaK: 'Turnaround', metaV: '2 to 5 days' },
]

const TRUST = ['UKAS ISO 15189 lab', 'Free UK delivery', 'GMC-registered doctor', 'Results in 2 to 5 working days']

export default function KitTestosteronePage() {
  // Bundle surfaces are dark behind BUNDLES_ENABLED. Flag OFF renders the page
  // exactly as it is in production (single-kit hero, related reading, single
  // closing CTA, Kit 3 cross-sell). Flag ON renders the bundle-forward design:
  // the hero leads with the single-vs-bundle choice and the page CLOSES on that
  // same offer, with no trailing blog cards or competing-kit cross-sell.
  const bundlesEnabled = isBundlesEnabled()

  return (
    <div className="f-page">
      <JsonLd data={kitSchema} />

      {/* ---------------- HERO ---------------- */}
      <div className="f-wrap" style={{ paddingTop: 62, paddingBottom: 44 }}>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-11 lg:items-start">
          <div>
            <div className="f-eyebrow mb-5"><i />Kit 01 // Testosterone</div>

            <h1 className="f-h1 mb-5">
              Your GP said normal.<br />
              <span className="f-grey">That&rsquo;s not the same as good.</span>
            </h1>

            <p className="f-stand mb-7">
              An at-home testosterone blood test. Find out where your testosterone sits: we test Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. You get the raw data in plain English, plus a specific recommendation based on your numbers.
            </p>

            {bundlesEnabled ? (
              // Bundle-forward hero: the Recheck bundle (internal type: confirmation) is the
              // primary action, the single test is the fallback. Cleared 2026-07-26:
              // compliance pre-flight (0 HARD) + Ewa wellness-recheck sign-off (Keith relay).
              <div className="w-full">
                <div className="f-btns">
                  <KitCheckoutButton kitType="testosterone" bundle="confirmation" className="f-btn">
                    Get the Recheck bundle: £169 {ARROW}
                  </KitCheckoutButton>
                  <span className="f-kchip">Best value</span>
                </div>
                <p className="f-sub mt-5">
                  Your test now, plus a second test if your result comes back low. If it is not, your second test is banked for your recheck, refundable on request.
                </p>
                <KitCheckoutButton kitType="testosterone" className="f-btn f-btn-ghost f-btn-sm mt-4">
                  Or just the single test: £99 {ARROW}
                </KitCheckoutButton>
              </div>
            ) : (
              <div className="f-btns">
                <KitCheckoutButton kitType="testosterone" className="f-btn">
                  Order the kit: £99 {ARROW}
                </KitCheckoutButton>
                <span className="f-kchip">All-in. No hidden fees.</span>
              </div>
            )}

            <div className="f-trustrow">
              {TRUST.map((item) => <div key={item}>{item}</div>)}
            </div>
          </div>

          {/* Sample report. A results panel: status bands, never the accent. */}
          <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="flex items-center justify-between gap-3.5 pb-3.5 mb-1.5" style={{ borderBottom: '1px solid var(--hair-2)' }}>
                <h2 className="f-h4" style={{ fontSize: 18 }}>Your results</h2>
                <span className="f-kchip">Sample report</span>
              </div>

              <div className="f-rep">
                {SAMPLE_ROWS.map(({ label, sub, value, unit, status, band, width }) => (
                  <div key={label}>
                    <div className="f-row-top">
                      <div>
                        <span className="f-lab">{label}</span>
                        <div className="f-sub2">{sub}</div>
                      </div>
                      <div>
                        <div className="f-val">
                          {value} <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{unit}</span>
                        </div>
                        <span className={band === 'warn' ? 'f-st f-st-hot' : 'f-st'}>{status}</span>
                      </div>
                    </div>
                    {band === null
                      ? <div className="f-bar-none" />
                      : <div className="f-bar"><i className={band === 'warn' ? 'warn' : undefined} style={{ width: width ?? '0%' }} /></div>}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--hair-2)' }}>
                <p className="f-sub" style={{ fontSize: 14.5, margin: 0 }}>
                  <b style={{ color: 'var(--ink)' }}>Recommendation:</b> Further investigation advised
                </p>
                <span className="f-kchip">2 to 5 working days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE REALITY ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The reality</p>
        <h2 className="f-h2">Stop guessing what&rsquo;s wrong.</h2>
      </div>
      <div className="f-wrap">
        <div className="f-tray f-rise">
          <div className="f-core grid gap-6">
            <div>
              <p className="f-sub">You&rsquo;re doing everything right. You&rsquo;re training. You&rsquo;re eating well. But your drive has gone, your training has stalled, and you don&rsquo;t feel like yourself anymore.</p>
              <p className="f-sub">When you ask a standard doctor, they run a basic test and tell you you&rsquo;re &ldquo;fine&rdquo;. Fine isn&rsquo;t good enough.</p>
              <p className="f-pull">The NHS sets its threshold to catch severe disease. That&rsquo;s not the same as optimal.</p>
            </div>
            <div>
              <p className="f-blab">Symptoms</p>
              <div className="f-symp">
                {/* Kit 1 scope (CA-025 + 04_products/CONTEXT.md §5): this kit measures
                    testosterone only, so the symptom list must stay on the hormonal
                    presentation. The fatigue and brain-fog cards that used to sit here belong
                    to Kit 2 and are routed to it below. DO NOT REPOPULATE.
                    Decision: 04_products/2026-08-15-kit1-scope-marketing-pages-decision.md */}
                <div><b>Drive and motivation just gone.</b> Libido has flatlined.</div>
                <div><b>Training has stalled.</b> Strength and muscle going backwards on the same programme.</div>
                <div><b>Mood and edge have flattened,</b> and it is not just a bad week.</div>
                <div className="f-dark"><b>&ldquo;GP said I&rsquo;m fine&rdquo;,</b> but you know you&rsquo;re not.</div>

                {/* The one card that routes a reader AWAY from the product being sold, which is
                    why it carries the accent. Deleting the fatigue symptoms alone would have
                    relocated the problem rather than solved it: that reader would still land
                    here. This hands him to Kit 2 explicitly. */}
                <div className="f-route">
                  <b>Mainly tired, foggy, or slow to recover?</b> Testosterone is not the first thing to check. The Energy and Recovery Check looks at Vitamin D, Active B12, inflammation and iron stores instead.
                  <div className="mt-3.5">
                    <Link href="/kits/energy-recovery" className="f-btn f-btn-ghost f-btn-sm">See Kit 2: £119 {ARROW}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE PROCESS ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Five minutes.<br /><span className="f-grey">No GP needed.</span></h2>
      </div>
      <div className="f-wrap">
        <div className="f-steps">
          {/* Step 04 is NOT inverted. On a four-up row an inverted last card reads as the
              last step being the important one, when the step that matters to a reader
              deciding whether to buy is the first. */}
          {STEPS.map(({ n, t, b, metaK, metaV }) => (
            <div key={n} className="f-step f-rise">
              <span className="f-bignum" aria-hidden="true">{n.replace(/^0/, '')}</span>
              <span className="f-no">{n}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{t}</h3>
              <p className="f-sub" style={{ fontSize: 14.5 }}>{b}</p>
              <div className="f-step-foot"><span>{metaK}</span><b>{metaV}</b></div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- THE DATA ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The data</p>
        <h2 className="f-h2">Five numbers.<br /><span className="f-grey">The full testosterone picture.</span></h2>
      </div>
      <div className="f-wrap">
        <div className="f-bios">
          {BIOMARKERS.map(({ num, title, body }) => (
            <div key={num} className="f-bio f-rise">
              <span className="f-kchip">Biomarker {num}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- THE NEXT STEP ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The next step</p>
        <h2 className="f-h2">Numbers you can act on.</h2>
      </div>
      <div className="f-wrap">
        <div className="f-tray f-rise">
          <div className="f-core grid gap-5">
            <p className="f-sub">
              Every result comes with a specific recommendation. If your testosterone is below where it should be, we tell you what your level means and what to consider next. If something needs a GP, we tell you that too.
            </p>
            <div style={{ background: 'var(--sunk)', borderRadius: 'var(--radius-inset)', padding: 22, boxShadow: 'inset 0 0 0 1px var(--hair)' }}>
              <h3 className="f-h4 mb-2.5" style={{ fontSize: 17 }}>GMC-registered oversight</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>Your report is built on healthy ranges and explanations set by a GMC-registered GP. Every recommendation is backed by your actual data, not a guess.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONFORMITY LINE: D+ Kit 1 (CA-026), rendered VERBATIM. There is one of these
          on each kit page and all three sentences differ; none is a template fill. */}
      <div className="f-wrap" style={{ paddingTop: 26 }}>
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">If your result is low</p>
            <p style={{ fontSize: 'clamp(1.15rem,2.2vw,1.5rem)', lineHeight: 1.45, letterSpacing: '-0.025em' }}>
              If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- FAQ ----------------
          Open grid, standardised across all three kit pages (Keith, 2026-08-29).
          Kit 1 was the only one of the three hiding its questions behind a click. */}
      <div className="f-wrap f-sec"><h2 className="f-h2">Frequently asked questions</h2></div>
      <div className="f-wrap">
        <div className="f-faqgrid">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </div>

      {bundlesEnabled ? (
        /* Bundle-forward CLOSE: the page ends on the single-vs-bundle offer. No trailing
           blog cards or competing-kit cross-sell, which pull focus off the buying
           decision. Keith direction 2026-07-24. */
        <div className="f-wrap f-close" id="order">
          <h2>Find out where your testosterone actually sits.</h2>
          <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
          <div className="mx-auto max-w-3xl text-left">
            <BundleChoice
              kitType="testosterone"
              kitLabel="Kit 1: Testosterone"
              singlePrice={99}
              bundleType="confirmation"
              bundleName="Recheck"
              bundlePrice={169}
              basePortion={99}
              retestPortion={70}
              retestLabel="Retest, if needed"
              savings={29}
              mechanic="Your second test ships only if your first result comes back low. If your result is not low, your second test is banked for your recheck window, refundable on request."
            />
          </div>
          <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
        </div>
      ) : (
        <>
          <RelatedArticles
            slugs={['myth-of-normal-range', 'low-vitamin-d-symptoms']}
            intro="What your testosterone numbers actually mean, and why a normal result is not the whole story."
          />

          <div className="f-wrap f-close" id="order">
            <h2>Find out where your testosterone actually sits.</h2>
            <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
            <KitCheckoutButton kitType="testosterone" className="f-btn">
              Order the kit: £99 {ARROW}
            </KitCheckoutButton>
            <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
          </div>

          <div className="f-wrap" style={{ paddingBottom: 26 }}>
            <div className="f-tray f-rise">
              <div className="f-core flex flex-wrap items-center justify-between gap-5">
                <p className="f-sub" style={{ margin: 0, maxWidth: '52ch' }}>
                  Want to check testosterone AND energy/recovery markers? Kit 3 includes everything in Kit 1 plus 4 more biomarkers for £179.
                </p>
                <Link href="/kits/hormone-recovery" className="f-btn f-btn-ghost">See Kit 3: £179 {ARROW}</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
