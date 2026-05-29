import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'
import { getAllArticles } from '@/lib/blog'
import { getAuthor } from '@/lib/authors'

export const metadata: Metadata = {
  title: 'Insights & Protocols | Andro Prime',
  description:
    'Research, analysis, and evidence-based perspectives on male hormone optimisation from the Andro Prime team.',
}

const CATEGORIES = ['All', 'Endocrinology', 'Recovery', 'Diagnostics']

export default function BlogPage() {
  const articles = getAllArticles().map((a) => {
    const author = a.authorSlug ? getAuthor(a.authorSlug) : undefined
    const usingOg = !a.imgSrc
    return {
      href: `/blog/${a.slug}`,
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

  // Featured = explicit flag, else most-recent (first in list).
  const featured = articles.find((a) => a.featured) ?? articles[0]
  const rest = articles.filter((a) => a !== featured)

  const imgClass = (usingOg: boolean) =>
    usingOg
      ? 'w-full h-full object-cover'
      : 'w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:opacity-100 transition-all duration-700'

  return (
    <main className="blog-skin">
      {/* HEADER */}
      <section className="border-b-8 border-black">
        <div className="border-b-4 border-black bg-dot-pattern">
          <div className="max-w-content mx-auto px-6 py-4 flex justify-between items-center font-mono text-xs font-bold uppercase tracking-widest">
            <span className="bg-black text-white px-3 py-1">Research &amp; Analysis</span>
            <span className="text-gray-600">Insights &amp; Protocols</span>
          </div>
        </div>
        <div className="max-w-content mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" aria-hidden="true" />
          <h1 className="relative z-10 text-5xl md:text-7xl lg:text-[5.5rem] font-sans font-black text-black uppercase tracking-tighter leading-[0.85]">
            Insights &amp;<br />Protocols
          </h1>
          <div className="relative z-10 w-full md:max-w-sm">
            <p className="font-serif text-lg text-black mb-6">
              Research, analysis, and evidence-based perspectives on male hormone optimisation.
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((tag, i) => (
                <span
                  key={tag}
                  className={`px-4 py-2 font-sans font-black uppercase tracking-widest text-xs border-2 border-black ${
                    i === 0 ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white cursor-pointer transition-colors'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="border-b-8 border-black flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-white">
            <div>
              <div className="flex flex-wrap gap-4 mb-8 font-mono text-xs font-bold uppercase tracking-widest">
                <span className="bg-black text-white px-3 py-1">{featured.category}</span>
                <span className="border-2 border-black px-3 py-1">{featured.date}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter leading-[0.9] text-black mb-6">
                <Link href={featured.href} className="hover:underline decoration-4 underline-offset-4">
                  {featured.title}
                </Link>
              </h2>
              <p className="font-serif text-lg lg:text-xl text-black leading-relaxed">
                {featured.excerpt}
              </p>
            </div>
            <div className="mt-10 pt-8 border-t-4 border-black flex justify-between items-end font-mono text-xs font-bold uppercase tracking-widest">
              <Link href={featured.href} className="border-2 border-black px-3 py-2 hover:bg-black hover:text-white transition-colors">
                Read article →
              </Link>
              <span>{featured.readTime}</span>
            </div>
          </div>
          <Link href={featured.href} className="w-full lg:w-1/2 relative h-[300px] lg:h-auto bg-black p-4 group overflow-hidden block">
            <span className="absolute inset-4 border-4 border-white z-20 pointer-events-none" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.imgSrc} alt={featured.imgAlt} className={imgClass(featured.usingOg)} />
          </Link>
        </section>
      )}

      {/* ARTICLE LIST — alternating left/right */}
      <section className="flex flex-col">
        {rest.map((a, i) => {
          const reverse = i % 2 === 1
          return (
            <article
              key={a.href}
              className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} w-full border-b-4 border-black group bg-white hover:bg-black hover:text-white transition-colors duration-300`}
            >
              <Link
                href={a.href}
                className={`w-full md:w-1/3 h-56 md:h-auto border-b-4 md:border-b-0 ${reverse ? 'md:border-l-4' : 'md:border-r-4'} border-black relative overflow-hidden bg-black p-2 block`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.imgSrc} alt={a.imgAlt} className={imgClass(a.usingOg)} />
                <span className={`absolute top-4 ${reverse ? 'right-4' : 'left-4'} bg-white text-black font-mono text-[10px] font-bold px-2 py-1 uppercase`}>
                  {a.category}
                </span>
              </Link>
              <div className={`w-full md:w-2/3 p-8 lg:p-12 flex flex-col justify-center relative ${reverse ? 'md:items-end md:text-right' : ''}`}>
                <div className={`font-mono text-[10px] text-gray-500 group-hover:text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-4 ${reverse ? 'justify-end' : ''}`}>
                  <span>{a.date}</span>
                  <span className="w-8 h-[2px] bg-gray-300 group-hover:bg-gray-700" aria-hidden="true" />
                  <span>{a.readTime}</span>
                </div>
                <h3 className="text-3xl lg:text-5xl font-sans font-black uppercase tracking-tighter leading-none mb-6">
                  <Link href={a.href} className="hover:underline decoration-4 underline-offset-4">
                    {a.title}
                  </Link>
                </h3>
                <p className="font-serif text-base lg:text-lg text-gray-700 group-hover:text-gray-300 max-w-2xl">
                  {a.excerpt}
                </p>
              </div>
            </article>
          )
        })}
      </section>

      {/* NEWSLETTER BAND */}
      <section className="bg-black text-white border-b-8 border-black py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 border-4 border-white mx-auto flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-white" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-4 leading-tight">
            Health Intelligence Newsletter
          </h2>
          <p className="font-serif text-base md:text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Deep-dives on diagnostic markers, supplement protocols, and men&rsquo;s health research, direct to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  )
}
