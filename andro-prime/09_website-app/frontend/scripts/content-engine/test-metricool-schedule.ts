/**
 * Guards metricool-schedule: the eligibility layer, the payload, and the write-back contract.
 *
 * WHY THIS EXISTS. This script posts to a live public social account. Its failure directions are
 * asymmetric and both are bad. Sending something that was not ready puts copy in front of the
 * public that nobody approved. Silently declining to send something that WAS ready recreates the
 * exact condition this job was built to end: on 2026-08-05 four approved, pre-flight-green assets
 * sat unscheduled while their slots passed, and every store agreed with every other store the
 * whole time, so nothing anywhere went red.
 *
 * The most important cases are the ones where a refusal must NOT be silent, and the one where a
 * post exists in Metricool but the write-back failed, which is the drift this system exists to
 * prevent being manufactured by the tool meant to prevent it.
 *
 * No network, no database, no credentials. Every entry point takes its inputs as arguments.
 *
 * Run: npx tsx scripts/content-engine/test-metricool-schedule.ts
 */
import {
  classify, buildPayload, wallClock, articleImage, exitCodeFor, render,
  isDirectInvocation, NETWORK, MEDIA_PLATFORMS, runSchedule,
  type SchedulableRendition, type MetricoolPayload, type RunResult,
} from './metricool-schedule'

let failures = 0

function check(name: string, fn: () => void | Promise<void>) {
  const done = (err?: unknown) => {
    if (err) { failures += 1; console.log(`  ✗ ${name}`); console.log(`      ${(err as Error).message}`) }
    else console.log(`  ✓ ${name}`)
  }
  try {
    const r = fn()
    if (r instanceof Promise) return r.then(() => done()).catch(done)
    done()
  } catch (e) { done(e) }
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

const FUTURE = '2026-09-01T10:00:00+00:00'
const NOW = new Date('2026-08-05T00:00:00Z')

function rend(over: Partial<SchedulableRendition> = {}): SchedulableRendition {
  return {
    id: 'r1', asset_id: 'a1', asset_slug: 'demo-asset', asset_status: 'approved',
    platform: 'linkedin', format: 'text-post', body: 'Some approved copy.', first_comment: '',
    status: 'to-produce', scheduled_for: FUTURE, external_post_id: null, publisher: null,
    canonical_article_slug: null, ...over,
  }
}

async function run() {
  console.log('\nmetricool-schedule — eligibility')

  check('a fully-ready rendition is SENT', () => {
    assert(classify(rend(), NOW).kind === 'send', 'should send')
  })

  check('an already-pushed rendition is SKIPPED, never sent twice', () => {
    const v = classify(rend({ external_post_id: '12345' }), NOW)
    assert(v.kind === 'skip', `expected skip, got ${v.kind}`)
  })

  check('an unapproved asset is SKIPPED, not refused (it is not owed yet)', () => {
    const v = classify(rend({ asset_status: 'scripted' }), NOW)
    assert(v.kind === 'skip', `expected skip, got ${v.kind}`)
    assert(/scripted/.test((v as { why: string }).why), 'the reason must name the actual status')
  })

  // The four 2026-08-05 assets were exactly this: approved, green, and going nowhere.
  check('an APPROVED asset with no body is REFUSED and named, never skipped quietly', () => {
    const v = classify(rend({ body: null }), NOW)
    assert(v.kind === 'refuse', `an approved asset that cannot ship is owed work, got ${v.kind}`)
    assert(/body/.test((v as { why: string }).why), 'the reason must name the missing column')
  })

  check('an APPROVED asset with no scheduled_for is REFUSED, and the reason says why we do not guess', () => {
    const v = classify(rend({ scheduled_for: null }), NOW)
    assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
    assert(/editorial/.test((v as { why: string }).why), 'must say slot choice is deliberately not automated')
  })

  check('a slot in the past is REFUSED rather than posted into the past', () => {
    const v = classify(rend({ scheduled_for: '2026-08-01T10:00:00+00:00' }), NOW)
    assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
    assert(/passed/.test((v as { why: string }).why), 'reason must say the slot has passed')
  })

  check('an unmapped platform is REFUSED, never sent under a guessed network name', () => {
    const v = classify(rend({ platform: 'substack' }), NOW)
    assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
    assert(!NETWORK.substack, 'substack must have no Metricool mapping')
  })

  check('a rendition routed to another publisher is REFUSED, not taken over', () => {
    const v = classify(rend({ publisher: 'unipile' }), NOW)
    assert(v.kind === 'refuse', `expected refuse, got ${v.kind}`)
  })

  check('status scheduled with no id is SKIPPED as the doctor\'s business, not re-sent', () => {
    const v = classify(rend({ status: 'scheduled' }), NOW)
    assert(v.kind === 'skip', `expected skip, got ${v.kind}`)
    assert(/doctor/i.test((v as { why: string }).why), 'reason should route it to the doctor')
  })

  console.log('\nmetricool-schedule — payload')

  check('every post is created as a DRAFT (standing decision, plan 7.1)', () => {
    const p = buildPayload(rend(), null)
    assert(p.draft === true, 'draft must be true: the draft-to-live flip is a human action')
  })

  check('the network name is mapped, not lowercased: x becomes twitter', () => {
    const p = buildPayload(rend({ platform: 'x' }), null)
    assert(p.providers[0].network === 'twitter', `got ${p.providers[0].network}`)
  })

  check('only the posting network gets a networkData block', () => {
    const p = buildPayload(rend({ platform: 'linkedin' }), null) as MetricoolPayload
    assert(p.linkedinData, 'linkedin post must carry linkedinData')
    assert(!p.facebookData, 'a linkedin post must not carry facebookData')
  })

  check('facebook attaches the article image; linkedin deliberately does not', () => {
    const img = { url: 'https://example.test/a.png', alt: 'alt text' }
    const fb = buildPayload(rend({ platform: 'facebook' }), img)
    assert(fb.media.length === 1 && fb.media[0] === img.url, 'facebook should carry the image')
    assert(fb.mediaAltText[0] === 'alt text', 'alt text must travel with it')
    const li = buildPayload(rend({ platform: 'linkedin' }), img)
    assert(li.media.length === 0, 'linkedin text-posts ship without media by decision')
    assert(MEDIA_PLATFORMS.has('facebook') && !MEDIA_PLATFORMS.has('linkedin'), 'media policy is data-driven')
  })

  check('publicationDate is local wall-clock plus a zone, never an offset', () => {
    // 2026-08-07T10:00Z is 11:00 in London under BST. Sending 10:00 would post an hour early.
    const p = buildPayload(rend({ scheduled_for: '2026-08-07T10:00:00+00:00' }), null)
    assert(p.publicationDate.dateTime === '2026-08-07T11:00:00', `got ${p.publicationDate.dateTime}`)
    assert(p.publicationDate.timezone === 'Europe/London', 'zone must be named')
    assert(!/[+Z]/.test(p.publicationDate.dateTime), 'wall clock must carry no offset')
  })

  check('wallClock handles a winter (GMT) date without shifting it', () => {
    assert(wallClock('2026-01-15T09:00:00+00:00') === '2026-01-15T09:00:00', wallClock('2026-01-15T09:00:00+00:00'))
  })

  console.log('\nmetricool-schedule — article image (frontmatter only, never prose)')

  check('reads photoSrc from a folded YAML scalar', () => {
    const mdx = ['---', 'title: X', 'photoAlt: A man at a window', 'photoSrc: >-', '  https://images.example/photo.jpg', 'readTime: 8 Min Read', '---', '', '# body'].join('\n')
    const img = articleImage(mdx)
    assert(img?.url === 'https://images.example/photo.jpg', `got ${img?.url}`)
    assert(img?.alt === 'A man at a window', `got ${img?.alt}`)
  })

  check('falls back to imgSrc and absolutises a site-relative path', () => {
    const mdx = ['---', 'title: X', 'imgAlt: card alt', 'imgSrc: /og/card.png', '---', ''].join('\n')
    const img = articleImage(mdx)
    assert(img?.url === 'https://andro-prime.com/og/card.png', `got ${img?.url}`)
  })

  check('an article with no image yields null, which is a post without media rather than a failure', () => {
    assert(articleImage(['---', 'title: X', '---', ''].join('\n')) === null, 'should be null')
  })

  console.log('\nmetricool-schedule — run + exit codes')

  await check('dry run sends nothing but still reports what it would send', async () => {
    let called = 0
    const out = await runSchedule({
      renditions: [rend()], root: '/nonexistent', dryRun: true, now: NOW,
      create: async () => { called += 1; return { ok: true, id: 'X' } },
    })
    assert(called === 0, 'dry run must not call Metricool')
    assert(out.sent.length === 1, 'it must still report the intent')
  })

  await check('a created post whose write-back fails is a FAILURE naming the id, never a success', async () => {
    const out = await runSchedule({
      renditions: [rend()], root: '/nonexistent', dryRun: false, now: NOW,
      create: async () => ({ ok: true, id: '999' }),
      writeBack: async () => { throw new Error('db down') },
    })
    assert(out.sent.length === 0, 'it must not be reported as sent')
    assert(out.failed.length === 1, 'it must be a failure')
    assert(/999/.test(out.failed[0].why), 'the orphaned post id must appear in the message')
    assert(/duplicate/i.test(out.failed[0].why), 'it must warn that re-running duplicates')
  })

  check('refusals exit 3 (work owed), failures exit 2 (something is wrong), clean exits 0', () => {
    const base: RunResult = { sent: [], failed: [], refused: [], skipped: 0 }
    assert(exitCodeFor(base) === 0, 'clean run is 0')
    assert(exitCodeFor({ ...base, refused: [{ slug: 's', platform: 'p', why: 'w' }] }) === 3, 'refusal is 3')
    assert(exitCodeFor({ ...base, failed: [{ slug: 's', platform: 'p', why: 'w' }] }) === 2, 'failure is 2')
    assert(exitCodeFor({ ...base, failed: [{ slug: 's', platform: 'p', why: 'w' }], refused: [{ slug: 's', platform: 'p', why: 'w' }] }) === 2, 'failure outranks refusal')
  })

  check('an empty run says so out loud rather than printing nothing', () => {
    const text = render({ sent: [], failed: [], refused: [], skipped: 0 }, { dryRun: false })
    assert(/clean run, not a silent one/.test(text), 'an empty report must state that it is empty')
  })

  check('a refusal is reported as work owed, not as an error', () => {
    const text = render({ sent: [], failed: [], refused: [{ slug: 's', platform: 'facebook/link-post', why: 'no body' }], skipped: 0 }, { dryRun: false })
    assert(/REFUSED/.test(text) && /work owed/i.test(text), 'refusals must read as owed work')
  })

  console.log('\nmetricool-schedule — entry-point guard')

  // The signoff-sync regression: a SUFFIX match let the test file execute the real sync
  // against production. This job posts publicly, so the same slip publishes a post.
  check('the test file is NOT treated as the entry point', () => {
    for (const p of ['/x/test-metricool-schedule.ts', 'test-metricool-schedule.ts', 'C:\\x\\test-metricool-schedule.js']) {
      assert(!isDirectInvocation(p), `${p} must not run the scheduler`)
    }
  })

  check('the real file IS the entry point', () => {
    for (const p of ['/x/metricool-schedule.ts', 'C:\\x\\metricool-schedule.js']) {
      assert(isDirectInvocation(p), `${p} should be the entry point`)
    }
    assert(!isDirectInvocation(undefined), 'undefined argv[1] must not run it')
    assert(!isDirectInvocation(''), 'empty argv[1] must not run it')
  })

  console.log('')
  if (failures) { console.log(`${failures} test(s) FAILED`); process.exit(1) }
  console.log('All metricool-schedule tests passed.')
}

run()
