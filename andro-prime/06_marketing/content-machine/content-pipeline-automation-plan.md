# Content pipeline: automation plan

_Drafted 2026-07-31. **Status: APPROVED (Keith, 2026-07-31). Nothing built yet.** Owner: Keith._

_Approved as the plan of record; the phasing in section 5 is the build order. Phase 0
(the doctor) is the next thing to build and does not exist. The one decision that was
left open at approval, draft-or-live on the Metricool step, is now settled: **draft**
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

- `status = 'approved'` is refused unless `preflight = 'green'` **and**
  `ewa_signed_at is not null`.
- `ewa_signed_at` is writable only by the webhook path, never by hand. This is
  the direct fix for the dead-marker problem: the system that resolves the
  sign-off is the system that records it, in the same write.
- A rendition cannot reach `scheduled` while its asset is below `approved`.
- A rendition cannot reach `scheduled` if its canonical article is not published.

---

## 5. Phasing

Ordered by value per unit of effort, not by how impressive the result looks.

### Phase 0 — the doctor (do this first, before any automation)

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
2. Every frontmatter enum value is accepted by the corresponding DB constraint.
   _Amended in what it may claim: PostgREST with a service-role key cannot read
   `pg_constraint` (404 PGRST205), so this can prove a value is **accepted** (a live
   row carries it) but never that one is **refused**. Findings must say "unproven by
   this client", not "unprovable" — the constraints are readable by a raw SQL
   session. Until one exists, the `canonical-article` incident that motivated this
   invariant would surface as unproven rather than as a failure. Also assert
   `thumb_spec is not null`._
3. Every rendition **published through Metricool** and carrying an `external_post_id`
   still resolves there. _Amended: taken literally this demands Metricool resolve
   Unipile and Substack ids, guaranteeing false failures. Scope by `publisher`.
   **Permanently UNCHECKED until a Metricool credential exists**, and it must stay in
   the list saying so rather than being dropped._
4. No scheduled rendition has a date in the past.
5. No asset with a non-green pre-flight has a scheduled or later rendition.
   _**Unresolved conflict, deliberately left visible.** This contradicts
   `content-status/scan.js` G2, which accepts `amber-ewa` when an `ewa_task` exists.
   Implemented literally, so the next amber case surfaces the disagreement instead of
   one rule silently winning. Reconcile the two before Phase 2 wires scheduling._
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

### Phase 1 — collapse the dual store

Strip state fields from frontmatter; the database becomes authoritative. Add a
`content-sync` command that regenerates a read-only state block in the file for
anyone reading the repo directly, clearly marked as generated.

Removes the entire class of failure in section 1 rather than detecting it.

### Phase 2 — the plumbing jobs

Build the event spine and the jobs table above, in this order: Drive folders
(pure win, no gate involved), then the ClickUp sign-off webhook (closes the
dead-marker loop), then approval-to-Metricool scheduling.

Scheduling creates posts as **drafts** in Metricool, and the draft-to-live flip
stays a human action (decided at approval, see section 7). That is one click
instead of the twenty minutes it took by hand, and it keeps a person on the last
step.

### Phase 3 — measurement

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

**The deciding question is whether the job touches Drive.** Nothing else in the
plan actually pins a job to Keith's machine.

| Job | Runs where | Why |
| --- | --- | --- |
| Phase 0 doctor | **cloud routine** | needs repo + Supabase + Metricool + ClickUp. Every one is available. Touches no Drive. |
| ClickUp sign-off poll | **cloud routine** | ClickUp connector, list `901218140081`. No Drive. |
| Approval to Metricool scheduling | **cloud routine** | Metricool connector. No Drive. |
| Drive folder creation | **machine-side** | see below. Not a preference. |
| Drive change feed (raw/final/thumb landings) | **machine-side** | same reason. |

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
