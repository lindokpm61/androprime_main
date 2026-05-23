import { randomUUID } from 'crypto'
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

  // Upsert the users row with marketing_consent: true. Gated on the explicit
  // consent checkbox client-side; the boolean is re-checked above.
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  const userId = authedUser?.id ?? existingUser?.id ?? randomUUID()

  const { error: userUpsertError } = await supabase
    .from('users')
    .upsert({ id: userId, email, marketing_consent: true }, { onConflict: 'email' })

  if (userUpsertError) {
    console.error('[supplement-waitlist/join] User upsert failed:', userUpsertError.message)
    return NextResponse.json({ error: 'Could not save email' }, { status: 500 })
  }

  // Re-read to capture the canonical user id when the row already existed
  // under a different id (race with another opt-in path).
  const { data: persistedUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  const canonicalUserId = persistedUser?.id ?? userId

  const { data: inserted, error: insertError } = await supabase
    .from('supplement_waitlist')
    .insert({
      user_id: canonicalUserId,
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

  // identify first so the CIO profile is emailable and segments can be
  // backed by the traits below, then emit the trigger event.
  await identifyUser(canonicalUserId, {
    email,
    supplement_waitlist: true,
    supplement_waitlist_source_marker: sourceMarker,
    supplement_waitlist_source_kit: sourceKit,
    supplement_waitlist_interested_in_product: interestedInProduct,
    supplement_waitlist_joined_at: listedAt,
  })

  await emitEvent(canonicalUserId, {
    name: 'supplement_waitlist_joined',
    data: {
      email,
      source_marker: sourceMarker,
      source_kit: sourceKit,
      interested_in_product: interestedInProduct,
      joined_at: listedAt,
      has_account: Boolean(authedUser?.id),
    },
  })

  return NextResponse.json({ ok: true, alreadyListed: false, id: inserted?.id })
}
