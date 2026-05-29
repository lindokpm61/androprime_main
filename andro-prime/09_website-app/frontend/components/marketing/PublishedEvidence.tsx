import { ReactNode } from 'react'

interface PublishedEvidenceProps {
  // Heading chip text. Defaults to the AI-extraction "key takeaway" framing.
  label?: string
  // Optional sources line shown under a divider.
  sources?: string
  // The takeaway body (a short, quotable summary).
  children: ReactNode
}

// Brutalist "if you only read this section" summary card. Built for AI-search
// extraction: a self-contained takeaway plus the sources behind it.
export default function PublishedEvidence({
  label = 'Published evidence',
  sources,
  children,
}: PublishedEvidenceProps) {
  return (
    <div className="bg-gray-100 p-6 md:p-8 border-l-8 border-black my-12">
      <div className="font-mono text-sm font-bold uppercase tracking-widest mb-4 bg-black text-white inline-block px-2 py-1">
        {label}
      </div>
      <div
        className="
          text-black
          [&_p]:font-serif [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4
          [&_strong]:font-bold
          [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2
        "
      >
        {children}
      </div>
      {sources && (
        <p className="font-serif text-sm leading-relaxed text-gray-600 border-t-2 border-gray-300 pt-4 mt-2">
          {sources}
        </p>
      )}
    </div>
  )
}
