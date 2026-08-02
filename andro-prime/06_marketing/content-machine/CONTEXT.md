# Content Machine: Context

**Owner workspace:** `06_marketing/content-machine`
**Owner:** Keith Antony
**Status:** Framework v1 (docs + SOPs, no new code). Created 2026-07-06.
**Read alongside:** this workspace's `STATE.md` (what is live / owed right now).

The content machine is the **orchestration layer** that turns one canonical asset (a blog pillar or a founder idea) into scheduled, compliant content across every channel, and gives the whole thing one calendar and one compliance route. It does not replace the existing content engine or the atomisation model; it operationalises them and adds the founder-brand and cross-channel layers that were previously only specs.

**This is a framework and a set of SOPs, docs-only where stated below.** Execution is **hybrid**: agents do ideation, drafting, atomisation, routing, and scheduling; Keith fronts the camera and gives the final go; Ewa signs off claims. Nothing here overrides `03_compliance/CONTEXT.md`, `02_brand/tone-of-voice.md`, or the guardrails in the root `CLAUDE.md`. When this doc and a source-of-truth doc disagree, the source-of-truth wins and this doc is wrong.

**Correction to the "no new code" line below (2026-07-13):** the original Framework v1 line ("docs + SOPs, no new code") is superseded on one point only: the Content Library tracker layer (`assets/`) is backed by a real gate scanner and a ClickUp sync script, both genuinely new code. Everything else in this workspace is still docs-only.

---

## What the machine is: three subsystems, one loop

**CREATE → MANAGE → DISTRIBUTE → MEASURE**, running on two content spines that feed one atomisation pipeline.

- **CREATE** produces canonical, Ewa-signed source assets.
- **MANAGE** holds one cross-channel calendar and one compliance route (this workspace is the manage layer).
- **DISTRIBUTE** atomises each canonical asset into per-channel derivatives and schedules them.
- **MEASURE** feeds the v4 KPI framework (hard-blocked on GA4 + consent; see `STATE.md`).

### The two spines

- **Spine A: Owned SEO blog** (already built): the canonical, Ewa-signed, source-of-truth asset per pillar. Runs on the existing engine (`seo-ai-search/content-engine-roadmap.md`, the `/article` and `/publish-article` skills, the Supabase `blog_articles` table). The machine does not change this; it consumes its output.
- **Spine B: Founder personal brand** (the new operating layer): Keith's short-form (Reels / Shorts / TikTok), LinkedIn, YouTube, and Facebook. Channel architecture is already decided in `content/social-channel-setup.md` and `content/youtube-founder-journey-strategy.md`; this workspace adds the repeatable production craft (imported from the two research files, corrected for platform reality and hard-gated by compliance) and folds Spine B into the same calendar and compliance route as Spine A.

**The canonical-asset rule (inherited from the atomisation model, non-negotiable):** every derivative on every channel is atomised *from* a canonical, Ewa-signed asset and **may not introduce a claim that asset does not already make**. A net-new claim goes back to the canonical asset for re-clearance. This is what keeps a multi-channel machine both efficient and compliant.

---

## The docs in this workspace (read order)

1. **`content-machine-blueprint.md`**: the full framework: the loop, the channel matrix (all channels including Facebook), the trust ladder mapped to Andro's real assets, the measurement stage. Read first for the whole picture.
2. **`founder-content-system.md`**: Spine B: formats, the founder series, hooks and storytelling structure, per-platform rules corrected by the platform-reality research.
3. **`unified-content-calendar.md`**: the manage layer: one cross-channel cadence and the status model.
3b. **`content-queue.md`**: the standing Spine B backlog: decided angles in priority order, split into the **no-camera lane** (LinkedIn / Facebook / Substack, ships weekly) and the **camera lane** (short-form / YouTube, batched onto a booked filming day). This is the input `/content-week` pulls from, so the weekly run never starts from a blank page.
4. **`sops/`**: seven repeatable SOPs (atomise a pillar, founder short-form, LinkedIn post, thumbnail, comment-to-DM, the weekly run, and the compliance route). **`sop-weekly-run.md` is the spec; `/content-week` is its executable form** and is how the week is actually run.
5. **`templates/`**: fill-in-the-blank templates (hook bank, short-form script, LinkedIn post, Facebook post, YouTube description, atomisation checklist, thumbnail template, comment-to-DM keyword map, and **`asset-file.md`**, the schema for the tracker below).
6. **`content-library-build-spec.md`**: the durable build spec for the Content Library tracker: the asset frontmatter schema, the gate model, and the ClickUp mirror. Read alongside `assets/README.md`.
7. **`assets/`**: one asset file per founder content idea. **It is not the tracker and its frontmatter is not the status record** (Phase 1, 2026-08-01: see "The asset file owns IDENTITY and CRAFT. The database owns STATE." below, which is the governing section and which this item deliberately does not restate). The file holds identity (slug, title, funnel tags, marker, canonical asset, which renditions exist) and craft (the chosen hook, the script). Where an idea has got to lives in `content_assets` / `content_renditions`; the gates are database constraints, `.claude/skills/content-status/scan.js` checks only what a repo-only reader can verify, and `/content-status` renders the board from the database. See also the correction above to the "no new code" line.
7b. **`content-pipeline-automation-plan.md`**: the approved plan of record (Keith, 2026-07-31) for automating the pipeline around the tracker above. Read it before building anything that writes to `content_assets` / `content_renditions` or talks to Drive, ClickUp or Metricool on the machine's behalf. Its governing rule is **automate the plumbing, never automate a gate**, and its section 6 lists by name what must stay human. Section 5 is the build order. **Phase 0 (the `content-doctor` invariant script, nine invariants, run nightly) and Phase 1 (the state split below) are both BUILT as of 2026-08-01;** the rest of section 5 is not. Current build status is `STATE.md`, not this line.
8. **`STATE.md`**: current live status and open items.

### Founder-content craft layer (built 2026-07-11/12): the craft behind the `/hook` and `/script` skills

These docs are the repeatable production craft for Spine B (folded in from `founder-content-system.md`). Read them when generating or reviewing founder short-form / written posts:

- **`avatar-mark.md`**: the Mark avatar (who the founder content speaks to).
- **`hook-playbook.md`** + **`borrowed-hook-templates.md`**: hook archetypes and borrowed-hook templates (the `/hook` skill reads these).
- **`hook-rubric.md`**: the grading standard every hook is scored against before it is shown. Hard gates, six scored dimensions, 9/12 threshold, the honesty constraint that replaces Kallaway's concealment rule, and the proof ladder. Also drives `/hook`'s grade-my-draft mode. Section 5 stays empty until real performance data exists.
- **`script-playbook.md`** + **`long-form-script-playbook.md`**: short-form and long-form script structure (the `/script` skill reads these).
- **`sources/`**: the third-party material the two playbooks were synthesised from, plus a what-was-taken audit (`sources/README.md`). Reference inputs only: never republish, never quote in customer copy, never treat as an Andro Prime claim. When a playbook cites a studied source, the source belongs here and the playbook links to it.
- **`written-post-playbook.md`**: written-post structure (LinkedIn / Facebook / Substack).
- **`content-funnel-map.md`**: maps each content format to its funnel stage and CTA.
- **`dry-runs/`**: worked example runs of the craft layer (e.g. the pillar-B "why am I always tired" dry run).

---

## How it plugs into what already exists (reuse, do not duplicate)

| Need | Source of truth (owns it) |
|---|---|
| Blog create + publish | `seo-ai-search/content-engine-roadmap.md`, `/article`, `/publish-article` |
| Atomisation map + CTA routing | `seo-ai-search/content-atomisation-model.md` (this machine operationalises it) |
| Pillar set + on-page/GEO standard | `seo-ai-search/blog-ai-seo-strategy.md` |
| Feeling-first topic doctrine | `master-plan/2026-06-26-feeling-first-content-strategy.md` |
| Founder YouTube lines (long-form + journey) | `content/youtube-founder-journey-strategy.md` |
| Founder account setup, handles, bios | `content/social-channel-setup.md` |
| Founder hooks / launch copy | `content/track-a-launch-copy.md`, `seo-ai-search/tools/staging-feeling-first/` |
| Email sequences | `09_website-app/frontend/email-templates/`, `07_sales/CONTEXT.md`, `/cio-sequence-build` |
| Comment-to-DM (Instagram) | ManyChat (Meta-approved partner); `sops/sop-comment-to-dm.md` + `templates/dm-keyword-map.md`; needs sub-processor sign-off via `03_compliance` before launch |
| Voice + banned words | `02_brand/tone-of-voice.md`, `02_brand/prohibited-terms.md` |
| Visual identity (thumbnails) | `02_brand/visual-identity.md`, satori OG route in `09_website-app/frontend/app/api/og/blog/[slug]/route.tsx` |
| Compliance law + the pre-flight gate | `03_compliance/CONTEXT.md`, the `/compliance-preflight` skill |
| Ewa sign-off queue | ClickUp "Content Review: Ewa" list `901218140081` |

---

## The hybrid role split (who does what)

| Stage | Agent (Claude) | Keith | Ewa |
|---|---|---|---|
| Ideation / topic select | drafts the queue from the calendar | picks / vetoes | (none) |
| Canonical asset (blog) | drafts via `/article` | approves | signs off claims |
| Founder script / caption | drafts from the hook bank | records on camera, edits | signs off net-new claims only |
| Compliance pre-flight | runs `/compliance-preflight` on every asset | reviews flags | rules on 🟠 items |
| Atomisation | produces all derivatives | approves | (none, inherited) |
| Thumbnails | specs from the template | produces in Figma/Canva, or approves | (none) |
| Scheduling / distribute | schedules, wires CTAs, wires email | presses go | (none) |
| Measure | pulls the numbers | reads, decides | (none) |

**The go button is always Keith's.** No campaign activates, no video publishes, and no email sends without an explicit human go (see `sop-compliance-route.md`).

---

## One content idea is one asset, even inside a batch

`content_renditions` is uniquely keyed on **(asset_id, platform, format)**. That constraint is deliberate (`social-content-db-spec.md`) and it decides how batched channels are modelled.

**A week of X posts is seven assets, not one asset with seven renditions.** Seven `x` / `text-post` rows cannot hang off a single asset, and trying it fails on the unique key. Each post is a distinct content idea atomised from the canonical article; the weekly batch is a **production convenience** that buys one `/compliance-preflight` run over one file, not a content unit. Precedent set 2026-07-31 with `x-w01-1` to `x-w01-7`.

The same applies to any future channel drafted in batches. Register per idea, and let the batch live in the draft file and the queue row, where `content-queue.md` already says "rows here are weeks, not posts". The queue counts weeks; the asset table counts ideas. Those are different objects and neither should be bent to match the other.

**Where the batch's own state lives:** the draft file under `drafts/` carries `preflight`, `approved_by` and `approved_date` for the batch as a whole. Per-post scheduling state lives on the rendition (`status`, `scheduled_for`, `external_post_id`).

**Every post in a batch draft MUST carry its `slug:` line, and this is load-bearing, not tidiness.** The draft identifies itself by `batch` and `queue_row`; the database identifies posts by slug. Until 2026-08-01 the X week-1 draft named no slug and its seven rows named no file, so **neither store could find the other**: the copy was in the repo, the state was in the database, and nothing joined them. `content-doctor` invariant 1 reported all seven as UNLINKED. A batch draft without per-post slugs is only half-registered.

---

## The asset file owns IDENTITY and CRAFT. The database owns STATE. (Phase 1, 2026-08-01)

**One fact, one home.** Every failure in section 1 of `content-pipeline-automation-plan.md` was the same shape: two copies of one fact, one of them updated, no alarm. The fix is not a better sync, it is having nowhere for the second copy to live.

| The asset file owns it | The database owns it |
| --- | --- |
| `slug`, `title`, `content_type`, `funnel_stage`, `funnel_job`, `awareness`, `cta`, `channel`, `marker`, `canonical_asset`, `series` | `status`, `preflight`, `preflight_date`, `ewa_task`, `ewa_signed_at`, `approved_by`, `approved_at`, `drive` |
| which renditions exist: `platform`, `format`, `thumb` | each rendition's `status`, `url`, `publish_date`, `scheduled_for`, external ids |
| the chosen hook and the script, in the body | every timestamp, every gate result |

**The test for which side a field belongs on: who changes it?** If a human changes it while writing, it is identity or craft and belongs in git, where a diff is meaningful and review is possible. If an integration changes it (a scheduler, a webhook, a sign-off sync), it is state and belongs in the database, because that is what the integrations read and write. A field that a human types to *describe* what a machine did is the drift generator: `thumb_confirmed` was exactly that, and so were the dead `TODO Ewa` markers.

**The gates live in the database, and only there** (`09_website-app/database/migrations/20260801_content_state_guards.sql`). Two routes to `approved`: green pre-flight plus a canonical article to inherit clearance from, or `amber-ewa` plus `ewa_signed_at`, which only the sign-off sync may write. Renditions cannot reach `scheduled` ahead of their asset's approval, ahead of their canonical article's publication, or without a confirmed thumbnail. **These fire on `INSERT` as well as `UPDATE`:** a gate you can arrive at without passing through is not a gate. That includes the write-protection on `ewa_signed_at` itself, which shipped `BEFORE UPDATE` only and was widened by `20260802_ewa_signed_at_insert_guard.sql`; section 3 of the 20260801 file is superseded and says so in place.

**`content-status/scan.js` therefore keeps only what it can actually see** — the frontmatter schema, the compliance HARD table, and the em-dash rule, all of which live in the file it is reading. It no longer asserts the pipeline gates, because after this split it cannot verify them, and a scanner that asserts a gate it cannot check is the `thumb_confirmed` shape wearing a different hat. It says so in its own header, so nobody later "restores" the gates to it.

**Which keys the database owns is written down exactly once, in `.claude/skills/content-status/db-owned-keys.json`.** On the day of the split that list existed in three hand-maintained copies (`scan.js`, `content-doctor` invariant 9, `content-sync`) and two of them had already diverged: the doctor watched eight rendition keys where the scanner watched ten, missing `unipile_account` and `thumb_confirmed`. The doctor is the nightly automated alarm and the scanner is hand-run, so the weaker list was the one nobody has to remember to run. Keith's ruling (2026-08-01): consolidate, and the strict superset wins. All three now import that file, so there is nothing left to keep in sync, and `test-content-doctor.ts` runs the scanner over a fixture holding every watched key to prove the two derivations still agree. A key is **refused** in frontmatter as soon as the database owns the fact; it may only be **deleted** from a file once the generated block renders that fact (`mirrored` in the JSON), because a key deleted from the file and absent from the mirror is a fact with nowhere left to live.

**A generated block in the asset file mirrors the state for anyone reading the repo directly.** It is regenerated by `content-sync`, marked as generated, and is never an input: editing it changes nothing, and the next sync overwrites it. Read it for orientation, never for truth.

**NOTHING AUTOMATED RUNS `content-sync`, so the block goes stale the first time a status changes in the database, and no alarm fires.** The nightly Windows Task Scheduler job runs `content-doctor-cron` only; `.github/workflows/content-engine.yml` runs `content-library-sync`, not `content-sync`; doctor invariant 9 checks for state KEYS in frontmatter, not for block currency. The only invocation in the repo is step 1 of `/content-status`, which is hand-run. **So block currency is a HAND-RUN check, and that is stated here rather than left as a silence** — this is a committed second copy of database-owned state with no automated detector, in a phase whose premise is that a second copy has nowhere to live. It is tolerable only because nothing reads it: the block is never parsed, `/content-status` explicitly refuses to fall back to it when the database is unreachable, and `content-doctor` strips it before invariant 1 looks for slugs. `content-sync --check` already exists and exits 2 naming every stale file; wiring it into the nightly cron or into `content-engine.yml` is one line, and is Keith's call rather than a silent default, because it adds a nightly alarm on a mirror that nothing depends on.

---

## A Substack republish owes no asset file, and that is the model working

**A verbatim republish of a published, Ewa-signed article has no craft of its own: the craft IS the canonical article.** Substack is a republish surface, not a `/script` job (see the read-order note on `written-post-playbook.md` and `seo-ai-search/content-atomisation-model.md`). So a `content_assets` row for a republish legitimately has no `assets/*.md`, and creating a stub to satisfy a checker would be inventing an artefact to make a detector go quiet.

**The control case proves the rule rather than weakening it.** `substack-welcome-normal-on-paper` **does** have a file, because it was **net-new founder copy**, not a republish. That is the line: net-new copy on Substack gets an asset file and its own pre-flight; a republish inherits the article's and gets neither.

**The exemption is narrow, and it is narrow on purpose** (decided by Keith 2026-08-01, enforced in `content-doctor` invariant 1). A row is excused a file only when **all** of these hold:

1. it has a `canonical_article_id` that resolves; **and**
2. **every** rendition it has is `platform = 'substack'`; **and**
3. it has at least one rendition — a row with no renditions is not a republish of anything and must still fail.

Any non-Substack rendition, a missing canonical article, or no renditions at all, and the exemption does not apply. **If `blog_articles` or `content_renditions` cannot be read, do not exempt:** an exemption that fires when its own evidence is missing is a hole that opens exactly when the system is unhealthy.

---

## Skills, tools & MCPs

**The one command that runs the week:** `/content-week`. It reads the board and `content-queue.md`, picks against the guardrails, drafts Lane 1 unconditionally and Lane 2 only when a filming day is booked, runs the compliance route, and hands Keith a record-list plus an approve-list. It never posts, schedules or approves.

| Skill / tool | What it owns here |
|---|---|
| **`/content-week`** | The weekly run, end to end. The executable form of `sops/sop-weekly-run.md`. |
| `/hook <topic>` | Three hooks, scored against `hook-rubric.md`; mints the asset file. Also has a grade-my-draft mode. |
| `/script <topic> [long\|linkedin\|facebook]` | The finished script or written post; fills the asset body, adds renditions, scans. |
| `/compliance-preflight` | Guardrail #1 on every asset before it reaches Keith. Necessary, never sufficient. |
| `/content-status` | Renders the board; applies Keith's spoken transitions ("recorded", "posted <url>"), gate-checked. |
| `scan.js` | `.claude/skills/content-status/scan.js`. **Not the gate scanner any more** (Phase 1): the frontmatter schema, YAML safety, the compliance HARD table, the em-dash rule, and a HARD failure on any database-owned key that creeps back into frontmatter. The pipeline gates are database constraints in `20260801_content_state_guards.sql`. |
| `substack-draft.ts` | `09_website-app/frontend/scripts/content-engine/`. Draft-only Substack push; no publish path by design. |
| `/wrap` | End-of-session close-out: STATE / ClickUp / commit by path. |
| ClickUp MCP | Ewa's sign-off queue (list `901218140081`) and the read-only Content Library mirror (`901219526361`). Always pass `workspace_id: "90121729875"`. |
| gws CLI | Drive folders for media (`Content/YYYY-MM/<slug>/{raw,final,thumb}`), on the business account. |

**Spine A is not this workspace's:** `/article`, `/article-to-review`, `/publish-article` own the blog. This machine consumes their published output.

---

## Do not use this workspace for

- Compliance sign-off or claim rulings (→ `03_compliance`, then Ewa).
- Product threshold or results-engine logic (→ `04_products`).
- Blog keyword / brief / publish mechanics (→ `seo-ai-search/`).
- Email sequence copy or build specs (→ `09_website-app/frontend/email-templates/`, `/cio-sequence-build`).
- Re-deciding channel architecture (→ `content/social-channel-setup.md`, `content/youtube-founder-journey-strategy.md`, `master-plan/phase0-gtm-v4.md`).
