# Thriva API Integration Spec
**Status:** Pre-integration — sandbox credentials not yet held. Written from public API docs.
**Source docs:** `05_partners/labs/thriva/correspondence/2026-04-19-thriva-api-docs.md`
**Owner:** Engineering

This document defines exactly how the Andro Prime ↔ Thriva integration will work once a commercial agreement is in place. Nothing here requires sandbox access to write — all shapes and sequences are derived from Thriva's public API documentation.

---

## What Thriva does for us

1. Assembles and dispatches the physical kit to the customer's address
2. Receives the returned sample at the lab
3. Analyses the sample and produces biomarker results
4. Notifies us via webhook at each stage
5. Makes results available via a REST API

We never touch the sample, the lab, or the clinical governance layer. Our integration is: **order in, results out**.

---

## Environments

| Environment | Auth base URL | API base URL |
|---|---|---|
| Sandbox | `https://auth.sandbox.thriva.io/` | `https://api.euw2.sandbox.thriva.io/` |
| Production | `https://auth.thriva.io/` | `https://api.thriva.io/` |

---

## Authentication

OAuth 2.0 Client Credentials. Token is short-lived — fetch fresh per-request or cache with TTL.

```http
POST /oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "<THRIVA_CLIENT_ID>",
  "client_secret": "<THRIVA_CLIENT_SECRET>",
  "audience": "<API base URL>"
}
```

Response: `{ "access_token": "...", "token_type": "Bearer", "expires_in": <seconds> }`

All subsequent requests: `Authorization: Bearer <access_token>`

**Environment variables needed:**
```
THRIVA_CLIENT_ID=
THRIVA_CLIENT_SECRET=
THRIVA_WEBHOOK_SECRET=
```

Note: current `.env.example` has `THRIVA_API_KEY` — rename to `THRIVA_CLIENT_ID`, add `THRIVA_CLIENT_SECRET`.

---

## API Format

All requests/responses use JSON API specification (`Content-Type: application/vnd.api+json`).

Request body structure:
```json
{
  "data": {
    "type": "<resource-type>",
    "attributes": { ... },
    "relationships": { ... }
  }
}
```

---

## Journey: Kit Order → Results

### Step 1 — Discover test profile IDs

Run once during setup. Find the IDs for our three kit panels.

```http
GET /v1/test-profiles?include=biomarkers
```

Map Thriva profile IDs to our kit types:
| Our kit | Thriva profile name | Thriva profile ID |
|---|---|---|
| Kit 1: Testosterone Health Check | Advanced testosterone (or equivalent) | TBC — confirm via panel builder |
| Kit 2: Energy & Recovery Check | TBC | TBC |
| Kit 3: Hormone & Recovery Check | TBC — may be composite | TBC |

These IDs are stable — store in env vars or config, not hardcoded.

---

### Step 2 — Create a Thriva user

Called when a customer places a kit order. One Thriva user per Andro Prime customer.

```http
POST /v1/users
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "users",
    "attributes": {
      "first_name": "James",
      "last_name": "Mitchell",
      "sex": "male",
      "date_of_birth": "1982-04-15",
      "external_reference": "<andro_prime_user_id>"
    }
  }
}
```

Response includes Thriva's own `user_id`. Store this against the Andro Prime user record in `users.thriva_user_id`.

`external_reference` = our internal user UUID. Useful for reconciliation but Thriva's own ID is required for subsequent API calls.

---

### Step 3 — Create the order

Called at checkout completion (after Stripe payment confirmed).

```http
POST /v1/orders
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "orders",
    "attributes": {
      "lab": "TUR1",
      "delivery_address": {
        "line_1": "14 Sycamore Close",
        "city": "London",
        "postcode": "E1 6RF"
      }
    },
    "relationships": {
      "user": {
        "data": { "type": "users", "id": "<thriva_user_id>" }
      },
      "tests": {
        "data": [
          {
            "type": "tests",
            "attributes": {
              "test_profile_id": "<profile_id_for_kit>"
            }
          }
        ]
      }
    }
  }
}
```

Response: order object including `order_id`. Store in `kit_orders.thriva_order_id`.

**Sandbox lab identifier is `TUR1`.** Must be set; unknown if production uses a different value — confirm with Thriva.

---

## Webhook Events

Register our webhook endpoint with Thriva (via their dashboard, post-signing). Thriva uses **Svix** for delivery.

**Our endpoint:** `POST /api/webhooks/thriva`

### Signature verification

Every inbound webhook includes three Svix headers. Must verify before processing.

| Header | Purpose |
|---|---|
| `svix-id` | Unique message ID |
| `svix-timestamp` | Unix timestamp |
| `svix-signature` | HMAC-SHA256 signature |

Verification library: `svix` npm package. Replace the current `x-thriva-signature` stub in `app/api/webhooks/thriva/route.ts`.

```typescript
import { Webhook } from 'svix'

const wh = new Webhook(process.env.THRIVA_WEBHOOK_SECRET!)
const payload = wh.verify(rawBody, {
  'svix-id': headers.get('svix-id')!,
  'svix-timestamp': headers.get('svix-timestamp')!,
  'svix-signature': headers.get('svix-signature')!,
})
```

### Event types and payloads

| Event | Payload | Action |
|---|---|---|
| `fulfillment_order.fulfilled` | `{ fulfillment_order_id, order_id }` | Update `kit_orders.status = 'dispatched'`, trigger `kit_dispatched` Customer.io event |
| `fulfillment_order.failure` | `{ fulfillment_order_id, order_id, failure_cause }` | Log, alert, notify customer |
| `test.received_at_lab` | `{ order_id, test_id }` | Update status, optional Customer.io event |
| `test.failure` | `{ order_id, test_id, failure_cause }` | Log, notify customer, arrange retest |
| `result_set.available` | `{ order_id, test_id, result_set_id }` | **Fetch results — see below** |
| `result_set.partial_available` | `{ order_id, test_id, result_set_id, organization_key }` | Optional: show partial results |
| `result_set.escalation_raised` | `{ escalation_id, level, order_id, test_id, result_set_id, acknowledgment_due_by, organization_key }` | **Critical path — must acknowledge within deadline, alert clinical contact** |

---

## Critical architecture point: webhooks deliver IDs only

**The `result_set.available` webhook does not contain biomarker data.** It contains `result_set_id` only. The handler must call back to Thriva's API to fetch the actual results.

Current `app/api/webhooks/thriva/route.ts` assumes the full biomarker payload arrives in the webhook body — this is wrong and must be reworked.

### Correct handler flow for `result_set.available`

```
1. Verify Svix signature
2. Parse event type
3. On result_set.available:
   a. GET /v1/result-sets/{result_set_id}?include=biomarker-results
   b. Look up kit_orders row by thriva_order_id (order_id from webhook)
   c. Insert lab_results row (raw_payload = full Thriva response)
   d. Map biomarker results → normalise() → insert biomarker_values rows
   e. Trigger result_received Customer.io event
4. Return 202 Accepted
```

---

## Biomarker result schema (from Thriva API)

```json
{
  "name": "Testosterone",
  "value": 16.2,
  "unit": "nmol/L",
  "successful": true,
  "abnormal_flag": "L",
  "reference_ranges": [
    {
      "name": "optimal",
      "operator": null,
      "lower_bound": 20.0,
      "upper_bound": null,
      "severity_level": 10
    },
    {
      "name": "normal",
      "operator": null,
      "lower_bound": 10.0,
      "upper_bound": 20.0,
      "severity_level": 20
    },
    {
      "name": "low",
      "operator": "LESS_THAN",
      "lower_bound": null,
      "upper_bound": 10.0,
      "severity_level": 30
    }
  ]
}
```

`abnormal_flag`: `"H"` | `"L"` | `null`
`successful: false` + `failure_reason`: haemolysed | clotted | insufficient | unlabelled | mismatch | no_sample_received | lid_swap | delay | lipaemic | sample_leaked | lab_error | foreign_object

### Mapping to our normaliser

`normalise()` currently expects our internal `ThrivaWebhookPayload` shape. Once real integration lands, it needs to accept the Thriva API response shape instead:

| Thriva field | Our `NormalisedBiomarker` field |
|---|---|
| `name` | `markerName` |
| `value` | `value` |
| `unit` | `unit` |
| `reference_ranges[lowest severity].lower_bound` | `referenceLow` |
| `reference_ranges[lowest severity].upper_bound` | `referenceHigh` |

The unit assertion in `normalise()` remains — still load-bearing.

---

## Sandbox test scenarios

| Delivery postcode | Outcome |
|---|---|
| `LAB S` | Successful fulfillment, normal results |
| `LAB F` | Successful fulfillment, all biomarkers fail |
| `LAB PF` | 50% biomarker failure (person's name sets failure reason) |
| `LAB HH` | Critical escalation — one biomarker critically high |
| `LAB LL` | Critical escalation — one biomarker critically low |

Results available within ~2 minutes of order creation in sandbox.

---

## What needs to change before real integration can go live

| Item | File | Change required |
|---|---|---|
| Env vars | `.env.example` | Rename `THRIVA_API_KEY` → `THRIVA_CLIENT_ID`, add `THRIVA_CLIENT_SECRET` |
| OAuth token fetch | New `lib/thriva/client.ts` | Client credentials token fetch + cache |
| Webhook signature | `app/api/webhooks/thriva/route.ts` | Replace `x-thriva-signature` stub with Svix verification |
| Webhook handler logic | `app/api/webhooks/thriva/route.ts` | Add event routing; `result_set.available` triggers API fetch-back |
| Fulfillment webhook | `app/api/webhooks/thriva/route.ts` | Handle `fulfillment_order.fulfilled` → update order status |
| Escalation webhook | `app/api/webhooks/thriva/route.ts` | Handle `result_set.escalation_raised` → alert, do not show supplement CTAs |
| Normaliser input | `lib/results/normaliser.ts` | Accept Thriva API response shape (not internal fixture shape) |
| Order creation | New `lib/thriva/orders.ts` | Create user + order on Stripe checkout.session.completed |
| Thriva user ID | `database/migrations/` | Add `thriva_user_id` to `users` table; `thriva_order_id` to `kit_orders` |

None of these touch the classifier, fixture layer, or dashboard components — the fixture-first architecture holds. The normaliser is still the only Thriva-aware file.
