# Staging — Feeling-First Classified Keywords

**Created:** 2026-06-26 | **Source:** fresh DataForSEO `suggest` pull (16 seeds × 70), decontaminated + deduped + classified.

## What this is

`keywords-feeling-classified-2026-06-26.csv` — the decontaminated demand set behind the [feeling-first content strategy](../../../master-plan/2026-06-26-feeling-first-content-strategy.md). Each row is a **distinct demand cluster** (not a raw keyword), tagged by the *language a searcher uses*.

601 clusters, built from a 1,120-keyword pull by:
1. **Stripping noise** (150 removed): NHS/booking terms (`swiftqueue`, "book a blood test"), drug/brand names (`numan`, `semaglutide`, `statins`, `amitriptyline`), location modifiers, off-topic (`crossword`, `synonym`), and female/menopause/HRT cuts (out of ICP).
2. **Collapsing variant-inflation** (360 near-duplicate spellings merged): DataForSEO returns one head term as many phrasings, each carrying full volume (e.g. `crp blood test` × 13). Clusters are keyed on a normalised significant-token set, keeping the highest-volume representative.

## Columns

| Column | Meaning |
|---|---|
| `query` | the cluster's representative (highest-volume) phrasing |
| `vol` | UK monthly search volume (DataForSEO Labs) |
| `kd` | keyword difficulty — **DFS scale, NOT Semrush** (see `../README.md`; do not compare across providers) |
| `category` | **`feeling`** (experiential/symptom) · **`clinical`** (test/biomarker/transactional) · **`solution`** (supplement/how-to) · **`other`** |
| `variants` | how many raw spellings collapsed into this cluster |
| `intent` | DFS search-intent label where present |
| `kd_source` | `dfs` |
| `status` | `candidate` — not yet promoted to `keywords.csv` |

## How it feeds the pipeline

This is a **candidate** set, not the master. Per `coverage-rules.md` + the selection loop, terms are promoted into `keywords.csv` (with a pillar tag + `kd_source: dfs`) only after review. Use the `category` tag per the feeling-first doctrine:

- **`feeling`** clusters = entry hooks, hub titles where winnable, and the primary newsletter/ad fodder. The broad, uncontested, premium-amenable surface — prioritise building the missing feeling hubs (weight/belly, stress, sleep, low mood) from here.
- **`clinical`** clusters = SEO rank targets where they are the winnable underserved gap, but framed feeling-first and used as spokes that feeling hubs link down to. Note these carry NHS-shadowed/commodity demand — high volume, low premium-differentiation.
- **`solution` / `other`** = supporting/decision-layer terms.

**Caveat:** several high-volume `feeling` head terms are high-KD (DFS scale) and only winnable on long-tail cuts — run a focused KD/SERP check (`dataforseo.mjs overview` / `serp`) before briefing any as a rank target.

Raw per-seed pulls are in the session scratchpad (uncommitted); this CSV is the durable artifact.
