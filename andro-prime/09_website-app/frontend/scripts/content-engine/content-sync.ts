/**
 * content-sync: Phase 1 of `06_marketing/content-machine/content-pipeline-automation-plan.md`.
 *
 * Mirrors the DATABASE's view of an asset's state into a clearly marked GENERATED block inside
 * `06_marketing/content-machine/assets/*.md`. The database is authoritative for state; the file
 * keeps identity and craft (CONTEXT.md, "The asset file owns IDENTITY and CRAFT. The database
 * owns STATE."). The block is a MIRROR FOR HUMANS READING THE REPO AND NEVER AN INPUT: editing
 * it changes nothing, and the next run overwrites it.
 *
 * WHY A MIRROR IS NOT A SECOND STORE. Every failure in section 1 of the plan was the same shape:
 * two copies of one fact, one updated, no alarm. A copy is only safe when it can never be read
 * back. So nothing in this repo may parse this block, and the block says so in its own first
 * line, in the file, where the next person editing it will actually see the warning.
 *
 * WRITES. Repo files only, and only ever the span between the two markers. No database write of
 * any kind: this process issues SELECTs and nothing else. There is no `--log` path, because the
 * one thing worse than an unsynced mirror is a mirror that also mutates the store it mirrors.
 *
 * IDEMPOTENCE, AND WHY IT IS LOAD-BEARING. A generated block carrying a fresh timestamp on every
 * run makes every asset file show a diff on every run, and a file that always looks changed is a
 * file nobody reads: the mirror would be noise within a week. So when nothing but the timestamp
 * would change, the EXISTING block is kept byte for byte, timestamp included. A second run over
 * an unchanged database therefore rewrites nothing at all.
 *
 * A FILE WITH NO ROW IS REPORTED, NOT INVENTED. Without a row there is no state to mirror, and
 * writing "unknown" into the block would be manufacturing a fact. The file is left untouched and
 * named in the report. The mirror-image case, a row with no file, is deliberately NOT checked
 * here: that is `content-doctor` invariant 1's job, and a second detector for one condition is
 * two definitions of the same alarm, free to drift apart.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/content-sync.ts --dry     # print the diff, write nothing
 *   npx tsx scripts/content-engine/content-sync.ts --check   # verdict only, write nothing
 *   npx tsx scripts/content-engine/content-sync.ts           # write the files
 *
 * Exit codes (the `content-doctor` / `scan.js` convention: 0 clean, 2 alarm, 3 not measured):
 *   0  every block is current (or, in write mode, now is)
 *   2  --check: at least one block is stale or its markers are damaged
 *   3  no stale block, but at least one file could NOT be checked (no row, no frontmatter),
 *      or nothing was read at all. "All current" is false when a file was never measured, so
 *      this must not report as 0.
 *   1  content-sync itself could not run (wrong cwd, database unreadable)
 *
 * HOW THIS PROCESS ENDS, AND WHY IT MATTERS AS MUCH AS THE VERDICT. Nothing here calls
 * `process.exit`. A safety review on 2026-08-01 ran `--check` eight times over unchanged state
 * and got `0 0 0 0 0 127 127 0`: roughly one run in five aborted inside libuv
 * ("Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), src\win\async.c line 76") AFTER
 * printing the right verdict, because `process.exit` tears handles down while the HTTP
 * keep-alive socket and the tsx loader are still closing. It never turned a 2 into a 0, so it
 * could not manufacture a false clean, but the 0/2/3 vocabulary IS the alarm surface of Phase 1
 * and a caller that only tests for 0 would read a clean run as a break one time in five.
 * So the code is set on `process.exitCode`, the keep-alive pool is closed, and the process is
 * allowed to end by itself. `test-content-sync.ts` fails if `process.exit` ever returns here.
 *
 * THAT WAS ONLY HALF OF IT. With the forced exit gone, redirection went deterministic (25 of 25
 * for `--check` and `--dry`, to a file and to /dev/null) and so did a fully consuming pipe (25 of
 * 25 through `| cat`). A TRUNCATING reader did not: `--check 2>&1 | head -3` still returned
 * 127 three times and 1 once across 25 runs, because `head` closes the pipe and the next write
 * raises EPIPE. `ignoreBrokenPipe` swallows EPIPE and lets the verdict stand, on the principle
 * that whether anyone was still listening is not a fact about the repo. All four shapes are now
 * 25 of 25.
 */
import fs from 'fs'
import path from 'path'
import { loadEnvLocal } from './_shared'
import {
  MACHINE, REPO_ROOT, fileSlug, parseAsset, loadTable, repoLayoutProblems,
  DB_OWNED_KEYS, mirroredKeys, mirroredColumns,
  type TableRead,
} from './content-doctor'

const ASSETS_DIR = path.join(MACHINE, 'assets')

// ═══════════════════════════════════════════════════ pure logic (unit-tested)

/**
 * The markers. The stripper and the doctor look for these literally, so they are exported rather
 * than typed twice.
 *
 * LOCATION MATCHES ON THE PREFIX, not on the whole opening marker. If the wording after
 * "BEGIN GENERATED STATE" is ever tweaked, a whole-string match would stop finding the existing
 * block and would then INSERT a second one, so a cosmetic edit would silently double the block
 * in thirteen files. The prefix is the identity; the sentence after it is guidance for a human.
 */
export const BEGIN_PREFIX = '<!-- BEGIN GENERATED STATE'
export const END_PREFIX = '<!-- END GENERATED STATE'
export const BEGIN_MARKER =
  '<!-- BEGIN GENERATED STATE. Written by content-sync from the database. Do not edit: your changes will be overwritten and they change nothing. -->'
export const END_MARKER = '<!-- END GENERATED STATE -->'

/** The one line that legitimately differs between two otherwise identical blocks. */
const SYNCED_LINE = /^_Synced .*_$/

/**
 * THE STRIPPER'S DELETE LIST, in frontmatter spelling. Phase 2's stripper must import these
 * rather than retype them.
 *
 * DERIVED, NOT TYPED, SINCE 2026-08-01. This list used to be a third hand-maintained copy of the
 * database-owned key list, alongside `I9_FLAT` / `I9_REND` in content-doctor and `DB_OWNED` /
 * `DB_OWNED_REND` in `.claude/skills/content-status/scan.js`. Two of the three had already
 * diverged. The single definition is now `.claude/skills/content-status/db-owned-keys.json`; see
 * `DB_OWNED_KEYS` in content-doctor.ts for the incident and why the file is where it is.
 *
 * THE DELETE LIST IS NARROWER THAN THE REFUSAL LIST, AND THAT IS NOT A DIVERGENCE. A key is
 * refused in frontmatter the moment the database owns the fact. A key may only be DELETED once
 * the block below actually renders that fact, which is what `mirrored` records in the JSON. A key
 * that is deleted from the file and absent from the mirror is a fact with nowhere left to live,
 * which is section 1's failure shape running backwards. So `unipile_account` is refused and not
 * deleted, and `thumb_confirmed` is refused and owned by nothing at all.
 *
 * `approved_by` and `approved_date` carry `mirrored: true` ONLY BECAUSE THE COLUMNS NOW EXIST, and
 * the order of those two events is the whole lesson. A safety review on 2026-08-01 caught the
 * phase brief naming both as database-owned while `content_assets` held neither column and this
 * block had no row for either: stripping them from `2026-07-31-four-things-on-the-sheet.md` would
 * have deleted Keith's own business approval into git history and out of every live store. The
 * columns were added first (`database/migrations/20260801_content_assets_business_approval.sql`)
 * and the single live pair backfilled; only then did the keys join the delete list. The test suite
 * renders a block from an asset carrying a distinct sentinel for every key on these lists and
 * fails if any sentinel is missing from the output, so this stays mechanical rather than
 * remembered.
 */
export const DB_OWNED_ASSET_KEYS = mirroredKeys(DB_OWNED_KEYS.asset)
export const DB_OWNED_RENDITION_KEYS = mirroredKeys(DB_OWNED_KEYS.rendition)

/**
 * Frontmatter spelling on the left, the BARE column that now owns it on the right.
 *
 * THREE OF THESE NAMES DIFFER, AND A GUESSED MAPPING IS A DELETED FACT. `drive` is `drive_url`,
 * `approved_date` is `approved_at` (a DATE, deliberately not named after the frontmatter key it
 * replaces), `url` is `external_url` and `publish_date` is `published_at`. Phase 2's stripper
 * must import this map rather than transform the names itself: a stripper that deletes
 * `approved_date` while reading a column called `approved_date` finds nothing, concludes there
 * is nothing to lose, and deletes it anyway. The three are pinned by name in the test, so the
 * derivation cannot quietly start returning the frontmatter spelling back to itself.
 *
 * The test asserts every column named here is actually SELECTed. A key on the delete list whose
 * column is never fetched renders as an empty cell forever, which looks exactly like a fact that
 * was never recorded.
 */
export const ASSET_KEY_COLUMN: Record<string, string> = mirroredColumns(DB_OWNED_KEYS.asset)
export const RENDITION_KEY_COLUMN: Record<string, string> = mirroredColumns(DB_OWNED_KEYS.rendition)

/** The SELECT lists, exported so the test can prove every mirrored column is actually read. */
export const ASSET_SELECT =
  'id,slug,status,approved_by,approved_at,preflight,preflight_date,ewa_task,ewa_signed_at,drive_url,canonical_article_id'
export const RENDITION_SELECT =
  'asset_id,platform,format,variant,status,scheduled_for,published_at,publisher,external_post_id,external_url'

export interface DbAsset {
  id: string
  slug: string
  status: string | null
  /** Keith's BUSINESS approval to ship. Distinct from `ewa_signed_at`, the clinical sign-off. */
  approved_by: string | null
  /** A DATE, not a timestamp, and the frontmatter spells it `approved_date`. */
  approved_at: string | null
  preflight: string | null
  preflight_date: string | null
  ewa_task: string | null
  ewa_signed_at: string | null
  drive_url: string | null
  canonical_article_id: string | null
}

export interface DbRendition {
  asset_id: string
  platform: string
  format: string
  /**
   * Which version of this rendition ran, where one asset ships the same platform+format more
   * than once on purpose (the 2026-08 carousel run: A, B and C, one deck with three closes).
   * NULL for everything else and for every rendition written before 2026-08-14.
   */
  variant: string | null
  status: string | null
  scheduled_for: string | null
  published_at: string | null
  publisher: string | null
  external_post_id: string | null
  /** The live post. Frontmatter calls it `url`, and the stripper deletes that key. */
  external_url: string | null
}

export interface DbArticle {
  id: string
  slug: string
}

/**
 * A timestamp shortened for a human, WITHOUT reinterpreting it, AND NEVER WITHOUT ITS ZONE.
 *
 * The zone label is the whole point, and the first `--dry` run is what proved it. The asset file
 * records the slot as `2026-08-06T11:00:00+01:00`, but PostgREST hands `timestamptz` back
 * normalised to UTC, so the same slot arrives here as `2026-08-06T10:00:00+00:00`. Printing a
 * bare "2026-08-06 10:00" would tell a UK reader his post goes out at ten when it goes out at
 * eleven: one fact, two readings, no alarm, which is the exact failure shape of section 1 of the
 * automation plan. So the offset that arrived is always shown, spelled "UTC" when it is zero
 * because this block is read by people who do not read "Z".
 *
 * A regex over the string, deliberately, rather than Date plus a formatter. Converting to UK
 * wall-clock would read better but needs `Intl` timezone data, and on a runtime built with a
 * reduced ICU it would silently fall back to UTC and produce a DIFFERENT block on a different
 * machine: an idempotence guarantee that holds on one laptop is not a guarantee. A date with no
 * time and anything unrecognised are passed through untouched rather than guessed at.
 */
export function shortStamp(raw: string | null | undefined): string {
  const s = (raw ?? '').trim()
  if (!s) return ''
  const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?[ ]?(Z|[+-]\d{2}:?\d{2})?)?/.exec(s)
  if (!m) return s
  if (!m[2]) return m[1]
  const zone = m[3] ? (/^(Z|[+-]00:?00)$/.test(m[3]) ? ' UTC' : ` ${m[3]}`) : ''
  return `${m[1]} ${m[2]}${zone}`
}

/**
 * A markdown table cell. A raw `|` or newline in a value would break the table silhouette.
 *
 * A comment opener is neutralised for a harder reason than tidiness. A database value holding
 * the literal text of the END marker (someone pastes a snippet into `notes` or `drive_url`)
 * would render a block containing TWO END markers; the file gets written once, and every run
 * afterwards sees a duplicated marker and refuses as malformed. Nothing is destroyed, because
 * refusing is what `locateBlock` does with damage, but that asset's mirror is jammed until a
 * human edits the file by hand. The inserted space is deliberately visible: quietly altering a
 * value into something that reads as the original would be its own small lie.
 */
export function cell(raw: string | null | undefined): string {
  return (raw ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .replace(/<!--/g, '< !--')
    .trim()
}

/** Asset statuses that are at or past the approval gate, so an approval must have happened. */
const AT_OR_PAST_APPROVAL = ['approved', 'done']

/**
 * The business-approval row: Keith's decision to ship, which is a different act from Ewa's.
 *
 * IT EXISTS BECAUSE OF THE BLOCKER THAT STOPPED PHASE 1 ON 2026-08-01. `approved_by` and
 * `approved_date` were on the stripper's delete list with no column to move to and no row here to
 * be read in, so the one asset that carried them would have lost them entirely. The columns came
 * first; this row is the second half of that fix, and without it the first half is worse than
 * nothing, because a column nobody can see reads as a fact nobody recorded.
 *
 * AN EMPTY PAIR ON AN APPROVED ASSET IS SAID OUT LOUD, NOT LEFT BLANK. Twelve of the thirteen
 * approved assets predate the convention, so a blank cell would be the common case and would read
 * as "no approval needed" rather than "the approval was never written down". Those are different
 * facts, and the migration deliberately left `approved_by` out of the CHECK constraint precisely
 * so nobody would be tempted to invent an approver to fill the gap. Naming the gap is the honest
 * version of the same restraint. It is a statement, not an alarm: it must not read as a failure,
 * because the approval genuinely happened and only its record is missing.
 */
export function approvalRow(a: DbAsset): string {
  const by = cell(a.approved_by)
  const on = shortStamp(a.approved_at)
  if (by && on) return `${by}, ${on}`
  if (by) return `${by} (no approval date recorded)`
  if (on) return `${on} (no approver recorded)`
  return AT_OR_PAST_APPROVAL.includes((a.status ?? '').trim())
    ? `not recorded. Status is ${cell(a.status)}, so an approval happened; who gave it and when were never written down.`
    : 'none'
}

/**
 * The Ewa row, and the single most dangerous line in this file.
 *
 * A NON-EMPTY `ewa_task` PROVES A QUESTION WAS ASKED, NOT ANSWERED. Keith reconciled this on
 * 2026-08-01 against `scan.js` G2, which used to let an asset reach `approved` on the routing
 * alone; the X week-1 renditions are scheduled with autoPublish, so an asset merely ROUTED to
 * Ewa would have published on a timer before she had ruled. The mirror must never render a
 * routed question as a settled one.
 *
 * `amber-ewa` is evaluated BEFORE inheritance, which is the one place this deviates from a
 * literal reading of the phase brief. The database guards give exactly two routes to `approved`:
 * green pre-flight plus a canonical article, or `amber-ewa` plus `ewa_signed_at`. Inheritance
 * therefore does not discharge an amber ruling. Checking inheritance first would print
 * "inherited from ..." over an outstanding ruling, which is the routed-as-answered failure with
 * a friendlier face.
 *
 * A RECORDED `ewa_task` IS NEVER DROPPED, whichever branch answers. The first version returned
 * the inheritance sentence alone, so three of the five live assets carrying a routing showed no
 * trace of it. That is survivable only while the frontmatter still carries `ewa_task`; the
 * moment the stripper deletes that key, a routing shown nowhere is a routing that has left the
 * repo, and the block is the only state most readers will ever see.
 */
export function ewaRow(a: DbAsset, articleSlug: string | null): string {
  const task = (a.ewa_task ?? '').trim()
  const signed = shortStamp(a.ewa_signed_at)
  const signedPhrase = `signed ${signed}${task ? ` (task ${task})` : ''}`
  const routedPhrase = `routed to Ewa as task ${task}, and no ruling is recorded. A routed question is not an answered one.`

  if (a.preflight === 'amber-ewa') {
    if (signed) return signedPhrase
    return task
      ? `RULING OWED. Pre-flight is amber-ewa and this was routed to Ewa as task ${task}. A routed question is not an answered one, and ewa_signed_at is empty.`
      : 'RULING OWED. Pre-flight is amber-ewa and no ewa_task is recorded, so nothing has even been routed.'
  }
  if (a.canonical_article_id) {
    const named = articleSlug
      ? `inherited from canonical article ${articleSlug}`
      : `inherited from canonical article id ${a.canonical_article_id} (SLUG UNRESOLVED: blog_articles has no row with that id)`
    if (signed) return `${named}, and ${signedPhrase}`
    return task ? `${named}, and ${routedPhrase}` : named
  }
  if (signed) return signedPhrase
  if (task) return routedPhrase
  return 'none'
}

/**
 * Renditions in a stable order. Plain string comparison, not `localeCompare`: locale-sensitive
 * ordering would make the byte-identical-second-run guarantee depend on the machine's locale,
 * and an idempotence property that holds only on one laptop is not a property.
 */
export function sortRenditions(rends: DbRendition[]): DbRendition[] {
  const key = (r: DbRendition) => `${r.platform}/${r.format}/${r.variant ?? ''}`
  return [...rends].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0))
}

/**
 * The rendition's label in the mirror table.
 *
 * The variant is appended only when there IS one, so every block written before 2026-08-14
 * still renders byte-identically and the idempotence guarantee survives the change. Where three
 * renditions share a platform and a format — which the unique key allowed for the first time on
 * 2026-08-14 — the label is the only thing in the row that tells them apart, and three
 * indistinguishable lines reading `instagram/carousel` would be a mirror that shows the reader
 * less than the table it mirrors.
 */
export function renditionLabel(r: DbRendition): string {
  const base = `${r.platform}/${r.format}`
  return r.variant ? `${base} ${r.variant}` : base
}

/** The publisher-side identity of a scheduled or published post, as one cell. */
export function postIdCell(r: DbRendition): string {
  return [r.publisher, r.external_post_id].map((v) => (v ?? '').trim()).filter(Boolean).join(' ')
}

/**
 * Render the whole block, markers included, with no trailing newline. Pure: no clock, no
 * database, no filesystem. `syncedAt` and `eol` are injected so a test can pin both.
 */
export function renderStateBlock(args: {
  asset: DbAsset
  renditions: DbRendition[]
  articleSlug: string | null
  syncedAt: string
  eol?: string
}): string {
  const { asset, articleSlug, syncedAt } = args
  const eol = args.eol ?? '\n'
  const L: string[] = []
  L.push(BEGIN_MARKER)
  L.push(`_Synced ${syncedAt} from content_assets / content_renditions._`)
  L.push('')
  L.push('| | |')
  L.push('| --- | --- |')
  L.push(`| status | ${cell(asset.status) || 'unknown'} |`)
  // Business approval sits directly under status because it is the gate status passes through,
  // and above the clinical rows because they answer a different question about the same asset.
  L.push(`| approved (business) | ${cell(approvalRow(asset))} |`)
  const pf = cell(asset.preflight) || 'not-run'
  const pfDate = shortStamp(asset.preflight_date)
  L.push(`| preflight | ${pfDate ? `${pf} (${pfDate})` : pf} |`)
  L.push(`| Ewa | ${cell(ewaRow(asset, articleSlug))} |`)
  L.push(`| drive | ${cell(asset.drive_url) || 'none'} |`)
  L.push('')

  const rends = sortRenditions(args.renditions)
  if (!rends.length) {
    // An empty table body reads as "checked, nothing there" exactly like a table that failed to
    // render, so say it in words instead.
    L.push('_No rows in content_renditions for this asset._')
  } else {
    // Six columns, not the brief's five. `url` is the sixth because `content_renditions
    // .external_url` is the live post: it is the single most useful cell for a human orienting
    // in the repo, two live files carry it in frontmatter today, and the stripper is about to
    // delete that key. A column the brief forgot is cheaper to add than a fact to recover.
    L.push('| rendition | status | scheduled | published | id | url |')
    L.push('| --- | --- | --- | --- | --- | --- |')
    for (const r of rends) {
      L.push(`| ${cell(renditionLabel(r))} | ${cell(r.status)} | ${cell(shortStamp(r.scheduled_for))} | ${cell(shortStamp(r.published_at))} | ${cell(postIdCell(r))} | ${cell(r.external_url)} |`)
    }
  }
  L.push(END_MARKER)
  return L.join(eol)
}

/** Two blocks agree when everything except the `_Synced ..._` line agrees. */
export function sameIgnoringTimestamp(a: string, b: string): boolean {
  const norm = (s: string) =>
    s.replace(/\r\n/g, '\n').split('\n').filter((l) => !SYNCED_LINE.test(l.trim())).join('\n')
  return norm(a) === norm(b)
}

export type BlockLocation =
  | { kind: 'none' }
  | { kind: 'found'; start: number; end: number }
  | { kind: 'malformed'; why: string }

/**
 * Find the block by its two markers.
 *
 * REFUSES rather than guesses on every damaged shape: one marker without its pair, a pair in the
 * wrong order, more than one of either, or a marker sharing its line with anything else. The
 * only way to "recover" from a lone BEGIN is to decide where the block ends, and every rule for
 * that (to the next blank line, to the end of file, to the next heading) eats real body copy in
 * some file. Refusing costs a human one minute; guessing wrong costs a script that silently
 * deletes craft.
 */
export function locateBlock(text: string): BlockLocation {
  const starts = indicesOf(text, BEGIN_PREFIX)
  const ends = indicesOf(text, END_PREFIX)
  if (!starts.length && !ends.length) return { kind: 'none' }
  if (starts.length > 1 || ends.length > 1) {
    return {
      kind: 'malformed',
      why: `${starts.length} BEGIN marker(s) and ${ends.length} END marker(s): a block was duplicated or nested, and only a human can say which one is the real one`,
    }
  }
  if (!starts.length) return { kind: 'malformed', why: 'an END marker with no BEGIN marker' }
  if (!ends.length) return { kind: 'malformed', why: 'a BEGIN marker with no END marker' }
  if (ends[0] < starts[0]) return { kind: 'malformed', why: 'the END marker appears before the BEGIN marker' }

  // A replacement spans the whole marker LINES, so that a marker cannot leave a fragment of
  // itself behind. That makes anything a human has typed ON a marker line collateral damage,
  // and it was the ONE path in this file where content outside the markers could be deleted
  // without a word: measured on 2026-08-01, "KEEP-BEFORE <!-- BEGIN ..." lost KEEP-BEFORE and
  // reported an ordinary "replaced". content-sync always writes its markers alone on their
  // line, so a shared line means a human edited the block area by hand, which is exactly what
  // the block asks them not to do. Refuse it, like every other damaged shape.
  const shared = markerLineProblem(text, starts[0], 'BEGIN') ?? markerLineProblem(text, ends[0], 'END')
  if (shared) return { kind: 'malformed', why: shared }

  const start = lineStartAt(text, starts[0])
  const nl = text.indexOf('\n', ends[0])
  const end = nl < 0 ? text.length : (text[nl - 1] === '\r' ? nl - 1 : nl)
  return { kind: 'found', start, end }
}

const lineStartAt = (text: string, idx: number) => text.lastIndexOf('\n', idx) + 1

/** Anything other than whitespace beside a marker on its own line, described for a human. */
function markerLineProblem(text: string, idx: number, which: 'BEGIN' | 'END'): string | null {
  const start = lineStartAt(text, idx)
  const nl = text.indexOf('\n', idx)
  const end = nl < 0 ? text.length : (text[nl - 1] === '\r' ? nl - 1 : nl)
  const close = text.indexOf('-->', idx)
  if (close < 0 || close + 3 > end) {
    return `the ${which} marker does not close on its own line, so where the block ends is a guess`
  }
  const before = text.slice(start, idx).trim()
  const after = text.slice(close + 3, end).trim()
  if (!before && !after) return null
  return `the ${which} marker shares its line with other text (${before ? `"${before}" before it` : ''}${before && after ? ', ' : ''}${after ? `"${after}" after it` : ''}). Regenerating spans whole marker lines, so that text would be deleted: refusing, and leaving the file exactly as it is.`
}

function indicesOf(hay: string, needle: string): number[] {
  const out: number[] = []
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + needle.length)) out.push(i)
  return out
}

/**
 * Character index just past the newline that closes the frontmatter, or null when the file has
 * none. Anchored at the very start (with an optional BOM) so a `---` horizontal rule further
 * down the body can never be mistaken for a frontmatter fence.
 */
export function frontmatterEnd(text: string): number | null {
  const m = /^﻿?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/.exec(text)
  return m ? m[0].length : null
}

export type ApplyStatus = 'inserted' | 'replaced' | 'unchanged' | 'malformed' | 'no-frontmatter'

export interface ApplyResult {
  status: ApplyStatus
  /** The full file text as it should be. Identical to the input for every non-writing status. */
  text: string
  /** The block that is in the file now, or null when there is none. */
  before: string | null
  /** The block that should be in the file. */
  after: string
  why?: string
}

/**
 * Put `block` into `text`, touching nothing outside the two markers.
 *
 * On REPLACE the surrounding whitespace is left exactly as found: the contract is "only between
 * the markers", so re-tidying the blank lines around a block a human moved would break it.
 * On INSERT there is no existing placement to respect, so the phase brief's placement applies:
 * immediately after the frontmatter, one blank line either side.
 */
export function applyBlock(text: string, block: string, eol = '\n'): ApplyResult {
  const loc = locateBlock(text)
  if (loc.kind === 'malformed') {
    return { status: 'malformed', text, before: null, after: block, why: loc.why }
  }
  if (loc.kind === 'found') {
    const before = text.slice(loc.start, loc.end)
    // Byte-for-byte reuse of the existing block, timestamp included, when only the timestamp
    // would differ. This is what keeps a no-op run a genuine no-op in git.
    if (sameIgnoringTimestamp(before, block)) {
      return { status: 'unchanged', text, before, after: before }
    }
    return { status: 'replaced', text: text.slice(0, loc.start) + block + text.slice(loc.end), before, after: block }
  }
  const fm = frontmatterEnd(text)
  if (fm === null) {
    return {
      status: 'no-frontmatter', text, before: null, after: block,
      why: 'the file has no frontmatter, so the block has no defined home. Refusing to guess a position in someone else\'s prose.',
    }
  }
  const body = text.slice(fm).replace(/^(?:[ \t]*\r?\n)+/, '')
  return { status: 'inserted', text: text.slice(0, fm) + eol + block + eol + eol + body, before: null, after: block }
}

// ── The per-file plan. Pure, so the whole decision layer is testable off-disk. ─────────────

export type PlanKind = ApplyStatus | 'no-row'

export interface FilePlan {
  file: string
  slug: string
  kind: PlanKind
  before: string | null
  after: string | null
  /** The text to write. Null whenever nothing should be written, which includes 'unchanged'. */
  write: string | null
  why?: string
}

export function planFile(args: {
  file: string
  text: string
  asset: DbAsset | null
  renditions: DbRendition[]
  articleSlug: string | null
  syncedAt: string
}): FilePlan {
  const { file, text, asset } = args
  const slug = parseAsset(text).flat.slug || fileSlug(file)
  // CRLF is preserved rather than normalised: rewriting every line ending of a file we were
  // asked to touch one block of would bury the real change in a whole-file diff.
  const eol = text.includes('\r\n') ? '\r\n' : '\n'

  // Damage to the markers is a property of the FILE, so it is reported even when the row is
  // missing. Otherwise a broken block in a fileless asset would hide behind the missing row.
  const loc = locateBlock(text)
  if (loc.kind === 'malformed') {
    return { file, slug, kind: 'malformed', before: null, after: null, write: null, why: loc.why }
  }
  if (!asset) {
    return {
      file, slug, kind: 'no-row',
      before: loc.kind === 'found' ? text.slice(loc.start, loc.end) : null,
      after: null, write: null,
      why: `no content_assets row with slug "${slug}", so there is no state to mirror. The file is left untouched: inventing state to fill the block would be exactly the second store this phase removes. A row-without-a-file is content-doctor invariant 1's job, not this script's.`,
    }
  }

  const block = renderStateBlock({
    asset, renditions: args.renditions, articleSlug: args.articleSlug, syncedAt: args.syncedAt, eol,
  })
  const applied = applyBlock(text, block, eol)
  return {
    file, slug, kind: applied.status,
    before: applied.before, after: applied.after,
    write: applied.status === 'inserted' || applied.status === 'replaced' ? applied.text : null,
    why: applied.why,
  }
}

/** Stale means "a write is owed". Damaged markers count: the mirror is wrong and nobody can fix it but a human. */
export const STALE_KINDS: PlanKind[] = ['inserted', 'replaced', 'malformed']
/** Not stale, and not measured either. These must never let a run report as clean. */
export const UNMEASURED_KINDS: PlanKind[] = ['no-row', 'no-frontmatter']

export function exitCodeFor(plans: FilePlan[]): 0 | 2 | 3 {
  // NOTHING MEASURED IS NOT "ALL CURRENT". This used to return 0 for an empty list, so an
  // assets/ directory that had been emptied, moved or renamed while still existing produced
  // "every generated block is current" and exit 0 over zero files: the unperformed check
  // reporting as a pass, which is the one thing this repo refuses everywhere else, and which
  // `content-doctor.need()` already guards with the same rule for a table that returns 0 rows.
  if (!plans.length) return 3
  if (plans.some((p) => STALE_KINDS.includes(p.kind))) return 2
  if (plans.some((p) => UNMEASURED_KINDS.includes(p.kind))) return 3
  return 0
}

/**
 * The denominator, stated in words rather than left for a reader to notice in the counts line.
 *
 * `exitCodeFor` already refuses to call an empty run clean; this says WHY on the report, because
 * "0 asset file(s)" printed in a header is a number a human skims past when the verdict sentence
 * underneath it says everything is fine.
 */
export function denominatorProblem(fileCount: number, assetRowCount: number): string | null {
  if (fileCount > 0) return null
  return assetRowCount > 0
    ? `NOTHING WAS MEASURED: 0 asset file(s) were read while content_assets holds ${assetRowCount} row(s). The assets/ directory exists but is empty, so this run mirrored nothing and cannot say the mirror is current.`
    : 'NOTHING WAS MEASURED: 0 asset file(s) were read and content_assets returned 0 rows. Both stores came back empty, which is far more likely to be a broken read than an empty pipeline.'
}

/** The block-level diff. Nothing outside the markers changes, so this IS the whole change. */
export function renderDiff(plan: FilePlan): string {
  const L: string[] = [`--- ${plan.file}`]
  if (plan.before === null) L.push('  (no generated block yet: one will be inserted after the frontmatter)')
  else for (const line of plan.before.split(/\r?\n/)) L.push(`- ${line}`)
  for (const line of (plan.after ?? '').split(/\r?\n/)) L.push(`+ ${line}`)
  return L.join('\n')
}

// ═══════════════════════════════════════════════════════════════════════ IO

export interface AssetMd { file: string; abs: string; text: string }

/** README.md is documentation about the directory, not an asset, so it carries no state. */
export function readAssetFiles(dir: string): AssetMd[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => /\.md$/i.test(f) && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => {
      const abs = path.join(dir, f)
      return { file: path.relative(REPO_ROOT, abs).replace(/\\/g, '/'), abs, text: fs.readFileSync(abs, 'utf-8') }
    })
}

/**
 * A table that could not be read is fatal here, not a degraded verdict. Every asset would look
 * fileless-in-reverse ("no row") and the run would print thirteen confident wrong findings, or,
 * worse in write mode, do nothing while looking busy.
 */
function must<T>(name: string, t: TableRead<T>): T[] {
  if (t.error) throw new Error(`${name} could not be read: ${t.error}`)
  return t.rows
}

/**
 * Set the code and let node finish. NEVER `process.exit`.
 *
 * See the header: `process.exit` while the HTTP keep-alive socket and the tsx loader are still
 * closing trips a libuv assertion on Windows and returns 127 instead of the verdict, on roughly
 * one run in five. `proc` is a parameter so a test can prove this sets a code rather than
 * killing the process it is running in.
 */
export function settleExit(code: number, proc: { exitCode?: number | string } = process): void {
  proc.exitCode = code
}

/** The narrow shape of a writable stream this needs, so a test can pass a fake one. */
export interface ErrorableStream { on(ev: 'error', fn: (e: NodeJS.ErrnoException) => void): unknown }

/**
 * A reader that stops reading must not be able to change the verdict.
 *
 * THE SECOND HALF OF THE 127 DEFECT, and a different cause from the first. Removing
 * `process.exit` made redirection deterministic (25 of 25 for `--check` and for `--dry`, to a
 * file and to /dev/null, on 2026-08-01) and a fully consuming pipe deterministic too (25 of 25
 * through `| cat`). But `--check 2>&1 | head -3` still returned "2 2 2 2 2 127 2 127 2 2 2 2 2 1
 * ..." across 25 runs: `head` exits after three lines, the pipe's read end closes, and the next
 * write raises EPIPE. Three runs aborted to 127 and one returned 1, which is worse than 127
 * because 1 is content-sync's own "I could not run" code and reads as a broken tool rather than
 * an unread verdict.
 *
 * A caller pipes into `head` to glance at the top of a report while still testing `$?`, and
 * `12_operations` cadences do exactly that. The verdict is a fact about the repo; whether anyone
 * was still listening when it was printed is not. EPIPE is therefore swallowed and the code
 * stands. Any OTHER stream error is a genuine failure to report at all, so it takes exit 1: a
 * verdict nobody could have received must not be delivered as a clean one.
 */
export function ignoreBrokenPipe(
  streams: ErrorableStream[] = [process.stdout, process.stderr],
  proc: { exitCode?: number | string } = process,
): void {
  for (const s of streams) {
    s.on('error', (e) => {
      if (e?.code !== 'EPIPE') proc.exitCode = 1
    })
  }
}

/**
 * Close the fetch keep-alive pool so the loop can drain promptly.
 *
 * Without this the process still ends with the right code, just up to a few seconds later when
 * the idle socket times out. Best effort by design: the symbol is node's internal handle for
 * the global undici dispatcher, so if a future runtime moves it the only cost is that slower
 * exit. Correctness must never depend on it, which is why nothing here throws or is awaited on
 * a path that decides a verdict.
 */
async function releaseKeepAliveSockets(): Promise<void> {
  try {
    const key = Symbol.for('undici.globalDispatcher.1')
    const pool = (globalThis as unknown as Record<symbol, { close?: () => Promise<void> } | undefined>)[key]
    await pool?.close?.()
  } catch {
    // An unclosable pool delays this process's exit. It cannot change its verdict.
  }
}

async function main(): Promise<number> {
  loadEnvLocal()

  const CHECK = process.argv.includes('--check')
  const DRY = process.argv.includes('--dry')
  if (CHECK && DRY) {
    console.error('content-sync: --check and --dry are different questions. Pass one.')
    return 1
  }
  const mode = CHECK ? 'check' : DRY ? 'dry' : 'write'
  const tag = `[${mode}]`

  // The same cwd trap `content-doctor` documents: every path here is resolved from cwd, so from
  // the wrong directory this would find zero asset files and report a clean mirror over nothing.
  const layout = repoLayoutProblems()
  if (layout.length) {
    console.error('CONTENT-SYNC CANNOT RUN FROM HERE.')
    console.error(`  cwd:       ${process.cwd()}`)
    console.error(`  repo root: ${REPO_ROOT} (resolved ../../.. from cwd)`)
    for (const p of layout) console.error(`  x ${p}`)
    console.error('  Run from 09_website-app/frontend. Refusing to report a mirror it cannot see.')
    return 1
  }

  const [assetsT, rendsT, artsT] = await Promise.all([
    loadTable<DbAsset>('content_assets', ASSET_SELECT),
    loadTable<DbRendition>('content_renditions', RENDITION_SELECT),
    loadTable<DbArticle>('blog_articles', 'id,slug'),
  ])
  const assets = must('content_assets', assetsT)
  const rends = must('content_renditions', rendsT)
  const articles = must('blog_articles', artsT)

  const bySlug = new Map(assets.map((a) => [a.slug, a]))
  const rendsByAsset = new Map<string, DbRendition[]>()
  for (const r of rends) rendsByAsset.set(r.asset_id, [...(rendsByAsset.get(r.asset_id) ?? []), r])
  const articleSlugById = new Map(articles.map((a) => [a.id, a.slug]))

  const files = readAssetFiles(ASSETS_DIR)
  const syncedAt = new Date().toISOString()
  const plans: FilePlan[] = files.map((f) => {
    const slug = parseAsset(f.text).flat.slug || fileSlug(f.file)
    const asset = bySlug.get(slug) ?? null
    return planFile({
      file: f.file,
      text: f.text,
      asset,
      renditions: asset ? (rendsByAsset.get(asset.id) ?? []) : [],
      articleSlug: asset?.canonical_article_id ? (articleSlugById.get(asset.canonical_article_id) ?? null) : null,
      syncedAt,
    })
  })

  console.log(`${tag} ${files.length} asset file(s), ${assets.length} content_assets row(s), ${rends.length} rendition row(s)`)

  // An empty read is reported before anything else, because every line under it would otherwise
  // be a confident statement about nothing.
  const nothingMeasured = denominatorProblem(files.length, assets.length)
  if (nothingMeasured) console.log(`  ! ${nothingMeasured}`)

  const count = (k: PlanKind) => plans.filter((p) => p.kind === k).length
  const written: string[] = []
  for (const p of plans) {
    if (p.kind === 'unchanged') continue
    if (p.kind === 'no-row' || p.kind === 'no-frontmatter' || p.kind === 'malformed') {
      console.log(`  ! ${p.file}  [${p.kind}] ${p.why}`)
      continue
    }
    console.log(`  ${p.kind === 'inserted' ? '+' : '~'} ${p.file}  [${p.kind}]`)
    if (mode === 'dry') console.log(renderDiff(p).split('\n').map((l) => `      ${l}`).join('\n'))
    if (mode === 'write' && p.write !== null) {
      const abs = files.find((f) => f.file === p.file)!.abs
      fs.writeFileSync(abs, p.write)
      written.push(p.file)
    }
  }

  const code = exitCodeFor(plans)
  console.log('')
  console.log(`${tag} unchanged ${count('unchanged')}   inserted ${count('inserted')}   replaced ${count('replaced')}   malformed ${count('malformed')}   no-row ${count('no-row')}   no-frontmatter ${count('no-frontmatter')}`)
  // An empty read outranks every mode's own verdict, dry included: a run that measured nothing
  // has nothing to be clean about, and the one exit code a cadence trusts is 0.
  if (nothingMeasured) {
    console.log(`${tag} EXIT 3: ${nothingMeasured}`)
    return 3
  }
  if (mode === 'write') {
    console.log(`${tag} ${written.length} file(s) written. Everything outside the two markers is untouched.`)
    // The written files are now current, so the only reasons left to be non-zero are the ones a
    // write cannot fix. Reported honestly rather than folded into a success line.
    const left = plans.filter((p) => UNMEASURED_KINDS.includes(p.kind) || p.kind === 'malformed')
    if (left.length) {
      console.log(`${tag} ${left.length} file(s) still need a human: nothing was written for them and their state is UNMIRRORED.`)
      return plans.some((p) => p.kind === 'malformed') ? 2 : 3
    }
    return 0
  }
  if (mode === 'dry') {
    console.log(`${tag} nothing written. Exit 0 is "the dry run completed", never "the mirror is current": read the counts above.`)
    return 0
  }
  console.log(code === 0
    ? `${tag} every generated block is current, across all ${plans.length} asset file(s) measured.`
    : code === 2
      ? `${tag} EXIT 2: at least one block is stale or damaged. Run content-sync to regenerate, or fix the markers by hand.`
      : `${tag} EXIT 3: no block is stale, but ${count('no-row') + count('no-frontmatter')} of ${plans.length} file(s) could NOT be checked. That is not "all current".`)
  return code
}

// Anchored on a path separator so `test-content-sync.ts` does not match and the suite stays
// offline, the same guard content-doctor.ts carries and for the same reason.
if (/(^|[\\/])content-sync\.(ts|js)$/.test(process.argv[1] ?? '')) {
  // Before the first line is printed: a reader that walks away mid-report must not be able to
  // turn a 2 into a 127 or a 1.
  ignoreBrokenPipe()
  main()
    .catch((e) => {
      console.error('CONTENT-SYNC ERROR:', (e as Error).message)
      return 1
    })
    .then(async (code) => {
      settleExit(code)
      await releaseKeepAliveSockets()
    })
}
