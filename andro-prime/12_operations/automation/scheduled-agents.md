# Automation: Scheduled Agents

**Purpose:** Record which operational cadences are automated (via a scheduled cloud agent or an interval loop) versus still run by hand, so it is always clear what fires on its own and what a human must remember.

**Current status: all cadences are MANUAL.** No cadence in `cadences/` is yet wired to a schedule; each is run by a person and its status logged in ClickUp (`workspace_id: "90121729875"`). Verified 2026-08-01: `RemoteTrigger list` returns zero routines, so this line is measured rather than assumed.

**Tooling when automating:**

- The `schedule` skill stands up a recurring cadence as a cron-scheduled cloud agent (a routine). **Note what a routine is and is not:** it runs in Anthropic's cloud with its own git checkout, so it cannot see local files, local binaries or local environment variables, and its minimum interval is one hour. MCP connectors are attached to it explicitly by `connector_uuid`.
- The `loop` skill runs a check on an interval within a session (e.g. poll a status).
- **`CronCreate` is not either of these.** It is session-only and in-memory, dies when the session exits, expires after 7 days and fires only while the REPL is idle. It is not a scheduler for any cadence in this workspace. Recorded because the two are easy to confuse and only one survives closing the laptop.

When a cadence is moved onto a schedule, record here: which cadence, the schedule/cron, the skill used, and that ClickUp remains the system of record for run status. Automating a check must not create a parallel status store outside ClickUp.

---

## Queued to automate: `content-doctor` (nightly)

**Built 2026-08-01, not yet scheduled.** The first candidate to move off manual, and the reason to be careful about how.

| | |
| --- | --- |
| Runs | `npx tsx scripts/content-engine/content-doctor.ts --json` from `09_website-app/frontend` |
| Cadence | nightly; also run by hand as step 0 of `sops/content-machine-verification.md` |
| Owner of "correct" | `06_marketing/content-machine/content-pipeline-automation-plan.md` §5 Phase 0 |
| Status | **manual today.** Not yet a routine, for the reason below |

**Alarm condition, and it is not `$?`:** fire on `exit_code === 2` **or** `summary.unchecked_unexpected > 0`. Exit 3 with `unchecked_unexpected: 0` is the expected green baseline until a Metricool credential exists, because invariant 3 cannot run without one. A cadence alarming on any non-zero exit would fire every night forever, and a check that always alarms is a check nobody reads. That is not hypothetical here: `sops/content-machine-verification.md` carried a verification bullet that was never once run in its entire life, and this entry exists partly to stop its automated successor dying the same way.

**Why it is not a routine yet.** The script needs `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`, which is gitignored and therefore absent from a cloud checkout. Either inject the secret into the routine config or have the routine assert through the Supabase connector instead of the service-role client. Recorded as open in the plan's section 7.

**This does not become a parallel status store.** The doctor writes no findings file and keeps no backlog: it prints and exits. A red invariant opens a **ClickUp task**, which remains the system of record. The one write it can make is `--log`, a single telemetry row in `agent_runs`, off by default. Note `agent_runs.status` is a three-value enum, so exits 2 and 3 both record as `blocked`, discriminated by `detail.outcome`; separating them properly needs `ALTER TYPE agent_run_status ADD VALUE 'incomplete'`, which is **an open decision for Keith**, not something to do quietly.
