import type { Metadata } from 'next'
import Link from 'next/link'
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

const FULL_NAMES: Record<KitType, string> = {
  'testosterone': 'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

const NUMBER_LABEL: Record<KitType, string> = {
  'testosterone': 'Kit 1',
  'energy-recovery': 'Kit 2',
  'hormone-recovery': 'Kit 3',
}

type KitCard = {
  kit: KitType
  title: React.ReactNode
  blurb: string
  rightFor: string
  footLabel: string
  footBody: string
  resultsTo: string
  invert?: boolean
  /** Frame O gives Kit 2 a ghost button and Kits 1 and 3 a solid one, so the
      middle option is not competing with the two it sits between. */
  ghostCta?: boolean
}

const KITS: KitCard[] = [
  {
    kit: 'testosterone',
    title: <>Testosterone<br />Health Check</>,
    blurb:
      'Your GP told you you’re normal. That’s not the same as good. This test shows exactly where your testosterone sits, including free testosterone and SHBG, which standard GP panels often skip. Results in 2 to 5 working days with a plain-English explanation of what they mean. If the main problem is tiredness, poor recovery or fogginess, Kit 2 is the better fit.',
    rightFor: 'Low drive, stalled training, “not myself” symptoms',
    footLabel: 'If your result shows testosterone below 12 nmol/L',
    footBody: 'You will receive a specific next step, not a generic recommendation.',
    resultsTo:
      'Your Andro Prime dashboard. Not the lab portal. Plain English with a specific next step.',
  },
  {
    kit: 'energy-recovery',
    title: <>Energy &amp;<br />Recovery Check</>,
    blurb:
      'Sore for 3 days after a session that used to take 1. Tired all the time. Joints aching. This test looks at the four markers most likely to explain why: Vitamin D, Active B12 (Holotranscobalamin), inflammation (hs-CRP), and iron stores (Ferritin). If the issue is hormones, Kit 1 or Kit 3 is the better fit.',
    rightFor: 'Fatigue, slow recovery, aching joints, low mood',
    ghostCta: true,
    footLabel: 'If a marker comes back deficient',
    footBody:
      'You get the specific marker, the number, and what the evidence supports doing about it.',
    resultsTo:
      'Your Andro Prime dashboard. Not the lab portal. Plain English with a specific next step.',
  },
  {
    kit: 'hormone-recovery',
    title: <>Hormone &amp;<br />Recovery Check</>,
    blurb:
      'Nine markers covering hormones, energy, recovery, and inflammation in one kit. The right choice when you are not sure whether the problem is testosterone, deficiency, or both. If there is ambiguity, start here.',
    rightFor: 'Full picture across hormones, energy, and recovery',
    footLabel: 'Widest set of recommendation pathways',
    footBody:
      'Kit 3 covers both testosterone and deficiency markers, with supplement recommendation routes for every deficiency pattern. Our own supplement range launches shortly; you can join the early-access waitlist at any time. Best choice when the picture is unclear.',
    resultsTo:
      'Your Andro Prime dashboard. Full breakdown across all nine markers with targeted recommendations.',
    invert: true,
  },
]

const STEPS = [
  { n: '01', h: 'Order online', p: 'Choose your kit. Pay once. Kit dispatched the same working day.' },
  { n: '02', h: 'Collect at home', p: 'Five minutes. Finger-prick. Return with the pre-paid label in your kit.' },
  { n: '03', h: 'Lab processes it', p: 'UKAS ISO 15189 accredited lab. Results ready within 2 to 5 working days of receipt.' },
  { n: '04', h: 'Plain-English results', p: 'Your numbers in your dashboard. What they mean. What to do next. Specific to your data.' },
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
        name: `${FULL_NAMES[kit]}: ${PRICES[kit]}`,
        url: `${BASE_URL}/kits/${kit}`,
      })),
    },
  ],
}

export const metadata: Metadata = {
  title: 'Men’s Health Blood Tests at Home (UK)',
  description:
    'At-home men’s health blood tests. Three kits: testosterone, energy and recovery, or the full picture. UKAS accredited lab. Results in 2 to 5 days.',
  alternates: { canonical: 'https://andro-prime.com/kits' },
  openGraph: {
    title: 'Men’s Health Blood Tests at Home (UK) | Andro Prime',
    description:
      'Men’s health blood tests you take at home. Three kits covering testosterone, energy and recovery, or the full picture. UKAS accredited lab. Results in 2 to 5 working days.',
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
      'Men’s health blood tests you take at home. Three kits covering testosterone, energy and recovery, or the full picture. UKAS accredited lab. Results in 2 to 5 working days.',
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
      <section className="f-wrap f-sec">
        <div className="f-herogrid f-rise">
          <div>
            <div className="f-eyebrow"><i />Diagnostic kits</div>
            <h1 className="f-h1" style={{ marginTop: 18 }}>
              Stop guessing.<br />
              <span className="f-grey">Get the numbers.</span>
            </h1>
            <p className="f-stand" style={{ marginTop: 18 }}>
              Three men&rsquo;s health blood tests you take at home. Each one gives you specific
              results from a UKAS accredited lab, delivered in plain English, with a clear next step
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
            <p className="f-fine" style={{ marginTop: 20 }}>
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
                    <h3 className="f-prow-t">{FULL_NAMES[kit]}</h3>
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

      {/*
        ---------- MONEY BLOCK ----------
        C1 under CA-026, rendered VERBATIM. The redraw changes only the container.
        Not a word of this copy is editable without a compliance pre-flight.
      */}
      <section className="f-wrap f-sec">
        <div className="f-invert f-rise">
          <p className="f-blab f-invert-lab">What you pay</p>
          <h2 className="f-h2 f-invert-h">
            One price.<br />Nothing hidden.
          </h2>
          <p className="f-sub f-invert-p">
            The price on the card is everything you pay. No charge to see your own results, no
            surprise second test, no subscription unless you choose one. If a result needs action,
            the next step is a GP conversation, and we earn nothing from it.
          </p>
        </div>
      </section>

      {/* ---------- THREE KITS ---------- */}
      <section className="f-wrap f-sec" id="kits">
        <p className="f-blab">The full range</p>
        <h2 className="f-h2">
          Three tests.<br />
          <span className="f-grey">Different questions.</span>
        </h2>
      </section>

      <section className="f-wrap">
        {KITS.map((k) => (
          <div className={k.invert ? 'f-tray f-tray-dark f-rise' : 'f-tray f-rise'} key={k.kit}>
            <div className={k.invert ? 'f-core f-core-dark' : 'f-core'}>
              <div className="f-kitgrid">
                <div>
                  <div className="f-kithead">
                    <div>
                      <span className="f-kchip">{NUMBER_LABEL[k.kit]}</span>
                      <h3 className="f-h2 f-kittitle">{k.title}</h3>
                    </div>
                    <div className="f-kitprice">
                      <span className="f-price">{PRICES[k.kit]}</span>
                      <span className="f-oneoff">one-off</span>
                    </div>
                  </div>

                  <p className="f-sub">{k.blurb}</p>

                  <div className="f-spec">
                    <div>
                      <span className="f-spec-k">Markers tested</span>
                      <span className="f-spec-v">{panelShortLabels(k.kit).join(' · ')}</span>
                    </div>
                    <div>
                      <span className="f-spec-k">Turnaround</span>
                      <span className="f-spec-v">
                        Results within 2 to 5 working days of sample receipt
                      </span>
                    </div>
                    <div>
                      <span className="f-spec-k">Right for</span>
                      <span className="f-spec-v">{k.rightFor}</span>
                    </div>
                  </div>

                  <div className="f-kitfoot">
                    <p className="f-blab" style={{ marginBottom: 8 }}>
                      {k.footLabel}
                    </p>
                    <p className="f-sub" style={{ fontSize: 15 }}>
                      {k.footBody}
                    </p>
                  </div>
                </div>

                <div className="f-kitaside">
                  <div>
                    <p className="f-blab">What arrives in the post</p>
                    <ul className="f-ticks">
                      {['Finger-prick collection kit', 'Pre-paid return label', '5-minute collection process'].map((t) => (
                        <li key={t}>
                          <span aria-hidden="true">&#10003;</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="f-blab" style={{ marginTop: 20 }}>
                      Results delivered to
                    </p>
                    <p className="f-sub" style={{ fontSize: 15 }}>
                      {k.resultsTo}
                    </p>
                  </div>
                  <Link
                    href={`/kits/${k.kit}`}
                    className={
                      k.invert ? 'f-btn f-btn-onDark' : k.ghostCta ? 'f-btn f-btn-ghost' : 'f-btn'
                    }
                    style={{ marginTop: 22, width: '100%', justifyContent: 'center' }}
                  >
                    Order for {PRICES[k.kit]}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/*
        ---------- COMPARISON TABLE ----------
        Derived from KIT_PANELS so this table cannot desync from the kit pages.
      */}
      <section className="f-wrap f-sec">
        <p className="f-blab">Side by side</p>
        <h2 className="f-h2">What each men&rsquo;s health blood test covers.</h2>

        <p className="f-fine f-scrollhint">Scroll to see all kits &rarr;</p>
        <div className="f-tray" style={{ marginTop: 18 }}>
          <div className="f-core">
            <div className="f-tablewrap">
              <table className="f-table">
                <thead>
                  <tr>
                    <th scope="col">Marker</th>
                    {ORDER.map((kit) => (
                      <th
                        scope="col"
                        key={kit}
                        className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}
                      >
                        {NUMBER_LABEL[kit]}
                        <span className="f-th-price">{PRICES[kit]}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_PANEL_MARKER_IDS.map((id) => (
                    <tr key={id}>
                      <th scope="row">{markerLabel(id)}</th>
                      {ORDER.map((kit) => {
                        const has = KIT_PANELS[kit].includes(id)
                        return (
                          <td
                            key={kit}
                            className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}
                          >
                            <span className={has ? 'f-in' : 'f-out'} aria-hidden="true" />
                            <span className="sr-only">{has ? 'Included' : 'Not included'}</span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">Total markers</th>
                    {ORDER.map((kit) => (
                      <td key={kit} className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}>
                        <span className="f-total">{panelCount(kit)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td />
                    {ORDER.map((kit) => (
                      <td key={kit} className={kit === 'hormone-recovery' ? 'f-col-hi' : undefined}>
                        <Link href={`/kits/${kit}`} className="f-btn f-btn-sm f-btn-ghost">
                          Order
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="f-wrap f-sec">
        <p className="f-blab">Process</p>
        <h2 className="f-h2">Order to results in under a week.</h2>

        <div className="f-steps" style={{ marginTop: 22 }}>
          {STEPS.map((s) => (
            <div className="f-step" key={s.n}>
              <span className="f-bignum" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="f-h4">{s.h}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                {s.p}
              </p>
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
      <section className="f-wrap f-sec">
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
