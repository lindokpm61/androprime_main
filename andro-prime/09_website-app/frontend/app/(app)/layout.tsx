import { Nav } from '@/components/shared/Nav'
import { RevealGate } from '@/components/marketing/RevealGate'
import { requireAuthenticatedUser } from '@/lib/auth/session'
import { getCurrentHost } from '@/lib/hosts-server'
import { isMembershipEnabled, isAccountDataControlsEnabled } from '@/lib/flags'
/*
 * V2.0 page stylesheets still needed by this tree, and the list is now SHORTER
 * by two (2026-09-11, batch 3).
 *
 * `subscriptions.css` and `founding-member-status.css` are DELETED, not merely
 * unimported: `/subscriptions` was rebuilt and its nine classes have no other
 * caller, and the founding-member sheet was being kept alive entirely by
 * `/supplement-waitlist-status`, which had borrowed the class names of a page
 * that was retired on 2026-07-22 and is now an eleven-line redirect. A borrowed
 * class name is invisible until somebody deletes the page it was named after.
 *
 * `account.css` and `results-dashboard.css` FOLLOWED THEM on 2026-09-11, once the
 * results-ready view was rebuilt: nothing renders a class from either any more.
 * `results-dashboard.css` was also imported by `app/(demo)/layout.tsx`, which
 * renders none of its classes either, so that import went with it.
 *
 * The two that remain are held open by components this batch did not reach:
 * `membership.css` by three `components/membership/*` pieces, and
 * `dashboard-panels.css` by `DevFixtureBar` (dev-only) plus the
 * `status-indicator--*` set.
 */
import '@/styles/components/dashboard-panels.css'
import '@/styles/pages/membership.css'

/**
 * THE AUTHENTICATED APP'S DIRECTION F ROOT, rebuilt 2026-09-11 (batch 3).
 *
 * 🔴 `.f-page` IS THE WHOLE REASON THIS DIFF IS NOT COSMETIC. `globals.css` sets
 * `p, li, blockquote { @apply font-serif }` for V2.0, and `.f-page` is what
 * turns that off: it sets the sans family, the paper ground, the ink colour, and
 * the `font-size-adjust: 0.53` that every font-size in `f-primitives.css` was
 * calibrated against. Without it an F surface renders in a serif the direction
 * does not use, at about 8% under the size it was drawn at, and NOTHING errors:
 * not tsc, not the build, not the class checker. `app/auth/layout.tsx` carries
 * the same note and the same one-line root for the same reason.
 *
 * WHY `.f-page` BY HAND AND NOT `<FPage>`. They are different things and the
 * names hide it. `FPage` is the marketing PAGE ASSEMBLY: a hero, counted
 * sections, a rhythm, a close. An app route is a status strip, a fixed
 * explanatory sidebar and a column of trays, with no hero and no section
 * counter, so composing `FPage` would mean an `of={0}` counter and a hero slot
 * nothing fills. `verify-f-scaffold.js` scopes itself to `app/(marketing)`,
 * `app/lp` and `components/marketing` and its header already names the auth
 * tree as the precedent for exactly this.
 *
 * 🔴 THREE DEFECTS FIXED HERE, AND ALL THREE WERE LIVE.
 *
 *   1. `<main>` CARRIED `pt-20`. That is V2.0's 80px flush-bar clearance, under
 *      a nav that has been a floating shell for weeks: 14px top gutter + 62px
 *      shell + breathing room. Every one of the six authenticated routes has
 *      been rendering its first element under the nav. This is the same defect
 *      the `/lp` rebuild found on 2026-09-11, in the third layout to carry it,
 *      which is what a number copied between files does.
 *   2. THE TREE HAD NO `.js` REVEAL GATE. It is not in the marketing layout's
 *      subtree and nothing supplied one here, so every `.f-rise` a Direction F
 *      page carries would have had nothing to reveal it. It fails in the SAFE
 *      direction (the page renders complete and at rest), which is exactly why
 *      it would never have been noticed. Shared as `RevealGate` rather than
 *      pasted, which is the same call the `/lp` layout got.
 *   3. NO FOOTER AT ALL. All six routes ended with the page and nothing under
 *      it. See the footer note below.
 *
 * ⚠ `min-h` MOVED OFF `5rem`. It was `calc(100vh-5rem)`, the same stale 80px as
 * the padding, so a short page left a strip of unpainted ground under it. It now
 * reads the clearance from the same custom property the padding uses, so the two
 * cannot drift the way the literal did.
 */

/*
 * THE FOOTER IS NET-NEW AND IS A PROPOSAL KEITH KEPT (2026-08-29), not a redraw
 * of a live surface: there was no footer here to redraw. Frame C draws five
 * items and only three of them ship.
 *
 * 🔴 "HOW WE SET OUR RANGES" AND "WHAT WE DO NOT TEST" ARE NOT BUILT. Both are
 * new PAGES that exist nowhere in the codebase, and the frame's own note says
 * so. Shipping the links before the pages is how a footer of dead ends happens,
 * so they are owed to Keith as scope rather than invented here. The second is
 * the more valuable of the two and is a positioning asset rather than a chore:
 * it is the only place in the journey where the product would state its own
 * limits unprompted, which is the move the CA-026 conflict-free set is built on.
 *
 * 🔴 THE TWO LINKS THAT DO SHIP ARE GATED ON THE FLAG THAT DECIDES WHETHER
 * THEIR TARGET EXISTS. Both resolve to the Data and privacy section of
 * `/account`, which is dark behind `ACCOUNT_DATA_CONTROLS_ENABLED`. Rendering
 * them unconditionally would put two links to an anchor that is not on the page
 * into the footer of every signed-in screen, which is the defect the `/lp`
 * rebuild found in the nav's "Order Now" and the buy rebuild found in a check
 * following a redirect into nothing. Same shape, third time, so it is gated.
 *
 * 🔴 "REQUEST ERASURE", NOT "DELETE MY RESULTS", and the difference is a claim.
 * The control behind it records an erasure REQUEST and does not delete; CA-024's
 * approved wording is deliberately "Request that we erase your account data. We
 * will action your request within 30 days." A link reading "Delete my results"
 * on a page of special-category data states an immediacy the approved copy is
 * careful not to state. This is a claim reduction back onto approved language,
 * which needs no fresh sign-off on the CA-001 / CA-003 precedent.
 */
function AppFoot({ dataControls }: { dataControls: boolean }) {
  return (
    <footer className="f-appfoot">
      <div className="f-appfoot-in">
        {dataControls && (
          <>
            <a href="/account#data-privacy">Your data</a>
            <a href="/account#data-privacy">Request erasure</a>
          </>
        )}
        <a href="mailto:support@andro-prime.com">Contact support</a>
        <span className="f-appfoot-note">This is not a diagnosis</span>
      </div>
    </footer>
  )
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuthenticatedUser()
  const currentHost = await getCurrentHost()

  return (
    <div className="f-page">
      {/* The `.js` gate and the reveal observer, shared with the marketing and
          `/lp` layouts. Its three fallbacks are documented in the component. */}
      <RevealGate />
      {/*
        The flag is read HERE, in a server component, and passed down. The nav is
        a client component and cannot read a server-only env var; making the flag
        NEXT_PUBLIC_ to reach it would inline it into the browser bundle at build
        time and break the "live env read, no rebuild" contract every other flag
        in lib/flags.ts holds to.
      */}
      <Nav variant="app" currentHost={currentHost} membershipEnabled={isMembershipEnabled()} />
      {/* Clears the fixed nav. Direction F's nav is a floating shell, not a
          full-width bar: 14px top gutter + 62px shell + breathing room, against
          V2.0's flush 80px. Raised at 800px to match `.f-nav`'s own gutter step
          in f-primitives.css, and held in a custom property so the min-height
          below reads the same number rather than repeating it. */}
      <main
        id="main-content"
        className="pt-[92px] md:pt-[104px] min-h-[calc(100vh-var(--f-appnav))]"
        style={{ ['--f-appnav' as string]: '92px' }}
      >
        {children}
      </main>
      <AppFoot dataControls={isAccountDataControlsEnabled()} />
    </div>
  )
}
