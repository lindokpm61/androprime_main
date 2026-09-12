import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { RevealGate } from '@/components/marketing/RevealGate'
import { urlFor } from '@/lib/hosts'

/**
 * The 404, built 2026-08-29 and rebuilt in Direction F on 2026-09-12.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FRAME AI, `design/mockups/journey/chrome-F.html`. Content kept, skin changed.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ⚠ FRAME AI IS A RECORD, NOT A PROPOSAL, and it is the only frame in the
 * journey set that documents something the audit itself caused: until
 * 2026-08-29 there was no `not-found.tsx` anywhere in the app, so every
 * mistyped URL, dead inbound link and expired share served Next's own default
 * 404 — no logo, no nav, no footer, no route back in. The frame drew what had
 * just shipped. So this rebuild takes its CONTENT as settled and makes the two
 * structural decisions the frame could not.
 *
 * EVERY WORD IS VERBATIM. The label, the headline, the standfirst, both button
 * labels, the "Or go straight to" label, all six routes back and the support
 * line are byte-identical to the page built on 2026-08-29.
 *
 * 🔴 THE NAV AND FOOTER ARE RENDERED HERE, NOT INHERITED, and that is unchanged
 * and load-bearing. This file renders inside the ROOT layout only: an unmatched
 * URL matched no route in any group, so `(marketing)/layout.tsx` never runs and
 * its chrome never arrives. Verified 2026-08-29 in a real browser on a
 * production build, because the doubling risk runs the other way too:
 * `notFound()` is thrown from six places inside route groups (a missing author,
 * a missing article, a bad preview token, and the two flag-dark app routes when
 * their flag is off), and if those rendered this file INSIDE their group layout
 * there would be two navs and two footers. They do not. `/blog/<missing>` and
 * `/authors/<missing>` render exactly this, once. If a Next upgrade changes
 * that, the fix is a not-found.tsx per route group holding the body without the
 * chrome.
 *
 * 🔴 `<main>` CARRIED `pt-20`, WHICH IS V2.0's FLUSH-BAR CLEARANCE. Direction
 * F's nav is a floating shell, not a full-width bar, and the marketing layout
 * clears it with `pt-[92px] md:pt-[104px]`. This file supplies its own chrome
 * and therefore its own clearance, and it was still clearing an 80px bar that
 * no longer exists — the same defect batch 3 found on the app layout. The 404
 * is the page nobody opens on purpose, which is exactly why nobody saw it.
 *
 * 🔴 IT ALSO HAD NO `.js` GATE AND NO OBSERVER. `RevealGate` lives in the two
 * layouts that carry F pages, and this file is in neither, so a `.f-rise` here
 * would have been a class nothing ever revealed. The failure is silent and in
 * the safe direction (every hiding rule is scoped under `.js`, so no gate means
 * no hiding), which is why a reveal that never runs looks exactly like a page
 * with no animation. Rendered here for the same reason the nav is.
 *
 * ⚠ NO TRAY, DEPARTING FROM THE FRAME. Frame AI draws the whole 404 inside a
 * `.tray`/`.core` card, which predates the containment ruling of 2026-09-02: a
 * card holds a transaction or an instrument, and an apology is neither. The
 * page is set plainly on the ground instead, at the narrow measure, which is
 * what `/checkout/details` and `/auth/*` do with a single-block page.
 *
 * ⚠ THE SIX ROUTES BACK ARE CHIPS, NOT AN UNDERLINED COLUMN. Frame AI draws a
 * `linkcol`; this system already has a shipped pattern for "a short row of
 * places to go instead", `.f-xlinks` + `.f-kchip` on the auth card, and six
 * underlined serif links stacked in a column reads as a sitemap fragment rather
 * than as an offer. Same six destinations, same order, same words.
 *
 * ⚠ NOT `FPage`. This is a single block with no hero ground and no counted
 * sections, so composing the scaffold would mean a section counter reading
 * `of={0}` and a hero slot nothing fills. `verify-f-scaffold.js` scopes itself
 * to `app/(marketing)` for exactly this reason, and states the rule: a
 * single-card route is Direction F by wearing `.f-page` and the component
 * layer. `app/auth/layout.tsx` is the precedent.
 *
 * Known edge, not worth a file today: a signed-in customer hitting one of the
 * two flag-dark app routes gets this page with the MARKETING nav rather than
 * the app one. Both routes are dark behind flags and unreachable in production.
 */

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const routesBack = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'The three kits', href: '/kits' },
  { label: 'Take the quiz', href: '/test-selector' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <RevealGate />
      <Nav variant="marketing" />
      <main id="main-content" className="f-page pt-[92px] md:pt-[104px]">
        <section className="f-narrow f-sec f-sec-hero">
          <div className="f-rise">
            <div className="f-btns" style={{ marginBottom: 18 }}>
              <span className="f-eyebrow">Error 404</span>
            </div>
            <h1 className="f-h1">This page doesn&rsquo;t exist.</h1>
            <p className="f-stand" style={{ marginTop: 20 }}>
              The link may be broken, or the page may have moved. Nothing has gone wrong on our
              side, and there is nothing you need to do.
            </p>

            {/* The primary action is commerce, not an apology, and Frame AI
                argues it: the most likely arrival is a broken inbound link from
                an ad or a share rather than a customer who mistyped. */}
            <div className="f-btns" style={{ marginTop: 26 }}>
              <Link href="/kits" className="f-btn">
                Choose your test {ARROW}
              </Link>
              <Link href="/" className="f-btn f-btn-ghost">
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <section className="f-narrow f-sec f-sec-cont">
          <div className="f-rise">
            <p className="f-blab">Or go straight to</p>
            <div className="f-xlinks">
              {routesBack.map(({ label, href }) => (
                <Link key={href} href={href} className="f-kchip">
                  {label}
                </Link>
              ))}
              {/*
                The app host, so a plain <a> and an absolute URL. next/link
                cannot client-navigate across origins: left as a Link it would
                client-render the sign-in page on the marketing host and bypass
                the middleware redirect. Same rule the nav follows, and this is
                the one cross-host link on the page.
              */}
              <a href={urlFor('/auth/login')} className="f-kchip">
                Sign in to your results
              </a>
            </div>

            <p className="f-fine" style={{ marginTop: 26 }}>
              If you followed a link from us and it brought you here, tell us at{' '}
              <a href="mailto:support@andro-prime.com" className="f-tlink">
                support@andro-prime.com
              </a>{' '}
              and we will put it right.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
