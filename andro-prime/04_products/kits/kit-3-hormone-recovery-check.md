# Kit 3 — Men's Hormone & Recovery Check
## Product Specification | V7.2 — April 2026

**Owner:** Keith Antony
**Status:** Active. Phase 0 launch product (Week 8 staged launch).
**Cross-references:**
- `04_products/catalogue/product-catalogue-v7-1.md` (V7.2 — pricing source of truth)
- `04_products/icp-kit-supplement-alignment-april2026.md` (selling logic, copy frame, cross-sell)
- `04_products/CONTEXT.md` (results-engine trigger rules)
- `06_marketing/positioning/product-marketing-context.md` (ICP, voice, customer language)
- `03_compliance/CONTEXT.md` (red-flag language, EFSA claims, Phase 0 boundary)

> **Kit 3 is the premium entry point.** It combines Kit 1 + Kit 2 panels into a single 9-marker test. Highest margin per kit. Best supplement conversion rate. The kit to recommend when there's ambiguity about whether the issue is hormones, nutrition, or inflammation. **Do NOT call it a "Health MOT"** — that overpromises panel breadth and creates post-purchase disappointment.

---

## 1. Product Summary

| Field | Detail |
|---|---|
| **Product name** | Andro Prime Men's Hormone & Recovery Check |
| **Tagline** | "9 markers. Hormones, energy, recovery, inflammation. One kit." |
| **Price** | **£179 (£161.10 with PT/influencer 10% code)** |
| **Format** | At-home finger-prick blood collection kit |
| **Lab partner** | Vitall (UKAS ISO 15189 accredited) |
| **COGS (Vitall-quoted)** | £98.00 |
| **Gross margin (direct sale)** | £81.00 (45.3%) |
| **Net per affiliate sale (no bonus)** | £34.07 (with £10 Kit 3 bonus already included in PT cost) |
| **Net per affiliate sale (worst case all bonuses)** | £4.07 — see `commission-structure.md` |
| **Turnaround** | Kit arrives 2–3 days; results 48–72 hours after sample receipt |
| **Results delivery** | Andro Prime branded dashboard with full personalised report (longest report of the three kits) |
| **Regulatory position** | Wellness product. CE/UKCA marked IVD. **No CQC. No diagnosis.** |
| **Launch status** | Phase 0, Week 8 staged launch (after Kit 1 and Kit 2 prove operational stability) |
| **Expected volume** | 10–20/month at minimum case; 20–30/month at stretch case (per master plan v2.2) |
| **Strategic role** | Premium entry product. Highest margin per kit. Drives both TRT pipeline (low-T trigger) AND supplement sales from a single purchase. |

---

## 2. Target ICP

**Primary:** ICP 3 — Curious Maintainer
- Age: 40–65
- Profile: Health-conscious, prevention-focused. No specific complaint — wants a baseline.
- What they're hiring this kit for: prevention + peace of mind
- Trust trigger: UKAS lab accreditation, comprehensive panel, GP-led interpretation

**Secondary:** ICP 1 (when symptoms are ambiguous — could be hormones OR energy/recovery)

**Secondary:** ICP 2 (when buyer wants the testosterone information added to energy/recovery markers — Kit 2 doesn't have hormones)

**Anti-persona (do not target):**
- Men with single specific complaint — they should be routed to Kit 1 (testosterone-specific) or Kit 2 (energy/recovery-specific)
- Men under 40
- Men expecting "comprehensive 15+ marker health MOT" — Kit 3 has 9 markers; the comparison gap with MediChecks Well Man (15+ markers) creates expectation mismatch

**Customer language (used in copy):**
- "Want to know where I stand"
- "Haven't had a check-up in years"
- "Proactive about health"
- "Want the full picture"
- "Hormones AND energy AND recovery — all of it"

---

## 3. Biomarker Panel (9 markers)

Combines full Kit 1 panel + full Kit 2 panel:

| Biomarker | Unit | From | Why included |
|---|---|---|---|
| Total Testosterone | nmol/L | Kit 1 | Primary hormone measure |
| SHBG | nmol/L | Kit 1 | Required for Free T calculation |
| Free Androgen Index (FAI) | calculated | Kit 1 | Clinical picture beyond Total T |
| Albumin | g/L | Kit 1 | Required for Free T calculation |
| Free Testosterone | calculated (nmol/L) | Kit 1 | Bioavailable testosterone |
| Vitamin D (25-OH) | nmol/L | Kit 2 | Energy + recovery driver |
| Active B12 | pmol/L | Kit 2 | Energy + cognition |
| hs-CRP | mg/L | Kit 2 | Inflammation marker |
| Ferritin | µg/L | Kit 2 | Iron stores |

**Threshold values:** Same as Kit 1 and Kit 2 individually. See `results-engine/thresholds.md` (currently placeholder).

---

## 4. Copy Frame

### Naming and positioning (V7.1 change — must follow)

**The previous name "Men's Foundations MOT" was retired** because "MOT" implies 15+ marker general health coverage that this panel does not provide. New name: **"Men's Hormone & Recovery Check"** — accurate, specific, not overpromising.

If "MOT" appears anywhere (e.g. SEO URL slug for legacy reasons), it must be qualified:
- ✓ OK: "The health check your GP doesn't offer — your hormones, energy, and inflammation in one kit."
- ✗ Not OK: "Comprehensive health MOT" — implies coverage it doesn't have.

### Permitted (use these)

**Hero claims:**
- "9 markers. Hormones, energy, recovery, inflammation. One kit."
- "If you're tired and recovering slowly and you don't know whether it's hormones, nutrition, or inflammation — this tells you."
- "Six things your body has been trying to tell you. 1 kit. No GP needed."
- "The men's health check your GP doesn't offer."

**Positioning hooks:**
- "Nine numbers. Each one specific to how men over 40 actually feel and perform."
- "Kit 2 told us your energy markers. Kit 3 adds your testosterone. The complete picture."
- "Comprehensive enough to answer the question. Targeted enough to be actionable."

**Premium-pricing language:**
- "It's £179 (£161 with my code)."
- "MediChecks Well Man Test is £89–149 with 15+ markers. Andro Prime Kit 3 is £179 with 9 markers — but every result comes with a GP-led interpretation and a specific recommendation. Different products."
- Position against MediChecks explicitly. Don't avoid the comparison — host it.

### Forbidden

- "Diagnose," "diagnosis"
- "Treat," "treatment," "cure"
- "Andro Prime cured my fatigue"
- **"Comprehensive health MOT"** — overpromises panel breadth
- **"Complete blood test"** — overpromises panel breadth
- "Inflammation cured" / "Reduces inflammation"
- "Heals joints"
- "Ashwagandha"
- Discount language above 10%

### Copy frame contrast

The quiz should recommend Kit 3 when there is **ambiguity** — when the buyer's symptoms could be hormones OR energy/recovery markers. Highest margin AND best supplement conversion (multiple deficiency triggers possible from one purchase).

If buyer's symptoms are clearly testosterone-specific → quiz recommends Kit 1
If buyer's symptoms are clearly energy/recovery-specific → quiz recommends Kit 2
If buyer doesn't know or wants comprehensive → quiz recommends Kit 3

---

## 5. Results-Engine Logic

| Result | Primary CTA | Secondary CTA | Notes |
|---|---|---|---|
| T < 12 nmol/L | **Founding Member Deposit** | Daily Stack ("while you wait") | Kit 3 is one of two kits that can trigger founding member (Kit 1 is the other) |
| T 12–15 nmol/L | Daily Stack (zinc hero) | Retest reminder | Borderline framing |
| T 15–20 nmol/L (normal) | Daily Stack (zinc hero) | None | "Maintenance" framing |
| Low Vitamin D | Daily Stack (D3 hero) | None | EFSA muscle function claim |
| Low Active B12 | Daily Stack (B12 hero) | None | EFSA energy + psychological claims |
| Elevated hs-CRP + joint symptoms confirmed | Joint & Recovery Collagen | Daily Stack | Same qualifier as Kit 2 |
| hs-CRP > 10 mg/L | GP referral prompt | None | Same as Kit 2 — clinical referral, no supplement |
| Low Ferritin | GP referral + dietary guidance | None | Same as Kit 2 |
| **2+ deficiencies (any combination)** | **Complete Men's Stack bundle (£54.95/mo)** | Individual products | Bundle saves ~£10/mo |

**Why Kit 3 has the best supplement conversion rate:**
- Multiple biomarkers tested → higher probability that at least one triggers a recommendation
- Multiple-deficiency triggers fire bundle CTA (higher LTV than single product)
- ICP 3 buyers are pre-disposed toward supplementation (prevention-focused)

Estimated kit-to-supplement conversion: 18–25% for Kit 3 (vs. 12–15% Kit 2 and ~8% Kit 1).

---

## 6. Cross-Sell Architecture

### Direction 1: Kit 3 → Daily Stack / Collagen / Bundle (in-result conversion)

This is the supplement engine for Kit 3. Same logic as Kit 2 but with more deficiency-trigger combinations possible.

### Direction 2: Kit 3 → Founding Member Deposit (low-T trigger)

If T < 12 nmol/L: Founding member deposit is primary CTA. Daily Stack is secondary.

### What NOT to cross-sell

- **Do not cross-sell Kit 1 or Kit 2 from Kit 3 results.** Kit 3 contains both panels — there's nothing to cross-sell that the buyer hasn't already paid for.
- **Do not bundle Kit 3 with another kit at discount.** Kit 3 is a standalone product.

---

## 7. Compliance Scoping

| Rule | Detail |
|---|---|
| **Phase 0 boundary** | Kit 3 is wellness product. No clinical diagnosis. No prescribing. |
| **Founding member trigger** | T < 12 nmol/L only — same compliance rule as Kit 1. Never inferred. |
| **Diagnostic language** | Forbidden. Use "your results indicate." |
| **MOT language** | Forbidden as primary framing. Replace with "Hormone & Recovery Check." |
| **"Comprehensive" / "Complete"** | Forbidden — overpromises panel breadth. |
| **Joint symptoms qualifier** | MUST fire before Collagen CTA (same as Kit 2). |
| **hs-CRP > 10 referral** | MUST display (same as Kit 2). |
| **Ashwagandha** | Silent ingredient. No copy mention. |
| **EFSA claims** | Daily Stack (V7.2): zinc, D3, Active B12 (Methylcobalamin) (per Kit 1 + Kit 2). Collagen: vitamin C / cartilage. |

---

## 8. Launch Operations

### Lab partner (Vitall)

- 9-marker panel — confirmed feasibility with Vitall April 2026
- COGS: £98.00 fully loaded
- API integration shared with Kit 1 and Kit 2
- Same dispatch/results timing

### Staged launch logic

Kit 3 launches **Week 8** (after Kit 1 at Week 0 and Kit 2 at Week 6). Reasons:
- Allow Kit 1 and Kit 2 funnels to stabilise before adding the premium tier
- Reduce operational complexity at launch
- Build email list of Kit 1/Kit 2 buyers as primary Kit 3 audience (high-LTV upgrade path)
- Gate 0B check at Week 10 confirms supplement conversion is healthy before pushing Kit 3 volume

### Pricing operations

- £179 RRP on canonical site and direct LP variants
- £161.10 with PT/influencer 10% code via FirstPromoter
- Stripe checkout handles discount via FirstPromoter integration
- Kit 3 has the highest absolute margin per sale; PT incentive on Kit 3 includes +£10 bonus (see `commission-structure.md`)

### PT-specific operations for Kit 3

- Asset pack includes Kit 3-specific Reel script and caption
- PT Kit 3 upsell bonus (+£10 per Kit 3 sale) activated in FirstPromoter
- PT-only newsletter Week 7 promotes Kit 3 launch with sample copy + bonus reminder

---

## 9. Strategic Role

Kit 3 plays **two roles simultaneously:**

1. **Premium entry product** for ICP 3 (Curious Maintainer) — captures men who want a baseline without specific symptoms
2. **Premium upgrade path** for the Kit 1 / Kit 2 buyer who wants the full picture (post-result email retargeting)

Volume math:
- M2 (Week 8 launch): 4–8 Kit 3 sales/month
- M3: 8–15 Kit 3 sales/month (~10–15% of total kit volume)
- M6: 15–25 Kit 3 sales/month (~12–18% of total volume)

**Margin contribution:** Kit 3 is small in volume but disproportionately large in margin per kit. ~25% of net contribution from ~12–15% of volume.

---

## 10. Open Items

1. Threshold values formally captured in `results-engine/thresholds.md` (placeholder)
2. Joint symptoms qualifier UX (shared with Kit 2 — `results-engine/qualifier-logic.md` placeholder)
3. Kit 3 results dashboard view — most complex of the three (9 markers, multiple CTAs possible) — design iteration ongoing
4. Kit 2 → Kit 3 retargeting email — needs copy in `09_website-app/frontend/email-templates/`
5. MediChecks Well Man comparison page — explicit comparison content to host on canonical site
6. Kit 3 launch announcement — Week 8 PR/social plan needed
7. Kit 3 brand differentiation in copy — the "9 markers, not 15" positioning needs constant reinforcement
8. Pricing benchmark in copy: define exact MediChecks comparison ("MediChecks Well Man Test £89–149, 15+ markers" vs "Andro Prime Kit 3 £179, 9 markers + GP interpretation")

---

*Compiled: April 2026*
*Owner: Keith Antony*
*Version: V7.2 (premium pricing reconciled)*
*Cross-references: catalogue V7.2, ICP alignment doc, products CONTEXT, compliance CONTEXT*
