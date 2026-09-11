import { ScrollReveal } from '@/components/marketing/ScrollReveal'

/**
 * THE `.js` GATE AND ITS OBSERVER, AS ONE COMPONENT.
 *
 * Extracted 2026-09-11 when the `/lp/*` rebuild needed the same pair. It lived
 * inline in `app/(marketing)/layout.tsx` and was the only copy; the `/lp` tree
 * has its own layout and had neither the script nor the observer, so a Direction
 * F landing page would have carried `.f-rise` elements that nothing ever
 * revealed. That failure is silent and in the SAFE direction (see below), which
 * is exactly why it would not have been noticed.
 *
 * Pasting the script into a second layout was the obvious move and is the defect
 * this repo keeps paying for: a duplicated fact is invisible while the copies
 * agree, and the 2.5s failsafe below is the kind of number that gets tuned in one
 * place and not the other. One component, two layouts.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * The notes below are carried verbatim from the marketing layout, because they
 * explain the three fallbacks and each of them is load-bearing.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * IT HAS TO BE INLINE AND SYNCHRONOUS. `.js .f-rise` is what hides a section
 * before it is revealed, so if the class arrived from a useEffect the reader
 * would see every section paint, then vanish, then fade back in. The class is
 * added during HTML parse instead, before any of `main` is parsed, so the hidden
 * state is the first state ever painted.
 *
 * IT IS ALSO THE NO-JS AND REDUCED-MOTION FALLBACK, BY OMISSION. Every rule that
 * hides anything is scoped under `.js`, so a reader with JavaScript off, an
 * ancient browser, or reduced motion turned on never gets the class and therefore
 * never gets the hiding: the page is simply complete and at rest. Fail-visible is
 * the only acceptable direction for a rule whose failure mode is a blank page.
 *
 * 🔴 The timer is the third fallback and the one that is easy to forget: if the
 * class is added and hydration then never happens (a chunk 404s, a client error
 * throws before the effect runs), nothing would ever add `.on` and the content
 * would stay invisible forever. `ScrollReveal` sets `__fRiseReady` as its first
 * act; if that has not happened within 2.5s we assume it never will and strip the
 * class, which restores the whole page instantly.
 */
export function RevealGate() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{" +
            "if(!('IntersectionObserver' in window))return;" +
            "if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;" +
            "var d=document.documentElement;d.classList.add('js');" +
            "setTimeout(function(){if(!window.__fRiseReady)d.classList.remove('js')},2500);" +
            "}catch(e){}})()",
        }}
      />
      <ScrollReveal />
    </>
  )
}
