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
  children,
}: {
  href: string
  currentHost?: string | null
  className?: string
  ariaLabel?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  const resolved = hrefFor(href, currentHost)

  if (isCrossHost(href, currentHost)) {
    return (
      <a href={resolved} className={className} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={resolved} className={className} aria-label={ariaLabel} onClick={onClick}>
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

export function Nav({ variant = 'marketing', lpCtaText, lpCtaHref, currentHost }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const links = variant === 'app' ? appLinks : marketingLinks
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
    <nav
      aria-label="Primary"
      className={`fixed top-0 left-0 w-full z-50 bg-white ${
        scrolled ? 'border-b-4 border-black' : 'border-b border-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <HostLink
          href={variant === 'app' ? '/results-dashboard' : '/'}
          currentHost={currentHost}
          className="group flex items-center"
          ariaLabel="Andro Prime home"
        >
          <Logo
            variant="dark"
            className="h-8 w-auto"
          />
        </HostLink>

        {/* Desktop nav links */}
        {showLinks && (
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {links.map((link) => (
              <HostLink
                key={link.href}
                href={link.href}
                currentHost={currentHost}
                className="text-sm font-bold font-sans uppercase tracking-widest text-black hover:underline whitespace-nowrap"
              >
                {link.label}
              </HostLink>
            ))}
          </div>
        )}

        {/* Right side: status + CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          {variant === 'marketing' && (
            <div className="hidden xl:flex items-center gap-2 mr-4 data-label text-[10px] whitespace-nowrap">
              <span className="status-dot" />
              UKAS Lab Online
            </div>
          )}

          {variant === 'marketing' && (
            <HostLink
              href="/auth/login"
              currentHost={currentHost}
              className="hidden md:block text-sm font-bold font-sans uppercase tracking-widest text-black hover:underline whitespace-nowrap"
            >
              Log in
            </HostLink>
          )}

          {ctaConfig && (
            isLogoutCta ? (
              // Logout is a POST, never a link. See app/auth/logout/route.ts.
              <form action="/auth/logout" method="post" className="hidden md:flex">
                <button
                  type="submit"
                  className="bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-5 py-2.5 transition-colors flex items-center gap-2"
                >
                  {ctaConfig.text}
                </button>
              </form>
            ) : (
              <HostLink
                href={ctaConfig.href}
                currentHost={currentHost}
                className="hidden md:flex bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-5 py-2.5 transition-colors items-center gap-2"
              >
                {ctaConfig.text}
              </HostLink>
            )
          )}

          {showLinks && (
            <button
              className="md:hidden text-black p-2"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {showLinks && menuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
            {links.map((link) => (
              <HostLink
                key={link.href}
                href={link.href}
                currentHost={currentHost}
                className="text-lg font-black font-sans uppercase tracking-widest text-black"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </HostLink>
            ))}
            {variant === 'marketing' && (
              <HostLink
                href="/auth/login"
                currentHost={currentHost}
                className="text-lg font-black font-sans uppercase tracking-widest text-black"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </HostLink>
            )}
            {ctaConfig && (
              isLogoutCta ? (
                // Logout is a POST, never a link. See app/auth/logout/route.ts.
                <form action="/auth/logout" method="post" className="contents">
                  <button
                    type="submit"
                    className="bg-black text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-5 py-3 text-center mt-2 w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    {ctaConfig.text}
                  </button>
                </form>
              ) : (
                <HostLink
                  href={ctaConfig.href}
                  currentHost={currentHost}
                  className="bg-black text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-5 py-3 text-center mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {ctaConfig.text}
                </HostLink>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
