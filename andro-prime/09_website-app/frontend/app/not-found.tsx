import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { urlFor } from '@/lib/hosts'

// The 404, added 2026-08-29. Until then there was no not-found.tsx anywhere in
// the app, so every mistyped URL, dead inbound link and expired share served
// Next's own default 404: no logo, no nav, no footer and no route back into the
// site. Found by the mockup coverage audit, which went looking for undrawn
// surfaces and turned up an unbuilt one.
//
// THE NAV AND FOOTER ARE RENDERED HERE, NOT INHERITED, and that is deliberate.
// This file renders inside the ROOT layout only: an unmatched URL matched no
// route in any group, so (marketing)/layout.tsx never runs and its chrome never
// arrives. Verified 2026-08-29 in a real browser on a production build, because
// the doubling risk runs the other way too: notFound() is thrown from six
// places inside route groups (a missing author, a missing article, a bad
// preview token, and the two flag-dark app routes when their flag is off), and
// if those rendered this file INSIDE their group layout there would be two navs
// and two footers. They do not. /blog/<missing> and /authors/<missing> render
// exactly this, once. If a Next upgrade changes that, the fix is a
// not-found.tsx per route group holding the body without the chrome.
//
// Known edge, not worth a file today: a signed-in customer hitting one of the
// two flag-dark app routes gets this page with the MARKETING nav rather than
// the app one. Both routes are dark behind flags and unreachable in production.

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
      <Nav variant="marketing" />
      <main id="main-content" className="pt-20">
        <div className="flex justify-center w-full min-h-[60vh] pb-24">
          <div className="w-full max-w-[560px] px-6 pt-16 flex flex-col gap-8">
            <p className="data-label">Error 404</p>
            <h1 className="font-black font-sans text-3xl uppercase tracking-tighter">
              This page doesn&rsquo;t exist.
            </h1>
            <p className="font-serif text-[15px] leading-relaxed">
              The link may be broken, or the page may have moved. Nothing has gone
              wrong on our side, and there is nothing you need to do.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/kits"
                className="border-2 border-black bg-black px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-white text-center transition hover:bg-white hover:text-black"
              >
                Choose your test
              </Link>
              <Link
                href="/"
                className="border-2 border-black bg-white px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-black text-center transition hover:bg-black hover:text-white"
              >
                Back to home
              </Link>
            </div>

            <div className="border-t-2 border-black pt-6">
              <p className="data-label mb-4">Or go straight to</p>
              <ul className="flex flex-col gap-3">
                {routesBack.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="font-serif text-[15px] underline hover:no-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  {/*
                    The app host, so a plain <a> and an absolute URL. next/link
                    cannot client-navigate across origins: left as a Link it
                    would client-render the sign-in page on the marketing host
                    and bypass the middleware redirect. Same rule the nav follows.
                  */}
                  <a
                    href={urlFor('/auth/login')}
                    className="font-serif text-[15px] underline hover:no-underline"
                  >
                    Sign in to your results
                  </a>
                </li>
              </ul>
            </div>

            <p className="font-serif text-sm text-gray-600">
              If you followed a link from us and it brought you here, tell us at{' '}
              <a href="mailto:support@andro-prime.com" className="underline">
                support@andro-prime.com
              </a>{' '}
              and we will put it right.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
