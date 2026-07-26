// Dark-launch feature flags.
//
// Every flag here mirrors the classifier's `isMaintenanceOfferEnabled` pattern
// (lib/results/classifier.ts):
//   1. Read LIVE from the environment on every call (never cached at module
//      load), so a test can toggle the flag per-call and so the deployed value
//      wins without a rebuild.
//   2. Strict `=== 'true'` string check - absent / any other value is provably
//      OFF. No truthy coercion.
//   3. Each flag only ADDS a surface. With the flag OFF the app is byte-
//      identical to before the feature existed.
//
// All default OFF. The surfaces they gate are pending sign-off - see
// docs/2026-07-17-bucket-ab-implementation-plan.md for the gate on each.

/**
 * Account "Data & privacy" section: results CSV export, the data-use statement,
 * and the erasure-request control. OFF until (a) the data-use wording has a
 * compliance read and (b) the erasure ops-alert address + SLA wording are
 * confirmed by Keith. Read-only export is safe on its own, but the section
 * ships as one unit behind one flag.
 */
export function isAccountDataControlsEnabled(): boolean {
  return process.env.ACCOUNT_DATA_CONTROLS_ENABLED === 'true'
}

/**
 * GP handoff pack: a printable results summary plus "questions to take to your
 * GP", surfaced on GP-referral results. Pure advocacy, no clinical claim - but
 * the wording is exactly where the advocacy / diagnosis line sits, so it stays
 * OFF until Ewa signs the template.
 */
export function isGpHandoffEnabled(): boolean {
  return process.env.GP_HANDOFF_ENABLED === 'true'
}

/**
 * "What this test did not tell you" kit-scope note, shown on a normal-result
 * Kit 1 (testosterone) card before the Kit 2 cross-sell. OFF until the
 * paragraph clears the compliance pre-flight.
 */
export function isKitScopeNoteEnabled(): boolean {
  return process.env.KIT_SCOPE_NOTE_ENABLED === 'true'
}

/**
 * Retest reminder (Phase 2). On an all-clear result, buildCioTraits stamps a
 * `retest_due_at` Customer.io attribute (result date + RETEST_REMINDER_MONTHS)
 * so a single CIO campaign can send one retest nudge to ALL kit buyers — not
 * just supplement subscribers, who already get the Day-90 seq-04 e5 prompt.
 * OFF until (a) the reminder email copy has Ewa sign-off (reuse the seq-04 e5
 * framing — "find out how your levels have changed", never "fixed/cured") and
 * (b) the CIO campaign that triggers on the attribute is built. With the flag
 * OFF, `retest_due_at` is never set, so no attribute flows and no campaign can
 * fire — output is byte-identical to before. See
 * docs/2026-07-17-retest-cta-mechanism-decision.md (Phase 2).
 */
export function isRetestReminderEnabled(): boolean {
  return process.env.RETEST_REMINDER_ENABLED === 'true'
}

/**
 * Two-kit bundles (Confirmation / Prove-It / Full-picture): one Stripe payment,
 * kit 1 dispatched immediately, the second kit dispatched later by a trigger.
 * The flag gates every bundle surface as one unit — bundle option on the kit
 * pages, the checkout bundle branch, the Stripe webhook's `bundle_dispatches`
 * insert, the result-hook Confirmation trigger, and the daily bundle-sweep job.
 * With the flag OFF none of those run, so no `bundle_dispatches` row is ever
 * written and the app is byte-identical to before bundles existed.
 * OFF until every gate clears: (a) the solicitor signs the D2 banked-kit
 * validity + bundle T&Cs, (b) the F3/F4 ClickUp build gates are closed, and
 * (c) Ewa signs off the Confirmation threshold (shouldTriggerConfirmation) and
 * the day-~90 second-dispatch interval (CONFIRMATION_INTERVAL_DAYS). See the
 * approved bundle plan + 09_website-app STATE.
 */
export function isBundlesEnabled(): boolean {
  return process.env.BUNDLES_ENABLED === 'true'
}

/**
 * Account "Delivery address" section: a self-serve surface where a signed-in
 * customer views and updates the delivery address held on their `users` row
 * (the exact columns the second-kit dispatch reads, see lib/bundles/dispatch.ts).
 * Built for the bundle address-check email (email-templates/sequences/
 * bundle-address-check.md), which links here so a customer can correct their
 * address before the soft-window auto-dispatch. Not bundle-only: it also lets
 * any customer fix a delivery address. OFF until the copy clears a compliance
 * read; flip it on alongside BUNDLES_ENABLED so the address-check email never
 * links to a dark surface. With the flag OFF the account page and the
 * /api/account/address route are byte-identical to before (route 404s).
 */
export function isAccountAddressEnabled(): boolean {
  return process.env.ACCOUNT_ADDRESS_ENABLED === 'true'
}
