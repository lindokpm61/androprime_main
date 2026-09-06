import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeroField } from '@/components/marketing/HeroField'
import { SectionRule } from '@/components/marketing/SectionRule'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { BundleChoice } from '@/components/commerce/BundleChoice'
import { JsonLd } from '@/components/shared/JsonLd'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'
import { isBundlesEnabled } from '@/lib/flags'
import { KIT_NAMES } from '@/lib/kits/names'
import { PRICING } from '@/lib/pricing'
import { SIZES_BENTO_5 } from '@/lib/ui/image-sizes'
import { FAI_REPORT_ONLY, PANEL_MARKERS, ALL_PANEL_MARKER_IDS, KIT_PANELS, panelCount } from '@/lib/kits/panel'

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
 *
 * ---------------------------------------------------------------------------
 * CAUGHT UP WITH THE SYSTEM, 2026-09-03. This page was rebuilt on 2026-08-29 and
 * then stood still while `/` and `/kits` took four more commits, so it was a
 * Direction F page a generation behind Direction F. Its own header banner said
 * REBUILT IN DIRECTION F and was true when written, which is exactly why the gap
 * was invisible: the tell was not in the file, it was in `git log` for the file
 * against `git log` for the branch.
 *
 * Two changes, both ports rather than decisions:
 *
 *   1. THE HERO TAKES THE SHARED GROUND. `HeroField` inside `.f-ruleground`, the
 *      same component and the same geometry as `/` and `/kits`. The reader
 *      arrives here FROM one of those two pages, so this was the click where the
 *      ground disappeared and the typeface was left carrying the handover alone.
 *   2. `.f-herogrid` REPLACES THE RAW TAILWIND GRID. Same 1.35fr/1fr pair, but
 *      Tailwind's `lg` turns at 1024px and `.f-herogrid` turns at 980, so the
 *      hero now turns on a system breakpoint rather than the framework's.
 *      (The "900px" this line used to claim was the section rhythm's number.)
 *
 * NO COPY CHANGED, and no image was added: the photograph was already here.
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
    description: 'At-home testosterone blood test. Total T, SHBG, FAI, Albumin, Free T. UKAS ISO 15189 accredited. Results in 2 to 5 working days. £99.',
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
    //   marker  14.2 -> 40.6%
    // SPLIT: 14.2 sits inside the lab's 8.64-29.00 so a standard report says
    // normal and stops; it also sits in OUR 12-20 band, the state
    // `normal-testosterone`, which badges Monitor. Same number, two verdicts.
    name: 'Testosterone', qualifier: 'total', value: '14.2', unit: 'nmol/L',
    labLeft: 24.7, labWidth: 58.2, oursLeft: 34.3, oursWidth: 22.8, you: 40.6,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // resolveBarZones SHBG: warning below referenceLow, optimal to
    // referenceHigh, warning above -- i.e. OUR BAND IS THE LAB'S BAND, by Ewa
    // ruling 7 ("match the lab assay, no fixed numbers", 2026-06-16). Vitall
    // male 20.6-76.7 nmol/L, which is also the code fallback. Scale 0-100.
    //   lab    20.6 -> 20.6%, 76.7 -> 76.7%, width 56.1%
    //   ours   identical, which is why `.f-band-ours` is inset 2px vertically
    //   marker 38.5 -> 38.5%
    // No split is possible here by construction: the two ranges are one range.
    // `shbg-normal` badges In range.
    name: 'SHBG', qualifier: 'binding globulin', value: '38.5', unit: 'nmol/L',
    labLeft: 20.6, labWidth: 56.1, oursLeft: 20.6, oursWidth: 56.1, you: 38.5,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // NO TRACK. resolveBarZones returns [] for FAI (Ewa ruling 8: report-only,
    // not banded in men) because a coloured bar IS a verdict, and the generic
    // fallback used to derive one from the lab range while the card text called
    // the same value normal. Vitall does return a male interval (35.0-92.6%),
    // but we do not interpret against it, so nothing is drawn.
    // The badge is read from FAI_REPORT_ONLY, never written here.
    name: PANEL_MARKERS.fai.name, qualifier: 'reported, not interpreted', value: '36.9', unit: '%',
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
    //   marker 42.0 -> 70.0%
    // OUR BAND IS WIDER THAN THE LAB'S AT THE TOP, and that is the ruling drawn
    // honestly: above 50 the lab's interval ends and we still take no action.
    // `normal-albumin` badges In range.
    name: 'Albumin', qualifier: 'transport protein', value: '42.0', unit: 'g/L',
    labLeft: 58.3, labWidth: 25.0, oursLeft: 58.3, oursWidth: 41.7, you: 70.0,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // resolveBarZones Free Testosterone: `{critical, upTo: referenceLow}` then
    // `{optimal, upTo: null}`. A FLOOR again, and dynamic: the cut is whatever
    // referenceLow arrives with the sample (Ewa ruling 7). Vitall male
    // 0.1980-0.6190 nmol/L, confirmed 2026-08-06. Scale 0-0.8 nmol/L.
    //   lab   0.198 -> 24.8%, 0.619 -> 77.4%, width 52.6%
    //   ours  0.198 -> 24.8%, to the track end -> 100%, width 75.2%
    //   marker 0.244 -> 30.5%
    // Illustrative: a real card bands against the range returned with the
    // sample. `ft-normal` badges In range.
    name: 'Free testosterone', qualifier: 'calculated', value: '0.244', unit: 'nmol/L',
    labLeft: 24.8, labWidth: 52.6, oursLeft: 24.8, oursWidth: 75.2, you: 30.5,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
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

      {/* ---------------- HERO ----------------
          paddingTop moved off the inline style and onto f-sec-hero so the hero
          gives it back while the consent banner is up: at 390 the "Order the
          kit" button sat 78% under the banner. --f-hero-pt carries the 62 the
          inline style used to set, and an inline style could not have been
          overridden by the class.

          THE GROUND, ported 2026-09-03. The SAME `HeroField` as `/` and `/kits`,
          not a texture that resembles it: horizontal gauge rows carrying a lab
          band, an action band and a marker, drifting at a per-row speed. Before
          this the three detail pages opened on flat white while the two pages
          that link to them opened on the field, so the typeface alone carried
          the handover across the click that matters most commercially.

          It is full-bleed, so `.f-ruleground` sits OUTSIDE `.f-wrap`:
          constraining a ground to the 1180px measure draws a box with two hard
          edges. Only the `<section>` is lifted to z-index 2, which is why the
          hero is a `<section>` and not the `<div>` it used to be: `.f-field`
          sets its own `position: absolute` and `z-index: 1`, and the stylesheet
          rule is `.f-ruleground > section`. `.f-field` brings its own mask, its
          own 0.34 opacity and its own per-row fade near the headline band, so
          the type keeps contrast with nothing added here.

          ⚠ CA-045 q6/q7 are open against this layer and now cover five surfaces
          rather than two. See `lib/home/fieldRows.ts` and register row 18. */}
      <div className="f-ruleground">
        <HeroField />
      <section
        className="f-wrap f-sec-hero"
        style={{ ['--f-hero-pt' as string]: '62px', ['--f-hero-pt-lg' as string]: '62px', paddingBottom: 44 }}
      >
        {/* `.f-herogrid`, not the raw Tailwind grid it replaced. The declarations
            were the same 1.35fr/1fr pair, but the breakpoint was not: Tailwind's
            `lg` is 1024px and `.f-herogrid` turns at 980, so the hero is now on
            the system's own breakpoint rather than the framework's. The reveal
            moves here from the tray, matching `/kits`: two nested `.f-rise`
            elements stagger against each other.
            ⚠ CORRECTED 2026-09-04. This said the system "turns at 900px", which
            is the SECTION RHYTHM's number, not this primitive's. `.f-herogrid`
            turns at 980 deliberately so the readout column keeps ~417px, and the
            reason now sits on the rule itself. */}
        <div className="f-herogrid f-rise">
          <div>
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
              <div className="f-eyebrow mb-5">Kit 1 // {KIT_NAMES['testosterone']}</div>

            <h1 className="f-h1 mb-5">
              Your GP said normal.<br />
              <span className="f-grey">That&rsquo;s not the same as good.</span>
            </h1>

            <p className="f-stand mb-7">
              An at-home testosterone blood test. Find out where your testosterone sits: we test Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T. You get the raw data in plain English, plus a specific recommendation based on your numbers.
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
            <p className="f-price" style={{ marginBottom: 18 }}>&pound;{PRICING.KIT_1.rrp}</p>

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
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="flex items-center justify-between gap-3.5 pb-3.5 mb-1.5" style={{ borderBottom: '1px solid var(--hair-2)' }}>
                <h2 className="f-h4" style={{ fontSize: 18 }}>Your results</h2>
                {/* Carried from `/`, where it sits in `.f-ro-h` beside this same
                    device. This panel drew bands and verdicts without it. */}
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
                  <b style={{ color: 'var(--ink)' }}>Recommendation:</b> Further investigation advised
                </p>
                <span className="f-kchip">2 to 5 working days</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>{/* /.f-ruleground */}

      {/* ---------------- THE REALITY ---------------- */}
      <div className="f-wrap f-sec">
        <SectionRule n={1} of={5} />
        <p className="f-blab">The reality</p>
        <h2 className="f-h2">Stop guessing what&rsquo;s wrong.</h2>
      </div>
      <div className="f-wrap">
        {/* 🔴 THE PROSE LEFT ITS TRAY, 2026-09-02. Containment rule: a card holds a
            transaction or an instrument, and an argument is neither. This block was
            the page's opening argument sitting in a box, which is the pattern that
            made these pages read as an interface while the homepage reads as a
            document. The symptom grid below KEEPS its cards: those are a structured
            set the reader scans rather than reads, and they carry the CA-025 routing.

            The photograph is `img-6`, THE SAME ASSET this kit already uses on the
            homepage kit card and on /kits, matched by slug. No new image, nothing
            added to the CA-045 register, and the three surfaces selling Kit 1 now
            show the same face. Focal point anchors to the top because the man is
            composed high in frame and a centred crop takes his head off. */}
        <div className="f-bento">
          <div className="f-c-7 f-rise">
            <div className="f-plain">
              <p className="f-sub">You&rsquo;re doing everything right. You&rsquo;re training. You&rsquo;re eating well. But your drive has gone, your training has stalled, and you don&rsquo;t feel like yourself anymore.</p>
              <p className="f-sub">When you ask a standard doctor, they run a basic test and tell you you&rsquo;re &ldquo;fine&rdquo;. Fine isn&rsquo;t good enough.</p>
              <p className="f-pull">The NHS sets its threshold to catch severe disease. That&rsquo;s not the same as optimal.</p>
            </div>
          </div>
          <div className="f-c-5 f-rise">
            <div className="f-plate">
              <div
                className="f-shot f-shot-r43"
                style={{ '--focal': '50% 0%' } as React.CSSProperties}
              >
                <Image
                  src="/home/img-6.jpg"
                  alt="A man in his late forties standing in a back doorway at dawn with a mug of tea, looking out over a terraced garden."
                  width={800}
                  height={600}
                  sizes={SIZES_BENTO_5}
                />
              </div>
              <span className="f-shot-cap">Ordinary Tuesday</span>
            </div>
          </div>
        </div>
      </div>

      <div className="f-wrap" style={{ paddingTop: 26 }}>
        <div className="f-tray f-rise">
          <div className="f-core">
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
        <SectionRule n={2} of={5} />
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
        <SectionRule n={3} of={5} />
        <p className="f-blab">The data</p>
        <h2 className="f-h2">Five numbers.<br /><span className="f-grey">The full testosterone picture.</span></h2>
      </div>
      {/* The panel strip, the same instrument /kits leads with, scoped to this kit.
          It says "these five of the nine we run" in the shape a reader has already
          met one click earlier. No value, no range, no needle: nobody has taken the
          test, so there is nothing to read, and this draws COVERAGE only. */}
      <div className="f-wrap" style={{ paddingBottom: 22 }}>
        <div className="f-pstrip" aria-hidden="true" style={{ maxWidth: 420, marginTop: 0 }}>
          {ALL_PANEL_MARKER_IDS.map((id) => (
            <span
              key={id}
              className={KIT_PANELS['testosterone'].includes(id) ? 'f-ps f-on' : 'f-ps'}
            />
          ))}
        </div>
        <p className="f-blab f-pscount">
          {panelCount('testosterone')} of {ALL_PANEL_MARKER_IDS.length} markers &middot;{' '}
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

      {/* ---------------- THE NEXT STEP ---------------- */}
      <div className="f-wrap f-sec">
        <SectionRule n={4} of={5} />
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
          <p className="f-blab f-blab-lg f-invert-lab">If your result is low</p>
          <h2 className="f-h2 f-invert-h">If your results indicate low testosterone, your next step is a conversation with a GP.</h2>
          <p className="f-sub f-invert-p">
            That result earns us nothing.
          </p>
        </div>
      </div>

      {/* ---------------- FAQ ----------------
          Open grid, standardised across all three kit pages (Keith, 2026-08-29).
          Kit 1 was the only one of the three hiding its questions behind a click. */}
      <div className="f-wrap f-sec">
        <SectionRule n={5} of={5} />
        {/* Section label added 2026-09-06. Keith's 2026-09-03 ruling is one section
            grammar across the F pages and it is `/kits`' labelled one; `/` and
            `/kits` label 4 of 4, and the three kit pages were leaving their FAQ
            (and Kit 3 its founders) bare. "Questions" is a section NAME and carries
            no claim. Registered as row 24. */}
        <p className="f-blab">Questions</p>
        <h2 className="f-h2">Frequently asked questions</h2>
      </div>
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
          {/* `variant="f"` since 2026-09-06. This block used to render the blog's
              aesthetic on a Direction F page: the largest single visual
              discontinuity across the five F routes, and it sat between the FAQ
              and the buy CTA. The component now renders in its host's world and
              the host declares which world that is. */}
          <RelatedArticles
            variant="f"
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
