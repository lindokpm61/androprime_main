import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { trackEvent, attributionFromBody } from '@/lib/analytics/events'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Soft inline capture from the test-selector quiz. The quiz result is shown to
// the user regardless; this route only runs when they explicitly opt in (ticked
// consent + email).
//
// Like the waitlist routes, it does NOT write the `users` table: `users.id` is
// FK'd to `auth.users(id)`, so a guest insert with a generated UUID fails the FK
// (the "Failed to save email" 500). Guests are identified in Customer.io by
// email; authenticated users keep their auth id. seq-06 (Quiz Nurture) branches
// on the quiz_recommended_kit / quiz_symptom_flags attributes set here.
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

  const email = (body.email ?? '').trim().toLowerCase()
  const { recommendedKit, symptomFlags } = body

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (!recommendedKit) {
    return NextResponse.json({ error: 'recommendedKit is required' }, { status: 400 })
  }

  // Key Customer.io on the authed user id when available, else the email string.
  const authedUser = await getCurrentUser()
  const cioId = authedUser?.id ?? email

  // seq-06 (Quiz Nurture) branches on these attributes — they must be set via
  // identify, not just sent as event data.
  await identifyUser(cioId, {
    email,
    quiz_recommended_kit: recommendedKit,
    quiz_symptom_flags: symptomFlags ?? [],
  })
  await emitEvent(cioId, {
    name: 'quiz_complete',
    data: {
      recommended_kit: recommendedKit,
      symptom_flags: symptomFlags ?? [],
      has_account: Boolean(authedUser?.id),
    },
  })

  // First-party analytics + GA4 mirror (best-effort; never throws). Page
  // attribution carries the cold-to-warm bridge's UTMs (e.g. a quiz reached from
  // a newsletter link), making newsletter -> quiz -> purchase traceable.
  await trackEvent('quiz_complete', {
    email,
    anonymousId: authedUser?.id ?? null,
    kitId: recommendedKit,
    ...attributionFromBody(body),
    props: { recommended_kit: recommendedKit, symptom_flags: symptomFlags ?? [] },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
