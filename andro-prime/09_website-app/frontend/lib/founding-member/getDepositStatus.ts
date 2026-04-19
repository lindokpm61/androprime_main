import { createSupabaseServerClient } from '@/lib/supabase/server'

export type DepositState =
  | { state: 'not-started' }
  | { state: 'pending'; depositId: string; createdAt: string }
  | { state: 'paid'; depositId: string; paidAt: string }
  | { state: 'cancelled'; depositId: string }
  | { state: 'refunded'; depositId: string }

export async function getDepositStatus(userId: string): Promise<DepositState> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('founding_member_deposits')
    .select('id, status, paid_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return { state: 'not-started' }

  switch (data.status) {
    case 'paid':
      return { state: 'paid', depositId: data.id, paidAt: data.paid_at! }
    case 'pending':
      return { state: 'pending', depositId: data.id, createdAt: data.created_at }
    case 'cancelled':
      return { state: 'cancelled', depositId: data.id }
    case 'refunded':
      return { state: 'refunded', depositId: data.id }
    default:
      return { state: 'not-started' }
  }
}
