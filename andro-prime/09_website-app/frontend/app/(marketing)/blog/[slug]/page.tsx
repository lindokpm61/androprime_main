import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllArticles, getArticle } from '@/lib/blog'
import ArticleLayout from '@/components/marketing/ArticleLayout'
import PullQuote from '@/components/marketing/PullQuote'
import StatBox from '@/components/marketing/StatBox'
import EvidenceBox from '@/components/marketing/EvidenceBox'

const mdxComponents = { PullQuote, StatBox, EvidenceBox }

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = getArticle(slug)
    return {
      title: `${frontmatter.title} | Andro Prime`,
      description: frontmatter.excerpt,
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  try {
    const { content, frontmatter } = getArticle(slug)
    return (
      <ArticleLayout frontmatter={frontmatter}>
        <MDXRemote source={content} components={mdxComponents} />
      </ArticleLayout>
    )
  } catch {
    notFound()
  }
}
