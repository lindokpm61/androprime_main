'use client'

import { useState } from 'react'
import type { KitData } from '@/lib/results/types'
import { MarkerCard } from './MarkerCard'

const KIT_NAMES: Record<string, string> = {
  testosterone: 'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface KitTabsProps {
  kits: KitData[]
}

export function KitTabs({ kits }: KitTabsProps) {
  const [activeKitIndex, setActiveKitIndex] = useState(0)
  const [activeResultIndex, setActiveResultIndex] = useState(0)

  function handleKitChange(index: number) {
    setActiveKitIndex(index)
    setActiveResultIndex(0)
  }

  const activeKit = kits[activeKitIndex]
  const activeResult = activeKit.results[activeResultIndex]

  const attentionCount = activeResult.markers.filter(
    (m) => m.state !== 'optimal-testosterone' && m.state !== 'normal'
  ).length

  const summaryText =
    attentionCount === 0
      ? 'Everything looks good. All markers are in range.'
      : attentionCount === 1
        ? 'One marker needs your attention.'
        : `${attentionCount} markers need your attention.`

  return (
    <>
      {kits.length > 1 && (
        <div className="kit-tabs">
          {kits.map((kit, i) => (
            <button
              key={kit.kitType}
              className={`kit-tab ${i === activeKitIndex ? 'kit-tab--active' : ''}`}
              onClick={() => handleKitChange(i)}
            >
              {KIT_NAMES[kit.kitType] ?? kit.kitType}
            </button>
          ))}
        </div>
      )}

      <div className="results-dashboard__header">
        <div className="results-dashboard__header-row">
          <p className="data-label text-xs">{KIT_NAMES[activeKit.kitType]}</p>
          {activeKit.results.length > 1 && (
            <select
              className="result-history-select"
              value={activeResultIndex}
              onChange={(e) => setActiveResultIndex(Number(e.target.value))}
              aria-label="Select result date"
            >
              {activeKit.results.map((r, i) => (
                <option key={r.resultId} value={i}>
                  {r.collectedAt ? formatDate(r.collectedAt) : `Result ${i + 1}`}
                </option>
              ))}
            </select>
          )}
          {activeKit.results.length === 1 && activeResult.collectedAt && (
            <span className="data-label text-xs" style={{ color: 'var(--color-gray-500)' }}>
              {formatDate(activeResult.collectedAt)}
            </span>
          )}
        </div>

        <h1 className="font-black font-sans text-4xl uppercase tracking-tight mt-4 mb-3">
          What your blood is telling you
        </h1>
        <p className="font-serif text-lg" style={{ color: 'var(--color-gray-600)' }}>
          {summaryText}
        </p>
      </div>

      <div className="results-dashboard__markers">
        {activeResult.markers.map((marker) => (
          <MarkerCard
            key={`${activeKit.kitType}-${activeResultIndex}-${marker.markerName}`}
            marker={marker}
            resultId={activeResult.resultId}
          />
        ))}
      </div>
    </>
  )
}
