# Website / App — Context

**Stack:** Next.js 15 (App Router, React 19) · Supabase (EU Frankfurt) · Stripe · Customer.io · Upstash QStash · Coolify (VPS) · Cloudflare
**Owner workspace:** `09_website-app`
**Live app root:** `frontend/` (this is the real Next.js project: `package.json`, `next.config.ts`, `middleware.ts`, `app/`)
**Integration:** Customer.io events via `frontend/lib/customerio/emit.ts`. DB access via the Supabase clients in `frontend/lib/supabase/`. Stripe webhooks at `app/api/webhooks/stripe/`. Vitall result webhooks land at `app/api/webhooks/vitall/`, are enqueued on Upstash QStash, then processed by `app/api/jobs/process-result/`.

This workspace governs the full technical implementation: frontend, backend (API routes), database, automations, and deployment. Read `../CLAUDE.md` before any work here. Two non-negotiable constraints run across everything: Supabase must use EU (Frankfurt) region (biomarker data is special-category health data under UK GDPR), and the authenticated app routes (`/results-dashboard` etc.) must never be captured by session-recording tools.

---

## Architecture (current — single Next.js App Router app)

The site is **one Next.js application** under `frontend/`, not separate static-HTML zones. Pages are organised with **route groups** inside `frontend/app/`:

- `app/(marketing)/*` — public, SEO-indexed pages (served at root URLs, e.g. `/kits/testosterone`).
- `app/(app)/*` — authenticated experience (dashboard, account, subscriptions). Guarded by `middleware.ts`.
- `app/auth/*` — passwordless auth flows (login/signup/link/consent + callback/logout/post-checkout route handlers).
- `app/lp/*` — direct-response landing pages. `noindex` per-page (`robots: { index: false }`) and disallowed in `app/robots.ts`.
- `app/api/*` — all backend route handlers (webhooks, checkout, forms, jobs, OG images).
- `app/activate/*` — **deprecated 2026-06-12** (login-gated per-order activation scrapped; auth is already passwordless via `/auth/post-checkout`). Still present, slated for removal.
- `app/admin/dashboard/` — internal admin metrics.

Blog content is **MDX files in `frontend/content/blog/*.mdx`**, rendered dynamically by `app/(marketing)/blog/[slug]/page.tsx`. Visibility is status-gated (`status: published|draft`) in `lib/blog.ts`. See `06_marketing/seo-ai-search/` + the SEO memory notes for the content engine.

### Dead cruft (NOT served — safe to delete, flagged not removed)

These are leftovers from the old static-HTML model and are not wired into the build:

- `frontend/canonical-site/` — old static pages, superseded by `app/(marketing)/`.
- `frontend/lp/` — old static LPs, superseded by `app/lp/` (note: the **live** LPs are `app/lp/`, the **dead** ones are `frontend/lp/`).
- `backend/` (top-level) — legacy reference dir; all real API code is in `frontend/app/api/`.
- `frontend/app/account/`, `app/results-dashboard/`, `app/subscriptions/`, `app/founding-member-status/` — **empty** leftover dirs; the real routes live under `app/(app)/`.

Ask before deleting — these are uncommitted-history-free but worth a deliberate cleanup commit.

---

## Directory Structure

```text
09_website-app/
├── frontend/                 ← LIVE Next.js app
│   ├── app/
│   │   ├── (marketing)/      ← public SEO pages + blog
│   │   ├── (app)/            ← auth-protected app (dashboard/account/subs/FM/supp-waitlist status)
│   │   ├── auth/             ← passwordless auth flows + route handlers
│   │   ├── lp/               ← noindex direct-response landing pages
│   │   ├── api/              ← all backend route handlers
│   │   ├── activate/         ← DEPRECATED
│   │   ├── admin/dashboard/  ← internal metrics
│   │   ├── layout.tsx, robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx, global-error.tsx
│   ├── content/blog/         ← MDX articles (source of the blog)
│   ├── components/           ← analytics, app, auth, commerce, founding-member, lp, marketing,
│   │                            results-engine, shared, supplement-waitlist, activate
│   ├── lib/                  ← app logic (see lib map below)
│   ├── scripts/              ← audit-keyword-coverage.js, seed-result.ts, test-classifier-regressions.ts, sync-supabase-migrations.ps1, unsplash.mjs; e2e/ (e2e-vitall-local.ts, test-vitall-webhook.ts, place-vitall-test-orders.ts)
│   ├── public/ · styles/ · assets/ · types/
│   ├── next.config.ts · middleware.ts · tailwind.config.ts · Dockerfile
│   ├── canonical-site/ · lp/  ← DEAD CRUFT (see above)
├── backend/                  ← DEAD CRUFT (legacy; code is in frontend/app/api/)
├── database/                 ← migrations / schema / seeds / views
├── supabase/                 ← Supabase CLI config + migrations
├── automations/              ← customerio/sequences.md, n8n workflow specs
├── deployment/               ← Coolify, env, analytics, monitoring notes
├── docs/                     ← implementation-plan.md + arch/spec docs (read before a new phase)
├── design/ · qa/
└── CONTEXT.md
```

The sequenced build plan lives in `docs/implementation-plan.md` (plus `phase5/6/7-implementation-plan.md`). Integration specs: `docs/vitall-integration-spec.md`. (`docs/thriva-integration-spec.md` is historic — Thriva/Forth ruled out, Vitall confirmed.)

---

## Route Map (URL → file)

### Public — `app/(marketing)/`
| URL | File |
|---|---|
| `/` | `(marketing)/page.tsx` |
| `/about` | `(marketing)/about/page.tsx` |
| `/blog`, `/blog/[slug]` | `(marketing)/blog/page.tsx`, `(marketing)/blog/[slug]/page.tsx` |
| `/authors/[slug]` | `(marketing)/authors/[slug]/page.tsx` |
| `/kits`, `/kits/testosterone`, `/kits/energy-recovery`, `/kits/hormone-recovery` | `(marketing)/kits/...` |
| `/supplements`, `/supplements/daily-stack`, `/supplements/collagen` | `(marketing)/supplements/...` |
| `/test-selector`, `/waitlist`, `/supplement-waitlist`, `/founding-member` | `(marketing)/...` |
| `/how-it-works`, `/faq`, `/contact`, `/privacy`, `/terms` | `(marketing)/...` |
| `/checkout/details`, `/order/confirmed`, `/subscription/confirmed` | `(marketing)/...` |

### Authenticated — `app/(app)/` (protected by `middleware.ts`)
| URL | File | Protected? |
|---|---|---|
| `/results-dashboard` | `(app)/results-dashboard/page.tsx` | yes |
| `/account` | `(app)/account/page.tsx` | yes |
| `/subscriptions` | `(app)/subscriptions/page.tsx` | yes |
| `/founding-member-status` | `(app)/founding-member-status/page.tsx` | yes |
| `/supplement-waitlist-status` | `(app)/supplement-waitlist-status/page.tsx` | not in matcher* |

\*Middleware `matcher` covers `/results-dashboard`, `/subscriptions`, `/account`, `/founding-member-status` only. If `/supplement-waitlist-status` must be gated, add it to `protectedRoutes` + `matcher` in `middleware.ts`.

### Auth — `app/auth/`
`/auth/login`, `/auth/signup`, `/auth/reset`, `/auth/link`, `/auth/consent` (pages); `/auth/callback`, `/auth/logout`, `/auth/post-checkout` (route handlers).

### Landing pages — `app/lp/` (noindex)
`/lp/testosterone`, `/lp/energy-recovery`, `/lp/hormone-recovery`, `/lp/daily-stack`, `/lp/collagen`. `/lp/foundations` → 301 → `/lp/hormone-recovery` (in `next.config.ts`).

### API — `app/api/`
- **Webhooks:** `webhooks/stripe`, `webhooks/vitall`
- **Jobs:** `jobs/process-result` (QStash consumer)
- **Checkout:** `checkout/kit`, `checkout/subscription`, `checkout/portal`
- **Forms:** `forms/contact`, `forms/newsletter`, `forms/test-selector`, `forms/waitlist`
- **Lists/results:** `founding-member/join`, `supplement-waitlist/join`, `results/qualifier`, `lowt-nurture/consent`
- **Lab:** `vitall/dispatch`
- **Analytics/OG:** `events`, `og/blog/[slug]` (`?variant=card|social`)
- **Dev/deprecated:** `dev/seed-result`, `activate`

---

## lib/ Map

| Path | Purpose |
|---|---|
| `lib/supabase/{client,server,admin,middleware,env,types}.ts` | DB access layer. `client` = browser/SSR-safe; `server`/`admin` = privileged. EU region only. |
| `lib/customerio/emit.ts` | Emit events to Customer.io (checkout, signup, result, subscription). Critical integration. |
| `lib/results/` | **Results engine.** `classifier.ts` (low/normal/elevated), `normaliser.ts`, `processResult.ts` (parse Vitall payload → classify → emit), `buildDashboardFromScenario.ts` + `getDashboardData.ts` (5-part sections), `biomarker-copy.ts` (Ewa-approved strings), `lowtNurtureConsent.ts`, `seed.ts`, `types.ts`, `fixtures/`. |
| `lib/blog.ts` | MDX frontmatter parse + `isVisible()` status gate + YAML date-as-Date guard. |
| `lib/authors.ts` | Author/Person schema (Ewa credentials). |
| `lib/analytics/{ga4,events,consent,page-attribution}.ts` | GA4 (live, `G-D5M4J5M3F6`), event tracking, consent state, UTM attribution. |
| `lib/auth/{actions,session,isAdmin}.ts` | Passwordless auth, session checks, admin gate. |
| `lib/stripe/client.ts`, `lib/pricing.ts` | Stripe SDK + product/SKU metadata. |
| `lib/qstash/verify.ts` | Verify QStash signatures on the result job. |
| `lib/vitall/{client,types}.ts` | Vitall API client + payload types. |
| `lib/{account,admin,dashboard,founding-member,subscriptions,supplement-waitlist,activate}/` | Per-feature data fetchers. |

---

## Results Dashboard — Conditional Logic

Lives at `/results-dashboard` (`app/(app)/results-dashboard/`), built from `lib/results/`. Never show a generic "buy supplements" CTA — match the CTA to the specific result.

Sections follow **Result → Explain → Educate → Recommend → Convert.** Never lead with a product CTA.

Canonical source: `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8. That document supersedes this table on any conflict.

Elevated hs-CRP requires a qualifier question before any recommendation ("Do you experience joint stiffness or soreness after training?"), handled by `app/api/results/qualifier/` and shown only when hs-CRP is elevated.

| Result | Qualifier? | Primary CTA | Secondary CTA |
|---|---|---|---|
| T < 12 nmol/L | None | Founding-member list opt-in (non-cash) | Daily Stack ("while you wait") |
| T 12–20 nmol/L | Check energy symptoms | Daily Stack (zinc hero) | Kit 2 cross-sell (if energy symptoms) |
| T > 20 nmol/L | None | Retest reminder (6–12 months) | — |
| Low Vit D | None | Daily Stack (D3 hero) | Kit 1 cross-sell (if 40+ or 2+ deficiencies) |
| Low Magnesium | None | Daily Stack (Mg hero) | Kit 1 cross-sell (if 40+ or 2+ deficiencies) |
| Elevated hs-CRP | Ask joint symptoms | Collagen (if joint: Yes) | Lifestyle guidance (if joint: No) |
| hs-CRP > 10 mg/L | None | GP referral — no supplement CTA | — |
| Low Ferritin < 30 µg/L | None | GP referral + dietary guidance | — |
| Low B12 (Kit 3) | None | Daily Stack (B12 hero) | — |
| 2+ deficiencies | None | Complete Men's Stack (£54.95/mo) | Individual products as fallback |

---

## How to Work Here

### Adding or editing a page
1. Pick the route group: `(marketing)` (public/SEO), `lp` (noindex direct-response), `(app)` (auth), or `auth`. Don't blur them (Guardrail 5).
2. Public pages: unique bare `<title>` (template `%s | Andro Prime` adds the suffix — don't double it) + `<meta description>`. Kit/supplement pages: price above the fold; trust signals "UKAS ISO 15189 Accredited Lab" + "No GP needed".
3. One primary CTA per page. No stock photography. In-article/product CTAs link to indexable `/kits/*` + `/supplements/*`, never `/lp/*`.
4. Run the compliance checklist before saving copy. Lowercase kebab-case files.

### Adding or editing backend logic (`app/api/`)
1. Read `docs/implementation-plan.md` for phase dependencies first.
2. Stripe webhooks → `app/api/webhooks/stripe/`. Customer.io events → `lib/customerio/emit.ts`.
3. DB access via `lib/supabase/*`. Never write result data outside EU (Frankfurt).
4. Vitall result webhooks: receive at `app/api/webhooks/vitall/`, enqueue on QStash, process in `app/api/jobs/process-result/`. The lab does not retry failed webhooks — silent failure = lost result.
5. Run `next build` (not just `tsc`) before pushing — Coolify deploys via `next build`, which enforces route-export rules tsc ignores.

### Adding or editing a blog article
Source is `content/blog/*.mdx`. Use the `/article` skill to draft from an approved brief and `/publish-article` to ship a slot. Ewa sign-off is mandatory before `status: published`. Run `node scripts/audit-keyword-coverage.js` from `frontend/`.

### Adding or editing email copy
Email templates have their own context: read `frontend/email-templates/CONTEXT.md`. Customer.io build specs + sequence triggers: `automations/customerio/sequences.md`.

### Modifying results dashboard CTA logic
1. Check `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8 first.
2. Never add a supplement CTA to hs-CRP > 10 mg/L or Low Ferritin < 30 µg/L.
3. Founding-member CTA only on confirmed T < 12 nmol/L — never inferred from energy markers.
4. Always implement the five-part structure; never lead with Convert.

---

## Compliance Checklist

Run before saving any frontend copy, results-dashboard logic, or backend copy strings:

- [ ] No "diagnose," "diagnosis," "treat," "treatment," "cure"
- [ ] No claim that TRT is currently available on any wellness page
- [ ] Supplement copy uses EFSA-approved health claims only (see root `CLAUDE.md`)
- [ ] Results copy uses "Your results indicate..." not "You have..."
- [ ] No supplement CTA for hs-CRP > 10 mg/L or Low Ferritin < 30 µg/L
- [ ] Founding-member CTA only when T < 12 nmol/L is confirmed
- [ ] Kit 1 copy scoped to testosterone only
- [ ] Authenticated app routes excluded from session recording
- [ ] Supabase region is EU (Frankfurt) for all biomarker writes
- [ ] No ashwagandha mentions anywhere (silent ingredient — see root `CLAUDE.md`)
- [ ] No em dashes in customer-facing copy (AI tell — see tone-of-voice §3)

---

## Technical Stack Reference

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 (React 19, App Router) | `output: "standalone"`. SSR for public pages; client components where interactivity requires. |
| Hosting | Coolify (VPS) | Docker (`frontend/Dockerfile`) from GitHub. Cloudflare DNS/proxy (www → 301 → apex; http → 301 → https). |
| Database | Supabase (Postgres) | **EU (Frankfurt) only.** DPA signed before first result stored. Clients in `lib/supabase/`. |
| Payments | Stripe | One-off kits + subscriptions + webhooks. One Stripe Coupon per PT partner (PT programme currently FROZEN). |
| Email / CRM | Customer.io | EU datacenter, workspace 219186, event-triggered. NOT Klaviyo. |
| Affiliate | FirstPromoter | Live (v2 API). PT/affiliate commission structure FROZEN 2026-06-07. |
| Error monitoring | Sentry | Wired via `instrumentation*.ts` + `next.config.ts`. |
| Webhook queue | Upstash QStash | Enqueue Vitall jobs immediately; `lib/qstash/verify.ts` verifies signatures. |
| Web analytics | GA4 | Live (`G-D5M4J5M3F6`) — server-side mirror + consent banner + client gtag. `lib/analytics/`. |
| Fonts | Inter · Merriweather · JetBrains Mono | Via `next/font`. |

---

## Special Cases

- **Supabase DPA:** signed before the first biomarker result is stored. Don't activate the results pipeline without it.
- **Session-recording exclusion:** authenticated app routes (`/results-dashboard`, `/account`, etc.) must be excluded at the tool's project level, not just suppressed in code. Verify at QA.
- **Lab webhook reliability (Vitall):** the lab does not retry failed webhooks. QStash must be live before the results pipeline activates. Silent failure = lost result, no recovery path.
- **seq-04 Day-75 retest:** needs a `SUBSCRIBER10` Stripe coupon (10% off, 14 days) to exist before the email activates.
- **seq-05 pause option:** references Stripe subscription pause — confirm it's live in the portal before activating churn-prevention.

---

## Platform Notes

- Aesthetic: light editorial; white backgrounds, black type, no border-radius, no gradients. Blog has its own scoped `.blog-skin` editorial category (cream bg, charcoal block-shadows) — see brand guidelines + blog-skin memory.
- Mobile-first throughout.
- This workspace does not own: strategy (`/01_strategy`), compliance approval as a primary task (`/03_compliance`), product threshold logic unless translating approved rules into code (`/04_products`), content strategy detached from the site (`/06_marketing`).
