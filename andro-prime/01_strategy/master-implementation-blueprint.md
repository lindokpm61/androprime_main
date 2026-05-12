# ANDRO PRIME
## Master Implementation Blueprint
### Wellness-First Revenue Engine — Phase 0 to CQC Activation

| | | |
|---|---|---|
| **Version:** Final Working Baseline | **Date:** April 4, 2026 | **Owner:** Keith Antony |

---

> **Document Status:** Treat this as the fixed implementation baseline. Change it only if real-world evidence, regulatory advice, or material commercial underperformance requires a revision. This document supersedes all previous versions including V6.1 and the March 2026 Product 1 Launch Guide.

---

## Contents

1. [Strategic Overview](#1-strategic-overview)
2. [Product Architecture](#2-product-architecture)
3. [Financial Model — Baseline Planning Case](#3-financial-model--baseline-planning-case)
4. [Lab Partner Strategy](#4-lab-partner-strategy)
5. [Customer Journey and Results Engine](#5-customer-journey-and-results-engine)
6. [Implementation Roadmap](#6-implementation-roadmap)
7. [Pre-Launch Compliance Checklist](#7-pre-launch-compliance-checklist)
8. [Operating Dashboards and KPIs](#8-operating-dashboards-and-kpis)
9. [Risk Register](#9-risk-register)
10. [Immediate Next Actions](#10-immediate-next-actions)
11. [Governing Principles](#11-governing-principles)

---

## 1. Strategic Overview

### 1.1 What This Business Is

Andro Prime is a UK men's health brand operating in two sequential modes under one customer-facing identity. The wellness mode launches first and generates revenue, builds brand trust, and creates a validated patient pipeline while CQC registration is in progress. The clinical mode activates after CQC approval as a governed plugin to the existing business — not a redesign of it.

This is not a clinic waiting room with a wellness veneer. The wellness mode is a genuine commercial operation that must stand on its own economics before CQC arrives.

---

### 1.2 Entity Structure

Two legal entities operate under one customer-facing brand:

| Entity | Owner | Role | Owns |
|---|---|---|---|
| **Prima Medical Group Ltd** | Keith (100%) | Platform, operations, wellness products | Brand IP, automation, supplement P&L, kit economics, all non-clinical revenue |
| **Andro Prime Ltd** | Keith (50%) + Ewa (50%) | CQC-registered clinical operations | CQC registration, clinical protocols, patient records, TRT prescribing |

The Andro Prime brand is licensed by Prima Medical Group to Andro Prime Ltd. This licence must be formally documented before launch. All wellness product revenue (kits, supplements, deposits) flows through Prima Medical Group. Clinical revenue flows through Andro Prime Ltd post-CQC.

> **Critical Brand Risk:** The Andro Prime name publicly signals TRT intent. All pre-CQC public content, product pages, and emails must be completely scrubbed of treatment references. The founding member CTA (non-cash marker; £75 deposit shelved 2026-05-08) must not frame itself as a pre-sale for a regulated service. Ewa must review all results page copy before launch. See Section 7 (Compliance Checklist) for full requirements.

---

### 1.3 Two Operating Modes (reframed 2026-05-08 — Option 4 lock + FM deposit shelving)

> **Reframe note (2026-05-08):** Phase 0 (Mode A — Wellness) operates under **Option 4** (kit-led entry → result → supplement-subscription architecture; locked 2026-05-08). Kit 1 and Kit 2 are promoted at equal pace; both share the same test → result → supplement-subscription path. The Founding Member £75 cash deposit was shelved 2026-05-08 — Phase 0 cash-flow no longer depends on deposit float. FM continues as a non-cash opt-in marker (waitlist signup, expression of intent for clinical TRT priority access at launch). The "founding member waitlist (correctly framed)" entry below refers to this non-cash mechanic.

| Mode | Status | Permitted | Prohibited |
|---|---|---|---|
| **Mode A — Wellness** | Live from launch | Sell kits and supplements, wellness results, lifestyle education, retest reminders, GP referral signposting, founding member marker / waitlist (non-cash opt-in; correctly framed) | Diagnose, prescribe, imply treatment eligibility, offer remote medical advice, frame software outputs as medical decisions |
| **Mode B — Clinical** | Post-CQC only | Regulated intake, confirmatory testing, clinician assessment, diagnosis, prescribing, monitoring, pharmacy coordination | Everything in Mode A that crosses into regulated territory — this split is non-negotiable |

---

### 1.4 Locked Strategic Decisions

These decisions are fixed for implementation. They do not get revisited unless material commercial evidence or regulatory advice forces a change.

| Decision | Position |
|---|---|
| Brand architecture | One customer-facing brand, two operating modes |
| Launch sequence | Wellness mode first, clinical mode post-CQC |
| Launch product set | Three kits and two supplements |
| Supplement 3 | Deferred — only launched if evidence justifies it |
| Financial stance | Baseline planning case (not optimistic) |
| Clinical structure | Post-CQC plugin, ring-fenced from wellness |
| Entity structure | Two entities — Prima (wellness ops) and Andro Prime (clinical) |
| Lab partner | Vitall confirmed (2026-05-01) — neutral infrastructure, no treatment arm. Thriva originally preferred (Section 4) but superseded. |
| Phase 0 architecture | **Option 4 — kit-led entry → result → supplement-subscription** (locked 2026-05-08) |
| Kit pacing in Phase 0 | **Kit 1 and Kit 2 promoted at equal pace** (Option 4 equal-pacing principle, locked 2026-05-08). Earlier "Kit 2 leads" framing superseded. |
| FM deposit | **£75 cash deposit shelved 2026-05-08.** FM continues as non-cash opt-in marker. |

---

## 2. Product Architecture

### 2.1 Core Principle: Test — Reveal — Recommend — Convert

Every kit surfaces specific deficiencies that map directly to Andro Prime supplement products. The results report acts as a personalised supplement recommendation backed by blood data — fundamentally different from a customer browsing generics. The test creates the demand. The supplement fills it. No competitor in the UK men's health space is running this closed-loop model.

---

### 2.2 Kit Range

| Kit | Target Customer | Price | Panel | Primary Output |
|---|---|---|---|---|
| **Kit 1 — Testosterone Health Check** | Men 35–60 concerned about low T | £99 (was £35 standard / £29 launch — superseded by v2.2 premium positioning) | Total Testosterone, SHBG, Free Androgen Index (FAI), Albumin, Free Testosterone | Low T — founding member deposit / TRT pipeline. Normal T — Daily Stack recommendation |
| **Kit 2 — Energy & Recovery Check** | Active men 35–60 with fatigue or slow recovery | £119 (was £44 — superseded by v2.2) | Vitamin D, Active B12, hs-CRP, Ferritin | Each deficiency maps to a specific supplement — primary commercial engine |
| **Kit 3 — Hormone & Recovery Check** | Health-conscious men 35–65 wanting a full MOT | £179 (was £69 — superseded by v2.2) | Full Kit 1 panel + Full Kit 2 panel (9 markers total) | Strongest case for bundle — multiple deficiencies shown simultaneously |

> **Kit 1 Pricing Rationale:** Medichecks and Forth sell basic testosterone tests from £39–49. At £35 standard / £29 launch, Kit 1 is at the floor of the market. This is intentional: Kit 1's primary value is pipeline generation, not kit margin. A customer who buys at £29, gets a low-T result, and deposits £75 for founding member access is worth far more than the £10–15 kit margin suggests. Do not reduce Kit 1 below £29. If competitors undercut to £25, the personalised results experience and founding member pathway are the reason to choose Andro Prime — not the price. You are not competing on price. You are competing on what happens after the result.

---

### 2.3 Supplement Range

| Product | Format | Sub Price | One-Off | Driven By | COGS Est. |
|---|---|---|---|---|---|
| **Daily Stack** | 30 sachets/month | £34.95 | £39.95 | Kit 1 (normal T), Kit 2 (low D/Mg), Kit 3 (multiple) | **£12** (range £11–17.50; midpoint reconciled 2026-05-08) |
| **Joint & Recovery Collagen** | 30-serving powder tub | £29.95 | £34.95 | Kit 2/3 (elevated hs-CRP, joint stress) | £10–14.50 |
| **Supplement 3** | TBC | TBC | TBC | DEFERRED — evidence gate required | N/A |

---

### 2.4 Supplement Formulations

#### Daily Stack

| Ingredient | Dose | EFSA-Approved Claim |
|---|---|---|
| Zinc | 30mg | Contributes to normal testosterone levels in blood |
| Magnesium Glycinate | 400mg | Contributes to reduction of tiredness and fatigue |
| Vitamin D3 | 4,000 IU | Contributes to normal muscle function |
| Omega-3 EPA/DHA | 1,000mg | Contributes to normal heart function (DHA/EPA 250mg+) |
| Ashwagandha KSM-66 | 600mg | No EFSA claim — wellness positioning only. KSM-66 is a branded ingredient and adds cost vs generic ashwagandha. |

#### Joint & Recovery Collagen

| Ingredient | Dose | Claim Basis |
|---|---|---|
| Hydrolysed Bovine Collagen Peptides (Type I & III) | 10g per serving | Wellness positioning — collagen formation, joint support |
| UC-II Undenatured Type II Collagen | 40mg | Joint-specific — undenatured format, low dose required |
| Vitamin C | 80mg | EFSA: Contributes to normal collagen formation for cartilage |

---

### 2.5 Supplement 3 — Expansion Rule

Supplement 3 is formally deferred. It can only be launched if evidence shows a clear incremental benefit to average order value, retention, or bundle take-up. It should not be added to make the range look fuller.

**Gate criteria before Supplement 3 is considered:** Kit-to-supplement conversion consistently above 15% AND supplement subscriber churn below 8%/month.

---

## 3. Financial Model — Baseline Planning Case

> **Financial Stance:** These figures are the baseline planning case — not optimistic projections. The wellness engine is justified if it produces positive lean cash contribution while validating demand. Judge the business against these numbers, not the higher figures in earlier model versions. Previous model versions (V5, V6.1) showed higher figures (£40k revenue / 6 months). Those were directional ceilings. This section is the honest baseline from which to operate.

---

### 3.1 COGS — Research-Validated Estimates

These figures are triangulated from market research (March–April 2026) and should be treated as estimates until lab partner and manufacturer quotes are received.

#### Test Kit COGS

| Kit | Retail Price | Est. COGS (lab + kit + postage) | Gross Margin £ | Gross Margin % |
|---|---|---|---|---|
| Kit 1 — Testosterone Baseline | £99 (was £35 / £29 launch — v2.2) | £14–18 | £81–85 | 82–86% |
| Kit 2 — Energy & Recovery | £119 (was £44 — v2.2) | £18–24 | £95–101 | 80–85% |
| Kit 3 — Foundations Check | £179 (was £69 — v2.2) | £28–36 | £143–151 | 80–84% |

> **COGS Risk:** At launch volumes (30–80 kits/month), lab partners will charge near-list rates. Volume discounts typically activate at 300–500 kits/month. Budget for the higher end of these COGS ranges for the first 6 months. Kit 3 COGS has now been validated against actual Vitall pricing (lab partner confirmed 2026-05-01). The old £69 retail concern is superseded — Kit 3 is now £179 under v2.2 premium positioning.

#### Supplement COGS

| Product | Sub Price | COGS Components | Est. COGS | Gross Margin £ | Gross Margin % |
|---|---|---|---|---|---|
| Daily Stack | £34.95/month | Manufacturing £5–7.50, Ingredients (incl. KSM-66) £3.50–5, Packaging £1–1.50, Fulfilment £2.50–3.50 | **£12** (range £11–17.50; midpoint reconciled 2026-05-08) | £17.45–22.95 (planning case: £22.95 at £12 midpoint) | 50–66% (planning case: 65.7% at £12 midpoint) |
| Joint & Recovery Collagen | £29.95/month | Collagen peptides £4–6, UC-II + Vit C £1.50–2.50, Packaging £1.50–2, Fulfilment £3–4 | £10–14.50 | £15.45–19.95 | 52–65% |

Note: V7 modelled Daily Stack COGS at £11–13. The research-validated range of £11–17.50 reflects the spread between manufacturer brief midpoint (£12, reconciled 2026-05-08) and higher fulfilment / KSM-66 contingency at the upper bound. Planning case is £12 (midpoint reconciled to manufacturer brief 2026-05-08); upper-bound scenarios still allow blended supplement margin at 50–60% under stress. Earlier £15 planning midpoint superseded.

---

### 3.2 Launch Capital Requirements

This is the critical gap that previous versions did not address. The following capital is required before the first product ships.

| Item | Low Estimate | High Estimate | Notes |
|---|---|---|---|
| Daily Stack — initial manufacturing run (1,000 units) | £4,000 | £6,000 | MOQ negotiation target. Higher MOQ (2,500 units) reduces per-unit cost but increases capital outlay to £9,000–12,500 |
| Joint & Recovery Collagen — initial run (1,000 units) | £3,500 | £5,500 | Powder tubs have higher MOQs at some manufacturers (2,000–5,000 units) |
| Label design and compliance review (per SKU x 2) | £1,600 | £3,000 | FSA-compliant label design. Ewa must review all health claims before print |
| Stability testing (per SKU x 2, required for FSA) | £1,000 | £2,000 | Non-negotiable for legal compliance. Cannot be skipped |
| Lab partner setup / API integration (Vitall) | £0 | £2,000 | Many partners have no setup fee. Budget as a contingency |
| Website build — kit store, results dashboard, checkout | £500 | £2,500 | Keith's automation skills significantly reduce this. Primarily software/tooling costs |
| Packaging design (kit boxes, branded materials) | £800 | £1,500 | If using Vitall white-label fully, packaging cost may be absorbed |
| **TOTAL** | **£11,400** | **£22,500** | Target: structure toward lower end through Vitall white-label and lean MOQs |

> **Capital Sequencing:** If operating capital is limited, launch Kit 1 first (no supplement inventory needed). Place supplement manufacturing order only after Gate 0A confirms kit demand. This reduces peak capital requirement to ~£5,000–8,000 for Kit 1 soft launch, with supplements funded from kit revenue.

---

### 3.3 Phase 0 Revenue Projection — 6-Month Baseline

Assumptions: consistent content output, Kit 1 launches Week 4–5, Kit 2 and Kit 3 staged over following 4 weeks, supplements available from Month 2 subject to Gate 0A.

| Month | Kit 1 Sales | Kit 2 Sales | Kit 3 Sales | Supplement Subs (active) | Deposits | Monthly Revenue Est. |
|---|---|---|---|---|---|---|
| Month 1 | 20 | 0 | 0 | 0 | 8 | ~£760 |
| Month 2 | 30 | 15 | 5 | 6 | 14 | ~£2,450 |
| Month 3 | 35 | 20 | 10 | 14 | 18 | ~£3,800 |
| Month 4 | 40 | 25 | 15 | 22 | 20 | ~£4,900 |
| Month 5 | 45 | 30 | 18 | 28 | 18 | ~£5,900 |
| Month 6 | 50 | 35 | 20 | 34 | 16 | ~£6,800 |
| **6-Month Total** | **220** | **125** | **68** | **~34 active by end** | **~94 deposits** | **~£24,600** |

Gross profit at these volumes (blended kit margin ~47%, supplement margin ~58%): approximately **£9,000–11,000** across 6 months.

#### Model Variance vs Previous Versions

| Metric | Previous Model Estimate | Baseline (This Document) | Variance |
|---|---|---|---|
| 6-month revenue | £40,275 | ~£24,600 | -39% |
| 6-month gross profit | £22,350 | ~£9,000–11,000 | -50% |
| Year 1 revenue (wellness only) | £143,000 | ~£70,000–90,000 | -40% |
| Year 1 gross profit (wellness) | £78,000 | ~£35,000–45,000 | -45% |
| Supplement conversion (kit buyers) | 15–25% | 10–15% realistic | Conservative adjustment |
| Launch capital required | Not modelled | £11,400–22,500 | Previously unaddressed |

> **Why This Is Still Worth Doing:** The wellness engine's primary value is not its standalone P&L — it is what it creates for the clinical phase. 94 founding member deposits = 65–80 warm TRT patients at CQC launch (70–85% conversion). Blood test data on 400+ men identifies who actually has low T. 34 supplement subscribers entering Phase 1 = ~£1,200/month MRR at no further CAC. At baseline, the wellness engine costs Keith very little (time-subsidised) and delivers a validated, pre-qualified pipeline that transforms Month 1 of clinical operations.

---

### 3.4 Year 1 Combined Projection (Wellness + Clinical)

CQC approval assumed at Month 8–10 of Year 1.

| Phase | Period | Revenue Driver | Est. Revenue |
|---|---|---|---|
| Phase 0 — Wellness only | Months 1–6 | Kits + supplements + deposits | £24,600 |
| Phase 0 continued | Months 7–9 (pre-CQC) | Kits + supplements + growing sub base | ~£22,000–28,000 |
| Phase 1 — Clinical activation | Months 10–12 | 60–80 founding members converting to TRT | ~£30,000–48,000 |
| **Year 1 Total (combined)** | **Full year** | **Wellness + early clinical** | **~£76,000–100,000** |

---

### 3.5 Exit Valuation — Unchanged Framework

The exit valuation framework from V6.1 remains valid. The wellness tier's lower near-term revenue does not materially affect Year 7 exit value — exit multiples are applied to Year 7 EBITDA, not Phase 0 revenue.

| Scenario | Probability | Year 7 EBITDA | Multiple | Enterprise Value | Family Total (post-tax) |
|---|---|---|---|---|---|
| Downside | 20% | £1.4–2.0M | 4.5–6x | £6–12M | £6.5–12M |
| Base | 50% | £5.0–6.0M | 5.5–7x | £28–42M | £28–43M |
| Optimised Base | 25% | £8.5–10M | 6–8x | £51–80M | £50–79M |
| Upside | 5% | £14–18M | 7–10x | £98–180M | £95–170M |

Judge the project on the Base case. Operate to the Optimised Base. The Base case family outcome of £28–43M is achievable if Phase 0 validates demand and CQC is secured.

---

## 4. Lab Partner Strategy

### 4.1 Partner Rankings — Post-Market Consolidation

> **Update (2026-05-01):** Vitall was selected as the lab partner. Thriva was the original frontrunner per the ranking below, but commercial terms and operational fit moved Vitall to #1. The ranking below is preserved as a historical snapshot of the partner evaluation. See `/05_partners/labs/` for the live partner record.

Two acquisitions have eliminated previously viable options:

- **Medichecks acquired Leger Clinic** — they now operate an integrated diagnostic-to-TRT pipeline. They are a direct competitor. Under no circumstances should Andro Prime white-label through Medichecks.
- **One Day Tests operates its own TRT service** — sharing white-label volume data with a competitor that treats patients is a strategic liability. Use for benchmark pricing only. Do not sign.

| Rank | Partner | Status | Reason |
|---|---|---|---|
| **#1** | Thriva Solutions (thrivasolutions.com) | **FRONTRUNNER — Contact first** | Pure diagnostics infrastructure. No treatment arm. Already white-labels Ted's Health (men's hormone testing — your exact model) and LloydsPharmacy Online Doctor. API-first. 5M+ tests. 96.2% sample success rate. UKAS ISO 15189. |
| **#2** | Vitall (vitall.co.uk) | **STRONG BACKUP — Contact in parallel** | No treatment arm. White-labels GenderGP and TR;BE (supplement brand using diagnostics to personalise recommendations). UKAS accredited. Smaller scale — useful as leverage and genuine fallback. |
| **#3** | Forth (forthwithlife.co.uk) | **BENCHMARK ONLY** | Neutral, no TRT service. UKAS accredited. Primarily consumer-facing — limited B2B/white-label capability. Contact for pricing data to use in Thriva negotiation. |
| **#4** | BloodLink / One Day Tests | **BENCHMARK ONLY — DO NOT SIGN** | Vertically integrated (own lab + kit manufacturing) = lowest wholesale cost. Contact for pricing floor data only. Do not enter a contract — conflict of interest risk. |
| **STRUCK OFF** | Medichecks | **COMPETITOR — NOT A PARTNER** | Acquired Leger Clinic. Integrated TRT pipeline. Direct competitor. |

---

### 4.2 Negotiation Targets (historic — Thriva framing, superseded by Vitall)

> The targets below were drafted for the Thriva negotiation in March 2026. Vitall has since been signed (2026-05-01). Preserved as a reference for the original commercial frame; do not treat as live.

| Term | Target | Walk-Away Condition |
|---|---|---|
| Per-kit all-in price (Kit 1 panel) | £12–15 | Above £18 made the old £29 Kit 1 unviable (v2.2 now positions Kit 1 at £99, so this constraint no longer binds) |
| Minimum monthly commitment | No minimum, or <30 kits/month | Above 100 kits/month is too restrictive at launch |
| API access | Included at all tiers | Non-negotiable — without API, you lose the results conversion moment |
| Turnaround SLA | 48–72 hours from sample receipt | Beyond 5 days creates customer experience problems |
| Branding | Full white-label — packaging and results interface | Partial branding (lab logo on results) is unacceptable |
| Contract length | Monthly rolling or 3-month initial | Avoid 12-month+ commitments at launch volumes |
| Exclusivity | None | Any exclusivity clause is a walk-away condition |

---

### 4.3 Non-Negotiable Technical Requirements

- **API results delivery** — customer must view results on Andro Prime branded page, not lab portal. This is where supplement recommendations and founding member CTA live. If the lab controls the results page, you lose the conversion moment and all pipeline tracking.
- **UKAS ISO 15189 accreditation** — required for legal and consumer trust positioning.
- **96%+ sample success rate** — failed samples at 30–40% (industry average) mean angry customers and wasted CAC.
- **Drop-ship direct to customers** — you should not be holding and dispatching kit inventory.
- **Neutral contractual position** — confirm in writing that the lab partner will not use your volume data, conversion rates, or customer data for any commercial purpose.

---

### 4.4 Failed Sample Policy

Must be documented before you take your first order. At 96.2% success rate, 100 kits = ~4 failed samples/month.

| Scenario | Response | Cost Implication |
|---|---|---|
| Sample fails at lab | Free replacement kit within 48 hours. Customer notified within 24 hours of failure confirmed. | Additional COGS £14–18 + postage. Budget 4% of kit sales as failed sample reserve. |
| Customer collection error | First instance: free replacement. Second instance: 50% discount on replacement. Policy stated clearly in kit instructions and order confirmation email. | Reduced cost exposure on repeat errors. |
| Customer requests refund | Full refund within 5 business days. No questions asked. | Accept the loss. A negative review costs more than the refund. |
| Multiple failures from same batch | Alert Vitall immediately. Pause kit sales for that batch. Refund all affected customers proactively. | Negotiate batch-level SLA with Vitall upfront. |

---

## 5. Customer Journey and Results Engine

### 5.1 Pre-CQC Customer Flow

Content > Kit purchase > Home sample collection > Lab processing > Wellness results dashboard > Supplement recommendation (within permitted wording) > Education / nurture sequence > Repeat purchase / subscription > Founding member waitlist (correctly framed) > CQC launch > Clinical assessment pathway

---

### 5.2 Results Engine — What It Can and Cannot Do

The results engine in wellness mode is a rules-based recommendation and education tool. Ewa defines the thresholds. Keith builds the automation. The output is a wellness report, not a medical diagnosis.

**PERMITTED:** Classify result patterns for commercial/customer experience purposes. Surface general wellness commentary. Propose supplements with EFSA-approved claims. Provide lifestyle prompts. Direct to GP follow-up where appropriate.

**PROHIBITED:** Present as making a medical decision. Determine diagnosis. Conclude clinical eligibility for TRT. Use disease labels (hypogonadism, testosterone deficiency). Promise treatment outcomes. Frame a wellness result as a de facto indication for TRT.

---

### 5.3 Results Report Logic — Kit 1 (Testosterone Health Check)

**Panel (5 markers):** Total Testosterone, SHBG, Free Androgen Index (FAI), Albumin, Free Testosterone (calculated from the above).

*All thresholds require Ewa's written sign-off before the results dashboard is built. See Section 7.2.*

| Result Band | Threshold | Report Framing | CTA |
|---|---|---|---|
| Low | <12 nmol/L (BSSM guidance) | Your testosterone is below typical levels. This is worth discussing with a doctor. [Wellness framing — not "you have low testosterone requiring treatment"] | Founding member deposit — framed as priority access to GP-led service launching later this year. Always include GP referral option. |
| Borderline | 12–15 nmol/L | Your levels are at the lower end of the typical range. Lifestyle factors — sleep, stress, training — can influence this significantly. | Daily Stack recommendation + lifestyle content + retest in 3 months |
| Normal | 15–20 nmol/L | Your testosterone is in the normal range. Maintaining healthy levels as you age is worth tracking. | Daily Stack (maintain levels) + retest reminder in 6 months |
| Optimal | >20 nmol/L | Your testosterone looks healthy. Keep doing what you're doing. | Retest reminder in 12 months + general wellness content |

---

### 5.4 Results Report Logic — Kit 2 (Energy & Recovery)

| Biomarker | Trigger Condition | Report Language | Supplement Link |
|---|---|---|---|
| Vitamin D | Below 50 nmol/L | Your vitamin D is below optimal. Between October and March, most UK men do not get enough sunlight to maintain healthy levels. | Daily Stack — contains 4,000 IU Vitamin D3 |
| Active B12 | Below 37.5 pmol/L | Your B12 is below optimal. B12 plays a direct role in energy metabolism and how well your brain functions day to day. | Daily Stack — contains 1,000mcg Methylcobalamin |
| hs-CRP | Above 1.0 mg/L | Your inflammation marker is elevated. In active men, this often reflects joint and connective tissue stress. | Joint & Recovery Collagen — if joint symptoms confirmed via qualifier |
| Ferritin | Below 30 mcg/L | Your iron stores are lower than ideal. This affects energy and recovery. We recommend discussing this with your GP. | No supplement — GP referral only. Iron supplementation without medical supervision carries risk. |
| Multiple deficiencies | 2+ markers flagged | Your results show a few areas worth addressing. Here is what the data suggests. | Complete Men's Stack — Daily Stack + Collagen at £54.95/mo |

---

### 5.5 Follow-Up Email Sequence

| Email | Timing | Subject | Purpose |
|---|---|---|---|
| Email 1 | Day 0 — results ready | Your results are in | Magic link to results dashboard. Nothing else. |
| Email 2 | Day 3 | What your [biomarker] number actually means | Educational. Builds trust. Soft supplement CTA. |
| Email 3 | Day 7 | 3 things that actually move the needle on [relevant health area] | Lifestyle content. Positions Andro Prime as trusted source. CTA to supplement subscription. |
| Email 4 | Day 14 | Have you thought about what is next? | Decision point. Direct but not pushy. Founding member CTA for low-T. Supplement subscription for deficiency results. |
| Email 5 | Day 30 | Time for a check-in | Retest nudge. Subscription renewal if one-off purchase. Social proof if available. |

---

### 5.6 Post-CQC Customer Flow

Existing wellness customers > Explicit clinical consent prompt > Regulated intake questionnaire > Confirmatory testing (venous, if finger-prick results warrant it) > Clinician assessment (Dr Ewa) > Clinical decision > Treatment / monitoring / follow-up.

The handoff from wellness to clinical must be deliberate. No wellness report should read as a de facto referral or treatment recommendation.

---

## 6. Implementation Roadmap

### 6.1 Phase Structure

| Phase | Objective | Key Outputs | Exit Condition |
|---|---|---|---|
| **Phase 0 — Blueprint Lock** | Fix architecture before building | Compliance checklist complete, thresholds signed off, entity docs, privacy notice, deposit terms, failed sample policy | No unresolved architecture or compliance questions |
| **Phase 1 — Core Build** | Website, CRM, checkout, lab integration | Kit 1 product page live, results dashboard built, Stripe checkout, n8n order automation, Supabase data model | System can take a Kit 1 order end-to-end in test |
| **Phase 2 — Controlled Launch** | Kit 1 live to public | Content publishing, Kit 1 orders live, support process tested, first results delivered, Gate 0A tracking active | Stable order handling, first 20+ kits sold |
| **Phase 3 — Full Product Range** | Kit 2, Kit 3, supplements live | All three kits live, supplement inventory received, bundle logic built, Gate 0B tracking | All products purchasable, supplement conversions tracked |
| **Phase 4 — Optimise** | Strengthen unit economics | Conversion rate optimisation, bundle logic, repeat purchase, overhead review, Gate 0C assessment | Lean cash contribution confirmed positive |
| **Phase 5 — Clinical Prep** | Ready for CQC activation | Clinical SOPs, consent architecture, records design, confirmatory lab pathway, clinical governance framework | CQC obtained and all operational gates met |
| **Phase 6 — Clinical Activation** | TRT service live | Founding member conversion, regulated intake live, clinician workflows operational | First patients treated under CQC registration |

---

### 6.2 Week-by-Week Launch Schedule (Phases 0–3)

| Week | Actions | Owner | Gate / Decision |
|---|---|---|---|
| **Week 1** | Send partnership emails to Thriva Solutions and Vitall simultaneously. Send pricing enquiry to BloodLink and Forth (benchmark only). Ewa defines clinical thresholds for Kit 1 report — written sign-off required. *(Historic — Vitall signed 2026-05-01.)* | Keith (emails), Ewa (thresholds) | Threshold document must exist before results dashboard is built |
| **Week 2** | Lab partner discovery calls. Receive BloodLink / Forth pricing for negotiation leverage. Begin website build — homepage, Kit 1 product page, Stripe checkout. Draft Kit 1 results report copy for Ewa compliance review. | Keith | API access confirmed with preferred lab partner |
| **Week 3** | Negotiate and sign lab agreement. Begin n8n automation (payment > lab order > sample tracking). Begin Supabase data model. Finalise privacy notice and GDPR position. | Keith | Lab contract signed |
| **Week 4** | Build Kit 1 results dashboard with conditional logic. Build founding member deposit page with terms. End-to-end test: order > lab > results > CTA. Ewa reviews results page copy. | Keith (build), Ewa (review) | Full test order processed successfully |
| **Week 5** | Soft launch Kit 1 — announce to LinkedIn audience. First paid ads (Meta — men 35–60 UK). Gate 0A tracking begins. Begin supplement manufacturer conversations. | Keith | Gate 0A clock starts |
| **Week 6** | **Gate 0A assessment** — 50+ kits sold AND 25+ founding member deposit enquiries. If GO: place supplement manufacturing order, begin Kit 2 page build. If NO-GO: extend Kit 1 marketing, investigate conversion blockers. | Keith | **Gate 0A GO / NO-GO decision** |
| **Week 7–8** | Launch Kit 2. Build Kit 3 product page. Supplements arrive (if Gate 0A passed). Full product range live by end of Week 8. | Keith | Gate 0B clock starts at Week 10 |
| **Week 10** | **Gate 0B** — 10%+ of Kit 2/3 buyers converting to supplement subscription. Assess results report copy, recommendation prominence, pricing. | Keith | **Gate 0B GO / NO-GO** |

---

### 6.3 Go / No-Go Gates (reframed 2026-05-08 — FM deposit shelved; Option 4 architecture)

> **Reframe note (2026-05-08):** Gate 0A criterion previously read "25+ founding member deposit enquiries." With the £75 deposit shelved 2026-05-08, the equivalent criterion is "25+ FM markers" — non-cash opt-in signups indicating genuine demand for clinical TRT priority access at launch. The "Gate 1 — Clinical" wording about "Contact founding members" is preserved (the cohort exists; the cash mechanic does not). Phase 0 architecture is Option 4 — kit-led entry → result → supplement-subscription, locked 2026-05-08.

| Gate | Timing | Criteria | GO Action | NO-GO Action |
|---|---|---|---|---|
| **Gate 0A** | Week 6 | 50+ total kits sold AND 25+ FM markers (non-cash opt-in; deposit shelved 2026-05-08) | Place supplement manufacturing order. Launch Kit 2. | Extend Kit 1 marketing. Delay supplement order. Investigate conversion. |
| **Gate 0B** | Week 10 | 10%+ of Kit 2/3 buyers converting to at least one supplement subscription | Scale paid ads. Expand Kit 2/3 content. Launch Kit 3. | Revise results report copy. Test alternative recommendation approaches. Review pricing. |
| **Gate 0C** | Month 4 | 150+ total kits sold. 30+ active supplement subscribers. Supplement MRR above £1,000/month. | Full confidence in non-regulated tier. Begin CQC clinical prep in earnest. | Reassess product-market fit. Review kit pricing or supplement formulations. |
| **Gate 1 — Clinical** | CQC approval | CQC registration received. Clinical SOPs complete. Ewa ready to operate. Lab / pharmacy relationships in place. | Activate clinical mode. Contact FM-marker cohort. | Do not activate clinical mode. Identify and resolve blockers. |

---

## 7. Pre-Launch Compliance Checklist

> **This checklist must be completed before Andro Prime takes its first customer order.** Items marked BLOCKER cannot be bypassed — they carry regulatory, legal, or commercial risk that could cause serious damage if they surface post-launch. Each item requires a named owner, a completion date, and a written record of completion.

---

### 7.1 Brand Name and CQC Risk Assessment — BLOCKER

| Requirement | Action Required | Owner | Status |
|---|---|---|---|
| All pre-CQC public content scrubbed of treatment references | Audit every planned LinkedIn post, website page, email sequence, and product description for language that implies diagnosis, treatment, or clinical eligibility. Remove or reframe anything that does. | Keith + Ewa review | `[ ] Complete` |
| Founding-member CTA framing approved | The founding-member list CTA (non-cash email opt-in — £75 cash deposit shelved 2026-05-08) must be framed as priority access to a future clinical service — not a pre-sale for a regulated medical service. Specific language must be approved by Ewa before it goes on the results page. | Ewa sign-off required | `[ ] Complete` |
| Website reviewed for Mode A / Mode B boundary compliance | No pre-CQC page should use the words: diagnose, prescribe, treatment, therapy, medical, clinical, GP-led (without specific wellness framing), TRT, testosterone replacement. All claims must be wellness-framed. | Keith build, Ewa review | `[ ] Complete` |
| Inter-company brand licence documented | Formal document confirming Prima Medical Group Ltd licences the Andro Prime brand to Andro Prime Ltd. Required for exit due diligence and entity separation clarity. | Keith — instruct solicitor | `[ ] Complete` |

---

### 7.2 Ewa's Clinical Threshold Sign-Off — BLOCKER

The results dashboard automation cannot be built until Ewa has defined and signed off the clinical thresholds for every biomarker in every kit. This is a medical decision, not a content review.

| Kit | Biomarker | Threshold Required | Ewa Sign-Off | Date |
|---|---|---|---|---|
| Kit 1 | Total Testosterone | Low / Borderline / Normal / Optimal bands (nmol/L) | `[ ]` | |
| Kit 1 | Free Testosterone (calculated) | Confirm whether separate banding or flag only | `[ ]` | |
| Kit 2 | Vitamin D (25-OH) | Below optimal / optimal / above optimal (nmol/L) | `[ ]` | |
| Kit 2 | Magnesium (serum) | Below range / in range (mmol/L) | `[ ]` | |
| Kit 2 | hs-CRP | Normal / elevated / high thresholds (mg/L) | `[ ]` | |
| Kit 2 | Ferritin | Low / normal / high (mcg/L) + GP referral trigger level | `[ ]` | |
| Kit 3 | All Kit 2 markers | Confirm same thresholds apply | `[ ]` | |
| Kit 3 | Vitamin B12 | If included: deficient / low-normal / normal thresholds | `[ ]` | |

These thresholds must exist as a signed document — not a WhatsApp conversation — before a single line of results dashboard code is written.

---

### 7.3 GDPR and Data Controller Position — BLOCKER

Blood biomarker data is special category data under UK GDPR. The following must be in place before collecting any customer data.

| Requirement | Action Required | Owner | Status |
|---|---|---|---|
| Data Controller identified | Prima Medical Group Ltd is the data controller for all wellness customer data. Andro Prime Ltd will be data controller for clinical patient data post-CQC. Document this clearly. | Keith — document now | `[ ] Complete` |
| Lawful basis for processing health data | Wellness context: explicit consent from the customer at point of purchase. Confirm consent in checkout flow. Document the lawful basis. | Keith — add to checkout flow | `[ ] Complete` |
| Data Protection Impact Assessment (DPIA) | Required before processing special category health data. Complete the ICO DPIA template (free at ico.org.uk). File it. | Keith — complete before launch | `[ ] Complete` |
| Privacy notice published | Comprehensive privacy notice on website before first order. Must cover: what data you collect, how it is stored, retention period, third parties (Vitall as data processor), customer rights, deletion process. | Keith draft, Ewa review | `[ ] Complete` |
| Data retention and deletion policy | How long do you keep blood test results? When are they deleted? What happens if a customer requests deletion? Document and automate in Supabase. | Keith — document and implement | `[ ] Complete` |
| Vitall data processing agreement | Vitall processes personal health data on your behalf — they are a data processor. A Data Processing Agreement (DPA) must be in the lab contract. | Keith — require as part of lab contract | `[ ] Complete` |

---

### 7.4 Founding Member List Terms — RESOLVED

**Section retired 2026-05-08 — the £75 cash deposit was shelved.** Founding Member continues as a non-cash email opt-in ("founding-member list"). The original blockers in this section (refund terms, designated deposit account, checkout acknowledgement, CQC delay contingency, chargeback evidence pack) no longer apply because no payment is taken. The list itself is governed by the main T&Cs (`/03_compliance/terms-and-conditions.md` — "Founding Member List" clause) and the privacy policy (lawful basis: Consent, Article 6(1)(a) — pending solicitor confirmation).

| Requirement | Detail | Owner | Status |
|---|---|---|---|
| T&Cs "Founding Member List" clause published | Non-cash opt-in, no contractual right to a future TRT service or pricing, list can be left at any time by email. | Keith — done | `[x] Complete (2026-05-09)` |
| Privacy policy lawful basis confirmed | Consent (Article 6(1)(a)) chosen for the list across T&Cs / DPIA / privacy policy. Solicitor to confirm at next legal review. | Keith — solicitor | `[ ] Complete` |
| Brand licence schedule entry updated | Inter-company brand licence still references "founding member deposits" as a wellness product line — flagged for solicitor amendment at next contract cycle. | Keith — solicitor | `[ ] Complete` |

---

### 7.5 Supplement FSA Compliance

| Requirement | Action Required | Owner | Status |
|---|---|---|---|
| All health claims EFSA-approved only | Every claim on supplement packaging and website must be from the EFSA Register of authorised health claims. No claim beyond the register. Ewa reviews all label copy before print. | Ewa review required | `[ ] Complete` |
| Ashwagandha regulatory position confirmed | Ashwagandha (KSM-66) is a non-novel food ingredient in the UK — no FSA notification required. Verify this position has not changed since March 2026. | Keith — verify with manufacturer | `[ ] Complete` |
| Stability testing completed | Required for FSA compliance and shelf-life claims. Cannot be skipped. Must be complete before first shipment to customers. | Manufacturer — Keith to confirm in contract | `[ ] Complete` |
| Label compliance sign-off | Supplement labels must include: product name, net quantity, ingredient list, allergens, manufacturer details, storage instructions, best before date, and compliant health claims. Ewa reviews final artwork before print. | Keith design, Ewa review | `[ ] Complete` |

---

### 7.6 Content Review Process

As Keith scales to 90% AI-generated content, Ewa's compliance role must be systematically managed — not ad hoc.

| Element | Specification |
|---|---|
| **Review workflow** | All content mentioning testosterone, hormones, health markers, supplements, or the founding member programme is submitted to Ewa via ClickUp task before publishing. Content does not go live without approval. |
| **Turnaround SLA** | Ewa reviews and responds within 72 hours of submission. If no response within 72 hours, Keith sends a chase. |
| **Prohibited terms list** | Ewa and Keith define a written list of prohibited words before launch. Examples: diagnose, prescribe, treatment, therapy, medical advice, clinical, GP-recommended (without specific framing), TRT, testosterone replacement, hypogonadism. |
| **Approval log** | Every piece of content reviewed gets a log entry: content title, date submitted, date approved, Ewa's sign-off. Stored in Supabase. This is your audit trail if CQC or ASA ever enquire. |
| **Retroactive review** | Any content already published referencing Andro Prime (including LinkedIn posts) must be reviewed against the prohibited terms list and amended or removed if non-compliant. |

---

### 7.7 Master Compliance Checklist

| # | Item | Type | Owner | Target Date | Status |
|---|---|---|---|---|---|
| 1 | Brand / CQC risk audit of all planned content | **BLOCKER** | Keith + Ewa | | `[ ]` |
| 2 | Founding member CTA language approved by Ewa | **BLOCKER** | Ewa | | `[ ]` |
| 3 | Inter-company brand licence documented | **BLOCKER** | Solicitor | | `[ ]` |
| 4 | Ewa threshold sign-off for all biomarkers (written document) | **BLOCKER** | Ewa | | `[ ]` |
| 5 | Data controller position documented | **BLOCKER** | Keith | | `[ ]` |
| 6 | DPIA completed and filed | **BLOCKER** | Keith | | `[ ]` |
| 7 | Privacy notice published on website | **BLOCKER** | Keith | | `[ ]` |
| 8 | Vitall data processing agreement in place | **BLOCKER** | Keith | | `[ ]` |
| 9 | Deposit refund terms drafted and published | **BLOCKER** | Keith | | `[ ]` |
| 10 | Deposits held in designated account | **BLOCKER** | Keith | | `[ ]` |
| 11 | Customer deposit acknowledgement in checkout | **BLOCKER** | Keith | | `[ ]` |
| 12 | All EFSA health claims verified on supplement labels | Important | Ewa | | `[ ]` |
| 13 | Stability testing arranged with manufacturer | Important | Keith | | `[ ]` |
| 14 | Supplement label artwork reviewed by Ewa | Important | Ewa | | `[ ]` |
| 15 | Content review workflow established in ClickUp | Important | Keith | | `[ ]` |
| 16 | Prohibited terms list agreed between Keith and Ewa | Important | Keith + Ewa | | `[ ]` |
| 17 | Content approval log set up in Supabase | Important | Keith | | `[ ]` |
| 18 | Failed sample policy documented and in order confirmation emails | Important | Keith | | `[ ]` |
| 19 | Stripe chargeback evidence process automated | Important | Keith | | `[ ]` |
| 20 | Data retention and deletion policy documented and implemented | Important | Keith | | `[ ]` |

---

## 8. Operating Dashboards and KPIs

### 8.1 Dashboard 1 — Pipeline and Acquisition

| Metric | Target / Benchmark | Source |
|---|---|---|
| Total kits sold (cumulative) | Gate 0A: 50+ by Week 6 | Supabase / Stripe |
| Kit sales by type (Kit 1 / 2 / 3) | Kit 2 should dominate volume by Month 3 | Supabase |
| Founding member deposits (cumulative) | Gate 0A: 25+ by Week 6 | Supabase / Stripe |
| Supplement subscribers (active) | Gate 0B: 10%+ of Kit 2/3 buyers by Week 10 | Supabase |
| CAC by channel (paid vs organic) | Target blended CAC below £25 for kits | UTM tracking / GA4 |
| Content engagement (LinkedIn impressions, engagement rate) | 4%+ engagement rate on LinkedIn posts | LinkedIn Analytics |
| Email open rate (results sequence) | Target 45%+ on Email 1 (results ready) | Email platform |

---

### 8.2 Dashboard 2 — Commercial Performance

| Metric | Target / Benchmark | Source |
|---|---|---|
| Monthly kit revenue | Growing month-on-month through Phase 0 | Stripe |
| Supplement MRR | Gate 0C: above £1,000/month by Month 4 | Stripe |
| Kit-to-supplement conversion rate | Baseline 10–15%. Target 15%+ by Month 4 | Supabase |
| Supplement subscriber churn | Below 8%/month | Supabase |
| Average order value | Track uplift from bundles vs single-kit purchases | Stripe |
| Payback period per kit customer | Less than 90 days if supplement conversion achieved | Calculated |
| Gross margin (blended) | Target above 50% across kits and supplements | P&L |

---

### 8.3 Dashboard 3 — Operations and Quality

| Metric | Target | Source |
|---|---|---|
| Sample success rate | Above 95% (Vitall contractual SLA) | Lab partner report |
| Results turnaround (sample receipt to dashboard) | Under 72 hours | Supabase timestamps |
| Customer support tickets per 100 kits | Below 5 per 100 kits sold | Support inbox / ClickUp |
| Refund rate | Below 2% of orders | Stripe |
| Failed sample replacement rate | Below 5% of orders | Supabase |
| Content compliance log — pieces reviewed per month | 100% of Mode-A-adjacent content logged | Supabase |
| Net Promoter Score | Target 40+ by Month 4 | Post-results survey |

---

### 8.4 Dashboard 4 — Phase 0 Pipeline Quality (Pre-CQC)

| Metric | Target | Why It Matters |
|---|---|---|
| % of Kit 1 buyers with low T (<12 nmol/L) | Expect 30–35% based on population data | Validates pipeline quality for TRT launch |
| % of low-T results clicking founding-member CTA | Target 25%+ click-through | Tests CTA copy and offer appeal |
| % of CTA clicks completing the list opt-in form | Target 40%+ form completion | Tests friction and brand trust (no payment — barrier is friction + intent only, since £75 cash deposit was shelved 2026-05-08) |
| Overall Kit 1 to founding-member list conversion | Target 8–12% of all Kit 1 buyers | Key efficiency metric for TRT pipeline quality |
| Founding-member list total (cumulative) | 100+ by Gate 0C (Month 4) | Determines quality of TRT launch cohort |

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| CQC denial or significant delay (12+ months) | Medium | High | Wellness engine must be self-sustaining. Do not build clinical infrastructure useless without CQC. Founding member deposits must be genuinely refundable with clear terms. |
| Brand name triggers CQC scrutiny before approval | Medium | High | Rigorous pre-launch content audit. Ewa reviews all public-facing copy. No treatment language pre-CQC. See Section 7.1. |
| Lab COGS higher than modelled (Kit 3 at £40+) | Low | Medium | Resolved — Vitall pricing now confirmed (2026-05-01). v2.2 Kit 3 retail at £179 absorbs any reasonable COGS variation. |
| Supplement conversion below 8% (vs 10–15% baseline) | Medium | Medium | Gate 0B exists to catch this. If triggered, revise results report copy before scaling. Do not scale paid ads onto weak supplement conversion. |
| Kit volume below Gate 0A target | Medium | Medium | Lower gate target to 30 kits and extend to Week 8 if content is building but slowly. Budget £500–1,000 for paid Meta ads to drive initial volume. |
| Ewa unavailable for compliance reviews | Low–Medium | High | Establish 72-hour SLA and ClickUp workflow before launch. Define which content categories are pre-approved without individual review (general lifestyle content with no health claims). |
| Supplement manufacturer MOQ too high for launch capital | Medium | Medium | Launch Kit 1 only first. Fund supplement manufacturing from kit revenue after Gate 0A. Stretches timeline 4–6 weeks but eliminates capital risk. |
| Sample failure rate above 5% | Low | Medium | Vitall's contractual sample-success SLA underpins this risk. If failures exceed 5%, escalate under SLA and review partnership. |
| Competitor price war on Kit 1 | Low | Low | You are not competing on price. You are competing on what happens after the result. The personalised supplement recommendation and founding member pathway are the reason to choose Andro Prime. |
| GDPR or ICO complaint on health data handling | Low | High | Complete DPIA, publish privacy notice, implement data retention policy before first order. See Section 7.3. |

---

## 10. Immediate Next Actions

> **Starting Point:** Complete everything in this section before touching a website builder, writing product copy, or contacting a manufacturer. The compliance blockers in Section 7 come first. This is not the sequence that feels most productive — it is the sequence that reduces the risk of having to undo expensive work.

---

### Days 1–5

| Priority | Action | Owner | Output |
|---|---|---|---|
| **1 — BLOCKER** | Send threshold definition request to Ewa with the biomarker table from Section 7.2. Set 5-day deadline for written sign-off. | Keith | Signed threshold document |
| **2 — BLOCKER** | ~~Send partnership emails to Thriva Solutions AND Vitall simultaneously. Send pricing enquiry to BloodLink and Forth (benchmark only).~~ *(Closed — Vitall signed 2026-05-01.)* | Keith | 4 emails sent, discovery calls booked |
| **3 — BLOCKER** | Complete ICO DPIA template (free at ico.org.uk). Draft privacy notice. Identify solicitor for inter-company brand licence. | Keith | DPIA filed, privacy notice drafted |
| **4 — BLOCKER** | Draft founding member deposit terms — refund conditions, CQC delay clause, customer acknowledgement checkbox. Ewa reviews. | Keith draft, Ewa review | Deposit terms document |
| **5 — Important** | Audit all planned pre-launch content against prohibited terms list. Agree prohibited terms list with Ewa in writing. | Keith + Ewa | Prohibited terms document signed |

---

### Week 2

| Priority | Action | Owner | Output |
|---|---|---|---|
| 1 | ~~Lab partner discovery calls — Thriva and Vitall. Compare pricing, API capability, and turnaround SLA.~~ *(Closed — Vitall signed 2026-05-01.)* | Keith | Comparative pricing table |
| 2 | Begin website build — homepage and Kit 1 product page. Content only, no checkout yet. | Keith | Draft Kit 1 product page |
| 3 | Draft Kit 1 results report copy (all four result bands). Submit to Ewa for compliance review. | Keith draft, Ewa review | Reviewed results copy |
| 4 | Contact supplement manufacturers (Vita Manufacture, Supplement Factory UK) for quotes at 1,000 and 2,500 units. | Keith | Manufacturer quotes received |

---

### Week 3

| Priority | Action | Owner | Output |
|---|---|---|---|
| 1 | Negotiate and sign lab partner agreement. Ensure API access, white-label branding, and DPA are in the contract. | Keith | Signed lab agreement |
| 2 | Build n8n automation: customer order > lab API order placement > sample dispatch notification. | Keith | Automation live in test |
| 3 | Build Supabase data model: customers, orders, results, supplement_subscriptions, content_review_log. | Keith | Database schema live |
| 4 | Finalise privacy notice and publish on website. File DPIA. | Keith | Privacy notice live |

---

### Week 4 — Soft Launch Readiness

| Priority | Action | Owner | Output |
|---|---|---|---|
| 1 | Build Kit 1 results dashboard with conditional logic (low / borderline / normal / optimal). Ewa reviews full results experience. | Keith build, Ewa review | Results dashboard live |
| 2 | Build founding member deposit page with customer acknowledgement checkbox and refund terms link. | Keith | Deposit page live |
| 3 | End-to-end test: place Kit 1 order > sample collected and sent > lab processes > results appear in dashboard > founding member CTA shown. | Keith | Full flow verified |
| 4 | Set up ClickUp content review workflow for Ewa. Establish approval log in Supabase. | Keith | Review workflow operational |
| 5 | **Soft launch** — announce Kit 1 to LinkedIn audience. Gate 0A tracking begins. | Keith | First public orders live |

---

## 11. Governing Principles

### Non-Negotiables

- No drift from wellness into implied clinical activity before CQC. Ever.
- No wording that frames a wellness report as diagnosis or treatment advice.
- No assumption that a finger-prick hormone result alone is sufficient for treatment pathway marketing.
- No lab partner that operates a competing TRT service.
- No content published without Ewa's review for Mode A / Mode B boundary compliance.
- No supplement launched without commercial proof of demand (Supplement 3 gate).
- No heavy overhead loading in the first operating phase.
- No rewrite of this model every few weeks unless the market disproves a major assumption.

---

### Decision Standards

Gates 0A, 0B, and 0C are the arbiters of whether this business is working. Do not override the gates with optimism. If a gate is not met, investigate before scaling. The most expensive thing you can do is scale a conversion problem.

Judge the business on the Base case (£28–43M family exit). Operate to the Optimised Base (£50–79M). Let real data determine whether the Upside (£95–170M) is accessible. Do not plan to the Upside.

The wellness engine is not a placeholder. It must generate real cash, real customer data, and a real pipeline. If it cannot do that by Gate 0C, the clinical business faces a much harder launch.

---

### Document Status

This document is the fixed implementation baseline as of April 4, 2026. It supersedes all previous versions. It should be revised only when:

- Real-world market evidence disproves a major commercial assumption
- Regulatory advice from a qualified solicitor or CQC consultant requires a structural change
- A gate assessment reveals material underperformance requiring model revision

---

*— End of Document —*

*Prima Medical Group Ltd | Andro Prime Ltd | Confidential — Not for distribution*
