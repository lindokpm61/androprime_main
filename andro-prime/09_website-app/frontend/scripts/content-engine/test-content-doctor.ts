/**
 * Guards content-doctor: its pure logic AND every invariant, against injected fixtures.
 *
 * WHY THIS EXISTS. The doctor's whole value is that it cannot report an unperformed check as a
 * pass. An earlier version of this suite tested only the helpers, so `inv1`…`inv8` were not
 * under test at all, and two tests asserted their own arithmetic rather than the doctor's.
 * A verification pass then proved the real defect: intercepting `content_renditions` and
 * returning `[]` made I4 and I5 print 🟢 PASS. That case is now the first test below.
 *
 * No network, no database, no credentials. It touches the real repo in exactly two places, both
 * on purpose: it READS `scan.js`, because a vocabulary parser must be tested against the real
 * source it parses, and it RUNS `scan.js` in a child process over a temporary fixture, because
 * the database-owned key list is now shared between the scanner and this doctor and only
 * executing both proves their derivations agree. Neither touches the network or the database.
 *
 * Run: npx tsx scripts/content-engine/test-content-doctor.ts
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'
import {
  classify, need, fileSlug, cleanVal, parseAsset, extractLiteral, stripComments, parseScannerVocab,
  isPastSchedule, todoMarkers, markerTier, extractCountAssertions, maskRetired, summarise, exitCodeFor,
  runStatusFor, runOutcomeFor, tableOk, tableFailed, emptyCtx, runInvariants, loadTable,
  stripGeneratedState, stateKeysIn, I9_FLAT, I9_REND, FLAT_ENUMS, REND_ENUMS,
  DB_OWNED_KEYS, readDbOwnedKeys, mirroredKeys,
  inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8, inv9, inv10, COVERAGE_WINDOW_DAYS,
  COUNT_PATTERNS, VOCAB_MAP, PAGE,
  clickupTaskId, assetsNeedingRuling, resolveEwaApprovals,
  metricoolCreds, metricoolFetcher, probeMetricool, metricoolIds,
  type Finding, type Invariant, type Verdict, type Store, type RepoCtx, type Queryable, type QueryResult,
  type AssetRow, type RenditionRow, type ChannelRow, type ArticleRow, type TaskFetcher,
  type MetricoolProbe, type PostState,
} from './content-doctor'
import type { ReviewTask } from './clickup'

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

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

// Async tests are collected and awaited before the final tally, so a rejected promise can
// never be counted as a pass. A plain `check(name, async () => ...)` would do exactly that.
const pending: Array<Promise<void>> = []
function checkAsync(name: string, fn: () => Promise<void>) {
  pending.push(
    fn().then(
      () => { console.log(`  ✓ ${name}`) },
      (err: Error) => { failures++; console.error(`  ✗ ${name}\n      ${err.message}`) },
    ),
  )
}

// ───────────────────────────────────────────────────────────────── fixtures

const asset = (o: Partial<AssetRow> = {}): AssetRow => ({
  id: 'a1', slug: 'a-slug', status: 'done', content_type: 'educational',
  funnel_stage: 'TOFU', awareness: 'problem-aware', cta: 'quiz',
  preflight: 'green', ewa_task: null, canonical_article_id: 'art1', ...o,
})
const rend = (o: Partial<RenditionRow> = {}): RenditionRow => ({
  id: 'r1', asset_id: 'a1', platform: 'linkedin', format: 'text-post',
  thumb_spec: 'none', status: 'to-produce', scheduled_for: null, published_at: null,
  external_post_id: null, external_url: null, publisher: 'unipile', ...o,
})
const channel = (o: Partial<ChannelRow> = {}): ChannelRow =>
  ({ platform: 'linkedin', format: 'text-post', in_plan: true, lane: 'lane-1', coverage_paused_until: null, coverage_pause_reason: null, ...o })
const article = (o: Partial<ArticleRow> = {}): ArticleRow =>
  ({ id: 'art1', slug: 'an-article', status: 'published', body: 'clean prose', ...o })

function store(o: Partial<Store> = {}): Store {
  return {
    content_assets: tableOk([asset()]),
    content_renditions: tableOk([rend()]),
    content_channels: tableOk([channel()]),
    blog_articles: tableOk([article()]),
    ...o,
  }
}
const ctx = (o: Partial<RepoCtx> = {}): RepoCtx => ({ ...emptyCtx(), ...o })
const violationsOf = (i: Invariant) => i.findings.filter((f) => f.kind === 'violation')
const notesOf = (i: Invariant) => i.findings.filter((f) => f.kind === 'note')

const violation = (message = 'boom'): Finding => ({ kind: 'violation', ref: 'r', message })
const note = (message = 'fyi'): Finding => ({ kind: 'note', ref: 'r', message })
function inv(id: string, verdict: Verdict, reason: string | null = null, expected = false): Invariant {
  return { id, title: `${id} title`, reads: ['t'], verdict, reason, expected, findings: [] }
}

/**
 * A fake PostgREST. Each entry is one page response, returned in order, so a test can hand
 * back a short body, a missing count, or a mid-pagination error. Records the ranges requested
 * so pagination can be asserted rather than assumed.
 */
function fakeDb(pages: QueryResult[]): Queryable & { calls: Array<[number, number]> } {
  const calls: Array<[number, number]> = []
  let n = 0
  return {
    calls,
    from() {
      return {
        select() {
          return {
            range(from: number, to: number) {
              calls.push([from, to])
              return Promise.resolve(pages[n++] ?? { data: [], error: null, count: 0 })
            },
          }
        },
      }
    },
  }
}
const page = (rows: number, count: number | null): QueryResult =>
  ({ data: Array.from({ length: rows }, (_, i) => ({ i })), error: null, count })

console.log('\ncontent-doctor\n')

// ═══════════════════════════════════════════ loadTable: the empty-read guard

console.log('  — loadTable, the guard everything else rests on —')

checkAsync('ATTACK 1: no exact count means completeness cannot be asserted, so the read FAILS', async () => {
  const r = await loadTable('content_renditions', 'id', fakeDb([page(5, null)]))
  assert(r.error !== null, 'a missing count header must not be accepted')
  assert(/no exact count/.test(r.error!), `the error must name the cause: ${r.error}`)
  assert(r.rows.length === 0 && r.count === 0, 'a failed read must not hand back partial rows')
})

checkAsync('ATTACK 2: count says 39 but the body is short — the row-count mismatch is caught', async () => {
  const r = await loadTable('content_renditions', 'id', fakeDb([page(5, 39), page(0, 39)]))
  assert(r.error !== null, 'a truncated or intercepted body must fail loudly')
  assert(/row-count mismatch/.test(r.error!), `the error must name the mismatch: ${r.error}`)
  assert(/counted 39/.test(r.error!) && /5 arrived/.test(r.error!), 'both numbers must be reported')
})

checkAsync('ATTACK 3: a legitimately empty table reads cleanly, then blocks at need()', async () => {
  const r = await loadTable<RenditionRow>('content_renditions', 'id', fakeDb([page(0, 0)]))
  assert(r.error === null && r.count === 0, 'a truly empty table is not a read failure')
  const s = store({ content_renditions: r })
  assert(inv4(s, new Date()).verdict === 'UNCHECKED', 'but nothing can be measured from it, so not a pass')
})

checkAsync('ATTACK 4: a mid-pagination failure is captured, not half-returned', async () => {
  const r = await loadTable('content_assets', 'id', fakeDb([
    page(PAGE, 1500),
    { data: null, error: { message: 'connection reset' }, count: 1500 },
  ]))
  assert(r.error !== null && /connection reset/.test(r.error!), `page 2 failing must fail the read: ${r.error}`)
  assert(r.rows.length === 0, 'the first 1000 rows must NOT be returned as if complete')
})

checkAsync('a genuine multi-page read reassembles completely and pages in order', async () => {
  const db = fakeDb([page(PAGE, 1500), page(500, 1500)])
  const r = await loadTable('content_assets', 'id', db)
  assert(r.error === null && r.rows.length === 1500 && r.count === 1500, `expected 1500 rows, got ${r.rows.length}`)
  assert(db.calls[0][0] === 0 && db.calls[1][0] === PAGE, `pagination ranges wrong: ${JSON.stringify(db.calls)}`)
})

// ══════════════════════════════════════ THE EMPTY-READ REGRESSION (blocker 1)

console.log('\n  — an empty read is not a measurement —')

check('THE REGRESSION: empty content_renditions makes I4 UNCHECKED, never PASS', () => {
  const s = store({ content_renditions: tableOk([] as RenditionRow[]) })
  const r = inv4(s, new Date('2026-08-01T00:00:00Z'))
  assert(r.verdict === 'UNCHECKED', `an empty table must not produce a clean bill, got ${r.verdict}`)
  assert(/0 rows/.test(r.reason ?? ''), `the reason must name the emptiness: ${r.reason}`)
})

check('THE REGRESSION: empty content_renditions makes I5 UNCHECKED, never PASS', () => {
  const r = inv5(store({ content_renditions: tableOk([] as RenditionRow[]) }))
  assert(r.verdict === 'UNCHECKED', `got ${r.verdict}: I5 exists to catch a post that shipped unsigned`)
})

check('an UNREAD table makes its dependants UNCHECKED and says so in reads', () => {
  const s = store({ content_renditions: tableFailed<RenditionRow>('content_renditions: boom') })
  for (const r of [inv4(s, new Date()), inv5(s), inv8(s), inv3(s)]) {
    assert(r.verdict === 'UNCHECKED', `${r.id} must be UNCHECKED when a dependency is unread`)
    assert(r.reads.some((x) => /UNREAD/.test(x)), `${r.id} reads line must show the table as UNREAD`)
  }
})

check('every invariant prints a DENOMINATOR, so an empty read is visible on the report', () => {
  for (const r of runInvariants(store(), ctx(), new Date())) {
    assert(r.reads.length > 0, `${r.id} must state what it read`)
    assert(r.reads.some((x) => /\d+\s*(rows|files|md|docs|bytes)|: \d+$/.test(x)),
      `${r.id} reads line carries no count: ${JSON.stringify(r.reads)}`)
  }
})

check('one table outage does not blank invariants that do not use it', () => {
  // The old all-or-nothing loader made an unused content_metrics failure blank I1, I6 and I7.
  const s = store({ content_channels: tableFailed<ChannelRow>('content_channels: boom') })
  assert(inv6(s).verdict !== 'UNCHECKED', 'I6 reads only blog_articles and must still run')
  assert(inv4(s, new Date()).verdict !== 'UNCHECKED', 'I4 does not read content_channels')
  assert(inv7(s, ctx()).verdict === 'UNCHECKED', 'I7 DOES read content_channels and must go unchecked')
})

check('I1 keeps its file-vs-row half when content_renditions is unavailable', () => {
  // Renditions only sharpen the batch-draft explanation. The file<->row comparison needs
  // nothing from them, so a renditions outage must cost the explanation, not the coverage.
  const s = store({
    content_assets: tableOk([asset({ slug: 'in-db-only' })]),
    content_renditions: tableFailed<RenditionRow>('content_renditions: boom'),
  })
  const r = inv1(s, ctx({ assetFiles: [{ path: 'assets/a.md', text: '---\nslug: file-only\n---' }] }))
  assert(r.verdict === 'FAIL', 'the file-vs-row halves must still be measured')
  assert(violationsOf(r).some((v) => /has no content_assets row/.test(v.message)), 'file with no row still caught')
  assert(violationsOf(r).some((v) => /NOT ATTEMPTED/.test(v.message)),
    'and a row with no file must NOT claim a draft was searched for')
  assert(notesOf(r).some((n) => /not attempted/i.test(n.message)), 'the degraded half must be stated')
  assert(r.reads.some((x) => /content_renditions \(UNREAD\)/.test(x)), 'the reads line must show it')
})

// ══════════════════════════════════════════════════ verdict classification

console.log('\n  — verdict classification —')

check('an unperformed check is UNCHECKED, never PASS', () => {
  const r = classify(false, [], 'the fetch failed')
  assert(r.verdict === 'UNCHECKED', `expected UNCHECKED, got ${r.verdict}`)
  assert(r.reason === 'the fetch failed', 'the reason must survive to the report')
})

check('no findings + not checked is still NOT a pass', () => {
  assert(classify(false, [], 'database unreachable').verdict !== 'PASS',
    'zero findings from an unperformed check must never read as clean')
})

check('UNCHECKED without a reason throws rather than being emitted', () => {
  for (const bad of [undefined, null, '   ']) {
    let threw = false
    try { classify(false, [], bad as string) } catch { threw = true }
    assert(threw, `reason ${JSON.stringify(bad)} must be rejected`)
  }
})

check('checked + a violation is FAIL; checked + only notes is PASS', () => {
  assert(classify(true, [violation()]).verdict === 'FAIL', 'a violation must fail')
  assert(classify(true, [note(), note()]).verdict === 'PASS', 'notes are advisory')
  assert(classify(true, []).verdict === 'PASS', 'a real measurement of nothing wrong is a pass')
})

check('need() blocks on both unread and empty, and always carries the count', () => {
  assert(need(store(), ['content_assets']).ok, 'a populated table resolves')
  assert(!need(store({ content_assets: tableOk([] as AssetRow[]) }), ['content_assets']).ok, 'empty blocks')
  assert(!need(store({ content_assets: tableFailed<AssetRow>('x') }), ['content_assets']).ok, 'unread blocks')
  assert(/1 rows/.test(need(store(), ['content_assets']).reads[0]), 'the count is always on the reads line')
})

// ══════════════════════════════════════════════════════ exit codes + logging

console.log('\n  — exit codes and run telemetry —')

check('exit 0 only when every invariant passes; 2 on FAIL; 3 on UNCHECKED', () => {
  assert(exitCodeFor([inv('I1', 'PASS'), inv('I2', 'PASS')]) === 0, 'all-pass must be 0')
  assert(exitCodeFor([inv('I1', 'PASS'), inv('I2', 'FAIL')]) === 2, 'a FAIL must be 2')
  assert(exitCodeFor([inv('I1', 'PASS'), inv('I2', 'UNCHECKED', 'no token')]) === 3, 'unchecked must not be 0')
  assert(exitCodeFor([inv('I1', 'FAIL'), inv('I2', 'UNCHECKED', 'x')]) === 2, 'FAIL outranks UNCHECKED')
})

check('exit 3 is logged as neither ok nor error', () => {
  assert(runStatusFor(3) === 'blocked', `3 must not be logged as error, got ${runStatusFor(3)}`)
  assert(runStatusFor(3) !== 'ok', 'an incomplete run must never be logged as ok')
  assert(runStatusFor(1) === 'error', 'a crash is the only error')
  assert(runStatusFor(0) === 'ok', 'a clean run is ok')
  assert(runStatusFor(2) === 'blocked', 'violations are blocked')
})

check('detail.outcome distinguishes the two blocked cases the enum cannot', () => {
  assert(runOutcomeFor(2) !== runOutcomeFor(3), 'violations and incomplete must be distinguishable')
  assert(runOutcomeFor(1) === 'crashed' && runOutcomeFor(0) === 'clean', 'all four outcomes are named')
})

// ══════════════════════════════════════════════════════════════ the summary

console.log('\n  — the summary block —')

check('the summary names every unchecked invariant and its reason', () => {
  const s = summarise([inv('I1', 'PASS'), inv('I2', 'PASS'), inv('I3', 'UNCHECKED', 'no METRICOOL_* credential', true)])
  assert(s.includes('UNCHECKED IS NOT A PASS'), 'the summary must say so in words')
  assert(s.includes('I3') && s.includes('no METRICOOL_* credential'), 'the gap and its reason must appear')
  assert(s.includes('2 pass out of 3'), 'the denominator must be the full count, not the measured subset')
})

check('an EXPECTED gap reads as the baseline; an UNEXPECTED one reads as an alarm', () => {
  const expected = summarise([inv('I1', 'PASS'), inv('I2', 'UNCHECKED', 'no credential', true)])
  assert(expected.includes('[EXPECTED]'), 'the documented gap must be marked')
  assert(expected.includes('not an alarm'), 'a documented gap must not read as a nightly alarm')
  const surprise = summarise([inv('I1', 'PASS'), inv('I2', 'UNCHECKED', 'fetch failed', false)])
  assert(surprise.includes('[UNEXPECTED'), 'a new gap must be marked as new')
  assert(surprise.includes('Treat as an alarm'), 'a new gap IS the alarm')
})

check('the clean line counts the list, it does not hardcode "seven"', () => {
  assert(summarise([inv('I1', 'PASS'), inv('I2', 'PASS'), inv('I3', 'PASS')]).includes('All 3 invariants hold'),
    'the clean line must count the list it was given')
  assert(summarise(Array.from({ length: 8 }, (_, i) => inv(`I${i}`, 'PASS'))).includes('All 8 invariants hold'),
    'the count must follow the list length')
  assert(!summarise([inv('I1', 'FAIL')]).includes('invariants hold'), 'a failing run must not print the clean line')
})

// ═══════════════════════════════════════════════════════ I1: files vs rows

console.log('\n  — I1: assets/*.md vs content_assets —')

const X_DRAFT = [
  '---', 'batch: x-week-01', 'queue_row: X-01', 'week_of: 2026-08-03',
  'platform: x', 'format: text-post', 'canonical_asset: myth-of-normal-range',
  'preflight: green', '---', '', '## Monday, marker fact', '> some post copy',
].join('\n')

check('a file with no row is a violation', () => {
  const r = inv1(store(), ctx({ assetFiles: [{ path: 'assets/2026-07-31-orphan.md', text: '---\nslug: orphan\n---' }] }))
  assert(r.verdict === 'FAIL', 'a file with no row must fail')
  assert(violationsOf(r).some((v) => /has no content_assets row/.test(v.message)), 'and say which direction')
})

// The draft as it stands once the linkage fix has been applied: each day heading names its slug.
const X_DRAFT_LINKED = [
  '---', 'batch: x-week-01', 'queue_row: X-01', 'week_of: 2026-08-03',
  'platform: x', 'format: text-post', 'canonical_asset: myth-of-normal-range',
  'preflight: green', '---', '',
  '## Monday, marker fact', '`slug: x-w01-1-range-is-260-percent`', '> some post copy', '',
  '## Tuesday', '`slug: x-w01-2-within-range-answers-one-question`', '> more copy',
].join('\n')

function xBatchStore(slug: string): Store {
  return store({
    content_assets: tableOk([asset({ id: 'ax', slug, canonical_article_id: 'art1' })]),
    content_renditions: tableOk([rend({ id: 'rx', asset_id: 'ax', platform: 'x', format: 'text-post' })]),
    blog_articles: tableOk([article({ id: 'art1', slug: 'myth-of-normal-range' })]),
  })
}

check('THE UNCLEARABLE FINDING: a draft that NAMES the slug is LINKED, so I1 can go green', () => {
  // The batch branch used to hardcode "names no slug anywhere" and never evaluate it. Once a
  // human did exactly what the fix text instructed, the finding still could not clear, so I1
  // could never pass on any batch-registered channel. This is the direction that had no test.
  const r = inv1(xBatchStore('x-w01-1-range-is-260-percent'),
    ctx({ draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: X_DRAFT_LINKED }] }))
  assert(violationsOf(r).length === 0, `a properly linked batch row must not be a violation: ${violationsOf(r).map((v) => v.message).join(' | ')}`)
  assert(r.verdict === 'PASS', `I1 must be able to reach PASS, got ${r.verdict}`)
  const n = notesOf(r)
  assert(n.length === 1 && /LINKED/.test(n[0].message), `expected a LINKED note, got ${JSON.stringify(n)}`)
  assert(/names this slug/.test(n[0].message), 'the note must state the evaluated fact')
})

check('a draft matching the batch but NOT naming the slug is still a violation', () => {
  const r = inv1(xBatchStore('x-w01-1-range-is-260-percent'),
    ctx({ draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: X_DRAFT }] }))
  assert(r.verdict === 'FAIL' && violationsOf(r).length === 1, 'an unlinked batch row must still fail')
  assert(/does NOT name this slug/.test(violationsOf(r)[0].message), 'and must say so as an evaluated fact')
})

check('the two batch messages differ, so a future edit cannot collapse them', () => {
  const linked = notesOf(inv1(xBatchStore('x-w01-1-range-is-260-percent'),
    ctx({ draftFiles: [{ path: 'd.md', text: X_DRAFT_LINKED }] })))[0].message
  const unlinked = violationsOf(inv1(xBatchStore('x-w01-1-range-is-260-percent'),
    ctx({ draftFiles: [{ path: 'd.md', text: X_DRAFT }] })))[0].message
  assert(linked !== unlinked, 'the linked and unlinked cases must not share a message')
  assert(/LINKED/.test(linked) && !/UNLINKED/.test(linked), 'the linked message must not read as unlinked')
  assert(/UNLINKED/.test(unlinked), 'the unlinked message must still say UNLINKED')
})

check('the slug must be in the MATCHED draft, not merely somewhere in the workspace', () => {
  // A workspace-wide sweep would call this linked because some unrelated doc mentions the slug.
  const r = inv1(xBatchStore('x-w01-1-range-is-260-percent'), ctx({
    draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: X_DRAFT }],
    workspaceFiles: [{ path: 'notes/somewhere-else.md', text: 'x-w01-1-range-is-260-percent was discussed' }],
  }))
  assert(r.verdict === 'FAIL', 'a mention elsewhere must not count as linkage')
  assert(/does NOT name this slug/.test(violationsOf(r)[0].message), 'and the message must stay the unlinked one')
})

check('THE FALSE MESSAGE: a batch-draft row is described as UNLINKED, not as DB-only', () => {
  // The draft names its posts by batch/queue_row and never by slug, so slug matching finds
  // nothing. The old code then claimed "exists only in the database", which was false seven
  // times over: the copy is demonstrably in that draft.
  const s = store({
    content_assets: tableOk([asset({ id: 'ax', slug: 'x-w01-1-range-is-260-percent', canonical_article_id: 'art1' })]),
    content_renditions: tableOk([rend({ id: 'rx', asset_id: 'ax', platform: 'x', format: 'text-post' })]),
    blog_articles: tableOk([article({ id: 'art1', slug: 'myth-of-normal-range' })]),
  })
  const r = inv1(s, ctx({ draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: X_DRAFT }] }))
  const v = violationsOf(r)
  assert(v.length === 1, `expected one violation, got ${v.length}`)
  assert(/UNLINKED/.test(v[0].message), `must be described as a linkage defect: ${v[0].message}`)
  assert(!/only in the database/.test(v[0].message), 'must NOT claim the copy does not exist')
  assert(/x-week-2026-08-03/.test(v[0].message) && /x-week-01/.test(v[0].message),
    'must name the draft file and its batch key so a human can go and look')
})

check('a row with no file and no matching draft IS reported as database-only', () => {
  const s = store({ content_assets: tableOk([asset({ slug: 'substack-signs-of-stress-in-men' })]) })
  const r = inv1(s, ctx({ draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: X_DRAFT }] }))
  assert(/only in the database/.test(violationsOf(r)[0].message),
    'a genuinely absent artefact keeps the strong wording')
})

check('the draft match requires the canonical article, not just the surface', () => {
  const s = store({
    content_assets: tableOk([asset({ id: 'ax', slug: 'unrelated-x-post', canonical_article_id: 'artZ' })]),
    content_renditions: tableOk([rend({ asset_id: 'ax', platform: 'x', format: 'text-post' })]),
    blog_articles: tableOk([article({ id: 'artZ', slug: 'a-different-article' })]),
  })
  const r = inv1(s, ctx({ draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: X_DRAFT }] }))
  assert(/only in the database/.test(violationsOf(r)[0].message),
    'a same-platform post from another article must not be credited to this batch')
})

// ── the Substack republish exemption (Keith, 2026-08-01) ─────────────────────
// Substack is a republish surface, so a verbatim republish has no craft of its own and owes
// no assets/*.md. Tightly scoped: it must not become a way for any row to escape the check.

function substackStore(o: { canon?: string | null; platforms?: string[] } = {}): Store {
  const { canon = 'art1', platforms = ['substack'] } = o
  return store({
    content_assets: tableOk([asset({ id: 'as1', slug: 'substack-signs-of-stress-in-men', canonical_article_id: canon })]),
    content_renditions: tableOk(platforms.map((p, i) =>
      rend({ id: `r${i}`, asset_id: 'as1', platform: p, format: p === 'substack' ? 'newsletter' : 'text-post' }))),
    blog_articles: tableOk([article({ id: 'art1', slug: 'signs-of-stress-in-men' })]),
  })
}

check('EXEMPT: an all-substack row with a resolving canonical article is a note, and I1 PASSes', () => {
  const r = inv1(substackStore(), ctx())
  assert(violationsOf(r).length === 0, `a republish owes no file: ${violationsOf(r).map((v) => v.message).join(' | ')}`)
  assert(r.verdict === 'PASS', `I1 must reach PASS, got ${r.verdict}`)
  const n = notesOf(r)
  assert(n.length === 1 && /none is owed/.test(n[0].message), `expected an exemption note: ${JSON.stringify(n)}`)
  assert(/"signs-of-stress-in-men"/.test(n[0].message),
    'the canonical article must be NAMED so a reader can check the claim, not just asserted')
})

check('NOT EXEMPT: a substack rendition plus a non-substack one still fails', () => {
  const r = inv1(substackStore({ platforms: ['substack', 'linkedin'] }), ctx())
  assert(r.verdict === 'FAIL', 'a row that also ships elsewhere has craft of its own')
  assert(violationsOf(r).length === 1, 'and must report as a violation')
})

check('NOT EXEMPT: no canonical article means it is a republish of nothing', () => {
  assert(inv1(substackStore({ canon: null }), ctx()).verdict === 'FAIL', 'a null canonical must not exempt')
  assert(inv1(substackStore({ canon: 'does-not-resolve' }), ctx()).verdict === 'FAIL',
    'a canonical id that does not resolve to an article must not exempt')
})

check('NOT EXEMPT: a row with no renditions at all still fails', () => {
  const r = inv1(substackStore({ platforms: [] }), ctx())
  assert(r.verdict === 'FAIL', 'a row with nothing published is not a republish of anything')
})

check('THE DEGRADED GUARD: the exemption does not fire when its evidence is missing', () => {
  // An exemption that triggers when blog_articles or content_renditions is unread is a hole
  // that opens exactly when the system is unhealthy.
  for (const [label, s] of [
    ['blog_articles', { ...substackStore(), blog_articles: tableFailed<ArticleRow>('blog_articles: boom') }],
    ['content_renditions', { ...substackStore(), content_renditions: tableFailed<RenditionRow>('content_renditions: boom') }],
  ] as Array<[string, Store]>) {
    const r = inv1(s, ctx())
    assert(r.verdict === 'FAIL', `${label} unavailable must NOT exempt the row`)
    assert(/exemption was NOT ATTEMPTED/.test(violationsOf(r)[0].message),
      `${label}: the message must say the check was not attempted, got: ${violationsOf(r)[0].message}`)
  }
})

check('the control case never reaches the exemption: a republish WITH a file is simply fine', () => {
  // substack-welcome-normal-on-paper is net-new founder copy and does have a file.
  const s = substackStore()
  const r = inv1(s, ctx({ assetFiles: [{ path: 'assets/x.md', text: '---\nslug: substack-signs-of-stress-in-men\n---' }] }))
  assert(r.verdict === 'PASS' && r.findings.length === 0, 'a row with a file needs no exemption and no note')
})

// ── the Phase-1 mirror must never count as evidence ──────────────────────────
// content-sync writes database state back into asset files inside a marked block. CONTEXT.md is
// explicit that the mirror is never an input, and a detector that read it would be letting a row
// prove its own linkage with a copy of itself.

const MIRROR = (body: string) => [
  '<!-- BEGIN GENERATED STATE. Written by content-sync from the database. Do not edit: your changes will be overwritten and they change nothing. -->',
  '_Synced 2026-08-01T21:26:37.356Z from content_assets / content_renditions._',
  body,
  '<!-- END GENERATED STATE -->',
].join('\n')

check('stripGeneratedState removes the whole block, and an unterminated one to end of file', () => {
  const t = `before\n${MIRROR('| status | scripted |')}\nafter`
  assert(!stripGeneratedState(t).includes('scripted'), 'the mirror must be blanked')
  assert(/before/.test(stripGeneratedState(t)) && /after/.test(stripGeneratedState(t)), 'the real file must survive')
  const damaged = 'before\n<!-- BEGIN GENERATED STATE -->\n| status | scripted |\n'
  assert(!stripGeneratedState(damaged).includes('scripted'),
    'a block with no END marker is still a mirror and must not be read as repo evidence')
})

check('THE MIRROR IS NOT EVIDENCE: a slug only in a generated block does not link a batch row', () => {
  const drafted = `${X_DRAFT}\n\n${MIRROR('| slug | x-w01-1-range-is-260-percent |')}`
  const r = inv1(xBatchStore('x-w01-1-range-is-260-percent'),
    ctx({ draftFiles: [{ path: 'drafts/x-week-2026-08-03.md', text: drafted }] }))
  assert(r.verdict === 'FAIL', 'a database mirror must not satisfy the human-linkage question')
  assert(/does NOT name this slug/.test(violationsOf(r)[0].message), 'and the message must stay the unlinked one')
})

check('THE MIRROR IS NOT EVIDENCE: a slug only in a generated block is still database-only', () => {
  const s = store({ content_assets: tableOk([asset({ slug: 'ghost-row' })]) })
  const r = inv1(s, ctx({ workspaceFiles: [{ path: 'assets/other.md', text: MIRROR('| canonical | ghost-row |') }] }))
  const m = violationsOf(r)[0].message
  assert(/appears in NO file/.test(m), `a mirror of the row is not a mention of it: ${m}`)
  const linked = inv1(s, ctx({ workspaceFiles: [{ path: 'notes/real.md', text: 'ghost-row is discussed here' }] }))
  assert(/mentioned only in notes\/real\.md/.test(violationsOf(linked)[0].message),
    'and a genuine human mention must still be reported, or the exclusion has gone too far')
})

check('two files declaring one slug is its own violation, not a silent overwrite', () => {
  const r = inv1(store(), ctx({ assetFiles: [
    { path: 'assets/2026-07-01-dupe.md', text: '---\nslug: a-slug\n---' },
    { path: 'assets/2026-07-02-dupe.md', text: '---\nslug: a-slug\n---' },
  ] }))
  const v = violationsOf(r).filter((x) => /declare slug/.test(x.message))
  assert(v.length === 1, 'a duplicate slug must be reported')
  assert(/2026-07-01-dupe/.test(v[0].message) && /2026-07-02-dupe/.test(v[0].message), 'both files must be named')
})

// ═══════════════════════════════════════════════════ I2: enum vocabularies

console.log('\n  — I2: enum vocabulary agreement —')

// Resolved the same way content-doctor resolves REPO_ROOT, from frontend/, so the two agree.
const SCAN_JS_PATH = path.resolve(process.cwd(), '../../..', '.claude/skills/content-status/scan.js')
const REAL_SCAN_JS = fs.existsSync(SCAN_JS_PATH) ? fs.readFileSync(SCAN_JS_PATH, 'utf-8') : null

check('extractLiteral survives `]` inside a string, a regex class and a comment', () => {
  // All three shapes are live in scan.js. Each one closes the array early for a naive scanner,
  // and the result is a SHORTER vocabulary that then invents violations.
  const src = [
    "const HARD = [",
    "  { re: /\\b(1[5-9]|[2-9]\\d)\\s*%\\s*off\\b/i, alt: 'x]y' }, // note] here",
    "  { re: /c/ },",
    "];",
    "const PLATFORMS = ['a', 'b'];",
  ].join('\n')
  const lit = extractLiteral(src, 'HARD')
  assert(lit !== null, 'the scan must not give up on a real HARD table')
  assert(lit!.endsWith(']') && lit!.includes('{ re: /c/ }'), `truncated early: ${lit}`)
  const naive = /const\s+HARD\s*=\s*\[([^\]]*)\]/.exec(src)
  assert(naive && naive[0].length < lit!.length, 'the naive regex must be demonstrably shorter (that is the bug)')
  assert(extractLiteral(src, 'PLATFORMS') === "['a', 'b']", 'a simple array still parses')
})

check('THE SHADOW DECLARATION: a commented-out const must not shadow the live one', () => {
  // The doctor's own remediation text tells a human to go and edit PLATFORMS in scan.js.
  // Leaving the old line commented out above the new one is completely ordinary, and a raw
  // declaration search would then return the STALE literal and invent violations from it.
  const lineCommented = [
    "// const PLATFORMS = ['instagram', 'youtube'];",
    "const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'substack'];",
  ].join('\n')
  const v1 = parseScannerVocab(lineCommented, ['PLATFORMS']).vocab.PLATFORMS
  assert(v1.length === 6 && v1.includes('substack'), `read the stale declaration: ${JSON.stringify(v1)}`)

  const blockCommented = [
    "/* const PLATFORMS = ['instagram', 'youtube'];",
    " still commented */",
    "const PLATFORMS = ['instagram', 'substack'];",
  ].join('\n')
  const v2 = parseScannerVocab(blockCommented, ['PLATFORMS']).vocab.PLATFORMS
  assert(v2.join(',') === 'instagram,substack', `block comment shadowed the live one: ${JSON.stringify(v2)}`)
})

check('a shadowed declaration would have produced a WRONG violation; now it does not', () => {
  // End to end: the DB holds substack, the live scan.js line already allows it, and only the
  // commented-out corpse still rejects it. I2 must read the live line and stay silent.
  const src = [
    "// const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin'];",
    "const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'substack'];",
    "const FORMATS = ['reel', 'short', 'long-form', 'link-post', 'text-post'];",
    "const THUMBS = ['9x16', '1280x720', '1200x630', 'none'];",
    "const REND_ORDER = { 'to-produce': 0, 'thumbnail-done': 1, scheduled: 2, published: 3, measured: 4 };",
    "const STATUS_ORDER = { idea: 0, hooked: 1, scripted: 2, recorded: 3, edited: 4, approved: 5, done: 6 };",
    "const CONTENT_TYPES = ['educational', 'personal-story', 'proof-result', 'objection-comparison'];",
    "const FUNNEL_STAGES = ['TOFU', 'MOFU', 'BOFU', 'RETENTION'];",
  ].join('\n')
  const s = store({ content_renditions: tableOk([rend({ platform: 'substack' })]) })
  const r = inv2(s, ctx({ scannerSrc: src }))
  assert(!violationsOf(r).some((v) => /substack/.test(v.message)),
    `invented a violation from a commented-out declaration: ${violationsOf(r).map((v) => v.message).join(' | ')}`)
})

check('stripComments blanks comments but preserves length, newlines and strings', () => {
  const src = "const A = 'http://x//y'; // trailing\nconst B = 1;"
  const out = stripComments(src)
  assert(out.length === src.length, 'offsets must be preserved')
  assert(out.includes("'http://x//y'"), 'a // inside a string is not a comment')
  assert(!out.includes('trailing'), 'the real comment must be blanked')
  assert(out.split('\n').length === src.split('\n').length, 'newlines must survive')
})

check('extractLiteral returns null rather than a partial literal, so the caller can go UNCHECKED', () => {
  assert(extractLiteral("const PLATFORMS = ['a', 'b';", 'PLATFORMS') === null, 'an unclosed array must be null')
  assert(extractLiteral('const OTHER = 5;', 'PLATFORMS') === null, 'an absent name must be null')
  assert(extractLiteral("const PLATFORMS = 'not a literal';", 'PLATFORMS') === null, 'a non-literal must be null')
})

check('parseScannerVocab reads the REAL scan.js, all seven vocabularies', () => {
  // Deliberately does NOT pin the list lengths: scan.js is edited by humans acting on this
  // doctor's own remediation text (its PLATFORMS list was widened from 5 to 12 on 2026-08-01),
  // so a length assertion tests the repo's current state rather than the parser.
  assert(REAL_SCAN_JS, `scan.js not found at ${SCAN_JS_PATH}`)
  const { vocab, missing } = parseScannerVocab(REAL_SCAN_JS!, VOCAB_MAP.map(([n]) => n))
  assert(missing.length === 0, `unparsed vocabularies: ${missing.join(', ')}`)
  for (const [name] of VOCAB_MAP) assert(vocab[name].length >= 4, `${name} parsed suspiciously short: ${JSON.stringify(vocab[name])}`)
  assert(vocab.PLATFORMS.includes('linkedin') && vocab.PLATFORMS.includes('instagram'), 'the stable core must parse')
  assert(vocab.REND_ORDER.includes('to-produce') && vocab.REND_ORDER.includes('thumbnail-done'),
    'quoted hyphenated object keys must parse')
  assert(vocab.STATUS_ORDER.includes('scripted') && vocab.THUMBS.includes('none'), 'the rest must parse')
})

/** A complete but deliberately NARROW scanner source, for testing the divergence direction. */
const NARROW_SCANNER = [
  "const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin'];",
  "const FORMATS = ['reel', 'short', 'long-form', 'link-post', 'text-post'];",
  "const THUMBS = ['9x16', '1280x720', '1200x630', 'none'];",
  "const REND_ORDER = { 'to-produce': 0, 'thumbnail-done': 1, scheduled: 2, published: 3, measured: 4 };",
  "const STATUS_ORDER = { idea: 0, hooked: 1, scripted: 2, recorded: 3, edited: 4, approved: 5, done: 6 };",
  "const CONTENT_TYPES = ['educational', 'personal-story', 'proof-result', 'objection-comparison'];",
  "const FUNNEL_STAGES = ['TOFU', 'MOFU', 'BOFU', 'RETENTION'];",
].join('\n')

check('a PARTIAL vocabulary makes I2 UNCHECKED, not silently narrowed', () => {
  // A vocabulary that failed to parse looks shorter than it is and invents violations.
  const s = store({ content_renditions: tableOk([rend({ platform: 'substack' })]) })
  const r = inv2(s, ctx({ scannerSrc: "const PLATFORMS = ['instagram'];" }))
  assert(r.verdict === 'UNCHECKED', `a partial parse must not produce violations, got ${r.verdict}`)
  assert(/missing or unparseable/.test(r.reason ?? ''), `and must say so: ${r.reason}`)
})

check('a value the DB holds and the scanner rejects is a real violation', () => {
  // Against a fixed narrow fixture, not the live scan.js, so this tests the comparison rather
  // than whatever state the repo's scanner happens to be in today.
  const s = store({ content_renditions: tableOk([rend({ platform: 'substack', format: 'newsletter' })]) })
  const msgs = violationsOf(inv2(s, ctx({ scannerSrc: NARROW_SCANNER }))).map((v) => v.message).join(' | ')
  assert(/platform = "substack"/.test(msgs), `substack divergence must be caught: ${msgs}`)
  assert(/format = "newsletter"/.test(msgs), `newsletter divergence must be caught: ${msgs}`)
})

check('a scanner vocabulary WIDER than the DB produces no violation', () => {
  // The state scan.js was moved to on 2026-08-01. Widening must clear the finding, not flip it.
  const wide = NARROW_SCANNER
    .replace("'linkedin'];", "'linkedin', 'substack', 'x'];")
    .replace("'text-post'];", "'text-post', 'newsletter'];")
  const s = store({ content_renditions: tableOk([rend({ platform: 'substack', format: 'newsletter' })]) })
  assert(violationsOf(inv2(s, ctx({ scannerSrc: wide }))).length === 0,
    'a scanner that accepts everything the DB holds must be silent')
})

check('a NULL thumb_spec is a violation (the plan asks for this by name)', () => {
  const s = store({ content_renditions: tableOk([rend({ thumb_spec: null })]) })
  assert(violationsOf(inv2(s, ctx({ scannerSrc: REAL_SCAN_JS! }))).some((v) => /thumb_spec is NULL/.test(v.message)),
    'part 2c must fire')
})

check('an unprovable frontmatter value is UNCHECKED, and the reason blames the CLIENT', () => {
  const c = ctx({ scannerSrc: REAL_SCAN_JS!, assetFiles: [{ path: 'assets/x.md', text: '---\nslug: x\ncta: retest\n---' }] })
  const r = inv2(store(), c)
  assert(r.verdict === 'UNCHECKED', `an unproven value must not read as clean, got ${r.verdict}`)
  assert(/pg_constraint/.test(r.reason ?? ''), 'the reason must name the actual client limitation')
  assert(/THIS CLIENT/.test(r.reason ?? '') && /another route/.test(r.reason ?? ''),
    'and must say the fact IS obtainable elsewhere, rather than calling it unknowable')
})

// ── what Phase 1 removed from I2, and what it did not ────────────────────────

check('I2 no longer reads a STATE key out of frontmatter: I9 owns that now', () => {
  // Those keys are gone from every asset file, so 2a has no subject. If one comes back it is a
  // dual store, not an enum question, and it must be reported as one. This test pins the handoff:
  // I2 stays silent about the value, I9 fails the file.
  const rogue = [
    '---', 'slug: x', 'cta: quiz', 'status: not-a-real-status', 'preflight: nonsense',
    'renditions:', '  - platform: linkedin', '    format: text-post', '    status: invented',
    '    publisher: invented-publisher', '---',
  ].join('\n')
  const c = ctx({ scannerSrc: REAL_SCAN_JS!, assetFiles: [{ path: 'assets/x.md', text: rogue }] })
  const r = inv2(store(), c)
  const said = JSON.stringify(r)
  for (const v of ['not-a-real-status', 'nonsense', 'invented', 'invented-publisher']) {
    assert(!said.includes(v), `I2 must not report the state value "${v}": it is no longer its subject`)
  }
  assert(r.verdict === 'PASS', `the identity enums are all live, so I2 is measured and clean, got ${r.verdict}`)
  assert(inv9(c).verdict === 'FAIL', 'and the same file must fail I9, or the rule went unenforced by both')
})

check('I2 still compares the identity enums, and says how many it compared', () => {
  const c = ctx({
    scannerSrc: REAL_SCAN_JS!,
    assetFiles: [{ path: 'assets/x.md', text: ['---', 'slug: x', 'content_type: educational',
      'funnel_stage: TOFU', 'awareness: problem-aware', 'cta: quiz', 'renditions:',
      '  - platform: linkedin', '    format: text-post', '    thumb: none', '---'].join('\n') }],
  })
  const r = inv2(store(), c)
  assert(r.verdict === 'PASS', `every value is held by a live row, so this is a real measurement: ${r.reason}`)
  assert(r.reads.some((x) => /identity enum values compared: 7/.test(x)),
    `the denominator must be on the report: ${JSON.stringify(r.reads)}`)
  const bad = { ...c, assetFiles: [{ path: 'assets/x.md', text: '---\nslug: x\ncta: made-up-cta\n---' }] }
  assert(inv2(store(), bad).verdict === 'UNCHECKED', 'an identity value no live row holds is still unprovable')
})

check('I2 with NOTHING to compare is UNCHECKED, not a pass carried by 2b and 2c alone', () => {
  // The shape Phase 1 makes possible: strip the wrong keys, or point the doctor at an empty
  // assets/, and 2a would measure nothing while the other two halves carried the verdict.
  const r = inv2(store(), ctx({ scannerSrc: REAL_SCAN_JS!, assetFiles: [{ path: 'assets/x.md', text: '---\nslug: x\ntitle: t\n---' }] }))
  assert(r.verdict === 'UNCHECKED', `got ${r.verdict}: an empty comparison must not read as a clean one`)
  assert(/compared NOTHING/.test(r.reason ?? ''), `and must say so: ${r.reason}`)
  assert(inv2(store(), ctx({ scannerSrc: REAL_SCAN_JS! })).verdict === 'UNCHECKED', 'no files at all is the same case')
})

check('the title and scope no longer claim more than the file can support', () => {
  const r = inv2(store(), ctx({ scannerSrc: REAL_SCAN_JS! }))
  assert(/IDENTITY/.test(r.title), 'the title must say which half of the split it reads')
  for (const k of ['status', 'preflight', 'publisher', 'approved_by', 'drive']) {
    assert(!(k in FLAT_ENUMS) && !(k in REND_ENUMS), `${k} is database-owned and must not be in I2's scope`)
  }
})

// ════════════════════════════════════════════════════════ I3, I4, I5, I8

console.log('\n  — I3 / I4 / I5 / I8 —')

// I3 fixtures: a store with one Metricool id and one out-of-scope id, and probe shorthands.
const mcStore = (...ids: string[]) => store({ content_renditions: tableOk([
  ...ids.map((pid, n) => rend({ id: `rm${n}`, publisher: 'metricool', external_post_id: pid })),
  rend({ id: 'ru', publisher: 'unipile', external_post_id: '748791694' }),
]) })
const probeOf = (m: Record<string, PostState>): MetricoolProbe =>
  ({ probed: true, posts: new Map(Object.entries(m)) })

check('I3 PASSES only when every Metricool id actually resolved', () => {
  const r = inv3(mcStore('356261849'), probeOf({ '356261849': { state: 'found' } }))
  assert(r.verdict === 'PASS', `got ${r.verdict}: a resolved id is a real measurement`)
  assert(r.reads.some((x) => /Metricool-published: 1/.test(x)), 'the denominator must state how many ids were in scope')
  const n = notesOf(r).map((x) => x.message).join(' | ')
  assert(/OUT OF SCOPE.*748791694/.test(n), 'a non-Metricool id must still be excluded explicitly')
})

check('I3 FAILS when Metricool no longer has an id we recorded', () => {
  // The live case this exists for: a LinkedIn post id changed three times on 2026-07-31
  // (356516876 -> 356519886 -> 356521803) and staled both stores with no alarm.
  const r = inv3(mcStore('356516876'), probeOf({ '356516876': { state: 'missing' } }))
  assert(r.verdict === 'FAIL', `got ${r.verdict}: a missing post is drift, which is the whole point`)
  assert(violationsOf(r).length === 1, 'exactly one violation expected')
  assert(/356516876/.test(violationsOf(r)[0].message), 'the violation must name the id')
})

check('I3 with NO credential is UNCHECKED-EXPECTED: a documented gap, never an alarm', () => {
  const r = inv3(mcStore('356261849'),
    { probed: false, credentialAbsent: true, why: 'no Metricool credential is loaded: METRICOOL_USER_TOKEN is not set.' })
  assert(r.verdict === 'UNCHECKED' && r.expected, 'an absent credential is expected, so the nightly run must not alarm')
  assert(/METRICOOL_/.test(r.reason ?? ''), 'the missing credential must be named')
  assert(/UNRESOLVED.*356261849/.test(notesOf(r).map((x) => x.message).join(' | ')), 'the unresolved id must still be listed')
})

check('I3 with a credential but no answer is UNCHECKED-UNEXPECTED: that IS the alarm', () => {
  // The distinction that matters. "We never asked" is a known gap; "we asked and got nothing"
  // is indistinguishable from a silent gate failure and must be loud.
  const r = inv3(mcStore('356261849'),
    { probed: false, credentialAbsent: false, why: 'Metricool answered HTTP 503' })
  assert(r.verdict === 'UNCHECKED', `got ${r.verdict}`)
  assert(r.expected === false, 'a check that normally runs and did not must be treated as an alarm')
})

check('I3 never reports an unresolvable id as either found or missing', () => {
  const r = inv3(mcStore('356261849'), probeOf({ '356261849': { state: 'unresolvable', why: 'HTTP 500' } }))
  assert(r.verdict === 'UNCHECKED' && !r.expected, `got ${r.verdict}/${r.expected}`)
  assert(violationsOf(r).length === 0, 'an unanswered question is not evidence of drift')
  assert(/HTTP 500/.test(r.reason ?? ''), 'the reason must carry why it could not be resolved')
})

check('I3 reports an id the probe never answered as unresolvable, not as found', () => {
  // A silently absent map entry is the classic "unperformed check reads as a pass" shape.
  const r = inv3(mcStore('356261849'), probeOf({}))
  assert(r.verdict === 'UNCHECKED' && !r.expected, `got ${r.verdict}: a missing answer is not an answer`)
})

check('I3 lets a definite violation outrank an unresolvable one', () => {
  const r = inv3(mcStore('111', '222'),
    probeOf({ '111': { state: 'missing' }, '222': { state: 'unresolvable', why: 'timeout' } }))
  assert(r.verdict === 'FAIL', `got ${r.verdict}: the actionable failure is the louder signal`)
  assert(notesOf(r).some((f) => /timeout/.test(f.message)), 'the unresolvable one must still be visible')
})

check('I3 with zero Metricool ids is UNCHECKED, not a vacuous PASS', () => {
  const s = store({ content_renditions: tableOk([rend({ publisher: 'unipile', external_post_id: '748791694' })]) })
  const r = inv3(s, probeOf({}))
  assert(r.verdict === 'UNCHECKED' && r.expected, `got ${r.verdict}: nothing to compare is not a pass`)
  assert(/nothing to resolve/.test(r.reason ?? ''), 'the reason must say there was nothing to measure')
})

check('metricoolCreds names exactly which variables are absent, and asserts nothing else', () => {
  const full = metricoolCreds({ METRICOOL_USER_TOKEN: 't', METRICOOL_USER_ID: '1', METRICOOL_BLOG_ID: '2' })
  assert(full.ok && full.missing.length === 0, 'all three present must be ok')
  const partial = metricoolCreds({ METRICOOL_USER_TOKEN: 't' })
  assert(!partial.ok, 'a partial credential set is not usable')
  assert(partial.missing.join(',') === 'METRICOOL_USER_ID,METRICOOL_BLOG_ID', `got ${partial.missing.join(',')}`)
  assert(!metricoolCreds({ METRICOOL_USER_TOKEN: '  ' }).ok, 'whitespace is not a credential')
})

checkAsync('metricoolFetcher maps 200/404/500/throw onto found/missing/unresolvable', async () => {
  const creds = metricoolCreds({ METRICOOL_USER_TOKEN: 't', METRICOOL_USER_ID: '1', METRICOOL_BLOG_ID: '2' })
  const withStatus = (status: number) => metricoolFetcher(creds, (async () => ({ status })) as unknown as typeof fetch)
  assert((await withStatus(200)('1')).state === 'found', '200 must be found')
  assert((await withStatus(404)('1')).state === 'missing', '404 must be missing')
  const five = await withStatus(500)('1')
  assert(five.state === 'unresolvable', '500 must NOT be read as missing: that would be a false alarm on a gate')
  const threw = await metricoolFetcher(creds, (() => { throw new Error('ECONNRESET') }) as unknown as typeof fetch)('1')
  assert(threw.state === 'unresolvable' && /ECONNRESET/.test((threw as { why: string }).why), 'a network failure must be unresolvable and say why')
})

checkAsync('metricoolFetcher sends all three credentials, url-encoded', async () => {
  const creds = metricoolCreds({ METRICOOL_USER_TOKEN: 'tok/en', METRICOOL_USER_ID: '5106073', METRICOOL_BLOG_ID: '6633045' })
  let seen = ''
  await metricoolFetcher(creds, (async (u: string) => { seen = u; return { status: 200 } }) as unknown as typeof fetch)('356261849')
  assert(/\/scheduler\/posts\/356261849\?/.test(seen), `the id must be in the path: ${seen}`)
  for (const q of ['blogId=6633045', 'userId=5106073', 'userToken=tok%2Fen']) {
    assert(seen.includes(q), `missing or unencoded ${q} in ${seen}`)
  }
})

checkAsync('probeMetricool asks once per unique id', async () => {
  let calls = 0
  const posts = await probeMetricool(['a', 'b', 'a'], async () => { calls++; return { state: 'found' } })
  assert(calls === 2, `expected 2 calls for 2 unique ids, got ${calls}`)
  assert(posts.size === 2, `expected 2 answers, got ${posts.size}`)
})

check('metricoolIds returns only Metricool ids, deduped and trimmed', () => {
  const s = store({ content_renditions: tableOk([
    rend({ id: 'r1', publisher: 'metricool', external_post_id: ' 111 ' }),
    rend({ id: 'r2', publisher: 'metricool', external_post_id: '111' }),
    rend({ id: 'r3', publisher: 'metricool', external_post_id: '  ' }),
    rend({ id: 'r4', publisher: 'unipile', external_post_id: '999' }),
    rend({ id: 'r5', publisher: 'metricool', external_post_id: null }),
  ]) })
  assert(metricoolIds(s).join(',') === '111', `got ${JSON.stringify(metricoolIds(s))}`)
})

check('metricoolIds is empty when nothing is Metricool-published, so no call is owed', () => {
  assert(metricoolIds(store({ content_renditions: tableOk([rend({ publisher: 'unipile', external_post_id: '9' })]) })).length === 0,
    'an empty id list is what stops I3 making a pointless network call')
})

check('I3 stays in the list: it is never dropped for being unmeasurable', () => {
  const ids = runInvariants(store(), ctx(), new Date()).map((i) => i.id)
  assert(ids.includes('I3'), 'I3 must always appear; its visibility is the point')
  assert(ids.length === 10, `expected 10 invariants, got ${ids.length}: ${ids.join(',')}`)
  assert(ids.includes('I9'), 'I9 must be wired into the run, not merely exported')
  assert(ids.includes('I10'), 'I10 must be wired into the run, not merely exported')
})

// ── I10, forward coverage. The only invariant that is not about stores agreeing, added after
// 2026-08-05, when Facebook had published nothing for a week and all nine others passed.

const NOW10 = new Date('2026-08-05T00:00:00Z')
const inWindow = '2026-08-07T10:00:00+00:00'
const outOfWindow = '2026-09-20T10:00:00+00:00'

check('I10 passes when a lane-1 channel has a post queued inside the window', () => {
  const i = inv10(store({ content_renditions: tableOk([
    rend({ status: 'scheduled', scheduled_for: inWindow }),
  ]) }), NOW10)
  assert(i.verdict === 'PASS', `expected PASS, got ${i.verdict}`)
})

// THE 2026-08-05 CASE. Every other invariant passed while this was true.
check('I10 FAILS an empty lane-1 channel, which no other invariant can see', () => {
  const i = inv10(store({ content_renditions: tableOk([
    rend({ status: 'to-produce', scheduled_for: null }),
  ]) }), NOW10)
  assert(i.verdict === 'FAIL', `an empty channel must be a violation, got ${i.verdict}`)
  assert(violationsOf(i).length === 1, `expected 1 violation, got ${violationsOf(i).length}`)
  assert(/linkedin\/text-post/.test(violationsOf(i)[0].message), 'the violation must name the channel')
})

check('I10 does not count a post scheduled beyond the window', () => {
  const i = inv10(store({ content_renditions: tableOk([
    rend({ status: 'scheduled', scheduled_for: outOfWindow }),
  ]) }), NOW10)
  assert(i.verdict === 'FAIL', 'a post a month out does not cover this week')
})

check('I10 does not count an unscheduled rendition, however ready it looks', () => {
  const i = inv10(store({ content_renditions: tableOk([
    rend({ status: 'thumbnail-done', scheduled_for: inWindow }),
  ]) }), NOW10)
  assert(i.verdict === 'FAIL', 'only scheduled-or-later counts as queued')
})

check('I10 accepts a LIVE pause as an answer, and says so in a note rather than silently', () => {
  const i = inv10(store({
    content_channels: tableOk([channel({ coverage_paused_until: '2026-09-05', coverage_pause_reason: 'token expired' })]),
    content_renditions: tableOk([rend({ status: 'to-produce', scheduled_for: null })]),
  }), NOW10)
  assert(i.verdict === 'PASS', `a reasoned pause is an answer, got ${i.verdict}`)
  assert(/ON THE RECORD/.test(notesOf(i)[0].message), 'the pause must be visible in the report')
  assert(/token expired/.test(notesOf(i)[0].message), 'the recorded reason must be shown')
})

// The whole point of the expiry: a pause that cannot lapse is how a gap becomes invisible again.
check('I10 FAILS an EXPIRED pause and names the reason that ran out', () => {
  const i = inv10(store({
    content_channels: tableOk([channel({ coverage_paused_until: '2026-08-01', coverage_pause_reason: 'token expired' })]),
    content_renditions: tableOk([rend({ status: 'to-produce', scheduled_for: null })]),
  }), NOW10)
  assert(i.verdict === 'FAIL', `an expired pause is not a pause, got ${i.verdict}`)
  assert(/EXPIRED on 2026-08-01/.test(violationsOf(i)[0].message), 'must say when it lapsed')
  assert(/token expired/.test(violationsOf(i)[0].message), 'must quote the reason that ran out')
})

check('I10 ignores lane 2, which may slip without holding lane 1', () => {
  const i = inv10(store({
    content_channels: tableOk([
      channel({ platform: 'linkedin', format: 'text-post', lane: 'lane-1' }),
      channel({ platform: 'youtube', format: 'long-form', lane: 'lane-2' }),
    ]),
    content_renditions: tableOk([rend({ status: 'scheduled', scheduled_for: inWindow })]),
  }), NOW10)
  assert(i.verdict === 'PASS', 'an empty camera lane must not alarm')
  assert(!i.findings.some((f) => /youtube/.test(f.message)), 'lane 2 should not even be reported on')
})

check('I10 ignores a channel that is not in_plan', () => {
  const i = inv10(store({
    content_channels: tableOk([channel({ in_plan: false })]),
    content_renditions: tableOk([rend({ status: 'to-produce', scheduled_for: null })]),
  }), NOW10)
  assert(i.verdict === 'UNCHECKED', 'no in-plan lane-1 channel means nothing was measured')
})

// Same rule as I9's empty-frontmatter guard: an empty denominator must never read as clean.
check('I10 with no lane-1 channel is UNCHECKED, never a pass', () => {
  const i = inv10(store({ content_channels: tableOk([channel({ lane: 'lane-2' })]) }), NOW10)
  assert(i.verdict === 'UNCHECKED', `an unmeasured board is not a covered one, got ${i.verdict}`)
  assert(i.reason && /must not read as full coverage/.test(i.reason), 'the reason must say why')
})

check('I10 reports the window it actually used, so the denominator is visible', () => {
  const i = inv10(store(), NOW10)
  assert(i.reads.some((r) => /2026-08-05 to 2026-08-12/.test(r)), `window must be in reads: ${i.reads.join(' | ')}`)
  assert(COVERAGE_WINDOW_DAYS === 7, 'the window is one week of the published rhythm')
})

check('I4 fails a scheduled rendition whose slot has passed, against an injected clock', () => {
  const s = store({ content_renditions: tableOk([
    rend({ id: 'past', status: 'scheduled', scheduled_for: '2026-07-30T09:00:00+00:00' }),
    rend({ id: 'future', status: 'scheduled', scheduled_for: '2026-08-03T07:00:00+00:00' }),
  ]) })
  const r = inv4(s, new Date('2026-08-01T12:00:00Z'))
  assert(r.verdict === 'FAIL' && violationsOf(r).length === 1, 'exactly the past one must fail')
  assert(violationsOf(r)[0].ref === 'past', 'and it must be the right row')
})

check('I4 treats a NULL scheduled_for as unverifiable, not clean and not failed', () => {
  const s = store({ content_renditions: tableOk([rend({ status: 'scheduled', scheduled_for: null })]) })
  const r = inv4(s, new Date('2026-08-01T12:00:00Z'))
  assert(r.verdict === 'PASS' && notesOf(r).length === 1, 'a null slot is a note')
  assert(/unverifiable/.test(notesOf(r)[0].message), 'and must say it could not be compared')
})

// ── I5: the real sign-off gate (Keith, 2026-08-01) ───────────────────────────
// A non-empty ewa_task proves a question was ASKED, not answered. These renditions publish on
// a timer, so "routed to Ewa" must never be enough on its own.

const reviewTask = (o: Partial<ReviewTask> = {}): ReviewTask =>
  ({ id: 't1', url: 'https://app.clickup.com/t/t1', statusName: 'complete', dueDate: null, checklists: [], ...o })

/** A stubbed ClickUp, so none of these tests touches the network. */
function stubTasks(byId: Record<string, ReviewTask | Error>): { fetch: TaskFetcher; calls: string[] } {
  const calls: string[] = []
  return {
    calls,
    fetch: async (taskId: string) => {
      calls.push(taskId)
      const t = byId[taskId]
      if (!t) throw new Error(`ClickUp GET /task/${taskId} -> 404`)
      if (t instanceof Error) throw t
      return t
    },
  }
}

function amberStore(ewa_task: string | null, rendStatus = 'scheduled'): Store {
  return store({
    content_assets: tableOk([asset({ id: 'am', slug: 'what-time-was-it-taken', preflight: 'amber-ewa', ewa_task })]),
    content_renditions: tableOk([rend({ asset_id: 'am', status: rendStatus })]),
  })
}

check('clickupTaskId reads both live shapes: a bare id and a full task URL', () => {
  assert(clickupTaskId('869ecg9j6') === '869ecg9j6', 'a bare id passes through')
  assert(clickupTaskId('https://app.clickup.com/t/869eaqwv0') === '869eaqwv0', 'a task URL yields its id')
  assert(clickupTaskId('https://app.clickup.com/t/9012/869eaqwv0?x=1') === '869eaqwv0', 'team-scoped URLs and queries')
  assert(clickupTaskId(null) === null && clickupTaskId('  ') === null, 'empty is null, not a guess')
  assert(clickupTaskId('see the ClickUp board') === null, 'prose must not be mistaken for an id')
})

check('NO CLICKUP CALL when no amber asset has a scheduled rendition', () => {
  // Green-and-scheduled is the ordinary case; the question never arises, so I5 must PASS
  // without a network call rather than go UNCHECKED for a check it did not need.
  const s = store({ content_renditions: tableOk([rend({ status: 'scheduled' })]) })
  assert(assetsNeedingRuling(s).length === 0, 'a green asset needs no ruling')
  const r = inv5(s)
  assert(r.verdict === 'PASS', `a green scheduled rendition must pass, got ${r.verdict}`)
  assert(assetsNeedingRuling(store({ content_renditions: tableOk([rend({ status: 'to-produce' })]) })).length === 0,
    'an amber asset with nothing scheduled also raises no question')
})

checkAsync('amber + task COMPLETE and no unanswered rulings => PASS', async () => {
  const s = amberStore('869ecg9jd')
  const need = assetsNeedingRuling(s)
  assert(need.length === 1, 'the question must arise for an amber asset with a scheduled rendition')
  const stub = stubTasks({ '869ecg9jd': reviewTask({ statusName: 'complete' }) })
  const r = inv5(s, await resolveEwaApprovals(need, stub.fetch))
  assert(r.verdict === 'PASS', `a completed ruling clears the gate, got ${r.verdict}`)
  assert(stub.calls.length === 1 && stub.calls[0] === '869ecg9jd', 'and it asked ClickUp exactly once, by id')
})

checkAsync('amber + task NOT complete => violation (routed is not ruled)', async () => {
  const s = amberStore('869ecg9jd')
  const stub = stubTasks({ '869ecg9jd': reviewTask({ statusName: 'in progress' }) })
  const r = inv5(s, await resolveEwaApprovals(assetsNeedingRuling(s), stub.fetch))
  assert(r.verdict === 'FAIL', 'an unanswered question must not let a timed post ship')
  assert(/not complete/.test(violationsOf(r)[0].message), `the message must say why: ${violationsOf(r)[0].message}`)
})

checkAsync('amber + COMPLETE but a named ruling unanswered => still a violation', async () => {
  // The 2026-07-29 andropause incident: approved by completion with two rulings never answered.
  // The doctor reuses clickup.ts isApproved so it cannot drift from that gate.
  const s = amberStore('869ecg9jd')
  const stub = stubTasks({
    '869ecg9jd': reviewTask({
      statusName: 'complete',
      checklists: [{ id: 'c1', name: 'Rulings required before approval', items: [{ id: 'i1', name: 'Confirm the 12 nmol/L provenance', resolved: false }] }],
    }),
  })
  const r = inv5(s, await resolveEwaApprovals(assetsNeedingRuling(s), stub.fetch))
  assert(r.verdict === 'FAIL', 'completion alone must not count when a ruling was asked')
  assert(/unanswered/.test(violationsOf(r)[0].message), 'and the outstanding ruling must be named')
})

check('amber + EMPTY ewa_task => violation, never unchecked', () => {
  // Nothing was routed, so there is nothing to verify and nothing to wait for.
  const r = inv5(amberStore(null))
  assert(r.verdict === 'FAIL', `an unrouted amber asset must fail, got ${r.verdict}`)
  assert(/EMPTY ewa_task/.test(violationsOf(r)[0].message), 'and must say the routing itself is missing')
  assert(assetsNeedingRuling(amberStore(null)).length === 1, 'it still counts as needing a ruling')
})

checkAsync('amber + ClickUp unreachable => UNCHECKED naming the asset and the task', async () => {
  const s = amberStore('869ecg9jd')
  const stub = stubTasks({ '869ecg9jd': new Error('Missing required env: CLICKUP_API_TOKEN') })
  const r = inv5(s, await resolveEwaApprovals(assetsNeedingRuling(s), stub.fetch))
  assert(r.verdict === 'UNCHECKED', `an unverifiable gate is not a satisfied gate, got ${r.verdict}`)
  assert(/what-time-was-it-taken/.test(r.reason ?? ''), 'the asset must be named')
  assert(/869ecg9jd/.test(r.reason ?? ''), 'the task must be named')
  assert(/CLICKUP_API_TOKEN/.test(r.reason ?? ''), 'and the cause must be carried through')
})

checkAsync('an unresolvable ewa_task string is UNCHECKED, not silently approved', async () => {
  const s = amberStore('ask Ewa on Slack')
  const stub = stubTasks({})
  const r = inv5(s, await resolveEwaApprovals(assetsNeedingRuling(s), stub.fetch))
  assert(r.verdict === 'UNCHECKED', 'an unparseable task reference cannot clear the gate')
  assert(stub.calls.length === 0, 'and no pointless network call should be made')
})

checkAsync('a definite violation outranks an unresolvable one, so exit 2 wins over exit 3', async () => {
  const s = store({
    content_assets: tableOk([
      asset({ id: 'am', slug: 'amber-unreachable', preflight: 'amber-ewa', ewa_task: '869ecg9jd' }),
      asset({ id: 'rd', slug: 'red-scheduled', preflight: 'red', ewa_task: null }),
    ]),
    content_renditions: tableOk([
      rend({ id: 'r1', asset_id: 'am', status: 'scheduled' }),
      rend({ id: 'r2', asset_id: 'rd', status: 'scheduled' }),
    ]),
  })
  const stub = stubTasks({ '869ecg9jd': new Error('network down') })
  const r = inv5(s, await resolveEwaApprovals(assetsNeedingRuling(s), stub.fetch))
  assert(r.verdict === 'FAIL', 'an actionable violation must not be hidden behind an unresolved one')
  assert(notesOf(r).some((n) => /could NOT be resolved/.test(n.message)), 'the unresolved case must still be reported')
})

check('a red or not-run pre-flight can never be excused by a ClickUp task', () => {
  const s = store({
    content_assets: tableOk([asset({ preflight: 'red', ewa_task: '869ecg9jd' })]),
    content_renditions: tableOk([rend({ status: 'published' })]),
  })
  assert(inv5(s).verdict === 'FAIL', 'only green or amber-ewa are candidates for shipping')
  assert(assetsNeedingRuling(s).length === 0, 'and red never even asks ClickUp')
})

check('I8: publication evidence outranks a status field (the live FAI case)', () => {
  const s = store({
    content_assets: tableOk([asset({ slug: 'substack-free-androgen-index', preflight: 'red', status: 'scripted' })]),
    content_renditions: tableOk([rend({
      status: 'to-produce', platform: 'substack', format: 'newsletter',
      external_post_id: 'free-androgen-index-the-testosterone', publisher: 'manual',
    })]),
  })
  const r = inv8(s)
  assert(r.verdict === 'FAIL', 'an external id on an unshipped asset is a contradiction')
  const m = violationsOf(r)[0].message
  assert(/preflight "red"/.test(m) && /below approved/.test(m), `both reasons must be stated: ${m}`)
  assert(inv5(s).verdict === 'PASS', 'and I5 must MISS it, which is exactly why I8 exists')
})

check('I8 passes a properly shipped rendition, and treats external_url as evidence too', () => {
  assert(inv8(store({ content_renditions: tableOk([rend({ status: 'published', external_post_id: '123' })]) }))
    .verdict === 'PASS', 'a green, done asset carrying an id is correct')
  const s = store({
    content_assets: tableOk([asset({ status: 'scripted' })]),
    content_renditions: tableOk([rend({ external_url: 'https://x.test/p/1' })]),
  })
  assert(inv8(s).verdict === 'FAIL', 'a URL is evidence just as an id is')
})

// ═════════════════════════════════════════════════════════ I6: dead markers

console.log('\n  — I6: dead markers in served bodies —')

const LIVE_CTA_COMMENT =
  '{/* CTA BLOCK: to be rendered by ArticleLayout CTA section, OR write inline if no auto-render */}'
const LIVE_FAQ_COMMENT =
  '{/* FAQ block is auto-rendered by ArticleLayout from the `faq:` array in frontmatter. Do not duplicate the questions inline here. */}'

check('THE FALSE POSITIVE: the real CTA-BLOCK comment is a note, not a violation', () => {
  // Verbatim from inflammatory-markers-blood-test. It describes normal component behaviour,
  // asserts no unmet condition and blocks nothing. An earlier MARKER_WORDS matched "to be
  // rendered" and hard-failed it; the old test dodged this by using a short made-up variant.
  const hits = todoMarkers(LIVE_CTA_COMMENT)
  assert(hits.length === 1 && hits[0].tier === 'note', `expected a note, got ${JSON.stringify(hits)}`)
  assert(inv6(store({ blog_articles: tableOk([article({ body: LIVE_CTA_COMMENT })]) })).verdict === 'PASS',
    'descriptive prose must not fail an article')
})

check('the real FAQ boilerplate is a note too', () => {
  assert(todoMarkers(LIVE_FAQ_COMMENT)[0].tier === 'note', 'authoring guidance is not an outstanding obligation')
})

check('THE RESTORED HOLE: "to be added / reviewed / rendered" are obligations again', () => {
  // Clearing the CTA false positive by DELETING these three verbs opened a hole: a genuine
  // "{/* Ewa to be reviewed */}" in a published body read as benign. That is the exact class
  // I6 exists to catch, and the class it just found on eight published articles.
  for (const s of [
    '{/* Ewa to be reviewed */}',
    '{/* pull quote to be added before launch */}',
    '{/* chart to be rendered here once the data lands */}',
  ]) {
    assert(markerTier(s) === 'hard', `an outstanding obligation read as benign: ${s}`)
  }
})

check('the CTA case is excused by a POSITIVE component signal, not by deleting the verb', () => {
  assert(markerTier(LIVE_CTA_COMMENT) === 'note', 'the live CTA comment stays a note')
  assert(/to be rendered/i.test(LIVE_CTA_COMMENT), 'and it still contains the obligation verb, which is the point')
  assert(markerTier('{/* the placeholder prop is set by ArticleLayout */}') === 'note',
    'the technical sense of "placeholder" is excused by the component signal')
})

check('a STRONG marker is never excused, even inside a component description', () => {
  assert(markerTier('{/* CTA BLOCK: TODO Ewa sign-off, OR write inline if no auto-render */}') === 'hard',
    'a TODO inside a CTA block is still a TODO')
  assert(markerTier('{/* auto-rendered by ArticleLayout. Ewa sign-off required before publish. */}') === 'hard',
    'an explicit outstanding sign-off outranks any component wording')
})

check('a bare "placeholder" in a served body fails hard by design', () => {
  assert(markerTier('{/* placeholder copy */}') === 'hard',
    'unfilled placeholder content reaching a reader is exactly what this invariant guards')
})

check('"SERVED body" is derived from status, not assumed', () => {
  const pub = inv6(store({ blog_articles: tableOk([article({ status: 'published', body: '{/* TODO Ewa */}' })]) }))
  assert(/in the SERVED body/.test(violationsOf(pub)[0].message), 'a published body is served')
  const draft = inv6(store({ blog_articles: tableOk([article({ status: 'draft', body: '{/* TODO Ewa */}' })]) }))
  assert(/not served/.test(violationsOf(draft)[0].message),
    `a draft body must not be called SERVED: ${violationsOf(draft)[0].message}`)
})

check('every live dead-marker shape is still caught', () => {
  const shapes = [
    '{/* TODO Ewa sign-off: draft direction per brief Section 11 */}',
    '{/* TODO: Ewa sign-off required before publish. Draft direction per brief Section 11. */}',
    '{/* Ewa pull quote: Ewa to review and rewrite in her own voice, or remove, before publish. */}',
    '{/* TODO Ewa sign-off: full review required per brief section 16, Pillar C HIGH risk */}',
    '<!-- TBD: swap this image before publish -->',
  ]
  for (const s of shapes) assert(todoMarkers(s)[0]?.tier === 'hard', `missed a real dead marker: ${s}`)
})

check('a comment closed with `*/ }` (space before the brace) is not missed', () => {
  assert(todoMarkers('{/* TODO Ewa */ }').length === 1, 'the spaced closing brace must still match')
})

check('a bare TODO counts once, and clean prose produces nothing', () => {
  assert(todoMarkers('Some prose. TODO: rewrite this.')[0].tier === 'hard', 'a bare TODO counts')
  assert(todoMarkers('{/* TODO Ewa */} and later TODO Ewa again').length === 2, 'comment and bare are two')
  assert(todoMarkers('A normal full blood count reassures a lot of tired men.').length === 0,
    'ordinary article prose must not trip the scan')
})

check('I6 groups repeated benign comments instead of burying the violations', () => {
  const s = store({ blog_articles: tableOk([
    article({ id: 'b1', slug: 'one', body: LIVE_FAQ_COMMENT }),
    article({ id: 'b2', slug: 'two', body: LIVE_FAQ_COMMENT }),
    article({ id: 'b3', slug: 'three', body: '{/* TODO Ewa sign-off */}' }),
  ]) })
  const r = inv6(s)
  assert(violationsOf(r).length === 1, 'one real marker')
  assert(notesOf(r).length === 1 && /one, two/.test(notesOf(r)[0].message), 'the duplicate note is grouped')
})

// ══════════════════════════════════════════════ I7: counts in STATE docs

console.log('\n  — I7: STATE-doc counts —')

check('a stale count in the CURRENT section fails; the same count in an older one does not', () => {
  const md = [
    '# State', '',
    '## Newest (2026-08-01)', 'The grid is 99 slots and 23 filled.', '',
    '## Older (2026-07-29)', 'The question is what the 17 published articles could become.',
  ].join('\n')
  const s = store({
    blog_articles: tableOk([article({ id: 'p1' }), article({ id: 'p2' })]),
    content_channels: tableOk([channel()]),
  })
  const r = inv7(s, ctx({ stateDocs: [{ path: 'STATE.md', text: md }] }))
  assert(r.verdict === 'FAIL', 'the current-section claim is wrong (99 slots against 2 x 1)')
  assert(violationsOf(r).length === 1, `exactly one violation expected, got ${violationsOf(r).length}`)
  assert(notesOf(r).some((n) => /2026-07-29 section/.test(n.message)), 'the old one is history, reported not failed')
})

check('an UNDATED ## section is history, not a claim about now', () => {
  const md = ['# State', '', '## Newest (2026-08-01)', 'ok', '', '## What is ready to atomise now',
    '14 published articles, not nine.'].join('\n')
  const undated = extractCountAssertions(md, 'STATE.md').find((x) => x.sectionDate === 'undated')
  assert(undated && !undated.current, 'an undated section must not be failed as a claim about today')
})

check('a count in the preamble, above any ## heading, IS current', () => {
  const a = extractCountAssertions('# State\n\nRight now: 18 published articles.\n\n## Old (2026-01-01)\nx', 'S.md')
  assert(a[0].sectionDate === 'preamble' && a[0].current, 'the header speaks in the present tense')
})

check('I7 is UNCHECKED when no current assertion exists at all', () => {
  const r = inv7(store(), ctx({ stateDocs: [{ path: 'S.md', text: '## Now (2026-08-01)\nNo numbers here.' }] }))
  assert(r.verdict === 'UNCHECKED', 'comparing nothing is not a pass')
  assert(/Nothing was compared/.test(r.reason ?? ''), 'and must say so')
})

check('THE SPAN FIX: masking is scoped to the retired span, not the whole line', () => {
  // These lines run past 1,800 characters. Blanking a whole line on one marker silently
  // stopped asserting against live prose sitting beside retired prose.
  const line = 'Live: the grid is 162 slots and 23 filled. ~~Old: the grid is 1 slots and 1 filled.~~'
  const masked = maskRetired(line)
  assert(masked.includes('162 slots and 23 filled'), 'the live half must survive masking')
  assert(!masked.includes('1 slots and 1 filled'), 'the struck half must be blanked')
  assert(masked.length === line.length, 'masking must preserve offsets so line numbers stay right')
})

check('a SUPERSEDED bracket retires only its own span', () => {
  const line = '**Live: 5 published articles.** **[SUPERSEDED. The grid is 144 slots and 18 filled.]** Still live prose.'
  const masked = maskRetired(line)
  assert(!masked.includes('144 slots'), 'the superseded bracket must be blanked')
  assert(masked.includes('5 published articles'), 'prose outside the bracket is still a claim')
})

check('every count pattern is global, so a line quoting two claims yields two', () => {
  for (const p of COUNT_PATTERNS) assert(p.re.flags.includes('g'), `${p.id} must be global or matchAll throws`)
  const a = extractCountAssertions('## Now (2026-08-01)\n18 published articles, and 17 published articles.', 'S.md')
  assert(a.filter((x) => x.id === 'published-articles').length === 2, 'both claims on one line must be found')
})

// ══════════════════════════════ I9: no second home for a fact the database owns

console.log('\n  — I9: the frontmatter carries no fact the database owns —')

/** A Phase-1 asset file: identity and craft in the frontmatter, state only in the mirror. */
const PHASE1_FRONTMATTER = [
  '---',
  'slug: same-test-twice',
  'title: Same test, six weeks apart, two different numbers',
  'content_type: personal-story',
  'funnel_stage: TOFU',
  'funnel_job: problem-aware scroll-stop (testosterone / the reference range)',
  'awareness: problem-aware',
  'cta: quiz',
  'marker: testosterone',
  'canonical_asset: myth-of-normal-range',
  'series: Read Your Blood',
  'renditions:',
  '  - platform: instagram',
  '    format: reel',
  '    thumb: 9x16',
  '  - platform: youtube',
  '    format: short',
  '    thumb: 9x16',
  '---',
].join('\n')
const PHASE1_ASSET = [
  PHASE1_FRONTMATTER, '',
  MIRROR(['| | |', '| --- | --- |', '| status | scripted |', '| preflight | green (2026-07-31) |',
    '| drive | https://drive.google.com/drive/folders/1islwo |', '',
    '| rendition | status | scheduled | published | id | url |',
    '| instagram/reel | to-produce |  |  |  |  |'].join('\n')),
  '', '## Chosen hook', 'Spoken: "I had the same blood test twice."',
].join('\n')

const assetCtx = (text: string, p = 'assets/2026-07-31-same-test-twice.md') => ctx({ assetFiles: [{ path: p, text }] })
/** Splice a line into the frontmatter, which is how a state key actually comes back. */
const withLine = (line: string, after = 'cta: quiz') => PHASE1_ASSET.replace(after, `${after}\n${line}`)

check('a Phase-1 asset file passes, generated mirror and all', () => {
  const r = inv9(assetCtx(PHASE1_ASSET))
  assert(r.verdict === 'PASS', `a compliant file must pass: ${JSON.stringify(r.findings)}`)
  assert(PHASE1_ASSET.includes('| status | scripted |'),
    'and the fixture must genuinely contain the mirrored state, or this proves nothing')
  assert(r.reads.some((x) => /1 files, 1 with frontmatter/.test(x)), `the denominator must be stated: ${r.reads}`)
})

check('THE DUAL STORE RETURNING: a stray "status:" in the frontmatter FAILS', () => {
  const r = inv9(assetCtx(withLine('status: scripted')))
  assert(r.verdict === 'FAIL', 'a second copy of a fact the database owns must fail on the day it appears')
  const v = violationsOf(r)
  assert(v.length === 1 && v[0].ref === 'assets/2026-07-31-same-test-twice.md', 'the file must be named')
  assert(/"status" = "scripted"/.test(v[0].message), `the key and its value must be quoted back: ${v[0].message}`)
  assert(/content_assets\.status/.test(v[0].message), 'and the column that owns the fact must be named')
})

check('an EMPTY state key fails too: an empty slot is still a second home', () => {
  // The live shape. `ewa_task:` with nothing after it is a field waiting to be filled by hand.
  const r = inv9(assetCtx(withLine('ewa_task:')))
  assert(r.verdict === 'FAIL', 'presence is the violation, not the value')
  assert(/"ewa_task" \(empty\)/.test(violationsOf(r)[0].message), 'and the report must say the key was empty')
})

check('a per-rendition state key fails and names the rendition it sits on', () => {
  const text = PHASE1_ASSET.replace('    thumb: 9x16\n  - platform: youtube',
    '    thumb: 9x16\n    status: to-produce\n    url:\n  - platform: youtube')
  const m = violationsOf(inv9(assetCtx(text)))[0].message
  assert(/rendition instagram\/reel "status"/.test(m), `the offending rendition must be identified: ${m}`)
  assert(/content_renditions\.status/.test(m) && /content_renditions\.external_url/.test(m),
    `both keys must map to their owning columns: ${m}`)
})

check('the DATABASE spelling is caught as well as the old frontmatter spelling', () => {
  // A fact copied back under the column's own name is the same second copy, better disguised.
  for (const line of ['drive_url: https://drive.google.com/x', 'approved_at: 2026-07-31', 'ewa_signed_at: 2026-07-31']) {
    assert(inv9(assetCtx(withLine(line))).verdict === 'FAIL', `${line} must fail`)
  }
  assert(stateKeysIn(withLine('published_at: 2026-07-31')).length === 0,
    'published_at is a RENDITION key: at the top level it is not one of the facts this maps')
})

check('every key the split hands to the database is watched, in both spellings', () => {
  for (const k of ['status', 'approved_by', 'approved_date', 'preflight', 'preflight_date', 'ewa_task', 'drive']) {
    assert(k in I9_FLAT, `${k} is database-owned and must be watched`)
  }
  for (const k of ['status', 'url', 'publish_date', 'scheduled_for', 'publisher', 'external_post_id']) {
    assert(k in I9_REND, `rendition ${k} is database-owned and must be watched`)
  }
})

check('THE TWO KEYS THE DOCTOR USED TO MISS ARE WATCHED: the divergence, pinned', () => {
  // The whole reason db-owned-keys.json exists. On 2026-08-01 scan.js refused ten rendition keys
  // and this doctor refused eight, missing exactly these two, and the doctor is the NIGHTLY
  // automated alarm while scan.js is hand-run: the weaker list was the one nobody has to remember
  // to run. Keith ruled that the strict superset wins, so dropping either from the JSON to make
  // some future list "tidy" must fail here rather than quietly narrow the nightly alarm.
  assert('unipile_account' in I9_REND, 'unipile_account is a real column and was watched by scan.js first')
  assert('thumb_confirmed' in I9_REND,
    'thumb_confirmed must be watched forever: it never had a column, it was the honour-system boolean the old G3 read, and the point is that it can never be typed into a file again')
  assert(/^nothing \(retired/.test(I9_REND.thumb_confirmed),
    `a retired key must name no column, or a report would claim a store that does not exist: ${I9_REND.thumb_confirmed}`)
})

check('SCAN.JS REFUSES EXACTLY WHAT THE DOCTOR REFUSES: the consolidation, executed not asserted', () => {
  // THE CHECK THAT REPLACES "keep these in sync", which is what failed. The two watch lists are
  // now derived from one file, so there are no copies to compare; what a shared file does NOT
  // prove is that the two DERIVATIONS agree. So this runs the real scanner over a fixture holding
  // every watched key in every spelling and demands it refuse each one, naming the same owner.
  // Re-typing a local list into either side, or narrowing the JSON, fails here.
  assert(REAL_SCAN_JS, `scan.js not found at ${SCAN_JS_PATH}`)
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'db-owned-keys-'))
  const file = path.join(dir, 'agreement-fixture.md')
  try {
    fs.writeFileSync(file, [
      '---',
      'slug: agreement-fixture',
      'title: Every database-owned key, in every spelling',
      ...Object.keys(I9_FLAT).map((k) => `${k}: sentinel-${k}`),
      'renditions:',
      '  - platform: instagram',
      '    format: reel',
      '    thumb: 9x16',
      ...Object.keys(I9_REND).map((k) => `    ${k}: sentinel-${k}`),
      '---',
      '',
      '## Script',
      '',
      'Body copy the compliance pass has nothing to say about.',
    ].join('\n'))

    const run = spawnSync(process.execPath, [SCAN_JS_PATH, file], { encoding: 'utf-8' })
    const out = `${run.stdout ?? ''}${run.stderr ?? ''}`
    assert(run.status === 2, `scan.js must HARD-fail a file full of state keys, got exit ${run.status}:\n${out}`)

    for (const [k, owner] of Object.entries(I9_FLAT)) {
      assert(out.includes(`frontmatter carries "${k}", which is state the database owns (${owner})`),
        `scan.js does not refuse the asset key "${k}" as owned by ${owner}. The doctor and the scanner have come apart, which is the defect db-owned-keys.json exists to make impossible:\n${out}`)
    }
    for (const [k, owner] of Object.entries(I9_REND)) {
      assert(out.includes(`carries "${k}", which is state the database owns (${owner})`),
        `scan.js does not refuse the rendition key "${k}" as owned by ${owner}:\n${out}`)
    }
    // And the other direction, or the doctor could quietly become the weaker list again.
    const watched = new Set([...Object.keys(I9_FLAT), ...Object.keys(I9_REND)])
    for (const m of out.matchAll(/carries "([^"]+)", which is state the database owns/g)) {
      assert(watched.has(m[1]),
        `scan.js refuses "${m[1]}", which invariant 9 does not watch. The nightly alarm is now the weaker of the two, which is exactly how this started:\n${out}`)
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

check('NO SKILL TELLS AN AGENT TO WRITE A DATABASE-OWNED KEY INTO FRONTMATTER', () => {
  // THE GAP THIS CLOSES. I9 and scan.js police asset FILES. Nothing policed the TOOLS that write
  // asset files, so the Phase 1 doc sweep missed `/hook` (which mints every Spine B asset and
  // still said `status: hooked` and `drive: pending`) and `/compliance-preflight` (Guardrail #1,
  // which still said to stamp `preflight`, `ewa_task` and `preflight_date` into frontmatter).
  // Both were unmodified in the Phase 1 changeset. The first run of either would have produced a
  // file that scan.js HARD-fails and that turns the nightly doctor red, so the detectors would
  // have caught the damage AFTER it was done, on a gate nobody is allowed to skip.
  //
  // HOW IT WORKS, AND WHY IT IS AN ALLOWLIST RATHER THAN A CLEVER REGEX. A first attempt matched
  // imperative verbs near a key ("set `preflight_date: ...`") and missed two real defects: a bare
  // bullet `- \`status: hooked\`` has no verb at all, and "do not lose the asset. Set `drive:
  // pending`" is exempted by its own neighbouring negation. So instead EVERY backticked
  // `key: value` literal naming a database-owned key is extracted, and the set must equal a
  // reviewed allowlist. Adding one fails here and a human classifies it. That is the point: these
  // lines are instructions to an agent, and a new one deserves a look.
  //
  // Keys come from db-owned-keys.json, aliases included, so this never becomes a fourth copy.
  const skillsDir = path.resolve(process.cwd(), '../../..', '.claude/skills')
  assert(fs.existsSync(skillsDir), `skills directory not found at ${skillsDir}`)

  const keys = [...DB_OWNED_KEYS.asset, ...DB_OWNED_KEYS.rendition]
    .flatMap((e) => [e.key, ...(e.aliases ?? [])])
  const literal = new RegExp('`(' + [...new Set(keys)].join('|') + '):\\s*([^`]*)`', 'g')

  // In scope: the skills that actually touch content-machine asset files. Scoped by what the file
  // says it works on rather than by a hand-kept list, so a new skill joins automatically. NOT the
  // blog skills: `/article` and `/publish-article` write `blog_articles` MDX frontmatter, a
  // different store with a legitimate `status:` of its own, and sweeping them in would train a
  // reader to add exemptions until the check means nothing.
  const inScope = fs.readdirSync(skillsDir)
    .map((d) => ({ skill: d, file: path.join(skillsDir, d, 'SKILL.md') }))
    .filter((s) => fs.existsSync(s.file))
    .map((s) => ({ ...s, text: fs.readFileSync(s.file, 'utf-8') }))
    .filter((s) => s.text.includes('content-machine/assets'))

  // A scope that silently empties (a renamed path, a moved directory) would pass this test while
  // checking nothing, which is the failure mode this whole suite is built against.
  for (const required of ['hook', 'script', 'compliance-preflight', 'content-status']) {
    assert(inScope.some((s) => s.skill === required),
      `"${required}" writes or stamps content-machine asset files but fell out of scope. Either the path moved, or this check just went vacuous.`)
  }

  // Every permitted occurrence, as `skill|key|value`. Each one is a mention, never an instruction.
  const ALLOWED = new Map<string, string>([
    ['content-status|status|', 'names the key while forbidding it: "A leftover `status:` or `preflight:` in an asset file is a second copy"'],
    ['content-status|preflight|', 'same sentence, the other half of the prohibition'],
    ['content-status|status|draft', 'the blog scope note: `content/blog/*.mdx` lags `blog_articles`, a different store entirely'],
    ['hook|preflight|amber-ewa', 'describes the DATABASE approval route (`content_assets_approval_gate`), not a frontmatter value to type'],
    ['hook|status|', 'the "no state keys of any kind" prohibition in the mint step'],
    ['hook|preflight|', 'same prohibition'],
    ['hook|drive|', 'same prohibition'],
    ['hook|drive|pending', 'the graceful-degradation step naming the exact literal it forbids, because that literal was the defect'],
  ])

  const unexpected: string[] = []
  for (const s of inScope) {
    s.text.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(literal)) {
        const id = `${s.skill}|${m[1]}|${m[2].trim()}`
        if (!ALLOWED.has(id)) unexpected.push(`  ${s.skill}/SKILL.md:${i + 1}  \`${m[1]}: ${m[2].trim()}\`\n      ${line.trim().slice(0, 160)}`)
      }
    })
  }
  assert(unexpected.length === 0,
    `a skill names a database-owned key in frontmatter form and that occurrence is not on the reviewed allowlist.\n` +
    `If it INSTRUCTS writing the key into an asset file, that is the dual store growing back: rewrite it to write the\n` +
    `\`content_assets\` / \`content_renditions\` column instead. If it only MENTIONS the key (forbidding it, or describing\n` +
    `the database route), add it to ALLOWED with the reason.\n${unexpected.join('\n')}`)

  // And the other direction: an allowlist entry whose line has been deleted is dead weight that
  // makes the next reader trust a check that is no longer checking that case.
  const seen = new Set(inScope.flatMap((s) =>
    [...s.text.matchAll(literal)].map((m) => `${s.skill}|${m[1]}|${m[2].trim()}`)))
  for (const id of ALLOWED.keys()) {
    assert(seen.has(id), `ALLOWED carries "${id}", which no skill contains any more. Delete the entry.`)
  }
})

check('THE SHARED DATA FILE IS TRACKED IN GIT, or every consumer breaks on a fresh checkout', () => {
  // The consolidation put one load-bearing fact into a DATA file rather than into source, and a
  // data file is exactly as easy to leave untracked as a source file is hard to. This repo's
  // standing rule forbids `git add -A`, so everything is staged by path and an omission is the
  // LIKELY outcome rather than a remote one. Nothing in a working tree that already holds the
  // file can reveal the miss: scan.js exits 1 (MODULE_NOT_FOUND), `tsc --noEmit` fails TS2307 on
  // content-doctor.ts, and content-doctor itself crashes — but only for everyone else, and in CI.
  // So the check is "does git know about it", not "does it exist on disk".
  const paths = [
    '.claude/skills/content-status/db-owned-keys.json',
    '.claude/skills/content-status/scan.js',
    'andro-prime/09_website-app/frontend/scripts/content-engine/content-doctor.ts',
  ]
  const repoRoot = path.resolve(process.cwd(), '../../..')
  const git = spawnSync('git', ['-C', repoRoot, 'ls-files', '--error-unmatch', '--', ...paths], { encoding: 'utf-8' })
  // An unperformed check must never read as a pass: no git, no verdict, so this FAILS rather
  // than skipping. A skip here is precisely the shape that let the untracked file through.
  assert(git.error === undefined && git.status !== null,
    `could not run git to verify tracking, so nothing was verified: ${git.error?.message ?? 'no exit status'}`)
  assert(git.status === 0,
    `at least one file the scanner, the doctor and the nightly cron all load is NOT tracked by git. ` +
    `Stage it by path in the same commit as its consumers:\n${git.stdout ?? ''}${git.stderr ?? ''}`)
  const tracked = (git.stdout ?? '').split('\n').map((s) => s.trim()).filter(Boolean)
  for (const p of paths) {
    assert(tracked.includes(p), `git ls-files did not report "${p}" as tracked:\n${git.stdout}`)
  }
})

// ── The migrations directory is a record, and a record with a hole in it is worse than no record ──
// Shared by the two checks below so neither can drift from the other's idea of what a migration is.
const MIGRATIONS_REL = 'andro-prime/09_website-app/database/migrations'
const CONTENT_STATE_REL = 'andro-prime/06_marketing/content-machine/STATE.md'

function migrationFiles(repoRoot: string): string[] {
  const dir = path.join(repoRoot, MIGRATIONS_REL)
  // Missing directory is UNCHECKED-shaped, so it must fail rather than yield an empty pass: a
  // scan of nothing reads exactly like a scan that found nothing wrong.
  assert(fs.existsSync(dir), `${MIGRATIONS_REL} does not exist, so nothing was verified`)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
  assert(files.length > 0, `${MIGRATIONS_REL} holds no .sql files, so nothing was verified`)
  return files
}

check('EVERY FILE IN database/migrations/ IS TRACKED BY GIT, or the record of what ran has a hole', () => {
  // `20260802_ewa_signed_at_insert_guard.sql` was written, APPLIED to production, and left
  // untracked. This repo stages by path (`git add -A` is forbidden), so omission is the likely
  // outcome, and nothing in a working tree that already holds the file can reveal it: the
  // migration ran, the database is correct, and only the record is missing. Replaying the
  // directory from scratch would then recreate the guard in its superseded, weaker form while
  // production carries the stronger one, with the stronger one undocumented.
  //
  // Listed from disk rather than hard-coded, because a hard-coded list is one more thing to
  // forget on exactly the commit that adds a migration.
  const repoRoot = path.resolve(process.cwd(), '../../..')
  const rel = migrationFiles(repoRoot).map((f) => `${MIGRATIONS_REL}/${f}`)
  const git = spawnSync('git', ['-C', repoRoot, 'ls-files', '--', MIGRATIONS_REL], { encoding: 'utf-8' })
  // No git, no verdict. A skip here is the shape that let the untracked file through in round 1.
  assert(git.error === undefined && git.status === 0,
    `could not run git to verify tracking, so nothing was verified: ` +
    `${git.error?.message ?? `exit ${git.status}`}\n${git.stderr ?? ''}`)
  const tracked = new Set((git.stdout ?? '').split('\n').map((s) => s.trim()).filter(Boolean))
  const missing = rel.filter((p) => !tracked.has(p))
  assert(missing.length === 0,
    `migration file(s) on disk that git does not know about:\n  ${missing.join('\n  ')}\n` +
    `Stage each by path in the same commit as the change it supports:\n` +
    `  git add ${missing.join(' ')}`)
})

check('EVERY MIGRATION TOUCHING content_assets IS NAMED IN THE CONTENT-MACHINE STATE DOC', () => {
  // The 20260802 migration shipped and no doc in the repo mentioned it, so STATE.md went on
  // asserting that the hole it closed was still open while the database said otherwise. That is
  // worse than a generic stale doc: CLAUDE.md sends every agent to STATE.md first, so the next
  // reader either believes a closed hole is open or writes a SECOND migration for a guard that
  // already exists, which is two encodings of one rule, the defect this phase exists to end.
  //
  // Scoped to the migrations this workspace's gates actually depend on, detected by reading each
  // file rather than by a name pattern: a migration that renames itself is still one that touches
  // these tables. The check is presence of the FILENAME, not of any claim about it, because a
  // repo-only test can prove a doc mentions a migration and can never prove what it says is true.
  const repoRoot = path.resolve(process.cwd(), '../../..')
  const dir = path.join(repoRoot, MIGRATIONS_REL)
  const relevant = migrationFiles(repoRoot).filter((f) => {
    const sql = fs.readFileSync(path.join(dir, f), 'utf-8')
    return /\bcontent_assets\b|\bcontent_renditions\b/.test(sql)
  })
  assert(relevant.length > 0,
    `no migration mentions content_assets or content_renditions, which cannot be right: the ` +
    `gates live in those tables. Something is wrong with this scan, not with the repo.`)
  const statePath = path.join(repoRoot, CONTENT_STATE_REL)
  assert(fs.existsSync(statePath), `${CONTENT_STATE_REL} is missing, so nothing was verified`)
  const state = fs.readFileSync(statePath, 'utf-8')
  const unmentioned = relevant.filter((f) => !state.includes(f))
  assert(unmentioned.length === 0,
    `migration(s) that change the content-machine's own tables and are named nowhere in ` +
    `${CONTENT_STATE_REL}:\n  ${unmentioned.join('\n  ')}\n` +
    `A gate this workspace depends on must appear in this workspace's volatile-status doc, with ` +
    `what it changed and whether it is applied.`)
})

check('a malformed db-owned-keys.json is refused on load, not rendered as "duplicates undefined"', () => {
  // A hand-edited data file is exactly as capable of being wrong as the hand-maintained lists it
  // replaced, so it is validated rather than trusted. The failure that must not be silent is a
  // retired key with nothing to name as its owner: the message would then state a wrong fact
  // inside a report about wrong facts. An EMPTY side matters just as much, because a watch list
  // that refuses nothing reads as a clean board.
  const ok = [{ key: 'status', column: 'content_assets.status', mirrored: true }]
  const refuses = (raw: unknown, why: string) => {
    let threw = false
    try { readDbOwnedKeys(raw) } catch { threw = true }
    assert(threw, why)
  }
  refuses({ asset: [{ key: 'x', column: null, mirrored: false }], rendition: ok },
    'a column-less entry with no retiredAs must be refused, or every message about it names no store at all')
  refuses({ asset: [], rendition: ok }, 'an empty watch list refuses nothing and must never load')
  refuses({ asset: ok, rendition: [{ key: 'url', aliases: ['url'], column: 'content_renditions.external_url', mirrored: true }],
  }, 'one spelling listed twice means two entries could claim different owners')
  assert(readDbOwnedKeys({ asset: ok, rendition: ok }).asset.length === 1, 'a well-formed file still loads')
})

check('the stripper delete list never outruns what the block renders', () => {
  // `mirrored` is the only thing separating "refuse this key" from "delete this key", and getting
  // it wrong deletes a fact into git history. unipile_account has a column but no cell in the
  // block; thumb_confirmed has neither. Both are refused, neither may be stripped.
  const del = mirroredKeys(DB_OWNED_KEYS.rendition)
  assert(!del.includes('thumb_confirmed') && !del.includes('unipile_account'),
    `a key the generated block does not render must never reach the delete list: [${del.join(', ')}]`)
  for (const e of [...DB_OWNED_KEYS.asset, ...DB_OWNED_KEYS.rendition]) {
    assert(!(e.mirrored && e.column === null), `"${e.key}" is marked mirrored with no column to mirror from`)
  }
  // Aliases are refusal-only spellings, so a delete list containing one would send a stripper
  // hunting for a key no human ever typed.
  const aliases = new Set([...DB_OWNED_KEYS.asset, ...DB_OWNED_KEYS.rendition].flatMap((e) => e.aliases ?? []))
  for (const k of [...mirroredKeys(DB_OWNED_KEYS.asset), ...del]) {
    assert(!aliases.has(k), `"${k}" is a column-spelling alias and must not be on a delete list`)
  }
})

check('I2 and I9 cannot both claim a key, or the doctor would read what it forbids', () => {
  for (const k of Object.keys(FLAT_ENUMS)) assert(!(k in I9_FLAT), `${k} is claimed by both I2 and I9`)
  for (const k of Object.keys(REND_ENUMS)) assert(!(k in I9_REND), `rendition ${k} is claimed by both I2 and I9`)
})

check('I9 with nothing to inspect is UNCHECKED, never a vacuous PASS', () => {
  const r = inv9(ctx())
  assert(r.verdict === 'UNCHECKED', `got ${r.verdict}: a wrong cwd must not report an absence of violations`)
  assert(/no file was inspected/.test(r.reason ?? ''), `and must say why: ${r.reason}`)
})

check('a file with no frontmatter is reported as NOT inspected, not counted as clean', () => {
  const c = ctx({ assetFiles: [
    { path: 'assets/good.md', text: PHASE1_ASSET },
    { path: 'assets/broken.md', text: '# no frontmatter here\n\nstatus: scripted' },
  ] })
  const r = inv9(c)
  assert(r.verdict === 'PASS', 'the inspected file is genuinely clean')
  assert(notesOf(r).some((n) => /NOT inspected/.test(n.message) && /assets\/broken\.md/.test(n.message)),
    'but the uninspected file must be named, or a silence reads as a pass')
  assert(r.reads.some((x) => /2 files, 1 with frontmatter/.test(x)), 'and the two counts must differ on the report')
})

check('I9 does not inspect drafts/, and says so rather than staying silent', () => {
  // A batch draft carries the batch's own working record and CONTEXT.md puts it outside this
  // rule. Widening the scope would be this invariant deciding a question Keith has not been asked.
  const r = inv9(ctx({ assetFiles: [{ path: 'assets/a.md', text: PHASE1_ASSET }], draftFiles: [{ path: 'drafts/x.md', text: X_DRAFT }] }))
  assert(r.verdict === 'PASS', 'a draft carrying preflight and status must not fail I9')
  assert(X_DRAFT.includes('preflight: green'), 'and the fixture must really carry one, or this proves nothing')
  assert(r.reads.some((x) => /drafts\/ \(1 files, NOT inspected/.test(x)), `the exclusion must be on the report: ${r.reads}`)
})

check('several offending keys in one file are one violation, fully enumerated', () => {
  const text = withLine(['status: scripted', 'approved_by: Keith Antony', 'preflight: green', 'drive: https://x.test/f'].join('\n'))
  const v = violationsOf(inv9(assetCtx(text)))
  assert(v.length === 1, `one file is one finding, got ${v.length}`)
  for (const k of ['status', 'approved_by', 'preflight', 'drive']) {
    assert(v[0].message.includes(`"${k}"`), `${k} must appear in the enumeration`)
  }
  assert(/4 database-owned key/.test(v[0].message), 'and the count must be derived from what was found')
})

// ═══════════════════════════════════════════════════════════ small parsers

console.log('\n  — parsers —')

check('fileSlug strips the date prefix and extension, like scan.js', () => {
  assert(fileSlug('2026-07-31-handbrake-half-on.md') === 'handbrake-half-on', 'date prefix must go')
  assert(fileSlug('the-stack.md') === 'the-stack', 'an undated filename is already the slug')
})

check('cleanVal unquotes and drops trailing comments but keeps URL fragments', () => {
  assert(cleanVal('  "a value"  ') === 'a value', 'quotes must be stripped')
  assert(cleanVal('green # ran today') === 'green', 'a spaced-hash comment must be dropped')
  assert(cleanVal('https://x.test/p#frag') === 'https://x.test/p#frag', 'an unspaced # is part of the value')
})

check('parseAsset reads flat keys and the nested renditions list, including publisher', () => {
  const p = parseAsset([
    '---', 'slug: handbrake-half-on', 'cta: canonical-article', 'renditions:',
    '  - platform: instagram', '    format: reel', '    thumb: 9x16', '    publisher: metricool',
    '  - platform: tiktok', '    format: short', '---', '## Script',
  ].join('\n'))
  assert(p.flat.cta === 'canonical-article', 'the value the DB constraint once refused must parse')
  assert(p.renditions.length === 2 && p.renditions[0].thumb === '9x16', 'nested keys attach correctly')
  assert(p.renditions[0].publisher === 'metricool', 'publisher is a constrained column and must be read')
})

check('parseAsset does not invent frontmatter that is not there', () => {
  assert(!parseAsset('# heading\n\nprose').hasFrontmatter, 'no --- block means no frontmatter')
  assert(!parseAsset('---\nslug: x\nnever closed').hasFrontmatter, 'an unterminated block is not frontmatter')
})

check('isPastSchedule: null and garbage are never silently "past"', () => {
  const now = new Date('2026-08-01T12:00:00Z')
  assert(isPastSchedule('2026-07-30T09:00:00+00:00', now), 'yesterday is past')
  assert(!isPastSchedule('2026-08-01T12:00:00Z', now), 'exactly now is not past')
  assert(!isPastSchedule(null, now), 'null must not be coerced into a violation')
  assert(!isPastSchedule('sometime next week', now), 'garbage must not become epoch 0')
})

// Await the async tests before tallying: a still-pending rejection must never be counted clean.
void Promise.all(pending).then(() => {
  console.log(
    failures === 0
      ? '\n🟢 content-doctor: all clean. An unperformed check cannot be reported as a pass.\n'
      : `\n🔴 content-doctor: ${failures} failure(s).\n`,
  )
  process.exit(failures === 0 ? 0 : 1)
})

// ── No import may escape the Docker build context ─────────────────────────────────────────────
//
// WHY THIS EXISTS, AND WHY IT IS NOT COVERED BY ANY TYPECHECK. On 2026-08-02 production failed to
// build because `content-doctor.ts` imported `../../../../../.claude/skills/content-status/
// db-owned-keys.json`, five levels above `frontend/`. Every local check passed: `tsc --noEmit`
// passed, and a full `next build` passed too, because a developer machine has the whole repo.
// The deploy does not. Coolify runs `docker build` with the build context set to `frontend/`
// ALONE, so `COPY . .` copies nothing above it and the module cannot resolve inside the image.
//
// **The failure is invisible to every tool that sees the whole repo**, which is all of them
// except the real image build. So the check cannot be "compile it": it has to be structural.
// A path that leaves the build context is wrong whether or not anything currently compiles it.
check('NO STATIC IMPORT ESCAPES THE DOCKER BUILD CONTEXT (frontend/), which the whole repo hides', () => {
  const FRONTEND = path.resolve(process.cwd())
  const roots = ['scripts', 'app', 'components', 'lib'].map((d) => path.join(FRONTEND, d))
  const offenders: string[] = []

  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        walk(full)
        continue
      }
      if (!/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) continue
      const src = fs.readFileSync(full, 'utf-8')
      // Static `from '...'` and `require('...')` only. A runtime fs read is exactly the fix, so
      // it must not be flagged: it resolves at run time, on a machine that has the file.
      const specs = [
        ...src.matchAll(/\bfrom\s+['"](\.[^'"]+)['"]/g),
        ...src.matchAll(/\brequire\(\s*['"](\.[^'"]+)['"]\s*\)/g),
      ].map((m) => m[1])
      for (const spec of specs) {
        const resolved = path.resolve(path.dirname(full), spec)
        if (!resolved.startsWith(FRONTEND + path.sep)) {
          offenders.push(`${path.relative(FRONTEND, full)} -> ${spec}`)
        }
      }
    }
  }
  roots.forEach(walk)

  assert(
    offenders.length === 0,
    `${offenders.length} import(s) resolve outside frontend/ and will fail in the deploy image, ` +
    `however well they build locally:\n      ${offenders.join('\n      ')}\n      ` +
    'Read the file at runtime with fs instead, or move it inside frontend/.',
  )
})
