import { seedScenario } from '../lib/results/seed'
import { SCENARIOS } from '../lib/results/fixtures/registry'
import type { ScenarioName } from '../lib/results/types'

const scenarioName = process.argv[2]

if (!scenarioName) {
  console.error('Usage: npx tsx scripts/seed-result.ts <scenario-name>')
  console.error('Available scenarios:', Object.keys(SCENARIOS).join(', '))
  process.exit(1)
}

if (!(scenarioName in SCENARIOS)) {
  console.error(`Unknown scenario: "${scenarioName}"`)
  console.error('Available scenarios:', Object.keys(SCENARIOS).join(', '))
  process.exit(1)
}

seedScenario(scenarioName as ScenarioName)
  .then((result) => {
    console.log('Seeded successfully:')
    console.log(JSON.stringify(result, null, 2))
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed failed:', err.message)
    process.exit(1)
  })
