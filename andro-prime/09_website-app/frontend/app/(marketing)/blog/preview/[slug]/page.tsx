import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleForPreview, extractH2Headings, shouldShowToc } from '@/lib/blog'
import ArticleLayout from '@/components/marketing/ArticleLayout'
import BlogToc from '@/components/marketing/BlogToc'
import { mdxComponents, mdxOptions } from '@/components/marketing/articleMdx'

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
  searchParams: Promise<{ token?: string }>
}

export default async function ArticlePreviewPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { token } = await searchParams

  // Token gate. Mismatch or unconfigured secret → 404 (don't reveal the route).
  const expected = process.env.PREVIEW_SECRET
  if (!expected || token !== expected) notFound()

  const article = await getArticleForPreview(slug)
  if (!article) notFound()

  const { content, frontmatter, wordCount } = article
  const headings = extractH2Headings(content)
  const showToc = shouldShowToc(frontmatter, wordCount)

  return (
    <>
      <div
        style={{
          background: '#000',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: 13,
          textAlign: 'center',
          padding: '8px 16px',
          letterSpacing: '0.05em',
        }}
      >
        PREVIEW · status: {frontmatter.status ?? 'draft'} · not public · not indexed
      </div>
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
