# SOP: Content-Machine Verification

**Runs in:** `cadences/weekly-ops.md` (weekly content pass).
**Purpose:** Confirm the content machine actually **produced and shipped** what its calendar promised for the week, and that the compliance and sign-off gates held before anything went live. This SOP verifies output; it does not make content. The content machine is the source of truth for what was due; gaps route to `06_marketing`.

**Owner:** `06_marketing/content-machine` (owns the calendar, the SOPs, the tracker, and what "shipped" means). This workspace runs the weekly confirmation and routes gaps there.

---

## What the machine produces (context)

The content machine runs CREATE → MANAGE → DISTRIBUTE → MEASURE on two spines: **Spine A** (the owned SEO blog, canonical Ewa-signed pillar articles) and **Spine B** (founder short-form / LinkedIn / YouTube / Facebook / Substack, atomised from a canonical asset). One cross-channel calendar (`unified-content-calendar.md`) and one compliance route govern both. Per-idea state for Spine B is tracked as asset files under `content-machine/assets/`, gated by a scanner and rendered by `/content-status`.

**The non-negotiable it enforces:** every derivative is atomised from a canonical, Ewa-signed asset and may not introduce a claim that asset does not already make. That is the gate this SOP verifies held.

---

## How to verify (weekly)

### 0. Run the doctor first

```bash
cd andro-prime/09_website-app/frontend
npx tsx scripts/content-engine/content-doctor.ts
```

`content-doctor` asserts **nine** cross-store invariants between the repo, Supabase and the live channels, and it is the mechanical half of this SOP. (Nine since 2026-08-01, when Phase 1 added I9: no asset file's frontmatter may carry a key the database owns. **Take the count from the run, not from this line** — the report prints it, and if the two disagree the run is right and this SOP is stale.) Run it before anything else: it is cheap, it needs no judgement, and it tells you where to look. The invariants and the reasoning behind each are in `06_marketing/content-machine/content-pipeline-automation-plan.md` section 5 Phase 0, which owns the definition of "correct"; this SOP only runs it and routes what it finds.

**Read the exit code correctly, because getting this wrong in either direction is how the check dies:**

| Result | Meaning | Do |
| --- | --- | --- |
| exit 2 | one or more invariants FAILED | act, route per the sections below |
| exit 0 | **the baseline since 2026-08-01.** Every invariant measured, every one holds | carry on, this is green |
| exit 3, `unchecked_unexpected: 0` | no failures, but a documented gap reappeared | not an alarm, but read it: this is no longer routine |
| exit 3, `unchecked_unexpected > 0` | something could not be measured that normally can | **treat as an alarm**, not as a pass |
| exit 1 | the doctor itself crashed | fix the doctor; you have no reading this week |

_Exit 3 was the expected baseline until 2026-08-01, because invariant 3 could not run without a Metricool credential. That credential now exists and I3 resolves every Metricool post id against the live scheduler, so a gap is once again worth looking at._

**Do not wire an alarm on `$?` alone.** `if [ $? -ne 0 ]` fires every single night forever, and a check that always alarms is a check nobody reads. `if [ $? -eq 2 ]` silently swallows every future unmeasurable invariant. Read `--json` and alarm on `exit_code === 2` **or** `summary.unchecked_unexpected > 0`.

**An UNCHECKED is not a pass and must never be recorded as one.** The doctor distinguishes PASS, FAIL and UNCHECKED precisely because the failure this whole system keeps having is an unperformed check rendering as a clean one. If you are transcribing its output into a ClickUp comment, carry all three states.

**A red invariant opens a ClickUp task.** The doctor detects; it never fixes, and it deliberately keeps no list of its own. ClickUp is the open-item register (see `../automation/scheduled-agents.md`).

### 1. Run `/content-status`

- Run the `/content-status` skill to render the current content board (asset status, funnel tags, pre-flight result, renditions). This is the pipeline state for founder content.

### 2. Cross-check against the calendar

- Open `06_marketing/content-machine/unified-content-calendar.md`, `content-queue.md` and its `STATE.md`. Compare what the calendar said was due this week (blog slot, founder short-form, LinkedIn/Facebook/Substack repurpose) against what `/content-status` and the live surfaces actually show.
- **Judge the two lanes differently.** The week runs `/content-week` in two lanes. **Lane 1 (no camera: LinkedIn / Facebook / Substack) is due every week unconditionally; a week with no Lane 1 output is a real gap.** **Lane 2 (camera: shorts, YouTube) is due only when a filming day was booked**, so a Lane-2-empty week is not a miss by itself, provided its rows stayed `queued` rather than being drafted and abandoned. Assets drafted for a shoot that never happened, sitting at `scripted` past 14 days, are the failure mode to flag here.

### 3. Verify drafts moved to published where due

- **Spine A (blog):** confirm any article due this week actually flipped to `status: published` and is live at `/blog/<slug>` (publish is a DB write + revalidation, no redeploy). A slot that stayed `draft` past its date is a gap.
- **Spine B (founder/social):** confirm assets that were due to ship advanced to `scheduled`/published in the tracker and are actually posted on the channel, not stuck at `scripted`/`approved`.

### 4. Confirm the Ewa sign-off gate was respected

- Nothing goes live without the gate: a canonical blog article needs Ewa's claims sign-off before `published`; a founder derivative that introduces a **net-new claim** goes back for re-clearance; a claim-clean derivative inherits its canonical asset's approval with no fresh Ewa step.
- **The approval gate is a database CHECK constraint, not the scanner's job** (changed 2026-08-01 by Phase 1; `09_website-app/database/migrations/20260801_content_state_guards.sql`). `content_assets_approval_gate` refuses `approved` / `done` unless the row took one of two routes: `preflight = 'green'` with a canonical article to inherit clearance from, or `preflight = 'amber-ewa'` with `ewa_signed_at` recorded. It fires on `INSERT` as well as `UPDATE`, so there is nothing for a human to re-verify by eye here and **you cannot check it by reading asset frontmatter, which no longer holds any of those fields.** `content-doctor` invariant 5 is the weekly reading on it: it fails when an `amber-ewa` asset was merely _routed_ to Ewa rather than ruled on. Ewa's queue is the ClickUp "Content Review: Ewa" list `901218140081`; a published item with no corresponding sign-off is a hard flag.
- What is still a genuine human check: that nothing published skipped a pre-flight it needed, and that no derivative introduced a claim its canonical asset does not make. No constraint can read copy.
- **The go button is always Keith's:** confirm nothing auto-published without an explicit human go.

---

## What good looks like

- Everything the calendar promised for the week either shipped or has a logged reason it slipped (a ClickUp task), with no silent misses.
- No item went live that skipped compliance pre-flight or an Ewa claims sign-off it needed.
- No derivative introduced a claim its canonical asset does not make.
- `/content-status` matches reality on the live channels (the tracker is not lying about what posted). **This bullet is the one this SOP historically failed at**, because it asked a human to compare three stores by eye and nothing enforced it. Step 0 is now the mechanical form of it: the doctor either says the stores agree or names every place they do not. **The bullet is satisfied by exit 0 and by nothing else.** Exit 3 with `unchecked_unexpected: 0` is not a miss worth an alarm, but it is not this bullet satisfied either: an invariant that did not run has not agreed with anything, and recording an UNCHECKED as a pass is the single failure this whole SOP exists to stop. **Exit 2 is a FAIL** (see the table above) and can never satisfy it. _This sentence previously read "satisfied when the doctor exits 2 with zero findings outstanding, or exits 3 with `unchecked_unexpected: 0`", which told an operator to accept a failing run as good and did not list the actual green state at all. Corrected 2026-08-01._

---

## Routing gaps

- A missed publish, a stuck draft, or a calendar item with no output: open a ClickUp task against `06_marketing/content-machine`. Do not fix content here.
- A live item that skipped a gate (published without sign-off, a net-new claim not re-cleared, a compliance breach in copy): this is a compliance issue: route to `03_compliance` and `06_marketing` and treat a live breach as an incident (`sops/incident-runbook.md`).
- Point every routed gap back at the content machine as the source of truth for what was due and what "shipped" means; this SOP only confirms it happened.
