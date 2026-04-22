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
├── trust-signals.md         ← UKAS, GMC, and other credibility assets and how to use them
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
2. Use `trust-signals.md` for approved credibility language (UKAS, GMC, etc.).
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
| No em dashes | Use a full stop, comma, or colon instead. Em dashes read as editorial — kills the plain-speaking voice. |
| Plain English | "Knackered all the time" not "suboptimal energy levels." Direct, not clinical. |
| No wellness fluff | Not aspirational, not motivational, not spa-brochure. Data first. |
| Results copy | "Your results indicate..." not "You have..." |
| Retest framing | "Find out how your levels have changed" not "find out if the supplement fixed you" |

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
- [ ] No em dashes in any published copy

---

## Special Cases

**`brand-guidelines.md` v2.0:** This is the live design system document. It supersedes `visual-identity.md` completely. If there is any conflict between the two, `brand-guidelines.md` wins. Do not edit `visual-identity.md`.

**`brand-description.md`:** The canonical short and long descriptions for third-party use — affiliate onboarding packs, press mentions, social bios, app store descriptions. Use this file as the source. Do not write new versions in other workspaces.

**`messaging-framework.md`:** Contains ICP-level positioning and value prop statements. When writing copy for a specific ICP, check this file first. Do not duplicate its content into ad briefs — reference it.

**`trust-signals.md`:** Contains approved wording for UKAS, GMC, and other credibility assets. Do not improvise trust language — improvised trust claims can become regulatory claims if they imply diagnostic or clinical capability.

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
