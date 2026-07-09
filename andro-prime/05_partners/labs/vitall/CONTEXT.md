# Vitall — Partner Context

**Status:** CONFIRMED lab partner. Services agreement **bilaterally executed 2026-06-02**; integration **E2E-proven** (live purchase → dispatch → results). ⚠️ Also a direct DTC competitor — see the channel-conflict note in `../../CONTEXT.md` and the strategy in `../../../01_strategy/STATE.md`.
**Legal entity:** Healthy Human Labs Ltd. **Accreditation:** UKAS ISO 15189 — held at the **sub-processor lab** level (TDL, Inuvi, Alderley Lighthouse Labs), verifiable on the public UKAS register (ukas.com). Vitall's own reports do not carry the UKAS symbol (agreement §3.6). This is the substantiation basis for the marketing claim "analysed by an accredited UK laboratory." Substantiation **agreed with Ben (Vitall); confirmed by Keith 2026-07-09**. ⚠️ The written per-lab substantiation artefact (naming which lab holds which UKAS number) is **not yet filed in-repo — file on receipt.**
**Current negotiation / correspondence state:** `vitall-negotiation-log.md` (volatile — re-verify Gmail before quoting specifics).

---

## Contacts

Canonical record: `contacts.md`. **Ben Starling = `ben.starling@vitall.co.uk`** (verified). Never use the bare `ben@vitall.co.uk` alias (his email *signature* shows it, but it's never been confirmed working — risks bounce / wrong inbox). Laura Sutton = commercial (historic). New contacts go in `contacts.md`, not scattered across correspondence metadata.

## Commercial terms (executed agreement, 2026-06-02)

- **API:** Sync Pro tier — £0 setup, £0 monthly access fee, per-kit COGS only. White-label platform (standard design) £0. Pre-CQC supported.
- **COGS (all-in: kit + lab + postage both ways):**

  | Kit | Lancet (finger-prick) | Tasso (easy-draw) |
  | --- | --- | --- |
  | Kit 1 | £58.50 | £88.50 |
  | Kit 2 | £63.00 | £93.00 |
  | Kit 3 | £98.00 | £128.00 |

- **Contract shape:** liability caps £50k / £100k; **controller-to-controller** data roles (Vitall is an independent Data Controller for testing/results data — NOT a processor); 12-month initial term auto-renewing on 90-day notice. **Commencement pinned 08-05-2026** (per Order Form, not signing date) → initial term ends ~08-05-2027; **give 90-day notice by ~07-02-2027** to avoid auto-renewal. No exclusivity, no minimum volume (nothing blocks a second lab or going direct).
- **Insurance (clause 9.11, written into the contract):** PI £2m, product liability £5m, public liability £5m. Provision to supply the certificate for AP's compliance file **agreed with Ben (Vitall); confirmed by Keith 2026-07-09.** ⚠️ Certificate artefact **not yet filed in-repo — file on receipt.** Non-blocking.
- Clinical governance sits with Vitall's lab partners, not Vitall; doctors' notes stay with the lab. **Sub-processor labs:** self-collection samples go to **The Doctors Laboratory (TDL)**, **Inuvi Diagnostics**, **Alderley Lighthouse Labs**. Real turnaround ~24h from lab receipt (the customer-facing "2–5 working days" is conservative wording).

## Kit mapping & panels

Production shortCodes (Ben, 2026-05-08): Kit 1 `andro-prime-hormone-check`, Kit 2 `andro-prime-energy-metabolism`, Kit 3 `andro-prime-combo-test`. Confirmed biomarker names per kit + the results-engine matching notes are the authoritative copy in `../../../09_website-app/CONTEXT.md` (Vitall kit mapping) — keep them in sync there, not duplicated here.

## Integration

Engineering lives in `09_website-app`: OAuth 2.0 client_credentials (7-day tokens); dispatch `app/api/vitall/dispatch`; inbound webhook `app/api/webhooks/vitall` → QStash → `app/api/jobs/process-result`. Vitall does **not** auto-replay webhooks after its retry window (10 attempts / exp backoff / ~6-day window) → a `GET /orders` reconciliation poll is the safety net. Failed samples signal as status `sample-issue` (all fail) OR `results-available` with per-marker null+note (parser must not assume results-available = all markers present). Spec: `../../../09_website-app/docs/vitall-integration-spec.md`; assessment: `vitall-api-assessment.md`.

## Data-ownership safeguard

Because Vitall is an independent controller AND a competitor, **persist our own full results payload on every order.** On exit Vitall retains customer results and we cannot compel deletion — our own copy is the disintermediation + continuity safeguard.
