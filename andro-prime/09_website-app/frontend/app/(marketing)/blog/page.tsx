import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'
import BlogListings, { type BlogListItem } from '@/components/marketing/BlogListings'
import { getAllArticles } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Insights & Protocols | Andro Prime',
  description:
    'Research, analysis, and evidence-based perspectives on male hormone optimisation from the Andro Prime team.',
}

export default function BlogPage() {
  // getAllArticles returns most-recent-first; the client component derives the
  // featured hero, category filter, and pagination from this list.
  const articles: BlogListItem[] = getAllArticles().map((a) => ({
    href: `/blog/${a.slug}`,
    category: a.category,
    date: a.date,
    title: a.title,
    excerpt: a.excerpt,
    readTime: a.readTime,
    imgSrc: a.imgSrc ?? `/api/og/blog/${a.slug}?variant=card`,
    imgAlt: a.imgAlt ?? a.title,
    usingOg: !a.imgSrc,
  }))

  return (
    <div className="blog-skin">
      <BlogListings articles={articles} />

      {/* PRIMARY CTA — route to a baseline kit (distinct from the email capture below) */}
      <section className="bg-black text-white border-b-8 border-black py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-block border-2 border-white px-4 py-1 mb-8 font-mono text-xs uppercase tracking-widest">
            System Directive: Baseline Check
          </div>
          <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.95] mb-6">
            Stop reading.<br />Start measuring.
          </h2>
          <p className="font-serif text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every article here circles the same point: a single number means little, a number you have watched move means everything. Get your baseline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#tests"
              className="bg-white text-black hover:bg-transparent hover:text-white font-sans font-black uppercase tracking-widest text-sm px-10 py-5 border-4 border-white transition-colors"
            >
              Choose your test
            </Link>
            <Link
              href="/test-selector"
              className="border-4 border-white text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-5 transition-colors"
            >
              Take the quiz
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER BAND — email capture, not a kit purchase */}
      <section className="bg-white text-black border-b-8 border-black py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 border-4 border-black mx-auto flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-4 leading-tight">
            Health Intelligence Newsletter
          </h2>
          <p className="font-serif text-base md:text-lg text-gray-700 mb-8 max-w-xl mx-auto">
            Deep-dives on diagnostic markers, supplement protocols, and men&rsquo;s health research, direct to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm theme="light" />
          </div>
        </div>
      </section>
    </div>
  )
}
