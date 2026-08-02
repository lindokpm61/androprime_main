# Content Machine: Assets

**Owner:** Keith Antony | **Status:** Live, schema v3 since 2026-08-01 (Phase 1: state moved to the database) | **Read first:** `../CONTEXT.md`, section "The asset file owns IDENTITY and CRAFT. The database owns STATE."

One markdown file in this folder is one founder content idea. **It is no longer the tracker.** It holds what a human writes: the identity of the idea (slug, title, funnel tags, marker, canonical asset, which renditions exist) and the craft (the chosen hook and the script). Where the idea has got to lives in `content_assets` / `content_renditions` and only there.

**Filename:** `YYYY-MM-DD-<slug>.md`, lowercase kebab-case. The date is the mint date, the slug is immutable once set: it names the Drive folder and the ClickUp task, and it is now the only join between this file and its database row. Renaming it orphans both stores rather than moving anything.

## What is here and what is in the database

| In this file | In the database |
| --- | --- |
| `slug`, `title`, `content_type`, `funnel_stage`, `funnel_job`, `awareness`, `cta`, `channel`, `marker`, `canonical_asset`, `series` | `status`, `preflight`, `preflight_date`, `ewa_task`, `ewa_signed_at`, `approved_by`, `approved_at`, `drive_url` |
| which renditions exist: `platform`, `format`, `thumb` | each rendition's `status`, `scheduled_for`, `published_at`, `external_url`, `external_post_id`, `publisher` |
| the chosen hook and the script, in the body | every timestamp and every gate result |

The test for which side a field belongs on is **who changes it**. A human typing while writing is identity or craft and belongs in git, where a diff is meaningful. An integration changing it (a scheduler, a webhook, the sign-off sync) is state and belongs in the database. Full mapping, including the four names that differ between the two spellings, in `../templates/asset-file.md`.

**Putting a state key back in frontmatter is now a HARD failure**, in two independent places: `.claude/skills/content-status/scan.js` reports `[STATE]` naming the owning column, and `content-doctor` invariant 9 fails the run. Presence is the violation, not disagreement: an agreeing copy is still a copy, and it is the one that quietly stops agreeing later.

## The generated block under the frontmatter is a mirror

`content-sync` writes a `BEGIN GENERATED STATE` block into each file so someone reading the repo can see where an idea has got to without opening Supabase. **Read it for orientation, never for truth.** Editing it changes nothing, the next run overwrites it, and nothing in this repo parses it back. If it is wrong, the database is what you fix. Run it from `09_website-app/frontend`:

```bash
npx tsx scripts/content-engine/content-sync.ts --check   # verdict only, writes nothing
npx tsx scripts/content-engine/content-sync.ts           # write the blocks
```

## The gates are in the database, not in the scanner

`09_website-app/database/migrations/20260801_content_state_guards.sql` holds them, as a CHECK constraint on `content_assets` and a trigger on `content_renditions`, and **they fire on INSERT as well as UPDATE**: a gate you can arrive at without passing through is not a gate. Its sibling `20260801_content_assets_business_approval.sql` added the `approved_by` / `approved_at` columns the split assumed already existed. Two routes to `approved`: pre-flight `green` plus a canonical article to inherit clearance from, or `amber-ewa` plus `ewa_signed_at`, which only the sign-off sync may write. A rendition cannot reach `scheduled` while its asset is unapproved, while its canonical article is unpublished, or without its thumbnail.

`scan.js` kept only what a repo-only reader can still verify: the frontmatter schema, YAML safety, the compliance HARD table and the em-dash rule. Gates G1 to G4 were removed on 2026-08-01 because after the split it cannot see the fields they read, and a scanner asserting a gate it cannot check is the `thumb_confirmed` failure in a new hat. **One capability was genuinely lost and nothing replaced it:** G1 ("a `scripted` asset has a script in the body") needs the body from git and the status from Postgres, so no single store can check the pair. It is a human check now, and `/content-status` says so instead of implying a gate.

## The tools write here, not you

`/hook` mints the file, `/script` fills the body and registers the default renditions, `/content-status` renders the board from the database and applies Keith's spoken transitions as gate-checked updates to the row. Hand-editing frontmatter is for identity and craft only.

Media (video, thumbnails) lives in Google Drive at `Content/YYYY-MM/<slug>/{raw,final,thumb}/`, never in git, and the folder URL is `content_assets.drive_url`, not a frontmatter field.

Start from the template at `../templates/asset-file.md`.
