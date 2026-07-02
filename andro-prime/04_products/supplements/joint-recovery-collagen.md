# Joint & Recovery Collagen — Formula Specification

**Status:** Active — manufacturer brief ready
**Last updated:** April 2026
**Cross-reference:** `peptide-opportunity-analysis.md` (Section 2.2), `icp-kit-supplement-alignment-april2026.md` (Section 4.3), `../03_compliance/CONTEXT.md`

---

> ⚠️ **PROPOSED dose changes (2026-07-02) — NOT APPROVED. Pending Ewa + manufacturer sign-off.** Source: `formulation-evidence-review-2026-07-02.md` (RCT evidence review). Current formulation below remains canonical until sign-off.
> 1. **Resolve the UC-II vs hydrolysed-collagen lane (decision needed).** The two combined have **only one human RCT and it was null vs placebo** (*Sci Rep* 2025, n=68). Every *positive* UC-II trial used **UC-II 40 mg alone** (incl. Lugo 2013 in active adults with exercise-induced knee discomfort — our exact population). Pick one: **(A)** UC-II 40 mg standalone (best-matched evidence, cheap) and drop hydrolysed; or **(B)** hydrolysed collagen 10 g (well-evidenced, Clark 2008 / Kviatkovsky 2023) and drop UC-II. Don't ship both at current doses.
> 2. **MSM 500 mg → 3 g** — 500 mg is sub-therapeutic; every positive OA/recovery RCT used 1.5–6 g/day (typical 3 g). Trivial to fix in a powder.
> 3. **Hyaluronic acid 5 mg → ~100–200 mg** (or drop) — oral-HA trials run 40–240 mg (modal 200 mg, Tashiro 2012); 5 mg has no RCT support.
> 4. **Keep Vitamin C 80 mg** (adequate cofactor) and **UC-II 40 mg** if the UC-II lane is chosen (exact evidenced dose).
> 5. **Add a usage instruction: "take ~1 h before training"** — collagen + vitamin C pre-exercise drives tendon/ligament collagen synthesis (Shaw 2017; Lis & Baar 2019). Evidence-based, free, differentiating.
> Caveat: collagen/MSM/HA/UC-II evidence is largely small, short, and manufacturer-funded — keep external claims to the Vitamin C EFSA wording only (unchanged).

## Formulation

| Ingredient | Source / Form | Dose per serving | EFSA-approved claim | Use in copy |
| --- | --- | --- | --- | --- |
| Hydrolysed Collagen Peptides | Bovine (Type I & III) | 10g | None direct — supports Vitamin C claim context | No standalone claim |
| UC-II Undenatured Collagen | Chicken sternum (Type II) | 40mg | None — joint health support, not claimable | No |
| Vitamin C | Ascorbic acid | 80mg | "Contributes to normal collagen formation for the normal function of cartilage" | Yes — primary copy claim |
| MSM (Methylsulfonylmethane) | — | 500mg | None approved | No |
| Hyaluronic Acid | — | 5mg | None approved | No |

---

## Format

- **Delivery format:** Unflavoured powder (sachet or tub — TBC with manufacturer)
- **Pack size:** 30 servings (30-day supply)
- **Serving:** 1 scoop or sachet (approx 11g) mixed into water or a cold drink daily
- **Note:** Powder is the correct format for this product. Achieving a 10g collagen dose via capsules requires 10–15 capsules per day — not viable for daily use.

---

## Positioning

For active men aged 35–60 who train regularly. Not a beauty collagen — this is joint and connective tissue support for men dealing with soreness that takes longer to clear than it used to.

Complements the Daily Stack for men with elevated hs-CRP who report joint symptoms. Naturally pairs with TRT (men on testosterone training hard need connective tissue support).

---

## Pricing

| Type | Price |
| --- | --- |
| Subscription (monthly) | £29.95/month |
| One-off | £34.95 |
| Complete Men's Stack (Daily Stack + Collagen) | £54.95/month |

> **One-off deferred (2026-05-18):** Phase 0 launches **subscription-only**. The one-off option is not built at any layer (no Stripe one-off price ID, no `mode:'payment'` route) and is intentionally not shipped — supplement subscription tenure is the dominant Phase 0 economic lever. The £34.95 row is retained as a future option only; revisit post-launch if demand is proven.

---

## Compliance Rules

- The Vitamin C claim is the only EFSA-approved claim in this formulation. It is the only health claim that can appear in copy.
- **Do not say:** "Collagen heals your joints" — medicinal claim.
- **Do not say:** "Reduces inflammation" — medicinal claim.
- **Do not say:** UC-II or MSM "supports joint health" — no EFSA approval.
- Copy must lead with the Vitamin C claim: *"Vitamin C contributes to normal collagen formation for the normal function of cartilage."*
- UC-II, MSM, and HA appear on the label because they are in the formulation. They cannot be sold on in copy.

---

## Result-to-Copy Trigger

This product is triggered from Kit 2 or Kit 3 results where hs-CRP is elevated **and** the customer confirms joint symptoms via the dashboard qualifier question.

| hs-CRP level | Joint symptoms reported? | Action |
| --- | --- | --- |
| 1–3 mg/L (mildly elevated) | Yes | Collagen recommendation (full copy) |
| 1–3 mg/L (mildly elevated) | No | Lifestyle guidance only — no supplement CTA |
| > 3 mg/L (elevated) | Yes | Collagen recommendation + mention reviewing GP if persistent |
| > 3 mg/L (elevated) | No | Lifestyle guidance + GP note if stays elevated |
| > 10 mg/L | Either | GP referral only — no supplement CTA |

**Dashboard copy (when triggered correctly):**
> *"Your inflammation marker is elevated. In active men, this often reflects joint and connective tissue stress — the soreness that takes longer to go away than it used to. Joint & Recovery Collagen provides 10g of hydrolysed collagen peptides plus Vitamin C, which contributes to normal collagen formation for the normal function of cartilage."*
