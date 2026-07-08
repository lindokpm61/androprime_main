# Decision: Post-result cross-sell is the complement, not the superset

**Date:** 2026-07-08 | **Owner:** Keith | **Type:** Cross-sell architecture / results-engine routing
**Supersedes:** "Kit 3 IS the Kit 1 post-result upsell (2026-05-26)" and the "normal / ambiguous testosterone → Kit 3 upsell" rule wherever it appears.

## The rule

A **post-result** kit cross-sell is always the **complement** — the markers the customer's kit did **not** measure — never the **superset** Kit 3, which would re-sell markers they already have.

- **Kit 1 (testosterone only) → Kit 2** (adds Vitamin D / Active B12 / hs-CRP / Ferritin). Unconditional on a normal-T Kit 1 result.
- **Kit 2 (energy/recovery only) → Kit 1** (adds testosterone). Gated as before: multi-deficiency, or a Vit-D/B12 deficiency at age ≥40.
- **Kit 3 (both panels) → no kit cross-sell.** It already has everything.
- **Kit 3 is a front-of-funnel default, not a post-result cross-sell.** It is the test-selector's "broaden up when the picture is ambiguous" recommendation for people who have not tested yet (`TestSelectorQuiz` `RESULTS.kit3`). It is never offered as a post-result upsell.

## Why

A man who just tested his testosterone and got a normal result should not be sold a kit that re-tests it. Kit 2 adds only what he is missing, is cheaper (£119 vs £179), and carries no redundancy. The alignment authority already noted this: the Kit 1 + Kit 2 journey (£218) earns more than a single Kit 3 (£179) and builds a richer data picture from the same customer (`icp-kit-supplement-alignment-april2026.md` §3 revenue note), and it already named Kit 1 → Kit 2 the *primary* cross-sell. This decision drops the contradictory "Kit 3 is the Kit 1 upsell" line and makes the complement rule the single statement.

The previous design gated the Kit 1 → Kit 2 cross-sell on an `energy_symptoms` signal. That gate is **removed**: the signal was never captured in production (the quiz routes any energy-primary user to Kit 2, so a Kit 1 buyer never carried the flag — see the 2026-07-08 cross-sell audit), and Kit 2 is the honest default regardless of symptoms.

## Borderline testosterone (12–<15)

The `normal-testosterone` state includes the borderline band, so a borderline-T Kit 1 buyer now also gets the Kit 2 cross-sell (was Kit 3 under the old rule). Borderline T-monitoring is already handled by the retest reminder + the seq-03d borderline nurture, so the cross-sell correctly adds the complementary energy panel rather than re-selling testosterone. Override candidate if a borderline result should instead route to Kit 3 / a retest.

## Code

`classifier.ts` `resolveCtas`, `normal-testosterone` / `kitType === 'testosterone'` branch → `secondaryCta: CTAS.kit2CrossSell` (unconditional). The `kit-3-cross-sell` CtaType (briefly added 2026-07-08) is **removed** — no post-result use exists. Card copy is the pre-existing, compliant Kit 2 helper text. Classifier suite: 22 assertions; tsc + build clean.

Sequence of commits: `4f8a199` (audit + repair: fixed the Kit 2→Kit 1 404, built then) → this decision (Kit 2 default, Kit 3 cross-sell removed).

## Swept

Core: `08_customer-journey/flows/flow-4-results-to-action.md`, `04_products/CONTEXT.md`, `04_products/icp-kit-supplement-alignment-april2026.md`, `07_sales/funnel/kit-purchase.md`, `09_website-app/STATE.md`.

Product/results-engine layer: `04_products/kits/kit-1-testosterone-health-check.md`, `kits/kit-2-energy-recovery-check.md`, `kits/kit-3-hormone-recovery-check.md`, `results-engine/thresholds.md`, `results-engine/results-to-product-mapping.md`, `results-engine/biomarker-copy.md` (customer-facing cross-sell CTA table), `06_marketing/seo-ai-search/article-briefs/pillar-D-hub-crp-blood-test.md`. Dated forward-pointer added to `results-engine/2026-06-04-low-t-routing-decision.md` (history not rewritten).

**Left with a flag (not swept):** `04_products/kits/kit-3-plus.md` — a DRAFT, not-approved, deferred (T+1-2 weeks post-launch) future-product spec whose "Kit 1 → Kit 3 → Kit 3 Plus" tier-ladder framing predates this rule. It is a product-ladder concept, not live post-result routing; reconcile when Kit 3 Plus is actually specced for build.

**Out of scope (correctly untouched):** the affiliate "£10 Kit 3 upsell **bonus**" (a PT/influencer commission term, ~40 mentions across commission/financial/affiliate docs) and landing-page "demote the Kit 3 upsell link from hero" CRO notes — neither is post-result routing.
