# LTV:CAC Profitability Model v2 — Kits + Bundles + Subscription

**Created:** 2026-07-21 | **Owner:** Keith | **Status:** Working unit-economics model, bundle-aware. Extends (does not retire) `ltv-cac-profitability-model-2026-06-26.md`: that doc stays authoritative for single-kit inputs and the channel CAC set; this one adds the two-kit bundle SKUs and restates the per-customer economics around them. Cross-refs: strategy STATE 2026-07-20/21 (conflict-free position, B1), `research/2026-07-20-mainstream-buyer-deep-research.md` (WTP evidence status), `04_products/catalogue/non-regulated-tier-v72-financials.md`.

> **Read the verdict first:** the v1 verdicts all survive — owned acquisition is the engine, cold paid does not pay back, affiliate ~3:1, attach + tenure (not price) decide profitability. What changes: the bundles convert the two unmeasured make-or-break variables (attach, tenure) into designed outcomes with measurement dates, pull cash forward, and raise the per-customer floor by £10–15 even if attach/tenure never move. **Every input below is a working hypothesis until Phase 0b / quiz data lands. No verified willingness-to-pay evidence exists for the £99–259 band** (the £500-median-budget claim died in the 2026-07-21 verification): the quiz Van Westendorp block is the only planned source.

## Working bundle prices (accepted by Keith 2026-07-21, chat; pending WTP validation)

**Pricing rule:** the retest kit is ~30% off when committed upfront; the first kit is never discounted (protects the £99/£119/£179 anchors; Andro Prime never owns a cheap bait test — that is the funnel's entry mechanic per the mainstream-buyer research). The split is shown on the page; the Confirmation refund equals the stated second-test price.

| Bundle | Composition | Solo total | Price | Saving |
|---|---|---|---|---|
| Confirmation (Kit 1) | £99 baseline + £70 conditional Kit 1 retest | £198 | **£169** | £29 |
| Prove-It (Kit 2) — flagship | £119 baseline + £80 day-90 Kit 2 retest | £238 | **£199** | £39 |
| Full-picture (Kit 3) | £179 baseline + £80 day-90 Kit 2 retest | £298 | **£259** | £39 |

## Inputs (with provenance)

- **Single-kit gross contribution** (after 2.5% Stripe): Kit 1 £38 · Kit 2 £53 · Kit 3 £77 (v1 model / V7.2 financials). Implied kit COGS: £58.50 / £63 / £97.50.
- **Bundle contribution per customer** (both kits shipped, after 2.5% Stripe on the bundle price):
  - Confirmation £169 → 164.78 − (2 × 58.50) = **~£48** (vs £38 single, +£10)
  - Prove-It £199 → 194.03 − (2 × 63) = **~£68** (vs £53 single, +£15)
  - Full-picture £259 → 252.53 − (97.50 + 63) = **~£92** (vs £77 single, +£15)
  - Confirmation **all-clear refund path**: customer refunded £70, Stripe fee on the full £169 not returned → contribution ~£36 (slightly below the £38 single kit). All-clear **bank path**: contribution £48 with the second kit's COGS deferred to the 6–12-month recheck (which the live reminder system already drives). Refund-vs-bank mix is unmeasured — see measurement table.
- **Subscription contribution:** £39.95/mo → ~£29/mo (COGS £10 midpoint). Unchanged from v1.
- **CAC by channel (v1, unchanged):** owned ~£0 · affiliate (frozen) ~£30 · cold paid ~£200.
- **Second-kit margin note:** the discounted retest carries thin standalone margin (Kit 2 retest ~£18; Kit 1 confirmation ~£10 if shipped). Two reasons it is still correct: (a) no retest habit exists in the category (the one retention claim in the research was refuted 0-3), so this is manufactured incremental revenue, not cannibalised full-price sales; (b) the banked Confirmation kit pre-sells the annual recheck.

## LTV per acquired customer

`LTV = SKU contribution + attach% × tenure × £29`

**Single Kit 2 buyer (v1 planning case, unchanged):** 53 + 20% × 6 × 29 ≈ **£88**.

**Prove-It bundle buyer (£68 base):**

| Attach ↓ / Tenure → | 6 mo | 9 mo | 12 mo |
|---|---|---|---|
| **20%** | £103 | £120 | £138 |
| **30%** | £120 | £146 | £172 |
| **40%** | £138 | £172 | £207 |

The grid's higher attach/tenure rows are not free upside — they are the hypothesis the bundle exists to test: a second offer moment at the day-90 result (highest-intent attach audience possible) and a "your numbers moved" renewal event landing just after the day-15–45 churn window. **Planning case: £103 (nothing improves except the prepaid second kit). Target case: ~£146 (30%/9mo). Best case £207.**

**Floor guarantee:** even at v1's planning attach/tenure, every bundle buyer is worth £10–15 more than the single-kit buyer, because the second kit is prepaid rather than a ~15% probability.

## Channel verdicts (unchanged in direction)

| Channel | CAC | vs Prove-It planning £103 | vs target £146 | Verdict |
|---|---|---|---|---|
| Owned | ~£0 | ∞ | ∞ | ✅ the engine |
| Affiliate (frozen) | ~£30 | 3.4:1 | 4.9:1 | ✅ improves with bundle AOV; unfreeze still a Keith decision |
| Cold paid | ~£200 | 0.5:1 | 0.7:1 | ❌ still underwater even at best case (£207 → 1.03:1, below any healthy ratio) |

Cold paid remains a read, not a channel. The £250 Search test reads **bundle take-rate at fixed prices** (not price variants — traffic too small to price-test).

## Gate implications

- **Gate 0B stage 1 restated per-SKU:** CPA < contribution of the SKU actually sold — £38/£53/£77 single kits, **£48/£68/£92 by bundle**. Stage 2 unchanged (CPA < blended LTV once attach observed, ~week 8+).
- **Gate 0C (M12 cash):** bundles help — each Prove-It sale collects £199 on day 0 and defers ~£63 of COGS to ~day 80. New balance-sheet lines the cash view must carry honestly: deferred-revenue liability for undispatched kits (~£80/£70 per open bundle), refund allowance on Confirmation all-clears, banked-kit reserve (12-month validity proposed, solicitor to confirm terms).

## What must be measured, and when

| Input | How measured | When readable |
|---|---|---|
| WTP £99–259 band | Van Westendorp block in quiz (**load-bearing — only planned source**) | ~n=50 responses |
| Bundle take rate (% choosing bundle over single) | /kits + checkout analytics | weeks after B1 ships |
| Confirmation trigger rate (% Kit 1 low/borderline) | own results data | first ~20 Kit 1 results |
| Refund-vs-bank rate on all-clear confirmations | order records | first all-clear cohort |
| Retest completion rate (Prove-It day-90) | dispatch + result records | ~month 4 after first sales |
| Attach + tenure uplift among retesters | Stripe + CIO cohorts | Phase 0b, weeks 6–12 |

## Caveats

- **Prices are working hypotheses**, accepted 2026-07-21 to unblock build + modelling; the Van Westendorp read can move them. Kit COGS are implied from v1 contributions, pending any Vitall second-order/wholesale confirmation (also confirm order-time vs dispatch-time separation and kit shelf life — owed before B1 builds).
- Excludes overhead/fixed costs (per-customer contribution view, same as v1).
- Clinic (post-CQC) revenue is deliberately valued at £0 here; the KPI to track now is the count of confirmed-low, GP-handoff-in-hand customers (the clinic's launch pipeline).
- Compliance rails unchanged: retest framed as "see if your numbers moved," never supplement efficacy; low/borderline T routes to GP; cadence stays inside defensible practice (BSSM two-sample confirmation; 90-day nutrient retest; 6–12-month recheck — the BMJ criticised Numan's quarterly cadence against RCPath intervals).

---

*Compiled 2026-07-21. Update the measurement table rows with real numbers as they land — the take-rate and retest-completion reads are the first two that turn this from a map into an answer.*
