# Content Machine State

_Last updated: 2026-08-18_

Volatile status for the content machine. Durable rules are in `CONTEXT.md` and the framework docs.

## The twelve dead ids are RE-MAPPED, I3 is green, and fixing them exposed an arming gap (2026-08-18, latest)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Unchanged: re-mapping an id moves no slot.

✅ **All twelve dead ids re-mapped. I3 is GREEN and total violations fell 17 → 7.** Applied by a new
committed script, `scripts/content-engine/remap-metricool-ids.ts`, not by hand: it had been
hand-written as a throwaway three times and the cause is structural, so it will happen again on the
next arming pass.

**It matches by SLOT, and that is the whole design.** The id is the thing that is unreliable, so it
cannot also be the key. What survives an arming is the network plus the publication instant, which is
what a human set and what neither side rewrites. **It refuses ambiguity rather than guessing**: two
live posts in one slot changes nothing, because a wrong remap reads as healthy while attributing one
post's numbers to another post's asset, which is worse than a dead id that announces itself.

**It fixes the id and nothing else**, deliberately. `external_url`, status and publication evidence
stay `metricool-writeback`'s job; duplicating that here would give two writers one column. Sequence
is remap → writeback → doctor, and all three ran.

🔴 **Two API traps found and recorded in the file.** The list endpoint rejects the compact
`20260817000000` stamp and wants a local `yyyy-MM-dd'T'HH:mm:ss`. Worse: **a wrong parameter name is
not an error.** Sending `from`/`to` instead of `start`/`end` returns HTTP 200 with `{"data":[]}`,
indistinguishable from a brand with no posts, which is the same shape as the wrong-brand trap
`metricool-metrics` already records.

🔴 **The first test run executed the script against the live API and production database.** The
entry-point guard was a suffix regex, and `test-remap-metricool-ids.ts` **ends with**
`remap-metricool-ids.ts`. Fixed to basename equality. **The class was then checked, not assumed:
every other script in `content-engine/` already uses `path.basename` with exact equality and is
immune.** This one was the only deviation, because it was the only one written from scratch today.

✅ **Twelve tests, and the suite is registered in `npm run test:engine`** so it runs with the rest.

⚠️ **Day 2 still cannot be recorded, and the gate is right to refuse it.** `carousel-b12-blood-test`
resolves now and Metricool says PUBLISHED, but it carries **no public URL**, and a database gate
refuses to mark a rendition published without one. That is evidence discipline working, not a bug.
**I4 is down from three violations to this one.**

🔴 **Fixing the ids made a REAL gap visible: three carousels are unarmed inside the 72-hour horizon.**
I12 could not see them before, because a dead id cannot report an arm state. Day 2 (past), **day 3
(21.8h)** and day 4 (69.8h) all read `autoPublish=false` in Metricool: they will sit in the calendar
looking scheduled and never go out. **Nothing was armed here** — that is a live publishing action on
Keith's account.

## The Instagram field names are ANSWERED, day 2 DID publish, and day 3 is not armed (2026-08-18)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Unchanged.

✅ **The Instagram metric field names are settled, and the old mapping was WRONG in a way that would
have failed silently.** Read from Metricool's own published field list
(`getAnalyticsAvailableMetrics`, network=instagram, connector=posts), not from a live row.

🔴 **`impressions` is DEPRECATED for Instagram** and Metricool's own description of it is *"Do not
use this field"*. **Our mapping had it FIRST**, so a stale deprecated value would have beaten the
real one and nothing would have looked broken. The live organic field is **`views`**. `videoViews`,
`impressionsTotal` and organic `clicks` are deprecated too.

🔴 **Ten of the old candidate names do not exist in Instagram's vocabulary at all**:
`totalImpressions`, `accountsReached`, `saves`, `totalSaved`, `bookmarks`, `totalLikes`,
`totalComments`, `totalShares`, `plays`, `reelPlays`. They were carried over from the X and Facebook
shapes. Corrected to `views`, `reach`, `likes`, `comments`, `shares`, `saved`.

⚠️ **There is NO watch-time field on this connector**, so `watch_seconds` is null for Instagram by
fact rather than by omission, and is now mapped to an empty list on purpose.

⚠️ **Still one inference, stated rather than hidden:** these are the Data Studio metric names, and
the per-post analytics endpoint the script reads could key its rows differently. The `unmapped`
report remains the thing that proves it on the first live capture. It is now checking a documented
name instead of a guess. `tsc` clean, all metrics tests pass.

🔴 **Metricool has produced NO Instagram analytics row for either published post**, on either brand,
across every range tried. Two posts are live and the analytics side is empty, so the mapping still
cannot be verified against real data.

✅ **DAY 2 DID PUBLISH. The doctor was right that something was wrong and wrong about what.**
`carousel-b12-blood-test` shows `status: PUBLISHED` in Metricool for 18 August 13:00 London. **It
carries no permalink yet**, which is why write-back could not record it and why our database still
says `scheduled`.

🔴 **The root cause is the id, and it is the 2026-08-16 arming failure again.** Our database holds
`361490104`; the live post is **`363272484`**, created 2026-08-17 22:22. Arming replaced the post and
minted a new id, so write-back joins on a corpse. **This is the same mechanism behind all twelve of
I3's dead ids**, now confirmed by reading Metricool's side rather than inferred from ours.

✅ **The other two I4 violations also published.** `x-w02-2-adequate-is-not-optimal` (18 Aug 12:20
London) and `one-flagged-line` on Facebook (11:00 London) both show `PUBLISHED` with public URLs.
**So I4 is measuring a write-back lag, not a publishing failure**, and its finding text ("it either
published and nothing wrote back, or it silently did not go out") resolves to the first branch in all
three cases.

🔴 **DAY 3 IS NOT ARMED AND IT IS DUE TOMORROW.** `carousel-ferritin-blood-test`, 19 August 13:00
London, sits at `status: PENDING` with **`autoPublish: false`**. That is inside the 72-hour horizon,
so by I12's own rule it is a fault rather than the standing draft rule working. **Nothing has been
armed and nothing here was fixed.**

## Phase 5 is OPEN: the claim ledger has a schema, and 5.3/5.4 turn out to be blocked on data (2026-08-18, latest)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Unchanged: the migration is additive and empty.

✅ **5.1 and 5.2 are BUILT, applied and verified.** Migration
`09_website-app/database/migrations/20260818_content_claim_sets.sql`. Four new tables:
`content_topics`, `content_topic_articles` (unique on `article_id`, so one article belongs to exactly
one topic), `content_claim_sets` (versioned per topic, **at most one signed set per topic**, enforced
by a partial unique index), `content_claims` (one sentence, one source per row). `content_assets`
gained `claim_set_id` and `pinned_at`.

✅ **`content_asset_revisions` was deliberately NOT extended.** The plan proposed it as "a table built
for the job", but it hangs off an **asset** and a claim set sits **above the article**. Reusing it
would have bent the shape her ruling defined, so it is untouched and still empty.

✅ **Eight controls, each verified by ATTEMPTING it** in a transaction that rolled itself back rather
than reasoned about: signed-with-no-signer refused; a second signed set per topic refused;
pin-to-draft refused; pin-to-signed allowed; **pin-to-superseded ALLOWED**, because Q13 says live
derivatives keep running and a gate refusing it would silently convert 5.4 into a takedown;
article-in-two-topics refused; duplicate claim position refused; deleting a pinned set refused.

✅ **The first topic exists, taken from her ruling rather than inferred:** `tiredness-and-its-markers`
holding the four articles she named, with the rationale recording that it crosses three pillars on
purpose so the next reader does not "correct" it back to the pillar map.

✅ **`lib/supabase/types.ts` regenerated**, which also closes the debt recorded on 2026-08-17 when
`weekly_slots` was added and the types were not. `tsc --noEmit` clean.

🔴 **5.3 and 5.4 are NOT built, and the reason is worth recording: they are blocked on DATA, not on
code.** The tier ladder classifies a derivative against the claims it carries, and the superseded
surfacing lists what is pinned to an old version. **Both need at least one SIGNED claim set, and none
exists.** Building them now would mean writing logic with nothing to run against and no way to tell
whether it works.

**So the next step in Phase 5 is not engineering.** It is drafting the first claim set for
`tiredness-and-its-markers` (one sentence per claim, each with its source, per Q11) and sending it to
Ewa for signature. **Nothing can pin until she signs it**, which is the model working as designed
rather than a blocker.

## Both C answers closed in two minutes, and a "topic" turns out NOT to be a pillar (2026-08-18, later still)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Unchanged, and re-read rather than assumed.

✅ **Nothing is outstanding with Ewa.** Seventeen rulings in one working day across three emails.
Sent 13:17 UTC, answered 13:19: `1: A  2: A`.

✅ **Chest pain is settled.** `cholesterol-test` gains the 999 line for **sudden or severe** chest
pain and keeps its GP line for everything else; `one-load-five-places` is untouched. The two articles
now differ **deliberately**, which is what "judge it in context" asked for. **Owed and not done:** add
the line, then sweep every derivative that inherited `cholesterol-test`'s chest-pain wording. That is
code, not docs.

🔴 **A "topic" is BROADER than a pillar and cuts across the pillar map.** One claim set covers
`why-am-i-always-tired`, `low-vitamin-d-symptoms`, `b12-blood-test` and `ferritin-blood-test`, which
sit in **three** pillars (B, A, D, with ferritin touching G). Checked against `coverage-rules.md`
rather than assumed.

🔴 **The two taxonomies are on different axes, and conflating them would have been a real defect.**
Pillars are **search-intent**: the sibling-overlap table exists so two articles do not cannibalise
each other's SERP, which is why vitamin-D-as-a-cause-of-tiredness is split between A and B by reader
language. A claim set is **clinical-claim**: the same claim is the same claim whichever query brought
the reader in. Building the ledger on pillars would have looked correct until one claim needed signing
twice with nothing able to tell it was one claim. A warning to that effect is now in
`coverage-rules.md` itself, because that is where someone would go looking.

🔴 **Consequence: the pin points at a unit we have no table for.** `content_asset_revisions` hangs off
an asset; a claim set needs something **topic-shaped above the article**, articles joined many-to-one.
That is now the first real design decision in Phase 5, and it is a schema question rather than a
sign-off one.

**The transferable bit: a C answer was a badly-framed question, twice, not an undecided reviewer.**
Both abstract questions came back C with no words. The same two, re-asked as one named article plus
one named symptom, and four named articles plus a count, took **two minutes between them**. Neither
was re-asked in its original form, and picking an option she had declined would have invented a
ruling.

## Fifteen rulings in one reply: Phase 5 is fully specified, and two answers did not close (2026-08-18, later)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Unchanged: rulings move no live state until the copy is built.

✅ **Six open asks went as ONE email and came back as one reply.** Sent 10:38 UTC, answered 13:02,
all fifteen questions. Verbatim record:
`03_compliance/correspondence/2026-08-18-keith-ewa-fifteen-rulings.md`. The batching change is the
whole reason this took one round instead of six.

✅ **Q2: YES to both. The two packets from 15 August are cleared.** The non-lifestyle causes may be
named on `why-am-i-always-tired` and on `inflammatory-markers-blood-test`, in the general frame,
source-attributed and GP-routed. **The cancer paragraph goes in AS WRITTEN**, capability-denial
framing untouched. The ferritin sentence and the anti-self-labelling guard both stand unamended, and
depression and anxiety stay out of the fatigue list as a now-ruled omission.

⚠️ **That clears the COPY, not the publish.** Neither block exists in `blog_articles` yet. Building
them, re-exporting the mirror and running each article's own gate is separate work and none of it has
started.

🔴 **Q8: NO. Keith may NOT name his own figures as low against a clinical cut-point on camera.** He
may show the numbers; the label is refused. This closes the question ruling D left open on
2026-07-29, and closes it the restrictive way. Applied to `assets/2026-07-13-ep-0-baseline.md`, whose
Ewa row went from RULING OWED to the two answers, and forward-pointed from the July correspondence
record. **Q7 cleared the Ep 0 script itself as drafted**, so the video is not blocked, only its
framing is bounded.

✅ **Q10 to Q15 turned Phase 5 from a design question into a build spec.** Forward only, existing
sign-offs stand. She signs a list we draft. A new version only when the **meaning** changes.
Superseded pins **keep running** and are re-pinned at the next edit. **The tier ladder is agreed as
written, including Tier 1 auto-passing with no Ewa at all**, which is where the entire time saving
lives and which she was explicitly offered the chance to refuse. No expiry.

🔴 **Q9 did not close, and it is the only thing blocking 5.1.** She answered "in your words" and wrote
no words. **That refuses both offered options rather than licensing a pick**: A was the pillar, B a
finer per-cluster unit. Choosing for her would be inventing a ruling, which is the exact failure
CA-028 exists to prevent. One line owed.

🔴 **Q1 did not close either, and the safety risk survives her answer.** Her words: *"this should
looked at in context... so no chance. One blanket phase will not be appropriate"* (read as "phrase").
That refuses both offered corrections, so we may not unify the two articles by wording. **It does not
say what `cholesterol-test` should do about sudden or severe chest pain**, and that article still
carries no 999 line while `one-load-five-places` does. **The conflict is still live on the site**, and
the follow-up has to name that one article and that one symptom rather than re-ask the general
question she has already declined.

## D2 is RULED, the last gate is closed, and the claim set moved to the TOPIC (2026-08-18)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Unchanged from the 2026-08-18 3.4 section below, which is expected: a decision about
how approvals work moves no live state. Re-read from `content-doctor` rather than assumed.

✅ **D2 is ruled and the plan has no open gates left.** Asked at 08:38 UTC, answered at 08:43, four
questions in one reply. The claim-ledger model is adopted: Ewa signs a versioned, dated claim set, a
derivative repeating those claims pins to a version and does not come back to her, and anything
adding an unsigned claim comes to her fresh. Record with the questions and her answers verbatim:
`03_compliance/correspondence/2026-08-18-keith-ewa-d2-claim-ledger.md`.

🔴 **She overrode the plan on one point: the claim set sits PER TOPIC, not per article.** Step 5.1 was
written the other way. This changes what the pin points at and therefore the shape of the store, so
it is a design change rather than a wording one, and 5.1 has been corrected in place.

🔴 **"Topic" is not defined in our terms, and it must not be quietly read as "pillar."** It was her
word, offered as one option in a one-word question, and our nearest existing unit is the content
pillar. They may be the same; nothing on the record says so. **One line back to her, owed before 5.1
is built.**

✅ **Rewording is now HER rule, not our reading of one.** A change of tense, or one sentence split in
two, that adds no proposition stays covered by the pin; anything adding a proposition still goes to
her. This promotes CA-029 Amendment 1 (2026-08-16, Keith-only, one bio line) into a standing clinical
rule covering every derivative. Applied to `sops/sop-compliance-route.md` step 3 and
`sops/sop-atomise-pillar.md` step 2, both of which are live today and do not wait on Phase 5.

⚠️ **Ruling 4 agreed to answer the two packets TOGETHER. It did not answer them.** `869ejbq1d`
(fatigue, E1-E5) and `869ejcxp0` (inflammatory, G1-G5) are both still `pending`, naming the
non-lifestyle causes is still unruled, and nothing in either may ship. **The single principle
question is now the only thing between here and closing both**, and it should carry the "topic"
question with it rather than being a second email.

⚠️ **The gate is ruled, not fully signed.** D2's owner is Keith **and** Ewa. Her half is on record;
his is not. ClickUp `901219880207` at `pending`, and Keith moving it is the countersignature.

🔴 **The 2026-08-16 reason for skipping Phase 5 does not survive contact with this.** It was recorded
as "no approval route to her was open"; the route was the same one used twice on 15 August and four
times before that, and she has answered every ask within minutes for a month. **The queue was on our
side, not hers.** Risk 4 in the plan is rewritten to say so, because a risk that names a second
person and turns out to be ours is worth more as a correction than as a closed item.

🔴 **`content-doctor` is RED, and none of it is D2's doing.** Re-run at the end of this sweep: **10
of 12 invariants pass, I3 and I10 fail, 14 violations.** **I3: twelve renditions carry an
`external_post_id` that Metricool no longer resolves**, all of them `instagram/carousel`, which is
the failure mode recorded on 2026-08-16 (arming a draft REPLACES the post and its id). **I10: two
lane-1 channels under cadence** in the window to 2026-08-25, `linkedin/text-post` filling one of two
slots and `substack/newsletter` with nothing queued and no pause reason on the record. Per the plan,
a red invariant belongs in ClickUp rather than in a file beside the script. **Neither was touched
here**, and both are named so that a green-looking sweep report does not imply a green board.

## Plan step 3.4 is COMPLETE: the rename moved upstream into the renderer (2026-08-18)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles**, 10 planned channels, 55 content assets, 91 renditions,
**21 renditions need a thumbnail**; **18 articles x 10 planned channels = 180 slots, 42 filled,
backlog 138**. Identical to the 2026-08-17 section, which is the expected result of a change that
moved no live state, and re-read rather than assumed for exactly that reason.

🔴 **The I7 parser gap recorded on 2026-08-17 is NARROWER than it was written.** Measured by reading
`COUNT_PATTERNS`: `published articles` and `renditions need a thumbnail` both parse, so the topmost
section was partly asserted all along. What does not parse is the **grid** sentence in the form
`grid 180 slots, 42 filled, backlog 138` — the pattern wants `N articles x M planned channels = N
slots, N filled, backlog N`, which only the 2026-07-31 section happens to use. So the previous entry
was right that the grid went unasserted and wrong that the whole count line did. **The counts above
are written in the forms the parser actually reads**, which is a workaround, not the fix: the fix is
for the pattern to accept the phrasing the file's own convention produces.

**No live state moved, and that is the headline.** The carousel pipeline now runs build → render →
publish with **no hand-carried step**, and the bucket is untouched: the newly-assembled publish set
is **byte-identical to the hand-made one across all 110 files**, and a dry upload from the new
default source resolves 110 objects with **zero to put**. Counts elsewhere in this file are
unaffected.

**The gap was never really a rename.** It was a selection rule plus one rename, and only the second
half had ever been described. Rendering writes 12 or 13 files per deck; a post publishes 11.
`cover-overlay.png` and `cover-video.png` are inputs to the video composite, `slide-01.png` is the
superseded direction-A cover. The rename is `cover-video-<slug>.mp4` at the prototype root →
`<slug>/cover-video.mp4`, because `video.js` names by deck at the root: its non-deck path names by
model and scene, so minting ten decks would overwrite one file ten times.

🔴 **Selection had to be an ALLOWLIST, and this is the part worth keeping.** The obvious
implementation is "copy everything except the intermediates", and it **fails open**: the next
artefact anyone adds to a render lands in a PUBLIC bucket on the next run, with no failure anywhere
to notice it. `03_compliance/CONTEXT.md` says what may never enter that bucket, and an exclusion
list is a rule that admits by default. The allowlist is taken from what `schedule.js` actually
addresses, so the set and the post it builds cannot drift apart silently.

🔴 **A missing file refuses the WHOLE set.** Ten good files are the dangerous outcome, not the safe
one: they upload cleanly, read as finished, and surface only when a post addresses the eleventh —
the media-less carousel that 1.3 found live in the shared scheduler. Exit codes split by intent:
`--publish-only` exits 1 on an incomplete set, while a default assembly after a successful render
reports the gap and exits 0, because failing the render would make minting a new deck look broken at
the step that worked.

✅ **All three refusal paths were exercised on a throwaway deck** — missing video, missing slide,
stale file pruned — rather than shipped untested, which is the gap 3.5 recorded about its own.

**One latent bug fixed on the way.** `render.js` picked its optional slide argument as "the first
argument that is not `--deck` or its value", correct while `--deck` was the only flag. Adding a
second flag would have made `--publish-only` parse as a slide name and die on "No such slide". Now
excluded explicitly.

**`frontend/public/carousel/` is no longer the input to anything.** It is neither tracked nor served;
`publish-media.js` defaults to `carousel-prototype/publish/` instead, and reading from the old path
would have kept a hand-assembled copy alive as the real source. `publish/` is gitignored: every byte
in it is a copy of something already on disk, selected and renamed by rule.

## The carousel route PUBLISHED, so the lane is in plan and the denominator moved (2026-08-17)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles, 10 planned channels, 55 content assets, 91 renditions, 21
thumbnails owed; grid 180 slots, 42 filled, backlog 138.**

✅ **Day 1 of the 30-day run published on its own, and the canary answered the question it existed
for.** `carousel-14-signs-of-vitamin-d-deficiency` went out at 13:00 London to
[instagram.com/p/DcI_hzeggUU](https://www.instagram.com/p/DcI_hzeggUU/), eight media, autoPublish.
**Metricool does ship an 8-media Instagram carousel and the account accepts it**, which is what the
2026-08-10 test could not prove: that test proved Metricool ACCEPTS one, not that Instagram publishes
it. Recorded by `metricool-writeback` (3 rows: this, an X post and `the-number-not-on-the-panel`).

✅ **`instagram/carousel` is now `in_plan`. Grid 162 → 180 slots (+18).** Run via
`flip-carousel-in-plan.ts --apply`, and **the guard was satisfied rather than bypassed**: it refused
twice while `route_verified_at` was null, then passed once the publish was on record.
`--force-unproven` was not used.

🔴 **A gap found doing it: `metricool-writeback` does NOT set `route_verified_at`,** although the flip
script's header says "let the write-back job record the publish, first". Writeback moves the
RENDITION (status, published_at, external_url) and never touches `content_channels`. The column is
populated by a hand-run `update` at the foot of
`database/migrations/20260816_content_channels_capability_spec.sql`, which is evidence-derived and
idempotent, and which is what actually unblocked the flip here. **Either writeback should own that
update or the flip script's instruction should name the migration**; as it stands the two disagree
and the reader follows the wrong one.

🔴 **I7 passed while this very section quoted `grid 162 slots`.** The newest dated section is the one
I7 is documented to assert on, and it held stale counts through a run that reported
`gridSlots=180` in its own scope line. The two lines it DID flag were both in the 2026-07-31 section
and correctly treated as history. So the assertion parser is not catching the count sentence in this
section's format, which makes I7 green on exactly the failure it exists to catch. Counts above are
now correct; the parser gap is not fixed.

⚠️ **I10 and I12 both FAIL, and both are honest.** I10: `linkedin/text-post` is under cadence, 1 of 2
slots inside 7 days, and `substack/newsletter` needs a pause reason with a death date. The carousel
lane is NOT flagged, because 29 posts are scheduled. I12: the next three carousel days
(**B 18 Aug, C 19 Aug, A 20 Aug**) are `draft=true, autoPublish=false` in Metricool, so the database
says scheduled and nothing will go out. That is the standing draft rule, not a fault, and arming is
Keith's.

🔴 **Close B must not be armed yet.** Its 10 posts route to the Kit 2 and Kit 3 pages, and their
first-ever pre-flight (2026-08-17) found the sample-report panels contradicting `classifier.ts` on
five markers, including the FAI and CRP items ruled under CA-034 five days earlier. Detail in
`03_compliance/STATE.md`. Day 2 (18 Aug) is a close-B post.

## X week 3 APPROVED and registered (2026-08-17)

**Live counts, re-read from the database rather than carried forward** (topmost dated section, so I7
reads these): **18 published articles, 9 planned channels, 54 content assets, 90 renditions, 21
thumbnails owed; grid 162 slots, 31 filled, backlog 131.**

**Registering week 3 moved four of those**, which is the reason they are restated rather than carried
over: assets 47 to 54 and renditions 83 to 90 (seven new X posts), and **grid filled 30 to 31**,
because `why-am-i-always-tired` x `x/text-post` is a cell no previous X week had filled (week 1 was
`myth-of-normal-range`, week 2 `low-vitamin-d-symptoms`).

🔴 **I7 PASSED on the stale numbers, and the reason is worth knowing before it is trusted again.**
The counts above sat in a section dated **2026-08-16** while the clock had rolled to the 17th, so I7
read it as an older dated section, treated its figures as history, and asserted nothing. It reported
green while the topmost counts were wrong by one on the grid and by seven on two other totals.
**The check is not wrong** — it deliberately does not fail old sections — but it means **a dated
section stops being asserted the moment the date rolls over**, so counts written late at night are
unguarded from midnight onward unless a new dated section carries them. That is the same shape as the
section's own parenthetical warning ("a section without them blinds the check"), arriving by a route
nobody had considered: not an omitted count, an expired one.

### The week itself

**[`drafts/x-week-2026-08-24.md`](drafts/x-week-2026-08-24.md), 7 posts for 24 to 30 August, queue
row X-03 taken as written** (`why-am-i-always-tired`, `[W]`, so re-picking would have moved the ~40%
wellness floor). **Pre-flight clean on the payload: 0 HARD both scanners, 0 REVIEW on G5.**

**[`drafts/x-week-2026-08-24.md`](drafts/x-week-2026-08-24.md), 7 posts for 24 to 30 August, queue
row X-03 taken as written** (`why-am-i-always-tired`, `[W]`, so re-picking would have moved the ~40%
wellness floor). **Pre-flight clean on the payload: 0 HARD both scanners, 0 REVIEW on G5.**

✅ **APPROVED by Keith 2026-08-17 and REGISTERED the same day.** Seven `content_assets` rows, seven
`x/text-post` renditions, canonical `why-am-i-always-tired`, all `preflight='green'` and
`status='approved'`. Six carry `publisher='metricool'` with their slots; **the Sunday thread carries
`publisher='manual'`**, so the shared scheduler refuses it by name every run rather than a reader
having to remember the by-hand rule.

**The copy was parsed out of the draft, never re-typed, and the parse is proved rather than assumed:**
the registered character counts came back **274 / 262 / 221 / 259 / 259 / 205**, identical to the
measured ones. Re-keying pre-flighted copy is how a cleared claim quietly stops being one.

✅ **SCHEDULED 2026-08-17 on Keith's instruction. Six posts Mon to Sat, all verified against
Metricool's own calendar** rather than inferred from the send returning an id: slot, copy, length and
draft flag were re-read afterwards.

| Day | Time (London) | Post | Metricool id | chars |
| --- | --- | --- | --- | --- |
| Mon 24 Aug | 08:05 | the three input guides | `362835628` | 274 |
| Tue 25 Aug | 12:30 | both ends land the same | `362835629` | 262 |
| Wed 26 Aug | 07:55 | founder line | `362835631` | 221 |
| Thu 27 Aug | 12:15 | link-out | `362835632` | 259 |
| Fri 28 Aug | 08:35 | myth correction | `362835633` | 259 |
| Sat 29 Aug | 12:25 | open question | `362835635` | 205 |

**The lengths on the calendar match the measured counts exactly**, which is the end-to-end proof that
the bytes pre-flighted are the bytes scheduled: measured by hand, parsed by `register-x-batch`,
stored in `content_renditions.body`, sent by `metricool-schedule`, and read back off Metricool.

🔴 **The Sunday thread was REFUSED by name, and that is the mechanism working.**
`x-w03-7-thread-the-fortnight-test` carries `publisher='manual'`, so the shared scheduler declined it
with "publisher is manual, not metricool. This job must not take over a rendition routed elsewhere."
**The by-hand rule is now something the pipeline enforces rather than something a human has to
remember** — which is the fix for week 1's thread being scheduled by mistake.

🔴 **Keith began arming immediately and the ids started moving, for the THIRD measured time.** Monday
is armed: **`362835628` is dead and `362835887` holds the slot**, `draft=false, autoPublish=true`,
identical copy. The other five were still `draft: true` on their original ids at the time of writing.
**The id column above is a record of what was created, not of what is live.**

🔴 **The slot sweep caught a SECOND dead id that the id-based check had not yet reported.**
`the-stack`'s Facebook post was armed in the same sitting: **`362764505` → `362835970`**. I3 walks
outward from ids we already hold and had only flagged the X post; reading the calendar by slot found
both in one pass. **That is the reverse-direction gap this file has recorded twice before, now with a
worked example on the same evening it was written about** — an id-first check finds dead ids one at a
time and never tells you what replaced them.

⚠️ **Five X posts remain unarmed and their ids WILL change on arming.** Re-map by slot after the
session finishes rather than trusting the table above. The sweep is currently a throwaway script each
time, which is three hand-written throwaways in one evening: **promoting it to a real
`remap-by-slot.ts` is owed** and is the obvious next tool, since the procedure is already the
documented rule in `CONTEXT.md` and nothing implements it.

⚠️ **Two OLDER posts are visible in the same window and are also still unarmed:** `the-stack` on
Facebook (Tue 25 Aug 11:00, `362764505`) and on LinkedIn (Thu 27 Aug 11:00, `362765721`). Neither is
part of this batch; both were scheduled 2026-08-16 and have been sitting as drafts since.

**No network collision across the window.** Tuesday and Thursday each carry a Facebook or LinkedIn
post at 11:00 and an X post an hour or so later, which is different networks and deliberate.

🔴 **This pillar already carried FIVE derivatives, the most on the board, and three of its strongest
hooks were already spent** — the accumulation framing, the four-marker list (twice) and sleep
quality. Each existing derivative was read before drafting, and the week deliberately takes the only
ground left: the wired-but-tired loop, training load versus recovery from both ends, the NHS input
numbers, and the fortnight test. **Recorded as a table in the draft** so week 6 does not walk back
into the marker list from the B12 side.

**The fragment pass earned its place again: four genuine findings, all corrected.** One HARD, on
"treat" used to mean *regard* rather than *medicate*, removed rather than argued (a payload does not
ship carrying a HARD hit on an argument about intent). Then three qualifier drops: the alcohol line
had lost "spread across several days", which is the clause that stops "14 units a week" reading as
one sitting; the caffeine line stated an instruction the mechanism paragraph does not give; and the
NHS list said "sleep" where the source says "not enough **good** sleep". **Character counts were
measured by reproducing the parser, not asserted** — the first draft had Monday at 297 and thread 7
at 319, both over the 280 ceiling.

### ✅ CA-029 now names X, and the reason it did not is the interesting part

**Keith's ruling, 2026-08-16.** The approval covered three surfaces because **X was not a configured
channel on 2026-07-28**, so the list recorded what existed at the time. **An omission caused by
sequence was being read as an exclusion caused by decision**, and it cost three batches: week 1
flagged the extension as owed, week 2 recorded it still had not happened, week 3 declined to use the
line at all. Nobody asked the one question that settled it in a sentence.

**"Verbatim" was relaxed in the same amendment, and that gap was real.** The X posts open with a
re-tensed, re-split form of the About section's first line, so under the original wording they did
not strictly qualify even on claim identity. Tense and sentence-boundary changes that add no
proposition are now explicitly covered; anything adding a proposition still needs a fresh submission.

**Keith-only, and Ewa's ruling is untouched.** What she was asked to rule on is the
symptoms-to-testosterone framing, put to her against the Kit 1 scoping rule and cleared without
amendment. **None of that is in the reused sentence**, which states no marker, threshold, symptom,
outcome or product claim. Adding a surface changes no claim.

**Three stores updated to agree:** the register row, `approval-record-author-bios-2026-07-28.md`
(Amendment 1, with the signature block extended), and the scope note in `02_brand/author-bios.md`.

✅ **Mirrored to the hub the same evening, once the connectors came back:** ClickUp
[`869eaqwv0`](https://app.clickup.com/t/869eaqwv0). Amendment 1 as a comment, the task NAME extended
to state the added surface, and a banner on the description marking the original body as the
2026-07-28 record rather than the current scope. **The body was deliberately NOT rewritten:** it is
what was approved on the day, and editing it would destroy the substantiation trail to make a
summary tidier.

🔴 **For about an hour the repo asserted an amendment the hub had never heard of, and that window was
marked rather than left silent.** Both write paths were down at once (the claude.ai connector had
dropped, the repo-wired ClickUp server is license-locked), so the register row carried an explicit
"MIRROR AHEAD OF THE HUB, do not cite this as the authority" warning until the sync landed. **The
hub-and-mirror convention only works if the mirror can say when it is ahead**, and nothing enforces
that automatically: a register row that quietly runs ahead of ClickUp looks exactly like one that is
in step.

⚠️ **A SECOND unnamed surface was found by the same check and is deliberately left open: the LinkedIn
HEADLINE.** Live since 2026-07-28, it carries the same opening sentence plus a compression of the
About's second paragraph, and CA-029 names the **About** section, not the headline. Same shape of gap
as X was. **Not swept in, because Keith approved X and the headline has not been put to him.**

## 🔴 The cholesterol amber was self-inflicted, and nothing was ever routed to Ewa (2026-08-16, later still)

**Live counts, re-read from the database rather than carried forward** (this section is the topmost
dated one, so invariant I7 reads its counts and a section without them blinds the check): **18
published articles, 9 planned channels, 47 content assets, 83 renditions, 21 thumbnails owed; grid
162 slots, 30 filled, backlog 132.** Doctor **10 of 12 PASS**, unchanged; the FAILs remain I10 and
I12.

🔴 **All three assets carrying `amber-ewa` had `ewa_task = null`, and Ewa's queue held no task for
any of them.** The board read as "blocked on Ewa" for a day. It was blocked on **nobody having asked
her**. Her queue is 26 tasks, 25 complete: she is not the bottleneck and never was. **An asset marked
as needing a ruling is not the same as a ruling having been requested, and until today nothing
distinguished the two.**

### Every clinical item on the two cholesterol posts was a RESTORATION, not a new claim

**Six flagged items, six clauses that already exist in the signed article**, dropped under
compression when the posts were atomised: the heart-disease narrowing on the UK targets; the
GP-regardless-of-any-reading routing for the statin-managed; the third escalation trigger; the hedge
on "higher is generally better"; the effect-size superlative on the ApoB comparative; and the word
ApoB in a mechanism sentence, whose loss made the sentence arguably false, since HDL is a particle
and carries cholesterol away.

**The canonical-asset rule forbids a derivative INTRODUCING a claim the article does not make.
Restoring one it does make is the opposite operation**, so the route was editorial and not clinical.
Confirmed by an independent `compliance-reviewer` pass on the restored copy, which returned **0 HARD,
every claim traced, and "nothing remaining needs a fresh clinical ruling from Ewa"**. Both scanners
now read 0 HARD; G5 reads 2 of 2 clean.

⚠️ **The restorations introduced five defects of their own and every one was caught by the review
rather than by me.** One word (`regardless of any reading here`) narrowed a signed safety
instruction; the targets sentence hit 35 words back-to-back with a 27-word one, breaching two tone
rails in the paragraph carrying five clinical thresholds, with `lower again` landing next to the one
target it cannot apply to; the LinkedIn restoration was appended mid-paragraph, making a five-sentence
block that puts the escalation below the "see more" fold; `ApoB particle` ended up one sentence
before ApoB is defined, inverting the article's order; and both files' craft notes, rails and
inheritance tables still described the pre-restoration copy. **A restoration is an edit. The reason
this file exists is that edits to clinical copy get reviewed, and that does not stop being true when
the edit is a correction.**

🔴 **And the notes edits tripped G5 with three HARD hits, in exactly the way this asset's own file
warned about.** Writing "diagnosed heart disease" into a claim-inheritance table put the bare term
outside the negation context that clears it in the payload. **The commentary is scanned as copy**;
the file already said so, in a parenthesis, and it was walked into anyway. Reworded to describe
rather than quote.

**The two generated mirror blocks were stale in opposite directions** — LinkedIn said `green`, F-06
said `not-run`, the database said `amber-ewa` for both. On the gate model a row still reading green
can reach `approved` without a single item being ruled on. `content-sync` regenerated all 29 blocks;
`--check` is now clean across every asset file.

### What is actually owed now, and by whom

✅ **BOTH POSTS APPROVED by Keith, 2026-08-16**, `approved_by = 'Keith'`, and with them his rulings
on the two items that were genuinely his: F-06's waitlist-only link, and "So far, so fixable" on
LinkedIn.

**The pre-flight column was moved `amber-ewa` → `green` to let the gate accept that**, and it is
recorded here because of what happened this morning: **this green was NOT self-cleared.** It rests on
the independent `compliance-reviewer` pass over the restored copy (0 HARD, every claim traced, "no
fresh clinical ruling needed"), and the asset takes the gate's **first** route — green pre-flight plus
a published canonical article to inherit from — rather than the `ewa_signed_at` route, which stays
untouched and null on both.

**Both bodies are bridged into `content_renditions.body`**, extracted rather than re-keyed:
LinkedIn 2,380 chars (limit 3,000) with its first comment, Facebook 2,981 (no limit set, and the
channel carries no first comment by spec).

✅ **BOTH SCHEDULED as drafts, on Keith's slots, and verified against Metricool's own calendar**
rather than inferred from the id the send returned:

| Post | Channel | Slot (London) | Metricool id | id at creation, now dead | Verified |
| --- | --- | --- | --- | --- | --- |
| `the-number-not-on-the-panel` | linkedin/text-post | **Mon 17 Aug 11:00** | **`362811189`** | ~~362810176~~ | slot, copy, first comment; **`draft: false, autoPublish: true`** |
| `five-numbers-one-letter` | facebook/link-post | **Tue 1 Sep 11:00** | `362810173` | (never armed yet) | slot, copy, `draft: true`, article photo attached |

✅ **ARMED by Keith the same evening, and the id changed exactly as the rule predicts.** I3 went red
within the hour: `362810176` returned nothing from Metricool. **That is not a lost post.** Re-reading
the brand calendar for the slot found the identical copy under **`362811189`**, `draft=false,
autoPublish=true`, so the post will send itself at 11:00 on 2026-08-17. The database was re-mapped by
SLOT, which is the only key that survives arming, and **I3 is green again**; the LinkedIn rendition
also dropped off I12, correctly, because it is now armed.

**This is the second measured instance of the same behaviour and it behaved identically**, which
upgrades it from "observed once on six X posts" to a reliable property of the draft-to-live flip.
The recovery took one call to the brand-scoped list endpoint. **Walking our own id outward only ever
says "dead"; only the slot says what replaced it.**

**`approved_by` alone did not approve anything, and that is worth knowing.** Setting
`approved_by`/`approved_at` left both assets at `status = 'scripted'`, and the scheduler reads
**`content_assets.status`**, so it skipped both as "not approved yet" while the row visibly said
Keith had approved them. **The gated transition is the STATUS**, and the two fields are not the same
decision. Found by the scheduler's own skip message rather than by anything checking.

🔴 **I10's LinkedIn under-cadence violation CLEARED, and it cleared honestly.** The Monday slot the
new invariant went red about this morning is now filled by a real post, so the count went to 2 of 2
rather than the number being lowered. **Substack is the only remaining I10 violation.** That is the
whole argument for measuring cadence rather than emptiness: the alarm named a specific missing slot,
and filling that slot is what turned it off.

🔴 **The LinkedIn post is 12 hours out and NOT ARMED. I12 reports it as a violation and it is
right.** Keith must arm it in the Metricool UI before 11:00 London on 2026-08-17 or it will sit in
the calendar looking scheduled and never send. **Arming will replace `362810176` with a new id** (see
the arming section below); re-map by slot afterwards rather than trusting the number in this table.
The Facebook post is beyond the 72h horizon and is correctly a note rather than a violation.

| Item | Owner | State |
| --- | --- | --- |
| Ep 0 script + may Keith name his own figures as low on camera | Ewa | **routed today**, ClickUp `869ejjbcf`, joined to `ewa_task` |
| Chest pain: GP or 999? | Ewa | **routed today**, ClickUp `869ejjbcp`, not a gate on anything |

**`ep-0-baseline` is joined to a REAL sign-off task, and `869ec31xu` was deliberately NOT used.**
That task is Keith's own prep item in Sprint — Pre-launch, overdue since 2 Aug for a shoot that did
not happen, and it bundles "get a kit" with "send the script to Ewa". **Joining it would have let I5
resolve when Keith ticked his own to-do** — a green meaning "Keith did his prep", read as "Ewa
ruled". That is the same shape as every other failure recorded in this file. The stale prep task is
still open and still Keith's to close or re-date.

🔴 **INCIDENTAL, found by the reviewer, and it is partner-facing approved copy.**
`affiliates/briefs/Influencer-Brief-v2.3.md:30` and `PT-Brief-v2.3.md:32` both carry, as affirmative
talking-point copy rather than inside a prohibited list: **"Our GP, Dr Ewa Lindo, signs off the
personalised report."** That matches the red-flag row directly, against the Special Case that Ewa
signs off the **system** and not individual reports. The same sentence carries an em dash. **These
are the briefs partners sign an attestation against**, so this is CA-registered copy needing
re-approval rather than a quiet edit. **Not touched. Keith's call and a decision sweep.**

⚠️ **The article's frontmatter date still disagrees with its publish date** (`date: '2026-06-24'` vs
`published_at` 2026-07-15). Both posts cite the latter. Ewa's sign-off on the article itself is
confirmed: ClickUp `869dvkq1v`, complete.

## Half-cadence is now measurable, and a detector was matching inflections by hand (2026-08-16, later)

**Live counts, re-read from the database rather than carried forward** (this section is the topmost
dated one, so invariant I7 reads its counts and a section without them blinds the check): **18
published articles, 9 planned channels, 47 content assets, 83 renditions, 21 thumbnails owed; grid
162 slots, 30 filled, backlog 132.** Assets and renditions are up from 38 and 74 earlier the same
day, and the grid from 27 filled, because the carousel media backfill and the X week-2 registration
both landed in between. The doctor is **10 of 12 PASS**; the two FAILs are I10 and I12, unchanged in
count, but **I10 now carries two violations where it carried one.**

### The `fixable` gap is closed, and the claim that it reached gate G5 was WRONG

**`compliance-tables.js` matched the fix family by hand-listed inflection** — `fix|fixed|fixes|fixing`
— so `fixable` was not in the list and "So far, so fixable" cleared both scans on
`the-number-not-on-the-panel`. Now matched by stem: `\b(un)?fix(es|ed|ing|able|er|ers)?\b`.
Re-verified on the live post, which reports the REVIEW hit at line 53 where it previously reported
nothing. **An enumeration of inflections is a list somebody has to remember to extend; a stem is
not**, so the new suite (`test-fix-family.js`, 19 cases) asserts the SHAPE of the rule and includes
eight negative cases (`prefix`, `fixture`, `fixation`, `crucifix`) so the widening cannot drift into
noise. The old pattern also **matched `fix-able`** while missing `fixable`, because a hyphen supplies
the word boundary a suffix denies.

🔴 **The previous entry's claim that "the commit gate has the same gap" was WRONG, and the correction
is worth more than the fix.** The fix-family rule lives in `REVIEW`, and
[`content-status/scan.js`](../../../.claude/skills/content-status/scan.js) imports `{ HARD, NEG }`
only. **G5 never ran that rule and could not have.** The premise was true (one file, two consumers)
and the conclusion false: consumers destructure. Checking cost one grep of the import line.
**Consolidating duplicated tables into one module is correct and this repo did it for the right
reasons, but it makes "shared file" read as "shared behaviour"** — and the better the consolidation,
the more convincing the wrong inference. Name the symbol, not the file.

**Measured cost of the widening across assets, drafts and published blog MDX: five net-new advisory
lines.** Four are in published, Ewa-signed articles (`brain-fog`, `fbc-blood-test`,
`low-vitamin-d-symptoms`, `why-am-i-always-tired`) and are **not defects** — REVIEW means a human
rules, and on signed copy a human already did. The fifth is the post that started this.

### I10 can now see a lane running at half its cadence

**`content_channels.weekly_slots`, migration `20260816_content_channels_weekly_slots.sql`, APPLIED.**
I10 asked whether a channel had anything queued, which compares against 1, because 1 is the only
number available to a check whose question is "is this list non-empty". LinkedIn owes **two** slots
(Mon + Thu) and ran weeks 34 and 35 with the Thursday filled and the Monday empty. **Green, both
weeks.** The expected count now lives on the row the invariant already reads.

**Live, first run:** `linkedin/text-post is UNDER CADENCE: 1 slot(s) filled between now and
2026-08-23, but the calendar gives it 2 a week.` Facebook reports `1 scheduled ahead; cadence 1/week`
and X `6 scheduled ahead; cadence 1/week`, both quiet. **The alarm fires on exactly one channel and
it is the known fault**, which was measured before the check was written rather than hoped for after.

**Going dark and running under cadence are kept as DIFFERENT findings**, with a test asserting it.
Substack still reports `has NOTHING queued`, its own pre-existing red. Raising an expected count must
never quietly reclassify the worst state on the board as a milder one.

🔴 **The shortfall is measured FORWARD ONLY, against the dark check's own precedent, and that is
deliberate.** The dark check counts backwards too, from the 2026-08-05 lesson that an alarm which
does not clear when you do the thing it asked for gets ignored. **That reasoning does not transfer:**
a post published last Monday is not one of next week's two slots, and crediting it would restore
exactly the blindness this was added to remove. There is a regression test whose only job is to hold
that line.

**`unified-content-calendar.md`'s two contradictory volume lines are reconciled.** The prose said
"Facebook ~2-3" three lines under a table that says one. The table and the Lane 1 definition agree on
one, so the prose now points at the table instead of paraphrasing it, and carries the warning that
`weekly_slots` and the table move together or neither moves.

⚠️ **X's real cadence is still undocumented, and `weekly_slots` is deliberately 1 for it.** The X
lane ships a batched week of six or seven, but **the calendar table predates the lane and has no X
row at all.** Writing 6 would be inventing a cadence Keith never set, and the lane would then alarm
against itself. 1 means "must not go dark", which is all we actually know. **Adding an X row to the
calendar table is Keith's call.**

⚠️ **`lib/supabase/types.ts` is NOT regenerated for `weekly_slots`.** The doctor reads through its
own loader so it is unaffected, and both typechecks pass, but the typed client does not know the
column. Owed before anything in the app reads it.

## 🔴 A self-cleared pre-flight was overturned by an independent pass (2026-08-16)

**Two cholesterol posts were drafted, self-pre-flighted, and greened by the same agent.** An
independent `compliance-reviewer` pass at Keith's request returned **ten items**, and **both greens
were rescinded the same day.** Rows are now `amber-ewa` with no `ewa_signed_at`, which blocks the
approval gate by construction.

| Asset | Channel | Queue row | State |
| --- | --- | --- | --- |
| `the-number-not-on-the-panel` | LinkedIn | none (no L-row exists for cholesterol) | `scripted`, `amber-ewa`, unslotted |
| `five-numbers-one-letter` | Facebook | **F-06** | `scripted`, `amber-ewa`, unslotted |

🔴 **The blocking item is on the Facebook post and it is a clinical-safety one.** It publishes five
numeric UK targets carrying one of the article's two qualifiers. **Missing: "they're lower again if
you already have heart disease" and the article's own line sending a man with diagnosed heart disease
or on a statin to his GP regardless of any reading.** The post's stated audience is the older,
clinical-curious segment, which is the cohort most likely to be statin-managed, so the qualifier was
dropped from exactly the readers it protects. **Ewa's call.**

**Four more for Ewa, all alterations to inherited material rather than net-new claims:** both posts
carry two of the article's three GP-escalation triggers, dropping chest pain and breathlessness,
where `one-load-five-places` sets the precedent of carrying the emergency line in full and in the
hub's priority order; the Facebook post sharpens "especially when" into "the gap is widest when" on
the one cardiovascular comparative; it drops the hedge from "higher is generally better"; and the
LinkedIn post shortens "inside an ApoB particle" to "inside a particle", which as written is
arguably false, since HDL is a particle and carries cholesterol away.

**For Keith:** the Facebook post publishes five clinical thresholds and its only link is the
waitlist, so the reader never reaches the substantiating article. Deliberate (F-06 is `email-rung`)
and not a breach, since substantiation is held rather than printed, but the inheritance argument for
this asset is "the claims are the article's" and on that surface the reader is never shown it.

**The reviewer's own two factual claims were checked rather than accepted.** Its publish-date finding
was **wrong**: `blog_articles.published_at` is 2026-07-15, which is what the posts cite; the MDX
frontmatter `date: '2026-06-24'` is the display date and the two genuinely disagree, which is a
separate small oddity worth a sweep. Its scanner finding was **right**: `compliance-tables.js`
matches `fix|fixed|fixes|fixing` and **not `fixable`**, verified by direct test, so a fix-family word
walked through both scans. That table is shared with gate G5, so the commit gate has the same gap.

⚠️ **LinkedIn is running at half its documented cadence, and no invariant can see it.**
`unified-content-calendar.md` gives LinkedIn **two** slots (Mon and Thu) and Facebook **one** (Tue),
confirmed by Keith 2026-07-09 and restated in the Lane 1 definition. Weeks 34 and 35 both have their
Thursday filled and **Monday empty**. I10 asks whether a channel has anything queued in the next
seven days, so one post satisfies it: **a channel filling one of its two slots passes green.**
Separately, the same section's "realistic per-channel weekly volume" line says Facebook ~2-3, which
contradicts its own table; the table and the Lane 1 definition agree on one, and that is treated as
operative. ~~**Reconciling those two lines is owed.**~~

✅ **CLOSED 2026-08-17, and it needed two passes rather than one.** The 2026-08-16 pass reconciled
the calendar's two lines in favour of **one**, and left `written-post-playbook.md` still saying "about
2 to 3 per week", so the contradiction survived in a second file and the next run hit it again.
**Keith then ruled the other way: Facebook is 2 a week, Tuesday and Thursday.** All three stores moved
together this time: the calendar table, its volume line and its Lane 1 definition; the playbook's
cadence sentence, now pointing at the calendar instead of carrying its own figure; and
`content_channels.weekly_slots` for `facebook/link-post`, 1 → 2, which is what `content-doctor` I10
reads. **The LinkedIn half of this warning still stands unchanged**: I10 still passes a channel that
fills one of its two slots, and Facebook now has the same exposure on two slots that LinkedIn has.

## `the-stack`: the copy was never owed. It had existed for five weeks. (2026-08-16)

**The last written work outstanding on this board turned out to be already written.** `the-stack`'s
LinkedIn and Facebook posts were drafted in the same dry run as its video script on 2026-07-09
(`dry-runs/2026-07-09-pillar-B-why-am-i-always-tired.md` §4c and §4d) and cleared the compliance
route there. **Nothing joined them to anything**, so both renditions sat at `to-produce` with an
empty `body`, and the board reported them as the only genuine writing owed. The asset file's own
Notes said where the copy was, in one sentence, since 2026-07-13.

**Neither post was re-drafted.** They were moved, and the character counts came across intact.

🔴 **The move exposed an unswept decision, and it is the second half of one already made.** The
Facebook post routed to a kit. `content-funnel-map.md` allows TOFU "at most the free quiz. **Never a
kit**", and **this exact conflict was found and corrected on this asset on 2026-07-31** — the v2
script rewrite records the funnel block carrying `cta: kit-2` "which `content-funnel-map.md` forbids
outright". That correction reached the frontmatter and the video script and **stopped there**: the
database row still said `kit-2` and the Facebook copy still carried the kit link, five weeks later.
Both are now `quiz`, routing to `test-selector` like `put-it-down-to-age`. **A decision implemented
in one place and not swept is the exact failure the sweep rule exists for**, and this one was
sitting inside the file that describes it.

**A second correction, smaller:** the LinkedIn post gained a first comment linking the hub. The dry
run left it optional; every LinkedIn post published since carries one.

**Pre-flight re-run rather than inherited**, because the CTA changed: 0 HARD, 0 REVIEW on both
scanners, judgement pass clean, `preflight_date` moved to 2026-08-16. A July green against July rules
does not transfer, which is the rule this asset's own file states at the top of its script section.

**`bridge-post-body.ts` could not have done this before today.** It took the FIRST `POST` line in a
file and no platform, so on an asset carrying two written posts it would have bridged the LinkedIn
copy into the Facebook rendition **and reported success**, because both surfaces genuinely have a
body afterwards. `the-stack` is the first asset with two, so the defect had never fired. `POST` lines
may now be qualified (`POST linkedin`), the first comment is scoped to its own section rather than
found file-wide, and asking for a platform a file does not carry is a refusal that names what it
does hold.

**Facebook is scheduled: Mon 2026-08-25 11:00 London, id `362764505`, `draft: true`**, verified
against Metricool's own answer including the corrected CTA in the shipped text. It also carries the
canonical article's photo, which the scheduler attaches on Facebook only.

✅ **LinkedIn scheduled too, on Keith's call: Thu 2026-08-27 11:00 London, id `362765721`,
`draft: true`.** Verified against the calendar: two posts in the 25 to 28 Aug window, no collision,
the LinkedIn one carrying its first comment and no media, the Facebook one carrying the article photo
and none. That split is correct and deliberate — the scheduler attaches an image on Facebook only.

**Both need arming, and arming will change both ids.** See the arming section below; re-map by slot
afterwards rather than trusting the ids recorded here.

**That clears the last written work owed on this board.** What remains on `the-stack` is the
2026-08-03 shoot: `instagram/reel`, `tiktok/short` and `youtube/short` are still `to-produce` with no
body, and the scheduler refuses two of them for having no Metricool network mapping and the third for
having no copy. **Those are a filming dependency, not a writing one.**

## The chain from script to scheduled now has a runbook and its missing tool (2026-08-16)

**`sops/sop-script-to-scheduled.md`** is the hand-off runbook for both paths, single-asset and the X
weekly batch, with the five places the chain has broken quietly written out and a
check-before-you-call-it-done list at the end. Written because two separate steps of it failed
silently in one evening.

**`register-x-batch.ts` closes the last hand-hole in the X lane.** A week of X is one draft holding
seven posts, so there is no per-post asset file for `bridge-post-body.ts` to read, and nothing else
ever could: week 2 was registered by a throwaway script written for that one run. It parses the copy
out of the blockquotes rather than re-keying it, and **refuses** an over-280 post, a claimed
character count that disagrees with the copy, a section with no `slug:` or `slot:`, an empty
blockquote, a duplicate slug, or a batch that is not pre-flight green.

**Two defects were found by its own tests before it ever ran for real**, which is the argument for
writing them:

- **A literal `approved_by: null` parses as the truthy string `"null"`**, so an unapproved batch
  would have registered as `approved` and pushed `"null"` into a date column. Caught by the first
  test written.
- **A re-run would have walked live state backwards**, resetting `status` from `scheduled` to
  `to-produce` on posts already live in Metricool. It now reads before it writes and reports those
  as LEFT ALONE, naming the id. **Registering is not the same as owning.**

**And one hole the tests found in the parser itself:** a section with copy but no `slug:` produced no
post at all, so a batch of seven with one broken section would have registered six and said nothing
about the seventh. **Six of seven looks exactly like success.** Now reported by section and line.

🔴 **A fourth defect surfaced at wrap, from `npm test`, and it was a runtime crash rather than a type
nit.** All three of `main()`'s early-return paths built a result literal by hand and omitted the
`skipped` bucket added later, and `render()` iterates it. **Those are the refusal paths** — bad
draft, canonical article missing, canonical article unpublished — so the tool would have thrown a
TypeError instead of printing the refusal, on exactly the paths whose only job is to say what is
wrong. Every test passed a complete literal, so none of them touched it; `typecheck:scripts` caught
it. Fixed, `render` made tolerant of an absent bucket, and a regression case added that asserts the
tolerance rather than the literal.

**22 tests, wired into `npm run test:engine`** rather than left as a file that exists. `slot: by-hand`
is the mechanism that turns the plan's prose rule ("threads are posted by hand") into something the
scheduler enforces: it registers `publisher='manual'`, and `metricool-schedule` refuses that by name.

## 🔴 Arming a draft in Metricool REPLACES the post and its id. Seven of ours died within six minutes. (2026-08-16)

**Measured, not inferred from a symptom.** `metricool-schedule` created six X drafts at 18:05 with ids
`362751262`, `362751264`, `362751266`, `362751267`, `362751268`, `362751270`. Keith armed them in the
Metricool UI between 18:10 and 18:11. **All six ids now return 404.** In their place sit six posts with
byte-identical copy in the identical slots, created at 18:10 and 18:11, `draft=false`: `362752346`,
`362752586`, `362752384`, `362752447`, `362752469`, `362752531`. The Facebook post armed in the same
sitting did the same thing: `362736891` is gone, `362753213` holds its slot.

**Nothing warned us, and nothing could have.** The database still held the dead ids and read as
perfectly consistent with itself. I3 asks whether an id still resolves and would have gone red on the
nightly run; `metricool-metrics` would have joined analytics on seven ids that no longer exist; the
writeback would have failed against them. **Every one of those breaks in the same instant and none of
them says why.**

**This is why the ids in the sections below changed.** They were correct when written and dead six
minutes later. Re-mapped by SLOT, which is the only key that survived, and I3 is green again.

**It has never been seen before because a post that is created live and never drafted keeps its id.**
Week 1's six were hand-loaded already-live on 2026-07-31 and their ids have been stable ever since.
The shared scheduler creates drafts by standing decision, so **every post it makes from now on will go
through exactly this transition.** The durable rule is now in `CONTEXT.md`: after any arming session,
re-read the calendar and re-map by slot before trusting a joined number.

**The reverse-direction check is the only thing that can see it.** Walking our ids outward tells you
they are dead; it never tells you what replaced them. That is the same gap recorded in the
reconciliation section below, now with a second and much sharper example.

## Both Metricool calendars read end to end and diffed against the database (2026-08-16)

**Nothing is double-scheduled.** 43 posts across both brands over 2026-07-01 to 2026-12-31, and
**every one of the 43 matches a rendition by id**: no post on either calendar that the database has
never heard of, no Metricool id claimed by two renditions, no two posts sharing one slot on one
network. The only two ids the database holds that the calendar does not return are the two Unipile
LinkedIn posts, which is correct, because they never went through Metricool.

**This was measured in the direction nothing else measures.** I3 and I12 both start from an id we
already hold and ask Metricool about it, so **neither can see a post that exists in Metricool and not
in our database** — which is the direction a duplicate actually arrives from. The check was a
throwaway script run once against the list endpoint for both brands, and it is NOT wired into
anything. Until it is, "no orphans" is a fact about 2026-08-16, not a standing guarantee.

✅ **RESOLVED the same day, on Keith's instruction: the post was DELETED from Metricool.**
`362735277` is gone (`DELETE` returned 200, and a follow-up `GET` returns 404, so this is verified
rather than assumed). It was still `draft: true` and had never published, so nothing live changed.
**The rendition is back at `to-produce`** with `external_post_id`, `external_url`, `scheduled_for`
and `body` all cleared. **`publisher` is now `manual`, and that is the load-bearing part:**
`metricool-schedule.ts` REFUSES any rendition whose publisher is not `metricool`, so the plan's
"produce threads by hand" rule now exists as a field the pipeline reads instead of a sentence in a
doc no automated step opens. **This re-reds `x/text-post` on I10**, correctly: the X lane has had
nothing queued since 2026-08-08 and the deleted post was the only thing hiding that.

**The X lane went dark, and that was the actual gap.** Week 1 was batched on 2026-07-31 for
2026-08-03 to 09; six posts went out Mon to Sat, then nothing for eight days. **No week-2 batch had
ever been drafted**, and the placeholder was the only thing keeping I10 from saying so.

✅ **Week 2 is now drafted: `drafts/x-week-2026-08-17.md`, seven posts for 17 to 23 August.**
Queue row X-02, source `low-vitamin-d-symptoms`, taken as the queue assigned it rather than
re-picked, because the row carries the `[W]` wellness marker and swapping it would have quietly moved
the ~40% wellness ratio. **Angle is the August peak, not the winter trough:** a reading taken now says
which end of the annual swing a man starts the dark half of the year from, which is the same framing
already cleared and published on Facebook in `put-it-down-to-age`.

**Pre-flight clean, and the number that means anything is the payload one.** Scanned whole, the
fragment checker reports 21 HARD, every one a date, a character count, a CA number or the Metricool
blogId read as an unsourced medical figure. Scanned as the thirteen blockquoted posts alone: **0 HARD,
0 REVIEW on both scanners.** **It found two genuine qualifier drops and both were corrected**: "adequate"
where the article says "adequate for most", and "a snapshot" where it says "a snapshot, not a verdict".
Those are qualifiers shed under compression, which is the whole reason that check exists.

**Character counts were measured, not asserted.** All thirteen are inside the 280 ceiling; the first
draft had thread post 7 at 286 and every claimed count wrong, because they had been estimated by eye.

✅ **SCHEDULED the same day on Keith's instruction. Six posts, Mon to Sat, all six verified against
Metricool's own calendar** rather than inferred from the send returning an id: slot, copy and draft
flag were re-read afterwards.

| Day | Time (London) | Post | Metricool id (post-arming) | id at creation, now dead |
| --- | --- | --- | --- | --- |
| Mon 17 Aug | 08:10 | marker fact | 362752346 | ~~362751264~~ |
| Tue 18 Aug | 12:20 | normal vs optimal | 362752586 | ~~362751266~~ |
| Wed 19 Aug | 07:50 | founder line | 362752384 | ~~362751267~~ |
| Thu 20 Aug | 12:35 | link-out | 362752447 | ~~362751268~~ |
| Fri 21 Aug | 08:25 | myth correction | 362752469 | ~~362751270~~ |
| Sat 22 Aug | 12:40 | open question | 362752531 | ~~362751262~~ |

✅ **ARMED by Keith the same evening, all six `draft=false, autoPublish=true`.** They will send
themselves. `metricool-schedule.ts` creates drafts by standing decision (plan §7.1, Keith
2026-07-31), so arming is always a human step; **week 1 needed none because its six were hand-loaded
already live**, which is also why week 1's ids never moved.

🔴 **Arming changed all six ids.** See the topmost section: the id column above was correct when
written and dead six minutes later. The right-hand column is kept rather than deleted, because the
dead ids appear in the run logs and in `drafts/x-week-2026-08-17.md`, and a reader finding a 404
needs to know it is expected rather than evidence of a lost post.

**Seven renditions registered, copy parsed out of the draft rather than re-typed.** The registration
script read each body and the Thursday reply link from the file's blockquotes, and the parsed
character counts came back identical to the measured ones, which is what proves the parse matched.
The Sunday thread is registered at `publisher='manual'`, so the shared scheduler now refuses it by
name on every run instead of a reader having to remember the by-hand rule. **`x/text-post` is off I10
again, this time on real copy.**

⚠️ **One item was flagged before scheduling and is still open, because it is a register question
rather than a copy one.** Wednesday's founder line opens with the LinkedIn headline approved under
**CA-029, which names three surfaces and does not name X.** Week 1's founder post rested on claim
identity with approved copy rather than on the approval's scope, and its file recorded that extending
the register to name X was "worth doing at the next register update". **That has not happened, so the
same gap is now load-bearing for a second week and is scheduled copy rather than draft copy.**
Extending CA-029 to name X closes it properly.

🔴 **What it was, kept because the failure is the useful part.**
**`x-w01-7-thread-where-the-range-comes-from` was scheduled carrying a PLACEHOLDER, for the next day.**
Metricool `362735277`, 2026-08-17 11:45. `content_renditions.body` holds an internal note — _"7-unit
thread. Full copy in content-machine/drafts/x-week-2026-08-03.md."_ followed by seven one-line
summaries — and `bridge-post-body.ts` carried exactly that to Metricool, faithfully. **The draft file
itself says the slot should never have been scheduled:** _"Post by hand. Metricool will not split X
copy into a thread, so this one is manual until that is tested"_ (`drafts/x-week-2026-08-03.md`).
It is `draft: true` so it cannot send itself, and the standing rule means a human has to arm it. The
exposure is that the database says `scheduled` and the board reads it as ready, so the obvious next
action is the wrong one. **Keith's call: unslot it, or write real single-post copy for the slot.**

**The gate that should have caught it does not exist.** The post is pre-flight green, `approved`, has
a non-empty body and a real Metricool id, so every invariant we run passes. **No check asks whether a
body is copy or a note about copy**, and length cannot answer it: this one is 407 characters, a
perfectly ordinary post length. The tell is machine-readable — a body naming a repo path, or leading
with a unit count rather than the post's first line — but nothing looks for it.

⚠️ **Every carousel caption ships three times, and that is the generator working as written.** The
30-day run is 10 topics × 3 appearances; `schedule.js` sets `text: cap.caption` from one caption per
slug, so the three appearances of a topic are **byte-identical in caption and first comment**. Only
the close slide (A/B/C) and the cover format (video or type) rotate. The first repeat lands
**2026-08-27**. Not drift and not a defect: the generator asserts the rotation as an invariant. But it
is the same copy three times in thirty days on one Instagram account, and **whether that is the
creative test intended is Keith's call, not the generator's.**

**Arming, measured the same pass: 1 of 32.** Only carousel day 1 (2026-08-17 13:00) is armed. The
X thread and `nothing-to-buy-for-it` are `draft=true, autoPublish=true`; the 29 remaining carousels
are `draft=true, autoPublish=false`. I12 already reports the four inside its 72h horizon.

## Unipile is OUT of the plan. Metricool is the posting route for every lane. (2026-08-16)

**Keith's call, and it answers the publisher question this file has carried open since 2026-07-31.**
Unipile was a test, not a decision: it was what was wired when the first two posts had to go out.
Metricool was chosen afterwards and is what the machine actually publishes through. **Nothing new is
posted via Unipile, on any platform.**

**Live counts, re-read from the database rather than carried forward:** **18 published articles, 9
planned channels, 38 content assets, 74 renditions, 21 thumbnails owed; grid 162 slots, 27 filled,
backlog 135.** Unchanged by this decision, and that is the point: `publisher` is not `in_plan`, so
switching a route moves no denominator.

**`content_channels.linkedin/text-post` now reads `metricool`.** It was the last row still declaring
`unipile`; the other nine channels already pointed at Metricool, which is why the drift note on that
one row read as an anomaly rather than a policy. The row's note carries the decision and its date.

**The history stays, and deleting it would be the mistake.** `instrumentation-problem` and
`four-worth-seeing` really did ship through Unipile on 2026-07-28, and their renditions still say
`publisher: unipile`. That is not stale data, it is the reason those two posts carry an **activity**
urn and cannot be joined to Metricool analytics at all (`metricool-metrics.ts`, the join refusal).
The `content_renditions.unipile_account` column, the `unipile_account` entry in
`db-owned-keys.json`, and the doctor and scanner tests that name it all exist to describe those two
rows. **Do not tidy them away on the strength of this decision:** the column is the only record of
how two live posts were published, and I2/I9 would start reporting a fact with nowhere left to live.

**`looking-for-a-word` is unblocked on route.** The publishing ambiguity was the stated reason it sat
ready and unslotted. It has no `scheduled_for` yet, because slotting it is a separate call from
routing it.

⚠️ **Open, and NOT decided here: the read-only uses of Unipile.** Three skills
(`linkedin-post-search`, `linkedin-deep-analysis`, `weekly-profile-analysis`) read the LinkedIn
profile through Unipile and publish nothing. "We are not posting through it" does not by itself
settle whether the connection stays for reading, so they are left wired and flagged rather than
retired. **The Instagram side needs no ruling:** `keith.antony.tech`, the handle Unipile held, was
already superseded by the 2026-08-09/10 restructure in `../content/social-channel-setup.md`, and the
`instagram/reel` channel note was corrected to the company account on 2026-08-16.

## 🔴 29 OF THE 30 CAROUSEL POSTS ARE NOT ARMED, and nothing could see it (2026-08-16)

**Live counts, re-read from the database rather than carried forward** (this section is the topmost
dated one, so invariant I7 reads its counts and a section without them blinds the check): **18
published articles, 9 planned channels, 38 content assets, 74 renditions, 21 thumbnails owed; grid
162 slots, 27 filled, backlog 135.** The doctor is now **10 of 12 PASS** — I12 is new — and the two
FAILs are I10 (the pre-existing Substack coverage red, now joined by `x/text-post`) and I12 itself.

**Found the evening before the run starts.** Day 1 (`361489869`, 2026-08-17 13:00) is armed:
`draft: false, autoPublish: true`. **Days 2 to 30 all carry `draft: true, autoPublish: false`** and
would have sat in the calendar looking scheduled and never gone out.

**This is the design, not a bug.** `schedule.js` sets `LIVE_DAYS = [1]` deliberately: the standing
rule (Keith, 2026-07-31) is that the pipeline creates drafts and a human flips them, and day 1 is a
canary because the publish path had never been exercised — the 2026-08-10 test proved Metricool
*accepts* a carousel, not that Instagram *publishes* one. The 2026-08-13 entry ends **"Flip the rest
once day 1 lands."**

🔴 **What was missing is any mechanism that the flip is owed.** `content_renditions.status` said
`scheduled` for all thirty, the doctor passed 9 of 11, and the STATE docs said Phase 1 was done.
**Every local check agreed, because they were all reading the same column** — one written by the job
that CREATED the posts. It recorded that we had sent them. It was read as meaning Metricool would
send them.

**The action is Keith's** and has not been taken here: flipping 29 posts onto a live Instagram
account is not an agent's call. **Day 2 publishes 2026-08-18 13:00**, so the flip is owed within
roughly a day of the canary landing.

### I12 now measures it, and it cost no extra network calls

**`content-doctor` gained I12: every rendition we call `scheduled` must actually be armed.** It
reads `draft` and `autoPublish` off the SAME per-post fetch I3 already makes, so the invariant added
no round trips.

**A 72-hour horizon is what stops it being permanently red.** Under the standing draft rule, an
unarmed post three weeks out is the system working; an unarmed post whose slot is imminent is a
fault. So beyond 72h it is a NOTE, inside 72h a VIOLATION. 72 rather than 24 because the doctor gets
three nightly chances to say so before a slot is missed, and one skipped run cannot swallow the only
warning. **Unreadable flags are UNCHECKED, never a pass**, so a change to Metricool's response shape
cannot quietly turn the check green. First live run: **1 armed of 30, one violation (day 2, 59.6h
out), 28 notes.**

### Re-hosting measured, and step 3.6's step 3 is still open

**Metricool DOES re-host, and it happens at schedule time, not draft time.** All 240 media
references on the run resolve to `static.metricool.com`, so the claim that both 1.1's rollback safety
and 3.4's storage migration rest on is now measured rather than inherited. **A throwaway draft
created for the test was NOT re-hosted** — its media array still pointed at our Supabase URL — which
is why the deletion half of the experiment could not run: there was no CDN copy to outlive the post.
The draft was created and deleted cleanly on blogId 6633045, nothing left behind.

⚠️ **Step 3 of the takedown path remains UNVERIFIED**, and now with a sharper question: does the CDN
copy of a *scheduled* post survive that post's deletion? Answering it needs a post that reached
scheduled state, which a throwaway cannot without being armed. **The procedure's assumption that the
copy persists still stands, and it is still the safe direction to be wrong in.**

✅ **RESOLVED the same day, and the docs were right.** An earlier version of this entry flagged an
inconsistency: the docs say the run is on `6693691` (`Keith Antony AI`) while every re-hosted media
filename is prefixed **`6633045`**. **Both are true and there is no contradiction** — the filename
prefix is the media library, not the posting brand. Settled by listing each brand's own scheduler for
the run window: **`6693691` returns all thirty carousels, `6633045` returns zero.**

**Keith's model, recorded 2026-08-16 so it is not re-derived:** Metricool permits **one Instagram
account per brand**, and we have two Instagram accounts, so we have two brands. **`Keith Antony AI`
(`6693691`, `keith.antony.ai`) carries the CAROUSELS; `Keith Andro Prime` (`6633045`,
`keithandroprime`) is the company account and carries the REELS.** The brand split is forced by the
platform limit rather than chosen. Durable version, with the full table, in
[`06_marketing/content/social-channel-setup.md`](../content/social-channel-setup.md).

🔴 **The reusable trap:** `GET /scheduler/posts/{id}` is **not brand-scoped** and answers under either
brand, so it cannot tell you who owns a post. Only the brand-scoped **list** endpoint can. A media
filename carrying the other brand's id is the shape of a real defect and is not one.

🔴 **A SECOND, independent blocker on plan step 1.3, found by writing the rule down.**
`metricool-schedule.ts` takes its brand from `METRICOOL_BLOG_ID`, one value, so **the shared
scheduler can only ever post to the company/reels brand.** That is correct for the reel lane it will
serve, and it means the shared scheduler **structurally cannot reach the carousel brand at all**.
Step 1.3 ("retire `schedule.js` into `metricool-schedule.ts`") was already deferred because the
shared scheduler cannot build an eight-media payload until `content_media` exists in Phase 6.2; it is
now also blocked on being single-brand. ~~**Retiring the carousel generator needs a brand per rendition,
not just media per rendition** — which is a schema question nobody has asked, because until today the
two-brand structure was recorded as a fact about accounts rather than as a constraint on scheduling.~~

✅ **CORRECTED 2026-08-17. The schema question was asked and answered LATER THE SAME DAY, by step
6.1 in this file's own next section, and this line was never updated.** The blocker is real; its
description was wrong on both halves.

**It is not per rendition, it is per channel.** `content_channels.publisher_brand` carries the
blogId, seeded by `20260816_content_channels_capability_spec.sql`: `instagram/carousel` →
`6693691`, every other Metricool lane → `6633045`, null for `linkedin/text-post` and
`substack/newsletter` because neither publishes through Metricool. Brand is fully determined by
`(platform, format)`, which is the same evidence that moved `thumb_spec` onto the channel row in the
same migration. A rendition-level column would have modelled a channel fact.

**What remains is code, and it is narrow.** `creds()` resolves `METRICOOL_BLOG_ID` once at process
start and `metricoolCreator()` bakes it into the query string when the closure is built, so **brand
is a process-level constant decided before any rendition is read**. It has to become a per-call
argument taken from the rendition's channel row, refusing rather than defaulting where
`publisher_brand` is null. **`metricool-metrics.ts` already does exactly this** — `METRICOOL_BLOG_IDS`
(plural), `blogId` passed per call, one token and userId across both brands — so the multi-brand
pattern is proved in this codebase and the credentials are known to reach both. Metrics can ITERATE
because reading is undirected; scheduling has to ROUTE, so it needs the lookup rather than the loop.
The eight-media payload is the larger half of 1.3.

🔴 **Getting the brand wrong would not fail, which is why this needs the row read rather than a second
env var.** Per the trap two paragraphs above, `GET /scheduler/posts/{id}` answers under either brand,
so a post created against the wrong account verifies clean. **6.1 already hit the mirror image of
this**: two channel rows named the wrong account and nothing had ever failed, because the code
ignored the row and addressed `METRICOOL_BLOG_ID`. Correcting the rows without correcting the read
inverts the defect rather than clearing it.

⚠️ **The doc failure is the reusable part.** This entry and the 6.1 entry are in the same file, from
the same day, and disagree; the migration comment in `20260816_content_media.sql` states it
correctly ("Step 6.1 put `publisher_brand` on the channel row; the scheduler still has to read it")
and was the only store that did. **A blocker written down before the work that resolves it lands the
same day is invisible to whoever fixes it**, and a stale "nobody has asked" reads as a reason to
scope new schema work.

### Three assets approved, two posts scheduled, and the file-to-column seam closed (2026-08-16, close-out)

**Keith approved three assets** (`looking-for-a-word`, `nothing-to-buy-for-it`, `the-stack`), dated
2026-08-16, `approved_by = 'Keith'`. All pre-flight green, canonical articles published, Ewa signed
on the two carrying tasks. **`x-w01-7-thread-where-the-range-comes-from` was already `approved`** and
needed nothing; its `approved_at` and `approved_by` are **null**, an incomplete record left untouched
rather than backfilled with an invented date.

**Two posts scheduled through the shared scheduler**, both created as DRAFTS per the standing rule:

| Post | Channel | Slot | Metricool id |
| --- | --- | --- | --- |
| `x-w01-7-thread-where-the-range-comes-from` | x/text-post | 2026-08-17 11:45 | `362735277` |
| `nothing-to-buy-for-it` | facebook/link-post | 2026-08-18 11:00 | `362736891` |

~~**This cleared `x/text-post` off I10**; only `substack/newsletter` remains red there.~~
**SUPERSEDED the same day:** the X post was a placeholder and was deleted on Keith's instruction (see
the topmost section), so `x/text-post` is red on I10 again. It was never really cleared — **a lane
was counted as covered by a post that could not have shipped**, which is the more useful reading of
what that green meant. Slots follow the
calendar's Mon/Thu LinkedIn, Tue Facebook rhythm. **The two Facebook slots were swapped** so the
post that was ready took this Tuesday and `the-stack` moved to 2026-08-25.

🔴 **THE SEAM: `/script` writes the post into the asset FILE and the scheduler reads
`content_renditions.body`, and nothing joined them.** So a post could be written, pre-flighted green
and approved, and still be refused at scheduling for having no copy, with the copy sitting in git the
whole time. Two of the four owed posts were in exactly that state, and the empty column read
convincingly as "not written yet" — it was reported as a blocker, then retracted, then confirmed by
the scheduler's own refusal message ("never guessed from the asset markdown"). **`bridge-post-body.ts`
closes it**, extracting the signed-off bytes from the blockquote rather than re-keying them, because
re-typing pre-flighted copy is how a cleared claim quietly stops being one.

⚠️ **`the-stack` has no written post at all.** Its `## Script` is a VIDEO script, which is why it also
carries reel/short/tiktok renditions. Its LinkedIn and Facebook renditions need real `/script`
drafting against the `why-am-i-always-tired` hub. **This is the only genuine writing owed.**

⚠️ **`looking-for-a-word` is ready and deliberately unslotted.** LinkedIn text-posts have shipped
**3 via Metricool and 2 via Unipile** while `content_channels.linkedin/text-post` says `unipile`. The
publishing route is genuinely ambiguous and was not guessed; no `scheduled_for` means the scheduler
safely skips it. **Keith's call.** — **ANSWERED the same day: Metricool. See the Unipile section
above; the route is no longer what blocks this post.**

**Scanner clean at 27 of 27.** `put-it-down-to-age`'s craft note said an article photo is used
"rather than re-treated", matching on "treated" inside a note about images: apparatus, not payload.

### The board was read on screen, and it found its own first defect (2026-08-16, later)

**Keith opened the live page and it worked**, which closes the "not visually verified" gap on 7.1.
The layout, the seven panels and every arithmetic total reconcile: lanes sum to their kinds
(18 + 30 + 21 + 5 = 74), moved sums to 47, and 74 − 47 is the 27 rows that never moved.

🔴 **Panel 01's largest number was a bookkeeping artefact, and that is the worst place for one.**
"51 renditions missing required media" was 30 carousels + 21 shot. The 21 are true. **The 30 were
false**: those posts carry eight media each, already re-hosted by Metricool and ready to publish.
What they lacked was a row in `content_media`, because step 6.2 left the table empty on purpose. The
board was reporting *our records are incomplete* as *these posts have no media*. **A board whose
biggest number is noise teaches you to skim it**, and panel 01 is the one that must never be skimmed.

**`backfill-carousel-media.ts` fixes the records rather than the label.** Its sources are the two
that already know the answer: `schedule.js --json`, the generator that actually produced the thirty
posts, for each post's slug, variant and ORDERED media names; and `media-manifest.json` for each
name's published URL, sha256 and byte count. Nothing is inferred. **110 media rows and 240 links
(30 x 8), and 110 is exactly the object count invariant I11 already checks in the bucket.** It
refuses to write if any post is not eight media or any name is absent from the manifest, and a second
run moved neither count.

**Panel 01 now reads 21, all genuinely owed to a filming day.** Two label fixes shipped alongside:
the stalled-lane message counted five lanes when only four hold work (`linkedin/short` is empty), and
the channel table rendered "video 1-1" where a range whose min equals its max is just a number.

🔴 **THEN THE ONE-LANE FIX MADE THE PAGE CONTRADICT ITSELF, and that is the lesson.** "One blocked
input, not N problems" existed in TWO places with N derived independently in each. Correcting the
data layer's copy alone left the page reading "not 4 problems" and "not 5 separate problems" about
the same group, three lines apart. **Consistently wrong is survivable; visibly self-contradictory
discredits every other number on the page.** No test could have caught it, because each call site was
correct about its own arithmetic. `lanesWithWork` is now computed once on `KindGroup` and read by
both. The remedy for a duplicated fact is never to update the other copy.

**Panel 06 was two honest numbers that lied side by side.** It showed "162 coverage slots" beside
"74 rendition rows", inviting the reading 46%. **True coverage is 27 of 162, about 17%**: a cell is a
(published article, in-plan channel) pair, several rows can share one, and rows on a channel that is
not in plan fill none, which is all thirty carousels. The panel now splits Coverage (slots, filled,
backlog, percentage) from Health (total rows, rows never moved, routes proven), and **`gridFilled`
and `thumbsOwed` are defined exactly as `content-doctor` I7 defines them** rather than recomputed.
Board and doctor now return identical numbers: 162 / 27 / 135 / 21.

### The `in_plan` flip is PREPARED and deliberately refuses to run today

**`flip-carousel-in-plan.ts`.** Flipping is wanted: the carousel is `lane-1`, so `in_plan = true`
brings it under I10 and an empty carousel week becomes a reported failure instead of an invisible
one. It takes the grid from **162 to 180 slots**, moving every coverage percentage at once.

🔴 **It REFUSES while `route_verified_at` is null, and that is the whole point.** As of 2026-08-16
the route has thirty posts scheduled, eight media each, and has never published once. **`in_plan`
means "a lane we cover systematically"; committing the denominator to an unproven route is treating
"connected" as evidence, which is the exact error `route_verified_at` exists to catch.** Day 1
(2026-08-17 13:00 London) answers it. If Instagram rejects the carousel the lane is not viable and
the denominator must not have moved for it. A `--force-unproven` escape exists and demands a written
reason.

**The doc cost is one line, not a sweep**, measured rather than assumed: I7 asserts only on the
newest dated section, so flipping breaks the topmost counts in this file and nothing else. The script
prints the follow-up sequence.

### Phase 7: `/ops/content` is BUILT and read-only (7.1), and its kill list is ruled (7.2)

**D4 is ruled YES** (Keith, 2026-08-16): build it as a route in the app.
`app/ops/content/page.tsx` + `lib/ops/getContentBoard.ts`, behind the same `getCurrentUser` +
`isAdmin` gate as `/admin/dashboard`, `force-dynamic`, noindex. **Seven panels:** what needs you,
every lane by production kind, channels, media, approvals, health, and **effect**.

**Read-only on purpose.** A wrong number stays a wrong number rather than becoming a wrong action.
The write actions are 7.3 and are NOT built.

**All four of the plan's requirements are demonstrated against live data, not asserted:**

| Requirement | What the live board shows |
| --- | --- |
| List every lane, including empty ones | `linkedin/short` appears with 0 rows. The board is driven by the CHANNEL table, so a lane with no rows can still report itself. |
| Group by production kind, not platform | **"Shot on camera: 21 renditions, 0 moved, STALLED"** across **five** lanes. One blocked input (a filming day), not five platform backlogs. |
| Separate coverage from health | 74 rows exist; **27 have never moved**. Every store agrees perfectly about all 27. |
| Surface unregistered work as failure | Anomaly checks for published-without-URL, scheduled-without-id, unknown format, unregistered channel, orphan asset. Currently **none**. |

**Other live readings:** 1 pre-flight RED, 1 awaiting Ewa, **4 of 10 routes proven**, 51 renditions
owing media their channel requires (correct: `content_media` is empty by design), and the effect
panel showing variants A/B/C at 10 posts each with **zero saves captured**, which is the honest
state before day 1 publishes.

🔴 **An unread table is never reported as an empty one.** The first standalone run failed to read all
seven tables and the board said so, rather than rendering zeros. That path proved itself by accident
and it is the single most dangerous thing an ops board can get wrong.

**7.2, ruled by Keith 2026-08-16. What dies:** `review.html`, the social dashboard, and
`/content-status`. **What survives:** `content-doctor`, because it is the nightly unattended alarm
and a board nobody opens cannot alarm; and **ClickUp untouched**, because it is where a human who is
not Keith takes part.

⚠️ **`/content-status` cannot actually be switched off yet.** It carries gate-checked state
transitions, and the route is read-only until 7.3. **The list is ruled; only the first two are
retirable today.** Retiring the third before 7.3 would remove the only way to move a rendition.

**`lib/supabase/types.ts` regenerated** (1,905 lines, via the CLI against the session pooler, since
no `SUPABASE_ACCESS_TOKEN` exists). This was blocking: the typed client did not know the Phase 6
tables. `npm test` exits 0, app typecheck 0 errors, `next build` compiles and registers
`/ops/content` as a dynamic route. Previous file kept at `types.ts.bak-2026-08-16`.

⚠️ **NOT visually verified.** The page is behind admin auth, so a headless render redirects to login
rather than showing the board. Its DATA is verified by running `getContentBoard()` against live
Postgres and reading every panel's numbers; its BUILD is verified by `next build`. **What has not
happened is a human looking at the rendered page**, which is the standing rule for UI, and it is owed
before this replaces anything.

### Phase 6 is two-thirds built: 6.1 and 6.2 are APPLIED, 6.3 is not

**Phase 5 was skipped deliberately** (Keith, 2026-08-16): it needs D2, the claim-ledger model, which
needs Ewa, and no approval route to her is available right now. Phase 6 needs no ruling at all, and
**6.2 is the blocker on plan step 1.3**, outstanding since Phase 1.

**6.1 — `content_channels` is now a spec.** The row carries `media_kind`, `media_min`/`media_max`,
`media_aspect`, `thumb_spec`, `body_max_chars`, `supports_first_comment`, `requires_human_publish`,
`publisher_brand`, `route_verified_at` / `route_verified_evidence`. Migration
`20260816_content_channels_capability_spec.sql`.

🔴 **Two channel rows had the WRONG ACCOUNT, both predating the 2026-08-09/10 two-brand
restructure**, found by writing Keith's two-brand rule down and checking it. `instagram/reel` said
`keith.antony.ai` — the carousel account — and now says `keithandroprime`. `facebook/link-post` named
the **personal** page while its own note described the company page; it now names
`1292054467322962` (Keith's ruling, 2026-08-16). **Corrected against Metricool's own
`getBrandSettings`, not against a document.** Neither had shipped anything to the wrong place,
because the shared scheduler addresses `METRICOOL_BLOG_ID` regardless of the row: **the code was
right and the row was wrong**, which is the harder direction to notice because nothing fails.

**`thumb_spec` was lifted from the renditions rather than retyped**, so the two could not disagree at
the moment of the move. Across all 74 renditions its value is perfectly determined by
`(platform, format)`, which is the evidence it was a channel fact all along.

🔴 **Only 4 of 10 routes have ever carried a real post**, computed from renditions that actually
reached `published` with a URL. The plan asserted six unproven; that is now a measured column rather
than a claim in a notes field.

**6.2 — `content_media` + `content_rendition_media` exist.** Migration `20260816_content_media.sql`.
Media is keyed to the **asset**, joined **many-to-many** to renditions with a `role` (`body|thumb`)
and a `position`. That is what lets one 9:16 export be LINKED to the Reel, the Short, the TikTok and
the LinkedIn short instead of copied into each, and what makes a cover an ordinary file with a role
rather than a column plus a bespoke gate branch.

**Four guardrails, each proved by making it fail** inside a rolled-back transaction: cross-asset
linking, two files in one carousel slot, deleting a file still in use, and registering a URI twice.
Seven checks, seven passes. **Both tables are deliberately EMPTY** — no backfill ran inside the
migration.

⚠️ **NOT DONE, and it is the payoff step. 6.3, the generic gate, is untouched.**
`gate_rendition_publish()` still reads `content_renditions.thumb_spec` and asks a thumbnail-shaped
question. Until it asks "does this rendition have the media its channel requires", `thumb_spec`
cannot be dropped from the rendition and adding a platform still costs code. **The rendition column
is intentionally still there**; removing it first would take the thumbnail check offline.

⚠️ **`lib/supabase/types.ts` is NOT regenerated.** Both typechecks pass and the doctor is unchanged
at 10 of 12, because every change is additive and nothing references the new columns yet. It is owed
before anything reads them.

### Plan step 4.3 is RUN: the shot list has a recorded compliance pass

**[`2026-08-16-shot-list-compliance-pass.md`](2026-08-16-shot-list-compliance-pass.md).** Eight
scripts across seven asset files — `same-test-twice` carries two — checked at the layer a string
match cannot reach: the `[Visual: …]` directives, the burnt-in `[Text: …]` overlays, the props and
the delivery cues.

**Nothing in the set needs a fresh clinical ruling, and no burnt-in overlay states an outcome, a
benefit or an ingredient**, so the EFSA tables are not in play anywhere in the visual layer. **Five
flags, all for Keith, none clinical.**

🔴 **The finding worth the pass: three scripts put a real medical record on camera, all three already
instruct redaction, and each one states it at a DIFFERENT production stage.** Only
`what-time-was-it-taken` puts it inside the shot block, which is the part a person holding a camera
reads; `same-test-twice` defers it to the edit ("before it is cut"), which is correct for what ships
and **creates an unredacted special-category recording with no retention rule** — and
`03_compliance/deletion-policy/` is empty, so there is no policy for it to fall under. A third flag:
the instructions name *identifiers*, while "thumb scrolls once" can bring **adjacent unrelated
results** into frame, which is a different set.

**`ep-0-baseline` is amber with nothing joining it to its ask.** `ewa_task` is null on the row, but
the ask exists: ClickUp `869ec31xu`, still `to do`, dated for a **3 August shoot that did not
happen**. Not "forgotten" — unjoined, so I5 has nothing to resolve against.

⚠️ **The `preflight` column was deliberately NOT written**, and the reason is a modelling gap worth
recording. That column holds the COPY pre-flight verdict; this is a pass on a different axis. Writing
these findings into it would either overwrite a copy verdict with a production one, or flip six green
assets to `amber-ewa` and assert an Ewa gate that none of them needs. **One column, two kinds of
pre-flight.**

**The mechanism the plan asks for is still owed.** This pass was run by reading, so it is not
repeatable and will not fire on the ninth script. The durable form is a shot-block extractor applying
checks that only exist at that layer; three of the five findings are mechanical enough to be caught
that way.

## The cold archive is BUILT and proved end to end, and the server inventory was wrong (2026-08-14)

**3.5 is now complete: both halves.** `scripts/content-engine/archive-media.ts` copies each asset's
finished cut from Drive `final/` to **nc-server-01 at `/srv/andro-prime/archive/<slug>/`**, verifying
by sha256 on both ends.

🔴 **THE HETZNER LABELS AND THE OS HOSTNAMES DISAGREE, and that nearly stopped this.** The box
Hetzner calls **nc-server-01** reports its own hostname as **`nc-server-03`**; nc-server-02 reports
`nc-dev-02`. The first attempt to find nc-server-01 concluded it did not exist. **`hostname` is not
how you confirm which machine you are on here** — the job pins the IP (37.27.250.169) and asserts a
writable archive root and a working `sha256sum` instead. Full account in `09_website-app/STATE.md`.

🔴 **"320 GB of local disk" was wrong.** That was the total **across both** boxes and step 3.5
attributed it to one; each is 160 GB, with **~118 GB free** on the target. The decision survives its
own broken arithmetic — roughly 10 GB/year of finished media — but the job refuses below a 10 GB
floor rather than trusting the number, because a partial archive that reports success is worse than
no archive.

**Proved end to end against real infrastructure, not mocked**, since the whole point is a second
copy actually existing:

| Test | Result |
| --- | --- |
| Copy a 2 MB file from Drive `final/` to the server | sha256 matches source exactly |
| Re-run | copies nothing, re-verifies |
| **Truncate the archived copy, re-run** | **REPAIRED, full checksum restored** |

**That third one is the one that matters.** Skipping on mere existence would make a truncated
earlier transfer permanent, which is the failure mode where you discover the archive is worthless on
the day you need it. Every test artefact was removed from Drive and from the server afterwards; the
archive directory is empty again.

**`final/` only, never `raw/`.** Raw footage is far larger and its second copy is a capacity
decision nobody has taken; archiving it silently would fill the disk and turn a safety net into an
outage.

⚠️ **Live-tested, NOT unit-tested**, unlike `drive-folders.ts`. The three main paths were exercised
against the real Drive and the real server, which is stronger evidence than a fake for those paths.
The refusal paths are not covered: below-floor disk, missing `sha256sum`, absent archive root,
malformed `drive_url`, no `final/` folder. All of them throw rather than continue, so they fail
closed, but they have never run.

**Nothing is archived yet, and that is correct.** No asset has reached `recorded`, so Drive `final/`
is empty everywhere. The job reports that in words rather than printing a clean zero.

## The restore drill PASSES, and it was wrong three times before it was right (2026-08-14)

**Plan step 3.1's unmet clause is now met for our half.** `09_website-app/database/restore-drill.mjs`
dumps production through the session pooler, restores into a scratch local Postgres, compares a
census table by table, then drops the database and deletes the dump. **39 of 39 checks match: 29
tables, 691 rows, 24 policies, 21 triggers, 32 foreign keys, plus views, functions, indexes and
RLS-enabled tables.**

**What it proves and what it does not.** It proves the database rebuilds from a dump, which is what
step 0.1's schema baseline exists for. It does **not** prove Supabase's own daily backup restores;
that needs their dashboard and a separate project. Calling this "backups tested" would be the same
error as calling a backup tested because a file exists.

🔴 **THE DRILL REPORTED A CONFIDENT, WRONG VERDICT THREE TIMES BEFORE IT WAS RIGHT.** This is the
finding worth keeping, more than the pass:

1. **"23 of 24 policies missing, the restore is NOT faithful."** Caused by **carriage returns**.
   `psql` on Windows ends lines with CRLF; the parser split on `\n` alone, so the role names read
   out of the live catalogue were `anon\r` and `authenticated\r`. The drill created two cluster
   roles with those literal names, reported "created role(s): anon, authenticated", and the restore
   then failed because the dump references `authenticated`. **An invisible character produced a
   confident wrong conclusion about a different system.**
2. **It excused the cause and alarmed on the consequence.** The same run filtered "role does not
   exist" errors out of its fatal list as expected noise, then reported the resulting absent
   policies as a backup failure. A drill has to separate *the backup is incomplete* from *the target
   is not the platform*.
3. **"All 35 checks match" while five foreign keys had silently failed to restore.** The census
   counted indexes and not constraints, so a green verdict was reachable with referential integrity
   missing. **That is the exact failure the drill exists to catch, reproduced by the drill itself.**
   Constraints are now counted by type.

**The general rule this argues for: a verification tool needs verifying, and the way to verify one
is to make it fail on purpose.** Every one of those three was found by reading output that
disagreed with a plausible story, not by the tool reporting a problem.

**A fourth, smaller one:** an em dash inside the census SQL was rejected by `psql` as `invalid byte
sequence for encoding UTF8: 0x97`, because the query is handed over on the command line. That SQL
is now asserted ASCII-only.

✅ **Genuine disaster-recovery knowledge, discovered rather than assumed.** To restore this database
onto anything that is not Supabase you need five things that do not travel in the dump: the roles
`anon` and `authenticated`; `auth.uid()`; `supabase_functions.http_request()` for the
`revalidate_webhook` trigger; an `auth.users` table; and the ids it holds, because **13 foreign keys
across the public schema point at it**. Before tonight none of that was written down anywhere.

## Phase 3 storage: the bucket exists, the media left git, and takedown is written down (2026-08-14)

**Live counts, unchanged by this work and re-read from the database rather than carried forward**
(this section is the topmost dated one, so invariant I7 reads its counts and a section without them
blinds the check): **18 published articles, 9 planned channels, 38 content assets, 74 renditions, 21
thumbnails owed; grid 162 slots, 27 filled, backlog 135.** The doctor is now **10 of 11 PASS** — I11
is new — and the single FAIL is still I10 on Substack, the pre-existing coverage red that needs a
published issue.

**3.3, 3.4 and 3.6 are DONE. 3.5's Drive half is BUILT AND TESTED BUT NOT SCHEDULED.**

**3.1 was already bought** — the Supabase organisation reports `plan: pro`, read from the API on
2026-08-14 after six documents had said otherwise and this session told Keith to go and buy it. Its
only unmet clause is **a tested restore, which is Claude's and has never been done**.

**3.2 is half done: `nc-server-01` backups are ENABLED and the first image exists** —
`Backup 2026-08-14T22:43:15Z`, 11.58 GB, Available, evidenced by the Hetzner console. This
**unblocks the cold-archive half of 3.5**. `nc-server-02` is still unreported. **No Hetzner
credential exists in either env file**, so nothing here can re-check this later.

**Two properties that bound what may live on that box:** seven **slots**, not seven days (oldest
deleted when a new one is created), and the images are **crash-consistent, not
application-consistent** — Hetzner's own panel advises powering off first. Fine for write-once shot
media, **not** an adequate backup for anything transactional. And an image existing is not a tested
restore, which is an accepted gap here rather than an oversight.

### 3.3 — one public bucket, and three controls at three layers

**`content` exists**, public, path convention `<asset-slug>/<name>-<sha256[0:8]>.<ext>`. Migration
`20260814_content_media_bucket.sql`. **110 objects, 18 MB, ten asset slugs.**

**The rule shipped with the bucket**, in `03_compliance/CONTEXT.md` ("Public media bucket"): results
PDFs, biomarker charts, customer photos, anything user-derived, and unapproved copy rendered into an
image may never enter it. **Public means unauthenticated, permanent, CDN-cached and crawlable**, so
an upload is published whether or not a post ever goes out.

**Three controls, and only the third is detective. Every one was verified by attempting it, not
reasoned about:**

| Layer | Control | Proof |
| --- | --- | --- |
| Upload | mime allowlist `image/png, image/jpeg, video/mp4` | a service-role PDF upload is **refused 415**. Our own jobs cannot put a results PDF here. |
| Access | RLS on, **zero policies** | anon upload **403**, anon delete **403**, anon list returns **`[]`**, unauthenticated download **200** (which is what Metricool needs). |
| Audit | **doctor invariant I11** | every object must match the convention and its slug must be a live `content_assets` slug. |

🔴 **The step as written asked for a blocklist and that is unbuildable.** "Fail if a forbidden kind
appears" cannot be implemented: nothing can look at a PNG and see that it is a biomarker chart.
Inverted into an **allowlist over provenance** it becomes both buildable and stronger — a results
PDF, a customer photo and a stray export are all things no content asset would ever claim, so the
check catches the whole class including the members nobody enumerated. **13 unit tests** cover it,
including that an empty bucket is a NOTE rather than a silent pass, and that an unprobed bucket is
UNCHECKED rather than PASS.

**The eight-hex content hash in the path is the embargo, not cache-busting.** Slugs are published in
the run calendar, so `<slug>/slide-03.png` is guessable by anyone reading the plan, and thirty
carousels sit in the bucket for up to thirty days before their slot. Listing is already denied; the
hash closes the guess.

### 3.4 — the media left git, and the manifest replaced the convention

**`publish-media.js`** uploads a deck's publish set, content-addresses it, and **verifies each object
by fetching it back unauthenticated** rather than trusting the 200 it got for writing it — because
that anonymous fetch is exactly what Metricool does, and a bucket that had quietly stopped being
public would still accept every upload. Re-running uploads nothing and re-verifies all 110.

**`schedule.js` now resolves media through the committed `media-manifest.json`** instead of building
URLs by string concatenation against `andro-prime.com/carousel`. **A hashed path cannot be
reconstructed from a convention, so the recipe has to record it** — and the manifest also makes a
missing file representable, where the old concatenated URL always "existed" and could still 404 into
a post with missing frames. `node schedule.js --check` passes on all its invariants; with the
manifest removed it refuses, naming what to run.

**246 files untracked** (110 from `frontend/public/carousel/`, 136 from `carousel-prototype/png/`),
both paths gitignored. A fresh re-render of `brain-fog` produces **zero** new tracked or untracked
binaries, which is 3.4's done-when. Untracking does not shrink history: the ~90 MB stays unless every
commit hash is rewritten, which is not worth it at 113 MB. **This changes the trajectory, which is
the part that compounds.**

**Nothing was serving those files.** `/go` renders no images, and `schedule.js` was the only
constructor of the old URLs. **The thirty scheduled posts are untouched**, verified against the live
calendar: all media on them reads `static.metricool.com/planner/...`, because Metricool re-hosts at
schedule time.

⚠️ **The paths moved once, deliberately, before anything depended on them.** They were first written
under the deck slug (`brain-fog/`), which is NOT the asset slug (`carousel-brain-fog/`), so I11's
ownership check would have called all 110 orphans. Re-uploaded under the asset slug and the 110
originals deleted; this also lines them up with `content_media`, step 6.2.

### 3.5 — working media has a home, and the job that makes it has been run for real

**`scripts/content-engine/drive-folders.ts`.** Creates `Content/YYYY-MM/<slug>/{raw,final,thumb}/`
on the business Drive for any asset at `scripted` or beyond that carries a shot rendition, and
writes `drive_url` back. **18 unit tests, plus a live end-to-end run against a throwaway root.**

**The convention was not mine to choose and I did not re-derive it.** It was checked against the
live Drive on 2026-07-31, after an earlier draft of the automation plan invented
`01-raw / 02-edit / 03-final` while a real convention was already documented in four places and in
use. Three subfolders because `sop-thumbnail.md` writes fixed filenames into `thumb/`; the slug
folder is bare; the month is the asset's MINT month, so a folder does not move when filming slips.

**Nothing was owed, and that is a measurement rather than an assumption.** All seven assets with a
shot rendition already had a folder, and **all seven were verified against the live Drive**: folder
ids match `drive_url` exactly, and every one has `raw`, `final` and `thumb`. The three other
`scripted` assets have **zero** shot renditions, so they do not qualify. The hand-backfill of
2026-07-31 was done correctly and there is nothing to repair.

**It verifies as well as creates**, which is the half a create-only job would miss: a `drive_url`
pointing at a folder that was renamed, trashed or emptied reads as done from the database and is
not, and that state stays invisible until the day footage needs somewhere to go. A missing
subfolder is repaired; a trashed or renamed folder is a FAILURE naming what happened.

🔴 **The create path could not be exercised by a live run, because there is nothing to create.** So
`gws` was made injectable and every branch a happy run never reaches is driven from a fake Drive:
duplicate folders (a REFUSAL, not a guess — Drive genuinely permits two folders of one name, and
choosing silently would split an asset's media across two places that both look right), a create
returning no id, a trashed folder, a rename, a file that merely shares a folder's name. Then the
real path was proved once against a **throwaway** `Content` root: month, slug and three subfolders
created, second run created nothing and returned the same id, throwaway trashed. **The real tree
still holds exactly one month folder.**

🔴 **A guard bug was caught by this, and it was live.** The direct-invocation check was
`/drive-folders\.ts$/`, which also matches `test-drive-folders.ts` — so importing the module to
test it fired a real run against the real Drive and the real database. Replaced with the exact
basename equality that `doctor-heartbeat.ts` and `metricool-metrics.ts` already use. **Worth
checking any future job written from this one as a template.**

⚠️ **NOT SCHEDULED, deliberately, so the done-when is only half met.** "A new asset reaching
`scripted` gets its folder without a human" needs a cadence, and registering one now means a
**fifth** Windows scheduled task holding an absolute path into `scripts/content-engine/` — the
exact thing that made plan step 2.1 defer the package move, on a machine whose Task Scheduler query
API is broken. The job has **zero work to do** until a filming day that is not booked, so the cost
is real and the benefit is not yet. **Register it together with the 2.1 package move at the end of
August**, or the moment the filming day is booked, whichever comes first. Until then it runs by
hand: `npx tsx scripts/content-engine/drive-folders.ts`.

~~**The cold-archive half of 3.5 is not started** and is blocked on 3.2.~~ **BUILT the same day**,
once `nc-server-01` backups were enabled: see the cold-archive section at the top of this file.

**`npm run test:engine` now exists.** The eleven content-engine test files were in no npm script at
all and were run by hand, so a new one would have been invisible. Kept SEPARATE from `npm test`
rather than folded in, because 2.1's whole point was getting app tests out from behind engine
tooling. All eleven pass.

### 3.6 — the takedown path, written and half-proved

**In `03_compliance/CONTEXT.md`**, as a seven-row table in the order to clear them: the live post,
the scheduled post, Metricool's CDN, Storage, the repo, `content_renditions.body`, then search
caches. **Public-facing first, sources last** — tidying the repo first leaves the live post up while
you feel finished.

**`unpublish-media.js`** is step 4 in executable form: `--list`, `--prefix`, `--orphans`, dry by
default, `--yes` to act. It was **exercised for real** removing the 110 superseded objects, and its
`--orphans` mode is the exact inverse of I11: it lists what is in the bucket that the manifest does
not name.

🔴 **DEPLOYED 2026-08-14 22:05Z (`89c08fc`), and the deploy found a step the procedure was missing.**
The old path stopped serving from the origin, but **every `.png` under it still returned 200 from
Cloudflare's edge** with `cf-cache-status: HIT` and `age` ~44 hours — real image bytes, origin
already gone. The `.mp4` at the same path returned 404, so **the cache is per-object and one path's
state says nothing about another's**. Added to the takedown path as **step 4b**, with the rule that a
takedown is never confirmed from an absence of errors. Supabase Storage, by contrast, was measured
clean: a deleted object returns 400 with `cf-cache-status: BYPASS` immediately. Live site verified
after the deploy: `/`, `/go`, `/blog`, `/test-selector` all 200; all 110 Storage objects re-verified
by anonymous fetch.

🔴 **Step 3 is UNVERIFIED and it is the weak point.** We do not know whether deleting a Metricool
post also removes its CDN media, or whether that URL stays live indefinitely. **The experiment:**
create a throwaway draft on our own brand with a disposable image, record the assigned
`static.metricool.com` URL, delete the post, re-fetch the URL. Not run — it writes to a live brand
three days before the run starts, so it is Keith's call. **Until then the procedure assumes the CDN
copy persists.**

## Phase 2, part-done: `npm test` runs again, D5 answered, the doctor's cadence proved (2026-08-14)

**The three low-risk pieces of Phase 2 were taken; the package move was deliberately not.**

- **2.1, HALF.** The last two typecheck errors are fixed and **`npm test` exits 0 with all twelve
  app test files running**, including the 34 clinical routing regressions that have had no cover
  since the errors appeared. **Both errors were live defects in `doctor-heartbeat`'s alarm path**,
  not typing noise: one made every ClickUp task look unsettled (the next alarm would have
  commented on a closed task), the other would have failed task creation outright. Both latent,
  because the heartbeat has never had to alarm — and **a test was green over the first one**,
  because its fixture supplied the wrong shape production expected, cast to the right type. The
  package move waits: four scheduled tasks hold absolute paths into `scripts/content-engine/`,
  two of them now load-bearing for the run, and this machine cannot be asked whether a task is
  healthy.
- **2.2, DONE.** Nine consecutive unattended doctor runs (2026-08-06 to 2026-08-14, 01:30Z),
  against a done-when that asked for three. Nothing needed re-pointing.
- **2.3, DONE. D5 is answered: there is no watch path, every push builds and deploys.** Three
  markdown-only commits on 2026-08-13 each produced a Sentry release. Detail in
  `09_website-app/STATE.md`.

## PHASE 1 IS DONE: the run is registered, and the machine measures something for the first time (2026-08-14)

**Live counts, computed from the database rather than carried forward** (this section is the
topmost dated one, so invariant I7 reads its counts and a section without them blinds the check):
**18 published articles, 9 planned channels, 38 content assets, 74 renditions, 21 thumbnails
owed; grid 162 slots, 27 filled, backlog 135.** The doctor is **9 of 10 PASS**; the single FAIL is
I10 on Substack, which is the pre-existing coverage red recorded on 2026-08-05 and needs a
published issue, not a doc edit.

**Assets went 28 to 38 and renditions 44 to 74**, all thirty new rows being the carousel run.
**The grid counts did not move**, which is correct rather than a miss: `instagram/carousel` was
registered with `in_plan = false`, so it is not in the coverage denominator. See the open ruling
below.

### 1.1 — the thirty posts are in the database, matched by their own captions

**D1 is implemented.** `20260814_content_renditions_variant.sql` adds `variant` and replaces the
`(asset_id, platform, format)` unique key with `(asset_id, platform, format, variant)`. **`NULLS
NOT DISTINCT` is the load-bearing part**: Postgres treats nulls as distinct by default, so a plain
four-column key would have silently WEAKENED the old rule for the 44 renditions that carry no
variant, letting duplicates in as long as each left the column null. Both properties were proved
against the live database in a transaction that was rolled back: a duplicate null-variant insert
is still refused, and a second row differing only by variant is now allowed.

**`register-carousel-run.ts` adopted the thirty existing Metricool posts.** Ten assets
(`carousel-<topic>`, series `carousel-30-2026-08`), thirty renditions at variants A, B and C,
each carrying its Metricool id, its slot and the caption that shipped. It creates nothing in
Metricool. **A post is matched to a run-day by its SLOT and then refused unless its text is the
approved caption for that topic byte for byte**, because a slot is not topic-specific and a
caption is: a wrong id would have a rendition reporting another post's publication as its own.
Zero refusals on the live run, and a second run reports 10 unchanged / 30 unchanged.

🔴 **The two Aug-10 test drafts that bracketed day 30 are GONE.** The 2026-08-13 entry in
`06_marketing/STATE.md` flags them as a legibility problem needing a UI delete; the calendar now
returns exactly thirty posts for the window, so that item is closed.

**Four repo-side surfaces needed the same change, and none of them is a document.** `variant`
joined `scan.js`'s file-owned rendition keys as CRAFT (a human decides that one idea ships three
ways); `content-sync` now labels a rendition `instagram/carousel A` so three rows that share a
platform and format are told apart, and renders **byte-identically** for every rendition without
a variant, so the idempotence guarantee survives; `content_channels` gained an
`instagram/carousel` row; and ten asset files were minted, because doctor invariant I1 requires
one per row and neither of its exemptions fits (a batch draft can only cover assets sharing one
canonical article, and these ten have ten).

**The asset files are generated by `carousel-prototype/mint-asset-files.js` and deliberately
carry NO approved copy.** They hold identity, the deck's SHAPE (eight slides by type and eyebrow),
the close set, the kit close B names, and the approval trail. The caption and the slide copy stay
in `captions.md` and the decks, and the copy that shipped is recorded once, in
`content_renditions.body`. A second copy of approved copy is one that can be edited without going
back through Ewa.

⚠️ **OPEN, for Keith: is the carousel a planned lane?** `content_channels.instagram/carousel` is
seeded `in_plan = false` on the `linkedin/short` precedent, because `in_plan` is the coverage
DENOMINATOR and flipping it true moves every coverage percentage in the doc layer. Flip it and the
grid goes from 18 x 9 to 18 x 10, 162 slots to 180. The run publishes either way.

⚠️ **A modelling gap the ruling does not close, recorded rather than patched.** The three variants
ask for three different things (A quiz, B the topic kit, C the canonical article), and `cta` lives
on the ASSET. So the ten carousel assets carry **no `cta` at all**, with the reason written into
each row's `notes`. The variant column records which close ran, not what it asked for; that
mapping is fixed in `closes.js` and approved as CA-031, amended by K2 of CA-034. It is readable
today and it is not queryable.

### 1.2 — `content_metrics` has a writer, and the table is no longer dormant

**D7 is implemented.** `20260814_content_metrics_carousel_and_video.sql` adds `saves`, `reach`,
`video_views` and `watch_seconds`. `raw` stays the catch-all; a field is promoted into a column
only when something queries it.

**`metricool-metrics.ts` ran live and wrote nine real captures** across LinkedIn and X, joined on
the platform's own post id read out of `external_url`. Before this the table held eight rows from
a single hand capture on 2026-07-28 and nothing had written to it since, so **every count this
machine reported was a production count and none was an outcome.**

**Registered as a daily 07:15 cadence and verified by the scheduler firing it unattended**
(11:38:29Z, exit 0, both signals: a log line and an `agent_runs` row). It runs AFTER
`metricool-writeback` at 07:00 on purpose: metrics join on the platform post id, and the
write-back is what records it. Detail in `12_operations/automation/scheduled-agents.md`.

**The cadence is the point, not the freshness.** Close A's ten posts average run-day 14.5 against
close C's 16.5, so comparing running totals at one moment ranks the closes by publish date. The
comparison has to be at a FIXED AGE, and the job reports its own seven-day coverage on every run:
how many posts past the mark have a datapoint within a day of it. **A missed reading cannot be
backfilled** — Metricool holds running totals, so a number can be recovered later, but a reading
AT an age cannot. Posts published before 2026-08-14 are excluded from that denominator, because
their age-7 readings were never takeable and counting them would hold the report permanently red.

🔴 **THE INSTAGRAM FIELD NAMES ARE STILL A GUESS, and this is the one thing to check on 2026-08-18.**
Nothing has ever published on either brand's Instagram, so the analytics endpoint answers 200 with
an empty array, which proves nothing about its shape. The Instagram mapping is CANDIDATES
(`saved`, `saves`, `totalSaved`, `bookmarks` for the metric the test turns on). The job prints
every unmapped numeric key it sees, so **day 1's capture is what turns the guess into knowledge**.
Until then, a month of silent nulls would read exactly like posts nobody engaged with.

🔴 **Two platforms cannot be joined by id at all, measured rather than assumed.** LinkedIn posts
published through Unipile carry an **activity** urn in their URL while Metricool reports analytics
keyed on the **share** urn, and those are different numbers for one post. Facebook's URL id and
its analytics `postId` also differ (…337201122 against …355201122 for the same post). Both are
reported by name and left unjoined; matching them on timing would attach one post's numbers to
another. Metricool-published LinkedIn posts join cleanly, which is why three of them captured.

🔴 **`METRICOOL_BLOG_ID` NAMES ONE BRAND OF TWO, and the wrong one answers 200 with an empty
array.** It is 6633045 ("Keith Andro Prime"); the carousel run is on 6693691 ("Keith Antony AI").
Listing the scheduler for the run's window under the configured brand returns zero posts, and on
its own that response reads as "nothing is scheduled". `metricool-metrics` queries **both** brands
for every network. `metricool-writeback` is unaffected: `GET /scheduler/posts/{id}` is NOT
brand-scoped and answers under either, verified on a real post id. Two endpoints of one API, two
scoping rules.

### 1.3 — NOT DONE, and it should not be done yet

**`schedule.js` stays.** The plan's step is "delete it and let `metricool-schedule.ts` resolve the
same thirty posts", and doing that now would destroy a working generator and replace it with
nothing. Three reasons, in order of weight:

1. **The shared scheduler cannot build a carousel.** Its only media path is the canonical
   article's photograph on Facebook, so an `instagram/carousel` rendition would have been sent
   with an EMPTY media array. **That hole was live and is now closed**: any format that IS media
   (carousel, reel, short, long-form, story, image-post, video) is REFUSED with the missing piece
   named. Which files belong to a rendition has no home in the database until `content_media`,
   which is the plan's own **Phase 6.2** — so 1.3 depends on a step five phases later.
2. **`schedule.js` is not a scheduler.** It never calls the API; it generates payloads from
   `covers.js` and parses captions out of `captions.md`, and refuses to emit a run that fails its
   twelve invariants. Deleting it deletes those checks.
3. **`register-carousel-run.ts` reads it** for the run definition, so it is now load-bearing in a
   second place.

**Retire it when** `content_media` exists and `metricool-schedule.ts` can build an eight-media
Instagram payload from the database. Until then the honest statement is that the shared scheduler
now REACHES the carousel lane and says out loud that it cannot build for it.

## Plan step 0.2 is DONE and I4 is GREEN for the first time since 2026-08-03 (2026-08-14)

**`metricool-writeback.ts`** asks Metricool what actually went out and records it. First live run
moved **eight renditions** to `published` with their real platform URLs: three X posts, three
LinkedIn, two Facebook, published between 6 and 11 August with nothing writing back. **I4 violations
went from 8 to 0.** Renditions at `published` went 9 to 17, all 17 now carrying both a URL and a
timestamp. A second run immediately after did nothing and said so.

**It distinguishes something no check here could before.** I4's own message admits the ambiguity: a
rendition still `scheduled` after its slot "either published and nothing wrote back, or it silently
did not go out". This job separates them by asking the publisher. Only a platform-reported
`PUBLISHED` is written; a passed slot still reporting pending is a REFUSAL, because recording a
publish that did not happen turns a true red into a green lie. On this run all eight had genuinely
published, so nothing had silently failed.

**Verified rather than assumed:** the local-to-UTC conversion (Metricool sends a wall clock plus a
zone, never an offset) was checked against all eight rows, and every computed `published_at` matched
the `scheduled_for` already stored. 28 unit checks cover DST boundaries, provider-error, passed-slot,
draft, missing-post and write-failure paths.

**SCHEDULED 2026-08-14 (Keith's ruling): daily 07:00 local, `StartWhenAvailable`.** Task
`AndroPrime metricool-writeback`, wrapper `metricool-writeback-cron.cmd`, log at
`%LOCALAPPDATA%\andro-prime\metricool-writeback.log`. **Verified by the scheduler, unattended**: a
one-off trigger fired it at 04:06:34 with nobody present, and it left both signals, a log line and an
`agent_runs` row (`status: ok`, `exit_code: 0`). It was safe to schedule where `metricool-schedule`
is not, because it never creates, edits or publishes anything. Two registration traps are recorded in
`12_operations/automation/scheduled-agents.md`: `Unregister-ScheduledTask` fails on this machine with
`0x8007054F` (use `schtasks /delete /f`), and `New-ScheduledTaskTrigger -Daily` writes a **UTC**
StartBoundary, which would have drifted the job to 06:00 local after the October clock change until
it was re-anchored to local time.

🔴 **Two defects found and fixed while building it, both pre-existing.**

1. **`lib/supabase/types.ts` did not contain ANY of the content-machine tables.** It was generated
   before 2026-07-28, so `content_assets`, `content_renditions`, `content_channels`,
   `content_metrics`, `content_hooks` and `content_asset_revisions` were all absent, which is why
   `.update()` on a rendition typed as `never`. Regenerated. **This removed one of the three type
   errors blocking `npm test`** (the `metricool-schedule.ts` one). Two remain, both in
   `doctor-heartbeat.ts`, and they are Phase 2.1's work. Regenerating also revealed that the file had
   been **hand-edited**: `users.sex` had been narrowed by hand to `'male' | 'female' | null`, which a
   generator cannot reproduce because the column is `text` with a CHECK constraint. That narrowing now
   lives at the boundary that needs it, in `app/api/vitall/dispatch/route.ts`, where a regeneration
   cannot erase it. App typecheck re-verified at 0 errors.
2. **`process.exit(code)` crashed on this machine** with a libuv assertion and returned
   -1073740791 instead of the intended code, on every run, in both Metricool jobs. So
   `metricool-schedule`'s documented exit codes never reached the caller and a refusal looked like a
   crash. Fixed in both. `content-doctor-cron.ts` was checked and is unaffected.

## Plan step 0.1 is DONE: the schema now exists in a file (2026-08-14)

**`09_website-app/database/schema/baseline-2026-08-14.sql`** is a full `pg_dump --schema-only` of the
`public` schema, 3,283 lines. Verified object-for-object against the live catalogue at dump time and
again in the committed file: 29 tables, 6 views, 8 functions, 19 triggers, 11 enums, 24 policies, 29
RLS-enabled tables, 51 standalone indexes plus 44 constraint-backed for the live total of 95. Before
this, the schema of the business existed only inside the live database, which had no managed backup.

**Placed in `database/schema/`, deliberately NOT in `database/migrations/`.** That directory is an
ordered log and `sync-supabase-migrations.ps1` copies every `*.sql` in it into the Supabase CLI's
folder, where `supabase db push` would apply a full-schema snapshot on top of a live database. The log
and the snapshot are different artefacts. Rebuild path, connection details and regeneration command
are in the file's header and in `09_website-app/CONTEXT.md`.

🔴 **CORRECTION to the 2026-08-13 review (§11.1).** It claimed the repo held two competing migration
directories and advised deleting one. **That was wrong.** `supabase/migrations/` is not tracked in git,
is gitignored by `supabase/.gitignore`, and is regenerated by `sync-supabase-migrations.ps1`; it was
merely stale, and the convention was already documented in the migrations README. Nothing needed
collapsing. The genuine gap, measured against `database/migrations/` alone, is **11 applied ledger
entries with no file and 9 files with no ledger entry** — which is what the baseline fixes.

**Connection notes, because three of four routes fail:** use the **session pooler**,
`aws-0-eu-west-1.pooler.supabase.com:5432`, user `postgres.phqrjtnflovicgkngieu`. The direct host
`db.<ref>.supabase.co` is IPv6-only and this machine has no IPv6; the transaction pooler on 6543 does
not support `pg_dump`. Recorded in `09_website-app/CONTEXT.md`.

## Plan step 0.3 is DONE, and a bigger exposure was found next to it (2026-08-14)

**0.3 complete.** `public.blog_articles_body_backup_20260731` is dropped. Verified before dropping:
both rows were the pre-strip bodies of `how-to-read-blood-test-results` and
`andropause-male-menopause`, and each md5-matched exactly one row already in
`blog_article_revisions`, so this removed a second copy rather than the only copy. No code referenced
it. Migration `09_website-app/database/migrations/20260814_drop_blog_articles_body_backup.sql`, applied
as `drop_blog_articles_body_backup_20260731`. `get_advisors` no longer reports `rls_disabled`.

🔴➡️✅ **Found while verifying it, RULED AND FIXED the same day (Keith, 2026-08-14).** Three
`SECURITY DEFINER` functions were executable by the **`anon`** role, confirmed by
`has_function_privilege` rather than by the linter alone: `upsert_blog_article`,
`stage_blog_revision` and `promote_proposed_revision`. The anon key ships in the browser bundle, so
anyone who loaded the site could extract it and call `/rest/v1/rpc/upsert_blog_article` to overwrite
or publish any blog body, including Ewa-signed clinical copy. `record_ewa_signoff` was correctly
locked, which showed the pattern was understood and these three were missed.

**Fixed by `database/migrations/20260814_revoke_anon_execute_blog_write_rpcs.sql`.** All four
blog-writing functions now grant EXECUTE to `postgres` and `service_role` only. Checked before
running that the grants were explicit per-role rather than the PostgreSQL default of EXECUTE to
`PUBLIC`, because a revoke masked by a surviving `PUBLIC` grant would have looked identical and
changed nothing. **Verified end to end, not just in the catalogue:** an anon POST to
`/rest/v1/rpc/upsert_blog_article` now returns **HTTP 401**, the live site returns 200 on the home
page and both affected articles, and `get_advisors` no longer lists the three. The schema baseline
was regenerated so it records the corrected ACLs.

**Still open from the same advisor run:** `handle_auth_user_change()` remains anon-executable and
`SECURITY DEFINER`. It is a trigger function taking no arguments, so a direct RPC call has no trigger
context to read and should fail, but it has not been tested and it does not belong on the public API
surface.

**Also open from the same advisor run, all pre-existing:** six `SECURITY DEFINER` views at ERROR
level (`v_kit_pipeline`, `v_weekly_kit_sales`, `v_deposit_summary`, `v_supplement_mrr`,
`v_result_to_supplement_conversion`, `v_gate_tracker`), three functions with mutable `search_path`,
and Auth leaked-password protection disabled.

## The proposal has an execution plan, and D1 is ruled (2026-08-14)

**`2026-08-14-content-machine-plan.md`** is the plan of record for executing the unification proposal.
Interactive copy: <https://claude.ai/code/artifact/5145dc45-0ad3-47ed-8aeb-56cb128ef126>. It keeps all
nine items from the proposal's §9, adds the item 0 the review found, and reorders them by dependency
and by the two dates that are actually fixed. Nothing in it is built.

**DECIDED (Keith, 2026-08-14), D1: add a `variant` column to the `content_renditions` unique key.**
The key is `(asset_id, platform, format)`, which allows one asset exactly one Instagram carousel. The
run is ten topics shipped as three carousels each, differing only in the closing slide, so the key
refuses the second and third. Adding `variant` makes it one carousel per asset per variant. The
rejected alternative, one asset per post, needed no migration but would have left no record that the
three are one idea, making "which close won" unanswerable and fanning one signed article's claims
thirty ways instead of ten. **Ruled, not implemented:** the migration is Phase 1 of the plan and has
not been written.

🔴 **The proposal's review (its §11, added 2026-08-14) found that the content-machine schema exists in
no file.** Six applied migrations, including the four from 28 July that create `content_assets`,
`content_renditions` and `content_channels`, have no counterpart in either
`database/migrations/` or `supabase/migrations/`, and the two directories disagree with each other and
with the applied list. Baselining it is Phase 0 of the plan and should land **before** the D1
migration. Three tables also exist with no writer: `content_metrics`, `content_asset_revisions` and
`content_hooks`.

**DECIDED (Keith, 2026-08-14), D7: measurement uses `content_metrics`, extended where other channels
need it.** The table is a time series keyed `(rendition_id, captured_at)` and has no writer today.
Extensions identified: **`saves`** (Instagram's strongest carousel signal, and the winning metric of
the very test this table's first use is, which it currently cannot store), `reach`, and video views
plus watch time for the shot arm. `raw` jsonb stays the catch-all; promote a field to a column only
when something queries it.

🔴 **The measurement trap, which the schema alone does not solve.** The run is a clean rotation: each
close appears ten times, evenly interleaved, and every topic gets all three closes, so topic effects
cancel and the test is genuinely readable. But close A's ten posts average run-day 14.5 against C's
16.5, so **comparing running totals at one moment would rank the closes by publish date**, in A's
favour. The comparison has to be at a **fixed age** (saves at seven days), which makes capture cadence
a requirement on the write-back poll, not just capture. Last post publishes 2026-09-15, so **the test
cannot be read before roughly 2026-09-22**.

**DECIDED (Keith, 2026-08-14), D3b: move Supabase to Pro.** Reason on the record is backups, not
storage. Self-hosting on Hetzner stays rejected. Not yet executed.

**DECIDED (Keith, 2026-08-14), D3: the three-home storage split, as proposed.** Git holds the recipe,
Drive holds what humans touch, Supabase Storage holds what a machine publishes from, the database
holds only the URI. The ruling does not settle what may never enter a public bucket, the takedown
path, or the second copy of unrecoverable shot media; those are plan steps 3.3, 3.6 and 3.5, now
unblocked rather than answered.

**Three decisions remain open, none with a deadline:** D2 (claim-ledger approvals, **the only one
needing Ewa and therefore the only remaining decision risk**), D4 (`/ops/content`), D5 (Coolify
watch-path). Phases 0 to 4 of the plan are now execution-bound rather than decision-bound.

## Unification proposal issued, one decision taken, five open (2026-08-13)

> **Superseded in part by the 2026-08-14 entry above:** D1 has since been ruled, and the schema-baseline
> finding reorders what goes first. The rest of this entry stands.

**`2026-08-13-content-machine-unification-proposal.md`** is the proposal of record for unifying the
three arms (blog, social, carousel) and extending to video. Written after the 30-day carousel run was
scheduled, because that run exposed the shape of the problem rather than being it. Interactive copy,
with a mockup of the control board: <https://claude.ai/code/artifact/8f059f68-0b01-46ea-9b19-182302d39b04>.

**DECIDED (Keith): the content engine becomes its own package** at `packages/content-engine/`, not a
separate repo yet. The proposal's §7.4 lists the three triggers that would justify a full repo split;
the strongest is someone needing content access without business access.

🔴 **The reason it goes first is a live defect, not tidiness.** `npm test` is
`npm run typecheck:scripts && <12 test files>`, that typecheck **exits 1 on three errors, all in
`scripts/content-engine/`** (`doctor-heartbeat.ts` x2, `metricool-schedule.ts` x1), and the app's own
typecheck exits **0 with zero errors**. So none of the twelve app test files run, including the
results-classifier regressions, quiz routing, checkout and the CIO consent gate. **Clinical logic has
no regression cover right now**, caused by three type errors in content tooling.

**Five decisions are open and named in §8:** the carousel variant modelling (blocks registering the
run), adopting the claim-ledger approvals model (needs Ewa, not just Keith), moving media to object
storage, building `/ops/content`, and whether Coolify rebuilds on any push or only on build-context
changes.

**Three corrections the proposal records, because each contradicts something believed earlier:**

- **The video arm is blocked on the shoot, not on thumbnails.** All 21 video renditions belong to
  assets at `scripted`; **no asset has ever reached `recorded`**. The thumbnail gate sits behind a
  step never taken.
- **The 2026-08-13 asset-hosting decision does not generalise.** 19 MB of carousel PNGs in
  `frontend/public/` was right for that payload and is wrong as a rule; YouTube long-form cannot go in
  git. **Binaries are already 56% of git history** (MP4 42.4 MB / 25 objects, PNG 40.7 MB / 179
  objects, against 71.6 MB of text) with no video filmed yet. §4.4 proposes three homes: Drive for
  working media, one public **Supabase Storage** bucket for anything Metricool must ingest by URL, and
  `frontend/public/` for site chrome only. **Supabase Storage is object storage with a CDN, not a
  Postgres table**, so the "a database would be slow" concern does not apply to it. ✅ **Done
  2026-08-14 (plan steps 3.3 and 3.4)**: the `content` bucket exists and the 110 carousel files are
  in it; `frontend/public/carousel/` is untracked and gitignored.
- 🔄 **SUPERSEDED 2026-08-14: the Supabase organisation reports `plan: pro`, read from the API.** The
  free-tier reading below is stale, and it was repeated by every doc that cited it until someone
  asked the system instead of the document. What is still true and still owed: **no restore has ever
  been tested**, which is the actual done-when of plan step 3.1 and is Claude's to do, not Keith's.
- 🔴 ~~**The live site has no managed backup, and that is the real storage finding.**~~ Supabase is on the
  **free tier**; the DB is 18 MB against a 500 MB ceiling so size is not the pressure, but free has
  **no daily backups** while Pro keeps seven days. Orders, quiz results and biomarker values are all in
  there. §4.5 recommends **Pro**, and recommends **against** self-hosting Supabase on the Hetzner
  boxes: wrong direction for CQC evidencing, **backups are disabled on both servers today**, and it
  would split the store. Marketing media fits inside Pro's included 100 GB either way (~10 GB/yr
  projected), and egress stays trivial because **Metricool fetches each asset once** then serves from
  its own CDN. The Hetzner capacity should host the **content-engine worker** instead (automation plan
  §7); use the x86 box `nc-server-01`, since `nc-server-02` is Arm64 and the renderer needs headless
  Chrome and ffmpeg.
- **The website is already fed blog content from the DB.** `blog_articles.body` is the source of
  truth; `content/blog/*.mdx` is a backup mirror, not a feed. That half of the split is done.

## The social pipeline never read the voice spec, and the prose converged where nothing made it look (2026-08-10)

**Keith's question was whether social is run as carefully as the blog. On compliance and claims it is, and that part of the worry is unfounded.** `/script` and `/hook` already carry craft loading, a marker-availability refusal gate, structure selection on a documented axis, the addiction loop, the four-check, mandatory `/compliance-preflight`, the `content-status` scanner, DB state guards, and per-line claim inheritance from an Ewa-signed canonical asset.

**What was missing was the entire voice layer. `/script` writes every LinkedIn post, Facebook post, short-form and long-form script, and loaded `tone-of-voice.md` zero times.** No §9a AI-tells pass, no structural check. The four-check tests attention (interesting to Mark, compressed, does the hook hook alone, is the end emotion right), which is a different instrument and was doing a different job.

**Measured across the 17 live assets, and the split is the useful part.** Where a rotation mechanism exists it works: hook archetypes spread properly (Contrarian 5, Teacher 3, Investigator 3, Experimenter 2, Magician 1, Breakdown 1), because the playbook makes you choose one explicitly. Where none exists, the prose converged: **7 of the 8 non-statement closes reach for the same `If you…` conditional**, and 2 openers use it too. It is one habit at both ends of a piece, not two.

**Changes, all voice-layer only; no compliance or state logic touched.**

- **`/script` Step 1** now loads `tone-of-voice.md` §3, §4 and §9a. §9's 14 points are explicitly excluded as prose-calibrated: its density and closing-question boxes fight the short-form formats.
- **`/script` NEW Step 4b**, voice and shape check, all four modes: the §9a pass plus a convergence check with two generic commands (group-and-count openers, classify closes as QUESTION / LINK-CTA / statement). Both deliberately generic — an earlier draft grepped a hardcoded watch list, which can only find convergence already known and reports clean on the next one.
- **`/content-week` Phase C** gains a batch check across the week (opener, closing route, archetype, emotion). Batch is the highest-convergence mode we have and the one place a per-piece check structurally cannot see the problem, since pieces converge on each other before any reaches the library.
- **`hook-playbook.md`** now states that the closing question is mandated and the route to it is not, so it agrees with Step 4b instead of fighting it. **Never resolve a collision by deleting the question**: that trades a repeated form for a lost comment mechanic. Device 8 (flat close) stays long-form only.

**A defect in the change itself, caught by running it rather than reading it, and worth recording because it would have been invisible.** `/script` has three mode branches; long-form and written-post each ended with an explicit "Then run Step 5" and jumped clean over the new Step 4b. **The written-post branch is where all the measured convergence is**, so the change would have been a no-op for the only lane that needed it while every structural check reported success. Both branches now route through 4b explicitly, and Step 4's terminal-sounding "close with…" line states that the run continues.

**Nothing here changes what may ship.** These are drafting-time checks. Approval, pre-flight and the database gates are untouched.

## The nightly doctor never ran, and the calendar gap was NOT its fault (2026-08-05)

**Live counts as of 2026-08-05, computed from the database rather than carried forward** (this section is the topmost dated one, so invariant 7 reads its counts and a section without them blinds the check): **18 published articles, 9 planned channels, 28 content assets, 44 renditions, 21 thumbnails owed; grid 162 slots, 27 filled, backlog 135.** The doctor reached **exit 0, 10 of 10 PASS** during this session, the first fully green board; it is **exit 2 as of the last run**, on I10 alone, because the Substack pause was cleared and that lane has nothing queued. See the Substack section above: that red is correct and clearing it needs a published issue, not a doc edit.

**Thumbnails owed fell 25 to 21 without a single thumbnail being made**, because four of them were never owed. See the written-post ruling below.

## RESOLVED the same day: the week was recovered and the thumbnail gate was wrong (2026-08-05)

**All four Lane 1 assets are approved by Keith and scheduled.** `put-it-down-to-age` facebook 08-06 17:00 (`358148041`), `stores-empty-first` linkedin 08-07 11:00 (`358146643`), `eight-hours-in-bed` linkedin 08-10 11:00 (`358146698`), `one-load-five-places` facebook 08-11 12:00 (`358148094`). Monday 08-03 and Tuesday 08-04 were unrecoverable, so the two LinkedIn posts took Friday and the following Monday rather than being dropped.

**Two X renditions that had already published were still reading `scheduled` with no URL**, which was the doctor's only FAIL (I4). Metricool held the evidence both times; reconciled to `published` with their live URLs.

**THE WRITE-BACK GAP IS THE NEXT THING TO BUILD, and it has now fired three days running.** `x-w01-1` (08-03), `x-w01-2` (08-04) and `x-w01-3` (08-05) each published on time and each left the database reading `scheduled` until a human reconciled it by hand. The doctor catches it every night, which is the system working, but I4 will go red every single morning until something writes back. **The job exists in the plan and is not built:** `content-pipeline-automation-plan.md` §5 Phase 2, "a scheduled post publishes -> rendition to `published`, captures the live URL, Metricool poll". `metricool-schedule.ts` already holds the credential handling, the id mapping and the write-back shape, so the poll is a sibling of it rather than new ground. Until it exists, expect a nightly red on I4 for every post that goes out.

**RULING (Keith, 2026-08-05): a written post needs no thumbnail; Reels and videos do.** The image for a Facebook or LinkedIn post is **the associated blog article's own photo, used as published** — `photoSrc`, or `imgSrc` where the article carries no photograph — with no grayscale treatment and no re-crop. This reverses the assumption that a `link-post` owed a bespoke 1200x630 export.

**The gate was refusing to schedule work on the strength of a file that was never going to exist.** All four `facebook/link-post` renditions carried `thumb_spec: 1200x630`, so `gate_rendition_publish()` held them at `to-produce` pending a cover that `sop-thumbnail.md` says is made by hand in Figma. Two of those four were this week's approved Facebook posts. **A gate whose only satisfying artefact requires a person who does not know they are the blocker is indistinguishable from a stop.** Corrected in the database, in all four asset files' `renditions:` blocks, and in `sop-thumbnail.md`, whose thumbnail table no longer lists written posts at all. **A written-post rendition carrying a non-`none` `thumb_spec` is now a defect rather than a to-do.**

**The cadence registered on 2026-08-01 did not execute once in the four nights that followed.** The task existed, was enabled and carried the right daily trigger; the log stopped at registration day and `agent_runs` held only hand runs. Root cause was the Task Scheduler action string, not the doctor, not the machine, and not the broken query API everyone had already noticed: `cmd.exe /c "<script>" >> "<log>" 2>&1` begins with a quote after `/c`, so `cmd` strips the outermost quote pair, mangles the command, and **fails before the redirect exists — no log line, no error, no output at all.** Fixed by re-registering with `cmd.exe /c call "<script>" ...`, and **verified by letting the scheduler fire it unattended** (row at `2026-08-05T00:59:33Z`, exit 2, log written). Full write-up and the two safe action forms: `12_operations/automation/scheduled-agents.md`.

**Three beliefs in the doc layer were false and are corrected there.** "Verified end to end 2026-08-01, invoked as the task invokes it" was a hand run, and a hand run cannot reach the layer that was broken, because the scheduler parses an action string rather than running a shell. "Verify the task by reading its XML on disk" was written to work around the broken query API and is an existence check that stays green over a job that has never started. And `schtasks /run` returns `SUCCESS` while launching nothing, so on-demand runs are not evidence either. **The only liveness evidence is an artefact the job writes as a side effect of running**: the log mtime, or `max(started_at)` in `agent_runs`.

**The doctor was down and it is still not the reason the calendar was empty — the two are unrelated, and conflating them was the natural reading.** All nine invariants check that stores AGREE. This week's four Lane 1 assets sitting at `scripted` / `to-produce` is a state in which every store agrees perfectly, so a green board and a stalled pipeline are the same picture. **Nothing in the suite asserts COVERAGE**, i.e. that a committed weekly slot got filled or has a recorded reason it did not. Owed: either a tenth invariant, or an honest line in the doctor's own output saying a green run does not mean the machine is producing.

**Still open, and it is the real bottleneck: nothing schedules anything.** `createScheduledPost` appears nowhere in the repo; Metricool is read-only here (the I3 probe). Every post on the week of 2026-08-03 was hand-loaded on 2026-07-31. The four assets drafted 2026-08-04 are pre-flight green with published canonical articles and are held by `gate_rendition_publish`: all four need `approved_by` (Keith's read, a human act with no system behind it), and the two Facebook renditions additionally need a 1200x630 thumbnail to pass `thumbnail-done` first.

## Substack is UNBLOCKED, and I10 immediately went red on it (2026-08-05, later)

**Keith supplied a fresh `substack.sid`. It authenticates.** `/api/v1/publication/users` and `/api/v1/drafts` both return 200, the byline resolves to `530930363` (Keith Antony · Andro Prime), and `substack-draft.ts --dry` renders title, subtitle, canonical, CTA and teaser correctly. Token installed in `frontend/.env.local` (gitignored; it is not in this repo and must never be). **This supersedes the "BLOCKED: the whole Substack lane" entry of 2026-08-04**, which is left standing below as the record of what was believed then.

**The standing claim that every pre-2026-07-27 article has a draft waiting is now VERIFIED rather than merely asserted, and it holds.** 18 drafts exist: 16 article drafts dated 2026-07-27, the 2026-07-18 welcome post, and one untitled. The only published articles without one are `andropause-male-menopause`, which published after the batch, and `free-androgen-index`, which was retracted. **The verification was nearly botched in a way worth recording:** the first probe reported zero drafts, because `/api/v1/drafts` returns `{posts, hasMore, nextCursor}` and the probe read `.drafts`. A wrong key in a throwaway script produced a confident, plausible, completely false finding about a claim nobody could previously check. The endpoint also paginates, so a single unpaged call under-counts.

**LIVE TRAP: `substack-draft.ts` defaults to CREATE, and 16 drafts already exist.** Running it without `--update <draftId>` on any of those slugs makes a second copy rather than refreshing the first. The dry run says `mode: CREATE new draft` and means it.

**The coverage pause was CLEARED, and I10 went red on Substack the same minute.** The pause recorded on this channel earlier today gave the expired token as its reason; that reason is now void, and leaving it in place would have been a false statement holding a real gap out of sight, which is the precise failure this session was about. So it went red and honest: Substack had nothing queued. This was I10's first firing on live data, and it fired on a channel that had been quietly producing nothing while every other invariant passed.

**S-04 `brain-fog` SHIPPED 2026-08-05 03:34Z**, live at `https://keithandroprime.substack.com/p/brain-fog`, draft `208621418`. Recorded on Keith's explicit ruling that the pre-flight report stood as the verdict: `substack-brain-fog` is `done`, `preflight green (2026-08-05)`, `approved_by Keith`, rendition `published` with `external_post_id: brain-fog`. Pre-flight was 0 HARD and **zero findings introduced against Ewa's approved article** (task `869dvj482`, complete 2026-06-24); the 3 REVIEW hits are the retest-efficacy heuristic firing on ordinary English ("a fixed wake time") inside copy she already signed.

**SUBSTACK HAS NO CANONICAL URL FIELD FOR A NATIVELY-AUTHORED POST, and both routes to setting one failed silently.** The API accepts `canonical_url` in the payload and drops it; the post object exposes `search_engine_title` and `search_engine_description` and nothing else. Keith was told to set it by hand and did set something, and the rendered page still carries `<link rel="canonical" href="https://keithandroprime.substack.com/p/brain-fog">`, pointing at itself. **The instruction was impossible to follow correctly and it took fetching the public page to find that out.** Consequence, live now: a full copy of the `brain-fog` hub sits on a higher-authority domain, self-canonicalised, competing with `andro-prime.com/blog/brain-fog`.

**A SECOND PLATFORM FACT, found the same way: updating the draft behind a PUBLISHED Substack post does not change the published post.** The trim back to a teaser was pushed by API, reported success, left the draft at 6 nodes, and the live page still served all 59. Substack keeps an editable draft behind a live item and only a save in the editor UI promotes it. `substack-draft.ts` deliberately has no publish path, so this stays a human step.

**OWED, and it is the only thing outstanding from this session:** Keith opens `https://keithandroprime.substack.com/publish/post/208621418` and saves, which promotes the already-prepared teaser and removes the duplicate page. The email went out with the full article, so subscribers are unaffected either way. **Until then `--full` should not be used again on an article we are ranking**; the teaser is the safe default and the script now prints that warning on every `--full` run.

**I10 was half-built and the publication proved it.** It counted only forward, so publishing the very issue it was complaining about left it red. An alarm that does not clear when you do what it asked is worse than no alarm, because the next red gets ignored. Coverage now counts a rendition scheduled inside the forward window OR published inside the equivalent trailing window, with a regression test in each direction. **10 of 10 invariants PASS after the fix.**

## The three gaps the outage exposed are now BUILT (2026-08-05)

**Migration of record: `20260805_content_channels_coverage_pause.sql`**, adding `coverage_paused_until` / `coverage_pause_reason` to `content_channels` plus a CHECK refusing a pause with no stated reason. Scripts: `scripts/content-engine/metricool-schedule.ts`, `scripts/content-engine/doctor-heartbeat.ts` (+ `doctor-heartbeat-cron.cmd`). Tests: `test-metricool-schedule.ts` (25), `test-doctor-heartbeat.ts` (20), plus 10 new I10 cases in `test-content-doctor.ts`. **264 tests green, `tsc` clean, doctor exit 0 at 10 of 10.** All four suites wired into `content-engine-ci.yml`.

**1. `metricool-schedule` — the bottleneck. Nothing in this repo could schedule a post.** It takes approved renditions that already carry a slot and a body, creates the post in Metricool as a **draft** (the standing 2026-07-31 decision, plan §7.1), and writes `external_post_id` back. **Verified end to end against the live API by creating a real draft and deleting it** (`358151096`, DELETE returned `{"data":true}`, the id then 404s), because a probe that only proves the endpoint validates is not proof that a create works.

**It refuses to read post copy out of the asset markdown, and that is the design rather than a shortcut.** Measured across the 17 asset files, postable copy has at least three shapes: a `POST` line then a blockquote (6 files), a bare blockquote with no `POST` line (3 files, including three genuinely published posts), and none at all for video scripts, which are shot lists. Any parser over that is a heuristic, and the cost of a wrong guess is the wrong words on a live public account. Copy comes from `content_renditions.body`, which is already the record of what shipped on all nine renditions that have ever shipped. It also refuses to pick a slot: `scheduled_for` must be set, because choosing when a post goes out is a gate, not plumbing. **First live dry run found a real gap nobody had logged: `x-w01-7-thread-where-the-range-comes-from` is approved with copy and has never been given a slot.**

**2. Doctor invariant I10 — forward coverage, the first invariant here that is not about stores agreeing.** Every lane-1 channel must have something queued in the next 7 days, or a live reason on the record. **Scoped to lane 1 deliberately**: the camera lane may slip and must never hold lane 1, so alarming on it would fire every week without a shoot. **A pause carries a date it dies on.** Substack is paused to 2026-09-05 with its expired-token reason recorded; when that lapses the channel goes red again, because an indefinite pause is how a gap becomes invisible, which is the thing I10 exists to end. Proven in both directions: the empty-channel, out-of-window, unscheduled, expired-pause and no-lane-1 cases all go red or UNCHECKED in tests.

**3. `doctor-heartbeat` — the thing that watches the watcher.** Daily 09:00, its own task, alarming on ABSENCE rather than findings: it never reads an invariant and must never start the doctor, because a monitor that starts the thing it monitors cannot report that thing's death. Two independent signals (`agent_runs` and the cron log mtime), freshest wins, 26-hour window. `unknown` never opens a task. **Verified by the scheduler unattended at 02:51:00.** Honest residual, recorded rather than papered over: it shares a machine and a scheduler with the thing it watches, so a total Task Scheduler failure takes both. Full detail in `12_operations/automation/scheduled-agents.md`.

**`metricool-schedule` is deliberately NOT on a timer.** Putting it on one means drafts appear with no human in the loop. That is the plan's stated intent, but it is an outward-facing automation and therefore Keith's ruling to make rather than a default to inherit.

## Lane 1 ran 2026-08-04, Lane 2 skipped with no filming day, Substack blocked on an expired token

**First `/content-week` run since the skill was written, and Lane 1 produced a full week without needing Keith, a camera or a booked session, which is the whole reason the two-lane split exists.** Four assets drafted, pre-flighted and registered, all `scripted`, none approved and none scheduled.

**Live counts as of 2026-08-04, computed from the database rather than carried forward** (this section is the topmost dated one, so invariant 7 reads its counts and a section without them blinds the check): **18 published articles, 27 content assets, 43 renditions, 25 thumbnails owed.** Pre-flight across the 27: 23 green, 3 amber-ewa, 1 red.

| Asset | Lane | Platform | Canonical | Pre-flight |
| --- | --- | --- | --- | --- |
| `eight-hours-in-bed` | 1 | LinkedIn | `why-am-i-always-tired` | green |
| `stores-empty-first` | 1 | LinkedIn | `ferritin-blood-test` | green |
| `put-it-down-to-age` | 1 | Facebook | `14-signs-of-vitamin-d-deficiency` | green |
| `one-load-five-places` | 1 | Facebook | `signs-of-stress-in-men` | green |

Wellness was 3 of 5 picks, above the 40% floor. TOFU 3, MOFU 1. TRT zero.

**Andropause was deliberately not picked, against the skill's own default, and the reason is the state of the shelf rather than the shelf itself.** Four Pillar E derivatives drafted 2026-07-31 have been sitting on Ewa's list unanswered for four days, two of them needing nothing but a nod. Drafting a fifth adds to a queue that is not moving. Chase email drafted for Keith to send: `03_compliance/correspondence/2026-08-04-keith-ewa-pillar-e-social-chase.md`, built so the two nods can return without waiting on the two rulings.

**Pre-flight caught one real defect, and it is worth recording because of its shape.** The first draft of `put-it-down-to-age` welded the approved Vitamin D claim to the hub's recovery observation with "which is part of why", asserting a causal link the hub does not make: the hub states the claim, then separately reports what men say they notice. Fixed to two sentences, as in the source. **A compression that reads as tightening is the commonest way a derivative quietly exceeds its canonical asset**, and it is invisible to the scanner, which passed the exact approved wording either way.

**BLOCKED: the whole Substack lane, on the session token.** `SUBSTACK_SESSION_TOKEN` in `09_website-app/frontend/.env.local` is present and 82 characters, and the authenticated drafts endpoint returns `403 Not authorized` while the publication's public archive returns 200, so this is an auth failure and not a network one. Tokens last about 90 days and this one needs refreshing from a logged-in browser. **Until it is refreshed nothing can be pushed, updated, or even listed**, which also means the standing claim that all 17 pre-2026-07-27 articles have drafts waiting cannot currently be verified by anyone. `brain-fog` was the intended S-04 pick and is still the right one.

**Lane 2 skipped cleanly: no filming day booked.** Seven assets are scripted and waiting on a camera, `ep-0-baseline` among them, which gates the founder series and whose before-state stops being recordable once Keith's numbers move. Keith asked to book a day; sizing is 2 to 3 shorts or 1 long-form per session per `sop-founder-short-form.md`.

**Owed, and none of it blocks the four above:** thumbnails for the two Facebook renditions (1200x630 each, and the database refuses `scheduled` without a confirmed thumbnail), Keith's read on all four, and a ruling on whether the full `https://` link scheme now applies to Facebook as it does to LinkedIn.

## The Spine B sign-off sync did not exist, and `amber-ewa` was a one-way door (BUILT 2026-08-05)

**Migration of record: `20260805_content_assets_signoff_sync.sql`**, which adds `record_ewa_signoff(text, timestamptz)`. Script: `scripts/content-engine/signoff-sync.ts`. Tests: `scripts/content-engine/test-signoff-sync.ts`, 19 cases, wired into `content-engine-ci.yml`.

**Live counts as of 2026-08-05, computed from the database rather than carried forward.** This section is now the topmost dated one, so invariant 7 reads ITS counts and would report UNCHECKED without them; it did exactly that on the first write of this section, which is the trap the 2026-08-02 entry describes, sprung again by the same mechanism. **18 published articles, 9 planned channels, 27 content assets, 43 renditions, 25 thumbnails owed.** Of the 27 assets, **4 now carry an `ewa_signed_at`**, which before today was structurally impossible.

**The gap.** `20260801_content_state_guards.sql` lets an asset reach `approved` by either `preflight = 'green'` plus a canonical article, or `preflight = 'amber-ewa'` plus `ewa_signed_at`. `20260802_ewa_signed_at_insert_guard.sql` then protects that column with a trigger whose message says it is "written only by the sign-off sync". **Nothing was that sync.** Verified three ways on 2026-08-04: `signoff-concierge.ts` has zero references to `content_assets` (it serves `blog_articles` / `content_pipeline`), the orchestrator's `syncApprovals()` is the same, and `app.ewa_sync` appeared in no code anywhere. Every other mention of `ewa_signed_at` was a reader, a type, a comment or a test fixture.

So the second route to `approved` was unreachable, and an asset sent to Ewa could never advance however she ruled. Found the hard way: she ruled on the four Pillar E social assets on 2026-08-04, and `what-time-was-it-taken` was stuck, because she chose "leave as drafted" so its copy did not change and nothing could move it off amber. The other three had a route only because they were green.

**The design is two halves and neither is sufficient alone.** The RPC is the authorised writer: it holds `set_config('app.ewa_sync','on',true)` and cannot reach the network, so it cannot know what Ewa did. The script is the evidence gatherer: it reads the ClickUp task named in `ewa_task`, applies `isApproved()` (status complete AND every rulings-checklist item ticked), and cannot write the column itself. **Do not add a second caller of the function without reproducing the evidence check.**

**Result, 2026-08-04:** four assets signed (`handbrake-half-on`, `looking-for-a-word`, `nothing-to-buy-for-it`, `what-time-was-it-taken`). Re-run is a clean no-op, so it is safe to schedule. The guard still refuses a hand-write, verified after the migration rather than assumed.

**Two things it deliberately does NOT do.** It does not sign `instrumentation-problem`, whose review task sits on a list using an APPROVED/PENDING vocabulary rather than `complete`; refusing to guess an unrecognised status is correct, and that asset is already `done` and published by the green route, so nothing is blocked. And it records Ewa's sight on GREEN assets as well as amber ones, because an asset can be green and still personally reviewed, and leaving the signature off because the gate did not strictly need it is how a clinical review becomes invisible.

**One real bug, caught by its own test suite firing it.** The entry-point guard was written as a filename SUFFIX match, `test-signoff-sync.ts` ends with `signoff-sync.ts`, and so running the tests executed the sync against production and wrote four live clinical signatures. The writes happened to be the correct ones and were about to be made deliberately, which is the only reason this was not an incident. Now an exact basename comparison, exported as `isDirectInvocation()` so the case is testable from outside, with the regression as the first test in the file. **The general shape: a module that guards a privileged write must not decide whether it is the entry point by pattern-matching its own name, because the file most likely to import it is conventionally named `test-<itself>`.**

---

## Phase 1 passed final adversarial validation and shipped (2026-08-02)

**Three validation rounds before the push, and each one found something the previous had not.** Round 1: 8 blocking, including two skills that were missed because the sweep looked for tools that CALL the scanner rather than tools that WRITE asset files. `/hook` mints every asset file and still told itself to write `status:` and `drive:` into frontmatter; `/compliance-preflight` section 6 still said to stamp the verdict there so the scanner could read it. Both are now corrected. **Left as they were, the next `/hook` run would have recreated the dual store at the entry point of the pipeline, and `/compliance-preflight` is Guardrail #1, so it fires constantly.** Round 2: the `ewa_signed_at` INSERT hole (above) plus a stale owed item. Round 3: zero blocking, three prose minors, all fixed.

**Final state: 9 invariants PASS, exit 0; 189 tests green; scanner 13 of 13 clean; mirror dry-run 0 refused; `tsc` clean.** All three orchestrator changes to the database were verified live by the validator rather than taken on trust: the guard consolidation, the `approved_by` / `approved_at` columns with exactly one populated row, and the `preflight_date` correction on the two 2026-07-09 assets.

**Live counts as of 2026-08-02, computed from the database rather than carried forward.** There are **18 published articles**, 9 planned channels, 23 content assets, 39 renditions and 23 thumbnails owed. This line exists because invariant 7 compares counts quoted in the CURRENT section of a STATE doc against the database, and "current" means the topmost dated section. **Adding this section above the one that carried the counts left I7 with nothing to compare, and it correctly reported UNCHECKED rather than PASS.** That is the same trap recorded on 2026-08-01, sprung the same way: not by deleting an assertion, but by writing a newer section that lacks one. **A new top section in a doc I7 watches must carry its own counts, or it silently blinds the check.**

**The three minors were all one shape, and it is the phase's own.** Two asset bodies said "Drive folder not created" as an open item while `drive_url` was populated for both; one asset body justified a missing rendition entry with a scanner limitation that this same change removed; and `scheduled-agents.md` quoted a test count that had gone stale twice in two days. Each was a database-owned or code-owned fact copied into prose, already diverged, watched by nothing. The fixes deliberately do not restate the value: they point at where it lives. **A count or a URL in prose is a second copy, and the fix for a second copy is never a fresher second copy.**

## Phase 1 is BUILT and the doc layer is swept (2026-08-01)

**State no longer lives in asset frontmatter. The database owns it, and two detectors now fail the build if a copy comes back.** The file keeps identity and craft (slug, title, funnel tags, marker, canonical asset, which renditions exist, the hook and the script); `content_assets` / `content_renditions` keep every status, date, sign-off, id and URL. `content-sync` writes a marked generated block into each file so a repo reader can see where an idea got to, and that block is a mirror: nothing parses it, editing it changes nothing, and the next run overwrites it.

**The strip is 13 of 13, and the two it stopped on were the point rather than the loose end.** `2026-07-09-the-stack.md` and `2026-07-09-when-a-test-earns-its-place.md` carried `preflight_date: 2026-07-31` while `content_assets` still said `2026-07-09`. Commit `5798f66` rewrote both scripts to voice 1.2 on 2026-07-31 and re-ran the pre-flight; the database never heard about it, and on one of the two the re-run caught a real HARD compliance hit the earlier copy had carried as green since July. **So the first act of making the database authoritative was nearly to make a stale value authoritative on two assets.** The frontmatter was held intact rather than deleted while that was open, because deleting it destroys the only surviving record of that run. **CLOSED 2026-08-01:** Keith ruled the file was right, both rows were UPDATEd to `preflight_date: 2026-07-31` (verified: `the-stack` and `when-a-test-earns-its-place` both read `green` / `2026-07-31`), and only then were the keys stripped from the two files. `content-doctor` now exits 0 with all nine invariants PASS, so nothing is open on Sprint `901217968514` for this. **The ordering is the durable lesson: reconcile the disagreement first, strip second.** Stripping first would have destroyed the evidence that the database was wrong, and the detector that found it (I9) reports presence, not disagreement, so it would have gone quiet either way.

**The gates moved to the database and got stricter, not looser** (`09_website-app/database/migrations/20260801_content_state_guards.sql`). **There are THREE migrations of record, not one:** `20260801_content_assets_business_approval.sql` added `approved_by` / `approved_at`, because the split declared both database-owned while `content_assets` had neither column, and the strip would have deleted the only record of Keith's approval of `four-things-on-the-sheet` into nowhere. Caught by a validation pass before the stripper ran. **A fact declared to live in a store that cannot hold it is the phase's own failure shape produced by the phase**, one file and two values from being silent. `approved_by` is deliberately unprotected by a trigger and deliberately outside the CHECK constraint: Keith's approval is a human act with no system behind it, so protecting it would imply a sync that does not exist, and requiring it would either reject the twelve assets that predate the convention or invite a backfill of invented approvers. Two routes to `approved`: green pre-flight plus a canonical article to inherit clearance from, or `amber-ewa` plus `ewa_signed_at`, which only the sign-off sync may write. A rendition is refused `scheduled` while its asset is unapproved, while its canonical article is unpublished, or without its thumbnail, and refused `published` without an `external_url`. **Both GATES fire on INSERT as well as UPDATE**: a gate reachable by creating the row already past it is not a gate. The plan's own §4 had this wrong and is corrected in place: it demanded `ewa_signed_at` on every asset, which would have blocked the entire inheritance lane. The third migration is `20260802_ewa_signed_at_insert_guard.sql`, described in the next paragraph.

**The `ewa_signed_at` write-protection was `BEFORE UPDATE` only. Found by validation on 2026-08-01, CLOSED 2026-08-02** by `09_website-app/database/migrations/20260802_ewa_signed_at_insert_guard.sql`, applied as ledger version `20260802003954`. Section 3 of the 20260801 migration created `content_assets_ewa_signed_at_guard` on UPDATE alone, while the approval CHECK trusts the column it protects. So an `INSERT` could carry a hand-typed `ewa_signed_at` and land straight at `status = 'approved'` on the amber-ewa route, without the sign-off sync ever running. Proved by a rolled-back probe: the INSERT succeeded, the equivalent UPDATE was refused. **This was the one place the migration's header argues for INSERT coverage and then does not ship it.** The trigger is now `before insert or update`, verified live: `pg_get_triggerdef` reads `BEFORE INSERT OR UPDATE ON public.content_assets`, and the round-1 probe now raises `ewa_signed_at is written only by the sign-off sync … via INSERT`. **The NULL-safe rewrite went a different way to the one first suggested, and the difference is worth keeping.** `coalesce(new.slug, old.slug)` would have been a second encoding of a case that cannot arise: `OLD` is not assigned at all in a `BEFORE INSERT` trigger, and `NEW.slug` is populated on both paths, so the function branches on `tg_op` instead and reads `new.slug` unconditionally. It remains a speed bump against accident rather than a security boundary (the service role can write anything either way), and the two real gates are unaffected.

**The ledger holds FOUR entries for 2026-08-01/02 and `database/migrations/` holds three files, and that is recorded rather than left to be re-discovered.** Ledger `20260801192846 content_state_guards` is the FIRST DRAFT of the guards migration, the one that added a parallel second copy of the rendition gate; it has no file of its own because `20260801193335 content_state_guards_consolidate` superseded it in the same session and `20260801_content_state_guards.sql` is that consolidated version. Both migration headers now say so. Replaying the directory in filename order reaches the correct end state (20260801 is idempotent, 20260802 does a `create or replace` plus a re-created trigger), but the directory and the ledger do not agree on how many migrations ran, and the file that argues hardest for gates being verifiable from the record should not be the one whose record needs explaining.

**Two guards so both of these come back loudly rather than quietly** (`test-content-doctor.ts`). First, **EVERY FILE IN `database/migrations/` IS TRACKED BY GIT** — the 20260802 file was applied to production and left untracked, which is round-1's `db-owned-keys.json` failure recurring on the file that fixes round-1's guard hole, and a working tree that already holds the file can never reveal it. Second, **EVERY MIGRATION THAT TOUCHES `content_assets` / `content_renditions` IS NAMED IN THIS FILE** — the 20260802 migration shipped and no doc anywhere mentioned it, so the paragraph above still claimed the hole was open while the database said it was closed. A migration this workspace's gates depend on must appear in this workspace's volatile-status doc, and the test names the file that is missing. Both list the migrations from DISK rather than from a hard-coded array, because a hard-coded list is one more thing to forget on exactly the commit that adds a migration, and both were mutation-checked: the first fails on the real untracked file before it is staged, the second fails naming `20260802_ewa_signed_at_insert_guard.sql` when that name is removed from this file. **126 doctor tests (was 124), 38 content-sync tests and 25 cron tests: 189 in all, green as of 2026-08-02**, and `content-doctor` is exit 0 with all 9 invariants PASS.

**`scan.js` was narrowed to what a repo-only reader can honestly verify**, and it lost gates G1 to G4. It now checks the frontmatter schema, YAML safety, the compliance HARD table and the em-dash rule, and it HARD-fails a database-owned key found in frontmatter, naming the owning column. **One capability was genuinely lost: G1**, "a `scripted` asset has a script in the body", needs the body from git and the status from Postgres, so no single store can check the pair. It is a human check now and `/content-status` says so rather than implying a gate. Whether it becomes doctor invariant 10 is Keith's call.

**Two things the split introduced that nothing watched. The first is CLOSED, the second is still open.** First, the database-owned key list existed **three** times, in `scan.js`, in `content-doctor.ts` and in `content-sync.ts`, and they had already diverged on the day they were written: the scanner refused `unipile_account` and `thumb_confirmed` and the doctor did not, and **the doctor is the nightly automated alarm while the scanner is hand-run, so the weaker list was the one nobody has to remember to run.** That was section 2's failure shape produced by the work removing section 2's failure shape. **CLOSED 2026-08-01** by Keith's ruling (consolidate, the strict superset wins): the one definition is now `.claude/skills/content-status/db-owned-keys.json`, all three consumers import it as a real build-time import rather than by parsing each other's source, and `test-content-doctor.ts` runs the real scanner over a fixture carrying every watched key to prove the two derivations still agree. A further test asserts the JSON is **tracked by git**, because a data file is exactly as easy to leave untracked as a source file is hard to, and this repo stages by path. Second, still open: **which renditions exist is now the file's job and nothing compares that set against `content_renditions`**. Already live: `2026-07-19-substack-welcome-normal-on-paper.md` has no renditions block while the database holds a `substack/newsletter` row for it. No entry was invented to quiet it, because inventing craft to satisfy a detector is the failure this phase removes. **Owed: a tenth invariant, or an honest note that nothing checks it.**

**The doc sweep found a live regression that no detector sees, and it was shipping nightly.** `content-library-sync.ts` had not been repointed: it still read `status` out of the asset file's frontmatter, with `|| 'idea'` as its fallback. That key was gone from eleven of the thirteen files, so the daily `content-engine.yml` run was writing **`idea` into the ClickUp Content Library task for every correctly-stripped asset**, and rendering the rendition table's status, url and publish_date columns empty. **It failed silently and plausibly**, which is the worst shape available: the fallback was written for a genuinely new asset and cannot distinguish one from an asset whose status simply moved house, so the mirror reported a real-looking value rather than an error. `content-doctor` could not catch it, because no invariant reads the ClickUp mirror, and the sweep only caught it by checking whether a sentence in a doc was true rather than assuming it. **CLOSED 2026-08-01 in this same change:** `content-library-sync.ts` now reads status, pre-flight, drive and every rendition state from `content_assets` / `content_renditions`, takes identity and craft from the file, and the `|| 'idea'` fallback is gone. An asset with no database row, no frontmatter, or a status outside the ClickUp list's vocabulary is **refused and named**, not pushed with a plausible substitute; a run that read zero asset files exits non-zero rather than reporting a clean mirror. It imports the frontmatter-to-column map from `content-sync` rather than retyping it. **Still true, and it is the durable part: the Content Library list is a mirror, not a status source.** Read `/content-status` or the database.

**Docs swept the same day, because a decision is not done until the doc layer is.** `assets/README.md` (rewritten), `content-library-build-spec.md` (banner plus the goal, architecture, schema, gates, D2/D3/D5 and the success test corrected in place, with the v2 wording kept where it is the record), `templates/asset-file.md` (schema v3), `sop-founder-short-form.md`, `sop-thumbnail.md`, `sop-weekly-run.md`, `sop-compliance-route.md`, `unified-content-calendar.md` §2 and §3, `content-queue.md`, `content-funnel-map.md`, the automation plan's header, §2, §4 and §5, plus dated correction markers in `06_marketing/STATE.md` and `09_website-app/STATE.md`. The 2026-07-13 "Content Library BUILT (git-first tracker)" entry further down this file carries a SUPERSEDED marker rather than being rewritten: it is the design Phase 1 reversed and it should keep saying what was believed then. Same for the 2026-07-28 "transition window is open" bullet, which correctly predicted this drift four days before it happened.

**Two docs were found still wrong and deferred to avoid colliding with parallel edits. Both are now CORRECTED (2026-08-01).** `CONTEXT.md` read-order item 7 said the asset frontmatter "is the status record (status, funnel tags, preflight result, renditions); the gate scanner enforces the transitions", contradicted by its own Phase 1 section a hundred lines further down, and its skills table called `scan.js` "the gate scanner. The floor under every transition." Both now point at the Phase 1 section and at the database constraints; item 7b's "Phase 0 is not built yet" line went with them, since Phase 0 and Phase 1 are both built. `12_operations/sops/content-machine-verification.md` step 4 said "check the gate scanner did its job: no `approved` asset without a green pre-flight plus a canonical asset"; it now names `content_assets_approval_gate` as the CHECK constraint, says plainly that this cannot be verified by reading frontmatter, and points at doctor invariant 5 as the weekly reading. **The lesson worth keeping: a known-wrong line left in the one file every agent is required to read is the highest-traffic possible place for it, and "recorded in STATE.md" is not a fix.** Deferring a doc correction to avoid an edit collision is reasonable exactly once, and only if it is picked up before the change ships.

## The doc sweep missed the TOOLS, which is the half that writes the files (2026-08-01)

**Phase 1 swept the docs and left the two skills that mint and stamp asset files still instructing the dual store.** `/hook`, which creates every Spine B asset file, still said to write `status: hooked` and `drive: pending` into frontmatter, and told the reader the scanner would require the Ewa route before `approved`, which it no longer does. `/compliance-preflight`, Guardrail #1 in the root `CLAUDE.md` and the skill that fires before anything external-facing ships, still said to stamp `preflight`, `ewa_task` and `preflight_date` into frontmatter "so the gate scanner can read it". Neither file was touched by the Phase 1 changeset.

**The detectors would have caught the damage, but only after it was done.** The first `/hook` run after the push produces a file that `scan.js` HARD-fails as `[STATE]` and that turns the nightly doctor red. **I9 and `scan.js` police asset FILES; nothing policed the TOOLS that write asset files**, and a sweep that reads docs finds docs. Both skills are corrected: they now write the `content_assets` column, name `db-owned-keys.json` as the refused list, and say plainly that the approval gate is a database CHECK constraint that cannot be satisfied from frontmatter.

**The guard is a new test, `NO SKILL TELLS AN AGENT TO WRITE A DATABASE-OWNED KEY INTO FRONTMATTER`.** It takes the key list from `db-owned-keys.json` (never a fourth copy), scopes itself to the skills that name `content-machine/assets`, extracts every backticked `key: value` literal naming a database-owned key, and requires the set to equal a reviewed allowlist with a reason per entry. **An allowlist rather than a cleverer regex**, because the first attempt matched imperative verbs near a key and missed two of the four real defects: a bare bullet reading `status: hooked` inside backticks has no verb, and "do not lose the asset. Set `drive: pending`" is exempted by its own neighbouring negation. Mutation-checked against the pre-fix files: it fails naming all of them. A second test asserts `db-owned-keys.json` is **tracked by git**, since the whole consolidation rests on one untracked data file and this repo stages by path.

## Phase 1: the doctor gains I9, and it FAILS on its first run (2026-08-01)

**There are now 9 invariants, and the live run is exit 2, not exit 0.** I9 says no asset file's frontmatter may carry a key the database owns, and on its first run it found two files the Phase 1 strip missed: `assets/2026-07-09-the-stack.md` (20 keys) and `assets/2026-07-09-when-a-test-earns-its-place.md` (14 keys). Both still carry `status`, `preflight`, `preflight_date`, `ewa_task`, `drive` and a per-rendition `status` / `url` / `publish_date`, **and both already disagree with the database**: the file says `preflight_date: 2026-07-31`, the generated block above the fold says `green (2026-07-09)`. Two copies of one fact, one of them updated, no alarm, on day one. **This is the invariant working, not a regression in it**, and clearing it is a frontmatter edit on those two files, not a change to the doctor. The other 8 invariants still PASS.

**I9 asks the database nothing, deliberately.** Whether the file's copy agrees is beside the point: an agreeing copy is still a copy, and it is the one that quietly stops agreeing later. Presence of the key is the violation, so an empty `ewa_task:` fails too, because an empty slot is a home waiting to be filled. Both spellings are watched, the old frontmatter name and the database column name, since a fact copied back as `drive_url` is the same second copy better disguised. Scope is `assets/` only: a batch draft under `drafts/` carries the batch's own record and CONTEXT.md puts it outside the rule, so the report states the exclusion rather than leaving it as a silence.

**I2 was narrowed to what it can still see, and says so in its own title.** `status`, `preflight` and the per-rendition `status` / `publisher` have left the frontmatter, so part 2a has no subject for them; it now reads IDENTITY only (`content_type`, `funnel_stage`, `awareness`, `cta`, and each rendition's `platform` / `format` / `thumb`), prints how many values it compared, and goes UNCHECKED if that number is zero. **Part 2b did not narrow**: it compares live database values against `scan.js`, so it still covers both status vocabularies, which is worth knowing before someone "restores" the state keys to make I2 feel complete. The one-directional limit is unchanged: this client can prove a value ACCEPTED, never REFUSED, because PostgREST cannot reach `pg_constraint`.

**I1 kept every hard-won behaviour and gained one guard.** The Substack republish exemption, the UNLINKED vs DATABASE-ONLY distinction and the derived-message rule are untouched; the only frontmatter key it reads from an asset file is `slug`, which is identity and stays. New: **the generated state block is stripped before I1 asks whether any file mentions a slug.** CONTEXT.md says the mirror is never an input, and a mirror answering "yes, this slug appears in the repo" would be the row vouching for itself with a copy of itself.

**124 doctor tests (was 100), 38 content-sync tests and 25 cron tests: 187 in all, green as of 2026-08-01.** I9 is tested in both directions, and the suite was mutation-checked: disabling the key scan turns 4 tests red. Count them from a run, not from this line; it is a dated reading, and the last three times this number was carried rather than measured it was wrong.

## Invariant 3 is WIRED, and the doctor reaches exit 0 for the first time (2026-08-01)

**All 8 invariants now PASS. The nightly baseline moves from exit 3 to exit 0**, and every doc and comment asserting the old baseline was swept in the same change (`content-doctor.ts` header, `content-doctor-cron.ts`, `12_operations/sops/content-machine-verification.md`, `12_operations/automation/scheduled-agents.md`, the plan's §5 item 3). Supersedes the "expected baseline is exit 3" line further down this file.

**The credential was never actually missing.** It sat in the repo-root `.env` alongside Unipile, DataForSEO and Unsplash, while `loadEnvLocal()` read only `frontend/.env.local`. So the doctor reported "no Metricool credential is loaded" and was telling the exact truth about its own environment while the secret was two directories up. **A credential that exists but is unreachable is indistinguishable, from inside the process, from one that does not exist** — and the honest UNCHECKED is what made it cheap to find.

**Fixed by layering the loader, not by copying the secret.** `loadEnvLocal()` now reads `.env.local` then the repo-root `.env`, never overwriting, so precedence is real env > `.env.local` > root `.env`. Copying the token into both files was the obvious move and the wrong one: two copies of one secret, rotate one, the other goes stale silently, nothing watching. That is §2 of the plan reproduced in the credential layer, and it would have been introduced by the work fixing §2. Token renamed `METRICOOL_API_KEY` -> `METRICOOL_USER_TOKEN` to match both the API's own parameter name and what the doctor already documented; `METRICOOL_USER_ID` (5106073) and `METRICOOL_BLOG_ID` (6633045) added beside it. `keith.antony.ai` turned out to be the brand LABEL on that profile, not a fourth credential.

**The design decision that matters: per-post lookup, not the date-windowed list.** `GET /api/v2/scheduler/posts/<id>` answers 200 or 404 for a single id. The list endpoint requires a start and end date, and any post scheduled outside whatever window we picked would have read as MISSING — which on this invariant means drift, i.e. **a false alarm on a gate**. The six X posts publish from 2026-08-03 and it is unverified whether published posts stay in the list feed, so the windowed version would have been a coin-flip three days from now. A single-id lookup has no window to get wrong. **404 is drift; a timeout, a 500 or anything else is UNCHECKED, never missing.**

**Verified against the live account, both directions:** 7 renditions carry a Metricool id, Metricool returns exactly those 7, no strays either way. Among them is `356521803`, the LinkedIn id that changed three times on 2026-07-31 (356516876 -> 356519886 -> 356521803) and silently staled both stores — the incident that put this invariant in the plan is now the case the test suite pins. 100 doctor tests (was 88) plus the 25 cron tests, all green.

**Honest caveat.** I3 passes on 7 ids that are all still `scheduled`. It has never been exercised against a `published` one, because nothing Metricool-published has gone live yet. The first real test is 2026-08-03.

## Phase 0 of the automation plan is BUILT: `content-doctor` runs, and its first run found 22 violations (2026-08-01)

**The doctor exists, is tested, and has been run against live data. Nothing else in the plan is built.** Script at `09_website-app/frontend/scripts/content-engine/content-doctor.ts`, 66 tests beside it, wired into `12_operations/sops/content-machine-verification.md` as step 0 and queued (not yet scheduled) in `12_operations/automation/scheduled-agents.md`. **Uncommitted as of this entry.**

**First real run: exit 2, 22 violations across 8 invariants (3 PASS, 4 FAIL, 1 UNCHECKED).** The three findings that matter:

- **Nine live articles were serving dead editorial markers, and eight survived verification.** The plan's §1 recorded _two_. Five distinct wordings, including `{/* TODO: Ewa sign-off required before publish */}`. **They were never publicly visible, and that was checked rather than assumed:** JSX comments are stripped at render, proven by fetching `myth-of-normal-range`, whose benign `{/* CTA BLOCK */}` is still in the database and returns zero hits in the served HTML. So the exposure was in the **source of truth**, not on the page. That does not make it benign: a stored body asserting an unmet condition is what a future reader, a mirror sync, or an AI crawler of the raw body reads as current, and it is what let a human audit conclude the set was three when it was eight. One is `14-signs-of-vitamin-d-deficiency`, which `03_compliance/STATE.md` separately calls the weakest sign-off trail in the blog set: a published body asserting its own sign-off is still owed, on the article least able to afford it. **Owed: strip all eight from `blog_articles.body`.**
- **10 `content_assets` rows have no asset file.** Seven X posts are **unlinked** (their copy is in `drafts/x-week-2026-08-03.md`, but that draft names no slug and the rows name no draft, so neither store can find the other) and three Substack rows are **database-only**. This is the exact 2026-07-31 failure running in reverse.
- **The gate scanner is behind the schema.** `content-status/scan.js` HARD-rejects `platform: substack`, `platform: x` and `format: newsletter`, all of which the DB check constraints accept and live rows carry. Known since 2026-07-19 in an asset file, never fixed. **Fix `scan.js` before anything else, because it is the deterministic floor under every transition.**
- **Invariant 8 caught one nobody had specified:** `substack-free-androgen-index` sits at `preflight: red` / `to-produce` while carrying an `external_post_id`. Either it shipped or the id is spurious.

**Two blockers were found by adversarial verification and fixed, and both were this repo's own signature failure reproduced inside the tool built to detect it.** The doctor reported PASS on invariants whose table returned nothing (§1's "rendered a failed fetch as 0", living inside its own fix), and it had no reachable green, so a nightly run would have alarmed every night forever and trained its reader to ignore it, which is precisely how the SOP it plugs into came to be never run. **Verdict after four rounds: fit to wire.** The verifier proved every live PASS is a real measurement by constructing the violating case and confirming it fails.

**The rule that came out of it, worth keeping:** every check resolves to **PASS / FAIL / UNCHECKED**, never a binary, because a binary forces every unperformed check to be reported as one of the two things it definitively is not. Exit 3 (no failures, not everything measured) is the expected nightly baseline until a Metricool credential exists. **Alarm on `exit_code === 2` or `unchecked_unexpected > 0`, never on `$?`.**

**Building it found four defects in the plan's own invariant list**, now amended in place with the originals marked: invariant 1 contradicted the batched-channel rule, 2 overstated what it could prove, 3 taken literally demanded Metricool resolve Unipile ids, 5 contradicts `scan.js` G2 on `amber-ewa` and is **left unresolved and visible, to reconcile before Phase 2**, and 7 needed scoping to the current section. **A spec is a hypothesis until something executes it.**

**Live counts as of 2026-08-01, stated here so invariant 7 has something to check.** There are **18 published articles**, 9 planned channels, 162 grid slots, 23 filled, backlog 139, and 23 thumbnails owed. Computed from the database, not asserted from memory.

_Why this line exists at all, which is worth more than the numbers._ Rewording the sentence above to dodge a false positive removed the last current count assertion in this file, and invariant 7 went straight to **UNCHECKED** rather than to PASS. The doctor was right: a check with nothing to compare has not passed, it has not run. **Dodging a checker by deleting the thing it checks is the failure mode this whole plan exists to prevent, and it took ten minutes to commit it accidentally.** A doc with no assertions in it is unfalsifiable, which reads as clean.

### Fixes applied against the doctor's findings (2026-08-01)

Violations **22 → 11**, invariants **3 PASS → 5 PASS**. Worked in the doctor's own priority order, re-running it after each.

**Fix 1, the eight editorial markers. DONE, I6 and I7 now PASS.** All eight audited against ClickUp `901218140081` rather than inferred from the artefact: all eight dead. Seven have a completed review task closing **before** the article published; `14-signs-of-vitamin-d-deficiency` is covered by the 2026-05-27 blanket email. Stripped from **both** `blog_articles.body` and the MDX mirror, verified by per-article length delta (every delta matched exactly one marker, no collateral). Zero obligation markers remain in any of the 18 bodies; all 15 `<ClinicalInsight>` blocks intact.

**The substantive question the markers were pointing at is now with Ewa, task `869echt3n`.** Eight articles carry a **first-person quotation attributed to her** that was drafted for her, not by her, each sat beside a note saying "rewrite in her own voice, or remove, before publish". Her sign-off on the articles is not in doubt; the open question is whether she is content to be quoted saying those words verbatim. **The task was rebuilt after being created wrong:** the eight questions went into a description table, which is exactly the hole `signoff-concierge` exists to close ("a hand-written comment and a bare 'complete' silently answered it yes"). They are now nine checklist items under _Rulings required before approval_. **Note it will not be mechanically enforced**, because a hand-made task is not watched by `syncApprovals`. Seven further articles carry an unmarked attributed quote and are on the checklist as a separate question.

**Fix 2, the scanner vocabulary. DONE, I2 now PASS.** `content-status/scan.js` accepted 5 platforms and 5 formats where the DB constraints accept **12 and 11**. Widened to mirror the constraints in full, not just the three live values (`substack`, `x`, `newsletter`), so the next channel added does not repeat this. **The rule is now written into the file:** these arrays mirror `content_renditions_platform_check` and `content_renditions_format_check`, they are not a list of channels in use, and they change in the same edit as the constraint. The old arrays were **not** left commented out above the new ones, which is the specific trap the doctor guards against and the one this edit invites.

**Fix 3, the ten rows with no file. DONE, I1 now PASS.** Two different problems under one label. **Seven X rows were a LINKAGE defect, not a missing artefact:** the copy was in `drafts/x-week-2026-08-03.md` all along, but the draft identified posts by `batch`/`queue_row` and the rows by slug, so neither store could find the other. Each post now carries a `slug:` line and the rule is in `CONTEXT.md`: **a batch draft without per-post slugs is only half-registered.** **Three Substack rows are the model working, not a gap** (Keith, 2026-08-01): a verbatim republish has no craft of its own, the canonical article is the craft. The exemption is narrow on purpose, and the control case proves it: `substack-welcome-normal-on-paper` **does** have a file, because it was net-new founder copy rather than a republish.

**Fixing that exposed a worse defect in the doctor than the finding it was about.** After the slugs went in, the seven rows still reported UNLINKED, because the message "that draft names no slug anywhere" was **hardcoded into a branch that never checked**. Invariant 1 could never have gone green on a batch channel whatever anyone did. Same shape as the two original blockers, in a branch that was dead code when the verifier audited it. It triggered an audit of every composed message: **four more asserted conditions the code never evaluated**, including invariant 3's reason, which had a hand-observation about `.env.local` baked into a runtime string that would have rotted in silence. **Every message is now derived, not asserted.**

**Fix 4, the retracted FAI post id. DONE, I8 now PASS.** It shipped 2026-07-26 and was **retracted 2026-07-30** on Ewa's instruction. The rendition was rewound to `to-produce` with `external_url` and `published_at` cleared, but `external_post_id` was left behind, so the row asserted publication evidence for something not live. Cleared; **no evidence lost**, because the id is the slug inside the retracted URL already recorded in the asset notes. **Root cause, still open: `content_renditions.status` has no `retracted` state**, so a retraction is modelled by rewinding, which loses the fact it was ever live except in prose.

**Fix 5, the amber-ewa gate. RECONCILED (Keith, 2026-08-01), and it closes a real hole.** The plan said non-green blocks scheduling; `scan.js` G2 accepts `amber-ewa` with a non-empty `ewa_task`. **Neither was right: a non-empty `ewa_task` proves a question was ASKED, not answered.** G2 let an asset reach `approved` on the routing alone, G3 then let its rendition reach `scheduled`, and X week 1 is scheduled with `autoPublish: true` — so an asset merely routed to Ewa would have published on a timer before she ruled. **The gate is now the task's COMPLETION**, checked against ClickUp by the doctor. `scan.js` keeps the weaker repo-only check with a comment saying it is deliberately weaker, so nobody later harmonises the two in the wrong direction.

The doctor reuses **`isApproved()` from `clickup.ts`**, the repo's single definition of "Ewa approved", rather than writing a second one: that helper also requires no unresolved rulings, because on 2026-07-29 the andropause hub was approved by bare completion with two CA-028 rulings asked twice and never answered. **It only calls ClickUp when an amber asset actually has a scheduled rendition** (today: zero, so no network call), and an unreachable ClickUp is **UNCHECKED, never PASS**.

**Honest caveat on the clean board.** Seven invariants pass because the drift was **fixed**, not because the doctor stopped looking, and each was confirmed independently by `grep` or SQL rather than by the detector agreeing with itself. But **invariant 5's new gate has never been exercised against live data**: all 12 scheduled-or-later renditions sit on green assets, and all four amber assets have zero scheduled renditions. It is proven by twelve tests and nothing else. The first time it matters is the first time an amber asset gets scheduled, which is exactly the `autoPublish: true` scenario it was written for.

**Sixth fix, found by accident while verifying the other five: `scan.js` gave a green light having scanned nothing.** Run from any directory other than the repo root it resolved no asset paths, scanned **0 files, and exited 0**. Its guard required `!files.length && !missing.length`, so a wrong cwd populated `missing`, skipped the guard entirely, and passed. The summary line correctly withheld "Pipeline gates clean", but the **exit code** did not, so any caller doing `scan.js && proceed` was waved through by a gate that checked nothing. **This is the exact defect adversarial verification caught in the doctor before it shipped, sitting unnoticed in the gate scanner the doctor depends on.** Now exits 1 with the unresolved path named and the cause stated. Verified both ways.

**Known limitation, logged not fixed:** `unresolvedRulings` credits a **ticked** checklist item, not one answered by appended text. Ewa answers by writing (the FAI re-opt showed this), so a written-but-unticked answer would read as not-approved. That fails safe on a gate, but it is a possible false violation; passing the ruling texts through would close it.

### The doctor now RUNS: nightly, machine-side, registered 2026-08-01

**It was one directory change away from becoming the next never-run check.** Documented as step 0 of a weekly SOP and fired by nothing, which is the precise state §5 diagnoses as fatal, and which `content-machine-verification.md` had already proved by never being run once. `content-doctor-cron.ts` + a `.cmd` wrapper now run it nightly on **Windows Task Scheduler** with `StartWhenAvailable`, logging to `%LOCALAPPDATA%\andro-prime\content-doctor.log`. Alarm rule: **exit 2 or any unexpected UNCHECKED**, never exit 3 with zero unexpected gaps. On alarm it opens **one deduplicated ClickUp task** on Sprint `901217968514` and comments on it thereafter; on recovery it comments and **does not auto-close**, because a task closing itself is indistinguishable from nobody looking. 25 new tests, 113 total. Verified end to end by invoking it exactly as the task does: exit 3, no alarm, `agent_runs` row written.

**§7's routing rule was wrong and is corrected, and the corrected version is more useful.** It asked "does the job touch Drive". The real question is **"can an agent do this through MCP, or does it need a tested script holding a credential?"** — because **a connector is reachable by an agent, not by a process.** A cloud routine has no env or secrets field and no `.env.local`, so `SUPABASE_SERVICE_ROLE_KEY` cannot reach the script by any route, and rebuilding eight invariants as agent prompts would discard 88 tests for a gate. **General rule now written into the plan: put determinism where the stakes are.** A gate that decides whether something ships must be a tested script, and a tested script must run where its credentials live. Plumbing that only advances an already-approved thing can be agent work in the cloud, because a wrong answer there is visible and reversible.

**Two things found while wiring it, both worth keeping.** `schtasks` cannot set the missed-run catch-up, so a plain daily task **silently skips** if the machine is asleep — a check that never fires looks exactly like a check that passes, so it was registered via PowerShell instead. And **the Task Scheduler enumeration API is broken on this machine**: `Get-ScheduledTask`, the COM service and `schtasks /Query` all return `0x8007054F` for _every_ task. Verify by reading `C:\Windows\System32\Tasks\<name>`, which is XML; do not read a failed query as a missing task.

**Open decision (Keith):** `agent_runs.status` is a three-value enum, so doctor exits 2 and 3 both log as `blocked`. Separating them needs `ALTER TYPE agent_run_status ADD VALUE 'incomplete'` plus one line in `_shared.logRun`. Additive, nothing breaks, but it is a production migration and was deliberately not run.

## DECISION (Keith, 2026-07-31): LinkedIn gets a second lane, vertical video, in addition to text

**LinkedIn runs vertical short-form video and it is Keith's preferred format there.** It was not representable: `content_channels` held exactly one LinkedIn row (`text-post`), so a LinkedIn video had no column on the atomisation grid and no rendition could show against it.

Added as `linkedin / short`, lane 2, `in_plan: true`. **Format is `short` rather than `reel` or `video` deliberately**, so it groups with `tiktok/short` and `youtube/short`: the same 9:16 export serves all four surfaces and it inherits `thumb_spec: 9x16`. `sop-thumbnail.md` gains `linkedin-short-9x16.png`, and the board's prompt composer gains a `linkedin:short` mode.

**The honest effect on the number: coverage falls from 16.0% to 14.2%, and nothing was lost.** The grid is now 18 articles x 9 planned channels = **162 slots, 23 filled, backlog 139** (was 144 / 23 / 121). The percentage dropped because the plan got bigger. Same as when X joined on 2026-07-29.

**Seeded `in_plan: false` first, then flipped after Keith's decision**, following the X precedent: a channel that arrives without a lane shows on the board as such rather than silently moving the denominator before anyone has chosen.

**UNVERIFIED and worth one test before this lane is relied on.** Metricool's `createScheduledPost` accepts video URLs in `media` and its `linkedinData` has no video type, so a LinkedIn video post should simply be a post carrying a video. No real LinkedIn video has been scheduled through it. Confirm with one test post.

**Publisher drift recorded rather than papered over.** The `linkedin/text-post` row declares `unipile`, and the two published posts did go via Unipile, but `four-things-on-the-sheet` was scheduled 2026-07-31 via **Metricool**. Both are live routes to the same profile and the row's single `publisher` field cannot express that, so treat it as the default and read the rendition's own `publisher` for what actually shipped.

## The four andropause derivatives are with Ewa, and the video lane's real blocker is thumbnails (2026-07-31, later)

**All four submitted, one task each on Content Review `901218140081`.** One task per asset rather than one batch, because `ewa_task` is a single field and completing a task has to sign off exactly one asset; batching would rebuild the ambiguity behind the two false escalations already on record. Pre-flight run as an owner action, independent of the drafter: scanner clean on all four.

| Asset | Pre-flight | Task | Her ask |
| --- | --- | --- | --- |
| `nothing-to-buy-for-it` | amber-ewa | `869ecg9j6` | 1 ruling, 1 nod |
| `what-time-was-it-taken` | amber-ewa | `869ecg9jd` | 1 ruling |
| `looking-for-a-word` | green | `869ecg9rt` | nod only |
| `handbrake-half-on` | green | `869ecga1e` | nod only |

The review corrected the drafter twice. **The 12 nmol/L threshold is a provenance problem, not a context one:** hub line 220 carries "(Hackett et al., 2023, BSSM guidelines)" and the rendition does not, so on a brand page it reads as our threshold rather than BSSM's, which means the pre-written no-number fallback may be the wrong fix and carrying the citation in-line the right one. **Kit 1 scoping on `handbrake-half-on` is CLEAR**, more strongly than the drafter argued: Kit 1 is never named, shown, linked or used as the CTA, and the causal denial is spoken at the moment of maximum risk so it survives muted playback. Two findings nobody had logged: `what-time-was-it-taken` puts the confirm-on-a-second-morning-test rule about fifteen seconds before the founder reveal and a test CTA, and confirmatory testosterone testing is post-CQC only; and "a session that used to cost you one day of soreness now costs three" is a ratio absent from the hub, so "zero net-new claims" was not quite true. **Keith's, not Ewa's:** that ratio, and "I waited about two years" which reframes CA-029 (two years being dismissed, not two years waiting).

**Drive folders created for the four assets that had none**, on the BUSINESS account via `gws`, matching the existing convention `Content/YYYY-MM/<slug>/{raw,final,thumb}/`. All seven assets carrying video renditions now have a folder; three did before. **The two Drive routes authenticate as different Google accounts** and this is now a rule, not a preference: `gws` is keith@andro-prime.com and holds the real tree, the Drive MCP connector is keithantony5@gmail.com and holds an empty `Content` folder of the same name created the same day. Drive writes go through `gws`; the connector is for reads.

**Thumbnails, not the shoot, are the binding constraint on the video lane.** 23 renditions need a cover and none has one. Keith's ruling: size standardises, creative does not, so `sop-thumbnail.md` now names one file per rendition (`<platform>-<format>-<thumb_spec>.png`) instead of one per size. The old size-keyed convention made three different 9:16 covers unstorable and would have satisfied the gate with one file while two surfaces silently shared a cover nobody chose. Caught before any thumbnail existed, so no migration. **A gate already exists and is honour-system:** `content-status/scan.js` G3 blocks scheduling on `thumb_confirmed`, a boolean typed into frontmatter, with no Drive check and no matching database column.

**`content_assets.cta` widened to accept `canonical-article`.** The value was added to `content-funnel-map.md` earlier the same day and never to the check constraint, so the database refused the value the docs prescribe. Purely additive; all 19 existing rows still valid.

**Coverage 18 to 23 of 144 slots (12.5% to 16.0%)** once the four were registered. (Denominator moved again the same day: LinkedIn gained a vertical-video lane, so the grid is 162 slots and 23 filled reads 14.2%. See the LinkedIn decision entry above.) They had no `content_assets` rows at all until this session, so they were invisible to the board and to `/content-status` while sitting scanner-green in the repo.

**NEW `content-pipeline-automation-plan.md`, APPROVED by Keith 2026-07-31. Nothing built.** Written from where the session's hours measurably went, which was reconciliation between three hand-synced stores and not drafting. Governing rule: automate the plumbing, never automate a gate. Phase 0 is a doctor script asserting every invariant, before any automation, because building on a silently drifting system multiplies the drift.

**Approved as the plan of record, with the build deliberately not started.** The phasing in §5 is the build order and **Phase 0 (`content-doctor`) is the next thing to build; it does not exist** — no such script anywhere in the repo, checked. The one decision left open at approval is settled: **the Metricool step creates DRAFTS, and the draft-to-live flip stays a human action** (§7.1). Recorded as a standing decision rather than a probation period, so relaxing it later is a fresh decision rather than a default quietly expiring. §7.2 (`pg_cron`) is not open: the machine-side recommendation removes the need for it.

**Revised the same day, after approval, and the revision moved the recommendation.** §7 recommended building everything machine-side, on the strength of an unverified line that claude.ai connectors "may be absent headlessly" in a cloud agent. Checked: it is backwards. A **routine** attaches connectors explicitly by `connector_uuid`, and Metricool, Supabase, ClickUp and Google Drive are all already connected, so three of the four integrations run in the cloud with **no new credential**. Recommendation is now **split per job**: the doctor, the ClickUp sign-off poll and the Metricool scheduling step are cloud routines; **only the two Drive jobs stay machine-side**, because `gws` is a local binary and, more dangerously, the Drive MCP connector authenticates as the **personal** account holding the empty decoy `Content` folder, so a cloud routine wired to it would create folders on the wrong Drive with every check passing. Three constraints recorded with it: routines have a **one-hour minimum interval** (the plan's "fifteen minutes" is not available), a routine **cannot read `.env.local`** so `content-doctor.ts` needs either injected secrets or the Supabase connector instead of the service-role client, and **`CronCreate` is not a scheduler** (session-only, dies with the session, 7-day expiry). `pg_cron` **dropped entirely, not deferred**. **No routines exist yet** (`RemoteTrigger list` empty), which confirms `12_operations/automation/scheduled-agents.md` is accurate that every cadence is manual.

**The doctor's home is decided: three layers, three workspaces.** Invariant list stays here (this workspace owns what "correct" means); the script goes to `09_website-app/frontend/scripts/content-engine/content-doctor.ts` next to `reconcile-coverage.ts`, which is the same species of cross-workspace reconciler; the cadence goes to `12_operations`, which holds no code today and should not become the first place it does. **The rule that decides any future piece: does it need the service-role key?** If yes, content-engine; if it only reads repo markdown, the skill (as `content-status/scan.js` does). And it is **not a new operational job**: `12_operations/sops/content-machine-verification.md` step 3 is its manual prose form, already in `weekly-ops.md`, **never once run**, which is how Substack published for ten days unnoticed. Rewrite that step to invoke the doctor rather than adding a second SOP beside it.

**The plan went stale within hours of being written, and it is the seventh instance of the thing the plan is about.** §7 said four assets with video renditions had no Drive folder and that the folder job's first run would clear them; the folders were created by hand later the same day (see the entry above), so all seven video assets now have one and the job will have nothing to backfill. Corrected in the plan, with the incident left visible in it rather than tidied away, because it is the argument for Phase 0 rather than an exception to it.

## Andropause shelf: zero to four drafted derivatives (2026-07-31)

The Pillar E hub `andropause-male-menopause` published 2026-07-30 and sat at zero derivatives; it now has four, filed in `content-machine/assets/`: a LinkedIn post (`looking-for-a-word`), a Facebook post (`nothing-to-buy-for-it`), and two short-form scripts (`handbrake-half-on`, `what-time-was-it-taken`). All four are claim-clean by inheritance, with a line-by-line trace table in each file and **no net-new claim**; every figure used (1% a year, 7 to 11am, 4pm, 12 nmol/L, under 40) is quoted from the hub, which cites NHS, BSSM and BHF. The deterministic pre-flight is clean on all four (0 HARD, 0 REVIEW) and the pipeline gate scanner passes, but every file is deliberately left at `preflight: not-run` and `status: scripted`, because the drafter does not clear its own work. **The gate CA-028 does not lift is the one still open: each of the four needs its own pre-flight as an owner action plus Ewa's own sight before anything ships.**

Four items are queued for Ewa specifically, rather than assumed: the 12 nmol/L figure appearing on a Facebook brand page (inherited verbatim from a hub she approved, but stated to a scroller rather than to someone who chose to read eleven minutes; a fallback without the number is pre-written in the file, unapplied), the erectile-difficulty referral line (CA-028 §6 requires it and the BHF citation is inherited, but it is the highest-stakes sentence in the set), Kit 1 scoping on `handbrake-half-on` (it lists energy, sleep, recovery and drive against `marker: testosterone`, mitigated in copy by routing to the selector rather than Kit 1, but she should confirm that reading), and her per-asset sight on all four. **Owed next:** Keith's read, a handbrake-lever production check, and the scheduling separation recorded in `what-time-was-it-taken` against `lab-would-not-answer` and `same-test-twice`. (Drive folders were owed here and are now done, see the 2026-07-31 entry above.)

One angle was rejected and is worth keeping on the shelf: "two men turn fifty-two on the same day and one is fine" is untouched by any existing asset, but its ask is "revise your mental model of ageing", which gives Mark nothing to do. Available as a fifth derivative if the queue wants one.

## The four-things LinkedIn post is pre-flight green (2026-07-31)

Compliance pre-flight run on `2026-07-31-four-things-on-the-sheet`, both halves, and it came back green: 0 HARD, 0 REVIEW from the scanner and nothing for Ewa on the judgement pass. The statistical claim about reference ranges covering 19 in 20 healthy people is **claim-clean by inheritance, verified against the served `blog_articles.body` rather than the lagging MDX**, where the canonical article carries it verbatim with its Liver UK citation; the article is published, its ClickUp Content Review task `869e4v3e6` is complete, and the first comment's UTM link was confirmed live by both the database row and an HTTP fetch of the URL as written. The post does not repeat the range-wording error corrected in the X batch the same day: it names no marker and no figure, and its explanation attributes the range to the individual lab, which is precisely the fact those posts got wrong. The founder line sits inside the CA-029 precedent set by `instrumentation-problem` and makes a weaker claim than the copy Ewa cleared. Frontmatter stamped `preflight: green`, `preflight_date: 2026-07-31`, `ewa_task` left empty. **This clears the gate for scheduling and is not itself a sign-off.** One scheduling constraint from the asset's own craft note: do not place it adjacent to `2026-07-28-four-worth-seeing`, which ran the same underlying range idea three days earlier.

## X week 1 approved and scheduled: the channel actually starts Monday (2026-07-31)

**First content leaves the account on Mon 3 Aug at 08:00.** X has been nominally live since 2026-07-29 with 0 posts; this is the first thing that will actually appear on it.

- **Keith approved the batch 2026-07-31**, after the range-wording correction. Stamped in the draft file's frontmatter (`approved_by`, `approved_date`) so the approval is a record rather than something inferred from a commit message.
- **What the correction was, and why it mattered more than it looked.** Three posts asserted "the NHS testosterone range is 8 to 29 nmol/L" as national fact. There is no single NHS reference range: each lab derives its own, which is why Keith's own November 2025 report printed **6 to 22**. Left as written, the batch would have contradicted his own results on camera in the same week (`assets/2026-07-31-same-test-twice.md` quotes his sheet), and Monday's "one at 9, one at 25, both normal" illustration does not hold on a 6 to 22 range where 25 sits above it. Re-pre-flighted after the change rather than inheriting the earlier pass: 0 HARD, 0 REVIEW.
- **Six scheduled in Metricool, all PENDING, verified against Metricool's own calendar** rather than the create responses. Keith's slot decision: alternate the 07:30-08:30 and 12:00-13:00 windows rather than pick one, minutes varied inside each so the account does not read as a scheduler. Mon 08:00, Tue 12:30, Wed 07:45, Thu 12:15, Fri 08:15, Sat 12:45, all `autoPublish: true`.
- **Registered as seven `content_assets` rows, not one asset with seven renditions.** The unique key on (asset_id, platform, format) makes the latter impossible. Rule written up in `CONTEXT.md`; it governs every future batched channel.
- **Two things left manual, both Keith's.** The Sunday 9 Aug thread is not scheduled, because Metricool refuses to split X copy into a thread. And **Thursday's link is set as `firstCommentText`, a mechanism unproven on X**: well established on LinkedIn and Instagram, but nobody has tested whether it produces a self-reply on X from this account. Check at 12:15 on the 6th and reply by hand if nothing appeared. The link must never land in the post body; X suppresses posts carrying external links, which is the entire reason for the convention.
- **Profile complete, verified by screenshot 2026-07-31:** bio, display name, banner, link with UTM, and **97 following**. The Metricool connection survived the handle change (`twitterData: "keithandroprime"`). Known cosmetic defect: X crops the banner vertically and the marker strip is lost, recorded in `02_brand/assets/social/README.md`.
- **What this is still not.** Six scheduled posts on an account with two followers will do almost nothing alone. §7's reply habit, 10 to 15 a day, is the growth mechanism and the one thing here that cannot be scheduled. Week 1 tests whether the habit holds, not whether the copy is good.

## X handle changed to `@KeithAndroPrime` (2026-07-30)

Keith changed the X handle from `@keithantonyAP` to `@KeithAndroPrime`, which **resolves decision 2 of `x-channel-plan.md` §10** ahead of the week-8 revisit it was parked for. The founder handle is now consistent across X, YouTube (`@keithandroprime`) and Substack (`keithandroprime.substack.com`); Instagram (`@keith.antony.tech`) stays divergent for the account-deactivation reason on record.

Swept: `x-channel-plan.md` (§1, §2, §10), `content/social-channel-setup.md` (§X), `content-queue.md` (X section heading), `drafts/x-week-2026-08-03.md` (front matter), `dashboards/test-render.js` (fixture), and the `content_channels` row (`e8d9f5bc`, `account` field, verified after write).

**Still owed:** verify the Metricool connection resolves. An X handle change keeps the underlying account ID, so the link should survive, but it has not been checked and the first scheduled batch is the wrong place to find out.

**Contradiction found while sweeping, and resolved.** The `content_channels` row read `in_plan: true`, `lane-1`, *"Live from 2026-07-29"*, while `x-channel-plan.md` still said *"v1 PLAN, not yet running"* and `content-queue.md` said *"Not running until Keith signs off the reply habit."* The DB was right: the 2026-07-29 entry below records that Keith signed the reply habit off and the channel went live that day. Both stale doc lines corrected 2026-07-30.

**Why it happened, because it will happen again.** The plan's own header and the queue's section note were written while the decision was still owed, and the decision landed in a STATE entry without either being swept. A doc's status line is the first thing anyone reads and the last thing anyone updates.

## Substack: pre-flight gap closed, FAI issue retracted (2026-07-30)

The three-issue pre-flight debt recorded on 2026-07-28 is paid, and one issue came down. Prompted by Ewa, 2026-07-29 23:44 UTC: *"For Substack delete the article and rewrite and run via compliance, I believe are there are 3 other article in Substack that need to go by compliance so do those as well"*. She named a count, not the articles; reading the public archive resolved it, because exactly four were live and the other three are the three she meant.

| Issue | Live since | State now |
| --- | --- | --- |
| Normal on paper, flat in real life | 2026-07-18 | live, pre-flight **re-run green** 2026-07-30 |
| How to Read Your Blood Test Results | 2026-07-27 | live, pre-flight **green** 2026-07-30 |
| Signs Your Body Is Under Stress | 2026-07-27 | live, pre-flight **green** 2026-07-30 |
| Free Androgen Index | 2026-07-26 | **RETRACTED 2026-07-30**, deleted from Substack by Keith |

- **Scanner across all four live bodies (fetched, not assumed): 0 HARD, 1 REVIEW, 0 em dashes.** The single REVIEW is «cures» inside "no spam, no fear-mongering, no miracle cures", a negation. Benign. So the debt was paperwork, not claims.
- **Why the FAI issue came down rather than being edited.** It reproduced verbatim the two framings Ewa has since overturned ("estimates how much of your testosterone is actually usable"; "It's the figure most GP tests never calculate") **and carried the subtitle "Reviewed by GMC-registered GP Dr Ewa Lindo"**. So a public page attributed to her a claim contradicting her own 2026-06-16 threshold ruling. Its asset is `preflight: red` for that reason, not for a scanner hit. **Blocked on** the corrected canonical article going live (proposed revision `73bf7d77`, ClickUp `869ebf36k`); rewrite the issue from the corrected copy, pre-flight it as an issue, then republish.
- **The welcome issue's original pre-flight post-dated its publication.** Recorded `preflight_date: 2026-07-19`; the issue went live 2026-07-18. Re-run and re-dated. It is also the only one that does **not** inherit clearance from a signed article: it is net-new founder copy, not a teaser, and `ewa_task` is still empty. Its claims mirror the CA-029-approved author bio, so it stays live, but note that no separate clinical sight exists for it.
- **DB reconciled.** Renditions and assets updated; the FAI rendition reset to `to-produce` with `external_url`/`published_at` cleared, since the status enum has no retraction state. The full history (live dates, old URL, reason, blocker) is in the asset `notes`.
- **The gate is still not enforced.** `substack-draft.ts` says publishing is gated on `/compliance-preflight` passing on the assembled issue, but the publish happens by hand in the Substack UI where no code can check, which is exactly how three issues shipped unchecked. Owed: a `--verify` mode that writes the pre-flight result to the asset before a publish is considered legitimate.

## X has a plan, and it is not running yet (2026-07-29)

**NEW `x-channel-plan.md`.** The account was connected 2026-07-28 with no lane; this is the plan that turns it into a channel. Keith asked for daily posting and has not used X before, so the plan covers platform behaviour as well as content.

- **The finding that shapes it: on X, replying grows the account and posting does not.** Every other channel in the stack rewards the post. X shows a post from a cold account to almost nobody, so a daily post with no reply habit behind it produces close to nothing for months. The plan is therefore half a posting schedule and half a **15-minute daily reply habit that cannot be batched, scheduled or tooled**. That habit is decision 1 in §10 and the plan does not work without it.
- **Supply is not a constraint and will not become one.** 18 published articles (corrected 2026-07-31 from 17; `blog_articles` is the source of truth) times about 6 standalone X posts each is roughly 108 posts, about 15 weeks of daily, entirely from claims already signed off. Net-new claims are what cost Ewa time and this model generates almost none.
- **Weekly batch, one pre-flight.** Seven posts drafted into one file costs one `/compliance-preflight` run rather than seven, which is what makes daily affordable. Keith approves the batch in one read, Metricool schedules.
- **Platform specifics that catch people out, recorded so they are not rediscovered:** 280 hard (Metricool refuses to split a longer message, so scheduled threads are unproven and Sunday threads are manual for now), no hashtags, links in a reply rather than the post, and no cross-posting the LinkedIn text.
- **A kill criterion is stated in advance** (§9): under 100 followers and no post over 1,000 impressions after eight weeks of a **held** habit means X is not working for this positioning, and the hour a week goes back to channels that are. Written down now so stopping is a decision rather than a drift.
- **Seven weeks of queue rows added** to `content-queue.md`, each a week rather than a post, all against articles currently at zero coverage so each week also moves the atomisation number.
- **LIVE from 2026-07-29.** Keith signed off the reply habit, so `content_channels.in_plan` is now true for X and the board carries an eighth column. Coverage denominator moves from 119 to 136 slots, which is the honest effect of adding a channel: the percentage drops because the plan got bigger, not because anything was lost.
- **Week 1 is drafted and pre-flight clean.** `drafts/x-week-2026-08-03.md`, seven posts (six singles plus a Sunday thread) against `myth-of-normal-range`. **0 HARD, 0 REVIEW.** Every figure is quoted from the article: the 8 to 29 nmol/L range, the 260% span, 1 to 2% annual decline from 30, 15 to 30% lost by 45 and over 40% by 60, UK obesity nearly tripling since 1980. All 13 units fit inside 280 characters, longest 243. Awaiting Keith's read, then Metricool scheduling.
- **The batch note tripped the scanner on its first run, and the repo had already solved it.** A "rails applied" paragraph listing the prohibited terms produced 1 HARD and 2 REVIEW hits, all on that one line, with zero hits on the actual post copy. CONTEXT.md's existing rule is that compliance notes are written as an **allowlist of what the copy does**, never a prohibition list. Rewritten that way, the file is clean. **Worth noting the rule caught a real author, not a hypothetical one**, which is the argument for keeping it.
- **Pointers added** in `content/social-channel-setup.md` (identity register) and `written-post-playbook.md` (craft), so the conventional homes point at the plan instead of it sitting orphaned.

## The board was answering the wrong question, and the number it was hiding is 9% (2026-07-29)

**The scope changed under the dashboard and nobody moved it.** It reported on the 9 assets that exist. The question worth asking is what the 17 published articles could become and have not. Rebuilt around that.

- **The number: 11 of 119.** 17 published, Ewa-signed articles times 7 planned channel slots is 119 possible derivatives. Eleven exist. **Thirteen of the seventeen articles have never been atomised at all**, and three of the four that have were only a Substack republish. **[SUPERSEDED 2026-07-31. Both numbers in this line moved, and the correction was itself corrected, so the arithmetic is written out. Articles: 17 to 18 (`blog_articles` returns 18 published, 0 otherwise). Planned channels: 7 to 8, because X went `in_plan` on 2026-07-29 in the entry above, which this line predates. The grid was therefore 18 x 8 = **144 slots, 18 filled, 12.5%**, and moved again on 2026-07-31 when LinkedIn gained a vertical-video lane: **18 x 9 = 162 slots, 23 filled, 14.2%, backlog 139**, computed from `content_channels` and `content_renditions` rather than asserted. An intermediate correction on 2026-07-31 read 18 x 7 = 126 and was wrong: it moved the article count and left the channel count stale, which is the same half-swept-decision failure this file keeps recording. `andropause-male-menopause` has 4 DRAFTED derivatives at `preflight: not-run`; drafts are not renditions and do not count until they ship. The board now computes this figure live, so treat the dashboard as the source and this line as history.]** The inventory problem is not a shortage of source material, it is that the source material is sitting unused. `content-queue.md` lists 22 Lane 1 rows against a backlog that is really 108.
- **NEW `content_channels` table** (migration `content_channels_registry`). Platform, format, lane, `in_plan`, `connected`, publisher, account. It exists so the board can COMPUTE the gap between wired and planned rather than carry a hardcoded list that goes stale the moment a channel is added, which is exactly how the previous version rotted.
- **X is connected and has no lane.** Wired via Metricool 2026-07-28 as `keithantonyAP`, and it has no cadence, no queue rows and no section in `content/social-channel-setup.md`. Seeded `in_plan: false` so the board shows it as a channel that arrived without a plan. **Decision owed from Keith: give it a lane or leave it dark deliberately.** The schema already permitted `x`, `threads`, `bluesky`, `pinterest` and a `publisher` of metricool or unipile, so the DB anticipated this and only the plan lagged.
- **The Instagram split is now visible on the board.** Metricool is wired to `keith.antony.ai`, Unipile holds `keith.antony.tech`. Recorded in the channel notes so the next person does not assume one account.
- **The grid is the backlog.** One row per published article, one column per planned channel, computed from what exists. A dashed cell is an article that could carry that channel and does not. It cannot drift from the truth the way a written queue does, which is the failure `content-queue.md` keeps having.
- **Clicking a cell builds the prompt.** The command comes from the `/script` and `/hook` skills (`/script <slug> linkedin`, `/script <slug> facebook`, `/script <slug>` for short-form, `/script <slug> long`, `/hook <slug>`), and the constraint block carries the canonical slug, its live URL, the target account and lane, and the derivative-discipline rule. **It deliberately does not pre-judge the marker or the funnel tag**: `/script` resolves those itself and refuses topics whose marker has no kit, so duplicating that mapping into the page would have created a second source of truth for a rule that already has one. Substack is handled as a republish flow rather than a `/script` job, because that is what the written-post playbook says it is.
- **Tested without the browser, both layers.** `dashboards/test-extract.js` covers the response reader; `dashboards/test-render.js` drives the grid and the prompt builder against the real query shape and asserts the cell counts, the coverage maths, the X "no lane" flag and the generated prompt text.

## The artifact was showing an empty board, and the cause was the connector name (2026-07-28, latest)

**Symptom:** the dashboard read zero on everything while the database held 9 assets, 6 published renditions and real metrics. Two distinct faults, one in the page and one in the process.

- **The page called the connector by the wrong name.** It passed `claude_ai_Supabase`, the tool-prefix segment, as the `server` argument. The runtime contract is explicit that `server` is the connector's **display name for that viewer**, which is not knowable at publish time. The manifest form and the call form are different strings and the page used one for both. **Fixed by discovering it at runtime**: the page now calls `listTools()`, finds the connector actually offering `execute_sql`, and uses that exact name. It also reads the tool's `readOnlyHint` and falls back from `watchTool` to polled `callTool` if the connector annotates `execute_sql` as a write, because `watchTool` refuses to stream writes.
- **The page rendered a failed fetch as `0`.** `renderBoard([])` printed a confident zero row that was indistinguishable from a real measurement of nothing. **Zeros are now reserved for measured zero**; an absent value renders as a dash with a stated reason, and Substack impressions read `n/a` rather than 0 because the public feed exposes no impression count. A diagnostic line in the header names the resolved connector and whether it is streaming or polling, so the next failure says which half broke.
- **The source now lives in the repo** at `content-machine/dashboards/content-machine-artifact.html`. It previously existed only in a session scratchpad, so nobody could edit or review the deployed page without refetching it from claude.ai. Republish with `url: https://claude.ai/code/artifact/f12f575d-4a1a-4c1d-868c-8791d43879ee` to keep the same link.
- **Third fault, found only because the first fix made the page say what it was doing.** With the connector resolving correctly (`connector: Supabase · polling`, confirming the display name is `Supabase` and that `execute_sql` carries `readOnlyHint: false`), every section then reported "Unreadable response". Cause: the page read **only `result.payload`**. Per the runtime contract that field is a convenience, populated from structured output or from the first text block *when it parses as JSON*. This connector wraps its rows in prose plus a guarded envelope, which does not parse, so the useful text sits on `result.content[]` where the page never looked. **Fixed** by trying every location in turn: `structuredContent`, then `payload`, then each text block, each through JSON parse, then envelope extraction, then a quote-aware balanced-bracket scan that cannot be terminated early by a bracket inside post copy.
- **Covered by tests that run without the browser.** `dashboards/test-extract.js` exercises the extractor against nine response shapes plus the bracket-in-string case; run `node andro-prime/06_marketing/content-machine/dashboards/test-extract.js`. Seven parse, and the two that return null are genuinely empty responses.
- **The page now reports its own shape on failure.** If extraction ever fails again it prints which fields were present, the block types, and the first 1200 characters, so the next report carries the actual shape instead of another round of guessing. Failure of the board query also settles the pipeline and gates sections, which previously sat on their loading skeletons and read as though still working.
- **Not verified visually.** The page only renders real data inside the claude.ai shell with the viewer's own Supabase connector, which cannot be reproduced headlessly here. JS, markup and the extractor were checked statically and under test. **Keith is the only one who can confirm the fix**, and the diagnostic line is there so that confirmation is one glance rather than a guess.
- **The pattern across all three faults:** each one rendered as absence rather than as an error, so the page looked finished and wrong instead of broken. Making it state what it resolved and what it received is what turned two silent failures into one screenshot.

## The board is green: Ewa cleared the author bio, three surfaces closed at once (2026-07-28, later same day)

**The oldest open compliance item in the repo is closed, and with it the red board.** `02_brand/author-bios.md` had been sitting at "Keith approved 2026-05-27 / Ewa pending" for two months while live on the site. Keith sent it to Dr Ewa Lindo at 20:45 UTC naming the exact conflict, the bio moves from fatigue symptoms to testosterone markers and `03_compliance/CONTEXT.md` says Kit 1 must not be framed as explaining general fatigue or energy. She replied at 20:48 UTC: "All is fine to go ahead as is ...approval granted". Full thread and its limits filed at `03_compliance/correspondence/2026-07-28-keith-ewa-author-bio-signoff.md`.

- **One review cleared three surfaces**, exactly as the escalation was designed to: the site author page, the LinkedIn About section, and the live LinkedIn post `instrumentation-problem`. No softening was requested, so nothing downstream needed editing. The bio was the correct place to route it; resolving at the source meant the other two inherited the outcome instead of each needing its own review.
- **`instrumentation-problem` moved through the gate legitimately.** `preflight` amber-ewa to green, `status` scripted to done. It had `canonical_asset: free-androgen-index` set all along, so G2 passes on the preflight result. `ewa_task` now points at **CA-029** (`869eaqwv0`) on the Approvals & Sign-offs board, which is where compliance approvals live. The earlier read that the field had no home was wrong: the register (`03_compliance/content-approval/content-approval-register.md`) is the source of truth and the ClickUp board mirrors it, so every amber does have a CA number to point at.
- **The amber history in the asset file was left intact.** The file still records that the post shipped ahead of its gate on Keith's explicit instruction, and why. The gate closing does not retroactively make that a clean ship, and the record should keep saying so.
- **One question came back unanswered and was closed by decision, not by Ewa.** Keith asked whether "I got the right support. It changed everything." should also come off the site bio, having already dropped it from LinkedIn. "As is" approves the current state of each surface, so the line stays on the site and stays off LinkedIn. **Keith's call: the divergence is approved, do not reconcile the two.** Flagged in all three docs so a later tidy-up does not silently align them.
- **Operational effect:** the scanner no longer exits 2 on this asset, so `/content-status` and `/wrap` stop flagging it. That nagging did its job, it ran for roughly five hours and the review closed.

## Substack has been live for ten days and nothing was tracking it (2026-07-28)

**The record was wrong on the single most load-bearing fact.** The 2026-07-18 entry below still lists "(a) Keith: create the publication. Not started", and `content-queue.md` blocked all five Substack rows on that basis. **The publication exists and has published content.** `keithandroprime.substack.com`, "Keith Antony · Andro Prime", tagline "UK men's health, read from your blood", 8 subscriptions. Both docs are corrected.

**Four issues were live**, found by reading the public archive endpoint. **Superseded 2026-07-30: three are live, the Free Androgen Index issue was retracted, and the pre-flight gap is closed. See the 2026-07-30 entry below.**

| Issue | Live since | Pre-flight |
| --- | --- | --- |
| Normal on paper, flat in real life. Start here. | **2026-07-18** | green, gates clean |
| Free Androgen Index | 2026-07-26 | **not run as an issue** |
| How to Read Your Blood Test Results | 2026-07-27 | **not run as an issue** |
| Signs Your Body Is Under Stress | 2026-07-27 | **not run as an issue** |

- **All four are now in the DB** as `content_renditions` with `platform='substack'`, plus a baseline `content_metrics` capture. Three needed new assets created; only the welcome issue already existed, and it was sitting at `scripted` while live. It has been moved to `done` through the gates properly.
- **The compliance gap is the real finding.** Three issues shipped without `/compliance-preflight`. Each is a verbatim republish of a published, Ewa-signed article, which is exactly what the republish-safe rule contemplates, so they are very probably claim-clean by inheritance. Probable is not checked. Recorded at `preflight: not-run` so the gate reports them rather than assuming. **Owed: run the pre-flight on all three.**
- **Reading Substack needs no MCP, no cookie and no third-party code.** `GET {publication}/api/v1/archive?sort=new&limit=N` is public and unauthenticated, and returns title, slug, post date, reactions, comment count and audience. The 2026-07-26 decision to own `substack-draft.ts` rather than adopt a community MCP still stands for **writes**; for **reads** the question is moot. What the public feed does NOT expose is impressions, opens and subscriber-level data, so those columns stay NULL rather than being recorded as zero. Deeper stats would need authentication and are worth revisiting only if a metric decision ever depends on them.
- **No official Substack MCP exists.** Every implementation found is community-built, matching the 2026-07-26 vetting. One search result claims an MCP against a Substack "official Publisher API", which if real would postdate that vetting and is worth a look before any authenticated stats work.

**The systemic lesson, which is bigger than Substack.** A `STATE.md` entry said a thing did not exist; the thing had existed for ten days and was publishing. Nothing in the machine reads the live surface, so the tracker could not be contradicted by reality. `12_operations/sops/content-machine-verification.md` step 3 exists precisely to catch this ("`/content-status` matches reality on the live channels") and has never been run. **Every channel needs a cheap read-back, and Substack's is free.**

## Short-form content DB is BUILT and backfilled (2026-07-28)

`social-content-db-spec.md` went from proposal to live in the same day. Five tables in project `phqrjtnflovicgkngieu`, alongside `blog_articles` so the canonical-article FK is real: `content_assets`, `content_hooks`, `content_renditions`, `content_metrics`, `content_asset_revisions`. Migrations `social_content_tables` and `social_content_gates`.

**Keith overrode a phased recommendation and was right.** The proposal was to build hooks and metrics now and defer the asset migration. His argument: migration cost scales with volume, six assets is the cheapest it will ever be, and the phased version is itself the two-sources-of-truth state the spec warns against. Build it whole, iterate through small problems now rather than untangle a big one later.

- **Backfilled from the six git asset files:** 6 assets, 14 renditions, 2 hooks, 2 metric captures. Both live LinkedIn posts carry their `external_post_id` and `unipile_account`, so metrics join on the real key.
- **First real numbers, captured 2026-07-28:** `instrumentation-problem` 27 impressions / 1 reaction at 3h; `four-worth-seeing` 8 impressions / 0 reactions at 2h. **Early and unproven, but consistent with the double-post concern:** the second post of the day is running well behind the first. Worth a second capture before drawing any conclusion.
- **Gates are triggers now, not a JS scanner, and they are verified working.** Attempting to approve `instrumentation-problem` is refused with a legible error naming the reason (amber-ewa, no ewa_task). Decision 3 shipped as a **hard gate**: a rendition cannot publish if its canonical article is not `published`. One `drop trigger` relaxes it.
- **Transition window is open and should not be left open long.** Git `assets/*.md` still exist and `scan.js` still enforces them, so two mechanisms are live at once. Regenerating the markdown from the DB and repointing or retiring the scanner is the next piece and is **not done**. **[CLOSED 2026-08-01 by Phase 1, four days later, and the window cost real drift while it was open: two assets ended the period with a `preflight_date` in the file that the database never received. `content-sync` now regenerates the markdown block from the database and the scanner was repointed, exactly as this line asked. Worth keeping as the record that the fix was correctly identified on 2026-07-28 and the diagnosis sat there while the thing it predicted happened.]**
- **Three Unipile unknowns closed against the live API**, all recorded in the spec section 8.2: the real metric field names (the proposal guessed wrong), that `comment_counter` includes our own first comment, that Instagram is supported but not connected, and that **Unipile cannot schedule** so `scheduled_for` is intent and something on our side must fire.

## Short-form DB spec proposed; Unipile distribution blocked on credentials (2026-07-28)

- **NEW `social-content-db-spec.md` (PROPOSAL, not built).** Where hooks, captions and post text live once Unipile handles distribution, across all short-form channels. Five tables: `content_assets`, `content_hooks`, `content_renditions` (captions live here, they differ per platform), `content_metrics`, `content_asset_revisions`. **The forcing argument:** the repo currently holds two opposite answers to "where is the source of truth" (Spine A is DB-first because a publisher writes back to it; Spine B is git-first with a read-only ClickUp mirror), and Spine B is about to acquire a publisher. Two payoffs beyond distribution: claim inheritance becomes a **foreign key to `blog_articles`** instead of a hand-written prose table, so the "no derivative exceeds its canonical" rule becomes enforceable and the CQC/ASA trail extends to social; and storing every generated hook with its rubric score, **including the rejected ones**, is what finally fills `hook-rubric.md` §5 without Sandcastles. **Three decisions are Keith's and are open:** DB-as-truth vs DB-as-projection; store rejected hooks; canonical-article FK as hard gate vs warning.
- ~~**Unipile is NOT reachable from this environment.**~~ **SUPERSEDED the same day. Unipile is live, authorised, and has been used to write to the profile and publish a post.** The earlier finding (no `UNIPILE_*` key in any of the four repo env files, none in `.mcp.json`, connector unauthorised) was accurate about the *repo*, and remains the reason the `linkedin-post-search` / `linkedin-deep-analysis` skills still cannot self-serve: they read a root `.env` that does not exist here. What changed is that the claude.ai `unpile` connector was authorised and Keith supplied the API key and base URL directly in-session.

  **Two corrections that will otherwise cost the next session an hour:**
  - **Base URL is `https://api20.unipile.com:15044`**, not the `api1:13111` default advertised by the connector's server-variables. Calls to the default fail.
  - **The account ID is `vX9iWaO0Q0KNed0UWsOraA`.** The `1WSVXQByQ_ybabjwkD2gFQ` recorded in the skills is **stale and wrong**, as is the `execution/profile_deep_analysis.py` path those skills reference, which does not exist in this repo. The provider ID `ACoAACKXRwYBFogMdtl9M3n3QijiRbAE-oTngx0` is still correct.

  **Verified working via the connector's `execute-request`:** list accounts, read own profile, read another profile with `linkedin_sections`, list posts with metrics, **edit own profile** (`PATCH /api/v1/users/me/edit`, headline and summary only), **create a post** (`POST /api/v1/posts`), and **comment on a post**. **Verified NOT possible:** the contact email and the Websites array, which have no field on the edit endpoint and remain manual.
- **`four-worth-seeing` LinkedIn post is cleared and still unposted.** All gates verified 2026-07-28: pre-flight green, gate scanner clean, canonical `why-am-i-always-tired` confirmed `status=published` with `reviewerSlug: dr-ewa-lindo`, CA-016 confirmed APPROVED in the register, claim inheritance holds so no fresh Ewa step, 0 em dashes. One note: 275 words against the playbook's stated 300-500 band. Waiting only on Keith to post; send the URL and the rendition flips to `published`.
- ~~**The Content Machine artifact is fully static and will rot silently.**~~ **SUPERSEDED 2026-07-28 (later same day): the artifact was rebuilt live and this entry is no longer true.** It now declares the `mcp` capability and queries `content_assets` / `content_renditions` / `content_metrics` / `content_hooks` through the viewer's Supabase connector on a 120s refetch, with per-error-code failure panels and a freshness indicator. Nothing on the page is hand-typed. **Anyone reading only the strikethrough sentence will reach the wrong conclusion about why the page looks stale** (it was read that way once already): a stale-looking artifact now means the DATABASE is stale, not the page. Original audit, still accurate about the previous version: the 36-row queue was a hardcoded JS array with baked-in counts, and its "Published, all channels: 0" tile would have gone wrong silently. **Mechanism for making it live is confirmed working:** an artifact can declare the `mcp` capability and query Supabase through the viewer's claude.ai connector (verified with a real call, `content_pipeline` returned 16 published / 1 in_review). **But it can only report what is in the DB, and the social side is not**, which is the same blocker as the spec above and the strongest argument for DB-as-truth. Three constraints if pursued: a page declaring `mcp` cannot be shared publicly; calls run with the **viewer's** credentials (Ewa would need her own connector); the connector returns a text envelope wrapping the JSON, not clean JSON.

## The weekly run is now executable, and the camera no longer gates the week (2026-07-28)

**Diagnosis first.** The machine had a complete framework, a full craft layer, a gate-scanned tracker and six generator skills, and in three weeks it produced **four asset files, two of them stale at `scripted` since 2026-07-09, and zero published pieces on any founder channel.** Two structural causes, both now fixed:

1. **Every production *stage* had a skill; the *run* did not.** Spine A ships because `/article-to-review` sequences its stages into one command. Spine B's weekly run was prose in `sop-weekly-run.md` that a human had to read and improvise from, so nobody fired it. A workflow whose orchestration lives only in prose does not happen, however good the prose is.
2. **Every path ran through Keith holding a camera.** The calendar put recording in the critical path of every week. Ep 0 has not been shot, so the whole week stalled behind it, including the LinkedIn / Facebook / Substack slots that need no camera at all.

**Built:**

- **NEW `/content-week` skill** (`.claude/skills/content-week/SKILL.md`), the executable form of `sop-weekly-run.md` and Spine B's answer to `/article-to-review`. Six phases: read the board (scanner + queue + calendar + STATE), pick the week against the guardrails, draft Lane 1, draft Lane 2 *only if a filming day is booked*, run `/compliance-preflight` on everything, hand Keith a **record-list** plus an **approve-list**. It orchestrates the existing skills and reimplements none of them. Hard rails: never posts, never schedules, never approves, never lets Lane 2 block Lane 1, never picks a row whose canonical article is still `draft`/`in_review`.
- **NEW `content-queue.md`**, the standing Spine B backlog: 22 Lane 1 rows (10 LinkedIn, 8 Facebook, 4 Substack) and 14 Lane 2 rows, each with its canonical article, pillar, funnel stage and CTA already decided, plus wellness `[W]` tags for the floor count. Roughly four weeks of Lane 1 at calendar cadence. A refill rule fires when Lane 1 drops below 8 queued rows. **The weekly run no longer starts from a blank page**, which is what quietly turned it from a production job into a creative one.
- **The two-lane split**, swept into `sop-weekly-run.md`, `unified-content-calendar.md` §1, `CONTEXT.md` and `12_operations/sops/content-machine-verification.md`. **Lane 1 (no camera) runs every week unconditionally; Lane 2 (camera) batches onto a booked filming day and may slip.** The verification SOP now judges them by different standards, so a Lane-1-only week reads as normal rather than as a miss, and drafted-but-never-filmed assets are the thing it flags instead.
- **`CONTEXT.md` gained its missing `## Skills, tools & MCPs` section** (the repo convention says every CONTEXT.md ends with one; this workspace never had it).

**What this does not fix:** Lane 2 is still blocked on the **Ep 0 baseline shoot** and the before-state is still unrecoverable once Keith's numbers move. The difference is that the machine now ships weekly regardless.

**First live run, same day.** `/content-week` was fired for real and produced the machine's **first pre-flight-green Lane 1 asset**: `assets/2026-07-28-four-worth-seeing.md` (L-02, LinkedIn, MOFU, inherits CA-016). Three things the run surfaced, all recorded in the asset file:

- **The queued angle was partly unwritable.** "Your GP tested three things" asserts a count of a standard NHS panel that appears nowhere in the canonical article and varies by practice; the real-numbers-only rail forbids inventing it. The "four worth seeing" half is exact and shipped.
- **The first draft's opening line exceeded its source and was caught at pre-flight, not after.** It characterised what a standard panel is "built for", which the canonical article never claims. Keith chose the inside-the-source rewrite over an Ewa referral, which took it amber to green same-day. **The precedent: when a derivative's strongest line is the one that exceeds its source, rewrite inside the source rather than escalating.** It ships the same week and keeps Ewa's queue for work that genuinely needs a clinician.
- **A "rails held" note that lists banned terms re-triggers the compliance scanner on itself.** CONTEXT.md already extends the silent-ingredient rule to prohibited-terms lists; the same logic applies to the whole red-flag table. Compliance notes are now written as an **allowlist of what the copy does**, never a prohibition list.

**LinkedIn repositioned, live 2026-07-28.** The profile was the hidden blocker under the whole Lane 1 LinkedIn workstream: it was positioned for the systems-consulting practice, so the machine was drafting founder health posts for a profile that would have contradicted them. Root cause was a documented gap, `content/social-channel-setup.md` specified an identity for Instagram, YouTube, Facebook and Substack but **had no LinkedIn section at all**, because the profile already existed and was assumed solved. That section now exists.

- **Live profile data pulled via Unipile** (account `vX9iWaO0Q0KNed0UWsOraA`): 900 followers, 858 connections, 15 posts all between 4 and 25 March 2026 then dark for four months, 8,621 impressions total across those 15, median 222 per post, 16 reactions and 8 comments in aggregate. **The decision-relevant finding: there was almost nothing to protect.** The consulting content was not landing either, so "will health content confuse my consulting audience" was the wrong question.
- **Decision: bridge, not reset** (Keith, 2026-07-28). His consulting thesis ("I map the real operation, not the version on paper") is the health thesis: a standard panel is the version on paper. Career and company are the same job on a different system. The `headline` and `summary` were written live via the Unipile profile-edit API and verified. **Nothing else was touched**: work history, skills, photos, websites and contact email are unchanged.
- **Restore path saved** at `content/linkedin/2026-07-28-profile-before-repositioning.md`. The endpoint overwrites in place with no undo, so the previous headline and About are preserved verbatim there along with the baseline metrics.
- **Naming rule (Keith, 2026-07-28): the medical lead is not named in public LinkedIn copy**, use "our GMC-registered medical lead". Compliant either way; the substantiating element is the GMC registration and the clinically-approved recommendation logic, not the individual's name. **Scoped to Keith's personal profile only.** Article bylines, author pages and the YouTube description template still name her in full with the GMC number, because those attribute a specific clinical review. Recorded in the channel doc with a do-not-propagate note so it is not "tidied" for consistency later.
- **Shipped carrying an inherited amber, knowingly.** The About moves from fatigue symptoms to testosterone markers, which is the Kit 1 scoping rule's concern. It is not new: it compresses `02_brand/author-bios.md`, which makes the link more strongly, is marked "Keith approved 2026-05-27 / Ewa pending", and has been live on the site's author page in that state for two months. **The bio review now covers three surfaces, not one.** Resolve at the bio; if the link needs softening it softens there first and the profile follows.

**First founder content is LIVE (2026-07-28). Two LinkedIn posts, both via the Unipile API, both with their first comment.** After 26 days of live accounts and nothing posted, the machine has output on a platform.

- **`instrumentation-problem`** (the return post, repositioning the profile), post `7487903563306733568`, 16:15 UTC. **Shipped at amber**, see below.
- **`four-worth-seeing`** (L-02, the first `/content-week` output), post `7487916942582964226`, 17:08 UTC. **Fully clean: pre-flight green, gate scanner green, claim-clean by inheritance from CA-016, no Ewa step.** It moved `scripted -> done` through the gate legitimately, which is the first time any asset has completed the pipeline as designed.

**Cadence note for the next run:** the two went out 53 minutes apart on a profile that had been dark four months, against Keith's judgement call to publish immediately rather than hold the second for the calendar's Thursday LinkedIn slot. The recommendation stands for future weeks: space Lane 1 posts to the Mon/Thu slots. Reach on both will show whether the double-post cost anything, and that is worth checking before the next batch.

**It shipped ahead of its gate, and the board is red as a result. That is deliberate and should not be cleared.** The rendition is `published` while the asset sits at `scripted` with `preflight: amber-ewa`, so the scanner raises a HARD G3 and exits 2. The status was **not** hand-edited past the gate. Consequence: `/content-status` shows red and `/wrap` flags it on every run until the review closes. Keith's reasoning is recorded in the asset file: the same framing was already live on the site author page (since 27 May) and the LinkedIn About (same day), the post states it more weakly than either, and LinkedIn posts are editable after the fact. **It clears when `02_brand/author-bios.md` is reviewed**, which is now the single highest-value open compliance item: one review resolves the site bio, the LinkedIn About and this live post together. The note to her is drafted but **not sent**.

**Filming day 1 booked for Mon 3 Aug, 08:00-11:00** (calendar invite carries the shot list). Morning is forced by the 7-11am fasted sampling rule for testosterone; Monday is chosen so the sample posts at the start of the week rather than sitting over a weekend. Order runs cleared-first (C-02, C-03, both green since 09 Jul) so a bad morning still yields two finished pieces. **Keith has not taken his own kit yet**, which is the actual first domino: Ep 0 is split so the finger-prick (observational, claim-free) is filmed on the day and the numbers follow when results land, cut together as one episode. **Owed before the 3rd:** Keith gets a Kit 1 in hand; the Ep 0 script does not exist yet and, carrying no canonical asset, needs Ewa's sight before the spoken piece is filmed.

**Owed (Keith):** (a) run `/content-week` once to shake the first week out; (b) book a filming day so Lane 2 unblocks, Ep 0 first; (c) the Substack publication still does not exist, which blocks the Substack lane (see the 2026-07-18 entry).

## Hook rubric built, addiction loop wired, source provenance filed, Pillar E block cleared (2026-07-27)

- **NEW `hook-rubric.md` (v1)**, the grading standard every hook is scored against before it is shown. Six **hard gates** (claims, invented numbers, dead markers, untruthful reveal, repeated opener, em dash) that discard rather than score, then six **scored dimensions** at 0-2 each with a **9/12 threshold**. Explicit rule: never pad a set to three with a sub-threshold hook. Adapted from Kallaway's illusion-of-novelty framework, with **his step 5 ("don't show the mascot") deliberately rejected** as incompatible with the conflict-free positioning and with ASA rules on misleading by omission; replaced by an honesty constraint ("the reveal must survive being explained"). Only the gossip-whisperer delivery half of step 5 is kept. **§5 (learned criteria) is deliberately empty** until real performance data exists; the analysis method is recorded there ready.
- **`script-playbook.md` gained §3b, the addiction loop**, which is the mechanism under the four story structures and the answer to its own third blocker ("Story: how do I hold them after the hook?"). Stakes → big question → head fake → rehook, on the premise that dopamine is the prediction chemical, not the pleasure chemical. Plus **§3c** (order body points second-best first, best second) and **§3d**, which resolves three competing closes: question-to-viewer for short-form, fortune-cookie for long-form, flat close for articles. They do not stack.
- **`/hook` and `/script` rewired.** `/hook` now scores against the rubric **before** presenting, and gained a **grade-my-draft mode** (gates, six scores with reasons, weakest dimension named, three rewrites, original always shown). `/script` writes the four loop beats out before the script, and its step-3 output shape was corrected: it previously demanded a `[Visual:]` cue on **every line**, which produced B-roll shot lists Keith cannot film solo. Now one visual for frame 1, free `[Text:]` cues, and delivery cues through the body, citing the SOP's actual kit (tripod, lav mic, window light, one take).
- **NEW `sources/` directory + audit.** The two playbooks cited "studied" third-party sources that existed nowhere in the repo. Two Kallaway transcripts recovered from past session logs, a three-framework extraction written (`sources/kallaway-frameworks.md`), and `sources/README.md` records what was taken and what was missed. **Findings:** the six hook archetypes came verbatim from a B2B framework PDF; its 3-to-5 word overlay limit, its "But/Therefore never And-then" rule and its loop-back close never made it in. And the Kallaway script transcript was pasted **2026-07-11, two days after `script-playbook.md` was written**, so its five-step framework (Step 0 expectations-vs-reality, the 2-1-3-4 body order, the fortune-cookie outro) was never integrated at all. Both playbooks now link the audit.
- **Stale Pillar E block cleared from 8 locations.** CA-028 was approved 2026-07-26 and unblocks the andropause workstream, but the old block was still written into `avatar-mark.md`, `/hook`, `/script`, `sop-founder-short-form.md`, `sop-compliance-route.md`, `sop-weekly-run.md`, `borrowed-hook-templates.md` and `unified-content-calendar.md`, in seven different phrasings. The generators were refusing the **largest shelf in the 2026-07-26 frustration plan** (~12-15k/mo). All rewritten to preserve the gate that does still stand: **the pack signs the rules, every asset still needs its own pre-flight plus Ewa's sight.**
- **`avatar-mark.md` → v1.1, §C pain points refreshed** against four research passes that had accumulated unused since 2026-07-09 (07-14 VOC, 07-17, 07-19 Vitall, 07-20 mainstream buyer). 9 pain points → 14. **The material finding: Mark was built from a Reddit/Quora sweep, so he is the power-user-leaning avatar**, and the 07-20 research exists precisely because "every conclusion rides on power users". Every pain is now tagged `[mainstream]` (third-party verified) or `[power user]` (intensity real, prevalence inflated). New Tier 1 lead is the **GP-bypass trigger** ("without having to first convince your GP to get a blood test", verified 3-0), which outranks the normal-range wound for reach: speed earns the click, the wound earns the trust. **Correction recorded:** mainstream anti-upsell anger is **billing distrust, not anti-TRT ideology**, so conflict-free lands as money honesty, never as an industry critique. Added a "do not use as a hook" block for the tracking/spreadsheet cluster (self-selecting; Tracker v1 parked). Next refresh trigger is first-party quiz + post-purchase survey data, which replaces the inference rather than sitting alongside it.
- **Hetzner `content-pipeline` bucket locked down (2026-07-27).** All 23 voice-note objects were world-readable by direct URL (bucket listing was already denied). Flipped to `private`; verified by unauthenticated GET returning **403** where it returned 200 the same morning. Known consumer risk: the `cp_raw_transcripts.audio_url` column in the **nc-dev** Supabase project (not Andro Prime's) points at those public URLs, so a dormant pipeline could 403. Rollback state saved.

## Substack added as a channel (2026-07-18)

Substack folded into the machine as a founder-fronted, text-first DISTRIBUTE channel (Keith's call: "no harm building it into the content machine for reach, referral traffic, and AI citations"). It is a **republish + discovery + AI-citation surface, not an SEO backlink play** (body links are `nofollow`, no ranking value). Wired into: the blueprint channel matrix + reality-check bullet (`content-machine-blueprint.md` §2), the written-post-playbook (new Substack section, retitled LinkedIn + Facebook + Substack), the channel-setup doc (`content/social-channel-setup.md`, new Substack section: publication `Keith Antony · Andro Prime`, handle `keithandroprime.substack.com`), the calendar (Wed row + volume line, ~1/week repurposed from the week's pillar), and the funnel-map format enum (`newsletter`).

**Two locked decisions (Keith, 2026-07-18):**
- **Founder-fronted** (Keith's voice, same halo as LinkedIn), not a brand publication.
- **Distribution surface only.** Route readers to our own quiz / Customer.io rung; do not push "subscribe" as the primary CTA or treat the Substack list as owned data. This keeps it clear of the sub-processor gate, so it ships now.

**Welcome post drafted (2026-07-19):** the first issue ("Normal on paper, flat in real life. Start here.") is written and tracked as an asset (`assets/2026-07-19-substack-welcome-normal-on-paper.md`, `status: scripted`). Pre-flight **green** (deterministic scanner 0/0 + judgement pass; claim-clean by inheritance from the Kit 2 fatigue pillars, no fresh Ewa step). Cover image chosen (Sebastian Schuster, Unsplash, 1200x630). Awaiting Keith's publish go, which is gated on (a) below (the publication existing).

**Owed / conditional:**
- **(a) Keith:** create the publication (name, handle, bio, headshot per `social-channel-setup.md`, on `keith@andro-prime.com`) and grab `androprime.substack.com` as a name-hold placeholder. Not started.
- **(b) Republish-safe rule:** first Substack issue must be a *published, Ewa-signed* article, republished after it indexes, reference-linked back to the canonical URL, and `/compliance-preflight`-passed before send. No net-new health content ahead of the blog.
- **(c) Sub-processor gate (only if the decision changes):** actively growing the Substack email list as owned data would make Substack a new PII processor and needs compliance to approve it as a **sub-processor first** (same gate as ManyChat: `03_compliance` sub-processor schedule + privacy policy). Not triggered under the current distribution-only decision.
- **(d) `/script <topic> substack` generator:** ~~not built~~ **draft-push script BUILT 2026-07-26** at `09_website-app/frontend/scripts/content-engine/substack-draft.ts`. Owned, zero-dependency (global `fetch` + existing supabase client), chosen over the community Substack MCPs (vetted 2026-07-26: all ride the same unofficial cookie API and are hobby-tier; owning it keeps the founder's session cookie out of third-party code). It reads a **published** article from `blog_articles` (republish-safe guard refuses anything not `status=published`), assembles a short founder-intro issue (intro + teaser + canonical back-link + one UTM'd conversion CTA, default `/test-selector/`, override `--dest lp/testosterone`), and creates it as a **DRAFT** via `POST /api/v1/drafts`. **Draft-only by design: no publish/schedule/delete path exists in the file** (publishing stays a human action gated on `/compliance-preflight` + Keith's click). `--dry` assembles + prints without sending. **Owed (Keith):** add `SUBSTACK_SESSION_TOKEN` to `frontend/.env.local` before the first live run: it is the **`substack.sid`** cookie value (Substack's session cookie, HttpOnly+Secure, `s%3A…` prefix, ~90-day expiry; NOT `connect.sid`, which doesn't exist on the account, and NOT `substack.lli`). `SUBSTACK_USER_ID` is **optional** (Substack requires a byline, but the script auto-resolves it from `/api/v1/publication/users` at send if the env var is absent; the account's id is 530930363); `SUBSTACK_PUBLICATION_URL` defaults to `https://keithandroprime.substack.com`. First live draft created + verified 2026-07-26 (`free-androgen-index` -> `/lp/testosterone`, draft id 208615407, is_published=false). **Full line-up queued 2026-07-27:** all 17 published articles pushed as DRAFTS (testosterone cluster -> `/lp/testosterone`, energy/recovery -> `/lp/energy-recovery`, no-live-kit markers -> `/test-selector`; destinations provisional pending the LP-vs-bundle call). Script hardened this session: pulls the article's opening 1-2 paragraphs verbatim as the teaser (Keith 2026-07-27, "more meat on the bone"), `--update <id>` refreshes a draft in place (PUT), byline user id auto-resolved from `/api/v1/publication/users` (account id 530930363), subtitle capped ~200 chars (Substack limit). All draft-only; Keith reviews + publishes each. Original-size photos for the 9 photographed articles downloaded to `~/Downloads`.

## Content Library BUILT (git-first tracker) (2026-07-13)

**[SUPERSEDED 2026-08-01 by Phase 1. Every sentence below about WHERE the state lives is now wrong, and this entry is the design Phase 1 reversed.** The database owns state (`content_assets` / `content_renditions`), the file keeps identity and craft, the gates are a CHECK constraint and a trigger in `20260801_content_state_guards.sql` rather than a scanner, and the ClickUp mirror now reads from the database, so "git wins" is "the database wins". `scan.js` gates G1 to G4 are gone; G1 has no replacement anywhere. What this entry got right and Phase 1 kept: one record per idea, the slug as its name across all four systems, the ClickUp list being read-only, and `content-library-build-spec.md` as the durable spec (now carrying its own superseded banner). See the 2026-08-01 entry at the top of this file.]**

Git is now the database for founder content: `content-machine/assets/` holds one markdown file per idea, its frontmatter the tracker (status, funnel tags, preflight, renditions), schema and worked example in `templates/asset-file.md`. A gate scanner (`.claude/skills/content-status/scan.js`) hard-blocks invalid transitions (no `scripted` without a script, no `approved` without a green preflight plus a canonical asset, no `scheduled` rendition without its confirmed thumbnail, and the compliance HARD table over body copy). The new `/content-status` skill renders the board; `/hook`, `/script`, `/compliance-preflight`, and `/wrap` are wired to mint, advance, stamp, and gate-check asset files. A one-way sync script mirrors state into a "Content Library" list in ClickUp (renditions as a table in the description; git wins; Ewa's "Content Review" list `901218140081` is untouched). The durable spec is `content-library-build-spec.md`.

**Owed:**
- ~~**(a) Keith:** `gws auth login -s drive,gmail`~~ **DONE 2026-07-13.** Re-authed to `keith@andro-prime.com` with drive + gmail scopes. Drive tree `Content/2026-07/<slug>/{raw,final,thumb}` created in the business Drive for all three seeds; their `drive:` links are live; root/month folder ids recorded in the `/hook` skill. (Gotchas recorded there too: call gws from Bash not PowerShell; delete `~/.config/gws/token_cache.json` if a call 403s right after re-auth.)
- ~~**(b) Keith:** create the "Content Library" list~~ **DONE 2026-07-13.** List live at id `901219526361` (Phase 0 Launch folder) with the seven custom statuses.
- **(c) Keith:** trash the stray "Content" folder created 2026-07-13 in the personal Drive (`keithantony5@gmail.com`) by mistake. The business Drive is the home for all Content Library media. (The 14 stray "Untitled" files in the business Drive from the same day's gws misfire are already trashed.)
- ~~**(d) The first live sync run**~~ **DONE 2026-07-13.** Three seed tasks created with correct statuses (ep-0-baseline `idea`; the-stack + when-a-test-earns-its-place `scripted`); re-run verified idempotent (0 create / 0 update / 3 unchanged). The daily Action step keeps it fresh from here.

## Founder-content craft layer + generators BUILT (2026-07-11, extended 2026-07-12)

A full multi-platform generation stack, all reading each other and the compliance rails live:

- **`avatar-mark.md`:** the single ideal-viewer avatar ("Mark, 44"), from the Kallaway avatar exercise plus a live Reddit VOC sweep (verbatim pain lines). Every script is written to him.
- **`hook-playbook.md`:** six archetypes, visual-first rule (the key visual is the blood, not Keith's face), dream-outcome-is-certainty, founder-reveal-held, the seven-step write. Points to **`borrowed-hook-templates.md`** (added 2026-07-12): 43 proven structures curated from the "1000 Viral Hooks" library, compliance-reframed (cure/diagnosis/authority-voice templates excluded), mapped to our archetypes + funnel stages.
- **`script-playbook.md`** (short-form) plus **`long-form-script-playbook.md`** (YouTube) plus **`written-post-playbook.md`** (LinkedIn + Facebook, added 2026-07-12): the story/craft per platform, compliance-gated (shock-facts true AND compliant; contrarian aimed at the reference range not the GP; all posts/videos are derivatives that may not exceed the Ewa-signed article's claims). LinkedIn = Keith's personal profile, founder-forward, no bullet lists, ends on a question; Facebook = brand page, older segment, informational, soft router link.
- **`content-funnel-map.md`:** the pre-click acquisition funnel (TOFU/MOFU/BOFU/Retention), what content does which job, and the markup every asset carries. Connects to the `07_sales` lifecycle funnel at the email rung and the kit purchase (cross-linked both ways).
- **Skills:** `/hook <topic>` (three hooks) and `/script <topic>` with four modes: default short-form video, `long` (YouTube), `linkedin`, `facebook`. All refuse TRT/ashwagandha/Pillar E, never invent bloodwork numbers, stamp a funnel tag, and end at `/compliance-preflight`. Skill files live in `.claude/skills/hook/` and `.claude/skills/script/`.

**Verified working:** demoed all four modes on ferritin (short, long, linkedin, facebook). Every mode correctly flagged that the source ferritin article is still `status: draft` and cannot ship until Ewa-signed.

**Still owed (unchanged, and now the bottleneck for all of the above):** the **Ep 0 baseline shoot**. The generators produce scripts, but the founder scripts need Keith's real bloodwork numbers on camera, and the before-state is unrecoverable once results move.

## Framework

- **Content machine v1 created 2026-07-06:** docs + SOPs, no new code (per the approved plan). Entry point: `CONTEXT.md`. Blueprint, founder-content-system, unified-content-calendar, six SOPs, seven templates in place.
- **First atomisation dry run executed 2026-07-09** on Pillar B hub `why-am-i-always-tired` (CA-016). Full derivative set produced (2 short-form scripts, LinkedIn, Facebook, YouTube outline + description, email hook + body, 3 thumbnail specs). Compliance scanner: **0 🔴 / 0 🟠 on the copy**; no net-new claim, so it inherits CA-016 with no fresh Ewa step. Output + findings: `dry-runs/2026-07-09-pillar-B-why-am-i-always-tired.md`. **Nothing scheduled or published; Keith's voice-judgement and go still pending.**
- **All dry-run findings resolved 2026-07-09.** `kitCTA` built and all 15 articles migrated; the two trust-language items and the "Join the list" button fixed on Keith's instruction (see `03_compliance/STATE.md`). **Owed: tell Ewa** the CA-016 article's CTA sentence changed (no claim added; CA-016 carries a dated amendment note, the approval is untouched).
- **Video attribution rule corrected 2026-07-09.** A derivative video may not say "Clinically reviewed by Dr Ewa Lindo" because, under the hybrid role split, she never sees a claim-free derivative. Attribute the review to the **canonical article** instead. The bare line stays accurate, and permitted, where she did review the script (net-new claim, or an Ewa digital-twin short). Source rule: `content/youtube-founder-journey-strategy.md` §8; template: `templates/youtube-description.md`.

## Decisions made

- **Founder series name = "Read Your Blood"** (Keith, 2026-07-09). Locked in `founder-content-system.md` §3; it is the on-screen series tag on every episode.
- **Cadence confirmed as-proposed** (Keith, 2026-07-09). The weekly rhythm in `unified-content-calendar.md` §1 is live, not a proposal. Revisit only if Keith's recording capacity changes.
- **YouTube channel naming = founder-branded** (Keith, 2026-07-09). Handle `@keithandroprime`, name "Keith Antony · Andro Prime," on a company-owned Brand Account. Resolves the contradiction previously flagged here; swept 2026-07-09. Record: `content/2026-07-09-youtube-channel-naming.md`.

## Open judgement calls for Keith (needed to go live)

- **Comment-to-DM keyword map.** Confirm / adjust the proposed keyword → destination map in `templates/dm-keyword-map.md` (which keywords trigger, and where each DM link points). Not blocking: this gates the Instagram comment-to-DM flow only, which is itself behind the Instagram launch and the ManyChat sub-processor sign-off.

## Blockers and dependencies

- **YouTube + Instagram accounts live since 2026-07-02, no content posted yet.** YouTube under `@keithandroprime`; Instagram is now `@keith.antony.tech` (an existing account: the new `@keith.androprime` kept being auto-deactivated, changed 2026-07-19) per `content/social-channel-setup.md`; see `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`. First post is a Keith go. **Ep 0 baseline shoot not done** (`youtube-founder-journey-strategy.md` §10) and should be filmed before results move: the before-state is unrecoverable. Placeholder handles: YouTube reserved 2026-07-09 as `@androprime-men`; Instagram `@androprime` still owed.
- ~~**GA4 + consent banner not connected.**~~ **Resolved, and this line was stale.** GA4 `G-D5M4J5M3F6` plus the Consent Mode v2 banner have been live in production since **2026-06-18** (`09_website-app/STATE.md`). MEASURE is no longer blocked on plumbing. What remains is wiring the content → email → kit funnel view on top of it.
- **Central `kitCTA` router: BUILT 2026-07-09** at `09_website-app/frontend/lib/content/kitCTA.ts` (it did not exist; three docs instructed a config nobody had written). `InlineKitCTA` accepts a `pillar` prop; `npm test` guards the map, including a scan of every article's pillar. **All 15 articles migrated onto the map and verified live 2026-07-09** (not nine: six existed only in the DB). Redirecting a pillar is now a one-line change. Ordering rule and the two landmines it exposed: `09_website-app/STATE.md`.
- **Comment-to-DM (ManyChat) not set up.** New tool for Instagram keyword → DM link. **Compliance gate before any live flow:** add ManyChat as a data sub-processor (`03_compliance` sub-processor schedule + `data-controller-position.md` + privacy policy; solicitor if the DPA terms need review). Depends on the Instagram launch. SOP: `sops/sop-comment-to-dm.md`; map: `templates/dm-keyword-map.md`.
- **Pillar E (andropause / male-menopause) Ewa-gated.** Pack drafted, awaiting Ewa sign-off. No andropause / libido hooks until signed.
- **Affiliate content-kit module dormant.** Engine A (PT/influencer) FROZEN since 2026-06-07; the affiliate content kit is a documented-but-dormant module, unfreeze on a Keith decision.
- **Unsplash article imagery** built but unpushed (held for Keith to eyeball the first image). Same "Keith approves founder-facing imagery first" bar applies to thumbnails.
- **`content/youtube-scripts/example-scripts-line1-line2.md` routes its on-screen CTA to `/lp/energy-recovery`.** `/lp/*` pages are `noindex` direct-response LPs, and `09_website-app/CONTEXT.md` says in-article and product CTAs must point at the indexable `/kits/*` pages, never `/lp/*`. Noticed 2026-07-09 while correcting the attribution line; not fixed (out of that task's scope). **Fix before either script is filmed.**

## What is ready to atomise now (first canonical assets)

**[SUPERSEDED 2026-08-01. This section's heading says "now" and its count is history, which is the combination that misleads. The number is **18** published articles, computed live from `blog_articles`, not 14. Do not read the list below as current: it names the state on 2026-07-09 and predates the Pillar E hub, among others. The live figure and the atomisation gap are computed by the dashboard and by `content-doctor`; treat those as the source and this section as a record of where the shelf started.]**

~~**14 published articles, not nine**~~ (the count here was stale twice over; six existed only in the Supabase `blog_articles` table with no MDX mirror until 2026-07-09, when the mirror was restored). All carry a `kitCTA` pillar.

**Found by `content-doctor` invariant 7 on its first real run, 2026-07-31, and it is the reason invariant 7 exists.** A count under an undated present-tense heading in a file titled "State" is the exact shape that reads as current and is not. Note the doctor itself files this as history rather than a violation, because the section carries no date; that is a known limitation of its section-dating rule, recorded here rather than in the tool.

- **Kit 2 / Energy & Recovery:** inflammatory-markers (G hub), crp-blood-test (D hub), low-vitamin-d-symptoms + 14-signs (A hub + A.1), why-am-i-always-tired (B hub), brain-fog (B), plus b12 / ferritin / fbc marker explainers (D).
- **Kit 1 / Testosterone:** myth-of-normal-range (C spoke), how-to-increase-testosterone-naturally (C).
- **Email capture (no live kit):** liver-function-blood-test, thyroid-test, signs-of-stress-in-men. Draft: cholesterol-test (metabolic).

`why-am-i-always-tired` has been atomised (dry run). The rest are the queue for `sop-atomise-pillar.md`.
