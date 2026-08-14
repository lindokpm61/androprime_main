/**
 * Guards doctor-heartbeat: the absence detector that alarms when the nightly doctor stops.
 *
 * WHY THIS EXISTS. This is the only thing in the repo that can report the doctor's DEATH rather
 * than its findings, so the case that matters most is the one that actually happened: a task
 * that exists, is enabled, carries the right trigger, and never executes. Four nights passed
 * with no alarm from anywhere, because every alarm route lived inside the process that was not
 * running.
 *
 * The two failure directions are asymmetric. A false "alive" restores the exact silence this
 * was built to break. A false "stale" trains its reader to ignore it, which ends in the same
 * place by a longer road. So `unknown` is a first-class outcome and must never collapse into
 * either, and the tests below spend most of their effort on that boundary.
 *
 * No network, no database, no credentials. `judge` and `decide` take their inputs as arguments.
 *
 * Run: npx tsx scripts/content-engine/test-doctor-heartbeat.ts
 */
import {
  judge, decide, shouldAlarm, exitCodeFor, describe as describeVerdict, findOpenTask,
  alarmBody, isDirectInvocation, MARKER, MAX_AGE_HOURS, type Verdict,
} from './doctor-heartbeat'
import type { CuTask } from './clickup'

let failures = 0

function check(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`) }
  catch (e) { failures += 1; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`) }
}

function assert(cond: unknown, msg: string) { if (!cond) throw new Error(msg) }

const NOW = new Date('2026-08-05T02:00:00Z')
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 36e5).toISOString()

/**
 * A `CuTask` as `clickup.ts` actually returns one.
 *
 * It used to be built as `{ status: { status: 'to do' } }` — the RAW ClickUp payload shape, cast
 * to `CuTask`, which has no `status` property. That fixture is why the settled-task check below
 * passed while `findOpenTask` was broken: production read `t.status?.status` and the fixture
 * supplied exactly that, so the test REPRODUCED the defect rather than catching it, and the two
 * agreed all the way to a green tick. The `as CuTask` cast is what let it: a cast tells the
 * compiler to stop asking the one question that would have caught this. Corrected 2026-08-14 to
 * the real field, `statusName`, with no cast, so the compiler checks the fixture too.
 */
function task(over: Partial<CuTask> = {}): CuTask {
  return {
    id: 't1',
    name: `${MARKER} the nightly content-doctor has stopped running`,
    statusName: 'to do',
    description: '',
    ...over,
  }
}

console.log('\ndoctor-heartbeat — judging absence')

check('a run inside the window is ALIVE', () => {
  const v = judge({ dbLast: hoursAgo(3), logLast: null }, NOW)
  assert(v.state === 'alive', `got ${v.state}`)
})

// The actual 2026-08-01 to 2026-08-05 outage.
check('a four-day-old run is STALE', () => {
  const v = judge({ dbLast: hoursAgo(96), logLast: hoursAgo(96) }, NOW)
  assert(v.state === 'stale', `got ${v.state}`)
  assert(v.state === 'stale' && v.ageHours === 96, `age should be reported, got ${(v as { ageHours: number }).ageHours}`)
})

check('the boundary is the documented window, not a vibe', () => {
  assert(judge({ dbLast: hoursAgo(MAX_AGE_HOURS - 1), logLast: null }, NOW).state === 'alive', 'just inside is alive')
  assert(judge({ dbLast: hoursAgo(MAX_AGE_HOURS + 1), logLast: null }, NOW).state === 'stale', 'just outside is stale')
})

check('no signal at all is NEVER RUN, distinct from stale', () => {
  const v = judge({ dbLast: null, logLast: null }, NOW)
  assert(v.state === 'never-run', `got ${v.state}`)
})

check('an unreadable database with no other signal is UNKNOWN, never alive and never stale', () => {
  const v = judge({ dbLast: null, logLast: null, unreadable: 'connection refused' }, NOW)
  assert(v.state === 'unknown', `got ${v.state}`)
  assert(exitCodeFor(v) === 1, 'unknown must not share an exit code with stale')
  assert(!shouldAlarm(v), 'unknown must not raise the "doctor is dead" alarm, which would be a guess')
})

// Each signal covers the other's blind spot: the log survives a dead database, the database
// survives a rebuilt machine. A run recorded in either one is still a run.
check('the FRESHEST signal wins, so one stale store cannot fake a death', () => {
  const v = judge({ dbLast: hoursAgo(96), logLast: hoursAgo(2) }, NOW)
  assert(v.state === 'alive', `got ${v.state}`)
  assert(v.state === 'alive' && v.source === 'cron log', `wrong source: ${(v as { source: string }).source}`)
})

check('a log-only run counts, for a doctor that ran but could not reach the database', () => {
  const v = judge({ dbLast: null, logLast: hoursAgo(1) }, NOW)
  assert(v.state === 'alive' && v.source === 'cron log', `got ${v.state}`)
})

check('an unreadable database does not mask a good log signal', () => {
  const v = judge({ dbLast: null, logLast: hoursAgo(1), unreadable: 'db down' }, NOW)
  assert(v.state === 'alive', `a readable log is still an answer, got ${v.state}`)
})

check('a corrupt timestamp is UNKNOWN rather than infinitely old', () => {
  const v = judge({ dbLast: 'not-a-date', logLast: null }, NOW)
  assert(v.state === 'unknown', `got ${v.state}`)
})

console.log('\ndoctor-heartbeat — alarm routing')

check('stale with no open task CREATES one', () => {
  const a = decide(judge({ dbLast: hoursAgo(96), logLast: null }, NOW), null)
  assert(a.kind === 'create', `got ${a.kind}`)
})

check('stale with an open task COMMENTS, never a second task', () => {
  const a = decide(judge({ dbLast: hoursAgo(96), logLast: null }, NOW), task())
  assert(a.kind === 'comment', `got ${a.kind}`)
  assert(a.kind === 'comment' && a.taskId === 't1', 'must comment on the existing task')
})

check('recovery COMMENTS and never auto-closes', () => {
  const a = decide(judge({ dbLast: hoursAgo(1), logLast: null }, NOW), task())
  assert(a.kind === 'comment', `got ${a.kind}`)
  assert(a.kind === 'comment' && /human to close/.test(a.text), 'must say a human closes it')
})

check('healthy with no open task does NOTHING', () => {
  assert(decide(judge({ dbLast: hoursAgo(1), logLast: null }, NOW), null).kind === 'none', 'should be none')
})

check('UNKNOWN does not open a task: it is not evidence of death', () => {
  const a = decide({ state: 'unknown', why: 'db down' }, null)
  assert(a.kind === 'none', `got ${a.kind}`)
})

check('a settled task is not treated as open, so a new one gets raised', () => {
  for (const settled of ['complete', 'closed', 'done', 'COMPLETE']) {
    assert(findOpenTask([task({ statusName: settled })]) === null, `${settled} is settled`)
  }
  assert(findOpenTask([task()]) !== null, 'to do is open')
  assert(findOpenTask([task({ statusName: 'in progress' })]) !== null, 'in progress is open')
  assert(findOpenTask([task({ name: 'unrelated task' })]) === null, 'only our marker counts')
})

console.log('\ndoctor-heartbeat — the alarm says how to fix it')

check('the body names the quote trap and the call form', () => {
  const body = alarmBody(judge({ dbLast: hoursAgo(96), logLast: null }, NOW))
  assert(/call/.test(body), 'must name the call form')
  assert(/BEFORE the redirect/.test(body), 'must explain why it is silent')
})

check('the body forbids the two verifications that gave a false green', () => {
  const body = alarmBody({ state: 'never-run' })
  const flat = body.replace(/\s+/g, ' ')
  assert(/XML/.test(flat), 'must warn off reading the task XML')
  assert(/shell/.test(flat), 'must warn off running the wrapper from a shell')
  assert(/unattended/.test(flat), 'must require an unattended trigger')
  assert(/agent_runs/.test(flat), 'must name the artefact that proves it ran')
})

console.log('\ndoctor-heartbeat — exit codes and wording')

check('alive 0, unknown 1, stale and never-run 2', () => {
  assert(exitCodeFor(judge({ dbLast: hoursAgo(1), logLast: null }, NOW)) === 0, 'alive is 0')
  assert(exitCodeFor({ state: 'unknown', why: 'x' }) === 1, 'unknown is 1')
  assert(exitCodeFor({ state: 'never-run' }) === 2, 'never-run is 2')
  assert(exitCodeFor(judge({ dbLast: hoursAgo(96), logLast: null }, NOW)) === 2, 'stale is 2')
})

check('UNKNOWN says out loud that it is not a pass', () => {
  assert(/not a pass/i.test(describeVerdict({ state: 'unknown', why: 'x' } as Verdict)), 'must not read as healthy')
})

console.log('\ndoctor-heartbeat — entry-point guard')

check('the test file is NOT the entry point', () => {
  assert(!isDirectInvocation('/x/test-doctor-heartbeat.ts'), 'suffix collision must not fire')
  assert(isDirectInvocation('/x/doctor-heartbeat.ts'), 'the real file should fire')
  assert(!isDirectInvocation(undefined), 'undefined must not fire')
})

console.log('')
if (failures) { console.log(`${failures} test(s) FAILED`); process.exit(1) }
console.log('All doctor-heartbeat tests passed.')
