/**
 * Everything the membership page renders, assembled in one place.
 *
 * Mirrors lib/subscriptions/getSubscriptions.ts: a server-only fetcher that
 * reads through the USER-scoped Supabase client, so RLS is the access control
 * rather than a `.eq('user_id', ...)` we have to remember to write. The
 * `memberships` policy is read-your-own and every write is service-role, so a
 * member can read his retest date here and can never move it.
 *
 * All the RULES live in ./entitlement.ts and ./checkin.ts, which are pure. This
 * module only fetches and joins. Keeping the split means the interesting logic
 * is testable from a table without a database, which is what
 * scripts/test-membership.ts does.
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/results/getDashboardData'
import type { ClassifiedResult, ResultState } from '@/lib/results/types'
import { anyFlagged } from '@/lib/results/resultSeverity'
import { entitlementState, type EntitlementState, type MembershipLike } from './entitlement'
import { offerState, type OfferState } from './offer'
import { latestResultReceivedAt } from './latestResult'
import {
  adherenceSeries,
  currentStreak,
  dayKey,
  loggedWithin,
  markerToMove,
  questionsFor,
  type AdherenceDay,
  type CheckinEntry,
  type CheckinMarkerKey,
  type CheckinQuestion,
} from './checkin'

/**
 * The longest window the adherence chart will draw. A month of bars is legible
 * on a phone; a quarter is not, and the first cycle is what this screen is for.
 */
export const CHECKIN_WINDOW_DAYS = 30

/** The marker name the results engine uses, for each marker that has a loop. */
const MARKER_DISPLAY_NAME: Record<CheckinMarkerKey, string> = {
  'vitamin-d': 'Vitamin D',
  'active-b12': 'Active B12',
  ferritin: 'Ferritin',
}

export interface TrendPoint {
  value: number
  unit: string
  /** When the sample was taken. Null when the lab did not return a date. */
  collectedAt: string | null
}

export interface MarkerToMoveView {
  key: CheckinMarkerKey
  displayName: string
  value: number
  unit: string
  /**
   * The marker's own explanation from the results engine.
   *
   * Reused rather than rewritten ON PURPOSE. Every clinical string in this
   * codebase is Ewa-approved and lives in lib/results/biomarker-copy.ts;
   * writing a second sentence about what a low number means here would create
   * an unsigned clinical claim on a new surface, and a duplicated fact that is
   * invisible exactly while the two copies agree.
   */
  explanation: string
  questions: readonly CheckinQuestion[]
  /** Oldest first. Two points is the smallest number that can answer anything. */
  trend: TrendPoint[]
}

export interface CheckinView {
  answeredToday: Record<string, boolean | number>
  streak: number
  logged: number
  loggedOf: number
  series: AdherenceDay[]
}

export interface MembershipView {
  /** True when a live membership row exists. Drives paywall vs member state. */
  isMember: boolean
  entitlement: EntitlementState
  /** Null for a member with no flagged movable marker, and for a non-member with no results. */
  marker: MarkerToMoveView | null
  /** Null when there is no marker to log against. */
  checkin: CheckinView | null
  /** False before the first result lands. The paywall reads differently then. */
  hasResults: boolean
  /**
   * Whether the membership may be JOINED right now (Keith, 2026-08-26): only
   * while a result has come back within the last 30 days.
   *
   * Rendered from here and enforced in app/api/checkout/subscription/route.ts,
   * both reading the same query, so the screen and the gate cannot disagree.
   * It governs joining, never staying: an existing member's window is
   * irrelevant until he cancels.
   */
  offer: OfferState
  /**
   * Is ANYTHING on this member's panel flagged?
   *
   * Deliberately a SEPARATE question from `marker !== null`, and the separation
   * is load-bearing. A man with low testosterone has nothing this loop can ask
   * him to do daily, so he gets no `marker` — but telling him "nothing is wrong
   * today" on the strength of that would be false, and it is the exact copy the
   * all-clear member is shown. Three states, not two. Derived from the same map
   * that decides the badge on his result card, so the two cannot disagree.
   */
  anyFlagged: boolean
}

type StoredAnswer = { question_key: string; answer: unknown; captured_at: string }

/** A stored jsonb answer, narrowed to the two shapes the loop writes. */
function narrowAnswer(raw: unknown): boolean | number | null {
  if (typeof raw === 'boolean') return raw
  if (typeof raw === 'number' && Number.isInteger(raw)) return raw
  return null
}

/**
 * Every classified marker the member has, newest result first within each kit.
 * Flattened because the question "what is flagged" is asked of the PERSON, not
 * of one kit: nine markers from two purchases read as one picture, which is the
 * architecture the whole pre-vertical position depends on.
 */
function flattenMarkers(
  kits: { results: { collectedAt: string | null; markers: ClassifiedResult[] }[] }[],
): { marker: ClassifiedResult; collectedAt: string | null }[] {
  const out: { marker: ClassifiedResult; collectedAt: string | null }[] = []
  for (const kit of kits) {
    for (const result of kit.results) {
      for (const marker of result.markers) {
        out.push({ marker, collectedAt: result.collectedAt })
      }
    }
  }
  return out
}

/**
 * @param devScenario  A results-engine fixture name, forwarded to
 *   getDashboardData exactly as the results dashboard forwards `?dev=`. It is
 *   ignored in production by that function, which is where the guard belongs:
 *   one gate, on the function that reads it, rather than a second one here that
 *   could disagree. This exists so the four paywall states and the loop can be
 *   reviewed without inventing lab results for a real account.
 */
export async function getMembershipView(
  userId: string,
  now: Date = new Date(),
  devScenario?: string,
): Promise<MembershipView> {
  const supabase = await createSupabaseServerClient()

  const [membershipResult, dashboard, latestResultAt] = await Promise.all([
    supabase
      .from('memberships')
      .select('status, next_retest_due_at, retest_claimed_at')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    getDashboardData(userId, devScenario),
    latestResultReceivedAt(supabase, userId),
  ])

  const membership = (membershipResult.data ?? null) as MembershipLike | null
  const entitlement = entitlementState(membership, now)
  const offer = offerState(latestResultAt, now)

  // `entitlement.kind === 'none'` is NOT the same question as "is he a member":
  // a member with no retest date yet, and a member whose retest is already
  // claimed, are both members. Membership is the status on the row.
  const isMember = entitlement.kind !== 'none' || Boolean(membership?.retest_claimed_at)

  const hasResults = dashboard.state === 'ready'
  if (!hasResults) {
    return {
      isMember, entitlement, offer, marker: null, checkin: null,
      hasResults: false, anyFlagged: false,
    }
  }

  const flat = flattenMarkers(dashboard.kits)
  const states = flat.map((row) => row.marker.state as ResultState)
  const flagged = anyFlagged(states)
  const markerKey = markerToMove(states)

  if (!markerKey) {
    return {
      isMember, entitlement, offer, marker: null, checkin: null,
      hasResults: true, anyFlagged: flagged,
    }
  }

  const displayName = MARKER_DISPLAY_NAME[markerKey]
  const forMarker = flat.filter((row) => row.marker.markerName === displayName)

  // getDashboardData orders results newest first, so the newest reading is the
  // first match and the trend is that list reversed.
  const latest = forMarker[0]
  if (!latest) {
    return {
      isMember, entitlement, offer, marker: null, checkin: null,
      hasResults: true, anyFlagged: flagged,
    }
  }

  const trend: TrendPoint[] = forMarker
    .map((row) => ({
      value: row.marker.value,
      unit: row.marker.unit,
      collectedAt: row.collectedAt,
    }))
    .reverse()

  const questions = questionsFor(markerKey)

  const windowStart = new Date(now.getTime() - (CHECKIN_WINDOW_DAYS - 1) * 24 * 60 * 60 * 1000)
  const { data: answerRows } = await supabase
    .from('symptom_answers')
    .select('question_key, answer, captured_at')
    .eq('user_id', userId)
    .eq('context', 'checkin')
    .gte('captured_at', windowStart.toISOString())
    .order('captured_at', { ascending: true })

  const stored = (answerRows ?? []) as StoredAnswer[]
  const entries: CheckinEntry[] = stored.map((row) => ({
    questionKey: row.question_key,
    capturedAt: row.captured_at,
  }))

  const todayKey = dayKey(now)
  const answeredToday: Record<string, boolean | number> = {}
  for (const row of stored) {
    const at = new Date(row.captured_at)
    if (Number.isNaN(at.getTime()) || dayKey(at) !== todayKey) continue
    const value = narrowAnswer(row.answer)
    if (value !== null) answeredToday[row.question_key] = value
  }

  // "Logged 22 of 22 days" counts from when he actually started, not from a
  // fixed month, so a member on day 3 is not told he has missed 27 days he was
  // never asked about.
  const firstEntry = entries[0]
  const elapsed = firstEntry
    ? Math.floor((now.getTime() - new Date(firstEntry.capturedAt).getTime()) / (24 * 60 * 60 * 1000)) + 1
    : 1
  const windowDays = Math.max(1, Math.min(CHECKIN_WINDOW_DAYS, elapsed))
  const { logged, of } = loggedWithin(entries, windowDays, now)

  return {
    isMember,
    entitlement,
    offer,
    hasResults: true,
    anyFlagged: flagged,
    marker: {
      key: markerKey,
      displayName,
      value: latest.marker.value,
      unit: latest.marker.unit,
      explanation: latest.marker.explanation,
      questions,
      trend,
    },
    checkin: {
      answeredToday,
      streak: currentStreak(entries, now),
      logged,
      loggedOf: of,
      series: adherenceSeries(entries, questions.length, windowDays, now),
    },
  }
}
