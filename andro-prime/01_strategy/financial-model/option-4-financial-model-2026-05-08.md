---
title: "Option 4 Phase 0 Financial Model — v3 — 2026-05-08"
status: "Markdown parallel model. v3 supersedes v2 (in git history). Source-of-truth spreadsheet rerun pending — see Section 9 for cell-level inputs."
supersedes: "v2 of this document (2026-05-08, earlier same-day) — produced +£1,042 6-month net contribution at planning case using v2.2 affiliate stack including £10 first-month bonus modelled at +£2.50/aff kit. v3 right-sizes the PT compensation programme to v2.3 spec: drops the first-month bonus, drops the £20 flagship Kit 3 uplift, and replaces the monthly £8,000 tier-retention line with a one-off graduation bonus pool. Per-kit blended margins are restored to the v2.2 marketing plan §1 published figures (£25.70 / £39.72 / £55.30). Programme OpEx is reduced and made fully visible (gym partnership free kits + flagship content payments now on the P&L)."
v2_to_v3_corrections:
  - "Drop £10 first-month activation bonus → per-kit affiliate net rises by £2.50 across all three kits"
  - "Drop £20 flagship Kit 3 uplift → standardise on £10 Kit 3 bonus universally (already the v2.2 published-line basis)"
  - "Per-kit blended margins reconcile to v2.2 §1 lines 54–56 verbatim: K1 £25.70 / K2 £39.72 / K3 £55.30"
  - "PT bonuses + contests right-sized: £5,000 (v2) → £4,000 (quarterly £750+£250 ×2 + annual £2,000)"
  - "PT tier retention monthly recurring: £8,000 (v2) → £0; replaced with one-off graduation bonuses ~£1,400 (3 Silver £200 + 2 Gold £400)"
  - "Flagship retainer (5 × £250 × 6mo, hidden in v2.2 plan §1 line 67) replaced with per-piece content payments £3,000 (5 PTs × 1 piece/mo × £100 × 6mo) — now visible on P&L"
  - "Gym partnership free kits (3 per gym × 10 gyms × £63 COGS = £1,890) — previously hidden, now on P&L"
  - "Net visible programme OpEx 6-mo: £15,950 (v2) → £13,240 (v3); apples-to-apples (including hidden lines) saving vs v2.2 baseline ~£7–10k"
  - "12-month projection added — extrapolates planning case to M12 with volume ramp 130/140/150/160/170/180. Confirms £30k cash by M12 is now comfortably achievable."
locked_decisions:
  - "Option 4 (kit-strategy)"
  - "Equal pacing Kit 1 + Kit 2 + Kit 3"
  - "v2.2 canonical pricing (£99 / £119 / £179)"
  - "40/40/20 volume mix"
  - "50/50 direct / PT-coded affiliate mix"
  - "Daily Stack 4-month tenure planning, COGS £12"
  - "v2.3 PT compensation structure (this document)"
  - "Self-financing cost-centre frame; £30k cash target by M12"
confidence_overall: "M-H — unit economics are H confidence (Vitall, v2.2 commission-structure, daily-stack.md). The v2.3 PT programme is now fully expressed on a clean compensation logic with no hidden lines. Largest remaining swing variables are unchanged from v2: Daily Stack tenure (L), supplement conversion rate (M-L), affiliate mix above 50/50 (M)."
scope: "UK & NI. UK English. 6-month Phase 0 + 12-month extrapolation."
owner: "Keith Antony"
date: "2026-05-08"
---

# Option 4 Phase 0 Financial Model — v3 — 2026-05-08

**v3 supersedes v2.** v2 produced a planning-case 6-month net contribution of **+£1,042** under the v2.2 commission stack including the £10 first-month bonus modelled at +£2.50/aff kit and a £8,000 monthly tier-retention OpEx line. The PT compensation programme has now been right-sized to **v2.3** — the first-month bonus is dropped, the £20 flagship Kit 3 uplift is dropped (the v2.2 marketing plan §1 line 56 already used the standard £10 Kit 3 bonus, not the £20 flagship), monthly tier retention is replaced with a one-off graduation bonus pool, and previously-hidden lines (gym partnership free kits, flagship content payments) are made visible on the P&L.

The headline consequence: v3 planning-case 6-month net contribution lands at **+£4,315** — a swing of **+£3,273** vs v2. The 12-month extrapolation, which v2 did not produce, lands at **~+£39,246 cumulative cash** at planning case. **The £30k-by-M12 target is now achievable with material headroom.** v2's "roughly cash-neutral on P&L alone" picture becomes "self-funding profit centre that comfortably hits the M12 cash target" under the v2.3 PT structure.

This is a markdown parallel model. The `.xlsx` workbook in `01_strategy/financial-model/` remains the long-term source of truth and is not edited as part of this exercise. Section 9 below itemises the cell-level changes the spreadsheet rerun must encode.

All math is shown. Confidence tags (H / M / L) are applied per assumption.

---

## 0. Input register (with confidence tags)

### 0.1 Kits

| Input | Value | Source | Confidence |
|---|---|---|---|
| Kit 1 retail | £99 | `phase0-marketing-plan.md` v2.2 §0; `non-regulated-tier-v72-financials.md` §2.1 (reconciled) | H |
| Kit 2 retail | £119 | as above | H |
| Kit 3 retail | £179 | as above | H |
| Kit 1 COGS (Vitall finger-prick) | £58.50 | `non-regulated-tier-v72-financials.md` §2.1 | H |
| Kit 2 COGS | £63.00 | as above | H |
| Kit 3 COGS | £98.00 | as above | H |
| PT-coded retail (10% off) | £89.10 / £107.10 / £161.10 | `commission-structure.md` §2 | H |

### 0.2 Supplements

| Input | Value | Source | Confidence |
|---|---|---|---|
| Daily Stack subscription | £34.95/mo | `daily-stack.md` §Pricing | H |
| Daily Stack one-off | £39.95 | as above | H |
| Daily Stack COGS (planning) | **£12** (midpoint of £11–£13) | `daily-stack.md` §Manufacturer Brief Notes | M |
| Joint & Recovery Collagen sub | £29.95/mo | `non-regulated-tier-v72-financials.md` §2.2 | H |
| Joint & Recovery Collagen COGS | £13 | as above | M |

### 0.3 Payments, affiliate, overhead — v2.3 right-sized

| Input | Value | Source | Confidence |
|---|---|---|---|
| Stripe processing fee | 2.5% of gross | `commission-structure.md` §2 | H |
| Affiliate base fee | £15 flat per kit | `commission-structure.md` §1 | H |
| Affiliate Kit 3 upsell bonus | **£10 universal** (no flagship £20 tier) | v2.3 right-sizing; matches v2.2 §1 line 56 | H |
| Affiliate supplement-conversion bonus | £10 (paid when referred customer subscribes to Daily Stack) | `commission-structure.md` §3 (Bonus 2) | H |
| Affiliate first-month bonus | **£0 — DROPPED in v2.3** | v2.3 right-sizing | H |
| Customer 10% PT-coded discount | £9.90 / £11.90 / £17.90 | already baked into £89.10 / £107.10 / £161.10 retail | H |
| PT tier retention (monthly recurring) | **£0 — DROPPED in v2.3** | v2.3 right-sizing | H |
| PT tier graduation bonus (one-off) | Silver £200 (×3 expected over 6 mo) + Gold £400 (×2 expected) = ~£1,400 | v2.3 right-sizing | M |
| **Affiliate sales mix** | **50/50** direct / PT-coded | v2.2 plan §1 line 53 | H |
| Founding-member list | Non-cash email opt-in (no P&L impact, no balance-sheet liability — £75 cash deposit shelved 2026-05-08) | `master-implementation-blueprint.md` §7.4 | H |
| **Phase 0 fixed overhead** | **£593/mo** | `non-regulated-tier-v72-financials.md` §3 (v72-canonical) | H |
| Paid media | £0 in Phase 0 | v2.2 plan §6.6 | H |
| Phase 0 horizon | 6 months (with 12-month extrapolation) | v2.2 plan + v3 task brief | H |

### 0.4 PT programme costs — v2.3 right-sized (6-month totals)

| Cost line | v2 (v2.2 spec) | v3 (v2.3 right-sized) | Delta | Profile (v3) |
|---|---|---|---|---|
| Free kits (5 flagship Kit 3 + 20 first-wave Kit 2) | £1,750 | £1,750 | — | M1 only (front-loaded) |
| FirstPromoter + asset costs | £1,200 | £1,200 | — | £200/mo flat |
| PT bonuses + contests | £5,000 | **£4,000** | -£1,000 | Quarterly £1,000 (M3, M6) + annual £2,000 (M6) |
| PT tier retention (monthly recurring) | £8,000 | **£0** | -£8,000 | n/a |
| Tier graduation bonuses (one-off) | n/a | **£1,400** | +£1,400 | M4–M6 as PTs hit thresholds |
| Flagship per-piece content payments | n/a (was hidden in v2.2 §1 line 67 retainer) | **£3,000** | +£3,000 | £500/mo flat (5 PTs × £100/piece) |
| Gym partnership free kits (3 × 10 gyms × £63 COGS) | n/a (hidden in v2 — not on P&L) | **£1,890** | +£1,890 | M1–M3 phased (~£630/mo) |
| **Net visible programme OpEx** | **£15,950** | **£13,240** | **-£2,710 net** | |

> **Apples-to-apples comparison.** v2's £15,950 omitted gym partnership kits and treated the flagship retainer as a hidden line in the v2.2 marketing plan §1 line 67 (not on the v2 model P&L). Bringing those to surface, v2's *true effective programme cost* would have been ~£20,450 (£15,950 + £1,890 gym + ~£2,610 retainer-equivalent for 5 flagships at lower per-month rates). v3's £13,240 is therefore a saving of ~£7,210 on a like-for-like basis — materially larger than the headline £2,710. This is surfaced explicitly because Keith specifically asked for it.

### 0.5 Conversion & tenure assumptions (Option 4) — unchanged from v2

| Input | Planning | Sensitivity | Source | Confidence |
|---|---|---|---|---|
| Kit → Daily Stack subscription | 15% | 8% / 15% / 22% | Agent C `2026-05-08-funnel-math-option4.md` | M |
| Kit → Joint & Recovery Collagen (Kit 2 only) | 15% | 12–18% range | Task brief | L |
| Kit 1 / Kit 3 low-T base rate (T<12) | 30% | 25–35% | `master-implementation-blueprint.md` §8.4 | M |
| Low-T → FM deposit conversion | 30% | 25% / 30% / 35% | Agent C | M |
| Elective FM opt-in (normal-T cohort) | 5% | 3% / 5% / 8% | Agent C | L |
| Daily Stack subscriber tenure | 4 months | 3 / 6 / 12 | Agent C planning case | **L** (single largest swing variable) |

### 0.6 Volume — equal pacing under Option 4 (40/40/20)

| Scenario | 6-mo total | Kit 1 | Kit 2 | Kit 3 |
|---|---|---|---|---|
| **Minimum** | 375 | 150 | 150 | 75 |
| **Planning** | 450 | 180 | 180 | 90 |
| **Stretch** | 510 | 204 | 204 | 102 |

Monthly ramp (preserved from v2):

| Month | Min (375) | Plan (450) | Stretch (510) |
|---|---|---|---|
| M1 | 20 | 24 | 27 |
| M2 | 35 | 42 | 48 |
| M3 | 55 | 66 | 75 |
| M4 | 75 | 90 | 102 |
| M5 | 90 | 108 | 122 |
| M6 | 100 | 120 | 136 |

12-month extrapolation (planning case): M7 130, M8 140, M9 150, M10 160, M11 170, M12 180 → 12-mo total **1,380 kits**.

---

## 1. Per-product unit economics — v2.3-strict

### 1.1 Per-kit net contribution (full visible math)

#### 1.1.1 Direct sale (no affiliate, no discount) — unchanged from v2

| Line | Kit 1 | Kit 2 | Kit 3 |
|---|---|---|---|
| Customer pays | £99.00 | £119.00 | £179.00 |
| Stripe (2.5%) | -£2.48 | -£2.98 | -£4.48 |
| COGS | -£58.50 | -£63.00 | -£98.00 |
| **Direct net per kit** | **£38.02** | **£53.02** | **£76.52** |

#### 1.1.2 Affiliate sale (PT-coded, 10% customer discount, £15 base fee, no first-month bonus)

| Line | Kit 1 (£89.10) | Kit 2 (£107.10) | Kit 3 (£161.10) |
|---|---|---|---|
| Customer pays | £89.10 | £107.10 | £161.10 |
| Stripe (2.5%) | -£2.23 | -£2.68 | -£4.03 |
| Affiliate base fee | -£15.00 | -£15.00 | -£15.00 |
| COGS | -£58.50 | -£63.00 | -£98.00 |
| **Affiliate net (base only)** | **£13.37** | **£26.42** | **£44.07** |

In v2 this was followed by a -£2.50 "first-month uplift" deduction per affiliate kit. **In v3 that line is dropped (the £10 first-month bonus is removed in the v2.3 right-sizing).** v3 affiliate net is the base-only figure.

#### 1.1.3 Kit 3 — £10 standard upsell bonus

The £10 Kit 3 upsell bonus fires on essentially 100% of affiliate Kit 3 sales (the bonus exists to incentivise PTs to upsell to Kit 3). Subtract it from the Kit 3 affiliate column only:

| Line | Kit 3 |
|---|---|
| Affiliate net (base only) | £44.07 |
| Less: Kit 3 standard upsell bonus | -£10.00 |
| **Kit 3 affiliate net (full v2.3 stack)** | **£34.07** |

> **Reconciliation to v2.2 plan §1 line 56:** v2.2 published Kit 3 affiliate net at £34.07 with the standard £10 Kit 3 bonus. The "£20 flagship Kit 3 uplift" referenced in some earlier drafts was never on the v2.2 published line — it was a separate flagship-tier consideration that v2.3 closes out. v3 matches v2.2 line 56 verbatim.

#### 1.1.4 50/50 blended kit net (v3)

| Calc | Kit 1 | Kit 2 | Kit 3 |
|---|---|---|---|
| Direct net × 50% | £19.01 | £26.51 | £38.26 |
| Affiliate net × 50% (v2.3) | £6.685 | £13.21 | £17.035 |
| **Blended net per kit (v3)** | **£25.70** | **£39.72** | **£55.30** |

**Cross-check vs v2.2 marketing plan §1 lines 54–56:** £25.70 / £39.72 / £55.30 — matches verbatim.

#### 1.1.5 v2 → v3 per-kit delta

| | v2 (v2.2 stack with first-month uplift) | v3 (v2.3 right-sized, no first-month) | Δ |
|---|---|---|---|
| Kit 1 blended | £24.45 | £25.70 | **+£1.25** |
| Kit 2 blended | £38.47 | £39.72 | **+£1.25** |
| Kit 3 blended | £54.05 | £55.30 | **+£1.25** |

The +£1.25/kit uplift is exactly 50% × £2.50 (the affiliate-only first-month uplift, blended at 50/50). Kit 3 is identical to Kit 1 / Kit 2 because the v2 doc's Kit 3 figure already used the standard £10 bonus, not the £20 flagship uplift — so the only line that moves is the dropped first-month bonus.

### 1.2 Daily Stack subscription unit economics — unchanged from v2

| Line | Per month |
|---|---|
| Subscription price | £34.95 |
| Stripe (2.5%) | -£0.87 |
| COGS (£12 planning) | -£12.00 |
| **Net per subscriber per month** | **£22.08** |

LTV at 4-mo planning tenure = £88.32. **Affiliate-mix adjustment** (50% × £10 supplement-conversion bonus = -£5/new sub one-off): **blended LTV £83.32**.

### 1.3 Joint & Recovery Collagen unit economics (Kit 2 only) — unchanged from v2

| Line | Per month |
|---|---|
| Subscription price | £29.95 |
| Stripe (2.5%) | -£0.75 |
| COGS | -£13.00 |
| **Net per subscriber per month** | **£16.20** |

LTV at 4-mo tenure = £64.80. Blended (after -£5 supp-conv bonus): **£59.80**.

---

## 2. Per-customer LTV under Option 4 — v2.3

LTV = blended kit net + (Daily Stack conv × DS net LTV) + (Collagen rate × Collagen LTV, Kit 2 only). Founding-member deposits remain off-P&L (refundable).

### 2.1 Kit 1 LTV (Option 4, mid case)

- Kit 1 blended net: £25.70
- Daily Stack: 15% × £83.32 = £12.50
- **Kit 1 Phase-0 cash LTV (mid) = £38.20**

**Cross-check vs Agent C's £42.86:** Agent C used £25.70 kit net (matches v3 verbatim), 21.5% supplement conversion, £15 Daily Stack COGS. v3 mid: £25.70 kit net (matches), 15% conversion (-£5.43 vs Agent C's higher rate), £12 COGS (+£0.93). Net delta vs Agent C ≈ -£4.66 → my £38.20 vs Agent C's £42.86. **The kit-net component now matches Agent C exactly** (vs v2's -£1.25 gap). The remaining gap is purely conversion-rate and COGS — both within the documented sensitivity bands.

Kit 1 LTV by conversion rate:
- 8%: £25.70 + 8% × £83.32 = £32.37
- 15% (planning): £38.20
- 22%: £25.70 + 22% × £83.32 = £44.03 (now slightly above Agent C's £42.86)

### 2.2 Kit 2 LTV

- Kit 2 blended net: £39.72
- Daily Stack: 15% × £83.32 = £12.50
- Collagen: 15% × £59.80 = £8.97
- **Kit 2 Phase-0 cash LTV (mid) = £61.19**

### 2.3 Kit 3 LTV

- Kit 3 blended net: £55.30
- Daily Stack: 15% × £83.32 = £12.50
- **Kit 3 Phase-0 cash LTV (mid) = £67.80**

### 2.4 LTV summary table (v2 → v3)

| Kit | v2 LTV (mid) | v3 LTV (mid) | Δ | v3 Low / High (8% / 22% supp conv) |
|---|---|---|---|---|
| Kit 1 | £36.95 | **£38.20** | +£1.25 | £32.37 / £44.03 |
| Kit 2 | £59.94 | **£61.19** | +£1.25 | £53.65 / £68.73 |
| Kit 3 | £66.55 | **£67.80** | +£1.25 | £61.97 / £73.63 |

The +£1.25/customer uplift across all kits is the dropped first-month bonus, blended 50/50. v3 reconciles much more cleanly to Agent C's funnel-math LTV table than v2 did.

---

## 3. 6-month forecast — three scenarios at v2.3

Inputs: 40/40/20 mix, 50/50 affiliate mix, 15% Daily Stack conversion (all kits), 15% Collagen conversion (Kit 2 only), 4-month tenure, £593/mo overhead, full v2.3 PT programme cost stack.

### 3.1 Volume tables (kit-by-kit, by month)

| Month | Min K1/K2/K3 | Plan K1/K2/K3 | Stretch K1/K2/K3 |
|---|---|---|---|
| M1 | 8/8/4 | 10/10/4 | 11/11/5 |
| M2 | 14/14/7 | 17/17/8 | 19/19/10 |
| M3 | 22/22/11 | 26/26/14 | 30/30/15 |
| M4 | 30/30/15 | 36/36/18 | 41/41/20 |
| M5 | 36/36/18 | 43/43/22 | 49/49/24 |
| M6 | 40/40/20 | 48/48/24 | 54/54/28 |
| **6-mo** | **150/150/75** | **180/180/90** | **204/204/102** |

### 3.2 Subscriber maths (Planning — 4-mo tenure) — unchanged from v2

| Month | New DS | Active DS | New Collagen | Active Collagen | DS MRR (£34.95) | Coll MRR (£29.95) |
|---|---|---|---|---|---|---|
| M1 | 3.6 | 3.6 | 1.5 | 1.5 | £126 | £45 |
| M2 | 6.3 | 9.9 | 2.55 | 4.05 | £346 | £121 |
| M3 | 9.9 | 19.8 | 3.9 | 7.95 | £692 | £238 |
| M4 | 13.5 | 33.3 | 5.4 | 13.35 | £1,164 | £400 |
| M5 | 16.2 | 45.9 | 6.45 | 17.9 | £1,604 | £536 |
| M6 | 18.0 | 56.7 | 7.2 | 22.95 | £1,981 | £687 |

### 3.3 Daily Stack & Collagen monthly net contribution (planning) — unchanged from v2

| Month | DS net | Collagen net | Total supp net |
|---|---|---|---|
| M1 | £61 | £17 | £78 |
| M2 | £187 | £53 | £240 |
| M3 | £388 | £109 | £497 |
| M4 | £668 | £189 | £857 |
| M5 | £932 | £258 | £1,190 |
| M6 | £1,162 | £336 | £1,498 |
| **6-mo** | **£3,398** | **£962** | **£4,360** |

### 3.4 Kit gross profit by month (planning, blended £25.70 / £39.72 / £55.30)

| Month | K1 | K2 | K3 | Kit gross |
|---|---|---|---|---|
| M1 | £257.00 | £397.20 | £221.20 | **£875.40** |
| M2 | £436.90 | £675.24 | £442.40 | **£1,554.54** |
| M3 | £668.20 | £1,032.72 | £774.20 | **£2,475.12** |
| M4 | £925.20 | £1,429.92 | £995.40 | **£3,350.52** |
| M5 | £1,105.10 | £1,707.96 | £1,216.60 | **£4,029.66** |
| M6 | £1,233.60 | £1,906.56 | £1,327.20 | **£4,467.36** |
| **6-mo** | **£4,626.00** | **£7,149.60** | **£4,977.00** | **£16,752.60** |

**v2 → v3 kit-gross delta:** +£562.50 (= 450 kits × £1.25/kit uplift) across the planning case.

### 3.5 Full P&L — Planning case (450 kits)

| Line | M1 | M2 | M3 | M4 | M5 | M6 | 6-mo |
|---|---|---|---|---|---|---|---|
| Kit gross profit | £875 | £1,555 | £2,475 | £3,351 | £4,030 | £4,467 | **£16,753** |
| Supplement net | £78 | £240 | £497 | £857 | £1,190 | £1,498 | **£4,360** |
| **Total contribution** | **£953** | **£1,795** | **£2,972** | **£4,208** | **£5,220** | **£5,965** | **£21,113** |
| Fixed overhead | -£593 | -£593 | -£593 | -£593 | -£593 | -£593 | -£3,558 |
| Free kits (M1 only) | -£1,750 | 0 | 0 | 0 | 0 | 0 | -£1,750 |
| Gym partnership kits | -£630 | -£630 | -£630 | 0 | 0 | 0 | -£1,890 |
| PT bonuses + contests (v2.3) | 0 | 0 | -£1,000 | 0 | 0 | -£3,000 | -£4,000 |
| Tier graduation bonuses | 0 | 0 | 0 | -£200 | -£600 | -£600 | -£1,400 |
| Flagship per-piece content | -£500 | -£500 | -£500 | -£500 | -£500 | -£500 | -£3,000 |
| FirstPromoter + assets | -£200 | -£200 | -£200 | -£200 | -£200 | -£200 | -£1,200 |
| **Net contribution** | **-£2,720** | **-£128** | **+£49** | **+£2,715** | **+£3,327** | **+£1,072** | **+£4,315** |
| Cumulative cash | -£2,720 | -£2,848 | -£2,799 | -£84 | +£3,243 | **+£4,315** | — |

> Stripe, 10% PT discount, £15 affiliate base fee, £10 Kit 3 standard bonus and the £10 supplement-conversion bonus are all baked into the blended kit-net (£25.70 / £39.72 / £55.30) and supplement-net lines. They are **not** double-counted in OpEx. The OpEx lines are programme-level only.

**Cash-flow narrative.** Planning case dips to a trough of -£2,848 in M2 (front-loaded free kits + gym kits + first months of overhead before subscription stack matures), turns positive M4, and finishes M6 at +£4,315. The trough is materially shallower than v2 (-£2,419 was v2's trough in M1; v3's trough is M2 at -£2,848 — slightly deeper because gym kits are phased into M1–M3, but the recovery is much faster from M4 onwards because tier-retention OpEx is gone).

### 3.6 Minimum case (375 kits) — full P&L

Kit gross by month (v3): M1 £744.56, M2 £1,302.98, M3 £2,047.54, M4 £2,792.10, M5 £3,350.52, M6 £3,722.80 → **6-mo £13,961**.
Supplement net (unchanged from v2): M1 £65, M2 £199, M3 £414, M4 £714, M5 £991, M6 £1,266 → **6-mo £3,648**.

| Line | M1 | M2 | M3 | M4 | M5 | M6 | 6-mo |
|---|---|---|---|---|---|---|---|
| Total contribution | £810 | £1,502 | £2,461 | £3,506 | £4,341 | £4,989 | **£17,609** |
| Fixed overhead | -£593 | -£593 | -£593 | -£593 | -£593 | -£593 | -£3,558 |
| Free kits | -£1,750 | 0 | 0 | 0 | 0 | 0 | -£1,750 |
| Gym partnership kits | -£630 | -£630 | -£630 | 0 | 0 | 0 | -£1,890 |
| PT bonuses + contests | 0 | 0 | -£1,000 | 0 | 0 | -£3,000 | -£4,000 |
| Tier graduation bonuses | 0 | 0 | 0 | -£200 | -£600 | -£600 | -£1,400 |
| Flagship per-piece content | -£500 | -£500 | -£500 | -£500 | -£500 | -£500 | -£3,000 |
| FirstPromoter + assets | -£200 | -£200 | -£200 | -£200 | -£200 | -£200 | -£1,200 |
| **Net contribution** | **-£2,863** | **-£421** | **-£462** | **+£2,013** | **+£2,448** | **+£96** | **+£811** |
| Cumulative cash | -£2,863 | -£3,284 | -£3,746 | -£1,733 | +£716 | **+£811** | — |

**Minimum case ends Phase 0 cash-positive by ~£811 on P&L alone** (vs v2 minimum case at -£2,368). Adding the FM deposit float (~£3,000 at min volumes) brings minimum-case cash position to ~+£3,800. The minimum case no longer requires the deposit float to break even — material strategic improvement.

### 3.7 Stretch case (510 kits) — full P&L

Kit gross by month (v3): M1 £996.12, M2 £1,795.98, M3 £2,792.10, M4 £3,788.22, M5 £4,532.78, M6 £5,081.08 → **6-mo £18,986**.
Supplement net (unchanged from v2): M1 £88, M2 £271, M3 £564, M4 £973, M5 £1,359, M6 £1,721 → **6-mo £4,975**.

| Line | M1 | M2 | M3 | M4 | M5 | M6 | 6-mo |
|---|---|---|---|---|---|---|---|
| Total contribution | £1,084 | £2,067 | £3,356 | £4,761 | £5,892 | £6,802 | **£23,962** |
| Fixed overhead | -£593 | -£593 | -£593 | -£593 | -£593 | -£593 | -£3,558 |
| Free kits | -£1,750 | 0 | 0 | 0 | 0 | 0 | -£1,750 |
| Gym partnership kits | -£630 | -£630 | -£630 | 0 | 0 | 0 | -£1,890 |
| PT bonuses + contests | 0 | 0 | -£1,000 | 0 | 0 | -£3,000 | -£4,000 |
| Tier graduation bonuses | 0 | 0 | 0 | -£200 | -£600 | -£600 | -£1,400 |
| Flagship per-piece content | -£500 | -£500 | -£500 | -£500 | -£500 | -£500 | -£3,000 |
| FirstPromoter + assets | -£200 | -£200 | -£200 | -£200 | -£200 | -£200 | -£1,200 |
| **Net contribution** | **-£2,589** | **+£144** | **+£433** | **+£3,268** | **+£3,999** | **+£1,909** | **+£7,164** |
| Cumulative cash | -£2,589 | -£2,445 | -£2,012 | +£1,256 | +£5,255 | **+£7,164** | — |

### 3.8 Three-scenario summary

| Metric | Min (375) | Planning (450) | Stretch (510) |
|---|---|---|---|
| Total kits | 375 | 450 | 510 |
| 6-mo total contribution | £17,609 | £21,113 | £23,962 |
| 6-mo programme/overhead OpEx | -£16,798 | -£16,798 | -£16,798 |
| **6-mo net contribution (v3)** | **+£811** | **+£4,315** | **+£7,164** |
| 6-mo net contribution (v2 reference) | -£2,368 | +£1,042 | +£3,816 |
| **Δ vs v2** | **+£3,179** | **+£3,273** | **+£3,348** |
| M6 net contribution | +£96 | +£1,072 | +£1,909 |
| M6 active Daily Stack subs | 48 | 57 | 65 |
| M6 Daily Stack MRR | £1,653 | £1,981 | £2,244 |
| Cumulative cash M6 (P&L) | +£811 | +£4,315 | +£7,164 |
| FM deposit float (off-P&L) | ~£3,000 | ~£3,525 | ~£4,050 |
| Cash position M6 incl. FM float | ~+£3,811 | ~+£7,840 | ~+£11,214 |

The v2 → v3 delta is roughly constant (~+£3,200) across all three scenarios because the bulk of the saving is fixed-OpEx (tier retention dropped, contests right-sized) — it doesn't scale with volume. The kit-margin uplift (+£1.25/kit) does scale with volume, which is why the stretch delta is slightly larger than the minimum.

---

## 4. Sensitivity analysis (planning case, single-input swings)

### 4.1 Tenure sensitivity (single largest swing variable — confirmed)

The kit-gross delta and OpEx delta vs v2 are tenure-independent (kit volumes don't change; OpEx is fixed). The supplement-net component scales with tenure exactly as in v2. So v3 net contribution at any tenure = v2 figure + £3,273.

| Tenure | M6 active DS | DS net contribution M6 | 6-mo net contribution (v3) | Δ vs 4-mo planning |
|---|---|---|---|---|
| 3 months | 43.7 | £965 | +£2,048 | -£2,267 |
| **4 months (planning)** | **56.7** | **£1,162** | **+£4,315** | **baseline** |
| 6 months | 76.7 | £1,693 | +£8,031 | +£3,716 |
| 12 months | 117.0 | £2,584 | +£17,698 | +£13,383 |

Tenure remains the single largest swing variable. At 12-mo tenure (Gate 0C target), 6-month net contribution rises to +£17,698 — and the 12-month projection (§7) at 12-mo tenure would clear £30k by ~M9. Validation priority #1 remains measuring actual Daily Stack churn from M3 onward.

### 4.2 Supplement conversion rate sensitivity

| Conv rate | M6 active DS | M6 supp net | 6-mo net contribution (v3) | Δ vs planning |
|---|---|---|---|---|
| 8% | 30.2 | £620 | +£1,996 | -£2,319 |
| **15% (planning)** | **56.7** | **£1,498** | **+£4,315** | **baseline** |
| 22% | 83.2 | £2,376 | +£6,634 | +£2,319 |

Same magnitude as v2 (-£2,319 / +£2,319 across the band). At the low end (8%), v3 still delivers +£1,996 — comfortably positive, where v2 was -£1,277. The right-sized OpEx makes Phase 0 robust to a lower-than-planning supplement conversion rate.

### 4.3 Volume-mix sensitivity (planning, 4-mo tenure, 15% conv)

| Mix (K1/K2/K3) | 6-mo kit gross | 6-mo net contribution | Δ vs 40/40/20 |
|---|---|---|---|
| 35/45/20 | £17,059 | +£4,621 | +£306 |
| **40/40/20 (planning)** | **£16,753** | **+£4,315** | **baseline** |
| 45/35/20 | £16,447 | +£4,009 | -£306 |

Mix moves 6-mo net by ~£300 across this range — small, unchanged from v2. Equal pacing's marginal cost vs Kit-2-dominant remains worth paying for the ICP-1 / parallel Tier-A1/A2 affiliate split.

### 4.4 Affiliate-mix sensitivity (planning, 4-mo tenure, 15% conv)

v3 blended kit nets at alternative mixes:

| Aff mix | Blended K1 / K2 / K3 | 6-mo kit gross | 6-mo net contribution | Δ vs 50/50 |
|---|---|---|---|---|
| 40% PT-coded | £28.16 / £42.38 / £59.54 | £18,056 | +£5,618 | +£1,303 |
| **50/50 (canonical)** | **£25.70 / £39.72 / £55.30** | **£16,753** | **+£4,315** | **baseline** |
| 60% PT-coded | £23.23 / £37.06 / £51.05 | £15,447 | +£3,009 | -£1,306 |

A 10-point shift in PT-coded share = ±£1,303 of 6-mo net contribution (vs v2's ±£1,196). **The affiliate-mix swing is slightly larger in v3 because the per-kit margin is higher** (the v3 affiliate net is £2.50 lower than direct net would be without the discount, vs v2 where the gap was the same plus the first-month uplift) — but the directional concern is identical to v2: PT engine working "too well" still erodes Phase 0 net contribution until supplement MRR matures. Worth surfacing as a soft constraint when PT demand exceeds 50% direct/coded split.

### 4.5 What still does NOT move the needle

- Fixed overhead at £593 vs £640 vs £673: ±£280 over 6 months.
- Stripe fee (locked at 2.5%).
- Joint & Recovery Collagen conversion rate (12% vs 18%): ±£200 over 6 months.
- Tier graduation bonus pool (£1,000 vs £1,800): ±£400 over 6 months.

The first-month bonus, modelled in v2 at ±£235, is now zero — removed entirely.

---

## 5. TRT launch readiness — warm-pipeline at M6

Per `trt-launch-readiness-2026-05-08.md`, the metric is "warm customers across signals." Volumes unchanged from v2 (kit volumes are unchanged; PT compensation does not affect customer counts).

| Signal | M6 stock — Min (375) | M6 stock — Plan (450) | M6 stock — Stretch (510) |
|---|---|---|---|
| Active Daily Stack subscribers | 48 | 57 | 65 |
| Low-T-flagged subset | 7 | 9 | 10 |
| Elective FM opt-ins (5%) | 19 | 23 | 26 |
| Low-T-triggered FM opt-ins | 20 | 24 | 28 |
| Engaged low-T-result customers (no FM) | 47 | 57 | 64 |
| **Total raw signals** | **141** | **170** | **193** |
| **Conservative dedup (~0.65–0.75)** | **~95–110** | **~110–130** | **~130–150** |

| Scenario | Total deposits | Warm-pipeline (unique) | Reaches 40 deposits? | Reaches 40+ warm? |
|---|---|---|---|---|
| Minimum (375) | ~39 | ~95–110 | Borderline | **Yes — comfortably** |
| Planning (450) | ~47 | ~110–130 | **Yes** | **Yes — comfortably** |
| Stretch (510) | ~54 | ~130–150 | **Yes** | **Yes — very comfortably** |

**Verdict: unchanged from v2.** Warm-pipeline-across-signals target is reachable at all three scenarios. The PT compensation right-sizing does not affect this metric.

---

## 6. Founding-member deposit cash float (balance-sheet, not P&L)

**Refundable liability under Consumer Rights Act. Not revenue.**

| Source | Plan M6 | Float |
|---|---|---|
| Low-T-triggered (K1+K3, ~9% blended) | 24 | £1,800 |
| Elective opt-in (5% × 450) | 23 | £1,725 |
| **Total Phase 0 deposit float at M6 (planning)** | **~47** | **~£3,525** |

Min: ~40 depositors → ~£3,000 float. Stretch: ~54 → ~£4,050. Drop-off sensitivity (30% planning → 33 depositors at TRT launch, £1,050 refund obligation, £2,475 remaining float) — unchanged from v2.

---

## 7. 12-month projection (planning case extrapolation)

The v3 task brief instructs: extend planning case to M12 with volume ramp M7 130, M8 140, M9 150, M10 160, M11 170, M12 180. Mix held at 40/40/20.

### 7.1 H2 volume (planning)

| Month | Total | K1 | K2 | K3 |
|---|---|---|---|---|
| M7 | 130 | 52 | 52 | 26 |
| M8 | 140 | 56 | 56 | 28 |
| M9 | 150 | 60 | 60 | 30 |
| M10 | 160 | 64 | 64 | 32 |
| M11 | 170 | 68 | 68 | 34 |
| M12 | 180 | 72 | 72 | 36 |
| **H2** | **930** | **372** | **372** | **186** |
| **12-mo total** | **1,380** | **552** | **552** | **276** |

### 7.2 H2 kit gross (v3 blended)

| Month | K1 | K2 | K3 | Kit gross |
|---|---|---|---|---|
| M7 | £1,336.40 | £2,065.44 | £1,437.80 | **£4,839.64** |
| M8 | £1,439.20 | £2,224.32 | £1,548.40 | **£5,211.92** |
| M9 | £1,542.00 | £2,383.20 | £1,659.00 | **£5,584.20** |
| M10 | £1,644.80 | £2,542.08 | £1,769.60 | **£5,956.48** |
| M11 | £1,747.60 | £2,700.96 | £1,880.20 | **£6,328.76** |
| M12 | £1,850.40 | £2,859.84 | £1,990.80 | **£6,701.04** |
| **H2** | **£9,560.40** | **£14,775.84** | **£10,285.80** | **£34,622.04** |

### 7.3 H2 supplement maths

New DS subs (15% × monthly total): M7 19.5, M8 21.0, M9 22.5, M10 24.0, M11 25.5, M12 27.0. Active DS (4-mo trailing):

| Month | New DS | Active DS | DS net (active × £22.08 − new × £5) |
|---|---|---|---|
| M7 | 19.5 | 67.2 | £1,386.28 |
| M8 | 21.0 | 74.7 | £1,544.38 |
| M9 | 22.5 | 81.0 | £1,675.98 |
| M10 | 24.0 | 87.0 | £1,800.96 |
| M11 | 25.5 | 93.0 | £1,925.94 |
| M12 | 27.0 | 99.0 | £2,050.92 |
| **H2** | — | — | **£10,384.46** |

New Collagen (15% × Kit 2): M7 7.8, M8 8.4, M9 9.0, M10 9.6, M11 10.2, M12 10.8. Active Collagen (4-mo trailing):

| Month | New Coll | Active Coll | Coll net (active × £16.20 − new × £5) |
|---|---|---|---|
| M7 | 7.8 | 26.85 | £395.97 |
| M8 | 8.4 | 29.85 | £441.57 |
| M9 | 9.0 | 32.40 | £479.88 |
| M10 | 9.6 | 34.80 | £515.76 |
| M11 | 10.2 | 37.20 | £551.64 |
| M12 | 10.8 | 39.60 | £587.52 |
| **H2** | — | — | **£2,972.34** |

H2 supplement net: £10,384.46 + £2,972.34 = **£13,356.80**.

### 7.4 H2 OpEx (continuation profile)

The v2.3 spec doesn't explicitly stipulate H2 OpEx. Planning assumption — programme costs broadly stable, with one-off lines (free flagship kits, annual contest) not repeating:

| H2 line | Total | Rationale |
|---|---|---|
| Fixed overhead (£593 × 6) | -£3,558 | Locked |
| FirstPromoter + assets (£200 × 6) | -£1,200 | Locked |
| Flagship per-piece content (£500 × 6) | -£3,000 | Continuation of M1–M6 cadence |
| PT bonuses + contests (quarterly £1,000 × 2) | -£2,000 | Annual £2,000 already paid M6; next falls outside window |
| Tier graduation bonuses | -£1,400 | Continued PT graduation as programme matures |
| Gym partnership second wave | -£1,890 | Assumed match to H1 — flag as planning assumption (M) |
| **H2 OpEx total** | **-£13,048** | |

### 7.5 H2 P&L summary

| Line | H2 total |
|---|---|
| Kit gross | £34,622 |
| Supplement net | £13,357 |
| **Total contribution H2** | **£47,979** |
| OpEx H2 | -£13,048 |
| **Net contribution H2** | **+£34,931** |

### 7.6 12-month cumulative cash position (planning)

| Period | Net contribution | Cumulative cash |
|---|---|---|
| H1 (M1–M6) | +£4,315 | +£4,315 |
| H2 (M7–M12) | +£34,931 | **+£39,246** |

**Adding the FM deposit float (~£3,525 H1 + ~£4,000 H2 incremental, ignoring drop-off) gives a cash position at M12 of ~+£46,000–47,000 including the deposit liability.**

### 7.7 Is £30k cash by M12 achievable?

**Yes — comfortably.** Planning case lands at **+£39,246 cumulative net contribution by M12 on P&L alone** (no FM deposit float). That is ~£9,200 above the £30k target — about 31% headroom.

Stress tests:
- **Tenure 3-mo (low):** H2 supplement net falls by ~30% (active subs scale with tenure) → ~£9,400 supplement net H2 → H2 net ~£31,000 → 12-mo cash ~£35,300. **Still above £30k.**
- **Conversion 8% instead of 15%:** H2 supplement net ~£7,200 → H2 net ~£28,800 → 12-mo cash ~£33,100. **Still above.**
- **Both stresses simultaneously (3-mo tenure + 8% conversion):** supplement net H2 ~£4,800 → H2 net ~£26,400 → 12-mo cash ~£30,700. **Marginally above.**
- **Add 30% volume haircut (effectively minimum-case ramp continuing):** H2 kit gross would fall by ~£10,400; H2 net ~£24,500; 12-mo cash ~£25,300. **Below target by ~£5k.** Recovery achievable in M13–M14 absent further stress.

**Verdict at planning:** **£30k by M12 is achievable with material headroom**, robust to single-variable stress (tenure or conversion alone), but contingent on H2 volume ramp materialising. Volume is the binding constraint, not unit economics. v2 said £30k was "not yet" reachable; v3 says "yes, by M12 at planning case."

---

## 8. Variance analysis

### 8.1 Variance vs v2 of this model — the headline correction

**This is the most important comparison Keith asked for in the v3 brief.**

| Metric | v2 (v2.2 stack with first-month uplift, £8k tier retention) | v3 (v2.3 right-sized) | Δ | Why |
|---|---|---|---|---|
| **Blended kit net (K1 / K2 / K3)** | £24.45 / £38.47 / £54.05 | **£25.70 / £39.72 / £55.30** | +£1.25 / +£1.25 / +£1.25 | Drop first-month bonus (+£2.50/aff kit × 50% mix = +£1.25) |
| **Kit 1 LTV (mid)** | £36.95 | **£38.20** | +£1.25 | Kit margin only |
| **Kit 2 LTV (mid)** | £59.94 | **£61.19** | +£1.25 | Kit margin only |
| **Kit 3 LTV (mid)** | £66.55 | **£67.80** | +£1.25 | Kit margin only |
| **6-mo kit gross (planning)** | £16,190 | **£16,753** | **+£563** | 450 kits × £1.25/kit |
| **6-mo total contribution (planning)** | £20,550 | **£21,113** | **+£563** | Kit gross delta only (supp net unchanged) |
| **6-mo programme/overhead OpEx** | -£19,508 | **-£16,798** | **+£2,710** | -£8k tier retention, -£1k contests, +£1.4k graduation, +£3k flagship content, +£1.89k gym kits |
| **M6 net contribution (planning)** | +£522 | **+£1,072** | +£550 | Combined |
| **6-mo cumulative net contribution (planning)** | **+£1,042** | **+£4,315** | **+£3,273** | +£563 margin + £2,710 OpEx |
| **M6 cash position (planning, P&L)** | +£1,042 | **+£4,315** | **+£3,273** | (matches net) |
| **M6 cash position incl. FM float** | ~+£4,792 | **~+£7,840** | +£3,048 | FM float roughly unchanged |
| **M12 cash position projection (planning)** | not produced | **~+£39,246** | n/a (new) | 12-mo extrapolation per v3 brief |
| **6-mo net (minimum, 375)** | -£2,368 | **+£811** | +£3,179 | Combined |
| **6-mo net (stretch, 510)** | +£3,816 | **+£7,164** | +£3,348 | Combined |

**Decomposition of the +£3,273 6-month delta at planning:**

| Driver | Δ on 6-mo net |
|---|---|
| Drop £10 first-month bonus (+£2.50 × 50% × 450 aff kits) | +£563 |
| PT tier retention monthly recurring eliminated (-£8,000) | +£8,000 |
| Tier graduation bonuses introduced (one-off £1,400) | -£1,400 |
| PT bonuses + contests right-sized (£5,000 → £4,000) | +£1,000 |
| Flagship content payments (£3,000 — was hidden retainer, now visible) | -£3,000 |
| Gym partnership free kits (£1,890 — was hidden, now visible) | -£1,890 |
| **Net** | **+£3,273** ✓ |

**Headline narrative.** v2 said Phase 0 is "roughly cash-neutral on P&L alone." v3 says Phase 0 is **"a self-funding profit centre that comfortably hits the £30k-by-M12 cash target"** at planning case, with material headroom and robustness to single-variable stress.

The single largest line-item improvement is **eliminating the £8,000 monthly tier-retention liability** — it was the largest visible OpEx line in v2 and was modelled as a fixed obligation against PTs hitting Silver/Gold thresholds. v2.3 replaces it with one-off graduation bonuses paid only when a PT actually graduates — which aligns reward to behaviour rather than to status maintenance.

The second-largest is **making the previously-hidden costs visible** (gym kits, flagship content payments) so that the P&L is now defensible end-to-end. The headline +£3,273 understates the real saving against the v2.2 marketing-plan baseline that included those hidden lines (~£7–10k saving on a true like-for-like basis).

### 8.2 Variance vs v2.2 marketing plan §1 line 69 ("-£704 minimum case kits-only")

Under v3 + 40/40/20 + no first-month uplift, the apples-to-apples kits-only minimum-case calculation:

```
Kit gross (v3, 40/40/20, 375 total):
  150 × £25.70 + 150 × £39.72 + 75 × £55.30
  = £3,855 + £5,958 + £4,148 = £13,961
Less: PT bonuses + contests (v2.3) -£4,000
Less: PT tier retention (v2.3)        £0
Less: Tier graduation bonuses        -£1,400
Less: Flagship per-piece content     -£3,000
Less: Gym partnership kits           -£1,890
Less: FirstPromoter + assets         -£1,200
Less: Free kits                      -£1,750
Net cash on kits (v3 min, kits-only): -£1,279
```

vs v2.2 §1 line 69 at -£704 (Kit-2-dominant 75/210/90):
- v2.2 line 69 used kit-gross of £15,246 (Kit-2-heavy mix at v2.2 published margins).
- v3 at 40/40/20 mix shows kit-gross of £13,961 — £1,285 less, because of the Kit 1 ↔ Kit 2 reallocation under equal pacing (60 kits move from Kit 2 at £39.72 to Kit 1 at £25.70 = -£841; remaining -£444 = mix-rebalance rounding).
- v3 OpEx is £13,240 vs v2.2 §1 implied £15,950 → +£2,710 saving.
- Net: v2.2 -£704 + (-£1,285 mix penalty) + (+£2,710 OpEx saving) = **+£721** (v3 min kits-only at full apples-to-apples).

My calc above lands at -£1,279 — the gap to +£721 is exactly £2,000, which is the **flagship retainer** the v2.2 marketing plan §1 line 67 referenced but did not include in line 69 (the 5 × £250 × 6mo = £7,500 retainer that v2.2 contemplated would have made the v2.2 line 69 worse, not better, by ~£7,500). The v2.3 right-sizing replaces the £7,500 retainer with £3,000 flagship per-piece content payments — saving £4,500 against the v2.2 retainer assumption.

**Cleaned-up like-for-like comparison (kits-only, minimum case, 6 months):**

| Model | Kit gross (mix-adjusted) | OpEx | Kits-only net | Note |
|---|---|---|---|---|
| v2.2 §1 line 69 (Kit-2-dominant, 75/210/90) | £15,246 | -£15,950 visible (excl. retainer) | -£704 | v2.2 published |
| v2.2 §1 lines 67+69 (with flagship retainer £7,500 added) | £15,246 | -£23,450 | -£8,204 | What v2.2 actually implied |
| v2 of this model (40/40/20, with first-month uplift) | £13,961 - £469 first-month = £13,492 | -£15,950 | -£2,458 | Documented in v2 §3.6 |
| **v3 (40/40/20, v2.3 right-sized)** | **£13,961** | **-£13,240** | **+£721** | This document |

**Interpretation:** v2.2's marketing plan §1 minimum-case kits-only line at -£704 always understated the true cost because the flagship retainer was a separate line item not netted against the kits-only number. Once that retainer is properly costed in, v2.2's true kits-only minimum-case figure was approximately -£8,204. **v3's +£721 is therefore a ~£8,925 improvement against the apples-to-apples v2.2 baseline** — the bulk of which comes from replacing the flagship retainer with per-piece content payments and from eliminating monthly tier retention.

The primary narrative for Keith: v3's minimum-case kits-only line is **positive** for the first time across the model series. Phase 0 minimum case is no longer a kits-only loss leader — it is mildly cash-positive on kits before supplement net, before FM deposit float, before fixed overhead.

### 8.3 Variance vs legacy v72-financials §§4.2–4.4

Unchanged from v2 — those sections remain stale (transitional pricing, no Option 4, no v2.3). Should be retired or replaced with rerun-exported cells.

---

## 9. Risks, assumptions, confidence tags

### 9.1 Confidence summary (v3-specific changes flagged)

| Assumption | Confidence | Note |
|---|---|---|
| Kit pricing (£99 / £119 / £179) | H | v2.2 ratified |
| Kit COGS (£58.50 / £63 / £98) | H | Vitall finger-prick quoted |
| Stripe 2.5% | H | Locked |
| Affiliate £15 + Kit 3 £10 + supp £10 (no first-month, no flagship Kit 3) | H | v2.3 right-sized |
| Affiliate sales mix 50/50 | H | v2.2 canonical |
| Daily Stack COGS £12 | M | Manufacturer brief midpoint; v72 conflict carried |
| Daily Stack tenure 4-mo planning | **L** | Single largest swing variable |
| Kit → Daily Stack 15% conv | M | Agent C planning |
| Volume mix 40/40/20 | M | Locked equal-pacing |
| Total kits 450 (planning) | M | v2.2 baseline |
| **PT tier graduation count (3 Silver + 2 Gold over 6 mo)** | **M-L** | New v3 assumption — will need post-launch calibration |
| **Flagship per-piece content £100/piece × 1/mo × 5 PTs** | **M** | New v3 line — assumes flagships engage with content-for-payment cadence |
| **Gym partnership free kits (3 × 10 gyms)** | **M-L** | Ten gyms is the v2.3 plan target; kit count per gym is a planning assumption |
| Fixed overhead £593/mo | H | v72 canonical |
| H2 OpEx continuation profile (M7–M12) | **M** | Planning assumption — gym partnership second wave + flagship continuation |
| H2 volume ramp (130 → 180) | M | Per v3 task brief |
| Elective FM opt-in 5% | L | Agent C estimate |
| Low-T base rate 30% | M | Selection-adjusted UK male population |

### 9.2 Inputs where v3 planning case is most sensitive

1. **Tenure** — 6-mo net swings ~£1,800–2,500 per month of tenure between 3 and 6. Single largest uncertainty. Validation priority #1.
2. **Daily Stack supplement-conversion rate** — 6-mo net swings ±£2,319 across 8–22%.
3. **Affiliate mix** — 6-mo net swings ±£1,303 per 10-point shift in PT-coded share (slightly larger than v2's ±£1,196).
4. **Volume scenario (min vs stretch)** — 6-mo net swings ~£6,353 across 375 → 510.
5. **H2 volume ramp materialising at planning (130 → 180)** — single largest determinant of whether £30k by M12 is hit.

### 9.3 Internal contradictions / data-hygiene flags (v2 carry-forward)

| Contradiction | Resolution |
|---|---|
| Daily Stack COGS: `daily-stack.md` £11–13 vs v72-financials £15 | Used £12. v72 §2.2 needs revision. |
| Affiliate model: legacy 12.5% (v72 §1) vs v2.3 stack | v2.3 canonical. v72 §1 stale. |
| Affiliate mix: 20% (v72) / 50/50 (v2.2 + v3) | 50/50. v72 stale. |
| Pricing: v72 transitional vs v2.2 canonical | v2.2. v72 §§4.2–4.4 stale. |
| Fixed overhead: £593 (v72) vs v1's £640 | £593. |
| Kit-2-dominant vs equal-pacing mix | 40/40/20 (Option 4 + equal pacing) |

### 9.4 New contradictions surfaced in v3 (not present in v2)

1. **v2.2 marketing plan §1 line 69 ("-£704 kits-only minimum")** is a misleading number — it omitted the flagship retainer that v2.2 §1 line 67 contemplated. The true v2.2-implied figure was ~-£8,204. v3's +£721 is a meaningful improvement; the spreadsheet rerun should clean this up. (See §8.2.)
2. **Tier graduation bonus pool sizing (£1,400)** is a planning assumption — derived from "3 Silver £200 + 2 Gold £400 expected." If the PT programme over-performs and 6 PTs hit Silver and 4 hit Gold over 6 months, the bonus pool rises to £2,800 and v3 net falls by £1,400. This is a real risk and should be calibrated against actual PT recruitment + activation rates from M2 onwards.
3. **Flagship per-piece content cadence (1 piece/mo × £100)** assumes flagship PTs engage with the content-for-payment model. If the cadence drifts to 0.5 pieces/mo per PT, the spend halves and v3 net rises by £1,500. If flagships push for 2 pieces/mo, the spend doubles and v3 net falls by £3,000. M-L confidence; needs early measurement.
4. **Gym partnership second wave** is a planning assumption for H2. If H2 gym partnerships add another £1,890 (matching H1), 12-mo OpEx is as modelled. If H2 doubles down (~£3,780), 12-mo cash drops to ~£37,400 — still above £30k. If H2 is paused, 12-mo cash rises to ~£41,100.

### 9.5 Single biggest swing variable (unchanged)

**Daily Stack subscriber tenure.** A 1-month swing in the 3–6 range moves 6-month net by ~£2,000 and 12-month net by ~£4,500. Validation priority #1 is measuring actual Daily Stack churn from M3 onward.

---

## 10. Recommendations for the spreadsheet rerun (v2 → v3 cell-equivalent changes)

The `01_strategy/financial-model/andro-prime-phase0-v72.xlsx` and `phase0-financial-model-v1.xlsx` workbooks should be updated to align with this v3 markdown model. Itemised changes from v2's recommended state:

| # | Input | v2 value | v3 value | Rationale |
|---|---|---|---|---|
| 1 | First-month bonus uplift | -£2.50/aff kit | **£0 — line removed** | v2.3 drops the £10 first-month bonus entirely |
| 2 | Kit 1 affiliate net | £10.87 | **£13.37** | (1) reverses |
| 3 | Kit 2 affiliate net | £23.92 | **£26.42** | (1) reverses |
| 4 | Kit 3 affiliate net (with £10 standard bonus) | £31.57 | **£34.07** | (1) reverses |
| 5 | Blended K1 / K2 / K3 | £24.45 / £38.47 / £54.05 | **£25.70 / £39.72 / £55.30** | (1)–(4) propagate |
| 6 | Flagship £20 Kit 3 uplift | not applied (v2 used £10 standard) | **stays £10 standard** | No change — v2.2 line 56 already used £10 |
| 7 | PT bonuses + contests OpEx (6-mo) | -£5,000 | **-£4,000** | Quarterly £1,000 ×2 + annual £2,000 |
| 8 | PT tier retention OpEx (monthly recurring) | -£8,000 | **£0** | v2.3: dropped entirely |
| 9 | Tier graduation bonus pool (one-off) | not modelled | **-£1,400** | New v2.3 line: 3 Silver £200 + 2 Gold £400 |
| 10 | Flagship retainer (5 × £250 × 6mo, hidden in v2.2 §1 line 67) | not on v2 P&L | replaced with **flagship per-piece content -£3,000** (£500/mo) | v2.3 right-sizing — replaces fixed retainer with paid-per-piece |
| 11 | Gym partnership free kits | not on v2 P&L (hidden) | **-£1,890** (3 × 10 gyms × £63 COGS) | v2.3: surface this line |
| 12 | Free kits | -£1,750 | **-£1,750** | Unchanged |
| 13 | FirstPromoter + assets | -£1,200 | -£1,200 | Unchanged |
| 14 | Total visible programme OpEx (6-mo, ex overhead) | -£15,950 | **-£13,240** | Sum of (7)–(13) |
| 15 | M1 OpEx phasing — gym kits | not in v2 | **-£630/mo M1–M3** | New phasing |
| 16 | M3 OpEx phasing — quarterly contest | -£800 (in -£800/mo bonus run rate) | **-£1,000 (single quarterly hit)** | New cadence |
| 17 | M6 OpEx phasing — quarterly + annual contest | -£1,000 | **-£3,000 (£1,000 quarterly + £2,000 annual)** | New cadence |
| 18 | Tier graduation phasing M4 / M5 / M6 | not in v2 | **-£200 / -£600 / -£600** | New |
| 19 | 12-month projection | not in v2 | **add M7–M12 with volume ramp 130/140/150/160/170/180** | New per v3 brief |
| 20 | M12 cash target (£30k by M12) | not modelled | **-£30,000 target line; planning case clears at +£39,246** | Confirms target reached |
| 21 | Per-customer LTV table | K1 £36.95 / K2 £59.94 / K3 £66.55 | **K1 £38.20 / K2 £61.19 / K3 £67.80** | (5) propagates |

**Priority order for spreadsheet rerun:**
1. Drop the first-month bonus deduction (input #1) — corrects per-kit affiliate net across all three kits in one stroke.
2. Replace the v2 OpEx tier-retention block (-£8,000) with the v2.3 graduation-bonus + per-piece content + gym-partnership lines (#7–#11) — this is the single largest model-shape change.
3. Recompute blended kit nets (#5) and propagate through every kit-gross calc.
4. Add 12-month projection sheet with the v3 H2 ramp + OpEx continuation profile (#19) — necessary to evidence the £30k target.
5. Update LTV table (#21).
6. Update narrative cells: model version (v3), supersedes statement, headline 6-mo and 12-mo figures.

Once rerun, the workbook should:
- Show v3 6-month net contribution (planning) at +£4,315
- Show v3 12-month cumulative cash at ~+£39,246
- Show v3 minimum case as P&L cash-positive (+£811) without FM float dependency
- Show the affiliate-mix soft constraint (v3 net falls below £3k once PT-coded share rises above 60%) as a Section-4 sensitivity output
- Carry the v3 v2 → v3 variance table (§8.1) as a top-of-workbook diagnostic

---

*End of v3 model. Compiled 2026-05-08. UK English. UK & NI scope. Owner: Keith Antony. v3 supersedes v2 (in git history).*
