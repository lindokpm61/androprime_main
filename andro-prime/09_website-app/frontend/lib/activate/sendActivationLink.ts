'use server'

// DEPRECATED (2026-06-12): part of the retired login-gated kit-activation flow.
// See docs/2026-06-12-activate-qr-deprecation.md
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export async function sendActivationLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const kitCode = String(formData.get('kitCode') ?? '').trim()

  if (!email) {
    redirect(`/activate?kit=${kitCode}&error=Email+required`)
  }

  if (!isSupabaseConfigured()) {
    redirect(`/activate?kit=${kitCode}&error=Service+unavailable`)
  }

  const headerStore = await headers()
  const origin =
    headerStore.get('origin') ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000'

  const supabase = await createSupabaseServerClient()
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(`/activate?kit=${kitCode}`)}`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })

  if (error) {
    redirect(`/activate?kit=${kitCode}&error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/activate?kit=${kitCode}&email_sent=${encodeURIComponent(email)}`)
}
