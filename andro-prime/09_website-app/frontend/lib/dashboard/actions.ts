'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

const PROMPT_COOKIE = 'ap_pwd_prompt_dismissed'

const SESSION_GONE = 'Your session has expired. Please sign in again.'

// Never call revalidatePath('/results-dashboard') without a live session.
//
// Why (2026-08-04): the (app) layout calls requireAuthenticatedUser(), which calls
// redirect() when there is no user, and redirect() works by THROWING. Revalidating
// from a server action re-renders that layout inside the action's response, so with
// a dead session the throw escapes as a malformed action reply and React surfaces
// "An unexpected response was received from the server." With no error boundary in
// place that reached global-error.tsx, so clicking the banner's X dismiss button
// white-screened the whole dashboard. Confirmed in Sentry (JAVASCRIPT-NEXTJS-V).
//
// Both entry points below therefore check the session FIRST and return a plain
// message instead of revalidating into a layout that will throw.
async function getSessionUser() {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

function setDismissCookie(jar: Awaited<ReturnType<typeof cookies>>) {
  jar.set(PROMPT_COOKIE, '1', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function dismissPasswordPromptAction() {
  const jar = await cookies()
  setDismissCookie(jar)

  // The cookie is the whole point of dismissing, and it is already set. Skip the
  // revalidate when signed out: the banner is hidden client-side either way, and
  // revalidating would crash the page (see note above).
  const user = await getSessionUser()
  if (!user) {
    return { error: SESSION_GONE }
  }

  revalidatePath('/results-dashboard')
  return { ok: true as const }
}

export async function setPasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '').trim()

  if (!isSupabaseConfigured() || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const user = await getSessionUser()
  if (!user) {
    return { error: SESSION_GONE }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  const jar = await cookies()
  setDismissCookie(jar)
  revalidatePath('/results-dashboard')

  return { ok: true as const }
}
