import Link from 'next/link'

interface BiomarkerItem {
  name: string
}

interface KitCardProps {
  tag: string
  tagStyle?: 'default' | 'inverted'
  title: string
  price: string
  description: string
  biomarkers: BiomarkerItem[]
  href: string
  featured?: boolean
  featuredLabel?: string
}

const CheckSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function KitCard({
  tag,
  tagStyle = 'default',
  title,
  price,
  description,
  biomarkers,
  href,
  featured = false,
  featuredLabel = 'Most complete',
}: KitCardProps) {
  const borderClass = featured ? 'border-4' : 'border-2'
  const liftClass = featured ? 'relative lg:-translate-y-4' : ''

  return (
    <div className={`${borderClass} border-black bg-white flex flex-col h-full hover:bg-gray-50 transition-colors ${liftClass}`}>
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black text-white text-[12px] font-sans font-black tracking-widest uppercase px-6 py-2">
          {featuredLabel}
        </div>
      )}

      <div className={`p-10 flex-grow ${featured ? 'mt-6' : ''}`}>
        <div className="flex justify-between items-start mb-8">
          <div
            className={`data-label flex items-center gap-2 px-3 py-1.5 border-2 border-black ${
              tagStyle === 'inverted' ? 'bg-black !text-white' : 'bg-white'
            }`}
          >
            <span className={`w-2 h-2 ${tagStyle === 'inverted' ? 'bg-white' : 'bg-black'}`} />
            {tag}
          </div>
          <span className="text-4xl font-sans font-black text-black">{price}</span>
        </div>

        <h3 className="text-3xl font-sans font-black uppercase tracking-tighter text-black mb-4">{title}</h3>
        <p className="text-base text-black font-serif mb-8 leading-relaxed">{description}</p>

        <div className="space-y-4 mt-10">
          <div className="text-xs font-sans font-black text-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">
            Biomarkers Analyzed
          </div>
          {biomarkers.map((b) => (
            <div key={b.name} className="flex items-center gap-4 text-base text-black font-serif">
              <CheckSvg /> {b.name}
            </div>
          ))}
        </div>
      </div>

      <div className="p-10 pt-0 mt-auto">
        <Link
          href={href}
          className={`block w-full text-center px-6 py-4 border-2 border-black font-sans font-black uppercase tracking-widest text-sm transition-colors ${
            featured
              ? 'bg-black text-white hover:bg-white hover:text-black'
              : 'text-black hover:bg-black hover:text-white'
          }`}
        >
          Order test
        </Link>
      </div>
    </div>
  )
}
