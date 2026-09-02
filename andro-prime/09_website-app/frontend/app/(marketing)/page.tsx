import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { PRICING } from '@/lib/pricing'

/*
 * REBUILT IN DIRECTION F, 2026-08-31.
 * Frame: design/mockups/directions/F-field.html, THE DIRECTION ITSELF
 * (commit 8c8066f, "six homepage directions, and Keith picked F", 2026-08-27).
 *
 * This page is different in kind from the other five F pages. Those were ported
 * from the per-page journey frames, which were derived from this file and have
 * since been shown to have drifted from it twice. This one is ported from the
 * approved direction directly, so it is the only F page with no intermediary.
 *
 * WHY THE COPY IS THE FRAME'S AND NOT THE LIVE PAGE'S, which inverts the rule
 * used on the kit pages. On those, the live copy won because the frames were
 * proposing new wording nobody had approved. Here the opposite holds:
 *   - the live homepage is built to funnel model v1, and
 *     `07_sales/funnel/site-funnel-model.md` v2 names it a LAG in its own text,
 *     saying the lag closes when the page is rebuilt;
 *   - this direction was approved 2026-08-27, after the monitoring thesis, and
 *     its headings ARE the thesis: "You don't know which question you're asking
 *     yet", "We give the thinking away", "We do not sell you the answer".
 * So the direction is both the newer artefact and the approved one.
 *
 * 🔴 CA-045 IS THE MERGE BLOCKER ON THIS PAGE. The five photographs below are
 * generated imagery and the register row covers them explicitly, together with
 * the hero film. Its status is OPEN and its own words are that the gate "arms
 * when a direction is built into the site". This commit is that moment. It sits
 * on `redesign/direction-f`, which deploys nothing, so building it is safe and
 * MERGING IT IS NOT. Signers are Ewa and Keith; it fails the Keith-only entry
 * test at Q2 because a homepage hero is customer-facing.
 *
 * ⚠ And a discrepancy worth carrying: the register's evidence line ("no people,
 * hands, clinic, blood or sample") was established on the hero FILM frame. It
 * does not describe these five. `img-3` is captioned in its own alt text as "a
 * man's hands at a kitchen table holding a small plain sample collection tube",
 * which is people, hands and a sample. Those judgement questions are open for
 * these assets, not evidenced.
 *
 * NOT PORTED, deliberately:
 *   - The hero film and its canvas data-field. The film is the other half of
 *     CA-045 and the field animates real threshold percentages, so both want
 *     their own pass. The hero is built to hold them: the type, spacing and
 *     CTAs are the frame's, and the background is currently the plain ground.
 *   - Geist. The typeface ruling (Keith, 2026-08-30) supersedes the direction
 *     on faces only: serif display over humanist sans. Spacing, scale and
 *     rhythm are the direction's.
 */

/*
 * 🔴 COMPLIANCE PRE-FLIGHT: 2 HARD, and BOTH ARE VERBATIM FROM THE APPROVED
 * DIRECTION. Neither was introduced by this rebuild. Both read as false
 * positives on inspection, and NEITHER IS SELF-CLEARED HERE: a signed exception
 * needs a real CA number and this has none, so they go to the judgement pass.
 *
 *   1. "Nothing here is a diagnosis" (the readout header) trips «diagnosis».
 *      It is a disclaimer, and the scanner passes the same word four lines
 *      later in "That is not a diagnosis". Its negation detector matches
 *      "is not a X" and does not match a leading "Nothing here is a X", so the
 *      two identical intents get opposite verdicts.
 *   2. "the NICE guideline our GP follows TREATS 25 to 70 as an indeterminate
 *      zone" trips «treats» as a medicinal claim. It is the "regards as" sense
 *      about a numeric band, not a treatment claim. The scanner's own message
 *      says to verify benign use, so it is asking rather than asserting.
 *
 * Worth recording, because it is the more interesting fact: these two phrases
 * are in `directions/F-field.html`, which was approved on 2026-08-27. CA-045
 * covers that file's IMAGERY and explicitly records the scanner as N/A there
 * because the asset has no words. So the direction's COPY reaching a page is
 * this scan, here, for the first time.
 */
const BASE_URL = 'https://andro-prime.com'

/*
 * The sample readout. THIS IS THE PAGE'S ONE PIECE OF CLINICAL CONTENT and
 * every band position is arithmetic from `04_products/results-engine/
 * thresholds.md`, carried across from the direction with its working intact.
 *
 * `labLeft/labWidth` is the LABORATORY reference band (Vitall's own range).
 * `oursLeft/oursWidth` is OUR action band, which the results engine applies and
 * a GMC-registered GP approved. `you` is the sample value's position.
 *
 * Do not adjust a number here without re-deriving its percentage. A value moved
 * without its arithmetic is a homepage that contradicts the results engine.
 */
const READOUT = [
  {
    // thresholds.md, Kit 1, Total Testosterone: our bands low <12, normal 12-20,
    // optimal >20-29, high >29 -> GP. Vitall male reference 8.64-29.00 nmol/L
    // (confirmed 2026-08-06). Track scale 0-35 nmol/L.
    //   lab    8.64 -> 24.7%,  29.00 -> 82.9%,  width 58.2%
    //   ours     12 -> 34.3%,     20 -> 57.1%,  width 22.8%
    //   marker 14.2 -> 40.6%
    // SPLIT THREE, and it was not marked as one until 2026-08-31. 14.2 sits
    // inside the lab's 8.64-29.00 so a standard report says normal and stops;
    // it also sits in OUR 12-20 band, which is the state `normal-testosterone`,
    // and that state badges Monitor. Lab normal and Monitor is a disagreement,
    // so the row is a split by the same test the other two pass.
    name: 'Testosterone', qualifier: 'total', value: '14.2', unit: 'nmol/L',
    labLeft: 24.7, labWidth: 58.2, oursLeft: 34.3, oursWidth: 22.8, you: 40.6,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // thresholds.md: <25 -> GP, <50 low, 50-250 normal, >250 -> GP (Ewa
    // 2026-08-07). Vitall male range 50-250 nmol/L. Track scale 0-250 nmol/L.
    //   lab      50 -> 20.0%, 250 -> 100%, width 80.0%
    //   ours     50 -> 20.0%, 250 -> 100%, width 80.0%
    //   marker   58 -> 23.2%
    // The two ranges COINCIDE here, both 50 to 250, which is why the ours band
    // is inset 2px vertically: at equal height it covered the lab band exactly
    // and the row rendered as one band. `normal-vitamin-d` badges In range.
    name: 'Vitamin D', qualifier: '25-OH', value: '58', unit: 'nmol/L',
    labLeft: 20, labWidth: 80, oursLeft: 20, oursWidth: 80, you: 23.2,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // thresholds.md: NICE NG239 three-band, <25 low, 25-70 borderline, >70
    // normal. Ewa re-ratified 2026-08-07 with the assay cut visible. Vitall
    // assay cut is >37.5 pmol/L. Track scale 0-100 pmol/L.
    //   lab    37.5 -> 37.5%, 100 -> 100%, width 62.5%
    //   ours     25 -> 25.0%,  70 ->  70%, width 45.0%
    //   marker   45 -> 45.0%
    // SPLIT ONE: the assay calls 45 normal, NG239 calls it indeterminate.
    // Same number, two verdicts. This row is the whole argument of the page.
    // `borderline-b12` badges Monitor.
    name: 'Active B12', qualifier: 'holo-TC', value: '45', unit: 'pmol/L',
    labLeft: 37.5, labWidth: 62.5, oursLeft: 25, oursWidth: 45, you: 45,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // thresholds.md: <30 -> GP, 30-100 borderline / indeterminate (Ewa ruling 5,
    // 2026-06-16), 100-300 normal, >300 -> GP. Vitall male range 30-442 ug/L.
    // Track scale 0-450 ug/L.
    //   lab      30 ->  6.7%, 442 -> 98.2%, width 91.5%
    //   ours     30 ->  6.7%, 100 -> 22.2%, width 15.5%
    //   marker   62 -> 13.8%
    // SPLIT TWO. `suboptimal-ferritin` badges Monitor.
    name: 'Ferritin', qualifier: null, value: '62', unit: 'µg/L',
    labLeft: 6.7, labWidth: 91.5, oursLeft: 6.7, oursWidth: 15.5, you: 13.8,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
]

const RECORD_STEPS = [
  { t: 'Your first result', b: 'One point on a scale, both ranges shown, in plain English. Yours to keep whether you buy anything else or not.' },
  { t: 'The same test, later', b: 'Same lab, same assay, same units. That is what makes two numbers comparable, and why we cannot use your old NHS bloods.' },
  { t: 'A direction', b: 'Two points make a line. The line is the thing nobody currently has, and the reason to keep your numbers in one place.' },
]

// Prices read from lib/pricing.ts. Marker strings are the direction's own
// summary wording, which is looser than lib/kits/panel.ts on purpose: these are
// one-line teasers on a homepage card, and the kit pages carry the exact panel.
/*
 * All three cards now carry a photograph. Before 2026-09-01 only the lead card
 * did, and `.f-kit ul { flex: 1 }` absorbed the difference, so Kit 1 and Kit 2
 * rendered with 309px and 335px of empty space between the marker lines and the
 * price. They did not read as spacious, they read as unfinished, because they
 * were visibly the lead card MINUS a photograph, and the layout was spending
 * 300px announcing the absence. That put the two cheaper products at a
 * disadvantage created by layout rather than by argument, at the exact moment
 * the visitor chooses.
 *
 * `who` is one line, not a spec block. It answers the question the page's own
 * thesis says the visitor cannot answer yet ("You don't know which question
 * you're asking yet"), and it makes Kit 3 the honest default rather than the
 * expensive one. Deliberately short: the fix for an unfinished card is not a
 * wall of text (Keith, 2026-09-01).
 *
 * 🔴 COPY IS FRAME-CONSTRAINED, not invented. icp-kit-supplement-alignment
 * §9 fixes these: Kit 1 is "where your testosterone stands" and NEVER "find out
 * why you're tired", which is the documented failure mode; Kit 2 must not claim
 * anything about testosterone; Kit 3 is the nine-marker panel. None of the three
 * lines makes a symptom or outcome claim.
 *
 * 🔴 img-6 and img-7 are NEW generated assets (gpt_image_2, 2026-09-01) and are
 * NOT yet in CA-045. Generating them on this branch is fine because the branch
 * deploys nothing; SHIPPING them is what the gate covers. They must be added to
 * the CA-045 register and signed by Ewa and Keith before this merges. Both were
 * briefed to contain no clinic, no blood and no sample, which is deliberate:
 * the register's evidence line already overstates the existing five, so these
 * two were made easier to clear rather than harder.
 */
const KITS = [
  {
    slug: 'hormone-recovery', title: 'Hormone & Recovery', meta: `Kit 3 · nine markers`,
    price: `£${PRICING.KIT_3.rrp}`, lead: true,
    who: 'If you do not know which question it is.',
    photo: '/home/img-3.jpg', cap: 'Five minutes, at home',
    alt: "A man's hands at a kitchen table holding a small plain sample collection tube.",
    lines: ['Testosterone, free T, SHBG, albumin, FAI', 'Vitamin D, active B12, ferritin, hs-CRP'],
  },
  {
    slug: 'testosterone', title: 'Testosterone', meta: `Kit 1 · five markers`,
    price: `£${PRICING.KIT_1.rrp}`, lead: false,
    who: 'If the question is testosterone.',
    photo: '/home/img-6.jpg', cap: 'Ordinary Tuesday',
    alt: 'A man in his late forties standing in a back doorway at dawn with a mug of tea, looking out over a terraced garden.',
    lines: ['Total & free testosterone', 'SHBG, albumin, free androgen index'],
  },
  {
    slug: 'energy-recovery', title: 'Energy & Recovery', meta: `Kit 2 · four markers`,
    price: `£${PRICING.KIT_2.rrp}`, lead: false,
    who: 'If the question is energy and recovery.',
    photo: '/home/img-7.jpg', cap: 'Not bouncing back',
    alt: 'A man in his early forties sitting on the bottom stair of a hallway after a run, still in running kit, catching his breath.',
    lines: ['Vitamin D, active B12', 'Ferritin, hs-CRP'],
  },
]

// Carried unchanged from the previous homepage. The HowTo graph still describes
// the process accurately, so the rebuild has no reason to touch it.
const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to take an Andro Prime at-home blood test',
  description: 'Order your kit, collect a finger-prick sample at home, post it back, and receive your results in your dashboard within 2 to 5 working days.',
  totalTime: 'PT5M',
  supply: [
    { '@type': 'HowToSupply', name: 'Blood test kit' },
    { '@type': 'HowToSupply', name: 'Lancets (included)' },
    { '@type': 'HowToSupply', name: 'Medical transport vial (included)' },
    { '@type': 'HowToSupply', name: 'Pre-paid return envelope (included)' },
  ],
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Order your kit', text: 'Select the specific panel you need. Dispatched same-day via tracked delivery in discreet packaging.', url: `${BASE_URL}/kits` },
    { '@type': 'HowToStep', position: 2, name: 'Collect your sample', text: 'Simple, painless finger-prick collection at home. Takes five minutes. Best performed fasted, first thing in the morning, for accurate hormone baselines.' },
    { '@type': 'HowToStep', position: 3, name: 'Post it back', text: 'Seal your sample in the medical transport vial and drop it in any Royal Mail priority postbox using the pre-paid return envelope.' },
    { '@type': 'HowToStep', position: 4, name: 'View your results', text: 'Access your secure dashboard within 2 to 5 working days of lab receipt. Clear data, plain-English explanations, and recommendation logic approved by a GMC-registered GP.', url: `${BASE_URL}/kits` },
  ],
}

export const metadata: Metadata = {
  // Bare title: the root layout template appends " | Andro Prime" once.
  // (Setting the brand here too produced a double-branded <title>.)
  title: 'Premium At-Home Blood Tests for Men',
  description: "Men's blood tests, results in days. A five-minute sample at home, analysed by a UKAS ISO 15189-accredited lab and explained in plain English. One price, nothing hidden. Any result that needs a doctor goes to a GP.",
  alternates: { canonical: 'https://andro-prime.com' },
  openGraph: {
    title: 'Premium At-Home Blood Tests for Men | Andro Prime',
    description: 'Results in days from a five-minute at-home sample, analysed by a UKAS ISO 15189-accredited lab and explained in plain English. One price, nothing hidden. Any result that needs a doctor goes to a GP.',
    url: 'https://andro-prime.com',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime at-home blood tests for men' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium At-Home Blood Tests for Men | Andro Prime',
    description: 'Results in days. UKAS ISO 15189-accredited lab, plain English. One price, nothing hidden. Any result that needs a doctor goes to a GP.',
    images: ['/og/default.png'],
  },
}

// The mockups set the arrow as the typographic glyph in the button's own face,
// not as a drawn path. Keeping it as text means it inherits the type ruling.
const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

export default function HomePage() {
  return (
    <div className="f-page">
      <JsonLd data={homeSchema} />

      {/* ---------------- HERO ----------------
          Layer 1 of the direction's three is ported: the film. It is a texture,
          not a picture, and not a dark hero: greyscaled under a white wash so
          the headline stays dark ink on light.

          Still NOT ported, layers 2 and 3: the drifting measurement rule and the
          canvas data-field. The field animates real percentages from
          thresholds.md at three depths, which is a data surface rather than a
          decoration and wants its own pass with the numbers checked.

          🔴 The film is inside CA-045 with the five photographs, and it is the
          asset carrying that gate's one OPEN question: does an illegible letter
          on a kitchen table read as a lab result? Claim-adjacent, so it routes
          to Ewa. The sheet in this clip is unreadable by design. */}
      <div className="f-hero-film">
        <div className="f-film" aria-hidden="true">
          {/* muted + playsinline are what make autoplay legal on iOS and Chrome.
              preload="metadata" keeps the 726KB off the critical path; the poster
              paints immediately and the loop takes over when it is ready.
              The ?v= is a cache buster and not decoration: the direction had this
              file replaced in place twice and browsers kept serving the old bytes
              through a reload. Bump it whenever the asset changes. */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/home/poster.jpg?v=1"
            tabIndex={-1}
          >
            {/* THE GATE IS HERE, NOT IN CSS. An unmatched `media` means the
                browser picks no source, fetches nothing, and paints the poster.
                Hiding the element in CSS instead still downloads and decodes it.
                Two conditions: honour a reduced-motion preference, and do not
                spend 726KB on a phone where the wash covers most of the frame
                anyway. */}
            <source
              src="/home/table.mp4?v=1"
              type="video/mp4"
              media="(min-width: 641px) and (prefers-reduced-motion: no-preference)"
            />
          </video>
        </div>
      <div className="f-wrap f-hero-in" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <h1 className="f-h1" style={{ maxWidth: '15ch' }}>
          Your bloods came back normal.<br />
          <span className="f-grey">That&rsquo;s not an answer.</span>
        </h1>

        {/* Direction brief section 7: hero subtext, 20 words maximum. This is exactly 20. */}
        <p className="f-stand mt-6" style={{ maxWidth: '40ch' }}>
          You do not know yet whether it is thyroid, iron, vitamin D or testosterone. So we test all of them.
        </p>

        <div className="f-btns mt-8">
          <Link href="/test-selector" className="f-btn">Find your test in 60 seconds {ARROW}</Link>
          <Link href="#free" className="f-btn f-btn-ghost">See the app first {ARROW}</Link>
        </div>

        <p className="f-fine mt-9">Scroll for a sample result</p>
      </div>
      </div>

      {/* ---------------- THE READOUT ----------------
          The concrete mechanic of the monitoring thesis: two ranges on one
          screen. This is the only place on the site where the laboratory band
          and our action band are drawn together. */}
      <div className="f-wrap f-sec" id="readout" style={{ paddingBottom: 0 }} />
      <div className="f-wrap">
        <div className="f-bento">
          <div className="f-c-8 f-rise">
            <div className="f-tray">
              <div className="f-core" style={{ padding: 0 }}>
                <div className="f-ro-h">
                  <span>Sample result &middot; Kit 3 &middot; nine markers</span>
                  <span>Nothing here is a diagnosis</span>
                </div>

                {/* The key. The two bands were unlabelled until 2026-08-31, so
                    the chart asked the reader to infer which grey was the lab
                    and which was ours, four rows running, from a paragraph in
                    the next column that stacks BELOW the chart on mobile. */}
                <div className="f-ro-k">
                  <span><i className="f-k-lab" aria-hidden="true" />Lab reference range</span>
                  <span><i className="f-k-ours" aria-hidden="true" />Our action band</span>
                  <span><i className="f-k-you" aria-hidden="true" />Your value</span>
                </div>

                <div className="f-ro-b">
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

              </div>
            </div>
          </div>

          {/* ---------------- THE INTERPRETATION COLUMN ----------------
              🔴 2026-09-02: this card was 747px tall carrying 244px of content at
              1440, i.e. 67% empty with the void in ONE 423px block — worse than
              any of the four cards the 2026-08-31 critique measured. Keith raised
              it and asked to keep the page’s balance.

              NOT A PORT OMISSION, unlike the last several of these.
              `F-field.html:657` writes the same `height:100%` +
              `justify-content:space-between` on the same short content beside the
              same tall instrument, and draws NINE marker rows to this build’s
              four, so the void is larger in the direction than in the build. The
              defect is in the approved design and the port was faithful.

              TWO CHANGES, AND THE SECOND IS THE ONE THAT MATTERS.

              1. The `.f-ro-f` sentence moved here from the instrument card. It is
                 interpretation ("Three of these sit where a standard report would
                 say normal and stop"), not instrument, so it belongs in the
                 interpretation column; the instrument is now only the instrument.
                 No new copy, byte-identical, and it still follows the rows on
                 mobile because this column stacks after them.

              2. The card no longer stretches. `height: 100%` and
                 `space-between` are gone, so it ends where its content ends.
                 **Empty space INSIDE a bordered card reads as unfinished; the
                 same pixels in the grid beside a card read as layout.** The void
                 was never too much space, it was space wearing a container. The
                 8/4 asymmetry is untouched, which is what keeps the balance.

              ⚠ The KEY STAYS IN THE INSTRUMENT and must not be moved here to
              fill space. It was put there on 2026-08-31 precisely because this
              column stacks BELOW the chart on mobile, so keying the chart from
              here asks a phone reader to infer which grey is which for four rows
              running. That is the defect this card would recreate. */}
          <div className="f-c-4 f-rise">
            <div className="f-tray">
              <div className="f-core f-cell">
                <div>
                  <h2 className="f-h4" style={{ fontSize: 26, maxWidth: '14ch', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    Two ranges. Nine markers. You should see both.
                  </h2>
                  <p className="f-sub mt-3.5">
                    Active B12 is the plainest case. The assay calls anything above 37.5 normal, while the NICE guideline our GP follows treats 25 to 70 as an indeterminate zone. Same number, two verdicts.
                  </p>
                  <p className="f-ro-note">
                    Three of these sit where a standard report would say normal and stop. On the action bands our GP approved, they read <b>monitor</b>. That is not a diagnosis. It is the context a bare number does not carry.
                  </p>
                </div>
                <p className="f-blab mt-6" style={{ marginBottom: 0 }}>Bands: results engine, GP approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE ARGUMENT ---------------- */}
      <div className="f-wrap f-sec" style={{ paddingBottom: 0 }} />
      <div className="f-wrap">
        <div className="f-bento">
          <div className="f-c-7 f-rise">
            <div className="f-tray" style={{ height: '100%' }}>
              <div className="f-core" style={{ height: '100%' }}>
                <h2 className="f-h2">&ldquo;In range&rdquo; is a statistical band, not a health band.</h2>
                <p className="f-lede">
                  A reference range describes where most men sit. It exists to identify clinical deficiency: the threshold at which you are officially recognised as ill. That is a useful line, and it is not the same line as being well.
                </p>
              </div>
            </div>
          </div>
          <div className="f-c-5 f-rise">
            <div className="f-tray" style={{ height: '100%' }}>
              <div className="f-core f-cell" style={{ height: '100%', padding: 0 }}>
                <div className="f-shot f-shot-r43">
                  <Image src="/home/img-4.jpg" alt="A man in his early fifties at an office desk late in the afternoon, looking away from his monitor towards a window." width={800} height={600} />
                  <span className="f-shot-cap">Thursday, 4pm</span>
                </div>
                <div style={{ flex: 1, padding: '24px 20px' }}>
                  <p className="f-sub">Most men arrive here after a set of bloods came back with nothing flagged, and nothing explained.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE RECORD ---------------- */}
      <div className="f-wrap f-sec" style={{ paddingBottom: 0 }} />
      <div className="f-wrap">
        <div className="f-bento">
          <div className="f-c-5 f-rise">
            <div className="f-tray" style={{ height: '100%' }}>
              <div className="f-core f-cell" style={{ height: '100%', padding: 0 }}>
                <div className="f-shot f-shot-r43">
                  <Image src="/home/img-2.jpg" alt="A man in his fifties at a kitchen table in the evening, reading on a laptop." width={800} height={600} />
                  <span className="f-shot-cap">The same test, later</span>
                </div>
                <div style={{ flex: 1, padding: '24px 20px' }}>
                  <h2 className="f-h4" style={{ fontSize: 26, maxWidth: '15ch', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    A number is a fact. A record is an answer.
                  </h2>
                  <p className="f-sub mt-3">
                    One result tells you where you are today. It cannot tell you which direction you are going, and we are not going to pretend otherwise.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="f-c-7 f-rise">
            <div className="f-tray" style={{ height: '100%' }}>
              <div className="f-core" style={{ height: '100%' }}>
                {RECORD_STEPS.map(({ t, b }) => (
                  <div key={t} className="f-rstep">
                    <h3>{t}</h3>
                    <p>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- KITS ----------------
          The nine-marker panel leads, per the direction brief section 4: a
          reader who has not chosen a question yet is served by the panel that
          does not make him choose. */}
      <div className="f-wrap f-sec" id="kits">
        <h2 className="f-h2">You don&rsquo;t know which question you&rsquo;re asking yet.</h2>
        <p className="f-lede">
          That is the normal place to start, and it is why the full panel is the default. Finger-prick at home, five minutes, freepost back.
        </p>
      </div>
      <div className="f-wrap">
        <div className="f-bento">
          {KITS.map(({ slug, title, meta, price, lead, lines, who, photo, cap, alt }) => (
            <div key={slug} className={lead ? 'f-c-6 f-rise' : 'f-c-3 f-rise'}>
              <div className="f-tray" style={{ height: '100%' }}>
                <div className="f-core f-cell f-kit" style={{ height: '100%', padding: 0 }}>
                  <div className={lead ? 'f-shot f-shot-r16' : 'f-shot f-shot-r16 f-shot-tall'}>
                    <Image src={photo} alt={alt} width={800} height={500} />
                    <span className="f-shot-cap">{cap}</span>
                  </div>
                  <div className="f-cell" style={{ flex: 1, padding: '24px 20px' }}>
                    <h3>{title}</h3>
                    <p className="f-blab" style={{ marginTop: 4, marginBottom: 0 }}>{meta}</p>
                    <p className="f-kwho">{who}</p>
                    <ul>
                      {lines.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                    <div className="f-kprice">{price}</div>
                    <Link
                      href={`/kits/${slug}`}
                      className={lead ? 'f-btn mt-4 self-start' : 'f-btn f-btn-ghost mt-4 self-start'}
                    >
                      Start a baseline {ARROW}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- THE FREE LAYER ----------------
          "Give away the thinking. Sell the record."
          `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` §10.1.
          🔴 This section markets the app and the content. It does NOT sell the
          membership, and it must not: membership cannot be bought standalone
          and no acquisition surface may sell it
          (`01_strategy/2026-08-26-membership-offer-window.md`). */}
      <div className="f-wrap f-sec" id="free">
        <h2 className="f-h2">We give the thinking away.</h2>
        <p className="f-lede">
          You should not have to pay to find out whether we are worth paying. What you pay for is the record: your numbers, held over time.
        </p>
      </div>
      <div className="f-wrap">
        <div className="f-bento">
          <div className="f-c-6 f-rise">
            <div className="f-tray" style={{ height: '100%' }}>
              <div className="f-core f-cell" style={{ height: '100%', padding: 0 }}>
                <div className="f-shot f-shot-r16">
                  <Image src="/home/img-1.jpg" alt="A man in his mid forties reading on his phone at a kitchen counter early in the morning." width={800} height={500} />
                  <span className="f-shot-cap">No email, no gate</span>
                </div>
                <div className="f-cell" style={{ flex: 1, padding: '24px 20px' }}>
                  <h3>Read it first</h3>
                  <p>Articles on what your results actually mean, what a reference range is, and why &ldquo;within range&rdquo; and &ldquo;well&rdquo; are two different questions.</p>
                  <Link href="/blog/how-to-read-blood-test-results" className="f-btn f-btn-ghost f-btn-sm mt-4 self-start">
                    How to read your bloods {ARROW}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="f-c-6 f-rise">
            <div className="f-tray" style={{ height: '100%' }}>
              <div className="f-core f-cell" style={{ height: '100%', padding: 0 }}>
                <div className="f-shot f-shot-r16">
                  <Image src="/home/img-5.jpg" alt="A man in his early forties in an ordinary gym changing room, sitting on a bench putting on a trainer." width={800} height={500} />
                  <span className="f-shot-cap">A demo account</span>
                </div>
                <div className="f-cell" style={{ flex: 1, padding: '24px 20px' }}>
                  <h3>See the app</h3>
                  <p>A demo account loaded with a sample result. Look at exactly what you get before you spend anything. We never put your data in it.</p>
                  {/* 🔴 NO CTA, DELIBERATELY: THE DEMO ROUTE DOES NOT EXIST YET.
                      The demo is a decided part of the free layer (thesis §10.1,
                      ANSWERED 2026-08-24) and it is built only as an interactive
                      prototype at `design/prototypes/demo-account-interactive.html`.
                      There is no live route. The first draft of this page linked
                      to `/results-dashboard/demo`, which was invented and would
                      have shipped a dead link on the homepage.
                      This card is the free layer's second leg and it is inert
                      until that route exists. Building it is the thing that
                      completes "give away the thinking". */}
                  <p className="f-blab mt-4" style={{ marginBottom: 0 }}>Opening soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- THE CONFLICT-FREE RECEIPT ----------------
          The brand lead, stated rather than sold (Keith ruling A2, 2026-08-30:
          conflict-free stays the lead and the record is its proof).

          🔴 THE INVERTED PANEL IS A DELIBERATE DEPARTURE FROM THE DIRECTION,
          NOT A PORT. `F-field.html:813` draws this section as an ordinary
          tray/core, and the build was a faithful port of that. Keith ruled
          2026-09-02 that the receipt takes the inverted ink panel DESIGN.md
          reserves for a statement of this kind. Recorded so a future
          direction-vs-build comparison reads this as ruled rather than as
          drift, the same way the section-rhythm and heading-scale
          disagreements are recorded.

          DESIGN.md allows the panel ONCE PER PAGE and the homepage was
          spending its one on nothing, so the strongest claim on the page
          carried the same weight as the section above it. Check before adding
          another inverted block here: this is now the homepage’s one.

          ⚠ THE CONTAINER CHANGED AND NOT ONE WORD DID. Both sentences are
          byte-identical to the pre-flighted copy, which is the same rule the
          /kits C1 panel states about itself. The panel’s optional
          `.f-blab-lg` lead label is deliberately absent: adding one would be
          new customer-facing copy and needs a pre-flight, not a redraw. */}
      <div className="f-wrap f-sec" style={{ paddingBottom: 0 }} />
      <div className="f-wrap">
        <div className="f-invert f-rise">
          <h2 className="f-h2 f-invert-h">We do not sell you the answer.</h2>
          <p className="f-sub f-invert-p">
            Any result that needs a doctor goes to a GP, and earns us nothing. No result changes what we offer you or what it costs. We are not a route into a treatment we happen to sell, because we do not sell one.
          </p>
        </div>
      </div>

      {/* ---------------- CLOSE ---------------- */}
      <div className="f-wrap f-close">
        <h2>Find out what your blood is telling you.</h2>
        <p className="f-stand">UKAS ISO 15189 accredited lab. Results in 2 to 5 working days. Plain English.</p>
        <Link href="/test-selector" className="f-btn">Find your test in 60 seconds {ARROW}</Link>
      </div>
    </div>
  )
}
