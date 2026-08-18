# Content machine: the plan

**Status: IN EXECUTION, swept 2026-08-18. D2 signed as CA-041 and Phase 5 opened: 5.1 and 5.2 are
built. 15 of the 28 steps
are built, 6 are part-built with something named still owed, and 7 are untouched.** Phase 0 is complete; Phase 1 landed three days
early apart from 1.3; Phase 2 took its value and deferred its risky move; Phase 3 is built everywhere
a machine could build it and waiting on people everywhere else; **Phase 4 is nearly untouched and
Phase 5 has not started at all**; Phase 6 is two thirds applied; Phase 7 is live and read-only.
**All seven gates are now settled and signed** (D1, D7, D3b, D3 on 14 Aug, D4 on the 16th, D5
answered, **D2 fully signed on 18 Aug as CA-041**: Ewa by email, Keith countersigned the same day).
**No gate is owed a signature from anyone.** This is the execution
plan for `2026-08-13-content-machine-unification-proposal.md`, covering its §9 recommended order plus
the item 0 that its §11 review added. It sequences work; it does not do any.

**This file is the durable copy and it went stale in two days.** The 14 August statuses above were
correct when written and were wrong by the 16th, because a completed step trips no sweep: a
superseded VALUE gets swept when something changes, a superseded STATUS never does, since the change
is work finishing and nothing watches for that. Risk 5 below predicted exactly this. Per-step status
lives in the phase sections; the outcome detail lives in `STATE.md`, which is the source this sweep
was written from.

## Status at 2026-08-17

| Phase | Built | Part | None | What is left |
| --- | --- | --- | --- | --- |
| 0 Foundations | 3 | 0 | 0 | Nothing |
| 1 The deadline | 2 | 0 | 1 | 1.3, blocked twice over |
| 2 Engine hygiene | 2 | 1 | 0 | The package move, deferred to end of August |
| 3 Storage | 3 | 3 | 0 | Three loose ends (3.3 signed and 3.4 closed; 3.1 deferred to October) |
| 4 The filming day | 0 | 1 | 2 | The day itself, the thumbnail renderer, a repeatable shot-list pass |
| 5 Approvals | 4 | 0 | 0 | **ALL FOUR BUILT 2026-08-18.** 5.1 + 5.2 stored the set and the pin; 5.3 computes the ladder and enforces it at the publish gate; 5.4 surfaces a pin left on a superseded set. One net-new claim caught before it shipped |
| 6 Extension | 3 | 0 | 0 | **ALL THREE DONE.** 6.3 applied 2026-08-18: the gate reads the media requirement off the channel, and the platform/format enums became a foreign key to it |
| 7 Control layer | 1 | 1 | 1 | The write actions, and actually retiring what 7.2 named |

**Interactive version:** <https://claude.ai/code/artifact/5145dc45-0ad3-47ed-8aeb-56cb128ef126>
(same content, laid out as a status ledger, an outstanding-work board and a phase sequence).
**Swept to the same 2026-08-18 evening status as this file**, including D2/CA-041, Phase 5's first two
steps, and the day-two run gap. The artifact is private to Keith's claude.ai
account, which is why this file exists: the repo is the durable copy.

**What changed from §9.** The proposal ordered nine items by return. This plan reorders them by two
things return cannot see: **what blocks what**, and **two fixed dates**. The result moves three items
earlier and one item later, and it puts a new item first.

---

## The two fixed dates

| Date | What happens | What it forces |
| --- | --- | --- |
| **Sunday 17 August 2026** — **LANDED** | The 30 carousel posts begin publishing, one per day, for 30 days | Anything that has to *record* the run has to exist before the run starts. **It did: Phase 1 landed on the 14th.** Day 1 published to Instagram at 13:00 London, eight media, which proves the thing the 2026-08-10 test could not: that Metricool *ships* an 8-media carousel and the account *publishes* it, not merely that Metricool accepts one. The route flipped to `in_plan` on the strength of the publish; the grid moved 162 → 180 slots. |
| **The filming day, still unbooked** | 10 scripted assets and 21 video renditions become live work | Storage layout is now built and the shot-list pass has been run once. **Thumbnail rendering (4.2) has not been started, and it is the one of the three that is expensive after rather than before.** Booking the day is what sets this deadline, so the deadline does not exist until Keith creates it. |

Everything else in this plan is ordered by dependency, not by calendar.

---

## Decision gates: what is ruled, and what is left

**All seven are now settled**: four on 2026-08-14, D4 on the 16th, D5 answered from
evidence, and **D2 ruled by Ewa on 2026-08-18**. **No gate is now blocking anything, and nothing in
Phases 0 to 4 is waiting on a decision.**
The plan is execution-bound rather than decision-bound up to the filming day. Settled gates stay on
this board rather than disappearing, so what was decided sits beside what is still open.

| Gate | Decision | Owner | Blocks | Status |
| --- | --- | --- | --- | --- |
| D1 | Add a `variant` column to the rendition unique key | Keith | Phase 1 | **RULED 2026-08-14** |
| D7 | Use `content_metrics`, extended where other channels need it | Keith | Phase 1 | **RULED 2026-08-14** |
| D3b | Move Supabase to Pro | Keith | Phase 3 | **RULED 2026-08-14** |
| D3 | The three-home storage split | Keith | Phase 3 | **RULED 2026-08-14** |
| D2 | Adopt the claim-ledger model | Keith **and Ewa** | Phase 5 | ✅ **FULLY SIGNED 2026-08-18 as CA-041.** Ewa by email, Keith countersigned the same day. The claim set sits **per topic**, which is broader than a pillar |
| D4 | Build `/ops/content` as a route in the app | Keith | Phase 7 | **RULED YES 2026-08-16.** 7.1 is built and running read-only |
| D5 | Coolify watch-path: does a non-frontend commit trigger a deploy? | Keith | Informs Phase 2 | **ANSWERED 2026-08-14: yes, it does. No watch path exists.** Whether to add one is still open |

**Phase 0 needed no ruling from anyone. That is what made it Phase 0.** With six gates settled, the
same is now true of Phases 1, 3, 4, 6 and 7.

**No decision risk is left in the plan.** D2 was the only gate needing a second person and it took
five minutes to answer. What replaced it is smaller and named: one definitional question back to
Ewa, and Keith's own countersignature. See the risk section.

### D1, ruled 2026-08-14: add a `variant` column

Recorded here in plain terms, because the original wording described the schema rather than the
question.

**The rule in the way.** `content_renditions` is uniquely keyed on `(asset_id, platform, format)`.
An **asset** is the idea ("14 signs of vitamin D deficiency"); a **rendition** is one publishable
version of it for one place. So the database allows **one idea exactly one Instagram carousel.**

**Why the run trips it.** The run is ten ideas, each shipped as three Instagram carousels that are
identical except the closing slide, deliberately, to find out which close performs. Vitamin D
therefore wants three rows that all read "vitamin D, Instagram, carousel", and the key refuses the
second and third.

**The ruling.** Add `variant` to the key. The rule becomes one carousel per idea *per variant*, so
vitamin D holds three: A, B and C. The structure then says what actually happened.

**The rejected alternative,** for the record: model each post as its own asset. It needs no migration,
which was its only merit. It was rejected because it leaves the database with no record that the three
posts are one idea, so "which close won" stops being a question that can be asked and becomes thirty
rows matched up by reading their names; and because each of the thirty would separately declare its
canonical article, fanning one signed claim set out thirty ways instead of ten and breaking the
inheritance that Phase 5 depends on. The precedent for it is the X week, where seven assets hang off
one article, but those are seven different posts making different points rather than three copies of
one post with the ending swapped.

**D7 is the other half, and it is now ruled too.** D1 gives a place to record *this post is variant
B*. D7 gives a place to record *variant B got 340 saves*.

### D7, ruled 2026-08-14: use `content_metrics`, extend it where other channels need it

**What the table already is.** `content_metrics` holds `rendition_id`, `captured_at`, `impressions`,
`reactions`, `comments`, `shares`, `profile_viewers`, `followers_gained` and a `raw` jsonb, keyed
uniquely on `(rendition_id, captured_at)`. It is therefore **a time series, not a single score**: a
rendition can be measured repeatedly. That is the right shape and it is why the ruling is to extend
rather than replace.

**What it does not yet carry.** The column set leans LinkedIn and X, which is what it was built for.
Three gaps matter:

- **`saves`.** Instagram's strongest carousel signal, and the one most likely to separate a good close
  from a weak one. `reactions` is likes, not saves. **The first use of this table is a test whose
  winning metric it currently cannot store.**
- **`reach`.** Instagram reports reach separately from impressions; today they would collapse into one
  column.
- **Video: `video_views` and watch time.** Nothing here supports the shot arm, which is 21 renditions
  waiting on the filming day.

Keep `raw` as the catch-all so a platform-specific metric never needs a migration to be captured, and
promote a field out of `raw` into a column only once something queries it.

#### The trap this ruling has to design around, and it is not the schema

The run is a clean rotation: each close appears ten times, evenly interleaved (A on run-days 1, 4, 7
and so on, B on 2, 5, 8, C on 3, 6, 9), and every topic gets all three closes. Topic effects therefore
cancel, which means **the test is genuinely readable**. Two things would still make it unreadable:

1. **Comparing totals at one moment ranks the closes by publish date.** Day 1's post has thirty days
   of accumulation when day 30's has none. The rotation nearly fixes this, but not quite: A's ten
   posts average run-day 14.5, B's 15.5 and C's 16.5, so A carries a systematic two-day age advantage
   over C. Small, and pointing exactly the wrong way. **The comparison has to be at a fixed age, for
   example saves at seven days after publish.** That is a requirement on step 0.2: the poll has to
   capture on a schedule dense enough that every post has a datapoint near the chosen age, not one
   capture whenever the job happens to run.
2. **Expecting an answer early.** The last post publishes 2026-09-15, so a seven-day comparison cannot
   be read before roughly 2026-09-22. Worth knowing now rather than in three weeks.

### D3b, ruled 2026-08-14: move Supabase to Pro

Confirmed as recommended. The reason on the record is backups, not storage: the live site holds
orders, quiz results, biomarker values and the content pipeline, and runs with no managed backup at
all. The database is 18 MB against a 500 MB ceiling, so size was never the pressure, and media fits
inside Pro's included allowance either way. Self-hosting on Hetzner stays rejected: wrong direction
for CQC, backups disabled on both boxes today, and it would split the store.

**Still to state, in step 3.1:** what seven-day retention buys, and whether point-in-time recovery is
worth the add-on given the schema-baseline finding in 0.1.

### D3, ruled 2026-08-14: the three-home storage split

Confirmed as proposed. Working media on Google Drive; publishable media in one public Supabase Storage
bucket; `frontend/public/` for genuine site chrome only. The rule to carry forward is the one-line
version: **git holds the recipe, Drive holds what humans touch, Storage holds what a machine publishes
from, and the database holds only the URI.**

The ruling does not by itself settle what may never enter a public bucket, what the takedown path is,
or where the second copy of unrecoverable shot media lives. Those are steps 3.3, 3.6 and 3.5, and they
are now unblocked rather than answered.

### D2, ruled 2026-08-18 by Dr Ewa Lindo: adopt the claim-ledger model, per TOPIC

Four questions, one five-minute reply, and one of the four **overrides this plan as written**. The
verbatim questions and answers are in
`03_compliance/correspondence/2026-08-18-keith-ewa-d2-claim-ledger.md`, which is the record this
section summarises and the authority if they disagree.

**What she ruled.** The model is adopted: she signs a versioned, dated claim set; a derivative that
repeats those claims pins to a version and does not come back to her; anything adding an unsigned
claim comes to her fresh. A reworded claim that adds nothing (a change of tense, one sentence split
in two) **stays covered by the pin** — which promotes the CA-029 Amendment 1 of 2026-08-16 from
Keith's reading of her sign-off into her own standing rule. And she will rule the principle behind
the two pending packets **once**, applied to both, rather than answering the same question twice.

🔴 **The claim set sits at the TOPIC, not the article, and step 5.1 below is written the other way.**
One set covers every article on the same subject. This changes what the pin points at and therefore
the shape of the store, so it is a design change rather than a wording one.

~~🔴 **"Topic" is not defined in our terms and must not be assumed to mean "pillar".**~~ ✅ **DEFINED
THE SAME DAY, and the caution was right: it is NOT the pillar.** One set covers four articles spanning
three pillars. Pillars are a search-intent taxonomy and a claim set is a clinical-claim one, so the
two are on different axes. Detail and the schema consequence in 5.1.

⚠️ **The gate is ruled but not fully signed.** D2's owner is Keith **and** Ewa, and the register's
rule is that a submission is approved only when all required signers have signed. Ewa's half is on
record; Keith's is not. ClickUp `901219880207` at `pending`, and Keith moving it is the
countersignature.

~~⚠️ **Ruling 4 agreed to answer the two packets together. It did not answer them.**~~ ✅ **ANSWERED
THE SAME DAY.** Sent as one consolidated packet at 10:38 UTC, answered at 13:02: **Q2 is yes to
both.** The non-lifestyle causes may be named on the fatigue and the inflammatory article, and the
cancer paragraph goes in as written. Both blocks now need building into `blog_articles`; neither is
live, and the ruling clears the copy rather than the publish.

✅ **Seven further rulings the same day turned Phase 5 into a build spec** (Q9 to Q15, summarised in
that section below). **Only the "topic" definition is still open**, and it is the one thing blocking
5.1.

---

## Phase 0: COMPLETE 2026-08-14, no rulings needed

Three items, none of which needs a decision, all of which make everything after them safer.
**All three built; nothing outstanding.**

### 0.1 Baseline the schema into a committed file — DONE 2026-08-14

> **Done, with one part of the instruction below withdrawn as wrong.** The baseline exists at
> `09_website-app/database/schema/baseline-2026-08-14.sql`, verified object-for-object against the
> live catalogue. **The "collapse two directories into one" half was based on a mistake:**
> `supabase/migrations/` is not tracked in git, is gitignored by `supabase/.gitignore`, and is
> regenerated from `database/migrations/` by `sync-supabase-migrations.ps1`. It is a build artifact
> that was merely stale, and the convention was already documented in the migrations README. Nothing
> needed collapsing. The real measured gap is 11 applied ledger entries with no file and 9 files with
> no ledger entry, which the baseline addresses. See the proposal's corrected §11.1.
>
> The baseline was deliberately placed in `database/schema/`, **not** in `database/migrations/`, because
> the sync script copies every `*.sql` in that directory into the Supabase CLI's migrations folder,
> where `supabase db push` would try to apply a full-schema snapshot on top of a live database.

**What.** `pg_dump --schema-only` the live database, commit the result as a baseline migration
covering the six applied migrations that exist in no file (`social_content_tables`,
`social_content_gates`, `social_content_multiplatform`, `content_channels_registry`,
`content_assets_cta_add_canonical_article`, `content_state_guards_consolidate`). Then pick one of
`database/migrations/` and `supabase/migrations/`, delete the other, and name the winner in
`09_website-app/CONTEXT.md`.

**Why first.** Phase 1 alters the rendition unique key and Phase 6 adds a table. Neither should touch
a schema whose definition exists in exactly one place, in a database with no managed backup. This is
also what makes D3b mean something: a restore currently has no schema to restore into if the backup
is what fails.

**Done when.** A fresh database built from the files alone reaches the same schema as production, and
`list_migrations` and the chosen directory agree file for file.
**Rollback.** Nothing to roll back; it adds a file and deletes a duplicate directory.
**Size.** Under an hour. **Owner.** Claude, unattended.

### 0.2 Build the Metricool write-back poll — DONE 2026-08-14, and scheduled

> **Built, run, scheduled, and I4 is green.** `metricool-writeback.ts` plus
> `metricool-writeback-cron.cmd` and 28 unit checks. First live run recorded eight renditions that had
> published between 6 and 11 August with nothing writing back; I4 violations went 8 to 0. **Registered
> as a daily 07:00 local cadence on Keith's ruling and verified by the scheduler firing it unattended**,
> which left both a log line and an `agent_runs` row. It was safe to schedule where `metricool-schedule`
> is not, because it never creates, edits or publishes anything. Detail and two registration traps in
> `12_operations/automation/scheduled-agents.md`.
>
> Two pre-existing defects were fixed on the way: the generated Supabase types contained none of the
> content-machine tables (regenerating removed one of the three errors blocking `npm test`), and
> `process.exit()` was crashing both Metricool jobs so their exit codes never reached the caller.

**What.** Published post to rendition `published`, capturing the live URL. Specified already in
`content-pipeline-automation-plan.md` Phase 2, and `metricool-schedule.ts` already holds the
credential handling and the id mapping.

**Why now.** Invariant I4 has been red every morning since 2026-08-03, each one costing a manual
reconciliation, and thirty more posts start publishing in three days. Build it before the volume
arrives, not during.

**Done when.** I4 goes green unattended for three consecutive mornings.
**Rollback.** Disable the job; the invariant returns to red and the manual reconciliation resumes.
**Size.** Small, one new job. **Owner.** Claude.

### 0.3 Resolve the leftover backup table — DONE 2026-08-14

**What.** `public.blog_articles_body_backup_20260731` has Row Level Security disabled and holds 2
rows of article bodies, readable and writable by anyone with the anon key. Confirm the rows are
redundant against `blog_articles`, then drop the table. If it is still wanted, enable RLS with
policies rather than bare.

**Why now.** It is five minutes and it is a live exposure. It has nothing to do with the rest of this
plan, which is why it will otherwise never reach the top of a list.

**Done when.** `get_advisors` returns no `rls_disabled` finding.
**Rollback.** The rows exist in `blog_articles`; if they do not, the drop does not happen.
**Size.** Minutes. **Owner.** Keith rules drop-or-RLS, Claude executes.

---

## Phase 1: DONE 2026-08-14, three days before the deadline

> **1.1 and 1.2 are built, applied and verified. 1.3 is deliberately NOT done, and the reason is a
> dependency the plan had in the wrong place: retiring `schedule.js` needs `content_media`, which
> is step 6.2.** Full account in `STATE.md`; the per-step notes below record what actually
> happened against what was written.
>
> Live after Phase 1: 38 content assets, 74 renditions, thirty of them the carousel run at
> variants A, B and C with their Metricool ids. `content_metrics` has a writer and nine real
> captures. `content-doctor` is 9 of 10, the one FAIL being the pre-existing Substack coverage red.

The only phase with a real deadline. If it slips, the run publishes unrecorded. Both its gates are
ruled, so this is now purely a question of whether the work gets done in three days.

### 1.1 Add the `variant` column, then register the carousel run — DONE 2026-08-14

**What.** Two steps in order. First the migration D1 rules: add `variant` to `content_renditions` and
replace the `(asset_id, platform, format)` unique constraint with one that includes it. Then ten asset
rows and thirty rendition rows, three per asset at variants A, B and C, with the Metricool ids
captured. `format = 'carousel'`, `platform = 'instagram'` and `publisher = 'metricool'` are already
permitted values, so the variant change is the only schema work.

**Depends on 0.1.** The migration should land after the schema baseline, not before it. Altering a
constraint whose defining statement exists nowhere on disk is the exact situation 0.1 exists to end,
and 0.1 is under an hour.

**Why before Sunday.** Thirty live posts are currently invisible to `/content-status`, unchecked by
`content-doctor`, and absent from every count in the STATE docs. Registered before Sunday, the run
records itself as it publishes. Registered afterwards, the publish timestamps have to be reconstructed
from Metricool.

**Done when.** `/content-status` counts thirty carousel renditions, three per topic, and
`content-doctor` checks them.
**Rollback.** Delete the rows; the posts are unaffected, since Metricool re-hosted every asset to its
own CDN at schedule time. The constraint change is reversible while no other arm depends on it.
**Size.** Small. **Owner.** Claude.

> **Done, and one sentence of the instruction above was wrong.** "The variant change is the only
> schema work" was right about the schema and wrong about the blast radius. A new column that also
> creates a new SHAPE of row — three where the invariant had always been one — reached four things
> no document named: `scan.js`'s file-owned rendition keys, `content-sync`'s mirror (which would
> have printed three identical `instagram/carousel` lines), doctor invariant I1 (a file per row,
> so ten asset files were owed and neither existing exemption fits), and `content_channels`, which
> had no row for the pair at all. Each degraded quietly rather than failing. Logged as an
> improvement to `/decision-sweep`, which sweeps documents and has no code-reader pass.
>
> **`NULLS NOT DISTINCT` is the part worth remembering.** A plain four-column key would have
> silently weakened the old guarantee for the 44 renditions carrying no variant. Both directions
> were proved against the live database in a rolled-back transaction rather than reasoned about.
>
> **The run was ADOPTED, not created.** `register-carousel-run.ts` matches each run-day to the
> Metricool post in that slot and refuses unless the post's text is the approved caption byte for
> byte. Zero refusals; a re-run reports everything unchanged.

### 1.2 Give `content_metrics` a writer, and add the columns the test needs — DONE 2026-08-14

**What.** Per D7: extend `content_metrics` with `saves`, `reach`, `video_views` and a watch-time
field, then have the Metricool poll from 0.2 write captures into it. Keep `raw` as the catch-all.

**Why the columns come first.** `saves` is the metric most likely to separate a strong close from a
weak one, and the table cannot currently store it. Starting the poll before the column exists means
the first weeks of the test are measured on everything except the signal that matters.

**Capture cadence, not just capture.** Per the trap named under D7, the winner has to be read at a
fixed age rather than as a running total. The poll therefore has to capture often enough that every
post has a datapoint near seven days old. A single capture whenever the job runs will not produce a
comparable set.

**Why here.** This is what turns the A/B/C close test into an answer. It is also the first
measurement of any kind in the machine: every count the proposal reports is a production count, none
is an outcome.

**Done when.** A published rendition acquires metrics without a human fetching them, every post has a
capture within a day of its seven-day mark, and a query returns saves-at-seven-days grouped by
variant.
**Rollback.** Stop the writer; the table returns to dormant. The added columns are nullable and harm
nothing if unused.
**Size.** Small if it rides on 0.2, which is already polling Metricool. **Owner.** Claude.

> **Done, and it did NOT ride on 0.2.** The write-back reads `/scheduler/posts/{id}`; metrics come
> from `/analytics/posts/{network}`, a different endpoint with a different parameter spelling
> (`from`/`to`, not `start`/`end`), a different scoping rule, and a different id namespace. So it
> is a sibling job, `metricool-metrics.ts`, on its own daily cadence at 07:15 — after the
> write-back, because metrics join on the platform post id that the write-back records.
>
> **Nine real captures on the first live run**, across LinkedIn and X. The table had not been
> written to since 2026-07-28.
>
> **The Instagram field names are still unverified and that is the live risk.** Nothing has ever
> published on either brand's Instagram, so the endpoint answers 200 with an empty array, which
> proves nothing. The mapping is candidates; the job prints every unmapped numeric key so day 1
> converts the guess into knowledge. **Check it on 2026-08-18.**
>
> **Two platforms cannot be joined by id at all**, measured: LinkedIn's activity urn (what Unipile
> put in our URLs) and share urn (what analytics reports) are different numbers for one post, and
> Facebook's URL id differs from its analytics `postId`. Both are named and left unjoined rather
> than matched on timing.
>
> **The seven-day requirement is enforced by the job reporting on itself**, not by the schema:
> every run states how many posts past their mark have a datapoint within a day of it, and exits 3
> if any do not. Posts published before 2026-08-14 are out of that denominator, because their
> age-7 readings were never takeable and counting them would hold the alarm permanently red.

### 1.3 Retire `schedule.js` into `metricool-schedule.ts` — NOT DONE, and it should not be

**What.** Once the carousel has rendition rows, the shared scheduler can reach it and the bespoke one
is redundant.

**Why here and not earlier.** It is only possible after 1.1. Doing it is what stops the third pipeline
being rebuilt the next time a run happens.

**Done when.** `schedule.js` is deleted and a dry run of `metricool-schedule.ts` resolves the same
thirty posts.
**Rollback.** The file is in git history.
**Size.** Small. **Owner.** Claude.

> **BLOCKED ON 6.2, which is this plan's own step five phases later. This is an ordering defect in
> the plan, found by attempting it.**
>
> 1. **The shared scheduler cannot build a carousel.** Its only media path is the canonical
>    article's photograph, Facebook only, so an `instagram/carousel` rendition would have been
>    classified `send` and given a payload with an EMPTY media array: a media-less carousel posted
>    to a live public account, or rejected, and either way it would have looked like the scheduler
>    working. **That hole was live and is now closed** — every format that IS media (carousel,
>    reel, short, long-form, story, image-post, video) is REFUSED with the missing piece named.
>    Which files belong to a rendition has no home in the database until `content_media`, step 6.2.
> 2. **`schedule.js` is not a scheduler and never was.** It calls no API. It generates payloads
>    from `covers.js`, parses captions out of `captions.md`, and refuses to emit a run that fails
>    its twelve invariants. Deleting it deletes those checks and replaces them with nothing.
> 3. **`register-carousel-run.ts` now reads it** for the run definition, so it is load-bearing in a
>    second place.
>
> **What was achievable and was done:** the shared scheduler now REACHES the carousel lane (all
> thirty renditions are visible to it, correctly skipped as already-scheduled) and says out loud
> that it cannot build for it. Revisit after 6.2.

> **UPDATED 2026-08-17. 6.2 has landed, and a SECOND, independent blocker was found on 2026-08-16:
> the shared scheduler is single-brand.** Metricool permits one Instagram account per brand and we
> have two accounts, so the carousels sit on one brand and every other lane on the other.
> `metricool-schedule.ts` resolves `METRICOOL_BLOG_ID` once at process start and bakes it into every
> request, so **it structurally cannot reach the carousel brand.**
>
> **The schema half of that is already done, and the earlier wording of this blocker was wrong.** It
> was recorded as "needs a brand per rendition, a schema question nobody has asked"; step 6.1 put
> `publisher_brand` on the **channel** row later the same day, seeded carousel → `6693691` and every
> other Metricool lane → `6633045`. Brand is fully determined by `(platform, format)`, the same
> evidence that moved `thumb_spec` onto the channel row in the same migration, so a rendition-level
> column would have modelled a channel fact. **What remains is the read:** brand has to become a
> per-call argument taken from the rendition's channel, refusing rather than defaulting where
> `publisher_brand` is null. `metricool-metrics.ts` already does this with `METRICOOL_BLOG_IDS`, one
> token across both brands, so the pattern is proved here. Metrics can ITERATE because reading is
> undirected; scheduling has to ROUTE, so it needs the lookup rather than the loop.
>
> 🔴 **Getting the brand wrong would not fail visibly**, because `GET /scheduler/posts/{id}` is not
> brand-scoped and answers under either brand. 6.1 hit the mirror image: two channel rows named the
> wrong account and nothing had ever failed, because the code ignored the row. Correcting the rows
> without correcting the read inverts the defect rather than clearing it.

> **If 1.2 does not make Sunday.** Ship 1.1 anyway. The variant labels get recorded either way, and
> Metricool holds the metrics in the meantime, so a late writer can backfill captures. What cannot be
> recovered is a missed seven-day datapoint for the earliest posts, so if 1.2 is going to be late,
> late by days is fine and late by three weeks is not.
>
> **If 1.1 itself slips**, the run publishes unrecorded and the fallback is a Phase 2 backfill
> reconstructing publish timestamps from Metricool. The cost is the timestamps and a daily invariant
> staying red, not the run.

---

## Phase 2: PART-DONE 2026-08-14 — the value taken, the risky move deferred

> **2.2 and 2.3 are DONE. 2.1 was SPLIT: its payoff is delivered, its move is deferred to after
> the run is safely recording.**
>
> **The split is the point.** 2.1 bundles two things of very different risk: fixing the type
> errors that block `npm test`, and relocating 29 scripts plus ~25 path references. **Four of
> those references are absolute paths inside Windows scheduled tasks**, and two of those tasks are
> now load-bearing for the carousel run (the write-back records that each post published; the
> metrics poll must capture near each post's seven-day mark, the first of which falls on
> 2026-08-24). This machine's Task Scheduler query API is broken, so a broken task cannot be
> detected by asking — only by noticing an absent log line, which is precisely the four-day silent
> outage of 2026-08-01.
>
> So: **the two-line fix landed today and `npm test` exits 0**; the move waits until roughly the
> end of August. That was not a distinction the original step made.

Moved after Phase 1 deliberately. The proposal had this first, ordered by return, which was right on
the merits and wrong on the calendar: it touches the scheduler in the same days the scheduler first
matters.

### 2.1 Split the engine into its own package and fix the three type errors

**What.** Create `packages/content-engine/` at the repo root with its own `package.json`,
`tsconfig.json` and test script. `git mv` the 29 scripts. Fix the two type errors in
`doctor-heartbeat.ts` and the one in `metricool-schedule.ts`. Split `npm test` so app tests stop
sitting behind a tooling typecheck. Update roughly 25 path references across six skills, about
fifteen docs, `settings.local.json` and the scheduled-task `.cmd`, then run `/decision-sweep`.

**Why it matters.** `npm test` currently exits 1 on those three errors before any of the twelve app
test files run, including the results-classifier regressions, quiz routing, checkout and the
Customer.io consent gate. Clinical logic has no regression cover and the cause is three type errors in
content tooling. Moving the package out of `frontend/` also takes it out of the Docker build context,
so engine code becomes structurally unable to break a deploy.

**Done when.** `npm test` runs all twelve app test files and exits 0, and a deliberate type error in
the engine does not fail an app build.
**Rollback.** `git mv` back plus 25 reverted references. Worth writing down before starting rather
than discovering mid-move.
**Size.** Small in code, wide in references. **Owner.** Claude.

> **HALF DONE 2026-08-14. The first done-when is met; the second is not, and needs the move.**
> `npm test` runs all twelve app test files and exits 0. The clinical regression suite is back
> (34 assertions on results routing alone). The engine still sits inside `frontend/`, so a type
> error in it can still fail an app build — that half waits.
>
> 🔴 **The two remaining errors were live defects, not typing noise**, and both were in
> `doctor-heartbeat`, the job that reports the nightly doctor's death. `findOpenTask` read the raw
> ClickUp shape on a type that does not carry it, so no task ever counted as settled and the next
> alarm would have been a comment on a closed task; and `createTask` was called with three
> positional arguments where it takes one object, so the task creation would have failed outright.
> Both latent, because the heartbeat has never had to alarm. **A test was green over the first
> one:** its fixture supplied exactly the wrong shape production expected, cast to the right type,
> so the test reproduced the defect rather than catching it. That is the general hazard in an
> `as`-cast fixture, and it is why the fix removes the cast rather than updating it.

### 2.2 Verify the scheduled doctor by letting the scheduler fire it

**What.** Re-point the scheduled task and confirm it runs unattended, not by a hand run.

**Why separately.** Its action string has silently failed before: four nights in a row from
2026-08-05 with no log line and nothing noticing.

**Done when.** Three consecutive unattended runs appear in the log.
**Size.** Minutes, plus three nights of waiting. **Owner.** Claude.

> **DONE 2026-08-14, and nothing needed re-pointing.** The done-when asked for three consecutive
> unattended runs; `agent_runs` holds **nine**, every night from 2026-08-06 to 2026-08-14 at
> 01:30Z, plus the heartbeat at 08:00 daily across the same span. The 2026-08-05 action-string fix
> has held for over a week without anyone checking, which is the only form of evidence this step
> was ever after.
>
> Its exit code has been 2 every night since 2026-08-07, on I10 / Substack alone. That is the
> alarm working, not the cadence failing.

### 2.3 Answer D5

**What.** Look at the Coolify watch-path configuration and record whether a non-frontend commit
triggers a build.

**Why here.** After 2.1 the engine cannot break a build. Whether a docs-only commit still triggers a
pointless deploy is a separate question nobody has looked at, and it affects every commit this repo
makes.

**Done when.** The answer is written into `09_website-app/STATE.md`.
**Size.** Minutes. **Owner.** Keith or Claude, whoever opens the Coolify console first.

> **ANSWERED 2026-08-14, and nobody had to open the console. YES: there is no watch path, and
> every push to `main` builds and deploys whatever it touched.**
>
> Measured from evidence already lying around rather than from configuration: three consecutive
> **markdown-only** commits on 2026-08-13 (`95f534d`, `f7f7aaa`, `77b7db0`, two `.md` files each)
> each produced its own **Sentry release**, and a release is created by the Next build uploading
> source maps. A build ran for each. Recorded in `09_website-app/STATE.md`.
>
> **The cost is not the wasted build.** It is that a documentation edit deploys whatever state the
> build is in, so a dependency or config drift that broke the build since the last code change
> gets discovered by a docs commit, in production. Whether to configure a watch path is a Coolify
> console action and stays Keith's; this step was the question, not the change.

---

## Phase 3: PART-DONE 2026-08-14 — the three Claude-owned steps are built

> **3.3, 3.4 and 3.6 are DONE.** The `content` bucket exists with 110 objects and three controls at
> three layers, the media is out of git, and the takedown path is written with its Storage half
> executable. Full account in `STATE.md`.
>
> **3.1 was already bought** and its restore is now tested. **3.2 is half done**: `nc-server-01`
> backups are on and evidenced, `nc-server-02` is unreported. **3.5 is complete** — the Drive half
> built and tested but deliberately not scheduled, the cold-archive half built and proved end to
> end once backups were enabled.
>
> **The bucket did not wait for Pro** — and it turns out it never could have, because **Pro was
> already bought** (corrected 2026-08-14 by reading the API; see 3.1). The 50 MB per-file limit on
> the `content` bucket is therefore **our own setting, not a tier ceiling**, and raising it for
> long-form video is now a decision rather than a purchase.

Both gates ruled 2026-08-14. Everything here is cheap now and expensive once there is footage.

### 3.1 Move Supabase to Pro (D3b) — THE PURCHASE IS ALREADY DONE

> 🔴 **CORRECTED 2026-08-14 by asking the API instead of the document. The Supabase organisation
> `Androprime` reports `plan: pro`.** This step, the proposal's §4.5, and every "no managed backup"
> line below were written against a free-tier reading that is no longer true, and the whole of
> Phase 3 was reported earlier today as blocked on Keith buying something he already has.
>
> ✅ **AND THE RESTORE IS NOW TESTED, 2026-08-14.** `database/restore-drill.mjs`: dump production,
> restore into a scratch local Postgres, compare a census table by table, clean up. **39 of 39
> checks match** — 29 tables, 691 rows, 24 policies, 21 triggers, 32 foreign keys, plus views,
> functions, indexes and RLS-enabled tables. It proves the database rebuilds from a dump, which is
> what 0.1's baseline exists for; it does **not** prove Supabase's own daily backup restores, and
> conflating those would repeat the mistake this step was written to end.
>
> 🔴 **The drill gave a confident wrong verdict three times before it was right** — carriage returns
> in parsed role names, excusing a cause while alarming on its consequence, and a census that
> counted indexes but not constraints and so passed while five foreign keys were missing. Full
> account in `STATE.md`. **A verification tool needs verifying.**
>
> ✅ **It also produced the disaster-recovery facts nobody had written down:** restoring this
> database onto non-Supabase infrastructure needs the `anon` and `authenticated` roles,
> `auth.uid()`, `supabase_functions.http_request()`, an `auth.users` table, and the ids it holds,
> because **13 foreign keys point at it**.
>
> Still to state, as the step already asked: what seven-day retention actually buys, and whether
> point-in-time recovery is worth the add-on. Both are now decisions about a live plan rather than
> arguments for buying one.

> ✅ **BOTH CLOSED. The objective was written on 2026-08-17** (RPO 24 hours, retention 7 days, PITR a
> separate add-on at roughly $100/mo, not enabled) **and PITR was DEFERRED TO OCTOBER by Keith on
> 2026-08-18.**
>
> **The deferral follows the recommendation rather than overriding it.** "Not at 3 orders, yes before
> the first serious order week", and the order count measured on the day was **3 total, most recent
> 2026-08-04, none in the last 7 days**.
>
> 🔴 **October is a backstop, not the gate.** The trigger is volume and the calendar is not, so the
> early exit is a number: **10 paid orders in any rolling 7 days, or 25 cumulative, whichever comes
> first.** The 30-day carousel run and live GEO outreach are both running between now and October
> and both exist to move that number, so the trigger firing early is the expected case, not the
> exception. Surface: ClickUp `869ek4drv`, due 2026-10-01.
>
> ⚠️ **Not a deferral of media protection.** Supabase's backup excludes Storage objects, so the 110
> published files are covered by neither git nor the database backup, and PITR would not cover them
> either. Separate and still open: reproducible from the manifest plus the renderer, never timed.
>
> **The general failure is the one this repo keeps recording**, and it cost a wrong instruction to
> Keith today: a fact was established once in a document, carried forward by every doc that cited
> it, and never re-read from the system it described. The plan-status question "is this bought?" is
> answerable in one API call.

**What.** Upgrade the project. Then state the recovery objective out loud: Pro is daily backups at
seven-day retention, and point-in-time recovery is a separate add-on. Decide whether seven days is
enough given 0.1.

**Why.** The live site holds orders, quiz results, biomarker values and the content pipeline, and runs
with no managed backup at all. The database is 18 MB against a 500 MB ceiling, so this is not a size
decision. Media storage rides along inside allowances bought for this reason.

**Done when.** A backup exists, and a restore has been tested once rather than assumed.
**Size.** Minutes to buy, an afternoon to test a restore. **Owner.** Keith buys, Claude tests.

### 3.2 Enable backups on both Hetzner boxes — HALF DONE

> ✅ **`nc-server-01` backups are ENABLED and the first image EXISTS**, evidenced by the Hetzner
> console on 2026-08-14: `Backup 2026-08-14T22:43:15Z`, 11.58 GB, status Available. There is still
> **no Hetzner credential in either env file**, so this is confirmed by screenshot rather than by
> anything that can re-check it later.
>
> **Two properties of Hetzner backups that change what may safely live there:**
>
> - **Seven SLOTS, not seven days.** The oldest is deleted when a new one is created, so the
>   recoverable window is a function of how often images are taken, not a fixed period.
> - **Crash-consistent, not application-consistent.** Hetzner's own panel recommends powering the
>   server off first "to ensure data consistency on the disks", which is the honest admission that a
>   snapshot of a running machine catches whatever was mid-write. **This is fine for 3.5's cold
>   archive**, which is write-once media files. It would NOT be an adequate backup for a database or
>   anything transactional, and nothing of that kind should be put on this box on the strength of
>   "it has backups now".
>
> ⚠️ **An image existing is not a tested restore** — the same distinction that took four attempts to
> get right for Supabase tonight. Testing this one means restoring a whole server image, which is
> disruptive and is not proposed. Recorded as a known, accepted gap rather than an oversight.
>
> **`nc-server-02` is not reported either way.** It may be deliberate — 3.5's cold archive lives on
> `nc-server-01`, so the dependency that mattered is now clear — but the step asks for both.
>
> **This unblocks the cold-archive half of 3.5**, which was waiting on exactly this box.

**What.** Both `nc-server-01` and `nc-server-02` show BACKUPS with an Enable button.

**Why here.** The proposal used "backups are disabled on both boxes" as an argument against
self-hosting Postgres and then never turned it into a task. It is worth doing regardless of how D3b
rules, and it is a prerequisite for 3.5.

**Done when.** Both consoles show backups enabled.
**Size.** Minutes. **Owner.** Keith.

### 3.3 Create the bucket, and write the rule for what may never enter it

**What.** One public Supabase Storage bucket, path convention `content/<slug>/<kind>.<ext>`. Alongside
it, a written rule naming what is forbidden in a public bucket: results PDFs, biomarker charts,
customer-supplied photos, anything user-derived. Plus one technical control that enforces it rather
than stating it, and a path convention that does not make an embargoed asset guessable before its
slot.

**Why the rule ships with the bucket.** Public means unauthenticated, permanent, CDN-cached and
crawlable. For a business heading into CQC this is one line and one control now, or an incident later.

**Done when.** The bucket exists, the rule is in `03_compliance/CONTEXT.md`, and a doctor invariant
fails if a forbidden kind appears.
**Rollback.** Delete the bucket; nothing points at it yet.
**Size.** Small. **Owner.** Claude drafts the rule, Keith approves it, Ewa sees it if it touches
anything clinical.

> **DONE 2026-08-14, with the done-when's third clause restated because it could not be built as
> written.** "A doctor invariant fails if a forbidden kind appears" asks a checker to observe a
> semantic property: nothing can look at a PNG and see that it is a biomarker chart rather than a
> marketing slide. Implemented literally it becomes a filename heuristic that passes trivially and
> reads like enforcement.
>
> **Inverted into an allowlist over provenance it is buildable and stronger.** I11 requires every
> object to match the path convention AND its first segment to be a live `content_assets` slug. A
> results PDF, a customer photo and a stray export are all things no asset would ever claim, so it
> catches the whole class, including the members nobody enumerated. The preventative half sits where
> the property IS observable: the bucket's mime allowlist refuses `application/pdf` with 415 for
> every caller, the service role included.
>
> **Every control was verified by attempting it**, not reasoned about: anon upload 403, anon delete
> 403, anon list `[]`, unauthenticated download 200, service-role PDF 415. 13 unit tests.
>
> ~~**Keith has not approved the rule text yet**~~ — it is written into `03_compliance/CONTEXT.md`
> and live as code, which is the right order for a control but not for a compliance rule. It contains
> nothing clinical, so Ewa is not in this one.
>
> ✅ **APPROVED 2026-08-17 23:50 London as CA-039. STEP 3.3 IS NOW COMPLETE.** Signed by moving
> ClickUp [`869ek4a8y`](https://app.clickup.com/t/869ek4a8y) to `approved`, which is the signature on
> the **Keith-Only Sign-offs** board created the same day — because the real finding here was that
> **the rule had nowhere to be signed at all**. The approvals register is built for external-facing
> copy, so a Keith-only internal rule had no task, no row and no board, and the only thing flagging
> it for three days was a paragraph in a STATE file, which is a reminder rather than an approval
> surface. Mirrored to the register and `approval-record-public-media-bucket-2026-08-17.md`.
>
> **Conditions carried:** never add a `select` policy on `storage.objects`, never widen the mime
> allowlist to admit documents; either is a fresh submission, not a console edit.

### 3.4 Point the renderer at Storage and stop committing media

**What.** The deck renderer publishes to the bucket instead of `frontend/public/`, and a `.gitignore`
rule makes rendered output uncommittable.

**Why now.** Binaries are already 56% of git history in about three months, with no video filmed. The
110 carousel files committed on 2026-08-13 were content, not site chrome. Doing this before the first
shoot is the difference between a convention and a cleanup.

**Note.** Removing files going forward does not shrink history. The existing 90 MB stays unless
history is rewritten, which rewrites every commit hash. At 113 MB total that is not worth doing, and
the trajectory matters more than the number.

**Done when.** A fresh render produces zero new tracked binaries and the assets resolve over the CDN.
**Rollback.** Point the renderer back; the committed copies still exist.
**Size.** Small. **Owner.** Claude.

> **DONE 2026-08-14.** Both halves of the done-when: a fresh re-render of `brain-fog` produced zero
> new tracked or untracked binaries, and all 110 objects were verified by **anonymous** fetch, which
> is what Metricool actually does. 246 files untracked, both paths gitignored.
>
> **The step named the renderer and the real gap was one step later.** The README documents build →
> render → `png/<slug>/`; getting those files into `frontend/public/carousel/<slug>/` under
> different names was a manual copy nobody wrote down, which is why the two directories disagree
> about what a file is called. `publish-media.js` takes the assembled publish set as input and makes
> the upload reproducible; **it does not guess at the rename**, which belongs upstream in the
> renderer and is not done.

> ✅ **DONE 2026-08-17. The rename moved upstream and 3.4 is now complete.** `render.js` writes
> `publish/<slug>/` itself and `publish-media.js` reads from it by default, so build → render →
> publish runs end to end with nothing carried by hand.
>
> **It was two rules, not one, and only one of them was a rename.** Rendering produces 12 or 13
> files and a post publishes 11: `cover-overlay.png` and `cover-video.png` are inputs to the video
> composite and `slide-01.png` is the superseded direction-A cover. The actual rename is
> `cover-video-<slug>.mp4` at the prototype root → `<slug>/cover-video.mp4`, because `video.js`
> names by deck at the root (the non-deck path names by model and scene, so minting ten decks would
> overwrite one file ten times).
>
> **Selection is an ALLOWLIST taken from what `schedule.js` addresses, not an exclusion list.**
> Written as "everything except the intermediates" it fails OPEN: the next render artefact anyone
> adds ships to a public bucket on the next run, which is a compliance rule away from being an
> incident. As an allowlist it fails closed.
>
> **A missing file refuses the whole set.** Ten good files are worse than none, because they upload
> cleanly and read as finished; the post addressing the eleventh is where it surfaces, which is the
> media-less carousel 1.3 found live in the shared scheduler. `--publish-only` exits 1 on an
> incomplete set; a default assembly after a successful render reports the gap and exits 0, because
> failing the render would make minting a new deck look broken at the step that worked.
>
> ✅ **Verified against the live state rather than reasoned about: the assembled set is
> byte-identical to the hand-made one across all 110 files**, and a dry upload from the new default
> source resolves 110 objects with **zero** to put. No object path moved, nothing was re-uploaded,
> and the manifest is unchanged. The three refusal paths (missing video, missing slide, stale file
> pruned) were each exercised on a throwaway deck, because 3.5 recorded shipping refusal paths that
> had never run.
>
> **A convention was replaced by a manifest, and that is a consequence of the hash rather than a
> preference.** A content-addressed path cannot be rebuilt from a slug, so the recipe has to record
> it. The gain is that a missing file is now representable: the old concatenated URL always existed
> and could still 404 into a post with missing frames.
>
> **Nothing was serving the old files** — `/go` renders no images and `schedule.js` was the only
> constructor of those URLs — and the thirty scheduled posts were confirmed against the live calendar
> to reference `static.metricool.com` already.

### 3.5 Give working media a home and a second copy

**What.** Build out the Drive convention that already exists unused in the automation plan:
`Content/YYYY-MM/<slug>/{raw,final,thumb}/`, created when an asset reaches `scripted`, with
`drive_url` written back. Seven of 28 assets have a Drive folder today, so this is unbuilt rather than
broken. Then add a cold archive of finished shot media on `nc-server-01`, which has 320 GB of local
disk and 20 TB of traffic already paid for.

**Why the second copy.** Shot media is the only genuinely unrecoverable asset class in the picture,
and Drive is human-touched, unversioned, with a thirty-day trash. A single copy of the irreplaceable
thing is the same shape as the finding in 0.1.

**Done when.** A new asset reaching `scripted` gets its folder without a human, and the archive job
has run once end to end.
**Size.** Medium. **Owner.** Claude.

> **BOTH HALVES DONE 2026-08-14. Drive half built and tested but NOT SCHEDULED; archive half built
> and proved end to end.**
>
> **The archive is `archive-media.ts`**, copying each asset's Drive `final/` to nc-server-01 at
> `/srv/andro-prime/archive/<slug>/`, verified by sha256 both ends. Proved against real
> infrastructure: a 2 MB file copied with a matching checksum, a re-run copied nothing, and a
> **deliberately truncated archived copy was REPAIRED rather than skipped** — the case that decides
> whether an archive is worth having. All test artefacts removed afterwards.
>
> 🔴 **Two facts in this step were wrong.** The box Hetzner calls `nc-server-01` reports its own
> hostname as `nc-server-03`, so the first search for it concluded it did not exist; the job pins
> the IP and asserts capabilities instead. And **"320 GB of local disk" was the total across BOTH
> boxes** — each is 160 GB, ~118 GB free. The decision survives, and the job now refuses below a
> 10 GB floor rather than trusting a documented number.
>
> **`final/` only, never `raw/`**: raw footage is a capacity decision nobody has taken, and
> archiving it silently would fill the disk.
>
> ⚠️ Live-tested rather than unit-tested. The refusal paths (low disk, missing `sha256sum`, absent
> root, malformed `drive_url`, no `final/`) all fail closed but have never run.
> `scripts/content-engine/drive-folders.ts`, 18 unit tests, plus one live end-to-end run against a
> throwaway root. Detail in `STATE.md`.
>
> **"Seven of 28 assets have a Drive folder today" is still true at 38 assets, and it is not a gap.**
> Measured: those seven are exactly the assets carrying a shot rendition, all seven verified against
> the live Drive with correct ids and all three subfolders. The other three `scripted` assets have
> zero shot renditions. There was nothing to backfill, as the automation plan predicted.
>
> **The archive clause IS now met** — the job ran end to end the same day, once `nc-server-01`
> backups were enabled. The "without a human" clause is a deliberate deferral: a cadence means a fifth
> Windows scheduled task holding an absolute path into `scripts/content-engine/`, which is precisely
> what made 2.1 defer the package move, and the job has no work to do until a filming day that is not
> booked. **Register it with the 2.1 move at the end of August, or when the day is booked.**
>
> **The step said "this is unbuilt rather than broken" and that was right, but it undersold the
> verify half.** A create-only job would have been the easy read of this step; what the folders
> actually need is something that notices when `drive_url` points at a folder that was renamed,
> trashed or emptied, because that reads as done from the database and is invisible until footage
> needs somewhere to go.

### 3.6 Define the takedown path

**What.** A written procedure for pulling a retracted claim from every place a copy of it lives:
Storage, Metricool's CDN, and the platform itself.

**Why it belongs here and not in Phase 5.** The proposal established that Metricool re-hosts every
asset at schedule time, and used it to argue that the storage migration is safe. The same fact means
deleting from Storage does not delete the published copy. The claim ledger in Phase 5 needs somewhere
to point when a claim is withdrawn.

**Done when.** The procedure exists in `03_compliance/CONTEXT.md` and has been walked through once
against a real post.
**Size.** Small, mostly writing. **Owner.** Claude drafts, Ewa reviews the clinical half.

> **DONE 2026-08-14, with one step of the seven left honestly unverified.** The procedure is in
> `03_compliance/CONTEXT.md` as a seven-row table in the order to clear them, public-facing first
> and sources last. Its Storage step is executable rather than prose: `unpublish-media.js`, dry by
> default, exercised for real on 110 objects.
>
> **Walked against a real post:** day 1 of the run (Metricool 361489869) was read back live, and all
> eight of its media resolve to `static.metricool.com/planner/...` — which is what makes step 4
> insufficient on its own and is the reason the table exists.
>
> 🔴 **Step 3 could not be verified without writing to a live brand.** Whether deleting a Metricool
> post also removes its CDN media is unknown. The experiment is named in the procedure (throwaway
> draft, record the URL, delete, re-fetch) and is **Keith's call**, three days before the run starts.
> Until it runs, the procedure assumes the CDN copy persists — the safe direction to be wrong in.
>
> **Ewa has not reviewed it.** The procedure is process, not clinical copy, but it asserts that she
> rules whether a claim is withdrawn, corrected or restated, and that assertion is hers to confirm.

---

## Phase 4: the filming day — STILL THE EMPTIEST PHASE (status 2026-08-17)

Nothing technical moves this. It is the only item on the list that no system supplies.

> **4.1 not booked. 4.2 NOT STARTED. 4.3 run once, by hand.** Three days of progress everywhere else
> has not moved this phase. `/ops/content` now groups the 21 shot renditions by production kind, so
> they read as **one blocked input across five lanes** rather than five platform backlogs, which is
> what they are.

### 4.1 Book the day

Ten assets are written and waiting on camera. Twenty-one video renditions sit behind them across four
channels. **No asset has ever reached `recorded`.** The thumbnail gate is real but sits behind a step
never taken, so it is not what is holding the arm shut.

**Owner.** Keith, alone.

### 4.2 Point the deck renderer at thumbnails, before the day

**What.** Same data-file-to-image pipeline, new templates at 1280x720 and 9:16. Keith approves output
instead of drawing it.

**Why before.** Twenty-one thumbnails fall due the moment the first shoot lands, and that gate has
already held two approved Facebook posts against a file nobody knew they owed.

**Done when.** A thumbnail renders byte-identically twice from the same data file.
**Size.** Medium. **Owner.** Claude.

> **NOT STARTED as of 2026-08-17.** `sops/sop-thumbnail.md` and `templates/thumbnail-template.md` are
> all that exist, and both are manual. **This is the only item in Phases 3 and 4 that is genuinely
> cheaper before the day than after**, and it is the one that has not moved.

### 4.3 Run a compliance pass over the shot list, before the day

**What.** The pre-flight logic applied to script lines and shot descriptions rather than to finished
video.

**Why it is unique to video.** Written posts, carousels and articles make claims in text, which a
scanner and an inheritance table can both see. Video makes claims that are not text: a bloodwork
screenshot held to camera, a physique shot implying an outcome, a delivery that turns "may support"
into a promise. `compliance-preflight` already says the same logic applies to a script line before it
is filmed; it has no mechanism behind it.

**Done when.** Every one of the ten scripts has a recorded shot-list pass.
**Why the timing matters.** A claim caught in a shot list costs a line edit. The same claim caught
after a filming day costs the day.
**Size.** Small per script. **Owner.** Claude runs it, Ewa rules anything it escalates.

> **RUN 2026-08-16, and the mechanism this step asks for is still owed.**
> [`2026-08-16-shot-list-compliance-pass.md`](2026-08-16-shot-list-compliance-pass.md): eight scripts
> across seven asset files, checked at the layer a string match cannot reach — the `[Visual: …]`
> directives, the burnt-in `[Text: …]` overlays, the props and the delivery cues. **Nothing needs a
> fresh clinical ruling and no burnt-in overlay states an outcome, a benefit or an ingredient**, so
> the EFSA tables are not in play in the visual layer. **Five flags, all Keith's, none clinical.**
>
> 🔴 **The finding worth the pass: three scripts put a real medical record on camera, all three
> already instruct redaction, and each states it at a DIFFERENT production stage.** Only
> `what-time-was-it-taken` puts it inside the shot block, which is the part a person holding a camera
> reads; `same-test-twice` defers it to the edit, which is correct for what ships and **creates an
> unredacted special-category recording with no retention rule** — `03_compliance/deletion-policy/`
> is empty. A third flag: the instructions name *identifiers*, while "thumb scrolls once" can bring
> **adjacent unrelated results** into frame, which is a different set.
>
> ⚠️ **The pass was run by READING, so it is not repeatable and will not fire on the ninth script.**
> The durable form is a shot-block extractor applying checks that only exist at that layer; three of
> the five findings are mechanical enough to be caught that way. The `preflight` column was
> deliberately not written: it holds the COPY verdict, and this is a different axis.

---

## Phase 5: approvals — ALL FOUR STEPS BUILT AND LIVE (CA-042 signed, 23 pins, 16 verdicts, the ladder enforced)

The only item that gets cheaper as volume grows, and the one with the longest lead time, because it
needs a second person's agreement rather than a ruling.

> **PASSED OVER 2026-08-16, and the reason is recorded rather than implied:** it needs D2, D2 needs
> Ewa, and no approval route to her was open. Phase 6 needed no ruling at all, so the work went there
> instead and Phase 6 was taken out of order. **All four steps below are untouched.** Nothing here has
> changed since 2026-08-14, which is itself the status.

> ✅ **THE GATE IS RULED. D2 came back from Ewa on 2026-08-18 in five minutes**, which retires the
> "longest lead time" framing above and, read honestly, retires the 2026-08-16 reason with it: the
> route to her was the same route used twice on 15 August and four times before that. The blocker was
> the asking, not the route.
>
> **Still untouched, and now for ordinary reasons rather than a gate.** Two things are owed before
> 5.1 can be built, both small and both named in the D2 ruling above: **Keith's countersignature**,
> and **a one-line definition of "topic"** from Ewa. Neither is a decision risk.
>
> 🔴 **5.1 as written below is superseded by ruling 2**: the claim set sits per topic, not per
> article. The step text is corrected in place; the reasoning is in the D2 section.

> ✅ **THE PHASE IS NOW A BUILD SPEC, NOT A DESIGN QUESTION.** Seven more rulings landed the same day
> (consolidated packet Q9 to Q15, record
> `03_compliance/correspondence/2026-08-18-keith-ewa-fifteen-rulings.md`). The parameters:
>
> | | Ruled |
> | --- | --- |
> | Scope | **Forward only.** The 18 already-signed articles are not retro-fitted; existing sign-offs stand |
> | Format | She signs **a list we draft**: one sentence per claim, each with its source |
> | New version | **Only when the meaning changes.** A wording change that does not move the claim does not |
> | Superseded pins | **Live derivatives keep running** and are re-pinned at their next edit. Nothing comes down automatically |
> | Tier ladder | **Agreed as written, including Tier 1 auto-passing with no Ewa at all** |
> | Expiry | **None.** Re-check a set when we notice a cited source has moved |
>
> ✅ **AND Q9 CLOSED THE SAME DAY, so NOTHING in this phase is waiting on a person.** She answered
> "in your words" and wrote no words, which was a refusal of both offered options rather than a
> licence to pick one. Re-asked as four named articles and a count, it came back in two minutes:
> **one set covers all four, spanning three pillars.** See 5.1 for what that does to the store shape.
>
> **The pattern is worth keeping: a C answer was a badly-framed question both times, not an
> undecided reviewer.** Two abstract questions came back C; the same two, made concrete, took two
> minutes between them.

### 5.1 Store the claim set, versioned

**What.** Ewa signs a versioned claim set **at the topic** rather than signing prose (**ruled
2026-08-18: per topic, not per article**, so one set covers every article on the same subject).
Thirteen of the
28 asset files already carry a `## Claim inheritance check` table in exactly the right shape; it is
produced fresh every time, read once and thrown away.

✅ **A "TOPIC" IS DEFINED, and it is broader than a pillar.** Ruled 2026-08-18: **one claim set covers
`why-am-i-always-tired`, `low-vitamin-d-symptoms`, `b12-blood-test` and `ferritin-blood-test`**, which
span **three** pillars (B, A, and D with ferritin touching G). Asked abstractly first, with the pillar
and a finer unit as the options, and she refused both; asked as four named articles and a count, she
answered in two minutes.

🔴 **Pillars are the wrong axis, and this is the design consequence.** Pillars are a **search-intent**
taxonomy: `coverage-rules.md`'s sibling-overlap table exists to stop two articles cannibalising each
other's SERP, which is why vitamin-D-as-a-cause-of-tiredness is deliberately split between A and B by
reader language. A claim set is a **clinical-claim** taxonomy: the same claim is the same claim
whichever query brought the reader in. Building the ledger on pillars would have looked right until
two pillars needed one claim signed twice with no way to tell they were the same.

✅ **BUILT 2026-08-18, migration `20260818_content_claim_sets.sql`, applied and verified.** The pin
pointed at a unit with no table, so the migration makes one: `content_topics` with
`content_topic_articles` joining articles many-to-one, `content_claim_sets` versioned per topic, and
`content_claims` holding one sentence and one source per row. `content_asset_revisions` was **not**
extended: it hangs off an asset and a claim set sits above the article, so reusing it would have bent
the shape the ruling defined.

**Eight controls, each verified by attempting it** in a transaction that rolled itself back, rather
than reasoned about: a signed set with no signer is refused; a second signed set on one topic is
refused; pinning to a **draft** set is refused; pinning to a **signed** set is allowed; **pinning to a
SUPERSEDED set is allowed**, because Q13 says live derivatives keep running and a gate that refused it
would turn 5.4 into a takedown; one article in two topics is refused; a duplicate claim position is
refused; deleting a set something is pinned to is refused.

✅ **The first topic exists, from her ruling rather than inferred:** `tiredness-and-its-markers`,
carrying the four articles she named, with the rationale recording that it crosses three pillars on
purpose.

✅ **AND THE FIRST CLAIM SET IS DRAFTED, SIGNED AND PINNED (2026-08-18).** Version 1,
`57d5784a-435a-493b-bac6-dc43fe003faa`, **`status = signed`**, **40 claims**, one sentence each with
its source, which is the format she agreed to in Q11. Sent 15:10 UTC, **answered 16:00 UTC with every
question A**, countersigned by Keith the same day and approved as **CA-042**. Gate task ClickUp
`869ekhc68` at `approved`; packet at
`03_compliance/content-approval/ewa-claim-set-tiredness-and-its-markers-v1-2026-08-18.md`.

✅ **23 derivatives are pinned to it**, which is 5.2's pin firing for the first time. Her Q1 answer
also settled the conflict the set surfaced: the set carries **"consider"**, and
`low-vitamin-d-symptoms` is corrected to match, **staged** as revision
`069199cf-1fc6-4c5d-ac66-721647c61b00` rather than published.

🔴 **It found a cross-article contradiction on its first outing, which is the model working rather
than failing.** `low-vitamin-d-symptoms` says PHE **recommends** the 10 microgram daily dose for the
whole adult population; the fatigue block cleared the same week says government advice is everyone
should **consider** one. Source verification on 2026-08-15 is why the second wording exists. **Both
articles are correct read alone**, and per-article review can never see the pair, because it only ever
holds one article at a time. That is the concrete case for the paragraph above about the two
taxonomies being on different axes: a claim set is the first structure in this repo that reads four
articles as one clinical object. Three smaller items were flagged the same way rather than resolved
unilaterally: NICE NG239 cited by number with no URL, two ferritin claims with no citation on their
page, and whether the cleared-but-not-live block belongs in v1 or v2.

**Where it goes.** `content_asset_revisions` already exists, is empty, and carries the column comment
*"Mirrors blog_article_revisions. The compliance trail must show what was cleared, not only what is
current."* This is extending a table built for the job, not designing a mechanism.

### 5.2 Derivatives declare and pin

27 of 28 assets already declare a canonical article and 25 are pre-flight green, so the inheritance
lane is nearly universal. It is simply never computed.

> ✅ **THE PIN IS BUILT 2026-08-18.** `content_assets` gained `claim_set_id` (nullable, `on delete
> restrict`) and `pinned_at`, with a partial index because 5.4 runs "what is pinned to this set" on
> every article edit. A trigger refuses a pin to a **draft** set: inheriting a signature that does not
> exist looks identical to inheriting one that does, and that is the whole failure this model is
> meant to remove.
>
> ✅ **THE PIN HAS FIRED, 2026-08-18: 23 of 55 assets are pinned to the signed set**, every derivative
> of the four topic articles. The other 32 are correctly null, because their canonical articles belong
> to no topic yet.
>
> ⚠️ **Still not computed:** which claims an asset actually carries. That is 5.3's job and it is what
> turns the pin from a stored value into an enforced one. **This matters more now than it did when the
> column was empty**, because a populated column reads as a verified one: today the pin records which
> set *governs* a derivative, not that its copy has been checked line by line against the 40.

### 5.3 Automate the tier ladder

Tier 0 mechanical scanning is automatic. Tier 1, inherited verbatim, auto-passes with no Ewa. Tier 2,
compressed or on a surface that cannot carry the qualifier, goes to Ewa itemised. Tier 3, net-new
claim, goes back to the article for clearance. On the carousel run this would have replaced four
approval records and a hand-assembled seven-item packet with three items.

> ✅ **RULED BY EWA 2026-08-18 (Q14), as written and without amendment, including the part that
> matters: Tier 1 auto-passes with no Ewa at all.** That is where the whole time saving comes from,
> and it is now her ruling rather than an inference from her agreeing to the model. Tier 1 also
> covers a reworded claim that adds no proposition, per her ruling 3 of the same day. She was offered
> "the word-for-word ones should still come to me" and did not take it.
>
> ✅ **AND IT IS NO LONGER BLOCKED ON DATA (2026-08-18).** This step was logic with nothing to run
> against; a signed set with 23 pins now exists to classify derivatives against. Same for 5.4. Both
> are ordinary build work from here.

✅ **BUILT 2026-08-18: `classify-claims.ts`, plus `content_asset_claims` and the gate that reads it.**
16 verdicts across the 23 pinned derivatives: **1 tier 1** (auto-passed, no Ewa), **14 tier 2** (to
her itemised), **1 tier 3** (back to the article). An open tier 2 or tier 3 now **refuses the
rendition a schedule or a publish**, which is the sentence 5.2 wrote about itself: the pin has stopped
being a stored value and become an enforced one.

🔴 **IT CAUGHT A NET-NEW CLINICAL CLAIM BEFORE IT SHIPPED, on its first run.**
`x-w02-7-thread-why-uk-men-run-low` states *"reasonable sunscreen use drops skin synthesis by around
95%"* and **no claim in the signed set carries that figure**. The asset is approved, the rendition is
still `to-produce`, and the gate refuses it at scheduling. That is the whole argument for the phase
happening once, on day one, in the direction that matters.

**THE WALK GOES FROM THE COPY TO THE SET, AND THAT IS THE DESIGN DECISION.** The obvious build asks
of each of the 40 signed claims "does this copy carry it". Written that way first, it reported a
four-line X post about vitamin D thresholds as carrying the osteomalacia claim and the 4,000 IU
toxicity ceiling, neither of which is in it: clinical claims about one marker **share their figures**
(four of the 40 mention 25), and a claim's distinctive language is exactly what a compressed
derivative drops. Loosen it and it invents inheritance; tighten it and it loses the real ones. There
is no setting that does both, because the question needs meaning. Asked the other way — for each
assertion in the copy, does the signed set cover it — it is mechanical, it is the question an ASA
complaint actually asks, and its failures land safe.

⚫ **13 of 23 derivatives are "NOTHING REACHABLE", reported as its own verdict rather than as a pass.**
Copy that states no figure and cites no body is copy this tool never touched: the ferritin carousel
makes six mechanism claims and contains not one number, and only **12 of the 40 signed claims carry a
figure at all**. Every run prints its own reach. A green line here is the mechanical half of the
claim-inheritance check and is never the whole of it; `sop-compliance-route.md` step 3 still owns the
judgement half.

⚠️ **The 14 tier 2s are all one shape, and they are on copy Keith already approved.** A UK threshold
stated on a 280-character surface with the body that defines it (NICE, the Endocrine Society, the
NHS) left off — which is exactly the "on a surface that cannot carry the qualifier" half Ewa ruled on.
Nothing live was touched: the gate fires **on arrival only**, so what they block is re-scheduling.
Routing them to her as one itemised packet, or letting the existing approvals stand, is Keith's call.

**Two corrections were needed after the first apply, and both are recorded as their own migrations**
rather than edited into the file that ran: a tier 1 CHECK that evaluated to NULL and therefore
admitted the unresolved row it existed to forbid, and a gate that re-checked RESTING rows and would
have frozen `metricool-writeback` on 14 live assets the moment the classifier ran. The first was
caught only because every control was proved by attempting the write.

### 5.4 Surface pinned-to-superseded

If an article is re-optimised after its derivatives ship, they are all inheriting a superseded claim
and nothing says so. This is the failure mode that would make a ledger worse than no ledger.
Derivatives pin a claim version; when the article moves, the board lists what is pinned to the old
set. `stage-reopt.ts` and `reopt-concierge.ts` already run that track.

> ✅ **RULED BY EWA 2026-08-18 (Q13): live derivatives KEEP RUNNING and are re-pinned at their next
> edit.** Nothing comes down automatically, and she was offered that option (B, "they come down until
> re-pinned") explicitly. So this step is a **surfacing** job, not a takedown trigger: the board lists
> what is pinned to a superseded set and that list is worked through, rather than the pin acting as a
> kill switch.
>
> ⚠️ **Read it against Q12 before building.** A new version is only forced when the meaning changes,
> so a re-optimisation that rewords without moving a claim creates no superseded pins at all. The
> expensive case is narrower than this step assumed.

✅ **BUILT 2026-08-18: `content_claim_sets.superseded_at`, the `content_pins_superseded` view, panel
06 on `/ops/content`, and content-doctor I13.** The supersede is **stamped by the database** rather
than by whoever runs it, because the only value of the date is that it was not chosen after the fact,
and Q13's rule ("re-pinned at their next edit") is a rule about time that nothing could check without
it. `updated_at` moves for any edit and cannot stand in.

**The population is not the finding; `edited_since_superseded` is.** Q13 makes a superseded pin
normal, so the view is a worklist and never a takedown list. What it isolates is a derivative that
**moved after** its set was superseded and still carries the old pin, which is the duty going unpaid
rather than the state being tolerated.

**It reads 0 of 0 today**, because no set has been superseded yet — and that is precisely why it was
built now rather than at the first supersede. The board panel and the nightly invariant both read it,
so the first time this state exists will not be the first time anyone looks for it.

✅ **I13 also covers what the gate cannot**, which turned out to be the larger half: a derivative
covered by a signed set and pinned to nothing, a pin with no classification behind it, a
classification older than the copy it describes, and **an open tier 2 or tier 3 on copy that is
already live**. That last state is reachable by design, because the gate fires on arrival only; it is
red today on four live assets and on three that are pinned, approved and unclassified because their
copy never reached `content_renditions.body`.

⚠️ **Building the check found a hole in 5.3 that the row count could not show.** Copy with no figure
in it classifies perfectly and writes ZERO verdicts, so "never classified" and "classified, nothing
found" were the same empty set. `content_assets.claims_classified_at` is the marker that separates
them, and it is stamped on every run **including one that finds nothing** — and deliberately NOT
stamped when the run was UNCHECKED.

**The argument to put to Ewa.** Not that it is cheaper. That an ASA complaint requires substantiation
of a claim as it stood when it was made, and a versioned claim set with derivatives pinned to it is
that evidence, where thirteen throwaway tables are not.

**Size.** Medium. **Owner.** Claude builds, Ewa agrees the shape first. **DONE 2026-08-18**: she
agreed the shape on 18 August (D2, Q10-Q15), and all four steps are built, applied and verified.

---

## Phase 6: extension — ALL THREE DONE (6.1 and 6.2 applied 2026-08-16, 6.3 on 2026-08-18)

> **Taken out of order, ahead of Phase 5**, because it needs no ruling from anyone and because 6.2 was
> what 1.3 had been waiting on since Phase 1. The section heading used to read "no rulings needed once
> Phase 5 lands"; Phase 5 has not landed and this did not need it.

### 6.1 Finish `content_channels` into a spec

Move media requirements, metadata requirements, copy limits, human steps, publisher and
route-verified state onto the channel row, and take `thumb_spec` off the rendition where it does not
belong. Six of the ten routes have never carried a real post, which is a different fact from
"connected" and currently lives in a prose `notes` field.

> **APPLIED 2026-08-16**, migration `20260816_content_channels_capability_spec.sql`. The row now
> carries `media_kind`, `media_min`/`media_max`, `media_aspect`, `thumb_spec`, `body_max_chars`,
> `supports_first_comment`, `requires_human_publish`, **`publisher_brand`**, and
> `route_verified_at` / `route_verified_evidence`.
>
> 🔴 **Two channel rows had the WRONG ACCOUNT**, both predating the two-brand restructure, found by
> writing Keith's two-brand rule down and checking it against Metricool's own `getBrandSettings`
> rather than against a document. Neither had shipped anything to the wrong place, because the shared
> scheduler addresses `METRICOOL_BLOG_ID` regardless of the row: **the code was right and the row was
> wrong**, which is the harder direction to notice because nothing fails.
>
> **`thumb_spec` was lifted from the renditions rather than retyped**, so the two could not disagree
> at the moment of the move. Across all 74 renditions its value was perfectly determined by
> `(platform, format)`, which is the evidence it was a channel fact all along. **The plan's "six of
> ten routes unproven" was close: it is 4 of 10 proven**, now a measured column rather than a claim
> in a notes field.

### 6.2 Add `content_media`

Kind, aspect, URI, origin, checksum, joined many-to-many to renditions. Collapses four problems into
one: thumbnails stop being special, the publish gate becomes generic, a carousel's eight stills and a
video's clip-plus-thumb become the same shape, and one 9:16 export fans out to the Instagram Reel, the
YouTube Short, the TikTok short and the LinkedIn short by linking rather than copying.

> **APPLIED 2026-08-16**, migration `20260816_content_media.sql`. Media is keyed to the **asset** and
> joined many-to-many to renditions with a `role` (`body|thumb`) and a `position`. **Four guardrails,
> each proved by making it fail** inside a rolled-back transaction: cross-asset linking, two files in
> one carousel slot, deleting a file still in use, registering a URI twice.
>
> **Both tables shipped EMPTY on purpose, and that emptiness immediately misreported itself** on the
> new board as "51 renditions missing required media" — of which **30 were false**: those posts carry
> eight media each, already re-hosted and ready. The board was reporting *our records are incomplete*
> as *these posts have no media*, and **a board whose biggest number is noise teaches you to skim
> it**. Backfilled by `backfill-carousel-media.ts` from the two sources that already knew the answer
> (`schedule.js --json` for slug, variant and ordered names; `media-manifest.json` for URL, sha256 and
> byte count), nothing inferred: **110 media rows and 240 links**, and 110 is exactly the object count
> invariant I11 already checks in the bucket.

### 6.3 Make the publish gate generic

`gate_rendition_publish()` currently reads `new.thumb_spec`, the rendition's own copy of a rule that
belongs to the channel. After 6.1 and 6.2 it asks one question instead: does this rendition have the
media its channel requires.

**Done when.** Adding Pinterest is one row, one media requirement, `board id` plus `pin title`,
publisher `metricool`, and no code.
**Size.** Medium. **Owner.** Claude.

✅ **DONE 2026-08-18**, `20260818_generic_publish_gate.sql` and `20260818_renditions_channel_fk.sql`.
The gate asks one question, from the channel row: does this rendition have the media its channel
requires? The old rule could only ever express "a cover is owed" and had nothing to say about a
carousel needing eight images, which is the requirement most likely to be missing.

✅ **THE DONE-WHEN WAS PROVED BY ATTEMPTING IT, NOT ASSERTED.** Pinterest added as one channel row,
a rendition moved onto it, refused with no image linked and accepted with one. No migration, no code.

🔴 **The attempt is what found the promise was false somewhere else.** The first try returned
`violates check constraint "content_renditions_format_check"`: `format` was a hand-kept enum of
eleven values with no `pin`, so a new platform still cost a migration. The cost had moved out of the
gate and into a constraint, where it was harder to see. **`platform` already listed `pinterest` while
`format` did not list `pin`**, which is two lists of one thing, kept by different hands, already
drifted. Both are now a foreign key to `content_channels`, so a rendition on an unregistered channel
is not something a gate notices but something the database cannot represent.

**THE MEDIA CHECK FIRES ON UPDATE-ARRIVAL AND NEVER ON INSERT, and that is not a weakening.** Media
links are keyed to a rendition id, so they cannot exist before the row does; a gate demanding them at
INSERT would ban the insert path, and the insert path is how `register-carousel-run.ts` records a run
that is **already live in Metricool**. Refusing to write down what is already true is worse than
writing it down with the media rows still to come. **Content-doctor I14** tests the resting state
instead and catches exactly what the gate gives up. Same split as 5.3: the gate refuses the
transition, the invariant reports the state.

⚠️ **`content_renditions.thumb_spec` is still there and is now provably redundant** (0 disagreements
with the channel across all 91 renditions). Left deliberately: five consumers read it and
`db-owned-keys.json` names it, so dropping it is its own change, and doing it here would mean that if
the gate came back out, the column it replaced would already be gone.

---

## Phase 7: the control layer — D4 RULED YES, 7.1 BUILT, 7.3 NOT BUILT

Last in the plan because it reads everything above; built early because D4 was ruled on 2026-08-16
and Phase 5 was not available.

### 7.1 One route, read-only

`/ops/content` in the existing Next.js app, behind auth, reading live from Postgres. Read-only first,
so a wrong number stays a wrong number rather than becoming a wrong action. Seven panels: what needs
you, every lane by production kind, channels, media, approvals, health, and **effect**, which the
proposal omitted and which is what 1.2 makes possible.

Four things it must do that no current board does: list every lane including the empty ones; group by
production kind rather than platform; separate coverage from health, since twenty-one renditions
untouched at `to-produce` is a state where every store agrees perfectly; and surface unregistered work
as a failure, because a board that silently excludes thirty live posts is worse than no board.

> **BUILT 2026-08-16 and read on screen by Keith**, which closes the standing "rendered UI is not done
> until a human has looked at it" rule. `app/ops/content/page.tsx` + `lib/ops/getContentBoard.ts`,
> behind the same `getCurrentUser` + `isAdmin` gate as `/admin/dashboard`, `force-dynamic`, noindex.
> **All four requirements are demonstrated against live data**, not asserted: `linkedin/short` reports
> itself with 0 rows; the 21 shot renditions read as one blocked input across five lanes; coverage is
> split from health; five anomaly classes are checked and currently none fires.
>
> 🔴 **An unread table is never reported as an empty one.** The first standalone run failed to read all
> seven tables and the board SAID SO rather than rendering zeros. That path proved itself by accident
> and it is the single most dangerous thing an ops board can get wrong.
>
> 🔴 **Then the board found its own defects, and one lesson generalises.** A one-lane correction left
> the page reading "not 4 problems" and "not 5 separate problems" about the same group, three lines
> apart, because the fact existed in two places with the count derived independently in each.
> **Consistently wrong is survivable; visibly self-contradictory discredits every other number on the
> page.** No test could have caught it, because each call site was correct about its own arithmetic.
> The remedy for a duplicated fact is never to update the other copy. Panel 06 was corrected the same
> way: `gridFilled` and `thumbsOwed` are now defined exactly as `content-doctor` I7 defines them
> rather than recomputed.

### 7.2 Name what it retires

**This is the part the proposal left out.** There are five surfaces today, not four: `review.html`,
`content-machine-artifact.html`, `/content-status`, `content-doctor`, and ClickUp, which holds blog
sign-off and is the approvals hub. By the proposal's own rule, that a fifth surface is a fifth thing
to keep in sync, `/ops/content` has to arrive with a list of what dies. Otherwise it is a sixth.

ClickUp is the one that should probably survive, because it is where a human who is not Keith
participates. The other four are candidates.

> **RULED 2026-08-16, and NOT YET EXECUTED. What dies:** `review.html`, the social dashboard
> (`dashboards/content-machine-artifact.html`), and `/content-status`. **What survives:**
> `content-doctor`, because it is the nightly unattended alarm and a board nobody opens cannot alarm;
> and **ClickUp untouched**, because it is where a human who is not Keith takes part.
>
> ⚠️ **Nothing has actually been retired.** The first two are retirable today and both are still in
> the repo. `/content-status` cannot go until 7.3 exists: it carries gate-checked state transitions
> and is the only way to move a rendition.

### 7.3 Then the gate actions

Write actions for exactly the three things that are genuinely gates: approve, flip live, submit to
Ewa.

**Size.** Medium. **Owner.** Claude.

> **NOT STARTED as of 2026-08-17.** Until these exist the board can only report, and the surface it is
> meant to replace has to stay alive to do the work.

---

## What this plan does not include

- **A fourth production kind.** Written, rendered and shot cover everything on the roadmap. The
  article sits outside the set as the canonical source, not a derivative.
- **A second repository.** Revisit when someone needs content access without business access, which
  is the strongest trigger and is not technical.
- **A history rewrite.** Not worth it at 113 MB.
- **Any automation of Ewa's sign-off.** Cheaper to reach, never automatic.
- **Removing drafts-by-default.** The 2026-07-31 decision is what makes a bad run recoverable.
- **Merging the four production front-ends.** An article, a written post, a rendered deck and a shot
  video are genuinely different crafts.

---

## How this plan fails

Named in advance, so that any of them is recognisable while there is still time to react.

1. ~~**Phase 1 does not land before Sunday.**~~ **DID NOT HAPPEN: 1.1 and 1.2 both landed
   2026-08-14, three days early.** Kept here because the mitigation reasoning still applies to the
   part that is now live, and because the residual risk MOVED rather than cleared.

   **The residual risk, restated.** The failure that cannot be undone was never a late writer but a
   missed seven-day capture on the earliest posts, and the poll now runs daily and reports its own
   coverage. What replaces it is narrower and real: **the Instagram metric field names are still
   unverified**, because nothing has ever published on that account and the analytics endpoint
   answers 200 with an empty array. If the mapping is wrong, the first week captures nulls that
   read exactly like posts nobody engaged with. Mitigation is built in — every unmapped numeric key
   is printed on every run — but it needs a human to look on **2026-08-18**.
2. **The filming day never gets booked. NOW THE FIRST RISK IN THE PLAN.** Then Phase 4 has no
   deadline, 21 renditions stay at `to-produce` indefinitely, and the shot arm remains the only one
   that has never published. No system change addresses this, and three days of progress everywhere
   else has not moved it. Phase 3 is no longer waiting on it: its build half is finished.
3. **Phase 2 is attempted during the run.** Twenty-five path references and the scheduler, in the
   days the scheduler first matters. The plan puts it after the run starts for this reason; moving it
   earlier reintroduces the risk.
4. ~~**D2 stalls because it needs Ewa.**~~ **DID NOT HAPPEN, and the reason is worth more than the
   risk was.** Predicted 2026-08-14 as the only decision risk left; ruled 2026-08-18, five minutes
   after being asked. The risk assumed the cost was **her availability**. It was not: she has
   answered every ask within minutes for a month. The cost was **ours**, in the days before anyone
   wrote the question, and 2026-08-16 recorded that delay as "no approval route to her was open",
   which was not true on the day it was written. **Where a risk names a second person, check whether
   the queue is on their side before recording it as theirs.**
5. **The plan itself becomes a fifth copy. THIS HAPPENED, within two days.** Predicted 2026-08-14,
   realised by the 16th: every phase status in this file went stale while the file still read as
   current, and it was only caught on the 17th by someone asking what was left. This sweep is the
   correction.

   **The mechanism is worth more than the correction.** A superseded VALUE gets swept because
   something changed and the change is the trigger. A superseded STATUS never does, because the
   change is *work completing*, and no rule watches for that: `/decision-sweep` fires on decisions.
   Worse, the same-day contradiction is invisible from inside — 1.3's brand blocker was written down
   hours before 6.1 answered its schema half, in the same `STATE.md`, and the two sat disagreeing
   until the 17th. **A blocker recorded at the moment of discovery is at maximum risk of being
   resolved by the very work that discovery prompts.**

   Two rules fall out. **Sweep this file when a step COMPLETES, not only when a decision lands.** And
   when logging a blocker, prefer naming what would resolve it over asserting that nothing exists,
   since a negative existence claim ("nobody has asked", "there is no mechanism for") decays fastest
   and reads as authoritative long after it stops being true.

---

## Sources

`2026-08-13-content-machine-unification-proposal.md` including its §11 review,
`content-pipeline-automation-plan.md`, `content-machine/CONTEXT.md` and `STATE.md`,
`content-atomisation-model.md`, `03_compliance/content-approval-register.md`, the live
`list_migrations` and `list_tables` output read 2026-08-13 and re-checked 2026-08-14, and both
migration directories compared file by file.

**The 2026-08-17 sweep** was written from `content-machine/STATE.md`, `03_compliance/STATE.md`,
`09_website-app/STATE.md`, the two 2026-08-16 migration files, and the working tree, rather than
carried forward from this file's own claims: absence was checked by looking (no
`packages/content-engine/`, no thumbnail renderer, `review.html` and the social dashboard both still
present) rather than inferred from the plan.
