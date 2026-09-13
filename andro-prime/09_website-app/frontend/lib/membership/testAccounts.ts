/**
 * Telling a fixture from a customer. PURE: no database, no env, no clock.
 * Defect A2.
 *
 * ── THE DEFECT ────────────────────────────────────────────────────────────
 * Two seeded developer accounts hold LIVE membership rows in the production
 * database, both `status: active`, both with retest dates in November 2026.
 * They are in production because local development points at the production
 * Supabase project, so the seeder writes there.
 *
 * The nightly sweep selects on three conditions — a retest date, that date in
 * the past, and the active-status rule — and **there is no test-account filter
 * at any step**. Both seeded rows satisfy every condition and both have a kit
 * order to read a panel from. Two things are holding it: the membership flag
 * is off, and the dates are in November. **Neither is a control.** The flag is
 * one deploy away from on, and November arrives by itself.
 *
 * ── 🔴 THE REGISTER'S SUGGESTED FIX NAMED A COLUMN THAT DOES NOT EXIST ────
 * It said *"set `is_test` on every row it writes, including kit orders and
 * memberships"*. Checked against the live database on 2026-09-13: **`is_test`
 * exists on `kit_orders` alone.** Not on `memberships`, not on `users`. So half
 * of that fix is a migration, not an edit, and a migration is a decision with
 * Keith's name on it rather than something to slip into a defect fix.
 *
 * ── WHAT IS USED INSTEAD, AND WHY IT IS BETTER THAN THE COLUMN ────────────
 * Two markers that already exist on rows already written:
 *
 *   1. **`stripe_subscription_id` starting `sub_dev_`.** `seedMember.ts`
 *      already writes this deliberately, with the comment *"so nothing can
 *      mistake it for a real subscription"*. It sits ON the membership row, so
 *      the sweep can filter in its own query with no join.
 *   2. **An `@androprime.test` email.** The seeder already refuses to run on
 *      any other domain, so the domain IS the definition of a fixture account.
 *
 * **A column would have been worse here, and the reason generalises.** A flag
 * has to be SET at write time, so it is wrong for every row already in the
 * table — the six seeded kit orders carry `is_test = false` today, and a new
 * column on `memberships` would start false on both live rows and need a
 * backfill nobody would remember to run. These two markers are retroactive:
 * they are already true of the existing rows because they describe how those
 * rows were made. **A derived marker is correct about the past; a stamped one
 * is only correct about the future.**
 *
 * Both are checked, not one. The register's own lesson is that a fixture in a
 * production table is indistinguishable from a customer to every job that reads
 * it, and this is the job that turns a row into real postage, so it gets two
 * independent signals rather than the cheapest one.
 */

/** The only domain the seeder will create accounts on. */
export const TEST_EMAIL_DOMAIN = '@androprime.test'

/** The subscription-id prefix `seedMember.ts` writes instead of a Stripe id. */
export const DEV_SUBSCRIPTION_PREFIX = 'sub_dev_'

/** Postgres `like` pattern for the prefix above, for the sweep's own query. */
export const DEV_SUBSCRIPTION_LIKE = `${DEV_SUBSCRIPTION_PREFIX}%`

export function isTestAccountEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase().endsWith(TEST_EMAIL_DOMAIN)
}

export function isDevSubscriptionId(id: string | null | undefined): boolean {
  if (!id) return false
  return id.startsWith(DEV_SUBSCRIPTION_PREFIX)
}

/**
 * IS THIS MEMBERSHIP A FIXTURE? Either marker is enough.
 *
 * ⚠ OR, NOT AND, AND THAT IS THE WHOLE POINT. Requiring both would mean a
 * fixture written by some other route — a hand-made row, a future seeder, a
 * restored backup — reads as a customer and gets posted a kit. The failure
 * directions are not symmetric: excluding a real member costs him a late
 * retest that support can fix by hand (A1 exists for exactly that), while
 * including a fixture costs a real box posted to a fake address and charged to
 * us, silently, with nobody to complain about it.
 *
 * `email` is optional because the sweep's own query filters on the id alone;
 * the email is the second opinion, loaded per row.
 */
export function isFixtureMembership(args: {
  stripeSubscriptionId: string | null | undefined
  email?: string | null | undefined
}): boolean {
  return isDevSubscriptionId(args.stripeSubscriptionId) || isTestAccountEmail(args.email)
}
