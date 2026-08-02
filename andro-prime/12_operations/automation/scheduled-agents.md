# Automation: Scheduled Agents

**Purpose:** Record which operational cadences are automated (via a scheduled cloud agent or an interval loop) versus still run by hand, so it is always clear what fires on its own and what a human must remember.

**Current status: one cadence is automated, the rest are MANUAL.** `content-doctor` runs nightly on Windows Task Scheduler from 2026-08-01 (below). No cadence in `cadences/` is otherwise wired to a schedule; each is run by a person and its status logged in ClickUp (`workspace_id: "90121729875"`). **Zero claude.ai routines exist** (`RemoteTrigger list` returns empty, checked 2026-08-01), and that is a design outcome rather than a gap: see the routing rule below.

**Tooling when automating:**

- The `schedule` skill stands up a recurring cadence as a cron-scheduled cloud agent (a routine). **Note what a routine is and is not:** it runs in Anthropic's cloud with its own git checkout, so it cannot see local files, local binaries or local environment variables, and its minimum interval is one hour. MCP connectors are attached to it explicitly by `connector_uuid`.
- The `loop` skill runs a check on an interval within a session (e.g. poll a status).
- **`CronCreate` is not either of these.** It is session-only and in-memory, dies when the session exits, expires after 7 days and fires only while the REPL is idle. It is not a scheduler for any cadence in this workspace. Recorded because the two are easy to confuse and only one survives closing the laptop.

When a cadence is moved onto a schedule, record here: which cadence, the schedule/cron, the skill used, and that ClickUp remains the system of record for run status. Automating a check must not create a parallel status store outside ClickUp.

---

## AUTOMATED: `content-doctor` (nightly) — the first cadence off manual

**Registered 2026-08-01.** Windows Task Scheduler, not a claude.ai routine (reason below).

| | |
| --- | --- |
| Task name | `AndroPrime content-doctor nightly` |
| Runs | `content-doctor-cron.cmd`, which pins its own cwd and calls `content-doctor-cron.ts --log` |
| Cadence | daily 02:30 local, **`StartWhenAvailable: true`** |
| Log | `%LOCALAPPDATA%\andro-prime\content-doctor.log` (UTF-8; read it with `Get-Content -Encoding UTF8` or it looks like mojibake) |
| Owner of "correct" | `06_marketing/content-machine/content-pipeline-automation-plan.md` §5 Phase 0 |
| Verified | end to end 2026-08-01: invoked as the task invokes it, no alarm, `agent_runs` row written. Exit 3 at registration; **exit 0 from 2026-08-01** once invariant 3 got its Metricool credential |

**`StartWhenAvailable` is the point, not a detail.** A plain `schtasks /SC DAILY /ST 02:30` runs only if the machine is awake at 02:30; if it is asleep the run is **skipped with no error and no log line**, and a check that never fires is indistinguishable from a check that passes. That is the exact failure this cadence exists to end, so it was registered via PowerShell (`New-ScheduledTaskSettingsSet -StartWhenAvailable`) rather than `schtasks`, which cannot set it.

**Operational gotcha on this machine: the Task Scheduler enumeration API is broken.** `Get-ScheduledTask`, the `Schedule.Service` COM object and `schtasks /Query` all fail with `0x8007054F` (internal error) — for *every* task, not just this one, so it is a pre-existing machine condition. **Verify the task by reading its definition on disk instead:** `C:\Windows\System32\Tasks\AndroPrime content-doctor nightly` is XML and readable. Do not conclude from a failed `Get-ScheduledTask` that the task is missing.

**Alarm condition, and it is not `$?`:** fire on `exit_code === 2` **or** `summary.unchecked_unexpected > 0`. A cadence alarming on any non-zero exit would fire every night forever, and a check that always alarms is a check nobody reads. **The baseline is exit 0 as of 2026-08-01** (it was exit 3 while invariant 3 had no Metricool credential); exit 3 with `unchecked_unexpected: 0` stays non-alarming, but it is no longer routine and is worth reading. Note the rule needed no edit when that gap closed: it keys on whether a gap is EXPECTED, never on which invariant produced it. That is not hypothetical here: `sops/content-machine-verification.md` carried a verification bullet that was never once run in its entire life, and this entry exists partly to stop its automated successor dying the same way.

**Why it is NOT a claude.ai routine, and cannot become one as a script** (settled 2026-08-01, after checking rather than assuming). The routine create API has **no env or secrets field**, and a cloud checkout has no `.env.local` because it is gitignored, so there is no route by which `SUPABASE_SERVICE_ROLE_KEY` reaches the process. MCP connectors do not close the gap: **a connector is reachable by an agent, not by a node process.** Rebuilding the nine invariants as agent prompts would discard **the entire deterministic suite** (189 tests on 2026-08-02: 126 doctor + 38 content-sync + 25 cron. **Take the figure from a run, not from this line** — it grew twice in two days, and a count quoted in prose is a second copy of a fact nothing watches) and reintroduce the non-determinism the script exists to remove, which is never a good trade for a gate.

**So it runs machine-side, on Windows Task Scheduler.** That is not a downgrade: the general rule is **put determinism where the stakes are.** A gate that decides whether something ships must be a tested script, and a tested script must run where its credentials live. Plumbing that only moves an already-approved thing along can be agent work in the cloud, because a wrong answer there is visible and reversible.

Trade-off, stated plainly: the doctor only runs while Keith's machine is on. For a nightly drift check that is acceptable — a missed night is a day of drift, not a broken gate — and the weekly SOP run catches what a missed night would not.

**This does not become a parallel status store.** The doctor writes no findings file and keeps no backlog: it prints and exits. A red invariant opens a **ClickUp task**, which remains the system of record. The one write it can make is `--log`, a single telemetry row in `agent_runs`, off by default. Note `agent_runs.status` is a three-value enum, so exits 2 and 3 both record as `blocked`, discriminated by `detail.outcome`; separating them properly needs `ALTER TYPE agent_run_status ADD VALUE 'incomplete'`, which is **an open decision for Keith**, not something to do quietly.
