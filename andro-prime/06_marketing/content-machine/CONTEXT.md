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
7. **`assets/`**: the **per-idea tracker layer**: one asset file per founder content idea, from first hook to measured. Its frontmatter is the status record (status, funnel tags, preflight result, renditions); the gate scanner (`.claude/skills/content-status/scan.js`) enforces the transitions, and `/content-status` renders the board. This is the live pipeline state for Spine B; see the correction above to the "no new code" line.
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

## Skills, tools & MCPs

**The one command that runs the week:** `/content-week`. It reads the board and `content-queue.md`, picks against the guardrails, drafts Lane 1 unconditionally and Lane 2 only when a filming day is booked, runs the compliance route, and hands Keith a record-list plus an approve-list. It never posts, schedules or approves.

| Skill / tool | What it owns here |
|---|---|
| **`/content-week`** | The weekly run, end to end. The executable form of `sops/sop-weekly-run.md`. |
| `/hook <topic>` | Three hooks, scored against `hook-rubric.md`; mints the asset file. Also has a grade-my-draft mode. |
| `/script <topic> [long\|linkedin\|facebook]` | The finished script or written post; fills the asset body, adds renditions, scans. |
| `/compliance-preflight` | Guardrail #1 on every asset before it reaches Keith. Necessary, never sufficient. |
| `/content-status` | Renders the board; applies Keith's spoken transitions ("recorded", "posted <url>"), gate-checked. |
| `scan.js` | `.claude/skills/content-status/scan.js`, the gate scanner. The floor under every transition. |
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
