/**
 * Content Library mirror (Phase 5, deliverable D5). One-way git -> ClickUp sync.
 *
 * Git is the database. Every founder content idea is one markdown asset file under
 * 06_marketing/content-machine/assets/*.md whose frontmatter is the tracker. This
 * script mirrors that state into ONE ClickUp task per asset in a "Content Library"
 * list, so the pipeline is visible without a second by-hand tracker. Git wins: this
 * script only ever reads git and writes ClickUp, never the reverse, and never deletes
 * a task (a vanished asset file gets a "source file missing" note instead).
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/content-library-sync.ts --dry
 *   npx tsx scripts/content-engine/content-library-sync.ts
 *
 * --dry prints the full plan of creates/updates and calls no mutating endpoint
 * (reads are still allowed so the plan is real). A missing assets dir is NOT an
 * error: it prints "no assets yet" and exits 0.
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { loadEnvLocal } from './_shared'
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
// The list statuses the list is created with on first run (plain, case per ClickUp norms).
const LIST_STATUSES = ['idea', 'hooked', 'scripted', 'recorded', 'edited', 'approved', 'done']
// Ewa's sign-off list. This mirror must NEVER read, write, or resolve to it.
const PROTECTED_CONTENT_REVIEW_LIST_ID = '901218140081'

const MIRROR_NOTE = 'Mirror of git. Do not edit here: git wins.'
const MISSING_NOTE = 'source file missing'
const FINGERPRINT_RE = /Sync fingerprint:\s*([0-9a-f]+)/i

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

// The assets dir, anchored to THIS script's location so cwd does not matter.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(SCRIPT_DIR, '../../../../06_marketing/content-machine/assets')
// Repo-relative prefix for the asset path shown in each task description.
const REPO_ASSET_PREFIX = 'andro-prime/06_marketing/content-machine/assets'

interface Rendition {
  platform: string
  format: string
  thumb: string
  status: string
  url: string
  publish_date: string
}

interface Asset {
  file: string // absolute path
  slug: string // task name
  status: string
  data: Record<string, unknown>
  renditions: Rendition[]
}

function str(v: unknown): string {
  if (v === undefined || v === null) return ''
  return String(v).trim()
}

function readAssets(): Asset[] {
  const files = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
  const assets: Asset[] = []
  for (const f of files) {
    const abs = path.join(ASSETS_DIR, f)
    const parsed = matter(fs.readFileSync(abs, 'utf-8'))
    const data = parsed.data as Record<string, unknown>
    // Slug falls back to the filename (minus date prefix + extension) if unset.
    const slug = str(data.slug) || f.replace(/\.md$/i, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
    const rawRenditions = Array.isArray(data.renditions) ? (data.renditions as Record<string, unknown>[]) : []
    const renditions: Rendition[] = rawRenditions.map((r) => ({
      platform: str(r.platform),
      format: str(r.format),
      thumb: str(r.thumb),
      status: str(r.status),
      url: str(r.url),
      publish_date: str(r.publish_date),
    }))
    assets.push({ file: abs, slug, status: str(data.status) || 'idea', data, renditions })
  }
  return assets
}

/** Build the task description markdown WITHOUT the fingerprint line. */
function renderDescriptionBody(a: Asset): string {
  const d = a.data
  const lines: string[] = []
  lines.push(`# ${str(d.title) || a.slug}`)
  lines.push('')
  lines.push(`- Content type: ${str(d.content_type) || 'n/a'}`)
  lines.push(
    `- Funnel: ${str(d.funnel_stage) || 'n/a'} | awareness ${str(d.awareness) || 'n/a'} | cta ${
      str(d.cta) || 'n/a'
    } | marker ${str(d.marker) || 'n/a'}`,
  )
  const pfDate = str(d.preflight_date)
  lines.push(`- Preflight: ${str(d.preflight) || 'not-run'}${pfDate ? ` (${pfDate})` : ''}`)
  lines.push(`- Canonical asset: ${str(d.canonical_asset) || 'none'}`)
  lines.push(`- Series: ${str(d.series) || 'none'}`)
  lines.push(`- Drive folder: ${str(d.drive) || 'not linked yet'}`)
  lines.push(`- Repo path: ${REPO_ASSET_PREFIX}/${path.basename(a.file)}`)
  lines.push('')
  lines.push('## Renditions')
  lines.push('')
  lines.push('| platform | format | thumb | status | url | publish_date |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  if (a.renditions.length === 0) {
    lines.push('| none yet | | | | | |')
  } else {
    for (const r of a.renditions) {
      lines.push(
        `| ${r.platform || ''} | ${r.format || ''} | ${r.thumb || ''} | ${r.status || ''} | ${
          r.url || ''
        } | ${r.publish_date || ''} |`,
      )
    }
  }
  lines.push('')
  lines.push(MIRROR_NOTE)
  return lines.join('\n')
}

/** Full description = body + a stable fingerprint line (so we can diff cheaply). */
function renderDescription(a: Asset): { markdown: string; fingerprint: string } {
  const body = renderDescriptionBody(a)
  const fingerprint = crypto
    .createHash('sha1')
    .update(`${a.status}\n${body}`)
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

/** Print the local plan (task name + status) when ClickUp cannot be reached. */
function printLocalPlan(assets: Asset[]) {
  log(`local plan for ${assets.length} asset(s) (no ClickUp diff possible):`)
  for (const a of assets) log(`  - ${a.slug}  [status: ${a.status}]`)
}

async function run() {
  // 1. A missing assets dir is not an error.
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log('no assets yet')
    return 0
  }
  const assets = readAssets()
  if (assets.length === 0) {
    console.log('no assets yet')
    return 0
  }
  log(`found ${assets.length} asset file(s) in ${ASSETS_DIR}`)

  // 2. Token handling. Reads (even for --dry) need the token to resolve the list.
  const token = process.env.CLICKUP_API_TOKEN
  if (!token) {
    if (DRY) {
      log('CLICKUP_API_TOKEN not set: cannot resolve the Content Library list or diff existing tasks; showing local plan only.')
      printLocalPlan(assets)
      return 0
    }
    console.error('ERROR: CLICKUP_API_TOKEN is not set; cannot mirror to ClickUp.')
    return 1
  }

  // 3. Resolve the list (create once if missing and not --dry).
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

  for (const a of assets) {
    const { markdown, fingerprint } = renderDescription(a)
    const existing = byName.get(a.slug.trim().toLowerCase())

    if (!existing) {
      log(`CREATE  ${a.slug}  [status: ${a.status}]`)
      creates++
      if (!DRY && list) {
        await createTaskInList({ listId: list.id, name: a.slug, markdown, status: a.status })
      }
      continue
    }

    const statusDiffers = existing.statusName !== a.status.toLowerCase()
    const descDiffers = existingFingerprint(existing) !== fingerprint
    if (!statusDiffers && !descDiffers) {
      skips++
      continue
    }
    const why = [statusDiffers ? `status ${existing.statusName || 'none'} -> ${a.status}` : '', descDiffers ? 'description' : '']
      .filter(Boolean)
      .join(', ')
    log(`UPDATE  ${a.slug}  (${why})`)
    updates++
    if (!DRY) {
      await updateTaskContent({
        taskId: existing.id,
        markdown: descDiffers ? markdown : undefined,
        status: statusDiffers ? a.status : undefined,
      })
    }
  }

  // 4. Orphan tasks: an asset file vanished. Never delete; note it once instead.
  const assetNames = new Set(assets.map((a) => a.slug.trim().toLowerCase()))
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

  log(`plan: ${creates} create, ${updates} update, ${skips} unchanged`)
  return 0
}

run()
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error('CONTENT-LIBRARY-SYNC ERROR:', (e as Error).message)
    process.exit(1)
  })
