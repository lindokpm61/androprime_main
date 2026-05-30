import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AUTHORS, getAuthor } from '@/lib/authors'
import { getAllArticles, type ArticleMeta } from '@/lib/blog'
import AuthorBioCard from '@/components/marketing/AuthorBioCard'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

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
    title: `${author.name} — ${author.bylineRole} | Andro Prime`,
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

  const allArticles = getAllArticles()
  // "Articles by this author" — match on authorSlug + legacy author-name string fallback.
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
      <div className="bg-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionEyebrow label={author.role === 'medical-reviewer' ? 'Medical Reviewer' : 'Founder & Author'} />
          <AuthorBioCard author={author} variant="page" />

          {articlesByAuthor.length > 0 && (
            <AuthorArticleList
              title="Articles by this author"
              articles={articlesByAuthor}
            />
          )}

          {articlesReviewed.length > 0 && (
            <AuthorArticleList
              title="Articles reviewed by this author"
              articles={articlesReviewed}
            />
          )}

          {articlesByAuthor.length === 0 && articlesReviewed.length === 0 && (
            <p className="font-serif text-lg text-gray-700 mt-8">
              No articles published yet. Check back soon.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

function AuthorArticleList({ title, articles }: { title: string; articles: ArticleMeta[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tighter text-black mb-6 pb-4 border-b-2 border-black">
        {title}
      </h2>
      <ul className="space-y-6">
        {articles.map((a) => (
          <li key={a.slug} className="border-b border-gray-300 pb-6 last:border-0">
            <div className="data-label text-[10px] mb-2 flex flex-wrap gap-3">
              <span>{a.category}</span>
              <span>·</span>
              <span>{a.date}</span>
              <span>·</span>
              <span>{a.readTime}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-sans font-black uppercase tracking-tighter text-black mb-2 leading-tight">
              <Link href={`/blog/${a.slug}`} className="hover:underline">
                {a.title}
              </Link>
            </h3>
            <p className="font-serif text-base text-black leading-relaxed">{a.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

