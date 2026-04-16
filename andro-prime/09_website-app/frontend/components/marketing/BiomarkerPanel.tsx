interface BiomarkerLevel {
  range: string
  label: string
  description: string
}

interface BiomarkerPanelProps {
  title: string
  levels: BiomarkerLevel[]
  inverted?: boolean
}

export default function BiomarkerPanel({ title, levels, inverted = false }: BiomarkerPanelProps) {
  if (inverted) {
    return (
      <div className="bg-black text-white p-10 border-4 border-black">
        <div className="data-label text-gray-400 mb-6">{title}</div>
        <div className="space-y-6">
          {levels.map((level, i) => (
            <div
              key={level.range}
              className={`flex items-start gap-4 ${i < levels.length - 1 ? 'pb-4 border-b border-gray-700' : ''}`}
            >
              <div className="w-24 flex-shrink-0 font-mono font-black text-sm text-gray-400">{level.range}</div>
              <div>
                <strong className="font-sans font-black uppercase tracking-tight block text-white">{level.label}</strong>
                <span className="font-serif text-sm text-gray-400">{level.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-10 border-l-[12px] border-l-black">
      <div className="data-label mb-6">{title}</div>
      <div className="space-y-5">
        {levels.map((level, i) => (
          <div
            key={level.range}
            className={`flex items-start gap-4 ${i < levels.length - 1 ? 'pb-4 border-b-2 border-gray-200' : ''}`}
          >
            <div className="font-mono font-black text-sm text-gray-500 w-28 flex-shrink-0">{level.range}</div>
            <div>
              <strong className="font-sans font-black uppercase tracking-tight block">{level.label}</strong>
              <span className="font-serif text-sm text-gray-600">{level.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
