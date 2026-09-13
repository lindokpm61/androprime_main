import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PRODUCT_MAP } from './products'
import { isMembershipEnabled } from '@/lib/flags'
import { MEMBERSHIP_SLUG } from '@/lib/membership/sync'

export type SubscriptionStatus =
  | 'incomplete'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'unpaid'

export interface SubscriptionRow {
  id: string
  productSlug: string
  productName: string
  price: string
  status: SubscriptionStatus
  startedAt: string
}

/**
 * Every recurring thing this customer holds, from BOTH tables.
 *
 * 🔴 IT READ ONE TABLE UNTIL 2026-09-13 AND IT WAS THE WRONG ONE. This queried
 * `supplement_subscriptions` alone while a membership owns a row in
 * `memberships`, so under the auto-renew ruling every kit buyer reached the
 * EMPTY state on the page whose job is to let him cancel. All three supplement
 * subscriptions are retired, so the table it read is the one nobody can hold a
 * live row in.
 *
 * ⚠ **THE MEMBERSHIP HALF IS GATED ON `MEMBERSHIP_ENABLED` AND THE PORTAL ROUTE
 * IS NOT.** That asymmetry is deliberate. With the flag off the app is supposed
 * to be byte-identical to before membership existed, and the only membership
 * rows in production are seeded fixtures, so rendering one here would put a card
 * on screen for a product that is switched off. Refusing to RENDER is cosmetic.
 * Refusing to CANCEL is harmful, which is why `app/api/checkout/portal/route.ts`
 * answers for a membership whatever the flag says.
 *
 * ⚠ A membership carries no `product_slug` column, because the row IS the
 * product. `MEMBERSHIP_SLUG` supplies it so the card renders through the same
 * `PRODUCT_MAP` lookup as everything else rather than growing a second naming
 * path for one row.
 */
export async function getSubscriptions(userId: string): Promise<SubscriptionRow[]> {
  const supabase = await createSupabaseServerClient()

  const rows: SubscriptionRow[] = []

  const toRow = (
    id: string,
    slug: string,
    status: string,
    startedAt: string,
  ): SubscriptionRow => {
    const product = PRODUCT_MAP[slug] ?? { name: slug, price: '' }
    return {
      id,
      productSlug: slug,
      productName: product.name,
      price: product.price,
      status: status as SubscriptionStatus,
      startedAt,
    }
  }

  if (isMembershipEnabled()) {
    // RLS `memberships_select_own` scopes this to the caller, so the server
    // client is the right one and the user id is a filter rather than a gate.
    const { data: memberships } = await supabase
      .from('memberships')
      .select('id, status, started_at')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })

    for (const row of memberships ?? []) {
      rows.push(toRow(row.id, MEMBERSHIP_SLUG, row.status, row.started_at))
    }
  }

  const { data: supplements } = await supabase
    .from('supplement_subscriptions')
    .select('id, product_slug, status, started_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  for (const row of supplements ?? []) {
    rows.push(toRow(row.id, row.product_slug, row.status, row.started_at))
  }

  // One list, newest first, so a member holding both does not see them grouped
  // by which table they happen to live in.
  return rows.sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}
