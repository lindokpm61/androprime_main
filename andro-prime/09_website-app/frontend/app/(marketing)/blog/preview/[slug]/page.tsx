import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleForPreview, getArticleRevisionForPreview, extractH2Headings, shouldShowToc } from '@/lib/blog'
import ArticleLayout from '@/components/marketing/ArticleLayout'
import BlogToc from '@/components/marketing/BlogToc'
import { mdxComponents, mdxOptions } from '@/components/marketing/articleMdx'
import { InternalStrip } from '@/components/internal/InternalChrome'
import '@/styles/components/f-internal.css'

// The G2 sign-off review surface. Renders a draft (ANY status) exactly as it will
// publish, in production, gated by a shared token and marked noindex. The public
// /blog/[slug] path stays ISR + published-only and is never touched by this route.
// The Signoff-Concierge agent links Ewa here from the ClickUp review task:
//   /blog/preview/<slug>?token=<PREVIEW_SECRET>
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string; rev?: string }>
}

export default async function ArticlePreviewPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { token, rev } = await searchParams

  // Token gate. Mismatch or unconfigured secret → 404 (don't reveal the route).
  const expected = process.env.PREVIEW_SECRET
  if (!expected || token !== expected) notFound()

  // ?rev=<id> renders a specific (proposed re-opt) revision; otherwise the live row.
  const article = rev ? await getArticleRevisionForPreview(slug, rev) : await getArticleForPreview(slug)
  if (!article) notFound()

  const { content, frontmatter, wordCount } = article
  const headings = extractH2Headings(content)
  const showToc = shouldShowToc(frontmatter, wordCount)

  return (
    <>
      {/*
        THE ONLY NON-DIRECTION-F ELEMENT ON THIS ROUTE, until 2026-09-12. The
        article below it is `ArticleLayout`, rebuilt with the blog in Direction
        F; this bar was six inline styles and `fontFamily: 'monospace'`, which
        is the browser's default mono rather than the brand's. It is the same
        job the internal tools' strip does (say what you are looking at, in one
        inverted line), so it takes `InternalStrip` rather than a seventh
        hand-rolled bar. `f-internal.css` is imported by this route directly:
        the file is scoped by import, and a preview surface is internal even
        though it sits in the marketing tree.

        The two states keep their exact words.
      */}
      <InternalStrip
        label={rev ? 'Proposed re-opt' : 'Preview'}
        right={
          rev
            ? `revision ${rev.slice(0, 8)} · NOT live · not indexed`
            : `status: ${frontmatter.status ?? 'draft'} · not public · not indexed`
        }
      />
      <ArticleLayout frontmatter={frontmatter} headings={headings} showToc={showToc}>
        <MDXRemote
          source={content}
          components={{ ...mdxComponents, BlogToc: () => <BlogToc headings={headings} /> }}
          options={mdxOptions}
        />
      </ArticleLayout>
    </>
  )
}
