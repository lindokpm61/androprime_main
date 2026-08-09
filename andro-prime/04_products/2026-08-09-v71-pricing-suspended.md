# Decision: V7.1 and transitional kit pricing are suspended

**Date:** 2026-08-09
**Decided by:** Keith Antony
**Owner workspace:** `04_products`
**Class:** pricing

---

## The decision

**Canonical kit retail pricing is £99 / £119 / £179** (v2.2, originally decided by Keith
2026-05-08), encoded in `09_website-app/frontend/lib/pricing.ts`, which is what actually charges
the customer. PT-coded sales are 10% off: £89.10 / £107.10 / £161.10.

**Two earlier price sets are SUSPENDED. Neither may be used, quoted, or referenced as a live
price anywhere:**

| Set | Kit 1 | Kit 2 | Kit 3 | Status |
| --- | --- | --- | --- | --- |
| V7.1 original | £29 (£35 standard) | £44 | £69 | SUSPENDED |
| Transitional | £89 | £99 | £149 | SUSPENDED |
| **v2.2 canonical** | **£99** | **£119** | **£179** | **LIVE** |

Keith's instruction, 2026-08-09: suspend the old pricing table; the old prices are not to be used
and not to be referenced.

## What that means in practice

- **A superseded price may never appear as a bare `Price:` or in a "Retail" column** without being
  struck through and marked. Struck-through spans are the repo's existing convention and
  `content-doctor` invariant 7 already masks them, so a struck value cannot be mistaken for a live
  assertion by tooling or by a reader.
- **A labelled historical annotation is permitted and is not a reference in the sense above** —
  for example a `Was (V7.1)` column that leads with the current price. That is a record of the
  change, not a price anyone can act on. These are listed in the sweep report so Keith can rule
  otherwise if he wants them gone too.
- **Competitor prices that coincide numerically are untouched.** Medichecks, LetsGetChecked and
  Numan genuinely charge figures near £89 / £99 / £149; those are market data, not our pricing.
- **Dated decision briefs, research snapshots and partner correspondence keep their original
  text.** They record what was believed on their date, which is the point of them.

## Why this was needed

The 2026-08-09 Vitall margin chart pulled its figures from `lib/pricing.ts` and, in doing so,
surfaced that `catalogue/non-regulated-tier-v7.md` still presented the transitional
£89 / £99 / £149 as current retail in three separate tables, with no marker on any of them,
while the same file's own header said current pricing was £99 / £119 / £179. Two prices in one
file, one wrong, and nothing watching which one a reader or an agent picked up.

The same file also carried two straightforwardly wrong statements: Kit 2's price given as £99
(it is £119) and described as "updated from £35", which is Kit 1's old number.

## Verification

The live customer-facing surface was checked as part of this sweep and is **clean**: a grep for
the suspended figures across `09_website-app/frontend` (excluding build output) returns no kit
pricing, only the unrelated £29.95 collagen subscription. The v2.2 site migration recorded in
`09_website-app/docs/v2.2-migration-audit.md` is complete; that audit is history, not an open
exposure.

## Related

- `catalogue/product-catalogue-v7-1.md` — full current catalogue and rationale
- `catalogue/non-regulated-tier-v72-financials.md` — reconciled unit economics (§2.1)
- `pricing/2026-08-09-vitall-cost-vs-retail-margins.html` — cost, retail and margin chart
- `09_website-app/frontend/lib/pricing.ts` — the values that actually charge
