# Results to Product Mapping

**Status:** v1 (Phase 0a — supplements deferred). v2 reinstates direct supplement product CTAs when supplements ship in Phase 0b.
**Low-T routing updated 2026-06-04:** `low-testosterone` (T < 12) now routes to **GP referral**, not the founding-member list — see `2026-06-04-low-t-routing-decision.md`. **Ewa signed off** GP referral for all T < 12 (2026-06-04). The consent-gated nurture capture that sits alongside GP referral is **pending the solicitor's lawful-basis sign-off** (Art 6(1)(a) + 9(2)(a), ClickUp `869d99kzh`) and is not yet built.
**Owner workspace:** `04_products/results-engine`
**Related:** `2026-06-04-low-t-routing-decision.md`, `kit3-combined-result-rule.md`, `biomarker-copy.md`, `conversion-rules.md`, `04_products/CONTEXT.md` (Results-Engine Trigger Rules), `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`.

---

## Purpose

Source of truth for which result state routes to which CTA in the results engine. In Phase 0a, every CTA that previously pointed at a buyable supplement subscription points instead at the **supplement waitlist** (a non-cash opt-in that mirrors the founding-member list). The waitlist form receives a `source_marker` value (which biomarker triggered the opt-in) and an `interested_in_product` value (which product the customer would be queued for when it ships). Non-supplement mappings (FM list, GP referral, lifestyle guidance, retest reminder, kit cross-sell) are unchanged.

For the full mechanic and rationale, see `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md` §2.

---

## Result-state mapping (v1, Phase 0a)

| Result state | Kit | Primary CTA (v1) | Secondary CTA (v1) | Waitlist `source_marker` | Waitlist `interested_in_product` | v2 (Phase 0b) reverts to |
|---|---|---|---|---|---|---|
| `low-testosterone` (T < 12 nmol/L) | Kit 1, Kit 3 | **GP referral** (updated 2026-06-04) | None | n/a (no waitlist on this card) | n/a | Primary: GP referral. Consent-gated nurture capture sits alongside (pending lawful basis); no kit/supplement upsell on this card. |
| `normal-testosterone` — Kit 1, energy symptoms self-reported | Kit 1 | Supplement waitlist | Kit 2 cross-sell | `normal-testosterone-energy-symptoms` | `daily-stack` | Primary: Daily Stack. Secondary: Kit 2 cross-sell. |
| `normal-testosterone` — Kit 1, no symptoms | Kit 1 | Supplement waitlist | — | `normal-testosterone` | `daily-stack` | Primary: Daily Stack. |
| `normal-testosterone` — Kit 2/3 | Kit 2, Kit 3 | Supplement waitlist | — | `normal-testosterone` | `daily-stack` | Primary: Daily Stack. |
| `borderline-testosterone` (T 12–15 nmol/L) + ≥1 energy deficiency | Kit 1, Kit 3 | Supplement waitlist | — | `borderline-testosterone` | `daily-stack` | Primary: Daily Stack. |
| `optimal-testosterone` (T > 20 nmol/L) | Kit 1, Kit 3 | Retest reminder | — | n/a | n/a | Unchanged. |
| `critically-low-vitamin-d` (< 25 nmol/L) | Kit 2, Kit 3 | Supplement waitlist | Kit 1 cross-sell (if Kit 2 + 40+) | `low-vitamin-d` | `daily-stack` | Primary: Daily Stack. Secondary unchanged. |
| `low-vitamin-d` (25–50 nmol/L) | Kit 2, Kit 3 | Supplement waitlist | Kit 1 cross-sell (if Kit 2 + 40+) | `low-vitamin-d` | `daily-stack` | Primary: Daily Stack. Secondary unchanged. |
| `low-b12` (< 37.5 pmol/L) | Kit 2, Kit 3 | Supplement waitlist | Kit 1 cross-sell (if Kit 2 + 40+) | `low-b12` | `daily-stack` | Primary: Daily Stack. Secondary unchanged. |
| `moderate-crp` (3–10 mg/L) + joints=yes | Kit 2, Kit 3 | Supplement waitlist | — | `moderate-crp` | `collagen` | Primary: Joint & Recovery Collagen. |
| `elevated-crp` (1–3 mg/L) + joints=yes | Kit 2, Kit 3 | Supplement waitlist | — | `elevated-crp` | `collagen` | Primary: Joint & Recovery Collagen. |
| `moderate-crp` / `elevated-crp` + joints=no | Kit 2, Kit 3 | Lifestyle guidance | — | n/a | n/a | Unchanged. |
| `high-crp` (> 10 mg/L) | Kit 2, Kit 3 | GP referral | — | n/a | n/a | Unchanged. (GP block, no cross-sell.) |
| Multi-deficiency (2+ energy markers out of range) | Kit 2, Kit 3 | Supplement waitlist | Kit 1 cross-sell (if Kit 2) | `multi-deficiency` | `complete-mens-stack` | Primary: Complete Men's Stack. Secondary unchanged. |
| `low-ferritin` (< 30 μg/L) | Kit 2, Kit 3 | GP referral | — | n/a | n/a | Unchanged. (GP block, no cross-sell.) |
| `suboptimal-ferritin` (30–100 μg/L) | Kit 2, Kit 3 | Lifestyle guidance (dietary iron) | — | n/a | n/a | Unchanged. |
| `low-albumin` (< 35 g/L) | Kit 1, Kit 3 | GP referral | — | n/a | n/a | Unchanged. (GP block, no cross-sell.) |
| `shbg-low` / `shbg-high` (isolated) | Kit 1, Kit 3 | None (educational only) | — | n/a | n/a | Unchanged. |
| `ft-low` with normal Total T | Kit 1, Kit 3 | None (GP note in copy) | — | n/a | n/a | Unchanged. |
| `ft-low` with `low-testosterone` | Kit 1, Kit 3 | **GP referral** (from Total T card; updated 2026-06-04) | None | n/a | n/a | Unchanged. |
| All markers in range | any | Retest reminder | — | n/a | n/a | Unchanged. |
| Quiz complete, no purchase | n/a | Recommended kit CTA | — | n/a | n/a | Unchanged. |

---

## Waitlist attribute summary

The supplement waitlist captures three attributes per opt-in (per plan §2.1):

- `source_marker` — which biomarker state triggered the opt-in. Used for launch-broadcast segmentation when each supplement ships.
- `source_kit` — which kit the result came from (`hormone-check`, `energy-metabolism`, `hormone-recovery`). Set by the result page automatically.
- `interested_in_product` — the supplement the customer is queued for. Set explicitly by the waitlist form based on the source result card.

CTAs that fire from non-result-engine surfaces (the `/lp/daily-stack` page, the `/lp/collagen` page, the `/supplements/*` pages) leave `source_marker` empty and set `interested_in_product` based on the page. That mapping lives in the plan doc §2.1 and is not duplicated here because no result-engine path drives it.

---

## What does not change in v1

All non-supplement CTAs are unchanged from the v2 mapping:

- GP referral (T < 12 nmol/L Kit 1/Kit 3; hs-CRP > 10; Ferritin < 30; Albumin < 35) — clinical signal, never cross-sold, never replaced by a waitlist opt-in. **Low-T joined this list 2026-06-04** (was the founding-member list). The founding-member list is taken down; a consent-gated nurture capture replaces it for low-T, pending the solicitor's lawful-basis sign-off.
- Lifestyle guidance (suboptimal ferritin, CRP without joint symptoms) — educational only, no CTA.
- Retest reminder (optimal results, all-in-range) — unchanged.
- Kit cross-sells (Kit 1 → Kit 2 or Kit 3, Kit 2 → Kit 1 or Kit 3) — unchanged.
- Quiz-driven kit recommendation — unchanged.

---

## v2 reinstatement (Phase 0b — when supplements ship)

When live Stripe products and Price IDs are configured for Daily Stack, Joint & Recovery Collagen, and Complete Men's Stack, every row above where the v1 primary is "Supplement waitlist" reverts to the v2 primary listed in the rightmost column. The waitlist form survives on supplement landing pages as a secondary opt-in for customers who do not want to subscribe immediately. Result-card CTAs go back to direct checkout. See the plan doc §5 (Phase 0b sequencing) for the full back-out path.
