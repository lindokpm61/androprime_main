# Competitor Organic Teardown — DataForSEO, UK, 2026-06-21

**Single-source rebuild** (per `seo-data-rebuild-build-doc.md`, Phases 1–2). Replaces the metrics in
`competitor-organic-teardown.md` (May 2026, Semrush — now historical). Method, data and the backlog
below are all DataForSEO. Competitors: **Medichecks, Thriva, Forth, Vitall.**

**Method:** Labs `relevant_pages` (top pages by organic ETV) + `ranked_keywords` per domain; the gap =
every keyword a competitor ranks for that `andro-prime.com` does not (union across all four), filtered
for clinical/brand/female-specific terms and volume ≥ 500. Tooling: `tools/dataforseo.mjs`
(`teardown` / `gap`). Total pull cost ~$0.50.

---

## Headline finding

**The biomarker-explainer glossary is still the organic engine for every diagnostics competitor** —
reconfirmed on fresh DFS data, not just the Semrush snapshot. The gap surfaces **544 keywords** we
don't rank for, and they cluster hard around **blood-marker explainers** — which is precisely the
Pillar D play already in flight. The single biggest discrete find is a **full-blood-count red-cell-index
sub-glossary** (MCHC / MCH / MCV / haematocrit) that ladders directly under our in-flight FBC article.

---

## Competitor content maps (top pages by organic ETV)

**Medichecks — by far the strongest footprint.** Homepage ETV 51,549; `testosterone-blood-test`
product 27,248. Engine = testosterone (product + education: "normal testosterone level for your age"
6,211) **plus a deep biomarker glossary** (ALT, folate, ALP, bilirubin, GGT, albumin, creatine kinase,
oestrogen, prolactin).

**Thriva — `/hub/` explainer model.** Liver-function hub leads ("what is bilirubin" 7,305; gamma-GT;
albumin; how-to-test-liver-function) + "foods high in iron" 2,965, high cortisol, folate, male
menopause. Heavy women's-health tilt.

**Forth — biomarker-code page engine.** `/our-service/biomarkers/` pages dominate (HbA1c/MCGL 11,884;
ALP, GGT, urea, ferritin, ALT, albumin, HDL, cholesterol, TSH, FSH) + **UK-statistics linkbait**
("UK cholesterol statistics" 1,119) — the digital-PR backlink tactic, reconfirmed.

**Vitall — organically negligible.** Homepage ETV **267** (vs Medichecks' 51,549 — ~190× smaller).
Topics overlap (cortisol, testosterone, FBC, cholesterol, liver) but the footprint is tiny.
**Implication: Vitall is a product/brand competitor, NOT an SEO competitor — deprioritise them in
search strategy** (they remain a strategic competitor per `project_vitall_competitor_pivot`).

---

## The gap backlog — top clusters (full list: `teardown-gap-backlog-2026-06-21.csv`, 544 rows)

1. **FBC red-cell-index sub-glossary (biggest discrete find).** MCHC, MCH, MCV, haematocrit/PCV —
   each 5,400–12,100, many spelling variants. All ladder under "full blood count" — i.e. **spokes off
   our in-flight FBC article.** A whole low-competition cluster we'd never have seeded from the CSV.
2. **Biomarker explainers (Pillar D/H/I core).** bilirubin levels 8,100; GGT 6,600; ferritin 5,400;
   "what is cholesterol" 9,900; triglyceride levels 6,600; folate B9 4,400; cortisol test 6,600.
3. **Test head terms.** "blood work test" 49,500 (⚠️ US spelling — UK intent check needed before
   chasing); testosterone tests 22,200; "blood for crp test" 27,100 (reinforces the live CRP hub).
4. **Symptom / condition.** hormonal imbalance 9,900; high cortisol level 8,100.

---

## What this changes / confirms

1. **Validates the three in-flight D-spokes** (ferritin / fbc / b12) on fresh data — and reveals FBC
   should fan out into the red-cell-index sub-glossary (cluster 1), not ship as a single page.
2. **Reconfirms the biomarker-glossary strategy** (Pillar D core, H/I/J expansion) — same direction as
   the Semrush teardown, now single-source DFS, so it can drive priority without provider-mixing.
3. **Forth's biomarker-code + UK-stats-linkbait model** holds → the digital-PR play (post-launch) is
   still the link strategy.
4. **Drop Vitall from SEO competitor tracking** — keep for product/brand only.

---

## Caveats (before this feeds selection — Phases 3–4)

- **Residual noise in the 544:** a brand term slipped through ("forth"), near-duplicate spelling
  variants inflate the FBC cluster (MCHC ×8 spellings), and a few off-topic terms ("nightshades",
  "high-intensity exercise"). The list is a **raw backlog**, not a final plan — it needs the Phase-3
  dedup/relevance pass (reuse `keyword-scout.ts` filters) and **Phase-4 DFS KD** before priority.
- **"blood work" is US spelling** — confirm UK search intent/volume before treating the 49,500 as real
  UK demand.
- Volumes here are DFS Labs (ranked_keywords); KD not yet pulled — that's Phase 4.

---

*Phase 1–2 of the single-source rebuild. Next: Phase 3 (assemble + dedup the universe) → Phase 4
(DFS vol/KD) → Phase 5 (SERP/AIO) → Phase 6 (GEO). See `seo-data-rebuild-build-doc.md`.*
