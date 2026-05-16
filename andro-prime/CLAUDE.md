# Andro Prime

UK men's health business operating in two sequential modes under one customer-facing brand:

1. **Phase 0 — Wellness mode** (current): non-regulated diagnostic kits, supplement subscriptions, founding-member list opt-in (non-cash). Goal: self-sustaining profit centre that funds operations, validates PMF, and builds pre-qualified patient pipeline for clinical — all before CQC registration is complete.
2. **Post-CQC — Clinical mode** (not yet live): regulated intake, confirmatory testing, TRT subscription, clinical monitoring, add-ons.

This repository is the **operating system for the business**, not just a website or code repository. It contains strategy, brand, compliance, products, partners, marketing, sales, customer journey, website/app build, launch operations, and the post-CQC clinical plugin.

**Founders:** Keith Antony (founder, personal brand is a product feature) and Dr Ewa Lindo (GP, Harley Street TRT-trained, GMC-registered prescriber, signs off all results report copy).

---

## Core Principle

**Route to the correct workspace first. Read that workspace's CONTEXT.md. Then work.**

Do not treat this as one flat project. Every top-level workspace has its own CONTEXT.md — read it before working in that directory.

---

## Top-Level Workspaces

- `/01_strategy` — business model, roadmap, financial planning, entity structure
- `/02_brand` — brand guidelines, voice, messaging, visual identity
- `/03_compliance` — privacy, claims, approvals, governance, deposits
- `/04_products` — kits, supplements, pricing, thresholds, results-engine logic, ICPs
- `/05_partners` — labs, manufacturers, future clinical partners
- `/06_marketing` — campaigns, affiliates, content, AI/SEO, paid media, analytics
- `/07_sales` — funnel logic, lifecycle, CRM, email sequences, referral programme
- `/08_customer-journey` — pre-CQC and post-CQC journey, onboarding, support, retention
- `/09_website-app` — design system, frontend, backend, database, automations, deployment
- `/10_launch-ops` — implementation checklists, QA gates, dashboards, readiness reviews, Gate 0A/0B/0C tracking
- `/11_clinical-plugin_post-cqc` — regulated intake, consent, confirmatory testing, prescribing, monitoring, records governance

---

## Routing Table

For each task type, start in the workspace listed and read its `CONTEXT.md`.

| Task | Workspace |
| ---- | --------- |
| Business strategy, financial model, entity, roadmap, competitor research | `/01_strategy` |
| Brand voice, positioning, visual identity, copy voice rules | `/02_brand` |
| Any copy or marketing task involving health claims, supplements, kits, TRT, or the founding member programme | `/03_compliance` (read BEFORE drafting), then relevant workspace |
| Product specs, pricing, kit biomarkers, ICPs, results-engine logic, supplement formulation | `/04_products` |
| Lab or manufacturer evaluation, partner decisions | `/05_partners` |
| Campaigns, content, LPs, SEO, affiliates, paid media | `/06_marketing` |
| Funnel, lifecycle, CRM, email sequences, referral programme | `/07_sales` |
| Onboarding, support, retention, journey design | `/08_customer-journey` |
| Frontend, backend, database, design system, automations, deployment | `/09_website-app` |
| Weekly KPIs, dashboards, gate tracking, launch readiness, QA | `/10_launch-ops` |
| Post-CQC clinical process design | `/11_clinical-plugin_post-cqc` |

---

## Non-Negotiable Guardrails

These apply to every task regardless of workspace. If in doubt, stop and route to compliance.

### 1. Read compliance CONTEXT.md before any external-facing copy

Before drafting ANY copy — email, landing page, ad, social post, affiliate brief, influencer talking points, results report, or internal doc that could become external — **read `/03_compliance/CONTEXT.md` first**. This is not optional. The file contains the Pre-Flight Checklist, EFSA approved claims, red-flag language, and the Phase 0 / post-CQC boundary rules. All copy-compliance logic lives there.

### 2. Respect the wellness / clinical split

Do not blur Phase 0 wellness operations with post-CQC regulated clinical operations. TRT, peptides, and clinical services are NOT currently available. If a task risks crossing the line, stop and route to `/03_compliance/CONTEXT.md` and/or `/11_clinical-plugin_post-cqc`. Full rules in the compliance CONTEXT.md.

### 3. Ashwagandha silent-ingredient rule

Ashwagandha KSM-66 is in the Daily Stack formulation but has no approved EFSA health claim. **Do not mention it in any copy, email, social post, affiliate brief, or influencer talking points — anywhere, ever.** If an affiliate makes a claim about it, the ASA complaint lands on Andro Prime. This rule is kept in the root file because a missing pointer to it is a business-ending error. Full affiliate briefing rules in `/03_compliance/CONTEXT.md`.

### 4. Compliance overrides persuasion

If copy, product, sales, or marketing goals conflict with compliance, compliance wins. Full rule precedence and regulatory framework (ASA, EFSA, UK GDPR, CQC, MHRA, Consumer Rights Act) in `/03_compliance/CONTEXT.md`.

### 5. Canonical site, LPs, and app stay separated

Inside `/09_website-app/frontend`, preserve the distinction between `canonical-site`, `lp`, and `app`. Different purposes. Do not merge casually.

---

## Decision Priority

When priorities conflict, this order applies:

1. Compliance and regulatory safety
2. Operating-mode integrity (wellness/clinical split)
3. Product and source-of-truth consistency
4. Brand consistency
5. Technical maintainability
6. Marketing and conversion optimisation

---

## File Naming Conventions

- Markdown files: lowercase kebab-case (`phase0-marketing-plan.md`, `results-to-product-mapping.md`)
- Dated strategy decisions: `YYYY-MM-DD-topic.md`
- Product files: `kit-1-testosterone-health-check.md`, `daily-stack.md`
- CSS files: semantic names by layer and purpose, never `new.css` or `final.css`

---

## Working Style

- Structured, practical, maintainable. Prefer systems over one-off output.
- Keep work aligned to the workspace that owns it.
- Check existing source-of-truth docs before drafting new work.
- Prefer updating the correct source file over creating overlapping duplicates.
- Flag conflicts instead of silently guessing.

---

## Default Behaviour for Any Task

1. Identify the correct workspace (see Routing Table above)
2. Read that workspace's `CONTEXT.md`
3. For any copy, marketing, or claim-adjacent task: also read `/03_compliance/CONTEXT.md` (non-negotiable — see Guardrail 1)
4. Check relevant source-of-truth docs
5. Do the work within the workspace's rules
6. Keep output clean, reusable, and correctly named

**Always route first, then work.**

---

## Codebase RAG — graphify-out

Before searching for a file, symbol, or concept across this repo, consult the pre-built knowledge graph at `D:\Androprime_main\graphify-out\`:

- **`graph.json`** — full knowledge graph (nodes = files/symbols, edges = relationships). Query this first to locate relevant files before reading them.
- **`manifest.json`** — index of every file processed, with hashes. Use to confirm a file exists and find its path quickly.
- **`converted/`** — Markdown renderings of key strategy/financial docs, ready to read directly without parsing the source format.
- **`cache/semantic/`** — per-file semantic embeddings; skip unless doing vector similarity work.

**Workflow:** check `manifest.json` for the file path → read the relevant node in `graph.json` for relationships → read the actual source file. Do not grep the whole repo when the graph already maps it.

---

## Tripwire

If this file exceeds 150 lines, or if Claude starts missing compliance rules in output, stop and refactor. The file is currently lean by design — resist the urge to paste reference data, pricing tables, ICP tables, or detailed rule lists into this file. They belong in the relevant workspace's CONTEXT.md.
