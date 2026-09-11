import Link from 'next/link'
import type { Cta } from '@/lib/results/types'

interface ResultConvertProps {
  primaryCta: Cta | null
  secondaryCta: Cta | null
}

export function ResultConvert({ primaryCta, secondaryCta }: ResultConvertProps) {
  if (!primaryCta && !secondaryCta) return null

  /*
   * Rebuilt in Direction F on 2026-09-11. The GP referral keeps the QUIETER of
   * the two buttons, which is the distinction the V2.0 version drew with a 2px
   * border against a 4px one and is preserved here as ghost against solid. It
   * sells nothing, and a referral shouted at the same volume as a purchase is
   * the "we earn nothing from it" position contradicting itself in CSS.
   */

  return (
    <div className="f-btns">
      {primaryCta && (
        <Link
          href={primaryCta.href}
          className={
            primaryCta.type === 'gp-referral'
              ? 'f-btn f-btn-ghost'
              : 'f-btn'
          }
        >
          {primaryCta.label}
        </Link>
      )}
      {secondaryCta && (
        <Link
          href={secondaryCta.href}
          className="f-btn f-btn-ghost"
        >
          {secondaryCta.label}
        </Link>
      )}
    </div>
  )
}
