# Conversion Rules

**Status:** v1 (Phase 0a — supplements deferred). v2 reinstates supplement-subscription conversion targets when supplements ship in Phase 0b.
**Low-T target updated 2026-06-04:** low testosterone (T < 12) now converts on **GP-referral acknowledgement**, not `founding_member_listed` — see `2026-06-04-low-t-routing-decision.md` (Ewa signed off GP referral for all T < 12). A consent-gated nurture opt-in will be added alongside once the solicitor signs the lawful basis (ClickUp `869d99kzh`); it is not yet built.
**Owner workspace:** `04_products/results-engine`
**Related:** `results-to-product-mapping.md`, `kit3-combined-result-rule.md`, `04_products/CONTEXT.md` (Results-Engine Trigger Rules), `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`.

---

## Purpose

Defines the conversion events the results engine tries to drive per result state, and the CIO events that count as success. In Phase 0a, every conversion target that previously aimed at a supplement subscription (`subscription_started`) aims instead at a supplement-waitlist opt-in (`supplement_waitlist_joined`). All other conversion targets (founding-member opt-in, kit cross-sell, retest scheduling, GP-referral acknowledgement) are unchanged.

---

## Conversion targets by result-state group

| Result-state group | v1 primary conversion event | v1 secondary conversion event | v2 (Phase 0b) primary reverts to |
|---|---|---|---|
| Low testosterone (T < 12 nmol/L, Kit 1 or Kit 3) | GP-referral acknowledgement (existing event) | None | Updated 2026-06-04 (was `founding_member_listed`). Consent-gated nurture opt-in to be added pending lawful basis; no supplement upsell on this card. |
| Normal / borderline testosterone with energy deficiencies | `supplement_waitlist_joined` (`interested_in_product = 'daily-stack'`) | Kit cross-sell purchase (existing event) | `subscription_started` (Daily Stack) |
| Low Vitamin D | `supplement_waitlist_joined` (`source_marker = 'low-vitamin-d'`, `interested_in_product = 'daily-stack'`) | Kit cross-sell purchase (where applicable) | `subscription_started` (Daily Stack) |
| Low Active B12 | `supplement_waitlist_joined` (`source_marker = 'low-b12'`, `interested_in_product = 'daily-stack'`) | Kit cross-sell purchase (where applicable) | `subscription_started` (Daily Stack) |
| Elevated / moderate hs-CRP + joints=yes | `supplement_waitlist_joined` (`source_marker = 'moderate-crp'` or `'elevated-crp'`, `interested_in_product = 'collagen'`) | None | `subscription_started` (Joint & Recovery Collagen) |
| Multi-deficiency (2+ energy markers) | `supplement_waitlist_joined` (`source_marker = 'multi-deficiency'`, `interested_in_product = 'complete-mens-stack'`) | Kit cross-sell purchase (where applicable) | `subscription_started` (Complete Men's Stack) |
| GP-block markers (hs-CRP > 10, Ferritin < 30, Albumin < 35, critically-low Vitamin D < 25, high Ferritin > 300) | GP-referral acknowledgement (existing event) | None | Unchanged. (No cross-sell on GP block. Vit-D <25 + high-ferritin added 2026-06-16.) |
| CRP elevated + joints=no, suboptimal ferritin | None (lifestyle guidance only) | None | Unchanged. |
| All markers in range | Retest scheduled (existing event) | None | Unchanged. |
| Quiz complete, no purchase | Kit purchase (existing event) | None | Unchanged. |

---

## Event definitions referenced

These are the existing or planned CIO events / triggers used as conversion targets. Definitions live in `07_sales/sequences/` and the CIO workspace, not duplicated here:

- `founding_member_listed` — fires when a customer joins the founding-member list (non-cash opt-in). **No longer a low-T conversion target as of 2026-06-04** (low-T routes to GP referral; the FM surfaces are taken down). The event/seq-03b stop-goal remains defined but dormant pending a decision on the FM list's lawful basis.
- `supplement_waitlist_joined` — new in Phase 0a. Fires when a customer joins the supplement waitlist. Payload: `email`, `source_marker`, `source_kit`. Identify traits set on the same call: `supplement_waitlist: true`, `supplement_waitlist_source_marker`, `supplement_waitlist_source_kit`, `supplement_waitlist_joined_at`. See plan doc §3.8.
- `subscription_started` — fires on Stripe subscription creation. Inert in Phase 0a (no live supplement Price IDs). Reactivates in Phase 0b.
- Kit purchase / cross-sell purchase / retest scheduled / GP-referral acknowledged — existing events, unchanged.

---

## What does not change in v1

- The result → educate → recommend → convert sequence is unchanged. Only the **convert** target shifts from subscription to waitlist on supplement-routing paths.
- Seq-03 sequence stop-goals are unchanged. seq-03b still stops on `founding_member_listed`. seq-03a still stops on its existing goals. Sequence-content rewrites (which CTAs the emails carry) are happening on branch `chore/phase0a-email-sequences`; this doc is about the conversion-event targets the engine measures against, not the email copy.
- GP-block routing and lifestyle-guidance routing are unchanged: no conversion target on those paths.

---

## v2 reinstatement (Phase 0b)

When supplements ship, every `supplement_waitlist_joined` row above is restored to `subscription_started`. The waitlist event survives as a fallback secondary conversion for customers who land on a supplement landing page but do not subscribe immediately. See the plan doc §5 Phase 0b sequencing for the full back-out path.
