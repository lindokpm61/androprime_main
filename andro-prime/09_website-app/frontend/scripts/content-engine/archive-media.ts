/**
 * Cold archive: a second copy of finished shot media, on hardware we already pay for.
 *
 *   npx tsx scripts/content-engine/archive-media.ts --dry-run    list what would be copied
 *   npx tsx scripts/content-engine/archive-media.ts              copy, verify, record
 *   npx tsx scripts/content-engine/archive-media.ts --asset ep-0-baseline
 *   npx tsx scripts/content-engine/archive-media.ts --log        also write an agent_runs row
 *
 * PLAN STEP 3.5, second half. The first half (Drive folders) is `drive-folders.ts`.
 *
 * WHY THIS AND NOT SOMETHING CLEVERER. Shot media is the only genuinely unrecoverable asset class
 * in this business. An article can be rewritten, a carousel re-rendered from `decks/` by one
 * command, a database restored from a dump. A filming day cannot be re-shot. And its only home is
 * Google Drive, which is human-touched, unversioned, and has a thirty-day trash: one wrong drag
 * and the countdown starts with nothing else holding a copy.
 *
 * THE TARGET IS nc-server-01 AT 37.27.250.169, AND THE NAME IS A TRAP. That box reports its own
 * hostname as `nc-server-03`, and nc-server-02 reports `nc-dev-02`. The Hetzner console labels and
 * the OS hostnames disagree, so `hostname` is NOT how you confirm you are on the right machine.
 * This job pins the IP and asserts what it finds, because "I checked the hostname" would be a
 * confident wrong answer here.
 *
 * 160 GB, NOT THE 320 GB THE PLAN CLAIMED. That figure was the total ACROSS both boxes and step
 * 3.5 attributed it to one. ~119 GB is free against roughly 10 GB/year of finished media, so the
 * decision survives its own broken arithmetic, but the headroom check below is not decorative.
 *
 * IT ARCHIVES `final/` ONLY, NOT `raw/`. The convention is `Content/YYYY-MM/<slug>/{raw,final,
 * thumb}/`, and this copies the finished cut. Raw footage is far larger and its second copy is a
 * separate decision about capacity nobody has taken; archiving it silently here would fill the
 * disk and turn a safety net into an outage.
 */
import { execFile } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import { loadEnvLocal, admin, logRun } from './_shared'
import { idFromUrl, realGws, type Gws } from './drive-folders'

const exec = promisify(execFile)
loadEnvLocal()

/** Pinned by IP deliberately: see the header. The hostname on this box is misleading. */
export const ARCHIVE_HOST = process.env.ARCHIVE_HOST ?? '37.27.250.169'
export const ARCHIVE_ROOT = process.env.ARCHIVE_ROOT ?? '/srv/andro-prime/archive'
/** Refuse to copy when the target is nearly full. A silent partial archive is worse than none. */
export const MIN_FREE_GB = 10

export interface ArchiveEntry {
  slug: string; name: string; sha256: string; bytes: number; remote: string; archived_at: string
}
export type Outcome =
  | { slug: string; name: string; action: 'copied' | 'present' | 'REPAIRED'; detail: string }
  | { slug: string; name: string; action: 'FAILED'; detail: string }

const ssh = async (cmd: string): Promise<string> => {
  const { stdout } = await exec('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15',
    `root@${ARCHIVE_HOST}`, cmd], { maxBuffer: 32 * 1024 * 1024, windowsHide: true })
  /* Trim every line: ssh through a Windows shell brings carriage returns back with it, and a
   * checksum compared with a trailing \r never matches anything. Learned the hard way in the
   * restore drill, where CR-contaminated role names produced a confident wrong verdict. */
  return stdout.replace(/\r/g, '').trim()
}

/** Shell-quote for the remote side. Slugs and filenames come from Drive and are not trusted. */
const q = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`

export const sha256 = (file: string) =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

/** Free space on the archive filesystem, in GB. */
export async function freeGb(): Promise<number> {
  const out = await ssh(`df -Pk ${q(ARCHIVE_ROOT)} | tail -1 | awk '{print $4}'`)
  return Math.floor(Number(out) / 1024 / 1024)
}

/** Remote checksum, or null when the file is not there. */
export async function remoteSha(remote: string): Promise<string | null> {
  const out = await ssh(`test -f ${q(remote)} && sha256sum ${q(remote)} | cut -d' ' -f1 || echo MISSING`)
  return out === 'MISSING' ? null : out
}

export async function main(gws: Gws = realGws): Promise<number> {
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const only = process.argv.includes('--asset') ? process.argv[process.argv.indexOf('--asset') + 1] : null
  const started = new Date().toISOString()

  const db = admin()
  const { data: assets, error } = await db
    .from('content_assets').select('id,slug,status,drive_url').not('drive_url', 'is', null)
  if (error) throw new Error(`content_assets: ${error.message}`)
  const subjects = (assets ?? []).filter((a) => a.drive_url?.trim() && (!only || a.slug === only))

  console.log(`archive-media${dryRun ? '  [DRY RUN: nothing is copied]' : ''}`)
  console.log(`target : root@${ARCHIVE_HOST}:${ARCHIVE_ROOT}  (Hetzner "nc-server-01"; it calls itself nc-server-03)`)
  console.log(`assets : ${subjects.length} with a Drive folder${only ? ` (filtered to ${only})` : ''}\n`)

  /* Assert the target is the machine we think it is BEFORE copying anything. The hostname lies
   * here, so identity is the IP plus a writable archive root plus the tool we depend on. */
  const probe = await ssh(`uname -m; test -d ${q(ARCHIVE_ROOT)} && echo ROOT_OK || echo ROOT_MISSING; command -v sha256sum >/dev/null && echo SHA_OK || echo SHA_MISSING`)
  const [arch, rootState, shaState] = probe.split('\n')
  if (rootState !== 'ROOT_OK') throw new Error(`${ARCHIVE_ROOT} does not exist on ${ARCHIVE_HOST}`)
  if (shaState !== 'SHA_OK') throw new Error(`sha256sum is not installed on ${ARCHIVE_HOST}; nothing can be verified`)
  const free = await freeGb()
  console.log(`host   : ${arch}, ${free} GB free`)
  if (free < MIN_FREE_GB) throw new Error(`only ${free} GB free on ${ARCHIVE_HOST}, below the ${MIN_FREE_GB} GB floor. Refusing: a partial archive that reports success is worse than no archive.`)

  const outcomes: Outcome[] = []
  const manifest: ArchiveEntry[] = []

  for (const a of subjects.sort((x, y) => x.slug.localeCompare(y.slug))) {
    const folderId = idFromUrl(a.drive_url)
    if (!folderId) { outcomes.push({ slug: a.slug, name: '-', action: 'FAILED', detail: `drive_url is not a folder URL` }); continue }

    // final/ only. See the header: raw/ is a separate capacity decision nobody has taken.
    const finals = await gws(['drive', 'files', 'list', '--params', JSON.stringify({
      q: `'${folderId}' in parents and name = 'final' and trashed = false`, fields: 'files(id,name)',
    }), '--format', 'json'])
    const finalFolder = ((finals.files as { id: string }[]) ?? [])[0]
    if (!finalFolder) { outcomes.push({ slug: a.slug, name: '-', action: 'FAILED', detail: 'no final/ subfolder' }); continue }

    const listed = await gws(['drive', 'files', 'list', '--params', JSON.stringify({
      q: `'${finalFolder.id}' in parents and trashed = false`, fields: 'files(id,name,size,mimeType)', pageSize: 200,
    }), '--format', 'json'])
    const files = ((listed.files as { id: string; name: string; size?: string }[]) ?? [])
      .filter((f) => f.name !== '.keep')
    if (!files.length) continue

    for (const f of files) {
      const remote = `${ARCHIVE_ROOT}/${a.slug}/${f.name}`
      if (dryRun) { outcomes.push({ slug: a.slug, name: f.name, action: 'copied', detail: `WOULD copy to ${remote}` }); continue }

      /* gws REFUSES an --output path outside its working directory ("resolves to ... which is
       * outside the current directory"). So it is run WITH the temp directory as its cwd and given
       * a bare filename, rather than an absolute path it will reject. */
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-archive-'))
      const tmp = path.join(tmpDir, f.name)
      try {
        await exec('gws', ['drive', 'files', 'get', '--params', JSON.stringify({ fileId: f.id, alt: 'media' }), '--output', f.name],
          { maxBuffer: 8 * 1024 * 1024, windowsHide: true, cwd: tmpDir })
        if (!fs.existsSync(tmp)) throw new Error(`gws reported success but wrote no file for ${f.name}`)
        const local = sha256(tmp)

        /* Idempotent AND self-healing: a file already there with the right checksum is skipped, and
         * one already there with the WRONG checksum is re-copied. Skipping on mere existence would
         * make a truncated earlier transfer permanent. */
        const existing = await remoteSha(remote)
        if (existing === local) { outcomes.push({ slug: a.slug, name: f.name, action: 'present', detail: `verified ${local.slice(0, 12)}` }) }
        else {
          await ssh(`mkdir -p ${q(path.posix.dirname(remote))}`)
          await exec('scp', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', tmp, `root@${ARCHIVE_HOST}:${remote}`], { windowsHide: true })
          const after = await remoteSha(remote)
          if (after !== local) throw new Error(`checksum mismatch after copy: local ${local.slice(0, 12)}, remote ${String(after).slice(0, 12)}`)
          outcomes.push({ slug: a.slug, name: f.name, action: existing ? 'REPAIRED' : 'copied', detail: `${(fs.statSync(tmp).size / 1048576).toFixed(1)} MB, sha ${local.slice(0, 12)}` })
        }
        manifest.push({ slug: a.slug, name: f.name, sha256: local, bytes: fs.statSync(tmp).size, remote, archived_at: new Date().toISOString() })
      } catch (e) {
        outcomes.push({ slug: a.slug, name: f.name, action: 'FAILED', detail: (e as Error).message })
      } finally {
        /* The temp copy is a second copy of unrecoverable media on a laptop. Remove the whole
         * directory, not just the file, and never leave it behind on a failure path. */
        try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch { /* nothing else to do */ }
      }
    }
  }

  const icon = { copied: '+', present: '·', REPAIRED: '~', FAILED: '✗' }
  for (const o of outcomes) console.log(`  ${icon[o.action]} ${o.slug}/${o.name.padEnd(28)} ${o.detail}`)
  const failed = outcomes.filter((o) => o.action === 'FAILED')
  const copied = outcomes.filter((o) => o.action === 'copied' || o.action === 'REPAIRED')

  console.log(outcomes.length
    ? `\n${copied.length} copied, ${outcomes.filter((o) => o.action === 'present').length} already present and re-verified, ${failed.length} failed.`
    : `\nNothing to archive: no asset has a file in its Drive final/ folder yet. No asset has ever reached "recorded".`)

  if (doLog) {
    await logRun({
      agent: 'archive-media',
      status: failed.length ? 'error' : 'ok',
      error: failed.length ? failed.map((f) => `${f.slug}/${f.name}: ${f.detail}`).join(' | ') : null,
      detail: { dry_run: dryRun, considered: subjects.length, copied: copied.length, failed: failed.length, free_gb: free },
      startedAt: started,
    })
  }
  return failed.length ? 1 : 0
}

/** Exact basename equality, so importing this from a test does not fire a live run. */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'archive-media.ts' || base === 'archive-media.js'
}

if (isDirectInvocation(process.argv[1])) {
  main()
    .then((code) => { process.exitCode = code })
    .catch((e) => { console.error(`\n${(e as Error).message}`); process.exitCode = 1 })
}
