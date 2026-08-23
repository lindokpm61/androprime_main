# Supplement Purchase List — every SKU the shop needs, and what gates each one

**Created:** 2026-08-22 | **Owner:** Keith | **Status:** Working buy-list. Nothing ordered. Gate 0A still governs the order.
**Supplier:** Nutribl, Tier 1 trade prices, catalogue export 2026-08-20 (138 products) + PDF catalogue 2026-08-22 (164 entries).
**Governing rule:** catalogue scope equals panel scope. We stock a supplement only where we test the marker its authorised claim names.

**Read with:** `biomarker-supplement-loops.md` (the loop analysis, parts of which predate the
2026-08-22 shop model), `../CONTEXT.md` (Gate 0A), `../../05_partners/manufacturers/nutribl/2026-08-22-call-sheet.md`
(the questions three of these depend on).

---

## 1. Buy now — marker already live

These three are the launch range. Verified in stock, one-a-day dosing, £1.92/month combined COGS.

| # | Product | Nutribl ID | Trade | Per month | Authorised claim | Marker | Kit |
|---|---|---|---|---|---|---|---|
| 1 | Vitamin D3 4000 IU, 365 tablets | `1152` | £3.00 | **£0.25** | Vitamin D contributes to maintenance of normal bones, muscle function, teeth, immune system | Vitamin D (25-OH) | **Kit 2** live |
| 2 | Vitamin B12 Methylcobalamin 1mg, 120 caps | `1009` | £3.95 | **£0.99** | B12 contributes to reduction of tiredness and fatigue, normal red blood cell formation, normal homocysteine metabolism | Active B12 | **Kit 2** live |
| 3 | Zinc 15mg, 120 caps | `1121` | £2.72 | **£0.68** | Zinc contributes to maintenance of normal testosterone levels in the blood | Total Testosterone | **Kit 1** live |

**Zinc carries an open Ewa question.** One capsule is 15mg citrate against the 25mg gluconate
spec; two capsules is 30mg, the exact dose Ewa removed on 2026-08-02 for exceeding the
supplemental ceiling. The specced dose is unreachable on this SKU at any serving. See `../STATE.md`.

**D3 note:** `1152` is **vegetarian but not vegan**; the only vegan D3 in the range is 1,000 IU.
Its own label carries the manufacturer's caution to use it under guidance of a health
professional, which supports the D3-above-assay-ceiling carve-out.

## 2. Buy now — decision pending, marker already live

| # | Product | Nutribl ID | Trade | Per month | Why it is a decision |
|---|---|---|---|---|---|
| 4 | Vitamin D3 3000 IU + K2 100µg MK-7, 90 caps | `1095` | £3.64 | £1.21 | **K2 has no marker of its own.** It qualifies only by riding the vitamin D panel inside this combined SKU. Standalone K2 `840` at £1.08/month would be the first product in the shop with nothing behind it. Choosing `1095` also drops D3 from 4,000 to 3,000 IU, and 4,000 is the SKU drawn in the results-page mockups. |

## 3. Blocked on a kit — buy when the panel ships

| # | Product | Nutribl ID | Trade | Per month | Claim names | Marker | Kit needed |
|---|---|---|---|---|---|---|---|
| 5 | Selenium 200µg, 120 caps | `1118` | £3.59 | £0.90 | normal **thyroid function** (printed on their listing) | TSH | **Kit 5 Thyroid** |
| 6 | Iodine, single-nutrient | **none** | — | — | normal thyroid function | TSH | **Kit 5** + supplier answer |
| 7 | Methyl Folate Quatrefolic 600µg, 90 caps | `1037` | £6.14 | £2.05 | normal **homocysteine metabolism** | Homocysteine | **Kit 3 Plus** |
| 8 | Omega 3 Fish Oils 1000mg, 90 softgels | `851` | £5.40 | £1.80 | EPA+DHA contribute to normal **heart** function (250mg, 1 softgel) | Omega-3 Index, or lipids | **Omega-3 kit** or Kit 3 Plus |
| 9 | Vegan Omega 3 Algal Oil, 90 softgels | `1153` | £9.73 | £6.49 | as above, plus DHA **brain** and **vision** at 250mg (2 softgels) | as above | as above |
| 10 | Flaxseed Oil 1000mg, 90 softgels | `857` | £6.16 | **£8.21** | At 4 softgels (2g ALA), ALA contributes to maintenance of normal **blood cholesterol** | Total cholesterol / LDL | **Kit 3 Plus** |
| 11 | Liver Support Choline Complex, 60 caps | `933` | £4.57 | £4.57 | Choline contributes to maintenance of normal **liver function** (82.5mg per 2 caps, exactly the threshold) | ALT, GGT, ALP | **Kit 3 Plus** or Liver Check |
| 12 | Chromium, single-nutrient | **none** | — | — | maintenance of normal **blood glucose** | HbA1c | **Kit 3 Plus** + supplier answer |
| 13 | Pantothenic acid (B5), single-nutrient | **none** | — | — | normal synthesis and metabolism of **steroid hormones** | Cortisol | **Kit 6** + supplier answer |

**Serving notes that change the arithmetic.** `933` is 2/day, so 60 capsules is one month, not two.
`857` needs **4 softgels** to reach the 2g ALA the claim requires, which is inside its stated
"1 to 4 softgels daily" serving, so it is on-label, but it makes it the dearest item here at
22 days per bottle. `851` and `1153` are quoted at the servings their printed claims specify.

**Do not use their stock Vitamin B Complex `951` for the homocysteine loop.** It uses
cyanocobalamin and folic acid, the cheap forms. It is listed at item 13 only as the sole
current vehicle for B5, and it carries the same objection there.

## 4. In the catalogue, deliberately not bought

| Product | Why not |
|---|---|
| Collagen Powder 300g `1129` £15.42 | **No marker.** Sourcing and formulation both solved (see `../STATE.md`), and it clears Gate 0A as stock private-label. It has nowhere to sit under the rule, and at ~48% margin it is the worst in the range. Route decision owed, not a formulation decision. |
| Glucosamine `932` £1.92 / `875` £3.06 | **No marker.** Better name fit and 90%+ margin, still no panel. No joint or cartilage biomarker exists on any finger-prick model, so this is a category-level no, not a SKU-level one. |
| Creatine `1361` £1.85 | **No marker, and the one blood signal it moves is serum creatinine, a kidney marker it confounds.** Passes the EFSA-claim and demand gates hard (201,000 searches). The May instruction to put it to Keith as a demand-led-line-versus-thesis-purity decision was never actioned. |
| Iron, magnesium, turmeric, chromium-in-a-fat-burner, plant sterols, psyllium, ALA, NAC | Rulings unchanged. Iron is a deliberate refusal; magnesium has no finger-prick marker (haemolysis); turmeric claims are on hold, **including Nutribl's own printed "may help to support healthy liver function" on five SKUs, which we must not repeat**; plant sterols deliver 540mg against the 800mg the cholesterol claim needs; psyllium caps near 3g against ~7g; ALA has no authorised claim. |

## 5. What this costs

| Stage | SKUs | Combined COGS/month |
|---|---|---|
| Launch, today's markers | 3 | **£1.92** |
| + K2 decision (swap `1152`→`1095`) | 3 | £2.88 |
| + Kit 5 Thyroid | 5 | ~£3.80 + iodine |
| + Kit 3 Plus | 9 | ~£18.80 + chromium |
| + Omega-3 and Kit 6 | 11 | ~£21.80 |

Against a £34.95 modelled retail on a single subscription, the launch three hold above 90%
margin down to about £19.95 and clear 80% at £9.95. **No price is set.** The separate-bottles
pricing architecture is still open and no figure is approved.

## 6. Three SKUs do not exist, and they decide how wide the shop gets

Iodine, chromium and pantothenic acid are all **single-nutrient capsules**, the simplest thing
a manufacturer can be asked to run, and all three are the only compliant route to their panel.
They sit alongside the already-known ask for **selenium at 100µg instead of 200µg**.

Four asks, one conversation: `../../05_partners/manufacturers/nutribl/2026-08-22-call-sheet.md`.
