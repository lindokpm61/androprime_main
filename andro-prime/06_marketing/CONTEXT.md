# Marketing — Context

**Read before any copy or campaign work:**

1. `positioning/product-marketing-context.md` — master context for all marketing skills. Read first, always.
2. `../04_products/icp-kit-supplement-alignment-april2026.md` — defines selling frames, hero claims, ingredient copy hooks, dashboard flow, and cross-sell triggers. Supersedes V7 product docs on all copy and UX decisions.
3. The relevant skill context file (see Skill Context Files table below).

**Owner workspace:** `06_marketing`
**Integration:** Copy produced here must comply with `/03_compliance/CONTEXT.md`. Product claims must match `/04_products/`. LP pages are built in `/09_website-app/frontend/lp/`. **Blog articles are MDX in `/09_website-app/frontend/content/blog/`** (the content engine → see `seo-ai-search/content-engine-roadmap.md`). Email sequences are in `/09_website-app/frontend/email-templates/`.

This workspace governs acquisition, content, channels, campaigns, affiliates, paid media, SEO, and analytics strategy. The Phase 0 GTM (v4, 2026-05-31) runs **two co-primary engines, zero paid media**: **Engine A — affiliate** (PT/influencer/gym; *borrowed* trust; fast warm start; younger ~30-45 segment) and **Engine B — owned content/DTC** (SEO + YouTube + organic social + email; *earned* trust; compounding; the only route to the older ~45-70 segment). **Start at `master-plan/phase0-gtm-v4.md`.**

---

## Directory Structure

```text
06_marketing/
├── master-plan/
│   ├── phase0-gtm-v4.md                   ← CONSOLIDATED GTM (v4). START HERE. Supersedes the strategic posture of the two below.
│   ├── 2026-05-31-gtm-v4-strategy-reframe.md ← v4 decisions log + demand & social-media research
│   ├── phase0-marketing-plan.md          ← v2.3 — execution detail: funnel, email, campaigns
│   └── phase0-acquisition-strategy.md    ← v3 — execution detail: affiliate timeline, channel sequencing, CAC
├── positioning/
│   └── product-marketing-context.md      ← MASTER SKILL CONTEXT. Read before any skill file. Read first.
├── affiliates/
│   ├── CONTEXT.md                        ← Affiliate programme rules, commission structure, KPIs, compliance
│   ├── commission-structure.md           ← Rate card, code formats, payout rules
│   ├── influencer-programme.md           ← Influencer outreach templates, onboarding, content rules
│   ├── pt-programme.md                   ← PT outreach templates, onboarding, recommendation scripts
│   ├── influencer/                       ← Outreach tracker, kit sends log, content log
│   ├── pt-network/                       ← PT affiliate list, outreach status, codes issued
│   └── codes-and-tracking/               ← Master code registry; FirstPromoter config
├── analytics/
│   ├── attribution.md                    ← Attribution model and channel tagging rules
│   ├── cac-dashboard.md                  ← CAC tracking by channel
│   └── conversion-tracking.md            ← Event tracking setup and measurement plan
├── content/
│   └── copy-content-context.md           ← Skill context: copywriting, copy-editing, social-content, cold-email
├── paid-media/
│   └── paid-measurement-context.md       ← Skill context: paid-ads, ad-creative, ab-test-setup, analytics-tracking
└── seo-ai-search/                        ← THE CONTENT ENGINE
    ├── content-engine-roadmap.md         ← ★ START HERE — 8-stage pipeline, lifecycle, current state, doc index
    ├── blog-ai-seo-strategy.md           ← Strategy + the LIVE pillar table (A–G, E, F + new H/I/J)
    ├── content-atomisation-model.md      ← One canonical asset → YouTube/social/email/affiliate
    ├── coverage-rules.md                 ← Keyword-cannibalisation governance (one CSV row = one article)
    ├── content-calendar.md               ← What publishes when (Mon+Thu cadence; the status gate)
    ├── keywords.csv                      ← Master keyword DB (assigned_to pillar, coverage_status lifecycle)
    ├── keyword-clusters.md               ← Priority clusters by funnel stage
    ├── portfolio-demand-gap-map.md       ← Demand + gap analysis feeding the pillar queue
    ├── discovery-symptom-first.md        ← Symptom-first discovery (+ staging CSVs)
    ├── pillar-architecture-rerank-2026-06-18.md ← Semrush-vs-DataForSEO pillar re-rank; the H/I/J expansion
    ├── keyword-rerank-dataforseo-2026-06-18.md  ← Backlog spoke re-rank (DataForSEO)
    ├── competitor-organic-teardown.md · site-audit-2026-06-15.md · reoptimisation-*.md ← competitive + audit
    ├── robots-bot-access.md              ← AI crawler access rules (robots.txt configuration)
    ├── article-briefs/                   ← One brief per article (the /article spec). Hubs A–J.
    ├── article-drafts/                   ← Drafted MDX, pre-Ewa (dev-visible only)
    ├── article-schema/ · faq-schema/ · organisation-schema/ · product-schema/ ← JSON-LD templates
    ├── tools/dataforseo.mjs              ← Keyword/SERP tool (DataForSEO; UK defaults). SOLE tool — Semrush dropped 2026-06-18
    └── seo-content-context.md            ← Skill context: seo-audit, ai-seo, schema-markup, content-strategy
```

> **Published blog articles do NOT live here.** They are MDX in `/09_website-app/frontend/content/blog/`
> (one template + N MDX files). `seo-ai-search/` holds the strategy, keyword data, briefs, drafts, and the
> production system; the live articles are shipped into the frontend. See `content-engine-roadmap.md`.

---

## How to Work Here

### Writing any copy or campaign brief

1. Read `positioning/product-marketing-context.md` first — it is the master context for all marketing work.
2. Read `../04_products/icp-kit-supplement-alignment-april2026.md` — it defines the correct selling frame for every kit, supplement, and CTA. Copy that conflicts with it must be revised.
3. Identify the ICP, channel, and funnel stage before writing a single line. See Channel Map below.
4. Run the pub test before saving: would Keith say this to a friend in a pub?
5. Run the compliance checklist in `/03_compliance/CONTEXT.md` before the file is marked ready.

### Working on the affiliate programme

1. Read `affiliates/CONTEXT.md` first — it contains the commission structure, partner types, tracking setup, and compliance rules.
2. Influencer outreach templates and tracker live in `affiliates/influencer-programme.md` and `affiliates/influencer/`.
3. PT outreach templates and tracker live in `affiliates/pt-programme.md` and `affiliates/pt-network/`.
4. All codes are registered in `affiliates/codes-and-tracking/`. Do not issue a code without registering it there.
5. Brief every affiliate in writing before code issuance: no diagnostic claims, no TRT availability claims, no ashwagandha mentions. This is a compliance requirement — see Special Cases.

### Planning or updating paid media

1. Read `paid-media/paid-measurement-context.md` — it defines channel strategy, creative constraints, and measurement setup.
2. Paid traffic routes to `/lp/` variants, not the canonical site. See Special Cases.
3. No discount codes in cold Meta creative. Price must appear in at least one Google headline.
4. All ad creative must pass the compliance checklist in `/03_compliance/CONTEXT.md` before going live.

The content/SEO/GEO engine lives in `seo-ai-search/`. **Start at `seo-ai-search/content-engine-roadmap.md`** — it maps the 8-stage pipeline (strategy → keyword research → pillars → brief → create → authorise → publish → atomise) and indexes every doc.

1. **Strategy + pillars:** `seo-ai-search/blog-ai-seo-strategy.md` (the live pillar table — A–G, E, F + new **H Liver / I Metabolic / J Thyroid**, added 2026-06-18) and `seo-ai-search/content-atomisation-model.md` (one canonical asset → all channels). `seo-content-context.md` covers article structure, schema, and AI-search optimisation at the skill level.
2. **Keyword + SERP data = DataForSEO only** via `seo-ai-search/tools/dataforseo.mjs` (UK defaults; creds in root `.env`). **Semrush dropped 2026-06-18 — do not use the Semrush MCP even if it still shows connected.** Legacy `keywords.csv` `kd` values are Semrush-scaled; DataForSEO KD is a different scale (kept in `notes`) — don't mix-sort that column.
3. **Before any new brief:** read `seo-ai-search/coverage-rules.md` (prevents keyword cannibalisation — one CSV row = one primary article) and run the SERP underserved-gap check. Check `seo-ai-search/keyword-clusters.md` + `keywords.csv` for the cluster.
4. **Article lifecycle:** brief (`article-briefs/`) → draft (`article-drafts/`, via the **`/article`** skill) → **Ewa sign-off (mandatory gate)** → publish to `09_website-app/frontend/content/blog/` (via the **`/publish-article`** skill). Cadence + schedule: `seo-ai-search/content-calendar.md`.
5. **Blog articles are MDX in `/09_website-app/frontend/content/blog/`** — NOT `canonical-site/`. The `status: draft|published` frontmatter gates visibility (`lib/blog.ts`); only `published` shows in prod, drafts are dev-visible for review. LP content is separate, in `/09_website-app/frontend/lp/`. Do not mix.
6. All blog copy passes `compliance-preflight` + Ewa sign-off before publishing. Informational articles have different claim thresholds than product pages — when in doubt, apply the stricter rule.

### Analytics and measurement

1. All event tracking follows the plan in `analytics/conversion-tracking.md`.
2. CAC is tracked by channel in `analytics/cac-dashboard.md`. Update after each reporting period.
3. Attribution model is in `analytics/attribution.md`. Do not create parallel attribution logic in other workspaces.

---

## Skill Context Files

Read `positioning/product-marketing-context.md` before any of these. It is always first.

| Task | Skill context file | Skills covered |
| --- | --- | --- |
| Any marketing or copy task | `positioning/product-marketing-context.md` | All skills — master context |
| Copy, content, email, social | `content/copy-content-context.md` | copywriting, copy-editing, social-content, cold-email |
| Paid media, ad creative, measurement | `paid-media/paid-measurement-context.md` | paid-ads, ad-creative, ab-test-setup, analytics-tracking |
| SEO, AI-search, site architecture | `seo-ai-search/seo-content-context.md` | seo-audit, ai-seo, site-architecture, schema-markup, content-strategy |

---

## Channel Map

| Channel | Funnel stage | Primary ICP | Primary offer |
| --- | --- | --- | --- |
| PT affiliates | Awareness → consideration | ICP 2 (Optimiser) | Kit 2 or Kit 3 |
| Micro-influencers | Awareness | ICP 1 (Achiever), ICP 2 | Kit 1 or Kit 2 |
| Google search | Consideration → decision | ICP 1, ICP 3 | Kit 1 (branded + symptom terms) |
| Meta / Instagram | Awareness → consideration | ICP 1, ICP 2 | Kit 1 cold; Kit 2 retargeting |
| LinkedIn (Keith posts) | Awareness | ICP 1, ICP 4 | Brand; founding member |
| Reddit | Awareness | ICP 1 | Brand; trust-building only |
| Blog / GEO | Awareness → consideration | ICP 1, ICP 2, ICP 3 | Informational → kit CTAs |
| YouTube (organic) | Awareness → consideration | Older ~45-70 segment | Long-form explainers + founder journey → kit CTAs |
| Email sequences | Conversion → retention | All ICPs | Supplement upsell; founding member; retest |

> **v4 overlay:** channels are now organised into two engines (affiliate / owned content-DTC) across two segments (younger ~30-45 / older ~45-70). Authoritative architecture: `master-plan/phase0-gtm-v4.md` §5; the table above is the quick reference. Organic social + YouTube are IN; paid stays excluded.

---

## Affiliate Commission Reference

Full detail in `affiliates/CONTEXT.md` and `affiliates/commission-structure.md`.

| Partner type | Client discount | Commission (v2.3) | Code format | Example |
| --- | --- | --- | --- | --- |
| Micro-influencer | 10% off kit | £15 flat per kit + £10 Kit 3 upsell + £10 supplement-conversion | `[NAME]15` | `JAMES15` |
| PT affiliate | 10% off kit | £15 flat per kit + £10 Kit 3 upsell + £10 supplement-conversion + Silver £200 / Gold £400 PT graduation (one-off) | `PT[NAME]15` | `PTMARK15` |
| Customer referral | 10% off | £10 store credit | Auto-generated link | — |

**Note on code format:** The "15" suffix is a legacy artefact of an earlier 15%-discount iteration. The customer discount is now 10% across all affiliate codes. Code format preserved for stability. See `affiliates/commission-structure.md` §8.

**Tracking platform:** FirstPromoter (Stripe-native). Setup and code registry in `affiliates/codes-and-tracking/`.

---

## Special Cases

**`positioning/product-marketing-context.md` is always first:** Every marketing skill reads this file before its own skill context file. It contains the product overview, ICP profiles, selling logic, and cross-skill rules. Do not skip it.

**Two-engine acquisition model (v4):** Phase 0 runs two **co-primary** engines — affiliate (borrowed trust; warm; younger segment) and owned content/DTC (earned trust; compounding; the only route to the older ~45-70 segment). Both run from pre-launch; both are organic (zero paid media). Affiliate still carries early volume because content compounds slowly. Do **not** treat content/SEO as a slow-burn afterthought — that was the pre-v4 posture the symptom-demand research overturned. Full rationale: `master-plan/phase0-gtm-v4.md`.

**LP vs canonical site split:** Paid, affiliate, and retargeting traffic routes to reduced-navigation `/lp/` variants with a single CTA. Organic, branded, and direct traffic routes to the canonical site. These serve different purposes — do not merge them. Full rules in `/09_website-app/docs/lp-architecture.md`.

**Ashwagandha — affiliate compliance rule:** Ashwagandha KSM-66 is a silent ingredient in the Daily Stack. It must never be mentioned in affiliate briefs, influencer talking points, or any externally-facing content. Affiliates must be briefed in writing before code issuance that they may not make supplement efficacy claims beyond EFSA-approved language and may not mention ashwagandha by name. If an affiliate makes a public claim about it, the ASA complaint lands on Andro Prime. Full rules in `/03_compliance/CONTEXT.md`.

**TRT and clinical services:** Do not reference TRT, peptides, or clinical services as currently available in any campaign, ad, content, or affiliate brief. Founding member programme copy: "Be first when we launch TRT" — not "Join our TRT programme."

**Phase 0 supplement CTA gate:** Supplement cross-sell CTAs in any marketing context must follow the results-engine trigger rules in `04_products/CONTEXT.md`. Do not invent new supplement recommendation logic in marketing copy.

---

## Do Not Use This Workspace For

- Compliance sign-off or regulatory review (→ `/03_compliance`)
- Product threshold logic, biomarker rules, or results-engine routing (→ `/04_products`)
- Backend or API implementation (→ `/09_website-app`)
- Email sequence copy and build specifications (→ `/09_website-app/frontend/email-templates/`)
- Customer support or retention flow design unless the task is directly acquisition-linked (→ `/08_customer-journey`)
- Partner negotiation or lab evaluation (→ `/05_partners`)
