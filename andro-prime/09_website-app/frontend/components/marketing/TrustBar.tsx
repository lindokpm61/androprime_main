// Shared trust bar — 4 accreditation badges
// Used on most marketing pages

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

interface TrustBarProps {
  items?: string[]
}

const defaultItems = [
  'UKAS ISO 15189 Accredited Lab',
  'Free UK Delivery',
  'GMC-Registered Doctor',
  'Results in 48h',
]

export function TrustBar({ items = defaultItems }: TrustBarProps) {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-8 data-label border-t-2 border-black pt-8">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <CheckIcon />
          {item}
        </div>
      ))}
    </div>
  )
}
