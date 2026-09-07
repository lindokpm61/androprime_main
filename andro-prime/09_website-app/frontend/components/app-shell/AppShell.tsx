'use client'

import { useState } from 'react'
import { RangeTrack } from './RangeTrack'
import { badgeFor, toneFor } from '@/lib/results/resultSeverity'
import { KIT_PANELS, PANEL_MARKERS } from '@/lib/kits/panel'
import { formatDemoDate, formatDemoDateShort, getDemoWaitingSteps } from '@/lib/results/demo'
import type { DemoDates, DemoJourneyId } from '@/lib/results/demo'
import type { ClassifiedResult, KitData, SingleResult } from '@/lib/results/types'

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
 * ───────────────────────────────────────────────────────────────────────────
 * 🔄 FOUR TABS AND THREE JOURNEY STATES, 2026-09-07. This file used to say
 * "TWO TABS, NOT FOUR... Plan and Record are membership surfaces, and membership
 * is dark behind `MEMBERSHIP_ENABLED`". Two things changed and both are rulings:
 *
 *   1. THE PLAN RECLASSIFIED. The first 30 days of membership are included in
 *      the kit price (2026-08-27) and the month runs from the result landing
 *      (anchor ruling). So the plan is open to every kit buyer for 30 days
 *      without paying anything extra, which makes demonstrating it a
 *      demonstration of something ON SALE TODAY, not of something unbuyable.
 *   2. KEITH RULED THE DEMO IS NOT THE FLAG'S BUSINESS: "This is a demo, so
 *      surely it isn't dependent on the membership flag... it should demonstrate
 *      everything that is available that we're planning to do, as a potential
 *      customer will look at that and have a real visual of what's behind the
 *      membership program." `MEMBERSHIP_ENABLED` stops someone BUYING an
 *      unfinished membership. It is not a reason to stop him SEEING one.
 *
 * 🔴 SO NOTHING HERE READS `MEMBERSHIP_ENABLED`, ON PURPOSE. If you are about to
 * add a flag check to this component, read the ruling above first.
 *
 * ⚠ THE PLAN SCREEN STATES NO ACTION OF ITS OWN. The prototype drew invented
 * daily tasks ("D3 capsule", "20 min daylight") which have had no pre-flight and
 * no clinical sign-off; its own header says so and forbids lifting them to a
 * live surface. So the plan here is built from the ENGINE's `recommendation`
 * strings for the markers the engine itself flagged. The only non-engine input
 * is a 1-to-10 energy check-in, which is behavioural self-report and makes no
 * claim about blood.
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

/** The markers the ENGINE flagged. Never a judgement made in this file. */
function flaggedOf(markers: ClassifiedResult[]): ClassifiedResult[] {
  return markers.filter((m) => badgeFor(m.state).filled)
}

export type Tab = 'results' | 'plan' | 'record' | 'you'

/** The phone app bar shows these, so they live beside the tabs that set them. */
export const TAB_TITLES: Record<Tab, string> = {
  results: 'Your results',
  plan: 'Your plan',
  record: 'Your record',
  you: 'Account',
}

/*
 * 🔄 CONTROLLED FROM 2026-09-07. Tab, open marker and the compare switch used to
 * be local state here. The prototype port moved all three OUT, because the phone
 * chrome and the control rail both need them: the app bar shows the tab title
 * and a back arrow, and the rail only shows its value slider while a marker is
 * open. State that two siblings read belongs above both of them.
 */
export interface AppShellProps {
  kits: KitData[]
  /** Which moment in the journey. Drives every empty state on every tab. */
  journey?: DemoJourneyId
  /** Derived in `lib/results/demo.ts` from the result date. Never typed here. */
  dates?: DemoDates | null
  tab: Tab
  onTab: (t: Tab) => void
  openMarker: string | null
  onOpenMarker: (m: string | null) => void
  /** Owned by the rail, which is where the prototype puts the switch. */
  compare: boolean
}

export function AppShell({
  kits,
  journey = 'result',
  dates = null,
  tab,
  onTab,
  openMarker,
  onOpenMarker,
  compare,
}: AppShellProps) {

  const results = kits[0]?.results ?? []
  /* The NEWEST result is the one on screen. In the member state there are two,
     and showing the older one as "your results" would be plainly wrong. */
  const latest = results[results.length - 1]
  const previous = results.length > 1 ? results[results.length - 2] : null
  const markers = latest?.markers ?? []
  const open = markers.find((m) => m.markerName === openMarker) ?? null
  const waiting = journey === 'waiting'

  return (
    <div className="ap-shell">
      {tab === 'results' &&
        (waiting ? (
          <WaitingResultsScreen collectedAt={latest?.collectedAt} />
        ) : open ? (
          <MarkerScreen
            result={open}
            compare={compare}
            onBack={() => onOpenMarker(null)}
          />
        ) : (
          <ResultsScreen kits={kits} markers={markers} onOpen={onOpenMarker} />
        ))}

      {tab === 'plan' &&
        (waiting ? (
          <WaitingScreen
            head="Your plan starts when your result does."
            body="There is nothing to work on yet, because there is no number to move. This fills in the moment your result lands."
          />
        ) : (
          <PlanScreen markers={markers} journey={journey} dates={dates} />
        ))}

      {tab === 'record' &&
        (waiting ? (
          <WaitingScreen
            head="Nothing to compare yet."
            body="A record needs two points. Your first result is the first of them, and it is on its way."
          />
        ) : (
          <RecordScreen latest={latest} previous={previous} dates={dates} />
        ))}

      {tab === 'you' && <YouScreen kits={kits} journey={journey} dates={dates} />}
    </div>
  )
}

/* ---------------- Waiting ---------------- */

/*
 * 🔴 THE RESULTS TAB HAS A REAL WAITING SCREEN, and the first pass of the
 * journey work did not port it. It gave all three tabs one generic empty state,
 * which is what the prototype does for Plan and Record and is NOT what it does
 * here. Keith caught it by putting the two side by side; the fidelity pass
 * before that had compared one pair of screenshots, day-14 Results, out of
 * twelve state-and-tab combinations.
 *
 * Why the tracker earns its place: it is the difference between "we have your
 * sample" and "your sample is at this point and here is when to expect it". For
 * about eleven days this screen IS the product, so a demo that skips it is
 * demonstrating the easy part.
 *
 * ⚠ NO PERCENTAGE AND NO PROGRESS BAR, deliberately, and the prototype records
 * the reason: a bar stuck at 60% for two days is worse than no bar. The tracker
 * dates every completed step and refuses to date the one it cannot know.
 */
function WaitingResultsScreen({ collectedAt }: { collectedAt?: string | null }) {
  const steps = getDemoWaitingSteps(collectedAt)

  return (
    <div className="ap-screen">
      <div className="ap-statusstrip">
        <i aria-hidden="true" />
        Status &middot; analysing
      </div>

      <div className="ap-card">
        <span className="ap-lbl">Where your sample is</span>
        <p className="ap-lead" style={{ marginTop: 8 }}>
          Your sample is being analysed.
        </p>
        <p className="ap-body">
          The lab has had your sample for three days and is analysing it now. You will get an email
          the moment it is done, and you do not need to check back.
        </p>

        {steps && (
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
        )}
      </div>

      <span className="ap-sect">Ready for when it lands</span>

      <div className="ap-card">
        <span className="ap-lbl">Why analysis takes days, not hours</span>
        <p className="ap-body" style={{ marginTop: 8 }}>
          Your sample is run in a batch against calibrated controls, and a result that fails its
          control is run again rather than sent out. The wait is the second run you hope you do not
          need.
        </p>
      </div>

      <div className="ap-card">
        <span className="ap-lbl">What a reference range is, and is not</span>
        <p className="ap-body" style={{ marginTop: 8 }}>
          A reference range describes where most men sit. It was built to flag illness, not to define
          wellness, which is why we will show ours beside it.
        </p>
      </div>
    </div>
  )
}

/* ---------------- The empty states ---------------- */

/*
 * The waiting state is most of the app, and drawing it honestly is the point.
 * A demo that only ever shows the full dashboard implies the product is useful
 * on day one, and it is not: for about eleven days it is a receipt and a
 * promise. Showing that is more persuasive than hiding it.
 */
function WaitingScreen({ head, body }: { head: string; body: string }) {
  return (
    <div className="ap-screen">
      {/* No title: the app bar above already carries it, and the prototype does
          not repeat it inside an empty state. */}
      <div className="ap-screen__head">
        <h1 className="ap-screen__title">{head}</h1>
      </div>
      <div className="ap-empty">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" />
        </svg>
        <p>{body}</p>
      </div>
    </div>
  )
}

/* ---------------- Results: the list ---------------- */

function ResultsScreen({
  kits,
  markers,
  onOpen,
}: {
  kits: KitData[]
  markers: ClassifiedResult[]
  onOpen: (name: string) => void
}) {
  const flagged = flaggedOf(markers).length
  /* The dated strip the prototype opens every results screen with. It is what
     makes the waiting state and this one read as the same app at two moments
     rather than as two different designs. */
  const results = kits[0]?.results ?? []
  const latest = results[results.length - 1]
  const isRetest = results.length > 1
  /* On a retest the prototype puts the earlier value on the row itself, so the
     movement is legible without leaving the results tab. */
  const previous = results.length > 1 ? results[results.length - 2] : null
  const prevByName = new Map((previous?.markers ?? []).map((m) => [m.markerName, m]))
  const when = latest?.collectedAt
    ? new Date(latest.collectedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    rows: markers.filter((m) => (GROUP_OF[m.markerName] ?? 'Other') === g),
  })).filter((g) => g.rows.length > 0)

  return (
    <div className="ap-screen">
      {when && (
        <div className="ap-statusstrip">
          <i aria-hidden="true" />
          {isRetest ? 'Retest complete' : 'Result complete'} &middot; {when}
        </div>
      )}
      {/* No label here: the phone app bar already says "Your results", and the
          prototype does not repeat it inside the screen. */}
      <div className="ap-screen__head">
        <h1 className="ap-screen__title">
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
            <MarkerRow
              key={m.markerName}
              result={m}
              was={prevByName.get(m.markerName)?.value ?? null}
              onOpen={onOpen}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function MarkerRow({
  result,
  was,
  onOpen,
}: {
  result: ClassifiedResult
  was?: number | null
  onOpen: (n: string) => void
}) {
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
        {was !== null && was !== undefined && was !== result.value && (
          <span className="ap-row__was">{was} &rarr;</span>
        )}
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
  onBack,
}: {
  result: ClassifiedResult
  compare: boolean
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
    </div>
  )
}

/* ---------------- Plan ---------------- */

/*
 * 🔴 MONTH ONE IS NOT A PAYWALL, AND THIS SCREEN IS WHERE THAT SHOWS. Until the
 * 2026-09-07 rulings the prototype drew an ASK here: pay GBP 47 to unlock the
 * plan and the trend. Three rulings replaced it with a NOTICE:
 *   - the first 30 days are included in the kit price (2026-08-27),
 *   - the month starts when the RESULT lands (anchor ruling),
 *   - the card is charged automatically on day 31 (auto-renew ruling).
 * So the plan is open, and the only thing owed to the customer here is a plain
 * statement of when he will be charged and how to stop it. The 2026-08-27 doc
 * puts it exactly: a continuation conversation, not a sales one.
 */
function PlanScreen({
  markers,
  journey,
  dates,
}: {
  markers: ClassifiedResult[]
  journey: DemoJourneyId
  dates: DemoDates | null
}) {
  const [energy, setEnergy] = useState<number | null>(null)
  const flagged = flaggedOf(markers)
  const member = journey === 'member'

  return (
    <div className="ap-screen">
      <div className="ap-screen__head">
        <h1 className="ap-screen__title">
          {flagged.length === 0
            ? 'Nothing to work on.'
            : flagged.length === 1
              ? 'One number to move.'
              : `${flagged.length} numbers to move.`}
        </h1>
      </div>

      {/* The month-one notice, or the standing membership line once past it. */}
      {dates && !member && (
        <div className="ap-notice">
          <h3>You are a member until {formatDemoDate(dates.includedMonthEnds)}.</h3>
          <p>
            It came with your kit. On {formatDemoDate(dates.firstCharge)} your card is charged
            &pound;47 and it carries on monthly. Cancel any time before then and nothing is taken.
          </p>
          <div className="ap-price">
            <b>&pound;47</b>
            <span>/ month from {formatDemoDateShort(dates.firstCharge)}</span>
          </div>
          <p className="ap-notice__foot">
            Your results are yours either way. You can export them whenever you like, member or not.
          </p>
        </div>
      )}

      {dates && member && (
        <div className="ap-notice">
          <h3>Member since {formatDemoDate(dates.resultReceived)}.</h3>
          <p>
            Your included retest came back on {formatDemoDate(dates.retestDue)}. The record tab is
            what it turned into.
          </p>
        </div>
      )}

      {/* 🔴 THE ENGINE WRITES THIS, NOT THIS FILE. Every marker below was flagged
          by `classify()` and every word under it is its own `recommendation`
          string from `biomarker-copy.ts`, which is Ewa-approved copy. The
          prototype's invented daily tasks are deliberately not used. */}
      {flagged.length > 0 && (
        <div className="ap-group">
          <span className="ap-lbl">What you are working on</span>
          {flagged.map((m) => (
            <div className="ap-card" key={m.markerName}>
              <span className="ap-lbl">{m.markerName}</span>
              <div className="ap-bigval">
                <b>{m.value}</b>
                <span>{m.unit}</span>
              </div>
              {m.recommendation && (
                <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 10, color: 'var(--ap-ink-2)' }}>
                  {m.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Behavioural self-report. Makes no claim about blood, which is why the
          line under it says so out loud. */}
      <div className="ap-card">
        <span className="ap-lbl">Energy today</span>
        <div className="ap-energy">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className="ap-energy__btn"
              aria-pressed={energy === n}
              onClick={() => setEnergy(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.7, marginTop: 12, color: 'var(--ap-ink-3)' }}>
          How you feel, logged daily. This is about behaviour, not blood: nothing here claims your
          result has changed, and the app never joins the two for you.
        </p>
      </div>

      {/* 🔴 BEHAVIOUR, NOT BLOOD, and the caption is load-bearing. The prototype
          draws a 22-day adherence chart here and captions it "this chart is about
          behaviour, not blood. Nothing here claims your result has changed." That
          sentence is the reason the chart is allowed to exist beside a set of
          clinical results at all, so it ships with it or neither ships.

          ⚠ THE PROTOTYPE'S DAILY TASKS ARE STILL NOT PORTED. "D3 capsule" and
          "20 min daylight" are invented actions with no pre-flight and no
          clinical sign-off; the prototype's own header forbids lifting them to a
          live surface. The engine's own recommendations render above instead. */}
      {member && (
        <>
          <div className="ap-stats">
            <div className="ap-stat">
              <b>22</b>
              <span>Days logged</span>
            </div>
            <div className="ap-stat">
              <b>16</b>
              <span>Day streak</span>
            </div>
            <div className="ap-stat">
              <b>{flagged.length}</b>
              <span>{flagged.length === 1 ? 'Marker to move' : 'Markers to move'}</span>
            </div>
          </div>
          <div className="ap-card">
            <span className="ap-lbl">Adherence, 22 days</span>
            <div className="ap-bars">
              {Array.from({ length: 22 }, (_, i) => {
                const missed = i === 4 || i === 11 || i === 17
                return (
                  <i
                    key={i}
                    data-miss={missed || undefined}
                    style={{ height: missed ? '18%' : `${58 + ((i * 37) % 42)}%` }}
                  />
                )
              })}
            </div>
            <div className="ap-barcap">
              <span>Day 1</span>
              <span>Day 22</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, marginTop: 12, color: 'var(--ap-ink-3)' }}>
              This chart is about behaviour, not blood. Nothing here claims your result has changed.
            </p>
          </div>
        </>
      )}

      {dates && !member && (
        <div className="ap-card">
          <span className="ap-lbl">What month one includes, and what nothing gates</span>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
            Your first 30 days came with the kit, so the plan and the trend are open now. Nothing
            gates your numbers at any point: under UK data protection law you have a right of access
            to your own health data, so the results tab stays open whatever you decide about
            membership.
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------------- Record ---------------- */

/*
 * TWO POINTS OR NOTHING. With one result this screen exists to say what it
 * cannot tell you, which is direction. With two it draws them side by side.
 *
 * ⚠ IT NEVER JOINS A NUMBER TO AN INTERVENTION. Whether the supplement moved
 * the marker is a per-customer interpretation and is post-CQC. The words below
 * are arithmetic on two engine values ("Risen", "Fallen", "Unchanged") and
 * nothing else.
 */
function RecordScreen({
  latest,
  previous,
  dates,
}: {
  latest: SingleResult | undefined
  previous: SingleResult | null
  dates: DemoDates | null
}) {
  const markers = latest?.markers ?? []

  if (!previous) {
    return (
      <div className="ap-screen">
        <div className="ap-screen__head">
          <h1 className="ap-screen__title">One point.</h1>
        </div>
        <div className="ap-card">
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--ap-ink-2)' }}>
            That is a fact about today, and it is genuinely useful: {markers.length} markers, one
            date, one set of standards. What it cannot tell you is which direction you are going.
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 10, color: 'var(--ap-ink-2)' }}>
            {dates
              ? `Your included retest on ${formatDemoDate(dates.retestDue)} is what turns this into a record. Two points is the smallest number that can answer whether anything moved.`
              : 'Your next test is what turns this into a record. Two points is the smallest number that can answer whether anything moved.'}
          </p>
        </div>
        <div className="ap-card">
          <span className="ap-lbl">Only our own kits feed this</span>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
            We do not chart a result from another provider. A number typed in from a photo has no
            assay identity and no collection time, and a line drawn between two different assays is
            an artefact that looks like information. We only chart what we can stand behind.
          </p>
        </div>
      </div>
    )
  }

  const prevByName = new Map(previous.markers.map((m) => [m.markerName, m]))
  const moved = markers.filter((m) => {
    const p = prevByName.get(m.markerName)
    return p && Number(p.value) !== Number(m.value)
  }).length

  return (
    <div className="ap-screen">
      <div className="ap-screen__head">
        <h1 className="ap-screen__title">
          {moved === 0 ? 'Nothing moved.' : `${moved} of ${markers.length} moved.`}
        </h1>
      </div>

      <div className="ap-group">
        {markers.map((m) => {
          const p = prevByName.get(m.markerName)
          const a = p ? Number(p.value) : null
          const b = Number(m.value)
          const delta = a === null ? null : b - a
          const word =
            delta === null ? '' : delta === 0 ? 'Unchanged' : delta > 0 ? 'Risen' : 'Fallen'
          return (
            <div className="ap-move" key={m.markerName}>
              <span className="ap-move__name">
                {m.markerName}
                <span className="ap-move__word">{word}</span>
              </span>
              <span className="ap-move__vals">
                <span className="ap-move__was">{p?.value ?? '—'}</span>
                <span className="ap-move__arw" aria-hidden="true">
                  &rarr;
                </span>
                <b>{m.value}</b>
                <span className="ap-row__unit">{m.unit}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="ap-card">
        <span className="ap-lbl">What this does not say</span>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
          Two numbers and two dates. It does not claim what moved them. Anything you changed in
          between is yours to weigh, and joining the two for you would be an interpretation we are
          not registered to make.
        </p>
      </div>
    </div>
  )
}

/* ---------------- You ---------------- */

function YouScreen({
  kits,
  journey,
  dates,
}: {
  kits: KitData[]
  journey: DemoJourneyId
  dates: DemoDates | null
}) {
  const results = kits[0]?.results ?? []
  const latest = results[results.length - 1]
  const kitName = kits[0]?.kitType
  const waiting = journey === 'waiting'
  const member = journey === 'member'
  /* The engine decides whether a GP row belongs here, never this file. */
  const routesToGp = (latest?.markers ?? []).some((m) => toneFor(m.state) === 'crit')

  return (
    <div className="ap-screen">
      <div className="ap-card">
        <span className="ap-lbl">Account</span>
        {/* A named persona, because an account screen with no account on it
            demonstrates nothing. It is the repo's own ICP name and the page says
            "sample data" twice above this point. */}
        <p className="ap-name" style={{ marginTop: 8 }}>
          Mark Ellison
        </p>
        <p className="ap-email">mark@example.com</p>
      </div>

      {/* 🔴 The membership card is the one place a PRICE appears on this route.
          That is what widens the open compliance item on `/demo`: CA-046 was
          raised about a results report on an ungated surface, not about a
          membership price on one. Flagged in `lib/results/demo.ts` and in
          `03_compliance/STATE.md`. */}
      {dates && !waiting && (
        <div className="ap-card">
          <span className="ap-lbl">Membership</span>
          <div className="ap-bigval">
            <b>&pound;47</b>
            <span>/ month</span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
            Member since {formatDemoDate(dates.resultReceived)}, included with your kit for the first
            30 days.{' '}
            {member
              ? `First payment ${formatDemoDate(dates.firstCharge)}.`
              : `First payment ${formatDemoDate(dates.firstCharge)}, and you can cancel before then without being charged.`}
          </p>
          {/* ⚠ DELIBERATELY SILENT ON THE NEXT RETEST. The prototype's account
              screen names one a year out. That is DEFECT 3b in
              `04_products/results-engine/retest-mechanism-map.md`: nothing calls
              `nextRetestAfter`, so the build gives a member one retest ever
              while the forecast and the copy both sell one a year. Until that is
              decided, this screen states the retest it can stand behind and no
              other. Do not add the annual line back without checking 3b. */}
        </div>
      )}

      <div className="ap-card">
        <span className="ap-lbl">{waiting ? 'Your kit' : 'This result'}</span>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
          {waiting
            ? `Your ${kitName} panel is with the lab.`
            : `${latest?.markers.length} markers from your ${kitName} panel${
                latest?.collectedAt
                  ? `, collected ${new Date(latest.collectedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}`
                  : ''
              }.`}
          {results.length > 1 ? ` Two sets of results, ${results.length} dates on your record.` : ''}
        </p>
      </div>

      {/* The prototype's action rows. They do nothing here, which is true of
          every control on this route, and they are what makes the account screen
          an account screen rather than a paragraph about one.

          The GP row appears only when the engine actually routed a marker out of
          the business, so it cannot read as decoration. */}
      {!waiting && routesToGp && (
        <button type="button" className="ap-rowlink">
          <span className="ap-rowlink__t">
            <span className="ap-rowlink__n">GP handoff summary</span>
            <span className="ap-rowlink__d">One page, written for a clinician &middot; ready</span>
          </span>
          <span className="ap-chev" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </button>
      )}

      {!waiting && (
        <button type="button" className="ap-rowlink">
          <span className="ap-rowlink__t">
            <span className="ap-rowlink__n">Download my results</span>
            <span className="ap-rowlink__d">Yours whatever you decide about membership</span>
          </span>
          <span className="ap-chev" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </button>
      )}

      {member && (
        <button type="button" className="ap-rowlink">
          <span className="ap-rowlink__t">
            <span className="ap-rowlink__n">Ask the clinician</span>
            <span className="ap-rowlink__d">Answered generally, published for all members</span>
          </span>
          <span className="ap-chev" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </button>
      )}

      {/* ⚠ THE MEMBER SHOP IS DELIBERATELY NOT PORTED. The prototype lists
          "Vitamin D3 + K2, GBP 18.95, member price" here. Putting a supplement
          PRICE on an ungated public surface is a third compliance question on
          this route, on top of the results report (CA-046) and the membership
          price, and nobody has asked it. Flagged in 03_compliance/STATE.md. */}

      <div className="ap-card">
        <span className="ap-lbl">Your data</span>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 8, color: 'var(--ap-ink-2)' }}>
          One UK data controller. Your results are never sold. You can export your results as CSV or
          request erasure at any time, member or not.
        </p>
      </div>
    </div>
  )
}

/* ---------------- Tabs ---------------- */

/*
 * 🔄 THE TAB BAR IS A SIBLING OF THE SCROLL AREA, NOT INSIDE IT (2026-09-07).
 * It used to be the last child of the shell with `position: sticky; bottom: 0`,
 * which meant the screen scrolled UNDER it and the last card on a long screen sat
 * behind the tabs. The prototype makes it a flex sibling of the scroll region, so
 * the content ends where the tabs begin. That is a structural difference, not a
 * styling one, which is why it is exported rather than styled around.
 */
export function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const TABS = [
    {
      id: 'results' as const,
      label: 'Results',
      path: 'M3 12h4l3 8 4-16 3 8h4',
    },
    {
      id: 'plan' as const,
      label: 'Plan',
      path: 'M4 5h16v16H4zM8 3v4M16 3v4M4 11h16M9 15.5l2 2 4-4',
    },
    {
      id: 'record' as const,
      label: 'Record',
      path: 'M3 3v18h18M7 15l4-4 3 3 5-6',
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
