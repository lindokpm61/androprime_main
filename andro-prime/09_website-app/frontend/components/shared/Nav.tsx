'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type NavVariant = 'marketing' | 'lp' | 'app'

interface NavProps {
  variant?: NavVariant
  lpCtaText?: string
  lpCtaHref?: string
}

const marketingLinks = [
  { label: 'Tests', href: '/kits' },
  { label: 'Supplements', href: '/supplements' },
  { label: 'Founding Member', href: '/founding-member' },
  { label: 'Blog', href: '/blog' },
]

const appLinks = [
  { label: 'Results', href: '/results-dashboard' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'Account', href: '/account' },
]

export function Nav({ variant = 'marketing', lpCtaText, lpCtaHref }: NavProps) {
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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ${
        scrolled ? 'border-b-4 border-black' : 'border-b border-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href={variant === 'app' ? '/results-dashboard' : '/'}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-sans font-black text-lg leading-none tracking-tighter transition-transform group-hover:scale-105">
            AP
          </div>
          <span className="text-black font-black font-sans uppercase tracking-tighter text-2xl">
            AndroPrime
          </span>
        </Link>

        {/* Desktop nav links */}
        {showLinks && (
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold font-sans uppercase tracking-widest text-black hover:underline transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
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

          {ctaConfig && (
            <Link
              href={ctaConfig.href}
              className="hidden md:flex bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-5 py-2.5 transition-colors items-center gap-2"
            >
              {ctaConfig.text}
            </Link>
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
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-black font-sans uppercase tracking-widest text-black"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {ctaConfig && (
              <Link
                href={ctaConfig.href}
                className="bg-black text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-5 py-3 text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                {ctaConfig.text}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
