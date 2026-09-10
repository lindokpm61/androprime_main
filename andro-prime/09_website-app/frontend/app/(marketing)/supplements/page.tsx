import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

/**
 * /supplements, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM, INCLUDING THE FOUR EFSA CLAIM SENTENCES. The
 * headline, standfirst, three hero facts, both product blurbs, the Complete
 * Men's Stack paragraph, the routing prose and all three routing cards are
 * byte-identical to the V2.0 page.
 *
 * ⚠ ONE LABEL SPLIT, REGISTERED. The V2.0 eyebrow read `Supplements //
 * Launching Shortly` as a single string. The double slash is a V2.0 brutalist
 * device with no equivalent in Direction F, and `.f-eyebrow` is ruled to be one
 * per page in the hero. It is now `.f-eyebrow` "Supplements" beside `.f-kchip`
 * "Launching shortly": the same two facts, in the two components the system
 * provides for them, and no new words.
 *
 * 🔴 NO PRODUCT PHOTOGRAPH, AND THAT IS THE HARD CONSTRAINT ON THIS PAGE. Neither
 * product exists: the range launches when a manufacturing partner is confirmed,
 * which is the fact the page states four separate times. A generated image of a
 * tub, a pouch or a capsule would be a picture of a product nobody has made, on
 * a page whose entire compliance position is that no orders are being taken.
 * `PRODUCT.md`'s Evidence on Hand rule is the same shape and DESIGN.md restates
 * it: do not invent a dispatch cutoff, a testimonial, a review count or a press
 * mention, because none exists. A product shot is that list's missing entry.
 *
 * ⚠ NO INVERTED PANEL. The V2.0 page ended its routing row with a black card
 * saying "Save your seat", which is a CTA rather than a conformity statement.
 * DESIGN.md reserves the panel for the second and allows one per page; this page
 * makes no conformity statement, so it spends none, and the third routing card
 * takes the same treatment as the two beside it.
 */

const BASE_URL = 'https://andro-prime.com'

const supplementsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${BASE_URL}/supplements` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Men\'s Health Supplements',
  description: 'Men\'s health supplements built around blood data. The Daily Stack and Joint & Recovery Collagen launch shortly. Join the waitlist for early access.',
  alternates: { canonical: `${BASE_URL}/supplements` },
  openGraph: {
    title: 'Men\'s Health Supplements | Andro Prime',
    description: 'Men\'s health supplements built around blood data. The Daily Stack and Joint and Recovery Collagen launch shortly. Join the waitlist for early dispatch, and we will email you when they launch.',
    url: `${BASE_URL}/supplements`,
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Men\'s health supplements from Andro Prime' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Men\'s Health Supplements | Andro Prime',
    description: 'Men\'s health supplements built around blood data. The Daily Stack and Joint and Recovery Collagen launch shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Verbatim. */
const heroFacts = [
  'Free to join.',
  'No payment is taken.',
  'No supplement orders are being taken right now.',
]

/* Verbatim. The `routes` are the two products; `claimsLabel` differs between
   them because one carries three approved claims and the other carries one, and
   the V2.0 page was already careful about the singular. */
const routes = [
  {
    slug: 'daily-stack',
    label: 'Daily deficiency support',
    name: 'Daily Stack',
    blurb: 'Built for men whose blood data shows the common gaps behind energy, recovery, and training output. Designed to be the one daily product, not the sixth.',
    claimsLabel: 'EFSA-approved claims',
    claims: 'Zinc contributes to the maintenance of normal testosterone levels. Vitamin D3 contributes to normal muscle function. Active B12 contributes to normal energy-yielding metabolism.',
    cta: 'Read about Daily Stack',
  },
  {
    slug: 'collagen',
    label: 'Joint and inflammation support',
    name: 'Joint & Recovery Collagen',
    blurb: 'A recovery-focused collagen formula for active men whose blood data confirmed elevated inflammation markers, and who report joint symptoms.',
    claimsLabel: 'EFSA-approved claim',
    claims: 'Vitamin C contributes to normal collagen formation for the normal function of cartilage.',
    cta: 'Read about Collagen',
  },
]

/* Verbatim bodies. Three-up, so `.f-bios` rather than `.f-steps`: `.f-steps`
   turns to four columns above 1040px and would leave a quarter of the row empty. */
const meantime = [
  {
    num: 'Route 01',
    title: 'Not sure yet',
    body: 'Run the test selector first. If the issue might be hormones, deficiency, or inflammation, let the data lead.',
    href: '/test-selector',
    cta: 'Use the test selector',
  },
  {
    num: 'Route 02',
    title: 'See the kits',
    body: 'Three kits, covering testosterone, energy and recovery, or both. Results in 2 to 5 working days.',
    href: '/kits',
    cta: 'Browse kits',
  },
  {
    num: 'Route 03',
    title: 'Save your seat',
    body: 'Join the waitlist now. Early dispatch when we launch, and we email you the moment it is live.',
    href: '#join',
    cta: 'Join the waitlist',
  },
]

export default function SupplementsPage() {
  return (
    <FPage>
      <JsonLd data={supplementsSchema} />

      {/* ---------- HERO ---------- */}
      <FHero
        aside={
          <div id="join">
            <SupplementWaitlistForm interestedInProduct="any" variant="f" />
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Supplements</span>
          <span className="f-kchip">Launching shortly</span>
        </div>
        <h1 className="f-h1">
          Built for what<br />your numbers<br /><span className="f-grey">actually show.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Our men&rsquo;s health supplement range launches shortly, as soon as our manufacturing
          partner is confirmed. Two targeted formulas, built around blood-data patterns. Not generic
          men&rsquo;s health products. Join the waitlist for early dispatch, and we will email you when
          they launch.
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

      {/* ---------- 01 · WHAT IS COMING ----------
          🔴 THE FOUR EFSA SENTENCES ARE APPROVED WORDINGS. Each sits in a
          `.f-well` under its own mono key, so the regulated sentence has a visible
          start and end rather than running into the marketing prose above it.
          Not one character may be reworded, abbreviated or split. */}
      <FSection>
        <p className="f-blab">What is coming</p>
        <h2 className="f-h2">
          Two supplement routes.<br /><span className="f-grey">Different jobs.</span>
        </h2>

        <div className="f-splitgrid f-rise" style={{ marginTop: 22 }}>
          {routes.map(({ slug, label, name, blurb, claimsLabel, claims, cta }) => (
            <div className="f-tray" key={slug} style={{ marginBottom: 0 }}>
              <div className="f-core">
                <div className="f-btns" style={{ marginBottom: 14 }}>
                  <span className="f-kchip">{label}</span>
                  <span className="f-kchip">Coming soon</span>
                </div>
                <h3 className="f-h4">{name}</h3>
                <p className="f-sub" style={{ fontSize: 15, marginTop: 10 }}>{blurb}</p>
                <div className="f-well">
                  <p className="f-blab">{claimsLabel}</p>
                  <p className="f-sub" style={{ marginTop: 10, fontSize: 14.5 }}>{claims}</p>
                </div>
                <div className="f-btns" style={{ marginTop: 18 }}>
                  <Link href={`/supplements/${slug}`} className="f-btn f-btn-ghost f-btn-sm">
                    {cta} {ARROW}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The bundle. One card across the measure, because it is a third product
            rather than a third column of the pair above it. */}
        <div className="f-tray f-rise" style={{ marginTop: 22 }}>
          <div className="f-core">
            <p className="f-blab">Coming with the launch</p>
            <h3 className="f-h4" style={{ marginTop: 10 }}>Complete Men&rsquo;s Stack</h3>
            <p className="f-sub" style={{ fontSize: 15 }}>
              A bundle pairing the Daily Stack and Joint and Recovery Collagen, for men whose blood
              data points in both directions. Pricing is finalised before launch. Waitlist members
              hear first.
            </p>
            <div className="f-btns" style={{ marginTop: 18 }}>
              <a href="#join" className="f-btn f-btn-sm">
                Join the waitlist {ARROW}
              </a>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · IN THE MEANTIME ---------- */}
      <FSection cont>
        <p className="f-blab">In the meantime</p>
        <h2 className="f-h2">
          Test first.<br /><span className="f-grey">Supplement later.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          The blood test is the part that is live today. We recommend supplements based on your
          result. Our own range launches shortly. Until then, the result still tells you what is
          going on.
        </p>

        <div className="f-bios f-rise" style={{ marginTop: 24 }}>
          {meantime.map(({ num, title, body, href, cta }) => (
            <div className="f-bio" key={num}>
              <p className="f-blab">{num}</p>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="f-btns" style={{ marginTop: 14 }}>
                {href.startsWith('#') ? (
                  <a href={href} className="f-btn f-btn-ghost f-btn-sm">{cta} {ARROW}</a>
                ) : (
                  <Link href={href} className="f-btn f-btn-ghost f-btn-sm">{cta} {ARROW}</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- CLOSE ---------- */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">The order of things</p>
          <h2>The test comes first.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            We recommend a supplement when your result shows a gap it addresses, and not before.
            Until the range is live, the result is the part that is live.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">
              See the tests {ARROW}
            </Link>
            <a href="#join" className="f-btn f-btn-ghost">
              Join the waitlist
            </a>
          </div>
        </FClose>
      </FSection>
    </FPage>
  )
}
