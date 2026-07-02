# FirstPromoter — Configuration & Integration

FirstPromoter is the affiliate sales-tracking system (clicks, attribution, commission, payout). Programme economics and partner strategy are in `../CONTEXT.md`; this file is the technical config + integration reference. Related: `../../../05_partners` / Attio partner CRM, and the Stripe config in `../../../09_website-app/CONTEXT.md`.

---

## Live status (dated)

_Live since 2026-05-22._

- **Fully integrated and live.** Customer-side tracking + Stripe OAuth attribution + PT-side onboarding all wired (details below).
- **Outstanding:**
  1. **Paid subscription** — was on a free trial with ~4 days left as of 2026-05-22; confirm it converted to paid (else tracking lapses).
  2. **Attio webhook scoping** — the `record.updated` subscription is unscoped, so it fires for People/Company edits too and creates harmless-but-noisy n8n error executions. Scope it to the Deals object.
  3. **Key rotation** — `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` + `FIRSTPROMOTER_API_KEY` were flagged for rotation post-wire.

---

## Account

- Account `andro-prime` on firstpromoter.com.
- **Tracking / account ID = `qj5zoyxs`** — one string, two roles: client-side tracking ID for `fpr.js`, and the server-side `ACCOUNT-ID` header for the v2 API.
- **Campaign:** "androprime Affiliate Program" (id `40730`). Rewards set to v2.3 economics — **£15 flat cash per kit** (promoter) + **10% discount** (customer), both scoped to one-time products (kits, not the supplement subscription).
- Keys in the gitignored **root `.env`**: `FIRSTPROMOTER_API_KEY`, `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID=qj5zoyxs`.

## API (v2 — use this; v1 paths still respond but are undocumented)

- Base: `https://api.firstpromoter.com/api/v2`
- **Auth = two headers:** `Authorization: Bearer <FIRSTPROMOTER_API_KEY>` **and** `ACCOUNT-ID: qj5zoyxs`. The `x-api-key` header from FP's old docs returns 401 — do not use it.
- **Create promoter:** `POST /company/promoters` — body `{email, cust_id, profile:{first_name,last_name}}`. Duplicate email → HTTP 400. The affiliate code is `promoter_campaigns[0].ref_token` in the response.
- **Delete:** v2 has no delete; the v1 endpoint `DELETE https://firstpromoter.com/api/v1/promoters/delete?id=<id>` still works.

## Customer-side tracking (live)

- `components/analytics/FirstPromoterScript.tsx` loads `fpr.js`, setting `_fprom_ref` + `_fprom_tid` cookies on `andro-prime.com`.
- **Stripe is connected to FirstPromoter via OAuth (live mode)** — FP attributes sales itself from Stripe events. Our own server-side `/track/sale` call was removed (Option A, to avoid double-crediting) and `lib/firstpromoter.ts` was deleted. The `_fprom_tid` cookie → Stripe `metadata.fp_tid` loop is verified end-to-end on live.

## PT-side onboarding (live)

- Flow: Attio native webhook (`record.updated`, Settings → Developers → Webhooks) → n8n `affiliate-onboarding` workflow → creates the FP promoter → writes `firstpromoter_code` + `code_issued_date` back to the Attio deal.
- Fires when a partner deal hits stage **Onboarded**; n8n's Build FP Payload node gates on stage.
- The Attio no-code "Send HTTP request" block was abandoned — it returns HTTP status 0 (never dispatches), so n8n does the HTTP call.
- **n8n gotchas:** the httpRequest JSON body must be an **expression** (`={{ }}`) or the `{{ }}` ships as literal text; custom headers (`ACCOUNT-ID`) need "Send Headers" ON.
