import { buildDashboardFromScenario } from './buildDashboardFromScenario'
import { SCENARIOS } from './fixtures'
import { FIRST_CYCLE_RETEST_DAYS } from '@/lib/membership/entitlement'
import type { CheckinEntry } from '@/lib/membership/checkin'
import type { DashboardData, ScenarioName, KitType } from './types'

/*
 * THE PUBLIC DEMO'S SCENARIO SET AND JOURNEY STATES.
 *
 * 🔴 WHY THIS FILE EXISTS RATHER THAN REUSING `?dev=`. `getDashboardData` has a
 * fixture branch, and it is guarded by `process.env.NODE_ENV !== 'production'`
 * for a good reason: it takes an ARBITRARY scenario name off the query string.
 * Opening that in production would not be a demo, it would be a public endpoint
 * that renders any fixture in the repository, including the ones written to
 * exercise GP-referral and sample-failure paths. The guard stays exactly as it
 * is. This module is a separate, deliberately production-enabled path with a
 * CLOSED SET: an unknown id falls back to the default rather than reaching the
 * registry, so the URL cannot select anything that is not listed here.
 *
 * 🔴 IT READS NO DATABASE AND TAKES NO USER. `buildDashboardFromScenario` runs
 * the real `classify()` over fixture values and returns a `DashboardData`; there
 * is no Supabase client on this path and no user id to pass one. That is what
 * makes the homepage's promise -- "We never put your data in it" -- structurally
 * true rather than a policy someone has to remember.
 *
 * ⚠ THE THREE ENTRIES ARE AN ARGUMENT, NOT A SAMPLE. They were chosen so the
 * demo cannot be read as the flattering case: one result where the laboratory
 * and our action bands disagree, one where there is nothing to do, and one that
 * routes to a GP and earns the business nothing. Removing the second or the
 * third turns this from a demonstration into a pitch.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 🔄 JOURNEY STATES ADDED 2026-09-07 (Keith). The demo previously had one axis,
 * the result, and every entry on it was the same moment in time: day 14. The
 * prototype has always had a second axis, and Keith's ruling on why it belongs
 * here is the reason it now exists in the product rather than only in a drawing:
 *
 *   "This is a demo, so surely it isn't dependent on the membership flag being
 *    enabled as part of the website. So it should demonstrate everything that is
 *    available that we're planning to do, as a potential customer will look at
 *    that and have a real visual of what's behind the membership program."
 *
 * 🔴 SO THE JOURNEY IS DELIBERATELY NOT GATED ON `MEMBERSHIP_ENABLED`. That flag
 * stops a customer BUYING a membership that is not finished. It is not a reason
 * to stop him SEEING what one is. The two are different questions and the demo
 * answers the second.
 *
 * ⚠ WHAT THAT WIDENS. `/demo` already carries an open compliance item (CA-046)
 * for putting a full results report on an ungated surface. The member state puts
 * a membership PRICE on that same surface, which is a second thing to rule on
 * and not the thing CA-046 was raised about. The route stays `noindex` until
 * both clear. See `03_compliance/STATE.md`.
 */

export interface DemoResult {
  /** URL id, e.g. `/demo?r=split`. Stable: it will end up in links. */
  id: string
  scenario: ScenarioName
  /** Switcher label. */
  label: string
  /** One line under the switcher saying what this result shows. */
  blurb: string
  /**
   * The second point, when one exists. Only the headline result has a retest
   * fixture, so only the headline result can show the member state; the others
   * would need their own retests written and none has been. `journeyFor` is
   * what stops the URL reaching a combination that has no data behind it.
   */
  retestScenario?: ScenarioName
}

export const DEMO_RESULTS: DemoResult[] = [
  {
    id: 'split',
    scenario: 'demo-kit3-split',
    retestScenario: 'demo-kit3-retest',
    label: 'Lab normal, three to monitor',
    blurb:
      'Kit 3, nine markers. Every value here is inside the laboratory reference range. Three of them sit outside the action bands our GP approved, and the report says so.',
  },
  {
    id: 'all-clear',
    scenario: 'optimal-testosterone',
    label: 'Nothing to act on',
    blurb:
      'Kit 1, five markers, all of them where you would want them. This is what the report looks like when there is nothing to tell you, and nothing to sell you.',
  },
  {
    id: 'gp',
    scenario: 'low-testosterone',
    label: 'A result that goes to a GP',
    blurb:
      'Kit 1, with testosterone below the action threshold. The next step here is a conversation with a doctor, not a product. That result earns us nothing.',
  },
]

export const DEFAULT_DEMO_ID = DEMO_RESULTS[0].id

/* ---------------------------------------------------------------- journey */

export type DemoJourneyId = 'waiting' | 'result' | 'member'

export interface DemoJourney {
  id: DemoJourneyId
  /** Switcher label. Carries the day so the passage of time is legible. */
  label: string
  /** One line saying what this moment is. */
  blurb: string
}

export const DEMO_JOURNEYS: DemoJourney[] = [
  {
    id: 'waiting',
    label: 'Day 3 · waiting for the lab',
    blurb:
      'The sample is posted and nothing has come back. Most of the app is empty at this point, and pretending otherwise would be the wrong demonstration.',
  },
  {
    id: 'result',
    label: 'Day 14 · first result, month one running',
    blurb:
      'The result has landed, which is the moment membership starts and the included 30 days begin. Everything is open. Nothing has been charged yet.',
  },
  {
    id: 'member',
    label: 'Day 104 · member, retest landed',
    blurb:
      'Three months on, one payment taken and the included retest back. This is the only state where a record exists, because a record needs two points.',
  },
]

export const DEFAULT_JOURNEY_ID: DemoJourneyId = 'result'

/* ------------------------------------------------------------- resolution */

/** Resolves a URL id to a listed result. Anything unknown gets the default. */
export function resolveDemoResult(id?: string): DemoResult {
  return DEMO_RESULTS.find((r) => r.id === id) ?? DEMO_RESULTS[0]
}

/**
 * Resolves a URL id to a journey state THAT THIS RESULT CAN ACTUALLY SHOW.
 * Asking for the member state on a result with no retest fixture falls back to
 * the first result rather than rendering a half-empty record, so no combination
 * reachable from the URL is one we have no data for.
 */
export function resolveDemoJourney(id: string | undefined, result: DemoResult): DemoJourney {
  const wanted = DEMO_JOURNEYS.find((j) => j.id === id)
  if (!wanted) return DEMO_JOURNEYS.find((j) => j.id === DEFAULT_JOURNEY_ID)!
  if (wanted.id === 'member' && !result.retestScenario) {
    return DEMO_JOURNEYS.find((j) => j.id === 'result')!
  }
  return wanted
}

/** Whether a journey state has data behind it for this result. */
export function journeyAvailable(journey: DemoJourney, result: DemoResult): boolean {
  return journey.id !== 'member' || Boolean(result.retestScenario)
}

/* ------------------------------------------------------------------ dates */

/*
 * HOW LONG THE LAB TAKES, in the demo. The kit pages promise the report "within
 * 2 to 5 working days of the lab receiving your sample", so four days is inside
 * what is already said publicly. It exists because the anchor ruling turns on
 * `received_at` and NOT `collected_at` -- deliberately, per that field's own
 * comment: "the window is about how long ago he learned something, not how long
 * ago he bled" -- and a fixture only carries a collection date.
 */
const RESULT_LAG_DAYS = 4

/** The included month, per the 2026-08-27 ruling. */
const INCLUDED_MONTH_DAYS = 30

export interface DemoDates {
  /** When the result landed. Everything else is anchored to this. */
  resultReceived: Date
  /** Last day of the included month. The card is charged the next day. */
  includedMonthEnds: Date
  /** First payment, i.e. day 31. Auto-renew ruling, 2026-09-07. */
  firstCharge: Date
  /** The included retest. `FIRST_CYCLE_RETEST_DAYS` from the result. */
  retestDue: Date
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setUTCDate(out.getUTCDate() + n)
  return out
}

/*
 * EVERY DATE THE DEMO SHOWS IS DERIVED HERE, FROM THE RESULT, and the retest
 * interval is imported from `entitlement.ts` rather than typed. That is the
 * 2026-09-07 anchor ruling expressed as code: "every customer-facing date is
 * anchored to the moment the lab result comes back." If `FIRST_CYCLE_RETEST_DAYS`
 * changes, this demo changes with it and cannot quietly go stale, which is
 * exactly how the prototype's old hand-typed "22 Oct" came to match no rule.
 */
export function getDemoDates(collectedAt: string | null | undefined): DemoDates | null {
  if (!collectedAt) return null
  const collected = new Date(collectedAt)
  if (Number.isNaN(collected.getTime())) return null

  const resultReceived = addDays(collected, RESULT_LAG_DAYS)
  const includedMonthEnds = addDays(resultReceived, INCLUDED_MONTH_DAYS)
  return {
    resultReceived,
    includedMonthEnds,
    firstCharge: addDays(includedMonthEnds, 1),
    retestDue: addDays(resultReceived, FIRST_CYCLE_RETEST_DAYS),
  }
}

/** "12 November 2026". Long form: these dates are read once, not scanned. */
export function formatDemoDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** "12 Nov". Short form, for the column headers on the record tab. */
export function formatDemoDateShort(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/* ------------------------------------------------------------- dashboards */

/**
 * Builds the dashboard for a listed result at a point in its journey. No
 * database, no user.
 *
 * The member state passes BOTH scenarios. `buildDashboardFromScenario` stacks
 * results of the same kit type into one `KitData`, so that is all it takes to
 * get a two-point record; no new machinery was needed for it.
 *
 * The waiting state still builds the result. Nothing renders it -- the shell
 * branches on the journey before it looks at any marker -- but it keeps the kit
 * type available for the screens that name the panel, and it keeps this
 * function's return type honest instead of introducing a second empty shape.
 */
export function getDemoDashboard(result: DemoResult, journey: DemoJourney): DashboardData {
  if (journey.id === 'member' && result.retestScenario) {
    return buildDashboardFromScenario([result.scenario, result.retestScenario])
  }
  return buildDashboardFromScenario([result.scenario])
}

/* ------------------------------------------------- the engine, client-side */

/*
 * 🔄 RAW VALUES FOR THE CONTROL RAIL, added 2026-09-07 with the prototype port.
 *
 * The prototype's rail lets you drag a marker's value and watch the verdict
 * change band. Reproducing that means re-classifying on every drag, which means
 * the CLIENT needs the raw biomarkers rather than the classified output.
 *
 * 🟢 AND THAT MAKES THE PORT BETTER THAN THE PROTOTYPE, not a copy of it. The
 * prototype's bands were TRANSCRIBED from `classifier.ts` into a literal in the
 * page, which is why its own header says they cannot stay current. Here the
 * slider calls the real `classify()`, so every verdict it produces is the
 * engine's and it follows a threshold change automatically.
 *
 * ⚠ ONE KNOWN DIFFERENCE, and it does not touch a verdict.
 * `isMaintenanceOfferEnabled()` reads `process.env.MAINTENANCE_OFFER_ENABLED`,
 * which Next inlines as undefined in a client bundle, so client-side it is
 * always false. That is the flag's OFF state and its own comment says OFF is
 * "byte-identical to before this feature existed". It gates a CTA, never a
 * band, an explanation or a state.
 */
export interface DemoMarkerSeed {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
}

export interface DemoEngineInput {
  kitType: KitType
  userAge: number | null
  symptomAnswers: { questionKey: string; answer: string | number | boolean }[]
  /** The values on screen. The rail drives these. */
  seeds: DemoMarkerSeed[]
  collectedAt: string | null
  /** The earlier result, when the member state has two. Never editable. */
  baseline: DemoMarkerSeed[] | null
  baselineCollectedAt: string | null
}

function seedsOf(name: ScenarioName): DemoMarkerSeed[] {
  const f = SCENARIOS[name]
  if (!f) return []
  return f.payload.biomarkers.map((b) => ({
    markerName: b.name,
    value: b.value,
    unit: b.unit,
    referenceLow: b.referenceRange.low,
    referenceHigh: b.referenceRange.high,
  }))
}

/**
 * Everything the client needs to re-run `classify()` itself. Still no database
 * and still no user: this is the same closed fixture set, handed over raw.
 */
export function getDemoEngineInput(result: DemoResult, journey: DemoJourney): DemoEngineInput {
  const twoPoint = journey.id === 'member' && result.retestScenario
  const latest = twoPoint ? result.retestScenario! : result.scenario
  const fixture = SCENARIOS[latest]
  return {
    kitType: fixture.payload.kitType,
    userAge: fixture.testAge ?? null,
    symptomAnswers: fixture.symptomAnswers.map((a) => ({
      questionKey: a.questionKey,
      answer: a.answer,
    })),
    seeds: seedsOf(latest),
    collectedAt: fixture.payload.collectedAt ?? null,
    baseline: twoPoint ? seedsOf(result.scenario) : null,
    baselineCollectedAt: twoPoint ? (SCENARIOS[result.scenario].payload.collectedAt ?? null) : null,
  }
}

/* ---------------------------------------------------------- waiting steps */

/*
 * 🔄 THE WAITING TRACKER, ported 2026-09-07 (second correction).
 *
 * The first pass of the journey work gave all three tabs one generic empty
 * state. That is right for Plan and Record, which is what the prototype does
 * there, and WRONG for Results, where the prototype draws a real screen: a
 * status strip, "where your sample is", a dated four-step tracker, and two cards
 * for when it lands. Keith spotted it by looking at the two side by side.
 *
 * 🔴 THE DATES ARE DERIVED, like every other date on this route. The prototype
 * hand-typed 11 / 14 / 15 / 18 Aug, which is exactly the kind of literal that
 * left its retest date matching no rule. These come off the fixture's collection
 * date, and "expected by" is the SAME `RESULT_LAG_DAYS` that decides when the
 * result lands in every other state, so the tracker cannot promise a date the
 * rest of the page disagrees with.
 *
 * The clock times are texture and are deliberately fixed: a tracker whose times
 * moved every render would read as live data, which this is not.
 */
export interface DemoStep {
  title: string
  detail: string
  state: 'done' | 'now' | 'todo'
}

export function getDemoWaitingSteps(collectedAt: string | null | undefined): DemoStep[] | null {
  if (!collectedAt) return null
  const collected = new Date(collectedAt)
  if (Number.isNaN(collected.getTime())) return null

  const on = (offset: number, time: string) =>
    `${addDays(collected, offset).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${time}`
  const expected = addDays(collected, RESULT_LAG_DAYS).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return [
    { title: 'Kit dispatched', detail: on(-3, '16:40'), state: 'done' },
    { title: 'Sample received', detail: on(1, '09:12'), state: 'done' },
    {
      title: 'Analysing',
      detail: `Since ${on(2, '08:05')} · expected by ${expected}`,
      state: 'now',
    },
    { title: 'Results ready', detail: 'No date yet', state: 'todo' },
  ]
}

/* -------------------------------------------------------- the check-in loop */

/*
 * 🔄 THE DEMO DRIVES THE REAL CHECK-IN MODULE, added 2026-09-07 (fourth pass).
 *
 * The first version of the member plan hand-rolled a streak, a counter row and
 * an adherence chart, and used a 1-to-10 energy scale. All of that was wrong:
 * `lib/membership/checkin.ts` already owns the loop, `CheckinRow` and
 * `AdherenceChart` already render it, and the product's scale is 1 to 5. The
 * demo now renders those components and computes the numbers with that module,
 * so the two cannot disagree about what the loop is.
 *
 * 🔴 THE ENTRIES ARE SYNTHESISED, THE NUMBERS ARE NOT. This function fabricates
 * a plausible 22 days of taps; `currentStreak`, `adherenceSeries` and
 * `loggedWithin` then compute the streak and the chart from them. Nothing on
 * screen is a typed-in "16 day streak". That matters because the mockup asserted
 * both figures and they did not agree with each other.
 *
 * 🔴 "TODAY" IS THE DEMO'S TODAY, not the wall clock. Every function in
 * `checkin.ts` takes `now` as an argument precisely so it can be driven from a
 * table, and the member state is a fixed moment in 2026. Passing the real clock
 * would make the chart drift every day and eventually show 22 empty bars.
 */
export interface DemoCheckin {
  entries: CheckinEntry[]
  /** The day the member state is standing on. Never `new Date()`. */
  today: Date
  /** A partly-completed day, so the row is not uniformly full or empty. */
  answeredToday: Record<string, boolean | number>
}

/*
 * Days the member missed, as offsets back from the demo today.
 *
 * They sit 8, 14 and 19 days back rather than 3, 9 and 16 for a reason a screen
 * makes obvious and a table does not: `currentStreak` counts back from today, so
 * a miss three days ago produces "19 days logged" beside "3 day streak", which
 * reads as a broken habit rather than a kept one. The gaps still show on the
 * chart; they are just old enough to be history.
 */
const DEMO_MISSED_DAYS = [8, 14, 19]

export function getDemoCheckin(
  questionKeys: readonly string[],
  today: Date,
  windowDays = 22
): DemoCheckin {
  const entries: CheckinEntry[] = []
  for (let back = windowDays - 1; back >= 1; back -= 1) {
    if (DEMO_MISSED_DAYS.includes(back)) continue
    const at = addDays(today, -back)
    at.setUTCHours(8, 5, 0, 0)
    for (const key of questionKeys) {
      entries.push({ questionKey: key, capturedAt: at.toISOString() })
    }
  }

  /* Today is deliberately PART done: the supplement tap and the energy score in,
     the behaviour tap still open. A row that is uniformly full reads as a
     screenshot rather than as something a man is halfway through. */
  const answeredToday: Record<string, boolean | number> = {}
  const todayAt = new Date(today)
  todayAt.setUTCHours(8, 5, 0, 0)
  questionKeys.forEach((key, i) => {
    if (i === 1) return
    answeredToday[key] = key.endsWith('.energy') ? 4 : true
    entries.push({ questionKey: key, capturedAt: todayAt.toISOString() })
  })

  return { entries, today, answeredToday }
}
