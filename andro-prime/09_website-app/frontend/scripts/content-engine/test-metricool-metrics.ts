/**
 * Guards metricool-metrics: the join, the field mapping, and the seven-day coverage report.
 *
 * WHY THIS EXISTS. This job writes the only OUTCOME numbers the content machine has, and its
 * failure directions are asymmetric in a way that is easy to miss. Recording a metric against
 * the wrong rendition would attribute one post's performance to another and silently decide the
 * close test. Recording NULL where the platform reported nothing is correct; recording ZERO
 * there is a lie, because zero is a measurement and null is the absence of one.
 *
 * The case this suite is most careful about is the one that cannot be tested against live data
 * yet: the Instagram row shape is unknown until 2026-08-17, because nothing has ever published
 * on either brand's Instagram, so the endpoint answers 200 with an empty array. The mapping is
 * therefore CANDIDATES, and the `unmappedNumericKeys` report is what turns them into knowledge.
 * That mechanism is tested here, since it is the thing standing between an unverified mapping
 * and a month of silent nulls that read exactly like posts nobody engaged with.
 *
 * No network, no database, no credentials.
 *
 * Run: npx tsx scripts/content-engine/test-metricool-metrics.ts
 */
import {
  postIdFromUrl, postIdFromRow, mapRow, unmappedNumericKeys, ageCoverage, runMetrics,
  render, exitCodeFor, isDirectInvocation, FIXED_AGE_DAYS,
  type MeasurableRendition, type AnalyticsRow, type AnalyticsReader, type Capture, type RunResult,
} from './metricool-metrics'

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

const rend = (over: Partial<MeasurableRendition> = {}): MeasurableRendition => ({
  id: 'r-1',
  asset_slug: 'carousel-brain-fog',
  platform: 'instagram',
  format: 'carousel',
  variant: 'A',
  published_at: '2026-08-17T12:00:00+00:00',
  external_url: 'https://instagram.com/p/ABC123',
  external_post_id: '361490808',
  ...over,
})

// ── The join

check('the platform post id is read out of each network\'s real URL shape', () => {
  // All four read off live rows on 2026-08-14.
  assert(postIdFromUrl('x', 'https://twitter.com/a/status/2086056192313364928') === '2086056192313364928', 'x')
  assert(postIdFromUrl('linkedin', 'https://linkedin.com/feed/update/urn:li:share:7492520684275970048') === 'urn:li:share:7492520684275970048', 'linkedin')
  assert(postIdFromUrl('facebook', 'https://facebook.com/122099743521419372/posts/122144108337201122') === '122144108337201122', 'facebook')
  assert(postIdFromUrl('instagram', 'https://instagram.com/p/DAbCdEf/') === 'DAbCdEf', 'instagram')
})

check('a rendition with no URL yields no id rather than a guess', () => {
  assert(postIdFromUrl('x', null) === null, 'null url')
  assert(postIdFromUrl('x', '   ') === null, 'blank url')
  assert(postIdFromUrl('x', 'https://twitter.com/keith') === null, 'a profile link is not a post id')
})

check('the analytics row\'s own id field differs per network, and Facebook\'s is compound', () => {
  assert(postIdFromRow('x', { tweetId: '2086056192313364928' }) === '2086056192313364928', 'x uses tweetId')
  assert(postIdFromRow('linkedin', { postId: 'urn:li:share:7492520684275970048' }) === 'urn:li:share:7492520684275970048', 'linkedin uses the urn')
  // Facebook reports `<pageId>_<postId>`; only the tail appears in the URL.
  assert(postIdFromRow('facebook', { postId: '1292054467322962_122101997301419372' }) === '122101997301419372', 'facebook must split on the underscore')
  assert(postIdFromRow('x', { impressions: 3 }) === null, 'a row with no id field yields null, never a fabricated one')
})

check('Instagram compounds its id the OPPOSITE way round to Facebook, so the tail is the account', () => {
  // Measured 2026-08-25 against seven live rows on brand 6693691. Instagram reports
  // `<mediaId>_<userId>`; Facebook reports `<pageId>_<postId>`. Splitting Instagram on the
  // underscore and taking the tail returns 31817303084 for EVERY post on the account, which is
  // why seven carousels reported "has analytics but no rendition claims it" with one id.
  const row = {
    postId: '3970772165834610472_31817303084',
    url: 'https://www.instagram.com/p/DcbBD8slJco/',
  }
  assert(postIdFromRow('instagram', row) === 'DcbBD8slJco',
    'instagram must join on the permalink shortcode, not on either half of postId')

  // Two different posts must not collide. This is the whole defect in one assertion.
  const other = {
    postId: '3970047265683140972_31817303084',
    url: 'https://www.instagram.com/p/DcYcPQ0jfFs/',
  }
  assert(postIdFromRow('instagram', row) !== postIdFromRow('instagram', other),
    'two instagram posts on one account must not resolve to the same id')

  // Both sides of the join must agree, which is the property that actually matters.
  assert(postIdFromRow('instagram', row) === postIdFromUrl('instagram', row.url),
    'the analytics side and the external_url side must land in the same namespace')

  // No permalink: fall back to the LEADING half (the media id), never the trailing account id.
  assert(postIdFromRow('instagram', { postId: '3970772165834610472_31817303084' }) === '3970772165834610472',
    'without a url, instagram falls back to the media id, not the account id')
  assert(postIdFromRow('instagram', { likes: 4 }) === null, 'no id field yields null')
})

check('identity keys on a live Instagram row are not reported as unread metrics', () => {
  // From the first live rows, 2026-08-25. `businessId` is an all-digit account identifier and
  // `filter` arrives as '', which Number('') reads as a finite 0. Both looked like measurements.
  const row = {
    postId: '3970772165834610472_31817303084',
    userId: 'Keith Antony',
    businessId: '18129915748679545',
    filter: '',
    url: 'https://www.instagram.com/p/DcbBD8slJco/',
    views: 4, reach: 4, likes: 0, comments: 1, shares: 0, saved: 0,
    follows: 0, interactions: 1, impressionsTotal: 4,
  }
  const unread = unmappedNumericKeys('instagram', row)
  assert(!unread.includes('businessId'), 'businessId is an identifier, not a metric')
  assert(!unread.includes('filter'), 'an empty filter string is not a zero measurement')
  // The genuinely unread ones must still be reported, or the guard has been over-tightened.
  assert(unread.includes('follows'), 'follows is a real metric this job does not yet read')
  assert(unread.includes('interactions'), 'interactions is a real metric this job does not yet read')
})

// ── The mapping

check('X maps onto our columns, and bookmarks are SAVES', () => {
  const row: AnalyticsRow = { totalImpressions: 153, totalLikes: 4, totalReplies: 1, totalRetweets: 2, totalBookmarks: 7, tweetId: '1' }
  const c = mapRow('x', row, 'r-1', 't')
  assert(c.impressions === 153 && c.reactions === 4 && c.comments === 1 && c.shares === 2, 'the ordinary four')
  assert(c.saves === 7, 'totalBookmarks is the saves signal on X')
})

check('LinkedIn\'s uniqueImpressions is REACH, not impressions', () => {
  const c = mapRow('linkedin', { impressions: 153, uniqueImpressions: 111, likes: 1 }, 'r-1', 't')
  assert(c.impressions === 153 && c.reach === 111, `got impressions=${c.impressions} reach=${c.reach}`)
})

check('a metric the platform did not report is NULL, never zero', () => {
  const c = mapRow('x', { totalImpressions: 2, totalLikes: null, tweetId: '1' }, 'r-1', 't')
  assert(c.reactions === null, 'an explicit null stays null')
  assert(c.saves === null, 'an absent key stays null')
  assert(c.impressions === 2, 'and a real zero-or-more is still recorded')
  // This is the whole distinction: a post with no likes and a post whose likes were not reported
  // are different findings, and only one of them is about the post.
})

check('the whole row is kept in `raw` whatever the mapping caught', () => {
  const row = { totalImpressions: 2, somethingNew: 9, tweetId: '1' }
  assert(mapRow('x', row, 'r-1', 't').raw === row, 'raw is the catch-all D7 requires')
})

check('UNMAPPED numeric keys are reported — the mechanism that verifies the Instagram guess', () => {
  // Stand-in for the 2026-08-17 first capture: a plausible Instagram row using names the
  // candidate list does not have.
  const row: AnalyticsRow = { postId: 'X', totalInteractions: 40, igSaved: 12, profileVisits: 3, text: 'copy', reach: 900 }
  const extra = unmappedNumericKeys('instagram', row)
  assert(extra.includes('igSaved'), 'an unclaimed metric must be named so the mapping can be corrected')
  assert(extra.includes('totalInteractions') && extra.includes('profileVisits'), 'all of them, not just the first')
  assert(!extra.includes('reach'), 'a key the mapping DOES claim is not unmapped')
  assert(!extra.includes('text') && !extra.includes('postId'), 'identity and copy are not metrics')
})

// ── Seven-day coverage

const HOUR = 3600e3
check('a post younger than the mark is not yet DUE, so it cannot be missing', () => {
  const now = new Date('2026-08-20T12:00:00Z') // day 3 of a post published 2026-08-17
  const c = ageCoverage([rend()], [], now)
  assert(c.due === 0 && c.missing.length === 0, 'the window has not closed yet')
})

check('a post past the mark WITH a datapoint near it is covered', () => {
  const now = new Date('2026-08-30T12:00:00Z')
  const c = ageCoverage([rend()], [{ rendition_id: 'r-1', captured_at: '2026-08-24T13:00:00Z' }], now)
  assert(c.due === 1 && c.covered === 1, `expected covered, got due=${c.due} covered=${c.covered}`)
})

check('a post past the mark with captures only OUTSIDE the tolerance is MISSING', () => {
  const now = new Date('2026-08-30T12:00:00Z')
  const c = ageCoverage([rend()], [
    { rendition_id: 'r-1', captured_at: '2026-08-18T12:00:00Z' }, // day 1
    { rendition_id: 'r-1', captured_at: '2026-08-29T12:00:00Z' }, // day 12
  ], now)
  assert(c.due === 1 && c.covered === 0 && c.missing.length === 1, 'a running total is not a reading at an age')
  assert(c.missing[0].slug === 'carousel-brain-fog' && c.missing[0].variant === 'A', 'the miss must name the post AND its variant')
})

check('the tolerance is symmetric and one day wide', () => {
  const published = new Date('2026-08-17T12:00:00Z').getTime()
  const mark = published + FIXED_AGE_DAYS * 864e5
  const now = new Date('2026-09-10T00:00:00Z')
  const at = (offsetMs: number) => ageCoverage([rend()], [{ rendition_id: 'r-1', captured_at: new Date(mark + offsetMs).toISOString() }], now).covered
  assert(at(-23 * HOUR) === 1, 'a day early counts')
  assert(at(+23 * HOUR) === 1, 'a day late counts')
  assert(at(+30 * HOUR) === 0, 'thirty hours late does not')
})

check('an unpublished rendition is never due', () => {
  const c = ageCoverage([rend({ published_at: null })], [], new Date('2026-10-01T00:00:00Z'))
  assert(c.due === 0, 'nothing published, nothing owed')
})

// ── Running

function reader(rowsBy: Record<string, AnalyticsRow[]>): AnalyticsReader {
  return async (network, blogId) => ({ ok: true, rows: rowsBy[`${network}@${blogId}`] ?? [] })
}

check('a capture is written against the rendition whose PLATFORM id matches', async () => {
  const written: Capture[] = []
  const rends = [
    rend({ id: 'r-x1', platform: 'x', format: 'text-post', variant: null, external_url: 'https://twitter.com/a/status/111' }),
    rend({ id: 'r-x2', platform: 'x', format: 'text-post', variant: null, external_url: 'https://twitter.com/a/status/222', asset_slug: 'other' }),
  ]
  const res = await runMetrics({
    renditions: rends,
    priorCaptures: [],
    read: reader({ 'twitter@6633045': [{ tweetId: '222', totalImpressions: 99, totalBookmarks: 5 }] }),
    write: async (c) => { written.push(c) },
    brands: ['6633045'],
    dryRun: false,
    now: new Date('2026-08-20T00:00:00Z'),
  })
  assert(written.length === 1, `expected 1 capture, got ${written.length}`)
  assert(written[0].rendition_id === 'r-x2', 'the capture must land on the rendition holding post 222')
  assert(written[0].saves === 5 && written[0].impressions === 99, 'the numbers must survive the mapping')
  assert(res.noData.some((n) => n.slug === 'carousel-brain-fog'), 'the post with no analytics row must be reported, not ignored')
})

check('a dry run writes nothing but still reports what it found', async () => {
  const written: Capture[] = []
  const res = await runMetrics({
    renditions: [rend({ id: 'r-x1', platform: 'x', external_url: 'https://twitter.com/a/status/111' })],
    priorCaptures: [],
    read: reader({ 'twitter@6633045': [{ tweetId: '111', totalImpressions: 12 }] }),
    write: async (c) => { written.push(c) },
    brands: ['6633045'],
    dryRun: true,
    now: new Date('2026-08-20T00:00:00Z'),
  })
  assert(written.length === 0, 'a dry run must not write')
  assert(res.captured.length === 1, 'but it still says what it would have recorded')
})

check('BOTH brands are queried, because the wrong one answers 200 with an empty array', async () => {
  // The measured trap of 2026-08-14: METRICOOL_BLOG_ID names one brand of two, and the carousel
  // run is on the other. A job asking only the configured brand gets a clean, wrong, empty run.
  const asked: string[] = []
  const res = await runMetrics({
    renditions: [rend({ id: 'r-i1', external_url: 'https://instagram.com/p/AAA' })],
    priorCaptures: [],
    read: async (network, blogId) => {
      asked.push(`${network}@${blogId}`)
      return { ok: true, rows: blogId === '6693691' ? [{ postId: 'AAA', saved: 31, reach: 900 }] : [] }
    },
    write: async () => {},
    brands: ['6633045', '6693691'],
    dryRun: false,
    now: new Date('2026-08-20T00:00:00Z'),
  })
  assert(asked.length === 2, `expected both brands asked, got ${asked.join(', ')}`)
  assert(res.captured.length === 1 && res.captured[0].saves === 31, 'the capture lives on the second brand')
})

check('an analytics row nothing claims is UNMATCHED, never attached to the nearest candidate', async () => {
  const res = await runMetrics({
    renditions: [rend({ id: 'r-x1', platform: 'x', external_url: 'https://twitter.com/a/status/111' })],
    priorCaptures: [],
    read: reader({ 'twitter@6633045': [{ tweetId: '999', totalImpressions: 5 }] }),
    write: async () => {},
    brands: ['6633045'],
    dryRun: false,
    now: new Date('2026-08-20T00:00:00Z'),
  })
  assert(res.unmatched.length === 1 && res.unmatched[0].postId === '999', 'the stray row must be named')
  assert(res.captured.length === 0, 'and nothing may be written from it')
})

check('a rendition with no external_url is a write-back finding, not a measurement failure', async () => {
  const res = await runMetrics({
    renditions: [rend({ id: 'r-n', platform: 'x', external_url: null })],
    priorCaptures: [],
    read: reader({}),
    write: async () => {},
    brands: ['6633045'],
    dryRun: false,
    now: new Date('2026-08-20T00:00:00Z'),
  })
  assert(res.noData.length === 1 && /write-back records a URL/.test(res.noData[0].why), 'the message must point at the right job')
  assert(res.failed.length === 0, 'and it is not this job failing')
})

check('a write failure is a FAILURE carrying the database\'s own message', async () => {
  const res = await runMetrics({
    renditions: [rend({ id: 'r-x1', platform: 'x', external_url: 'https://twitter.com/a/status/111' })],
    priorCaptures: [],
    read: reader({ 'twitter@6633045': [{ tweetId: '111', totalImpressions: 5 }] }),
    write: async () => { throw new Error('duplicate key value violates unique constraint') },
    brands: ['6633045'],
    dryRun: false,
    now: new Date('2026-08-20T00:00:00Z'),
  })
  assert(res.failed.length === 1 && /duplicate key/.test(res.failed[0].why), 'the real reason must survive')
  assert(exitCodeFor(res) === 2, 'a failure exits 2')
})

// ── Reporting

const empty: RunResult = {
  captured: [], unmatched: [], noData: [], unmapped: {}, failed: [],
  coverage: { due: 0, covered: 0, missing: [] }, brandsQueried: ['6633045'],
}

check('exit codes: clean 0, a missed seven-day datapoint 3, a write failure 2', () => {
  assert(exitCodeFor(empty) === 0, 'clean is 0')
  assert(exitCodeFor({ ...empty, coverage: { due: 1, covered: 0, missing: [{ slug: 's', variant: 'A', publishedAt: '2026-08-17T12:00:00Z' }] } }) === 3, 'a gap in the test\'s own data is work owed')
  assert(exitCodeFor({ ...empty, failed: [{ ref: 'r', why: 'w' }] }) === 2, 'a failure is 2')
})

check('a missed datapoint is rendered as unrecoverable, because it is', () => {
  const out = render({ ...empty, coverage: { due: 2, covered: 1, missing: [{ slug: 'carousel-brain-fog', variant: 'B', publishedAt: '2026-08-17T12:00:00Z' }] } }, { dryRun: false })
  assert(/CANNOT BE BACKFILLED/.test(out), 'the asymmetry between a total and a reading-at-an-age has to be in the output')
  assert(/carousel-brain-fog B/.test(out), 'and the post it applies to')
})

check('an empty run says so rather than printing nothing', () => {
  assert(/clean run, not a silent one/.test(render(empty, { dryRun: false })), 'silence reads as a broken job')
})

check('a dry run is labelled as one in the output', () => {
  assert(/DRY RUN/.test(render(empty, { dryRun: true })), 'must be obvious from the output')
})

check('direct-invocation guard matches the exact basename only', () => {
  assert(isDirectInvocation('/x/metricool-metrics.ts'), 'should match itself')
  assert(!isDirectInvocation('/x/test-metricool-metrics.ts'), 'MUST NOT match its own test file')
  assert(!isDirectInvocation(undefined), 'undefined should not match')
})

void Promise.all(pending).then(() => {
  console.log('')
  if (failures) { console.log(`${failures} failing check(s).`); process.exit(1) }
  console.log('All checks passed.')
})
