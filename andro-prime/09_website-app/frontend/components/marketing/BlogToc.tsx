import type { TocHeading } from '@/lib/blog'

interface BlogTocProps {
  headings: TocHeading[]
}

/**
 * The in-body table of contents, rebuilt in Direction F on 2026-09-08.
 *
 * Distinct from `ArticleToc`, which is the automatic one (mobile disclosure plus
 * desktop sticky sidebar) that `shouldShowToc()` decides on. This one is placed
 * DELIBERATELY by an author, via a closure-bound <BlogToc /> injected in
 * [slug]/page.tsx, so it sits wherever they put it in the content flow, usually
 * after the lead paragraph.
 *
 * ⚠ Both can render on one article. That is by design, not a bug: the sidebar
 * is navigation furniture and this is a contents block the author chose to
 * show. They are styled to look related rather than identical.
 *
 * The "SYS:" chip is gone, as it is everywhere else on the blog now: a machine
 * prefix on a page that no longer speaks that way. Two columns are kept, since
 * a long H2 list in one column pushes the article body a long way down.
 */
export default function BlogToc({ headings }: BlogTocProps) {
  if (!headings || headings.length === 0) return null

  return (
    <div className="fb-toc" style={{ marginBottom: 30 }}>
      <p className="fb-toc-h">On this page</p>
      <nav aria-label="On this page">
        {/* Two columns from `md` up. `.fb-toc ol` is a 1-col grid; this
            utility overrides it because Tailwind utilities are emitted after
            the imported component layer and so win the cascade. */}
        <ol className="md:!grid-cols-2">
          {headings.map((h) => (
            <li key={h.id}>
              <a href={`#${h.id}`}>{h.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
