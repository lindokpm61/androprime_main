/**
 * Guards content-doctor: its pure logic AND every invariant, against injected fixtures.
 *
 * WHY THIS EXISTS. The doctor's whole value is that it cannot report an unperformed check as a
 * pass. An earlier version of this suite tested only the helpers, so `inv1`…`inv8` were not
 * under test at all, and two tests asserted their own arithmetic rather than the doctor's.
 * A verification pass then proved the real defect: intercepting `content_renditions` and
 * returning `[]` made I4 and I5 print 🟢 PASS. That case is now the first test below.
 *
 * No network, no database, no credentials. It reads exactly one repo file from disk on purpose:
 * `scan.js`, because a vocabulary parser must be tested against the real source it parses.
 *
 * Run: npx tsx scripts/content-engine/test-content-doctor.ts
 */

import fs from 'fs'
import path from 'path'
import {
  classify, need, fileSlug, cleanVal, parseAsset, extractLiteral, stripComments, parseScannerVocab,
  isPastSchedule, todoMarkers, markerTier, extractCountAssertions, maskRetired, summarise, exitCodeFor,
  runStatusFor, runOutcomeFor, tableOk, tableFailed, emptyCtx, runInvariants, loadTable,
  inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8, COUNT_PATTERNS, VOCAB_MAP, PAGE,
  type Finding, type Invariant, type Verdict, type Store, type RepoCtx, type Queryable, type QueryResult,
  type AssetRow, type RenditionRow, type ChannelRow, type ArticleRow,
} from './content-doctor'

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
  ({ platform: 'linkedin', format: 'text-post', in_plan: true, ...o })
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
  assert(expected.includes('expected baseline'), 'a permanent gap must not read as a nightly alarm')
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
  assert(REAL_SCAN_JS, `scan.js not found at ${SCAN_JS_PATH}`)
  const { vocab, missing } = parseScannerVocab(REAL_SCAN_JS!, VOCAB_MAP.map(([n]) => n))
  assert(missing.length === 0, `unparsed vocabularies: ${missing.join(', ')}`)
  assert(vocab.PLATFORMS.includes('linkedin') && vocab.PLATFORMS.length === 5,
    `PLATFORMS wrong: ${JSON.stringify(vocab.PLATFORMS)}`)
  assert(vocab.REND_ORDER.includes('to-produce') && vocab.REND_ORDER.includes('thumbnail-done'),
    'quoted hyphenated object keys must parse')
  assert(vocab.STATUS_ORDER.includes('scripted') && vocab.THUMBS.includes('none'), 'the rest must parse')
})

check('a PARTIAL vocabulary makes I2 UNCHECKED, not silently narrowed', () => {
  // A vocabulary that failed to parse looks shorter than it is and invents violations.
  const s = store({ content_renditions: tableOk([rend({ platform: 'substack' })]) })
  const r = inv2(s, ctx({ scannerSrc: "const PLATFORMS = ['instagram'];" }))
  assert(r.verdict === 'UNCHECKED', `a partial parse must not produce violations, got ${r.verdict}`)
  assert(/missing or unparseable/.test(r.reason ?? ''), `and must say so: ${r.reason}`)
})

check('a value the DB holds and the scanner rejects is a real violation', () => {
  const s = store({ content_renditions: tableOk([rend({ platform: 'substack', format: 'newsletter' })]) })
  const msgs = violationsOf(inv2(s, ctx({ scannerSrc: REAL_SCAN_JS! }))).map((v) => v.message).join(' | ')
  assert(/platform = "substack"/.test(msgs), `substack divergence must be caught: ${msgs}`)
  assert(/format = "newsletter"/.test(msgs), `newsletter divergence must be caught: ${msgs}`)
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

// ════════════════════════════════════════════════════════ I3, I4, I5, I8

console.log('\n  — I3 / I4 / I5 / I8 —')

check('I3 is UNCHECKED-EXPECTED and lists what it WOULD check', () => {
  const s = store({ content_renditions: tableOk([
    rend({ id: 'rm', publisher: 'metricool', external_post_id: '356261849' }),
    rend({ id: 'ru', publisher: 'unipile', external_post_id: '748791694' }),
  ]) })
  const r = inv3(s)
  assert(r.verdict === 'UNCHECKED' && r.expected, 'a missing credential is a documented gap, not a new fault')
  assert(/METRICOOL_/.test(r.reason ?? ''), 'the missing credential must be named')
  const n = notesOf(r).map((x) => x.message).join(' | ')
  assert(/WOULD CHECK.*356261849/.test(n), 'the Metricool id must be listed as would-check')
  assert(/OUT OF SCOPE.*748791694/.test(n), 'a non-Metricool id must be excluded explicitly')
})

check('I3 stays in the list: it is never dropped for being unmeasurable', () => {
  const ids = runInvariants(store(), ctx(), new Date()).map((i) => i.id)
  assert(ids.includes('I3'), 'I3 must always appear; its visibility is the point')
  assert(ids.length === 8, `expected 8 invariants, got ${ids.length}: ${ids.join(',')}`)
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

check('I5 fails a live rendition on a non-green asset, and names the scan.js conflict', () => {
  const s = store({
    content_assets: tableOk([asset({ preflight: 'amber-ewa', ewa_task: 'https://clickup/t/1' })]),
    content_renditions: tableOk([rend({ status: 'published' })]),
  })
  const r = inv5(s)
  assert(r.verdict === 'FAIL', 'the plan says green')
  assert(/scan.js G2/.test(violationsOf(r)[0].fix ?? ''), 'the scan.js disagreement must be surfaced, not hidden')
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
