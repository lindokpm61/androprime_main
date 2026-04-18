interface ResultExplainProps {
  stateLabel: string
  explanation: string
}

export function ResultExplain({ stateLabel, explanation }: ResultExplainProps) {
  return (
    <div>
      <h3 className="font-black font-sans text-lg uppercase tracking-tight mb-3">
        {stateLabel}
      </h3>
      <p className="font-serif text-base leading-relaxed">{explanation}</p>
    </div>
  )
}
