---
name: content-week
description: >
  Run one week of Andro Prime founder / social content production, end to end.
  Use when Keith says "/content-week", "run the content week", "what's this
  week's content", "produce this week's posts", "give me the week's social", or
  at the start of any content week. This is the executable form of
  sop-weekly-run.md: it reads the board and the queue, picks the week against the
  wellness / TRT / andropause guardrails, drafts every no-camera post via
  /script, drafts the camera lane only if a filming day is booked, runs the
  compliance route on all of it, mints the asset files, and hands Keith one
  record-list plus one approve-list. It orchestrates existing tools; it NEVER
  posts, never schedules on a platform, never approves on Ewa's behalf, and never
  lets the camera lane block the no-camera lane.
---

# /content-week: one week of founder content, drafted and gated

The weekly run used to be prose in `sops/sop-weekly-run.md` that somebody had to
read and improvise from. Nobody fired it, so in the machine's first three weeks
four asset files were minted, two went stale at `scripted`, and zero pieces
reached a platform. Meanwhile Spine A shipped 17 articles, because Spine A had
`/article-to-review` and Spine B had nothing.

This skill is Spine B's equivalent. Every step below is already a tool, a skill
or an SOP; this skill's job is to run them **in the right order, in the right
lane, with the right gates**, and to stop cleanly at "here is what to record and
what to approve" so Keith's go (never this skill) is what puts anything live.

## The happy path (one screen)

```bash
# --- Phase A: read the board (from repo root) ---
node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets

# --- Phase B: pick the week from the queue ---
#   andro-prime/06_marketing/content-machine/content-queue.md  ->  this week's rows

# --- Phase C: Lane 1, no camera (ALWAYS runs) ---
#   /script <angle> linkedin        per LinkedIn row
#   /script <angle> facebook        per Facebook row
#   (Substack: pick an existing draft, no writing)

# --- Phase D: Lane 2, camera (ONLY if a filming day is booked) ---
#   /hook <topic>  then  /script <topic>       per short row
#   /script <topic> long                       per long-form row

# --- Phase E: compliance route, every piece ---
#   /compliance-preflight on each drafted asset

# --- Phase F: hand off ---
#   the record-list (Lane 2) + the approve-list (Lane 1), queue rows marked taken
```

## Hard invariants

1. **You never post, schedule on a platform, or approve.** This skill stops at a
   drafted, pre-flighted asset. Publishing is Keith pressing go on the platform;
   recording it afterwards is `/content-status`. Do not set `content_assets.status`
   to `approved` yourself, do not set `preflight = 'green'` by hand (that stamp is
   `/compliance-preflight`'s), never write `ewa_signed_at` (a trigger refuses it
   outside the sign-off sync), and never close an Ewa task.
2. **Lane 1 runs every single week, unconditionally.** It needs no camera, no
   filming day and no Keith. If Lane 2 is blocked, dark, or Keith is away, Lane 1
   still produces a full week of LinkedIn / Facebook / Substack. **A week where
   Lane 1 did not run is a failed run of this skill**, regardless of what Lane 2
   did. This rule exists because the original design put recording in the
   critical path of every week and the machine went dark for three weeks.
3. **Lane 2 only runs when a filming day is actually booked.** Ask; do not
   assume. Drafting ten shorts nobody will film is how two assets went stale at
   `scripted` for 19 days. If no day is booked, say so in one line, draft
   nothing for Lane 2, and offer to book one.
4. **Every derivative inherits a published, Ewa-signed canonical article and adds
   no claim.** The canonical-asset rule is non-negotiable (`CONTEXT.md`). A queue
   row whose canonical article is still `draft` or `in_review` is **not
   pickable**, no matter how good the angle. A net-new claim goes to Ewa
   (ClickUp list `901218140081`) and its asset waits.
5. **The queue is the input; you never start from a blank page.** If
   `content-queue.md` has fewer than 8 queued Lane 1 rows, refill it as part of
   this run (its Refill rule says how) before picking. Improvising topics is how
   the weekly run silently became a creative exercise instead of a production
   one.
6. **The scanner is the floor under the FILE, not under the pipeline.** After
   every asset is written, scan it. Exit 2 is a HARD block on the identity/craft
   schema, YAML safety, a database-owned key that crept into the frontmatter, or
   a compliance hit in the body. Fix the file; never edit around it. **The
   pipeline gates are no longer here**: approval and scheduling are enforced by
   the database (`09_website-app/database/migrations/20260801_content_state_guards.sql`)
   and a clean scan says nothing about whether a piece may ship.
7. **The file owns identity and craft; the database owns state.** The asset file
   holds the slug, funnel block, which renditions exist and the script; `content_assets`
   / `content_renditions` hold status, pre-flight, approvals and every rendition's
   schedule and URL. The queue is the plan, ClickUp is a read-only mirror.
   **Never write state into an asset file to make a step easier**: that is the
   dual store Phase 1 removed, and the scanner HARD-fails it as `[STATE]`.

## The runbook, phase by phase

### Phase A: read the board (never skip)

**Run `/content-status` for the board.** It is the only sanctioned reader now,
because the board's numbers come from `content_assets` / `content_renditions`
and the asset files no longer carry status at all. Do not build the board by
reading frontmatter: it will look complete and be empty of state.

Then, from the repo root, scan the files for schema and compliance:

```bash
node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets
```

Then read, in this order:

- `andro-prime/06_marketing/content-machine/content-queue.md` (what is queued)
- `andro-prime/06_marketing/content-machine/unified-content-calendar.md` section 1
  (the weekly rhythm and per-channel volume)
- `andro-prime/06_marketing/content-machine/STATE.md` (what is blocked right now)
- `andro-prime/06_marketing/seo-ai-search/content-calendar.md` (which blog
  article publishes this week: it is this week's fresh atomisation source)

Note three things and carry them into Phase B: the **stale list** (anything
between `hooked` and `edited` whose `content_assets.updated_at` is over 14 days
old, from `/content-status` section (d), not from the scanner and not from file
mtime), the **funnel balance** (TOFU must be the largest bucket), and the
**running wellness tally**.

**Stale assets are picked before new ones.** An asset stuck at `scripted` is
work already paid for. Either advance it this week or park it explicitly; do not
draft around it.

### Phase B: pick the week

Target volume, from the calendar: **2 to 3 LinkedIn, 2 to 3 Facebook, 1 Substack,
plus (camera lane) 1 to 3 shorts and up to 1 long-form.**

Pick against the guardrails, in this order:

1. **Wellness floor ~40%.** Count `[W]` rows in the picks. If under 40%, swap a
   clinical-curious row for a wellness one before proceeding.
2. **TRT stays ~0%.** Not a sign-off question; it is the Phase 0 boundary.
3. **Andropause is deliberate, not habitual.** CA-028 is approved and the Pillar E
   hub `andropause-male-menopause` published 2026-07-30, so it IS the largest
   available shelf (~12 to 15k/mo) and it currently has zero derivatives. Pick
   against it unless there is a stated reason not to, and say the reason. Each
   pick still needs its own pre-flight plus Ewa's own sight before it ships.
4. **TOFU stays the largest bucket.** If the board already leans BOFU, pick TOFU.
5. **Fresh blog article this week?** It is worth roughly 1 LinkedIn + 1 Facebook
   + 1 Substack republish. Prefer it over an older queue row, and add its rows to
   the queue if they are not there.

Show Keith the picked list before drafting (one line per row: ID, angle, lane,
canonical, funnel). If he vetoes any, take the next queued row of the same type.

### Phase C: Lane 1, no camera (always)

For each picked LinkedIn row, invoke **`/script <angle> linkedin`**. For each
Facebook row, **`/script <angle> facebook`**. `/script` already does the whole
job: loads the avatar, hook playbook, written-post playbook, compliance rails
and the atomisation model, refuses off-limits topics, stamps the funnel tag, and
(its Step 5) mints or updates the asset file, adds the platform rendition, and
scans it. **Do not reimplement any of that here, and do not hand-write posts.**

For the Substack row there is usually nothing to write: the 17 articles published
as at 2026-07-27 were pushed as drafts by `substack-draft.ts` that day. Pick one,
note its draft id, and send it to Phase E. **Exception, and check this rather than
assuming:** `andropause-male-menopause` published 2026-07-30 and has no Substack
draft, so it needs a `substack-draft.ts` push before it can enter the rota. Any
article published after 2026-07-27 has the same gap; confirm against the live
draft list rather than trusting the "all articles were pushed" line. If the article needs a fresher teaser or a different
destination, refresh the existing draft rather than making a new one:

```bash
# from andro-prime/09_website-app/frontend
npx tsx scripts/content-engine/substack-draft.ts --update <draftId> --dest lp/energy-recovery
```

The script is **draft-only by design** and has no publish path. Keep it that way.

**Carry `/script`'s flags forward.** Anything it marked (a real number needed, a
claim-inheritance check, a canonical article that is still a draft) goes into the
Phase F report verbatim. Do not resolve a flag by softening the copy.

**Then run the batch shape check, across the week, before Phase E.** `/script`
Step 4b compares each piece against the last five in its channel. That is not
enough here, because this skill drafts a whole week in one session from one queue
and the pieces converge on *each other* before any of them reaches the library.
Batch production is the highest-convergence mode we have, and it is the one place
a per-piece check cannot see the problem.

Lay this week's drafts side by side and compare four things only:

1. **Opening construction.** No two pieces this week open the same way.
2. **Closing construction.** No two pieces this week arrive at the closing
   question by the same route. Keep every question; vary the approach.
3. **Hook archetype.** Already rotates well (6 archetypes across the 17 live
   assets), so this should pass. Confirm rather than assume.
4. **Target emotion.** Recognition-family currently runs 10 of 15. Two in a week
   is fine; a whole week of it is not.

Where two pieces collide, the one further from its filming or posting date gets
rewritten. Report what you changed in Phase F.

**A weekly batch that is internally varied can still converge on the library.**
Both checks run: Step 4b against history, this one against the week. Passing one
is not passing the other.

### Phase D: Lane 2, camera (conditional)

**First, ask: is a filming day booked this week?** If the answer is no, write one
line ("Lane 2 skipped: no filming day booked; N rows still queued"), skip to
Phase E with Lane 1 only, and offer to book one. That is a complete, successful
run.

If a day is booked, work in this order:

1. **`C-01` Ep 0 baseline first, always, until it is recorded.** It gates the
   whole founder series and the before-state is unrecoverable once Keith's
   numbers move. Do not schedule other shoots ahead of it.
2. **Advance the stale assets** (`C-02`, `C-03`) before drafting new shorts.
   They are already `scripted`; they need recording, not rewriting.
3. **New shorts:** `/hook <topic>` (it scores against `hook-rubric.md` and mints
   the asset file), then `/script <topic>` on the chosen hook.
4. **Long-form:** `/script <topic> long`, Line 1 explainer for anything atomised
   from an article, Line 2 only for Keith's own journey.

Batch to what one session can realistically shoot. The kit is a tripod, a lav
mic and window light, one take per piece (`sop-founder-short-form.md`), so 2 to 3
shorts or 1 long-form is a real session. Drafting more than will be filmed
recreates the stale-asset problem.

### Phase E: the compliance route (every piece, both lanes)

Run **`/compliance-preflight`** on each drafted asset per
`sops/sop-compliance-route.md`. Then:

The pre-flight result is state, so it is written to `content_assets`, never to
the asset file:

- green: `preflight = 'green'` with `preflight_date`, and the asset waits for Keith.
- amber: queue it to Ewa on ClickUp list `901218140081` **early in the week**,
  set `preflight = 'amber-ewa'` and `ewa_task` on the row, and leave the asset
  parked. Sign-off is the thing most likely to become the bottleneck, so it goes
  out first, not last. **Do not set `ewa_signed_at`**: only the sign-off sync may
  write it, a trigger enforces that, and an `ewa_task` on its own proves a
  question was asked, not answered.
- red: the asset does not advance. Fix the copy or drop the row back to
  `queued`. Never route past a red.

Most derivatives should pass without a fresh Ewa step: they inherit a signed
canonical article and add no claim. **An amber on a supposedly claim-free
derivative usually means the derivative exceeded its source.** Check that before
escalating to Ewa.

Re-scan every touched asset:

```bash
node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets
```

### Phase F: hand off (where this skill stops)

Update `content-queue.md`: mark every picked row **taken** and write its
asset-file slug into the row. Then give Keith exactly two lists plus the
exceptions:

```
RECORD (Lane 2, needs the camera)
  <slug> ... <format> ... <one-line what it is>

APPROVE AND POST (Lane 1, ready now)
  <slug> ... <platform> ... <one-line what it is>   [pre-flight: green]

WITH EWA        <slug> ... <task url> ... <the flagged line>
BLOCKED         <row> ... <the gate, in one line>
FLAGS           <real numbers needed, canonical still draft, anything to watch>
```

Close by updating `STATE.md` if live status moved (a lane ran for the first
time, an account posted, a blocker cleared) and bumping its date. Then stop.
Nothing here posts, schedules or approves.

## When to fire

- "/content-week", "run the content week", "produce this week's content",
  "what's this week's social", at the start of a content week.
- After a blog article publishes (it is a fresh atomisation source: worth a
  partial run to pick up its derivatives).
- After Ewa signs off something that was blocking a lane. (This fired for the
  Pillar E hub on 2026-07-30, which unblocked the largest queued shelf and has
  not yet been picked up.)

## When NOT to fire

- **To post or schedule something.** This skill drafts and gates only. Recording
  what Keith actually posted is `/content-status` ("posted <url>").
- **For a single one-off piece.** Use `/hook` or `/script` directly; the weekly
  run is for the batch.
- **For blog articles.** Spine A is `/article-to-review` and `/publish-article`.
  This skill consumes published articles; it never writes them.
- **When the queue is empty and you would have to invent the week.** Refill the
  queue first (Phase A, invariant 5). A run built on improvised topics is worse
  than no run.
- **Mid-week to "check on things".** That is `/content-status` for the board, or
  the weekly verification pass in
  `12_operations/sops/content-machine-verification.md`.

## Pairing

- **`content-queue.md`** the input. The standing backlog of angles, two lanes,
  with canonical / funnel / CTA already decided.
- **`sops/sop-weekly-run.md`** the prose SOP this skill executes. If the two
  disagree, fix both; do not let them drift.
- **`/hook`, `/script`** Phases C and D. They own the craft, the rubric, the
  refusals and the asset-file minting. This skill sequences them.
- **`/compliance-preflight`** Phase E. Necessary, never sufficient: Ewa's
  ClickUp completion is the gate for anything net-new.
- **`/content-status`** the board (Phase A) and the after-the-fact transitions
  Keith speaks ("recorded", "posted <url>").
- **`substack-draft.ts`** the Substack lane. Draft-only; publishing stays a human
  click.
- **`12_operations/sops/content-machine-verification.md`** the weekly check that
  what this skill promised actually shipped. It verifies; this skill produces.
- **`/wrap`** end-of-session close-out (STATE / ClickUp / commit by path) once
  the week's pack is handed over.
