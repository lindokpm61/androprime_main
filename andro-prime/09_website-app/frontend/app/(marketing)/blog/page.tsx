import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'
import { getAllArticles } from '@/lib/blog'
import { getAuthor } from '@/lib/authors'

export const metadata: Metadata = {
  title: 'Insights & Protocols | Andro Prime',
  description:
    'Research, analysis, and evidence-based perspectives on male hormone optimisation from the Andro Prime team.',
}

export default function BlogPage() {
  const articles = getAllArticles().map((a) => {
    const author = a.authorSlug ? getAuthor(a.authorSlug) : undefined
    // Card hero: prefer explicit frontmatter.imgSrc (legacy / hero-photo articles);
    // otherwise fall back to the dynamic per-article OG image so the card matches
    // what gets shared on social.
    const usingOg = !a.imgSrc
    return {
      slug: `/blog/${a.slug}`,
      category: a.category,
      date: a.date,
      title: a.title,
      excerpt: a.excerpt,
      authorName: author?.name ?? a.author ?? 'Andro Prime',
      initials: author?.initials ?? a.initials ?? 'AP',
      dark: a.dark,
      readTime: a.readTime,
      featured: a.featured,
      imgSrc: a.imgSrc ?? `/api/og/blog/${a.slug}?variant=card`,
      imgAlt: a.imgAlt ?? a.title,
      usingOg,
    }
  })

  return (
    <main className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <header className="mb-16 pb-8 border-b-4 border-black flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <SectionEyebrow label="Research & Analysis" />
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9]">
              Insights &amp;<br />Protocols
            </h1>
          </div>
          <div className="w-full md:w-auto">
            <p className="text-black font-serif text-lg mb-6 md:max-w-sm">
              Research, analysis, and evidence-based perspectives on male hormone optimisation.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-black text-white font-sans font-black uppercase tracking-widest text-xs border-2 border-black">
                All
              </span>
              {['Endocrinology', 'Recovery', 'Diagnostics'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white text-black font-sans font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-gray-100 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ARTICLE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(({ slug, category, date, title, excerpt, authorName, initials, dark, readTime, featured, imgSrc, imgAlt, usingOg }) => (
            <article
              key={title}
              className="glass-panel flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="h-48 border-b-2 border-black overflow-hidden relative bg-white flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={imgAlt ?? ''}
                  className={
                    usingOg
                      ? 'w-full h-full object-cover'
                      : 'w-full h-full object-cover grayscale opacity-80 mix-blend-multiply'
                  }
                />
                {featured && (
                  <div className="absolute top-4 left-4 bg-white border-2 border-black px-2 py-1 data-label">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4 data-label text-[10px]">
                  <span>{category}</span>
                  <span>{date}</span>
                </div>
                <h2 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 leading-tight">
                  <Link href={slug} className="hover:underline">
                    {title}
                  </Link>
                </h2>
                <p className="text-black font-serif text-sm leading-relaxed mb-8 flex-grow">{excerpt}</p>
                <div className="mt-auto border-t-2 border-black pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 border border-black flex items-center justify-center font-sans font-black text-xs ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                      {initials}
                    </div>
                    <span className="font-sans font-black text-xs uppercase tracking-widest text-black">
                      {authorName}
                    </span>
                  </div>
                  <span className="data-label text-[10px]">{readTime}</span>
                </div>
              </div>
            </article>
          ))}

          {/* NEWSLETTER CTA CARD — inverted (black bg). Cannot use `glass-panel`
              here because that utility hard-applies bg-white, which CSS-layer-overrides
              bg-black no matter the className order. Inline the equivalent border/radius. */}
          <article className="flex flex-col h-full bg-black text-white border-2 border-black hover:-translate-y-1 transition-transform duration-300">
            <div className="p-8 flex-grow flex flex-col justify-center text-center">
              <div className="w-16 h-16 border-2 border-white mx-auto flex items-center justify-center mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  className="text-white"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="text-3xl font-sans font-black uppercase tracking-tighter mb-4 leading-tight">
                Health Intelligence Newsletter
              </h2>
              <p className="font-serif text-sm text-gray-300 mb-8">
                Receive deep-dives on diagnostic markers, supplement protocols, and men&rsquo;s health research directly to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
