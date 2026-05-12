# Website / App — Context

**Stack:** Next.js · Supabase (EU Frankfurt) · Stripe · Customer.io · Coolify (VPS) · Cloudflare
**Owner workspace:** `09_website-app`
**Integration:** Events emitted from `lib/customerio/emit.ts`. Database writes via Supabase client in `lib/db/`. Stripe webhooks handled in `app/api/webhooks/stripe/`. Vitall result webhooks queued via Upstash QStash. (Historic Thriva webhook stubs under `app/api/webhooks/thriva/` to be retired.)

This workspace governs the full technical implementation: frontend, backend, database, automations, and deployment. Read `../CLAUDE.md` before any work here. Two non-negotiable constraints run across everything: Supabase must use EU (Frankfurt) region — biomarker data is special category health data under UK GDPR — and `/dashboard/*` must never be captured by session recording tools.

---

## Directory Structure

```text
09_website-app/
├── design/                  ← Wireframes, mockups, Figma exports
├── frontend/
│   ├── canonical-site/      ← Trust, browseable, organic-facing pages
│   ├── lp/                  ← Direct-response acquisition landing pages
│   ├── app/                 ← Authenticated user experience
│   ├── email-templates/     ← Sequences and transactional (see its own CONTEXT.md)
│   │   ├── sequences/
│   │   └── transactional/
│   ├── components/
│   │   ├── commerce/
│   │   ├── lp/
│   │   ├── marketing/
│   │   ├── results-engine/
│   │   └── shared/
│   ├── assets/
│   ├── seo-schema/
│   ├── styles/
│   └── scripts/
├── backend/                 ← API routes, services, webhooks, jobs, middleware
├── database/                ← Schema, migrations, views, seeds
├── automations/             ← Customer.io build specs, n8n workflow diagrams
└── docs/
    └── implementation-plan.md  ← Full 10-phase build plan — read before starting a new phase
```

The full sequenced build plan lives in `docs/implementation-plan.md`. Read it before starting any new phase of work. It covers phase dependencies, open questions that must be resolved before the results dashboard build starts, the database schema, and the results-engine conditional logic.

---

## Frontend — Three Zones

Keep these zones separated. Different purposes. Do not merge casually.

| Zone | Path | Purpose |
|---|---|---|
| Canonical site | `frontend/canonical-site/` | SEO, brand trust, organic — browseable pages with nav |
| Landing pages | `frontend/lp/` | Direct-response acquisition — single CTA, no nav |
| App | `frontend/app/` | Authenticated experience — dashboard, account, subscriptions |

### Canonical Site Pages

| URL | Directory |
|---|---|
| `/` | `canonical-site/home/` |
| `/waitlist/` | `canonical-site/waitlist/` |
| `/test-selector/` | `canonical-site/test-selector/` |
| `/kits/testosterone/` | `canonical-site/kits/testosterone/` |
| `/kits/energy-recovery/` | `canonical-site/kits/energy-recovery/` |
| `/kits/hormone-recovery/` | `canonical-site/kits/hormone-recovery/` |
| `/supplements/daily-stack/` | `canonical-site/supplements/daily-stack/` |
| `/supplements/collagen/` | `canonical-site/supplements/collagen/` |
| `/founding-member/` | `canonical-site/founding-member/` |
| `/about/`, `/blog/`, `/faq/`, `/how-it-works/`, `/contact/`, `/privacy/`, `/terms/` | `canonical-site/[page]/` |

### Landing Pages

| URL | Directory |
|---|---|
| `/lp/testosterone/` | `lp/testosterone/` — Kit 1 |
| `/lp/energy-recovery/` | `lp/energy-recovery/` — Kit 2 |
| `/lp/foundations/` | `lp/foundations/` — Kit 3 |
| `/lp/daily-stack/` | `lp/daily-stack/` |
| `/lp/collagen/` | `lp/collagen/` |

### App Pages

| URL | Directory |
|---|---|
| `/dashboard/` | `app/results-dashboard/` |
| `/account/` | `app/account/` |
| `/auth/` | `app/auth/` |
| `/founding-member-status/` | `app/founding-member-status/` |
| `/subscriptions/` | `app/subscriptions/` |

---

## Results Dashboard — Conditional Logic

Never show a generic "buy supplements" CTA. Always match the CTA to the specific result.

Dashboard sections follow this five-part structure: **Result → Explain → Educate → Recommend → Convert.** Never lead with a product CTA.

Canonical source: `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8. That document supersedes this table on any conflict.

Elevated hs-CRP requires a qualifier question before any recommendation: "Do you experience joint stiffness or soreness after training?" — shown between the hs-CRP result and the recommendation section, triggered only when hs-CRP is elevated.

| Result | Qualifier needed? | Primary CTA | Secondary CTA |
|---|---|---|---|
| T < 12 nmol/L | None | Founding-member list opt-in (non-cash) | Daily Stack ("while you wait" framing) |
| T 12–20 nmol/L | Check energy symptoms stated | Daily Stack (zinc hero) | Kit 2 cross-sell (if energy symptoms) |
| T > 20 nmol/L | None | Retest reminder (6–12 months) | — |
| Low Vit D | None | Daily Stack (D3 hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) |
| Low Magnesium | None | Daily Stack (Mg hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) |
| Elevated hs-CRP | Ask joint symptoms question | Collagen (if joint symptoms: Yes) | Lifestyle guidance (if joint symptoms: No) |
| hs-CRP > 10 mg/L | None | GP referral — no supplement CTA | — |
| Low Ferritin < 30 µg/L | None | GP referral + dietary guidance | — |
| Low B12 (Kit 3) | None | Daily Stack (B12 hero) | — |
| 2+ deficiencies | None | Complete Men's Stack (£54.95/mo) | Individual products as fallback |

---

## How to Work Here

### Adding or editing a frontend page

1. Identify the zone: canonical site, LP, or app. Never merge zones.
2. Add a unique `<title>` and `<meta name="description">` to every page.
3. Kit and supplement pages (canonical + LP): price visible above the fold. Trust signals required: "UKAS ISO 15189 Accredited Lab" and "No GP needed."
4. One primary CTA per page. Unique `id` attributes on all interactive elements. No stock photography.
5. Run the compliance checklist before saving any copy.
6. File naming: lowercase kebab-case throughout (`kit-2-product-page.tsx`).

### Adding or editing backend logic

1. Read `docs/implementation-plan.md` for phase dependencies before starting any new area.
2. Stripe webhooks live in `app/api/webhooks/stripe/`. Customer.io events are emitted via `lib/customerio/emit.ts`.
3. Database writes go via Supabase client in `lib/db/`. Never write result data outside the EU (Frankfurt) region.
4. Enqueue lab webhook jobs (Vitall) via Upstash QStash — do not process inline. Failed webhooks aren't typically retried by the lab partner; silent failure means lost results.

### Adding or editing email copy

Email templates have their own CONTEXT.md. Read `frontend/email-templates/CONTEXT.md` before touching any email file. The Customer.io build specs and sequence trigger logic live in `automations/customerio/sequences.md` — read that alongside the copy file when building in the Customer.io UI.

### Modifying results dashboard CTA logic

1. Check `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8 first — canonical source.
2. Never add a supplement CTA to an hs-CRP > 10 mg/L or Low Ferritin < 30 µg/L result.
3. Do not surface the founding member CTA on any result except confirmed T < 12 nmol/L.
4. Always implement the five-part structure. Never lead with Convert.

### Adding a new page type or route

1. Determine the correct zone (canonical, LP, or app).
2. Add the route to this CONTEXT.md directory table.
3. Add SEO schema to `frontend/seo-schema/` if the page is public-facing.
4. Confirm the page is excluded from Microsoft Clarity if it touches `/dashboard/*`.

---

## Compliance Checklist

Run before saving any frontend copy, results dashboard logic, or backend copy strings:

- [ ] No "diagnose," "diagnosis," "treat," "treatment," "cure"
- [ ] No claim that TRT is currently available on any wellness page
- [ ] Supplement copy uses EFSA-approved health claims only (see root `CLAUDE.md`)
- [ ] Results copy uses "Your results indicate..." not "You have..."
- [ ] No supplement CTA shown for hs-CRP > 10 mg/L or Low Ferritin < 30 µg/L results
- [ ] Founding member CTA only appears when T < 12 nmol/L is confirmed — never inferred from energy markers alone
- [ ] Kit 1 copy scoped to testosterone only — does not claim to explain general fatigue
- [ ] `/dashboard/*` excluded from Microsoft Clarity session recording
- [ ] Supabase region is EU (Frankfurt) for all biomarker data writes
- [ ] No ashwagandha mentions anywhere (silent ingredient — see root `CLAUDE.md`)

---

## Technical Stack Reference

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js (React) | SSR for public pages. Client components only where interactivity requires. |
| Hosting | Coolify (VPS) | Docker container from GitHub. Cloudflare DNS and proxy. |
| Database | Supabase (Postgres) | **EU (Frankfurt) only.** Sign DPA with Supabase before first result is stored. |
| Payments | Stripe | One-off kit purchases + recurring subscriptions + webhooks. One Stripe Coupon object per PT partner, created at onboarding. |
| Email / CRM | Customer.io | Event-triggered. NOT Klaviyo. Conditional branching fits result-driven sequences. |
| Affiliate | FirstPromoter | v2.3 stack: PT/influencer code = 10% customer discount + £15 flat per kit + £10 Kit 3 upsell + £10 supplement-conversion + Silver £200 / Gold £400 PT graduation bonuses. Customer referral (credit-based). |
| Error monitoring | Sentry | Catches silent Vitall webhook failures and dashboard render errors. Free tier. |
| Webhook queue | Upstash QStash | Enqueue Vitall jobs immediately (202 OK), retry on failure. |
| Web analytics | Plausible | EU-hosted, no cookies, UK GDPR compliant. £9/mo. Primary analytics tool. |
| Ad conversion | GA4 + Meta Pixel | Server-side events only for key conversions (purchase, sign-up). No page-level tracking scripts. |
| Session recording | Microsoft Clarity | Free. **Exclude `/dashboard/*` at the project level — not just in code.** |
| Fonts | Inter · Merriweather · JetBrains Mono | Via Google Fonts. |

---

## Special Cases

**Supabase DPA:** Must be signed before the first biomarker result is stored. Do not activate the results pipeline without this in place.

**Microsoft Clarity exclusion:** `/dashboard/*` must be excluded at the Clarity project settings level, not just conditionally suppressed in code. Verify this at QA before go-live.

**Stripe Coupon objects for PT partners:** One coupon object per personal trainer, created at partner onboarding. FirstPromoter requires this to assign commission correctly. Coordinate with `/05_partners`.

**Lab webhook reliability (Vitall):** The lab partner does not retry failed webhooks. QStash must be live before the results pipeline activates. Silent failure = lost result with no recovery path.

**seq-04 Email 5 — Day 75 retest prompt:** Requires a `SUBSCRIBER10` Stripe coupon (10% off, valid 14 days) to exist before this email activates. Create it in Stripe before enabling the sequence. Coordinated between this workspace and `07_sales`.

**seq-05 Email 3 — pause option:** References Stripe subscription pause. Confirm this feature is live in the account portal before activating the churn prevention sequence.

---

## Platform Notes

- Aesthetic: light editorial. White backgrounds, black type, no border-radius, no gradients. See `02_brand/brand-guidelines.md` V2.0.
- Layout: mobile-first throughout.
- This workspace does not own: strategy (→ `/01_strategy`), compliance approval as a primary task (→ `/03_compliance`), product threshold logic unless translating already-approved rules into code (→ `/04_products`), content strategy detached from the site (→ `/06_marketing`).
