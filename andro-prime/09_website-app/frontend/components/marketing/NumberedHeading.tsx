import { ReactNode } from 'react'

interface NumberedHeadingProps {
  // Badge label, e.g. "01". Passed as a string so leading zeros are preserved.
  n: string
  // feature: the emphasised inverted-card variant (used for the final / pivotal item).
  feature?: boolean
  children: ReactNode
}

// H3 with a mono number badge — for ordered list-style sections (e.g. "14 signs").
// Wrapped in a <div> so the `.article-prose > h3` rules don't double-apply.
export default function NumberedHeading({ n, feature = false, children }: NumberedHeadingProps) {
  if (feature) {
    return (
      <div className="mt-16 mb-6">
        <h3 className="font-sans font-black uppercase tracking-tighter text-white text-2xl md:text-3xl leading-tight bg-black border-4 border-black brutal-shadow p-4 flex items-center gap-4">
          <span className="shrink-0 font-mono text-lg md:text-xl border-2 border-white px-2 py-1">{n}</span>
          <span>{children}</span>
        </h3>
      </div>
    )
  }

  return (
    <div className="mt-12 mb-4">
      <h3 className="font-sans font-black uppercase tracking-tight text-black text-xl md:text-2xl leading-tight flex items-center gap-3">
        <span className="shrink-0 font-mono text-sm bg-black text-white px-2 py-1">{n}</span>
        <span>{children}</span>
      </h3>
    </div>
  )
}
