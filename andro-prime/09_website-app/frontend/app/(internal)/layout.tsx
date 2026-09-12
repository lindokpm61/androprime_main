import '@/styles/components/f-internal.css'

/**
 * THE INTERNAL TOOLS ROOT, added 2026-09-12.
 *
 * Two routes live under it, `/admin/dashboard` and `/ops/content`. The route
 * group changes no URL: `(internal)` is parentheses, so the paths are exactly
 * what they were.
 *
 * 🔴 `.f-page` IS WHY THIS FILE EXISTS AT ALL, and it is the same reason the
 * auth tree and the app tree each have a one-line root. `globals.css` sets
 * `p, li, blockquote { @apply font-serif }` for V2.0, and `.f-page` is what
 * turns that off: it sets the sans family, the paper ground, the ink colour and
 * the `font-size-adjust: 0.53` that every size in the F stylesheets was
 * calibrated against. Without it an F surface renders in a serif the direction
 * does not use, at about 8% under the size it was drawn at, and NOTHING errors.
 * Both pages previously set `fontFamily` by hand, to two different stacks
 * ("Inter, system-ui" and "ui-sans-serif, system-ui"), neither of which is a
 * brand face.
 *
 * ⚠ NO NAV AND NO FOOTER, deliberately. The signed-in tree's `Nav variant="app"`
 * carries a customer's links (results, account, membership) and its footer ends
 * with "This is not a diagnosis", which is a sentence for a man reading his own
 * blood test and nonsense over a content board. The internal strip each page
 * renders is the whole chrome, and it says which tool you are in and how fresh
 * its data is, which is the only orientation either page needs.
 *
 * ⚠ NO REVEAL GATE, also deliberately. `.f-rise` reveals a section as the reader
 * arrives at it, which is a reading device. Nothing here is read; it is scanned
 * for the one number that is wrong, and animating a board on load would delay
 * exactly that.
 *
 * 🔴 THE AUTH GATE IS NOT HERE, AND MUST NOT MOVE HERE. Both pages check
 * `getCurrentUser()` and `isAdmin()` themselves and redirect. A layout is not a
 * security boundary in Next: it does not re-run on every client navigation and a
 * route handler underneath it never runs it at all. Neither route is in the
 * middleware matcher either, so the in-page check is the ONLY gate, and putting
 * a second copy in a layout would make it look like belt and braces while
 * quietly moving the belt somewhere it does not hold.
 */
export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="f-page f-int">
      <main id="main-content">{children}</main>
    </div>
  )
}
