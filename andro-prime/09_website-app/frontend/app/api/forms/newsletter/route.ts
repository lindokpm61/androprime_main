import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { cioKeyFromEmail } from '@/lib/customerio/identity'
import { trackEvent, attributionFromBody } from '@/lib/analytics/events'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Blog "Health Intelligence Newsletter" capture. Mirrors
// /api/supplement-waitlist/join and /api/founding-member/join: do NOT write the
// `users` table from this route. `users.id` is FK'd to `auth.users(id)`, so a
// guest insert with a generated UUID fails the FK constraint (this was the
// "Failed to save email" 500). Guests are tracked entirely through Customer.io
// keyed on email + the first-party `events` log; authenticated users keep their
// auth id. The CIO `Newsletter Subscribers` segment is backed by the
// `newsletter_subscriber` attribute set below, not a Supabase table.
export async function POST(request: NextRequest) {
  let body: { email?: string; source?: string; [key: string]: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  // Where the capture happened (e.g. 'article-footer', 'blog-index'). Defaults to
  // 'blog' for back-compat with any caller that doesn't send it.
  const source =
    typeof body.source === 'string' && body.source.length <= 50 ? body.source : 'blog'

  // Key Customer.io on the EMAIL (canonical identifier) so this profile is the
  // same one a later purchase/result will use — keying on the auth UUID created
  // a colliding second profile that dropped the email. See lib/customerio/identity.
  const authedUser = await getCurrentUser()
  const cioId = cioKeyFromEmail(email)

  // identify first so the profile is emailable and the segment populates, then
  // emit the trigger event.
  await identifyUser(cioId, {
    email,
    newsletter_subscriber: true,
    newsletter_signup_source: source,
  })
  await emitEvent(cioId, {
    name: 'newsletter_signup',
    data: { email, source, has_account: Boolean(authedUser?.id) },
  })

  // First-party analytics + GA4 mirror (best-effort; never throws). The events
  // row (keyed by email_hash, no auth FK) is the first-party record of the
  // signup and carries page attribution + capture source.
  await trackEvent('email_signup', {
    email,
    anonymousId: authedUser?.id ?? null,
    ...attributionFromBody(body),
    props: { source, list: 'newsletter' },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
