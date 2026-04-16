// Section eyebrow label — mono text with horizontal rules
// Usage: <SectionEyebrow label="The Data" centered />

interface SectionEyebrowProps {
  label: string
  centered?: boolean
  dark?: boolean
}

export function SectionEyebrow({ label, centered = false, dark = false }: SectionEyebrowProps) {
  const lineColor = dark ? 'bg-white' : 'bg-black'
  const textClass = dark ? '!text-white' : ''

  if (centered) {
    return (
      <div className={`data-label flex items-center justify-center gap-4 mb-6 ${textClass}`}>
        <span className={`w-12 h-[2px] ${lineColor}`} />
        {label}
        <span className={`w-12 h-[2px] ${lineColor}`} />
      </div>
    )
  }
  return (
    <div className={`data-label flex items-center gap-3 mb-8 ${textClass}`}>
      <span className={`w-12 h-[2px] ${lineColor}`} />
      {label}
    </div>
  )
}
