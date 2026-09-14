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
    /* 🔴 ANYTHING THE READER CAN ALREADY SEE IS REVEALED NOW, NOT OBSERVED
       (defect R2). The `-12%` bottom margin above shrinks the root, and the 8%
       threshold is measured against that REDUCED root — so an element whose top
       lands in the bottom twelve per cent of the screen is plainly visible to
       the reader and, correctly, not intersecting enough for the observer to
       fire. It paints at zero opacity and stays there.

       ⚠ AND IT CAN STAY THERE FOREVER, which is what separates this from the
       marker-row observer below. That band can sit at the BOTTOM OF THE
       DOCUMENT, where there is no further scroll to perform, so the thing that
       would rescue it never happens. Measured on `/how-to-sample`: a five-step
       list at 751px in a 900px window, seven per cent inside against a threshold
       of eight. Six pixels.

       ⚠ MOVING THE TARGET DOES NOT FIX THIS, IT MOVES IT. Re-pointing the
       reveal at each step put step two at 850px with nothing inside at all.
       There is no threshold that is both "arriving" for a section below the fold
       and "arrived" for one already on screen, because those are two different
       questions and only one of them is about intersection.

       So the load-time question is asked against the REAL viewport, and the
       observer is left to do the only job it is good at: things genuinely below
       the fold. This predicate is deliberately the same one
       `scripts/verify-scroll-reveal.js` uses to decide an element is stuck —
       visible at all, and not yet opaque — so the fix and the check cannot
       disagree about what "in the first screen" means. */
    document.querySelectorAll<HTMLElement>('.f-rise').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 90}ms`
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('on')
        return
      }
      sections.observe(el)
    })

    // Marker rows. `--d` is the row's own offset into the cascade; the CSS adds
    // the within-row offsets (the ours band trails the lab band, the value
    // marker lands after both) on top of it, so the whole readout reads as one
    // instrument filling in rather than four unrelated animations.
    //
    // ⚠ THESE DELIBERATELY DO NOT GET R2's LOAD-TIME REVEAL, and the reason is
    // the rootMargin rather than the threshold. This observer has none, so its
    // root IS the viewport: a row the reader can fully see is 100% inside and
    // fires on the initial observation, and a row at the document's bottom edge
    // is fully on screen by definition. There is no unreachable band here, so a
    // partially-visible row at load is simply not "properly on screen" yet —
    // which is the 35% threshold doing its job, not failing to. Revealing those
    // eagerly would start the data drawing before the reader can see it, which
    // is the one thing this animation exists to prevent.
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
