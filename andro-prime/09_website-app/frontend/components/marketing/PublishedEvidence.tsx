import { ReactNode } from 'react'

interface PublishedEvidenceProps {
  // Heading chip text. Defaults to the AI-extraction "key takeaway" framing.
  label?: string
  // Optional sources line shown under the accent foot.
  sources?: string
  // The takeaway body (a short, quotable summary).
  children: ReactNode
}

/**
 * RUNG 5: the `--sunk` ground with an ink rule and an ACCENT FOOT.
 *
 * The accent moves to the foot rather than the rule on purpose. On the rung
 * below, Punchline's accent rule says "this is the point". Here the same colour
 * under a divider says "this is sourced", which is a different claim, and
 * putting it in the same position would make the two pieces read as the same
 * piece at different sizes.
 *
 * Built for AI-search extraction: a self-contained takeaway plus its sources.
 */
export default function PublishedEvidence({
  label = 'Published evidence',
  sources,
  children,
}: PublishedEvidenceProps) {
  return (
    <div className="fb-mx fb-pub">
      <span className="fb-stat-k">{label}</span>
      {children}
      {sources && <p className="fb-pub-src">{sources}</p>}
    </div>
  )
}
