---
brief: pillar-I-hub
target_query: UNDECIDED — hba1c FAILED the SERP gate; choose cholesterol vs apob anchor (Keith decision below)
slug: TBD (cholesterol-test | apob-test | metabolic-health)
vol_uk: null
kd_dfs: null
kd_semrush: null
intent: informational
icp: ICP 2 (active 35-50) + ICP 3 (preventative 40+)
kit_funnel: EMAIL CAPTURE now → Kit 3 Plus on launch (no live product carries a metabolic panel)
sequence: new pillar I — queue after Liver hub (per pillar-architecture-rerank-2026-06-18.md)
compliance_gate: Medium (cholesterol/ApoB framing) — was Med-High under the dropped hba1c/diabetes anchor
status: queued — SERP gate run, ANCHOR DECISION PENDING KEITH
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-06-18
source: pillar-architecture-rerank-2026-06-18.md
serp_gate: hba1c FAILED 2026-06-18 (see below); cholesterol contested; apob underserved
---

# Pillar I hub — Metabolic health (QUEUED — anchor decision pending)

> Queued from the 2026-06-18 pillar re-rank. The SERP gate has been run and **changed the picture**: the
> high-volume `hba1c` anchor is not viable. This brief now needs ONE Keith decision (anchor) before it can go
> to the full 21-section template. Not brief-ready until that's made.

## Why this pillar
Metabolic / cardiometabolic health (cholesterol, ApoB, blood sugar, visceral fat) is a core men's-40+ concern
with no current Andro Prime pillar. The question the gate settled is *which door* to enter it through.

## SERP gate RESULT (2026-06-18) — hba1c is OUT as the anchor
Ran DFS UK SERP on the three candidate anchors:
- **`hba1c` (40,500) — FAIL.** SERP is 100% diabetes-condition territory: Diabetes UK (#1 + AI Overview), NIH,
  and diabetes charities top-to-bottom. To rank we'd have to be a diabetes content piece — **off-brand** (Andro
  Prime isn't a diabetes service) and **high-compliance** (HbA1c is the diabetes diagnostic). Demoted to a
  spoke (CSV row set `deferred`). Do not anchor here.
- **`cholesterol test` (9,900) — contested.** NHS (#1+AIO), HEART UK, BHF (strong charities) + many private-lab
  pages. Winnable on the men's angle but not a clean gap; also `cholesterol test` is currently a **Pillar D**
  row (#64) → cross-pillar reassignment needed if used.
- **`apob test` (590, KD13) — UNDERSERVED (the real gap).** SERP is US clinical sites (Cleveland, Harvard) +
  lab product pages, **zero UK men-specialist, zero consumer editorial.** ApoB is the on-brand differentiator
  ("the cardiovascular marker your standard cholesterol test and the NHS miss"). Low volume, but exactly the
  "better than NHS / optimisation" positioning. The catch: 590/mo can't carry a hub alone.

## ⟶ DECISION FOR KEITH (the one blocker)
Pick the Pillar I anchor + framing:
- **Option A (recommended): "Cardiometabolic" hub anchored on `cholesterol test`, ApoB as the hero
  differentiator.** Captures the 9,900 volume, leads with the ApoB "what your cholesterol test misses" wedge
  (the underserved gap), folds HbA1c in as a blood-sugar spoke. **Requires reassigning `cholesterol test`
  (row 64) from Pillar D → Pillar I** (coverage-rules §4 — a deliberate reassignment, your call). Compliance
  drops to **Medium** (cholesterol is mainstream wellness vs hba1c/diabetes). Best volume-with-defensibility.
- **Option B: ApoB-anchored "advanced lipids" hub.** Cleanest underserved win + strongest brand fit, but
  ~590/mo head term — relies on the broader lipid cluster (cholesterol blood test 2,400, etc.) for volume.
- **Option C: keep hba1c.** Not recommended — diabetes SERP, off-brand, highest compliance.

Until this is chosen, the slug/anchor/vol/KD/compliance can't be locked and the 21-section brief can't be written.

## Validated cluster (DataForSEO, UK/en, 2026-06-18)
| Query | Vol | DFS KD | Role |
|---|---:|---:|---|
| hba1c | 40,500 | 22 | provisional primary (pending SERP gate) |
| hba1c test | 18,100 | 25 | variant / spoke |
| hba1c normal range | 14,800 | 22 | "what's normal" H2 |
| cholesterol test | 9,900 | 26 | alt-anchor / strong spoke |
| visceral fat | 18,100 | 55 | **hook only — not a rank target** |
| how to lower hba1c | 590 | 0 | ⚠️ treatment-claim risk — frame as evidence summary, not a how-to-treat |

Calculator/converter long-tail (hba1c converter, mmol/mol↔%) is high-volume but tool-intent — consider a
small interactive tool, not hub body.

## Product routing
No live kit carries a metabolic panel → **CTA = email capture / waitlist now**, flip to Kit 3 Plus on launch.

## Compliance gate — depends on the anchor decision
- **Option A/B (cholesterol / ApoB): Medium.** Cholesterol/lipid testing is mainstream consumer wellness.
  Hard rules: never diagnose; no statin/treatment advice; cardiovascular-risk framing must be sourced; any
  `how to lower`-style content is an *evidence summary*, not a treatment guide; visceral-fat language is a hook
  only (no weight-loss claims); EFSA-only on supplements. Ewa sign-off mandatory.
- **Option C (hba1c): Medium-High.** HbA1c is the diabetes diagnostic — closer to Pillar C's risk. Not
  recommended (see decision).

## To reach brief-ready (gates)
1. ~~**SERP underserved-gap check**~~ — **DONE 2026-06-18** (hba1c failed; cholesterol contested; apob underserved).
2. **⟶ KEITH ANCHOR DECISION (the blocker)** — Option A / B / C above. Everything downstream depends on it.
3. **If Option A:** confirm reassigning `cholesterol test` (row 64) Pillar D → Pillar I (coverage-rules §4).
4. **Lock the CSV cluster** to the chosen anchor (set `primary_article_slug` + `coverage_status=briefed`).
5. **Ewa compliance read** on the chosen framing.
6. Expand to the full 21-section hub template.
