import type { Metadata } from 'next'
import Link from 'next/link'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { BundleChoice } from '@/components/commerce/BundleChoice'
import { JsonLd } from '@/components/shared/JsonLd'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'
import { isBundlesEnabled } from '@/lib/flags'
import { FAI_REPORT_ONLY, PANEL_MARKERS, panelShortLabels, panelCount } from '@/lib/kits/panel'
import { PRICING } from '@/lib/pricing'
import type { KitType } from '@/lib/results/types'

/*
 * REBUILT IN DIRECTION F, 2026-08-31.
 * Frame: design/mockups/journey/kits-F.html, Frame R.
 * Primitives: styles/components/f-primitives.css. Tokens: styles/tokens/.
 *
 * Method (09_website-app/STATE.md, "THE METHOD"): layout and declarations come
 * from the frame; COPY comes from the live page. Frame R proposes a close
 * headline ("The full picture, in one test.") the live page does not carry, so
 * the live one is kept: the Kit 1 rebuild set that precedent by accident,
 * because Frame P's close happened to match live exactly.
 *
 * FOUR DELIBERATE DEPARTURES FROM FRAME R, each with a reason:
 *
 *   1. "BUILT FOR" HAS ITS BODY BACK. Frame R draws the heading and then
 *      nothing. Its label declares "ten sections" and it draws NINE. This is
 *      the third instance of the same defect in one frame file, and the file
 *      already records the first against itself ("Kit 3's FAQ was missing from
 *      the first draft of this frame: the page has ten sections and nine were
 *      drawn"). Frame Q fails its own count by one too. A section count in a
 *      frame label is a checksum, and it is worth running.
 *
 *   2. THE SAMPLE REPORT KEEPS ITS RECOMMENDATION ROW, which Frame R drops and
 *      Frame P, Frame Q's live page and this page's live version all carry.
 *
 *   3. THE BIOMARKER GRID AND THE PROCESS STEPS ARE KEPT. Frame R draws
 *      neither, folding nine markers into three .spec rows that list names
 *      only. Kit 1 and Kit 2 both keep theirs, so following the frame here
 *      would make the £179 flagship the THINNEST of the three pages, which is
 *      backwards commercially and for search. Given the frame is provably one
 *      section short and has an empty section elsewhere, "incomplete" is a more
 *      economical reading than "deliberately minimal". 🔴 KEITH'S CALL: if the
 *      lean frame was the intent, deleting these two blocks is a five-minute
 *      change. Restoring them later would not be.
 *
 *   4. THE COMPARISON TABLE IS DERIVED, not hand-written. Frame R's own
 *      annotation asks for this: the two comparison tables "share four facts
 *      (three prices and the marker sets) with nothing keeping them in step.
 *      The rebuild should read both from one source." Prices come from
 *      lib/pricing.ts and marker sets from lib/kits/panel.ts, and it reuses
 *      .f-table rather than adding the frame's second .cmp table system.
 *      🔴 STILL OPEN, and named in the frame: whether the two tables collapse
 *      into one at all. This change makes them consistent, not singular.
 *
 * FAI: the frame badges it "Reported"; the product badges it
 * FAI_REPORT_ONLY.badge ("Not interpreted"). The product wins, because that is
 * a clinical ruling (Ewa, thresholds.md item 8) and not a label choice. The
 * absent bar is deliberate for the same reason: resolveBarZones returns [] for
 * FAI because a coloured bar IS a verdict.
 *
 * What did NOT change: every word of copy, the metadata, the commerce
 * components, the bundles flag behaviour, the two attributed founder quotes,
 * the CA-026 D+ Kit 3 conformity line, and the sample-report values with their
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
    question: 'Does the £179 cover everything?',
    answer: 'Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included.',
  },
  {
    question: 'Is my data private?',
    answer: 'Your results are private to you, in your own dashboard. We do not sell your data, and we do not share it for advertising. You choose who sees your numbers.',
  },
  {
    question: 'Why not just buy Kit 1 and Kit 2 separately?',
    answer: "You could. They'd cost £218 combined. Kit 3 gives you all nine markers for £179, with one sample instead of two. And testing everything together gives a more complete picture, which means better recommendations.",
  },
  {
    question: 'What if my testosterone comes back low?',
    answer: 'Your report will explain what your level means and what to consider next. If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing.',
  },
]

// The FAQPage graph node is generated from the same array the page renders, so
// the two cannot drift. They were two hand-written copies before this rebuild.
const kitSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kits', item: `${BASE_URL}/kits` },
        { '@type': 'ListItem', position: 3, name: 'Hormone & Recovery Check', item: `${BASE_URL}/kits/hormone-recovery` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/kits/hormone-recovery/#product`,
      name: "Men's Health Blood Test Kit: Hormone & Recovery Check",
      description: 'The most complete at-home blood test for men. All 9 markers: full testosterone panel plus energy, recovery, and inflammation. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-03',
      offers: {
        '@type': 'Offer',
        price: '179.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/kits/hormone-recovery`,
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
  title: "Men's Health Blood Test at Home: 9 Markers",
  description: "Men's health blood test you take at home. All 9 markers: testosterone panel plus energy, recovery and inflammation. UKAS ISO 15189 accredited lab. £179.",
  alternates: { canonical: 'https://andro-prime.com/kits/hormone-recovery' },
  openGraph: {
    title: "Men's Health Blood Test at Home: 9 Markers | Andro Prime",
    description: 'The most complete at-home blood test for men. All 9 markers: full testosterone panel plus energy, recovery, and inflammation. £179.',
    url: 'https://andro-prime.com/kits/hormone-recovery',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: "Men's health blood test kit: Hormone & Recovery Check" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Men's Health Blood Test at Home: 9 Markers | Andro Prime",
    description: 'The most complete at-home blood test for men. All 9 markers: testosterone, energy, recovery, inflammation. £179.',
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
 * product, which is a claim we cannot substantiate.
 *
 * FAI is deliberately bandless: the engine maps it to `fai-reported`, which
 * carries no verdict, and resolveBarZones returns [] for it because a coloured
 * bar IS a verdict. K1 (Keith, CA-034, 2026-08-12) settled this for Kit 1; this
 * page graded it Normal with a green bar until 2026-08-17.
 */
const SAMPLE_ROWS: {
  label: string
  value: string
  status: string
  band: 'ok' | 'warn' | null
  width: string | null
}[] = [
  // 12 to 20 is the warning zone and `normal-testosterone`, which badges Monitor.
  { label: 'Total testosterone', value: '16.8', status: 'Monitor', band: 'warn', width: '42%' },
  { label: 'SHBG', value: '34.0', status: 'In range', band: 'ok', width: '55%' },
  { label: 'Free androgen index', value: '41.0', status: FAI_REPORT_ONLY.badge, band: null, width: null },
  { label: 'Albumin', value: '44.0', status: 'In range', band: 'ok', width: '64%' },
  // 0.31 is the correct Vermeulen result for the total T, SHBG and albumin above, so
  // it cannot move without them. Free T has exactly two states, split on the LAB's
  // own referenceLow, which arrives per sample and is not in this repo; typical male
  // assay lows sit near 0.2 to 0.3, so this reads `ft-normal`. Illustrative: a real
  // card bands against the range that came back with the sample.
  { label: 'Free testosterone', value: '0.31', status: 'In range', band: 'ok', width: '32%' },
  // Under 50 is `low-vitamin-d`. Amber zone, but the badge is Action Needed.
  { label: 'Vitamin D', value: '47', status: 'Action needed', band: 'warn', width: '26%' },
  // NG239: 25 to 70 is `borderline-b12`, badged Monitor.
  { label: 'Active B12', value: '58', status: 'Monitor', band: 'warn', width: '54%' },
  // Optimal closes at 1.0 (Ewa, CA-034 E1, threshold explicitly not moved), so 2.1
  // is `elevated-crp`, badged Monitor.
  { label: 'hs-CRP', value: '2.1', status: 'Monitor', band: 'warn', width: '62%' },
  // 30 to 100 is `suboptimal-ferritin`, badged Monitor.
  { label: 'Ferritin', value: '39', status: 'Monitor', band: 'warn', width: '24%' },
]

/*
 * The nine biomarker cards. Kept from the live page; Frame R draws none.
 * FAI's body is read from the panel rather than written here: it is clinically
 * ruled copy. It used to say FAI was "a more sensitive indicator of testosterone
 * availability than Total T alone", the free-T stand-in framing thresholds.md
 * item 8 refuses in men.
 */
const BIOMARKERS = [
  { num: '01', title: 'Total testosterone', body: 'The total amount of testosterone in your blood. Your baseline. If this is low, everything else, energy, mood, drive, takes a hit.' },
  { num: '02', title: 'SHBG', body: 'Sex Hormone Binding Globulin. It binds to testosterone and makes it unusable. High SHBG means your total T might look fine on paper while you still feel terrible.' },
  { num: '03', title: PANEL_MARKERS.fai.name, body: `${PANEL_MARKERS.fai.measures}. ${PANEL_MARKERS.fai.why}` },
  { num: '04', title: 'Albumin', body: 'The main carrier protein in your blood. Testing albumin allows accurate calculation of Free Testosterone. Without it, the number is an estimate.' },
  { num: '05', title: 'Free testosterone', body: 'The testosterone your body can actually use. Calculated from your Total T, SHBG, and Albumin. This is the number that matters most for how you feel day to day.' },
  { num: '06', title: 'Vitamin D', body: "Most UK men are deficient, especially October to March. Low vitamin D directly affects muscle function, recovery, and energy. You won't know without testing." },
  { num: '07', title: 'Active B12', body: 'Holotranscobalamin: the form of B12 your cells can actually use. Standard tests often miss deficiency. Low Active B12 affects energy, nerve function, and recovery between sessions.' },
  { num: '08', title: 'hs-CRP (inflammation)', body: 'A high-sensitivity inflammation marker. In active men, elevated hs-CRP is often linked to joint and connective tissue stress, but it can have several causes. Your dashboard explains what your specific reading means.' },
  { num: '09', title: 'Ferritin', body: 'Your iron stores. Low ferritin is one of the most common and most overlooked causes of fatigue in men. Often normal on a basic NHS panel. Rarely tested unless you ask for it specifically.' },
]

/*
 * The step strip. The frame's own annotation calls the three copies of this
 * component "the clearest single argument in this whole set for rebuilding
 * these pages from shared parts". It is NOT extracted into a shared module,
 * and the reason is that the three are not actually identical: Kit 1 and this
 * page say "Simple finger-prick at the kitchen table", Kit 2's live copy says
 * "A simple finger-prick sample you can do at the kitchen table". Merging them
 * would silently pick a winner, which is a copy decision and Keith's, not a
 * refactor. Worth doing once that one word is ruled.
 */
const STEPS = [
  { n: '01', t: 'Order', b: 'Dispatched same day. Fits through your letterbox.', metaK: 'Dispatch', metaV: 'Same day' },
  { n: '02', t: 'Collect', b: 'Simple finger-prick at the kitchen table.', metaK: 'Time required', metaV: '5 mins' },
  { n: '03', t: 'Return', b: 'Drop it in a postbox using the prepaid return envelope.', metaK: 'Postage', metaV: 'Prepaid' },
  { n: '04', t: 'Read', b: 'Your results appear in your private dashboard within 2 to 5 working days. Clear, specific, and in plain English.', metaK: 'Turnaround', metaV: '2 to 5 days' },
]

// Restored from the live page: Frame R draws the "Built for" heading and no body.
const BUILT_FOR = [
  "The man who hasn't had a proper check-up in years and wants to know where he stands.",
  "The man who isn't sure whether it's his testosterone, his energy, or something else entirely.",
  'The man who wants one comprehensive test instead of guessing which single marker to check.',
  "The man over 40 who knows something's shifted but can't pinpoint what.",
]

/*
 * Attributed speech from two real people, one of them the clinical reviewer.
 * Carried VERBATIM. A quote that has been tightened, shortened or made punchier
 * is a quote the named person did not say.
 */
const FOUNDERS = [
  {
    initials: 'KA',
    name: 'Keith Antony',
    role: 'Founder',
    quote: '“I spent two years being told my levels were ‘normal for my age’ while feeling completely burnt out. I built this company because the standard approach is broken. We test first. Then you know exactly where you stand.”',
  },
  {
    initials: 'EL',
    name: 'Dr Ewa Lindo',
    role: 'Medical Director',
    quote: '“Normal ranges are statistical averages, not targets for how you should actually feel. I review our clinical protocols to ensure your data translates into effective, actionable steps.”',
  },
]

const TRUST = ['UKAS ISO 15189 lab', 'Free UK delivery', 'GMC-registered doctor', 'Results in 2 to 5 working days']

/*
 * The spec comparison. Derived rather than hand-written, which is what the
 * frame's own annotation asks for: prices from lib/pricing.ts, marker sets from
 * lib/kits/panel.ts. The rows that are genuinely editorial ("Best for") stay
 * here, because there is no source that owns them.
 */
const CMP_ORDER: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']
const CMP_HEAD: Record<KitType, { num: string; name: string; price: string }> = {
  'testosterone': { num: 'Kit 1', name: 'Testosterone', price: `£${PRICING.KIT_1.rrp}` },
  'energy-recovery': { num: 'Kit 2', name: 'Energy & Recovery', price: `£${PRICING.KIT_2.rrp}` },
  'hormone-recovery': { num: 'Kit 3', name: 'Hormone & Recovery', price: `£${PRICING.KIT_3.rrp}` },
}
const CMP_ROWS: { label: string; cell: (kit: KitType) => string }[] = [
  { label: 'Price', cell: (kit) => CMP_HEAD[kit].price },
  {
    label: 'Markers',
    cell: (kit) => (kit === 'hormone-recovery' ? `All ${panelCount(kit)} markers` : panelShortLabels(kit).join(', ')),
  },
  {
    label: 'Best for',
    cell: (kit) =>
      kit === 'testosterone' ? 'Testosterone only' : kit === 'energy-recovery' ? 'Energy, recovery, joints' : 'Full picture',
  },
  { label: 'Testosterone?', cell: (kit) => (kit === 'energy-recovery' ? 'No' : 'Yes') },
  { label: 'Energy and recovery?', cell: (kit) => (kit === 'testosterone' ? 'No' : 'Yes') },
]

export default function KitHormoneRecoveryPage() {
  // Bundle surfaces are dark behind BUNDLES_ENABLED. Flag OFF renders the page
  // exactly as it is in production. Flag ON keeps Kit 3 (the flagship) as the
  // primary buy and adds the day-90 RETEST as an add-on (not a second "bundle",
  // since Kit 3 is already sold as a bundle of two kits), then CLOSES the page on
  // that offer with no trailing related reading.
  const bundlesEnabled = isBundlesEnabled()

  return (
    <div className="f-page">
      <JsonLd data={kitSchema} />

      {/* ---------------- HERO ---------------- */}
      <div className="f-wrap" style={{ paddingTop: 62, paddingBottom: 44 }}>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-11 lg:items-start">
          <div>
            <div className="f-eyebrow mb-5"><i />Data first</div>

            <h1 className="f-h1 mb-5">Nine numbers every man over 40 should know.</h1>

            <p className="f-stand mb-7">
              A complete men&rsquo;s health blood test you take at home. Hormones, energy, recovery, and inflammation: one test, nine biomarkers, and the full picture of what&rsquo;s going on inside your body, with a specific recommendation based on your data.
            </p>

            {bundlesEnabled ? (
              // Kit 3 stays the primary buy; the day-90 retest is a prominent
              // add-on beneath it (not a competing "bundle"). Cleared 2026-07-26:
              // compliance pre-flight (0 HARD) + Ewa wellness-recheck sign-off
              // (Keith relay). See 09_website-app/STATE.md bundle entry.
              <div className="w-full">
                <div className="f-btns">
                  <KitCheckoutButton kitType="hormone-recovery" className="f-btn">
                    Order the kit: £179 {ARROW}
                  </KitCheckoutButton>
                  <span className="f-flagchip">Most complete</span>
                </div>
                <p className="f-sub mt-5">
                  Add a day-90 retest and see how your numbers have changed. We confirm your address before it ships.
                </p>
                <KitCheckoutButton kitType="hormone-recovery" bundle="full_picture" className="f-btn f-btn-ghost f-btn-sm mt-4">
                  Add the day-90 retest: £259 {ARROW}
                </KitCheckoutButton>
              </div>
            ) : (
              <div className="f-btns">
                <KitCheckoutButton kitType="hormone-recovery" className="f-btn">
                  Order the kit: £179 {ARROW}
                </KitCheckoutButton>
                <span className="f-flagchip">Most complete</span>
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
                <span className="f-kchip">All 9 markers</span>
              </div>

              <div className="f-rep">
                {SAMPLE_ROWS.map(({ label, value, status, band, width }) => (
                  <div key={label}>
                    <div className="f-row-top">
                      <div><span className="f-lab">{label}</span></div>
                      <div>
                        <div className="f-val">{value}</div>
                        <span className={band === 'warn' ? 'f-st f-st-hot' : 'f-st'}>{status}</span>
                      </div>
                    </div>
                    {/* No bar for a report-only marker. An empty row where eight others have
                        bars reads as a rendering fault, so the status word carries the reason. */}
                    {band === null
                      ? <div className="f-bar-none" />
                      : <div className="f-bar"><i className={band === 'warn' ? 'warn' : undefined} style={{ width: width ?? '0%' }} /></div>}
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

      {/* ---------------- THE DATA ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The data</p>
        <h2 className="f-h2">Everything Kit 1 and Kit 2 test.<br /><span className="f-grey">In one kit.</span></h2>
      </div>
      <div className="f-wrap">
        <div className="f-tray f-rise">
          <div className="f-core grid gap-3.5">
            <div className="f-spec" style={{ margin: 0 }}>
              <div>
                <span className="f-spec-k">Hormones, {panelCount('testosterone')}</span>
                <span className="f-spec-v">{panelShortLabels('testosterone').join(' · ')}</span>
              </div>
              <div>
                <span className="f-spec-k">Energy and recovery, {panelCount('energy-recovery')}</span>
                <span className="f-spec-v">{panelShortLabels('energy-recovery').join(' · ')}</span>
              </div>
              <div>
                <span className="f-spec-k">One finger-prick</span>
                <span className="f-spec-v">Same collection, same turnaround, one sample</span>
              </div>
            </div>
            <p className="f-sub">The right choice when you are not sure whether the problem is testosterone, deficiency, or both. If there is ambiguity, start here.</p>
          </div>
        </div>
      </div>

      {/* ---------------- THE NINE MARKERS ----------------
          Kept from the live page; Frame R draws no biomarker grid. See the
          header note: following the frame here would leave the flagship the
          thinnest of the three kit pages. */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The panel</p>
        <h2 className="f-h2">Nine markers.<br /><span className="f-grey">Hormones, energy, recovery, inflammation.</span></h2>
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

      {/* ---------------- THE NEXT STEP ---------------- */}
      <div className="f-wrap f-sec">
        <p className="f-blab">The next step</p>
        <h2 className="f-h2">We don&rsquo;t just give you numbers.</h2>
      </div>
      <div className="f-wrap">
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-sub">Nine markers means the widest set of recommendation pathways: both testosterone and deficiency patterns, with a specific route for each. Where a result needs a doctor, the report says so and says why.</p>
          </div>
        </div>
      </div>

      {/* ---------------- BUILT FOR ----------------
          Body restored: Frame R draws the heading and nothing under it. */}
      <div className="f-wrap f-sec">
        <p className="f-blab">Built for</p>
        <h2 className="f-h2">The men&rsquo;s health blood test your GP doesn&rsquo;t offer.</h2>
      </div>
      <div className="f-wrap">
        <div className="f-bios">
          {BUILT_FOR.map((line) => (
            <div key={line} className="f-bio f-rise"><p>{line}</p></div>
          ))}
        </div>
        <div className="f-tray f-rise" style={{ marginTop: 18 }}>
          <div className="f-core">
            <p className="f-sub" style={{ margin: 0 }}>If you&rsquo;re not sure where to start, start here.</p>
          </div>
        </div>
      </div>

      {/* ---------------- FOUNDERS ---------------- */}
      <div className="f-wrap f-sec">
        <h2 className="f-h2">Built by men who needed it.<br /><span className="f-grey">Backed by doctors who understand it.</span></h2>
      </div>
      <div className="f-wrap">
        <div className="f-founders">
          {FOUNDERS.map(({ initials, name, role, quote }) => (
            <div key={name} className="f-founder f-rise">
              <div className="f-founder-who">
                <div className="f-founder-av" aria-hidden="true">{initials}</div>
                <div>
                  <h3>{name}</h3>
                  <div className="f-founder-role">{role}</div>
                </div>
              </div>
              <p className="f-founder-q">{quote}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- COMPARE ----------------
          Derived from lib/pricing.ts and lib/kits/panel.ts, which is what the
          frame's own annotation asks for. Reuses .f-table rather than adding a
          second table system. */}
      <div className="f-wrap f-sec">
        <p className="f-blab">Compare</p>
        <h2 className="f-h2">All three kits, side by side.</h2>
      </div>
      <div className="f-wrap">
        <p className="f-fine f-scrollhint">Scroll to see all kits &rarr;</p>
        <div className="f-tray" style={{ marginTop: 18 }}>
          <div className="f-core">
            <div className="f-tablewrap">
              <table className="f-table">
                <thead>
                  <tr>
                    <th scope="col">Spec</th>
                    {CMP_ORDER.map((kit) => (
                      <th scope="col" key={kit} className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}>
                        {CMP_HEAD[kit].num}
                        <span className="f-th-price">{CMP_HEAD[kit].name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CMP_ROWS.map(({ label, cell }) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {CMP_ORDER.map((kit) => (
                        <td key={kit} className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}>{cell(kit)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td />
                    {CMP_ORDER.map((kit) => (
                      <td key={kit} className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}>
                        {kit === 'hormone-recovery' ? (
                          <span className="f-fine">You&rsquo;re here</span>
                        ) : (
                          <Link href={`/kits/${kit}`} className="f-btn f-btn-sm f-btn-ghost">Order</Link>
                        )}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CONFORMITY LINE: D+ Kit 3 (CA-026), rendered VERBATIM. There is one of these
          on each kit page and all three sentences differ; none is a template fill. */}
      <div className="f-wrap" style={{ paddingTop: 26 }}>
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">The same two rules</p>
            <p style={{ fontSize: 'clamp(1.15rem,2.2vw,1.5rem)', lineHeight: 1.45, letterSpacing: '-0.025em' }}>
              The full panel follows the same two rules. Anything that needs a doctor goes to a GP and earns us nothing. And no result changes what we offer or what it costs.
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
        /* Bundle-forward CLOSE: the page ends on the retest add-on chooser. No
           trailing related reading. Keith direction 2026-07-24. */
        <div className="f-wrap f-close" id="order">
          <h2>One test.<br />Nine answers.<br />The full picture.</h2>
          <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
          <div className="mx-auto max-w-3xl text-left">
            <BundleChoice
              kitType="hormone-recovery"
              kitLabel="Kit 3: Hormone & Recovery"
              singlePrice={179}
              bundleType="full_picture"
              bundleName="Full-picture"
              bundlePrice={259}
              basePortion={179}
              retestPortion={80}
              retestLabel="Day-90 retest (Energy & Recovery panel)"
              savings={39}
              mechanic="Your second kit ships around day 90 so you can see how your numbers have changed. We confirm your address before it ships."
              ribbonLabel="Kit 3 plus a day-90 retest"
              badgeLabel="Track your change"
              bundleTitle="Kit 3 plus a Retest"
              savingsNote="£39 saving vs adding the retest later at full price"
              ctaLabel="Order Kit 3 + Retest: £259"
            />
          </div>
          <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
        </div>
      ) : (
        <>
          <RelatedArticles
            slugs={['myth-of-normal-range', 'low-vitamin-d-symptoms', 'inflammatory-markers-blood-test']}
            intro="Go deeper on the markers in this panel, from testosterone ranges to vitamin D and inflammation."
          />

          <div className="f-wrap f-close" id="order">
            <h2>One test.<br />Nine answers.<br />The full picture.</h2>
            <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
            <KitCheckoutButton kitType="hormone-recovery" className="f-btn">
              Order the kit: £179 {ARROW}
            </KitCheckoutButton>
            <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
          </div>
        </>
      )}
    </div>
  )
}
