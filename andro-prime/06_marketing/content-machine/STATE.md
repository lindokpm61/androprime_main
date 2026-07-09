# Content Machine — State

_Last updated: 2026-07-09_

Volatile status for the content machine. Durable rules are in `CONTEXT.md` and the framework docs.

## Framework

- **Content machine v1 created 2026-07-06** — docs + SOPs, no new code (per the approved plan). Entry point: `CONTEXT.md`. Blueprint, founder-content-system, unified-content-calendar, six SOPs, seven templates in place.
- **First atomisation dry run executed 2026-07-09** on Pillar B hub `why-am-i-always-tired` (CA-016). Full derivative set produced (2 short-form scripts, LinkedIn, Facebook, YouTube outline + description, email hook + body, 3 thumbnail specs). Compliance scanner: **0 🔴 / 0 🟠 on the copy**; no net-new claim, so it inherits CA-016 with no fresh Ewa step. Output + findings: `dry-runs/2026-07-09-pillar-B-why-am-i-always-tired.md`. **Nothing scheduled or published; Keith's voice-judgement and go still pending.**
- **Three findings from the dry run need owners:** (1) the central `kitCTA` config does not exist in the codebase at all, so three docs instruct a route that was never built; (2) the canonical article's "reviewed by our GMC-registered medical lead" line sits close to the banned per-customer trust language, and it is live (Ewa/Keith to rule); (3) `templates/youtube-description.md` hard-codes "Clinically reviewed by Dr Ewa Lindo" onto videos she is not, by design, going to review (Ewa/Keith to rule).

## Decisions made

- **Founder series name = "Read Your Blood"** (Keith, 2026-07-09). Locked in `founder-content-system.md` §3; it is the on-screen series tag on every episode.
- **Cadence confirmed as-proposed** (Keith, 2026-07-09). The weekly rhythm in `unified-content-calendar.md` §1 is live, not a proposal. Revisit only if Keith's recording capacity changes.
- **YouTube channel naming = founder-branded** (Keith, 2026-07-09). Handle `@keithandroprime`, name "Keith Antony · Andro Prime," on a company-owned Brand Account. Resolves the contradiction previously flagged here; swept 2026-07-09. Record: `content/2026-07-09-youtube-channel-naming.md`.

## Open judgement calls for Keith (needed to go live)

- **Comment-to-DM keyword map.** Confirm / adjust the proposed keyword → destination map in `templates/dm-keyword-map.md` (which keywords trigger, and where each DM link points). Not blocking: this gates the Instagram comment-to-DM flow only, which is itself behind the Instagram launch and the ManyChat sub-processor sign-off.

## Blockers and dependencies

- **YouTube + Instagram accounts live since 2026-07-02, no content posted yet.** Both created under the founder-branded handles (`@keithandroprime`, `@keith.androprime`) per `content/social-channel-setup.md`; see `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`. First post is a Keith go. **Ep 0 baseline shoot not done** (`youtube-founder-journey-strategy.md` §10) and should be filmed before results move: the before-state is unrecoverable. Placeholder handles: YouTube reserved 2026-07-09 as `@androprime-men`; Instagram `@androprime` still owed.
- ~~**GA4 + consent banner not connected.**~~ **Resolved, and this line was stale.** GA4 `G-D5M4J5M3F6` plus the Consent Mode v2 banner have been live in production since **2026-06-18** (`09_website-app/STATE.md`). MEASURE is no longer blocked on plumbing. What remains is wiring the content → email → kit funnel view on top of it.
- **Central `kitCTA` router: BUILT 2026-07-09** at `09_website-app/frontend/lib/content/kitCTA.ts` (it did not exist; three docs instructed a config nobody had written). `InlineKitCTA` accepts a `pillar` prop; `npm test` guards the map. **The nine live articles still hard-code `ctaHref` and have not been migrated**, so a product launch still costs nine manual edits until they are. Migration is a publish action (MDX → `import-blog-to-db.ts` → revalidate) and needs Keith's go.
- **Comment-to-DM (ManyChat) not set up.** New tool for Instagram keyword → DM link. **Compliance gate before any live flow:** add ManyChat as a data sub-processor (`03_compliance` sub-processor schedule + `data-controller-position.md` + privacy policy; solicitor if the DPA terms need review). Depends on the Instagram launch. SOP: `sops/sop-comment-to-dm.md`; map: `templates/dm-keyword-map.md`.
- **Pillar E (andropause / male-menopause) Ewa-gated.** Pack drafted, awaiting Ewa sign-off. No andropause / libido hooks until signed.
- **Affiliate content-kit module dormant.** Engine A (PT/influencer) FROZEN since 2026-06-07; the affiliate content kit is a documented-but-dormant module, unfreeze on a Keith decision.
- **Unsplash article imagery** built but unpushed (held for Keith to eyeball the first image). Same "Keith approves founder-facing imagery first" bar applies to thumbnails.

## What is ready to atomise now (first canonical assets)

Live blog pillars (Ewa-blanket-approved, in `content/blog/` and the Supabase `blog_articles` table): inflammatory-markers (G hub), low-vitamin-d-symptoms + 14-signs (A hub + A.1), crp-blood-test (D hub), myth-of-normal-range (C spoke), why-am-i-always-tired (B hub), plus b12 / ferritin / fbc marker explainers. These are the first assets to run through `sop-atomise-pillar.md`.
