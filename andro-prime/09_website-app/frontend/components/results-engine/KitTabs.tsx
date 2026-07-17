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
  /**
   * F5 "what this test did not tell you" kit-scope note. Read server-side from
   * KIT_SCOPE_NOTE_ENABLED and passed in (default false). When false this
   * component renders identically to before the note existed.
   */
  showKitScopeNote?: boolean
}

export function KitTabs({ kits, showKitScopeNote = false }: KitTabsProps) {
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

  // All-clear maintenance offer (dark): the classifier sets the maintenance-offer
  // CTA on every in-range card of an all-clear result. Render it once by picking
  // the first such card as the anchor. Returns -1 (no anchor) when the flag is
  // OFF, since no card carries the CTA, so this is inert while dark.
  const maintenanceAnchorIndex = activeResult.markers.findIndex(
    (m) => m.primaryCta?.type === 'maintenance-offer'
  )

  const summaryText =
    attentionCount === 0
      ? 'Everything looks good. All markers are in range.'
      : attentionCount === 1
        ? 'One marker needs your attention.'
        : `${attentionCount} markers need your attention.`

  // F5 "what this test did not tell you" (dark behind showKitScopeNote). Shown
  // only on a Kit 1 (testosterone) result whose testosterone marker is in the
  // normal range, i.e. exactly the case where the Kit 2 cross-sell fires and a
  // normal-T man could wrongly read "testosterone normal" as "nothing is wrong".
  // COPY STATUS: DRAFT, pending compliance pre-flight. Enforces the Kit 1 scope
  // rule (03_compliance: Kit 1 is testosterone only, never framed as explaining
  // general fatigue). No em dashes.
  const showScopeNote =
    showKitScopeNote &&
    activeKit.kitType === 'testosterone' &&
    activeResult.markers.some((m) => m.state === 'normal-testosterone')

  return (
    <>
      {/* Kit selector tabs (shown only when multiple kits exist) */}
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

      {/* Dashboard header */}
      <div className="p-8 lg:p-12 xl:p-16 border-b-4 border-black bg-white">
        <div className="flex items-center justify-between gap-4 mb-4">
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
            <span className="data-label text-xs" style={{ color: 'var(--color-gray-500, #6b7280)' }}>
              {formatDate(activeResult.collectedAt)}
            </span>
          )}
        </div>

        <h2 className="font-black font-sans text-3xl lg:text-4xl uppercase tracking-tight mt-2 mb-3">
          What your blood is telling you
        </h2>
        <p className="font-serif text-lg" style={{ color: 'var(--color-gray-600, #4b5563)' }}>
          {summaryText}
        </p>
      </div>

      {/* Marker articles */}
      <div>
        {activeResult.markers.map((marker, i) => (
          <MarkerCard
            key={`${activeKit.kitType}-${activeResultIndex}-${marker.markerName}`}
            marker={marker}
            resultId={activeResult.resultId}
            index={i}
            kitType={activeKit.kitType}
            isMaintenanceAnchor={i === maintenanceAnchorIndex}
          />
        ))}
      </div>

      {/* F5: what this test did not tell you (dark, normal-T Kit 1 only) */}
      {showScopeNote && (
        <div className="border-b-4 border-black bg-gray-50 p-8 lg:px-12 xl:px-16 lg:py-10">
          <div className="font-mono text-xs font-bold tracking-widest mb-3 text-black">
            WHAT THIS TEST DID NOT TELL YOU
          </div>
          <p className="font-serif text-base lg:text-lg leading-relaxed text-gray-800 max-w-3xl">
            This test measured your testosterone. It did not measure Vitamin D,
            Vitamin B12, or inflammation, which are the other common reasons men
            feel tired or slow to recover. A normal testosterone result rules
            testosterone in or out. It does not rule those out. If low energy or
            recovery is your concern, the Energy &amp; Recovery Check looks at
            those markers.
          </p>
        </div>
      )}
    </>
  )
}
