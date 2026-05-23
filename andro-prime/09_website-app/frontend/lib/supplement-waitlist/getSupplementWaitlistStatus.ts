import { createSupabaseServerClient } from '@/lib/supabase/server'

export interface SupplementWaitlistStatus {
  listed: boolean
  listedAt?: string
  sourceMarker?: string
  interestedInProduct?: string
}

/**
 * Returns the authenticated user's status on the supplement early-access
 * waitlist. Mirrors `getFoundingMemberListStatus` and is the single source
 * of truth for whether a user is on the supplement waitlist. Used by the
 * results dashboard (and any post-Phase 0a landing pages) to gate the
 * supplement-waitlist CTA copy.
 */
export async function getSupplementWaitlistStatus(
  userId: string,
): Promise<SupplementWaitlistStatus> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('supplement_waitlist')
    .select('listed_at, source_marker, interested_in_product, unlisted_at')
    .eq('user_id', userId)
    .is('unlisted_at', null)
    .order('listed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    return { listed: false }
  }

  return {
    listed: true,
    listedAt: data.listed_at ?? undefined,
    sourceMarker: data.source_marker ?? undefined,
    interestedInProduct: data.interested_in_product ?? undefined,
  }
}
