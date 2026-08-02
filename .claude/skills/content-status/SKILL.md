---
name: content-status
description: >
  Render the Andro Prime content pipeline board and move pieces through it. Use
  when Keith says "/content-status", "content board", "what's in the pipeline",
  "where is <slug>", "show the content balance", or gives a spoken status update
  like "ferritin's shot", "the vitamin D one is edited", "approve <slug>",
  "thumb done for <slug> instagram", or "posted <url>". Reads state from
  content_assets / content_renditions and identity from the asset files, runs
  the file scanner, and shows the pipeline by status, renditions by platform,
  the TOFU/MOFU funnel balance, and stale pieces. Also maps spoken updates to
  database writes, which the database's own
  guards then accept or refuse. It NEVER posts to a platform, never approves on
  Ewa's behalf, and treats ClickUp as a read-only mirror.
---

# /content-status: the content pipeline board

**Where each half of an asset lives, changed by Phase 1 on 2026-08-01.** The asset files in `andro-prime/06_marketing/content-machine/assets/` own **identity and craft**: slug, title, the funnel block, which renditions exist, and the hook and script in the body. `content_assets` / `content_renditions` own **state**: status, pre-flight, approvals, Ewa's sign-off, the Drive folder, and each rendition's status, schedule, publisher and URL. The rule and its reasoning are in `andro-prime/06_marketing/content-machine/CONTEXT.md`, section "The asset file owns IDENTITY and CRAFT. The database owns STATE."

**The frontmatter is no longer the tracker.** It never says where a piece has got to, so do not read state out of it and never write state into it. A leftover `status:` or `preflight:` in an asset file is a second copy of a fact the database owns: the scanner HARD-fails it as `[STATE]` and `content-doctor` invariant 9 reports it.

This skill reads both stores and does one of two jobs: render the **board**, or apply a spoken **transition** (a database write, which the database's own guards accept or refuse). ClickUp is still a read-only mirror that a nightly sync writes to, so never edit status there and never treat it as authoritative.

> **Scope note, and it is the opposite way round for blog articles.** The above governs **content-machine assets** only. **Published blog articles are served from `blog_articles.body` in Supabase, not from `content/blog/*.mdx`**, and that directory lags: it has shown live articles as `status: draft` for a day or more, because publishing flips the DB row and nothing flips the file. So for "which articles are live?", query the DB, never read the MDX frontmatter. This skill is the sanctioned way to answer "what is live"; a quick grep over `status:` is the wrong path and has already produced a confidently wrong answer to Keith (2026-07-31). The rule was already written in `seo-ai-search/content-engine-roadmap.md` and did not help, because a fast factual question never routed through the doc that held it. (Observations 90, 66.)

Read the schema first so the field names and enums are exact: `andro-prime/06_marketing/content-machine/templates/asset-file.md` (which side each field is on, and the four names that differ between the two spellings), `andro-prime/06_marketing/content-machine/assets/README.md`, and the balance rule in `andro-prime/06_marketing/content-machine/content-funnel-map.md`.

## Which job

- A bare `/content-status`, "content board", "what's in the pipeline", "where is <slug>", or "show the content balance" → **BOARD**.
- A spoken update naming a piece ("ferritin's shot", "recorded", "edited", "approve <slug>", "thumb done for <slug> <platform>", "scheduled", "posted <url>") → **TRANSITION**.

If a message does both ("approve the ferritin one, then show the board"), run the transition first, then render the board.

---

## Job 1: BOARD (render, do not edit)

1. **Read the state from the database.** This is where the board's numbers come from now. Nothing in the repo answers "where has this got to".

   ```sql
   select slug, title, status, preflight, preflight_date, ewa_task, ewa_signed_at,
          approved_by, approved_at, canonical_article_id, drive_url, updated_at
     from content_assets order by slug;
   select a.slug, r.platform, r.format, r.thumb_spec, r.status, r.scheduled_for,
          r.published_at, r.publisher, r.external_url, r.updated_at
     from content_renditions r join content_assets a on a.id = r.asset_id
    order by a.slug, r.platform;
   ```

   **If the database cannot be read, say so and stop.** Do not fall back to the generated blocks in the asset files: they are a mirror of an earlier read, so a board built from them looks exactly like a current board and is not one. An unavailable board is a fact; a stale board presented as current is a lie.

2. **Read the identity and craft from the files** (skip `README.md`): slug, title, content_type, funnel_stage, funnel_job, awareness, cta, channel, marker, canonical_asset, series, and which renditions exist. Join the two on `slug`.

3. **Run the scanner** over the whole assets directory and read its output:

   ```bash
   node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets
   ```

   **What it does and does not cover, so you do not over-report it.** It checks the identity/craft frontmatter schema, YAML safety, that no database-owned key has crept back into a file, and the compliance HARD table plus the em-dash rule over the body. **It no longer checks any pipeline transition**: those gates are in the database (`09_website-app/database/migrations/20260801_content_state_guards.sql`). Exit 0 = schema, YAML and compliance clean; exit 2 = at least one 🔴 HARD hit; exit 1 = the scanner could not run (usually the wrong working directory, and it names the path it could not resolve). 🟠 REVIEW lines are advisories. Keep the 🔴/🟠 lines to reproduce verbatim in section (e).

4. **Render five sections:**

   **(a) Pipeline by status.** A table grouped by `content_assets.status` in pipeline order (`idea → hooked → scripted → recorded → edited → approved → done`), one row per asset: slug, title (file), funnel_stage (file), content_type (file), preflight (DB), canonical_asset (file), drive_url (DB, or `none`). Show empty status buckets too, so the gaps are visible.

   **(b) Renditions by platform.** Group every `content_renditions` row by `platform`. Per rendition: slug, format, status, thumb_spec, scheduled_for, and external_url if present. This is the "what is scheduled/live where" view. **A rendition listed in a file but absent from the database is a finding, not a row**: report it, because adding an entry to the frontmatter does not create the row.

   **(c) Funnel balance line.** Count assets by `funnel_stage` (from the files). Print the counts on one line. Per the balance rule in `content-funnel-map.md` (at Phase 0a the constraint is TOFU reach and the MOFU email rung; BOFU is easy to over-index on), **flag it if TOFU is not the largest bucket**: e.g. "⚠ balance: BOFU (4) outweighs TOFU (2); do not build a shelf of kit content while the top of the funnel is empty."

   **(d) Stale list.** Every asset whose `content_assets.status` is between `hooked` and `edited` (inclusive) and whose `updated_at` is more than 14 days old. Say "advance it or park it" for each. **Use `updated_at`, not file mtime**: mtime moves when the craft is edited and when `content-sync` rewrites the generated block, so it answers a different question. The scanner no longer emits this at all, because it cannot see status; it was removed rather than approximated.

   **(e) Scanner findings.** Reproduce any 🔴 HARD and 🟠 REVIEW lines from step 3 verbatim.

5. Close with a one-line read of the whole board (where the bottleneck is), and remind Keith the board is a view: nothing was edited, posted, or approved.

---

## Job 2: TRANSITION (one database write, gate-checked by the database)

A spoken update maps to **one UPDATE on `content_assets` or `content_renditions`**, never to a frontmatter edit. The gates that used to live in the scanner are now a CHECK constraint and a trigger, so **the database refuses an illegal move by itself** and you do not pre-check and revert: you attempt the write and report what came back.

**There is no dedicated writer script yet.** Phase 2 of `content-pipeline-automation-plan.md` will build the plumbing. Until then the write is a hand-composed UPDATE through the Supabase connector (`mcp__claude_ai_Supabase__execute_sql`, project `phqrjtnflovicgkngieu`; the repo-wired `mcp__supabase__*` is read-only and cannot do it). **Show Keith the exact statement before running it**, and touch exactly the columns the transition names.

First, resolve the target asset from the slug (or the marker Keith names). Match against `content_assets.slug`. If more than one could match, ask which; do not guess.

**The maps** (column names are the database's, and four of them differ from the old frontmatter spellings: `drive` is `drive_url`, `approved_date` is `approved_at`, `url` is `external_url`, `publish_date` is `published_at`):

- **"<slug>'s shot" / "recorded"** → `content_assets.status = 'recorded'`. **Check by hand that the file actually holds a script** under `## Script` before writing, and say that you checked. This pairing was the scanner's G1 and nothing enforces it now: the body is in git and the status is in Postgres, so no single store can see both. It is a human check, and calling it a gate would be dishonest.
- **"edited"** → `content_assets.status = 'edited'`.
- **"approve <slug>"** → `content_assets.status = 'approved'`, plus `approved_by` and `approved_at` for Keith's business approval. The `content_assets_approval_gate` CHECK allows exactly two routes: `preflight = 'green'` with a `canonical_article_id` to inherit clearance from, or `preflight = 'amber-ewa'` with `ewa_signed_at` set. **A non-empty `ewa_task` is not a route**: it proves a question was asked, not answered (Keith, 2026-08-01). If the constraint refuses the write, report its message verbatim and stop. Never approve on Ewa's behalf, and never write `ewa_signed_at`: a separate trigger refuses it outside the sign-off sync, and that refusal is the system working.
- **"thumb done for <slug> <platform>"** → confirm the thumbnail file exists in the asset's Drive `thumb` subfolder **before** crediting it: check via the gws CLI (business account, which holds the real tree) or the Drive connector. If you can confirm it, set that rendition's `status = 'thumbnail-done'`. If you cannot verify it, say it is unverified and ask Keith; only on his explicit yes write the status, and say in the report that it rests on his word rather than on a Drive read. **There is no `thumb_confirmed` flag any more**: it was a boolean a human typed to assert a Drive fact nothing checked, and it is gone from both stores.
- **"scheduled"** → that rendition's `status = 'scheduled'` plus `scheduled_for`. The `gate_rendition_publish()` trigger requires the parent asset to be `approved` or `done`, the canonical article to be `published` if there is one, and a confirmed thumbnail unless `thumb_spec = 'none'`. It fires on INSERT as well as UPDATE.
- **"posted <url>" / "published"** → that rendition's `status = 'published'`, `external_url`, and `published_at`. The trigger refuses `published` without an `external_url`, because a published rendition with no URL is an unverifiable claim that it shipped. If Keith did not give a URL, ask for it before writing.

**After any transition:**

1. Refresh the generated block so the repo mirror stops lying, from `andro-prime/09_website-app/frontend`:

   ```bash
   npx tsx scripts/content-engine/content-sync.ts
   ```

2. Re-run the scanner on that one file, which checks the file half (schema, YAML, compliance), not the transition:

   ```bash
   node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets/YYYY-MM-DD-<slug>.md
   ```

3. Confirm the new state in one line, naming the column you wrote.

**If the database refused the write, that is the answer, not an obstacle.** Report the constraint or trigger message verbatim and stop. Do not retry with different columns, do not write the value into the file instead, and never disable or work around a guard.

## Hard rails (every run)

- **Never post to a platform.** This skill only records that Keith posted; the go button is always his.
- **Never approve on Ewa's behalf**, and never set `preflight = 'green'` here: that stamp is `/compliance-preflight`'s. Sign-off stays with Ewa (clinical/claims) or Keith (business).
- **Never write state into an asset file**, not even "temporarily" while the database is unreachable. That is how the dual store comes back, and it is the one failure Phase 1 exists to end. If the database cannot be written, say so and stop.
- **ClickUp is a read-only mirror.** The nightly sync writes one way. If ClickUp disagrees with the database, the database wins; never edit anything to match ClickUp.
- **The gates are in the database, and the scanner is not one of them.** If a move is refused, the answer is to satisfy the gate (get the pre-flight green, get Ewa's ruling recorded, produce the thumbnail), never to route around it.
