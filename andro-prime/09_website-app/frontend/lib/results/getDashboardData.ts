import { createSupabaseServerClient } from '@/lib/supabase/server'
import { classify } from './classifier'
import type { DashboardData, NormalisedBiomarker } from './types'

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient()

  // Fetch latest lab result for the user
  const { data: result, error: resultError } = await supabase
    .from('lab_results')
    .select('id, order_id, kit_type')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })
    .limit(1)
    .single()

  if (resultError || !result) {
    return { state: 'no-results' }
  }

  // Fetch biomarker values
  const { data: biomarkerRows, error: biomarkerError } = await supabase
    .from('biomarker_values')
    .select('marker_name, value, unit, reference_low, reference_high')
    .eq('result_id', result.id)

  if (biomarkerError || !biomarkerRows) {
    return { state: 'no-results' }
  }

  const biomarkers: NormalisedBiomarker[] = biomarkerRows.map((b) => ({
    markerName: b.marker_name,
    value: b.value,
    unit: b.unit,
    referenceLow: b.reference_low,
    referenceHigh: b.reference_high,
  }))

  // Fetch symptom answers for this order
  const { data: symptomRows } = await supabase
    .from('symptom_answers')
    .select('question_key, answer')
    .eq('user_id', userId)
    .eq('order_id', result.order_id)

  const symptomAnswers = (symptomRows ?? []).map((r) => ({
    questionKey: r.question_key,
    answer: r.answer,
  }))

  // Fetch qualifier responses for this result
  const { data: qualifierRows } = await supabase
    .from('qualifier_responses')
    .select('question_key, answer')
    .eq('user_id', userId)
    .eq('result_id', result.id)

  const qualifierResponses = (qualifierRows ?? []).map((r) => ({
    questionKey: r.question_key,
    answer: r.answer,
  }))

  // Fetch user age
  const { data: userRow } = await supabase
    .from('users')
    .select('age')
    .eq('id', userId)
    .single()

  const userAge = userRow?.age ?? null

  const markers = classify({
    kitType: result.kit_type,
    biomarkers,
    symptomAnswers,
    qualifierResponses,
    userAge,
  })

  const hasQualifierPending = markers.some((m) => m.requiresQualifier)

  return {
    state: 'ready',
    resultId: result.id,
    markers,
    hasQualifierPending,
    userAge,
  }
}
