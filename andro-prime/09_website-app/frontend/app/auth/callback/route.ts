import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { identifyUser } from '@/lib/customerio/emit'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/results-dashboard'

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL('/auth/login?error=Supabase+is+not+configured', request.url)
    )
  }

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    const user = data.user
    if (user) {
      // Identify in Customer.io on every OAuth login
      await identifyUser(user.id, { email: user.email })

      // New OAuth users need to collect consent before reaching the dashboard
      const isNewUser = Date.now() - new Date(user.created_at).getTime() < 30_000
      if (isNewUser) {
        const consentUrl = new URL('/auth/consent', request.url)
        if (next !== '/results-dashboard') consentUrl.searchParams.set('next', next)
        return NextResponse.redirect(consentUrl)
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
