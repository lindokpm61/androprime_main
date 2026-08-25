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
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={signInWithGoogle}
        className="w-full border-2 border-black bg-white px-5 py-3 font-sans text-sm font-black uppercase tracking-widest text-black transition-colors hover:bg-gray-50"
      >
        Continue with Google
      </button>
    </div>
  )
}
