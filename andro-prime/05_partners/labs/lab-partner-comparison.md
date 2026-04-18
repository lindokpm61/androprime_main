# Lab Partner Comparison Framework

**Last updated:** April 2026
**Purpose:** Side-by-side evaluation of lab partners on the criteria that determine whether Phase 0 unit economics work.

---

## How to use this document

Fill in each column as quotes and information come back from each partner. Where a value is unknown, mark it as "TBC" and note the date you expect an answer. The decision criteria at the bottom weight each factor so the comparison doesn't default to "whoever is cheapest."

---

## Comparison Table

### Pricing

| Factor | Thriva (ballpark from first meeting) | Vitall | Notes |
|---|---|---|---|
| **Kit 1 panel all-in** (Total T, SHBG, Free T, Albumin, FAI) | ~£60 (Tasso) / ~£46 est. (fingerprick) | TBC | Thriva figure is pre-quote ballpark. Formal quote pending panel builder submission. |
| **Kit 2 panel all-in** (Vit D, hs-CRP, Ferritin, Active B12) | TBC | TBC | Panel redesigned — magnesium removed, Active B12 added. |
| **Kit 3 panel all-in** (Kit 1 + Kit 2 combined) | TBC | TBC | Sophia indicated combining panels is cheaper than running separately. |
| **Clinical governance / doctor reporting** | ~£8-9/test (mandatory pre-CQC) | TBC | Thriva: removed once CQC obtained. Ask Vitall if they offer equivalent. |
| **Incremental biomarker cost** | ~£8 per marker added to existing panel | TBC | Thriva example: adding PSA to a panel. |
| **Kit assembly (Tasso)** | ~£32 | TBC | |
| **Kit assembly (fingerprick)** | ~£18 (est. £14 cheaper than Tasso) | TBC | |
| **Volume pricing at 200/month** | TBC (not discussed at ballpark stage) | TBC | Critical: this is the volume both partners need to be quoted at. |
| **Volume pricing at 500/month** | TBC | TBC | Post-CQC target when TRT monitoring kicks in. |

### Minimum Volumes

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **Minimum monthly volume** | 200 tests/month | TBC | Thriva: required within 3 months to justify free API integration. |
| **Consequence of missing minimum** | Unclear — may lose API engineering priority | TBC | Need to clarify with Sophia what happens if you're at 150 in month 3. |
| **Ramp-up flexibility** | 3 months to reach 200 | TBC | |

### API and Integration

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **API available** | Yes — public API with sandbox | TBC | Vitall: less documented B2B API capability. Key question. |
| **API cost** | Free (included in partnership) | TBC | |
| **Sandbox environment** | Yes — access promised, not yet received | TBC | |
| **Self-service or assisted integration** | Assisted (requires Thriva engineering) | TBC | Thriva: this is why they gate on 200/month volume. |
| **Integration timeline** | TBC | TBC | |
| **Results delivery format** | Via API to Andro Prime dashboard | TBC | Non-negotiable: results must display on our dashboard, not the lab's portal. |

### Biomarker Availability (Capillary Postal)

| Biomarker | Thriva | Vitall | Notes |
|---|---|---|---|
| Total Testosterone | Yes | TBC | |
| SHBG | Yes | TBC | |
| Free Testosterone (calculated) | Yes | TBC | |
| Albumin | Yes | TBC | |
| Free Androgen Index | Yes | TBC | |
| Vitamin D (25-OH) | TBC (likely yes) | TBC | |
| hs-CRP | TBC | TBC | Check if available on capillary or venous only. |
| Ferritin | TBC (likely yes) | TBC | Visible in Thriva panel builder. |
| Active B12 | TBC (likely yes) | TBC | Visible in Thriva panel builder. Capillary confirmed. |
| Magnesium | No — unstable in postal transit | TBC | Biological limitation, likely same for all labs. |
| HbA1c | Available (Sophia suggested it) | TBC | Potential Kit 2 addition for weight/metabolic pathway. |

### White-Labelling

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **Kit packaging branding** | Full white-label | TBC | |
| **Results interface branding** | Via API — results on our dashboard | TBC | |
| **Customer comms branding** | TBC | TBC | Does the lab ever contact the customer directly? |
| **Clinical escalation contact** | Thriva contacts customer directly for abnormal results (pre-CQC) | TBC | Important UX question: customer hears from a company they've never heard of. |

### Clinical Governance

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **Doctor reporting available** | Yes — mandatory pre-CQC | TBC | |
| **Cost** | ~£8-9/test | TBC | |
| **Removed post-CQC** | Yes | TBC | |
| **Escalation process** | Thriva GPs review results, call customer if abnormal, recommend GP visit | TBC | |
| **Personalised reports** | Yes — GP writes personalised report per test | TBC | |

### Contract and Terms

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **Minimum contract length** | TBC | TBC | Target: monthly rolling or 3-month initial. |
| **Exclusivity** | TBC | TBC | Non-negotiable: no exclusivity. |
| **Notice period** | TBC | TBC | |
| **Data processing agreement** | Needed — not yet executed | TBC | Required for GDPR compliance before data flows. |

### Turnaround

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **Kit delivery to customer** | TBC | TBC | Target: 2-3 days. |
| **Results turnaround (from sample receipt)** | TBC | TBC | Target: 48-72 hours. |
| **SLA documented** | TBC | TBC | |

### Track Record

| Factor | Thriva | Vitall | Notes |
|---|---|---|---|
| **Tests delivered** | 5M+ | TBC | |
| **Sample success rate** | 96.2% | TBC | |
| **B2B partners** | 700+ (LloydsPharmacy, Ted's Health) | GenderGP, TR;BE | |
| **UKAS accredited** | Yes (ISO 15189) | Yes | |

---

## Decision Criteria (weighted)

Not all factors are equal. Weight them based on what actually determines whether Phase 0 works.

| Criterion | Weight | Why |
|---|---|---|
| **Per-test cost (Kit 1)** | High | Directly determines whether retail pricing is competitive. If COGS exceeds £40-45, Kit 1 margin at any viable retail price is dangerously thin. |
| **API capability** | High | Without API results delivery, the entire conversion engine breaks. Non-negotiable. |
| **Clinical governance availability** | High | Mandatory pre-CQC. If a partner doesn't offer it, they're not viable until after CQC registration. |
| **Minimum volume flexibility** | High | 200/month in 3 months is aggressive for a startup. A partner with a lower or softer minimum significantly reduces early-stage risk. |
| **Biomarker availability (capillary)** | Medium | All Kit 1 markers confirmed at Thriva. Kit 2 panel needs confirming at both. |
| **White-label completeness** | Medium | Customer should never see the lab brand. Important for trust but not a dealbreaker if partially achievable. |
| **Turnaround time** | Medium | 48-72 hours is table stakes. Anything longer than 5 days is a UX problem. |
| **Contract flexibility** | Medium | No exclusivity. Short initial term. Ability to switch if needed. |
| **Track record and scale** | Low | Thriva wins this by default. Vitall is smaller but has relevant B2B clients. Both are UKAS accredited. |
| **Collection device options** | Low | Fingerprick vs Tasso is a cost decision, not a partner decision. Both likely offer both. |

---

## Decision Date

Target: formal decision by [DATE TBC — approximately 2-3 weeks after Vitall first meeting].

Do not commit to either partner until both formal quotes are received and compared using this framework.
