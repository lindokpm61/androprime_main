import { NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics/events'
import { findPost } from '@/lib/bio-grid'

export const runtime = 'nodejs'
// Never cached: every hit must produce its own event row, and a cached 307 would
// silently collapse a month of clicks into one.
export const dynamic = 'force-dynamic'

const BASE = 'https://andro-prime.com'

/**
 * One permanent link per post in the carousel run. Records the click server-side,
 * then redirects to that post's own destination with attribution stamped on.
 *
 * Server-side is deliberate. The traffic arrives inside Instagram's in-app
 * browser, which is the least reliable place to depend on client JS, and the user
 * is leaving the page at the moment we want to record. A redirect handler sees
 * every hit regardless.
 *
 * An unknown slug redirects to the quiz rather than 404ing. A bio-link tap that
 * dead-ends is a lost visitor; the quiz is the ratified destination for cold
 * short-form traffic anyway (07_sales/funnel/site-funnel-model.md §2), so the
 * failure mode degrades to the default rather than to nothing. The miss is still
 * recorded, so a broken tile shows up in the data instead of hiding as silence.
 */
export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const post = findPost(slug)

  const destination = post?.destination ?? '/test-selector'
  const url = new URL(destination, BASE)
  url.searchParams.set('utm_source', 'instagram')
  url.searchParams.set('utm_medium', 'bio')
  url.searchParams.set('utm_campaign', 'carousel30')
  // utm_content identifies the POST, utm_term the CLOSE. Keeping the close in its
  // own parameter means the three can be compared without parsing a compound id.
  url.searchParams.set('utm_content', post?.slug ?? 'unknown')
  url.searchParams.set('utm_term', post ? `close-${post.close}` : 'unmatched')

  await trackEvent('bio_tile_click', {
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'carousel30',
    utm_content: post?.slug ?? 'unknown',
    utm_term: post ? `close-${post.close}` : 'unmatched',
    referrer: request.headers.get('referer'),
    landing_path: `/go/${slug}`,
    props: {
      post: post?.slug ?? null,
      day: post?.day ?? null,
      topic: post?.topic.slug ?? null,
      close: post?.close ?? null,
      destination,
      matched: Boolean(post),
    },
  })

  return NextResponse.redirect(url, 307)
}
