import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent } from '@/lib/customerio/emit'

interface DispatchBody {
  orderId: string
  kitType: string
  userEmail: string
}

export async function POST(request: NextRequest) {
  let body: DispatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { orderId, kitType, userEmail } = body
  if (!orderId || !kitType) {
    return NextResponse.json({ error: 'Missing orderId or kitType' }, { status: 400 })
  }

  // TODO: Replace this stub with the real Thriva dispatch API call once onboarding
  // is complete and the endpoint format is confirmed by Thriva.
  console.log('[thriva-dispatch] Dispatching kit', { orderId, kitType, userEmail })

  const supabase = createSupabaseAdminClient()

  const { error } = await supabase
    .from('kit_orders')
    .update({ status: 'dispatched' })
    .eq('id', orderId)

  if (error) {
    console.error('[thriva-dispatch] Failed to update kit_orders status:', error.message)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }

  // Look up user_id from the order to emit the Customer.io event
  const { data: order } = await supabase
    .from('kit_orders')
    .select('user_id')
    .eq('id', orderId)
    .single()

  if (order?.user_id) {
    await emitEvent(order.user_id, {
      name: 'kit_dispatched',
      data: { kit_type: kitType, order_id: orderId },
    })
  }

  return NextResponse.json({ dispatched: true })
}
