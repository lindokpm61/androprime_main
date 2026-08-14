/*
 * The 30-day Metricool schedule, generated. Nothing here is hand-typed.
 *
 *   node schedule.js            the run as a table, for reading
 *   node schedule.js --json     the 30 Metricool payloads, for posting
 *   node schedule.js --check    assert the invariants and exit non-zero on any failure
 *
 * Three sources, one row per post, and none of them restated here:
 *   · covers.js      which topic and which cover format each day carries
 *   · captions.md    the CA-035 caption and first comment for that topic
 *   · media-manifest.json  where the media actually resolves for Metricool
 *
 * The captions are PARSED out of captions.md rather than copied into this file.
 * That is the whole point of the file. A second copy of approved copy is a copy
 * that can be edited without going back through Ewa, and it would not look
 * edited: it would look like a schedule. Parsing means the only way to change
 * what gets posted is to change the approved artefact.
 *
 * Metricool takes PUBLIC URLs and re-hosts to its own CDN at schedule time, so
 * the media has to be live and serving before this runs, not after. That is what
 * publish-media.js does, and it verifies each upload by fetching it back
 * unauthenticated rather than trusting the 200 it got for writing it.
 */

const fs = require('fs');
const path = require('path');
const { TOPIC_ORDER, coverFor, coverFormat, checkBalance } = require('./covers');

/* Media resolves out of Supabase Storage (bucket `content`), via the manifest that
 * publish-media.js writes. It used to be `https://andro-prime.com/carousel/<slug>/`,
 * committed under frontend/public/carousel/ — changed 2026-08-14 for plan step 3.4,
 * gate D3: git holds the recipe, Storage holds what a machine publishes from.
 *
 * THE MANIFEST IS NOT AN INDIRECTION FOR ITS OWN SAKE. Storage paths carry an
 * eight-hex content hash so an embargoed asset is not guessable from a slug that
 * is published in the run calendar, and a hashed path cannot be reconstructed
 * from a convention. So the recipe has to record it. The manifest is committed;
 * the media is not.
 *
 * The thirty posts already scheduled are unaffected either way: Metricool
 * re-hosted every asset to its own CDN at schedule time (confirmed on read-back,
 * all thirty reference static.metricool.com/planner/...), so the origin only had
 * to survive the scheduling call. This changes where a FUTURE run reads from. */
const MANIFEST_PATH = path.join(__dirname, 'media-manifest.json');

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(
      'media-manifest.json is missing. Run: node publish-media.js --all\n' +
      'Metricool fetches these URLs unauthenticated at schedule time, so they have to be live ' +
      'and serving BEFORE a schedule is emitted, not after.'
    );
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

/* Resolve one logical file to its published URL, or fail loudly naming what is missing.
 * A missing entry used to be unrepresentable, because the URL was built by string
 * concatenation and always "existed". It could still 404, and a 404 at schedule time
 * produces a post with missing frames rather than an error. */
function assetUrl(manifest, slug, name) {
  const entry = manifest[slug] && manifest[slug][name];
  if (!entry) throw new Error(`${slug}/${name} is not in media-manifest.json — re-run publish-media.js`);
  return entry.url;
}

/* Day 1. This is NOT a free parameter. `CAROUSEL_RUN_START` is set in Coolify to
 * 2026-08-17T12:00:00Z and `visiblePosts()` in lib/bio-grid.ts reveals day 1 at
 * that instant and every later day exactly 24h on. Post earlier than the anchor
 * and slide 8's "Link in bio" resolves to a grid that does not yet contain the
 * tile the reader went looking for. So the two values move together or not at
 * all, and --check asserts they agree. 12:00 UTC is 13:00 in London through the
 * whole run: BST ends 2026-10-25, well past day 30 on 2026-09-15. */
const RUN_START_UTC = '2026-08-17T12:00:00Z';
const TIMEZONE = 'Europe/London';
const LOCAL_HHMM = '13:00:00';
const RUN_DAYS = 30;

/* Day 1 publishes; days 2 to 30 are drafts. The standing rule (Keith,
 * 2026-07-31) is that this pipeline creates drafts and a human flips them, and
 * the reason to break it for exactly one post is that the publish path has
 * never been exercised: the 2026-08-10 test proved Metricool ACCEPTS a carousel,
 * not that Instagram publishes one. Day 1 is the canary that answers it four
 * days before the rest would have gone out blind. */
const LIVE_DAYS = [1];

/* ------------------------------------------------------------- captions --- */

/* captions.md is the CA-035 artefact. Its shape is stable and simple: a heading
 * naming the topic slug, a blockquote caption, a "First comment" heading, a
 * second blockquote. Parsed rather than trusted to a hand copy. */
function parseCaptions() {
  const src = fs.readFileSync(path.join(__dirname, 'captions.md'), 'utf8');
  const out = {};

  /* Split on the caption headings: ### C1 · `slug` — days 1, 11, 21 */
  const sections = src.split(/^### C(\d+) · `([^`]+)`[^\n]*$/m);
  /* sections[0] is the preamble; then repeating [num, slug, body] triples. */
  for (let i = 1; i < sections.length; i += 3) {
    const slug = sections[i + 1];
    const body = sections[i + 2];

    /* The body runs to the next --- separator, so the trailing commentary
     * sections cannot leak into the last caption. */
    const scoped = body.split(/^---$/m)[0];

    const firstCommentAt = scoped.search(/^#### First comment/m);
    if (firstCommentAt === -1) throw new Error(`${slug}: no first-comment heading`);

    const caption = unquote(scoped.slice(0, firstCommentAt));
    const comment = unquote(scoped.slice(firstCommentAt).replace(/^#### [^\n]*$/m, ''));

    if (!caption) throw new Error(`${slug}: empty caption`);
    if (!comment) throw new Error(`${slug}: empty first comment`);
    out[slug] = { caption, comment };
  }
  return out;
}

/* A markdown blockquote back to the text it quotes. Blank quoted lines ('>')
 * are paragraph breaks and must survive: the captions are written as short
 * paragraphs and Instagram renders the blank lines. Soft-wrapped lines inside
 * one paragraph are rejoined, because the wrapping is an artefact of the file
 * being readable at 100 columns, not of the copy. */
function unquote(block) {
  const lines = block.split('\n').filter((l) => /^\s*>/.test(l)).map((l) => l.replace(/^\s*>\s?/, ''));
  const paras = [];
  let cur = [];
  for (const line of lines) {
    if (line.trim() === '') { if (cur.length) { paras.push(cur.join(' ')); cur = []; } continue; }
    cur.push(line.trim());
  }
  if (cur.length) paras.push(cur.join(' '));
  return paras.join('\n\n').trim();
}

/* ------------------------------------------------------------- schedule --- */

function dateFor(day) {
  /* Day 1 is the anchor date; each later day is +24h. Built from a UTC instant
   * and formatted back into London local time, so the arithmetic never runs on
   * a wall-clock string. */
  const anchor = new Date(RUN_START_UTC);
  const d = new Date(anchor.getTime() + (day - 1) * 86400000);
  const iso = d.toISOString().slice(0, 10);
  return iso;
}

function buildRun() {
  const balance = checkBalance(RUN_DAYS);
  if (!balance.ok) {
    console.error('SCHEDULE IS UNBALANCED:');
    for (const p of balance.problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const captions = parseCaptions();
  const manifest = loadManifest();
  const posts = [];

  for (let day = 1; day <= RUN_DAYS; day++) {
    /* The rotation, identical to plan.js: topic = day mod 10, close = day mod 3.
     * 10 and 3 are coprime, so across 30 days every topic-and-close pair occurs
     * exactly once. Cover format is a property of the APPEARANCE, not the day. */
    const topicIndex = (day - 1) % TOPIC_ORDER.length;
    const slug = TOPIC_ORDER[topicIndex];
    const appearance = Math.floor((day - 1) / TOPIC_ORDER.length);
    const close = 'ABC'[(day - 1) % 3];
    const format = coverFormat(topicIndex, appearance);

    const cap = captions[slug];
    if (!cap) throw new Error(`day ${day}: no caption parsed for ${slug}`);

    /* The LOGICAL names, which is what the invariants below are actually about. Kept beside the
     * URLs rather than parsed back out of them: with content-hashed paths a URL no longer ends in
     * "close-A.png", and a check written against the URL would have to be loosened to keep
     * passing. Loosening a check to accommodate a path change is how a check stops meaning
     * anything. */
    const mediaNames = [
      format === 'video' ? 'cover-video.mp4' : 'cover-type.png',
      ...['02', '03', '04', '05', '06', '07'].map((n) => `slide-${n}.png`),
      `close-${close}.png`,
    ];

    const media = mediaNames.map((n) => assetUrl(manifest, slug, n));

    const live = LIVE_DAYS.includes(day);
    const date = dateFor(day);

    posts.push({
      day,
      slug,
      close,
      format,
      date,
      mediaNames,
      headline: `${coverFor(slug).l1} ${coverFor(slug).l2}`,
      live,
      /* The Metricool payload, exactly as createScheduledPost wants it. */
      payload: {
        autoPublish: live,
        draft: !live,
        hasNotReadNotes: false,
        shortener: false,
        descendants: [],
        smartLinkData: { ids: [] },
        media,
        /* Deliberately empty. Alt text is customer-facing copy and none was
         * written or approved under CA-035; inventing thirty alt strings here
         * would ship unreviewed copy through the one step nobody re-reads. */
        mediaAltText: [],
        text: cap.caption,
        firstCommentText: cap.comment,
        providers: [{ network: 'instagram' }],
        instagramData: { type: 'POST', showReelOnFeed: true },
        publicationDate: { dateTime: `${date}T${LOCAL_HHMM}`, timezone: TIMEZONE },
      },
    });
  }
  return posts;
}

/* --------------------------------------------------------------- checks --- */

/* Everything here has already been wrong once somewhere in this run, which is
 * why each is asserted rather than assumed. */
function check(posts) {
  const problems = [];

  if (posts.length !== RUN_DAYS) problems.push(`${posts.length} posts, expected ${RUN_DAYS}`);

  /* Anchor agreement. If someone moves the run start they must move Coolify too,
   * and this is the line that says so out loud. */
  if (`${posts[0].date}T${LOCAL_HHMM}` !== '2026-08-17T13:00:00') {
    problems.push(`day 1 is ${posts[0].date} ${LOCAL_HHMM}, expected 2026-08-17 13:00 London`);
  }

  /* Every post is 8 media, cover first, close last. A carousel that silently
   * lost a slide still posts. */
  for (const p of posts) {
    if (p.payload.media.length !== 8) problems.push(`day ${p.day}: ${p.payload.media.length} media, expected 8`);
    if (!/^close-[ABC]\.png$/.test(p.mediaNames[7])) problems.push(`day ${p.day}: last media is not a close`);
    const coverOk = p.format === 'video'
      ? p.mediaNames[0] === 'cover-video.mp4'
      : p.mediaNames[0] === 'cover-type.png';
    if (!coverOk) problems.push(`day ${p.day}: cover does not match format ${p.format}`);
    if (p.mediaNames[7] !== `close-${p.close}.png`) problems.push(`day ${p.day}: close asset is not close-${p.close}`);

    /* Every media URL must actually be a published Storage object. The old convention-built URLs
     * were always well-formed and could still 404; these come from the manifest, so the check that
     * matters now is that nothing slipped through as undefined or as the old origin. */
    for (const [i, u] of p.payload.media.entries()) {
      if (typeof u !== 'string' || !u.startsWith('http')) problems.push(`day ${p.day}: media[${i}] is not a URL`);
      else if (!u.includes('/storage/v1/object/public/content/')) problems.push(`day ${p.day}: media[${i}] does not resolve to the content bucket: ${u}`);
    }
  }

  /* Dates: 30 distinct consecutive days, no gap, no repeat. */
  const dates = posts.map((p) => p.date);
  if (new Set(dates).size !== RUN_DAYS) problems.push('duplicate dates in the run');

  /* The rotation's own guarantee: every topic-close pair exactly once. */
  const pairs = new Set(posts.map((p) => `${p.slug}|${p.close}`));
  if (pairs.size !== RUN_DAYS) problems.push(`${pairs.size} distinct topic-close pairs, expected ${RUN_DAYS}`);

  /* Each close gets exactly 10, each topic exactly 3. */
  for (const c of 'ABC') {
    const n = posts.filter((p) => p.close === c).length;
    if (n !== 10) problems.push(`close ${c} has ${n} posts, expected 10`);
  }
  for (const slug of TOPIC_ORDER) {
    const n = posts.filter((p) => p.slug === slug).length;
    if (n !== 3) problems.push(`${slug} has ${n} posts, expected 3`);
  }

  /* Cover formats balanced 15/15, the property plan.js already refuses to break. */
  const vids = posts.filter((p) => p.format === 'video').length;
  if (vids !== 15) problems.push(`${vids} video covers, expected 15`);

  /* One caption per topic, the same on all three of that topic's posts. This is
   * the rule captions.md exists to protect, so it is asserted and not trusted. */
  for (const slug of TOPIC_ORDER) {
    const texts = new Set(posts.filter((p) => p.slug === slug).map((p) => p.payload.text));
    if (texts.size !== 1) problems.push(`${slug}: caption varies across its three posts`);
  }

  /* The mechanical guarantees captions.md verified at approval. Re-checked here
   * because this is the last point before the copy leaves the repo. */
  for (const p of posts) {
    const t = p.payload.text;
    if (t.includes('—')) problems.push(`day ${p.day}: em dash in caption`);
    if (!t.includes('Link in bio.')) problems.push(`day ${p.day}: caption missing "Link in bio."`);
    if (!t.includes('Education, not medical advice.')) problems.push(`day ${p.day}: caption missing the disclaimer`);
    if (/ashwagandha/i.test(t) || /ashwagandha/i.test(p.payload.firstCommentText)) {
      problems.push(`day ${p.day}: silent ingredient named`);
    }
    const tags = (p.payload.firstCommentText.match(/#\w+/g) || []).length;
    if (tags < 6 || tags > 7) problems.push(`day ${p.day}: ${tags} hashtags, the rail is 6 to 7`);
  }

  /* Exactly one live post, and it is day 1. */
  const liveDays = posts.filter((p) => p.live).map((p) => p.day);
  if (liveDays.length !== 1 || liveDays[0] !== 1) {
    problems.push(`live days are [${liveDays}], expected [1]`);
  }

  return problems;
}

/* ----------------------------------------------------------------- main --- */

const posts = buildRun();
const problems = check(posts);

if (process.argv.includes('--check')) {
  if (problems.length) {
    console.error('FAILED:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(`OK: ${posts.length} posts, ${new Set(posts.map(p => p.slug)).size} topics, day 1 ${posts[0].date} ${LOCAL_HHMM} ${TIMEZONE}`);
  process.exit(0);
}

if (problems.length) {
  console.error('REFUSING to emit a schedule that fails its own checks:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(posts, null, 2));
  process.exit(0);
}

console.log(`\n30-DAY METRICOOL SCHEDULE  (brand "Keith Antony AI", blogId 6693691)\n`);
console.log(`anchor : ${RUN_START_UTC}  ->  ${LOCAL_HHMM} ${TIMEZONE} daily`);
console.log(`assets : Supabase Storage, bucket "content", via media-manifest.json\n`);
console.log('day  date        topic                                    cover  close  state');
for (const p of posts) {
  console.log(
    String(p.day).padEnd(4),
    p.date.padEnd(11),
    p.slug.padEnd(40),
    p.format.padEnd(6),
    p.close.padEnd(6),
    p.live ? 'LIVE' : 'draft'
  );
}
console.log(`\nAll checks pass. ${posts.length} posts, 8 media each, ${posts.length * 8} media references.`);
