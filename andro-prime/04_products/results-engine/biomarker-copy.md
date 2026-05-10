# Biomarker Copy — Results Dashboard

**Version:** 1.0
**Date:** 2026-04-25
**Status:** Draft — requires Dr Ewa Lindo clinical sign-off before publishing
**Used in:** `/app/dashboard` post-results state, per biomarker result card
**Card spec:** `09_website-app/docs/screen-specs/biomarker-result-card.md`
**Qualifier spec:** `09_website-app/docs/screen-specs/qualifier-card.md`

---

## How to Use This File

Source of truth for all copy in the customer results dashboard. Maps to the 5-part card structure in `biomarker-result-card.md`.

**Part 1** (result number, unit, range indicator) is data display only — no copy lives here for Part 1.

**Parts 2–5** are copy-driven. Each section below documents copy by biomarker and result state, using `CODE` state identifiers for implementation.

**Compliance rules in force:**
- Use "Your results indicate..." not "You have..."
- Do not use "diagnose," "treat," or "cure"
- Supplement recommendations must use only EFSA-approved claim wording (see `/03_compliance/CONTEXT.md`)
- Founding-member CTA fires only when Total T < 12 nmol/L — never on Kit 2 energy markers alone. Mechanic is a non-cash opt-in (founding-member list).
- hs-CRP elevated: Parts 4–5 replaced by qualifier card (see `qualifier-card.md`)
- Do not mention Ashwagandha

**B12 note:** Active B12 (Holotranscobalamin) is confirmed on the Kit 2 and Kit 3 panels via Vitall. The threshold is 37.5 pmol/L. The Daily Stack contains Methylcobalamin 1,000mcg — EFSA-approved claims are "contributes to normal energy-yielding metabolism" and "contributes to normal psychological function."

---

## Biomarker Index

| # | Biomarker | Kits | States |
|---|-----------|------|--------|
| 1 | [Total Testosterone](#1-total-testosterone) | Kit 1, Kit 3 | T-LOW / T-MID / T-HIGH |
| 2 | [SHBG](#2-shbg) | Kit 1, Kit 3 | SHBG-LOW / SHBG-NORMAL / SHBG-HIGH |
| 3 | [Free Testosterone](#3-free-testosterone) | Kit 1, Kit 3 | FT-LOW / FT-NORMAL |
| 4 | [Albumin](#4-albumin) | Kit 1, Kit 3 | ALB-LOW / ALB-NORMAL |
| 5 | [Vitamin D](#5-vitamin-d) | Kit 2, Kit 3 | VD-CRITICALLY-LOW / VD-LOW / VD-NORMAL |
| 6 | [Active B12](#6-active-b12) | Kit 2, Kit 3 | B12-LOW / B12-NORMAL |
| 7 | [hs-CRP](#7-hs-crp-inflammation) | Kit 2, Kit 3 | CRP-NORMAL / CRP-MILD / CRP-MODERATE / CRP-HIGH |
| 8 | [Ferritin](#8-ferritin) | Kit 2, Kit 3 | FER-CRITICAL / FER-LOW / FER-NORMAL |

---

## 1. Total Testosterone

**Kits:** Kit 1, Kit 3
**Unit:** nmol/L
**Reference range:** 10–35 nmol/L
**Dashboard card order:** Position 1 (when present, always first)

| State | Threshold |
|-------|-----------|
| `T-LOW` | < 12 nmol/L |
| `T-MID` | 12–20 nmol/L |
| `T-HIGH` | > 20 nmol/L |

---

### Part 2 — WHAT THIS MEANS

**`T-LOW` (< 12 nmol/L)**

> Your total testosterone is below the level considered optimal for adult men. Levels in this range are associated with the symptoms many men describe — persistent fatigue, reduced drive, difficulty maintaining muscle — though individual response varies and other factors can contribute. This result warrants attention.

**`T-MID` (12–20 nmol/L)**

> Your total testosterone is within the normal range, sitting in the lower half. This is common for men in their late thirties and forties — it is not deficient, but it is not in the upper zone either. Many men in this range feel functional but not fully themselves, particularly as levels continue their natural gradual decline.

**`T-HIGH` (> 20 nmol/L)**

> Your total testosterone is in the upper zone of the normal range. This is a strong result. The symptoms most commonly associated with low testosterone are unlikely to be explained by your hormone level at this reading.

---

### Part 3 — THE EVIDENCE

*(Same for all T states)*

> Testosterone is the primary male sex hormone. It affects energy, mood, sleep quality, body composition, libido, and the ability to build and maintain muscle. Levels decline naturally from the mid-thirties — roughly 1–2% per year on average. The reference range is 10–35 nmol/L, which represents a 3.5-fold difference between the floor and the ceiling. Where you sit in that range matters for how you feel day to day — not just whether you are technically deficient. Most GP panels flag only results below 10 nmol/L. That is the clinical floor, not a target.

---

### Part 4 — WHAT WE RECOMMEND

**`T-LOW` (< 12 nmol/L)**

> Your testosterone is below the level where lifestyle changes and supplements alone are likely to make a meaningful difference. The most clinically effective intervention at this level is Testosterone Replacement Therapy, which requires clinical assessment and a prescription. We are building that service. Men who register now secure their place at the front of the queue when it launches.

**`T-MID` (12–20 nmol/L)**

> Your testosterone is in range but towards the lower end. Zinc is the most well-evidenced mineral for maintaining normal testosterone levels, and most UK men fall short of the optimal daily intake from diet alone. The Daily Stack provides 30mg of elemental zinc alongside Vitamin D3 and Active B12 (Methylcobalamin), which support the broader systems your testosterone depends on.

**`T-HIGH` (> 20 nmol/L)**

> Your testosterone is in a strong zone. No intervention is indicated for this marker. Testing again in 3–6 months will confirm it is staying there — a second reading gives you a trend, not just a snapshot.

---

### Part 5 — CONVERT

**`T-LOW`**

Primary CTA: `SECURE YOUR PLACE →`
*(Founding-member list flow — non-cash email opt-in)*

Secondary section heading: `WHILE YOU WAIT — SUPPORT THE BASICS`

Secondary body:
> These won't replace TRT — and we will be straight about that. But Zinc, Vitamin D, and Active B12 are three of the building blocks your body needs to function as well as it can while you wait. Most men with low testosterone are below optimal on at least two of them.

Secondary CTA: `DAILY STACK — £34.95/MO →`

Compliance note: *Supplements support general health. They do not treat or diagnose any medical condition.*

---

**`T-MID`**

Primary CTA: `BUY DAILY STACK — £34.95/MO →`

Compliance note: *Supplements support general health. They do not treat or diagnose any medical condition.*

---

**`T-HIGH`**

No CTA shown. Retest section displayed at bottom of dashboard (see `dashboard-screen.md` Section 4).

---

---

## 2. SHBG

**Kits:** Kit 1, Kit 3
**Unit:** nmol/L
**Reference range:** 17–55 nmol/L
**Dashboard card order:** Position 2 (immediately after Total Testosterone when both present)

| State | Threshold |
|-------|-----------|
| `SHBG-LOW` | < 17 nmol/L |
| `SHBG-NORMAL` | 17–55 nmol/L |
| `SHBG-HIGH` | > 55 nmol/L |

---

### Part 2 — WHAT THIS MEANS

**`SHBG-LOW` (< 17 nmol/L)**

> Your SHBG is below the normal range. Low SHBG means a greater proportion of your testosterone is circulating unbound, which sounds positive but can be associated with metabolic changes including insulin resistance. In isolation, a low SHBG reading is worth noting alongside your full testosterone picture rather than acting on alone.

**`SHBG-NORMAL` (17–55 nmol/L)**

> Your SHBG is within the normal range. It is binding and releasing testosterone at a typical rate. This means your free testosterone should be in proportion to your total testosterone — check your Free T result for confirmation.

**`SHBG-HIGH` (> 55 nmol/L)**

> Your SHBG is above the normal range. SHBG is a protein that binds to testosterone and makes it biologically unavailable — your body cannot use what is locked up. A high SHBG means a greater proportion of your total testosterone is bound and inactive. Even if your total testosterone appears acceptable, elevated SHBG can mean your body is not accessing as much of it as it should. Your Free T result reflects this directly.

---

### Part 3 — THE EVIDENCE

*(Same for all SHBG states)*

> Sex Hormone Binding Globulin is a protein produced primarily in the liver. It binds tightly to testosterone — and to oestradiol — and carries them through the bloodstream. Testosterone bound to SHBG is biologically inactive. Only the free, unbound fraction can enter cells and have an effect. SHBG levels increase with age, which is one reason why some men experience low-testosterone symptoms even when their total testosterone appears in range. Elevated SHBG can also be associated with thyroid changes, liver function, and some medications. It does not have a direct fix — it is a marker that informs how you interpret your total and free testosterone together.

---

### Part 4 — WHAT WE RECOMMEND

**`SHBG-LOW` (< 17 nmol/L)**

> Low SHBG in isolation does not require a specific action. The combined picture of your total testosterone and free testosterone is what matters. If your free testosterone is within the reference range, this result does not need immediate follow-up. If you notice it trending lower on future tests, or if you have specific symptoms, it is worth discussing with a GP.

**`SHBG-NORMAL` (17–55 nmol/L)**

> Your SHBG is not limiting your testosterone access. No action is needed for this marker. It is a useful baseline to track over time alongside your total and free testosterone.

**`SHBG-HIGH` (> 55 nmol/L)**

> Elevated SHBG is reducing the proportion of testosterone your body can actively use. If your free testosterone is below range as a result, this is the most likely cause. There are no supplements with an established basis for lowering SHBG directly. If your free testosterone is also below range and your total testosterone is low, this combination is worth discussing with a doctor.

---

### Part 5 — CONVERT

**All SHBG states:** No direct product CTA for SHBG in isolation.

If `T-LOW` is also present, Total Testosterone conversion logic takes precedence and covers the full card.

---

---

## 3. Free Testosterone

**Kits:** Kit 1, Kit 3
**Unit:** nmol/L (Vermeulen-calculated from Total T and SHBG)
**Reference range:** Per Vitall lab report
**Dashboard card order:** Position 3 (immediately after SHBG when present)

| State | Threshold |
|-------|-----------|
| `FT-LOW` | Below lab reference range |
| `FT-NORMAL` | Within lab reference range |

*Note: Free testosterone is calculated from Total T and SHBG values. No separate sample is required. The reference range displayed is the lab-reported range for the Vermeulen calculation method.*

---

### Part 2 — WHAT THIS MEANS

**`FT-LOW`**

> Your free testosterone is below the reference range. This is the fraction your body can actually use — it is what enters your cells and drives the effects most people associate with testosterone: energy, drive, mood, and muscle function. A low free testosterone reading, regardless of where your total testosterone sits, indicates your body is accessing less active testosterone than it should be.

**`FT-NORMAL`**

> Your free testosterone is within the reference range. This is the testosterone your body can actually use, and yours is in the expected zone. Taken together with your total testosterone and SHBG, this is the most meaningful read on your hormonal status.

---

### Part 3 — THE EVIDENCE

*(Same for all FT states)*

> Most testosterone in the blood is bound to proteins — primarily SHBG and albumin. Only around 2–3% is free and immediately available to your cells. This free fraction drives the physiological effects testosterone is known for: mood, energy, libido, muscle synthesis, and body composition. Total testosterone gives you the overall pool size. Free testosterone tells you how much is actually accessible. When SHBG is elevated, total testosterone can look acceptable while free testosterone is insufficient — the two figures together give the clearest picture of your hormonal status.

---

### Part 4 — WHAT WE RECOMMEND

**`FT-LOW` with `T-LOW`**

> Your free testosterone is below range, and your total testosterone is also low. This combination is more significant than either in isolation. The most appropriate next step is clinical assessment for Testosterone Replacement Therapy, which addresses the underlying hormone level rather than just the downstream binding. We are building that service now.

**`FT-LOW` with `T-MID` or `T-HIGH`**

> Your free testosterone is below range despite your total testosterone being within normal limits. The most common reason for this pattern is elevated SHBG, which binds a higher-than-expected proportion of your available testosterone. There are no direct supplement interventions for this — it is worth discussing with a doctor if you are experiencing symptoms that align with low testosterone.

**`FT-NORMAL`**

> Your free testosterone is within the reference range. No action is needed for this marker. A second test in 3–6 months will confirm the picture is consistent over time.

---

### Part 5 — CONVERT

**`FT-LOW` with `T-LOW`:** Founding-member CTA (from Total T card logic — not duplicated here).

**`FT-LOW` with normal Total T:** No product CTA. GP note only.

**`FT-NORMAL`:** No CTA.

---

---

## 4. Albumin

**Kits:** Kit 1, Kit 3
**Unit:** g/L
**Reference range:** 35–50 g/L
**Dashboard card order:** Position 4 (after Free Testosterone; only shown as a full card when flagged low — normal results appear in the summary table only)

| State | Threshold | Flag |
|-------|-----------|------|
| `ALB-LOW` | < 35 g/L | L |
| `ALB-NORMAL` | 35–50 g/L | — |

*Note: Albumin is measured primarily as a calculation input for Free Testosterone (Vermeulen formula). It binds testosterone with lower affinity than SHBG, and both values together determine how much testosterone is biologically available. A normal albumin result requires no copy beyond the summary table.*

---

### Part 2 — WHAT THIS MEANS

**`ALB-LOW` (< 35 g/L)**

> Your albumin is below the normal range. Albumin is a protein produced by the liver and is one of the inputs used to calculate your free testosterone. A result below 35 g/L is worth discussing with your GP — it can reflect changes in liver function, kidney function, or nutritional status that are separate from your hormone profile and need to be properly assessed.

**`ALB-NORMAL` (35–50 g/L)**

> Your albumin is within the normal range. It is used as a calculation input for your free testosterone result — a normal albumin confirms the free T figure is based on a reliable baseline. No action is needed for this marker.

---

### Part 3 — THE EVIDENCE

*(Same for all ALB states)*

> Albumin is the most abundant protein in the bloodstream. It is produced by the liver and performs several functions, including transporting hormones, enzymes, and other molecules. In the context of hormone testing, albumin binds to testosterone with lower affinity than SHBG — meaning that fraction remains more readily available to tissues. Both albumin and SHBG are used in the Vermeulen formula to calculate free testosterone from a total testosterone reading. Low albumin can be associated with liver or kidney conditions, malnutrition, or systemic inflammation, and represents a separate clinical consideration from the hormone results.

---

### Part 4 — WHAT WE RECOMMEND

**`ALB-LOW` (< 35 g/L)**

> Albumin below the normal range is outside the scope of what a home blood test alone can investigate. We recommend raising this result with your GP. Your free testosterone calculation may be less reliable at this level, and the underlying cause of low albumin should be established before any other action is taken.

**`ALB-NORMAL` (35–50 g/L)**

> Your albumin is within the normal range. No action is needed. It confirms the reliability of your free testosterone calculation.

---

### Part 5 — CONVERT

**`ALB-LOW`:** GP referral CTA only. No supplement CTA.

**`ALB-NORMAL`:** No CTA.

---

---

## 5. Vitamin D

**Kits:** Kit 2, Kit 3
**Unit:** nmol/L
**Reference range:** 50–125 nmol/L (adequate)
**Dashboard card order:** Position 4 (first energy/recovery marker; position 1 in Kit 2)

| State | Threshold | Flag |
|-------|-----------|------|
| `VD-CRITICALLY-LOW` | < 25 nmol/L | L |
| `VD-LOW` | 25–50 nmol/L | L |
| `VD-NORMAL` | > 50 nmol/L | — |

---

### Part 2 — WHAT THIS MEANS

**`VD-CRITICALLY-LOW` (< 25 nmol/L)**

> Your Vitamin D is significantly below adequate levels — not a borderline result, but one at the low end of the deficient range. At this level, the direct impact on muscle function and energy is well established. In the UK, this level is most common after winter months and in men who spend the majority of their time indoors. It responds well to supplementation.

**`VD-LOW` (25–50 nmol/L)**

> Your Vitamin D is below the level most research considers adequate for energy and muscle function. This is one of the most common results we see in UK men, particularly between October and March. Without direct sunlight exposure — which is limited for most of the year in the UK — maintaining adequate levels requires supplementation for most men.

**`VD-NORMAL` (> 50 nmol/L)**

> Your Vitamin D is within the adequate range. Your body has enough to support normal muscle function and immune response at current levels. Given seasonal variation in the UK, it is worth retesting in autumn or winter — levels typically fall between October and March even when summer levels are good.

---

### Part 3 — THE EVIDENCE

*(Same for all VD states)*

> Vitamin D functions more like a hormone than a vitamin. The body produces it primarily through skin exposure to sunlight — dietary sources contribute very little. It regulates hundreds of biological processes, including muscle contraction, immune function, and mood. Deficiency is associated with fatigue, reduced muscle performance, and slower recovery. In the UK, Public Health England recommends Vitamin D supplementation for all adults from October to March. Many individuals — particularly those working indoors — are below adequate levels year-round. You cannot reliably gauge your Vitamin D from how you feel. Testing is the only way to know your level.

---

### Part 4 — WHAT WE RECOMMEND

**`VD-CRITICALLY-LOW` (< 25 nmol/L)**

> Your Vitamin D is significantly below adequate levels. Supplementation with Vitamin D3 is the standard approach. At this level, a higher initial dose is often used to restore levels more quickly — we would recommend discussing the appropriate dose with your GP given the depth of the deficiency. The Daily Stack contains Vitamin D3, which contributes to normal muscle function, and is appropriate for ongoing maintenance once levels are restored.

**`VD-LOW` (25–50 nmol/L)**

> Your Vitamin D is below adequate levels. Daily supplementation with Vitamin D3 is the most direct way to address this. The Daily Stack contains Vitamin D3, which contributes to normal muscle function, alongside Zinc and Active B12 — both relevant for active men.

**`VD-NORMAL` (> 50 nmol/L)**

> Your Vitamin D is within the adequate range. No supplementation is immediately required for this marker based on this result. Retesting in autumn or winter will tell you whether seasonal change is affecting your level.

---

### Part 5 — CONVERT

**`VD-CRITICALLY-LOW` and `VD-LOW`**

Primary CTA: `BUY DAILY STACK — £34.95/MO →`

Compliance note: *Supplements support general health. They do not treat or diagnose any medical condition.*

---

**`VD-NORMAL`**

No CTA for this marker. Seasonal retest note shown.

---

---

## 6. Active B12

**Kits:** Kit 2, Kit 3
**Unit:** pmol/L (Holotranscobalamin)
**Reference range:** ≥ 37.5 pmol/L (adequate)
**Dashboard card order:** Position 6

| State        | Threshold     | Flag |
|--------------|---------------|------|
| `B12-LOW`    | < 37.5 pmol/L | L    |
| `B12-NORMAL` | ≥ 37.5 pmol/L | —    |

*Note: Active B12 (Holotranscobalamin) is the fraction of B12 that is actively transported into cells — a more reliable indicator of usable B12 status than total serum B12, which includes bound fractions unavailable to tissues.*

---

### Part 2 — WHAT THIS MEANS

**`B12-LOW` (< 37.5 pmol/L)**

> Your active B12 is below 37.5 pmol/L. Active B12 is the form your body can actually use — it is what enters your cells and supports energy metabolism, cognitive function, and the formation of healthy red blood cells. A result below this threshold indicates your cells have less B12 available than they need to function optimally.

**`B12-NORMAL` (≥ 37.5 pmol/L)**

> Your active B12 is within the normal range. This is the form of B12 your cells can actually use, and yours is at a level that supports normal energy metabolism and cognitive function.

---

### Part 3 — THE EVIDENCE

*(Same for all B12 states)*

> Active B12 (Holotranscobalamin) is the form of vitamin B12 that is actively transported into cells. Standard B12 tests measure total serum B12, which includes a large portion bound to proteins that cannot be used by tissues. Active B12 gives a more accurate picture of what your body actually has available. B12 is not produced by the body and must come entirely from animal-source foods: meat, fish, eggs, and dairy. Deficiency is more common in men over 40, those on plant-based diets, and those taking long-term medications including metformin or proton pump inhibitors. Low active B12 is associated with fatigue, reduced cognitive clarity, and mood changes.

---

### Part 4 — WHAT WE RECOMMEND

**`B12-LOW` (< 37.5 pmol/L)**

> Your active B12 is below the optimal threshold. B12 is almost entirely sourced from animal products — meat, fish, eggs, and dairy. If your diet is varied and includes these foods regularly, absorption rather than intake may be the issue; this is worth discussing with your GP. The Daily Stack contains B12 as Methylcobalamin, a highly bioavailable form that contributes to normal energy-yielding metabolism and normal psychological function.

**`B12-NORMAL` (≥ 37.5 pmol/L)**

> No supplementation is required based on this result. If your diet is predominantly plant-based, retesting in 6–12 months is worthwhile — B12 stores can gradually deplete without regular animal-source food intake.

---

### Part 5 — CONVERT

**`B12-LOW`**

Primary CTA: `BUY DAILY STACK — £34.95/MO →`

Compliance note: *Supplements support general health. They do not treat or diagnose any medical condition.*

---

**`B12-NORMAL`**

No CTA for this marker.

---

---

## 7. hs-CRP (Inflammation)

**Kits:** Kit 2, Kit 3
**Unit:** mg/L
**Reference range:** < 1.0 mg/L (cardiovascular risk assessment standard)
**Dashboard card order:** Position 6

| State | Threshold | Flag |
|-------|-----------|------|
| `CRP-NORMAL` | < 1.0 mg/L | — |
| `CRP-MILD` | 1.0–3.0 mg/L | H |
| `CRP-MODERATE` | 3.0–10.0 mg/L | H |
| `CRP-HIGH` | > 10.0 mg/L | H |

**Implementation note:** When state is `CRP-MILD`, `CRP-MODERATE`, or `CRP-HIGH`, Parts 4 and 5 are replaced by the qualifier card (see `qualifier-card.md`). Part 2 and Part 3 below are always shown first.

---

### Part 2 — WHAT THIS MEANS

**`CRP-NORMAL` (< 1.0 mg/L)**

> Your hs-CRP is within the normal range. There is no significant systemic inflammation indicated by this result. For active men, this is a positive finding and a useful baseline to track over time.

**`CRP-MILD` (1.0–3.0 mg/L)**

> Your hs-CRP is mildly elevated. This marker measures low-level systemic inflammation. A result in this range can have several causes — training recovery, sleep quality, diet, or connective tissue stress. It is not a critical result, but it indicates your body is managing more background inflammation than the optimal baseline.

**`CRP-MODERATE` (3.0–10.0 mg/L)**

> Your hs-CRP is moderately elevated. This level of systemic inflammation is worth paying attention to. A result in this range can be driven by several factors — active infection, training load, sleep deficit, diet, or joint and connective tissue stress. The question below will help us show you the most relevant next step for your specific result.

**`CRP-HIGH` (> 10.0 mg/L)**

> Your hs-CRP is significantly elevated. At this level, the result warrants a conversation with your GP before taking any other steps. This is not a normal post-training or dietary response — it indicates a level of systemic inflammation that needs to be investigated.

---

### Part 3 — THE EVIDENCE

*(Same for all CRP states)*

> hs-CRP stands for high-sensitivity C-reactive protein. It is produced by the liver in response to inflammation anywhere in the body. Standard CRP tests are not sensitive enough to detect low-level systemic inflammation — the high-sensitivity version used here is. In active men, mildly elevated hs-CRP is often associated with insufficient recovery time, connective tissue stress, or diet-driven inflammation. However, it is not a specific marker — it can be elevated for many reasons. It is most useful as part of a broader picture and as something to track over time. A single elevated reading is not a diagnosis of any condition.

---

### Part 4 — WHAT WE RECOMMEND

**`CRP-NORMAL` (< 1.0 mg/L)**

> Your hs-CRP indicates no significant systemic inflammation. No action is needed for this marker. Tracking it on future tests is worthwhile — it is a sensitive early signal of changes in training recovery, sleep quality, and diet.

**`CRP-MILD`, `CRP-MODERATE`, `CRP-HIGH`**

*[Qualifier card replaces Parts 4–5. Copy in `qualifier-card.md`.]*

---

### Part 5 — CONVERT

**`CRP-NORMAL`:** No CTA.

**`CRP-MILD`, `CRP-MODERATE`, `CRP-HIGH`:** Qualifier card handles conversion. See `qualifier-card.md`.

---

---

## 8. Ferritin

**Kits:** Kit 2, Kit 3
**Unit:** μg/L
**Reference range:** 30–300 μg/L (men)
**Dashboard card order:** Position 7 (last)

| State | Threshold | Flag |
|-------|-----------|------|
| `FER-CRITICAL` | < 30 μg/L | L |
| `FER-LOW` | 30–100 μg/L | L |
| `FER-NORMAL` | > 100 μg/L | — |

*Note: The NHS reference range floor for men is approximately 12–15 μg/L. The threshold here uses 30 μg/L as the lower bound because below this level, iron supplementation typically requires GP guidance. The 30–100 range is within lab reference bounds but is suboptimal for active men and commonly associated with persistent fatigue.*

---

### Part 2 — WHAT THIS MEANS

**`FER-CRITICAL` (< 30 μg/L)**

> Your ferritin is below the level we consider adequate for active men. Ferritin is the protein that stores iron in your body — a low reading means your iron reserves are significantly depleted. At this level, persistent fatigue, reduced exercise performance, and slow recovery are common findings. This result needs follow-up with your GP before you take any iron supplement.

**`FER-LOW` (30–100 μg/L)**

> Your ferritin is within the laboratory reference range but towards the lower end. Many active men experience the effects of suboptimal iron stores in this zone — particularly persistent fatigue and slower recovery — even though the result does not sit in the critically low category. This is one of the most commonly overlooked causes of unexplained fatigue in otherwise healthy men who train regularly.

**`FER-NORMAL` (> 100 μg/L)**

> Your ferritin is well within the reference range. Your iron stores appear adequate. Persistent fatigue or slow recovery is unlikely to be driven by iron depletion at this level.

---

### Part 3 — THE EVIDENCE

*(Same for all FER states)*

> Ferritin is the primary iron storage protein in the body. Unlike serum iron — which fluctuates hour to hour — ferritin gives a reliable picture of total iron reserves. Iron is essential for producing haemoglobin, the protein in red blood cells that carries oxygen to your muscles and organs. When ferritin is low, your muscles receive less oxygen during exercise, which directly reduces performance and slows recovery. Ferritin is not routinely included in standard NHS blood panels for men — which means many men with depleted stores go undetected for years. It is also worth noting that very high ferritin can occasionally indicate inflammatory or liver-related changes, though this is uncommon and the lab flags it.

---

### Part 4 — WHAT WE RECOMMEND

**`FER-CRITICAL` (< 30 μg/L)**

> We do not sell iron supplements, and we would not recommend taking one without medical guidance. Iron is one of the few supplements where taking the wrong dose carries genuine clinical risk. Your GP can confirm whether iron supplementation is appropriate, at what dose, and for how long — and will likely want to investigate the cause. Take your ferritin number and the reference range to your appointment.

**`FER-LOW` (30–100 μg/L)**

> Your ferritin is within range but in the lower zone where active men often notice the effects. Increasing dietary iron is the first step — red meat, liver, lentils, spinach, and fortified cereals are the best sources. Pairing iron-rich food with Vitamin C increases absorption. If fatigue persists and your level does not improve on a retest, a GP conversation is the appropriate next step. We do not sell iron supplements — the dosing risk means it needs to be managed by a doctor.

**`FER-NORMAL` (> 100 μg/L)**

> Your ferritin is in a strong range. Iron depletion is not contributing to any fatigue or recovery issues you may have. If you are still experiencing unexplained fatigue, your other results may point to the relevant cause.

---

### Part 5 — CONVERT

**`FER-CRITICAL`**

Primary CTA: `SPEAK TO YOUR GP →`
*(Links to NHS GP finder — external link, opens new tab)*

No supplement CTA shown.

---

**`FER-LOW`**

No product CTA. Dietary guidance shown in Part 4.

---

**`FER-NORMAL`**

No CTA.

---

---

## Cross-Sell Logic

When a customer has only tested Kit 1 or Kit 2, a cross-sell card appears below the results if specific conditions are met. Copy for this section lives in `dashboard-screen.md` Section 3.

| Customer kit | Cross-sell condition | CTA |
|---|---|---|
| Kit 1 only | Always (energy/recovery markers not tested) | `GET KIT 2 — £44 →` or `GET KIT 3 — £69 →` |
| Kit 2 only | Always (testosterone not tested) | `GET KIT 1 — £29 →` or `GET KIT 3 — £69 →` |
| Kit 3 | No cross-sell — all markers covered | — |

Cross-sell heading: **"One more thing worth knowing."**

Cross-sell body (Kit 1 → Kit 2):
> Your testosterone data is now in your dashboard. But testosterone is only one part of the picture. If your energy, recovery, or inflammation markers haven't been tested, Kit 2 looks at the four markers most directly linked to how you perform and recover — Vitamin D, Active B12, hs-CRP, and Ferritin.

Cross-sell body (Kit 2 → Kit 1):
> Your energy and recovery data is now in your dashboard. But if you haven't tested your testosterone, you're only seeing part of the picture. Kit 1 tests Total T, SHBG, and Free T — the three markers that tell you exactly where your hormone levels stand.

---

## Panel Summary Headlines

The dashboard panel summary (Section 1, State B) generates a one or two-line headline based on result flags. Copy guidelines for common combinations:

| Result combination | Suggested headline copy |
|---|---|
| All markers in range | "All markers in range." |
| T-LOW only | "Your testosterone is below the optimal range." |
| T-MID + one low marker | "Your testosterone is in range. [Marker] needs attention." |
| T-HIGH + all normal | "Strong results across the board." |
| VD-LOW or VD-CRITICALLY-LOW | "Your Vitamin D needs attention." |
| VD-LOW + B12-LOW | "Your Vitamin D and Active B12 are both below optimal." |
| CRP elevated | "Your inflammation marker is elevated. One question to answer." |
| FER-CRITICAL | "Your iron stores are low. Your GP should see this." |
| Multiple markers flagged | "A few markers need attention — full detail below." |

Headlines must not imply diagnosis. Do not say "You have low X." Use impersonal or "your [marker]" framing.

---

## Approval Log

| Section | Reviewed by | Date | Status |
|---------|-------------|------|--------|
| Total Testosterone | — | — | Draft |
| SHBG | — | — | Draft |
| Free Testosterone | — | — | Draft |
| Albumin | — | — | Draft |
| Vitamin D | — | — | Draft |
| Active B12 | — | — | Draft |
| hs-CRP | — | — | Draft |
| Ferritin | — | — | Draft |
| Panel summary headlines | — | — | Draft |
| Cross-sell copy | — | — | Draft |

All sections require Dr Ewa Lindo sign-off before publishing. Keith Antony to confirm tone and voice on all sections.
