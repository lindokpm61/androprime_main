import type { Metadata } from 'next'
import Link from 'next/link'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { BundleChoice } from '@/components/commerce/BundleChoice'
import { JsonLd } from '@/components/shared/JsonLd'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'
import { isBundlesEnabled } from '@/lib/flags'

/*
 * REBUILT IN DIRECTION F, 2026-08-31.
 * Frame: design/mockups/journey/kits-F.html, Frame Q.
 * Primitives: styles/components/f-primitives.css. Tokens: styles/tokens/.
 *
 * Method (09_website-app/STATE.md, "THE METHOD"): layout and declarations come
 * from the frame; COPY comes from the live page. That split is not a preference,
 * it is what the Kit 1 rebuild established -- Frame P's close headline matched
 * the live one exactly, so nothing had to be decided. Frames Q and R both
 * propose close headlines the live pages do not carry, which under the frame's
 * own rule ("an invented question is a proposal for new customer-facing copy
 * wearing the clothes of an existing one") makes them proposals, not spec.
 *
 * THREE DELIBERATE DEPARTURES FROM FRAME Q, each with a reason:
 *
 *   1. THE SYMPTOM CHECKLIST IS RESTORED. Frame Q's label declares "eight
 *      sections" and the frame draws SEVEN. The missing one is the symptom
 *      panel, which the live page carries and which Frame P draws for Kit 1.
 *      This is the same defect the frame file already records against itself
 *      for Kit 3 ("the page has ten sections and nine were drawn"), and Frame R
 *      has it too. A section count in a frame label is a checksum; both frames
 *      fail it by one.
 *
 *   2. THE SAMPLE REPORT KEEPS ITS RECOMMENDATION ROW. In that slot Frame Q has
 *      a paragraph beginning "Every row mirrors what the results engine would
 *      actually return for these values" -- mockup commentary about the frame,
 *      sitting inside the card in a .fine rather than outside it in a .note.
 *      Frame P puts the Recommendation row there and the live page carries one.
 *      Shipping the commentary would have published meta-text as customer copy.
 *
 *   3. THE TRUST ROW IS THE FOUR-ITEM .f-trustrow, not Frame Q's one-line
 *      .trust. Frames P and R both draw the four-item row and the shipped Kit 1
 *      page uses it. Frame Q is the only one of the three that differs, and its
 *      line also drops "GMC-registered doctor" and "Free UK delivery" while
 *      adding "No GP needed", which is a change to hero trust copy rather than
 *      to layout. Three sibling pages agreeing beats one frame varying.
 *
 * What did NOT change: every word of copy, the metadata, the commerce
 * components, the bundles flag behaviour, the CA-038 self-flagged sentence, the
 * CA-026 D+ Kit 2 conformity line, and the sample-report values with their
 * engine-derived states.
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
    question: 'Does it hurt?',
    answer: "It's a quick prick on the fingertip. Most men say it's painless. We include extra lancets just in case.",
  },
  {
    question: 'How long do results take?',
    answer: 'Most results are ready within 2 to 5 working days of the lab receiving your sample. Some can take a little longer, depending on sample quality, postal transit and lab workload.',
  },
  {
    question: 'Does the £119 cover everything?',
    answer: 'Yes. The kit, the lab analysis for all four biomarkers, the prepaid return postage, and access to your results dashboard are all included.',
  },
  {
    question: 'Is my data private?',
    answer: 'Your results are private to you, in your own dashboard. We do not sell your data, and we do not share it for advertising. You choose who sees your numbers.',
  },
  {
    question: 'Can I test testosterone as well?',
    answer: 'This kit focuses on energy, recovery, and inflammation. If you also want testosterone checked, Kit 3 includes everything in this kit plus the full testosterone panel (Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T) for £179.',
  },
  {
    question: 'I already take supplements. Is this still worth it?',
    answer: "Especially if you already take supplements. Most men are guessing which ones they need. This test tells you which deficiencies you have, so you stop spending money on things you don't need.",
  },
]

// The FAQPage graph node is generated from the same array the page renders, so
// the two cannot drift. They were two hand-written copies before this rebuild,
// and they HAD drifted: the schema's "Can I test testosterone as well?" answer
// said "the full testosterone panel for £179" while the visible answer named the
// five markers. FAQPage requires the answer to match the visible page, so
// generating it corrects a real mismatch rather than only removing a drift risk.
const kitSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kits', item: `${BASE_URL}/kits` },
        { '@type': 'ListItem', position: 3, name: 'Energy & Recovery Check', item: `${BASE_URL}/kits/energy-recovery` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/kits/energy-recovery/#product`,
      name: 'Blood Test for Tiredness & Fatigue: Energy & Recovery Check',
      description: 'At-home blood test for energy, recovery and inflammation. Tests Vitamin D, Active B12, hs-CRP (inflammation), and Ferritin. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-02',
      offers: {
        '@type': 'Offer',
        price: '119.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/kits/energy-recovery`,
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
  title: 'Blood Test for Tiredness & Fatigue',
  description: 'At-home blood test for tiredness and fatigue. Vitamin D, Active B12, hs-CRP and Ferritin show why your energy is off. UKAS ISO 15189 accredited lab. £119.',
  alternates: { canonical: 'https://andro-prime.com/kits/energy-recovery' },
  openGraph: {
    title: 'Blood Test for Tiredness & Fatigue | Andro Prime',
    description: 'At-home blood test for energy, recovery and inflammation. Vitamin D, Active B12, hs-CRP, Ferritin. UKAS ISO 15189 accredited lab. £119.',
    url: 'https://andro-prime.com/kits/energy-recovery',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Blood test for tiredness and fatigue: Energy & Recovery Check' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blood Test for Tiredness & Fatigue | Andro Prime',
    description: 'At-home blood test for energy, recovery and inflammation. Vitamin D, Active B12, hs-CRP, Ferritin. UKAS ISO 15189 accredited. £119.',
    images: ['/og/default.png'],
  },
}

// The mockups set the arrow as the typographic glyph in the button's own face,
// not as a drawn path. Keeping it as text means it inherits the type ruling.
const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/*
 * The sample report. `band` is what the row's own badge declares, and it drives
 * both the chip underline and the bar fill, so the two cannot disagree.
 *
 * Every row mirrors what the results engine would actually return for these
 * values: `status` is the badge from components/results-engine/StatusBadge.tsx
 * (its BADGES map is the customer-facing vocabulary) and the band is the zone
 * from resolveBarZones in lib/results/classifier.ts. Adopted 2026-08-17 (Keith)
 * after this page's first pre-flight found it speaking Normal / Borderline /
 * Low, a vocabulary the product uses nowhere. Keep the two in step: a value
 * changed here without re-deriving its state is a mockup that contradicts the
 * product.
 */
const SAMPLE_ROWS: {
  label: string
  sub: string
  value: string
  status: string
  band: 'ok' | 'warn'
  width: string
}[] = [
  // Under 50 is `low-vitamin-d`. Amber zone, Action Needed badge. Badge and bar
  // deliberately disagree in emphasis here: the zone is amber, the state is
  // `low-vitamin-d`, and that badges ACTION NEEDED.
  { label: 'Vitamin D', sub: 'Muscle function & energy', value: '44', status: 'Action needed', band: 'warn', width: '26%' },
  // NG239: 25 to 70 is `borderline-b12`, badged Monitor.
  { label: 'Active B12', sub: 'Cellular energy', value: '61', status: 'Monitor', band: 'warn', width: '56%' },
  // Optimal closes at 1.0 (Ewa, CA-034 E1, threshold explicitly not moved), so
  // 1.2 is `elevated-crp`, badged Monitor.
  { label: 'hs-CRP', sub: 'Inflammation', value: '1.2', status: 'Monitor', band: 'warn', width: '68%' },
  // 30 to 100 is `suboptimal-ferritin`, badged Monitor.
  { label: 'Ferritin', sub: 'Iron stores', value: '38', status: 'Monitor', band: 'warn', width: '30%' },
]

const BIOMARKERS = [
  { num: '01', title: 'Vitamin D', body: "Most UK men are deficient between October and March. Low vitamin D directly affects muscle function, recovery speed, and energy. You can't tell from how you feel. You can only tell from your blood." },
  { num: '02', title: 'Active B12', body: 'Holotranscobalamin: the form of B12 your cells can actually absorb. Standard NHS B12 tests often miss deficiency. Active B12 catches it early. Low levels affect energy, nerve function, and how quickly you recover between sessions.' },
  { num: '03', title: 'hs-CRP (inflammation)', body: "A high-sensitivity inflammation marker. If this is elevated, your body is dealing with inflammation it isn't clearing. In active men, this is often linked to joint and connective tissue stress." },
  { num: '04', title: 'Ferritin', body: 'Your iron stores. Low ferritin is one of the most common and most overlooked causes of fatigue in men. If your energy has dropped off a cliff, this is often why.' },
]

const STEPS = [
  { n: '01', t: 'Order', b: 'Dispatched same day. Fits through your letterbox.', metaK: 'Dispatch', metaV: 'Same day' },
  { n: '02', t: 'Collect', b: 'A simple finger-prick sample you can do at the kitchen table.', metaK: 'Time required', metaV: '5 mins' },
  { n: '03', t: 'Return', b: 'Drop it in a postbox using the prepaid return envelope.', metaK: 'Postage', metaV: 'Prepaid' },
  { n: '04', t: 'Read', b: 'Your results appear in your private dashboard within 2 to 5 working days. Clear, specific, and in plain English.', metaK: 'Turnaround', metaV: '2 to 5 days' },
]

// Restored from the live page: Frame Q declares eight sections and drew seven.
const SYMPTOMS = [
  { label: 'Recovery', detail: 'Sore for days after sessions that used to feel easy.' },
  { label: 'Energy', detail: "Dragging through the afternoon. Coffee isn't cutting it anymore." },
  { label: 'Joints', detail: 'Stiff in the morning. Aching after training. Getting worse, not better.' },
  { label: 'Performance', detail: 'Doing the same work but getting less from it.' },
]

const TRUST = ['UKAS ISO 15189 lab', 'Free UK delivery', 'GMC-registered doctor', 'Results in 2 to 5 working days']

export default function KitEnergyRecoveryPage() {
  // Bundle surfaces are dark behind BUNDLES_ENABLED. Flag OFF renders the page
  // exactly as it is in production. Flag ON renders the bundle-forward design:
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
            <div className="f-eyebrow mb-5">Data first</div>

            <h1 className="f-h1 mb-5">Sore for three days after a workout that used to take one.</h1>

            <p className="f-stand mb-7">
              An at-home blood test for tiredness and fatigue. Find out which deficiency is slowing you down: four biomarkers, one finger prick. Results in 2 to 5 working days, in plain English, with a specific recommendation based on your numbers.
            </p>

            {bundlesEnabled ? (
              // Bundle-forward hero: the Prove-It bundle is the primary action,
              // the single test is the fallback. Cleared 2026-07-26: compliance
              // pre-flight (0 HARD) + Ewa wellness-recheck sign-off (Keith
              // relay). See 09_website-app/STATE.md bundle entry.
              <div className="w-full">
                <div className="f-btns">
                  <KitCheckoutButton kitType="energy-recovery" bundle="prove_it" className="f-btn">
                    Get the Prove-It bundle: £199 {ARROW}
                  </KitCheckoutButton>
                  <span className="f-kchip">Best value</span>
                </div>
                <p className="f-sub mt-5">
                  Your test now, plus a second test around day 90 so you can see how your numbers have changed. We confirm your address before it ships.
                </p>
                <KitCheckoutButton kitType="energy-recovery" className="f-btn f-btn-ghost f-btn-sm mt-4">
                  Or just the single test: £119 {ARROW}
                </KitCheckoutButton>
              </div>
            ) : (
              <div className="f-btns">
                <KitCheckoutButton kitType="energy-recovery" className="f-btn">
                  Order the kit: £119 {ARROW}
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
                {SAMPLE_ROWS.map(({ label, sub, value, status, band, width }) => (
                  <div key={label}>
                    <div className="f-row-top">
                      <div>
                        <span className="f-lab">{label}</span>
                        <div className="f-sub2">{sub}</div>
                      </div>
                      <div>
                        <div className="f-val">{value}</div>
                        <span className={band === 'warn' ? 'f-st f-st-hot' : 'f-st'}>{status}</span>
                      </div>
                    </div>
                    <div className="f-bar"><i className={band === 'warn' ? 'warn' : undefined} style={{ width }} /></div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--hair-2)' }}>
                <p className="f-sub" style={{ fontSize: 14.5, margin: 0 }}>
                  <b style={{ color: 'var(--ink)' }}>Recommendation:</b> Your next step, based on your numbers
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
        <h2 className="f-h2">
          You&rsquo;re doing everything right.<br />
          <span className="f-grey">Something&rsquo;s still off.</span>
        </h2>
      </div>
      <div className="f-wrap">
        <div className="f-tray f-rise">
          <div className="f-core grid gap-6">
            <div>
              <p className="f-sub">You train. You eat well. You sleep. But your recovery has slowed, your energy tanks by mid-afternoon, and your joints ache in a way they didn&rsquo;t two years ago.</p>
              {/* PERMANENT SELF-FLAG, do not re-escalate. The deterministic scanner matches the
                  last three words of this sentence against its retest/efficacy table on every
                  run. Ruled and APPROVED as CA-038 (Keith, business, 2026-08-17), copy unchanged:
                  the line names no marker, threshold, condition, ingredient, product or outcome,
                  so no clinical question is reached and Ewa was not a required signer.
                  🔴 The approval is scoped to this page IN CONTEXT and does not travel into a
                  carousel slide, hook or short post, where the surrounding narrative that the
                  ruling rests on is the first thing a compression drops. */}
              <p className="f-sub">You&rsquo;re not injured. You&rsquo;re not lazy. Something in your blood is holding you back, and guessing won&rsquo;t fix it.</p>
            </div>
            <div>
              {/* RESTORED. Frame Q's label declares eight sections and the frame draws seven;
                  this is the one it dropped. The live page carries it and Frame P draws the
                  equivalent panel for Kit 1. No route card here: Kit 1's symptom grid carries
                  one because it routes a tired reader AWAY to this kit, and the live Kit 2 page
                  has no counterpart. Adding one would be new copy, not a port. */}
              <p className="f-blab">Symptoms</p>
              <div className="f-symp">
                {SYMPTOMS.map(({ label, detail }) => (
                  <div key={label}><b>{label}.</b> {detail}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE DATA ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The data</p>
        <h2 className="f-h2">A blood test for tiredness.<br /><span className="f-grey">Four markers, four answers.</span></h2>
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

      {/* ---------------- THE PROCESS ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Five minutes.<br /><span className="f-grey">No GP needed.</span></h2>
      </div>
      <div className="f-wrap">
        <div className="f-steps">
          {/* Step 04 is NOT inverted. On a four-up row an inverted last card reads as the
              last step being the important one, when the step that matters to a reader
              deciding whether to buy is the first. Same ruling as Kit 1. */}
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

      {/* CONFORMITY LINE: D+ Kit 2 (CA-026), rendered VERBATIM. There is one of these
          on each kit page and all three sentences differ; none is a template fill. */}
      <div className="f-wrap" style={{ paddingTop: 26 }}>
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Some results need a doctor</p>
            <p style={{ fontSize: 'clamp(1.15rem,2.2vw,1.5rem)', lineHeight: 1.45, letterSpacing: '-0.025em' }}>
              Some results need a doctor. Low ferritin, for example, goes to a GP and earns us nothing. The rest get a plain-English reading, and what we offer alongside it is the same whether your numbers are flagged or fine.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- FAQ ----------------
          Open grid, standardised across all three kit pages (Keith, 2026-08-29). */}
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
          <h2>Stop guessing why you&rsquo;re tired.<br />Find out.</h2>
          <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
          <div className="mx-auto max-w-3xl text-left">
            <BundleChoice
              kitType="energy-recovery"
              kitLabel="Kit 2: Energy & Recovery"
              singlePrice={119}
              bundleType="prove_it"
              bundleName="Prove-It"
              bundlePrice={199}
              basePortion={119}
              retestPortion={80}
              retestLabel="Day-90 retest"
              savings={39}
              mechanic="Your second kit ships around day 90 so you can see how your numbers have changed. We confirm your address before it ships."
            />
          </div>
          <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
        </div>
      ) : (
        <>
          <RelatedArticles
            slugs={['why-am-i-always-tired', 'crp-blood-test', 'low-vitamin-d-symptoms', 'inflammatory-markers-blood-test', '14-signs-of-vitamin-d-deficiency']}
            intro="The markers behind low energy and slow recovery, explained in plain English."
          />

          <div className="f-wrap f-close" id="order">
            <h2>Stop guessing why you&rsquo;re tired.<br />Find out.</h2>
            <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
            <KitCheckoutButton kitType="energy-recovery" className="f-btn">
              Order the kit: £119 {ARROW}
            </KitCheckoutButton>
            <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
          </div>

          <div className="f-wrap" style={{ paddingBottom: 26 }}>
            <div className="f-tray f-rise">
              <div className="f-core flex flex-wrap items-center justify-between gap-5">
                <p className="f-sub" style={{ margin: 0, maxWidth: '52ch' }}>
                  Want the full picture? Kit 3 adds the complete testosterone panel to everything in Kit 2: nine markers for £179.
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
