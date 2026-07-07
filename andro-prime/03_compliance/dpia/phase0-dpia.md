# Data Protection Impact Assessment — Phase 0 Operations

**Organisation:** Andro Prime Ltd (company no. 17185839, trading as Andro Prime) — sole data controller
**Assessment date:** April 2026
**Prepared by:** Keith Lindo (Data Controller)
**Clinical governance:** Dr Ewa Lindo (GP, GMC-registered)
**Review date:** October 2026 (or earlier if processing changes materially)

> **Change note — 2026-06-04 (material processing change):** Low-T routing moved from the founding-member list to **GP referral** (results-engine), and a **new purpose** was approved: storing a low-T result + segmenting + running a **consent-gated nurture programme** toward the future clinical service. Lawful basis = **Art 6(1)(a) consent + Art 9(2)(a) explicit consent**, approved by Keith 2026-06-04 (solicitor review deferred post-launch). See `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`. Sections 1, 2, 4, 5 updated below. Open flag: Customer.io receives a health-derived `low_testosterone` trait (see §4).

> **Change note — 2026-06-23 (consent capture built, at checkout):** The explicit Art 9(2)(a) consent for wellness health-data processing is now captured at the **point of purchase (checkout)** — a required checkbox in the kit checkout flow (`components/commerce/CheckoutDetailsForm.tsx`), enforced server-side in `app/api/checkout/kit/route.ts`, forwarded via Stripe metadata, and stamped on the `users` record by the Stripe webhook (`health_processing_consent_version` + `health_processing_consented_at`), version-locked (`HEALTH_PROCESSING_CONSENT_VERSION`). Approved **CA-018** (Ewa + Keith). **Design note:** an earlier draft this same day placed this consent behind the results dashboard (a post-login gate); that was reverted because gating already-paid results on consent breaches the "freely given" requirement. Consent now sits at the purchase decision (Art 6(1)(b) contract is the basis for showing results; Art 9(2)(a) consent is the special-category condition, given freely at checkout). §3 and §5 updated. The future-clinical-services opt-in (Half 2) is **NOT built** — held pending solicitor clearance on the pre-CQC recruiting question.

---

## 1. Describe the Processing

### What are we doing?

Andro Prime sells at-home blood test kits to male customers in the UK. Customers purchase a kit via our website, provide a capillary blood sample at home, and post it to our laboratory partner (Vitall) for analysis. Vitall processes the sample and returns biomarker results to Andro Prime via API. We display those results to the customer on a secure, authenticated dashboard.

Based on the results, our system presents supplement recommendations using logic tied to specific biomarker thresholds (e.g. low Vitamin D triggers a recommendation for our Daily Stack supplement). No prescribing, diagnosis, or clinical treatment is involved. Supplement recommendations are based on EFSA-approved health claims only.

Customers with testosterone results below 12 nmol/L are routed to a **GP referral** as the primary next step (updated 2026-06-04; previously the founding-member list). Separately, and only where the customer gives a **specific explicit opt-in**, we store the low-T result and run a **consent-gated nurture programme** (education + "we'll let you know") to keep them informed about our future clinical service when it launches (not yet available, pending CQC registration). No payment is taken at this stage. This nurture use is a new purpose for special-category data; lawful basis and conditions are recorded in `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`. The founding-member list itself has been taken down pending a decision on its own lawful basis.

### What data is involved?

| Data category | Specific data | UK GDPR classification |
|---|---|---|
| Identity | Full name, email, date of birth | Personal data |
| Health / biomarker results | Total testosterone, SHBG, Free T (calculated), Albumin, Vitamin D, hs-CRP, Ferritin, Active B12 (depending on kit purchased) | Special category data (Article 9) |
| Order data | Kit purchased, order date, payment method (last 4 digits only) | Personal data |
| Account activity | Dashboard interactions, supplement subscriptions | Personal data |
| Low-T nurture consent | Explicit opt-in flag + consent text version + timestamp; derived `low_testosterone` segment trait | Special category data (Article 9) — the trait reveals a health condition |
| Communications | Emails, support exchanges | Personal data |
| Website usage | Pages visited, device type, IP (anonymised) | Personal data (anonymised for analytics) |

### What is the lawful basis?

| Processing activity | Lawful basis | Condition for special category data |
|---|---|---|
| Collecting and storing biomarker results | Explicit consent (Article 6(1)(a)) | Explicit consent (Article 9(2)(a)) |
| Displaying results on dashboard | Explicit consent | Explicit consent |
| Presenting supplement recommendations based on results | Explicit consent | Explicit consent |
| Processing orders and payments | Contract (Article 6(1)(b)) | N/A — not special category |
| Sending transactional emails | Contract | N/A |
| Marketing emails | Consent (opt-in) | N/A |
| **Low-T result storage + segment + nurture toward future clinical service** (new purpose, 2026-06-04) | **Consent (Article 6(1)(a))** | **Explicit consent (Article 9(2)(a))** — separate, un-bundled, un-pre-ticked opt-in; nurture fires only on this consent |
| Founding-member list (taken down 2026-06-04; dormant pending its own lawful-basis decision) | Consent (Article 6(1)(a)) | N/A — no special category data; no payment data |
| Website analytics | Legitimate interests (Article 6(1)(f)) | N/A — anonymised |

### Who is involved?

| Role | Entity | Responsibility |
|---|---|---|
| Data controller | Andro Prime | Determines purposes and means of processing. Collects consent. Stores and displays results. Applies supplement routing logic. |
| Separate (independent) data controller | Vitall (Healthy Human Labs Ltd) | Provides the Testing Services as an independent controller under the executed controller-to-controller services agreement (signed 2026-06-02): kit fulfilment, laboratory coordination, sample analysis, result generation and reporting via API. UKAS ISO 15189 accredited. Not a processor acting on Andro Prime's instruction. |
| Data processor | Stripe | Payment processing. Does not receive health data. |
| Data processor | Supabase | Database hosting. Stores all account and health data. Encrypted at rest. |
| Data processor | Customer.io | Email delivery and CRM. Receives name, email, order data. **Testosterone-derived data:** as of 2026-06-04 the `low_testosterone` flag is sent to CIO ONLY after explicit nurture consent (`api/lowt-nurture/consent`); the raw testosterone value and the borderline flag are never sent. **Energy-marker traits** (`low_vitamin_d`, `low_b12`, `elevated_crp`, raw `crp_level`, `low_ferritin`) were sent unconditionally at result-processing — a broader data-minimisation gap flagged for a separate decision (tied to the supplement-waitlist consent), not covered by the low-T nurture approval. **2026-07-07: all five energy-marker traits are now gated in code on the CA-018 health-processing consent (fail-closed); raw `crp_level` is kept but gated (seq-03a's hs-CRP >10 email branching compares the numeric value). Pending deploy; gate-vs-documented-lawful-basis remains an open Keith + Ewa decision — this implements the conservative default.** UK GDPR transfer mechanism for any CIO transfer: Customer.io's DPA — which includes the EU SCCs + UK Addendum and is auto-incorporated into every customer contract (GB region) — plus Customer.io's certification under the UK Extension to the EU-US Data Privacy Framework. No separate IDTA needed (see §4/§5). |
| Laboratory validation + critical-result escalation (pre-CQC) | Vitall's UKAS-accredited laboratory | Performs analytical validation and quality assurance and, per its clinical-pathology protocol, flags/escalates critical or abnormal results. Andro Prime does NOT clinically interpret individual results and produces no personalised clinical reports pre-CQC; every result carries a disclaimer directing the customer to a GP/healthcare professional. |

---

## 2. Data Flow Map

```
Customer purchases kit on andro-prime.com
    ↓
Stripe processes payment (card data only, no health data)
    ↓
Andro Prime creates order record in Supabase
    ↓
API call triggers Vitall to assemble and ship kit to customer
    ↓
Customer collects sample at home (capillary finger-prick or Autodraw)
    ↓
Customer posts sample to Vitall's UKAS-accredited lab
    ↓
Vitall lab analyses sample
    ↓
Vitall's UKAS-accredited laboratory validates the results (analytical QC)
    ↓
If a result is critical/abnormal: Vitall's laboratory escalates per its clinical-pathology protocol; Andro Prime results carry a disclaimer directing the customer to their GP
    ↓
Results returned to Andro Prime via API
    ↓
Andro Prime stores results in Supabase (encrypted at rest)
    ↓
Customer logs into Andro Prime dashboard to view results
    ↓
Dashboard applies routing logic:
    - Low T (<12 nmol/L): GP referral CTA (clinical signpost) + optional explicit
      opt-in to store result and join the consent-gated nurture programme
    - Deficiencies detected: Supplement recommendation (EFSA claims only)
    - Normal ranges: Retest recommendation (6-12 months)
    ↓
Customer.io sends results notification email (link to dashboard, no results in email body).
    Note: a derived `low_testosterone` segment trait is sent to Customer.io for nurture
    orchestration — this is health-derived special-category data; see §4 risk row and the
    outstanding actions in §5 before nurture activation.
```

### Where is data stored?

| System | Data held | Location | Encryption |
|---|---|---|---|
| Supabase (Postgres) | All account data, biomarker results, order history | EU/UK data centre (to be confirmed during setup) | At rest and in transit |
| Stripe | Payment data (card details) | Stripe infrastructure (PCI DSS compliant) | At rest and in transit |
| Customer.io | Name, email, order data, subscription status, derived `low_testosterone` segment trait (special category) | EU data centre (Belgium); US transfers covered by Customer.io DPF (UK Extension) + DPA SCCs/UK Addendum | In transit |
| Vitall (separate controller) | Sample data, results (retained per their own policy) | UK | At rest and in transit |

### Who has access to health data?

| Person/role | Access level | Justification |
|---|---|---|
| Keith Lindo (founder, data controller) | Full database access | System administration, support, business operations |
| Dr Ewa Lindo (clinical lead) | Access to results data for system/threshold governance | Signs off the recommendation logic, thresholds and escalation rules (the system), not bespoke per-customer interpretations |
| Vitall laboratory | Sample and results it generates | Independent controller for the Testing Service; performs analytical validation/QC and critical-result escalation |
| Supabase platform | Infrastructure access (encrypted) | Database hosting provider |

No other staff, contractors, affiliates, or third parties have access to biomarker results.

---

## 3. Necessity and Proportionality

### Is this processing necessary?

Yes. The core service requires collecting a blood sample, analysing it, and returning results to the customer. This cannot be achieved without processing health data.

### Is the data proportionate?

Yes. We test only the biomarkers relevant to each kit tier. We do not collect broader health histories, medication lists, or lifestyle data beyond what is needed for the results dashboard.

### Could we achieve the same purpose with less data?

No. Biomarker results are the product. The customer is paying specifically to receive this data about themselves.

### How do we ensure data quality?

Lab analysis is performed by a UKAS ISO 15189 accredited laboratory (Vitall). All biomarkers offered have passed Bland-Altman analysis and sample stability testing for postal transit viability. Biomarkers that are unstable in postal conditions (magnesium, calcium, potassium) are excluded from our panels.

### How do we obtain consent?

Explicit consent for health data processing is collected at the **point of purchase (checkout)**, via a required consent checkbox in the kit checkout flow shown before payment. It is enforced server-side (the checkout cannot complete without consent on record or freshly given) and forwarded through Stripe metadata, then stamped on the `users` record by the Stripe webhook when the order is created. The consent text references the processing of the customer's health information (their test results and the answers they provide) to deliver the test service and display results. Consent is recorded with the exact wording version (`HEALTH_PROCESSING_CONSENT_VERSION`) and a timestamp (Art 7(1) accountability). It is **not** a gate in front of already-paid results (which would breach "freely given"); a returning customer who already consented is not re-asked. Customers can withdraw consent at any time via email to privacy@andro-prime.com.

---

## 4. Risk Assessment

### Identified risks and mitigations

| Risk | Likelihood | Severity | Mitigation | Residual risk |
|---|---|---|---|---|
| **Data breach exposing health results** | Low | High | Encryption at rest and in transit. Database access restricted to two named individuals. Supabase hosted in certified data centres. Regular access reviews. | Low |
| **Vitall API transmission intercepted** | Very low | High | API calls over TLS 1.2+. Vitall is UKAS accredited with enterprise security standards. | Very low |
| **Incorrect results displayed to wrong customer** | Very low | High | Each result is linked to a unique order ID and customer account. Vitall's sample-matching process uses unique kit identifiers. | Very low |
| **Customer cannot withdraw consent or delete data** | Low | Medium | Deletion process documented. Email request to privacy@andro-prime.com triggers manual deletion within 30 days. Automated deletion to be built post-launch. | Low |
| **Supplement recommendation perceived as medical advice** | Medium | Medium | All recommendations use EFSA-approved claims only. No diagnostic language. Results reports say "Your results indicate..." not "You have..." Dashboard includes disclaimer that results are not a substitute for medical advice. | Low |
| **Third-party processor breach (Supabase, Customer.io)** | Low | High | Data processing agreements in place with all processors. Customer.io does not receive health data. Supabase encryption and access controls. Breach notification clause in all DPAs (72 hours). | Low |
| **Health data transferred outside UK without safeguards** | Medium | Medium | Supabase data centre location to be confirmed as UK/EU. Customer.io (US) transfer is covered by its DPA (EU SCCs + UK Addendum, auto-incorporated into the GB-region contract) + Customer.io's DPF UK-Extension certification — **no separate IDTA needed** (verify DPF cert current, keep a DPA copy). See the dedicated `low_testosterone` transfer row below and §5. | Low |
| **Abnormal result not escalated** | Low | Very high | Vitall's UKAS-accredited laboratories perform analytical validation and quality assurance; the laboratory clinical team escalates critical or abnormal results directly. Andro Prime does not clinically review individual results; every result carries a disclaimer directing the customer to a healthcare professional. Post-CQC, clinical oversight transfers to Dr Ewa Lindo. See `clinical-governance-position.md`. | Very low |
| **Automated supplement routing seen as profiling under Article 22** | Low | Medium | Routing presents recommendations only. Customer is not auto-enrolled in any subscription. No purchase is made without explicit customer action. Recommendations do not produce legal or similarly significant effects. | Low |
| **Health-derived `low_testosterone` trait sent to Customer.io (US processor) without adequate basis/safeguards** | Low | High | (a) The trait is now sent ONLY after a separate explicit Art 9(2)(a) opt-in — `buildCioTraits()` no longer emits it at result-processing (code commit `7ad2c8f`); consent is the Art 9 condition (CA-014). (b) Transfer mechanism: Customer.io's DPA (EU SCCs + UK Addendum, auto-incorporated into the GB-region contract) + their UK-Extension DPF certification — no separate IDTA needed. Residual: verify the DPF cert is current and keep a copy of the DPA (optionally formally execute via legal@customer.io). Solicitor to confirm post-launch. | Low |
| **Low-T nurture seen as pipeline-building for a regulated service pre-CQC (substance over form)** | Medium | High | Content constrained to education + "we'll let you know" (Ewa, 2026-06-04); no TRT/treatment promises, no supplement claims for low T; every email through compliance-preflight + Ewa. No implication a clinical service is available. | Low |

---

## 5. Measures to Reduce Risk

### Technical measures
- All data encrypted at rest (Supabase) and in transit (TLS 1.2+)
- Database access restricted to Keith Lindo and Dr Ewa Lindo only
- Passwords hashed (not stored in plaintext)
- No health data passed to analytics tools
- No health data included in email bodies (notification links to dashboard only)
- IP addresses anonymised before analytics storage

### Organisational measures
- Privacy policy published and written in plain English
- Explicit consent collected at point of purchase with timestamp
- Data processing agreements with our processors (Stripe, Supabase, Customer.io); controller-to-controller services agreement with Vitall (separate, independent controller — no Article 28 processor DPA applies)
- Data retention schedule documented in privacy policy
- Subject access request process documented (privacy@andro-prime.com, 30-day response)
- Laboratory analytical validation and critical-result escalation provided by Vitall's UKAS-accredited laboratory (pre-CQC); Andro Prime does not clinically interpret individual results
- Regular access review (quarterly)

### Outstanding actions before launch

| Action | Owner | Status |
|---|---|---|
| Register with ICO and obtain registration number | Keith | Done 2026-06-12 — no. ZC172852 (Andro Prime Ltd) |
| Confirm Supabase data centre location is UK or EU | Keith | Pending |
| Customer.io transfer mechanism — DPA (EU SCCs + UK Addendum) is auto-incorporated into the GB-region contract + Customer.io is DPF UK-Extension certified | Keith | Satisfied by standard contract; verify DPF cert current + keep a copy (optionally formally execute via legal@customer.io) |
| Controller-to-controller services agreement with Vitall (separate controllers; no Art 28 processor DPA) | Keith | Done — executed 2026-06-02 |
| Build explicit consent checkbox for health-data processing | Keith | Built 2026-06-23 (Half 1, CA-018) at **checkout** (`CheckoutDetailsForm` → `/api/checkout/kit` → Stripe metadata → webhook stamp); prod migration applied; **deploy pending** |
| Gate energy-marker CIO traits (`low_vitamin_d`, `low_b12`, `elevated_crp`, `crp_level`, `low_ferritin`) on CA-018 consent — the §4 data-minimisation gap | Keith | Implemented in code 2026-07-07 (fail-closed; `crp_level` kept but gated for seq-03a branching) — **pending deploy + verification**; must deploy with/after the CA-018 checkout deploy. Gate-vs-lawful-basis decision stays open (Keith + Ewa) |
| Backfill: pre-existing customers (and guest accounts created before this checkbox) hold no `health_processing_consent_version`. New design captures consent at their *next* purchase; decide whether any retained pre-existing results need a separate consent touch | Keith | Pending |
| Solicitor to confirm the framing: Art 6(1)(b) contract for showing results + Art 9(2)(a) explicit consent captured at checkout (freely given at the purchase decision) | Keith / solicitor | Deferred — overlaps `869d99kzh`; Keith approved the checkout placement 2026-06-23 |
| Build separate explicit opt-in (Art 9(2)(a)) for low-T result storage + nurture, with stored consent record (text version + timestamp) | Keith | Pending — gates nurture activation |
| Confirm the Customer.io DPA + DPF UK-Extension cert cover the consent-gated `low_testosterone` transfer (it does, by default) and file the DPA copy | Keith | Largely satisfied — verification + documentation only, not a build blocker |
| Update privacy policy to describe the low-T nurture purpose + Art 6(1)(a)/9(2)(a) basis | Keith | Pending |
| Solicitor to confirm/amend the low-T nurture lawful basis post-launch (ClickUp `869d99kzh`) | Keith / solicitor | Deferred to post-launch (Keith interim-approved 2026-06-04) |
| Build data deletion workflow (manual process acceptable for launch) | Keith | Pending |
| Update privacy policy with ICO registration number | Keith | Done 2026-06-12 — ZC172852 in privacy-policy.md + live privacy page |
| Confirm all biomarker panels exclude unstable postal markers | Keith / Ewa | In progress (panel builder) |

---

## 6. Sign-Off

This DPIA has been prepared based on the planned Phase 0 operating model. It should be reviewed and updated when:

- CQC registration is obtained (Andro Prime takes on clinical interpretation/oversight; pre-CQC there is none beyond Vitall's laboratory analytical validation and critical-result escalation)
- New data processors are added
- New biomarker panels or product tiers are introduced
- A data breach or near-miss occurs
- The processing changes materially

| Role | Name | Date | Signature |
|---|---|---|---|
| Data controller | Keith Lindo | | |
| Clinical lead | Dr Ewa Lindo | | |
