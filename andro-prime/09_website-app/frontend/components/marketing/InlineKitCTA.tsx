import Link from 'next/link'
import { ReactNode } from 'react'
import { PillarId, resolveKitCTA, resolveKitCTAHref } from '@/lib/content/kitCTA'

interface BaseProps {
  // Pitch copy authored in MDX.
  children: ReactNode
  // Button label. The pip is appended by the component. Overrides the pillar default.
  ctaLabel?: string
}

// Preferred: name the pillar and let lib/content/kitCTA.ts decide where it points.
// Redirecting a pillar when a new kit launches is then a one-line config change.
interface PillarProps extends BaseProps {
  pillar: PillarId
  // Opt-in blog UTM campaign (usually the article slug). Omit to leave it untagged.
  utmCampaign?: string
  ctaHref?: never
}

// Escape hatch: an explicit destination, for one-off pages that are not a pillar.
// Prefer `pillar` in articles. A hard-coded href will not follow a product launch.
interface HrefProps extends BaseProps {
  ctaHref: string
  pillar?: never
  utmCampaign?: never
}

type InlineKitCTAProps = PillarProps | HrefProps

/**
 * RUNG 8b: shares the tray rung with ClinicalInsight, and is separated from it
 * by an accent WASH rather than by height.
 *
 * That is the deliberate part. The two should read as equally loud and
 * differently coloured: one is the reviewer talking, the other is us selling.
 * Making the sell taller than the clinician would be the wrong hierarchy on a
 * page whose whole argument is that we have no conflict of interest.
 *
 * The button uses `.f-btn` and the circled pip from f-primitives rather than a
 * blog-local button, so an in-article CTA is drawn identically to the CTA on
 * the kit page it points at.
 */
export default function InlineKitCTA({
  pillar,
  utmCampaign,
  ctaHref,
  ctaLabel,
  children,
}: InlineKitCTAProps) {
  // resolveKitCTA throws on a gated pillar, which fails the build rather than
  // shipping it. Unchanged from the V2.0 version: this is a routing guard.
  const target = pillar ? resolveKitCTA(pillar) : null
  const href = pillar ? resolveKitCTAHref(pillar, utmCampaign) : ctaHref
  const label = ctaLabel ?? target?.label ?? 'See the tests'

  if (!href) {
    throw new Error('InlineKitCTA: pass either a `pillar` or a `ctaHref`.')
  }

  return (
    <div className="fb-mx fb-cta">
      <div className="fb-cta-in">
        <div className="fb-cta-body">{children}</div>
        <Link href={href} className="f-btn f-btn-sm">
          {label}
          <span className="f-pip" aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  )
}
