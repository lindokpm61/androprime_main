# Strategy — Context

**Framework:** Two-phase operating model (Phase 0 wellness / post-CQC clinical). All strategy work is anchored to the current phase and the gate conditions that unlock the next.
**Owner workspace:** `01_strategy`
**Integration:** The master implementation blueprint is the fixed baseline for all business, product, financial, and roadmap decisions. Read it before making or recommending any structural change to the operating model.

This workspace holds the high-level business logic, implementation baseline, roadmap, financial model, and competitive intelligence for Andro Prime. Do not duplicate content that lives here in other workspaces — link to it.

---

## Directory Structure

```text
01_strategy/
├── master-implementation-blueprint.md          ← Apr baseline ("supersedes all previous versions"). See note: V7 is the later planning layer.
├── andro-prime-strategic-model-v7.md           ← V7 strategic model (May, "supersedes V6.1"); STATE treats this as the live baseline.
├── phase0-v7-implications.md                    ← What V7 changes for Phase 0
├── phase0-prelaunch-triage.md                   ← Live pre-launch triage narrative (ClickUp companion)
├── kit-strategy-decision-brief-2026-05-08.md    ← Option-4 kit strategy (locked)
├── 2026-05-12-longitudinal-tracker-decision.md  ← Longitudinal-tracker decision (retention moat)
├── 2026-05-23-phase0-supplements-deferred-plan.md ← Supplements deferred to Phase 0b (results-engine authority)
├── trt-launch-readiness-2026-05-08.md
├── ltv-cac-profitability-model-2026-06-26.md    ← LTV:CAC model (annotated 2026-06-27)
├── ai-agent-enterprise-map.md · ai-agent-org-chart.md   ← AI-agent operating structure
├── CONTEXT.md · STATE.md
├── competitive-landscape/
│   ├── CONTEXT.md                               ← Competitors to monitor, naming conventions, output standards
│   └── competitive-landscape-march-2026.md      ← Snapshot: pricing, clinical models, acquisition
├── entity-structure/
│   ├── 2026-05-12-single-entity-decision.md     ← Single-entity Andro Prime Ltd (50/50)
│   └── shareholders-agreement-draft.md
├── financial-model/                             ← Phase 0 + tiered models (option-4, tiered-platform v1/v2, SEO forecast; .md + .xlsx + build scripts)
├── research/                                    ← Dated 2026-05-08 research (demand, competitive, reddit signal, cash-target, funnel math)
└── cowork-prompts/                              ← Pre-launch tracker prompts (v1/v2)
```

---

## How to Work Here

### Making or documenting a strategic decision

1. Read `master-implementation-blueprint.md` before proposing any change to operating model, product architecture, or gate sequencing.
2. Check whether the decision touches a Gate condition (see Gates Reference below). If it does, the gate criteria must be met before the decision is actioned.
3. Check `/03_compliance/CONTEXT.md` if the decision involves copy, clinical services, or regulated territory.
4. Document the decision as a dated memo: `YYYY-MM-DD-topic.md` in this directory.
5. If the decision changes the blueprint, update `master-implementation-blueprint.md` directly — do not create a separate version alongside it.

### Updating the master implementation blueprint

1. The blueprint is a **fixed working baseline**. Change it only if real-world evidence, regulatory advice, or material commercial underperformance requires a revision.
2. Record the reason for the revision at the top of the document with a date.
3. The blueprint supersedes all previous versions — do not preserve old versions alongside it.

### Adding competitive intelligence

1. Read `competitive-landscape/CONTEXT.md` first — it governs competitors to monitor, naming conventions, and output standards.
2. Create a new snapshot file: `REPORT_Competitor[Name]_[MonthYear].md` inside `competitive-landscape/`.
3. Each report must state: what changed, what it means for Andro Prime positioning or pricing, and which workspace (if any) needs to act.
4. Flag immediately if Vitall (our lab partner) shows any B2C re-entry signal. (Thriva was the original frontrunner; Vitall selected 2026-05-01.)

### Updating financial model or roadmap

1. The financial model and roadmap currently live inside `master-implementation-blueprint.md` (sections 3 and 6). Edit those sections in place.
2. If a standalone financial model file is created, name it `financial-model-YYYY-MM-DD.md` and add a pointer to it from the blueprint.
3. When updating gate timelines, cross-check against `10_launch-ops/` — the implementation checklists and dashboards there track real progress against the planned gates.

---

## Gates Reference

Strategic gate conditions that govern when the business can move between phases or scale specific activities.

> **GATE RULING (audit 2026-07-05; restated by Keith 2026-07-09). This section is canonical for what the gates mean and what their criteria are.**
>
> 1. **The canonical OPERATIONAL launch gates are qa-gates 1–5 plus Gate 0A.** These are the only launch *blockers*. Defined in `10_launch-ops/implementation-checklists/qa-gates.md`; live pass/fail state is ClickUp + `10_launch-ops/STATE.md`, not the frozen checkboxes there.
> 2. **Gates 0B and 0C are STRATEGIC post-launch gates, not launch blockers.** They gate scaling and CQC-prep decisions *after* the business is live; they never determine whether it can go live.
> 3. **The pre-2026-07-09 numeric definitions of 0A/0B are retired.** Four incompatible sets had accreted (`andro-prime-strategic-model-v7.md`, `master-implementation-blueprint.md`, this file, `10_launch-ops/CONTEXT.md`), and *all four* defined 0A and 0B on supplement metrics — paid pre-orders and kit→supplement conversion. The **2026-05-23 supplements-deferred decision** (`2026-05-23-phase0-supplements-deferred-plan.md`) replaced buy-now supplement CTAs with a non-cash waitlist, so those metrics do not exist in Phase 0a. Gate 0A's 25-pre-order bar was also arithmetically unreachable against the Tier-2 plan's own 90-day forecast of ~5–20 total kit sales: at 100% attach it could not clear.
> 4. **Governing principle for the restatement.** At Phase 0a volume (n ≈ 5–20 customers) no demand signal is statistically meaningful, so a demand-threshold gate cannot be earned. A gate that cannot clear does not block anything; it gets ignored, which is how the four contradictory definitions accreted. Each gate is therefore restated around **the decision it authorises**, not around a volume it can never reach.

| Gate | Type | When | Criteria | Action unlocked |
| --- | --- | --- | --- | --- |
| **Gate 0A** | Operational — **spend authorisation** (capped downside, not earned demand) | When manufacturer terms are agreed | **All must hold:** (1) **stock private-label** formulation only, already stability-tested — no bespoke V7.2, no tooling spend; (2) total first-run exposure **capped at the phased ~£5,950**; (3) MOQ small enough that a **total write-off is survivable**; (4) the clean **4-active spec** held (Zinc, D3, Methyl-B12, KSM-66 — ashwagandha stays silent in all copy, root guardrail 3). Supplement-waitlist opt-in rate is a **directional read only, never a threshold**. | Place the MOQ supplement inventory order |
| **Gate 0B** | Strategic (post-launch) — **unit economics** | Read at the Tier-2 week 6–12 decision point; stage 2 not readable before ~week 8 | **Stage 1 (pre-supplement): CPA < kit gross contribution** — £38 (Kit 1) / £53 (Kit 2) / £77 (Kit 3), direct, per the 2026-06-26 LTV:CAC model. A kit sale must pay for its own acquisition. **Stage 2 (post-supplement, once attach is observed): CPA < blended LTV** (a 6-month subscriber ≈ £165). Soft signals (CTR, quiz-starts, initiate-checkout, email captures) are **tie-breakers at low n**, not substitutes. | Scale paid spend beyond the £250–500 Search test |
| **Gate 0C** | Strategic (post-launch) — **cash** | Month 12 | Cumulative cash position vs the **£30k "Phase 0 self-funded" threshold**. (The v3 "~£39k" projection was **restated 2026-07-09** for the affiliate freeze + June inputs; see `STATE.md` Phase 0 financial principles + option-4 Appendix R. Treat as a scenario range, not a target.) | Confirms Phase 0 is self-funded → begin CQC launch preparations in earnest |
| **TRT day-1 readiness target** | Signal | Any point | 40+ founding-member list opt-ins received | Internal commercial-readiness signal (not a CQC regulatory gate — CQC has no patient-volume requirement) |

**Why 0C survived the deferral unchanged:** it is the only one of the four candidate definitions not defined on a supplement metric. That is the tell — a cash gate is the robust kind, and 0A/0B were fragile because they measured a product that had not shipped.

**Gate 0A is a founder bet, and is recorded as one.** The Tier-2 plan flags the ~£5,950 capital commit as *"breaks the self-financing principle — flagged for Keith."* No demand evidence is available at this volume to overturn that. 0A therefore caps the downside rather than pretending to prove the upside.

**On the ~£5,950 cap.** It is **Option A** (Daily Stack only, phased) from `financial-model/phase0-financial-model-v1.md` §5: £4,000 MOQ + £1,200 label/compliance + £750 stability testing. It is *not* the £9,000 **Option B** (both SKUs) figure that older docs attach to Gate 0A — that figure is retired as the 0A cap. Two consequences worth holding: (a) the model assumed this capital would be *drawn from accumulated cash* around Month 4, whereas Tier-2 **fronts** it, which is exactly what makes it a bet rather than a self-funded step; (b) under a genuinely **stock** private-label formulation the £750 stability line should already be covered by the manufacturer, so real exposure may come in below £5,950. Confirm at the manufacturer-terms step.

Gate 0A here is the same 0A as qa-gates'. Gate tracking lives in `/10_launch-ops/`. Do not duplicate it here — reference it.

### Gate failure-response

*Restated 2026-07-19. Replaces the retired V7 "0A / 0B / 0C / Tracker-Engage failure protocols" item (ClickUp 36), which was written against the pre-2026-07-09 gate taxonomy and named a "Tracker-Engage" gate that no longer exists.*

Each gate is a **decision point, not a measurement**, so a "failure" is a go/no-go call to make deliberately, not a metric to investigate for weeks. By gate:

- **Operational gates (1 to 5 + 0A) during build:** the gate simply does not clear. There is no partial or soft launch. The blocked item stays open and is logged in ClickUp against that gate's task (never a side markdown doc), per `10_launch-ops/CONTEXT.md`. Go-live waits.
- **Gate 0A (spend authorisation):** "failure" means a precondition does not hold at the manufacturer-terms step: bespoke formulation demanded, exposure above the ~£5,950 cap, or an MOQ too large to write off. Response: do not place the order; renegotiate terms or defer. Nothing has been committed, so the downside is nil and the response is hold-and-reprice, not a pivot.
- **Gate 0B (unit economics, post-launch):** the one gate that genuinely trips. If Stage 1 CPA is at or above kit gross contribution (or Stage 2 CPA at or above blended LTV), do not scale paid: pause and rebuild copy/targeting before the £250 to 500 Search test escalates. This must be a **same-week** decision, not a month-long investigation. Phase 0 assumes only ~5 to 6 weeks of marketing before the Tier-2 decision, so a slow response burns a quarter of the runway (V7 §8.4).
- **Gate 0C (cash, Month 12):** if cumulative cash is below the £30k self-funded threshold, do not begin CQC-prep spend in earnest. Extend Phase 0 or escalate the funding decision. Treat the figure as a scenario range, not a pass/fail target.

---

## Strategic Constraints

These are fixed assumptions that govern all strategy work. They are not up for debate without a material change in commercial or regulatory reality.

| Constraint | Rule |
| --- | --- |
| Operating mode | Phase 0 wellness first. Clinical operations do not exist until CQC registration is live. |
| TRT availability | Not currently available. Do not plan, brief, or imply otherwise in any output. |
| Low-T routing | T < 12 (Kit 1/3) → GP referral, no upsell, consent-gated nurture only (2026-06-04). FM list is a dormant standalone non-cash opt-in, never a results CTA. |
| Supplement gate | No MOQ order until Gate 0A is met. |
| Blueprint authority | `master-implementation-blueprint.md` supersedes all other versions. Edit in place; do not fork. |
| Compliance priority | Compliance overrides strategy. If a strategic decision conflicts with `/03_compliance/CONTEXT.md`, compliance wins. |
| Legal entity | Single entity: **Andro Prime Ltd** (no. 17185839, inc. 28 Apr 2026), held 50/50 Keith Lindo / Dr Ewa Lindo. Two-entity / Prima-holdco structure parked ~18 months. Data controller = Andro Prime Ltd (wellness now + clinical post-CQC). |
| Phase 0 financing | Self-financing cost centre — target **~£30k cash at bank by M12**. Phase 1 (post-CQC) funds itself; the Phase-0→1 payoff is the warm-lead pipeline, not a cash transfer. Measure cumulative cash, not topline. |
| Paid acquisition | Cold paid **never pays back** (best modelled cell 0.79:1). Only owned (~£0 CAC) + affiliate (~£30) clear the ~£29 healthy-CAC bar. Attach rate + tenure are first-order LTV levers; price is second-order. |

Current status of every open strategic thread (entity/ICO, financial models, share structure, Vitall pivot, sales/Tier-2 plan) lives in `STATE.md` — read it before acting on any of them.

---

## Special Cases

**`master-implementation-blueprint.md`:** This is the single source of truth for the operating model. It contains the product architecture, financial model, customer journey, implementation roadmap, compliance checklist, KPI dashboard structure, risk register, and governing principles. Read it in full before working on any cross-workspace strategy task.

> **Blueprint vs `andro-prime-strategic-model-v7.md` (audit flag 2026-07-02):** the blueprint is the fixed April *implementation* baseline; V7 (May, "supersedes V6.1") is a later *strategic-planning* layer that `STATE.md` treats as the live baseline. The two are not formally reconciled — when they diverge, confirm which governs the specific decision. Deciding which is authoritative (and updating the "supersedes all versions" language above and in Strategic Constraints) is owed.

**`ai-agent-enterprise-map.md` and `ai-agent-org-chart.md`:** These document how AI agents are structured across the business — what roles they fill, which workspaces they own, and how they interact. These are operational planning documents, not implementation specs. Engineering implementation lives in `/09_website-app/`.

**`competitive-landscape/`:** Has its own CONTEXT.md. Always read it before adding a new competitor report. Thriva is a B2C competitor to monitor (originally evaluated as lab partner; Vitall selected 2026-05-01).

---

## Do Not Use This Workspace For

- Detailed page copy or email copy (belongs in `06_marketing/` or `09_website-app/frontend/email-templates/`)
- UI or visual design
- Code or CSS
- Low-level execution checklists that do not directly govern a strategic gate or phase decision (belongs in `10_launch-ops/`)
- Duplicating product specs, pricing, or ICP data that already lives in `04_products/`
