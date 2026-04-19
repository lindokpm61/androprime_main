import { NextRequest, NextResponse } from 'next/server'
import { emitEvent } from '@/lib/customerio/emit'

export async function POST(request: NextRequest) {
  let body: { recommendedKit?: string; symptomFlags?: Record<string, boolean> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { recommendedKit, symptomFlags } = body
  if (!recommendedKit) {
    return NextResponse.json({ error: 'recommendedKit is required' }, { status: 400 })
  }

  const userId = request.headers.get('x-user-id')

  // symptom_answers requires an order_id which isn't known until after purchase.
  // Answers are linked to the order in the Stripe webhook handler once the order_id exists.
  // For now, just emit the Customer.io event so quiz data is captured in CIO.

  const cioUserId = userId ?? `anon_${Date.now()}`
  await emitEvent(cioUserId, {
    name: 'quiz_complete',
    data: { recommended_kit: recommendedKit, symptom_flags: symptomFlags ?? {} },
  })

  return NextResponse.json({ success: true })
}
