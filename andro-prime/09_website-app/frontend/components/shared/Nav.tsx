'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import { hrefFor, isCrossHost } from '@/lib/hosts'

type NavVariant = 'marketing' | 'lp' | 'app'

interface NavProps {
  variant?: NavVariant
  lpCtaText?: string
  lpCtaHref?: string
  /**
   * The hostname this page is being served on, from the layout via
   * lib/hosts-server.ts. Required because the nav is the one component that
   * renders on BOTH hosts and links in both directions.
   *
   * It cannot be inferred from `variant`: /order/confirmed and
   * /subscription/confirmed use the MARKETING variant but are served from the
   * app host (they are authenticated pages living in the (marketing) route
   * group), so variant and host genuinely disagree there.
   */
  currentHost?: string | null
  /**
   * Whether MEMBERSHIP_ENABLED is on, read by the (app) layout and passed down.
   * This component is a client component and cannot read the flag itself.
   * Defaults to false, so the app variant is byte-identical to before
   * membership existed whenever the caller does not pass it.
   */
  membershipEnabled?: boolean
}

/**
 * A link that knows which host it is on.
 *
 * Same host: a next/link, so client-side navigation and prefetch still work.
 * Cross host: a plain <a>, because next/link CANNOT client-navigate across
 * origins. Left as a Link it would client-render the target page on the wrong
 * host and bypass the middleware redirect entirely, which is the failure this
 * component exists to prevent.
 */
function HostLink({
  href,
  currentHost,
  className,
  ariaLabel,
  onClick,
  dataNavLink,
  children,
}: {
  href: string
  currentHost?: string | null
  className?: string
  ariaLabel?: string
  onClick?: () => void
  dataNavLink?: boolean
  children: React.ReactNode
}) {
  const resolved = hrefFor(href, currentHost)

  if (isCrossHost(href, currentHost)) {
    return (
      <a
        href={resolved}
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
        data-navlink={dataNavLink ? '' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={resolved}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
      data-navlink={dataNavLink ? '' : undefined}
    >
      {children}
    </Link>
  )
}

const marketingLinks = [
  { label: 'Tests', href: '/kits' },
  { label: 'Supplements', href: '/supplements' },
  // Founding-member nav link removed 2026-06-04 (FM take-down: see low-T routing decision).
  { label: 'Blog', href: '/blog' },
]

const appLinks = [
  { label: 'Results', href: '/results-dashboard' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'Account', href: '/account' },
]

/**
 * Restyled into Direction F on 2026-08-30 from design/mockups/journey/chrome-F.html
 * Frames AF (three variants) and AG (drawer, scrolled state).
 *
 * 🔴 chrome-F.html IS NOT APPROVED. This is built so it can be judged running.
 *
 * NOTHING ABOUT THE BEHAVIOUR CHANGED, only the classes. The host-aware
 * HostLink, the POST-form logout, the three variants, the membership flag, the
 * scroll listener and the resize-closes-drawer effect are all as they were. The
 * two rules that are load-bearing and easy to undo by accident:
 *
 *   Logout is a FORM POST and must never become a link. This nav is fixed, so
 *   it is always in the viewport, and Next prefetches links that enter it: as a
 *   GET it signed people out with no click at all.
 *
 *   Cross-host links must stay plain <a>. next/link cannot navigate across
 *   origins and would client-render the target on the wrong host, bypassing the
 *   middleware redirect.
 *
 * The F frame draws the mark as a CSS box with border-radius 7px. Not
 * reproduced: Keith approved the Interlocked AP the same day and it has no
 * container, so that radius is moot. <Logo /> renders the real asset.
 */
export function Nav({
  variant = 'marketing',
  lpCtaText,
  lpCtaHref,
  currentHost,
  membershipEnabled = false,
}: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop. The breakpoint is 900 to match the
  // .f-navlinks / .f-burger media queries in f-primitives.css; at 768 the drawer
  // stayed open while the desktop links were already showing.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Membership sits next to Results because it is the same picture, not a
  // billing page: the retest, the trend and the daily loop all live there.
  // Appended rather than inserted, so the existing three keep their order.
  const links =
    variant === 'app'
      ? membershipEnabled
        ? [...appLinks, { label: 'Membership', href: '/membership' }]
        : appLinks
      : marketingLinks
  const showLinks = variant !== 'lp'

  const ctaConfig =
    variant === 'lp'
      ? { text: lpCtaText ?? 'Order Now', href: lpCtaHref ?? '#order' }
      : variant === 'marketing'
        ? { text: 'Choose your test', href: '/kits' }
        : variant === 'app'
          ? { text: 'Log Out', href: '/auth/logout' }
        : null

  // Logout must be a POST form, never a <Link>. Next.js prefetches links that enter
  // the viewport, and this nav is `fixed`, so a GET logout signed users out with no
  // click at all. See the note in app/auth/logout/route.ts.
  const isLogoutCta = variant === 'app'

  return (
    /* The <header> banner landmark. Measured 2026-08-31: the site had 1 <main>,
       1 <nav> and 1 <footer> but ZERO <header> on all six F routes. Wrapping
       rather than renaming, because the mobile drawer sits outside .f-navshell
       and carries nav links of its own, so <nav> has to stay where it is. The
       wrapper is unclassed and .f-nav is position:fixed, so it adds a zero-height
       block to the flow and changes nothing visually. */
    <header>
    <nav aria-label="Primary" className="f-nav f-page">
      <div className={`f-navshell${scrolled ? ' f-scrolled' : ''}`}>

        <HostLink
          href={variant === 'app' ? '/results-dashboard' : '/'}
          currentHost={currentHost}
          className="flex items-center"
          ariaLabel="Andro Prime home"
        >
          <Logo variant="dark" className="h-4 w-auto" />
        </HostLink>

        {showLinks && (
          <span className="f-navlinks">
            {links.map((link) => (
              <HostLink key={link.href} href={link.href} currentHost={currentHost}>
                {link.label}
              </HostLink>
            ))}
          </span>
        )}

        <span className="f-navright">
          {variant === 'marketing' && (
            <span className="f-navstat">
              <i />
              UKAS lab online
            </span>
          )}

          {variant === 'marketing' && (
            <HostLink href="/auth/login" currentHost={currentHost} className="f-navlogin">
              Log in
            </HostLink>
          )}

          {ctaConfig &&
            (isLogoutCta ? (
              // Logout is a POST, never a link. See app/auth/logout/route.ts.
              <form action="/auth/logout" method="post" className="f-navcta-wrap">
                <button type="submit" className="f-navcta">
                  {ctaConfig.text}
                </button>
              </form>
            ) : (
              <span className="f-navcta-wrap">
                <HostLink href={ctaConfig.href} currentHost={currentHost} className="f-navcta">
                  {ctaConfig.text}
                </HostLink>
              </span>
            ))}

          {showLinks && (
            <button
              type="button"
              className="f-burger"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </span>
      </div>

      {showLinks && menuOpen && (
        <div className="f-drawer">
          {links.map((link) => (
            <HostLink
              key={link.href}
              href={link.href}
              currentHost={currentHost}
              dataNavLink
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </HostLink>
          ))}
          {variant === 'marketing' && (
            <HostLink
              href="/auth/login"
              currentHost={currentHost}
              dataNavLink
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </HostLink>
          )}
          {ctaConfig &&
            (isLogoutCta ? (
              // Logout is a POST, never a link. See app/auth/logout/route.ts.
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="f-navcta w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  {ctaConfig.text}
                </button>
              </form>
            ) : (
              <HostLink
                href={ctaConfig.href}
                currentHost={currentHost}
                className="f-navcta block"
                onClick={() => setMenuOpen(false)}
              >
                {ctaConfig.text}
              </HostLink>
            ))}
        </div>
      )}
    </nav>
    </header>
  )
}
