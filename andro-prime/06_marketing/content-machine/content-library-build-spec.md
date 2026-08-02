**Owner:** Keith Antony
**Status:** Build spec v2 (2026-07-13), swept for Phase 1 on 2026-08-01
**Read first:** `CONTEXT.md`

> **SUPERSEDED ON STATE by Phase 1, 2026-08-01. Read `CONTEXT.md` section "The asset file owns IDENTITY and CRAFT. The database owns STATE." before acting on anything below.** This spec was written git-first: "frontmatter = the tracker", "git is the source of truth", "/content-status renders the board from frontmatter". None of that is true any more. **The database owns state** (`content_assets` / `content_renditions`); the file keeps identity and craft, and `content-sync` mirrors state back into it as a generated block that is never an input. What is still accurate: the file layout, the Drive convention, the ClickUp mirror being one-way and read-only, and the default rendition fan-out. The state claims and the Gates block were corrected in place on 2026-08-01, with the v2 wording kept below wherever it is the record of what was actually built. **Where a sentence here still reads git-first and carries no correction, it is history and the split above wins.**

---

# Build: Andro Prime Content Library (git for craft, database for state)

## Goal
Stop the founder being the database. Every founder content idea has ONE
record: one git asset file for what it IS, one `content_assets` row for
where it HAS GOT TO. Nothing gets lost or half-finished, one shoot
reliably fans out to every platform, the compliance and thumbnail gates
are machine-checked, and funnel balance is visible on demand. ClickUp is a
read-only mirror; Drive holds media. No bespoke app, no manual bookkeeping:
if the founder must maintain any part by hand, it has failed.

_The v2 goal said "git is the source of truth", full stop. That was the
whole design and it is what Phase 1 reversed: a single record per idea was
right, but keeping the STATE in git meant it also lived in Supabase, and
nothing watched the pair. Corrected 2026-08-01._

## Architecture
- WORDS -> git. One asset file per idea:
  andro-prime/06_marketing/content-machine/assets/YYYY-MM-DD-<slug>.md
  Frontmatter = identity + craft (NOT the tracker, since 2026-08-01).
  Body = chosen hook + script (all modes).
- STATE -> Supabase `content_assets` / `content_renditions`, authoritative.
  Mirrored back into each file as a generated block by
  09_website-app/frontend/scripts/content-engine/content-sync.ts, which is
  read-only output: never parsed, never an input, overwritten every run.
- MEDIA -> Google Drive: Content/YYYY-MM/<slug>/{raw,final,thumb}/
  Thumb filenames are `<platform>-<format>-<thumb_spec>.png`, one per
  rendition (Keith, 2026-07-31; supersedes the size-keyed thumb-9x16.png
  convention this line originally carried, which made two different 9:16
  covers unstorable). The folder URL is content_assets.drive_url.
- STATE VIEW -> /content-status renders the board from the DATABASE.
  It reads the generated blocks for nothing: if Supabase is unreachable it
  refuses to draw a board rather than draw a stale one.
- MIRROR -> one-way ClickUp sync: one task per asset in a
  "Content Library" list (Phase 0 Launch folder, workspace 90121729875),
  status mapped to the list's single status set, renditions rendered as a
  markdown table in the task description. No custom fields. Ewa's
  "Content Review" list 901218140081 is untouched.
  BROKEN BY PHASE 1 AND NOT YET FIXED, found 2026-08-01 while sweeping these
  docs. content-library-sync.ts still reads `status` out of the asset file's
  frontmatter, with `|| 'idea'` as its fallback. That key is gone from eleven
  of the thirteen files, so the daily content-engine.yml run now mirrors every
  correctly-stripped asset to ClickUp as `idea`, and renders the rendition
  table's status / url / publish_date columns empty. It fails silently: the
  fallback was written for a genuinely new asset and cannot tell one from an
  asset whose status simply moved house. content-doctor does not see it,
  because no invariant reads the ClickUp mirror. OWED: repoint the script at
  content_assets / content_renditions, and drop the `|| 'idea'` fallback so a
  missing status is an error rather than a plausible-looking value.

## Asset frontmatter schema

**Rewritten to schema v3, 2026-08-01. `templates/asset-file.md` is the
authority; this is a summary.** The v2 block that used to sit here carried nine
further keys, each of which is now a HARD `[STATE]` failure in `scan.js` and a
`content-doctor` I9 violation. They are listed under the block rather than left
commented out above it: a commented-out old schema is the exact trap the doctor
guards against, and the one this edit invites.

  slug: <kebab-case, minted at /hook time; also the Drive folder + task name>
  title: <working title>
  content_type: educational | personal-story | proof-result | objection-comparison
  funnel_stage: TOFU | MOFU | BOFU | RETENTION      # existing markup fields
  funnel_job / awareness / cta / marker: <per content-funnel-map.md>
  channel: linkedin | facebook | substack | none    # written-post assets only
  canonical_asset: <slug of the Ewa-signed article it inherits from, or "none">
  series: <e.g. "Read Your Blood" | none>
  renditions:                                       # WHICH ones exist, only
    - platform: instagram|youtube|tiktok|facebook|linkedin|substack|x
      format: reel|short|long-form|link-post|text-post|newsletter|thread
      thumb: 9x16|1280x720|1200x630|none

  REMOVED 2026-08-01, now database-owned: status, preflight, preflight_date,
  ewa_task, ewa_signed_at, approved_by, approved_date, drive, and per
  rendition status, url, publish_date, scheduled_for, publisher,
  external_post_id. The name-by-name mapping to their columns, including the
  four that are spelled differently, is in templates/asset-file.md.

Status model EXTENDS unified-content-calendar.md section 2 (idea ->
drafted -> preflight -> [Ewa] -> scheduled -> live -> measured); it does
not replace it. Recorded/edited slot between drafted and scheduled. The
model is unchanged by Phase 1; only where the value is stored moved.

## Default rendition fan-out (skills auto-create; Keith deletes unwanted)
  short-form script -> instagram/reel + youtube/short + tiktok/short (all 9x16)
  long script       -> youtube/long-form (1280x720)
  linkedin mode     -> linkedin/text-post (thumb none)
  facebook mode     -> facebook/link-post (1200x630)

## Gates (SUPERSEDED 2026-08-01: G1 to G4 are no longer in the scanner)

The five gates below are the v2 design and are kept as the record of what was
built. **Phase 1 moved state out of frontmatter, so the scanner can no longer see
the fields G1 to G4 read**, and a scanner asserting a gate it cannot verify is
the `thumb_confirmed` failure in a new place. Where each one lives now:

  G1 -> NOT REPLACED. The body is in git and the status is in the database, so
        no single store can check the pair. It is a human check, and
        `/content-status` says so instead of implying a gate.
  G2 -> `content_assets_approval_gate`, a CHECK constraint in
        `09_website-app/database/migrations/20260801_content_state_guards.sql`.
        STRICTER than G2: a non-empty `ewa_task` is not a route to approved,
        because it proves a question was asked, not answered (Keith, 2026-08-01).
  G3 -> `gate_rendition_publish()`, a BEFORE INSERT OR UPDATE trigger in the same
        migration. It adds a rule G3 never had: a derivative may not outrun its
        canonical article's publication. `thumb_confirmed` is retired: it was a
        boolean a human typed to assert a Drive fact nothing checked.
  G4 -> the same trigger.
  G5 -> unchanged, still in `.claude/skills/content-status/scan.js`, because the
        body it reads is in the file it is holding.

  NEW, and it is what replaces G1 to G4 in the scanner: a database-owned key left
  in frontmatter is a HARD `[STATE]` failure. That is the check that stops the
  dual store growing back, and it is the only gate-shaped thing a repo-only
  reader can still perform honestly.

### The v2 design, kept as the record

  G1 status >= scripted requires a script in the body
  G2 status >= approved requires preflight green (or amber-ewa + ewa_task
     closed) AND canonical_asset set (or an explicit net-new-claim Ewa pass)
  G3 rendition >= scheduled requires: parent >= approved, and if thumb !=
     none, a matching thumb file confirmed in Drive (or a checked
     "thumb-confirmed" flag on the rendition)
  G4 rendition published requires url
  G5 no em dash in any body copy; silent ingredient never named (reuse
     compliance scan.js HARD table on the body)

## Deliverables

**All seven were delivered in July 2026, and three of them describe a write
path Phase 1 removed. Corrected inline below rather than deleted**, because
what was built is the reason the current shape exists.

D1 Asset schema + assets/ dir + one template file (asset-file.md) in
   content-machine/templates/, documented in content-machine/CONTEXT.md.
D2 Gate scanner: .claude/skills/content-status/scan.js : zero-dep Node CJS
   copying compliance-preflight/scan.js conventions (regex/flat-YAML parse,
   exit 2 on gate violation, per-file report). Wired into /wrap Stage 3
   next to the em-dash scan.
   CORRECTED 2026-08-01: it is no longer a GATE scanner. It reads the
   schema, YAML safety and the compliance HARD table, and it exits 2 on a
   database-owned key found in frontmatter. The pipeline gates moved to the
   database.
D3 Skill updates:
   /hook  -> after Keith picks a hook: mint slug, create asset file
             (status hooked, funnel tag from the stamp, content_type asked
             as one question), create Drive folder via gws, link it.
   /script -> write script into the asset file body (status scripted),
             auto-create default renditions per mode. All 4 modes
             (short, long, linkedin, facebook). If the asset file doesn't
             exist (script run without hook), create it then.
   /compliance-preflight -> additionally stamp preflight result + date
             into the asset file when the target is an asset.
   NEW /content-status -> run scanner, render the board: pipeline by
             status, renditions by platform, TOFU/MOFU balance, stale
             assets (>14 days idle). Also handles spoken transitions
             ("ferritin's shot" -> recorded) with gate checks.
   CORRECTED 2026-08-01, and this is the paragraph most likely to be
   followed by mistake. Every "stamp it into the file" above is now "write
   it to the row": /hook creates the file AND the content_assets row,
   /script writes craft to the body and status to the row,
   /compliance-preflight writes preflight and preflight_date to the row,
   and /content-status applies a spoken transition as one gate-checked
   UPDATE. The file half of each is unchanged; only the state half moved.
   Staleness is content_assets.updated_at, not file mtime.
D4 Drive wiring: gws drive folder creation (Content/YYYY-MM/<slug>/...).
   Greenfield: verify gws drive subcommands, add the settings allow-entry.
   Fallback if gws drive is unusable: Google Drive MCP connector.
D5 ClickUp mirror: content-library-sync.ts in
   09_website-app/frontend/scripts/content-engine/, REUSING clickup.ts
   helpers + existing token. Creates the "Content Library" list once
   (plain statuses only), then upserts one task per asset. Runs in the
   daily content-engine.yml Action + on demand. One-way; git wins.
   CORRECTED 2026-08-01: the source SHOULD now be content_assets, so "git
   wins" becomes "the database wins". **It is not, and the script has not
   been repointed.** See the MIRROR bullet under Architecture: it still reads
   frontmatter `status` and defaults to `idea`, so the daily run currently
   publishes a wrong status for every stripped asset. This deliverable is the
   one piece of D1 to D7 that Phase 1 left in a broken state rather than a
   changed one.
D6 Doc sweep (decision-sweep discipline): content-funnel-map.md (+
   content_type line in the markup), unified-content-calendar.md sections
   2/3 (name the asset files + Content Library list as the live tracker),
   sop-founder-short-form.md step 8, sop-weekly-run.md, sop-thumbnail.md
   (filenames), content-machine/CONTEXT.md + STATE.md, 06_marketing/STATE.md.
D7 Seed: create the Ep 0 baseline shoot as asset #1 (the real bottleneck),
   plus backfill the pillar-B dry-run derivative set as asset #2.

## Constraints
- Reuse: scan.js pattern, clickup.ts, gray-matter (already installed),
  content-engine.yml, gws CLI. No new tools, no bespoke app.
- Compliance: read 03_compliance/CONTEXT.md first; silent ingredient never
  named; no em dashes; inheritance gate per sop-compliance-route.md
  (claim-free derivative inherits sign-off; net-new claim -> Ewa).
- No auto-posting to platforms, ever. Keith presses go.
- Skills degrade gracefully: if Drive/ClickUp unreachable, write the
  pending action into the asset file and flag it; never fail generation.
  NARROWED 2026-08-01: this applies to the craft half only. A skill that
  cannot reach Supabase must NOT write the state into the file as a
  fallback, because a pending action parked in frontmatter is the second
  copy this whole phase exists to remove. Say the write did not happen.
- Durable rules -> CONTEXT.md; dated status -> STATE.md (bump dates).

## Success test
/hook ferritin -> pick hook 2 -> /script: yields one asset file carrying
identity and craft, a content_assets row carrying state, a Drive folder,
three default renditions; the database refuses "approved" until preflight
is green with a canonical article to inherit from, and refuses "scheduled"
until the 9x16 thumb is confirmed and the canonical article is published;
"ferritin's shot" advances it through /content-status as one gate-checked
UPDATE; /content-status shows the piece, its renditions, and the TOFU/MOFU
balance; content-sync mirrors the state back into the file; the ClickUp
task mirrors it within a day. Zero forms filled by hand.

_The v2 test read "yields one asset file with populated frontmatter ...
scanner blocks approved until preflight green". Both halves moved on
2026-08-01: the frontmatter no longer carries the state, and the scanner no
longer blocks the transition. What replaced them is stricter, not looser._

---

_This git-first design supersedes the earlier ClickUp-first v1 plan on 2026-07-13: the ClickUp API cannot create the custom fields the tracker needs, its statuses are list-level (which breaks the parent/child rendition pipeline), and the gates are not API-enforceable, so git holds the truth and ClickUp is reduced to a read-only mirror._

_And that last clause is the one Phase 1 overturned, on 2026-08-01. Rejecting ClickUp as the store was right; concluding that git should therefore hold the state did not follow. The gates are enforceable, just not by ClickUp and not by a scanner reading markdown: they are a CHECK constraint and a trigger in `20260801_content_state_guards.sql`, firing on INSERT as well as UPDATE. ClickUp stays a read-only mirror, which this v1 decision got right and which nothing since has changed._
