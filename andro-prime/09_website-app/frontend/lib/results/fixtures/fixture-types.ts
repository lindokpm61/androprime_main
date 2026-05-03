import type { KitType, ScenarioName } from '../types'

export interface SymptomAnswerFixture {
  questionKey: string
  answer: boolean | string | number
}

export interface ScenarioBiomarker {
  name: string
  value: number
  unit: string
  referenceRange: { low: number | null; high: number | null }
  status: 'optimal' | 'borderline' | 'low' | 'critical'
}

export interface ScenarioPayload {
  orderId: string
  userId: string
  kitType: KitType
  collectedAt: string
  biomarkers: ScenarioBiomarker[]
}

export interface ScenarioFixture {
  name: ScenarioName
  label: string
  testAge: number
  payload: ScenarioPayload
  symptomAnswers: SymptomAnswerFixture[]
}
