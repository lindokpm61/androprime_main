import { createSupabaseServerClient } from '@/lib/supabase/server'

export interface FoundingMemberListStatus {
  isOnList: boolean
  listedAt: Date | null
}

/**
 * Returns the authenticated user's status on the founding-member opt-in list.
 * The list replaced the deposit-based founding-member mechanic on 2026-05-08;
 * this helper is the single source of truth for whether a user is "on the list".
 */
export async function getFoundingMemberListStatus(
  userId: string,
): Promise<FoundingMemberListStatus> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('founding_member_list')
    .select('listed_at, unlisted_at')
    .eq('user_id', userId)
    .is('unlisted_at', null)
    .order('listed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    return { isOnList: false, listedAt: null }
  }

  return {
    isOnList: true,
    listedAt: data.listed_at ? new Date(data.listed_at) : null,
  }
}
