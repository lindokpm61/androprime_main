import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'

/**
 * /about, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE, so the layout is DECIDED rather
 * than ported, in the grammar `/membership` and `/how-it-works` established.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `design/mockups/journey/` draws 13 frames and none of them is `/about`,
 * `/contact`, `/faq` or the `/supplements` group. STATE.md records that:
 * *"they need design decided rather than ported."* What that means in practice
 * is that every structural call here has to be argued from DESIGN.md rather
 * than read off a drawing, so the reasoning is written beside each one.
 *
 * EVERY WORD IS THE ONE THAT SHIPPED, WITH TWO EXCEPTIONS, BOTH REGISTERED.
 * Keith's four paragraphs, Dr Ewa's two, the four principles, the lab
 * paragraphs, the four spec rows and the CA-026 standing claim are all
 * byte-identical to the V2.0 page. The two changes are the section labels
 * required by the F section grammar, and the primary CTA label, which moves
 * from "Choose your test" to "See the tests" to match `/how-it-works` and
 * `/membership` on the identical link to the identical destination. That is
 * the same shape as register row 28.
 *
 * 🔴 WHERE THIS PAGE SPENDS ITS ONE INVERTED PANEL: section 03, the CA-026 A1
 * standing claim. DESIGN.md keeps the inverted panel to one per page and
 * reserves it for *"a conformity statement"*, and this is the most literal
 * conformity statement on the site: it is the sentence that says testing and
 * selling are kept apart. `/how-it-works` spends its one on clinical oversight
 * and `/kits` on the C1 price panel, which is why Dr Ewa's section below is
 * NOT inverted here even though the same subject is inverted there.
 *
 * 🔴 NO PHOTOGRAPH OF EITHER PERSON, AND THAT IS A HARD LINE RATHER THAN A
 * MISSING ASSET. The site has nine photographs, all generated, and generating a
 * tenth to present as Keith or as a named GMC-registered GP would be a
 * fabricated record of a real person, not a stock choice. `.f-founder-av` and
 * `.f-initials` exist precisely for this: `/kits/hormone-recovery` already
 * renders both people as initials in a `--sunk` disc, so the convention is
 * established and this page follows it rather than inventing a portrait.
 *
 * ⚠ THE FOUR PRINCIPLES ARE `.f-step` AND TAKE NO CARD, per the containment
 * ruling of 2026-09-02: a card holds a transaction or an instrument, and four
 * short blocks of prose are neither. `.f-step` has BEEN the uncontained
 * treatment since that fold, so this needs no modifier; the `.f-steps-open`
 * modifier that used to carry it was deleted on 2026-09-06 once its rules moved
 * into the base class.
 */

const BASE_URL = 'https://andro-prime.com'

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Andro Prime: built by Keith Antony after his own experience being told his levels were normal while feeling far from it.',
  alternates: { canonical: `${BASE_URL}/about` },
}

/* The pip, not a bare glyph. `/`, `/kits`, `/how-it-works` and `/membership` all
   render the circled arrow, and an identical label one click apart drawn two
   ways was the defect fixed across three routes on 2026-09-06. */
const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* ⚠ EVERY ONE OF THESE FOUR IS AN EXISTING APPROVED FACT, NOT A NEW CLAIM. The
   lab accreditation and the GP registration are both already stated further down
   this same page; the turnaround is the site-wide "2 to 5 working days"; the
   dashboard delivery line is the fourth spec row. Nothing here is a number this
   page is the first surface to state. */
const facts = [
  { label: 'UKAS ISO 15189', sub: 'The lab that runs your sample' },
  { label: 'GMC-registered', sub: 'A GP signs off the report copy' },
  { label: '2 to 5 days', sub: 'From lab receipt to your dashboard' },
  { label: 'One price', sub: 'For the test, and nothing after it' },
]

/* Keith's four paragraphs, verbatim. The fourth is set as `.f-pull` rather than
   as a fourth `.f-sub`: it is the page's thesis in three sentences, and the
   V2.0 page already gave it no emphasis it deserved. `.f-pull` is a marketing
   emphasis, permitted on this surface, and carries no claim of its own. */
const founderStory = [
  'I spent two years being told my levels were “normal for my age” while feeling completely burnt out. Exhausted by 3pm. Brain fog that wouldn’t shift. Recovery that took three days for a workout that used to take one.',
  'My GP ran a basic panel and told me everything was fine. What he didn’t tell me was that “fine” means you’re above the threshold for clinical deficiency, not that you’re optimised.',
  'I built Andro Prime because I couldn’t find a service that gave me my actual numbers in plain English with a clear recommendation. Everything was either a GP appointment I couldn’t get, or a private clinic costing hundreds before I even knew what I was dealing with.',
]

const FOUNDER_PULL = 'We test first. We tell you what your numbers mean. Then we show you what to do about it.'

/* Verbatim. The role line is the one the V2.0 page rendered. */
const ewaStory = [
  'GMC-registered GP with specialist training in men’s hormonal health. Dr Lindo reviews our clinical protocols and signs off all results report copy.',
  'She understands the gap between what the NHS flags as deficient and what actually leaves men functioning well. That gap is what Andro Prime exists to close.',
]

/* 🔴 THE CA-026 A1 STANDING CLAIM, RENDERED VERBATIM. Not one word of this may
   be reworded, reflowed into two sentences, or split across two elements. It is
   an approved standing claim and the container is the only thing this rebuild
   is allowed to change. */
const STANDING_CLAIM =
  'Testing and selling are kept apart at Andro Prime. You pay one price for the test. Any result that needs a doctor, low testosterone included, goes to a GP, and those results earn us nothing.'

/* The four principles, bodies verbatim. The mono footer pair is the `.f-step`
   component's own meta row and is a FACT in each case, never a claim: it names
   what the principle is measured against. */
const principles = [
  {
    num: '01',
    title: 'Data first',
    body: 'Every recommendation starts with a result. Not a guess. Not a lifestyle questionnaire. Your blood data.',
    foot: ['Input', 'Your blood'],
  },
  {
    num: '02',
    title: 'Plain English',
    body: 'No lab reference tables. No clinical jargon. Your numbers in language that tells you what to do next.',
    foot: ['Output', 'Plain English'],
  },
  {
    num: '03',
    title: 'Evidence-led',
    body: 'EFSA-approved supplement claims. UKAS ISO 15189 accredited lab. GMC-registered doctor. No pseudoscience.',
    foot: ['Standard', 'EFSA and UKAS'],
  },
  {
    num: '04',
    title: 'Anti-corporate',
    body: 'Smaller. More personal. More direct. We tell you if something needs a GP, not just what sells the next product.',
    foot: ['Referral', 'Earns us nothing'],
  },
]

/* Verbatim, and the pairing is `.f-spec-k` over `.f-spec-v`, which is the spec
   row this system already uses on the kit pages. It sits on a `.f-core` rather
   than in a `--sunk` well: the 2026-08-31 finding is that `.f-spec-k` measures
   4.10:1 on `--sunk` and clears the floor on the card's lighter ground. */
const labSpec = [
  { k: 'Lab accreditation', v: 'UKAS ISO 15189' },
  { k: 'Turnaround', v: '2 to 5 working days from lab receipt' },
  { k: 'Results delivery', v: 'Private Andro Prime dashboard' },
  { k: 'Data security', v: 'Bank-level encryption' },
]

export default function AboutPage() {
  return (
    <FPage>
      <JsonLd data={aboutSchema} />

      {/* ---------- HERO ----------
          The shared `HeroField` ground, so this route hands over from `/kits`
          and `/how-it-works` without a seam. DESIGN.md, 2026-09-03: *"a ground
          belongs to the SYSTEM, not to a page"*, so adding a hero here means
          adding `.f-ruleground` and `<HeroField />` rather than deciding whether
          this particular page wants one.

          ⚠ CA-045 q6/q7 are open against that layer, and this page makes it an
          EIGHTH surface. Register row 34 tracks the scope; nothing new is drawn.

          THE ASIDE IS KEITH'S OWN QUOTE, RELOCATED. On the V2.0 page it sat in a
          bordered box beside his story in section 01, where it restated in one
          sentence what the four paragraphs beneath it had just said at length. In
          the hero it does the job it was written for: it is the reason the
          company exists, said by the person who built it, above the story that
          explains it. Not one word of it changed. */}
      <FHero
        aside={
          <div className="f-quotecard">
            <div className="f-quotehead">
              <div className="f-initials" aria-hidden="true">KA</div>
              <div>
                <strong>Keith Antony</strong>
                <div className="f-founder-role">Founder</div>
              </div>
            </div>
            <blockquote>
              &ldquo;I built this company because the standard approach is broken. We test first.
              Then you know exactly where you stand.&rdquo;
            </blockquote>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">About Andro Prime</span>
        </div>
        <h1 className="f-h1">
          Built by someone<br />
          <span className="f-grey">who needed it.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Not a clinic. Not a wellness brand trying to sell you something. A business built by a man
          who spent two years being told he was fine while feeling anything but.
        </p>
        <div className="f-btns" style={{ marginTop: 26 }}>
          <Link href="/kits" className="f-btn">
            See the tests {ARROW}
          </Link>
          <Link href="/how-it-works" className="f-btn f-btn-ghost">
            How it works
          </Link>
        </div>
      </FHero>

      {/* ---------- THE FACTS ROW ----------
          `.f-trustrow` already IS a card: it draws its own hairline grid, radius
          and clipping, so it takes no tray. Same placement as `/membership`,
          directly under the hero and outside the numbered spine. */}
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

      {/* ---------- 01 · THE FOUNDER ----------
          Uncontained prose. The containment ruling is explicit that a short prose
          block stretched to a taller sibling by `height: 100%` is what produced
          the empty-card problem, and that *"uncontained prose has no container to
          look unfinished in"*. So the story runs on the page. */}
      <FSection>
        <p className="f-blab">The founder</p>
        <h2 className="f-h2">
          Two years of<br /><span className="f-grey">&ldquo;normal for your age&rdquo;.</span>
        </h2>
        <div className="f-plain" style={{ marginTop: 4 }}>
          {founderStory.map((p) => (
            <p className="f-sub" key={p.slice(0, 28)}>{p}</p>
          ))}
          <p className="f-pull">{FOUNDER_PULL}</p>
        </div>
      </FSection>

      {/* ---------- 02 · CLINICAL OVERSIGHT ----------
          🔴 NOT INVERTED, and that is the per-page constraint doing its job.
          `/how-it-works` spends its one inverted panel on this exact subject.
          This page spends its one on the CA-026 statement below, so Dr Ewa's
          section takes the split grid and the card treatment instead. A second
          inverted block would silently cost the first its weight, which is the
          whole reason the constraint is per page. */}
      <FSection>
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">Medical director</p>
            <h2 className="f-h2">
              The gap between<br />deficient<br /><span className="f-grey">and well.</span>
            </h2>
            {ewaStory.map((p) => (
              <p className="f-sub" key={p.slice(0, 28)} style={{ marginTop: 16 }}>{p}</p>
            ))}
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <div className="f-founder-who">
                <div className="f-founder-av" aria-hidden="true">EL</div>
                <div>
                  <h3>Dr Ewa Lindo</h3>
                  <div className="f-founder-role">Medical Director, GMC registered</div>
                </div>
              </div>
              {/* ⚠ FACTS ABOUT WHAT SHE SIGNS, not a clinical claim and not a
                  quotation. Each line names a document she actually signs off,
                  and all three are stated elsewhere on the site already. */}
              <div className="f-spec" style={{ marginTop: 0, gridTemplateColumns: '1fr' }}>
                <div>
                  <span className="f-spec-k">Signs off</span>
                  <span className="f-spec-v">The clinical protocols behind every kit</span>
                </div>
                <div>
                  <span className="f-spec-k">Signs off</span>
                  <span className="f-spec-v">Every word of results report copy</span>
                </div>
                <div>
                  <span className="f-spec-k">Sets</span>
                  <span className="f-spec-v">The ranges your numbers are measured against</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 03 · WHERE WE STAND ----------
          🔴 THE PAGE'S ONE INVERTED PANEL, AND THE CLAIM INSIDE IT IS VERBATIM
          CA-026 A1. The container changed and not one word did, which is the same
          note the homepage receipt carries. `.f-blab-lg` carries the lead label,
          following the 2026-09-03 ruling that the homepage adopts `/kits`'
          section grammar. */}
      <FSection>
        <div className="f-invert f-rise">
          <p className="f-blab f-blab-lg f-invert-lab">Where we stand</p>
          <h2 className="f-h2 f-invert-h" style={{ marginTop: 10 }}>
            A result that needs a doctor<br /><span style={{ opacity: 0.62 }}>earns us nothing.</span>
          </h2>
          <p className="f-sub f-invert-p" style={{ marginTop: 18 }}>{STANDING_CLAIM}</p>
        </div>
      </FSection>

      {/* ---------- 04 · HOW WE OPERATE ---------- */}
      <FSection>
        <p className="f-blab">How we operate</p>
        <h2 className="f-h2">
          Four principles.<br /><span className="f-grey">No exceptions.</span>
        </h2>
        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {principles.map(({ num, title, body, foot }) => (
            <div className="f-step" key={num}>
              <span className="f-no">{num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
              <div className="f-step-foot">
                <span>{foot[0]}</span>
                <b>{foot[1]}</b>
              </div>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 05 · THE LAB ----------
          The spec panel is a `.f-tray` holding a `.f-core`, which survives the
          containment test: four accreditation and delivery facts read as an
          instrument's plate rather than as prose. */}
      <FSection cont>
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">The lab</p>
            <h2 className="f-h2">
              UKAS ISO 15189.<br /><span className="f-grey">Not a pop-up kit.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              Your sample is analysed by a UKAS ISO 15189 accredited laboratory. That&rsquo;s the same
              accreditation standard used by the NHS.
            </p>
            <p className="f-sub">
              Results are delivered through your private Andro Prime dashboard. Not through the
              lab&rsquo;s portal. Not in a generic reference range table. In a format built to tell you
              what matters.
            </p>
          </div>

          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">The chain of custody</p>
              <div className="f-spec" style={{ gridTemplateColumns: '1fr' }}>
                {labSpec.map(({ k, v }) => (
                  <div key={k}>
                    <span className="f-spec-k">{k}</span>
                    <span className="f-spec-v">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- CLOSE ---------- */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">Ready to find out</p>
          <h2>Where you actually stand.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            Pick the panel that matches what you&rsquo;re feeling, or let the selector do it for you.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">
              See the tests {ARROW}
            </Link>
            <Link href="/how-it-works" className="f-btn f-btn-ghost">
              How it works
            </Link>
          </div>
        </FClose>
      </FSection>
    </FPage>
  )
}
