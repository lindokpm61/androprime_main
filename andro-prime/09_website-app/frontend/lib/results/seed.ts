import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { SCENARIOS } from './fixtures/registry'
import { normalise } from './normaliser'
import type { ScenarioName } from './types'

export interface SeedResult {
  userId: string
  orderId: string
  resultId: string
  biomarkerIds: string[]
  symptomAnswerIds: string[]
}

export async function seedScenario(scenarioName: ScenarioName): Promise<SeedResult> {
  const scenario = SCENARIOS[scenarioName]
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioName}`)
  }

  const supabase = createSupabaseAdminClient()
  const devEmail = `dev+${scenarioName}@androprime.test`

  // Create or get test user
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users.find((u) => u.email === devEmail)

  let userId: string
  if (existing) {
    userId = existing.id
  } else {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: devEmail,
      email_confirm: true,
      password: 'dev-password-not-used',
    })
    if (createError || !created.user) {
      throw new Error(`Failed to create test user: ${createError?.message}`)
    }
    userId = created.user.id
  }

  // Upsert users table row
  const { error: userRowError } = await supabase.from('users').upsert(
    {
      id: userId,
      email: devEmail,
      age: scenario.testAge,
      marketing_consent: false,
    },
    { onConflict: 'id' }
  )
  if (userRowError) throw new Error(`Failed to upsert users row: ${userRowError.message}`)

  // Insert kit_orders row
  const { data: order, error: orderError } = await supabase
    .from('kit_orders')
    .insert({
      user_id: userId,
      kit_type: scenario.payload.kitType,
      status: 'results_received',
    })
    .select('id')
    .single()
  if (orderError || !order) {
    throw new Error(`Failed to insert kit_orders: ${orderError?.message}`)
  }
  const orderId = order.id

  // Build payload with real IDs
  const payload = {
    ...scenario.payload,
    orderId,
    userId,
  }

  // Insert lab_results row
  const { data: result, error: resultError } = await supabase
    .from('lab_results')
    .insert({
      order_id: orderId,
      user_id: userId,
      kit_type: payload.kitType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw_payload: payload as unknown as any,
    })
    .select('id')
    .single()
  if (resultError || !result) {
    throw new Error(`Failed to insert lab_results: ${resultError?.message}`)
  }
  const resultId = result.id

  // Normalise and insert biomarker_values
  const biomarkers = normalise(payload)
  const biomarkerRows = biomarkers.map((b) => ({
    result_id: resultId,
    marker_name: b.markerName,
    value: b.value,
    unit: b.unit,
    reference_low: b.referenceLow,
    reference_high: b.referenceHigh,
  }))
  const { data: insertedBiomarkers, error: biomarkerError } = await supabase
    .from('biomarker_values')
    .insert(biomarkerRows)
    .select('id')
  if (biomarkerError) throw new Error(`Failed to insert biomarker_values: ${biomarkerError.message}`)

  // Insert symptom_answers
  const symptomAnswerIds: string[] = []
  if (scenario.symptomAnswers.length > 0) {
    const symptomRows = scenario.symptomAnswers.map((sa) => ({
      user_id: userId,
      order_id: orderId,
      question_key: sa.questionKey,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      answer: sa.answer as any,
    }))
    const { data: insertedSymptoms, error: symptomError } = await supabase
      .from('symptom_answers')
      .insert(symptomRows)
      .select('id')
    if (symptomError) throw new Error(`Failed to insert symptom_answers: ${symptomError.message}`)
    symptomAnswerIds.push(...(insertedSymptoms?.map((s) => s.id) ?? []))
  }

  return {
    userId,
    orderId,
    resultId,
    biomarkerIds: insertedBiomarkers?.map((b) => b.id) ?? [],
    symptomAnswerIds,
  }
}
