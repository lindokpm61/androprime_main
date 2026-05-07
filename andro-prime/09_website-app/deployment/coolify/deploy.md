---
title: Coolify Deployment — Andro Prime
updated: 2026-04-27
---

## Prerequisites

- Coolify installed on VPS (EU region — mandatory for UK GDPR)
- Git repo connected to Coolify
- Supabase project provisioned in EU Frankfurt
- Stripe account live (or test for staging)
- Customer.io account active
- Upstash QStash account active

---

## Service Setup in Coolify

**Service type:** Docker (use the Dockerfile at `andro-prime/09_website-app/frontend/Dockerfile`)
**Root directory:** `andro-prime/09_website-app/frontend`
**Dockerfile path:** `Dockerfile` (relative to root directory)
**Port:** `3000`
**Health check path:** `/api/health` (or `/`)

> The Dockerfile uses `output: standalone` — the container is self-contained with no runtime `npm` needed.

---

## Environment Variables

Two types:
- **Build-time** (`NEXT_PUBLIC_*`) — must be set as **Build Arguments** in Coolify (Settings → Build). Baked into the JS bundle at compile time.
- **Runtime** (all others) — set as **Environment Variables** in Coolify (Settings → Environment). Injected at container start.

### Build Arguments (Coolify: Settings → Build → Build Arguments)

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://andro-prime.com` | No trailing slash |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase dashboard | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | from Supabase dashboard | Project Settings → API (anon/public key) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | from Stripe dashboard | Developers → API Keys → Publishable key |
| `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` | from FirstPromoter | Settings → Tracking |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `andro-prime.com` | |
| `NEXT_PUBLIC_SENTRY_DSN` | from Sentry project | Optional — leave blank until Sentry is set up |

### Runtime Environment Variables (Coolify: Settings → Environment Variables)

**Supabase**

| Variable | Source |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key |

**Stripe**

| Variable | Source |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → endpoint → Signing secret |
| `STRIPE_PRICE_KIT_1` | Stripe → Product Catalogue → Kit 1 → Price ID |
| `STRIPE_PRICE_KIT_2` | Stripe → Product Catalogue → Kit 2 → Price ID |
| `STRIPE_PRICE_KIT_3` | Stripe → Product Catalogue → Kit 3 → Price ID |
| `STRIPE_PRICE_DAILY_STACK` | Stripe → Product Catalogue → Daily Stack → Price ID |
| `STRIPE_PRICE_COLLAGEN` | Stripe → Product Catalogue → Collagen → Price ID |
| `STRIPE_PRICE_COMPLETE_STACK` | Stripe → Product Catalogue → Complete Stack → Price ID |
| `STRIPE_PRICE_FOUNDING_MEMBER` | Stripe → Product Catalogue → Founding Member Deposit → Price ID |

**Vitall (lab partner)**

| Variable | Source |
|---|---|
| `VITALL_API_KEY` | Vitall partner portal — not yet available (dispatch stub active) |
| `VITALL_WEBHOOK_SECRET` | Agreed with Vitall at contract signing |

**Customer.io**

| Variable | Source |
|---|---|
| `CUSTOMERIO_SITE_ID` | CIO → Settings → API Credentials → Site ID |
| `CUSTOMERIO_API_KEY` | CIO → Settings → API Credentials → API Key |

**QStash (job queue)**

| Variable | Source |
|---|---|
| `QSTASH_TOKEN` | Upstash console → QStash → Tokens |
| `QSTASH_CURRENT_SIGNING_KEY` | Upstash console → QStash → Signing Keys |
| `QSTASH_NEXT_SIGNING_KEY` | Upstash console → QStash → Signing Keys |

**Monitoring / Analytics (set when configured)**

| Variable | Source |
|---|---|
| `SENTRY_AUTH_TOKEN` | Sentry → Settings → Auth Tokens |
| `SENTRY_ORG` | Your Sentry org slug |
| `SENTRY_PROJECT` | Your Sentry project slug |
| `GA4_MEASUREMENT_ID` | Google Analytics → Data Streams → Measurement ID |
| `GA4_API_SECRET` | Google Analytics → Data Streams → Measurement Protocol API secret |
| `META_PIXEL_ID` | Meta Events Manager → Pixel ID |
| `META_ACCESS_TOKEN` | Meta Events Manager → Conversions API → Access Token |
| `FIRSTPROMOTER_API_KEY` | FirstPromoter → Settings → API |

---

## Stripe Webhooks

Register the following endpoint in Stripe → Developers → Webhooks:

**URL:** `https://andro-prime.com/api/webhooks/stripe`
**Events to listen for:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## Vitall Webhooks

Once Vitall contract is signed, register:

**URL:** `https://andro-prime.com/api/webhooks/vitall`
**Signature header:** `x-vitall-signature` (HMAC-SHA256)

Copy the shared secret into `VITALL_WEBHOOK_SECRET`.

---

## Deploy Checklist

- [ ] Supabase project created in EU Frankfurt
- [ ] Supabase DPA signed (Supabase → Settings → Legal)
- [ ] Supabase migrations run: `database/migrations/20260416_phase_04_auth_foundation.sql` then `20260420_phase_08_content_review_log.sql`
- [ ] Stripe products and prices created; all 7 Price IDs copied to env vars
- [ ] Stripe webhook registered, signing secret saved
- [ ] All build arguments set in Coolify before first build
- [ ] All runtime env vars set in Coolify
- [ ] Test deploy: visit `/` and `/kits/testosterone`
- [ ] Test checkout: buy Kit 1 with Stripe test card `4242 4242 4242 4242`
- [ ] Confirm Stripe webhook receives `checkout.session.completed`
- [ ] Confirm `kit_orders` row created in Supabase
- [ ] Confirm Customer.io `purchase` event received
- [ ] Test magic link: complete checkout, check inbox for login link
- [ ] Confirm results dashboard loads post-auth
