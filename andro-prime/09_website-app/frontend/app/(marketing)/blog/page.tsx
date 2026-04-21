import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { getAllArticles } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Insights & Protocols | Andro Prime',
  description:
    'Research, analysis, and clinical perspectives on male hormone optimisation from the Andro Prime team.',
}

const placeholderArticles = [
  { slug: '#', category: 'Recovery', date: '05 Oct 2026', title: 'Interpreting High hs-CRP: Systemic Inflammation and Muscle Recovery', excerpt: "High-sensitivity C-reactive protein isn't just a cardiac marker. For active men, it's a crucial indicator of incomplete systemic recovery and tissue stress.", author: 'Dr. Ewa Lindo', initials: 'EL', dark: false, readTime: '5 Min Read', featured: false, icon: true },
  { slug: '#', category: 'Protocols', date: '28 Sep 2026', title: 'The Magnesium Gap: Why Dietary Intake Rarely Meets Athletic Demand', excerpt: 'Analyzing the deficit between RDA guidelines and the actual requirements for men engaged in high-intensity training protocols.', author: 'Dr. Ewa Lindo', initials: 'EL', dark: false, readTime: '6 Min Read', featured: false, imgSrc: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', imgAlt: 'Supplements' },
  { slug: '#', category: 'Diagnostics', date: '15 Sep 2026', title: 'Total vs. Free Testosterone: Understanding the SHBG Binding Effect', excerpt: "Why having high total testosterone doesn't guarantee you'll feel the benefits if your Sex Hormone-Binding Globulin is locking it away.", author: 'Keith Anthony', initials: 'KA', dark: true, readTime: '10 Min Read', featured: false, placeholder: true },
  { slug: '#', category: 'Diagnostics', date: '02 Sep 2026', title: 'Venous Draw vs. Capillary Blood: Accuracy in At-Home Testing', excerpt: 'A comparative review of the clinical accuracy of finger-prick capillary testing against traditional venous draws for hormone panels.', author: 'Dr. Ewa Lindo', initials: 'EL', dark: false, readTime: '7 Min Read', featured: false, imgSrc: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', imgAlt: 'Blood test vial' },
]

type ArticleCard = {
  slug: string
  category: string
  date: string
  title: string
  excerpt: string
  author: string
  initials: string
  dark: boolean
  readTime: string
  featured?: boolean
  icon?: boolean
  imgSrc?: string
  imgAlt?: string
  placeholder?: boolean
}

export default function BlogPage() {
  const published = getAllArticles().map((a) => ({
    slug: `/blog/${a.slug}`,
    category: a.category,
    date: a.date,
    title: a.title,
    excerpt: a.excerpt,
    author: a.author,
    initials: a.initials,
    dark: a.dark,
    readTime: a.readTime,
    featured: a.featured,
    imgSrc: a.imgSrc,
    imgAlt: a.imgAlt,
  }))

  const articles: ArticleCard[] = [...published, ...placeholderArticles]

  return (
    <main className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <header className="mb-16 pb-8 border-b-4 border-black flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <SectionEyebrow label="Clinical Knowledge Base" />
            <h1 className="text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9]">
              Insights &amp;<br />Protocols
            </h1>
          </div>
          <div className="w-full md:w-auto">
            <p className="text-black font-serif text-lg mb-6 md:max-w-sm">Research, analysis, and clinical perspectives on male hormone optimisation.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-black text-white font-sans font-black uppercase tracking-widest text-xs border-2 border-black">All</span>
              {['Endocrinology', 'Recovery', 'Diagnostics'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white text-black font-sans font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-gray-100 cursor-pointer">{tag}</span>
              ))}
            </div>
          </div>
        </header>

        {/* ARTICLE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(({ slug, category, date, title, excerpt, author, initials, dark, readTime, featured, icon, imgSrc, imgAlt, placeholder }) => (
            <article key={title} className="glass-panel flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="h-48 border-b-2 border-black overflow-hidden relative bg-gray-100 flex items-center justify-center">
                {imgSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc} alt={imgAlt ?? ''} className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" />
                ) : icon ? (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,transparent_70%)]" />
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="text-black relative z-10"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                  </>
                ) : placeholder ? (
                  <div className="text-4xl font-sans font-black uppercase tracking-tighter text-gray-300">DATA</div>
                ) : null}
                {featured && (
                  <div className="absolute top-4 left-4 bg-white border-2 border-black px-2 py-1 data-label">Featured</div>
                )}
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4 data-label text-[10px]">
                  <span>{category}</span>
                  <span>{date}</span>
                </div>
                <h2 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 leading-tight">
                  <Link href={slug} className="hover:underline">{title}</Link>
                </h2>
                <p className="text-black font-serif text-sm leading-relaxed mb-8 flex-grow">{excerpt}</p>
                <div className="mt-auto border-t-2 border-black pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 border border-black flex items-center justify-center font-sans font-black text-xs ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}>{initials}</div>
                    <span className="font-sans font-black text-xs uppercase tracking-widest text-black">{author}</span>
                  </div>
                  <span className="data-label text-[10px]">{readTime}</span>
                </div>
              </div>
            </article>
          ))}

          {/* NEWSLETTER CTA CARD */}
          <article className="glass-panel flex flex-col h-full bg-black text-white hover:-translate-y-1 transition-transform duration-300">
            <div className="p-8 flex-grow flex flex-col justify-center text-center">
              <div className="w-16 h-16 border-2 border-white mx-auto flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-white"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <h2 className="text-3xl font-sans font-black uppercase tracking-tighter mb-4 leading-tight">Clinical Updates Newsletter</h2>
              <p className="font-serif text-sm text-gray-300 mb-8">Receive deep-dives on diagnostic markers, supplement protocols, and men&rsquo;s health research directly to your inbox.</p>
              <form className="w-full flex flex-col gap-3 mt-auto">
                <input type="email" placeholder="ENTER EMAIL ADDRESS" className="w-full bg-transparent border-2 border-white p-3 font-mono text-xs uppercase tracking-widest text-white placeholder-gray-500 focus:outline-none focus:border-gray-300" />
                <button type="submit" className="w-full bg-white text-black font-sans font-black uppercase tracking-widest text-sm p-3 hover:bg-gray-200 transition-colors">Subscribe</button>
              </form>
            </div>
          </article>
        </div>

        {/* PAGINATION */}
        <div className="mt-16 pt-8 border-t-2 border-black flex justify-between items-center data-label">
          <button className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black" disabled>&lt; Prev</button>
          <span>Page 1 of 3</span>
          <button className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors">Next &gt;</button>
        </div>
      </div>
    </main>
  )
}
