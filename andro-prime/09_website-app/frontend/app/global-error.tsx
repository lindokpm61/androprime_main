'use client'

// The last resort: the boundary for a failure in the ROOT LAYOUT itself. Next
// replaces `app/layout.tsx` with this file, so it has to render its own <html>
// and <body> — and that is also why it cannot use a class from the stylesheets.
// The global CSS is imported by the root layout, and the root layout is the
// thing that has just failed, so `.f-page`, `.f-h2` and every token in
// `tokens/colours.css` may be absent from the document this renders into.
//
// ─────────────────────────────────────────────────────────────────────────────
// REBUILT IN DIRECTION F, 2026-09-14 (defect register C2).
// ─────────────────────────────────────────────────────────────────────────────
//
// 🔴 IT WAS NOT V2.0. IT WAS NOTHING. The previous version was an unstyled
// `<h2>` and `<p>` on the browser's default white: Times at default sizes,
// flush to the top-left corner, with no brand mark and no ground. C2 lists it
// with the other two boundaries because it was missed by the same sweeps for
// the same reason — an error boundary has no route — but the defect here is the
// absence of any design at all rather than a retired one.
//
// 🔴 THE VALUES ARE LITERALS AND THAT IS DELIBERATE, NOT DRIFT. Everywhere else
// in this codebase a hard-coded hex is a defect, because a token can be changed
// in one place. This file is the one surface that cannot read a token: a
// `var(--ink)` here resolves to nothing when the stylesheet did not load, and
// `color: ` with no value means the UA default — so the page would degrade to
// exactly the unstyled screen this replaces. The five values below are copied
// from `styles/tokens/colours.css` (--ink, --ink-2, --paper, --tray, --hair)
// and the two families from `styles/tokens/typography.css`. If the palette
// moves, move these with it; `verify-design-tokens.js` cannot see them.
//
// THE TWO SENTENCES ARE BYTE IDENTICAL. The heading and the body are the
// strings that shipped. Two things are added and neither is a proposition: the
// document now declares `lang="en"`, which it never did, and the card carries
// the words "Andro Prime" as a mark, because the page it replaces gave a
// customer no indication of whose site had just failed. A company name on its
// own error page is a mark rather than copy, so no pre-flight is owed.
//
// ⚠ NO REFERENCE NUMBER HERE, THOUGH BOTH OTHER BOUNDARIES SHOW ONE. They pair
// it with "Email support@andro-prime.com and quote reference X", and the digest
// is only useful because that sentence tells the reader where to send it. This
// page carries no support address — putting one here means new customer-facing
// copy on a surface nobody has pre-flighted — so a bare reference would be a
// number with nowhere to go.

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

// The stand-in faces' own fallbacks, taken from the token file rather than
// invented: Newsreader falls back to Georgia, Source Sans 3 to the system sans.
const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#FFFFFF', color: '#0A0B0D', fontFamily: SANS }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
          }}
        >
          <div style={{ maxWidth: 560, width: '100%' }}>
            {/* The tray/core pair is the direction's governing idea and it is
                the one thing worth carrying here by hand: a recessed grey well
                holding a raised white card, concentric radii, one very large
                very soft shadow. Without the stylesheet this is the only thing
                saying the page belongs to anybody. */}
            <div style={{ background: '#F1F2F4', borderRadius: 28, padding: 6 }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 22,
                  padding: '34px 32px',
                  boxShadow: '0 26px 60px -20px rgba(10,11,13,.16), 0 6px 18px -12px rgba(10,11,13,.10)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 12px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 11.5,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: '#4A4F57',
                  }}
                >
                  Andro Prime
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: SERIF,
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: '-0.018em',
                    lineHeight: 1.12,
                  }}
                >
                  Something went wrong
                </h2>
                <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.68, color: '#4A4F57' }}>
                  Our team has been notified. Please try again or refresh the page.
                </p>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
