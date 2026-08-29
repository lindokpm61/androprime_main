# Website / App: Context

**Stack:** Next.js 15 (App Router, React 19) · Supabase (Ireland) · Stripe · Customer.io · Upstash QStash · Coolify (VPS) · Cloudflare
**Owner workspace:** `09_website-app`
**Live app root:** `frontend/` (this is the real Next.js project: `package.json`, `next.config.ts`, `middleware.ts`, `app/`)
**Integration:** Customer.io events via `frontend/lib/customerio/emit.ts`. DB access via the Supabase clients in `frontend/lib/supabase/`. Stripe webhooks at `app/api/webhooks/stripe/`. Vitall result webhooks land at `app/api/webhooks/vitall/`, are enqueued on Upstash QStash, then processed by `app/api/jobs/process-result/`.

This workspace governs the full technical implementation: frontend, backend (API routes), database, automations, and deployment. Read `../CLAUDE.md` before any work here. Two non-negotiable constraints run across everything: Supabase must use the Ireland region (biomarker data is special-category health data under UK GDPR), and the authenticated app routes (`/results-dashboard` etc.) must never be captured by session-recording tools.

---

## Architecture (current: single Next.js App Router app)

The site is **one Next.js application** under `frontend/`, not separate static-HTML zones. Pages are organised with **route groups** inside `frontend/app/`:

- `app/(marketing)/*`: public, SEO-indexed pages (served at root URLs, e.g. `/kits/testosterone`).
- `app/(app)/*`: authenticated experience (dashboard, account, subscriptions). Guarded by `middleware.ts`.
- `app/auth/*`: passwordless auth flows (login/signup/link/consent + callback/logout/post-checkout route handlers).
- `app/lp/*`: direct-response landing pages. `noindex` per-page (`robots: { index: false }`) and disallowed in `app/robots.ts`.
- `app/api/*`: all backend route handlers (webhooks, checkout, forms, jobs, OG images).
- `app/activate/*`: **deprecated 2026-06-12** (login-gated per-order activation scrapped; auth is already passwordless via `/auth/post-checkout`). Still present, slated for removal.
- `app/admin/dashboard/`: internal admin metrics.

Blog content lives in the **Supabase `blog_articles` table** (DB is the source of truth as of the Phase-1 content-engine decoupling, migration `20260619_blog_articles_db_backed.sql`). `lib/blog.ts` reads it (anon + published-only RLS for the public path; service-role for drafts/preview), rendered by `app/(marketing)/blog/[slug]/page.tsx` via `next-mdx-remote/rsc`. Visibility is the `status` column (`draft|published|archived`); publishing/editing/takedown is a DB write surfaced by **on-demand revalidation** (`app/api/revalidate` → `revalidateTag('blog'|'article:<slug>')`, 1h ISR backstop), **no Coolify redeploy**. `frontend/content/blog/*.mdx` is now a **backup mirror + import source**, not the live source: authoring still uses `/article` + `/publish-article` on MDX files, then `scripts/import-blog-to-db.ts` bridges file → DB (Phase 2 will move authoring directly onto the DB write path `upsert_blog_article()`). See `06_marketing/seo-ai-search/` + the SEO memory notes for the content engine.

### `frontend/canonical-site/`: LIVE source (do NOT delete)

`frontend/canonical-site/` now holds only `terms/` and `privacy/`, and it is the **live-served source** for the `/terms` and `/privacy` pages. `app/(marketing)/terms/page.tsx` and `app/(marketing)/privacy/page.tsx` read `canonical-site/{terms,privacy}/index.html` at runtime (`readFile(...)` at line 12 of each), extract the body, and render it. It is also the sync target for the T&C/privacy bundle-terms updates tracked in `STATE.md`. Deleting it breaks both live pages.

### Dead cruft (NOT served, safe to delete, flagged not removed)

These are leftovers from the old model and are not wired into the build:

- `backend/` (top-level): legacy placeholder dir; now holds only its own `CONTEXT.md` (plus empty `api/jobs/middleware/services/webhooks/` stubs). All real API code is in `frontend/app/api/`.
- `frontend/app/account/`, `app/results-dashboard/`, `app/subscriptions/`, `app/founding-member-status/`: **empty** leftover dirs; the real routes live under `app/(app)/`.

(`frontend/lp/`, the old static LP tree, was removed in the "delete dead static trees" commit; the live LPs are `app/lp/`.)

Ask before deleting; these are worth a deliberate cleanup commit.

---

## Directory Structure

```text
09_website-app/
├── frontend/                 ← LIVE Next.js app
│   ├── app/
│   │   ├── (marketing)/      ← public SEO pages + blog
│   │   ├── (app)/            ← auth-protected app (dashboard/account/subs/supp-waitlist status)
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
│   ├── scripts/              ← audit-keyword-coverage.js, seed-result.ts, test-classifier-regressions.ts, sync-supabase-migrations.ps1, unsplash.mjs, import-blog-to-db.ts, export-blog-from-db.ts; content-engine/, ops/; e2e/ (e2e-vitall-local.ts, test-vitall-webhook.ts, place-vitall-test-orders.ts)
│   ├── public/ · styles/ · assets/ · types/
│   ├── next.config.ts · middleware.ts · tailwind.config.ts · Dockerfile
│   ├── canonical-site/       ← LIVE source for /terms + /privacy (see above; NOT cruft)
├── backend/                  ← legacy placeholder; holds only its own CONTEXT.md (code is in frontend/app/api/)
├── database/                 ← migrations / schema / seeds / views — THE canonical source
│   ├── migrations/           ← the ordered LOG. Add every schema change here, nowhere else.
│   └── schema/               ← the SNAPSHOT: baseline-2026-08-14.sql rebuilds an empty DB
├── supabase/                 ← Supabase CLI config only. `supabase/migrations/` is a GITIGNORED
│                               build artifact, regenerated from database/migrations/ by
│                               frontend/scripts/sync-supabase-migrations.ps1. Never edit it.
├── automations/              ← customerio/sequences.md, n8n workflow specs
├── deployment/               ← Coolify, env, analytics, monitoring notes
├── docs/                     ← implementation-plan.md + arch/spec docs (read before a new phase)
├── design/ · qa/
└── CONTEXT.md
```

The sequenced build plan lives in `docs/implementation-plan.md` (plus `phase5/6/7-implementation-plan.md`). Integration specs: `docs/vitall-integration-spec.md`. (`docs/thriva-integration-spec.md` is historic: Thriva/Forth ruled out, Vitall confirmed.)

---

## Route Map (URL → file)

### Public: `app/(marketing)/`
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

### Authenticated: `app/(app)/` (protected by `middleware.ts`)
| URL | File | Protected? |
|---|---|---|
| `/results-dashboard` | `(app)/results-dashboard/page.tsx` | yes |
| `/results-dashboard/handoff` | `(app)/results-dashboard/handoff/page.tsx` (GP handoff, LIVE 2026-07-19) | yes |
| `/account` | `(app)/account/page.tsx` | yes |
| `/subscriptions` | `(app)/subscriptions/page.tsx` | yes |
| `/membership` | `(app)/membership/page.tsx`: ONE route, THREE top-level states (member / not a member inside the 30-day offer window / not a member outside it). Behind `MEMBERSHIP_ENABLED`, `notFound()` when off. | yes |
| `/founding-member-status` | `(app)/founding-member-status/page.tsx`: **RETIRED 2026-07-22**, now just `redirect('/account')` (FM programme closed) | yes |
| `/supplement-waitlist-status` | `(app)/supplement-waitlist-status/page.tsx` | yes |

\*Middleware `matcher` now covers all five authed routes: `/results-dashboard`, `/subscriptions`, `/account`, `/founding-member-status`, `/supplement-waitlist-status`. (The page also self-guards via `getCurrentUser()` → `return null`, so gating is defence-in-depth + a consistent login redirect rather than a data-leak fix.)

### Auth: `app/auth/`
`/auth/login`, `/auth/signup`, `/auth/reset`, `/auth/link`, `/auth/consent` (pages); `/auth/callback`, `/auth/logout`, `/auth/post-checkout` (route handlers).

### Landing pages: `app/lp/` (noindex)
`/lp/testosterone`, `/lp/energy-recovery`, `/lp/hormone-recovery`, `/lp/daily-stack`, `/lp/collagen`. `/lp/foundations` → 301 → `/lp/hormone-recovery` (in `next.config.ts`).

### API: `app/api/`
- **Webhooks:** `webhooks/stripe`, `webhooks/vitall`
- **Jobs:** `jobs/process-result` (QStash consumer), `jobs/bundle-sweep` (bundle dispatch sweep, dark behind flag)
- **Checkout:** `checkout/kit`, `checkout/subscription`, `checkout/portal`
- **Forms:** `forms/contact`, `forms/newsletter`, `forms/test-selector`, `forms/waitlist`
- **Lists/results:** `founding-member/join` (**returns 410 Gone, retired 2026-06-04**), `supplement-waitlist/join`, `results/qualifier`, `lowt-nurture/consent`, `borderline-nurture/consent`
- **Membership (behind `MEMBERSHIP_ENABLED`, 404 when off):** `membership/checkin` (one tap of the between-tests loop; writes `symptom_answers` with `context='checkin'` and no `order_id`)
- **Account (GDPR, LIVE 2026-07-19):** `account/export` (data export), `account/erasure-request`
- **Lab:** `vitall/dispatch`
- **Analytics/OG:** `events`, `og/blog/[slug]` (`?variant=card|social`)
- **Content/ISR:** `revalidate` (on-demand `revalidateTag('blog'|'article:<slug>')`, the DB-write publish path, no redeploy)
- **Dev/deprecated:** `dev/seed-result`, `activate`

---

## lib/ Map

| Path | Purpose |
|---|---|
| `lib/supabase/{client,server,admin,middleware,env,types}.ts` | DB access layer. `client` = browser/SSR-safe; `server`/`admin` = privileged. EU region only. |
| `lib/customerio/emit.ts` | Emit events to Customer.io (checkout, signup, result, subscription). Critical integration. |
| `lib/results/` | **Results engine.** `classifier.ts` (low/normal/elevated), `normaliser.ts`, `processResult.ts` (parse Vitall payload → classify → emit), `buildDashboardFromScenario.ts` + `getDashboardData.ts` (5-part sections), `biomarker-copy.ts` (Ewa-approved strings), `lowtNurtureConsent.ts` + `borderlineNurtureConsent.ts` (version-locked consent for the low-T and borderline-T 12–15 nurture opt-ins), `healthProcessingConsent.ts` (CA-018 health-data processing consent gate), `maintenanceOfferCopy.ts`, `seed.ts`, `types.ts`, `fixtures/`. |
| `lib/blog.ts` | MDX frontmatter parse + `isVisible()` status gate + YAML date-as-Date guard. |
| `lib/authors.ts` | Author/Person schema (Ewa credentials). |
| `lib/analytics/{ga4,events,consent,page-attribution}.ts` | GA4 (live, `G-D5M4J5M3F6`), event tracking, consent state, UTM attribution. |
| `lib/auth/{actions,session,isAdmin}.ts` | Passwordless auth, session checks, admin gate. |
| `lib/stripe/client.ts`, `lib/pricing.ts` | Stripe SDK + product/SKU metadata. |
| `lib/qstash/verify.ts` | Verify QStash signatures on the result job. |
| `lib/vitall/{client,types}.ts` | Vitall API client + payload types. |
| `lib/bundles/{config,checkout,confirmation,sweep,dispatch}.ts` | **Two-kit bundle feature** (dark behind `BUNDLES_ENABLED`): config, checkout session, confirmation, dispatch sweep. |
| `lib/membership/offer.ts` | **When a membership may be JOINED**: only while a lab result has come back within the last 30 days (`01_strategy/2026-08-26-membership-offer-window.md`). One predicate covering four cases; it gates joining, never staying. Enforced in the subscription checkout route, rendered by the page, both reading `latestResult.ts` so the gate and the screen cannot disagree. |
| `lib/membership/` | **Membership v1** (dark behind `MEMBERSHIP_ENABLED`). `entitlement.ts`, `checkin.ts` and `pricingRules.ts` are PURE (no db, no env, no clock), so the rules that decide whether a kit is posted, what a member is charged and what his streak says are drivable from a test table; `sync.ts`, `getMembershipView.ts` and `memberPricing.ts` are the impure halves that fetch. The retest is an entitlement conditional on being an active member ON the stated date, never a credit: no ledger, no expiry, no liability. |
| `lib/results/resultSeverity.ts` | Which result states mean something needs attention, as ONE exhaustive `Record<ResultState, ...>`. Moved out of `components/results-engine/StatusBadge.tsx` (2026-08-26) when the membership screen needed the same answer; the badge still renders from it, so the result card and the membership screen cannot disagree about whether a man has a problem. |
| `lib/flags.ts` | Feature flags (`BUNDLES_ENABLED`, `RETEST_REMINDER_ENABLED`, etc.). |
| `lib/content/kitCTA.ts` | Pillar → CTA routing for kit/content pages. |
| `lib/kits/names.ts` | Kit slug ↔ display-name mapping. |
| `lib/kits/panel.ts` | **WHICH MARKERS EACH KIT MEASURES, and the customer-facing copy for each.** The single source of truth for every surface that lists a panel: `/`, `/kits`, `/how-it-works`, `/faq`, the test-selector quiz and the pre-results dashboard card all render from it. Added 2026-08-29 after the list, hand-written on six surfaces, had drifted on four: `/how-it-works` said three markers for Kit 1, `/faq`'s table said seven and committed to "the seven", the quiz said three and the dashboard said **two**, all while the commerce pages said five and nine. FAI and Albumin were the two missing everywhere. The panel itself is owned by `../04_products/kits/kit-1-testosterone-health-check.md` and `kit-3-hormone-recovery-check.md`; do not change a marker set here without changing it there. **The FAI copy is constrained by a clinical ruling** (report-only, not banded in men: `../04_products/results-engine/thresholds.md` item 8, re-sourced 2026-07-30), so it must not be reworded into a stand-in for free testosterone. `scripts/test-quiz-routing.ts` asserts the Kit 1 and Kit 2 marker sentences. |
| `lib/orders/{orderRef,getOrderRefForCheckoutSession}.ts` | Customer-facing order reference. `orderRef` renders `AP-{kit_orders.order_seq}` and parses one back for support lookup (the `AP-` prefix lives in code, not the DB, so it can change without a migration); `getOrderRefForCheckoutSession` resolves the reference for a Stripe Checkout session, retrying past the webhook-insert race. |
| `lib/site-url.ts` | `SITE_URL` + `siteUrl(path)`: the single definition of the public origin. Import it instead of restating `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'`. The two request-aware resolvers (`app/auth/callback`, `lib/auth/actions`) use it only as their fallback, by design. |
| `lib/date/age.ts` · `lib/slug.ts` | Age-from-DOB helper; slugify helper. |
| `lib/{account,admin,dashboard,founding-member,subscriptions,supplement-waitlist,activate,kits}/` | Per-feature data fetchers. |

---

## Results Dashboard: Conditional Logic

Lives at `/results-dashboard` (`app/(app)/results-dashboard/`), built from `lib/results/`. Never show a generic "buy supplements" CTA; match the CTA to the specific result.

Sections follow **Result → Explain → Educate → Recommend → Convert.** Never lead with a product CTA.

**The full result → CTA matrix is NOT duplicated here** (a parallel copy drifted and is retired). The single source of truth is the **Results-Engine Trigger Rules table in `../04_products/CONTEXT.md`** (with separate Phase 0a / 0b columns), backed by `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8. Read it before changing any routing. The code that implements it is `lib/results/classifier.ts` (`resolveCta`).

Engineering invariants the code must preserve (these don't change phase to phase):

- **Low testosterone (T < 12) → GP referral, no upsell.** Split into three sub-bands in `classifier.ts` (severely-low <5.2 → endocrinology flag; low 5.2–8; equivocal 8–12), all GP-routed. This is the **current** routing (Ewa CA-013/014, deployed 2026-06-07); it replaced the old founding-member-list routing, which is taken down. A consent-gated nurture opt-in sits alongside (see `STATE.md`).
- **Borderline testosterone (T 12–15) → supplement waitlist + optional consent-gated nurture (seq-03d).** Parallel to the low-T nurture: a version-locked consent opt-in (`lib/results/borderlineNurtureConsent.ts`, `components/results-engine/BorderlineNurtureConsent.tsx`, `app/api/borderline-nurture/consent`, table `borderline_nurture_consent`, migration `20260626`) gates the seq-03d nurture trigger. The card stays `normal-testosterone` (not a clinical reclassification); this is **not** a GP block.
- **GP hard-blocks (no supplement/waitlist CTA):** hs-CRP > 10 mg/L, Low Ferritin < 30 µg/L. Never cross-sell off a clinical-signal result.
- **hs-CRP elevated (1–10) requires the joint-symptoms qualifier** ("Do you experience joint stiffness or soreness after training?", `app/api/results/qualifier/`) to fire BEFORE any Collagen CTA.
- **Phase 0a routes supplement CTAs to the supplement waitlist**, not direct Daily Stack/Collagen (supplement Stripe prices are unset until 0b). The Daily Stack no longer contains Magnesium (V7.2 reformulation); no "Mg hero" CTA exists.
- Five-part structure always: **Result → Explain → Educate → Recommend → Convert.** Never lead with Convert.

---

## How to Work Here

**Third-party library docs: use Context7.** For version-current API docs on our external deps (Next.js 15 / React 19, `@supabase/ssr`, Stripe SDK, `@upstash/qstash`, `next-mdx-remote`), query the **Context7 MCP** (`resolve-library-id` → `get-library-docs`) rather than relying on training data, which skews to older versions. Keep **graphify** for *our own* code (see root `CLAUDE.md`); Context7 is for *their* code. This applies to `09_website-app` only; no other workspace has third-party code.

### Adding or editing a page
1. Pick the route group: `(marketing)` (public/SEO), `lp` (noindex direct-response), `(app)` (auth), or `auth`. Don't blur them (Guardrail 5).
2. Public pages: unique bare `<title>` (template `%s | Andro Prime` adds the suffix, don't double it) + `<meta description>`. Kit/supplement pages: price above the fold; trust signals "UKAS ISO 15189 Accredited Lab" + "No GP needed".
3. One primary CTA per page. No stock photography. In-article/product CTAs link to indexable `/kits/*` + `/supplements/*`, never `/lp/*`.
4. Run the compliance checklist before saving copy. Lowercase kebab-case files.

### Adding or editing backend logic (`app/api/`)
1. Read `docs/implementation-plan.md` for phase dependencies first.
2. Stripe webhooks → `app/api/webhooks/stripe/`. Customer.io events → `lib/customerio/emit.ts`.
3. DB access via `lib/supabase/*`. Never write result data outside the Ireland region.
4. Vitall result webhooks: receive at `app/api/webhooks/vitall/`, enqueue on QStash, process in `app/api/jobs/process-result/`. The lab does not retry failed webhooks; silent failure = lost result.
5. Run `next build` (not just `tsc`) before pushing: Coolify deploys via `next build`, which enforces route-export rules `tsc` ignores (a `route.ts` may export ONLY HTTP handlers + segment config: a stray `export const FOO` fails the build but passes `tsc`; move it to `lib/`).
6. **E2E against the DEPLOYED route before calling it done: `tsc` + fixtures ≠ works in prod.** For any customer-facing pipeline: POST the deployed `andro-prime.com` route, confirm the DB row (prod Supabase), verify the CIO customer (`GET /v1/environments/219186/customers/{id}`: single-get is reliable; list-by-email is flaky) + segment count, and for emails watch the inbox. Repeated real bugs (broken CIO API paths, guest-FK 500s, the `{% unsubscribe_url %}` Liquid-tag drop) passed every typecheck and only surfaced on a real send. Budget this loop into the estimate.

### Adding or editing a blog article
Source is `content/blog/*.mdx`. Use the `/article` skill to draft from an approved brief and `/publish-article` to ship a slot. Ewa sign-off is mandatory before `status: published`. Run `node scripts/audit-keyword-coverage.js` from `frontend/`.

### Adding or editing email copy
Email templates have their own context: read `frontend/email-templates/CONTEXT.md`. Customer.io build specs + sequence triggers: `automations/customerio/sequences.md`.

### Modifying results dashboard CTA logic
1. Check `../04_products/icp-kit-supplement-alignment-april2026.md` Section 8 first.
2. Never add a supplement CTA to hs-CRP > 10 mg/L or Low Ferritin < 30 µg/L.
3. Low T (< 12 nmol/L, confirmed on Kit 1/Kit 3, never inferred from energy markers) → GP referral, no upsell. The founding-member CTA is retired. See the low-T invariant above.
4. Always implement the five-part structure; never lead with Convert.

---

## Compliance Checklist

Run before saving any frontend copy, results-dashboard logic, or backend copy strings:

- [ ] No "diagnose," "diagnosis," "treat," "treatment," "cure"
- [ ] No claim that TRT is currently available on any wellness page
- [ ] Supplement copy uses EFSA-approved health claims only (see root `CLAUDE.md`)
- [ ] Results copy uses "Your results indicate..." not "You have..."
- [ ] No supplement CTA for hs-CRP > 10 mg/L or Low Ferritin < 30 µg/L
- [ ] Low T (< 12 nmol/L) → GP referral, no upsell; no founding-member or supplement CTA (FM retired)
- [ ] Kit 1 copy scoped to testosterone only
- [ ] Authenticated app routes excluded from session recording
- [ ] Supabase region is Ireland for all biomarker writes
- [ ] No ashwagandha mentions anywhere (silent ingredient, see root `CLAUDE.md`)
- [ ] No em dashes in customer-facing copy (AI tell, see tone-of-voice §3)

---

## Technical Stack Reference

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 (React 19, App Router) | `output: "standalone"`. SSR for public pages; client components where interactivity requires. |
| Hosting | Coolify (VPS) | Docker (`frontend/Dockerfile`) from GitHub. Cloudflare DNS/proxy (www → 301 → apex; http → 301 → https). |
| Database | Supabase (Postgres) | **Ireland region only.** DPA incorporated via Supabase's standard terms (no separately signed DPA). Clients in `lib/supabase/`. |
| Payments | Stripe | One-off kits + subscriptions + webhooks. One Stripe Coupon per PT partner (PT programme currently FROZEN). |
| Email / CRM | Customer.io | EU datacenter, workspace 219186, event-triggered. NOT Klaviyo. |
| Affiliate | FirstPromoter | Live (v2 API). PT/affiliate commission structure FROZEN 2026-06-07. |
| Error monitoring | Sentry | Wired via `instrumentation*.ts` + `next.config.ts`. |
| Webhook queue | Upstash QStash | Enqueue Vitall jobs immediately; `lib/qstash/verify.ts` verifies signatures. |
| Web analytics | GA4 | Live (`G-D5M4J5M3F6`): server-side mirror + consent banner + client gtag. `lib/analytics/`. |
| Fonts | Inter · Merriweather · JetBrains Mono | Via `next/font`. |

---

## Integration Access & Gotchas (durable)

Non-obvious mechanics that cost real time or money to rediscover. **Live status + dated verification lives in `STATE.md`.**

**Deploy (Coolify).** Auto-deploy needs the **GitHub repo webhook registered** (Coolify app → Webhooks tab → register the URL + secret in GitHub → Settings → Webhooks, content-type `application/json`, push event). "Auto Deploy ON" in Coolify does nothing without it; pushes silently show "Manual" and the live site lags. If deploys look stuck, check that webhook's Recent Deliveries in GitHub first.

**Edge cache (Cloudflare).** andro-prime.com is Cloudflare → Caddy → Coolify. Cloudflare can serve stale HTML for a few minutes after a deploy even with origin `no-cache`. Verify live state with a cache-buster (`?_cb=<rand>`) or a dynamic route: "successful deploy + old-looking site" is usually edge cache, not a failed build.

**Auth (passwordless magic link).** Uses **token_hash + `verifyOtp`**, NOT PKCE `code` + `exchangeCodeForSession` (PKCE loses the verifier across the email round-trip → cross-browser "verifier not found"). Supabase email templates must link to `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=...` (Magic Link → `type=magiclink`; Confirm signup → `type=signup`). `/auth/callback` handles both token_hash and `code` (the latter only for Google OAuth). Microsoft/Azure OAuth is hidden in `OAuthButtons.tsx` until the Azure app registration is done; when it is, set **Supported account types = "Accounts in any organizational directory and personal Microsoft accounts"** (it defaults to single-tenant/corporate-only, which blocks the Outlook/Hotmail/Live accounts consumers use, and it can't easily be changed after the app is created). Auth emails send via **Resend** custom SMTP on the isolated `send.andro-prime.com` subdomain (Google Workspace mail on the root is untouched).

**Where credentials live, and the precedence (settled 2026-08-01).** Two files, one copy of each secret, never both. **`frontend/.env.local`** holds app + Supabase credentials; the **repo-root `.env`** holds tooling credentials (Metricool, Unipile, DataForSEO, Unsplash, Attio, Brevo, FirstPromoter). Both are gitignored. The content-engine loader `_shared.loadEnvLocal()` reads `.env.local` **then** the root `.env`, never overwriting, so precedence is real env > `.env.local` > root `.env`. **Do not copy a secret into the second file to make a script see it:** that is two copies with nothing watching them, and rotating one leaves the other stale and silent. If a script cannot see a credential, fix the loader, not the storage. Symptom to recognise: a tool reporting "no credential is loaded" while the secret plainly exists — from inside the process, unreachable and absent are indistinguishable.

**Metricool holds TWO brands, and `METRICOOL_BLOG_ID` names only one of them.** `6633045` = "Keith Andro Prime" (the company brand: IG `keithandroprime`, FB `1292054467322962`, X, LinkedIn, TikTok, YouTube) and `6693691` = "Keith Antony AI" (personal: IG `keith.antony.ai`, FB `913631891838376`). The env var points at the first; the 30-day carousel run lives on the second. **Scoping is not uniform across the API, measured 2026-08-14:**

- **Brand-scoped:** `GET /v2/scheduler/posts` (the calendar list) and `GET /v2/analytics/posts/{network}`. Asking the wrong brand returns **HTTP 200 with an empty array**, which reads exactly like "nothing there". Any job that lists must query every brand, or assert a known-present item before believing a zero.
- **NOT brand-scoped:** `GET /v2/scheduler/posts/{id}` answers under either brand, which is why `metricool-writeback` resolves carousel posts with the company brand id.
- **The date parameter is spelled differently per endpoint:** the scheduler takes `start`/`end`, analytics takes `from`/`to` and answers HTTP 500 naming the missing one.

`metricool-metrics.ts` queries both brands (`METRICOOL_BLOG_IDS`, defaulting to `6633045,6693691`).

🔴 **AND THE ANALYTICS `postId` COMPOUNDS THE OPPOSITE WAY ROUND ON INSTAGRAM TO FACEBOOK. Measured
2026-08-25 against seven live rows.**

```
facebook    postId = <pageId>_<postId>      the TAIL is the post
instagram   postId = <mediaId>_<userId>     the TAIL is the ACCOUNT
```

The two networks shared one branch in `postIdFromRow`, which split on the underscore and took the
tail. On Instagram that returns the **account id, identical on every row**, so seven published
carousels each reported "has analytics but no rendition claims it" against one id while the
renditions reported "no analytics row mentions this post". `content_metrics` held zero Instagram
rows for the entire run. **Both halves of the join worked; they were keyed on different things, and
that failure is silent in both directions.** Fixed by joining Instagram through the row's `url`
permalink, the only field sharing a namespace with `external_url`. **The general rule: a compound
platform id is not a convention, it is per-network, and the half that identifies the item has to be
measured rather than inferred from a sibling network.**

⚠️ **The Instagram analytics row lags publication by hours.** A post live at 13:00 has no analytics
row at 16:00. The endpoint is not wrong and the join is not broken; the row simply does not exist
yet. Do not read a same-day `NO DATA` on Instagram as a fault.

⚠️ **`filter` arrives as an empty string and `Number('') === 0`, so it reads as a zero measurement**
unless excluded. `businessId` is an all-digit account identifier with the same problem. Both are in
`NON_METRIC_KEYS`; anything added to the row shape needs the same check, because the unmapped report
is the only thing standing between an unverified mapping and a month of silent nulls.

**Stripe access from this repo.** Local `.env.local` key is TEST mode and IP-allowlisted (Stripe API curls fail even from Keith's machine). No Stripe CLI, no in-repo Stripe MCP; live keys live only in Coolify. The claude.ai Stripe MCP connects to **LIVE** but **cannot read unpaid checkout sessions**. To prove which price an env var points at: archive the suspect price, POST the live checkout: `cs_live` success = env points elsewhere; "price inactive" error = env still points at it (fully reversible). If Keith pastes a live `sk_live` key for a one-shot, **rotate it after** (roll in Dashboard → update Coolify → redeploy).

**Stripe test↔live isolation.** Fully isolated: separate keys, data, object IDs, webhook endpoints, Dashboard settings. **Webhook endpoints are per-mode and must be created in live separately**: a verified sending domain + live keys do NOT imply a live endpoint exists. (A live payment with only a test-mode endpoint charges the card but fires no webhook → no order created → nothing dispatched.) Products/prices copy one-at-a-time via the Dashboard "Copy to live mode" button; coupons, webhook endpoints, and Billing/dunning do **not** copy; recreate in live. `cs_test_` vs `cs_live_` prefix is the cleanest mode indicator.

**Dunning is Dashboard-only.** Stripe Smart Retries + failed-payment emails are account-level Dashboard settings, not in the public API. Decision (Stripe-native retries vs CIO T-07 emails; mutually exclusive) deferred to Phase 0b; see `STATE.md`.

**Vitall kit mapping** (authoritative: `app/api/vitall/dispatch` `KIT_TEST_CODES` + `lib/results/normaliser.ts` exact, case-sensitive match):

| Kit | shortCode | Biomarkers (Vitall `GET /tests`, 2026-06-22) |
| --- | --- | --- |
| Kit 1 `testosterone` | `andro-prime-hormone-check` | Free Androgen Index, Free Testosterone, Sex Hormone Binding Globulin, Testosterone |
| Kit 2 `energy-recovery` | `andro-prime-energy-metabolism` | Vitamin D, C-reactive Protein, Vitamin B12 (Active) |
| Kit 3 `hormone-recovery` | `andro-prime-combo-test` | union of the above (7) |

Re-pull with `scripts/e2e/dump-vitall-tests.ts`. `/tests` returns names only, no units; live units for Vit D / CRP / B12 (Active) still unconfirmed. Albumin/Ferritin are in `NAME_MAP` but in none of the 3 kits (dead entries).

---

## Restoring this database somewhere that is not Supabase

**Verified 2026-08-14 by running it**, not reasoned about: `database/restore-drill.mjs` dumps
production through the session pooler, restores into a scratch Postgres and compares a census table
by table (39 checks: every table's rows, plus views, functions, triggers, policies, indexes,
RLS-enabled tables and constraints by type). It cleans up after itself. **Run it after any schema
change that matters, and read the list of ignored `pg_restore` errors rather than the count.**

🔴 **Five things do NOT travel in the dump, and without them the restore looks fine and is not:**

1. Roles **`anon`** and **`authenticated`** — `CREATE POLICY ... TO authenticated` fails outright if
   the role is absent, taking 23 of the 24 policies with it.
2. **`auth.uid()`** — referenced by the policies' USING clauses.
3. **`supabase_functions.http_request()`** — the `revalidate_webhook` trigger on `blog_articles`.
4. An **`auth.users`** table, because **13 foreign keys across `public` point at it**.
5. **The ids in it.** An empty `auth.users` means the restored rows violate `users_id_fkey`,
   pg_restore drops the constraint, and the copy comes back with referential integrity silently
   missing.

**This proves our half only.** Whether Supabase's own daily backup restores is a separate question
needing their dashboard and a separate project. Do not report one as the other.

### The recovery objective (plan step 3.1, stated 2026-08-16)

**Said out loud, because a backup with no stated objective is a purchase rather than a plan.** Every
row below is read from Supabase's own backup documentation on 2026-08-16, not from an earlier
document in this repo. That distinction is the whole lesson of the tier correction and the Hetzner
inventory: an infrastructure fact cited onward from a document, never re-read from the platform, is
how both of those went wrong.

| | The objective | What Pro actually gives us |
| --- | --- | --- |
| **RPO** (data we can afford to lose) | 24 hours | 24 hours. Backups are DAILY, so a failure at 23:59 loses that whole day. PITR would take this to ~2 minutes. |
| **RTO** (how long we can be down) | One working day | Unmeasured on Supabase's side. Restoration makes the project inaccessible for a period that scales with database size; at 18 MB that should be minutes, but "should be" is not a measurement. |
| **Retention** | Long enough to notice the damage | 7 days. Team is 14 and Enterprise 30; PITR is a separate paid add-on (~$100/mo at 7 days, and it also requires at least a Small compute add-on). |

**Why a 24-hour RPO is cheap today and will not stay cheap.** The transactional tables hold 3 orders,
3 users and 3 processed Stripe events (read 2026-08-16). A lost day today is a day in which almost
nothing happened. The same objective at fifty orders a week means losing up to fifty orders with
their Stripe reconciliation and dispatch state, and **the customer is who discovers it**. Order
volume, not the calendar, is the trigger for revisiting PITR.

🔴 **What 7-day retention does NOT cover, and it is the likelier failure.** It covers "we broke it
and noticed", which is the loud case. It does not cover slow corruption: a bad migration, a wrong
UPDATE or a silently dropped constraint that nobody sees for eight days is unrecoverable, because
the last clean image has already rolled off. **The schema baseline and the restore drill prove the
SHAPE comes back; neither returns the rows.**

🔴 **Supabase's daily backup does NOT include Storage objects.** Their documentation is explicit:
the database holds only metadata about those objects, and restoring an old backup does not restore
objects deleted after it was taken. **Plan step 3.4 moved the published media out of git and into
the `content` bucket, so the media is now covered by neither git nor the database backup.** The
manifest and the renderer make it reproducible from source, which is the real mitigation, but that
is a rebuild rather than a restore and nobody has timed it. Shot media is the class this does not
save, which is what step 3.5's cold archive on `nc-server-01` exists for.

⚠️ **Two smaller traps in their restore path, worth knowing before the day we need it.** Daily
backups do not store passwords for custom roles, so those need resetting after a restore; and any
subscriptions or replication slots must be dropped before restoring and recreated after (the
Realtime slot is exempt and handled automatically).

**OPEN, for Keith: is 7 days enough, or is PITR worth ~$100/mo now?** The honest recommendation is
**not yet** at 3 orders, and **yes before the first serious order week**, because the add-on protects
the data we cannot recreate from source while everything else in the picture is reproducible.

**Connection: the SESSION POOLER.** `SUPABASE_HOST`/`SUPABASE_PORT` in the repo-root `.env` are
`db.<ref>.supabase.co:6543`, which cannot serve a dump from this machine for two independent
reasons: that host is IPv6-only and there is no IPv6 here, and 6543 is the transaction pooler. Only
the password is read from `.env`.

---

## The content pipeline's channel spec and media model (plan Phase 6, 2026-08-16)

**A channel row now says what it REQUIRES, not just what it is.** `content_channels` carries
`media_kind` (`none|image|video`), `media_min`/`media_max`, `media_aspect`, `thumb_spec`,
`body_max_chars`, `supports_first_comment`, `requires_human_publish`, `publisher_brand`, and
`route_verified_at`/`route_verified_evidence`. The goal of Phase 6 is that **adding a platform costs
a row and no code**.

**`thumb_spec` moved onto the channel because that is what it always was.** Across all 74
renditions its value is perfectly determined by `(platform, format)` — every `instagram/reel` is
`9x16`, every `facebook/link-post` is `none`. It is still ALSO on `content_renditions`, and that is
deliberate: the publish gate reads the rendition column, so dropping it before step 6.3 makes the
gate generic would take the thumbnail check offline in between.

**`publisher_brand` exists because Metricool permits one Instagram account per brand.** Two Instagram
accounts therefore mean two brands: `6693691` (`keith.antony.ai`) carries the carousels, `6633045`
(`keithandroprime`) carries the reels and everything else. `metricool-schedule.ts` still reads a
single `METRICOOL_BLOG_ID` and so can only address one of them; the brand is now a per-channel fact
waiting for the scheduler to read it. Full rule: `06_marketing/content/social-channel-setup.md`.

🔴 **`connected` and "has ever carried a real post" are different facts, and only one is evidence.**
`route_verified_at` is set from a rendition that actually reached `published` with a real URL.
**Measured 2026-08-16: 4 of 10 routes are proven; six are connected and have never published
anything.**

### `content_media` and `content_rendition_media`

**Which files belong to a rendition now has a home.** `content_media` holds `kind`, `aspect`, `uri`,
`origin`, `checksum`, `bytes`, `width`/`height`, keyed to an **asset** rather than to a rendition;
`content_rendition_media` joins them **many-to-many** with a `role` (`body|thumb`) and a `position`.

**The many-to-many is the point.** One 9:16 export is LINKED to the Instagram Reel, the YouTube
Short, the TikTok short and the LinkedIn short rather than copied into each, so re-rendering updates
one row and every surface follows. `role` is what makes thumbnails stop being special: a cover is a
linked file with a role, not a column plus a bespoke gate branch.

**Four guardrails, each proved by making it fail** in a transaction that was rolled back:

| Attempt | Result |
| --- | --- |
| Link media belonging to a DIFFERENT asset | refused by `gate_rendition_media_same_asset()` |
| Two files in the same carousel slot | refused by the `(rendition, role, position)` unique index |
| Delete a file a rendition still ships | refused by `on delete restrict` |
| Register the same URI twice for one asset | refused by `(asset_id, uri)` unique index |

**Both tables are EMPTY on purpose.** No backfill ran inside the migration: the 110 carousel objects
are described by the committed `media-manifest.json` and the 21 owed thumbnails do not exist yet, so
populating this is a separate step against a real source rather than a guess.

---

## Supabase Storage: the `content` bucket (created 2026-08-14, gate D3)

**One public bucket, `content`.** It holds publishable marketing media only — carousel slides,
covers, thumbnails, published video cuts. Path convention **`<asset-slug>/<name>-<sha256[0:8]>.<ext>`**.
Migration: `database/migrations/20260814_content_media_bucket.sql`.

**The rule for the split:** git holds the recipe, Drive holds what humans touch, Storage holds what a
machine publishes from, and the database holds only the URI. **`frontend/public/` is for genuine site
chrome only** — `frontend/public/carousel/` is gitignored and untracked as of 2026-08-14, and a
`.gitignore` rule keeps rendered output uncommittable.

**Written by** `06_marketing/content/instagram/carousel-prototype/publish-media.js` (service role
only), which content-addresses each file and verifies it by fetching it back **unauthenticated**.
**Read through** the committed `media-manifest.json`, never by rebuilding a path from a convention —
the content hash cannot be reconstructed, and that is deliberate: it is what stops an embargoed asset
being guessable from a slug published in the run calendar.

**What may never enter it, and the three controls that enforce it, are in `03_compliance/CONTEXT.md`
("Public media bucket").** In short: mime allowlist at upload (a results PDF is refused 415 for every
caller including the service role), RLS on with **zero policies** (anon cannot write or enumerate;
public download is a separate route that does not consult RLS), and **doctor invariant I11**, which
fails on any object that does not match the convention or whose slug is not a live `content_assets`
slug. **Never add a select policy on `storage.objects`** — it turns "unguessable" into "enumerable".

**File size limit is 52428800 (50 MB), which is OUR setting, not a tier ceiling.** It was set on
2026-08-14 believing the project was on the free tier; the organisation actually reports `plan: pro`.
Long-form video (~500 MB) does not fit, and raising the limit is therefore a decision to take
deliberately rather than a purchase to wait for.

**To remove something:** `unpublish-media.js` (`--list`, `--orphans`, `--prefix`, dry by default,
`--yes` to act). Deleting from here removes the ORIGIN only — Metricool re-hosts every asset to its
own CDN at schedule time, so the published copy is untouched. Full order of operations: the takedown
path in `03_compliance/CONTEXT.md`.

---

## Special Cases

- **Supabase DPA:** incorporated via Supabase's standard terms (<https://supabase.com/legal/dpa>); there is no separately signed DPA (confirmed by the 2026-07-05 audit). No separate DPA signature gates the results pipeline.
- **Session-recording exclusion:** authenticated app routes (`/results-dashboard`, `/account`, etc.) must be excluded at the tool's project level, not just suppressed in code. Verify at QA.
- **Lab webhook reliability (Vitall):** the lab does not retry failed webhooks. QStash must be live before the results pipeline activates. Silent failure = lost result, no recovery path.
- **Vitall `order-cancelled` webhook:** handled out-of-band (like `sample-issue`/`data-purged`), NOT via the silent STATUS_MAP path: sets `kit_orders.status='cancelled'` then calls `emitOpsAlert()` → internal ops profile (`OPS_ALERT_EMAIL`, default `keith@andro-prime.com`) + `lab_order_cancelled` CIO event. **It NEVER auto-refunds**: cancel and refund are decoupled; refund stays a deliberate manual Stripe action at Phase-0 volume. (Lab-cancellation clause DRAFTED into `03_compliance/terms-and-conditions.md` 2026-07-09, pending Ewa sign-off before the live /terms page syncs.)
- **`.glass-panel` overrides `bg-*`:** the `.glass-panel` utility (`styles/base/globals.css`, `@layer utilities`) hard-applies `bg-white`. Tailwind layer ordering emits it AFTER `bg-black`/`bg-gray-*`, so at equal specificity glass-panel's white wins and silently overrides whatever background you set (text sits on the wrong colour). **For any non-white panel, do NOT use `glass-panel`**: inline `border-2 border-black` instead (`rounded-none`/`shadow-none` are global resets). Anywhere `glass-panel` + a `bg-*` coexist is presumed broken.
- **Deprecated `/activate` flow:** the login-gated per-order kit-QR flow is deprecated (Vitall pre-links the sample to the customer at dispatch; auth is already passwordless). Replacement (not built) = one generic no-login "how to take your sample" page (video + steps) behind a **generic QR that goes on the kit insert, not the sleeve**. Dead: `sample_registrations` table + `kit_orders.kit_activated_at` (internal metric only). Decision: `docs/2026-06-12-activate-qr-deprecation.md`.
- **seq-04 Day-75 retest:** needs a `SUBSCRIBER10` Stripe coupon (10% off, 14 days) to exist before the email activates.
- **seq-05 pause option:** references Stripe subscription pause; confirm it's live in the portal before activating churn-prevention.

---

## Platform Notes

- Aesthetic: light editorial; white backgrounds, black type, no border-radius, no gradients. 🔴 **The blog's scoped exception is superseded in direction (2026-08-29, `blog-F.html` approved): the blog adopts Direction F and `.blog-skin` retires with the rebuild.** Until then, blog has its own scoped `.blog-skin` editorial category (cream bg, charcoal block-shadows); see brand guidelines + blog-skin memory.
- Mobile-first throughout.
- This workspace does not own: strategy (`/01_strategy`), compliance approval as a primary task (`/03_compliance`), product threshold logic unless translating approved rules into code (`/04_products`), content strategy detached from the site (`/06_marketing`).

---

## Skills, tools & MCPs

MCP servers and tools most relevant when working in this workspace. Repo-wired servers are in the root `.mcp.json` (graphify, context7, dataforseo, supabase, clickup); the rest are claude.ai account connectors, some of which need authorising in an interactive session before use.

**Skills** (repo skills invoke as `/name`; the rest ship with plugins):

- `run`: launch or screenshot the app to confirm a change works in the real app, not just tests.
- `security-review`, `review`: security and general code review of a diff or branch.
- `frontend-design`: distinctive, intentional UI when building or reshaping frontend.
- `schema-markup`, `dataviz`: JSON-LD/structured data in the app, and any in-app charts.
- `/publish-article`: the blog draft-to-live path (status flip, build, smoke test) that touches the app.
- `update-config`: harness settings, hooks, and permissions in `.claude/`.
- claude-mem: `make-plan`, `do`, `learn-codebase`, `mem-search`, `babysit` (plan/execute, onboard to code, cross-session memory, PR watch). Supabase agent skill: `npx skills add supabase/agent-skills`.

**MCPs & tools:**

- **supabase** (MCP, wired, read-only): the primary tool here. DB schema (`list_tables`), migrations, edge functions, advisors, logs (project phqrjtnflovicgkngieu). It is read-only in `.mcp.json`; apply schema changes via the migration workflow, not ad-hoc writes. Writes go through the `mcp__claude_ai_Supabase` connector.
- **Direct Postgres access** (`pg_dump`, `psql`): use the **session pooler** on port 5432 — host `aws-0-eu-west-1.pooler.supabase.com`, user `postgres.phqrjtnflovicgkngieu`, password in `SUPABASE_PASSWORD` in the repo-root `.env`. The direct host `db.<ref>.supabase.co` is **IPv6-only** and unreachable from an IPv4-only machine, and the transaction pooler on 6543 does not support `pg_dump`. Each of those three was tried and failed before the working one was found, so this line exists to save the next person the same hour.
- **Rebuilding the database from the repo:** `database/schema/baseline-2026-08-14.sql`, then any migration dated after it. The `migrations/` directory is an ordered log and must never be replayed wholesale against a live database; see its README.
- **context7** (MCP, wired): current Next.js / React / library docs before writing framework code.
- **graphify** (MCP, wired): the code knowledge graph, the DEFAULT code-discovery tool over grep (see root `CLAUDE.md`). Committed code is fresh; uncommitted edits are not yet indexed.
