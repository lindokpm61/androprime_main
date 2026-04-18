# Data Protection Impact Assessment — Phase 0 Operations

**Organisation:** Andro Prime (trading name)
**Assessment date:** April 2026
**Prepared by:** Keith Lindo (Data Controller)
**Clinical governance:** Dr Ewa Lindo (GP, GMC-registered)
**Review date:** October 2026 (or earlier if processing changes materially)

---

## 1. Describe the Processing

### What are we doing?

Andro Prime sells at-home blood test kits to male customers in the UK. Customers purchase a kit via our website, provide a capillary blood sample at home, and post it to our laboratory partner (Thriva Solutions) for analysis. Thriva processes the sample and returns biomarker results to Andro Prime via API. We display those results to the customer on a secure, authenticated dashboard.

Based on the results, our system presents supplement recommendations using logic tied to specific biomarker thresholds (e.g. low Vitamin D triggers a recommendation for our Daily Stack supplement). No prescribing, diagnosis, or clinical treatment is involved. Supplement recommendations are based on EFSA-approved health claims only.

Customers with testosterone results below 12 nmol/L are offered the option to place a refundable founding member deposit for a future TRT service (not yet available, pending CQC registration).

### What data is involved?

| Data category | Specific data | UK GDPR classification |
|---|---|---|
| Identity | Full name, email, date of birth | Personal data |
| Health / biomarker results | Total testosterone, SHBG, Free T (calculated), Albumin, Vitamin D, hs-CRP, Ferritin, Active B12 (depending on kit purchased) | Special category data (Article 9) |
| Order data | Kit purchased, order date, payment method (last 4 digits only) | Personal data |
| Account activity | Dashboard interactions, supplement subscriptions, founding member status | Personal data |
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
| Website analytics | Legitimate interests (Article 6(1)(f)) | N/A — anonymised |

### Who is involved?

| Role | Entity | Responsibility |
|---|---|---|
| Data controller | Andro Prime | Determines purposes and means of processing. Collects consent. Stores and displays results. Applies supplement routing logic. |
| Data processor | Thriva Solutions | Processes blood samples, performs lab analysis, returns results via API. Acts under Andro Prime's instruction. UKAS ISO 15189 accredited. |
| Data processor | Stripe | Payment processing. Does not receive health data. |
| Data processor | Supabase | Database hosting. Stores all account and health data. Encrypted at rest. |
| Data processor | Customer.io | Email delivery and CRM. Receives name, email, order data. Does not receive biomarker results. |
| Clinical governance (pre-CQC) | Thriva Solutions (doctors) | Reviews all results, writes personalised reports, handles clinical escalations for abnormal results. Mandatory until Andro Prime obtains CQC registration. |

---

## 2. Data Flow Map

```
Customer purchases kit on androprime.co.uk
    ↓
Stripe processes payment (card data only, no health data)
    ↓
Andro Prime creates order record in Supabase
    ↓
API call triggers Thriva to assemble and ship kit to customer
    ↓
Customer collects sample at home (capillary finger-prick or Autodraw)
    ↓
Customer posts sample to Thriva's UKAS-accredited lab
    ↓
Thriva lab analyses sample
    ↓
Thriva's clinical team (GPs) reviews results and writes report
    ↓
If abnormal: Thriva handles clinical escalation (contacts customer, recommends GP visit)
    ↓
Results returned to Andro Prime via API
    ↓
Andro Prime stores results in Supabase (encrypted at rest)
    ↓
Customer logs into Andro Prime dashboard to view results
    ↓
Dashboard applies routing logic:
    - Low T (<12 nmol/L): Founding member deposit CTA
    - Deficiencies detected: Supplement recommendation (EFSA claims only)
    - Normal ranges: Retest recommendation (6-12 months)
    ↓
Customer.io sends results notification email (link to dashboard, no results in email body)
```

### Where is data stored?

| System | Data held | Location | Encryption |
|---|---|---|---|
| Supabase (Postgres) | All account data, biomarker results, order history | EU/UK data centre (to be confirmed during setup) | At rest and in transit |
| Stripe | Payment data (card details) | Stripe infrastructure (PCI DSS compliant) | At rest and in transit |
| Customer.io | Name, email, order data, subscription status | US-based (UK IDTA standard contractual clauses required) | In transit |
| Thriva | Sample data, results (retained per their own policy) | UK | At rest and in transit |

### Who has access to health data?

| Person/role | Access level | Justification |
|---|---|---|
| Keith Lindo (founder, data controller) | Full database access | System administration, support, business operations |
| Dr Ewa Lindo (clinical lead) | Results data for clinical review | Clinical oversight of results interpretation and escalation protocols |
| Thriva clinical team | Results they generate | Clinical governance obligation (pre-CQC) |
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

Lab analysis is performed by a UKAS ISO 15189 accredited laboratory (Thriva Solutions). All biomarkers offered have passed Bland-Altman analysis and sample stability testing for postal transit viability. Biomarkers that are unstable in postal conditions (magnesium, calcium, potassium) are excluded from our panels.

### How do we obtain consent?

Explicit consent for health data processing is collected at the point of purchase via a mandatory consent checkbox. The consent text specifically references the collection, storage, and display of biomarker results, and the use of results to present supplement recommendations. Consent is recorded with timestamp in the database. Customers can withdraw consent at any time via email to privacy@androprime.co.uk.

---

## 4. Risk Assessment

### Identified risks and mitigations

| Risk | Likelihood | Severity | Mitigation | Residual risk |
|---|---|---|---|---|
| **Data breach exposing health results** | Low | High | Encryption at rest and in transit. Database access restricted to two named individuals. Supabase hosted in certified data centres. Regular access reviews. | Low |
| **Thriva API transmission intercepted** | Very low | High | API calls over TLS 1.2+. Thriva is UKAS accredited with enterprise security standards. | Very low |
| **Incorrect results displayed to wrong customer** | Very low | High | Each result is linked to a unique order ID and customer account. Thriva's sample-matching process uses unique kit identifiers. | Very low |
| **Customer cannot withdraw consent or delete data** | Low | Medium | Deletion process documented. Email request to privacy@androprime.co.uk triggers manual deletion within 30 days. Automated deletion to be built post-launch. | Low |
| **Supplement recommendation perceived as medical advice** | Medium | Medium | All recommendations use EFSA-approved claims only. No diagnostic language. Results reports say "Your results indicate..." not "You have..." Dashboard includes disclaimer that results are not a substitute for medical advice. | Low |
| **Third-party processor breach (Supabase, Customer.io)** | Low | High | Data processing agreements in place with all processors. Customer.io does not receive health data. Supabase encryption and access controls. Breach notification clause in all DPAs (72 hours). | Low |
| **Health data transferred outside UK without safeguards** | Medium | Medium | Supabase data centre location to be confirmed as UK/EU. Customer.io is US-based: UK IDTA standard contractual clauses to be executed before launch. | Low (once SCCs in place) |
| **Abnormal result not escalated** | Low | Very high | Thriva's clinical governance team reviews every result pre-CQC. Escalation protocol is Thriva's responsibility under their clinical governance framework. Post-CQC, escalation transfers to Dr Ewa Lindo. | Very low |
| **Automated supplement routing seen as profiling under Article 22** | Low | Medium | Routing presents recommendations only. Customer is not auto-enrolled in any subscription. No purchase is made without explicit customer action. Recommendations do not produce legal or similarly significant effects. | Low |

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
- Data processing agreements with all processors (Thriva, Stripe, Supabase, Customer.io)
- Data retention schedule documented in privacy policy
- Subject access request process documented (privacy@androprime.co.uk, 30-day response)
- Clinical governance provided by Thriva's registered GPs (pre-CQC)
- Regular access review (quarterly)

### Outstanding actions before launch

| Action | Owner | Status |
|---|---|---|
| Register with ICO and obtain registration number | Keith | Pending |
| Confirm Supabase data centre location is UK or EU | Keith | Pending |
| Execute UK IDTA standard contractual clauses with Customer.io | Keith | Pending |
| Execute data processing agreement with Thriva | Keith | Pending |
| Build explicit consent checkbox into checkout flow | Keith | Pending |
| Build data deletion workflow (manual process acceptable for launch) | Keith | Pending |
| Update privacy policy with ICO registration number | Keith | Pending |
| Confirm all biomarker panels exclude unstable postal markers | Keith / Ewa | In progress (panel builder) |

---

## 6. Sign-Off

This DPIA has been prepared based on the planned Phase 0 operating model. It should be reviewed and updated when:

- CQC registration is obtained (clinical governance transfers from Thriva to Andro Prime)
- New data processors are added
- New biomarker panels or product tiers are introduced
- A data breach or near-miss occurs
- The processing changes materially

| Role | Name | Date | Signature |
|---|---|---|---|
| Data controller | Keith Lindo | | |
| Clinical lead | Dr Ewa Lindo | | |
