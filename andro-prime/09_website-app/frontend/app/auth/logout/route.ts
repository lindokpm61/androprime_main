import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

// POST-ONLY, DELIBERATELY (2026-08-04). This was a GET handler linked from the app
// nav via a plain <Link>. Next.js prefetches links that enter the viewport, and the
// nav is `fixed`, so the Log Out link was permanently visible and permanently
// prefetched: the browser signed the user out seconds after they arrived, with no
// click. Confirmed in the Supabase auth log (login 15:43:15 → logout 15:43:41,
// user-initiated: no) and in Sentry breadcrumbs showing `?_rsc=` prefetches of the
// sibling nav links. It also broke every customer who bought that day, because the
// dead session made the dashboard's server actions crash (see app/(app)/error.tsx).
//
// A GET must never destroy state: prefetch is only the first thing to trip it —
// link scanners, antivirus, corporate mail scanners and browser preload all issue
// speculative GETs. Do NOT reintroduce a GET export here.
export async function POST(request: NextRequest) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }

  // 303 forces the follow-up request to be a GET, per the POST/Redirect/GET pattern.
  return NextResponse.redirect(
    new URL('/auth/login?message=You+have+been+logged+out', request.url),
    { status: 303 }
  )
}
