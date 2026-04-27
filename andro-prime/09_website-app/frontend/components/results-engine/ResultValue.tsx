import type { ResultState } from '@/lib/results/types'

interface ResultValueProps {
  value: number
  unit: string
  state: ResultState
  referenceLow: number | null
  referenceHigh: number | null
}

function statusIndicatorClass(state: ResultState): string {
  if (state === 'optimal-testosterone' || state === 'normal') {
    return 'status-indicator--optimal'
  }
  if (state === 'high-crp' || state === 'low-ferritin' || state === 'low-albumin') {
    return 'status-indicator--gp-block'
  }
  if (state === 'elevated-crp' || state === 'normal-testosterone') {
    return 'status-indicator--warning'
  }
  return 'status-indicator--low'
}

export function ResultValue({ value, unit, state, referenceLow, referenceHigh }: ResultValueProps) {
  const indicatorClass = statusIndicatorClass(state)

  const rangeText =
    referenceLow !== null && referenceHigh !== null
      ? `Reference range: ${referenceLow}–${referenceHigh} ${unit}`
      : referenceHigh !== null
        ? `Reference range: <${referenceHigh} ${unit}`
        : null

  return (
    <div className="flex flex-col gap-1">
      <div className={`text-4xl font-black font-sans ${indicatorClass}`}>
        {value} <span className="text-base font-normal">{unit}</span>
      </div>
      {rangeText && (
        <p className="data-label text-xs text-gray-500">{rangeText}</p>
      )}
    </div>
  )
}
