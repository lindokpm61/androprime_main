/**
 * THE AUTH TREE'S DIRECTION F ROOT, added 2026-09-08 with the auth rebuild.
 *
 * WHY IT EXISTS AT ALL, and it is not a styling nicety. `globals.css` sets
 * `p, li, blockquote { @apply font-serif }` for V2.0, where body copy is
 * Merriweather. `.f-page` is what turns that off: it sets the sans family, the
 * paper ground, the ink colour, and `font-size-adjust: 0.53`, the optical-size
 * compensation every font-size in `f-primitives.css` was calibrated against.
 * Without it an F surface renders in a serif the direction does not use, at
 * about 8% under the size it was drawn at, and NOTHING errors: not tsc, not the
 * build, not the class checker. DESIGN.md records that it is caught by
 * screenshot and by nothing else.
 *
 * ONE ROOT, NOT FIVE. All five auth routes need it, so it goes in a layout
 * rather than being repeated in `AuthCard` and `consent/page.tsx` and forgotten
 * by the sixth route somebody adds. The two route handlers in this tree
 * (`callback`, `logout`, `post-checkout`) are unaffected: a layout wraps page
 * renders, not `route.ts`.
 *
 * WHY `.f-page` BY HAND HERE AND NOT `<FPage>`. They are different things and the
 * names hide it. `FPage` is the marketing PAGE ASSEMBLY: a hero, counted
 * sections, a rhythm, a close. An auth route is one centred card with none of
 * those, so composing `FPage` would mean an `of={0}` section counter and a hero
 * slot nothing fills. `.f-page` is just the type ramp's root. `verify-f-scaffold`
 * scopes itself to `app/(marketing)` and `components/marketing` for exactly this
 * reason, and its header note is updated to say so rather than leaving auth
 * looking like an oversight.
 *
 * NO NAV AND NO FOOTER, deliberately. Frame X draws the card on a bare ground.
 * The marketing chrome would put a "Choose your test" CTA and a full footer
 * around a password field, and the cross-links at the bottom of the card already
 * carry the one route out ("Back to site").
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="f-page">{children}</div>
}
