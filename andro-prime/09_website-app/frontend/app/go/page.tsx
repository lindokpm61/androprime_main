import type { Metadata } from 'next'
import { trackEvent } from '@/lib/analytics/events'
import { getAllArticles } from '@/lib/blog'
import { CLOSES, visiblePosts } from '@/lib/bio-grid'

export const metadata: Metadata = {
  title: 'Andro Prime',
  // noindex: this is a routing surface for one Instagram profile link, not a page
  // anyone should reach from search. Deliberately NOT added to robots.ts disallow,
  // because a disallowed page cannot be crawled, so the crawler never reads this
  // directive and the page can still be indexed from an inbound link. Blocking
  // the crawler and asking it not to index are mutually exclusive; this picks the
  // one that actually works. It is absent from app/sitemap.ts, which is an
  // explicit allowlist, so nothing else needs changing.
  robots: { index: false, follow: false },
}

// Per-request: the grid grows by one tile a day and records a view each time.
export const dynamic = 'force-dynamic'

export default async function BioGridPage() {
  const posts = visiblePosts()

  // Titles come from `blog_articles` via getAllArticles, never from the repo MDX.
  // content/blog/*.mdx is a lagging mirror: at the time of writing it still held
  // the pre-correction Free Androgen Index headline that the 2026-07-30 ruling
  // overturned, so hardcoding titles here would have put a retracted framing on a
  // live page. Reading through means a re-titled article corrects itself.
  const titles = new Map((await getAllArticles()).map((a) => [a.slug, a.title]))

  await trackEvent('bio_grid_view', {
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'carousel30',
    landing_path: '/go',
    props: { tiles: posts.length },
  })

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b-8 border-black px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-block border-2 border-black px-4 py-1 font-mono text-xs uppercase tracking-widest">
            Andro Prime
          </div>
          <h1 className="font-sans text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-5xl">
            Every post,
            <br />
            and where it goes.
          </h1>
          <p className="mt-5 max-w-lg font-serif text-lg leading-relaxed text-gray-600">
            Find the one you just saw. UKAS ISO 15189 accredited lab, finger-prick at
            home, results in 2 to 5 working days.
          </p>
        </div>
      </header>

      {posts.length === 0 ? (
        <main className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <p className="font-serif text-lg leading-relaxed text-gray-600">
              Nothing posted yet. In the meantime, three questions will point you at the
              right test.
            </p>
            {/* Deliberately NOT /go/d01. That slug belongs to the first carousel, so
                every pre-run click would be recorded against a post nobody has seen,
                seeding the baseline with fake data before the run starts. `start`
                matches no post, so the handler routes it to the quiz and records it
                as unmatched, which is both true and separable at read time. */}
            <a
              href="/go/start"
              className="mt-8 inline-block border-4 border-black bg-black px-8 py-4 font-sans text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              Find the right test
            </a>
          </div>
        </main>
      ) : (
        <main className="px-6 py-10">
          <ul className="mx-auto max-w-2xl">
            {posts.map((post) => {
              const close = CLOSES[post.close]
              return (
                <li key={post.slug} className="border-b-2 border-black last:border-b-0">
                  <a
                    href={`/go/${post.slug}`}
                    className="group flex items-baseline gap-5 py-7 transition-colors hover:bg-black hover:text-white"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-gray-400 group-hover:text-gray-500">
                      {String(post.day).padStart(2, '0')}
                    </span>
                    <span className="flex-1">
                      <span className="block font-sans text-xl font-black uppercase leading-tight tracking-tight">
                        {titles.get(post.topic.slug) ?? post.topic.slug}
                      </span>
                      <span className="mt-2 block font-mono text-xs uppercase tracking-widest text-gray-500 group-hover:text-gray-400">
                        {close.label} · {close.hint}
                      </span>
                    </span>
                    <span aria-hidden="true" className="font-sans text-2xl font-black">
                      →
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </main>
      )}

      <footer className="border-t-8 border-black px-6 py-10">
        <p className="mx-auto max-w-2xl font-serif text-sm leading-relaxed text-gray-600">
          Andro Prime sells at-home blood tests. Any result that needs a doctor goes to
          your GP and earns us nothing, and no result changes what we offer or what it
          costs.
        </p>
      </footer>
    </div>
  )
}
