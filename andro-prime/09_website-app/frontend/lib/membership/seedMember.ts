import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { dayKey, questionsFor, SCALE_MAX, SCALE_MIN, type CheckinMarkerKey } from './checkin'

/**
 * THE MEMBER FIXTURE: a membership and a plausible check-in history.
 *
 * WHY IT EXISTS. `/account/membership` has three top-level states and the
 * MEMBER one is the only place `CheckinRow`, `AdherenceChart` and `TrendPlot`
 * render at all. Reaching it needs a session with an active membership and
 * enough logged days to draw a chart, and `seedScenario` creates neither, so
 * until 2026-09-12 the member screen had never been opened by anyone: batch 3
 * shipped those three components unable to see them, and batch 4 rebuilt them
 * against a harness for the same reason.
 *
 * 🔴 THIS WRITES TO WHATEVER PROJECT THE SERVICE ROLE KEY POINTS AT, WHICH IS
 * PRODUCTION. There is no local Supabase in this repo. The caller prints the
 * project ref before anything is written and requires it to be confirmed; do
 * not route around that, and do not call this from anything automatic.
 *
 * IT IS IDEMPOTENT, which is not a nicety here. Three database guards would
 * otherwise turn a second run into a confusing failure rather than a no-op:
 * `memberships_one_live_per_user` (a partial unique index over the four live
 * statuses), `memberships_stripe_subscription_id_key`, and
 * `symptom_answers_one_checkin_per_day`. Every write below is an upsert keyed
 * on the constraint that would have fired.
 */

/** Days of history to write. Comfortably inside CHECKIN_WINDOW_DAYS of 30. */
const HISTORY_DAYS = 22

/**
 * The shape of the history, chosen so the chart has something to encode rather
 * than twenty two identical bars: a ragged start, two missed days, two partial
 * days, then an unbroken run to today. Days are counted BACK from today, so
 * `MISSED` of 19 means the third day of the window.
 *
 * Today is logged, so the run includes it. The "unlogged today does not break
 * the streak" rule is exercised by the unit tests rather than by a fixture,
 * because a fixture that only tells the truth before 9am is a bad fixture.
 */
const MISSED_DAYS_BACK = new Set([19, 16, 12])
const PARTIAL_DAYS_BACK = new Set([20, 14])

export interface SeedMemberResult {
  membershipId: string
  marker: CheckinMarkerKey
  checkinRows: number
  loggedDays: number
  nextRetestDueAt: string
}

export async function seedMember(
  userId: string,
  marker: CheckinMarkerKey,
  now: Date = new Date(),
): Promise<SeedMemberResult> {
  const supabase = createSupabaseAdminClient()
  const questions = questionsFor(marker)
  if (questions.length === 0) {
    throw new Error(`No check-in questions for marker "${marker}"`)
  }

  /* 🔴 THE GUARD, AND IT IS NOT CEREMONIAL. This function DELETES a user's
     check-in rows before rewriting them, and it runs against production. Point
     it at a real customer's id by a slip of copy and paste and it erases the
     loop they have been logging. So the id is resolved back to an email first
     and refused unless it is a seeded dev account. `dev+<scenario>@
     androprime.test` is the address `seedScenario` creates and the domain is
     not deliverable. */
  const { data: account, error: accountError } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .maybeSingle()
  if (accountError) {
    throw new Error(`Could not read the account before seeding: ${accountError.message}`)
  }
  const email = account?.email ?? ''
  if (!email.endsWith('@androprime.test')) {
    throw new Error(
      `Refusing to seed a membership onto "${email || userId}". ` +
        `seedMember deletes and rewrites check-in history, so it only runs on ` +
        `a dev account at @androprime.test.`
    )
  }

  /* A membership that started before the history it is about to be given, so
     the "logged N of N days" line counts from a start that actually precedes
     the first entry rather than from a date in the middle of its own chart. */
  const startedAt = new Date(now.getTime() - (HISTORY_DAYS + 2) * 86400000)

  /* The retest sits in the FUTURE, which puts the entitlement in `pending` and
     the trend rail's unanswered point on the right-hand end. Day 90 from the
     start is the first-cycle cadence for a member with a marker to move, so
     this matches the rule rather than picking a round number. */
  const nextRetestDueAt = new Date(startedAt.getTime() + 90 * 86400000)

  /* Deterministic per user, so a second run updates the same row instead of
     colliding with the unique index on this column. `sub_dev_` rather than a
     Stripe-shaped id, so nothing can mistake it for a real subscription. */
  const stripeSubscriptionId = `sub_dev_${userId}`

  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: stripeSubscriptionId,
        status: 'active',
        started_at: startedAt.toISOString(),
        current_period_end: new Date(now.getTime() + 20 * 86400000).toISOString(),
        next_retest_due_at: nextRetestDueAt.toISOString(),
        // NULL, so the entitlement is `pending` rather than `claimed`: the
        // retest has not been dispatched and the screen still counts down to it.
        retest_claimed_at: null,
        cancelled_at: null,
      },
      { onConflict: 'stripe_subscription_id' }
    )
    .select('id')
    .single()
  if (membershipError || !membership) {
    throw new Error(`Failed to upsert memberships row: ${membershipError?.message}`)
  }

  /* 🔴 `context: 'checkin'` AND `order_id` ABSENT, TOGETHER. `symptom_answers_
     context_shape` requires exactly that pairing: an 'order' row must carry an
     order_id and a 'checkin' row must not. Sending one without the other fails
     the constraint rather than writing a half-right row, which is the point of
     the constraint. */
  const rows: {
    user_id: string
    question_key: string
    answer: boolean | number
    captured_at: string
    context: string
  }[] = []

  for (let back = HISTORY_DAYS - 1; back >= 0; back -= 1) {
    if (MISSED_DAYS_BACK.has(back)) continue

    /* 09:00 UTC. The one-per-day index keys on the UTC date and `dayKey` reads
       it the same way, so a mid-morning stamp cannot land on the wrong side of
       a day boundary the way midnight can. */
    const at = new Date(now.getTime() - back * 86400000)
    at.setUTCHours(9, 0, 0, 0)

    const asked = PARTIAL_DAYS_BACK.has(back) ? questions.slice(0, 1) : questions
    for (const question of asked) {
      rows.push({
        user_id: userId,
        question_key: question.key,
        answer:
          question.type === 'boolean'
            ? true
            : // A scale answer that varies, so the pips are not five identical
              // readings, and stays inside SCALE_MIN..SCALE_MAX rather than
              // being a number somebody typed.
              SCALE_MIN + (back % (SCALE_MAX - SCALE_MIN + 1)),
        captured_at: at.toISOString(),
        context: 'checkin',
      })
    }
  }

  /* DELETE THEN INSERT, rather than an upsert, and the reason is the shape of
     the guard it has to satisfy. `symptom_answers_one_checkin_per_day` is a
     PARTIAL index over an EXPRESSION, `((captured_at at time zone 'utc')::date)
     where context = 'checkin'`. PostgREST's `on_conflict` takes a column list
     and cannot name either of those, so an upsert here does not resolve to that
     index and the second run fails on it instead of replacing the history.
     Scoped to this user's check-in rows only: the `context` filter is what keeps
     it off their order questionnaire answers, which are a different kind of row
     in the same table and are not ours to touch. */
  const { error: clearError } = await supabase
    .from('symptom_answers')
    .delete()
    .eq('user_id', userId)
    .eq('context', 'checkin')
  if (clearError) {
    throw new Error(`Failed to clear previous check-in answers: ${clearError.message}`)
  }

  const { error: answerError } = await supabase
    .from('symptom_answers')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(rows as any)
  if (answerError) {
    throw new Error(`Failed to insert check-in answers: ${answerError.message}`)
  }

  const loggedDays = new Set(rows.map((row) => dayKey(new Date(row.captured_at)))).size

  return {
    membershipId: membership.id,
    marker,
    checkinRows: rows.length,
    loggedDays,
    nextRetestDueAt: nextRetestDueAt.toISOString(),
  }
}
