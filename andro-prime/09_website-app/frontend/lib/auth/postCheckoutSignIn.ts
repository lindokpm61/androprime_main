import { stripe } from '@/lib/stripe/client'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'
const MAX_SESSION_AGE_MS = 60 * 60 * 1000

export async function generatePostCheckoutSignInUrl(
  sessionId: string,
  redirectPath: string,
): Promise<string | null> {
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    console.error('[post-checkout-signin] Failed to retrieve Stripe session:', err)
    return null
  }

  const ageMs = Date.now() - session.created * 1000
  if (ageMs > MAX_SESSION_AGE_MS) return null

  const customerDetails = session.customer_details as { email?: string | null } | null
  const email = session.customer_email ?? customerDetails?.email ?? null
  if (!email) return null

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
    },
  })

  if (error || !data.properties?.action_link) {
    console.error('[post-checkout-signin] Failed to generate magic link:', error?.message)
    return null
  }

  return data.properties.action_link
}
