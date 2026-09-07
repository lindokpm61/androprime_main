'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AppShell, TAB_TITLES } from './AppShell'
import type { Tab } from './AppShell'
import { barMaxFor } from './RangeTrack'
import { classify } from '@/lib/results/classifier'
import { badgeFor } from '@/lib/results/resultSeverity'
import { DEMO_RESULTS, DEMO_JOURNEYS, journeyAvailable } from '@/lib/results/demo'
import type {
  DemoDates,
  DemoEngineInput,
  DemoJourney,
  DemoMarkerSeed,
  DemoResult,
} from '@/lib/results/demo'
import type { ClassifiedResult, KitData, SingleResult } from '@/lib/results/types'

/*
 * THE PROTOTYPE'S STAGE. Ported 2026-09-07.
 *
 * 🔴 WHY THIS FILE EXISTS. The 2026-09-06 build rebuilt the prototype's SCREENS
 * faithfully and dropped its STAGE entirely: the phone bezel, the control rail
 * with its value slider and band presets, the theme toggle, the closing notes.
 * Keith read the result and said it was "completely different from the actual
 * prototype". It was, and this is the part that was missing.
 *
 * 🟢 THE SLIDER IS BETTER HERE THAN IN THE PROTOTYPE, and that is the one place
 * this deliberately does not copy. The prototype TRANSCRIBED the bands from
 * `classifier.ts` into a literal in the page, which is why its own header says
 * they cannot stay current and warns that where the two disagree the prototype
 * is wrong by construction. This calls the REAL `classify()` on every drag. Move
 * a threshold in `thresholds.md` and this slider follows it the same day.
 *
 * 🔴 STILL NO DATABASE AND NO USER. `classify()` is a pure function over values;
 * the seeds arrive as props from a server component that read a closed fixture
 * set. Nothing here can reach Supabase and there is no user id to hand it.
 *
 * ⚠ ONE ENGINE DIFFERENCE, and it cannot touch a verdict.
 * `isMaintenanceOfferEnabled()` reads `process.env.MAINTENANCE_OFFER_ENABLED`,
 * which Next inlines as undefined in a client bundle, so it is always false
 * here. That is the flag's OFF state, which its own comment describes as
 * "byte-identical to before this feature existed". It gates a CTA, never a band.
 */

export interface DemoStageProps {
  engine: DemoEngineInput
  result: DemoResult
  journey: DemoJourney
  dates: DemoDates | null
}

export function DemoStage({ engine, result, journey, dates }: DemoStageProps) {
  /*
   * THREE THEME STATES, which is what the prototype has: null follows the
   * machine, 'light' and 'dark' are the reader overruling it. The first pass of
   * this port had a manual toggle only, so it opened white beside a prototype
   * that opens dark, and that was the most visible difference between them.
   *
   * `systemDark` cannot be read during render: there is no `matchMedia` on the
   * server and guessing would hydrate wrong. It is read after mount and only
   * drives the BUTTON LABEL, because the colours themselves are done in CSS by
   * `prefers-color-scheme`, which needs no JavaScript and cannot flash.
   */
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)
  const [systemDark, setSystemDark] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  const dark = theme ? theme === 'dark' : systemDark
  const [tab, setTab] = useState<Tab>('results')
  const [openMarker, setOpenMarker] = useState<string | null>(null)
  const [compare, setCompare] = useState(false)
  /* Only the LATEST result is editable. History does not move, which is the
     prototype's own rule and the reason the rail says so out loud. */
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(engine.seeds.map((s) => [s.markerName, s.value]))
  )

  const kits = useMemo<KitData[]>(() => {
    const run = (seeds: DemoMarkerSeed[], override: boolean): ClassifiedResult[] =>
      classify({
        kitType: engine.kitType,
        biomarkers: seeds.map((s) => ({
          ...s,
          value: override ? (values[s.markerName] ?? s.value) : s.value,
        })),
        symptomAnswers: engine.symptomAnswers,
        qualifierResponses: [],
        userAge: engine.userAge,
      })

    const latest: SingleResult = {
      resultId: 'demo-latest',
      collectedAt: engine.collectedAt,
      markers: run(engine.seeds, true),
      hasQualifierPending: false,
    }
    if (!engine.baseline) return [{ kitType: engine.kitType, results: [latest] }]

    const baseline: SingleResult = {
      resultId: 'demo-baseline',
      collectedAt: engine.baselineCollectedAt,
      markers: run(engine.baseline, false),
      hasQualifierPending: false,
    }
    return [{ kitType: engine.kitType, results: [baseline, latest] }]
  }, [engine, values])

  const markers = kits[0]?.results[kits[0].results.length - 1]?.markers ?? []
  const open = markers.find((m) => m.markerName === openMarker) ?? null
  const waiting = journey.id === 'waiting'
  const member = journey.id === 'member'

  return (
    <div className="ap-stage" data-ap-theme={theme ?? undefined}>
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
            onClick={() => setTheme(dark ? 'light' : 'dark')}
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
            Every screen a customer actually reaches: waiting for the lab, every marker on his panel,
            the daily plan, the month-one notice, the record after a retest, and the account.{' '}
            <b>Tap through it as he would.</b> The panel beside it moves him between the three states
            and is not part of the product.
          </p>
        </header>

        <div className="ap-split">
          {/* ---------------- the phone ---------------- */}
          <div className="ap-phonewrap">
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
                  <span className="ap-appbar__ttl">{open ? open.markerName : TAB_TITLES[tab]}</span>
                  {/* Membership begins when the RESULT lands, not at purchase and
                      not when a card is first charged. So the pill is off on day 3
                      and on from day 14. */}
                  <span className="ap-memberpill" hidden={waiting}>
                    Member
                  </span>
                </div>

                <div className="ap-scrollarea">
                  <AppShell
                    kits={kits}
                    journey={journey.id}
                    dates={dates}
                    tab={tab}
                    onTab={setTab}
                    openMarker={openMarker}
                    onOpenMarker={setOpenMarker}
                    compare={compare}
                  />
                </div>
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
                waiting fifteen weeks.
              </p>

              <nav className="ap-seg" aria-label="Point in the journey">
                {DEMO_JOURNEYS.map((j) =>
                  journeyAvailable(j, result) ? (
                    <Link
                      key={j.id}
                      href={`/demo?r=${result.id}&s=${j.id}`}
                      aria-current={j.id === journey.id ? 'true' : undefined}
                    >
                      {j.label}
                    </Link>
                  ) : (
                    <span
                      key={j.id}
                      aria-disabled="true"
                      title="This result has no retest written for it, so there is no second point to show."
                    >
                      {j.label}
                    </span>
                  )
                )}
              </nav>

              <nav className="ap-seg" aria-label="Sample results">
                {DEMO_RESULTS.map((d) => (
                  <Link
                    key={d.id}
                    href={`/demo?r=${d.id}&s=${journeyAvailable(journey, d) ? journey.id : 'result'}`}
                    aria-current={d.id === result.id ? 'true' : undefined}
                  >
                    {d.label}
                  </Link>
                ))}
              </nav>
              <p className="ap-railhint">{result.blurb}</p>
            </div>

            {open && !waiting && (
              <MarkerControl
                result={open}
                member={member}
                onValue={(v) =>
                  setValues((prev) => ({ ...prev, [open.markerName]: v }))
                }
              />
            )}

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
                {WATCH[journey.id].map((t, i) => (
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
                Every explanation, every recommendation and every verdict word is the engine&rsquo;s
                own copy, not written for this page.
              </p>
            </div>
            <div className="ap-ncard">
              <h3>Mocked</h3>
              <p>
                <b>The result, the account and every interaction.</b> No login, no database, nothing
                ingested. The values come from a closed set of fixtures and are recomputed in your
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
                <b>Some markers get no verdict at all</b>, on purpose. <b>And the app never joins a
                marker to a symptom</b>, on the one screen where it would be easiest.
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
  member,
  onValue,
}: {
  result: ClassifiedResult
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

  return (
    <div className="ap-railcard">
      <span className="ap-lbl">{result.markerName}</span>
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
          ? 'The baseline is fixed. History does not move, so the slider only drives the retest.'
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
 * The walkthrough. It points at things that are TRUE OF THE ENGINE rather than
 * of a drawing, so it cannot go stale the way the prototype's list did: that one
 * said "Month one is the ask" for nine days after the ask became a notice.
 */
const WATCH: Record<string, string[]> = {
  waiting: [
    'Most of the app is empty, and it says so rather than inventing something to show.',
    'Every tab has its own empty state. The plan has no number to move yet; the record has one point coming, not two.',
    'No progress bar, because a bar stuck at 60% for two days is worse than no bar.',
  ],
  result: [
    'Open any flagged marker, then drag the slider in this rail. The verdict, the bands and the copy are recomputed by the live engine.',
    'Flip "show what everyone else shows". Our bands disappear and the laboratory interval stays exactly where it was. That gap is the whole argument.',
    'Go to Plan. Month one is included with the kit, so it is a notice with a charge date, not an ask. Note what it locks: nothing.',
    'Some markers carry no verdict at all, on purpose.',
  ],
  member: [
    'Go to Record. Two points, and the only words on it are Risen, Fallen and Unchanged.',
    'The nutritional markers moved and testosterone did not. A demo where everything improves is a pitch.',
    'Nothing joins the change to a cause. That is an interpretation we are not registered to make.',
    'The account names the retest it can stand behind and no other.',
  ],
}
