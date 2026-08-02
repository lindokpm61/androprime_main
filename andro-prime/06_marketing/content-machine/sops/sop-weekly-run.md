# SOP: The Weekly Run

**The recurring operating cadence: what the agent prepares, what Keith records and approves, what ships when.** Read `unified-content-calendar.md` first.

**Run it with `/content-week`.** This SOP is the specification; the `/content-week` skill (`.claude/skills/content-week/SKILL.md`) is its executable form and does every agent step below in order, with the gates enforced. Run the skill, not this file by hand. **If the two ever disagree, fix both:** the skill drifting from this SOP is how the process quietly stops matching what actually happens.

**Trigger:** start of each content week (or the sprint cadence Keith prefers).

**Roles:** agent prepares and schedules; Keith records and presses go; Ewa clears net-new claims.

**Where the week's state lives (changed 2026-08-01, Phase 1).** Every status this SOP moves an asset through is a row in `content_assets` / `content_renditions`, not a field in the asset file. The file holds the identity and the craft; the database holds where it has got to, and the gates that stop it going further are a CHECK constraint and a trigger in `09_website-app/database/migrations/20260801_content_state_guards.sql`. So a step below that says "mark it approved" means one gate-checked UPDATE, run through `/content-status`, and never an edit to frontmatter. **If Supabase is unreachable, the week's board cannot be drawn and the honest move is to say so**, not to reconstruct it from the generated blocks in the files: those are a mirror written by `content-sync` and a mirror cannot report that it is stale.

---

## The two lanes (added 2026-07-28)

The week runs in two independent lanes, and **the camera lane must never block the no-camera lane**:

- **Lane 1, no camera:** LinkedIn, Facebook, Substack, all atomised from published Ewa-signed articles. **Runs every week unconditionally**, whether or not Keith films anything.
- **Lane 2, camera:** short-form video and YouTube long-form. Batched into a booked filming day; skipped cleanly when no day is booked.

This split exists because the original single-lane design put Keith's recording in the critical path of every week, and the machine produced nothing for three weeks as a result. A week where only Lane 1 ran is a normal week, not a miss. The queue for both lanes is `content-queue.md`.

---

## Start of week (agent)

1. **Run `/content-status`** to see the board: pipeline by status, renditions by platform, TOFU/MOFU balance, and any stale assets. Then **read the state:** `content-queue.md` + `unified-content-calendar.md` + this workspace's `STATE.md` + the blog `content-calendar.md` + the ClickUp board. Note the wellness-floor tally and the TRT gate. **Stale assets get picked before new ones**; work already drafted is work already paid for. Staleness is `content_assets.updated_at`, not the file's modification time: a file touched by a `content-sync` run has not moved an inch up the pipeline, and reading mtime as progress would make the mirror look like work.
2. **Pick the week from `content-queue.md`.** Which pillar(s) publish (blog calendar), which queued rows are ready, and which founder-journey / series beat is due. Never start from a blank page: if Lane 1 has fewer than 8 queued rows, refill the queue first (its Refill rule says how).
3. **Draft Lane 1 (always).** LinkedIn and Facebook posts via `/script <angle> linkedin|facebook`; the Substack issue is a pick from the already-pushed drafts, not new writing. Then, **only if a filming day is booked**, draft Lane 2 (`sop-atomise-pillar.md` for the week's pillar, `sop-founder-short-form.md` for founder shorts). Batch Lane 2 to what one session can actually shoot.
4. **Run the compliance route on every asset** (`sop-compliance-route.md`) before anything reaches Keith to record. Queue any 🟠 to Ewa (ClickUp `901218140081`) early in the week so sign-off is not the bottleneck.

## Mid-week (Keith)

5. **Record (Lane 2 only, on the booked day).** Batch 2-3 explainers / shorts in one session to stay ahead. Approve the drafted LinkedIn / Facebook posts in his voice; those ship whether or not the shoot happened.
6. **Produce / approve thumbnails** (`sop-thumbnail.md`).

## End of week (agent, then Keith)

7. **Schedule** the cleared, thumbnailed assets across the week per the calendar. Wire CTAs via `kitCTA`; wire any email via `/cio-sequence-build` (stays draft until Keith activates). The database refuses a rendition that reaches `scheduled` while its asset is unapproved, while its canonical article is unpublished, or without its thumbnail, so a refused write here is the gate working: find the missing condition, never route around it.
8. **Keith presses go** on each platform. Nothing auto-posts or auto-sends.
9. **Pull last week's numbers** (platform-native until GA4 live) into the KPI view; note what to repeat or drop. Update `STATE.md` if live status changed (accounts launched, a pillar atomised, GA4 connected).

---

## Guardrails carried every week

- Wellness floor ~40%. **TRT stays ~0%** (Phase 0 boundary, not a sign-off question). **Andropause is now in the mix**: CA-028 approved 2026-07-26, and it is the largest shelf in the 2026-07-26 frustration plan, so weight it deliberately rather than leaving it at zero by habit. Each asset still needs Ewa's per-asset sight.
- Consistency over volume: miss a slot rather than ship off-voice or non-compliant, but do not go dark.
- Every go is Keith's. Every asset passed pre-flight. No derivative exceeds its canonical asset.

## Definition of done (per week)

- **Lane 1 ran.** This is the non-negotiable one: a week where no LinkedIn / Facebook / Substack was drafted and pre-flighted is a failed week, whatever happened with the camera.
- The week's assets drafted, pre-flighted, thumbnailed, scheduled.
- Lane 2 either produced against a booked filming day, or was explicitly skipped with its rows left queued. Silently skipping it is what let two assets sit stale for 19 days.
- Keith recorded and gave go; Ewa cleared anything net-new.
- Queue rows marked `taken` with their asset slugs; numbers pulled; `STATE.md` updated if status moved.
