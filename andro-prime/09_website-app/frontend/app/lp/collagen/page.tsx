import type { Metadata } from 'next'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

/**
 * /lp/collagen, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Same reasoning, same structure and the same three compliance notes as
 * `/lp/daily-stack`, which is the sibling rebuilt in the same change. Read that
 * file's header first: the EFSA quotation marks, the no-photograph rule and the
 * deferred-supplement position all apply here unchanged.
 *
 * EVERY WORD IS VERBATIM. The headline, the standfirst, the formulation card's
 * every row and dose, the two science paragraphs, the pull quote, all three
 * "what it will support" entries, both attributed quotations, both verification
 * chips, the conflict-free paragraph, all five FAQ answers and the waitlist block
 * are byte-identical to the V2.0 page.
 *
 * 🔴 THE VITAMIN C CLAIM IS AN EFSA WORDING AND IS CARRIED WHOLE. *"Vitamin C
 * contributes to normal collagen formation for the normal function of
 * cartilage"* appears in the FAQ and in the support list; it is an approved form
 * of words and neither instance is shortened, re-split or paraphrased to fit a
 * card.
 *
 * ⚠ DR EWA'S "IDENTITY" GLYPH IS GONE, and this is the `/contact` removal
 * applied to a second surface. The V2.0 page drew a 64px outlined person icon in
 * a bordered box beside her name. That is a placeholder for a portrait dressed as
 * a credential: it looks like a verification badge and verifies nothing, which is
 * the device the 2026-09-03 ruling took off the footer chips ("a dot marks a
 * STATE, never a credential"). She is `.f-initials`, as on `/about`, `/contact`,
 * `/kits/hormone-recovery` and `/supplements/collagen`. Her two verification
 * chips keep their words and lose their icons: Direction F has no icon
 * vocabulary at all.
 */

const BASE_URL = 'https://andro-prime.com'

const lpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Joint & Recovery Collagen', item: `${BASE_URL}/lp/collagen` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'When will Joint and Recovery Collagen be available?',
          acceptedAnswer: { '@type': 'Answer', text: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
        },
        {
          '@type': 'Question',
          name: 'Is this on sale right now?',
          acceptedAnswer: { '@type': 'Answer', text: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
        },
        {
          '@type': 'Question',
          name: 'What will be in the formulation?',
          acceptedAnswer: { '@type': 'Answer', text: '10g hydrolysed collagen peptides, 40mg UC-II undenatured Type II collagen, 80mg Vitamin C, and 500mg MSM. Vitamin C contributes to normal collagen formation for the normal function of cartilage.' },
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Collagen for Men UK | Joint & Recovery Collagen',
  description: '10g hydrolysed collagen peptides with UC-II, Vitamin C and MSM. Built for joints, tendons and recovery after 30. Launching shortly. Join the waitlist for early dispatch.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Collagen for Men UK | Joint & Recovery Collagen | Andro Prime',
    description: '10g hydrolysed collagen peptides with UC-II, Vitamin C and MSM. Launching shortly. Join the waitlist.',
    url: 'https://andro-prime.com/lp/collagen',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime Joint and Recovery Collagen' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collagen for Men UK | Joint & Recovery Collagen | Andro Prime',
    description: '10g hydrolysed collagen peptides with UC-II, Vitamin C and MSM. Launching shortly. Join the waitlist.',
    images: ['/og/default.png'],
  },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const SPEC_ROWS = [
  { label: 'UC-II Type II Collagen', value: '40mg, the researched dose' },
  { label: 'Vitamin C', value: '80mg, EFSA cartilage claim' },
  { label: 'MSM', value: '500mg, joint comfort support' },
  { label: 'Additives', value: 'None. Unflavoured.' },
]

const SUPPORTS = [
  { marker: 'Joint Comfort', body: 'Hydrolysed peptides accumulate in cartilage. Vitamin C contributes to normal collagen formation for the normal function of cartilage.' },
  { marker: 'Recovery', body: 'Type I collagen is the primary structural protein in tendons and ligaments. Supplementation supports repair after training.' },
  { marker: 'Inflammation Marker Tracking', body: 'Built to be paired with a retest at 90 days, so you can see if your hs-CRP marker has moved alongside how you feel.' },
]

const VERIFICATION = ['GMC Registered', 'UKAS ISO 15189 Lab']

const FAQ_ITEMS = [
  { question: 'When will Joint and Recovery Collagen be available?', answer: 'Launching shortly, as soon as our manufacturing partner is confirmed. Waitlist members are the first to be invited to subscribe, ahead of the public launch.' },
  { question: 'Is this on sale right now?', answer: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.' },
  { question: 'What will I get for joining the waitlist?', answer: 'Early dispatch when stock arrives, and we email you when it launches. No payment is taken to join.' },
  { question: 'What will be in the formulation?', answer: '10g hydrolysed collagen peptides, 40mg UC-II undenatured Type II collagen, 80mg Vitamin C, and 500mg MSM. Vitamin C contributes to normal collagen formation for the normal function of cartilage.' },
  { question: 'Will it taste of anything?', answer: 'No. It will be unflavoured. Mix it into coffee, a shake, water, or anything else.' },
]

export default function CollagenLpPage() {
  return (
    <FPage>
      <JsonLd data={lpSchema} />

      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Formulation (in build)</p>
              <h2 className="f-h4" style={{ marginTop: 10, marginBottom: 4 }}>Joint &amp; Recovery Collagen</h2>
              <div className="f-spec" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
                <div>
                  <span className="f-spec-k">Hydrolysed Collagen Peptides &middot; 10g</span>
                  <span className="f-spec-v" style={{ fontWeight: 400 }}>
                    &ldquo;Hydrolysed peptides for absorption&rdquo;
                  </span>
                  <span className="f-blab" style={{ marginTop: 8, marginBottom: 0 }}>Per serving</span>
                </div>
                {SPEC_ROWS.map(({ label, value }) => (
                  <div key={label}>
                    <span className="f-spec-k">{label}</span>
                    <span className="f-spec-v" style={{ fontWeight: 400 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Joint &amp; Recovery Collagen</span>
          <span className="f-kchip">Launching shortly</span>
        </div>
        {/* ⚠ THREE LINES, MEASURED. "Your joints are not ageing." is 27
            characters and `.f-h1` fits about 17 in this column once the
            formulation card takes the right-hand side, so left whole it wrapped
            with "ageing." alone. Broken at 11 / 15 / 18, each line a complete
            phrase. The grey carries the second sentence, which is the turn. */}
        <h1 className="f-h1">
          Your joints<br />are not ageing.<br /><span className="f-grey">They are starving.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          After 30, your body produces less collagen every year. Joints stiffen. Tendons weaken. Recovery slows. We are building a formula that pairs 10g of hydrolysed collagen peptides with UC-II, Vitamin C, and MSM. Launching shortly. Join the waitlist for early dispatch, and we will email you when it launches.
        </p>
        <div className="f-btns" style={{ marginTop: 24 }}>
          <a href="#join" className="f-btn">
            Join the waitlist {ARROW}
          </a>
          <span className="f-kchip">No payment. No commitment.</span>
        </div>
      </FHero>

      {/* ---------- 01 · THE SCIENCE ---------- */}
      <FSection>
        <p className="f-blab">The science</p>
        <div className="f-splitgrid f-rise" style={{ marginTop: 12 }}>
          <div>
            <h2 className="f-h2">
              Why collagen<br /><span className="f-grey">matters after 30.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 14 }}>
              After 30, collagen synthesis drops by roughly 1% per year. By 50, you have lost up to 20% of the collagen that supports your joints, tendons, and skin.
            </p>
            <p className="f-sub" style={{ marginTop: 14 }}>
              This is not something you feel gradually. It hits suddenly: a shoulder that does not recover. A knee that starts clicking. Skin that looks tired no matter how much you sleep.
            </p>
            <p className="f-pull">
              You cannot eat enough collagen through food. Supplementation is the only practical way to top up.
            </p>

            <div className="f-quotecard" style={{ marginTop: 26 }}>
              <div className="f-quotehead">
                <span className="f-initials">KA</span>
                <div>
                  <strong>Keith Antony</strong>
                  <span className="f-blab" style={{ marginBottom: 0 }}>Founder, Andro Prime</span>
                </div>
              </div>
              <blockquote>
                &ldquo;I started taking collagen at 39 when my shoulder would not recover. Within 6 weeks, I could train again without pain. I do not know why it took me so long to try it.&rdquo;
              </blockquote>
            </div>
          </div>

          <div>
            <p className="f-blab">What it will support</p>
            <div className="f-bios" style={{ gridTemplateColumns: '1fr', marginTop: 6 }}>
              {SUPPORTS.map(({ marker, body }) => (
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
                The clinically studied<br />
                <span style={{ opacity: 0.62 }}>combination, and no fillers.</span>
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
                &ldquo;10g of hydrolysed collagen with Vitamin C is the clinically studied combination. UC-II and MSM extend support to joint-specific tissue. No fillers, no additives.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

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

      {/* ---------- THE WAITLIST ---------- */}
      <FSection narrow rule={false} cont id="join">
        <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
          <div className="f-core">
            <p className="f-blab">Waitlist</p>
            <h2 className="f-h2" style={{ marginTop: 10 }}>Joint &amp; Recovery</h2>
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
              <SupplementWaitlistForm interestedInProduct="collagen" variant="f" />
            </div>
          </div>
        </div>
      </FSection>
    </FPage>
  )
}
