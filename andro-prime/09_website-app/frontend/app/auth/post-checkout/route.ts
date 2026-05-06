import { type NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'
const MAX_SESSION_AGE_MS = 60 * 60 * 1000

const ALLOWED_NEXT_PATHS = new Set([
  '/order/confirmed',
  '/subscription/confirmed',
  '/deposit/confirmed',
])

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const sessionId = url.searchParams.get('session_id')
  const nextRaw = url.searchParams.get('next') ?? '/order/confirmed'
  const next = ALLOWED_NEXT_PATHS.has(nextRaw) ? nextRaw : '/order/confirmed'

  const failureUrl = new URL(next, SITE_URL)

  if (!isSupabaseConfigured() || !sessionId) {
    console.warn('[post-checkout] Missing supabase config or session_id — falling through')
    return NextResponse.redirect(failureUrl)
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    console.error('[post-checkout] Failed to retrieve Stripe session:', err)
    return NextResponse.redirect(failureUrl)
  }

  const ageMs = Date.now() - session.created * 1000
  if (ageMs > MAX_SESSION_AGE_MS) {
    console.warn(`[post-checkout] Session too old (${Math.round(ageMs / 1000)}s) — falling through`)
    return NextResponse.redirect(failureUrl)
  }

  const customerDetails = session.customer_details as { email?: string | null } | null
  const email = session.customer_email ?? customerDetails?.email ?? null
  if (!email) {
    console.warn('[post-checkout] Stripe session has no email — falling through')
    return NextResponse.redirect(failureUrl)
  }

  const adminClient = createSupabaseAdminClient()

  // Race: Stripe redirects the customer here immediately, but the webhook
  // that creates the auth user runs asynchronously and may not have completed.
  // Ensure the user exists before we try to generate a magic link.
  const { error: createError } = await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
  })
  if (createError && !/already|exists|registered/i.test(createError.message)) {
    console.error('[post-checkout] Failed to ensure auth user:', createError.message)
    return NextResponse.redirect(failureUrl)
  }

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (linkError || !linkData.properties?.hashed_token) {
    console.error('[post-checkout] Failed to generate magic link:', linkError?.message)
    return NextResponse.redirect(failureUrl)
  }

  const serverClient = await createSupabaseServerClient()
  const { error: verifyError } = await serverClient.auth.verifyOtp({
    type: 'magiclink',
    token_hash: linkData.properties.hashed_token,
  })

  if (verifyError) {
    console.error('[post-checkout] verifyOtp failed:', verifyError.message)
    return NextResponse.redirect(failureUrl)
  }

  console.log(`[post-checkout] Signed in ${email} → ${next}`)
  return NextResponse.redirect(failureUrl)
}
