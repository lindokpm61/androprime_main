/**
 * Guards content-doctor-cron: the alarm rule, the dedup mechanism, and what happens when
 * ClickUp is down.
 *
 * WHY A SIBLING FILE RATHER THAN MORE OF `test-content-doctor.ts`.
 * That suite is 1,000+ lines and has one subject: the doctor's pure logic and its eight
 * invariants, attacked through an injected fake PostgREST. This suite has a different subject
 * (delivery and deduplication), a different stub surface (a ClickUp port, not a `Queryable`),
 * and a different failure mode to prove (an alarm that is raised but not delivered). Folding it
 * in would have made one 1,400-line file where the ClickUp stubs sit a long way from the tests
 * that use them, and would have meant you cannot run the cron checks on their own. Both files
 * are run by the same command and both must be green.
 *
 * No network, no database, no credentials, NO LIVE CLICKUP CALL. Every ClickUp interaction goes
 * through an injected `ClickUpPort` that records what it was asked to do.
 *
 * The fixtures are scored by the DOCTOR, not by hand: `exitCodeFor` and `summaryOf` compute
 * every exit code and summary below. A test that hand-typed `exit_code: 3` would be asserting
 * its own arithmetic and would keep passing after the real rule changed.
 *
 * Run: npx tsx scripts/content-engine/test-content-doctor-cron.ts
 */

import {
  exitCodeFor, summaryOf, type Invariant, type Finding, type DoctorRun,
} from './content-doctor'
import {
  shouldAlarm, alarmReason, alarmingInvariants, findOpenDoctorTask, decide, runCron,
  alarmBody, alarmComment, clearComment, renderResult,
  MARKER, TASK_NAME, SPRINT_LIST_ID, SETTLED_STATUSES,
  type ClickUpPort, type CronResult,
} from './content-doctor-cron'
import type { CuTask } from './clickup'

let failures = 0

function check(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failures++
    console.error(`  ✗ ${name}\n      ${(err as Error).message}`)
  }
}

const pending: Array<Promise<void>> = []
function checkAsync(name: string, fn: () => Promise<void>) {
  pending.push(
    fn().then(
      () => { console.log(`  ✓ ${name}`) },
      (err: Error) => { failures++; console.error(`  ✗ ${name}\n      ${err.message}`) },
    ),
  )
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

// ───────────────────────────────────────────────────────────────── fixtures

const violation = (ref: string, message: string): Finding => ({ kind: 'violation', ref, message, fix: 'do the thing' })

const pass = (id: string): Invariant =>
  ({ id, title: `${id} holds`, reads: ['t (3 rows)'], verdict: 'PASS', reason: null, expected: false, findings: [] })

const fail = (id: string, ...vs: Finding[]): Invariant =>
  ({ id, title: `${id} broken`, reads: ['t (3 rows)'], verdict: 'FAIL', reason: null, expected: false, findings: vs })

/** The Metricool gap: UNCHECKED and KNOWN. This is the one that must never alarm. */
const uncheckedExpected = (id: string): Invariant => ({
  id, title: `${id} needs a credential`, reads: ['t (3 rows)'], verdict: 'UNCHECKED',
  reason: 'no Metricool credential is loaded', expected: true, findings: [],
})

/** A check that normally runs and did not. This one MUST alarm. */
const uncheckedUnexpected = (id: string): Invariant => ({
  id, title: `${id} did not run`, reads: ['t (UNREAD)'], verdict: 'UNCHECKED',
  reason: 'database not read: connection reset', expected: false, findings: [],
})

/** Score a fixture the way the doctor would. Never hand-type an exit code. */
function runOf(invariants: Invariant[]): DoctorRun {
  const now = new Date('2026-08-01T02:00:00Z')
  return {
    ran_at: now.toISOString(),
    now,
    invariants,
    exit_code: exitCodeFor(invariants),
    summary: summaryOf(invariants),
  }
}

/** The live board today: everything holds except the documented Metricool gap. Exit 3, no alarm. */
const GREEN = () => runOf([pass('I1'), pass('I2'), uncheckedExpected('I3'), pass('I4')])
/** A real failure. Exit 2. */
const RED = () => runOf([
  pass('I1'),
  fail('I5', violation('handbrake-half-on', 'scheduled with an unapproved Ewa task')),
  uncheckedExpected('I3'),
])
/** Exit 3, but the gap is new. Must alarm despite never reaching exit 2. */
const SILENT_GAP = () => runOf([pass('I1'), uncheckedExpected('I3'), uncheckedUnexpected('I7')])

const task = (o: Partial<CuTask> = {}): CuTask =>
  ({ id: 'cu1', name: `${MARKER} nightly cross-store invariants are not green`, statusName: 'to do', description: '', ...o })

/**
 * A fake ClickUp. Records every call, so "no task was created" is asserted against what the port
 * was ASKED to do rather than inferred from a return value.
 */
function fakePort(tasks: CuTask[] = [], opts: { failList?: string; failWrite?: string } = {}) {
  const calls = {
    list: [] as string[],
    created: [] as Array<{ listId: string; name: string; markdown: string }>,
    comments: [] as Array<{ taskId: string; text: string }>,
  }
  const port: ClickUpPort = {
    async listTasks(listId) {
      calls.list.push(listId)
      if (opts.failList) throw new Error(opts.failList)
      return tasks
    },
    async createTask(args) {
      if (opts.failWrite) throw new Error(opts.failWrite)
      calls.created.push(args)
      return task({ id: 'created-1', name: args.name })
    },
    async comment(taskId, text) {
      if (opts.failWrite) throw new Error(opts.failWrite)
      calls.comments.push({ taskId, text })
    },
  }
  return { port, calls }
}

const noWrites = (c: ReturnType<typeof fakePort>['calls'], why: string) => {
  assert(c.created.length === 0, `${why}: ${c.created.length} task(s) were created`)
  assert(c.comments.length === 0, `${why}: ${c.comments.length} comment(s) were posted`)
}

console.log('\ncontent-doctor-cron\n')

// ═══════════════════════════════════ the alarm rule, the whole point of the job

console.log('  — the alarm rule —')

check('exit 2 alarms', () => {
  const r = RED()
  assert(r.exit_code === 2, `the fixture must score exit 2, got ${r.exit_code}`)
  assert(shouldAlarm(r), 'a FAILing invariant is the alarm')
})

check('THE ONE THAT MATTERS: exit 3 with zero unexpected gaps does NOT alarm', () => {
  const r = GREEN()
  assert(r.exit_code === 3, `the expected baseline is exit 3, got ${r.exit_code}`)
  assert(r.summary.unchecked_unexpected === 0, 'the Metricool gap is expected, so it is not unexpected')
  assert(!shouldAlarm(r), 'alarming on the documented baseline every night is how a check becomes unread')
  assert(/EXPECTED BASELINE/.test(alarmReason(r)), `the reason must say why it stayed quiet: ${alarmReason(r)}`)
})

check('exit 3 with an UNEXPECTED gap DOES alarm, even though it never reaches exit 2', () => {
  const r = SILENT_GAP()
  assert(r.exit_code === 3, `still exit 3, got ${r.exit_code}`)
  assert(r.summary.unchecked_unexpected === 1, `one unexpected gap, got ${r.summary.unchecked_unexpected}`)
  assert(shouldAlarm(r), 'a check that normally runs and did not is an alarm, not a baseline')
  assert(/UNEXPECTED/.test(alarmReason(r)), `the reason must name it: ${alarmReason(r)}`)
})

check('exit 0 does not alarm', () => {
  const r = runOf([pass('I1'), pass('I2')])
  assert(r.exit_code === 0 && !shouldAlarm(r), 'a fully green board is silent')
})

check('the alarm rule reads the DOCTOR\'S summary, so adding an expected gap cannot start an alarm', () => {
  // Four known gaps instead of one. Still exit 3, still zero unexpected, still quiet.
  const r = runOf([pass('I1'), uncheckedExpected('I3'), uncheckedExpected('I9'), uncheckedExpected('I10')])
  assert(r.summary.unchecked === 3 && r.summary.unchecked_unexpected === 0, 'expected gaps stay expected')
  assert(!shouldAlarm(r), 'the count of KNOWN gaps is not the alarm; the count of unknown ones is')
})

check('alarmingInvariants carries the failures and the unexpected gaps, and nothing else', () => {
  const r = runOf([pass('I1'), fail('I5', violation('x', 'y')), uncheckedExpected('I3'), uncheckedUnexpected('I7')])
  const ids = alarmingInvariants(r.invariants).map((i) => i.id).sort()
  assert(ids.join(',') === 'I5,I7', `expected I5 and I7 only, got ${ids.join(',')}`)
})

// ═══════════════════════════════════════════════════ the four delivery cases

console.log('\n  — the four cases —')

checkAsync('CASE 1 green + no existing task: no task created, no comment posted', async () => {
  const { port, calls } = fakePort([])
  const r = await runCron(GREEN(), port)
  assert(r.action.kind === 'none', `expected no action, got ${r.action.kind}`)
  noWrites(calls, 'a healthy night must write nothing')
  assert(r.run.exit_code === 3, 'and the doctor exit code is untouched')
})

checkAsync('CASE 2 green + existing open task: comment only, and NEVER auto-closed', async () => {
  const { port, calls } = fakePort([task({ id: 'cu-open' })])
  const r = await runCron(GREEN(), port)
  assert(r.action.kind === 'comment' && r.action.reason === 'clear', `expected a clear comment, got ${r.action.kind}`)
  assert(calls.created.length === 0, 'a green board must not create anything')
  assert(calls.comments.length === 1 && calls.comments[0].taskId === 'cu-open', 'exactly one comment, on the open task')
  assert(/clear/i.test(calls.comments[0].text), 'the comment must say the board is clear')
  assert(/Left OPEN on purpose/.test(calls.comments[0].text), 'and must say it is deliberately still open')
  // There is no close/status call ANYWHERE on the port: the capability does not exist by design.
  assert(!('closeTask' in port) && !('setStatus' in port),
    'the port must expose no way to close a task: a task that closes itself looks the same as nobody looking')
})

checkAsync('CASE 3 alarm + no existing task: created ONCE, carrying the failing invariants', async () => {
  const { port, calls } = fakePort([])
  const r = await runCron(RED(), port)
  assert(r.action.kind === 'create', `expected a create, got ${r.action.kind}`)
  assert(calls.created.length === 1, `exactly one task, got ${calls.created.length}`)
  assert(calls.comments.length === 0, 'a new task carries its findings in the body, not in a comment')
  const t = calls.created[0]
  assert(t.listId === SPRINT_LIST_ID, `must land on Sprint — Pre-launch, got ${t.listId}`)
  assert(t.name.includes(MARKER), 'the name must carry the dedup marker or tomorrow opens a second task')
  assert(/I5/.test(t.markdown) && /handbrake-half-on/.test(t.markdown), 'the body must name the failing invariant and its violation')
  assert(!/I1/.test(t.markdown), 'the body carries the FAILING invariants, not the whole report')
  assert(r.taskId === 'created-1', 'the created id is reported back')
})

checkAsync('CASE 4 alarm + existing open task: comment only, NEVER a second task', async () => {
  const { port, calls } = fakePort([task({ id: 'cu-open' })])
  const r = await runCron(RED(), port)
  assert(r.action.kind === 'comment' && r.action.reason === 'alarm', `expected an alarm comment, got ${r.action.kind}`)
  assert(calls.created.length === 0, 'THE ACCUMULATION BUG: a nightly job must never open a task per night')
  assert(calls.comments.length === 1 && calls.comments[0].taskId === 'cu-open', 'one comment, on the existing task')
  assert(/I5/.test(calls.comments[0].text), 'tonight\'s findings must be in the comment')
})

checkAsync('thirty consecutive red nights produce ONE task and twenty-nine comments', async () => {
  // The dedup claim stated as the behaviour a human would actually observe after a month.
  const tasks: CuTask[] = []
  const { port, calls } = fakePort(tasks)
  for (let night = 0; night < 30; night++) {
    const before = calls.created.length
    await runCron(RED(), port)
    // Whatever was created becomes the open task the next night sees.
    if (calls.created.length > before) tasks.push(task({ id: 'created-1', name: calls.created[0].name }))
  }
  assert(calls.created.length === 1, `expected 1 task after 30 red nights, got ${calls.created.length}`)
  assert(calls.comments.length === 29, `expected 29 comments, got ${calls.comments.length}`)
})

// ═══════════════════════════════════════════════════════ the dedup mechanism

console.log('\n  — dedup —')

check('the marker is matched as a substring, so renaming around it still dedups', () => {
  const found = findOpenDoctorTask([task({ id: 'x', name: `URGENT ${MARKER} board red — Keith looking` })])
  assert(found?.id === 'x', 'a human editing the title must not cause a duplicate task tomorrow')
})

check('an unrelated open task is not mistaken for the doctor\'s', () => {
  assert(findOpenDoctorTask([task({ id: 'y', name: 'Ship the vitamin D hub' })]) === null, 'no marker, no match')
})

check('a CLOSED or DONE task is not open, so the next alarm is entitled to a fresh one', () => {
  for (const s of SETTLED_STATUSES) {
    assert(findOpenDoctorTask([task({ statusName: s })]) === null, `"${s}" means a human dealt with it`)
  }
  assert(findOpenDoctorTask([task({ statusName: 'IN PROGRESS' })])?.id === 'cu1', 'in progress is still open')
})

check('the first open marker task wins when several exist', () => {
  const found = findOpenDoctorTask([
    task({ id: 'settled', statusName: 'complete' }),
    task({ id: 'open-1' }),
    task({ id: 'open-2' }),
  ])
  assert(found?.id === 'open-1', `must pick the open one, got ${found?.id}`)
})

check('decide() is exhaustive over the four cases and never invents a fifth', () => {
  const t = task()
  assert(decide(RED(), null).kind === 'create', 'alarm + none -> create')
  assert(decide(RED(), t).kind === 'comment', 'alarm + open -> comment')
  assert(decide(GREEN(), t).kind === 'comment', 'green + open -> comment')
  assert(decide(GREEN(), null).kind === 'none', 'green + none -> nothing')
  assert(TASK_NAME.includes(MARKER), 'the default task name must carry the marker')
})

// ══════════════════════════════════════════════ ClickUp down: loud, not silent

console.log('\n  — ClickUp unreachable —')

checkAsync('THE DEDUP LOOKUP FAILS: nothing is written blind, and the doctor exit code survives', async () => {
  const { port, calls } = fakePort([], { failList: 'ClickUp GET /list/901217968514/task -> 503' })
  const r = await runCron(RED(), port)
  assert(r.deliveryError !== null, 'a failed lookup must be reported, not swallowed')
  assert(/503/.test(r.deliveryError!), `the error must name the cause: ${r.deliveryError}`)
  assert(r.delivered === false, 'and must not claim delivery')
  noWrites(calls, 'we cannot know whether a task exists, so creating one is how a task-per-night starts')
  assert(r.run.exit_code === 2, 'THE EXIT CODE IS THE DOCTORS: a ClickUp outage does not change the board')
})

checkAsync('THE WRITE FAILS: still loud, still the doctor\'s exit code, never a throw', async () => {
  const { port } = fakePort([], { failWrite: 'ClickUp POST /list/.../task -> 401 token expired' })
  const r = await runCron(RED(), port)
  assert(r.deliveryError !== null && /401/.test(r.deliveryError!), `the write failure must surface: ${r.deliveryError}`)
  assert(r.delivered === false, 'an undelivered alarm must never read as delivered')
  assert(r.action.kind === 'create', 'and the intended action is retained so the log can state what was lost')
  assert(r.run.exit_code === 2, 'the exit code still describes the board, not ClickUp')
})

checkAsync('a comment failure on an existing task is equally loud', async () => {
  const { port } = fakePort([task({ id: 'cu-open' })], { failWrite: 'ClickUp POST comment -> 500' })
  const r = await runCron(RED(), port)
  assert(r.deliveryError !== null && r.delivered === false, 'the comment path must report failure too')
  assert(r.taskId === 'cu-open', 'and still name the task that was not updated')
})

check('the failure render names the undelivered alarm in words', () => {
  const r: CronResult = {
    run: RED(), action: { kind: 'create', name: TASK_NAME, markdown: 'x', why: 'exit 2' },
    delivered: false, deliveryError: 'ClickUp 503', taskId: null,
  }
  const out = renderResult(r)
  assert(/alarm: YES/.test(out), 'the log line must state that it alarmed')
  assert(/CREATE/.test(out), 'and what it meant to do')
})

checkAsync('--dry-run decides everything and delivers nothing', async () => {
  const { port, calls } = fakePort([])
  const r = await runCron(RED(), port, { dryRun: true })
  assert(r.action.kind === 'create', 'the decision is still made in full')
  assert(r.delivered === false, 'but nothing was sent')
  noWrites(calls, 'a dry run must not touch ClickUp')
  assert(calls.list.length === 1, 'it still READS the list, because the decision depends on it')
})

// ════════════════════════════════════════════════════════════ what gets written

console.log('\n  — task and comment bodies —')

check('the task body carries violations and their fixes, marked NOT applied', () => {
  const body = alarmBody(RED())
  assert(/NOT applied/.test(body), 'the doctor detects only, and the task must say so')
  assert(/scheduled with an unapproved Ewa task/.test(body), 'the violation message must survive into the body')
  assert(/never as a second task/.test(body), 'the task must explain its own dedup contract to whoever reads it')
})

check('an UNEXPECTED gap reaches the body with its reason, not just a verdict', () => {
  const body = alarmBody(SILENT_GAP())
  assert(/I7/.test(body), 'the unmeasured invariant must be named')
  assert(/connection reset/.test(body), 'and why it could not be measured')
})

check('the clear comment never contains a close instruction or a status change', () => {
  const c = clearComment(GREEN())
  assert(/clear/i.test(c) && /Left OPEN/.test(c), 'it reports clear and states it stays open')
  assert(!/closing|auto-clos|resolved as/i.test(c), 'nothing in it may read as the job closing the task')
})

check('the alarm comment is dated so a month of comments is a timeline', () => {
  assert(alarmComment(RED()).includes('2026-08-01T02:00:00.000Z'), 'each comment must carry its run timestamp')
})

void Promise.all(pending).then(() => {
  console.log(
    failures === 0
      ? '\n🟢 content-doctor-cron: all clean. One task, many comments, and silence on a healthy night.\n'
      : `\n🔴 content-doctor-cron: ${failures} failure(s).\n`,
  )
  process.exit(failures === 0 ? 0 : 1)
})
