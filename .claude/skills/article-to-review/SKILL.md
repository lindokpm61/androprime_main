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
2b. **A blanket approval must be exploded into one record per artefact before
   any of them publish.** "Ewa approved the batch" over email, or in a git
   commit message, is not an audit trail: it cannot be produced later for a
   specific slug, which is exactly what a substantiation request asks for.
   Either open a review task per article, or write a single approval record
   that lists every covered slug and register it. If a batch ever ships on a
   blanket sign-off, that record is the deliverable, not the reassurance.
   (Observation 71.)
2c. **Read sign-off state from ClickUp, never from the artefact.** The hub is
   list `901218140081` (blog-article Content Review, workspace `90121729875`),
   where a **completed task IS the approval**. A `{/* TODO Ewa */}` block, a
   "pending" note or an unticked box inside the article is stale the moment the
   reviewer acts, and a missing repo register row is not absence of sign-off.
   Both misreads have produced false escalations to Ewa (2026-07-13, and twice
   on 2026-07-31). **When an approval lands, delete the marker it was blocking
   on in the same write** — the approval step already knows the slug, so this
   belongs there rather than in a later sweep. (Observations 87, 92.)
3. **The DB is the source of truth the moment `draft-writer` runs.** After that,
   a change to `article-drafts/{slug}.mdx` is **not live until you re-run
   `draft-writer.ts`** (it writes a new revision and re-upserts). Editing the
   mdx alone, or editing the live row by hand, desyncs the two.

   **Revising something already at `in_review` needs the stage round-tripped, and
   no second task.** `draft-writer` selects only `stage='brief_ready'` and
   `signoff-concierge` only `stage='drafted' AND clickup_task_id IS NULL`, so an
   item at `in_review` with a task id is invisible to both: re-running them is a
   silent no-op that prints "done." (This invariant used to claim it "re-gates".
   It does not. Found the hard way 2026-07-30.) Instead:

   1. Set `stage='brief_ready'` on the pipeline row.
   2. Run `draft-writer` (writes the new revision, advances to `drafted`).
   3. Restore `stage='in_review', blocked_on='ewa'`.
   4. **Do not** re-run `signoff-concierge`. The preview route renders from the
      DB, so the existing task's link already serves the new revision. A second
      submission would duplicate the reviewer's queue.
   5. Repin `content_review_log.revision_id` to the new revision. Nothing does
      this automatically, so after any re-draft the audit row otherwise points at
      a superseded revision.

   Verify the render before handing it back: `signoff-concierge` skips the row, so
   the compile-gate has to be run directly (`compileGate` from
   `content-engine/compile-gate.ts`).
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

#### Phase A's six failure modes, all observed on live selections

**1. Do not trust `keyword_queue` to answer "what next?" — check its staleness
first.** The queue is the intended entry point for selection and it is the one
store nothing writes back to: the documented reconciler (`reconcile-coverage.ts`)
writes live status into the CSV and **not** into the queue, so it only ever
moves forward by hand. On 2026-08-06 all three rows at
`status=accepted, coverage_status=briefed` were for articles that had been LIVE
for six weeks, and the remaining candidates were a seven-week-old import, mostly
off-strategy. Open the selection step with a staleness assertion — max
`updated_at` on the queue against the newest published artefact — and **fail
loudly** rather than returning a plausible-looking stale list. A human decision
gate is only as good as the freshness of the store it reads, and the store a
human reads to make an irreversible call is usually the last one to get
automated write-back, because automation reconciles the stores automation
consumes. (Observation 162.)

**2. Answer "has this already been done?" from `keyword_coverage` frontmatter,
not from the queue.** Every published article carries a machine-readable block
naming `primary_query`, `hub_also_targets`, `not_owned_here` and the covered
source rows — an exact statement of what is already claimed. A candidate reached
a shortlist despite being verbatim the `primary_query` of an article live for
weeks, caught only by an unprompted manual grep. Collect every `primary_query`
and `*_also_targets` across live content and reject any colliding candidate. The
same pass gives you the union of `not_owned_here`, which is the **pre-sanctioned
candidate pool** — a question the selection process had been answering by hand
from briefs. Gates fed by a store nothing updates fail in the direction of "no
conflict found", the silent and expensive direction, while the authoritative
answer sits unread in the artefact itself. (Observation 172.)

**3. A missing metric is `n/a`, never `0`.** DataForSEO omits
`keyword_difficulty` entirely for some terms — the key is absent, not present
with value 0. A prior selection doc recorded two candidates at **KD 0** and
called one "the cleanest gap on this list". Absence and zero are opposite
claims, and for difficulty, risk and cost metrics the coercion always errs
toward "do it": a missing value silently becomes the most persuasive number on
the table. Render absent metrics as `n/a`, say so in the doc's legend, and **do
not rank a candidate on a difficulty it does not have** — its case has to rest
on the SERP verdict. The mirror failure is already known here: several keywords
return no `search_volume` field, and a doc once carried one such term at a stale
8,100/mo. (Observation 171.)

**4. A supplier metric without a SERP verdict beside it is not a ranking.** Four
prioritised recommendations failed re-validation, each in a way the numbers
could not reveal: difficulty 0 on a term whose results page is entirely product
listings (not addressable by an article at all); a low-difficulty term whose
page turns out to be a rare-disease result (off-positioning); two
"highest-leverage" targets whose real difficulty was 55-64; and one entry citing
volume for a term that now returns none. The metric scores the competition, not
whether the intent is one we can serve, and only opening the results page
separates these. Record the qualitative check **in the same row** as the metric,
treat a row without one as **unranked** rather than as a low-priority ranked
entry, and put the pull date in the row so staleness is visible at the point of
use. (Observation 163.)

**5. The CTA is transcribed from the routing map, never reasoned to.** A
selection doc asserted which product a new article should route to by reasoning
from product knowledge — this topic is closest to that product, therefore route
there. The codebase holds a single routing map that is the declared source of
truth for exactly that decision, and it routes the topic category to a neutral
email-capture destination with an explicit null product. The map's own comment
warns against the precise inference made. The wrong answer was written into the
selection doc twice, copied into a status file, and survived into the brief
before the map was opened. So the brief's CTA section must **quote a value read
from the map**: name the file, the key looked up, and the resolved destination.
A section whose content must be transcribed from a named file cannot be answered
from memory. **The tell that you are in this failure mode is fluency** — knowing
the domain well enough to derive a plausible answer is exactly what stops you
opening the file. (Observation 173.)

**6. Seed BEHIND the gate, and never read "nothing to promote" as "checks
passed".** After a queue rebuild, the item about to be worked on was seeded
directly in its **post-gate** state, because that was its intended destination.
`promote-keyword.ts` then selected on the pre-gate state, found nothing, and
exited reporting *"is already accepted, nothing to promote"* — which reads like
success. The anti-cannibalisation checks never ran. A wrapper checking the exit
code, or an operator skimming, would have recorded a passed gate that never
executed. Fixed by reverting the row and re-running, which reported CLEAR
legitimately. **A skipped gate and a passed gate produce the same final state**,
so any process that both seeds records and enforces transitions on them must
seed behind its own gates, and the gate's side effects (logging, checks, audit
rows) are part of the intended outcome, not overhead. (Observation 174, related
to 172 — both are gates answering from the wrong store.)

### Phase B — draft the article (`/article`)

Invoke the **`/article`** skill on the slug. It reads the brief, does the
14-point voice pass + the Section 9a AI-tells pass, verifies **every** source
live (WebSearch + WebFetch, no
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
- **`seed-pipeline` reporting "No brief found for slug X" usually means the brief
  IS there and its frontmatter does not parse.** `findBriefBySlug` wraps each
  per-file parse in try/catch and silently skips anything that throws, so an
  unparseable brief is indistinguishable from a missing one, and the message
  sends you hunting for a missing file or a slug typo. The real cause is almost
  always invalid YAML: hand-authored briefs routinely put prose in frontmatter
  scalars (`vol_uk`, `kit_funnel`, `compliance_gate`, `intent`), and an unquoted
  value containing `": "` parses as a nested mapping and makes gray-matter throw,
  taking the whole frontmatter block with it. Two real examples:
  `vol_uk: cluster ... long-tails: male menopause symptoms 1,600 ...` and
  `kit_funnel: ... Per CA-028 §8: Kit 1 / Kit 3 only ...`.

  **Pre-validate before invoking seed-pipeline**, so a downstream "no brief
  found" becomes an upstream "brief frontmatter invalid":

  ```bash
  # from 09_website-app/frontend
  node -e "const m=require('gray-matter');m.read('../../06_marketing/seo-ai-search/article-briefs/<slug>.md');console.log('frontmatter OK')"
  ```

  And when authoring a brief: any frontmatter value containing a colon, `#`, or a
  leading `[`, `{`, `*`, `&` or quote **must be wrapped in quotes**. A discovery
  step that catch-swallows parse errors makes a malformed record look like a
  missing one, sending the operator to fix the wrong thing. (Observation 33.)
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

**Named rulings go in the draft's `ewa_rulings` frontmatter, never only in a
comment.** If the pre-flight left a 🟠 line that needs Ewa to *decide* something
(rather than just approve the article), `/article` puts one string per question in
`ewa_rulings`. `signoff-concierge` renders each as a real ClickUp **checklist**
item under "Rulings required before approval", and `syncApprovals` will not
approve while any is unticked: it parks on Ewa, comments once, and logs a
`blocked` run. Completed-with-unticked-rulings is a third state, neither pending
nor approved. This exists because the andropause hub (2026-07-29) was approved by
a bare status flip with two CA-028 rulings asked twice, in comments, and never
answered. A binary gate cannot carry a non-boolean answer, so silence read as
yes. Regression-tested by `scripts/test-rulings-gate.ts` (in `npm test`).

**Design any human-operated gate around the response the human will actually
give, not the one that is easiest to parse.** Before choosing what the code
reads, enumerate the plausible ways a reviewer will respond and accept every one
that carries the required meaning: a tick, a comment, a reply, an email, a
verbal "that's fine". Prefer the response carrying the most information over the
one cheapest to read. Where the richest response is free text, store the
*question* as structured data at submission time so the free text can be matched
back to it later. The original rulings gate read the checkbox because a checkbox
is trivially machine-readable, and Ewa answered in prose; that mismatch is what
lost ruling D on 2026-07-30 until it was recovered from an unread email.
(Observation 76.)

**Where the final act happens outside our tooling, invert the gate.** A rule
documented here but executed in ClickUp, Metricool or a platform UI is a
convention, not a gate: nothing stops a human doing the last step without it.
The reliable shape is to make the tool refuse to *produce the publishable
artefact* until the check has been run and stamped on it, so an unchecked
artefact never exists to be published. A `--verify` mode that writes the
pre-flight result onto the asset, plus a generation step that refuses without
that stamp, converts documentation into enforcement. (Observation 78.)

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
it stays parked until complete. **If the task carries a rulings checklist, she
must tick every item too** (see Phase E): `syncApprovals` treats
complete-with-unticked-rulings as parked, not approved. The **orchestrator** takes
it from there: `syncApprovals` sees `in_review` plus a completed task with no
outstanding rulings and moves it to `approved`, then `publisher` flips
`blog_articles.status='published'`. It goes
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
