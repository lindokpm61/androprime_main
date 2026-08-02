/**
 * content-doctor-cron — the unattended face of `content-doctor.ts`.
 *
 * Runs the doctor once, decides whether tonight is worth a human's attention, and if it is,
 * routes it to the ONE place that owns open items: a ClickUp task. Nothing else.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * IT OWNS NO VERDICT LOGIC, DELIBERATELY.
 *
 * This file does not contain a single invariant, threshold or verdict rule. It calls
 * `diagnose()` and reads `run.exit_code` and `run.summary`, both computed inside the doctor by
 * `exitCodeFor()` and `summaryOf()`. Two definitions of "is the board green" is precisely the
 * cross-store drift the doctor exists to detect, and a monitor that recomputed the verdict would
 * be that same defect wearing a monitoring badge. If a rule needs changing, it changes in
 * `content-doctor.ts` and this file inherits it silently.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * THE ALARM RULE:  exit_code === 2  OR  summary.unchecked_unexpected > 0
 *
 * Note what is NOT an alarm: exit 3 with `unchecked_unexpected: 0`, a gap the doctor itself
 * marks as documented. A nightly job that fires every night trains its reader to ignore it,
 * and the reader is then not reading when it fires for a real reason.
 *
 * CHANGED 2026-08-01: the baseline is now exit 0, not exit 3. Invariant 3 was the one gap and
 * it now has its Metricool credential. The alarm rule is unchanged and deliberately so: it keys
 * on whether a gap is EXPECTED, never on which invariant produced it, so closing one gap needed
 * no edit here. A quiet exit 3 is still possible (a documented gap can reappear) but it is no
 * longer routine, and it is worth reading rather than skimming.
 *
 * That failure is on the record in this repo, not borrowed from a textbook:
 * `12_operations/sops/content-machine-verification.md` carried a verification check that was
 * never run once in its entire life. This job is its automated successor and must not die the
 * same death. Alarm on 2, alarm on an UNEXPECTED gap, and stay quiet on the known one.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * NO PARALLEL STATUS STORE (`12_operations/automation/scheduled-agents.md`).
 *
 * This writes NO findings file, NO JSON dump, NO status file and NO local backlog. ClickUp owns
 * the open-item list; `agent_runs` (via `--log`) owns run telemetry. A rolling stdout/stderr log
 * is the shell's job and is done by redirection in the `.cmd` wrapper, not here.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * Run from frontend/:
 *   npx tsx scripts/content-engine/content-doctor-cron.ts --log
 *   npx tsx scripts/content-engine/content-doctor-cron.ts --dry-run   # decide, deliver nothing
 *
 * Exit codes: the DOCTOR'S OWN, propagated unchanged, so Task Scheduler's "last result" column
 * means what the doctor means. 0 clean / 2 violations / 3 incomplete / 1 the run itself failed.
 * A ClickUp outage does NOT change the exit code: it is loud on stderr and still reports the
 * board. Losing the delivery must not also lose the diagnosis.
 */
import {
  diagnose, logDoctorRun, repoLayoutProblems, REPO_ROOT,
  runOutcomeFor, type DoctorRun, type Invariant,
} from './content-doctor'
import { loadEnvLocal } from './_shared'
import { getListTasks, createTaskInList, addComment, type CuTask } from './clickup'

/** "Sprint — Pre-launch", workspace 90121729875. */
export const SPRINT_LIST_ID = '901217968514'
export const WORKSPACE_ID = '90121729875'

/**
 * The dedup marker. A nightly job that creates a task per night buries the one night that
 * mattered under three hundred that did not, so the marker is the whole mechanism: it goes in
 * the task NAME (searchable, visible to a human scanning the list) and it is matched as a plain
 * substring, not a regex, so it cannot be broken by someone renaming the task around it.
 */
export const MARKER = '[content-doctor]'
export const TASK_NAME = `${MARKER} nightly cross-store invariants are not green`

/**
 * ClickUp statuses that mean "a human has dealt with this". A task in one of these is NOT open,
 * so the next alarm is entitled to a fresh task.
 *
 * `getListTasks` already excludes CLOSED tasks (the v2 list endpoint omits them unless
 * `include_closed=true`), so in practice this only catches a DONE-type status, which ClickUp
 * does still return. Both filters are kept: relying on an upstream default alone is how a dedup
 * check quietly becomes a no-op.
 */
export const SETTLED_STATUSES = new Set(['complete', 'closed', 'done'])

// ═══════════════════════════════════════════════════════════ the decision (pure)

/**
 * THE ALARM RULE, and the only place it is written.
 *
 * Reads the doctor's own scored output. `unchecked_unexpected` is computed by `summaryOf()`
 * from each invariant's `expected` flag, so "which gap is the known one" stays a property of the
 * invariant that has the gap, not a list of exceptions maintained over here.
 */
export function shouldAlarm(run: Pick<DoctorRun, 'exit_code' | 'summary'>): boolean {
  return run.exit_code === 2 || run.summary.unchecked_unexpected > 0
}

/** Why we did or did not alarm, in words, so the log explains itself without the reader knowing the rule. */
export function alarmReason(run: Pick<DoctorRun, 'exit_code' | 'summary'>): string {
  const bits: string[] = []
  if (run.exit_code === 2) bits.push(`exit 2: ${run.summary.fail} invariant(s) FAIL, ${run.summary.violations} violation(s)`)
  if (run.summary.unchecked_unexpected > 0) {
    bits.push(`${run.summary.unchecked_unexpected} UNEXPECTED UNCHECKED invariant(s): a check that normally runs did not`)
  }
  if (bits.length) return bits.join('; ')
  if (run.exit_code === 3) {
    return `exit 3 with 0 unexpected gaps — ${run.summary.unchecked} documented gap(s), so not an alarm by design. The baseline is exit 0, so this is worth reading.`
  }
  return 'exit 0: every invariant holds'
}

/** The invariants a human actually has to look at: failed, or unmeasured when they should not be. */
export function alarmingInvariants(invs: Invariant[]): Invariant[] {
  return invs.filter((i) => i.verdict === 'FAIL' || (i.verdict === 'UNCHECKED' && !i.expected))
}

/** An open `[content-doctor]` task, or null. Substring match on the name; settled tasks excluded. */
export function findOpenDoctorTask(tasks: CuTask[]): CuTask | null {
  return tasks.find((t) =>
    t.name.includes(MARKER) && !SETTLED_STATUSES.has((t.statusName || '').toLowerCase())) ?? null
}

/** The failing invariants and their violations. NOT the whole report: the report is on stdout. */
export function alarmBody(run: DoctorRun): string {
  const L: string[] = []
  L.push(`**${alarmReason(run)}**`)
  L.push('')
  L.push(`Run: \`content-doctor-cron\` at ${run.ran_at} — exit ${run.exit_code} (${runOutcomeFor(run.exit_code)}).`)
  L.push('')
  L.push('The doctor DETECTS ONLY. Nothing below was fixed, and nothing will fix itself.')
  L.push('')

  for (const i of alarmingInvariants(run.invariants)) {
    L.push(`### ${i.verdict} — ${i.id}: ${i.title}`)
    if (i.reason) L.push(`- **not measured:** ${i.reason}`)
    for (const f of i.findings.filter((x) => x.kind === 'violation')) {
      L.push(`- **${f.ref}** — ${f.message}`)
      if (f.fix) L.push(`  - fix (NOT applied): ${f.fix}`)
    }
    L.push('')
  }

  L.push('---')
  L.push(`Reopened nightly by Task Scheduler. New findings arrive as COMMENTS on this task, never as a second task. Close it when it is dealt with: this job will not close it for you, because a task that closes itself is indistinguishable from nobody looking.`)
  return L.join('\n')
}

/** Tonight's findings, as a comment on the task that already exists. */
export function alarmComment(run: DoctorRun): string {
  const L: string[] = [`🔴 ${run.ran_at} — still not green. ${alarmReason(run)}`, '']
  for (const i of alarmingInvariants(run.invariants)) {
    const vs = i.findings.filter((x) => x.kind === 'violation')
    L.push(`${i.verdict} ${i.id} (${i.title}) — ${vs.length} violation(s)`)
    if (i.reason) L.push(`    not measured: ${i.reason}`)
    for (const f of vs) L.push(`    · ${f.ref}: ${f.message}`)
  }
  return L.join('\n')
}

/**
 * The board came back green while a task is still open. Say so, and LEAVE IT OPEN.
 * Auto-closing would mean the only record of the fix is a task nobody read closing itself.
 */
export function clearComment(run: DoctorRun): string {
  return [
    `🟢 ${run.ran_at} — clear. ${alarmReason(run)}`,
    '',
    `exit ${run.exit_code} (${runOutcomeFor(run.exit_code)}); ` +
    `PASS ${run.summary.pass}, FAIL ${run.summary.fail}, UNCHECKED ${run.summary.unchecked} ` +
    `(${run.summary.unchecked_unexpected} unexpected).`,
    '',
    'Left OPEN on purpose. The doctor detects; a human decides it is finished and closes it.',
  ].join('\n')
}

export type CronAction =
  | { kind: 'none'; why: string }
  | { kind: 'create'; name: string; markdown: string; why: string }
  | { kind: 'comment'; taskId: string; taskName: string; text: string; why: string; reason: 'alarm' | 'clear' }

/**
 * The whole decision, as a value, with no IO in it. Four cases and they are exhaustive:
 *
 *   alarm + no open task   -> create ONE task
 *   alarm + open task      -> comment. Never a second task.
 *   green + open task      -> comment that it is clear. Never auto-closed.
 *   green + no open task   -> nothing at all. Silence is the correct output of a healthy night.
 */
export function decide(run: DoctorRun, existing: CuTask | null): CronAction {
  const alarming = shouldAlarm(run)
  if (alarming && !existing) {
    return { kind: 'create', name: TASK_NAME, markdown: alarmBody(run), why: alarmReason(run) }
  }
  if (alarming && existing) {
    return {
      kind: 'comment', taskId: existing.id, taskName: existing.name, text: alarmComment(run),
      reason: 'alarm',
      why: `${alarmReason(run)} — task ${existing.id} is already open, so tonight is a comment, not a second task`,
    }
  }
  if (!alarming && existing) {
    return {
      kind: 'comment', taskId: existing.id, taskName: existing.name, text: clearComment(run),
      reason: 'clear',
      why: `board is clear and ${existing.id} is still open: commenting, and leaving it open for a human to close`,
    }
  }
  return { kind: 'none', why: `${alarmReason(run)} — and no open ${MARKER} task to update. Nothing to do.` }
}

// ═══════════════════════════════════════════════════════════════ delivery (IO)

/** The narrow slice of ClickUp this job touches. Injected so the suite makes no live call. */
export interface ClickUpPort {
  listTasks(listId: string): Promise<CuTask[]>
  createTask(args: { listId: string; name: string; markdown: string }): Promise<CuTask>
  comment(taskId: string, text: string): Promise<void>
}

/** The real one, built from the existing helpers in `clickup.ts`. No new HTTP is written here. */
export const liveClickUp: ClickUpPort = {
  listTasks: (listId) => getListTasks(listId),
  createTask: (args) => createTaskInList(args),
  comment: (taskId, text) => addComment(taskId, text),
}

export interface CronResult {
  run: DoctorRun
  action: CronAction
  delivered: boolean
  /** Non-null when ClickUp could not be reached. NEVER changes the exit code. */
  deliveryError: string | null
  taskId: string | null
}

/**
 * Decide, then deliver. Every ClickUp failure is caught and reported, never rethrown: the exit
 * code belongs to the doctor's verdict about the board, not to ClickUp's availability. A
 * monitoring job that dies silently because its notifier was down is worse than no job at all,
 * so an undelivered alarm is printed as loudly as possible and the diagnosis still stands.
 */
export async function runCron(
  run: DoctorRun,
  port: ClickUpPort,
  opts: { dryRun?: boolean; listId?: string } = {},
): Promise<CronResult> {
  const listId = opts.listId ?? SPRINT_LIST_ID
  const base: CronResult = { run, action: { kind: 'none', why: '' }, delivered: false, deliveryError: null, taskId: null }

  let existing: CuTask | null = null
  try {
    existing = findOpenDoctorTask(await port.listTasks(listId))
  } catch (e) {
    // The dedup lookup failed, so we CANNOT know whether a task exists. Creating one anyway is
    // how a nightly job accumulates a task per night the moment ClickUp is flaky. Refuse to
    // write blind, and be loud about the alarm that is now undelivered.
    const err = `could not read ClickUp list ${listId}: ${(e as Error).message}`
    return { ...base, action: decide(run, null), deliveryError: err }
  }

  const action = decide(run, existing)
  if (action.kind === 'none') return { ...base, action, delivered: true, taskId: existing?.id ?? null }
  if (opts.dryRun) return { ...base, action, delivered: false, taskId: existing?.id ?? null }

  try {
    if (action.kind === 'create') {
      const t = await port.createTask({ listId, name: action.name, markdown: action.markdown })
      return { ...base, action, delivered: true, taskId: t.id }
    }
    await port.comment(action.taskId, action.text)
    return { ...base, action, delivered: true, taskId: action.taskId }
  } catch (e) {
    return { ...base, action, deliveryError: (e as Error).message, taskId: existing?.id ?? null }
  }
}

/** What happened, in the form a human reads out of a Task Scheduler log six weeks later. */
export function renderResult(r: CronResult, opts: { dryRun?: boolean } = {}): string {
  const L: string[] = []
  const s = r.run.summary
  L.push('─'.repeat(72))
  L.push(`content-doctor-cron  ${r.run.ran_at}`)
  L.push(`  doctor exit ${r.run.exit_code} (${runOutcomeFor(r.run.exit_code)}) — ` +
    `PASS ${s.pass}  FAIL ${s.fail}  UNCHECKED ${s.unchecked} (${s.unchecked_unexpected} unexpected)  ` +
    `violations ${s.violations}`)
  L.push(`  alarm: ${shouldAlarm(r.run) ? 'YES' : 'no'} — ${alarmReason(r.run)}`)
  L.push(`  action: ${r.action.kind.toUpperCase()}${opts.dryRun ? ' (DRY RUN — nothing was sent)' : ''}`)
  L.push(`    ${r.action.why}`)
  if (r.action.kind === 'comment') L.push(`    on: ${r.action.taskName} (${r.action.taskId})`)
  if (r.taskId && r.action.kind === 'create' && r.delivered) L.push(`    created: ${r.taskId}`)
  return L.join('\n')
}

// ═══════════════════════════════════════════════════════════════════════ main

const DRY_RUN = process.argv.includes('--dry-run')
const DO_LOG = process.argv.includes('--log')

async function main() {
  loadEnvLocal()

  // THE WORKING-DIRECTORY TRAP, closed before anything else runs. `.claude/skills/content-status/
  // scan.js` was found on 2026-08-01 exiting 0 after scanning zero assets, purely because it was
  // invoked from the wrong directory. Every repo path in the doctor resolves from cwd, so the
  // same `cd` would make this job report a clean board nightly and forever. Exit 1, loudly.
  const layout = repoLayoutProblems()
  if (layout.length) {
    console.error('CONTENT-DOCTOR-CRON CANNOT RUN FROM HERE — refusing to report a board it cannot see.')
    console.error(`  cwd:       ${process.cwd()}`)
    console.error(`  repo root: ${REPO_ROOT} (resolved ../../.. from cwd)`)
    for (const p of layout) console.error(`  ✗ ${p}`)
    console.error('  Invoke via content-doctor-cron.cmd, which pins the working directory.')
    process.exit(1)
  }

  const run = await diagnose()
  const result = await runCron(run, liveClickUp, { dryRun: DRY_RUN })

  console.log(renderResult(result, { dryRun: DRY_RUN }))

  if (result.deliveryError) {
    // Loud, on stderr, and it names what was lost. The exit code is still the doctor's.
    console.error('')
    console.error('!'.repeat(72))
    console.error('!! CLICKUP DELIVERY FAILED. THE ALARM WAS NOT DELIVERED.')
    console.error(`!! ${result.deliveryError}`)
    console.error(`!! intended action: ${result.action.kind} — ${result.action.why}`)
    if (shouldAlarm(run)) {
      console.error('!! THE BOARD IS NOT GREEN AND NOBODY HAS BEEN TOLD. Read the report above by hand.')
    }
    console.error('!'.repeat(72))
  }

  // Telemetry, and nothing more: one agent_runs row, written by the doctor's own logger so the
  // scheduled and manual paths cannot record different shapes. No findings file is written here.
  if (DO_LOG && !DRY_RUN) await logDoctorRun(run)

  process.exit(run.exit_code)
}

if (/(^|[\\/])content-doctor-cron\.(ts|js)$/.test(process.argv[1] ?? '')) {
  main().catch((e) => {
    console.error('CONTENT-DOCTOR-CRON ERROR:', (e as Error).message)
    process.exit(1)
  })
}
