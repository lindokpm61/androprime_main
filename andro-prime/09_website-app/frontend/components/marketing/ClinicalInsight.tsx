import { ReactNode } from 'react'

interface ClinicalInsightProps {
  // Quote body. MDX wraps bare text in <p>, so the inner element is a <div>.
  children?: ReactNode
  quote?: string
  author?: string
  role?: string
}

// Brutalist "Clinical Insight" pull-quote card — the reviewer's voice.
// Black/white only; the floating block-shadow is enabled via `.blog-skin`.
export default function ClinicalInsight({
  children,
  quote,
  author = 'Dr Ewa Lindo',
  role = 'GMC-registered GP, Andro Prime medical reviewer',
}: ClinicalInsightProps) {
  return (
    <div className="my-16 p-8 md:p-12 border-4 border-black bg-white brutal-shadow relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest mb-6 text-gray-500 bg-white border-2 border-black inline-block px-2 py-1">
          Clinical Insight //
        </div>
        <div className="font-serif italic font-bold text-2xl md:text-3xl leading-snug mb-8 text-black">
          {quote || children}
        </div>
        <footer className="font-sans font-bold text-sm uppercase tracking-widest border-t-4 border-black pt-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <span>{author}</span>
          {role && (
            <>
              <span className="hidden sm:inline text-gray-400" aria-hidden="true">///</span>
              <span className="text-gray-500 font-mono text-xs normal-case tracking-normal">{role}</span>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
