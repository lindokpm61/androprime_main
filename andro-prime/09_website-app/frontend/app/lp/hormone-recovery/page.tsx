import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { KitCheckoutButton } from '@/components/commerce/KitCheckoutButton'
import { MembershipDisclosure } from '@/components/commerce/MembershipDisclosure'
import { READOUT_KIT_3 } from '@/lib/kits/sampleReadout'
import { PANEL_MARKERS } from '@/lib/kits/panel'
import { PRICING } from '@/lib/pricing'

/**
 * /lp/hormone-recovery, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Read `/lp/testosterone`'s header first: the frame position, the sample-report
 * extraction and the standing contradiction in the closing block all apply here.
 *
 * EVERY WORD IS VERBATIM: the headline, the standfirst, the reality paragraphs
 * and pull quote, all four "sound familiar" lines, all nine biomarker
 * descriptions, the four process steps, the full-picture block with its two
 * prices and three reasons, the four next-step cards with their badges, all four
 * "built for" lines, both attributed quotations, every row of the comparison
 * table, all six FAQ answers, the two-rules paragraph, the six feature lines and
 * both closing blocks.
 *
 * 🔴 THE SAMPLE REPORT CARRIED EIGHT OF THE TWELVE LIVE VERDICT-VOCABULARY
 * DEFECTS, the largest single concentration of them. DESIGN.md gap 9 names this
 * page and singles out one row: **free testosterone graded "Low" at 0.231**. The
 * rows now come from `lib/kits/sampleReadout.ts`, the same data
 * `/kits/hormone-recovery` renders, so the verdicts are the engine's own words
 * rather than a second hand-typed set.
 *
 * ⚠ THE COMPARISON TABLE IS KEPT, AND FRAME AC IS RIGHT THAT IT IS THE THIRD.
 * `/kits` carries a nine-marker tick comparison and `/kits/hormone-recovery`
 * carries a five-row spec comparison of the same three products; this is a third
 * view of the same facts. It is kept because removing a section from a page is a
 * content decision rather than a restyle's, and flagged here and in the register
 * so the consolidation question stays visible. Its prices already derive from
 * `lib/pricing.ts` and still do.
 *
 * ⚠ BOTH CLOSING BLOCKS STILL ASSERT A ONE-OFF PURCHASE. The order block reads
 * "Secure checkout. No subscription.", the closing strip reads "One-off
 * purchase.", and FAQ 3 reads "It is a one-off payment, not a subscription."
 * All three are false under the 2026-09-07 auto-renew ruling and all three are
 * rendered UNCHANGED, because rewriting approved copy is a pre-flight decision.
 * **Owed to Keith, then pre-flight.** `scripts/verify-subscription-claims.js`
 * fails the build if `MEMBERSHIP_ENABLED` is on while they remain.
 */

const BASE_URL = 'https://andro-prime.com'

const FAQ_ITEMS = [
  { question: 'Does it hurt?', answer: "It's a quick prick on the fingertip. Most men say it's completely painless. We include extra lancets just in case." },
  { question: 'How long do results take?', answer: 'Most results are ready within 2 to 5 working days of the lab receiving your sample. Some can take a little longer, depending on sample quality, postal transit and lab workload.' },
  { question: 'Does the £179 cover everything?', answer: 'Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included. It is a one-off payment, not a subscription.' },
  { question: 'Is my data private?', answer: 'Your results sit in your private dashboard, yours to share with whoever you choose. We do not sell your data, and we do not share it for advertising.' },
  { question: 'Why not just buy Kit 1 and Kit 2 separately?', answer: 'You could. They\'d cost £218 combined. Kit 3 gives you all nine markers for £179, with one sample instead of two. And testing everything together gives a more complete picture, which means better recommendations.' },
  { question: 'What if my testosterone comes back low?', answer: 'Your report will explain exactly what your level means and what to consider next. If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing.' },
]

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Hormone & Recovery Check', item: `${BASE_URL}/lp/hormone-recovery` },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/lp/hormone-recovery/#product`,
      name: 'Hormone & Recovery Check: At-Home Blood Test Kit',
      description: 'Nine biomarkers across hormones, energy and inflammation. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.',
      brand: { '@type': 'Brand', name: 'Andro Prime' },
      sku: 'AP-KIT-03',
      offers: {
        '@type': 'Offer',
        price: '179.00',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/lp/hormone-recovery`,
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
  title: "Men's Health Blood Test UK | 9 Biomarkers £179",
  description: 'Nine biomarkers across hormones, energy, recovery and inflammation in one at-home test. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days. £179.',
  robots: { index: false, follow: false },
  openGraph: {
    title: "Men's Health Blood Test UK | 9 Biomarkers | £179 | Andro Prime",
    description: 'Hormones, energy, recovery and inflammation. One test, nine biomarkers. Results in 2 to 5 working days.',
    url: 'https://andro-prime.com/lp/hormone-recovery',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Hormone and Recovery Check: Kit 3' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Men's Health Blood Test UK | 9 Biomarkers | £179 | Andro Prime",
    description: 'Hormones, energy, recovery and inflammation. One test, nine biomarkers.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const SOUND_FAMILIAR = [
  { title: "Not sure if it's hormones or energy.", body: 'The symptoms overlap and no one has tested both at once.' },
  { title: "Haven't had a proper check in years.", body: 'Want to know where you stand before something goes wrong.' },
  { title: 'Slow recovery, low drive, brain fog.', body: "All at once. One test can't explain all three." },
  { title: 'Something has shifted after 40.', body: "You can feel it. You just can't point to what." },
]

const BIOMARKERS = [
  { num: '01', category: 'Hormones', title: 'Total Testosterone', body: 'The total amount of testosterone in your blood. Your baseline. If this is low, everything else, energy, mood, drive, takes a hit.' },
  { num: '02', category: 'Hormones', title: 'SHBG', body: 'Sex Hormone Binding Globulin. It binds to testosterone and makes it unusable. High SHBG means your total T might look fine on paper while you still feel terrible.' },
  /* Clinically ruled copy, read from the panel rather than written here. This said FAI
     was "a more sensitive indicator of testosterone availability than Total T alone",
     the free-T stand-in framing thresholds.md item 8 refuses in men. */
  { num: '03', category: 'Hormones', title: PANEL_MARKERS.fai.name, body: `${PANEL_MARKERS.fai.measures}. ${PANEL_MARKERS.fai.why}` },
  { num: '04', category: 'Hormones', title: 'Albumin', body: 'The main carrier protein in your blood. Testing albumin allows accurate calculation of Free Testosterone. Without it, the number is an estimate.' },
  { num: '05', category: 'Hormones', title: 'Free Testosterone', body: 'The testosterone your body can actually use. Calculated from your Total T, SHBG, and Albumin. This is the number that matters most for how you feel day to day.' },
  { num: '06', category: 'Energy', title: 'Vitamin D', body: "Most UK men are deficient, especially October to March. Low vitamin D directly affects muscle function, recovery, and energy. You won't know without testing." },
  { num: '07', category: 'Energy', title: 'Active B12', body: 'Holotranscobalamin: the form of B12 your cells can actually use. Standard tests often miss deficiency. Low Active B12 affects energy, nerve function, and recovery between sessions.' },
  { num: '08', category: 'Inflammation', title: 'hs-CRP (Inflammation)', body: 'A high-sensitivity inflammation marker. In active men, elevated hs-CRP is often linked to joint and connective tissue stress, but it can have several causes. Your dashboard explains what your specific reading means.' },
  { num: '09', category: 'Iron Stores', title: 'Ferritin', body: 'Your iron stores. Low ferritin is one of the most common and most overlooked causes of fatigue in men. Often normal on a basic NHS panel. Rarely tested unless you ask for it specifically.' },
]

const STEPS = [
  { num: '01', title: 'Order', body: 'Dispatched same day. Fits through your letterbox.' },
  { num: '02', title: 'Collect', body: 'A simple finger-prick sample you can do at the kitchen table.' },
  { num: '03', title: 'Return', body: 'Drop it in a postbox using the prepaid return envelope.' },
  { num: '04', title: 'Read', body: 'Your results appear in your private dashboard within 2 to 5 working days. Every marker explained in plain English. Every recommendation based on your actual data.' },
]

const WHY_ONE_KIT = [
  { num: '01', title: 'More data, better answers.', body: 'Your testosterone, energy, recovery, and inflammation markers all interact. Testing them together shows the full picture, not just one piece of it.' },
  { num: '02', title: 'One sample, one envelope, one result.', body: 'No need to order two kits and do two finger pricks on two different mornings.' },
  { num: '03', title: 'Strongest recommendations.', body: 'More markers mean more specific advice. If multiple things are off, your report shows exactly which ones and what to do about each.' },
]

const NEXT_STEP = [
  { title: 'All markers in range', badge: 'Optimal', body: 'Your baseline confirmed across all nine markers. You get a retest reminder in 6 to 12 months and specific advice to maintain what you have.' },
  { title: 'Clear suboptimal markers', badge: 'Suboptimal', body: 'Your report shows exactly which markers need attention first, so you are not left guessing what matters most or what to act on next.' },
  { title: 'Hormone picture clarified', badge: 'Review', body: 'You see where your testosterone markers actually sit, how they relate to one another, and what the data is telling you in plain English.' },
  { title: 'The full picture in one place', badge: 'Complete', body: 'Instead of testing one system and missing the rest, Kit 3 shows hormones, energy, and inflammation together so the recommendation starts from a complete baseline.' },
]

const BUILT_FOR = [
  { title: "The man who hasn't had a proper check-up in years", body: 'and wants to know where he stands.' },
  { title: "The man who isn't sure whether it's his testosterone, his energy, or something else entirely.", body: '' },
  { title: 'The man who wants one comprehensive test', body: 'instead of guessing which single marker to check.' },
  { title: "The man over 40 who knows something's shifted", body: "but can't pinpoint what." },
]

const COMPARE_ROWS = [
  { label: 'Price', k1: `£${PRICING.KIT_1.rrp}`, k2: `£${PRICING.KIT_2.rrp}`, k3: `£${PRICING.KIT_3.rrp}` },
  { label: 'Markers', k1: 'Total T, SHBG, FAI, Albumin, Free T', k2: 'Vit D, Active B12, hs-CRP, Ferritin', k3: 'All 9 markers' },
  { label: 'Best for', k1: 'Testosterone only', k2: 'Energy, recovery, joints', k3: 'Full picture' },
  { label: 'Testosterone?', k1: 'Yes', k2: 'No', k3: 'Yes' },
  { label: 'Energy + recovery?', k1: 'No', k2: 'Yes', k3: 'Yes' },
]

const INCLUDED = [
  'Total T, SHBG, FAI, Albumin, Free T, Vit D, Active B12, hs-CRP, Ferritin (9 markers)',
  'UKAS ISO 15189 accredited lab',
  'Free next-day delivery + return postage',
  'Personal dashboard with plain-English results',
  'Specific recommendation based on your data',
  'GP-set ranges and explanations',
]

const TRUST = ['UKAS ISO 15189 Lab', 'Free Next-Day Delivery', 'GMC-Registered Doctor', 'Results in 2 to 5 working days']

export default function HormoneRecoveryLpPage() {
  return (
    <FPage>
      <JsonLd data={lpSchema} />

      <FHero
        aside={
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
                {READOUT_KIT_3.map((m) => (
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
          <span className="f-eyebrow">Data first</span>
          <span className="f-flagchip">Most complete</span>
        </div>
        <h1 className="f-h1">
          Nine numbers<br />every man<br /><span className="f-grey">over 40 should know.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Hormones, energy, recovery, and inflammation. One test. Nine biomarkers. The full picture of what&apos;s actually going on inside your body, with a specific recommendation based on your data.
        </p>
        <div className="f-btns" style={{ marginTop: 24 }}>
          <a href="#order" className="f-btn">
            Order the Kit: &pound;179 {ARROW}
          </a>
        </div>

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
              You don&apos;t know<br /><span className="f-grey">what you don&apos;t know.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              Maybe it&apos;s your testosterone. Maybe it&apos;s your vitamin D. Maybe it&apos;s inflammation you can&apos;t feel yet. Maybe it&apos;s all three.
            </p>
            <p className="f-sub" style={{ marginTop: 14 }}>
              You can spend months guessing, or you can find out. This kit tests the nine markers that matter most for how you feel, recover, and perform. Not 30 markers you&apos;ll never use. Just the ones that actually move the needle.
            </p>
            <p className="f-pull">
              &ldquo;Testing one thing when the real problem could be three things is how men stay stuck.&rdquo;
            </p>
          </div>

          <div>
            <p className="f-blab">Sound familiar?</p>
            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 6 }}>
              {SOUND_FAMILIAR.map(({ title, body }) => (
                <div className="f-bio" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · THE DATA ---------- */}
      <FSection cont>
        <p className="f-blab">The data</p>
        <h2 className="f-h2">
          Everything Kit 1 and Kit 2 test.<br /><span className="f-grey">In one kit.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Nine biomarkers across hormones, energy, and recovery. Each one tells you something specific about what your body is doing.
        </p>

        <div className="f-steps f-steps-3 f-rise" style={{ marginTop: 24 }}>
          {BIOMARKERS.map(({ num, category, title, body }) => (
            <div className="f-step" key={num}>
              <span className="f-no">{num} &middot; {category}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 03 · THE PROCESS ---------- */}
      <FSection>
        <p className="f-blab">The process</p>
        <h2 className="f-h2">Five minutes. No GP needed.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          No appointment. No waiting room. No referral letter.
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

      {/* ---------- 04 · THE FULL PICTURE ---------- */}
      <FSection>
        <p className="f-blab">The full picture</p>
        <div className="f-splitgrid f-rise" style={{ marginTop: 12 }}>
          <div>
            <h2 className="f-h2">
              One test instead of two.<br /><span className="f-grey">One price instead of two.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              Kit 3 includes everything in Kit 1 (testosterone) and Kit 2 (energy and recovery) in a single test. Separately, those two kits cost &pound;218. Kit 3 gives you all nine markers for &pound;179.
            </p>
            <div className="f-spec" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 22, marginBottom: 0 }}>
              <div>
                <span className="f-spec-k">Kit 1 + Kit 2 separately</span>
                <span className="f-spec-v" style={{ fontSize: 19 }}>&pound;218</span>
              </div>
              <div>
                <span className="f-spec-k">Kit 3 all-in</span>
                <span className="f-spec-v" style={{ fontSize: 19 }}>&pound;179</span>
              </div>
            </div>
          </div>

          <div className="f-bios" style={{ gridTemplateColumns: '1fr' }}>
            {WHY_ONE_KIT.map(({ num, title, body }) => (
              <div className="f-bio" key={num}>
                <p className="f-blab" style={{ marginBottom: 8 }}>{num}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </FSection>

      {/* ---------- 05 · THE NEXT STEP ---------- */}
      <FSection cont>
        <p className="f-blab">The next step</p>
        <h2 className="f-h2">We don&apos;t just give you numbers.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Every biomarker comes with a plain-English explanation and a specific next step. If your vitamin D is low, you&apos;ll know what to take and the right dose. If your testosterone is below where it should be, your report explains what your level means and what to consider next. If something needs a GP, we&apos;ll tell you directly.
        </p>
        <p className="f-pull">
          Your report is built on healthy ranges and explanations set by a GMC-registered GP. No guesswork. No generic advice. Just your data and what it means for you.
        </p>

        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {NEXT_STEP.map(({ title, badge, body }) => (
            <div className="f-step" key={title}>
              <span className="f-no">{badge}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 06 · BUILT FOR ---------- */}
      <FSection>
        <p className="f-blab">Built for</p>
        <h2 className="f-h2">The men&apos;s health check your GP doesn&apos;t offer.</h2>

        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {BUILT_FOR.map(({ title, body }) => (
            <div className="f-step" key={title}>
              <h3 className="f-h4 mb-2">{title}</h3>
              {body ? <p className="f-sub" style={{ fontSize: 15 }}>{body}</p> : null}
            </div>
          ))}
        </div>

        <div className="f-btns f-rise" style={{ marginTop: 24 }}>
          <a href="#order" className="f-btn">
            Order the Kit: &pound;179 {ARROW}
          </a>
          <span className="f-kchip">Not sure where to start? Start here.</span>
        </div>
      </FSection>

      {/* ---------- 07 · THE FOUNDERS ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. Both quotations verbatim; Dr Ewa's
          outlined-person glyph is gone for the `/contact` reason. */}
      <FSection>
        <p className="f-blab">Founders</p>
        <h2 className="f-h2">
          Built by men who needed it.<br /><span className="f-grey">Backed by doctors who understand it.</span>
        </h2>

        <div className="f-invert f-rise" style={{ marginTop: 24 }}>
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
            &ldquo;I spent two years being told my levels were &lsquo;normal for my age&rsquo; while feeling completely burnt out. I built this company because the standard approach is broken. We test first. Then you know exactly where you stand.&rdquo;
          </blockquote>
        </div>
      </FSection>

      {/* ---------- 08 · COMPARE ----------
          ⚠ The third comparison table of the same three products. Kept, and
          flagged in the file header and the register. */}
      <FSection>
        <p className="f-blab">Compare</p>
        <h2 className="f-h2">All three kits, side by side.</h2>

        <div className="f-tablewrap f-rise" style={{ marginTop: 22 }}>
          <table className="f-table">
            <thead>
              <tr>
                <th />
                <th>Kit 1: Testosterone</th>
                <th>Kit 2: Energy &amp; Recovery</th>
                <th className="f-col-hi">Kit 3: Hormone &amp; Recovery</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(({ label, k1, k2, k3 }) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{k1}</td>
                  <td>{k2}</td>
                  <td className="f-col-hi">{k3}</td>
                </tr>
              ))}
              <tr>
                <th scope="row" />
                <td><Link href="/kits/testosterone" className="f-tlink">Order &rarr;</Link></td>
                <td><Link href="/kits/energy-recovery" className="f-tlink">Order &rarr;</Link></td>
                <td className="f-col-hi">You&apos;re here</td>
              </tr>
            </tbody>
          </table>
        </div>
      </FSection>

      {/* ---------- 09 · COMMON QUESTIONS ---------- */}
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
          The full panel follows the same two rules. Anything that needs a doctor goes to a GP and earns us nothing. And no result changes what we offer or what it costs.
        </p>
      </FSection>

      {/* ---------- THE ORDER BLOCK ---------- */}
      <FSection narrow rule={false} cont id="order">
        <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
          <div className="f-core">
            <p className="f-blab">Kit 03</p>
            <h2 className="f-h2" style={{ marginTop: 10 }}>Hormone &amp; Recovery Check</h2>
            <div className="f-btns" style={{ marginTop: 12, alignItems: 'baseline' }}>
              <span className="f-price">&pound;179</span>
              <span className="f-kchip">all-in, one-off</span>
            </div>

            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 18 }}>
              {INCLUDED.map((item) => (
                <div className="f-bio" key={item}><p>{item}</p></div>
              ))}
            </div>

            <div className="f-btns" style={{ marginTop: 22 }}>
              <KitCheckoutButton kitType="hormone-recovery" className="f-btn">
                Order Now. &pound;179
              </KitCheckoutButton>
            </div>

            <MembershipDisclosure />

            {/* ⚠ FALSE UNDER THE AUTO-RENEW RULING AND RENDERED UNCHANGED. */}
            <p className="f-fine" style={{ marginTop: 12 }}>
              Secure checkout. No subscription.
            </p>
          </div>
        </div>
      </FSection>

      {/* ---------- CLOSE ---------- */}
      <section className="f-wrap f-sec">
        <FClose inSection>
          <p className="f-blab">One test</p>
          <h2>One test. Nine answers. The full picture.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            A finger prick. A prepaid envelope. That&apos;s it.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <a href="#order" className="f-btn">
              Order the Kit: &pound;179 {ARROW}
            </a>
          </div>
          {/* ⚠ "One-off purchase." is false under the auto-renew ruling and is
              rendered unchanged. See the file header. */}
          <p className="f-fine" style={{ margin: '14px auto 0' }}>
            One-off purchase. Results in your personal dashboard. No GP needed.
          </p>
        </FClose>
      </section>
    </FPage>
  )
}
