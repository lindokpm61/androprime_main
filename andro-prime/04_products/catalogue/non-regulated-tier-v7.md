# Andro Prime — Non-Regulated Product Tier
## Three-Kit Diagnostic Range + Supplement Conversion Engine
### V7.1 Product Architecture — April 2026

**Supersedes:** V7.0 (March 30, 2026)
**Status:** Updated — reflects ICP/kit/supplement alignment review April 2026
**Owner:** Keith Antony
**Cross-reference:** `../icp-kit-supplement-alignment-april2026.md` — full rationale for all changes in this version

---

## 1. Strategic Overview

### 1.1 What Changed

The V6.1 model treated the test kit tier as a single product (Product 1: Testosterone Health Check at £39) functioning primarily as a data collection and TRT pipeline tool. The updated architecture expands this to a three-kit diagnostic range, each designed to drive purchases of specific supplement products. This transforms the non-regulated tier from a cost centre (data zone) into a profit-generating business unit (profit zone) that is self-sustaining regardless of CQC timeline.

### 1.2 Core Principle: Test → Reveal → Recommend → Convert

Every kit is designed to surface specific deficiencies that map directly to Andro Prime supplement products. The results report acts as a personalised supplement prescription backed by blood data — fundamentally different from a customer browsing Amazon and choosing between generic brands. The test creates the demand. The supplement fills it.

### 1.3 Regulatory Position

All three kits and both supplement products are non-regulated:
- Test kits: Wellness products using CE/UKCA marked in-vitro diagnostic devices processed by UKAS-accredited labs. No CQC registration required. No diagnosis or treatment recommendation.
- Supplements: Food supplements regulated by FSA under the Food Supplements (England) Regulations 2003. EFSA-approved health claims only.

---

## 2. Product Specifications

### 2.1 Kit 1: Testosterone Health Check

**Target customer:** Men 35-60 who suspect low testosterone or want a baseline reading.

**Price:** £29 (introductory) / £35 (standard)

**Panel:**
- Total Testosterone (nmol/L)
- SHBG (nmol/L)
- Free Testosterone (calculated from T + SHBG + albumin constant)

**Collection method:** Finger-prick, at-home

**COGS:** £15-19

**Results report drives:**
- Low T (<12 nmol/L, ~35% of men tested): → Founding member deposit → TRT pipeline
- Normal T (12-20 nmol/L): → Daily Stack recommendation ("Maintain your levels with zinc, magnesium, and D3")
- Optimal T (>20 nmol/L): → Retest in 6-12 months + general supplement recommendation

---

### 2.2 Kit 2: Men's Energy & Recovery Check

**Target customer:** Active men 35-60 experiencing fatigue, slow recovery, joint stiffness, or declining performance. This is the broadest audience — he doesn't need to suspect low testosterone.

**Price:** £44

**Panel:**
- Vitamin D (25-OH)
- Magnesium (serum)
- hs-CRP (high-sensitivity C-reactive protein)
- Ferritin

**Note on zinc:** Zinc requires venous blood draw for accurate results and cannot be reliably measured via finger-prick. It is excluded from the panel but recommended as a general supplement based on epidemiological data.

**COGS:** £20-25

**Results report drives:**
- Low Vitamin D: → Daily Stack (D3 hero)
- Low Magnesium: → Daily Stack (Mg hero)
- Elevated hs-CRP: → Collagen Peptides (joint/inflammation support)
- Low Ferritin: → Dietary guidance + potential GP referral if very low
- Multiple deficiencies: → Bundle recommendation (Daily Stack + Collagen at discounted subscription rate)

---

### 2.3 Kit 3: Men's Hormone & Recovery Check

**Target customer:** Health-conscious men 35-65 who want a comprehensive baseline across hormones, energy, and recovery.

**Name change note:** Previously titled "Men's Foundations MOT." Renamed April 2026 — "MOT" implies comprehensive general health coverage that this 6-marker panel does not deliver.

**Price:** £69

**Panel:**
- Total Testosterone (nmol/L) + SHBG → Free Testosterone (calculated)
- Vitamin D (25-OH)
- Magnesium (serum)
- hs-CRP (inflammation)
- Ferritin (iron/energy)
- Vitamin B12 (energy, cognition, mood — confirm inclusion with Thriva)

**COGS:** £30-38

**Results report drives:**
- All the same supplement recommendations as Kit 2
- Plus: Low testosterone → Founding member deposit → TRT pipeline
- The comprehensive results create the strongest case for supplement bundling because the report shows multiple areas for improvement simultaneously

---

## 3. Supplement Products (Driven by Kit Results)

### 3.1 Andro Prime Daily Stack

**Subscription price:** £34.95/month
**One-off price:** £39.95

**Formulation (per daily sachet):**

| Ingredient | Dose | EFSA claim | Copy use |
|-----------|------|-----------|----------|
| Zinc | 30mg | "Contributes to the maintenance of normal testosterone levels" | Yes — Kit 1 normal T trigger |
| Magnesium Glycinate | 400mg | "Contributes to the reduction of tiredness and fatigue" | Yes — Kit 2/3 low Mg trigger |
| Vitamin D3 | 4,000 IU | "Contributes to normal muscle function" | Yes — Kit 2/3 low D trigger |
| Vitamin B12 (Methylcobalamin) | 1,000mcg | "Contributes to normal energy-yielding metabolism" / "contributes to normal psychological function" | Yes — Kit 3 low B12 trigger (pending Thriva confirmation) |
| Ashwagandha KSM-66 | 600mg | None approved — **silent ingredient** | **No — do not mention in any copy, affiliate brief, or influencer material** |

**V7.1 change — Omega-3 removed, B12 added:** Omega-3's only available EFSA claim is cardiovascular function, which has no relevance to ICP 1 or ICP 2 language. B12 deficiency directly causes the fatigue, brain fog, and flat mood that ICP 1 and ICP 3 buyers describe.

**COGS:** £11-13/unit

### 3.2 Andro Prime Joint & Recovery Collagen

**Subscription price:** £29.95/month
**One-off price:** £34.95

**Formulation (powder, 30-day tub):**
- Hydrolysed Bovine Collagen Peptides (Type I & III) 10g per serving
- UC-II Undenatured Type II Collagen 40mg (joint-specific)
- Vitamin C 80mg (EFSA: "contributes to normal collagen formation for the normal function of cartilage")
- MSM 500mg (joint comfort, anti-inflammatory)
- Hyaluronic Acid 5mg (joint lubrication)

**COGS:** £10-14/unit

**V7.1 change — qualifier required before trigger:** hs-CRP is a general inflammation marker — it does not indicate joint-specific inflammation. Men with elevated CRP and no joint symptoms should receive lifestyle guidance only, not a collagen recommendation. A joint symptoms qualifier question must appear on the results dashboard before the collagen CTA is shown.

---

## 4. Results-to-Product Mapping

| Biomarker | Result | Qualifier needed? | Primary CTA | Secondary CTA |
|-----------|--------|-------------------|-------------|---------------|
| Total Testosterone | < 12 nmol/L | None | Founding member deposit | Daily Stack (honest framing: "supports the basics while you wait") |
| Total Testosterone | 12–20 nmol/L | Check if energy symptoms stated at checkout | Daily Stack (zinc hero) | Kit 2 cross-sell if energy symptoms present |
| Total Testosterone | > 20 nmol/L | None | Retest reminder (6–12 months) | — |
| Vitamin D | < 50 nmol/L | None | Daily Stack (D3 hero) | — |
| Vitamin D | 50–75 nmol/L | None | Daily Stack ("optimise your levels") | — |
| Magnesium | Below range | None | Daily Stack (Mg hero) | — |
| Vitamin B12 | Below optimal | None | Daily Stack (B12 hero — Kit 3 only) | GP referral if very low |
| hs-CRP | > 10 mg/L | None | **GP referral — no supplement CTA at this level** | — |
| hs-CRP | > 3 mg/L | Ask joint symptoms question | Collagen (if joint symptoms: Yes) | Lifestyle guidance (if joint symptoms: No) |
| hs-CRP | 1–3 mg/L | Ask joint symptoms question | Collagen (if joint symptoms: Yes) | Lifestyle guidance only (if joint symptoms: No) |
| Ferritin | Low (< 30 µg/L) | None | Dietary guidance + GP referral letter template | — |
| Ferritin | Very low (< 15 µg/L) | None | GP referral — do not self-supplement iron | — |
| Multiple deficiencies (2+) | Mixed | None | Complete Men's Stack — Daily Stack + Collagen at £54.95/mo | Individual products as fallback |

**Cross-sell triggers:**

- **Kit 1 → Kit 2:** T result 12–20 nmol/L AND energy/fatigue symptoms stated → show Kit 2 cross-sell below primary Daily Stack CTA.
- **Kit 2 → Kit 1:** 2+ deficiencies OR any deficiency AND buyer age 40+ → show Kit 1 cross-sell below supplement recommendation.

---

## 5. Financial Model: Non-Regulated Tier

### 5.1 Unit Economics

| Product | Price | COGS | Gross Margin | Margin % |
|---------|-------|------|-------------|----------|
| Kit 1: Testosterone Check | £29 | £17 | £12 | 41% |
| Kit 2: Energy & Recovery | £44 | £22 | £22 | 50% |
| Kit 3: Hormone & Recovery Check | £69 | £35 | £34 | 49% |
| Daily Stack (subscription) | £34.95/mo | £13 | £21.95 | 63% |
| Collagen Peptides (subscription) | £29.95/mo | £13 | £16.95 | 57% |

### 5.2 Phase 0 Forecast (6 months pre-CQC)

| Month | Kit 1 | Kit 2 | Kit 3 | Total Kits |
|-------|-------|-------|-------|------------|
| M1 | 30 | 0 | 0 | 30 |
| M2 | 45 | 15 | 0 | 60 |
| M3 | 55 | 30 | 10 | 95 |
| M4 | 60 | 40 | 15 | 115 |
| M5 | 65 | 45 | 20 | 130 |
| M6 | 70 | 50 | 25 | 145 |
| **Total** | **325** | **180** | **70** | **575** |

| Revenue Stream | 6-Month Total |
|---------------|---------------|
| Kit 1 revenue (325 × £29) | £9,425 |
| Kit 2 revenue (180 × £44) | £7,920 |
| Kit 3 revenue (70 × £69) | £4,830 |
| **Total kit revenue** | **£22,175** |
| Daily Stack subscriptions (cumulative) | £8,400 |
| Collagen subscriptions (cumulative) | £5,200 |
| **Total supplement revenue** | **£13,600** |
| Founding member deposits (est. 60 × £75) | £4,500 |
| **TOTAL PHASE 0 REVENUE** | **£40,275** |

### 5.3 Year 1–3 Non-Regulated Tier Projections

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total kits sold | 1,200 | 2,000 | 2,800 |
| Kit revenue | £55,000 | £92,000 | £130,000 |
| Active supplement subs (EOY) | 185 | 400 | 650 |
| Supplement subscription revenue | £88,000 | £192,000 | £312,000 |
| **Total non-regulated revenue** | **£143,000** | **£284,000** | **£442,000** |
| Total gross profit | £78,000 | £162,000 | £264,000 |
| Margin | 55% | 57% | 60% |

**By Year 3, the non-regulated tier alone generates £442k revenue at 60% margin.** This is a defensible, recurring revenue business that requires no CQC registration.

---

## 6. Gate Structure

### Gate 0A — Week 6: Kit Volume Assessment

**Criteria:** 80+ total kits sold across all three products

- **GO:** Proceed with supplement manufacturing order
- **NO-GO:** Extend Kit 1 marketing, delay Kit 2/3 launch, investigate conversion blockers

### Gate 0B — Week 10: Supplement Conversion Assessment

**Criteria:** 10%+ of Kit 2/3 buyers converting to at least one supplement subscription

- **GO:** Scale paid ads, expand content for Kit 2 and Kit 3
- **NO-GO:** Revise results report copy, test different recommendation approaches, consider pricing adjustment

### Gate 0C — Month 4: Phase 0 Health Check

**Criteria:** 200+ total kits sold, 40+ active supplement subscribers, supplement MRR >£1,500/month

- **GO:** Full confidence in non-regulated tier; begin CQC launch preparations
- **NO-GO:** Reassess product-market fit; consider pivoting kit pricing or supplement formulations

---

## 7. Competitive Differentiation

No competitor is doing this. Medichecks sells test kits. Supplement brands sell supplements. Nobody in the UK men's health space is running a closed-loop diagnostic-to-supplement pipeline where blood results generate a personalised recommendation for products you can buy from the same brand, in the same checkout, on the same platform.

You would be the first UK men's health brand to offer: test → personalised deficiency report → recommended supplements → subscription → ongoing monitoring via retest.

---

**Last updated:** April 2026 (V7.1)
**Owner:** Keith Antony
**Cross-reference:** `04_products/catalogue/product-catalogue-v7-1.md` for full product catalogue including regulated tier
