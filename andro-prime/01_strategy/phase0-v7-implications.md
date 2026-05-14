# Phase 0 — V7 Implications

**Date:** 2026-05-12
**Owner:** Keith Antony
**Status:** Operational mapping from V7.0 strategic model
**Pairs with:** `andro-prime-strategic-model-v7.md`, `phase0-financial-model-v1.xlsx`, `2026-05-12-longitudinal-tracker-decision.md`

---

## Purpose

V7.0 established the strategic planning model: multi-vertical platform, single entity, longitudinal tracker as moat, £30-45M family outcome at Optimised Base. But Phase 0 is shipping in weeks. This document translates V7 changes into specific impacts on Phase 0 operations, architecture, marketing, compliance, and team workflows.

This is the operational bridge document. V7 says what the business is becoming. This document says what changes on the ground because of it.

If a Phase 0 decision has already been locked elsewhere (in `master-implementation-blueprint.md`, the v3 Phase 0 financial model, the longitudinal tracker decision, etc.), this document doesn't restate it. It only notes what V7 *changes or adds* to existing Phase 0 plans.

---

## 1. Summary of V7 changes affecting Phase 0

| V7 change | Phase 0 dimension affected | Severity | Section |
|-----------|---------------------------|----------|---------|
| Tracker promoted to core differentiator | Marketing, architecture | **High** | §2 |
| Wellness reframed as standalone cohort | Marketing, content strategy | **High** | §3 |
| Multi-vertical thesis committed | Brand voice, content optionality | Medium | §4 |
| Working capital gap acknowledged | Cash discipline, founder funding | **High** | §5 |
| Ewa retainer as load-bearing OpEx | Content workflow, compliance | Medium | §6 |
| Gate-driven discipline expanded | Operational rhythm, dashboard | Medium | §7 |
| GLP-1 launch delayed to M21 | Y2 narrative, partner conversations | Low | §8 |
| Position C thin headroom acknowledged | Execution discipline, decision speed | **High** | §9 |

---

## 2. Tracker as core differentiator (Marketing + Architecture)

### What V7 changed

V6.1 had no tracker. The 2026-05-12 tracker decision document established the longitudinal tracker as a retention mechanism. V7 §3 elevates it from "retention feature" to **core brand differentiator and moat foundation**.

### What this changes for Phase 0

**Marketing impact (immediate):**

- Phase 0 brand copy needs to lead with the data-ownership positioning, not just kit features. Current Phase 0 messaging (per `master-implementation-blueprint.md`) emphasises "premium UK at-home testing." V7-aligned messaging should emphasise *"your health record, tracked properly — and yours to keep"* (per tracker decision doc §3.3). The brand pillar to consider adding (per tracker decision §8): **"patient-owned data."**
- LinkedIn and short-form content scripts need updating to reflect this. The `linkedin-post-generator` and `short-form-content-generator` skills currently lean on TRT-pipeline framing. They need a content pillar specifically about longitudinal health tracking, the failure of conventional clinical record-keeping, and the philosophical case for data ownership.
- The Reddit demand signal referenced in tracker decision §2.3 ("results came back fast but lack of real help understanding them") should become an explicit content angle. Phase 0 content can *name* this customer pain and position Andro Prime against it.

**Architectural impact (M3-M4):**

- Tracker v1 build needs to be designed as a *brand-visible* asset, not an internal feature. The customer's first encounter with the tracker is now load-bearing marketing, not just utility. Design quality matters more than it did under V6.1.
- The "My Story" timeline view (per tracker decision §3.3 — "Story tab") becomes a marketing asset in its own right. Screenshots from this view will appear in landing pages, LinkedIn posts, sales conversations. Design it for screenshot quality from day one.
- The data schema decisions in tracker decision §3.4 stand, but the *consent capture flow* at signup needs to anticipate the multi-vertical future (V7 §5). Don't bake in TRT-only consent. The signup flow should establish broad consent for health data processing under wellness lawful basis with explicit downstream opt-in for any future clinical service. This is not new technical work — it's a copywriting and flow-design decision that needs locking in now.

**What does NOT change:** the v3 timing (v1 ships M3-M4, v2 gated at M12). Tracker decision §4.1 and §4.2 build sequence stands. V7 doesn't accelerate the tracker; it just makes it more important.

---

## 3. Wellness reframed as standalone cohort (Marketing + Content)

### What V7 changed

V6.1 §4 framed Phase 0 wellness as a pipeline-builder for TRT. V7 §6.3 establishes **wellness as a permanent standalone cohort** with its own ARPU (~£17.50/mo contribution per customer at maturity), churn (~45% annual), and lifetime value. By Y7 planning case: 6,000-8,000 active wellness customers who never convert clinical.

### What this changes for Phase 0

**Marketing impact (immediate):**

- Phase 0 customer messaging cannot be "buy a kit, eventually upgrade to TRT." That message implies kit purchase is a stepping stone. V7 says wellness is a destination for the majority of customers.
- The acquisition pitch shifts from *funnel framing* ("first step on a journey") to *standalone value framing* ("here's what you get whether or not you ever want clinical care"). This is a meaningful brand voice change.
- Founding member opt-in (now non-cash per May 2026 decision) should be positioned as "early access to clinical services *when and if* you want them" — not "you're committing to TRT."

**Content strategy impact (M1+):**

- The content pipeline (LinkedIn + short-form + carousels) currently weights toward TRT-relevant topics. Under V7, the wellness customer is a permanent audience segment. Content needs explicit pillars for:
  - General men's health optimisation (sleep, training, nutrition) — non-TRT-specific
  - Longitudinal tracking and self-quantification themes
  - The "I tested but my results were normal — now what?" cohort (the majority of Kit 1 / Kit 2 buyers)
- The `weekly-content-orchestrator` skill should produce content where ~40% targets pure-wellness audience, ~40% targets clinical-curious audience, ~20% targets TRT-specific. Not 80/20 TRT-weighted.

**Operational impact (M3+):**

- Customer success / lifecycle workflows (in Customer.io) need a wellness-tier journey that *doesn't* end with "you should consider TRT." Customers who test normal and stay on supplements should have an engagement loop that keeps them on the platform without nudging them toward clinical they don't need.
- Email sequences post-result need a "normal result + tracker engagement" path, not just a "low-T → FM opt-in → TRT waitlist" path.

**What does NOT change:** the Phase 0 product set (kits, supplements, FM list, tracker). All of these serve both wellness-as-destination and wellness-as-funnel. The change is framing and lifecycle, not product.

---

## 4. Multi-vertical thesis (Brand + Content optionality)

### What V7 changed

V6.1 was TRT-led with add-ons. V7 §5 commits to **TRT + hair loss + GLP-1** as three independent clinical verticals, all launching post-CQC.

### What this changes for Phase 0

**Brand impact (immediate):**

- Phase 0 brand positioning needs to leave room for hair loss and GLP-1 customers in Y2. "Andro Prime — TRT done properly" is a foreclosed brand. "Andro Prime — men's health, tracked" is open-ended.
- Brand pillars (per V7 §3.3 and brand work referenced in memory) should add **"comprehensive men's health"** as an explicit pillar, alongside the existing premium positioning, patient-owned data, and clinical credibility pillars.

**Content impact (M1+):**

- Don't go heavy on TRT-specific content in Phase 0. A LinkedIn audience built on "TRT, TRT, TRT" doesn't transition cleanly to hair loss launches in M18 or GLP-1 in M21. Build the audience around men's health broadly.
- Reserve at least one content pillar for weight management / metabolic health (Phase 0 angle: "your bloods show your metabolic story"). This positions the audience for GLP-1 narrative later without committing to it now.
- Similarly, treat hair loss as a future content theme — Kit 1 / Kit 2 don't measure hair loss markers directly, but content about "men in their 30s-50s and the conditions you don't have to accept" sets up the hair loss audience.

**Operational impact (low):**

- No immediate ops changes. The Phase 0 build doesn't need hair or GLP-1 capability. The change is content and brand voice discipline.
- However: customer data captured in Phase 0 should not be siloed in a way that makes hair / GLP-1 marketing harder later. Signup forms and CRM tags should allow for future segmentation (e.g. "interested in hair loss treatments when available") rather than just "TRT waitlist Y/N."

**What does NOT change:** Phase 0 doesn't launch any clinical service. Kits + supplements + tracker. No regulatory complications, no MHRA/ASA exposure on prescription products.

---

## 5. Working capital gap (Cash discipline + Founder funding)

### What V7 changed

V7 §7.2a surfaces a Y2 working capital requirement of £30-60k that V6.1 didn't acknowledge. V7's recommended Option 5 includes a **founder bridge loan of £35k at M11**.

### What this changes for Phase 0

**Operational impact (M6 onwards):**

- Phase 0 cash discipline tightens. The v3 Phase 0 financial model planning case lands at +£39k cumulative cash at M12. This *covers* the £30k Gate 0C threshold but does NOT cover Y2 working capital alone. The founder bridge is required regardless.
- Monthly cash position becomes a tracked KPI from M1, not just at gates. The Phase 0 dashboard (per `master-implementation-blueprint.md`) needs a "cash position vs plan" tile alongside the kit-sales and supplement-MRR tiles.
- Founder bridge readiness is a Phase 0 deliverable. Keith needs to confirm £35-40k availability by M9-M10 (one month before injection). If founder bridge isn't available, alternative funding routes (V7 §7.2a Options 2-4) need to be in motion *before* M11, not at the point of need.

**Strategic impact (immediate):**

- Phase 0 spend discipline is now load-bearing in a way V6.1 didn't capture. Every £1k of unplanned Phase 0 OpEx pushes the working capital gap up. Examples: Vitall partnership snags, supplement MOQ overruns, additional tracker scope, ad hoc consulting spend — all of these now have downstream Y2 funding implications.
- If Phase 0 over-delivers (Gate 0C passes with material headroom — e.g. £60k+ cumulative cash at M12), the working capital gap shrinks correspondingly and the bridge loan size can be reduced. Track this monthly.

**Pricing and discount discipline:**

- The PT-coded 10% customer discount is already factored into v3 model. Don't add further promotional discounting without modelling the working capital impact. A "20% off Black Friday" campaign that V6.1 might have absorbed easily now eats meaningfully into Y2 funding.

**What does NOT change:** Phase 0 product set or pricing. Phase 0 model itself stands. The change is *cash discipline awareness*, not the financial inputs.

---

## 6. Ewa retainer as load-bearing OpEx (Workflow + Compliance)

### What V7 changed

V7 §3.4 and §7 add Ewa's clinical sign-off as a Y1 OpEx line (£1,000/mo Y1, scaling Y2-Y3). The tracker decision §5.1 establishes Ewa as the sign-off authority for all dashboard copy, trend indicator language, and retest prompts.

### What this changes for Phase 0

**Workflow impact (immediate):**

- Content production cannot proceed without Ewa in the workflow. This applies to:
  - Tracker dashboard copy (every text element customers see)
  - Trend indicator language and retest prompt copy
  - Email lifecycle sequences (any copy that references health markers, results, or clinical guidance)
  - LinkedIn posts and short-form scripts where they touch on hormonal health, supplements with health claims, or anything beyond pure brand/lifestyle content
- The Customer.io / Postiz pipeline (per content pipeline architecture) needs an Ewa-review step before content publishes. This is a workflow change, not just a compliance gate.
- Estimated Ewa time commitment: 4-8 hours/month at Phase 0 scale, growing in Y2 as clinical services launch and as v2 intelligence layer (if built) requires deeper clinical input.

**Compliance impact (immediate):**

- Ewa's involvement is the mechanism that keeps Phase 0 tracker and content within observation-only compliance (per tracker decision §5.2). Without her sign-off, the tracker risks drifting into interpretation language ("you are deficient," "this supplement is working") which is the specific ASA/MHRA risk the decision doc was designed to avoid.
- The compliance constraint list in `/03_compliance/CONTEXT.md` should be cross-referenced explicitly in the content production workflow. Don't rely on tribal knowledge.

**Cost confirmation needed:**

- V7 §9.2 flags Ewa retainer (£1,000-2,000/month) as M-L confidence. This needs to be confirmed before Phase 0 launches, not after. If the real arrangement is different from the placeholder, Y1 OpEx changes and the v3 Phase 0 model needs updating.

**What does NOT change:** the substance of clinical advisory work. Ewa was already part of the picture (per memory). V7 just makes her role explicit in OpEx and workflow.

---

## 7. Gate-driven discipline (Operational rhythm + Dashboard)

### What V7 changed

V7 §8 expands the gate structure from V6.1's clinical-launch gates to include tracker gates, vertical launch gates, and exit-track gates. The entity decision doc §4 adds entity-revision triggers. The gate count goes from 3 (V6.1 Gates 1-3) to 12 across V7.

### What this changes for Phase 0

**Operational impact (M1+):**

- Phase 0 has 4 gates (0A, 0B, 0C, Tracker-Engage) before TRT even launches. Each is binary go/no-go with documented consequences. This is more discipline than Phase 0 has been carrying.
- Each gate needs *operational instrumentation*:
  - Gate 0A (Week 6): kit-sales counter, FM-opt-in counter, decision meeting scheduled for Week 6.
  - Gate 0B (M4): full Phase 0 health check with cohort-level metrics, decision meeting M4.
  - Gate 0C (M12): cash position vs plan, decision meeting M12.
  - Gate Tracker-Engage (M12): dashboard log-in tracking from tracker v1 launch (M3-M4), evaluated at M12.
- The Phase 0 dashboard (per `master-implementation-blueprint.md`) needs to surface gate metrics, not just operating metrics. "Are we on track for Gate 0B?" should be readable at a glance.

**Decision discipline impact:**

- The V6.1 pattern was "review at gates, otherwise execute." V7 layers in more frequent measurement because gates compound — Gate 0A informs Gate 0B informs Gate 0C informs Tracker-Engage informs Year 2 trajectory.
- Weekly operating reviews (already implicit in Phase 0 build) should explicitly read the next-gate metrics. Weeks 1-6 read Gate 0A. Weeks 7-16 read Gate 0B. And so on.
- Gate failures need an explicit decision protocol. Per V7 §8.4 (now updated with decision branches), gates are decision points not measurements. The protocol for a Gate 0A failure shouldn't be improvised — it should be documented now while no gate is failing.

**Tracker engagement gate is the most operationally novel:**

- Gate Tracker-Engage at M12 requires ≥50% dashboard log-in rate. This requires:
  - Tracker analytics infrastructure (log-in tracking, cohort segmentation, engagement measurement)
  - A clear definition of "log-in" (does email-link-click count? Does mobile vs desktop count differently?)
  - Lifecycle nudges that encourage log-in without becoming spammy (gate-relevant: tracker decision §3.2 explicitly says "the customer logs in to see their data, not to receive marketing")
- This infrastructure isn't built yet. It needs scoping in Phase 0 Week 1-2 alongside the v1 tracker build.

**What does NOT change:** V6.1's gate structure (Gates 0A, 0B, 0C, 1, 2, 3) all stand. V7 adds gates rather than replacing.

---

## 8. GLP-1 delayed to M21 (Y2 narrative)

### What V7 changed

V6.1 had no GLP-1. V7 §5 committed to GLP-1 as the third vertical at M18-M24, then V7 §7.2a (working capital review) recommended Option 5 which **delays GLP-1 to M20-M24** to give TRT cashflow more time to build before working capital pressure peaks.

### What this changes for Phase 0

**Strategic narrative impact (low but real):**

- In any Phase 0 conversation that references Y2 expansion (with partners, suppliers, potential clinical advisors, content pieces about the roadmap), the sequence is now: TRT M13 → hair loss M18 → GLP-1 M21. Not "TRT, hair, GLP-1 all by M18."
- Phase 0 partner conversations (Vitall, supplement manufacturer, future pharmacy partners) should reference the realistic sequence if asked about Y2-Y3. Don't oversell the GLP-1 timeline.
- Content production: if/when GLP-1 becomes a content theme (per §4 multi-vertical optionality), don't promise specific timing. "Coming in Y2" is fine; "launching in March 2027" is a commitment the working capital math doesn't support.

**Operational impact (none in Phase 0):**

- GLP-1 doesn't ship until M21. Phase 0 (M1-M12) doesn't touch GLP-1 operationally.

**What does NOT change:** Phase 0 itself.

---

## 9. Position C thin headroom (Execution discipline + Decision speed)

### What V7 changed

V7 §11.6 explicitly reconciled the Position C target (£30-45M family outcome) against the Optimised Base planning case (£28-37M lifetime family combined). The conclusion: **planning case brushes the lower edge of Position C with no headroom.** Getting into the middle of Position C requires Upside execution.

### What this changes for Phase 0

This is the most uncomfortable implication. Phase 0 execution quality matters more than V6.1 framed it.

**Strategic impact (mindset):**

- V6.1 implicitly suggested Phase 0 was about validation, with the exit ambition automatic if Phase 0 worked. V7 says the exit ambition requires Phase 0 to validate *and* Y2-Y7 execution to clear the planning case across all five structural conditions (multi-vertical execution, tracker retention, platform multiple recognition, founder dependency reduction, cohort scaling).
- Phase 0 missing its gates doesn't just delay TRT — it eats into the cushion for the planning case. There is no cushion. Every gate matters more than V6.1 made it sound.

**Operational discipline implications:**

- **Speed of decision matters.** If Gate 0A fails Week 6, the response can't be "let's investigate for a month." It has to be a same-week pivot. Phase 0 timeline assumes ~5-6 weeks of marketing before Gate 0A; a month-long investigation eats a quarter of that runway.
- **Drag on Phase 0 launches is more expensive than V6.1 implied.** Every week Phase 0 is unshipped beyond the original plan is a week of compounding loss against the Y7 trajectory. The phrase "ship Phase 0" in V7 §13.4 — *"every day Phase 0 is unshipped is a day V7's assumption register is unvalidated"* — is operational, not motivational.
- **Founder time discipline.** Keith's memory file flagged a pattern: "analysis paralysis and premature pivoting." V7's thin headroom means this pattern has bigger consequences now. The same impulse that produced V5.0, V6.0, V6.1, V7.0 over six months should not be allowed to produce V7.1, V7.2, V7.3 over the same window during Phase 0 execution. Lock V7, ship against it, revise *only* against gate evidence.

**Marketing implications:**

- Don't under-invest in Phase 0 acquisition. The v3 model assumes organic + affiliate only (zero paid media). This is achievable but it requires the content engine to actually fire weekly. The `weekly-content-orchestrator` skill is operational; it needs to actually run weekly, not "when there's time."
- Affiliate acquisition (PT/coach-coded) is load-bearing for Phase 0 cash. The 50/50 mix per v2.3 stack assumes PT engagement at a defined rate. Under-recruitment of PTs in M1-M3 has Y1 cashflow consequences.

**What does NOT change:** V7's £30-45M Position C target. The discipline change is *how* Phase 0 ships, not whether it ships.

---

## 10. What V7 does NOT change in Phase 0

To be explicit about scope, V7 *does not* change:

- **Phase 0 product set.** Kits, supplements, FM list, tracker. No additions, no removals.
- **Phase 0 pricing.** £99 / £119 / £179 for kits; £34.95 Daily Stack; non-cash FM list. v2.2 canonical stands.
- **Phase 0 financial trajectory.** v3 model planning case (+£4,315 6-month net, +£39k 12-month cumulative cash) stands.
- **PT/affiliate programme structure.** v2.3 PT compensation stack stands.
- **CQC application timeline.** In flight, M12 planning. V7 doesn't change this.
- **Compliance posture.** Observation-only tracker, no clinical claims in Phase 0. The 2026-05-12 tracker decision §5 rules stand.
- **Phase 0 timeline.** M1-M12, no acceleration, no compression.

If any of these *do* need to change because of operational reality, that's a Phase 0 decision tracked separately. It is not a V7 implication.

---

## 11. Workflow changes summary

The most concrete operational changes the team (currently Keith + Ewa + occasional collaborators) needs to lock in before Phase 0 launches:

| Change | Owner | Deadline |
|--------|-------|----------|
| Brand voice update to lead with "patient-owned data" framing | Keith | Pre-launch |
| Content pipeline pillar mix updated (40% wellness, 40% clinical-curious, 20% TRT-specific) | Keith | Week 1 |
| Customer.io lifecycle: wellness-tier journey that doesn't push TRT | Keith | M2 |
| Ewa review step inserted into content workflow | Keith + Ewa | Pre-launch |
| Ewa retainer arrangement confirmed and signed | Keith | Pre-launch |
| Phase 0 dashboard adds gate metrics tile + cash position tile | Keith / dev | M1 |
| Tracker analytics infrastructure (log-in tracking) scoped | Keith / dev | M1-M2 |
| Founder bridge loan availability confirmed for M11 | Keith | M9 (deadline) |
| Tracker v1 designed as brand-visible asset (not just utility) | Keith / designer | M3-M4 |
| Signup flow consent broadens to allow downstream clinical opt-in | Keith / dev | Pre-launch |
| CRM tags for future hair loss / GLP-1 segmentation | Keith / dev | Pre-launch |
| Documented Gate failure response protocols | Keith | Week 2 |

This list is not exhaustive. It's the V7-specific delta against existing Phase 0 plans.

---

## 12. The honest read

V7 doesn't fundamentally change what Phase 0 *is*. It changes what Phase 0 *means*.

Pre-V7, Phase 0 was a validation exercise with a TRT launch waiting at the end. The Phase 0 success criteria were defensive (don't run out of money, generate enough warm pipeline for M13).

Post-V7, Phase 0 is the first 12 months of a 7-year platform build with thin headroom on the exit thesis. The success criteria are now offensive (build a wellness brand customers want to stay with, validate the tracker engagement thesis, establish content pillars that work for multi-vertical expansion, set up the operational discipline that exit-track gates will require).

This is not a harder Phase 0. The product set, the pricing, the financial trajectory all hold. It's the *same* Phase 0 carrying more weight than V6.1 acknowledged.

The risk this document is designed to surface: V6.1-thinking applied to V7-stakes produces a Phase 0 that ships fine on the day but creates problems in M13, M24, M36 because the operational rhythms, brand discipline, and decision speed weren't set up to match the multi-vertical platform thesis. The bridges between V7 strategy and Phase 0 operations are the §2-§9 implications above. Ignore them and Phase 0 ships but V7 doesn't.

Phase 0 still ships. V7 just changes how it ships. The differences are surface-level (brand voice, content pillars, workflow steps) but cumulative.

---

## 13. Cross-references

- Strategic context: `andro-prime-strategic-model-v7.md` §1, §3, §5, §6, §7, §8, §11
- Entity structure: `entity-structure/2026-05-12-single-entity-decision.md`
- Tracker decision: `2026-05-12-longitudinal-tracker-decision.md`
- Phase 0 financial model: `financial-model/phase0-financial-model-v1.xlsx` + `option-4-financial-model-2026-05-08.md`
- V7 cohort financial model: `andro-prime-v7-cohort-financial-model.xlsx`
- Master implementation: `master-implementation-blueprint.md`
- Compliance context: `03_compliance/CONTEXT.md`

---

*This document is the operational bridge between V7 strategy and Phase 0 execution. It updates as either V7 or Phase 0 evolves. Owner: Keith Antony.*
