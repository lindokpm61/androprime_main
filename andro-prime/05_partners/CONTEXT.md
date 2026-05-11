# Partners — Context

**Source of truth:** `labs/lab-partner-rankings-addendum.md` — current lab shortlist and rankings. Supersedes the lab partner section of `04_products/kits/kit-1-launch-guide.md`.
**Owner workspace:** `05_partners`
**Integration:** Partner commercial facts (pricing, minimums, API constraints) that affect unit economics or product specs must be reflected in `04_products/` — make those changes there, not here. Engineering integration work belongs in `09_website-app/` once sandbox access is live.

This workspace evaluates and manages external partners: labs, supplement manufacturers, and future clinical partners. It tracks engagement status, commercial terms, negotiation progress, and known divergences from Andro Prime's operating assumptions.

---

## Directory Structure

```text
05_partners/
├── labs/
│   ├── lab-partner-rankings-addendum.md  ← Current shortlist and rankings. Read before any lab decision.
│   ├── lab-partner-comparison.md         ← Side-by-side comparison framework (fill as quotes come in)
│   ├── thriva/                           ← Active engagement — clear frontrunner
│   │   ├── CONTEXT.md                    ← Partner status, contacts, key commercial facts, divergences
│   │   ├── thriva-negotiation-log.md     ← Living doc: agreed, open, divergent, action items
│   │   ├── meetings/                     ← One file per call: YYYY-MM-DD-topic.md
│   │   └── correspondence/               ← Emails, quotes, proposals, API docs
│   ├── vitall/                           ← Backup option — outreach initiated
│   │   └── outreach-brief.md             ← Initial outreach brief and rationale
│   └── benchmark-only/                   ← Partners kept for comparison only. No active engagement.
├── manufacturers/                        ← Supplement manufacturer evaluation (not yet started)
└── future-clinical-partners/             ← Post-CQC DSP pharmacy and e-prescribing (not yet started)
```

---

## How to Work Here

### Evaluating a new partner

1. Read `labs/lab-partner-rankings-addendum.md` (for labs) before adding any new candidate — it defines the strategic screening criteria (no treatment arm, no conflict of interest).
2. Check whether the partner has a clinical or TRT service of their own. If so, they are a strategic liability. Do not engage. See Special Cases.
3. Create an outreach brief in the relevant category directory before first contact.
4. Once a quote or proposal is received, populate the relevant column in `labs/lab-partner-comparison.md`.

### Working with an active partner

1. Read the partner's own `CONTEXT.md` first — it records current status, contacts, key commercial facts, and known divergences.
2. Update `thriva-negotiation-log.md` (or equivalent) after every meeting or significant correspondence. This is a living document.
3. Record meeting notes in `meetings/YYYY-MM-DD-topic.md`. Record correspondence in `correspondence/` with a date prefix.
4. If a commercial fact changes a product assumption (pricing, minimums, panel composition), flag it and update `04_products/` accordingly. Do not bury product-relevant changes inside partner files.

### Escalating divergences from product assumptions

1. When a partner quote or constraint diverges from an Andro Prime assumption, record it immediately in the partner's negotiation log under a clearly labelled "Known Divergences" section.
2. Assess the impact: does it change unit economics, product pricing, kit panel composition, or gate timing? If yes, update `04_products/catalogue/product-catalogue-v7-1.md` and flag to Keith.
3. If the divergence affects the financial model, flag to `01_strategy/master-implementation-blueprint.md` section 3.
4. Do not silently absorb divergences into a negotiation log without flagging their downstream impact.

### Advancing a partner to active engagement

1. Create a dedicated directory under the relevant category (`labs/`, `manufacturers/`, `future-clinical-partners/`).
2. Create a `CONTEXT.md` in that directory documenting: partner name, status, contacts, key commercial facts, and known divergences from Andro Prime assumptions.
3. Create a negotiation log as a living document.
4. Create `meetings/` and `correspondence/` subdirectories.
5. Update this file's Directory Structure and Partner Status table below.

---

## Partner Status Reference

| Partner | Category | Status | Role |
| --- | --- | --- | --- |
| Thriva Solutions | Lab | **Ruled out** — minimum 200 tests/month incompatible with Phase 0 launch volumes | Historical meeting notes in `labs/thriva/`. API integration spec written but now obsolete. |
| Vitall | Lab | **Confirmed 2026-05-01** — panel confirmed (Active B12, hs-CRP, Albumin). Service agreement and sandbox credentials still pending. | UKAS ISO 15189, white-labels for GenderGP and TR;BE. Ben Starling supplied production shortCodes 2026-05-08: `andro-prime-hormone-check` (Kit 1), `andro-prime-energy-metabolism` (Kit 2), `andro-prime-combo-test` (Kit 3). |
| Forth Connect | Lab | Quote pending — Emily (Forth Connect) engaged | CE-marked kits, NHS lab partner, API integration available. Pricing from team pending. |
| Medichecks | Lab | **Ruled out — competitor** | Acquired Leger Clinic. Now operates direct TRT pipeline. Do not engage. |
| One Day Tests | Lab | Watch-only | Operates own TRT service. Strategic liability if they scale it. |
| Supplement Factory | Manufacturer | Not yet engaged | Primary candidate for Phase 0 MOQ order (Gate 0A). |
| Natures Aid | Manufacturer | Not yet engaged | Secondary candidate. |
| Arena Health | Manufacturer | Not yet engaged | Secondary candidate. |
| Pharmacierge | DSP Pharmacy | Post-CQC only | Clinical dispensing. Do not engage pre-CQC. |
| Healistic | DSP / e-prescribing | Post-CQC only | Combined DSP and e-prescribing option. Do not engage pre-CQC. |
| SignatureRx | E-prescribing | Post-CQC only | E-prescribing platform. Do not engage pre-CQC. |

---

---

## Special Cases

**Medichecks is a competitor, not a partner candidate:** Medichecks acquired Leger Clinic and now operates an integrated diagnostic-to-treatment TRT pipeline. Any white-label arrangement would feed customers into a direct competitor's treatment system. This is ruled out permanently. Do not revisit unless ownership structure changes.

**One Day Tests — watch only:** Operates its own TRT service. The Medichecks/Leger precedent shows the strategic risk. Track only — do not engage until this conflict is resolved.

**Thriva — ruled out (April 2026):** Required 200 tests/month minimum within 3 months — incompatible with Phase 0 launch volumes. Historical context in `labs/thriva/`. The API integration spec (`09_website-app/docs/thriva-integration-spec.md`) was built against Thriva's API and will need to be rebuilt for Vitall.

**Manufacturers — Gate 0A dependency:** Supplement manufacturer outreach has not started. No MOQ order should be placed until Gate 0A is met (25+ supplement pre-orders with deposits). When Gate 0A is hit, initiate outreach to Supplement Factory, Natures Aid, and Arena Health in parallel. Formulation specs are in `04_products/supplements/`.

**Post-CQC clinical partners:** Pharmacierge, Healistic, and SignatureRx are post-CQC only. Do not begin formal engagement until CQC application is filed. Any premature engagement that implies clinical services are being stood up is a regulatory risk.

---

## File Naming Convention

| Type | Pattern | Example |
| --- | --- | --- |
| Meeting notes | `YYYY-MM-DD-topic.md` | `2026-04-19-thriva-api-docs.md` |
| Outreach briefs | `outreach-brief.md` (in partner dir) | `vitall/outreach-brief.md` |
| Negotiation logs | `[partner]-negotiation-log.md` | `thriva-negotiation-log.md` |
| Benchmark-only files | `[partner]-benchmark.md` | `medichecks-benchmark.md` |

---

## Do Not Use This Workspace For

- Product messaging or copy (→ `/04_products` or `/06_marketing`)
- Engineering implementation beyond capturing partner API requirements (→ `/09_website-app` once sandbox is live)
- General strategy unless it is specifically partner-driven (→ `/01_strategy`)
- Compliance or data governance for partner relationships (→ `/03_compliance/lab-partner-data-governance/`)
- Post-CQC clinical partner decisions before CQC application is filed (→ `/11_clinical-plugin_post-cqc`)
