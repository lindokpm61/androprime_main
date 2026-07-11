# Content Machine State

_Last updated: 2026-07-11_

Volatile status for the content machine. Durable rules are in `CONTEXT.md` and the framework docs.

## Founder-content craft layer + generators BUILT (2026-07-11)

A full short-form/long-form generation stack was built this session, all reading each other and the compliance rails live:

- **`avatar-mark.md`:** the single ideal-viewer avatar ("Mark, 44"), from the Kallaway avatar exercise plus a live Reddit VOC sweep (verbatim pain lines). Every script is written to him.
- **`hook-playbook.md`:** six archetypes, visual-first rule (the key visual is the blood, not Keith's face), dream-outcome-is-certainty, founder-reveal-held, the seven-step write.
- **`script-playbook.md`** (short-form) plus **`long-form-script-playbook.md`** (YouTube): the story/craft, compliance-gated (shock-facts must be true AND compliant; contrarian aimed at the reference range not the GP; Line-1 explainers may not exceed the Ewa-signed article's claims).
- **`content-funnel-map.md`:** the pre-click acquisition funnel (TOFU/MOFU/BOFU/Retention), what content does which job, and the markup every asset carries. Connects to the `07_sales` lifecycle funnel at the email rung and the kit purchase (cross-linked both ways).
- **Skills:** `/hook <topic>` (three hooks), `/script <topic>` (short-form), `/script <topic> long` (YouTube). All refuse TRT/ashwagandha/Pillar E, never invent bloodwork numbers, stamp a funnel tag, and end at `/compliance-preflight`. Skill files live in `.claude/skills/hook/` and `.claude/skills/script/`.

**Verified working:** demoed `/hook` and `/script` on ferritin; long-mode correctly flagged that the source ferritin article is still `status: draft` and cannot ship until Ewa-signed.

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

- **YouTube + Instagram accounts live since 2026-07-02, no content posted yet.** Both created under the founder-branded handles (`@keithandroprime`, `@keith.androprime`) per `content/social-channel-setup.md`; see `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`. First post is a Keith go. **Ep 0 baseline shoot not done** (`youtube-founder-journey-strategy.md` §10) and should be filmed before results move: the before-state is unrecoverable. Placeholder handles: YouTube reserved 2026-07-09 as `@androprime-men`; Instagram `@androprime` still owed.
- ~~**GA4 + consent banner not connected.**~~ **Resolved, and this line was stale.** GA4 `G-D5M4J5M3F6` plus the Consent Mode v2 banner have been live in production since **2026-06-18** (`09_website-app/STATE.md`). MEASURE is no longer blocked on plumbing. What remains is wiring the content → email → kit funnel view on top of it.
- **Central `kitCTA` router: BUILT 2026-07-09** at `09_website-app/frontend/lib/content/kitCTA.ts` (it did not exist; three docs instructed a config nobody had written). `InlineKitCTA` accepts a `pillar` prop; `npm test` guards the map, including a scan of every article's pillar. **All 15 articles migrated onto the map and verified live 2026-07-09** (not nine: six existed only in the DB). Redirecting a pillar is now a one-line change. Ordering rule and the two landmines it exposed: `09_website-app/STATE.md`.
- **Comment-to-DM (ManyChat) not set up.** New tool for Instagram keyword → DM link. **Compliance gate before any live flow:** add ManyChat as a data sub-processor (`03_compliance` sub-processor schedule + `data-controller-position.md` + privacy policy; solicitor if the DPA terms need review). Depends on the Instagram launch. SOP: `sops/sop-comment-to-dm.md`; map: `templates/dm-keyword-map.md`.
- **Pillar E (andropause / male-menopause) Ewa-gated.** Pack drafted, awaiting Ewa sign-off. No andropause / libido hooks until signed.
- **Affiliate content-kit module dormant.** Engine A (PT/influencer) FROZEN since 2026-06-07; the affiliate content kit is a documented-but-dormant module, unfreeze on a Keith decision.
- **Unsplash article imagery** built but unpushed (held for Keith to eyeball the first image). Same "Keith approves founder-facing imagery first" bar applies to thumbnails.
- **`content/youtube-scripts/example-scripts-line1-line2.md` routes its on-screen CTA to `/lp/energy-recovery`.** `/lp/*` pages are `noindex` direct-response LPs, and `09_website-app/CONTEXT.md` says in-article and product CTAs must point at the indexable `/kits/*` pages, never `/lp/*`. Noticed 2026-07-09 while correcting the attribution line; not fixed (out of that task's scope). **Fix before either script is filmed.**

## What is ready to atomise now (first canonical assets)

**14 published articles, not nine** (the count here was stale; six existed only in the Supabase `blog_articles` table with no MDX mirror until 2026-07-09, when the mirror was restored). All carry a `kitCTA` pillar.

- **Kit 2 / Energy & Recovery:** inflammatory-markers (G hub), crp-blood-test (D hub), low-vitamin-d-symptoms + 14-signs (A hub + A.1), why-am-i-always-tired (B hub), brain-fog (B), plus b12 / ferritin / fbc marker explainers (D).
- **Kit 1 / Testosterone:** myth-of-normal-range (C spoke), how-to-increase-testosterone-naturally (C).
- **Email capture (no live kit):** liver-function-blood-test, thyroid-test, signs-of-stress-in-men. Draft: cholesterol-test (metabolic).

`why-am-i-always-tired` has been atomised (dry run). The rest are the queue for `sop-atomise-pillar.md`.
