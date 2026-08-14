/*
 * Remove published media from the Supabase `content` bucket.
 *
 *   node unpublish-media.js --list                        what is in the bucket
 *   node unpublish-media.js --prefix brain-fog/           dry by default: shows what would go
 *   node unpublish-media.js --prefix brain-fog/ --yes     actually delete
 *   node unpublish-media.js --orphans                     everything NOT named by the manifest
 *
 * WHY THIS EXISTS (plan step 3.6). This is step 4 of the takedown path in
 * 03_compliance/CONTEXT.md — "pulling a retracted claim from every copy of it". Deleting the
 * origin is the only part of that path we can do ourselves in one command, and a procedure whose
 * steps are hand-typed curl calls is a procedure that gets done differently each time, under
 * exactly the time pressure that makes mistakes.
 *
 * 🔴 DELETING FROM HERE DOES NOT UNPUBLISH ANYTHING. Metricool re-hosts every asset to its own CDN
 * at schedule time (confirmed: all thirty scheduled posts reference static.metricool.com/planner/…).
 * This removes the ORIGIN. The live post, the scheduled post and Metricool's copy are steps 1, 2
 * and 3 of that procedure and none of them is touched by this script. Read the table before you
 * run it, and do the public-facing steps FIRST.
 *
 * DRY BY DEFAULT. `--yes` is required to delete, because the destructive reading of a wrong
 * `--prefix` is silent: it removes what it matched and reports success.
 */

const fs = require('fs');
const path = require('path');

function loadEnvFile(p) {
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

function repoRoot(from) {
  let dir = path.resolve(from);
  for (;;) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

const ROOT = repoRoot(__dirname);
const FRONTEND = path.join(ROOT, 'andro-prime', '09_website-app', 'frontend');
loadEnvFile(path.join(FRONTEND, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));

const BUCKET = 'content';
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MANIFEST = path.join(__dirname, 'media-manifest.json');

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => (has(f) ? argv[argv.indexOf(f) + 1] : undefined);

const LIST = has('--list');
const ORPHANS = has('--orphans');
const PREFIX = val('--prefix');
const YES = has('--yes');

if (!LIST && !ORPHANS && !PREFIX) {
  console.error('Usage: node unpublish-media.js (--list | --orphans | --prefix <p>) [--yes]');
  process.exit(1);
}
if (!URL_BASE || !KEY) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.'); process.exit(1); }

const auth = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

/** One level of the bucket. Supabase returns directories as rows with a null id. */
async function listAt(prefix) {
  const res = await fetch(`${URL_BASE}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ prefix, limit: 1000, sortBy: { column: 'name', order: 'asc' } }),
  });
  if (!res.ok) throw new Error(`list ${prefix || '(root)'}: ${res.status} ${await res.text()}`);
  return res.json();
}

/** Every object path in the bucket, one directory level deep, which is all the convention has. */
async function allObjects() {
  const out = [];
  for (const dir of (await listAt('')).filter((o) => o.id === null)) {
    for (const f of await listAt(`${dir.name}/`)) {
      if (f.id !== null) out.push({ path: `${dir.name}/${f.name}`, size: f.metadata && f.metadata.size });
    }
  }
  return out;
}

function manifestPaths() {
  if (!fs.existsSync(MANIFEST)) return new Set();
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const s = new Set();
  for (const deck of Object.keys(m)) for (const name of Object.keys(m[deck])) s.add(m[deck][name].path);
  return s;
}

(async () => {
  const objects = await allObjects();
  console.log(`bucket : ${BUCKET} at ${URL_BASE}`);
  console.log(`objects: ${objects.length}\n`);

  if (LIST) {
    for (const o of objects) console.log(`  ${o.path}${o.size ? `  (${o.size} bytes)` : ''}`);
    return;
  }

  let victims;
  if (ORPHANS) {
    const known = manifestPaths();
    victims = objects.filter((o) => !known.has(o.path));
    console.log(`manifest names ${known.size} object(s); ${victims.length} in the bucket are not among them.`);
    console.log('An orphan is what doctor invariant I11 alarms on: something is in a PUBLIC bucket');
    console.log('that no recipe in this repo accounts for.\n');
  } else {
    victims = objects.filter((o) => o.path.startsWith(PREFIX));
    console.log(`prefix "${PREFIX}" matches ${victims.length} object(s).\n`);
  }

  for (const v of victims) console.log(`  ${YES ? 'DELETE' : 'would delete'}  ${v.path}`);
  if (!victims.length) return;

  if (!YES) {
    console.log(`\nNothing deleted. Re-run with --yes to remove these ${victims.length} object(s).`);
    console.log('Remember: this removes the ORIGIN only. Steps 1 to 3 of the takedown path');
    console.log('(the live post, the scheduled post, Metricool\'s CDN) are not touched by this.');
    return;
  }

  const res = await fetch(`${URL_BASE}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE', headers: auth, body: JSON.stringify({ prefixes: victims.map((v) => v.path) }),
  });
  if (!res.ok) throw new Error(`delete: ${res.status} ${await res.text()}`);
  console.log(`\n${victims.length} object(s) deleted.`);
})().catch((e) => { console.error(`\n${e.message}`); process.exit(1); });
