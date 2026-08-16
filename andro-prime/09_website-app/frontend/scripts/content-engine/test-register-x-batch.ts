/**
 * Guards register-x-batch: the parse, the refusals, and the two ways a re-run could destroy state.
 *
 * WHY THIS EXISTS. This tool is the only thing standing between a hand-written batch draft and
 * seven database rows whose `body` is what gets published to a live public account. Its failure
 * directions are asymmetric.
 *
 * Registering something wrong puts unreviewed or over-length copy into the column the scheduler
 * ships from. Both have already happened on this lane without a tool: on 2026-08-16 a batch was
 * drafted with a thread post at 286 characters and all seven self-reported character counts wrong,
 * and separately a rendition reached `scheduled` carrying an internal note instead of a post.
 *
 * Refusing something that WAS ready is the other half, and it is why the refusals are tested by
 * name rather than by count: a refusal nobody can read is indistinguishable from the tool being
 * broken.
 *
 * The two most important cases are at the bottom. A re-run must not walk an asset backwards out of
 * `done`, and must not reset a rendition that is already live in Metricool: the draft file is the
 * source of COPY, never of live state, and a tool that forgets that manufactures exactly the drift
 * the content machine exists to prevent.
 *
 * No network, no database, no credentials. Every entry point takes its inputs as arguments.
 *
 * Run: npx tsx scripts/content-engine/test-register-x-batch.ts
 */
import {
  parseFrontmatter, parseBatch, validate, toUtcIso, laterStatus, render, X_LIMIT,
} from './register-x-batch'

let failures = 0

function check(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`) }
  catch (e) { failures += 1; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`) }
}
function assert(cond: unknown, msg: string) { if (!cond) throw new Error(msg) }

/** A minimal well-formed batch. Individual cases mutate one thing so the failure is unambiguous. */
function draft(opts: { fm?: string; posts?: string } = {}) {
  const fm = opts.fm ?? [
    'batch: x-week-99', 'queue_row: X-99', 'week_of: 2026-08-17', 'platform: x',
    'format: text-post', 'publisher: metricool', 'canonical_asset: some-article',
    'preflight: green', 'preflight_date: 2026-08-16', 'approved_by: Keith', 'approved_date: 2026-08-16',
  ].join('\n')
  const posts = opts.posts ?? [
    '## Monday, marker fact', '', '`slug: x-w99-1-a`', '`slot: 2026-08-17T08:10`', '`title: A`', '',
    '> Short and well within the ceiling.', '', '`34 characters. No link.`',
  ].join('\n')
  return `---\n${fm}\n---\n\n# Batch\n\n${posts}\n`
}

console.log('\nregister-x-batch\n')

// ── Frontmatter

check('a literal `null` parses as ABSENT, not as the truthy string "null"', () => {
  const fm = parseFrontmatter('---\napproved_by: null\nqueue_row: X-01\n---\n')
  assert(fm.approved_by === undefined, `approved_by came back as ${JSON.stringify(fm.approved_by)}`)
  assert(fm.queue_row === 'X-01', 'a real value must still parse')
})

check('an empty value is absent too, so a blank line cannot approve a batch', () => {
  assert(parseFrontmatter('---\napproved_by:\n---\n').approved_by === undefined, 'blank approved_by must be absent')
})

// ── Parse

check('one post parses with its slug, slot, title and measured length', () => {
  const d = parseBatch(draft())
  assert(d.posts.length === 1, `parsed ${d.posts.length} posts`)
  const p = d.posts[0]
  assert(p.slug === 'x-w99-1-a', p.slug)
  assert(p.slotLocal === '2026-08-17T08:10', String(p.slotLocal))
  assert(p.byHand === false, 'not by hand')
  assert(p.measuredChars === [...p.body].length, 'measured length must be derived, never taken from the file')
})

check('a thread is many blockquotes in ONE section, joined, and stays one post', () => {
  const d = parseBatch(draft({ posts: [
    '## Sunday, thread', '', '`slug: x-w99-7-t`', '`slot: by-hand`', '`title: T`', '',
    '**1/**', '> First unit.', '', '**2/**', '> Second unit.',
  ].join('\n') }))
  assert(d.posts.length === 1, `a thread must be ONE row, got ${d.posts.length}`)
  assert(d.posts[0].body === 'First unit.\n\nSecond unit.', JSON.stringify(d.posts[0].body))
  assert(d.posts[0].byHand === true, 'slot: by-hand must set byHand')
})

check('the link-out reply URL is picked up as first_comment', () => {
  const d = parseBatch(draft({ posts: [
    '## Thursday, link-out', '', '`slug: x-w99-4-d`', '`slot: 2026-08-20T12:35`', '`title: D`', '',
    '> Body copy.', '',
    '`10 characters. Link goes in a REPLY, not the post:` https://example.com/a?utm_source=x',
  ].join('\n') }))
  assert(d.posts[0].firstComment === 'https://example.com/a?utm_source=x', String(d.posts[0].firstComment))
  assert(!d.posts[0].body.includes('http'), 'the link must NOT reach the post body: X suppresses posts carrying one')
})

// ── Refusals, each by name

const why = (d: string) => validate(parseBatch(d)).map((r) => r.why).join(' | ')

check(`a post over ${X_LIMIT} characters is refused`, () => {
  const long = 'x'.repeat(X_LIMIT + 1)
  assert(/over X's 280 ceiling/.test(why(draft({ posts:
    `## M\n\n\`slug: s\`\n\`slot: 2026-08-17T08:10\`\n\`title: T\`\n\n> ${long}\n` }))), 'must refuse an over-length post')
})

check('a by-hand thread is NOT held to the per-post ceiling', () => {
  const long = 'x'.repeat(X_LIMIT + 1)
  assert(!/ceiling/.test(why(draft({ posts:
    `## S\n\n\`slug: s\`\n\`slot: by-hand\`\n\`title: T\`\n\n> ${long}\n` }))),
    'a thread is posted unit by unit, so the whole-section length is not one post')
})

check('a claimed character count that disagrees with the copy is refused', () => {
  assert(/claims 999 characters and the copy measures/.test(why(draft({ posts:
    '## M\n\n`slug: s`\n`slot: 2026-08-17T08:10`\n`title: T`\n\n> Short.\n\n`999 characters. No link.`\n' }))),
    'the whole point of the field is that it is checked')
})

check('a post with no slot is refused, because choosing when it goes out is editorial', () => {
  assert(/no `slot:` line/.test(why(draft({ posts: '## M\n\n`slug: s`\n`title: T`\n\n> Short.\n' }))), 'must refuse')
})

check('a malformed slot is refused rather than silently misparsed', () => {
  assert(/is not `YYYY-MM-DDTHH:mm`/.test(why(draft({ posts:
    '## M\n\n`slug: s`\n`slot: Monday 8am`\n`title: T`\n\n> Short.\n' }))), 'must refuse a slot it cannot read')
})

check('a post with no slug is refused: the slug is the only join to the database', () => {
  assert(/no `slug:` line/.test(why(draft({ posts: '## M\n\n`title: T`\n\n> Short.\n' }))), 'must refuse')
})

check('an empty blockquote is refused, so a slot cannot be booked with no copy', () => {
  assert(/no copy to ship/.test(why(draft({ posts:
    '## M\n\n`slug: s`\n`slot: 2026-08-17T08:10`\n`title: T`\n\nNot a blockquote.\n' }))), 'must refuse')
})

check('a duplicate slug inside one batch is refused', () => {
  const one = '## M\n\n`slug: dupe`\n`slot: 2026-08-17T08:10`\n`title: T`\n\n> Copy.\n'
  assert(/duplicate slug/.test(why(draft({ posts: one + '\n' + one }))), 'two rows cannot share a slug')
})

check('a batch that is not pre-flight green is refused: this tool records a verdict, it does not reach one', () => {
  assert(/not "green"/.test(why(draft({ fm: 'platform: x\nformat: text-post\npublisher: metricool\ncanonical_asset: a\nqueue_row: X\nweek_of: 2026-08-17\npreflight: amber-ewa' }))),
    'amber must not register')
})

check('a well-formed batch produces NO refusals', () => {
  assert(validate(parseBatch(draft())).length === 0, why(draft()))
})

// ── Timezone. The slot is written as London wall clock and stored as UTC.

check('a BST slot converts to UTC by subtracting an hour', () => {
  assert(toUtcIso('2026-08-17T08:10').startsWith('2026-08-17T07:10'), toUtcIso('2026-08-17T08:10'))
})

check('a GMT slot converts unchanged', () => {
  assert(toUtcIso('2026-12-01T08:10').startsWith('2026-12-01T08:10'), toUtcIso('2026-12-01T08:10'))
})

check('the BST boundary is handled at both ends rather than assumed', () => {
  // BST 2026: 29 March to 25 October.
  assert(toUtcIso('2026-03-28T12:00').startsWith('2026-03-28T12:00'), `before the switch: ${toUtcIso('2026-03-28T12:00')}`)
  assert(toUtcIso('2026-03-30T12:00').startsWith('2026-03-30T11:00'), `after the switch: ${toUtcIso('2026-03-30T12:00')}`)
  assert(toUtcIso('2026-10-24T12:00').startsWith('2026-10-24T11:00'), `before the return: ${toUtcIso('2026-10-24T12:00')}`)
  assert(toUtcIso('2026-10-26T12:00').startsWith('2026-10-26T12:00'), `after the return: ${toUtcIso('2026-10-26T12:00')}`)
})

// ── The two state-destroying re-runs. These are the reason the tool reads before it writes.

check('a re-run never walks an asset BACKWARDS out of a later status', () => {
  assert(laterStatus('done', 'approved') === 'done', 'a published batch must not be un-published by a re-register')
  assert(laterStatus('scripted', 'approved') === 'approved', 'a genuine advance must still apply')
  assert(laterStatus(null, 'approved') === 'approved', 'a new row takes the target')
  assert(laterStatus(undefined, 'scripted') === 'scripted', 'an absent status takes the target')
})

check('LEFT ALONE is reported distinctly from REGISTERED, and says why', () => {
  const out = render({
    assets: [], renditions: [], refused: [],
    skipped: [{ slug: 'x-w02-1', why: 'already at "scheduled", Metricool id 362752346' }],
  }, { dryRun: false })
  assert(/LEFT ALONE/.test(out), 'must be visible in the report')
  assert(/never rewrites live state/.test(out), 'must explain itself, or a reader reads it as a failure')
  assert(!/Next: metricool-schedule/.test(out), 'must not invite scheduling when nothing was registered')
})

check('a refusal report never reads as a success', () => {
  const out = render({ assets: [], renditions: [], skipped: [], refused: [{ ref: 'p', why: 'because' }] }, { dryRun: false })
  assert(/REFUSED/.test(out) && /WORK OWED/.test(out), out)
})

check('render survives a result built without every bucket, because the refusal paths build one by hand', () => {
  // The three early returns in main() construct a RunResult literal at the call site rather than
  // starting from the full object. All three shipped without `skipped`, so render's `for (const x
  // of r.skipped)` threw a TypeError instead of printing the refusal — on exactly the paths whose
  // only job is to explain what is wrong. typecheck caught it; no test did, because every case
  // here passed a complete literal. This asserts the tolerance rather than the literal.
  const partial = { assets: [], renditions: [], refused: [{ ref: 'p', why: 'because' }] } as never
  const out = render(partial, { dryRun: false })
  assert(/REFUSED/.test(out), 'a refusal must still print when a bucket is absent')
})

console.log(`\n${failures === 0 ? '🟢 register-x-batch: all clean.' : `🔴 ${failures} failing.`}\n`)
process.exit(failures === 0 ? 0 : 1)
