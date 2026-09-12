import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { MembershipLike } from './entitlement'

/**
 * The signed-in customer's newest membership row, or null.
 *
 * Read through the USER-scoped Supabase client, so RLS is the access control
 * rather than an `.eq('user_id', ...)` we have to remember to write — the same
 * rule `getMembershipView` states and follows. The `memberships` policy is
 * read-your-own and every write is service-role, so a member can read his
 * retest date and can never move it.
 *
 * It returns exactly `MembershipLike`, which is the shape `entitlementState()`
 * consumes, so a caller never re-derives "is he a member" from a status string
 * of its own.
 *
 * ⚠ `getMembershipView` runs the same query with the same three columns, inside
 * a `Promise.all` with the dashboard fetch. It is NOT refactored to call this,
 * because that module is what `/account/membership` renders and it is covered by
 * `scripts/test-membership.ts`; collapsing them is a change to that page's data
 * path for no behavioural gain today. Worth doing when something else touches
 * that file.
 *
 * 🔴 THE ROW MAY NOT EXIST YET FOR A GENUINE NEW MEMBER. It is created by the
 * Stripe webhook (`createMembership`), and a customer returning from Checkout
 * can beat the webhook by a second or two. Absence is therefore NOT evidence of
 * not being a member, and no caller may treat it that way on a page a buyer
 * lands on straight from Stripe. `/subscription/confirmed` uses the presence of
 * a `session_id` for that question and this row only for the retest DATE.
 */
export async function latestMembershipForUser(userId: string): Promise<MembershipLike | null> {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('memberships')
    .select('status, next_retest_due_at, retest_claimed_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data ?? null) as MembershipLike | null
}
