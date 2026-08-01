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

`content-doctor` asserts eight cross-store invariants between the repo, Supabase and the live channels, and it is the mechanical half of this SOP. Run it before anything else: it is cheap, it needs no judgement, and it tells you where to look. The invariants and the reasoning behind each are in `06_marketing/content-machine/content-pipeline-automation-plan.md` section 5 Phase 0, which owns the definition of "correct"; this SOP only runs it and routes what it finds.

**Read the exit code correctly, because getting this wrong in either direction is how the check dies:**

| Result | Meaning | Do |
| --- | --- | --- |
| exit 2 | one or more invariants FAILED | act, route per the sections below |
| exit 3, `unchecked_unexpected: 0` | **the expected baseline today.** No failures; invariant 3 cannot run because no Metricool credential exists | carry on, this is green |
| exit 3, `unchecked_unexpected > 0` | something could not be measured that normally can | **treat as an alarm**, not as a pass |
| exit 0 | fully clean | not reachable until a Metricool credential exists |
| exit 1 | the doctor itself crashed | fix the doctor; you have no reading this week |

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
- Check the gate scanner did its job: no `approved` asset without a green `/compliance-preflight` plus a canonical asset, and nothing published that skipped the pre-flight. Ewa's queue is the ClickUp "Content Review: Ewa" list `901218140081`; a published item with no corresponding sign-off is a hard flag.
- **The go button is always Keith's:** confirm nothing auto-published without an explicit human go.

---

## What good looks like

- Everything the calendar promised for the week either shipped or has a logged reason it slipped (a ClickUp task), with no silent misses.
- No item went live that skipped compliance pre-flight or an Ewa claims sign-off it needed.
- No derivative introduced a claim its canonical asset does not make.
- `/content-status` matches reality on the live channels (the tracker is not lying about what posted). **This bullet is the one this SOP historically failed at**, because it asked a human to compare three stores by eye and nothing enforced it. Step 0 is now the mechanical form of it: the doctor either says the stores agree or names every place they do not. The bullet is satisfied when the doctor exits 2 with zero findings outstanding, or exits 3 with `unchecked_unexpected: 0`.

---

## Routing gaps

- A missed publish, a stuck draft, or a calendar item with no output: open a ClickUp task against `06_marketing/content-machine`. Do not fix content here.
- A live item that skipped a gate (published without sign-off, a net-new claim not re-cleared, a compliance breach in copy): this is a compliance issue: route to `03_compliance` and `06_marketing` and treat a live breach as an incident (`sops/incident-runbook.md`).
- Point every routed gap back at the content machine as the source of truth for what was due and what "shipped" means; this SOP only confirms it happened.
