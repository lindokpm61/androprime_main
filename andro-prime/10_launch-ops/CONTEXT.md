# Launch Ops Workspace Context

## Purpose
This workspace exists to move the project from planned to ready and to track performance once live.

Use it for:
- implementation checklists
- launch readiness
- QA gates
- issue tracking
- weekly review rhythm
- go-live coordination
- KPI dashboards and weekly performance reviews

## What belongs here
- implementation checklists
- QA gate docs
- readiness reviews
- dashboards (`dashboards/`)
- weekly review notes (`weekly-reviews/`)
- launch blockers and resolutions

## Good output looks like
- concise
- operational
- status-aware
- easy to act on
- suitable for execution review

## Do not use this workspace for
- long-form strategy
- brand development
- product design logic
- app architecture ownership

---

## Weekly KPI Review (every Monday)

| Metric | Target | Alert threshold |
| ------ | ------ | ---------------- |
| Kit sales/week | 15–25 | < 5 for 2 weeks — audit acquisition |
| Blended paid CAC | <= £50 | > £55 for 2 weeks — pause, rebuild copy |
| Google Search CTR | > 5% | < 2% — rewrite headlines |
| Supplement conversion | >= 15% of kit buyers | < 10% after 80 results — fix result email sequence |
| Affiliate-driven sales | > 30% of total | < 15% — more PT outreach |

See root `CLAUDE.md` for Gate criteria and gate trigger thresholds.

---

## Report File Naming

- KPI reviews: `REPORT_KPI_[WeekOf-YYYY-MM-DD].md` — save in `weekly-reviews/`
- Financial snapshots: update `../01_strategy/financial-model/financial_model.html` in place (version in file header)
