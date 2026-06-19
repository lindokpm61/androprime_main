import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'

// On-demand cache invalidation for the DB-backed blog. Called by the blog_articles
// Supabase Database Webhook (or directly by the Publisher agent) after a publish,
// edit, or takedown, so changes surface within seconds with no Coolify redeploy.
// Secret-gated: set REVALIDATE_SECRET in the runtime env and send it as
// `x-revalidate-secret`. Fails closed when the secret is unset.
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  const provided = req.headers.get('x-revalidate-secret')
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  // Accept a manual/agent body ({ slug }) or a Supabase Database Webhook payload
  // ({ type, table, record / old_record: { slug }, ... }). INSERT/UPDATE carry
  // `record`; DELETE carries `old_record`. Either way we always bust the global
  // 'blog' tag (listings, sitemap, author pages, product RelatedArticles) and, when
  // a slug is known, the per-article tag.
  let slug: string | undefined
  try {
    const body = (await req.json()) as {
      slug?: unknown
      record?: { slug?: unknown }
      old_record?: { slug?: unknown }
    }
    if (typeof body?.slug === 'string') slug = body.slug
    else if (typeof body?.record?.slug === 'string') slug = body.record.slug
    else if (typeof body?.old_record?.slug === 'string') slug = body.old_record.slug
  } catch {
    // no/invalid JSON body → global revalidation only
  }

  revalidateTag('blog')
  if (slug) revalidateTag(`article:${slug}`)

  return NextResponse.json({
    ok: true,
    revalidated: ['blog', slug ? `article:${slug}` : null].filter(Boolean),
  })
}
