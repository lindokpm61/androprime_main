'use client'

import { useEffect, useState } from 'react'

// Homepage hero background.
//
// The poster <img> is the LCP element and paints immediately (preloaded at high
// priority in page.tsx). The autoplay <video> is mounted only AFTER page-load so
// its download (~0.5 MB WebM / 0.65 MB MP4) does not compete with the LCP image
// on the critical path.
//
// The grayscale + opacity treatment is applied ONCE on the wrapper, and the poster
// is unmounted the instant the video starts rendering frames (`onPlaying`). That
// prevents two translucent layers ever stacking, which previously showed the still
// image through the semi-transparent video as a ghost / double-exposure.
//
// The video is background decoration only (grayscale, 60% opacity, behind a 40%
// white overlay), so on phones/tablets, data-saver, or reduced-motion we never
// download it and simply keep the static poster. That saves the whole video
// payload on the visitors most sensitive to it. The ≥1024px
// gate matches the lg breakpoint already used for the hero's dashboard preview.
export function HeroBackground() {
  const [showVideo, setShowVideo] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    // Skip the video on the connections/devices least able to afford it.
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saveData = conn?.saveData === true
    if (!isDesktop || prefersReducedMotion || saveData) return

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
      <div className="absolute inset-0 opacity-60 grayscale">
        {!videoPlaying && (
          <picture>
            <source srcSet="/videos/hero-poster.webp" type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/videos/hero-poster.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
            />
          </picture>
        )}
        {showVideo && (
          <video
            id="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onPlaying={() => setVideoPlaying(true)}
            className={`absolute inset-0 w-full h-full object-cover object-[center_30%] ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/videos/hero.webm" type="video/webm" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="absolute inset-0 bg-white/40" />
    </div>
  )
}
