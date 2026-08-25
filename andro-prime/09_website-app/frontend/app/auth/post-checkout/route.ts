import { type NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

import { urlFor } from '@/lib/hosts'

const MAX_SESSION_AGE_MS = 60 * 60 * 1000

// Both destinations are APP paths (see APP_ROUTE_PREFIXES in lib/hosts.ts).
// They live in the (marketing) route group but are authenticated pages: each
// calls getCurrentUser(), and the order reference is read through the
// USER-scoped Supabase client, so RLS needs the session this route just set.
// Served from the apex they would render permanently logged-out and the buyer
// would never see their order reference. urlFor keeps them on the app host.
const ALLOWED_NEXT_PATHS = new Set([
  '/order/confirmed',
  '/subscription/confirmed',
])

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const sessionId = url.searchParams.get('session_id')
  const nextRaw = url.searchParams.get('next') ?? '/order/confirmed'
  const next = ALLOWED_NEXT_PATHS.has(nextRaw) ? nextRaw : '/order/confirmed'

  const failureUrl = new URL(urlFor(next))

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

  // Carry session_id back so the confirmation page can resolve the customer's
  // order reference. This redirect used to reuse `failureUrl`, which drops the
  // query entirely — and since a first-time buyer always arrives here before
  // reaching /order/confirmed, that meant the reference never rendered for the
  // one customer who most needs it. `post_checkout=1` tells the page the sign-in
  // round trip has already run, so it does not bounce back here on failure.
  const successUrl = new URL(urlFor(next))
  successUrl.searchParams.set('session_id', sessionId)
  successUrl.searchParams.set('post_checkout', '1')

  console.log(`[post-checkout] Signed in ${email} → ${next}`)
  return NextResponse.redirect(successUrl)
}
