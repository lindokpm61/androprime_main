import type { ReactNode } from 'react'
import { KitTabs } from './KitTabs'
import { AppStrip, AppShell } from '@/components/app/AppShell'
import type { KitData } from '@/lib/results/types'

/*
 * THE "RESULTS READY" DASHBOARD, EXTRACTED 2026-09-06 so that two surfaces can
 * render it and there is no second copy to drift.
 *
 * ⚠ THE SECOND SURFACE NO LONGER EXISTS, and that is worth knowing before
 * reading the rest of this header. `/demo` was rebuilt from the prototype on
 * 2026-09-07 onto the `ap-` phone shell and does not import this file; the only
 * consumer today is `/results-dashboard`. The extraction argument below still
 * holds and the file stays extracted, because the demo may yet come back to it
 * and a single renderer is the right shape regardless, but "two surfaces render
 * this" is currently false.
 *
 * 🔴 IT WAS EXTRACTED RATHER THAN COPIED, AND THAT IS DELIBERATE. The public
 * demo shows the real report, so the alternative was a second component
 * rendering the same thing on a marketing route. This repository already knows
 * what that costs: two kit-card components sold the same three products one
 * click apart and disagreed on order, panel device, label placement, flag chip,
 * price scale and button, and each disagreement arrived as a reasonable local
 * decision. A demo that quietly stops matching the product is worse than that,
 * because its whole job is to be what the customer will get.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REBUILT IN DIRECTION F ON 2026-09-11, batch 3, and it was the LAST V2.0
 * surface in the signed-in app.
 *
 * 🔴 IT WAS ALSO THE FIRST SCREEN A CUSTOMER SAW. The post-login redirect lands
 * on `/results-dashboard`, so for anyone with a result the first thing after
 * signing in was the one view the rebuild had not reached: hard 4px black rules
 * and uppercase slabs, opening under a floating nav and a rounded status strip.
 * Keith spotted it within a minute of being given a login.
 *
 * WHAT CHANGED IS THE SHELL, AND ONLY THE SHELL. It now composes `AppStrip` and
 * `AppShell` like every other signed-in route, so the sidebar, the strip, the
 * type ramp and the footer are the same objects the rest of the app uses rather
 * than a second hand-built copy of them. That also removes this file's own
 * status strip, which had been competing with the one the layout added in the
 * same batch: two black bars, one above the other, saying different things.
 *
 * 🔴 NOT ONE WORD OF COPY CHANGED. Every sentence on this surface is the results
 * engine's and is Ewa-approved: the headline, the intro, the per-marker
 * explanation and evidence, the recommendation, the badge vocabulary and the
 * support footer. A redesign may not re-type a clinical verdict, which is the
 * lesson the `/lp` rebuild paid for when a hand-copied sample report graded free
 * testosterone "Low" at a value the engine calls in range.
 */

export interface ResultsReadyViewProps {
  kits: KitData[]
  /** Read server-side; `KitTabs` is a client component and cannot read a flag. */
  showKitScopeNote: boolean
  /** Full-width, above the shell. The password prompt, or the demo notice. */
  banner?: ReactNode
  /** Top of the main column. The dev fixture bar, or the demo's switcher. */
  sidebarTop?: ReactNode
  /** The paragraph under the "Your Results" headline. */
  intro?: ReactNode
  /** Rendered under the tabs. The GP handoff strip on the real dashboard. */
  belowTabs?: ReactNode
  /** Replaces the support footer. The demo does not invite support email. */
  footer?: ReactNode
}

const DEFAULT_INTRO = (
  <>
    We&apos;ve processed your latest blood panel. Review your personalised biomarker insights and
    what they mean for you.
  </>
)

const DEFAULT_FOOTER = (
  <p className="f-fine" style={{ marginTop: 26 }}>
    Questions about your results?{' '}
    <a href="mailto:support@andro-prime.com" className="f-tlink">
      Speak to our team
    </a>
    {' · '}
    UKAS ISO 15189 accredited lab
  </p>
)

export function ResultsReadyView({
  kits,
  showKitScopeNote,
  banner,
  sidebarTop,
  intro,
  belowTabs,
  footer,
}: ResultsReadyViewProps) {
  const markerCount = kits.reduce(
    (n, kit) => n + (kit.results[0]?.markers.length ?? 0),
    0
  )

  return (
    <>
      {banner}
      <AppStrip label="Your results" right="Report generated" />
      <AppShell
        chip={`${markerCount} ${markerCount === 1 ? 'marker' : 'markers'} returned`}
        heading="Your Results"
        intro={intro ?? DEFAULT_INTRO}
      >
        {sidebarTop}
        <KitTabs kits={kits} showKitScopeNote={showKitScopeNote} />
        {belowTabs}
        {footer ?? DEFAULT_FOOTER}
      </AppShell>
    </>
  )
}
