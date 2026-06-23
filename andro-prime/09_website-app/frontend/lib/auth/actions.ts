'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { HEALTH_PROCESSING_CONSENT_VERSION } from '@/lib/auth/consentVersions'

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

export async function sendLoginLinkAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect('/auth/link?error=Add+your+Supabase+keys+to+.env.local+first')
  }

  const email = getString(formData, 'email')
  const nextRaw = getString(formData, 'next')
  const next = nextRaw.startsWith('/') ? nextRaw : '/results-dashboard'

  if (!email) {
    redirect('/auth/link?error=Email+required')
  }

  const origin = await getOrigin()
  const supabase = await createSupabaseServerClient()
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`

  // shouldCreateUser defaults to true: this is a unified passwordless entry, so an
  // email with no account yet is created and sent a link. Brand-new accounts have no
  // age on record, so /auth/callback routes them to /auth/consent (18+ gate) before
  // the dashboard. See docs/2026-06-12-passwordless-signin.md.
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })

  if (error) {
    redirect(`/auth/link?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/link?message=Check+your+email+for+a+sign-in+link')
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
  const healthProcessingConsent = formData.get('healthProcessingConsent') === 'on'
  const next = String(formData.get('next') ?? '').trim() || '/results-dashboard'

  // Hard 18+ gate. Andro Prime is 18+ only — reject anything missing or under age
  // server-side, not just via the form's min attribute.
  const age = ageRaw ? Number(ageRaw) : null
  if (age === null || Number.isNaN(age) || age < 18) {
    const params = new URLSearchParams({ error: 'You must be 18 or over to use Andro Prime.' })
    if (next) params.set('next', next)
    redirect(`/auth/consent?${params.toString()}`)
  }

  // Wellness health-data processing consent (Art 9(2)(a)) is mandatory — we
  // cannot run the test service without processing the customer's health data.
  // Enforced server-side, not just via the form's `required` attribute. The
  // stored version pins the exact copy shown (Art 7(1) accountability).
  if (!healthProcessingConsent) {
    const params = new URLSearchParams({
      error: 'Please confirm you consent to us processing your health information to provide your test service.',
    })
    if (next) params.set('next', next)
    redirect(`/auth/consent?${params.toString()}`)
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  await supabase.from('users').update({
    age,
    marketing_consent: marketingConsent,
    health_processing_consent_version: HEALTH_PROCESSING_CONSENT_VERSION,
    health_processing_consented_at: new Date().toISOString(),
  }).eq('id', user.id)

  redirect(next)
}
