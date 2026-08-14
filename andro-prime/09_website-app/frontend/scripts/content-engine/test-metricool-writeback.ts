/**
 * Guards metricool-writeback: the time conversion, the decision layer, and the write contract.
 *
 * WHY THIS EXISTS. This job writes "published" into the store of record. Its failure directions
 * are asymmetric and both are bad. Recording a publish that did not happen turns a red invariant
 * into a green lie, which is worse than the red one, because the red one was at least true.
 * Failing to record a publish that DID happen leaves the exact drift the whole content machine
 * was built to end, and leaves I4 red every morning, which is how a real alarm becomes wallpaper.
 *
 * The cases that matter most are the ones where a post did NOT go out: a provider reporting an
 * error, and a slot that has passed while the platform still reports pending. Before this job,
 * no check in the repo could tell either of those apart from a missing write-back.
 *
 * No network, no database, no credentials. Every entry point takes its inputs as arguments.
 *
 * Run: npx tsx scripts/content-engine/test-metricool-writeback.ts
 */
import {
  utcFromWallClock, zoneOffsetMs, pickProvider, classify, render, exitCodeFor,
  isDirectInvocation, runWriteback,
  type PendingRendition, type MetricoolPost, type PostLookup, type RunResult, type Writer,
} from './metricool-writeback'

let failures = 0

/**
 * Async checks are collected so the summary can wait for them.
 *
 * Without this, the process reaches its exit decision before any async check has resolved, so a
 * failing one prints its ✗ after "All checks passed" and the suite still exits 0. A test suite
 * that reports green while a check is failing is worse than no suite, and it is the same shape
 * as the bug this whole job exists to fix. `test-content-doctor.ts` uses this pattern; the
 * `await check(...)` inside an async `run()` in `test-metricool-schedule.ts` is the other way.
 */
const pending: Array<Promise<void>> = []

function check(name: string, fn: () => void | Promise<void>) {
  const done = (err?: unknown) => {
    if (err) { failures += 1; console.log(`  ✗ ${name}`); console.log(`      ${(err as Error).message}`) }
    else console.log(`  ✓ ${name}`)
  }
  try {
    const r = fn()
    if (r instanceof Promise) { pending.push(r.then(() => done()).catch(done)); return }
    done()
  } catch (e) { done(e) }
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

const rendition = (over: Partial<PendingRendition> = {}): PendingRendition => ({
  id: 'r-1',
  asset_slug: 'x-w01-4-built-from-one-pool',
  platform: 'x',
  format: 'text-post',
  status: 'scheduled',
  scheduled_for: '2026-08-06T11:15:00+00:00',
  external_post_id: '356262295',
  external_url: null,
  ...over,
})

const post = (over: Partial<MetricoolPost> = {}): MetricoolPost => ({
  id: 356262295,
  draft: false,
  publicationDate: { dateTime: '2026-08-06T12:15:00', timezone: 'Europe/London' },
  providers: [{ network: 'twitter', id: '2085323898585846119', status: 'PUBLISHED', publicUrl: 'https://twitter.com/a/status/2085323898585846119', detailedStatus: 'Published' }],
  ...over,
})

const found = (p: MetricoolPost): PostLookup => ({ state: 'found', post: p })

console.log('\nmetricool-writeback')
console.log('─'.repeat(72))

// ── Time conversion ──────────────────────────────────────────────────────────

console.log('\n  time: local wall clock to UTC')

check('BST: the live value this was verified against resolves to the stored scheduled_for', () => {
  // Metricool returned 12:15 London for the post whose scheduled_for is 11:15Z. If this
  // regresses, published_at silently lands an hour out on every summer post.
  assert(utcFromWallClock('2026-08-06T12:15:00', 'Europe/London') === '2026-08-06T11:15:00.000Z',
    `got ${utcFromWallClock('2026-08-06T12:15:00', 'Europe/London')}`)
})

check('BST: the second live value resolves too', () => {
  assert(utcFromWallClock('2026-08-07T11:00:00', 'Europe/London') === '2026-08-07T10:00:00.000Z',
    `got ${utcFromWallClock('2026-08-07T11:00:00', 'Europe/London')}`)
})

check('GMT: a winter date takes no offset', () => {
  assert(utcFromWallClock('2026-01-15T09:30:00', 'Europe/London') === '2026-01-15T09:30:00.000Z',
    `got ${utcFromWallClock('2026-01-15T09:30:00', 'Europe/London')}`)
})

check('DST boundary: the hour after the spring change is BST, not GMT', () => {
  // 2026-03-29 01:00 UTC is when London springs forward. 02:30 local that day is BST (+1).
  assert(utcFromWallClock('2026-03-29T02:30:00', 'Europe/London') === '2026-03-29T01:30:00.000Z',
    `got ${utcFromWallClock('2026-03-29T02:30:00', 'Europe/London')}`)
})

check('DST boundary: the day of the autumn change still resolves', () => {
  assert(utcFromWallClock('2026-10-25T09:00:00', 'Europe/London') === '2026-10-25T09:00:00.000Z',
    `got ${utcFromWallClock('2026-10-25T09:00:00', 'Europe/London')}`)
})

check('a non-London zone works, so this is not London-shaped by accident', () => {
  assert(utcFromWallClock('2026-08-06T12:15:00', 'UTC') === '2026-08-06T12:15:00.000Z',
    `got ${utcFromWallClock('2026-08-06T12:15:00', 'UTC')}`)
})

check('an unreadable wall clock returns null rather than a plausible date', () => {
  assert(utcFromWallClock('not a date') === null, 'should be null')
  assert(utcFromWallClock('') === null, 'empty should be null')
})

check('zoneOffsetMs reports +1h in British summer and 0 in winter', () => {
  assert(zoneOffsetMs(Date.parse('2026-08-06T11:15:00Z'), 'Europe/London') === 3_600_000, 'summer should be +1h')
  assert(zoneOffsetMs(Date.parse('2026-01-15T09:30:00Z'), 'Europe/London') === 0, 'winter should be 0')
})

// ── Provider matching ────────────────────────────────────────────────────────

console.log('\n  provider matching')

check('our "x" maps to Metricool\'s "twitter"', () => {
  const p = pickProvider(post(), 'x')
  assert(p?.network === 'twitter', 'should have found the twitter provider')
})

check('an unmapped platform matches nothing rather than guessing', () => {
  assert(pickProvider(post(), 'substack') === null, 'substack has no Metricool mapping')
})

check('a post carrying only another network does not match', () => {
  const p = pickProvider(post({ providers: [{ network: 'facebook', status: 'PUBLISHED' }] }), 'x')
  assert(p === null, 'must not fall back to the first provider')
})

// ── Decision ─────────────────────────────────────────────────────────────────

console.log('\n  decision')

check('PUBLISHED writes the time and the URL the provider gave', () => {
  const v = classify(rendition(), found(post()))
  assert(v.kind === 'write', `expected write, got ${v.kind}`)
  if (v.kind !== 'write') return
  assert(v.publishedAt === '2026-08-06T11:15:00.000Z', `time was ${v.publishedAt}`)
  assert(v.url === 'https://twitter.com/a/status/2085323898585846119', `url was ${v.url}`)
  assert(!v.note, `expected no note, got ${v.note}`)
})

check('PUBLISHED with no publicUrl still records the publish, and says why there is no link', () => {
  const v = classify(rendition(), found(post({
    providers: [{ network: 'twitter', status: 'PUBLISHED' }],
  })))
  assert(v.kind === 'write', `expected write, got ${v.kind}`)
  if (v.kind !== 'write') return
  assert(v.url === null, 'must not construct a URL')
  assert(/no publicUrl/i.test(v.note ?? ''), 'the absence should be stated in the note')
})

check('a publication time that moved in Metricool is recorded and flagged', () => {
  const v = classify(rendition(), found(post({
    publicationDate: { dateTime: '2026-08-06T18:00:00', timezone: 'Europe/London' },
  })))
  assert(v.kind === 'write', `expected write, got ${v.kind}`)
  if (v.kind !== 'write') return
  assert(/moved in Metricool/i.test(v.note ?? ''), `expected a drift note, got ${v.note}`)
})

check('THE IMPORTANT ONE: a provider error is a refusal, never a publish', () => {
  const v = classify(rendition(), found(post({
    providers: [{ network: 'twitter', status: 'ERROR', detailedStatus: 'Token expired' }],
  })))
  assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
  if (v.kind !== 'refuse') return
  assert(/did not go out/i.test(v.why), 'the message must say it did not publish')
})

check('THE OTHER IMPORTANT ONE: slot passed but still pending is a refusal, not a publish', () => {
  const v = classify(
    rendition(),
    found(post({ providers: [{ network: 'twitter', status: 'PENDING' }] })),
    new Date('2026-08-10T00:00:00Z'),
  )
  assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
  if (v.kind !== 'refuse') return
  assert(/has NOT published/i.test(v.why), 'must state plainly that it did not publish')
})

check('pending with the slot still ahead is routine, not a finding', () => {
  const v = classify(
    rendition({ scheduled_for: '2026-12-01T10:00:00+00:00' }),
    found(post({ providers: [{ network: 'twitter', status: 'PENDING' }] })),
    new Date('2026-08-14T00:00:00Z'),
  )
  assert(v.kind === 'pending', `expected pending, got ${v.kind}`)
})

check('a draft is reported, because flipping it live is a human gate', () => {
  const v = classify(
    rendition({ scheduled_for: '2026-12-01T10:00:00+00:00' }),
    found(post({ draft: true, providers: [{ network: 'twitter', status: 'PENDING' }] })),
  )
  assert(v.kind === 'report', `expected report, got ${v.kind}`)
  if (v.kind !== 'report') return
  assert(/DRAFT/i.test(v.why), 'should name the draft state')
})

check('a missing post is reported and explicitly left to I3', () => {
  const v = classify(rendition(), { state: 'missing' })
  assert(v.kind === 'report', `expected report, got ${v.kind}`)
  if (v.kind !== 'report') return
  assert(/I3/.test(v.why), 'should hand off to the invariant that owns it')
  assert(/will not clear an id/i.test(v.why), 'should state that it does not clean up')
})

check('an unreachable API is reported, and unverified is not treated as unpublished', () => {
  const v = classify(rendition(), { state: 'unresolvable', why: 'HTTP 503' })
  assert(v.kind === 'report', `expected report, got ${v.kind}`)
  if (v.kind !== 'report') return
  assert(/not the same as unpublished/i.test(v.why), 'must distinguish unknown from negative')
})

check('a post whose providers do not include our platform is refused', () => {
  const v = classify(rendition(), found(post({ providers: [{ network: 'facebook', status: 'PUBLISHED' }] })))
  assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
  if (v.kind !== 'refuse') return
  assert(/disagree/i.test(v.why), 'should say the id and rendition disagree')
})

// ── Orchestration ────────────────────────────────────────────────────────────

console.log('\n  orchestration')

check('a dry run writes nothing but still reports what it would set', async () => {
  let writes = 0
  const write: Writer = async () => { writes += 1 }
  const out = await runWriteback({
    renditions: [rendition()],
    read: async () => found(post()),
    write, dryRun: true,
  })
  assert(writes === 0, 'a dry run must not write')
  assert(out.written.length === 1, 'it should still report the intended write')
})

check('a failed write becomes a FAILURE carrying the live URL, never a silent success', async () => {
  const write: Writer = async () => { throw new Error('connection reset') }
  const out = await runWriteback({
    renditions: [rendition()],
    read: async () => found(post()),
    write, dryRun: false,
  })
  assert(out.written.length === 0, 'nothing should be reported as written')
  assert(out.failed.length === 1, 'it should be a failure')
  assert(/IS PUBLISHED/.test(out.failed[0].why), 'the message must say the post is live')
  assert(/I4 will stay red/.test(out.failed[0].why), 'and that the invariant stays red')
})

check('the writer receives only the columns this job owns', async () => {
  const seen: Record<string, unknown>[] = []
  const write: Writer = async (_id, patch) => { seen.push(patch as unknown as Record<string, unknown>) }
  await runWriteback({ renditions: [rendition()], read: async () => found(post()), write, dryRun: false })
  assert(seen.length === 1, 'one write expected')
  assert(Object.keys(seen[0]).sort().join(',') === 'external_url,published_at',
    `unexpected columns: ${Object.keys(seen[0]).join(',')}`)
})

check('one bad rendition does not stop the rest of the run', async () => {
  const out = await runWriteback({
    renditions: [
      rendition({ id: 'a', asset_slug: 'good' }),
      rendition({ id: 'b', asset_slug: 'gone', external_post_id: '999' }),
      rendition({ id: 'c', asset_slug: 'also-good' }),
    ],
    read: async (postId) => (postId === '999' ? { state: 'missing' } : found(post())),
    write: async () => {}, dryRun: false,
  })
  assert(out.written.length === 2, `expected 2 written, got ${out.written.length}`)
  assert(out.reported.length === 1, `expected 1 reported, got ${out.reported.length}`)
})

// ── Exit codes and output ────────────────────────────────────────────────────

console.log('\n  exit codes and output')

const empty: RunResult = { written: [], refused: [], reported: [], pending: 0, failed: [] }

check('clean run exits 0, refusals exit 3, failures exit 2', () => {
  assert(exitCodeFor(empty) === 0, 'clean should be 0')
  assert(exitCodeFor({ ...empty, refused: [{ slug: 's', platform: 'x', why: 'w' }] }) === 3, 'refusal should be 3')
  assert(exitCodeFor({ ...empty, failed: [{ slug: 's', platform: 'x', why: 'w' }] }) === 2, 'failure should be 2')
})

check('a failure outranks a refusal in the exit code', () => {
  assert(exitCodeFor({
    ...empty,
    refused: [{ slug: 's', platform: 'x', why: 'w' }],
    failed: [{ slug: 's', platform: 'x', why: 'w' }],
  }) === 2, 'a failure is the more serious of the two')
})

check('an empty run says so rather than printing nothing', () => {
  assert(/clean run, not a silent one/.test(render(empty, { dryRun: false })), 'should state the run was clean')
})

check('a dry run is labelled as one in the output', () => {
  assert(/DRY RUN/.test(render(empty, { dryRun: true })), 'must be obvious from the output')
})

check('direct-invocation guard matches the exact basename only', () => {
  assert(isDirectInvocation('/x/metricool-writeback.ts'), 'should match itself')
  assert(!isDirectInvocation('/x/test-metricool-writeback.ts'), 'MUST NOT match its own test file')
  assert(!isDirectInvocation(undefined), 'undefined should not match')
})

void Promise.all(pending).then(() => {
  console.log('')
  if (failures) { console.log(`${failures} failing check(s).`); process.exit(1) }
  console.log('All checks passed.')
})
