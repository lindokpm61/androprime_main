# Thriva Solutions — Negotiation Log
**Living document. Update after every meaningful interaction.**

---

## Status Overview

| Item | Status |
|---|---|
| First meeting | Complete (April 2026) |
| Biomarker panel builder | Pending — Sophia to send link |
| API documentation | Reviewed (public docs only — see correspondence/) |
| Sandbox access | Not yet — behind commercial agreement |
| Formal quote | Pending — Keith to submit panels first |
| Panel review (Thriva clinical team) | Blocked on Keith's submission |
| Contract / terms | Not started |

---

## Agreed / Confirmed

- Magnesium, calcium, potassium removed from all panels — biologically unstable in transit, confirmed by Sophia and by Thriva clinical guidance
- Albumin recommended addition to testosterone panel for proper TRT qualification — included in Kit 1
- Active B12 added to Kit 2 and Kit 3 — most people deficient even when supplementing, good conversion pathway
- Clinical governance fee (~£8–9/test) is mandatory pre-CQC, removed once Andro Prime holds CQC registration
- API integration is free but requires 200 tests/month within 3 months
- Tasso device preferred (lower failure rate than fingerprick)
- Lab partner: Thriva Solutions (UKAS ISO 15189)

---

## Open Commercial Items

| Item | Andro Prime position | Thriva position | Gap |
|---|---|---|---|
| COGS target (Kit 1) | £17 | ~£60–70 (Tasso + lab + clinical governance) | Significant — margin model needs revisiting |
| Volume minimum | <50/month | 200 tests/month by month 3 | 4× gap — may need to negotiate or find bridge |
| Kit assembly | Fingerprick preferred (cheaper) | Tasso recommended | Cost vs. failure-rate trade-off |

---

## Open Technical Questions — Ask Thriva Before Integration

| Question | Why it matters |
|---|---|
| Is there a `report_text` or `clinical_note` field on the result set endpoint? | Determines whether Thriva's clinical team produces any text content we consume, or whether their governance is a safety gate only (no API-accessible content) |
| Does the clinical governance review produce output accessible via the API, or is it delivered via Clarity (their white-label UI) only? | If it's API-accessible, we need to decide whether to display it alongside or instead of our own classifier copy |
| Are there any result set fields not listed in the public docs — e.g. interpretation, recommendations, severity labels? | Prevents us building copy logic that duplicates something Thriva already provides |
| What is the production lab identifier? (Sandbox uses `TUR1`) | Needed before go-live |
| How is the webhook URL registered — via dashboard or programmatically? | Affects our deployment sequence |

---

## API Integration — Key Findings (from public docs, April 2026)

Full technical spec: `09_website-app/docs/thriva-integration-spec.md`
Raw API reference: `correspondence/2026-04-19-thriva-api-docs.md`

Summary of what's confirmed before we have sandbox credentials:

- OAuth 2.0 Client Credentials (client_id + client_secret — provided post-signing)
- JSON API specification format throughout
- Sandbox lab identifier: `TUR1`
- Webhooks delivered via Svix (headers: `svix-signature`, `svix-id`, `svix-timestamp`)
- Webhooks send IDs only — results must be fetched via callback to `GET /v1/result-sets/{id}`
- Special sandbox postcodes trigger specific test scenarios

Two architecture corrections identified in our current webhook handler — tracked in `09_website-app/docs/thriva-integration-spec.md`.

---

## Action Items

| Action | Owner | Status |
|---|---|---|
| Send biomarker panel builder link | Sophia | Pending |
| Review panels with Ewa, build in panel builder | Keith | Pending |
| Submit selected panels for formal quote | Keith | Pending |
| Thriva clinical team review of submitted panels | Thriva | Blocked on Keith |
| Negotiate COGS — explore fingerprick to close gap | Keith | Pending |
| Negotiate volume minimum — propose phased ramp | Keith | Pending |
| Ask open technical questions above during commercial discussions | Keith | Pending |
| Obtain sandbox credentials (post-signing) | Thriva | Pending — requires signed agreement |
| Engineer contact sent to Thriva for sandbox onboarding | Keith | Pending |
