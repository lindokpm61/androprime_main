// The consent-text version the customer agreed to. Bump this (and the copy in
// components/results-engine/BorderlineNurtureConsent.tsx) together whenever the
// wording changes — the stored record must point at exactly what was shown.
// Art 7(1) accountability. Mirrors LOWT_NURTURE_CONSENT_VERSION.
//
// NOTE: this lives here, not in the consent route, because a Next.js `route.ts`
// may only export HTTP handlers + segment config — exporting any other const
// fails `next build` route-type validation.
export const BORDERLINE_NURTURE_CONSENT_VERSION = '2026-06-26-v1'
