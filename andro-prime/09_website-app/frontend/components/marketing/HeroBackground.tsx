'use client'

import { useEffect, useState } from 'react'

// Homepage hero background.
//
// The poster <img> is the LCP element and paints immediately (preloaded at high
// priority in page.tsx). The autoplay <video> is mounted only AFTER page-load so
// its ~1.6 MB download does not compete with the LCP image on the critical path.
//
// The grayscale + opacity treatment is applied ONCE on the wrapper, and the poster
// is unmounted the instant the video starts rendering frames (`onPlaying`). That
// prevents two translucent layers ever stacking, which previously showed the still
// image through the semi-transparent video as a ghost / double-exposure.
export function HeroBackground() {
  const [showVideo, setShowVideo] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

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
      <div className="absolute inset-0 opacity-60 grayscale">
        {!videoPlaying && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/videos/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          />
        )}
        {showVideo && (
          <video
            id="hero-video"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onPlaying={() => setVideoPlaying(true)}
            className={`absolute inset-0 w-full h-full object-cover object-[center_30%] ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="absolute inset-0 bg-white/40" />
    </div>
  )
}
