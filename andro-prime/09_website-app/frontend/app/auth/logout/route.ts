import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

// Do NOT build the redirect from `request.url`. Behind the Coolify proxy that
// resolves to the container's own bind address, and the live route was observed
// on 2026-08-04 returning `location: https://0.0.0.0:3000/auth/login...`, which a
// browser cannot follow. Same pattern as app/auth/post-checkout/route.ts.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

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
export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }

  // 303 forces the follow-up request to be a GET, per the POST/Redirect/GET pattern.
  return NextResponse.redirect(
    new URL('/auth/login?message=You+have+been+logged+out', SITE_URL),
    { status: 303 }
  )
}
