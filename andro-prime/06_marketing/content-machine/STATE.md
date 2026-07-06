# Content Machine — State

_Last updated: 2026-07-06_

Volatile status for the content machine. Durable rules are in `CONTEXT.md` and the framework docs.

## Framework

- **Content machine v1 created 2026-07-06** — docs + SOPs, no new code (per the approved plan). Entry point: `CONTEXT.md`. Blueprint, founder-content-system, unified-content-calendar, six SOPs, seven templates in place.
- **Not yet exercised on a real pillar.** First atomisation dry-run scoped in the plan's verification; first live weekly run is the next action once Keith confirms the two open judgement calls below.

## Open judgement calls for Keith (needed to go live)

- **Founder series name.** Pick one (or supply your own): "Read Your Blood" / "The Normal-Range Lie" / "One Number at a Time" (`founder-content-system.md` §3).
- **Cadence.** Confirm or adjust the proposed weekly rhythm in `unified-content-calendar.md` §1.
- **Comment-to-DM keyword map.** Confirm / adjust the proposed keyword → destination map in `templates/dm-keyword-map.md` (which keywords trigger, and where each DM link points).

## Blockers and dependencies

- **YouTube + Instagram not yet launched.** Accounts specced (`content/social-channel-setup.md`); launch is a Keith go. Ep 0 baseline shoot not done (`youtube-founder-journey-strategy.md` §10) and should be filmed before results move.
- **GA4 + consent banner not connected.** Server-side plumbing deployed; client GA4 + consent banner pending. Until live, MEASURE runs on platform-native metrics only; content → email → kit attribution is not possible.
- **Central `kitCTA` router:** confirm it exists and is wired to the current live kit before scheduling any derivative CTA (`content-atomisation-model.md` §4, `youtube-founder-journey-strategy.md` §10).
- **Comment-to-DM (ManyChat) not set up.** New tool for Instagram keyword → DM link. **Compliance gate before any live flow:** add ManyChat as a data sub-processor (`03_compliance` sub-processor schedule + `data-controller-position.md` + privacy policy; solicitor if the DPA terms need review). Depends on the Instagram launch. SOP: `sops/sop-comment-to-dm.md`; map: `templates/dm-keyword-map.md`.
- **Pillar E (andropause / male-menopause) Ewa-gated.** Pack drafted, awaiting Ewa sign-off. No andropause / libido hooks until signed.
- **Affiliate content-kit module dormant.** Engine A (PT/influencer) FROZEN since 2026-06-07; the affiliate content kit is a documented-but-dormant module, unfreeze on a Keith decision.
- **Unsplash article imagery** built but unpushed (held for Keith to eyeball the first image). Same "Keith approves founder-facing imagery first" bar applies to thumbnails.

## Open contradiction to reconcile (flagged, not resolved)

- **YouTube channel naming.** `youtube-founder-journey-strategy.md` (2026-06-08) resolved the channel to **pure "Andro Prime"** (brand channel, Keith as named host). `content/social-channel-setup.md` (2026-06-27, newer) specs a **founder-branded handle `@keithandroprime`** and name "Keith Antony · Andro Prime." These conflict. Not resolved here; candidate for `/decision-sweep`. Until reconciled, the founder-content docs cite the newer `social-channel-setup.md` handle and flag the conflict.

## What is ready to atomise now (first canonical assets)

Live blog pillars (Ewa-blanket-approved, in `content/blog/` and the Supabase `blog_articles` table): inflammatory-markers (G hub), low-vitamin-d-symptoms + 14-signs (A hub + A.1), crp-blood-test (D hub), myth-of-normal-range (C spoke), why-am-i-always-tired (B hub), plus b12 / ferritin / fbc marker explainers. These are the first assets to run through `sop-atomise-pillar.md`.
