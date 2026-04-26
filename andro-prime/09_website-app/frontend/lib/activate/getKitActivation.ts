import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { KitType } from '@/lib/results/types'

export type KitActivationState =
  | { state: 'not-found' }
  | { state: 'wrong-account' }
  | { state: 'already-activated'; kitName: string }
  | { state: 'valid'; kitName: string; kitType: KitType; orderId: string }

const KIT_NAMES: Record<string, string> = {
  'testosterone':     'Testosterone Health Check',
  'energy-recovery':  'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

export async function getKitActivation(
  kitCode: string,
  userId: string
): Promise<KitActivationState> {
  const supabase = await createSupabaseServerClient()

  const { data: order, error } = await supabase
    .from('kit_orders')
    .select('id, user_id, kit_type, kit_activated_at')
    .eq('id', kitCode)
    .single()

  if (error || !order) {
    return { state: 'not-found' }
  }

  if (order.user_id !== userId) {
    return { state: 'wrong-account' }
  }

  const kitName = KIT_NAMES[order.kit_type] ?? order.kit_type

  if (order.kit_activated_at) {
    return { state: 'already-activated', kitName }
  }

  return {
    state: 'valid',
    kitName,
    kitType: order.kit_type as KitType,
    orderId: order.id,
  }
}
