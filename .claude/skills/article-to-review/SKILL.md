---
name: article-to-review
description: >
  Take an Andro Prime blog article the whole way from an approved keyword to a
  draft queued for Ewa's clinical sign-off in ClickUp. Use when the task is
  "run the pipeline for slug X", "draft and queue article Y for Ewa", "take
  brief Z all the way to review", or "get the <name> hub into review behind the
  last one". This is the A-to-G runbook: it promotes the keyword + scaffolds the
  brief (A), invokes /article to draft (B), adds the optional Unsplash photo (C),
  seeds the DB pipeline + registers the draft (D), submits it to Ewa via
  signoff-concierge (E), and hands off the auto-publish (F) + mirror/atomise (G).
  It orchestrates existing tools; it never reimplements them, never grants Ewa
  sign-off, and never flips an article live by hand.
---

# /article-to-review — approved keyword → draft queued for Ewa

The one runbook for the DB content pipeline. Every step below is already a tool
or a skill; this skill's job is to run them **in the right order, with the right
gates, from the right directory**, and to stop cleanly at `stage=in_review` so
Ewa's ClickUp completion (not this skill) is what takes anything live.

The on-ramp exists because a **hand-authored** article (brief written by hand,
drafted straight into `article-drafts/` via `/article`) skips the keyword queue,
so nothing ever creates its `content_pipeline` row and no ClickUp review task is
made. `seed-pipeline.ts` is the missing link. First run through end to end:
FAI+SHBG hub, 2026-07-15 (commit `3af4911`).

## The happy path (one screen)

```bash
# --- Phase B: draft (from repo root; /article is a skill, not a shell cmd) ---
#   invoke the /article skill on the brief's slug   ->  article-drafts/{slug}.mdx

# --- Phase C: photo (optional) — from 09_website-app/frontend ---
node scripts/unsplash.mjs search "<subject query>"     # 12 candidates
node scripts/unsplash.mjs use {slug} <photoId>         # you pick; writes photo* + fires ToS trigger

# --- Phase D: into the DB — from 09_website-app/frontend ---
npx tsx scripts/content-engine/seed-pipeline.ts --slug {slug}   # seed the content_pipeline row
npx tsx scripts/content-engine/draft-writer.ts                  # register mdx -> blog_articles (draft), stage='drafted'
#   DO NOT use `--run` here: it auto-chains signoff-concierge, which then renders the
#   compile-gate preview against the LOCALHOST base URL from .env.local and BLOCKS
#   ("preview render request failed: fetch failed"). Keep signoff to Phase E with the
#   prod base URL. (Alternatively, one-shot it: prefix the --run with
#   CONTENT_ENGINE_BASE_URL=https://andro-prime.com — but you lose the --dry gate below.)

# --- Phase E: submit to Ewa — from 09_website-app/frontend ---
CONTENT_ENGINE_BASE_URL=https://andro-prime.com \
  npx tsx scripts/content-engine/signoff-concierge.ts --dry   # compile-gate only, no task
CONTENT_ENGINE_BASE_URL=https://andro-prime.com \
  npx tsx scripts/content-engine/signoff-concierge.ts         # creates the ClickUp "Review:" task
```

Everything after that (Ewa approves → auto-publish → mirror) is Phases F–G below
and is **not** this skill's to trigger by hand.

## Hard invariants

1. **You never publish, and you never grant sign-off.** This skill stops at
   `stage=in_review, blocked_on='ewa'`. Going live is Ewa marking her ClickUp
   task **complete**, which the **orchestrator** (`syncApprovals` → `publisher`)
   picks up and flips `blog_articles.status='published'`. Do not hand-edit that
   row, do not run `/publish-article` to force it, do not close Ewa's task for
   her. Compliance HIGH gate = Ewa's review; `compliance-preflight` (run inside
   `/article`) is necessary, never sufficient.
2. **The brief is the spec, and it must be ready before Phase B.** `status:
   brief-ready`, Section 19 open questions resolved by Keith. No brief → write
   the brief first (that process surfaces decisions drafting can't). `/article`
   enforces this too; don't route past it.
3. **The DB is the source of truth the moment `draft-writer` runs.** After that,
   a change to `article-drafts/{slug}.mdx` is **not live until you re-run
   `draft-writer.ts`** (it writes a new revision and re-upserts). Editing the
   mdx alone, or editing the live row by hand, desyncs the two. Re-draft →
   re-run draft-writer → (if already submitted) it re-gates.
4. **Run the scripts from `09_website-app/frontend`.** The content-engine tsx
   scripts resolve `../../..` to the repo root and read `frontend/.env.local`.
   From anywhere else they misresolve paths or lose env.
5. **The photo never touches og:image, and is never hand-written.** `og:image`
   stays the branded generated card (`/api/og/blog/{slug}`) regardless. Only
   `scripts/unsplash.mjs use` may write the `photo*` frontmatter — it fires the
   ToS-mandatory download trigger a hand-edit skips (attribution breach). Pick by
   hand, never auto-pick (health-context risk); skip the photo rather than force
   a weak one. `imgSrc` stays unset.
6. **The on-ramp is idempotent; re-running is safe.** `seed-pipeline` won't
   duplicate a row (a row still at `briefed` is advanced to `brief_ready`; one at
   `brief_ready`+ is left alone). `signoff-concierge` is keyed off `stage`, so a
   second run won't double-post. Safe to resume a half-finished pipeline.
7. **Queueing is just submission order.** Several articles can sit `in_review` at
   once as separate ClickUp tasks. "Queued behind the last one" means submitted
   after it; there is no hard ordering except the hub/spoke co-publish rule
   (a spoke's up-link 404s if its hub isn't live — that is `/publish-article`'s
   gate at go-live, but keep it in mind when sequencing what you submit).

## The runbook, phase by phase

### Phase A — decide what to write (prerequisite)

Owned upstream; confirm it's done, don't redo it blindly.

- **Keyword:** a `status=validated` row in
  `06_marketing/seo-ai-search/keywords.csv` with `kd_source=dfs` (DataForSEO,
  not a guess). A candidate is promoted `candidate → accepted` through the
  guarded promoter, which runs the coverage-rules §4b anti-cannibalisation
  checks and refuses on a trip:

  ```bash
  # from 09_website-app/frontend
  npx tsx scripts/content-engine/promote-keyword.ts --query "<query>" --dry
  npx tsx scripts/content-engine/promote-keyword.ts --query "<query>"
  ```

- **Brief:** `article-briefs/{slug}.md`, the 21-section spec (SERP gap, coverage
  map, compliance gate, CTA to `/kits/*`). Hand-written, or scaffolded by
  `brief-architect.ts`. Must be `status: brief-ready` with Section 19 resolved.

If A isn't done, stop and do A (or hand back to Keith). Don't draft past an
unresolved brief.

### Phase B — draft the article (`/article`)

Invoke the **`/article`** skill on the slug. It reads the brief, does the
13-point voice pass, verifies **every** source live (WebSearch + WebFetch, no
`SOURCE TODO`), assembles the MDX + JSON-LD schema, auto-runs
`compliance-preflight`, writes `article-drafts/{slug}.mdx` (named by **slug**,
even for a `pillar-X-hub-{slug}.md` brief), and fills the brief's Section 21
delivery report. It **does not** publish and **does not** create the DB row.

Carry `/article`'s handoff (voice X/13, 🔴/🟠/🟢, audit PASS/FAIL, 🟠 lines for
Ewa) into this skill's final report — Ewa needs to see the flagged lines.

### Phase C — add the photo (optional, human-curated)

From `09_website-app/frontend` (network needs the sandbox disabled):

```bash
node scripts/unsplash.mjs search "<subject query>"   # 12 candidates: id, photographer, alt
node scripts/unsplash.mjs use {slug} <photoId>       # you pick; writes photo* + fires ToS trigger
```

Single relevant subject, editorial not stocky, nothing clinical/distress/
off-brand in a health context. Resolves the slug in `article-drafts/` or
`content/blog/`. Optional: skip it and the article still ships on the generated
OG. Surface photographer + Unsplash URL in the report so Keith can swap
(`use {slug} <newId>`).

### Phase D — get it into the database (source-of-truth step)

From `09_website-app/frontend`, run these two **separately** (not `--run`):

```bash
npx tsx scripts/content-engine/seed-pipeline.ts --slug {slug}   # seed content_pipeline (brief_ready)
npx tsx scripts/content-engine/draft-writer.ts                  # register mdx -> blog_articles, stage='drafted'
```

- `seed-pipeline` creates the `content_pipeline` row at `stage='brief_ready'`
  (mirroring the shape `brief-architect` uses), locating the brief by matching
  frontmatter `slug`. `draft-writer` then reads `article-drafts/{slug}.mdx`,
  upserts it into `blog_articles` (`status='draft'`) with a revision, and
  advances the pipeline to `stage='drafted'`.
- **This is the moment the DB becomes the source of truth for the article.**
- **Avoid `seed-pipeline --run` here.** `--run` chains draft-writer AND
  signoff-concierge in one go, but signoff then renders its compile-gate preview
  against the **localhost** base URL in `.env.local` and blocks
  (`preview render request failed: fetch failed`). Keeping signoff in Phase E
  (with `CONTENT_ENGINE_BASE_URL=https://andro-prime.com`) also preserves the
  `--dry` gate. If you do want one-shot, prefix the `--run` with the prod base
  URL so the chained signoff renders against prod. `--dry` on seed previews
  without writing. (First live run, 2026-07-15: `--run` blocked on localhost;
  re-running signoff with the prod URL cleared it.)

### Phase E — submit to Ewa in ClickUp (`signoff-concierge`)

From `09_website-app/frontend`, with a **reachable** base URL + `PREVIEW_SECRET`
in env:

```bash
CONTENT_ENGINE_BASE_URL=https://andro-prime.com npx tsx scripts/content-engine/signoff-concierge.ts --dry
CONTENT_ENGINE_BASE_URL=https://andro-prime.com npx tsx scripts/content-engine/signoff-concierge.ts
```

It: **compile-gates** the draft by rendering `/blog/preview/{slug}?token=…`
(proves it renders before bothering Ewa — a localhost base URL with no dev
server fails here and blocks on Keith, so use the prod URL for a prod draft);
creates the ClickUp task **"Review: {title}"** on Ewa's Content Review list with
the preview link; writes a `content_review_log` row (`submitted` — the CQC/ASA
audit trail); flips `content_pipeline` to `stage='in_review', blocked_on='ewa'`.
Run `--dry` first: it still compile-gates but creates **no** task, so you confirm
the render before posting. **This is where the skill stops.**

### Phase F — Ewa approves → live, no redeploy (handoff, not yours to trigger)

Ewa opens the task, reviews the **rendered preview** (the HIGH-gate clinical
check), and marks the task **complete** to approve. Comments = change requests;
it stays parked until complete. The **orchestrator** takes it from there:
`syncApprovals` sees `in_review` plus a completed task and moves it to
`approved`, then `publisher` flips `blog_articles.status='published'`. It goes
live at `/blog/{slug}` **with no Coolify rebuild** — the
live site reads `blog_articles`. The orchestrator runs on its schedule; if you
need to reconcile immediately, running `orchestrator.ts` is Keith's call, not a
hand-flip of the row. If Ewa requested changes: re-draft → re-run `draft-writer`
(new revision) → it re-gates.

### Phase G — after live (mirror + atomise, handoff)

- **Mirror:** `sync-mirror.ts` syncs the `content/blog/{slug}.mdx` git mirror
  **from the DB** (commit `[skip ci]`), keeping the repo copy in step with the
  source of truth. It follows go-live; it doesn't drive it.
- **Atomise:** the live hub gets broken down into social / email / YouTube
  assets via the content-library / content-machine flow (ClickUp Content
  Library). Separate workstream; note it in the handoff, don't block on it.

## When to fire

- "Run the pipeline for `{slug}`", "draft and queue `{slug}` for Ewa", "take
  brief X all the way to review", "get the `<name>` hub queued behind the last".
- The brief is `brief-ready` with Section 19 resolved, and the author pages
  (`/authors/keith-antony`, `/authors/dr-ewa-lindo`) exist.

## When NOT to fire

- **No brief, or a brief with open Section 19 questions** — Phase A first;
  Keith resolves the questions. Don't draft past them.
- **HIGH compliance gate unresolved** — never route past it without Ewa input.
- **Already in the pipeline past `brief_ready`** — check `content_pipeline` for
  the slug first (`stage` = `drafted`/`in_review`/`approved`/`published`). If a
  step stalled, resume that step directly rather than re-running from A; the
  on-ramp is idempotent but jumping back to `/article` re-drafts over work.
- **Just the go-live** of an already-signed-off article — that's the orchestrator
  (DB flow) or `/publish-article` (git-mirror flow), not this skill.

## Pairing

- **`/article`** — Phase B. Drafts + gates the copy; hands the draft to this
  runbook. Never publishes.
- **`compliance-preflight`** — auto-invoked inside `/article` at draft time.
  Its clean run is the pre-check; **Ewa's ClickUp completion is the gate.**
- **`scripts/unsplash.mjs`** — Phase C photo tool (search → human pick → `use`
  writes `photo*` + fires the ToS download trigger).
- **`content-engine/` scripts** — `promote-keyword` (A), `brief-architect` (A),
  `seed-pipeline` + `draft-writer` (D), `signoff-concierge` (E), `orchestrator`
  (F auto-publish), `sync-mirror` (G).
- **`/publish-article`** — the older **git-mirror** go-live path. In the DB flow
  the orchestrator auto-publishes on Ewa's completion, so `/publish-article` is
  **not** part of this runbook; it stays for non-DB / git-mirror articles. Don't
  use it to shortcut Ewa's gate.
- **`/wrap`** — end-of-session close-out (STATE/ClickUp/commit) once the article
  is submitted.
