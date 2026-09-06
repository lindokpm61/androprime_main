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
import { ALL_PANEL_MARKER_IDS, KIT_PANELS, panelCount } from '@/lib/kits/panel'

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
 *
 * ---------------------------------------------------------------------------
 * CAUGHT UP WITH THE SYSTEM, 2026-09-03. Rebuilt 2026-08-31, then stood still
 * while `/` and `/kits` took four more commits, so this was a Direction F page a
 * generation behind Direction F. The header banner above said REBUILT IN
 * DIRECTION F and was true when written, which is why the gap was invisible from
 * inside the file: the tell was `git log` for this path against `git log` for the
 * branch. Kit 2 had drifted furthest of the three, because Kit 1 got fixes on
 * 2026-08-31 and 2026-09-02 that were never ported sideways.
 *
 * FIVE CHANGES, all ports of decisions already ruled elsewhere:
 *
 *   1. THE HERO TAKES THE SHARED GROUND. `HeroField` inside `.f-ruleground`, the
 *      same component and geometry as `/`, `/kits` and the other two kit pages.
 *   2. `f-sec-hero` REPLACES THE INLINE `paddingTop: 62`. This page never got
 *      Kit 1's 2026-08-31 consent-banner fix, so at 390 the order button sat
 *      under the banner. An inline literal cannot be overridden by the class,
 *      which is the whole reason that fix moved the value onto a token.
 *   3. `.f-herogrid` REPLACES THE RAW TAILWIND GRID. Same 1.35fr/1fr pair, but
 *      Tailwind's `lg` turns at 1024px and `.f-herogrid` turns at 980.
 *   4. THE SECTION SPINE ARRIVES. Four `SectionRule`s, one per content section
 *      between the hero and the close, following the convention DESIGN.md sets:
 *      the hero takes no rule and the close takes no rule, so `of` counts what
 *      is between them. This page and Kit 3 had NO measurement device at all
 *      while `/`, `/kits` and Kit 1 all carried it, and DESIGN.md calls it the
 *      one piece of visual language the product owns.
 *   5. THE PROSE LEFT ITS TRAY AND A PHOTOGRAPH ARRIVED. Kit 1's 2026-09-02
 *      containment move, ported: an argument is not a transaction or an
 *      instrument, so it does not belong in a card. The symptom grid keeps its
 *      tray. The photograph is `img-7`, already used for this kit on `/` and
 *      `/kits` and already on the CA-045 register, matched by slug.
 *
 * NO NEW COPY. The photograph's alt text and caption are existing approved
 * strings carried verbatim from `/kits`; the prose is the same two sentences in
 * a different container. Registered in `09_website-app/redesign-copy-register.md`
 * rows 18 and 19.
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
/*
 * THE SAMPLE READOUT, REBUILT AS THE TWO-RANGE DEVICE, 2026-09-04.
 *
 * WHY IT CHANGED. `/` opens on "Two ranges. Nine markers. You should see both",
 * and then the page that actually takes the money showed ONE bar, no lab band,
 * no reference range and no needle. The promise was made on the page that sells
 * nothing and broken on the page that sells. This row set is now the same
 * `.f-mk` / `.f-track` / `.f-band` / `.f-you` device the homepage uses, from the
 * same geometry, so the argument survives the click.
 *
 * EVERY BAND POSITION IS ARITHMETIC FROM `04_products/results-engine/
 * thresholds.md`, and THREE OF THESE FOUR ROWS ARE CARRIED VERBATIM FROM THE
 * HOMEPAGE, values and verdicts included. That is deliberate: those three have
 * already been rendered to customers with this exact geometry, so porting them
 * adds no new clinical assertion. Only hs-CRP is new here, and its two bands
 * COINCIDE, which is the weakest visual claim the device can make.
 *
 * EVERY ROW IS LAB-NORMAL BY CONSTRUCTION, and that is a compliance choice
 * rather than a flattering one. `f-v-lab` carries the string "Lab normal" on all
 * four rows, byte-identical to `/`. Choosing a value the lab would call
 * out-of-range would have required inventing a second lab verdict string that
 * exists nowhere in the approved set. The device's whole argument is "the lab
 * says normal and we do not", so lab-normal rows are also the honest case.
 *
 * THE RESULT IS NOW MIXED, WHICH IS A DELIBERATE REVERSAL (Keith, 2026-09-04).
 * The previous four rows read Action needed / Monitor / Monitor / Monitor: every
 * marker flagged, so the demonstration of the product was a man for whom nothing
 * is fine. For a reader arriving because he is not recovering, that is
 * fear-shaped and it sits badly beside "we sell certainty and clarity". Two rows
 * now read In range and two read Monitor. Both Monitors are genuine SPLITS, so
 * the page still shows the product finding something a standard report misses.
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
}[] = [
  {
    // CARRIED FROM `/`. thresholds.md: <25 -> GP, <50 low, 50-250 normal, >250
    // -> GP (Ewa 2026-08-07). Vitall male range 50-250 nmol/L. Scale 0-250.
    //   lab      50 -> 20.0%, 250 -> 100%, width 80.0%
    //   ours     50 -> 20.0%, 250 -> 100%, width 80.0%
    //   marker   58 -> 23.2%
    // The two ranges COINCIDE, which is why `.f-band-ours` is inset 2px
    // vertically: at equal height it covered the lab band exactly.
    // `normal-vitamin-d` badges In range.
    name: 'Vitamin D', qualifier: 'muscle function & energy', value: '58', unit: 'nmol/L',
    labLeft: 20, labWidth: 80, oursLeft: 20, oursWidth: 80, you: 23.2,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // CARRIED FROM `/`. NICE NG239 three-band, <25 low, 25-70 borderline, >70
    // normal; Ewa re-ratified 2026-08-07 with the assay cut visible. Vitall
    // assay cut is >37.5 pmol/L. Scale 0-100.
    //   lab    37.5 -> 37.5%, 100 -> 100%, width 62.5%
    //   ours     25 -> 25.0%,  70 ->  70%, width 45.0%
    //   marker   45 -> 45.0%
    // SPLIT: the assay calls 45 normal, NG239 calls it indeterminate. Same
    // number, two verdicts. `borderline-b12` badges Monitor.
    name: 'Active B12', qualifier: 'cellular energy', value: '45', unit: 'pmol/L',
    labLeft: 37.5, labWidth: 62.5, oursLeft: 25, oursWidth: 45, you: 45,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // THE ONE NEW ROW ON THIS PAGE, and its bands coincide.
    // thresholds.md hs-CRP: <=1 normal, >1-3 elevated, >3-10 moderate, >10 -> GP
    // (AHA/CDC 2003 consensus banding, Ewa 2026-06-16 ruling 6 "no change").
    // Vitall reference is <1.00 mg/L, matching our cut at 1 exactly (line 63 of
    // thresholds.md records the match). Scale 0-10, chosen as the full
    // actionable range up to the GP cut.
    //   lab       0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   ours      0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   marker  0.8 ->  8.0%
    // No split is POSSIBLE here at a lab-normal value: the lab's cut and ours
    // are the same number, so agreement is the only truthful drawing.
    // `normal-crp` badges In range.
    name: 'hs-CRP', qualifier: 'inflammation', value: '0.8', unit: 'mg/L',
    labLeft: 0, labWidth: 10, oursLeft: 0, oursWidth: 10, you: 8,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // CARRIED FROM `/`. thresholds.md: <30 -> GP, 30-100 borderline /
    // indeterminate (Ewa ruling 5, 2026-06-16), 100-300 normal, >300 -> GP.
    // Vitall male range 30-442 ug/L. Scale 0-450.
    //   lab      30 ->  6.7%, 442 -> 98.2%, width 91.5%
    //   ours     30 ->  6.7%, 100 -> 22.2%, width 15.5%
    //   marker   62 -> 13.8%
    // SPLIT. `suboptimal-ferritin` badges Monitor.
    name: 'Ferritin', qualifier: 'iron stores', value: '62', unit: 'µg/L',
    labLeft: 6.7, labWidth: 91.5, oursLeft: 6.7, oursWidth: 15.5, you: 13.8,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
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

      {/* ---------------- HERO ----------------
          THE GROUND, ported 2026-09-03. The SAME `HeroField` as `/`, `/kits` and
          the other two kit pages. `.f-ruleground` sits OUTSIDE `.f-wrap` because
          constraining a full-bleed ground to the 1180px measure draws a box with
          two hard edges, and the hero is a `<section>` because the stylesheet
          lifts `.f-ruleground > section` alone: `.f-field` sets its own
          `position: absolute` / `z-index: 1` and a blanket child rule would drop
          the canvas into flow. Mask, opacity and the per-row fade near the
          headline all come from `.f-field`, so nothing is added here for
          contrast. ⚠ CA-045 q6/q7 are open against this layer; register row 18.

          `f-sec-hero` REPLACES the inline `paddingTop: 62`, which is a fix this
          page never got. Kit 1 moved its hero padding onto the class on
          2026-08-31 because at 390 the consent banner covered 78% of the order
          button; `--f-hero-pt` is given back while the banner is up and an
          inline style cannot be overridden by the class. This page and Kit 3
          kept the inline literal and therefore kept the defect. */}
      <div className="f-ruleground">
        <HeroField />
      <section
        className="f-wrap f-sec-hero"
        style={{ ['--f-hero-pt' as string]: '62px', ['--f-hero-pt-lg' as string]: '62px', paddingBottom: 44 }}
      >
        {/* `.f-herogrid`, not the raw Tailwind grid it replaced: same 1.35fr/1fr
            pair, but Tailwind's `lg` turns at 1024px and this one turns at 980.
            ⚠ CORRECTED 2026-09-04. This comment used to say "every other boundary
            in this system turns at 900px", which is the section rhythm's number
            and not this primitive's. `.f-herogrid` turns at 980 on purpose, so
            the readout column keeps ~417px rather than ~383px; the reason is now
            recorded on the rule itself. The justification was wrong in three
            files while the code was right in one, which is the cheaper direction
            for that mistake to run but still a claim nobody had checked. */}
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
              <div className="f-eyebrow mb-5">Kit 2 // {KIT_NAMES['energy-recovery']}</div>

            <h1 className="f-h1 mb-5">Sore for three days after a workout that used to take one.</h1>

            <p className="f-stand mb-7">
              An at-home blood test for tiredness and fatigue. Find out which deficiency is slowing you down: four biomarkers, one finger prick. Results in 2 to 5 working days, in plain English, with a specific recommendation based on your numbers.
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
            <p className="f-price" style={{ marginBottom: 18 }}>&pound;{PRICING.KIT_2.rrp}</p>

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
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="flex items-center justify-between gap-3.5 pb-3.5 mb-1.5" style={{ borderBottom: '1px solid var(--hair-2)' }}>
                <h2 className="f-h4" style={{ fontSize: 18 }}>Your results</h2>
                {/* "Nothing here is a diagnosis" is carried from `/`, where it sits
                    in `.f-ro-h` beside this same device. This panel drew bands and
                    verdicts without it. Existing approved copy, new placement. */}
                <span className="f-kchip">Nothing here is a diagnosis</span>
              </div>

              {/* The key. Carried verbatim from `/`, and it is not optional: without
                  it the chart asks the reader to infer which grey is the lab and
                  which is ours, four rows running. Padding is zeroed because
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
                    <div
                      className="f-track"
                      role="img"
                      aria-label={`${m.name} ${m.value} ${m.unit}. Laboratory reference range: ${m.lab}. Andro Prime action band: ${m.ours}.`}
                    >
                      <div className="f-band f-band-lab" style={{ left: `${m.labLeft}%`, width: `${m.labWidth}%` }} />
                      <div className="f-band f-band-ours" style={{ left: `${m.oursLeft}%`, width: `${m.oursWidth}%` }} />
                      <div className="f-you" style={{ left: `${m.you}%` }} />
                    </div>
                    <div className="f-verd">
                      <span className="f-v-lab">{m.lab}</span>
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
        </div>
      </section>
      </div>{/* /.f-ruleground */}

      {/* ---------------- THE REALITY ---------------- */}
      <div className="f-wrap f-sec">
        <SectionRule n={1} of={4} />
        <p className="f-blab">The reality</p>
        <h2 className="f-h2">
          You&rsquo;re doing everything right.<br />
          <span className="f-grey">Something&rsquo;s still off.</span>
        </h2>
      </div>
      <div className="f-wrap">
        {/* 🔴 THE PROSE LEFT ITS TRAY, 2026-09-03, which is the same move Kit 1
            made on 2026-09-02 and the reason its reality section reads as a
            document while this one read as an interface. Containment rule: a
            card holds a transaction or an instrument, and an argument is
            neither. The symptom grid below KEEPS its tray, for the reason Kit 1
            records: a structured set the reader scans is not an argument.

            The photograph is `img-7`, THE SAME ASSET this kit already uses on
            the homepage kit card and on /kits, matched by slug. No new image and
            nothing added to the CA-045 register, and the three surfaces selling
            Kit 2 now show the same face. Alt text and caption are carried
            verbatim from /kits rather than rewritten, because that copy was
            checked against the actual photograph. Focal point anchors to the top:
            the man is composed high in frame (head running 9% to 32%) and a
            centred 4:3 crop takes his head off. */}
        <div className="f-bento">
          <div className="f-c-7 f-rise">
            <div className="f-plain">
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
          </div>
          <div className="f-c-5 f-rise">
            <div className="f-plate">
              <div
                className="f-shot f-shot-r43"
                style={{ '--focal': '50% 0%' } as React.CSSProperties}
              >
                <Image
                  src="/home/img-7.jpg"
                  alt="A man in his early forties sitting on the bottom stair of a hallway after a run, still in running kit, catching his breath."
                  width={800}
                  height={600}
                  sizes={SIZES_BENTO_5}
                />
              </div>
              <span className="f-shot-cap">Not bouncing back</span>
            </div>
          </div>
        </div>
      </div>

      <div className="f-wrap" style={{ paddingTop: 26 }}>
        <div className="f-tray f-rise">
          <div className="f-core">
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

      {/* ---------------- THE DATA ---------------- */}
      <div className="f-wrap f-sec">
        <SectionRule n={2} of={4} />
        <p className="f-blab">The data</p>
        <h2 className="f-h2">A blood test for tiredness.<br /><span className="f-grey">Four markers, four answers.</span></h2>
      </div>
      {/* The panel strip, the same instrument /kits leads with, scoped to this kit
          and ported from Kit 1. It says "these four of the nine we run" in the
          shape a reader has already met one click earlier. No value, no range, no
          needle: nobody has taken the test, so there is nothing to read, and this
          draws COVERAGE only. Derived from KIT_PANELS, so it cannot desync from
          /kits or from the engine. */}
      <div className="f-wrap" style={{ paddingBottom: 22 }}>
        <div className="f-pstrip" aria-hidden="true" style={{ maxWidth: 420, marginTop: 0 }}>
          {ALL_PANEL_MARKER_IDS.map((id) => (
            <span
              key={id}
              className={KIT_PANELS['energy-recovery'].includes(id) ? 'f-ps f-on' : 'f-ps'}
            />
          ))}
        </div>
        <p className="f-blab f-pscount">
          {panelCount('energy-recovery')} of {ALL_PANEL_MARKER_IDS.length} markers &middot;{' '}
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
      <div className="f-wrap f-sec">
        <SectionRule n={3} of={4} />
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
              <span className="f-no">{n}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{t}</h3>
              <p className="f-sub" style={{ fontSize: 14.5 }}>{b}</p>
              <div className="f-step-foot"><span>{metaK}</span><b>{metaV}</b></div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFORMITY LINE: D+ Kit 2 (CA-026), rendered VERBATIM. There is one of these
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
          <p className="f-blab f-blab-lg f-invert-lab">Some results need a doctor</p>
          {/* ⚠ THE SPLIT IS ONE SENTENCE LATER THAN KIT 1'S, AND A SCREENSHOT IS
              WHY. Splitting after sentence 1 put "Some results need a doctor" in
              the mono label AND "Some results need a doctor." in the 48px
              heading, one above the other: this page's approved label happens to
              BE its first sentence, which no measurement catches and which reads
              as a duplication bug. Order is still preserved and no word changed;
              only the boundary moved. It also lands "earns us nothing" in the
              heading, which is the sentence doing the work. */}
          <h2 className="f-h2 f-invert-h">Low ferritin, for example, goes to a GP and earns us nothing.</h2>
          <p className="f-sub f-invert-p">
            The rest get a plain-English reading, and what we offer alongside it is the same whether your numbers are flagged or fine.
          </p>
        </div>
      </div>

      {/* ---------------- FAQ ----------------
          Open grid, standardised across all three kit pages (Keith, 2026-08-29). */}
      <div className="f-wrap f-sec">
        <SectionRule n={4} of={4} />
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
          {/* `variant="f"` since 2026-09-06. See the note on the same call in
              `/kits/testosterone`: the component renders in its host's world now
              and the host declares which world that is. */}
          <RelatedArticles
            variant="f"
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
