'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CONSENT_OPEN_EVENT, getConsent, setConsent } from '@/lib/analytics/consent'

/**
 * Cookie-consent banner (PECR / UK GDPR).
 *
 * Shows once, until the visitor makes a choice, then stays hidden unless reopened
 * via the footer "Cookie settings" link (openConsentPreferences -> CONSENT_OPEN_EVENT).
 *
 * 🔴 ACCEPT AND REJECT MUST KEEP EQUAL VISUAL WEIGHT. The ICO requires rejecting
 * non-essential cookies to be as easy as accepting them. That is a VISUAL
 * requirement with a REGULATORY basis, so it is a design constraint, not a
 * styling preference: matched size, matched hit area, one filled and one
 * outlined. A redesign that turns Reject into a text link breaks a rule nobody
 * would know it was breaking. chrome-F.html Frame AH draws it this way for
 * exactly that reason, having found the rule recorded only in this comment.
 *
 * Choosing either records a decision; GoogleAnalytics.tsx reacts to it via the
 * consent-change event.
 *
 * Renders nothing if client-side GA is not configured: no tag means no
 * non-essential cookies, so no banner is required.
 *
 * Restyled into Direction F 2026-08-30 (Frame AH). 🔴 chrome-F.html is NOT approved.
 */
export default function CookieConsent() {
  const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID)
  const [visible, setVisible] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!gaEnabled) return
    // Decide visibility only after mount to avoid an SSR/client hydration mismatch.
    if (getConsent() === null) setVisible(true)
    const reopen = () => setVisible(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [gaEnabled])

  /*
   * Publish the banner's REAL height as --f-consent-h so a viewport-height hero
   * can lift its content clear of it (see .f-hero-film). Measured, not assumed:
   * the height depends on how the consent copy wraps, and that copy is fixed by
   * PECR / UK GDPR rather than by us, so a hardcoded number would be wrong at
   * the first breakpoint or translation that rewraps it.
   *
   * Found 2026-08-31: at 390x844 the banner covered the primary CTA on all six
   * Direction F routes, and cleared it by 19px at 1440, so the defect was
   * invisible to anyone checking at desktop.
   */
  useEffect(() => {
    const root = document.documentElement
    const clear = () => root.style.removeProperty('--f-consent-h')
    if (!visible) {
      clear()
      return
    }
    const el = wrapRef.current
    if (!el) return
    const publish = () => root.style.setProperty('--f-consent-h', `${Math.ceil(el.getBoundingClientRect().height)}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => {
      ro.disconnect()
      clear()
    }
  }, [visible])

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
      className="f-cookiewrap f-page"
      ref={wrapRef}
    >
      <div className="f-cookie">
        <div>
          <h2 className="f-h4">Cookies</h2>
          <p className="f-sub">
            We use essential cookies to run this site. With your permission we also use
            Google Analytics cookies to understand how the site is used so we can improve
            it. You can change your choice any time from the footer. See our{' '}
            <Link href="/privacy" className="f-cookielink">
              Privacy &amp; Cookie Policy
            </Link>
            .
          </p>
        </div>
        {/* Equal weight, deliberately. See the ICO note above before changing either. */}
        <div className="f-cookieacts">
          <button type="button" onClick={() => choose('denied')} className="f-btn f-btn-sm f-btn-ghost">
            Reject analytics
          </button>
          <button type="button" onClick={() => choose('granted')} className="f-btn f-btn-sm">
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  )
}
