'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

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

function imgClass(usingOg: boolean) {
  return usingOg
    ? 'w-full h-full object-cover'
    : 'w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:opacity-100 transition-all duration-700'
}

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
      {/* HEADER */}
      <section className="border-b-8 border-black">
        <div className="border-b-4 border-black bg-dot-pattern">
          <div className="max-w-content mx-auto px-6 py-4 flex justify-between items-center font-mono text-xs font-bold uppercase tracking-widest">
            <span className="bg-black text-white px-3 py-1">Research &amp; Analysis</span>
            <span className="text-gray-600">Insights &amp; Protocols</span>
          </div>
        </div>
        <div className="max-w-content mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" aria-hidden="true" />
          <h1 className="relative z-10 text-5xl md:text-7xl lg:text-[5.5rem] font-sans font-black text-black uppercase tracking-tighter leading-[0.85]">
            Insights &amp;<br />Protocols
          </h1>
          <div className="relative z-10 w-full md:max-w-sm">
            <p className="font-serif text-lg text-black mb-6">
              Research, analysis, and evidence-based perspectives on male hormone optimisation.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
              {categories.map((tag) => {
                const isActive = tag === active
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => selectCategory(tag)}
                    aria-pressed={isActive}
                    className={`px-4 py-2 font-sans font-black uppercase tracking-widest text-xs border-2 border-black transition-colors ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-black hover:text-white cursor-pointer'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* EMPTY STATE */}
      {!featured && (
        <section className="border-b-8 border-black py-24 px-6 bg-dot-pattern">
          <div className="max-w-content mx-auto text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              No results
            </p>
            <p className="font-serif text-xl text-black mb-8">
              Nothing filed under {active} yet.
            </p>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="border-2 border-black px-4 py-2 font-sans font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
            >
              Show all articles
            </button>
          </div>
        </section>
      )}

      {/* FEATURED */}
      {featured && (
        <section className="border-b-8 border-black flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-white">
            <div>
              <div className="flex flex-wrap gap-4 mb-8 font-mono text-xs font-bold uppercase tracking-widest">
                <span className="bg-black text-white px-3 py-1">{featured.category}</span>
                <span className="border-2 border-black px-3 py-1">{featured.date}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter leading-[0.9] text-black mb-6">
                <Link href={featured.href} className="hover:underline decoration-4 underline-offset-4">
                  {featured.title}
                </Link>
              </h2>
              <p className="font-serif text-lg lg:text-xl text-black leading-relaxed">
                {featured.excerpt}
              </p>
            </div>
            <div className="mt-10 pt-8 border-t-4 border-black flex justify-between items-end font-mono text-xs font-bold uppercase tracking-widest">
              <Link href={featured.href} className="border-2 border-black px-3 py-2 hover:bg-black hover:text-white transition-colors">
                Read article →
              </Link>
              <span>{featured.readTime}</span>
            </div>
          </div>
          <Link href={featured.href} className="w-full lg:w-1/2 relative h-[300px] lg:h-auto bg-black p-4 group overflow-hidden block">
            <span className="absolute inset-4 border-4 border-white z-20 pointer-events-none" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.imgSrc} alt={featured.imgAlt} className={imgClass(featured.usingOg)} />
          </Link>
        </section>
      )}

      {/* ARTICLE LIST — alternating left/right */}
      {rest.length > 0 && (
        <section className="flex flex-col">
          {visible.map((a, i) => {
            const reverse = i % 2 === 1
            return (
              <article
                key={a.href}
                className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} w-full border-b-4 border-black group bg-white hover:bg-black hover:text-white transition-colors duration-300`}
              >
                <Link
                  href={a.href}
                  className={`w-full md:w-1/3 h-56 md:h-auto border-b-4 md:border-b-0 ${reverse ? 'md:border-l-4' : 'md:border-r-4'} border-black relative overflow-hidden bg-black p-2 block`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.imgSrc} alt={a.imgAlt} className={imgClass(a.usingOg)} />
                  <span className={`absolute top-4 ${reverse ? 'right-4' : 'left-4'} bg-white text-black font-mono text-[10px] font-bold px-2 py-1 uppercase`}>
                    {a.category}
                  </span>
                </Link>
                <div className={`w-full md:w-2/3 p-8 lg:p-12 flex flex-col justify-center relative ${reverse ? 'md:items-end md:text-right' : ''}`}>
                  <div className={`font-mono text-[10px] text-gray-500 group-hover:text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-4 ${reverse ? 'justify-end' : ''}`}>
                    <span>{a.date}</span>
                    <span className="w-8 h-[2px] bg-gray-300 group-hover:bg-gray-700" aria-hidden="true" />
                    <span>{a.readTime}</span>
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-sans font-black uppercase tracking-tighter leading-none mb-6">
                    <Link href={a.href} className="hover:underline decoration-4 underline-offset-4">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="font-serif text-base lg:text-lg text-gray-700 group-hover:text-gray-300 max-w-2xl">
                    {a.excerpt}
                  </p>
                </div>
              </article>
            )
          })}
        </section>
      )}

      {/* PAGINATION */}
      {pageCount > 1 && (
        <nav
          aria-label="Article pages"
          className="border-b-8 border-black bg-dot-pattern px-6 py-8 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="border-2 border-black px-4 py-2 bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Prev
          </button>
          {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === safePage ? 'page' : undefined}
              className={`w-10 h-10 border-2 border-black transition-colors ${
                n === safePage ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {String(n).padStart(2, '0')}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={safePage >= pageCount}
            className="border-2 border-black px-4 py-2 bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Next →
          </button>
        </nav>
      )}
    </>
  )
}
