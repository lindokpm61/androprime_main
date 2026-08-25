import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

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
      <Nav variant="marketing" />
      <main id="main-content" className="pt-20">{children}</main>
      <Footer />
    </>
  )
}
