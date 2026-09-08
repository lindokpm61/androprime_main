import type { Metadata } from 'next'
import Link from 'next/link'
import { DemoStage } from '@/components/app-shell/DemoStage'
import type { DemoPreview } from '@/components/app-shell/DemoStage'
import { resolveDemoJourney, getDemoEngineInput, getDemoDates } from '@/lib/results/demo'

/*
 * /demo -- THE DEMO ACCOUNT, AS THE REAL THING.
 * Built 2026-09-06. Journey states added 2026-09-07. Stage ported 2026-09-07.
 *
 * WHAT THIS PAGE IS NOW. A thin server shell: it resolves which moment in the
 * journey the URL asks for, hands the raw fixture values to
 * `DemoStage`, and gets out of the way. Everything visible is in
 * `components/app-shell/` -- `DemoStage` for the phone and the control rail,
 * `AppShell` for the screens inside it.
 *
 * 🔴 NO DATABASE, NO USER, NO WRITES. `lib/results/demo.ts` reads a CLOSED set of
 * fixtures with no Supabase client anywhere on the path, and an unknown id in the
 * query string falls back to the default rather than reaching the registry. That
 * is what makes the homepage's promise -- "We never put your data in it" -- a
 * property of the code rather than a policy someone has to remember. Do not add a
 * call here that takes a user id, and do not widen the set to read the URL.
 *
 * 🔴 `robots: noindex` UNTIL THE COMPLIANCE GATE CLEARS. This is the first time a
 * full results report -- verdict badges, action bands, recommendation copy -- is
 * rendered on an ungated public surface, and since 2026-09-07 it also carries a
 * membership PRICE. `biomarker-copy.ts` was signed for a logged-in customer
 * reading his own result, which is a different context from a stranger reading a
 * fabricated one, and the price is a second question that CA-046 never asked.
 * Both must clear before this line changes.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔄 2026-09-07, THREE CORRECTIONS IN ONE DAY, and the last two were Keith's.
 *
 * FIRST: the three things the prototype showed and this did not -- the plan tab,
 * the record tab and the member screens -- were built, and a FOURTH gap turned up
 * that neither this file nor `AppShell.tsx` had ever listed: the DAY 3 WAITING
 * STATE. Nothing gated it. `state !== 'ready'` returning null is what made it
 * unreachable, and it was missed rather than chosen.
 *
 * SECOND, and this one was a real miss: Keith read the result and said it was
 * "completely different from the actual prototype". It was. The 2026-09-06 build
 * had rebuilt the prototype's SCREENS and silently dropped its STAGE -- the phone
 * bezel, the control rail with its value slider and band presets, the theme
 * toggle, the closing notes -- and everything added on top inherited that. The
 * two artefacts had been compared on STRUCTURE (which tabs, which states) and
 * never once on APPEARANCE. `DemoStage` is that stage, ported.
 *
 * THIRD, and it is the one worth remembering: that fidelity pass compared ONE
 * pair of screenshots, the default state on the default tab, out of TWELVE
 * state-and-tab combinations. Keith sent a screenshot of a different state
 * showing a screen that had been invented rather than ported. Comparing all
 * twelve at once then found five further gaps: the whole You tab, the member
 * plan's counters and chart, the inline was-to-now on member rows, a title
 * repeated on every screen, and a tab bar attached to the wrong flex parent.
 * **One screenshot proves one cell.** If you change these screens, drive both
 * artefacts through every cell and diff the text; the screenshots are for the
 * cells where the text already disagrees.
 *
 * FOURTH AND FIFTH, both Keith, and both about what the demo is FOR. The rail
 * had a second switcher listing three sample results, and two of the three were
 * Kit 1 -- a five-marker panel on the page whose job is to show the product. It
 * is gone, and the demo is built on Kit 3 alone: "you should be building it on
 * the one that gives the demo the most value."
 *
 * SIXTH, AND IT REPLACED EVERYTHING ABOVE. Keith, later the same day: *"rebuild
 * the demo from scratch, following page for page the prototype. Exactly. So the
 * initial buy is Kit 3 and the rebuy or retest is Kit 2 ... I think we are, with
 * this current version of the demo, in a complete mess."* The data model, the
 * screens, the stage and the fixtures were all rewritten against
 * `design/prototypes/demo-account-interactive.html`. Two decisions inside that
 * rebuild were his and are recorded where they bite: the demo now carries the
 * PROTOTYPE'S man rather than the homepage's (`fixtures/demo-kit3-baseline.ts`),
 * and the plan tab follows the prototype's layout with the engine's approved
 * copy rather than its invented daily tasks (`components/app-shell/AppShell.tsx`).
 *
 * 🔴 KEITH'S RULING on why the membership surfaces are here rather than behind
 * the flag: "This is a demo, so surely it isn't dependent on the membership flag
 * being enabled as part of the website. So it should demonstrate everything that
 * is available that we're planning to do, as a potential customer will look at
 * that and have a real visual of what's behind the membership program."
 * `MEMBERSHIP_ENABLED` stops someone BUYING an unfinished membership. It is not a
 * reason to stop him SEEING one.
 */

export const metadata: Metadata = {
  title: 'See a real result before you buy',
  description:
    'A working demonstration of the Andro Prime results dashboard, loaded with sample results. No account, no email, nothing to buy.',
  robots: { index: false, follow: false },
}

/*
 * 🔄 ONE PARAMETER SINCE 2026-09-07. There was a second, `?r=`, selecting one of
 * three sample results. Keith removed it: the demo is built on Kit 3, the
 * nine-marker panel, because that is the one that shows the most of the product.
 * An unrecognised `?s=` still falls back rather than erroring, so an old link
 * carrying `?r=gp` lands on the demo instead of on nothing.
 */
interface PageProps {
  searchParams: Promise<{ s?: string; preview?: string }>
}

/*
 * `?preview=` -- ADDED 2026-09-08, AND IT IS A LOOKING-AT-IT FLAG, NOT A
 * FEATURE. Keith asked to see two proposals before deciding either: a drawn
 * device body with a resting tilt, and an attract loop that walks the journey
 * until the reader touches it. Values: `device`, `attract`, `both`.
 *
 * 🔴 ANYTHING ELSE, INCLUDING NOTHING, IS OFF. The default render is byte for
 * byte the one verified across twelve state-and-tab cells, which is what lets
 * these be evaluated without putting the verified page at risk. Delete this
 * parameter and its `DemoPreview` prop together when the two are decided; do
 * not let it decay into a permanent switch nobody remembers owning.
 */
function resolveDemoPreview(value?: string): DemoPreview {
  const both = value === 'both'
  return { device: both || value === 'device', attract: both || value === 'attract' }
}

export default async function DemoPage({ searchParams }: PageProps) {
  const { s, preview } = await searchParams
  const journey = resolveDemoJourney(s)

  /* Both purchases go over every time; the journey decides what is rendered.
     Every date is anchored to the FIRST result, which is the moment membership
     starts, and derived from the fixtures rather than typed. */
  const engine = getDemoEngineInput()
  const dates = getDemoDates(journey.id)

  return (
    <>
      <DemoStage
        engine={engine}
        journey={journey}
        dates={dates}
        preview={resolveDemoPreview(preview)}
      />
      <DemoFooter />
    </>
  )
}

/*
 * Replaces the logged-in footer, which invites support email about your results.
 * A visitor here has no results and no order, so the useful thing is the way in.
 * It sits OUTSIDE the themed stage on purpose: it is site furniture, and it
 * should match the site rather than the demo's dark mode.
 */
function DemoFooter() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 pb-16">
      <footer className="ap-close">
        <div>
          <div className="ap-controls__lbl">This is what you get</div>
          <p>
            A finger-prick at home, a UKAS ISO 15189-accredited lab, and this report in your dashboard
            within 2 to 5 working days of the lab receiving your sample.
          </p>
        </div>
        <Link href="/kits" className="ap-close__cta">
          See the tests &nbsp;&rarr;
        </Link>
      </footer>
    </div>
  )
}
