# Tiered Platform Financial Model — v1 — Discovery Mode

**Date:** 2026-05-12
**Owner:** Keith Antony
**Status:** Discovery / exercise. Not a planning document. Pairs with `andro-prime-tiered-platform-model-v1.xlsx`.
**Sits alongside:** `phase0-financial-model-v1.xlsx` (v3 — flat model) — does NOT supersede it.

---

## Purpose

This model exists to answer one specific question: **if we scaffold the tiered platform into Phase 0 and let it mature through to year 3, does it materially move the needle financially compared to the flat (kits + supplements only) model?**

The answer, at planning case, is yes — but the uplift comes almost entirely from clinical service revenue post-CQC, not from tiering per se. Tiering is the *mechanism* that captures and routes patients into the clinical funnel. Without clinical services live, tiering adds little.

---

## Headline outputs

| Scenario | M12 cash | M24 cash | M36 cash | M36 monthly net |
|---|---:|---:|---:|---:|
| Flat (v3 extrapolated) | £38,670 | £174,750 | £374,660 | £20,171 |
| **Tiered — Planning** | **£66,418** | **£792,916** | **£2,886,763** | **£240,358** |
| Tiered — Conservative | £66,418 | £710,860 | £2,478,264 | £200,017 |
| Tiered — CQC delayed (M15) | £66,418 | £664,560 | £2,675,780 | £234,836 |
| Tiered — CQC early (M9) | £86,947 | £904,776 | £3,052,991 | £244,073 |

**Δ Planning tiered vs flat at M36:** +£2.5M cumulative cash, +£220k/month run rate.

---

## What's driving the difference

At M36 planning case, the monthly revenue breakdown is:

| Line | Monthly | Annualised | % of total |
|---|---:|---:|---:|
| Kit gross | ~£18,600 | £223k | ~7% |
| Daily Stack net | ~£11,800 | £141k | ~5% |
| Collagen net | ~£500 | £6k | <1% |
| Baseline retest | ~£4,100 | £49k | ~2% |
| Optimisation retest | ~£17,600 | £212k | ~7% |
| Active retest | ~£22,300 | £268k | ~9% |
| **Clinical service (active tier)** | **~£133k** | **£1.6M** | **~53%** |
| **Total** | **~£244k** | **£2.9M** | **100%** |

**Clinical service revenue at M36 is ~53% of monthly net.** The rest is kit + supplement + retest revenue across the platform. *This is the platform thesis materialising.*

---

## What this model proves

1. The tiered platform thesis is financially viable at planning case, assuming the underlying assumptions hold.
2. Y1 uplift from tiering alone is modest (~£27k at M12). **Phase 0 cannot self-fund the platform build in Y1** — the build must be cheap optionality preservation (FHIR shape, consent layer, tier field on patient record), not clinical product development.
3. CQC timing matters but isn't catastrophic. A 3-month delay costs ~£128k cumulative cash at M24 and is fully recovered by M36.
4. The thesis is robust to transition-rate uncertainty within a reasonable band (planning vs conservative differ by ~£400k at M36).

## What this model deliberately does not prove

1. **That CQC will be approved at M12.** Single largest binding assumption. The model breaks if CQC fails or is delayed by 6+ months.
2. **That the volume ramp materialises.** 500 kits/month by M36 requires functioning paid acquisition at scale. £4k/month paid media in Y3 is on the light side for that volume — sensitivity test before relying on this.
3. **That clinical ARPU holds at £200/month blended.** UK competitor pricing pressure (NHS GLP-1 access, mature TRT players) could erode this.
4. **That clinical gross margin holds at 55%.** Clinician time, pharmacy margin, compliance, and CQC ongoing costs are all uncertain.
5. **That tier transition rates (3%/mo opt→active post-CQC) are achievable.** No directly comparable UK benchmark — this is an estimate.
6. **That the platform build itself fits within fixed overhead.** FHIR server, consent layer, dashboard, integrations — modelled as part of escalating fixed overhead (£593 → £1,200 → £2,000/mo) and absorbed into clinical margin. A serious capex line would change the picture in Y2.

---

## Important methodological points

### Comparison to v3 — what's apples-to-apples and what isn't

- **Y1 kit volumes**: identical to v3 planning case (1,380 kits)
- **Y1 unit economics**: identical (£25.70 / £39.72 / £55.30 blended kit nets, Daily Stack £22.08/mo net)
- **Y1 OpEx**: identical PT programme costs, fixed overhead, paid media (£0)
- **Y2-Y3 OpEx**: escalated to reflect platform scale (overhead £1,200 then £2,000; paid media £1,500 then £4,000)
- **Tier behaviour**: new construct, not present in v3

The flat model in this xlsx (Sheet: "Flat (v3 extrapolated)") **extends v3 to 36 months with the same OpEx escalation**, so the comparison is genuinely apples-to-apples in everything except the tier mechanic.

### Why active tier population is plausible

By M36, planning case, active tier = ~1,209 patients. 

- Cumulative kits over 36 months: ~9,860
- Active tier as % of cumulative: ~12%
- UK comparators: Optimale, Numan (~1k-10k active TRT patients each). Hims/Ro have hundreds of thousands but operate across multiple service lines and geographies.
- 12% conversion is high but defensible *if* the funnel is designed to qualify clinical candidates — which is the entire point of the tiered architecture.

### Tier movement mechanics

- New customers enter at baseline (70% pre-CQC, 60% post-CQC), optimisation (30%), or active (10% post-CQC only).
- 2%/month of baseline patients transition to optimisation (triggered by flagged results or upsell).
- 3%/month of optimisation patients transition to active (clinical need surfaces), post-CQC only. Conservative case: 1.5%/month.
- 5%/month of active patients downgrade to optimisation (clinical service ends but stays on platform).
- 4%/month of baseline patients churn off-platform entirely.

These are estimates. The most important calibration data point in Phase 0 is **actual baseline to optimisation transition rate**, because it determines how much of the cohort is even *eligible* to become active patients later.

---

## What this means for the Phase 0 plan

Two practical implications:

### 1. The cheap scaffolding decisions are worth making in Phase 0

FHIR-shaped data, granular consent, tier field on patient record, recommended cadence as a variable, result evaluation as code. These cost 1-2 weeks of architectural decisions and preserve the optionality this model depends on.

### 2. The expensive platform features should NOT be built in Phase 0

The model assumes clinical services don't launch until M13 (CQC approval). Building tier-routing UI, clinical decision-support rules, pricing flows, and dashboard tiering *before* clinical services exist is premature. The £2.5M uplift over flat comes from clinical revenue, not from sophisticated tiering — the tiering is just the routing layer.

In Phase 0, you only need enough tiering to:
- Tag new customers with an entry tier
- Send tier-appropriate retest reminders (annual / 6-mo / not applicable yet)
- Capture consent properly so secondary use is preserved
- Log result-flag events that *will* drive tier movement in Y2

Everything else is Y2 product work.

---

## Sensitivity priorities

In rough order of importance:

1. **CQC approval timing.** Single largest swing variable. Tracked separately as a delivery milestone, not modelled probabilistically here.
2. **Clinical ARPU.** £150 vs £200 vs £250 — model the band. £150 case still profitable but materially smaller.
3. **Volume ramp Y2-Y3.** Currently assumed; should be stress-tested against realistic paid-acquisition + organic-compounding scenarios.
4. **Active churn rate (5%/mo).** UK TRT clinics see varying retention — would benefit from primary research before locking in.
5. **Clinical gross margin (55%).** Needs primary work on pharmacy margins, clinician contracts, CQC ongoing costs.

---

## Stop-and-think honesty check

This model produces a £2.9M ARR business at M36 with a £2.5M cumulative cash position. **That is a meaningfully different business than the v3 flat model produces (£375k cash, £240k ARR at M36).**

It is also a meaningfully more *complex* business: regulated clinical service, CQC-supervised, with clinician headcount, pharmacy relationships, prescribing infrastructure, longitudinal data layer, multi-tier customer experience.

Before treating this model as confirmation of the platform thesis, three honest questions:

1. **Do I actually want to build a regulated clinical business?** It is a very different business from "kits + supplements + light wellness platform." The brand voice changes, the operational burden changes, the personal risk profile changes (clinical liability, CQC scrutiny, MHRA advertising rules).

2. **Is the v3 flat model actually a viable standalone business?** £375k cash and £20k/month at M36 is a small but profitable wellness business. If the answer to (1) is "not really," the flat model is the destination, not the runway.

3. **What's the lowest-cost way to test the tiering thesis before committing to it?** Probably: ship Phase 0 with the cheap scaffolding decisions, measure baseline to optimisation transition rate in months 6-9, decide whether to pursue CQC in earnest based on that data. Don't commit to the platform until the funnel evidence supports it.

The model is exploratory. It is not a commitment.

---

*End of v1 model. Compiled 2026-05-12. UK English. UK & NI scope. Owner: Keith Antony.*
