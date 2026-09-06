import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import '@/styles/components/dashboard-panels.css'
import '@/styles/pages/results-dashboard.css'
import '@/styles/pages/app-shell.css'

/*
 * ITS OWN ROUTE GROUP, AND THE REASON IS ONE LINE OF ANOTHER FILE.
 *
 * `app/(app)/layout.tsx` opens with `await requireAuthenticatedUser()`, so
 * anything under that group is gated by construction. The demo renders the same
 * dashboard to somebody who has not bought anything and has no account, so it
 * cannot live there, and putting it under `(marketing)` would pull in the
 * scroll-reveal machinery and the `.f-rise` gate for a page with no `.f-rise`
 * elements on it.
 *
 * A third group is the honest description: marketing chrome, app content, no
 * session. The two dashboard stylesheets are imported here because `(app)`'s
 * layout is the only other place they load and this tree never passes through
 * it.
 *
 * THE NAV IS THE MARKETING ONE, deliberately. A visitor here is not logged in
 * and the useful next step is the kits page, not a logout link. Its clearance
 * (92px, 104px above 800) also sits within a few pixels of the `sticky top-20`
 * the dashboard sidebar was written against under the app nav, so the sidebar
 * behaves the same on both surfaces.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav variant="marketing" />
      <main id="main-content" className="pt-[92px] md:pt-[104px]">{children}</main>
      <Footer />
    </>
  )
}
