import type { ThrivaWebhookPayload, ScenarioName } from '../types'

export interface SymptomAnswerFixture {
  questionKey: string
  answer: boolean | string | number
}

export interface ScenarioFixture {
  name: ScenarioName
  label: string
  testAge: number
  payload: ThrivaWebhookPayload
  symptomAnswers: SymptomAnswerFixture[]
}
