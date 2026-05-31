import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { trackEvent, attributionFromBody } from '@/lib/analytics/events'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Soft inline capture from the test-selector quiz. The quiz result is shown
// to the user regardless; this route only runs when they explicitly opt in
// (ticked consent + email), so marketing_consent is true by construction.
export async function POST(request: NextRequest) {
  let body: {
    email?: string
    recommendedKit?: string
    symptomFlags?: string[]
    [key: string]: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, recommendedKit, symptomFlags } = body

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (!recommendedKit) {
    return NextResponse.json({ error: 'recommendedKit is required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Resolve (or create) the user so Customer.io is keyed to a stable id that
  // matches the same person on later events (purchase, etc.).
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  const id = existing?.id ?? randomUUID()

  const { error } = await supabase
    .from('users')
    .upsert({ id, email, marketing_consent: true }, { onConflict: 'email' })

  if (error) {
    console.error('[test-selector] Failed to upsert user:', error.message)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (user?.id) {
    // seq-06 (Quiz Nurture) branches on the customer attributes
    // quiz_recommended_kit and quiz_symptom_flags — these must be set via
    // identify, not just sent as event data.
    await identifyUser(user.id, {
      email,
      quiz_recommended_kit: recommendedKit,
      quiz_symptom_flags: symptomFlags ?? [],
    })
    await emitEvent(user.id, {
      name: 'quiz_complete',
      data: {
        recommended_kit: recommendedKit,
        symptom_flags: symptomFlags ?? [],
      },
    })
    // First-party analytics + GA4 mirror (best-effort; never throws). The page
    // attribution carries the cold-to-warm bridge's UTMs (e.g. a quiz reached
    // from a newsletter link), making newsletter -> quiz -> purchase traceable.
    await trackEvent('quiz_complete', {
      email,
      anonymousId: user.id,
      kitId: recommendedKit,
      ...attributionFromBody(body),
      props: { recommended_kit: recommendedKit, symptom_flags: symptomFlags ?? [] },
    })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
