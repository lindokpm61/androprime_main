# Kit 1: Testosterone Health Check — Launch Deep-Dive

**Original date:** March 30, 2026
**Last updated:** April 20, 2026
**Owner:** Keith Antony
**Product:** £29 At-Home Testosterone Health Check Kit
**Purpose:** Phase 0 revenue + TRT pipeline builder

**Status summary:** Website build Phases 1–7 complete. Lab partner selected (Thriva Solutions) — pre-integration, commercial agreement not yet signed. Phases 8–10 (Docker, deployment, analytics, email) outstanding.

**Cross-references:**
- `05_partners/labs/thriva/` — negotiation notes, correspondence, API docs
- `05_partners/labs/lab-partner-rankings-addendum.md` — post-Medichecks-acquisition rankings
- `09_website-app/docs/thriva-integration-spec.md` — full Thriva API integration spec
- `09_website-app/docs/implementation-plan.md` — full build phase plan
- `04_products/results-engine/` — classifier logic, thresholds, dashboard copy

---

## Part 1: Lab Partner

### 1.1 Selection Status

**Vitall is now the selected lab partner.** Thriva was ruled out in April 2026 — their 200 tests/month minimum was incompatible with Phase 0 launch volumes. Commercial agreement with Vitall not yet signed. Meeting in progress.

**Note on the existing API integration spec:** `09_website-app/docs/thriva-integration-spec.md` and the webhook handler at `app/api/webhooks/thriva/route.ts` were built against Thriva's API (OAuth 2.0, Svix webhooks). This will need to be rebuilt against Vitall's API once their integration documentation is obtained.

---

### 1.2 Current Lab Shortlist

| Lab | Status | Reason |
|-----|--------|--------|
| Vitall | **Selected — pending agreement** | UKAS ISO 15189, white-labels for GenderGP and TR;BE. Panel confirmed (Active B12, hs-CRP, Albumin). |
| Forth Connect | Active — quote pending | CE-marked kits, NHS lab. Use as benchmark / backup if Vitall terms don't work. |
| Thriva Solutions | **Ruled out** | 200 tests/month minimum — incompatible with Phase 0 volumes |
| Forth | Pricing benchmark only | Less evidence of true white-label capability |
| One Day Tests / BloodLink | **De-ranked** | They operate their own TRT service — conflict of interest risk; they would have visibility into our volumes and business model |
| Medichecks | **Struck off** | Acquired Leger Clinic — now a direct TRT competitor. Do not approach |

---

### 1.3 Negotiation Priorities (for Thriva agreement)

In priority order:

1. **Speed to market** — target live within 2–4 weeks of signing
2. **Low or no minimums** — cannot commit to volume before demand is validated
3. **API integration** — non-negotiable. If results are locked to their portal, the conversion moment is lost
4. **Branded customer experience** — kit and results dashboard must feel like Andro Prime
5. **Wholesale pricing** — target £12–18 per test all-in (kit + processing + return postage)

**Watch out for:** Per-kit pricing that excludes return postage (adds £3–5). Results delivery locked to their portal. Long contract terms — push for monthly rolling or 3-month initial.

---

### 1.4 What Thriva Does for Us

1. Assembles and dispatches the physical kit to the customer's address
2. Receives the returned sample at the lab
3. Analyses the sample and produces biomarker results
4. Notifies us via webhook at each stage (fulfilled, received, results available, escalation)
5. Makes results available via a REST API

We never touch the sample, the lab, or the clinical governance layer. Integration is: **order in, results out.**

---

### 1.5 Critical Integration Point

The `result_set.available` webhook delivers a `result_set_id` only — not the biomarker data. The webhook handler must call back to the Thriva API to fetch the actual results. The current webhook stub in `app/api/webhooks/thriva/route.ts` incorrectly assumes the full payload arrives in the webhook body. This must be reworked before going live.

Full integration spec: `09_website-app/docs/thriva-integration-spec.md`.

---

## Part 2: Website Architecture

### 2.1 What Was Built

The application is a single Next.js deployment covering three distinct layers:

| Layer | Purpose | Location |
|-------|---------|----------|
| Marketing site | Canonical pages, SEO, acquisition | `app/(marketing)/` |
| Landing pages | Direct-response, paid traffic | `app/lp/` |
| App | Authenticated product experience | `app/(app)/` |

This is not a single-product site. The product scope expanded during build. Phases 1–7 are complete.

---

### 2.2 Tech Stack (Actual)

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Next.js (App Router, TypeScript) | Built |
| Hosting | Coolify on VPS, Cloudflare DNS | Configuration pending (Phase 9) |
| Database | Supabase — EU region (Ireland) | Schema migrated, RLS enabled |
| Payments | Stripe | Checkout routes built |
| Email / CRM | Customer.io | Event schema defined; sequences not yet built |
| Job queue | QStash | Thriva webhook jobs enqueued via QStash for retry resilience |
| Lab integration | Thriva Solutions REST API + Svix webhooks | Spec written; awaiting commercial agreement |
| Analytics | Plausible + GA4 + Meta Pixel (server-side) | Setup pending (Phase 10) |

**Note on automation:** The original plan proposed n8n for workflow automation. The build uses QStash for async job processing (Thriva webhook handler → result processing) and Customer.io for lifecycle events. n8n is not in the stack.

**Note on email:** The original plan proposed Resend or Mailgun. The build uses Customer.io as the single event-first email and CRM platform, triggered by Stripe and Thriva webhooks.

---

### 2.3 Site Map (Actual)

```
andro-prime.com/
├── / (Homepage)
├── /kits (Kits index)
│   ├── /kits/testosterone (Kit 1 — £29)
│   ├── /kits/energy-recovery (Kit 2 — £44)
│   └── /kits/hormone-recovery (Kit 3 — £69)
├── /supplements (Supplements index)
│   ├── /supplements/daily-stack (£34.95/mo)
│   └── /supplements/collagen (£29.95/mo)
├── /test-selector (Quiz — recommends correct kit)
├── /founding-member (£75 deposit page)
├── /waitlist (Email capture)
├── /how-it-works
├── /about
├── /blog
│   └── /blog/the-myth-of-the-normal-range
├── /faq
├── /contact
├── /privacy
└── /terms

Landing pages (separate acquisition layer, no footer):
├── /lp/testosterone
├── /lp/energy-recovery
├── /lp/hormone-recovery
├── /lp/foundations
├── /lp/daily-stack
└── /lp/collagen

Authenticated app (protected by middleware):
├── /results-dashboard
├── /founding-member-status
├── /subscriptions
└── /account

Auth routes:
├── /auth/login
├── /auth/signup
├── /auth/reset
└── /auth/callback
```

**Note:** The original plan proposed `/test` for the kit product page and `/results` for the results dashboard. The actual routes are `/kits/testosterone` and `/results-dashboard`.

**Note:** Auth is email and password — not magic link only. The three auth routes (login, signup, reset) are built under `app/auth/`.

---

### 2.4 Data Flow (Actual)

```
CUSTOMER JOURNEY:

1.  Customer visits andro-prime.com/kits/testosterone (or LP variant)
2.  Clicks "Check Your Levels" → Stripe Checkout (hosted)
3.  Stripe processes payment → webhook fires to /api/webhooks/stripe
4.  Stripe webhook handler:
    a. Creates/updates user record in Supabase (users table)
    b. Creates kit_orders row (status: 'paid')
    c. Emits 'purchase' event to Customer.io
    d. Triggers /api/thriva/dispatch
5.  Thriva dispatch:
    a. Creates Thriva user (POST /v1/users with external_reference = our user_id)
    b. Creates Thriva order (POST /v1/orders with kit panel profile ID)
    c. Stores thriva_order_id against kit_orders row
6.  Thriva ships kit to customer address (2–3 days)
7.  Thriva fires fulfillment webhook → /api/webhooks/thriva
    a. Verify Svix signature
    b. Update kit_orders status to 'dispatched'
    c. Emit 'kit_dispatched' event to Customer.io
8.  Customer collects sample, posts back to lab
9.  Thriva fires test.received_at_lab webhook → update status to 'sample_registered'
10. Lab processes sample (24–48 hours)
11. Thriva fires result_set.available webhook:
    a. Enqueue processing job via QStash (for retry resilience)
    b. Return 202 immediately
12. QStash job processor (/api/jobs/process-result):
    a. Fetch result from Thriva API (GET /v1/result-sets/{id}?include=biomarker-results)
    b. Store raw_payload to lab_results table
    c. Normalise biomarker values → insert into biomarker_values table
    d. Update kit_orders status to 'results_received'
    e. Emit 'result_received' event to Customer.io → triggers seq-03a or seq-03b
13. Customer receives "results ready" email → clicks magic link to /auth/login
14. Customer views /results-dashboard:
    - KitTabs shows which kit result is displayed
    - MarkerCards with TrafficLightBar per biomarker
    - Result classified → correct CTA shown (founding member / supplement / GP referral)
    - QualifierGate shown for hs-CRP results (joint symptom question)
15. For T < 12 nmol/L:
    - Primary CTA: Founding member deposit (£75)
    - Secondary CTA: Daily Stack ("while you wait")
16. Follow-up email sequences continue per Customer.io rules
```

---

### 2.5 Supabase Schema (Actual — Migration 20260416)

The schema that was actually built differs significantly from the March 30 plan. The actual schema reflects the multi-kit, multi-product scope and includes all tables required for supplement subscriptions, founding member deposits, lifecycle event logging, and the symptom qualifier system.

**Enums:**

```sql
create type public.kit_type as enum (
  'testosterone', 'energy-recovery', 'hormone-recovery'
);
create type public.order_status as enum (
  'pending', 'paid', 'dispatched', 'sample_registered',
  'processing', 'results_received', 'cancelled', 'refunded'
);
create type public.subscription_status as enum (
  'incomplete', 'trialing', 'active', 'past_due', 'cancelled', 'unpaid'
);
create type public.deposit_status as enum (
  'pending', 'paid', 'cancelled', 'refunded'
);
```

**Tables:**

| Table | Purpose |
|-------|---------|
| `users` | Account and profile. Linked to `auth.users`. Includes `age`, `marketing_consent`. |
| `kit_orders` | Purchase record per kit. `kit_type` enum. Full order status lifecycle. |
| `sample_registrations` | Barcode and dispatch tracking — lab-side kit identity. |
| `lab_results` | Full Thriva result payload (raw JSON) per order. |
| `biomarker_values` | Normalised per-marker values extracted from `lab_results`. |
| `symptom_answers` | Checkout/quiz symptom capture. Drives Kit 1 normal-T cross-sell logic. |
| `qualifier_responses` | In-dashboard qualifier answers (e.g. joint symptoms question for hs-CRP). |
| `supplement_subscriptions` | Active Stripe subscription state per user per product. |
| `founding_member_deposits` | Deposit payment record and status. |
| `lifecycle_events` | CRM event log — mirrors what is emitted to Customer.io. |

All tables have RLS enabled. All user-facing policies are scoped to `auth.uid() = user_id`.

**The original plan's schema** (`customers`, `orders`, `results`, `pipeline` tables) was not built. Use the migration file as the source of truth: `09_website-app/supabase/migrations/20260416_phase_04_auth_foundation.sql`.

---

### 2.6 API Routes (Actual — Phase 7)

**Stripe:**
- `POST /api/checkout/kit` — create Stripe Checkout session for kit purchase
- `POST /api/checkout/subscription` — create Checkout session for supplement subscription
- `POST /api/checkout/deposit` — create Checkout session for founding member deposit
- `POST /api/checkout/portal` — create Stripe Customer Portal session
- `POST /api/webhooks/stripe` — handles `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

**Thriva:**
- `POST /api/thriva/dispatch` — creates Thriva user + order after payment confirmed
- `POST /api/webhooks/thriva` — receives Svix-signed events from Thriva; enqueues processing via QStash

**Jobs:**
- `POST /api/jobs/process-result` — QStash-delivered job: fetches result from Thriva API, normalises, stores, fires Customer.io event

**Results:**
- `GET /api/results/qualifier` — serves qualifier gate question and stores response

**Forms:**
- `POST /api/forms/waitlist` — email capture → Supabase + Customer.io event
- `POST /api/forms/contact` — contact form
- `POST /api/forms/test-selector` — stores symptom answers from test-selector quiz

**Dev:**
- `POST /api/dev/seed-result` — seeds a fixture result for local development (remove before production)

---

### 2.7 Build Status by Phase

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Next.js scaffold | Complete |
| 2 | Shared layout components | Complete |
| 3 | Marketing layer migration | Complete — 16 April 2026 |
| 4 | Database schema and auth | Complete — 16 April 2026 |
| 5 | Results dashboard | Complete |
| 6 | Remaining app screens | Complete |
| 7 | Backend API routes and integrations | Complete |
| 8 | Docker setup | Outstanding |
| 9 | Deployment pipeline (Coolify, Cloudflare) | Outstanding |
| 10 | Analytics, monitoring, email sequences | Outstanding |

---

## Part 3: Results Dashboard

### 3.1 Strategic Purpose

Unchanged from original. The results dashboard is the single most important conversion mechanism in Phase 0. Every man who sees a red or amber testosterone result is a warm TRT lead. The dashboard's job:

1. Deliver clear, trustworthy results
2. Contextualise in plain English — never medical jargon
3. Provide actionable lifestyle guidance (creates value even for normal results)
4. Convert low-T results into founding member deposits
5. Cross-sell supplements where biomarker data supports it
6. Encourage retesting

### 3.2 What Was Built

The dashboard is at `/results-dashboard` under `app/(app)/`. It is significantly more sophisticated than the original wireframe, reflecting the multi-kit, multi-biomarker scope.

**Component architecture:**

| Component | Purpose |
|-----------|---------|
| `KitTabs` | Switches between Kit 1, Kit 2, Kit 3 result sets if the user has multiple |
| `MarkerCard` | Wraps the 5-part result structure for each biomarker |
| `TrafficLightBar` | Visual status indicator (optimal / normal / low / high / critical) |
| `StatusBadge` | Inline status label |
| `ResultValue` | Plain number display — big, above the fold |
| `ResultExplain` | What the number means in plain English |
| `ResultEducate` | Evidence-based context, non-sales |
| `ResultRecommend` | The correct Andro Prime next step |
| `ResultConvert` | Clean action, correctly framed |
| `QualifierGate` | hs-CRP joint symptom question — shown between Explain and Recommend |
| `DevFixtureBar` | Fixture selector for local development (hidden in production) |

**Fixture scenarios built** (for development and QA):

| Fixture | Covers |
|---------|--------|
| `low-testosterone` | Kit 1 — T < 12 nmol/L — founding member + Daily Stack CTAs |
| `optimal-testosterone` | Kit 1 — T > 20 nmol/L — retest CTA |
| `normal-testosterone-energy` | Kit 1 — T 12–20, energy symptoms stored — Daily Stack CTA |
| `normal-testosterone-no-energy` | Kit 1 — T 12–20, no energy symptoms — Kit 2 cross-sell |
| `low-vitamin-d` | Kit 2 — Daily Stack (D3 hero) |
| `low-ferritin` | Kit 2 — GP referral hard block |
| `elevated-crp` | Kit 2 — QualifierGate shown (joint symptoms?) |
| `high-crp` | Kit 2 — GP referral hard block, no supplement CTA |
| `low-b12` | Kit 3 — Daily Stack (B12 hero) |
| `multi-deficiency` | Kit 2 or Kit 3 — Complete Men's Stack CTA |

---

### 3.3 Classifier and Conversion Rules

The classifier maps biomarker values to result states, which determine which CTAs are shown. GP referral states hard-block all supplement CTAs.

| Result state | Qualifier needed | Primary CTA | Secondary CTA |
|-------------|-----------------|-------------|---------------|
| T < 12 nmol/L | None | Founding member deposit | Daily Stack |
| T 12–20 nmol/L | Check `symptom_answers` for energy symptoms | Daily Stack (zinc hero) | Kit 2 cross-sell (if energy symptoms) |
| T > 20 nmol/L | None | Retest reminder | — |
| Low Vitamin D | None | Daily Stack (D3 hero) | Kit 1 (if 40+ or 2+ deficiencies) |
| Low Magnesium | None | Daily Stack (Mg hero) | Kit 1 (if 40+ or 2+ deficiencies) |
| Elevated hs-CRP (1–10 mg/L) | Ask joint symptom question | Collagen (if Yes) | Lifestyle guidance (if No) |
| hs-CRP > 10 mg/L | None | GP referral only | — |
| Ferritin < 30 ug/L | None | GP referral + dietary guidance | — |
| Low B12 | None | Daily Stack (B12 hero) | — |
| 2+ deficiencies | None | Complete Men's Stack | Individual products |

**Founding member CTA rule:** Only triggered by T < 12 nmol/L from Kit 1 or Kit 3. Never triggered by Kit 2 markers alone. Never infer low testosterone from energy or recovery results.

---

### 3.4 Result Language Rules

These are enforced throughout the dashboard and all copy:

- "Your results indicate..." — never "You have..."
- "Below typical range for men your age" — never "You have low testosterone"
- "Consider specialist advice" — never "You need treatment"
- Always include the GP referral option alongside any founding member CTA
- "Find out if testosterone is the cause" (Kit 1) — not "find out why you're knackered" (that's Kit 2/3 territory)

Ewa Lindo signs off all threshold language before production.

---

### 3.5 Colour Thresholds (Kit 1 — Testosterone)

| Colour | Range | Copy |
|--------|-------|------|
| Green | > 15 nmol/L | "Within healthy range" |
| Amber | 10–15 nmol/L | "Lower end of range — worth monitoring" |
| Red | < 10 nmol/L | "Below typical range — consider specialist advice" |

These are information thresholds, not diagnostic thresholds. Full biomarker threshold reference: `04_products/results-engine/thresholds.md`.

---

### 3.6 Follow-Up Email Sequences (Customer.io — Not Yet Built)

Six sequences are defined and ready to build in Customer.io. None are live yet (Phase 10).

| Sequence | Trigger | Emails |
|----------|---------|--------|
| `seq-01` | Waitlist signup | 4 — welcome, education x2, launch day |
| `seq-02` | Kit purchase confirmed | 3 — dispatch, sample instructions, result ready |
| `seq-03a` | Result: low D/Mg/CRP | 6 — result, explain, recommend, check-in, outcome, Kit 3 upsell |
| `seq-03b` | Result: T < 12 nmol/L | 7 — result, explain, founding member CTA, scarcity, objections, update, monthly nurture |
| `seq-04` | First subscription payment | 5 — dispatch, week 1 expectations, check-in, retest prompt, referral |
| `seq-05` | 45 days no engagement | 3 — personal check-in, FAQ, frank word from Keith |

For GREEN testosterone results (T > 15 nmol/L), the seq-03b sequence pivots to: retest reminder, supplement introduction, educational content about age-related decline.

---

### 3.7 Dashboard Design Principles

1. **Mobile-first.** Most men open the results email on their phone. The dashboard works on 375px.
2. **Number first.** Big result, clear colour, one-line interpretation — above the fold. No scrolling through disclaimers to find the number.
3. **Plain English.** Never "hypogonadal range." Always "below typical levels for your age."
4. **GP referral always present.** Alongside any CTA. Ethically correct and legally protective.
5. **Don't oversell.** The dashboard must feel like a trusted health resource. If the man trusts the report, he trusts the brand.

---

## Pricing (Resolved)

The original document raised the pricing challenge at £39 for Kit 1. This is resolved. Kit 1 launched at **£29**.

| Kit | Price | COGS | Gross Margin |
|-----|-------|------|-------------|
| Kit 1: Testosterone Health Check | £29 | £17 | 41% |
| Kit 2: Energy & Recovery Check | £44 | £22 | 50% |
| Kit 3: Hormone & Recovery Check | £69 | £35 | 49% |

At £29 / £17 COGS = £12 gross margin per Kit 1. The pipeline value (each low-T result is a potential £185/month TRT patient) makes kit margin irrelevant. The margin hit was the right call.

---

## What's Still Open

### Immediate blockers

| Item | Dependency | Owner |
|------|-----------|-------|
| Sign Thriva commercial agreement | Required before any real order can be placed | Keith |
| Confirm Thriva panel profile IDs for all three kits | Required before dispatch route goes live | Thriva onboarding |
| Fix Thriva webhook handler (webhooks deliver IDs only — not full payload) | `app/api/webhooks/thriva/route.ts` | Engineering |
| Add Svix signature verification to webhook handler | Replace current `x-thriva-signature` stub | Engineering |
| Rename env var: `THRIVA_API_KEY` → `THRIVA_CLIENT_ID`, add `THRIVA_CLIENT_SECRET` | `.env.example` and Coolify config | Engineering |
| Add `thriva_user_id` to `users` table, `thriva_order_id` to `kit_orders` | New migration required | Engineering |
| Remove dev seed route before production deploy | `app/api/dev/seed-result/route.ts` | Engineering |

### Phases 8–10 (outstanding)

| Phase | Description | Estimated effort |
|-------|-------------|-----------------|
| 8 | Docker setup (multi-stage Dockerfile, docker-compose, .dockerignore) | 1 day |
| 9 | Coolify deployment pipeline, Cloudflare DNS, first live deploy, rollback procedure | 2 days |
| 10 | Plausible + GA4 + Meta Pixel analytics, Sentry, all 6 Customer.io email sequences built and tested | 3–5 days |

### Decisions still required

1. **Energy symptom capture point** — where in the journey are these stored? Checkout quiz, post-purchase onboarding, or in-dashboard? Required for Kit 1 normal-T cross-sell logic. Currently stored in `symptom_answers` via the test-selector form, but the cross-sell logic depends on this being populated correctly.

2. **Barcode registration flow** — how does the Thriva result get matched to the correct user? What is the customer-facing flow from kit dispatch to barcode registration?

3. **Kit 3 B12 logic** — ships at launch or feature-flagged?

4. **Gate 0A supplement MOQ** — 25 pre-orders with deposits must be received before placing the supplement inventory order (£4k–7k). Do not order until Gate 0A is confirmed.

---

## Pipeline Metrics to Track

| Metric | Gate target | Where to track |
|--------|------------|----------------|
| Total kits sold (all types) | Gate 0A: 25+ in Week 6 | Supabase `kit_orders` |
| % Kit 1 results with T < 12 nmol/L | Expected 35% | Supabase `biomarker_values` |
| % low-T results clicking founding member CTA | — | `lifecycle_events` (`cta_clicked`) |
| % converting to £75 deposit | — | `founding_member_deposits` |
| Kit 2/3 buyers converting to supplements | Gate 0B: 10%+ by Week 10 | `supplement_subscriptions` |
| Founding member deposits total | CQC trigger: 40+ | `founding_member_deposits` |
| CAC per kit by acquisition channel | — | UTM params in `lifecycle_events` |

---

**Last updated:** April 20, 2026
**Owner:** Keith Antony
**Status:** Build Phases 1–7 complete. Thriva agreement and Phases 8–10 outstanding.
