'use client'

// Root error boundary for the marketing site. Added 2026-08-04 alongside
// app/(app)/error.tsx: the app previously had no error.tsx at all, so every error
// anywhere fell through to global-error.tsx, which renders its own bare <html> with
// no styling, no branding and no navigation. global-error.tsx is now what it should
// be: the last resort for a failure in the root layout itself, not the routine
// handler for any thrown error.
//
// ─────────────────────────────────────────────────────────────────────────────
// REBUILT IN DIRECTION F, 2026-09-14 (defect register C2).
// ─────────────────────────────────────────────────────────────────────────────
//
// 🔴 WHY THIS WAS MISSED TWICE, AND IT IS THE FINDING RATHER THAN THE FIX: an
// error boundary HAS NO ROUTE. Every sweep of the rebuild worked from a route
// list — `route-conformance.js` walks 37 routes, `audit-dark-contrast.js` walks
// 16 URLs, the batch plans were written per page — so a file that no URL resolves
// to was never in scope for any of them. `not-found.tsx` was rebuilt precisely
// because a bad URL reaches it. These were not reachable at all, which is exactly
// why they kept their V2.0 skin through six batches.
//
// EVERY WORD IS THE ONE THAT SHIPPED. The label, the headline, the apology, both
// button labels and the support line including the digest sentence are byte
// identical. `Sentry.captureException` and the `reset` wiring are untouched.
//
// 🔴 IT RENDERS ITS OWN NAV AND FOOTER, FOR THE REASON `not-found.tsx` DOES.
// This file is the boundary for the ROOT layout's children, so when it renders,
// the route-group layout that would have supplied the chrome has been replaced
// by it — including `(marketing)/layout.tsx` and its clearance. Left inherited
// there would be no nav, no footer and no `.f-page`, and without `.f-page` the
// page renders in `globals.css`'s V2.0 Merriweather at about 8% under the size
// every `f-` rule was calibrated against, with nothing erroring.
//
// ⚠ NO `RevealGate` AND NO `.f-rise`, DEPARTING FROM `not-found.tsx`. The reveal
// classes hide their content until an observer fires, and this is the page that
// renders when something has already gone wrong. An apology that animates in is
// a second thing to go wrong; it is set on the ground, visible on first paint.
//
// ⚠ NO DOT ON THE EYEBROW, though the V2.0 app boundary had one. DESIGN.md: "a
// dot marks a STATE, never a credential", and the `.f-eyebrow i` rule was
// deleted in 2026-09-03 with its five call sites, so adding one back renders
// nothing at all.
//
// ⚠ THE DARK-MODE HALF OF C2'S WRITE-UP DOES NOT HOLD, AND THE ROW IS STILL
// RIGHT. It says the `bg-black` "Try again" button is "a black button on
// near-black paper" in dark mode. There is no dark mode on this surface:
// `prefers-color-scheme` appears twice in the whole stylesheet set, both scoped
// to `.ap-themed`, which only `/demo`'s phone stage wears. What was true is
// that this page was V2.0 on a site that is not, on the one screen a customer
// sees at the worst possible moment.

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <>
      <Nav variant="marketing" />
      <main id="main-content" className="f-page pt-[92px] md:pt-[104px]">
        <section className="f-narrow f-sec f-sec-hero">
          <div className="f-btns" style={{ marginBottom: 18 }}>
            <span className="f-eyebrow">Error</span>
          </div>
          <h1 className="f-h1">Something went wrong.</h1>
          <p className="f-stand" style={{ marginTop: 20 }}>
            Sorry, this page failed to load. It has been logged and we will look into it.
          </p>

          <div className="f-btns" style={{ marginTop: 26 }}>
            <button type="button" onClick={reset} className="f-btn">
              Try again
              <span className="f-pip" aria-hidden="true">&rarr;</span>
            </button>
            <Link href="/" className="f-btn f-btn-ghost">
              Back to site
            </Link>
          </div>

          <p className="f-fine" style={{ marginTop: 26 }}>
            Need help? Email{' '}
            <a href="mailto:support@andro-prime.com" className="f-tlink">
              support@andro-prime.com
            </a>
            {error.digest ? ` and quote reference ${error.digest}.` : '.'}
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
