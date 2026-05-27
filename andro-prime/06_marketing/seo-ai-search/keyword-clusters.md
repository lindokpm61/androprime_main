# Keyword Clusters — Andro Prime SEO Keyword Universe

**Owner:** Keith Antony
**Status:** Active — built 2026-05-26 from Semrush UK validation sweep
**Source of truth:** [`keywords.csv`](./keywords.csv) — this document is the narrative index.

> **Read first:** When working on SEO, content briefs, LP copy, or article drafts, always pull the relevant slice from `keywords.csv` (filter by `assigned_to` and `status=validated`). This markdown index explains structure and surfaces the key findings; the CSV is the data.

---

## Why this file exists

Before 2026-05-26, keyword data was scattered across three places (`blog-ai-seo-strategy.md` per-pillar tables, `seo-content-context.md` Tier 1 + Tier 2, and an empty `keyword-clusters.md` stub). Half of it was inferred from product/ICP themes without Semrush validation. The first validation sweep (blog pillars) killed ~50% of the drafted seed queries as zero-vol.

**This file consolidates everything validated into one CSV** so that:

- The `/blog` Claude skill (planned) can consume queries by filter (intent, assigned_to, priority)
- LP audits and rewrites work from validated commercial-intent queries
- Programmatic SEO opportunities are mapped, not guessed
- Brand-comparison + GEO + PT-trade queries live in the same asset as blog pillars
- A single update to one row propagates everywhere instead of three markdown files

---

## CSV schema

```
query, vol, kd, cpc, competition, intent, assigned_to, priority, status, compliance_risk, notes
```

| Column | Type / values |
|---|---|
| `query` | The exact UK search query as Semrush returned it |
| `vol` | UK monthly search volume (integer) |
| `kd` | Keyword difficulty 0–100; blank if not yet measured |
| `cpc` | UK cost-per-click in GBP (commercial-intent signal) |
| `competition` | Paid competition 0–1 |
| `intent` | `commercial` / `informational` / `comparison` / `branded` / `navigational` / `local` / `geo-only` |
| `assigned_to` | Where this query gets used: `pillar-A` through `pillar-G`, `lp-testosterone` / `lp-energy-recovery` / `lp-foundations` / `lp-collagen` / `lp-daily-stack`, `programmatic-cities` / `programmatic-compare` / `programmatic-symptoms`, `brand`, `trade`, `geo`, `unassigned`, `dropped` |
| `priority` | `1` (hub/anchor) / `2` (key spoke) / `3` (long-tail / FAQ) |
| `status` | `validated` / `dropped` / `geo-only` / `pending` |
| `compliance_risk` | `low` / `medium` / `high` / `very-high` (triggers Ewa pre-flight if high/very-high) |
| `notes` | Free text; brief role note |

Dropped rows are kept in the CSV (with `status=dropped`) so future sessions don't re-suggest queries that have already been tested and found to have no demand.

---

## How each downstream asset uses the CSV

### Blog pillars (A–G + F flagship)

`assigned_to LIKE 'pillar-%'`. Each pillar has one or two hub queries (priority 1), 3–5 key spokes (priority 2), and a long tail of FAQ-style queries (priority 3) feeding FAQPage schema. Full pillar/spoke mapping with vol+KD lives in [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md) v2.0; that doc derives from this CSV.

**Article generation workflow — how a brief consumes this CSV:**

1. The pillar hub query (priority 1) becomes the article's primary target — drives H1, slug, title tag, opening AI-snippet block, and meta description.
2. Priority 2 spokes become H2/H3 sections in the article body.
3. Priority 3 long-tail queries populate the article's 8-item FAQ block (which also powers FAQPage schema).
4. Each brief includes a structured `keyword_coverage` block in frontmatter + a "Keyword coverage map" section in the body listing every CSV row addressed. See [`article-briefs/pillar-G-hub-inflammatory-markers-blood-test.md`](./article-briefs/pillar-G-hub-inflammatory-markers-blood-test.md) Section 5a for the canonical template.
5. The article MDX mirrors the same `keyword_coverage` frontmatter block at draft time so planned-vs-delivered coverage is auditable in one diff.
6. **Deferred CSV schema change:** once articles start shipping, add a `published_in` column that back-references the article URL each row appears in. Closes the planning → publishing loop in one CSV.

### Landing pages (LP-*)

`assigned_to LIKE 'lp-%'`. Commercial-intent queries that drive LP titles, meta descriptions, hero copy, and Product schema. Where an LP overlaps a pillar (e.g. daily-stack LP draws from Pillar A queries), the row is assigned to the pillar — the LP audit pulls a UNION of `lp-X` + `pillar-X` rows for the relevant pillar.

### Programmatic SEO

Three sub-clusters, all validated 2026-05-26:

| Cluster | Filter | Page pattern | Note |
|---|---|---|---|
| Cities | `assigned_to='programmatic-cities'` | `/private-blood-test/[city]/` | 10 UK cities validated, vol 30–480, KDs 6–40 (Manchester KD 6 is the easiest in the entire CSV) |
| Comparison | `assigned_to='programmatic-compare'` | `/compare/[competitor]/`, `/vs/[competitor-vs-competitor]/` | Anchor competitors: medichecks, thriva, numan, manual, bupa, nuffield, forth |
| Symptoms | `assigned_to='programmatic-symptoms'` | `/symptoms/[symptom]/` or hub article | Hair-loss is the strongest cluster (~2.3k combined vol); most other symptoms returned 0 vol and are dropped |

### Brand validation

`assigned_to='brand'`. Andro Prime brand-name queries. Most currently have 0 vol (brand new) — `andro prime` itself has 20 vol/mo, meaning some PT-referred traffic is already searching us. Reviews / vs-competitor pages built now will rank instantly once brand demand grows.

### GEO (AI-citation flagship)

`assigned_to='geo'`, status `geo-only`. Zero or near-zero Google demand by design — these are the prompts users actually type into Perplexity / ChatGPT. KPI is AI citation rate, not Google rank. Feeds Pillar F content.

### PT-trade

`assigned_to='trade'`. All currently zero-demand confirmed today. This is **not a Google SEO play** — it's a credibility / recruitment workstream. The PT-trade content stream (`pt-programme.md` Open Item 14) measures by recruitment attribution, not organic traffic.

---

## Key findings from the 2026-05-26 validation sweep

### Easiest wins (vol ≥ 100, KD ≤ 30 — the strict gate)

Sorted by KD ascending. These should ship first regardless of pillar.

| Query | Vol | KD | Assigned to | Notes |
|---|---|---|---|---|
| private blood test manchester | 140 | **6** | programmatic-cities | Insanely easy; first city page to build |
| men's health blood test | 140 | **9** | pillar-D | LP target; lowest KD of any pillar query |
| hair loss vitamin deficiency | 320 | **10** | pillar-A / programmatic-symptoms | Cross-pillar; Pillar A spoke + hair-loss entry |
| blood test for tiredness | 260 | **11** | pillar-B | LP-grade commercial intent |
| blood test for hair loss | 480 | **16** | programmatic-symptoms | Could anchor a hair-loss spoke set |
| blood test for fatigue | 170 | **16** | pillar-B | Cross with Pillar D |
| medichecks reviews | 210 | **17** | programmatic-compare | Anchor /compare/medichecks/ page |
| vitamin d test uk | 390 | **19** | pillar-A | LP variant for Daily Stack |
| ferritin test uk | 140 | **20** | pillar-D | LP variant; Kit 2 marker |
| 14 signs of vitamin d deficiency | 9,900 | **20** | pillar-A | A.1 — biggest vol+lowest KD combo in plan |
| private blood test london | 480 | **20** | programmatic-cities | Local programmatic anchor |
| best supplements for recovery | 110 | **22** | pillar-G | Collagen + Daily Stack funnel |
| inflammatory markers blood test | 1,000 | **23** | pillar-G | G.hub — second-easiest hub in plan |
| vitamin d blood test | 1,900 | **26** | pillar-A | LP-grade commercial intent |
| can vitamin d deficiency cause hair loss | 480 | **26** | pillar-A | Pillar A + hair-loss crossover |
| numan reviews | 2,400 | **26** | programmatic-compare | Biggest competitor target |
| nhs blood test | 6,600 | **27** | pillar-D | D.4 starred |
| best supplements for men over 40 | 320 | **27** | pillar-D | Daily Stack funnel |
| best supplements for energy | 590 | **28** | pillar-B | Daily Stack funnel |
| thriva reviews | 480 | **29** | programmatic-compare | Anchor /compare/thriva/ page |

### Big surprises from this sweep

1. **CRP cluster is enormous.** D.hub `crp blood test` is 18.1k vol — but the *related* synonym universe ("c reactive protein blood work", "crp in blood report", "blood investigation crp", "serum c reactive protein level") adds ~60k more monthly searches. Pillar D should be the SEO heart of the plan, not Pillar A.

2. **Individual marker tests are real LP-grade queries.** `vitamin d blood test` (1,900 / KD 26), `b12 blood test` (2,400 / KD 31), `ferritin blood test` (6,600 / KD 57), `vitamin d test uk` (390 / KD 19), `ferritin test uk` (140 / KD 20) — these are commercial intent and should drive new product pages (`/tests/vitamin-d/`, `/tests/b12/`, `/tests/ferritin/`) OR cluster as Kit 2 LP spokes.

3. **City programmatic SEO is viable.** All 14 UK cities probed had measurable demand (30–170 vol each), with Manchester at KD 6 and London at KD 20. Combined ~1,400 vol across the top 10 cities. Build a `/private-blood-test/[city]/` template, populate for top 10. Low compliance risk.

4. **Competitor comparison pages are viable.** Numan reviews alone is 2,400 vol KD 26 — but note Numan is primarily weight-loss-led (Mounjaro/semaglutide), not testosterone, so a `/vs/numan/` page should clarify category. Medichecks (210 / KD 17) and Thriva (480 / KD 29) are the right Andro Prime competitors.

5. **Hair loss is a real cross-pillar cluster.** `blood test for hair loss` 480 vol KD 16, `hair loss vitamin deficiency` 320 vol KD 10, `does testosterone cause hair loss` 1,000 vol, `dht hair loss` 880 vol KD 36. Better routed as spokes across Pillars A (vit D) + C (testosterone) than as a separate Pillar H — the underlying biomarkers are all already in our kits.

6. **Pillar E (andropause/TRT) demand is bigger than originally validated.** Combined `andropause` 5,400 + `male menopause` 5,400 + `male menopause symptoms` 1,600 + `testosterone replacement therapy uk` 1,000 + `trt cost uk` 590 + `low testosterone treatment uk` 480 + `trt clinic uk` 260 + `andropause treatment` 210 + `private trt uk` 140 + `trt uk private` 90 = ~15,000 vol/mo. Compliance is the only gate — the demand absolutely justifies a pillar IF Keith + Ewa approve.

7. **CRP + Vitamin D FAQ universe is a goldmine for FAQPage schema.** Single Semrush questions runs surfaced ~50 high-vol FAQ-style queries per topic. These map directly to FAQPage schema blocks on each pillar hub — high AI-citation potential per Princeton GEO research.

8. **PT/gym/affiliate SEO confirmed dead (third time validated).** Every PT-trade, athlete-fitness, and B2B query returned 0–30 vol. PT acquisition is direct-outreach, not SEO. The trade-content stream stays as the credibility workstream documented in `pt-programme.md` Open Item 14, not a Google play.

9. **Andro Prime brand has 20 vol/mo already.** Confirms some PT-referred prospects are Googling the brand. `andro prime reviews` and `andro prime vs medichecks` pages should be built proactively now — they'll rank instantly once brand demand grows.

10. **Commercial supplement queries are bigger than Daily Stack LP currently targets.** `testosterone supplements uk` 1,300, `supplements for joint pain` 1,300, `supplements for tiredness` 1,000, `best supplements for energy` 590 — Daily Stack LP title currently captures none of these. Either reframe the LP or build supporting pages.

### What was killed by this sweep

Documented in CSV as `status=dropped` so future sessions don't re-suggest them. Highlights:

- Most "blood test for [symptom]" framings except hair-loss, fatigue, tiredness — symptom-routing programmatic SEO is only viable for those three
- All ICP3-direct queries (`men's health check uk`, `comprehensive blood test men uk`, `preventative blood test men`) — ICP 3 SEO confirmed dead three times now
- All gym/athlete/PT-trade B2B queries — confirmed third time
- "Recovery from training" / "muscle recovery blood test" framings — Pillar B reframing required (already done)
- Mental health blood tests (`blood test for anxiety/depression`) — low vol + very-high compliance risk

---

## Update protocol

When a new validation run happens (next Semrush trial, after first articles ship and rank, when LP audit surfaces a query, when a new competitor enters the space):

1. **Append rows to `keywords.csv`** — never overwrite, append. Use the same column order.
2. **Update this index** if a new cluster (`assigned_to` value) is added or a finding changes the strategic picture.
3. **Update [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md) pillar tables** if the new queries affect pillar composition. Mark the change in the v-history block at the top.
4. **Mark dropped rows explicitly** — don't delete. Killed queries are a record of work avoided.

---

## Cross-references

- [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md) v2.0 — pillar map and 12-week sequencing (derives from this CSV)
- [`seo-content-context.md`](./seo-content-context.md) — site architecture + Tier 1/Tier 2 narrative summaries (derives from this CSV)
- [`../affiliates/pt-programme.md`](../affiliates/pt-programme.md) Section 12 Item 14 — PT-trade content workstream rationale (informed by `trade` rows being all dropped here)
- [`../../09_website-app/frontend/lp/`](../../09_website-app/frontend/lp/) — landing page directory pending the SEO hygiene pass using commercial-intent rows from this CSV
