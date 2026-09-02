'use client'

import { useEffect, useRef } from 'react'
import { FIELD_ROWS } from '@/lib/home/fieldRows'

/**
 * Layer 3 of the hero: the data field, ported from
 * `design/mockups/directions/F-field.html:905-1002`.
 *
 * Real range geometry from `04_products/results-engine/thresholds.md`, repeated
 * down the hero and abstracted until it reads as texture: no labels, no numbers,
 * nothing legible. Rows near the headline fade hard, so the type always clears
 * whatever drifts under it.
 *
 * 🔴 THE COMPLIANCE QUESTION IS OPEN AND IS RECORDED, NOT ANSWERED HERE. See the
 * header of `lib/home/fieldRows.ts`. Building it is safe on a branch that
 * deploys nothing; merging is what the gate governs.
 *
 * THREE DEPARTURES FROM THE DIRECTION'S SCRIPT, all deliberate:
 *
 * 1. **It stops when nobody is looking.** The direction runs its
 *    `requestAnimationFrame` loop for the life of the page. This one pauses when
 *    the hero scrolls out of view and when the tab is hidden. An unthrottled
 *    animation loop running all session is a real battery cost, and this is a
 *    decoration; the readout's draw-in earns its frames because it carries the
 *    argument, and this does not.
 * 2. **No `prefers-color-scheme` listener.** The direction re-reads its ink and
 *    redraws when the scheme changes. This app has no dark mode, so that would
 *    be a listener for a capability that does not exist, which is the exact
 *    criticism DESIGN.md already records against the film's ported dark
 *    treatment.
 * 3. **Reduced motion paints one frame and stops**, which the direction also
 *    does. Kept and asserted, because the failure mode is invisible: a loop that
 *    keeps running under reduced motion looks identical in a screenshot.
 *
 * ⚠ The pseudo-randomness is deterministic (`i*37 % 11`, and so on) so a
 * screenshot of this hero is repeatable. Do not replace it with `Math.random`:
 * every visual regression check on this page would start failing at random.
 */
export function HeroField() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el || typeof window === 'undefined') return
    if (!window.requestAnimationFrame) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext?.('2d')
    if (!ctx) return
    el.appendChild(canvas)

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let W = 0
    let H = 0
    let rows: { y: number; s: (typeof FIELD_ROWS)[number]; sp: number; ph: number; d: number }[] = []
    let ink: [number, number, number] = [10, 11, 13]
    let raf: number | null = null
    let visible = true

    function readInk() {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
      const m = /^#([0-9a-fA-F]{6})$/.exec(v)
      ink = m
        ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)]
        : [10, 11, 13]
    }

    function build() {
      if (!el) return false
      W = el.clientWidth
      H = el.clientHeight
      if (!W || !H) return false
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      readInk()
      // One row per 25px, clamped. Below the clamp the field reads as stripes;
      // above it, as noise.
      const n = Math.max(12, Math.min(34, Math.round(H / 25)))
      rows = []
      for (let i = 0; i < n; i++) {
        rows.push({
          y: (i + 0.5) * (H / n),
          s: FIELD_ROWS[i % FIELD_ROWS.length],
          sp: 0.5 + ((i * 37) % 11) / 9,
          ph: ((i * 53) % 97) / 97,
          d: 0.3 + ((i * 29) % 8) / 11,
        })
      }
      return true
    }

    function bar(x: number, w: number, y: number, h: number, a: number) {
      if (w <= 0 || a <= 0.002) return
      ctx!.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${a.toFixed(3)})`
      ctx!.fillRect(x, y - h / 2, w, h)
    }

    function frame(t: number) {
      ctx!.clearRect(0, 0, W, H)
      for (const r of rows) {
        const s = r.s
        // Rows near the headline's band fade to a twelfth of their weight, which
        // is what keeps dark ink on light legible over a moving texture.
        const near = 1 - Math.min(1, Math.abs(r.y - H * 0.54) / (H * 0.33))
        const fade = 1 - near * 0.88
        const drift = reduce ? 0 : (((t * 0.000018 * r.sp + r.ph) % 1) - 0.5) * W * 0.09
        const a = r.d * fade
        const h = 1 + r.d * 2.4
        bar(0, W, r.y, Math.max(1, h * 0.45), a * 0.09)
        bar((W * s.lab[0]) / 100 + drift, (W * s.lab[1]) / 100, r.y, h, a * 0.15)
        bar((W * s.ours[0]) / 100 + drift, (W * s.ours[1]) / 100, r.y, h, a * 0.32)
        bar((W * s.you) / 100 + drift - 1, 2, r.y, h * 2.8, a * 0.6)
      }
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame)
      else raf = null
    }

    function stop() {
      if (raf !== null) cancelAnimationFrame(raf)
      raf = null
    }

    function start() {
      stop()
      if (!build()) return
      if (reduce) frame(0)
      else raf = requestAnimationFrame(frame)
    }

    function resume() {
      if (reduce || raf !== null) return
      if (!visible || document.hidden) return
      raf = requestAnimationFrame(frame)
    }

    start()

    let rt: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(rt)
      rt = setTimeout(start, 150)
    }
    window.addEventListener('resize', onResize)

    const onVisibility = () => (document.hidden ? stop() : resume())
    document.addEventListener('visibilitychange', onVisibility)

    // Scrolled past the hero: there is nothing to animate for.
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              visible = entries[0]?.isIntersecting ?? true
              if (visible) resume()
              else stop()
            },
            { threshold: 0 },
          )
        : null
    io?.observe(el)

    return () => {
      stop()
      clearTimeout(rt)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      io?.disconnect()
      canvas.remove()
    }
  }, [])

  return <div className="f-field" ref={host} aria-hidden="true" />
}
