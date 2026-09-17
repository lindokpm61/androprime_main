'use server'

// DEPRECATED (2026-06-12): part of the retired login-gated kit-activation flow.
// See docs/2026-06-12-activate-qr-deprecation.md
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { SITE_URL } from '@/lib/site-url'

export async function sendActivationLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const kitCode = String(formData.get('kitCode') ?? '').trim()

  if (!email) {
    redirect(`/activate?kit=${kitCode}&error=Email+required`)
  }

  if (!isSupabaseConfigured()) {
    redirect(`/activate?kit=${kitCode}&error=Service+unavailable`)
  }

  // `SITE_URL`, not a literal: this is the third "resolve the origin from the
  // request, fall back to the site" caller, and `lib/site-url.ts` was written to
  // hold that fallback once — its header names the other two. It was missed, and
  // it was the one copy still spelling the fallback `http://localhost:3000`,
  // INSIDE A LINK THAT GETS EMAILED. A customer clicking a localhost link gets a
  // browser error, not a login, and nothing anywhere would have reported it: with
  // NEXT_PUBLIC_SITE_URL set the line is dormant, so the defect is invisible
  // exactly until the variable goes missing — which `S1` is the standing proof
  // this class of variable does. Gate A item A3, fixed 2026-09-17.
  //
  // `SITE_URL` is truthiness-checked at its definition, which is the rule that
  // matters here: the Dockerfile exports an unsupplied build secret as the empty
  // string, and `??` would pass that through. See lib/hosts.ts.
  //
  // This module has had no caller since /activate was retired on 2026-09-12, so
  // the line cannot currently be reached. Corrected anyway rather than excepted,
  // so the rule holds everywhere without a table of exemptions.
  const headerStore = await headers()
  const origin = headerStore.get('origin') || SITE_URL

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
