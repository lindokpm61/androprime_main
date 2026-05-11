# Implementation Plan

**Version:** 1.2
**Owner:** Keith Antony
**Status:** Active (Thriva-era plan; Vitall selected 2026-05-01)
**Date:** April 2026
**Last updated:** 16 April 2026

> **Lab partner update (2026-05-01):** This plan was written against the Thriva API. Vitall is now the confirmed lab partner. Read "Thriva" throughout as "the lab partner (now Vitall)" — the live dispatch route lives at `app/api/vitall/dispatch/route.ts`.

---

## Context

This plan governs the full technical build of the Andro Prime website and app from current state to a production deployment on a VPS. It was written after a full project scan and supersedes any earlier informal sequencing notes.

**Path convention for this plan:**

- `09_website-app/` is the workspace root
- `09_website-app/frontend/` is the Next.js application root
- all Next.js route, config, package, middleware, and API route paths in this plan are relative to `09_website-app/frontend/` unless explicitly stated otherwise

**Current state at time of writing:**

- 25 complete HTML pages exist (canonical site + landing pages) - production-quality markup, Tailwind CDN, no framework
- Brand guidelines complete (V2.0)
- App requirements fully specified in `app-requirements.md`
- All CSS token files, component directories, backend, database, automation, and deployment directories are empty placeholders
- No package.json, no Next.js setup, no Docker configuration exists anywhere

**Deployment target:**

- Local development on `localhost:3000` (Next.js dev server)
- GitHub as source of truth and deployment trigger
- Docker container built and deployed to a VPS via Coolify
- Cloudflare for DNS and proxy

---

## Architecture Decision

**Single Next.js application** covering three distinct layers:

| Layer | Purpose | Next.js location |
|-------|---------|-----------------|
| Marketing site | Canonical pages, SEO, acquisition | `frontend/app/(marketing)/` |
| Landing pages | Direct-response, paid traffic | `frontend/app/lp/` |
| App | Authenticated product experience | `frontend/app/(app)/` |

API routes within the same Next.js application handle all backend logic. This keeps the codebase unified, the Docker image single-container, and the deployment simple. The separation between layers is enforced by route groups and layout shells, not separate codebases.

---

## Phase 1 - Next.js Project Scaffold

*Foundation. Nothing else can start without this.*

**Goal:** A working Next.js project that runs locally and can be built into a Docker image.

- Initialise Next.js with TypeScript and App Router
- Install and configure Tailwind CSS as a proper PostCSS plugin (replaces all CDN references)
- Extract the shared Tailwind config from inline page scripts into `tailwind.config.ts`
- Populate CSS token files from `02_brand/brand-guidelines.md` (colours, typography, spacing, radius)
- Configure `next.config.ts` with `output: 'standalone'` for Docker
- Create `.env.local` and `.env.example` with all required variable keys (values empty)
- Confirm `npm run dev` runs cleanly on `localhost:3000`
- Confirm `npm run build` succeeds

**Deliverables:** `frontend/package.json`, `frontend/tsconfig.json`, `frontend/next.config.ts`, `frontend/tailwind.config.ts`, `frontend/.env.example`, populated token CSS files in `frontend/styles/tokens/`.

---

## Phase 2 - Shared Layout Components

*Done once. Inherited everywhere.*

**Goal:** Shared UI shells that all pages in all three layers use, so nav and footer are never duplicated again.

- `<Nav>` component (extracted from existing HTML - identical across all current pages)
- `<Footer>` component
- Root `layout.tsx` - font loading (Inter + Merriweather + JetBrains Mono), metadata defaults, body classes, Sentry init
- Three layout shells:
  - Marketing layout (standard nav + footer)
  - LP layout (stripped nav, no footer, single CTA focus)
  - App layout (authenticated nav, no marketing footer, session-aware)

**Deliverables:** `frontend/components/shared/Nav.tsx`, `frontend/components/shared/Footer.tsx`, and the required `layout.tsx` files under `frontend/app/`.

---

## Phase 3 - Migrate Marketing Layer ✅ COMPLETE

*The website and landing pages. The acquisition funnel.*

**Completed:** 16 April 2026

**Goal:** All 25 existing HTML pages running as Next.js routes with no behaviour change visible to a user.

### Canonical site (18 pages)

Convert each HTML file to its App Router equivalent:

| Current HTML | Next.js route |
|-------------|--------------|
| `home/index.html` | `frontend/app/(marketing)/page.tsx` |
| `kits/index.html` | `frontend/app/(marketing)/kits/page.tsx` |
| `kits/testosterone/index.html` | `frontend/app/(marketing)/kits/testosterone/page.tsx` |
| `kits/energy-recovery/index.html` | `frontend/app/(marketing)/kits/energy-recovery/page.tsx` |
| `kits/hormone-recovery/index.html` | `frontend/app/(marketing)/kits/hormone-recovery/page.tsx` |
| `supplements/index.html` | `frontend/app/(marketing)/supplements/page.tsx` |
| `supplements/daily-stack/index.html` | `frontend/app/(marketing)/supplements/daily-stack/page.tsx` |
| `supplements/collagen/index.html` | `frontend/app/(marketing)/supplements/collagen/page.tsx` |
| `founding-member/index.html` | `frontend/app/(marketing)/founding-member/page.tsx` |
| `test-selector/index.html` | `frontend/app/(marketing)/test-selector/page.tsx` |
| `waitlist/index.html` | `frontend/app/(marketing)/waitlist/page.tsx` |
| `how-it-works/index.html` | `frontend/app/(marketing)/how-it-works/page.tsx` |
| `about/index.html` | `frontend/app/(marketing)/about/page.tsx` |
| `blog/index.html` | `frontend/app/(marketing)/blog/page.tsx` |
| `blog/the-myth-of-the-normal-range/index.html` | `frontend/app/(marketing)/blog/the-myth-of-the-normal-range/page.tsx` |
| `faq/index.html` | `frontend/app/(marketing)/faq/page.tsx` |
| `contact/index.html` | `frontend/app/(marketing)/contact/page.tsx` |
| `privacy/index.html` | `frontend/app/(marketing)/privacy/page.tsx` |
| `terms/index.html` | `frontend/app/(marketing)/terms/page.tsx` |

During migration, extract repeated HTML blocks into reusable components:
- `<TrustBar>` - UKAS / accreditation strip
- `<SectionEyebrow>` - mono label with flanking lines
- `<KitCard>` - kit product card pattern
- `<BiomarkerPanel>` - data display panel
- `<PullQuote>` - blockquote with left border

Move inline `<script>` blocks into client components (`'use client'`) where interactivity is required (mobile menu, test selector logic, etc.).

### Landing pages (6 pages)

| Canonical HTML | Next.js route | Status |
|---|---|---|
| `lp/testosterone/` | `frontend/app/lp/testosterone/page.tsx` | ✅ Done |
| `lp/energy-recovery/` | `frontend/app/lp/energy-recovery/page.tsx` | ✅ Done |
| `lp/hormone-recovery/` | `frontend/app/lp/hormone-recovery/page.tsx` | ✅ Done |
| `lp/foundations/` | `frontend/app/lp/foundations/page.tsx` | ✅ Done |
| `lp/daily-stack/` | `frontend/app/lp/daily-stack/page.tsx` | ✅ Done |
| `lp/collagen/` | `frontend/app/lp/collagen/page.tsx` | ✅ Done |

**Deliverables:** All marketing and LP pages running in Next.js, shared components extracted, no Tailwind CDN references remaining.

**Shared components extracted:** `<TrustBar>`, `<SectionEyebrow>`, `<KitCard>`, `<BiomarkerPanel>`, `<PullQuote>`, `<FaqAccordion>`, `<TestSelectorQuiz>`

**Note:** The original plan listed 5 LP pages. The canonical source contained a sixth page (`lp/hormone-recovery/`) which was absent from the plan. This has been added and completed.

---

## Phase 4 - Database Schema and Auth Foundation

*Must exist before any app screen can be built. Biomarker data is special category health data under UK GDPR.*

**Goal:** Supabase configured, schema migrated, auth working, all app routes protected.

### Supabase setup

- Create Supabase project in an **EU region (Ireland for this build)** so hosted data remains within the European Union
- Sign Data Processing Agreement with Supabase before the first result is stored
- Enable Row Level Security on all tables

### Core schema

| Table | Key fields | Purpose |
|-------|-----------|---------|
| `users` | id, email, created_at, age, marketing_consent | Account and profile |
| `kit_orders` | id, user_id, kit_type, stripe_payment_intent, status, ordered_at | Purchase record |
| `sample_registrations` | id, order_id, barcode, registered_at, dispatched_at | Lab-side kit tracking |
| `lab_results` | id, order_id, user_id, kit_type, received_at, raw_payload | Full Thriva result payload |
| `biomarker_values` | id, result_id, marker_name, value, unit, reference_low, reference_high | Normalised per-marker values |
| `symptom_answers` | id, user_id, order_id, question_key, answer, captured_at | Checkout/quiz responses - drives cross-sell logic |
| `qualifier_responses` | id, user_id, result_id, question_key, answer, captured_at | In-dashboard qualifier gates (hs-CRP joint question) |
| `supplement_subscriptions` | id, user_id, stripe_subscription_id, product_slug, status, started_at | Active subscription state |
| `founding_member_deposits` | id, user_id, stripe_payment_intent, paid_at, status | Deposit payment and status |
| `lifecycle_events` | id, user_id, event_name, payload, emitted_at | CRM event log |

### Auth routes

- `frontend/app/auth/login` - email + password login
- `frontend/app/auth/signup` - account creation
- `frontend/app/auth/reset` - password reset
- `frontend/app/auth/callback` - Supabase OAuth callback handler

### Route protection

- Middleware protecting authenticated app routes under `frontend/app/(app)/` - unauthenticated users redirected to login
- Session validation on all API routes that access health data

**Deliverables:** Supabase project live, all migrations applied, auth routes built and tested in `frontend/app/auth/`, middleware protecting authenticated app routes.

---

## Phase 5 - Results Dashboard

*The highest-priority app module. This is the product that users paid for.*

**Goal:** A user who has purchased a kit can log in, view their results in plain English, and be shown the correct next action based on their specific biomarker values.

**Route location:** `frontend/app/(app)/results-dashboard/`

### Open questions - resolve before build begins

These are blockers. They need formal answers before Phase 5 work starts:

1. Where are energy symptoms captured and stored? (checkout quiz, post-purchase onboarding, or in the results flow itself) - needed for the Kit 1 normal-T cross-sell
2. How does barcode registration and result-to-user identity matching work with Thriva?
3. Does Kit 3 B12 logic ship at launch or is it feature-flagged?
4. Is founding-member status a standalone route or a dashboard module?

### Data layer

- Thriva webhook receiver: validate payload, store to `lab_results`, normalise values into `biomarker_values`
- Result state classifier: maps raw biomarker values to decision states (see rule table below)
- Dashboard data query: fetches classified result state, cross-sell eligibility, qualifier responses for a given user

### Rule engine

The classifier must support all result states from `app-requirements.md`:

| Result state | Qualifier needed | Primary CTA | Secondary CTA |
|-------------|-----------------|-------------|---------------|
| T < 12 nmol/L | None | Founding member deposit | Daily Stack ("while you wait") |
| T 12-20 nmol/L | Check symptom_answers for energy | Daily Stack (zinc hero) | Kit 2 (if energy symptoms stored) |
| T > 20 nmol/L | None | Retest reminder | - |
| Low Vitamin D | None | Daily Stack (D3 hero) | Kit 1 (if age 40+ or 2+ deficiencies) |
| Low Magnesium | None | Daily Stack (Mg hero) | Kit 1 (if age 40+ or 2+ deficiencies) |
| Elevated hs-CRP (1-10) | Ask joint symptoms question | Collagen (if Yes) | Lifestyle guidance (if No) |
| hs-CRP > 10 mg/L | None | GP referral only | - |
| Low Ferritin < 30 ug/L | None | GP referral + dietary guidance | - |
| Low B12 | None | Daily Stack (B12 hero) | - |
| 2+ deficiencies | None | Complete Men's Stack | Individual products as fallback |

Cross-sell logic:
- Kit 1 result (normal T) + energy symptoms stored -> show Kit 2 cross-sell
- Kit 2 result + 2+ deficiencies -> show Kit 1 cross-sell
- Kit 2 result + single deficiency + age 40+ -> show Kit 1 cross-sell

GP referral hard blocks:
- hs-CRP > 10: no supplement CTA under any circumstances
- Ferritin < 30: no supplement CTA under any circumstances

### Dashboard UI

- 5-part structure per marker - enforced by component order, not copy alone:
  1. `<ResultValue>` - plain number display
  2. `<ResultExplain>` - what the number means
  3. `<ResultEducate>` - evidence-based context, non-sales
  4. `<ResultRecommend>` - the correct Andro Prime next step
  5. `<ResultConvert>` - clean action, correctly framed
- `<QualifierGate>` - hs-CRP joint symptom question, shown between Explain and Recommend
- Primary and secondary CTA rendered conditionally per result state
- Retest messaging where applicable
- Language rules enforced: "Your results indicate..." never "You have..."

**Deliverables:** Working results dashboard that correctly routes every result state to the right CTA. No invalid CTA shown for any result state.

---

## Phase 6 - Remaining App Screens

**Goal:** The full authenticated product experience beyond the dashboard.

### Founding Member Status (`frontend/app/(app)/founding-member-status/` or final authenticated route equivalent)

- Deposit payment state (paid / not paid)
- Next-step messaging appropriate to current state
- No implication that TRT is currently available
- Links to founding member canonical page for context

### Subscriptions (`frontend/app/(app)/subscriptions/` or final authenticated route equivalent)

- Active subscriptions with product name, price, renewal date
- Billing status (active, past due, cancelled)
- Cancellation flow (Stripe Customer Portal or custom UI)
- Aligned to Stripe subscription state via webhook sync

### Account (`frontend/app/(app)/account/` or final authenticated route equivalent)

- Profile details (name, email)
- Result history (which kits, when, link to dashboard)
- Order state visibility
- Links to subscriptions and founding member status
- Support contact

**Deliverables:** All app screens built under `frontend/app/`, connected to Supabase data, session-aware.

---

## Phase 7 - Backend API Routes and Integrations

**Goal:** All external service calls handled server-side with proper error handling and event emission.

### Stripe

- `frontend/app/api/checkout/kit/route.ts` - create checkout session for kit purchase
- `frontend/app/api/checkout/subscription/route.ts` - create checkout session for supplement subscription
- `frontend/app/api/checkout/deposit/route.ts` - create checkout session for founding member deposit
- `frontend/app/api/webhooks/stripe/route.ts` - handle: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

### Thriva

- `frontend/app/api/thriva/dispatch/route.ts` - trigger kit dispatch after purchase confirmed
- `frontend/app/api/webhooks/thriva/route.ts` - receive result payload -> store in Supabase -> emit Customer.io event

### Customer.io

- Events emitted at: `purchase`, `kit_dispatched`, `result_received`, `subscription_started`, `founding_member_deposit`, `quiz_complete`, `waitlist_signup`
- Event schema defined before any event is sent - schema is the contract
- All events include `user_id`, `timestamp`, and relevant payload fields

### QStash

- Thriva webhook jobs enqueued via QStash immediately on receipt (202 OK response)
- Processed with retry on failure - prevents silent result loss

### Form handlers

- `frontend/app/api/forms/waitlist/route.ts` - email capture -> Supabase + Customer.io event
- `frontend/app/api/forms/contact/route.ts` - contact form submission
- `frontend/app/api/forms/test-selector/route.ts` - test selector quiz result (symptom capture and storage)

**Deliverables:** All API routes built under `frontend/app/api/`, Stripe and Thriva webhooks tested end-to-end, Customer.io events firing correctly.

---

## Phase 8 - Docker Setup

**Goal:** The application builds into a Docker image and runs identically to local dev.

- `Dockerfile` - multi-stage build using Next.js `output: 'standalone'`
  - Stage 1: install dependencies
  - Stage 2: build the application
  - Stage 3: production image (minimal, standalone output only)
- `docker-compose.yml` - local development orchestration
- `.dockerignore` - exclude `node_modules`, `.next`, `.env.local`
- Test: `docker build` -> `docker run` -> behaviour matches `npm run dev`

**Deliverables:** `frontend/Dockerfile`, `frontend/docker-compose.yml`, `frontend/.dockerignore`, confirmed working local Docker build.

---

## Phase 9 - Deployment Pipeline

**Goal:** Push to GitHub main -> Coolify builds and deploys -> live on domain.

- Coolify installed and configured on VPS
- GitHub repo connected to Coolify with webhook on push to `main`
- All environment variables set in Coolify (Stripe keys, Supabase URL and service key, Thriva API key, Customer.io API key, QStash token, Sentry DSN)
- Cloudflare DNS: A record pointing to VPS IP, proxy enabled (orange cloud)
- SSL: Coolify handles via Let's Encrypt, or Cloudflare origin certificate
- First live deploy confirmed
- Rollback procedure documented

**Deliverables:** Automated deploy pipeline live, first production deployment confirmed, rollback procedure in place.

---

## Phase 10 - Analytics, Monitoring, and Email

**Goal:** Full observability and lifecycle email system before any paid traffic arrives.

### Analytics

- Plausible Analytics - primary analytics, EU-hosted, no cookies
- GA4 - server-side conversion events only (purchase, signup)
- Meta Pixel - server-side conversion events only

### Monitoring

- Sentry - frontend errors, API route errors, webhook failures
- VPS uptime monitoring (UptimeRobot or equivalent)
- `/dashboard/*` excluded from Microsoft Clarity session recording

### Email templates

Build all six Customer.io sequences (HTML templates, plain text fallbacks):

| Sequence | Trigger | Emails |
|----------|---------|--------|
| `seq-01` | Waitlist signup | 4 - welcome, education x2, launch day |
| `seq-02` | Kit purchase confirmed | 3 - dispatch, sample instructions, result ready |
| `seq-03a` | Result: low D/Mg/CRP | 6 - result, explain, recommend, check-in, outcome, Kit 3 upsell |
| `seq-03b` | Result: T < 12 nmol/L | 7 - result, explain, founding member CTA, scarcity, objections, update, monthly nurture |
| `seq-04` | First subscription payment | 5 - dispatch, week 1 expectations, check-in, retest prompt, referral |
| `seq-05` | 45 days no engagement | 3 - personal check-in, FAQ, frank word from Keith |

**Deliverables:** Analytics firing on all key events, Sentry catching errors, all email sequences built and tested in Customer.io.

---

## Sequencing and Dependencies

```text
Phase 1 (Scaffold)
    -> Phase 2 (Layout Components)
        -> Phase 3 (Marketing Migration)  [can run in parallel with Phase 4]
        -> Phase 4 (Database + Auth)
            -> Phase 5 (Results Dashboard)
                -> Phase 6 (Remaining App Screens)
                    -> Phase 7 (API Routes + Integrations)
                        -> Phase 8 (Docker)
                            -> Phase 9 (Deployment)
                                -> Phase 10 (Analytics + Email)
```

Phases 3 and 4 can run in parallel after Phase 2 is complete. Phase 5 is blocked until the four open questions listed in Phase 5 are formally resolved.

---

## Open Questions - Require Decisions Before Phase 5

1. **Energy symptom capture point** - where in the journey are these stored? (checkout quiz, post-purchase onboarding, or in-dashboard) - blocks Kit 1 normal-T cross-sell logic
2. **Barcode registration and identity matching** - how does the Thriva result get matched to the correct user? What is the flow from kit dispatch to barcode registration to result delivery?
3. **Kit 3 B12 logic** - ships at launch or feature-flagged for a later release?
4. **Founding member status location** - standalone route under `frontend/app/` or a module within the results dashboard with deep links?

---

*Version 1.0 - April 2026*
*Owner: Keith Antony / Andro Prime*
*Supersedes: any informal sequencing notes*
