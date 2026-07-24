# Bundle address check (second-kit dispatch)

**Status:** SPEC only — placeholder copy below is **DRAFT - NOT APPROVED - needs compliance pre-flight + Ewa sign-off**. Nothing in this file has been reviewed. No Customer.io campaign has been built from it yet (unlike `retest-reminder-all-clear.md`, which has a live draft campaign id). Do not send, do not build the CIO campaign as anything but DRAFT, until the sign-off table below is filled in.
**Platform:** Customer.io
**Goal:** For every two-kit bundle purchase (Confirmation / Prove-It / Full-picture), confirm the customer's delivery address before the second, later kit ships. Gives a soft 4-day window to update the address; after that the bundle sweep auto-dispatches to whatever address is current. This is the only touchpoint before an unattended, automated second dispatch, so it needs to be unambiguous about what is about to happen and give an easy way to change the address.
**Tone:** Plain, practical, no hype. This is a logistics email, not a sales email — the purchase already happened. No urgency framing beyond "please check this before day X."

**Compliance note:** No health claim of any kind belongs in this email — it is purely a delivery-address confirmation. Do not reference the first result's classification (low/borderline/all-clear) even for the Confirmation bundle; the customer already knows why they are getting a second kit from the original purchase copy, this email's only job is the address. No em dash anywhere in the copy.

---

## Trigger & segment (Customer.io build — NOT YET BUILT)

- **Event:** `bundle_address_check`, emitted by `app/api/jobs/bundle-sweep/route.ts` (Pass B) when a `bundle_dispatches` row moves from `trigger_met` to `awaiting_window`. Fires once per bundle per second-kit cycle — the sweep only sends it while the row is in `trigger_met` and moves it out of that status in the same run, so a normal single daily sweep run cannot double-send it.
- **Event data:**

  | field | type | meaning |
  | --- | --- | --- |
  | `bundle_type` | string | `'confirmation'` \| `'prove_it'` \| `'full_picture'` — which SKU this bundle is |
  | `kit_type` | string (`public.kit_type`) | the **second** kit about to ship (may differ from the original purchase — Full-picture's second kit is a Kit 2 energy-recovery, not the Kit 3 hormone-recovery the customer originally bought) |
  | `parent_order_id` | uuid | the original `kit_orders` row, for support lookup / personalization if ever needed |

- **Recommended campaign type:** event-triggered (not `date`), frequency `once per event occurrence`, sent immediately on `bundle_address_check`.
- **Window messaging:** the email must say plainly that the second kit ships automatically after a fixed number of days (`ADDRESS_CHECK_WINDOW_DAYS = 4` in code, `lib/bundles/config.ts`) unless the customer updates their address before then. Keep the exact day count in sync with that constant if it ever changes — do not hardcode a different number in copy without checking the code value first.
- **Idempotency:** the sweep only emits the event on the `trigger_met` → `awaiting_window` transition, which happens once per row (barring the manual cancel path, which removes the row from play entirely). No suppression logic is expected to be needed, but confirm this once the campaign is actually built.

---

## Dependencies — do not build/activate until these are resolved

1. **Address-update surface.** This email needs to link to somewhere the customer can actually update their delivery address before the auto-dispatch. **Not yet confirmed to exist** in the app account area (`/account` or similar) — check first; if it does not exist, it needs to be built or the link needs to point somewhere that works (e.g. a support email) before this campaign can go live. This is listed as an open item in `STATE.md`'s bundle entry and the build-record doc (`docs/2026-07-24-bundle-mechanism-build.md`).
2. **F3 ClickUp gate (`869e8w56x`, subtask of B1 prereqs `869e74vwz`).** Tracked in ClickUp as one of the two bundle build gates (alongside F4, `869e8w573`); confirm its scope covers what this campaign needs before treating it as cleared. Separately, the **solicitor D2 gate** (bundle terms, including banked-kit 12-month validity) is a business-level precondition for the bundle mechanism as a whole and should be cleared before this campaign is activated, since the email is part of the same customer-facing bundle experience the terms cover.
3. **Compliance pre-flight + Ewa sign-off** on the actual copy (below is a placeholder draft only, written to spec the structure — not reviewed).
4. **BUNDLES_ENABLED must be live** before this event can ever fire in production (the sweep no-ops entirely while the flag is off).

---

## Sign-off

| | Name | Decision | Date |
|---|---|---|---|
| Clinical / compliance | Dr Ewa Lindo | Not yet reviewed | — |
| Business | Keith Antony | Not yet reviewed | — |

Not yet logged in `03_compliance/content-approval/content-approval-register.md` — do so once approved.

---

## Email 1 — Confirm your delivery address (DRAFT - NOT APPROVED)

**Subject (draft, needs sign-off):** Please confirm your address for your next kit
**Preview (draft):** Your second kit is on its way soon.

---

DRAFT COPY — NOT APPROVED - needs compliance pre-flight + Ewa sign-off before use.

Your second kit is about to be prepared for dispatch as part of your Andro Prime bundle.

Before we send it, please take a moment to confirm the delivery address on file is still correct. If you have moved, or need to update anything, you can do so here: [address-update surface link, TBC].

If we do not hear from you, we will dispatch your kit to the address currently on your account in [ADDRESS_CHECK_WINDOW_DAYS] days.

If you have any questions, reply to this email and we will help.

Keith

Andro Prime

---

_Placeholder only. Rewrite/finalise through the normal copy sign-off process before this is loaded into Customer.io as anything beyond a DRAFT campaign. Keep the day count in the copy in sync with `ADDRESS_CHECK_WINDOW_DAYS` in `lib/bundles/config.ts`._
