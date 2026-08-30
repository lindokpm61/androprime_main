'use client'

import { openConsentPreferences } from '@/lib/analytics/consent'

/**
 * Footer trigger to reopen the cookie banner so a visitor can change a prior
 * choice. Renders nothing if client-side GA is not configured (no cookies to
 * manage, so nothing to reopen). Styled to match the surrounding footer links.
 */
export function CookieSettingsLink() {
  if (!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) return null
  return (
    <button
      type="button"
      onClick={openConsentPreferences}
      // Matches the footer's own link rule (.f-foot ul a) rather than restating
      // it. Under V2.0 this was font-serif, which is why it stood out from its
      // siblings once the footer moved to F: it was the one link picking up
      // Merriweather from the base layer.
      className="f-footlink"
    >
      Cookie Settings
    </button>
  )
}
