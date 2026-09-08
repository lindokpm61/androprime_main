import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AUTHORS, getAuthor } from '@/lib/authors'
import { getAllArticles, formatArticleDate, type ArticleMeta } from '@/lib/blog'
import AuthorBioCard from '@/components/marketing/AuthorBioCard'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

// ISR: author "articles by/reviewed" lists are tagged 'blog', so a publish
// revalidates them; 1h backstop covers a missed ping.
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) return {}
  const canonical = `${BASE_URL}/authors/${author.slug}`
  return {
    title: `${author.name}: ${author.bylineRole}`,
    description: author.bio,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${author.name} | Andro Prime`,
      description: author.bio,
      url: canonical,
      type: 'profile',
      images: [{ url: author.imgSrc, alt: author.name }],
    },
    twitter: {
      card: 'summary',
      title: `${author.name} | Andro Prime`,
      description: author.bio,
      images: [author.imgSrc],
    },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) notFound()

  const allArticles = await getAllArticles()
  // "Articles by this author": match on authorSlug + legacy author-name string fallback.
  const articlesByAuthor = allArticles.filter(
    (a) => a.authorSlug === author.slug || a.author === author.name
  )
  // "Articles reviewed by this author"
  const articlesReviewed = allArticles.filter((a) => a.reviewerSlug === author.slug)

  const personSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Authors', item: `${BASE_URL}/authors` },
          { '@type': 'ListItem', position: 3, name: author.name, item: `${BASE_URL}/authors/${author.slug}` },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/authors/${author.slug}/#person`,
        name: author.name,
        jobTitle: author.jobTitle,
        description: author.bio,
        url: `${BASE_URL}/authors/${author.slug}`,
        image: `${BASE_URL}${author.imgSrc}`,
        worksFor: { '@id': `${BASE_URL}/#organization` },
        ...(author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
        ...(author.knowsLanguage ? { knowsLanguage: author.knowsLanguage } : {}),
        ...(author.credentials
          ? {
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'license',
                name: author.credentials,
              },
            }
          : {}),
      },
      {
        '@type': 'ProfilePage',
        '@id': `${BASE_URL}/authors/${author.slug}/#profilepage`,
        mainEntity: { '@id': `${BASE_URL}/authors/${author.slug}/#person` },
        url: `${BASE_URL}/authors/${author.slug}`,
        inLanguage: 'en-GB',
      },
    ],
  }

  return (
    <>
      <JsonLd data={personSchema} />
      {/* Rebuilt in Direction F, 2026-09-08, from blog-F.html frame AQ. The V2.0
          version opened on a bare `pt-32` white block with a V2.0 SectionEyebrow
          and set every article title in uppercase black sans; it now uses the F
          section grammar and the same card list the index uses, so an author
          page reads as the same publication as the articles it lists. */}
      <div className="f-page">
        <section className="f-wrap f-sec f-sec-hero">
          <p className="f-blab">
            {author.role === 'medical-reviewer' ? 'Medical reviewer' : 'Founder and author'}
          </p>
          <AuthorBioCard author={author} variant="page" />
        </section>

        <section className="f-wrap" style={{ paddingBottom: 80 }}>
          {articlesByAuthor.length > 0 && (
            <AuthorArticleList title="Articles by this author" articles={articlesByAuthor} />
          )}

          {articlesReviewed.length > 0 && (
            <AuthorArticleList title="Articles reviewed by this author" articles={articlesReviewed} />
          )}

          {articlesByAuthor.length === 0 && articlesReviewed.length === 0 && (
            <p className="f-sub">No articles published yet. Check back soon.</p>
          )}
        </section>
      </div>
    </>
  )
}

function AuthorArticleList({ title, articles }: { title: string; articles: ArticleMeta[] }) {
  return (
    <section style={{ marginTop: 48 }}>
      <p className="f-blab">{title}</p>
      <div className="fb-grid f-rise" style={{ marginTop: 14 }}>
        {articles.map((a) => (
          <article key={a.slug} className="fb-pcard">
            <div className="fb-pbody" style={{ paddingTop: 20 }}>
              <div className="fb-pk">
                <span className="fb-mchip fb-mchip-q">{a.category}</span>
              </div>
              <h3>
                <Link href={`/blog/${a.slug}`}>{a.title}</Link>
              </h3>
              <p>{a.excerpt}</p>
            </div>
            <div className="fb-pfoot">
              <span>{formatArticleDate(a.date)}</span>
              <span>{a.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
