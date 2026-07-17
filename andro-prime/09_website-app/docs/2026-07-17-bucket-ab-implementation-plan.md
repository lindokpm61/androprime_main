# Bucket A/B Implementation Plan

**Date:** 2026-07-17
**Scope:** the now-buildable features from `docs/2026-07-17-research-to-feature-gap-analysis.md` — everything that does NOT depend on Vitall's answer about Ferritin/Albumin.
**Owner workspace:** `09_website-app`
**Rule of engagement:** copy-sensitive and data-destructive surfaces are built to a **flag/draft/request** state, never shipped live unreviewed. Compliance sign-off (Ewa for results wording, Keith/solicitor for retention) is a hard gate, per `03_compliance/CONTEXT.md` and the root guardrails.

---

## Scope correction found during recon (read this first)

Reading the live code changed the scope materially. Two corrections:

1. **Most of Bucket B is already built.** The classifier and `biomarker-copy.ts` already implement the ferritin states end-to-end:
   - `suboptimal-ferritin` (30–100 µg/L) already renders a card with dietary-iron guidance and `primaryCta: null` (`classifier.ts:392`). **U2 is substantially done.** The only possible delta is giving it a retest CTA so it has an actionable button rather than guidance-text-only — and that is a CTA-routing change that needs Ewa. So U2 becomes *propose, don't ship*.
   - `low-ferritin` (<30) is already a GP-block state → GP referral, with Ewa-approved copy that already says *"Take your ferritin number and the reference range to your appointment"* (`biomarker-copy.ts:194`). **U1's base exists.** U1's actual substance — turning that referral into a downloadable advocacy asset — **is F3** (the GP handoff pack) applied to this card. U1 and F3 are the same build.

   Net: there is no separate "ghost-build the ferritin cards" task. The cards render the moment a ferritin value arrives in the payload. The buildable work is F3/F5/F4, and F3 is what makes the ferritin card an advocacy asset.

2. **F4's deletion half cannot be responsibly auto-built.** The compliance `deletion-policy/` directory is **empty** — there is no retention schedule. Automated erasure would have to invent retention rules (UK tax law requires financial records kept 6 years; the lab holds an independent-controller copy under the Vitall agreement; Stripe and CIO hold their own records). Those are legal decisions, not engineering ones. **So deletion is split:** build the erasure-*request* mechanism now (records the request, notifies ops, satisfies the UK GDPR 30-day response window), and leave automated hard-delete until `deletion-policy/` is written and signed off. This is flagged as owed.

---

## What gets built

### F4a — Results export (PDF + CSV) — SAFE, no gates beyond a compliance copy read
Read-only. Lets a logged-in user download their own results. Data source: `lab_results` + `biomarker_values` (schema confirmed in `getDashboardData.ts:43–92`). Doubles as the GP-handoff renderer (F3) and the data-portability half of F4.

- **Renderer approach:** _[PENDING RECON — decided by whether Vitall's `results_pdf`/`results_html` base64 is persisted, and whether any PDF lib exists. If the Vitall PDF is stored, serving it is the cheapest export; if not, build a print-to-PDF HTML route. Filled in after the recon subagent reports.]_
- CSV is trivial and dependency-free: marker, value, unit, reference range, date, kit.
- Route: `app/api/account/export/route.ts` (auth via `getCurrentUser`, Supabase server client, EU region). Follows existing `app/api/*/route.ts` conventions.

### F4b — Data-use statement on the account page — copy, compliance-flagged
A plain-English "how your health data is used, and that we do not sell it" block on `/account`. Directly answers the Theme 6 privacy anxiety. Every asset for the claim already exists (Ireland residency, CA-018 consent, controller position). Copy drafted here, **not shipped until compliance signs the wording** (it is a data-processing representation, so it is a compliance surface, not just marketing).

### F4c — Erasure/DSAR **request** (not automated deletion) — safe
A "request your data / request deletion" control on `/account` that records the request and fires an ops alert (mirror `emitOpsAlert()` used by the lab-cancel flow), so a real erasure request is captured and actioned manually inside 30 days. **Does not delete anything automatically.** The automated cascade waits on the retention policy. Clearly labelled to the user as a request that will be actioned, not an instant wipe.

### F3 / U1 — GP handoff pack — marker-agnostic, shares the F4a renderer
A downloadable/printable one-pager for a result, carrying: name + DOB, collection method/date, lab + UKAS accreditation line (per Vitall agreement §3.6 — report does NOT show the UKAS symbol, but states the sub-processor labs are UKAS accredited), full results with reference ranges, and "questions to take to your GP". Surfaced most prominently on GP-referral results (low ferritin, high CRP, low/borderline T). **Pure advocacy, no clinical claim** — but the wording is exactly where the advocacy/diagnosis line sits, so **Ewa signs the template before it ships.** Must use "Ewa-approved recommendation logic" framing, never "reviewed by our doctor" (compliance red-flag table).

### F5 — "What this test didn't tell you" — copy, compliance-flagged
One paragraph on a normal-T Kit 1 result, before the Kit 2 cross-sell, stating plainly that Kit 1 tested testosterone only and did not test Vitamin D / B12 / inflammation. Defuses the upsell objection (Theme 6) and enforces the Kit-1-scope rule the compliance file already mandates (`03_compliance/CONTEXT.md` "Results copy scoping"). Rendered from a small static map keyed by kitType, shown only on the `normal-testosterone` + `testosterone` kit branch. Copy through the pre-flight before it ships.

---

## What is explicitly NOT built (and why)

- **U2 retest CTA** — needs Ewa (CTA routing). Proposed, not built.
- **Automated account deletion** — needs the retention policy (`deletion-policy/` empty). Request mechanism built instead.
- **Anything customer-facing that asserts we deliver Ferritin/Albumin** (U4, U5) — waits on Ben.
- **F2 sample-confidence sizing** — needs the QNS rate from Ben.

---

## Flags & gates

| Item | Ships behind | Sign-off needed before live |
|---|---|---|
| F4a export | Nothing (read-only) — but linked from account only when built | Compliance read of the export footer/disclaimer copy |
| F4b data-use statement | Draft copy in place, not linked until approved | Compliance (data-processing representation) |
| F4c erasure request | Live-able (records a request) | Keith — confirm the ops-alert address + SLA wording |
| F3/U1 GP handoff | Env flag `GP_HANDOFF_ENABLED` (mirror `MAINTENANCE_OFFER_ENABLED`), default OFF | **Ewa** signs the template wording |
| F5 didn't-test paragraph | Env flag `KIT_SCOPE_NOTE_ENABLED`, default OFF | Compliance pre-flight on the paragraph |

The flag pattern is the established one: read `process.env.X === 'true'` server-side per call, default OFF must be byte-identical to before (`classifier.ts:104` `isMaintenanceOfferEnabled`, test-asserted).

---

## Verification plan

1. `next build` green (not just `tsc` — build enforces route-export rules per CONTEXT.md).
2. `npm test` — classifier + results suites stay green; flags-OFF output byte-identical (add assertions mirroring the maintenance-offer tests).
3. Drive the real surfaces with the dev fixture mechanism (`getDashboardData` dev scenarios, `dev/seed-result`) — export a seeded result, render the handoff, confirm F5 shows only on normal-T Kit 1.
4. No push to live for any flagged/copy item until its sign-off row above is satisfied.

---

## Sequence

1. F4a export renderer + CSV (anchor — everything else reuses it) ← _renderer approach pending recon_
2. F3/U1 GP handoff (reuses renderer) behind flag
3. F5 paragraph behind flag
4. F4b data-use statement (draft) + F4c erasure request
5. Verify (build + tests + fixture drive)
6. Sign-off checklist + STATE.md update

---

## BUILD STATUS — implemented 2026-07-17 (all dark, flags default OFF)

**Renderer decision (recon resolved):** no PDF library exists in the repo, and Vitall's `results_pdf` is stored only inside `lab_results.raw_payload` and never read back. Chose **zero new dependency**: CSV via a plain `text/csv` route, and the GP handoff as a print-CSS HTML page (browser "Save as PDF"). A server-generated PDF (jspdf/puppeteer) is a deliberate dependency decision left for later. All exports reuse `DashboardData`/`ClassifiedResult` so they cannot drift from the on-screen dashboard.

**Files added:**
- `lib/flags.ts` — `isAccountDataControlsEnabled` / `isGpHandoffEnabled` / `isKitScopeNoteEnabled` (strict `=== 'true'`, read live per call, default OFF, mirrors `isMaintenanceOfferEnabled`).
- `lib/account/exportResults.ts` — `resultsToCsv(DashboardData)`, RFC 4180, marker-agnostic.
- `app/api/account/export/route.ts` — GET, auth'd, CSV download; 404 when flag OFF.
- `app/api/account/erasure-request/route.ts` — POST, auth'd, `emitOpsAlert` only (records a REQUEST, deletes nothing); 404 when flag OFF.
- `components/account/DataPrivacySection.tsx` — data-use statement + CSV download + erasure-request button (client).
- `app/(app)/results-dashboard/handoff/page.tsx` — F3/U1 printable GP summary; `notFound()` when flag OFF.
- `components/results-engine/PrintButton.tsx` — `window.print()` trigger.
- `scripts/test-account-export.ts` — 28 assertions (flag semantics + CSV shape/quoting), wired into `npm test`.

**Files edited:**
- `app/(app)/account/page.tsx` — renders `<DataPrivacySection/>` when `isAccountDataControlsEnabled()`.
- `app/(app)/results-dashboard/page.tsx` — passes `showKitScopeNote` to KitTabs; renders GP-handoff link when a result routes to GP referral and `isGpHandoffEnabled()`.
- `components/results-engine/KitTabs.tsx` — F5 kit-scope note on normal-T Kit 1 when `showKitScopeNote`.
- `package.json` — test script includes `test-account-export.ts`.

**Verification:**
- `npm test` — full suite green (classifier regressions, consent-gate 37, maintenance-offer 42, kitCTA 10, account-export 28).
- `npm run build` — green; `/results-dashboard/handoff` compiled; all API routes type-checked and route-export-valid.
- **Flags default OFF ⇒ every new surface is inert.** The account page, results dashboard, and API routes behave byte-identically to before until a flag is set to `'true'`.
- **Not verified here:** live authenticated render-drive of the three surfaces. It needs a logged-in test user + a seeded result (both server pages `getCurrentUser()`-gate before the dev-fixture path). Do this in an interactive session with the DevFixtureBar and a test session before flipping any flag. This is the one remaining verification step and it is deliberately not faked.

---

## Sign-off checklist (before ANY flag is set to 'true')

| Flag | Gate owner | What they sign |
|---|---|---|
| `ACCOUNT_DATA_CONTROLS_ENABLED` | **Compliance** (data-use wording) + **Keith** (erasure ops-alert address + 30-day SLA wording) | The data-use statement in `DataPrivacySection.tsx` (factual accuracy against the data-controller position) and the erasure-request user copy |
| `GP_HANDOFF_ENABLED` | **Ewa** | The handoff template wording in `handoff/page.tsx` — that it is advocacy, not a clinical claim/diagnosis, and the "Ewa-approved recommendation logic" framing is correct |
| `KIT_SCOPE_NOTE_ENABLED` | **Compliance** pre-flight | The F5 paragraph in `KitTabs.tsx` (Kit 1 scope rule, no medicinal implication) |

Additionally, before the account controls go live:
1. **Run the live authenticated render-drive** (above).
2. **Confirm `OPS_ALERT_EMAIL`** is the address that should receive erasure requests, and that someone owns the 30-day action.

---

## OWED to compliance (blocker for automated deletion, not for this build)

`03_compliance/deletion-policy/` is **empty** — there is no retention schedule. The erasure-*request* mechanism is built and safe, but **automated hard-delete must not be built until a retention/deletion policy exists** (UK tax 6-year record retention, the Vitall independent-controller copy, Stripe + Customer.io records keyed on email). This is a legal decision for Keith/solicitor + Ewa, referenced against `03_compliance/gdpr-readiness-checklist.md` §6 (SAR/erasure, currently unchecked). Flagged in `09_website-app/STATE.md`.
