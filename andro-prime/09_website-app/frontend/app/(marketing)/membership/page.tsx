import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isMembershipEnabled } from '@/lib/flags'
import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { PRICING } from '@/lib/pricing'
import { KIT_NAMES } from '@/lib/kits/names'
import {
  MEMBERSHIP_DISCLOSURE,
  MEMBERSHIP_INCLUDED_DAYS,
  MEMBERSHIP_FIRST_CHARGE_DAY,
} from '@/lib/membership/disclosure'
import { FIRST_CYCLE_RETEST_DAYS, ANNUAL_RETEST_DAYS } from '@/lib/membership/entitlement'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { SIZES_HEROGRID } from '@/lib/ui/image-sizes'

/**
 * /membership, the PUBLIC page. Built 2026-09-08 as the seventh Direction F
 * route, in the language of `/how-it-works` and `/kits`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS PAGE EXPLAINS AND DISCLOSES. IT DOES NOT SELL, AND IT CANNOT.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * There is deliberately NO join button anywhere on it, and adding one later
 * would be a policy change rather than a design one. Membership cannot be
 * bought standalone and may only be joined while a lab result has come back
 * within the last 30 days (`01_strategy/2026-08-26-membership-offer-window.md`
 * §1 and §5; enforced server-side in `app/api/checkout/subscription/route.ts`,
 * which returns 409 `offer-window-closed`). A "Join" control here would render
 * to a cold visitor for whom the API is guaranteed to refuse. Every CTA
 * therefore routes to `/kits`, which is the only thing a cold visitor can buy.
 *
 * WHY IT EXISTS AT ALL, given `07_sales/funnel/site-funnel-model.md` §2 says no
 * acquisition surface may "sell or price the membership". Keith's ruling of
 * 2026-09-07 (`01_strategy/2026-09-07-auto-renew-at-day-30.md` §4) puts a price
 * line on all four `/kits/` routes: "Includes 30 days of membership. £47/month
 * after. Cancel anytime." That ruling is later and specific, so it governs; and
 * §3 of the same document is explicit that the reason the line ships is
 * PROMINENCE, because our buy button says "£99" and reads as a one-off purchase
 * while Spotify's reader already knows he is buying a subscription. This page is
 * where that line goes when a man clicks it. It is the prominence evidence, and
 * under the DMCC Act 2024 Part 4 read (`03_compliance/2026-09-07-dmcca-
 * subscription-regime-gap.md`) something of this shape is likely required rather
 * than optional.
 *
 * 🔴 THE TWO DOCUMENTS GENUINELY CONTRADICT EACH OTHER AND THE SWEEP HAS NOT RUN.
 * The funnel model's prohibition is stated absolutely and was not amended when
 * the auto-renew ruling landed. Recorded in `redesign-copy-register.md` row 32
 * and in `09_website-app/STATE.md`; owner Keith. Nothing here depends on the
 * answer except whether this page may ever be linked from `/` or `/kits`.
 *
 * BEHIND `MEMBERSHIP_ENABLED`, 404 WHEN OFF, and that is not belt-and-braces.
 * `2026-09-07-auto-renew-at-day-30.md` §8 is the reason: the moment the redesign
 * merges, a page saying "£47/month after" would be live while Stripe has no
 * `trial_period_days` anywhere in the repo and `createMembership` charges from
 * checkout. That mis-statement would arrive BY MERGE, not by anyone deciding to
 * ship it. The flag is the recommended fix in that document and it lets the
 * redesign merge on its own schedule.
 *
 * EVERY NUMBER ON THIS PAGE IS IMPORTED, NOT TYPED. The price comes from
 * `PRODUCT_MAP.membership`, the window from `MEMBERSHIP_OFFER_WINDOW_DAYS`, the
 * two retest intervals from `entitlement.ts`, kit prices from `lib/pricing.ts`
 * and kit names from `lib/kits/names.ts`. A duplicated fact is invisible exactly
 * while the copies agree (the lesson `lib/subscriptions/products.ts` records in
 * its own header), and this page restates more load-bearing numbers than any
 * other marketing route. If a constant moves, this page moves with it or the
 * build fails.
 *
 * COPY PROVENANCE. The three "what it includes" lines and the entitlement
 * paragraph are carried VERBATIM from the in-app paywall
 * (`app/(app)/account/membership/page.tsx`), not rewritten. Everything else is
 * new and is registered as such. Deliberately NOT present, each for a stated
 * reason:
 *
 *   - MEMBER PRICING ON SUPPLEMENTS. It has no delivery path, and the paywall
 *     lost kit discounting on 2026-08-26 for exactly this reason. The offer-
 *     window document says it in terms: "The paywall must not list it as a
 *     benefit until it has a delivery path."
 *   - ANY DISCOUNT ON KITS. There is none, for anyone, ever (§4 of the same
 *     document). Section 05 states that as a fact rather than staying silent.
 *   - "WATCH YOUR NUMBERS MOVE" AS THE LEAD. The cold-start constraint
 *     (`site-funnel-model.md` §1b) forbids it and it would be dishonest here:
 *     a man reading this page has one data point or none. The hero leads on the
 *     included month and the charge date, which are facts true on day one.
 */

/**
 * 🔴 FORCE-DYNAMIC, AND IT IS A CORRECTNESS FIX RATHER THAN A PREFERENCE.
 *
 * Built static first, and the build proved why that is wrong: with
 * `MEMBERSHIP_ENABLED` unset at build time the `notFound()` below runs during
 * PRERENDER, and Next writes `.next/server/app/membership.meta` with
 * `"status": 404` plus an `x-nextjs-prerender` header. The 404 is then a cached
 * artefact of the build, so flipping the flag in Coolify would leave the route
 * serving a stale 404 with nothing to indicate why. Every other
 * `MEMBERSHIP_ENABLED` surface resolves the flag per request (the API routes and
 * the account screen are dynamic because they read a session), so a build-time
 * answer here would make this the one surface where the flag means something
 * different.
 *
 * It also removes a real skew: `app/sitemap.ts` reads the SAME flag under
 * `revalidate = 3600`, which is genuine runtime ISR. Left static, this page
 * could 404 for up to an hour while the sitemap advertised it.
 *
 * The cost is one server render per visit on a page with no per-request data.
 * That is acceptable and it is not a divergence: all three `/kits/*` detail
 * pages already render dynamic (`ƒ` in the build output).
 */
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://andro-prime.com'

/* The pip, not a bare glyph. `/`, `/kits` and `/how-it-works` all render the
   circled arrow, and an identical label one click apart drawn two ways was the
   defect fixed across those three on 2026-09-06. */
const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* Seven numbered sections, hero and closing CTA excluded, matching the
   convention `/` and `/how-it-works` established. Counted once: an `of={7}`
   that disagrees with the number of call sites is a position indicator that
   lies, and nothing would catch it. */

/* ⚠ THE PRICE STRING ALREADY CARRIES ITS PERIOD. `PRODUCT_MAP.membership.price`
   is "£47/mo", so nothing on this page may append "a month" to it. Split here
   so the prose can say "£47 a month" in full words while the price OBJECT in
   section 04 renders the canonical string, and both move together. */
const MEMBERSHIP_PRICE = PRODUCT_MAP.membership.price

/* 🔴 THE DISCLOSURE, THE WINDOW AND THE FIRST-CHARGE DAY NOW COME FROM
   `lib/membership/disclosure.ts` AND ARE NO LONGER DECLARED HERE. This block
   used to own them, under a comment reading *"Do not reword it in one place: it
   is a two-site fact by design and the register tracks it as one."* On
   2026-09-11 Keith ruled the line onto the three `/lp/` kit landing pages as
   well, which §4 had left undecided, taking it from two sites to seven. A
   comment asking future readers to keep copies in step does not survive that,
   and this file already carries four other notes about exactly this defect
   class. The sentence has one home now, and it is not this page. */
const INCLUDED_DAYS = MEMBERSHIP_INCLUDED_DAYS
const FIRST_CHARGE_DAY = MEMBERSHIP_FIRST_CHARGE_DAY
const DISCLOSURE = MEMBERSHIP_DISCLOSURE

const membershipSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Membership', item: `${BASE_URL}/membership` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Your first 30 days of membership are included in the price of your kit. What happens on day 31, what membership includes, and what it never gates.',
  alternates: { canonical: `${BASE_URL}/membership` },
  openGraph: {
    title: 'Membership | Andro Prime',
    description:
      'Your first 30 days of membership are included in the price of your kit. What happens on day 31, what membership includes, and what it never gates.',
    url: `${BASE_URL}/membership`,
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Andro Prime membership' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Membership | Andro Prime',
    description:
      'Your first 30 days of membership are included in the price of your kit. What happens on day 31, what membership includes, and what it never gates.',
    images: ['/og/default.png'],
  },
}

/* The four facts a man needs before he clicks anything, in the row `/how-it-
   works` uses for its credentials. Placed directly under the hero because
   prominence is the whole point: the DMCCA read and the auto-renew ruling both
   turn on the price being visible near the top, not inside an accordion. */
const priceFacts = [
  { label: `${INCLUDED_DAYS} days`, sub: 'Included in the kit price' },
  /* ⚠ NOT `MEMBERSHIP_PRICE` here. `.f-trust-l` uppercases, so the canonical
     "£47/mo" rendered as "£47/MO", which reads as a unit rather than a price.
     The period moves to the sub, where it is not uppercased. Verified in the
     1440 render before and after. */
  { label: MEMBERSHIP_PRICE.replace('/mo', ''), sub: `A month, from day ${FIRST_CHARGE_DAY}` },
  { label: 'Cancel anytime', sub: 'Self-serve, no phone call' },
  { label: 'Nothing locked', sub: 'Your results stay yours' },
]

/* Four steps, in the grammar `/how-it-works` uses for its process. Each footer
   pair is a fact, never a claim. */
const timeline = [
  {
    num: '01',
    title: 'You buy a kit',
    body: `Full retail, the same price everyone pays. Membership is never a discount on a kit and there is no bundle price. What you have bought is a test.`,
    footer: ['Kits', `£${PRICING.KIT_1.rrp} to £${PRICING.KIT_3.rrp}`],
  },
  {
    num: '02',
    title: 'Your result comes back',
    body: `This is the moment the clock starts, not the day you ordered. Every date on this page runs from here, so a kit that sits in a drawer for a month costs you nothing.`,
    footer: ['Clock starts', 'Result day'],
  },
  {
    num: '03',
    title: `Your first ${INCLUDED_DAYS} days run`,
    body: `Included in what you already paid for the kit. Nothing to activate, nothing to opt into, no second card entry. You are a member from the moment there is something to be a member of.`,
    footer: ['Cost', 'Included'],
  },
  {
    num: '04',
    title: `Day ${FIRST_CHARGE_DAY}`,
    body: `Your card is charged ${MEMBERSHIP_PRICE.replace('/mo', '')} a month, automatically, and it keeps running until you stop it. We email you before that happens, with the date and the amount, while there is still time to decide.`,
    footer: ['Then', MEMBERSHIP_PRICE],
  },
]

/* ⚠ CARRIED VERBATIM from the in-app paywall's `<ul className="membership__
   includes">`. Three items, not four: "member price on kits" came off on
   2026-08-26 because kits are never discounted, and member pricing on
   supplements is not listed because it has no delivery path. Do not add a
   fourth without checking that document. */
const includes = [
  'Your plan, your streak and your daily data, kept running.',
  'Every marker explained against both ranges, ours and your lab’s.',
  'Ask the clinician. Questions answered every month, published for all members.',
]

/* What the membership does NOT gate. Every line is a negation of something we
   could have charged for and do not, which is the same shape as the approved
   `/kits` C1 panel ("no subscription unless you choose one") and the homepage's
   free-layer line. No claim in any of them. */
const neverGated = [
  {
    n: '1',
    title: 'Reading your own results',
    desc: 'Your dashboard, your ranges, your explanations and your download are open whether you are a member or not. We do not put a result you paid for behind a subscription.',
  },
  {
    n: '2',
    title: 'Buying a kit',
    desc: 'Every kit is sold at full retail to everyone. There is no member price on a kit, no bundle, and no arithmetic to do to work out what you are paying.',
  },
  {
    n: '3',
    title: 'Keeping what you have already recorded',
    desc: 'Cancel and your results do not go anywhere. What stops is the membership: the running plan, the dated retest ahead of you, and the monthly clinician answers.',
  },
]

const faqItems = [
  {
    q: `Am I signing up to a subscription when I buy a kit?`,
    a: `Yes, and we would rather say so on this page than leave you to find it on a statement. A kit includes your first ${INCLUDED_DAYS} days of membership in its price, and on day ${FIRST_CHARGE_DAY} the card you paid with is charged ${MEMBERSHIP_PRICE.replace('/mo', '')} a month. You can cancel before that date and pay nothing beyond the kit.`,
  },
  {
    q: `When exactly does day one fall?`,
    a: `The day your result comes back from the lab, not the day you ordered and not the day you posted your sample. If your kit sits in a drawer for three weeks, your included ${INCLUDED_DAYS} days have not started and are not being used up.`,
  },
  {
    q: `How do I cancel?`,
    a: `In your account, in the same number of clicks it took to start. There is no phone call, no retention script and no email you have to send. Cancelling stops the next charge; it does not remove your results.`,
  },
  {
    q: `What happens to my retest if I cancel?`,
    a: `The retest is included while you are a member, and it is checked on the date it falls due rather than banked in advance. So it is not a credit you lose: it is a thing that happens if you are a member when the date arrives, and does not if you are not.`,
  },
  {
    q: `Can I join later, without buying another kit?`,
    a: `Only inside the ${INCLUDED_DAYS} days after a result comes back. Outside that window there is nothing honest for a membership to run on, because it exists to move a number and date the next test. The way back in is another kit at full retail, which produces a result and opens a new ${INCLUDED_DAYS} days.`,
  },
  {
    q: `If I rejoin, do I pick up where I left off?`,
    a: `No. A new membership starts on its own date with its own retest date, and nothing carries over from the months you paid before. We would rather tell you that here than have you assume otherwise.`,
  },
]

export default function MembershipPage() {
  /* Same gate, same shape, same reason as the in-app route: with the flag off no
     membership surface exists anywhere, so the site is byte-identical to before
     membership existed. See the header for why this one matters more, not less,
     than the app route's. */
  if (!isMembershipEnabled()) notFound()

  return (
    <FPage>
      <JsonLd data={membershipSchema} />

      {/* ---------- HERO ----------
          The shared `HeroField` ground, so this route hands over from `/kits`
          and `/how-it-works` without a seam. `f-sec-hero` gives back the top
          padding while the consent banner is up, which is the fix the three kit
          pages were missing until 2026-09-03. Full-bleed, so `.f-ruleground`
          sits OUTSIDE `.f-wrap`.

          ⚠ CA-045 q6/q7 are open against this layer and this page makes it a
          SEVENTH surface. Register row 18 tracks the scope. */}
      <FHero
        aside={

            /* THE PAGE'S ONE PHOTOGRAPH, `img-9`, generated 2026-09-08
                (gpt_image_2), and it goes on the CA-045 register as a NEW asset.

                WHY THIS SUBJECT. The eight existing photographs are seven men in
                domestic settings plus a postbox, and CA-045's questions 3 and 4
                both ask whether an ordinary man beside tiredness copy implies he
                is unwell. A ninth man would inherit that question. A ringed date
                on a kitchen calendar has no person, no hands, no clinic, no blood
                and no sample in frame, so it opens no judgement the packet is
                already asking, and it draws the one thing this page is actually
                about: a date, decided in advance, that somebody has written down.

                `--focal` is set rather than defaulted, per the ruling written the
                day two portraits were decapitated. */
            <div className="f-plate">
              <div
                className="f-shot f-shot-r43"
                style={{ '--focal': '50% 50%' } as React.CSSProperties}
              >
                <Image
                  src="/home/img-9.jpg"
                  alt="A plain paper wall calendar hanging in a domestic kitchen, with a single date in the middle of the grid ringed once in blue biro."
                  width={800}
                  height={600}
                  sizes={SIZES_HEROGRID}
                />
              </div>
              <span className="f-shot-cap">A date, written down</span>
            </div>
        }
      >
              <div className="f-btns" style={{ marginBottom: 18 }}>
                <span className="f-eyebrow">Membership</span>
                <span className="f-kchip">No join button here</span>
              </div>
              {/* Leads on the INCLUDED MONTH and what follows it, not on the
                  trend. The cold-start constraint forbids leading on "watch your
                  number move", and it would be a poor argument anyway to a
                  reader who has no second data point yet. */}
              {/* ⚠ THREE LINES, AND THE THIRD IS SHORT ON PURPOSE. The first
                  draft closed on "Here is what happens next", which wrapped to a
                  fourth line at 1440 and, with the standfirst below it, pushed
                  both CTAs under the consent banner at 390. That is precisely the
                  defect `f-sec-hero` exists to prevent, reintroduced by copy
                  rather than by layout. "Then it renews" is also the braver
                  sentence: it puts the charge in the headline instead of
                  promising an explanation further down. */}
              <h1 className="f-h1">
                Your first {INCLUDED_DAYS} days<br />are in the kit price.<br />
                <span className="f-grey">Then it renews.</span>
              </h1>
              <p className="f-stand" style={{ marginTop: 20 }}>
                Buy any kit and you are a member from the day your result lands, at no extra cost. On
                day {FIRST_CHARGE_DAY} it becomes {MEMBERSHIP_PRICE.replace('/mo', '')} a month unless you stop it. This page is the whole
                of it.
              </p>
              {/* The disclosure sentence itself, at the top of the page rather
                  than inside an accordion. §7.1 of the auto-renew ruling: "Near
                  the price and the CTA, not inside an accordion. This is the
                  requirement that actually replaced opt-in." */}
              <p className="f-fine" style={{ marginTop: 18 }}>{DISCLOSURE}</p>
              <div className="f-btns" style={{ marginTop: 26 }}>
                {/* → /kits, never a join control. See the header. */}
                <Link href="/kits" className="f-btn">
                  See the tests {ARROW}
                </Link>
                <Link href="/how-it-works" className="f-btn f-btn-ghost">
                  How the test works
                </Link>
              </div>
      </FHero>

      {/* ---------- PRICE FACTS ----------
          `.f-trustrow` already IS a card: it draws its own hairline grid, radius
          and clipping, so it takes no tray. */}
      <section className="f-wrap">
        <div className="f-trustrow">
          {priceFacts.map(({ label, sub }) => (
            <div key={label}>
              <span className="f-trust-l">{label}</span>
              <span className="f-trust-s">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 01 · THE SHAPE OF IT ---------- */}
      <FSection>
        <p className="f-blab">The shape of it</p>
        <h2 className="f-h2">
          Four moments.<br /><span className="f-grey">One of them costs money.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          Nothing here is hidden in a term. This is the entire sequence, in order, with the day the
          money moves marked as plainly as we can put it.
        </p>

        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {timeline.map((s) => (
            <div className="f-step" key={s.num}>
              <span className="f-no">{s.num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{s.title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{s.body}</p>
              <div className="f-step-foot">
                <span>{s.footer[0]}</span>
                <b>{s.footer[1]}</b>
              </div>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 02 · WHY IT STARTS AT THE RESULT ---------- */}
      <FSection>
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">The clock</p>
            <h2 className="f-h2">
              It starts when you<br />learn something.<br />
              <span className="f-grey">Not when you pay.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              Every date we quote you runs from the day your result comes back from the lab. Not from
              checkout, not from dispatch, not from the day you posted your sample.
            </p>
            <p className="f-sub">
              There are two reasons and they happen to agree. A membership that started at checkout
              could be half spent before your result exists, which would be {INCLUDED_DAYS} days of
              an empty room. And a retest interval measures change in a number, so it can only
              sensibly run from the moment that number exists.
            </p>
            <p className="f-pull">
              Ninety days after a card was charged is not ninety days after a baseline.
            </p>
            <div className="f-btns" style={{ marginTop: 20 }}>
              <span className="f-kchip">Clock starts at your result</span>
              <span className="f-kchip">Not at checkout</span>
            </div>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">What membership includes</p>
              {/* VERBATIM from the in-app paywall. See the `includes` array. */}
              <div className="f-numlist">
                {includes.map((item, i) => (
                  <div key={item}>
                    <span className="f-numdot">{i + 1}</span>
                    <div>
                      <p className="f-sub" style={{ fontSize: 15, marginTop: 2 }}>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* 🔴 THE SECOND SENTENCE IS A COMPLIANCE ADDITION, NOT A STYLE ONE, and it
                  is the one finding the Guardrail #1 pre-flight produced against this
                  page. Item 3 ("Ask the clinician") is carried verbatim from the in-app
                  paywall, but the SURFACE changed: in-app it is read by a member who has
                  already met the product, and here it is read cold. `site-funnel-model.md`
                  §2 forbids an acquisition surface implying clinical services are live,
                  and the Phase 0 boundary in `03_compliance/CONTEXT.md` is the rule
                  behind that. "Published for all members" already carries the
                  general-not-individual point, but it carries it by implication.
                  This states it, in the footer's own approved words ("They don't
                  diagnose conditions, replace your GP, or constitute medical advice"),
                  so the page does not depend on a reader weighting a subordinate
                  clause correctly. Registered as row 32c. */}
              <p className="f-fine" style={{ marginTop: 18 }}>
                Three things, and this list is deliberately short. We do not list a benefit we cannot
                deliver yet. Clinician answers are general and published to every member; they are not
                individual medical advice and they do not replace your GP.
              </p>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 03 · THE RETEST ---------- */}
      <FSection>
        <p className="f-blab">The retest</p>
        <h2 className="f-h2">
          A test on a date,<br /><span className="f-grey">not a credit in an account.</span>
        </h2>
        <p className="f-sub" style={{ marginTop: 12 }}>
          The part of membership that has a physical thing attached to it is the retest, and the way
          it works is the part most worth reading twice.
        </p>

        <div className="f-tray f-rise" style={{ marginTop: 22 }}>
          <div className="f-core">
            <div className="f-numlist">
              <div>
                <span className="f-numdot">1</span>
                <div>
                  <h3 className="f-h4">If something was flagged, {FIRST_CYCLE_RETEST_DAYS} days</h3>
                  <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>
                    Long enough for a marker like vitamin D or active B12 to actually move. Retesting
                    sooner than that mostly measures the test.
                  </p>
                </div>
              </div>
              <div>
                <span className="f-numdot">2</span>
                <div>
                  <h3 className="f-h4">If nothing was flagged, {ANNUAL_RETEST_DAYS} days</h3>
                  <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>
                    Retesting a clear panel at three months tells you what you already know, and
                    charging you for it would be selling you a test we do not think you need.
                  </p>
                </div>
              </div>
              <div>
                <span className="f-numdot">3</span>
                <div>
                  <h3 className="f-h4">It is checked on the day, not banked</h3>
                  {/* Carried verbatim in substance from the in-app paywall's
                      entitlement block, which is the sentence the whole model
                      rests on. `entitlement.ts` states it identically in its
                      header: no ledger, no expiry policy, no rollover. */}
                  <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>
                    Included while you are a member. You need to be a member on that date. It is not
                    a credit, it does not expire, and there is no balance to keep track of.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 04 · WHAT IT COSTS ----------
          THE DISCLOSURE SECTION, and this page's ONE inverted panel. DESIGN.md
          allows one per page and a second silently costs the first its weight.
          It is spent here rather than on a credential block because the charge
          is the thing this page owes the reader most loudly, and because §3 of
          the auto-renew ruling says the gap between what our buy button says and
          what the customer signed up for is wider on our pages than on any
          comparator's. */}
      <FSection>
        <div className="f-invert f-rise">
          <div className="f-splitgrid">
            <div>
              <p className="f-blab f-invert-lab">What it costs, and when</p>
              <h2 className="f-h2 f-invert-h">
                {MEMBERSHIP_PRICE.replace('/mo', '')} a month,<br />from day {FIRST_CHARGE_DAY}.
              </h2>
              <p className="f-sub f-invert-p" style={{ marginTop: 16 }}>
                Your first {INCLUDED_DAYS} days are paid for by the kit. On day {FIRST_CHARGE_DAY} the
                card you bought the kit with is charged {MEMBERSHIP_PRICE.replace('/mo', '')}, and again
                each month after that, until you cancel. That is an automatic renewal and we are not
                going to describe it as anything else.
              </p>
              <p className="f-sub f-invert-p">
                Before it happens you get an email with the date and the amount, sent while there is
                still time to do something about it. Cancelling is self-serve in your account and
                takes no longer than joining did.
              </p>
            </div>

            <div className="f-quotecard">
              <p className="f-blab" style={{ marginBottom: 14 }}>The line, in full</p>
              <blockquote>{DISCLOSURE}</blockquote>
              <p className="f-fine" style={{ marginTop: 16 }}>
                The same sentence appears beside the price on every kit page. It is here as well
                because a man buying a {KIT_NAMES.testosterone} for £{PRICING.KIT_1.rrp} is buying a box
                that comes through his letterbox, and he should not have to work out from a bank
                statement that he bought anything else.
              </p>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 05 · WHAT IT NEVER GATES ---------- */}
      <FSection>
        <p className="f-blab">What it never gates</p>
        <h2 className="f-h2">
          Three things you keep<br /><span className="f-grey">whether you pay us or not.</span>
        </h2>

        <div className="f-tray f-rise" style={{ marginTop: 22 }}>
          <div className="f-core">
            <div className="f-numlist">
              {neverGated.map(({ n, title, desc }) => (
                <div key={n}>
                  <span className="f-numdot">{n}</span>
                  <div>
                    <h3 className="f-h4">{title}</h3>
                    <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 06 · WHEN IT IS OFFERED ---------- */}
      <FSection>
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">The window</p>
            <h2 className="f-h2">
              You cannot buy this<br />on its own.<br />
              <span className="f-grey">On purpose.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              There is no button on this page and there is none anywhere else either. A membership
              can only be joined while a result has come back within the last {INCLUDED_DAYS} days,
              which in practice means it is offered to you once, in your account, after your first
              result lands.
            </p>
            <p className="f-sub">
              The reason is that there is nothing honest for it to run on otherwise. Before a result
              exists there is no number to move, no retest to be entitled to and nothing to explain.
              Selling you a membership at that point would be selling you an empty room.
            </p>
            <p className="f-sub">
              Miss the window and the way back in is another kit at full retail, which produces a
              result and opens a new {INCLUDED_DAYS} days. Nothing carries over: a new membership
              starts on a new date with a new retest date.
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Where the offer appears</p>
              <div className="f-numlist">
                <div>
                  <span className="f-numdot">1</span>
                  <div>
                    <h3 className="f-h4">In your account</h3>
                    <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>
                      Once your result is back, and for {INCLUDED_DAYS} days after it.
                    </p>
                  </div>
                </div>
                <div>
                  <span className="f-numdot">2</span>
                  <div>
                    <h3 className="f-h4">Never on a page like this one</h3>
                    <p className="f-sub" style={{ fontSize: 15, marginTop: 4 }}>
                      No pricing table, no plan picker, no checkout. If you have not tested with us,
                      there is nothing here for you to buy.
                    </p>
                  </div>
                </div>
              </div>
              <p className="f-fine" style={{ marginTop: 18 }}>
                Start with a test. The membership finds you afterwards, or it does not, and either
                way the result is yours.
              </p>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 07 · QUESTIONS ---------- */}
      <FSection>
        <p className="f-blab">Questions</p>
        <h2 className="f-h2">Before you buy a kit.</h2>

        <div className="f-faqgrid f-rise" style={{ marginTop: 22 }}>
          {faqItems.map(({ q, a }) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- CLOSE ----------
          Routes to the kit, because that is the only thing on offer here. */}
      <section className="f-wrap f-sec">
        <FClose inSection>
          <p className="f-blab">Start with a number</p>
          <h2>The test comes first.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            Pick the panel that matches what you are feeling, or let the selector do it for you. The
            membership question comes later, once there is something to answer it about.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">
              See the tests {ARROW}
            </Link>
            <Link href="/test-selector" className="f-btn f-btn-ghost">
              Use the selector
            </Link>
          </div>
          <p className="f-fine" style={{ margin: '18px auto 0' }}>{DISCLOSURE}</p>
        </FClose>
      </section>
    </FPage>
  )
}
