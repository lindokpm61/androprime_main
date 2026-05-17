import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PRODUCT_MAP } from './products'

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

export async function getSubscriptions(userId: string): Promise<SubscriptionRow[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('supplement_subscriptions')
    .select('id, product_slug, status, started_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (error || !data) return []

  return data.map((row) => {
    const product = PRODUCT_MAP[row.product_slug] ?? { name: row.product_slug, price: '' }
    return {
      id: row.id,
      productSlug: row.product_slug,
      productName: product.name,
      price: product.price,
      status: row.status as SubscriptionStatus,
      startedAt: row.started_at,
    }
  })
}
