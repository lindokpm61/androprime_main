import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'

/**
 * /contact, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY ANSWER, EVERY ADDRESS, EVERY RESPONSE-TIME PROMISE IS VERBATIM. The
 * four FAQ answers, the five routing descriptions, the ADR escalation sentence,
 * the Dr Ewa paragraph, both inbox addresses, "Within 2 working days. Usually
 * faster.", "Within 1 calendar month." and the closing three lines are
 * byte-identical to the V2.0 page. The changes are the section labels the F
 * grammar requires, and the routing items losing their icons; both registered.
 *
 * 🔴 THE FIVE ROUTING ICONS ARE GONE, AND THAT IS THE DIRECTION RATHER THAN A
 * SIMPLIFICATION. Direction F has no icon vocabulary at all: the component list
 * in DESIGN.md contains no icon, and the one arrow in the system is ruled to be
 * *"the typographic glyph `&rarr;` as text, never a drawn SVG"*, precisely so it
 * follows the type ruling instead of drifting from it. A stroked 24px box icon
 * above a heading is the shared surface kit the measurement device exists to
 * escape; the 2026-09-02 critique named that territory outright. Each routing
 * item keeps its mono key instead, which says the same thing in the system's own
 * voice and does not need a second visual language to maintain.
 *
 * 🔴 AND SO IS THE "IDENTITY VERIFIED" DR EWA CARD, which is the more important
 * removal. The V2.0 page drew an 80px outlined person glyph in a grey box under
 * a mono label reading "Identity Verified", above her name and "GMC-registered
 * GP". That is a placeholder for a portrait, dressed as a credential: it looks
 * like a verification badge and verifies nothing, and a dot or a tick in front of
 * a credential is exactly what the 2026-09-03 ruling took off the footer chips
 * ("a dot marks a STATE, never a credential"). She is now `.f-initials`, the
 * same treatment `/kits/hormone-recovery` and `/about` give both people. No
 * portrait was generated: a generated photograph presented as a named
 * GMC-registered GP would be a fabricated record of a real person.
 *
 * 🔴 THE FAQ IS AN OPEN GRID, NOT AN ACCORDION, and this is a real interaction
 * change rather than a restyle. `FaqAccordion` is a V2.0 component with no F
 * equivalent, and `/how-it-works` and `/membership` both render their questions
 * open in `.f-faqgrid`. Four short answers hidden behind four clicks on a page
 * whose entire job is answering a question before the reader writes to us is the
 * wrong default: the page says "worth checking before you write to us", and an
 * accordion is what stops that happening. Registered.
 *
 * ⚠ WHERE THIS PAGE SPENDS ITS ONE INVERTED PANEL: section 05, the closing
 * commitment. It is the page's conformity statement, which is what DESIGN.md
 * reserves the panel for, and it was already the one full-bleed ink block on the
 * V2.0 page, so the emphasis is carried across rather than invented.
 */

const BASE_URL = 'https://andro-prime.com'

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Andro Prime team. Real humans, not bots. Email us and hear back within two working days.',
  alternates: { canonical: `${BASE_URL}/contact` },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Verbatim. */
const contactFaqs = [
  { question: "My results haven't appeared in my dashboard. What do I do?", answer: "Results typically appear within 2 to 5 working days of the lab receiving your sample. If it's been longer than that, email us with your order number and we'll look into it." },
  { question: 'I want to cancel my subscription. How do I do that?', answer: "Log in to your account, go to Subscriptions, and cancel from there. Cancel before your next billing date and you won't be charged for the following month. If you're having trouble, email us and we'll sort it." },
  { question: 'Can I speak to a doctor about my results?', answer: "Dr Ewa Lindo reviews our clinical protocols and results report copy. At this stage, we're not offering one-to-one clinical consultations. If your results raise something that needs medical attention, we'll tell you that clearly in your dashboard, and we'd encourage you to speak to your GP." },
  { question: 'I have a complaint.', answer: "We'd rather hear it than not. Email hello@andro-prime.com and we'll deal with it properly. If you're not satisfied with how we handle it, you can escalate to an approved ADR scheme or the relevant regulatory authority." },
]

/* Verbatim descriptions. The `key` is the mono index that replaces the icon: it
   is a position in a list, not a claim, and it is the same device `.f-step` and
   `.f-opt-k` already use. The 'Founding member programme' card was removed on
   2026-06-04 (FM take-down, low-T routing decision) and stays removed. */
const routing = [
  {
    key: 'Route 01',
    title: 'Kit orders and delivery',
    desc: <>Questions about your order status, delivery, or kit contents. Include your order number if you have it.</>,
  },
  {
    key: 'Route 02',
    title: 'Results and your dashboard',
    desc: <>If your results haven&rsquo;t appeared, something looks wrong, or you want to understand what a result means.</>,
  },
  {
    key: 'Route 03',
    title: 'Supplements and subscriptions',
    desc: <>Questions about your subscription, billing, cancellations, or pausing deliveries.</>,
  },
  {
    key: 'Route 04',
    title: 'Privacy and data',
    desc: <>Requests to access, correct, or delete your data. See also our <Link href="/privacy" className="f-tlink">Privacy Policy</Link>.</>,
  },
  {
    key: 'Route 05',
    title: 'Everything else',
    desc: <>Media, partnerships, or anything else. hello@andro-prime.com covers it all.</>,
  },
]

export default function ContactPage() {
  return (
    <FPage>
      <JsonLd data={contactSchema} />

      {/* ---------- HERO ----------
          The shared measurement ground, so this route hands over from every other
          F page without a seam. The aside is the primary inbox, which survives the
          containment test as a card: it holds the page's one transaction. */}
      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Primary inbox</p>
              {/* The address is set in the mono face because it is a value, not
                  prose: same register as a unit or a spec key. It was 4xl sans
                  black on the V2.0 page, which made it compete with the headline
                  beside it. */}
              <a
                href="mailto:hello@andro-prime.com"
                className="f-tlink"
                style={{
                  display: 'block',
                  marginTop: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSizeAdjust: 'none',
                  fontSize: 19,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                }}
              >
                hello@andro-prime.com
              </a>
              <div className="f-spec" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
                <div>
                  <span className="f-spec-k">Reply time</span>
                  <span className="f-spec-v">Within 2 working days. Usually faster.</span>
                </div>
              </div>
              <a href="mailto:hello@andro-prime.com" className="f-btn f-btn-block" style={{ marginTop: 18 }}>
                Send us an email {ARROW}
              </a>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Get in touch</span>
        </div>
        <h1 className="f-h1">
          Got a question?<br /><span className="f-grey">We&rsquo;ll answer it.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          This isn&rsquo;t a bot. There&rsquo;s a real person on the other end. Email us and you&rsquo;ll
          hear back within two working days.
        </p>
      </FHero>

      {/* ---------- 01 · ROUTING ----------
          `.f-faqgrid`, whose own comment in f-primitives.css says it *"doubles as
          a card list"*. Five items in two columns rather than `.f-steps`' four,
          which would leave one orphan on its own row at 1040px. */}
      <FSection>
        <p className="f-blab">Routing</p>
        <h2 className="f-h2">What to contact us about</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Use these to route your question to the right place before you write to us.
        </p>

        <div className="f-faqgrid f-rise" style={{ marginTop: 22 }}>
          {routing.map(({ key, title, desc }) => (
            <div key={key}>
              {/* ⚠ `.f-blab` AND NOT `.f-no`. `.f-no` is the step card's mono index
                  and the stylesheet declares it ONLY as `.f-step .f-no`, so used
                  in a `.f-faqgrid` it inherits the body sans and silently renders
                  as ordinary text at ordinary size. Written as `.f-no` first and
                  caught by screenshot, not by reading: the class exists, so
                  `verify-f-classes` passed. The same trap is noted in
                  `/supplement-waitlist`. */}
              <p className="f-blab" style={{ marginBottom: 8 }}>{key}</p>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 02 · WHAT HAPPENS ---------- */}
      <FSection cont>
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">Process</p>
            <h2 className="f-h2">
              What happens<br /><span className="f-grey">when you email us</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              We read every email. You won&rsquo;t get an auto-reply that closes your ticket and tells
              you to check the FAQs.
            </p>
            <p className="f-pull">
              If you&rsquo;re asking about your results, we may ask Dr Ewa to weigh in. She&rsquo;s
              involved in the business, not a name on a website, so if your question needs a clinical
              eye, it gets one.
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="f-quotehead">
                <div className="f-initials" aria-hidden="true">EL</div>
                <div>
                  <strong>Dr Ewa Lindo</strong>
                  <div className="f-founder-role">GMC-registered GP</div>
                </div>
              </div>
              {/* ⚠ NO "IDENTITY VERIFIED" LABEL. See the header: it read as a
                  verification badge and verified nothing. These three lines are
                  facts about what she does, each already stated on `/about` and
                  `/how-it-works`. */}
              <div className="f-spec" style={{ marginTop: 0, gridTemplateColumns: '1fr', marginBottom: 0 }}>
                <div>
                  <span className="f-spec-k">Reviews</span>
                  <span className="f-spec-v">Our clinical protocols</span>
                </div>
                <div>
                  <span className="f-spec-k">Signs off</span>
                  <span className="f-spec-v">Results report copy</span>
                </div>
                <div>
                  <span className="f-spec-k">Not offering</span>
                  <span className="f-spec-v">One-to-one clinical consultations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 03 · COMMON QUESTIONS ----------
          Open, not behind an accordion. See the header. */}
      <FSection>
        <p className="f-blab">Common questions</p>
        <h2 className="f-h2">Frequently asked.</h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          These are the questions we get most often. Worth checking before you write to us.
        </p>

        <div className="f-faqgrid f-rise" style={{ marginTop: 22 }}>
          {contactFaqs.map(({ question, answer }) => (
            <div key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 04 · DATA AND PRESS ----------
          Two cards, because each holds an address you act on. Both survive the
          containment test for the same reason the hero's inbox does. */}
      <FSection>
        <p className="f-blab">Two other inboxes</p>
        <h2 className="f-h2">
          Data requests,<br /><span className="f-grey">and press.</span>
        </h2>

        <div className="f-splitgrid f-rise" style={{ marginTop: 22 }}>
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">GDPR</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>Data and privacy</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                For data-related requests including access requests, deletion, and corrections:
              </p>
              <a
                href="mailto:privacy@andro-prime.com"
                className="f-tlink"
                style={{
                  display: 'block',
                  marginTop: 14,
                  fontFamily: 'var(--font-mono)',
                  fontSizeAdjust: 'none',
                  fontSize: 16,
                  color: 'var(--ink)',
                }}
              >
                privacy@andro-prime.com
              </a>
              <div className="f-spec" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
                <div>
                  <span className="f-spec-k">Reply time</span>
                  <span className="f-spec-v">Within 1 calendar month.</span>
                </div>
              </div>
              <p className="f-fine" style={{ marginTop: 14 }}>
                Full details of your rights are in our{' '}
                <Link href="/privacy" className="f-tlink">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Media</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>Business and press</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                Working on a story about men&rsquo;s health, hormones, or the state of GP testing?
                We&rsquo;re happy to talk.
              </p>
              <a
                href="mailto:hello@andro-prime.com?subject=Press"
                className="f-tlink"
                style={{
                  display: 'block',
                  marginTop: 14,
                  fontFamily: 'var(--font-mono)',
                  fontSizeAdjust: 'none',
                  fontSize: 16,
                  color: 'var(--ink)',
                }}
              >
                hello@andro-prime.com
              </a>
              <div className="f-spec" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
                <div>
                  <span className="f-spec-k">Subject line</span>
                  <span className="f-spec-v">Use &ldquo;Press&rdquo;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 05 · THE COMMITMENT ----------
          🔴 THE PAGE'S ONE INVERTED PANEL. The three lines and the closing
          sentence are verbatim; only the container changed. */}
      <FSection>
        <div className="f-invert f-rise">
          <p className="f-blab f-blab-lg f-invert-lab">How we answer</p>
          <h2 className="f-h2 f-invert-h" style={{ marginTop: 10 }}>
            No chatbot.<br />No ticket system.<br /><span style={{ opacity: 0.62 }}>No hold music.</span>
          </h2>
          <p className="f-sub f-invert-p" style={{ marginTop: 18 }}>
            Just an inbox and two working days.
          </p>
        </div>
      </FSection>

      {/* ---------- CLOSE ---------- */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">Still nothing that fits?</p>
          <h2>Write to us anyway.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            One inbox covers all of it, and a person reads every message that lands in it.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <a href="mailto:hello@andro-prime.com" className="f-btn">
              Send us an email {ARROW}
            </a>
            <Link href="/faq" className="f-btn f-btn-ghost">
              Read the facts
            </Link>
          </div>
        </FClose>
      </FSection>
    </FPage>
  )
}
