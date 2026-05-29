import Link from 'next/link'
import { ReactNode } from 'react'

interface InlineKitCTAProps {
  // Destination — internal route (e.g. "/lp/energy-recovery") or "#tests".
  ctaHref: string
  // Button label. Arrow is appended by the component.
  ctaLabel?: string
  // Pitch copy authored in MDX.
  children: ReactNode
}

// Brutalist in-article kit CTA card with the floating block-shadow.
export default function InlineKitCTA({ ctaHref, ctaLabel = 'See the Kit', children }: InlineKitCTAProps) {
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
        href={ctaHref}
        className="relative z-10 mt-6 inline-flex items-center gap-2 bg-black text-white font-sans font-black uppercase tracking-widest text-sm px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors"
      >
        {ctaLabel} <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
