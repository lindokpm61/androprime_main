import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent } from '@/lib/customerio/emit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email } = body
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Check if user already exists before upserting
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()

  const id = existing?.id ?? randomUUID()

  const { error } = await supabase
    .from('users')
    .upsert({ id, email, marketing_consent: true }, { onConflict: 'email' })

  if (error) {
    console.error('[waitlist] Failed to upsert user:', error.message)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (user?.id) {
    await emitEvent(user.id, { name: 'waitlist_signup', data: { email } })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
