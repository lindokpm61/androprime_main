import type { TocHeading } from '@/lib/blog'

interface BlogTocProps {
  headings: TocHeading[]
}

// Inline "SYS: On this page" table-of-contents card (brutalist template style).
// Numbered, two-column grid of jump links to the article's H2 sections.
// Placed in the MDX body via a closure-bound <BlogToc /> (headings injected in
// [slug]/page.tsx), so it sits after the lead paragraph in the content flow.
export default function BlogToc({ headings }: BlogTocProps) {
  if (!headings || headings.length === 0) return null

  return (
    <div className="border-4 border-black p-6 md:p-8 mb-16 bg-white brutal-shadow">
      <h2 className="font-sans font-black uppercase text-2xl tracking-tighter mb-6 pb-4 border-b-4 border-black flex items-center gap-3">
        <span className="font-mono text-sm bg-black text-white px-2 py-1">SYS:</span> On this page
      </h2>
      <nav aria-label="On this page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-mono text-xs md:text-sm font-bold uppercase tracking-widest">
          {headings.map((h, i) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className="flex items-start gap-2 p-2 -ml-2 text-black hover:bg-black hover:text-white transition-colors group"
            >
              <span className="text-gray-400 group-hover:text-white shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{h.text}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
