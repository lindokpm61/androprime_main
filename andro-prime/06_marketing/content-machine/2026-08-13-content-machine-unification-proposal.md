# Content machine unification: three arms, one spine

**Status: PROPOSAL, 2026-08-13. Not a decision except where marked.** Written after the 30-day
Instagram carousel run was scheduled, because that run exposed the shape of the problem rather than
being the problem itself.

**Interactive version:** <https://claude.ai/code/artifact/8f059f68-0b01-46ea-9b19-182302d39b04>
(same content, plus a mockup of the control board). The artifact is private to Keith's claude.ai
account, which is why this file exists: the repo is the durable copy.

**Decided so far (Keith, 2026-08-13):** the content engine becomes its own package. Everything else
below is proposed and awaits a ruling. Open decisions are listed in §8.

---

## 1. The finding

Drafting is not the bottleneck and never was. Ewa answered all three clinical rulings on the carousel
run inside fifteen minutes, twice, by email. The four days went on everything around that.

This is not a new diagnosis. `content-pipeline-automation-plan.md` §1 reached it on 2026-07-31:
writing is close to free, and the hours go into reconciling stores that nothing watches. The carousel
run confirmed it and added one thing the earlier diagnosis did not have:

> **The carousel did not just take a long time. It built a THIRD content pipeline, with its own
> registry, its own board, its own scheduler and its own approval trail, next to two that already
> existed.**

Twenty-five commits, 10 to 13 August. Sorted by class, the largest share was rebuilding assets after a
late finding (all ten covers re-minted, ten clips re-rendered, the band-crop defect, the newsprint
typo), the second largest was reconciliation between stores, the third was approval routing, and the
smallest was writing the copy.

**The compliance pass was not waste and should not be cut.** It found two live defects in the product
the carousel points at: the test-selector routing fatigue readers to a testosterone-only kit (CA-033),
and the Kit 1 page printing a `Borderline` verdict on the one marker the results engine refuses to
grade. Neither was in the carousel. Both were found only because the pass followed the destination
rather than stopping at the slide.

---

## 2. Three machines, not one

Each arm has a complete, sensible pipeline. None shares a state model, a board, a scheduler or a
health check with the others.

| | Blog | Social | Carousel |
| --- | --- | --- | --- |
| Registers in | `content_pipeline` | `content_assets` + `content_renditions` | `covers.js` + `decks/` |
| Advances by | `orchestrator.ts`, daily tick | hand, no event spine | hand |
| Sign-off | ClickUp task + rulings checklist | pre-flight + Keith, in DB | four bespoke CA records |
| Ships by | `publishDue()` | `metricool-schedule.ts` | `schedule.js` (written 2026-08-13) |
| State 2026-08-13 | 17 published, 1 in review | 28 assets, 44 renditions, 27 at `to-produce` | 30 posts live in Metricool, **0 DB rows** |
| Health | working | stalls silently | invisible |

**The sharpest evidence is `schedule.js` itself.** It was written on 2026-08-13 to push the thirty
carousel posts to Metricool as drafts, with a slot per day and refusals on missing data.
`metricool-schedule.ts` already did exactly that. It was not reused because it reads from
`content_renditions` and the carousel has no rows there. **The moment an arm sits outside the shared
tables, every tool built for those tables becomes unreachable and gets rebuilt.**

Consequence as of today: the thirty posts are invisible to `/content-status`, unchecked by
`content-doctor`, and absent from every count in the STATE docs. When day 1 publishes on 2026-08-17,
nothing will record that it did.

---

## 3. Integration: folding the carousel in is smaller than it looks

The schema already anticipated this arm. No migration is needed for any of:

- `format = 'carousel'` is already a permitted value on `content_renditions`.
- `platform = 'instagram'` and `publisher = 'metricool'` likewise.
- `content-atomisation-model.md` already names carousels as a derivative of a canonical asset.

The carousel was never structurally excluded. It was simply never registered. Ten asset rows and
thirty rendition rows would have put it on the board from day one.

**One thing genuinely does not fit.** `content_renditions` is uniquely keyed on
`(asset_id, platform, format)`. The run is ten topics shipped three times each, same platform, same
format, deliberately, as an A/B/C test of the close. Three `instagram`/`carousel` rows cannot hang off
one asset. This is the first controlled variant test the machine has produced and the key forbids it.
See §8 for the decision.

**What the carousel brings back.** It built a deterministic asset renderer: copy in a data file, one
table driving every derived asset, byte-identical output on re-render (proven when nine of ten decks
re-rendered with zero diff). The social arm has no equivalent, which is why its images are hand-made
in Figma.

---

## 4. Extension: X, YouTube, video, thumbnails, and the next platform

### 4.1 The channel registry exists and is half a spec

`content_channels` already holds nine rows with platform, format, label, lane, `in_plan`, `connected`,
publisher, account, and a coverage-pause reason. What it does **not** hold is what a piece for that
channel requires.

**Proof that this is the missing half:** `gate_rendition_publish()` reads `new.thumb_spec`, the
rendition's own copy of a rule that belongs to the channel. So the 2026-08-05 ruling that a written
post needs no thumbnail and videos do had to be applied by hand to four rendition rows, four asset
files and the SOP. In a channel-spec model it is one cell. Before that correction, the gate held two
already-approved Facebook posts against a file nobody knew they owed.

### 4.2 What varies per channel is a short, boring list

Media required, metadata required, copy limit, human steps, publisher, and whether the route has ever
carried a real post. Every one of those is data; none needs a code branch. **Six of the ten routes
have never carried a real post**, which is a different fact from "connected" and today lives in a
prose `notes` field.

Adding Pinterest later should be: one row, one media requirement, `board id` + `pin title`, publisher
`metricool`. No code.

### 4.3 The genuinely missing table is media

There is no media table. Nowhere in the schema does a produced file exist as a record, which is
exactly why the carousel invented `frontend/public/carousel/`.

The omission costs more than tidiness. Three channel rows carry the note *"9x16 pull from the same
shoot as the Reel"*. One export serves the Instagram Reel, the YouTube Short, the TikTok short and the
LinkedIn short. **The schema cannot express that at all**, so those are four unlinked rows that all
sit at `to-produce` together.

A `content_media` table (kind, aspect, URI, origin, checksum) joined many-to-many to renditions
collapses four problems into one: thumbnails stop being special (a thumbnail is a media row of kind
`thumb`), the publish gate becomes generic ("does this rendition have the media its channel
requires"), a carousel's eight stills and a video's clip-plus-thumb become the same shape, and one
shoot fans out by linking rather than copying.

### 4.4 Where the bytes live: three jobs, three homes

19 MB of carousel assets were committed to `frontend/public/carousel/` and deployed on 2026-08-13.
That was right for that payload and is **wrong as a general rule**: YouTube long-form is
gigabyte-scale and cannot go in git or in the Next.js public directory.

**Correction to a premise raised in discussion: Supabase Storage is not a database table.** Putting
media in a Postgres `bytea` column would be slow and harmful (bloats the WAL, inflates every backup,
pushes large payloads through the connection pool). That instinct is right. But Storage is
S3-compatible object storage with a CDN, sitting *alongside* Postgres rather than inside it; the
database holds only a URI. **There are currently zero buckets**, so it is unused rather than rejected.

**What the repo is carrying** (measured across all git history, 2026-08-13): text 71.6 MB, MP4 42.4 MB
across 25 objects, PNG 40.7 MB across 179 objects, JPG 6.5 MB. **Binaries are 56% of history and
already outweigh the content**, in about three months, with no video filmed yet. Git history is
permanent: every cover re-minted and every clip re-rendered during the carousel run is still there as
its own object.

| Job | Examples | Size | Replaceable | Needs public URL | Humans touch it | Home |
| --- | --- | --- | --- | --- | --- | --- |
| A. Working | shoot footage, project files, raw exports | GBs | never | no | constantly | **Google Drive** |
| B. Publishable | finished cuts, carousel stills, thumbnails | MBs | if rendered | **yes, hard requirement** | no | **Supabase Storage** |
| C. Site chrome | `hero.mp4`, OG images | MBs | yes | served by the app | no | `frontend/public/` |

**A stays on Drive and gets the structure it never had.** Humans must put files in and take them out
(Keith records, an editor pulls raw and pushes a cut). Workspace is already paid for and the `gws` CLI
is authenticated. The convention already exists unused in the automation plan:
`Content/YYYY-MM/<slug>/{raw,final,thumb}/`, created when an asset reaches `scripted`, with
`drive_url` written back. **7 of 28 assets have a Drive folder today**, so this is unbuilt rather than
broken. Drive is a poor programmatic origin (sharing links are not stable direct-download URLs, and
Metricool requires the account to have Drive linked), which is fine for job A and disqualifying for B.

**B goes to one public Supabase Storage bucket**, because job B has the only hard requirement in the
picture: Metricool ingests by public URL. Stable direct URLs over a CDN, already in the stack, no new
vendor or credential. Path convention `content/<slug>/<kind>.<ext>`, mapping one-to-one onto
`content_media` rows.

**C stays in `frontend/public/`** for genuine site chrome only. The 110 carousel files are content,
not chrome, and putting them there was the wrong call.

> **Git holds the recipe. Drive holds what humans touch. Supabase Storage holds what a machine
> publishes from. The database holds the URI, and nothing else.**

**The rendered/shot distinction is what makes this cheap**, and it is the `origin` field on
`content_media`:

- **Rendered** assets rebuild byte-identically from a recipe in git. They need a public URL at
  schedule time and nothing more: never commit them, publish to Storage, treat as safely deletable.
  If a bucket were lost, one command regenerates all 110.
- **Shot** assets cannot be re-shot. Drive is the master from the moment the camera stops; the
  published cut goes to Storage; the media row links them. This is the only genuinely unrecoverable
  failure in the picture.

**The migration is low-risk.** The thirty scheduled posts point at `andro-prime.com/carousel/...`, but
**Metricool re-hosted every asset to its own CDN at schedule time** (confirmed on read-back: all
thirty now reference `static.metricool.com/planner/...`). The origin can move without touching a
scheduled post.

### 4.5 Supabase Pro versus self-hosting on Hetzner (assessed 2026-08-13)

**Volumes first.** Only *published* assets go to Storage; raw footage stays on Drive. Projected:
carousel runs ~230 MB/yr, thumbnails ~40 MB/yr, short-form cuts (3/week at ~20 MB) ~3 GB/yr, long-form
(1/month at ~500 MB) ~6 GB/yr. **Total ~10 GB/yr against Pro's 100 GB included.** Egress is similar,
because **Metricool fetches each asset exactly once** and then serves from its own CDN, so we never
pay to deliver video to viewers: ~10 GB/yr against 250 GB included.

**So on Pro, marketing media is effectively free.** It fits inside allowances bought for other reasons
with roughly tenfold headroom. (Volume estimates are projections, not measurements: no video has been
shot. Re-check after the first filming day.)

🔴 **The real finding is not about storage.** The database is **18 MB against the free tier's 500 MB
ceiling**, so size is not the pressure. **Backups are.** Free has no daily backups; Pro has daily
backups kept seven days. The live site — orders, quiz results, biomarker values, the content pipeline
— currently runs with **no managed backup at all**. That is the reason to move to Pro, worth more than
the $25, and the storage question rides along for free.

**Do not self-host Supabase on the Hetzner boxes**, despite real spare capacity there (12 vCPU, 24 GB
RAM, 320 GB local disk, 20 TB traffic across `nc-server-01` CPX31 x86 and `nc-server-02` CAX31 Arm64,
both eu-central/Helsinki, ~$47/mo already paid):

1. **It moves the wrong way for CQC.** A managed provider with a DPA, documented retention and daily
   backups is straightforward to evidence. Self-administered Postgres is a much harder story, and we
   would own patching, upgrades, backup verification and restore testing.
2. **Backups are currently DISABLED on both servers** (both consoles show BACKUPS with an Enable
   button). The self-hosted option would start weaker on the dimension that matters most.
3. **It splits the store.** Regulated data on one Postgres and marketing on another is two places for
   one fact, which is the failure mode this whole document is about.

Keith's point that marketing media is not regulated data **is correct and does matter** — it is why a
public bucket is acceptable and why no patient data goes near one. It just does not buy enough to
justify a second database.

**The Hetzner boxes should host the content-engine worker instead**, which is what
`content-pipeline-automation-plan.md` §7 is about: the nightly doctor, the Metricool poll, the render
jobs. Use the **x86 box (`nc-server-01`)** for rendering, since the pipeline shells out to headless
Chrome and ffmpeg and the CAX31 is Arm64.

**Two caveats.** Removing files going forward does not shrink history; the existing 90 MB stays unless
history is rewritten, which is disruptive and rewrites every commit hash. At 113 MB total that is not
worth doing yet, and the trajectory matters more than the number. And the media volume figures above
are estimates rather than measurements, since nothing has been filmed.

### 4.5 Three derivative kinds, not eleven channels

- **Written** (text only) feeds X, LinkedIn, Facebook, Substack, Threads, Bluesky. Shipping.
- **Rendered** (deterministic from a data file) feeds carousels, quote cards, thumbnails, Pinterest
  pins. Proven, but unshared and unregistered.
- **Shot** (camera and edit) feeds Reels, Shorts, TikTok, LinkedIn video, YouTube long-form. 21
  renditions, zero ever filmed.

The **article** sits outside this set: it is the canonical source everything else inherits from, not a
derivative. So the architecture is four production front-ends (article, post, deck, video) feeding one
shared spine, and the board groups lanes the same way with Canonical listed apart.

**Adding a platform is a channel row. Adding a production kind is real work, and all three already
exist.** Nothing on the roadmap needs a fourth.

### 4.6 The video arm is blocked on the shoot, not on thumbnails

**Correction to an earlier reading.** All 21 video renditions belong to assets sitting at `scripted`.
**No asset has ever reached `recorded`.** The scripts are written and waiting on a filming day. The
thumbnail gate is real but sits behind a step never taken, so it cannot be what is holding the arm
shut. The two have different fixes: the shoot is Keith's time and no system supplies it; the thumbnail
is automatable.

The honest case for a thumbnail renderer is therefore not that it unblocks video today. It is that 21
hand-drawn files fall due the moment the first shoot lands, and that gate has already stopped approved
work once.

---

## 5. Approvals: the gate is attached to the wrong thing

Compliance is attached to the **artefact**, so every artefact gets the full pass from scratch,
including the large majority that is a signed article restated in fewer words. Ten articles became
thirty carousel posts and the gate ran as if none of the ten had been reviewed.

**Attach it to the claim instead.** Ewa signs a versioned claim set once, at the article. Every
derivative declares which claims it carries and pins the version. The check becomes mechanical: does
each line map to a signed claim, and does it keep that claim's qualifier.

**The data already exists as prose.** Thirteen of the twenty-eight asset files already carry a
`## Claim inheritance check` table in exactly the right shape (`| Post line | Source line |`). It is
produced fresh every time, read once, and thrown away: not stored, not versioned, not machine-readable,
not reusable.

### The tiers

| Tier | What | Who |
| --- | --- | --- |
| 0 | Mechanical: banned vocabulary, silent ingredient, prices, disclaimer, em dashes, kit scope | scanner, automatic |
| 1 | Inherited verbatim: every line maps to a signed claim | auto-pass, no Ewa |
| 2 | Compressed, or on a surface that cannot carry the qualifier | Ewa, small and itemised |
| 3 | Net-new claim | back to the article for clearance |

27 of 28 assets already declare a canonical article and 25 are pre-flight green, so the inheritance
lane is nearly universal. It is simply never computed.

### What still cannot inherit, and only one is new

1. **The destination.** CA-034's most valuable findings were on the pages the carousel points at, not
   in the carousel. But that is checked **per destination, once**, not per derivative.
2. **A surface that cannot carry the qualifier.** E3: a cover tile in the grid has no body copy. That
   is a property of the surface, so it belongs on the channel spec.
3. **Claims that are not text. This is what video adds and nothing else does.** A bloodwork screenshot
   held to camera, a physique shot implying an outcome, a delivery that turns "may support" into a
   promise. No scanner and no inheritance table sees any of it.

**So video needs one thing the other three front-ends do not: a pass over the shot list, before the
filming day.** `compliance-preflight` already says *"same logic for a script line before it is
filmed"*; it has no mechanism behind it. A claim caught in a shot list costs a line edit; the same
claim caught after a filming day costs the day.

### The trap to design around

If an article is re-optimised after its derivatives ship, they are all inheriting a superseded claim
and nothing says so. This is the `article-drafts/` staleness problem generalised, and it is the
failure mode that would make a ledger worse than no ledger. **Claims carry a version and derivatives
pin the one they inherited**; when the article moves, the board lists what is pinned to the old set.
`stage-reopt.ts` and `reopt-concierge.ts` already run that track.

**What it would have saved on this run:** what genuinely needed a clinician was E1, E2 and E3, three
items. What was produced was four approval records and a seven-item packet, assembled by hand over two
days.

---

## 6. The control layer

Four boards exist and none sees the machine: `review.html` (carousel only),
`content-machine-artifact.html` (social only), `/content-status` (terminal), `content-doctor` (nightly
exit code).

**Proposal: one route in the existing Next.js app**, `/ops/content`, behind auth, reading live from
Postgres. Not a new app: a fifth surface is a fifth thing to keep in sync, and duplication is the
disease. Read-only first, then write actions for exactly the three things that are genuinely gates
(approve, flip live, submit to Ewa).

Five panels, and each carries a tag saying whether it can be built today or needs schema work first,
so the board states its own build order:

1. **What needs you** (live) - the gate queue, ranked by what it unblocks.
2. **Every lane by production kind** (live) - all ten lanes including the empty ones.
3. **Channels** (needs spec columns) - what each channel requires, plus route-verified state.
4. **Media** (needs `content_media`) - one file, many renditions, and the fan-out made visible.
5. **Approvals** (needs the claim ledger) - the tier ladder and the per-article claim set.
6. **Health** (live) - the ten invariants plus a drift list.

Four things it must do that no current board does:

- **List every lane, including empty ones.** LinkedIn vertical video has been `in_plan` and
  `connected` since 2026-07-31 with zero renditions ever created. A board that only lists lanes with
  rows cannot show that.
- **Group by production kind, not platform.** Grouped that way the picture states itself: written is
  shipping, rendered works but is unregistered, shot has never published.
- **Separate coverage from health.** Every invariant asks whether stores *agree*. Twenty-one
  renditions untouched at `to-produce` is a state where every store agrees perfectly, so a green board
  and a stalled machine look identical.
- **Surface unregistered work as a failure.** A board that silently excludes thirty live posts is
  worse than no board.

---

## 7. Where the code lives

### 7.1 DECIDED (Keith, 2026-08-13): the engine becomes its own package

**Not a separate repo yet.** See §7.4 for the triggers that would change that.

### 7.2 The live defect that makes this urgent

`npm test` is `npm run typecheck:scripts && <12 test files>`. That typecheck **exits 1 on three
errors, and all three are in `scripts/content-engine/`**: two in `doctor-heartbeat.ts`, one in
`metricool-schedule.ts`. The app's own typecheck exits **0 with zero errors**.

**So the app is clean, the tooling is broken, and because tooling runs first behind an `&&`, none of
the twelve app test files execute** - including the results-classifier regressions, quiz routing,
checkout, and the Customer.io consent gate. Clinical logic currently has no regression cover, and the
cause is three type errors in content tooling.

### 7.3 It can be done cleanly, and most of the thinking is already done

`tsconfig.json` already excludes `scripts/`. `tsconfig.scripts.json` already exists and states the
rule: *"tsconfig.json -> the APP, everything the container builds and serves. tsconfig.scripts.json ->
the TOOLING, runs on a full checkout, may reach REPO_ROOT."* It was written after a real failure: on
2026-08-02 a build-time import from `.claude/` was added to `content-doctor.ts`, type-checked locally,
and broke the Coolify deploy, because **the Docker build context is rooted at
`09_website-app/frontend`**.

That is what makes this clean. The build context is already scoped to `frontend/`. Move the engine to
`packages/` at the repo root and it leaves the build context entirely: it stops being copied into the
image (`COPY . .` in the builder stage) and engine code becomes **structurally incapable** of breaking
a deploy.

**The move:**

1. Create `packages/content-engine/` with its own `package.json`, `tsconfig.json` and test script.
2. `git mv` the 29 scripts. They already resolve repo-root paths through `repoRoot()`, and
   `_shared.ts` already loads credentials "real env first, then `frontend/.env.local`, then repo-root
   `.env`", written that way for cloud runtimes.
3. Fix the three type errors as part of the move. They are the reason the app's suite is off.
4. Split `npm test` in two so app tests stop sitting behind a tooling typecheck.
5. Update ~25 path references: six skills, ~15 docs, `settings.local.json`, the scheduled-task `.cmd`.
   Run `/decision-sweep` to propagate.
6. Re-point the scheduled doctor and **verify by letting the scheduler fire it unattended**, not by a
   hand run. Its action string has silently failed before (2026-08-05, four nights, no log line).

**Open question, not verified:** whether Coolify rebuilds on *any* push or only on changes inside the
build context. Moving the engine out guarantees it cannot break a build; whether a content-only commit
still triggers a pointless deploy depends on a Coolify watch-path setting nobody has looked at.

### 7.4 What would justify a separate repo later

1. **Someone needs content access without business access.** The strongest argument and not a
   technical one. The repo holds entity structure, financial planning, partner contracts and clinical
   governance. A contractor, a VA, or Ewa working the content machine cannot be given all of that.
2. **The machine gets its own scheduled cloud runner.** Smaller checkout, tighter secret scope.
3. **The ops board becomes a real app** with its own deploy cadence.

**Why not now:** the doctor already spans three domains (invariant 2 reads asset files in
`06_marketing`, the scanner in `.claude/skills/`, and the DB), the skills reference both sides in one
file, and `compile-gate.ts` carries a hand-synced copy of the MDX component allowlist. Every serious
failure in this repo has been two copies of one fact with nothing watching; a second repo should be
bought for a reason, not for tidiness.

**Correction to a premise raised in discussion:** the website being "fed" blog content is already how
it works. `blog_articles.body` is the source of truth and the site reads from it;
`frontend/content/blog/*.mdx` is a backup mirror kept honest by `sync-mirror.ts`, not a feed. The blog
half of the split is already done.

**Note on `compile-gate.ts`:** it gates every article publish by fetching the draft through the real
deployed preview route and requiring a 200, deliberately, because an in-process compile is an
approximation. That is an **HTTP dependency on the running site, not a build-time dependency on its
code**, so it works identically from a package, another repo or a cloud runner. It does mean the
machine can never publish an article while the site is down or mid-deploy.

---

## 8. Open decisions

| # | Decision | Owner | Notes |
| --- | --- | --- | --- |
| D1 | Carousel variant modelling: add a `variant` column to the rendition unique key, or model each post as its own asset | Keith | The first is truer to the run; the second needs no migration. Blocks registering the run. |
| D2 | Adopt the claim-ledger model for approvals | Keith + Ewa | Ewa's sign-off changes shape: she signs a claim set rather than prose. Needs her agreement, not just Keith's. |
| D3 | Adopt the three-home storage split (§4.4): Drive for working media, one public Supabase Storage bucket for publishable, `frontend/public/` for site chrome only | Keith | Binaries are already 56% of git history. Do it before the first filming day, not after. |
| D3b | **Move Supabase to Pro.** Not for storage: the live site currently has **no managed backup**, and media fits inside Pro's included allowance either way (§4.5) | Keith | Assessed 2026-08-13. Recommendation is Pro, and **not** self-hosting on Hetzner: wrong direction for CQC, backups are disabled on both boxes today, and it would split the store. |
| D4 | Build `/ops/content` as a route in the app | Keith | Alternative is keeping four boards. |
| D5 | Coolify watch-path: does a non-frontend commit trigger a deploy? | Keith | Needs someone to look at the Coolify config. |

---

## 9. Recommended order

Ordered by return, not size. Item 1 is a live defect rather than an improvement.

1. **Split the engine into its own package and fix the three type errors.** Small. Restores the app's
   test suite and removes the deploy coupling. Touches 29 scripts, 6 skills, ~15 docs, the cron task.
2. **Register the carousel run in the shared tables.** Small, needs D1. Thirty live posts currently
   invisible to every tool.
3. **Build the Metricool write-back poll.** Small. I4 has gone red every morning since 2026-08-03 and
   thirty more posts are about to start publishing.
4. **Create the Storage bucket and stop committing media.** Small, needs D3. One public bucket at
   `content/<slug>/<kind>.<ext>`, the renderer publishing there instead of to `frontend/public/`, and
   a `.gitignore` rule so rendered output cannot be committed again. Do it before the filming day:
   that is the difference between a convention and a cleanup.
5. **Book a filming day.** Keith only. Ten scripts and 21 renditions across four channels wait on it.
6. **Store the claim set and check derivatives against it.** Medium, needs D2. The only item that gets
   cheaper as volume grows. Pair with a shot-list pass for video.
7. **Finish `content_channels` into a spec, add `content_media`.** Medium. Makes a new platform cost a
   row.
8. **Point the deck renderer at thumbnails.** Medium. Do it before the filming day, not after.
9. **One ops route, read-only, then the gate actions.** Medium, needs D4. Last, because it reads
   everything above.

### What not to change

- **Ewa's sign-off.** A named professional's accountability and the clinical safety layer. Make it
  cheaper to reach, never automatic.
- **Drafts by default, human flip.** The 2026-07-31 decision. It is what makes a bad run recoverable.
- **Four separate production front-ends.** Article, written post, rendered deck and shot video are
  genuinely different crafts.
- **One repo, for now.** See §7.4.

---

## 10. Evidence

All counts read live from Postgres on 2026-08-13, not carried forward from a doc.

- 18 published articles. `content_pipeline`: 17 published, 1 in review.
- 28 content assets: 12 approved, 10 scripted, 6 done. **None ever `recorded` or `edited`.**
- 44 renditions: 27 `to-produce`, 8 `scheduled`, 9 `published`.
- 21 video renditions (7 IG Reel, 7 YT Short, 6 TikTok, 1 YT long-form), **all belonging to assets at
  `scripted`**, none ever published.
- 21 thumbnails owed (20 at 9:16, 1 at 1280x720), all at `to-produce`.
- 0 carousel rows in `content_renditions` against 30 posts live in Metricool.
- 9 `content_channels` rows; LinkedIn vertical video has 0 renditions.
- 27 of 28 assets declare a canonical article; 25 pre-flight green; 13 carry a hand-written claim
  inheritance table; 7 have a Drive folder.
- `tsc -p tsconfig.scripts.json`: exit 1, 3 errors, all in `scripts/content-engine/`.
  `tsc -p tsconfig.json`: exit 0, 0 errors.
- Content engine imports app code exactly once across 29 scripts: `lib/supabase/types`, generated.

**Sources:** `content-pipeline-automation-plan.md`, `content-machine/CONTEXT.md` and `STATE.md`,
`content-atomisation-model.md`, `03_compliance/content-approval-register.md`, `content-doctor.ts`,
`orchestrator.ts`, `metricool-schedule.ts`, `compile-gate.ts`, `tsconfig.scripts.json`,
`package.json`, `Dockerfile`, `.claude/skills/compliance-preflight/SKILL.md`.
