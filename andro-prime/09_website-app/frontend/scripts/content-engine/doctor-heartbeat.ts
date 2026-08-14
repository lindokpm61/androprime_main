/**
 * doctor-heartbeat — alarms when the nightly doctor STOPS RUNNING.
 *
 * WHY THIS EXISTS, and why it is a separate process rather than a check inside the doctor.
 *
 * `content-doctor` was registered on 2026-08-01 and did not execute once for four nights. Its
 * alarm design is careful and correct — it fires only on exit 2 or an unexpected gap, precisely
 * so a reader does not learn to ignore it — and it has exactly one uncovered state: every alarm
 * route runs INSIDE the doctor, so a doctor that never starts emits nothing at all. Silence was
 * defined as the healthy signal, which makes "ran and found nothing" and "did not run" produce
 * byte-identical output.
 *
 * That failure was invisible for four days and surfaced only because a human noticed missing
 * posts downstream and asked. The system had already diagnosed this exact shape once, in its own
 * docs ("a check that never fires is indistinguishable from a check that passes"), and then
 * reproduced it one layer up in the mechanism meant to fix it.
 *
 * SO THIS ALARMS ON ABSENCE, NOT ON CONTENT. It knows nothing about invariants and never reads
 * one. It asks a single question: did the doctor leave a trace recently enough? It must never
 * import the doctor's diagnosis, call it, or run it — a monitor that starts the thing it monitors
 * cannot report that thing's death.
 *
 * TWO INDEPENDENT SIGNALS, and the freshest wins:
 *   1. `agent_runs` — written by the doctor's `--log` path. Survives the machine being rebuilt.
 *   2. the cron log's modification time — written by the shell redirect. Survives the database
 *      being unreachable, and catches a doctor that ran but failed before it could log.
 * Either alone has a blind spot the other covers, and a run that produced neither did not happen.
 *
 * HONEST LIMIT, stated rather than papered over: this runs on the same machine and the same
 * scheduler as the thing it watches, so a total Task Scheduler failure takes both. It closes the
 * observed failure (a malformed action string on one task) and narrows the rest. The only
 * complete answer is an off-machine check, which does not exist yet. Read `AGE` in the output.
 */
import fs from 'fs'
import path from 'path'
import os from 'os'
import { loadEnvLocal, admin, logRun } from './_shared'
import {
  SPRINT_LIST_ID, type ClickUpPort, liveClickUp,
} from './content-doctor-cron'
import type { CuTask } from './clickup'

export const AGENT = 'doctor-heartbeat'
export const MARKER = '[doctor-heartbeat]'
export const TASK_NAME = `${MARKER} the nightly content-doctor has stopped running`

/** Daily cadence at 02:30 plus a two-hour grace. Past this, a night was missed. */
export const MAX_AGE_HOURS = 26

export const LOG_PATH = path.join(
  process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
  'andro-prime', 'content-doctor.log',
)

// ── The pure core.

export type Verdict =
  | { state: 'alive'; ageHours: number; source: string; last: string }
  | { state: 'stale'; ageHours: number; source: string; last: string }
  | { state: 'never-run' }
  | { state: 'unknown'; why: string }

export interface Signals {
  /** Newest `agent_runs.started_at` for the doctor, or null if none. */
  dbLast: string | null
  /** Cron log mtime as ISO, or null if the file is absent. */
  logLast: string | null
  /** Set when a signal could not be read at all, which is NOT the same as "no run". */
  unreadable?: string
}

/**
 * Decide from the two signals. `unknown` is a distinct outcome and never collapses into
 * `alive` or `stale`: a heartbeat that could not be taken has not passed and has not failed,
 * and reporting either would be a lie in one direction or a false alarm in the other. Same
 * three-way rule the doctor uses (PASS / FAIL / UNCHECKED).
 */
export function judge(s: Signals, now: Date = new Date(), maxAgeHours = MAX_AGE_HOURS): Verdict {
  if (s.unreadable && !s.dbLast && !s.logLast) return { state: 'unknown', why: s.unreadable }
  const candidates: { iso: string; source: string }[] = []
  if (s.dbLast) candidates.push({ iso: s.dbLast, source: 'agent_runs' })
  if (s.logLast) candidates.push({ iso: s.logLast, source: 'cron log' })
  if (!candidates.length) return { state: 'never-run' }

  // The freshest signal wins. A doctor that logged to one store and not the other still ran.
  let best = candidates[0]
  let bestMs = new Date(best.iso).getTime()
  for (const c of candidates.slice(1)) {
    const ms = new Date(c.iso).getTime()
    if (!Number.isNaN(ms) && (Number.isNaN(bestMs) || ms > bestMs)) { best = c; bestMs = ms }
  }
  if (Number.isNaN(bestMs)) return { state: 'unknown', why: `unreadable timestamp: ${best.iso}` }

  const ageHours = (now.getTime() - bestMs) / 36e5
  const shape = { ageHours: Math.round(ageHours * 10) / 10, source: best.source, last: best.iso }
  return ageHours > maxAgeHours ? { state: 'stale', ...shape } : { state: 'alive', ...shape }
}

export function shouldAlarm(v: Verdict): boolean {
  return v.state === 'stale' || v.state === 'never-run'
}

export function exitCodeFor(v: Verdict): 0 | 1 | 2 {
  if (v.state === 'alive') return 0
  if (v.state === 'unknown') return 1
  return 2
}

export function describe(v: Verdict, maxAgeHours = MAX_AGE_HOURS): string {
  switch (v.state) {
    case 'alive': return `ALIVE — the doctor last ran ${v.ageHours}h ago (${v.source}: ${v.last}), inside the ${maxAgeHours}h window.`
    case 'stale': return `STALE — the doctor has not run for ${v.ageHours}h (${v.source}: ${v.last}), past the ${maxAgeHours}h window. IT IS NOT WATCHING THE BOARD.`
    case 'never-run': return 'NEVER RUN — no agent_runs row and no cron log. The cadence has never executed, whatever the task definition says.'
    case 'unknown': return `UNKNOWN — the heartbeat could not be taken: ${v.why}. This is not a pass.`
  }
}

/** Body of the ClickUp task. Names the fix, because the fix is not obvious and has been hit once. */
export function alarmBody(v: Verdict): string {
  return [
    describe(v),
    '',
    'The nightly cross-store invariant check is not running, so the board is unwatched:',
    'nothing is currently detecting drift between the repo, the database, Metricool and ClickUp.',
    '',
    'FIRST THING TO CHECK, because it has happened before and is silent by nature:',
    'the Task Scheduler action string. `cmd.exe /c "<script>" >> "<log>" 2>&1` begins with a',
    'quote after /c, so cmd strips the outermost quote pair, mangles the command, and fails',
    'BEFORE the redirect exists — no log line, no error, no output at all. Use the `call` form:',
    '  cmd.exe /c call "<script>" >> "<log>" 2>&1',
    '',
    'Do NOT verify the fix by reading the task XML on disk or by running the wrapper from a',
    'shell. Both stay green over a job that never starts. Register a one-off trigger a couple of',
    'minutes out, let it fire unattended, then confirm a NEW row appears in agent_runs.',
    '',
    'Full write-up: andro-prime/12_operations/automation/scheduled-agents.md',
  ].join('\n')
}

/**
 * The open heartbeat task, or null.
 *
 * Reads `statusName`, which is what `CuTask` actually carries. It previously read
 * `t.status?.status`, the RAW ClickUp shape, on a type that has no `status` property at all —
 * one of the two errors that were failing `npm run typecheck:scripts`, and NOT only a typing
 * problem. The expression evaluated to `undefined` on every task, so `settled` never matched and
 * this function returned the first marker-named task it found **whether or not it was closed**.
 * The consequence is specific: when the doctor next goes silent, the heartbeat would have
 * commented on a long-resolved task instead of opening a new one, and the alarm would have
 * landed somewhere nobody is looking. It has never fired in anger, so the defect was latent.
 */
export function findOpenTask(tasks: CuTask[]): CuTask | null {
  const settled = new Set(['complete', 'closed', 'done'])
  return tasks.find((t) => t.name?.startsWith(MARKER) && !settled.has((t.statusName ?? '').toLowerCase())) ?? null
}

export type Action =
  | { kind: 'none'; why: string }
  | { kind: 'create'; name: string; text: string; why: string }
  | { kind: 'comment'; taskId: string; text: string; why: string }

/**
 * Same de-duplication discipline as the doctor's own cron: one open task, commented thereafter,
 * and NEVER auto-closed on recovery. A task that closes itself is indistinguishable from nobody
 * having looked, and this particular alarm means nobody was looking.
 */
export function decide(v: Verdict, existing: CuTask | null): Action {
  if (!shouldAlarm(v)) {
    if (existing) {
      return {
        kind: 'comment', taskId: existing.id,
        text: `Recovered: ${describe(v)}\nLeaving this task open for a human to close, deliberately.`,
        why: `heartbeat is healthy and ${existing.id} is still open: commenting, not closing`,
      }
    }
    return { kind: 'none', why: describe(v) }
  }
  if (existing) {
    return { kind: 'comment', taskId: existing.id, text: alarmBody(v), why: `${describe(v)} — task ${existing.id} already open, so this is a comment` }
  }
  return { kind: 'create', name: TASK_NAME, text: alarmBody(v), why: describe(v) }
}

// ── I/O

export async function readSignals(): Promise<Signals> {
  let dbLast: string | null = null
  let unreadable: string | undefined
  try {
    const { data, error } = await admin()
      .from('agent_runs').select('started_at').eq('agent', 'content-doctor')
      .order('started_at', { ascending: false }).limit(1)
    if (error) unreadable = `agent_runs read failed: ${error.message}`
    else dbLast = data?.[0]?.started_at ?? null
  } catch (e) {
    unreadable = `agent_runs read failed: ${(e as Error).message}`
  }
  let logLast: string | null = null
  try {
    if (fs.existsSync(LOG_PATH)) logLast = fs.statSync(LOG_PATH).mtime.toISOString()
  } catch { /* absent log is a signal, not an error */ }
  return { dbLast, logLast, unreadable }
}

export async function runHeartbeat(args: {
  verdict: Verdict
  port: ClickUpPort
  listId?: string
  dryRun: boolean
}): Promise<{ action: Action; deliveryError?: string }> {
  let existing: CuTask | null = null
  let deliveryError: string | undefined
  const listId = args.listId ?? SPRINT_LIST_ID
  try {
    existing = findOpenTask(await args.port.listTasks(listId))
  } catch (e) {
    deliveryError = `could not list ClickUp tasks: ${(e as Error).message}`
  }
  const action = decide(args.verdict, existing)
  if (args.dryRun || action.kind === 'none' || deliveryError) return { action, deliveryError }
  try {
    // `createTask` takes ONE object, not three positional arguments. The three-argument call was
    // the second typecheck error, and it was the same species of defect as the one above: at
    // runtime `listId` would have arrived as the whole args object, leaving `args.listId`
    // undefined, so the escalation this job exists to deliver would have failed at the moment it
    // was finally needed. Latent for the same reason: the heartbeat has never had to alarm.
    if (action.kind === 'create') await args.port.createTask({ listId, name: action.name, markdown: action.text })
    else await args.port.comment(action.taskId, action.text)
  } catch (e) {
    deliveryError = `could not deliver to ClickUp: ${(e as Error).message}`
  }
  return { action, deliveryError }
}

export async function main(): Promise<number> {
  loadEnvLocal()
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const startedAt = new Date().toISOString()

  const signals = await readSignals()
  const verdict = judge(signals)

  console.log(`doctor-heartbeat${dryRun ? ' (DRY RUN — nothing was sent)' : ''}`)
  console.log('─'.repeat(72))
  console.log(`  ${describe(verdict)}`)
  console.log(`  signals: agent_runs=${signals.dbLast ?? 'none'}  log=${signals.logLast ?? 'none'}`)

  const { action, deliveryError } = await runHeartbeat({ verdict, port: liveClickUp, dryRun })
  console.log(`  action: ${action.kind.toUpperCase()} — ${action.why}`)

  if (deliveryError) {
    console.error('')
    console.error('!'.repeat(72))
    console.error('!! HEARTBEAT ALARM NOT DELIVERED.')
    console.error(`!! ${deliveryError}`)
    if (shouldAlarm(verdict)) console.error('!! THE DOCTOR IS DOWN AND NOBODY HAS BEEN TOLD.')
    console.error('!'.repeat(72))
  }

  const code = exitCodeFor(verdict)
  if (doLog && !dryRun) {
    await logRun({
      agent: AGENT,
      status: code === 0 ? 'ok' : code === 2 ? 'error' : 'blocked',
      detail: { exit_code: code, verdict, signals, action: action.kind },
      startedAt,
    })
  }
  return code
}

/** Exact basename. `test-doctor-heartbeat.ts` ends with `doctor-heartbeat.ts`. */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'doctor-heartbeat.ts' || base === 'doctor-heartbeat.js'
}

if (isDirectInvocation(process.argv[1])) {
  main().then((code) => process.exit(code)).catch((e) => {
    console.error('DOCTOR-HEARTBEAT ERROR:', (e as Error).message)
    process.exit(1)
  })
}
