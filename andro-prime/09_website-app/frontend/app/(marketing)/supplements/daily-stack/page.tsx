import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'

/**
 * /supplements/daily-stack, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM. The headline, standfirst, the three "reality"
 * paragraphs, all three ingredient blocks with their doses and their EFSA
 * claims, Dr Ewa's quotation, the waitlist paragraph and all five FAQ answers
 * are byte-identical to the V2.0 page. The changes are the section labels the F
 * grammar requires and the eyebrow split (see `/supplements`).
 *
 * 🔴 THE THREE EFSA CLAIM SENTENCES CARRY THEIR OWN QUOTE MARKS IN THE SOURCE
 * DATA AND THEY STAY. `'"Contributes to the maintenance of normal testosterone
 * levels."'` is stored with its quotation marks because it is a QUOTATION of an
 * approved wording rather than a sentence this page wrote, and the V2.0 page
 * rendered them. Stripping them would make an approved third-party form of words
 * read as our own claim about our own product, which is the distinction the
 * whole EFSA regime turns on.
 *
 * 🔴 NO PRODUCT PHOTOGRAPH. The Daily Stack does not exist yet: the page says so
 * five times, and the waitlist exists because a manufacturing partner is not yet
 * confirmed. A generated image of a tub or a capsule would be a picture of a
 * product nobody has made, on a page whose compliance position is that no orders
 * are being taken. See `/supplements` for the same note and the `PRODUCT.md`
 * rule behind it.
 *
 * 🔴 NO PORTRAIT OF DR EWA, for the reason `/about` and `/contact` record: a
 * generated photograph presented as a named GMC-registered GP is a fabricated
 * record of a real person. She is `.f-initials`, which is what
 * `/how-it-works` already does on the identical block.
 *
 * ⚠ WHERE THIS PAGE SPENDS ITS ONE INVERTED PANEL: section 03, clinical
 * oversight. Same subject and same treatment as `/how-it-works`, which is
 * deliberate rather than duplicated: the constraint is one per PAGE, and on a
 * page selling a formulation the clinical sign-off is the conformity statement.
 */

const BASE_URL = 'https://andro-prime.com'

const dailyStackSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${BASE_URL}/supplements` },
        { '@type': 'ListItem', position: 3, name: 'Daily Stack', item: `${BASE_URL}/supplements/daily-stack` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Men\'s Multivitamin: Zinc, B12 & Vitamin D3',
  description: 'A men\'s multivitamin built around blood data: Zinc, Active B12, and Vitamin D3 in one daily product. EFSA-approved claims. Join the waitlist.',
  alternates: { canonical: `${BASE_URL}/supplements/daily-stack` },
  openGraph: {
    title: 'Men\'s Multivitamin: Daily Stack | Andro Prime',
    description: 'A men\'s multivitamin built around blood data: Zinc, Active B12, and Vitamin D3 in one daily product. Launching shortly. Join the waitlist.',
    url: `${BASE_URL}/supplements/daily-stack`,
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Men\'s multivitamin: Andro Prime Daily Stack' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Men\'s Multivitamin: Daily Stack | Andro Prime',
    description: 'A men\'s multivitamin built around blood data: Zinc, Active B12, and Vitamin D3 in one daily product. Launching shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Verbatim, quotation marks included. See the header. */
const ingredients = [
  {
    name: 'Zinc',
    num: '01',
    dose: '25mg',
    claim: '"Contributes to the maintenance of normal testosterone levels."',
    why: 'Most UK men do not get enough from diet alone, especially if you train hard.',
  },
  {
    name: 'Vitamin D3',
    num: '02',
    dose: '4,000 IU',
    claim: '"Contributes to normal muscle function."',
    why: 'If your blood test showed low Vitamin D, this is the dose most research supports for correction. Between October and March, sunlight alone will not get you there.',
  },
  {
    name: 'Active B12',
    num: '03',
    dose: '1,000mcg',
    doseSub: 'Methylcobalamin',
    claim: '"Contributes to normal energy-yielding metabolism."',
    why: 'Methylcobalamin is the active form your body absorbs directly. Most B12 supplements use cyanocobalamin, a cheaper synthetic form. If your Kit 2 or Kit 3 result flagged low Active B12, this addresses it directly.',
  },
]

/* Verbatim, all five. */
const faqItems = [
  { q: 'When will the Daily Stack be available?', a: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { q: 'Is the Daily Stack on sale right now?', a: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { q: 'What will I get for joining the waitlist?', a: 'Early dispatch when stock arrives, and we email you when it launches. No payment is taken to join.' },
  { q: 'Can I take this without doing a blood test first?', a: 'Yes, every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know what you actually need, and how you know it is working at retest. We always recommend testing first.' },
  { q: 'Why no iron?', a: 'Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We do not include iron in any of our supplements.' },
]

/* The four hero facts, verbatim, in the row `/membership` and `/about` use.
   `.f-trust-l` uppercases, which is why each label is short and each qualifier
   sits in the sub, where it is not uppercased. */
const facts = [
  { label: 'EFSA-approved', sub: 'Every claim on this page' },
  { label: 'GMC-registered', sub: 'A GP reviewed the formulation' },
  { label: 'Coming soon', sub: 'Manufacturing partner pending' },
  { label: 'No pre-order', sub: 'No payment is taken to join' },
]

export default function DailyStackPage() {
  return (
    <FPage>
      <JsonLd data={dailyStackSchema} />

      {/* ---------- HERO ---------- */}
      <FHero
        aside={
          <div id="join">
            <SupplementWaitlistForm interestedInProduct="daily-stack" variant="f" />
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Daily Stack</span>
          <span className="f-kchip">Launching shortly</span>
        </div>
        {/* ⚠ EVERY BREAK IS EXPLICIT, AND THE BUDGET IS ABOUT 20 CHARACTERS.
            `.f-h1` clamps to 65.6px and the hero's left column is ~650px at 1440,
            so a line longer than that wraps and leaves an orphan: written with one
            break this rendered as "Your blood test told / you" and "This is built
            to fill the / gaps." Same words, four deliberate lines. Heading breaks
            are invisible in source and only a render shows them. */}
        <h1 className="f-h1">
          Your blood test told<br />you what is missing.<br />
          <span className="f-grey">This is built<br />to fill the gaps.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          A men&rsquo;s multivitamin built around what your blood data actually shows: Zinc, Active
          B12, and Vitamin D3 in one daily product. Dosed properly. No fillers. Launching shortly.
          Join the waitlist for early dispatch, and we will email you when it launches.
        </p>
      </FHero>

      <section className="f-wrap">
        <div className="f-trustrow">
          {facts.map(({ label, sub }) => (
            <div key={label}>
              <span className="f-trust-l">{label}</span>
              <span className="f-trust-s">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 01 · THE REALITY ----------
          Uncontained prose. The V2.0 page put the closing line in a grey box with
          a 6px left rule; `.f-pull` is this system's version of that device and
          the words are unchanged. */}
      <FSection>
        <p className="f-blab">The reality</p>
        <h2 className="f-h2">
          You are already supplementing.<br />
          <span className="f-grey">You are probably guessing.</span>
        </h2>
        <div className="f-plain" style={{ marginTop: 4 }}>
          <p className="f-sub">
            Most men buy supplements based on a blog post, a mate&rsquo;s recommendation, or whatever
            is on offer at the supermarket. They do not know what they are actually low in.
          </p>
          <p className="f-sub">
            They take too much of some things and not enough of others. That is money wasted on pills
            that are not doing anything.
          </p>
          <p className="f-pull">
            Your blood test changes that. You know exactly what is low. The Daily Stack is built
            around what your results showed.
          </p>
        </div>
      </FSection>

      {/* ---------- 02 · THE FORMULATION ----------
          ⚠ `.f-bios` AND NOT A GRID OF CARDS. Three ingredient descriptions are
          prose with a number attached, and the containment ruling of 2026-09-02
          is explicit that a card holds a transaction or an instrument and prose
          gets neither. The dose takes `.f-price`, which is the system's large
          value face and already carries `tabular-nums`, so 25mg / 4,000 IU /
          1,000mcg align down the row rather than shuffling. */}
      <FSection cont>
        <p className="f-blab">The formulation</p>
        <h2 className="f-h2">
          A men&rsquo;s multivitamin,<br /><span className="f-grey">done properly.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Three active ingredients, each backed by an EFSA-approved health claim. Nothing
          unnecessary. No proprietary blend hiding cheap fillers. Every ingredient is here because
          blood data says it is the gap that matters.
        </p>

        <div className="f-bios f-rise" style={{ marginTop: 24 }}>
          {ingredients.map(({ name, num, dose, doseSub, claim, why }) => (
            <div className="f-bio" key={num}>
              <p className="f-blab">Component {num}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <h3 style={{ margin: 0 }}>{name}</h3>
                <span className="f-price" style={{ fontSize: '1.35rem', flex: 'none' }}>{dose}</span>
              </div>
              {doseSub ? <p className="f-spec-k" style={{ marginTop: 6 }}>{doseSub}</p> : null}

              {/* ⚠ NO `.f-well` HERE, THOUGH `/supplements` USES ONE FOR THE SAME
                  SENTENCE. `.f-well` is a `--sunk` ground *inside a `.f-core`*,
                  which is what that page has and this one does not: these
                  ingredient blocks are uncontained under the containment ruling,
                  so a well would be a recessed box floating on bare paper with
                  nothing to be recessed into. The mono key is the boundary
                  instead, which is exactly how `.f-spec` marks a key and its
                  value, and it is the same device the "Why it is here" pair below
                  uses. */}
              <p className="f-spec-k" style={{ marginTop: 18 }}>EFSA-approved claim</p>
              <p className="f-sub" style={{ marginTop: 6, fontSize: 14.5 }}>{claim}</p>

              <p className="f-spec-k" style={{ marginTop: 18 }}>Why it is here</p>
              <p style={{ marginTop: 6 }}>{why}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 03 · CLINICAL OVERSIGHT ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. Dr Ewa's quotation is verbatim. */}
      <FSection>
        <div className="f-invert f-rise">
          <div className="f-splitgrid">
            <div>
              <p className="f-blab f-invert-lab">Clinical oversight</p>
              <h2 className="f-h2 f-invert-h">
                Formulated with clinical input.<br />
                <span style={{ opacity: 0.62 }}>Not a marketing department.</span>
              </h2>
              <p className="f-sub f-invert-p" style={{ marginTop: 16 }}>
                Dr Ewa Lindo is a GMC-registered GP and the clinical lead at Andro Prime. She
                reviewed this formulation against the biomarkers the kits measure, which is the same
                review every results report goes through before it reaches a customer.
              </p>
            </div>

            <div className="f-quotecard">
              <div className="f-quotehead">
                <span className="f-initials">EL</span>
                <div>
                  <strong>Dr Ewa Lindo</strong>
                  <span className="f-blab" style={{ marginBottom: 0 }}>Medical Director, GMC Registered</span>
                </div>
              </div>
              <blockquote>
                &ldquo;I reviewed this formulation against the biomarkers we test in our kits. The
                doses are evidence-based, the forms are bioavailable, and every claim is
                EFSA-approved. If your results show a deficiency, this is what I would
                recommend.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 04 · THE WAITLIST ---------- */}
      <FSection id="order">
        <p className="f-blab">The waitlist</p>
        <h2 className="f-h2">Be first when it ships.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          We are not taking supplement orders or payments today. Join the waitlist and we will email
          you the moment the Daily Stack is ready to ship. Waitlist members get early dispatch ahead
          of the public launch.
        </p>
        <div className="f-rise" style={{ marginTop: 22, maxWidth: 560 }}>
          <SupplementWaitlistForm interestedInProduct="daily-stack" variant="f" />
        </div>
      </FSection>

      {/* ---------- 05 · COMMON QUESTIONS ---------- */}
      <FSection>
        <p className="f-blab">Common questions</p>
        <h2 className="f-h2">Frequently asked.</h2>
        <div className="f-faqgrid f-rise" style={{ marginTop: 22 }}>
          {faqItems.map(({ q, a }) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- RELATED READING ----------
          `variant="f"` since 2026-09-06. Without it this component renders the
          blog's own editorial language (hard borders, uppercase black sans) on a
          Direction F page, which is the seam gap 4 in DESIGN.md records. */}
      <RelatedArticles
        slugs={['low-vitamin-d-symptoms', '14-signs-of-vitamin-d-deficiency']}
        limit={2}
        intro="What low vitamin D and B12 actually do, and why testing first beats guessing."
        variant="f"
      />

      {/* ---------- CLOSE ---------- */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">The other route</p>
          <h2>Joint pain or elevated inflammation too?</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            The Joint and Recovery Collagen launches alongside the Daily Stack.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/supplements/collagen" className="f-btn">
              Read about the Collagen {ARROW}
            </Link>
            <Link href="/kits" className="f-btn f-btn-ghost">
              Test first
            </Link>
          </div>
        </FClose>
      </FSection>
    </FPage>
  )
}
