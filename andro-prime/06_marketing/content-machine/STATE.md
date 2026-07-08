# Content Machine — State

_Last updated: 2026-07-09_

Volatile status for the content machine. Durable rules are in `CONTEXT.md` and the framework docs.

## Framework

- **Content machine v1 created 2026-07-06** — docs + SOPs, no new code (per the approved plan). Entry point: `CONTEXT.md`. Blueprint, founder-content-system, unified-content-calendar, six SOPs, seven templates in place.
- **Not yet exercised on a real pillar.** First atomisation dry-run scoped in the plan's verification; first live weekly run is the next action once Keith confirms the two open judgement calls below.

## Decisions made

- **Founder series name = "Read Your Blood"** (Keith, 2026-07-09). Locked in `founder-content-system.md` §3; it is the on-screen series tag on every episode.
- **Cadence confirmed as-proposed** (Keith, 2026-07-09). The weekly rhythm in `unified-content-calendar.md` §1 is live, not a proposal. Revisit only if Keith's recording capacity changes.
- **YouTube channel naming = founder-branded** (Keith, 2026-07-09). Handle `@keithandroprime`, name "Keith Antony · Andro Prime," on a company-owned Brand Account. Resolves the contradiction previously flagged here; swept 2026-07-09. Record: `content/2026-07-09-youtube-channel-naming.md`.

## Open judgement calls for Keith (needed to go live)

- **Comment-to-DM keyword map.** Confirm / adjust the proposed keyword → destination map in `templates/dm-keyword-map.md` (which keywords trigger, and where each DM link points). Not blocking: this gates the Instagram comment-to-DM flow only, which is itself behind the Instagram launch and the ManyChat sub-processor sign-off.

## Blockers and dependencies

- **YouTube + Instagram accounts live since 2026-07-02, no content posted yet.** Both created under the founder-branded handles (`@keithandroprime`, `@keith.androprime`) per `content/social-channel-setup.md`; see `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`. First post is a Keith go. **Ep 0 baseline shoot not done** (`youtube-founder-journey-strategy.md` §10) and should be filmed before results move: the before-state is unrecoverable. Placeholder handles: YouTube reserved 2026-07-09 as `@androprime-men`; Instagram `@androprime` still owed.
- **GA4 + consent banner not connected.** Server-side plumbing deployed; client GA4 + consent banner pending. Until live, MEASURE runs on platform-native metrics only; content → email → kit attribution is not possible.
- **Central `kitCTA` router:** confirm it exists and is wired to the current live kit before scheduling any derivative CTA (`content-atomisation-model.md` §4, `youtube-founder-journey-strategy.md` §10).
- **Comment-to-DM (ManyChat) not set up.** New tool for Instagram keyword → DM link. **Compliance gate before any live flow:** add ManyChat as a data sub-processor (`03_compliance` sub-processor schedule + `data-controller-position.md` + privacy policy; solicitor if the DPA terms need review). Depends on the Instagram launch. SOP: `sops/sop-comment-to-dm.md`; map: `templates/dm-keyword-map.md`.
- **Pillar E (andropause / male-menopause) Ewa-gated.** Pack drafted, awaiting Ewa sign-off. No andropause / libido hooks until signed.
- **Affiliate content-kit module dormant.** Engine A (PT/influencer) FROZEN since 2026-06-07; the affiliate content kit is a documented-but-dormant module, unfreeze on a Keith decision.
- **Unsplash article imagery** built but unpushed (held for Keith to eyeball the first image). Same "Keith approves founder-facing imagery first" bar applies to thumbnails.

## What is ready to atomise now (first canonical assets)

Live blog pillars (Ewa-blanket-approved, in `content/blog/` and the Supabase `blog_articles` table): inflammatory-markers (G hub), low-vitamin-d-symptoms + 14-signs (A hub + A.1), crp-blood-test (D hub), myth-of-normal-range (C spoke), why-am-i-always-tired (B hub), plus b12 / ferritin / fbc marker explainers. These are the first assets to run through `sop-atomise-pillar.md`.
