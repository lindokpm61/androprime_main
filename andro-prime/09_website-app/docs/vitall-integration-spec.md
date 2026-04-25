# Vitall API — Integration Specification
**For:** Developer building the Andro Prime platform integration
**Date:** 23 April 2026
**API version:** Vitall v2 (01-12-2024)
**Partner contact:** Laura Sutton — laura.sutton@vitall.co.uk / +44 7871 491479

---

## Overview

Andro Prime handles all customer transactions. When a customer buys a kit on the Andro Prime website, the platform fires an API call to Vitall to place the order. Vitall fulfils the kit, processes the sample, and sends webhook notifications at each stage. Results are delivered via webhook when ready.

Vitall operates invisibly — no Vitall branding in the customer journey.

---

## Environments

| | URL |
|---|---|
| **Production** | `https://vitall.co.uk/api/v2` |
| **Sandbox** | `https://vitallsync.com/api/v2` |

Use sandbox for all development and QA. Obtain sandbox credentials from Laura before starting.

---

## Authentication

OAuth 2.0 client credentials flow.

```
POST /oauth/token
{
  "grant_type": "client_credentials",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

Returns a Bearer token. Include on all requests:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Tokens are short-lived — implement token refresh logic. Separate credentials for sandbox and production.

---

## 1. Place an Order

Called immediately after a customer completes checkout on the Andro Prime platform.

```
POST /order/create
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request body:**
```json
{
  "partnerOrderId": "AP-ORDER-001",
  "collection": "self-collection",
  "tests": ["testosterone-health"],
  "patient": {
    "partnerUserId": "AP-USER-001",
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "sex": "male",
    "birthDate": "1985-10-21",
    "phone": "07000000000",
    "address": {
      "line1": "10 The Street",
      "line2": "",
      "city": "London",
      "county": "Greater London",
      "postCode": "EC1A 1BB"
    }
  }
}
```

**Field notes:**
- `partnerOrderId` — Andro Prime's internal order ID. Store the Vitall `orderId` returned against this. Used for all future lookups. Sending the same ID twice returns 400 — duplicate protection built in.
- `partnerUserId` — Andro Prime's internal customer ID. Enables historical order lookup by customer.
- `collection` — `self-collection` | `clinic-collection` | `nurse-collection`
- `tests` — array of Vitall panel shortCodes. Retrieve current shortCodes from `GET /tests` (see section 2). For Phase 0: Kit 1 and Kit 2 shortCodes to be confirmed with Vitall on account setup.
- `phone` — required for clinic/nurse collection; optional for self-collection
- `birthDate` — YYYY-MM-DD format

**Success response (201):**
```json
{
  "success": "Order Created Successfully",
  "order": {
    "orderId": "VITALL-ORDER-ID",
    "partnerOrderId": "AP-ORDER-001",
    "status": {
      "code": "order-placed",
      "name": "Order Placed"
    },
    "createdAt": "2026-04-23T10:00:00.000000Z",
    "updatedAt": "2026-04-23T10:00:00.000000Z"
  }
}
```

**Store `orderId` from this response against the Andro Prime order record.**

**Error responses:**
- `400` — duplicate `partnerOrderId`, validation failure, invalid collection method, unrecognised test shortCode
- `400` — email already associated with a different partner account (cannot be claimed)

---

## 2. Retrieve Available Tests

Call this once during setup (and periodically to check for changes) to get current panel shortCodes and partner prices.

```
GET /tests
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Response includes:
- `your_tests` — Andro Prime's custom panels (Kit 1, Kit 2, Kit 3 once configured)
- `all_tests` — full Vitall catalogue

Each test: `shortCode`, `name`, `title`, `price` (partner price), `analysisTime`.

---

## 3. Webhooks

Vitall posts to a configured endpoint each time an order status changes. Configure the endpoint URL with Vitall before go-live.

### Security — verify every incoming webhook

Every webhook is signed with HMAC 256 using the Bearer token. Verify the signature header on every request before processing. Reject any request that fails verification.

### Webhook events

| `order_status` | Meaning | Platform action |
|---|---|---|
| `order-placed` | Order confirmed by Vitall | Update order status in DB |
| `kit-sent` | Kit dispatched to customer | Update status; trigger "Your kit is on its way" email (T-03) |
| `sample-received` | Sample arrived at lab | Update status; trigger "We've got your sample" email (T-04) |
| `testo-analysis` | Analysis in progress | Update status |
| `results-available` | Results ready | Update status; store results; trigger "Your results are ready" email (T-05); check `warning` field |

### Webhook payload

```json
{
  "vitall_order_id": "VITALL-ORDER-ID",
  "partner_order_id": "AP-ORDER-001",
  "laboratory_order_id": "LAB-REF",
  "order_status": "results-available",
  "results": [...],
  "results_pdf": "BASE64_STRING",
  "results_html": "BASE64_STRING"
}
```

- `results` is empty on all events except `results-available`
- On `results-available`, `results`, `results_pdf`, and `results_html` are all populated — no separate fetch call needed
- Use `partner_order_id` to join back to the Andro Prime order record

### Critical result handling

When `order_status` is `results-available`, check the `warning` field in the results payload. If `warning` is populated, trigger an internal alert to the Andro Prime team in addition to the standard customer email. The lab's clinical team handles direct patient escalation — Andro Prime's role is internal notification only.

---

## 4. Results Data Structure

Results arrive in the webhook payload (and can also be fetched via `GET /request/{ID}/format=raw,pdf,html`).

### Raw JSON structure

```json
{
  "results": {
    "raw": [
      {
        "panel_code": "testosterone-health",
        "panel_name": "Testosterone Health Check",
        "results": [
          {
            "code": "TT",
            "name": "Total Testosterone",
            "name_simple": "Total Testosterone",
            "result": "14.2",
            "units": "nmol/L",
            "reference": "10 - 35",
            "flag": "",
            "note": "",
            "created_at": "2026-04-23 10:15:00"
          }
        ]
      }
    ],
    "pdf": "BASE64_PDF",
    "html": "BASE64_HTML"
  }
}
```

### Per-biomarker fields

| Field | Type | Description |
|---|---|---|
| `code` | string | Unique biomarker code |
| `name` | string | Full biomarker name |
| `name_simple` | string | Abbreviated display name |
| `result` | string | Result value |
| `units` | string | Unit of measurement |
| `reference` | string | Reference range (e.g. "10 - 35") |
| `flag` | string | `H` = high, `L` = low, blank = normal |
| `note` | string | Lab notes or context |
| `created_at` | datetime | Result timestamp |

### Order-level commentary fields

| Field | Patient-visible | Description |
|---|---|---|
| `comment` | Yes | General clinical commentary for the patient |
| `warning` | Yes | Urgent — critical or abnormal result requiring attention |
| `partnerComment` | Yes | Comment added by Andro Prime (editable via partner dashboard) |
| `privateComment` | No | Internal Vitall-to-Andro Prime note |

---

## 5. Fetch Order Status

Poll this endpoint if needed (e.g. to reconcile webhook failures or display current status in the partner dashboard).

```
GET /order/{ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

ID can be Vitall's `orderId` or Andro Prime's `partnerOrderId`.

---

## 6. Historical Orders per Customer

```
GET /orders/{partnerUserId}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Returns all orders for that customer. Use to populate the "previous results" section of the customer dashboard.

---

## 7. Implementation Checklist

- [ ] Obtain sandbox credentials from Laura Sutton
- [ ] Implement OAuth token fetch and refresh
- [ ] Confirm Kit 1 and Kit 2 panel shortCodes from `GET /tests` (custom panels must be configured with Vitall first)
- [ ] Build order creation call, triggered on checkout completion
- [ ] Store Vitall `orderId` against Andro Prime order record
- [ ] Register webhook endpoint URL with Vitall
- [ ] Implement HMAC signature verification on all incoming webhooks
- [ ] Map all 5 webhook status codes to platform actions and email triggers
- [ ] Implement `warning` field check on `results-available` webhook
- [ ] Build results parser — raw JSON → dashboard display
- [ ] Test full journey in sandbox: order → kit-sent → sample-received → testo-analysis → results-available
- [ ] Confirm webhook retry policy with Vitall (not documented — ask Laura)
- [ ] Confirm failed sample handling in results response (not documented — ask Laura)
- [ ] Switch to production credentials before go-live

---

## Outstanding Questions for Vitall (Pre-Build)

1. What is the webhook retry policy if the endpoint is temporarily unavailable?
2. How is a failed or insufficient sample indicated in the results payload?
3. Can sandbox webhook events be triggered on-demand, or do they run on a fixed schedule?
4. What are the shortCodes for the custom Andro Prime panels once configured?

Contact Laura Sutton to resolve before integration build begins.
