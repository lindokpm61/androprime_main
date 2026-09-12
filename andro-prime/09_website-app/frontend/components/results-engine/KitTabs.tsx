'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import type { KitData } from '@/lib/results/types'
import { isFlaggedState } from '@/lib/results/resultSeverity'
import { MarkerCard } from './MarkerCard'
import { formatLongDate } from '@/lib/date/format'

const KIT_NAMES: Record<string, string> = {
  testosterone: 'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

interface KitTabsProps {
  kits: KitData[]
  /**
   * F5 "what this test did not tell you" kit-scope note. Read server-side from
   * KIT_SCOPE_NOTE_ENABLED and passed in (default false). When false this
   * component renders identically to before the note existed.
   */
  showKitScopeNote?: boolean
  /** Collapse "The Evidence" on every marker card. See isEvidenceDisclosureEnabled. */
  collapseEvidence?: boolean
}

export function KitTabs({ kits, showKitScopeNote = false, collapseEvidence = false }: KitTabsProps) {
  const [activeKitIndex, setActiveKitIndex] = useState(0)
  const [activeResultIndex, setActiveResultIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKitChange(index: number) {
    setActiveKitIndex(index)
    setActiveResultIndex(0)
  }

  // Roving tabindex: only the selected tab is in the tab order, and the arrow
  // keys move between tabs. Without this the tabs are reachable but behave like
  // a row of unrelated buttons, which is not what the visual grouping promises.
  function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = kits.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    handleKitChange(next)
    tabRefs.current[next]?.focus()
  }

  const hasTabs = kits.length > 1

  const activeKit = kits[activeKitIndex]
  const activeResult = activeKit.results[activeResultIndex]

  /*
   * 🔴 FIXED 2026-09-06, AND IT WAS WRONG ON THE LIVE DASHBOARD, not just here.
   *
   * This was `m.state !== 'optimal-testosterone' && m.state !== 'normal'`: a
   * hand-rolled list of the two states that mean "fine". The classifier does not
   * emit one generic normal state, it emits a marker-specific one for each
   * biomarker -- `normal-vitamin-d`, `normal-crp`, `normal-ferritin`,
   * `normal-b12`, `normal-albumin`, `shbg-normal`, `ft-normal`, and
   * `fai-reported`, which carries no verdict at all. Every one of those failed
   * both tests and was counted as needing attention.
   *
   * So the summary line counted MARKERS, not flagged markers. A Kit 3 result
   * with three Monitors and six fine said "9 markers need your attention"
   * directly above six outlined "In range" badges, and an all-clear Kit 2 -- by
   * `resultSeverity.ts`'s own account the most common result shipped -- said
   * "4 markers need your attention" above four in-range cards.
   *
   * `isFlaggedState` is the canonical answer and already existed. It derives
   * from the badge's `filled` property, and its header says why in as many
   * words: "Deriving from it rather than listing the states again means this
   * answer can never drift from what the customer sees on the result card."
   * This component was the second list that module was written to prevent, and
   * it had drifted. Do not reintroduce a local predicate here.
   */
  const attentionCount = activeResult.markers.filter((m) => isFlaggedState(m.state)).length

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
  // COPY STATUS: APPROVED (CA-025, Ewa via Keith's in-session representation
  // 2026-07-19; countersignature recommended; pre-flight 0 HARD). Flipping the
  // flag on is a separate go/no-go. Enforces the Kit 1 scope rule (03_compliance:
  // Kit 1 is testosterone only, never framed as explaining general fatigue).
  // No em dashes.
  const showScopeNote =
    showKitScopeNote &&
    activeKit.kitType === 'testosterone' &&
    activeResult.markers.some((m) => m.state === 'normal-testosterone')

  return (
    <>
      {/* Kit selector tabs (shown only when multiple kits exist) */}
      {hasTabs && (
        <div className="f-tabs" role="tablist" aria-label="Your kits">
          {kits.map((kit, i) => (
            <button
              key={kit.kitType}
              type="button"
              role="tab"
              id={`kit-tab-${i}`}
              aria-selected={i === activeKitIndex}
              aria-controls="kit-panel"
              tabIndex={i === activeKitIndex ? 0 : -1}
              ref={(el) => { tabRefs.current[i] = el }}
              className={i === activeKitIndex ? 'f-tab f-tab-on' : 'f-tab'}
              onClick={() => handleKitChange(i)}
              onKeyDown={(e) => handleTabKeyDown(e, i)}
            >
              {KIT_NAMES[kit.kitType] ?? kit.kitType}
            </button>
          ))}
        </div>
      )}

      {/* Dashboard header + markers are the panel the tabs control. */}
      <div
        id="kit-panel"
        {...(hasTabs
          ? { role: 'tabpanel' as const, 'aria-labelledby': `kit-tab-${activeKitIndex}` }
          : {})}
      >
      <div className="f-rhead">
        <div className="f-rhead-top">
          <p className="f-blab" style={{ marginBottom: 0 }}>{KIT_NAMES[activeKit.kitType]}</p>
          {activeKit.results.length > 1 && (
            <select
              className="f-rsel"
              value={activeResultIndex}
              onChange={(e) => setActiveResultIndex(Number(e.target.value))}
              aria-label="Select result date"
            >
              {activeKit.results.map((r, i) => (
                <option key={r.resultId} value={i}>
                  {r.collectedAt ? formatLongDate(r.collectedAt) : `Result ${i + 1}`}
                </option>
              ))}
            </select>
          )}
          {activeKit.results.length === 1 && activeResult.collectedAt && (
            <span className="f-fine">{formatLongDate(activeResult.collectedAt)}</span>
          )}
        </div>

        <h2>What your blood is telling you</h2>
        <p className="f-rsum">{summaryText}</p>
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
            collapseEvidence={collapseEvidence}
          />
        ))}
      </div>

      </div>

      {/* F5: what this test did not tell you (dark, normal-T Kit 1 only) */}
      {showScopeNote && (
        <div style={{ marginTop: 26 }}>
          <p className="f-blab">What this test did not tell you</p>
          <p className="f-scopenote">
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
