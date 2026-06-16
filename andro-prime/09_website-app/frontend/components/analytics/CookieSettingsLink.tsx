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
      className="text-base font-serif text-black hover:underline transition-colors text-left"
    >
      Cookie Settings
    </button>
  )
}
