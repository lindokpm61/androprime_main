/**
 * Member pricing: a Stripe coupon applied at kit checkout while the customer is
 * an active member.
 *
 * The cheapest real member benefit in v1, and the only one that needs no
 * catalogue: no member SKUs, no second price list, no product rows to keep in
 * step. Stripe holds the discount, we hold the eligibility question.
 *
 * THE DISPLAYED NUMBER IS READ FROM THE COUPON, never restated here. A "25% off
 * for members" line hardcoded in the UI would be a duplicated fact, invisible
 * exactly while it agrees with Stripe and loudly wrong the first time someone
 * edits the coupon. `resolveMemberCoupon()` is the single source for both the
 * discount that is applied and the words that describe it.
 */

import { stripe } from '@/lib/stripe/client'
import { isMembershipEnabled } from '@/lib/flags'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isActiveStatus } from './entitlement'
import type { Database } from '@/lib/supabase/types'
import { betterCoupon, type ComparableCoupon } from './pricingRules'

// Re-exported so callers have ONE import for member pricing; the rule itself
// lives in ./pricingRules.ts, which is pure and therefore directly testable.
export { betterCoupon }
export type { ComparableCoupon }

/**
 * Env var holding the Stripe coupon id for member pricing.
 *
 * Coupon ids are MODE-SPECIFIC: a live-mode id does not resolve against a test
 * key and vice versa. Set the live id in Coolify; leaving it unset locally
 * makes test-mode checkouts degrade to full price rather than fail, which is
 * the same convention as the existing `?discount=` coupons in
 * app/api/checkout/kit/route.ts.
 */
export const MEMBER_COUPON_ENV = 'STRIPE_COUPON_MEMBER'

export interface MemberCoupon {
  id: string
  /** How the discount reads to a customer, e.g. "25% off" or "£10 off". */
  label: string
  /** Raw discount, so a caller can compare this coupon against another one. */
  percentOff: number | null
  amountOff: number | null
}

/**
 * Is this user an active member right now?
 *
 * Reads through the ADMIN client because the callers are server routes acting
 * on behalf of a user rather than rendering for one, and one of them
 * (kit checkout) runs before any page has established a session context.
 *
 * Returns false whenever the flag is off, so the member-price path cannot fire
 * ahead of the compliance read on the membership framing.
 */
export async function isActiveMember(userId: string | null | undefined): Promise<boolean> {
  if (!isMembershipEnabled()) return false
  if (!userId) return false

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('memberships')
    .select('status')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    // A membership lookup that fails must not hand out a discount it cannot
    // justify, and must not block the sale either. No discount, full price.
    console.error('[membership] isActiveMember lookup failed:', error.message)
    return false
  }

  const status = (data?.status ?? null) as Database['public']['Enums']['subscription_status'] | null
  return isActiveStatus(status)
}

function describe(coupon: { percent_off: number | null; amount_off: number | null; currency: string | null }): string {
  if (coupon.percent_off) return `${coupon.percent_off}% off`
  if (coupon.amount_off) {
    const amount = (coupon.amount_off / 100).toFixed(2).replace(/\.00$/, '')
    const symbol = (coupon.currency ?? 'gbp').toLowerCase() === 'gbp' ? '£' : ''
    return `${symbol}${amount} off`
  }
  return 'Member price'
}

/**
 * The member coupon, or null when there is none to apply.
 *
 * Null for: flag off, env unset, unknown coupon, or a coupon Stripe reports as
 * invalid (expired, redemption limit reached). A missing or dead coupon must
 * never block a sale — the customer simply pays full price, exactly as an
 * unknown `?discount=` code behaves today.
 */
export async function resolveMemberCoupon(): Promise<MemberCoupon | null> {
  if (!isMembershipEnabled()) return null

  const couponId = process.env[MEMBER_COUPON_ENV]
  if (!couponId) return null

  try {
    const coupon = await stripe.coupons.retrieve(couponId)
    if (!coupon.valid) return null
    return {
      id: coupon.id,
      label: describe(coupon),
      percentOff: coupon.percent_off,
      amountOff: coupon.amount_off,
    }
  } catch {
    return null
  }
}

/**
 * The coupon to apply to THIS customer's kit checkout, or null.
 *
 * Both conditions have to hold, and they are checked in this order because the
 * membership lookup is a database round trip and the coupon lookup is a network
 * call: neither runs for the overwhelmingly common case of a non-member buying
 * a kit while the flag is off.
 */
export async function memberCouponFor(userId: string | null | undefined): Promise<MemberCoupon | null> {
  if (!(await isActiveMember(userId))) return null
  return resolveMemberCoupon()
}
