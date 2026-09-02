import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

// DELIBERATELY NOT host-aware, and deliberately not async.
//
// Reading headers() here would opt the ENTIRE marketing tree into dynamic
// rendering and lose the static prerender the whole site depends on (the
// homepage ships x-nextjs-prerender: 1 behind s-maxage=31536000). That is far
// too high a price for a nav detail.
//
// With no host passed, lib/hosts.ts treats the render as being on the apex,
// which is correct for every marketing page: the "Log in" link resolves
// absolutely to the app host, and marketing links stay relative.
//
// Accepted degradation: /order/confirmed and /subscription/confirmed are
// authenticated pages in this group and are served from the APP host, so their
// nav's marketing links render relative and take one middleware 307 back to the
// apex. Correct destination, one extra hop, on two low-traffic pages.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* THE `.js` GATE, AND IT HAS TO BE INLINE AND SYNCHRONOUS.

          `.js .f-rise` is what hides a section before it is revealed, so if
          the class arrived from a useEffect the reader would see every
          section paint, then vanish, then fade back in. The class is added
          during HTML parse instead, before any of `main` is parsed, so the
          hidden state is the first state ever painted.

          IT IS ALSO THE NO-JS AND REDUCED-MOTION FALLBACK, by omission.
          Every rule that hides anything is scoped under `.js`, so a reader
          with JavaScript off, an ancient browser, or reduced motion turned
          on never gets the class and therefore never gets the hiding: the
          page is simply complete and at rest. Fail-visible is the only
          acceptable direction for a rule whose failure mode is a blank page.

          🔴 The timer is the third fallback and the one that is easy to
          forget: if the class is added and hydration then never happens (a
          chunk 404s, a client error throws before the effect runs), nothing
          would ever add `.on` and the content would stay invisible forever.
          ScrollReveal sets `__fRiseReady` as its first act; if that has not
          happened within 2.5s we assume it never will and strip the class,
          which restores the whole page instantly. */}
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
      <Nav variant="marketing" />
      {/* Clears the fixed nav. Direction F's nav is a floating shell, not a
          full-width bar: 14px top gutter + 62px shell + breathing room, against
          V2.0's flush 80px. Raised at 800px to match .f-nav's own gutter step in
          f-primitives.css. */}
      <main id="main-content" className="pt-[92px] md:pt-[104px]">{children}</main>
      <Footer />
    </>
  )
}
