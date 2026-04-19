# Thriva API Documentation — Reference Summary
**Date compiled:** 2026-04-19
**Source:** docs.thriva.io (public documentation)
**Status:** Sandbox access now live — pre-production integration

---

## Base URLs

| Environment | Auth endpoint | API endpoint |
|---|---|---|
| Sandbox | `https://auth.sandbox.thriva.io/` | `https://api.euw2.sandbox.thriva.io/` |
| Production | `https://auth.thriva.io/` | `https://api.thriva.io/` |

---

## Authentication

OAuth 2.0 Client Credentials grant. Thriva provides a `clientId` and `secret`.

```
POST https://auth.sandbox.thriva.io/oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "<clientId>",
  "client_secret": "<secret>",
  "audience": "https://api.euw2.sandbox.thriva.io/"
}
```

Returns a Bearer token used in `Authorization: Bearer <token>` for all subsequent requests.

---

## API Format

All requests and responses follow the **JSON API specification** (`application/vnd.api+json`). Request bodies follow the `{ data: { type, attributes, relationships } }` structure.

---

## Core Endpoints

### List Test Profiles
```
GET /v1/test-profiles
GET /v1/test-profiles?filter[code_in]=<code1>,<code2>
GET /v1/test-profiles?include=biomarkers
```

### Create User (Subject)
```
POST /v1/users
```
Required attributes: `first_name`, `last_name`, `sex`, `date_of_birth`
Optional: `external_reference` (your internal ID — Thriva ID still required for API calls)

### Create Order
```
POST /v1/orders
```
Required: `lab` identifier, `delivery_address`, linked `user`, linked test `profiles`
Sandbox lab identifier: **`TUR1`**

### Get Result Set
```
GET /v1/result-sets/{result_set_id}
GET /v1/result-sets/{result_set_id}?include=biomarker-results
```

### Get Biomarker Result
```
GET /v1/biomarker-results/{biomarker_result_id}
```

---

## Biomarker Result Schema

```json
{
  "name": "Testosterone",
  "value": 16.2,
  "unit": "nmol/L",
  "successful": true,
  "abnormal_flag": null,
  "reference_ranges": [
    {
      "name": "optimal",
      "operator": null,
      "lower_bound": 15.0,
      "upper_bound": 30.0,
      "severity_level": 10
    },
    {
      "name": "normal",
      "operator": null,
      "lower_bound": 10.0,
      "upper_bound": 15.0,
      "severity_level": 20
    }
  ]
}
```

`abnormal_flag`: `"H"` (high), `"L"` (low), or `null` (normal)
`failure_reason` (when `successful: false`): haemolysed | clotted | insufficient | unlabelled | mismatch | no_sample_received | lid_swap | delay | lipaemic | sample_leaked | lab_error | foreign_object
`severity_level`: 10–50, lower = healthier range

---

## Webhooks

Thriva uses **Svix** for webhook delivery. Signature verification uses three headers:

| Header | Description |
|---|---|
| `svix-signature` | Cryptographic hash |
| `svix-id` | Message identifier |
| `svix-timestamp` | Unix timestamp |

**Not** `x-thriva-signature` — our current webhook handler uses the wrong header name.

### Event Types

| Event | Payload fields | When |
|---|---|---|
| `fulfillment_order.fulfilled` | `fulfillment_order_id`, `order_id` | Kit dispatched to customer |
| `fulfillment_order.failure` | `fulfillment_order_id`, `order_id`, `failure_cause` | Dispatch failed |
| `test.received_at_lab` | `order_id`, `test_id` | Sample arrives at lab |
| `test.failure` | `order_id`, `test_id`, `failure_cause` | Sample fails validation |
| `result_set.available` | `order_id`, `test_id`, `result_set_id` | Results ready (all biomarkers) |
| `result_set.partial_available` | `order_id`, `test_id`, `result_set_id`, `organization_key` | Partial results ready |
| `result_set.escalation_raised` | `escalation_id`, `level`, `order_id`, `test_id`, `result_set_id`, `acknowledgment_due_by`, `organization_key` | Clinical escalation triggered |

**Critical architecture note:** Webhooks deliver IDs only — not biomarker data. On `result_set.available`, the handler must call `GET /v1/result-sets/{result_set_id}?include=biomarker-results` to fetch the actual results.

---

## Sandbox Test Scenarios

Use these special postcodes in the delivery address to simulate specific outcomes:

| Postcode | Result |
|---|---|
| `LAB S` | Successful fulfillment, normal results |
| `LAB F` | Successful fulfillment, all biomarkers fail |
| `LAB PF` | 50% biomarker failure (person's name sets failure reason) |
| `LAB HH` | Critical escalation — one biomarker critically high |
| `LAB LL` | Critical escalation — one biomarker critically low |

Results are available **within a couple of minutes** after order creation in sandbox.

---

## Environment Variables Required

```
THRIVA_CLIENT_ID=        # OAuth2 client ID from Thriva
THRIVA_CLIENT_SECRET=    # OAuth2 client secret from Thriva
THRIVA_WEBHOOK_SECRET=   # Svix webhook signing secret
```

Note: current `.env.example` has `THRIVA_API_KEY` — this needs renaming to `THRIVA_CLIENT_ID` and adding `THRIVA_CLIENT_SECRET`.
