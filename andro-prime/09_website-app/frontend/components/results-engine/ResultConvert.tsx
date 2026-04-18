import Link from 'next/link'
import type { Cta } from '@/lib/results/types'

interface ResultConvertProps {
  primaryCta: Cta | null
  secondaryCta: Cta | null
}

export function ResultConvert({ primaryCta, secondaryCta }: ResultConvertProps) {
  if (!primaryCta && !secondaryCta) return null

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {primaryCta && (
        <Link
          href={primaryCta.href}
          className={
            primaryCta.type === 'gp-referral'
              ? 'inline-flex items-center justify-center bg-white text-black hover:bg-black hover:text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors'
              : 'inline-flex items-center justify-center bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors'
          }
        >
          {primaryCta.label}
        </Link>
      )}
      {secondaryCta && (
        <Link
          href={secondaryCta.href}
          className="inline-flex items-center justify-center bg-white text-black hover:bg-black hover:text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors"
        >
          {secondaryCta.label}
        </Link>
      )}
    </div>
  )
}
