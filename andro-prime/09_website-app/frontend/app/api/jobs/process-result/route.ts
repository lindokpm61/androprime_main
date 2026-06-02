import { NextRequest, NextResponse } from 'next/server'
import { verifyQStashRequest } from '@/lib/qstash/verify'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { processVitallResult } from '@/lib/results/processResult'
import type { VitallWebhookPayload } from '@/lib/vitall/types'

export async function POST(request: NextRequest) {
  let rawBody: string
  try {
    rawBody = await verifyQStashRequest(request)
  } catch {
    return NextResponse.json({ error: 'Invalid QStash signature' }, { status: 401 })
  }

  let payload: VitallWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { status, body } = await processVitallResult(payload, supabase)
  return NextResponse.json(body, { status })
}
