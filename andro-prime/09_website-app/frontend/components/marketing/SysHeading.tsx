import { ReactNode } from 'react'

interface SysHeadingProps {
  children: ReactNode
}

// Section H2 with the brutalist "SYS:" mono chip prefix. Opt-in decorative
// heading for list/section openers — NOT applied to every H2.
// Wrapped in a <div> so the `.article-prose > h2` rules don't double-apply;
// styling here is self-contained and matches the brand H2 spec.
export default function SysHeading({ children }: SysHeadingProps) {
  return (
    <div className="mt-16 mb-8">
      <h2 className="font-sans font-black uppercase tracking-tighter text-black text-3xl md:text-4xl leading-[1.0] flex flex-wrap items-center gap-3">
        <span className="font-mono font-bold text-base md:text-xl bg-black text-white px-3 py-1.5">SYS:</span>
        <span>{children}</span>
      </h2>
    </div>
  )
}
