# Approval Record — CA-022: Retest reminder (all-clear) email

**Artefact:** `09_website-app/frontend/email-templates/sequences/retest-reminder-all-clear.md` (Email 1 copy) + rendered HTML `email-templates/html/retest-reminder-all-clear-email-1-retest-reminder-all-clear.html`, uploaded to Customer.io campaign **23** (`seq-07 — Retest Reminder (all-clear)`), email action **106** / template **54**, env 219186.
**Type:** Customer-facing lifecycle email — retest reminder to all-clear kit buyers (Phase 2 of the retest-CTA work).
**Version:** 2026-07-18-v1
**Pre-flight:** 2026-07-17 · **0 HARD / 0 REVIEW on the email copy.** (The scanner's 3 HARD hits were all in code comments outside the copy — `processResult.ts` "Treat it as a benign no-op", `flags.ts` GP-handoff "diagnosis line", and the new flag comment quoting the "never fixed/cured" rule — none customer-facing.) One efficacy-adjacent phrase reworded **before** approval: "nothing to fix" → "nothing about your last result needs action". Retest framing uses the CONTEXT.md-mandated "find out how your levels have changed", never "fixed/cured". No em dash.

**Required signers:** Ewa (clinical / results copy) + Keith (business).

**Decision:** ✅ **APPROVED 2026-07-18** — Ewa (clinical) approved the email, reported by Keith in-session (countersignature recommended for the clinical record, per the standing register convention). Keith (business) approved on his own instruction to build and take live pre-launch.

**Conditions — copy approval only; the campaign is NOT authorised to send.** Activation of campaign 23 remains gated on:
1. Deploy the Phase 2 code + flip `RETEST_REMINDER_ENABLED` so `retest_due_at` flows and registers in the CIO attribute catalog.
2. Verify CIO reads the Unix-seconds `retest_due_at` as a date + a real test-send (cannot be done until the attribute is live — no profile has it yet).
3. Add the `subscription_started` suppression filter on campaign 23 (not yet wired).
4. Human activation go/no-go.
5. If the alternate subject line ("It has been six months. Where are your levels now?") is chosen over "Time for a fresh reading", it rides this same approval (both were in the approved copy); any other wording edit needs a re-approval.
6. Subscriber retest discount deferred until the supplement range is live (adds a line → re-pre-flight then).

**Related:** decision `09_website-app/docs/2026-07-17-retest-cta-mechanism-decision.md`; cadence `04_products/results-engine/2026-07-17-retest-cadence-table.md`; ClickUp `869e66eb0`.
