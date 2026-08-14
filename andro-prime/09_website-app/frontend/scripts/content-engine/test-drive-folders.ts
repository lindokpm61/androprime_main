/**
 * Tests for drive-folders.ts.
 *
 * WHY THESE EXIST IN THIS SHAPE. A live run of this job today does nothing: all seven assets that
 * have earned a folder already have one, so the only path a real invocation exercises is "verify,
 * everything is fine". The CREATE path — the entire point of the job, and the one that runs for
 * the first time the day after a filming day — would otherwise ship never having executed. So the
 * gws call is injected and every branch is driven from a fake Drive.
 *
 * The fake is a real little Drive: it holds folders, honours parents, permits duplicate names
 * (because Drive does), and can be told to trash or rename something. Assertions are about
 * behaviour, not about which arguments were passed.
 */
import {
  childrenNamed, findOrCreateFolder, ensureTree, verifyExisting, verifyRoot,
  mintMonth, idFromUrl, folderUrl, DRIVE_CONTENT_ROOT, SUBFOLDERS, SHOT_FORMATS, FOLDER_OWED_FROM,
  type Gws, type AssetNeedingFolder,
} from './drive-folders'

let failures = 0
function check(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`) }
  catch (err) { failures++; console.error(`  ✗ ${name}\n      ${(err as Error).message}`) }
}
function checkAsync(name: string, fn: () => Promise<void>) {
  pending.push(fn().then(
    () => { console.log(`  ✓ ${name}`) },
    (err: Error) => { failures++; console.error(`  ✗ ${name}\n      ${err.message}`) },
  ))
}
const pending: Array<Promise<void>> = []
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}
async function rejects(fn: () => Promise<unknown>, re: RegExp, msg: string) {
  try { await fn() } catch (e) { assert(re.test((e as Error).message), `${msg}: got "${(e as Error).message}"`); return }
  throw new Error(`${msg}: it resolved instead of throwing`)
}

const FOLDER = 'application/vnd.google-apps.folder'

/** A minimal in-memory Drive. `creates` records what the job actually asked to make. */
function fakeDrive(seed: Array<{ id: string; name: string; parent: string | null; mimeType?: string; trashed?: boolean }> = []) {
  const files = [...seed]
  let n = 0
  const creates: Array<{ name: string; parent: string }> = []
  const gws: Gws = async (args) => {
    const kind = `${args[1]}.${args[2]}`
    const params = JSON.parse(args[args.indexOf('--params') + 1] ?? '{}')
    if (kind === 'files.list') {
      const m = /^'([^']+)' in parents and name = '(.*)' and trashed = false$/.exec(params.q as string)
      assert(m, `fake got a query it does not understand: ${params.q}`)
      return { files: files.filter((f) => f.parent === m[1] && f.name === m[2].replace(/\\'/g, "'") && !f.trashed) }
    }
    if (kind === 'files.get') {
      const f = files.find((x) => x.id === params.fileId)
      if (!f) throw new Error(`File not found: ${params.fileId}`)
      return { id: f.id, name: f.name, mimeType: f.mimeType ?? FOLDER, trashed: Boolean(f.trashed) }
    }
    if (kind === 'files.create') {
      const body = JSON.parse(args[args.indexOf('--json') + 1])
      const id = `new${++n}`
      files.push({ id, name: body.name, parent: body.parents[0], mimeType: body.mimeType })
      creates.push({ name: body.name, parent: body.parents[0] })
      return { id, name: body.name }
    }
    throw new Error(`fake got an unexpected call: ${kind}`)
  }
  return { gws, files, creates }
}

const root = { id: DRIVE_CONTENT_ROOT, name: 'Content', parent: null, mimeType: FOLDER }
const asset = (o: Partial<AssetNeedingFolder> = {}): AssetNeedingFolder =>
  ({ id: 'a1', slug: 'the-stack', status: 'scripted', created_at: '2026-07-28T10:00:00Z', drive_url: null, ...o })

console.log('\ndrive-folders')

// ── the convention itself ────────────────────────────────────────────────────

check('the month folder is the MINT month, so a folder does not move when filming slips', () => {
  assert(mintMonth('2026-07-28T10:00:00Z') === '2026-07', 'mint month must come off the created date')
  assert(mintMonth('2026-12-01T00:00:00Z') === '2026-12', 'and must not roll over')
})

check('three subfolders, not two: thumb/ exists because sop-thumbnail.md writes into it', () => {
  assert(SUBFOLDERS.length === 3 && SUBFOLDERS.includes('thumb'), `got ${SUBFOLDERS.join(',')}`)
})

check('SHOT_FORMATS excludes carousel and image-post, which are rendered rather than filmed', () => {
  assert(!SHOT_FORMATS.includes('carousel'), 'a carousel is reproducible from a data file; it has no raw footage')
  assert(!SHOT_FORMATS.includes('image-post'), 'same for an image post')
  assert(SHOT_FORMATS.includes('reel') && SHOT_FORMATS.includes('long-form'), 'the shot formats must be there')
})

check('a folder is not owed before scripted, because there is nothing to film yet', () => {
  assert(!FOLDER_OWED_FROM.includes('idea') && !FOLDER_OWED_FROM.includes('drafted'), 'too early')
  assert(FOLDER_OWED_FROM.includes('scripted'), 'scripted is where it starts')
})

check('idFromUrl reads the id out of a Drive folder URL and rejects anything else', () => {
  assert(idFromUrl('https://drive.google.com/drive/folders/1abcXYZ_-9') === '1abcXYZ_-9', 'must parse')
  assert(idFromUrl('https://example.com/nope') === null, 'a non-Drive URL is not an id')
  assert(idFromUrl(null) === null, 'null is not an id')
  assert(idFromUrl(folderUrl('zzz')) === 'zzz', 'and it must round-trip with folderUrl')
})

// ── the create path, which a live run never reaches ──────────────────────────

checkAsync('CREATE: builds month, slug and all three subfolders under the root', async () => {
  const d = fakeDrive([root])
  const tree = await ensureTree(d.gws, 'ep-0-baseline', '2026-07', false)
  assert(tree.id, 'must return the slug folder id')
  const names = d.creates.map((c) => c.name)
  assert(names.join(',') === `2026-07,ep-0-baseline,${SUBFOLDERS.join(',')}`,
    `wrong creation order or set: ${names.join(',')}`)
  const month = d.files.find((f) => f.name === '2026-07')!
  assert(month.parent === DRIVE_CONTENT_ROOT, 'the month hangs off Content')
  const slug = d.files.find((f) => f.name === 'ep-0-baseline')!
  assert(slug.parent === month.id, 'the slug hangs off the month, not off Content')
  for (const sub of SUBFOLDERS) {
    assert(d.files.find((f) => f.name === sub)!.parent === slug.id, `${sub} must hang off the slug folder`)
  }
})

checkAsync('CREATE: reuses an existing month folder instead of making a second one', async () => {
  const d = fakeDrive([root, { id: 'm1', name: '2026-07', parent: DRIVE_CONTENT_ROOT, mimeType: FOLDER }])
  await ensureTree(d.gws, 'the-stack', '2026-07', false)
  assert(!d.creates.some((c) => c.name === '2026-07'), 'the month already existed; it must not be recreated')
  assert(d.files.find((f) => f.name === 'the-stack')!.parent === 'm1', 'the slug must go in the existing month')
})

checkAsync('CREATE is IDEMPOTENT: a second run creates nothing', async () => {
  const d = fakeDrive([root])
  await ensureTree(d.gws, 'the-stack', '2026-07', false)
  const first = d.creates.length
  await ensureTree(d.gws, 'the-stack', '2026-07', false)
  assert(d.creates.length === first, `second run created ${d.creates.length - first} extra folder(s)`)
})

checkAsync('DRY RUN creates nothing at all, and still reports that it would', async () => {
  const d = fakeDrive([root])
  const tree = await ensureTree(d.gws, 'the-stack', '2026-07', true)
  assert(d.creates.length === 0, `dry run created ${d.creates.length} folder(s)`)
  assert(tree.id === null && tree.createdAny, 'a dry run has no id to return but must say work is owed')
})

checkAsync('DUPLICATES are refused rather than guessed between', async () => {
  const d = fakeDrive([root,
    { id: 'm1', name: '2026-07', parent: DRIVE_CONTENT_ROOT, mimeType: FOLDER },
    { id: 'm2', name: '2026-07', parent: DRIVE_CONTENT_ROOT, mimeType: FOLDER },
  ])
  await rejects(() => ensureTree(d.gws, 'the-stack', '2026-07', false), /refusing to guess/,
    'two folders of one name must stop the job, not split an asset across both')
})

checkAsync('a file that merely SHARES the name is not mistaken for the folder', async () => {
  const d = fakeDrive([root,
    { id: 'f1', name: '2026-07', parent: DRIVE_CONTENT_ROOT, mimeType: 'text/plain' },
  ])
  await ensureTree(d.gws, 'the-stack', '2026-07', false)
  assert(d.creates.some((c) => c.name === '2026-07'), 'a text file named 2026-07 is not the month folder')
})

checkAsync('a create that returns no id fails loudly instead of writing a broken URL', async () => {
  const gws: Gws = async (args) => (args[2] === 'create' ? {} : { files: [] })
  await rejects(() => findOrCreateFolder(gws, 'p', 'x', false), /did not return an id/,
    'no id must throw, or drive_url gets written as .../folders/undefined')
})

// ── verifying what already exists, which is the half a create-only job misses ──

checkAsync('VERIFY passes a folder that is present with all three subfolders', async () => {
  const d = fakeDrive([root,
    { id: 's1', name: 'the-stack', parent: 'm1', mimeType: FOLDER },
    ...SUBFOLDERS.map((s, i) => ({ id: `sub${i}`, name: s, parent: 's1', mimeType: FOLDER })),
  ])
  const o = await verifyExisting(d.gws, asset({ drive_url: folderUrl('s1') }), false)
  assert(o.action === 'verified', `expected verified, got ${o.action}: ${o.detail}`)
})

checkAsync('VERIFY REPAIRS a missing subfolder rather than only reporting it', async () => {
  const d = fakeDrive([root,
    { id: 's1', name: 'the-stack', parent: 'm1', mimeType: FOLDER },
    { id: 'sub0', name: 'raw', parent: 's1', mimeType: FOLDER },
  ])
  const o = await verifyExisting(d.gws, asset({ drive_url: folderUrl('s1') }), false)
  assert(o.action === 'repaired' && /final/.test(o.detail) && /thumb/.test(o.detail), `got ${o.action}: ${o.detail}`)
  assert(d.creates.map((c) => c.name).sort().join(',') === 'final,thumb', `created: ${d.creates.map((c) => c.name)}`)
})

checkAsync('VERIFY in dry-run repairs nothing but says what it would', async () => {
  const d = fakeDrive([root, { id: 's1', name: 'the-stack', parent: 'm1', mimeType: FOLDER }])
  const o = await verifyExisting(d.gws, asset({ drive_url: folderUrl('s1') }), true)
  assert(o.action === 'repaired' && /WOULD/.test(o.detail), `got ${o.detail}`)
  assert(d.creates.length === 0, 'a dry run must not create the missing subfolders')
})

checkAsync('VERIFY FAILS a TRASHED folder, because footage saved there is deleted in 30 days', async () => {
  const d = fakeDrive([root, { id: 's1', name: 'the-stack', parent: 'm1', mimeType: FOLDER, trashed: true }])
  const o = await verifyExisting(d.gws, asset({ drive_url: folderUrl('s1') }), false)
  assert(o.action === 'FAILED' && /TRASH/.test(o.detail), `a trashed folder must fail: ${o.action} ${o.detail}`)
})

checkAsync('VERIFY FAILS a RENAMED folder, which is how drive_url comes to point at another asset', async () => {
  const d = fakeDrive([root, { id: 's1', name: 'something-else', parent: 'm1', mimeType: FOLDER }])
  const o = await verifyExisting(d.gws, asset({ drive_url: folderUrl('s1') }), false)
  assert(o.action === 'FAILED' && /renamed|not "the-stack"/.test(o.detail), `got ${o.detail}`)
})

checkAsync('VERIFY FAILS when the folder is gone entirely, rather than throwing', async () => {
  const d = fakeDrive([root])
  const o = await verifyExisting(d.gws, asset({ drive_url: folderUrl('missing') }), false)
  assert(o.action === 'FAILED' && /will not return/.test(o.detail), `got ${o.action}: ${o.detail}`)
})

checkAsync('VERIFY FAILS a drive_url that is not a Drive folder URL at all', async () => {
  const d = fakeDrive([root])
  const o = await verifyExisting(d.gws, asset({ drive_url: 'https://example.com/somewhere' }), false)
  assert(o.action === 'FAILED' && /not a Drive folder URL/.test(o.detail), `got ${o.detail}`)
})

// ── the root guard: the difference between doing nothing and building in the wrong place ──

checkAsync('the root is VERIFIED to be a folder actually named Content', async () => {
  const ok = fakeDrive([root])
  await verifyRoot(ok.gws)

  const renamed = fakeDrive([{ ...root, name: 'Content (old)' }])
  await rejects(() => verifyRoot(renamed.gws), /named "Content \(old\)", not "Content"/,
    'a root that is not Content must stop the job')

  const notAFolder = fakeDrive([{ ...root, mimeType: 'application/pdf' }])
  await rejects(() => verifyRoot(notAFolder.gws), /is not a folder/, 'a non-folder root must stop the job')

  const trashed = fakeDrive([{ ...root, trashed: true }])
  await rejects(() => verifyRoot(trashed.gws), /in the trash/, 'a trashed root must stop the job')
})

checkAsync('childrenNamed escapes a quote in the name instead of breaking the query', async () => {
  const d = fakeDrive([root, { id: 'x', name: "keith's cut", parent: 'p', mimeType: FOLDER }])
  const hits = await childrenNamed(d.gws, 'p', "keith's cut")
  assert(hits.length === 1 && hits[0].id === 'x', `an apostrophe must not break the Drive query: got ${JSON.stringify(hits)}`)
})

Promise.all(pending).then(() => {
  console.log(failures ? `\n🔴 drive-folders: ${failures} failure(s).\n` : '\n🟢 drive-folders: all clean.\n')
  process.exitCode = failures ? 1 : 0
})
