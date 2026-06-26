import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { cioKeyFromEmail } from '@/lib/customerio/identity'
import { BORDERLINE_NURTURE_CONSENT_VERSION } from '@/lib/results/borderlineNurtureConsent'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ConsentBody {
  email?: string
  consent?: boolean
}

// Borderline-testosterone nurture explicit opt-in (Art 6(1)(a) + Art 9(2)(a)).
// Direct clone of /api/lowt-nurture/consent for the 12–<15 nmol/L (low-end-of-
// normal) cohort. Records the consent, then — and ONLY then — emits the
// `borderline_nurture_consented` event that seq-03d triggers on, plus a minimal
// `borderline_nurture_consent` flag on the profile. The borderline flag is
// deliberately NOT set at result-processing time (see
// lib/results/processResult.ts buildCioTraits); consent is the gate. This mirrors
// the low-T pattern exactly. Fix spec:
// 09_website-app/docs/seq-03-results-signal-fix-spec-2026-06-26.md.
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
    .from('borderline_nurture_consent')
    .select('id')
    .ilike('email', email)
    .is('withdrawn_at', null)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error('[borderline-nurture/consent] Lookup failed:', existingError.message)
  }

  if (existing) {
    return NextResponse.json({ ok: true, alreadyConsented: true })
  }

  const { data: inserted, error: insertError } = await supabase
    .from('borderline_nurture_consent')
    .insert({
      user_id: userId,
      email,
      consent_version: BORDERLINE_NURTURE_CONSENT_VERSION,
      source: 'result_card',
    })
    .select('id, consented_at')
    .single()

  if (insertError) {
    if (/duplicate key|already exists/i.test(insertError.message)) {
      return NextResponse.json({ ok: true, alreadyConsented: true })
    }
    console.error('[borderline-nurture/consent] Insert failed:', insertError.message)
    return NextResponse.json({ error: 'Could not record consent' }, { status: 500 })
  }

  const consentedAt = inserted?.consented_at ?? new Date().toISOString()
  // Key on the EMAIL (canonical CIO identifier) so the borderline nurture flag
  // lands on the SAME profile the purchase/result emails use. See
  // lib/customerio/identity.
  const cioId = cioKeyFromEmail(email)

  // Consent given → now (and only now) send the minimal health-derived flag to
  // CIO and fire the trigger event the seq-03d campaign listens on. The raw
  // testosterone value / number is never sent (CA-020): the flag carries no value.
  await identifyUser(cioId, {
    email,
    borderline_nurture_consent: true,
    borderline_nurture_consent_version: BORDERLINE_NURTURE_CONSENT_VERSION,
    borderline_nurture_consented_at: consentedAt,
  })

  await emitEvent(cioId, {
    name: 'borderline_nurture_consented',
    data: {
      email,
      consent_version: BORDERLINE_NURTURE_CONSENT_VERSION,
      consented_at: consentedAt,
      has_account: Boolean(userId),
    },
  })

  return NextResponse.json({ ok: true, alreadyConsented: false, id: inserted?.id })
}
