'use client'

// Error boundary for the signed-in app (results dashboard, subscriptions, account,
// status pages). Added 2026-08-04: before this, the app had NO error.tsx anywhere,
// so any thrown error fell through to global-error.tsx: an unstyled page with no
// branding, no explanation and no way back. A customer who had just paid for a blood
// test saw a bare "Something went wrong" and had no route to their results.
//
// The common case here is an expired or destroyed session: a server action calls
// revalidatePath, the (app) layout re-renders, requireAuthenticatedUser() calls
// redirect(), and the thrown NEXT_REDIRECT surfaces to the client as
// "An unexpected response was received from the server." So this boundary leads
// with signing back in, which resolves it in the overwhelming majority of cases.
//
// ─────────────────────────────────────────────────────────────────────────────
// REBUILT IN DIRECTION F, 2026-09-14 (defect register C2).
// ─────────────────────────────────────────────────────────────────────────────
//
// 21 V2.0 tokens, 0 Direction F classes, missed by six batches for the reason
// the root boundary was: an error boundary has no route, and every sweep of the
// rebuild worked from a route list.
//
// EVERY WORD IS THE ONE THAT SHIPPED. The strip label, the headline, the
// explanation, both button labels and the support line including the digest
// sentence are byte identical. `Sentry.captureException`, the `reset` wiring and
// the `?next=/results-dashboard` sign-in target are untouched.
//
// 🔴 IT INHERITS ITS CHROME AND THE ROOT BOUNDARY DOES NOT. This file renders
// INSIDE `(app)/layout.tsx`, which supplies `.f-page`, the app nav, the nav
// clearance and the app footer, so it renders the body and nothing else.
// `app/error.tsx` is the boundary for the ROOT layout's children and therefore
// replaces the group layout, which is why that one builds its own chrome. Two
// files, two answers, and the difference is which layout is still standing.
//
// 🔴 THE INK PANEL IS GONE AND DOES NOT COME BACK AS `.f-invert`. The V2.0
// version opened with a `bg-black text-white` section. `(app)/layout.tsx` states
// the rule: the ink strip at the top of an app screen is how a reader knows
// which surface they are on, "so an app page never also carries `.f-invert`".
// A `.f-tray` holding a `.f-core` is the app's own container, used by every
// other screen in the tree.
//
// ⚠ NO DOT ON THE LABEL. The V2.0 strip drew a 2x2 white square beside its mono
// line. DESIGN.md: "a dot marks a STATE, never a credential", and the
// `.f-eyebrow i` rule was deleted on 2026-09-03 along with its five call sites,
// so re-adding the markup renders nothing.

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AppError({
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
    // `.f-appwrap` carries the 1180px measure and the side gutter and no
    // vertical rhythm — `.f-appshell` normally supplies that, and this page has
    // no shell. The two numbers are the shell's own, so the card sits where the
    // first tray of every other app screen sits.
    <div className="f-appwrap" style={{ paddingTop: 34, paddingBottom: 60 }}>
      <div className="f-tray" style={{ maxWidth: 620, margin: '0 auto' }}>
        <div className="f-core">
          <p className="f-blab">Something went wrong</p>
          <h1 className="f-h2">We could not load this page.</h1>
          <p className="f-sub" style={{ marginTop: 14 }}>
            This is usually because you have been signed out. Your results are safe and
            nothing has been lost. Signing back in usually sorts it.
          </p>

          <div className="f-btns" style={{ marginTop: 24 }}>
            <Link href="/auth/login?next=/results-dashboard" className="f-btn">
              Sign in again
              <span className="f-pip" aria-hidden="true">&rarr;</span>
            </Link>
            <button type="button" onClick={reset} className="f-btn f-btn-ghost">
              Try again
            </button>
          </div>

          <p className="f-fine" style={{ marginTop: 24 }}>
            Still stuck? Email{' '}
            <a href="mailto:support@andro-prime.com" className="f-tlink">
              support@andro-prime.com
            </a>
            {error.digest ? ` and quote reference ${error.digest}.` : '.'}
          </p>
        </div>
      </div>
    </div>
  )
}
