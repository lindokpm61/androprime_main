# All-Clear Maintenance Offer — Ewa Sign-Off Pack (one page)

**Status:** DRAFT for decision. Nothing here is approved. Built dark behind `MAINTENANCE_OFFER_ENABLED` (default OFF). Full copy: `all-clear-maintenance-offer-copy.md`.
**Decision needed from Ewa + compliance:** a 15-minute yes/no on the claims + positioning below. This is the one item in the attach programme that needs fresh sign-off.

---

## 1. The CTA copy (verbatim)

**Headline (all kits):** YOUR LEVELS ARE GOOD. HERE IS HOW TO KEEP THEM THERE.

**Body line 1 (all kits):** Your results came back in range. That is good news, and nothing here needs fixing.

**Body line 2 — claims block, per kit:**

- **Kit 1 (T only):** The Daily Stack is the maintenance dose of the nutrient tied to that marker. Zinc contributes to the maintenance of normal testosterone levels.¹ The point is holding a good result, not pushing it higher.
- **Kit 2 (Vit D + B12):** The Daily Stack is the maintenance dose of the nutrients tied to those markers. Vitamin D contributes to normal muscle function.² Active B12 contributes to normal energy-yielding metabolism and normal psychological function.³
- **Kit 3 (T + Vit D + B12):** The Daily Stack is the maintenance dose of the nutrients tied to those markers. Zinc contributes to the maintenance of normal testosterone levels.¹ Vitamin D contributes to normal muscle function.² Active B12 contributes to normal energy-yielding metabolism and normal psychological function.³

**Body line 3 (all kits):** Supplements are not on sale yet. Join the waitlist and you will be first to know when the Daily Stack ships, with a founding-customer discount.

**Button (all kits):** Join the supplement waitlist → `/supplement-waitlist` (waitlist opt-in, not a purchase).

**Optional seq-03c Email 3 line (PROPOSAL ONLY, seq-03c not edited):** Think of it as maintenance, not correction: your numbers are good, and the honest goal is keeping them there, not pushing them higher.

---

## 2. Claims mapping table

| # | In-range marker | Kits | Daily Stack nutrient | Verbatim EFSA claim |
|---|---|---|---|---|
| 1 | Testosterone (in range, not low/borderline) | 1, 3 | Zinc | "Contributes to the maintenance of normal testosterone levels" |
| 2 | Vitamin D | 2, 3 | Vitamin D3 | "Contributes to normal muscle function" |
| 3 | Active B12 | 2, 3 | Active B12 (Methylcobalamin) | "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function" |

hs-CRP and Ferritin carry no Daily Stack claim (Vitamin C sits in Collagen, not the Stack; iron is not sold). The silent ingredient and Magnesium (removed V7.2) never appear. Claims verbatim or nothing.

---

## 3. The thesis tension (verbatim from `supplement-conversion.md`, so the counter-argument is on the page)

> But it's a genuine thesis tension — do not resolve it unilaterally. The brand sells *against* guess-pills ("don't guess, test"). Selling a maintenance stack to someone whose data says they're fine skirts that line. The honest version is defensible ("your data's good; this is the dose that keeps it there, and the retest proves it stays") and fear-free; a "you might still be deficient" version is not. **This needs explicit Ewa + compliance sign-off before it ships** — it's a claims *and* positioning decision, not a copy tweak. Flagged for Keith.

*(This block is a verbatim internal quotation; its em dashes are the source doc's and are retained because the quote must be exact. Every customer-facing string in this pack contains zero em dashes.)*

---

## 4. On "yes"

Flip `MAINTENANCE_OFFER_ENABLED` to ON in the environment config and deploy. That is the whole change: one env flag, no new code (the CTA branch, copy, and `supplement_offer_shown` / `supplement_offer_clicked` events are already built dark). The card then renders only on the all-clear path, strictly after every GP-block/GP-referral check, and never for low-T, borderline-T, or any deficiency state.

## 5. On "no"

Nothing ships. The flag stays OFF (its default), the classifier never returns the maintenance CTA, no card renders, no events fire. Output is identical to today's behaviour. Zero customer impact, zero rollback needed.

---

*Footnotes 1/2/3 map to the section 2 rows. Draft only — do not mark approved.*
