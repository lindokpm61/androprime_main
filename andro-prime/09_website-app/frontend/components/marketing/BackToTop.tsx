'use client'

import { useEffect, useState } from 'react'

/**
 * The single back-to-top control.
 *
 * ⚠ "Single" is load-bearing. Until 2026-09-08 an article rendered TWO of these:
 * this one from ArticleLayout at `bottom-6 right-6 z-40` on a 600px threshold,
 * and a second one built into ArticleToc at `bottom-8 right-8 z-20` on a 1500px
 * threshold. They overlapped, so past 1500px the reader saw one button with
 * another one peeking out behind it, and nothing failed loudly enough to notice.
 * ArticleToc's copy is deleted. If you need the button somewhere else, render
 * THIS component there.
 *
 * Circular and token-driven, matching `.f-btn`'s pill geometry rather than the
 * V2.0 square black box.
 */
export default function BackToTop({ threshold = 600 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center text-base transition-colors"
      style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        boxShadow: 'var(--shadow-ambient)',
      }}
    >
      &uarr;
    </button>
  )
}
