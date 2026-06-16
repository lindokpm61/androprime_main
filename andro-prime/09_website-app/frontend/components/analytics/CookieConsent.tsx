'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CONSENT_OPEN_EVENT, getConsent, setConsent } from '@/lib/analytics/consent'

/**
 * Cookie-consent banner (PECR / UK GDPR).
 *
 * Shows once, until the visitor makes a choice, then stays hidden unless reopened
 * via the footer "Cookie settings" link (openConsentPreferences -> CONSENT_OPEN_EVENT).
 *
 * Accept and Reject are given equal visual weight: the ICO requires rejecting
 * non-essential cookies to be as easy as accepting them. Choosing either records a
 * decision; GoogleAnalytics.tsx reacts to it via the consent-change event.
 *
 * Renders nothing if client-side GA is not configured — no tag means no
 * non-essential cookies, so no banner is required.
 */
export default function CookieConsent() {
  const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!gaEnabled) return
    // Decide visibility only after mount to avoid an SSR/client hydration mismatch.
    if (getConsent() === null) setVisible(true)
    const reopen = () => setVisible(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [gaEnabled])

  if (!gaEnabled || !visible) return null

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t-4 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="lg:flex-1">
          <h2 className="font-sans font-black uppercase tracking-tighter text-lg text-black mb-2">
            Cookies
          </h2>
          <p className="font-serif text-base leading-relaxed text-black max-w-2xl">
            We use essential cookies to run this site. With your permission we also use
            Google Analytics cookies to understand how the site is used so we can improve
            it. You can change your choice any time from the footer. See our{' '}
            <Link href="/privacy" className="underline font-semibold">
              Privacy &amp; Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="px-6 py-3 border-2 border-black bg-white text-black font-sans font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
          >
            Reject analytics
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="px-6 py-3 border-2 border-black bg-black text-white font-sans font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  )
}
