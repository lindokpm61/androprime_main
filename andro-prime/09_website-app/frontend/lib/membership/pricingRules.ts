/**
 * Member-pricing RULES. PURE: no Stripe, no database, no env.
 *
 * Split out of ./memberPricing.ts so the decision can be driven from a test
 * table without importing the Stripe client or the admin Supabase client. Same
 * split, and the same reason, as ./entitlement.ts against ./sync.ts: the rule
 * that decides what a customer is charged should be testable without a network.
 */

/** The shape both coupon sources reduce to, so they can be compared. */
export interface ComparableCoupon {
  id: string
  percentOff: number | null
  amountOff: number | null
}

/**
 * Which of two coupons to apply.
 *
 * Stripe Checkout takes ONE discount, so a member who also pastes a campaign
 * code forces a choice, and the choice has to be defensible rather than
 * whichever branch happened to run last.
 *
 * The rule: give the customer the better deal when the two are comparable, and
 * otherwise honour the code he explicitly supplied. Two percentages compare
 * cleanly. A percentage against a fixed amount does NOT, because which is
 * larger depends on the line total, which is not known here — so rather than
 * guess, the explicit act wins, since silently swallowing a code a customer
 * deliberately entered is the worse failure of the two.
 *
 * Note this can hand a member a smaller discount than his membership gives, in
 * the mixed case only. That is a deliberate, bounded trade and not an oversight.
 *
 * Ties go to the CODE. When both discounts are identical the customer is no
 * worse off either way, and preferring the code keeps campaign attribution
 * intact for the one that actually applied.
 */
export function betterCoupon(
  code: ComparableCoupon | null | undefined,
  member: ComparableCoupon | null | undefined,
): { coupon: ComparableCoupon; source: 'code' | 'member' } | null {
  if (!code && !member) return null
  if (!member) return { coupon: code!, source: 'code' }
  if (!code) return { coupon: member, source: 'member' }

  if (code.percentOff != null && member.percentOff != null) {
    return member.percentOff > code.percentOff
      ? { coupon: member, source: 'member' }
      : { coupon: code, source: 'code' }
  }

  return { coupon: code, source: 'code' }
}
