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
│   ├── vitall/                           ← CONFIRMED lab partner. Agreement executed 2026-06-02; integration E2E-proven.
│   │   ├── CONTEXT.md                    ← Partner status, contacts, commercial terms, competitor-conflict flag
│   │   ├── vitall-negotiation-log.md     ← Living doc: current correspondence state, what's owed, E2E test log
│   │   ├── contacts.md                   ← Canonical contact record (Ben Starling) — do not scatter contacts elsewhere
│   │   ├── services-agreement-2026-06-02-full-text.md · signed-services-agreement-2026-06-02.md
│   │   ├── vitall-api-assessment.md · outreach-brief.md
│   │   └── correspondence/               ← Emails, quotes, proposals, API docs (YYYY-MM-DD-topic.md)
│   ├── thriva/                           ← RULED OUT (volume). Historical: CONTEXT.md · thriva-negotiation-log.md · meetings/ · correspondence/
│   └── forth/                            ← RULED OUT 2026-05-01. correspondence/ only (no CONTEXT / negotiation-log).
└── manufacturers/                        ← Outreach STARTED (2026-06-26 stock-first pivot) — NOT "not yet started".
    ├── supplement-manufacturer-shortlist.md · outreach-tracker.md
    └── vita-manufacture/ · synergy-biologics/ · nutribl/ · natures-aid/   (each: outreach-brief.md)

(No `benchmark-only/` or `future-clinical-partners/` directory exists yet — both were listed here but are not on disk. `future-clinical-partners/` is where post-CQC DSP/e-prescribing partners will go when that work starts.)
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

### Corresponding with lab / supplier / middleman partners

**Give them only the operational spec — strip everything strategic.** A partner email is a vendor brief: the marker list, sample type, volumes, dispatch/API/SLA questions, COGS request. Nothing else.

Do **NOT** include: demand / search-volume research, competitive positioning (e.g. the Medichecks panel-breadth gap), which markers we treat as our differentiator (ApoB / homocysteine / insulin framing), retail pricing logic, target-ICP reasoning, product-roadmap narrative, or clinical rationale. Ben (Vitall) is a middleman *and now a competitor* — anything we hand him about our reasoning he can reuse or pass on. The marker list is unavoidable (he must quote it); the strategy behind it is not. Non-proprietary operational questions ("is glucose stable on a posted dried-blood-spot") are fine — they get a better answer and aren't IP.

**Cadence discipline (Ben):** he averages ~1 week to reply, works ~4 hours, then goes quiet another week — so each round trip costs a week+. Design every email as a single-pass fill-in: bundle viability + per-marker cost so one reply closes it; pre-empt the obvious follow-up ("if it can't run on capillary, just flag it, I'll adjust"); make any call optional not default; keep our own timeline pressure vague.

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
| Vitall | Lab | **CONFIRMED + LIVE.** Agreement **executed (bilaterally signed) 2026-06-02**; integration **E2E-proven** (live purchase → dispatch → results, 2026-06-25). | UKAS ISO 15189. Sync Pro API (£0 setup/monthly, per-kit COGS only). Legal entity Healthy Human Labs Ltd. ⚠️ **Also a DTC competitor** — see the competitor-conflict flag below + `01_strategy/STATE.md`. Full detail: `labs/vitall/CONTEXT.md`. |
| Thriva Solutions | Lab | **Ruled out (Apr 2026)** — declined us on volume (200 tests/mo min); door open at scale (Sophia Schreiber). | Historical notes in `labs/thriva/`. The old Thriva API integration spec was rebuilt for Vitall. |
| Forth Connect | Lab | **Ruled out 2026-05-01** — £7,270 setup + £99/mo vs Vitall's £0; Vitall API fit-for-purpose. Emily McCann declined by email. | Note: in Attio, ForthConnect (forthconnect.io) is classified as a **supplement manufacturer / Supplier**, not the lab. |
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

**Vitall — confirmed partner AND a direct competitor (channel conflict):** Vitall is our executed, E2E-proven white-label lab — *and* runs a DTC men's-health storefront that overlaps our kits. The refined read: Vitall is really a B2B picks-and-shovels infra provider (tiny organic footprint, partner-branded clone subdomains = the Vitall Sync model), so the threat is not demand capture but that they could power a better-funded competitor on the same rails and act as **data landlord** (they hold independent-controller status over results data). Implications for partner work here: (1) apply the middleman-correspondence rule above strictly; (2) **persist our own full results payload** on every order (disintermediation + exit safeguard — on exit Vitall retains the data and we can't compel deletion); (3) disintermediation targets are the sub-processor labs Vitall named — **TDL** (prime), Inuvi, Alderley — but the move is volume-gated, so we stay on Vitall to launch. Strategy + decisions: `01_strategy/STATE.md` (Vitall competitor pivot).

**Medichecks is a competitor, not a partner candidate:** Medichecks acquired Leger Clinic and now operates an integrated diagnostic-to-treatment TRT pipeline. Any white-label arrangement would feed customers into a direct competitor's treatment system. This is ruled out permanently. Do not revisit unless ownership structure changes.

**One Day Tests — watch only:** Operates its own TRT service. The Medichecks/Leger precedent shows the strategic risk. Track only — do not engage until this conflict is resolved.

**Thriva — ruled out (April 2026):** Required 200 tests/month minimum within 3 months — incompatible with Phase 0 launch volumes. Historical context in `labs/thriva/`. The API integration spec (`09_website-app/docs/thriva-integration-spec.md`) was built against Thriva's API and will need to be rebuilt for Vitall.

**Manufacturers — Gate 0A dependency:** No supplement MOQ order until Gate 0A is met (25+ supplement pre-orders; the deposit mechanic was shelved 2026-05-08 — see `04_products/CONTEXT.md`). ⚠️ **Status drift (audit flag 2026-07-02):** manufacturer outreach has in fact **started** under the 2026-06-26 stock-first pivot (`manufacturers/outreach-tracker.md`; candidate dirs `vita-manufacture/`, `synergy-biologics/`, `nutribl/`, `natures-aid/`). This supersedes the old "not started / Supplement Factory + Arena Health" framing; the Partner Status table above is stale on manufacturers and needs reconciling against the tracker. Formulation specs: `04_products/supplements/`.

**Post-CQC clinical partners:** Pharmacierge, Healistic, and SignatureRx are post-CQC only. Do not begin formal engagement until CQC application is filed. Any premature engagement that implies clinical services are being stood up is a regulatory risk.

---

## Partner CRM — Attio

Attio (workspace "Andro Prime") is the **partner CRM** — PTs, affiliates, gyms, AND lab/supplier partners. End customers stay in Customer.io / Stripe and **never** go into Attio.

- **Access via the Attio REST API directly (curl), NOT an MCP.** Key = `ATTIO_API_KEY` in the project-root `.env` (gitignored, tooling scope — separate from the app's `.env.local`); base `https://api.attio.com/v2/`, Bearer auth. Never echo the secret or paste it into notes. Rationale: an always-resident MCP burns schema/context every session regardless of use. **Do not add Attio to `.mcp.json`.**
- **Schema built to v2.3** (2026-05-18). Object model: People = individual partners; Deals = engagement pipeline; Companies = gyms + lab/supplier orgs. Canonical spec: `../06_marketing/affiliates/attio-config-spec-v2.md` (the v1 spec is stale — do not build from it).
- FirstPromoter is the system of record for sales/commission/payout; Attio only mirrors rollups (join key = the affiliate code). See `../06_marketing/affiliates/codes-and-tracking/firstpromoter-config.md`.
- Lab/supplier classification in Attio: Vitall, Forth, Thriva = Lab partner; ForthConnect (forthconnect.io) = Supplier (supplement manufacturer). Attio must be added to the data-processor map (compliance, ClickUp tasks 04/05). Partner-brief approval state (CA-001…007) lives with `06_marketing/affiliates` + `03_compliance/content-approval`.

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
