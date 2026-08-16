# Unified Content Calendar

**Owner:** Keith Antony | **Status:** Framework v1, 2026-07-06 | **Read first:** `CONTEXT.md`

The manage layer: one cross-channel cadence and one status model, so nothing is tracked in three places at once. This does not replace the blog publication gate (`seo-ai-search/content-calendar.md` stays the source of truth for *which blog article publishes when* and the Mon/Thu flip procedure). It sits above it and adds the founder-brand and atomised channels to the same weekly view.

**Cadence principle (from the platform-reality file):** consistency beats volume. Fewer, better posts out-perform high-frequency dumping on every channel except real-time feeds. The only real penalty is going silent. Keith is the bottleneck, so the cadence below is deliberately sustainable, not maximal. Batch-record to stay ahead.

---

## 1. The weekly rhythm (confirmed by Keith, 2026-07-09)

Anchored on the locked blog cadence (Mon + Thu), with the founder brand and atomised derivatives interleaved. Confirmed as-proposed; revisit only if Keith's recording capacity changes.

| Day | Blog (Spine A) | Founder / social (Spine B) | Email / other |
|---|---|---|---|
| **Mon** | Publish pillar slot (flip per blog calendar) | Reel/Short atomised from the pillar; LinkedIn post | (none) |
| **Tue** | (none) | Facebook native post (older segment) | (none) |
| **Wed** | (none) | Founder-journey short (series) | Newsletter / Substack issue (repurposed from the week's pillar, when due) |
| **Thu** | Publish pillar slot (flip per blog calendar) | Reel/Short + LinkedIn post | (none) |
| **Fri** | (none) | YouTube long-form explainer (1 per published pillar, as ready) | (none) |
| **Sat/Sun** | (none) | Light: one repurposed clip or nothing (do not force it) | (none) |

**Per-channel weekly volume — THE TABLE ABOVE IS THE COUNT.** Read the slots off it rather than off a second list: blog 2 (locked); **LinkedIn 2** (Mon + Thu); **Facebook 1** (Tue); **Substack 1** (Wed, when due); Reels/Shorts up to 2 (Mon/Thu, lane 2); founder-journey short 1 (Wed, lane 2); YouTube long-form ~1 per published pillar, not strictly weekly. Miss a slot rather than ship off-voice or non-compliant, but do not go dark for a week.

> **Corrected 2026-08-16.** This line used to give its own ranges — "LinkedIn ~2-3; Facebook ~2-3" — and the Facebook figure contradicted the table three lines above it, which says one. Two numbers for one fact, in one section, and no way to tell which was operative. The table and the Lane 1 definition agree on Facebook 1, so that is the count, and this line now points at the table instead of paraphrasing it. **The lane-1 counts here are load-bearing, not descriptive:** `content_channels.weekly_slots` carries them into `content-doctor` I10, so changing a number here without changing the column silently changes nothing, and changing the column without changing this line silently changes the alarm. Move both, or neither.

**The two lanes (added 2026-07-28).** The rhythm above runs in two independent lanes so the week does not depend on Keith holding a camera:

- **Lane 1, no camera** (the Mon/Thu LinkedIn slots, the Tue Facebook slot, the Wed Substack slot): atomised from published Ewa-signed articles. **Runs every week unconditionally.**
- **Lane 2, camera** (the Mon/Thu Reel or Short, the Wed founder-journey short, the Fri YouTube long-form): batched onto a booked filming day, skipped cleanly when there is none.

**Lane 2 may slip; it must never hold Lane 1.** A week where only Lane 1 ran is a normal week. This was added after the machine's first three weeks produced zero published pieces because every slot in the table above ran through a recording session that never got booked. The backlog for both lanes is `content-queue.md`; the run is `/content-week`.

**Guardrails on the mix:**
- **Wellness floor ~40%.** Protect it by interleaving a wellness pillar (A Vitamin D / B Fatigue / Omega-3) for roughly every clinical-curious one (`seo-ai-search/content-calendar.md`).
- **TRT stays ~0%.** That is the Phase 0 boundary, not a sign-off question, and it is the correct safe state rather than a miss. **Andropause is no longer at zero:** CA-028 was approved 2026-07-26 and unblocks the workstream, so plan it in deliberately. Each Pillar E asset still needs its own pre-flight and Ewa's sight before it ships.
- **Every hook maps to a live-kit marker.** No cortisol / thyroid / metabolic promotion until those kits launch.

---

## 2. The status model (one asset, one row, one status)

Every content asset moves through these stages. Track the *task* in ClickUp (workspace `90121729875`; Ewa sign-off on the "Content Review: Ewa" list `901218140081`); track the *plan* here or in the pillar's brief.

```
idea ──► drafted ──► compliance-preflight ──► [Ewa, if net-new claim] ──► scheduled ──► live ──► measured
```

| Status | Meaning | Owner of the next step |
|---|---|---|
| **idea** | on the queue, not yet written | agent drafts |
| **drafted** | script / caption / derivative written, in voice | agent → Keith review |
| **compliance-preflight** | ran `/compliance-preflight`; 🔴 = stop, 🟠 = Ewa, 🟢 = pass | agent / Ewa |
| **Ewa** (conditional) | only if the asset carries a claim not already in a signed canonical asset | Ewa (ClickUp `901218140081`) |
| **scheduled** | cleared, thumbnail attached, CTA routed, queued on a platform | Keith presses go |
| **live** | published / sent | (none) |
| **measured** | numbers pulled into the KPI view (platform-native until GA4 live) | agent → Keith |

**The gate is inheritance, not repetition.** A derivative of an already-signed canonical asset that adds no claim skips the Ewa step (it inherits the sign-off). A derivative that adds a claim, or any net-new founder script, goes to Ewa. See `sops/sop-compliance-route.md`.

**Founder/social assets track this status model in `content_assets.status`, not in their asset file** (changed 2026-08-01, Phase 1). Each founder/social idea has one asset file in `content-machine/assets/` (schema: `templates/asset-file.md`) holding its identity and craft, and one `content_assets` row holding its status, which extends the model above with `recorded` and `edited` sitting between `drafted` and `scheduled` (idea → hooked → scripted → recorded → edited → approved → done). This section is unchanged by that move: the stages are the same, only their storage changed.

**The transitions are enforced by the database, not by the scanner.** `20260801_content_state_guards.sql` holds them as a CHECK constraint on `content_assets` and a trigger on `content_renditions`, both firing on INSERT as well as UPDATE. `.claude/skills/content-status/scan.js` used to carry them and no longer does: after the split it cannot see the fields they read, and a scanner asserting a gate it cannot verify is worse than no scanner, because it reports clean. It now checks the frontmatter schema, YAML safety, the compliance HARD table, and that no database-owned key has crept back into a file.

---

## 3. Where each thing is tracked (no duplicate trackers)

| Thing | Tracked in |
|---|---|
| Which blog article publishes when | `seo-ai-search/content-calendar.md` (source of truth) |
| Ewa sign-off queue | ClickUp `90121729875`, list `901218140081` |
| Founder asset identity + craft | the asset file (`content-machine/assets/`): slug, title, funnel tags, marker, canonical asset, which renditions exist, the hook and the script |
| Founder asset pipeline status | Supabase `content_assets` / `content_renditions`, mirrored read-only into the asset file by `content-sync` and read-only to the ClickUp "Content Library" list (that second mirror is stale, see the note below the table) |
| Cross-channel weekly plan | this doc (or the sprint board) |
| Live status / open items | `STATE.md` in this workspace |
| Email sequence state | Customer.io + `07_sales/CONTEXT.md` |
| Per-pillar CTA target | central `kitCTA` config (`content-atomisation-model.md` §4) |

Do not create a parallel calendar or a second status tracker. If this doc and ClickUp disagree, ClickUp is the live task state and this doc is the plan. **The ClickUp "Content Library" mirror is read-only and generated one-way, and the database is what it should be generated from since 2026-08-01.**

**Do not trust the Content Library list's statuses today.** `content-library-sync.ts` was not repointed when Phase 1 moved state out of frontmatter: it still reads `status` from the asset file with `|| 'idea'` as its fallback, so the daily run mirrors every stripped asset as `idea`. Found 2026-08-01 while sweeping these docs, recorded rather than papered over, and owed as a one-file fix. Read `content_assets` or `/content-status` for a real status until it lands.

**Two mirrors now exist and neither is ever an input**: the ClickUp list, and the generated block `content-sync` writes into each asset file. Reading either one back as truth is how the second copy gets a vote, which is the whole failure Phase 1 removed.

---

## 4. Cross-references

- Blog publication gate + Mon/Thu procedure: `seo-ai-search/content-calendar.md`
- Atomisation map + CTA routing: `seo-ai-search/content-atomisation-model.md`
- Compliance route: `sops/sop-compliance-route.md`
- The weekly operating run: `sops/sop-weekly-run.md`
- Measurement dependency (GA4 + consent): `STATE.md`, `content-machine-blueprint.md` §5
