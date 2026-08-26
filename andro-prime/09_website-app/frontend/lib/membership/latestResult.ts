/**
 * When this customer's most recent result came BACK.
 *
 * One function with two callers — the subscription checkout route (which gates
 * on it) and the membership page (which renders from it) — so the gate and the
 * screen can never disagree about whether the offer window is open. A second
 * copy of this query is exactly the duplicated fact that stays invisible while
 * the copies agree.
 *
 * `received_at`, deliberately, not `collected_at`: the window is about how long
 * ago he learned something, not how long ago he bled.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

/**
 * Works with either the user-scoped or the service-role client. Under the
 * user-scoped one RLS already restricts the rows to the caller; the explicit
 * `user_id` filter is what makes it correct under the admin client too.
 */
export async function latestResultReceivedAt(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Date | null> {
  const { data, error } = await supabase
    .from('lab_results')
    .select('received_at')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    // Fail CLOSED. An unreadable results table must not open a paid offer we
    // cannot justify; the customer sees the window as closed and can still buy
    // a kit, which is the recoverable direction.
    console.error('[membership] Could not read lab_results for the offer window:', error.message)
    return null
  }

  if (!data?.received_at) return null

  const at = new Date(data.received_at)
  return Number.isNaN(at.getTime()) ? null : at
}
