'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/blog'

interface Props {
  headings: TocHeading[]
}

/**
 * Article table of contents, rebuilt in Direction F.
 *
 * Behaviour is unchanged and was already good: desktop gets a fixed sidebar with
 * an IntersectionObserver active-section highlight, revealed only while the
 * article body is on screen; mobile gets a collapsible block above the body.
 * Only the skin moved.
 *
 * The back-to-top button that used to live in here is GONE from this component:
 * `BackToTop` is a separate component that ArticleLayout already renders, so the
 * page was mounting two of them and only one was ever visible because they sat
 * at the same coordinates. Found while porting. One button now, from one place.
 */
export default function ArticleToc({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // The desktop sidebar is `fixed`, so without this it overlaps the article
  // header at the top of the page and the CTA band at the bottom. Only reveal
  // it while the article body is on screen.
  const [sidebarVisible, setSidebarVisible] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    const article = document.querySelector('article')
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (article) {
          const r = article.getBoundingClientRect()
          setSidebarVisible(r.top <= 80 && r.bottom > 200)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <>
      {/* Mobile and tablet: collapsible block inline above the article body. */}
      <details className="fb-toc lg:hidden">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
          <span className="fb-toc-h">On this page</span>
          <span aria-hidden="true" className="fb-toc-h">+</span>
        </summary>
        <nav aria-label="Table of contents">
          <ol>
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      </details>

      {/* Desktop: fixed sidebar, hidden until the article body is in view. The
          left offset keeps it clear of the 720px measure at any viewport. */}
      <aside
        aria-label="Table of contents"
        aria-hidden={!sidebarVisible}
        className={`hidden lg:block fixed left-[max(1.5rem,calc(50vw-22.5rem-17rem))] top-32 w-60 max-h-[calc(100vh-10rem)] overflow-y-auto z-10 transition-opacity duration-200 ${
          sidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div style={{ borderLeft: '1px solid var(--hair-2)', paddingLeft: 18 }}>
          <p className="fb-toc-h" style={{ marginBottom: 14 }}>On this page</p>
          <ol style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
            {headings.map((h) => {
              const isActive = activeId === h.id
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="block text-sm leading-snug transition-colors"
                    style={{
                      color: isActive ? 'var(--ink)' : 'var(--ink-3)',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>
    </>
  )
}
