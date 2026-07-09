# Vitall — Negotiation & Correspondence Log

Living doc: current operational state of the Keith ↔ Ben Starling relationship. Durable partner facts (terms, contacts, integration) are in `CONTEXT.md`. **This is a volatile snapshot — state changes whenever Ben replies. Re-verify Gmail (`gws gmail`) before quoting draft ids or "who owes what" back to Keith.** Thread ids below are stable; draft ids are not.

_Last updated: 2026-07-09 (Ben/Vitall four-item thread closed out — see below)._

---

## Ben/Vitall thread close-out — AGREED 2026-07-09

Per Keith (2026-07-09): the four open items in the Ben/Vitall thread have all been **agreed with Ben (Vitall)**; the services agreement is signed. Documented here as the agreed position (no email sent). Where a physical artefact is expected, it is flagged "not yet filed in-repo — file on receipt."

1. **UKAS / ISO 15189 accreditation substantiation** — AGREED with Ben; confirmed by Keith 2026-07-09. Basis already on record: signed agreement §3.6 (sub-processor labs UKAS accredited, verifiable at ukas.com) + `03_compliance/clinical-governance-position.md`. Underpins the marketing claim "analysed by an accredited UK laboratory." ⚠️ Written per-lab substantiation artefact **not yet filed in-repo — file on receipt.** Marketing gate updated in `06_marketing/content/track-a-launch-copy.md`.
2. **Per-kit collection protocol confirmation (CA-019 condition)** — Ben (Vitall) confirms the per-kit collection requirements (esp. Kit 2/3) match Vitall's actual test protocols; confirmed by Keith 2026-07-09. Recorded against CA-019 §3. ⚠️ Written confirmation from Ben **not yet filed in-repo — file on receipt.**
3. **Insurance certificate (clause 9.11)** — provision AGREED with Ben; confirmed by Keith 2026-07-09. ⚠️ Certificate artefact **not yet filed in-repo — file on receipt.** Non-blocking.
4. **CA-019 sequencing rule** — AGREED with Ben: our kit-collection comms go live **before** Vitall's customer-facing emails are disabled, so no window where neither party tells customers how to collect. Recorded against CA-019 §3.

---

## Current state — DONE

- **Agreement:** fully executed, bilaterally signed **2026-06-02** (Ben countersigned; commencement pinned 08-05-2026). Keith's signed copy = Drive `1Oy1X6b_2INNojzFGpf3EOW85uM_YPNfj`. Terms in `CONTEXT.md`.
- **Integration:** E2E complete and **proven in production.**
  - Inbound path proven against real Vitall payloads (webhook → QStash → process-result → `lab_results`/`biomarker_values` → dashboard classify): SIM 29/29 + real-qstash 21/21 PASS; happy path (orders `322941381/382`) + failure path (`sample_failed`) both verified in prod DB.
  - **Front half proven 2026-06-25:** a real live-site Stripe purchase auto-created the order AND auto-dispatched to Vitall (`vitall_order_id=322942444`). The whole pipe is green → Experiment-0 fulfilment gate = PASS. _(Root cause of the prior gap was a missing live-mode Stripe webhook endpoint — see `09_website-app/STATE.md`.)_
  - Ben's 2 Jun answers closed the integration questions (webhook config live; retry = 10 attempts / exp backoff / ~6-day window / no auto-replay → `GET /orders` poll; failed-sample signalling; recollection via care@vitall.co.uk until an API exists). Turnaround wording locked to "typically 24–48 hours from the laboratory receiving your sample."

## Still owed

- **Ben → Keith (non-blocking, artefacts only — all agreed 2026-07-09, see close-out above):** insurance certificate (clause 9.11); written per-lab UKAS/ISO 15189 substantiation; written per-kit collection-protocol confirmation. File each on receipt.
- **Keith → Ben (held, unsent, deferred until needed):** consolidated feasibility fill-in (liver panel + Omega-3 Index + Kit 3 Plus) and a Kit 1 Prolactin ask. Both are roadmap; **strip ApoB/homocysteine/insulin framing** per the competitor pivot, and keep them lean per the middleman-correspondence rule (`../../CONTEXT.md`). Needs Keith's scope call before sending.

## Open decisions (Keith)

- **Packaging (Ben answered all 6 points 2026-06-03):** AP outer sleeves + AP insert = YES, FOC at min 500 sleeves; de-branded collection instructions available; no kitting surcharge; **sleeve must match Vitall kit dimensions and leave the white cutout on the back** for compliance kit-detail printing; Lab Request Form needs a logo. Kit-to-order linkage CONFIRMED (Keith creates order via API → Vitall pre-prints kit with patient details → customer never registers a kit on a Vitall page → validates our dashboard-only activation model). Open: print route (supply vs Vitall prints), sleeve artwork, logo on the form, timing (~1-mo setup now vs their in-house solution, no firm date). Packaging design state lives in `02_brand` (packaging).
- **Strategic (given the competitor pivot):** the agreement was signed controller-to-controller with a £50k cap while Vitall is now a direct competitor — flagged as a live strategic decision in `01_strategy/STATE.md`; safe-to-sign was concluded re: disintermediation (nothing blocks a second lab).

## Stable threads

- Agreement: `19e171440729157f`. Webhook retry/failed-sample: `19e7607cf1cc9bb3`. Webhook signature encoding: `19e271ac7ad41ccc`.
- Ignore unless reopened: `19daafff31be8948` + `19ddd9eae4ed8c88` (Laura Sutton discovery), `19db678f016143dc` (22 Apr call notes), `19d9d90593c94cc9` (auto-reply).

## Cadence

Ben averages ~1 week to respond, works ~4 hours, then goes quiet again. Design every email as a single-pass fill-in (see the correspondence rule in `../../CONTEXT.md`).
