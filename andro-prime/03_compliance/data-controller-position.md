# Data Controller Position — Andro Prime Phase 0

**Document date:** April 2026
**Prepared by:** Keith Lindo
**Status:** Draft — pending solicitor review

---

## 1. Data Controller Identity

The Data Controller for all personal data and special category health data processed under the Andro Prime brand in Phase 0 is:

**Prima Medical Group Ltd**
(company number to be inserted)
(registered address to be inserted)

Andro Prime is the consumer-facing trading name of Prima Medical Group Ltd. All data processing activities, ICO registration, privacy notices, data processing agreements, and consent mechanisms operate under Prima Medical Group Ltd as the registered legal entity.

---

## 2. Basis for This Position

Prima Medical Group Ltd is designated Data Controller because:

- It is the contracting entity with the laboratory partner (Thriva Solutions)
- It is the entity under which Stripe payment processing is registered
- It is the entity responsible for operating the Supabase database in which personal data and biomarker results are stored
- It is the entity that employs or contracts the personnel who access personal data (Keith Lindo, Dr Ewa Lindo)
- It determines the purposes and means of processing — i.e. it decides why and how customer data is collected, stored, and used

---

## 3. What Prima Medical Group Ltd Controls

| Data category | Processing activity | Controller |
|---|---|---|
| Identity (name, email, DOB) | Account creation, order fulfilment | Prima Medical Group Ltd |
| Health / biomarker results | Lab dispatch, results storage, dashboard display | Prima Medical Group Ltd |
| Supplement subscription data | Stripe billing, dashboard display | Prima Medical Group Ltd |
| Founding member deposit status | Stripe payment, Supabase record | Prima Medical Group Ltd |
| Communications (email, support) | Customer.io sequences, support inbox | Prima Medical Group Ltd |
| Website usage data | Analytics (anonymised) | Prima Medical Group Ltd |

---

## 4. Data Processor Relationships

The following third parties act as Data Processors under instruction from Prima Medical Group Ltd as Data Controller. A signed Data Processing Agreement must be in place with each before any data is shared.

| Processor | Role | DPA status |
|---|---|---|
| Thriva Solutions | Lab analysis; returns results via API | Not yet signed |
| Stripe | Payment processing | Stripe standard DPA — to be reviewed |
| Supabase | Database hosting (EU Frankfurt) | Supabase standard DPA — to be reviewed |
| Customer.io | Email and CRM sequences | US-based — requires UK IDTA SCCs in addition to DPA |

---

## 5. ICO Registration

Prima Medical Group Ltd must be registered with the ICO as a Data Controller before any personal data is processed. Registration is in the name of Prima Medical Group Ltd, not Andro Prime.

- ICO registration number: [to be inserted post-registration]
- Annual renewal fee: £52 (Tier 1, micro-organisation)
- Renewal reminder: set calendar reminder for 12 months from registration date

---

## 6. Responsibilities of the Data Controller

As Data Controller, Prima Medical Group Ltd is responsible for:

- Ensuring all processing has a lawful basis under UK GDPR
- Maintaining this document and keeping it current
- Ensuring DPAs are in place with all processors before data is shared
- Publishing and maintaining the privacy notice at andro-prime.com/privacy
- Responding to Subject Access Requests within one calendar month
- Reporting data breaches to the ICO within 72 hours of becoming aware
- Completing and reviewing the DPIA (`03_compliance/dpia/phase0-dpia.md`)

---

## 7. Named Individuals

| Role | Individual |
|---|---|
| Data Controller (legal entity) | Prima Medical Group Ltd |
| Responsible person (day-to-day) | Keith Lindo |
| Clinical governance | Dr Ewa Lindo (GMC-registered GP) |
| Data queries / SAR contact | privacy@andro-prime.com |

---

## 8. Review

This document must be reviewed if:
- The operating entity changes
- A new category of personal data is introduced
- A new processor is engaged
- The Phase 0 to post-CQC transition begins (clinical data introduces additional Article 9 obligations)

Next scheduled review: October 2026
