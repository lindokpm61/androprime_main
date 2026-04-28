import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent } from '@/lib/customerio/emit'
import { createOrder } from '@/lib/vitall/client'
import type { VitallPatientAddress } from '@/lib/vitall/types'
import type { KitType } from '@/lib/results/types'

// Maps our kit types to Vitall test shortCodes configured on our account.
// Confirm these shortCodes from GET /tests → your_tests after Vitall account setup.
const KIT_TEST_CODES: Record<KitType, string[]> = {
  testosterone: ['andro-prime-testosterone'],
  'energy-recovery': ['andro-prime-energy'],
  'hormone-recovery': ['andro-prime-hormone-recovery'],
}

interface DispatchBody {
  orderId: string
  kitType: KitType
  patient: {
    userId: string
    email: string
    firstName: string
    lastName: string
    sex: 'male' | 'female'
    birthDate: string           // YYYY-MM-DD
    phone?: string
    address: VitallPatientAddress
  }
}

export async function POST(request: NextRequest) {
  let body: DispatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { orderId, kitType, patient } = body

  if (!orderId || !kitType || !patient) {
    return NextResponse.json({ error: 'Missing orderId, kitType, or patient' }, { status: 400 })
  }

  const testCodes = KIT_TEST_CODES[kitType]
  if (!testCodes) {
    return NextResponse.json({ error: `Unknown kitType: ${kitType}` }, { status: 400 })
  }

  let vitallOrderId: string
  try {
    const vitallResponse = await createOrder({
      partnerOrderId: orderId,
      collection: 'self-collection',
      tests: testCodes,
      patient: {
        partnerUserId: patient.userId,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        sex: patient.sex,
        birthDate: patient.birthDate,
        phone: patient.phone,
        address: patient.address,
      },
    })
    vitallOrderId = vitallResponse.order.orderId
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Vitall API error'
    console.error('[vitall-dispatch] createOrder failed:', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const supabase = createSupabaseAdminClient()

  const { error: updateError } = await supabase
    .from('kit_orders')
    .update({ status: 'dispatched', vitall_order_id: vitallOrderId })
    .eq('id', orderId)

  if (updateError) {
    console.error('[vitall-dispatch] Failed to update kit_orders:', updateError.message)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }

  await emitEvent(patient.userId, {
    name: 'kit_dispatched',
    data: { kit_type: kitType, order_id: orderId, vitall_order_id: vitallOrderId },
  })

  return NextResponse.json({ dispatched: true, vitall_order_id: vitallOrderId })
}
