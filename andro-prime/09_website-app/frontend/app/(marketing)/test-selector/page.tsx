import type { Metadata } from 'next'
import { TestSelectorQuiz } from '@/components/marketing/TestSelectorQuiz'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'

/**
 * /test-selector, rebuilt in Direction F on 2026-09-08 from
 * design/mockups/journey/test-selector-F.html Frame N, the page around the quiz.
 * The quiz itself is Frames N2 to N4 and lives in `TestSelectorQuiz`, rebuilt in
 * the same change: a route that is F above the fold and V2.0 in the middle is not
 * a rebuilt route, and this page's middle IS the quiz.
 *
 * WHY THIS ROUTE FIRST. `07_sales/funnel/site-funnel-model.md` §2 names it the
 * primary route from both the blog and the homepage, so it sat between two
 * rebuilt pages wearing the old design.
 *
 * COPY CARRIED VERBATIM, and two blocks here are compliance-bearing. The trust
 * line is the standardised UKAS claim, and the routing summary describes what
 * each kit is FOR, which is the wording CA-025 and CA-033 govern. Nothing below
 * is new customer-facing copy: every string is the one that shipped, moved into
 * F's containers.
 *
 * THE IA IS UNCHANGED. Hero, quiz, routing summary, methodology, in that order,
 * which is the order the live page has and the order the hero's two CTAs assume.
 * Frame N draws the page WITHOUT the quiz in it, because the quiz got its own
 * three frames; that is a drawing convenience and not an instruction to move the
 * quiz below the summary.
 *
 * NO CLOSE. The page ends on the methodology strip, as it does today and as the
 * frame draws it. A closing CTA would be new customer-facing copy and needs a
 * pre-flight, which a restyle does not get to skip.
 */

const BASE_URL = 'https://andro-prime.com'

/* The pip, not a bare glyph: `.f-btn:has(.f-pip)` reseats the padding around the
   circle, and a bare arrow one click from `/` and `/kits` draws the same label
   two ways. Ruled 2026-09-06. */
const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

export const metadata: Metadata = {
  title: "Find the Right Men's Health Blood Test",
  description: 'Answer three quick questions and get routed to the right Andro Prime test.',
  alternates: { canonical: 'https://andro-prime.com/test-selector' },
}

// Deliberately WebPage, not MedicalWebPage: the medical types assert a clinical
// service and sit outside the Phase 0 boundary (2026-08-02 AI-visibility review).
const pageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Test Selector', item: `${BASE_URL}/test-selector` },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/test-selector/#webpage`,
      url: `${BASE_URL}/test-selector`,
      name: "Find the Right Men's Health Blood Test",
      description:
        'A three-question quiz that routes UK men to the right at-home blood test kit based on symptoms, training load, and how clear or mixed the picture is.',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: 'en-GB',
    },
  ],
}

/* THE ROUTING SUMMARY. Print treatment, not three trays, and that is the
   containment ruling applied rather than the frame copied: "a card holds a
   transaction or an instrument", and these three hold neither. They carry prose
   about what each kit is for, with no price and no order button, so they take
   the same rule-above treatment as the step cards and the FAQ answers.

   `/kits` renders the same three kits as `.f-kcard` trays, correctly: those DO
   carry a price and an Order button. The difference between the two grids is the
   ruling working, not an inconsistency. */
const ROUTES = [
  {
    label: 'Kit 1',
    title: 'Testosterone Health Check',
    body: 'Best first step when the story sounds explicitly hormone-led (drive, motivation, specific fatigue).',
    isDefault: false,
  },
  {
    label: 'Kit 2',
    title: 'Energy & Recovery',
    body: 'Best first step when recovery, joint inflammation, or systemic deficiency looks more likely than hormones.',
    isDefault: false,
  },
  {
    label: 'Kit 3',
    title: 'Hormone & Recovery Check',
    body: 'Default when the picture is mixed or when you want the complete picture covering both domains in one go.',
    isDefault: true,
  },
]

/* THE METHODOLOGY STRIP. The live page inverts the fourth card to solid black
   with a "System ready" status line; Frame N drops that and says why, and the
   reason is right: on a four-card row the inversion reads as the last step being
   the important one, when the step that matters to a reader deciding whether to
   buy is the first. It would also have spent this page's one inverted panel on a
   process diagram (see DESIGN.md, "where each page spends its one"). */
const STEPS = [
  {
    num: '01',
    title: 'Order kit',
    body: 'Choose the right kit and get it sent out quickly via tracked delivery in discreet packaging.',
    foot: ['Action', 'User'],
  },
  {
    num: '02',
    title: 'Collect sample',
    body: 'Simple, painless finger-prick collection at home. Best performed fasted early morning.',
    foot: ['Time required', '5 mins'],
  },
  {
    num: '03',
    title: 'Post return',
    body: 'Seal sample in the provided medical transport vial and drop it in any priority postbox.',
    foot: ['Transit', 'Tracked 24'],
  },
  {
    num: '04',
    title: 'Understand',
    body: 'Get results in plain English within 2 to 5 working days, with a specific next recommendation based on data.',
    foot: ['Status', 'System ready'],
  },
]

export default function TestSelectorPage() {
  return (
    <FPage>
      <JsonLd data={pageSchema} />

      {/* ---------- HERO ----------
          The shared `HeroField` ground, via FHero's default, so the handover from
          `/` and `/blog` is carried by the ground and not by the typeface alone.
          That was the defect fixed on the three kit pages on 2026-09-03 and on
          `/how-it-works` on 2026-09-06; this route is the seventh to take it.

          ⚠ CA-045 q6/q7 are open against that layer and now cover SEVEN surfaces
          rather than six. See `lib/home/fieldRows.ts`. */}
      <FHero
        aside={
          <div className="f-tray">
            <div className="f-core">
              <p className="f-blab">Selector logic</p>
              <p className="f-sub" style={{ marginTop: 12 }}>
                Hormone-led symptoms tend toward <strong>Kit 1</strong>. Recovery, inflammation, and
                training-load issues tend toward <strong>Kit 2</strong>. If the picture is mixed or
                you want the broadest starting point, the selector defaults upward to{' '}
                <strong>Kit 3</strong>.
              </p>
            </div>
          </div>
        }
      >
        <span className="f-eyebrow">Find your test</span>
        <h1 className="f-h1" style={{ marginTop: 18 }}>
          Not sure which kit is right for you?
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Three questions. About 60 seconds. We route you to the best starting point based on
          symptoms, training load, and how clear or mixed the picture sounds.
        </p>
        <div className="f-btns" style={{ marginTop: 26 }}>
          <a href="#selector" className="f-btn">
            Start the quiz {ARROW}
          </a>
          <a href="#how-it-works" className="f-btn f-btn-ghost">
            How it works
          </a>
        </div>
        <p className="f-trust">
          <span aria-hidden="true">&#10003;</span>
          UKAS ISO 15189 accredited lab. No GP needed. Results in 2 to 5 working days.
        </p>
      </FHero>

      {/* ---------- THE QUIZ ----------
          An OBJECT-led section, so it takes the position rule and NO label, which
          DESIGN.md's section-grammar ruling allows explicitly: the homepage's
          readout and photo plate are the other two cases. A `.f-blab` here would
          announce a card that announces itself. */}
      <FSection id="selector" narrow>
        <TestSelectorQuiz />
      </FSection>

      {/* ---------- ROUTING SUMMARY ---------- */}
      <FSection>
        <p className="f-blab">Routing summary</p>
        <h2 className="f-h2">The selector is built to remove guesswork.</h2>

        <div className="f-kgrid f-rise" style={{ marginTop: 24 }}>
          {ROUTES.map((r) => (
            <div className="f-step" key={r.label}>
              {/* Wrapped, because `.f-step` is a flex column and a bare chip
                  would stretch to the column's full width.

                  `.f-flagchip` marks the default route: an INK-filled pill
                  against the other two rows' hairline `.f-kchip`. Frame N calls
                  this "the one accent the approved homepage spends", which was
                  true when it was drawn and is not now: the 2026-09-03
                  saturation ruling took `--flag` from amber to `#0A0B0D`. The
                  emphasis survives the ruling because it was never really the
                  colour doing the work: a filled pill beside two outlined ones
                  is the page pointing at one of three things either way. */}
              <div>
                {r.isDefault ? <span className="f-flagchip">Default route</span> : null}
                <span className="f-kchip" style={r.isDefault ? { marginLeft: 10 } : undefined}>
                  {r.label}
                </span>
              </div>
              <h3 className="f-h4" style={{ marginTop: 12, marginBottom: 8 }}>
                {r.title}
              </h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- METHODOLOGY ---------- */}
      <FSection id="how-it-works">
        <p className="f-blab">Methodology</p>
        <h2 className="f-h2">Order. Sample. Post. Done.</h2>
        <p className="f-lede">
          Once you know which test to start with, the process is simple and completely managed from
          home.
        </p>

        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {STEPS.map((s) => (
            <div className="f-step" key={s.num}>
              <span className="f-no">{s.num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{s.title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>
                {s.body}
              </p>
              <div className="f-step-foot">
                <span>{s.foot[0]}</span>
                <b>{s.foot[1]}</b>
              </div>
            </div>
          ))}
        </div>
      </FSection>
    </FPage>
  )
}
