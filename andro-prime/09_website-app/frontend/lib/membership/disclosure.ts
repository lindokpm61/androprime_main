import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { MEMBERSHIP_OFFER_WINDOW_DAYS } from '@/lib/membership/offer'

/**
 * THE SUBSCRIPTION DISCLOSURE SENTENCE, and it has exactly one home.
 *
 * Specified by `01_strategy/2026-09-07-auto-renew-at-day-30.md` §4 for the four
 * `/kits/` routes, and extended by Keith on 2026-09-11 to the three `/lp/` kit
 * landing pages, which §4 had left NOT DECIDED. Seven surfaces, one string.
 *
 * 🔴 IT LIVES HERE BECAUSE IT WAS ABOUT TO BECOME A SEVEN-SITE FACT. It was
 * written as a `const DISCLOSURE` inside `/membership/page.tsx`, whose own
 * comment says: *"Do not reword it in one place: it is a two-site fact by design
 * and the register tracks it as one."* That comment is an unenforced intention,
 * which is the defect class DESIGN.md names repeatedly — a comment that scopes a
 * rule more narrowly than the code does reads as correct until the second call
 * site appears. Adding five more copies of a sentence that states a recurring
 * charge, on the pages cold paid traffic lands on, is exactly where a silent
 * divergence would be most expensive. One export, seven consumers.
 *
 * ⚠ EVERY NUMBER IS DERIVED, NONE IS TYPED. The window comes from
 * `MEMBERSHIP_OFFER_WINDOW_DAYS` and the price from `PRODUCT_MAP.membership`,
 * so a price change breaks or updates the sentence everywhere at once rather
 * than leaving a stale figure on a page nobody reopens. `PRODUCT_MAP`'s price
 * string already carries its period (`£47/mo`), which is why the period is
 * stripped before "/month" is appended.
 *
 * 🔴 THE WORDING IS RULED AND MAY NOT BE EDITED HERE. It is approved copy from
 * the ruling, and it carries a legal function under the DMCC Act 2024 Part 4
 * prominence duty (see `03_compliance/2026-09-07-dmcca-subscription-regime-gap.md`,
 * which is still open with the solicitor). Changing the sentence is a copy
 * decision with its own pre-flight, not a refactor.
 */
export const MEMBERSHIP_INCLUDED_DAYS = MEMBERSHIP_OFFER_WINDOW_DAYS

/** The day the first charge lands. Derived, never typed: the ruling says "day 31". */
export const MEMBERSHIP_FIRST_CHARGE_DAY = MEMBERSHIP_INCLUDED_DAYS + 1

export const MEMBERSHIP_DISCLOSURE =
  `Includes ${MEMBERSHIP_INCLUDED_DAYS} days of membership. ` +
  `${PRODUCT_MAP.membership.price.replace('/mo', '')}/month after. Cancel anytime.`
