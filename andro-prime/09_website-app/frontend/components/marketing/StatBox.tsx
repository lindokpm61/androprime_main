interface Props {
  label: string
  children: React.ReactNode
}

export default function StatBox({ label, children }: Props) {
  return (
    <div className="p-8 border-2 border-black bg-gray-50 my-12">
      <div className="data-label mb-4">{label}</div>
      <div className="font-serif text-base space-y-4">{children}</div>
    </div>
  )
}
