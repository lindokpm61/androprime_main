/**
 * The 18+ eligibility gate, in one place.
 *
 * WHY THIS MODULE EXISTS. Andro Prime is 18+ only, and that fact is collected at
 * THREE points: `/auth/signup`, `/auth/consent` and `/checkout/details`. On
 * 2026-09-08 the auth frame (Frame X2) found it was ENFORCED at two of them and
 * optional at the third, and Keith ruled that closed. Fixing signup by copying
 * `consentAction`'s check would have made it two copies of one rule, which is the
 * duplication pattern this repo keeps having to unpick: invisible while the
 * copies agree, and a contradiction the moment one is edited.
 *
 * DELIBERATELY PURE — no FormData, no NextRequest, no redirect, no env reads — so
 * `scripts/test-age-gate.ts` can drive it over a table of inputs. Same pattern
 * and same reason as `routeDecision` in `lib/hosts.ts` and the parsers in
 * `lib/quiz/wtp.ts`: the rule is the part worth testing, and it cannot be tested
 * while it is welded to a server action that redirects.
 *
 * 🔴 A CLIENT-SIDE `required` OR `min` ATTRIBUTE IS NOT THIS GATE. Both are
 * conveniences that a curl, a disabled-JS browser or a devtools edit walks
 * straight past. An eligibility requirement enforced only in the markup is not
 * enforced, which is exactly the state signup was in.
 */

/** The floor. One number, referenced rather than retyped. */
export const MIN_AGE = 18

/**
 * The refusal a customer sees. Shared so the two entry points cannot drift into
 * two different sentences for one rule; it is the wording `consentAction` has
 * always used.
 */
export const UNDER_AGE_ERROR = 'You must be 18 or over to use Andro Prime.'

/**
 * The submitted age when it clears the gate, or `null` when it does not, which
 * covers missing, blank, non-numeric, negative and under-age alike. Callers
 * refuse on `null` and store the returned number, so a value that passed the gate
 * is the same value that gets written.
 *
 * ⚠ FAITHFUL TO THE INCUMBENT CHECK, INCLUDING ITS LOOSE EDGES. `'18.5'` and
 * `'1e3'` both pass, because `Number()` accepts them and the shipped
 * `consentAction` has always accepted them. They are not eligibility failures, so
 * tightening them here would be a behaviour change riding in on a ruling that did
 * not ask for one. `scripts/test-age-gate.ts` pins them as known-accepted rather
 * than leaving the next reader to guess whether they were considered.
 */
export function parseEligibleAge(raw: string | null | undefined): number | null {
  const trimmed = String(raw ?? '').trim()
  if (!trimmed) return null
  const age = Number(trimmed)
  if (Number.isNaN(age)) return null
  if (age < MIN_AGE) return null
  return age
}
