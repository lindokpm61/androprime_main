# Products — Context

**Source of truth (read in this order):**

1. `icp-kit-supplement-alignment-april2026.md` — primary authority for all copy and UX decisions. Supersedes earlier docs on copy, cross-sell logic, and dashboard flow.
2. `catalogue/product-catalogue-v7-1.md` — full product catalogue: specs, COGS, margins, regulatory position.
3. `catalogue/non-regulated-tier-v7.md` — Phase 0 non-regulated tier architecture, gate logic, financial forecast.

**Owner workspace:** `04_products`
**Integration:** The results engine, dashboard copy, email sequences, and all CTA logic in `09_website-app/` and `07_sales/` must be consistent with the product docs here. Check this workspace before writing any copy, dashboard recommendation, or CTA trigger.

This workspace defines the product catalogue and the logic that links biomarker results to offers. The results-engine files govern what the dashboard shows and when.

---

## Directory Structure

```text
04_products/
├── icp-kit-supplement-alignment-april2026.md  ← PRIMARY SOURCE OF TRUTH for copy and UX. Read first.
├── catalogue/
│   ├── product-catalogue-v7-1.md              ← Full catalogue: all products, specs, COGS, margins, status
│   └── non-regulated-tier-v7.md               ← Phase 0 tier architecture, gate logic, financial forecast
├── kits/
│   ├── kit-1-testosterone-health-check.md     ← Kit 1 spec: T, SHBG, FAI, Albumin, Free T
│   ├── kit-2-energy-recovery-check.md         ← Kit 2 spec: Vit D, Active B12, hs-CRP, Ferritin
│   ├── kit-3-hormone-recovery-check.md        ← Kit 3 spec: all 9 markers (Kit 1 + Kit 2 panel)
│   └── kit-1-launch-guide.md                  ← Lab negotiations, Supabase schema, results report design
├── supplements/
│   ├── daily-stack.md                         ← Daily Stack formulation, dosing, EFSA claims
│   ├── joint-recovery-collagen.md             ← Joint & Recovery Collagen spec and trigger rules
│   └── peptide-opportunity-analysis.md        ← Collagen supplement + post-CQC peptide opportunity
└── results-engine/
    ├── thresholds.md                          ← Biomarker threshold values (placeholder — populate from catalogue)
    ├── results-to-product-mapping.md          ← Which result → which product CTA (placeholder)
    ├── conversion-rules.md                    ← Primary/secondary CTA logic per result state (placeholder)
    ├── qualifier-logic.md                     ← Joint symptoms qualifier, CRP branching logic (placeholder)
    └── dashboard-copy.md                      ← Approved copy blocks for results dashboard panels
```

---

## How to Work Here

### Writing copy or dashboard logic for a product

1. Read `icp-kit-supplement-alignment-april2026.md` first — it defines the correct selling frame, cross-sell triggers, and dashboard flow. Where it conflicts with earlier docs, it takes precedence.
2. Check the Results-Engine Trigger Rules table below for the correct CTA to fire.
3. Check `results-engine/dashboard-copy.md` for approved copy blocks before writing new ones.
4. Check `/03_compliance/CONTEXT.md` for EFSA claims and red-flag language before any supplement or kit copy is saved.
5. Kit 1 copy scope is strictly limited to testosterone — do not frame it as explaining general fatigue or energy symptoms. That belongs to Kit 2 and Kit 3. See Special Cases.

### Adding or modifying a product

1. Update `catalogue/product-catalogue-v7-1.md` first — this is the canonical record of all products, prices, COGS, and margins.
2. Update the relevant kit or supplement spec file in `kits/` or `supplements/`.
3. If the change affects results-engine routing, update the relevant `results-engine/` files and cross-check against email sequences in `09_website-app/frontend/email-templates/`.
4. If a supplement formulation changes, check whether `icp-kit-supplement-alignment-april2026.md` needs updating and whether any EFSA claim is affected. See `/03_compliance/CONTEXT.md`.

### Working on the results engine

1. The authoritative selling principle is: **result → educate → recommend → convert**. Do not invert this sequence.
2. Read `results-engine/results-to-product-mapping.md` for the current result-to-product routing.
3. Read `results-engine/qualifier-logic.md` for the joint symptoms qualifier and hs-CRP branching — these gates must fire before supplement CTAs.
4. Founding member CTA rules are non-negotiable. See the Trigger Rules table below and Special Cases.
5. If a results-engine change introduces a new Liquid variable or user attribute, update the Liquid Variables Reference in `09_website-app/frontend/email-templates/CONTEXT.md` and the `identifyUser()` call in `lib/results/classifier.ts`.

### Updating pricing or thresholds

1. Update `catalogue/product-catalogue-v7-1.md` — it is the pricing source of truth.
2. Update `results-engine/thresholds.md` if a biomarker threshold changes.
3. Cross-check any price change against the financial model in `01_strategy/master-implementation-blueprint.md` (section 3).
4. If a threshold change affects email sequence triggers, update `09_website-app/frontend/email-templates/CONTEXT.md` and the relevant sequence files.

---

## Product Quick Reference

Phase 0 products only. Post-CQC products are defined in the catalogue but must not be marketed as currently available.

| Product | Price | COGS | Margin | CQC required | Launch status |
| --- | --- | --- | --- | --- | --- |
| Kit 1: Testosterone Health Check | £29 | £17 | 41% | No | Phase 0 launch |
| Kit 2: Men's Energy & Recovery Check | £44 | £22 | 50% | No | Phase 0, Week 6 |
| Kit 3: Men's Hormone & Recovery Check | £69 | £35 | 49% | No | Phase 0, Week 8 |
| Daily Stack (subscription) | £34.95/mo | £13 | 63% | No | Phase 0, Gate 0A |
| Joint & Recovery Collagen (subscription) | £29.95/mo | £13 | 57% | No | Phase 0, Gate 0A |
| Complete Men's Stack (bundle) | £54.95/mo | £26 | 47% | No | Phase 0, Gate 0A |
| Founding Member Deposit (refundable) | £75 | £0 | 100% | No | Phase 0 launch |

---

## Results-Engine Trigger Rules

These rules govern which CTA fires for each result state. They are non-negotiable. Do not improvise CTA logic outside these rules.

| Result state | Primary CTA | Secondary CTA | Notes |
| --- | --- | --- | --- |
| T < 12 nmol/L (Kit 1 or Kit 3) | Founding Member Deposit | Daily Stack (honest framing only) | Never trigger founding member from Kit 2 alone |
| T 12–15 nmol/L borderline (Kit 1 or Kit 3) | Daily Stack | Kit 3 upsell (if Kit 1 buyer) | Borderline framing — "worth monitoring" |
| T normal, all markers in range | Daily Stack | Retest in 6 months | No supplement required framing |
| Low Vit D or Low B12 (Kit 2 or Kit 3) | Daily Stack | — | EFSA claims only |
| Elevated hs-CRP 1–10 mg/L + joint symptoms confirmed | Joint & Recovery Collagen | Daily Stack | Qualifier must fire before CTA. Never skip the joint symptoms gate. |
| Elevated hs-CRP > 10 mg/L | GP referral prompt | No supplement CTA | hs-CRP > 10 is a clinical signal — do not cross-sell |
| Low Ferritin (Kit 2 or Kit 3) | GP referral prompt | — | Ferritin deficiency requires clinical investigation |
| 2+ deficiencies (Kit 2 or Kit 3) | Complete Men's Stack | — | Bundle upsell only when 2+ markers are out of range |
| Quiz complete, no purchase | Recommended kit CTA | — | Kit recommendation from `customer.quiz_recommended_kit` |

---

## Special Cases

**`icp-kit-supplement-alignment-april2026.md` authority:** This file is the output of a full ICP-vs-product alignment review (April 2026). It defines the correct selling frame for each kit, the cross-sell architecture, the revised dashboard selling principle, and compliance implications for copy. Where it conflicts with `non-regulated-tier-v7.md` or the product catalogue on copy and UX decisions, this file takes precedence.

**Kit 1 copy scope:** Kit 1 tests testosterone only (T, SHBG, FAI, Albumin, Free T). Do not frame Kit 1 as explaining general fatigue, energy symptoms, or recovery — those belong to Kit 2 and Kit 3. The correct frame is: "Find out if testosterone is the cause." The broader symptom attribution is a Kit 2/Kit 3 sell. Getting this wrong produces a negative review scenario (man buys Kit 1, T is normal, gets Daily Stack, still feels terrible because the cause was Vit D or B12).

**Founding member deposit CTA:** This CTA is only ever triggered by a confirmed testosterone result of T < 12 nmol/L from Kit 1 or Kit 3. It is never triggered by Kit 2 results alone. Never infer low T from energy or recovery markers. This is both a compliance rule and a product integrity rule — see `/03_compliance/CONTEXT.md`.

**Joint symptoms qualifier:** The Joint & Recovery Collagen CTA requires two conditions to be met: elevated hs-CRP (1–10 mg/L) AND joint symptoms confirmed via the dashboard qualifier question. Do not fire the Collagen CTA without the qualifier gate. The qualifier logic lives in `results-engine/qualifier-logic.md`.

**`results-engine/` placeholder files:** `thresholds.md`, `conversion-rules.md`, `results-to-product-mapping.md`, and `qualifier-logic.md` are currently placeholders. The authoritative threshold and trigger data lives in `icp-kit-supplement-alignment-april2026.md` and `catalogue/product-catalogue-v7-1.md` until these files are populated.

**Daily Stack — ashwagandha:** Ashwagandha KSM-66 is in the Daily Stack formulation. It is a silent ingredient. Do not mention it in any product copy, email, social, or affiliate brief. See `/03_compliance/CONTEXT.md`.

**Gate 0A:** Supplement products (Daily Stack, Collagen, Bundle) are not ordered until Gate 0A is met: 25+ pre-orders with deposits. Do not imply these products are in stock before Gate 0A is confirmed.

---

## Do Not Use This Workspace For

- Campaign strategy or paid media planning (→ `/06_marketing`)
- Visual or UI design (→ `/09_website-app` or `/02_brand`)
- Generic copywriting not anchored to a specific product rule or threshold (→ `/06_marketing/content/`)
- Partner negotiation notes unless they directly change product logic (→ `/05_partners`)
- Post-CQC clinical product design (→ `/11_clinical-plugin_post-cqc`)
