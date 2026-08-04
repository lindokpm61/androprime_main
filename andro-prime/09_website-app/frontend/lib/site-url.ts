/**
 * The site's canonical public origin, defined once.
 *
 * `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'` used to be
 * copy-pasted into nine modules (both webhook routes, all three checkout routes,
 * the logout and post-checkout handlers, the OAuth buttons, the bundle dispatcher
 * and the root layout), each with its own spelling of the fallback: `??` in some,
 * `||` in others, `http://localhost:3000` in one. Nine copies means a redirect
 * URL can silently disagree with a Stripe success URL, and there is no single
 * place to change the domain.
 *
 * NEXT_PUBLIC_ is inlined at build time, so this module is safe to import from
 * client components as well as server code.
 *
 * Two callers deliberately do NOT use the bare constant, because they resolve the
 * origin from the incoming request first and only fall back to it:
 *   - `app/auth/callback/route.ts` (x-forwarded-host, for preview deployments)
 *   - `lib/auth/actions.ts` (the Origin header)
 * Both now import `SITE_URL` as that fallback instead of restating the literal.
 */

/** Trailing slashes make `${SITE_URL}/path` produce a double slash. */
function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

const FALLBACK_SITE_URL = 'https://andro-prime.com'

const configured = process.env.NEXT_PUBLIC_SITE_URL

export const SITE_URL: string = configured
  ? stripTrailingSlash(configured)
  : FALLBACK_SITE_URL

/**
 * Absolute URL for a site-relative path. Prefer this over string concatenation
 * anywhere the result is handed to Stripe, Supabase or an email template, which
 * all require absolute URLs.
 */
export function siteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString()
}
