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
│   ├── formulation-evidence-review-2026-07-02.md ← RCT/meta-analysis evidence base for dose/form (R&D). Proposed changes + safety flags → STATE.md
│   └── peptide-opportunity-analysis.md        ← Collagen supplement + post-CQC peptide opportunity
└── results-engine/
    ├── thresholds.md                          ← Biomarker bands: Ewa-APPROVED 2026-06-16, reconciled into classifier.ts. SOURCE OF TRUTH for result-state cut-points.
    ├── results-to-product-mapping.md          ← POPULATED v1 (Phase 0a): result state → CTA routing
    ├── conversion-rules.md                    ← POPULATED v1 (Phase 0a): conversion-event target per result state
    ├── qualifier-logic.md                     ← Joint symptoms qualifier, CRP branching logic (PLACEHOLDER: not yet written)
    └── dashboard-copy.md                      ← PLACEHOLDER: not yet written. Approved result-card copy currently lives in biomarker-copy.md
```

---

## How to Work Here

### Writing copy or dashboard logic for a product

1. Read `icp-kit-supplement-alignment-april2026.md` first — it defines the correct selling frame, cross-sell triggers, and dashboard flow. Where it conflicts with earlier docs, it takes precedence.
2. Check the Results-Engine Trigger Rules table below for the correct CTA to fire.
3. Check `results-engine/biomarker-copy.md` for approved result-card copy before writing new ones (`dashboard-copy.md` is an empty placeholder).
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
3. The joint symptoms qualifier and hs-CRP branching gates must fire before supplement CTAs. (`results-engine/qualifier-logic.md` is a placeholder; the live qualifier gate lives in `results-to-product-mapping.md` + `icp-kit-supplement-alignment-april2026.md`.)
4. Founding-member CTA rules are non-negotiable. See the Trigger Rules table below and Special Cases. The mechanic is a non-cash email opt-in (founding-member list); the £75 deposit was shelved 2026-05-08.
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
| Kit 1: Testosterone Health Check | £99 | £58.50 | 40.9% | No | Phase 0 launch |
| Kit 2: Men's Energy & Recovery Check | £119 | £63.00 | 47.1% | No | Phase 0, Week 6 |
| Kit 3: Men's Hormone & Recovery Check | £179 | £98.00 | 45.3% | No | Phase 0, Week 8 |
| Daily Stack (subscription) | £34.95/mo | £13 | 63% | No | Phase 0, Gate 0A |
| Joint & Recovery Collagen (subscription) | £29.95/mo | £13 | 57% | No | Phase 0, Gate 0A |
| Complete Men's Stack (bundle) | £54.95/mo | £26 | 47% | No | Phase 0, Gate 0A |
| Founding-member List (non-cash opt-in) | £0 | N/A | N/A | No | Phase 0 launch |

> **Pricing updated April 2026** to reconcile with the standalone Phase 0 financial model (`01_strategy/financial-model/phase0-financial-model-v1.xlsx`). Premium positioning (£99/£119/£179) supersedes the earlier value-tier pricing (£29/£44/£69). PT-coded sales receive a 10% customer discount (per `06_marketing/master-plan/phase0-marketing-plan.md` v2.2). See `catalogue/product-catalogue-v7-1.md` for full rationale.
>
> **Daily Stack price — open decision:** the live price is **£34.95/mo**. A proposed increase to **£39.95/mo** is under consideration for Phase 0b (`10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md` — "Lock base subscription price at £39.95", not yet locked). Do not treat £39.95 as live until that decision is made.

---

## Results-Engine Trigger Rules

These rules govern which CTA fires for each result state. They are non-negotiable. Do not improvise CTA logic outside these rules.

The "Primary CTA (Phase 0a)" column reflects the **current v1 routing** with supplements deferred (per `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`). The "Primary CTA (Phase 0b)" column reflects the **v2 reinstatement** when supplements ship — that mapping is currently inactive and will become active when live Stripe Price IDs are configured for Daily Stack, Joint & Recovery Collagen, and Complete Men's Stack. Non-supplement rows are unchanged between phases.

| Result state | Primary CTA (Phase 0a) | Primary CTA (Phase 0b) | Secondary CTA | Notes |
| --- | --- | --- | --- | --- |
| T < 12 nmol/L (Kit 1 or Kit 3) | **GP referral** (`/gp-referral`) — no upsell | GP referral (unchanged) | **None** (no kit/supplement CTA on a low-T card) | **Routing changed 2026-06-04 (Ewa CA-014), live in `classifier.ts`.** Low T routes to GP referral, NOT the founding-member list. Consent-gated nurture capture sits alongside (pending solicitor lawful-basis). The `<12` band is split into three sub-bands (severely-low <5.2 → +endocrinology flag; low 5.2–8; equivocal 8–12) — all GP-route. Decision: `results-engine/2026-06-04-low-t-routing-decision.md`. |
| T 12–<15 nmol/L borderline (Kit 1 or Kit 3) | Supplement waitlist (`interested_in_product = daily-stack`) + borderline nurture opt-in (seq-03d) | Daily Stack | Kit 3 upsell (if Kit 1 buyer, normal/ambiguous only) | Borderline framing — "worth monitoring". Card stays `normal-testosterone`; not a clinical reclassification. |
| T normal, all markers in range | Supplement waitlist (`interested_in_product = daily-stack`) | Daily Stack | Retest in 6 months | No medicinal-claim framing |
| Low Vit D or Low B12 (Kit 2 or Kit 3) | Supplement waitlist (`source_marker = low-vitamin-d` or `low-b12`, `interested_in_product = daily-stack`) | Daily Stack | — | EFSA claims only. Honest OTC suggestion shown alongside the waitlist CTA in Phase 0a. |
| Elevated hs-CRP 1–10 mg/L + joint symptoms confirmed | Supplement waitlist (`interested_in_product = collagen`) | Joint & Recovery Collagen | None in Phase 0a; Daily Stack in Phase 0b | Qualifier must fire before CTA. Never skip the joint symptoms gate. |
| Elevated hs-CRP > 10 mg/L | GP referral prompt | GP referral prompt (unchanged) | No supplement / waitlist CTA | hs-CRP > 10 is a clinical signal, do not cross-sell |
| Low Ferritin (Kit 2 or Kit 3) | GP referral prompt | GP referral prompt (unchanged) | — | Ferritin deficiency requires clinical investigation |
| 2+ deficiencies (Kit 2 or Kit 3) | Supplement waitlist (`source_marker = multi-deficiency`, `interested_in_product = complete-mens-stack`) | Complete Men's Stack | Kit 1 cross-sell (if Kit 2 buyer) | Bundle waitlist / upsell only when 2+ markers are out of range |
| Quiz complete, no purchase | Recommended kit CTA | Recommended kit CTA (unchanged) | — | Kit recommendation from `customer.quiz_recommended_kit` |

**Phase 0a footnote:** In Phase 0a, the supplement-waitlist CTA writes a row to the `supplement_waitlist` table and emits the `supplement_waitlist_joined` CIO event (payload: `email`, `source_marker`, `source_kit`). On launch in Phase 0b, the rows that say "Supplement waitlist" revert to direct supplement CTAs as listed in the Phase 0b column, and the waitlist form survives as a secondary opt-in on supplement landing pages only. The GP-referral and quiz rows do not change phase to phase.

---

## Special Cases

**`icp-kit-supplement-alignment-april2026.md` authority:** This file is the output of a full ICP-vs-product alignment review (April 2026). It defines the correct selling frame for each kit, the cross-sell architecture, the revised dashboard selling principle, and compliance implications for copy. Where it conflicts with `non-regulated-tier-v7.md` or the product catalogue on copy and UX decisions, this file takes precedence.

**Kit 1 copy scope:** Kit 1 tests testosterone only (T, SHBG, FAI, Albumin, Free T). Do not frame Kit 1 as explaining general fatigue, energy symptoms, or recovery — those belong to Kit 2 and Kit 3. The correct frame is: "Find out if testosterone is the cause." The broader symptom attribution is a Kit 2/Kit 3 sell. Getting this wrong produces a negative review scenario (man buys Kit 1, T is normal, gets Daily Stack, still feels terrible because the cause was Vit D or B12).

**Kit 3 positioning (locked 2026-05-26):** Kit 3 is now the **Kit 1 post-result upsell**, not an ICP-3 standalone entry product. Surfaced on the Kit 1 results dashboard when results suggest the wider panel (energy / recovery / inflammation) is the right next step. `/lp/hormone-recovery` survives for direct traffic. Kit 3 from Kit 2 is conditional (2+ deficiencies). Do not bundle Kit 3 at a discount with any other kit. **Kit 3 Plus** (a wider tier adding the metabolic stack — HbA1c, Fasting Insulin, ApoB, Homocysteine, lipid panel; ~14–16 markers, provisional £229–249) is deferred 1-2 weeks post-launch as a separate workstream (spec `kits/kit-3-plus.md`; supersedes the old standalone `kit-4-metabolic-health-check.md`). Current Kit 3 spec (9 markers / £179) is unchanged for launch. Full reasoning: `icp-kit-supplement-alignment-april2026.md` Section 2 Kit 3 + `kits/kit-3-hormone-recovery-check.md` Section 9.
> **Refinement 2026-06-04:** the Kit 3 / Kit 3 Plus upsell is for **normal / ambiguous** results only — a definitive low-T (T<12) has no ambiguity, so it does **not** route to Kit 3. Low-T routing changed to GP referral + nurture (see the Founding-member CTA flag below). Kit 3's old "GP-led / interpreted report" differentiator is retired (Ewa signs off the system, not individual reports — see `/03_compliance/CONTEXT.md`); Kit 3 Plus is sold on **panel breadth**, not interpretation depth.

**Low-T routing (changed 2026-06-04, Ewa CA-014 — verified live in code):** A clinically-low testosterone result (**T < 12**) routes to a **GP referral** with **no kit or supplement upsell** on that card — a definitive low-T has no ambiguity to resolve. The `<12` band splits into three sub-bands in `classifier.ts` (severely-low <5.2 → endocrinology flag in copy; low 5.2–8; equivocal 8–12), all GP-routed. A consent-gated nurture capture sits alongside the referral (build pending the solicitor's lawful basis). This **superseded** the old "T<12 → founding-member list" routing. The founding-member list still exists as a standalone non-cash opt-in (`/founding-member`), but is **no longer** the low-T results CTA. Never infer low T from Kit 2 energy/recovery markers. Decision doc: `results-engine/2026-06-04-low-t-routing-decision.md`. The £75 deposit was shelved 2026-05-08. Compliance + product-integrity rule — see `/03_compliance/CONTEXT.md`.

**Joint symptoms qualifier:** The Joint & Recovery Collagen CTA requires two conditions to be met: elevated hs-CRP (1–10 mg/L) AND joint symptoms confirmed via the dashboard qualifier question. Do not fire the Collagen CTA without the qualifier gate. The qualifier logic lives in `results-engine/qualifier-logic.md`.

**`results-engine/` file status (corrected 2026-07-02):** `thresholds.md` (Ewa-APPROVED 2026-06-16, reconciled into `classifier.ts`), `results-to-product-mapping.md`, and `conversion-rules.md` are **populated and authoritative** for result-state bands and CTA/conversion routing. Per-biomarker result-card copy is in `biomarker-copy.md`; Kit 3 combined-result precedence in `kit3-combined-result-rule.md`; the low-T routing decision in `2026-06-04-low-t-routing-decision.md`. Only **`qualifier-logic.md` and `dashboard-copy.md` remain empty placeholders** — until they are written, the joint/CRP qualifier gate lives in `results-to-product-mapping.md` + `icp-kit-supplement-alignment-april2026.md`, and dashboard card copy in `biomarker-copy.md`.

**Daily Stack — ashwagandha:** Ashwagandha KSM-66 is in the Daily Stack formulation. It is a silent ingredient. Do not mention it in any product copy, email, social, or affiliate brief. See `/03_compliance/CONTEXT.md`.

**Gate 0A:** Supplement products (Daily Stack, Collagen, Bundle) are not ordered until Gate 0A is met: **25+ supplement pre-orders** (the deposit mechanic was shelved 2026-05-08 — counted by first paid subscription invoice, per `10_launch-ops/implementation-checklists/qa-gates.md`; distinct from the founding-member list). Do not imply these products are in stock before Gate 0A is confirmed.

**Supplement formulation evidence base:** Dose/form decisions are grounded in `supplements/formulation-evidence-review-2026-07-02.md` (human RCTs / meta-analyses, PMIDs verified). Two durable rules from it:

- **RCT evidence never relaxes an external claim.** All customer-facing copy stays inside the EFSA authorised-claims list regardless of trial strength; ashwagandha stays silent. Trials inform the *product*, not the *claims*.
- **Recommendations are deficiency-targeted.** For zinc, vitamin D and B12 the RCT benefits appear almost entirely in *deficient* subjects and are null in replete people — so recommend each ingredient only to men whose kit shows the matching deficiency (where the evidence holds), and never promise a felt benefit to a general/replete audience. This is the formulation-science backing for the deficiency-triggered results-engine CTAs.

**Proposed formulation changes are NOT approved** — every dose/form change in the review needs Ewa (safety/claims) + manufacturer sign-off. Current live specs (Daily Stack, Collagen) stand until then. Working list of proposals, safety flags, and open decisions: `STATE.md`.

**Kit 1 & Kit 2 promoted at equal pace (Option 4, locked 2026-05-08):** Under Option 4 both kits share the same architecture (test → result → result-mapped Daily Stack subscription), so neither leads over the other — they enter on different narratives (Kit 1 = testosterone / "GP told me I was fine"; Kit 2 = energy-recovery / "your levels, not your programme") and self-select. Kit 3 is a premium upsell on top of both. The old "Kit 2 leads, Kit 1 is the FM funnel" framing is superseded. Applies to product pages, partner ICP (two parallel Tier-A segments), and the 40/40/20 content grid (`06_marketing`).

---

## Future Kit Roadmap

Forward-looking product decisions. **Demand/gap for any new panel: consult `06_marketing/seo-ai-search/portfolio-demand-gap-map.md` FIRST** (single source of truth — live/imminent/parked/rejected, with DataForSEO demand + SERP gap). Seed demand from *customer* language (symptoms), not marker names.

- **Sequence (locked 2026-05-27):** Kit 3 Plus (T+1–2 wk) → **Kit 5 Thyroid** (T+6–8 wk; anchor `private thyroid test` 880 vol / KD 11 — one of the easiest targets in the SEO universe; natural Kit 2 upgrade). **Kit 6 Cortisol parked** until Ben (Vitall) confirms dried-blood-spot cortisol is viable (clinically preferred is 4-sample saliva). No Kit 5 spec doc exists yet.
- **Liver** is a large underserved head term (`liver function blood test` ~18,100/mo, KD 18): either fold liver markers (ALT/GGT/ALP/bilirubin) into Kit 3 Plus or run a standalone Liver Health Check (~£69–89). Brief: `kits/liver-health-opportunity.md`.
- **Prolactin** = low-cost add to Kit 1 (1,600 vol / KD 23) if Vitall can include it with no operational impact — ask Ben.
- **Biomarker → EFSA-supplement loops** (Phase 0 self-sustaining, no CQC dependency): lead loop = **Omega-3 Index → Omega-3 (EPA/DHA)** (finger-prick + retestable, EFSA heart/brain/BP/triglyceride claims, strong demand). Analysis: `supplements/biomarker-supplement-loops.md`.
- **Kit-design constraint — haemolysis:** mail-in finger-prick samples partially haemolyse in transit, so intracellular / RBC-rich analytes read falsely high. **Magnesium (~99% intracellular) and potassium are unreliable on this model** (this is the hard analytical reason Mg is not a kit marker and was pulled from the Daily Stack — not a preference). Screen every candidate marker for haemolysis sensitivity + tight time-to-lab before assuming Vitall can run it postally (LFTs, lipids, HbA1c, TSH, serum cortisol are fine; Mg/K are not).

### Explicitly DO NOT build

1. **Food intolerance panel** — real demand but the SERP is dominated by NHS/BBC/Which/BDA warning IgG tests are unreliable; building it puts us on the wrong side of consumer-protection authorities and contradicts the data-first brand.
2. **Standalone PSA** — cancer-screening authority dominance + heavy compliance burden. Could sit inside a comprehensive panel with proper Ewa clinical framing, never as a standalone marketing product.
3. **STI panels** — different sample model (urine/swab), different brand category and competitor set; volume doesn't justify it.
4. **DNA / nutrigenomics** — different product category; dilutes the blood-test brand focus.

---

## Do Not Use This Workspace For

- Campaign strategy or paid media planning (→ `/06_marketing`)
- Visual or UI design (→ `/09_website-app` or `/02_brand`)
- Generic copywriting not anchored to a specific product rule or threshold (→ `/06_marketing/content/`)
- Partner negotiation notes unless they directly change product logic (→ `/05_partners`)
- Post-CQC clinical product design (→ `/11_clinical-plugin_post-cqc`)
