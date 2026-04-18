import { NextRequest, NextResponse } from 'next/server'
import { seedScenario } from '@/lib/results/seed'
import { SCENARIOS } from '@/lib/results/fixtures/registry'
import type { ScenarioName } from '@/lib/results/types'

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const scenarioName = request.nextUrl.searchParams.get('scenario')

  if (!scenarioName) {
    return NextResponse.json(
      {
        error: 'Missing ?scenario= parameter',
        available: Object.keys(SCENARIOS),
      },
      { status: 400 }
    )
  }

  if (!(scenarioName in SCENARIOS)) {
    return NextResponse.json(
      {
        error: `Unknown scenario: "${scenarioName}"`,
        available: Object.keys(SCENARIOS),
      },
      { status: 400 }
    )
  }

  try {
    const result = await seedScenario(scenarioName as ScenarioName)
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
