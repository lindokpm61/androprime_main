import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { BundleChoice } from '@/components/commerce/BundleChoice'
import { JsonLd } from '@/components/shared/JsonLd'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'
import { isBundlesEnabled } from '@/lib/flags'
import { KIT_NAMES } from '@/lib/kits/names'
import { ALL_PANEL_MARKER_IDS, FAI_REPORT_ONLY, KIT_PANELS, PANEL_MARKERS, panelShortLabels, panelCount } from '@/lib/kits/panel'
import { PRICING } from '@/lib/pricing'
import { SIZES_BENTO_5 } from '@/lib/ui/image-sizes'
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
 *
 * ---------------------------------------------------------------------------
 * CAUGHT UP WITH THE SYSTEM, 2026-09-03. Rebuilt 2026-08-31, then stood still
 * while `/` and `/kits` took four more commits, so this was a Direction F page a
 * generation behind Direction F. The banner above said REBUILT IN DIRECTION F
 * and was true when written; the tell was `git log` for this path against
 * `git log` for the branch, not anything readable inside the file.
 *
 * FIVE CHANGES, all ports of decisions already ruled elsewhere:
 *
 *   1. THE HERO TAKES THE SHARED GROUND. `HeroField` inside `.f-ruleground`.
 *   2. `f-sec-hero` REPLACES THE INLINE `paddingTop: 62`, so the hero gives its
 *      padding back while the consent banner is up. This page never got Kit 1's
 *      2026-08-31 fix and at 390 the £179 order button sat under the banner,
 *      which on the flagship is the most expensive instance of that defect.
 *   3. `.f-herogrid` REPLACES THE RAW TAILWIND GRID (980px, not Tailwind's lg).
 *   4. THE SECTION SPINE ARRIVES. Eight `SectionRule`s, one per content section
 *      between hero and close, per DESIGN.md's convention. ⚠ EIGHT, and the
 *      count is load-bearing: the needle's position is `n / of`, so counting the
 *      hero or the close would put every needle in the wrong place. The panel
 *      section also takes `f-sec-cont`, because "what the kit contains" followed
 *      by "the nine markers it contains" is a continuation, not a new topic:
 *      the same relationship `/kits` uses the tighter gap for.
 *   5. A PHOTOGRAPH ARRIVED. `img-3`, already used for this kit on `/` and
 *      `/kits` and already on the CA-045 register, matched by slug. It sits
 *      beside the spec block rather than the process steps because that is where
 *      the copy says "one finger-prick, one sample" and the photograph is one
 *      pair of hands holding one tube. The spec block KEEPS its tray: three
 *      derived rows are an instrument, and an instrument belongs in a card.
 *
 * NO NEW COPY. Alt text and caption are existing approved strings carried
 * verbatim from `/kits`. Registered in
 * `09_website-app/redesign-copy-register.md` rows 18 and 19.
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
/*
 * THE SAMPLE READOUT, REBUILT AS THE TWO-RANGE DEVICE, 2026-09-04.
 *
 * WHY IT CHANGED. `/` opens on "Two ranges. Nine markers. You should see both",
 * and the page that actually takes the money showed ONE bar, no lab band, no
 * reference range and no needle. The promise was made where nothing is sold and
 * broken where the money is asked for. Same `.f-mk` / `.f-track` / `.f-band` /
 * `.f-you` device as `/` and `/kits/energy-recovery`, from the same geometry.
 *
 * EVERY BAND POSITION IS ARITHMETIC FROM `04_products/results-engine/
 * thresholds.md` AND `lib/results/classifier.ts:resolveBarZones`, WHICH IS THE
 * RATIFIED SOURCE FOR WHAT A BAR DRAWS PER MARKER. The working is kept inline.
 *
 * A FLOOR IS DRAWN TO THE END OF THE TRACK, AND THAT IS RULED, NOT INVENTED.
 * Albumin and Free Testosterone have no upper action threshold: `resolveBarZones`
 * returns `{ color: 'optimal', upTo: null }` for both, and `upTo: null` means "to
 * the end". Ewa was asked for an albumin upper band on 2026-08-07 and answered
 * "No" (approval-record-biomarker-bands-v2, row "Albumin upper band | No | No
 * change"); CA-044 records the bands themselves as APPROVED, with only two
 * states' card WORDING still pending. So on those two rows our band renders
 * WIDER at the top than the lab reference interval. That is the truth of the
 * ruling: above the lab's upper limit we take no action, and the dashboard has
 * been drawing it that way to customers already.
 *
 * EVERY ROW IS LAB-NORMAL BY CONSTRUCTION, and that is a vocabulary limit rather
 * than a flattering choice. "Lab normal" is the ONLY lab-verdict string that
 * exists anywhere in this app; a value the lab would call out-of-range needs a
 * second string nobody has approved. It is also the honest case, because the
 * device's whole argument is "the lab says normal and we do not".
 *
 * FAI DRAWS NO TRACK. `resolveBarZones` returns [] for it (Ewa ruling 8,
 * report-only, not banded in men) because a coloured bar IS a verdict. It keeps
 * the `.f-bar-none` spacer so the row does not read as a rendering fault, and
 * its badge comes from FAI_REPORT_ONLY rather than being written here.
 *
 * Do not adjust a number here without re-deriving its percentage. A value moved
 * without its arithmetic is a page that contradicts the results engine.
 */
const READOUT: {
  name: string
  qualifier: string | null
  value: string
  unit: string
  labLeft: number
  labWidth: number
  oursLeft: number
  oursWidth: number
  you: number
  lab: string
  ours: string
  split: boolean
  noTrack?: boolean
}[] = [
  {
    // CARRIED FROM `/`. thresholds.md Kit 1 Total Testosterone: our bands low
    // <12, normal 12-20, optimal >20-29, high >29 -> GP. Vitall male reference
    // 8.64-29.00 nmol/L (confirmed 2026-08-06). Scale 0-35 nmol/L.
    //   lab    8.64 -> 24.7%,  29.00 -> 82.9%,  width 58.2%
    //   ours     12 -> 34.3%,     20 -> 57.1%,  width 22.8%
    //   marker  16.8 -> 48.0%
    // SPLIT: 16.8 sits inside the lab's 8.64-29.00 so a standard report says
    // normal and stops; it also sits in OUR 12-20 band, the state
    // `normal-testosterone`, which badges Monitor. Same number, two verdicts.
    name: 'Testosterone', qualifier: 'total', value: '16.8', unit: 'nmol/L',
    labLeft: 24.7, labWidth: 58.2, oursLeft: 34.3, oursWidth: 22.8, you: 48.0,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // resolveBarZones SHBG: warning below referenceLow, optimal to
    // referenceHigh, warning above -- i.e. OUR BAND IS THE LAB'S BAND, by Ewa
    // ruling 7 ("match the lab assay, no fixed numbers", 2026-06-16). Vitall
    // male 20.6-76.7 nmol/L, which is also the code fallback. Scale 0-100.
    //   lab    20.6 -> 20.6%, 76.7 -> 76.7%, width 56.1%
    //   ours   identical, which is why `.f-band-ours` is inset 2px vertically
    //   marker 34.0 -> 34.0%
    // No split is possible here by construction: the two ranges are one range.
    // `shbg-normal` badges In range.
    name: 'SHBG', qualifier: 'binding globulin', value: '34.0', unit: 'nmol/L',
    labLeft: 20.6, labWidth: 56.1, oursLeft: 20.6, oursWidth: 56.1, you: 34.0,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // NO TRACK. resolveBarZones returns [] for FAI (Ewa ruling 8: report-only,
    // not banded in men) because a coloured bar IS a verdict, and the generic
    // fallback used to derive one from the lab range while the card text called
    // the same value normal. Vitall does return a male interval (35.0-92.6%),
    // but we do not interpret against it, so nothing is drawn.
    // The badge is read from FAI_REPORT_ONLY, never written here.
    name: PANEL_MARKERS.fai.name, qualifier: 'reported, not interpreted', value: '41.0', unit: '%',
    labLeft: 0, labWidth: 0, oursLeft: 0, oursWidth: 0, you: 0,
    lab: '', ours: FAI_REPORT_ONLY.badge, split: false, noTrack: true,
  },
  {
    // resolveBarZones Albumin: `{critical, upTo: 35}` then `{optimal, upTo: null}`.
    // `upTo: null` is a FLOOR, not a band -- there is no upper action threshold,
    // and that is a ruling: Ewa was asked for an albumin upper band on 2026-08-07
    // and answered "No" (approval-record-biomarker-bands-v2). Vitall male
    // 35-50 g/L. Scale 0-60 g/L.
    //   lab      35 -> 58.3%, 50 -> 83.3%, width 25.0%
    //   ours     35 -> 58.3%, to the track end -> 100%, width 41.7%
    //   marker 44.0 -> 73.3%
    // OUR BAND IS WIDER THAN THE LAB'S AT THE TOP, and that is the ruling drawn
    // honestly: above 50 the lab's interval ends and we still take no action.
    // `normal-albumin` badges In range.
    name: 'Albumin', qualifier: 'transport protein', value: '44.0', unit: 'g/L',
    labLeft: 58.3, labWidth: 25.0, oursLeft: 58.3, oursWidth: 41.7, you: 73.3,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // resolveBarZones Free Testosterone: `{critical, upTo: referenceLow}` then
    // `{optimal, upTo: null}`. A FLOOR again, and dynamic: the cut is whatever
    // referenceLow arrives with the sample (Ewa ruling 7). Vitall male
    // 0.1980-0.6190 nmol/L, confirmed 2026-08-06. Scale 0-0.8 nmol/L.
    //   lab   0.198 -> 24.8%, 0.619 -> 77.4%, width 52.6%
    //   ours  0.198 -> 24.8%, to the track end -> 100%, width 75.2%
    //   marker 0.31 -> 38.8%
    // Illustrative: a real card bands against the range returned with the
    // sample. `ft-normal` badges In range.
    name: 'Free testosterone', qualifier: 'calculated', value: '0.31', unit: 'nmol/L',
    labLeft: 24.8, labWidth: 52.6, oursLeft: 24.8, oursWidth: 75.2, you: 38.8,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // CARRIED FROM `/`. thresholds.md: <25 -> GP, <50 low, 50-250 normal, >250
    // -> GP (Ewa 2026-08-07). Vitall male range 50-250 nmol/L. Scale 0-250.
    //   lab      50 -> 20.0%, 250 -> 100%, width 80.0%
    //   ours     50 -> 20.0%, 250 -> 100%, width 80.0%
    //   marker 58 -> 23.2%
    // The two ranges COINCIDE. `normal-vitamin-d` badges In range.
    name: 'Vitamin D', qualifier: '25-OH', value: '58', unit: 'nmol/L',
    labLeft: 20, labWidth: 80, oursLeft: 20, oursWidth: 80, you: 23.2,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // NICE NG239 three-band, <25 low, 25-70 borderline, >70 normal; Ewa
    // re-ratified 2026-08-07. Vitall assay cut >37.5 pmol/L. Scale 0-100.
    //   lab    37.5 -> 37.5%, 100 -> 100%, width 62.5%
    //   ours     25 -> 25.0%,  70 ->  70%, width 45.0%
    //   marker 58 -> 58.0%
    // SPLIT: the assay calls it normal, NG239 calls it indeterminate.
    // `borderline-b12` badges Monitor.
    name: 'Active B12', qualifier: 'holo-TC', value: '58', unit: 'pmol/L',
    labLeft: 37.5, labWidth: 62.5, oursLeft: 25, oursWidth: 45, you: 58.0,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // thresholds.md hs-CRP: <=1 normal, >1-3 elevated, >3-10 moderate, >10 -> GP
    // (AHA/CDC 2003 banding, Ewa 2026-06-16 ruling 6 "no change"). Vitall
    // reference <1.00 mg/L, matching our cut at 1 exactly (thresholds.md line
    // 63). Scale 0-10, the full actionable range to the GP cut.
    //   lab       0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   ours      0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   marker 0.8 -> 8.0%
    // No split is POSSIBLE at a lab-normal value: the lab's cut and ours are the
    // same number. `normal-crp` badges In range.
    name: 'hs-CRP', qualifier: 'inflammation', value: '0.8', unit: 'mg/L',
    labLeft: 0, labWidth: 10, oursLeft: 0, oursWidth: 10, you: 8.0,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // thresholds.md: <30 -> GP, 30-100 borderline / indeterminate (Ewa ruling 5,
    // 2026-06-16), 100-300 normal, >300 -> GP. Vitall male 30-442 ug/L.
    // Scale 0-450.
    //   lab      30 ->  6.7%, 442 -> 98.2%, width 91.5%
    //   ours     30 ->  6.7%, 100 -> 22.2%, width 15.5%
    //   marker 39 -> 8.7%
    // SPLIT. `suboptimal-ferritin` badges Monitor.
    name: 'Ferritin', qualifier: 'iron stores', value: '39', unit: 'µg/L',
    labLeft: 6.7, labWidth: 91.5, oursLeft: 6.7, oursWidth: 15.5, you: 8.7,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
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
    <FPage>
      <JsonLd data={kitSchema} />

      {/* ---------------- HERO ----------------
          THE GROUND, ported 2026-09-03. The SAME `HeroField` as `/`, `/kits` and
          the other two kit pages. `.f-ruleground` sits OUTSIDE `.f-wrap` because
          constraining a full-bleed ground to the 1180px measure draws a box with
          two hard edges, and the hero is a `<section>` because the stylesheet
          lifts `.f-ruleground > section` alone: `.f-field` sets its own
          `position: absolute` / `z-index: 1` and a blanket child rule would drop
          the canvas into flow. Mask, opacity and the per-row fade near the
          headline all come from `.f-field`. ⚠ CA-045 q6/q7 are open against this
          layer; register row 18.

          `f-sec-hero` REPLACES the inline `paddingTop: 62`. Kit 1 moved its hero
          padding onto the class on 2026-08-31 because at 390 the consent banner
          covered 78% of the order button; `--f-hero-pt` is given back while the
          banner is up and an inline style cannot be overridden by the class.
          This page kept the inline literal and therefore kept the defect. */}
      <FHero heroPad={62} padBottom={44}
        aside={

          /* Sample report. A results panel: status bands, never the accent. */
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="flex items-center justify-between gap-3.5 pb-3.5 mb-1.5" style={{ borderBottom: '1px solid var(--hair-2)' }}>
                <h2 className="f-h4" style={{ fontSize: 18 }}>Your results</h2>
                {/* Carried from `/`, where it sits in `.f-ro-h` beside this same
                    device. This panel drew nine bands and verdicts without it,
                    which of the three is the one that most needed it. */}
                <span className="f-kchip">Nothing here is a diagnosis</span>
              </div>

              {/* The key. Carried verbatim from `/`. Padding zeroed because
                  `.f-ro-k` carries its own for the homepage's edge-to-edge card
                  and this one sits inside a normally padded `.f-core`. */}
              <div className="f-ro-k" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <span><i className="f-k-lab" aria-hidden="true" />Lab reference range</span>
                <span><i className="f-k-ours" aria-hidden="true" />Our action band</span>
                <span><i className="f-k-you" aria-hidden="true" />Your value</span>
              </div>

              <div>
                {READOUT.map((m) => (
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

              <div className="flex flex-wrap items-center justify-between gap-3.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--hair-2)' }}>
                <p className="f-sub" style={{ fontSize: 14.5, margin: 0 }}>
                  <b style={{ color: 'var(--ink)' }}>Recommendation:</b> Your next step, based on your numbers
                </p>
                <span className="f-kchip">2 to 5 working days</span>
              </div>
            </div>
          </div>
        }
      >
            {/* THE EYEBROW NAMES THE PRODUCT, 2026-09-06. Across the five F routes these
                read: none, "Diagnostic kits", "Kit 01 // Testosterone", "Data first",
                "Data first" -- so two DIFFERENT products shared an eyebrow that
                identified neither, one click apart.
                Two things are fixed at once. The number is UNPADDED, matching
                `/kits`' own `NUMBER_LABEL` ("Kit 1") and the homepage cards; Kit 1
                was the only "Kit 01" on the site. And the name is read from
                `lib/kits/names.ts` rather than typed, so this is not a 67th
                hardcoded call site -- register row 16 counts 66 and row 14 records
                that the SHORT forms ("Testosterone") were the unapproved variant,
                which is what this eyebrow used to carry. */}
              <div className="f-eyebrow mb-5">Kit 3 // {KIT_NAMES['hormone-recovery']}</div>

            <h1 className="f-h1 mb-5">Nine numbers every man over 40 should know.</h1>

            <p className="f-stand mb-7">
              A complete men&rsquo;s health blood test you take at home. Hormones, energy, recovery, and inflammation: one test, nine biomarkers, and the full picture of what&rsquo;s going on inside your body, with a specific recommendation based on your data.
            </p>

            {/* THE PRICE, AS AN OBJECT, 2026-09-04. Before this there was no
                price element on any of the three kit pages: `.f-price` /
                `.f-kprice` / `.f-prow-p` counted 3 on `/` and 6 on `/kits` and
                ZERO here, so the number existed only as a substring inside the
                button label and in one FAQ answer. A reader arriving from either
                of those pages met the price as a 32-35px typographic object and
                landed on the page that takes the money with nothing to look at.

                🔴 IT READS FROM `lib/pricing.ts`, NEVER A LITERAL. The register
                already records that the three product names had 66 hardcoded call
                sites and one module claiming to be their source; a price typed by
                hand here would be the same defect on the more expensive field.

                `.f-price` is the SAME class `/kits` uses, so the three surfaces
                selling this kit now set its price in one type treatment rather
                than the eight the critique measured across the five pages. */}
            <p className="f-price" style={{ marginBottom: 18 }}>&pound;{PRICING.KIT_3.rrp}</p>

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
      </FHero>

      {/* ---------------- THE DATA ---------------- */}
      <FSection>
        <p className="f-blab">The data</p>
        <h2 className="f-h2">Everything Kit 1 and Kit 2 test.<br /><span className="f-grey">In one kit.</span></h2>
      </FSection>
      <div className="f-wrap">
        {/* THE PHOTOGRAPH, added 2026-09-03. `img-3`, THE SAME ASSET this kit
            already uses on the homepage kit card and on /kits, matched by slug.
            No new image, nothing added to the CA-045 register, and the three
            surfaces selling Kit 3 now show the same face. Alt text and caption
            are carried verbatim from /kits rather than rewritten, because that
            copy was checked against the actual photograph.

            It sits HERE rather than beside the process steps, and the reason is
            the copy it lands next to: the third spec row reads "One finger-prick
            / Same collection, same turnaround, one sample", and the photograph is
            a pair of hands holding one sample tube. Its focal point sits just
            above centre (the hands run to 45% of frame), which is what /kits
            reads off the image itself.

            The spec block KEEPS its tray. Containment rule: a card holds a
            transaction or an instrument, and three derived spec rows are an
            instrument. */}
        <div className="f-bento">
          <div className="f-c-7 f-rise">
            <div className="f-tray" style={{ marginBottom: 0 }}>
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
          <div className="f-c-5 f-rise">
            <div className="f-plate">
              <div
                className="f-shot f-shot-r43"
                style={{ '--focal': '50% 40%' } as React.CSSProperties}
              >
                <Image
                  src="/home/img-3.jpg"
                  alt="A man's hands at a kitchen table holding a small plain sample collection tube."
                  width={800}
                  height={600}
                  sizes={SIZES_BENTO_5}
                />
              </div>
              <span className="f-shot-cap">Five minutes, at home</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE NINE MARKERS ----------------
          Kept from the live page; Frame R draws no biomarker grid. See the
          header note: following the frame here would leave the flagship the
          thinnest of the three kit pages. */}
      {/* `f-sec-cont`: this boundary is a continuation, not a topic change. The
          section above says what the kit contains and this one names the markers
          it contains, which is the same relationship /kits has between its panel
          instrument and the products it measures. The full gap announced a new
          subject about the same one. See `--f-sec-gap-cont`. */}
      <FSection cont>
        <p className="f-blab">The panel</p>
        <h2 className="f-h2">Nine markers.<br /><span className="f-grey">Hormones, energy, recovery, inflammation.</span></h2>
      </FSection>
      {/* The panel strip, the same instrument /kits leads with, scoped to this kit
          and ported from Kit 1. On Kit 3 it is the only UNBROKEN bar of the three,
          which is the argument this page makes in words made a second way. No
          value, no range, no needle: nobody has taken the test, so there is
          nothing to read, and this draws COVERAGE only. Derived from KIT_PANELS,
          so it cannot desync from /kits or from the engine. */}
      <div className="f-wrap" style={{ paddingBottom: 22 }}>
        <div className="f-pstrip" aria-hidden="true" style={{ maxWidth: 420, marginTop: 0 }}>
          {ALL_PANEL_MARKER_IDS.map((id) => (
            <span
              key={id}
              className={KIT_PANELS['hormone-recovery'].includes(id) ? 'f-ps f-on' : 'f-ps'}
            />
          ))}
        </div>
        <p className="f-blab f-pscount">
          {panelCount('hormone-recovery')} of {ALL_PANEL_MARKER_IDS.length} markers &middot;{' '}
          <Link href="/kits" style={{ textDecoration: 'underline' }}>see the full panel</Link>
        </p>
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
      <FSection>
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Five minutes.<br /><span className="f-grey">No GP needed.</span></h2>
      </FSection>
      <div className="f-wrap">
        <div className="f-steps">
          {STEPS.map(({ n, t, b, metaK, metaV }) => (
            <div key={n} className="f-step f-rise">
              <span className="f-no">{n}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{t}</h3>
              <p className="f-sub" style={{ fontSize: 14.5 }}>{b}</p>
              <div className="f-step-foot"><span>{metaK}</span><b>{metaV}</b></div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- THE NEXT STEP ---------------- */}
      <FSection>
        <p className="f-blab">The next step</p>
        <h2 className="f-h2">We don&rsquo;t just give you numbers.</h2>
      </FSection>
      <div className="f-wrap">
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-sub">Nine markers means the widest set of recommendation pathways: both testosterone and deficiency patterns, with a specific route for each. Where a result needs a doctor, the report says so and says why.</p>
          </div>
        </div>
      </div>

      {/* ---------------- BUILT FOR ----------------
          Body restored: Frame R draws the heading and nothing under it. */}
      <FSection>
        <p className="f-blab">Built for</p>
        <h2 className="f-h2">The men&rsquo;s health blood test your GP doesn&rsquo;t offer.</h2>
      </FSection>
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
      <FSection>
        {/* Section label added 2026-09-06, same ruling as the FAQ labels.
            "The founders" is factual and is what the section contains; it does not
            restate the heading, which is the argument rather than the subject. */}
        <p className="f-blab">The founders</p>
        <h2 className="f-h2">Built by men who needed it.<br /><span className="f-grey">Backed by doctors who understand it.</span></h2>
      </FSection>
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
      <FSection>
        <p className="f-blab">Compare</p>
        <h2 className="f-h2">All three kits, side by side.</h2>
      </FSection>
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
                    {/* "Start a baseline", not "Order". These were the LAST TWO places
                        on the site still saying "Order", and register row 15 removed that
                        label from `/kits`' cards on 2026-09-03 for two reasons that both
                        apply here: it is not the label `/` and `/kits` use for this exact
                        action on these exact products, and it over-promises, because the
                        link leads to a product page and not to a basket. This table was
                        simply missed by that sweep. */}
                    {CMP_ORDER.map((kit) => (
                      <td key={kit} className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}>
                        {kit === 'hormone-recovery' ? (
                          <span className="f-fine">You&rsquo;re here</span>
                        ) : (
                          <Link href={`/kits/${kit}`} className="f-btn f-btn-sm f-btn-ghost">Start a baseline {ARROW}</Link>
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
          on each kit page and all three sentences differ; none is a template fill.

          🔴 IT TOOK THE INK PANEL ON 2026-09-04, AND THE REASON IS WHERE IT WAS NOT.
          `/` gives this same argument a full-bleed `.f-invert` ("We do not sell you
          the answer.") and `/kits` gives its C1 the same. The three pages that
          actually take money gave it a plain white tray with no heading, so the
          claim PRODUCT.md names as the brand lead was shouted where nothing is sold
          and murmured where £99 to £179 is asked for. Measured before the change:
          `.f-invert` count across the five F routes was 4, 4, 0, 0, 0.

          ⚠ NOT ONE WORD CHANGED, AND THE SPLIT IS AT A SENTENCE BOUNDARY WITH THE
          ORDER PRESERVED. The first sentence becomes the heading and the remainder
          becomes the paragraph, which is the homepage's own structure and is applied
          identically on all three kit pages. A reordering would have been a copy
          edit wearing a container's clothes. Registered as row 20.

          This is also each page's ONE inverted block, which is the cap DESIGN.md
          sets, and it gives Kits 2 and 3 the dark anchor they had nowhere on the
          page: before this, neither carried an ink-filled area larger than a
          button. */}
      <div className="f-wrap" style={{ paddingTop: 26 }}>
        <div className="f-invert f-rise">
          <p className="f-blab f-blab-lg f-invert-lab">The same two rules</p>
          {/* ⚠ SPLIT AFTER SENTENCE 1, unlike Kit 2, and the difference is not
              stylistic. Kit 2's mono label IS its first sentence, so splitting
              there set the identical string twice; this page's label ("The same
              two rules") is only a substring of its first sentence, which is the
              ordinary kicker-then-statement shape rather than a duplication.
              Moving the split later here would have DELETED "The full panel
              follows the same two rules." from the page, and that sentence is
              CA-026 copy. All three sentences are present, in order. */}
          <h2 className="f-h2 f-invert-h">The full panel follows the same two rules.</h2>
          <p className="f-sub f-invert-p">
            Anything that needs a doctor goes to a GP and earns us nothing. And no result changes what we offer or what it costs.
          </p>
        </div>
      </div>

      {/* ---------------- FAQ ----------------
          Open grid, standardised across all three kit pages (Keith, 2026-08-29). */}
      <FSection>
        {/* Section label added 2026-09-06. Keith's 2026-09-03 ruling is one section
            grammar across the F pages and it is `/kits`' labelled one; `/` and
            `/kits` label 4 of 4, and the three kit pages were leaving their FAQ
            (and Kit 3 its founders) bare. "Questions" is a section NAME and carries
            no claim. Registered as row 24. */}
        <p className="f-blab">Questions</p>
        <h2 className="f-h2">Frequently asked questions</h2>
      </FSection>
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
        <FClose id="order">
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
        </FClose>
      ) : (
        <>
          {/* `variant="f"` since 2026-09-06. See the note on the same call in
              `/kits/testosterone`: the component renders in its host's world now
              and the host declares which world that is. */}
          <RelatedArticles
            variant="f"
            slugs={['myth-of-normal-range', 'low-vitamin-d-symptoms', 'inflammatory-markers-blood-test']}
            intro="Go deeper on the markers in this panel, from testosterone ranges to vitamin D and inflammation."
          />

          <FClose id="order">
            <h2>One test.<br />Nine answers.<br />The full picture.</h2>
            <p className="f-stand">A finger prick. A prepaid envelope. That&rsquo;s it.</p>
            <KitCheckoutButton kitType="hormone-recovery" className="f-btn">
              Order the kit: £179 {ARROW}
            </KitCheckoutButton>
            <p className="f-fine mx-auto mt-5" style={{ maxWidth: '44ch' }}>One-off purchase. Results in your personal dashboard. No GP needed.</p>
          </FClose>
        </>
      )}
    </FPage>
  )
}
