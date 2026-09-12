import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { SCENARIOS } from './fixtures/registry'
import type { ScenarioName } from './types'

/**
 * The password every seeded dev account carries.
 *
 * ⚠ THE NAME IS A HISTORICAL MISNOMER AND THE VALUE IS KEPT ANYWAY. It was
 * "not used" when the fixtures only fed server-side reads and nobody signed in.
 * They do now: the only way to see a gated screen is to log in as one of these
 * accounts, so it is typed by hand regularly. The value is unchanged because it
 * is quoted in two handoffs and in this script's own output, and a password
 * that is correct in the code and stale in the note somebody reads is worse
 * than an awkward name.
 *
 * It protects nothing. These are `@androprime.test` accounts holding fixture
 * data, on a domain that does not receive mail.
 */
export const DEV_PASSWORD = 'dev-password-not-used'

export interface SeedResult {
  userId: string
  orderId: string
  resultId: string
  biomarkerIds: string[]
  symptomAnswerIds: string[]
}

export interface SeedOptions {
  /**
   * The account to seed onto. Defaults to this scenario's own dev account.
   *
   * A RETEST IS SEEDED ONTO THE BASELINE'S ACCOUNT, not its own, which is the
   * only reason this exists: two results belonging to two different people are
   * not a retest, and the pairing is by user.
   */
  email?: string
  /**
   * Clear the account's existing orders first. Default TRUE, which is what makes
   * a plain run idempotent. A retest passes false, because the entire point is
   * to leave the baseline standing.
   */
  clear?: boolean
  /**
   * Override the collection date. Defaults to the fixture's own `collectedAt`.
   *
   * A retest needs one, because a fixture's date is fixed and two fixtures can
   * easily carry dates in the wrong order. Which reading is the later one is the
   * whole basis of a comparison, so it is set explicitly rather than hoped for.
   */
  collectedAt?: string
}

export async function seedScenario(
  scenarioName: ScenarioName,
  options: SeedOptions = {},
): Promise<SeedResult> {
  const scenario = SCENARIOS[scenarioName]
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioName}`)
  }

  const supabase = createSupabaseAdminClient()
  const devEmail = options.email ?? `dev+${scenarioName}@androprime.test`
  const clear = options.clear ?? true
  const collectedAt = options.collectedAt ?? scenario.payload.collectedAt

  // Create or get test user
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users.find((u) => u.email === devEmail)

  let userId: string
  if (existing) {
    userId = existing.id
    /* 🔴 THE PASSWORD IS RESET ON EVERY RUN, added 2026-09-12.
       It used to be set only at CREATION, so an account that already existed
       kept whatever it had and the credentials the script prints were a guess
       about history rather than a statement about the account. That is the same
       defect as the duplicate orders below, one field further out: a fixture
       has to put the account into a KNOWN state, and the password is part of
       that state. It surfaced when the printed password did not open the screen
       the run had just built.
       `email_confirm` is re-asserted for the same reason: an account confirmed
       by hand, or never confirmed, is otherwise a second unknown. */
    const { error: resetError } = await supabase.auth.admin.updateUserById(userId, {
      password: DEV_PASSWORD,
      email_confirm: true,
    })
    if (resetError) {
      throw new Error(`Failed to reset the test user's password: ${resetError.message}`)
    }
  } else {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: devEmail,
      email_confirm: true,
      password: DEV_PASSWORD,
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

  /* 🔴 CLEAR THE ACCOUNT'S PREVIOUS ORDERS FIRST, added 2026-09-12.
     This used to insert unconditionally, so every run left ANOTHER order and
     another result on the same dev account, and the account's state after two
     runs was undefined. It looked harmless until the member screen was opened:
     the trend rail plots one point per result, so a second run drew two
     identical readings on the same date and the screen reported a trend that
     was an artefact of seeding. A fixture that accumulates is not a fixture.

     Safe because this function OWNS the account: it derives the address from
     the scenario name and creates it. Everything hangs off kit_orders by
     `on delete cascade`, so this takes the results, biomarkers and the order's
     symptom answers with it. Check-in answers carry no order_id and are not
     touched here; `seedMember` rewrites those. */
  if (clear) {
    const { error: clearError } = await supabase
      .from('kit_orders')
      .delete()
      .eq('user_id', userId)
    if (clearError) throw new Error(`Failed to clear previous orders: ${clearError.message}`)
  }

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
      /* 🔴 THE COLLECTION DATE, which was not being set, added 2026-09-12.
         `getDashboardData` reads `collectedAt` from this column, so an unset
         one defaulted to now and EVERY seeded result was dated today no matter
         what its fixture said. Invisible on the results dashboard, which shows
         one result; obvious on the trend rail, which puts the date under each
         point and was captioning a April reading "12 Sept". The fixture already
         carries the date and is the right source for it. */
      received_at: collectedAt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw_payload: payload as unknown as any,
    })
    .select('id')
    .single()
  if (resultError || !result) {
    throw new Error(`Failed to insert lab_results: ${resultError?.message}`)
  }
  const resultId = result.id

  // Convert fixture biomarkers to DB rows
  const biomarkers = payload.biomarkers.map((b) => ({
    markerName: b.name,
    value: b.value,
    unit: b.unit,
    referenceLow: b.referenceRange.low,
    referenceHigh: b.referenceRange.high,
  }))
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
