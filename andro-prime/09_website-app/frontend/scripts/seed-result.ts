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

  const { seedScenario, DEV_PASSWORD } = await import('../lib/results/seed')
  const { seedMember } = await import('../lib/membership/seedMember')
  const { SCENARIOS } = await import('../lib/results/fixtures/registry')
  const { markerToMove } = await import('../lib/membership/checkin')
  const { classify } = await import('../lib/results/classifier')
  type ScenarioName = keyof typeof SCENARIOS

  const args = process.argv.slice(2)
  /* The value after --retest is a scenario name too, so it must be excluded
     here or a command with no baseline would silently seed the retest as one. */
  const scenarioName = args.find(
    (a, i) => !a.startsWith('--') && args[i - 1] !== '--retest'
  )
  const withMember = args.includes('--member')
  const retestIdx = args.indexOf('--retest')
  const retestScenario = retestIdx !== -1 && retestIdx < args.length - 1 ? args[retestIdx + 1] : null
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
    console.error('  --retest <scenario>  add a SECOND result to the same account, dated 90')
    console.error('            days after the baseline, so the pair can be compared. Use the')
    console.error('            same scenario for an unchanged retest, or a different one to')
    console.error('            move the numbers. A different KIT is the step-down case.')
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
  console.log(`  │  retest      ${retestScenario ?? 'no'}`)
  console.log('  │')
  console.log('  │  🔴 THIS IS THE PRODUCTION DATABASE. There is no local one.')
  console.log('  └───────────────────────────────────────────────────────')
  console.log('')

  if (!confirmed) {
    console.error('Refusing to write without --yes. Re-run with --yes once the above is right.')
    process.exit(1)
  }

  if (retestScenario && !(retestScenario in SCENARIOS)) {
    usage(`Unknown retest scenario: "${retestScenario}"`)
  }

  const result = await seedScenario(scenarioName as ScenarioName)
  console.log('Seeded the baseline result:')
  console.log(JSON.stringify(result, null, 2))

  if (retestScenario) {
    /* 🔴 THE RETEST GOES ON THE BASELINE'S ACCOUNT AND IS DATED AFTER IT.
       Two results belonging to two different people are not a retest, and two
       results whose dates run backwards are not a comparison, so neither is
       left to chance: the account is named explicitly, and the date is computed
       from the BASELINE'S rather than taken from the retest fixture, which
       carries a fixed date of its own that may well be earlier.
       90 days is the first-cycle cadence a member with a marker to move gets.
       `clear: false`, obviously: leaving the baseline standing is the point. */
    const baseline = SCENARIOS[scenarioName as ScenarioName]
    const retest = SCENARIOS[retestScenario as ScenarioName]
    const retestAt = new Date(
      new Date(baseline.payload.collectedAt).getTime() + 90 * 86400000
    ).toISOString()

    const second = await seedScenario(retestScenario as ScenarioName, {
      email: `dev+${scenarioName}@androprime.test`,
      clear: false,
      collectedAt: retestAt,
    })
    console.log(`\nSeeded the retest (${retestScenario}, dated ${retestAt.slice(0, 10)}):`)
    console.log(JSON.stringify(second, null, 2))

    const sameKit = baseline.payload.kitType === retest.payload.kitType
    console.log(
      `\n  Baseline kit ${baseline.payload.kitType}, retest kit ${retest.payload.kitType}` +
        (sameKit
          ? ' (same kit: every marker should pair)'
          : ' (STEP-DOWN: only the shared markers pair)')
    )
  }

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
    console.log(`    dev+${scenarioName}@androprime.test  /  ${DEV_PASSWORD}`)
    console.log('  then open /account/membership. MEMBERSHIP_ENABLED must be on.')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
