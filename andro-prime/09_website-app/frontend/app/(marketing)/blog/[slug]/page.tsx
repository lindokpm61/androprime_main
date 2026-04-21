import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllArticles, getArticle } from '@/lib/blog'
import ArticleLayout from '@/components/marketing/ArticleLayout'
import PullQuote from '@/components/marketing/PullQuote'
import StatBox from '@/components/marketing/StatBox'
import EvidenceBox from '@/components/marketing/EvidenceBox'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

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
    const ogImage = frontmatter.image ?? '/og/default.png'
    const canonical = `${BASE_URL}/blog/${slug}`
    return {
      title: `${frontmatter.title} | Andro Prime`,
      description: frontmatter.excerpt,
      alternates: { canonical },
      openGraph: {
        title: `${frontmatter.title} | Andro Prime`,
        description: frontmatter.excerpt,
        url: canonical,
        type: 'article',
        images: [{ url: ogImage, width: 1200, height: 630, alt: frontmatter.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${frontmatter.title} | Andro Prime`,
        description: frontmatter.excerpt,
        images: [ogImage],
      },
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  try {
    const { content, frontmatter } = getArticle(slug)

    const articleSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: frontmatter.title, item: `${BASE_URL}/blog/${slug}` },
          ],
        },
        {
          '@type': 'Article',
          '@id': `${BASE_URL}/blog/${slug}/#article`,
          headline: frontmatter.title,
          description: frontmatter.excerpt,
          datePublished: frontmatter.date,
          inLanguage: 'en-GB',
          author: {
            '@type': 'Person',
            name: frontmatter.author,
          },
          publisher: { '@id': `${BASE_URL}/#organization` },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${slug}`,
          },
          ...(frontmatter.imgSrc ? { image: `${BASE_URL}${frontmatter.imgSrc}` } : {}),
        },
      ],
    }

    return (
      <>
        <JsonLd data={articleSchema} />
        <ArticleLayout frontmatter={frontmatter}>
          <MDXRemote source={content} components={mdxComponents} />
        </ArticleLayout>
      </>
    )
  } catch {
    notFound()
  }
}
