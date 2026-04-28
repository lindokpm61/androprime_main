import type { VitallWebhookPayload } from '@/lib/vitall/types'
import type { ScenarioName } from '../types'

export interface SymptomAnswerFixture {
  questionKey: string
  answer: boolean | string | number
}

export interface ScenarioFixture {
  name: ScenarioName
  label: string
  testAge: number
  payload: VitallWebhookPayload
  symptomAnswers: SymptomAnswerFixture[]
}
