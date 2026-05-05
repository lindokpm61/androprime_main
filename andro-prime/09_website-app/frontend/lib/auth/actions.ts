'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

async function getOrigin() {
  const headerStore = await headers()
  const origin = headerStore.get('origin')

  if (origin && !origin.includes('0.0.0.0') && !origin.includes('localhost')) {
    return origin
  }

  return process.env.NEXT_PUBLIC_SITE_URL || 'https://andro-prime.com'
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect('/auth/login?error=Add+your+Supabase+keys+to+.env.local+first')
  }

  const email = getString(formData, 'email')
  const password = getString(formData, 'password')
  const next = getString(formData, 'next') || '/results-dashboard'

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect(next)
}

export async function signupAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect('/auth/signup?error=Add+your+Supabase+keys+to+.env.local+first')
  }

  const email = getString(formData, 'email')
  const password = getString(formData, 'password')
  const ageRaw = getString(formData, 'age')
  const marketingConsent = formData.get('marketingConsent') === 'on'
  const origin = await getOrigin()

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        age: ageRaw ? Number(ageRaw) : null,
        marketing_consent: marketingConsent,
      },
    },
  })

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
  }

  if (data.session?.user) {
    await supabase.from('users').upsert({
      id: data.session.user.id,
      email,
      age: ageRaw ? Number(ageRaw) : null,
      marketing_consent: marketingConsent,
    })
  }

  redirect(
    '/auth/login?message=Account+created.+Check+your+email+if+confirmation+is+enabled.'
  )
}

export async function resetPasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect('/auth/reset?error=Add+your+Supabase+keys+to+.env.local+first')
  }

  const email = getString(formData, 'email')
  const origin = await getOrigin()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/login`,
  })

  if (error) {
    redirect(`/auth/reset?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/reset?message=Password+reset+email+sent')
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }

  redirect('/auth/login?message=You+have+been+logged+out')
}

export async function consentAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect('/auth/consent?error=Add+your+Supabase+keys+to+.env.local+first')
  }

  const ageRaw = String(formData.get('age') ?? '').trim()
  const marketingConsent = formData.get('marketingConsent') === 'on'
  const next = String(formData.get('next') ?? '').trim() || '/results-dashboard'

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  await supabase.from('users').update({
    age: ageRaw ? Number(ageRaw) : null,
    marketing_consent: marketingConsent,
  }).eq('id', user.id)

  redirect(next)
}
