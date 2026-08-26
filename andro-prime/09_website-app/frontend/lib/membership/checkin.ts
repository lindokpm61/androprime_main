/**
 * The between-tests check-in loop. PURE: no database, no env, no clock.
 *
 * Same contract as lib/membership/entitlement.ts and for the same reason: every
 * function that needs "now" or "today" takes it as an argument, so the whole
 * rule set is drivable from a test table.
 *
 * THE MODEL, in one line (mockup, 2026-08-25): the loop scores what the member
 * DID, never what his blood is doing, because nothing in his blood can honestly
 * change in a fortnight. Adherence is a behavioural fact we can measure. A
 * health score is not, and we do not own a model to produce one.
 *
 * The loop is MARKER-LINKED and that is the whole discipline. An earlier draft
 * asked for capsule, sleep, sun and steps. Sleep and steps do not move vitamin
 * D; they were there because they feel healthy, which means asking a man to
 * report data the app cannot act on, and that is the fastest way to kill a
 * logging habit. Three taps, all connected to the one marker being moved.
 */

import type { ResultState } from '@/lib/results/types'

// ---------------------------------------------------------------------------
// Which markers get a loop
// ---------------------------------------------------------------------------

/**
 * Markers a member can actually move, and therefore the only ones that get a
 * daily loop. Vitamin D, active B12 and ferritin all move in 8 to 16 weeks and
 * all have a behaviour the member controls.
 *
 * DELIBERATELY ABSENT: testosterone and hs-CRP.
 *
 * Testosterone does not move on wellness supplements, which is exactly why kit
 * 1 is not sold as a prove-it bundle. Offering a daily loop against it would be
 * promising a payout the retest cannot deliver.
 *
 * hs-CRP is the harder omission and it is the same rule applied honestly. There
 * is no single behaviour we sell against it, so the loop would have to ask for
 * alcohol, training load or sleep: data the app cannot act on, which is the
 * failure mode this whole design names. A member whose only flagged marker is
 * hs-CRP gets no loop rather than a loop that asks him for nothing usable.
 */
export type CheckinMarkerKey = 'vitamin-d' | 'active-b12' | 'ferritin'

export type CheckinAnswerType = 'boolean' | 'scale'

export interface CheckinQuestion {
  /** Stored verbatim in symptom_answers.question_key. Stable, never displayed. */
  key: string
  /** The chip label. Short enough to sit in a row of three on a phone. */
  label: string
  /** The full question, used as the control's accessible name. */
  prompt: string
  type: CheckinAnswerType
}

/**
 * The symptom tap. Present in every loop and identical across markers, so a
 * member who changes which marker he is moving keeps one continuous energy
 * series rather than starting a new one.
 *
 * COMPLIANCE: energy is logged, never explained. A member seeing his own
 * symptom trend is not a claim. The app must never connect the two for him;
 * "your energy improved because your vitamin D rose" is an interpretation we
 * cannot make in Phase 0. Both lines, no relationship asserted.
 */
export const ENERGY_QUESTION: CheckinQuestion = {
  key: 'checkin.energy',
  label: 'Energy',
  prompt: 'How was your energy today, from 1 to 5?',
  type: 'scale',
}

/** Lowest and highest value the scale question accepts. */
export const SCALE_MIN = 1
export const SCALE_MAX = 5

export const CHECKIN_QUESTIONS: Record<CheckinMarkerKey, readonly CheckinQuestion[]> = {
  'vitamin-d': [
    {
      key: 'checkin.vitamin-d.supplement',
      label: 'D3',
      prompt: 'Did you take your vitamin D today?',
      type: 'boolean',
    },
    {
      key: 'checkin.vitamin-d.daylight',
      label: 'Daylight',
      prompt: 'Did you spend time outdoors in daylight today?',
      type: 'boolean',
    },
    ENERGY_QUESTION,
  ],
  'active-b12': [
    {
      key: 'checkin.active-b12.supplement',
      label: 'B12',
      prompt: 'Did you take your B12 today?',
      type: 'boolean',
    },
    {
      key: 'checkin.active-b12.diet',
      label: 'Source foods',
      prompt: 'Did you eat foods that contain B12 today?',
      type: 'boolean',
    },
    ENERGY_QUESTION,
  ],
  ferritin: [
    {
      key: 'checkin.ferritin.supplement',
      label: 'Iron',
      prompt: 'Did you take your iron today?',
      type: 'boolean',
    },
    {
      key: 'checkin.ferritin.diet',
      label: 'Iron-rich meal',
      prompt: 'Did you eat an iron-rich meal today?',
      type: 'boolean',
    },
    ENERGY_QUESTION,
  ],
}

/** Every question key the loop is allowed to write. The API route's allowlist. */
export const ALL_CHECKIN_KEYS: readonly string[] = Array.from(
  new Set(
    Object.values(CHECKIN_QUESTIONS).flatMap((questions) => questions.map((q) => q.key)),
  ),
)

export function questionsFor(marker: CheckinMarkerKey): readonly CheckinQuestion[] {
  return CHECKIN_QUESTIONS[marker]
}

export function questionByKey(key: string): CheckinQuestion | null {
  for (const questions of Object.values(CHECKIN_QUESTIONS)) {
    const found = questions.find((q) => q.key === key)
    if (found) return found
  }
  return null
}

// ---------------------------------------------------------------------------
// Which marker this member is moving
// ---------------------------------------------------------------------------

/**
 * Flagged result states that have a loop, in the order a member's ONE number to
 * move is chosen when more than one marker is flagged.
 *
 * Severity first: a critically low reading outranks a low one, and a low one
 * outranks a borderline one. WITHIN a severity band the order is a v1 default
 * and A NAMED SEAM, not a clinical ranking: nothing establishes that low
 * ferritin should be worked before low B12 for a given man. It needs Ewa's
 * ruling, and until it has one the app is picking the first match rather than
 * claiming a priority. Reorder this list and nothing else changes.
 *
 * Note what is not here: `high-vitamin-d`, `high-ferritin`, `high-crp` and
 * every testosterone state. A high reading is not something a daily capsule
 * loop fixes, and several of them GP-route instead.
 */
const MOVABLE_STATES: readonly { state: ResultState; marker: CheckinMarkerKey }[] = [
  { state: 'critically-low-vitamin-d', marker: 'vitamin-d' },
  { state: 'low-ferritin', marker: 'ferritin' },
  { state: 'low-b12', marker: 'active-b12' },
  { state: 'low-vitamin-d', marker: 'vitamin-d' },
  { state: 'suboptimal-ferritin', marker: 'ferritin' },
  { state: 'borderline-b12', marker: 'active-b12' },
]

/**
 * The one marker this member is being asked to move, or null when there is
 * none.
 *
 * Null is a legitimate, designed outcome, not a gap: the all-clear member has
 * no number to move, and giving him a daily loop would be asking for data
 * against a retest that is a year away. His screen is the baseline, not a loop.
 */
export function markerToMove(states: readonly ResultState[]): CheckinMarkerKey | null {
  const present = new Set(states)
  for (const candidate of MOVABLE_STATES) {
    if (present.has(candidate.state)) return candidate.marker
  }
  return null
}

// ---------------------------------------------------------------------------
// Streak and adherence
// ---------------------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * The calendar day a timestamp belongs to, as `YYYY-MM-DD`, in UTC.
 *
 * UTC deliberately, and it must match the day key the database index uses
 * (`symptom_answers_one_checkin_per_day`, keyed on the UTC date). A member in
 * BST logging at 00:30 local is logging the previous UTC day; the alternative
 * is a day key that shifts twice a year and a unique index that cannot be
 * expressed, which is the worse trade for a streak counter.
 */
export function dayKey(at: Date): string {
  return at.toISOString().slice(0, 10)
}

function dayKeyMinus(from: string, days: number): string {
  return dayKey(new Date(Date.parse(`${from}T00:00:00.000Z`) - days * DAY_MS))
}

/** One stored answer, reduced to what the counters need. */
export interface CheckinEntry {
  questionKey: string
  capturedAt: string
}

/** Distinct days on which this member logged anything at all. */
export function loggedDays(entries: readonly CheckinEntry[]): Set<string> {
  const days = new Set<string>()
  for (const entry of entries) {
    const at = new Date(entry.capturedAt)
    if (!Number.isNaN(at.getTime())) days.add(dayKey(at))
  }
  return days
}

/**
 * Consecutive days logged, counting back from today.
 *
 * A streak that has not been extended TODAY is not broken: it is 9am and the
 * day is not over. So the count starts at today when today is logged and at
 * yesterday otherwise. Only a gap at both ends returns zero. Breaking a man's
 * streak at midnight for a day he can still complete is how the loop teaches
 * him to stop opening it.
 */
export function currentStreak(entries: readonly CheckinEntry[], today: Date): number {
  const days = loggedDays(entries)
  const todayKey = dayKey(today)

  let cursor = days.has(todayKey) ? todayKey : dayKeyMinus(todayKey, 1)
  if (!days.has(cursor)) return 0

  let streak = 0
  while (days.has(cursor)) {
    streak += 1
    cursor = dayKeyMinus(cursor, 1)
  }
  return streak
}

export interface AdherenceDay {
  /** `YYYY-MM-DD`, oldest first. */
  day: string
  /** Questions answered that day. */
  answered: number
  /** Questions the loop asked for. Constant across the window. */
  total: number
  /** `answered / total`, 0 to 1. */
  fraction: number
}

/**
 * The adherence bar chart, oldest day first.
 *
 * THIS CHART IS ABOUT BEHAVIOUR, NEVER BLOOD, and the rendered legend says so.
 * Nothing here claims a result has changed. That distinction is the difference
 * between a habit tracker and a clinical claim we are not allowed to make.
 */
export function adherenceSeries(
  entries: readonly CheckinEntry[],
  questionCount: number,
  windowDays: number,
  today: Date,
): AdherenceDay[] {
  const byDay = new Map<string, Set<string>>()
  for (const entry of entries) {
    const at = new Date(entry.capturedAt)
    if (Number.isNaN(at.getTime())) continue
    const key = dayKey(at)
    const set = byDay.get(key) ?? new Set<string>()
    set.add(entry.questionKey)
    byDay.set(key, set)
  }

  const todayKey = dayKey(today)
  const series: AdherenceDay[] = []
  for (let back = windowDays - 1; back >= 0; back -= 1) {
    const day = dayKeyMinus(todayKey, back)
    const answered = Math.min(byDay.get(day)?.size ?? 0, questionCount)
    series.push({
      day,
      answered,
      total: questionCount,
      fraction: questionCount === 0 ? 0 : answered / questionCount,
    })
  }
  return series
}

/**
 * Days logged within the window, and the window length. The mockup's
 * "Logged 22 of 22 days" line, computed rather than asserted.
 */
export function loggedWithin(
  entries: readonly CheckinEntry[],
  windowDays: number,
  today: Date,
): { logged: number; of: number } {
  const days = loggedDays(entries)
  const todayKey = dayKey(today)
  let logged = 0
  for (let back = 0; back < windowDays; back += 1) {
    if (days.has(dayKeyMinus(todayKey, back))) logged += 1
  }
  return { logged, of: windowDays }
}

/**
 * Is this a value the loop will store for this question?
 *
 * Validated here rather than at the route so the rule is testable without a
 * request, and so the route cannot disagree with the renderer about what a
 * legal answer is.
 */
export function isValidAnswer(question: CheckinQuestion, answer: unknown): boolean {
  if (question.type === 'boolean') return typeof answer === 'boolean'
  if (question.type === 'scale') {
    return (
      typeof answer === 'number' &&
      Number.isInteger(answer) &&
      answer >= SCALE_MIN &&
      answer <= SCALE_MAX
    )
  }
  return false
}
