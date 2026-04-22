# Andro Prime

Andro Prime is a UK men's health business operating in two sequential modes under one customer-facing brand:

1. **Phase 0 — Wellness mode**
   - Non-regulated diagnostic kits
   - Supplement subscriptions
   - Founding member deposit funnel
   - Content, acquisition, and results-driven conversion engine

2. **Post-CQC — Clinical mode**
   - Regulated intake
   - Confirmatory testing
   - TRT subscription
   - Clinical monitoring and add-ons

**Phase 0 goal:** Make the wellness tier a self-sustaining profit centre that funds operations, validates PMF, and builds the pre-qualified patient pipeline for clinical — all before CQC registration is complete.

This repository is the **operating system for the business**, not just a website or code repository.

It contains strategy, brand, compliance, products, partners, marketing, sales, customer journey, website/app build, launch operations, and the post-CQC clinical plugin.

---

## The Founders

- **Keith Antony** — Founder. Personal brand is a product feature. Writes like he talks. Went through the exact problem the ICP faces.
- **Dr Ewa Lindo** — GP, Harley Street TRT-trained, GMC-registered prescriber. Clinical credibility anchor. Signs off all results report copy.

---

## Products at a Glance

### Diagnostic Kits (Non-regulated, Phase 0)

| Kit | Price | Biomarkers | COGS | Gross Margin |
| --- | ----- | ---------- | ---- | ----------- |
| Kit 1: Testosterone Health Check | £29 | Total T, SHBG, Free Androgen Index (FAI), Albumin, Free T | £17 | 41% |
| Kit 2: Energy & Recovery Check | £44 | Vit D, Active B12, hs-CRP, Ferritin | £22 | 50% |
| Kit 3: Hormone & Recovery Check | £69 | All 9 markers (Kit 1 + Kit 2 panel) | £35 | 49% |

Lab partner: Thriva Solutions (UKAS ISO 15189). Results delivered via Andro Prime branded dashboard — not the lab's portal.

### Supplement Subscriptions (Non-regulated, Gate 0A)

| Product | Price | COGS | Margin | Triggered by |
| ------- | ----- | ---- | ------ | ----------- |
| Daily Stack (sachet) | £34.95/mo | £13 | 63% | Low D (Kit 2/3), Low B12 (Kit 2/3), or normal T on Kit 1. Also secondary CTA for T < 12 (founding member) — honest framing only. |
| Joint & Recovery Collagen (powder) | £29.95/mo | £13 | 57% | Elevated hs-CRP (1–10 mg/L) on Kit 2 or Kit 3 AND joint symptoms confirmed. Not triggered without the joint symptoms qualifier. |
| Complete Men's Stack (bundle) | £54.95/mo | £26 | 47% | 2+ deficiencies on Kit 2 or Kit 3 |

**Gate 0A:** Do not place supplement MOQ order until 25+ pre-orders with deposits received. Gate is at Week 6.

**Daily Stack formulation (April 2026):** Zinc 30mg, Magnesium Glycinate 400mg, Vitamin D3 4,000 IU, Vitamin B12 (Methylcobalamin) 1,000mcg, Ashwagandha KSM-66 600mg. Ashwagandha is a silent ingredient — no approved EFSA claim — do not mention it in any copy, affiliate brief, or influencer talking points.

### Founding Member Deposit

- **Price:** £75 (fully refundable; applied as credit on TRT sign-up)
- **Trigger:** Kit 1 or Kit 3 result shows testosterone < 12 nmol/L
- **CQC trigger:** 40+ deposits received — begin CQC application in earnest

### Clinical Services (CQC Required — NOT live)

| Product | Price |
| ------- | ----- |
| TRT Subscription | £185/mo |
| Tadalafil Add-On | £15/mo |
| Anastrozole Add-On | £12/mo |
| Premium Blood Panel | £149 |
| Rx Peptide Therapy | £200–400/mo |

> **Do not produce any marketing copy, landing pages, or content that makes any claim about TRT, peptides, or clinical services being currently available.**

---

## Core Principle

Always route to the correct workspace first.

The structure of this repo exists to separate:

- strategic work
- brand and messaging
- compliance and governance
- product logic
- partner decisions
- marketing and acquisition
- conversion and lifecycle
- customer journey
- website/app implementation
- launch readiness
- post-CQC clinical operations

Do not treat this as one flat project.

---

## Top-Level Workspaces

- `/01_strategy` — business model, roadmap, financial planning, entity structure
- `/02_brand` — brand guidelines, voice, messaging, visual identity
- `/03_compliance` — privacy, claims, approvals, governance, deposits
- `/04_products` — kits, supplements, pricing, thresholds, results-engine logic
- `/05_partners` — labs, manufacturers, future clinical partners
- `/06_marketing` — campaigns, affiliates, content, AI/SEO, paid media, analytics
- `/07_sales` — funnel logic, lifecycle, CRM, email sequences, referral programme
- `/08_customer-journey` — pre-CQC and post-CQC journey, onboarding, support, retention
- `/09_website-app` — design system, frontend, backend, database, automations, deployment
- `/10_launch-ops` — implementation checklists, QA gates, dashboards, readiness reviews
- `/11_clinical-plugin_post-cqc` — regulated intake, consent, confirmatory testing, prescribing, monitoring, records governance

---

## Directory Structure

Key subdirectories. Each workspace has a `CONTEXT.md` — read it before working in that directory.

```text
andro-prime/
├── 01_strategy/
│   ├── entity-structure/
│   ├── financial-model/           ← Financial model (P&L, Months 1–12)
│   ├── roadmap/
│   └── competitive-landscape/     ← Competitor research snapshots; CONTEXT.md governs naming and focus
├── 02_brand/
│   ├── guidelines/          ← Brand voice, visual identity, positioning docs
│   └── assets/
│       ├── colours/
│       ├── icons/
│       ├── logos/
│       ├── templates/
│       └── typography/
├── 03_compliance/
│   ├── claims-and-labels/
│   ├── content-approval/
│   ├── deletion-policy/
│   ├── deposits/
│   ├── dpia/
│   ├── lab-partner-data-governance/
│   ├── privacy/
│   └── retention-policy/
├── 04_products/
│   └── pricing/
├── 05_partners/
│   ├── future-clinical-partners/
│   ├── labs/
│   │   ├── benchmark-only/
│   │   ├── forth/
│   │   ├── thriva/
│   │   └── vitall/
│   └── manufacturers/
├── 06_marketing/
│   ├── affiliates/
│   │   ├── influencer/          ← Outreach tracker, kit sends log, content log
│   │   ├── pt-network/          ← PT affiliate list, outreach status, codes issued
│   │   └── codes-and-tracking/  ← Master code registry; FirstPromoter config
│   ├── analytics/
│   ├── campaigns/
│   │   ├── launch/
│   │   ├── referral/
│   │   └── retargeting/
│   ├── content/
│   │   ├── blog/
│   │   ├── copy-content-context.md  ← Skill context: copywriting, email-sequence, social-content, cold-email
│   │   ├── creative-briefs/
│   │   ├── email/
│   │   ├── instagram/
│   │   ├── linkedin/
│   │   ├── reddit/
│   │   └── youtube-scripts/
│   ├── master-plan/
│   ├── paid-media/
│   │   ├── google-search/
│   │   ├── meta/
│   │   ├── paid-measurement-context.md  ← Skill context: paid-ads, ad-creative, ab-test-setup, analytics-tracking
│   │   ├── tracking/
│   │   └── youtube/
│   ├── positioning/
│   │   └── product-marketing-context.md  ← Master skill context: read before all marketing skill work
│   └── seo-ai-search/
│       ├── article-briefs/
│       ├── article-schema/
│       ├── faq-schema/
│       ├── organisation-schema/
│       ├── product-schema/
│       └── seo-content-context.md  ← Skill context: seo-audit, ai-seo, site-architecture, schema-markup
├── 07_sales/
│   ├── crm/
│   ├── email-sequences/
│   ├── growth-retention-context.md  ← Skill context: referral-program, free-tool-strategy, churn-prevention
│   ├── lifecycle/
│   ├── referral-programme/
│   └── sales-gtm-context.md  ← Skill context: revops, sales-enablement, launch-strategy, pricing-strategy
├── 08_customer-journey/
│   ├── onboarding/
│   ├── post-cqc/
│   ├── pre-cqc/
│   ├── retention/
│   └── support/
├── 09_website-app/
│   ├── automations/
│   │   ├── diagrams/
│   │   └── n8n/
│   ├── backend/
│   │   ├── api/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── webhooks/
│   ├── database/
│   │   ├── migrations/
│   │   ├── schema/
│   │   ├── seeds/
│   │   └── views/
│   ├── deployment/
│   │   ├── analytics/
│   │   ├── coolify/
│   │   ├── env/
│   │   └── monitoring/
│   ├── design/
│   │   ├── exports/
│   │   ├── figma/
│   │   ├── mockups/
│   │   ├── prototypes/
│   │   └── wireframes/
│   ├── docs/
│   │   ├── cro-context.md            ← Skill context: page-cro, signup-cro, onboarding-cro, form-cro
│   │   ├── lp-architecture.md        ← LP vs canonical page rules and decision framework
│   │   ├── lp-variant-specs.md       ← Page-by-page specs for all 5 LP variants
│   │   └── [other implementation docs]
│   └── frontend/
│       ├── app/
│       │   ├── account/
│       │   ├── auth/
│       │   ├── founding-member-status/
│       │   ├── results-dashboard/
│       │   └── subscriptions/
│       ├── assets/
│       ├── canonical-site/
│       │   ├── home/
│       │   ├── waitlist/
│       │   ├── test-selector/
│       │   ├── kits/
│       │   ├── supplements/
│       │   └── founding-member/
│       ├── components/
│       │   ├── commerce/
│       │   ├── lp/
│       │   ├── marketing/
│       │   ├── results-engine/
│       │   └── shared/
│       ├── email-templates/
│       │   ├── sequences/
│       │   └── transactional/
│       ├── lp/
│       │   ├── collagen/
│       │   ├── daily-stack/
│       │   ├── energy-recovery/
│       │   ├── foundations/
│       │   └── testosterone/
│       ├── scripts/
│       ├── seo-schema/
│       └── styles/
├── 10_launch-ops/
│   ├── dashboards/                ← KPI dashboard outputs
│   ├── implementation-checklists/
│   ├── qa/
│   └── weekly-reviews/            ← Weekly KPI review notes (REPORT_KPI_[WeekOf-YYYY-MM-DD].md)
└── 11_clinical-plugin_post-cqc/
    ├── confirmatory-testing/
    ├── consent/
    ├── intake/
    ├── monitoring/
    ├── prescribing/
    ├── records-governance/
    └── semble/
```

---

## Routing Table

| Task | Go To | Read First |
| ---- | ----- | ---------- |
| Strategic planning, sequencing, business decisions | `/01_strategy` | `CONTEXT.md` |
| Competitive intelligence, competitor monitoring | `/01_strategy/competitive-landscape` | `CONTEXT.md` |
| Financial model, P&L, scenario planning | `/01_strategy/financial-model` | `CONTEXT.md` |
| Brand voice, trust language, positioning, messaging | `/02_brand` | `CONTEXT.md` |
| Claims, privacy, approvals, wording risk, governance | `/03_compliance` | `CONTEXT.md` |
| Product specs, threshold logic, pricing, results rules | `/04_products` | `CONTEXT.md` then `icp-kit-supplement-alignment-april2026.md` |
| Lab or manufacturer evaluation | `/05_partners` | `CONTEXT.md` |
| Campaigns, content, LPs, SEO, affiliate plans | `/06_marketing` | `CONTEXT.md` |
| Funnel, lifecycle, conversion, CRM, sequences | `/07_sales` | `CONTEXT.md` |
| Onboarding, support, retention, flow design | `/08_customer-journey` | `CONTEXT.md` |
| Design system, page templates, CSS, frontend/backend, automations | `/09_website-app` | `CONTEXT.md` |
| Email sequences, transactional copy, lifecycle emails | `/09_website-app/frontend/email-templates` | `CONTEXT.md` |
| Weekly KPI reviews, performance dashboards, gate tracking | `/10_launch-ops` | `CONTEXT.md` |
| Launch punch lists, QA, go-live readiness | `/10_launch-ops` | `CONTEXT.md` |
| Post-CQC clinical process design | `/11_clinical-plugin_post-cqc` | `CONTEXT.md` |

---

## Skill Context Files

These files are read by AI marketing and CRO skills before they run. They are not workspace CONTEXT.md files — they are skill-specific operating docs with templates, channel rules, and copy patterns.

**Read order for any marketing or copy task:**
1. `06_marketing/positioning/product-marketing-context.md` — master context, read first
2. `04_products/icp-kit-supplement-alignment-april2026.md` — selling logic, ingredient claims, dashboard flow, cross-sell triggers
3. The relevant skill context file below

| Skill area | File | Skills |
| ---------- | ---- | ------ |
| Copy & content | `06_marketing/content/copy-content-context.md` | copywriting, copy-editing, email-sequence, social-content, cold-email |
| Email sequences (copy + build) | `09_website-app/frontend/email-templates/CONTEXT.md` | email-sequence |
| CRO & conversion | `09_website-app/docs/cro-context.md` | page-cro, signup-cro, onboarding-cro, form-cro, popup-cro |
| Paid media & measurement | `06_marketing/paid-media/paid-measurement-context.md` | paid-ads, ad-creative, ab-test-setup, analytics-tracking |
| SEO & content strategy | `06_marketing/seo-ai-search/seo-content-context.md` | seo-audit, ai-seo, site-architecture, schema-markup, content-strategy |
| Growth & retention | `07_sales/growth-retention-context.md` | referral-program, churn-prevention, free-tool-strategy |
| Sales, GTM & strategy | `07_sales/sales-gtm-context.md` | revops, sales-enablement, launch-strategy, pricing-strategy, marketing-psychology |

---

## Brand Voice

**Write like Keith talks. Not like a clinic brochure.**

Every piece of copy must pass this test: **Would Keith say this to a friend in a pub?** If not, rewrite it.

| Write This | Not This |
| ---------- | -------- |
| "Knackered all the time" | "Suboptimal energy levels" |
| "Your GP said normal. That's not the same as good." | "Testosterone deficiency misdiagnosis" |
| "Find out exactly why you're tired" | "Comprehensive biomarker optimisation" |
| "Real doctor. You'll actually speak to her." | "Access to qualified clinical professionals" |
| "5 minutes. No GP needed." | "Convenient remote diagnostic solution" |
| "This is what your blood is telling you" | "Personalised supplementation protocol" |
| "Sore for 3 days after a workout that used to take 1" | "Suboptimal recovery metrics post-exercise" |

**No em dashes in any published copy.** They add an editorial quality that works against the plain-speaking voice. Use a full stop to start a new short sentence (preferred), a comma if the clause is genuinely dependent, or a colon to introduce a list.

Good: "In plain English. Not a lab reference table."
Bad: "In plain English — not a lab reference table."

### Brand Pillars

1. **Data first** — every recommendation starts with a result, not a guess
2. **Founder-visible** — Keith and Ewa are product features, not footnotes
3. **Plain-speaking** — no clinical euphemisms, no wellness fluff
4. **Evidence-led** — EFSA claims, UKAS lab, GMC prescriber
5. **Anti-corporate** — smaller, more personal, more direct. Proud of it.

---

## ICP Quick Reference

| ICP | Age | Entry point | Core language |
| --- | --- | ----------- | ------------- |
| 1 — Symptomatic Achiever | 38–54 | Kit 1 → low T → founding member | "Not myself anymore." "GP said fine but I'm not." |
| 2 — Proactive Optimiser | 35–50 | Kit 2 → deficiencies → subscription | "Sore for 3 days." "Doing everything right." |
| 3 — Curious Maintainer | 40–65 | Kit 3 → supplement → retest | "Want to know where I stand." "Just want to be sure." |
| 4 — High-Performance Seeker | 35–55 | Future: peptide tier (post-CQC) | "Optimise everything." "I've already tried X." |

ICP 1 is the primary TRT pipeline. ICP 2 is the primary supplement pipeline. Kit 3 should be recommended wherever there is ambiguity — it has the highest margin and most supplement conversion pathways.

---

## Compliance Rules — Non-Negotiable

### Supplement copy
Only use EFSA-approved health claims:

| Ingredient | Approved claim |
| ---------- | -------------- |
| Zinc | "Contributes to the maintenance of normal testosterone levels" |
| Magnesium | "Contributes to the reduction of tiredness and fatigue" |
| Vitamin D | "Contributes to normal muscle function" |
| Vitamin C | "Contributes to normal collagen formation for the normal function of cartilage" |
| Vitamin B12 | "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function" |

Illegal: "Collagen heals your joints" (medicinal claim). Legal: "Vitamin C contributes to normal collagen formation for the normal function of cartilage."

**Ashwagandha — silent ingredient rule:** Ashwagandha KSM-66 is in the Daily Stack formulation. It has no approved EFSA health claim. Do not mention it in any copy, email, social post, affiliate brief, or influencer talking points. If an affiliate makes a claim about it, the ASA complaint lands on Andro Prime. Brief all partners in writing before code issuance.

**Collagen claims:** Never say "collagen heals your joints" or "reduces inflammation." Both are medicinal claims. Use the Vitamin C EFSA claim only.

**B12 claims:** Never say B12 improves mood or treats brain fog. Use only: "contributes to normal psychological function" and "contributes to normal energy-yielding metabolism."

**Kit 1 copy scope:** Kit 1 tests testosterone only. Do not frame it as explaining general fatigue or energy symptoms — that's Kit 2 and Kit 3 territory. "Find out if testosterone is the cause" not "find out why you're knackered."

**Founding member cross-sell rule:** Never trigger the founding member deposit CTA based on Kit 2 results alone. The deposit CTA requires a confirmed testosterone result (T < 12 nmol/L from Kit 1 or Kit 3). Never infer low T from energy or recovery markers.

**Retest framing:** "Find out how your levels have changed." Not "find out if the supplement cured you." Supplements support — they do not cure.

### Diagnostic kit copy
- Do not use the word "diagnose" or "diagnosis" anywhere
- Do not recommend any course of treatment based on results
- Acceptable: "Find out what your levels are" — not "We'll tell you if you have low testosterone"
- Results reports say "Your results indicate..." not "You have..."

### TRT / clinical services
- Do not mention TRT as currently available
- Founding member programme copy: "Be first when we launch TRT" — not "Join our TRT programme"
- No clinical claims whatsoever on any wellness-tier page

---

## Gate Decisions

| Gate | When | Criteria | Action |
| ---- | ---- | -------- | ------ |
| **Gate 0A** | Week 6 | 25+ supplement pre-orders with deposits | Place MOQ supplement inventory order (£4k–7k) |
| **Gate 0B** | Week 10 | 10%+ of Kit 2/3 buyers converting to supplements | Scale paid ads and content for Kit 2 and Kit 3 |
| **Gate 0C** | Month 4 | 200+ kits sold, 40+ subs, MRR > £1,500 | Begin CQC launch preparations in earnest |
| **CQC trigger** | Any point | 40+ founding member deposits received | File CQC application regardless of Gate 0 progress |

---

## Supplier & Platform Quick Reference

| Role | Supplier | Status |
| ---- | -------- | ------ |
| Lab partner (kits) | Thriva Solutions | Enquiry to be sent |
| Lab backup | Vitall | Backup option |
| Supplement manufacturer | Supplement Factory, Natures Aid, Arena Health | Enquiry to be sent |
| DSP Pharmacy (clinical) | Pharmacierge or Healistic | Post-CQC |
| E-prescribing | SignatureRx or Healistic | Post-CQC |
| Payment processor | Stripe | Active |
| Affiliate tracking | FirstPromoter (Stripe-native) | To be set up |
| Email / CRM | Customer.io (event-first, triggered by Stripe + Thriva webhooks) | To be set up |
| Frontend | Next.js — Docker container on VPS via Coolify, Cloudflare DNS | To be built |
| Database | Supabase (Postgres) | To be set up |

---

## Global Rules

### 1. Respect the wellness / clinical split

Do not blur the line between:

- Phase 0 wellness operations
- post-CQC regulated clinical operations

If a task risks crossing that boundary, stop and route to compliance and/or the post-CQC clinical workspace.

### 2. Compliance overrides persuasion

If copy, product, sales, or marketing goals conflict with compliance, compliance wins.

### 3. Do not invent clinical claims in Phase 0

Do not imply:

- diagnosis
- treatment availability
- treatment eligibility
- medical decisions by software
- prescribing availability

unless the post-CQC clinical workspace explicitly governs that task.

### 4. Keep canonical site, LPs, and app separated

Inside `/09_website-app/frontend`, preserve the distinction between:

- `canonical-site`
- `lp`
- `app`

These have different purposes and should not be merged casually.

### 5. Use source-of-truth documents before drafting new work

Check existing docs in the relevant workspace before writing new content or making structural changes.

### 6. Prefer updating the right source file instead of creating duplicates

Do not create overlapping versions of the same document without reason.

### 7. Keep naming predictable

Use lowercase kebab-case for markdown files and descriptive folder names.

---

## File Naming Conventions

### Markdown files

- use lowercase kebab-case
- examples:
  - `phase0-marketing-plan.md`
  - `results-to-product-mapping.md`
  - `frontend-standards.md`

### Strategy decisions

- `YYYY-MM-DD-topic.md` where dated
- otherwise `topic-name.md`

### Product files

- `kit-1-testosterone-health-check.md`
- `daily-stack.md`

### Website/app docs

- `design-system.md`
- `page-templates.md`
- `seo-schema-plan.md`

### CSS files

Use semantic names by layer and purpose, not generic names like `new.css` or `final.css`.

---

## Working Style

- Be structured, practical, and maintainable.
- Prefer systems over one-off output.
- Keep work aligned to the workspace that owns it.
- Flag conflicts instead of silently guessing.
- Keep outputs clean enough to become long-term source-of-truth documents.

---

## Decision Priority

If there is a conflict, use this order:

1. compliance and regulatory safety
2. operating-mode integrity
3. product/source-of-truth consistency
4. brand consistency
5. technical maintainability
6. marketing/conversion optimisation

---

## Default Behaviour

For any task:

1. identify the correct workspace
2. read that workspace's `CONTEXT.md`
3. check the relevant source-of-truth docs
4. do the work within that workspace's rules
5. keep the output clean, reusable, and correctly named

Always route first, then work.
