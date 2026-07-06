# Content Machine — Context

**Owner workspace:** `06_marketing/content-machine`
**Owner:** Keith Antony
**Status:** Framework v1 (docs + SOPs, no new code). Created 2026-07-06.
**Read alongside:** this workspace's `STATE.md` (what is live / owed right now).

The content machine is the **orchestration layer** that turns one canonical asset (a blog pillar or a founder idea) into scheduled, compliant content across every channel, and gives the whole thing one calendar and one compliance route. It does not replace the existing content engine or the atomisation model; it operationalises them and adds the founder-brand and cross-channel layers that were previously only specs.

**This is a framework and a set of SOPs, not code.** Execution is **hybrid**: agents do ideation, drafting, atomisation, routing, and scheduling; Keith fronts the camera and gives the final go; Ewa signs off claims. Nothing here overrides `03_compliance/CONTEXT.md`, `02_brand/tone-of-voice.md`, or the guardrails in the root `CLAUDE.md`. When this doc and a source-of-truth doc disagree, the source-of-truth wins and this doc is wrong.

---

## What the machine is: three subsystems, one loop

**CREATE → MANAGE → DISTRIBUTE → MEASURE**, running on two content spines that feed one atomisation pipeline.

- **CREATE** produces canonical, Ewa-signed source assets.
- **MANAGE** holds one cross-channel calendar and one compliance route (this workspace is the manage layer).
- **DISTRIBUTE** atomises each canonical asset into per-channel derivatives and schedules them.
- **MEASURE** feeds the v4 KPI framework (hard-blocked on GA4 + consent; see `STATE.md`).

### The two spines

- **Spine A — Owned SEO blog** (already built): the canonical, Ewa-signed, source-of-truth asset per pillar. Runs on the existing engine (`seo-ai-search/content-engine-roadmap.md`, the `/article` and `/publish-article` skills, the Supabase `blog_articles` table). The machine does not change this; it consumes its output.
- **Spine B — Founder personal brand** (the new operating layer): Keith's short-form (Reels / Shorts / TikTok), LinkedIn, YouTube, and Facebook. Channel architecture is already decided in `content/social-channel-setup.md` and `content/youtube-founder-journey-strategy.md`; this workspace adds the repeatable production craft (imported from the two research files, corrected for platform reality and hard-gated by compliance) and folds Spine B into the same calendar and compliance route as Spine A.

**The canonical-asset rule (inherited from the atomisation model, non-negotiable):** every derivative on every channel is atomised *from* a canonical, Ewa-signed asset and **may not introduce a claim that asset does not already make**. A net-new claim goes back to the canonical asset for re-clearance. This is what keeps a multi-channel machine both efficient and compliant.

---

## The docs in this workspace (read order)

1. **`content-machine-blueprint.md`** — the full framework: the loop, the channel matrix (all channels including Facebook), the trust ladder mapped to Andro's real assets, the measurement stage. Read first for the whole picture.
2. **`founder-content-system.md`** — Spine B: formats, the founder series, hooks and storytelling structure, per-platform rules corrected by the platform-reality research.
3. **`unified-content-calendar.md`** — the manage layer: one cross-channel cadence and the status model.
4. **`sops/`** — seven repeatable SOPs (atomise a pillar, founder short-form, LinkedIn post, thumbnail, comment-to-DM, the weekly run, and the compliance route).
5. **`templates/`** — fill-in-the-blank templates (hook bank, short-form script, LinkedIn post, Facebook post, YouTube description, atomisation checklist, thumbnail template, comment-to-DM keyword map).
6. **`STATE.md`** — current live status and open items.

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
| Ewa sign-off queue | ClickUp "Content Review — Ewa" list `901218140081` |

---

## The hybrid role split (who does what)

| Stage | Agent (Claude) | Keith | Ewa |
|---|---|---|---|
| Ideation / topic select | drafts the queue from the calendar | picks / vetoes | — |
| Canonical asset (blog) | drafts via `/article` | approves | signs off claims |
| Founder script / caption | drafts from the hook bank | records on camera, edits | signs off net-new claims only |
| Compliance pre-flight | runs `/compliance-preflight` on every asset | reviews flags | rules on 🟠 items |
| Atomisation | produces all derivatives | approves | — (inherited) |
| Thumbnails | specs from the template | produces in Figma/Canva, or approves | — |
| Scheduling / distribute | schedules, wires CTAs, wires email | presses go | — |
| Measure | pulls the numbers | reads, decides | — |

**The go button is always Keith's.** No campaign activates, no video publishes, and no email sends without an explicit human go (see `sop-compliance-route.md`).

---

## Do not use this workspace for

- Compliance sign-off or claim rulings (→ `03_compliance`, then Ewa).
- Product threshold or results-engine logic (→ `04_products`).
- Blog keyword / brief / publish mechanics (→ `seo-ai-search/`).
- Email sequence copy or build specs (→ `09_website-app/frontend/email-templates/`, `/cio-sequence-build`).
- Re-deciding channel architecture (→ `content/social-channel-setup.md`, `content/youtube-founder-journey-strategy.md`, `master-plan/phase0-gtm-v4.md`).
