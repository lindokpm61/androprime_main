# Website / App — Current State

Volatile, dated status: what is live / verified / owed **right now**. Durable architecture and access mechanics are in `CONTEXT.md`; this file is the moving layer. Update the date whenever a line changes.

_Last updated: 2026-07-14._

---

## Content-engine on-ramp + local MCP tooling (2026-07-14)

- **New script `frontend/scripts/content-engine/seed-pipeline.ts`** bridges hand-authored `/article` drafts into the DB pipeline. Hand-authored articles skip the keyword-queue, so they never get a `content_pipeline` row, so Draft-Writer / Signoff-Concierge never see them and no ClickUp review task is created. `seed-pipeline.ts --slug <slug>` seeds a `brief_ready` row (idempotent; reuses Draft-Writer + Signoff-Concierge rather than duplicating them). Proven end-to-end: `free-androgen-index` seeded, drafted into `blog_articles`, and **ClickUp review task `869e4uwk5` created** with the pipeline at `in_review`. Do NOT use `/publish-article` for DB-pipeline articles: its build+push forces the Coolify redeploy the DB workflow exists to avoid.
- **Local MCP servers wired in the gitignored `.mcp.json`** (headless-capable, unlike the claude.ai OAuth connectors): `supabase` (`@supabase/mcp-server-supabase`, read-only, project-ref `phqrjtnflovicgkngieu`), `clickup` (`@taazkareem/clickup-mcp-server@0.14.4`, `CLICKUP_API_KEY` + team `90121729875`; the free/LIMITED tier covers the task/comment tools we use), plus the earlier `dataforseo` creds fix. Secrets are inlined because `${VAR}` substitution does not reach the MCP process. Stripe deliberately NOT wired (the package has no tool-scoping, so a live key would expose writes; use a read-only restricted key or the hosted connector). Customer.io stays on its hosted connector (no clean local stdio package).

---

## Integrations — live status

### Stripe — LIVE for kits
- Kit checkouts return `cs_live` on production; live keys + `STRIPE_PRICE_KIT_1/2/3` populated in Coolify. Supplement price IDs (`_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK`) **intentionally unset** until Phase 0b — the subscription route returns a clean 400, not a 500, and supplement pages are coming-soon + waitlist.
- **Live prices:** Kit 1 £99 `price_1Ta1IoLU0SDiIplTCBeHUi4g` · Kit 2 £119 `price_1TcaopLU0SDiIplThAK94iVM` · Kit 3 £179 `price_1Ta1KxLU0SDiIplTZXYzeJ4X`. Kit 2's original `...4WwdIKIS` was mispriced £117 (£2 undercharge), now archived — resolved + verified 2026-05-30 (prices are immutable, so a corrected one was created).
- **Live webhook endpoint created 2026-06-25** at `/api/webhooks/stripe` — 4 events (`checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`). It did **not** exist before: the first real live purchase charged the card but fired no webhook (no order, no dispatch) until this was created + `STRIPE_WEBHOOK_SECRET` re-set. Idempotency via `processed_stripe_events`. Subscription/invoice events are inert until Phase 0b.
- **Coupons (live):** `SUBSCRIBER10` (`oyOOwEuq`) + `LAUNCHDAY10` (`oayVKPWk`), auto-applied via `?discount=<CODE>` → env `STRIPE_COUPON_*` (commit `f3f963d`). Verified end-to-end (Kit 2 + SUBSCRIBER10 → £107.10; Kit 1 + LAUNCHDAY10 → £89.10). `SUBSCRIBER20` intentionally does not exist in live. No promotion codes (coupon auto-apply only).
- Admin cash position: `lib/admin/getCashPosition.ts` → `stripe.balance.retrieve()` (GBP only), Keith-only `/admin/dashboard`, graceful-degrades to 0 + inline error on failure.

### Customer.io — transactional LIVE + verified
- Verified on a **real** purchase (2026-06-25/26) after fixing the email-identifier **collision** — every CIO call now keys on email (`lib/customerio/identity.ts`, commit `61e4a39`). Workspace 219186, EU datacenter.
- Live + verified: T-01/02/03/09; seq-03a + seq-03b; **seq-03c/03d results-signal fix** (shipped 2026-06-26, `e8ea86e`) — seg-22 redefined to the `results_all_clear` attribute, seq-03d repointed to the `borderline_nurture_consented` event; live retest passed (kit3 all-clear → seg-22, kit2 low-VitD → seg-21, consent → event delivered after fixing Email 1's `event.kit_name` silent-drop, `3a87392`). Spec: `docs/seq-03-results-signal-fix-spec-2026-06-26.md` (ClickUp 869dw3ge8).
- CA-019 (collection copy) + CA-020 (testosterone-value reword) approved. `unsubscribe_url` uses the `{% %}` Liquid tag.

### Vitall — lab E2E proven
- Live purchase → order → dispatch proven 2026-06-25 (order `322942444`). Webhook lands at `/api/webhooks/vitall` → QStash → `/api/jobs/process-result`. The lab does **not** retry failed webhooks — QStash must be live before the pipeline activates.

### GA4 — live
- `G-D5M4J5M3F6` + consent banner, in production since 2026-06-18 (server-side mirror + client gtag; `lib/analytics/`). Phase 1 (server-side Measurement Protocol mirror) verified via GA4 Realtime 2026-06-16; Phase 2 (Consent Mode v2 default-denied + `CookieConsent.tsx` brutalist banner, Accept/Reject equal weight per ICO) live 2026-06-18. Analytics is the only togglable category; ad/personalization stay permanently denied (no ad pixels).

### Low-T routing + nurture — DEPLOYED 2026-06-07, nurture campaign DRAFT

- Low-T (T<12) → **GP referral, no upsell** is live (`classifier.ts`, `resolveCta`); the founding-member list was **taken down** in the live app (join route → 410, `/founding-member` → 307 `/kits`, FM removed from nav/homepage/sitemap). Dormant infra deliberately left (`JoinForm`, `founding_member_list` table 0 rows). Static canonical-site FM sweep also done (`e280a89`); legal T&C/privacy FM sections deliberately left (describe a dormant mechanism, need Ewa review — not a promotion).
- **Consent mechanism built + live:** `POST /api/lowt-nurture/consent` (un-pre-ticked opt-in on the low-T card, below the GP CTA) records consent then sends `low_testosterone` + `lowt_nurture_consent` traits to CIO + fires `lowt_nurture_consented`. Version const in `lib/results/lowtNurtureConsent.ts` (`2026-06-04-v1`), version-locked to CA-014. Migration `lowt_nurture_consent` applied to prod.
- **`buildCioTraits` gating (compliance):** no longer emits `low_testosterone`/`testosterone_value`/`borderline_testosterone` at result-processing — the consent route is the sole gate (closed a pre-consent special-category exposure to a US processor). Energy traits (`low_vitamin_d`/`low_b12`/`elevated_crp`/`crp_level`/`low_ferritin`) are **gated in code on the CA-018 health-processing consent as of 2026-07-07** (fail-closed helper `lib/results/healthProcessingConsent.ts`; raw `crp_level` kept but gated — seq-03a's hs-CRP >10 branch compares the numeric), **deploy pending**. ⚠️ Deploy sequencing: must ship **with or after** the CA-018 checkout-consent deploy, otherwise no customer has consent stamped and seq-03a personalization silently degrades. Conservative default per the open DPIA §4 decision — reversible if Keith + Ewa document a lawful basis instead. **CIO recon 2026-07-07 (live workspace 219186):** seq-03a enters via segment 21 (attribute-change→true on `low_vitamin_d`/`low_b12`/`elevated_crp`) so non-consented users simply never enter (intended degradation, no misfire); `crp_level`/`low_ferritin` appear in no trigger/segment (Liquid-only); seq-03c uses only ungated `results_all_clear` (segment 22); all other running campaigns have empty filters. Profile cleanup NOT needed: all 6 existing CIO profiles are bare (no health attributes stamped). CIO transfer safeguard resolved (CIO DPA = EU SCCs + UK Addendum + DPF cert; no bespoke IDTA).
- **CIO campaign 5** ("seq-03b Low-T Nurture, consented") repurposed to trigger `lowt_nurture_consented`, 3 education-only emails (day 0/+3/+14), **state DRAFT by design** — go-live is a human go/no-go; no TRT/treatment promises. Lawful basis = Keith interim-approved Art 6(1)(a)+9(2)(a) (`03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`); solicitor confirmation task `869d99kzh` open post-launch.

### Kit cross-sell repair — 2026-07-08

An audit found all three kit-to-kit cross-sells non-functional. Repaired + a governing rule set (Keith, 2026-07-08): **post-result cross-sell = the complement, never the superset** (`04_products/results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`).

- **Kit 1 → Kit 2 — LIVE, unconditional.** Normal-T Kit 1 returns `secondaryCta: CTAS.kit2CrossSell` (→ `/kits/energy-recovery`). The prior `energy_symptoms` gate was dropped (signal never captured; Kit 2 is the honest default). Includes borderline T (12–<15). Pre-existing compliant Kit 2 helper copy.
- **Kit 2 → Kit 1 broken link — FIXED.** `kit1CrossSell.href` was `/kits/testosterone-health` (404, no such route); corrected to `/kits/testosterone`. Fires for Kit 2 multi-deficiency or Vit-D/B12 + age ≥40. Regression added.
- **Kit 3 cross-sell — removed.** The briefly-added `kit-3-cross-sell` CtaType is deleted; Kit 3 re-sells markers a buyer already has, so it has no post-result cross-sell role. It stays a front-of-funnel default (the test-selector) + direct-traffic product. (Closes the old "engine gap" line by retiring the concept, not building it.)
- **Dead code removed:** the retired `foundingMember` CTA (type `founding-member-list`, unreferenced) deleted from the registry + CtaType union.
- Tests: classifier suite 22 assertions, + consent-gate 37 + maintenance-offer 42; tsc + build clean.

### All-clear maintenance offer — BUILT DARK 2026-07-07, flag OFF, pending Ewa sign-off

- New `maintenance-offer` CtaType + `resolveCtas()` all-clear branch (below every GP-block/GP-referral and low-T/borderline check), gated on `MAINTENANCE_OFFER_ENABLED === 'true'` (server-side, read per call, default OFF = provably inert; flag-OFF output byte-identical, test-asserted). Copy rendered verbatim from `07_sales/funnel/all-clear-maintenance-offer-copy.md` (one card, per-kit claims block via `maintenanceClaimsForKit()`); anchor-card pattern renders the offer once per all-clear result. Button → `/supplement-waitlist` (Phase 0a; no checkout built).
- Events `supplement_offer_shown` / `supplement_offer_clicked` wired through the first-party `/api/events` + GA4 pattern with `segment: 'all_clear'`; fire only when the flag is on.
- Tests: `scripts/test-maintenance-offer.ts` (41 assertions) in `npm test`; suite + tsc + build clean.
- **Ship path:** Ewa signs `07_sales/funnel/all-clear-offer-signoff-pack.md` → flip the env flag + deploy. A "no" ships nothing.

### Lab-cancel ops alert — DEPLOYED 2026-06-30/07-01, alert campaign DRAFT

- Vitall `order-cancelled` → status flip + `emitOpsAlert()` live (commit `9ca878e`, E2E-verified: route returned `202 {orderCancelled:true}`, DB flipped, ops profile got `internal_ops:true`). **CIO campaign 22** ("OPS — Lab Order Cancelled", transactional, trigger `lab_order_cancelled`, template 53) is **DRAFT** — event fires but no email sends until Keith activates it (email delivery not yet tested). Never auto-refunds.

### Ewa author / Person schema — credentials verified

- `lib/authors.ts` Person schema live with verified credentials (GMC **4758565**, licensed GP; `sameAs` = `https://www.gmc-uk.org/doctors/4758565`; "Harley Street TRT-trained" substantiated, cert filed at `03_compliance/credentials/ewa-trt-training-2025.md`). Approved vs avoid phrasings are in that credential file. **Open (low priority):** professional photo (still `/og/default.png` placeholder), LinkedIn `sameAs` (add once her profile is populated), cert PDF storage decision.

### Tracker v1 ("My Story") — designed, NOT built

- Full design spec exists as mockups in `docs/mockups/` (`tracker-v1-scenarios.html` is the primary reference — 8 scenarios, 4 marker-card states, proportional-time sparkline rules, declining-marker + threshold-crossing rules, hs-CRP lower-is-better). Queued for M3–M4 post-launch. **All tracker display logic is frontend-only** — the DB already holds everything; the gap is the display layer (no `Sparkline.tsx`/`TrendBadge.tsx`/`timeline_events` table). Open with Ewa before code: trend-classifier algorithm, retest-date calc, supplement-event API schema.

### Central CTA routing (`kitCTA`) — BUILT 2026-07-09, articles not yet migrated

- `lib/content/kitCTA.ts` is the single pillar → CTA-target map, mirroring `06_marketing/seo-ai-search/content-atomisation-model.md` §4. `components/marketing/InlineKitCTA.tsx` takes a `pillar` prop and resolves through it. Guarded by `scripts/test-kit-cta.ts` (wired into `npm test`): asserts every pillar hits a live route, no CTA points at `/lp/*` or the FM list, kit slugs match `lib/pricing.ts`, the three no-live-product pillars hold at email capture, and **Pillar E throws** (Ewa-gated andropause).
- **Built because it did not exist.** Three docs instructed routing through a central `kitCTA` config that had never been written; nine articles hard-coded `ctaHref` instead. Surfaced by the 2026-07-09 content-machine dry run.
- **Migration COMPLETE 2026-07-09.** All **15 articles** (not nine: six existed only in the DB) now name a pillar. Deployed, imported, revalidated, and verified live: all 14 published articles return 200 with byte-identical href, UTM string, and button label; the draft verified via `/blog/preview`. Redirecting a pillar is now one line in `lib/content/kitCTA.ts`.

**Safe order for any future content+code change** (learned the hard way, see below): deploy the component → confirm it is live by rendering a **non-public draft** through `/blog/preview/<slug>?token=$PREVIEW_SECRET` → `import-blog-to-db.ts` → `/api/revalidate` → smoke test. Note the asset-fingerprint trick does **not** detect a server-component deploy (client chunks are unchanged); the draft-preview canary does.

### Two landmines found while migrating (both fixed 2026-07-09)

- **The MDX mirror was stale on `status`.** `b12-blood-test`, `fbc-blood-test` and `ferritin-blood-test` carried `status: draft` in `content/blog/` while the DB had them **published**. `import-blog-to-db.ts` takes status from frontmatter, so running it **silently unpublished three live articles**. This actually happened during the migration and was caught and reverted within minutes. Mirror corrected. **Before ever running the import, diff the mirror's `status:` against the DB, not just the body.**
- **Content and code must ship together, code first.** The DB body and the deployed component are one unit. Importing `pillar=` bodies while the old `ctaHref`-only component was still live **500'd every blog article**. Restored by rolling the DB back within minutes. The component is now backwards-compatible (accepts both), so the safe order is: **deploy the component, confirm it is live, then import the content.** Never the reverse.

---

## Content-engine Action: Content Library mirror step added (2026-07-13)

- `content-library-sync.ts` added to `scripts/content-engine/` (reuses `clickup.ts`; hierarchy + task helpers appended there). The daily `content-engine.yml` run now has a "Content Library mirror" step after the blog-mirror sync (`continue-on-error: true`, so it can never fail the engine). One-way git → ClickUp: upserts one task per `06_marketing/content-machine/assets/*.md` into list `901219526361`; fingerprint-diffed, idempotent (verified 2026-07-13: 0/0/3 unchanged on re-run). Owner docs: `06_marketing/content-machine/` (STATE + build spec).

---

## Phase 0b activation checklist (supplements — deferred)

1. Create live Stripe products + prices for Daily Stack / Collagen / Complete Men's Stack.
2. Add `STRIPE_PRICE_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK` to Coolify; redeploy.
3. Configure the Billing customer portal in **live** mode (per-mode setting) — required for `/api/checkout/portal`; currently unconfigured because there are no 0a subscriptions.
4. Decide dunning: **Stripe-native** Smart Retries vs **CIO T-07** emails — mutually exclusive, running both = double emails. Recommendation: Stripe-native at launch, CIO T-07 as a later reversible brand upgrade.
5. seq-04 Day-75 retest needs `SUBSCRIBER10` (already live) — optionally set a fixed `redeem_by` window when the sequence goes live. seq-05 pause option needs the Stripe subscription pause confirmed live in the portal.
