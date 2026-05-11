---
title: Environment Variables Reference
updated: 2026-04-27
---

Complete reference for all environment variables used by the Andro Prime Next.js app.
For Coolify deployment instructions see `deployment/coolify/deploy.md`.

**Status key:** ✅ configured locally | ⏳ pending external service | 🚫 not yet available

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

> Current project: EU Frankfurt. DPA must be signed before processing live user data.

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
| `STRIPE_PRICE_FOUNDING_MEMBER` | Runtime | ✅ | Founding Member deposit (£75) |

> Locally configured with test keys. Switch to live keys for production deployment.

---

## Vitall (lab partner)

| Variable | Type | Status | Notes |
|---|---|---|---|
| `VITALL_API_KEY` | Runtime | 🚫 | Not yet — Vitall contract not signed. Dispatch stub is active. |
| `VITALL_WEBHOOK_SECRET` | Runtime | 🚫 | Not yet — agreed at contract signing |

---

## Customer.io

| Variable | Type | Status | Notes |
|---|---|---|---|
| `CUSTOMERIO_SITE_ID` | Runtime | ✅ | CIO → Settings → API Credentials |
| `CUSTOMERIO_API_KEY` | Runtime | ✅ | CIO → Settings → API Credentials |

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
| `GA4_MEASUREMENT_ID` | Runtime | ⏳ | Server-side GA4 events |
| `GA4_API_SECRET` | Runtime | ⏳ | GA4 Measurement Protocol API secret |
| `META_PIXEL_ID` | Runtime | ⏳ | Meta Conversions API |
| `META_ACCESS_TOKEN` | Runtime | ⏳ | Meta Conversions API system user token |
