import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

/**
 * /supplement-waitlist, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM, INCLUDING ALL SIX FAQ ANSWERS AND BOTH EFSA CLAIM
 * SENTENCES. This page carries more regulated language per line than any other
 * in this batch: the three Daily Stack claims and the one Vitamin C claim are
 * EFSA-approved wordings and are reproduced exactly, and the four "no payment,
 * no commitment, no orders being taken" statements are the Phase 0a boundary
 * that keeps a waitlist from reading as a pre-order. Only the section labels
 * required by the F grammar are new.
 *
 * 🔴 A COPY DEFECT IS RENDERED HERE UNCHANGED AND IT IS NOT MINE TO FIX. FAQ 4
 * answers *"Can I choose which product I want updates about?"* with *"Yes. The
 * form lets you tell us whether you are interested in the Daily Stack, the Joint
 * and Recovery Collagen, or both. You can change your mind later."* THE FORM ON
 * THIS PAGE HAS NO SUCH CONTROL and never has: it renders
 * `interestedInProduct="any"` and the component forwards that as a hidden field.
 * The claim reads as true because `/supplements/daily-stack` and
 * `/supplements/collagen` pass real values, so the FIELD exists in the payload
 * while the CONTROL does not. Either the control gets built or the answer gets
 * rewritten, and both are copy decisions with their own pre-flight rather than
 * something a restyle may take. Registered as row 38; logged as OBS-670.
 *
 * ⚠ THE HERO ASIDE IS THE FORM, which is why this page takes no photograph and
 * no price list: the one thing a reader can do here is join, and it is above the
 * fold at every width. The form supplies its own tray and core.
 *
 * ⚠ NO INVERTED PANEL. The V2.0 page ended on a full-bleed ink band carrying
 * "Ready when we are." and a button. That is a CTA, not a conformity statement,
 * and DESIGN.md reserves the panel for the second. It is now `.f-close`, which is
 * the component for exactly this.
 */

const BASE_URL = 'https://andro-prime.com'

const supplementWaitlistSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplement Waitlist', item: `${BASE_URL}/supplement-waitlist` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Supplement Waitlist',
  description:
    'Join the Andro Prime supplement waitlist. No payment, no commitment. Get early dispatch as soon as our manufacturing partner is confirmed and the range launches.',
  alternates: { canonical: `${BASE_URL}/supplement-waitlist` },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Verbatim, all six. */
const faqItems = [
  {
    q: 'When will the supplements launch?',
    a: "We're not publishing a specific date. The range launches as soon as our manufacturing partner is confirmed. Waitlist members will be the first to know.",
  },
  {
    q: 'Do I have to commit to anything?',
    a: 'No. Joining the waitlist is just an opt-in. No payment is taken. You can leave the list at any time.',
  },
  {
    q: 'What do I get for being on the list?',
    a: 'Two things. First, early dispatch when stock arrives, so you can subscribe before the public range opens. Second, we email you the moment the range launches.',
  },
  {
    q: 'Can I choose which product I want updates about?',
    a: 'Yes. The form lets you tell us whether you are interested in the Daily Stack, the Joint and Recovery Collagen, or both. You can change your mind later.',
  },
  {
    q: 'Can I unsubscribe later?',
    a: 'Yes. Email hello@andro-prime.com any time and we will remove you from the list. You can also unsubscribe via the footer of any email we send you.',
  },
  {
    q: 'Are the supplements available now?',
    a: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.',
  },
]

/* Verbatim. Four facts about what joining is and is not. */
const heroFacts = [
  'Free to join.',
  'Early dispatch ahead of the public launch.',
  'We email you the moment the range launches.',
  'No supplement orders or payments are being taken right now.',
]

/* Verbatim bodies.
   ⚠ `.f-bios` AND NOT `.f-steps`, BECAUSE THERE ARE THREE OF THEM. `.f-steps`
   turns to four columns above 1040px, so three items leave a quarter of the row
   empty and the group reads as a set with one missing. `.f-bios` is the system's
   three-up version of the identical treatment (a rule above and nothing else),
   already worn by `/how-it-works` and by `RelatedArticles`' F variant. The mono
   index is `.f-blab` rather than `.f-no`, because `.f-no` is styled only as
   `.f-step .f-no` and would render as unstyled body text here. */
const whatYouGet = [
  {
    num: '01',
    title: 'Early dispatch',
    body: 'Waitlist members are invited to subscribe and ship ahead of the public range opening.',
  },
  {
    num: '02',
    title: 'No payment to join',
    body: 'Joining is free. No payment is taken and no card details are needed. You can leave the list at any time.',
  },
  {
    num: '03',
    title: 'Launch updates',
    body: 'You hear about manufacturing-partner sign-off, formulation finalisation, and the launch date as they happen.',
  },
]

export default function SupplementWaitlistPage() {
  return (
    <FPage>
      <JsonLd data={supplementWaitlistSchema} />

      {/* ---------- HERO ---------- */}
      <FHero
        aside={
          <div id="join">
            <SupplementWaitlistForm interestedInProduct="any" variant="f" />
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Supplement waitlist</span>
          <span className="f-kchip">Not a pre-order</span>
        </div>
        <h1 className="f-h1">
          Be first when our<br />supplement range<br /><span className="f-grey">launches.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Join the waitlist. No payment, no commitment. We email you the moment our manufacturing
          partner is confirmed and the range is ready to ship.
        </p>
        <ul className="f-ticks" style={{ marginTop: 22 }}>
          {heroFacts.map((f) => (
            <li key={f}>
              <span aria-hidden="true">&#10003;</span>
              {f}
            </li>
          ))}
        </ul>
      </FHero>

      {/* ---------- 01 · WHAT THIS IS ----------
          Two cards, because each one draws a boundary the Phase 0a position
          depends on. They are a statement of what has and has not happened
          rather than prose about it, which is why they keep a container while
          the paragraphs around them do not. */}
      <FSection>
        <p className="f-blab">What this is</p>
        <h2 className="f-h2">
          A waitlist.<br /><span className="f-grey">Not a pre-order.</span>
        </h2>

        <div className="f-splitgrid f-rise" style={{ marginTop: 22 }}>
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">What it is</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>An email opt-in</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                A simple list. No payment is taken. You are telling us you want to hear when the
                range is live. We email you when it is.
              </p>
            </div>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">What it is not</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>A purchase or a deposit</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                No card details, no charge, no contract. You are not buying a supplement today. You
                are getting in line for the launch.
              </p>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · WHAT YOU GET ---------- */}
      <FSection cont>
        <p className="f-blab">What you get</p>
        <h2 className="f-h2">
          Three things,<br /><span className="f-grey">no money.</span>
        </h2>
        <div className="f-bios f-rise" style={{ marginTop: 24 }}>
          {whatYouGet.map(({ num, title, body }) => (
            <div className="f-bio" key={num}>
              <p className="f-blab">{num}</p>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 03 · WHAT IS COMING ----------
          🔴 THE TWO EFSA SENTENCES ARE APPROVED WORDINGS AND ARE REPRODUCED
          EXACTLY. Each sits in a `.f-well` under its own mono key, so a reader can
          see where the regulated sentence starts and stops. Not one character of
          either may be reworded, abbreviated or split.

          🔴 AND THEY ARE SET AT BODY SIZE, NOT AS FINE PRINT. Drafted as
          `.f-fine`, which is 11.5px mono and the smallest type in the system, and
          changed after seeing it rendered: an EFSA claim is the sentence that
          makes a supplement claim lawful, and setting it smaller than the
          marketing copy it qualifies reads as burying it. The V2.0 pages set these
          at body size too. The mono KEY above still marks it as a quoted wording;
          the wording itself is now readable. Same change on `/supplements`,
          `/supplements/daily-stack`, `/supplements/collagen` and `/faq`. */}
      <FSection>
        <p className="f-blab">What is coming</p>
        <h2 className="f-h2">
          Targeted,<br /><span className="f-grey">not generic.</span>
        </h2>

        <div className="f-splitgrid f-rise" style={{ marginTop: 22 }}>
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Daily Stack</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>Daily deficiency and recovery support</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                Built for men whose blood data shows the common gaps behind energy, recovery, and
                training output.
              </p>
              <div className="f-well">
                <p className="f-blab">EFSA-approved claims</p>
                <p className="f-sub" style={{ marginTop: 10, fontSize: 14.5 }}>
                  Zinc contributes to the maintenance of normal testosterone levels. Vitamin D3
                  contributes to normal muscle function. Active B12 contributes to normal
                  energy-yielding metabolism.
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
              <p className="f-blab">Joint and Recovery Collagen</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>Joint stress and inflammation support</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                A recovery-focused collagen formula for active men with confirmed elevated
                inflammation markers and joint symptoms.
              </p>
              <div className="f-well">
                <p className="f-blab">EFSA-approved claim</p>
                <p className="f-sub" style={{ marginTop: 10, fontSize: 14.5 }}>
                  Vitamin C contributes to normal collagen formation for the normal function of
                  cartilage.
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

        <p className="f-fine" style={{ marginTop: 20 }}>
          A Complete Men&rsquo;s Stack bundle pairing both products is also planned. None of these are
          available to buy right now.
        </p>
      </FSection>

      {/* ---------- 04 · COMMON QUESTIONS ----------
          Open, not behind a `<details>`. Six short answers, all of which draw the
          Phase 0a boundary, and a boundary a reader has to click to see is a
          boundary that has not been stated. */}
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

      {/* ---------- CLOSE ---------- */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">The list</p>
          <h2>Ready when we are.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            Add your email to the list and we&rsquo;ll be in touch when the supplement range is live.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <a href="#join" className="f-btn">
              Join the waitlist {ARROW}
            </a>
            <Link href="/kits" className="f-btn f-btn-ghost">
              Test first
            </Link>
          </div>
        </FClose>
      </FSection>
    </FPage>
  )
}
