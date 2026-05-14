# Entity Structure Decision Record

**Date:** 2026-05-12
**Owner:** Keith Antony
**Status:** Decided. V6.1 §2 reaffirmed by V7.0.
**Decision authority:** Founder call
**Workspace home:** `01_strategy/entity-structure/` (this file)

---

## 1. Decision

**Andro Prime Ltd is a single legal entity holding all current and future commercial activities — wellness (kits, supplements, longitudinal tracker) and clinical (TRT and any subsequent regulated services) — under one corporate roof.**

This decision was made in V6.1 §2 (March 2026) and is reaffirmed by V7.0 (May 2026). No two-entity structure ("Andro Prime + Andro Prime 2", "wellness Ltd + Clinical Ltd", or HoldingCo + subsidiary pattern) is currently in scope.

---

## 2. Why this is being documented now

Between V6.1 and V7.0, conversations occasionally drifted toward a two-entity structure — usually framed as "the wellness brand stays clean and the clinical brand carries the CQC weight." Each time, the conversation eventually returned to single-entity for the reasons in §3 below, but the decision was never formally recorded.

The risk of leaving this informal: a future conversation re-opens it without the prior reasoning being on file, time is spent re-deciding, and the strategy drifts. This document is the on-file record so re-deciding requires a deliberate review of the rationale here, not a casual rebuild.

The empty folder `01_strategy/entity-structure/` was flagged in V7 §13 as needing this record. This document closes that gap.

---

## 3. Rationale (the reasoning that supports the decision)

### 3.1 Operational simplification outweighs theoretical valuation upside

A two-entity structure introduces real ongoing costs: separate annual accounts (~£3-5k each), separate CQC governance touchpoints, separate tax filings, separate insurance arrangements, intercompany transfer pricing decisions, separate banking, separate VAT considerations (depending on group registration). For a bootstrapped business in Y1-Y3 with limited founder bandwidth, this is meaningful overhead.

The theoretical upside of a two-entity structure is exit-valuation optimisation: the wellness entity could potentially be valued as a "platform" at higher multiples, separate from the clinical entity valued as a healthcare service. V6.1 §2 estimated this premium at 0.5-1.0x EBITDA, which on Optimised Base EBITDA of ~£5-7M is ~£2.5-7M of headline EV.

V6.1 §2 concluded — and V7.0 reaffirms — that operational simplification in Y1-Y5 is worth more than the theoretical exit premium in Y7. The exit premium is also unvalidated (V7 §5.3 notes UK platform multiples are not publicly disclosed at sufficient granularity to confirm the premium would materialise).

### 3.2 The CQC governance argument cuts in favour of single-entity

A two-entity structure does not eliminate regulatory complexity — it relocates it. Clinical Ltd would still need CQC registration, its own clinical director / nominated individual / registered manager, its own clinical governance documentation. The "firebreak" between wellness and clinical is real but limited: ASA still polices marketing claims regardless of which entity makes them; the ICO still scrutinises data sharing between related entities; CQC still expects governance independence even when entities share ownership.

Where the firebreak does help: if Clinical Ltd has a serious clinical incident, the wellness brand is somewhat insulated reputationally. This is real but proportional — buyers in 7 years will look at the group as a whole regardless of structure.

The single-entity structure also simplifies CQC application: one nominated individual, one registered manager, one set of documentation. The CQC application is already in flight under single-entity assumptions.

### 3.3 Data architecture works under single entity

V7 §3 establishes the longitudinal tracker as a core differentiator. The data architecture concern — "wellness customers' data shouldn't migrate to clinical without explicit consent" — applies equally under single-entity. The 2026-05-12 longitudinal tracker decision document specifies that v3 (post-CQC clinical extension) lives in a separate codebase path (`/11_clinical-plugin_post-cqc/`) within the same entity. Data segregation by purpose, not by legal entity, is the design pattern.

Single-entity means data subjects have one data controller (Andro Prime Ltd) responsible for all their interactions, which is simpler from a GDPR transparency perspective than two controllers with intercompany data sharing arrangements.

### 3.4 Tax efficiency achievable within single entity

V6.1 §2 noted that the V5.0 two-entity structure offered tax optimisation via dividend strategies between Keith and Ewa. Single-entity does not preclude this: shareholder structure (different classes of shares, alphabet shares, dividend waivers) achieves the same tax flexibility within one company. The complexity is in the company articles, not in the entity count.

Specific tax considerations for Y2-Y7:
- Corporation tax: 25% on profits above £250k, marginal relief £50k-£250k. Single-entity carries one CT calculation.
- Dividend planning: Keith / Ewa receive dividends per their shareholding; alphabet shares allow differentiated dividend declarations if needed.
- BADR (Business Asset Disposal Relief): available on exit for shareholders who have held qualifying shares for 2+ years. Single-entity simplifies the qualifying-share analysis.
- Ewa buyout (if it occurs pre-exit): structurally simpler under single-entity via share buyback or transfer to a holding vehicle.

### 3.5 What single-entity does NOT achieve

To be honest about the tradeoffs, single-entity does not give us:

1. **Spin-out optionality.** A buyer interested only in the clinical operation cannot easily acquire it without buying the whole entity. This is a real cost if a partial-sale exit becomes attractive.
2. **Regulatory firebreak in the strict sense.** If the wellness side has a major ASA issue or the clinical side has a major CQC issue, both sides wear the reputational impact.
3. **Independent valuation visibility.** A buyer cannot easily see the wellness business and clinical business as separate value pools because they live in one P&L. Cohort-based accounting (per V7 §6) mitigates this internally but doesn't fully resolve it externally.

These costs are real. V7 accepts them in exchange for Y1-Y5 operational simplicity.

---

## 4. When this decision would be revisited

The decision is not permanent. Single-entity is the default; a deliberate review is required to change it. Revision triggers:

### 4.1 CQC complications

If the CQC application process surfaces a structural problem that requires entity separation (e.g. an inspector raises governance concerns about the combined wellness/clinical activities within one entity, or a clinical incident requires regulatory containment), entity separation becomes a forced decision rather than an optimisation decision.

### 4.2 Exit conversations preferring entity separation

If exit conversations in Y5-Y7 surface a buyer who specifically wants the wellness business OR the clinical business but not both, restructuring before sale may be valuable. UK case law and HMRC clearance procedures allow demerger / hive-down transactions, but they take 6-12 months and carry transaction costs. The decision to restructure should happen 12-18 months before anticipated exit.

### 4.3 External investment

If a future external investor (VC, private equity, strategic) requires entity separation as a condition of investment, the decision is forced. V7 does not currently anticipate external investment; if this changes, this decision record needs updating.

### 4.4 Tax law changes

Material UK tax changes that make two-entity structures meaningfully more efficient (or single-entity meaningfully less efficient) would warrant review. No current planned changes affect this.

### 4.5 ASA / regulatory pattern that creates structural risk

If the ASA pattern of action against UK men's-health platforms hardens such that combined wellness + clinical entities face systematically worse outcomes than separated entities, the structural protection of separation may outweigh the operational cost. This is an industry-watch item, not a current concern.

---

## 5. What this decision implies for current work

### 5.1 Phase 0 operates as Andro Prime Ltd

All kits, supplements, founding member list, longitudinal tracker, content production, customer relationships, payment processing, banking, IP — single entity ownership. No "wellness subsidiary" or "operating company" intermediation.

### 5.2 CQC application proceeds under Andro Prime Ltd

The CQC application currently in flight names Andro Prime Ltd as the registered provider. No restructuring required pre-approval.

### 5.3 Clinical services launch within Andro Prime Ltd post-CQC

TRT (M13), hair loss (M15-M18), GLP-1 (M20-M24 per V7 §7.2a recommendation) all launch as regulated activities within the same legal entity. Each new regulated activity requires CQC notification / amendment but not new corporate structure.

### 5.4 Financial model treats Andro Prime as one P&L with cohort breakdown

V7 §6 cohort structure (wellness, TRT, hair loss, GLP-1, multi-service) is a *management accounting* framing — internal cohort visibility for decision-making. The statutory accounts produce one consolidated P&L. The financial model (built per V7 §13.1) operates at cohort level for clarity but rolls up to single-entity totals.

### 5.5 Shareholder structure to be confirmed

V7 §11.5 assumes Keith ~75% / Ewa ~25% equity split. This is the working assumption for founder-outcome modelling but has not been formally documented as a shareholders' agreement. Recommendation: document shareholder structure (and any dividend rights, drag-along/tag-along, vesting if relevant) before Phase 0 launch.

---

## 6. Related decisions and documents

| Document | Relationship |
|---------|-------------|
| `andro-prime-strategic-model-v7.md` §2.1 | Reaffirms single-entity decision |
| `andro-prime-financial-model-v6.1.md` §2 | Original decision record (March 2026) |
| `2026-05-12-longitudinal-tracker-decision.md` | Consistent with single-entity (clinical plugin in same codebase) |
| `phase0-financial-model-v1.xlsx` + Option 4 markdown | Modelled under single-entity assumption |
| `trt-launch-readiness-2026-05-08.md` | Single-entity assumption |
| `master-implementation-blueprint.md` | Single-entity assumption |

---

## 7. Decision log

| Date | Event | Documented |
|------|-------|-----------|
| Pre-Dec 2025 | V5.0: two-entity structure (Andro Prime + Prima) | V5.0 model |
| Mar 2026 | V6.0/V6.1: single-entity decision, two-entity rejected | V6.1 §2 |
| May 2026 | V7.0 review: decision reaffirmed, formal record created | This document |

---

## 8. The honest read

Single-entity is the right call for now and for the foreseeable medium term. It is not necessarily the right call for exit. If V5-V7 execution produces an exit conversation in 2032-2033, restructuring 12-18 months before the deal may be valuable — that decision is a Y5-Y6 problem, not a Y1 problem.

The temptation to revisit this decision will recur every time a conversation surfaces the "what if the wellness brand and clinical brand were separate?" framing. The recurrence is normal; the right response is to read this document, confirm the reasoning still holds, and move on. Re-deciding without new information is procrastination.

If new information arrives (CQC complications, buyer conversations, external investment, regulatory changes), this document is updated. Otherwise the decision stands.

---

*Decision record filed 2026-05-12. Owner: Keith Antony. Next review: at Gate Exit-Y3 (M36) or earlier if §4 triggers materialise.*
