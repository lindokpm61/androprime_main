# Content pipeline: automation plan

_Drafted 2026-07-31. **Status: APPROVED (Keith, 2026-07-31). Phase 0 and Phase 1 are BUILT
as of 2026-08-01; Phases 2 and 3 are not started.** Owner: Keith._

_**Header corrected 2026-08-01.** It read "Nothing built yet" and "Phase 0 is the next thing
to build and does not exist" for the whole of the day on which both phases were built. Left
uncorrected it would have been the plan's own instance of the failure the plan is about, on
the line a reader reaches first. `STATE.md` already records the rule from the X handle change:
a doc's status line is the first thing anyone reads and the last thing anyone updates._

_Approved as the plan of record; the phasing in section 5 is the build order. The one decision
that was left open at approval, draft-or-live on the Metricool step, is now settled: **draft**
(see section 7)._

_**Revised after approval, same day, and the revision is material.** Section 7's
"build machine-side" recommendation rested on a guess about cloud agents that turned
out to be backwards: a claude.ai routine attaches MCP connectors explicitly, so
Supabase, Metricool and ClickUp are all reachable from the cloud with no new
credential. The recommendation is now split per job, and only the two Drive jobs are
pinned to Keith's machine. `pg_cron` is dropped rather than deferred. Section 5 Phase 0
gains the doctor's three homes and the rule that decides them._

Written after a session that took several hours to move two LinkedIn posts and four
drafts through the machine. The plan starts from where that time actually went,
measured rather than assumed, because the obvious answer ("automate the writing")
is the wrong one.

---

## 1. Where the time actually goes

Drafting is not the bottleneck. On 2026-07-31 a single agent drafted four
complete Pillar E derivatives, with hooks, craft notes and line-by-line claim
inheritance tables, in about ten minutes. Writing is close to free.

The hours went here:

| What happened | Class |
| --- | --- |
| Four assets existed as files with no `content_assets` row, so they were invisible to the board and to `/content-status`. Discovered by accident, twice. | drift |
| A Metricool post id changed on every edit (356516876 → 356519886 → 356521803) and silently staled the repo and the DB copies. | drift |
| `canonical-article` was added to the CTA vocabulary in the docs and never to the database check constraint, so the DB refused the value the docs prescribe. | drift |
| Two dead `{/* TODO Ewa */}` markers had been asserting a blocking condition for sixteen days after the condition cleared. | drift |
| A published-article count of 17 was stale in five places, and the first correction fixed the article count while leaving the channel count stale. | drift |
| A compliance scanner false positive had been sitting on an Ewa-approved article, unresolved. | detector defect |
| A lint hook fired about twenty times on text nobody had touched. | detector defect |

**Almost none of it was creative work, and almost all of it was reconciliation
between stores that nothing was watching.** So automating generation saves
roughly ten minutes. Automating reconciliation saves hours.

One category deliberately excluded from the list above: the compliance review
took real time and found three genuine issues, one of which nobody had logged.
That is not waste and it is not a candidate for removal.

---

## 2. Root cause

_**Diagnosis as of 2026-07-31, and the first line of it was FIXED by Phase 1 on
2026-08-01.** Frontmatter no longer holds status, preflight, ewa_task, rendition
status or ids: the database does, and two detectors fail the build if a copy
reappears. The rest of the diagnosis stands, because Metricool, ClickUp and Drive
still hold their own truth and Phase 2 is what reconciles those. Kept as written
rather than rewritten, since it is the argument for everything below it._

State lives in three places at once and is reconciled by hand.

```
  repo markdown frontmatter   <-- status, preflight, ewa_task, rendition status, ids
  Supabase content_* tables   <-- the same fields again
  Metricool / ClickUp / Drive <-- the actual truth about what is scheduled and signed
```

Nothing detects disagreement. Every failure above is the same shape: two copies of
one fact, one of them updated, no alarm.

**The single highest-value change is to stop storing state twice.** The markdown
file is where the craft lives: the hook, the script, the craft notes, the
inheritance table. That is worth keeping in git, reviewable in a diff. The
*state* (status, pre-flight colour, sign-off, scheduled time, external ids)
should live in the database only, because that is what the integrations read and
write. Frontmatter keeps the identity fields (slug, title, canonical asset,
channel) and loses the rest.

---

## 3. The rule that governs everything below

> **Automate the plumbing. Never automate a gate.**

Plumbing is mechanical and reversible: creating a row, creating a folder, creating
a task, moving a file, scheduling an already-approved post, syncing an id,
detecting drift.

A gate is a judgement someone is accountable for: the pre-flight verdict, Ewa's
clinical sign-off, Keith's business approval. Those stay human, and the
automation's job is to make them *cheaper to reach and impossible to skip*, not
to perform them.

This is not caution for its own sake. Every gate in this business exists because
of a specific incident, and the failure mode that has actually occurred here more
than once is a gate that quietly stopped applying while everything still looked
green.

---

## 4. Target architecture

Two state machines, one event spine. Both machines already exist in the schema;
nothing enforces or advances them today.

**Asset (creative) lifecycle** — `content_assets.status`
```
idea -> hooked -> scripted -> recorded -> edited -> approved -> done
```

**Rendition (distribution) lifecycle** — `content_renditions.status`
```
to-produce -> thumbnail-done -> scheduled -> published -> measured
```

Keeping them separate is correct: one script becomes three renditions on three
platforms with independent fates.

### The spine

A `content_events` table, written by database triggers on every status change,
drained by a worker. `pg_net` is already installed, so Postgres can call the
worker directly on insert, with a periodic sweep for retries.

```
content_events(id, asset_id, rendition_id, kind, payload, created_at,
               processed_at, attempts, last_error)
```

Events are the audit trail as well as the queue. "Why did this post go out?"
becomes a query rather than an archaeology exercise.

### The jobs

| Fires when | Does | Talks to |
| --- | --- | --- |
| asset reaches `scripted` and has a video rendition | creates `Content/YYYY-MM/<slug>/{raw,final,thumb}/`, writes `drive_url` back | Drive |
| a file lands in `raw/` | asset to `recorded`, opens an editing task | Drive changes feed, ClickUp |
| a file lands in `final/` | asset to `edited`, opens a thumbnail task if one is owed | Drive changes feed, ClickUp |
| the three thumbs land in `thumb/` | rendition to `thumbnail-done` | Drive changes feed |
| the Ewa review task completes | stamps `ewa_signed_at`, clears the gate | ClickUp webhook |
| asset reaches `approved` | creates one scheduled post per rendition, stores the external id, moves each rendition to `scheduled` | Metricool |
| a scheduled post publishes | rendition to `published`, captures the live URL | Metricool poll |
| seven days after publishing | captures metrics, rendition to `measured` | Metricool |

### Thumbnails are a gate, not a nicety

`sop-thumbnail.md` is explicit that thumbnails are **produced by hand in Figma or
Canva and approved by Keith**. That makes them a human step the pipeline cannot
perform, and therefore one it must refuse to run past.

**One thumbnail per rendition, not one per size** (Keith, 2026-07-31). Size
standardises; creative does not. Three platforms share the 9:16 canvas and each
wants a different image on it, because the cover does a different job on each.
The filename is `<platform>-<format>-<thumb_spec>.png`, which is exactly the
rendition's identity, so the gate is a mechanical file-exists check:

| Rendition | Size | Filename in `thumb/` |
| --- | --- | --- |
| instagram / reel | 1080 x 1920 | `instagram-reel-9x16.png` |
| tiktok / short | 1080 x 1920 | `tiktok-short-9x16.png` |
| youtube / short | 1080 x 1920 | `youtube-short-9x16.png` |
| youtube / long-form | 1280 x 720 | `youtube-long-form-1280x720.png` |
| facebook / link-post | 1200 x 630 | `facebook-link-post-1200x630.png` |
| linkedin / link-post | 1200 x 630 | `linkedin-link-post-1200x630.png` |

The previous convention keyed the filename on size alone, which made storing
more than one 9:16 cover per asset impossible and silently assumed a single
design served all three vertical surfaces. Corrected before any file existed, so
there was no migration. **Model for difference, allow reuse:** copying one export
to three names is a per-asset production decision, but the convention must never
make the difference unstorable.

The schema already anticipates this: `content_renditions.thumb_spec` declares
which size a rendition needs, and `thumbnail-done` already sits between
`to-produce` and `scheduled` in the rendition lifecycle.

**A gate already exists, and it is honour-system.** `content-status/scan.js` G3
blocks a rendition reaching `scheduled` when its `thumb` is set and
`thumb_confirmed` is not `true`. But `thumb_confirmed` is a boolean somebody
types into frontmatter; nothing reads Drive. It is the same self-asserting-flag
shape as the dead `TODO Ewa` markers: an artefact claiming a state that is owned
elsewhere. And there is no `thumb_confirmed` column in `content_renditions` at
all, so the gate guards the file side only and the database side is unguarded.

**MOVED 2026-08-01, and `thumb_confirmed` is retired.** G3 no longer exists;
`gate_rendition_publish()` in `20260801_content_state_guards.sql` holds the rule,
on the database side where the schedule actually lives, and writing
`thumb_confirmed` back into an asset file is now a HARD failure in both
detectors. **The honour-system half is not solved, only relocated and made
honest:** confirmation is still a person saying they looked, recorded through
`/content-status`, until the Phase 2 Drive job derives it from a file-exists
check on `<platform>-<format>-<thumb_spec>.png`. What changed is that the claim
now sits in the store that gates on it instead of in a file asserting a fact
about a third system.

The fix is small and is the whole point of the thumbnail job: **derive
`thumb_confirmed` from a Drive file-exists check on
`<platform>-<format>-<thumb_spec>.png`, never from a typed flag,** and mirror it
into the database so both stores are gated by the same fact.

The automation's role is narrow and worth stating precisely: **open the task at
the right moment, verify the artefact landed with the exact filename, flip the
rendition to `thumbnail-done`, and refuse to schedule without it.** It never
produces the image and never approves it.

As of 2026-07-31, **23 renditions need a thumbnail and none has one**: 20 at
9x16, 2 at 1200x630, and 1 YouTube long-form at 1280x720. Every one is at
`to-produce`. This is the real constraint on the video lane, not the shoot.

**Data fix applied while checking this.** The `x` renditions carried
`thumb_spec = NULL` where every other no-thumbnail surface carried the string
`'none'`. A gate written the obvious way ("needs a thumbnail unless `thumb_spec`
is `'none'`") would have demanded thumbnails for text posts. Normalised to
`'none'`; the doctor should assert `thumb_spec is not null` so it cannot recur.

### The guards

Guards live in the database, not in the worker, so they cannot be bypassed by a
job that forgets to check.

**BUILT 2026-08-01 in `20260801_content_state_guards.sql`, and the first bullet
below was wrong as written.** It is kept because it is what was approved, and
because the correction is the interesting part.

- ~~`status = 'approved'` is refused unless `preflight = 'green'` **and**
  `ewa_signed_at is not null`.~~ **CORRECTED: there are two routes, not one
  conjunction.** Either `preflight = 'green'` plus a canonical article to inherit
  clearance from, **or** `preflight = 'amber-ewa'` plus `ewa_signed_at`. The
  original demanded Ewa's own signature on every asset including the ones whose
  whole point is that they inherit hers, which would have blocked the derivative
  lane entirely: `CONTEXT.md` calls inheritance the mechanism that makes
  derivative volume safe, and this bullet quietly revoked it. A non-empty
  `ewa_task` is still not a route, per the reconciliation in section 5 item 5.
- `ewa_signed_at` is writable only by the webhook path, never by hand. This is
  the direct fix for the dead-marker problem: the system that resolves the
  sign-off is the system that records it, in the same write.
- A rendition cannot reach `scheduled` while its asset is below `approved`.
- A rendition cannot reach `scheduled` if its canonical article is not published.
- **ADDED in the build:** a rendition cannot reach `scheduled` without a
  confirmed thumbnail when `thumb_spec` is not `none`, and cannot be `published`
  without an `external_url`, because a published rendition with no URL is an
  unverifiable claim that it shipped.
- **ADDED in the build:** every one of these fires on **INSERT as well as
  UPDATE**. Written as an UPDATE-only trigger, the entire gate is skippable by
  creating the row already scheduled, which is exactly how a batch import would
  have walked through it.

---

## 5. Phasing

Ordered by value per unit of effort, not by how impressive the result looks.

### Phase 0: the doctor (do this first, before any automation)

One script, `content-doctor`, that asserts every invariant and reports
violations. Run it in `/wrap` and nightly.

**The list below was amended 2026-08-01, after building it.** Four items were wrong
as written and one was missing. Each amendment is marked, because the original
wording is what a future reader would otherwise re-derive.

1. Every `assets/*.md` has a `content_assets` row, and every row has a file **or a
   batch draft**. _Amended: the original half ("every row has a file") contradicts
   CONTEXT.md's batched-channel rule, where a week of X posts is seven assets in one
   draft file. Distinguish **unlinked** (copy exists in a draft, but neither store
   names the other) from **database-only** (appears nowhere). They are different
   problems with different fixes and the first run mis-stated seven rows as the
   second._
   **Amended again 2026-08-01: a Substack republish owes no file.** Its craft is the
   canonical article, so the exemption is: a resolving `canonical_article_id`, **every**
   rendition on `substack`, and at least one rendition. Any non-Substack rendition, no
   canonical article, or no renditions, and it still fails. **If the evidence tables
   cannot be read, do not exempt** — an exemption that fires when its own evidence is
   missing opens exactly when the system is unhealthy. Rule and its control case in
   `CONTEXT.md`.
2. Every frontmatter enum value is accepted by the corresponding DB constraint.
   _Amended in what it may claim: PostgREST with a service-role key cannot read
   `pg_constraint` (404 PGRST205), so this can prove a value is **accepted** (a live
   row carries it) but never that one is **refused**. Findings must say "unproven by
   this client", not "unprovable" — the constraints are readable by a raw SQL
   session. Until one exists, the `canonical-article` incident that motivated this
   invariant would surface as unproven rather than as a failure. Also assert
   `thumb_spec is not null`._
   _**Narrowed 2026-08-01 by Phase 1, and it says so in its own title.** `status`,
   `preflight` and the per-rendition `status` / `publisher` have left the
   frontmatter, so the file-side half has no subject for them and now reads IDENTITY
   only: `content_type`, `funnel_stage`, `awareness`, `cta`, and each rendition's
   `platform` / `format` / `thumb`. It prints how many values it compared and goes
   UNCHECKED at zero, so a shrinking subject cannot quietly become a silent pass.
   The dead mappings were deleted rather than left in place looking measured. The
   half that compares live database values against `scan.js` did **not** narrow and
   still covers both status vocabularies, which is worth knowing before someone
   restores the state keys to make this invariant feel whole again._
3. Every rendition **published through Metricool** and carrying an `external_post_id`
   still resolves there. _Amended: taken literally this demands Metricool resolve
   Unipile and Substack ids, guaranteeing false failures. Scope by `publisher`._
   ~~**Permanently UNCHECKED until a Metricool credential exists**~~ **WIRED 2026-08-01, and
   "permanently" lasted a day.** The credential existed all along in the repo-root `.env`,
   which the content-engine loader did not read. It now resolves all 7 Metricool ids live and
   **the doctor reaches exit 0 for the first time**. Three things are worth carrying:
   **(a) the per-post endpoint, not the windowed list.** `GET /api/v2/scheduler/posts/<id>`
   answers 200 or 404 for one id. The list endpoint needs a date window, and any post outside
   whatever window we guessed would read as MISSING, which on this invariant means drift: a
   false alarm on a gate. A lookup with no window has no window to get wrong.
   **(b) 404 is drift; every other non-200 is UNCHECKED.** A timeout or a 500 must never
   collapse into "the post is gone", because those are the same shape as the failure this
   whole plan is about: an unperformed check rendering as a definite answer.
   **(c) keeping the invariant in the list while it was unmeasurable is what made this cheap.**
   It stated its own missing credential by name every night, so wiring it was a config fix and
   an afternoon rather than a rediscovery. **An honest UNCHECKED is a to-do list that reads
   itself out loud.**
4. No scheduled rendition has a date in the past.
5. No asset has a scheduled or later rendition unless its pre-flight is `green`, **or**
   its pre-flight is `amber-ewa` and **Ewa's ClickUp task is COMPLETE**.
   _**RECONCILED 2026-08-01 (Keith). The conflict was real and the resolution is not a
   compromise between the two rules, it is a third thing.** The plan said non-green
   blocks scheduling; `scan.js` G2 accepts `amber-ewa` with a non-empty `ewa_task`.
   Neither was right, because **`ewa_task` non-empty proves a question was ASKED, not
   answered.** G2 lets an asset reach `approved` on the strength of the routing alone,
   G3 then lets its rendition reach `scheduled`, and X week 1 is scheduled with
   `autoPublish: true` — so an unruled asset would publish on a timer. **The gate is
   the task's completion, not its existence.**_
   _**This is the `thumb_confirmed` shape again** (section 4): a field in one store
   asserting a state owned by another. `scan.js` reads only the repo and therefore
   **cannot** verify completion; it keeps its weaker check and says so in a comment.
   The doctor can query ClickUp and is where the real gate lives. **Without a
   `CLICKUP_API_TOKEN` this invariant is UNCHECKED, never PASS** — an unverifiable
   gate is not a satisfied one._
   _**Superseded on the `scan.js` half, 2026-08-01.** There is no weaker check left
   to keep: Phase 1 removed G2 outright, because after the split the scanner cannot
   see `preflight` or `ewa_task` at all. The reconciliation stands and the whole gate
   is now the CHECK constraint plus this invariant. The comment that said the
   scanner was deliberately weaker has been replaced by one naming the database
   object that took the gate over, so nobody harmonises a rule that no longer exists._
6. No `TODO`-style marker survives in `blog_articles.body`. _The signal is an
   assertion that something is **owed** ("sign-off required", "before publish", "to
   review and rewrite"), not passive voice: "to be rendered by ArticleLayout"
   describes a component and blocks nothing._
   **KNOWN LIMITATION, logged 2026-08-01, no live instance.** Markers are tiered:
   strong ones (`TODO`, `sign-off required`, `before publish`, `awaiting review`) are
   never excused; weak ones (`to be added/reviewed/rendered`, `placeholder`) are
   excused when the comment also describes a component (`auto-render`, `props`,
   `attribute`, `OR write inline`). **The excuse is evaluated over the whole comment
   rather than the clause carrying the weak term**, so `{/* Ewa to be reviewed; see
   the props table below */}` reads as benign. All eight live markers are strong and
   therefore immune. Tighten by scoping the excuse to the clause. Recorded rather
   than fixed because the verification pass had reached the point of finding
   hypotheticals rather than faults, and further rounds carried more regression risk
   than they removed.
7. Counts quoted in the **current** section of a STATE doc match the database.
   _Amended: STATE files are dated append-logs where old entries are supposed to
   quote old numbers, so the original wording produces false positives on correct
   history. **Known limitation of the fix:** a present-tense section under an
   **undated** heading is treated as history and therefore never asserted, which is
   how a stale count survived at line 323 of this workspace's STATE.md. Dating a
   section is what makes it checkable._
   **SECOND KNOWN LIMITATION, found 2026-08-01 by the check firing on its own
   announcement.** The pattern `N published articles` cannot distinguish a **total**
   from a **subset**: "nine published articles were serving dead markers" means nine
   of the eighteen, and was reported as a claim that eighteen is nine. Prose about a
   subset of a population trips a check written to police the population's size.
   Worked around by rewording, which is the wrong direction of fix and is recorded as
   such. The real fix is to require a totalising cue (`all`, `there are`, `across the
   blog`) before treating a count as an assertion. **Until then, write subset counts
   without the bare "N published articles" construction.**
8. **NEW.** No rendition carries external publication evidence (`external_post_id` or
   `external_url`) while its asset is below the bar to have shipped — non-green
   pre-flight, or status below `approved`. _Added because invariants 1 to 7 all
   missed a live case: `substack-free-androgen-index` sits at `preflight: red` and
   `to-produce` while carrying a Substack id. Invariant 5 keys on `status`, and
   `status` is the one field section 1 says cannot be trusted. **Evidence written by
   the outside world outranks a status field typed by us.**_

**Of the seven drift failures in section 1, this catches five or six.** It is a
day of work and it pays for itself immediately, because building automation on
top of a silently drifting system multiplies the drift rather than removing it.

**Where the doctor lives: three homes, one job** (decided 2026-07-31).

| Layer | Home | Why |
| --- | --- | --- |
| The invariant list, and what "correct" means | **this file**, `06_marketing/content-machine` | the workspace owns the definition of correct |
| The script, `content-doctor.ts` | **`09_website-app/frontend/scripts/content-engine/`** | where `_shared.ts` and the Supabase client already are, next to `reconcile-coverage.ts`, which is the same species: a reconciler that reaches into a `06_marketing` file and writes DB truth back over the plan's drift |
| When it runs and who reads the output | **`12_operations`** | the cadence layer, per its own CONTEXT |

**The line that decides where any future piece of this plan lives: does it need
the service-role key?** `content-status/scan.js` reads repo markdown only, so it
lives inside the skill. The doctor reads `content_assets`, `content_renditions`,
`blog_articles.body` and Metricool, so it lands on the content-engine side.
`12_operations` holds no code today and should not become the first place it
does; its CONTEXT explicitly scopes it to verifying that content shipped, not to
how content is made.

**It is not a new operational job.** `12_operations/sops/content-machine-verification.md`
step 3 ("`/content-status` matches reality on the live channels") is the manual
prose form of this, it already runs in `weekly-ops.md`, and per `STATE.md` it has
**never been run** — which is how Substack published for ten days while the
tracker said the publication did not exist. So rewrite that step to invoke the
doctor and judge its output, rather than writing a second SOP beside it. Same
diagnosis as `/content-week` versus `sop-weekly-run.md`: a procedure that lives
only as prose a human must improvise from does not happen, however good the prose.

**One constraint `automation/scheduled-agents.md` imposes on the design, worth
catching before it is built:** _"Automating a check must not create a parallel
status store outside ClickUp."_ A run history is telemetry and is fine. Findings
must not accumulate into a second backlog. **A red invariant opens a ClickUp
task; the script owns detection, ClickUp owns the open-item list.**

**Nightly means a claude.ai routine, not `pg_cron` and not `CronCreate`.** See
section 7 for the routing rule, the one-hour floor, and the `.env.local` question
that has to be answered before this script can run in the cloud at all.

### Phase 1: collapse the dual store. BUILT 2026-08-01

Strip state fields from frontmatter; the database becomes authoritative. Add a
`content-sync` command that regenerates a read-only state block in the file for
anyone reading the repo directly, clearly marked as generated.

Removes the entire class of failure in section 1 rather than detecting it.

**What was actually built, and where it differs from the four lines above.** The
plan described two deliverables. It took five, because stripping a field is only
safe once something refuses to let it come back, and because the guards this plan
had filed under Phase 2 turned out to be a prerequisite rather than a follow-on.

1. **The split is written down, in `CONTEXT.md`**, as a table plus the test that
   decides any future field: **who changes it?** A human typing while writing is
   identity or craft and belongs in git, where a diff is meaningful. An
   integration changing it is state and belongs where the integrations read and
   write. That test is the durable part; the table is just today's application of
   it.
2. **`content-sync.ts`**, in `09_website-app/frontend/scripts/content-engine/`,
   writing a `BEGIN GENERATED STATE` block into each asset file. `--check` and
   `--dry` write nothing. A file whose marker pair is damaged or duplicated is
   refused and left exactly as it is, rather than repaired by guesswork.
3. **The database guards**, `20260801_content_state_guards.sql`: a CHECK
   constraint on `content_assets` and a trigger on `content_renditions`, firing
   on **INSERT as well as UPDATE**, because a gate you can arrive at without
   passing through is not a gate.
   **Plus a second migration nobody planned**, `20260801_content_assets_business_approval.sql`.
   The split named `approved_by` and `approved_date` as database-owned, and
   `content_assets` had neither column, so the strip would have deleted the only
   record of Keith's business approval of `four-things-on-the-sheet` into
   nowhere. Caught before the stripper ran. **A fact declared to live in a store
   that cannot hold it is this plan's own failure shape produced by the plan**,
   and it was one file and two values away from being silent. The asymmetry with
   `ewa_signed_at` is deliberate: Ewa's sign-off is resolved by a system and must
   be written by that system, while Keith's approval is a human act with no
   system behind it, so a human recording it by hand IS the system of record.
   Protecting it would imply a sync that does not exist. It is also deliberately
   not in the CHECK constraint: twelve of the thirteen approved assets predate
   the convention, and requiring it would either reject them or invite a backfill
   of invented approvers, which is the same class of error as inventing a
   sign-off date.
4. **The strip itself**, over the asset files, after verifying every value
   against its live row by SELECT before deleting it.
5. **Two detectors, because a rule nothing enforces is a preference.** A
   database-owned key in frontmatter is now a HARD `[STATE]` failure in
   `scan.js` (offline, at edit time) and `content-doctor` invariant 9 (nightly,
   against live data). Presence is the violation, not disagreement: an agreeing
   copy is still a copy, and it is the one that quietly stops agreeing later.

**Six things came out different from the plan. Recorded because the plan was
wrong about four of them and silent on two.**

- **The guards are not what section 4 says they are, and section 4 is the wrong
  one.** It states `approved` requires `preflight = 'green'` **and**
  `ewa_signed_at is not null`. As built there are **two routes**: green plus a
  canonical article to inherit clearance from, **or** `amber-ewa` plus
  `ewa_signed_at`. Section 4's single rule would have blocked every derivative
  that inherits its sign-off from a signed article, which is the mechanism
  `CONTEXT.md` calls the thing that makes derivative volume safe. The built
  version also honours the 2026-08-01 reconciliation in item 5 above: a non-empty
  `ewa_task` is not a route, because it proves a question was asked, not
  answered.
- **The live files carried more state than the schema documented.** The template
  listed `status`, `preflight`, `preflight_date`, `ewa_task`, `drive` and the
  per-rendition trio. The files also carried `approved_by`, `approved_date`,
  `publisher`, `scheduled_for` and `external_post_id`. **A schema doc is a
  hypothesis about a directory until something reads the directory**, which is
  the same lesson Phase 0 recorded as "a spec is a hypothesis until something
  executes it". Both detectors watch the database spellings too (`drive_url`,
  `approved_at`, `external_url`, `published_at`), because a fact copied back
  under its column's own name is the same second copy wearing a better label.
- **The strip finished 11 of 13, and the two it stopped on are the interesting
  ones.** `the-stack` and `when-a-test-earns-its-place` carry
  `preflight_date: 2026-07-31` in frontmatter while `content_assets` still says
  `2026-07-09`. Commit `5798f66` rewrote both scripts to voice 1.2 on 2026-07-31
  and re-ran the pre-flight; the database never received it. **So making the
  database authoritative made a stale value authoritative**, and on one of the
  two the re-run had caught a real HARD compliance hit the earlier copy carried
  as green since July. The frontmatter was left intact rather than deleted,
  because deleting it destroys the only surviving record of that run. **Owed:
  one decision and one UPDATE setting both rows to 2026-07-31, after which the
  keys go.** Until then `content-doctor` exits 2 on these two files, and that is
  the invariant working on its first run rather than a regression.
- **A capability was lost and nothing replaced it.** Old gate G1, "a `scripted`
  asset has a script in the body", needs the body from git and the status from
  Postgres. No single store can check the pair, so it is a human check now and
  `/content-status` says so instead of implying a gate. Whether it becomes
  doctor invariant 10 is an open decision.
- **The key list now exists twice, which is this plan's own section 2 shape
  introduced by the work removing it.** `DB_OWNED` / `DB_OWNED_REND` in
  `scan.js` and `I9_FLAT` / `I9_REND` in `content-doctor.ts` encode one rule in
  two places, and they already differ: the scanner also refuses
  `unipile_account` and `thumb_confirmed`. Both were kept because they run in
  genuinely different places, but the LIST should have one home. The mechanism
  already exists: the doctor parses `PLATFORMS`, `FORMATS`, `THUMBS`,
  `STATUS_ORDER` and `REND_ORDER` out of `scan.js` source via
  `parseScannerVocab`. **Owed: add the two key lists to that map.**
- **One consumer was missed, and it writes to ClickUp every night.**
  `content-library-sync.ts` still reads `status` from asset frontmatter with
  `|| 'idea'` as its fallback, so since the strip the daily
  `content-engine.yml` run has been mirroring every stripped asset into the
  Content Library list as `idea`. **The fallback is what makes it dangerous:**
  written for a genuinely new asset, it cannot tell one from an asset whose
  status moved house, so the mirror publishes a plausible wrong value instead
  of failing. Nothing detects it, because no invariant reads that mirror.
  Found on 2026-08-01 by the doc sweep, checking whether a sentence in this
  plan was actually true. **Owed: repoint the script and delete the fallback.**
- **The split created a seam nothing guards.** Which renditions EXIST is now the
  file's job while every rendition's state is the database's, and no invariant
  compares the per-asset rendition set in frontmatter against
  `content_renditions`. This is already live, not hypothetical:
  `2026-07-19-substack-welcome-normal-on-paper.md` carries no renditions block
  at all while the database holds a `substack/newsletter` row for it. The
  generated block makes the mismatch visible to a reader and nothing raises an
  alarm. **Owed: a doctor invariant for rendition-set parity.** No entry was
  added to the file to make the gap go quiet, because inventing craft to satisfy
  a detector is the failure this phase exists to remove.

**Two knock-on effects for whoever watches the nightly run.** The doctor is now
**nine** invariants, not eight, and its expected exit is **2** until the two
`preflight_date` rows are corrected, so `content-doctor-cron` will open one
deduplicated ClickUp task on Sprint `901217968514` from tonight. And invariant 1
now strips the generated block before asking whether any file mentions a slug:
without that, the mirror would answer "yes, this slug appears in the repo", which
is the row vouching for itself with a copy of itself.

**One thing the plan predicted and it did not happen.** Stripping the state keys
was expected to break invariants 1 and 2. I1 reads only `slug` from a file, which
is identity and stays. I2 was narrowed to the identity enums, prints how many
values it compared, and goes UNCHECKED at zero, so it proves the same kind of
thing over a smaller set rather than proving nothing. Stated here because a green
result that arrived for an unexamined reason is worth less than a red one.

### Phase 2: the plumbing jobs

Build the event spine and the jobs table above, in this order: Drive folders
(pure win, no gate involved), then the ClickUp sign-off webhook (closes the
dead-marker loop), then approval-to-Metricool scheduling.

Scheduling creates posts as **drafts** in Metricool, and the draft-to-live flip
stays a human action (decided at approval, see section 7). That is one click
instead of the twenty minutes it took by hand, and it keeps a person on the last
step.

### Phase 3: measurement

Metrics capture and the `measured` transition. Lowest urgency: nothing downstream
depends on it yet, and the board currently reports honest nulls rather than fake
zeros.

---

## 6. What we should not automate, and why

- **The pre-flight judgement pass.** The deterministic scanner can and should run
  automatically on every write. The judgement half caught three real issues on
  2026-07-31 that no scanner would have found, including a Phase 0 boundary
  implication created by *compression* rather than by wording.
- **Ewa's sign-off.** It is the clinical safety layer and a named professional's
  accountability. Automate the *submission* so it costs a minute rather than an
  hour, and automate the *recording* so it is never inferred from a file again.
- **Keith's approval to ship.** One human decision before anything reaches the
  public.
- **Publishing anything carrying a net-new claim.** The inheritance check is what
  makes derivative volume safe. An asset that adds a claim leaves the fast lane.

---

## 7. Where the worker runs, and what that costs

**Corrected 2026-07-31 after testing the available tooling rather than assuming.**
An earlier draft of this plan listed a Google service account as a hard
prerequisite. That was wrong: it followed from an unstated assumption that the
worker runs server-side, not from any limitation of Drive.

Both existing routes to Drive can create folders. Verified:

- `gws drive files create --json '{"name":"...","mimeType":"application/vnd.google-apps.folder"}'`
  validates to a correct `POST /drive/v3/files`, authenticating from the local
  keyring.
- The Google Drive connector's `create_file` documents folder creation via the
  same `application/vnd.google-apps.folder` mime type.
- `gws drive changes list` exposes the Drive change feed, so an upload can be
  detected by polling, with no push subscription and therefore no public
  endpoint.

| Worker location | `gws` CLI | MCP connectors | New credential |
| --- | --- | --- | --- |
| Supabase edge function (always on, instant) | no, different machine | no, server-side code is not a Claude client | **service account** |
| Scheduled agent on Keith's machine | **yes** | yes | **none** |
| Scheduled cloud agent (a claude.ai _routine_) | **no, and this is the whole constraint** | **yes, attached deliberately** | **none** |

**The cloud-agent row was corrected 2026-07-31 (second pass) and it changes the
recommendation.** It previously read _"unverified: interactively-authenticated
connectors may be absent headlessly"_, which was a guess, and the guess was
backwards. A routine attaches connectors **explicitly**, by `connector_uuid`, in
its `mcp_connections` config. Metricool, Supabase, ClickUp and Google Drive are
all already connected on the account, so three of the four integrations this plan
needs are available to a cloud agent with no new credential at all. The blanket
"build machine-side" recommendation rested on a limitation that does not exist.

### Recommendation, split by job rather than blanket

**Corrected 2026-08-01, and the deciding question changed.** This section previously
asked *"does the job touch Drive"*. That was too narrow, and it put the Phase 0 doctor
in the cloud where it cannot run. The real question is:

> **Can this job be done by an AGENT through MCP, or does it need a TESTED SCRIPT
> holding a credential?**
>
> An MCP connector is reachable by an agent. It is not reachable by a process.

**An MCP connector is available to an agent, not to a process.** A cloud routine can
attach Supabase, ClickUp and Metricool by `connector_uuid`, and an agent inside that
routine can call them. But `content-doctor.ts` is a plain node process: it is not an MCP
client, it needs `SUPABASE_SERVICE_ROLE_KEY`, the routine create API has **no env or
secrets field**, and a cloud checkout has no `.env.local` because it is gitignored. So
the credential cannot reach the script by any route. Rebuilding the nine invariants as
agent prompts would discard 118 tests and reintroduce exactly the non-determinism the
script exists to remove. **That trade is never worth it for a gate.**

| Job | Runs where | Why |
| --- | --- | --- |
| Phase 0 doctor | **machine-side** | a tested script needing a service-role key. No way to hand a cloud routine a secret. |
| Drive folder creation | **machine-side** | `gws` is a local binary, and the Drive connector is the wrong Google account (below). |
| Drive change feed (raw/final/thumb landings) | **machine-side** | same. |
| ClickUp sign-off poll | **either** | an agent can poll list `901218140081` through the connector; a script needs `CLICKUP_API_TOKEN`. Cheap enough to be agent work. |
| Approval to Metricool scheduling | **cloud routine, when it exists** | connector-only, no local dependency, and it creates DRAFTS so a bad run is recoverable. |

**The general rule, worth carrying beyond this plan: put determinism where the stakes
are.** A gate that decides whether something ships must be a tested script, and a tested
script must run where its credentials are, which today means Keith's machine. Plumbing
that merely moves an already-approved thing along can be agent work in the cloud, because
a wrong answer there is visible and reversible.

**Drive is the one that cannot move, for two reasons, and the second is fatal on
its own.** First, `gws` is a local binary authenticating from a local keyring, and
a cloud agent has no local anything. Second, and this is the one that would not
announce itself: **the Drive MCP connector authenticates as the personal account**
(`keithantony5@gmail.com`), which holds the empty decoy `Content` folder described
below, not the business tree. A routine wired to the Drive connector would create
folders on the wrong Drive, beside a same-named empty tree, and every check would
pass. Drive writes stay on `gws`, machine-side, until and unless a service account
exists.

### Three constraints a routine imposes, all of which change numbers above

1. **Minimum interval is one hour.** A `*/30` cron is rejected outright. The
   fifteen-minute figure argued elsewhere in this section is not available on a
   routine; hourly is. Still comfortably fast enough here, for the same reason
   given below, but the plan should not quote fifteen.
2. **A routine cannot read `.env.local`, because it is gitignored.** It gets a git
   checkout, so repo markdown is fine, but `_shared.loadEnvLocal()` finds nothing
   and `content-doctor.ts` will not run there as written. **Decide before
   building, not after:** either inject the secrets into the routine config, or
   have the routine assert against the **Supabase connector** rather than the
   service-role client. The second is cheaper and fits the doctor, which only
   reads and reports.
3. **`CronCreate` is not this.** The in-session cron tool is memory-only, dies
   with the session, expires after 7 days and fires only while the REPL is idle.
   It is not a scheduler for anything in this plan. The routine API
   (`/schedule`, `RemoteTrigger`) is. Recorded because the two are easy to
   confuse and only one survives closing the laptop.

**As of 2026-07-31 there are no routines at all** (`RemoteTrigger list` returns
empty), which independently confirms `12_operations/automation/scheduled-agents.md`
is telling the truth when it says every cadence is manual. The doctor would be the
first entry in that file.

Trade-offs, stated plainly: the Drive half advances only while Keith's machine is
running, and reaction is an hour rather than seconds. Neither matters for this
workload, because Metricool publishes on its own schedule regardless and the jobs
are recording what happened rather than causing it.

Move to a service account only if the Drive half needs to be always-on, which is
the only thing it would buy. It is a later optimisation, not a starting
requirement.

### The Drive convention already exists. Use it, do not invent one

**Checked 2026-07-31 against the live Drive, after an earlier draft of this plan
invented `01-raw / 02-edit / 03-final` out of nothing.** The real convention was
already documented in four places (`assets/README.md`, `CONTEXT.md` line 125,
`sop-thumbnail.md` line 29, `content-library-build-spec.md` line 95) and is in
use on the business Drive:

```
Content/                                     id 1og3i5RxjUW9RvL9qPvVBvRjedDMtwQAf
  2026-07/                                   id 1T9raTTszNKNRf8PEu5zIEivpU6RXFxuP
    ep-0-baseline/                 raw/ final/ thumb/
    the-stack/                     raw/ final/ thumb/
    when-a-test-earns-its-place/   raw/ final/ thumb/
```

Rules that follow from what is actually there:

- The pattern is `Content/YYYY-MM/<slug>/{raw,final,thumb}/`. Three subfolders,
  not two, and the third exists because `sop-thumbnail.md` writes fixed filenames
  into it (`thumb-9x16.png`, `thumb-1280x720.png`, `thumb-1200x630.png`).
- The folder name is the **bare slug**, with no date prefix, even though the
  asset FILE is named `YYYY-MM-DD-<slug>.md`. The month lives one level up.
- The month folder is the asset's mint month, not the shoot month.

**Use the `gws` CLI, not the Drive connector, and this is not a preference.**
The two routes authenticate as different Google accounts:

| Route | Account | State |
| --- | --- | --- |
| `gws` CLI | keith@andro-prime.com (business, Workspace) | holds the real `Content` tree |
| Drive MCP connector | keithantony5@gmail.com (personal) | holds an EMPTY `Content` folder created the same day, never used |

A job built on the connector would create folders on the personal Drive, beside
an empty decoy with the same name, and nothing would look wrong. The connector
stays useful for reading; Drive writes go through `gws`.

~~**Backfill owed:** four assets with video renditions have no folder.~~ **DONE
2026-07-31, by hand, before the job existed.** `handbrake-half-on`,
`what-time-was-it-taken`, `lab-would-not-answer` and `same-test-twice` all have
`Content/2026-07/<slug>/{raw,final,thumb}/` on the business Drive via `gws`, so
**all seven assets carrying video renditions now have a folder** and the folder
job's first run has nothing to backfill. It starts from new assets only.

Worth recording that this line was stale within hours of being written, in a plan
whose entire subject is undetected drift between stores. It is the seventh instance
of the same shape and the argument for Phase 0 rather than an exception to it.

✅ **THE FOLDER JOB EXISTS AS OF 2026-08-14** (plan step 3.5):
`scripts/content-engine/drive-folders.ts`, built on `gws` exactly as ruled above, with 18 unit tests
and one live end-to-end run against a throwaway root. It creates the tree AND verifies the folders
that already exist, because a `drive_url` pointing at a renamed, trashed or emptied folder reads as
done from the database and is not. **It is not yet on a cadence** — that waits for the content-engine
package move, so it does not add a fifth scheduled task holding an absolute path. Run by hand until
then. The backfill line below is confirmed still accurate at 38 assets: seven assets carry a shot
rendition and all seven have a correct folder, verified against the live Drive.

### Decided at approval

1. **Draft or live by default** on the Metricool step. **DECIDED (Keith,
   2026-07-31): draft.** The approval-to-schedule job creates the post as a draft
   in Metricool and the draft-to-live flip stays a human action. Not "for the first
   few weeks" pending a later review: revisiting it is a fresh decision to make, not
   a default that expires. This keeps a person on the last step before anything
   reaches the public, which is the same reasoning as every other gate in section 6.
2. ~~**Scheduler.** `pg_cron` is not installed.~~ **CLOSED 2026-07-31. Dropped
   entirely, not deferred.** `pg_cron` was only ever relevant if the worker ran
   inside Postgres, and nothing in the split above does. Scheduling is claude.ai
   routines for the cloud jobs and a machine-side schedule for the Drive pair.
   Do not reopen this as "should we install `pg_cron`"; the question is which of
   the two homes above a new job belongs in.

---

## 8. Honest expectation

This does not make content production instant, and it should not. It removes the
reconciliation tax, which is where the hours went, and it makes the human steps
cheap to reach.

Realistic end state for a written post with no net-new claim: draft, scanner,
submit, and once Ewa nods, it schedules itself. Minutes of human attention rather
than hours, with the same gates standing.

Realistic end state for a video: the folder is waiting before anyone asks for it,
and the state advances itself as files land, so nobody is chasing where a clip
got to.
