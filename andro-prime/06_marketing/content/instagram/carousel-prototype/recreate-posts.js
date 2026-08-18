/*
 * Re-create the scheduled carousel posts from the CURRENT generator, because the ones in the
 * calendar were created with the wrong delivery method and cannot fix themselves.
 *
 *   node recreate-posts.js            dry run: says exactly what it would do, touches nothing
 *   node recreate-posts.js --apply    does it
 *
 * WHY THIS EXISTS. `schedule.js` wrote `autoPublish: live` beside `draft: !live`, conflating the
 * DELIVERY METHOD with the ARM STATE. Every post except day 1 was therefore created as
 * push-notification delivery: Metricool pings a phone at the slot and waits for a human to post by
 * hand. Arming one in the UI sets `draft:false` and leaves the delivery method alone, so it looks
 * scheduled, looks armed, and never reaches Instagram. Day 1 is the only carousel that has ever
 * published and the only one created with `autoPublish: true`.
 *
 * The generator is fixed. A fix to a generator does not reach back into a calendar, so the posts
 * already sitting there have to be replaced.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * THE FOUR RULES THIS FOLLOWS, each one a way it could otherwise cause the damage it is fixing.
 *
 * 1. CREATE BEFORE DELETE, ALWAYS. The new post is created and read back before the old one is
 *    removed, so a failure at any point leaves the calendar with a post rather than a hole. Two
 *    posts briefly share a slot; both are drafts, so nobody sees either.
 *
 * 2. NEVER TOUCH A PUBLISHED POST. Day 1 published on 2026-08-17 and carries real engagement.
 *    It is skipped by day number AND re-checked against its provider status before anything.
 *
 * 3. NEVER RE-CREATE A PAST SLOT. Day 2's slot has already gone by. Creating it again would put a
 *    post in the calendar with a date behind it, which either fires immediately or never. Past
 *    days are skipped and REPORTED so a human decides what happens to that content.
 *
 * 4. CREATE DRAFTS, NEVER ARMED. The standing rule (Keith, 2026-07-31) is that this pipeline
 *    creates drafts and a human flips them. Twelve of the posts being replaced were armed by hand;
 *    that arm state is NOT carried over, because automation arming a post is the exact thing the
 *    rule forbids, and inheriting it would be automation arming a post it just created. Every one
 *    of them is listed at the end as owing a re-arm. If that list is ignored the run goes quiet,
 *    which is the honest cost of the rule and is why the list is the last thing printed.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 *
 * The database rendition rows are re-pointed at the new ids in the same pass. A Metricool id is a
 * per-version token (CONTEXT.md, 2026-08-17): it changes on every write, so anything joining on it
 * breaks the moment this runs unless the rows move with it.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const tag = APPLY ? '[live]' : '[dry]';

/* ------------------------------------------------------------------ env --- */

function loadEnv(p) {
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}
const REPO = path.resolve(__dirname, '../../../../..');
loadEnv(path.join(REPO, 'andro-prime/09_website-app/frontend/.env.local'));
loadEnv(path.join(REPO, '.env'));

/* The carousels live on their OWN Metricool brand, not the default one. Documented in
 * register-carousel-run.ts: the LIST and WRITE endpoints are brand-scoped, and only the
 * single-post GET answers under either. Writing to the wrong brand would create thirty posts on
 * the company account. */
const BLOG = (process.env.METRICOOL_CAROUSEL_BLOG_ID || '6693691').trim();
const USER = process.env.METRICOOL_USER_ID;
const TOKEN = process.env.METRICOOL_USER_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
for (const [k, v] of [['METRICOOL_USER_ID', USER], ['METRICOOL_USER_TOKEN', TOKEN],
  ['NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL], ['SUPABASE_SERVICE_ROLE_KEY', SERVICE_KEY]]) {
  if (!v) throw new Error(`missing env: ${k}`);
}

const q = `blogId=${BLOG}&userId=${encodeURIComponent(USER)}&userToken=${encodeURIComponent(TOKEN)}`;
const MC = 'https://app.metricool.com/api/v2/scheduler/posts';
const H = { 'Content-Type': 'application/json', 'X-Mc-Auth': TOKEN };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --------------------------------------------------------------- inputs --- */

/* The payloads come from the generator itself, run as a child process, so this script cannot
 * drift from it. If schedule.js refuses its own checks it exits non-zero and this stops here. */
function generatorPosts() {
  const out = execFileSync('node', [path.join(__dirname, 'schedule.js'), '--json'], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(out);
}

async function db(pathAndQuery, init) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
      ...(init && init.headers),
    },
  });
  const text = await res.text();
  if (res.status < 200 || res.status >= 300) throw new Error(`supabase ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

/* ----------------------------------------------------------------- main --- */

(async () => {
  const posts = generatorPosts();

  /* Our rendition rows, which hold the id each post is currently known by. Matched on
   * (asset slug, variant): the rotation guarantees every topic-close pair occurs exactly once in
   * thirty days, so that pair is unique and `schedule.js --check` asserts it. */
  const rows = await db(
    'content_renditions?select=id,variant,status,scheduled_for,external_post_id,content_assets!inner(slug)'
    + '&platform=eq.instagram&format=eq.carousel');
  const byKey = new Map(rows.map((r) => [`${r.content_assets.slug}|${r.variant}`, r]));

  const now = new Date();
  const plan = [];
  for (const p of posts) {
    const key = `carousel-${p.slug}|${p.close}`;
    const row = byKey.get(key);
    const slotUtc = new Date(`${p.date}T12:00:00Z`); // 13:00 Europe/London through the whole run
    let skip = null;
    if (p.day === 1) skip = 'day 1 PUBLISHED on 2026-08-17 and carries real engagement';
    else if (!row) skip = 'no rendition row in the database for this topic-close pair';
    else if (row.status === 'published' || row.status === 'measured') skip = `rendition is ${row.status}`;
    else if (slotUtc <= now) skip = `slot ${p.date} has already passed`;
    plan.push({ post: p, row, key, slotUtc, skip });
  }

  const doing = plan.filter((x) => !x.skip);
  const skipped = plan.filter((x) => x.skip);

  console.log(`\n${tag} re-create the carousel run from the fixed generator`);
  console.log(`      brand ${BLOG} · ${doing.length} to replace · ${skipped.length} skipped\n`);
  for (const s of skipped) {
    console.log(`  SKIP  day ${String(s.post.day).padStart(2)}  ${s.post.date}  ${s.key.padEnd(48)} ${s.skip}`);
  }
  if (skipped.length) console.log('');

  /* Guard rule 2, checked against Metricool rather than against our own day numbering: anything
   * whose provider says it published is never deleted, whatever the plan thinks. */
  for (const d of doing) {
    if (!d.row.external_post_id) continue;
    const res = await fetch(`${MC}/${d.row.external_post_id}?${q}`);
    if (res.status === 404) { d.oldMissing = true; continue; }
    const body = JSON.parse(await res.text()).data || {};
    const provider = (body.providers || [])[0] || {};
    d.oldAutoPublish = body.autoPublish;
    d.oldDraft = body.draft;
    if (provider.publicUrl) {
      d.skip = `Metricool says it PUBLISHED at ${provider.publicUrl}`;
      console.log(`  SKIP  day ${String(d.post.day).padStart(2)}  ${d.skip}`);
    }
    await sleep(120);
  }
  const live = doing.filter((x) => !x.skip);

  let created = 0, deleted = 0, repointed = 0;
  const owedRearm = [];
  for (const d of live) {
    const { post, row } = d;
    const label = `day ${String(post.day).padStart(2)}  ${post.date}  ${d.key}`;
    if (d.oldDraft === false) owedRearm.push(`${post.date}  ${d.key}`);

    if (!APPLY) {
      console.log(`  PLAN  ${label}`);
      console.log(`          old ${row.external_post_id || '(none)'}  autoPublish=${d.oldAutoPublish}  draft=${d.oldDraft}`);
      console.log(`          new payload autoPublish=${post.payload.autoPublish}  draft=${post.payload.draft}  media=${post.payload.media.length}`);
      continue;
    }

    // 1. CREATE first. A failure here leaves the old post exactly where it was.
    const cRes = await fetch(`${MC}?${q}`, { method: 'POST', headers: H, body: JSON.stringify(post.payload) });
    const cText = await cRes.text();
    if (cRes.status < 200 || cRes.status >= 300) throw new Error(`${label}: create failed HTTP ${cRes.status}: ${cText.slice(0, 300)}`);
    const newId = String((JSON.parse(cText).data || {}).id || '');
    if (!newId) throw new Error(`${label}: create returned no id: ${cText.slice(0, 300)}`);
    created++;

    // 2. READ BACK. The whole point of the exercise is one flag, so it is verified rather than
    //    assumed: a create that silently dropped it would reproduce the original bug exactly.
    const vRes = await fetch(`${MC}/${newId}?${q}`);
    const v = JSON.parse(await vRes.text()).data || {};
    if (v.autoPublish !== true) {
      throw new Error(`${label}: new post ${newId} came back autoPublish=${v.autoPublish}. Stopping with the old post intact.`);
    }

    // 3. DELETE the old one, only now.
    if (row.external_post_id && !d.oldMissing) {
      const dRes = await fetch(`${MC}/${row.external_post_id}?${q}`, { method: 'DELETE', headers: H });
      if (dRes.status >= 200 && dRes.status < 300) deleted++;
      else console.log(`  WARN  ${label}: old post ${row.external_post_id} delete returned HTTP ${dRes.status}`);
    }

    // 4. Re-point the rendition row. An id is a per-version token; leaving the old one behind
    //    breaks I3, the metrics join and the writeback, all silently.
    await db(`content_renditions?id=eq.${row.id}`, {
      method: 'PATCH', body: JSON.stringify({ external_post_id: newId }),
    });
    repointed++;

    console.log(`  DONE  ${label}  ${row.external_post_id || '(none)'} -> ${newId}  autoPublish=true draft=${v.draft}`);
    await sleep(250);
  }

  console.log(`\n${tag} ${created} created, ${deleted} old deleted, ${repointed} rendition row(s) re-pointed.`);
  if (!APPLY) console.log('[dry] nothing was written. Re-run with --apply.\n');

  if (owedRearm.length) {
    console.log(`\n🔴 ${owedRearm.length} POST(S) WERE ARMED AND ARE NOW DRAFTS AGAIN. They will NOT go out until`);
    console.log('   they are armed in Metricool. This pipeline does not arm posts, by standing rule:\n');
    for (const r of owedRearm) console.log(`     ${r}`);
    console.log('');
  }
})().catch((e) => {
  console.error(`\n${tag} STOPPED: ${e.message}`);
  console.error('Nothing after this point ran. Create-before-delete means the calendar still holds a post for every slot.\n');
  process.exit(1);
});
