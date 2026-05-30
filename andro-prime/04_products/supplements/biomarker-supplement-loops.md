# Biomarker → Supplement Loops (Phase-0 self-sustaining; cohorts port to CQC)

**Created:** 2026-05-30 | **Owner:** Keith | **Status:** Strategy analysis. No product approved.

## The frame (corrected 2026-05-30)

Goal: **biomarker tests that lead onto a supplement range**, self-funding in Phase 0 (no CQC
dependency), where the *cohort* each kit builds can later be ported to the broader CQC service range
(not just TRT). This is the kit → result → EFSA-claimable supplement → retest engine that already runs
for Vit D→D3, B12→Active B12, CRP+joints→Collagen. We want to *extend* it.

**This rules out the peptide/IGF-1 idea** (`reverse-engineered-kit-analysis.md`): it's CQC/prescription-
dependent — the exact delay we're routing around — and has no Phase-0 EFSA supplement. Wrong shape.

## The loop test (five gates)

A new loop must clear all five:
1. **Finger-prick-viable, stable biomarker** (rules out Mg/K haemolysis-sensitive analytes, stool/saliva markers).
2. **EFSA-approved supplement claim** for the product the result triggers (no claim = ashwagandha trap).
3. **Retestable** — the marker moves with supplementation, so the Day-90 retest loop works (churn mechanic).
4. **Real demand** (DataForSEO).
5. **Cohort ports to a future CQC service** — bonus, not justification.

## New loop candidates (ranked)

### 1. Omega-3 Index → Omega-3 (EPA/DHA) supplement — STRONGEST
- **Biomarker:** Omega-3 Index (% EPA+DHA in RBC membrane). The standard test method **is dried blood spot / finger-prick** — stable, postal-viable. Passes gate 1 cleanly. **Highly retestable** (responds to supplementation over ~3–4 months) — ideal for the retest loop.
- **EFSA claims (gate 2 ✅):** EPA+DHA "contribute to normal heart function"; DHA "contributes to maintenance of normal brain function" + "normal vision"; EPA+DHA "contribute to maintenance of normal blood pressure / normal blood triglyceride levels."
- **Demand:** omega 3 33,100 · omega 3 supplement 12,100 · cod liver oil 18,100 · fish oil 8,100 · best omega 3 supplement 3,600. (Test-intent tiny — `omega 3 blood test` 170 — so acquired via the loop + heart/brain content, not test search, like the Daily Stack.)
- **Cohort port:** cardiovascular / healthspan-aware men → future CQC **cardiometabolic** service.
- **Note:** omega-3 was pulled from the Daily Stack (ICP-1/2 language mismatch). This is the opposite move — its *own* test→supplement loop aimed at the heart/brain/healthspan ICP, in Phase 0, not post-CQC. Likely a 3rd supplement SKU + a small "Omega-3 / Heart & Brain" kit or a Kit 2 add-marker.

### 2. Thyroid markers (Kit 5) → Selenium + Iodine "thyroid support"
- **Biomarker → supplement:** Kit 5 (TSH/thyroid) result triggers a selenium+iodine support product — the trigger marker need not be the supplement nutrient (the zinc→normal-T model). 
- **EFSA claims (✅):** selenium + iodine each "contribute to normal thyroid function."
- **Demand:** iodine supplement 4,400 · selenium supplement 3,600 · thyroid support supplement 880/KD0.
- **Cohort port:** → future CQC **thyroid** service.
- **Compliance:** overt hypothyroidism is GP/levothyroxine territory — this is for normal/subclinical optimisation only; abnormal results GP-refer (ferritin-style discipline). Ewa gate.

### 3. Homocysteine (Kit 3 Plus) → B-complex / folate
- **Biomarker → supplement:** elevated homocysteine (already in the Kit 3 Plus metabolic stack) triggers a folate/B6/B12 product.
- **EFSA claims (✅):** folate / B6 / B12 "contribute to normal homocysteine metabolism."
- **Demand:** vitamin b complex 12,100 · folate supplement 6,600 · folic acid 6,600 · homocysteine 4,400.
- **Cohort port:** → future CQC **cardiometabolic** service. Ties an existing planned marker to a supplement loop at near-zero extra cost.

### Formulation upgrade, not a new loop: Vitamin K2
`vitamin k2` 18,100. Pairs with D3 (D3+K2 combo directs calcium; EFSA bone/clotting claims). No clean standalone biomarker — treat as a **D3 product enhancement**, not a new test loop.

## Confirmed dead-ends (the gates working)

| Candidate | Fails on |
|---|---|
| Iron / ferritin | Gate 2 — we deliberately *don't* sell iron (overdose risk, GP-dosed). Doc's ferritin "dead end". |
| Magnesium | Gate 1 — can't be reliably finger-prick tested (haemolysis). |
| Creatine | Gates 1+3 — no biomarker, no baseline, not a deficiency-correction supplement. |
| Peptides / IGF-1 | Wrong shape — CQC/prescription-dependent, no Phase-0 EFSA supplement. |
| Berberine / ashwagandha / turmeric | Gate 2 — no authorised EFSA claim. |

## The strategic payoff: each loop pre-segments a future CQC cohort

| Phase-0 kit → supplement loop | Cohort it builds | Future CQC service it ports to |
|---|---|---|
| Kit 1 → Daily Stack (zinc / T) | Low/normal-T men | TRT |
| Kit 2 → Daily Stack / Collagen | Energy / recovery / inflammation | (general / metabolic) |
| **Omega-3 Index → Omega-3** | Cardiovascular / healthspan | **Cardiometabolic** |
| **Kit 5 thyroid → Selenium/Iodine** | Thyroid / fatigue | **Thyroid** |
| **Kit 3 Plus / homocysteine → B-complex** | Metabolic | **Cardiometabolic / weight** |

The supplement loops fund Phase 0 on their own *and* sort the audience into named cohorts for whichever CQC services launch — exactly the "self-sustaining now, portable later" model.

## Recommendation & next step

**Lead with the Omega-3 Index → Omega-3 loop** — it's the one new loop that clears all five gates with the strongest demand and a built-in retest story, and it opens the cardiometabolic cohort. It's a clean Phase-0, self-funding addition to the supplement range.

Next: (a) confirm with Ben that Vitall runs an Omega-3 Index on dried blood spot + COGS; (b) Ewa sign-off on heart/brain claim framing; (c) decide SKU shape (standalone mini-kit vs Kit 2 add-marker) and add the Omega-3 supplement as the 3rd subscription product.
