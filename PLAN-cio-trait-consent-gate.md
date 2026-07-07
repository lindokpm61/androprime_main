# PLAN: Gate Pre-Consent Health Traits to Customer.io

**Rank:** 4 of 5
**Type:** Code change (TypeScript) + DPIA/doc updates
**Effort:** ~2-4 hours including tests
**Dependencies:** none to build. Deploy sequencing constraint at the end matters.

---

## Goal

Five health-derived traits — `low_vitamin_d`, `low_b12`, `elevated_crp`, `crp_level` (raw mg/L value), `low_ferritin` — are currently emitted **unconditionally** to Customer.io (a US processor) at result-processing time, before any consent check. The code acknowledges this (`processResult.ts` ~30-32: "Energy-marker traits below remain unconditional pending a separate data-minimisation decision... flagged in the DPIA §4") and the DPIA lists it as an open pre-launch gap (`03_compliance/dpia/phase0-dpia.md` ~59). Testosterone traits were already fixed the right way: they emit only after explicit consent.

This plan implements the **conservative option** of the open decision: gate the five energy traits on the CA-018 health-data-processing consent (the Art 9(2)(a) checkbox captured at checkout, approved by Ewa + Keith 2026-06-23), and drop the raw `crp_level` value entirely for data minimisation. Keith reviews the diff before it deploys; the alternative (documenting a lawful basis instead of gating) stays available to him and Ewa — say so in your report. Volume today is ~zero (no genuine customer orders yet), so this closes the gap before launch traffic exists.

## Read FIRST

1. `andro-prime/09_website-app/CONTEXT.md` and `STATE.md` (especially STATE ~33, the ⚠️ line this plan resolves).
2. `andro-prime/09_website-app/frontend/lib/results/processResult.ts` — whole file. Key points: `buildCioTraits()` ~18-93; the five unconditional traits at ~55, 63, 67, 68, 72; the deliberate testosterone-withholding comments ~25-32 and ~77-83; `results_all_clear` at ~84-90; the emission call `identifyUser(cioKey, buildCioTraits(...))` at ~254.
3. `andro-prime/09_website-app/frontend/lib/auth/consentVersions.ts` (~18: `HEALTH_PROCESSING_CONSENT_VERSION = '2026-06-23-v1'`), `components/commerce/CheckoutDetailsForm.tsx` (~125), and `database/migrations/20260623_users_health_processing_consent.sql` — how CA-018 consent is captured and stored.
4. `andro-prime/09_website-app/frontend/lib/customerio/emit.ts` and `identity.ts` — how emission works.
5. `andro-prime/03_compliance/dpia/phase0-dpia.md` — the processor table (~58-59) and Outstanding actions table (~190-201).

## Step 1 — Inventory trait usage (do this BEFORE changing code)

Run: `rg -in "low_vitamin_d|low_b12|elevated_crp|crp_level|low_ferritin" andro-prime/09_website-app/` (covers code, email-templates markdown, and compiled html).

Build a table: trait → every consumer (file:line) → what breaks if the trait is absent. Expected consumers: seq-03a energy-results templates via Liquid (`customer.low_vitamin_d` etc.), documented in `frontend/email-templates/CONTEXT.md` Liquid Variables Reference (~91-125). Pay special attention to:

- **Boolean traits in `{% if %}` blocks** — absent attribute evaluates falsy; emails degrade gracefully. Fine.
- **Raw value interpolation** (`{{ customer.crp_level }}`) — absent attribute renders blank text inside a sentence. If any template interpolates `crp_level`, DO NOT silently drop the trait: keep it behind the gate instead of removing it, and flag the template in your report.
- Check live CIO campaign segment conditions are not in the repo — note in your report that Keith (or a `/cio-sequence-build` recon) should confirm no CIO campaign *trigger/segment* filters on these five attributes before deploy.

## Step 2 — Implement the gate

In `processResult.ts`:

1. Look up whether the result's user has recorded CA-018 health-processing consent (the column created by `20260623_users_health_processing_consent.sql`; follow how the checkout code writes it — match name and version-checking style used by `lowtNurtureConsent.ts` if a helper pattern exists).
2. Pass a `hasHealthProcessingConsent: boolean` into `buildCioTraits()` (or check before the five assignments). When false → none of the five traits are set. **Fail closed**: any lookup error or missing row counts as no consent.
3. Remove the raw `crp_level` emission (~68) entirely, keeping only the `elevated_crp` boolean — UNLESS Step 1 found a template interpolating the raw value; in that case keep it gated and escalate.
4. Leave untouched: all testosterone-trait logic, `results_all_clear` (~84-90 — an existing deliberate low-sensitivity decision), and every other trait/event.
5. Rewrite the ~30-32 comment: "Energy-marker traits are gated on the CA-018 health-processing consent (2026-07-XX); raw crp_level dropped for data minimisation. See DPIA §4."

## Step 3 — Tests

Find the existing test setup (check `package.json` scripts and `lib/results/fixtures/`). Add unit tests: (a) consented user → five traits present (minus raw `crp_level`); (b) non-consented/guest/missing-row → none of the five present, but `results_all_clear` still emitted per its own rules; (c) consent-lookup throwing → traits absent, result processing still completes (the email/event flow must not crash because of the gate). Run the full suite plus `npx tsc --noEmit` (or the repo's typecheck script) and the build.

## Step 4 — Doc layer (same commit)

1. `03_compliance/dpia/phase0-dpia.md` ~59: append a dated note — "2026-07-XX: energy-marker traits now gated on CA-018 consent in code; raw crp_level no longer sent. Pending deploy." Update the matching Outstanding-actions row from Pending to "Implemented in code — pending deploy + verification". **Do not sign the DPIA sign-off table** (that is Keith + Ewa's).
2. `03_compliance/pre-launch-checklist.md`: add an unchecked row under the data section — "- [ ] Energy-trait CIO emission gated on CA-018 consent (deployed + verified on a live result)". Do not tick anything, do not touch the sign-off table.
3. `09_website-app/STATE.md`: replace the ⚠️ line (~33) with the new state ("gated in code as of 2026-07-XX, deploy pending; raw crp_level dropped"); bump `_Last updated:_`.
4. `frontend/email-templates/CONTEXT.md` Liquid Variables table: annotate the five traits "consent-gated (CA-018) as of 2026-07-XX"; if you removed `crp_level`, mark its row removed/retired. (If the low-T sweep plan already rewrote parts of this file, integrate cleanly — locate by trait name.)

## Deploy sequencing (put this prominently in your report)

The CA-018 checkout consent UI is **built but its deploy is pending** (STATE.md). If this gate deploys before the consent checkbox is live in production checkout, no new customer will have consent recorded, so no energy traits will flow and seq-03a personalization silently degrades. **The gate must deploy together with, or after, the CA-018 checkout deploy.** Do not deploy anything yourself — commit only; deployment is Keith/dev via Coolify.

## Edge cases a weaker model would miss

1. **Guests and pre-existing users have no consent record** (backfill is a separate open DPIA item, ~197). Fail-closed means they get no traits — correct behaviour, but say it explicitly in the report so degraded personalization isn't mistaken for a bug.
2. **Already-emitted traits persist on CIO profiles.** Gating stops new emission; it does not erase attributes already stored on test-user profiles in Customer.io. Removing those is a manual CIO step for Keith — list it, do not attempt it via API.
3. **`results_all_clear` looks similar but is different** — it is a deliberately low-sensitivity boolean powering seq-03c. Leave it.
4. **Do not gate the event stream** (`result_received` etc.) — those trigger transactional results-ready emails, which are service delivery. Only the five profile *attributes* are in scope.
5. **The consent flag lives on the users table; results can be processed for guest checkouts** — trace how `processResult` resolves the user (the `cioKey`/identity path) and make sure a guest path can't throw on the consent lookup.
6. **This is a flagged open decision, not a settled ruling.** Frame the commit and report as implementing the conservative default, reversible if Keith + Ewa choose to document a lawful basis instead. Do not edit the DPIA to claim the decision is closed.

## Step-by-step order

1. Read-first list. 2. Step 1 inventory. 3. Step 2 code. 4. Step 3 tests + typecheck + build. 5. Step 4 docs. 6. Commit to main (explicit paths only; no PR): `feat(results): gate energy-trait CIO emission on CA-018 consent, drop raw crp_level`. 7. Report: inventory table, what changed, deploy-sequencing warning, Keith's residual decisions (CIO profile cleanup, campaign-filter check, gate-vs-lawful-basis confirmation).

## Acceptance criteria

- [ ] `rg -n "low_vitamin_d|low_b12|elevated_crp|crp_level|low_ferritin" andro-prime/09_website-app/frontend/lib/` shows all emission paths behind the consent check; no unconditional assignment remains.
- [ ] Raw `crp_level` no longer emitted (or gated + escalated with the template evidence).
- [ ] Tests cover consented / non-consented / lookup-error paths and pass; typecheck and build pass.
- [ ] Testosterone logic and `results_all_clear` diffs are empty.
- [ ] DPIA note + pre-launch-checklist row + STATE.md + email-templates CONTEXT all updated, dates bumped; no sign-off tables touched.
- [ ] Nothing deployed; report contains the deploy-sequencing warning and the residual Keith decisions.
- [ ] One commit on main, staged by explicit paths.
