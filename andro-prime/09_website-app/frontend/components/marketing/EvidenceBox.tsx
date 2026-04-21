interface Props {
  citation: string
  children: React.ReactNode
}

export default function EvidenceBox({ citation, children }: Props) {
  return (
    <div className="p-8 bg-black text-white my-12">
      <div className="data-label text-gray-400 mb-4">Published evidence</div>
      <div className="font-serif text-base text-gray-300 space-y-4">{children}</div>
      <div
        className="mt-6 pt-4 border-t border-gray-700 font-mono text-xs text-gray-500"
        dangerouslySetInnerHTML={{ __html: citation }}
      />
    </div>
  )
}
