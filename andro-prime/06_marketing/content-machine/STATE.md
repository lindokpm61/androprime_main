# Content Machine State

_Last updated: 2026-07-18_

Volatile status for the content machine. Durable rules are in `CONTEXT.md` and the framework docs.

## Substack added as a channel (2026-07-18)

Substack folded into the machine as a founder-fronted, text-first DISTRIBUTE channel (Keith's call: "no harm building it into the content machine for reach, referral traffic, and AI citations"). It is a **republish + discovery + AI-citation surface, not an SEO backlink play** (body links are `nofollow`, no ranking value). Wired into: the blueprint channel matrix + reality-check bullet (`content-machine-blueprint.md` §2), the written-post-playbook (new Substack section, retitled LinkedIn + Facebook + Substack), the channel-setup doc (`content/social-channel-setup.md`, new Substack section: publication `Keith Antony · Andro Prime`, handle `keithandroprime.substack.com`), the calendar (Wed row + volume line, ~1/week repurposed from the week's pillar), and the funnel-map format enum (`newsletter`).

**Two locked decisions (Keith, 2026-07-18):**
- **Founder-fronted** (Keith's voice, same halo as LinkedIn), not a brand publication.
- **Distribution surface only.** Route readers to our own quiz / Customer.io rung; do not push "subscribe" as the primary CTA or treat the Substack list as owned data. This keeps it clear of the sub-processor gate, so it ships now.

**Welcome post drafted (2026-07-19):** the first issue ("Normal on paper, flat in real life. Start here.") is written and tracked as an asset (`assets/2026-07-19-substack-welcome-normal-on-paper.md`, `status: scripted`). Pre-flight **green** (deterministic scanner 0/0 + judgement pass; claim-clean by inheritance from the Kit 2 fatigue pillars, no fresh Ewa step). Cover image chosen (Sebastian Schuster, Unsplash, 1200x630). Awaiting Keith's publish go, which is gated on (a) below (the publication existing).

**Owed / conditional:**
- **(a) Keith:** create the publication (name, handle, bio, headshot per `social-channel-setup.md`, on `keith@andro-prime.com`) and grab `androprime.substack.com` as a name-hold placeholder. Not started.
- **(b) Republish-safe rule:** first Substack issue must be a *published, Ewa-signed* article, republished after it indexes, reference-linked back to the canonical URL, and `/compliance-preflight`-passed before send. No net-new health content ahead of the blog.
- **(c) Sub-processor gate (only if the decision changes):** actively growing the Substack email list as owned data would make Substack a new PII processor and needs compliance to approve it as a **sub-processor first** (same gate as ManyChat: `03_compliance` sub-processor schedule + privacy policy). Not triggered under the current distribution-only decision.
- **(d) `/script <topic> substack` generator:** not built. Substack issues are assembled by repurposing a published article for now; a dedicated generator mode is a future add.

## Content Library BUILT (git-first tracker) (2026-07-13)

Git is now the database for founder content: `content-machine/assets/` holds one markdown file per idea, its frontmatter the tracker (status, funnel tags, preflight, renditions), schema and worked example in `templates/asset-file.md`. A gate scanner (`.claude/skills/content-status/scan.js`) hard-blocks invalid transitions (no `scripted` without a script, no `approved` without a green preflight plus a canonical asset, no `scheduled` rendition without its confirmed thumbnail, and the compliance HARD table over body copy). The new `/content-status` skill renders the board; `/hook`, `/script`, `/compliance-preflight`, and `/wrap` are wired to mint, advance, stamp, and gate-check asset files. A one-way sync script mirrors state into a "Content Library" list in ClickUp (renditions as a table in the description; git wins; Ewa's "Content Review" list `901218140081` is untouched). The durable spec is `content-library-build-spec.md`.

**Owed:**
- ~~**(a) Keith:** `gws auth login -s drive,gmail`~~ **DONE 2026-07-13.** Re-authed to `keith@andro-prime.com` with drive + gmail scopes. Drive tree `Content/2026-07/<slug>/{raw,final,thumb}` created in the business Drive for all three seeds; their `drive:` links are live; root/month folder ids recorded in the `/hook` skill. (Gotchas recorded there too: call gws from Bash not PowerShell; delete `~/.config/gws/token_cache.json` if a call 403s right after re-auth.)
- ~~**(b) Keith:** create the "Content Library" list~~ **DONE 2026-07-13.** List live at id `901219526361` (Phase 0 Launch folder) with the seven custom statuses.
- **(c) Keith:** trash the stray "Content" folder created 2026-07-13 in the personal Drive (`keithantony5@gmail.com`) by mistake. The business Drive is the home for all Content Library media. (The 14 stray "Untitled" files in the business Drive from the same day's gws misfire are already trashed.)
- ~~**(d) The first live sync run**~~ **DONE 2026-07-13.** Three seed tasks created with correct statuses (ep-0-baseline `idea`; the-stack + when-a-test-earns-its-place `scripted`); re-run verified idempotent (0 create / 0 update / 3 unchanged). The daily Action step keeps it fresh from here.

## Founder-content craft layer + generators BUILT (2026-07-11, extended 2026-07-12)

A full multi-platform generation stack, all reading each other and the compliance rails live:

- **`avatar-mark.md`:** the single ideal-viewer avatar ("Mark, 44"), from the Kallaway avatar exercise plus a live Reddit VOC sweep (verbatim pain lines). Every script is written to him.
- **`hook-playbook.md`:** six archetypes, visual-first rule (the key visual is the blood, not Keith's face), dream-outcome-is-certainty, founder-reveal-held, the seven-step write. Points to **`borrowed-hook-templates.md`** (added 2026-07-12): 43 proven structures curated from the "1000 Viral Hooks" library, compliance-reframed (cure/diagnosis/authority-voice templates excluded), mapped to our archetypes + funnel stages.
- **`script-playbook.md`** (short-form) plus **`long-form-script-playbook.md`** (YouTube) plus **`written-post-playbook.md`** (LinkedIn + Facebook, added 2026-07-12): the story/craft per platform, compliance-gated (shock-facts true AND compliant; contrarian aimed at the reference range not the GP; all posts/videos are derivatives that may not exceed the Ewa-signed article's claims). LinkedIn = Keith's personal profile, founder-forward, no bullet lists, ends on a question; Facebook = brand page, older segment, informational, soft router link.
- **`content-funnel-map.md`:** the pre-click acquisition funnel (TOFU/MOFU/BOFU/Retention), what content does which job, and the markup every asset carries. Connects to the `07_sales` lifecycle funnel at the email rung and the kit purchase (cross-linked both ways).
- **Skills:** `/hook <topic>` (three hooks) and `/script <topic>` with four modes: default short-form video, `long` (YouTube), `linkedin`, `facebook`. All refuse TRT/ashwagandha/Pillar E, never invent bloodwork numbers, stamp a funnel tag, and end at `/compliance-preflight`. Skill files live in `.claude/skills/hook/` and `.claude/skills/script/`.

**Verified working:** demoed all four modes on ferritin (short, long, linkedin, facebook). Every mode correctly flagged that the source ferritin article is still `status: draft` and cannot ship until Ewa-signed.

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

- **YouTube + Instagram accounts live since 2026-07-02, no content posted yet.** YouTube under `@keithandroprime`; Instagram is now `@keith.antony.tech` (an existing account: the new `@keith.androprime` kept being auto-deactivated, changed 2026-07-19) per `content/social-channel-setup.md`; see `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`. First post is a Keith go. **Ep 0 baseline shoot not done** (`youtube-founder-journey-strategy.md` §10) and should be filmed before results move: the before-state is unrecoverable. Placeholder handles: YouTube reserved 2026-07-09 as `@androprime-men`; Instagram `@androprime` still owed.
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
