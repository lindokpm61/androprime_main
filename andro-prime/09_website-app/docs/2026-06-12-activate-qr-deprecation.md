# Decision: deprecate the `/activate` login-gated QR flow

**Date:** 2026-06-12
**Owner:** Keith
**Status:** Decided — code marked deprecated, not yet removed

## Decision

Scrap the per-order, login-gated kit-activation flow. Keep (eventually) a single
**generic "how to take your sample" URL/QR** printed on every box — no login, no
per-order ID, no activation plumbing.

## Why

Investigation on 2026-06-12 established that the `/activate` flow is redundant for
its two supposed jobs:

1. **Authentication** — the customer is already signed in passwordlessly. At
   checkout, `/auth/post-checkout` mints and redeems a magic link server-side, so
   they land in their account logged in. Later re-entry is via emailed magic link /
   password. The QR adds no auth value.

2. **Making results flow** — Vitall links the sample to the customer at
   **dispatch** (`POST /order/create` with our `partnerOrderId`). The tube barcode
   is pre-associated on Vitall's side. Results return keyed by `partner_order_id`
   regardless of whether the customer ever scans anything. There is no customer-side
   barcode/kit registration step in Vitall's model.

The only genuine value a box code offers is the **open-the-box moment** (straight to
mobile sampling instructions) and a soft **"started vs. drawer" engagement signal**.
Neither needs a per-order ID or a login wall. A dumb generic URL covers both.

The complicated version we partially built also never solved its own precondition:
the QR must encode the order UUID, which only exists after purchase, but Vitall
fulfils the physical box — so nothing was ever printing a per-order code anyway.

## What this deprecates

- **Route:** `app/activate/` (`page.tsx`, `layout.tsx`) — the login-gated activation screen.
- **API:** `app/api/activate/route.ts` — stamps `kit_orders.kit_activated_at`.
- **Lib:** `lib/activate/getKitActivation.ts`, `lib/activate/sendActivationLink.ts`.
- **Components:** `components/activate/KitActivator.tsx`, `components/activate/ScanAgainButton.tsx`.
- **DB:** `sample_registrations` table — defined in schema/types but **never written
  to by app code**; the barcode↔order mapping it modelled is held by Vitall, not us.
- **Column:** `kit_orders.kit_activated_at` — only set by the deprecated `/api/activate`;
  it is an internal engagement metric, not a functional dependency.

Marked deprecated (header comments added to the code files above) rather than deleted,
so the working build is untouched and the decision is reversible.

## Replacement (future, not built)

A single static public page (e.g. `/how-to-sample` or per-kit `/how-to-sample/[kit]`)
hosting a **short how-to-sample video** plus the step text, linked from a **generic QR**.

**QR placement: on the kit insert / leaflet, NOT the packaging sleeve** (Keith,
2026-06-12). The sleeve stays clean per the brand/packaging direction; the insert is the
right home because the customer reaches it at the open-the-box moment, which is exactly
when the video is useful. Same generic QR on every insert — no auth, no order ID, no
`sample_registrations`. Optional: fire a lightweight `sample_started` event for the
engagement nudge if a scan is detected.

See also: kit packaging redesign (Refined Monogram box rebrand) and the Vitall
self-collection insert question for Ben (whether Vitall's own kit insert can be suppressed).
