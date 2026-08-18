/**
 * Tests for remap-metricool-ids.
 *
 * Every branch that decides whether a rendition gets rewritten is exercised with no network and no
 * database, because the dangerous outcome here is a WRONG remap: it reads as healthy while
 * attributing one post's numbers to another post's asset.
 */

import assert from 'node:assert'
import {
  classify, toLive, stamp, runRemap,
  type Rendition, type LivePost,
} from './remap-metricool-ids'

let passed = 0
function test(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => { console.log(`  ✓ ${name}`); passed += 1 })
    .catch((e) => { console.error(`  ✗ ${name}\n    ${(e as Error).message}`); process.exitCode = 1 })
}

const R = (over: Partial<Rendition> = {}): Rendition => ({
  id: 'r1', slug: 'carousel-b12-blood-test', platform: 'instagram', status: 'scheduled',
  external_post_id: '361490104', scheduled_for: '2026-08-18T12:00:00.000Z', ...over,
})
const P = (over: Partial<LivePost> = {}): LivePost => ({
  id: '363272484', network: 'instagram', instant: '2026-08-18T12:00:00.000Z',
  publishedUrl: null, providerStatus: 'PUBLISHED', ...over,
})

async function main() {
  console.log('remap-metricool-ids\n')

  await test('an id that still matches its slot is left alone', () => {
    const v = classify(R({ external_post_id: '363272484' }), [P()])
    assert.equal(v.kind, 'ok')
  })

  await test('a changed id in the same slot is a remap', () => {
    const v = classify(R(), [P()])
    assert.equal(v.kind, 'remap')
    assert.equal(v.kind === 'remap' && v.to.id, '363272484')
  })

  await test('an empty slot is REPORTED, never invented', () => {
    const v = classify(R(), [P({ instant: '2026-08-19T12:00:00.000Z' })])
    assert.equal(v.kind, 'missing')
  })

  await test('the network must match, not just the instant', () => {
    const v = classify(R(), [P({ network: 'facebook' })])
    assert.equal(v.kind, 'missing')
  })

  await test('TWO posts in one slot REFUSE, because the stored id cannot break the tie', () => {
    const v = classify(R(), [P(), P({ id: '999' })])
    assert.equal(v.kind, 'ambiguous')
    assert.match(v.kind === 'ambiguous' ? v.why : '', /363272484, 999/)
  })

  await test('a platform with no Metricool network mapping is refused, not guessed', () => {
    const v = classify(R({ platform: 'substack' }), [P()])
    assert.equal(v.kind, 'missing')
  })

  await test('one post with two providers becomes one LivePost per network', () => {
    const live = toLive({
      id: 42,
      publicationDate: { dateTime: '2026-08-18T13:00:00', timezone: 'Europe/London' },
      providers: [{ network: 'instagram', status: 'PUBLISHED' }, { network: 'facebook', status: 'PENDING' }],
    })
    assert.equal(live.length, 2)
    assert.deepEqual(live.map((l) => l.network).sort(), ['facebook', 'instagram'])
    // 13:00 London in August is 12:00Z. A naive read would store 13:00Z and match nothing.
    assert.equal(live[0].instant, '2026-08-18T12:00:00.000Z')
  })

  await test('a post with no id or no date contributes nothing rather than a null row', () => {
    assert.equal(toLive({ publicationDate: { dateTime: '2026-08-18T13:00:00' }, providers: [{ network: 'instagram' }] }).length, 0)
    assert.equal(toLive({ id: 1, providers: [{ network: 'instagram' }] }).length, 0)
  })

  await test('the list window is a local wall clock, the format the API demands', () => {
    assert.equal(stamp('2026-08-17'), '2026-08-17T00:00:00')
    assert.equal(stamp('2026-09-16', true), '2026-09-16T23:59:59')
  })

  await test('a dry run reports the remap and writes nothing', async () => {
    let writes = 0
    const res = await runRemap({
      renditions: [R()], live: [P()], dryRun: true,
      write: async () => { writes += 1 },
    })
    assert.equal(writes, 0)
    assert.equal(res.remapped.length, 1)
  })

  await test('an apply run writes exactly the new id', async () => {
    const seen: [string, string][] = []
    const res = await runRemap({
      renditions: [R()], live: [P()], dryRun: false,
      write: async (id, newId) => { seen.push([id, newId]) },
    })
    assert.deepEqual(seen, [['r1', '363272484']])
    assert.equal(res.remapped.length, 1)
  })

  await test('a write failure is a FAILURE carrying the database message, not a silent skip', async () => {
    const res = await runRemap({
      renditions: [R()], live: [P()], dryRun: false,
      write: async () => { throw new Error('permission denied') },
    })
    assert.equal(res.remapped.length, 0)
    assert.equal(res.failed.length, 1)
    assert.match(res.failed[0].why, /permission denied/)
  })

  console.log(`\n${process.exitCode ? 'FAILURES' : 'All checks passed.'} (${passed})`)
}

main()
