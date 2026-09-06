'use client'

import { useState } from 'react'
import { RangeTrack } from './RangeTrack'
import { badgeFor, toneFor } from '@/lib/results/resultSeverity'
import { KIT_PANELS, PANEL_MARKERS } from '@/lib/kits/panel'
import type { ClassifiedResult, KitData } from '@/lib/results/types'

/*
 * THE APP SHELL: the prototype's presentation layer, driven by the live engine.
 * Built 2026-09-06 from `design/prototypes/demo-account-interactive.html`.
 *
 * WHAT THE PROTOTYPE GOT RIGHT AND THE CURRENT DASHBOARD DOES NOT. Nine markers
 * render as nine full-page essays, which is 15,736px of scroll at 390 with no
 * overview at any point. A man cannot answer "how did I do" without reading the
 * whole report. The prototype answers it in one screen: a grouped list, one line
 * per marker, value and verdict aligned down the page, and the essay one tap
 * away for the markers he cares about.
 *
 * 🔴 EVERY WORD OF CLINICAL CONTENT COMES FROM THE ENGINE. `explanation`,
 * `educationContext` and `recommendation` are `biomarker-copy.ts` strings, the
 * verdict is `BADGES`, the colour is `toneFor` derived from that badge, and the
 * track's positions come from `displayZones` and the laboratory's own interval.
 * Nothing in this file states a threshold, a band or a verdict of its own.
 *
 * ⚠ THE PROTOTYPE'S OWN VERDICT WORDS ARE NOT USED, DELIBERATELY. It draws
 * "TAKE TO A GP / NO ACTION / CONTEXT / NO VERDICT / SUPPORT / UNRESOLVED".
 * The engine's six are Ewa-ratified (`resultSeverity.ts`, 2026-08-07, including
 * the ruling that retired "Optimal" for merely in-range). A mockup does not
 * overturn a clinical sign-off, so the ratified six ship and the prototype's set
 * is a question for her rather than a decision taken here.
 *
 * ⚠ TWO TABS, NOT FOUR. The prototype draws Results, Plan, Record and You. Plan
 * and Record are membership surfaces, and membership is dark behind
 * `MEMBERSHIP_ENABLED`; no acquisition surface may sell or price it. They are
 * blocked on that flag, not on this work.
 */

/* Which group a marker belongs to, derived from `KIT_PANELS` rather than typed:
   Kit 1's panel is the hormone group and Kit 2's is the energy group, which is
   exactly the split the prototype drew. */
const GROUP_OF: Record<string, string> = (() => {
  const out: Record<string, string> = {}
  for (const id of KIT_PANELS['testosterone']) out[PANEL_MARKERS[id].name] = 'Hormone'
  for (const id of KIT_PANELS['energy-recovery']) out[PANEL_MARKERS[id].name] = 'Energy and recovery'
  // The classifier calls it "Testosterone"; the panel module calls it "Total
  // Testosterone". One alias, rather than renaming either source.
  out['Testosterone'] = 'Hormone'
  return out
})()

const GROUP_ORDER = ['Hormone', 'Energy and recovery', 'Other']

/** The panel module's gloss for a marker, when it has one. */
function subFor(markerName: string): string | null {
  const entry = Object.values(PANEL_MARKERS).find(
    (m) => m.name === markerName || m.name === `Total ${markerName}`
  )
  return entry?.measures ?? null
}

function isReportOnly(r: ClassifiedResult): boolean {
  return badgeFor(r.state).label === 'Reported'
}

export function AppShell({ kits }: { kits: KitData[] }) {
  const [tab, setTab] = useState<'results' | 'you'>('results')
  const [openMarker, setOpenMarker] = useState<string | null>(null)
  const [compare, setCompare] = useState(false)

  const result = kits[0]?.results[0]
  const markers = result?.markers ?? []
  const open = markers.find((m) => m.markerName === openMarker) ?? null

  return (
    <div className="ap-shell">
      {tab === 'results' &&
        (open ? (
          <MarkerScreen
            result={open}
            compare={compare}
            onCompare={setCompare}
            onBack={() => setOpenMarker(null)}
          />
        ) : (
          <ResultsScreen
            kits={kits}
            compare={compare}
            onCompare={setCompare}
            onOpen={setOpenMarker}
          />
        ))}

      {tab === 'you' && <YouScreen kits={kits} />}

      <TabBar
        tab={tab}
        onTab={(t) => {
          setTab(t)
          setOpenMarker(null)
        }}
      />
    </div>
  )
}

/* ---------------- Results: the list ---------------- */

function ResultsScreen({
  kits,
  compare,
  onCompare,
  onOpen,
}: {
  kits: KitData[]
  compare: boolean
  onCompare: (v: boolean) => void
  onOpen: (name: string) => void
}) {
  const markers = kits[0]?.results[0]?.markers ?? []
  const flagged = markers.filter((m) => badgeFor(m.state).filled).length

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    rows: markers.filter((m) => (GROUP_OF[m.markerName] ?? 'Other') === g),
  })).filter((g) => g.rows.length > 0)

  return (
    <div className="ap-screen">
      <div className="ap-screen__head">
        <span className="ap-lbl">Your results</span>
        <h1 className="ap-screen__title" style={{ marginTop: 6 }}>
          {flagged === 0
            ? 'Nothing here needs action.'
            : flagged === 1
              ? 'One marker to look at.'
              : `${flagged} markers to look at.`}
        </h1>
      </div>

      {grouped.map(({ group, rows }) => (
        <div className="ap-group" key={group}>
          <span className="ap-lbl">{group}</span>
          {rows.map((m) => (
            <MarkerRow key={m.markerName} result={m} onOpen={onOpen} />
          ))}
        </div>
      ))}

      <CompareSwitch compare={compare} onCompare={onCompare} />
    </div>
  )
}

function MarkerRow({ result, onOpen }: { result: ClassifiedResult; onOpen: (n: string) => void }) {
  const badge = badgeFor(result.state)
  const tone = toneFor(result.state)
  return (
    <button type="button" className="ap-row" onClick={() => onOpen(result.markerName)}>
      <span>
        <span className="ap-row__name">{result.markerName}</span>
        <span className="ap-row__verdict" data-tone={tone}>
          {badge.label}
        </span>
      </span>
      <span className="ap-row__val">
        {result.value}
        <span className="ap-row__unit">{result.unit}</span>
      </span>
      <span className="ap-chev" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </button>
  )
}

/* ---------------- Results: one marker ---------------- */

function MarkerScreen({
  result,
  compare,
  onCompare,
  onBack,
}: {
  result: ClassifiedResult
  compare: boolean
  onCompare: (v: boolean) => void
  onBack: () => void
}) {
  const badge = badgeFor(result.state)
  const tone = toneFor(result.state)
  const reportOnly = isReportOnly(result)
  const sub = subFor(result.markerName)

  return (
    <div className="ap-screen">
      <button type="button" className="ap-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="ap-lbl">All results</span>
      </button>

      <div className="ap-card">
        <span className="ap-lbl">{result.markerName}</span>
        {sub && (
          <p style={{ fontSize: 12, color: 'var(--ap-ink-3)', marginTop: 4, lineHeight: 1.5 }}>{sub}</p>
        )}

        <div className="ap-bigval">
          <b>{result.value}</b>
          <span>{result.unit}</span>
        </div>
        <span className="ap-badge" data-tone={tone}>
          {badge.label}
        </span>

        <div style={{ marginTop: 16 }}>
          <RangeTrack result={result} compare={compare} reportOnly={reportOnly} tone={tone} />
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-sec" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <h4 className="ap-lbl">What this means</h4>
          <p>{result.explanation}</p>
        </div>
        <div className="ap-sec">
          <h4 className="ap-lbl">The evidence</h4>
          <p>{result.educationContext}</p>
        </div>
      </div>

      {result.recommendation && (
        <div className="ap-action" data-tone={tone === 'crit' ? 'crit' : 'calm'}>
          <h4 className="ap-lbl">What to do</h4>
          <p>{result.recommendation}</p>
        </div>
      )}

      <CompareSwitch compare={compare} onCompare={onCompare} />
    </div>
  )
}

/* ---------------- The compare switch ---------------- */

function CompareSwitch({ compare, onCompare }: { compare: boolean; onCompare: (v: boolean) => void }) {
  return (
    <div className="ap-compare">
      <input
        id="ap-compare"
        type="checkbox"
        checked={compare}
        onChange={(e) => onCompare(e.target.checked)}
      />
      <span>
        <label htmlFor="ap-compare">Show what everyone else shows</label>
        <p>
          Removes our action bands and leaves the laboratory&rsquo;s reference range on its own. That
          is the view a standard report gives you of the same number.
        </p>
      </span>
    </div>
  )
}

/* ---------------- You ---------------- */

function YouScreen({ kits }: { kits: KitData[] }) {
  const result = kits[0]?.results[0]
  const kitName = kits[0]?.kitType
  return (
    <div className="ap-screen">
      <div className="ap-screen__head">
        <span className="ap-lbl">Your account</span>
        <h1 className="ap-screen__title" style={{ marginTop: 6 }}>
          What we hold.
        </h1>
      </div>
      <div className="ap-card">
        <span className="ap-lbl">This result</span>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
          {result?.markers.length} markers from your {kitName} panel
          {result?.collectedAt
            ? `, collected ${new Date(result.collectedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}`
            : ''}
          .
        </p>
      </div>
      <div className="ap-card">
        <span className="ap-lbl">Your data</span>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
          You can export your results as CSV or request erasure at any time from your account. Your
          numbers are yours whether you buy anything else or not.
        </p>
      </div>
    </div>
  )
}

/* ---------------- Tabs ---------------- */

function TabBar({ tab, onTab }: { tab: 'results' | 'you'; onTab: (t: 'results' | 'you') => void }) {
  const TABS = [
    {
      id: 'results' as const,
      label: 'Results',
      path: 'M3 12h4l3 8 4-16 3 8h4',
    },
    {
      id: 'you' as const,
      label: 'You',
      path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    },
  ]
  return (
    <div className="ap-tabbar" role="tablist" aria-label="Sections">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={tab === t.id}
          className="ap-tab"
          onClick={() => onTab(t.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={t.path} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.label}
        </button>
      ))}
    </div>
  )
}
