# Brand — Context

**Source of truth:** `brand-guidelines.md` (v2.0, April 2026) — read before any creative or design work
**Owner workspace:** `02_brand`
**Integration:** Voice rules and visual identity govern all external-facing output across every workspace. When any workspace produces copy, creative, or UI, it must be checked against this workspace's source-of-truth files before publishing.

This workspace defines how Andro Prime sounds, positions itself, and presents trust. It is the source of truth for voice, visual identity, messaging, and creative production standards. Ad creative and channel content live in `/06_marketing/` — this workspace defines the rules they must follow.

---

## Directory Structure

```text
02_brand/
├── brand-guidelines.md      ← Visual identity & design system (v2.0, April 2026) — READ FIRST
├── brand-description.md     ← Long/short/one-liner copy for affiliates, press, social bios
├── messaging-framework.md   ← Positioning, value props, ICP messaging by segment
├── tone-of-voice.md         ← Voice rules, pub test, channel-specific guidance
├── prohibited-terms.md      ← Terms that must never appear in any copy
├── trust-signals.md         ← PLACEHOLDER (not yet written). Approved UKAS/GMC wording currently lives in 03_compliance — see Special Cases.
└── visual-identity.md       ← Legacy — superseded by brand-guidelines.md v2.0. Do not edit.
```

Ad creative and channel content live in `/06_marketing/` — this workspace governs only the rules they must follow:

```text
06_marketing/content/
├── linkedin/        ← Keith's LinkedIn posts (drafts + published)
├── youtube-scripts/ ← Full video scripts
├── instagram/       ← Reel scripts, caption copy, story briefs
├── blog/            ← SEO articles
└── reddit/          ← r/UKTRT and r/testosterone reply drafts

06_marketing/paid-media/
├── google-search/   ← Google ad copy: headlines, descriptions, extensions
├── meta/            ← Meta ad copy and video scripts
└── youtube/         ← Pre-roll scripts and video briefs
```

---

## How to Work Here

### Writing any copy or creative

1. Run the pub test: **would Keith say this to a friend in a pub?** If not, rewrite it.
2. Check `prohibited-terms.md` for banned words and phrases.
3. Check `tone-of-voice.md` for channel-specific rules (Google, Meta, LinkedIn, Reddit, blog).
4. Check `/03_compliance/CONTEXT.md` for EFSA claims and red-flag language before any supplement or kit copy goes live.
5. Run the Creative Compliance Checklist below before saving the file.

### Updating brand guidelines or voice rules

1. Read the current file in full before editing — these are source-of-truth documents.
2. `brand-guidelines.md` is v2.0. Do not create a `v3` alongside it — edit in place and update the version header.
3. `visual-identity.md` is legacy and superseded. Do not edit it. If you need to change visual rules, edit `brand-guidelines.md`.
4. If a voice rule changes, update `tone-of-voice.md` AND `prohibited-terms.md` if the change adds or removes a banned term.

### Providing brand assets to affiliates or influencers

1. Use `brand-description.md` for the long/short/one-liner copy — do not write new versions on the fly.
2. `trust-signals.md` is an empty placeholder — do NOT rely on it. For approved UKAS/GMC credibility language use the ratified forms in `03_compliance` (see Special Cases below); clear any new trust claim through `03_compliance` first.
3. Brief all affiliates in writing: no supplement efficacy claims beyond EFSA-approved language, and never mention ashwagandha. This is a compliance requirement, not a preference. See `/03_compliance/CONTEXT.md`.

### Producing or commissioning visual assets

1. Read `brand-guidelines.md` (v2.0) in full before briefing a designer or generating assets.
2. All assets go into `assets/` under the relevant subdirectory: `colours/`, `icons/`, `logos/`, `templates/`, `typography/`.
3. No new subdirectories inside `assets/` without a clear category rationale.

---

## Voice Rules Reference

Core rules from `tone-of-voice.md`. Full detail is in that file — these are the non-negotiables.

| Rule | Detail |
| --- | --- |
| Pub test | Every line must pass: would Keith say this to a friend in a pub? |
| No em dashes | Applies to all external-facing writing, not only published copy: website, ads, social, results copy, and any external correspondence such as partner, supplier, or customer emails. Use a full stop, comma, or colon instead. Em dashes read as editorial and kill the plain-speaking voice. |
| Plain English | "Knackered all the time" not "suboptimal energy levels." Direct, not clinical. |
| No wellness fluff | Not aspirational, not motivational, not spa-brochure. Data first. |
| Results copy | "Your results indicate..." not "You have..." |
| Retest framing | "Find out how your levels have changed" not "find out if the supplement fixed you" |
| Lead with the feeling | All customer-facing content **opens on the body-feeling**, reveals the test/data as the answer, and treats the explanation as the value. The test/biomarker is **never** the opening hook (newsletter subjects, ad hooks, email opens). SEO *rank* targets can still be clinical gap-terms, but the hook/title must lead with feeling. Audience searches + buys in feeling-language; clinical framing anchors to the £30/NHS comparison and caps price. Doctrine: `../06_marketing/master-plan/2026-06-26-feeling-first-content-strategy.md`. |
| No repeated openers | The diagnostic-question is the signature *move*, but the **wording must vary every article** — never reuse an opener phrasing library-wide (it becomes an AI tell). The verbatim "I asked him one question" and the "A man brought me his results…" vignette are retired as recurring openers. Enforced like the em-dash ban (`tone-of-voice.md` §3); the `/article` voice-pass checks prior openers. Also: straight apostrophes, not curly. |

---

## Channel-Specific Rules Reference

| Channel | Rule |
| --- | --- |
| Google search | Include price in at least one headline. Lead with the problem or the result. |
| Meta cold | Open with the symptom, not the product. No discount codes in cold creative. |
| LinkedIn | No bullet lists. Strong hook on line 1. End with a question. Keith's voice only. |
| Reddit | Never pitch. Never link unprompted. Answer the question and stop. |
| Blog | Lead with the keyword. Write for ICP 1 or ICP 2. Informational tone, not sales. |

---

## Visual Identity Quick Reference

Full design system in `brand-guidelines.md` (v2.0). These are the non-negotiables for any visual output.

| Rule | Detail |
| --- | --- |
| Background / colour | White background, black type, no accent colour |
| Corners | `rounded-none` everywhere — buttons, cards, icons, containers |
| Headlines | Inter `font-black`, `uppercase`, `tracking-tighter` |
| Body copy | Merriweather serif |
| Photography | Real men aged 38–55, kitchens, offices, gyms. No studios, no fitness models, no stock |
| Forbidden aesthetics | Nothing that looks like Numan, Hims, Medichecks, or a Harley Street clinic brochure |
| Gradients / effects | None. No decorative gradients, glows, or blur |
| Logo / mark | **Refined Monogram** (chosen 2026-06-12): black square + white "AP" (Inter Black) + "ANDROPRIME" wordmark at `letter-spacing: 0`. Masters: `assets/logos/refined-monogram/`. Default = **solid** mark; the **outlined** variant (`icon-outline*.svg`) is a sanctioned exception to the "no effects" rule for **large format only (≥~25mm)** — favicon/small/UI keep the solid mark. Shipped as `components/shared/Logo.tsx` in `09_website-app`. See `STATE.md`. |
| Blog exception (`.blog-skin`) | The blog runs a scoped **brutalist editorial** category (cream `#f4f4f0` surface, hard offset block-shadows, mono "SYS:" labels) — a documented departure from the white-only / no-shadow rules, namespaced under `.blog-skin` only. **Accent red is DROPPED** (red is reserved for the results-dashboard critical/GP-block status; decorative red near health copy collides with that meaning + ASA risk). GP-referral boxes stay strictly black-on-white. Implementation: `09_website-app` `styles/base/blog-skin.css`. |

---

## Creative Compliance Checklist

Run before saving any ad, content, or email file:

- [ ] Pub test passed — Keith would say this to a friend in a pub
- [ ] No "diagnose," "diagnosis," "treat," "treatment," "cure"
- [ ] No claim TRT is currently available
- [ ] Supplement claims use EFSA-approved language only (see `/03_compliance/CONTEXT.md`)
- [ ] No ashwagandha mentioned anywhere (silent ingredient — compliance rule, not brand preference)
- [ ] Price included on Google ad headlines
- [ ] No discount codes in cold Meta creative
- [ ] No em dashes in any published copy or external correspondence

---

## Special Cases

**`brand-guidelines.md` v2.0:** This is the live design system document. It supersedes `visual-identity.md` completely. If there is any conflict between the two, `brand-guidelines.md` wins. Do not edit `visual-identity.md`.

**`brand-description.md`:** The canonical short and long descriptions for third-party use — affiliate onboarding packs, press mentions, social bios, app store descriptions. Use this file as the source. Do not write new versions in other workspaces.

**`messaging-framework.md`:** Contains ICP-level positioning and value prop statements. When writing copy for a specific ICP, check this file first. Do not duplicate its content into ad briefs — reference it. The lead pillar (v1.0, 2026-05-19) is the **data-ownership inversion**: "your results, in your dashboard, tracked over time, and yours to keep; you see everything we see" — blood-data-first is kept as the method beneath. Pillars: 1 Patient-owned data (lead), 2 Comprehensive men's health, 3 Clinical credibility, 4 Premium.

> **Compliance call — do not regress:** "**patient-owned data**" is the INTERNAL pillar name only. Customer-facing copy must say "**your data / your health record / yours to keep**" — Phase 0 has *customers, not patients* (wellness/clinical split). "Tracked over time" must not imply a live longitudinal tracker or any insights/AI layer (tracker v1 is observation-only, ships M3–M4). "Your dashboard" / "yours to keep" are true at launch.

**`trust-signals.md`:** ⚠️ **Empty placeholder — not yet written** (despite older pointers that called it the approved source). Do not improvise trust language — improvised trust claims can become regulatory claims if they imply diagnostic or clinical capability. Until this file is populated (and any wording signed off via `03_compliance`), use the forms already ratified: **"Vitall (UKAS ISO 15189 accredited)"** and **"recommendation logic signed off by a GMC-registered GP"** (the 2026-05-26 CA-001/003 re-sweep in `03_compliance/content-approval/content-approval-register.md` replaced the earlier "GP-built report / GMC-registered prescriber"). **Owed:** populate this file from those approved forms.

---

## File Naming Convention

| Type | Pattern | Example |
| --- | --- | --- |
| Guidelines | `[topic]-guidelines.md` | `voice-guidelines.md` |
| Ad briefs (in `06_marketing/`) | `BRIEF_[Channel][Product][Version].md` | `BRIEF_GoogleKit2_v1.md` |
| Content (in `06_marketing/`) | `YYYY-MM-DD-topic.md` | `2026-04-10-gp-testosterone-normal-linkedin.md` |
| Scripts (in `06_marketing/`) | `YYYY-MM-DD-topic-script.md` | `2026-04-10-kit1-meta-script.md` |

---

## Do Not Use This Workspace For

- Compliance approval or regulatory sign-off (→ `/03_compliance`)
- Product threshold logic, biomarker rules, or supplement formulation (→ `/04_products`)
- Technical or UI implementation (→ `/09_website-app`)
- Campaign tracking, analytics setup, or media planning (→ `/06_marketing`)
- Storing ad creative or channel content files (→ `/06_marketing/paid-media/` or `/06_marketing/content/`)
