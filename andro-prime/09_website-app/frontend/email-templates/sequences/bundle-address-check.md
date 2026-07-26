# Bundle address check (second-kit dispatch)

**Status:** Copy DRAFTED 2026-07-26 (real copy below, replacing the earlier placeholder), then run through the `/stop-slop` pass 2026-07-26 (killed the passive "about to be prepared for dispatch", the "review and update" doublet, "currently on your account" padding, and the filler "just"; active voice throughout, ~43/50). Compliance pre-flight run 2026-07-26: 0 HARD, no health claim, no em dash. **APPROVED by Ewa + Keith 2026-07-26** (CA-027; table below). Built as a **DRAFT** Customer.io campaign 2026-07-26 (see the trigger section for the campaign id). Copy is signed off; do not activate until `BUNDLES_ENABLED` + `ACCOUNT_ADDRESS_ENABLED` are live.
**Platform:** Customer.io
**Goal:** For every two-kit bundle purchase (Confirmation / Prove-It / Full-picture), confirm the customer's delivery address before the second, later kit ships. Gives a soft 4-day window to update the address; after that the bundle sweep auto-dispatches to whatever address is current. This is the only touchpoint before an unattended, automated second dispatch, so it needs to be unambiguous about what is about to happen and give an easy way to change the address.
**Tone:** Plain, practical, no hype. This is a logistics email, not a sales email — the purchase already happened. No urgency framing beyond "please check this before day X."

**Compliance note:** No health claim of any kind belongs in this email — it is purely a delivery-address confirmation. Do not reference the first result's classification (low/borderline/all-clear) even for the Confirmation bundle; the customer already knows why they are getting a second kit from the original purchase copy, this email's only job is the address. No em dash anywhere in the copy.

---

## Trigger & segment (Customer.io build — DRAFT BUILT 2026-07-26)

**Built as DRAFT:** campaign `24` ("T-11 — Bundle Address Check"), type `transactional`, trigger event `bundle_address_check`, single email action `108` (`sending_state: draft`), template `55` (from Keith / identity 1, subject "Please confirm your delivery address", preheader set). No stop-goal (one-shot logistics send). Liquid lint clean (0 errors, local + live). No `{% if %}` branches, so no test-send gate. **Not activated** (draft) — pending the sign-off table above + `BUNDLES_ENABLED` and `ACCOUNT_ADDRESS_ENABLED` live.


- **Event:** `bundle_address_check`, emitted by `app/api/jobs/bundle-sweep/route.ts` (Pass B) when a `bundle_dispatches` row moves from `trigger_met` to `awaiting_window`. Fires once per bundle per second-kit cycle — the sweep only sends it while the row is in `trigger_met` and moves it out of that status in the same run, so a normal single daily sweep run cannot double-send it.
- **Event data:**

  | field | type | meaning |
  | --- | --- | --- |
  | `bundle_type` | string | `'confirmation'` \| `'prove_it'` \| `'full_picture'` — which SKU this bundle is |
  | `kit_type` | string (`public.kit_type`) | the **second** kit about to ship (may differ from the original purchase — Full-picture's second kit is a Kit 2 energy-recovery, not the Kit 3 hormone-recovery the customer originally bought) |
  | `parent_order_id` | uuid | the original `kit_orders` row, for support lookup / personalization if ever needed |

- **Recommended campaign type:** event-triggered (not `date`), frequency `once per event occurrence`, sent immediately on `bundle_address_check`.
- **Window messaging:** the email must say plainly that the second kit ships automatically after a set number of days (`ADDRESS_CHECK_WINDOW_DAYS = 4` in code, `lib/bundles/config.ts`) unless the customer updates their address before then. Keep the exact day count in sync with that constant if it ever changes — do not hardcode a different number in copy without checking the code value first.
- **Idempotency:** the sweep only emits the event on the `trigger_met` → `awaiting_window` transition, which happens once per row (barring the manual cancel path, which removes the row from play entirely). No suppression logic is expected to be needed, but confirm this once the campaign is actually built.

---

## Dependencies — do not build/activate until these are resolved

1. ~~**Address-update surface.**~~ **BUILT 2026-07-26**, dark behind `ACCOUNT_ADDRESS_ENABLED`: a self-serve "Delivery address" section on `/account` (`components/account/AddressSection.tsx` + `PUT /api/account/address` + `lib/account/getAddress.ts`) that edits the exact `users` address columns the second-kit dispatch reads. The email CTA links to `https://andro-prime.com/account`. **Set `ACCOUNT_ADDRESS_ENABLED=true` in Coolify (alongside `BUNDLES_ENABLED`) before activation**, else the CTA lands on an account page without the address section.
2. **F3 ClickUp gate (`869e8w56x`, subtask of B1 prereqs `869e74vwz`).** Tracked in ClickUp as one of the two bundle build gates (alongside F4, `869e8w573`); confirm its scope covers what this campaign needs before considering it cleared. Separately, the **solicitor D2 gate** (bundle terms, including banked-kit 12-month validity) is a business-level precondition for the bundle mechanism as a whole and should be cleared before this campaign is activated, since the email is part of the same customer-facing bundle experience the terms cover.
3. **Compliance pre-flight + Ewa sign-off** on the actual copy (below is a placeholder draft only, written to spec the structure — not reviewed).
4. **BUNDLES_ENABLED must be live** before this event can ever fire in production (the sweep no-ops entirely while the flag is off).

---

## Sign-off

| | Name | Decision | Date |
|---|---|---|---|
| Clinical / compliance | Dr Ewa Lindo | APPROVED (Keith relay) | 2026-07-26 |
| Business | Keith Antony | APPROVED | 2026-07-26 |

Logged as **CA-027** in `03_compliance/content-approval/content-approval-register.md` (record: `approval-record-bundle-address-check-2026-07-26.md`). Copy approval only: activation stays gated on `BUNDLES_ENABLED` + `ACCOUNT_ADDRESS_ENABLED` live.

---

## Email 1 — Confirm your delivery address

**Subject:** Please confirm your delivery address
**Preview:** Your next Andro Prime kit is about to ship.

---

Hi {{ customer.first_name | default: "there" }},

We are getting your next Andro Prime kit ready to send.

Before it goes out, please check we have the right delivery address for you. Update it here if anything has changed:

[Check my delivery address](https://andro-prime.com/account)

If we do not hear from you, we will send your kit to the address on your account in 4 days.

Any questions, reply to this email and we will help.

Keith

Andro Prime

---

_The "4 days" figure mirrors `ADDRESS_CHECK_WINDOW_DAYS` in `lib/bundles/config.ts` (currently 4). If that constant changes, update this copy in the same change. The CTA links to `/account`, where the ACCOUNT_ADDRESS_ENABLED "Delivery address" section edits the exact `users` columns the second-kit dispatch reads._
