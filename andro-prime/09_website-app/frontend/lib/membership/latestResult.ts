/**
 * When this customer's most recent result came BACK.
 *
 * One function with two callers — the subscription checkout route (which gates
 * on it) and the membership page (which renders from it) — so the gate and the
 * screen can never disagree about whether the offer window is open. A second
 * copy of this query is exactly the duplicated fact that stays invisible while
 * the copies agree.
 *
 * `received_at`, deliberately, not `collected_at`: the window is about how long
 * ago he learned something, not how long ago he bled.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { ageFromDobIso } from '@/lib/date/age'
import { classify } from '@/lib/results/classifier'
import type { ClassifiedResult, KitType, NormalisedBiomarker } from '@/lib/results/types'

/**
 * Works with either the user-scoped or the service-role client. Under the
 * user-scoped one RLS already restricts the rows to the caller; the explicit
 * `user_id` filter is what makes it correct under the admin client too.
 */
export async function latestResultReceivedAt(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Date | null> {
  const { data, error } = await supabase
    .from('lab_results')
    .select('received_at')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    // Fail CLOSED. An unreadable results table must not open a paid offer we
    // cannot justify; the customer sees the window as closed and can still buy
    // a kit, which is the recoverable direction.
    console.error('[membership] Could not read lab_results for the offer window:', error.message)
    return null
  }

  if (!data?.received_at) return null

  const at = new Date(data.received_at)
  return Number.isNaN(at.getTime()) ? null : at
}

/**
 * The member's most recent result, classified.
 *
 * Added 2026-09-12 for the retest panel rule (defect D1), which has to know
 * which markers were FLAGGED before it can decide which kit to send. The
 * dashboard already assembles this, in `lib/results/getDashboardData.ts`, but
 * that function is built for a screen: it is session-scoped, it loads every
 * result the customer has ever had, and it returns a `DashboardData` union with
 * pre-results and sample-failed branches a nightly job has no use for.
 *
 * So this is the narrow version, and it takes the client as an argument for the
 * same reason `latestResultReceivedAt` above does: the sweep runs under the
 * service-role client with no session at all.
 *
 * ⚠ IT CLASSIFIES RATHER THAN READING A STORED VERDICT, deliberately. There is
 * no stored verdict: `state` is derived every time from the thresholds in
 * `classifier.ts`. Reading a cached one would mean a retest panel chosen
 * against a threshold the clinical reviewer has since moved.
 */
export interface LatestClassifiedResult {
  kitType: KitType
  /** In panel order, exactly as the dashboard would show them. */
  markers: ClassifiedResult[]
}

export async function latestClassifiedResult(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<LatestClassifiedResult | null> {
  const { data: result, error } = await supabase
    .from('lab_results')
    .select('id, order_id, kit_type, received_at')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[membership] Could not read the latest result:', error.message)
    return null
  }
  if (!result) return null

  const [biomarkerRes, symptomRes, qualifierRes, userRes] = await Promise.all([
    supabase
      .from('biomarker_values')
      .select('marker_name, value, unit, reference_low, reference_high')
      .eq('result_id', result.id),
    supabase
      .from('symptom_answers')
      .select('question_key, answer')
      .eq('user_id', userId)
      .eq('order_id', result.order_id),
    supabase
      .from('qualifier_responses')
      .select('question_key, answer')
      .eq('user_id', userId)
      .eq('result_id', result.id),
    supabase.from('users').select('age, date_of_birth').eq('id', userId).maybeSingle(),
  ])

  const biomarkers: NormalisedBiomarker[] = (biomarkerRes.data ?? []).map((b) => ({
    markerName: b.marker_name,
    value: b.value,
    unit: b.unit,
    referenceLow: b.reference_low,
    referenceHigh: b.reference_high,
  }))

  // A result row with no biomarker rows is not an all-clear, it is an unreadable
  // result. Returning null sends the caller down its fallback path rather than
  // letting an empty panel read as "nothing was flagged".
  if (biomarkers.length === 0) {
    console.warn('[membership] Latest result', result.id, 'has no biomarker rows')
    return null
  }

  const markers = classify({
    kitType: result.kit_type as KitType,
    biomarkers,
    symptomAnswers: (symptomRes.data ?? []).map((s) => ({
      questionKey: s.question_key,
      answer: s.answer,
    })),
    qualifierResponses: (qualifierRes.data ?? []).map((q) => ({
      questionKey: q.question_key,
      answer: q.answer,
    })),
    userAge: userRes.data?.age ?? ageFromDobIso(userRes.data?.date_of_birth),
  })

  return { kitType: result.kit_type as KitType, markers }
}
