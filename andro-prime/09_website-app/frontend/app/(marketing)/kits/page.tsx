import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeroField } from '@/components/marketing/HeroField'
import { SectionRule } from '@/components/marketing/SectionRule'
import { KIT_NAMES } from '@/lib/kits/names'
import {
  ALL_PANEL_MARKER_IDS,
  KIT_PANELS,
  PANEL_MARKERS,
  panelCount,
  panelShortLabels,
  type PanelMarkerId,
} from '@/lib/kits/panel'
// KitType is owned by lib/results/types, which is where panel.ts imports it from.
import type { KitType } from '@/lib/results/types'
import { JsonLd } from '@/components/shared/JsonLd'

/**
 * /kits, rebuilt in Direction F on 2026-08-30 from
 * design/mockups/journey/kits-F.html Frame O (approved 2026-08-29).
 *
 * COPY IS CARRIED VERBATIM FROM THE V2.0 PAGE. The 2026-08-28/29 approval covers
 * LAYOUTS, NOT COPY, so a redraw is not the place to rewrite live marketing copy.
 * Two known drifts are therefore carried as found and flagged where they sit:
 * "answer 3 questions" and "takes less than a minute" both describe a selector
 * that is now five steps. Frame O flags the same two. Fixing them is a copy
 * change with its own compliance pre-flight, not a side effect of a restyle.
 *
 * The kit cards and the comparison table are now DERIVED from lib/kits/panel.ts
 * rather than hand-written. That module is the single source of truth for which
 * markers sit on which panel, and hand-copying is exactly what produced the
 * marker-count defect that reached six surfaces on 2026-08-29.
 */

const BASE_URL = 'https://andro-prime.com'

const ORDER: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']

const PRICES: Record<KitType, string> = {
  'testosterone': '£99',
  'energy-recovery': '£119',
  'hormone-recovery': '£179',
}

/* NO LOCAL NAME MAP. `lib/kits/names.ts` calls itself the single source of
   truth for slug -> display name and had ONE consumer; this page carried its
   own copy, and a second one in the card titles below. The homepage carried a
   third that disagreed. Import, never restate. */

const NUMBER_LABEL: Record<KitType, string> = {
  'testosterone': 'Kit 1',
  'energy-recovery': 'Kit 2',
  'hormone-recovery': 'Kit 3',
}

type KitCard = {
  kit: KitType
  blurb: string
  rightFor: string
  footLabel: string
  footBody: string
  resultsTo: string
  /** The accent-ringed card. Frame O REPLACED an inverted Kit 3 with this and
      records why: inverting asked the page to change colour scheme mid-scroll,
      which is what stopped it working in dark mode. The value is the chip text. */
  flag?: string
  /** 🔴 THE SOLID BUTTON IS THE BUSINESS'S RECOMMENDATION, NOT A LAYOUT
      DEVICE. It read "Frame O gives Kit 2 a ghost button and Kits 1 and 3 a
      solid one, so the middle option is not competing with the two it sits
      between", which is a statement about visual balance, and it was deciding
      which product this company recommends. It also disagreed with the homepage,
      which gives the solid button to Kit 3 alone and argues in its own h2 why:
      "You don't know which question you're asking yet." Two pages, one click
      apart, recommending different kits, and only one of them for a commercial
      reason.

      Ruled by Keith 2026-09-03: KIT 3 IS THE DEFAULT, on both pages. Kits 1 and
      2 are ghost. The cards stay in price-ascending order here because this is a
      catalogue, but the weight does not follow the order. If you are tempted to
      even up the buttons for balance, that is the exact reasoning this replaced;
      Kit 3 already carries the accent ring and the "Most complete" chip, and the
      button is the third thing saying the same one thing. */
  ghostCta?: boolean
  /** The card photograph, added 2026-09-02.
   *
   * 🔴 THE SAME ASSET THE HOMEPAGE KIT CARD USES FOR THE SAME KIT, deliberately.
   * The two surfaces sell the same three products one click apart, and until now
   * the homepage rendered them as photographs and this page rendered them as
   * white boxes, which was the single largest reason the two pages did not read
   * as one site. Matching by slug also means this change adds NO new image to the
   * CA-045 register: `img-3`, `img-6` and `img-7` are already on it.
   *
   * ⚠ Alt text is carried verbatim from the homepage rather than rewritten. The
   * 2026-09-02 packet found `img-5`'s alt describing the opposite of its
   * photograph, so alt text here is copied from the surface that was checked
   * against the actual image, not re-derived from the filename. */
  photo: string
  cap: string
  alt: string
  /** The photograph's focal point, as an `object-position` pair.
   *
   * 🔴 REQUIRED, WITH NO DEFAULT, ON PURPOSE. A band crop discards 37% to 45% of
   * the source height, and `object-fit: cover` takes it off the top and bottom
   * equally unless told otherwise. Both men here are composed high in frame, so
   * the centred default cut their heads off. Leaving this optional would put the
   * next photograph one forgotten field away from the same defect, and it is a
   * defect nothing catches: no error, no warning, and the alt text still
   * truthfully describes a man whose head is no longer in the picture.
   *
   * Read it off the image, not off the filename: img-6's head runs 5% to 41% of
   * frame and img-7's 9% to 32%, so both anchor to the top; img-3 is an overhead
   * of two hands at 45% and sits just above centre. */
  focal: string
  /** The one-line "who it is for", shown on the light card.
   *
   * CARRIED FROM THE HOMEPAGE'S OWN KIT CARDS, verbatim and matched by slug, for
   * the same reason the photographs are: the two surfaces sell the same three
   * products one click apart and should say the same thing about them. Existing
   * live copy in a new placement, not new copy. Logged in
   * 09_website-app/redesign-copy-register.md. */
  who: string
}

const KITS: KitCard[] = [
  {
    kit: 'testosterone',
    blurb:
      'Your GP told you you’re normal. That’s not the same as good. This test shows exactly where your testosterone sits, including free testosterone and SHBG, which standard GP panels often skip. Results in 2 to 5 working days with a plain-English explanation of what they mean. If the main problem is tiredness, poor recovery or fogginess, Kit 2 is the better fit.',
    rightFor: 'Low drive, stalled training, “not myself” symptoms',
    photo: '/home/img-6.jpg',
    cap: 'Ordinary Tuesday',
    who: 'If the question is testosterone.',
    focal: '50% 0%',
    alt: 'A man in his late forties standing in a back doorway at dawn with a mug of tea, looking out over a terraced garden.',
    ghostCta: true,
    footLabel: 'If your result shows testosterone below 12 nmol/L',
    footBody: 'You will receive a specific next step, not a generic recommendation.',
    resultsTo:
      'Your Andro Prime dashboard. Not the lab portal. Plain English with a specific next step.',
  },
  {
    kit: 'energy-recovery',
    blurb:
      'Sore for 3 days after a session that used to take 1. Tired all the time. Joints aching. This test looks at the four markers most likely to explain why: Vitamin D, Active B12 (Holotranscobalamin), inflammation (hs-CRP), and iron stores (Ferritin). If the issue is hormones, Kit 1 or Kit 3 is the better fit.',
    rightFor: 'Fatigue, slow recovery, aching joints, low mood',
    photo: '/home/img-7.jpg',
    cap: 'Not bouncing back',
    who: 'If the question is energy and recovery.',
    focal: '50% 0%',
    alt: 'A man in his early forties sitting on the bottom stair of a hallway after a run, still in running kit, catching his breath.',
    ghostCta: true,
    footLabel: 'If a marker comes back deficient',
    footBody:
      'You get the specific marker, the number, and what the evidence supports doing about it.',
    resultsTo:
      'Your Andro Prime dashboard. Not the lab portal. Plain English with a specific next step.',
  },
  {
    kit: 'hormone-recovery',
    blurb:
      'Nine markers covering hormones, energy, recovery, and inflammation in one kit. The right choice when you are not sure whether the problem is testosterone, deficiency, or both. If there is ambiguity, start here.',
    rightFor: 'Full picture across hormones, energy, and recovery',
    photo: '/home/img-3.jpg',
    cap: 'Five minutes, at home',
    who: 'If you do not know which question it is.',
    focal: '50% 40%',
    alt: "A man's hands at a kitchen table holding a small plain sample collection tube.",
    footLabel: 'Widest set of recommendation pathways',
    footBody:
      'Kit 3 covers both testosterone and deficiency markers, with supplement recommendation routes for every deficiency pattern. Our own supplement range launches shortly; you can join the early-access waitlist at any time. Best choice when the picture is unclear.',
    resultsTo:
      'Your Andro Prime dashboard. Full breakdown across all nine markers with targeted recommendations.',
    flag: 'Most complete',
  },
]

const STEPS = [
  { n: '01', h: 'Order online', p: 'Choose your kit. Pay once. Kit dispatched the same working day.', metaK: 'Dispatch', metaV: 'Same day' },
  { n: '02', h: 'Collect at home', p: 'Five minutes. Finger-prick. Return with the pre-paid label in your kit.', metaK: 'Time required', metaV: '5 mins' },
  { n: '03', h: 'Lab processes it', p: 'UKAS ISO 15189 accredited lab. Results ready within 2 to 5 working days of receipt.', metaK: 'Lab', metaV: 'UKAS 15189' },
  { n: '04', h: 'Plain-English results', p: 'Your numbers in your dashboard. What they mean. What to do next. Specific to your data.', metaK: 'Turnaround', metaV: '2 to 5 days' },
]

const kitsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kits', item: `${BASE_URL}/kits` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Men’s Health Blood Test Kits',
      description:
        'Three diagnostic kits targeting testosterone, energy and recovery, or the full picture.',
      itemListElement: ORDER.map((kit, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${KIT_NAMES[kit]}: ${PRICES[kit]}`,
        url: `${BASE_URL}/kits/${kit}`,
      })),
    },
  ],
}

export const metadata: Metadata = {
  title: 'Men’s Health Blood Tests at Home (UK)',
  description:
    'At-home men’s health blood tests. Three kits: testosterone, energy and recovery, or the full picture. UKAS ISO 15189 lab. Results in 2 to 5 days.',
  alternates: { canonical: 'https://andro-prime.com/kits' },
  openGraph: {
    title: 'Men’s Health Blood Tests at Home (UK) | Andro Prime',
    description:
      'Men’s health blood tests you take at home. Three kits covering testosterone, energy and recovery, or the full picture. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
    url: 'https://andro-prime.com/kits',
    type: 'website',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Men’s health blood test kits from Andro Prime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Men’s Health Blood Tests at Home (UK) | Andro Prime',
    description:
      'Men’s health blood tests you take at home. Three kits covering testosterone, energy and recovery, or the full picture. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
  },
}

/** Marker row label, e.g. "Free Testosterone (Calc)". */
function markerLabel(id: PanelMarkerId): string {
  const m = PANEL_MARKERS[id]
  return m.gloss ? `${m.name} (${m.gloss})` : m.name
}

export default function KitsPage() {
  return (
    <div className="f-page">
      <JsonLd data={kitsSchema} />

      {/* ---------- HERO ---------- */}
      {/* The SAME field as `/`, not a texture that resembles it: horizontal gauge
          rows with the bands and the marker drifting across them, from the same
          component and the same geometry. It is the thing tying the two pages
          together, and it is full-bleed, so it sits in a wrapper OUTSIDE
          `.f-wrap`: constraining a ground to the 1180px measure draws a box with
          two hard edges. `.f-field` brings its own mask, its own 0.34 opacity and
          its own per-row fade near the headline band, so the type keeps contrast
          over it without anything added here. ⚠ CA-045 q6/q7 are open against
          this layer and now cover two surfaces; see `lib/home/fieldRows.ts` and
          register row 18. */}
      <div className="f-ruleground">
        <HeroField />
      <section className="f-wrap f-sec">
        <div className="f-herogrid f-rise">
          <div>
            <div className="f-eyebrow">Diagnostic kits</div>
            <h1 className="f-h1" style={{ marginTop: 18 }}>
              Stop guessing.<br />
              <span className="f-grey">Get the numbers.</span>
            </h1>
            <p className="f-stand" style={{ marginTop: 18 }}>
              Three men&rsquo;s health blood tests you take at home. Each one gives you specific
              results from a UKAS ISO 15189 accredited lab, delivered in plain English, with a clear next step
              based on what your data actually shows. No GP referral needed.
            </p>
            <div className="f-btns" style={{ marginTop: 24 }}>
              <Link className="f-btn" href="#kits">
                See the tests <span aria-hidden="true">&#8594;</span>
              </Link>
              <Link className="f-btn f-btn-ghost" href="/test-selector">
                Not sure which one?
              </Link>
            </div>
            <p className="f-trust">
              <span aria-hidden="true">&#10003;</span>
              UKAS ISO 15189 accredited lab. No GP needed. Results in 2 to 5 working days of sample
              receipt.
            </p>
          </div>

          {/*
            Available-now panel. The frame drops V2.0's pulsing status dot on the
            UKAS chip: it is a status affordance on a marketing page, and the
            motion budget on this frame is spent on the load reveal. The chip
            stays, because "available now" is the thing a reader is checking.
          */}
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="f-panelhead">
                <h2 className="f-h4">Available now</h2>
                <span className="f-kchip">UKAS lab</span>
              </div>

              {ORDER.map((kit) => (
                <div className="f-prow" key={kit}>
                  <div>
                    <h3 className="f-prow-t">{KIT_NAMES[kit]}</h3>
                    <p className="f-prow-m">
                      {kit === 'hormone-recovery'
                        ? `All ${panelCount(kit)} markers · Full picture`
                        : panelShortLabels(kit).join(' · ')}
                    </p>
                  </div>
                  <div className="f-prow-p">{PRICES[kit]}</div>
                </div>
              ))}

              <div className="f-panelfoot">
                {/*
                  Copy drift, carried as found: the selector is five steps now
                  (three questions, a four-question price study with an age band,
                  then the reveal and an email capture), not three questions.
                  Frame O flags the same sentence. Changing it is a copy edit with
                  its own pre-flight, not part of a restyle.
                */}
                <p className="f-sub" style={{ fontSize: 15 }}>
                  Not sure which kit fits your symptoms? Use the selector and answer 3 questions.
                </p>
                <Link
                  className="f-btn f-btn-ghost f-btn-sm"
                  href="/test-selector"
                  style={{ marginTop: 14 }}
                >
                  Go to test selector <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>{/* /.f-ruleground */}

      {/*
        ---------- MONEY BLOCK ----------
        C1 under CA-026, rendered VERBATIM. The redraw changes only the container.
        Not a word of this copy is editable without a compliance pre-flight.
      */}
      {/*
        ---------- SECTION 01: THE PANEL ----------
        Frame O2, 2026-09-02. This section ABSORBED the old comparison table and
        the cards' spec rows. Before it, the same nine markers were stated three
        times on this page in three treatments, which is what a page does when it
        has no single instrument to point at.

        🔴 THE H2 IS CARRIED VERBATIM AND MUST BE. "What each men's health blood
        test covers" contains `men's health blood test`, which
        06_marketing/seo-ai-search flags as an underserved opportunity at KD 9 and
        earmarks for kit-page intent. Merging the table upward MOVES this heading;
        it must never drop the phrase. That is a ranking decision, not a design one.

        Everything renders from KIT_PANELS and PANEL_MARKERS, so the instrument
        cannot desync from the kit pages or from the engine.
      */}
      <section className="f-wrap f-sec">
        <SectionRule n={1} of={4} />
        <p className="f-blab">The panel</p>
        <h2 className="f-h2">What each men&rsquo;s health blood test covers.</h2>
        <p className="f-lede">
          Nine markers. Three ways to buy a slice of them. Every kit reads on the same lab, in the
          same units, so a result from one is comparable with a result from another.
        </p>

        <div className="f-pan">
          <div className="f-panhead">
            <p className="f-blab" style={{ margin: 0 }}>Included in</p>
            <div className="f-pankits">
              {ORDER.map((kit) => (
                <div key={kit}>
                  <b className="f-blab" style={{ margin: 0 }}>{NUMBER_LABEL[kit]}</b>
                  <i>{PRICES[kit]}</i>
                </div>
              ))}
            </div>
          </div>

          {ALL_PANEL_MARKER_IDS.map((id, row) => (
            <div className="f-panrow" key={id}>
              <div className="f-pmark">
                <b>{markerLabel(id)}</b>
                <span>{PANEL_MARKERS[id].measures}</span>
              </div>
              <div className="f-ptrk">
                {ORDER.map((kit) => {
                  const has = KIT_PANELS[kit].includes(id)
                  // A band's cap is rounded only where the run starts or ends, so
                  // consecutive markers read as one continuous bar rather than as
                  // nine stacked pills.
                  const prev = row > 0 && KIT_PANELS[kit].includes(ALL_PANEL_MARKER_IDS[row - 1])
                  const next =
                    row < ALL_PANEL_MARKER_IDS.length - 1 &&
                    KIT_PANELS[kit].includes(ALL_PANEL_MARKER_IDS[row + 1])
                  const cls = [
                    'f-pc',
                    has ? 'f-on' : '',
                    has && !prev ? 'f-cap-t' : '',
                    has && !next ? 'f-cap-b' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <span key={kit} className={cls}>
                      <span className="sr-only">
                        {NUMBER_LABEL[kit]}: {has ? 'included' : 'not included'}
                      </span>
                    </span>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="f-panfoot">
            <p className="f-blab" style={{ margin: 0 }}>Total markers</p>
            <div className="f-pantot">
              {ORDER.map((kit) => (
                <span key={kit}>{panelCount(kit)}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 02: THE THREE KITS ----------
          The cards are light because section 01 did the explaining. Gone from
          each: the marker string (now the strip), the three spec wells, and the
          full blurb. What is left is what is unique to this kit. */}
      {/* `f-sec-cont`: this boundary is a continuation, not a topic change. The
          panel above measures the three products below it, so the full section
          gap announced a new subject about the same one. See `--f-sec-gap-cont`. */}
      <section className="f-wrap f-sec f-sec-cont" id="kits">
        <SectionRule n={2} of={4} />
        <p className="f-blab">The full range</p>
        <h2 className="f-h2">
          Three tests.<br />
          <span className="f-grey">Different questions.</span>
        </h2>
      </section>

      <section className="f-wrap">
        <div className="f-kgrid">
          {KITS.map((k) => (
            <div
              className={k.flag ? 'f-tray f-tray-pick f-tray-flag f-rise f-kcard' : 'f-tray f-tray-pick f-rise f-kcard'}
              key={k.kit}
            >
              <div className="f-core f-kit" style={{ padding: 0 }}>
                <div
                  className="f-shot f-shot-r16"
                  style={{ '--focal': k.focal } as React.CSSProperties}
                >
                  <Image src={k.photo} alt={k.alt} width={800} height={500} />
                </div>
                <span className="f-shot-cap">{k.cap}</span>
                <div className="f-kbody">
                  {k.flag ? (
                    <span className="f-flagchip">
                      {NUMBER_LABEL[k.kit]} &middot; {k.flag}
                    </span>
                  ) : (
                    <span className="f-kchip">{NUMBER_LABEL[k.kit]}</span>
                  )}
                  <h3>{KIT_NAMES[k.kit]}</h3>
                  <p className="f-kwho">{k.who}</p>

                  {/* The card's own slice of the instrument above it. */}
                  <div className="f-pstrip" aria-hidden="true">
                    {ALL_PANEL_MARKER_IDS.map((id) => (
                      <span
                        key={id}
                        className={KIT_PANELS[k.kit].includes(id) ? 'f-ps f-on' : 'f-ps'}
                      />
                    ))}
                  </div>
                  <p className="f-blab f-pscount">
                    {panelCount(k.kit)} of {ALL_PANEL_MARKER_IDS.length} markers
                  </p>

                  <div className="f-kfoot">
                    <span className="f-price">{PRICES[k.kit]}</span>
                    <Link
                      href={`/kits/${k.kit}`}
                      className={k.ghostCta ? 'f-btn f-btn-sm f-btn-ghost' : 'f-btn f-btn-sm'}
                    >
                      {/* The homepage's label, not this page's. "Order" promised a
                          basket and delivers a product page, and it was the second
                          CTA label for one product set one click apart. Existing
                          approved copy in a new placement, not new words. The bare
                          label carries no arrow because "Order" carried none and
                          every other button on THIS page uses a glyph, not the
                          homepage's `.f-pip` circle; that divergence is real and is
                          not this change. */}
                      Start a baseline
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔴 THE TICK LIST WAS THE MOST GENERIC ELEMENT ON THE PAGE, and it was
            IDENTICAL on all three cards, so it differentiated nothing and cost
            nine of the page's sixty pill-radius elements. It is one fact about
            all three kits, so it is stated once, under all three. The words are
            unchanged; only the placement is. Logged in
            09_website-app/redesign-copy-register.md item 1. */}
        {/* `.f-fine` caps at 66ch, which is 455px of mono and breaks this into
            three short ragged lines when centred under a 1180px grid. Widened
            here rather than in the class, because 66ch is right for the fine
            print it was written for.
            105ch and not 92ch: the class also carries 0.04em of tracking, so a
            mono character costs ~7.4px rather than the ~6.9px the ch unit
            assumes, and 92ch landed at 2.05 lines of text, which word wrapping
            rounds up to three. */}
        <p
          className="f-fine"
          style={{
            marginTop: 18,
            textAlign: 'center',
            maxWidth: '105ch',
            marginInline: 'auto',
            textWrap: 'balance',
          }}
        >
          Every kit arrives with a finger-prick collection kit and a pre-paid return label.
          Collection takes five minutes. Results land in your Andro Prime dashboard, not the lab
          portal.
        </p>
      </section>

      {/* ---------- SECTION 03: THE MONEY BLOCK ----------
          🔴 APPROVED COPY, CARRIED VERBATIM, AND MOVED RATHER THAN CHANGED. This
          is C1 under CA-026 and the source marks it "rendered verbatim". Not a
          word differs. What differs is WHERE: it now lands AFTER the choice
          rather than before it, so it reads as a promise about the thing you have
          just picked instead of a claim about products you have not seen yet.
          Still the page's one inverted block, which DESIGN.md caps at one per
          page. Logged in redesign-copy-register.md item 3. */}
      <section className="f-wrap f-sec">
        <SectionRule n={3} of={4} />
        <div className="f-invert f-rise">
          <p className="f-blab f-blab-lg f-invert-lab">What you pay</p>
          <h2 className="f-h2 f-invert-h">
            One price.<br />
            Nothing hidden.
          </h2>
          <p className="f-sub f-invert-p">
            The price on the card is everything you pay. No charge to see your own results, no
            surprise second test, no subscription unless you choose one. If a result needs action,
            the next step is a GP conversation, and we earn nothing from it.
          </p>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="f-wrap f-sec">
        <SectionRule n={4} of={4} />
        <p className="f-blab">Process</p>
        <h2 className="f-h2">Order to results in under a week.</h2>

        <div className="f-steps" style={{ marginTop: 22 }}>
          {STEPS.map((s) => (
            <div className="f-step" key={s.n}>
              <span className="f-bignum" aria-hidden="true">
                {s.n.replace(/^0/, '')}
              </span>
              <span className="f-no">{s.n}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{s.h}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                {s.p}
              </p>
              <div className="f-step-foot">
                <span>{s.metaK}</span>
                <b>{s.metaV}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="f-btns" style={{ marginTop: 20 }}>
          <Link href="/how-it-works" className="f-btn f-btn-ghost f-btn-sm">
            Full process breakdown <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      </section>

      {/* ---------- SELECTOR CLOSE ---------- */}
      {/* NO `f-sec` HERE. `.f-sec` and `.f-close` both take `var(--f-sec-gap)`
          as padding-top, so stacking them spent the gap twice and put a void
          immediately before the final ask. The homepage puts `.f-close` on a
          bare `.f-wrap` and measures 0px; this now matches it. */}
      <section className="f-wrap">
        <div className="f-close">
          <p className="f-blab">Still not sure</p>
          <h2>Three questions. One clear recommendation.</h2>
          {/*
            Copy drift, carried as found: "less than a minute" describes the
            three-question version, not the current five-step selector.
          */}
          <p className="f-sub" style={{ margin: '0 auto' }}>
            The test selector asks about your main symptoms and tells you which kit fits best. Takes
            less than a minute.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/test-selector" className="f-btn">
              Use the selector <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
