// Shared single-vs-bundle CTA choice, rendered on all three kit detail pages when
// isBundlesEnabled() is true (checked server-side by the calling page; this
// component itself does not read the flag). Server-renderable: it composes two
// KitCheckoutButton client components but holds no state of its own, so a page
// can render it directly without its own 'use client' boundary.
//
// ─────────────────────────────────────────────────────────────────────────────
// REBUILT IN DIRECTION F, 2026-09-14 (defect register C1).
// ─────────────────────────────────────────────────────────────────────────────
//
// It carried 41 V2.0 tokens and ZERO F classes — the highest count of any file
// in the tree — while rendering inside an `FClose` on three Direction F pages,
// on the money path. `route-conformance.md` scored all three routes finished,
// because it counts the `f-` classes a ROUTE renders and nothing in the check
// family has a component as its unit. That gap is C4, and the check that closes
// it (`verify-retired-vocabulary.js`) would have failed on this file every day
// it stood.
//
// NOT ONE WORD CHANGED. Every string on screen is a prop, and every default in
// this file is the string that shipped: the ribbon, the badge, the bundle title,
// the savings note, both CTA labels and "Just this test. One sample, one
// result." The three call sites pass the same values they passed yesterday. The
// pricing arithmetic is unchanged because there is none — every figure is
// passed in.
//
// 🔴 THE BUNDLE HALF IS NO LONGER INK, AND THAT IS A DESIGN RULING RATHER THAN
// A PREFERENCE. The V2.0 card filled it `bg-black text-white`. DESIGN.md budgets
// the inverted panel at ONE PER PAGE ("a second one silently costs the first its
// weight"), and all three kit detail pages have already spent theirs on the
// GP-conversation block — the page's conformity statement, and the one element
// on it that must not lose weight to a price card. The emphasis moves to the
// accent ring `.f-tray-flag`, which is what `/kits` uses to mark Kit 3 and what
// the frame chose there in place of an inverted card, because inverting "asked
// the page to change colour scheme mid-scroll". Reasoning in full in
// f-primitives.css, "THE BUNDLE CHOICE".
//
// ⚠ THE COMPLIANCE NOTES BELOW ARE UNCHANGED AND STILL GOVERN. Nothing in this
// rebuild touches the Recheck mechanic's wording or the savings comparison
// basis, both of which were cleared and are reproduced through props.

import { KitCheckoutButton } from './KitCheckoutButton'

type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'
type BundleType = 'confirmation' | 'prove_it' | 'full_picture'

export interface BundleChoiceProps {
  kitType: KitType
  kitLabel: string
  singlePrice: number
  bundleType: BundleType
  bundleName: string
  bundlePrice: number
  basePortion: number
  retestPortion: number
  retestLabel: string
  savings: number
  // Compliance pre-flight run 2026-07-26 (0 HARD). Ewa approved the Recheck
  // mechanic as a WELLNESS recheck (not "confirmatory testosterone testing").
  // The "Recheck Bundle" name is the mechanism of that ruling (Keith relay).
  // Retest framing must still read as "see how your numbers moved", never
  // treatment efficacy or a diagnosis promise. See 03_compliance/CONTEXT.md.
  mechanic: string
  // Optional label overrides. Defaults present the offer as a two-kit "bundle"
  // (Kit 1 Confirmation, Kit 2 Prove-It). Kit 3 overrides these to a "retest
  // add-on" framing, because Kit 3 is ALREADY sold on its page as a bundle of two
  // kits, so a second "bundle" collides. Keith decision 2026-07-24. All override
  // copy cleared in the 2026-07-26 pre-flight (0 HARD) + Ewa wellness-recheck sign-off.
  ribbonLabel?: string
  badgeLabel?: string
  bundleTitle?: string
  savingsNote?: string
  ctaLabel?: string
}

export function BundleChoice({
  kitType,
  kitLabel,
  singlePrice,
  bundleType,
  bundleName,
  bundlePrice,
  basePortion,
  retestPortion,
  retestLabel,
  savings,
  mechanic,
  ribbonLabel,
  badgeLabel,
  bundleTitle,
  savingsNote,
  ctaLabel,
}: BundleChoiceProps) {
  // Defaults preserve the two-kit "bundle" framing (Kit 1 / Kit 2). Kit 3 passes
  // overrides for the "retest add-on" framing.
  const ribbon = ribbonLabel ?? 'Two kits, one order'
  const badge = badgeLabel ?? 'Best value'
  const title = bundleTitle ?? `${bundleName} Bundle`
  const savingsText = savingsNote ?? `£${savings} saving vs buying both tests separately`
  const cta = ctaLabel ?? `Order the Bundle: £${bundlePrice}`
  return (
    /* `alignItems: 'stretch'` against `.f-splitgrid`'s own `start`. That default
       is right for two independent blocks of prose, and wrong here: these are
       two prices being compared, and left at `start` the single-kit card ended
       510px shorter than the bundle, so its "Order the Kit" pill sat level with
       the bundle's PRICE rather than with the bundle's button. Measured in the
       rendered page, not reasoned about. Stretching the trays makes the two
       cards one height, and the `flexGrow` on each card's last paragraph is
       what then drops both CTAs onto the same line. */
    <div className="f-splitgrid" style={{ alignItems: 'stretch' }}>
      {/* SINGLE KIT (unchanged path: the existing kit at its existing price).
          The ghost CTA, not the filled one: two filled pills side by side would
          make the choice by weight rather than by the ring, and `.f-btn-ghost`
          is the same size and hit area by construction. */}
      <div className="f-tray">
        <div className="f-core" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <span className="f-kchip" style={{ alignSelf: 'flex-start' }}>One-off test</span>
          <h3 className="f-h4" style={{ marginTop: 14 }}>{kitLabel}</h3>
          <span className="f-price">&pound;{singlePrice}</span>
          <p className="f-sub" style={{ marginTop: 14, flexGrow: 1 }}>
            Just this test. One sample, one result.
          </p>
          <KitCheckoutButton
            kitType={kitType}
            className="f-btn f-btn-ghost f-btn-block"
          >
            Order the Kit: &pound;{singlePrice}
          </KitCheckoutButton>
        </div>
      </div>

      {/* BUNDLE. The ring marks it; the ground does not change. */}
      <div className="f-tray f-tray-flag">
        <div className="f-core" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span className="f-flagchip">{badge}</span>
            <span className="f-kchip">{ribbon}</span>
          </div>
          <p className="f-blab" style={{ marginTop: 16, marginBottom: 6 }}>{bundleName}</p>
          <h3 className="f-h4">{title}</h3>
          <span className="f-price">&pound;{bundlePrice}</span>

          <div style={{ marginTop: 18 }}>
            <div className="f-bline">
              <span className="f-spec-k" style={{ marginBottom: 0 }}>Today&rsquo;s test</span>
              <span className="f-bline-v">&pound;{basePortion}</span>
            </div>
            <div className="f-bline">
              <span className="f-spec-k" style={{ marginBottom: 0 }}>{retestLabel}</span>
              <span className="f-bline-v">&pound;{retestPortion}</span>
            </div>
          </div>

          {/* "vs buying both tests separately" (not "vs buying twice"): Full-picture's
              second kit is the cheaper Energy & Recovery panel, so "twice" would
              overstate the comparison basis (2 x base price). This phrasing is
              accurate for all three bundles against the sum of the two standalone
              test prices. Verifier finding 2026-07-24 (ASA pricing-accuracy risk). */}
          <p className="f-blab" style={{ marginTop: 16, marginBottom: 0 }}>{savingsText}</p>

          <p className="f-sub" style={{ marginTop: 14, flexGrow: 1 }}>{mechanic}</p>

          <KitCheckoutButton
            kitType={kitType}
            bundle={bundleType}
            className="f-btn f-btn-block"
          >
            {cta}
          </KitCheckoutButton>
        </div>
      </div>
    </div>
  )
}
