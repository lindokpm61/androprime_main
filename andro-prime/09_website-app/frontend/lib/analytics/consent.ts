// Client-side cookie-consent state for analytics (PECR / UK GDPR).
//
// Phase 1 analytics (the server-side first-party `events` table + GA4 Measurement
// Protocol mirror) is consent-FREE: no cookies, no client SDK. THIS module governs
// Phase 2 only — the client-side GA4 tag (`gtag`), which DOES set non-essential
// cookies and therefore must not fire until the visitor opts in.
//
// The choice itself is stored in localStorage, not a cookie. Storing a consent
// preference is "strictly necessary" under PECR, so it needs no prior consent;
// using localStorage (rather than a cookie) keeps it off every HTTP request too.
//
// Design: analytics is the only togglable category. Ad storage / personalisation
// stay permanently denied (we run no ad pixels and the server mirror already sets
// `non_personalized_ads: true`). If ad pixels are ever added, extend ConsentState
// and the Consent Mode mapping in GoogleAnalytics.tsx rather than reworking this.

export type ConsentValue = 'granted' | 'denied'

export const CONSENT_STORAGE_KEY = 'ap_cookie_consent'

/** Fired on the window whenever the stored consent value changes. */
export const CONSENT_EVENT = 'ap:consent-change'

/** Fired on the window to (re)open the preferences banner, e.g. from a footer link. */
export const CONSENT_OPEN_EVENT = 'ap:consent-open'

/** Returns the stored choice, or null if the visitor has not decided yet. */
export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/** Persists the choice and notifies listeners (the GA loader updates Consent Mode). */
export function setConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // storage may be blocked (private mode / hardened browser); the consent
    // default stays 'denied' for the session, which is the safe outcome.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }))
}

/** Opens the consent banner so a visitor can change a previous choice. */
export function openConsentPreferences(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}
