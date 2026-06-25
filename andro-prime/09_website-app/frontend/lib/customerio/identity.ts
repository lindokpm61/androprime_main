import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

// Canonical Customer.io profile identifier = the customer's EMAIL (trimmed +
// lowercased). Every CIO identify/emit call MUST key on this so one person maps
// to exactly ONE profile across every channel (newsletter, waitlist, quiz,
// founding-member, supplement-waitlist, purchase, results, auth login).
//
// Why: `email` is a unique identifier in this workspace. Keying the
// transactional flows on the Supabase user-id UUID (while the capture forms
// keyed guests on the email string) created a SECOND profile that tried to
// claim an email already owned by the signup profile. CIO silently DROPS the
// email on the colliding profile, so `{{ customer.email }}` renders
// "undefined variable" in the To field and every transactional email
// (T-01/T-02/T-03/T-09) fails to deliver. Verified end-to-end 2026-06-25:
// a fresh, unclaimed email delivers; a reused email collides and never sends.
export function cioKeyFromEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Resolve a user's canonical CIO id (their email) from their Supabase user id,
// for server flows (Stripe/Vitall webhooks, results processor) that only hold
// the UUID. Returns null when the user has no email on record — the caller
// should then skip the CIO call, because there is nothing to deliver to.
export async function cioKeyForUserId(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()
  if (error || !data?.email) {
    console.error(
      '[customerio] cioKeyForUserId: no email for user',
      userId,
      error?.message ?? '',
    )
    return null
  }
  return cioKeyFromEmail(data.email)
}
