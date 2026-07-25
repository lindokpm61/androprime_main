# Sales: Current State

Volatile sales/lifecycle status for this workspace. Durable funnel logic, routing, lifecycle stages, and rules are in `CONTEXT.md`; task-level status lives in **ClickUp** (workspace `90121729875`). This file holds only dated live status. Update the date on each change.

_Last updated: 2026-07-25._

---

## Email sequences / campaigns (Customer.io build state)

- **All-clear retest reminder** (`retest-reminder-all-clear.md`, single send): copy **APPROVED 2026-07-18 (CA-022)**; built as **CIO campaign 23, DRAFT**. Fires on the `retest_due_at` date attribute (stamped on any whole-result all-clear); sends to ALL all-clear kit buyers, not just subscribers. Flag-gated on `RETEST_REMINDER_ENABLED`, **currently off**.
- **seq-03b (low-T notification + consent-gated nurture)**: built as **CIO campaign 5, DRAFT**, not activated. Part A result notification fires for all low-T (< 12 nmol/L); Part B education-only nurture fires ONLY on `lowt_nurture_consented`.

## Two-kit bundle funnel

- The two-kit bundle path (Confirmation / Prove-It / Full-picture SKUs, second kit on an automated later dispatch) is **dark behind `BUNDLES_ENABLED`**. The only pre-dispatch customer touchpoint, the **bundle address-check** email (`bundle_address_check` event, `bundle-address-check.md`), is **SPEC/DRAFT, not built**. Gated on the solicitor D2 bundle-terms decision plus an account-area address-update surface; needs Ewa sign-off + compliance pre-flight before build.

## Supplement waitlist capture

- Supplement range is not live in Phase 0, so a waitlist captures intent. Joining fires `supplement_waitlist_joined`, which triggers the transactional confirmation **T-10 (Supplement Waitlist Confirmed)**: a single confirmation send, not a nurture sequence. The waitlist population converts when the range ships.
