/**
 * Content Library mirror (Phase 5, deliverable D5), REPOINTED AT THE DATABASE on 2026-08-01.
 *
 * One task per founder content asset in the read-only ClickUp "Content Library" list, so the
 * pipeline is visible without a second by-hand tracker. One way only: this script reads the repo
 * and the database and writes ClickUp, never the reverse, and never deletes a task.
 *
 * WHAT CHANGED, AND WHY IT WAS URGENT. Phase 1 moved STATE out of asset frontmatter and into
 * `content_assets` / `content_renditions`; the file kept IDENTITY and CRAFT (see
 * `06_marketing/content-machine/CONTEXT.md`, "The asset file owns IDENTITY and CRAFT. The
 * database owns STATE."). This script was not repointed with it. It read `data.status` out of
 * frontmatter with `|| 'idea'` behind it, and eleven of the thirteen asset files no longer carry
 * that key, so the next daily run would have pushed every correctly stripped asset onto the board
 * as `idea` and emptied the rendition table's status, url and publish_date columns.
 *
 * THE FALLBACK WAS THE DEFECT, NOT THE STALE READ. A broken join that throws is a fifteen minute
 * fix. `|| 'idea'` turned that same broken join into a plausible value on a board Keith reads,
 * with nothing anywhere raising a word: no `content-doctor` invariant reads this mirror, and the
 * regression was found only because a doc sweep checked whether a sentence was still true rather
 * than assuming it. So THERE IS NO DEFAULT STATE ANYWHERE IN THIS FILE. An asset with no database
 * row is refused outright: no create, no update, named on the report, and the run does not exit 0.
 * An unperformed lookup must never render as a fact.
 *
 * WHERE EACH CELL COMES FROM. The test is WHO CHANGES IT. A human writing means the file; an
 * integration means the database.
 *   file  title, content_type, funnel_stage, awareness, cta, marker, canonical_asset, series,
 *         WHICH renditions exist (platform, format, thumb), and the body (chosen hook + script)
 *   db    status, preflight, preflight_date, drive, and each rendition's status, url and
 *         publish_date
 * Column names are never spelled in this file. `ASSET_KEY_COLUMN` and `RENDITION_KEY_COLUMN` are
 * imported from `content-sync`, which owns the frontmatter-name to column-name map, because three
 * of those names differ (`drive` is `drive_url`, `url` is `external_url`, `publish_date` is
 * `published_at`) and a guessed column name does not fail loudly: it reads `undefined` and renders
 * an empty cell, which looks exactly like a fact nobody ever recorded.
 *
 * THE GENERATED BLOCK IS STRIPPED OUT OF THE BODY, NOT MIRRORED. `content-sync` writes a marked
 * block of database state into each asset file for humans reading the repo. Copying it into the
 * card would show the same state twice in one description in two formats, free to disagree the
 * moment one was regenerated and the other was not, which is the two-copies-of-one-fact shape
 * this whole phase exists to remove. `content-doctor.stripGeneratedState` is the single
 * implementation of "nothing may read that block", so it is imported rather than retyped.
 *
 * WRITES. ClickUp only, and never a delete: a vanished asset file gets a "source file missing"
 * note instead. No database write of any kind, and no repo write. Ewa's sign-off list is named
 * below and this script refuses to resolve to it.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/content-library-sync.ts --dry
 *   npx tsx scripts/content-engine/content-library-sync.ts
 *
 * --dry prints the full plan and calls no mutating endpoint. It names the status it would push
 * for EVERY asset, unchanged ones included, because a plan that lists only the changes cannot be
 * used to check that the unchanged ones are right, and after this repoint that is the thing most
 * worth checking. Reads still happen, so the plan is real.
 *
 * Exit codes (the `content-doctor` / `content-sync` vocabulary: 0 clean, 2 alarm, 3 not measured,
 * 1 could not run). The workflow step is `continue-on-error: true`, so a non-zero code shows as a
 * red step and an annotation without failing the engine run, which is exactly the alarm surface
 * this regression lacked:
 *   0  every asset file was mirrored from real state
 *   2  at least one asset's database status is not a status this list can hold
 *   3  no such failure, but at least one asset could NOT be mirrored (no database row, or no
 *      frontmatter), or zero asset files were read. A file nobody measured is not a clean mirror.
 *   1  the mirror itself could not run: no credentials, a table unreadable, the assets directory
 *      gone
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadEnvLocal } from './_shared'
import { fileSlug, loadTable, parseAsset, stripGeneratedState, type TableRead } from './content-doctor'
import {
  ASSET_KEY_COLUMN,
  ASSET_SELECT,
  RENDITION_KEY_COLUMN,
  RENDITION_SELECT,
  denominatorProblem,
  frontmatterEnd,
  ignoreBrokenPipe,
  settleExit,
  shortStamp,
  type DbAsset,
  type DbRendition,
} from './content-sync'
import {
  createFolderList,
  createTaskInList,
  getFolderLists,
  getFolders,
  getListTasks,
  getSpaces,
  updateTaskContent,
  type CuTask,
} from './clickup'

loadEnvLocal()
const DRY = process.argv.includes('--dry')

// Workspace + target locations (all from the approved plan).
const TEAM_ID = '90121729875'
const FOLDER_NAME = 'Phase 0 Launch'
const LIST_NAME = 'Content Library'
/**
 * The statuses the list is created with on first run, and now ALSO the vocabulary a database
 * status is checked against before it is pushed.
 *
 * A status outside this set is refused rather than sent. ClickUp rejects an unknown status with a
 * 400, which would abort the whole run part way through and leave the board half mirrored with no
 * statement of which half; checking first turns that into one named asset that did not sync while
 * the rest do. This is a DECLARED expectation, not a live read of the list, so if someone renames
 * a status in the ClickUp UI this refuses every asset until the constant is updated. That is the
 * intended direction of failure: refusing is visible, and pushing a status the board cannot hold
 * is not.
 */
const LIST_STATUSES = ['idea', 'hooked', 'scripted', 'recorded', 'edited', 'approved', 'done']
// Ewa's sign-off list. This mirror must NEVER read, write, or resolve to it.
const PROTECTED_CONTENT_REVIEW_LIST_ID = '901218140081'

const MIRROR_NOTE =
  'Mirror. Identity and craft come from the asset file in git; status, pre-flight, drive and every rendition state come from content_assets / content_renditions. Do not edit here: neither store reads this card.'
const MISSING_NOTE = 'source file missing'
const FINGERPRINT_RE = /Sync fingerprint:\s*([0-9a-f]+)/i

/**
 * What a state cell says when the row that would have filled it does not exist.
 *
 * A blank cell is the `|| 'idea'` mistake wearing quieter clothes: it reads as "nothing has
 * happened yet" when the truth is "nobody looked, or the lookup found nothing". Those are
 * different facts and the board must not merge them.
 */
const NO_ROW_CELL = 'NO ROW'
const NOT_IN_FILE_CELL = 'NOT IN FILE'

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

// The assets dir, anchored to THIS script's location so cwd does not matter. Deliberately not
// content-doctor's cwd-relative MACHINE: this script is invoked by a workflow from a directory
// nothing here controls, and the scanner incident content-doctor documents is exactly what a
// cwd-relative path buys.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(SCRIPT_DIR, '../../../../06_marketing/content-machine/assets')
// Repo-relative prefix for the asset path shown in each task description.
const REPO_ASSET_PREFIX = 'andro-prime/06_marketing/content-machine/assets'

// ═══════════════════════════════════════════════════════════════════ types

/** The identity and craft half, read from the file and nowhere else. */
interface AssetFile {
  abs: string
  basename: string
  slug: string
  hasFrontmatter: boolean
  /** Flat frontmatter, already cleaned by content-doctor's parser. Strings only, no Date coercion. */
  fm: Record<string, string>
  /** WHICH renditions exist. Their state is not read from here and is not present in most files. */
  declared: Array<Record<string, string>>
  /** The markdown body, generated state block removed. */
  body: string
}

/** One rendition line: identity from the file, state from the database, neither invented. */
interface RenditionLine {
  platform: string
  format: string
  thumb: string
  /** Null when no content_renditions row matches this platform/format pair. */
  row: DbRendition | null
  /** True when the database has the row and the file does not declare it. */
  undeclared: boolean
}

/** An asset that has everything it needs to be mirrored truthfully. */
interface Mirrorable {
  file: AssetFile
  row: DbAsset
  status: string
  renditions: RenditionLine[]
}

/** Why an asset was NOT mirrored. Every one of these is said out loud on the report. */
type RefusalKind = 'no-frontmatter' | 'no-row' | 'status-not-on-list'
interface Refusal {
  file: AssetFile
  kind: RefusalKind
  why: string
}

function str(v: unknown): string {
  if (v === undefined || v === null) return ''
  return String(v).trim()
}

/**
 * Read a database value BY ITS FRONTMATTER NAME, through content-sync's exported map.
 *
 * The point is that this file never types a column name. `drive` is `drive_url`, `url` is
 * `external_url`, `publish_date` is `published_at`, and a misremembered column does not throw: it
 * reads `undefined`, renders an empty cell, and looks precisely like a fact that was never
 * recorded. One map, owned by the script that defined the split, is the only version of these
 * names that can go stale, and its own test asserts every column in it is actually SELECTed.
 */
function assetVal(row: DbAsset, key: keyof typeof ASSET_KEY_COLUMN): string {
  return str((row as unknown as Record<string, unknown>)[ASSET_KEY_COLUMN[key]])
}
function rendVal(row: DbRendition, key: keyof typeof RENDITION_KEY_COLUMN): string {
  return str((row as unknown as Record<string, unknown>)[RENDITION_KEY_COLUMN[key]])
}

/** A markdown table cell: a raw pipe or newline would break the table silhouette. */
function cell(raw: string): string {
  return raw.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim()
}

// ═══════════════════════════════════════════════════════════════════ reading

function readAssetFiles(): AssetFile[] {
  const files = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
  return files.map((f) => {
    const abs = path.join(ASSETS_DIR, f)
    const text = fs.readFileSync(abs, 'utf-8')
    const parsed = parseAsset(text)
    const fmEnd = frontmatterEnd(text)
    // The generated block is state the database already owns, so it is removed here rather than
    // pushed. See the header: two renderings of one fact in one card is the failure this phase
    // removes, not a convenience.
    const body = fmEnd === null ? '' : stripGeneratedState(text.slice(fmEnd)).trim()
    return {
      abs,
      basename: f,
      // Same slug rule content-sync uses: the frontmatter key wins, the filename is the fallback.
      slug: parsed.flat.slug || fileSlug(f),
      hasFrontmatter: parsed.hasFrontmatter && fmEnd !== null,
      fm: parsed.flat,
      declared: parsed.renditions,
      body,
    }
  })
}

/** The join key for a rendition. Lowercased so a capitalisation difference is not a second row. */
const rendKey = (platform: string, format: string) => `${platform.toLowerCase()}/${format.toLowerCase()}`

/**
 * Line up the renditions the file declares against the rows the database holds, keeping BOTH
 * sides of every disagreement.
 *
 * The file owns which renditions exist and the database owns their state, so in the healthy case
 * the two sets are identical and every line has both halves. The two unhealthy cases say so
 * rather than rendering as an ordinary row:
 *
 * A DECLARED RENDITION WITH NO ROW has unknown state, not empty state. Blank cells would read as
 * "not published yet", which is a claim nobody checked.
 *
 * A ROW THE FILE DOES NOT DECLARE is kept, marked, and never dropped. It is a live fact about a
 * post: `substack-welcome-normal-on-paper` is exactly this today, a published newsletter with a
 * real URL against an asset file that declares no renditions at all. Iterating the file alone
 * would have silently removed the only trace of it from the board, which is the same class of
 * loss as the fallback, just quieter.
 */
function joinRenditions(file: AssetFile, rows: DbRendition[]): RenditionLine[] {
  const byKey = new Map(rows.map((r) => [rendKey(r.platform, r.format), r]))
  const used = new Set<string>()
  // The file's declared order first: that is the order a human chose while writing.
  const lines: RenditionLine[] = file.declared.map((d) => {
    const platform = str(d.platform)
    const format = str(d.format)
    const k = rendKey(platform, format)
    used.add(k)
    return { platform, format, thumb: str(d.thumb), row: byKey.get(k) ?? null, undeclared: false }
  })
  // Then anything the database holds that the file never mentioned, in a stable order.
  const extras = rows
    .filter((r) => !used.has(rendKey(r.platform, r.format)))
    .sort((a, b) => (rendKey(a.platform, a.format) < rendKey(b.platform, b.format) ? -1 : 1))
  for (const r of extras) {
    lines.push({ platform: r.platform, format: r.format, thumb: '', row: r, undeclared: true })
  }
  return lines
}

// ═══════════════════════════════════════════════════════════════════ rendering

/** Build the task description markdown WITHOUT the fingerprint line. */
function renderDescriptionBody(m: Mirrorable): string {
  const f = m.file.fm
  const lines: string[] = []
  lines.push(`# ${str(f.title) || m.file.slug}`)
  lines.push('')
  lines.push(`- Content type: ${str(f.content_type) || 'n/a'}`)
  lines.push(
    `- Funnel: ${str(f.funnel_stage) || 'n/a'} | awareness ${str(f.awareness) || 'n/a'} | cta ${
      str(f.cta) || 'n/a'
    } | marker ${str(f.marker) || 'n/a'}`,
  )
  // Pre-flight, drive and every rendition cell below are database reads. There is no `||` default
  // on any of them that could stand in for a value: an empty column is printed as the word the
  // database gave, and a missing ROW is printed as NO ROW.
  const pf = assetVal(m.row, 'preflight') || 'not-run'
  const pfDate = shortStamp(assetVal(m.row, 'preflight_date'))
  lines.push(`- Preflight: ${pf}${pfDate ? ` (${pfDate})` : ''}`)
  lines.push(`- Canonical asset: ${str(f.canonical_asset) || 'none'}`)
  lines.push(`- Series: ${str(f.series) || 'none'}`)
  lines.push(`- Drive folder: ${assetVal(m.row, 'drive') || 'not linked yet'}`)
  lines.push(`- Repo path: ${REPO_ASSET_PREFIX}/${m.file.basename}`)
  lines.push('')
  lines.push('## Renditions')
  lines.push('')
  lines.push('| platform | format | thumb | status | url | publish_date |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  if (m.renditions.length === 0) {
    lines.push('| none declared, and none in content_renditions | | | | | |')
  } else {
    for (const r of m.renditions) {
      const thumb = r.undeclared ? NOT_IN_FILE_CELL : r.thumb
      const status = r.row ? rendVal(r.row, 'status') : NO_ROW_CELL
      const url = r.row ? rendVal(r.row, 'url') : NO_ROW_CELL
      const published = r.row ? shortStamp(rendVal(r.row, 'publish_date')) : NO_ROW_CELL
      lines.push(
        `| ${cell(r.platform)} | ${cell(r.format)} | ${cell(thumb)} | ${cell(status)} | ${cell(url)} | ${cell(
          published,
        )} |`,
      )
    }
  }
  // The two disagreement shapes are spelled out under the table. A marker in a cell tells a
  // reader something is odd; only a sentence tells them which store is missing what, and this
  // card is the only place most people will look.
  const noRow = m.renditions.filter((r) => !r.row).length
  const extra = m.renditions.filter((r) => r.undeclared).length
  if (noRow) {
    lines.push('')
    lines.push(
      `> ${NO_ROW_CELL}: ${noRow} rendition(s) are declared in the asset file but have no content_renditions row, so their state is UNKNOWN rather than empty. Nothing here is a guess at it.`,
    )
  }
  if (extra) {
    lines.push('')
    lines.push(
      `> ${NOT_IN_FILE_CELL}: ${extra} rendition(s) exist in content_renditions but are not declared in the asset file. The file owns which renditions exist, so this is a real disagreement; the row is shown rather than dropped because it is a fact about a live post.`,
    )
  }
  if (m.file.body) {
    // The full asset body (chosen hook + script) so the words are readable from the card, e.g.
    // on a phone. Craft, not state, and read-only like everything else here.
    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push(m.file.body)
  }
  lines.push('')
  lines.push(MIRROR_NOTE)
  return lines.join('\n')
}

/** Full description = body + a stable fingerprint line (so we can diff cheaply). */
function renderDescription(m: Mirrorable): { markdown: string; fingerprint: string } {
  const body = renderDescriptionBody(m)
  const fingerprint = crypto
    .createHash('sha1')
    .update(`${m.status}\n${body}`)
    .digest('hex')
    .slice(0, 12)
  return { markdown: `${body}\n\nSync fingerprint: ${fingerprint}`, fingerprint }
}

function existingFingerprint(task: CuTask): string | null {
  const m = FINGERPRINT_RE.exec(task.description)
  return m ? m[1].toLowerCase() : null
}

function isAuthError(msg: string): boolean {
  return /\b401\b|OAUTH|Authorization|Team\(s\) not authorized|token/i.test(msg)
}

// ═══════════════════════════════════════════════════════════════════ ClickUp

async function resolveList(): Promise<{ id: string; existed: boolean } | null> {
  // team -> folder "Phase 0 Launch" -> list "Content Library".
  const spaces = await getSpaces(TEAM_ID)
  for (const space of spaces) {
    const folders = await getFolders(space.id)
    const folder = folders.find((f) => f.name.trim().toLowerCase() === FOLDER_NAME.toLowerCase())
    if (!folder) continue
    const lists = await getFolderLists(folder.id)
    const list = lists.find((l) => l.name.trim().toLowerCase() === LIST_NAME.toLowerCase())
    if (list) {
      if (list.id === PROTECTED_CONTENT_REVIEW_LIST_ID) {
        throw new Error(`refusing to sync: "${LIST_NAME}" resolved to the protected Content Review list`)
      }
      return { id: list.id, existed: true }
    }
    // Folder found, list missing: create it once (skipped on --dry).
    if (DRY) {
      log(`CREATE LIST  "${LIST_NAME}" in folder "${FOLDER_NAME}" (space "${space.name}") with statuses: ${LIST_STATUSES.join(', ')}`)
      return null
    }
    const created = await createFolderList({ folderId: folder.id, name: LIST_NAME, statuses: LIST_STATUSES })
    if (created.id === PROTECTED_CONTENT_REVIEW_LIST_ID) {
      throw new Error('refusing to continue: created list id collided with the protected Content Review list')
    }
    log(`CREATED LIST "${LIST_NAME}" (${created.id}) in folder "${FOLDER_NAME}"`)
    return { id: created.id, existed: false }
  }
  throw new Error(`folder "${FOLDER_NAME}" not found under team ${TEAM_ID}; cannot resolve the "${LIST_NAME}" list`)
}

/** Print the plan with REAL statuses when ClickUp cannot be reached. */
function printLocalPlan(mirrorable: Mirrorable[]) {
  log(`local plan for ${mirrorable.length} mirrorable asset(s) (no ClickUp diff possible):`)
  for (const m of mirrorable) log(`  - ${m.file.slug}  [status: ${m.status}]`)
}

/**
 * A table that could not be read is fatal, not a degraded verdict. The same rule content-sync
 * states: without `content_assets` every asset looks row-less, and the run would print thirteen
 * confident refusals, or worse, mirror nothing while looking busy.
 */
function must<T>(name: string, t: TableRead<T>): T[] {
  if (t.error) throw new Error(`${name} could not be read: ${t.error}`)
  return t.rows
}

// ═══════════════════════════════════════════════════════════════════════ run

async function run(): Promise<number> {
  // 1. The assets directory is resolved from this file, so its absence is a layout fault rather
  //    than an empty pipeline. It used to print "no assets yet" and exit 0, which is a clean
  //    verdict over zero files: the same unperformed-check-reports-a-pass shape as the fallback.
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`ERROR: the assets directory is not at ${ASSETS_DIR}. Refusing to report a mirror it cannot see.`)
    return 1
  }
  const files = readAssetFiles()

  // 2. The database is the state source, so it is read before anything is decided. Both stores
  //    are needed even for --dry: a plan computed without state would be a list of guesses.
  const [assetsT, rendsT] = await Promise.all([
    loadTable<DbAsset>('content_assets', ASSET_SELECT),
    loadTable<DbRendition>('content_renditions', RENDITION_SELECT),
  ])
  const assetRows = must('content_assets', assetsT)
  const rendRows = must('content_renditions', rendsT)

  log(`${files.length} asset file(s), ${assetRows.length} content_assets row(s), ${rendRows.length} rendition row(s)`)

  // An empty read is reported before anything else, because every line under it would otherwise
  // be a confident statement about nothing. Same wording content-sync uses, from the same helper.
  const nothingMeasured = denominatorProblem(files.length, assetRows.length)
  if (nothingMeasured) {
    console.log(`  ! ${nothingMeasured}`)
    return 3
  }

  const bySlug = new Map(assetRows.map((a) => [a.slug, a]))
  const rendsByAsset = new Map<string, DbRendition[]>()
  for (const r of rendRows) rendsByAsset.set(r.asset_id, [...(rendsByAsset.get(r.asset_id) ?? []), r])

  // 3. Split the files into what can be mirrored truthfully and what cannot. Nothing in the
  //    second group reaches ClickUp, in either direction, on either mode.
  const mirrorable: Mirrorable[] = []
  const refusals: Refusal[] = []
  for (const file of files) {
    if (!file.hasFrontmatter) {
      refusals.push({
        file,
        kind: 'no-frontmatter',
        why: 'the file has no readable frontmatter, so it carries no identity to mirror and no slug to join on.',
      })
      continue
    }
    const row = bySlug.get(file.slug)
    if (!row) {
      refusals.push({
        file,
        kind: 'no-row',
        why: `no content_assets row with slug "${file.slug}", so this asset has NO KNOWN STATUS. Refusing to create or update its card: a default here is how a stripped asset became "idea" on a board a human reads. Fix the row, or ask content-doctor invariant 1 why it is missing.`,
      })
      continue
    }
    const status = assetVal(row, 'status')
    if (!status || !LIST_STATUSES.includes(status)) {
      refusals.push({
        file,
        kind: 'status-not-on-list',
        why: `content_assets.status is ${status ? `"${status}"` : 'empty'}, which is not a status this list can hold (${LIST_STATUSES.join(', ')}). Refusing to push it: ClickUp would reject it mid-run and leave the board half mirrored.`,
      })
      continue
    }
    mirrorable.push({
      file,
      row,
      status,
      renditions: joinRenditions(file, rendsByAsset.get(row.id) ?? []),
    })
  }

  for (const r of refusals) console.log(`  ! ${r.file.basename}  [${r.kind}] ${r.why}`)

  // 4. Token handling. Reads (even for --dry) need the token to resolve the list.
  const token = process.env.CLICKUP_API_TOKEN
  if (!token) {
    if (DRY) {
      log('CLICKUP_API_TOKEN not set: cannot resolve the Content Library list or diff existing tasks; showing the local plan only.')
      printLocalPlan(mirrorable)
      return exitCode(refusals, mirrorable.length)
    }
    console.error('ERROR: CLICKUP_API_TOKEN is not set; cannot mirror to ClickUp.')
    return 1
  }

  // 5. Resolve the list (create once if missing and not --dry).
  let list: { id: string; existed: boolean } | null
  try {
    list = await resolveList()
  } catch (e) {
    const msg = (e as Error).message
    if (isAuthError(msg)) {
      console.error(`ERROR: ClickUp auth failed: ${msg}`)
      return 1
    }
    throw e
  }

  // On --dry with a missing list, there is nothing to diff against: every asset is a create.
  const existingTasks: CuTask[] = list?.existed ? await getListTasks(list.id) : []
  const byName = new Map<string, CuTask>()
  for (const t of existingTasks) byName.set(t.name.trim().toLowerCase(), t)

  let creates = 0
  let updates = 0
  let skips = 0

  for (const m of mirrorable) {
    const { markdown, fingerprint } = renderDescription(m)
    const existing = byName.get(m.file.slug.trim().toLowerCase())

    if (!existing) {
      log(`CREATE  ${m.file.slug}  [status: ${m.status}]`)
      creates++
      if (!DRY && list) {
        await createTaskInList({ listId: list.id, name: m.file.slug, markdown, status: m.status })
      }
      continue
    }

    const statusDiffers = existing.statusName !== m.status.toLowerCase()
    const descDiffers = existingFingerprint(existing) !== fingerprint
    if (!statusDiffers && !descDiffers) {
      skips++
      // Named in --dry, silent otherwise. The point of a dry run after this repoint is to read
      // the status of every asset and check it, and an asset that prints nothing cannot be read.
      if (DRY) log(`UNCHANGED  ${m.file.slug}  [status: ${m.status}]`)
      continue
    }
    const why = [statusDiffers ? `status ${existing.statusName || 'none'} -> ${m.status}` : '', descDiffers ? 'description' : '']
      .filter(Boolean)
      .join(', ')
    log(`UPDATE  ${m.file.slug}  [status: ${m.status}]  (${why})`)
    updates++
    if (!DRY) {
      await updateTaskContent({
        taskId: existing.id,
        markdown: descDiffers ? markdown : undefined,
        status: statusDiffers ? m.status : undefined,
      })
    }
  }

  // 6. Orphan tasks: an asset file vanished. Never delete; note it once instead.
  //    The set is built from EVERY file read, refused ones included. A refused asset still has a
  //    file, so treating it as an orphan would stamp "source file missing" on a card whose file
  //    is sitting right there, which is a second false statement caused by the first.
  const assetNames = new Set(files.map((f) => f.slug.trim().toLowerCase()))
  for (const t of existingTasks) {
    if (assetNames.has(t.name.trim().toLowerCase())) continue
    if (t.description.includes(MISSING_NOTE)) continue
    log(`ORPHAN  ${t.name}  (marking "${MISSING_NOTE}")`)
    updates++
    if (!DRY) {
      const flagged = `${t.description}\n\n> WARNING ${MISSING_NOTE}: no matching asset in git as of ${new Date()
        .toISOString()
        .slice(0, 10)}. ${MIRROR_NOTE}`
      await updateTaskContent({ taskId: t.id, markdown: flagged })
    }
  }

  log(`plan: ${creates} create, ${updates} update, ${skips} unchanged, ${refusals.length} refused`)
  return exitCode(refusals, mirrorable.length)
}

/**
 * The verdict. A refusal is never folded into a success line: the whole regression was a wrong
 * value delivered quietly, and the fix is worth nothing if the refusals that replace it are also
 * quiet.
 */
function exitCode(refusals: Refusal[], mirroredCount: number): number {
  if (refusals.some((r) => r.kind === 'status-not-on-list')) {
    console.log(`EXIT 2: ${refusals.length} asset(s) were NOT mirrored, at least one because its status is not a status this list can hold.`)
    return 2
  }
  if (refusals.length) {
    console.log(`EXIT 3: ${mirroredCount} asset(s) mirrored, ${refusals.length} could NOT be. Their cards are untouched and their state is UNMIRRORED, which is not the same as unchanged.`)
    return 3
  }
  return 0
}

// Before the first line is printed: a reader that walks away mid-report must not be able to turn
// a refusal into a broken-tool code. See content-sync's header for the EPIPE measurement.
ignoreBrokenPipe()
run()
  .catch((e) => {
    console.error('CONTENT-LIBRARY-SYNC ERROR:', (e as Error).message)
    return 1
  })
  // Never `process.exit`: on Windows it trips a libuv assertion and returns 127 instead of the
  // verdict about one run in five while the keep-alive sockets are still closing (measured
  // 2026-08-01, documented in content-sync). This script now holds Supabase sockets as well as
  // ClickUp ones, so it has strictly more of them open at the end than when that was measured.
  // content-sync's pool-close helper is module-private there; rather than grow a second copy of
  // it here, this accepts a slower exit, which costs latency and can never cost correctness.
  .then((code) => settleExit(code))
