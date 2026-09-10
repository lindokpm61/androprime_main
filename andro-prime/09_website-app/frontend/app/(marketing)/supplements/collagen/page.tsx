import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'

/**
 * /supplements/collagen, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM, including the four ingredient blocks with their doses,
 * the Vitamin C EFSA claim, Dr Ewa's quotation with its qualifier, and all five
 * FAQ answers. Only the section labels the F grammar requires are new.
 *
 * 🔴 THE hs-CRP > 10 ANSWER KEEPS ITS EMPHASIS, AND THAT IS A SAFETY DECISION
 * RATHER THAN A LAYOUT ONE. *"If your hs-CRP is above 10 mg/L, we will not
 * recommend a supplement. That level of inflammation needs a GP."* The V2.0 page
 * marked it with a 12px left rule while its four siblings had none, so the
 * emphasis is carried across rather than invented; it is now `.f-nudge`, this
 * system's 2px pointing rule. This is the same class of finding as register row
 * 37, where a GP-referral instruction was measured at 2.39:1 and treated as a
 * safety issue before a design one. A GP-block statement that reads with the same
 * weight as "what will I get for joining the waitlist" has been de-emphasised by
 * a restyle, which is not a restyle's decision to make.
 *
 * ⚠ `.f-nudge` NOT `.f-err` AND NOT THE STATUS TRIAD. The 2026-09-03 saturation
 * ruling is explicit that red is reserved for the GP-block state INSIDE a results
 * panel, and that *"decorative red anywhere near health copy collides with that
 * meaning and carries ASA risk"*. This is a marketing page describing the rule,
 * not a panel executing it, so it takes the marketing emphasis and no colour.
 *
 * ⚠ FOUR INGREDIENTS TAKE `.f-steps`, WHERE `/supplements/daily-stack`'S THREE
 * TAKE `.f-bios`. Same grammar, same treatment (a rule above and nothing else),
 * different column count, because `.f-steps` turns to four columns above 1040px
 * and `.f-bios` to three. Matching the grid to the item count is what the system
 * provides both for; forcing one grid on both would leave one page with an empty
 * cell or an orphan on its own row.
 *
 * 🔴 NO PRODUCT PHOTOGRAPH AND NO PORTRAIT OF DR EWA. See
 * `/supplements/daily-stack` for both, and the same reasons: the product does not
 * exist yet, and a generated photograph presented as a named GMC-registered GP is
 * a fabricated record of a real person.
 */

const BASE_URL = 'https://andro-prime.com'

const collagenSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${BASE_URL}/supplements` },
        { '@type': 'ListItem', position: 3, name: 'Joint & Recovery Collagen', item: `${BASE_URL}/supplements/collagen` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Collagen for Men',
  description: 'Collagen for men. 10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Launching shortly. Join the waitlist.',
  alternates: { canonical: `${BASE_URL}/supplements/collagen` },
  openGraph: {
    title: 'Collagen for Men | Andro Prime',
    description: 'Collagen for men. 10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Launching shortly. Join the waitlist.',
    url: `${BASE_URL}/supplements/collagen`,
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Collagen for men: Andro Prime Joint & Recovery supplement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collagen for Men | Andro Prime',
    description: 'Collagen for men. 10g hydrolysed collagen peptides, UC-II, Vitamin C and MSM. Launching shortly.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Verbatim, all four. Only Vitamin C carries an EFSA claim, which is why the
   `claim` field is optional and the page never labels the other three as having
   one. */
const ingredients = [
  {
    num: '01',
    name: 'Hydrolysed Bovine Collagen Peptides (Type I & III)',
    dose: '10g',
    why: 'The building blocks your joints, tendons, and connective tissue are made from. Hydrolysed for absorption. 10g is the researched dose, not the 2 to 3g you get in most capsule products.',
  },
  {
    num: '02',
    name: 'UC-II Undenatured Type II Collagen',
    dose: '40mg',
    why: 'A different form of collagen to standard hydrolysed peptides. UC-II is undenatured Type II collagen, the form found in joint cartilage. 40mg is the researched dose.',
  },
  {
    num: '03',
    name: 'Vitamin C',
    dose: '80mg',
    claim: 'Contributes to normal collagen formation for the normal function of cartilage.',
    why: 'Your body cannot make collagen without vitamin C. This is not an optional add-on. It is the ingredient that makes the collagen in this product actually useful.',
  },
  {
    num: '04',
    name: 'MSM',
    dose: '500mg',
    why: 'Supports joint comfort and mobility. Works alongside collagen to support your recovery.',
  },
]

/* Verbatim, all five. `flag` marks the GP-block answer; see the header. */
const faqItems = [
  { q: 'When will Joint and Recovery Collagen be available?', a: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { q: 'Is this on sale right now?', a: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { q: 'What will I get for joining the waitlist?', a: 'Early dispatch when stock arrives, and we email you when it launches. No payment is taken to join.' },
  { q: 'Can I take this without doing a blood test first?', a: 'Yes, every ingredient is safe for healthy adults at these doses. But this product is most useful when you have confirmed inflammation. The blood test tells you whether it is the right product for you, or whether your joint issues have a different cause.' },
  { q: 'What if my hs-CRP is above 10?', a: 'If your hs-CRP is above 10 mg/L, we will not recommend a supplement. That level of inflammation needs a GP. Your results report will say this clearly and provide a GP referral template.', flag: true },
]

const facts = [
  { label: 'EFSA-approved', sub: 'The Vitamin C claim on this page' },
  { label: 'GMC-registered', sub: 'A GP reviewed the formulation' },
  { label: 'Coming soon', sub: 'Manufacturing partner pending' },
  { label: 'No pre-order', sub: 'No payment is taken to join' },
]

export default function CollagenPage() {
  return (
    <FPage>
      <JsonLd data={collagenSchema} />

      {/* ---------- HERO ---------- */}
      <FHero
        aside={
          <div id="join">
            <SupplementWaitlistForm interestedInProduct="collagen" variant="f" />
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Joint &amp; Recovery Collagen</span>
          <span className="f-kchip">Launching shortly</span>
        </div>
        <h1 className="f-h1">
          Your inflammation<br />marker is elevated.<br />
          <span className="f-grey">Your joints<br />already knew.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Collagen for men: 10g hydrolysed collagen peptides, UC-II for joint-specific support,
          Vitamin C, and MSM. Built for active men whose blood data confirmed elevated inflammation,
          and who report joint symptoms. Launching shortly. Join the waitlist for early dispatch, and
          we will email you when it launches.
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

      {/* ---------- 01 · THE REALITY ---------- */}
      <FSection>
        <p className="f-blab">The reality</p>
        {/* ⚠ THE BREAK IS AFTER "slowing", NOT AFTER "down". Written as one line
            plus the grey clause, the first part wrapped naturally at the measure
            and left "down" alone on its own line above the break. Same words,
            placed so all three lines carry weight. Caught by screenshot: a
            heading's line breaks are invisible in source. */}
        <h2 className="f-h2">
          Your joints are slowing<br />you down<br />
          <span className="f-grey">and rest is not fixing it.</span>
        </h2>
        <div className="f-plain" style={{ marginTop: 4 }}>
          <p className="f-sub">
            You are stiff in the morning. Your knees ache after every session. Recovery takes longer
            than it used to, and the soreness hangs around for days.
          </p>
          <p className="f-sub">
            You are not injured. You are dealing with low-grade inflammation that your body cannot
            clear on its own.
          </p>
          <p className="f-pull">
            Your blood test can confirm it. If your hs-CRP marker is elevated, that means your body
            is in a state of repair it cannot keep up with.
          </p>
        </div>
      </FSection>

      {/* ---------- 02 · THE FORMULATION ----------
          `.f-steps` because there are four. See the header for why this differs
          from `/supplements/daily-stack`'s three. The dose sits in the step's own
          meta row, which is the pair `.f-step-foot` exists for. */}
      <FSection cont>
        <p className="f-blab">The formulation</p>
        <h2 className="f-h2">
          Collagen for men.<br /><span className="f-grey">Not a generic powder.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Targeted joint and recovery support. Every ingredient is here because it directly supports
          connective tissue, joint comfort, and recovery in men with confirmed inflammation.
        </p>

        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {ingredients.map(({ num, name, dose, claim, why }) => (
            <div className="f-step" key={num}>
              <span className="f-no">Component {num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{name}</h3>
              {claim ? (
                <>
                  <p className="f-spec-k">EFSA-approved claim</p>
                  <p className="f-sub" style={{ marginTop: 6, marginBottom: 12, fontSize: 14.5 }}>{claim}</p>
                </>
              ) : null}
              <p className="f-sub" style={{ fontSize: 15 }}>{why}</p>
              <div className="f-step-foot">
                <span>Dose</span>
                <b>{dose}</b>
              </div>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 03 · CLINICAL OVERSIGHT ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. The quotation is verbatim, including
          the qualifier sentence, which is the load-bearing part: it says who this
          product is NOT for. */}
      <FSection>
        <div className="f-invert f-rise">
          <div className="f-splitgrid">
            <div>
              <p className="f-blab f-invert-lab">Clinical oversight</p>
              <h2 className="f-h2 f-invert-h">
                Recommended on your results.<br />
                <span style={{ opacity: 0.62 }}>Not on a hunch.</span>
              </h2>
              <p className="f-sub f-invert-p" style={{ marginTop: 16 }}>
                Dr Ewa Lindo is a GMC-registered GP and the clinical lead at Andro Prime. The
                qualifier in her note below is the whole of the position: elevated hs-CRP on its own
                is not what this product answers.
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
                &ldquo;I only recommend this product for men whose blood data shows elevated hs-CRP
                and who report joint symptoms. That qualifier matters. Elevated CRP alone could
                indicate many things. Combined with joint complaints in active men, collagen and
                vitamin C supplementation is a reasonable, evidence-based starting point.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 04 · THE WAITLIST ---------- */}
      <FSection id="pricing">
        <p className="f-blab">The waitlist</p>
        <h2 className="f-h2">Be first when it ships.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          We are not taking supplement orders or payments today. Join the waitlist and we will email
          you the moment the Joint and Recovery Collagen is ready to ship. Waitlist members get early
          dispatch ahead of the public launch.
        </p>
        <div className="f-rise" style={{ marginTop: 22, maxWidth: 560 }}>
          <SupplementWaitlistForm interestedInProduct="collagen" variant="f" />
        </div>
      </FSection>

      {/* ---------- 05 · COMMON QUESTIONS ---------- */}
      <FSection>
        <p className="f-blab">Common questions</p>
        <h2 className="f-h2">Frequently asked.</h2>
        <div className="f-faqgrid f-rise" style={{ marginTop: 22 }}>
          {faqItems.map(({ q, a, flag }) => (
            <div key={q}>
              <h3>{q}</h3>
              {/* The GP-block answer keeps the emphasis the V2.0 page gave it.
                  See the header: this is a safety decision, not a layout one. */}
              <p className={flag ? 'f-nudge' : undefined}>{a}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- RELATED READING ---------- */}
      <RelatedArticles
        slugs={['inflammatory-markers-blood-test', 'crp-blood-test']}
        limit={2}
        intro="Understand the inflammation markers behind joint and recovery issues."
        variant="f"
      />

      {/* ---------- CLOSE ---------- */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">The other route</p>
          <h2>Low energy or recovery issues too?</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            The Daily Stack launches alongside the Joint and Recovery Collagen.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/supplements/daily-stack" className="f-btn">
              Read about the Daily Stack {ARROW}
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
