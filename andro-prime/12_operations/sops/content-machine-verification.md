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

### 1. Run `/content-status`

- Run the `/content-status` skill to render the current content board (asset status, funnel tags, pre-flight result, renditions). This is the pipeline state for founder content.

### 2. Cross-check against the calendar

- Open `06_marketing/content-machine/unified-content-calendar.md` and its `STATE.md`. Compare what the calendar said was due this week (blog slot, founder short-form, LinkedIn/Facebook/Substack repurpose) against what `/content-status` and the live surfaces actually show.

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
- `/content-status` matches reality on the live channels (the tracker is not lying about what posted).

---

## Routing gaps

- A missed publish, a stuck draft, or a calendar item with no output: open a ClickUp task against `06_marketing/content-machine`. Do not fix content here.
- A live item that skipped a gate (published without sign-off, a net-new claim not re-cleared, a compliance breach in copy): this is a compliance issue: route to `03_compliance` and `06_marketing` and treat a live breach as an incident (`sops/incident-runbook.md`).
- Point every routed gap back at the content machine as the source of truth for what was due and what "shipped" means; this SOP only confirms it happened.
