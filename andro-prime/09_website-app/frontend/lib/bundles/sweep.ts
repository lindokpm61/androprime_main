// Pure decision logic for the daily bundle sweep, factored out of the route so
// the state-machine transitions and window arithmetic are testable without a DB
// or a live clock. The route (app/api/jobs/bundle-sweep) queries candidate rows
// and uses these predicates as the authoritative gate on each transition.

import type { Database } from '@/lib/supabase/types'
import { ADDRESS_CHECK_WINDOW_DAYS } from './config'

export type BundleDispatchRow = Database['public']['Tables']['bundle_dispatches']['Row']

const DAY_MS = 24 * 60 * 60 * 1000

// Pass A — a 'scheduled' row matures to 'trigger_met' once its due_at has
// arrived. Timed bundles carry due_at from purchase; a Confirmation row gets
// due_at from the result hook (immediate on low/borderline via
// CONFIRMATION_INTERVAL_DAYS = 0, or the recheck date when banked). A null due_at
// is not yet actionable (a Confirmation row still awaiting its first result).
export function isTriggerMatured(row: BundleDispatchRow, now: Date): boolean {
  if (row.status !== 'scheduled') return false
  if (!row.due_at) return false
  return new Date(row.due_at).getTime() <= now.getTime()
}

// Pass B — any row sitting in 'trigger_met' is owed the address-check email,
// after which it moves to 'awaiting_window'.
export function needsAddressCheck(row: BundleDispatchRow): boolean {
  return row.status === 'trigger_met'
}

// End of the soft address-confirmation window = the address-check email send time
// plus the grace period. Null when the email has not been sent yet.
export function addressWindowEndsAt(row: BundleDispatchRow): Date | null {
  if (!row.address_check_at) return null
  return new Date(new Date(row.address_check_at).getTime() + ADDRESS_CHECK_WINDOW_DAYS * DAY_MS)
}

// Pass C — an 'awaiting_window' row is ready for the second dispatch once the
// soft window has elapsed since the address-check email.
export function isWindowElapsed(row: BundleDispatchRow, now: Date): boolean {
  if (row.status !== 'awaiting_window') return false
  const ends = addressWindowEndsAt(row)
  if (!ends) return false
  return ends.getTime() <= now.getTime()
}
