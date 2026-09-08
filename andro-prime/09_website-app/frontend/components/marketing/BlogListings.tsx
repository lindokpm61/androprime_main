'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { HeroField } from '@/components/marketing/HeroField'

export interface BlogListItem {
  href: string
  category: string
  date: string
  title: string
  excerpt: string
  readTime: string
  imgSrc: string
  imgAlt: string
  usingOg: boolean
}

interface Props {
  // All published articles, already sorted most-recent-first by the server.
  articles: BlogListItem[]
}

const PAGE_SIZE = 6

/**
 * The blog index, rebuilt in Direction F on 2026-09-08 from
 * design/mockups/journey/blog-F.html (frame AP).
 *
 * ▶ THE ONE STRUCTURAL CHANGE, and it is worth stating because it is not a
 * restyle. The V2.0 index was a full-bleed alternating left/right stack: every
 * article was a full-width band, image on one side, headline at 3xl to 5xl on
 * the other, sides flipping every row. That is six screens of scrolling for six
 * articles, and at 1440 a reader could see roughly one and a half of them.
 *
 * This is a card grid: one lead card spanning the row, then three-up. Twelve
 * articles are now visible in about the space the old layout gave to two, which
 * is what an index is for. The mockup draws it this way for the same reason.
 *
 * ▶ WHAT SURVIVED: the category filter, the pagination, the featured/lead
 * distinction, the empty state, and the grayscale treatment on real photography
 * with the generated OG card opting OUT of it. All of that is detail worth
 * keeping and all of it is restated rather than dropped.
 *
 * ▶ THE PHOTOGRAPHS. `imgSrc` is a real Unsplash photo for 10 of 18 articles,
 * and the generated branded OG card for the rest. `usingOg` drives the
 * distinction: a real photo takes the editorial grayscale, the generated card
 * does NOT, because it is artwork rather than photography and desaturating it
 * would just dim the brand. That rule predates this rebuild and is preserved.
 *
 * Raw <img>, not next/image, for the reason ArticlePhoto's header sets out:
 * the sources are remote images.unsplash.com URLs and next.config.ts declares
 * no `images.remotePatterns`, so next/image would throw at request time.
 */
export default function BlogListings({ articles }: Props) {
  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category))
    return ['All', ...Array.from(set)]
  }, [articles])

  const [active, setActive] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => (active === 'All' ? articles : articles.filter((a) => a.category === active)),
    [articles, active]
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = rest.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectCategory = (cat: string) => {
    setActive(cat)
    setPage(1)
  }

  return (
    <>
      {/* ---------- HERO ----------
          The shared `HeroField` ground, so the index hands over from `/` and
          `/kits` without a seam. It is the seventh surface to carry that layer;
          CA-045 q6/q7 are open against it and the copy register tracks scope. */}
      <div className="f-ruleground">
        <HeroField />
        <section className="f-wrap f-sec f-sec-hero">
          <div className="f-rise">
            <div className="f-btns" style={{ marginBottom: 18 }}>
              <span className="f-eyebrow">Research &amp; analysis</span>
              <span className="f-kchip">{articles.length} articles</span>
            </div>
            <h1 className="f-h1">
              Insights<br />&amp; <span className="f-grey">protocols.</span>
            </h1>
            <p className="f-stand" style={{ marginTop: 20 }}>
              What your numbers actually mean, what a reference range is and is not, and what the
              evidence says about moving one. Written plainly, reviewed by a GMC-registered GP.
            </p>
          </div>
        </section>
      </div>

      <section className="f-wrap" style={{ paddingBottom: 72 }}>
        <div className="fb-filters" role="group" aria-label="Filter articles by category">
          {categories.map((tag) => {
            const isActive = tag === active
            return (
              <button
                key={tag}
                type="button"
                onClick={() => selectCategory(tag)}
                aria-pressed={isActive}
                className={isActive ? 'fb-filter fb-filter-on' : 'fb-filter'}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {/* EMPTY STATE. Reachable only by filtering, so it names the filter and
            offers the way back rather than reading as a site error. */}
        {!featured && (
          <div className="fb-stat" style={{ textAlign: 'center', padding: '48px 22px' }}>
            <span className="fb-stat-k">No results</span>
            <p style={{ marginBottom: 18 }}>Nothing filed under {active} yet.</p>
            <button type="button" onClick={() => selectCategory('All')} className="f-btn f-btn-ghost f-btn-sm">
              Show all articles
            </button>
          </div>
        )}

        {(featured || visible.length > 0) && (
          <div className="fb-grid f-rise">
            {/* The lead card spans the row and takes the accent ring, the same
                device `/kits` uses to mark the recommended kit. One per page. */}
            {featured && (
              <article className="fb-pcard fb-pcard-lead">
                <Link
                  href={featured.href}
                  className={featured.usingOg ? 'fb-pshot fb-pshot-og' : 'fb-pshot'}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.imgSrc} alt="" loading="eager" decoding="async" />
                </Link>
                <div>
                  <div className="fb-pbody">
                    <div className="fb-pk">
                      <span className="fb-mchip">{featured.category}</span>
                      <span className="fb-mchip fb-mchip-q">Latest</span>
                    </div>
                    <h3>
                      <Link href={featured.href}>{featured.title}</Link>
                    </h3>
                    <p>{featured.excerpt}</p>
                  </div>
                  <div className="fb-pfoot">
                    <span>{featured.date}</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </article>
            )}

            {visible.map((a) => (
              <article key={a.href} className="fb-pcard">
                <Link
                  href={a.href}
                  className={a.usingOg ? 'fb-pshot fb-pshot-og' : 'fb-pshot'}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.imgSrc} alt="" loading="lazy" decoding="async" />
                </Link>
                <div className="fb-pbody">
                  <div className="fb-pk">
                    <span className="fb-mchip fb-mchip-q">{a.category}</span>
                  </div>
                  <h3>
                    <Link href={a.href}>{a.title}</Link>
                  </h3>
                  <p>{a.excerpt}</p>
                </div>
                <div className="fb-pfoot">
                  <span>{a.date}</span>
                  <span>{a.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label="Article pages" className="fb-pager">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              &larr; Prev
            </button>
            {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === safePage ? 'page' : undefined}
              >
                {String(n).padStart(2, '0')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
            >
              Next &rarr;
            </button>
          </nav>
        )}
      </section>
    </>
  )
}
