import Link from 'next/link'
import type { ArticleFrontmatter, TocHeading } from '@/lib/blog'
import { KIT_PRICE_RANGE, SLA_HOURS } from '@/lib/pricing'
import { getAuthor } from '@/lib/authors'
import ArticleFaq from '@/components/marketing/ArticleFaq'
import ArticleToc from '@/components/marketing/ArticleToc'
import BackToTop from '@/components/marketing/BackToTop'

// ISO-date display formatter. Pre-formatted strings like "12 Oct 2026" pass through unchanged
// so legacy articles aren't broken; ISO strings like "2026-05-27" get the en-GB editorial format.
function formatDate(s: string | undefined): string {
  if (!s) return ''
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return s
  const d = new Date(s.slice(0, 10) + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  frontmatter: ArticleFrontmatter
  children: React.ReactNode
  // headings: H2 list for TOC. If empty or undefined, TOC is suppressed regardless of word count.
  headings?: TocHeading[]
  // showToc: computed in [slug]/page.tsx via shouldShowToc(). Defaults to false.
  showToc?: boolean
}

export default function ArticleLayout({ frontmatter, children, headings = [], showToc = false }: Props) {
  const { title, excerpt, category, date, dateModified, readTime, authorSlug, reviewerSlug, faq } = frontmatter

  const author = authorSlug ? getAuthor(authorSlug) : undefined
  const reviewer = reviewerSlug ? getAuthor(reviewerSlug) : undefined

  // Fallback for legacy frontmatter that hasn't been migrated to authorSlug yet.
  const displayName = author?.name ?? frontmatter.author ?? 'Andro Prime'
  const displayInitials = author?.initials ?? frontmatter.initials ?? 'AP'
  const displayRole = author?.bylineRole

  const tocVisible = showToc && headings.length > 0

  return (
    <main className="blog-skin">
      <header className="border-b-8 border-black">
        {/* Meta bar: breadcrumb + category / read-time chips */}
        <div className="border-b-4 border-black bg-dot-pattern">
          <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 font-mono text-xs font-bold uppercase tracking-widest">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-gray-600">
                <li>
                  <Link href="/" className="hover:text-black hover:underline">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="hover:text-black hover:underline">Blog</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-black truncate max-w-[40ch]" aria-current="page">{title}</li>
              </ol>
            </nav>
            <div className="flex gap-4 shrink-0">
              <span className="bg-black text-white px-3 py-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-white" aria-hidden="true" /> {category}
              </span>
              <span className="border-2 border-black px-3 py-1 bg-white">{readTime}</span>
            </div>
          </div>
        </div>

        {/* Headline block */}
        <div className="px-6 py-12 md:py-20 border-b-4 border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" aria-hidden="true" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              {title}
            </h1>
            <p className="font-serif text-xl md:text-2xl leading-snug text-black border-l-8 border-black pl-6 py-2">
              {excerpt}
            </p>
          </div>
        </div>

        {/* Author + reviewer card — overlaps the headline block, floats on md+ */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col md:flex-row border-4 border-black bg-white md:-translate-y-4 brutal-shadow relative z-20">
            {/* Written by — inverts to black on hover */}
            <div className="group w-full md:w-1/2 p-6 md:p-8 flex items-start gap-4 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white hover:bg-black hover:text-white transition-colors">
              <div
                className="shrink-0 w-12 h-12 border-4 border-black bg-black text-white group-hover:bg-white group-hover:text-black group-hover:border-white flex items-center justify-center font-sans font-black text-lg transition-colors"
                aria-hidden="true"
              >
                {displayInitials}
              </div>
              <div className="flex flex-col font-mono text-sm uppercase tracking-widest gap-1">
                <span className="text-[10px] text-gray-500 group-hover:text-gray-400">Written by</span>
                {authorSlug ? (
                  <Link href={`/authors/${authorSlug}`} className="font-bold text-black group-hover:text-white hover:underline decoration-2 underline-offset-2">
                    {displayName}
                  </Link>
                ) : (
                  <strong className="font-bold text-black group-hover:text-white">{displayName}</strong>
                )}
                {displayRole && (
                  <span className="text-[10px] font-sans font-normal normal-case tracking-normal text-gray-600 group-hover:text-gray-300">{displayRole}</span>
                )}
              </div>
            </div>

            {/* Reviewed by + dates */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white relative gap-6">
              <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" aria-hidden="true" />
              {reviewer && (
                <div className="flex flex-col font-mono text-sm uppercase tracking-widest gap-1 relative z-10">
                  <span className="text-[10px] text-gray-500">Reviewed by</span>
                  <Link href={`/authors/${reviewer.slug}`} className="font-bold hover:underline decoration-2 underline-offset-2 text-black">
                    {reviewer.name}
                  </Link>
                  <span className="text-[10px] font-sans font-normal normal-case tracking-normal text-gray-600">{reviewer.bylineRole}</span>
                </div>
              )}
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest pt-4 border-t-2 border-black relative z-10 flex flex-wrap justify-between gap-2">
                <span className="text-gray-500">Published</span>
                <span className="text-black">{formatDate(date)}</span>
                {dateModified && dateModified !== date && (
                  <>
                    <span className="text-gray-500 w-full md:w-auto">Updated</span>
                    <span className="text-black">{formatDate(dateModified)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <article className="pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {tocVisible && <ArticleToc headings={headings} />}
          <div className="article-prose text-black">
            {children}
          </div>
          {faq && faq.length > 0 && <ArticleFaq items={faq} />}
        </div>
      </article>

      <section className="py-20 md:py-28 bg-black text-white border-t-8 border-black relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block border-2 border-white px-4 py-1 mb-8 font-mono text-xs uppercase tracking-widest">
            System Directive: Baseline Check
          </div>
          <h2 className="stroke-fill-on-hover text-4xl md:text-6xl font-sans font-bold uppercase leading-tight mb-8">
            Find out where you<br />
            <span className="text-stroke-white">actually stand.</span>
          </h2>
          <p className="font-serif text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {KIT_PRICE_RANGE}. Five minutes. Results in {SLA_HOURS} hours with plain-English interpretation from a GMC-registered GP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#tests"
              className="bg-white text-black hover:bg-transparent hover:text-white font-sans font-black uppercase tracking-widest text-sm px-10 py-5 border-4 border-white transition-colors"
            >
              Choose your test
            </Link>
            <Link
              href="/test-selector"
              className="border-4 border-white text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 transition-colors"
            >
              Take the quiz
            </Link>
          </div>
        </div>
      </section>
      <BackToTop />
    </main>
  )
}
