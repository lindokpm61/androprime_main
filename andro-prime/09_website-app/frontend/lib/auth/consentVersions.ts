// Consent-copy version strings. Bump the relevant version (and the on-screen
// copy it points at) together whenever the wording changes — the stored consent
// record must point at exactly what the customer was shown (Art 7(1)
// accountability), mirroring LOWT_NURTURE_CONSENT_VERSION.
//
// NOTE: these live here, not in a route.ts or a 'use server' actions file's
// public surface, so they can be imported freely without tripping Next.js's
// route/segment export validation in `next build`.

// Wellness health-data processing consent (Art 9(2)(a)) captured at the POINT OF
// PURCHASE (checkout) — see components/commerce/CheckoutDetailsForm.tsx,
// app/api/checkout/kit/route.ts (enforces + forwards via Stripe metadata) and
// app/api/webhooks/stripe/route.ts (stamps users.health_processing_consent_* on
// order creation). Placed at checkout, not behind the results dashboard, so the
// consent is freely given as part of deciding to buy and is never a wall in front
// of results the customer already paid for (UK GDPR "freely given"). Copy approved
// CA-018 (Ewa + Keith, 2026-06-23). ClickUp task 34, Half 1.
export const HEALTH_PROCESSING_CONSENT_VERSION = '2026-06-23-v1'
