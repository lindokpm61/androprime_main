'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { APP_URL } from '@/lib/hosts'
import { parseEligibleAge, UNDER_AGE_ERROR } from '@/lib/auth/eligibility'

// The origin every auth email points back to.
//
// Still request-aware, so a local or preview origin round-trips to itself. But
// the fallback is now APP_URL, not SITE_URL: /auth/* is served by the app host,
// and the Supabase session cookie is host-only by design (lib/hosts.ts explains
// why no wildcard cookie is set). An auth link that lands on the apex sets the
// cookie on the wrong host, and the visitor arrives logged out.
//
// The guard rejects 0.0.0.0/localhost origins because Supabase will not accept
// them as a redirect target from a deployed environment.
async function getOrigin() {
  const headerStore = await headers()
  const origin = headerStore.get('origin')

  if (origin && !origin.includes('0.0.0.0') && !origin.includes('localhost')) {
    return origin
  }

  return APP_URL
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

  // 🔴 HARD 18+ GATE, added 2026-09-08 (Keith). Andro Prime is 18+ only, and
  // until this ruling the same eligibility fact was mandatory at two of its
  // three collection points and optional at this one: `/auth/consent` rejected a
  // missing or under-age value server-side, `/checkout/details` re-checked a date
  // of birth on submit, and signup stored `age: null` and carried on. The auth
  // frame (design/mockups/journey/auth-F.html, Frame X2) flagged the asymmetry
  // and Keith ruled it closed.
  //
  // THE `required` ATTRIBUTE ON THE FIELD IS NOT THE GATE. It is a client-side
  // convenience that a curl, a disabled-JS browser or a devtools edit walks
  // straight past, so an eligibility requirement enforced only there is not
  // enforced. This mirrors `consentAction` below deliberately, wording included,
  // rather than inventing a second phrasing for the same refusal.
  const age = parseEligibleAge(ageRaw)
  if (age === null) {
    redirect(`/auth/signup?error=${encodeURIComponent(UNDER_AGE_ERROR)}`)
  }

  const origin = await getOrigin()

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        age,
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
      age,
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

  // Hard 18+ gate. Andro Prime is 18+ only — reject anything missing or under age
  // server-side, not just via the form's min attribute. NOTE: this step captures
  // age (an eligibility requirement) + the optional marketing opt-in only. It does
  // NOT gate on health-data processing consent: that is captured at the point of
  // purchase (checkout), where it is freely given, and must never be a wall in
  // front of results a customer has already paid for (UK GDPR "freely given").
  const age = parseEligibleAge(ageRaw)
  if (age === null) {
    const params = new URLSearchParams({ error: UNDER_AGE_ERROR })
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
  }).eq('id', user.id)

  redirect(next)
}
