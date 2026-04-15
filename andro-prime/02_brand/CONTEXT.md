# Brand Workspace Context

## Purpose

This workspace defines how Andro Prime sounds, positions itself, and presents trust. It is the source of truth for brand voice, visual identity, and creative production standards.

Read `../CLAUDE.md` (root) before any creative work.

---

## Directory Map

```text
02_brand/
├── brand-guidelines.md      ← Visual identity & design system (v2.0, April 2026) — READ FIRST
├── brand-description.md     ← Long/short/one-liner copy for affiliates, press, social bios
├── messaging-framework.md   ← Positioning, value props, ICP messaging
├── tone-of-voice.md         ← Voice rules, pub test, channel-specific guidance
├── prohibited-terms.md      ← Terms that must never appear in any copy
├── trust-signals.md         ← UKAS, GMC, and other credibility assets
├── visual-identity.md       ← (legacy — superseded by brand-guidelines.md v2.0)
├── guidelines/              ← (empty — guidelines docs live at root of 02_brand/)
└── assets/
    ├── colours/             ← Colour palette files
    ├── icons/               ← SVG icon set
    ├── logos/               ← Logo files
    ├── templates/           ← Approved brand templates
    └── typography/          ← Font files
```

Ad creative and content live in `/06_marketing/`:

```text
06_marketing/
├── paid-media/
│   ├── google-search/   ← Google ad copy: headlines, descriptions, extensions
│   ├── meta/            ← Meta ad copy + video scripts
│   └── youtube/         ← Pre-roll scripts and video briefs
└── content/
    ├── linkedin/        ← Keith's LinkedIn posts (drafts + published)
    ├── youtube-scripts/ ← Full video scripts (2/month)
    ├── instagram/       ← Reel scripts, caption copy, story briefs
    ├── blog/            ← SEO articles (informational → decision)
    └── reddit/          ← r/UKTRT and r/testosterone reply drafts
```

---

## File Naming Convention

- Ad briefs: `BRIEF_[Channel][Product][Version].md` — e.g., `BRIEF_GoogleKit2_v1.md`
- Content: `[date]-[topic].md` — e.g., `2026-04-10-gp-testosterone-normal-linkedin.md`
- Scripts: `[date]-[topic]-script.md`
- Guidelines: `[topic]-guidelines.md` — e.g., `voice-guidelines.md`, `visual-identity.md`

---

## Voice Test

Every piece of creative must pass: **Would Keith say this to a friend in a pub?**

- Writing for Google: include price in at least one headline.
- Writing for Meta cold: open with the symptom, not the product.
- Writing blog content: lead with the keyword, write for ICP 1 or ICP 2.
- Writing a LinkedIn post: no bullet lists, strong hook on line 1, end with a question.
- Writing a Reddit reply: never pitch, never link unprompted.

---

## Brand Visual Rules

Read `brand-guidelines.md` (v2.0) for the full design system. Summary:

- Light editorial palette. White background, black type, no accent colour. Not dark glass, not pastel wellness, not sterile clinic.
- `rounded-none` on everything. Square corners throughout — buttons, cards, icons, containers.
- Headlines: Inter `font-black`, `uppercase`, `tracking-tighter`. Body copy: Merriweather serif.
- Real men aged 38–55. Kitchens, offices, gyms. No studios, no fitness models.
- No stock photography. No decorative gradients, glows, or blur effects.
- Nothing that looks like Numan, Hims, Medichecks, or a Harley Street clinic brochure.

---

## Compliance Checklist for Creative

Before saving any ad or content file:

- [ ] No use of "diagnose," "diagnosis," "treat," "treatment," "cure"
- [ ] No claim TRT is currently available
- [ ] Supplement claims use EFSA-approved language only
- [ ] Price included on Google ad headlines
- [ ] No discount codes in cold Meta creative

---

## What belongs in this workspace

- Brand guidelines and tone-of-voice docs
- Messaging framework and positioning
- Prohibited language from a brand perspective
- Visual identity rules, logo usage, colour and type standards
- Creative production standards and compliance checklist

## Do not use this workspace for

- Compliance approval (→ `/03_compliance`)
- Product threshold logic (→ `/04_products`)
- Technical architecture (→ `/09_website-app`)
- Detailed campaign tracking setup (→ `/06_marketing`)
