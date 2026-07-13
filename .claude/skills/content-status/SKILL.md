---
name: content-status
description: >
  Render the Andro Prime content pipeline board and move pieces through it. Use
  when Keith says "/content-status", "content board", "what's in the pipeline",
  "where is <slug>", "show the content balance", or gives a spoken status update
  like "ferritin's shot", "the vitamin D one is edited", "approve <slug>",
  "thumb done for <slug> instagram", or "posted <url>". Reads every
  content-machine asset file, runs the gate scanner, and shows the pipeline by
  status, renditions by platform, the TOFU/MOFU funnel balance, and stale
  pieces. Also maps spoken updates to frontmatter edits, but only when the gate
  scanner allows the move. It NEVER posts to a platform, never approves on Ewa's
  behalf, and treats ClickUp as a read-only mirror (git wins).
---

# /content-status — the content pipeline board

The content-machine asset files in `andro-prime/06_marketing/content-machine/assets/` are the tracker: each file's frontmatter says where one founder content idea sits, hook to measured. This skill reads them and does one of two jobs — render the **board**, or apply a spoken **transition**. Git is the source of truth; ClickUp is a read-only mirror that a nightly sync writes to, so never edit status there and never treat it as authoritative.

Read the schema first so the field names and enums are exact: `andro-prime/06_marketing/content-machine/templates/asset-file.md`, `andro-prime/06_marketing/content-machine/assets/README.md`, and the balance rule in `andro-prime/06_marketing/content-machine/content-funnel-map.md`.

## Which job

- A bare `/content-status`, "content board", "what's in the pipeline", "where is <slug>", or "show the content balance" → **BOARD**.
- A spoken update naming a piece ("ferritin's shot", "recorded", "edited", "approve <slug>", "thumb done for <slug> <platform>", "scheduled", "posted <url>") → **TRANSITION**.

If a message does both ("approve the ferritin one, then show the board"), run the transition first, then render the board.

---

## Job 1 — BOARD (render, do not edit)

1. **Run the gate scanner** over the whole assets directory and read its output:

   ```bash
   node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets
   ```

   Exit 0 = every gate clean; exit 2 = at least one 🔴 HARD block. 🟠 REVIEW lines are advisories and never fail the gate. Keep the scanner's 🔴/🟠 lines to reproduce verbatim in section (e).

2. **Read every asset's frontmatter** (skip `README.md`) and render five sections:

   **(a) Pipeline by status.** A table grouped by `status` in pipeline order (`idea → hooked → scripted → recorded → edited → approved → done`), one row per asset: slug, title, funnel_stage, content_type, preflight, canonical_asset (or `none`), drive (or `pending`). Show empty status buckets too, so the gaps are visible.

   **(b) Renditions by platform.** Group every rendition across all assets by `platform` (instagram / youtube / tiktok / facebook / linkedin). Per rendition: slug, format, rendition status, thumb, and url if present. This is the "what is scheduled/live where" view.

   **(c) Funnel balance line.** Count assets by `funnel_stage`: TOFU / MOFU / BOFU / RETENTION. Print the counts on one line. Per the balance rule in `content-funnel-map.md` (at Phase 0a the constraint is TOFU reach and the MOFU email rung; BOFU is easy to over-index on), **flag it if TOFU is not the largest bucket** — e.g. "⚠ balance: BOFU (4) outweighs TOFU (2); do not build a shelf of kit content while the top of the funnel is empty."

   **(d) Stale list.** List every asset whose `status` is between `hooked` and `edited` (inclusive) that has been idle more than 14 days (file mtime > 14 days ago). These are pieces stuck mid-pipeline; the scanner also emits them as 🟠 REVIEW. Say "advance it or park it" for each.

   **(e) Scanner findings.** Reproduce any 🔴 HARD and 🟠 REVIEW lines from step 1 verbatim, so the board shows exactly what the gate is blocking.

3. Close with a one-line read of the whole board (where the bottleneck is), and remind Keith the board is a view: nothing was edited, posted, or approved.

---

## Job 2 — TRANSITION (edit one asset, gate-checked)

A spoken update maps to a frontmatter edit on one asset. **Check the gate BEFORE writing**, make the single edit, then **re-run the scanner on that one file** and revert if it fails.

First, resolve the target asset from the slug (or the marker Keith names) in `assets/`. If more than one could match, ask which; do not guess.

**The maps:**

- **"<slug>'s shot" / "recorded"** → set `status: recorded`. (Requires the piece to already be `scripted` with a script in the body; the scanner's G1 enforces that.)
- **"edited"** → set `status: edited`.
- **"approve <slug>"** → set `status: approved`, but **only if** `preflight` is `green`, or `preflight` is `amber-ewa` **and** its `ewa_task` is set and that ClickUp task is closed, **and** `canonical_asset` is set (or the net-new claim went to Ewa). If preflight is not green (or amber-ewa with a still-open Ewa task), **refuse** and cite the gate: "cannot approve — preflight is `<value>`; run /compliance-preflight and get it to green, or close the Ewa task first." Never approve on Ewa's behalf.
- **"thumb done for <slug> <platform>"** → confirm the thumbnail file exists in the asset's Drive `thumb` subfolder before crediting it: check via the gws CLI (business account) or the Drive connector. If you can confirm it, set that rendition's `status: thumbnail-done`. If you cannot verify it (Drive unreachable, or the connector is on the personal account), ask Keith to confirm the file is there, and only on his yes set `thumb_confirmed: true` on that rendition (the scanner accepts that as the checked flag) and advance it.
- **"scheduled"** → set that rendition's `status: scheduled`. G3 requires the parent asset to be `approved` and, unless `thumb: none`, a confirmed thumbnail (a `thumbnail-done` rendition or `thumb_confirmed: true`); the scanner blocks it otherwise.
- **"posted <url>" / "published"** → set the rendition's `status: published` and write the `url:` (and `publish_date:` = today). A url is **required** for `published` — G4 blocks it without one; if Keith did not give a url, ask for it before writing.

**After any transition:** re-run the scanner on just that file —

```bash
node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets/YYYY-MM-DD-<slug>.md
```

If it exits 2, **revert the edit** (restore the previous frontmatter values) and report the gate that blocked it, verbatim. If it exits 0, confirm the new state in one line.

## Hard rails (every run)

- **Never post to a platform.** This skill only records that Keith posted; the go button is always his.
- **Never approve on Ewa's behalf**, and never set `preflight: green` here — that stamp is `/compliance-preflight`'s. Sign-off stays with Ewa (clinical/claims) or Keith (business).
- **ClickUp is a read-only mirror.** The nightly sync writes git → ClickUp one way. If git and ClickUp disagree, git wins; never edit the asset to match ClickUp.
- **The scanner is the floor.** If a move is blocked, the answer is to fix the underlying gate, not to hand-edit `status` past it.
