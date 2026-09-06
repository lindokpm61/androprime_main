import type { ReactNode } from 'react'
import { KitTabs } from './KitTabs'
import { Logo } from '@/components/shared/Logo'
import type { KitData } from '@/lib/results/types'

/*
 * THE "RESULTS READY" DASHBOARD, EXTRACTED 2026-09-06 so that two surfaces can
 * render it and there is no second copy to drift.
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
 * The markup below is the logged-in dashboard's, unchanged. What differs between
 * the two hosts is passed in: the banner above the layout, whatever sits at the
 * top of the sidebar (the dev fixture bar on the real one, the scenario switcher
 * on the demo), the sidebar's standfirst, and the footer.
 */

export interface ResultsReadyViewProps {
  kits: KitData[]
  /** Read server-side; `KitTabs` is a client component and cannot read a flag. */
  showKitScopeNote: boolean
  /** Full-width, above the status strip. The password prompt, or the demo notice. */
  banner?: ReactNode
  /** Top of the left sidebar. The dev fixture bar, or the demo's switcher. */
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
  <footer className="bg-white border-t-4 border-black p-8 lg:px-12 xl:px-16 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
    <p className="font-mono text-xs font-bold tracking-[0.15em] uppercase">
      Questions about your results?{' '}
      <a
        href="mailto:support@andro-prime.com"
        className="underline hover:bg-black hover:text-white transition-colors px-1 ml-1"
      >
        Speak to our team
      </a>
    </p>
    <div className="flex gap-8 font-mono text-xs font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
      <span>UKAS ISO 15189 accredited lab</span>
    </div>
  </footer>
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
  return (
    <div className="bg-white min-h-[calc(100vh-5rem)]">
      {banner}

      {/* Status strip: static (one restrained live cue, no scroll) */}
      <div className="w-full bg-black text-white h-8 flex items-center justify-between px-6 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-white animate-pulse motion-reduce:animate-none" aria-hidden />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em]">Report generated</span>
        </div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] hidden sm:block">
          Analysis complete
        </span>
      </div>

      <div className="flex min-h-[calc(100vh-5rem-2rem)]">

        {/* Left sidebar */}
        <aside className="hidden md:flex md:w-[25%] lg:w-[30%] xl:w-[28%] border-r-4 border-black bg-white flex-col sticky top-20 self-start h-[calc(100vh-5rem)]">
          <div className="p-6 lg:p-8 xl:p-10 flex-1 flex flex-col overflow-y-auto">
            {sidebarTop}

            <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-black mb-8 w-max">
              <span className="w-2 h-2 bg-black" />
              <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase">
                Report Generated
              </span>
            </div>

            <h1 className="font-black font-sans text-black uppercase tracking-tighter leading-[0.85] mb-6" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
              Your<br />Results
            </h1>

            <p className="font-serif text-base leading-relaxed border-l-4 border-black pl-4 mb-8">
              {intro ?? DEFAULT_INTRO}
            </p>

            <div className="mt-auto pt-8 border-t-2 border-black">
              <Logo variant="dark" mark className="h-20 w-auto" />
            </div>
          </div>
        </aside>

        {/* Right content */}
        <div className="w-full md:w-[75%] lg:w-[70%] xl:w-[72%] flex flex-col bg-white">
          <KitTabs kits={kits} showKitScopeNote={showKitScopeNote} />
          {belowTabs}
          {footer ?? DEFAULT_FOOTER}
        </div>

      </div>
    </div>
  )
}
