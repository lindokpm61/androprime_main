# Phase 7 Implementation Plan — Backend API Routes and Integrations

> **⚠ STATUS — PARTIALLY OBSOLETE (2026-05-12)**
>
> This document predates three locked decisions. **Do not follow it verbatim as a current spec.** It is retained as a historical record of how the build evolved.
>
> Stale assumptions in this doc:
> - Stripe deposit checkout build steps (L65, L109, L145, L310, L356–357, L495, L520) — **do not build**. The £75 founding-member deposit was shelved 2026-05-08; no Stripe deposit checkout exists.
> - Instructions to insert `founding_member_deposits` rows and emit `founding_member_deposit` CIO event — superseded. Insert into `founding_member_list` and emit `founding_member_listed`.
> - `STRIPE_PRICE_FOUNDING_MEMBER` env var (L65, L310) — not used.
> - `THRIVA_API_KEY` / `THRIVA_WEBHOOK_SECRET` env vars (L16, L82, L83, L388) — replaced by `VITALL_CLIENT_ID` / `VITALL_CLIENT_SECRET` / `VITALL_WEBHOOK_SECRET`.
> - Thriva HMAC verification stub completion as a Phase 7 task — superseded by Vitall webhook implementation.
>
> Canonical current truth:
> - Founding Member is a **non-cash email opt-in** ("Founding-Member List"). £75 deposit was shelved 2026-05-08. No Stripe deposit checkout. CIO event `founding_member_listed`. DB table `founding_member_list`.
> - Lab partner is **Vitall**, not Thriva. shortCodes locked: `andro-prime-hormone-check` / `-energy-metabolism` / `-combo-test`. Env vars `VITALL_CLIENT_ID`, `VITALL_CLIENT_SECRET`, `VITALL_WEBHOOK_SECRET` (not `THRIVA_*`).
> - Kit pricing is v2.2: £99 / £119 / £179.
>
> For current state, see:
> - `09_website-app/CONTEXT.md` (zones + canonical pages)
> - `09_website-app/backend/CONTEXT.md` (route tree + key libraries)
> - `09_website-app/database/schema/schema.md` (current schema)
> - `01_strategy/master-implementation-blueprint.md` (current product + financial frame)

**Version:** 1.0
**Owner:** Keith Antony
**Status:** Active (Thriva-era plan; Vitall selected 2026-05-01 — see migration note below)
**Date:** April 2026

> **Lab partner update (2026-05-01):** This plan was written against the Thriva API. Vitall has since been confirmed as the lab partner. Substitute "Vitall" for "Thriva" throughout the Phase 7 work: dispatch route now lives at `app/api/vitall/dispatch/route.ts`, env vars to be renamed `VITALL_*`, and webhook route to be added under `app/api/webhooks/vitall/`. The Thriva-named routes remain as historic stubs until retired.

---

## Context

Phase 6 delivered the three remaining authenticated app screens. All UI is now complete. Phase 7 wires up the four external services that make the product functional end-to-end: Stripe (payments), Thriva (lab dispatch), Customer.io (lifecycle email), and QStash (reliable job processing).

Phase 7 also completes the Thriva webhook handler — the HMAC signature verification was flagged as a Phase 5 exit criterion and intentionally left as a stub. That stub must be replaced before the webhook URL is handed to Thriva.

**Path convention:**

All Next.js paths are relative to `09_website-app/frontend/` unless stated otherwise.

---

## External Services Required

Four external services. All four are already declared in `.env.example` — only values are missing. No new env vars need to be invented except Stripe price IDs.

### 1. Stripe

**Status:** Active (per CLAUDE.md)

**What's needed before build starts:**

- Stripe account access with secret key and publishable key
- 7 products and prices created in Stripe Dashboard:

| Product | Type | Price |
|---|---|---|
| Kit 1: Testosterone Health Check | One-time | £29.00 |
| Kit 2: Energy & Recovery Check | One-time | £44.00 |
| Kit 3: Hormone & Recovery Check | One-time | £69.00 |
| Daily Stack | Recurring monthly | £34.95 |
| Joint & Recovery Collagen | Recurring monthly | £29.95 |
| Complete Men's Stack | Recurring monthly | £54.95 |
| Founding Member Deposit | One-time | £75.00 |

- Each price generates a Stripe Price ID (`price_xxx`) — these go into `.env.local` as `STRIPE_PRICE_KIT_1`, `STRIPE_PRICE_KIT_2`, etc.
- Customer Portal configured in Stripe Dashboard (Billing → Customer Portal) — enable subscription cancellation and payment method management
- Webhook endpoint registered in Stripe Dashboard pointing to `https://andro-prime.com/api/webhooks/stripe` with these events subscribed:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `customer.subscription.deleted`
- `STRIPE_WEBHOOK_SECRET` copied from the registered webhook endpoint

**Env vars to add to `.env.example`:**

```
# Stripe Price IDs (set after creating products in Stripe Dashboard)
STRIPE_PRICE_KIT_1=
STRIPE_PRICE_KIT_2=
STRIPE_PRICE_KIT_3=
STRIPE_PRICE_DAILY_STACK=
STRIPE_PRICE_COLLAGEN=
STRIPE_PRICE_COMPLETE_STACK=
STRIPE_PRICE_FOUNDING_MEMBER=
```

**SDK to install:** `stripe` (server-side Node.js SDK)

```bash
npm install stripe
```

---

### 2. Thriva Solutions

**Status:** Enquiry to be sent (per CLAUDE.md)

**What's needed before build starts:**

- Thriva API key (`THRIVA_API_KEY`) — received after onboarding
- Thriva webhook shared secret (`THRIVA_WEBHOOK_SECRET`) — used for HMAC-SHA256 verification of inbound result payloads; this is the Phase 5 exit criterion stub that Phase 7 completes
- Dispatch API endpoint and payload format confirmed with Thriva — the dispatch route (`/api/thriva/dispatch`) sends a POST to Thriva to initiate kit fulfilment after a successful payment
- Webhook URL registered with Thriva: `https://andro-prime.com/api/webhooks/thriva`

**Blocking note:** The dispatch route cannot be built to spec without the Thriva API endpoint format. Build the route with a documented placeholder if Thriva onboarding is not complete — the normaliser and webhook processor are already built and do not change.

---

### 3. Customer.io

**Status:** To be set up (per CLAUDE.md)

**What's needed before build starts:**

- Customer.io account created
- Site ID (`CUSTOMERIO_SITE_ID`) and Track API key (`CUSTOMERIO_API_KEY`) copied from the Customer.io Data Pipelines → Sources → JavaScript section
- Event schema agreed before any event is sent — schema is the contract, not an afterthought

**Event schema — all events include `user_id` and `timestamp`:**

| Event name | When emitted | Key payload fields |
|---|---|---|
| `purchase` | `checkout.session.completed` — kit or deposit | `kit_type`, `amount`, `order_id` |
| `subscription_started` | `checkout.session.completed` — subscription | `product_slug`, `amount` |
| `kit_dispatched` | Thriva dispatch confirmed | `kit_type`, `order_id` |
| `result_received` | QStash job processes Thriva result | `kit_type`, `result_id`, `order_id` |
| `founding_member_deposit` | `checkout.session.completed` — deposit | `amount`, `deposit_id` |
| `quiz_complete` | Test selector form submitted | `recommended_kit`, `symptom_flags` |
| `waitlist_signup` | Waitlist form submitted | `email` |

**SDK:** Use the Customer.io Track API directly via `fetch` — no SDK dependency needed. POST to `https://track.customer.io/api/v1/track` with Basic Auth (site ID as username, API key as password).

---

### 4. Upstash QStash

**Status:** To be set up (per CLAUDE.md)

**What's needed before build starts:**

- Upstash account created at console.upstash.com
- QStash token (`QSTASH_TOKEN`) — used by the webhook handler to enqueue jobs
- Current and next signing keys (`QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY`) — used by the job worker to verify inbound QStash requests
- QStash destination URL: `https://andro-prime.com/api/jobs/process-result`

**SDK to install:** `@upstash/qstash`

```bash
npm install @upstash/qstash
```

---

## Architecture

```
User action (checkout, form submit)
    → Next.js API route (checkout/kit, forms/waitlist, etc.)
        → Stripe / Supabase / Customer.io

Stripe event
    → /api/webhooks/stripe
        → Supabase writes (kit_orders, supplement_subscriptions, founding_member_deposits)
        → Customer.io event emitted
        → Thriva dispatch triggered (on kit purchase)

Thriva result arrives
    → /api/webhooks/thriva
        → HMAC verification (Phase 5 stub — completed here)
        → QStash enqueue (job payload = raw webhook body)
        → 202 Accepted (immediate return — no processing on webhook thread)

QStash calls worker
    → /api/jobs/process-result
        → QStash signature verification
        → lab_results insert
        → biomarker_values insert (via normaliser)
        → Customer.io result_received event emitted
```

**Why QStash for Thriva results:** Thriva expects a 202 within seconds. Processing, normalising, and inserting biomarker data takes longer and can fail. QStash gives the job a retry queue — if the worker fails, QStash retries with exponential backoff. Without it, a DB timeout or Supabase hiccup silently drops a result the user paid for.

---

## File Creation Order

17 files, in dependency sequence.

| Order | File | Depends On |
|---|---|---|
| 1 | `.env.example` update | Nothing — add Stripe price ID vars |
| 2 | `lib/stripe/client.ts` | `stripe` package |
| 3 | `lib/customerio/emit.ts` | Nothing |
| 4 | `lib/qstash/verify.ts` | `@upstash/qstash` |
| 5 | `app/api/checkout/kit/route.ts` | `lib/stripe/client.ts`, `lib/auth/session.ts` |
| 6 | `app/api/checkout/subscription/route.ts` | `lib/stripe/client.ts`, `lib/auth/session.ts` |
| 7 | `app/api/checkout/deposit/route.ts` | `lib/stripe/client.ts`, `lib/auth/session.ts` |
| 8 | `app/api/checkout/portal/route.ts` | `lib/stripe/client.ts`, `lib/auth/session.ts` |
| 9 | `app/api/webhooks/stripe/route.ts` | `lib/stripe/client.ts`, `lib/customerio/emit.ts`, `lib/supabase/admin.ts` |
| 10 | `app/api/webhooks/thriva/route.ts` | Update existing — add HMAC + QStash enqueue |
| 11 | `app/api/jobs/process-result/route.ts` | `lib/qstash/verify.ts`, `lib/results/normaliser.ts`, `lib/customerio/emit.ts`, `lib/supabase/admin.ts` |
| 12 | `app/api/thriva/dispatch/route.ts` | `lib/auth/session.ts` |
| 13 | `app/api/forms/waitlist/route.ts` | `lib/supabase/admin.ts`, `lib/customerio/emit.ts` |
| 14 | `app/api/forms/contact/route.ts` | Nothing |
| 15 | `app/api/forms/test-selector/route.ts` | `lib/supabase/admin.ts`, `lib/customerio/emit.ts` |
| 16 | TypeScript check | All files |
| 17 | Production build | All files |

---

## Step 1 — Stripe Client

**File:** `lib/stripe/client.ts`

Singleton pattern — one Stripe instance shared across all API routes.

```typescript
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
})
```

Use the latest stable API version. Do not set `typescript: { alwaysIncludeTypes: true }` — the types come from the `stripe` package directly.

---

## Step 2 — Customer.io Emitter

**File:** `lib/customerio/emit.ts`

No SDK — direct Track API call via `fetch`.

```typescript
export interface CioEvent {
  name: string
  data?: Record<string, unknown>
}

export async function emitEvent(userId: string, event: CioEvent): Promise<void>
export async function identifyUser(userId: string, traits: Record<string, unknown>): Promise<void>
```

`emitEvent` POSTs to `https://track.customer.io/api/v1/track` with:
- Basic Auth: `CUSTOMERIO_SITE_ID:CUSTOMERIO_API_KEY` (base64)
- Body: `{ id: userId, name: event.name, data: event.data, timestamp: Math.floor(Date.now() / 1000) }`

`identifyUser` POSTs to `https://track.customer.io/api/v1/identify` — used when a user signs up to register them in Customer.io before the first event.

Failures are logged but do not throw — a Customer.io outage must never break checkout. Wrap both in `try/catch` and `console.error` on failure.

---

## Step 3 — QStash Verifier

**File:** `lib/qstash/verify.ts`

```typescript
import { Receiver } from '@upstash/qstash'

export function getQStashReceiver(): Receiver

export async function verifyQStashRequest(request: Request): Promise<string>
```

`verifyQStashRequest` reads the raw body as text, verifies the `upstash-signature` header using the QStash Receiver, and returns the raw body string (which the job worker then parses). Throws if verification fails — the job worker returns 401 on throw.

---

## Step 4 — Checkout Routes

All three checkout routes follow the same pattern:

1. Authenticate the user via `requireAuthenticatedApiUser`
2. Parse and validate the request body
3. Create a Stripe Checkout Session
4. Return `{ url }` — the client redirects to `url`

**Stripe Checkout Session common config:**
- `payment_method_types: ['card']`
- `customer_email: user.email`
- `metadata: { user_id: user.id, ... }` — `user_id` must be on every session; the webhook handler reads it back
- `success_url: \`${SITE_URL}/account?checkout=success\``
- `cancel_url: \`${SITE_URL}/kits\`` (or relevant cancel destination per route)
- Currency: `gbp`

### `app/api/checkout/kit/route.ts`

POST. Body: `{ kitType: 'testosterone' | 'energy-recovery' | 'hormone-recovery' }`

Maps `kitType` to the correct price ID env var. `mode: 'payment'` (one-time). Metadata: `{ user_id, kit_type: kitType, type: 'kit' }`.

Price ID map:
```typescript
const KIT_PRICE_IDS: Record<string, string | undefined> = {
  'testosterone':     process.env.STRIPE_PRICE_KIT_1,
  'energy-recovery':  process.env.STRIPE_PRICE_KIT_2,
  'hormone-recovery': process.env.STRIPE_PRICE_KIT_3,
}
```

Returns 400 if `kitType` is not in the map or price ID is not configured.

### `app/api/checkout/subscription/route.ts`

POST. Body: `{ productSlug: 'daily-stack' | 'collagen' | 'complete-mens-stack' }`

`mode: 'subscription'`. Metadata: `{ user_id, product_slug: productSlug, type: 'subscription' }`.

Price ID map:
```typescript
const SUB_PRICE_IDS: Record<string, string | undefined> = {
  'daily-stack':         process.env.STRIPE_PRICE_DAILY_STACK,
  'collagen':            process.env.STRIPE_PRICE_COLLAGEN,
  'complete-mens-stack': process.env.STRIPE_PRICE_COMPLETE_STACK,
}
```

### `app/api/checkout/deposit/route.ts`

POST. No body required — one product, fixed price. `mode: 'payment'`. Metadata: `{ user_id, type: 'deposit' }`.

Price ID: `process.env.STRIPE_PRICE_FOUNDING_MEMBER`.

### `app/api/checkout/portal/route.ts`

POST. No body. Authenticated.

1. Look up the Stripe `customer_id` for the user — query `supplement_subscriptions.stripe_subscription_id`, then retrieve the subscription from Stripe to get the `customer` ID.
   - If no active subscription: return 404 `{ error: 'No active subscription found' }`
2. Create a Stripe Billing Portal session: `stripe.billingPortal.sessions.create({ customer, return_url: \`${SITE_URL}/subscriptions\` })`
3. Return `{ url }` — client redirects.

This is the route the Phase 6 subscriptions page links to. Remove the "coming soon" note from `subscriptions/page.tsx` after this route is live.

---

## Step 5 — Stripe Webhook Handler

**File:** `app/api/webhooks/stripe/route.ts`

POST. Uses admin client (bypasses RLS — webhook has no user session).

```typescript
export const config = { api: { bodyParser: false } }
```

Sequence:

1. Read raw body as `Buffer` — required for Stripe signature verification
2. Verify signature: `stripe.webhooks.constructEvent(body, request.headers.get('stripe-signature'), STRIPE_WEBHOOK_SECRET)`
3. Return 400 if verification fails
4. Switch on `event.type`:

### `checkout.session.completed`

Read `session.metadata.type` to determine what was purchased:

**type = `'kit'`:**
- Insert `kit_orders` row: `{ user_id, kit_type, stripe_payment_intent: session.payment_intent, status: 'paid' }`
- Emit Customer.io `purchase` event: `{ kit_type, amount: session.amount_total, order_id }`
- Call `/api/thriva/dispatch` internally (or call the dispatch logic directly) to trigger kit fulfilment

**type = `'subscription'`:**
- Insert `supplement_subscriptions` row: `{ user_id, stripe_subscription_id: session.subscription, product_slug, status: 'active' }`
- Emit Customer.io `subscription_started` event: `{ product_slug, amount: session.amount_total }`

**type = `'deposit'`:**
- Insert `founding_member_deposits` row: `{ user_id, stripe_payment_intent: session.payment_intent, status: 'paid', paid_at: new Date().toISOString() }`
- Emit Customer.io `founding_member_deposit` event: `{ amount: session.amount_total }`

### `invoice.payment_succeeded`

- Update `supplement_subscriptions` row where `stripe_subscription_id = invoice.subscription` → set `status: 'active'`
- Emit Customer.io `subscription_renewed` event (not in original schema — add it)

### `customer.subscription.deleted`

- Update `supplement_subscriptions` row where `stripe_subscription_id = subscription.id` → set `status: 'cancelled'`

**Always return 200** — Stripe retries on any non-2xx response, which would re-process events. Return 200 even for unhandled event types.

---

## Step 6 — Thriva Webhook (Complete HMAC + QStash)

**File:** `app/api/webhooks/thriva/route.ts` — update existing file

This is the Phase 5 exit criterion: replace the signature stub with real HMAC-SHA256 verification, then enqueue to QStash instead of processing inline.

**Before (current):** validates fields → inserts directly → returns 202

**After:**

```typescript
// 1. Read raw body (needed for HMAC — must be done before any .json() call)
const rawBody = await request.text()

// 2. HMAC-SHA256 verification
const signature = request.headers.get('x-thriva-signature') ?? ''
const expected = createHmac('sha256', process.env.THRIVA_WEBHOOK_SECRET!)
  .update(rawBody)
  .digest('hex')

if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
}

// 3. Enqueue to QStash
const client = new Client({ token: process.env.QSTASH_TOKEN! })
await client.publishJSON({
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/process-result`,
  body: JSON.parse(rawBody),
})

// 4. Return 202 immediately — processing happens in the job worker
return NextResponse.json({ received: true }, { status: 202 })
```

Use Node's built-in `crypto` module for HMAC and `timingSafeEqual` — no new dependency.

---

## Step 7 — QStash Job Worker

**File:** `app/api/jobs/process-result/route.ts`

POST. Called by QStash — not by users. Uses admin client.

Sequence:

1. Verify QStash signature via `verifyQStashRequest` — return 401 if invalid
2. Parse body as `ThrivaWebhookPayload`
3. Look up `order_id` by barcode via `sample_registrations` (or use `orderId` from payload if Thriva provides it directly — confirm with Thriva during onboarding)
4. Insert `lab_results` row
5. Call `normalise(payload)` — insert `biomarker_values` rows
6. Emit Customer.io `result_received` event: `{ kit_type, result_id, order_id }`
7. Return 200

Return 200 even on partial failure where possible — if QStash receives a non-2xx, it retries. Idempotency: check if `lab_results` already has a row for this `order_id` before inserting (use `onConflict: 'order_id'` or a pre-check).

---

## Step 8 — Thriva Dispatch Route

**File:** `app/api/thriva/dispatch/route.ts`

POST. Called internally by the Stripe webhook handler after a kit purchase is confirmed. Not user-facing.

Body: `{ orderId: string, kitType: string, userEmail: string }`

Sequence:

1. POST to Thriva dispatch API endpoint (format to be confirmed during Thriva onboarding)
2. Update `kit_orders` row: `status: 'dispatched'`
3. Emit Customer.io `kit_dispatched` event: `{ kit_type, order_id }`
4. Return 200

If Thriva API format is not yet confirmed, stub the Thriva POST call with a `console.log` and a `TODO` comment. The database write and Customer.io event still fire.

---

## Step 9 — Form Handlers

### `app/api/forms/waitlist/route.ts`

POST. No auth required. Body: `{ email: string }`.

1. Validate email format
2. Upsert into `users` table (or a dedicated `waitlist_emails` table if preferred — use `users` to keep things simple; set `marketing_consent: true`)
3. Emit Customer.io `waitlist_signup` event: `{ email }`
4. Return 201

### `app/api/forms/contact/route.ts`

POST. No auth required. Body: `{ name: string, email: string, message: string }`.

1. Validate presence of all three fields
2. For Phase 7: forward to a configured email via Customer.io transactional send or log to a `contact_submissions` table (simplest: insert into a `lifecycle_events` row with `event_name: 'contact_form'` and payload `{ name, email, message }`)
3. Return 201

No external email service is needed at this stage — Customer.io transactional will handle contact replies in Phase 10.

### `app/api/forms/test-selector/route.ts`

POST. No auth required (quiz is pre-purchase). Body: `{ recommendedKit: string, symptomFlags: Record<string, boolean> }`.

1. If `request.headers.get('x-user-id')` is present (optional — sent by client if user is logged in), save `symptom_answers` to Supabase
2. Emit Customer.io `quiz_complete` event: `{ recommended_kit, symptom_flags }`
3. Return 200

Symptom answers captured here before purchase are the same answers used by the classifier cross-sell logic. The `order_id` is not known until after payment — the test selector form stores them against the user and they are linked to the order in the Stripe webhook handler.

---

## Rule Enforcement Summary

| Rule | Enforced where |
|---|---|
| Stripe signature verified before any event is processed | `stripe.webhooks.constructEvent` in webhook handler — throws on tampered payload |
| Thriva HMAC verified before enqueue (Phase 5 exit criterion) | `timingSafeEqual` in updated Thriva webhook handler |
| QStash signature verified before job is processed | `verifyQStashRequest` in job worker — returns 401 on failure |
| `user_id` always in Stripe session metadata | Checkout routes — all three include `user_id` in `metadata` |
| Customer.io events never block checkout | `emitEvent` wrapped in `try/catch` — CIO outage cannot fail a payment |
| Thriva webhook returns 202 immediately | Enqueue-and-return pattern — processing deferred to QStash worker |
| Job worker is idempotent | Pre-check for existing `lab_results` row before insert |
| Supplement CTAs only triggered by real subscription events | `supplement_subscriptions` only written by `checkout.session.completed` webhook — not by any client call |
| Founding member CTA only triggered by confirmed deposit payment | `founding_member_deposits` only written by `checkout.session.completed` with `type: 'deposit'` — not by any client call |
| Price IDs sourced from env — not hardcoded | `STRIPE_PRICE_*` env vars — swap in Stripe Dashboard, update env, no code changes |

---

## Pre-Build Checklist

These must be completed before Phase 7 code can be tested end-to-end. Code can be written without them — webhook handlers and checkout routes can be linted and type-checked — but they cannot be exercised until all four services are configured.

- [ ] Stripe: products and prices created — price IDs noted in `.env.local`
- [ ] Stripe: Customer Portal configured in Dashboard
- [ ] Stripe: webhook endpoint registered — `STRIPE_WEBHOOK_SECRET` set
- [ ] Stripe CLI installed for local webhook forwarding (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- [ ] Thriva: onboarding enquiry sent and API credentials received
- [ ] Thriva: webhook URL registered with Thriva
- [ ] Thriva: dispatch API endpoint format confirmed
- [ ] Customer.io: account created — `CUSTOMERIO_SITE_ID` and `CUSTOMERIO_API_KEY` set
- [ ] Upstash: account created — `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` set
- [ ] `npm install stripe @upstash/qstash` run

---

## Deliverables

- All checkout routes return a valid Stripe session URL for each product type
- Stripe webhook correctly writes to `kit_orders`, `supplement_subscriptions`, and `founding_member_deposits`
- Thriva webhook verifies HMAC and enqueues to QStash without processing inline
- QStash worker inserts results and emits Customer.io event — verified with a fixture payload
- Customer.io emitter fires for all 7 event types with correct schema
- All form handlers return correct status codes and write to Supabase where required
- TypeScript: zero errors
- Build: clean

Phase 7 is complete when a test purchase can be made in Stripe test mode and the full chain fires: checkout → kit order in Supabase → Thriva dispatch triggered → (simulated) result received → result in Supabase → Customer.io event emitted.

---

## Changelog

| Date | Change |
|---|---|
| April 2026 (v1.0) | Initial plan |
