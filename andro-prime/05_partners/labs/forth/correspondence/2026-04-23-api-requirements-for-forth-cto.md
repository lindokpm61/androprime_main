# Andro Prime — API Integration Requirements
**Prepared by:** Keith Antony, Founder — Andro Prime
**For:** Chris Baines, CTO — Forth Connect
**Date:** 23 April 2026
**Context:** Pre-read for technical deep-dive call, Thursday 30 April 2026, 11:00 AM

---

## Introduction

Andro Prime is a UK men's health platform. We sell at-home diagnostic kits (fingerprick blood tests) and supplement subscriptions. Forth Connect would be our lab and results partner.

We are building our own customer-facing platform — website, checkout, customer dashboard, and automated communications. We need Forth's API to connect our platform to your lab and results infrastructure so the end-to-end journey is seamless for our customers.

Our approach is phased:

1. **Phase 1 (now):** White label — use Forth's branded results web app while our platform is completing development. Minimal integration required.
2. **Phase 2 (target: within ~3 months):** Full API integration — our platform handles the entire customer-facing journey; Forth operates invisibly in the background as our lab and clinical layer.

This document focuses on the **Phase 2 API requirements**. We want to confirm feasibility, understand scope, and agree integration costs before the call.

---

## What the Integration Needs to Do

At a high level, our platform needs to:

1. **Create an order** with Forth when a customer buys a kit on our website
2. **Receive notifications** (webhooks) at each key stage of the kit journey
3. **Retrieve the test results** from Forth's system once ready
4. **Display results** within our own customer dashboard (not Forth's web app)
5. **Trigger our automated communications** (emails, SMS) at each stage

We are not asking Forth to handle any customer-facing communications in Phase 2 — that moves entirely to our platform.

---

## Core Requirements

### 1. Order Creation

When a customer completes checkout on our website, our system needs to create an order with Forth automatically (no manual steps).

**We need:**
- An endpoint to create a new test order
- Ability to pass: customer name, date of birth, sex, delivery address, and the panel being ordered (Kit 1 or Kit 2)
- A Forth order ID returned, which we store against our internal order record
- Confirmation of how patients/customers are registered on your system (one record per customer, or per order?)

### 2. Webhook Notifications

This is our highest priority requirement. We need real-time event notifications so our platform can update the customer's dashboard and trigger the right automated email/SMS at each stage.

**Events we need webhooks for:**

| Event | Description | What we do with it |
|---|---|---|
| Kit dispatched | Forth has sent the kit to the customer | Update order status; trigger "Your kit is on its way" email |
| Sample received at lab | Returned sample has arrived at the lab | Update order status; trigger "We've got your sample" email |
| Results ready | Lab analysis complete; results available to retrieve | Update order status; fetch results via API; trigger "Your results are ready" email |
| Doctor's commentary added | GP has added their review to the results | Flag results as complete in dashboard; notify customer |
| Critical result flagged | A result requires urgent escalation | Trigger internal alert to Andro Prime; follow agreed escalation protocol |

**For each webhook, we need:**
- The event type clearly labelled
- The Forth order ID (so we can match to our internal record)
- The customer/patient ID
- A timestamp
- For critical results: the flag level and nature of the escalation

**Questions on webhooks:**
- Does the results-ready webhook include the biomarker data, or just a notification that results are available (requiring a separate API call to fetch them)?
- How is webhook delivery secured — do you use signature verification (e.g. HMAC), and what headers should we verify?
- What is your retry policy if our endpoint is temporarily unavailable?
- Can we register a different webhook endpoint for sandbox vs production?

### 3. Results Retrieval

Once results are ready, we need to pull the biomarker data into our platform so we can display it in our customer dashboard.

**For each biomarker result, we need:**

| Data point | Example |
|---|---|
| Biomarker name | Testosterone (total) |
| Value | 14.2 |
| Unit | nmol/L |
| Reference range — low bound | 10.0 |
| Reference range — high bound | 35.0 |
| Abnormal flag | `LOW` / `HIGH` / `NORMAL` |
| Result status | Successful / Failed (and failure reason if failed) |

**Questions on results:**
- Is the full biomarker payload returned in one API response, or paginated?
- Are reference ranges included in the results response, or returned separately?
- How are failed samples indicated (e.g. insufficient volume, haemolysed)?
- Is the GP doctor's commentary returned via the same endpoint, or a separate call?
- Are historical results (previous orders for the same customer) accessible via API?

### 4. Patient Record Management

We need to understand how customer records are created and managed on your side.

**Questions:**
- Do we create a patient record via API before placing an order, or is it created as part of the order?
- Can we pass our own internal customer ID as a reference field (so we can reconcile records)?
- What patient data is required on your end: name, DOB, sex, address — anything else?
- Is there a patient lookup endpoint (to check if a customer already has a record with you)?

---

## Sandbox and Testing

Before we go live, we need to be able to test the full integration end-to-end without real patients or real samples.

**We need:**
- Access to a sandbox environment that mirrors production
- The ability to simulate the full kit journey: order → dispatch → sample received → results → GP commentary
- Test scenarios for: successful results, failed samples, and critical result escalation
- Sandbox credentials (API key or OAuth client ID/secret) once an agreement is in place

**Questions:**
- Do you have a sandbox environment available?
- Can sandbox webhook events be triggered on-demand, or do they run on a fixed test scenario schedule?
- Roughly how long does the full sandbox journey take from order creation to results available?

---

## Authentication

**Questions:**
- What authentication method does your API use — API key, OAuth 2.0, or another method?
- If OAuth: client credentials flow, or another grant type?
- Are tokens short-lived, and do we need to handle token refresh?
- Are there separate credentials for sandbox and production?

---

## API Documentation

**Questions:**
- Is there existing API documentation (OpenAPI spec, Postman collection, or equivalent)?
- Is documentation available before the commercial agreement is signed, or only after?
- Is there a changelog or versioning policy — i.e. how will we be notified of breaking changes?
- Is there a major API upgrade in progress (mentioned in our last call) — what is the expected release timeline, and will our integration need to be rebuilt for it?

---

## Costs

From our call with Emily, API integration is priced separately. We want to understand the cost structure before the call.

**Questions:**
- Is there a one-time integration fee, a monthly API access fee, or both?
- Is sandbox access included in the API cost, or separate?
- Is there a per-call cost, or is usage included in the monthly fee?

---

## Summary — Questions for Chris

To make the 30 April call as productive as possible, I've pulled the open questions together in one list:

1. Webhooks: does the results-ready event include biomarker data, or do we fetch separately?
2. Webhooks: what signature/verification method do you use?
3. Webhooks: what is your retry policy on failed delivery?
4. Results: are reference ranges included in the results API response?
5. Results: how are failed samples indicated in the response?
6. Results: is GP commentary returned in the same endpoint as biomarker data?
7. Results: can we access historical results for a returning customer?
8. Patients: is patient creation separate from order creation, or combined?
9. Patients: can we pass our own internal customer ID as a reference field?
10. Sandbox: do you have a sandbox environment, and can events be triggered on-demand?
11. API upgrade: what is the timeline, and does it affect integration scope?
12. Costs: what is the cost structure for API access (setup, monthly, per-call)?
13. Docs: is an OpenAPI spec or Postman collection available?
14. Auth: OAuth 2.0 or API key, and do tokens expire?

---

## Our Timeline

We have a hard internal deadline for our platform launch. We want to begin sandbox testing as soon as an agreement is in place. A quick turnaround on API documentation and sandbox credentials after the 30 April call would be greatly appreciated.

If anything in this document is unclear or if you need more context on our architecture before the call, please reach out directly.

**Keith Antony**
Founder, Andro Prime
keithantony5@gmail.com
