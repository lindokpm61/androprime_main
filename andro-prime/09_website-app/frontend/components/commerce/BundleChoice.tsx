// Shared single-vs-bundle CTA choice, rendered on all three kit detail pages when
// isBundlesEnabled() is true (checked server-side by the calling page; this
// component itself does not read the flag). Server-renderable: it composes two
// KitCheckoutButton client components but holds no state of its own, so a page
// can render it directly without its own 'use client' boundary.
//
// Matches the site's bold black-border visual language (see the kit detail pages'
// "MATH" / dashboard-preview panels for precedent on the black-card + data-label
// + font-mono price treatment).

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
    <div className="grid md:grid-cols-2 border-4 border-black max-w-4xl mx-auto text-left bg-white">
      {/* SINGLE KIT (unchanged path: the existing kit at its existing price) */}
      <div className="p-8 md:p-10 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col bg-white">
        <div className="data-label mb-4 text-black">One-off test</div>
        <h3 className="text-xl font-sans font-black uppercase tracking-tighter text-black mb-6">{kitLabel}</h3>
        <div className="font-mono font-black text-3xl text-black mb-8">&pound;{singlePrice}</div>
        <p className="font-serif text-black leading-relaxed mb-10 flex-grow">
          Just this test. One sample, one result.
        </p>
        <KitCheckoutButton
          kitType={kitType}
          className="w-full bg-white hover:bg-black border-4 border-black text-black hover:text-white font-sans font-black uppercase tracking-widest text-sm px-6 py-4 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          Order the Kit: &pound;{singlePrice}
        </KitCheckoutButton>
      </div>

      {/* BUNDLE (dark until BUNDLES_ENABLED + solicitor/Ewa gates clear) */}
      <div className="relative p-8 md:p-10 bg-black text-white flex flex-col">
        <div className="absolute top-0 right-0 data-label !text-black bg-white px-3 py-1 border-b-4 border-l-4 border-black">
          {ribbon}
        </div>
        <div className="data-label !text-black bg-white inline-block px-2 py-1 border-2 border-black w-max mb-4">
          {badge}
        </div>
        <div className="data-label !text-white mb-4">{bundleName}</div>
        <h3 className="text-xl font-sans font-black uppercase tracking-tighter text-white mb-6">
          {title}
        </h3>
        <div className="font-mono font-black text-3xl text-white mb-6">&pound;{bundlePrice}</div>

        <div className="space-y-3 mb-6 border-t border-b border-gray-700 py-4">
          <div className="flex justify-between items-center gap-4">
            <span className="font-serif text-sm text-gray-300">Today&rsquo;s test</span>
            <span className="font-mono font-bold text-white">&pound;{basePortion}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="font-serif text-sm text-gray-300">{retestLabel}</span>
            <span className="font-mono font-bold text-white">&pound;{retestPortion}</span>
          </div>
        </div>
        {/* "vs buying both tests separately" (not "vs buying twice"): Full-picture's
            second kit is the cheaper Energy & Recovery panel, so "twice" would
            overstate the comparison basis (2 x base price). This phrasing is
            accurate for all three bundles against the sum of the two standalone
            test prices. Verifier finding 2026-07-24 (ASA pricing-accuracy risk). */}
        <div className="data-label !text-white mb-8">{savingsText}</div>

        <p className="font-serif text-sm text-gray-300 leading-relaxed mb-10 flex-grow">{mechanic}</p>

        <KitCheckoutButton
          kitType={kitType}
          bundle={bundleType}
          className="w-full bg-white hover:bg-gray-100 border-4 border-white text-black font-sans font-black uppercase tracking-widest text-sm px-6 py-4 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {cta}
        </KitCheckoutButton>
      </div>
    </div>
  )
}
