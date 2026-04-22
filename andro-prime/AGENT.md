# Andro Prime Repository Instructions

This repository is a business operating system for Andro Prime, not just an application codebase.

## Top-Level Structure

- `01_strategy` — strategy, business model, roadmap, financial logic
- `02_brand` — brand guidelines, tone, messaging, visual identity
- `03_compliance` — privacy, claims, approvals, governance
- `04_products` — kits, supplements, pricing, results logic
- `05_partners` — labs, manufacturers, future clinical partners
- `06_marketing` — campaigns, affiliates, paid media, content, SEO, analytics
- `07_sales` — funnel logic, lifecycle, CRM, email sequences
- `08_customer-journey` — onboarding, support, retention, customer flow
- `09_website-app` — design system, frontend, backend, database, automations
- `10_launch-ops` — implementation checklists, QA, dashboards, readiness
- `11_clinical-plugin_post-cqc` — regulated clinical workflows

## Mandatory Rules

### 1. Read local context first

Before editing inside any top-level workspace, read that folder's `CONTEXT.md`.

### 2. Respect Phase 0 vs post-CQC boundaries

Do not introduce clinical claims, diagnosis language, or treatment logic into Phase 0 wellness deliverables.

### 3. Compliance has priority

If copy, design, funnel logic, or product messaging touches claims, privacy, deposits, or regulated language, check `03_compliance` first.

### 4. Keep frontend modes separate

Inside `09_website-app/frontend`, keep:

- `canonical-site`
- `lp`
- `app`

separate in purpose and implementation.

### 5. Preserve source-of-truth docs

Prefer editing the relevant existing document rather than creating duplicate versions.

### 6. Naming

Use lowercase kebab-case for markdown files and descriptive filenames for CSS and implementation files.

### 7. Do not invent business content unless asked

When scaffolding, create structure and placeholder content only.

## Editing Guidance

### Strategy tasks

Work in `01_strategy`.

### Messaging/brand tasks

Work in `02_brand`.

### Compliance-sensitive copy

Work in `03_compliance` first, then cross-check with brand/products.

### Product logic or results-engine work

Work in `04_products`.

### Marketing pages, LPs, campaigns, blog planning

Work in `06_marketing` and `09_website-app` where relevant.

### Funnel, sequence, lifecycle, CRM logic

Work in `07_sales`.

### Design system, page templates, CSS architecture, app structure

Work in `09_website-app`.

### Email copy — transactional sends and automated sequences

Work in `09_website-app/frontend/email-templates/`. Read `CONTEXT.md` there first.
Platform is Customer.io. Trigger logic and sequence specs are in `automations/customerio/sequences.md`.
Do not write email copy outside this directory.

### QA and launch readiness

Work in `10_launch-ops`.

### Regulated clinical workflows

Work in `11_clinical-plugin_post-cqc`.

## Implementation Bias

Prefer:

- clear folder ownership
- reusable docs
- maintainable structure
- low duplication
- explicit assumptions

Avoid:

- mixing strategy with implementation
- mixing LP logic with canonical pages
- mixing wellness and clinical positioning
- adding files with vague names like `notes2.md`, `final-v3.md`, or `misc.md`
