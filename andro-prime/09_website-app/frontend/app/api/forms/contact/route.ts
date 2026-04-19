import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, email, message } = body
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Anonymous contact form — use a fixed system UUID as user_id (no FK constraint on this table)
  const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000'

  const { error } = await supabase.from('lifecycle_events').insert({
    user_id: SYSTEM_USER_ID,
    event_name: 'contact_form',
    payload: { name, email, message },
  })

  if (error) {
    console.error('[contact] Failed to log contact submission:', error.message)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
