import { buildDashboardFromScenario } from './buildDashboardFromScenario'
import type { DashboardData, ScenarioName } from './types'

/*
 * THE PUBLIC DEMO'S SCENARIO SET.
 *
 * 🔴 WHY THIS FILE EXISTS RATHER THAN REUSING `?dev=`. `getDashboardData` has a
 * fixture branch, and it is guarded by `process.env.NODE_ENV !== 'production'`
 * for a good reason: it takes an ARBITRARY scenario name off the query string.
 * Opening that in production would not be a demo, it would be a public endpoint
 * that renders any fixture in the repository, including the ones written to
 * exercise GP-referral and sample-failure paths. The guard stays exactly as it
 * is. This module is a separate, deliberately production-enabled path with a
 * CLOSED SET: an unknown id falls back to the default rather than reaching the
 * registry, so the URL cannot select anything that is not listed here.
 *
 * 🔴 IT READS NO DATABASE AND TAKES NO USER. `buildDashboardFromScenario` runs
 * the real `classify()` over fixture values and returns a `DashboardData`; there
 * is no Supabase client on this path and no user id to pass one. That is what
 * makes the homepage's promise -- "We never put your data in it" -- structurally
 * true rather than a policy someone has to remember.
 *
 * ⚠ THE THREE ENTRIES ARE AN ARGUMENT, NOT A SAMPLE. They were chosen so the
 * demo cannot be read as the flattering case: one result where the laboratory
 * and our action bands disagree, one where there is nothing to do, and one that
 * routes to a GP and earns the business nothing. Removing the second or the
 * third turns this from a demonstration into a pitch.
 */

export interface DemoResult {
  /** URL id, e.g. `/demo?r=split`. Stable: it will end up in links. */
  id: string
  scenario: ScenarioName
  /** Switcher label. */
  label: string
  /** One line under the switcher saying what this result shows. */
  blurb: string
}

export const DEMO_RESULTS: DemoResult[] = [
  {
    id: 'split',
    scenario: 'demo-kit3-split',
    label: 'Lab normal, three to monitor',
    blurb:
      'Kit 3, nine markers. Every value here is inside the laboratory reference range. Three of them sit outside the action bands our GP approved, and the report says so.',
  },
  {
    id: 'all-clear',
    scenario: 'optimal-testosterone',
    label: 'Nothing to act on',
    blurb:
      'Kit 1, five markers, all of them where you would want them. This is what the report looks like when there is nothing to tell you, and nothing to sell you.',
  },
  {
    id: 'gp',
    scenario: 'low-testosterone',
    label: 'A result that goes to a GP',
    blurb:
      'Kit 1, with testosterone below the action threshold. The next step here is a conversation with a doctor, not a product. That result earns us nothing.',
  },
]

export const DEFAULT_DEMO_ID = DEMO_RESULTS[0].id

/** Resolves a URL id to a listed result. Anything unknown gets the default. */
export function resolveDemoResult(id?: string): DemoResult {
  return DEMO_RESULTS.find((r) => r.id === id) ?? DEMO_RESULTS[0]
}

/** Builds the dashboard for a listed result. No database, no user. */
export function getDemoDashboard(result: DemoResult): DashboardData {
  return buildDashboardFromScenario([result.scenario])
}
