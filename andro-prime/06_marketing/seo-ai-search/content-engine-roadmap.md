# Andro Prime Content Engine — Roadmap & Map

**Created:** 2026-06-18 | **Owner:** Keith Antony | **Status:** Active — single entry point for the whole content/SEO/GEO engine.

> **What this is:** the one-page map of how a search term becomes a published, compliant, multi-channel asset.
> It links out to the detailed docs rather than duplicating them. If you're new to the content engine, start
> here. Source-of-truth strategy lives in `blog-ai-seo-strategy.md` (pillars) and `content-atomisation-model.md`
> (channels); this doc ties them together.

---

## The pipeline (8 stages)

```text
 STRATEGY        DEMAND            ARCHITECTURE       BRIEF
 why (GEO/AI) → keyword research → pillars (hub/   → article brief
                 + SERP gate        spoke)            + coverage map
      │              │                  │                 │
      └──────────────┴──────────────────┴─────────────────┘
                              │
                              ▼
 CREATE          AUTHORISE        PUBLISH           ATOMISE          MEASURE
 /article skill → compliance +  → /publish-article → YouTube/social → rankings,
 → article-       Ewa sign-off    → content/blog/    /email/          GA4, AI
   drafts/        (the gate)        (live)           affiliate        citations
```

Three things govern everything horizontally: **coverage-rules.md** (no keyword cannibalisation),
**compliance** (`/03_compliance/CONTEXT.md` + Ewa sign-off), and the **central CTA-routing config** (evergreen
content redirects to new kits without rewrites — `content-atomisation-model.md` §4).

---

## Stage-by-stage, with the file that owns each

| # | Stage | Owns it | Output |
|---|---|---|---|
| 0 | Strategy / why (GEO) | `blog-ai-seo-strategy.md` | the bet: get cited by AI search |
| 1 | Demand + keyword research | **`seo-data-rebuild-build-doc.md`** = data-layer authority (single-source DFS rebuild). `keywords.csv` = DFS master (20-col, `priority`/`serp_verdict`); selection loop = `csv-to-queue` → keyword_queue → `reconcile-coverage`. Supporting: `keyword-clusters.md`, `portfolio-demand-gap-map.md`, `discovery-symptom-first.md`, `competitor-organic-teardown-2026-06-21-dfs.md`, `geo-serp-findings-2026-06-21.md`. **Tool = `tools/dataforseo.mjs`** (DataForSEO, sole tool — Semrush is historical, never feeds priority) | validated rows + clusters |
| 2 | Pillar architecture | `blog-ai-seo-strategy.md` (Stage-2 table) | hub/spoke pillars, ICP + kit mapping |
| 3 | Brief (+ SERP gate) | `article-briefs/`, governed by `coverage-rules.md` | one brief per article, coverage map |
| 4 | Create | **`/article` skill** | draft MDX → `article-drafts/` |
| 5 | Authorise | `compliance-preflight` skill + **Dr Ewa Lindo sign-off** | the gate (never skipped) |
| 6 | Publish | **`/publish-article` skill**, `content-calendar.md` | live MDX → `09_website-app/frontend/content/blog/` |
| 7 | Atomise | `content-atomisation-model.md` | YouTube / social / email / affiliate derivatives |
| 8 | Measure | v4 KPI framework; GA4 (live) | rankings, conversions, AI-citation count |

---

## The article lifecycle (where files live)

```text
article-briefs/{slug}.md      →   article-drafts/{slug}.mdx   →   09_website-app/frontend/content/blog/{slug}.mdx
   (the spec, /article reads)       (drafted, pre-Ewa,              (LIVE — gated by `status: published`
                                     dev-visible)                    in frontmatter; /publish-article ships it)
```

- **Blog articles are MDX in `09_website-app/frontend/content/blog/`** — NOT in `canonical-site/`, NOT in
  `06_marketing/content/blog/` (that dir is vestigial). One template + N MDX files
  (`reference-seo-blog-architecture`).
- **Publication gate:** `status: draft | published` in each MDX frontmatter; production shows only `published`
  (`lib/blog.ts`). Drafts are visible on localhost for review.
- **Editorial photos:** Unsplash via `tools`-style CLI in the frontend (`scripts/unsplash.mjs`), human-picked,
  step 7b of the `/article` skill.

---

## Pillars (current — see `blog-ai-seo-strategy.md` for the live table)

Re-validated on DataForSEO 2026-06-18 (`pillar-architecture-rerank-2026-06-18.md`). **10 pillars + GEO:**

- **A** Vitamin D · **B** Fatigue · **C** Testosterone (high compliance) · **D** Markers/CRP · **G** Inflammation
- **E** Andropause (Ewa-gated) · **F** Patient-owned data (GEO-only KPI)
- **H** Liver · **I** Metabolic (cholesterol + ApoB) · **J** Thyroid ⟵ added 2026-06-18; H/I/J briefs are
  brief-ready, route to **email capture** until their kit launches, all Medium+ compliance.

Anchor/volume/KD detail + the Semrush-vs-DataForSEO comparison: `pillar-architecture-rerank-2026-06-18.md`.

---

## Current state (2026-06-18)

- **6 articles live** (`content/blog/`): inflammatory-markers (G), low-vitamin-d-symptoms (A) + 14-signs (A.1),
  crp-blood-test (D), myth-of-normal-range (C spoke), why-am-i-always-tired (B). All Ewa-approved.
- **Cadence:** 2/week, Mon + Thu (`content-calendar.md`).
- **Next build queue:** D marker spokes (ferritin/fbc/b12 — highest-leverage, off the live CRP hub) → then the
  new H/I/J hubs. Brain fog queued as a B spoke.
- **Atomisation** of the 6 live hubs into YouTube/social/email/affiliate is the immediate next *production* work.

---

## The docs, grouped

- **Strategy:** `blog-ai-seo-strategy.md`, `content-atomisation-model.md`
- **Demand/keywords:** `keywords.csv`, `keyword-clusters.md`, `portfolio-demand-gap-map.md`,
  `discovery-symptom-first.md`, `keyword-expansion-*`, `keyword-rerank-dataforseo-2026-06-18.md`,
  `pillar-architecture-rerank-2026-06-18.md`
- **Governance:** `coverage-rules.md` (cannibalisation), `content-calendar.md` (what ships when),
  `robots-bot-access.md` (AI-crawler access)
- **Production:** `article-briefs/`, `article-drafts/`, schema templates (`article-schema/`, `faq-schema/`,
  `organisation-schema/`, `product-schema/`), `tools/dataforseo.mjs`
- **Competitive/audit:** `competitor-organic-teardown.md`, `site-audit-2026-06-15.md`,
  `reoptimisation-*-2026-06-18.md`
- **Skills:** `/article` (brief → draft), `/publish-article` (draft → live), `compliance-preflight` (the gate),
  `seo-audit`/`ai-seo`/`schema-markup` (analysis). Skill context: `seo-content-context.md`.

---

*Last updated 2026-06-18. The unifying entry point; the linked docs are the detail.*
