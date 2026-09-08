interface Props {
  citation: string
  children: React.ReactNode
}

/**
 * RUNG 9: inverted, on the `--ink` ground. The loudest thing an article can do,
 * and the reason there is nothing above it.
 *
 * ⚠ ONE PER ARTICLE. A second inverted block costs the first its weight, which
 * is the same rule `.f-invert` carries on the marketing routes (DESIGN.md names
 * the block each F page spends its invert on). Nothing enforces this in code,
 * so it is a rule for whoever writes the MDX.
 *
 * `citation` is rendered with dangerouslySetInnerHTML because sources are
 * authored with inline <a> and <em>. That is unchanged from the V2.0 version:
 * the content is repo-authored MDX frontmatter, never user input.
 */
export default function EvidenceBox({ citation, children }: Props) {
  return (
    <div className="fb-mx fb-ev f-on-ink">
      <span className="fb-ev-k">Published evidence</span>
      {children}
      <div className="fb-ev-src" dangerouslySetInnerHTML={{ __html: citation }} />
    </div>
  )
}
