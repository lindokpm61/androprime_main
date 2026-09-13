import { SCENARIOS } from './fixtures'
import { FIRST_CYCLE_RETEST_DAYS } from '@/lib/membership/entitlement'
import type { CheckinEntry } from '@/lib/membership/checkin'
import type { KitType, ScenarioName } from './types'
import {
  formatLongDate,
  formatLongDateNoYear,
  formatMediumDate,
  formatShortDate,
  formatWeekdayDate,
} from '@/lib/date/format'

/*
 * THE PUBLIC DEMO'S DATA MODEL. Rebuilt from scratch 2026-09-07.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔴 WHY IT WAS REBUILT RATHER THAN PATCHED. Keith, 2026-09-07: *"rebuild the
 * demo from scratch, following page for page the prototype. Exactly. So the
 * initial buy is Kit 3 and the rebuy or retest is Kit 2 ... I think we are, with
 * this current version of the demo, in a complete mess."*
 *
 * The reference is `design/prototypes/demo-account-interactive.html`. Two things
 * follow from that instruction and they are the shape of this file:
 *
 *   1. THE MAN IS THE PROTOTYPE'S MAN. Testosterone 10.5, vitamin D 31. Not the
 *      homepage's man (14.2 / 58), which is what the previous build carried.
 *      Keith chose this explicitly, having been shown what it costs: `/`'s
 *      sample readout and the demo now show different people. The fixtures
 *      carry the full note.
 *   2. THE RETEST KIT IS NOT TYPED ANYWHERE. It is whatever
 *      `selectRetestPanel` returns for this man's flags, and for him that is
 *      the Kit 3 he bought, because he is flagged on both halves of the panel
 *      and a Kit 2 cannot measure his testosterone.
 *
 *      ⚠ THIS IS THE SECOND HALF OF THE 2026-09-07 RULING, REVERSED ON
 *      2026-09-13 (D1). That ruling said *"the initial buy is Kit 3 and the
 *      rebuy or retest is Kit 2."* The first half stands. The second hard-coded
 *      a kit, which is the thing D1 was raised to remove, and it is what made
 *      the demo contradict the nightly job for five days. Keith, 2026-09-13:
 *      *"If someone initially purchased Kit 3 and then has markers in Kit 3
 *      that belong to Kit 1 and 2, then we just send out a Kit 3."*
 *
 *      The file still assumes nothing about pairing: `markerHistory` attaches a
 *      retest reading only where one exists, which is the shape a NARROWED
 *      retest needs. That path is now unexercised by the demo and is covered by
 *      `scripts/test-marker-history.ts` instead, because real Kit 3 members
 *      whose flags fall inside one half will hit it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔴 IT READS NO DATABASE AND TAKES NO USER. Everything below resolves to two
 * fixtures and hands their raw values to the client, which runs the real
 * `classify()` over them. There is no Supabase client anywhere on this path and
 * no user id to give one. That is what makes the homepage's promise -- "We never
 * put your data in it" -- a property of the code rather than a policy someone
 * has to remember.
 *
 * 🔴 AND THERE IS NO LONGER A RESULT SWITCHER. The URL carries one parameter,
 * `?s=`, naming the moment in the journey. An unknown value falls back to the
 * default rather than reaching the fixture registry, so the query string cannot
 * select anything not listed here.
 *
 * ⚠ WHAT IS STILL OPEN WITH COMPLIANCE. `/demo` puts a full results report AND a
 * membership price on an ungated surface (CA-046, and the widening recorded in
 * `03_compliance/STATE.md`). The route stays `noindex` until both clear. This
 * rebuild does not change that and adds one more thing to the packet: the demo's
 * headline screen now routes a man to his GP, where the previous build's did
 * not.
 */

/* ------------------------------------------------------------- the purchases */

/*
 * TWO PURCHASES. Named separately rather than as a list, because they are not
 * interchangeable: the first defines the panel the whole app is drawn against,
 * and the second arrives ninety days later. They happen to be the same kit for
 * this man, which is the rule's answer and not an assumption -- section 6 of
 * `scripts/test-retest-panel.ts` fails if the fixtures stop agreeing with it.
 */
export const DEMO_BASELINE_SCENARIO: ScenarioName = 'demo-kit3-baseline'
export const DEMO_RETEST_SCENARIO: ScenarioName = 'demo-kit3-retest'

/* ------------------------------------------------------------------ journey */

export type DemoJourneyId = 'waiting' | 'result' | 'member'

export interface DemoJourney {
  id: DemoJourneyId
  /** The switcher label, carried VERBATIM from the prototype's state seg. */
  label: string
}

/*
 * THE THREE STATES, with the prototype's own labels.
 *
 * ⚠ ITS DAY NUMBERS ARE LOOSE AND ARE KEPT ANYWAY. Day 3, day 14 and day 90 do
 * not all count from the same event in the drawing: day 90 is measured from the
 * result (14 Aug + 90 = 12 Nov, which is exact), day 14 is roughly from the
 * order, and day 3 is roughly from dispatch. They are kept verbatim because they
 * are the vocabulary the drawing is discussed in and because rewriting them
 * would make this switcher unrecognisable next to it. Every DATE on the screens
 * is derived from the fixtures below and is exact; only these three labels are
 * the prototype's approximations.
 */
export const DEMO_JOURNEYS: DemoJourney[] = [
  { id: 'waiting', label: 'Day 3 · waiting for the lab' },
  { id: 'result', label: 'Day 14 · first result, month one running' },
  { id: 'member', label: 'Day 90 · member, retest landed' },
]

export const DEFAULT_JOURNEY_ID: DemoJourneyId = 'result'

/** Resolves a URL id to a journey state. Anything unknown gets the default. */
export function resolveDemoJourney(id?: string): DemoJourney {
  return (
    DEMO_JOURNEYS.find((j) => j.id === id) ??
    DEMO_JOURNEYS.find((j) => j.id === DEFAULT_JOURNEY_ID)!
  )
}

/* ------------------------------------------------------------------- dates */

/*
 * HOW LONG THE LAB TAKES, in the demo. The kit pages promise the report "within
 * 2 to 5 working days of the lab receiving your sample", so four days is inside
 * what is already said publicly. It exists because a fixture only carries a
 * COLLECTION date, and every customer-facing date anchors to the RESULT
 * (`01_strategy/2026-09-07-anchor-everything-to-the-result.md`) -- deliberately,
 * because the window is about how long ago he learned something, not how long
 * ago he bled.
 *
 * 🔴 IT ALSO RESOLVES A CONTRADICTION THE PROTOTYPE FLAGS AND DECLINES TO FIX.
 * Its waiting tracker says the sample arrived on 14 August and the results were
 * expected on 18 August, while every other screen treats 14 August as the day
 * the RESULT landed. Its own header says one of those is wrong and that nothing
 * in the rulings settles which. Deriving both from one collection date settles
 * it: collected 10 Aug, received 11 Aug, analysing from 12 Aug, result 14 Aug.
 */
const RESULT_LAG_DAYS = 4

/*
 * THE INCLUDED MONTH, AND THE OFF-BY-ONE THAT WAS IN THE PREVIOUS BUILD.
 *
 * `01_strategy/2026-09-07-auto-renew-at-day-30.md`: *"The first 30 days are
 * included in the kit price, and on day 31 the card is charged."* The result day
 * is day 1. So day 30, the last included day, is result + 29, and day 31, the
 * first charge, is result + 30.
 *
 * 🔴 The previous build had `includedMonthEnds = result + 30` and then charged
 * the day after that, which is day 32. It went unnoticed because nothing checked
 * the arithmetic against the ruling; the prototype had it right (14 Aug result,
 * charged 13 Sep) and the build disagreed with it by a day.
 */
const INCLUDED_DAYS = 30

export interface DemoDates {
  /** When the first result landed. Every other date is anchored to this. */
  resultReceived: Date
  /** Day 30: the last day covered by the kit price. */
  includedMonthEnds: Date
  /** Day 31: the first charge. Auto-renew ruling, 2026-09-07. */
  firstCharge: Date
  /** The included retest, `FIRST_CYCLE_RETEST_DAYS` after the first result. */
  retestDue: Date
  /** When the retest result landed. Null until it has. */
  retestReceived: Date | null
  /** Days between the two results. The record's own caption reads this. */
  daysApart: number
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setUTCDate(out.getUTCDate() + n)
  return out
}

function parse(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

/*
 * EVERY DATE THE DEMO SHOWS IS DERIVED HERE, and the retest interval is imported
 * from `entitlement.ts` rather than typed. That is the anchor ruling expressed as
 * code: move `FIRST_CYCLE_RETEST_DAYS` and this demo moves with it. It is exactly
 * how the prototype's old hand-typed "22 Oct" came to match no rule at all.
 */
export function getDemoDates(journey: DemoJourneyId): DemoDates | null {
  const collected = parse(SCENARIOS[DEMO_BASELINE_SCENARIO].payload.collectedAt)
  if (!collected) return null

  const resultReceived = addDays(collected, RESULT_LAG_DAYS)
  const retestCollected = parse(SCENARIOS[DEMO_RETEST_SCENARIO].payload.collectedAt)
  const retestReceived = retestCollected ? addDays(retestCollected, RESULT_LAG_DAYS) : null

  return {
    resultReceived,
    includedMonthEnds: addDays(resultReceived, INCLUDED_DAYS - 1),
    firstCharge: addDays(resultReceived, INCLUDED_DAYS),
    retestDue: addDays(resultReceived, FIRST_CYCLE_RETEST_DAYS),
    retestReceived: journey === 'member' ? retestReceived : null,
    daysApart: retestReceived
      ? Math.round((retestReceived.getTime() - resultReceived.getTime()) / 86400000)
      : 0,
  }
}

/** "12 November 2026". Long form: these dates are read once, not scanned. */
export function formatDemoDate(d: Date): string {
  return formatLongDate(d)
}

/** "12 Nov". Short form, for the record's column headers and the plots. */
export function formatDemoDateShort(d: Date): string {
  return formatShortDate(d)
}

/** "14 Aug 2026". The status strip's format, which is neither of the others. */
export function formatDemoDateMed(d: Date): string {
  return formatMediumDate(d)
}

/** "13 September". No year: the charge is inside the reader's own month or two. */
export function formatDemoDateNoYear(d: Date): string {
  return formatLongDateNoYear(d)
}

/* ------------------------------------------------- the engine, client-side */

/*
 * 🔄 RAW VALUES, BECAUSE THE RAIL RE-CLASSIFIES ON EVERY DRAG.
 *
 * The prototype's rail lets you drag a marker's value and watch the verdict
 * change band. Reproducing that means the CLIENT needs the raw biomarkers rather
 * than a classified payload.
 *
 * 🟢 AND THAT MAKES THE PORT BETTER THAN THE PROTOTYPE, not a copy of it. The
 * prototype's bands were TRANSCRIBED from `classifier.ts` into a literal in the
 * page, which is why its own header says they cannot stay current and warns that
 * where the two disagree the prototype is wrong by construction. Here the slider
 * calls the real `classify()`, so every verdict it produces is the engine's and
 * follows a threshold change the same day.
 *
 * ⚠ ONE KNOWN DIFFERENCE, and it does not touch a verdict.
 * `isMaintenanceOfferEnabled()` reads `process.env.MAINTENANCE_OFFER_ENABLED`,
 * which Next inlines as undefined in a client bundle, so client-side it is always
 * false. That is the flag's OFF state and its own comment says OFF is
 * "byte-identical to before this feature existed". It gates a CTA, never a band,
 * an explanation or a state.
 */
export interface DemoMarkerSeed {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
}

export interface DemoEngineInput {
  /** Kit 3. The panel the whole app is drawn against. */
  baselineKit: KitType
  /** Kit 3 again, ninety days later: what the retest rule returns for this man. */
  retestKit: KitType
  userAge: number | null
  symptomAnswers: { questionKey: string; answer: string | number | boolean }[]
  /** The nine, as first measured. Fixed: history does not move. */
  baselineSeeds: DemoMarkerSeed[]
  /** The nine, re-measured. The rail's slider drives these. */
  retestSeeds: DemoMarkerSeed[]
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
 * Everything the client needs to run `classify()` itself, for both purchases.
 * Still no database and still no user: the same closed fixture pair, handed over
 * raw.
 *
 * BOTH POINTS ARE ALWAYS SENT, in every journey state. The waiting and result
 * states simply do not render the retest. Sending it conditionally would mean a
 * second payload shape and a second set of branches for no saving worth having:
 * nine markers is a few hundred bytes.
 */
export function getDemoEngineInput(): DemoEngineInput {
  const baseline = SCENARIOS[DEMO_BASELINE_SCENARIO]
  const retest = SCENARIOS[DEMO_RETEST_SCENARIO]
  return {
    baselineKit: baseline.payload.kitType,
    retestKit: retest.payload.kitType,
    userAge: baseline.testAge ?? null,
    symptomAnswers: baseline.symptomAnswers.map((a) => ({
      questionKey: a.questionKey,
      answer: a.answer,
    })),
    baselineSeeds: seedsOf(DEMO_BASELINE_SCENARIO),
    retestSeeds: seedsOf(DEMO_RETEST_SCENARIO),
  }
}

/* ---------------------------------------------------------- waiting steps */

/*
 * THE WAITING TRACKER, from the prototype's `screenWaiting`.
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

export function getDemoWaitingSteps(): DemoStep[] | null {
  const collected = parse(SCENARIOS[DEMO_BASELINE_SCENARIO].payload.collectedAt)
  if (!collected) return null

  const on = (offset: number, time: string) =>
    `${formatDemoDateShort(addDays(collected, offset))}, ${time}`
  const expected = formatWeekdayDate(addDays(collected, RESULT_LAG_DAYS))

  return [
    { title: 'Kit dispatched', detail: on(-3, '16:40'), state: 'done' },
    { title: 'Sample received', detail: on(1, '09:12'), state: 'done' },
    { title: 'Analysing', detail: `Since ${on(2, '08:05')} · expected by ${expected}`, state: 'now' },
    { title: 'Results ready', detail: 'No date yet', state: 'todo' },
  ]
}

/* -------------------------------------------------------- the check-in loop */

/*
 * THE DEMO DRIVES THE REAL CHECK-IN MODULE.
 *
 * 🔴 THIS IS THE ONE PLACE THE REBUILD DELIBERATELY DOES NOT COPY THE PROTOTYPE,
 * and Keith chose it on 2026-09-07 ("prototype layout, approved copy"). The
 * drawing's plan tab has two invented daily tasks -- "D3 capsule", "20 min
 * daylight" -- and a 1-to-10 energy scale. None of it has had a pre-flight or a
 * clinical sign-off, its own header forbids lifting it to a live surface, and
 * `03_compliance/STATE.md` records that it was held back for exactly that
 * reason. `lib/membership/checkin.ts` already owns this loop, its questions are
 * the approved ones, and the product's scale is 1 to 5.
 *
 * 🟢 THE SUBSTITUTION IS ALMOST INVISIBLE, which is why it was the right call.
 * The vitamin D loop's approved questions are "Did you take your vitamin D
 * today?" and "Did you spend time outdoors in daylight today?", labelled D3 and
 * Daylight. That is the prototype's own pair of taps, in Ewa's words instead of
 * a mockup's.
 *
 * 🔴 THE ENTRIES ARE SYNTHESISED, THE NUMBERS ARE NOT. This fabricates a
 * plausible 22 days of taps; `currentStreak`, `adherenceSeries` and
 * `loggedWithin` then compute the streak and the chart from them. Nothing on
 * screen is a typed-in "16 day streak". That matters because the prototype
 * asserts both figures and they do not agree with each other: it draws misses on
 * days 5, 12 and 18 of 22 and still prints a 16-day streak beside them.
 *
 * 🔴 "TODAY" IS THE DEMO'S TODAY, not the wall clock. Every function in
 * `checkin.ts` takes `now` as an argument precisely so it can be driven from a
 * table, and the member state is a fixed moment in 2026. Passing the real clock
 * would make the chart drift daily and eventually show 22 empty bars.
 */
export interface DemoCheckin {
  entries: CheckinEntry[]
  /** The day the member state is standing on. Never `new Date()`. */
  today: Date
  /** A partly-completed day, so the row is not uniformly full or empty. */
  answeredToday: Record<string, boolean | number>
}

/*
 * Days the member missed, as offsets back from the demo's today.
 *
 * They sit 8, 14 and 19 days back rather than the prototype's 5, 12 and 18, for
 * a reason a screen makes obvious and a table does not: `currentStreak` counts
 * back from today, so a miss five days ago produces "19 days logged" beside a
 * "5 day streak", which reads as a broken habit rather than a kept one. The gaps
 * still show on the chart; they are just old enough to be history.
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
