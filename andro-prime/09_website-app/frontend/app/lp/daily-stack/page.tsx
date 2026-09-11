import type { Metadata } from 'next'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

/**
 * /lp/daily-stack, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Frame AC in `lp-sample-F.html` draws the `/lp` SHELL and a variance table, and
 * says why it draws nothing else: *"drawing five asserts they should stay five,
 * drawing one asserts a template that does not exist"*. So the shell came from
 * the frame and this page's layout is decided against DESIGN.md, the same way
 * the ten marketing routes of 2026-09-09 were.
 *
 * EVERY WORD IS VERBATIM. The headline, the standfirst, both CTA labels, all
 * three ingredient blocks with their doses and their EFSA claim sentences, the
 * two problem paragraphs, the pull quote, all three "why these three" entries,
 * both attributed quotations, the three verification lines, the conflict-free
 * paragraph, all six FAQ answers, the waitlist paragraph and its three bullets
 * are byte-identical to the V2.0 page.
 *
 * 🔴 THE EFSA CLAIM SENTENCES KEEP THEIR QUOTATION MARKS. They are QUOTATIONS of
 * an approved third-party wording, not sentences this page wrote, and the V2.0
 * page rendered them quoted. Stripping the marks would turn an approved form of
 * words into our own claim about our own product, which is the distinction the
 * whole EFSA regime turns on. Same note as `/supplements/daily-stack`.
 *
 * 🔴 THE PAGE STILL SELLS NOTHING, AND THAT IS A COMPLIANCE POSITION RATHER THAN
 * A GAP. Supplements were deferred by `01_strategy/2026-05-23-phase0-supplements-
 * deferred-plan.md` (approved, Keith): sourcing is incomplete, the live Stripe
 * price IDs are deliberately unset, and every "buy" CTA on the site was replaced
 * with a non-cash waitlist opt-in. Two of the six FAQ answers say so outright.
 * The rebuild changes the container and not that.
 *
 * 🔴 NO PRODUCT PHOTOGRAPH AND NO PORTRAIT OF DR EWA. The Daily Stack does not
 * exist yet, so a rendered tub would be a picture of a product nobody has made on
 * a page whose position is that no orders are being taken; and a generated
 * photograph presented as a named GMC-registered GP would be a fabricated record
 * of a real person. She is `.f-initials`, as on `/how-it-works`, `/about` and
 * `/supplements/daily-stack`.
 *
 * ⚠ THE EYEBROW SPLITS, which is the one furniture change. `Supplement // Daily
 * Stack // Launching Shortly` becomes `.f-eyebrow` "Daily Stack" beside
 * `.f-kchip` "Launching shortly": the double slash is a V2.0 device and Direction
 * F allows one eyebrow per page. Registered for `/supplements/*` as row 38(c) and
 * this is the same change on the same words.
 *
 * ⚠ THE FAQ IS AN OPEN GRID, NOT `FaqAccordion`. Keith standardised that on
 * 2026-08-29 and `/contact` carried it into the rebuild on 2026-09-09: four short
 * answers behind four clicks, on a page whose whole job is to answer objections
 * before a cold reader leaves, is the accordion working against the page. No
 * answer text changed.
 *
 * ⚠ WHERE THIS PAGE SPENDS ITS ONE INVERTED PANEL: section 02, clinical
 * oversight. Same subject and same treatment as `/supplements/daily-stack`, which
 * is the constraint working rather than a duplication: it is one per PAGE, and on
 * a page describing a formulation the clinical sign-off is the conformity
 * statement.
 */

const BASE_URL = 'https://andro-prime.com'

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Daily Stack', item: `${BASE_URL}/lp/daily-stack` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'When will the Daily Stack be available?',
          acceptedAnswer: { '@type': 'Answer', text: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
        },
        {
          '@type': 'Question',
          name: 'Is the Daily Stack on sale right now?',
          acceptedAnswer: { '@type': 'Answer', text: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
        },
        {
          '@type': 'Question',
          name: 'What will I get for joining the waitlist?',
          acceptedAnswer: { '@type': 'Answer', text: 'Early dispatch when stock arrives, and we email you when it launches. No payment is taken to join.' },
        },
        {
          '@type': 'Question',
          name: 'Can I take this without doing a blood test first?',
          acceptedAnswer: { '@type': 'Answer', text: "Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know what you actually need, and how you know it is working at retest. We always recommend testing first." },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Best Vitamins for Men UK | Daily Stack',
  description: 'Zinc, Active B12 (Methylcobalamin), and Vitamin D3 in one daily product. EFSA-approved claims, no proprietary blends. Launching shortly. Join the waitlist for early dispatch, and we will email you when it launches.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Best Vitamins for Men UK | Daily Stack | Andro Prime',
    description: 'Three active ingredients most men over 35 are missing, in one daily product. Zinc, Active B12, and Vitamin D3. Launching shortly. Join the waitlist.',
    url: 'https://andro-prime.com/lp/daily-stack',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Daily Stack supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Vitamins for Men UK | Daily Stack | Andro Prime',
    description: 'Zinc, Active B12, and Vitamin D3. EFSA-approved claims. Launching shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const FORMULATION = [
  { name: 'Zinc', dose: '25mg', claim: 'Contributes to the maintenance of normal testosterone levels' },
  { name: 'Vitamin D3', dose: '4,000 IU', claim: 'Contributes to normal muscle function' },
  { name: 'Active B12', dose: '1,000mcg', claim: 'Contributes to normal energy-yielding metabolism' },
]

const WHY_THESE_THREE = [
  { marker: 'Zinc (25mg)', body: 'Most men in the UK are borderline low. Zinc contributes to the maintenance of normal testosterone levels (EFSA-approved claim).' },
  { marker: 'Vitamin D3 (4,000 IU)', body: 'Over 40% of UK adults are low in winter. Vitamin D3 contributes to normal muscle function (EFSA-approved claim).' },
  { marker: 'Active B12 (1,000mcg Methylcobalamin)', body: 'Contributes to normal energy-yielding metabolism and to normal psychological function. Particularly relevant for men over 40. Methylcobalamin is the form your body absorbs directly, not the cheaper synthetic cyanocobalamin.' },
]

const VERIFICATION = ['Reviewed by a GMC-registered GP', 'UKAS ISO 15189 Lab', 'EFSA Compliant Dosage']

const FAQ_ITEMS = [
  { question: 'When will the Daily Stack be available?', answer: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { question: 'Is the Daily Stack on sale right now?', answer: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { question: 'What will I get for joining the waitlist?', answer: 'Early dispatch when stock arrives, and we email you when it launches. No payment is taken to join.' },
  { question: 'Can I take this without doing a blood test first?', answer: "Yes. Every ingredient has an EFSA-approved health claim and is safe at these doses for healthy adults. But the blood test is how you know what you actually need, and how you know it is working at retest. We always recommend testing first." },
  { question: 'What form of B12 will be used?', answer: "Methylcobalamin: the active form your body absorbs directly. Most supplements use cyanocobalamin, a cheaper synthetic form that requires conversion before use. We will use Methylcobalamin at 1,000mcg." },
  { question: 'Why no iron?', answer: "Iron supplementation without medical supervision carries a toxicity risk. If your Ferritin came back low, your results report will recommend dietary changes and, if very low, a GP referral. We do not include iron in any of our supplements." },
]

export default function DailyStackLpPage() {
  return (
    <FPage>
      <JsonLd data={lpSchema} />

      <FHero
        aside={
          /* THE FORMULATION CARD. A tray holding a core, which under the
             containment ruling is what a card is for: three derived rows with
             doses and approved claim sentences is an instrument, not prose. */
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Formulation</p>
              <h2 className="f-h4" style={{ marginTop: 10, marginBottom: 4 }}>Daily Stack</h2>
              <div className="f-spec" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
                {FORMULATION.map(({ name, dose, claim }) => (
                  <div key={name}>
                    <span className="f-spec-k">
                      {name} &middot; {dose}
                    </span>
                    <span className="f-spec-v" style={{ fontWeight: 400 }}>
                      &ldquo;{claim}&rdquo;
                    </span>
                    <span className="f-blab" style={{ marginTop: 8, marginBottom: 0 }}>EFSA claim</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Daily Stack</span>
          <span className="f-kchip">Launching shortly</span>
        </div>
        {/* ⚠ THREE LINES, AND THE BREAKS ARE MEASURED RATHER THAN GUESSED. The
            first attempt broke after "which", which reads correctly in source and
            rendered as three lines with "need." alone on the last one: the hero's
            left column is about 640px here because the formulation card takes the
            right, so `.f-h1` at 65.6px fits roughly 20 characters. "supplements
            you need." is 21 and wrapped. Breaking at 13 / 17 / 9 puts a whole
            phrase on every line. STATE.md's trap list: a heading's line breaks
            are invisible in source and only a render shows the orphan. */}
        <h1 className="f-h1">
          Stop guessing<br />which supplements<br /><span className="f-grey">you need.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          The three things most men over 35 are genuinely low in, in one daily product. Zinc, Active B12, and Vitamin D3. Each at a dose that actually moves the needle. Each backed by EFSA-approved health claims. Launching shortly. Join the waitlist for early dispatch, and we will email you when it launches.
        </p>
        <div className="f-btns" style={{ marginTop: 24 }}>
          <a href="#join" className="f-btn">
            Join the waitlist {ARROW}
          </a>
          <span className="f-kchip">No payment. No commitment.</span>
        </div>
      </FHero>

      {/* ---------- 01 · THE PROBLEM ---------- */}
      <FSection>
        <p className="f-blab">The problem</p>
        <div className="f-splitgrid f-rise" style={{ marginTop: 12 }}>
          <div>
            <h2 className="f-h2">
              Most supplement stacks<br /><span className="f-grey">are built on guesswork.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              You are taking five different pills from three different brands that some influencer recommended. You do not know the doses. You do not know if they are working. You do not know if you need them.
            </p>
            <p className="f-sub" style={{ marginTop: 14 }}>
              We are building this stack differently. It contains the three supplements most commonly flagged as low in our blood test data, at the doses backed by EFSA-approved health claims.
            </p>
            <p className="f-pull">
              This is not a random multivitamin. It is what your blood test would actually recommend.
            </p>

            {/* The founder quotation, which is a problem statement and sits with
                the problem rather than with the clinical sign-off. The V2.0 page
                paired it with Dr Ewa's in one two-column block; splitting them
                is what lets the clinical one take the inverted panel alone. */}
            <div className="f-quotecard" style={{ marginTop: 26 }}>
              <div className="f-quotehead">
                <span className="f-initials">KA</span>
                <div>
                  <strong>Keith Antony</strong>
                  <span className="f-blab" style={{ marginBottom: 0 }}>Founder, Andro Prime</span>
                </div>
              </div>
              <blockquote>
                &ldquo;I was spending &pound;60 a month on five different bottles. Then I got my blood tested and found out I was actually low in just two things. That is when I decided we needed to build something better.&rdquo;
              </blockquote>
            </div>
          </div>

          <div>
            <p className="f-blab">Why these three</p>
            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 6 }}>
              {WHY_THESE_THREE.map(({ marker, body }) => (
                <div className="f-bio" key={marker}>
                  <h3>{marker}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · CLINICAL OVERSIGHT ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. Dr Ewa's quotation is verbatim. */}
      <FSection>
        <div className="f-invert f-rise">
          <div className="f-splitgrid">
            <div>
              <p className="f-blab f-invert-lab">Clinical oversight</p>
              <h2 className="f-h2 f-invert-h">
                Every ingredient has<br />
                <span style={{ opacity: 0.62 }}>a reason to be there.</span>
              </h2>
              <div style={{ marginTop: 20 }}>
                <p className="f-blab f-invert-lab" style={{ marginBottom: 10 }}>Verification</p>
                {VERIFICATION.map((v) => (
                  <p className="f-sub f-invert-p" key={v} style={{ marginTop: 6 }}>{v}</p>
                ))}
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
                &ldquo;Every ingredient in this formulation has a specific, evidence-based reason for being included at its specific dose. We do not add ingredients for marketing purposes.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* The conflict-free paragraph. Approved standing copy, carried verbatim
            and left OUTSIDE the panel: it is an argument rather than a
            conformity statement, and prose takes no container. */}
        <p className="f-sub f-rise" style={{ marginTop: 26 }}>
          Testing and selling are kept apart at Andro Prime. You pay one price for the test. Any result that needs a doctor, low testosterone included, goes to a GP, and those results earn us nothing.
        </p>
      </FSection>

      {/* ---------- 03 · COMMON QUESTIONS ---------- */}
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
      </FSection>

      {/* ---------- THE WAITLIST ----------
          `rule={false}`: this is the page's ask, not a topic in its argument, and
          the section counter is a position indicator for a document. The hero CTA
          targets `#join`, which is why the id is on the section. */}
      <FSection narrow rule={false} cont id="join">
        <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
          <div className="f-core">
            <p className="f-blab">Waitlist</p>
            <h2 className="f-h2" style={{ marginTop: 10 }}>Daily Stack</h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              Launching shortly, as soon as our manufacturing partner is confirmed.
            </p>
            <p className="f-sub" style={{ marginTop: 14, marginBottom: 6 }}>Waitlist members get:</p>
            <div className="f-bios" style={{ gridTemplateColumns: '1fr' }}>
              <div className="f-bio"><p>Early dispatch ahead of public launch.</p></div>
              <div className="f-bio"><p>We email you the moment it launches.</p></div>
              <div className="f-bio"><p>No payment, no commitment to join.</p></div>
            </div>
            <div style={{ marginTop: 22 }}>
              <SupplementWaitlistForm interestedInProduct="daily-stack" variant="f" />
            </div>
          </div>
        </div>
      </FSection>
    </FPage>
  )
}
