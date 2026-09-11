/**
 * WHAT THE STICKY NAV CTA SAYS ON A LANDING PAGE, AND WHERE IT SCROLLS TO.
 *
 * Added 2026-09-11 with the `/lp/*` Direction F rebuild, to fix a defect that
 * was live on `main`.
 *
 * 🔴 THE TWO SUPPLEMENT LANDING PAGES SHIPPED AN "ORDER NOW" BUTTON THAT WENT
 * NOWHERE, ON PAGES THAT CANNOT TAKE ORDERS. `app/lp/layout.tsx` renders
 * `<Nav variant="lp" />` with no props, and `Nav` defaults the LP call to action
 * to `Order Now` pointing at `#order`. The three KIT landing pages each carry an
 * `id="order"` section, so it worked there and nobody looked further. Neither
 * `/lp/collagen` nor `/lp/daily-stack` has that anchor — their conversion block
 * is `id="join"` — so on both pages the button did nothing at all. Worse than the
 * dead link is the label: `01_strategy/2026-05-23-phase0-supplements-deferred-
 * plan.md` deferred supplements, the live Stripe price IDs are deliberately
 * unset, and two of those pages' own FAQ answers read *"We are not taking
 * supplement orders or payments at this time."* An "Order Now" button above that
 * sentence is the page contradicting itself in the one element a cold reader
 * looks at first.
 *
 * WHY A MAP AND NOT A PROP. The props exist (`lpCtaText`, `lpCtaHref`) and
 * nothing has ever passed them, which is the shape of a mechanism that will be
 * forgotten again. The nav is rendered by the LP LAYOUT, and a layout cannot read
 * the pathname without opting the whole tree into dynamic rendering, so the page
 * that knows the answer is not the component that needs it. `Nav` is already a
 * client component, so `usePathname()` costs nothing, and the lookup lives here
 * beside the `/lp` concept rather than inside the nav. The props stay: an
 * explicit one still wins, which is what a future one-off LP will want.
 *
 * ⚠ THE DEFAULT IS THE SELLING CASE, DELIBERATELY. A new `/lp/*` route is far
 * more likely to be a kit than a waitlist, and a wrong label on a page that CAN
 * take orders is a marketing error, where the reverse is a compliance one. Add a
 * route here when it does not sell.
 */

export type LpCta = { text: string; href: string }

/** Routes whose conversion is a waitlist opt-in, not a purchase. */
const WAITLIST_ROUTES: Record<string, LpCta> = {
  '/lp/daily-stack': { text: 'Join the waitlist', href: '#join' },
  '/lp/collagen': { text: 'Join the waitlist', href: '#join' },
}

const DEFAULT_CTA: LpCta = { text: 'Order Now', href: '#order' }

export function lpCtaFor(pathname: string | null | undefined): LpCta {
  if (!pathname) return DEFAULT_CTA
  return WAITLIST_ROUTES[pathname.replace(/\/+$/, '')] ?? DEFAULT_CTA
}
