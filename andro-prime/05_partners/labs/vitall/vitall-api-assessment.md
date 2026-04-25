# Vitall API — Technical Assessment
**Date assessed:** 23 April 2026
**API version:** v2 (01-12-2024)
**Assessed by:** Keith Antony (review of API documentation shared by Laura Sutton)
**Verdict:** Fit for purpose. No blockers identified.

---

## Environments

| Environment | Base URL |
|---|---|
| Production | `https://vitall.co.uk/api/v2` |
| Sandbox | `https://vitallsync.com/api/v2` |

---

## Authentication

OAuth 2.0 client credentials flow. Exchange `client_id` and `client_secret` for a Bearer token via `/oauth/token`. Token used on all subsequent requests.

Separate credentials for sandbox and production.

---

## Endpoints

### POST /order/create — Place an order

Called when a customer completes checkout on the Andro Prime platform. Creates the order with Vitall and returns Vitall's order ID.

**Required fields:**
- `patient.email`, `patient.firstName`, `patient.lastName`, `patient.sex`, `patient.birthDate` (YYYY-MM-DD)
- `patient.address` (line1, city, county, postCode)
- `collection` — `self-collection`, `clinic-collection`, or `nurse-collection`
- `tests` — array of panel shortCodes (e.g. `["testosterone-health"]`)

**Optional but important:**
- `partnerOrderId` — Andro Prime's internal order ID. Stored by Vitall, returned in every subsequent response. Used to reconcile Vitall orders with our database. Duplicate protection: sending the same ID twice returns a 400 error, not a duplicate order.
- `patient.partnerUserId` — Andro Prime's internal customer ID. Stored by Vitall, allows querying all orders for a specific customer.
- `patient.phone` — required for clinic/nurse collection; optional for self-collection

**Patient deduplication:** If the email already exists in Vitall's system, they update non-critical fields (address, phone) but will not overwrite name, DOB, or sex. If the email is registered under a different partner account, returns 400 — cannot be claimed.

**Response:** Returns Vitall `orderId`, full patient record, collection method, panels ordered, and timestamps.

---

### GET /tests — Available tests and prices

Returns all panels available to Andro Prime, including:
- `your_tests` — custom panels configured for Andro Prime (where the bespoke Kit 1/2/3 panels will appear once set up)
- `all_tests` — full Vitall catalogue

Each test includes: `shortCode` (used when placing orders), `name`, `price` (partner price), `analysisTime`.

---

### GET /orders — List orders

Returns last 30 days of orders by default. Filter by `fromDate` / `toDate`.

Pass `partnerUserId` or `email` as the ID parameter to retrieve all orders for a specific customer — this is how historical results are accessed for returning customers.

---

### GET /order/{ID} — Fetch order status and results

ID can be Vitall's `orderId` or Andro Prime's `partnerOrderId`.

Returns current order status, full patient record, panels, timestamps, and — when results are available — the full results payload.

**Key timestamps in response:**
- `createdAt` — order placed
- `receivedAt` — sample received at lab
- `resultsAt` — results completed
- `updatedAt` — last change

---

### GET /request/{ID}/format=raw,pdf,html — Retrieve results with format options

Explicit results retrieval endpoint. Returns biomarker data in one or more of:
- `raw` — structured JSON grouped by panel
- `pdf` — base64 encoded PDF
- `html` — base64 encoded HTML with charts

**Raw results fields per biomarker:**

| Field | Description |
|---|---|
| `code` | Unique biomarker code |
| `name` | Full biomarker name |
| `name_simple` | Abbreviated name |
| `result` | Test result value |
| `units` | Unit of measurement |
| `reference` | Reference range (e.g. "10 - 35") — included in response, not a separate call |
| `flag` | `H` (high), `L` (low), or blank (normal) |
| `note` | Lab notes or contextual information |
| `created_at` | Timestamp |

**Order-level comment fields:**

| Field | Visible to | Purpose |
|---|---|---|
| `comment` | Patient | General clinical commentary |
| `warning` | Patient | Urgent attention — critical/abnormal result flag |
| `partnerComment` | Patient | Comment added by Andro Prime via partner dashboard |
| `privateComment` | Partner only | Internal Vitall-to-partner note, never shown to patient |

---

## Webhooks

Vitall posts to a configured endpoint each time order status changes. Request is signed with HMAC 256 using the Bearer token — verify signature on every incoming webhook.

**Five webhook events (order status codes):**

| Status code | Description | Andro Prime comms trigger |
|---|---|---|
| `order-placed` | Order confirmed | Internal record update |
| `kit-sent` | Kit dispatched to customer | "Your kit is on its way" email |
| `sample-received` | Sample received at lab | "We've got your sample" email |
| `testo-analysis` | Analysis in progress | Optional status update |
| `results-available` | Results ready | "Your results are ready" email |

**When `results-available` fires:** the full results JSON, base64 PDF, and base64 HTML are included in the webhook payload. No separate API call needed to fetch results.

**Webhook payload fields:**
- `vitall_order_id` — Vitall's order ID
- `partner_order_id` — Andro Prime's order ID (matches what was sent at order creation)
- `laboratory_order_id` — lab's internal ID (populated when results available)
- `order_status` — current status code
- `results` — empty unless `results-available`; full biomarker JSON when populated
- `results_pdf` — base64 PDF (when results available)
- `results_html` — base64 HTML with charts (when results available)

**Webhook token:** must be configured with Vitall before going live ("Contact Us" in docs).

---

## Gap Analysis vs Andro Prime Requirements

| Requirement | Status | Notes |
|---|---|---|
| Order creation with patient data | ✅ | All required fields supported; `partnerOrderId` and `partnerUserId` for reconciliation |
| Webhook: kit dispatched | ✅ | `kit-sent` event |
| Webhook: sample received | ✅ | `sample-received` event |
| Webhook: results ready | ✅ | `results-available` event — results bundled in payload |
| Webhook: doctor commentary added | ⚠️ | No separate event; commentary surfaces in `comment` / `warning` fields within `results-available` payload |
| Webhook: critical result flagged | ⚠️ | No dedicated event; critical flags surface via `warning` field in results payload. Platform must check `warning` on `results-available` and trigger internal alert if populated |
| Reference ranges in results | ✅ | `reference` field per biomarker, included in main response |
| Abnormal flag per biomarker | ✅ | `flag` field (H/L/blank) |
| Failed sample indication | ❓ | Not explicitly documented — likely via `note` field or absence of result value; clarify with Vitall |
| Results in multiple formats | ✅ | JSON, PDF (base64), HTML (base64) |
| Patient internal ID reference | ✅ | `partnerUserId` field on order creation |
| Historical results per customer | ✅ | `GET /orders/{partnerUserId}` |
| Sandbox environment | ✅ | vitallsync.com |
| Webhook security (HMAC) | ✅ | HMAC 256, Bearer token |
| OAuth 2.0 authentication | ✅ | Client credentials flow |
| Separate sandbox credentials | ✅ | Separate environments |
| Webhook retry policy | ❓ | Not documented — ask Laura |

---

## Outstanding Questions for Vitall

1. **Webhook retry policy** — what happens if the Andro Prime endpoint is temporarily unavailable when Vitall fires a webhook?
2. **Failed sample handling** — how is a failed or insufficient sample indicated in the results response?
3. **Sandbox event triggering** — can webhook events be triggered on-demand in the sandbox, or do they run on a fixed schedule?

None of these are blockers for the partner decision. They are implementation-level questions for the integration build.

---

## Overall Verdict

The Vitall API covers all core requirements for the Andro Prime platform:
- Order placement, status tracking, and results retrieval are all supported
- Webhook events map directly to the customer journey communication triggers
- Results bundled with the `results-available` webhook eliminates a separate fetch call
- `partnerOrderId` and `partnerUserId` provide clean joins to the Andro Prime database
- Reference ranges, flags, and commentary fields are all present in the results structure

The two nominal gaps (no dedicated "GP commentary" webhook event; no dedicated "critical result" webhook event) are not functional gaps — both are handled through fields in the existing `results-available` payload. The platform checks the `warning` field on receipt and routes accordingly.

**The API is technically fit for purpose. No blockers to integration.**
