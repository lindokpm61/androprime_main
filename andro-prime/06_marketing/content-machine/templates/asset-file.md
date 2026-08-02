# Template: Asset File (one content idea, hook to measured)

**Owner:** Keith Antony | **Status:** Schema v3, 2026-08-01 (Phase 1: state moved to the database) | **Read first:** `../CONTEXT.md`, section "The asset file owns IDENTITY and CRAFT. The database owns STATE."; then `../content-library-build-spec.md`, `../content-funnel-map.md`

One asset file is one founder content idea. **The frontmatter is no longer the tracker.** It carries identity and craft: what this idea is, who it is for, and which renditions exist. Every piece of state (status, pre-flight result, Keith's approval, Ewa's sign-off, the Drive folder, and each rendition's status, schedule, publisher and URL) lives in `content_assets` / `content_renditions` and only there.

Copy the blank below to `../assets/YYYY-MM-DD-<slug>.md`. In practice `/hook` mints this file and `/script` fills the body: you rarely hand-edit frontmatter.

**Why the split, in one paragraph.** Every failure in section 1 of `../content-pipeline-automation-plan.md` was the same shape: two copies of one fact, one of them updated, no alarm. The fix is not a better sync, it is having nowhere for the second copy to live. The test for which side a field belongs on is **who changes it**. A human typing while writing is identity or craft, so it belongs in git, where a diff is meaningful and review is possible. An integration changes state (a scheduler, a webhook, the sign-off sync), so it belongs in the database, because that is what the integrations read and write.

---

## Blank frontmatter (identity and craft only)

```yaml
---
slug: <kebab-case, minted at /hook time; also the Drive folder + ClickUp task name>
title: <working title, plain English>
content_type: educational   # educational | personal-story | proof-result | objection-comparison
funnel_stage: TOFU      # TOFU | MOFU | BOFU | RETENTION
funnel_job: <short phrase, e.g. "problem-aware scroll-stop (ferritin / fatigue)">
awareness: problem-aware    # unaware | problem-aware | solution-aware | product-aware | customer | advocate
cta: quiz               # follow | quiz | email-rung | canonical-article | kit-1 | kit-2 | kit-3 | retest | referral
channel:                # linkedin | facebook | substack | none. Required on written-post assets; omit for video.
marker: ferritin        # ferritin | vitamin-d | b12 | hs-crp | testosterone | none
canonical_asset: none   # slug of the Ewa-signed article it inherits from, or "none"
series: none            # e.g. "Read Your Blood" | none
renditions:             # WHICH renditions exist. What each one is DOING is in content_renditions.
  - platform: instagram # instagram | youtube | tiktok | facebook | linkedin | substack | x
    format: reel        # reel | short | long-form | link-post | text-post | newsletter | thread
    thumb: 9x16         # 9x16 | 1280x720 | 1200x630 | none. The column is thumb_spec.
---
```

The full platform and format vocabularies are the Supabase check constraints `content_renditions_platform_check` and `content_renditions_format_check`, mirrored in `.claude/skills/content-status/scan.js`. They are deliberately not re-listed in full here: a third copy of an enum is a third thing to forget to update, and a scanner narrower than the database HARD-fails legitimate rows (that happened from 2026-07-19 to 2026-08-01 with `substack`, `x` and `newsletter`).

### What is NOT in the frontmatter any more, and where each one went

| Was in frontmatter | Lives in |
| --- | --- |
| `status` | `content_assets.status` |
| `approved_by`, `approved_date` | `content_assets.approved_by`, `content_assets.approved_at` |
| `preflight`, `preflight_date` | `content_assets.preflight`, `content_assets.preflight_date` |
| `ewa_task`, `ewa_signed_at` | `content_assets.ewa_task`, `content_assets.ewa_signed_at` |
| `drive` | `content_assets.drive_url` |
| per rendition `status` | `content_renditions.status` |
| per rendition `url` | `content_renditions.external_url` |
| per rendition `publish_date` | `content_renditions.published_at` |
| per rendition `scheduled_for` | `content_renditions.scheduled_for` |
| per rendition `publisher`, `external_post_id` | `content_renditions.publisher`, `content_renditions.external_post_id` |

Four of those names differ between the two spellings. Read the mapping rather than transforming the name yourself: `drive` is `drive_url`, `approved_date` is `approved_at`, `url` is `external_url`, and `publish_date` is `published_at`.

---

## The generated state block (read it, never edit it)

`content-sync` writes a block immediately after the frontmatter that mirrors the database's view of this asset. It exists so that someone reading the repo directly can see where the idea has got to without opening Supabase.

**It is a mirror and never an input.** Editing it changes nothing, the next run overwrites it, and nothing in this repo parses it. A copy of a fact is only safe when it can never be read back: if the block is wrong, the database is what you fix. If a marker line is damaged or duplicated, `content-sync` refuses that file and leaves it exactly as it is, so a human can decide.

```markdown
<!-- BEGIN GENERATED STATE. Written by content-sync from the database. Do not edit: your changes will be overwritten and they change nothing. -->
_Synced 2026-08-01T21:24:54.035Z from content_assets / content_renditions._

| | |
| --- | --- |
| status | scripted |
| approved (business) | none |
| preflight | green (2026-07-13) |
| Ewa | inherited from canonical article why-am-i-always-tired |
| drive | https://drive.google.com/drive/folders/CONTENT-2026-07-always-tired-ferritin |

| rendition | status | scheduled | published | id | url |
| --- | --- | --- | --- | --- | --- |
| instagram/reel | to-produce |  |  |  |  |
| tiktok/short | to-produce |  |  |  |  |
| youtube/short | to-produce |  |  |  |  |
<!-- END GENERATED STATE -->
```

Run it from `09_website-app/frontend`:

```bash
npx tsx scripts/content-engine/content-sync.ts --check   # verdict only, writes nothing
npx tsx scripts/content-engine/content-sync.ts --dry     # show the diff, writes nothing
npx tsx scripts/content-engine/content-sync.ts           # write the blocks
```

Timestamps are shown with the offset they arrived with, and `+00:00` is spelled `UTC`. That matters: PostgREST normalises `timestamptz` to UTC, so a slot booked for 11:00 UK time reads as `10:00 UTC` here. Same instant, two readings, and dropping the zone label would be the section 1 failure shape in miniature.

---

## Body skeleton

```markdown
## Chosen hook

<the single hook Keith picked, spoken + on-screen text>

## Script

<the shootable script: lines with visual and text cues, the soft CTA, the four-check>
```

---

## Rules

- **Slug is immutable once minted.** It names the file, the Drive folder and the ClickUp task, and it is now also the only join between this file and its `content_assets` row. Renaming it does not move the state, it orphans both stores: `content-doctor` invariant 1 then reports a file with no row and a row with no file, which is one mistake reported as two. Retire the asset instead.
- **Status is not in this file, and the gates are in the database.** They are `09_website-app/database/migrations/20260801_content_state_guards.sql`, as a CHECK constraint on `content_assets` plus a trigger on `content_renditions`, and **they fire on INSERT as well as UPDATE**, because a gate you can arrive at without passing through is not a gate. There are exactly two routes to `approved`: pre-flight `green` plus a canonical article to inherit clearance from, or pre-flight `amber-ewa` plus `ewa_signed_at`, which only the sign-off sync may write. A non-empty `ewa_task` is **not** a route: it proves a question was asked, not answered (Keith, 2026-08-01). A rendition cannot sit at `scheduled` or later while its asset is unapproved, while its canonical article is unpublished, or without a confirmed thumbnail when `thumb_spec` is not `none`; and it cannot be `published` without an `external_url`, because a published rendition with no URL is an unverifiable claim that it shipped.
- **`scan.js` keeps only what it can see, and the narrowing is DONE (2026-08-01).** `.claude/skills/content-status/scan.js` owns the frontmatter schema, YAML safety, the compliance HARD table and the em-dash rule, all of which live in the file it is reading. Gates G1 to G4 were removed: it must not assert the pipeline gates, because after this split it cannot verify them, and a scanner asserting a gate it cannot check is the `thumb_confirmed` failure wearing a different hat. Its header names each removed gate and where it went, so nobody restores them. **What it gained in exchange is the check that keeps this split alive:** a database-owned key left in frontmatter is now a HARD `[STATE]` failure, because that is the dual store growing back. One consequence worth knowing: `G1` (a `scripted` asset must have a script in the body) has **no replacement anywhere**, since the body is in git and the status is in Postgres. It is a human check now, and `/content-status` says so rather than implying a gate.
- **Renditions are added or deleted freely while every one is still `to-produce`.** Which renditions exist is a craft decision, so it belongs here; what each one is doing is state, so it does not. The default fan-out is a starting point: delete the platforms you will not run before anything is scheduled. Once a rendition is scheduled or later, leave it in place as the record. Adding an entry here does not create the `content_renditions` row: register both, or the file and the database disagree about what exists.
- **The funnel block follows `content-funnel-map.md`.** TOFU never carries a kit CTA; per-rendition `format` lives on the rendition, not the top-level block.
- **Compliance is non-negotiable.** No em dashes anywhere; the silent ingredient is never named; markers must map to a live kit. Body copy runs through the pre-flight before the asset is approved.

---

## Worked example: `2026-07-13-always-tired-ferritin.md`

Frontmatter, then the block `content-sync` generated under it, then the craft. Note that nothing in the frontmatter says how far along this asset is: that is the point.

```yaml
---
slug: always-tired-ferritin
title: Always tired, and the marker nobody checked
content_type: personal-story
funnel_stage: TOFU
funnel_job: problem-aware scroll-stop (ferritin / fatigue)
awareness: problem-aware
cta: quiz
marker: ferritin
canonical_asset: why-am-i-always-tired
series: Read Your Blood
renditions:
  - platform: instagram
    format: reel
    thumb: 9x16
  - platform: youtube
    format: short
    thumb: 9x16
  - platform: tiktok
    format: short
    thumb: 9x16
---
```

```markdown
<!-- BEGIN GENERATED STATE. Written by content-sync from the database. Do not edit: your changes will be overwritten and they change nothing. -->
_Synced 2026-08-01T21:24:54.035Z from content_assets / content_renditions._

| | |
| --- | --- |
| status | scripted |
| approved (business) | none |
| preflight | green (2026-07-13) |
| Ewa | inherited from canonical article why-am-i-always-tired |
| drive | https://drive.google.com/drive/folders/CONTENT-2026-07-always-tired-ferritin |

| rendition | status | scheduled | published | id | url |
| --- | --- | --- | --- | --- | --- |
| instagram/reel | to-produce |  |  |  |  |
| tiktok/short | to-produce |  |  |  |  |
| youtube/short | to-produce |  |  |  |  |
<!-- END GENERATED STATE -->
```

## Chosen hook

Spoken: "I was tired for a year before anyone checked the one thing that explained it."
On-screen text (frame 1, muted-legible): "Tired for a year. Nobody checked this."

## Script

> I told my GP I was exhausted. Sleeping fine, training the same, still flat by 2pm.
>
> Bloods came back. "All normal."
>
> So I read them myself. One marker sat right at the bottom of the range: ferritin. It is the protein that stores your iron, the tank your body draws on.
>
> Mine was nearly empty.
>
> That does not tell you why, and it is not a diagnosis. It is a signal, and the why is a conversation with your GP, not a supplement order.
>
> A flat year can feel like getting older. Sometimes it is a number you have never been shown.
>
> What did your last blood test actually check?
>
> Education, not medical advice. Find out what your blood says. Link below.

*Four-check: feeling-first; shows Keith's own reading without asserting a supplement fixed anything; hedges signal-not-cause and routes to the GP; no diagnose/treat/cure; marker is live-kit; no FM CTA; no em dashes; the silent ingredient is not named.*
