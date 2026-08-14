/**
 * Create the Drive working-media folder for any asset that has earned one, and verify the ones
 * that already exist.
 *
 *   npx tsx scripts/content-engine/drive-folders.ts --dry-run     print every write, make none
 *   npx tsx scripts/content-engine/drive-folders.ts               create and write drive_url back
 *   npx tsx scripts/content-engine/drive-folders.ts --log         also write an agent_runs row
 *
 * PLAN STEP 3.5, first half. The second half — a cold archive of finished shot media on
 * nc-server-01 — waits on step 3.2 (Hetzner backups), which is Keith's to enable.
 *
 * WHY IT MATTERS NOW AND NOT LATER. Shot media is the only genuinely unrecoverable asset class in
 * this business: an article can be rewritten and a carousel re-rendered from `decks/`, but a
 * filming day cannot be re-shot. Ten assets sit at `scripted` and none has ever reached
 * `recorded`, so today this job has nothing to create. The day after the first shoot it has ten
 * folders' worth of footage to have already put somewhere, and a convention invented at that
 * moment is a convention invented under pressure.
 *
 * THE CONVENTION IS NOT MINE TO CHOOSE — it was checked against the live Drive on 2026-07-31,
 * after an earlier draft of the automation plan invented `01-raw / 02-edit / 03-final` out of
 * nothing while a real convention was already documented in four places and in use:
 *
 *     Content/YYYY-MM/<slug>/{raw,final,thumb}/
 *
 * Three subfolders, not two: `thumb/` exists because `sop-thumbnail.md` writes fixed filenames
 * into it. The slug folder is BARE, with no date prefix, even though the asset file is named
 * `YYYY-MM-DD-<slug>.md` — the month lives one level up. The month is the asset's MINT month, not
 * its shoot month, so a folder does not move when filming slips.
 *
 * 🔴 `gws`, NEVER THE DRIVE MCP CONNECTOR, AND THIS IS NOT A PREFERENCE. The two authenticate as
 * different Google accounts: `gws` is keith@andro-prime.com (the business Workspace, which holds
 * the real `Content` tree) and the connector is keithantony5@gmail.com (personal, which holds an
 * EMPTY `Content` folder created the same day and never used). A job built on the connector would
 * create folders on the personal Drive, beside an empty decoy with the same name, and nothing
 * would look wrong.
 *
 * IT VERIFIES AS WELL AS CREATES, which is the half a create-only job would miss. An asset whose
 * `drive_url` points at a folder someone renamed, trashed or emptied reads as done from the
 * database and is not. That state is invisible until the day footage needs somewhere to go.
 */
import { execFile } from 'child_process'
import path from 'path'
import { promisify } from 'util'
import { loadEnvLocal, admin, logRun } from './_shared'

const exec = promisify(execFile)

loadEnvLocal()

/**
 * The `Content` root on the business Drive, documented in the automation plan.
 *
 * Overridable, but VERIFIED at runtime rather than trusted: a hardcoded id that silently points
 * somewhere else is the exact failure this repo keeps recording, and here it would mean every
 * folder created in a plausible-looking wrong place.
 */
export const DRIVE_CONTENT_ROOT = process.env.DRIVE_CONTENT_ROOT_ID ?? '1og3i5RxjUW9RvL9qPvVBvRjedDMtwQAf'
export const SUBFOLDERS = ['raw', 'final', 'thumb'] as const

/**
 * Formats whose production involves a camera.
 *
 * Deliberately NARROWER than `MEDIA_IS_THE_POST` in metricool-schedule.ts, which also contains
 * `carousel` and `image-post`. Those are media but they are RENDERED, reproducible from a data
 * file by one command, and they have no raw footage to keep. This set is the assets where losing
 * the working copy loses something that cannot be remade.
 */
export const SHOT_FORMATS = ['reel', 'short', 'long-form', 'video', 'story']

/** Statuses at or past the point the folder is owed. Before `scripted` there is nothing to film. */
export const FOLDER_OWED_FROM = ['scripted', 'recorded', 'edited', 'approved', 'scheduled', 'done']

export interface DriveFile { id: string; name: string; mimeType?: string }

/**
 * One gws invocation, as a function so it can be faked.
 *
 * Injectable for the same reason `loadTable` takes a client and `metricoolFetcher` takes a fetch:
 * the branches that matter here are the ones a happy live run never reaches — a duplicate folder,
 * a trashed folder, a rename, a create that returns no id. None of those can be produced on
 * demand against the real Drive, and a job whose only exercised path is "everything already
 * exists" is a job whose create path ships untested.
 */
export type Gws = (args: string[]) => Promise<Record<string, unknown>>

/** The real one. stderr carries the keyring banner, so only stdout is parsed. */
export const realGws: Gws = async (args) => {
  const { stdout } = await exec('gws', args, { maxBuffer: 8 * 1024 * 1024, windowsHide: true })
  const text = stdout.trim()
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error(`gws returned output that is not JSON: ${text.slice(0, 200)}`)
  }
}

/** Children of one folder, by exact name. Drive allows duplicate names, so this returns all. */
export async function childrenNamed(gws: Gws, parentId: string, name: string): Promise<DriveFile[]> {
  const q = `'${parentId}' in parents and name = '${name.replace(/'/g, "\\'")}' and trashed = false`
  const res = await gws(['drive', 'files', 'list', '--params',
    JSON.stringify({ q, fields: 'files(id,name,mimeType)', pageSize: 50 }), '--format', 'json'])
  return ((res.files as DriveFile[]) ?? [])
}

/**
 * Find a child folder by name, or create it. Returns the id and whether it was created.
 *
 * DUPLICATES ARE A REFUSAL, not a "pick the first". Drive genuinely permits two folders with one
 * name in one parent, and choosing between them silently would split an asset's media across two
 * places that both look right — the failure would surface as footage that is simply missing.
 */
export async function findOrCreateFolder(
  gws: Gws, parentId: string, name: string, dryRun: boolean,
): Promise<{ id: string | null; created: boolean }> {
  const found = (await childrenNamed(gws, parentId, name))
    .filter((f) => f.mimeType === 'application/vnd.google-apps.folder')
  if (found.length > 1) {
    throw new Error(`${found.length} folders named "${name}" under ${parentId}; refusing to guess which is the real one`)
  }
  if (found.length === 1) return { id: found[0].id, created: false }
  if (dryRun) return { id: null, created: true }

  const res = await gws(['drive', 'files', 'create', '--json', JSON.stringify({
    name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId],
  }), '--params', JSON.stringify({ fields: 'id,name' }), '--format', 'json'])
  const id = res.id as string | undefined
  if (!id) throw new Error(`Drive did not return an id when creating "${name}"`)
  return { id, created: true }
}

/** `YYYY-MM` of the asset's mint date. The month folder is the mint month, never the shoot month. */
export function mintMonth(createdAt: string): string {
  return createdAt.slice(0, 7)
}

export const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`

/** The id inside a Drive folder URL, or null if it is not one. */
export function idFromUrl(url: string | null): string | null {
  return /\/folders\/([A-Za-z0-9_-]+)/.exec(url ?? '')?.[1] ?? null
}

export interface AssetNeedingFolder {
  id: string; slug: string; status: string; created_at: string; drive_url: string | null
}

export interface Outcome {
  slug: string
  action: 'created' | 'verified' | 'repaired' | 'skipped' | 'FAILED'
  detail: string
  url?: string
}

/**
 * Assert the root id really is the `Content` folder before anything is created under it.
 *
 * Cheap, and it is the difference between "the job did nothing" and "the job built a correct tree
 * in the wrong place", which is the more expensive of the two by a wide margin.
 */
export async function verifyRoot(gws: Gws): Promise<void> {
  const res = await gws(['drive', 'files', 'get', '--params',
    JSON.stringify({ fileId: DRIVE_CONTENT_ROOT, fields: 'id,name,mimeType,trashed' }), '--format', 'json'])
  if (res.mimeType !== 'application/vnd.google-apps.folder') {
    throw new Error(`DRIVE_CONTENT_ROOT ${DRIVE_CONTENT_ROOT} is not a folder (${String(res.mimeType)})`)
  }
  if (res.name !== 'Content') {
    throw new Error(`DRIVE_CONTENT_ROOT ${DRIVE_CONTENT_ROOT} is named "${String(res.name)}", not "Content". Refusing to create an asset tree under it.`)
  }
  if (res.trashed) throw new Error(`DRIVE_CONTENT_ROOT ${DRIVE_CONTENT_ROOT} is in the trash`)
}

/** Ensure `Content/<month>/<slug>/{raw,final,thumb}` exists. Returns the slug folder id. */
export async function ensureTree(
  gws: Gws, slug: string, month: string, dryRun: boolean,
): Promise<{ id: string | null; createdAny: boolean; made: string[] }> {
  const made: string[] = []
  const monthF = await findOrCreateFolder(gws, DRIVE_CONTENT_ROOT, month, dryRun)
  if (monthF.created) made.push(month)
  if (!monthF.id) return { id: null, createdAny: true, made: [...made, `${slug}/`, ...SUBFOLDERS] }

  const slugF = await findOrCreateFolder(gws, monthF.id, slug, dryRun)
  if (slugF.created) made.push(`${month}/${slug}`)
  if (!slugF.id) return { id: null, createdAny: true, made: [...made, ...SUBFOLDERS.map((s) => `${slug}/${s}`)] }

  for (const sub of SUBFOLDERS) {
    const f = await findOrCreateFolder(gws, slugF.id, sub, dryRun)
    if (f.created) made.push(`${month}/${slug}/${sub}`)
  }
  return { id: slugF.id, createdAny: made.length > 0, made }
}

/**
 * Check an existing folder still is what the database claims: present, untrashed, and holding all
 * three subfolders. A missing subfolder is REPAIRED rather than reported, because the repair is
 * the same idempotent create the job already does and leaving it would defer the work to the one
 * day it cannot be done calmly.
 */
export async function verifyExisting(
  gws: Gws, asset: AssetNeedingFolder, dryRun: boolean,
): Promise<Outcome> {
  const id = idFromUrl(asset.drive_url)
  if (!id) return { slug: asset.slug, action: 'FAILED', detail: `drive_url is not a Drive folder URL: ${asset.drive_url}` }

  let meta: Record<string, unknown>
  try {
    meta = await gws(['drive', 'files', 'get', '--params',
      JSON.stringify({ fileId: id, fields: 'id,name,mimeType,trashed' }), '--format', 'json'])
  } catch (e) {
    return { slug: asset.slug, action: 'FAILED', detail: `drive_url points at a folder Drive will not return: ${(e as Error).message}` }
  }
  if (meta.trashed) return { slug: asset.slug, action: 'FAILED', detail: `the folder is IN THE TRASH; footage saved here would be deleted after 30 days` }
  if (meta.name !== asset.slug) {
    return { slug: asset.slug, action: 'FAILED', detail: `the folder is named "${String(meta.name)}", not "${asset.slug}"; it was renamed or drive_url points at the wrong asset` }
  }

  const missing: string[] = []
  for (const sub of SUBFOLDERS) {
    const hit = (await childrenNamed(gws, id, sub)).filter((f) => f.mimeType === 'application/vnd.google-apps.folder')
    if (!hit.length) missing.push(sub)
  }
  if (!missing.length) return { slug: asset.slug, action: 'verified', detail: 'folder present, all three subfolders', url: folderUrl(id) }
  if (dryRun) return { slug: asset.slug, action: 'repaired', detail: `WOULD create missing: ${missing.join(', ')}`, url: folderUrl(id) }

  for (const sub of missing) await findOrCreateFolder(gws, id, sub, false)
  return { slug: asset.slug, action: 'repaired', detail: `created missing subfolder(s): ${missing.join(', ')}`, url: folderUrl(id) }
}

export async function main(gws: Gws = realGws): Promise<number> {
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const started = new Date().toISOString()

  const db = admin()
  const { data: assets, error: aErr } = await db
    .from('content_assets')
    .select('id,slug,status,created_at,drive_url')
    .in('status', FOLDER_OWED_FROM)
  if (aErr) throw new Error(`content_assets: ${aErr.message}`)

  const { data: rends, error: rErr } = await db
    .from('content_renditions')
    .select('asset_id,format')
    .in('format', SHOT_FORMATS)
  if (rErr) throw new Error(`content_renditions: ${rErr.message}`)

  const shotAssetIds = new Set((rends ?? []).map((r) => r.asset_id))
  const owed = ((assets ?? []) as AssetNeedingFolder[]).filter((a) => shotAssetIds.has(a.id))

  console.log(`drive-folders${dryRun ? '  [DRY RUN: no folder is created, no row is written]' : ''}`)
  console.log(`root    : Content (${DRIVE_CONTENT_ROOT})`)
  console.log(`assets  : ${assets?.length ?? 0} at a status that can owe a folder, ${owed.length} of them with a shot rendition\n`)

  await verifyRoot(gws)

  const outcomes: Outcome[] = []
  for (const a of owed.sort((x, y) => x.slug.localeCompare(y.slug))) {
    try {
      if (a.drive_url?.trim()) {
        outcomes.push(await verifyExisting(gws, a, dryRun))
        continue
      }
      const month = mintMonth(a.created_at)
      const tree = await ensureTree(gws, a.slug, month, dryRun)
      if (dryRun || !tree.id) {
        outcomes.push({ slug: a.slug, action: 'created', detail: `WOULD create ${month}/${a.slug}/{${SUBFOLDERS.join(',')}}` })
        continue
      }
      const url = folderUrl(tree.id)
      const { error } = await db.from('content_assets').update({ drive_url: url }).eq('id', a.id)
      if (error) {
        // The folder exists but the database does not know: say so loudly rather than let the
        // next run create a SECOND folder for the same asset.
        outcomes.push({ slug: a.slug, action: 'FAILED', detail: `folder created at ${url} but drive_url write-back failed: ${error.message}`, url })
        continue
      }
      outcomes.push({ slug: a.slug, action: 'created', detail: `${month}/${a.slug}/{${SUBFOLDERS.join(',')}}`, url })
    } catch (e) {
      outcomes.push({ slug: a.slug, action: 'FAILED', detail: (e as Error).message })
    }
  }

  const icon = { created: '+', verified: '·', repaired: '~', skipped: ' ', FAILED: '✗' }
  for (const o of outcomes) console.log(`  ${icon[o.action]} ${o.slug.padEnd(30)} ${o.detail}`)

  const failed = outcomes.filter((o) => o.action === 'FAILED')
  const created = outcomes.filter((o) => o.action === 'created')
  const repaired = outcomes.filter((o) => o.action === 'repaired')
  console.log(`\n${created.length} created, ${repaired.length} repaired, ${outcomes.filter((o) => o.action === 'verified').length} verified, ${failed.length} failed.`)

  if (doLog) {
    await logRun({
      agent: 'drive-folders',
      status: failed.length ? 'error' : 'ok',
      error: failed.length ? failed.map((f) => `${f.slug}: ${f.detail}`).join(' | ') : null,
      detail: { dry_run: dryRun, considered: owed.length, created: created.length, repaired: repaired.length, failed: failed.length },
      startedAt: started,
    })
  }
  return failed.length ? 1 : 0
}

/**
 * EXACT basename equality, not a suffix match, and the difference is not cosmetic: `/drive-folders
 * \.ts$/` also matches `test-drive-folders.ts`, so merely importing this module to test it fired a
 * live run against the real Drive and the real database. Same helper and same reasoning as
 * doctor-heartbeat.ts and metricool-metrics.ts.
 */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'drive-folders.ts' || base === 'drive-folders.js'
}

/** `process.exitCode`, not `process.exit(code)`: the latter crashes on this machine (libuv). */
if (isDirectInvocation(process.argv[1])) {
  main()
    .then((code) => { process.exitCode = code })
    .catch((e) => { console.error(`\n${(e as Error).message}`); process.exitCode = 1 })
}
