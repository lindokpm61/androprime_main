import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { formatOrderRef, parseOrderRef } from '@/lib/orders/orderRef'

/**
 * Support-side order lookup.
 *
 * The point of `order_seq` is that a customer can quote `AP-10042` down a phone,
 * which is only worth anything if support can then find the order. This is that
 * surface. It runs on the service-role client because support is looking up
 * somebody else's order by definition, so RLS would return nothing.
 *
 * Whatever the customer gives you is the query: the reference, the email they
 * ordered with, or — when the conversation is with Ben rather than the customer —
 * the Vitall order id. The query decides which by shape rather than making
 * support pick a field.
 */

export type OrderSearchKind = 'order_ref' | 'email' | 'vitall_order_id'

export interface OrderSearchHit {
  id: string
  orderRef: string | null
  kitType: string
  status: string
  orderedAt: string | null
  vitallOrderId: string | null
  isTest: boolean
  email: string | null
  name: string | null
}

export interface OrderSearchResult {
  query: string
  kind: OrderSearchKind
  hits: OrderSearchHit[]
  error?: string
}

const SELECT =
  'id, order_seq, kit_type, status, ordered_at, vitall_order_id, is_test, user_id'

interface OrderRow {
  id: string
  order_seq: number | null
  kit_type: string
  status: string
  ordered_at: string | null
  vitall_order_id: string | null
  is_test: boolean
  user_id: string | null
}

/** Digits only, with an optional AP prefix, is a reference. An @ is an email. Otherwise assume a Vitall id. */
function classify(query: string): OrderSearchKind {
  if (parseOrderRef(query) !== null) return 'order_ref'
  if (query.includes('@')) return 'email'
  return 'vitall_order_id'
}

export async function findOrders(rawQuery: string): Promise<OrderSearchResult> {
  const query = rawQuery.trim()
  const kind = classify(query)

  if (query === '') {
    return { query, kind, hits: [] }
  }

  try {
    const supabase = createSupabaseAdminClient()

    let rows: OrderRow[] = []

    if (kind === 'email') {
      // Two hops rather than a join: `kit_orders` has no email, and the embedded
      // -resource filter syntax silently returns every order when the related
      // filter matches nothing, which is the worst possible failure mode here.
      // PostgREST parses `,` `(` `)` as filter syntax inside a value, so strip the
      // characters that would change the meaning of the query rather than the
      // string being matched. None of them are legal in an email anyway.
      const safeEmail = query.replace(/[,()*\\"']/g, '')
      if (safeEmail === '') return { query, kind, hits: [] }

      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .ilike('email', `%${safeEmail}%`)
        .limit(25)

      if (userError) throw new Error(userError.message)

      const userIds = (users ?? []).map((u) => u.id as string)
      if (userIds.length === 0) return { query, kind, hits: [] }

      const { data, error } = await supabase
        .from('kit_orders')
        .select(SELECT)
        .in('user_id', userIds)
        .order('ordered_at', { ascending: false })
        .limit(50)

      if (error) throw new Error(error.message)
      rows = (data ?? []) as unknown as OrderRow[]
    } else {
      const column = kind === 'order_ref' ? 'order_seq' : 'vitall_order_id'
      const value = kind === 'order_ref' ? parseOrderRef(query) : query

      const { data, error } = await supabase
        .from('kit_orders')
        .select(SELECT)
        .eq(column, value as never)
        .order('ordered_at', { ascending: false })
        .limit(50)

      if (error) throw new Error(error.message)
      rows = (data ?? []) as unknown as OrderRow[]
    }

    if (rows.length === 0) return { query, kind, hits: [] }

    // Resolve the customer for display in one pass.
    const userIds = Array.from(
      new Set(rows.map((r) => r.user_id).filter((id): id is string => Boolean(id))),
    )

    const { data: userRows } = userIds.length
      ? await supabase
          .from('users')
          .select('id, email, first_name, last_name')
          .in('id', userIds)
      : { data: [] }

    const usersById = new Map(
      (userRows ?? []).map((u) => {
        const record = u as { id: string; email: string | null; first_name: string | null; last_name: string | null }
        return [record.id, record]
      }),
    )

    const hits: OrderSearchHit[] = rows.map((row) => {
      const user = row.user_id ? usersById.get(row.user_id) : undefined
      const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ')
      return {
        id: row.id,
        orderRef: formatOrderRef(row.order_seq),
        kitType: row.kit_type,
        status: row.status,
        orderedAt: row.ordered_at,
        vitallOrderId: row.vitall_order_id,
        isTest: row.is_test,
        email: user?.email ?? null,
        name: name || null,
      }
    })

    return { query, kind, hits }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'order lookup failed'
    return { query, kind, hits: [], error: message }
  }
}
