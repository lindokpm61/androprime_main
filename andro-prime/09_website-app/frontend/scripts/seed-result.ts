import fs from 'fs'
import path from 'path'

/*
 * Seeds a results scenario, and optionally a membership with check-in history.
 *
 *   npx tsx scripts/seed-result.ts <scenario-name> [--member] [--yes]
 *
 * 🔴 IT WRITES TO PRODUCTION. There is no local Supabase in this repo, so the
 * service role key points at the live project and every row below lands there.
 * The target project ref is printed before anything is written and `--yes` is
 * required to proceed, because "it seeds a dev account" and "it writes to the
 * production database" are both true and only the first one is memorable.
 *
 * ⚠ IT DID NOT LOAD `.env.local` UNTIL 2026-09-12, and the failure read as the
 * wrong thing entirely. `npx tsx` is not `next`, so nothing populated the env:
 * `SUPABASE_SERVICE_ROLE_KEY` fell through to a placeholder and the run died as
 * "Invalid API key", which reads as a ROTATED key rather than a missing one.
 * Only `scripts/import-blog-to-db.ts` carried a loader; its one is reused here.
 *
 * ⚠ EVERYTHING RUNS INSIDE `main()` AND THE IMPORTS ARE DYNAMIC, for two
 * reasons that pull the same way. `lib/supabase/env` reads process.env at module
 * scope, so a static import would resolve the key BEFORE the loader had run and
 * reintroduce the exact failure above. And tsx compiles this file to CJS,
 * because the package is not `"type": "module"`, so top-level await is a
 * transform error rather than a runtime one.
 */

// Minimal .env.local loader (no dotenv dependency; only sets vars not already
// present, so an explicitly exported var still wins).
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    const key = m[1]
    let val = m[2]
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

async function main() {
  loadEnvLocal()

  const { seedScenario } = await import('../lib/results/seed')
  const { seedMember } = await import('../lib/membership/seedMember')
  const { SCENARIOS } = await import('../lib/results/fixtures/registry')
  const { markerToMove } = await import('../lib/membership/checkin')
  const { classify } = await import('../lib/results/classifier')
  type ScenarioName = keyof typeof SCENARIOS

  const args = process.argv.slice(2)
  const scenarioName = args.find((a) => !a.startsWith('--'))
  const withMember = args.includes('--member')
  const confirmed = args.includes('--yes')

  function usage(message?: string): never {
    if (message) console.error(message)
    console.error('')
    console.error('Usage: npx tsx scripts/seed-result.ts <scenario-name> [--member] [--yes]')
    console.error('')
    console.error('  --member  also create an active membership and 22 days of check-in')
    console.error('            history, which is what puts /account/membership into its')
    console.error('            MEMBER state. Needs a scenario with a movable marker')
    console.error('            (low vitamin D, low B12, low or suboptimal ferritin).')
    console.error('  --yes     confirm the write. Required: this writes to PRODUCTION.')
    console.error('')
    console.error('Available scenarios:', Object.keys(SCENARIOS).join(', '))
    process.exit(1)
  }

  if (!scenarioName) usage()
  if (!(scenarioName in SCENARIOS)) usage(`Unknown scenario: "${scenarioName}"`)

  /* The project ref, read back out of the URL rather than asserted, so the
     banner names the database that is actually about to be written to. */
  const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
    .replace(/^https?:\/\//, '')
    .split('.')[0]

  console.log('')
  console.log('  ┌─ SEED ────────────────────────────────────────────────')
  console.log(`  │  project     ${projectRef || '(unknown: NEXT_PUBLIC_SUPABASE_URL unset)'}`)
  console.log(`  │  scenario    ${scenarioName}`)
  console.log(`  │  account     dev+${scenarioName}@androprime.test`)
  console.log(`  │  membership  ${withMember ? 'YES, plus 22 days of check-in history' : 'no'}`)
  console.log('  │')
  console.log('  │  🔴 THIS IS THE PRODUCTION DATABASE. There is no local one.')
  console.log('  └───────────────────────────────────────────────────────')
  console.log('')

  if (!confirmed) {
    console.error('Refusing to write without --yes. Re-run with --yes once the above is right.')
    process.exit(1)
  }

  const result = await seedScenario(scenarioName as ScenarioName)
  console.log('Seeded the result:')
  console.log(JSON.stringify(result, null, 2))

  if (withMember) {
    /* WHICH MARKER THE LOOP IS ABOUT IS THE ENGINE'S ANSWER, NOT AN ARGUMENT.
       `getMembershipView` picks it with `markerToMove` over the classified
       states, so a fixture that named its own marker could seed check-in
       questions for a marker the screen then refuses to ask about, and the taps
       would silently not be the ones on screen. Asking the same functions the
       same question is the only way the two agree.

       ⚠ `classify` DIRECTLY, NOT `getDashboardData`. The obvious call is the one
       the screen makes, and it does not work here: `getDashboardData` builds a
       request-scoped Supabase client and dies outside one as "`cookies` was
       called outside a request scope", AFTER the result rows have already been
       written. `classify` is the pure function underneath it and takes the same
       fixture this script just seeded, so the marker is the engine's answer with
       no request and no round trip. */
    const scenario = SCENARIOS[scenarioName as ScenarioName]
    const states = classify({
      kitType: scenario.payload.kitType,
      biomarkers: scenario.payload.biomarkers.map((b) => ({
        markerName: b.name,
        value: b.value,
        unit: b.unit,
        referenceLow: b.referenceRange.low,
        referenceHigh: b.referenceRange.high,
      })),
      symptomAnswers: scenario.symptomAnswers,
      qualifierResponses: [],
      userAge: scenario.testAge,
    }).map((m) => m.state)
    const marker = markerToMove(states)
    if (!marker) {
      console.error('')
      console.error(`Scenario "${scenarioName}" has no marker the loop can move, so there is`)
      console.error('nothing for the check-in to ask about and the member screen would render')
      console.error('without the daily loop. Try: low-vitamin-d, low-ferritin, multi-deficiency.')
      process.exit(1)
    }

    const member = await seedMember(result.userId, marker)
    console.log('\nSeeded the membership:')
    console.log(JSON.stringify(member, null, 2))
    console.log('')
    console.log('  Sign in at /auth/login as:')
    console.log(`    dev+${scenarioName}@androprime.test  /  dev-password-not-used`)
    console.log('  then open /account/membership. MEMBERSHIP_ENABLED must be on.')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
