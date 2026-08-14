# Automation: Scheduled Agents

**Purpose:** Record which operational cadences are automated (via a scheduled cloud agent or an interval loop) versus still run by hand, so it is always clear what fires on its own and what a human must remember.

**Current status: four cadences are automated, the rest are MANUAL.** `content-doctor` runs nightly, `doctor-heartbeat` runs daily, `metricool-writeback` runs daily at 07:00 and `metricool-metrics` daily at 07:15 (the last two added 2026-08-14), all on Windows Task Scheduler. **The 07:00 / 07:15 order is a dependency, not a preference:** metrics join on the platform post id that the write-back records. **The doctor was registered 2026-08-01 and did not actually run until 2026-08-05** — a silent four-day outage caused by the action-string trap documented below; read that before registering any new cadence here. The heartbeat exists because of that outage.

**A third job is BUILT but deliberately NOT scheduled: `metricool-schedule`.** It pushes approved, slotted renditions to Metricool as drafts and reconciles the ids back. Run it by hand (`npx tsx scripts/content-engine/metricool-schedule.ts`, `--dry-run` to preview) until Keith rules on whether it should fire on its own. Putting it on a timer means drafts appear in the calendar with no human in the loop, which is the plan's stated intent (§7.1: "once Ewa nods, it schedules itself", with the draft-to-live flip staying human) but is an outward-facing automation and therefore his call, not a default. No cadence in `cadences/` is otherwise wired to a schedule; each is run by a person and its status logged in ClickUp (`workspace_id: "90121729875"`). **Zero claude.ai routines exist** (`RemoteTrigger list` returns empty, checked 2026-08-01), and that is a design outcome rather than a gap: see the routing rule below.

**`metricool-writeback` was SCHEDULED on 2026-08-14 (Keith's ruling), and the reasoning is worth keeping.** It asks Metricool what actually went out and records it: rendition to `published`, with `published_at` and the platform's own live URL. **It was safe to put on a timer where `metricool-schedule` is not, because it never creates, edits or publishes anything** — it only reads Metricool and writes our own database, so the "outward-facing automation is Keith's call" reasoning above does not apply to it. Its first run recorded eight posts that had published days earlier with nothing writing back, taking invariant I4 from red to zero violations for the first time since 2026-08-03. Full detail in its own section below.

🔴 **A defect this work exposed, and it affects the "Last Run Result" column you are told to trust.** `metricool-schedule.ts` called `process.exit(code)`, which on this machine crashes Node with a libuv assertion (`!(handle->flags & UV_HANDLE_CLOSING)`, async.c:76) and returns **-1073740791 instead of the intended exit code**, reproducibly on every run. So its documented codes (0 sent / 2 failed / 3 refused) never reached the caller, and "work owed" was indistinguishable from "crashed". Fixed 2026-08-14 in both Metricool jobs by setting `process.exitCode` and letting the process end naturally; after the fix `metricool-schedule --dry-run` exits 3 and surfaces a refusal that the crash had been hiding. **`content-doctor-cron.ts` was checked at the same time and exits cleanly (verified: exit 2), so the nightly cadence's codes were never affected.** Before trusting any new job's exit code here, run it twice and read the code, because a crash code and a real code look identical in a task history.

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

## AUTOMATED: `metricool-metrics` (daily 07:15) — the first job that measures an OUTCOME

**Registered 2026-08-14 and verified by the scheduler firing it unattended**, not by a hand run:
the one-off trigger fired at 11:38:29Z with nobody present and left both signals, a log line and an
`agent_runs` row (`status: ok`, `exit_code: 0`, 9 captured).

| | |
| --- | --- |
| Task name | `AndroPrime metricool-metrics` |
| Runs | `metricool-metrics-cron.cmd`, which pins its own cwd and calls `metricool-metrics.ts --log` |
| Action string | `cmd.exe /c call "<path>\metricool-metrics-cron.cmd" >> "<log>" 2>&1` — **the `call` is load-bearing, see the doctor's section** |
| Schedule | Daily 07:15 local, `StartWhenAvailable` |
| Log | `%LOCALAPPDATA%\andro-prime\metricool-metrics.log` |
| Liveness check | `select max(started_at) from agent_runs where agent = 'metricool-metrics'`, or the log's mtime. Never the task definition on disk |

**Registered from XML with a LOCAL StartBoundary** (`2026-08-15T07:15:00`, no `Z`), avoiding the
trap the write-back hit: `New-ScheduledTaskTrigger -Daily` serialises UTC, which would drift the job
an hour after the October clock change. The stored boundary was read back off disk and confirmed
local.

**07:15, fifteen minutes after the write-back, and the order is not arbitrary.** Metrics are joined
to a rendition by the PLATFORM's own post id, which is read out of `external_url`, and
`metricool-writeback` at 07:00 is what records that URL. Reversing the two would leave every post
unmeasurable on its first day.

**Why DAILY, and it is not "to stay current".** The 30-day carousel run compares three closing
slides. Close A's ten posts average run-day 14.5 against close C's 16.5, so comparing running
totals at one moment ranks the closes by publish date. The comparison has to be at a **fixed age**
(saves at seven days), which makes the cadence a correctness requirement rather than a preference.
**A missed reading cannot be backfilled**: Metricool holds running totals, so a number can be
recovered later, but a reading AT an age cannot. The job reports its own seven-day coverage on
every run and **exits 3** if any post passed its mark without a datapoint near it.

**Safe on a timer for the same reason the write-back is:** it only reads Metricool and writes our
own database. It never creates, edits or publishes anything.

🔴 **One thing to check by hand on 2026-08-18.** The Instagram metric field names are unverified,
because nothing had ever published on that account and the analytics endpoint answers 200 with an
empty array. The mapping is candidates; the job prints every unmapped numeric key it sees, so day
1's capture is what confirms or corrects it. Look at the log.

## AUTOMATED: `metricool-writeback` (daily) — the job that closes I4

**Registered 2026-08-14, Keith's ruling, and verified by the scheduler rather than by its
configuration.**

| | |
| --- | --- |
| Task name | `AndroPrime metricool-writeback` |
| Runs | `metricool-writeback-cron.cmd`, which pins its own cwd and calls `metricool-writeback.ts --log` |
| Action string | `cmd.exe /c call "<path>\metricool-writeback-cron.cmd" >> "<log>" 2>&1` — **the `call` is load-bearing, see the doctor's section** |
| Cadence | daily 07:00 **local**, `StartWhenAvailable: true`. Before the 09:00 heartbeat and after the overnight publishing window |
| Log | `%LOCALAPPDATA%\andro-prime\metricool-writeback.log` |
| Liveness check | `select max(started_at) from agent_runs where agent = 'metricool-writeback'`, or the log's mtime. Never the task definition on disk |
| Exit codes | 0 nothing owed · 2 a post IS live but the write-back failed · 3 work owed (a post did not go out, or an id does not match its rendition) · 1 the run itself failed |
| Wrapper verified | 2026-08-14, invoked from `C:\Windows\System32` deliberately: it pinned cwd to `frontend/` and propagated exit 0 |
| Verified | **by the scheduler, unattended, 2026-08-14**: a one-off trigger fired it at 04:06:34 with no human present; it wrote its log and an `agent_runs` row (`status: ok`, `exit_code: 0`). Re-verified after the task was edited |

**Two traps hit while registering this one, both already half-documented above.**

1. **`Unregister-ScheduledTask` fails on this machine with `0x8007054F`**, the same internal error as
   the query API. The doc above says deletion works; it works via **`schtasks /delete /tn "<name>" /f`**,
   not via the PowerShell cmdlet. Worth stating explicitly, because the failed cmdlet then makes
   `Register-ScheduledTask` fail with "Cannot create a file when that file already exists", which
   reads like a different problem entirely.
2. **`New-ScheduledTaskTrigger -Daily -At 07:00` serialises the StartBoundary as UTC** (`...T06:00:00Z`
   in August). A UTC-anchored trigger does not follow the clocks, so it would have fired at 06:00
   local from the October change onward. Corrected by re-registering from XML with a local
   StartBoundary (`2026-08-14T07:00:00`, no `Z`). **Check the stored StartBoundary after registering
   any daily task here**: an hour's drift is harmless for this job and would not be for one that has
   to land inside a window.

**Re-registering from XML is itself a change to the launch path, so it was re-proved.** A second
one-off trigger was added after the edit rather than assuming the action string survived, on the same
principle as the rest of this file: configuration is not evidence.

**Why this one is safe on a timer when `metricool-schedule` is not.** It is read-only against the
outside world. It never creates, edits, publishes or deletes a post; it asks Metricool what already
happened and records that in our own database. The standing concern about outward-facing automation
does not apply, so the cadence is an operational choice rather than a decision about public posting.

**What it refuses to do, and why that matters at 07:00 with nobody watching.** It only marks a
rendition published when the platform itself reports `PUBLISHED`. A slot that has passed while
Metricool still reports pending is a REFUSAL, not a publish — that is the "silently did not go out"
branch invariant I4 could never distinguish from a missing write-back, and recording it as published
would convert a true red into a green lie. It never constructs a URL, never clears an id, and never
touches a rendition it did not schedule.

**First run, 2026-08-14:** eight renditions that had published between 6 and 11 August with nothing
writing back were recorded, with their live URLs. I4 went from red every morning since 2026-08-03 to
zero violations. A second run immediately afterwards did nothing and said so, which is the
idempotency check.

**Registration command** (run once Keith rules on the cadence; `New-ScheduledTask*` rather than
`schtasks`, because only the PowerShell API can set `StartWhenAvailable`):

```powershell
$cmd = "d:\Androprime_main\andro-prime\09_website-app\frontend\scripts\content-engine\metricool-writeback-cron.cmd"
$log = "$env:LOCALAPPDATA\andro-prime\metricool-writeback.log"
New-Item -ItemType Directory -Force (Split-Path $log) | Out-Null
$action  = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c call `"$cmd`" >> `"$log`" 2>&1"
$trigger = New-ScheduledTaskTrigger -Daily -At 07:00
$set     = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName 'AndroPrime metricool-writeback' -Action $action -Trigger $trigger -Settings $set
```

**Then verify it the only way that counts:** wait for it to fire unattended and check
`max(started_at)` in `agent_runs`. Do not read the task XML, and do not use `schtasks /run` — both
produced a false green for four days on the doctor.

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
