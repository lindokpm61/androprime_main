# Data Controller Position — Andro Prime Phase 0

**Document date:** April 2026 (revised 2026-07-19)
**Prepared by:** Keith Lindo
**Status:** Draft — pending solicitor review

> **Revision note (2026-06-11):** Data controller corrected from "Andro Prime Ltd" to **Andro Prime Ltd**. Per the [single-entity decision](../01_strategy/entity-structure/2026-05-12-single-entity-decision.md), Andro Prime operates as one legal entity (Andro Prime Ltd, 50/50 Keith Lindo / Dr Ewa Lindo) for both wellness and, post-CQC, clinical activity. Andro Prime Ltd is not incorporated and the two-entity structure is parked for review in ~18 months. Andro Prime Ltd is also the contracting entity on the executed Vitall agreement. ICO registration is in progress under Andro Prime Ltd (application ref C1958101); registration number to be inserted on issue.

---

## 1. Data Controller Identity

The Data Controller for all personal data and special category health data processed under the Andro Prime brand in Phase 0 is:

**Andro Prime Ltd**
Company number: 17185839
Registered address: 128 City Road, London, EC1V 2NX, United Kingdom

Andro Prime is the consumer-facing trading name of Andro Prime Ltd. All data processing activities, ICO registration, privacy notices, data processing agreements, and consent mechanisms operate under Andro Prime Ltd as the registered legal entity.

---

## 2. Basis for This Position

Andro Prime Ltd is designated Data Controller because:

- It is the contracting entity with the laboratory partner (Vitall)
- It is the entity under which Stripe payment processing is registered
- It is the entity responsible for operating the Supabase database in which personal data and biomarker results are stored
- It is the entity that employs or contracts the personnel who access personal data (Keith Lindo, Dr Ewa Lindo)
- It determines the purposes and means of processing — i.e. it decides why and how customer data is collected, stored, and used

---

## 3. What Andro Prime Ltd Controls

| Data category | Processing activity | Controller |
|---|---|---|
| Identity (name, email, DOB) | Account creation, order fulfilment | Andro Prime Ltd |
| Health / biomarker results | Lab dispatch, results storage, dashboard display | Andro Prime Ltd |
| Supplement subscription data | Stripe billing, dashboard display | Andro Prime Ltd |
| Founding-member list status (email + opt-in date — no payment data) | Form capture, Supabase record, Customer.io list membership | Andro Prime Ltd |
| Communications (email, support) | Customer.io sequences, support inbox | Andro Prime Ltd |
| Website usage data | Analytics (anonymised) | Andro Prime Ltd |

---

## 4. Vitall — Separate (Independent) Data Controller

Vitall is **not** a data processor of Andro Prime. Under the executed Services Agreement (Healthy Human Labs Ltd t/a VITALL, signed 2026-06-02, commenced 08-05-2026, Model 3 API; Order Form §6 + Core Terms §6), Andro Prime Ltd and Vitall act as **separate, independent Data Controllers**:

| Party | Controls (its own purposes and means) |
|---|---|
| **Andro Prime Ltd** | The customer relationship, marketing, customer support, retail journey, pricing, payment, patient communications, and the results dashboard. |
| **Vitall (Healthy Human Labs Ltd)** | Patient Personal Data processed to deliver the Testing Services: kit fulfilment, sample logistics, laboratory coordination, result generation, reporting, quality control, repeat testing, testing-related patient support, legal compliance, record keeping. |

Consequences of the controller-to-controller model:

- Each party is independently responsible for its own UK GDPR compliance and lawful basis.
- Each party responds to Data Subject Requests for the data it controls.
- Each party must notify the other promptly of any Personal Data Breach affecting shared Personal Data.
- There is **no Article 28 processor DPA** with Vitall; the data-protection terms sit in the Services Agreement (Core Terms §6, Order Form §6).
- Vitall engages Authorised Sub-Processors (UKAS-accredited labs, logistics, IT hosting, phlebotomy) under Andro Prime's general written authorisation; Vitall notifies of material changes. Vitall does not transfer Patient Personal Data outside the UK without appropriate safeguards (§6.4).
- Customers must be told Vitall is a separate controller for the lab testing (privacy notice), and Andro Prime's T&Cs / product pages must reference Vitall and link https://vitall.co.uk/terms (Services Agreement §3.14.6).

## 4a. Data Processor Relationships

The following third parties act as Data Processors under instruction from Andro Prime Ltd as Data Controller. A signed Data Processing Agreement must be in place with each before any data is shared.

| Processor | Role | DPA status |
|---|---|---|
| Stripe | Payment processing | Stripe standard DPA — to be reviewed |
| Supabase | Database hosting (Ireland region) | DPA incorporated via Supabase's standard terms (no separately signed DPA) |
| Customer.io | Email and CRM sequences | US-based — requires UK IDTA SCCs in addition to DPA |
| Attio | Partner/affiliate CRM: partner contact records + recruitment pipeline (holds ~42 triaged partner People/Company records) | US-based; requires UK IDTA/SCCs in addition to a DPA. Attio standard DPA to be reviewed. Dormant under the 2026-06-07 affiliate freeze, but partner personal data is retained, so the processor relationship and the DPA obligation stand. |

> **Note (added 2026-07-19):** Attio holds **partner** personal data (PTs, influencers, gym owners), not customer or health data. It is therefore in scope of this ROPA / processor map but out of scope of the customer-facing privacy notice; a partner-facing privacy line is a separate follow-up that only becomes live if the affiliate channel is unfrozen (`869e0bcj5`). While frozen, no new partner data is being ingested, but the retained records keep the DPA obligation open.

---

## 5. ICO Registration

Andro Prime Ltd must be registered with the ICO as a Data Controller before any personal data is processed. Registration is in the name of the legal entity Andro Prime Ltd (the trading name "Andro Prime" is not a separate registrant).

- ICO registration number: **ZC172852** (registered 2026-06-12; payment ref C1958101, paid 2026-06-11)
- Annual renewal fee: £52 (Tier 1, micro-organisation)
- Renewal reminder: set calendar reminder for 12 months from registration date

---

## 6. Responsibilities of the Data Controller

As Data Controller, Andro Prime Ltd is responsible for:

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
| Data Controller (legal entity) | Andro Prime Ltd |
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
