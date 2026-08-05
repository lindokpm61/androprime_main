/**
 * Signoff-Sync — the Spine B counterpart to signoff-concierge.
 *
 * `signoff-concierge` submits ARTICLES to Ewa and `orchestrator.syncApprovals()` resolves them.
 * Neither touches `content_assets`: the founder-content spine had a submission path (assets get an
 * `ewa_task` written by hand) and no resolution path at all.
 *
 * That gap made `amber-ewa` a one-way door. `20260801_content_state_guards.sql` lets an asset reach
 * `approved` on either `preflight = 'green'` plus a canonical article, or `preflight = 'amber-ewa'`
 * plus `ewa_signed_at`; and `20260802_ewa_signed_at_insert_guard.sql` protects that column with a
 * trigger saying it is "written only by the sign-off sync". Nothing was that sync. Found 2026-08-04
 * when Ewa ruled on four Pillar E social assets and `what-time-was-it-taken` could not advance
 * despite an unambiguous approval, because the copy had not changed and so nothing could move it
 * off amber.
 *
 * Per run, for each `content_assets` row with an `ewa_task` and no `ewa_signed_at`:
 *   1. resolve the ClickUp task id (rows hold either a bare id or a full task URL).
 *   2. fetch the task and apply `isApproved()`: status 'complete' AND every item on the rulings
 *      checklist ticked. The second half is not decoration. The andropause hub was approved by bare
 *      completion on 2026-07-29 with two CA-028 rulings asked twice and never answered.
 *   3. if approved, call `record_ewa_signoff(slug)`, the only writer permitted past the trigger.
 *   4. otherwise report why and change nothing.
 *
 * **This script is the evidence half and the RPC is the privilege half.** The function cannot reach
 * the network so it cannot know what Ewa did; this script cannot write the column. Do not add a
 * second caller of that function without reproducing the check in step 2.
 *
 * It records her sight on GREEN assets too, not only amber ones. An asset can be green and still
 * have been personally reviewed (that is exactly `nothing-to-buy-for-it` after her 2026-08-04
 * ruling), and leaving the signature unrecorded because the gate did not strictly need it is how a
 * clinical review becomes invisible to the audit trail.
 *
 * Idempotent: the filter excludes anything already signed, and the RPC refuses to overwrite. Safe
 * to run on a schedule.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/signoff-sync.ts --dry
 *   npx tsx scripts/content-engine/signoff-sync.ts
 */
import path from 'path'
import { loadEnvLocal, admin, logRun } from './_shared'
import { loadTable } from './content-doctor'
import { getTask, isApproved, unresolvedRulings, type ReviewTask } from './clickup'

loadEnvLocal()
const DRY = process.argv.includes('--dry')

const log = (s: string) => console.log(s)

/**
 * `content_assets.ewa_task` is hand-written and both spellings are live in the table today:
 * `handbrake-half-on` holds `869ecga1e`, `instrumentation-problem` holds
 * `https://app.clickup.com/t/869eaqwv0`. Normalising here rather than cleaning the column keeps a
 * hand-written field forgiving; a sync that only understood one spelling would silently skip half
 * the rows, and skipping is the failure mode that looks identical to "nothing to do".
 */
export function taskIdFrom(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  const fromUrl = /\/t\/([A-Za-z0-9]+)/.exec(trimmed)
  if (fromUrl) return fromUrl[1]
  if (/^[A-Za-z0-9]+$/.test(trimmed)) return trimmed
  return null
}

export type Outcome =
  | { kind: 'signed'; slug: string; taskId: string; at: string }
  | { kind: 'not-complete'; slug: string; taskId: string; statusName: string }
  | { kind: 'rulings-open'; slug: string; taskId: string; open: string[] }
  | { kind: 'bad-task-ref'; slug: string; raw: string }
  | { kind: 'error'; slug: string; taskId: string | null; message: string }
  | { kind: 'noop'; slug: string; taskId: string }

/** Decide an outcome from a fetched task. Pure, so the tests can drive it without a network. */
export function decide(slug: string, taskId: string, task: ReviewTask): Outcome {
  if (isApproved(task)) return { kind: 'signed', slug, taskId, at: '' }
  if (task.statusName !== 'complete') {
    return { kind: 'not-complete', slug, taskId, statusName: task.statusName }
  }
  // Complete, but the gate still refuses: named rulings are outstanding. Never sign this.
  return { kind: 'rulings-open', slug, taskId, open: unresolvedRulings(task) }
}

interface SignoffRow {
  slug: string
  preflight: string | null
  status: string | null
  ewa_task: string | null
  ewa_signed_at: string | null
}

/**
 * `content_assets` is not in the generated `Database` type, which is why every content-engine
 * script reads it through `loadTable` rather than the typed client. `loadTable` also asserts the
 * server's exact row count against what arrived, so a silently truncated read is an error rather
 * than a short list. It takes no filter, so the predicate is applied here; the table is tens of
 * rows, and a filter that lives in readable code beats one hidden in a query string.
 */
export function needsSignature(rows: SignoffRow[]): SignoffRow[] {
  return rows
    .filter((r) => (r.ewa_task ?? '').trim() !== '' && r.ewa_signed_at === null)
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

async function main() {
  const startedAt = new Date().toISOString()

  const read = await loadTable<SignoffRow>(
    'content_assets',
    'slug, preflight, status, ewa_task, ewa_signed_at',
  )
  if (read.error) throw new Error(`content_assets read failed: ${read.error}`)

  const candidates = needsSignature(read.rows)
  log(`signoff-sync${DRY ? ' (dry)' : ''}: ${candidates.length} asset(s) with a review task and no signature`)
  if (candidates.length === 0) {
    log('nothing to do')
    return 0
  }

  const outcomes: Outcome[] = []

  for (const row of candidates) {
    const slug = row.slug
    const raw = row.ewa_task
    const taskId = taskIdFrom(raw)

    if (!taskId) {
      outcomes.push({ kind: 'bad-task-ref', slug, raw: raw ?? '' })
      continue
    }

    let task: ReviewTask
    try {
      task = await getTask(taskId)
    } catch (e) {
      outcomes.push({ kind: 'error', slug, taskId, message: (e as Error).message })
      continue
    }

    const verdict = decide(slug, taskId, task)
    if (verdict.kind !== 'signed') {
      outcomes.push(verdict)
      continue
    }

    if (DRY) {
      outcomes.push({ ...verdict, at: '(dry, not written)' })
      continue
    }

    // The only sanctioned write. Returns null when the row was already signed, has no ewa_task,
    // or does not exist: all three are no-ops rather than failures, so a re-run stays quiet.
    // Cast for the same reason as the read above: the function is not in the generated types.
    const rpc = admin() as unknown as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>
    }
    const { data: signed, error: rpcError } = await rpc.rpc('record_ewa_signoff', { p_slug: slug })
    if (rpcError) {
      outcomes.push({ kind: 'error', slug, taskId, message: `record_ewa_signoff: ${rpcError.message}` })
      continue
    }
    if (!signed) {
      outcomes.push({ kind: 'noop', slug, taskId })
      continue
    }
    outcomes.push({ ...verdict, at: String(signed) })
  }

  for (const o of outcomes) {
    switch (o.kind) {
      case 'signed':
        log(`  SIGNED    ${o.slug}  task ${o.taskId}  ewa_signed_at=${o.at}`)
        break
      case 'not-complete':
        log(`  waiting   ${o.slug}  task ${o.taskId}  status "${o.statusName}", not complete`)
        break
      case 'rulings-open':
        log(`  BLOCKED   ${o.slug}  task ${o.taskId}  complete, but ${o.open.length} ruling(s) unanswered:`)
        for (const r of o.open) log(`              - ${r}`)
        break
      case 'bad-task-ref':
        log(`  BAD REF   ${o.slug}  ewa_task="${o.raw}" is neither a task id nor a task URL`)
        break
      case 'noop':
        log(`  no-op     ${o.slug}  task ${o.taskId}  already signed, or no ewa_task on the row`)
        break
      case 'error':
        log(`  ERROR     ${o.slug}  task ${o.taskId ?? '?'}  ${o.message}`)
        break
    }
  }

  const signedCount = outcomes.filter((o) => o.kind === 'signed').length
  const blocked = outcomes.filter((o) => o.kind === 'rulings-open' || o.kind === 'bad-task-ref')
  const errors = outcomes.filter((o) => o.kind === 'error')

  log('')
  log(`${signedCount} signed, ${blocked.length} blocked, ${errors.length} error(s)`)

  if (!DRY) {
    for (const b of blocked) {
      await logRun({
        agent: 'signoff-sync',
        itemRef: b.slug,
        status: 'blocked',
        error: b.kind === 'rulings-open' ? `${b.open.length} ruling(s) unanswered` : 'unparseable ewa_task',
        startedAt,
      })
    }
    for (const e of errors) {
      await logRun({ agent: 'signoff-sync', itemRef: e.slug, status: 'error', error: e.message, startedAt })
    }
    if (signedCount > 0) {
      await logRun({
        agent: 'signoff-sync',
        status: 'ok',
        detail: { signed: outcomes.filter((o) => o.kind === 'signed').map((o) => o.slug) },
        startedAt,
      })
    }
  }

  // Non-zero only on a genuine failure. A blocked asset is the gate working, not the sync breaking.
  return errors.length > 0 ? 1 : 0
}

/**
 * True only when this module is the process entry point, so importing it never runs it.
 *
 * The basename is compared EXACTLY, and that is not fussiness. This guard was first written as
 * `/signoff-sync\.ts$/.test(process.argv[1])`, and `test-signoff-sync.ts` ends with
 * `signoff-sync.ts`, so importing the module from its own test executed this sync against the
 * production database and wrote four real clinical signatures (2026-08-04). A suffix match on a
 * filename is a collision waiting to happen the moment anyone writes `test-<name>` or `old-<name>`,
 * which is the near-universal convention for the file most likely to import you.
 *
 * Exported so the test can assert it, because the thing that went wrong is not reachable from
 * inside a module that has already executed.
 */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'signoff-sync.ts' || base === 'signoff-sync.js'
}

if (isDirectInvocation(process.argv[1])) {
  main()
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
