import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { updateSupabaseSession } from '@/lib/supabase/middleware'

const protectedRoutes = [
  '/results-dashboard',
  '/subscriptions',
  '/account',
  '/founding-member-status',
]

function isProtectedPath(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  if (!isSupabaseConfigured()) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set(
      'error',
      'Supabase keys are missing. Add them to .env.local before testing auth.'
    )
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  const { response, user } = await updateSupabaseSession(request)

  if (user) {
    return response
  }

  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set(
    'message',
    'Please log in to access your Andro Prime dashboard'
  )
  loginUrl.searchParams.set('next', `${pathname}${search}`)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/results-dashboard/:path*',
    '/subscriptions/:path*',
    '/account/:path*',
    '/founding-member-status/:path*',
  ],
}
