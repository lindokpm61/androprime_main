# Data Protection Impact Assessment — Phase 0 Operations

**Organisation:** Andro Prime (trading name)
**Assessment date:** April 2026
**Prepared by:** Keith Lindo (Data Controller)
**Clinical governance:** Dr Ewa Lindo (GP, GMC-registered)
**Review date:** October 2026 (or earlier if processing changes materially)

> **Change note — 2026-06-04 (material processing change):** Low-T routing moved from the founding-member list to **GP referral** (results-engine), and a **new purpose** was approved: storing a low-T result + segmenting + running a **consent-gated nurture programme** toward the future clinical service. Lawful basis = **Art 6(1)(a) consent + Art 9(2)(a) explicit consent**, approved by Keith 2026-06-04 (solicitor review deferred post-launch). See `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`. Sections 1, 2, 4, 5 updated below. Open flag: Customer.io receives a health-derived `low_testosterone` trait (see §4).

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
| Data processor | Vitall | Processes blood samples, performs lab analysis, returns results via API. Acts under Andro Prime's instruction. UKAS ISO 15189 accredited. |
| Data processor | Stripe | Payment processing. Does not receive health data. |
| Data processor | Supabase | Database hosting. Stores all account and health data. Encrypted at rest. |
| Data processor | Customer.io | Email delivery and CRM. Receives name, email, order data. **Testosterone-derived data:** as of 2026-06-04 the `low_testosterone` flag is sent to CIO ONLY after explicit nurture consent (`api/lowt-nurture/consent`); the raw testosterone value and the borderline flag are never sent. **Energy-marker traits** (`low_vitamin_d`, `low_b12`, `elevated_crp`, raw `crp_level`, `low_ferritin`) are still sent unconditionally at result-processing — a broader data-minimisation gap flagged for a separate decision (tied to the supplement-waitlist consent), not covered by the low-T nurture approval. UK GDPR transfer mechanism for any CIO transfer: Customer.io's DPA — which includes the EU SCCs + UK Addendum and is auto-incorporated into every customer contract (GB region) — plus Customer.io's certification under the UK Extension to the EU-US Data Privacy Framework. No separate IDTA needed (see §4/§5). |
| Clinical governance (pre-CQC) | Vitall (doctors) | Reviews all results, writes personalised reports, handles clinical escalations for abnormal results. Mandatory until Andro Prime obtains CQC registration. |

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
Vitall's clinical team (GPs) reviews results and writes report
    ↓
If abnormal: Vitall handles clinical escalation (contacts customer, recommends GP visit)
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
| Vitall | Sample data, results (retained per their own policy) | UK | At rest and in transit |

### Who has access to health data?

| Person/role | Access level | Justification |
|---|---|---|
| Keith Lindo (founder, data controller) | Full database access | System administration, support, business operations |
| Dr Ewa Lindo (clinical lead) | Results data for clinical review | Clinical oversight of results interpretation and escalation protocols |
| Vitall clinical team | Results they generate | Clinical governance obligation (pre-CQC) |
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

Explicit consent for health data processing is collected at the point of purchase via a mandatory consent checkbox. The consent text specifically references the collection, storage, and display of biomarker results, and the use of results to present supplement recommendations. Consent is recorded with timestamp in the database. Customers can withdraw consent at any time via email to privacy@andro-prime.com.

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
| **Health data transferred outside UK without safeguards** | Medium | Medium | Supabase data centre location to be confirmed as UK/EU. Customer.io is US-based: UK IDTA standard contractual clauses to be executed before launch. | Low (once SCCs in place) |
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
- Data processing agreements with all processors (Vitall, Stripe, Supabase, Customer.io)
- Data retention schedule documented in privacy policy
- Subject access request process documented (privacy@andro-prime.com, 30-day response)
- Clinical governance provided by Vitall's registered GPs (pre-CQC)
- Regular access review (quarterly)

### Outstanding actions before launch

| Action | Owner | Status |
|---|---|---|
| Register with ICO and obtain registration number | Keith | Pending |
| Confirm Supabase data centre location is UK or EU | Keith | Pending |
| Customer.io transfer mechanism — DPA (EU SCCs + UK Addendum) is auto-incorporated into the GB-region contract + Customer.io is DPF UK-Extension certified | Keith | Satisfied by standard contract; verify DPF cert current + keep a copy (optionally formally execute via legal@customer.io) |
| Execute data processing agreement with Vitall | Keith | Pending |
| Build explicit consent checkbox into checkout flow | Keith | Pending |
| Build separate explicit opt-in (Art 9(2)(a)) for low-T result storage + nurture, with stored consent record (text version + timestamp) | Keith | Pending — gates nurture activation |
| Confirm the Customer.io DPA + DPF UK-Extension cert cover the consent-gated `low_testosterone` transfer (it does, by default) and file the DPA copy | Keith | Largely satisfied — verification + documentation only, not a build blocker |
| Update privacy policy to describe the low-T nurture purpose + Art 6(1)(a)/9(2)(a) basis | Keith | Pending |
| Solicitor to confirm/amend the low-T nurture lawful basis post-launch (ClickUp `869d99kzh`) | Keith / solicitor | Deferred to post-launch (Keith interim-approved 2026-06-04) |
| Build data deletion workflow (manual process acceptable for launch) | Keith | Pending |
| Update privacy policy with ICO registration number | Keith | Pending |
| Confirm all biomarker panels exclude unstable postal markers | Keith / Ewa | In progress (panel builder) |

---

## 6. Sign-Off

This DPIA has been prepared based on the planned Phase 0 operating model. It should be reviewed and updated when:

- CQC registration is obtained (clinical governance transfers from Vitall to Andro Prime)
- New data processors are added
- New biomarker panels or product tiers are introduced
- A data breach or near-miss occurs
- The processing changes materially

| Role | Name | Date | Signature |
|---|---|---|---|
| Data controller | Keith Lindo | | |
| Clinical lead | Dr Ewa Lindo | | |
