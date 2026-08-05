# Automation: Scheduled Agents

**Purpose:** Record which operational cadences are automated (via a scheduled cloud agent or an interval loop) versus still run by hand, so it is always clear what fires on its own and what a human must remember.

**Current status: two cadences are automated, the rest are MANUAL.** `content-doctor` runs nightly and `doctor-heartbeat` runs daily, both on Windows Task Scheduler. **The doctor was registered 2026-08-01 and did not actually run until 2026-08-05** — a silent four-day outage caused by the action-string trap documented below; read that before registering any new cadence here. The heartbeat exists because of that outage.

**A third job is BUILT but deliberately NOT scheduled: `metricool-schedule`.** It pushes approved, slotted renditions to Metricool as drafts and reconciles the ids back. Run it by hand (`npx tsx scripts/content-engine/metricool-schedule.ts`, `--dry-run` to preview) until Keith rules on whether it should fire on its own. Putting it on a timer means drafts appear in the calendar with no human in the loop, which is the plan's stated intent (§7.1: "once Ewa nods, it schedules itself", with the draft-to-live flip staying human) but is an outward-facing automation and therefore his call, not a default. No cadence in `cadences/` is otherwise wired to a schedule; each is run by a person and its status logged in ClickUp (`workspace_id: "90121729875"`). **Zero claude.ai routines exist** (`RemoteTrigger list` returns empty, checked 2026-08-01), and that is a design outcome rather than a gap: see the routing rule below.

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
| Action string | `cmd.exe /c call "<path>\content-doctor-cron.cmd" >> "<log>" 2>&1` — **the `call` is load-bearing, see below** |
| Cadence | daily 02:30 local, **`StartWhenAvailable: true`** |
| Log | `%LOCALAPPDATA%\andro-prime\content-doctor.log` (UTF-8; read it with `Get-Content -Encoding UTF8` or it looks like mojibake) |
| Owner of "correct" | `06_marketing/content-machine/content-pipeline-automation-plan.md` §5 Phase 0 |
| Liveness check | **the log's modification time, or `select max(started_at) from agent_runs where agent = 'content-doctor'`.** Older than ~26 hours means the cadence is dead. Nothing else counts as evidence it is running |
| Verified | **by the scheduler, unattended, 2026-08-05**: a short-dated one-off trigger fired it with no human present and its own `agent_runs` row plus log entry appeared. The 2026-08-01 "verified end to end" was a hand run and was not end to end (below) |

**THE ACTION STRING IS NOT A DETAIL, AND THE WRONG FORM FAILS SILENTLY. Registered 2026-08-01, this cadence did not run once until 2026-08-05.** The original action was `cmd.exe /c "<path>\content-doctor-cron.cmd" >> "<log>" 2>&1`. When the string after `/c` **begins with a quote**, `cmd.exe` strips the outermost quote pair of the whole remaining string, which turns that action into a command with an unbalanced quote. It fails *before* the redirect is set up, so it writes **no log line, no error, and no output anywhere** — the job simply never starts. Proven by isolation on 2026-08-05: an identical task whose action began with `call` fired on time, and the leading-quote form did not, four times over.

**Use one of two forms, never a bare leading quote:**

- `cmd.exe /c call "<script>" >> "<log>" 2>&1` — preferred, because the string after `/c` starts with `call`, so the stripping rule cannot engage.
- `cmd.exe /s /c ""<script>" >> "<log>" 2>&1"` — the extra outer pair plus `/s` also works.

**"Verified end to end: invoked as the task invokes it" (2026-08-01) was not.** The wrapper was run from a shell, its exit code read and its `agent_runs` row observed, and every one of those observations was true. The scheduler does not run a shell: it parses an action string and launches the process itself, and that parsing was the broken layer. A hand run cannot reach it. **The final verification of any scheduled job here must be done BY the scheduler** — register a one-off trigger a couple of minutes out, walk away, then confirm the job's own artefact appeared.

**`StartWhenAvailable` is the point, not a detail.** A plain `schtasks /SC DAILY /ST 02:30` runs only if the machine is awake at 02:30; if it is asleep the run is **skipped with no error and no log line**, and a check that never fires is indistinguishable from a check that passes. That is the exact failure this cadence exists to end, so it was registered via PowerShell (`New-ScheduledTaskSettingsSet -StartWhenAvailable`) rather than `schtasks`, which cannot set it.

**Operational gotcha on this machine: the Task Scheduler QUERY API is broken, and only the query API.** `Get-ScheduledTask`, the `Schedule.Service` COM object and `schtasks /Query` all fail with `0x8007054F` (internal error) — for *every* task, so it is a pre-existing machine condition. **Registration, execution and deletion all work normally**: `Register-ScheduledTask` and `schtasks /delete /f` both succeed, and tasks fire on time. Do not conclude from a failed query that the task is missing or that the scheduler is dead; both were wrongly inferred here.

**But do NOT verify the task by reading its definition on disk. That check produced a false green for four days.** `C:\Windows\System32\Tasks\<name>` is readable XML, and on 2026-08-05 it was present, `Enabled`, correctly triggered and completely inert — the job had never executed once. The definition file records what was *asked for*; it is not what the engine runs, and it cannot show you a job that fails at launch. Worse, `schtasks /run` returns `SUCCESS` while launching nothing, so an on-demand run is not evidence either. **Existence, enabled-state, a correct trigger and a successful "run now" are all configuration evidence, and none of them is evidence the job runs.** Use the liveness check in the table above: the log's mtime, or `max(started_at)` in `agent_runs`.

**Alarm condition, and it is not `$?`:** fire on `exit_code === 2` **or** `summary.unchecked_unexpected > 0`. A cadence alarming on any non-zero exit would fire every night forever, and a check that always alarms is a check nobody reads. **The baseline is exit 0 as of 2026-08-01** (it was exit 3 while invariant 3 had no Metricool credential); exit 3 with `unchecked_unexpected: 0` stays non-alarming, but it is no longer routine and is worth reading. Note the rule needed no edit when that gap closed: it keys on whether a gap is EXPECTED, never on which invariant produced it. That is not hypothetical here: `sops/content-machine-verification.md` carried a verification bullet that was never once run in its entire life, and this entry exists partly to stop its automated successor dying the same way.

**Why it is NOT a claude.ai routine, and cannot become one as a script** (settled 2026-08-01, after checking rather than assuming). The routine create API has **no env or secrets field**, and a cloud checkout has no `.env.local` because it is gitignored, so there is no route by which `SUPABASE_SERVICE_ROLE_KEY` reaches the process. MCP connectors do not close the gap: **a connector is reachable by an agent, not by a node process.** Rebuilding the nine invariants as agent prompts would discard **the entire deterministic suite** (189 tests on 2026-08-02: 126 doctor + 38 content-sync + 25 cron. **Take the figure from a run, not from this line** — it grew twice in two days, and a count quoted in prose is a second copy of a fact nothing watches) and reintroduce the non-determinism the script exists to remove, which is never a good trade for a gate.

**So it runs machine-side, on Windows Task Scheduler.** That is not a downgrade: the general rule is **put determinism where the stakes are.** A gate that decides whether something ships must be a tested script, and a tested script must run where its credentials live. Plumbing that only moves an already-approved thing along can be agent work in the cloud, because a wrong answer there is visible and reversible.

Trade-off, stated plainly: the doctor only runs while Keith's machine is on. For a nightly drift check that is acceptable — a missed night is a day of drift, not a broken gate — and the weekly SOP run catches what a missed night would not.

**This does not become a parallel status store.** The doctor writes no findings file and keeps no backlog: it prints and exits. A red invariant opens a **ClickUp task**, which remains the system of record. The one write it can make is `--log`, a single telemetry row in `agent_runs`, off by default. Note `agent_runs.status` is a three-value enum, so exits 2 and 3 both record as `blocked`, discriminated by `detail.outcome`; separating them properly needs `ALTER TYPE agent_run_status ADD VALUE 'incomplete'`, which is **an open decision for Keith**, not something to do quietly.

---

## AUTOMATED: `doctor-heartbeat` (daily) — the thing that watches the watcher

**Registered 2026-08-05, and it exists because of a real four-day outage, not as belt and braces.**

| | |
| --- | --- |
| Task name | `AndroPrime content-doctor heartbeat` |
| Runs | `doctor-heartbeat-cron.cmd`, which pins its own cwd and calls `doctor-heartbeat.ts --log` |
| Action string | `cmd.exe /c call "<path>\doctor-heartbeat-cron.cmd" >> "<log>" 2>&1` — **`call` is load-bearing** |
| Cadence | daily 09:00 local, `StartWhenAvailable: true`. After the doctor's 02:30, so a missed night is caught the same morning |
| Log | `%LOCALAPPDATA%\andro-prime\doctor-heartbeat.log` |
| Liveness check | its own `agent_runs` rows (`agent = 'doctor-heartbeat'`) |
| Verified | **by the scheduler, unattended, 2026-08-05**: a one-off trigger fired it at 02:51:00 with no human present, and it wrote its log and reported ALIVE |

**What it checks is ABSENCE, not findings.** It never reads an invariant and must never call, import or start the doctor — a monitor that starts the thing it monitors cannot report that thing's death. It asks one question: did the doctor leave a trace inside the last **26 hours** (the daily cadence plus two hours' grace)?

**Two independent signals, freshest wins.** `agent_runs` survives the machine being rebuilt; the cron log's mtime survives the database being unreachable and catches a doctor that ran but died before it could log. A run that left neither did not happen.

**Three outcomes, never two.** `alive` (exit 0), `stale`/`never-run` (exit 2, opens or comments one deduplicated ClickUp task on Sprint `901217968514`), and `unknown` (exit 1) when the heartbeat itself could not be taken. **`unknown` never opens a task**: a heartbeat that could not be read is not evidence of death, and treating it as one is how an alarm earns its reputation for crying wolf. Same three-way discipline as the doctor's PASS / FAIL / UNCHECKED. On recovery it comments and **does not auto-close** — a task that closes itself is indistinguishable from nobody looking, and this alarm means nobody was looking.

**The alarm body names the fix**, because the fix is not obvious and has already cost four nights: it tells the reader to check the action string for the leading-quote trap, and explicitly forbids the two verifications that produced a false green (reading the task XML, running the wrapper from a shell).

**HONEST LIMIT, and it is not closed.** The heartbeat runs on the same machine and the same scheduler as the thing it watches, so a total Task Scheduler failure takes both. It closes the observed failure — one task with a malformed action string — and narrows the rest. **The only complete answer is an off-machine check, which does not exist.** Until it does, the residual is real: read the `AGE` line, or query `select max(started_at) from agent_runs where agent = 'content-doctor'`.
