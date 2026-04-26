'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

const PROMPT_COOKIE = 'ap_pwd_prompt_dismissed'

export async function dismissPasswordPromptAction() {
  const jar = await cookies()
  jar.set(PROMPT_COOKIE, '1', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  revalidatePath('/results-dashboard')
}

export async function setPasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '').trim()

  if (!isSupabaseConfigured() || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  const jar = await cookies()
  jar.set(PROMPT_COOKIE, '1', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  revalidatePath('/results-dashboard')

  return { ok: true }
}
