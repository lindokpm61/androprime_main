import Link from 'next/link'
import { formatArticleDate } from '@/lib/blog'
import type { ArticleFrontmatter, TocHeading } from '@/lib/blog'
import { KIT_PRICE_RANGE } from '@/lib/pricing'
import { getAuthor } from '@/lib/authors'
import ArticleFaq from '@/components/marketing/ArticleFaq'
import ArticleToc from '@/components/marketing/ArticleToc'
import ArticlePhoto from '@/components/marketing/ArticlePhoto'
import BackToTop from '@/components/marketing/BackToTop'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'
import { RelatedArticles } from '@/components/marketing/RelatedArticles'
import { FClose, FPage } from '@/components/marketing/FPage'

/**
 * The article shell, rebuilt in Direction F on 2026-09-08 from
 * design/mockups/journey/blog-F.html (frames AL and AO).
 *
 * ▶ WHAT THIS REPLACES, AND WHY THE REPLACEMENT HAD TO BE THIS CAREFUL.
 *
 * A first attempt at an F blog LOST on 2026-08-27. Keith: "I think the old or
 * the live blog style wins. There's a lot of detail missing from the F blog you
 * created." The missing detail was the twelve-piece editorial component system
 * flattened into about two levels of emphasis. The fix is not in this file, it
 * is in styles/components/f-blog.css, which gives F an eight-ground ladder deep
 * enough to hold all twelve. Read that file's header before changing any of it.
 *
 * ▶ WHAT CAME OFF, PIECE BY PIECE, all of it V2.0 brutalist furniture:
 *   - `.blog-skin`, and with it the cream #f4f4f0 ground. The blog stops being
 *     a documented exception to two brand non-negotiables and becomes the same
 *     system as every other route.
 *   - the 8px black frame, the 4px rules, `bg-dot-pattern` and `brutal-shadow`.
 *   - the uppercase black sans headline, replaced by the display serif every
 *     other F route uses.
 *   - `text-stroke-white` / `stroke-fill-on-hover` on the closing CTA, a
 *     wireframe-headline hover effect that existed nowhere else on the site.
 *   - `.article-prose`, replaced by `.fb-prose`.
 *
 * ▶ WHAT SURVIVED ON PURPOSE:
 *   - The breadcrumb, the category and read-time chips, the author + reviewer
 *     card with published and updated dates, the ToC, the FAQ, the related
 *     reading, the newsletter capture and the closing kit CTA. Every one of
 *     those is DETAIL in the sense Keith's verdict meant, so the rebuild keeps
 *     all of it and only restates it in F's materials.
 *   - The photograph, which is the one thing the mockup does not draw. See
 *     ArticlePhoto's header.
 *
 * ▶ ONE DEFECT FIXED IN PASSING. The page used to mount TWO back-to-top
 * buttons, one here and one inside ArticleToc, overlapping at different scroll
 * thresholds. ArticleToc's is deleted. See BackToTop's header.
 */

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

interface Props {
  frontmatter: ArticleFrontmatter
  children: React.ReactNode
  // headings: H2 list for the ToC. Empty or undefined suppresses it regardless
  // of word count.
  headings?: TocHeading[]
  // showToc: computed in [slug]/page.tsx via shouldShowToc(). Defaults to false.
  showToc?: boolean
  // relatedSlugs: candidates for "Related reading", priority order. Empty (e.g.
  // on the preview route) suppresses the section. Published-only + 404-safe.
  relatedSlugs?: string[]
}

export default function ArticleLayout({
  frontmatter,
  children,
  headings = [],
  showToc = false,
  relatedSlugs = [],
}: Props) {
  const { title, excerpt, category, date, dateModified, readTime, authorSlug, reviewerSlug, faq } =
    frontmatter
  const { photoSrc, photoAlt, photoCredit, photoCreditUrl } = frontmatter

  const author = authorSlug ? getAuthor(authorSlug) : undefined
  const reviewer = reviewerSlug ? getAuthor(reviewerSlug) : undefined

  // Fallback for legacy frontmatter not yet migrated to authorSlug.
  const displayName = author?.name ?? frontmatter.author ?? 'Andro Prime'
  const displayInitials = author?.initials ?? frontmatter.initials ?? 'AP'
  const displayRole = author?.bylineRole

  const tocVisible = showToc && headings.length > 0

  return (
    <FPage>
      <header className="fb-read">
        {/* Meta bar: breadcrumb one side, category and read time the other. */}
        <div className="fb-metabar">
          <nav aria-label="Breadcrumb">
            <ol className="fb-crumb">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="fb-now truncate max-w-[32ch]" aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="fb-mchips">
            {category && <span className="fb-mchip">{category}</span>}
            {readTime && <span className="fb-mchip fb-mchip-q">{readTime}</span>}
          </div>
        </div>

        <div className="fb-arthead">
          <h1>{title}</h1>
          {/* The standfirst sits behind a 3px ink rule, keeping the live blog's
              gesture (a rule that breaks the left margin to say "this is the
              argument") at F's weight. NOT an accent: `--flag` was ruled to ink
              on 2026-09-03, so there is no chromatic accent to spend here. */}
          {excerpt && <p className="fb-stand">{excerpt}</p>}
        </div>

        {/* Author and reviewer. The 1px grid gap IS the divider. */}
        <div className="fb-bylines">
          <div className="fb-byline">
            <span className="fb-byline-av" aria-hidden="true">{displayInitials}</span>
            <div>
              <span className="fb-byline-r">Written by</span>
              {authorSlug ? (
                <Link href={`/authors/${authorSlug}`} className="fb-byline-n">{displayName}</Link>
              ) : (
                <b className="fb-byline-n">{displayName}</b>
              )}
              {displayRole && <span className="fb-byline-role">{displayRole}</span>}
            </div>
          </div>

          <div className="fb-byline fb-byline-col">
            {reviewer && (
              <div className="flex items-start gap-3.5">
                <span className="fb-byline-av" aria-hidden="true">{reviewer.initials}</span>
                <div>
                  <span className="fb-byline-r">Reviewed by</span>
                  <Link href={`/authors/${reviewer.slug}`} className="fb-byline-n">
                    {reviewer.name}
                  </Link>
                  <span className="fb-byline-role">{reviewer.bylineRole}</span>
                </div>
              </div>
            )}
            <div className="fb-byline-dates">
              <span>Published</span>
              <b>{formatArticleDate(date)}</b>
              {dateModified && dateModified !== date && (
                <>
                  <span>Updated</span>
                  <b>{formatArticleDate(dateModified)}</b>
                </>
              )}
            </div>
          </div>
        </div>

        {/* The photograph. 10 of 18 published articles carry one; the other 8
            simply have no figure and the prose starts straight after the
            bylines, which is why this is a plain conditional and not a
            placeholder. */}
        {photoSrc && (
          <ArticlePhoto
            src={photoSrc}
            alt={photoAlt ?? title}
            credit={photoCredit}
            creditUrl={photoCreditUrl}
          />
        )}
      </header>

      <article className="pb-16">
        <div className="fb-read">
          {tocVisible && <ArticleToc headings={headings} />}
          <div className="fb-prose">{children}</div>
          {faq && faq.length > 0 && <ArticleFaq items={faq} />}
        </div>
      </article>

      {relatedSlugs.length > 0 && (
        <div className="fb-read">
          <RelatedArticles slugs={relatedSlugs} heading="Related reading" limit={3} variant="f" />
        </div>
      )}

      {/* ---------- CLOSE ----------
          The `.f-close` block every other F route ends on, so an article hands
          the reader back to the site in the same shape `/kits` and
          `/how-it-works` do. The V2.0 version was a full-bleed black band with
          an outlined wireframe headline that filled on hover; that effect
          existed nowhere else on the site and went with the rest of the
          brutalist furniture. */}
      <section className="f-wrap f-sec">
        <FClose inSection reveal={false}>
          <p className="f-blab">Start with a number</p>
          <h2>Find out where you actually stand.</h2>
          <p className="f-sub" style={{ margin: '0 auto' }}>
            {KIT_PRICE_RANGE}. Five minutes at home, results in 2 to 5 working days, and a
            plain-English reading of every marker against both ranges.
          </p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link href="/kits" className="f-btn">See the tests {ARROW}</Link>
            <Link href="/test-selector" className="f-btn f-btn-ghost">Use the selector</Link>
          </div>
        </FClose>
      </section>

      {/* ---------- NEWSLETTER ----------
          The lowest-commitment rung of the cold-to-warm bridge: a passive
          capture for readers not ready to test. The selector above is the
          primary bridge; this catches everyone else so cold traffic does not
          leak. Inverted, which is this page's ONE invert. */}
      <section className="fb-read" style={{ paddingBottom: 64 }}>
        <div className="fb-news f-on-ink">
          <span className="fb-news-k">Not ready to test?</span>
          <h2 className="fb-news-h">The occasional plain-English read.</h2>
          <p>
            What your bloods actually tell you, what a reference range is and is not, and what moves
            a number. No schedule, no filler.
          </p>
          <NewsletterForm theme="dark" source="article-footer" />
        </div>
      </section>

      <BackToTop />
    </FPage>
  )
}
