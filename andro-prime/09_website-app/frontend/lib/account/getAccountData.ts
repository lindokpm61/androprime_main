import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ageFromDobIso } from '@/lib/date/age'
import { formatOrderRef } from '@/lib/orders/orderRef'

export type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'dispatched'
  | 'sample_registered'
  | 'processing'
  | 'results_received'
  | 'sample_failed'
  | 'cancelled'
  | 'refunded'

export interface KitOrderSummary {
  id: string
  /** Customer-facing reference, e.g. `AP-10042`. See lib/orders/orderRef.ts. */
  orderRef: string | null
  kitType: KitType
  kitName: string
  status: OrderStatus
  orderedAt: string
  hasResults: boolean
}

export interface AccountData {
  email: string
  age: number | null
  orders: KitOrderSummary[]
  hasActiveSubscription: boolean
  isOnFoundingMemberList: boolean
}

const KIT_NAMES: Record<KitType, string> = {
  'testosterone':    'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery':'Hormone & Recovery Check',
}

const ACTIVE_SUB_STATUSES = ['active', 'trialing', 'past_due'] as const

export async function getAccountData(userId: string, userEmail: string): Promise<AccountData> {
  const supabase = await createSupabaseServerClient()

  const [ordersRes, subsRes, listRes, userRes] = await Promise.all([
    supabase
      .from('kit_orders')
      .select('id, order_seq, kit_type, status, ordered_at')
      .eq('user_id', userId)
      .order('ordered_at', { ascending: false }),
    supabase
      .from('supplement_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .in('status', ACTIVE_SUB_STATUSES),
    supabase
      .from('founding_member_list')
      .select('id')
      .eq('user_id', userId)
      .is('unlisted_at', null)
      .limit(1),
    supabase
      .from('users')
      .select('age, date_of_birth')
      .eq('id', userId)
      .single(),
  ])

  const rawOrders = ordersRes.data ?? []
  const orderIds = rawOrders.map((o) => o.id)

  // Check which orders have lab results in one query
  const { data: resultRows } = orderIds.length > 0
    ? await supabase
        .from('lab_results')
        .select('order_id')
        .in('order_id', orderIds)
    : { data: [] }

  const orderIdsWithResults = new Set((resultRows ?? []).map((r) => r.order_id))

  const orders: KitOrderSummary[] = rawOrders.map((o) => ({
    id: o.id,
    orderRef: formatOrderRef(o.order_seq),
    kitType: o.kit_type as KitType,
    kitName: KIT_NAMES[o.kit_type as KitType] ?? o.kit_type,
    status: o.status as OrderStatus,
    orderedAt: o.ordered_at,
    hasResults: orderIdsWithResults.has(o.id),
  }))

  return {
    email: userEmail,
    age: userRes.data?.age ?? ageFromDobIso(userRes.data?.date_of_birth),
    orders,
    hasActiveSubscription: (subsRes.data ?? []).length > 0,
    isOnFoundingMemberList: (listRes.data ?? []).length > 0,
  }
}
