# Omega-3 Loop — Test + Supplement Spec (DRAFT)

**Created:** 2026-05-30 | **Owner:** Keith | **Status:** DRAFT spec for review. Not approved, not priced, not built. COGS = estimates pending Ben (test) + manufacturer (supplement).
**Parent:** `biomarker-supplement-loops.md` (why this loop won). Format mirrors `daily-stack.md` / `joint-recovery-collagen.md`.

> **Commercial precedent:** Zinzino's BalanceTest → BalanceOil → retest is exactly this loop and is a large, working business. Validates the model (test omega ratio → sell omega-3 → retest shows it moved).

## 1. The test (biomarkers)

All measured from a **dried blood spot / finger-prick** (the standard method for the Omega-3 Index — postal-viable; confirm with Ben/Vitall).

| Biomarker | What it is | Consumer-facing read |
|---|---|---|
| **Omega-3 Index** | % EPA+DHA in red-cell membranes — the headline number | <4% undesirable · 4–8% intermediate · **>8% optimal** |
| **EPA** | Eicosapentaenoic acid (anti-inflammatory omega-3) | Component of the index |
| **DHA** | Docosahexaenoic acid (brain/structural omega-3) | Component of the index |
| **Omega-6 : Omega-3 ratio** | Dietary balance; Western diets skew ~15:1 vs ideal ~3–4:1 | The "your diet is out of balance" hook |
| **AA : EPA ratio** *(optional)* | Arachidonic acid vs EPA — inflammation balance | Optional advanced marker |

Headline result the customer sees: their **Omega-3 Index %** + their **omega-6:3 ratio**, both retestable in ~3–4 months.

## 2. The supplement it triggers (ingredients + doses)

**Product (provisional): "Andro Prime Omega-3"** — high-strength EPA/DHA.

| Ingredient | Form | Dose (daily, correction) | Why |
|---|---|---|---|
| **EPA + DHA** | Fish oil in **triglyceride (rTG) form** | **~2,000 mg combined** (e.g. ~1,100 EPA / 800 DHA) | rTG absorbs better than cheap ethyl-ester (EE); 2g is the correction dose to lift a low index |
| Vitamin E | d-alpha tocopherol | ~10 mg | Antioxidant — stops the oil oxidising (rancidity) |
| *(Vegan SKU option)* | **Algal oil** (algae-derived EPA/DHA) | match EPA/DHA | Premium/vegan alternative to fish oil |

**EFSA claims by dose (the claim we can make depends on the dose):**
| Claim | Required EPA+DHA/day |
|---|---|
| "contribute to normal heart function" | 250 mg ✅ (easily met) |
| DHA "contributes to maintenance of normal brain function / vision" | 250 mg DHA ✅ |
| "contribute to maintenance of normal blood triglyceride levels" | 2,000 mg (our correction dose meets this) |
| "contribute to maintenance of normal blood pressure" | 3,000 mg (only if dosed up) |

**Result → recommendation mapping (the loop, mirrors the Daily Stack trigger table):**
| Omega-3 Index | Action / dose pushed |
|---|---|
| **< 4%** (undesirable) | Correction dose ~2g/day EPA+DHA + retest in 3–4 months |
| **4–8%** (intermediate) | Standard ~1–2g/day |
| **> 8%** (optimal) | Maintenance ~1g/day, or "hold via oily fish 2–3×/week", retest annually |
| **High omega-6:3 ratio** | Omega-3 + dietary guidance (reduce seed/vegetable oils) |

Compliance: heart/brain claims only at the exact EFSA wording. **Do not** say "reduces inflammation", "prevents heart disease", or "lowers cholesterol" (medicinal claims). Ewa signs off the framing.

## 3. Costings guide (ESTIMATES — confirm before pricing)

### 3a. Test kit (per kit)
| Line | Estimate | Note |
|---|---|---|
| Lab analysis (Omega-3 Index, GC method) + kit + postage + results | **£20–35** | **Confirm with Ben** — fatty-acid GC is pricier than basic biochem (LFTs) but cheaper than hormone immunoassay |
| Suggested retail (standalone mini-kit) | **£49–69** | Benchmark: OmegaQuant ~£45; positioned premium with the supplement loop |
| Gross margin @ £59 | ~£24–39 (40–60%) | In Kit 1/2 margin band |

### 3b. Supplement (per 30-day box, subscription)
| Line | Estimate |
|---|---|
| EPA/DHA rTG oil (2g/day, 60 softgels) | £4.00–8.00 |
| Vitamin E + softgel encapsulation | £0.50–1.00 |
| Packaging + labels | £1.50–2.50 |
| Fulfilment (pick/pack/ship) | £2.00–3.50 |
| **Total COGS** | **~£8–15** (blended ~£11) |
| Suggested retail (subscription) | **£24.95–29.95/mo** (aligns with Collagen £29.95) |
| Gross margin @ £27.95 | ~£17 (≈60%) |

### 3c. Bundle / loop economics
- Test once (£59) → convert to supplement subscription (£27.95/mo) → retest at ~£10% off (subscriber loop) at month 3–4.
- Vegan algal-oil SKU costs more (algal EPA/DHA is pricier than fish oil) — price ~£5 higher or hold as a premium tier.

## 4. Open questions before build
1. **Ben/Vitall:** can they run the Omega-3 Index (EPA/DHA %, omega-6:3 ratio) on dried blood spot, and at what COGS? Same 2–5 day SLA? New shortCode?
2. **Manufacturer:** quote a 2g/day EPA+DHA rTG softgel (60-count) at MOQ; vegan algal option cost.
3. **Ewa:** sign off the heart/brain claim framing + the result→dose recommendation logic.
4. **SKU shape:** standalone "Omega-3 / Heart & Brain" mini-kit vs an add-marker on Kit 2 — and Omega-3 as the 3rd subscription supplement after Daily Stack + Collagen.
