/*
 * `sizes` FOR EVERY PHOTOGRAPH THAT SITS IN A MARKETING GRID.
 * Added 2026-09-06, from the 2026-09-03 critique of `/` and `/kits`.
 *
 * WHAT WAS WRONG. `next/image` with no `sizes` prop pins one width for every
 * viewport. For `width={800}` it emits a two-candidate srcset of 828w and
 * 1920w with `x` descriptors, so a DPR-1 browser downloads 828px into whatever
 * slot it finds. The narrow kit cards on `/` render at 272px, so they took an
 * image roughly three times the size they draw, and at a 390px viewport every
 * photograph on the site was oversized by 2.4x. `sizes` replaces the `x`
 * descriptors with a `w` set the browser chooses from, which is the whole
 * point of the component.
 *
 * THE ARITHMETIC, so these are checkable rather than tuned by eye. `.f-wrap`
 * is `max-width: 1180px` with 20px padding each side, so the content box is
 * `min(100vw, 1180px) - 40px`, capped at 1140px from 1220px up.
 *
 *   .f-bento at >=900px: 12 columns, 18px gap.
 *     one column = (1140 - 11*18) / 12 = 78.5px
 *     span 3     = 3*78.5 + 2*18 = 272px
 *     span 5     = 5*78.5 + 4*18 = 465px
 *     span 6     = 6*78.5 + 5*18 = 561px
 *   .f-kgrid at >=900px: 3 equal columns, 18px gap.
 *     (1140 - 2*18) / 3 = 368px
 *
 * Between 900px and 1220px the container tracks the viewport, so each slot is
 * quoted as the vw fraction it approaches, ROUNDED UP. The asymmetry matters:
 * a `sizes` that understates a slot ships a blurry photograph, one that
 * overstates it only spends bytes. Below 900px both grids collapse to one
 * column and the slot is the whole content box.
 *
 * ⚠ These numbers are a copy of the grid, and nothing will tell you when they
 * drift. If `.f-bento`, `.f-kgrid` or `.f-wrap` change in
 * `styles/components/f-primitives.css`, they change here in the same edit.
 */

/** Below 900px every grid here is one column, so the slot is the content box. */
const ONE_COLUMN = 'calc(100vw - 40px)'

/** `.f-bento > .f-c-3`: the two narrow kit cards on `/`. */
export const SIZES_BENTO_3 = `(min-width: 1220px) 272px, (min-width: 900px) 24vw, ${ONE_COLUMN}`

/** `.f-bento > .f-c-5`: the plate photographs on `/` and on the three kit pages. */
export const SIZES_BENTO_5 = `(min-width: 1220px) 465px, (min-width: 900px) 41vw, ${ONE_COLUMN}`

/** `.f-bento > .f-c-6`: the free-layer plates and the lead kit card on `/`. */
export const SIZES_BENTO_6 = `(min-width: 1220px) 561px, (min-width: 900px) 49vw, ${ONE_COLUMN}`

/** `.f-kgrid`: the three kit cards on `/kits`. */
export const SIZES_KGRID = `(min-width: 1220px) 368px, (min-width: 900px) 32vw, ${ONE_COLUMN}`

/**
 * `.f-herogrid`: the right-hand column of a hero, where four of the five other F
 * heroes put the sample readout and `/how-it-works` puts its photograph.
 *
 * ⚠ THIS ONE TURNS AT 980px, NOT 900px, and it is the reason it cannot reuse
 * `SIZES_BENTO_5` even though the two land within a pixel of each other above
 * 1220px. `.f-herogrid` is `1.35fr 1fr` with a 44px gap from 980px up, so the
 * column is `(1140 - 44) / 2.35 = 466px`; between 900 and 980 the grid is still
 * ONE column, and quoting 41vw across that band would understate the slot by
 * more than half and ship a visibly soft photograph. The 980 is deliberate and
 * is argued on the rule itself in `f-primitives.css`.
 */
export const SIZES_HEROGRID = `(min-width: 1220px) 466px, (min-width: 980px) 43vw, ${ONE_COLUMN}`
