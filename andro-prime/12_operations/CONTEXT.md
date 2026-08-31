# Operations: Context

**Purpose:** The ongoing, steady-state running of the live business: recurring operational cadences (daily, weekly, monthly, quarterly) and the SOP library for day-to-day tasks (email triage, Search Console and analytics monitoring, confirming the content machine shipped, billing/dunning, support, incident response).
**Owner workspace:** `12_operations`
**Integration:** The SOPs and cadence playbooks here are durable "how to run this" documents. Live task instances, scheduling, and completion status live in ClickUp, not markdown. Each SOP points to the workspace that owns the underlying source of truth; this workspace is the cadence layer on top of them, not a second copy.

> **Canonical task tracking = ClickUp**, not markdown. This workspace holds the durable SOP (how to run a check and what "good" looks like); the live instance (is this week's check done, who owns it, what did it find) is a ClickUp task. Do not maintain a parallel open-task list in markdown. Every ClickUp call must pass `workspace_id: "90121729875"`.

This workspace is operational, not strategic. Output here is concise, repeatable, and action-oriented.

---

## Boundary with 10_launch-ops

These two are adjacent and must not blur:

- **`10_launch-ops`** is finite and gate-driven: getting the business *to launch* (Gate 0A/0B/0C, QA gates, launch-readiness reviews). It ends when the thing is live.
- **`12_operations`** is indefinite and cadence-driven: *keeping the live business running* on a daily/weekly/monthly rhythm. It never ends.

Rule: when a launch task becomes a recurring steady-state check, its SOP belongs here, not in launch-ops. Gate definitions and readiness stay in `10_launch-ops`.

---

## Directory Structure

```text
12_operations/
├── CONTEXT.md                          ← this file
├── cross-cutting-principles.md         ← agent working principles; a mandatory
│                                         checklist when any skill is authored
│                                         or edited (task-observer)
├── cadences/                           ← the recurring rhythm: what to check and how often
│   ├── daily-ops.md
│   ├── weekly-ops.md
│   ├── monthly-ops.md
│   └── quarterly-ops.md
├── sops/                               ← durable "how to run X" playbooks referenced by the cadences
│   ├── email-triage.md
│   ├── search-console-monitoring.md
│   ├── analytics-review.md
│   ├── content-machine-verification.md
│   ├── subscription-billing-ops.md
│   ├── support-queue.md
│   └── incident-runbook.md
└── automation/
    ├── scheduled-agents.md             ← which cadences are automated vs still manual
    ├── reconcile-f-css.js              ← diffs each Direction F mockup's CSS against
    │                                     the app's f-primitives.css and reports
    │                                     conflicting declarations. Reports only.
    └── shot.js                         ← headless screenshots of a local HTML file
                                          or URL; the tool behind the "verify UI
                                          visually" rule. `--help` is the doc.
```

---

## Cadence Index

Each cadence file lists its checks, the SOP each check runs, and the owning workspace. Live run status is in ClickUp.

| Cadence | Covers | File |
| --- | --- | --- |
| Daily | Email triage, alerts (Sentry), new orders + dispatch sanity | `cadences/daily-ops.md` |
| Weekly | Search Console, GA4, content-machine output vs calendar, affiliate/partner replies, KPI glance | `cadences/weekly-ops.md` |
| Monthly | Retention/cohort, subscriptions + dunning, compliance re-approval sweep | `cadences/monthly-ops.md` |
| Quarterly | Roadmap and financial-model refresh, strategy check-in | `cadences/quarterly-ops.md` |

---

## How to Work Here

### Running a cadence

1. Open the cadence file (`cadences/<period>-ops.md`). It lists each check and the SOP it runs.
2. Run each check per its SOP in `sops/`. Record what you found, and any action, as a ClickUp task or comment, not in these files.
3. If a check surfaces an issue owned by another workspace, route it there (see root `CLAUDE.md` routing table) and open a ClickUp task against the owner.

### Adding or changing an SOP

1. SOPs are durable. Put the procedure and the "what good looks like" bar in `sops/`; put dated run status in ClickUp.
2. Point the SOP at the owning workspace's source of truth (e.g. content verification points to `06_marketing/content-machine/`, billing to `07_sales` + Stripe, GSC/analytics to `06_marketing` and `10_launch-ops`).
3. Add the SOP to the relevant cadence file so it is actually run on a rhythm; an SOP no cadence references will not happen.

### Editing or authoring a skill

Read `cross-cutting-principles.md` first and check the skill against every active principle. It is a checklist, not background reading: the `task-observer` methodology treats it as mandatory during any skill creation or regeneration.

It lives here rather than beside the observation log (which stays outside the repo at `~/.claude/projects/d--Androprime-main/skill-observations/`) because the two have different half-lives. The log is append-only session state that churns several times a session; this is a curated document that changes a few times a month and gates how skills are written, so it belongs in version control. Moved into the repo 2026-08-06 after it tripled in size in one pass while sitting untracked on a single machine; a stub at the old path points here.

Principles are distilled from observations, never invented here. Each one names the observations behind it and the skills it applies to — a principle with no "applies to" line is a sentiment, not a control.

---

## Skills, tools & MCPs

MCP servers and tools most relevant when working in this workspace. Repo-wired servers are in the root `.mcp.json` (graphify, context7, dataforseo, supabase, clickup); the rest are claude.ai account connectors, some of which need authorising in an interactive session before use.

**Skills** (repo skills invoke as `/name`; the rest ship with plugins):

- `/wrap`, `/task-observer`: session close-out (reconcile STATE/CONTEXT, update ClickUp, commit by path) and skill-friction capture.
- `/content-status`: check what the content machine has produced and its approval state.
- `/context-audit`: diff every workspace CONTEXT.md against disk (broken path citations, stale "does not exist" claims, undocumented directories). Step 0 of the quarterly docs-currency sweep. Exit 1 means it could not run and is never a pass.
- `/multi-agent-orchestration`: read before briefing or fanning out subagents, or before writing a workflow script that spawns them.
- `schedule`, `loop`: stand up a recurring cadence as a scheduled cloud agent, or run a check on an interval.
- `analytics-tracking`: measurement/GA4 review method behind the analytics SOP.
- `/compliance-preflight`: run before any external-facing item a cadence sends or publishes.

**MCPs & tools:**

- **clickup** (MCP, wired): the operational task and cadence system of record (workspace `90121729875`). Every check's live status is a ClickUp task.
- **Gmail / gws CLI** (connector / local CLI): the email-triage cadence (inbox review, partner/customer replies). Gmail connector needs authorising before use.
- **Search Console / GA4** (`G-D5M4J5M3F6`, live): the weekly SEO and analytics review. GSC is not an MCP; access it in its console. GA4 + Sentry is the live analytics/error stack.
- **Stripe** (MCP, connector): the billing-ops cadence (failed payments, dunning, refunds).
- **supabase** (MCP, wired, read-only): order/subscription/results state for the daily dispatch and monthly retention checks.
- **dataforseo** (MCP, wired): deeper SEO diagnostics when the weekly GSC glance flags a drop.
- **`automation/reconcile-f-css.js`** (local script): the Direction F component layer exists in
  **fourteen independent copies**, a `<style>` block in each of the 13 journey mockups plus
  `f-primitives.css` in the app, with nothing reconciling them. This diffs them and reports
  conflicting declarations, mockup-vs-mockup drift, ruled deviations and unpaired selectors.
  **Exit 0 agree, 2 drift, 1 could not run, which is never a pass** (same shape as
  `.claude/skills/wrap/reconcile-observations.js`). `--help` is the doc.
  **It reports and never rewrites**, deliberately: with 14 copies, a script that fixed the drift
  would be choosing a winner on Keith's behalf. **It compares DECLARATIONS**, so it is blind to
  absences (a class the markup never emits, a glyph never rendered) and to cascade interactions
  inside one file; those need a probe against the built page. Added 2026-08-31.
  **The density question it was built around is now RULED** (Keith, 2026-08-31): the tighter values
  in `account-F`, `membership-F` and `results-F` were **drift, not a deliberate app density**, and
  those three frames were converged onto the marketing values the built primitives already carry.
  Mockup-vs-mockup drift went 33 to 31.
  🔴 **Known gap: its `RULED` table is consulted in the CONFLICT branch only.** Mockup drift is
  emitted unconditionally and never tested against it, so a ruling about a mockup-vs-mockup
  disagreement has nowhere to be recorded and would report as a defect forever — which is the exact
  outcome the `RULED` mechanism's own comment says it exists to prevent. It was survivable here only
  because the ruling went "drift", so the sources could be edited and the finding disappeared
  honestly. Make the predicate take the finding shape and consult it in every emit branch.

- **`automation/shot.js`** (local script, no MCP): the way to actually SEE a rendered page. **No browser MCP is wired here and `/plugin` is unavailable in this environment**, so nothing is installable through the plugin system; this script drives system Chrome through puppeteer-core instead. `node andro-prime/12_operations/automation/shot.js <file-or-url> --selector "css" --nth all --theme both`. Shoots per-element and per-theme, waits on webfonts, disables subpixel text fringing, and warns on horizontal body overflow. **A local path may carry a query string** (fixed 2026-08-28): the design mockups read `?still=1` and `?t=light|dark` off their own URL, and the existence check used to reject the whole argument as "no such file", which made the tool unusable on exactly the pages it exists to photograph. **Use it rather than `chrome --headless --window-size` for any narrow viewport**: Windows clamps the window to about 518px inner width and then crops the PNG to the width you asked for, so a 390 capture is a 518 render cropped to 390 and every overflow it appears to show is an artefact. It cannot reach anything behind auth: a fresh headless browser has no session and photographs the login page, which looks like a successful capture.

---

## Do Not Use This Workspace For

- Launch readiness, QA gates, or Gate 0A/0B/0C tracking (→ `/10_launch-ops`)
- Strategy, roadmap decisions, or the financial model itself (→ `/01_strategy`; this workspace only schedules the refresh)
- How content is made or the content calendar itself (→ `/06_marketing/content-machine/`; this workspace only verifies it shipped)
- Email sequence copy or Customer.io campaign build (→ `/07_sales` and `/09_website-app/frontend/email-templates/`)
- A parallel markdown copy of the live task list (→ ClickUp is canonical)
- Compliance sign-off (→ `/03_compliance`)
