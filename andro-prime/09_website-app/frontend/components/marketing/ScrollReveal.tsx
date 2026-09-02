'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * The Direction F scroll choreography, ported from
 * `design/mockups/directions/F-field.html:887-903`.
 *
 * WHY THIS EXISTS. The F build ported the direction's layout, type and spacing
 * and dropped almost all of its motion. `.f-rise` was applied 36 times across
 * the six F routes and every instance fired at page LOAD, because the build kept
 * the keyframe and left the trigger behind: there was no `IntersectionObserver`
 * anywhere in the app. So thirty-odd reveals played to an empty room in the
 * first 700ms and were already at rest by the time anyone scrolled to them. The
 * system had entrance motion designed into it and a reader saw about two
 * instances of it. That is the whole of why the site read flat.
 *
 * TWO OBSERVERS, DELIBERATELY NOT ONE. They fire on different thresholds because
 * they are doing different jobs: a section only has to be arriving to start
 * revealing (8%, with a -12% bottom margin so it does not trigger on the very
 * edge), while a marker row has to be properly on screen before its data starts
 * drawing (35%), or the reader misses the thing the animation exists to show.
 *
 * OBSERVERS, NEVER A SCROLL LISTENER. The direction's own comment says so. A
 * scroll handler runs on the main thread on every frame of every scroll for the
 * life of the page; an observer costs nothing after it has fired, and each
 * target is unobserved the moment it does.
 *
 * 🔴 NOTHING THAT MOVES HERE CARRIES INFORMATION. Under reduced motion the
 * `.js` class is never added at all (see the inline script in the marketing
 * layout), so every element is simply at rest and the page is complete. That is
 * the correct fallback precisely because the information was never in the
 * movement: it is in the bands' positions, which are arithmetic from
 * `thresholds.md` and are painted identically either way.
 */
export function ScrollReveal() {
  // Client-side navigation swaps the DOM without remounting the layout, so the
  // new page's elements would sit hidden and unobserved forever without this.
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement

    // Mirrors the inline script's gate. If either is true the page is already
    // fully visible and there is nothing to wire.
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('js')
      return
    }

    // Tells the inline script's failsafe that hydration got here, so it does not
    // strip `.js` out from under us. Set before anything that could throw.
    ;(window as unknown as { __fRiseReady?: boolean }).__fRiseReady = true
    root.classList.add('js')

    // Sections. The stagger is per row of three, not per element: a 12-element
    // page staggered cumulatively would end on a delay over a second long.
    const sections = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('on')
          sections.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    document.querySelectorAll<HTMLElement>('.f-rise').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 90}ms`
      sections.observe(el)
    })

    // Marker rows. `--d` is the row's own offset into the cascade; the CSS adds
    // the within-row offsets (the ours band trails the lab band, the value
    // marker lands after both) on top of it, so the whole readout reads as one
    // instrument filling in rather than four unrelated animations.
    const rows = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('on')
          rows.unobserve(e.target)
        }
      },
      { threshold: 0.35 },
    )
    document.querySelectorAll<HTMLElement>('.f-mk').forEach((el, i) => {
      el.style.setProperty('--d', `${i * 110}ms`)
      rows.observe(el)
    })

    return () => {
      sections.disconnect()
      rows.disconnect()
    }
  }, [pathname])

  return null
}
