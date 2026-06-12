import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { identifyUser } from '@/lib/customerio/emit'

const FALLBACK_SITE_URL = 'https://andro-prime.com'

function getPublicBaseUrl(request: NextRequest): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envSiteUrl) return envSiteUrl

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`

  const host = request.headers.get('host')
  if (host && !host.startsWith('0.0.0.0') && !host.startsWith('localhost')) {
    return `https://${host}`
  }

  return FALLBACK_SITE_URL
}

export async function GET(request: NextRequest) {
  const baseUrl = getPublicBaseUrl(request)
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/results-dashboard'

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL('/auth/login?error=Supabase+is+not+configured', baseUrl)
    )
  }

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, baseUrl)
      )
    }

    const user = data.user
    if (user) {
      // Identify in Customer.io on every login (OAuth or magic link)
      await identifyUser(user.id, { email: user.email })

      // Anyone without an age on record still needs the 18+ consent step before the
      // dashboard. Covers brand-new OAuth and magic-link sign-ups (the public.users row
      // is auto-created with a null age) without relying on a created-at timer — email
      // magic links routinely take longer than any short time window would allow.
      const { data: profile } = await supabase
        .from('users')
        .select('age')
        .eq('id', user.id)
        .single()

      if (!profile || profile.age === null) {
        const consentUrl = new URL('/auth/consent', baseUrl)
        if (next !== '/results-dashboard') consentUrl.searchParams.set('next', next)
        return NextResponse.redirect(consentUrl)
      }
    }
  }

  return NextResponse.redirect(new URL(next, baseUrl))
}
