'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

export function OAuthButtons({ nextPath }: { nextPath?: string }) {
  function redirectTo() {
    const base = `${SITE_URL}/auth/callback`
    return nextPath ? `${base}?next=${encodeURIComponent(nextPath)}` : base
  }

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    })
  }

  async function signInWithMicrosoft() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: { redirectTo: redirectTo() },
    })
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={signInWithGoogle}
        className="w-full border-2 border-black bg-white px-5 py-3 font-sans text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-gray-100"
      >
        Continue with Google
      </button>
      <button
        type="button"
        onClick={signInWithMicrosoft}
        className="w-full border-2 border-black bg-white px-5 py-3 font-sans text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-gray-100"
      >
        Continue with Microsoft
      </button>
    </div>
  )
}
