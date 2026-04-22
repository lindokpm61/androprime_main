# Marketing — Context

**Read before any copy or campaign work:**

1. `positioning/product-marketing-context.md` — master context for all marketing skills. Read first, always.
2. `../04_products/icp-kit-supplement-alignment-april2026.md` — defines selling frames, hero claims, ingredient copy hooks, dashboard flow, and cross-sell triggers. Supersedes V7 product docs on all copy and UX decisions.
3. The relevant skill context file (see Skill Context Files table below).

**Owner workspace:** `06_marketing`
**Integration:** Copy produced here must comply with `/03_compliance/CONTEXT.md`. Product claims must match `/04_products/`. LP pages are built in `/09_website-app/frontend/lp/`. Canonical pages are in `/09_website-app/frontend/canonical-site/`. Email sequences are in `/09_website-app/frontend/email-templates/`.

This workspace governs acquisition, content, channels, campaigns, affiliates, paid media, SEO, and analytics strategy. The Phase 0 acquisition model is **affiliate-first, ads-second**: trust is borrowed from established voices before it is paid for through cold advertising.

---

## Directory Structure

```text
06_marketing/
├── master-plan/
│   ├── phase0-marketing-plan.md          ← Master marketing document for Phase 0. Read before campaign work.
│   └── phase0-acquisition-strategy.md    ← Affiliate programme execution detail and channel sequencing
├── positioning/
│   └── product-marketing-context.md      ← MASTER SKILL CONTEXT. Read before any skill file. Read first.
├── affiliates/
│   ├── CONTEXT.md                        ← Affiliate programme rules, commission structure, KPIs, compliance
│   ├── commission-structure.md           ← Rate card, code formats, payout rules
│   ├── influencer-programme.md           ← Influencer outreach templates, onboarding, content rules
│   ├── pt-programme.md                   ← PT outreach templates, onboarding, recommendation scripts
│   ├── influencer/                       ← Outreach tracker, kit sends log, content log
│   ├── pt-network/                       ← PT affiliate list, outreach status, codes issued
│   └── codes-and-tracking/               ← Master code registry; FirstPromoter config
├── analytics/
│   ├── attribution.md                    ← Attribution model and channel tagging rules
│   ├── cac-dashboard.md                  ← CAC tracking by channel
│   └── conversion-tracking.md            ← Event tracking setup and measurement plan
├── content/
│   └── copy-content-context.md           ← Skill context: copywriting, copy-editing, social-content, cold-email
├── paid-media/
│   └── paid-measurement-context.md       ← Skill context: paid-ads, ad-creative, ab-test-setup, analytics-tracking
└── seo-ai-search/
    ├── blog-ai-seo-strategy.md           ← Blog and GEO content strategy
    ├── keyword-clusters.md               ← Priority keyword clusters by funnel stage
    ├── robots-bot-access.md              ← AI crawler access rules (robots.txt configuration)
    └── seo-content-context.md            ← Skill context: seo-audit, ai-seo, site-architecture, schema-markup
```

---

## How to Work Here

### Writing any copy or campaign brief

1. Read `positioning/product-marketing-context.md` first — it is the master context for all marketing work.
2. Read `../04_products/icp-kit-supplement-alignment-april2026.md` — it defines the correct selling frame for every kit, supplement, and CTA. Copy that conflicts with it must be revised.
3. Identify the ICP, channel, and funnel stage before writing a single line. See Channel Map below.
4. Run the pub test before saving: would Keith say this to a friend in a pub?
5. Run the compliance checklist in `/03_compliance/CONTEXT.md` before the file is marked ready.

### Working on the affiliate programme

1. Read `affiliates/CONTEXT.md` first — it contains the commission structure, partner types, tracking setup, and compliance rules.
2. Influencer outreach templates and tracker live in `affiliates/influencer-programme.md` and `affiliates/influencer/`.
3. PT outreach templates and tracker live in `affiliates/pt-programme.md` and `affiliates/pt-network/`.
4. All codes are registered in `affiliates/codes-and-tracking/`. Do not issue a code without registering it there.
5. Brief every affiliate in writing before code issuance: no diagnostic claims, no TRT availability claims, no ashwagandha mentions. This is a compliance requirement — see Special Cases.

### Planning or updating paid media

1. Read `paid-media/paid-measurement-context.md` — it defines channel strategy, creative constraints, and measurement setup.
2. Paid traffic routes to `/lp/` variants, not the canonical site. See Special Cases.
3. No discount codes in cold Meta creative. Price must appear in at least one Google headline.
4. All ad creative must pass the compliance checklist in `/03_compliance/CONTEXT.md` before going live.

### SEO and content work

1. Read `seo-ai-search/seo-content-context.md` — it governs article structure, keyword targeting, schema, and AI-search optimisation.
2. Check `seo-ai-search/keyword-clusters.md` for priority clusters before writing a new brief.
3. Blog content belongs in the canonical site (`/09_website-app/frontend/canonical-site/`). LP content belongs in `/09_website-app/frontend/lp/`. Do not mix them.
4. All blog copy must pass the compliance checklist before publishing. Informational articles have different claim thresholds than product pages — when in doubt, apply the stricter rule.

### Analytics and measurement

1. All event tracking follows the plan in `analytics/conversion-tracking.md`.
2. CAC is tracked by channel in `analytics/cac-dashboard.md`. Update after each reporting period.
3. Attribution model is in `analytics/attribution.md`. Do not create parallel attribution logic in other workspaces.

---

## Skill Context Files

Read `positioning/product-marketing-context.md` before any of these. It is always first.

| Task | Skill context file | Skills covered |
| --- | --- | --- |
| Any marketing or copy task | `positioning/product-marketing-context.md` | All skills — master context |
| Copy, content, email, social | `content/copy-content-context.md` | copywriting, copy-editing, social-content, cold-email |
| Paid media, ad creative, measurement | `paid-media/paid-measurement-context.md` | paid-ads, ad-creative, ab-test-setup, analytics-tracking |
| SEO, AI-search, site architecture | `seo-ai-search/seo-content-context.md` | seo-audit, ai-seo, site-architecture, schema-markup, content-strategy |

---

## Channel Map

| Channel | Funnel stage | Primary ICP | Primary offer |
| --- | --- | --- | --- |
| PT affiliates | Awareness → consideration | ICP 2 (Optimiser) | Kit 2 or Kit 3 |
| Micro-influencers | Awareness | ICP 1 (Achiever), ICP 2 | Kit 1 or Kit 2 |
| Google search | Consideration → decision | ICP 1, ICP 3 | Kit 1 (branded + symptom terms) |
| Meta / Instagram | Awareness → consideration | ICP 1, ICP 2 | Kit 1 cold; Kit 2 retargeting |
| LinkedIn (Keith posts) | Awareness | ICP 1, ICP 4 | Brand; founding member |
| Reddit | Awareness | ICP 1 | Brand; trust-building only |
| Blog / GEO | Awareness → consideration | ICP 1, ICP 2, ICP 3 | Informational → kit CTAs |
| Email sequences | Conversion → retention | All ICPs | Supplement upsell; founding member; retest |

---

## Affiliate Commission Reference

Full detail in `affiliates/CONTEXT.md` and `affiliates/commission-structure.md`.

| Partner type | Client discount | Commission | Code format | Example |
| --- | --- | --- | --- | --- |
| Micro-influencer | None | 20% of kit sale | `[NAME]20` | `JAMES20` |
| PT affiliate | 15% off kit | 20% of kit sale | `PT[NAME]15` | `PTMARK15` |
| Customer referral | 10% off | £10 store credit | Auto-generated link | — |

**Tracking platform:** FirstPromoter (Stripe-native). Setup and code registry in `affiliates/codes-and-tracking/`.

---

## Special Cases

**`positioning/product-marketing-context.md` is always first:** Every marketing skill reads this file before its own skill context file. It contains the product overview, ICP profiles, selling logic, and cross-skill rules. Do not skip it.

**Affiliate-first acquisition model:** In Phase 0, affiliates (PTs and micro-influencers) are the primary acquisition channel before paid ads are scaled. This is by design: trust is borrowed from established voices to reduce CAC and build social proof. Do not invert this sequence without strategic justification.

**LP vs canonical site split:** Paid, affiliate, and retargeting traffic routes to reduced-navigation `/lp/` variants with a single CTA. Organic, branded, and direct traffic routes to the canonical site. These serve different purposes — do not merge them. Full rules in `/09_website-app/docs/lp-architecture.md`.

**Ashwagandha — affiliate compliance rule:** Ashwagandha KSM-66 is a silent ingredient in the Daily Stack. It must never be mentioned in affiliate briefs, influencer talking points, or any externally-facing content. Affiliates must be briefed in writing before code issuance that they may not make supplement efficacy claims beyond EFSA-approved language and may not mention ashwagandha by name. If an affiliate makes a public claim about it, the ASA complaint lands on Andro Prime. Full rules in `/03_compliance/CONTEXT.md`.

**TRT and clinical services:** Do not reference TRT, peptides, or clinical services as currently available in any campaign, ad, content, or affiliate brief. Founding member programme copy: "Be first when we launch TRT" — not "Join our TRT programme."

**Phase 0 supplement CTA gate:** Supplement cross-sell CTAs in any marketing context must follow the results-engine trigger rules in `04_products/CONTEXT.md`. Do not invent new supplement recommendation logic in marketing copy.

---

## Do Not Use This Workspace For

- Compliance sign-off or regulatory review (→ `/03_compliance`)
- Product threshold logic, biomarker rules, or results-engine routing (→ `/04_products`)
- Backend or API implementation (→ `/09_website-app`)
- Email sequence copy and build specifications (→ `/09_website-app/frontend/email-templates/`)
- Customer support or retention flow design unless the task is directly acquisition-linked (→ `/08_customer-journey`)
- Partner negotiation or lab evaluation (→ `/05_partners`)
