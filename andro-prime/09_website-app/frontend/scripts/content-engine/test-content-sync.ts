/**
 * Guards content-sync: every pure function, and the whole per-file decision layer.
 *
 * WHY THIS EXISTS. content-sync is the only script in the repo that WRITES INTO A FILE A HUMAN
 * WROTE. The frontmatter above the block and the script below it are craft that exists nowhere
 * else, so a bug here does not produce a wrong report, it produces lost work. The tests that
 * matter most are therefore the destructive ones: a half-present marker pair, a body containing
 * the word BEGIN and a markdown table of its own, and an asset with no database row.
 *
 * The second-most important is idempotence. A block that carries a fresh timestamp on every run
 * makes thirteen files show a diff on every run, and a file that always looks changed is a file
 * nobody reads.
 *
 * No network, no database and no credentials. Every function under test takes its text, its rows
 * and its clock as arguments. Two checks are deliberately not pure and say so in their own
 * names: the exit-discipline guard reads the two source files, and the exit-code determinism
 * guard runs content-sync as a real child process from a directory it cannot work in, which
 * needs no credentials because it refuses before it reaches the database.
 *
 * Run: npx tsx scripts/content-engine/test-content-sync.ts
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'

import {
  BEGIN_MARKER, END_MARKER, BEGIN_PREFIX, END_PREFIX,
  shortStamp, cell, ewaRow, approvalRow, sortRenditions, renditionLabel, postIdCell, renderStateBlock,
  sameIgnoringTimestamp,
  locateBlock, frontmatterEnd, applyBlock, planFile, exitCodeFor, renderDiff,
  denominatorProblem, settleExit, ignoreBrokenPipe,
  DB_OWNED_ASSET_KEYS, DB_OWNED_RENDITION_KEYS,
  ASSET_KEY_COLUMN, RENDITION_KEY_COLUMN, ASSET_SELECT, RENDITION_SELECT,
  STALE_KINDS, UNMEASURED_KINDS,
  type DbAsset, type DbRendition, type FilePlan,
} from './content-sync'

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

// ───────────────────────────────────────────────────────────────── fixtures

// Modelled on the one live asset that carries a business approval, because that is the row the
// blocker was found on: four-things-on-the-sheet, approved by Keith on 2026-07-31.
const asset = (o: Partial<DbAsset> = {}): DbAsset => ({
  id: 'a1', slug: 'four-things-on-the-sheet', status: 'approved',
  approved_by: 'Keith', approved_at: '2026-07-31',
  preflight: 'green', preflight_date: '2026-07-31',
  ewa_task: null, ewa_signed_at: null, drive_url: null,
  canonical_article_id: 'art1', ...o,
})
// scheduled_for carries the UTC-normalised shape PostgREST actually returns for the live
// 11:00 UK slot, so the fixtures test what the script really receives rather than what the
// asset file happens to say.
const rend = (o: Partial<DbRendition> = {}): DbRendition => ({
  asset_id: 'a1', platform: 'linkedin', format: 'text-post', variant: null, status: 'scheduled',
  scheduled_for: '2026-08-06T10:00:00+00:00', published_at: null,
  publisher: 'metricool', external_post_id: '356521803', external_url: null, ...o,
})

const FM = [
  '---',
  'slug: four-things-on-the-sheet',
  'title: The four things every line on a blood test is telling you',
  'content_type: educational',
  '---',
].join('\n')

/**
 * A body built to be hostile on purpose: it holds a markdown table of its own, the bare word
 * BEGIN, and a `---` rule that a sloppy frontmatter parser would read as a second fence.
 */
const BODY = [
  '## Chosen hook',
  '',
  'Line 1: BEGIN with the thing they already believe, then turn it.',
  '',
  '## Claim inheritance check',
  '',
  '| Script line | Source line |',
  '| --- | --- |',
  '| the four things | "every line is telling you four things" |',
  '',
  '---',
  '',
  '*Four-check: no em dashes; routes to the selector.*',
].join('\n')

const fileWithoutBlock = () => `${FM}\n\n${BODY}\n`

const block = (syncedAt = '2026-08-01T09:00:00.000Z', a = asset(), rs = [rend()]) =>
  renderStateBlock({ asset: a, renditions: rs, articleSlug: 'how-to-read-blood-test-results', syncedAt })

const fileWithBlock = (syncedAt?: string) => `${FM}\n\n${block(syncedAt)}\n\n${BODY}\n`

const plan = (o: Partial<Parameters<typeof planFile>[0]> = {}): FilePlan => planFile({
  file: 'andro-prime/06_marketing/content-machine/assets/2026-07-31-four-things-on-the-sheet.md',
  text: fileWithoutBlock(),
  asset: asset(),
  renditions: [rend()],
  articleSlug: 'how-to-read-blood-test-results',
  syncedAt: '2026-08-01T09:00:00.000Z',
  ...o,
})

// ═══════════════════════════════════════════════════════ the required cases

check('ROUND TRIP: render, replace, render again is byte-identical', () => {
  const first = applyBlock(fileWithoutBlock(), block(), '\n')
  assert(first.status === 'inserted', `expected inserted, got ${first.status}`)
  const second = applyBlock(first.text, block(), '\n')
  assert(second.status === 'unchanged', `a re-render of the same state must be unchanged, got ${second.status}`)
  assert(second.text === first.text, 'a second run over the same state must not change one byte')
})

check('IDEMPOTENT ACROSS A MOVING CLOCK: only the timestamp differs, so nothing is written', () => {
  const monday = applyBlock(fileWithoutBlock(), block('2026-08-01T09:00:00.000Z'), '\n')
  const tuesday = applyBlock(monday.text, block('2026-08-02T09:00:00.000Z'), '\n')
  assert(tuesday.status === 'unchanged', 'a fresh timestamp alone must not count as a change')
  assert(tuesday.text === monday.text, 'the OLD timestamp must be kept, or every file diffs every run')
  assert(tuesday.text.includes('2026-08-01T09:00:00.000Z'), 'the retained block must keep its original synced stamp')
  assert(!tuesday.text.includes('2026-08-02'), 'the new timestamp must not leak in when nothing else changed')
})

check('REAL STATE CHANGE still rewrites, and carries the new timestamp', () => {
  const before = applyBlock(fileWithoutBlock(), block('2026-08-01T09:00:00.000Z'), '\n')
  const moved = block('2026-08-02T09:00:00.000Z', asset(), [rend({ status: 'published', published_at: '2026-08-06T11:00:00+01:00' })])
  const after = applyBlock(before.text, moved, '\n')
  assert(after.status === 'replaced', `a genuine state change must rewrite, got ${after.status}`)
  assert(after.text.includes('2026-08-02T09:00:00.000Z'), 'a real change must carry the new synced stamp')
  assert(after.text.includes('| linkedin/text-post | published |'), 'the new rendition status must be mirrored')
})

check('A file with no block gains one immediately after the frontmatter, one blank line either side', () => {
  const out = applyBlock(fileWithoutBlock(), block(), '\n')
  assert(out.text.includes(`content_type: educational\n---\n\n${BEGIN_MARKER}`), 'the block must sit one blank line below the closing ---')
  assert(out.text.includes(`${END_MARKER}\n\n## Chosen hook`), 'the body must resume one blank line below the END marker')
  assert(out.text.startsWith(FM), 'frontmatter must be byte-identical')
  assert(out.text.endsWith(`${BODY}\n`), 'the body must be byte-identical')
})

check('An existing block is REPLACED, never duplicated', () => {
  const start = fileWithBlock('2026-08-01T09:00:00.000Z')
  const out = applyBlock(start, block('2026-08-02T09:00:00.000Z', asset({ status: 'done' })), '\n')
  assert(out.status === 'replaced', `expected replaced, got ${out.status}`)
  const begins = out.text.split(BEGIN_PREFIX).length - 1
  const ends = out.text.split(END_PREFIX).length - 1
  assert(begins === 1 && ends === 1, `exactly one marker pair must survive, found ${begins} BEGIN and ${ends} END`)
  assert(out.text.includes('| status | done |'), 'the replacement must carry the new state')
  assert(!out.text.includes('| status | approved |'), 'the old state must not survive alongside the new one')
})

check('NOTHING OUTSIDE THE MARKERS IS TOUCHED, including a body with its own table and the word BEGIN', () => {
  const start = fileWithBlock('2026-08-01T09:00:00.000Z')
  const loc = locateBlock(start)
  assert(loc.kind === 'found', 'the fixture must contain a locatable block')
  const head = start.slice(0, loc.start)
  const tail = start.slice(loc.end)
  const out = applyBlock(start, block('2026-08-02T09:00:00.000Z', asset({ status: 'done' })), '\n')
  const loc2 = locateBlock(out.text)
  assert(loc2.kind === 'found', 'the rewritten file must still contain a locatable block')
  assert(out.text.slice(0, loc2.start) === head, 'every byte before the BEGIN marker must be identical')
  assert(out.text.slice(loc2.end) === tail, 'every byte after the END marker must be identical')
  assert(out.text.includes('| Script line | Source line |'), "the body's own markdown table must survive")
  assert(out.text.includes('Line 1: BEGIN with the thing'), 'the bare word BEGIN in prose must survive')
  assert(out.text.includes('\n---\n\n*Four-check'), 'a --- rule inside the body must survive')
})

check('A HALF-PRESENT MARKER PAIR is refused, and the file is returned untouched', () => {
  const cases: Array<[string, string]> = [
    ['BEGIN with no END', `${FM}\n\n${BEGIN_MARKER}\n| status | approved |\n\n${BODY}\n`],
    ['END with no BEGIN', `${FM}\n\n${END_MARKER}\n\n${BODY}\n`],
    ['END before BEGIN', `${FM}\n\n${END_MARKER}\nstuff\n${BEGIN_MARKER}\n\n${BODY}\n`],
    ['two BEGINs', `${FM}\n\n${BEGIN_MARKER}\nx\n${BEGIN_MARKER}\ny\n${END_MARKER}\n\n${BODY}\n`],
  ]
  for (const [name, text] of cases) {
    const out = applyBlock(text, block(), '\n')
    assert(out.status === 'malformed', `${name}: expected malformed, got ${out.status}`)
    assert(out.text === text, `${name}: a refused file must be returned byte-identical`)
    assert((out.why ?? '').length > 0, `${name}: a refusal must say why`)
  }
})

check('A malformed file plans no write, and reports as stale so a human is sent to it', () => {
  const p = plan({ text: `${FM}\n\n${BEGIN_MARKER}\nhalf a block\n\n${BODY}\n` })
  assert(p.kind === 'malformed', `expected malformed, got ${p.kind}`)
  assert(p.write === null, 'a malformed file must never be written')
  assert(STALE_KINDS.includes(p.kind), 'damaged markers must reach exit 2, not be silently tolerated')
})

check('AMBER-EWA with a task and no signature renders as a ruling OWED, never as approved', () => {
  const a = asset({ preflight: 'amber-ewa', preflight_date: '2026-07-31', ewa_task: '869ecga1e', ewa_signed_at: null })
  const row = ewaRow(a, 'how-to-read-blood-test-results')
  assert(/RULING OWED/.test(row), `a routed-but-unanswered question must say so plainly, got: ${row}`)
  assert(row.includes('869ecga1e'), 'the owed ruling must name the task it was routed on')
  assert(!/\bsigned\b|\bapproved\b|\bcleared\b/i.test(row), `an unanswered ruling must not read as answered: ${row}`)
  // Inheritance must NOT be allowed to speak over an outstanding amber ruling.
  assert(!/inherited/.test(row), 'a canonical article does not discharge an amber-ewa ruling')
})

check('AMBER-EWA with no task at all still says the ruling is owed, and that nothing was routed', () => {
  const row = ewaRow(asset({ preflight: 'amber-ewa', ewa_task: null, ewa_signed_at: null }), 'an-article')
  assert(/RULING OWED/.test(row), `expected an owed ruling, got: ${row}`)
  assert(/nothing has even been routed/.test(row), `an unrouted amber must say so: ${row}`)
})

check('AMBER-EWA with a real signature is allowed to say signed', () => {
  const row = ewaRow(asset({ preflight: 'amber-ewa', ewa_task: '869ecga1e', ewa_signed_at: '2026-07-31T14:05:00+01:00' }), null)
  assert(row.startsWith('signed 2026-07-31 14:05'), `a real signature must be shown: ${row}`)
  assert(!/OWED/.test(row), 'a signed ruling is not owed')
})

check('Ewa row: inheritance, an unresolvable canonical id, a bare task, and none', () => {
  assert(ewaRow(asset(), 'how-to-read-blood-test-results') === 'inherited from canonical article how-to-read-blood-test-results',
    'the phase brief wording for inheritance must be exact')
  assert(/SLUG UNRESOLVED/.test(ewaRow(asset(), null)),
    'a canonical id that resolves to no article must say so rather than print a bare uuid as if it were a slug')
  const routed = ewaRow(asset({ canonical_article_id: null, ewa_task: '869ecga1e' }), null)
  assert(/routed to Ewa as task 869ecga1e/.test(routed) && /not an answered one/.test(routed),
    `a task on a non-amber asset is still only a question asked: ${routed}`)
  assert(ewaRow(asset({ canonical_article_id: null }), null) === 'none', 'nothing recorded must read as none')
})

check('AN ASSET WITH NO DB ROW is reported, not crashed on, and its file is untouched', () => {
  const text = fileWithoutBlock()
  const p = plan({ asset: null, renditions: [], articleSlug: null, text })
  assert(p.kind === 'no-row', `expected no-row, got ${p.kind}`)
  assert(p.write === null, 'a fileless-in-reverse asset must never be written to')
  assert(p.after === null, 'no state must be invented for a row that does not exist')
  assert(/no content_assets row with slug "four-things-on-the-sheet"/.test(p.why ?? ''), `the report must name the slug: ${p.why}`)
  assert(/invariant 1/.test(p.why ?? ''), 'the report must point at the detector that owns the mirror-image case, not duplicate it')
  assert(UNMEASURED_KINDS.includes(p.kind), 'an unmeasurable file must not be able to report as clean')
})

check('A no-row file that ALREADY has a block still reports, and still writes nothing', () => {
  const p = plan({ asset: null, renditions: [], articleSlug: null, text: fileWithBlock() })
  assert(p.kind === 'no-row', `expected no-row, got ${p.kind}`)
  assert(p.write === null, 'nothing may be written without a row to mirror')
  assert(p.before !== null && p.before.startsWith(BEGIN_PREFIX), 'the stale block that is there must still be surfaced')
})

// ═══════════════════════════════════════════════════════════ supporting logic

check('shortStamp never prints an hour without the zone it belongs to', () => {
  // PostgREST normalises timestamptz to UTC, so the 11:00 UK slot in the frontmatter arrives
  // here as 10:00+00:00. A bare "10:00" would tell a UK reader the wrong hour.
  assert(shortStamp('2026-08-06T10:00:00+00:00') === '2026-08-06 10:00 UTC',
    'a zero offset must be spelled UTC, for readers who do not read Z')
  assert(shortStamp('2026-08-06T11:00:00Z') === '2026-08-06 11:00 UTC', 'Z is UTC')
  assert(shortStamp('2026-08-06T11:00:00+01:00') === '2026-08-06 11:00 +01:00',
    'a non-zero offset must be shown exactly as it arrived, never converted')
  assert(shortStamp('2026-08-06T11:00:00') === '2026-08-06 11:00',
    'a timestamp with no zone must not be given one it never had')
  assert(shortStamp('2026-07-31') === '2026-07-31', 'a bare date has no time and so no zone')
  assert(shortStamp(null) === '' && shortStamp('') === '', 'nothing in, nothing out')
  assert(shortStamp('sometime next week') === 'sometime next week', 'anything unparseable is passed through, never guessed at')
})

check('cell neutralises a pipe and a newline so one value cannot break the table', () => {
  assert(cell('a|b') === 'a\\|b', 'a pipe must be escaped')
  assert(cell('a\nb') === 'a b', 'a newline must not split a row')
  assert(cell(null) === '', 'null is an empty cell, not the string null')
})

check('renditions sort deterministically, and the order does not depend on the row order', () => {
  const a = rend({ platform: 'youtube', format: 'short' })
  const b = rend({ platform: 'instagram', format: 'reel' })
  const c = rend({ platform: 'instagram', format: 'short' })
  const one = sortRenditions([a, b, c]).map((r) => `${r.platform}/${r.format}`)
  const two = sortRenditions([c, a, b]).map((r) => `${r.platform}/${r.format}`)
  assert(one.join() === two.join(), 'two orderings of the same rows must render the same block, or nothing is idempotent')
  assert(one[0] === 'instagram/reel' && one[2] === 'youtube/short', `unexpected order: ${one.join(', ')}`)
})

check('three renditions sharing a platform and format are told apart by their variant', () => {
  // Allowed for the first time on 2026-08-14, when `variant` joined the unique key. Without a
  // label the mirror would print three identical `instagram/carousel` lines, which shows the
  // reader less than the table it is mirroring.
  const rs = ['C', 'A', 'B'].map((v) => rend({ platform: 'instagram', format: 'carousel', variant: v }))
  const labels = sortRenditions(rs).map(renditionLabel)
  assert(labels.join() === 'instagram/carousel A,instagram/carousel B,instagram/carousel C', `unexpected: ${labels.join(', ')}`)
  const out = renderStateBlock({ asset: asset(), renditions: rs, articleSlug: 'x', syncedAt: 't' })
  for (const v of 'ABC') assert(out.includes(`| instagram/carousel ${v} |`), `variant ${v} should have its own row`)
})

check('a rendition with NO variant renders exactly as it did before the column existed', () => {
  assert(renditionLabel(rend()) === 'linkedin/text-post', 'no variant, no suffix')
  assert(renditionLabel(rend({ variant: null })) === 'linkedin/text-post', 'an explicit null is the same thing')
  // The idempotence guarantee is byte-level, so a column that rendered anything at all for the
  // 44 pre-existing renditions would rewrite every asset file on the next run for no reason.
  const out = renderStateBlock({ asset: asset(), renditions: [rend()], articleSlug: 'x', syncedAt: 't' })
  assert(out.includes('| linkedin/text-post | scheduled |'), 'the row must be byte-identical to the pre-2026-08-14 shape')
})

check('postIdCell joins what exists and invents nothing', () => {
  assert(postIdCell(rend()) === 'metricool 356521803', 'publisher and id read as one identity')
  assert(postIdCell(rend({ external_post_id: null })) === 'metricool', 'a publisher with no id is still a fact')
  assert(postIdCell(rend({ publisher: null, external_post_id: null })) === '', 'nothing known is an empty cell')
})

check('the rendered block matches the format the stripper and the doctor will look for', () => {
  const b = block('2026-08-01T09:00:00.000Z')
  const lines = b.split('\n')
  assert(lines[0] === BEGIN_MARKER, 'line 1 must be the exact BEGIN marker')
  assert(lines[lines.length - 1] === END_MARKER, 'the last line must be the exact END marker')
  assert(lines[1] === '_Synced 2026-08-01T09:00:00.000Z from content_assets / content_renditions._', `bad synced line: ${lines[1]}`)
  assert(b.includes('| status | approved |'), 'the status row must be present')
  assert(b.includes('| approved (business) | Keith, 2026-07-31 |'), 'Keith\'s business approval must be a row of its own')
  assert(b.includes('| preflight | green (2026-07-31) |'), 'preflight must carry its date in brackets')
  assert(b.includes('| Ewa | inherited from canonical article how-to-read-blood-test-results |'), 'the Ewa row must match the brief')
  assert(b.includes('| drive | none |'), 'an absent drive folder must read as none, not blank')
  assert(b.includes('| linkedin/text-post | scheduled | 2026-08-06 10:00 UTC |  | metricool 356521803 |  |'), `rendition row wrong:\n${b}`)
  // Written as an escape, not as the character: the em-dash ban is absolute, and a test file
  // that carries the literal puts it back into the repo it is policing.
  assert(!b.includes(String.fromCharCode(0x2014)), 'no em dashes: absolute repo rule')
})

check('an asset with no renditions says so in words rather than showing an empty table', () => {
  const b = renderStateBlock({ asset: asset(), renditions: [], articleSlug: 'x', syncedAt: 't' })
  assert(b.includes('_No rows in content_renditions for this asset._'),
    'an empty table body is indistinguishable from a table that failed to render')
  assert(!b.includes('| rendition | status |'), 'no header should be printed for nothing')
})

check('sameIgnoringTimestamp ignores only the synced line', () => {
  const a = block('2026-08-01T09:00:00.000Z')
  assert(sameIgnoringTimestamp(a, block('2027-01-01T00:00:00.000Z')), 'the synced line alone must not count as a difference')
  assert(!sameIgnoringTimestamp(a, block('2026-08-01T09:00:00.000Z', asset({ status: 'done' }))), 'a status change must count')
  assert(sameIgnoringTimestamp(a, a.replace(/\n/g, '\r\n')), 'a line-ending change alone is not a state change')
})

check('frontmatterEnd is not fooled by a --- rule in the body, and returns null when there is none', () => {
  const end = frontmatterEnd(fileWithoutBlock())
  assert(end !== null && fileWithoutBlock().slice(0, end).endsWith('---\n'), 'the fence must close on the frontmatter')
  assert(frontmatterEnd('## heading\n\nprose\n\n---\n\nmore\n') === null, 'a body rule is not a frontmatter fence')
  assert(frontmatterEnd('---\nslug: x\nnever closed\n') === null, 'an unterminated fence is not frontmatter')
})

check('a file with no frontmatter is refused rather than having a block dropped into prose', () => {
  const text = '## Chosen hook\n\nprose that is somebody\'s work\n'
  const out = applyBlock(text, block(), '\n')
  assert(out.status === 'no-frontmatter', `expected no-frontmatter, got ${out.status}`)
  assert(out.text === text, 'a refused file must come back byte-identical')
  const p = plan({ text })
  assert(p.write === null && UNMEASURED_KINDS.includes(p.kind), 'no frontmatter means unmeasured, not clean')
})

check('CRLF files keep their line endings', () => {
  const p = plan({ text: fileWithoutBlock().replace(/\n/g, '\r\n') })
  assert(p.kind === 'inserted', `expected inserted, got ${p.kind}`)
  assert(!/[^\r]\n/.test(p.write ?? ''), 'a CRLF file must not come back with mixed line endings')
})

check('exitCodeFor: stale outranks unmeasured, and only a fully current run is 0', () => {
  const p = (kind: FilePlan['kind']): FilePlan =>
    ({ file: 'f', slug: 's', kind, before: null, after: null, write: null })
  assert(exitCodeFor([p('unchanged')]) === 0, 'all current is 0')
  assert(exitCodeFor([p('unchanged'), p('no-row')]) === 3, 'an unmeasured file must never report as clean')
  assert(exitCodeFor([p('no-row'), p('replaced')]) === 2, 'a stale block is the louder alarm')
  assert(exitCodeFor([p('malformed')]) === 2, 'damaged markers are an alarm, not a shrug')
})

check('renderDiff shows the whole change, because the whole change is the block', () => {
  const inserted = plan()
  const d = renderDiff(inserted)
  assert(/no generated block yet/.test(d), 'an insert must say there was nothing before')
  assert(d.includes(`+ ${BEGIN_MARKER}`), 'the new block must be shown as an addition')
  const replaced = plan({ text: fileWithBlock('2026-08-01T09:00:00.000Z'), asset: asset({ status: 'done' }) })
  assert(replaced.kind === 'replaced', `expected replaced, got ${replaced.kind}`)
  const d2 = renderDiff(replaced)
  assert(d2.includes('- | status | approved |') && d2.includes('+ | status | done |'), `both sides must be shown:\n${d2}`)
})

// ══════════════════════════════════ the mirror must carry what the stripper deletes
//
// The blocker a safety review found on 2026-08-01: the split named `approved_by` and
// `approved_date` as database-owned, `content_assets` had neither column, and the block had no
// row for either. Stripping them would have deleted Keith's own business approval from every
// live store. The columns were added (20260801_content_assets_business_approval.sql, with the
// one live pair backfilled) and the block gained its row; these checks are what stops the hole
// being reopened quietly, from either end: a key added to the delete list with no mirror row, or
// a key mapped to a column that is never read.

/** One sentinel per database-owned asset key, and the exact text it must produce in the block. */
const ASSET_SENTINELS: Record<string, { apply: (a: DbAsset) => DbAsset; expect: string }> = {
  status: { apply: (a) => ({ ...a, status: 'SENTINEL-STATUS' }), expect: 'SENTINEL-STATUS' },
  approved_by: { apply: (a) => ({ ...a, approved_by: 'SENTINEL-APPROVER' }), expect: 'SENTINEL-APPROVER' },
  approved_date: { apply: (a) => ({ ...a, approved_at: '2031-05-06' }), expect: '2031-05-06' },
  preflight: { apply: (a) => ({ ...a, preflight: 'SENTINEL-PREFLIGHT' }), expect: 'SENTINEL-PREFLIGHT' },
  preflight_date: { apply: (a) => ({ ...a, preflight_date: '2031-01-02' }), expect: '2031-01-02' },
  ewa_task: { apply: (a) => ({ ...a, ewa_task: 'SENTINEL-TASK' }), expect: 'SENTINEL-TASK' },
  ewa_signed_at: { apply: (a) => ({ ...a, ewa_signed_at: '2031-02-03T04:05:00+00:00' }), expect: '2031-02-03 04:05 UTC' },
  drive: { apply: (a) => ({ ...a, drive_url: 'https://drive.example/SENTINEL-DRIVE' }), expect: 'SENTINEL-DRIVE' },
}

const REND_SENTINELS: Record<string, { apply: (r: DbRendition) => DbRendition; expect: string }> = {
  status: { apply: (r) => ({ ...r, status: 'SENTINEL-REND-STATUS' }), expect: 'SENTINEL-REND-STATUS' },
  url: { apply: (r) => ({ ...r, external_url: 'https://x.example/SENTINEL-URL' }), expect: 'SENTINEL-URL' },
  publish_date: { apply: (r) => ({ ...r, published_at: '2031-03-04T05:06:00+00:00' }), expect: '2031-03-04 05:06 UTC' },
  scheduled_for: { apply: (r) => ({ ...r, scheduled_for: '2031-04-05T06:07:00+00:00' }), expect: '2031-04-05 06:07 UTC' },
  publisher: { apply: (r) => ({ ...r, publisher: 'SENTINEL-PUBLISHER' }), expect: 'SENTINEL-PUBLISHER' },
  external_post_id: { apply: (r) => ({ ...r, external_post_id: 'SENTINEL-POST-ID' }), expect: 'SENTINEL-POST-ID' },
}

check('EVERY KEY THE STRIPPER DELETES IS CARRIED BY THE BLOCK, or the fact leaves the repo', () => {
  const assetKeys = [...DB_OWNED_ASSET_KEYS] as string[]
  const rendKeys = [...DB_OWNED_RENDITION_KEYS] as string[]
  // A key added to the delete list with no sentinel here fails immediately, so this check can
  // never be outgrown in silence.
  assert(assetKeys.slice().sort().join() === Object.keys(ASSET_SENTINELS).sort().join(),
    `the asset delete list and the sentinels have come apart: [${assetKeys.join(', ')}] vs [${Object.keys(ASSET_SENTINELS).join(', ')}]`)
  assert(rendKeys.slice().sort().join() === Object.keys(REND_SENTINELS).sort().join(),
    `the rendition delete list and the sentinels have come apart: [${rendKeys.join(', ')}] vs [${Object.keys(REND_SENTINELS).join(', ')}]`)

  let a = asset()
  for (const k of assetKeys) a = ASSET_SENTINELS[k].apply(a)
  let r = rend()
  for (const k of rendKeys) r = REND_SENTINELS[k].apply(r)
  const b = renderStateBlock({ asset: a, renditions: [r], articleSlug: 'an-article', syncedAt: 't' })

  for (const k of assetKeys) {
    assert(b.includes(ASSET_SENTINELS[k].expect),
      `content_assets."${k}" is on the stripper's delete list but "${ASSET_SENTINELS[k].expect}" is nowhere in the block. Once that key is stripped the fact lives in the database alone and no reader of the file will ever see it:\n${b}`)
  }
  for (const k of rendKeys) {
    assert(b.includes(REND_SENTINELS[k].expect),
      `content_renditions."${k}" is on the delete list but "${REND_SENTINELS[k].expect}" is nowhere in the block:\n${b}`)
  }
})

check('KEITH\'S BUSINESS APPROVAL SURVIVES THE STRIPPER: the blocker, in the live shape it was found in', () => {
  // The exact live pair, on the exact live slug. This is the file the stripper was about to
  // empty: 2026-07-31-four-things-on-the-sheet.md, "approved_by: Keith", "approved_date: 2026-07-31".
  const b = renderStateBlock({
    asset: asset({ approved_by: 'Keith', approved_at: '2026-07-31' }),
    renditions: [rend()], articleSlug: 'how-to-read-blood-test-results', syncedAt: 't',
  })
  assert(b.includes('Keith'), `the approver must appear in the block, or stripping approved_by deletes him:\n${b}`)
  assert(/\| approved \(business\) \| Keith, 2026-07-31 \|/.test(b),
    `the approval must be one unambiguous row, not two facts scattered:\n${b}`)
  const del = [...DB_OWNED_ASSET_KEYS] as string[]
  assert(del.includes('approved_by') && del.includes('approved_date'),
    'both approval keys must be on the delete list now that columns hold them, or the dual store survives in the one file that has it')
  // Distinct from the clinical sign-off, which is a different act by a different person.
  assert(!/Ewa/.test(approvalRow(asset())), 'business approval is Keith\'s decision, never Ewa\'s ruling')
})

check('an approval that was never recorded is SAID, not left blank', () => {
  // Twelve of the thirteen approved assets predate the convention. A blank cell would read as
  // "no approval was needed" when the truth is "nobody wrote down who gave it".
  const silent = approvalRow(asset({ approved_by: null, approved_at: null, status: 'approved' }))
  assert(/not recorded/.test(silent), `an approved asset with no approver must say so: ${silent}`)
  assert(/an approval happened/.test(silent), `it must not read as an alarm: the approval is real, only its record is missing: ${silent}`)
  assert(approvalRow(asset({ approved_by: null, approved_at: null, status: 'done' })).includes('not recorded'),
    'done is past the approval gate too')
  assert(approvalRow(asset({ approved_by: null, approved_at: null, status: 'scripted' })) === 'none',
    'an asset that has not reached the gate has nothing missing, so it must not be nagged about')
  assert(approvalRow(asset({ approved_by: 'Keith', approved_at: null })) === 'Keith (no approval date recorded)',
    'half a record must be shown as half a record')
  assert(approvalRow(asset({ approved_by: null, approved_at: '2026-07-31' })) === '2026-07-31 (no approver recorded)',
    'a date with no name is not an approval by nobody')
})

check('EVERY MIRRORED KEY NAMES A COLUMN, AND EVERY COLUMN IS ACTUALLY SELECTED', () => {
  // The half-fix that would have been worse than the blocker: add the column, map the key to it,
  // and forget to fetch it. The cell renders empty forever, which is indistinguishable from a
  // fact that was never recorded, and the frontmatter copy is gone by then.
  const assetCols = ASSET_SELECT.split(',')
  const rendCols = RENDITION_SELECT.split(',')
  assert([...DB_OWNED_ASSET_KEYS].sort().join() === Object.keys(ASSET_KEY_COLUMN).sort().join(),
    'every database-owned asset key must name the column that owns it')
  assert([...DB_OWNED_RENDITION_KEYS].sort().join() === Object.keys(RENDITION_KEY_COLUMN).sort().join(),
    'every database-owned rendition key must name the column that owns it')
  for (const [k, col] of Object.entries(ASSET_KEY_COLUMN)) {
    assert(assetCols.includes(col), `frontmatter "${k}" maps to content_assets.${col}, which ASSET_SELECT never fetches`)
  }
  for (const [k, col] of Object.entries(RENDITION_KEY_COLUMN)) {
    assert(rendCols.includes(col), `frontmatter "${k}" maps to content_renditions.${col}, which RENDITION_SELECT never fetches`)
  }
  // The three deliberate name changes, pinned. A stripper that assumes the names match would
  // look for a column that does not exist, find nothing to lose, and delete the key anyway.
  assert(ASSET_KEY_COLUMN.approved_date === 'approved_at', 'approved_date is stored as approved_at')
  assert(ASSET_KEY_COLUMN.drive === 'drive_url', 'drive is stored as drive_url')
  assert(RENDITION_KEY_COLUMN.url === 'external_url' && RENDITION_KEY_COLUMN.publish_date === 'published_at',
    'the rendition names differ too')
})

check('a canonical article never silences a routing that is on the record', () => {
  // The live shape this was found on: green pre-flight, a canonical article to inherit from,
  // and an ewa_task recorded. The first version returned the inheritance sentence alone.
  const row = ewaRow(asset({ preflight: 'green', ewa_task: '869ecg9jd', ewa_signed_at: null }), 'an-article')
  assert(row.includes('inherited from canonical article an-article'), `inheritance must still be stated: ${row}`)
  assert(row.includes('869ecg9jd'), `a recorded routing must never be dropped: ${row}`)
  assert(/not an answered one/.test(row), `and it must still read as a question, not a ruling: ${row}`)
})

// ══════════════════════════════════════════════ an empty read is not a clean read

check('NOTHING MEASURED IS NOT CLEAN: zero asset files can never report as 0', () => {
  assert(exitCodeFor([]) === 3,
    'an empty plan list used to return 0, so an emptied assets/ directory rendered as "every generated block is current" over nothing')
  const p = denominatorProblem(0, 23)
  assert(p !== null && /NOTHING WAS MEASURED/.test(p) && p.includes('23'),
    `an empty read must be stated in words, with the denominator that proves it: ${p}`)
  assert(denominatorProblem(0, 0) !== null, 'both stores empty is even less of a pass')
  assert(denominatorProblem(13, 23) === null, 'a real read is not a problem')
})

// ════════════════════════════════════════ the exit code is the alarm, so it must be reliable

check('settleExit sets a code and does NOT kill the process', () => {
  // Two objects rather than one, so neither assertion can be satisfied by a stale value.
  const alarm: { exitCode?: number | string } = {}
  const clean: { exitCode?: number | string } = {}
  settleExit(2, alarm)
  settleExit(0, clean)
  assert(alarm.exitCode === 2, `expected the alarm code to be set, got ${alarm.exitCode}`)
  assert(clean.exitCode === 0, `expected a clean code to be set, got ${clean.exitCode}`)
})

check('A READER THAT WALKS AWAY CANNOT CHANGE THE VERDICT: the EPIPE half of the 127 defect', () => {
  // Measured on 2026-08-01, after the forced exit was removed: `--check 2>&1 | head -3` still
  // returned "... 2 127 2 127 2 2 2 2 2 1 ..." over 25 runs, because head closes the pipe after
  // three lines. The 1 is the worst of the three: it is content-sync's own "could not run" code.
  const handlers: Array<(e: NodeJS.ErrnoException) => void> = []
  const fake = { on: (_ev: 'error', fn: (e: NodeJS.ErrnoException) => void) => { handlers.push(fn) } }

  const verdict: { exitCode?: number | string } = { exitCode: 2 }
  ignoreBrokenPipe([fake, fake], verdict)
  assert(handlers.length === 2, `every stream must be guarded, got ${handlers.length} handler(s)`)
  for (const h of handlers) h(Object.assign(new Error('write EPIPE'), { code: 'EPIPE' }))
  assert(verdict.exitCode === 2,
    `a closed pipe must leave the verdict alone, got ${verdict.exitCode}. Whether anyone was still reading is not a fact about the repo.`)

  // Anything else really is a failure to report, and must not pass as clean.
  const broken: { exitCode?: number | string } = { exitCode: 0 }
  handlers.length = 0
  ignoreBrokenPipe([fake], broken)
  handlers[0](Object.assign(new Error('write EACCES'), { code: 'EACCES' }))
  assert(broken.exitCode === 1, `a verdict that could not be printed at all must not read as 0, got ${broken.exitCode}`)
})

check('NEITHER FILE FORCES AN EXIT: the libuv abort that returned 127 one run in five', () => {
  const files = ['content-sync.ts', 'test-content-sync.ts']
  const forced = /process\.exit\s*\(/
  for (const f of files) {
    const abs = path.resolve(process.cwd(), 'scripts/content-engine', f)
    assert(fs.existsSync(abs), `cannot read ${abs}: run this suite from 09_website-app/frontend`)
    const src = fs.readFileSync(abs, 'utf-8')
    assert(!forced.test(src),
      `${f} forces the process down while the keep-alive socket and the tsx loader are still closing. On Windows that trips "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)" and returns 127 instead of the verdict, on roughly one run in five. Set process.exitCode and return instead.`)
  }
})

/**
 * The same run, repeated, must give the same code. Deliberately run from a directory content-sync
 * refuses to work in: that is the one exit path reachable with no credentials and no database, so
 * the suite stays offline while still exercising a REAL process teardown under the tsx loader.
 *
 * SAY PLAINLY WHAT IT DOES NOT COVER, because this was measured rather than assumed. The aborts
 * happened on runs that had opened a Supabase socket, and this child refuses on cwd before it
 * reaches the database. Reintroducing `process.exit` deliberately on 2026-08-01 left all 20 of
 * these runs green and failed only the source check above. So this loop guards the loader half of
 * the race and the shape of a real teardown; the SOURCE CHECK is the guard that actually catches
 * the defect coming back, and the live 20-run proof of each mode is a hand-run against the real
 * database, recorded in the phase report rather than paid for on every suite run.
 */
check('THE SAME RUN GIVES THE SAME EXIT CODE, over 20 repeated real child processes', () => {
  const tsxCli = path.resolve(process.cwd(), 'node_modules/tsx/dist/cli.mjs')
  const script = path.resolve(process.cwd(), 'scripts/content-engine/content-sync.ts')
  assert(fs.existsSync(tsxCli), `no tsx at ${tsxCli}: run this suite from 09_website-app/frontend`)
  assert(fs.existsSync(script), `no content-sync at ${script}`)

  // Twenty, not five, because the defect was measured at roughly one run in five: a loop of five
  // has better than a one-in-three chance of missing it entirely, and a guard that passes by
  // luck one time in three is not a guard.
  const RUNS = 20
  const codes: Array<number | null> = []
  let sawRefusal = 0
  let sawAbort = 0
  for (let i = 0; i < RUNS; i++) {
    const run = spawnSync(process.execPath, [tsxCli, script, '--check'], {
      cwd: os.tmpdir(), encoding: 'utf-8', timeout: 120_000,
    })
    codes.push(run.status)
    const err = run.stderr ?? ''
    if (/CANNOT RUN FROM HERE/.test(err)) sawRefusal++
    if (/UV_HANDLE_CLOSING|Assertion failed/.test(err)) sawAbort++
  }
  assert(sawRefusal === RUNS,
    `every run must have taken the cwd-refusal path, or this proves nothing about exit codes: ${sawRefusal} of ${RUNS}`)
  assert(sawAbort === 0,
    `${sawAbort} of ${RUNS} runs printed a libuv assertion. The process is being torn down while a handle is still closing.`)
  assert(codes.every((c) => c === 1),
    `every run must return exactly 1. Got: ${codes.join(' ')}. A 127 is the libuv abort; anything else is a new failure.`)
})

// ═══════════════════════════════════════ text that could mint or eat a marker

check('a database value carrying a marker cannot mint a second one', () => {
  const poisoned = `https://drive.example/x ${END_MARKER} tail`
  const b = renderStateBlock({ asset: asset({ drive_url: poisoned }), renditions: [rend()], articleSlug: 'x', syncedAt: 't' })
  assert(b.split(END_PREFIX).length - 1 === 1, `exactly one END marker may exist in a block:\n${b}`)
  assert(b.split(BEGIN_PREFIX).length - 1 === 1, 'exactly one BEGIN marker may exist in a block')
  // And the file it produces must still be re-syncable rather than jammed as malformed forever.
  const first = applyBlock(fileWithoutBlock(), b, '\n')
  assert(first.status === 'inserted', `expected inserted, got ${first.status}`)
  const second = applyBlock(first.text, b, '\n')
  assert(second.status === 'unchanged', `a poisoned value must not jam the mirror: ${second.status} (${second.why ?? ''})`)
  assert(b.includes('END GENERATED STATE'), 'the value itself is still shown, neutralised rather than hidden')
})

check('a marker sharing its line with a human\'s text is REFUSED, not silently eaten', () => {
  const cases: Array<[string, string]> = [
    ['text before BEGIN', `${FM}\n\nKEEP-BEFORE ${BEGIN_MARKER}\nx\n${END_MARKER}\n\n${BODY}\n`],
    ['text after END', `${FM}\n\n${BEGIN_MARKER}\nx\n${END_MARKER} KEEP-AFTER\n\n${BODY}\n`],
  ]
  for (const [name, text] of cases) {
    const out = applyBlock(text, block(), '\n')
    assert(out.status === 'malformed', `${name}: expected malformed, got ${out.status}`)
    assert(out.text === text, `${name}: the file must come back byte-identical`)
    assert(/shares its line/.test(out.why ?? ''), `${name}: the refusal must say what it saw: ${out.why}`)
    assert(out.text.includes('KEEP-'), `${name}: the human's text must still be there`)
  }
})

console.log(
  failures === 0
    ? '\n🟢 content-sync: all clean. The mirror writes only between its markers, and never invents state.\n'
    : `\n🔴 content-sync: ${failures} failure(s).\n`,
)
// Set, never forced: the same rule the script under test follows, and for the same reason.
process.exitCode = failures === 0 ? 0 : 1
