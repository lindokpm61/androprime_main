# Vitall — Partner Context

**Status:** CONFIRMED lab partner. Services agreement **bilaterally executed 2026-06-02**; integration **E2E-proven** (live purchase → dispatch → results). ⚠️ Also a direct DTC competitor — see the channel-conflict note in `../../CONTEXT.md` and the strategy in `../../../01_strategy/STATE.md`.
**Legal entity:** Healthy Human Labs Ltd. **Accreditation:** UKAS ISO 15189 — held at the **sub-processor lab** level (TDL, Inuvi, Alderley Lighthouse Labs), verifiable on the public UKAS register (ukas.com). Vitall's own reports do not carry the UKAS symbol (agreement §3.6). This is the substantiation basis for the marketing claim "analysed by an accredited UK laboratory." Substantiation **agreed with Ben (Vitall); confirmed by Keith 2026-07-09**. ⚠️ The written per-lab substantiation artefact (naming which lab holds which UKAS number) is **not yet filed in-repo — file on receipt.**
**Current negotiation / correspondence state:** `vitall-negotiation-log.md` (volatile — re-verify Gmail before quoting specifics).

**Customer-facing copy rule (Keith, 2026-07-19):** because Vitall is a direct DTC competitor, **do not name Vitall on any blog article or marketing page**, we don't advertise a competitor. Use **"UKAS ISO 15189-accredited lab"** for the trust signal (which is also the more accurate substantiation, since the UKAS symbol sits with the sub-processor labs, not Vitall's own report). **Exception:** the legal **privacy policy and terms MUST still name Vitall** as the independent data controller / testing partner (UK GDPR transparency + contractual flow-down). Rule + de-brand wording: `06_marketing/seo-ai-search/seo-content-context.md` blog-rule 8.

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

## No Vitall-side customer contact (rule, 2026-08-21)

**Vitall must never be able to reach an Andro Prime customer directly.** We deliver results entirely through our own interface from the API payload; every Vitall-side touchpoint is switched off or made unreachable.

**Enforced structurally, not by config.** The patient block is built by `buildVitallPatient()` in `09_website-app/frontend/lib/vitall/identity.ts`, whose signature **takes no email and no phone parameter**, so neither can be reinstated by accident; `scripts/test-vitall-patient-payload.ts` (21 assertions, in the `npm test` chain) fails if a real mailbox or phone ever appears in the payload. `createOrder` sends a **synthetic** patient address, `${users.id}-andro-prime@vitall.co.uk` (`09_website-app/frontend/lib/vitall/identity.ts`), and **no phone number**. Vitall use email only as the patient account's unique key and ignore anything `@vitall.co.uk` on a partner account (Ben Starling, 2026-08-21); it is their own pattern for in-clinic registrations where the client never gets account access. Name, DOB, sex and address stay real, because the lab needs them.

- **Derive it from the USER id, never the order id.** Vitall dedupe patients on this address, so a stable per-user value keeps a repeat customer's kits consolidated onto one Vitall patient record. It is also more stable than the real email, which a customer can change between kit 1 and kit 2.
- **Nothing in the flow depends on the value.** Kit-to-order linkage is Vitall pre-printing the kit against the order (Ben, 2026-06-03), the customer never registers a kit, results return on `partner_order_id` + `partner_user_id`, and our own longitudinal history is keyed on `users.id`.
- **It also removes a paid-then-failed dispatch risk:** `POST /order/create` returns 400 when the email is already registered under a *different* partner account, and Vitall are a direct DTC competitor with their own customers and other partners.
- **Vitall's acceptance is verified, not assumed (2026-08-21).** A sandbox `POST /order/create` with a synthetic `@vitall.co.uk` patient address was accepted (order `322945081`), echoed the address back verbatim and returned `"phone": null`. Their validator does not reject their own domain and does not require a phone number. The sandbox (`vitallsync.com`) accepts the **same client id and secret as production**, so a future probe needs only `VITALL_SANDBOX=true`.
- **Do not render `order_status.guidelines`** from the payload. It carries a "log in to see your results" instruction pointing at `andro-prime.vitall.co.uk`, which Vitall cannot suppress. We do not read that field anywhere; keep it that way.

**What Ben switched off on their side, 2026-08-21:** order confirmation, "received at lab", "results available", any other transactional email from any sender, plus their mailing list and reminders. Results PDF was never emailed to customers. SMS is nursing-visits only (N/A, we are self-collection). **Still not disableable:** auto account creation on `andro-prime.vitall.co.uk` and existing logins on that subdomain, both on their dev plan with no date. The synthetic address is what makes those two moot. Keith's own access on keith@andro-prime.com is retained deliberately. Full exchange: `correspondence/2026-08-21-keith-disable-customer-touchpoints-draft.md`. **Closed out 2026-08-24 (Ben):** *"All orders/users except your admin account are now removed"*, so the dormant accounts on the subdomain are **deleted, not just unreachable**; **the patient email address is never printed on the kit or the Lab Request Form** (*"the email doesn't get printed or appear anywhere"*), which is what makes the synthetic address safe to ship; and **the return mailbag and its label must remain exactly as they are**, a hard constraint on any kit-branding work. `correspondence/2026-08-24-ben-reply-purge-and-laura-handover.md`.

## Kit branding: how the sleeve actually gets made (confirmed 2026-08-24)

Durable mechanics. Live status, geometry and the open aperture dispute live in `02_brand/STATE.md`.

- **Laura Sutton (`laura.sutton@vitall.co.uk`, Head of Growth) owns packaging**, not Ben. He routed it to her on 2026-08-24 and she answered the same afternoon. She also authored Vitall's kit artwork, so she is a first-hand source on the dieline.
- **We supply sleeves printed; Vitall does not print them.** Their trusted print partner is **Mega-Pak** (`mega-pak.com`), whom **we contract and pay directly**. Vitall makes the introduction and then steps out. Mega-Pak ships finished sleeves **straight to the fulfilment centres**, so we never take delivery and carry no storage or inbound QC step.
- **No new die is needed provided we build to Vitall's dimensions.** Any change to aperture size, position or radius is a new tool at our cost.
- **The 500-unit minimum is PER SLEEVE DESIGN**, not across the range. Only the sleeve front is kit-specific, so each kit's front is its own 500 run.
- **Setup is about a month, and the constraint is Mega-Pak's capacity**, not Vitall's. An unquoted third party therefore sits on the kit critical path.
- **The IFU and the Lab Request Form can both carry Andro Prime branding**, produced at the same time as the sleeves. They are one workstream with the sleeve, not three. Vitall need our logo as **SVG or vector**.
- **The collection protocol is identical across all three test codes.** The printed in-box instructions never vary; per-test differences ride the API `guidelines` field, which we deliberately do not render (see the rule above).
- **The return mailbag and its label must remain exactly as they are** (Ben, 2026-08-24). Branding goes around them, never over them.

## Data-ownership safeguard

Because Vitall is an independent controller AND a competitor, **persist our own full results payload on every order.** On exit Vitall retains customer results and we cannot compel deletion — our own copy is the disintermediation + continuity safeguard.
