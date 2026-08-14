/**
 * Guards register-carousel-run: the matcher, the plan, and the write contract.
 *
 * WHY THIS EXISTS. This job attaches a Metricool post id to a rendition, and the id is what
 * every later job trusts. `metricool-writeback` will write "published, at this URL" onto
 * whatever rendition holds that id, and `content-doctor` I3 will resolve it. So the failure
 * this suite exists to prevent is not "no rows"; it is THE WRONG ROW: day 7's rendition holding
 * day 17's post id looks perfectly healthy from every direction and reports another post's
 * publication as its own.
 *
 * The matcher is therefore tested on what it REFUSES, not on what it accepts: a slot with no
 * post, a slot with two, the right slot carrying the wrong caption, a carousel that lost a
 * slide. Each of those is a real shape (the two Aug-10 test drafts sat on 2026-09-15 alongside
 * day 30 until they were deleted, which is exactly the "two posts share a slot" case).
 *
 * No network, no database, no credentials. Every entry point takes its inputs as arguments.
 *
 * Run: npx tsx scripts/content-engine/test-register-carousel-run.ts
 */
import {
  matchPost, buildPlan, assetSlugFor, apply, render, exitCodeFor, isDirectInvocation,
  assetRowFor, assetMatches, SLOT_LOCAL, APPROVAL,
  type RunPost, type MetricoolListed, type Plan, type Store, type AssetPlan, type RenditionPlan, type RunResult,
} from './register-carousel-run'

let failures = 0
const pending: Array<Promise<void>> = []

function check(name: string, fn: () => void | Promise<void>) {
  const done = (err?: unknown) => {
    if (err) { failures += 1; console.log(`  ✗ ${name}`); console.log(`      ${(err as Error).message}`) }
    else console.log(`  ✓ ${name}`)
  }
  try {
    const r = fn()
    if (r instanceof Promise) { pending.push(r.then(() => done()).catch(done)); return }
    done()
  } catch (e) { done(e) }
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

// ── Fixtures

const runDay = (over: Partial<RunPost> = {}): RunPost => ({
  day: 1,
  slug: '14-signs-of-vitamin-d-deficiency',
  close: 'A',
  format: 'video',
  date: '2026-08-17',
  headline: '14 SIGNS OF LOW VITAMIN D',
  live: true,
  payload: { text: 'The 14th sign is that there are no signs at all.', firstCommentText: '#menshealth', media: Array(8).fill('u') },
  ...over,
})

const listed = (over: Partial<MetricoolListed> = {}): MetricoolListed => ({
  id: '361489869',
  wallClock: `2026-08-17T${SLOT_LOCAL}`,
  draft: false,
  text: 'The 14th sign is that there are no signs at all.',
  firstCommentText: '#menshealth',
  mediaCount: 8,
  networks: ['instagram'],
  ...over,
})

const articles = (status = 'published') =>
  new Map([['14-signs-of-vitamin-d-deficiency', { id: 'art-1', status }]])

// ── The matcher

check('matches the post occupying the day\'s slot', () => {
  const m = matchPost(runDay(), [listed(), listed({ id: 'other', wallClock: `2026-08-18T${SLOT_LOCAL}` })])
  assert(m.ok, 'should have matched')
  assert(m.ok && m.post.id === '361489869', 'should pick the post at this day\'s slot')
})

check('REFUSES a slot with no post rather than falling back to position', () => {
  const m = matchPost(runDay(), [listed({ wallClock: `2026-08-18T${SLOT_LOCAL}` })])
  assert(!m.ok, 'must refuse')
  assert(!m.ok && /no Metricool post at 2026-08-17/.test(m.why), 'the reason must name the slot')
  assert(!m.ok && /publish, if it publishes at all, with nothing recording it/.test(m.why), 'must say what the refusal costs')
})

check('REFUSES a slot shared by two posts, which is the Aug-10 test-draft shape', () => {
  const m = matchPost(runDay(), [listed(), listed({ id: '360411107' })])
  assert(!m.ok, 'must refuse')
  assert(!m.ok && /2 Metricool posts share the slot/.test(m.why), 'must say why it cannot decide')
  assert(!m.ok && /360411107/.test(m.why), 'must name the candidate ids so a human can look')
})

check('REFUSES the right slot carrying the wrong caption — the wrong-id guard', () => {
  const m = matchPost(runDay(), [listed({ text: 'Ferritin is the tank, not the fuel.' })])
  assert(!m.ok, 'must refuse')
  assert(!m.ok && /does not carry the approved caption/.test(m.why), 'the caption is what proves identity')
})

check('REFUSES a caption match with a different first comment', () => {
  const m = matchPost(runDay(), [listed({ firstCommentText: '#somethingelse' })])
  assert(!m.ok && /different first comment/.test(m.why), 'the CA-035 artefact covers both')
})

check('REFUSES a carousel that quietly lost a slide', () => {
  const m = matchPost(runDay(), [listed({ mediaCount: 7 })])
  assert(!m.ok && /7 media, and the run says 8/.test(m.why), 'a short carousel still posts, so it has to be caught here')
})

check('REFUSES a post with no instagram provider', () => {
  const m = matchPost(runDay(), [listed({ networks: ['facebook'] })])
  assert(!m.ok && /no instagram provider/.test(m.why), 'must name what it found instead')
})

check('whitespace at the edges of a caption is not a mismatch', () => {
  const m = matchPost(runDay(), [listed({ text: '  The 14th sign is that there are no signs at all.\n' })])
  assert(m.ok, 'trailing newlines are a transport artefact, not an edit')
})

// ── The plan

const threeDays: RunPost[] = [
  runDay({ day: 1, close: 'A', date: '2026-08-17' }),
  runDay({ day: 11, close: 'B', date: '2026-08-27' }),
  runDay({ day: 21, close: 'C', date: '2026-09-06' }),
]
const threePosts: MetricoolListed[] = [
  listed({ id: 'p1', wallClock: `2026-08-17T${SLOT_LOCAL}` }),
  listed({ id: 'p11', wallClock: `2026-08-27T${SLOT_LOCAL}` }),
  listed({ id: 'p21', wallClock: `2026-09-06T${SLOT_LOCAL}` }),
]

check('three appearances of one topic become ONE asset and THREE variants', () => {
  const plan = buildPlan({ run: threeDays, posts: threePosts, articles: articles() })
  assert(plan.assets.length === 1, `expected 1 asset, got ${plan.assets.length}`)
  assert(plan.renditions.length === 3, `expected 3 renditions, got ${plan.renditions.length}`)
  assert(plan.renditions.map((r) => r.variant).join('') === 'ABC', 'variants should be A, B and C')
  assert(plan.assets[0].slug === assetSlugFor('14-signs-of-vitamin-d-deficiency'), 'asset slug convention')
  assert(plan.assets[0].days.join(',') === '1,11,21', 'the asset should name all three run days')
})

check('the asset carries NO cta, and says why in its notes', () => {
  const plan = buildPlan({ run: threeDays, posts: threePosts, articles: articles() })
  assert(/carries NO single cta/.test(plan.assets[0].notes), 'the reason has to survive in the row, not just here')
  assert(/CA-031/.test(plan.assets[0].notes) && /CA-035/.test(plan.assets[0].notes), 'the approval trail must be joinable from the row')
})

check('the 13:00 London slot resolves to 12:00Z through the whole run (BST)', () => {
  const plan = buildPlan({ run: threeDays, posts: threePosts, articles: articles() })
  for (const r of plan.renditions) {
    assert(r.scheduledFor.endsWith('T12:00:00.000Z'), `expected 12:00Z, got ${r.scheduledFor}`)
  }
})

check('an UNPUBLISHED canonical article refuses all three days rather than registering', () => {
  const plan = buildPlan({ run: threeDays, posts: threePosts, articles: articles('draft') })
  assert(plan.assets.length === 0 && plan.renditions.length === 0, 'nothing should be planned')
  assert(plan.refusals.length === 3, `expected 3 refusals, got ${plan.refusals.length}`)
  assert(/may not outrun its source/.test(plan.refusals[0].why), 'must give the gate\'s own reason')
})

check('a MISSING canonical article refuses rather than registering a null inheritance', () => {
  const plan = buildPlan({ run: threeDays, posts: threePosts, articles: new Map() })
  assert(plan.refusals.length === 3 && /nothing to inherit from/.test(plan.refusals[0].why), 'claims inheritance needs a source')
})

check('one bad day refuses alone; the other two still register', () => {
  const plan = buildPlan({
    run: threeDays,
    posts: [threePosts[0], listed({ id: 'p11', wallClock: `2026-08-27T${SLOT_LOCAL}`, text: 'edited in Metricool' }), threePosts[2]],
    articles: articles(),
  })
  assert(plan.refusals.length === 1 && plan.refusals[0].day === 11, 'only day 11 should refuse')
  assert(plan.renditions.length === 2, 'the other two days are still registered')
  assert(plan.assets[0].days.join(',') === '1,21', 'the asset must not claim a day it did not register')
})

// ── Applying the plan

function fakeStore(over: Partial<Store> = {}): { store: Store; writes: string[] } {
  const writes: string[] = []
  const store: Store = {
    articles: async () => articles(),
    assets: async () => new Map(),
    renditions: async () => new Map(),
    upsertAsset: async (a: AssetPlan) => { writes.push(`asset:${a.slug}`); return { id: `id-${a.slug}`, created: true, changed: true } },
    createRendition: async (assetId: string, r: RenditionPlan) => { writes.push(`rend:${assetId}:${r.variant}:${r.externalPostId}`) },
    updateRendition: async (id: string, patch: Record<string, unknown>) => { writes.push(`update:${id}:${Object.keys(patch).join(',')}`) },
    ...over,
  }
  return { store, writes }
}

const plan3 = (): Plan => buildPlan({ run: threeDays, posts: threePosts, articles: articles() })

check('a dry run writes nothing at all', async () => {
  const { store, writes } = fakeStore()
  const res = await apply(plan3(), store, true)
  assert(writes.length === 0, `a dry run wrote ${writes.length} time(s)`)
  assert(res.assetsCreated.length === 1 && res.renditionsCreated.length === 3, 'but it still reports what it would do')
})

check('a live run creates one asset and three renditions, each with its own post id', async () => {
  const { store, writes } = fakeStore()
  const res = await apply(plan3(), store, false)
  assert(res.assetsCreated.length === 1, 'one asset')
  assert(res.renditionsCreated.length === 3, 'three renditions')
  assert(writes.includes('rend:id-carousel-14-signs-of-vitamin-d-deficiency:A:p1'), 'variant A must carry day 1\'s post id')
  assert(writes.includes('rend:id-carousel-14-signs-of-vitamin-d-deficiency:C:p21'), 'variant C must carry day 21\'s post id')
})

/** The live asset row as this job would have written it, for the already-registered cases. */
const registeredAsset = (assetId: string) => {
  const plan = plan3()
  return new Map([[plan.assets[0].slug, { id: assetId, status: 'approved', row: assetRowFor(plan.assets[0]) }]])
}

check('re-running over a registered run changes nothing, INCLUDING the asset row', async () => {
  const assetId = 'id-carousel-14-signs-of-vitamin-d-deficiency'
  const { store, writes } = fakeStore({
    assets: async () => registeredAsset(assetId),
    renditions: async () => new Map([
      [`${assetId}|instagram|carousel|A`, { id: 'r1', external_post_id: 'p1', scheduled_for: '2026-08-17T12:00:00+00:00', status: 'scheduled', body: threeDays[0].payload.text }],
      [`${assetId}|instagram|carousel|B`, { id: 'r2', external_post_id: 'p11', scheduled_for: '2026-08-27T12:00:00+00:00', status: 'scheduled', body: threeDays[1].payload.text }],
      [`${assetId}|instagram|carousel|C`, { id: 'r3', external_post_id: 'p21', scheduled_for: '2026-09-06T12:00:00+00:00', status: 'scheduled', body: threeDays[2].payload.text }],
    ]),
  })
  const res = await apply(plan3(), store, false)
  assert(res.renditionsUnchanged === 3, `expected 3 unchanged, got ${res.renditionsUnchanged}`)
  assert(res.assetsUnchanged.length === 1 && !res.assetsUpdated.length, 'an agreeing asset row must report unchanged, not updated')
  assert(writes.length === 0, `a run over an agreeing store wrote ${writes.length} time(s): ${writes.join(', ')}`)
})

check('an asset row a HUMAN has changed is rewritten, and only then', () => {
  const plan = plan3()
  const want = assetRowFor(plan.assets[0])
  assert(assetMatches(want, { ...want }), 'an identical row matches')
  assert(assetMatches(want, { ...want, drive_url: 'https://drive/…' }), 'a column this job does not own must not force a write')
  assert(!assetMatches(want, { ...want, preflight: 'not-run' }), 'a column it does own must')
})

check('a post id that has CHANGED in Metricool is updated and named, not silently overwritten', async () => {
  const assetId = 'id-carousel-14-signs-of-vitamin-d-deficiency'
  const { store } = fakeStore({
    assets: async () => registeredAsset(assetId),
    renditions: async () => new Map([
      [`${assetId}|instagram|carousel|A`, { id: 'r1', external_post_id: 'OLD', scheduled_for: '2026-08-17T12:00:00+00:00', status: 'scheduled', body: threeDays[0].payload.text }],
    ]),
  })
  const res = await apply(plan3(), store, false)
  const updated = res.renditionsUpdated.find((u) => u.variant === 'A')
  assert(!!updated, 'variant A should be reported as updated')
  assert(/external_post_id OLD -> p1/.test(updated!.what), 'the report must say what changed')
})

check('a write failure is a FAILURE with the reason, never a silent skip', async () => {
  const { store } = fakeStore({
    createRendition: async () => { throw new Error('gate: needs a thumbnail') },
  })
  const res = await apply(plan3(), store, false)
  assert(res.failed.length === 3, `expected 3 failures, got ${res.failed.length}`)
  assert(/gate: needs a thumbnail/.test(res.failed[0].why), 'the database\'s own message must survive')
  assert(exitCodeFor(res) === 2, 'a failure exits 2')
})

// ── Reporting

const empty: RunResult = {
  assetsCreated: [], assetsUpdated: [], assetsUnchanged: [],
  renditionsCreated: [], renditionsUpdated: [], renditionsUnchanged: 0,
  refusals: [], failed: [],
}

check('exit codes: clean 0, refusal 3, failure 2, and a failure outranks a refusal', () => {
  assert(exitCodeFor(empty) === 0, 'clean is 0')
  assert(exitCodeFor({ ...empty, refusals: [{ day: 1, slug: 's', why: 'w' }] }) === 3, 'a refusal is 3')
  assert(exitCodeFor({ ...empty, failed: [{ ref: 'r', why: 'w' }] }) === 2, 'a failure is 2')
  assert(exitCodeFor({ ...empty, refusals: [{ day: 1, slug: 's', why: 'w' }], failed: [{ ref: 'r', why: 'w' }] }) === 2, 'failure wins')
})

check('an already-registered run says so rather than printing nothing', () => {
  assert(/already registered/.test(render(empty, { dryRun: false })), 'silence reads as a broken run')
})

check('a dry run is labelled as one in the output', () => {
  assert(/DRY RUN/.test(render(empty, { dryRun: true })), 'must be obvious from the output')
})

check('a refusal is rendered as a day that will publish unrecorded', () => {
  const out = render({ ...empty, refusals: [{ day: 7, slug: 'free-androgen-index', why: 'no post at the slot' }] }, { dryRun: false })
  assert(/PUBLISH UNRECORDED/.test(out), 'the cost of a refusal has to be in the output')
  assert(/day 7 free-androgen-index/.test(out), 'and the day it applies to')
})

check('the approval constants are the CA-034 / CA-035 date, not today', () => {
  assert(APPROVAL.preflightDate === '2026-08-12', 'CA-034 pre-flight date')
  assert(APPROVAL.approvedAt === '2026-08-12', 'both approvals landed 2026-08-12')
  assert(APPROVAL.series === 'carousel-30-2026-08', 'the series is how the run is queried as one thing')
})

check('direct-invocation guard matches the exact basename only', () => {
  assert(isDirectInvocation('/x/register-carousel-run.ts'), 'should match itself')
  assert(!isDirectInvocation('/x/test-register-carousel-run.ts'), 'MUST NOT match its own test file')
  assert(!isDirectInvocation(undefined), 'undefined should not match')
})

void Promise.all(pending).then(() => {
  console.log('')
  if (failures) { console.log(`${failures} failing check(s).`); process.exit(1) }
  console.log('All checks passed.')
})
