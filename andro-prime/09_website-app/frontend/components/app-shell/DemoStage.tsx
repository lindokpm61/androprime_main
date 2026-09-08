'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AppShell, TabBar, TAB_TITLES } from './AppShell'
import type { DemoRow, Tab } from './AppShell'
import { barMaxFor } from './RangeTrack'
import { classify } from '@/lib/results/classifier'
import { badgeFor } from '@/lib/results/resultSeverity'
import { DEMO_JOURNEYS, getDemoDates } from '@/lib/results/demo'
import { useDemoTheme } from './DemoTheme'
import type {
  DemoDates,
  DemoEngineInput,
  DemoJourney,
  DemoJourneyId,
  DemoMarkerSeed,
} from '@/lib/results/demo'
import type { ClassifiedResult } from '@/lib/results/types'

/*
 * THE PROTOTYPE'S STAGE. Rebuilt 2026-09-07.
 *
 * The phone bezel, the control rail and the closing notes, following
 * `design/prototypes/demo-account-interactive.html` panel for panel. Its rail is
 * three cards and this is those three cards:
 *
 *   1. DEMO CONTROLS -- the label, the "not part of the product" hint, the three
 *      journey states, and the value slider, WHICH ONLY APPEARS WHILE A MARKER
 *      IS OPEN. That last part is easy to miss and it matters: a slider with
 *      nothing to drive is a control that does nothing.
 *   2. THE COMPARE SWITCH.
 *   3. WHAT TO WATCH -- a numbered walkthrough, different in each state.
 *
 * 🟢 THE SLIDER IS BETTER HERE THAN IN THE PROTOTYPE, and it is the one place
 * this deliberately does not copy. The prototype TRANSCRIBED the bands from
 * `classifier.ts` into a literal in the page, which is why its own header says
 * they cannot stay current and warns that where the two disagree the prototype
 * is wrong by construction. This calls the REAL `classify()` on every drag. Move
 * a threshold in `thresholds.md` and this slider follows it the same day.
 *
 * 🔴 STILL NO DATABASE AND NO USER. `classify()` is a pure function over values;
 * the seeds arrive as props from a server component that read a closed fixture
 * pair. Nothing here can reach Supabase and there is no user id to hand it.
 *
 * 🔴 ONLY THE RETEST IS EDITABLE, IN THE MEMBER STATE. History does not move,
 * which is the prototype's own rule, and the rail says so out loud. In the
 * result state the slider drives the first result, because that is the only
 * reading on screen.
 *
 * ⚠ ONE ENGINE DIFFERENCE, and it cannot touch a verdict.
 * `isMaintenanceOfferEnabled()` reads `process.env.MAINTENANCE_OFFER_ENABLED`,
 * which Next inlines as undefined in a client bundle, so it is always false
 * here. That is the flag's OFF state, which its own comment describes as
 * "byte-identical to before this feature existed". It gates a CTA, never a band.
 */

/*
 * PREVIEW FLAGS (2026-09-08). Two proposals Keith asked to see before anything
 * is decided. Both are opt-in from the URL and both are OFF by default:
 * `?preview=device`, `?preview=attract`, `?preview=both`.
 *
 * 🔴 WITH NO FLAG, NOTHING BELOW RUNS AND NOTHING RENDERS DIFFERENTLY. No timer
 * is started, no observer is attached, and the device modifier class is absent,
 * so every rule guarding it is unreachable. That is the whole reason these are
 * query flags rather than a rewrite of the component: the twelve state-and-tab
 * cells verified on 2026-09-08 are still exactly what `/demo` renders.
 */
export interface DemoPreview {
  /** A drawn device body with a resting tilt, in place of the flat bezel. */
  device: boolean
  /** Walk the journey on a timer until the reader touches it. */
  attract: boolean
}

const NO_PREVIEW: DemoPreview = { device: false, attract: false }

/* Long enough to read a screen, short enough that all three land inside the
   time someone spends deciding whether this page is worth their attention. */
const ATTRACT_STEP_MS = 4500

export interface DemoStageProps {
  engine: DemoEngineInput
  journey: DemoJourney
  dates: DemoDates | null
  preview?: DemoPreview
}

export function DemoStage({ engine, journey, dates, preview = NO_PREVIEW }: DemoStageProps) {
  /*
   * THREE THEME STATES, which is what the prototype has: null follows the
   * machine, 'light' and 'dark' are the reader overruling it.
   *
   * 🔴 THE STATE LIVES ABOVE THIS COMPONENT, in `DemoTheme`, because the nav and
   * the footer need it too and they are rendered by the route's layout. Holding
   * it here is what left them white while the stage went dark.
   */
  const { setChoice, dark } = useDemoTheme()

  const [tab, setTab] = useState<Tab>('results')
  const [openMarker, setOpenMarker] = useState<string | null>(null)
  const [compare, setCompare] = useState(false)

  /* ------------------------------------------------------------------ attract
   * THE LOOP DRIVES THE REAL JOURNEY STATE OVER THE REAL ENGINE OUTPUT. It is
   * not a recording of the page, and that distinction is the entire argument
   * for building it here rather than rendering a video: when a band moves, this
   * moves, exactly as the rest of the page does. A video of a demo is the
   * 1,153-line transcribed prototype again, in a format nobody can diff.
   *
   * `autoId` is null until the loop actually advances something, so the default
   * render resolves `activeJourney` to the server's journey by identity.
   */
  const [autoId, setAutoId] = useState<DemoJourneyId | null>(null)
  const [handedOver, setHandedOver] = useState(false)
  const [inView, setInView] = useState(false)
  const [motionOk, setMotionOk] = useState(false)
  const phoneRef = useRef<HTMLDivElement | null>(null)

  const activeJourney = useMemo(
    () => (autoId ? DEMO_JOURNEYS.find((j) => j.id === autoId) ?? journey : journey),
    [autoId, journey]
  )
  /* Derived, never carried: the same pure function the server called, so a
     looped state cannot show a date the URL-driven state would not. */
  const activeDates = useMemo(() => (autoId ? getDemoDates(autoId) : dates), [autoId, dates])

  const attractRunning = preview.attract && motionOk && inView && !handedOver

  useEffect(() => {
    if (!preview.attract) return
    setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [preview.attract])

  /* Only plays while it is on screen. A loop that starts on load has already
     finished by the time anyone scrolls down to the thing it was advertising. */
  useEffect(() => {
    if (!preview.attract) return
    const el = phoneRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [preview.attract])

  /* The first touch of anything hands over for good, and it never restarts.
     A screen that keeps moving under someone who is reading it is worse than
     one that never moved at all. */
  useEffect(() => {
    if (!attractRunning) return
    const stop = () => setHandedOver(true)
    window.addEventListener('pointerdown', stop, { passive: true })
    window.addEventListener('keydown', stop)
    return () => {
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [attractRunning])

  useEffect(() => {
    if (!attractRunning) return
    const order = DEMO_JOURNEYS.map((j) => j.id)
    const tick = window.setInterval(() => {
      setAutoId((prev) => order[(order.indexOf(prev ?? journey.id) + 1) % order.length])
    }, ATTRACT_STEP_MS)
    return () => window.clearInterval(tick)
  }, [attractRunning, journey.id])

  const member = activeJourney.id === 'member'
  const waiting = activeJourney.id === 'waiting'

  /* The editable point. In the member state that is the retest; otherwise the
     first result. Keyed by marker name so a value survives a tab change. */
  const [baselineValues, setBaselineValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(engine.baselineSeeds.map((s) => [s.markerName, s.value]))
  )
  const [retestValues, setRetestValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(engine.retestSeeds.map((s) => [s.markerName, s.value]))
  )

  /*
   * THE NINE ROWS, AND WHY THEY ARE BUILT HERE RATHER THAN BY
   * `buildDashboardFromScenario`.
   *
   * 🔴 THE TWO PURCHASES ARE DIFFERENT KITS. That helper stacks results of the
   * SAME kit type into one `KitData` and assumes every marker has a pair, which
   * is exactly what stops being true when the retest is a Kit 2. So the two
   * results are classified SEPARATELY -- each as the real kit it is, which is
   * also what the engine would see in production -- and then joined by marker
   * name. Five of the nine find no partner and carry `previous: null`.
   */
  const rows = useMemo<DemoRow[]>(() => {
    const run = (
      kit: DemoEngineInput['baselineKit'],
      seeds: DemoMarkerSeed[],
      overrides: Record<string, number> | null
    ): ClassifiedResult[] =>
      classify({
        kitType: kit,
        biomarkers: seeds.map((s) => ({
          ...s,
          value: overrides ? (overrides[s.markerName] ?? s.value) : s.value,
        })),
        symptomAnswers: engine.symptomAnswers,
        qualifierResponses: [],
        userAge: engine.userAge,
      })

    const baseline = run(engine.baselineKit, engine.baselineSeeds, member ? null : baselineValues)

    if (!member) {
      return baseline.map((r) => ({ latest: r, previous: null, kit: engine.baselineKit }))
    }

    const retest = run(engine.retestKit, engine.retestSeeds, retestValues)
    const byName = new Map(retest.map((r) => [r.markerName, r]))

    return baseline.map((first) => {
      const second = byName.get(first.markerName)
      return second
        ? { latest: second, previous: first, kit: engine.retestKit }
        : { latest: first, previous: null, kit: engine.baselineKit }
    })
  }, [engine, member, baselineValues, retestValues])

  const open = openMarker ? rows.find((r) => r.latest.markerName === openMarker) ?? null : null
  /* Only a re-measured marker can be dragged in the member state: the others
     have no second point, and moving history is the one thing the rail refuses. */
  const editable = open ? (member ? open.previous !== null : true) : false

  return (
    <div className="ap-stage">
      <div className="ap-stage__wash" aria-hidden="true" />
      <div className="ap-stage__inner">
        <div className="ap-bar">
          <span className="ap-chip">
            <i aria-hidden="true" />
            Demo account &middot; sample data
          </span>
          <span className="ap-bar__spring" />
          <button
            type="button"
            className="ap-themebtn"
            onClick={() => setChoice(dark ? 'light' : 'dark')}
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* 🔴 NOT DISMISSIBLE, and it lives INSIDE the themed stage so it cannot
            be left on a white card when the page is dark. A reader who arrives
            from a shared link must still be able to tell these numbers are
            nobody's. CA-046 leans on this being unmissable. */}
        <div className="ap-note">
          <span className="ap-note__tag">Demonstration</span>
          <p>
            These results are a sample. They do not belong to a real person, and no
            customer&rsquo;s data is used here. Everything else is the report you would get: the same
            laboratory ranges, the same action bands, and the same explanations.
          </p>
        </div>

        <header className="ap-intro">
          <h1>The whole app, on a phone.</h1>
          <p>
            Every screen a customer actually reaches: waiting for the lab, all nine markers, the
            daily plan, the month-one notice, the record after a retest, and the account.{' '}
            <b>Tap through it as he would.</b> The panel beside it moves him between the three states
            and is not part of the product.
          </p>
        </header>

        <div className="ap-split">
          {/* ---------------- the phone ---------------- */}
          <div
            ref={phoneRef}
            className={preview.device ? 'ap-phonewrap ap-phonewrap--device' : 'ap-phonewrap'}
          >
            {/* Says what is happening, so a screen that moves on its own reads as
                deliberate rather than as a fault, and says when it has STOPPED,
                or the handover is invisible and the reader sits waiting.

                🔴 ABOVE THE DEVICE, NOT BELOW IT. The phone is 812px tall and
                starts around 480px down, so anything after it is off-screen on a
                1100px viewport: the first version put the one line explaining the
                movement in the only place the reader watching the movement
                cannot see. */}
            {preview.attract && (
              <p className="ap-attract" data-live={attractRunning ? 'true' : undefined}>
                <span className="ap-attract__dots" aria-hidden="true">
                  {DEMO_JOURNEYS.map((j) => (
                    <i key={j.id} data-on={j.id === activeJourney.id ? 'true' : undefined} />
                  ))}
                </span>
                {attractRunning ? 'Playing through the journey. Touch it to take over.' : 'Yours to drive.'}
              </p>
            )}

            <div className="ap-phone">
              <div className="ap-notch" aria-hidden="true" />
              <div className="ap-viewport">
                <div className="ap-sbar" aria-hidden="true">
                  <span>09:41</span>
                  <span className="ap-sbar__icons">
                    <svg viewBox="0 0 18 12">
                      <rect x="0" y="8" width="3" height="4" rx="1" />
                      <rect x="5" y="5" width="3" height="7" rx="1" />
                      <rect x="10" y="2" width="3" height="10" rx="1" />
                      <rect x="15" y="0" width="3" height="12" rx="1" opacity=".35" />
                    </svg>
                    <svg viewBox="0 0 18 12">
                      <rect
                        x="0" y="2" width="14" height="8" rx="2.4"
                        fill="none" stroke="currentColor" strokeWidth="1.3"
                      />
                      <rect x="1.6" y="3.6" width="9" height="4.8" rx="1.2" />
                      <rect x="15.4" y="4.6" width="1.8" height="2.8" rx=".8" />
                    </svg>
                  </span>
                </div>

                <div className="ap-appbar">
                  <button
                    type="button"
                    className="ap-iconbtn"
                    aria-label="Back"
                    hidden={!open}
                    onClick={() => setOpenMarker(null)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <span className="ap-appbar__ttl">
                    {open ? open.latest.markerName : TAB_TITLES[tab]}
                  </span>
                  {/* Membership begins when the RESULT lands, not at purchase and
                      not when a card is first charged. So the pill is off on day 3
                      and on from day 14. */}
                  <span className="ap-memberpill" hidden={waiting}>
                    Member
                  </span>
                </div>

                <div className="ap-scrollarea">
                  <AppShell
                    rows={rows}
                    journey={activeJourney.id}
                    dates={activeDates}
                    tab={tab}
                    openMarker={openMarker}
                    onOpenMarker={setOpenMarker}
                    compare={compare}
                  />
                </div>

                <TabBar
                  tab={tab}
                  markerOpen={open !== null}
                  onTab={(t) => {
                    setTab(t)
                    setOpenMarker(null)
                  }}
                />
              </div>
            </div>
          </div>

          {/* ---------------- the control rail ---------------- */}
          <div className="ap-rail">
            <div className="ap-railcard">
              <span className="ap-lbl">Demo controls</span>
              <p className="ap-railcard__hint">
                Not part of the product. A real member cannot move his own result, and there is no
                state switcher in his account. This is here so you can walk the whole journey without
                waiting thirteen weeks.
              </p>

              {/* 🔴 ONE AXIS, THE JOURNEY. There was a second nav here that
                  switched between three sample results, two of them Kit 1. Keith
                  removed it on 2026-09-07: the demo is built on Kit 3 because
                  that is the panel that shows the most of the product. */}
              <nav className="ap-seg" aria-label="Point in the journey">
                {DEMO_JOURNEYS.map((j) => (
                  <Link
                    key={j.id}
                    href={`/demo?s=${j.id}`}
                    aria-current={j.id === activeJourney.id ? 'true' : undefined}
                  >
                    {j.label}
                  </Link>
                ))}
              </nav>

              {/* The prototype's `#markerctl`: present only while a marker is
                  open, because a slider with nothing to drive is a dead control. */}
              {open && !waiting && (
                <MarkerControl
                  result={open.latest}
                  editable={editable}
                  member={member}
                  onValue={(v) => {
                    const name = open.latest.markerName
                    if (member) setRetestValues((p) => ({ ...p, [name]: v }))
                    else setBaselineValues((p) => ({ ...p, [name]: v }))
                  }}
                />
              )}
            </div>

            <div className="ap-railcard">
              <label className="ap-switch">
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(e) => setCompare(e.target.checked)}
                />
                <span className="ap-switch__knob" aria-hidden="true" />
                <span className="ap-switch__txt">
                  Show what everyone else shows
                  <p>
                    Strips out our action bands and leaves only the laboratory reference range. That
                    is the view your supplier&rsquo;s own portal gives, and what the other funnels put
                    in front of the same number.
                  </p>
                </span>
              </label>
            </div>

            <div className="ap-watch">
              <span className="ap-lbl">What to watch</span>
              <ol>
                {WATCH[activeJourney.id].map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* ---------------- the closing notes ---------------- */}
        <section className="ap-notes">
          <h2>What this is, and what it is not.</h2>
          <div className="ap-ngrid">
            <div className="ap-ncard">
              <h3>Real</h3>
              <p>
                <b>Every band is the live one.</b> This page calls the same <b>classify()</b> that
                serves a paying customer, against the Ewa-approved thresholds. Drag the slider and the
                verdict is recomputed by the engine, not looked up in a table.
              </p>
              <p>
                All nine markers are here, including the one with no verdict. Every explanation,
                every recommendation and every verdict word is the engine&rsquo;s own copy, not
                written for this page.
              </p>
            </div>
            <div className="ap-ncard">
              <h3>Mocked</h3>
              <p>
                <b>The result, the account and every interaction.</b> No login, no database, nothing
                ingested. The values come from a closed pair of fixtures and are recomputed in your
                browser.
              </p>
              <p>
                Dates are derived from the result, not typed: the retest is{' '}
                <b>the engine&rsquo;s own interval</b> after it, so this page cannot drift from the
                product the way a drawing can.
              </p>
            </div>
            <div className="ap-ncard">
              <h3>Three things to notice</h3>
              <p>
                <b>The numbers are never gated.</b> Month one locks nothing at all: it comes with the
                kit. The results stay open whatever happens to the membership, because a person has a
                right of access to his own health data.
              </p>
              <p>
                <b>The free androgen index has no verdict at all</b>, on purpose. <b>And the app
                never joins a marker to a symptom</b>, on the one screen where it would be easiest.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- the slider */

/*
 * THE VALUE SLIDER, and the reason it is worth the code: it lets a sceptical
 * reader move the number himself and watch the verdict change. That is a
 * different argument from being shown one flattering result.
 *
 * 🔴 IT STATES NO THRESHOLD. The domain comes from `barMaxFor`, which the track
 * already uses, so the rail and the slider cannot disagree about where a value
 * sits. The presets are the midpoints of the engine's OWN `displayZones`, so
 * every button lands inside a band the classifier defined. Nothing here names a
 * cutoff, and the prototype's hand-typed band chips ("Severe", "Equivocal") are
 * deliberately not reproduced: those strings are not in the engine.
 */
function MarkerControl({
  result,
  editable,
  member,
  onValue,
}: {
  result: ClassifiedResult
  editable: boolean
  member: boolean
  onValue: (v: number) => void
}) {
  const max = barMaxFor(result)
  const decimals = (String(result.value).split('.')[1] ?? '').length
  const step = decimals >= 3 ? 0.005 : decimals === 2 ? 0.01 : decimals === 1 ? 0.1 : 1

  // Midpoint of each of the engine's zones, so a click always lands in-band.
  const presets: { at: number; label: string }[] = []
  let prev = 0
  for (const z of result.displayZones) {
    const top = z.upTo ?? max
    presets.push({ at: Number(((prev + top) / 2).toFixed(3)), label: z.color })
    prev = top
    if (z.upTo === null) break
  }

  if (!editable) {
    return (
      <p className="ap-fixnote">
        {result.markerName} was not re-measured: the included retest is a Kit 2 and this marker is
        not on it. There is one reading, and one reading does not move.
      </p>
    )
  }

  return (
    <div className="ap-markerctl">
      <span className="ap-lbl">
        {member ? 'Retest value' : 'Result value'} &middot; {result.markerName}
      </span>
      <p className="ap-railcard__hint">
        Drag it. The verdict, the bands and the copy below are recomputed by the engine.
      </p>
      <input
        type="range"
        className="ap-slider"
        min={0}
        max={max}
        step={step}
        value={result.value}
        aria-label={`${result.markerName} value`}
        onChange={(e) => onValue(Number(e.target.value))}
      />
      <div className="ap-sread">
        <span>0</span>
        <b>
          {result.value} {result.unit}
        </b>
        <span>{Number(max.toFixed(1))}</span>
      </div>
      <div className="ap-presets">
        {presets.map((p) => (
          <button
            key={p.at}
            type="button"
            className="ap-preset"
            aria-pressed={Math.abs(p.at - result.value) < step / 2}
            onClick={() => onValue(p.at)}
          >
            {ZONE_WORD[p.label] ?? p.label}
          </button>
        ))}
      </div>
      <p className="ap-fixnote">
        {member
          ? 'The first result is fixed. History does not move, so the slider only drives the retest.'
          : `Current verdict: ${badgeFor(result.state).label}`}
      </p>
    </div>
  )
}

/* The engine's three zone colours, said in words. Not clinical bands and not
   verdicts: `badgeFor` owns those and it is what the fixnote prints. */
const ZONE_WORD: Record<string, string> = {
  optimal: 'In our band',
  warning: 'Between the ranges',
  critical: 'Outside our band',
}

/*
 * The walkthrough, following the prototype's `WATCH` list state for state. Each
 * line points at something TRUE OF THE ENGINE rather than of a drawing, so it
 * cannot go stale the way the prototype's did: that one said "Month one is the
 * ask" for nine days after the ask became a notice.
 */
const WATCH: Record<string, string[]> = {
  waiting: [
    'The tracker dates every completed step and refuses to date the one it cannot know.',
    'No percentage and no progress bar, because a number stuck at 60% for two days is worse than no number.',
    'Every tab has its own empty state. The plan has no number to move yet; the record has one point coming, not two.',
  ],
  result: [
    'Open Testosterone. He is inside his laboratory’s range and under the number a GP acts on, and the card routes him out of the business.',
    'Open Free Androgen Index. It has a hollow marker and no verdict at all, on purpose.',
    'Flip "show what everyone else shows", then reopen testosterone. Our bands disappear, the laboratory interval stays exactly where it was, and the page has nothing left to say.',
    'Go to Plan. Month one is included with the kit, so it is a notice with a charge date, not an ask. Note what it locks: nothing.',
  ],
  member: [
    'Open Vitamin D. 31 to 58, crossed out of the low band. That is the retest paying out.',
    'Open Testosterone. There is no second point at all: the included retest is a Kit 2, and the hormone markers are not on it.',
    'On any re-measured marker, look at the two plots. His energy rose too, and the app never says one caused the other.',
    'Go to Record for all nine markers across both purchases, and note that only four of them moved.',
  ],
}
