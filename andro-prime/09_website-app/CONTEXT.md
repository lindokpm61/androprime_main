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

Blog content lives in the **Supabase `blog_articles` table** (DB is the source of truth as of the Phase-1 content-engine decoupling, migration `20260619_blog_articles_db_backed.sql`). `lib/blog.ts` reads it (anon + published-only RLS for the public path; service-role for drafts/preview), rendered by `app/(marketing)/blog/[slug]/page.tsx` via `next-mdx-remote/rsc`. Visibility is the `status` column (`draft|published|archived`); publishing/editing/takedown is a DB write surfaced by **on-demand revalidation** (`app/api/revalidate` → `revalidateTag('blog'|'article:<slug>')`, 1h ISR backstop) — **no Coolify redeploy**. `frontend/content/blog/*.mdx` is now a **backup mirror + import source**, not the live source: authoring still uses `/article` + `/publish-article` on MDX files, then `scripts/import-blog-to-db.ts` bridges file → DB (Phase 2 will move authoring directly onto the DB write path `upsert_blog_article()`). See `06_marketing/seo-ai-search/` + the SEO memory notes for the content engine.

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

**The full result → CTA matrix is NOT duplicated here** (a parallel copy drifted and is retired). The single source of truth is the **Results-Engine Trigger Rules table in `../04_products/CONTEXT.md`** (with separate Phase 0a / 0b columns), backed by `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8. Read it before changing any routing. The code that implements it is `lib/results/classifier.ts` (`resolveCta`).

Engineering invariants the code must preserve (these don't change phase to phase):

- **Low testosterone (T < 12) → GP referral, no upsell.** Split into three sub-bands in `classifier.ts` (severely-low <5.2 → endocrinology flag; low 5.2–8; equivocal 8–12), all GP-routed. This is the **current** routing (Ewa CA-013/014, deployed 2026-06-07) — it replaced the old founding-member-list routing, which is taken down. A consent-gated nurture opt-in sits alongside (see `STATE.md`).
- **GP hard-blocks (no supplement/waitlist CTA):** hs-CRP > 10 mg/L, Low Ferritin < 30 µg/L. Never cross-sell off a clinical-signal result.
- **hs-CRP elevated (1–10) requires the joint-symptoms qualifier** ("Do you experience joint stiffness or soreness after training?", `app/api/results/qualifier/`) to fire BEFORE any Collagen CTA.
- **Phase 0a routes supplement CTAs to the supplement waitlist**, not direct Daily Stack/Collagen (supplement Stripe prices are unset until 0b). The Daily Stack no longer contains Magnesium (V7.2 reformulation) — no "Mg hero" CTA exists.
- Five-part structure always: **Result → Explain → Educate → Recommend → Convert.** Never lead with Convert.

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
5. Run `next build` (not just `tsc`) before pushing — Coolify deploys via `next build`, which enforces route-export rules `tsc` ignores (a `route.ts` may export ONLY HTTP handlers + segment config — a stray `export const FOO` fails the build but passes `tsc`; move it to `lib/`).
6. **E2E against the DEPLOYED route before calling it done — `tsc` + fixtures ≠ works in prod.** For any customer-facing pipeline: POST the deployed `andro-prime.com` route, confirm the DB row (prod Supabase), verify the CIO customer (`GET /v1/environments/219186/customers/{id}` — single-get is reliable; list-by-email is flaky) + segment count, and for emails watch the inbox. Repeated real bugs (broken CIO API paths, guest-FK 500s, the `{% unsubscribe_url %}` Liquid-tag drop) passed every typecheck and only surfaced on a real send. Budget this loop into the estimate.

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

## Integration Access & Gotchas (durable)

Non-obvious mechanics that cost real time or money to rediscover. **Live status + dated verification lives in `STATE.md`.**

**Deploy (Coolify).** Auto-deploy needs the **GitHub repo webhook registered** (Coolify app → Webhooks tab → register the URL + secret in GitHub → Settings → Webhooks, content-type `application/json`, push event). "Auto Deploy ON" in Coolify does nothing without it — pushes silently show "Manual" and the live site lags. If deploys look stuck, check that webhook's Recent Deliveries in GitHub first.

**Edge cache (Cloudflare).** andro-prime.com is Cloudflare → Caddy → Coolify. Cloudflare can serve stale HTML for a few minutes after a deploy even with origin `no-cache`. Verify live state with a cache-buster (`?_cb=<rand>`) or a dynamic route — "successful deploy + old-looking site" is usually edge cache, not a failed build.

**Auth (passwordless magic link).** Uses **token_hash + `verifyOtp`**, NOT PKCE `code` + `exchangeCodeForSession` (PKCE loses the verifier across the email round-trip → cross-browser "verifier not found"). Supabase email templates must link to `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=...` (Magic Link → `type=magiclink`; Confirm signup → `type=signup`). `/auth/callback` handles both token_hash and `code` (the latter only for Google OAuth). Microsoft/Azure OAuth is hidden in `OAuthButtons.tsx` until the Azure app registration is done — when it is, set **Supported account types = "Accounts in any organizational directory and personal Microsoft accounts"** (it defaults to single-tenant/corporate-only, which blocks the Outlook/Hotmail/Live accounts consumers use, and it can't easily be changed after the app is created). Auth emails send via **Resend** custom SMTP on the isolated `send.andro-prime.com` subdomain (Google Workspace mail on the root is untouched).

**Stripe access from this repo.** Local `.env.local` key is TEST mode and IP-allowlisted (Stripe API curls fail even from Keith's machine). No Stripe CLI, no in-repo Stripe MCP; live keys live only in Coolify. The claude.ai Stripe MCP connects to **LIVE** but **cannot read unpaid checkout sessions**. To prove which price an env var points at: archive the suspect price, POST the live checkout — `cs_live` success = env points elsewhere; "price inactive" error = env still points at it (fully reversible). If Keith pastes a live `sk_live` key for a one-shot, **rotate it after** (roll in Dashboard → update Coolify → redeploy).

**Stripe test↔live isolation.** Fully isolated: separate keys, data, object IDs, webhook endpoints, Dashboard settings. **Webhook endpoints are per-mode and must be created in live separately** — a verified sending domain + live keys do NOT imply a live endpoint exists. (A live payment with only a test-mode endpoint charges the card but fires no webhook → no order created → nothing dispatched.) Products/prices copy one-at-a-time via the Dashboard "Copy to live mode" button; coupons, webhook endpoints, and Billing/dunning do **not** copy — recreate in live. `cs_test_` vs `cs_live_` prefix is the cleanest mode indicator.

**Dunning is Dashboard-only.** Stripe Smart Retries + failed-payment emails are account-level Dashboard settings, not in the public API. Decision (Stripe-native retries vs CIO T-07 emails; mutually exclusive) deferred to Phase 0b — see `STATE.md`.

**Vitall kit mapping** (authoritative — `app/api/vitall/dispatch` `KIT_TEST_CODES` + `lib/results/normaliser.ts` exact, case-sensitive match):

| Kit | shortCode | Biomarkers (Vitall `GET /tests`, 2026-06-22) |
| --- | --- | --- |
| Kit 1 `testosterone` | `andro-prime-hormone-check` | Free Androgen Index, Free Testosterone, Sex Hormone Binding Globulin, Testosterone |
| Kit 2 `energy-recovery` | `andro-prime-energy-metabolism` | Vitamin D, C-reactive Protein, Vitamin B12 (Active) |
| Kit 3 `hormone-recovery` | `andro-prime-combo-test` | union of the above (7) |

Re-pull with `scripts/e2e/dump-vitall-tests.ts`. `/tests` returns names only, no units; live units for Vit D / CRP / B12 (Active) still unconfirmed. Albumin/Ferritin are in `NAME_MAP` but in none of the 3 kits (dead entries).

---

## Special Cases

- **Supabase DPA:** signed before the first biomarker result is stored. Don't activate the results pipeline without it.
- **Session-recording exclusion:** authenticated app routes (`/results-dashboard`, `/account`, etc.) must be excluded at the tool's project level, not just suppressed in code. Verify at QA.
- **Lab webhook reliability (Vitall):** the lab does not retry failed webhooks. QStash must be live before the results pipeline activates. Silent failure = lost result, no recovery path.
- **Vitall `order-cancelled` webhook:** handled out-of-band (like `sample-issue`/`data-purged`), NOT via the silent STATUS_MAP path — sets `kit_orders.status='cancelled'` then calls `emitOpsAlert()` → internal ops profile (`OPS_ALERT_EMAIL`, default `keith@andro-prime.com`) + `lab_order_cancelled` CIO event. **It NEVER auto-refunds** — cancel and refund are decoupled; refund stays a deliberate manual Stripe action at Phase-0 volume. (T&Cs still lack a lab-cancellation clause — open.)
- **`.glass-panel` overrides `bg-*`:** the `.glass-panel` utility (`styles/base/globals.css`, `@layer utilities`) hard-applies `bg-white`. Tailwind layer ordering emits it AFTER `bg-black`/`bg-gray-*`, so at equal specificity glass-panel's white wins and silently overrides whatever background you set (text sits on the wrong colour). **For any non-white panel, do NOT use `glass-panel`** — inline `border-2 border-black` instead (`rounded-none`/`shadow-none` are global resets). Anywhere `glass-panel` + a `bg-*` coexist is presumed broken.
- **Deprecated `/activate` flow:** the login-gated per-order kit-QR flow is deprecated (Vitall pre-links the sample to the customer at dispatch; auth is already passwordless). Replacement (not built) = one generic no-login "how to take your sample" page (video + steps) behind a **generic QR that goes on the kit insert, not the sleeve**. Dead: `sample_registrations` table + `kit_orders.kit_activated_at` (internal metric only). Decision: `docs/2026-06-12-activate-qr-deprecation.md`.
- **seq-04 Day-75 retest:** needs a `SUBSCRIBER10` Stripe coupon (10% off, 14 days) to exist before the email activates.
- **seq-05 pause option:** references Stripe subscription pause — confirm it's live in the portal before activating churn-prevention.

---

## Platform Notes

- Aesthetic: light editorial; white backgrounds, black type, no border-radius, no gradients. Blog has its own scoped `.blog-skin` editorial category (cream bg, charcoal block-shadows) — see brand guidelines + blog-skin memory.
- Mobile-first throughout.
- This workspace does not own: strategy (`/01_strategy`), compliance approval as a primary task (`/03_compliance`), product threshold logic unless translating approved rules into code (`/04_products`), content strategy detached from the site (`/06_marketing`).
