// Consent-copy version strings. Bump the relevant version (and the on-screen
// copy it points at) together whenever the wording changes — the stored consent
// record must point at exactly what the customer was shown (Art 7(1)
// accountability), mirroring LOWT_NURTURE_CONSENT_VERSION.
//
// NOTE: these live here, not in a route.ts or a 'use server' actions file's
// public surface, so they can be imported freely without tripping Next.js's
// route/segment export validation in `next build`.

// Wellness health-data processing consent (Art 9(2)(a)) captured at signup —
// see app/auth/consent/page.tsx + consentAction. Copy approved CA-018
// (Ewa + Keith, 2026-06-23). Half 1 of ClickUp task 34.
export const HEALTH_PROCESSING_CONSENT_VERSION = '2026-06-23-v1'
