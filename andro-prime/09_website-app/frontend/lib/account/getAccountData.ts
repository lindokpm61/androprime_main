import { createSupabaseServerClient } from '@/lib/supabase/server'

export type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'dispatched'
  | 'sample_registered'
  | 'processing'
  | 'results_received'
  | 'cancelled'
  | 'refunded'

export interface KitOrderSummary {
  id: string
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
  hasDeposit: boolean
}

const KIT_NAMES: Record<KitType, string> = {
  'testosterone':    'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery':'Hormone & Recovery Check',
}

const ACTIVE_SUB_STATUSES = ['active', 'trialing', 'past_due'] as const

export async function getAccountData(userId: string, userEmail: string): Promise<AccountData> {
  const supabase = await createSupabaseServerClient()

  const [ordersRes, subsRes, depositRes, userRes] = await Promise.all([
    supabase
      .from('kit_orders')
      .select('id, kit_type, status, ordered_at')
      .eq('user_id', userId)
      .order('ordered_at', { ascending: false }),
    supabase
      .from('supplement_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .in('status', ACTIVE_SUB_STATUSES),
    supabase
      .from('founding_member_deposits')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .limit(1),
    supabase
      .from('users')
      .select('age')
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
    kitType: o.kit_type as KitType,
    kitName: KIT_NAMES[o.kit_type as KitType] ?? o.kit_type,
    status: o.status as OrderStatus,
    orderedAt: o.ordered_at,
    hasResults: orderIdsWithResults.has(o.id),
  }))

  return {
    email: userEmail,
    age: userRes.data?.age ?? null,
    orders,
    hasActiveSubscription: (subsRes.data ?? []).length > 0,
    hasDeposit: (depositRes.data ?? []).length > 0,
  }
}
