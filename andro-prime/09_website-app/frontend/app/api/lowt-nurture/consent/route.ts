import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The consent-text version the customer agreed to. Bump this (and the copy in
// LowTNurtureConsent.tsx) together whenever the wording changes — the stored
// record must point at exactly what was shown. Art 7(1) accountability.
export const LOWT_NURTURE_CONSENT_VERSION = '2026-06-04-v1'

interface ConsentBody {
  email?: string
  consent?: boolean
}

// Low-T nurture explicit opt-in (Art 6(1)(a) + Art 9(2)(a)). Records the
// consent, then — and ONLY then — sends the `low_testosterone` health-derived
// trait to Customer.io so the nurture programme can target this person. The
// trait is deliberately NOT set at result-processing time (see
// lib/results/processResult.ts buildCioTraits); consent is the gate. Lawful
// basis + conditions: 03_compliance/2026-06-04-lowt-nurture-lawful-basis.md.
// Mirrors /api/supplement-waitlist/join: explicit consent required, idempotent
// on active email, no writes to the `users` table (guest-safe FK pattern).
export async function POST(request: NextRequest) {
  let body: ConsentBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Explicit consent is mandatory — this is special-category (health) data.
  if (body.consent !== true) {
    return NextResponse.json(
      { error: 'Explicit consent is required' },
      { status: 400 },
    )
  }

  // The results dashboard is authenticated, so the email comes from the session
  // by default; a body email (e.g. future guest surface) is accepted as a
  // fallback. Either way it must be a valid address.
  const authedUser = await getCurrentUser()
  const userId = authedUser?.id ?? null
  const email = ((body.email ?? authedUser?.email) ?? '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Idempotency: an active (non-withdrawn) consent for this email already exists.
  const { data: existing, error: existingError } = await supabase
    .from('lowt_nurture_consent')
    .select('id')
    .ilike('email', email)
    .is('withdrawn_at', null)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error('[lowt-nurture/consent] Lookup failed:', existingError.message)
  }

  if (existing) {
    return NextResponse.json({ ok: true, alreadyConsented: true })
  }

  const { data: inserted, error: insertError } = await supabase
    .from('lowt_nurture_consent')
    .insert({
      user_id: userId,
      email,
      consent_version: LOWT_NURTURE_CONSENT_VERSION,
      source: 'result_card',
    })
    .select('id, consented_at')
    .single()

  if (insertError) {
    if (/duplicate key|already exists/i.test(insertError.message)) {
      return NextResponse.json({ ok: true, alreadyConsented: true })
    }
    console.error('[lowt-nurture/consent] Insert failed:', insertError.message)
    return NextResponse.json({ error: 'Could not record consent' }, { status: 500 })
  }

  const consentedAt = inserted?.consented_at ?? new Date().toISOString()
  const cioId = userId ?? email

  // Consent given → now (and only now) send the health-derived flag to CIO and
  // fire the trigger event the nurture campaign listens on.
  await identifyUser(cioId, {
    email,
    low_testosterone: true,
    lowt_nurture_consent: true,
    lowt_nurture_consent_version: LOWT_NURTURE_CONSENT_VERSION,
    lowt_nurture_consented_at: consentedAt,
  })

  await emitEvent(cioId, {
    name: 'lowt_nurture_consented',
    data: {
      email,
      consent_version: LOWT_NURTURE_CONSENT_VERSION,
      consented_at: consentedAt,
      has_account: Boolean(userId),
    },
  })

  return NextResponse.json({ ok: true, alreadyConsented: false, id: inserted?.id })
}
