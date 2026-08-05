/**
 * Guards signoff-sync: the id normaliser and the decision layer.
 *
 * WHY THIS EXISTS. This script is the only thing in the repo permitted to record a clinical
 * sign-off, so its two failure directions are asymmetric and both are bad. Signing something Ewa
 * did not approve puts her name on copy she never saw. Failing to sign something she did approve
 * leaves an asset stuck behind a gate forever, which is exactly the bug this script was written to
 * fix. The tests below are about those two directions and nothing else.
 *
 * The most important single case is `complete + an unticked ruling`. Bare completion used to be
 * read as approval, and on 2026-07-29 the andropause hub was approved that way with two CA-028
 * rulings asked twice and never answered. `isApproved()` was tightened for the article spine after
 * that; this asserts the founder spine inherits the same rule rather than quietly re-opening it.
 *
 * No network, no database, no credentials. `decide()` takes its task as an argument.
 *
 * Run: npx tsx scripts/content-engine/test-signoff-sync.ts
 */
import { taskIdFrom, decide, isDirectInvocation, needsSignature } from './signoff-sync'
import { RULINGS_CHECKLIST, type ReviewTask } from './clickup'

let failures = 0

function check(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failures += 1
    console.log(`  ✗ ${name}`)
    console.log(`      ${(err as Error).message}`)
  }
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

function task(over: Partial<ReviewTask> = {}): ReviewTask {
  return { id: 't1', url: 'https://app.clickup.com/t/t1', statusName: 'complete', dueDate: null, checklists: [], ...over }
}

function withRulings(items: Array<[string, boolean]>, statusName = 'complete'): ReviewTask {
  return task({
    statusName,
    checklists: [
      {
        id: 'c1',
        name: RULINGS_CHECKLIST,
        items: items.map(([name, resolved], i) => ({ id: `i${i}`, name, resolved })),
      },
    ],
  })
}

console.log('\nsignoff-sync\n')

// ── the entry-point guard ────────────────────────────────────────────────────────────────────
// This is the highest-value test in the file, because it guards a bug that ALREADY FIRED.
// The first version of the guard was a suffix match, `test-signoff-sync.ts` satisfied it, and
// running this very test file executed the sync against production and wrote four real clinical
// signatures (2026-08-04). A test that imports the module it tests must never be able to run it.

check('THE REGRESSION: running the TEST file must not count as direct invocation', () => {
  for (const argv1 of [
    '/repo/scripts/content-engine/test-signoff-sync.ts',
    'C:\\repo\\scripts\\content-engine\\test-signoff-sync.ts',
    './test-signoff-sync.ts',
    'old-signoff-sync.ts',
    'copy-of-signoff-sync.ts',
  ]) {
    assert(!isDirectInvocation(argv1), `${argv1} must NOT be treated as the entry point`)
  }
})

check('the real script IS direct invocation, on either path separator', () => {
  for (const argv1 of [
    '/repo/scripts/content-engine/signoff-sync.ts',
    'C:\\repo\\scripts\\content-engine\\signoff-sync.ts',
    'signoff-sync.ts',
    '/dist/signoff-sync.js',
  ]) {
    assert(isDirectInvocation(argv1), `${argv1} SHOULD be the entry point`)
  }
})

check('a missing argv[1] is not direct invocation', () => {
  assert(!isDirectInvocation(undefined), 'undefined argv[1] must not run the sync')
  assert(!isDirectInvocation(''), 'empty argv[1] must not run the sync')
})

// ── the id normaliser ────────────────────────────────────────────────────────────────────────
// Both spellings are live in content_assets today. A sync that understood only one would skip
// half the rows, and a skip is indistinguishable from "nothing to do".

check('a bare task id passes through', () => {
  assert(taskIdFrom('869ecga1e') === '869ecga1e', 'bare id should pass through')
})

check('a full ClickUp task URL yields the id', () => {
  assert(taskIdFrom('https://app.clickup.com/t/869eaqwv0') === '869eaqwv0', 'should extract from /t/<id>')
})

check('a URL with a trailing slash or query still yields the id', () => {
  assert(taskIdFrom('https://app.clickup.com/t/869eaqwv0/') === '869eaqwv0', 'trailing slash')
  assert(taskIdFrom('https://app.clickup.com/t/869eaqwv0?x=1') === '869eaqwv0', 'query string')
})

check('surrounding whitespace is tolerated', () => {
  assert(taskIdFrom('  869ecga1e \n') === '869ecga1e', 'hand-typed values carry whitespace')
})

check('null, empty and junk yield null rather than a guess', () => {
  for (const v of [null, undefined, '', '   ', 'not a task', 'https://example.com/nope']) {
    assert(taskIdFrom(v as string | null) === null, `expected null for ${JSON.stringify(v)}`)
  }
})

// ── the candidate filter ─────────────────────────────────────────────────────────────────────

const row = (over: Partial<Parameters<typeof needsSignature>[0][number]> = {}) => ({
  slug: 'a', preflight: 'green', status: 'scripted', ewa_task: '869x', ewa_signed_at: null, ...over,
})

check('an already-signed asset is never revisited', () => {
  const out = needsSignature([row({ slug: 'signed', ewa_signed_at: '2026-08-04T00:00:00Z' })])
  assert(out.length === 0, 'a signed asset must not be a candidate')
})

check('an asset with no review task is skipped, because there is no evidence anywhere', () => {
  const out = needsSignature([row({ slug: 'no-task', ewa_task: null }), row({ slug: 'blank', ewa_task: '   ' })])
  assert(out.length === 0, 'null and whitespace ewa_task must both be skipped')
})

check('GREEN assets are candidates too, not only amber ones', () => {
  // An asset can be green and still have been personally reviewed. Skipping it because the gate
  // did not strictly need the signature is how a clinical review becomes invisible.
  const out = needsSignature([row({ slug: 'g', preflight: 'green' }), row({ slug: 'a2', preflight: 'amber-ewa' })])
  assert(out.length === 2, `both preflight states should be candidates, got ${out.length}`)
})

check('candidates come back in slug order, so the log is stable run to run', () => {
  const out = needsSignature([row({ slug: 'zebra' }), row({ slug: 'alpha' }), row({ slug: 'mid' })])
  assert(out.map((r) => r.slug).join(',') === 'alpha,mid,zebra', 'expected slug order')
})

// ── the decision layer ───────────────────────────────────────────────────────────────────────

check('complete with no rulings checklist is a sign', () => {
  const d = decide('slug-a', 't1', task())
  assert(d.kind === 'signed', `expected signed, got ${d.kind}`)
})

check('complete with every ruling ticked is a sign', () => {
  const d = decide('slug-a', 't1', withRulings([['does CA-028 §4 govern this phrase', true], ['keep the figure', true]]))
  assert(d.kind === 'signed', `expected signed, got ${d.kind}`)
})

check('THE REGRESSION: complete with an unticked ruling is BLOCKED, never signed', () => {
  const d = decide('slug-a', 't1', withRulings([['keep the figure', false], ['answered one', true]]))
  assert(d.kind === 'rulings-open', `expected rulings-open, got ${d.kind}`)
  assert(d.kind === 'rulings-open' && d.open.length === 1, 'exactly one ruling should be outstanding')
  assert(d.kind === 'rulings-open' && d.open[0] === 'keep the figure', 'the outstanding ruling must be named')
})

check('not-complete is never signed, whatever the checklist says', () => {
  for (const status of ['to do', 'in progress', 'approved', 'blocked']) {
    const d = decide('slug-a', 't1', withRulings([['x', true]], status))
    assert(d.kind === 'not-complete', `status "${status}" should be not-complete, got ${d.kind}`)
    assert(d.kind === 'not-complete' && d.statusName === status, 'the status must be reported back')
  }
})

check('a status of "approved" on another list is reported, not treated as complete', () => {
  // instrumentation-problem's task lives on a list whose vocabulary is APPROVED/PENDING rather
  // than complete. Refusing to guess is the point: signing on an unrecognised status would put a
  // clinical signature on an inferred approval.
  const d = decide('instrumentation-problem', 't1', task({ statusName: 'approved' }))
  assert(d.kind === 'not-complete', `expected not-complete, got ${d.kind}`)
})

check('an unrelated checklist does not block', () => {
  const d = decide('slug-a', 't1', task({
    checklists: [{ id: 'c9', name: 'Production steps', items: [{ id: 'i0', name: 'film it', resolved: false }] }],
  }))
  assert(d.kind === 'signed', 'only the rulings checklist gates approval')
})

check('the slug and task id are carried onto every outcome', () => {
  for (const t of [task(), task({ statusName: 'to do' }), withRulings([['x', false]])]) {
    const d = decide('carried-slug', 'carried-task', t)
    assert('slug' in d && d.slug === 'carried-slug', `slug lost on ${d.kind}`)
    assert('taskId' in d && d.taskId === 'carried-task', `taskId lost on ${d.kind}`)
  }
})

console.log(
  failures === 0
    ? '\n🟢 signoff-sync: all clean. Completion alone cannot sign an asset with an open ruling, and both ewa_task spellings resolve.\n'
    : `\n🔴 signoff-sync: ${failures} failure(s).\n`,
)
process.exitCode = failures === 0 ? 0 : 1
