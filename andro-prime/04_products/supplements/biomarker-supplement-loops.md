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

---

## Supplier availability: SOLVED for every loop (2026-08-20)

**This section was added after the Nutribl catalogue review. It changes what the bottleneck is.**

Until now the unstated assumption behind this doc was that a supplier could be found for whatever loop we picked. The Rawcreation assessment (2026-08-19) showed that assumption was not safe: they could serve **one** loop of four, at half our dose, and could not make an omega-3 product at all (dry powders and capsulates only, no softgels or liquids).

Nutribl can serve **all four**, from stock, at MOQ 10 with a 4 to 5 working day lead time. Prices are Keith's Tier 1 trade rate, 2026-08-20.

| Loop | Product | Trade | Per month | Note |
|---|---|---|---|---|
| **Omega-3 Index → EPA/DHA** | Vegan Omega 3 Algal Oil, 90 softgels (life's®OMEGA) | GBP 9.73 | **GBP 6.49** | 2 softgels give **DHA 400 mg + EPA 200 mg**, so 600 mg combined, comfortably clear of the 250 mg thresholds the heart, brain and vision claims require. Fish-free, non-GMO, triglyceride form |
| same, cheaper | Omega 3 Fish Oils 1000 mg, 90 softgels | GBP 5.40 | **GBP 1.80** | 1 softgel clears the 250 mg EPA+DHA heart claim. Carries the fish allergen the algal version avoids |
| **Kit 5 thyroid → selenium** | Selenium 200 µg, 120 caps | GBP 3.59 | GBP 0.90 | **L-selenomethionine, the correct form.** But 200 µg against our ~100 µg spec, and the diabetes signal at 200 µg is noted above. **Needs a 100 µg run**, which for a single-ingredient capsule is the simplest possible ask |
| **Kit 5 thyroid → iodine** | No standalone | — | — | They use **potassium iodide** in their vegan multivitamin and gummy premixes. That is the specified-dose form this doc wants, and the opposite of Rawcreation's variable-content kelp |
| **Homocysteine → folate** | Methyl Folate Quatrefolic® 600 µg, 90 caps | GBP 6.14 | GBP 2.05 | **5-MTHF**, the active form. Their listing carries the exact claim: "Folate contributes to normal homocysteine metabolism" |
| **Homocysteine → B12** | B12 Methylcobalamin 1 mg, 120 caps | GBP 3.95 | GBP 0.99 | Exact Daily Stack spec. Claim list includes normal homocysteine metabolism |
| **K2 as a D3 enhancement** | D3 3000 IU + K2 100 µg MK-7, 90 caps | GBP 3.64 | GBP 1.21 | The pairing named in the formulation-upgrade note above, already built. Standalone MK-7 also available at GBP 4.32 |

**Do not use their stock Vitamin B Complex for the homocysteine loop.** It uses cyanocobalamin and folic acid, the cheap forms. The point of a homocysteine product is the methylated forms, and they sell both separately.

### The bottleneck has moved to the lab

Every loop now has a product, a price and a lead time. **None of them has a confirmed marker.** The open questions are all with Ben at Vitall:

- **Omega-3 Index on dried blood spot, plus COGS.** This is next-step (a) at the foot of this doc and it has never been done. It is now the only thing between us and the loop this doc ranks strongest. Draft at `05_partners/labs/vitall/correspondence/2026-08-20-keith-omega3-index-and-tsh-feasibility-draft.md`.
- **Kit 5 Thyroid has no spec doc**, despite the sequence being locked 2026-05-27 (`04_products/CONTEXT.md`, Future Kit Roadmap). TSH feasibility is bundled into the same Vitall draft.
- **Homocysteine needs no new lab work.** It is already inside the Kit 3 Plus metabolic stack.

### Two candidates the Nutribl catalogue surfaced that are not in this doc

Neither is a recommendation. Both are flagged for an Ewa ruling.

1. **Lipids → alpha-linolenic acid.** Kit 3 Plus will measure total cholesterol, HDL, LDL, triglycerides and ApoB, and this doc has no loop off any of them. Nutribl's Flaxseed Oil 1000 mg carries an **authorised claim at a stated dose**: "At 4 softgels daily (2 g alpha linolenic acid), ALA contributes to the maintenance of normal blood cholesterol levels." Two problems: 4 softgels a day works out at ~GBP 8.21 a month, the dearest thing we would carry, and "maintenance of normal" is a much weaker proposition than a man with raised LDL is looking for. Psyllium was also considered and fails: their capsules cap out near 3 g a day and the authorised psyllium claim needs roughly 7 g, so it would have to be a powder.
2. **Liver → choline, which contradicts `../kits/liver-health-opportunity.md`.** That doc states the Liver Health Check is not a supplement driver because "no EFSA liver-supplement claim" exists. **Choline carries an authorised claim for the maintenance of normal liver function**, and Nutribl's Liver Support Choline Complex delivers exactly 82.5 mg per serving, the precise threshold that claim requires. The assumption in that doc is therefore wrong and has been bannered there. Caution still applies: our stated route for elevated liver markers is a GP referral, and selling a supplement off a raised ALT is uncomfortable ground. Ewa gate.

### Dead ends re-confirmed against a much larger catalogue

Nutribl stock iron (multivitamin plus iron, iron gummies), several magnesium SKUs, creatine in powder and tablet form, and multiple turmeric products. **None of these change the rulings in the dead-ends table above.** Iron stays a deliberate refusal, magnesium still has no finger-prick marker, creatine still has no biomarker, and turmeric still has no authorised claim, as Nutribl's own listing concedes by marking its turmeric claims on-hold. Their chromium products would technically support a blood-glucose claim, but `../kits/kit-3-plus.md` requires that elevated HbA1c is flagged and referred, never labelled, and a glucose supplement sold off that result reads as treating pre-diabetes. Left alone.

**Supplier detail:** `05_partners/manufacturers/nutribl/outreach-brief.md`.

## Recommendation & next step

**Lead with the Omega-3 Index → Omega-3 loop** — it's the one new loop that clears all five gates with the strongest demand and a built-in retest story, and it opens the cardiometabolic cohort. It's a clean Phase-0, self-funding addition to the supplement range.

Next: (a) confirm with Ben that Vitall runs an Omega-3 Index on dried blood spot + COGS; (b) Ewa sign-off on heart/brain claim framing; (c) decide SKU shape (standalone mini-kit vs Kit 2 add-marker) and add the Omega-3 supplement as the 3rd subscription product.
