# Tiered Platform Financial Model — v2 — Two-Entity Structure

**Date:** 2026-05-12
**Owner:** Keith Antony
**Status:** Discovery / exercise. Pairs with `andro-prime-tiered-platform-model-v2.xlsx`.
**Supersedes:** v1 of this model (single-entity). v1 is retained in git as historical reference.
**Aligned to:** `2026-05-12-longitudinal-tracker-decision.md`

---

## Purpose

v2 rebuilds the tiered platform financial model to match the structural decisions documented in the longitudinal tracker memo (2026-05-12) and the entity-separation thesis (Andro Prime Ltd wellness + Clinical Ltd regulated).

v1 of this model collapsed everything into one P&L and assumed:
- Single corporate entity holding both wellness and clinical activities
- Tracker available from M1
- Always-on intelligence layer (no v2 gate)
- "Active tier" inside Andro Prime brand

v2 corrects each of these:
- **Two-entity structure** with HoldingCo consolidation
- **Tracker timing** matching the decision doc (ships M3-M4, retest ramps M5-M13)
- **v2 gate modelled as binary** (pass scenario + fail scenario)
- **No "active" tier in Andro Prime** — clinical revenue lives entirely in Clinical Ltd

The result is a materially smaller but more honest picture.

---

## Headline outputs

### v2 GATE PASSES (planning case)

| Entity | M12 cash | M24 cash | M36 cash | M36 monthly net |
|---|---:|---:|---:|---:|
| Andro Prime Ltd | £42,526 | £401,333 | £1,276,117 | £97,718 |
| Clinical Ltd | (£53,000) | (£44,799) | £103,731 | £22,050 |
| **HoldingCo CONSOLIDATED** | **(£10,474)** | **£356,534** | **£1,379,848** | **£119,768** |

### v2 GATE FAILS (engagement below 50% at M12)

| Entity | M12 cash | M24 cash | M36 cash | M36 monthly net |
|---|---:|---:|---:|---:|
| Andro Prime Ltd | £42,526 | £391,671 | £1,178,126 | £86,870 |
| Clinical Ltd | (£53,000) | (£53,418) | £40,324 | £14,480 |
| **HoldingCo CONSOLIDATED** | **(£10,474)** | **£338,253** | **£1,218,450** | **£101,350** |

**Pass-vs-fail delta at M36: £161k cumulative, ~£18k/month run-rate.**

---

## Comparison to v1 of this model

| Metric | v1 single-entity | v2 PASS (consolidated) | Δ | Why |
|---|---:|---:|---:|---|
| M12 cum cash | £66,418 | (£10,474) | (£76,892) | Tracker delay + Ewa cost + CL setup burn |
| M24 cum cash | £792,916 | £356,534 | (£436,382) | Realistic two-entity overhead Y2 |
| M36 cum cash | £2,886,763 | £1,379,848 | (£1,506,915) | ~50% of v1: regulatory firebreak cost |
| M36 run-rate | £240,358/mo | £119,768/mo | (£120,590)/mo | Slower cross-entity conversion |

**v2 is roughly half v1.** That £1.5M cumulative cash difference is the price of:
1. Tracker timing matching the decision doc (~£40-60k cumulative across 36 months)
2. Ewa retainer (~£54k across 36 months)
3. Clinical Ltd setup burn (~£53k M1-M12)
4. Slower cross-entity conversion (4%/mo of smaller Performance pool vs 3%/mo of larger Optimisation pool in v1)
5. Genuine two-entity overhead duplication (separate clinical director, separate ops)

**This is not a downgrade. It is a correction.** v1 was answering "what if everything goes right and entities are perfectly integrated." v2 is answering "what does this look like under the actual structure I'm planning to build."

---

## What v2 proves

### 1. Andro Prime works as a standalone wellness business

At M36, Andro Prime Ltd alone delivers £1.28M cumulative cash and ~£1.17M ARR. **Even if Clinical Ltd never launches or never works, this is a viable wellness platform.** Tiering, longitudinal tracker, retest revenue from optimisation + performance cohorts — all of this is genuine wellness revenue without crossing any regulatory line.

This is the most important strategic finding from v2: the wellness business stands on its own. Clinical Ltd is upside, not the foundation.

### 2. Clinical Ltd is cash-negative until Y3

Clinical Ltd burns ~£53k pre-CQC (M1-M12: clinical director retainer + CQC application + legal/ops setup). Once CQC is granted (planning case M13), the entity ramps slowly — patient population reaches only 164 by M24 and 413 by M36. **Clinical Ltd doesn't become a meaningful profit centre until Y3.**

The implication: the HoldingCo must carry Clinical Ltd's burn for 2+ years. Either from Andro Prime's cashflow (which materialises by M9-M10 even in conservative cases), from founder capital, or from delaying Clinical Ltd setup to align with Andro Prime's cash availability.

### 3. The v2 intelligence-layer gate is real but not a cliff

Pass vs fail consolidated cash delta at M36: £161k. That's the value of the intelligence layer over 3 years. **Meaningful but not bet-the-company.**

What this means: the moat hypothesis (longitudinal data + correlation engine = retention + clinical conversion) has financial upside but doesn't define the business. If v1 engagement is below 50% at M12 and you choose not to build v2, the business is still viable. You've just removed one growth lever.

The strategic risk of v2 gate failure is bigger than the financial risk: failed engagement suggests the platform thesis itself is weak, which has implications for the broader strategy beyond this model.

### 4. CQC timing remains the single largest swing variable not modelled

v2 holds CQC approval fixed at M12. A delay to M15 or later would push Clinical Ltd profitability deeper into Y3 and materially compress the M36 numbers. v3 of this model (if needed) should add CQC timing sensitivity.

---

## What v2 does NOT prove

1. **That 413 clinical patients by M36 is achievable.** Cross-entity conversion (4%/mo of Performance tier) is a planning assumption. UK comparables (Optimale, Numan early years) suggest it's possible but not validated for an integrated wellness-to-clinical funnel.

2. **That the volume ramp materialises.** 500 kits/month by M36 still requires functioning paid acquisition. £3k/mo (AP) + £5k/mo (CL) paid media in Y3 may be light for that scale.

3. **That intercompany transfer pricing at 15% is regulator-acceptable.** HMRC and CQC both have views on related-party arrangements. The 15% figure is plausible but should be validated by a tax advisor before locking in.

4. **That the entity structure protects fully.** Common ownership creates scrutiny risk under ASA (cross-promotion of prescription products), ICO (data sharing arrangements), and CQC (governance independence of Clinical Ltd's clinical director). The structure works on paper; implementation requires deliberate governance.

5. **That Ewa's £1k/mo Y1 retainer is the right number.** This was modelled as a placeholder. Real number depends on the actual scope: sign-off frequency, depth of review, on-call requirements.

---

## Important methodology notes

### Tier population dynamics

Andro Prime tiers move per these monthly transition rates:

- **Pre-v2 (planning):** Base → Opt 2%/mo, Opt → Perf 1.5%/mo
- **Post-v2 launch (pass case):** Base → Opt 3%/mo, Opt → Perf 2.5%/mo (improved by correlation engine)
- **If v2 fails:** stays at pre-v2 rates indefinitely

Cross-entity conversion (Performance → Clinical) only starts post-CQC at M13, and runs at 4%/mo (pass) or 2%/mo (fail).

### Retest revenue ramp

Critical change from v1. Retest revenue is gated by:
1. Tracker v1 must exist (M4)
2. Customer must have a result + reason to retest (M5+)
3. Behaviour change takes time to compound (full run-rate by M13)

Modelled as a linear ramp from 0% at M4 to 100% at M13. This costs Y1 ~£20-30k vs v1's M1-onwards assumption.

### Intercompany transfer

Andro Prime bills Clinical Ltd 15% of clinical revenue as "marketing services" / customer referral fee. This is a real P&L line for both entities:
- Andro Prime: +£X intercompany revenue (NOT external)
- Clinical Ltd: -£X intercompany expense

At HoldingCo consolidation, these net to zero. The model shows both sides explicitly so you can see how each entity stands alone, then nets at the consolidated view.

### "External revenue" at consolidated level

The consolidated revenue line excludes intercompany. It represents what HoldingCo actually receives from the outside world (customers + clinical patients), not internal book entries.

---

## What I'd push you to do next

In rough priority order:

1. **Confirm the entity structure decision.** v2 assumes Andro Prime Ltd + Clinical Ltd + HoldingCo. The `01_strategy/entity-structure/` folder is currently empty. This decision should be documented before any clinical work proceeds.

2. **Get the Ewa retainer cost real.** £1k/mo is a placeholder. If you have an existing arrangement, plug the actual number in (cell B17 on Assumptions sheet in xlsx). If you don't yet, you need to before Phase 0 launches because the tracker work the decision doc describes requires her sign-off.

3. **Stress-test the volume ramp.** 1,380 / 3,280 / 5,200 kits per year for Y1/Y2/Y3 is aggressive once you account for the late tracker effect. Model what happens if Y2 ramp is 30% slower.

4. **Add CQC delay sensitivity in v3 of the model.** Right now CQC is fixed at M12. A 3-6 month delay materially changes Clinical Ltd's trajectory. This was modelled in v1; should be brought back.

5. **Decide on the v2 gate position publicly.** The decision doc commits to v2 being gate-dependent. The xlsx now shows what that gate actually buys you (£161k over 3 years). Knowing the price tag should make the gate decision easier.

---

## Strategic honesty check

The v2 model produces ~£1.4M consolidated cumulative cash at M36 (pass case). That is:
- A **good outcome** for a wellness + clinical platform built with no external capital
- A **far smaller** outcome than v1 suggested (£2.9M)
- **Robust to one major variable failing** (v2 gate failure costs ~£160k, not the business)
- Still dependent on volume materialising and CQC landing

Three questions worth sitting with:

1. **Is £1.4M cum cash at M36 enough?** It's profitable but it's not a venture-scale outcome. If the platform thesis is supposed to enable a sale at £20M+ in 5-7 years, the trajectory in v2 doesn't get there without something the model doesn't capture (acquisition by a larger player, additional service lines, much steeper volume ramp).

2. **Is Phase 0 actually self-funding the platform?** Andro Prime Ltd is cash-positive from ~M9 onwards. Clinical Ltd is burning until M24. The HoldingCo carries the bridge. If you don't have £30-50k of working capital available to fund Clinical Ltd's pre-CQC burn, the structure doesn't work without delaying Clinical Ltd start.

3. **Is the wellness business alone enough?** If you stripped out Clinical Ltd entirely and just ran Andro Prime as a wellness platform (~£1.17M ARR by M36), is that the business you want to build? If yes, you're freed from the CQC timeline entirely. If no, the clinical entity is mandatory and the timing question matters.

The model is exploratory. v2 is closer to the truth than v1 was. It is still not a planning document — but it's a much better foundation for one.

---

*End of v2 model. Compiled 2026-05-12. UK English. UK & NI scope. Owner: Keith Antony.*
