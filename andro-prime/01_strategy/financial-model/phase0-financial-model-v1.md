# Andro Prime — Phase 0 Financial Model v1.0

## Premium Positioning | Organic-First | Zero External Funding

### April 2026

**Owner:** Keith Antony
**Spreadsheet:** `01_strategy/financial-model/phase0-financial-model-v1.xlsx`
**Scope:** Non-regulated wellness tier only (kits + supplements). The V5.0 TRT/clinical model is a separate business and is not referenced here.

> **STALE 2026-05-08 — superseded for active planning by [`option-4-financial-model-2026-05-08.md`](./option-4-financial-model-2026-05-08.md) (v2 of the Option-4 model).** The figures below were calculated against pre-v2.2 inputs (£15 Daily Stack COGS, "Kit 2 leads" volume mix, percentage-affiliate model, FM £75 cash deposit, monthly tier-retention bonuses). Each of those inputs has since changed. The xlsx workbook on disk reflects the same stale inputs and needs a manual rerun against the v2.3 canonical inputs listed below.
>
> **v2.3 canonical inputs for the xlsx rerun (use these when re-running the model in Excel):**
>
> - Pricing: Kit 1 £99 / Kit 2 £119 / Kit 3 £179 (premium pricing locked)
> - Kit COGS (Vitall-quoted): £58.50 / £63.00 / £98.00
> - **Daily Stack COGS: £12** (reconciled 2026-05-08 midpoint of £11–£13 range; was £15 in v1.0)
> - Stripe: 2.5%
> - Affiliate model: **£15 flat fee per kit** (not percentage). 50/50 affiliate/direct split (was 20% affiliate in v1.0).
> - Per-kit affiliate bonuses (v2.3): +£10 Kit 3 upsell, +£10 supplement conversion. **First-month activation bonus removed in v2.3.**
> - Customer discount via affiliate code: **10% off RRP**.
> - PT tier graduation bonuses (v2.3, one-off — no monthly recurring): Silver £200, Gold £400. Estimated total ~£1,400 over 6 months at planning kit volumes.
> - Contests (v2.3): quarterly + annual only — no monthly contests. ~£4,000 over 6 months.
> - Flagship per-piece content payments (v2.3, replaces £250/mo retainer): £100/piece, capped 2/mo per flagship. Mid-case ~£3,000 over 6 months.
> - Free-kit costs: PT cohort ~£1,750 (5 flagship Kit 3 + 20 first-wave Kit 2). Gym partnership ~£1,890 (capped 3 head trainers × 10 gyms).
> - Total v2.3 PT-programme cost over 6 months: **~£13,240** (down from v2.2 effective ~£20k+; saving ~£7–10k).
> - **Phase 0 architecture: Option 4** (kit-led entry → result → supplement subscription, locked 2026-05-08). **Kit 1 and Kit 2 promoted at equal pace** — earlier "Kit 2 leads" assumption superseded.
> - **Founding Member £75 cash deposit shelved 2026-05-08.** "Deposit revenue" line in §4.2 should be removed — FM continues as non-cash opt-in marker only. Phase 0 cash-flow no longer depends on deposit float.
> - Daily Stack tenure (days 15–45 onboarding) is the dominant gating factor on Phase 0 net contribution per cash-target benchmark research.
>
> **Headline v2.3 6-month figure (per memory, pre-rerun):** Phase 0 6-mo net contribution +£4,315 (vs v2's +£1,042 — uplift comes mainly from the right-sized affiliate stack saving ~£7–10k against v2.2 effective cost). The xlsx rerun is needed to confirm the month-by-month curve.

**Status:** v1.0 model **superseded** by Option 4 model (markdown) 2026-05-08. The xlsx still reflects v1.0 inputs and has not yet been rerun. Treat all figures below as historical baseline only.

---

## 1. Model Identity

This is the first standalone financial model for Andro Prime's Phase 0 wellness business. It replaces the financial sections of V7.1 and V7.2 product documents, which mixed product specs with financial projections. This model is finance only.

Key structural decisions embedded in this model: zero launch capital (Vitall white-label, all costs in per-kit COGS), zero paid media (organic and affiliate acquisition only), premium retail pricing (£99–179, positioned above loss-leader competitors), flat £15 affiliate fee per referral (not percentage-based), and supplement manufacturing self-funded entirely from accumulated kit profits.

---

## 2. Unit Economics

### 2.1 Kits

| Kit | COGS (Vitall) | Retail | Gross Margin | Margin % |
|-----|--------------|--------|-------------|----------|
| Kit 1 — Hormone Check | £58.50 | £99 | £40.50 | 40.9% |
| Kit 2 — Energy & Metabolism | £63.00 | £119 | £56.00 | 47.1% |
| Kit 3 — Combo Test | £98.00 | £179 | £81.00 | 45.3% |

After payment processing (2.5% Stripe) and flat £15 affiliate fee at 20% affiliate mix:

| Metric | Kit 1 | Kit 2 | Kit 3 |
|--------|-------|-------|-------|
| Direct sale net margin | £38.02 (38.4%) | £53.02 (44.6%) | £76.53 (42.8%) |
| Affiliate sale net margin | £23.02 (23.3%) | £38.02 (32.0%) | £61.52 (34.4%) |
| Blended net margin (20% affiliate) | £35.02 (35.4%) | £50.02 (42.0%) | £73.52 (41.1%) |

### 2.2 Supplements (Market Research Estimates)

| Product | Sub Price /mo | COGS (Est.) | Gross Margin | Margin % |
|---------|--------------|-------------|-------------|----------|
| Daily Stack | £34.95 | £15.00 | £19.95 | 57.1% |
| Joint & Recovery Collagen | £29.95 | £13.00 | £16.95 | 56.6% |

---

## 3. Breakeven

| Metric | Value |
|--------|-------|
| Monthly fixed overhead | £88 |
| Blended net margin per kit | £52.86 |
| **Kits per month to break even** | **2** |
| **Kits per week to break even** | **1** |
| Margin of safety at 17 kits (Month 1 plan) | +£811 |

At 2 kits per month to cover overhead, the business is structurally profitable from the first week of trading. Even the worst imaginable month — 3-4 kit sales — generates positive net cash.

---

## 4. Six-Month Forecast

### 4.1 Volumes

Kit 2 leads as primary launch product. Kit 3 staged from Month 2. All acquisition organic + affiliate.

| Month | Kit 1 | Kit 2 | Kit 3 | Total |
|-------|-------|-------|-------|-------|
| M1 | 5 | 10 | 2 | 17 |
| M2 | 8 | 14 | 4 | 26 |
| M3 | 10 | 20 | 6 | 36 |
| M4 | 14 | 26 | 8 | 48 |
| M5 | 16 | 30 | 10 | 56 |
| M6 | 20 | 36 | 12 | 68 |
| **Total** | **73** | **136** | **42** | **251** |

### 4.2 Monthly P&L

| Metric | M1 | M2 | M3 | M4 | M5 | M6 | 6-Mo Total |
|--------|---:|---:|---:|---:|---:|---:|---:|
| Total Revenue | £2,153 | £3,429 | £4,879 | £6,562 | £7,843 | £9,596 | £34,461 |
| Total COGS | £1,134 | £1,787 | £2,523 | £3,391 | £4,031 | £4,929 | £17,794 |
| **Gross Profit** | **£1,019** | **£1,642** | **£2,356** | **£3,170** | **£3,812** | **£4,667** | **£16,667** |
| Total OpEx | £193 | £252 | £318 | £396 | £452 | £532 | £2,143 |
| **Net Contribution** | **£827** | **£1,390** | **£2,038** | **£2,774** | **£3,360** | **£4,135** | **£14,524** |
| Net Margin | 38.4% | 40.5% | 41.8% | 42.3% | 42.8% | 43.1% | 42.1% |

### 4.3 Cash Position

| Month | Net Contribution | Cumulative Cash |
|-------|-----------------|----------------|
| M1 | £827 | £827 |
| M2 | £1,390 | £2,217 |
| M3 | £2,038 | £4,254 |
| M4 | £2,774 | £7,029 |
| M5 | £3,360 | £10,389 |
| M6 | £4,135 | £14,524 |

Cash is positive from Month 1. No external funding required at any point.

---

## 5. Supplement Capital — Self-Funding Timeline

### Option A: Daily Stack Only (Phased — Recommended)

| Item | Amount |
|------|--------|
| Daily Stack MOQ (500 units) | £4,000 |
| Label + compliance (1 SKU) | £1,200 |
| Stability testing (1 SKU) | £750 |
| **Total** | **£5,950** |

At planning case volumes, cumulative cash reaches £5,950 during **Month 4**. Add 5–6 weeks manufacturing lead time — **Daily Stack available for sale approximately Month 5–6**.

### Option B: Both SKUs (Full Launch)

| Item | Amount |
|------|--------|
| Both supplements + labels + testing | £9,000 |

Cumulative cash reaches £9,000 during **Month 5**. Both supplements available approximately **Month 7**.

**Recommendation:** Option A. Launch Daily Stack first, prove conversion, add Collagen from retained earnings. No reason to commit £9,000 when £5,950 gets the subscription engine running two months earlier.

---

## 6. Key Metrics — End of Month 6

| Metric | Value |
|--------|-------|
| Total kits sold | 251 |
| Active supplement subscribers | 21 |
| Supplement MRR | £734 |
| Founding member deposits (cumulative) | 21 |
| 6-month total revenue | £34,461 |
| 6-month net contribution | £14,524 |
| 6-month net margin | 42.1% |
| Cumulative cash | £14,524 |
| Gross margin | 48.4% |

---

## 7. What This Model Does Not Include

These are excluded by design — they belong in separate planning documents:

- TRT/clinical revenue (V5.0 model — separate business)
- Paid media costs (organic-only model — paid added only when proven ROI justifies it)
- Keith's time as an explicit cost (opportunity cost is real but not a cash outflow)
- Scaling overhead (accountant, insurance, additional tools — added as volume triggers justify them)
- Supplement revenue in the first 4–5 months (supplements don't exist until self-funded)

---

## 8. Sensitivities

### What breaks this model?

Very little. With a breakeven of 2 kits per month, the business survives almost any reasonable downside scenario. The model becomes net-negative only if total kit sales drop below roughly 10 per month for an extended period AND overhead increases simultaneously.

### What makes it significantly better?

Higher supplement conversion is the single biggest upside lever. At 12% conversion (planning case), you have 21 active subscribers by Month 6 generating £734 MRR. At 18% conversion, that becomes ~32 subscribers and ~£1,100 MRR. The difference compounds every month.

### What should you watch?

The three numbers that matter most in the first 90 days: weekly kit sales (target: 4+ per week), kit-to-supplement conversion rate (target: 12%+, measured from first results delivery), and subscriber churn (target: under 3% monthly). Everything else is noise until these three are proven.

---

**Last updated:** April 2026
**Owner:** Keith Antony
