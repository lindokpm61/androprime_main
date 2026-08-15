# Website / App: Current State

Volatile, dated status: what is live / verified / owed **right now**. Durable architecture and access mechanics are in `CONTEXT.md`; this file is the moving layer. Update the date whenever a line changes.

_Last updated: 2026-08-14 (🔴 **THE HETZNER SERVER INVENTORY IN THE DOCS MATCHES NOTHING REACHABLE**: there is no reachable `nc-server-01` and no box with the documented 320 GB disk, which is the whole argument for putting the second copy of shot media there; one host's SSH key has CHANGED and was deliberately not overridden. Blocks the cold archive; nothing at risk while it waits, since no asset has reached `recorded`. Earlier: **`npm test` EXITS 0 and all twelve app test files run again**, after
the last two typecheck errors were fixed; **both were live defects in the heartbeat's alarm path**,
not typing noise, and one had a green test whose fixture reproduced the bug. **D5 ANSWERED: there
is no watch path, every push builds and deploys**, proved by three markdown-only commits each
producing a Sentry release. Earlier: **three migrations for content-machine Phase 1**: `variant` on
`content_renditions` with a `NULLS NOT DISTINCT` unique key, four metric columns on
`content_metrics`, and an `instagram/carousel` channel row. **Schema baseline RE-DUMPED** the same
day and its header now names them, since baseline and migrations share a date. Types regenerated;
app typecheck 0 errors, `typecheck:scripts` still failing on the same two pre-existing
`doctor-heartbeat` errors. Earlier: **new `panel` pillar → Kit 3**, and a self-inflicted **two-minute 500** on `/blog/how-to-read-blood-test-results` from switching DB content before the code that defines the pillar had deployed; reverted inside a minute, all 19 articles re-checked at 200, then redone in the correct order. **`npm test` fails on three PRE-EXISTING typecheck errors** and aborts before the rest of the suite runs. Earlier: **two published articles gained kit CTAs** via direct `blog_articles` writes for K2, both checked as rendered images, and the **drafting workspace** was found behind live on the FAI wording while the real mirror was in sync all along. Earlier: **two live copy defects found by the carousel pre-flight and fixed**: the test-selector routing fatigue readers to a testosterone-only kit (CA-033) and the Kit 1 page grading FAI, both verified live; run start pulled in to 2026-08-17. Earlier: `/go` link-in-bio grid for the carousel run built and DEPLOYED, verified live on the real deploy; earlier: the `/waitlist` page was still pre-launch copy months after launch: fixed and verified on a real render; plus results-engine FAI report-only, the badge default, two new upper bands, and the Customer.io all-clear ceiling)._

---

## 🔴 THE HETZNER SERVER INVENTORY IN THE DOCS MATCHES NOTHING REACHABLE (2026-08-14)

**Found while starting plan step 3.5's cold archive, which is specified to live on `nc-server-01`.**
Measured by connecting, not by reading a document:

| Address | What answered | Disk |
| --- | --- | --- |
| `37.27.250.169` | **nc-server-03** | 122 GB free of 150 GB |
| `37.27.85.240` | **nc-dev-02** | 87 GB free of 150 GB |
| `188.245.220.164` | 🔴 **host key CHANGED**, not connected | unknown |
| `49.13.166.153` | connection timed out | unknown |

**There is no reachable `nc-server-01`, and the names do not resolve in DNS.** The 2026-08-13
proposal describes `nc-server-01` as a CPX31 x86 box with **320 GB** of local disk and
`nc-server-02` as CAX31 Arm64. **Neither reachable box has a 320 GB disk** and neither carries
either name. The 320 GB figure is load-bearing: it is the whole argument for putting the second
copy of unrecoverable shot media there.

**No server address exists anywhere in the repo or in either `.env`** — the only textual reference
is a comment in `drive-folders.ts`. So the inventory has never been checkable from here.

⚠️ **The host key on `188.245.220.164` has changed** (it is the address with three `known_hosts`
entries). Benign if that box was rebuilt or reimaged, and not benign otherwise. **Deliberately not
overridden**: this needs a knowing decision, not a script passing `StrictHostKeyChecking=no`.

✅ **RESOLVED the same night, by Keith's Hetzner console screenshot.** The console labels and the OS
hostnames simply disagree: **`nc-server-01` IS `37.27.250.169`**, which reports its own hostname as
`nc-server-03`, and `nc-server-02` is `37.27.85.240`, reporting `nc-dev-02`. The other two addresses
are not part of this project, so **the changed host key is not on either Andro Prime box** and is
moot here. **Both are 160 GB**, so the documented "320 GB" was the total across the pair. The cold
archive is built and proved against `37.27.250.169`.

**The durable lesson, since it will mislead the next person too: `hostname` is NOT how you confirm
which of these machines you are on.** Identify by IP.

**This is the same failure shape as the Supabase-tier correction made hours earlier** — an
infrastructure fact written into a document once, cited onward by later documents, and never
re-read from the machines it describes.

⚠️ **Unrelated but found in passing: `~/.ssh/root password.txt` holds a root password in plain
text** on this machine. Not opened. Worth moving into a password manager, particularly ahead of CQC.

## `npm test` RUNS AGAIN, D5 is answered, and the heartbeat's alarm path was broken (2026-08-14)

### `npm test` exits 0 for the first time since the errors appeared

**All twelve app test files run.** The suite is `typecheck:scripts && <12 files>`, and that
typecheck had been exiting 1 on three errors in content tooling, so **none of the twelve ever
ran** — including the results-classifier regressions, quiz routing, checkout, the bundle suites
and the Customer.io consent gate. One error was cleared on 2026-08-14 by regenerating
`lib/supabase/types.ts`; **the last two are now fixed** and `test-classifier-regressions.ts` alone
is back to 34 assertions over the clinical routing.

**This did NOT require the package move.** Plan step 2.1 bundles the fix with relocating 29
scripts to `packages/content-engine/` and updating ~25 path references, four of which are
absolute paths inside Windows scheduled tasks. The move is deferred while the carousel run is
starting; the two-line fix that delivers the actual value is done.

🔴 **Both "type errors" were live defects in the alarm path, not typing noise.** `doctor-heartbeat`
is the job that reports the nightly doctor's DEATH, and both faults sat in the escalation it
exists to deliver:

- `findOpenTask` read `t.status?.status`, the RAW ClickUp shape, on a `CuTask` that has no
  `status` property. It evaluated to `undefined` on every task, so no task ever counted as
  settled and the function returned **the first marker-named task whether or not it was closed**.
  The next time the doctor went quiet, the alarm would have been a comment on a long-resolved
  task.
- `createTask` was called with three positional arguments where it takes one object, so `listId`
  would have arrived as the whole args object and the task creation would have failed outright.

**Both were latent** — the heartbeat has run daily and never had to alarm, so neither path had
executed. **A test was green over the first one**, because its fixture supplied `{ status: {
status: 'complete' } }` cast to `CuTask`: the fixture reproduced the defect instead of catching
it, and the `as CuTask` cast is what let the compiler stop asking. Fixture corrected to the real
field with no cast.

### D5 ANSWERED: yes, a docs-only commit triggers a full build and deploy

**There is no watch path. Every push to `main` builds and deploys**, whatever it touched.
Measured rather than read off a console: three consecutive **markdown-only** commits on 2026-08-13
(`95f534d`, `f7f7aaa`, `77b7db0` — two `.md` files each, no code) each produced its own **Sentry
release**, and a release is created by the Next build uploading source maps, so a build ran for
each one.

**What it costs:** a full container build and swap for a commit that changes no served byte. **The
risk worth naming is not the waste**: it is that a docs commit deploys whatever state the build is
in. If a dependency or a config drift has broken the build since the last code change, a
documentation edit is what discovers it, in production.

**Not yet decided:** whether to configure a watch path. Coolify has no API token in this repo, so
setting one is a console action for Keith. This entry is the answer to the question, not the
change.

## Schema: `variant` on renditions, four metric columns, and the baseline re-dumped (2026-08-14)

**Three migrations applied, all for Phase 1 of the content-machine plan.** Detail and reasoning in
`06_marketing/content-machine/STATE.md`; what belongs here is the database layer.

| File | What |
| --- | --- |
| `20260814_content_renditions_variant.sql` | `variant` column; unique key becomes `(asset_id, platform, format, variant)` **`NULLS NOT DISTINCT`** |
| `20260814_content_metrics_carousel_and_video.sql` | `saves`, `reach`, `video_views`, `watch_seconds` |
| `20260814_content_channels_instagram_carousel.sql` | one registry row, `in_plan = false` pending Keith's ruling |

**`NULLS NOT DISTINCT` is the load-bearing clause and Postgres 17 is what allows it.** The default
treats nulls as distinct, so a plain four-column key would have silently weakened the old
one-row-per-`(asset, platform, format)` guarantee for the 44 renditions that carry no variant.
**Both directions were proved against the live database** inside a transaction that was then rolled
back: a duplicate null-variant insert is still refused, a second row differing only by variant is
allowed.

**`database/schema/baseline-2026-08-14.sql` was RE-DUMPED after the migrations ran** and its header
now names them, because the baseline and the migrations carry the same date and the ordering could
not otherwise be inferred from the filenames. Object counts re-verified against the live catalogue
and unchanged (29 tables, 6 views, 8 functions, 19 triggers, 11 enums, 24 policies, 29 RLS-enabled,
95 indexes), which is the expected result for column additions and a one-for-one constraint swap.
**The two schema migrations are already in the baseline; the channel-row one is not**, because a
`--schema-only` dump carries no data.

**`lib/supabase/types.ts` regenerated** and carries `variant`, `saves`, `reach`, `video_views` and
`watch_seconds`. App typecheck 0 errors. **`npm run typecheck:scripts` still fails on the same two
PRE-EXISTING `doctor-heartbeat.ts` errors** and nothing new; that is Phase 2.1's work.

## New `panel` pillar for Kit 3, and a two-minute 500 on a published article (2026-08-13)

**`lib/content/kitCTA.ts` gained a `panel` pillar** → `/kits/hormone-recovery`, Kit 3, label "See the Hormone & Recovery Check" (Keith, 2026-08-13). It existed for `how-to-read-blood-test-results`, whose CTA had nowhere correct to point: every other pillar resolves to Kit 1, Kit 2 or the waitlist, and routing whole-panel intent at a four-marker kit is the "nearly match" the map's own comment warns against. Kit 3 is what CA-031's approved mapping names for that topic and what close B on the same article already says. **Both carousel-relevant CTAs now carry UTM tagging**, which the hard-coded `ctaHref` form silently skipped.

⚠️ **Incident, self-inflicted, resolved: `/blog/how-to-read-blood-test-results` returned 500 for about two minutes.** The article body (in `blog_articles`) was switched to `pillar="panel"` **before** the code that defines that pillar had deployed, so `resolveKitCTA` threw at render. Reverted the body within the minute, confirmed 200, then re-checked **all 18 published articles at 200** before continuing. _(Count corrected 2026-08-14, from 19: `blog_articles` holds 19 rows but one, `cortisol-belly`, has been a draft since it was created on 2026-08-07 and has never been published — `published_at` is null and `updated_at` equals `created_at`. The original figure counted rows rather than published rows. This was invariant I7's only live violation.)_ **The DB write is instant and the deploy is not, so the two cannot be one step.** Correct order, used for the redo: deploy the code, verify it, then switch the content. Recorded as OBS-219.

**The obvious deploy canary was useless here and that is the reusable part.** A client-chunk fingerprint on the article page sat unchanged through **ten polls over five minutes**, because `kitCTA.ts` is server-side and never reaches a client bundle: the probe could not have moved regardless of deploy state, and ten flat readings are indistinguishable from a failed deploy. What settled it was **the new capability as its own probe** — the resolved CTA emitting `/kits/hormone-recovery?utm_source=blog&utm_medium=article&utm_campaign=how-to-read-blood-test-results`, a string only the new build can produce.

**`npm test` does not currently pass, and it did not before this session either.** Three pre-existing typecheck errors in `scripts/content-engine/doctor-heartbeat.ts` (2) and `metricool-schedule.ts` (1), identical at `cc51f1b`. The suite aborts at typecheck, so **every test after it silently does not run** — which is how a real failure in `test-kit-cta.ts` went unnoticed until it was run standalone. Worth fixing, because a suite that stops at the first gate is not a suite.

---

## Two published articles gained kit CTAs, and the repo mirror was found behind live (2026-08-12)

**Live content change, made directly to `blog_articles`** because there is no repo-to-DB push path for article bodies: `content-sync.ts` only mirrors DB state INTO the repo and issues no writes. The DB is authoritative for what a reader sees; `06_marketing/seo-ai-search/article-drafts/*.mdx` is a mirror.

**What changed**, both rows written with an audit revision (`blog_article_revisions.editor = k2-close-c-kit-cta-2026-08-12`), guarded so a non-matching string would have been a no-op rather than a partial write:

- **`free-androgen-index`**: its existing closing kit ask wrapped in `<InlineKitCTA ctaHref="/kits/testosterone">`. Destination unchanged, it was already correct.
- **`how-to-read-blood-test-results`**: closing **test-selector** ask replaced with a Kit 3 CTA (`/kits/hormone-recovery`, nine markers, no price). The selector link was **moved up** into the "Which test should you take?" section, because that CTA was the article's only `/test-selector/` link and deleting it outright would have removed the route.

Driven by **K2 on CA-034**: close C of the carousel run lands on these articles, and the run now tests one offer at three distances. **10 of 10 carousel articles now carry the component**, verified by query, and **both pages were checked as rendered images** at the CTA, not as stripped HTML.

✅ **Mirror re-synced and clean. An earlier version of this entry overstated the problem and is corrected here.**

**The git mirror is `frontend/content/blog/*.mdx`, and it has a keeper: `scripts/content-engine/sync-mirror.ts`.** DB is the source of truth, the script is body-only (frontmatter kept verbatim), it writes only on a genuine difference, and it runs after the orchestrator tick. Before tonight **all 19 published articles were in sync**. The two DB writes above put exactly those two files out of sync; `npx tsx scripts/content-engine/sync-mirror.ts` restored them and a re-run reports **"mirror already in sync"**.

**What was actually stale is a different directory.** `06_marketing/seo-ai-search/article-drafts/free-androgen-index.mdx` still carried the pre-K1 FAI wording. That is the **drafting workspace**, not the mirror: nothing syncs it, it is not slug-aligned (pillar-named files, a dated `-reopt-2026-07-30` variant, two `myth-of-normal-range` copies, no `why-am-i-always-tired`), and it is not expected to track live. **So the packet's live-versus-mirror caveat was already discharged by tooling I had not found**, and the "eight undiffed articles" risk recorded earlier did not exist.

⚠️ **The residual is smaller and real: `article-drafts/` is a trap for anyone drafting derivatives.** It reads like a per-article source, it is where a search for `<slug>.mdx` lands first, and its copies can be arbitrarily far behind live. That is exactly how the pre-K1 FAI wording was picked up here. **Derivative work should source `frontend/content/blog/<slug>.mdx`**, which the carousel pre-flight correctly did (`--source frontend/content/blog/<slug>.mdx`).

**Two schema facts worth keeping**, both contradicting the CA-034 packet: `blog_articles` has **no `has_kit_cta` column** (the real test is whether `body` contains `InlineKitCTA`), and **`current_revision_id` is stale on both rows**, pointing at revisions whose body matches neither the live body nor the newest revision. The 2026-08-10 voice pass also inserted revisions without repointing it, so this is existing practice rather than damage introduced here, but the pointer cannot currently be trusted to identify the live body.

**And one process fact, learned the slow way.** There was no need to hand-write the mirror update: `sync-mirror.ts` does it, correctly and body-only. It was not found because the search went looking for a repo-to-DB **push** path (which genuinely does not exist, and `content-sync.ts` says so loudly) and stopped there, rather than for a DB-to-repo **export**. **Both directions exist as scripts and they are not the same question.** `import-blog-to-db.ts` and `export-blog-from-db.ts` are the other two.

---

## Two live copy defects the carousel pre-flight found in the app, both fixed and verified (2026-08-12)

Neither was in the carousel. Both were in the product the carousel points at, and both were found only because the per-post pass followed the destination rather than stopping at the slide.

- **The test-selector routed fatigue readers to a testosterone-only kit.** Q1 option (a) read *"I am knackered, my drive has gone, or I just do not feel like myself anymore"*, which is two presentations in one option, so a brain fog, B12 or tiredness reader picked it, answered desk-based on Q2, and `getResult` returned **Kit 1**. That is what **CA-025** forbids. Fixed by splitting the option, not rewriting the map: (a) narrowed to the hormonal presentation, new stored value `d` for the fatigue picture routing to **Kit 2**, every existing branch untouched. **Approved as CA-033** (Keith, conditional on this fix; Ewa not required because the remedy removes the out-of-scope outcome rather than accepting it). `scripts/test-quiz-routing.ts` added, 21 assertions, wired into `npm test`; the map had **zero** coverage before. **Verified live** on build `vgLPXfPWVcFM2ESumkN3o`, on the plain URL as well as a cache-busted one.
- **The Kit 1 landing page graded the one marker the engine refuses to grade.** It rendered FAI as `36.9` with a **`Borderline`** badge, beside Total T `Borderline` and SHBG `Normal`, on a value just above the lab floor of 35.0, so it read as a near-miss finding. `classifier.ts:295` maps FAI to `fai-reported`, whose copy is *"Reported for reference, not interpreted"*, returning no CTA and excluded from vetoing an all-clear. Badge → **`Not interpreted`** (grey, dashed), subtitle "Bioavailable testosterone ratio" → "Ratio of total T to SHBG". **Keith ruled FAI stays on the panel** (the lab returns it, the customer receives it, we do not interpret it), so **nothing was deleted**. **Verified live**: new strings present, old subtitle absent, on the served page.

⚠️ **`/test-selector` carries `cache-control: s-maxage=31536000`, a one-year edge cache.** It behaved on both deploys, but on a page whose copy changes for compliance reasons that header is a standing risk. Not actioned.

⚠️ **Deploy verification lesson, recorded because it cost three attempts.** A build-ID canary reported a false positive: the baseline had gone stale behind an intervening push, so it flipped for the *previous* commit's build. Only the copy assertion beside it caught that. **Watch the changed string, not a build fingerprint** — and an earlier attempt watched a content-hashed chunk filename, which cannot change when a commit touches no frontend source, so it could only ever have reported failure. (`OBS-212`.)

---

## `/go` link-in-bio grid for the carousel run: LIVE (2026-08-11)

Attribution surface for the 30-day Instagram carousel run (design + metrics in `06_marketing/STATE.md`; copy approved as CA-031). **Deployed and verified on the real deploy**, commit `c69dff5`.

**Verified live, not inferred from the push:** `/go` serves 200; the served HTML carries `<meta name="robots" content="noindex, nofollow">`; `/go/start` 307s to `/test-selector` tagged `utm_term=unmatched`; `/go/d05` 307s to **`/kits/energy-recovery`** tagged `close-B`, which is `why-am-i-always-tired` routing to Kit 2 rather than Kit 1, so the CA-025 scoping rule holds in production and not only in the doc; `/go/d06` 307s to `/blog/brain-fog` tagged `close-C`. Rendered at a true 390px mobile viewport with `document.scrollWidth === window.innerWidth === 390`.

**BOTH DONE (Keith, 2026-08-12):** `CAROUSEL_RUN_START` is set in Coolify to **`2026-08-17T12:00:00Z`**, buildtime and runtime both ticked, and the `keith.antony.ai` Instagram bio is pointed at `/go` and tested by Keith.

🔴 **THE RUN START MOVED IN, from 2026-09-01 to 2026-08-17 (Keith, 2026-08-12).** That is **five days** from the decision, not twenty. It compresses everything still owed before day 1, and the binding one is not code: **Ewa has not signed off the 30 posts.** CA-031 and CA-032 approved the close templates and the headline rows; neither covers the posts. Nothing may ship without that signature, and it now has a five-day window.

⚠️ **Two consequences, neither obvious from the page.**

1. **The run start is now a posting constraint, not just a config value.** `visiblePosts()` reveals day 1 at the anchor instant and each later day exactly 24h on, so **nothing may be posted before 2026-08-17 12:00 UTC** (13:00 BST), and each daily post should go out at or after that time of day. Post earlier and the tile a reader taps through for does not exist yet.
   ✅ **HONOURED IN THE SCHEDULE, 2026-08-13.** All 30 Metricool posts are set to **13:00 Europe/London**, exactly the anchor instant on day 1 and +24h thereafter. This constraint was load-bearing in practice, not just on paper: Keith asked for the run to start "after 12 a.m." on the 17th, which would have put **every** post 12 hours ahead of its own tile for the whole run. It was reconciled onto the anchor rather than by moving `CAROUSEL_RUN_START`. **If the anchor ever moves, `06_marketing/content/instagram/carousel-prototype/schedule.js` moves with it** — its `--check` asserts day 1 is 2026-08-17 13:00 London and fails the build of the schedule otherwise, so the two cannot drift apart silently.
2. **The live page cannot confirm the variable arrived**, so do not read it as verification. `/go` currently serves *"Nothing posted yet. In the meantime, three questions will point you at the right test."* with a `/go/start` CTA, and that is the identical output for BOTH `RUN_START_ISO` unset AND set to a future date, because `visiblePosts()` returns `[]` on either. The two states are indistinguishable from outside. It resolves either after a deploy plus a check past 2026-08-17, or by reading the running container's environment. The empty state is a designed fallback with a working CTA, not a dead end, which softens the per-post pre-flight's C1 finding without clearing it.

- **`app/go/page.tsx`** renders one tile per posted day, newest first, mirroring how the Instagram grid reads. **`app/go/[slug]/route.ts`** records the click server-side then 307s to that post's destination with UTMs stamped (`utm_content` = post, `utm_term` = close). **`lib/bio-grid.ts`** holds the ten topics, the three closes and the rotation.
- **The bio link is set ONCE and never rotated, and that is the whole point.** Rotating it daily was the first design and it is wrong: Instagram keeps surfacing a post for days, so a day-3 post collects clicks on day 8 when a rotated link points at a different close. Late clicks would attribute to the wrong close, and the later the click the more wrong. Each post instead owns a permanent `/go/<slug>`.
- **Two new server-side events**, `bio_grid_view` and `bio_tile_click`. Server-side deliberately: the traffic arrives in Instagram's in-app browser, the worst place to depend on client JS, and a tile click is a redirect that must be recorded before the user leaves. The pair separates "the post was interesting" from "the offer was interesting".
- **Titles are read from `blog_articles` via `getAllArticles()`, never from the repo MDX**, and that decision was load-bearing rather than tidy. The MDX mirror still carries the pre-correction Free Androgen Index headline that the 2026-07-30 ruling overturned, so hardcoding titles would have put a retracted framing on a live page. Reading through means a re-titled article corrects itself.
- **`noindex` via page metadata, and deliberately NOT added to `robots.ts` disallow.** A disallowed page cannot be crawled, so the crawler never reads the noindex and the page can still be indexed from an inbound link. The two are mutually exclusive; this picks the one that works. It is absent from `app/sitemap.ts` already, which is an explicit allowlist.
- **An unknown slug redirects to the quiz rather than 404ing**, and records the miss. A bio-link tap that dead-ends is a lost visitor; the quiz is the ratified cold-traffic destination anyway, so the failure degrades to the default instead of to nothing, and a broken tile shows in the data rather than as silence.
- **Verified: `tsc --noEmit` clean, `compliance-preflight` 0 HARD / 0 REVIEW, and rendered at a true 390px mobile viewport** with `document.scrollWidth === window.innerWidth === 390`, so there is no horizontal overflow hiding behind `body{overflow-x:hidden}`. The rotation was read off the render: closes cycle A/B/C up the page with no topic repeating.
- **Screenshot method note, because it produced a false defect.** `chrome --headless --window-size=W,H --screenshot` does **not** set the layout viewport: it lays out wider and crops to W, so a narrow capture shows clipped text that is not clipped in a real browser. The first `/go` capture looked broken; an existing known-good page clipped identically at the same width, which is what identified the tool rather than the page. Use `Emulation.setDeviceMetricsOverride` over CDP (Node 24 has a global `WebSocket`, so no npm dependency is needed).
- **~~OWED before the run~~ DONE 2026-08-12:** `CAROUSEL_RUN_START` is set in Coolify to `2026-08-17T12:00:00Z` and the Instagram bio points at `/go`. Unset still renders the empty state by design rather than exposing the unposted schedule, which is why the served page cannot distinguish "set to a future date" from "never set". See the run-start block near the top of this file for the posting constraint that date creates.
- **Flagged, Keith's call:** the site-wide cookie banner covers the top two tiles on first visit. Everywhere else that is cosmetic; here the top tile is the newest post, which is the single thing most visitors arrive looking for.

## The `/waitlist` page was still a pre-launch page, months after launch (2026-08-07)

Found by Keith opening the destination of a new article's call-to-action. **`/waitlist` told every
visitor the brand was "launching soon" and listed Kit 1, Kit 2 and Kit 3 under a "What's coming"
heading, at the exact prices they are buyable for today.** Verified against reality before touching
anything: `/kits` serves all three at £99 / £119 / £179, HTTP 200, with live buy paths.

**Four live articles funnel readers into that page** and inherited the claim:
`cholesterol-test`, `liver-function-blood-test`, `signs-of-stress-in-men` and `thyroid-test`, plus the
`cortisol-belly` draft now with Ewa. They route via the `metabolic` / `liver` / `stress` / `thyroid`
pillars in `lib/content/kitCTA.ts`, which hold at email capture **by design** because no live product
matches those intents. **The routing was correct and is unchanged; the page's premise was what had
gone stale.**

**Fixed in `app/(marketing)/waitlist/page.tsx` and `components/marketing/WaitlistForm.tsx`:** the hero
now leads with "The panel you want isn't on the list yet" and states that three checks are available
now; the panel is relabelled **"Available now"** with each kit linked to its own page and a line
saying these three ship today; the form success message points at `/kits` instead of promising to
email when the brand launches; the page metadata, the "Early Access" badge and the "Early access"
trust item are all corrected.

- **No future product is named.** Kit 3 Plus and Kit 5 Thyroid are next in the locked sequence but
  their May timings have passed, and **Kit 6 Cortisol is parked** pending Vitall on dried-blood-spot
  viability. Naming any of them would have recreated the same failure one product later. The page now
  promises a category, not a roadmap.
- **Consent copy changed, flagged deliberately.** The opt-in label moved from "Email me launch updates
  and early-access offers" to "Email me when new panels launch, and occasional offers." Same
  processing purpose, no scope change, but it is the record of what subscribers agree to and is worth
  a solicitor's eye at the next review.
- **Verified on a real render, not a typecheck.** Screenshotted the served page on the dev server.
  **The screenshot caught two stale claims a grep had missed** (the "EARLY ACCESS" trust badge and the
  consent line), which were then fixed and re-shot. Final rendered sweep: zero hits on every stale
  phrase, zero em dashes, all three kit links present.

**The wider lesson, and it is not fixed by this change.** The article's own call-to-action wording was
correctly scoped to the one unlaunched thing and passed `compliance-preflight` cleanly. The pass
checks the copy under review; nothing checks the page that copy links to. **A shared destination is
the highest-leverage place for a stale claim to hide, because nothing that links to it changes when it
goes stale.** Recorded in the task-observer log as an extension needed to the availability check.

## Results engine: four defects closed, two new bands built (2026-08-07)

Triggered by Vitall confirming their per-assay reference ranges on 2026-08-06, which made several
long-standing gaps visible for the first time. Commits `56f3a5e`, `1ce4850`, `56b8ff9`. Full
reconciliation: [`05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md`](../05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md).

**1. Free Androgen Index was asserting normality for every value.** Ewa's ruling is report-only, and that
was implemented by leaving FAI out of the classifier, so it fell to a `default` branch that badged the card
"Optimal", headed its footer "Keep it up", and told the customer "within the normal range / no action is
needed" for any number, including below the lab's floor of 35.0, while the bar rendered it red. Those
strings also print on the **CSV export and the GP handoff sheet**. Now a dedicated `fai-reported` state:
no badge verdict, no traffic-light bar, no CTA. Wording approved by Ewa 2026-08-07 ("fine for now").

**2. An all-clear result badged every marker "Action Needed".** The badge was a switch with a default, and
eight of twenty-eight states had no case; five of them mean the result is fine. A clean Kit 2, the most
common result we will ship, showed four black alarms on four in-range markers. Now an exhaustive
`Record<ResultState, BadgeConfig>`, so a new state cannot be added without deciding its badge, verified by
adding a throwaway state and confirming the build fails. Runtime fallback now fails quiet, not loud.

**3. Two new GP-routed upper bands** (Ewa, 2026-08-07): testosterone `> 29`, vitamin D `> 250`. See
`04_products/STATE.md` for her ruling.

**4. The bands were not a classifier-only change, and this is the one that would have hurt.**
`isTestosteroneAllClear()` and the vitamin D leg of `results_all_clear` had no upper bound either, and both
feed **Customer.io**. A man at 35 nmol/L would have been GP-referred on his dashboard while simultaneously
being enrolled in **seq-03c, the reassurance sequence for normal results**. Both closed here.

Also: SHBG fallback moved off a generic 17-55 onto Vitall's 20.6-76.7; Active B12's `>37.5` reference range
now renders on the card (it was the only marker showing none, because the display keyed on the upper bound
alone); testosterone card copy corrected to the real range; the unit guard now folds micro-sign variants;
an unmapped marker warns instead of being silently dropped; all fixture ranges aligned to the real assay,
including B12's invented upper bound, which is what hid defect 2 from QA.

**Regression coverage went from 26 assertions to 34**, pinning both new cut-points, the GP routing and the
Customer.io signal. `npm test` still cannot run end to end: it dies at its first step, `typecheck:scripts`,
on three PRE-EXISTING errors in content-engine scripts (`doctor-heartbeat.ts` x2, `metricool-schedule.ts`)
that have nothing to do with the results engine. **The results suites had to be invoked directly.** Worth
fixing on its own: the guard protecting the results engine sits behind an unrelated broken typecheck.

**Found in passing and fixed:** the results card still told a normal-testosterone customer the Daily Stack
provides "30mg of elemental zinc". Ewa cut it to **25 mg** on 2026-08-02 and `daily-stack.md` records that
as applied to "all three site surfaces the same day". The results engine was not one of the three. The LP
was already correct.

## DEPLOYED 2026-08-04: `order_ref`, `is_test`, one base-URL helper

The three items left open by the £9900 pass, plus the base-URL duplication.
**Shipped in commit `b85b810` and VERIFIED LIVE 2026-08-04**: `GET /order/confirmed`
returns the new order-reference block ("Your order reference", "confirmation email we have
just sent"), neither of which existed anywhere in the codebase before this change.
Migrations were applied to prod Supabase ahead of the deploy, which is the required order:
the code selects `order_seq` on the kit-order insert, so shipping it against a table
without the column would have broken order creation.

**The live Customer.io template was swapped after the deploy and is done** (below), so the
chain is complete end to end: a kit purchase now emits `order_ref`, the confirmation email
renders it, and the customer can find it again on `/order/confirmed`, on `/account`, or by
quoting it to support. Nothing on this item is outstanding except seeing one real purchase
through.

**Verification note worth keeping: the Sentry releases endpoint is not a deploy signal.**
It still showed the previous commit nine minutes after the new build was demonstrably
serving, because a release row is created by the sourcemap-upload step, not by the deploy.
Use a two-sided page canary against the live URL; treat the release list as evidence about
sourcemaps only.

### `order_ref`: customer-facing order reference, BUILT

Built to `docs/2026-08-04-customer-facing-order-reference-spec.md` (option B, our own
sequence, not Vitall's number).

| Piece | Where |
| --- | --- |
| `kit_orders.order_seq` (identity, live base 10000) | migration `20260804_kit_orders_order_seq.sql` |
| `AP-{order_seq}` rendering + `parseOrderRef` for support lookup | `frontend/lib/orders/orderRef.ts` |
| `order_ref` on the `purchase` event | `app/api/webhooks/stripe/route.ts` (kit branch) |
| `Order ref: {{ event.order_ref \| default: event.order_id }}` | `email-templates/html/transactional-t01-order-confirmed.html:46` (spec) **and CIO template 38** (live) |
| Reference shown on `/order/confirmed` | `app/(marketing)/order/confirmed/page.tsx` + `lib/orders/getOrderRefForCheckoutSession.ts` |
| Reference shown per order on `/account` | `lib/account/getAccountData.ts` + `app/(app)/account/page.tsx` |
| Support lookup by reference / email / Vitall id | `lib/admin/findOrders.ts` + `app/admin/dashboard/page.tsx` |

`order_id` (the UUID) is still emitted: it is the join key for downstream events and
Vitall's `partnerOrderId`. It is just no longer the thing a human is asked to read out.

**Support lookup, the other half of the reference.** `AP-10042` is only worth anything if
whoever the customer quotes it to can find the order, and there was no order-search surface
anywhere. `/admin/dashboard` now has one. It classifies the query by shape rather than
making support choose a field: digits with an optional `AP` prefix are a reference (`AP-10042`,
`ap 10042`, `10042` all parse), an `@` means email, anything else is treated as a Vitall order
id for when the conversation is with Ben rather than the customer. It runs on the service-role
client, because support is looking up somebody else's order by definition and RLS would return
nothing. Test orders are badged in the results so a process test is never mistaken for a sale.

**Found while building it: `/auth/post-checkout` dropped `session_id` on the way back.**
It redirected to `failureUrl`, which carries no query. A first-time buyer always goes
through that route, so the confirmation page could never have resolved a reference for the
one customer who most needs it. It now preserves `session_id` and stamps `post_checkout=1`,
and the page treats that stamp as "sign-in already attempted" so the pair cannot loop.

**Live-DB state after backfill** (verified by query, not inference):

| `order_seq` | `vitall_order_id` | `is_test` |
| --- | --- | --- |
| 1 | 322942444 | true |
| 2 | 322942529 | true |
| 3 | 322947256 | true |

Live orders start at **AP-10000**, above the test rows, so no real customer is handed a
reference that reads like an internal test. Verified on the sequence itself
(`last_value 10000, is_called false`), not assumed from the migration.

**The migration did not work as first written, and the fix is worth keeping in mind for any
future identity backfill.** `add column ... generated by default as identity` hands the
existing rows `1..N` immediately, in arbitrary order, so the backfill that then assigns the
same range collides against `kit_orders_order_seq_key`: Postgres checks a unique index row by
row, not at end of statement, and the first attempt failed on `duplicate key value ... Key
(order_seq)=(1) already exists`. It now runs in two passes, parking the values in the negative
range to free `1..N` first. The file was edited rather than superseded because the failed
attempt rolled back, so no version of it had ever run.

Second sharp edge, not in the spec: `restart with 10000` moves the sequence's CURRENT value
but leaves its `start_value` at 1, so a later bare `restart` would have dropped straight back
into the test range. The floor is moved by its own migration,
`20260804_kit_orders_order_seq_start_floor.sql`, which runs next in filename order.
Verified in prod: `start_value` is 10000.

### DONE 2026-08-04, after the deploy: the live Customer.io template

The live T-01 content lives in CIO (campaign 11 → action 82 → template 38) and is what
customers actually receive; the repo HTML is only the spec. Template 38 now reads:

```liquid
Order ref: {{ event.order_ref | default: event.order_id }}
```

**The sequence was deliberate: code deployed first (`b85b810`), template swapped second.**
Swapping first would have left `event.order_ref` undefined on any order placed in between.

**And it is a `default:` fallback rather than a bare swap**, in both CIO and the repo HTML,
so the one bad outcome is unreachable: if `order_ref` is ever missing or empty the line
renders the UUID, which is exactly the behaviour that shipped for months, instead of "Order
ref:" followed by nothing on a receipt. `order_seq` is an identity column so it should never
be empty; the fallback costs nothing and removes the need to be right about that.

Verified after the write, not assumed: body length is the original 5576 plus exactly the 27
characters added, and the tag counts (14 paragraphs, 3 tables, 5 `<td>`, 4 Liquid outputs, 9
Liquid tags), the merge-field order, and the subject all match the pre-edit template.

**Still worth one real purchase** to see an `AP-1000x` land in an inbox end to end. Nothing
is blocked on it, and the fallback means a bad outcome degrades to the old UUID rather than
to a blank.

### `is_test`: internal orders no longer count as sales, BUILT

`kit_orders.is_test` (migration `20260804_kit_orders_is_test.sql`), set true on the three
process-test rows. Every KPI view that counts kit orders now filters it out:
`v_gate_tracker.total_kits_sold`, `v_weekly_kit_sales`, `v_kit_pipeline`, and
`v_result_to_supplement_conversion` (joined through `lab_results.order_id`).
`v_gate_tracker.total_kits_sold` **went 2 → 0**, which is the true Gate 0A count.

Nothing in the app writes `is_test`; it is set by hand. Any NEW view over `kit_orders` has
to carry the filter; the reminder is in the header of `database/views/pipeline_overview.sql`.

### Base-URL helper: nine copies, now one, BUILT

`process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'` was pasted into nine
modules with three different spellings of the fallback (`??`, `||`, and one
`http://localhost:3000`). Now `frontend/lib/site-url.ts` exports `SITE_URL` (trailing slash
stripped) and `siteUrl(path)`.

Three callers deliberately did **not** collapse, and each now carries a comment saying why:

- `app/auth/callback/route.ts` and `lib/auth/actions.ts` resolve the origin from the
  request first (x-forwarded-host / Origin) so preview deployments work; they only use
  `SITE_URL` as the fallback.
- `app/layout.tsx`'s `BASE_URL` stays the hard-coded production origin because schema.org
  `@id` values are stable global identifiers and must not change on a preview host.
  `metadataBase` on the same file is the one that follows `SITE_URL`.

Out of scope and left alone: `scripts/content-engine/*` (different precedence,
`CONTENT_ENGINE_BASE_URL` first, and its own env loader) and the deprecated
`lib/activate/sendActivationLink.ts`.

### The `/order/confirmed` hydration error: the previous diagnosis was wrong

Pulled the actual events from Sentry rather than reasoning from the code. `JAVASCRIPT-NEXTJS-7`
is **39 occurrences spread across the whole site**, not a `/order/confirmed` problem:

| Transaction | Count |
| --- | --- |
| `/blog/preview/:slug` | 14 |
| `/blog` | 11 |
| `/blog/:slug` | 6 |
| `/kits/*` | 6 |
| `/checkout/details` | 1 |
| `/order/confirmed` | **1** |

**So the auth-branch theory is falsified.** `/blog` and `/kits/testosterone` have no auth
branch and no client state, and they fail identically to the pages that have both. Every
event is Chrome (148 then 150) on Windows with no user attached, and 14 of them are on
`/blog/preview/*`, a Keith-only route. That is the documented browser-extension case:
something writes attributes onto the document element before React hydrates.

**Done:** `suppressHydrationWarning` on `<html>` and `<body>` in `app/layout.tsx`. React
only suppresses one level deep, so this silences the extension's attributes without hiding
a genuine mismatch inside any page. The previously-proposed "small redesign of
/order/confirmed" is **not** the fix and was not done.

**CONFIRMED by Keith 2026-08-04.** He loaded `/blog` in an incognito window with extensions
off. The page rendered normally **and Sentry recorded no new `JAVASCRIPT-NEXTJS-7` event**;
its last occurrence is still `2026-08-04T19:05:11Z`, which predates both the mitigation
deploy and the incognito load. The extension diagnosis stands and the auth-branch theory is
dead. No engineering work follows.

The Sentry check was the part that mattered: React recovers from a hydration mismatch, so
the page looks identical whether or not one fired, and a screenshot alone could not have
settled it.

**One caveat for the next reader, because it changes what this issue's silence means.**
`suppressHydrationWarning` on `<html>`/`<body>` means attribute-level mismatches injected
before hydration no longer report at all, so Sentry going quiet on this issue is now the
expected state regardless of cause and is no longer evidence of anything. React suppresses
only one level deep, so a genuine mismatch INSIDE a page would still surface, as a new
issue rather than as this one.

**Optional tidy-up, BLOCKED ON TOKEN SCOPE, needs Keith:** resolving `JAVASCRIPT-NEXTJS-7`
so it drops out of the unresolved count. Attempted 2026-08-04 and refused:
`PUT /api/0/organizations/andro-prime/issues/120214399/` with `{"status":"resolved"}`
returns `403 You do not have permission to perform this action`, and reading the issue back
confirms it is still `unresolved`. **The `SENTRY_AUTH_TOKEN` in `frontend/.env.local` is
read-only.** It carries issue-READ scope; resolving, ignoring, assigning and commenting all
need `event:write` / `issue:write`. Either click resolve in the dashboard, or issue a
write-scoped token if this should be automatable.

Gates: `tsc` clean, `npm run build` exit 0, `npm test` exit 0 (0 failed across all suites).

---

## FIXED 2026-08-04: every kit order confirmation told the customer they had been charged £9900

Found by Keith reading his own confirmation email from the Kit 1 process test. `Amount: £9900`
for a £99 kit. Kit 2 would have read £11900, Kit 3 £17900.

**Cause.** Stripe holds money in integer pence. The t01 template renders the value literally:

```html
email-templates/html/transactional-t01-order-confirmed.html:47
  Amount: &pound;{{ event.amount }}
```

`app/api/webhooks/stripe/route.ts` has a `formatGbp()` helper for exactly this, and its own
comment says *"Templates render `£{{ amount }}`"*. **The kit-purchase emit was the only one of
four that failed to call it:**

| Line | Event | Before |
| --- | --- | --- |
| ~322 | kit purchase | `amount: session.amount_total` ← **raw pence** |
| ~377 | supplement purchase | `formatGbp(...)` ✅ |
| ~414 | invoice paid | `formatGbp(...)` ✅ |
| ~447 | invoice due | `formatGbp(...)` ✅ |

**Fixed at the emit, deliberately not at the template.** The template is shared with the three
sibling emails that already pass a formatted value; changing it would have broken those. The
emit now calls `formatGbp()` and carries a comment saying why it is required.

Gates: `tsc` clean, `npm run build` clean.

**Reach:** every kit order confirmation sent to date. In practice that is the three internal test
orders, since no external customer has bought yet, so no real customer saw it. It would have hit
the first one who did.

### Raised in the same pass, specced not built. ALL THREE NOW BUILT 2026-08-04, see the entry at the top of this file

- **`order_ref`, a customer-facing order reference.** The same email shows
  `Order ref: 1b429c90-8a80-4c7e-85fb-5873660489fd`, a raw UUID, which is unusable down a phone.
  Full spec with options considered: `docs/2026-08-04-customer-facing-order-reference-spec.md`.
  Recommendation is our own `AP-10042`-style sequence, **not** Vitall's order number: theirs is
  not yet written when the confirmation email fires (the dispatch is a separate fire-and-forget
  call made after the emit), and the lab is expected to change to TDL in ~18 months.
- **`/order/confirmed` shows the customer no reference at all.** Verified: the page reads
  `session_id` from the query string and renders nothing from it. Close the email and there is no
  way to find your order.
- **Still no `is_test` flag in the schema.** Three internal test orders now sit in `kit_orders`
  (`322942444` cancelled, `322942529`, `322947256`) with nothing distinguishing them from sales.

---

## P0 FIXED 2026-08-04: a prefetched GET logout was signing customers out seconds after checkout

**Found by Keith running a real Kit 1 purchase through live checkout.** He was thrown to `/auth/login?error=Invalid login credentials`, then the dashboard white-screened on the password banner. Both symptoms, one root cause.

**Root cause.** `app/auth/logout/route.ts` was a **GET** handler that called `signOut()` unconditionally, linked from `Nav.tsx` and `AppPlaceholder.tsx` as an ordinary `<Link>`. Next.js prefetches links that enter the viewport, and the app nav is `fixed`, so the Log Out link was permanently visible and permanently prefetched. **The browser signed the user out with no click at all.**

Evidence, not inference:

- **Supabase auth log:** login `15:43:15` (magic link, post-checkout) → `logout` `15:43:41`, 26 seconds later, user-initiated: no. Then `POST /token grant_type=password` → `400 invalid_credentials` at `15:46:42`.
- **Sentry `JAVASCRIPT-NEXTJS-V`** breadcrumbs show `?_rsc=` prefetch GETs to the sibling nav links (`/subscriptions`, `/account`) plus a third `[Filtered]` one. The app nav has exactly three links; the third is Log Out.
- **No `PUT /user` anywhere in the auth log**, so the password the customer "set" was never written. `auth.users.updated_at` confirms it.

**Second symptom, same cause.** With the session dead, the banner's X (dismiss) also white-screened. Both dashboard actions call `revalidatePath('/results-dashboard')`, which re-renders `app/(app)/layout.tsx`, which calls `requireAuthenticatedUser()`, which calls `redirect()`. `redirect()` throws, and **the app had zero `error.tsx` files**, so it fell through to `global-error.tsx`: an unstyled page with no branding and no way back. React surfaced it as *"An unexpected response was received from the server."*

**Fixed (7 files):**

| File | Change |
| --- | --- |
| `app/auth/logout/route.ts` | `GET` → **`POST`**, redirect 303. No GET export remains. Carries a do-not-reintroduce note |
| `components/shared/Nav.tsx` | Log Out is a POST form + button (desktop + mobile); other CTAs stay links |
| `components/app/AppPlaceholder.tsx` | Same; dropped the now-unused `Link` import |
| `app/(app)/error.tsx` | **NEW.** Branded boundary for the signed-in app; leads with "Sign in again"; surfaces the Sentry digest as a support reference |
| `app/error.tsx` | **NEW.** Root boundary for the marketing site |
| `lib/dashboard/actions.ts` | Both actions check the session **before** `revalidatePath`, returning "Your session has expired" instead of throwing |
| `components/app/PasswordBanner.tsx` | Dismiss awaits properly (the new return type broke `startTransition`'s void contract) |

Gates: `tsc` clean, `npm run build` clean, `npm test` green, compliance scan **0 HARD / 0 REVIEW** on both new customer-facing pages. Verified no `href="/auth/logout"` remains and the route exports only `POST`.

**The general rule, worth not relearning:** a GET must never destroy state. Prefetch is only the first thing to trip it; link scanners, antivirus and browser preload all issue speculative GETs.

### Still open from the same session

- ~~**`/order/confirmed` hydration mismatch.** The page branches on `isLoggedIn` (lines 96, 99) while the post-checkout flow changes that state underneath it.~~ **SUPERSEDED 2026-08-04.** This diagnosis was wrong, and it was wrong because it reasoned from the code instead of reading the events. Only 1 of 39 occurrences is on `/order/confirmed`; the rest are spread over `/blog`, `/blog/preview/*` and `/kits/*`, which have no auth branch at all. See the entry at the top of this file for the tag breakdown and the actual fix.
- **Sentry read access is now available to tooling.** `SENTRY_AUTH_TOKEN` in `.env.local` was upload-only (`project:releases`); Keith replaced it with one carrying issue-read scope, so production exceptions can be pulled directly. Note it is org-scoped: use `/api/0/organizations/{org}/issues/{id}/events/latest/`, not the project-less path, which 404s.

---

## RESOLVED (2026-08-02, later the same day): the four strings below are fixed in the working tree, and one of the four was never a finding

Ewa signed the wording packet and Keith ruled the two business-status items, both by
email the same evening. **Shipped in commit `965b775` and VERIFIED LIVE 2026-08-02**,
two-sided across three pages: every old string absent AND every new string present on
`/`, `/how-it-works` and `/supplements/daily-stack`, with the deliberately-kept
"designed your report" heading confirmed still serving.

| String | Ruling | Now reads |
| --- | --- | --- |
| `EFSA Regulated` (Footer, every page) | Keith, 2026-08-02 | `EFSA-Approved Claims` |
| `GP-designed report` (homepage `HowTo` JSON-LD :45) | Keith: prohibited | "recommendation logic approved by a GMC-registered GP" |
| `GP-designed report` (homepage body :324) | Keith: prohibited | as above |
| `A real doctor designed your report.` (how-it-works) | **NOT a finding — left alone** | unchanged |

**The fourth row is the important one, and it closes a contradiction this file
created.** The entry below flagged that heading as non-compliant. The Ewa packet,
amended the same day, recorded the opposite: the 2026-07-07 ruling in
`clinical-governance-copy-corrections.md:141` approves "designed" as system-authorship
framing, and by then **two** independent site reviews had already re-flagged it in
error. This file made it three. **Keith's ruling settles it: "designed" as
system-authorship is fine; `GP-designed report` — the compound naming the GP as the
report's designer — is not.** Do not re-flag the heading.

**Also fixed in the same pass, from the Ewa packet (CA-030):** the "treated men" claim
about her (she does not treat, she sees — a live factual misstatement about a named
GP), her TRT/Harley Street credential line on two pages, the `GMC Registered Practice`
badge on `lp/daily-stack` plus the two `GP-Led Formulation` siblings, the
`Personalised to your data` labels on three surfaces, the attributed-quote wording on
three surfaces, and zinc 30mg → 25mg with the claim paraphrase deleted. Compliance
pre-flight run as a delta against the pre-edit baseline: **0 findings introduced, 1
HARD + 5 REVIEW removed.** Full rulings in
`03_compliance/content-approval/ewa-packet-2026-07-26-lp-clinical-wording-and-countersignature-backlog.md`.

### SUPERSEDED, kept for the audit trail: "FOUR non-compliant strings are LIVE on the site, found by review, not yet fixed" (2026-08-02, morning)

An on-page and AI-visibility review (`06_marketing/seo-ai-search/2026-08-02-on-page-ai-visibility-review.md`) flagged them and each was then confirmed in **live source**, not just in build output:

| String | Location | Reach |
| --- | --- | --- |
| `EFSA Regulated` | `frontend/components/shared/Footer.tsx:47` | **every page** |
| `GP-designed report` (inside the `HowTo` JSON-LD) | `frontend/app/(marketing)/page.tsx:45` | homepage, machine-readable |
| `GP-designed report` (body copy) | `frontend/app/(marketing)/page.tsx:324` | homepage |
| `A real doctor designed your report.` | `frontend/app/(marketing)/how-it-works/page.tsx:426` | how-it-works |

**EFSA does not regulate businesses**, so the badge asserts a regulatory status that does not exist, and it is in the footer, so it is on every page. **`GP-designed report` is prohibited framing** and one instance sits inside structured data, which is the worst place for it: machine-readable, and read by exactly the systems that quote a site back as fact. The compliant wording is already elsewhere on both pages: "Recommendation logic approved by a GMC-registered GP".

**Not fixed in this session, deliberately.** These are external-facing copy, so Guardrail #1 applies: route through `03_compliance/CONTEXT.md` before the replacement wording ships. The removals themselves are not judgement calls, but the replacements are.

**A detection lesson worth more than the four fixes.** The `how-it-works` instance is split across a `<br />`, so its text nodes concatenate without a space and an exact-string grep for the sentence does not find it. **Any prohibited-phrase sweep that greps for whole sentences will miss anything broken across markup**, which is most headings on this site.

## Eight published article bodies edited: dead editorial markers removed (2026-08-01)

`blog_articles.body` and the MDX mirror both edited for `14-signs-of-vitamin-d-deficiency`, `b12-blood-test`, `fbc-blood-test`, `ferritin-blood-test`, `how-to-increase-testosterone-naturally`, `liver-function-blood-test`, `low-vitamin-d-symptoms`, `thyroid-test`. Commit `67b9aa1`. Found by `content-doctor` invariant 6; the full audit trail is in `06_marketing/content-machine/STATE.md`, which owns this.

**No rendered output changed, and that was verified rather than assumed.** The markers were JSX comments, which are stripped at render. Proven by fetching `myth-of-normal-range`, whose benign `{/* CTA BLOCK */}` is **still** in the database and returns **zero** hits in the served HTML. So the standard two-sided served-page canary does not apply here: the removed string never appeared in the HTML to begin with, and "old string absent" would have been true before the edit as well. **No `/api/revalidate` call was needed or made.** Verification was done at the layer where the change actually is: `blog_articles` now returns 0 of 18 bodies matching any obligation marker.

**Worth keeping, because it will recur:** a change to `blog_articles.body` is not automatically a change to the page. Comments, frontmatter and anything the renderer drops are invisible downstream. **Before reaching for the served-HTML canary, establish whether the edited text can reach the HTML at all** — otherwise the check passes for the wrong reason and reports a deploy it never observed.

---

## Two live article CTAs corrected: they claimed we had not launched (2026-07-31)

Keith spotted the stress-article CTA. Both fixed in `blog_articles.body` (the served column), revision recorded, `current_revision_id` repointed, revalidated by slug, and verified two-sided against the served HTML: old strings absent, new strings present on both pages. Commit `e029278`.

- **`signs-of-stress-in-men`** said "No kit to sell you today" and "first to know when our men's-health checks launch". Three kits are purchasable (Stripe live, checkout E2E `869d99m5a` passed, all three kit pages serving with prices), so that was false on a page two clicks from a buyable kit. **Live since 2026-06-30 and it survived eight revisions**, most recently 2026-07-24, untouched. The waitlist ROUTING is unchanged and correct: there is no cortisol kit, and `kitCTA.ts` deliberately holds `stress` at email capture. Only the prose changed; it now scopes the gap to cortisol and points to the test selector.
- **`inflammatory-markers-blood-test`** said Joint & Recovery Collagen was "Launching shortly". Supplements were deferred 2026-05-23 to a non-cash waitlist, Gate 0A is not met, and no Stripe price IDs exist. Now says it is not on sale and no date is set. The EFSA Vitamin C wording is untouched.
- **Pre-flight was run as a delta, not on absolute counts**: both files scanned against their pre-edit baseline, zero findings introduced, zero removed, identical sets. The 2 HARD and 9 REVIEW the scanner reports on `inflammatory-markers-blood-test` are all pre-existing in Ewa-approved copy at untouched lines. **Not fixed here, and worth a separate look since two are HARD.**
- **Audit note:** the other three waitlist CTAs (`cholesterol-test`, `liver-function-blood-test`, `thyroid-test`) were checked and are correctly scoped to genuinely unlaunched panels. No change needed.

## DONE: Pillar E ungated in `kitCTA.ts` (2026-07-31)

`lib/content/kitCTA.ts` carried `E: { ..., gated: true }` with the comment "Pillar E content must not exist until Ewa signs the andropause claims pack", and `resolveKitCTA()` threw for it by design. Ewa signed that pack on **2026-07-26** (CA-028) and `/blog/andropause-male-menopause` went **live 2026-07-30**, so the comment was false and the throw guarded nothing. Raised by the CA-028 decision sweep, fixed as its own task.

- **It was dormant, not broken.** The andropause article does not use `InlineKitCTA`; it hand-writes its links to `/test-selector/`, `/kits/testosterone/` and `/kits/hormone-recovery/`. So nothing called `resolveKitCTA('E')` and the page served 200 throughout.
- **What changed:** `gated: true` dropped from `E` (target unchanged at `/kits/testosterone`, `KIT_1`, which is inside CA-028 §5's Kit 1 / Kit 3 permission); the `(GATED)` marker removed from the `PillarId` union; the block comment and the file-header compliance invariant rewritten to record the ungating and its date.
- **The gating mechanism was deliberately KEPT.** `gated?: true` on `KitCTATarget` and the throw in `resolveKitCTA()` both stay, so the next pillar that needs a gate still gets a build failure rather than a silent no-op. Only Pillar E's use of it was removed.
- **Test rewritten, not deleted.** `scripts/test-kit-cta.ts` previously asserted "Pillar E is gated and refuses to resolve". It now asserts two things: that Pillar E resolves and routes to `KIT_1` / `/kits/testosterone` (so the CA-028 routing permission is enforced in CI, not just documented), and that the gating mechanism itself still throws when a pillar is marked gated, restoring state in a `finally`.
- **Verified 2026-07-31:** `npx tsx scripts/test-kit-cta.ts` green, 10 pillars, 10 checks. `npx tsc --noEmit` clean. Full `npm test` exit 0.
- **Still open, and it is a judgement call rather than a defect:** the andropause article does not use `InlineKitCTA` while ten other articles do. Adopting it would route its CTA through the central map, which is the whole point of the map, but it changes CTAs on a live page and the article currently links to three destinations rather than one. Not done here.

## Sign-off gate: first live run corrected the design, and it worked (2026-07-30, commits `39f86a8`, `6c2b50c`)

The gate below shipped reading the **checkbox**. Its first real use showed that was the wrong signal, and the fix is now live.

- **What she actually did:** on the FAI re-opt Ewa answered all five rulings by typing her answer onto the end of each checklist item ("leave it as is", "Keep it", "that's fine") and ticked one of five. Reading the tick alone would have **blocked a fully-answered set**, the mirror image of the bug the gate exists to fix.
- **Her behaviour is better than the design was.** A tick records that she agreed; the text records what she said, and only the second is usable in an audit. So `rulingStates(task, originals)` now counts an item as answered if ticked **or** carrying appended text, extracts that text as the ruling, and compares against the rulings as submitted (read from the reviewed frontmatter, so it diffs against structured data). Item names come back HTML-escaped and are decoded first, or every quoted ruling looks edited. Without originals it falls back to the tick, which is the conservative direction.
- **`recordRulingAnswers` writes her answers into `content_review_log.notes` on approval.** Proven on the live run: the FAI reopt row now reads "Rulings answered at approval (5/5)" with her wording against each question.
- **Re-opt track was missing the gate entirely** on the first pass. `reopt-concierge` read frontmatter from the **live** row, so a re-opt that changes the title named the task after the old one and `ewa_rulings` (which exists only on the proposed revision) was invisible. Now reads the proposed revision, creates the checklist, and shares one `parkedOnRulings` helper and one `rulingsFrom` parser with the new-article track so they cannot fork.
- **End-to-end result:** 5/5 answered, task completed, the 07:00 tick promoted revision `73bf7d77` over live copy, and her answers are in the compliance record. 23 assertions on `scripts/test-rulings-gate.ts`, 32 in the suite, all green.

## Sign-off gate hardened: a named ruling can no longer be answered by silence (2026-07-30, commit `1245ea9`)

The content-engine review gate was binary (ClickUp status `complete` = approved). The andropause hub was approved that way on 2026-07-29 with two CA-028 rulings asked twice, in comments, and never answered. Nothing in the pipeline noticed, because a boolean gate cannot carry a non-boolean answer.

- **Named rulings are now real ClickUp checklist items** under `RULINGS_CHECKLIST` ("Rulings required before approval"), sourced from the draft's new **`ewa_rulings`** frontmatter array. Real checklist items are machine-readable; checkboxes typed into a description are not.
- **`isApproved()` now requires `complete` AND zero unresolved rulings.** That one predicate closes the hole; the rest feeds it.
- **`syncApprovals` has a third state.** Complete-with-unticked-rulings is neither pending nor approved: parked on Ewa, outstanding items written to `content_pipeline.notes`, logged as a `blocked` run, and commented on the task **once** (the prior note is the idempotency marker, so the daily tick can't spam her).
- **`signoff-concierge`** creates the checklist, puts the ruling warning **above** the completion instruction (burying it below is how the original request got closed past), records the rulings in `content_review_log.notes` at submission so the trail shows what was asked even when no answer arrives, and treats a checklist failure as non-fatal but loud.
- **Regression-tested:** `scripts/test-rulings-gate.ts`, 13 assertions, wired into `npm test`. Full suite green, `tsc` clean. The live ClickUp half was exercised end-to-end on throwaway tasks (create, add checklist, mark complete, gate refuses, tick items, gate approves, delete).
- **No retro-break:** tasks created before this carry no checklists, so `unresolvedRulings` returns empty and they behave exactly as before. Confirmed by `orchestrator --dry`: the andropause hub still approves.
- **Skills updated in step:** `/article` documents `ewa_rulings` and requires it for any amber line needing a decision rather than an approval; `/article-to-review` documents the gate, and its invariant 3 was corrected (it claimed re-running `draft-writer` "re-gates" a submitted article; the stage selectors make it a silent no-op).

## WTP quiz block + homepage hero flip: SHIPPED 2026-07-25 (commit `03d4bd5`)

The Van Westendorp willingness-to-pay block is live inside the test-selector quiz, and the homepage hero primary CTA now routes to the quiz (ratified by Keith 2026-07-25; resolves site-funnel-model §5). Built and verified via an Opus 4.8 implement/verify agent loop (adversarial code verify: SHIP, zero blockers; runtime browser verify: all pass; screenshots reviewed by eye).

- **Quiz is now 5 steps** (`components/marketing/TestSelectorQuiz.tsx`): Q1-Q3 → step 4 = recommendation shown **un-priced** + optional WTP card (4 VW £ inputs, age band 18-24/25-34/35-44/45-54/55+, equal-prominence submit/skip) → step 5 = price reveal + CTAs + the unchanged email capture. The VW questions price the **bundle concept matching the recommended kit** (test now + retest later, one order, described without any price) — the only un-anchored read available since bundle prices are dark behind `BUNDLES_ENABLED`. Resolves site-funnel-model §4's open bundle-alignment decision: the WTP block tests bundle price points explicitly; the quiz keeps routing to single kits until the flag flips.
- **Event:** anonymous `quiz_wtp` via the public `/api/events` sink (added to the `EventName` union + `ALLOWED` set). No email, no identity, no cookies (PECR-clean attribution). Submit rows carry `wtp_too_cheap/bargain/expensive/too_expensive` (jsonb numbers), `age_band`, `bundle_concept`, `symptom_flags`, `monotonic`; **skip fires `skipped:true` with no answers** (completion-rate denominator). Retake noise accepted at n≈50 (no anonymousId by design; sanity-check row count vs `quiz_complete` at read time). GA4 mirror receives the params but they are invisible without custom dimensions — **deliberate; Supabase `events` is the analysis source.** Pure logic + read-time SQL: `lib/quiz/wtp.ts`; suite `scripts/test-quiz-wtp.ts` (33 assertions) wired into `npm test`.
- **Hero** (`app/(marketing)/page.tsx`): primary "Find your test in 60 seconds" → `/test-selector`, secondary "Explore Test Kits" → `/kits`, tertiary text link "Or see how it works first" → `/how-it-works`. Intended trade: catalogue CTR drops, routed-AOV + WTP volume rise; glance at week-2 `quiz_complete` volume.
- **Compliance pre-flight run 2026-07-25** (agent, scanner + judgement pass): no HARD fails; previously-approved result-card strings confirmed byte-identical (moved, not edited). Two flags resolved by Keith same day: buttons reworded "See/Skip, just show **the** price" (killed a personalised-pricing misread), and the efficacy-adjacent opener reworded to "Many men choose to retest later to see how their numbers have moved" (drops the claim-adjacency; no Ewa gate needed). Scanner's one HARD hit was a false positive ("treated" in a code comment).
- **DPIA note (from the pre-flight):** the `quiz_wtp` payload carries age band + symptom flags but **no identifier of any kind** (no email, no anonymousId, nothing stored beyond the anonymous events row), so the "anonymous" characterisation holds; recorded here for the DPIA owner rather than editing `03_compliance/dpia/phase0-dpia.md` unilaterally.
- **Owed next:** the **n≈50 WTP read** (read-time SQL in site-funnel-model §4) → feeds the £169/£199/£259 bundle reprice decision (ltv-cac model v2, load-bearing). The block is a **temporary research instrument: retire or rework it once the read is taken.** ClickUp `869e74w93` closes with this ship.

## Two-kit bundle mechanism: LIVE 2026-07-26 (`BUNDLES_ENABLED=true` + `ACCOUNT_ADDRESS_ENABLED=true`)

Built per `2026-07-24-bundle-mechanism-build.md` (this workspace's `docs/`) and the approved bundle plan. **Committed to main + pushed 2026-07-24** (dark behind the flag). ⚠️ The push triggers a Coolify redeploy of the dark code; nothing changes visibly in prod because everything is flag-gated (flag off → byte-identical to before). Nothing applied to any DB. Four verifier rounds passed (A, B+D, C, final integration). Key decisions: **bank-not-refund** on a Confirmation all-clear (auto-refund loses the Stripe fee; a manual, no-questions-asked refund-on-request path exists via `scripts/ops/cancel-bundle.ts` + a manual £70 Stripe refund), soft address-check window (4 days, auto-dispatch to whatever address is current), interval-shaped Confirmation trigger (`CONFIRMATION_INTERVAL_DAYS`, default 0, single reviewable constant for Ewa), and (kit-page design, same session) **bundle-forward pages that close on the offer** with **Kit 3's £259 SKU reframed as a "retest add-on"** rather than a second "bundle" (Kit 3 is already sold on its page as a bundle of two kits).

- **Migration** `database/migrations/20260725_bundle_dispatches.sql` (+ supabase mirror): new `bundle_dispatches` table (owed second kit), state machine `scheduled → trigger_met → awaiting_window → dispatched` (terminals `not_needed`/`cancelled`). **APPLIED to the live DB 2026-07-26** (Supabase `androprime` / `phqrjtnflovicgkngieu`; RLS + select-own policy verified).
- **`lib/bundles/`** (`config.ts`, `checkout.ts`, `confirmation.ts`, `sweep.ts`, `dispatch.ts`): three SKUs: Confirmation £169 (Kit 1 base, Kit 1 retest, result-triggered, `shouldTriggerConfirmation` at t<12 nmol/L, aligned to GP-referral low-T 2026-07-25; customer-facing name **Recheck Bundle**), Prove-It £199 (Kit 2 base, Kit 2 retest, timed day-~90, flagship), Full-picture £259 (Kit 3 base, **Kit 2** retest, timed day-~90). `BANK_RECHECK_MONTHS=6`, `ADDRESS_CHECK_WINDOW_DAYS=4`.
- **`app/api/jobs/bundle-sweep/route.ts`**: daily QStash-verified sweep advancing the state machine (matures due rows → sends CIO `bundle_address_check` event → after the 4-day window, dispatches the second kit via the existing `/api/vitall/dispatch`, reused verbatim). **QStash Schedule REGISTERED 2026-07-26** (scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, cron `0 6 * * *`, POST to the prod route, not paused); fires daily but no-ops while `BUNDLES_ENABLED` is off.
- **Checkout + webhook:** `app/api/checkout/kit/route.ts` accepts a `bundle` param and resolves one of three new Stripe price envs (`STRIPE_PRICE_BUNDLE_CONFIRMATION` / `_PROVEIT` / `_FULLPICTURE`); **the 3 Stripe products/prices + the 3 Coolify env vars were created 2026-07-25 (Keith)** — the checkout pipe is now wired. `BUNDLES_ENABLED` itself is **currently `false` in prod** (Keith set it true mid-session to test, then back to false once the render fix landed; it stays false until the gates below clear). `app/api/webhooks/stripe/route.ts` inserts the `bundle_dispatches` row on a bundle purchase (kit_type metadata stays the base kit, so the existing first-kit insert + dispatch flow is untouched).
- **Result hook:** `processVitallResult` (`lib/results/processResult.ts`) now calls `resolveConfirmationOutcome` for an open Confirmation row: low (<12) schedules the recheck; not-low (≥12, i.e. borderline 12–<15 or all-clear ≥15) banks it to the +6mo recheck. No refund logic in code; refund-on-request is `scripts/ops/cancel-bundle.ts` (flips the row to `cancelled`) then a manual Stripe refund, by design.
- **Frontend (kit-page CRO rebuild, same session):** all three kit detail pages were reverted to their pristine git originals and rebuilt **fully flag-gated**: flag OFF renders each page byte-identical to production (verified: original JSX preserved verbatim in the `else` branches); flag ON renders a **bundle-forward** design where the hero leads with the offer and the page **closes on the single-vs-bundle chooser** (no trailing related-reading blog cards or competing-kit cross-sell, which a CRO pass flagged as focus-stealers). Testosterone + Energy lead the hero with the bundle as primary; **Hormone keeps Kit 3 (£179) as primary and presents the day-90 retest as a prominent add-on** (its chooser sits on a white panel inside the black finale so the black bundle card reads). `BundleChoice` gained optional label-override props so the Kit 3 card reads "Kit 3 plus a Retest / Track your change" not "bundle". `bundle` threads through the `/checkout/details` redirect hop (mirrors how `discount` already survives it). All verified by headless-Chrome screenshots. **Bundle copy is PENDING compliance pre-flight + Ewa sign-off**; marked in code, not yet run.
- **CRO evaluation run (page-cro skill) on all three pages**: heuristic (no live conversion data yet). Top remaining lever flagged: **no social proof anywhere** (no testimonials / review counts / test numbers); needs real tester data from Keith before a social-proof block can be built. Also paused this session: integrating the kit **sleeve-cover designs** (`02_brand/assets/packaging/concept-sleeve-fronts-all-kits.html`, HTML concepts, on-brand) as product imagery on the chooser cards (one sleeve on single, two on the bundle); Keith said hold. Both are open follow-ups.
- **Tests:** 3 new suites wired into `npm test` (`test-bundle-sweep.ts` 20 assertions, `test-bundle-confirmation.ts` 27, `test-bundle-checkout.ts` 37); all green; `tsc --noEmit` clean.

**Render fix (2026-07-25, commit `0c1070f`):** the three kit pages were statically pre-rendered, so `isBundlesEnabled()` was baked at build time (the Dockerfile only feeds `NEXT_PUBLIC_*` into the build, so `BUNDLES_ENABLED` was never present and the flag froze OFF; toggling the deployed env var did nothing to the kit-page UI, though the dynamic checkout/webhook/sweep handlers always honoured it). Added `export const dynamic = 'force-dynamic'` to all three (Option A) so they render per-request and the runtime flag wins with no rebuild. Verified by an Opus runtime agent across both flag states on one build (flag OFF = byte-identical to prod, zero bundle surfaces; flag ON = chooser on all three, 169/199/259), screenshots reviewed. **Deployed with `BUNDLES_ENABLED=false`, so no visible change.** Trade-off: these three pages are now SSR per-request (lost static caching) — reclaim via the Dockerfile build-arg route (Option B) once bundles are permanently live post-launch if caching matters.

**WENT LIVE 2026-07-26 (Keith):** both `BUNDLES_ENABLED=true` and `ACCOUNT_ADDRESS_ENABLED=true` set in Coolify + app redeployed (env changes needed the restart to apply — the first redeploy shipped the code/legal but the flags only took on the explicit restart). **Verified live by smoke test:** the bundle-forward chooser renders on all three kit pages at the correct prices (`/kits/testosterone` £169 Recheck, `/kits/energy-recovery` £199 Prove-It, `/kits/hormone-recovery` £259 Full-Picture); live `/terms` + `/privacy` carry the bundle sections. Non-blocking residuals: prices remain WTP hypotheses (gate #10, reprice via env after the quiz read); `/account` address-surface visual QA under an authed session still worth a manual eyeball. All gates below are closed.

**Before the flag flipped (`BUNDLES_ENABLED=true`), these were owed (all now DONE):**

1. ~~Solicitor **D2 gate**~~ → **RATIFIED in-house 2026-07-25** (Keith decision: no external solicitor review). Bundle Terms section ("Test Bundles (Two-Kit Purchases)") **APPROVED by Keith + Ewa** and folded into `03_compliance/terms-and-conditions.md` (banner now `[APPROVED 2026-07-25]`); Privacy clauses in `privacy-policy.md` (v1.3.2: bundle purpose row + automated-scheduling disclosure + retention row). Keith's product decisions all approved (12-month banked-retest refund backstop; retest portion refundable up to dispatch; customer-facing name "Recheck Bundle"). **Only residual = the mechanical live-sync at flag-flip:** copy the approved Test-Bundles section into live `canonical-site/terms/index.html` and the Privacy clauses into the live `/privacy`, coupled to `BUNDLES_ENABLED` so /terms never advertises an unpurchasable bundle. **→ DONE 2026-07-26: synced at the flag-flip** — the customer-facing Test Bundles section added to live `canonical-site/terms/index.html` (after Diagnostic Kits) and the three bundle clauses (purpose row + automated-scheduling disclosure + retention row) added to live `canonical-site/privacy/index.html`; source-doc banners flipped to SYNCED. Ships with the `BUNDLES_ENABLED=true` redeploy. General-T&C review residuals (subscription-variation notice, ADR naming, solicitor's optional mixed goods+service confirmation) tracked in `03_compliance/2026-07-25-terms-privacy-legal-review.md`.
2. ~~**F3/F4 ClickUp build gates** (subtasks of B1 prereqs `869e74vwz`).~~ **DONE 2026-07-26** — both subtasks `complete` in ClickUp: F3 `869e8w56x` (Bundle Terms + Privacy clauses drafted in-house, solicitor waived, Keith ratified), F4 `869e8w573` (Keith + Ewa + compliance Phase-0 boundary ruling: Confirmation bundle vs "confirmatory testosterone testing").
3. ~~**Ewa sign-off**: threshold + Phase-0 boundary + intervals.~~ **DONE.** Threshold + boundary **RESOLVED 2026-07-25** (`shouldTriggerConfirmation` aligned to t<12; wellness "Recheck" framing). Intervals **SIGNED OFF 2026-07-26** (Keith relay): `CONFIRMATION_INTERVAL_DAYS = 0` (immediate recheck at trigger) + `SECOND_DISPATCH_DELAY_DAYS = 90` (Prove-It/Full-picture day-90) both approved as coded.
4. ~~**Compliance pre-flight** on the `BundleChoice` copy.~~ **DONE 2026-07-26**: pre-flight run (0 HARD; price-split arithmetic accurate on all three: £99+£70=£169 / £119+£80=£199 / £179+£80=£259; Prove-It/Full-picture retest mechanic uses the approved "see how your numbers have changed" wording). The one flagged line (Recheck mechanic, "your second test ships only if your first result comes back low…") is **CLEARED**: **Ewa approved it as a wellness recheck, not "confirmatory testosterone testing"** (Keith relay 2026-07-26); the "Recheck Bundle" customer-facing name is the mechanism of that ruling. `BundleChoice` PENDING markers updated to match.
5. ~~**Create 3 Stripe bundle prices** + populate the three env vars in Coolify.~~ **DONE 2026-07-25 (Keith).**
6. ~~**Register the QStash Schedule** for `/api/jobs/bundle-sweep` (cron `0 6 * * *`).~~ **DONE 2026-07-26** — scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, POST `https://andro-prime.com/api/jobs/bundle-sweep`, daily 06:00 UTC, 3 retries, not paused. Fires now but no-ops (`{skipped:true}`) until `BUNDLES_ENABLED` flips.
7. ~~**Build the CIO `bundle_address_check` campaign.**~~ **BUILT DRAFT 2026-07-26** — campaign `24` ("T-11 — Bundle Address Check"), type transactional, trigger event `bundle_address_check`, single email action `108` (draft), template `55` (from Keith/identity 1, subject "Please confirm your delivery address", preheader set, CTA → `/account`, `4 days` synced to `ADDRESS_CHECK_WINDOW_DAYS`). Pre-flight 0 HARD (pure logistics copy, no health claim, no em dash); Liquid lint 0 errors (local + live); no `{% if %}` branches. Copy **APPROVED by Ewa + Keith 2026-07-26 (CA-027**, `03_compliance/content-approval/approval-record-bundle-address-check-2026-07-26.md`). **Not activated** (draft) — activation gated only on `BUNDLES_ENABLED` + `ACCOUNT_ADDRESS_ENABLED` live.
8. **Address-update surface** the address-check email links to — **BUILT 2026-07-26, dark behind `ACCOUNT_ADDRESS_ENABLED`** (default OFF; new flag in `lib/flags.ts`). Self-serve "Delivery address" section on `/account` (`components/account/AddressSection.tsx`) + `PUT /api/account/address` (auth-required, 404 when flag off, writes only the caller's own `users` row) + `lib/account/getAddress.ts` loader. Edits the exact `users` address columns the second-kit dispatch snapshots (`lib/bundles/dispatch.ts`), so a mid-window update ships to the new address with no extra code. Country forced GB (UK-only). tsc clean; compliance scan 0/0/0 (pure logistics copy, no health claim, no em dash). **Set `ACCOUNT_ADDRESS_ENABLED=true` in Coolify alongside `BUNDLES_ENABLED` so the email never links to a dark surface.** **Visual QA still owed** (flag-on + authed local session).
9. ~~**Apply the migration** (`20260725_bundle_dispatches.sql`) to a live/staging DB.~~ **DONE 2026-07-26** — applied to the live Supabase project `androprime` (`phqrjtnflovicgkngieu`; single project, no separate staging). Verified: `bundle_dispatches` table (12 cols), RLS enabled, select-own policy, both indexes + `set_updated_at` trigger present. Empty + unused until `BUNDLES_ENABLED` flips (no row is written while the flag is off).
10. Working prices (£169/£199/£259) remain hypotheses pending the Van Westendorp WTP read; easy reprice (one env var per SKU), not a blocker to flag-flip but flagged so it isn't forgotten.

## Middleware auth-gate + Context7 tooling (2026-07-24): code done, deploy owed

- **`/supplement-waitlist-status` now gated in `middleware.ts`** (added to `protectedRoutes` + `matcher`). Defence-in-depth + a consistent login redirect; the page already self-guards via `getCurrentUser()` → `return null`, so this is a UX/consistency fix, not a data-leak. CONTEXT route-table row updated to match. ⚠️ **Committed this session; a push = Coolify redeploy, so it goes live on the next deploy**; smoke-test `/supplement-waitlist-status` (logged-out → login redirect) after.
- **Context7 MCP** added to the local gitignored `.mcp.json` (keyless `@upstash/context7-mcp` v3.2.4); usage pointer added to CONTEXT.md "How to Work Here" (third-party library docs: Next/React/Supabase/Stripe/QStash; graphify stays for our own code). Needs an MCP reconnect to load.

## DEPLOYED 2026-07-24: CA-026 copy + full design pass + blog DB update (all live, verified)

The three passes below (CA-026 money-pages rewrite, full-site strategy-alignment fixes, design-guidelines fixes) shipped together as one deploy 2026-07-24, plus the blog DB content update.

- **Commit `e09f8c6`** (104 files: CA-026 copy + design overhaul + `llms.txt` regen + blog mirror + docs), pushed to main → Coolify. **First build FAILED: OOM-killed at the in-Docker `next build` type-check step** (compiled fine in 51s, then process killed, exit 255, no `Type error:` printed; a clean local `next build` of the same commit passed all 75 routes, confirming code was clean). No outage: Coolify discarded the failed build and kept the prior version serving. **Retry via empty commit `d58bfbd` succeeded** (transient server-load OOM; Docker layer cache made the retry ~2.5 min). If this recurs: add `typescript.ignoreBuildErrors` + `eslint.ignoreDuringBuilds` to `next.config.ts` (we gate types locally with `tsc --noEmit`, so the in-Docker typecheck is redundant and is the memory-heavy step that dies).
- **Live smoke test green (2026-07-24):** homepage B1 hero, /kits C1 block (no bundle prices), /terms SLA "2 to 5 working days" (24-48h gone), how-it-works discount line gone, regenerated /llms.txt (FM + partner-code prices + TRT pre-announce gone, A1 folded in), ferritin blog article (Vitall name gone, UKAS retained).
- **Blog DB import done:** `import-blog-to-db.ts` ran (17/17 upserted, all published). **Landmine avoided:** `free-androgen-index` mirror was `status: draft` while the live DB had it `published` (published earlier via the ClickUp orchestrator sequence, which never updated the MDX mirror); mirror reconciled to `published` before import so the raw import didn't unpublish a live article. DB verified post-import: `(Vitall)` and the per-customer-review phrasing removed from bodies.
- **F7 (UKAS cert) downgraded, NOT a blocker:** substantiation is on file (signed services agreement §3.6 + 2026-04-22 quote); only the per-lab certificate artefact is outstanding, which the Vitall negotiation log already classifies non-blocking. ClickUp `869e8w57e`. Wording guardrail holds: "analysed by a UKAS ISO 15189-accredited lab" only, never "UKAS-accredited report" / "Vitall is accredited".
- **Still owed** (unchanged by the deploy): everything in the two "Owed / flagged" + "Design rulings owed" lists below. (F3/F4 bundle gates, ClickUp `869e8w56x`/`869e8w573` under B1 prereqs `869e74vwz`, both now **complete 2026-07-26**.)

## Full-site design-guidelines audit + fix pass: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6` / retrigger `d58bfbd`)

Four-agent audit of every surface against `02_brand/brand-guidelines.md` v2.0 hard rules (+ visual-identity.md logo authority), then four implementation agents. Verification green: `tsc`, `npm test`, `npm run build` (75 pages), banned-pattern scan clean (remaining `hover:bg-black` hits are all §5.3-sanctioned button fills, not card inversions). Fixed: **full-card hover inversions** removed everywhere (homepage/kit/how-it-works/waitlist step cards, quiz options, RelatedArticles, BlogListings, ArticleLayout, LP energy); **all marketing motion** stripped (pulsing dots, fade-up entrances, hover-translates, animated accordions/progress bars, dead `animate-[fadeIn]` landmines); `statusPulse` keyframes now opacity-only + reduced-motion-guarded; **colour fence enforced** (sample-panel bars tokenised to `bg-statusWarning`/`bg-statusOptimal` incl. the §3.3 token-note item; red/orange/green raw classes eliminated; coloured status TEXT removed on subscriptions + `text-amber-600` homepage value; latent `.status-*` text/bg/border utilities deleted; red error text → black on consent/account/waitlist forms); **offset block-shadows outside `.blog-skin`** removed (SupplementWaitlistForm, JoinForm); gradient stripe overlays deleted (hormone-recovery CTA `#333`, live /terms disclaimer panel); rounded-full dot + 3 `rx/ry` icon rects squared; serif app headings → Inter black; button spec sweep (primary border-4/text-sm, `transition-all`→`transition-colors` ~60 sites, app utility-button pattern ×9); mono-label tracking normalised to `tracking-[0.15em]` (~60 labels); off-roster grays mapped to the §3.2 set; Nav logo hover-scale + link transitions removed; auth/activate brought to spec; **tailwind hardened** (theme-level borderRadius all 0px, boxShadow all none; banned utilities can no longer compile).

**Design rulings owed (Keith):** ~~(a) sample-report COLOUR on the homepage hero + LPs~~ **RESOLVED 2026-07-26 (Keith): §3.3 carve-out extended to cover the sample-report panel wherever it appears (kit pages, LPs, homepage hero); colour kept, fence unchanged (commits `1657235`/`da14812`)**; (b) looping hero background video vs "marketing fully static" (mitigations exist: reduced-motion/mobile/data-saver skip, grayscale); sanction in guidelines or drop to poster; (c) blueprint grid-line gradient textures (hormone-recovery:104/398, supplement-waitlist:44, blog dot pattern); bless or remove; ~~(d) one-primary-CTA-per-page rule vs long pages with repeated CTAs~~ **RESOLVED 2026-07-26 (Keith): §5.5 clarified to "one primary action per page; a single CTA may repeat down a long LP; only competing primary CTAs banned"**; (e) QualifierGate YES/NO hover inversion (buttons, but card-sized); (f) minors: `.glass-panel` rename (30 consumers), footer "EFSA Regulated" badge, double back-to-top on TOC'd articles, 1px badge chips, 8px accent borders outside supplement context, sans-black emphasis paragraphs.

**LP design-conformance audit (2026-07-26, 2 Opus agents, full per-rule pass, kit + supplement split):** all 5 LPs = **0 HARD breaks, but NOT full conformance** (~9 MINOR deviations, several systemic). PASSING: buttons (rounded-none, border-4/2, transition-colors, no transforms), no rounded SVG linecaps, colour fenced to sample-panel range bars only (badges B&W), no competing primary CTAs, no gradient/shadow/glass/hover-inversion. MINOR (owed, **Keith deferred the fix decision** at wrap): (1) `text-gray-400` meta on the black step-4 cards → should be `gray-300` (testo 333 / energy 278 / hormone 387, §3.2a); (2) hormone founders' black card `gray-200`/`gray-400`/`gray-600` → `gray-300`/`gray-700` (564/575/580, §3.2a); (3) final CTA `text-xl` vs §5.2 `text-sm` (3 kit LPs); (4) final-CTA arrow `strokeWidth="4"` vs §8.8 2-3 (3 kit LPs); (5) card padding below §6.5 `p-10` desktop min (`p-8`/`p-6`/`p-5`, systemic across all 5); (6) primary CTA padding `px-10 py-5` vs §5.2 `px-8 py-4`; (7) hormone `gray-400` de-emphasis on light surfaces (415 £218 strikethrough, 620-621 table) outside the contrast-device purpose; (8) hormone ghost numbers use a `WebkitTextStroke` outline vs §8.4 solid `gray-100`/`gray-800` fill; (9) daily-stack missing `border-t-4` divider before the FAQ (§7.3). Proposed fix split: **bucket A** (safe class swaps: 1,2,4,7,9) + **bucket B** (visual/aesthetic call: 3,5,6,8). **ALL 9 FIXED 2026-07-26 (Keith: "fix all issues")** across all 5 LPs: (1) black step-4 meta → `gray-300`; (2) hormone founders' card → `gray-300`/`gray-700`; (3) final CTAs → `text-sm`; (4) final-CTA arrows → `strokeWidth="2"`; (5) every content card → `md:p-10` (mobile kept ≥ `p-6` min); (6) primary CTAs → `px-8 py-4` (final CTAs also normalised off `px-12 py-6`); (7) hormone light-surface de-emphasis (£218 strike + comparison table No cells) → `gray-500`; (8) BOTH hormone ghost-number instances (383 process step + 335 biomarker card, the second not line-cited in the audit) → solid `gray-100`/`gray-800` fill, `WebkitTextStroke` removed; (9) daily-stack FAQ section given `border-t-4 border-black`. Verified: `next build` exit 0 (all 5 LPs prerendered, tsc + lint clean), real headless-Chrome full-page screenshots reviewed by eye (desktop 1440 + mobile 390) — layouts intact, no overflow, dividers present. **Now full design conformance on the audited rules.**

## Full-site strategy-alignment review + fix pass: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6`)

Seven-agent review of every customer-facing surface (money pages, marketing long-tail, 5 LPs, logged-in app + results engine, shared chrome/schema, blog MDX mirror, email templates) against the conflict-free positioning (CA-026), pricing v2 (£99/£119/£179 anchors; bundles NOT yet shippable), and the compliance rails. CA-026 verbatim conformity CONFIRMED on all 8 money pages; single-kit pricing correct everywhere; **zero bundle prices leaked anywhere**. Safe fixes implemented (43 files); verification green: `tsc --noEmit`, `npm test` (classifier suite extended to 26 assertions incl. a dead-route guard), `npm run build`, banned-string scan of every added line clean. Highlights of the fix pass: how-it-works retest-discount promise deleted; sitewide footer de-Vitalled; `/gp-referral` 404 CTA repointed to the live GP handoff; false Kit 3 cortisol claim corrected; founding-member-status page retired (redirect `/account`); `public/llms.txt` regenerated on CA-026 wording (partner-code prices, FM section, TRT pre-announcement removed); live /terms 24-48h SLA corrected to "2 to 5 working days"; blog mirror de-Vitalled ×8 + per-customer-review rephrase ×9 (**mirror only, DB import NOT run**; diff `status:` vs DB first, then import + revalidate); D+ conformity lines added to kit LPs; em-dash sweep (incl. punctuation-only edits to Ewa-signed `biomarker-copy.ts`: claims word-identical, needs her nod).

**Owed / flagged (full list in the session report):** (a) CA-026 F7 UKAS certificate filing: pre-push blocker; (b) Ewa sitting bundle: per-customer-review lines deliberately left on how-it-works :426-430 + homepage "GP-designed report", the rephrased kit-page privacy answers + blog rephrases (nod), the 6 vs 12 nmol/L GP-threshold contradiction on how-it-works, biomarker-copy punctuation nod, T-range inconsistency (8–35 vs 10–35 vs 8–29); (c) Keith decisions: ~~LP positioning rebuild~~ **DONE 2026-07-26 as "step 2"** (commits `2e1e306` + `f8e4ebb`, both VERIFIED LIVE via two-sided canaries + element screenshots at 640/1280px): the flagged "GP-adversarial heroes" dissolved on inspection (hero lines are approved customer language: "Your GP said normal…", "Five minutes. No GP needed."); the real tells were the mockup labels, now de-protocolled and **matched to real classifier routing** ("Further investigation advised" → routing-neutral "Your next step, based on your numbers" after a first swap wrongly promised a GP conversation on a 14.2-borderline mockup; GP referral fires only on total T <12); CA-026 A1 receipt added verbatim to lp/collagen + lp/daily-stack (previously carried none); lp/hormone-recovery "The Fix" eyebrow → "The Next Step". **Ewa packet (her wording, untouched):** her attributed "clinical protocols … effective" quote ×4 (3 kit LPs + kits/hormone-recovery:630); ~~TRT-Trained badges, "we test first then we fix it", "founding-customer discount" promise ×7 surfaces~~ **SWEPT 2026-07-26, VERIFIED LIVE** (two-sided homepage canary: "act on it" present, "Then fix it" absent; commit `101db60`, 15 files: founder quote → "Then you know exactly where you stand", homepage H2 → "Then act on it" + "Intervention Protocols" label → "Data-Led Supplements", TRT badges → UKAS/GMC on 7 surfaces, founding-customer discount removed app-wide with JSON-LD kept in sync; greps 0, tsc clean). **Kit-page follow-up SWEPT + VERIFIED LIVE 2026-07-26** (commit `ec5f30b`, canary on /kits/hormone-recovery): "The Fix"/"THE FIX" headings → "The Next Step", "FIX" watermark → "DATA", "Next Step Protocol"/"ANALYSIS PROTOCOL ACTIVE" labels de-protocolled, stale hero PENDING comments synced; audit also confirmed NO bundle-price leak (hero bundle CTAs correctly `bundlesEnabled`-gated) and no "Confirmation" naming leak. **Left for Ewa** (packet assembled 2026-07-26 → `03_compliance/content-approval/ewa-packet-2026-07-26-lp-clinical-wording-and-countersignature-backlog.md`; ClickUp `869e9fk23`, list "Content Review — Ewa"; now also folds in the quote ×4 + how-it-works:449 second attributed blockquote + the CA-003→027 countersignature backlog)**:** her attributed "clinical protocols … effective" quote on kits/hormone-recovery:630 (her wording) + the how-it-works:430 "treated men" prose; stale /waitlist page, category-absolute "Other providers give you numbers" lines, £218 strikethrough framing, "EFSA Regulated" footer badge, dead canonical-site/lp static trees (**ashwagandha leak sweep 2026-07-26: 0 facing leaks — whole frontend clean incl. git-ignored files; canonical-site now holds only privacy/terms HTML, the flagged tree is already gone**; the Medichecks-name concern in these trees was NOT part of the ashwagandha sweep and is still open); (d) solicitor: terms/privacy FM + Vitall-naming sections, bundle terms (D2 gate); (e) email sequences (seq-03d cadence + "even if your GP says you're fine" subject, seq-01/06 GP framing, seq-04 discount framing); CIO-side, need Ewa/Keith pass before/at activation; T-04 SUPERSEDED-bannered, verify CIO doesn't reference it; (f) strategy-doc nit: LTV model v2 says £39.95/mo subscription vs catalogue/site £34.95 Daily Stack.

## CA-026 money-pages rewrite: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6`)

The conflict-free positioning rewrite (CA-026 approved wording, verbatim) is implemented across 8 files in `app/(marketing)/`: homepage hero + meta descriptions (B1; title kept for SEO), /kits C1 money block, FAQ C2 + FAQPage schema, D+ conformity lines on testosterone / energy-recovery / hormone-recovery kit pages, A1 standing claim on About, A1 + live-receipts section on how-it-works. Verification green: `tsc --noEmit`, `npm test` (148 assertions), `npm run build`; zero em dashes / competitor names / banned absolutes in changed files. Also reconciled in-scope stale copy: how-it-works low-T routing still described the retired FM/TRT pathway (now the live CA-014 GP-referral framing), FAQ "Founding Member territory" band label removed, 2 pre-existing competitor mentions de-branded, 2 pre-existing schema em dashes fixed. **⚠️ UNCOMMITTED by design: pushing = Coolify redeploy = the new positioning goes live. Keith's go.** After push: eyeball homepage/kits/faq/how-it-works live, then re-run PSI once (copy-only changes; hero perf work untouched).

**Pre-existing compliance flags found during the build (NOT touched, for the Ewa sitting):** (a) "GP-designed report" on the homepage (HowTo schema step 4 + visible step 4): the proposed-but-unconfirmed standard chip per 02_brand STATE; (b) how-it-works "A real doctor reviewed your result" + "Dr Ewa signs off every result interpretation": per-customer-review implications the compliance CONTEXT bars (system-level rule). Both predate this rewrite.

## Mobile performance pass (2026-07-19): homepage hero

Mobile PageSpeed was imperfect; three commits cut mobile page weight from ~2.35 MB to ~0.7 MB and lifted mobile PSI from **85 to a settled ~88** (median of warm re-runs 87/88/88; a one-off 85 immediately after the round-3 redeploy was cold-start noise: first PSI hit after a Coolify redeploy inflates FCP + render-blocking via a slow TTFB, ignore it). All work DEPLOYED + verified live 2026-07-19. Desktop lab is already 100. **Decision (Keith, 2026-07-19): stop here**: 88 mobile / 100 desktop is a good result for a marketing site with a video hero, and the remaining points are infrastructure-bound, not code-bound (see below).

Stable warm metrics: TBT 40–90ms 🟢, CLS 0.013 🟢, Speed Index 2.1–2.9s 🟢; the two amber metrics holding the score are **FCP 2.1s** and **LCP 3.6s** (Moto G Power / Slow-4G, Lighthouse 13.4). Key finding: both are gated by the **render-blocking CSS + TTFB critical chain** (≈1,770ms render-blocking, consistent across warm runs), NOT by payload: LCP moved only 3.9→3.6 despite a much smaller poster, proving the hero image bytes were never the bottleneck. The next real lever is therefore **a CDN/edge (e.g. Cloudflare) in front of Coolify to cut TTFB**, which would lift FCP and LCP together; inlining critical CSS is fiddly in the App Router for small payoff. Neither pursued; parked as the only remaining path to 90+.

- **Round 1 (commit `675557b`, DEPLOYED + verified live):** `HeroBackground.tsx` skips the decorative hero video entirely on <1024px / data-saver / reduced-motion (keeps the static poster); `preload="none"` added. `hero.mp4` re-encoded 1.66 MB → 667 KB (540p, 24fps, desaturated to match the CSS grayscale) plus new `hero.webm` (VP9) 491 KB served first. GA `gtag.js` + FirstPromoter `fpr.js` moved from `afterInteractive` to `lazyOnload` (the inline consent-denied bootstrap stays early, so Consent Mode / GDPR behaviour is unchanged).
- **Round 2 (commit `35829de`, DEPLOYED + verified live):** hero poster 113 KB JPG → 51 KB WebP via `<picture>` (JPG fallback), preload retargeted to WebP. **Sentry Session Replay removed** from the client SDK (`instrumentation-client.ts`: dropped `replaysOnErrorSampleRate`; error + perf monitoring kept); `bundleSizeOptimizations` added in `next.config.ts`. Long `Cache-Control` (1y) headers for `/videos` + static images (repeat-visit win; stable paths, so **rename a media file to bust its cache**).
- **Round 3 (commit `bd6468f`, DEPLOYED + verified live):** mobile-only 800px poster `hero-poster-800.webp` (~28 KB) served via media-scoped `<picture>` + media-scoped preloads (desktop keeps the 1280px WebP); only Inter (H1 font) is now preloaded, Merriweather + JetBrains Mono set `preload: false`. Verified live: `/videos/hero-poster-800.webp` 200, both media-scoped image preloads present in `<head>`, font preloads down from 4 woff2 to 1 (Inter). Net effect on score was ~neutral (+1); it confirmed the LCP is chain-bound not byte-bound (see finding above), which is the useful result.
- **Not pursued (parked):** dropping the faint mobile bg image for a CSS tint was the presumed "decisive LCP fix" but round 3 showed the poster bytes are not the bottleneck, so it would help little; stripping client-side Sentry from marketing routes is a minor JS trim. The one lever with real headroom is the CDN/TTFB path above. All parked per the stop decision.
- **⚠️ Commit hygiene note:** commit `bd6468f` unexpectedly also swept in 11 unrelated already-dirty WIP docs (`06_marketing/content-machine/*`, `01_strategy/STATE.md`, a new substack asset) despite explicit path staging; no git pre-commit hook exists, most likely the VSCode Source Control integration auto-staged them. Not rewritten (already pushed). Worth confirming those content files were ready to ship.

---

## OPEN DECISION: retest CTA has no mechanism (2026-07-17)

Keith flagged that the "Book a retest in 3 months" button on healthy results just links to `/kits` with no reminder/scheduling behind it, and "3 months" contradicts the 6–12 month cadence promised across the marketing site. Written up in `docs/2026-07-17-retest-cta-mechanism-decision.md` (status PROPOSED). Recommends: Phase 1 honest relabel + timing fix (one-liner in `classifier.ts`), Phase 2 real `retest_due_at` reminder via Customer.io for all kit buyers (not just subscribers). **Owed:** Ewa signs the per-result cadence; Keith picks the relabel and whether Phase 2 is pre-launch. **Tracked in ClickUp** (Sprint: Pre-launch): parent `869e66e8p` + 6 subtasks. Cadence sheet: `04_products/results-engine/2026-07-17-retest-cadence-table.md`. **Resolution 2026-07-17:** all-clear cadence of **6–12 months is agreed** (already the live marketing figure), so the button "3 months" + card copy "3–6 months" are just drift to align down to it; no clinical sign-off owed, Phase 1 dev task `869e66eau` unblocked. **Symptom overlay DECIDED** (build now, self-policing scope): in range but still symptomatic → step 1 check an untested panel we supply (Kit 1↔Kit 2; Kit 3→GP), else GP. Only a **light copy tick** from Ewa remains (red-flag GP-first line + the two symptom→panel wordings, on the normal results-copy pass); task `869e66e9c` downgraded from blocker.
- **Phase 1 timing fix DEPLOYED 2026-07-17 (commit `f5e6912`, pushed to main).** `classifier.ts` retest CTA label `Book a retest in 3 months` → `Retest in 6–12 months`; `biomarker-copy.ts` three retest lines (optimal-T, ft-normal, default-normal) aligned `3–6`/`3 to 6` → `6–12`/`6 to 12 months`. Compliance pre-flight clean (0 HARD). `npm test` green. Dev task `869e66eau` done. (Optional: content-approval log entry, not self-approved.)
- **Phase 2 reminder: LIVE 2026-07-18.** Code deployed (commit `8beec61`, `next build` green), `RETEST_REMINDER_ENABLED` flipped ON in Coolify, and CIO campaign **23 activated (state `running`, email action 106 `sending_state: automatic`)**. Note: Keith activated the campaign but the email action was still `draft` (a running date-campaign with a draft message silently sends nothing); flipped to `automatic` to complete activation. Zero immediate sends: every stamped `retest_due_at` is +6 months forward, so the first real reminder is ~6 months out. Code mechanism: `buildCioTraits` (`lib/results/processResult.ts`) stamps a `retest_due_at` CIO attribute (result date + `RETEST_REMINDER_MONTHS` = 6, start of the agreed 6–12mo window) on a whole-result all-clear, behind new flag `isRetestReminderEnabled()` (`RETEST_REMINDER_ENABLED`, default OFF, `lib/flags.ts`). Unit test `scripts/test-retest-reminder.ts` (9 assertions, wired into `npm test`); `npm test` + `tsc --noEmit` green.
  - **CIO campaign built DRAFT 2026-07-18 (env 219186):** `seq-07: Retest Reminder (all-clear)`, **campaign id 23**, type `date`, `date_triggered_attribute = retest_due_at`, frequency `once`, 9:00 customer TZ / Europe-London fallback. Email action **106** (template **54**), `sending_state: draft`, from Keith (identity 1), subject "Time for a fresh reading", preheader set. Copy = `frontend/email-templates/sequences/retest-reminder-all-clear.md` + rendered HTML `email-templates/html/retest-reminder-all-clear-email-1-*.html`. CIO liquid lint 0 errors (only `{% unsubscribe_url %}`). NOT activated.
  - **Still to do before live:** ~~(a) Ewa signs the email copy~~ **DONE: CA-022.** ~~(b1) deploy the Phase 2 code~~ **DONE: commit `8beec61`.** **(b2) flip `RETEST_REMINDER_ENABLED=true` in Coolify → Settings → Environment Variables (runtime var; needs container restart); KEITH's action, not doable from the repo.** ~~(c) verify date interpretation + backfill + test-send~~ **DONE 2026-07-18:** CIO stored a seeded Unix-seconds `retest_due_at` (format accepted); backfill is a non-issue (activate with `backfill:false`, and every stamped date is +6mo forward so no past population exists); test email sent to keith@andro-prime.com via `verify/email`. ~~(d) suppression filter~~ **DEFERRED to supplement launch**: `subscription_started` never fires in Phase 0, so the subscriber population is empty and there is nothing to suppress; add it (as a `global_exit_condition` on the subscriber segment) alongside the discount when supplements ship. ~~(e) human activation go/no-go~~ **DONE 2026-07-18: Keith activated; the email action was still `draft` (a running date-campaign with a draft message silently sends nothing) so it was flipped to `automatic` to complete activation. Campaign LIVE.** (f) subscriber discount deferred to supplement range. NB: seeding the test profile fired one bounce via seq-03c and left an un-deletable profile (agents can't delete); Keith deleted `retest-verify@andro-prime.com` in the UI 2026-07-18.
  - **All committed:** code + test + email copy/HTML + CA-022 record in `8beec61`; the `package.json` test wiring, `test-account-export.ts`, CA-022 register row, and this STATE.md committed 2026-07-18. Dev task `869e66eb0`.

---

## Bucket A/B account + results features: LIVE 2026-07-19 (all three flags ON in Coolify, deployed by Keith); copy signed off (CA-023/024/025); built dark 2026-07-17 (0bd4e9a)

Implemented from `docs/2026-07-17-bucket-ab-implementation-plan.md` (research-driven, from `docs/2026-07-17-research-to-feature-gap-analysis.md`). Everything is behind a default-OFF env flag; with flags unset the app is byte-identical to before. `npm test` green (account-export suite = 28 assertions added), `npm run build` green.

- **F4 account data controls: `ACCOUNT_DATA_CONTROLS_ENABLED` (OFF).** Adds a "Data & privacy" section to `/account`: a data-use statement ("we do not sell your data", EU residency, Art 9 consent, Vitall = independent controller), a **results CSV export** (`GET /api/account/export`, read-only, reuses `getDashboardData`→`resultsToCsv`), and an **erasure REQUEST** (`POST /api/account/erasure-request` → `emitOpsAlert` only; records a request, deletes nothing). Ship gate: **copy APPROVED 2026-07-19 (CA-024); `ACCOUNT_DATA_CONTROLS_ENABLED` flipped LIVE 2026-07-19; ops-alert address confirmed 2026-07-19 (Keith): erasure requests route to the monitored `keith@andro-prime.com`, 30-day SLA from receipt.** Retention/deletion policy DRAFTED (`03_compliance/deletion-policy/retention-and-deletion-policy.md`), pending sign-off; automated deletion still not built (request-only feature is fine live).
- **F5 kit-scope note: `KIT_SCOPE_NOTE_ENABLED` (OFF).** "What this test did not tell you" paragraph on a normal-T Kit 1 result (in `KitTabs`), enforcing the Kit 1 testosterone-only scope rule and defusing the Kit 2 cross-sell as an upsell. Ship gate: **copy APPROVED 2026-07-19 (CA-025), pre-flight 0 HARD; `KIT_SCOPE_NOTE_ENABLED` flipped LIVE 2026-07-19.**
- **F3 / U1 GP handoff: `GP_HANDOFF_ENABLED` (OFF).** Printable one-page GP summary at `/results-dashboard/handoff` (identity, UKAS-accredited-lab line per Vitall §3.6, per-kit marker table with reference ranges, "questions to ask your GP", not-a-diagnosis disclaimer using "Ewa-approved recommendation logic" framing). Zero new dependency: print-CSS HTML + browser "Save as PDF" (`PrintButton`). Dashboard shows a "Prepare GP summary" link only when a result routes to a GP referral. Ship gate: **copy APPROVED 2026-07-19 (CA-023) by Ewa via Keith; `GP_HANDOFF_ENABLED` flipped LIVE 2026-07-19.**
- **Renderer decision:** no PDF lib in the repo; Vitall's `results_pdf` sits unused in `lab_results.raw_payload`. Chose zero-dependency CSV + print-CSS. A server-generated PDF (jspdf/puppeteer) is a later, deliberate dependency decision.
- **Not verified:** live authenticated render-drive of the three surfaces (both dashboard/handoff pages `getCurrentUser()`-gate before the dev-fixture path, so it needs a logged-in test user + seeded result). Do this with the DevFixtureBar before flipping any flag.
- **Status: LIVE 2026-07-19.** Committed `0bd4e9a`; copy sign-offs CA-023/024/025 recorded; all three flags set to `true` in Coolify and deployed by Keith. Authenticated smoke-test of the three surfaces is Keith's eyeball (agent has no logged-in prod session). Remaining: sign off the DRAFT retention/deletion policy (Keith + solicitor + Ewa; does not block the live request-only feature). The F4 ops-alert-address item is confirmed (2026-07-19, `keith@andro-prime.com` monitored).

### ⚠️ OWED to compliance: automated deletion is blocked on a missing policy

`03_compliance/deletion-policy/` is **empty**: there is no retention schedule. The erasure-*request* mechanism above is deliberately request-only. **Automated hard-delete must not be built until a retention/deletion policy exists**; it would have to encode legal retention rules (UK tax 6-year record-keeping, the Vitall independent-controller copy we cannot compel to delete, Stripe + Customer.io records keyed on email). Owner: Keith/solicitor + Ewa, against `03_compliance/gdpr-readiness-checklist.md` §6 (SAR/erasure, currently unchecked). The `kit_orders.data_purged` status already notes a Vitall-side purge does not cascade to our copy; that cascade is the unbuilt process.

---

## Content-engine on-ramp + local MCP tooling (2026-07-14)

- **New script `frontend/scripts/content-engine/seed-pipeline.ts`** bridges hand-authored `/article` drafts into the DB pipeline. Hand-authored articles skip the keyword-queue, so they never get a `content_pipeline` row, so Draft-Writer / Signoff-Concierge never see them and no ClickUp review task is created. `seed-pipeline.ts --slug <slug>` seeds a `brief_ready` row (idempotent; reuses Draft-Writer + Signoff-Concierge rather than duplicating them). Proven end-to-end: `free-androgen-index` seeded, drafted into `blog_articles`, and **ClickUp review task `869e4uwk5` created** with the pipeline at `in_review`. Do NOT use `/publish-article` for DB-pipeline articles: its build+push forces the Coolify redeploy the DB workflow exists to avoid.
- **Local MCP servers wired in the gitignored `.mcp.json`** (headless-capable, unlike the claude.ai OAuth connectors): `supabase` (`@supabase/mcp-server-supabase`, read-only, project-ref `phqrjtnflovicgkngieu`), `clickup` (`@taazkareem/clickup-mcp-server@0.14.4`, `CLICKUP_API_KEY` + team `90121729875`; the free/LIMITED tier covers the task/comment tools we use), plus the earlier `dataforseo` creds fix. Secrets are inlined because `${VAR}` substitution does not reach the MCP process. Stripe deliberately NOT wired (the package has no tool-scoping, so a live key would expose writes; use a read-only restricted key or the hosted connector). Customer.io stays on its hosted connector (no clean local stdio package).
- **Publish-strand bug found + fixed (2026-07-15).** `publishDue` in `orchestrator.ts` now re-reads the ClickUp task's CURRENT due date each tick, instead of trusting the `target_date` frozen into `content_pipeline` at approval. Root cause: `cholesterol-test` was Ewa-approved 2026-06-24 with a real due date of 2026-07-02, but the DB publish slot was stuck at a placeholder `2027-01-01`, so it sat approved-but-unpublished for ~3 weeks (every tick marked it "scheduled"). `syncApprovals` captures the due date once and never reconciled it. Fix keeps ClickUp authoritative for the slot until the article is live (falls back to the stored value if the ClickUp read fails).
- **Two articles published this session (2026-07-15):** `how-to-read-blood-test-results` (Ewa-approved, was waiting on the daily tick) and `cholesterol-test` (the stranded one above), both flipped live via the orchestrator, no Coolify redeploy. Content board now: **15 published**, plus `free-androgen-index` correctly `in_review` on Ewa (her task still "to do").

---

## Integrations: live status

### Stripe: LIVE for kits
- Kit checkouts return `cs_live` on production; live keys + `STRIPE_PRICE_KIT_1/2/3` populated in Coolify. Supplement price IDs (`_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK`) **intentionally unset** until Phase 0b; the subscription route returns a clean 400, not a 500, and supplement pages are coming-soon + waitlist.
- **Live prices:** Kit 1 £99 `price_1Ta1IoLU0SDiIplTCBeHUi4g` · Kit 2 £119 `price_1TcaopLU0SDiIplThAK94iVM` · Kit 3 £179 `price_1Ta1KxLU0SDiIplTZXYzeJ4X`. Kit 2's original `...4WwdIKIS` was mispriced £117 (£2 undercharge), now archived; resolved + verified 2026-05-30 (prices are immutable, so a corrected one was created).
- **Live webhook endpoint created 2026-06-25** at `/api/webhooks/stripe`: 4 events (`checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`). It did **not** exist before: the first real live purchase charged the card but fired no webhook (no order, no dispatch) until this was created + `STRIPE_WEBHOOK_SECRET` re-set. Idempotency via `processed_stripe_events`. Subscription/invoice events are inert until Phase 0b.
- **Coupons (live):** `SUBSCRIBER10` (`oyOOwEuq`) + `LAUNCHDAY10` (`oayVKPWk`), auto-applied via `?discount=<CODE>` → env `STRIPE_COUPON_*` (commit `f3f963d`). Verified end-to-end (Kit 2 + SUBSCRIBER10 → £107.10; Kit 1 + LAUNCHDAY10 → £89.10). `SUBSCRIBER20` intentionally does not exist in live. No promotion codes (coupon auto-apply only).
- Admin cash position: `lib/admin/getCashPosition.ts` → `stripe.balance.retrieve()` (GBP only), Keith-only `/admin/dashboard`, graceful-degrades to 0 + inline error on failure.

### Customer.io: transactional LIVE + verified
- Verified on a **real** purchase (2026-06-25/26) after fixing the email-identifier **collision**: every CIO call now keys on email (`lib/customerio/identity.ts`, commit `61e4a39`). Workspace 219186, EU datacenter.
- Live + verified: T-01/02/03/09; seq-03a + seq-03b; **seq-03c/03d results-signal fix** (shipped 2026-06-26, `e8ea86e`): seg-22 redefined to the `results_all_clear` attribute, seq-03d repointed to the `borderline_nurture_consented` event; live retest passed (kit3 all-clear → seg-22, kit2 low-VitD → seg-21, consent → event delivered after fixing Email 1's `event.kit_name` silent-drop, `3a87392`). Spec: `docs/seq-03-results-signal-fix-spec-2026-06-26.md` (ClickUp 869dw3ge8).
- CA-019 (collection copy) + CA-020 (testosterone-value reword) approved. `unsubscribe_url` uses the `{% %}` Liquid tag.

### Vitall: lab E2E proven
- Live purchase → order → dispatch proven 2026-06-25 (order `322942444`). Webhook lands at `/api/webhooks/vitall` → QStash → `/api/jobs/process-result`. The lab does **not** retry failed webhooks; QStash must be live before the pipeline activates.

### GA4: live
- `G-D5M4J5M3F6` + consent banner, in production since 2026-06-18 (server-side mirror + client gtag; `lib/analytics/`). Phase 1 (server-side Measurement Protocol mirror) verified via GA4 Realtime 2026-06-16; Phase 2 (Consent Mode v2 default-denied + `CookieConsent.tsx` brutalist banner, Accept/Reject equal weight per ICO) live 2026-06-18. Analytics is the only togglable category; ad/personalization stay permanently denied (no ad pixels).

### Low-T routing + nurture: DEPLOYED 2026-06-07, nurture campaign DRAFT

- Low-T (T<12) → **GP referral, no upsell** is live (`classifier.ts`, `resolveCta`); the founding-member list was **taken down** in the live app (join route → 410, `/founding-member` → 307 `/kits`, FM removed from nav/homepage/sitemap). Dormant infra deliberately left (`JoinForm`, `founding_member_list` table 0 rows). Static canonical-site FM sweep also done (`e280a89`); legal T&C/privacy FM sections deliberately left (describe a dormant mechanism, need Ewa review; not a promotion).
- **Consent mechanism built + live:** `POST /api/lowt-nurture/consent` (un-pre-ticked opt-in on the low-T card, below the GP CTA) records consent then sends `low_testosterone` + `lowt_nurture_consent` traits to CIO + fires `lowt_nurture_consented`. Version const in `lib/results/lowtNurtureConsent.ts` (`2026-06-04-v1`), version-locked to CA-014. Migration `lowt_nurture_consent` applied to prod.
- **`buildCioTraits` gating (compliance):** no longer emits `low_testosterone`/`testosterone_value`/`borderline_testosterone` at result-processing: the consent route is the sole gate (closed a pre-consent special-category exposure to a US processor). Energy traits (`low_vitamin_d`/`low_b12`/`elevated_crp`/`crp_level`/`low_ferritin`) are **gated in code on the CA-018 health-processing consent as of 2026-07-07** (fail-closed helper `lib/results/healthProcessingConsent.ts`; raw `crp_level` kept but gated: seq-03a's hs-CRP >10 branch compares the numeric), **deploy pending**. ⚠️ Deploy sequencing: must ship **with or after** the CA-018 checkout-consent deploy, otherwise no customer has consent stamped and seq-03a personalization silently degrades. Conservative default per the open DPIA §4 decision; reversible if Keith + Ewa document a lawful basis instead. **CIO recon 2026-07-07 (live workspace 219186):** seq-03a enters via segment 21 (attribute-change→true on `low_vitamin_d`/`low_b12`/`elevated_crp`) so non-consented users simply never enter (intended degradation, no misfire); `crp_level`/`low_ferritin` appear in no trigger/segment (Liquid-only); seq-03c uses only ungated `results_all_clear` (segment 22); all other running campaigns have empty filters. Profile cleanup NOT needed: all 6 existing CIO profiles are bare (no health attributes stamped). CIO transfer safeguard resolved (CIO DPA = EU SCCs + UK Addendum + DPF cert; no bespoke IDTA).
- **CIO campaign 5** ("seq-03b Low-T Nurture, consented") repurposed to trigger `lowt_nurture_consented`, 3 education-only emails (day 0/+3/+14), **state DRAFT by design**: go-live is a human go/no-go; no TRT/treatment promises. Lawful basis = Keith interim-approved Art 6(1)(a)+9(2)(a) (`03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`); solicitor confirmation task `869d99kzh` open post-launch.

### Kit cross-sell repair: 2026-07-08

An audit found all three kit-to-kit cross-sells non-functional. Repaired + a governing rule set (Keith, 2026-07-08): **post-result cross-sell = the complement, never the superset** (`04_products/results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`).

- **Kit 1 → Kit 2: LIVE, unconditional.** Normal-T Kit 1 returns `secondaryCta: CTAS.kit2CrossSell` (→ `/kits/energy-recovery`). The prior `energy_symptoms` gate was dropped (signal never captured; Kit 2 is the honest default). Includes borderline T (12–<15). Pre-existing compliant Kit 2 helper copy.
- **Kit 2 → Kit 1 broken link: FIXED.** `kit1CrossSell.href` was `/kits/testosterone-health` (404, no such route); corrected to `/kits/testosterone`. Fires for Kit 2 multi-deficiency or Vit-D/B12 + age ≥40. Regression added.
- **Kit 3 cross-sell: removed.** The briefly-added `kit-3-cross-sell` CtaType is deleted; Kit 3 re-sells markers a buyer already has, so it has no post-result cross-sell role. It stays a front-of-funnel default (the test-selector) + direct-traffic product. (Closes the old "engine gap" line by retiring the concept, not building it.)
- **Dead code removed:** the retired `foundingMember` CTA (type `founding-member-list`, unreferenced) deleted from the registry + CtaType union.
- Tests: classifier suite 22 assertions, + consent-gate 37 + maintenance-offer 42; tsc + build clean.

### All-clear maintenance offer: BUILT DARK 2026-07-07, flag OFF, pending Ewa sign-off

- New `maintenance-offer` CtaType + `resolveCtas()` all-clear branch (below every GP-block/GP-referral and low-T/borderline check), gated on `MAINTENANCE_OFFER_ENABLED === 'true'` (server-side, read per call, default OFF = provably inert; flag-OFF output byte-identical, test-asserted). Copy rendered verbatim from `07_sales/funnel/all-clear-maintenance-offer-copy.md` (one card, per-kit claims block via `maintenanceClaimsForKit()`); anchor-card pattern renders the offer once per all-clear result. Button → `/supplement-waitlist` (Phase 0a; no checkout built).
- Events `supplement_offer_shown` / `supplement_offer_clicked` wired through the first-party `/api/events` + GA4 pattern with `segment: 'all_clear'`; fire only when the flag is on.
- Tests: `scripts/test-maintenance-offer.ts` (41 assertions) in `npm test`; suite + tsc + build clean.
- **Ship path:** Ewa signs `07_sales/funnel/all-clear-offer-signoff-pack.md` → flip the env flag + deploy. A "no" ships nothing.

### Lab-cancel ops alert: DEPLOYED 2026-06-30/07-01, alert campaign DRAFT

- Vitall `order-cancelled` → status flip + `emitOpsAlert()` live (commit `9ca878e`, E2E-verified: route returned `202 {orderCancelled:true}`, DB flipped, ops profile got `internal_ops:true`). **CIO campaign 22** ("OPS: Lab Order Cancelled", transactional, trigger `lab_order_cancelled`, template 53) is **DRAFT**; event fires but no email sends until Keith activates it (email delivery not yet tested). Never auto-refunds.

### Ewa author / Person schema: credentials verified

- `lib/authors.ts` Person schema live with verified credentials (GMC **4758565**, licensed GP; `sameAs` = `https://www.gmc-uk.org/doctors/4758565`; "Harley Street TRT-trained" substantiated, cert filed at `03_compliance/credentials/ewa-trt-training-2025.md`). Approved vs avoid phrasings are in that credential file. **Open (low priority):** professional photo (still `/og/default.png` placeholder), LinkedIn `sameAs` (add once her profile is populated), cert PDF storage decision.

### Tracker v1 ("My Story"): designed, NOT built

- Full design spec exists as mockups in `docs/mockups/` (`tracker-v1-scenarios.html` is the primary reference: 8 scenarios, 4 marker-card states, proportional-time sparkline rules, declining-marker + threshold-crossing rules, hs-CRP lower-is-better). Queued for M3–M4 post-launch. **All tracker display logic is frontend-only**: the DB already holds everything; the gap is the display layer (no `Sparkline.tsx`/`TrendBadge.tsx`/`timeline_events` table). Open with Ewa before code: trend-classifier algorithm, retest-date calc, supplement-event API schema.

### Central CTA routing (`kitCTA`): BUILT 2026-07-09, articles not yet migrated

- `lib/content/kitCTA.ts` is the single pillar → CTA-target map, mirroring `06_marketing/seo-ai-search/content-atomisation-model.md` §4. `components/marketing/InlineKitCTA.tsx` takes a `pillar` prop and resolves through it. Guarded by `scripts/test-kit-cta.ts` (wired into `npm test`): asserts every pillar hits a live route, no CTA points at `/lp/*` or the FM list, kit slugs match `lib/pricing.ts`, the three no-live-product pillars hold at email capture, and **Pillar E throws** (Ewa-gated andropause).
- **Built because it did not exist.** Three docs instructed routing through a central `kitCTA` config that had never been written; nine articles hard-coded `ctaHref` instead. Surfaced by the 2026-07-09 content-machine dry run.
- **Migration COMPLETE 2026-07-09.** All **15 articles** (not nine: six existed only in the DB) now name a pillar. Deployed, imported, revalidated, and verified live: all 14 published articles return 200 with byte-identical href, UTM string, and button label; the draft verified via `/blog/preview`. Redirecting a pillar is now one line in `lib/content/kitCTA.ts`.

**Safe order for any future content+code change** (learned the hard way, see below): deploy the component → confirm it is live by rendering a **non-public draft** through `/blog/preview/<slug>?token=$PREVIEW_SECRET` → `import-blog-to-db.ts` → `/api/revalidate` → smoke test. Note the asset-fingerprint trick does **not** detect a server-component deploy (client chunks are unchanged); the draft-preview canary does.

### Two landmines found while migrating (both fixed 2026-07-09)

- **The MDX mirror was stale on `status`.** `b12-blood-test`, `fbc-blood-test` and `ferritin-blood-test` carried `status: draft` in `content/blog/` while the DB had them **published**. `import-blog-to-db.ts` takes status from frontmatter, so running it **silently unpublished three live articles**. This actually happened during the migration and was caught and reverted within minutes. Mirror corrected. **Before ever running the import, diff the mirror's `status:` against the DB, not just the body.**
- **Content and code must ship together, code first.** The DB body and the deployed component are one unit. Importing `pillar=` bodies while the old `ctaHref`-only component was still live **500'd every blog article**. Restored by rolling the DB back within minutes. The component is now backwards-compatible (accepts both), so the safe order is: **deploy the component, confirm it is live, then import the content.** Never the reverse.

---

## Content-engine Action: Content Library mirror step added (2026-07-13)

- `content-library-sync.ts` added to `scripts/content-engine/` (reuses `clickup.ts`; hierarchy + task helpers appended there). The daily `content-engine.yml` run now has a "Content Library mirror" step after the blog-mirror sync (`continue-on-error: true`, so it can never fail the engine). One-way git → ClickUp: upserts one task per `06_marketing/content-machine/assets/*.md` into list `901219526361`; fingerprint-diffed, idempotent (verified 2026-07-13: 0/0/3 unchanged on re-run). Owner docs: `06_marketing/content-machine/` (STATE + build spec).
  **[CORRECTED 2026-08-01 by Phase 1: the mirror's SOURCE moved, its direction did not.** The status it pushes now comes from `content_assets`, because the asset files no longer carry one. Still one task per asset, still one-way, still read-only in ClickUp. Anything in this entry that reads "git wins" is now "the database wins".]**

---

## Phase 0b activation checklist (supplements, deferred)

1. Create live Stripe products + prices for Daily Stack / Collagen / Complete Men's Stack.
2. Add `STRIPE_PRICE_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK` to Coolify; redeploy.
3. Configure the Billing customer portal in **live** mode (per-mode setting); required for `/api/checkout/portal`; currently unconfigured because there are no 0a subscriptions.
4. Decide dunning: **Stripe-native** Smart Retries vs **CIO T-07** emails; mutually exclusive, running both = double emails. Recommendation: Stripe-native at launch, CIO T-07 as a later reversible brand upgrade.
5. seq-04 Day-75 retest needs `SUBSCRIBER10` (already live); optionally set a fixed `redeem_by` window when the sequence goes live. seq-05 pause option needs the Stripe subscription pause confirmed live in the portal.

---

## LP lab-claim standardised (2026-07-25, deployed)

- The three kit landing pages (`app/lp/{testosterone,energy-recovery,hormone-recovery}`) used a mix of "UKAS accredited lab" (short) and "UKAS ISO 15189 accredited lab". Standardised all instances (visible hero line + SEO metadata) to **"UKAS ISO 15189 accredited lab"** (CA-026 standard; substantiated by Vitall services agreement §3.6). Committed `de074da`, deployed via Coolify, and verified live on production (old short-form absent on all three).
