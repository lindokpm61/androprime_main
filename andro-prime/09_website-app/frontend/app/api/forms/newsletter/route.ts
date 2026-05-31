import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { trackEvent, attributionFromBody } from '@/lib/analytics/events'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Blog "Health Intelligence Newsletter" capture. Mirrors /api/forms/waitlist:
// upsert the user with marketing_consent: true (gated client-side on an
// explicit, unticked consent box — UK GDPR, no pre-ticked marketing consent)
// and emit `newsletter_signup` for the CIO newsletter campaign to trigger on.
export async function POST(request: NextRequest) {
  let body: { email?: string; source?: string; [key: string]: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email } = body
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  // Where the capture happened (e.g. 'article-footer', 'blog-index'). Defaults to
  // 'blog' for back-compat with any caller that doesn't send it.
  const source = typeof body.source === 'string' && body.source.length <= 50 ? body.source : 'blog'

  const supabase = createSupabaseAdminClient()

  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()

  const id = existing?.id ?? randomUUID()

  const { error } = await supabase
    .from('users')
    .upsert({ id, email, marketing_consent: true }, { onConflict: 'email' })

  if (error) {
    console.error('[newsletter] Failed to upsert user:', error.message)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (user?.id) {
    // identify first so the CIO profile is emailable (track alone never sets
    // an email) and `newsletter_subscriber` can back a CIO segment for the
    // editorial broadcast; then emit the trigger event.
    await identifyUser(user.id, {
      email,
      newsletter_subscriber: true,
      newsletter_signup_source: source,
    })
    await emitEvent(user.id, { name: 'newsletter_signup', data: { email, source } })
    // First-party analytics + GA4 mirror (best-effort; never throws). Carries the
    // page attribution so newsletter signups are visible and source-attributable.
    await trackEvent('email_signup', {
      email,
      anonymousId: user.id,
      ...attributionFromBody(body),
      props: { source, list: 'newsletter' },
    })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
