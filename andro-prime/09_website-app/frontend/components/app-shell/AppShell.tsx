'use client'

import { RangeTrack } from './RangeTrack'
import { badgeFor, toneFor } from '@/lib/results/resultSeverity'
import type { ResultTone } from '@/lib/results/resultSeverity'
import { KIT_PANELS, PANEL_MARKERS, numberWord } from '@/lib/kits/panel'
import { kitName } from '@/lib/kits/names'
import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import {
  formatDemoDate,
  formatDemoDateShort,
  formatDemoDateMed,
  formatDemoDateNoYear,
  getDemoWaitingSteps,
  getDemoCheckin,
} from '@/lib/results/demo'
import {
  markerToMove,
  questionsFor,
  currentStreak,
  adherenceSeries,
  loggedWithin,
} from '@/lib/membership/checkin'
import { CheckinRow } from '@/components/membership/CheckinRow'
import { AdherenceChart } from '@/components/membership/AdherenceChart'
import type { DemoDates, DemoJourneyId } from '@/lib/results/demo'
import type { ClassifiedResult, KitType } from '@/lib/results/types'

/*
 * THE APP SHELL. Rebuilt from scratch 2026-09-07, screen by screen, against
 * `design/prototypes/demo-account-interactive.html`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔴 THE BRIEF WAS THE PROTOTYPE, NOT AN IMPROVEMENT ON IT. Keith: *"rebuild the
 * demo from scratch, following page for page the prototype. Exactly ... I think
 * we are, with this current version of the demo, in a complete mess."* So every
 * panel below is one panel of that file, in its order, under its heading. The
 * checklist that has to keep passing is TWELVE CELLS -- three journey states
 * times four tabs -- plus the marker detail in one-point and two-point form.
 * One screenshot proves one cell; drive all twelve before calling this done.
 *
 * 🔴 THREE PLACES DELIBERATELY DEPART FROM IT, and all three are one rule: where
 * the prototype invents clinical content and the engine already has approved
 * content, the engine wins. Keith ruled that shape himself on 2026-09-07, when
 * he chose "prototype layout, approved copy" for the plan tab.
 *
 *   1. THE VERDICT WORDS. The prototype draws its own six -- TAKE TO A GP / NO
 *      ACTION / CONTEXT / NO VERDICT / SUPPORT / UNRESOLVED. The engine's are
 *      Ewa-ratified (`resultSeverity.ts`, 2026-08-07, including the ruling that
 *      retired "Optimal" for merely in-range). A mockup does not overturn a
 *      clinical sign-off.
 *   2. THE DAILY TAPS. "D3 capsule" and "20 min daylight" are invented and
 *      unsigned; `lib/membership/checkin.ts` holds the approved pair and the
 *      product's real 1-to-5 scale. The substitution is nearly invisible: the
 *      approved labels are "D3" and "Daylight".
 *   3. THE MEMBER SHOP. The prototype sells "Vitamin D3 + K2, £18.95 member
 *      price". No such product exists -- every supplement in
 *      `lib/subscriptions/products.ts` is RETIRED -- so drawing it would put an
 *      invented product at an invented price on a public surface. The panel and
 *      its compliance note are kept; the row points at the waitlist that does
 *      exist.
 *
 * ⚠ ONE PANEL IS OMITTED ON PURPOSE. The prototype's account screen says *"Your
 * next included retest is 12 November 2027."* That is DEFECT 3b in
 * `04_products/results-engine/retest-mechanism-map.md`: nothing calls
 * `nextRetestAfter`, so the build gives a member ONE retest ever while the copy
 * sells one a year. The prototype's own header flags it as drawn-not-built. This
 * screen states the retest it can stand behind and no other.
 *
 * 🔴 EVERY WORD OF CLINICAL CONTENT COMES FROM THE ENGINE. `explanation`,
 * `educationContext` and `recommendation` are `biomarker-copy.ts` strings; the
 * verdict is `BADGES`; the tone is `toneFor`; the track's geometry is
 * `displayZones` plus the laboratory's own interval. Nothing here states a
 * threshold, a band or a verdict of its own, and the prototype's transcribed
 * band table is reproduced nowhere.
 */

/* ------------------------------------------------------------- the row model */

/**
 * One marker, as the demo shows it: the newest reading, and the earlier one
 * where a second purchase produced it.
 *
 * 🔴 `previous` IS NULL FOR FIVE OF THE NINE, AND THAT IS THE POINT. The first
 * purchase is Kit 3 and the included retest is Kit 2 (Keith, 2026-09-07), so the
 * hormone markers have one reading and the energy markers have two. Every screen
 * branches on this rather than on the journey state, which is what stops a
 * "was → now" appearing over a number that was never re-measured.
 */
export interface DemoRow {
  latest: ClassifiedResult
  previous: ClassifiedResult | null
  /** Which purchase the newest reading came from. A detail on the row. */
  kit: KitType
}

/* Which group a marker belongs to, derived from `KIT_PANELS` rather than typed:
   Kit 1's panel is the hormone group and Kit 2's is the energy group, which is
   exactly the split the prototype draws. */
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

/** Whether the ENGINE routed this result to a GP. Never a judgement made here. */
function goesToGp(r: ClassifiedResult): boolean {
  return r.primaryCta?.type === 'gp-referral' || r.secondaryCta?.type === 'gp-referral'
}

/** Whether the value sits inside the laboratory's own printed interval. */
function insideLabRange(r: ClassifiedResult): boolean {
  if (r.referenceLow !== null && r.value < r.referenceLow) return false
  if (r.referenceHigh !== null && r.value > r.referenceHigh) return false
  return true
}

/** Trims trailing zeroes the way the prototype's `fmt` does: 58.0 reads 58. */
function num(v: number): string {
  return Number(v.toFixed(3)).toString()
}

/*
 * The row's verdict word.
 *
 * With `compare` on our bands are gone, and the only thing left to say is
 * whether the number is inside the interval the laboratory printed. That is a
 * statement about the lab's own range rather than a clinical verdict of ours,
 * which is why these two strings are not in `BADGES` and do not need to be.
 */
function verdictWord(r: ClassifiedResult, compare: boolean): string {
  if (isReportOnly(r)) return badgeFor(r.state).label
  if (compare) return insideLabRange(r) ? 'In range' : 'Out of range'
  return badgeFor(r.state).label
}

function verdictTone(r: ClassifiedResult, compare: boolean): ResultTone {
  if (isReportOnly(r)) return 'flat'
  if (compare) return insideLabRange(r) ? 'flat' : 'crit'
  return toneFor(r.state)
}

/*
 * Risen / Fallen / Unchanged, and nothing else, ever.
 *
 * 🔴 DESCRIPTIVE, NEVER EVALUATIVE. A rise is not good on every marker and
 * hs-CRP is the counter-example two rows away, so this returns a direction and a
 * magnitude and no adjective. The prototype makes the same point in its own
 * comment and it is one of the three things it says must not be tidied away.
 */
function movementWord(previous: ClassifiedResult, latest: ClassifiedResult): string {
  const d = latest.value - previous.value
  // A tenth of the smaller reading, so "unchanged" scales with the marker
  // instead of calling a 0.008 move on free testosterone a change.
  const noise = Math.abs(previous.value) * 0.005
  if (Math.abs(d) <= noise) return 'Unchanged'
  return `${d > 0 ? 'Risen' : 'Fallen'} ${num(Math.abs(d))} ${latest.unit}`
}

/* ------------------------------------------------------------------- chrome */

export type Tab = 'results' | 'plan' | 'record' | 'you'

/** The phone app bar shows these, so they live beside the tabs that set them. */
export const TAB_TITLES: Record<Tab, string> = {
  results: 'Your results',
  plan: 'Your plan',
  record: 'Your record',
  you: 'Account',
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'results',
    label: 'Results',
    icon: (
      <>
        <path d="M4 19V5" />
        <path d="M4 12h5l2-5 3 10 2-5h4" />
      </>
    ),
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M8 2v4M16 2v4M3 10h18" />
        <path d="M8.5 15.5l2 2 4-4" />
      </>
    ),
  },
  {
    id: 'record',
    label: 'Record',
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </>
    ),
  },
  {
    id: 'you',
    label: 'You',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
  },
]

/*
 * ⚠ NO TAB IS CURRENT WHILE A MARKER IS OPEN, which is the prototype's rule:
 * `aria-current="(state.tab === t.id && state.marker === null)"`. The detail is
 * a screen pushed on top of a tab rather than a tab of its own, and leaving the
 * tab lit says the opposite. It also matters now that the detail is reachable
 * from TWO tabs -- Results and Record -- because a lit tab would name the wrong
 * one half the time.
 */
export function TabBar({
  tab,
  onTab,
  markerOpen = false,
}: {
  tab: Tab
  onTab: (t: Tab) => void
  markerOpen?: boolean
}) {
  return (
    <div className="ap-tabbar" role="tablist" aria-label="Sections">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          className="ap-tab"
          aria-selected={t.id === tab && !markerOpen}
          onClick={() => onTab(t.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {t.icon}
          </svg>
          {t.label}
        </button>
      ))}
    </div>
  )
}

const CHEV = (
  <span className="ap-chev" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6" />
    </svg>
  </span>
)

/* -------------------------------------------------------------------- shell */

export interface AppShellProps {
  /** The nine markers, newest reading first, earlier reading where one exists. */
  rows: DemoRow[]
  journey: DemoJourneyId
  dates: DemoDates | null
  tab: Tab
  openMarker: string | null
  onOpenMarker: (name: string | null) => void
  compare: boolean
}

export function AppShell({
  rows,
  journey,
  dates,
  tab,
  openMarker,
  onOpenMarker,
  compare,
}: AppShellProps) {
  const open = openMarker ? rows.find((r) => r.latest.markerName === openMarker) ?? null : null

  if (open) {
    return <MarkerScreen row={open} journey={journey} dates={dates} compare={compare} />
  }
  if (tab === 'plan') return <PlanScreen rows={rows} journey={journey} dates={dates} />
  if (tab === 'record')
    return (
      <RecordScreen rows={rows} journey={journey} dates={dates} onOpenMarker={onOpenMarker} />
    )
  if (tab === 'you') return <YouScreen rows={rows} journey={journey} dates={dates} />
  return (
    <ResultsScreen
      rows={rows}
      journey={journey}
      dates={dates}
      compare={compare}
      onOpenMarker={onOpenMarker}
    />
  )
}

/* ====================================================== RESULTS ============ */

/*
 * The prototype's `screenResults`, panel for panel:
 *   status strip · [member: the two-purchases card] · grouped marker rows ·
 *   the "Your data" card.
 */
function ResultsScreen({
  rows,
  journey,
  dates,
  compare,
  onOpenMarker,
}: {
  rows: DemoRow[]
  journey: DemoJourneyId
  dates: DemoDates | null
  compare: boolean
  onOpenMarker: (name: string | null) => void
}) {
  if (journey === 'waiting') return <WaitingScreen />

  const member = journey === 'member'
  const landed = member ? dates?.retestReceived : dates?.resultReceived

  const groups = GROUP_ORDER.map((g) => ({
    name: g,
    rows: rows.filter((r) => (GROUP_OF[r.latest.markerName] ?? 'Other') === g),
  })).filter((g) => g.rows.length > 0)

  return (
    <div className="ap-screen">
      <div className="ap-statusstrip">
        <i aria-hidden="true" />
        {member ? 'Retest complete' : 'Result complete'}
        {landed ? ` · ${formatDemoDateMed(landed)}` : ''}
      </div>

      {member && (
        <div className="ap-card">
          <p className="ap-body">
            <b>Nine markers, two purchases, one picture.</b> The panel a number came from is a detail
            on the row, not a place you have to navigate to.
          </p>
        </div>
      )}

      {groups.map((g) => (
        <div className="ap-group" key={g.name}>
          <span className="ap-lbl">{g.name}</span>
          {g.rows.map((r) => (
            <button
              key={r.latest.markerName}
              type="button"
              className="ap-row"
              onClick={() => onOpenMarker(r.latest.markerName)}
            >
              <span>
                <span className="ap-row__name">{r.latest.markerName}</span>
                <span className="ap-row__verdict" data-tone={verdictTone(r.latest, compare)}>
                  {verdictWord(r.latest, compare)}
                </span>
              </span>
              <span className="ap-row__val">
                {r.previous && (
                  <span className="ap-row__was">{num(r.previous.value)} &rarr;</span>
                )}
                {num(r.latest.value)}
                <u className="ap-row__unit">{r.latest.unit}</u>
              </span>
              {CHEV}
            </button>
          ))}
        </div>
      ))}

      <div className="ap-card">
        <span className="ap-lbl">Your data</span>
        <p className="ap-body">
          Your numbers are yours. Download them whenever you like, member or not.
        </p>
        <button type="button" className="ap-btn" data-variant="ghost">
          Download my results
        </button>
      </div>
    </div>
  )
}

/*
 * The prototype's `screenWaiting`, panel for panel:
 *   status strip · "Where your sample is" with the four-step tracker ·
 *   "Ready for when it lands" · two explainer cards.
 *
 * 🔴 IT DRAWS A REAL SCREEN RATHER THAN AN EMPTY STATE, and that is the whole
 * point of the day-3 cell: most of the app IS empty at this moment, and the
 * results tab is the one place with something honest to say.
 */
function WaitingScreen() {
  const steps = getDemoWaitingSteps() ?? []
  return (
    <div className="ap-screen">
      <div className="ap-statusstrip">
        <i aria-hidden="true" />
        Status · analysing
      </div>

      <div className="ap-card">
        <span className="ap-lbl">Where your sample is</span>
        <p className="ap-lead">Your sample is being analysed.</p>
        <p className="ap-body">
          The lab has had your sample for three days and is analysing it now. You will get an email
          the moment it is done, and you do not need to check back.
        </p>

        <div className="ap-steps">
          {steps.map((s) => (
            <div className="ap-step" key={s.title} data-state={s.state}>
              <span className="ap-step__line" aria-hidden="true" />
              <span className="ap-step__bul" aria-hidden="true" />
              <span>
                <span className="ap-step__t">{s.title}</span>
                <span className="ap-step__d">{s.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="ap-sect">Ready for when it lands</div>

      <div className="ap-card">
        <span className="ap-lbl">Why analysis takes days, not hours</span>
        <p className="ap-body">
          Your sample is run in a batch against calibrated controls, and a result that fails its
          control is run again rather than sent out. The wait is the second run you hope you do not
          need.
        </p>
      </div>

      <div className="ap-card">
        <span className="ap-lbl">What a reference range is, and is not</span>
        <p className="ap-body">
          A reference range describes where most men sit. It was built to flag illness, not to define
          wellness, which is why we will show ours beside it.
        </p>
      </div>
    </div>
  )
}

/* ====================================================== MARKER ============= */

/*
 * The prototype's `screenMarker`, panel for panel:
 *   the value card (sub, big value, badge, track, legend, provenance) ·
 *   [two points: the movement card with both plots] ·
 *   the meaning card (what it means, the evidence, attribution, the action).
 */
function MarkerScreen({
  row,
  journey,
  dates,
  compare,
}: {
  row: DemoRow
  journey: DemoJourneyId
  dates: DemoDates | null
  compare: boolean
}) {
  const r = row.latest
  const badge = badgeFor(r.state)
  const tone = verdictTone(r, compare)
  const reportOnly = isReportOnly(r)
  const sub = subFor(r.markerName)
  const gp = goesToGp(r) && !compare
  const two = journey === 'member' && row.previous !== null

  return (
    <div className="ap-screen">
      <div className="ap-card">
        {sub && <span className="ap-lbl">{sub}</span>}
        <div className="ap-bigval">
          <b>{num(r.value)}</b>
          <span>{r.unit}</span>
        </div>
        <span className="ap-badge" data-tone={tone}>
          {compare && !reportOnly
            ? insideLabRange(r)
              ? 'Within the normal range'
              : 'Outside the reference range'
            : badge.label}
        </span>

        <div className="ap-trackwrap">
          <RangeTrack
            result={r}
            compare={compare}
            reportOnly={reportOnly}
            tone={tone}
            previousValue={two ? row.previous!.value : undefined}
          />
        </div>

        {/* 🔴 PROVENANCE, AND IT NAMES NO THRESHOLD. The prototype writes a
            bespoke sentence per marker citing BSSM, NICE NG239 and so on. Those
            strings are not in the engine, and typing them here would recreate
            exactly the transcription its own header warns about. This states the
            two things that are true of every row and verifiable from the data on
            it: where the interval came from, and whose bands sit beside it. */}
        <p className="ap-prov">
          Reference range returned by the laboratory with this result. The action bands beside it are
          ours.
        </p>
      </div>

      {two && dates && (
        <div className="ap-card">
          <span className="ap-lbl">Movement · two points, {dates.daysApart} days apart</span>
          <MoveRow
            previous={row.previous!}
            latest={r}
            fromDate={dates.resultReceived}
            toDate={dates.retestReceived ?? dates.retestDue}
          />
          {!reportOnly && (
            <p className="ap-crossed">
              {badgeFor(row.previous!.state).label === badge.label
                ? `Same band as ${formatDemoDateShort(dates.resultReceived)}`
                : `Moved from “${badgeFor(row.previous!.state).label}” into “${badge.label}”`}
            </p>
          )}

          <div className="ap-plots">
            <TwoPointPlot
              title={r.markerName}
              a={row.previous!.value}
              b={r.value}
              fromDate={dates.resultReceived}
              toDate={dates.retestReceived ?? dates.retestDue}
            />
            <TwoPointPlot
              title="Energy, self-scored"
              a={DEMO_ENERGY_THEN}
              b={DEMO_ENERGY_NOW}
              min={1}
              max={5}
              fromDate={dates.resultReceived}
              toDate={dates.retestReceived ?? dates.retestDue}
              symptom
            />
          </div>

          <p className="ap-sep">
            {compare
              ? 'A trend line is not what makes this different. The other providers all draw one. The second range is the part they do not.'
              : 'Two lines, shown next to each other. We do not tell you that one caused the other, because that is an interpretation of your result and it is not ours to make.'}
          </p>
          <p className="ap-sep" data-continued="true">
            Two points is not a trend. It is the smallest number that can answer whether anything
            moved. Both samples are ours, taken the same way: we do not chart a number we did not
            produce.
          </p>
        </div>
      )}

      <div className="ap-card">
        <span className="ap-lbl">{compare && !reportOnly ? 'What this means' : 'What the difference means'}</span>

        {compare && !reportOnly ? (
          <p className="ap-body">
            Your result is {insideLabRange(r) ? 'within' : 'outside'} the laboratory reference range
            of {labRangeText(r)}.
          </p>
        ) : (
          <>
            <p className="ap-body">{r.explanation}</p>
            {r.educationContext && (
              <div className="ap-sec">
                <h4 className="ap-lbl">The evidence</h4>
                <p>{r.educationContext}</p>
              </div>
            )}
            <div className="ap-attrib">Andro Prime clinical logic · signed by Dr Ewa Lindo</div>
          </>
        )}

        {compare && !reportOnly ? (
          <div className="ap-action" data-tone="calm">
            <h4 className="ap-lbl">What happens now</h4>
            <p>No action indicated.</p>
          </div>
        ) : (
          r.recommendation && (
            <div className="ap-action" data-tone={gp ? 'crit' : 'calm'}>
              <h4 className="ap-lbl">{gp ? 'This one goes to your GP' : 'What happens now'}</h4>
              <p>{r.recommendation}</p>
              {gp && (
                <>
                  {/* Carried verbatim from the approved kit-page copy; copy
                      register row 30 records it as already-signed wording. */}
                  <div className="ap-receipt">A result that goes to a GP earns us nothing.</div>
                  <button type="button" className="ap-btn">
                    Download the GP summary
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

function labRangeText(r: ClassifiedResult): string {
  if (r.referenceLow !== null && r.referenceHigh !== null) {
    return `${num(r.referenceLow)} to ${num(r.referenceHigh)} ${r.unit}`
  }
  if (r.referenceHigh !== null) return `under ${num(r.referenceHigh)} ${r.unit}`
  if (r.referenceLow !== null) return `above ${num(r.referenceLow)} ${r.unit}`
  return 'the interval printed with this result'
}

/*
 * The self-scored energy at each of the two results.
 *
 * ⚠ SYNTHESISED, AND BEHAVIOURAL RATHER THAN CLINICAL. It is the member's own
 * 1-to-5 answer to `ENERGY_QUESTION`, which is self-report and makes no claim
 * about blood. The prototype uses 4 and 7 on a 1-to-10 scale; these are the same
 * shape on the product's actual scale. Drawn BESIDE the marker and never joined
 * to it: connecting the two is a per-customer interpretation and is post-CQC.
 */
const DEMO_ENERGY_THEN = 2
const DEMO_ENERGY_NOW = 4

function MoveRow({
  previous,
  latest,
  fromDate,
  toDate,
}: {
  previous: ClassifiedResult
  latest: ClassifiedResult
  fromDate: Date
  toDate: Date
}) {
  return (
    <div className="ap-move">
      <div className="ap-move__pt" data-old="true">
        <span>{formatDemoDateShort(fromDate)}</span>
        <b>{num(previous.value)}</b>
      </div>
      <span className="ap-move__arw" aria-hidden="true">
        &rarr;
      </span>
      <div className="ap-move__pt">
        <span>{formatDemoDateShort(toDate)}</span>
        <b>{num(latest.value)}</b>
      </div>
      <span className="ap-move__word">{movementWord(previous, latest)}</span>
    </div>
  )
}

/*
 * The prototype's `plot()`: two dots, a line, both values and both dates.
 *
 * Deliberately NOT a chart library. Two points do not need axes, gridlines or a
 * tooltip, and the screen says so out loud one panel down: "two points is not a
 * trend, it is the smallest number that can answer whether anything moved".
 */
function TwoPointPlot({
  title,
  a,
  b,
  min,
  max,
  fromDate,
  toDate,
  symptom = false,
}: {
  title: string
  a: number
  b: number
  min?: number
  max?: number
  fromDate: Date
  toDate: Date
  symptom?: boolean
}) {
  const lo = min ?? Math.min(a, b) * 0.6
  const hi = max ?? Math.max(a, b) * 1.25
  const y = (v: number) => 72 - ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo || 1)) * 54
  const ya = y(a)
  const yb = y(b)
  const from = formatDemoDateShort(fromDate)
  const to = formatDemoDateShort(toDate)

  return (
    <div className="ap-plot" data-symptom={symptom || undefined}>
      <div className="ap-plot__t">{title}</div>
      <svg viewBox="0 0 200 96" role="img" aria-label={`${title}: ${num(a)} on ${from}, ${num(b)} on ${to}`}>
        <line x1="38" y1={ya} x2="162" y2={yb} stroke="currentColor" strokeWidth="2" opacity=".38" />
        <circle cx="38" cy={ya} r="5" fill="none" stroke="currentColor" strokeWidth="2.5" opacity=".55" />
        <circle cx="162" cy={yb} r="6.5" fill="currentColor" />
        <text x="38" y={ya - 12} textAnchor="middle" fontSize="12" fill="currentColor" opacity=".6">
          {num(a)}
        </text>
        <text x="162" y={yb - 14} textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">
          {num(b)}
        </text>
        <text x="38" y="92" textAnchor="middle" fontSize="10" fill="currentColor" opacity=".55">
          {from}
        </text>
        <text x="162" y="92" textAnchor="middle" fontSize="10" fill="currentColor" opacity=".55">
          {to}
        </text>
      </svg>
    </div>
  )
}

/* ====================================================== PLAN =============== */

/*
 * The prototype's `screenPlan`, panel for panel.
 *
 * 🔴 MONTH ONE IS A NOTICE, NOT A PAYWALL, and this screen is where that shows.
 * The prototype drew an ASK here until 2026-09-07: pay £47 to unlock the plan and
 * the trend. Three rulings replaced it -- the first 30 days are included in the
 * kit price (2026-08-27), the month starts when the RESULT lands (anchor ruling),
 * and the card is charged automatically on day 31 (auto-renew ruling). So the
 * plan is OPEN here and the only thing owed is a clear notice of the date.
 */
function PlanScreen({
  rows,
  journey,
  dates,
}: {
  rows: DemoRow[]
  journey: DemoJourneyId
  dates: DemoDates | null
}) {
  if (journey === 'waiting') {
    return (
      <EmptyState
        icon="clock"
        title="Your plan starts when your result does."
        body="There is nothing to work on yet, because there is no number to move. This fills in the moment your result lands."
      />
    )
  }

  const member = journey === 'member'

  /*
   * 🔴 THE MARKER IS CHOSEN FROM THE FIRST RESULT, NOT THE LATEST, AND THAT IS
   * NOT A SHORTCUT. In the member state the retest has just landed and vitamin D
   * has crossed into range, so `markerToMove` over the LATEST states returns
   * ferritin -- the marker he would be asked to work on NEXT. But the 22 days of
   * check-ins on this screen are the loop he has just spent ninety days running,
   * and relabelling that history as an iron loop would be a lie about his own
   * data. The screen shows the loop that produced the retest; what replaces it is
   * a conversation for after he has read the result.
   */
  const marker = markerToMove(rows.map((r) => (r.previous ?? r.latest).state))
  const questions = marker ? questionsFor(marker) : []
  const target = marker ? rows.find((r) => r.latest.markerName === PANEL_MARKERS[marker].name) : null

  const today = member ? dates?.retestReceived ?? null : dates?.resultReceived ?? null
  const checkin = today ? getDemoCheckin(questions.map((q) => q.key), today) : null

  return (
    <div className="ap-screen">
      {!member && dates && <MonthOneNotice dates={dates} />}

      {questions.length > 0 && checkin && (
        <div className="ap-card">
          <span className="ap-lbl">Today · three taps</span>
          <CheckinRow
            questions={questions}
            answeredToday={checkin.answeredToday}
            onSave={() => {}}
          />
          <p className="ap-note-sm">
            {member
              ? 'Three taps, all connected to the one marker you are moving. A member moving ferritin would be asked for different things.'
              : 'Day one. No streak yet, and nothing to chart until you have logged a few days.'}
          </p>
        </div>
      )}

      {member && checkin && (
        <>
          <div className="ap-stats">
            <div className="ap-stat">
              <b>{loggedWithin(checkin.entries, 22, checkin.today).logged}</b>
              <span>Days logged</span>
            </div>
            <div className="ap-stat">
              <b>{currentStreak(checkin.entries, checkin.today)}</b>
              <span>Day streak</span>
            </div>
            <div className="ap-stat">
              <b>{marker ? 1 : 0}</b>
              <span>Marker to move</span>
            </div>
          </div>

          <div className="ap-card">
            <span className="ap-lbl">Adherence, 22 days</span>
            {/* `AdherenceChart` prints the behaviour-not-blood caption itself,
                so this panel does not repeat it. The prototype carries the line
                once and so does this. */}
            <AdherenceChart
              series={adherenceSeries(checkin.entries, questions.length, 22, checkin.today)}
            />
          </div>
        </>
      )}

      {target && dates && (
        <div className="ap-card">
          <span className="ap-lbl">Your one number to move</span>
          <div className="ap-bigval">
            <b>{num(target.latest.value)}</b>
            <span>
              {target.latest.unit} {target.latest.markerName}
            </span>
          </div>
          <p className="ap-body">
            {member && target.previous ? (
              <>
                Your last reading was {num(target.previous.value)}. Your retest on{' '}
                {formatDemoDate(dates.retestReceived ?? dates.retestDue)} is what says whether it
                moved, and it did.
              </>
            ) : (
              <>
                Your retest on {formatDemoDate(dates.retestDue)} is what says whether it moved.{' '}
                {daysBetween(dates.resultReceived, dates.retestDue)} days after this result,{' '}
                {daysBetween(dates.firstCharge, dates.retestDue)} after your first payment.
              </>
            )}
          </p>
        </div>
      )}

      {!member && (
        <div className="ap-card">
          <span className="ap-lbl">What month one includes, and what nothing gates</span>
          <p className="ap-body">
            Your first 30 days came with the kit, so the <b>plan</b> and the <b>trend</b> are open
            now. Nothing gates your numbers at any point: under UK data protection law you have a
            right of access to your own health data, so the results tab stays open whatever you
            decide about membership.
          </p>
        </div>
      )}
    </div>
  )
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

/*
 * The prototype's `.pay` block, which is a NOTICE. Its own comment says so: the
 * class name is kept there for styling and the content is a continuation
 * conversation, not a sales one.
 */
function MonthOneNotice({ dates }: { dates: DemoDates }) {
  // One source for the number: the products module, which is also what the
  // checkout reads. Typing £47 here would be the third copy of a fact.
  const amount = PRODUCT_MAP.membership.price.split('/')[0]
  const charge = formatDemoDateNoYear(dates.firstCharge)

  return (
    <div className="ap-notice">
      <h3>You are a member until {charge}.</h3>
      <p>
        It came with your kit. You have one number to move and{' '}
        {daysBetween(dates.firstCharge, dates.retestDue)} days to move it.
      </p>
      <div className="ap-price">
        <b>{amount}</b>
        <span>/ month from {formatDemoDateShort(dates.firstCharge)}</span>
      </div>
      <p>
        <b>
          On {charge} your card is charged {amount} and it carries on monthly.
        </b>{' '}
        Cancel any time before then and nothing is taken.
      </p>
      <ul className="ap-incl">
        <li>
          <i aria-hidden="true">+</i>
          <span>
            <b>Your retest on {formatDemoDate(dates.retestDue)}.</b> Included while you are a member.
            You need to be a member on that date. It is not a credit, it does not expire, and there
            is no balance to keep track of.
          </span>
        </li>
        <li>
          <i aria-hidden="true">+</i>
          <span>Your plan, your streak and your daily data, kept running.</span>
        </li>
        <li>
          <i aria-hidden="true">+</i>
          <span>Every marker explained against both ranges, ours and your lab&rsquo;s.</span>
        </li>
        <li>
          <i aria-hidden="true">+</i>
          <span>Ask the clinician. Questions answered every month, published for all members.</span>
        </li>
        <li>
          <i aria-hidden="true">+</i>
          <span>Supplements at member price, only where we test the marker.</span>
        </li>
      </ul>
      <button type="button" className="ap-btn" data-variant="ghost">
        Manage membership
      </button>
      <p className="ap-notice__foot">
        Your results are yours either way. Download them whenever you want, member or not.
      </p>
    </div>
  )
}

/* ====================================================== RECORD ============= */

/*
 * The prototype's `screenRecord`, panel for panel.
 *
 * 🔴 THE MEMBER CELL IS WHERE THE KIT 2 RULING IS VISIBLE. Four rows carry two
 * numbers and a movement word; five carry one number and say they were not
 * retested. The prototype drew nine pairs because its retest was another Kit 3.
 */
function RecordScreen({
  rows,
  journey,
  dates,
  onOpenMarker,
}: {
  rows: DemoRow[]
  journey: DemoJourneyId
  dates: DemoDates | null
  onOpenMarker: (name: string | null) => void
}) {
  if (journey === 'waiting') {
    return (
      <EmptyState
        icon="chart"
        title="Nothing to compare yet."
        body="A record needs two points. Your first result is the first of them, and it is on its way."
      />
    )
  }

  const member = journey === 'member'

  if (!member) {
    return (
      <div className="ap-screen">
        <div className="ap-card">
          <span className="ap-lbl">Your record so far</span>
          <p className="ap-body">
            <b>One point.</b> That is a fact about today, and it is genuinely useful: nine markers,
            one date, one set of standards. What it cannot tell you is which direction you are going.
          </p>
          <p className="ap-body">
            Your next test is what turns this into a record. Two points is the smallest number that
            can answer whether anything moved.
          </p>
        </div>

        {rows.map((r) => (
          <div className="ap-card" data-compact="true" key={r.latest.markerName}>
            <span className="ap-lbl">{r.latest.markerName}</span>
            <div className="ap-move">
              <div className="ap-move__pt">
                <span>{dates ? formatDemoDateShort(dates.resultReceived) : 'First test'}</span>
                <b>{num(r.latest.value)}</b>
              </div>
              <span className="ap-move__arw" aria-hidden="true">
                &rarr;
              </span>
              <div className="ap-move__pt" data-old="true">
                <span>Next test</span>
                <b>?</b>
              </div>
            </div>
          </div>
        ))}

        <div className="ap-card">
          <span className="ap-lbl">Only our own kits feed this</span>
          <p className="ap-body">
            We do not chart a result from another provider. A number typed in from a photo has no
            assay identity and no collection time, and a line drawn between two different assays is
            an artefact that looks like information.{' '}
            <b>We only chart what we can stand behind.</b>
          </p>
        </div>
      </div>
    )
  }

  const retested = rows.filter((r) => r.previous)

  return (
    <div className="ap-screen">
      <div className="ap-card">
        <span className="ap-lbl">Two purchases, one picture</span>
        <p className="ap-body">
          <b>Nine markers, two dates, {numberWord(retested.length)} of them re-measured.</b>{' '}
          Which kit a number came from is a detail on the row, not something you have to navigate.
        </p>
      </div>

      {/* 🔴 THESE ARE BUTTONS, AND THE FIRST REBUILD GOT THAT WRONG. They were
          rendered as static divs on the reasoning that a record row is "a
          statement rather than a link". The prototype disagrees and it is right:
          its record rows are `<button data-marker>` and tapping one opens the
          marker detail, which in the member state is the ONLY place the movement
          breakdown lives -- the two-point track with the earlier reading, the
          band-crossing line, and the marker plotted beside the symptom. Making
          them inert stranded that screen behind the Results tab. Keith found it
          by tapping a row that moved and getting nothing. */}
      {rows.map((r) => (
        <button
          type="button"
          className="ap-row"
          data-wide="true"
          key={r.latest.markerName}
          onClick={() => onOpenMarker(r.latest.markerName)}
        >
          <span>
            <span className="ap-row__name">{r.latest.markerName}</span>
            <span className="ap-row__verdict" data-tone="flat">
              {r.previous ? movementWord(r.previous, r.latest) : 'Not retested'}
            </span>
          </span>
          <span className="ap-row__val">
            {r.previous && <span className="ap-row__was">{num(r.previous.value)} &rarr;</span>}
            {num(r.latest.value)}
            <u className="ap-row__unit">{r.latest.unit}</u>
          </span>
          {CHEV}
        </button>
      ))}

      <div className="ap-card">
        <span className="ap-lbl">Your purchases</span>
        <p className="ap-body">
          <b>{dates ? formatDemoDate(dates.resultReceived) : 'First result'}</b> ·{' '}
          {kitName('hormone-recovery')}, nine markers.
          <br />
          <b>{dates?.retestReceived ? formatDemoDate(dates.retestReceived) : 'Retest'}</b> ·{' '}
          {kitName('energy-recovery')} retest, {numberWord(retested.length)} markers, included with
          membership.
        </p>
      </div>
    </div>
  )
}

/* ====================================================== YOU =============== */

/* The prototype's `screenYou`, panel for panel. */
function YouScreen({
  rows,
  journey,
  dates,
}: {
  rows: DemoRow[]
  journey: DemoJourneyId
  dates: DemoDates | null
}) {
  const waiting = journey === 'waiting'
  const member = journey === 'member'
  const amount = PRODUCT_MAP.membership.price.split('/')[0]
  /* The engine decides whether a GP row belongs here, never this file. */
  const gp = rows.some((r) => goesToGp(r.latest))

  return (
    <div className="ap-screen">
      <div className="ap-card">
        <span className="ap-lbl">Account</span>
        {/* A named persona, because an account screen with no account on it
            demonstrates nothing. It is the repo's own ICP name and the page says
            "sample data" twice above this point. */}
        <p className="ap-name">Mark Ellison</p>
        <p className="ap-email">mark@example.com</p>
      </div>

      {/* 🔴 The one place a PRICE appears inside the phone. That is what widens
          the open compliance item on `/demo`: CA-046 was raised about a results
          report on an ungated surface, not about a membership price on one.
          Flagged in `lib/results/demo.ts` and in `03_compliance/STATE.md`. */}
      {member && dates && (
        <div className="ap-card">
          <span className="ap-lbl">Membership</span>
          <div className="ap-bigval">
            <b>{amount}</b>
            <span>/ month</span>
          </div>
          <p className="ap-body">
            Member since {formatDemoDateNoYear(dates.resultReceived)}. First payment{' '}
            {formatDemoDateNoYear(dates.firstCharge)}.
          </p>
          {/* ⚠ DELIBERATELY SILENT ON THE NEXT RETEST. The prototype names one a
              year out. That is DEFECT 3b in `retest-mechanism-map.md`: nothing
              calls `nextRetestAfter`, so the build gives a member one retest ever
              while the forecast and the copy both sell one a year. Until that is
              decided, this screen states the retest it can stand behind and no
              other. Do not add the annual line back without checking 3b. */}
          <button type="button" className="ap-btn" data-variant="ghost">
            Manage membership
          </button>
        </div>
      )}

      {!waiting && (
        <>
          {gp && (
            <button type="button" className="ap-rowlink">
              <span className="ap-rowlink__t">
                <span className="ap-rowlink__n">GP handoff summary</span>
                <span className="ap-rowlink__d">One page, written for a clinician · ready</span>
              </span>
              {CHEV}
            </button>
          )}
          <button type="button" className="ap-rowlink">
            <span className="ap-rowlink__t">
              <span className="ap-rowlink__n">Download my results</span>
              <span className="ap-rowlink__d">Yours whatever you decide about membership</span>
            </span>
            {CHEV}
          </button>
        </>
      )}

      {member && (
        <>
          <button type="button" className="ap-rowlink">
            <span className="ap-rowlink__t">
              <span className="ap-rowlink__n">Ask the clinician</span>
              <span className="ap-rowlink__d">Answered generally, published for all members</span>
            </span>
            {CHEV}
          </button>

          <div className="ap-sect">Member shop</div>
          {/* ⚠ THE PROTOTYPE SELLS A PRODUCT THAT DOES NOT EXIST. It draws
              "Vitamin D3 + K2 · £18.95 member price"; every supplement in
              `lib/subscriptions/products.ts` is RETIRED, so that row would put an
              invented product at an invented price on a public surface. The panel
              is kept because its NOTE is the point of it; the row points at the
              waitlist, which is real and is the state the range is actually in. */}
          <button type="button" className="ap-rowlink">
            <span className="ap-rowlink__t">
              <span className="ap-rowlink__n">Supplements</span>
              <span className="ap-rowlink__d">Not open yet · join the waitlist</span>
            </span>
            {CHEV}
          </button>
          <div className="ap-card">
            <p className="ap-note-sm">
              Only where we test the marker. Nothing is offered against a result we have routed to a
              GP.
            </p>
          </div>
        </>
      )}

      <div className="ap-card">
        <span className="ap-lbl">{waiting ? 'Your kit' : 'This result'}</span>
        <p className="ap-body">
          {waiting
            ? `Your ${kitName('hormone-recovery')} is with the lab.`
            : `${rows.length} markers from your ${kitName('hormone-recovery')}${
                dates ? `, collected ${formatDemoDate(dates.resultReceived)}` : ''
              }.`}
          {member ? ' Two purchases, two dates on your record.' : ''}
        </p>
      </div>

      <div className="ap-card">
        <span className="ap-lbl">Your data</span>
        <p className="ap-body">
          One UK data controller. Your results are never sold. You can export or delete everything
          from here at any time.
        </p>
        <button type="button" className="ap-btn" data-variant="ghost">
          Export everything
        </button>
      </div>
    </div>
  )
}

/* ====================================================== shared ============ */

function EmptyState({
  icon,
  title,
  body,
}: {
  icon: 'clock' | 'chart'
  title: string
  body: string
}) {
  return (
    <div className="ap-screen">
      <div className="ap-empty">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon === 'clock' ? (
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </>
          ) : (
            <>
              <path d="M3 3v18h18" />
              <path d="M7 15l4-4 3 3 5-6" />
            </>
          )}
        </svg>
        <h3 className="ap-empty__t">{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  )
}
