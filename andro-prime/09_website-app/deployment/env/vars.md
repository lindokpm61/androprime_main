---
title: Environment Variables Reference
updated: 2026-07-26
---

Complete reference for all environment variables used by the Andro Prime Next.js app.
For Coolify deployment instructions see `deployment/coolify/deploy.md`.

**Status key:** ✅ configured locally | ⏳ pending external service | 🚫 not yet available

> **Source of truth:** this file is reconciled against the actual `process.env.*` reads in `frontend/` (last swept 2026-07-26). Feature flags are absent-means-OFF: they only need to exist in Coolify to turn a feature ON. Platform-set (`NODE_ENV`, `CI`, `NEXT_RUNTIME`), local-only e2e (`E2E_*`), and content-engine script vars (`CLICKUP_API_TOKEN`, `UNSPLASH_ACCESS_KEY`, `CONTENT_ENGINE_BASE_URL`, `GITHUB_STEP_SUMMARY`) are deliberately not listed as app-runtime vars.

---

## Site

| Variable | Type | Status | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Build | ✅ | `http://localhost:3000` locally; `https://andro-prime.com` in production |

---

## Supabase

| Variable | Type | Status | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Build | ✅ | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Build | ✅ | Supabase's new name for the anon/public key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build | ✅ | Legacy name — both are accepted by the app |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime | ✅ | Never expose client-side — used only in API routes |

> Current project: Ireland region. DPA incorporated via Supabase's standard terms (no separately signed DPA).

---

## Stripe

| Variable | Type | Status | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Build | ✅ | pk_test_* locally; pk_live_* in production |
| `STRIPE_SECRET_KEY` | Runtime | ✅ | sk_test_* locally; sk_live_* in production |
| `STRIPE_WEBHOOK_SECRET` | Runtime | ✅ | whsec_* — from Stripe webhook endpoint signing secret |
| `STRIPE_PRICE_KIT_1` | Runtime | ✅ | Kit 1 — Testosterone Health Check (£99 — v2.2) |
| `STRIPE_PRICE_KIT_2` | Runtime | ✅ | Kit 2 — Energy & Recovery (£119 — v2.2) |
| `STRIPE_PRICE_KIT_3` | Runtime | ✅ | Kit 3 — Hormone & Recovery (£179 — v2.2) |
| `STRIPE_PRICE_DAILY_STACK` | Runtime | ✅ | Daily Stack subscription (£34.95/mo) |
| `STRIPE_PRICE_COLLAGEN` | Runtime | ✅ | Collagen subscription (£29.95/mo) |
| `STRIPE_PRICE_COMPLETE_STACK` | Runtime | ✅ | Complete Men's Stack (TBC) |
| `STRIPE_PRICE_BUNDLE_CONFIRMATION` | Runtime | ✅ | Recheck bundle £169 (created 2026-07-25). Resolved via `lib/bundles/config.ts`; only used when `BUNDLES_ENABLED` is on |
| `STRIPE_PRICE_BUNDLE_PROVEIT` | Runtime | ✅ | Prove-It bundle £199 (created 2026-07-25) |
| `STRIPE_PRICE_BUNDLE_FULLPICTURE` | Runtime | ✅ | Full-picture bundle £259 (created 2026-07-25) |
| `STRIPE_COUPON_SUBSCRIBER10` | Runtime | ⏳ | Optional: subscriber kit discount. Discount only applied if the coupon id is set (`app/api/checkout/kit/route.ts`) |
| `STRIPE_COUPON_LAUNCHDAY10` | Runtime | ⏳ | Optional: launch-day kit discount. Same conditional behaviour |

> Locally configured with test keys. Switch to live keys for production deployment.
> The three `STRIPE_PRICE_BUNDLE_*` prices back the two-kit bundle mechanism; SKU->env mapping is in `lib/bundles/config.ts`.

---

## Retired env vars

| Variable                       | Retired    | Notes                                                                                                                                              |
| ------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STRIPE_PRICE_FOUNDING_MEMBER` | 2026-05-08 | £75 deposit mechanic shelved. Stripe Price object should be archived (not deleted) in the Stripe dashboard so historical receipts still resolve.   |

---

## Vitall (lab partner)

| Variable | Type | Status | Notes |
|---|---|---|---|
| `VITALL_CLIENT_ID` | Runtime | 🚫 | OAuth client id for Vitall's API (`lib/vitall/client.ts`). Replaces the old `VITALL_API_KEY` name in the code |
| `VITALL_CLIENT_SECRET` | Runtime | 🚫 | OAuth client secret (`lib/vitall/client.ts`) |
| `VITALL_WEBHOOK_SECRET` | Runtime | 🚫 | Verifies inbound Vitall result webhooks (`app/api/webhooks/vitall/route.ts`) |
| `VITALL_SANDBOX` | Runtime | ⏳ | Optional toggle: point the client at Vitall's sandbox base URL |

---

## Customer.io

| Variable | Type | Status | Notes |
|---|---|---|---|
| `CUSTOMERIO_SITE_ID` | Runtime | ✅ | CIO → Settings → API Credentials |
| `CUSTOMERIO_API_KEY` | Runtime | ✅ | CIO → Settings → API Credentials |
| `CUSTOMERIO_EU` | Runtime | ✅ | Set truthy for the EU region (workspace 219186 is EU); routes API calls to the EU host (`lib/customerio/emit.ts`) |
| `OPS_ALERT_EMAIL` | Runtime | ⏳ | Internal ops-alert recipient (e.g. lab-order-cancelled). Alerts skip if unset |

---

## QStash (Upstash job queue)

| Variable | Type | Status | Notes |
|---|---|---|---|
| `QSTASH_TOKEN` | Runtime | ✅ | Used to publish jobs |
| `QSTASH_CURRENT_SIGNING_KEY` | Runtime | ✅ | Used to verify incoming QStash requests |
| `QSTASH_NEXT_SIGNING_KEY` | Runtime | ✅ | Rotated key — keep both active |

---

## FirstPromoter (affiliate tracking)

| Variable | Type | Status | Notes |
|---|---|---|---|
| `FIRSTPROMOTER_API_KEY` | Runtime | ⏳ | Set up account first |
| `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` | Build | ⏳ | Client-side tracking script ID |

---

## Monitoring — Sentry

| Variable | Type | Status | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Build | ⏳ | Sentry project DSN |
| `SENTRY_AUTH_TOKEN` | Runtime | ⏳ | For source map uploads at build time |
| `SENTRY_ORG` | Runtime | ⏳ | Sentry org slug |
| `SENTRY_PROJECT` | Runtime | ⏳ | Sentry project slug |

---

## Analytics

| Variable | Type | Status | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Build | ✅ | `andro-prime.com` in production; `localhost` locally |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Build | ⏳ | Client-side GA4 (gtag) + cookie-consent gating (`components/analytics/*`). Distinct from the server `GA4_MEASUREMENT_ID` |
| `GA4_MEASUREMENT_ID` | Runtime | ⏳ | Server-side GA4 events (Measurement Protocol) |
| `GA4_API_SECRET` | Runtime | ⏳ | GA4 Measurement Protocol API secret |
| `META_PIXEL_ID` | Runtime | ⏳ | Meta Conversions API |
| `META_ACCESS_TOKEN` | Runtime | ⏳ | Meta Conversions API system user token |

---

## Internal-route secrets

| Variable | Type | Status | Notes |
|---|---|---|---|
| `REVALIDATE_SECRET` | Runtime | ✅ | Bearer secret for `POST /api/revalidate` (content-engine triggers ISR revalidation) |
| `PREVIEW_SECRET` | Runtime | ✅ | Guards the blog draft-preview route (`/blog/preview/[slug]`) |

---

## Feature flags

Dark-launch flags read live from the environment on every call (`lib/flags.ts`, plus `MAINTENANCE_OFFER_ENABLED` in `lib/results/classifier.ts`). **Absent means OFF** (strict `=== 'true'`): a flag only needs to exist in Coolify, set to `true`, to turn its feature ON. With a flag unset the app is byte-identical to before that feature existed. Do not set to `false` expecting anything different from absent.

| Variable | Enables | Status | Notes |
|---|---|---|---|
| `BUNDLES_ENABLED` | Two-kit bundles | 🚫 OFF | Gates every bundle surface (kit-page option, checkout branch, Stripe webhook insert, result-hook trigger, daily sweep). Needs the 3 `STRIPE_PRICE_BUNDLE_*` + `ACCOUNT_ADDRESS_ENABLED` alongside it |
| `ACCOUNT_ADDRESS_ENABLED` | `/account` delivery-address surface | 🚫 OFF | The self-serve address editor the bundle address-check email links to. Flip ON with `BUNDLES_ENABLED` so the email never links to a dark surface |
| `KIT_SCOPE_NOTE_ENABLED` | Kit 1 "what this test did not tell you" note | ✅ ON | Set `true` 2026-07-19 (CA-025) |
| `ACCOUNT_DATA_CONTROLS_ENABLED` | Account data/privacy section (export + erasure) | 🚫 OFF | Gated on the erasure ops-alert address + SLA (CA-024) |
| `GP_HANDOFF_ENABLED` | GP handoff pack on GP-referral results | 🚫 OFF | Pending Ewa sign-off on the template |
| `RETEST_REMINDER_ENABLED` | Retest-reminder CIO attribute stamp | 🚫 OFF | Pending the reminder email sign-off + campaign |
| `MAINTENANCE_OFFER_ENABLED` | Maintenance offer in the results classifier | 🚫 OFF | `lib/results/classifier.ts` |
