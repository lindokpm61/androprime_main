# Portfolio Demand & Gap Map — Kits + Supplement Loops

**Created:** 2026-05-30 | **Owner:** Keith | **Status:** Single source of truth for product demand + gap. Consolidates the fragmented analyses from this session into one non-fragmented map.

## Methodology & known bias (read this first)

**This map is product-anchored validation, not unbiased market discovery.** The search seeds came from *our* side — our markers, ingredients and product areas — then were sized + expanded with real DataForSEO queries. So it answers "how much demand exists for the things we already make / have considered, and where are the gaps around them" — NOT "what is the men's-health market actually searching for, unprompted, that we haven't thought of."

**The bias:** confirmation/coverage of the existing portfolio. Real customers search in **symptom and plain language** ("always knackered", "no sex drive", "can't shift belly fat", "brain fog"), not in biomarker/product terms. We have that vocabulary documented (ICP language, tone-of-voice voice-samples) but did **not** drive this demand pull from it.

**Partial mitigation:** the earlier Pillar/keyword work in `keywords.csv` (Semrush, May 2026) *was* more demand-first and symptom-inclusive (it surfaced "why am i always tired" 12,100 and the inflammation cluster bottom-up). This map is the product-anchored layer on top of that.

**De-bias step — DONE 2026-05-30:** the product-agnostic, symptom-first discovery pass is complete — see `discovery-symptom-first.md`. Headline: men search *symptoms* (belly/visceral fat ~40k, brain fog 14,800, "male with low testosterone symptoms" 12,100, male menopause ~10k, low sex drive, night sweats men 8,100), not our clinical/product terms. Mostly a *vocabulary/hook* gap — re-hook existing kits in symptom language (Kit 3 Plus → "belly fat"; Kit 1 → "low sex drive / male menopause"; Kit 2 → "brain fog / always tired"). This map (product-anchored) + that doc (demand-first) together are the complete picture.

## How to read this

- One row per **kit** and per **supplement loop**, current + imminent + parked + rejected.
- **Demand** = best *populated* anchor query (UK monthly volume). Source tagged: **[D]** DataForSEO (2026-05-30), **[S]** Semrush (May 2026). Where DataForSEO's Google-Ads feed returns null for a grouped term, the populated variant or the [S] figure is used — **null ≠ zero demand.**
- **KD** is **DataForSEO scale unless tagged [S]** — the two scales are NOT comparable; don't sort across them.
- **Gap** = SERP-validated underserved-ness (who owns the SERP) + product/model gap.
- Detail lives in the per-product docs (cross-referenced at the foot); this map is the index + the numbers on one page.

## Kits

| Kit | Status | Anchor biomarker(s) | Demand (anchor) | KD | Gap / SERP verdict | Payoff loop | Future CQC cohort |
|---|---|---|---|---|---|---|---|
| **Kit 1 Testosterone** £99 | Live | Total T, SHBG, FAI, albumin, free T | testosterone supplement 14,800 [D] · booster 27,100 [D] · "testosterone test uk" 3,600 [S] (DFS nulls the bare term) | 14–24 | **Contested** — Numan/Manual own TRT/booster SERPs | Daily Stack (zinc) | TRT |
| **Kit 2 Energy & Recovery** £119 | Live | Vit D, Active B12, hs-CRP, ferritin | low vit-D symptoms 9,900 [S] · ferritin blood test 8,100 [D] · crp blood test 27,100 [D] · blood test for tiredness [S, KD11] | 8–12 | **Strong / underserved** (CRP cluster, vit-D) | Daily Stack (D3, B12), Collagen | cardiometabolic |
| **Kit 3 Hormone & Recovery** £179 | Live | Kit 1 + Kit 2 (9 markers) | mens health blood test 210 [D] · general health blood test 260 [D] | 6 | **Weak standalone demand → confirms Kit-1-upsell repositioning** | (cross-sell) | — |
| **Kit 3 Plus (metabolic)** ~£239 | Imminent (T+1–2wk) | + HbA1c, insulin, glucose, lipids, ApoB, homocysteine, **+liver** | hba1c blood test 12,100 [S] · cholesterol test 9,900 [D] · apob test 880 [D] | 12–46 | **Underserved** — no UK men's metabolic specialist | B-complex (homocysteine); lifestyle | cardiometabolic / weight |
| **Liver Health Check** ~£45–55 | Proposed (hybrid) | ALT, ALP, GGT, bilirubin, total protein, albumin, globulin | liver function blood test 18,100 [D] (~50k cluster) | 18 | **Strong / underserved** — charity+US+NHS, no UK men's specialist, Medichecks #12 | (data product; lifestyle) | cardiometabolic |
| **Kit 5 Thyroid** | Imminent (T+6–8wk) | TSH, FT4, FT3, TPO | serum tsh levels 22,200 [D] · tsh levels 8,100 [D] · private thyroid test 880 [S, KD11] | 37–41 | **Underserved** (private thyroid test KD11) — *women-skew framing caveat* | Selenium + Iodine | thyroid |
| **Kit 6 Cortisol** | Parked (sampling gated) | Cortisol (±DHEA-S) | cortisol test 6,600 [D] · symptoms of high cortisol 12,100 [D] · cortisol blood test 2,900 [D] | 12–18 | Demand strong; SERP = US authority symptom content | (no EFSA supplement — see note) | (stress/adrenal) |
| **IGF-1 / GH axis** | Parked — **post-CQC only** | IGF-1 | igf-1 6,600 [D]; "igf-1 test" 390 [D] | 23 | Topic huge (peptides 90,500) but **CQC-dependent — wrong shape for Phase 0** | post-CQC Rx peptides | peptide service |

## Supplement loops

| Supplement | Status | Trigger biomarker | Demand (anchor) | KD | Gap verdict | EFSA claim |
|---|---|---|---|---|---|---|
| **Daily Stack** £34.95 | Live | Kit 1 normal-T / Kit 2 low D / low B12 | zinc supplement 14,800 [D] · vit-D supplement 22,200 [D] | 15–38 | Sold by funnel, **not** SEO (bundle terms weak: mens multivitamin 1,600) | zinc/D/B12 all ✅ |
| **Joint & Recovery Collagen** £29.95 | Live | hs-CRP + joint symptoms | collagen supplement 74,000 [D] · collagen for men 2,400 [D] | 14 / 6 | **Strong + low-KD, men's angle wide open** — best validated supplement | Vit C → collagen ✅ |
| **Omega-3 (EPA/DHA)** | Proposed (lead new loop) | Omega-3 Index (DBS) | omega 3 33,100 [D] · cod liver oil 18,100 [D] · vegan omega 3 3,600 [D, KD0] | 0–46 | **Model gap, not search gap** — test fragmented (Medichecks/Thriva, no loop), supplement commodity (Amazon/Boots), Zinzino=MLM. Foothold = vegan/algal | EPA/DHA → heart/brain ✅ |
| **Selenium + Iodine (thyroid)** | Proposed (w/ Kit 5) | Kit 5 thyroid result | iodine supplement 4,400 [D] · selenium 3,600 [D] | 16–18 | Tied to Kit 5; zinc-style trigger | selenium/iodine → thyroid function ✅ |
| **B-complex / folate** | Proposed (w/ Kit 3 Plus) | Elevated homocysteine | vitamin b complex 12,100 [D] · folate 6,600 [D] | 13–20 | Near-zero extra cost (marker already planned) | folate/B6/B12 → homocysteine ✅ |
| Vitamin K2 (D3 enhancement) | Option | (pairs with D3) | vitamin k2 18,100 [D] | 47 | No standalone biomarker — formulation add to D3 | Vit K → bone ✅ |

## Rejected loops (the gates working — recorded so they're not re-litigated)

| Candidate | Demand | Fails on |
|---|---|---|
| Creatine | 201,000 [D] | No biomarker, no baseline, not deficiency-correction → can't carry the data model. Separate performance line or skip. |
| Magnesium | 60,500 [D] | Can't be reliably finger-prick tested (haemolysis). Hard analytical limit. |
| Iron supplement (off ferritin) | ferritin 8,100 | Overdose risk, GP-dosed — deliberate "dead end", route to GP. |
| Berberine | 90,500 [D] | No authorised EFSA claim. |
| Ashwagandha (as hero) | 165,000 [D] | No EFSA claim — silent ingredient (already in Daily Stack, unmentionable). |
| Turmeric / Tongkat ali | 6,600 / null | No authorised EFSA claim. |
| Peptides (BPC-157 etc.) | bpc-157 40,500 [D] | Prescription/CQC, MHRA advertising ban. Post-CQC only. |

## Cross-cutting takeaways

1. **Two distinct gap types.** Most kits have a *search* gap (underserved SERP we can rank into: liver, CRP/inflammation, metabolic, thyroid). Most *supplements* have a *model* gap, not a search gap (commodity SERPs) — they're sold by the funnel, never by supplement SEO. Collagen is the exception (real low-KD supplement demand).
2. **Strongest underserved search gaps (rank-into):** liver (18,100/KD18), CRP/inflammation (27,100/KD11), metabolic (cholesterol 9,900, hba1c 12,100), thyroid (private thyroid test KD11). These are the content + kit priorities.
3. **Kit 3 standalone demand is genuinely weak** (mens health blood test 210) — the data backs the 2026-05-26 repositioning to a Kit-1 upsell.
4. **Testosterone is the most contested** space (Numan/Manual). We compete on data-led credibility, not on out-ranking them.
5. **Self-sustaining engine = the supplement loops** (Daily Stack, Collagen, +Omega-3), each pre-segmenting a future CQC cohort. Peptides/IGF-1 sit outside Phase 0.

## Source docs (detail behind each row)

- `competitor-organic-teardown.md` — competitor content/biomarker landscape + link model
- `keyword-expansion-shortlist.md` + `keyword-expansion-staging.csv` — the 364-row sweep
- `keywords.csv` — master keyword universe (liver head + spokes seeded under `future-kit-liver`)
- `../../04_products/kits/liver-health-opportunity.md` · `kit-3-plus.md` · `reverse-engineered-kit-analysis.md`
- `../../04_products/supplements/supplement-demand-analysis.md` · `biomarker-supplement-loops.md` · `omega-3-loop-spec.md`
- `../../04_products/kits/` (current kit specs) · memory `project-future-kit-opportunities`
