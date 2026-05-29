'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/blog'

interface Props {
  headings: TocHeading[]
}

// Article table of contents. Renders only when at least one H2 exists.
// Desktop: sticky sidebar with active-section highlight via IntersectionObserver.
// Mobile: collapsible <details> block at the top of the article body.
// Also includes a floating back-to-top button that appears after the user scrolls past ~1500px.
export default function ArticleToc({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  // The desktop sidebar is `fixed`, so without this it overlaps the article
  // header / author card at the top of the page and the CTA band at the bottom.
  // Only reveal it while the article body is on screen.
  const [sidebarVisible, setSidebarVisible] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
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
        setShowBackToTop(window.scrollY > 1500)
        if (article) {
          const r = article.getBoundingClientRect()
          // Show once the article top is at/above the 80px mark, hide again
          // when the bottom passes out the top of the viewport.
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Mobile: collapsible block, appears inline above the article body */}
      <details className="lg:hidden mb-10 border-2 border-black bg-gray-50">
        <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-4 font-sans font-black uppercase text-sm tracking-widest text-black">
          <span>On this page</span>
          <span aria-hidden="true" className="font-sans font-black text-lg">+</span>
        </summary>
        <nav aria-label="Table of contents" className="px-5 pb-4">
          <ol className="space-y-2 font-serif text-base text-black list-decimal list-inside">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="underline hover:no-underline"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>

      {/* Desktop: sticky sidebar — hidden until the article body is in view */}
      <aside
        aria-label="Table of contents"
        aria-hidden={!sidebarVisible}
        className={`hidden lg:block fixed left-[max(1.5rem,calc(50vw-32rem-18rem))] top-32 w-64 max-h-[calc(100vh-10rem)] overflow-y-auto z-10 transition-opacity duration-200 ${sidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="border-l-2 border-black pl-5">
          <p className="font-sans font-black uppercase text-xs tracking-widest text-black mb-4">
            On this page
          </p>
          <ol className="space-y-2.5">
            {headings.map((h) => {
              const isActive = activeId === h.id
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`block font-serif text-sm leading-snug transition-colors ${
                      isActive
                        ? 'text-black font-bold'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>

      {/* Back-to-top floating button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-20 w-12 h-12 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-sans font-black text-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
        >
          ↑
        </button>
      )}
    </>
  )
}
