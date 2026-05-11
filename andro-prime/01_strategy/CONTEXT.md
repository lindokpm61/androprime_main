# Strategy — Context

**Framework:** Two-phase operating model (Phase 0 wellness / post-CQC clinical). All strategy work is anchored to the current phase and the gate conditions that unlock the next.
**Owner workspace:** `01_strategy`
**Integration:** The master implementation blueprint is the fixed baseline for all business, product, financial, and roadmap decisions. Read it before making or recommending any structural change to the operating model.

This workspace holds the high-level business logic, implementation baseline, roadmap, financial model, and competitive intelligence for Andro Prime. Do not duplicate content that lives here in other workspaces — link to it.

---

## Directory Structure

```text
01_strategy/
├── master-implementation-blueprint.md  ← Fixed baseline. Phase 0 to CQC activation. Supersedes all previous versions.
├── ai-agent-enterprise-map.md          ← AI agent structure across the business (operational roles, not org chart)
├── ai-agent-org-chart.md               ← Visual org chart of AI agents and their workspace owners
└── competitive-landscape/
    ├── CONTEXT.md                      ← Competitors to monitor, report naming conventions, output standards
    └── competitive-landscape-march-2026.md  ← Snapshot: pricing, clinical models, acquisition strategy
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

| Gate | When | Criteria | Action unlocked |
| --- | --- | --- | --- |
| **Gate 0A** | Week 6 | 25+ supplement pre-orders with deposits | Place MOQ supplement inventory order (£4k–7k) |
| **Gate 0B** | Week 10 | 10%+ of Kit 2/3 buyers converting to supplements | Scale paid ads and content for Kit 2 and Kit 3 |
| **Gate 0C** | Month 4 | 200+ kits sold, 40+ subs, MRR > £1,500 | Begin CQC launch preparations in earnest |
| **CQC trigger** | Any point | 40+ founding member deposits received | File CQC application regardless of Gate 0 progress |

Gate tracking lives in `/10_launch-ops/`. Do not duplicate it here — reference it.

---

## Strategic Constraints

These are fixed assumptions that govern all strategy work. They are not up for debate without a material change in commercial or regulatory reality.

| Constraint | Rule |
| --- | --- |
| Operating mode | Phase 0 wellness first. Clinical operations do not exist until CQC registration is live. |
| TRT availability | Not currently available. Do not plan, brief, or imply otherwise in any output. |
| Founding member CTA | Only triggered by confirmed T < 12 nmol/L (Kit 1 or Kit 3). Never inferred from energy markers. |
| Supplement gate | No MOQ order until Gate 0A is met. |
| Blueprint authority | `master-implementation-blueprint.md` supersedes all other versions. Edit in place; do not fork. |
| Compliance priority | Compliance overrides strategy. If a strategic decision conflicts with `/03_compliance/CONTEXT.md`, compliance wins. |

---

## Special Cases

**`master-implementation-blueprint.md`:** This is the single source of truth for the operating model. It contains the product architecture, financial model, customer journey, implementation roadmap, compliance checklist, KPI dashboard structure, risk register, and governing principles. Read it in full before working on any cross-workspace strategy task.

**`ai-agent-enterprise-map.md` and `ai-agent-org-chart.md`:** These document how AI agents are structured across the business — what roles they fill, which workspaces they own, and how they interact. These are operational planning documents, not implementation specs. Engineering implementation lives in `/09_website-app/`.

**`competitive-landscape/`:** Has its own CONTEXT.md. Always read it before adding a new competitor report. Thriva is a B2C competitor to monitor (originally evaluated as lab partner; Vitall selected 2026-05-01).

---

## Do Not Use This Workspace For

- Detailed page copy or email copy (belongs in `06_marketing/` or `09_website-app/frontend/email-templates/`)
- UI or visual design
- Code or CSS
- Low-level execution checklists that do not directly govern a strategic gate or phase decision (belongs in `10_launch-ops/`)
- Duplicating product specs, pricing, or ICP data that already lives in `04_products/`
