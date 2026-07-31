# Content pipeline: automation plan

_Drafted 2026-07-31. Status: PROPOSAL, not approved. Owner: Keith._

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
| asset reaches `scripted` and has a video rendition | creates the Drive folder tree `01-raw / 02-edit / 03-final`, writes `drive_url` back | Drive |
| a file lands in `01-raw` | asset to `recorded`, opens an editing task | Drive push, ClickUp |
| a file lands in `03-final` | asset to `edited`, opens a thumbnail task if one is owed | Drive push, ClickUp |
| the Ewa review task completes | stamps `ewa_signed_at`, clears the gate | ClickUp webhook |
| asset reaches `approved` | creates one scheduled post per rendition, stores the external id, moves each rendition to `scheduled` | Metricool |
| a scheduled post publishes | rendition to `published`, captures the live URL | Metricool poll |
| seven days after publishing | captures metrics, rendition to `measured` | Metricool |

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

1. Every `assets/*.md` has a `content_assets` row, and every row has a file.
2. Every frontmatter enum value is accepted by the corresponding DB constraint.
3. Every rendition carrying an `external_post_id` still resolves in Metricool.
4. No scheduled rendition has a date in the past.
5. No asset with a non-green pre-flight has a scheduled rendition.
6. No `TODO`-style marker survives in `blog_articles.body`.
7. Counts quoted in STATE docs match the database.

**Of the seven drift failures in section 1, this catches five or six.** It is a
day of work and it pays for itself immediately, because building automation on
top of a silently drifting system multiplies the drift rather than removing it.

### Phase 1 — collapse the dual store

Strip state fields from frontmatter; the database becomes authoritative. Add a
`content-sync` command that regenerates a read-only state block in the file for
anyone reading the repo directly, clearly marked as generated.

Removes the entire class of failure in section 1 rather than detecting it.

### Phase 2 — the plumbing jobs

Build the event spine and the jobs table above, in this order: Drive folders
(pure win, no gate involved), then the ClickUp sign-off webhook (closes the
dead-marker loop), then approval-to-Metricool scheduling.

Scheduling should create posts as **drafts** in Metricool by default, with the
draft-to-live flip staying a human action until the pipeline has run clean for a
few weeks. That is one click instead of the twenty minutes it took by hand, and
it keeps a person on the last step.

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

## 7. Open decisions and prerequisites

1. **Google Drive credentials for unattended use.** The `gws` CLI is authenticated
   interactively as keith@andro-prime.com. A scheduled job needs a service
   account with domain-wide delegation, or a stored refresh token in
   `supabase_vault`. **This is the only genuinely new credential the plan needs.**
2. **ClickUp webhooks need a direct API token.** The connector in use exposes task
   reads and writes but not webhook creation.
3. **Scheduler.** `pg_cron` is not installed. Either enable it, use Supabase
   scheduled functions, or drive the sweep from an existing cron.
4. **Does the Drive folder convention already exist?** If Keith has a working
   folder structure for shoots, the job should match it rather than invent one.
5. **Draft or live by default** on the Metricool step (recommendation: draft, for
   the first few weeks).

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
