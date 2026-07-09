import Link from 'next/link'
import { ReactNode } from 'react'
import { PillarId, resolveKitCTA, resolveKitCTAHref } from '@/lib/content/kitCTA'

interface BaseProps {
  // Pitch copy authored in MDX.
  children: ReactNode
  // Button label. Arrow is appended by the component. Overrides the pillar's default label.
  ctaLabel?: string
}

// Preferred: name the pillar and let lib/content/kitCTA.ts decide where it points.
// Redirecting a pillar when a new kit launches is then a one-line config change.
interface PillarProps extends BaseProps {
  pillar: PillarId
  // Opt-in blog UTM campaign (usually the article slug). Omit to leave the href untagged.
  utmCampaign?: string
  ctaHref?: never
}

// Escape hatch: an explicit destination, for one-off pages that aren't a content pillar.
// Prefer `pillar` in articles. A hard-coded href here will not follow a product launch.
interface HrefProps extends BaseProps {
  ctaHref: string
  pillar?: never
  utmCampaign?: never
}

type InlineKitCTAProps = PillarProps | HrefProps

// Brutalist in-article kit CTA card with the floating block-shadow.
export default function InlineKitCTA({
  pillar,
  utmCampaign,
  ctaHref,
  ctaLabel,
  children,
}: InlineKitCTAProps) {
  // resolveKitCTA throws on a gated pillar, which fails the build rather than shipping it.
  const target = pillar ? resolveKitCTA(pillar) : null

  const href = pillar ? resolveKitCTAHref(pillar, utmCampaign) : ctaHref
  const label = ctaLabel ?? target?.label ?? 'See the Kit'

  if (!href) {
    throw new Error('InlineKitCTA: pass either a `pillar` or a `ctaHref`.')
  }

  return (
    <div className="my-12 p-6 border-4 border-black brutal-shadow bg-white relative overflow-hidden">
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 w-16 h-16 bg-dot-pattern opacity-20 pointer-events-none"
      />
      <div className="relative z-10 font-serif text-lg leading-relaxed text-black [&_strong]:font-bold [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2">
        {children}
      </div>
      <Link
        href={href}
        className="relative z-10 mt-6 inline-flex items-center gap-2 bg-black text-white font-sans font-black uppercase tracking-widest text-sm px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors"
      >
        {label} <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
