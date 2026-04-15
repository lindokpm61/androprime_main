# Andro Prime — Landing Page Navigation & LP Architecture
## April 2026

---

## Purpose

This document records the recommended page architecture for Phase 0 launch:

- how canonical site pages should behave
- how acquisition landing-page variants should behave
- which CTA each landing-page variant should use
- which sections should stay or be removed on LP variants

It is derived from:

- `06_marketing/master-plan/phase0-acquisition-strategy.md`
- `06_marketing/master-plan/phase0-marketing-plan.md`

Companion execution documents:

- `09_website-app/docs/lp-variant-specs.md`
- `10_launch-ops/implementation-checklists/lp-implementation-checklist.md`

---

## Core Recommendation

Andro Prime should use a hybrid architecture:

- the main site remains interconnected for trust, orientation, and branded/organic traffic
- acquisition traffic should be sent to reduced-navigation landing-page variants
- LP variants should follow a strict single-primary-CTA rule

This means LP variants are not just the same pages with less navigation. They should also be edited to reduce competing actions.

---

## Recommended Sitemap

```text
Homepage (/)
├── Tests
│   ├── Test Selector (/test-selector/) [build next]
│   ├── Testosterone Health Check (/test/testosterone/)
│   ├── Energy & Recovery Check (/test/energy-recovery/)
│   └── Hormone & Recovery Check (/test/foundations/)
├── Supplements
│   ├── Supplements Hub (/supplements/) [build next]
│   ├── Daily Stack (/supplements/daily-stack/)
│   └── Joint & Recovery Collagen (/supplements/collagen/)
├── Waitlist (/waitlist/) [only if still active prelaunch/campaign]
├── Blog (/blog/) [future]
├── Founding Member (/founding-member/) [future, not main nav in Phase 0]
└── Legal / Footer Pages
    ├── Privacy (/privacy/)
    ├── Terms (/terms/)
    └── Cookie Policy (/cookies/)
```

Acquisition variants:

```text
Landing Variants (/lp/)
├── /lp/testosterone/
├── /lp/energy-recovery/
├── /lp/foundations/
├── /lp/daily-stack/
└── /lp/collagen/
```

---

## Single CTA for Each LP Variant

Use one goal per page based on the acquisition model and the most likely conversion action.

```text
/lp/testosterone/
CTA: Order the Testosterone Health Check → £29
Goal: buy Kit 1

/lp/energy-recovery/
CTA: Order the Energy & Recovery Check → £44
Goal: buy Kit 2

/lp/foundations/
CTA: Order the Hormone & Recovery Check → £69
Goal: buy Kit 3

/lp/daily-stack/
CTA: Subscribe to Daily Stack → £34.95/month
Goal: start subscription

/lp/collagen/
CTA: Subscribe to Joint & Recovery Collagen → £29.95/month
Goal: start subscription
```

Rule:

- LPs should choose the default commercial model
- for supplements, that should usually be subscription rather than one-off
- if one-off needs testing, create a separate LP variant instead of putting two competing CTAs on one page

---

## Which Sections Stay or Go on LP Variants

### Kit LP Pages

Keep:

- hero
- trust proof / accreditation
- what this tests / biomarkers section
- symptom / problem section
- how it works
- results or dashboard preview
- FAQ
- final CTA

Remove or reduce:

- broad top navigation
- unrelated product links
- comparison sections that encourage browsing instead of buying
- visible upsell/downsell links near the main conversion zone
- anything that shifts the page from "order this kit" into general site exploration

Conditional:

- one low-prominence text link to the selector page can exist near the bottom if needed
- it should not compete with the page's primary CTA

### Supplement LP Pages

Keep:

- hero
- why this supplement / who it is for
- formulation / ingredient section
- why it is different
- doctor or evidence rationale
- FAQ
- final CTA

Remove or reduce:

- one-off purchase CTA
- bundle CTA
- supplement hub browsing
- broad navigation
- alternative purchase-path buttons

Important rule:

- if the LP is subscription-focused, every CTA on the page should point to the same subscription checkout

### Waitlist LP

If used:

- keep only email capture
- no broad navigation
- no multiple paths
- one action only: join waitlist

---

## Canonical Pages vs LP Pages

### Canonical Pages

Purpose:

- real public site pages
- trust, orientation, and conversion

Allowed:

- reduced nav or full site-aware nav
- one dominant CTA
- limited secondary actions
- relevant adjacent links
- some cross-sell / upsell logic
- selector links
- broader credibility content

Examples:

- a kit page can include a primary "Order Kit" CTA and one relevant upsell text link
- a supplement page can include subscription as primary and one-off as secondary

### LP Pages

Purpose:

- direct-response acquisition funnels

Allowed:

- logo
- one repeated CTA target
- anchor jumps within page
- trust and reassurance content that supports the single action

Not allowed:

- multiple purchase-mode CTAs
- unrelated product links
- broad browse navigation
- bundle alternatives
- blog links
- visible competing next steps

---

## Navigation Rules by Page Type

### Homepage

Purpose:

- trust hub
- orientation page
- branded and organic entry point

Header nav:

- `Tests`
- `Supplements`
- `Blog` when live
- right-side CTA: `Choose your test`

Footer:

- full legal and supporting navigation is appropriate

### Canonical Product Pages

Applies to:

- `/test/testosterone/`
- `/test/energy-recovery/`
- `/test/foundations/`
- `/supplements/daily-stack/`
- `/supplements/collagen/`

Header:

- logo links to `/`
- no broad browse menu in Phase 0
- one sticky CTA on the right
- optional internal-anchor behavior only

Good CTA examples:

- kits: `Order Kit → £X`
- supplements: `Subscribe → £X/mo`

Avoid in header:

- `Blog`
- unrelated tests or supplements
- `Founding Member`
- hamburger drawer with broad site exploration

### Acquisition Landing Variants

Applies to:

- `/lp/testosterone/`
- `/lp/energy-recovery/`
- `/lp/foundations/`
- `/lp/daily-stack/`
- `/lp/collagen/`

Header:

- logo
- one CTA only
- no nav links
- no hamburger
- no secondary browse options

Footer:

- legal/footer compliance content can remain
- broad footer browsing should be reduced

### Founding Member

- should not be a major public nav destination in Phase 0
- should be linked from post-result flows, lifecycle email, retargeting, and qualified internal CTAs

### Waitlist

- if still prelaunch, keep minimal
- if no longer central after launch, demote or retire

---

## Decision Framework

If the user arrives from:

- Google Ads
- affiliate link
- retargeting ad
- creator promo

Send them to:

- `/lp/...`

If the user arrives from:

- homepage
- branded search
- organic discovery
- direct navigation

Send them to:

- canonical page

---

## Recommended Rollout

### Phase 1

Apply reduced navigation to the current canonical product pages:

- `/test/testosterone/`
- `/test/energy-recovery/`
- `/test/foundations/`
- `/supplements/daily-stack/`
- `/supplements/collagen/`

Changes:

- remove broad `nav-links`
- remove broad mobile-drawer link groups
- remove hamburger and drawer JS
- keep logo linking to `/`
- keep sticky CTA
- preserve legal footer content

### Phase 2

Build missing route hubs:

- `/test-selector/`
- `/supplements/`

### Phase 3

Create true `/lp/` acquisition variants:

- same core proposition
- reduced nav shell
- single CTA target
- simplified sections
- no competing offers

### Phase 4

Tighten internal linking:

- Kit 1 → Kit 3
- Kit 2 → Kit 3
- kits → selector
- Daily Stack → relevant test
- Collagen → relevant test or relevant result context

### Phase 5

Treat `/founding-member/` as a qualified-flow page rather than a public top-nav page.

---

## Final Recommendation

For Phase 0 launch:

- do not treat the main site as fully isolated one-page funnels
- do not allow broad browsing on acquisition landing pages
- keep the public site interconnected
- create reduced-nav, single-CTA LP variants for paid and affiliate traffic

This creates the best balance between:

- conversion efficiency
- health-category trust
- branded legitimacy
- future scalability
