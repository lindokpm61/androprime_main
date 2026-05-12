import Link from 'next/link'
import type { ArticleFrontmatter } from '@/lib/blog'
import { KIT_PRICE_RANGE, SLA_HOURS } from '@/lib/pricing'

interface Props {
  frontmatter: ArticleFrontmatter
  children: React.ReactNode
}

export default function ArticleLayout({ frontmatter, children }: Props) {
  const { title, excerpt, category, date, author, initials, dark, readTime } = frontmatter

  return (
    <main className="bg-white">
      <header className="pt-32 pb-20 border-b-4 border-black bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 bg-black" /> {category}
            </div>
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">
              {readTime}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-3xl">
            {excerpt}
          </p>
          <div className="flex items-center gap-4 mt-10 pt-8 border-t-2 border-black">
            <div
              className={`w-12 h-12 border-2 border-black flex items-center justify-center font-sans font-black text-lg ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {initials}
            </div>
            <div>
              <strong className="font-sans font-black text-sm uppercase tracking-widest">{author}</strong>
              <div className="font-serif text-xs text-gray-600 mt-0.5">{date}</div>
            </div>
          </div>
        </div>
      </header>

      <article className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-lg font-serif text-black leading-relaxed space-y-8">
            {children}
          </div>
        </div>
      </article>

      <section className="py-16 bg-black text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mb-6">
            Find out where you actually stand.
          </h2>
          <p className="font-serif text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {KIT_PRICE_RANGE}. Five minutes. Results in {SLA_HOURS} hours with plain-English interpretation from a GMC-registered GP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#tests"
              className="bg-white text-black hover:bg-gray-100 font-sans font-black uppercase tracking-widest text-sm px-10 py-4 border-2 border-white transition-colors"
            >
              Choose your test
            </Link>
            <Link
              href="/test-selector"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-4 transition-colors"
            >
              Take the quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
