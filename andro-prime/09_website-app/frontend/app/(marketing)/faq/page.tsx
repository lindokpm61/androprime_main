import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ALL_PANEL_MARKER_IDS, KIT_PANELS, PANEL_MARKERS, kitsIncluding, numberWord,
  type PanelMarkerId,
} from '@/lib/kits/panel'
import { KIT_PRICE_RANGE, SLA_COPY } from '@/lib/pricing'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'

/**
 * /faq, "The Facts", rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * THE LARGEST PAGE ON THE SITE, AND THE ONE WITH THE MOST REGULATED COPY.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY CLAIM, EVERY RANGE, EVERY NUMBER AND EVERY EFSA SENTENCE IS VERBATIM.
 * Four reference-range tables, three epidemiological statistics, five EFSA
 * claim quotations, the NHS-gap argument, the supplement-honesty paragraphs and
 * the CA-026 C2 price answer are all byte-identical to the V2.0 page. The
 * changes are structural and are listed below.
 *
 * 🔴 THE FOUR REFERENCE-RANGE TABLES BECOME `.f-steps`, AND THIS IS THE MOST
 * CONSEQUENTIAL CALL ON THE PAGE. Each is exactly four bands with a range, a
 * verdict word and an explanation, and `.f-steps` turns to four columns above
 * 1040px: the range takes the mono index slot, the verdict takes the heading and
 * the explanation takes the body. Nothing is invented and nothing is a drawn
 * instrument.
 *
 * ⚠ AND THEY ARE DELIBERATELY NOT DRAWN AS THE TWO-RANGE READOUT. That component
 * is available and would look magnificent here, and using it would be a defect.
 * DESIGN.md: *"a needle must measure something real, because an instrument face
 * reading a number that does not exist is the one thing this brand cannot ship"*,
 * and nobody reading `/faq` has taken a test. Worse, `.f-bar`'s fills carry the
 * clinical status triad, which the 2026-09-03 saturation ruling fences to *"a
 * results or sample-report panel"* -- a coloured band beside "8 to 12 nmol/L" on
 * a marketing page would be a verdict about a reader who has no numbers. These
 * are typographic bands and they carry no colour.
 *
 * 🔴 THE STICKY JUMP NAV IS GONE AND ITS LINKS ARE NOT. The V2.0 page pinned a
 * second navigation bar at `top-20` under the site nav, which is two fixed bars
 * on a phone and a permanent bite out of the viewport on the longest page on the
 * site. The same six anchors now sit once, under the hero, as `.f-kchip` links.
 * Every `id` is preserved, so every inbound deep link still lands.
 *
 * 🔴 WHERE THIS PAGE SPENDS ITS ONE INVERTED PANEL: section 08, "Why this
 * price", which is CA-026 C2 and is rendered verbatim. It is the page's
 * conformity statement, which is what DESIGN.md reserves the panel for. The
 * V2.0 page had THREE full-bleed ink blocks (the NHS gap, the supplement note
 * and the closing CTA) plus two ink cards, which is the state the one-per-page
 * constraint exists to prevent: a page where everything is emphasised is a page
 * where nothing is.
 *
 * ⚠ SO THE NHS-GAP SECTION IS NO LONGER INK, and that is the visible loss. It
 * keeps its weight through the pull quote and the `.f-symp` card list instead.
 * If Keith would rather spend the panel there, the swap is two blocks and
 * nothing else moves.
 *
 * ⚠ THE MARKER TABLE IS STILL DERIVED FROM `lib/kits/panel.ts` and still counts
 * its own rows with `numberWord`. Its own comment records why: hand-written, it
 * listed seven rows and omitted FAI and Albumin while the CA-026 block further
 * down the same page named FAI. `KIT_PRICE_RANGE` and `SLA_COPY` are now imported
 * for the same reason, replacing "£99 to £179" and "2 to 5 working days" typed
 * into the closing block.
 */

const BASE_URL = 'https://andro-prime.com'

const factsSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'The Facts', item: `${BASE_URL}/faq` },
  ],
}

// C2 (CA-026): why-this-price answer, rendered verbatim in the block below and mirrored here.
const PRICE_ANSWER =
  'Our panels cost more than a basic entry test. That buys the markers that matter for men, including free testosterone via FAI, analysis by a UKAS ISO 15189-accredited lab, plain-English results under recommendation logic approved by a GMC-registered GP, and a business with no stake in your result coming back low.'

const priceFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why do your tests cost more than a £45 test?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: PRICE_ANSWER,
      },
    },
  ],
}

export const metadata: Metadata = {
  title: 'The Facts',
  description: "The facts about testosterone, men's health testing, and why your GP said normal but you still feel terrible. No fluff. Just data.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: 'The Facts | Andro Prime',
    description: "The facts about testosterone, men's health testing, and why your GP said normal but you still feel terrible. No fluff. Just data.",
    url: `${BASE_URL}/faq`,
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime: The Facts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Facts | Andro Prime',
    description: "The facts about testosterone, men's health testing, and why your GP said normal but you still feel terrible.",
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

// The rest of the Kit 1 panel, in canonical order. Membership comes from the
// panel so a new marker cannot be missed here; the prose is this page's own.
const alsoTestedWithTestosterone = KIT_PANELS['testosterone'].filter(
  (id) => id !== 'total-testosterone',
)

const ALSO_TESTED_COPY: Partial<Record<PanelMarkerId, string>> = {
  'shbg': 'Sex hormone-binding globulin. SHBG binds to testosterone and makes it inactive. A high SHBG can leave a man with technically “normal” total T but very low free T, the form that actually matters.',
  'fai': 'Your total testosterone as a percentage of your SHBG. It is on the panel and it is on your report, but in men we draw no conclusion from it: it tracks calculated free testosterone poorly, and it reads high exactly when SHBG is low. Read your Free T instead.',
  'albumin': 'The most abundant transport protein in your blood, and the second input to the free testosterone calculation after SHBG. Measuring it is what makes your Free T a calculated figure rather than an estimate.',
  'free-testosterone': 'Calculated from Total T, SHBG and Albumin. This is what your body can actually use. Two men can have identical total testosterone but very different free testosterone. Total T alone is an incomplete picture.',
}

// Every marker on the panel, in canonical order, straight from the source of
// truth. Hand-written, this table listed seven rows and omitted FAI and
// Albumin while the CA-026 block further down this same page named FAI.
const markerRows = ALL_PANEL_MARKER_IDS.map((id) => ({
  id,
  ...PANEL_MARKERS[id],
  kit: kitsIncluding(id),
}))

/* The six anchors, with the ids they have always had. Every one is preserved
   from the V2.0 page so inbound deep links keep landing. */
const jumpLinks = [
  { id: 'testosterone', label: 'Testosterone' },
  { id: 'vitamin-d', label: 'Vitamin D' },
  { id: 'active-b12', label: 'Active B12' },
  { id: 'inflammation', label: 'Inflammation' },
  { id: 'the-nhs-gap', label: 'The NHS gap' },
  { id: 'the-test', label: 'What we test' },
]

/* Verbatim. Three epidemiological statistics, relocated from a divided strip
   into the system's three-up. No figure changed. */
const stats = [
  { stat: '1%', label: 'Per year', body: 'The rate at which testosterone declines in men from the age of 30. By 45, the average man has lost 10 to 15% of his peak testosterone. By 55, closer to 25%.' },
  { stat: '56%', label: 'Of UK men', body: 'UK men are estimated to be below optimal Vitamin D levels. Between October and April, even outdoor workers cannot produce sufficient Vitamin D from sunlight alone.' },
  { stat: '20%', label: 'Are deficient', body: 'An estimated 20% of UK adults have Active B12 levels below the threshold needed for normal cell function. The figure is higher in men over 40 and those who avoid meat or dairy. Standard B12 tests often miss it because they measure inactive fractions.' },
]

/* 🔴 THE FOUR BAND TABLES, VERBATIM. Range strings, verdict words and
   explanations are all exactly as they shipped, including the quotation marks
   inside two of them. No band carries colour: see the header. */
const testosteroneBands = [
  { range: '< 8 nmol/L', title: 'Below NHS threshold', desc: 'NHS referral territory. Speak to your GP.' },
  { range: '8–12 nmol/L', title: 'Borderline', desc: 'Often dismissed by GPs. Symptoms are typically present. Below optimal, and worth a GP conversation.' },
  { range: '12–20 nmol/L', title: 'In range. Not optimal.', desc: 'Where most men with symptoms sit. Technically "normal." Functionally below par.' },
  { range: '> 20 nmol/L', title: 'Healthy range', desc: 'Most men with these levels feel well. Retest in 6 to 12 months.' },
]

const vitaminDBands = [
  { range: '< 25 nmol/L', title: 'Deficient', desc: 'Associated with bone health issues, significant energy loss, muscle weakness. NHS will typically treat at this level.' },
  { range: '25–50 nmol/L', title: 'Insufficient', desc: 'Where most UK men sit in winter. Noticeable impact on energy and recovery. Common Andro Prime trigger.' },
  { range: '50–75 nmol/L', title: 'Adequate', desc: 'Functional. Most people feel reasonably well at this level.' },
  { range: '75–125 nmol/L', title: 'Optimal', desc: 'The range most research associates with peak muscle function, immune support, and energy. Target for supplementation.' },
]

const crpBands = [
  { range: '< 1 mg/L', title: 'Low risk', desc: 'Normal. No action required for inflammation specifically.' },
  { range: '1–3 mg/L', title: 'Mildly elevated', desc: 'Common in active men. Often reflects training stress. Collagen recommended if joint symptoms are present.' },
  { range: '3–10 mg/L', title: 'Elevated', desc: 'Recovery deficit likely significant. Collagen recommended with joint symptoms. GP review if it stays elevated on retest.' },
  { range: '> 10 mg/L', title: 'High: see your GP', desc: "At this level, we don't recommend a supplement. We tell you to book a GP appointment. This warrants a conversation with a doctor." },
]

/* Verbatim, all four. */
const whyNotTested = [
  'GPs will often decline a testosterone test unless symptoms are severe enough to suggest clinical deficiency. "Tired and unmotivated" doesn\'t usually qualify.',
  'If a test is granted, the result is returned as "normal" or "abnormal" without contextual interpretation for where in the range you sit.',
  'Vitamin D, Active B12, and hs-CRP are rarely tested together unless there is a specific clinical reason. A man with fatigue from three combined deficiencies will often get a "you\'re fine" across the board.',
  'Private comprehensive testing typically starts at £150 to £200, often requiring a consultation before any blood is drawn. Other private testing services give you numbers but no interpretation and no recommendation.',
]

/* The band table component, used four times on this page and nowhere else.
   Written as a local function rather than a shared component because it is
   markup arrangement over existing classes and has exactly one caller file:
   a `components/marketing` export would be a shared component with a single
   consumer, which is the shape DESIGN.md declines for `FHero`'s film variant. */
function BandTable({ bands, label }: { bands: { range: string; title: string; desc: string }[]; label: string }) {
  return (
    <>
      <p className="f-blab" style={{ marginTop: 30 }}>{label}</p>
      <div className="f-steps f-rise">
        {bands.map(({ range, title, desc }) => (
          <div className="f-step" key={range}>
            <span className="f-no">{range}</span>
            <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
            <p className="f-sub" style={{ fontSize: 15 }}>{desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default function FaqPage() {
  return (
    <FPage>
      <JsonLd data={factsSchema} />
      <JsonLd data={priceFaqSchema} />

      {/* ---------- HERO ---------- */}
      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">The four systems</p>
              <p className="f-sub" style={{ fontSize: 15 }}>
                Testosterone, Vitamin D, Active B12 and inflammation. Each one has a section on this
                page: what it does, what the numbers mean, and what we do about yours.
              </p>
              {/* The jump list, once, here. Not a second fixed bar. */}
              <div className="f-btns" style={{ marginTop: 18 }}>
                {jumpLinks.map(({ id, label }) => (
                  <a key={id} href={`#${id}`} className="f-kchip">{label}</a>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">The facts</span>
          <span className="f-kchip">No fluff. Just data.</span>
        </div>
        <h1 className="f-h1">
          What&rsquo;s actually<br />happening to<br /><span className="f-grey">men over 35.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Testosterone. Vitamin D. Active B12. Inflammation. These aren&rsquo;t wellness buzzwords.
          They are four of the key systems that directly explain why men over 35 stop feeling like
          themselves. Here are the facts.
        </p>
      </FHero>

      {/* ---------- THE THREE STATISTICS ----------
          Outside the numbered spine, like `/membership`'s and `/about`'s facts
          rows: this is a strip of context under the hero, not a subject. */}
      <section className="f-wrap">
        <div className="f-bios f-rise">
          {stats.map(({ stat, label, body }) => (
            <div className="f-bio" key={stat}>
              <p className="f-price" style={{ margin: '4px 0 8px' }}>{stat}</p>
              <h3>{label}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 01 · TESTOSTERONE ---------- */}
      <FSection id="testosterone">
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">Testosterone</p>
            <h2 className="f-h2">
              &ldquo;Normal&rdquo; is not<br /><span className="f-grey">the same as good.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              The NHS reference range for testosterone in men is roughly 8 to 30 nmol/L. That range
              was built to identify clinical hypogonadism: the level at which a man is medically
              deficient. A man at 8.5 nmol/L and a man at 24 nmol/L both get the same result from
              their GP: normal.
            </p>
            <p className="f-sub">
              They are not the same. Not in how they feel. Not in their energy, recovery, or mental
              sharpness. The range exists to identify illness, not to optimise performance.
            </p>
            <p className="f-pull">
              &ldquo;GP said normal. That&rsquo;s not the same as good.&rdquo;
            </p>
            <p className="f-sub" style={{ marginTop: 18 }}>
              Research consistently shows that men with testosterone levels in the lower third of the
              &ldquo;normal&rdquo; range report significantly higher rates of fatigue, reduced libido,
              slower recovery, and mood changes than men in the upper third, despite both being
              technically &ldquo;not ill.&rdquo;
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Also tested with testosterone</p>
              {/* ⚠ THE DOT CARRIES ITS INDEX, NOT A BULLET GLYPH. `.f-numdot` is a
                  26px ink disc sized for a numeral, and `&middot;` inside it
                  renders as a small light dot inside a large dark one, which
                  reads as a bullet somebody has drawn twice. Caught by screenshot.
                  The number is honest here: this is the rest of the Kit 1 panel
                  in CANONICAL ORDER, taken from `KIT_PANELS`, so the position is a
                  real fact about the panel rather than a decorative sequence. */}
              <div className="f-numlist">
                {alsoTestedWithTestosterone.map((id, i) => (
                  <div key={id}>
                    <span className="f-numdot" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className="f-h4" style={{ marginBottom: 4, fontSize: 16 }}>
                        {PANEL_MARKERS[id].short}
                      </h3>
                      <p className="f-sub" style={{ fontSize: 14.5, marginTop: 0 }}>
                        {ALSO_TESTED_COPY[id]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BandTable bands={testosteroneBands} label="Testosterone: what the numbers mean" />
      </FSection>

      {/* ---------- 02 · VITAMIN D ---------- */}
      <FSection id="vitamin-d">
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">Vitamin D</p>
            <h2 className="f-h2">
              You can&rsquo;t eat or train<br /><span className="f-grey">your way out of this one.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              Vitamin D is produced in the skin when it&rsquo;s exposed to UVB radiation from
              sunlight. Between October and April in the UK, the angle of the sun is too low to
              trigger this reaction. For roughly six months of the year, no amount of time outdoors
              will produce meaningful Vitamin D.
            </p>
            <p className="f-sub">
              Very few foods contain meaningful amounts of Vitamin D. The NHS advises everyone in the
              UK to consider supplementation from October to March. Most men don&rsquo;t.
            </p>
            <p className="f-sub">
              Vitamin D receptors are present in muscle tissue, the brain, and the immune system. Low
              Vitamin D directly affects energy, muscle function, and how quickly you recover from
              training.
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">EFSA-approved health claim</p>
              {/* 🔴 THE APPROVED WORDING, VERBATIM, WITH ITS QUOTATION MARKS. */}
              <p className="f-sub" style={{ fontSize: 14.5 }}>
                &ldquo;Vitamin D contributes to normal muscle function.&rdquo;
              </p>
              <p className="f-sub" style={{ fontSize: 14.5, marginTop: 12 }}>
                This is the legally verified claim we can make. Not more, not less.
              </p>

              <div className="f-well">
                <p className="f-blab">What we recommend if yours is low</p>
                <p className="f-sub" style={{ fontSize: 14.5, marginTop: 0 }}>
                  We will recommend supplements based on your result. Our own Daily Stack (launching
                  shortly) will contain 4,000 IU of Vitamin D3, the dose most research suggests for
                  moving levels from insufficient to optimal within 8 to 12 weeks. Diet alone is
                  insufficient for most men in the UK. Join the early-access list at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <BandTable bands={vitaminDBands} label="Vitamin D: what the numbers mean" />
      </FSection>

      {/* ---------- 03 · ACTIVE B12 ----------
          ⚠ THE V2.0 LAYOUT REVERSAL IS GONE. That page put the cards left and the
          prose right on this one section, via `order-2 lg:order-1`, so the reading
          order flipped for one section in the middle of the page and the DOM order
          disagreed with the visual order at desktop. Every section here leads with
          its argument. */}
      <FSection id="active-b12">
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">Active B12</p>
            <h2 className="f-h2">
              Your GP test<br /><span className="f-grey">probably missed it.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              B12 plays a central role in energy metabolism, neurological function, and red blood
              cell production. When it&rsquo;s low, energy drops, mental sharpness suffers, and
              recovery slows. These are symptoms easy to attribute to stress, age, or overtraining.
            </p>
            <p className="f-sub">
              The problem is that B12 deficiency is routinely underdiagnosed. GPs test total serum
              B12 when they test it at all. A result that comes back &ldquo;normal&rdquo; on that
              test can still indicate a functional deficiency when Active B12 is measured directly.
            </p>
            <p className="f-sub">
              For men over 40, this is one of the more common findings. It is also one of the most
              straightforward to address, with the right form of supplementation.
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Why standard B12 tests miss the problem</p>
              <p className="f-sub" style={{ fontSize: 14.5 }}>
                Most B12 blood tests measure total serum B12, which includes both the active and
                inactive fractions. You can have a technically &ldquo;normal&rdquo; total B12 result
                while your active B12 (the fraction your cells can actually use) is well below
                optimal.
              </p>
              <p className="f-sub" style={{ fontSize: 14.5 }}>
                Active B12 (Holotranscobalamin) is the specific marker that shows what&rsquo;s
                available to your cells. It&rsquo;s a more sensitive and clinically meaningful
                measure, and it&rsquo;s what we test.
              </p>
              <p className="f-sub" style={{ fontSize: 14.5 }}>
                Deficiency becomes more common after 40. The stomach produces less intrinsic factor
                with age, which is required to absorb B12 from food. Plant-based diets significantly
                increase the risk regardless of age.
              </p>

              <div className="f-well">
                <p className="f-blab">EFSA-approved health claims</p>
                {/* 🔴 BOTH APPROVED WORDINGS, VERBATIM. */}
                <p className="f-sub" style={{ fontSize: 14.5 }}>
                  &ldquo;Vitamin B12 contributes to normal energy-yielding metabolism.&rdquo;
                </p>
                <p className="f-sub" style={{ marginTop: 8, fontSize: 14.5 }}>
                  &ldquo;Vitamin B12 contributes to normal psychological function.&rdquo;
                </p>
                <p className="f-sub" style={{ fontSize: 14, marginTop: 10 }}>
                  These are the legally verified claims. Not marketing lines.
                </p>
              </div>

              <p className="f-blab" style={{ marginTop: 22 }}>What we recommend if yours is low</p>
              <p className="f-sub" style={{ fontSize: 14.5, marginTop: 0 }}>
                We will recommend supplements based on your result. Our own Daily Stack (launching
                shortly) will contain 1,000mcg of Active B12 as Methylcobalamin. Methylcobalamin is
                the bioactive form: it is used directly by the body without requiring conversion.
                Most cheaper supplements use Cyanocobalamin, which your body must convert before it
                can use it. The form matters. Join the early-access list at any time.
              </p>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 04 · INFLAMMATION ---------- */}
      <FSection id="inflammation">
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">hs-CRP and inflammation</p>
            <h2 className="f-h2">
              Sore for three days.<br /><span className="f-grey">Not just bad luck.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              hs-CRP (high-sensitivity C-reactive protein) is a marker of systemic inflammation. When
              inflammation is elevated, the body&rsquo;s ability to repair and recover is
              compromised. Training feels harder. Recovery takes longer. Joint stiffness becomes a
              fixture rather than an occasional irritation.
            </p>
            <p className="f-sub">
              In active men, mildly elevated hs-CRP often reflects connective tissue stress. The body
              is dealing with more repair demand than it has the resources to handle, particularly
              when Vitamin D and Active B12 are also low, both of which support recovery processes.
            </p>
            <p className="f-pull">
              Elevated inflammation is not something to push through. It&rsquo;s information. It
              means something is causing the body to remain in a repair state.
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Also tested: Ferritin</p>
              <p className="f-sub" style={{ fontSize: 15 }}>
                Ferritin is the body&rsquo;s iron storage marker. Low ferritin means your muscles and
                tissues aren&rsquo;t getting enough oxygen-carrying capacity, which directly affects
                stamina and recovery. If ferritin comes back low, we refer you to your GP. Iron
                supplementation needs to be dosed based on your specific levels. Getting it wrong can
                cause harm. We won&rsquo;t sell you iron.
              </p>
            </div>
          </div>
        </div>

        <BandTable bands={crpBands} label="hs-CRP: what the numbers mean" />
      </FSection>

      {/* ---------- 05 · THE NHS GAP ----------
          ⚠ NOT INK ANY MORE. See the header: the page's one inverted panel goes to
          the CA-026 answer in section 08. The weight is carried by the pull quote
          and the `.f-symp` list instead. */}
      <FSection id="the-nhs-gap">
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">The NHS gap</p>
            <h2 className="f-h2">
              The system is<br />designed for illness.<br />
              <span className="f-grey">Not performance.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              The NHS testosterone threshold exists to identify men who are clinically hypogonadal,
              men who have a diagnosable deficiency that warrants treatment. It was designed for that
              purpose and it does that job well.
            </p>
            <p className="f-sub">
              It was not designed to answer the question: &ldquo;Am I functioning at a level that
              matches how I should feel at my age?&rdquo; That is a different question. The NHS does
              not have the infrastructure, the appointment time, or the clinical mandate to answer it
              for most men.
            </p>
            <p className="f-sub">
              This is not a criticism of GPs. It&rsquo;s a structural reality. GPs have eight-minute
              appointments and clinical thresholds to work within. Optimisation is outside their
              scope in that context.
            </p>
            <p className="f-pull">
              &ldquo;Your GP isn&rsquo;t wrong. They&rsquo;re answering a different question. We
              answer yours.&rdquo;
            </p>
          </div>

          <div>
            <p className="f-blab">Why men don&rsquo;t get tested</p>
            <div className="f-symp">
              {whyNotTested.map((item) => (
                <div key={item.slice(0, 30)}>{item}</div>
              ))}
              <div className="f-dark">
                <b>What Andro Prime does differently.</b> We test the markers that matter for how men
                over 35 feel and perform. We interpret them in plain English. And we make a specific
                recommendation, only when the data supports one.
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 06 · WHAT WE TEST ----------
          The one real data table on the page, derived from `lib/kits/panel.ts`.
          `.f-tablewrap` scrolls it inside its own box so the page body never
          scrolls horizontally, and `.f-scrollhint` says so below 760px. */}
      <FSection id="the-test">
        <p className="f-blab">Our tests</p>
        <h2 className="f-h2">
          Every marker we test.<br /><span className="f-grey">Why it&rsquo;s in there.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Nothing is included because it sounds impressive. Everything is included because it
          directly explains something specific about how you feel.
        </p>

        <div className="f-tablewrap f-rise" style={{ marginTop: 22 }}>
          <table className="f-table">
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: 'left' }}>Marker</th>
                <th scope="col" style={{ textAlign: 'left' }}>What it measures</th>
                <th scope="col" style={{ textAlign: 'left' }}>Why it matters</th>
                <th scope="col">Included in</th>
              </tr>
            </thead>
            <tbody>
              {markerRows.map(({ id, name, measures, why, kit }) => (
                <tr key={id}>
                  <th scope="row">{name}</th>
                  <td style={{ textAlign: 'left' }}>{measures}</td>
                  <td style={{ textAlign: 'left' }}>{why}</td>
                  <td><span className="f-kchip">{kit}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="f-scrollhint f-blab" style={{ marginBottom: 0 }}>Scroll to see all columns &rarr;</p>

        <p className="f-sub" style={{ marginTop: 22 }}>
          These markers were chosen because they are the most clinically relevant indicators of the
          specific symptoms this cohort presents with: fatigue, slow recovery, low drive. We
          don&rsquo;t test 30 markers to make the panel look impressive. We test the{' '}
          {numberWord(markerRows.length)} that actually answer the question.
        </p>
      </FSection>

      {/* ---------- 07 · ON SUPPLEMENTS ---------- */}
      <FSection id="on-supplements">
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">On supplements</p>
            <h2 className="f-h2">
              We don&rsquo;t trust<br />supplements either.<br />
              <span className="f-grey">Unless there&rsquo;s a reason.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              We will not recommend a supplement unless your blood result shows a specific deficiency
              that it directly addresses. If your Vitamin D is fine, you will not see a Daily Stack
              recommendation. If your inflammation is mildly elevated but you don&rsquo;t have joint
              symptoms, you won&rsquo;t see a Collagen recommendation.
            </p>
            <p className="f-sub">
              Every ingredient in our supplements has an EFSA-approved health claim. That means the
              European Food Safety Authority has reviewed the evidence and confirmed the claim is
              substantiated. We use the exact approved language, nothing more.
            </p>
            <p className="f-sub">
              Our supplements do not diagnose, treat, or cure. They support normal physiological
              function where a deficiency has been confirmed. That is an important distinction and we
              will always be straight about it.
            </p>
            <p className="f-pull">
              We do not recommend supplements when there is nothing to address. If your results come
              back fully in range, your dashboard will say so. No product, no upsell. Come back in 6
              to 12 months for a retest.
            </p>
          </div>

          <div className="f-splitgrid f-onecol">
            <div className="f-tray" style={{ marginBottom: 0 }}>
              <div className="f-core">
                <p className="f-blab">Daily Stack</p>
                <p className="f-sub" style={{ fontSize: 15 }}>
                  Zinc, Active B12 (Methylcobalamin), Vitamin D3. Launching shortly. Join the
                  early-access list at any time.
                </p>
                <div className="f-well">
                  <p className="f-blab">EFSA-approved claims</p>
                  {/* 🔴 THREE APPROVED WORDINGS, VERBATIM. */}
                  <p className="f-sub" style={{ fontSize: 14.5 }}>
                    <b>Zinc:</b> &ldquo;Contributes to the maintenance of normal testosterone
                    levels.&rdquo;
                  </p>
                  <p className="f-sub" style={{ marginTop: 8, fontSize: 14.5 }}>
                    <b>Active B12:</b> &ldquo;Contributes to normal energy-yielding metabolism.&rdquo;
                  </p>
                  <p className="f-sub" style={{ marginTop: 8, fontSize: 14.5 }}>
                    <b>Vitamin D3:</b> &ldquo;Contributes to normal muscle function.&rdquo;
                  </p>
                </div>
                <div className="f-btns" style={{ marginTop: 18 }}>
                  <Link href="/supplements/daily-stack" className="f-btn f-btn-ghost f-btn-sm">
                    Read about Daily Stack {ARROW}
                  </Link>
                </div>
              </div>
            </div>

            <div className="f-tray" style={{ marginBottom: 0 }}>
              <div className="f-core">
                <p className="f-blab">Joint &amp; Recovery Collagen</p>
                <p className="f-sub" style={{ fontSize: 15 }}>
                  Hydrolysed collagen peptides plus Vitamin C. Launching shortly. Only recommended
                  when hs-CRP is elevated AND joint symptoms are present.
                </p>
                <div className="f-well">
                  <p className="f-blab">EFSA-approved claim</p>
                  <p className="f-sub" style={{ fontSize: 14.5 }}>
                    <b>Vitamin C:</b> &ldquo;Contributes to normal collagen formation for the normal
                    function of cartilage.&rdquo;
                  </p>
                </div>
                <div className="f-btns" style={{ marginTop: 18 }}>
                  <Link href="/supplements/collagen" className="f-btn f-btn-ghost f-btn-sm">
                    Read about Collagen {ARROW}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 08 · WHY THIS PRICE ----------
          🔴 THE PAGE'S ONE INVERTED PANEL, AND THE ANSWER INSIDE IT IS CA-026 C2
          RENDERED VERBATIM. It is also the string the FAQPage schema at the top of
          this file publishes, and both now read the same constant, so the rendered
          answer and the structured-data answer cannot drift apart. On the V2.0
          page they were two copies of one paragraph. */}
      <FSection id="why-this-price">
        <div className="f-invert f-rise">
          <p className="f-blab f-blab-lg f-invert-lab">Why this price</p>
          <h2 className="f-h2 f-invert-h" style={{ marginTop: 10 }}>
            Why do your tests cost more<br /><span style={{ opacity: 0.62 }}>than a £45 test?</span>
          </h2>
          <p className="f-sub f-invert-p" style={{ marginTop: 18 }}>{PRICE_ANSWER}</p>
        </div>
      </FSection>

      {/* ---------- CLOSE ----------
          ⚠ THE PRICE RANGE AND THE TURNAROUND ARE IMPORTED. They were "£99 to
          £179" and "2 to 5 working days" typed into this block; `KIT_PRICE_RANGE`
          and `SLA_COPY` are the values every other surface reads, and
          `lib/pricing.ts` carries a written warning beside the second that an
          hours-based SLA must never be advertised. */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">Ready to find out</p>
          <h2>Find out what your blood is telling you.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            {KIT_PRICE_RANGE}. Five minutes. Results in {SLA_COPY}. A UKAS ISO 15189-accredited lab.
            Plain English. A specific recommendation based on your actual numbers.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">
              See the tests {ARROW}
            </Link>
            <Link href="/test-selector" className="f-btn f-btn-ghost">
              Take the quiz first
            </Link>
          </div>
          <p className="f-fine" style={{ marginTop: 18 }}>
            No GP required. Discreet packaging. Supplement range launches shortly.
          </p>
        </FClose>
      </FSection>
    </FPage>
  )
}
