'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

// The OAuth round trip must return to the app host: that is where /auth/callback
// runs and where the host-only session cookie is set. Coming back to the apex
// would set the cookie on a host that serves none of the authenticated app.
import { urlFor } from '@/lib/hosts'

export function OAuthButtons({ nextPath }: { nextPath?: string }) {
  function redirectTo() {
    const base = urlFor('/auth/callback')
    return nextPath ? `${base}?next=${encodeURIComponent(nextPath)}` : base
  }

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    })
  }

  // Microsoft / Azure sign-in is intentionally not offered yet; the Azure app
  // registration needs configuring (incl. personal Microsoft accounts) before it
  // is enabled. Re-add a "Continue with Microsoft" button (provider: 'azure')
  // here once that is done. Google is the only stable OAuth provider for now.
  // Direction F, 2026-09-08. The ghost pill, not a bordered square: this is a
  // secondary route to the same place as the form below it, and `.f-btn-ghost`
  // is the direction's secondary. Drawn as one button because Microsoft does not
  // exist yet, and Frame X notes that putting an absent provider in a mockup is
  // how a drawing starts specifying work nobody asked for.
  return (
    <button type="button" onClick={signInWithGoogle} className="f-btn f-btn-ghost f-btn-block">
      Continue with Google
    </button>
  )
}
