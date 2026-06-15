'use client'

import { useEffect, useState } from 'react'

// Homepage hero background.
//
// The poster <img> is the LCP element and paints immediately — it is preloaded at
// high priority in page.tsx. The autoplay <video> is mounted only AFTER the page
// load settles, so its ~1.6 MB download does not compete with the LCP image for
// bandwidth on the critical path (audit 2026-06-15: a concurrently-downloading
// video held LCP at ~4.4 s even with the image as the LCP element). The video then
// fades in over the identical poster frame, so the result is visually the same.
export function HeroBackground() {
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    let timer: number | undefined
    const arm = () => {
      timer = window.setTimeout(() => setShowVideo(true), 600)
    }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return () => {
      if (timer) window.clearTimeout(timer)
      window.removeEventListener('load', arm)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/videos/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[center_30%] opacity-60 grayscale"
      />
      {showVideo && (
        <video
          id="hero-video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] opacity-60 grayscale transition-opacity duration-700"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-white/40" />
    </div>
  )
}
