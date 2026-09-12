/**
 * WHAT MEMBERSHIP INCLUDES, and it has exactly one home.
 *
 * 🔴 IT LIVES HERE BECAUSE IT WAS ABOUT TO BECOME A THREE-SITE FACT. These
 * three sentences were written for the in-app paywall (`/account/membership`),
 * copied into the public `/membership` page under a comment reading "CARRIED
 * VERBATIM from the in-app paywall", and `/subscription/confirmed` needed them
 * a third time on 2026-09-12. A comment asserting that two copies agree is an
 * unenforced intention: it reads as correct right up to the moment somebody
 * edits one of them, and a benefit list that says different things on the page
 * that sells the membership and the page that confirms it is exactly the
 * divergence nobody would catch. One export, three consumers. Same reasoning,
 * and the same shape, as `MEMBERSHIP_DISCLOSURE` in ./disclosure.ts.
 *
 * 🔴 THREE ITEMS, NOT FOUR, AND THE FOURTH CAME OFF FOR A REASON. "Member price
 * on kits" was removed on 2026-08-26: kits are never discounted, for anyone,
 * because the member's benefit is the included retest and discounting on top of
 * it undercuts the economics the offer window protects. Member pricing is for
 * supplements, which have no delivery path today, and a paywall must not list a
 * benefit that cannot be delivered. Do not add a fourth without checking that
 * document.
 *
 * ⚠ THE RETEST IS NOT IN THIS LIST, deliberately. It is the entitlement rather
 * than an inclusion, it is conditional on being a member on a stated date, and
 * every surface that mentions it also has to say so. It carries its own
 * sentence, which is why that sentence is here too.
 *
 * ⚠ APPROVED CUSTOMER-FACING COPY. Rewording any of it is a copy decision with
 * its own pre-flight, not a refactor.
 */

export const MEMBERSHIP_INCLUDES: readonly string[] = [
  'Your plan, your streak and your daily data, kept running.',
  'Every marker explained against both ranges, ours and your lab’s.',
  'Ask the clinician. Questions answered every month, published for all members.',
] as const

/**
 * The retest sentence, verbatim from the in-app paywall, where it sits under
 * the projected retest date. It is here rather than typed twice for the same
 * reason as the list above: `/subscription/confirmed` states the date and owes
 * the same qualification the paywall gives it.
 */
export const MEMBERSHIP_RETEST_TERMS =
  'Included while you are a member. You need to be a member on that date. It is not a credit, it does not expire, and there is no balance to keep track of.'
