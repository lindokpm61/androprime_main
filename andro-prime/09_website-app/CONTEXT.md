# Website/App Workspace Context

## Purpose

This workspace governs the full technical implementation: frontend, backend, database, automations, and deployment.

Read `../CLAUDE.md` (root) before any web work.

---

## Technical Stack

- **Framework:** Next.js (React) — SSR for SEO, API routes for backend logic, one repo for everything
- **Hosting:** VPS via Coolify — Docker container deployed from GitHub. Cloudflare for DNS and proxy. See `docs/implementation-plan.md` for the full deployment pipeline.
- **Database:** Supabase (Postgres) — **must use EU (Frankfurt) region** — biomarker data is special category health data under UK GDPR. Sign DPA with Supabase before first result is stored.
- **Payments:** Stripe — one-off kit purchases + recurring supplement subscriptions + webhooks. PT affiliates require Stripe Coupon objects (one per PT) created at onboarding.
- **Email/CRM:** Customer.io — API/event-first, triggered by custom events (`result_received`, `kit_dispatched`, etc.). NOT Klaviyo — Customer.io's conditional branching fits the result-driven sequence model.
- **Affiliate:** FirstPromoter (Stripe-native) — handles influencer (link-based, 20% commission), PT (Stripe coupon 15% off + 20% commission), and customer referral (credit-based) in one dashboard.
- **Error monitoring:** Sentry — catches silent Thriva webhook failures and dashboard render errors. Free tier.
- **Webhook queue:** Upstash QStash — enqueue Thriva webhook jobs immediately (202 OK), process with retry on failure. Prevents silent result loss.
- **Web analytics:** Plausible Analytics — EU-hosted, no cookies, UK GDPR compliant, £9/mo. Primary analytics tool.
- **Ad conversion tracking:** GA4 + Meta Pixel — server-side events only for key conversions (purchase, sign-up). Not page-level tracking scripts.
- **Session recording:** Microsoft Clarity (free) — **exclude `/dashboard/*` entirely**. Never record a user's screen during biomarker result display.
- **Font:** Inter (headlines, UI) + Merriweather (body copy) + JetBrains Mono (data labels) — all via Google Fonts
- **Aesthetic:** Light editorial. White backgrounds, black type, no radius, no gradients. See `02_brand/brand-guidelines.md` V2.0.
- **Layout:** Mobile-first

---

## Directory Map

```text
frontend/
├── canonical-site/          ← Trust, browseable, organic-facing pages
│   ├── home/                ← androprime.co.uk
│   ├── waitlist/            ← /waitlist/ (email capture, pre-launch)
│   ├── test-selector/       ← /test-selector/ (quiz)
│   ├── kits/
│   │   ├── testosterone/    ← /kits/testosterone/
│   │   ├── energy-recovery/ ← /kits/energy-recovery/
│   │   └── hormone-recovery/← /kits/hormone-recovery/
│   ├── supplements/
│   │   ├── daily-stack/     ← /supplements/daily-stack/
│   │   └── collagen/        ← /supplements/collagen/
│   ├── founding-member/     ← /founding-member/
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── faq/
│   ├── how-it-works/
│   ├── privacy/
│   └── terms/
├── lp/                      ← Direct-response acquisition landing pages
│   ├── testosterone/        ← Kit 1 LP
│   ├── energy-recovery/     ← Kit 2 LP
│   ├── foundations/         ← Kit 3 LP
│   ├── daily-stack/         ← Supplement LP
│   └── collagen/            ← Supplement LP
├── app/                     ← Authenticated user experience
│   ├── results-dashboard/   ← Post-kit, conditional logic display
│   ├── account/
│   ├── auth/
│   ├── founding-member-status/
│   └── subscriptions/
├── email-templates/
│   ├── sequences/           ← seq-01 through seq-05 (triggered by result events)
│   └── transactional/       ← Order confirmation, dispatch, account emails
├── components/
│   ├── commerce/
│   ├── lp/
│   ├── marketing/
│   ├── results-engine/
│   └── shared/
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── illustrations/
│   └── images/
├── seo-schema/
│   ├── article-schema/
│   ├── faq-schema/
│   ├── organisation-schema/
│   └── product-schema/
├── styles/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   ├── themes/
│   ├── tokens/
│   └── utilities/
└── scripts/
```

---

## Landing Page Standards

Every page MUST have:

- Unique `<title>` and `<meta name="description">` (SEO-specific)
- Price visible above the fold
- "UKAS ISO 15189 Accredited Lab" trust signal visible
- "No GP needed" trust signal visible
- Single primary CTA per page
- Unique `id` attributes on all interactive elements
- No stock photography

---

## Results Dashboard Conditional Logic

Never show a generic "buy supplements" CTA. Always match CTA to the specific result.

Canonical source: `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8. That document supersedes this table if there is any conflict.

Dashboard sections follow the 5-part structure: Result → Explain → Educate → Recommend → Convert. Never lead with a product CTA.

Elevated hs-CRP requires a qualifier question before any recommendation: "Do you experience joint stiffness or soreness after training?" — shown between the hs-CRP result and recommendation section, triggered only when hs-CRP is elevated.

| Result | Qualifier needed? | Primary CTA | Secondary CTA |
| ------ | ----------------- | ----------- | ------------- |
| T < 12 nmol/L | None | Founding member deposit | Daily Stack ("while you wait" framing) |
| T 12–20 nmol/L | Check if energy symptoms stated | Daily Stack (zinc hero) | Kit 2 cross-sell (if energy symptoms) |
| T > 20 nmol/L | None | Retest reminder (6–12 months) | — |
| Low Vit D | None | Daily Stack (D3 hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) |
| Low Magnesium | None | Daily Stack (Mg hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) |
| Elevated hs-CRP | Ask joint symptoms question | Collagen (if joint symptoms: Yes) | Lifestyle guidance (if joint symptoms: No) |
| hs-CRP > 10 mg/L | None | GP referral — no supplement CTA | — |
| Low Ferritin < 30 µg/L | None | GP referral + dietary guidance | — |
| Low B12 (Kit 3, if confirmed with Thriva) | None | Daily Stack (B12 hero) | — |
| 2+ deficiencies | None | Complete Men's Stack (£54.95/mo) | Individual products as fallback |

---

## Email Sequences

| Folder | Trigger | Purpose |
| ------ | ------- | ------- |
| `seq-01-pre-launch-waitlist/` | Waitlist sign-up | 4 emails: welcome, education, education, launch day |
| `seq-02-post-purchase-pending/` | Kit purchase confirmed | 3 emails: dispatch, sample instructions, result ready |
| `seq-03a-result-energy-deficiency/` | Kit result: low D/Mg/high CRP | 6 emails: result, explain, recommend, check-in, outcome, Kit 3 upsell |
| `seq-03b-result-low-testosterone/` | Kit result: T < 12 nmol/L | 7 emails: result, explain, founding member CTA, scarcity, objections, update, monthly nurture |
| `seq-04-subscriber-onboarding/` | First subscription payment | 5 emails: dispatch, week 1 expectations, check-in, retest prompt, referral |
| `seq-05-churn-prevention/` | 45 days no engagement | 3 emails: personal check-in, FAQ, frank word from Keith |

---

## Compliance — Non-negotiable

- Do not use: diagnose, diagnosis, treat, treatment, cure
- Do not mention TRT as currently available on any wellness page
- All supplement copy must use EFSA-approved health claims only (see root `CLAUDE.md`)
- Results copy uses "Your results indicate..." not "You have..."
- Exclude `/dashboard/*` from all session recording tools (Microsoft Clarity)
- Supabase must use EU (Frankfurt) region — biomarker data is UK GDPR special category

---

## File Naming Convention

All web files use lowercase-kebab-case: `kit-2-product-page.html`

---

## Implementation Plan

The full sequenced build plan is in `docs/implementation-plan.md`. Read it before starting any new phase of work. It covers:

- all 10 phases from Next.js scaffold to analytics/email
- phase dependencies and what blocks what
- the four open questions that must be resolved before the results dashboard build starts
- the database schema
- the results dashboard rule engine and conditional logic

---

## Subareas

- `design/` = wireframes, mockups, Figma exports
- `frontend/canonical-site` = trust, browseable, organic-facing pages
- `frontend/lp` = direct-response acquisition landing pages
- `frontend/app` = authenticated user experience
- `frontend/styles` = tokens, base, layout, components, pages, utilities, themes
- `frontend/seo-schema` = structured data definitions
- `backend/` = API, services, webhooks, jobs, middleware
- `database/` = schema, migrations, views, seeds
- `automations/` = n8n and workflow diagrams

## Do not use this workspace for

- Strategy ownership (→ `/01_strategy`)
- Compliance approval as the primary task (→ `/03_compliance`)
- Product threshold logic unless translating already-approved rules into implementation (→ `/04_products`)
- Generic content strategy detached from the site/app (→ `/06_marketing`)
