# Andro Prime — LP Implementation Checklist
## April 2026 | Phase 0 Launch Execution

---

## Purpose

This document translates the LP recommendations and LP variant specs into a build checklist.

It covers:

- what to change on current canonical pages
- what to build for future `/lp/` acquisition variants
- build order
- QA requirements

Related documents:

- `09_website-app/docs/lp-architecture.md`
- `09_website-app/docs/lp-variant-specs.md`
- `06_marketing/master-plan/phase0-acquisition-strategy.md`
- `06_marketing/master-plan/phase0-marketing-plan.md`

---

## Recommended Build Order

### Phase 1 — Reduce friction on current canonical pages

Apply reduced-nav structure to:

- `09_website-app/frontend/canonical-site/kits/testosterone/`
- `09_website-app/frontend/canonical-site/kits/energy-recovery/`
- `09_website-app/frontend/canonical-site/kits/hormone-recovery/`
- `09_website-app/frontend/canonical-site/supplements/daily-stack/`
- `09_website-app/frontend/canonical-site/supplements/collagen/`

### Phase 2 — Build missing route hubs

Create:

- `/test-selector/`
- `/supplements/`

### Phase 3 — Build acquisition variants

Recommended order:

1. `/lp/energy-recovery/`
2. `/lp/testosterone/`
3. `/lp/foundations/`
4. `/lp/daily-stack/`
5. `/lp/collagen/`

Reason:

- Kit 2 is the strongest Phase 0 fit for affiliate-first and symptom-led acquisition
- it is the best candidate to validate the LP pattern before duplicating the system across the rest

Status as of 2026-04-11:

- Phase 1 complete
- Phase 2 complete
- Phase 3 complete for all five planned LP variants
- LP cleanup pass complete for shared typography, token usage, and mobile-first local responsive rules
- remaining work is QA / launch-readiness

---

## Canonical Page Changes

These changes apply to the current public kit and supplement pages.

### Navigation shell

- remove broad `nav-links`
- remove browse-oriented mobile drawer links
- remove hamburger if no broader menu remains
- keep logo linking to `/`
- keep sticky CTA on the right
- keep legal footer content

### CTA hierarchy

- maintain one dominant CTA per page
- keep any secondary actions visually quieter
- avoid broad header exits that pull users into browsing

### Cross-link discipline

- kit pages: only relevant adjacent links
- supplement pages: only relevant test or bundle logic when necessary
- no blog links from core conversion pages in Phase 0

### QA for canonical pages

- header still functions on desktop and mobile
- sticky CTA anchors to the correct section
- no broken drawer/hamburger JS remains
- footer remains intact
- page still feels like a legitimate site page, not an orphaned campaign shell

---

## LP Variant Build Checklist

Use these rules for all `/lp/` variants.

### Shared LP shell

- logo only in header
- one CTA in header or sticky top bar
- no browse links
- no hamburger
- no mobile drawer
- legal footer may remain
- all visible CTA buttons point to the same destination

### Shared LP content rules

- one audience
- one offer
- one CTA target
- no equal-weight alternative purchase paths
- no unrelated product discovery
- internal anchor jumps only if they support conversion

### Shared LP analytics requirements

- every CTA needs a unique `id`
- LP pages should be distinguishable in tracking from canonical pages
- source and campaign should be measurable separately for `/lp/` traffic

### Shared LP implementation / QA guardrails

- import `09_website-app/frontend/styles/` global tokens
- use approved font load only:
  - `Inter: 300, 400, 500, 600`
  - `JetBrains Mono: 400, 700`
- use `.type-hero-page` for LP H1s
- keep LP-local CSS token-based
- do not leave hardcoded hex colour values in LP files
- prefer mobile-first local responsive rules
- use `min-width` enhancement queries for LP-local responsive blocks
- repeated CTA buttons should resolve to the same `#order` target

---

## Page-by-Page Build Tasks

### 1. `/lp/energy-recovery/`

Source starting point:

- canonical `canonical-site/kits/energy-recovery/`

Tasks:

- clone canonical content structure
- remove broad nav elements
- remove or downgrade Kit 3 upsell block
- keep only one order CTA target throughout
- ensure hero, process, biomarkers, results, FAQ, and final CTA all support the same Kit 2 conversion
- remove any visible alternate purchase path

Primary CTA target:

- `Order the Energy & Recovery Check → £44`

QA:

- no competing CTA visible above the fold
- all CTA buttons point to the same checkout or order anchor
- trust proof still present
- page feels specific, not generic

### 2. `/lp/testosterone/`

Source starting point:

- canonical `canonical-site/kits/testosterone/`

Tasks:

- clone canonical structure
- remove broad nav
- keep only Kit 1 order CTA
- reduce any future founding-member/public-clinical distractions
- ensure copy keeps focus on "normal isn't the full story"

Primary CTA target:

- `Order the Testosterone Health Check → £29`

QA:

- no supplement links
- no public clinical-path distraction
- all CTA buttons align to Kit 1 order

### 3. `/lp/foundations/`

Source starting point:

- canonical `canonical-site/kits/hormone-recovery/`

Tasks:

- clone canonical structure
- remove broad nav
- keep premium positioning without opening comparison-heavy browse behavior
- remove or reduce downgrade prompts to cheaper kits
- keep only Kit 3 order CTA throughout

Primary CTA target:

- `Order the Hormone & Recovery Check → £69`

QA:

- page clearly justifies full-kit positioning
- no competing downgrade CTA in the main persuasion flow
- hero and results sections support "full picture" framing

### 4. `/lp/daily-stack/`

Source starting point:

- canonical `canonical-site/supplements/daily-stack/`

Tasks:

- clone canonical structure
- remove broad nav
- remove one-off purchase CTA
- remove bundle CTA
- keep subscription as the only visible CTA path
- keep evidence and doctor rationale strong enough for supplement credibility

Primary CTA target:

- `Subscribe to Daily Stack → £34.95/month`

QA:

- no one-off CTA remains as equal option
- no bundle CTA remains as equal option
- all CTA buttons route to subscription path only

### 5. `/lp/collagen/`

Source starting point:

- canonical `canonical-site/supplements/collagen/`

Tasks:

- clone canonical structure
- remove broad nav
- remove one-off purchase CTA
- remove bundle CTA
- keep subscription as the only visible CTA path
- keep problem, formulation, and doctor rationale sections

Primary CTA target:

- `Subscribe to Joint & Recovery Collagen → £29.95/month`

QA:

- no one-off CTA remains as equal option
- no bundle CTA remains as equal option
- all CTA buttons route to subscription path only

---

## URL and Routing Decisions

Decide before build:

- whether `/lp/` pages are separate files or generated from shared templates
- whether canonical pages and LP pages share the same partials for footer/legal
- whether LP pages are indexable or set to noindex

Recommended default:

- canonical pages are indexable
- LP pages are campaign pages and can be `noindex` if they are near-duplicates

---

## QA Checklist for Every LP Variant

- header contains only logo and single CTA shell
- no hamburger or browse drawer remains
- all CTA buttons point to the same final action
- no visible alternative purchase mode remains
- no unrelated product links remain
- no blog links remain
- footer legal content still exists
- typography and shared component styling remain on-brand
- mobile layout still works
- IDs remain unique
- tracking can distinguish LP traffic from canonical traffic

---

## Launch Recommendation

Do not build all LP variants at once without validating the pattern.

Best launch sequence:

1. reduce nav on canonical pages
2. build `/lp/energy-recovery/`
3. validate conversion behavior and UX
4. roll the LP pattern to the other four variants

This keeps launch execution focused while staying aligned with the Phase 0 acquisition model.
