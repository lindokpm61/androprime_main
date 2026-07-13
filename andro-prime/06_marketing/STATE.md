# Marketing: Current State

Volatile status of the acquisition/content engine. Durable strategy + rules are in `CONTEXT.md` and the `seo-ai-search/` docs (`content-engine-roadmap.md` is the live-state authority; trust it over any count pinned here). Update the date on each change.

_Last updated: 2026-07-13._

---

## Content Library: git-first tracker BUILT (2026-07-13)

Founder content now has one git-tracked asset file per idea (`content-machine/assets/`, schema in `templates/asset-file.md`), a gate scanner enforcing the pipeline (`.claude/skills/content-status/scan.js`), a `/content-status` board skill, and a one-way sync into a read-only "Content Library" list in ClickUp (git wins). `/hook`, `/script`, `/compliance-preflight`, and `/wrap` are wired to it. **Fully live 2026-07-13:** gws re-authed (drive+gmail, business account), Drive media tree created, ClickUp list `901219526361` live with the seven custom statuses, first sync run verified idempotent (3 seeds: ep-0-baseline `idea`, two pillar-B backfills `scripted`). Daily Action keeps the mirror fresh. Only cosmetic item open (stray empty folder in the personal Drive): detail in `content-machine/STATE.md`. Next content bottleneck unchanged: the Ep 0 baseline shoot.

## Content engine: Phases 1–3a + 3b LIVE (2026-06-19)

- Autonomous, DB-backed, pull-model orchestrator; runs daily **07:00 UTC via GitHub Actions**. Stages: strategy → keyword → pillar → brief → create → authorise → publish → atomise. Authority: `seo-ai-search/content-engine-roadmap.md`.
- **Live article count is tracked in the roadmap doc** (~13 live + a cholesterol draft as of late June). Don't pin it here. **Article sign-off happens in ClickUp, not in the repo.** Ewa reviews and approves each article/webpage as a task in the ClickUp "Content Review" list for Ewa (Phase 0 Launch folder, list `901218140081`, workspace `90121729875`); marking the task complete = approved (change requests go as task comments). That ClickUp list is the article-approval register. The repo `03_compliance/content-approval/content-approval-register.md` covers partner briefs, emails, results copy and consent UI (CA-011 there is the Phase 0a partner-broadcast approval and never covered articles). Confirmed 2026-07-13: inflammatory-markers / crp / fbc all have completed Ewa review tasks dated June 2026. Ewa also approved (in person, 2026-07-13) a one-word compliance reword on inflammatory-markers to clear a `scan.js` HARD flag ("treating inflammation" softened to a boundary phrase); logged on that article's ClickUp review task.
- **Open:** Measurement-Analyst stage (~July).

## Keyword data: rebuilt single-source on DataForSEO (2026-06-21)

- `keywords.csv` rebuilt single-source on DFS (1,050 rows, 20-col with `kd_source`/`serp_verdict`/`coverage_status`). **Semrush retired: never feeds priority** (its KD was proven wrong: crp 47 vs DFS 11). Authority: `seo-data-rebuild-build-doc.md`. Selection loop (`csv-to-queue.ts` → human promote → brief; `reconcile-coverage.ts` writes status back) kills hand-picking.

## Pillars: A–K traffic + F GEO, staged rollout (roadmap is authoritative)

- Base A–G + E + F, plus **H Liver / I Metabolic / J Thyroid** (added 2026-06-18) and **K Brain fog** (added 2026-06-24, brief-ready). D spokes live; **H Liver hub drafted pre-Ewa**; I/J brief-ready. Inflammation (G+D) is the biggest underserved gap. Rule: run `phrase_organic`/SERP-gap before any brief. Detail: `pillar-architecture-rerank-2026-06-18.md`.
- **Live audience-tier mix ≈ 40% wellness / 60% clinical-curious / 0% TRT.** TRT at 0% is the correct safe pre-Ewa state; the drift risk is wellness-vs-clinical-curious, managed by the ~40% wellness floor (see CONTEXT).

## GEO / AI-search: baseline set, crawl path open, third-party presence now the priority lever

- GEO/LLM-citation baseline (4 engines): **cited in 0 / 48 answers** (2026-06-21). Expected for a new domain; citations build over weeks. Method + baseline: `geo-serp-findings-2026-06-21.md`.
- **AI-crawler block cleared 2026-06-09** (Cloudflare Managed robots.txt off; all AI bots incl. Google-Extended free to crawl → Pillar-F citation path open). ⚠️ The bot-block WAF landmine must stay deleted (see CONTEXT §10).
- **Audit re-check 2026-07-13 (DataForSEO live + live robots.txt):** still **0 citations** (0/2 buyer-query spot-check, ChatGPT + Perplexity). andro-prime.com ranks for only **3 keywords**, all inflammation-cluster (from the oldest article). robots.txt re-verified: no AI bot blocked, sitemap present. Foundations (schema-worthy structure, byline, cited stats, bots open) are sound; the gap is that it is early **and** all content is on-domain.
- **Key finding:** what LLMs actually cite for our buyer queries ("best at-home blood test for men UK" etc.) is **comparison/review hubs** (treatcompare, maleoptimal, helvy, bloodtestguide, lolahealth) **and Reddit**, not testing brands' own sites. So **third-party presence is the highest-leverage GEO move right now**, above another on-domain article.
- **Action started:** outreach target list + email template + status tracker built: `seo-ai-search/geo-third-party-presence-outreach.md` (2026-07-13). **Open:** Keith to fill kit/price/reply-to in the email, then run `compliance-preflight` before first send; stand up a monthly GEO citation tracker (Measurement-Analyst stage).

## Feeling-first content ops: shipped (2026-06-26)

- Doctrine live (`master-plan/2026-06-26-feeling-first-content-strategy.md`); candidate keywords tagged (feeling/clinical/solution) + staged for the selection loop; 3 cold/nurture email subjects rewritten feeling-first and **synced LIVE in Customer.io** (templates 4 / 33 / 52). SEO *rank* targets can still be clinical gap-terms; the hook/title/subject leads with feeling.

## Cold-to-warm bridge: Phase 1 shipped

- Article-footer newsletter + first-party events/UTM capture live (guest-capture FK bug fixed: the `users`-table-write-500 for logged-out visitors, shared root cause with the supplement-waitlist bug). Editorial-broadcast, never FM. **Phase 2 quiz expansion deferred.** Events implementation detail: `09_website-app/STATE.md` (GA4 + events).

## Unsplash imagery: BUILT, UNPUSHED

- `scripts/unsplash.mjs` + `ArticlePhoto.tsx` built (commit `88a2224`, **not pushed**: held so Keith can eyeball the first image before it deploys). First article `why-am-i-always-tired` wired. **Open:** push + redeploy; confirm/swap the first image; fold search→pick→use into the `/article` skill; "Apply for production" (50→1000 req/hr). **Rotate the Unsplash Secret Key** (shared via chat screenshot).

## v2.2 marketing corpus: SUPERSEDED banners in place (2026-07-09)

- Dated `⛔ SUPERSEDED` banners added to `master-plan/phase0-gtm-v4.md`, `master-plan/phase0-marketing-plan.md`, `master-plan/phase0-acquisition-strategy.md`, and `paid-media/paid-measurement-context.md`, all pointing to `master-plan/2026-06-26-tier2-sales-creation-plan.md`. Bodies untouched. The paid-measurement doc's banner additionally flags it needs a **FULL REBUILD** before any paid work (still specifies Plausible/Meta Pixel/Clarity + £4k/mo, all superseded).

## Next hubs queued: liver, CRP, thyroid (Keith decision 2026-07-09)

- Keith confirmed (2026-07-09, audit action 869e0bcj0): queue **liver** (18,100/mo, KD 18), **CRP/inflammation** (27,100/mo, KD 11) and **thyroid** (6,600/mo, KD 10) as the next hubs in the content engine. Thyroid pairs with the Kit 5 timeline. Source: `seo-ai-search/portfolio-demand-gap-map.md`. Current pillar state: H Liver hub already drafted pre-Ewa; J Thyroid brief-ready; CRP sits in the inflammation gap (G+D). Briefs follow the normal brief process; run `phrase_organic`/SERP-gap before any brief per the pillar rule.

## Gate restatement + positioning-sharpen propagated (2026-07-09)

- `positioning/product-marketing-context.md` (the marketing master context) updated: top banner records the 2026-06-24 test-led-personalisation sharpen (points to `master-plan/2026-06-24-test-led-positioning-validation-flywheel.md`), Competitive Landscape **rewritten 2026-07-09** (three-camp gap map; Function/Bioniq/InsideTracker/Vitl as the real comparators; **Vitall recorded as a competitor**, so "accredited lab" is table stakes not differentiation; the "is the test itself an upsell?" objection added to the Objections table), and the Gate-targets block restated to the 2026-07-09 gates. Retired 0A/0B/0C numeric bars pointered to `01_strategy/CONTEXT.md` across `07_sales/sales-gtm-context.md`, `04_products/CONTEXT.md` + `catalogue/non-regulated-tier-v7.md` + `catalogue/product-catalogue-v7-1.md` + `kits/kit-1-launch-guide.md`. Bodies preserved.

## PT / affiliate programme: FROZEN

- See `affiliates/CONTEXT.md`. FirstPromoter live but dormant; CA-001/002 solicitor sign-off parked (not a launch blocker); unfreeze needs a fresh Keith decision.
- **Affiliate-doc silent-ingredient rewrite done 2026-07-07** (audit precondition 1 of 2 for unfreeze; precondition 2, the GP-framing sweep, also done 2026-07-07; both met; unfreeze remains a Keith decision + solicitor sign-off on CA-001/002). Programme docs now use the v2.3 allowlist + name-free deflection pattern with one fenced INTERNAL ONLY rationale block each; v2.2 brief binaries quarantined to `affiliates/briefs/superseded-v2.2/`. Residual v2.2-pattern mentions in `master-plan/phase0-marketing-plan.md` (~152, ~159) and `master-plan/phase0-acquisition-strategy.md` (~183) belong to the v2.2 marketing-corpus banner sweep, still open.
