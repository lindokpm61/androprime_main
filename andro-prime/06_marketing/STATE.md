# Marketing: Current State

Volatile status of the acquisition/content engine. Durable strategy + rules are in `CONTEXT.md` and the `seo-ai-search/` docs (`content-engine-roadmap.md` is the live-state authority; trust it over any count pinned here). Update the date on each change.

_Last updated: 2026-08-10 (Instagram/Facebook restructure recorded and the channel register corrected; carousel prototype moved into the repo, base photo replaced, Higgsfield re-tested; **both carousel blockers cleared**: Metricool schedules carousels, and the mask is cut with one headline swap proven. Remaining gates are compliance and cadence, neither technical)._

---

## Instagram + Facebook restructure, and a three-week register drift (2026-08-09/10)

**Verified against Metricool `getBrandSettings` on 2026-08-10**, not asserted from the doc. Full detail: `content/social-channel-setup.md` (top block).

- **`@keithandroprime` created 2026-08-09** and is now the **company** Instagram, closing the handle divergence with YouTube / X / Substack that the register had carried since 2026-07-19.
- **`keith.antony.ai` is the personal account** and is the designated **carousel lane** (Keith, 2026-08-10). `keith.antony.tech` is a spare, connected to nothing.
- **The register was wrong for three weeks.** It recorded a 2026-07-19 decision to run the founder presence on `keith.antony.tech`; the account actually connected was always `keith.antony.ai`, wired nine days _after_ that decision. Nothing detected it. Logged as skill observation `OBS-181` (add a connector-backed channel reconciliation to `/context-audit`).
- **Two Metricool brands** now exist (of 15 available, so no cost): "Keith Andro Prime" (company, all six networks) and "Keith Antony AI" (personal, IG + FB only).
- **Two Facebook pages**, confirmed by Keith: `1292054467322962` = company, `913631891838376` = personal.
- **Open risk, undecided:** the entire company brand now points at an Instagram account days old, on a history of repeated restrictions. Hand-posting for the first fortnight before connecting Metricool was recommended and not decided.
- **Also corrected:** the register's "create the account from inside an established account" advice **was tried and failed** (restricted then banned within hours). The route that worked for `@keithandroprime` was not captured.

## Instagram carousel channel: PROTOTYPED, not adopted (2026-08-10)

Keith wants **one carousel a day for 30 days** on `keith.antony.ai`. **The prototype is now in the repo** at `content/instagram/carousel-prototype/` (moved out of a session scratchpad 2026-08-10, where it was the only record of the base-photo change and would have been lost on cleanup). Open its `review.html`; the folder `README.md` carries the findings. **Nothing has shipped and no copy has been pre-flighted.**

- **What works:** an 8-slide 1080x1350 template rendered deterministically from brand tokens via headless Chrome (type never touches a model), plus a cover built by **inpainting a fixed base photograph** so only the masthead and headline change per article. That last part is what solves character consistency: the photo never changes, so the man never changes. Cover animates to a 5s clip with the headline intact.
- **Base photo replaced 2026-08-10.** The working base is no longer the original kitchen photo. Six approved bases (`base-1..6`, 1122x1402, greyscale, band baked in) supersede it; **base-2 is selected**, with the eyes opened. Three animated covers are shortlisted, one Replicate and two Higgsfield.
- **The eyes read as shut at feed size** on all six. None are actually shut: they are downcast with heavy lids and a furrowed brow. Fixed by editing, but **no model will open the eyes and keep the gaze down** (four attempts, two models); the gaze comes up to camera, which was accepted as a deliberate change.
- **Tooling decided:** Replicate, not Higgsfield. Pay-per-use, no monthly floor, ~£0.07 an inpaint. `REPLICATE_API_TOKEN` added to the repo-root `.env` 2026-08-09. **Re-tested against Higgsfield 2026-08-10 and the decision stands, for a harder reason than cost: Higgsfield has no masked inpainting at all** (no model in its catalogue accepts a mask), so every edit re-renders the whole frame and the character drifts. Measured on the untouched regions, masked Replicate scores 0.965-0.984 SSIM against the source; the best Higgsfield editor manages 0.933-0.965. Its Kling 3.0 also has **no `negative_prompt`**, which the Replicate call relied on to stop the printed headline warping, so only low-motion scenes survive. Confirmed again that the pro plan's unlimited allowance **does not work over MCP**.
- **RESOLVED 2026-08-10: the mask is cut and one headline swap is proven end to end.** Box is x 350-785, y 452-750 on the 1122x1140 image area, cut against measured ink extents rather than by eye. `cover-why-tired.jpg` carries a different headline ("Why am I always tired?", a real published article) on the same photograph, and **every region outside the box measures 1.000 SSIM against the source** above, below, left and right. `inpaint.js` is now parameterised (`--l1 --l2 --out --dry`) and does not trust the model's output wholesale: Ideogram returns its own resolution, so the result is rescaled and merged back through the same mask, and the band is re-attached afterwards. About £0.07 a swap. **The mask is valid only for this exact cover geometry; if the base photo changes it must be re-cut.** Reconstructing a mask client-side after a whole-frame edit was tried earlier and fails, which is why the masked route is non-negotiable.
- **The band is baked at a different height in every base** (195px on base-5 to 263px on base-1). It should be composited at a fixed height from the template, not inherited from the image generator.
- **Source material is the binding constraint, not production.** Of 18 published articles only ~12 map to a live kit marker (cholesterol, liver and thyroid excluded until those kits launch), so 30 daily posts means re-cutting ~12 topics two or three ways.
- **RESOLVED 2026-08-10: Metricool's API does accept an Instagram carousel**, with either a still or a video in frame 1. Two 8-slide drafts were created on the `Keith Antony AI` brand (`blogId 6693691`) and read back: ids `360411107` (still cover) and `360411483` (video cover), both `draft: true`, `autoPublish: false`, dated 2026-09-15. Metricool ingested all 16 media items to its own CDN and the frame-1 assets survive intact (1080x1350, h264 5.04s for the video, band and headline sharp). Mechanics: `media` takes an array of **public URLs**, `instagramData.type = "POST"`, and a carousel is simply more than one media entry. **Caveat: this proves the scheduling path, not the publish path.** The posts are drafts that were never pushed to Instagram, so Instagram's own carousel constraints are still unexercised. Delete the two drafts, or leave them; they cannot self-publish.
- **Open decisions:** whether the man in the covers is a synthetic likeness of Keith (current), a real photo shoot (recommended), or cropped out of frame entirely; how many base photos for grid variety; and the success metric for the 30 days, which does not yet exist.
- **Compliance not started.** No slide copy has been through `/compliance-preflight`. 30 posts is 30 compressions of a signed pillar down to fragments, and the pre-flight has no fragment mode (`OBS-180`).

## `cortisol belly` promoted and briefed; the queue was purged and rebuilt (2026-08-07)

Keith picked `cortisol belly` as the next article. **It is now drafted, photographed and SUBMITTED: the
pipeline is at `stage=in_review, blocked_on=ewa`, ClickUp task
[`869efjzm9`](https://app.clickup.com/t/869efjzm9) on the Content Review list.** Not approved, not
published; Ewa's completion is the gate.

- **Draft:** `article-drafts/cortisol-belly.mdx`, registered into `blog_articles` as `status=draft` with
  a revision. 1,708 words of prose (inside the brief's 1,600-2,000 band); 2,293 total body including
  components and references. Voice 14/14, §9a AI-tells pass clean after two rewrites,
  `compliance-preflight` **0 HARD / 0 REVIEW**.
- **Three `ewa_rulings` were declared and render as a real ClickUp checklist**, so `syncApprovals`
  refuses to approve while any is unticked: the GP-alert/Cushing's boundary, three unsourced timeline
  lines, and the ClinicalInsight pull-quote (explicitly hers to rewrite or delete). **This is the
  control the andropause hub lacked on 2026-07-29, where two rulings were asked only in comments and
  silence read as yes.** They were nearly omitted here too: the draft was handed off without them and
  they were added before submission.
- **Rendered preview verified deterministically, not from a summary.** A WebFetch read of the served
  page claimed "multiple em dashes throughout the body"; a raw `curl` of the same URL returns **0
  U+2014 characters and 0 `&mdash;` entities**, and the model's own quoted example contained none.
  Title, photo and a clean silent-ingredient sweep all confirmed on the served HTML.
- **Photo:** Vitor Monthay, `n4qqCei75Vs`, a navy suit jacket in a quiet room, written by
  `unsplash.mjs use` so the ToS download trigger fired. Chosen because it is the article's own opening
  scene and contains no person, so it carries none of the body-image risk that made the draft handoff
  recommend skipping a photo. Three candidates were rejected on visual inspection: two for legible
  third-party brand marks (one hanger reads "SITUATION CONTROL", which on a stress article reads as an
  implied endorsement) and one for womenswear in frame, an unfortunate echo on an article whose wedge
  is that competing content is aimed at women. **`photoAlt` is Unsplash's ungrammatical "black blazer
  hanged on door"**, left as the tool wrote it per `/article` invariant 8; safe to correct now that the
  trigger has fired, Keith's call.

- **Brief:** `seo-ai-search/article-briefs/cortisol-belly.md`, all 21 sections authored,
  `status: brief-ready`. **Section 19 resolved by Keith the same day:** keep the working title
  (*"Cortisol Belly: what stress really does to your middle, and what it doesn't"*); **Ewa
  `<ClinicalInsight>` YES** on the honest-accounting point, hers to rewrite or remove; atomisation
  pillar is **`stress`**, not B; and the **"it's not all cortisol" section is load-bearing**, a full
  section, with the trade-off accepted that it deflates the term the article ranks for.
- **Keyword:** appended to `keywords.csv` as `validated` / `kd_source=dfs` (8,100 / KD 4), then promoted
  through the **guarded promoter** (`promote-keyword.ts`), which ran the coverage-rules §4b checks and
  returned CLEAR.
- **Three briefs had unparseable YAML frontmatter, and it is FIXED (2026-08-07).** The promoter was
  falling back to a regex/slug match for `pillar-A-hub-low-vitamin-d-symptoms.md`,
  `pillar-A-spoke-14-signs-of-vitamin-d-deficiency.md` and `pillar-I-hub-cholesterol-test.md`, so those
  three contributed only their slug to the anti-cannibalisation check and **not their declared
  `primary_query`**. One cause in all three: the `sequence:` value is an unquoted YAML scalar containing
  a `: ` (`...rebalance sequence: G wk 1-2`, `...paired with A.hub: hub publishes first`,
  `...2026-06-18 (Keith: Option A)`), which YAML reads as a nested mapping key. Fixed by single-quoting
  the three values. **No brief content changed, not one word.** Re-verified: 0 parse failures, and the
  promoter's fallback note is gone.
- **Four older briefs have no frontmatter block at all** (`pillar-B-hub-why-am-i-always-tired`,
  `pillar-B-spoke-signs-of-stress-in-men`, `pillar-C-hub-increase-testosterone-naturally`,
  `pillar-K-hub-brain-fog`) — hand-written before the scaffold existed. **Deliberately left alone: they
  are not a gate gap.** `matter()` returns empty rather than throwing, so the promoter never warned on
  them, and they are covered twice over — by the filename `deScaffold` slug path the gathering function
  is explicitly built for, and by their live `content/blog/*.mdx`, which do carry
  `keyword_coverage.primary_query`. Adding frontmatter would be authoring, not repair.
- **`keyword_queue` purged and re-seeded.** All 30 rows dated from one 2026-06-19/21 import and the table
  could not answer the promotion gate's first question. It now holds **33 rows that answer three
  questions**: 18 `published` (one per live article, from the MDX `keyword_coverage.primary_query`),
  2 `planned` (the two cortisol articles), 4 candidates, 2 parked (`apob test`, `home cholesterol test`),
  and 7 `rejected` carrying this pass's reasons so they do not resurface. The old rows' **rejection
  reasons** are preserved in `seo-ai-search/2026-08-07-keyword-queue-purge-backup.md` — they encode a
  standing rule (FBC indices are sections inside `fbc-blood-test`, never standalone pages) that would
  otherwise have to be re-derived.

**Correction, and it had already propagated.** Both cortisol entries in the selection doc and the STATE
entry below said **"the only honest CTA is Kit 2"**. That is wrong. `09_website-app/frontend/lib/content/kitCTA.ts`
is the source of truth for CTA routing and routes the `stress` pillar to **`/waitlist`** with `kit: null`;
its own comment warns against exactly that move (*"Do not 'nearly match' these to Kit 2"*). Kit 2 is
Vitamin D, Active B12, hs-CRP and ferritin, none of which is cortisol. The live `signs-of-stress-in-men`
spoke already set the kit-less precedent. Corrected in the selection doc (§2.1, §2.5) and in the brief
(§13). **The claim was written from product knowledge without reading the routing map, and it survived
into a second document and a brief before anyone opened the file that decides it.**

---

## Keyword recheck: cholesterol is out, `cortisol belly` is in, and a "KD 0" was never real (2026-08-07)

`seo-ai-search/2026-08-06-next-keyword-selection.md` §7. Triggered by Keith recalling cholesterol as a live
candidate. Still nothing promoted: the candidate-to-accepted flip is his gate.

**Cholesterol is not a next target, and the recollection has a source.** `cholesterol-test` is already one of
the 18 live articles (Pillar I hub), and its coverage map parks six rows as future Pillar I spokes and names
an ApoB spoke as the default follow-on. That sanction is what was remembered. Tested fresh, the cluster fails:
`how to lower cholesterol` is 27,100/mo at **KD 48** with an AI Overview and **NHS at #1**, and page one is
eight institutional results out of eight (NHS, BHF, Mayo, HEART UK, Stroke Association, Nuffield, Harvard,
MedlinePlus). Every sibling term is KD 46-59. Same institutional lock that killed the vitamin D dosing terms.
What survives is real but small and self-competing: `apob test` 880/KD 9 on an open SERP, `home cholesterol
test` 2,900/KD 7, under 5k/mo combined, and **ApoB is already the live hub's hero section** — parked, not
dropped.

**New pick: `cortisol belly`, 8,100/mo at KD 4.** Wellness tier, **no NHS on page one** (a university
psychology blog holds #6 and a supplement contract manufacturer holds #9), and an AI Overview citing only
commercial publishers, which makes it a live GEO target. It extends the cortisol brief already being written,
and it is **the only winnable entry into the belly-fat territory** `content-calendar.md` calls the
highest-leverage gap, whose head terms this repo already killed at KD 55-64. Same structural ashwagandha
exclusion as the cortisol hub, and visibly so: the #9 result names ashwagandha and four related searches are
supplement queries. Must also state that the term is not a formal diagnosis, which the AI Overview itself
leads with and which is the `myth-of-normal-range` posture the brand owns.

**Live sequence (supersedes the earlier four):** `how to lower cortisol` → `cortisol belly` → the liver-enzyme
cluster → `how to increase ferritin levels` → `cortisol test`. Three wellness, two clinical, which moves the
wellness tier from **28% to 35%** against the 40% floor, the first real move since June. Ferritin remains the
only pick with a live product behind it.

**Correction that matters beyond this doc: the ferritin terms were recorded at "KD 0" and DataForSEO returns
no KD value at all.** Verified against two endpoints. Absent is not zero, and the coercion made a term with no
difficulty signal read as the easiest target on the page. Corrected to `n/a` in place. **Standing rule: a
missing metric renders as `n/a`, never `0`.** Also rejected this pass: `statins side effects` (33,100/KD 9,
blocked on compliance not SERP: a POM query we cannot counsel on), `insulin resistance` and `prediabetes
symptoms` (the I hub's "future blood-sugar spoke" is not buildable, both locked on the diabetes SERP), and
`brain fog causes`, which **is already the `primary_query` of the live brain-fog hub** and reached a shortlist
anyway. It was caught by grepping published frontmatter, not by the gate: see the task-observer log.

## Next keyword selection, and the queue that could not answer the question (2026-08-07)

`seo-ai-search/2026-08-06-next-keyword-selection.md`. Nothing promoted: the candidate-to-accepted flip is
Keith's gate and he has not picked yet.

**The `keyword_queue` is stale and should not be trusted as the worklist.** All three rows at
`status=accepted, coverage_status=briefed` are articles that went live on **2026-06-22**, and the remaining
candidates are a 2026-06-21 import, mostly off-strategy (`hiv test kit`, `superdrug blood test`).
`reconcile-coverage.ts` writes live status back into `keywords.csv` but **not** into the queue, so the
queue only moves forward by hand. The promotion gate's first question is "has this already been done?", and
the store that gate reads is the one nothing updates. Fixing the write-back is a separate job.

**Selection therefore went back to `keywords.csv` and re-pulled every finalist live from DataForSEO**, with
a SERP check on each, because four of the standing recommendations fail on the SERP despite good volume and
KD: `hba1c test` (diabetes SERP, and the I hub deliberately avoids it), `high cortisol symptoms` (Cushing's
syndrome SERP), `vegan omega 3` (KD 0 is real but the SERP is pure e-commerce, not addressable by an
article), and the belly-fat feeling hub the calendar calls "highest-leverage" (real KD 55-64). Also
`night sweats in men`, listed in `content-calendar.md` at 8,100/mo, now returns **no volume at all**.

**Picks:** `how to lower cortisol` (18,100/KD18, open SERP, wellness tier), the liver-enzyme cluster
(~20k at KD 4-20, pre-sanctioned by the H hub's coverage map), `how to increase ferritin levels`
(4,400/KD0, wedge SERP).

**Two findings that shape the sequence.** The wellness floor is breached: 5 wellness / 11 clinical-curious
/ 2 TRT across the 18 live articles, so **28% against a 40% target**. And the cortisol cluster's cheapest
sub-cluster is `supplements to lower cortisol` (8,100/mo at KD 6-25) which **we cannot write at all**:
ashwagandha is the silent ingredient and cortisol is its strongest evidence base. No kit measures cortisol
either (Kit 6 parked), so the only honest CTA is Kit 2. Treat it as a traffic, authority and GEO asset, not
a conversion one. If the next slot must pay for itself, ferritin is the pick, since it is a live Kit 2 marker.

## CA-028 decision sweep completed across the planning layer (2026-07-31)

The 2026-07-27 sweep cleared the stale Pillar E block from eight locations inside `content-machine/`. It did not reach the planning and strategy layer, and thirteen more carriers were still telling readers and generators that Pillar E was blocked, five days after the pack was approved and a day after the hub went live. All now updated.

- **Updated (13 places, 12 files):** `seo-ai-search/content-atomisation-model.md` (§3.6, the pillar routing table, §6 sequencing), `blog-ai-seo-strategy.md` (pillar table, the gating-decision block, the Pillar E section heading, the 13+ build slot), `seo-content-context.md`, `content-calendar.md` (the tier-mix caveat, the 12-week note, the Tier 2 hold list), `discovery-symptom-first.md` (compliance flags, the so-what action), `coverage-rules.md`, `content-engine-roadmap.md` (pillar list plus a stale current-state block), `content/youtube-founder-journey-strategy.md` (rails, dependency table, sequencing, next actions), `content/youtube-scripts/example-scripts-line1-line2.md`, `content-machine/hook-playbook.md` (missed by the 2026-07-27 pass and read by `/hook` and `/script` on every run), `content-machine/templates/hook-bank.md`, `content-machine/templates/dm-keyword-map.md`, `content-machine/founder-content-system.md`, `content-machine/content-queue.md` (both the guardrail and the Blocked list), `CONTEXT.md` (tier mix), `seo-ai-search/partner-proxy-buyer-persona.md`, and `.claude/skills/content-week/SKILL.md`.
- **The correction that matters most:** Pillar E and the ASA sexual-function surface were written as one gated block in four places. They have split. **Pillar E is cleared; sexual function and libido are not**, and libido stays inside whatever CA-028 permits, nothing wider. Anything that treats them as one unit now over-permits or under-permits one of them.
- **`FM list` corrected to `Kit 1 / Kit 3` in two places** (`blog-ai-seo-strategy.md`, `seo-content-context.md`). CA-028 §5 bans the FM list for Pillar E and the standing content rule bans it everywhere; both docs still named it as the Pillar E destination.
- **The queued action is now live work, not a blocked row.** `content-queue.md` said "the moment the hub publishes, add a LinkedIn, a Facebook and two shorts against it". The hub published on 2026-07-30. The largest shelf in the frustration plan (~12 to 15k/mo) still has **zero derivatives**.
- **Code disagreement, flagged by the sweep and since FIXED** (2026-07-31, as its own task per sweep invariant 4): `09_website-app/frontend/lib/content/kitCTA.ts` marked pillar `E` as `gated: true` and `resolveKitCTA()` threw on it. Ungated; the target was already Kit 1, which is inside CA-028 §5. The gating mechanism itself was kept for the next pillar that needs one, and `scripts/test-kit-cta.ts` now asserts both that Pillar E resolves to Kit 1 and that the mechanism still throws when a pillar is marked gated. `npm test` exit 0. Detail in `09_website-app/STATE.md`.
- **Repo MDX status drift corrected:** `content/blog/andropause-male-menopause.mdx` still read `status: draft` a day after publishing, because the publish flips the DB row and nothing flips the file. Set to `published`. All 18 articles are live in `blog_articles`; there are no drafts.

## Both `{/* TODO Ewa */}` pull-quote markers are stale artifacts, not open sign-offs (verified 2026-07-31)

Raised as ESCALATE items during the CA-028 sweep on the strength of the markers still being in the article bodies. Keith challenged it; ClickUp settles it. **Both articles were signed off by Ewa, and neither pull quote is outstanding.** The sign-off record is the blog-article Content Review list (`901218140081`), where completing the task IS the approval.

| Article | Review task | Approved (task completed) | Published | Comments |
| --- | --- | --- | --- | --- |
| `how-to-read-blood-test-results` | [`869e4v3e6`](https://app.clickup.com/t/869e4v3e6) | 2026-07-15 23:12 UTC | 2026-07-15 23:33 UTC | none, so no change requests |
| `andropause-male-menopause` | [`869e9hey1`](https://app.clickup.com/t/869e9hey1) | 2026-07-29 23:49 UTC | 2026-07-30 09:24 UTC | 2, both Keith's submission notes |

- **The andropause quote was explicitly put to her, twice**, in Keith's submission comments: "The Ewa pull-quote is draft direction, yours to rewrite in your own voice or remove" (2026-07-27) and "Your pull-quote, untouched and still yours to rewrite or remove" (2026-07-30). She completed the task without changing it. Approval as drafted, on the record.
- **The how-to-read quote was in the previewed draft she approved**, 21 minutes before publication, with no comment either way.
- **What actually went wrong:** the `{/* TODO ... before publish */}` comments were never deleted once their condition was met. A marker whose text asserts a blocking condition, left in place after the block clears, reads as an open gate forever. It caused a false escalation to a clinician who had already answered.
- **Owed:** strip both markers from the served body, and stop writing self-asserting TODO blockers into article bodies where the resolution lives in a different system.

## Both Pillar E andropause and the FAI reframe are LIVE (2026-07-30, 07:00 UTC tick)

The orchestrator tick published both. Verified by fetching the public pages, not by reading the DB.

- **`/blog/andropause-male-menopause` is live**, serving rev3 `3048fabc` (the voice v1.2 rewrite). `stage=published`, review log `approved`.
- **`/blog/free-androgen-index` is live with the reframe**, revision `73bf7d77` promoted over the old copy. New title on the page ("what your number means, and the figure UK labs use instead"), the overclaim "the figure most GP tests never calculate" is gone, and the Ho 2006 limitation section is present.
- **Ewa answered all five FAI rulings and they are in the compliance record verbatim.** `content_review_log.notes` for the reopt now reads "Rulings answered at approval (5/5)" with her wording against each question: *"leave it as is"*, *"leave it"*, *"Keep it"*, *"that's fine"*, *"Yes correct it to the right sources"*. That capture is the new `recordRulingAnswers` step; it is the artefact that was missing from the andropause approval the night before.
- **Still owed on the andropause hub:** ~~her pull-quote sign-off (the `{/* TODO Ewa */}` block shipped as drafted)~~ **CORRECTED 2026-07-31: the pull-quote sign-off was never outstanding.** ClickUp review task `869e9hey1` was completed by Ewa on 2026-07-29 23:49 UTC, and Keith's submission comment had told her twice, in terms, that the pull quote was "yours to rewrite in your own voice or remove". She completed without touching it, which approves it as drafted. The `{/* TODO Ewa */}` block is a leftover drafting artifact, not an open gate. Also keyword row 119 (`andropause treatment`, blocked on the `keyword_queue` seeding), and the 3,381-word length on the FAI article against a 2,200-2,600 band, which is now a live-copy decision rather than a pre-publish one.

## Pillar E andropause hub rewritten to voice v1.2 in place, still on Ewa's gate (2026-07-30)

- **`andropause-male-menopause` rev3 replaced rev2 in the DB while the article was still unopened in Ewa's queue.** It was the last article drafted to the old voice standard: draft committed 2026-07-27 01:30 (`2a1d82f`), standard changed 22 hours later in `b19ea79` (tone-of-voice v1.2 §9a, `references/narrative-devices.md`, `/article` 13-point → 14-point bar). Keith's call: rewrite before sign-off, not after, so Ewa reads it once. The alternative was the position `myth-of-normal-range` is in above, where the rewrite came after publication and now needs a second clinical review.
- **Prose only, and verified as such.** Headings, all eight FAQ q/a pairs, every citation and URL, the `{/* TODO Ewa */}` PullQuote, the `<EvidenceBox>`, the References block, all internal links and both CTA panels: **byte-identical** to rev2 by diff. Frontmatter unchanged except `dateModified`. One correction outside the prose: "UKAS-accredited lab" → "UKAS ISO 15189-accredited lab" (2 instances), the substantiated form.
- **Gates.** Body 2,420 → 2,486 words (band 2,200-2,600). Voice 14/14 + §9a pass clean. `compliance-preflight` **3 HARD / 0 REVIEW, identical to rev1**: the same three intentional query-echo uses (H2 + FAQ Q6 "treatment", FAQ Q7 "diagnose") already put to Ewa. **The rewrite introduced no new flags.** Compile-gate PASS against the prod preview; rendered preview fetched and asserted (new prose present, cut lines absent, GP-routing and no-diagnose lines intact).
- **Nothing was deleted.** rev1 `1fc02f26` and rev2 `ef2a7e66` retained; rev3 `3048fabc` is `current_revision_id`; `blog_articles.status` still `draft`. `content_pipeline` back at `stage=in_review, blocked_on=ewa` on the same row. **No second ClickUp task**: `869e9hey1` stays the single open submission and its preview link serves rev3 automatically, because the preview renders from the DB. Ewa commented with what changed, what did not, and the same three rulings restated.
- **Audit-trail fix found on the way in.** `content_review_log` row `7c49693d` was pinned to rev1 while rev2 was the live body, desynced by the 26 July same-day copy-polish re-sync. Repinned to rev3 with the full revision history in its `notes`.
- **Tooling gap, not yet fixed.** `draft-writer` selects only `stage='brief_ready'` and `signoff-concierge` only `stage='drafted' AND clickup_task_id IS NULL`, so **neither script can revise an article already at `in_review`**. The `/article-to-review` skill's invariant 3 ("re-draft → re-run draft-writer → it re-gates") is wrong on that path. Worked around by round-tripping the pipeline stage by hand. See the task-observer log.
- **APPROVED by Ewa 2026-07-29 23:49:42 UTC** (ClickUp `869e9hey1` marked complete; confirmed as hers by Keith 2026-07-30). She approved **rev3**: it was on the preview from 23:12:04 and the explanatory comment landed 23:15:13, both before she closed the task. Auto-publishes on the 07:00 UTC tick, no slot holding it (`target_date` null). The three CA-028 query-echo rulings were **not answered in writing**; her completion approves them implicitly and Keith accepted that 2026-07-30. Detail + the caveat in `../03_compliance/STATE.md`.
- **Keyword attribution done for the four rows the hub owns.** `keywords.csv` rows 108 (`andropause`), 109 (`male menopause`), 110 (`male menopause symptoms`), 122 (`do men go through menopause`): `primary_article_slug=andropause-male-menopause`, `coverage_status=drafted` (what `reconcile-coverage.ts` computes for `in_review`; it will move them to `published` from the next tick). Row 121 (`manopause`) stays covered-in-passing per the brief.
- **Row 119 `andropause treatment` NOT promoted, blocked upstream.** `promote-keyword.ts` operates on the `keyword_queue` DB table and there is no row for that query ("No keyword_queue row for query"), so the guarded anti-cannibalisation path cannot run. Left unattributed deliberately rather than hand-setting the slug and bypassing the guard. The article does cover the query on-page (H2 + FAQ Q6), so this is an attribution gap, not a coverage gap. Needs the queue seeded (`csv-to-queue.ts`) first.
- **Pre-existing CSV drift found, not swept:** `reconcile-coverage.ts --dry` reports **12 unrelated rows** whose `coverage_status` lags the DB (fbc, cholesterol, b12, ferritin, liver-function, thyroid, brain-fog, free-androgen-index and four `how-to-read-blood-test-results` variants, all `drafted`/`briefed`/`unassigned` while published). Running the reconciler live fixes all 12. Left alone: unrelated to this session, Keith's call.
- **Still owed:** her pull-quote sign-off (the `{/* TODO Ewa */}` block ships as drafted unless she edits it), and row 119 above.

## Voice-rewrite of the published `myth-of-normal-range` article, drafted not shipped (2026-07-27)

- **`seo-ai-search/article-drafts/myth-of-normal-range.mdx`** is a voice rewrite of the **already-published, Ewa-signed** article, applying the new `02_brand/references/narrative-devices.md`. `status: draft` so nothing picks it up by accident; the live file is untouched.
- **Gates:** compliance scanner **0 HARD**, 3 amber, and a diff proves **all three amber sit on lines carried over verbatim** from the signed version, so **nothing in the changed prose flagged**. H2/H3 headings and FAQ questions are byte-identical to live, so keyword coverage cannot regress. 0 em dashes. Body 1,992 → 2,174 words.
- **Both retired openers were still on the published page** ("A man brought me his GP results recently", "So I asked him the one thing his GP hadn't"), despite `02_brand/CONTEXT.md` retiring both as AI tells. Removed in the rewrite.
- **Blocked on Ewa.** It is a copy change to a signed clinical article, so it needs her sight on the changed prose, then the normal `seed-pipeline` → `draft-writer` → `signoff-concierge` run. **Not published, not approved.**
- Open, Keith's call: the `excerpt` frontmatter still opens "Here's why...", a throat-clearing opener by the new §9a, but it is the indexed meta description so changing it carries an SEO cost.

## Pillar E andropause hub drafted + Substack line-up queued (2026-07-27)

- **Pillar E hub `andropause-male-menopause` drafted via `/article` and submitted to Ewa.** Draft `seo-ai-search/article-drafts/andropause-male-menopause.mdx` (2,388 words, voice 13/13, 4 UK sources: NHS male-menopause, BSSM/Hackett 2023, Lab Tests Online UK, BHF; Unsplash photo Kwami Fattah Al Sissi). Ran the full `/article-to-review` pipeline (seed-pipeline -> draft-writer -> signoff-concierge); now **`stage=in_review, blocked_on=ewa`** (ClickUp "Review:" task `869e9hey1`). A `/stop-slop` pass tightened it (~39->45/50) and it was re-gated so Ewa reviews the tightened copy. NOT approved / NOT published: Ewa's per-asset CA-028 sight is the gate. Brief Section 21 delivery report filled; brief frontmatter YAML fixed (unquoted `": "` in `vol_uk`/`kit_funnel` was breaking gray-matter, which blocked seed-pipeline). Still owed before publish: promote CSV rows 108/109/110/119/122 `gate`->`briefed`; Ewa pull-quote sign-off.
- **Substack line-up queued: 17 published articles pushed as DRAFTS** (all `is_published=false`) via the new `content-engine/substack-draft.ts` (detail in `content-machine/STATE.md`). Destinations (provisional; LP-vs-bundle call still Keith's): testosterone cluster -> `/lp/testosterone`, energy/recovery cluster -> `/lp/energy-recovery`, no-live-kit markers -> `/test-selector`. Each is a verbatim-teaser derivative of a signed article (inherits clearance); Keith reviews + publishes each. Original-size photos for the 9 photographed articles downloaded to `~/Downloads`.

## Frustration-cluster content plan + Pillar E unblocked (2026-07-26)

- **New content plan:** `seo-ai-search/2026-07-26-frustration-cluster-content-plan.md`. The strategy's "frustration + cost" gap does NOT search Google as cost (those heads are unsized in DFS); it surfaces as three shelves: (1) the andropause / male-menopause symptom umbrella (~12-15k/mo, KD 10-28), (2) competitor trust/reviews (`numan/thriva/medichecks reviews`, `is-X-legit`; ~2.5-3.5k/mo, KD 2-14, no TRT gate), (3) doubt queries (near-zero on Google, a GEO / AI-citation play, cited 0 times in 48 LLM answers). DFS-validated 2026-07-26.
- **Shelf 1 unblocked + hub brief drafted.** CA-028 (Pillar E andropause pack) logged APPROVED (see `../03_compliance/STATE.md`). Hub brief `seo-ai-search/article-briefs/pillar-E-hub-andropause-male-menopause.md` (brief-ready; single combined andropause + male-menopause hub per Keith 2026-07-26; governed by CA-028). Next: `/article` draft + mandatory Ewa sight; promote CSV rows 108/109/110/119/122 from `gate` to `briefed`.
- **Shelf 2/3 gated on a new claims pack** (conflict-free / comparison, CA-030-to-be, drafted, awaiting Ewa; was CA-029-to-be until the author bio took CA-029 on 2026-07-28). Proposed placement: a new `/compare/` cluster (not in the A-K pillar map); record it in `coverage-rules.md` once signed.

## Conflict-free positioning: decision sweep run (2026-07-22)

Keith adopted the **conflict-free positioning** (`../01_strategy/2026-07-22-conflict-free-positioning-decision.md`); customer-facing wording approved as **CA-026** (`../02_brand/2026-07-22-conflict-free-wording-pack.md`). Ran `/decision-sweep` across the doc layer. **UPDATED** (dated positioning banner pointing at the decision + CA-026): `positioning/product-marketing-context.md` (master context), `CONTEXT.md` (test-led Special Case), `../02_brand/messaging-framework.md` (positioning SoT), `../02_brand/brand-description.md`, `../02_brand/CONTEXT.md`, and a light forward-pointer on `master-plan/2026-06-26-tier2-sales-creation-plan.md`. **BANNERED superseded:** `master-plan/2026-06-24-test-led-positioning-validation-flywheel.md` (test-led retained as the acquisition/content flywheel, not the brand lead) and `../02_brand/patient-owned-data-propagation-checklist.md` (do-not-execute). The old lead framings (test-led personalisation, patient-owned data) are now supporting/method layers beneath the conflict-free lead. **Owner action still owed (escalated, not edited):** the actual customer-facing copy rewrite of `brand-description.md` long/short/one-liner (Keith); folding the conflict-free lead into the affiliate briefs (Keith + Ewa, via the open v2.4 brief-correction pass); optional CA-026 separation-of-incentives trust line in `../02_brand/trust-signals.md` (Ewa). **Code flagged, not edited:** homepage/layout titles still read "Premium At-Home Blood Tests for Men" (`09_website-app/frontend/app/(marketing)/page.tsx`, `app/layout.tsx`, `canonical-site/home/index.html`): owned by the site-pages agent / money-pages rewrite. Research/decision/register docs left as history per the sweep rules.

## Keyword-map backfill + SERP intent checks (2026-07-20)

Closed the two gaps a Fable review flagged. Detail: `seo-ai-search/2026-07-20-keyword-backfill.md`; the sized CSV was patched in place (now 280 rows).

- **Verified limitation:** DataForSEO (both endpoints) returns NO volume for the male-hormone HEAD terms (`low testosterone`, `testosterone test`, `ED blood test`, `man boobs`, `gynaecomastia`). So the earlier "male-hormones 136k" cluster total rode on `manopause`/`hyperthyroidism`/`moobs` and overstates commercial demand. Size the hormone heads via Google Keyword Planner or Search Console, NOT this file.
- **Newly sized:** `PSA test` 33,100 vs `prostate cancer risk` 320 (about 100x: the market wants PSA, but PSA is clinically contested, Ewa gate); `erectile dysfunction` 90,500 (treatment intent, an acquisition trap AP cannot monetise); `brain fog` 14,800 (added as a head row); `biological age test` 1,900; `mens health blood test` 210 but CPC £11.74 (highest-value click).
- **SERP intent traps:** `manopause` is clean male low-T intent, keep it as AEO/education (mapping holds). `moobs` is cosmetic-surgery / gym / male-breast-cancer-charity intent, DE-PRIORITISE (brand-safety risk).
- Kit 2 "brain fog" reweight confirmed (ClickUp `869e6hq0g`).

## VOC keyword map SIZED + reconciled (2026-07-19)

The Vitall kit teardown produced a search-volume-sized keyword to kit map: `seo-ai-search/vitall-keyword-to-kit-map-sized-2026-07-19.csv` (274 symptom/condition keywords across the 57 male-relevant kits, UK DataForSEO volume + KD + intent; 166 matched, ~519k combined monthly searches) plus brief `vitall-kit-keyword-brief-2026-07-19.md`. Analysis, prioritised product ideas and an interactive report live in `01_strategy/research/2026-07-19-vitall-*`. The 2026-07-14 VOC doc gained a "Related (2026-07-19)" cross-link; reconcile is cross-link only, nothing superseded.

**Brain-fog vocab question SETTLED (closes the 07-17 A3 rec 2):** brain fog 14,800/mo KD36 beats the tired/low-energy cluster (tired all the time 8,100/KD42; low energy 1,300/KD48; why am i so tired 6,600/KD28); fatigue is bigger at 22,200 but KD63 and generic. Action owed: weight the **Pillar K "Brain fog"** grid (already brief-ready, added 2026-06-24) and reconsider the Kit 2 "Energy & Recovery" naming toward "brain fog"; carry "why am i so tired" (KD28) as the low-difficulty long-tail. Cross-check `portfolio-demand-gap-map.md`.

## Decision: no Vitall (or competitor lab) name on customer-facing copy (Keith, 2026-07-19)

Vitall is our lab partner **and** a direct DTC competitor, so we stop advertising their brand on customer-facing pages. Rule + de-brand wording recorded in `seo-ai-search/seo-content-context.md` (blog-rule 8) and `05_partners/labs/vitall/CONTEXT.md`. Use **"UKAS ISO 15189-accredited lab"** (also the more accurate substantiation). **Exception:** legal privacy policy + terms keep Vitall named (UK GDPR + contractual flow-down).

**Swept + pushed 2026-07-19 (COMPLETE):** blog articles, drafts, briefs, the canonical-site + live `app/(marketing)` marketing pages (footers, About, How-it-works incl. the "Medichecks and Vitall" competitor line + trust pill), LPs, `public/llms.txt`, the results dashboard, and the seq-06 email source. Commits `f76f28f` (Vitall de-brand), `73e4365` + `7cdcba3` (standardized every customer-facing mention to "UKAS ISO 15189-accredited lab"). Vitall retained only on `privacy/` + `terms/` (legal) and internal/backend files. `free-androgen-index.mdx` Keith had already cleared.

**Follow-ups (logged 2026-07-19 while the ClickUp connector was down; both entered as sprint tasks once it returned):**
- **(a) Re-upload the seq-06 Customer.io campaign: DONE 2026-07-19.** Live template 34 (Email 4, "Just The Facts", campaign id 9, running) was stale at "UKAS-accredited lab"; updated in place to "UKAS ISO 15189-accredited lab" via the CIO API and verified live. Repo source `seq-06-email-4-just-the-facts.html` was also brought in sync: added the `| default: 'there'` greeting fallback that live had but the repo lacked (would have regressed the greeting on any wholesale re-upload). ClickUp `869e6er34` closed.
- **(b) Affiliate briefs still say "UKAS-accredited lab"** (PT/Influencer/Gym v2.3) and some say "GP-built report" (non-compliant per `03_compliance/CONTEXT.md`). Left for the separate **v2.4 brief-correction pass** (`affiliates/briefs/v2.4-framing-corrections.md`, still Status: PROPOSED, not approved); needs Ewa/Keith re-approval + the CA-001/CA-002 solicitor pass. Not part of the Vitall sweep. ClickUp `869e6er3f` open.

---

## How-to-read-results hub DRAFTED + queued for Ewa; `/article-to-review` skill built (2026-07-15)

The **Pillar D interpretation hub** `how-to-read-blood-test-results` (row 70, 720/KD3, the umbrella parent above the marker spokes) is **drafted and submitted for Ewa review**, sitting in the queue right behind the FAI hub. Draft: `article-drafts/how-to-read-blood-test-results.mdx` (~2,650 words). Gates: **voice 13/13** (fresh chatbot-paste opener from VOC Theme B, unused by any live sibling; "range-question problem" reframe; two triadic passages; closes on a question); **compliance clean** (`scan.js` exit 0; 3 initial HARD hits were false positives, all resolved: two rewordings + one `treatments`-inside-an-NHS-URL on an orphaned reference removed); **5 sources verified live 2026-07-15** (Liver UK / British Liver Trust reference-ranges, NHS view-results, Lab Tests Online UK U&E, North Bristol testosterone, BSSM Hackett 2023); fresh DFS SERP scan confirmed the wedge (no UK men-specialist GMC-reviewed panel-reading guide ranks; AI Overview present). Editorial photo hand-picked by Keith: Vitaly Gariev, "Man reading a letter at a kitchen table" (Unsplash `qwNqHsCu_8A`), synced into the DB. Section 21 delivery report filled in the brief. **DB pipeline state:** `blog_articles` registered `status='draft'`; `content_pipeline` at `stage='in_review'`, `blocked_on='ewa'`; ClickUp review task **`869e4v3e6`** on Ewa's Content Review list (`901218140081`) with preview `andro-prime.com/blog/preview/how-to-read-blood-test-results`; `content_review_log` submitted row written. **Owed before publish:** full Ewa clinical sign-off (LOW-MEDIUM gate) + pull-quote sign-off; **publish AFTER FAI** (the testosterone reading line links to `/blog/free-androgen-index`, still `in_review`, so it 404s if this ships first) and after the CRP hub (already live); **keywords.csv promotion** still owed (set primary_article_slug + coverage_status=drafted on rows 70/69, promote candidate rows 739/738/726/647/737); the coverage audit runs at `/publish-article`.

**New skill `/article-to-review` built** at `.claude/skills/article-to-review/` (full A–G runbook: promote keyword → brief → `/article` draft → optional Unsplash photo → seed-pipeline + draft-writer into the DB → signoff-concierge to Ewa; hands off F auto-publish + G mirror/atomise). It orchestrates the existing tools, never reimplements them, and stops at `in_review` (never publishes, never grants sign-off). First live run was this hub. One footgun found + fixed in the doc: `seed-pipeline --run` auto-chains signoff-concierge, which then renders its compile-gate against the **localhost** base URL in `.env.local` and blocks; Phase E must run signoff with `CONTENT_ENGINE_BASE_URL=https://andro-prime.com`.

## VOC research + Tier-1 content strategy landed (2026-07-14)

Primary-source customer research mined from Reddit (r/Testosterone, r/Supplements, r/SteroidsUK) and Quora, structured into VOC themes, 3 personas, and JTBD: `seo-ai-search/voc-reddit-quora-2026-07-14.md`. It **validates existing calls** (the `GP refused testosterone test` priority and the `myth-of-normal-range` article) with real quotes, and surfaces the ChatGPT-as-bloodwork-interpreter behaviour as the strongest unmet need. Companion content plan `seo-ai-search/content-strategy-tier1-results-decode-2026-07-14.md` maps three product ideas (Decode My Results interpreter, Free-T/SHBG hero, track+retest) onto existing Pillars C/D/F, no new pillars. **Build order LOCKED 2026-07-14** against DFS figures already verified in the repo (demand-gap map + the 2026-06-18 reoptimisation DFS pull): (1) clear the pending myth-of-normal-range reoptimisation and fold the nmol/L spoke in, (2-4) CRP / ferritin / vit-D+B12 marker explainers (all DFS-verified, Pillar D live), (5-6) "results freaking me out" walkthrough + retest cluster as GEO/AI-citation assets, (7) "do boosters work" as a hook not an SEO target. **DFS validation now COMPLETE (2026-07-14):** the `mcp__dataforseo__*` connector was 401ing because `.mcp.json` used unset `${DATAFORSEO_USERNAME}`/`${DATAFORSEO_PASSWORD}` env placeholders; fixed by hardcoding the (curl-verified) creds into `.mcp.json` (gitignored, no leak), needs an MCP reconnect to take effect. The queued pull was run directly via the DFS REST API in the meantime. Result flipped the order: **Free Androgen Index 3,600 / KD 0** (Kit 1 measures FAI) plus shbg 2,400/KD14 and low-KD long-tails promote the Free-T/SHBG/FAI cluster to rank 2, above the Kit 2 markers. Ruled out as Google targets (null vol / high KD, build only as merit/AI-citation copy): `free testosterone`, `free testosterone test`, `total vs free testosterone`, `...results explained`; and `how often should you test testosterone` returned no data (retest cluster stays a GEO asset). Locked order in the strategy doc. **Two hub briefs drafted 2026-07-14** in `article-briefs/`: `pillar-C-hub-free-androgen-index-shbg.md` (FAI 3,600/KD0, Kit 1 differentiator, HIGH compliance gate, full Ewa review) and `pillar-D-hub-how-to-read-blood-test-results.md` (how to read results 720/KD3, the interpretation umbrella parent to the marker spokes, GEO asset). Both brief-ready, 0 em dashes, 21-section template. **Both pre-draft blockers now cleared (2026-07-14):** (a) keywords.csv updated: FAI row promoted candidate→validated+assigned to the C hub, 4 new SHBG rows added (shbg 2400/KD14, what is shbg 320/KD11, high shbg 590/KD4, what is free testosterone 390/KD1), and the D-hub cluster rows (how to read 720/KD3, blood test results explained, how to interpret, how can i read) set to briefed with the hub as primary (chart/nhs-online/U&E left covered-in-passing); CSV now 1055 rows, 20 cols intact. (b) CTA-path decision made by Keith: blog articles link to indexable `/kits/*`, never `/lp/*` (seo-content-context.md blog-rule 5), applied throughout both briefs. Both briefs are now ready for `/article`. **FAI hub DRAFTED 2026-07-14** via `/article` to `article-drafts/free-androgen-index.mdx` (pre-Ewa, dev-only): voice 12/13, compliance 0 HARD / 1 FLAG (educational TRT mention, no CTA), 6 verified sources, primary term in H1/headings, CTA to `/kits/testosterone/`, low-T routed to GP, TRT educational-only, no ashwagandha/FM/em-dashes (spot-checked). **Owed before publish:** full HIGH-gate Ewa clinical review of the SHBG/FAI mechanism + nmol/L ranges, Ewa pull-quote sign-off, and Ewa confirm of the educational-TRT framing (ClickUp Content Review list `901218140081`). **Now IN the DB pipeline (2026-07-14):** hand-authored `/article` drafts skip the keyword-queue so they get no `content_pipeline` row (hence no ClickUp task). New on-ramp script `09_website-app/frontend/scripts/content-engine/seed-pipeline.ts` seeds that row; it was run for this slug, and `draft-writer` then registered the mdx into `blog_articles` (draft) and advanced the pipeline to `stage='drafted'`. **SUBMITTED FOR REVIEW 2026-07-14:** `signoff-concierge` ran (compile-gate passed against prod), creating ClickUp review task `869e4uwk5` on Ewa's Content Review list with preview link `andro-prime.com/blog/preview/free-androgen-index`; pipeline flipped to `stage='in_review'`, `blocked_on='ewa'`, and a `content_review_log` submitted row written (audit trail). On Ewa marking the task complete, approval-sync flips the DB row to `published` and it goes live with NO Coolify redeploy (the live site reads `blog_articles`). ⛔ Do NOT use `/publish-article` for these: its `next build` + commit/push triggers exactly the redeploy the DB workflow exists to avoid. The how-to-read-results hub is briefed but not yet drafted. Prevalence caveat: forum crowd skews vs the mainstream £99 buyer, confirm against first-party quiz data.

## Content Library: git-first tracker BUILT (2026-07-13)

**[SUPERSEDED 2026-08-01 by Phase 1 of `content-machine/content-pipeline-automation-plan.md`. The tracker survives; "git-first" does not.** The asset file now holds identity and craft only, and every status, date, sign-off and URL lives in Supabase `content_assets` / `content_renditions`. `scan.js` no longer enforces the pipeline (gates G1 to G4 were removed; they are a CHECK constraint plus a trigger in `09_website-app/database/migrations/20260801_content_state_guards.sql`), and the ClickUp mirror is generated from the database, so "git wins" is now "the database wins". Everything else in this entry is still accurate. Full record in `content-machine/STATE.md`.]**

Founder content now has one git-tracked asset file per idea (`content-machine/assets/`, schema in `templates/asset-file.md`), a gate scanner enforcing the pipeline (`.claude/skills/content-status/scan.js`), a `/content-status` board skill, and a one-way sync into a read-only "Content Library" list in ClickUp (git wins). `/hook`, `/script`, `/compliance-preflight`, and `/wrap` are wired to it. **Fully live 2026-07-13:** gws re-authed (drive+gmail, business account), Drive media tree created, ClickUp list `901219526361` live with the seven custom statuses, first sync run verified idempotent (3 seeds: ep-0-baseline `idea`, two pillar-B backfills `scripted`). Daily Action keeps the mirror fresh. Only cosmetic item open (stray empty folder in the personal Drive): detail in `content-machine/STATE.md`. Next content bottleneck unchanged: the Ep 0 baseline shoot.

## Content engine: Phases 1–3a + 3b LIVE (2026-06-19)

- Autonomous, DB-backed, pull-model orchestrator; runs daily **07:00 UTC via GitHub Actions**. Stages: strategy → keyword → pillar → brief → create → authorise → publish → atomise. Authority: `seo-ai-search/content-engine-roadmap.md`.
- **Live article count is tracked in the roadmap doc** (~13 live + a cholesterol draft as of late June). Don't pin it here. **Article sign-off happens in ClickUp, not in the repo.** Ewa reviews and approves each article/webpage as a task in the ClickUp "Content Review" list for Ewa (Phase 0 Launch folder, list `901218140081`, workspace `90121729875`); marking the task complete = approved (change requests go as task comments). That ClickUp list is the article-approval register. The repo `03_compliance/content-approval/content-approval-register.md` covers partner briefs, emails, results copy and consent UI (CA-011 there is the Phase 0a partner-broadcast approval and never covered articles). Confirmed 2026-07-13: inflammatory-markers / crp / fbc all have completed Ewa review tasks dated June 2026. Ewa also approved (in person, 2026-07-13) a one-word compliance reword on inflammatory-markers to clear a `scan.js` HARD flag ("treating inflammation" softened to a boundary phrase); logged on that article's ClickUp review task.
- **Open:** Measurement-Analyst stage (~July).

## Keyword data: rebuilt single-source on DataForSEO (2026-06-21)

- `keywords.csv` rebuilt single-source on DFS (1,050 rows, 20-col with `kd_source`/`serp_verdict`/`coverage_status`). **Semrush retired: never feeds priority** (its KD was proven wrong: crp 47 vs DFS 11). Authority: `seo-data-rebuild-build-doc.md`. Selection loop (`csv-to-queue.ts` → human promote → brief; `reconcile-coverage.ts` writes status back) kills hand-picking.

## Pillars: A–K traffic + F GEO, staged rollout (roadmap is authoritative)

- Base A–G + E + F, plus **H Liver / I Metabolic / J Thyroid** (added 2026-06-18) and **K Brain fog** (added 2026-06-24, brief-ready). D spokes live; **H Liver hub drafted pre-Ewa**; I/J brief-ready. Inflammation (G+D) is the biggest underserved gap. Rule: run `phrase_organic`/SERP-gap before any brief. Detail: `pillar-architecture-rerank-2026-06-18.md`.
- **Live audience-tier mix ≈ 40% wellness / 60% clinical-curious / 0% TRT.** TRT at 0% is the correct safe pre-Ewa state; the drift risk is wellness-vs-clinical-curious, managed by the ~40% wellness floor (see CONTEXT).

## GEO / AI-search: baseline set, crawl path open, third-party presence now the priority lever

- GEO/LLM-citation baseline (4 engines): **cited in 0 / 48 answers** (2026-06-21). Expected for a new domain; citations build over weeks. Method + baseline: `geo-serp-findings-2026-06-21.md`.
- **AI-crawler block cleared 2026-06-09** (Cloudflare Managed robots.txt off; all AI bots incl. Google-Extended free to crawl → Pillar-F citation path open). ⚠️ The bot-block WAF landmine must stay deleted (see CONTEXT §10).
- **Audit re-check 2026-07-13 (DataForSEO live + live robots.txt):** still **0 citations** (0/2 buyer-query spot-check, ChatGPT + Perplexity). andro-prime.com ranks for only **3 keywords**, all inflammation-cluster (from the oldest article). robots.txt re-verified: no AI bot blocked, sitemap present. Foundations (schema-worthy structure, byline, cited stats, bots open) are sound; the gap is that it is early **and** all content is on-domain.
- **Key finding:** what LLMs actually cite for our buyer queries ("best at-home blood test for men UK" etc.) is **comparison/review hubs** (treatcompare, maleoptimal, helvy, bloodtestguide, lolahealth) **and Reddit**, not testing brands' own sites. So **third-party presence is the highest-leverage GEO move right now**, above another on-domain article.
- **Action started:** outreach target list + email template + status tracker built: `seo-ai-search/geo-third-party-presence-outreach.md` (2026-07-13). **Open:** Keith to fill kit/price/reply-to in the email, then run `compliance-preflight` before first send; stand up a monthly GEO citation tracker (Measurement-Analyst stage).

## Feeling-first content ops: shipped (2026-06-26)

- Doctrine live (`master-plan/2026-06-26-feeling-first-content-strategy.md`); candidate keywords tagged (feeling/clinical/solution) + staged for the selection loop; 3 cold/nurture email subjects rewritten feeling-first and **synced LIVE in Customer.io** (templates 4 / 33 / 52). SEO *rank* targets can still be clinical gap-terms; the hook/title/subject leads with feeling.

## Cold-to-warm bridge: Phase 1 shipped

- Article-footer newsletter + first-party events/UTM capture live (guest-capture FK bug fixed: the `users`-table-write-500 for logged-out visitors, shared root cause with the supplement-waitlist bug). Editorial-broadcast, never FM. **Phase 2 quiz expansion deferred.** Events implementation detail: `09_website-app/STATE.md` (GA4 + events).

## Unsplash imagery: BUILT, UNPUSHED

- `scripts/unsplash.mjs` + `ArticlePhoto.tsx` built (commit `88a2224`, **not pushed**: held so Keith can eyeball the first image before it deploys). First article `why-am-i-always-tired` wired. **Open:** push + redeploy; confirm/swap the first image; fold search→pick→use into the `/article` skill; "Apply for production" (50→1000 req/hr). **Rotate the Unsplash Secret Key** (shared via chat screenshot).

## v2.2 marketing corpus: SUPERSEDED banners in place (2026-07-09)

- Dated `⛔ SUPERSEDED` banners added to `master-plan/phase0-gtm-v4.md`, `master-plan/phase0-marketing-plan.md`, `master-plan/phase0-acquisition-strategy.md`, and `paid-media/paid-measurement-context.md`, all pointing to `master-plan/2026-06-26-tier2-sales-creation-plan.md`. Bodies untouched. The paid-measurement doc's banner additionally flags it needs a **FULL REBUILD** before any paid work (still specifies Plausible/Meta Pixel/Clarity + £4k/mo, all superseded).

## Next hubs queued: liver, CRP, thyroid (Keith decision 2026-07-09)

- Keith confirmed (2026-07-09, audit action 869e0bcj0): queue **liver** (18,100/mo, KD 18), **CRP/inflammation** (27,100/mo, KD 11) and **thyroid** (6,600/mo, KD 10) as the next hubs in the content engine. Thyroid pairs with the Kit 5 timeline. Source: `seo-ai-search/portfolio-demand-gap-map.md`. Current pillar state: H Liver hub already drafted pre-Ewa; J Thyroid brief-ready; CRP sits in the inflammation gap (G+D). Briefs follow the normal brief process; run `phrase_organic`/SERP-gap before any brief per the pillar rule.

## Gate restatement + positioning-sharpen propagated (2026-07-09)

- `positioning/product-marketing-context.md` (the marketing master context) updated: top banner records the 2026-06-24 test-led-personalisation sharpen (points to `master-plan/2026-06-24-test-led-positioning-validation-flywheel.md`), Competitive Landscape **rewritten 2026-07-09** (three-camp gap map; Function/Bioniq/InsideTracker/Vitl as the real comparators; **Vitall recorded as a competitor**, so "accredited lab" is table stakes not differentiation; the "is the test itself an upsell?" objection added to the Objections table), and the Gate-targets block restated to the 2026-07-09 gates. Retired 0A/0B/0C numeric bars pointered to `01_strategy/CONTEXT.md` across `07_sales/sales-gtm-context.md`, `04_products/CONTEXT.md` + `catalogue/non-regulated-tier-v7.md` + `catalogue/product-catalogue-v7-1.md` + `kits/kit-1-launch-guide.md`. Bodies preserved.

## PT / affiliate programme: FROZEN

- See `affiliates/CONTEXT.md`. FirstPromoter live but dormant; CA-001/002 solicitor sign-off parked (not a launch blocker); unfreeze needs a fresh Keith decision.
- **Affiliate-doc silent-ingredient rewrite done 2026-07-07** (audit precondition 1 of 2 for unfreeze; precondition 2, the GP-framing sweep, also done 2026-07-07; both met; unfreeze remains a Keith decision + solicitor sign-off on CA-001/002). Programme docs now use the v2.3 allowlist + name-free deflection pattern with one fenced INTERNAL ONLY rationale block each; v2.2 brief binaries quarantined to `affiliates/briefs/superseded-v2.2/`. Residual v2.2-pattern mentions in `master-plan/phase0-marketing-plan.md` (~152, ~159) and `master-plan/phase0-acquisition-strategy.md` (~183) belong to the v2.2 marketing-corpus banner sweep, still open.
