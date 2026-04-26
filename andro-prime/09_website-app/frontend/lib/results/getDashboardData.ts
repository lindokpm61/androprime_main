import { createSupabaseServerClient } from '@/lib/supabase/server'
import { classify } from './classifier'
import { buildDashboardFromScenario } from './buildDashboardFromScenario'
import type {
  DashboardData,
  KitData,
  KitType,
  NormalisedBiomarker,
  PreResultsOrderStatus,
  ScenarioName,
  SingleResult,
} from './types'

const PRE_RESULTS_FIXTURES: Record<string, { state: 'pre-results'; orderStatus: PreResultsOrderStatus; kitType: KitType }> = {
  'pre-results-kit1-dispatched':  { state: 'pre-results', orderStatus: 'order-placed',    kitType: 'testosterone'     },
  'pre-results-kit1-sent':        { state: 'pre-results', orderStatus: 'kit-sent',         kitType: 'testosterone'     },
  'pre-results-kit1-received':    { state: 'pre-results', orderStatus: 'sample-received',  kitType: 'testosterone'     },
  'pre-results-kit1-analysing':   { state: 'pre-results', orderStatus: 'analysing',        kitType: 'testosterone'     },
  'pre-results-kit2-sent':        { state: 'pre-results', orderStatus: 'kit-sent',         kitType: 'energy-recovery'  },
}

export async function getDashboardData(
  userId: string,
  devScenario?: string
): Promise<DashboardData> {
  // Dev fixture override — never runs in production
  if (process.env.NODE_ENV !== 'production' && devScenario) {
    if (PRE_RESULTS_FIXTURES[devScenario]) return PRE_RESULTS_FIXTURES[devScenario]

    const names = devScenario
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as ScenarioName[]
    return buildDashboardFromScenario(names)
  }

  const supabase = await createSupabaseServerClient()

  const { data: results, error: resultsError } = await supabase
    .from('lab_results')
    .select('id, order_id, kit_type, received_at')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })

  if (resultsError || !results || results.length === 0) {
    // Check for an active order with no results yet
    const { data: orders } = await supabase
      .from('kit_orders')
      .select('kit_type, status')
      .eq('user_id', userId)
      .not('status', 'in', '("cancelled","refunded")')
      .order('ordered_at', { ascending: false })
      .limit(1)

    const order = orders?.[0]
    if (order) {
      const orderStatus = dbStatusToDisplayStatus(order.status)
      return { state: 'pre-results', orderStatus, kitType: order.kit_type as KitType }
    }

    return { state: 'no-results' }
  }

  const resultIds = results.map((r) => r.id)
  const orderIds = [...new Set(results.map((r) => r.order_id))]

  const [biomarkerRes, symptomRes, qualifierRes, userRes] = await Promise.all([
    supabase
      .from('biomarker_values')
      .select('result_id, marker_name, value, unit, reference_low, reference_high')
      .in('result_id', resultIds),
    supabase
      .from('symptom_answers')
      .select('order_id, question_key, answer')
      .eq('user_id', userId)
      .in('order_id', orderIds),
    supabase
      .from('qualifier_responses')
      .select('result_id, question_key, answer')
      .eq('user_id', userId)
      .in('result_id', resultIds),
    supabase.from('users').select('age').eq('id', userId).single(),
  ])

  const allBiomarkers = biomarkerRes.data ?? []
  const allSymptoms = symptomRes.data ?? []
  const allQualifiers = qualifierRes.data ?? []
  const userAge = userRes.data?.age ?? null

  const kitMap = new Map<string, SingleResult[]>()

  for (const result of results) {
    const biomarkers: NormalisedBiomarker[] = allBiomarkers
      .filter((b) => b.result_id === result.id)
      .map((b) => ({
        markerName: b.marker_name,
        value: b.value,
        unit: b.unit,
        referenceLow: b.reference_low,
        referenceHigh: b.reference_high,
      }))

    if (biomarkers.length === 0) continue

    const symptomAnswers = allSymptoms
      .filter((s) => s.order_id === result.order_id)
      .map((s) => ({ questionKey: s.question_key, answer: s.answer }))

    const qualifierResponses = allQualifiers
      .filter((q) => q.result_id === result.id)
      .map((q) => ({ questionKey: q.question_key, answer: q.answer }))

    const markers = classify({
      kitType: result.kit_type,
      biomarkers,
      symptomAnswers,
      qualifierResponses,
      userAge,
    })

    const singleResult: SingleResult = {
      resultId: result.id,
      collectedAt: result.received_at ?? null,
      markers,
      hasQualifierPending: markers.some((m) => m.requiresQualifier),
    }

    if (!kitMap.has(result.kit_type)) {
      kitMap.set(result.kit_type, [])
    }
    kitMap.get(result.kit_type)!.push(singleResult)
  }

  if (kitMap.size === 0) return { state: 'no-results' }

  const kits: KitData[] = Array.from(kitMap.entries()).map(([kitType, kitResults]) => ({
    kitType: kitType as KitType,
    results: kitResults,
  }))

  // Most recently tested kit first
  kits.sort((a, b) => {
    const ad = a.results[0]?.collectedAt ?? ''
    const bd = b.results[0]?.collectedAt ?? ''
    return bd.localeCompare(ad)
  })

  return { state: 'ready', kits, userAge }
}

function dbStatusToDisplayStatus(status: string): PreResultsOrderStatus {
  switch (status) {
    case 'dispatched':      return 'kit-sent'
    case 'sample_registered': return 'sample-received'
    case 'processing':      return 'analysing'
    default:                return 'order-placed'
  }
}
