# All-Clear Maintenance Offer — CTA Copy (DRAFT)

**Status:** DRAFT — pending Ewa + compliance sign-off; built dark behind flag (`MAINTENANCE_OFFER_ENABLED`, default OFF).
**Owner workspace:** `07_sales/funnel`
**Source spec:** `supplement-conversion.md` (the all-clear problem, ~21-29) + `08_customer-journey/flows/flow-4-results-to-action.md` Part C.
**Compliance basis:** `03_compliance/CONTEXT.md` EFSA Approved Claims table (verbatim only) + `04_products/supplements/daily-stack.md` V7.2 formulation.
**Nothing here ships until Ewa signs off** (see `all-clear-offer-signoff-pack.md`). This is a claims and positioning decision, not a copy tweak.

---

## Claims mapping table (Step 1 — foundation)

Every claim sentence in this file footnotes to a row here. A claim may attach only to a nutrient that is (a) in the V7.2 Daily Stack formulation AND (b) tied to a marker the kit actually measured AND (c) came back in range for that customer. The card only renders on the all-clear path (every measured marker in range), so all mappable claims apply when shown.

| # | In-range marker | Kits that measure it | Daily Stack nutrient (V7.2) | Verbatim EFSA claim (from compliance allowlist) |
|---|---|---|---|---|
| 1 | Testosterone (in range: not low, not borderline) | Kit 1, Kit 3 | Zinc (Gluconate 30mg) | "Contributes to the maintenance of normal testosterone levels" |
| 2 | Vitamin D | Kit 2, Kit 3 | Vitamin D3 (Cholecalciferol 4,000 IU) | "Contributes to normal muscle function" |
| 3 | Active B12 (Methylcobalamin) | Kit 2, Kit 3 | Active B12 (Methylcobalamin 1,000mcg) | "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function" |

**Markers with NO Daily Stack claim (deliberately carry no maintenance claim on this card):**

- **hs-CRP (Kit 2/3):** the only nutrient tied to it is Vitamin C in the separate Joint & Recovery Collagen product, not the Daily Stack. No Daily Stack claim.
- **Ferritin (Kit 2/3):** Andro Prime does not sell iron (clinical overdose risk, per flow-4). No claim, no nutrient.

**Not on this card, ever:**

- The V7.2 silent ingredient (no approved EFSA claim). Never named, hinted at, or claimed for, anywhere.
- Magnesium — removed in V7.2; its retired fatigue claim is not used.
- Any paraphrase (e.g. "supports healthy testosterone", "boosts", "raises"). Verbatim EFSA or nothing.

---

## Claims-block approach: ONE card, per-kit claims block

**Approach taken:** a single maintenance card whose **headline, framing body, waitlist line, and button are identical across all kits**, with **only the claims block selected per kit type** (three variants below). 

**Why this and not three separate cards:** the maintenance positioning ("your levels are good, here is how to keep them there") is identical regardless of kit; the only thing that legitimately differs is *which* verbatim claims are permitted, and that is driven entirely by which markers the kit measured (Kit 1 = testosterone only, so Zinc only; Kit 2 = no T marker, so it leads with Vitamin D / B12; Kit 3 = both panels, so all three). One card template plus a per-kit claims block keeps the voice consistent, gives compliance a single surface to review, and maps cleanly onto the planned single `maintenance-offer` CtaType with copy chosen by kit type. It also makes the "claims attach only to measured-and-in-range markers" rule structural rather than editorial.

---

## Dashboard CTA card copy

Shared across all kits unless marked per-kit. No em dashes. All customer-facing strings verbatim below.

### Headline (all kits)

> YOUR LEVELS ARE GOOD. HERE IS HOW TO KEEP THEM THERE.

### Body line 1 — framing (all kits)

> Your results came back in range. That is good news, and nothing here needs fixing.

### Body line 2 — claims block (SELECT ONE per kit)

**Kit 1 (testosterone only):**

> The Daily Stack is the maintenance dose of the nutrient tied to that marker. Zinc contributes to the maintenance of normal testosterone levels.¹ The point is holding a good result, not pushing it higher.

**Kit 2 (Vitamin D + Active B12; no testosterone marker):**

> The Daily Stack is the maintenance dose of the nutrients tied to those markers. Vitamin D contributes to normal muscle function.² Active B12 contributes to normal energy-yielding metabolism and normal psychological function.³

**Kit 3 (testosterone + Vitamin D + Active B12):**

> The Daily Stack is the maintenance dose of the nutrients tied to those markers. Zinc contributes to the maintenance of normal testosterone levels.¹ Vitamin D contributes to normal muscle function.² Active B12 contributes to normal energy-yielding metabolism and normal psychological function.³

### Body line 3 — waitlist honesty (all kits)

> Supplements are not on sale yet. Join the waitlist and you will be first to know when the Daily Stack ships, with a founding-customer discount.

### Button label (all kits)

> Join the supplement waitlist

### Button destination

`/supplement-waitlist` (POSTs the waitlist opt-in, fires `supplement_waitlist_joined`; NOT a Stripe subscription — supplements are deferred in Phase 0a, the subscription route deliberately 400s). Button label is waitlist-honest: it names joining a waitlist, never buying.

**Footnotes (map to the Step 1 table):**
1. Row 1 — Zinc → "Contributes to the maintenance of normal testosterone levels".
2. Row 2 — Vitamin D3 → "Contributes to normal muscle function".
3. Row 3 — Active B12 → "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function".

---

## Optional supporting line for seq-03c (PROPOSAL ONLY — do not edit seq-03c)

seq-03c is approved and activation-ready under CA-020 and **must not be edited**. This is a proposal for Ewa to consider only; it is not applied here.

Proposed single line, to sit in Email 3 ("One honest recommendation given your results") immediately before the existing waitlist CTA, aligned to the sequence's existing "Normal doesn't mean optimal" / "keeping it where it is" tone:

> Think of it as maintenance, not correction: your numbers are good, and the honest goal is keeping them there, not pushing them higher.

Rationale: reinforces the maintenance frame the sequence already carries, stays fear-free, and adds no nutrient claim beyond the verbatim EFSA lines Email 3 already prints. No em dashes.

---

## Compliance self-check (against `03_compliance/CONTEXT.md`)

- **EFSA claims verbatim only** — every claim sentence lifts the exact allowlist wording; no paraphrase, no "boost/raise/support healthy". PASS.
- **Claims attach only to nutrients present AND measured-in-range** — Kit 1 carries Zinc only (T-relevant); Kit 2 carries no T claim (no T marker); Kit 3 carries all three. PASS.
- **Maintenance framing, no deficiency, no fear** — "your levels are good", "nothing here needs fixing", "holding a good result"; never implies anything is wrong or needs treatment. PASS.
- **No red-flag language** — no "diagnose/treat/cure", no "you have", no "TRT available". PASS.
- **Silent ingredient** — not named, hinted, or claimed for, anywhere in this file. PASS.
- **No "referral"** anywhere in this supplement-adjacent copy. PASS.
- **No em dashes** in any customer-facing string. PASS.
- **Waitlist-honest CTA** — button and body say join a waitlist, not buy; destination `/supplement-waitlist`. PASS.

**Ewa/compliance decision still required** (cannot be self-cleared): the *positioning* question — is offering a maintenance stack to an all-clear customer consistent with the "don't guess, test" thesis. See `all-clear-offer-signoff-pack.md`, section 3. One drafting choice flagged for her review: the phrase "the maintenance dose of the nutrient(s) tied to those markers" describes product contents, not a whole-product efficacy outcome; efficacy is carried only by the verbatim per-nutrient claims. Confirm this reads as intended.

## Compliance pre-flight result (2026-07-07, `/compliance-preflight` scanner + judgement pass)

- **🔴 HARD: 0.**
- **🟠 REVIEW: 21**, all resolved by the judgement pass with `03_compliance/CONTEXT.md` loaded:
  - 14 hits are the scanner's ingredient+benefit heuristic firing on the claim sentences themselves; each was verified character-for-character against the EFSA allowlist (Zinc → "Contributes to the maintenance of normal testosterone levels"; Vitamin D3 → "Contributes to normal muscle function"; Active B12 → "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function"). Verbatim, permitted.
  - 2 Magnesium hits are the internal notes stating it is removed (V7.2) and its retired claim unused — rule-quoting, compliant.
  - 3 "fixing" hits are the negation "nothing here needs fixing" (asserts nothing is wrong; no supplement-fixes-anything claim). Left verbatim; **listed for Ewa below** as customer-facing wording she may prefer to adjust.
  - 1 TRT hit is the self-check line quoting the rule. Compliant.
- **For Ewa's wording review alongside the positioning question:** (a) "nothing here needs fixing" (Body 1); (b) the "maintenance dose" phrasing noted above.
- Not approved. Ewa + compliance sign-off required before the flag ever turns on.
