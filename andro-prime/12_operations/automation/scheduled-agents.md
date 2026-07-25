# Automation: Scheduled Agents

**Purpose:** Record which operational cadences are automated (via a scheduled cloud agent or an interval loop) versus still run by hand, so it is always clear what fires on its own and what a human must remember.

**Current status: all cadences are MANUAL.** No cadence in `cadences/` is yet wired to a schedule; each is run by a person and its status logged in ClickUp (`workspace_id: "90121729875"`).

**Tooling when automating:**
- The `schedule` skill stands up a recurring cadence as a cron-scheduled cloud agent (a routine).
- The `loop` skill runs a check on an interval within a session (e.g. poll a status).

When a cadence is moved onto a schedule, record here: which cadence, the schedule/cron, the skill used, and that ClickUp remains the system of record for run status. Automating a check must not create a parallel status store outside ClickUp.

Status: to be drafted (populate as cadences are automated; all manual today).
