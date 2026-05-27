'use client'

import { useEffect, useState } from 'react'

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
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center font-sans font-black text-lg"
    >
      ↑
    </button>
  )
}
