import { SCENARIOS } from './fixtures'
import { normalise } from './normaliser'
import { classify } from './classifier'
import type { DashboardData, KitData, SingleResult, ScenarioName, KitType } from './types'

export function buildDashboardFromScenario(scenarioNames: ScenarioName[]): DashboardData {
  const kitMap = new Map<KitType, SingleResult[]>()
  let userAge: number | null = null

  for (const name of scenarioNames) {
    const fixture = SCENARIOS[name]
    if (!fixture) continue

    userAge = fixture.testAge

    const biomarkers = normalise(fixture.payload)
    const markers = classify({
      kitType: fixture.payload.kitType,
      biomarkers,
      symptomAnswers: fixture.symptomAnswers.map((a) => ({
        questionKey: a.questionKey,
        answer: a.answer,
      })),
      qualifierResponses: [],
      userAge: fixture.testAge,
    })

    const singleResult: SingleResult = {
      resultId: `fixture-${name}`,
      collectedAt: fixture.payload.collectedAt,
      markers,
      hasQualifierPending: markers.some((m) => m.requiresQualifier),
    }

    const kitType = fixture.payload.kitType
    if (!kitMap.has(kitType)) {
      kitMap.set(kitType, [])
    }
    kitMap.get(kitType)!.push(singleResult)
  }

  if (kitMap.size === 0) return { state: 'no-results' }

  const kits: KitData[] = Array.from(kitMap.entries()).map(([kitType, results]) => ({
    kitType,
    results,
  }))

  return { state: 'ready', kits, userAge }
}
