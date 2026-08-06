# Quarterly Ops Cadence

The once-a-quarter rhythm: refresh the numbers the business plans against, check the strategy and roadmap still hold, and sweep the docs for drift. This cadence triggers work in other workspaces; it does not do their work here. Findings and actions go to **ClickUp** (`workspace_id: "90121729875"`).

---

## The quarterly checks

| Check | SOP | Owner workspace | Why |
| --- | --- | --- | --- |
| Financial-model refresh trigger | (reference below; owner → `01_strategy`) | `01_strategy` (model) | The financial model drives pricing, gate, and cash decisions; a quarter of real revenue/cost data should be folded back into it so the model reflects reality, not April assumptions. |
| Roadmap + strategy check-in | (reference below; owner → `01_strategy`) | `01_strategy` | Confirm the phase plan, gate framework, and roadmap still match what is actually happening on the ground, and surface anything that needs a founder decision. |
| Docs-currency sweep | (reference below) | each touched workspace | CONTEXT.md and STATE.md drift is how contradictions start (per the 2026-07-05 audit); a quarterly freshness pass keeps the operating system honest. |

---

## How to run each

### 1. Financial-model refresh trigger

- The model itself is owned by `01_strategy`; this cadence only **triggers** the refresh, it does not re-decide the model.
- Canonical model doc: `01_strategy/financial-model/option-4-financial-model-2026-05-08.md`. Per the launch-ops rule, **version the model doc's header/status field in place with the date of the edit; do not create a new file** (`10_launch-ops/CONTEXT.md`).
- Feed it the quarter's real figures: revenue and subscription MRR (Stripe), CAC (Stripe + channel data), kit/result volumes and attach rate (Supabase). Open a ClickUp task against `01_strategy` for the actual refresh.
- If revenue or cost figures moved enough to change a gate read (Gate 0B unit economics, Gate 0C Month-12 cash), flag it to `01_strategy` and `10_launch-ops`.

### 2. Roadmap + strategy check-in

- Route to `01_strategy`: re-read its CONTEXT.md + STATE.md and confirm the phase plan, the Gates Reference (0A/0B/0C criteria are canonical there), and the roadmap still describe reality.
- Surface open founder decisions the quarter exposed (for example the Daily Stack base-price increase still not locked, the all-clear maintenance offer pending Ewa, the affiliate unfreeze) as ClickUp tasks against the owning workspace. Do not decide them here.
- This is a check-in that raises items, not a strategy rewrite; strategy work happens in `01_strategy`.

### 3. Docs-currency sweep

- **Start mechanically: `node .claude/skills/context-audit/audit.js`** (skill: `context-audit`). It diffs every CONTEXT.md against disk and reports broken path citations, stale "does not exist" claims, and undocumented directories. Exit 0 clean, 2 drift, 1 could not run — **exit 1 is never a pass.** Fix BROKEN findings; STALE is the rarest and highest-value bucket, because a false "does not exist" suppresses the curiosity that would correct it. **A clean run means the paths resolve, not that the document is true**, so the judgement pass below still happens.
- Walk the workspaces touched this quarter and check each STATE.md `_Last updated:_` date and its status against what is actually live. Stale status is the drift signal; a durable rule in the wrong place (live status accreting in a CONTEXT.md) gets split into STATE.md.
- Where a decision landed but its cross-doc cleanup lagged, run `/decision-sweep` to propagate it and SUPERSEDED-banner the old statements.
- File each fix by half-life: durable rule → CONTEXT.md; dated status → STATE.md; a skill-definition friction → a `task-observer` observation. Open ClickUp tasks for anything needing another workspace's owner or a Keith/Ewa sign-off.

---

## Escalation

A model refresh that changes a gate read, a roadmap item that needs a founder decision, or a doc contradiction that needs a decision sweep each opens a ClickUp task against the owning workspace. Nothing strategic is decided in this workspace; this cadence only schedules and routes the work.
