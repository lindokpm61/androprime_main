import type { ScenarioName } from '../types'
import type { ScenarioFixture } from './fixture-types'
import lowTestosterone from './low-testosterone'
import normalTestosteroneEnergy from './normal-testosterone-energy'
import normalTestosteroneNoEnergy from './normal-testosterone-no-energy'
import optimalTestosterone from './optimal-testosterone'
import lowVitaminD from './low-vitamin-d'
import elevatedCrp from './elevated-crp'
import highCrp from './high-crp'
import lowFerritin from './low-ferritin'
import lowB12 from './low-b12'
import multiDeficiency from './multi-deficiency'

export const SCENARIOS: Record<ScenarioName, ScenarioFixture> = {
  'low-testosterone': lowTestosterone,
  'normal-testosterone-energy': normalTestosteroneEnergy,
  'normal-testosterone-no-energy': normalTestosteroneNoEnergy,
  'optimal-testosterone': optimalTestosterone,
  'low-vitamin-d': lowVitaminD,
  'elevated-crp': elevatedCrp,
  'high-crp': highCrp,
  'low-ferritin': lowFerritin,
  'low-b12': lowB12,
  'multi-deficiency': multiDeficiency,
}
