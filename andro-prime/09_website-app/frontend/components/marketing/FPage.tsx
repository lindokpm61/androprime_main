import React from 'react'
import { HeroField } from '@/components/marketing/HeroField'
import { SectionRule } from '@/components/marketing/SectionRule'

/**
 * THE DIRECTION F PAGE SCAFFOLD.
 *
 * Added 2026-09-08 as option C of the Thread 2 menu. Four components that carry
 * the assembly a Direction F page is made of, so a new page COMPOSES the system
 * instead of copy-pasting class strings out of whichever existing page happened
 * to be open.
 *
 * WHY. Before this file the hero assembly was hand-copied across seven files and
 * had already drifted into three different shapes that nobody had noticed,
 * because a copied class string carries no evidence of what it was copied from:
 *
 *   `/kits`                      f-wrap f-sec              (no f-sec-hero at all)
 *   /membership /how-it-works    f-wrap f-sec f-sec-hero   (the intended one)
 *   the three kit pages          f-wrap f-sec-hero         (no f-sec)
 *
 * `.f-sec-hero` exists because at 390 the cookie banner covered 78% of the
 * "Order the kit" button; `/kits` never got it. The three kit pages dropped
 * `.f-sec` instead, which is what made `.f-sec-hero` look like a modifier of
 * `.f-sec` when it is worn both ways. That is the mistake that cost those three
 * heroes their entire padding on 2026-09-08, when the specificity checker's
 * standard fix was applied to it. Both of those are copy-paste drift, and
 * neither is visible in a diff of the page that drifted.
 *
 * The same had already happened to the section counter. `SectionRule` takes
 * `n` and `of`, both hand-counted; two pages had hoisted `of` to a `SECTIONS`
 * constant with a comment explaining the hazard, and five had not. `FPage` now
 * counts its own sections, so `of` cannot be wrong and the constant is not
 * needed.
 *
 * WHAT IS AND IS NOT HERE. These carry the ASSEMBLY: the wrappers, the ground,
 * the rhythm, the counter. They carry no content and make no editorial choice, so
 * a page still writes its own headline, its own aside, its own close. The one
 * page that does not use `FHero` is `/`, whose hero is a film rather than the
 * shared field; it is one page and one assembly, so it stays hand-written rather
 * than growing a third `ground` value that only ever has one caller.
 *
 * ENFORCED BY `scripts/verify-f-scaffold.js`, which fails the build if a page
 * hand-writes an assembly these components own.
 */

/* ---------------------------------------------------------------- FSection */

type FSectionProps = {
  /** Optional, because a section is allowed to be nothing but its counter. `/`
   *  does this four times: the rule marks the boundary and the content that
   *  follows sits in a sibling `.f-wrap`, outside the rhythm's padding. */
  children?: React.ReactNode
  /** Set false for a section that carries no counter, such as a close or a coda.
   *  It is then excluded from the total as well, so the numbering stays honest. */
  rule?: boolean
  /** `.f-sec-cont`: this boundary is a continuation, not a topic change. */
  cont?: boolean
  id?: string
  style?: React.CSSProperties
  className?: string
  /** Injected by FPage. Never pass these by hand: that is the bug this exists
   *  to remove, and verify-f-scaffold.js rejects it. */
  n?: number
  of?: number
}

export function FSection({ children, rule = true, cont, id, style, className, n, of }: FSectionProps) {
  const cls = ['f-wrap', 'f-sec', cont ? 'f-sec-cont' : '', className || ''].filter(Boolean).join(' ')
  return (
    <section className={cls} id={id} style={style}>
      {rule && n !== undefined && of !== undefined ? <SectionRule n={n} of={of} /> : null}
      {children}
    </section>
  )
}
FSection.displayName = 'FSection'

/* ------------------------------------------------------------------- FHero */

type FHeroProps = {
  children: React.ReactNode
  /**
   * 'field' is the shared measurement ground: the same `HeroField` as `/` and
   * `/kits`, full-bleed inside `.f-ruleground`. It sits OUTSIDE `.f-wrap`
   * because constraining a ground to the 1180px measure draws a box with two
   * hard edges, and only the `<section>` is lifted to z-index 2, which is why
   * the hero must be a `<section>`: `.f-field` sets its own absolute position
   * and the stylesheet rule is `.f-ruleground > section`.
   * 'none' is a hero with no ground, which is what `/authors/[slug]` has.
   */
  ground?: 'field' | 'none'
  /** The right-hand column. Present means the two-column `.f-herogrid`; absent
   *  means a single `.f-rise` block, which is what `/blog` has. */
  aside?: React.ReactNode
  /** Overrides the direction's 72/130 hero padding on BOTH breakpoints. The
   *  three kit pages take 62. Left alone, a new page gets the direction's. */
  heroPad?: number
  /** Overrides the rhythm's `--f-sec-below`. The three kit pages take 44. */
  padBottom?: number
  style?: React.CSSProperties
}

export function FHero({ children, ground = 'field', aside, heroPad, padBottom, style }: FHeroProps) {
  // `.f-sec` AND `.f-sec-hero`, always. `.f-sec-hero` is what gives the hero
  // back to the reader while the consent banner is up; `.f-sec` is what supplies
  // the rhythm underneath it. Wearing one without the other is the drift this
  // component exists to end, and since `.f-sec-hero.f-sec-hero` out-specifies
  // `.f-sec` there is no cost to wearing both.
  const heroStyle: React.CSSProperties = { ...style }
  if (heroPad !== undefined) {
    ;(heroStyle as Record<string, string>)['--f-hero-pt'] = `${heroPad}px`
    ;(heroStyle as Record<string, string>)['--f-hero-pt-lg'] = `${heroPad}px`
  }
  if (padBottom !== undefined) heroStyle.paddingBottom = padBottom

  const section = (
    <section className="f-wrap f-sec f-sec-hero" style={Object.keys(heroStyle).length ? heroStyle : undefined}>
      {aside === undefined ? (
        <div className="f-rise">{children}</div>
      ) : (
        // `.f-herogrid`, not a raw Tailwind grid: the same 1.35fr/1fr pair, but
        // Tailwind's `lg` turns at 1024px and this turns at 980, deliberately, so
        // the readout column keeps ~417px. Two nested `.f-rise` elements stagger
        // against each other.
        <div className="f-herogrid f-rise">
          <div>{children}</div>
          {aside}
        </div>
      )}
    </section>
  )

  if (ground === 'none') return section
  return (
    <div className="f-ruleground">
      <HeroField />
      {section}
    </div>
  )
}
FHero.displayName = 'FHero'

/* ------------------------------------------------------------------ FClose */

type FCloseProps = {
  children: React.ReactNode
  id?: string
  /** A close that sits inside its own section rather than standing alone drops
   *  the wrap, because the section already supplies it. `/how-it-works`,
   *  `/membership` and `/blog` close this way. */
  inSection?: boolean
  style?: React.CSSProperties
}

/**
 * 🔴 AN IN-SECTION CLOSE ALWAYS TAKES THE REVEAL, AND THERE IS NO PROP TO TURN
 * IT OFF. Ruled by Keith on 2026-09-08. Three of the five had `.f-rise` and two
 * did not: `/kits` and the article layout. Nobody had chosen that, it was an
 * absent class in a copied string, which is invisible in a diff and impossible
 * to grep for. Collecting the assembly here made it visible, briefly as a
 * `reveal={false}` prop, and the ruling removed the prop rather than the two
 * exceptions. A page cannot now opt out of the reveal by forgetting a class.
 */
export function FClose({ children, id, inSection, style }: FCloseProps) {
  const cls = inSection ? 'f-close f-rise' : 'f-wrap f-close'
  return (
    <div className={cls} id={id} style={style}>
      {children}
    </div>
  )
}
FClose.displayName = 'FClose'

/* ------------------------------------------------------------------- FPage */

/**
 * Walks its own children and numbers every `FSection` that carries a rule, so
 * `of` is the count rather than a literal somebody has to remember to update.
 * One level of fragments is flattened, because a page that groups sections in a
 * `<>...</>` is still a page with those sections in it.
 */
function countAndNumber(children: React.ReactNode) {
  const flat: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      React.Children.forEach((child.props as { children?: React.ReactNode }).children, (g) => flat.push(g))
    } else {
      flat.push(child)
    }
  })

  const isRuled = (c: React.ReactNode) =>
    React.isValidElement(c) && c.type === FSection && (c.props as FSectionProps).rule !== false

  const total = flat.filter(isRuled).length

  let seen = 0
  return flat.map((child, i) => {
    if (!isRuled(child)) return child
    seen++
    return React.cloneElement(child as React.ReactElement<FSectionProps>, { n: seen, of: total, key: i })
  })
}

export function FPage({ children }: { children: React.ReactNode }) {
  return <div className="f-page">{countAndNumber(children)}</div>
}
FPage.displayName = 'FPage'
