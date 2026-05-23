import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_PRODUCTS = new Set([
  'daily-stack',
  'collagen',
  'complete-mens-stack',
  'any',
])

interface JoinBody {
  email?: string
  consent?: boolean
  source_marker?: string
  source_kit?: string
  interested_in_product?: string
}

// Phase 0a supplement early-access waitlist. Mirrors
// `/api/founding-member/join`: explicit GDPR consent, idempotent on email,
// upserts the user with `marketing_consent: true`, then identifies + emits
// to Customer.io. Powers the `supplement-waitlist` CTA on result cards
// while the supplement range is deferred behind the kit launch.
export async function POST(request: NextRequest) {
  let body: JoinBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { error: 'Marketing consent is required to join the list' },
      { status: 400 },
    )
  }

  const sourceMarker = body.source_marker?.trim().slice(0, 64) || null
  const sourceKit = body.source_kit?.trim().slice(0, 64) || null
  const rawProduct = body.interested_in_product?.trim() || null
  const interestedInProduct =
    rawProduct && ALLOWED_PRODUCTS.has(rawProduct) ? rawProduct : null

  const authedUser = await getCurrentUser()
  const supabase = createSupabaseAdminClient()

  // Idempotency: if there's already an active waitlist row for this email,
  // return success without re-emitting CIO events. Match the founding-member
  // pattern.
  const { data: existing, error: existingError } = await supabase
    .from('supplement_waitlist')
    .select('id, user_id')
    .ilike('email', email)
    .is('unlisted_at', null)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error('[supplement-waitlist/join] Lookup failed:', existingError.message)
  }

  if (existing) {
    return NextResponse.json({ ok: true, alreadyListed: true })
  }

  // Mirror founding-member/join: do NOT mutate the `users` table from this
  // route. `users.id` is FK'd to `auth.users(id)`, so any guest insert with a
  // freshly-generated UUID fails the FK constraint (the cause of the original
  // "Could not save email" 500). Guests are tracked entirely through
  // `supplement_waitlist` (with `user_id` null) + Customer.io keyed on email.
  // Authenticated users keep their auth id end-to-end.
  const userId = authedUser?.id ?? null

  const { data: inserted, error: insertError } = await supabase
    .from('supplement_waitlist')
    .insert({
      user_id: userId,
      email,
      source_marker: sourceMarker,
      source_kit: sourceKit,
      interested_in_product: interestedInProduct,
    })
    .select('id, listed_at')
    .single()

  if (insertError) {
    if (/duplicate key|already exists/i.test(insertError.message)) {
      return NextResponse.json({ ok: true, alreadyListed: true })
    }
    console.error('[supplement-waitlist/join] Insert failed:', insertError.message)
    return NextResponse.json({ error: 'Could not add to list' }, { status: 500 })
  }

  const listedAt = inserted?.listed_at ?? new Date().toISOString()

  // Key Customer.io on the authed user id when available, else on the email
  // string — mirrors founding-member/join. CIO accepts an email as the
  // identifier, so a guest opt-in is still identifiable and the
  // supplement_waitlist segment fills correctly.
  const cioId = userId ?? email

  // identify first so the CIO profile is emailable and segment 24 (backed by
  // supplement_waitlist=true) populates, then emit the trigger event.
  await identifyUser(cioId, {
    email,
    supplement_waitlist: true,
    supplement_waitlist_source_marker: sourceMarker,
    supplement_waitlist_source_kit: sourceKit,
    supplement_waitlist_interested_in_product: interestedInProduct,
    supplement_waitlist_joined_at: listedAt,
  })

  await emitEvent(cioId, {
    name: 'supplement_waitlist_joined',
    data: {
      email,
      source_marker: sourceMarker,
      source_kit: sourceKit,
      interested_in_product: interestedInProduct,
      joined_at: listedAt,
      has_account: Boolean(userId),
    },
  })

  return NextResponse.json({ ok: true, alreadyListed: false, id: inserted?.id })
}
