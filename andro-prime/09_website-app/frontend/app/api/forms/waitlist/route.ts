import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { trackEvent, attributionFromBody } from '@/lib/analytics/events'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// General waitlist capture (seq-01). Mirrors the supplement-waitlist /
// founding-member / newsletter routes: do NOT write the `users` table from this
// route. `users.id` is FK'd to `auth.users(id)`, so a guest insert with a
// generated UUID fails `users_id_fkey` (the "Failed to save email" 500 — guests
// are every logged-out visitor). Guests are identified in Customer.io by email +
// the first-party `events` log; authenticated users keep their auth id.
export async function POST(request: NextRequest) {
  let body: { email?: string; [key: string]: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const authedUser = await getCurrentUser()
  const cioId = authedUser?.id ?? email

  // identify first so the CIO profile is emailable (an event alone never sets an
  // email), then emit the trigger event for seq-01.
  await identifyUser(cioId, { email })
  await emitEvent(cioId, {
    name: 'waitlist_signup',
    data: { email, has_account: Boolean(authedUser?.id) },
  })

  // First-party analytics + GA4 mirror (best-effort; never throws).
  await trackEvent('email_signup', {
    email,
    anonymousId: authedUser?.id ?? null,
    ...attributionFromBody(body),
    props: { source: 'waitlist' },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
