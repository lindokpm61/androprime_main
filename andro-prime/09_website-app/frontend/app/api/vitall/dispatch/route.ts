import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent } from '@/lib/customerio/emit'
import { cioKeyFromEmail } from '@/lib/customerio/identity'
import { createOrder } from '@/lib/vitall/client'
import type { VitallPatientAddress } from '@/lib/vitall/types'
import type { KitType } from '@/lib/results/types'

// Maps our kit types to Vitall test shortCodes configured on our account.
// Provided by Ben Starling (Vitall) 2026-05-08.
const KIT_TEST_CODES: Record<KitType, string[]> = {
  testosterone: ['andro-prime-hormone-check'],
  'energy-recovery': ['andro-prime-energy-metabolism'],
  'hormone-recovery': ['andro-prime-combo-test'],
}

interface DispatchBody {
  orderId: string
  kitType: KitType
}

export async function POST(request: NextRequest) {
  let body: DispatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { orderId, kitType } = body

  if (!orderId || !kitType) {
    return NextResponse.json({ error: 'Missing orderId or kitType' }, { status: 400 })
  }

  const testCodes = KIT_TEST_CODES[kitType]
  if (!testCodes) {
    return NextResponse.json({ error: `Unknown kitType: ${kitType}` }, { status: 400 })
  }

  if (!process.env.VITALL_CLIENT_ID || !process.env.VITALL_CLIENT_SECRET) {
    console.warn('[vitall-dispatch] Vitall credentials not configured — skipping dispatch')
    return NextResponse.json({ skipped: true, reason: 'vitall_not_configured' })
  }

  const supabase = createSupabaseAdminClient()

  // Pull the full patient record from kit_orders → users
  const { data: order, error: orderError } = await supabase
    .from('kit_orders')
    .select('id, user_id, shipping_address')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    console.error('[vitall-dispatch] Could not load kit_orders row:', orderError?.message)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select(
      'id, email, first_name, last_name, phone, date_of_birth, sex, address_line1, address_line2, address_city, address_county, address_postal_code, address_country',
    )
    .eq('id', order.user_id)
    .single()

  if (userError || !user) {
    console.error('[vitall-dispatch] Could not load user:', userError?.message)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Per-order shipping snapshot wins for the lab dispatch (in case the user
  // updated their profile address between order and dispatch). Fall back to
  // the user record if the order has no snapshot.
  const orderShipping = (order.shipping_address ?? null) as
    | {
        line1?: string | null
        line2?: string | null
        city?: string | null
        state?: string | null
        postal_code?: string | null
        country?: string | null
      }
    | null

  const line2 = orderShipping?.line2 ?? user.address_line2 ?? undefined
  const city = orderShipping?.city ?? user.address_city ?? ''
  // Vitall's /order/create requires a non-empty county (an empty string returns
  // 400 "Patient details are incomplete"). Source it from Stripe's `state` field
  // (captured into shipping_address.state / users.address_county), and fall back
  // to the city so the field is never empty.
  const county = orderShipping?.state ?? user.address_county ?? city
  const address: VitallPatientAddress = {
    line1: orderShipping?.line1 ?? user.address_line1 ?? '',
    ...(line2 ? { line2 } : {}),
    city,
    county: county || city,
    postCode: orderShipping?.postal_code ?? user.address_postal_code ?? '',
  }

  if (!user.first_name || !user.last_name || !user.date_of_birth || !user.sex) {
    console.error('[vitall-dispatch] Patient profile incomplete for order', orderId)
    return NextResponse.json(
      { error: 'Patient profile incomplete (missing name, DOB, or sex)' },
      { status: 422 },
    )
  }

  if (!address.line1 || !address.city || !address.postCode) {
    console.error('[vitall-dispatch] Shipping address incomplete for order', orderId)
    return NextResponse.json(
      { error: 'Shipping address incomplete' },
      { status: 422 },
    )
  }

  let vitallOrderId: string
  try {
    const vitallResponse = await createOrder({
      partnerOrderId: orderId,
      collection: 'self-collection',
      tests: testCodes,
      patient: {
        partnerUserId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        sex: user.sex,
        birthDate: user.date_of_birth,
        phone: user.phone ?? undefined,
        address,
      },
    })
    vitallOrderId = vitallResponse.order.orderId
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Vitall API error'
    console.error('[vitall-dispatch] createOrder failed:', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const { error: updateError } = await supabase
    .from('kit_orders')
    .update({ status: 'dispatched', vitall_order_id: vitallOrderId })
    .eq('id', orderId)

  if (updateError) {
    console.error('[vitall-dispatch] Failed to update kit_orders:', updateError.message)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }

  // Key the CIO event on the EMAIL (canonical identifier) so T-02 lands on the
  // same profile as the order-confirmation + any signup. See lib/customerio/identity.
  if (user.email) {
    await emitEvent(cioKeyFromEmail(user.email), {
      name: 'kit_dispatched',
      data: { kit_type: kitType, order_id: orderId, vitall_order_id: vitallOrderId },
    })
  }

  return NextResponse.json({ dispatched: true, vitall_order_id: vitallOrderId })
}
