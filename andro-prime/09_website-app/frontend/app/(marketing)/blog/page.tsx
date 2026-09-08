import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'
import BlogListings, { type BlogListItem } from '@/components/marketing/BlogListings'
import { getAllArticles, formatArticleDate } from '@/lib/blog'
import { JsonLd } from '@/components/shared/JsonLd'

const BASE_URL = 'https://andro-prime.com'

export const metadata: Metadata = {
  title: 'Insights & Protocols',
  description:
    'Research, analysis, and evidence-based perspectives on male hormone optimisation from the Andro Prime team.',
  alternates: { canonical: '/blog' },
}

// ISR: cached HTML, revalidated on publish via revalidateTag('blog') with a 1h backstop.
export const revalidate = 3600

export default async function BlogPage() {
  // getAllArticles returns most-recent-first; the client component derives the
  // featured hero, category filter, and pagination from this list.
  const allArticles = await getAllArticles()
  const articles: BlogListItem[] = allArticles.map((a) => ({
    href: `/blog/${a.slug}`,
    category: a.category,
    // Formatted here, not in the card: BlogListItem.date is a DISPLAY value and
    // the schema below deliberately reads `allArticles`, not this list, because
    // datePublished must stay ISO 8601.
    date: formatArticleDate(a.date),
    title: a.title,
    excerpt: a.excerpt,
    readTime: a.readTime,
    // Editorial Unsplash photo wins the listing card; imgSrc (OG override) next;
    // generated branded card last. usingOg drives the grayscale treatment, only the
    // generated card renders untreated (a real photo gets the editorial grayscale).
    imgSrc: a.photoSrc ?? a.imgSrc ?? `/api/og/blog/${a.slug}?variant=card`,
    imgAlt: a.photoAlt ?? a.imgAlt ?? a.title,
    usingOg: !(a.photoSrc ?? a.imgSrc),
  }))

  // Derived from the article list rather than hand-listed, so the schema cannot
  // drift from what the page actually renders (same reason the mirror is generated).
  // Built from `allArticles`, NOT the mapped `articles`: BlogListItem.date is a
  // display string ("12 Oct 2026") and datePublished must be ISO 8601.
  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
        ],
      },
      {
        '@type': 'Blog',
        '@id': `${BASE_URL}/blog/#blog`,
        url: `${BASE_URL}/blog`,
        name: 'Andro Prime Blog',
        description:
          'Research-backed articles on testosterone, men’s health, and blood markers. Written by Keith Antony and reviewed by a GMC-registered GP.',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: 'en-GB',
        blogPost: allArticles.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.title,
          description: a.excerpt,
          url: `${BASE_URL}/blog/${a.slug}`,
          datePublished: a.isoDate ?? a.date,
          ...(a.dateModified ? { dateModified: a.dateModified } : {}),
        })),
      },
    ],
  }

  return (
    <div className="f-page">
      <JsonLd data={blogSchema} />
      <BlogListings articles={articles} />

      {/* ---------- CLOSE ----------
          The `.f-close` block every other F route ends on. The V2.0 version was
          two stacked full-bleed bands, one black with an uppercase headline and
          one white with an outlined envelope icon, both on a dot pattern. They
          went with the rest of the brutalist furniture; the ARGUMENT they made
          is kept, because it is a good one and it is specific to this page:
          every article circles the same point, so the index closes on it. */}
      <section className="f-wrap f-sec">
        <div className="f-close f-rise">
          <p className="f-blab">Stop reading, start measuring</p>
          <h2>A number you have watched move.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            Every article here circles the same point. A single number means little on its own; a
            number you have watched move means a great deal. Get your baseline.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">
              See the tests <span className="f-pip" aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/test-selector" className="f-btn f-btn-ghost">Use the selector</Link>
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ----------
          Email capture, not a kit purchase: the lower rung for readers not ready
          to test. This page's ONE inverted block. */}
      <section className="f-wrap" style={{ paddingBottom: 80 }}>
        <div className="fb-news f-on-ink" style={{ maxWidth: 720, margin: '0 auto' }}>
          <span className="fb-news-k">Not ready to test?</span>
          <h2 className="fb-news-h">The occasional plain-English read.</h2>
          <p>
            Deep dives on diagnostic markers and what the evidence actually says, direct to your
            inbox. No schedule, no filler.
          </p>
          <NewsletterForm theme="dark" source="blog-index" />
        </div>
      </section>
    </div>
  )
}
