import Link from 'next/link'
import { getAllArticles, type ArticleMeta } from '@/lib/blog'

interface RelatedArticlesProps {
  // Preferred article slugs in priority order. Only those currently visible
  // (published in production; drafts also show in dev) are rendered — so a
  // draft slug never produces a broken link. The section auto-grows as more
  // articles are published.
  slugs: string[]
  heading?: string
  intro?: string
  limit?: number
}

// Server component. Reads the published-article index and renders contextual
// links from a product page into the blog. Returns null when none of the
// preferred articles are live, so the section simply doesn't appear.
export function RelatedArticles({ slugs, heading = 'Related reading', intro, limit = 3 }: RelatedArticlesProps) {
  const bySlug = new Map(getAllArticles().map((a) => [a.slug, a]))
  const picks = slugs
    .map((s) => bySlug.get(s))
    .filter((a): a is ArticleMeta => Boolean(a))
    .slice(0, limit)

  if (picks.length === 0) return null

  return (
    <section className="py-24 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="data-label flex items-center gap-4 mb-8">
          <span className="w-12 h-[2px] bg-black" />
          {heading}
        </div>
        {intro && (
          <p className="text-xl font-serif text-black mb-12 max-w-2xl leading-relaxed">{intro}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {picks.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group border-2 border-black bg-white p-8 flex flex-col hover:bg-black transition-colors duration-200"
            >
              <div className="data-label text-gray-500 group-hover:text-gray-300 mb-4 transition-colors duration-200">
                {a.category}
              </div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 leading-tight transition-colors duration-200">
                {a.title}
              </h3>
              <p className="font-serif text-base text-black group-hover:text-gray-300 leading-relaxed mb-6 transition-colors duration-200">
                {a.excerpt}
              </p>
              <div className="mt-auto data-label flex items-center gap-2 text-black group-hover:text-white transition-colors duration-200">
                Read the guide
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
