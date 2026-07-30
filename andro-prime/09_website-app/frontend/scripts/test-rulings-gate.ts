/**
 * Guards the sign-off rulings gate (content-engine/clickup.ts + signoff-concierge.ts).
 *
 * WHY THIS EXISTS. The review gate used to be binary: ClickUp status 'complete' meant
 * approved, full stop. That works when the ask is "approve or don't". It fails when the
 * submission also asks a specific question, because the reviewer has no way to answer it
 * AND approve: a comment parks the item, completing it closes silently. On 2026-07-29 the
 * andropause hub was approved by completion with two CA-028 rulings that had been asked
 * twice and never answered, and nothing in the pipeline noticed. An approval given by
 * silence is indistinguishable from one that never saw the question.
 *
 * Named rulings are now real ClickUp checklist items and every one must be ticked before
 * completion counts as approval. These tests fail loudly if that gate ever softens back
 * into a bare status check.
 *
 * Pure-logic only: no network, no DB, safe in CI. The live-API half (checklist create /
 * read / resolve round-trip) was verified by hand against ClickUp on 2026-07-30.
 *
 * Run: npx tsx scripts/test-rulings-gate.ts   (also part of `npm test`)
 */

import {
  isApproved,
  unresolvedRulings,
  RULINGS_CHECKLIST,
  type ReviewTask,
  type Checklist,
} from './content-engine/clickup'
import { rulingsFrom, reviewMarkdown } from './content-engine/signoff-concierge'
import { reviewMarkdown as reoptReviewMarkdown } from './content-engine/reopt-concierge'

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

function task(statusName: string, checklists: Checklist[] = []): ReviewTask {
  return { id: 't1', url: 'https://app.clickup.com/t/t1', statusName, dueDate: null, checklists }
}

function rulingsChecklist(items: Array<[string, boolean]>): Checklist {
  return {
    id: 'c1',
    name: RULINGS_CHECKLIST,
    items: items.map(([name, resolved], i) => ({ id: `i${i}`, name, resolved })),
  }
}

const RULING_A = 'Confirm CA-028 §4 governs the "treatment" query-echo, or redline'
const RULING_B = 'Confirm CA-028 §4 governs the "diagnose" query-echo, or redline'

console.log('\nsign-off rulings gate\n')

// ---------------------------------------------------------------- the gate itself

check('no rulings + complete => approved (the ordinary article, unchanged behaviour)', () => {
  assert(isApproved(task('complete')), 'a task with no checklist must still approve on complete')
  assert(unresolvedRulings(task('complete')).length === 0, 'no checklist means nothing outstanding')
})

check('no rulings + not complete => not approved', () => {
  assert(!isApproved(task('to do')), '"to do" must not approve')
  assert(!isApproved(task('in progress')), '"in progress" must not approve')
})

check('THE REGRESSION: complete + unticked rulings => NOT approved', () => {
  const t = task('complete', [rulingsChecklist([[RULING_A, false], [RULING_B, false]])])
  assert(!isApproved(t), 'completion with unanswered rulings must NOT count as approval')
  assert(unresolvedRulings(t).length === 2, 'both rulings should report as outstanding')
})

check('complete + partially ticked => still NOT approved', () => {
  const t = task('complete', [rulingsChecklist([[RULING_A, true], [RULING_B, false]])])
  assert(!isApproved(t), 'one unanswered ruling is enough to block')
  assert(unresolvedRulings(t)[0] === RULING_B, 'the outstanding item must be named, for the nudge comment')
})

check('complete + all ticked => approved', () => {
  const t = task('complete', [rulingsChecklist([[RULING_A, true], [RULING_B, true]])])
  assert(isApproved(t), 'all rulings answered plus complete is a real approval')
  assert(unresolvedRulings(t).length === 0, 'nothing outstanding')
})

check('all ticked but NOT complete => not approved (rulings are not a substitute for sign-off)', () => {
  const t = task('to do', [rulingsChecklist([[RULING_A, true], [RULING_B, true]])])
  assert(!isApproved(t), 'ticking the rulings without completing the task is not approval')
})

check('an unrelated checklist does not block', () => {
  const other: Checklist = {
    id: 'c2',
    name: 'Ewa personal notes',
    items: [{ id: 'x', name: 'read on the train', resolved: false }],
  }
  assert(isApproved(task('complete', [other])), 'only the reserved rulings checklist gates approval')
})

// ---------------------------------------------------------------- frontmatter parsing

check('rulingsFrom reads the ewa_rulings array', () => {
  const r = rulingsFrom({ ewa_rulings: [RULING_A, RULING_B] })
  assert(r.length === 2 && r[0] === RULING_A, `expected 2 rulings, got ${JSON.stringify(r)}`)
})

check('rulingsFrom is empty for an ordinary article', () => {
  assert(rulingsFrom({}).length === 0, 'absent key must yield no rulings')
  assert(rulingsFrom({ ewa_rulings: [] }).length === 0, 'empty array must yield no rulings')
})

check('rulingsFrom ignores a malformed value instead of throwing', () => {
  // A string or object here would otherwise crash submission for every article.
  assert(rulingsFrom({ ewa_rulings: 'not an array' }).length === 0, 'a string must not throw or half-parse')
  assert(rulingsFrom({ ewa_rulings: null }).length === 0, 'null must not throw')
})

check('rulingsFrom trims and drops blanks', () => {
  const r = rulingsFrom({ ewa_rulings: ['  padded  ', '', '   '] })
  assert(r.length === 1 && r[0] === 'padded', `expected one trimmed ruling, got ${JSON.stringify(r)}`)
})

// ---------------------------------------------------------------- the review surface

check('the task body warns when rulings exist, and names the checklist', () => {
  const md = reviewMarkdown('slug', 'https://example.test/preview', [RULING_A])
  assert(md.includes(RULINGS_CHECKLIST), 'body must point at the checklist by name')
  assert(md.includes('not just an approval'), 'body must say an approval alone is insufficient')
  assert(
    md.indexOf(RULINGS_CHECKLIST) < md.indexOf('Mark this task **complete**'),
    'the ruling warning must come BEFORE the completion instruction: burying it below is how the ' +
      'original request got closed past',
  )
})

check('the task body is unchanged for an ordinary article', () => {
  const md = reviewMarkdown('slug', 'https://example.test/preview', [])
  assert(!md.includes(RULINGS_CHECKLIST), 'no rulings means no ruling noise on the task')
  assert(md.includes('Mark this task **complete**'), 'the normal instruction must survive')
  assert(md.includes('No Ashwagandha mention anywhere'), 'the standing sign-off checks must survive')
})

// ---------------------------------------------------------------- the re-opt track
// A re-opt changes copy that is ALREADY live and already signed, so it needs the same
// guard. It was missed on the first pass: the gate was wired into the new-article track
// only, and the re-opt submitter read frontmatter from the live row rather than from the
// proposed revision, where `ewa_rulings` actually lives.

check('re-opt task body warns when rulings exist', () => {
  const md = reoptReviewMarkdown('slug', 'https://example.test/preview?rev=1', null, [RULING_A])
  assert(md.includes(RULINGS_CHECKLIST), 're-opt body must point at the checklist by name')
  assert(md.includes('not just an approval'), 're-opt body must say approval alone is insufficient')
  assert(
    md.indexOf(RULINGS_CHECKLIST) < md.indexOf('Mark this task **complete**'),
    'the warning must precede the completion instruction on the re-opt task too',
  )
})

check('re-opt task body is unchanged for an ordinary re-opt', () => {
  const md = reoptReviewMarkdown('slug', 'https://example.test/preview?rev=1', null, [])
  assert(!md.includes(RULINGS_CHECKLIST), 'no rulings means no ruling noise')
  assert(md.includes('The live page is unchanged until you approve'), 'the standing re-opt framing must survive')
})

check('re-opt body still carries the brief ref when given, and omits the line when not', () => {
  const withRef = reoptReviewMarkdown('slug', 'https://example.test/p', 'path/to/brief.md', [])
  const without = reoptReviewMarkdown('slug', 'https://example.test/p', null, [])
  assert(withRef.includes('path/to/brief.md'), 'brief ref must appear when supplied')
  assert(!without.includes('Change rationale'), 'the brief-ref line must be omitted when null')
})

check('both tracks parse rulings with the same function', () => {
  // reopt-concierge imports rulingsFrom from signoff-concierge rather than redefining it.
  // If that ever forks, the two tracks can disagree about what counts as a ruling.
  const fm = { ewa_rulings: [RULING_A, RULING_B] }
  assert(rulingsFrom(fm).length === 2, 'shared parser must see both rulings')
})

console.log(
  failures === 0
    ? '\n🟢 rulings gate: all clean. Completion alone cannot answer a named ruling, on either track.\n'
    : `\n🔴 rulings gate: ${failures} failure(s).\n`,
)

process.exit(failures === 0 ? 0 : 1)
