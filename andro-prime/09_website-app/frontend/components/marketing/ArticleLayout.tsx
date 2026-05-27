import Link from 'next/link'
import type { ArticleFrontmatter, TocHeading } from '@/lib/blog'
import { KIT_PRICE_RANGE, SLA_HOURS } from '@/lib/pricing'
import { getAuthor } from '@/lib/authors'
import ArticleFaq from '@/components/marketing/ArticleFaq'
import ArticleToc from '@/components/marketing/ArticleToc'

interface Props {
  frontmatter: ArticleFrontmatter
  children: React.ReactNode
  // headings: H2 list for TOC. If empty or undefined, TOC is suppressed regardless of word count.
  headings?: TocHeading[]
  // showToc: computed in [slug]/page.tsx via shouldShowToc(). Defaults to false.
  showToc?: boolean
}

export default function ArticleLayout({ frontmatter, children, headings = [], showToc = false }: Props) {
  const { title, excerpt, category, date, dateModified, dark, readTime, authorSlug, reviewerSlug, faq } = frontmatter

  const author = authorSlug ? getAuthor(authorSlug) : undefined
  const reviewer = reviewerSlug ? getAuthor(reviewerSlug) : undefined

  // Fallback for legacy frontmatter that hasn't been migrated to authorSlug yet.
  const displayName = author?.name ?? frontmatter.author ?? 'Andro Prime'
  const displayInitials = author?.initials ?? frontmatter.initials ?? 'AP'
  const displayRole = author?.bylineRole

  const tocVisible = showToc && headings.length > 0

  return (
    <main className="bg-white">
      <header className="pt-32 pb-20 border-b-4 border-black bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 bg-black" /> {category}
            </div>
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">
              {readTime}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-3xl">
            {excerpt}
          </p>

          {/* Byline: author + (optional) reviewer + dates. Initial bubble retained on the left. */}
          <div className="flex items-start gap-4 mt-10 pt-8 border-t-2 border-black">
            <div
              className={`shrink-0 w-12 h-12 border-2 border-black flex items-center justify-center font-sans font-black text-lg ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}
              aria-hidden="true"
            >
              {displayInitials}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="font-sans text-sm">
                <span className="data-label">Written by </span>
                {authorSlug ? (
                  <Link
                    href={`/authors/${authorSlug}`}
                    className="font-sans font-black uppercase tracking-widest text-black hover:underline"
                  >
                    {displayName}
                  </Link>
                ) : (
                  <strong className="font-sans font-black uppercase tracking-widest text-black">{displayName}</strong>
                )}
                {displayRole && (
                  <span className="font-serif text-sm text-gray-700">, {displayRole}</span>
                )}
              </div>

              {reviewer && (
                <div className="font-sans text-sm">
                  <span className="data-label">Reviewed by </span>
                  <Link
                    href={`/authors/${reviewer.slug}`}
                    className="font-sans font-black uppercase tracking-widest text-black hover:underline"
                  >
                    {reviewer.name}
                  </Link>
                  <span className="font-serif text-sm text-gray-700">, {reviewer.bylineRole}</span>
                </div>
              )}

              <div className="font-serif text-xs text-gray-600 pt-1">
                <span>Published: {date}</span>
                {dateModified && dateModified !== date && (
                  <span> · Last updated: {dateModified}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <article className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {tocVisible && <ArticleToc headings={headings} />}
          <div className="article-prose text-black">
            {children}
          </div>
          {faq && faq.length > 0 && <ArticleFaq items={faq} />}
        </div>
      </article>

      <section className="py-16 bg-black text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mb-6">
            Find out where you actually stand.
          </h2>
          <p className="font-serif text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {KIT_PRICE_RANGE}. Five minutes. Results in {SLA_HOURS} hours with plain-English interpretation from a GMC-registered GP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#tests"
              className="bg-white text-black hover:bg-gray-100 font-sans font-black uppercase tracking-widest text-sm px-10 py-4 border-2 border-white transition-colors"
            >
              Choose your test
            </Link>
            <Link
              href="/test-selector"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-4 transition-colors"
            >
              Take the quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
