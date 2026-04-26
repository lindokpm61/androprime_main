import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const userOrResponse = await requireAuthenticatedApiUser(request)
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  let kitCode: string
  try {
    const body = await request.json()
    kitCode = body.kitCode
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!kitCode) {
    return NextResponse.json({ error: 'Missing kitCode' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()

  // Only activate if owned by this user and not yet activated (idempotent)
  const { error } = await supabase
    .from('kit_orders')
    .update({ kit_activated_at: new Date().toISOString() })
    .eq('id', kitCode)
    .eq('user_id', user.id)
    .is('kit_activated_at', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
