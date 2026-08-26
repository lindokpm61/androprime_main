import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isMembershipEnabled } from '@/lib/flags'
import { dayKey, isValidAnswer, questionByKey } from '@/lib/membership/checkin'

// POST /api/membership/checkin
//
// One tap of the between-tests check-in loop. Writes a `symptom_answers` row
// with context = 'checkin' and no order_id: a check-in belongs to a member and
// a date, not to an order. That column was NOT NULL until
// 20260826_membership_v1.sql, which is why this loop could not exist before.
//
// Gated behind MEMBERSHIP_ENABLED, 404 when OFF. The flag gates the SERVER
// path, not just the UI, for the same reason the subscription checkout route
// does: a hidden control is not a gate, and this is a public POST behind auth.
//
// Writes through the USER-scoped client, so the RLS insert policy
// (`auth.uid() = user_id`) is what stops a member writing someone else's row.
// The user id comes from the session and is never read from the body.

export async function POST(request: NextRequest) {
  if (!isMembershipEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const userOrResponse = await requireAuthenticatedApiUser(request)
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  let body: { questionKey?: unknown; answer?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // The question must be one the loop actually asks. An allowlist rather than a
  // format check: `question_key` is free text in the schema, so without this a
  // caller could mint arbitrary keys and quietly poison the counters, which are
  // computed over whatever keys are present.
  const questionKey = typeof body.questionKey === 'string' ? body.questionKey : ''
  const question = questionByKey(questionKey)
  if (!question) {
    return NextResponse.json({ error: 'Unknown questionKey' }, { status: 400 })
  }

  // Shape validated by the same pure rule the renderer uses, so the route and
  // the control cannot disagree about what a legal answer is.
  if (!isValidAnswer(question, body.answer)) {
    return NextResponse.json({ error: 'Invalid answer for this question' }, { status: 422 })
  }
  const answer = body.answer as boolean | number

  const supabase = await createSupabaseServerClient()
  const now = new Date()
  const today = dayKey(now)

  // Read-then-write so a member can CHANGE today's answer (tapping energy 3 then
  // energy 4 is a correction, not a second day). The database index
  // `symptom_answers_one_checkin_per_day` is the real guarantee: read-then-write
  // is not atomic and two concurrent taps race straight through it.
  const { data: existing } = await supabase
    .from('symptom_answers')
    .select('id')
    .eq('user_id', user.id)
    .eq('context', 'checkin')
    .eq('question_key', questionKey)
    .gte('captured_at', `${today}T00:00:00.000Z`)
    .lte('captured_at', `${today}T23:59:59.999Z`)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('symptom_answers')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ answer: answer as any })
      .eq('id', existing.id)

    if (error) {
      console.error('[membership/checkin] update failed:', error.message)
      return NextResponse.json({ error: 'Could not save your check-in' }, { status: 500 })
    }
    return NextResponse.json({ saved: true, updated: true }, { status: 200 })
  }

  const { error } = await supabase.from('symptom_answers').insert({
    user_id: user.id,
    order_id: null,
    context: 'checkin',
    question_key: questionKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: answer as any,
    captured_at: now.toISOString(),
  })

  if (error) {
    // 23505 is the daily unique index firing, which means a concurrent tap won
    // the race. The member's intent is satisfied either way, so this is a
    // success, not an error: telling him the save failed when a row exists
    // would make him tap again.
    if (error.code === '23505') {
      return NextResponse.json({ saved: true, raced: true }, { status: 200 })
    }
    console.error('[membership/checkin] insert failed:', error.message)
    return NextResponse.json({ error: 'Could not save your check-in' }, { status: 500 })
  }

  return NextResponse.json({ saved: true }, { status: 201 })
}
