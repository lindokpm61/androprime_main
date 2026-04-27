interface ResultEducateProps {
  educationContext: string
  markerName: string
}

export function ResultEducate({ educationContext, markerName }: ResultEducateProps) {
  return (
    <div className="bg-gray-50 border-l-4 border-black px-6 py-5">
      <p className="data-label text-xs mb-2">{markerName}</p>
      <p className="font-serif text-sm leading-relaxed text-gray-700">{educationContext}</p>
    </div>
  )
}
