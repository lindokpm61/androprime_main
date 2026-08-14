/*
 * Publish rendered media to Supabase Storage and record where it landed.
 *
 *   node publish-media.js --all                 upload every deck's publish set
 *   node publish-media.js --deck brain-fog      one deck
 *   node publish-media.js --all --dry           resolve and print, upload nothing
 *   node publish-media.js --all --from ../x     take the publish set from somewhere else
 *   node publish-media.js --all --prefix carousel-
 *
 * WHY THIS EXISTS (plan step 3.4, gate D3 ruled 2026-08-14). Rendered media was being committed
 * to `frontend/public/carousel/` and served from our own domain. Binaries are already 56% of git
 * history in about three months with no video shot yet, and the 110 carousel files are content,
 * not site chrome. D3's rule: git holds the recipe, Storage holds what a machine publishes from.
 *
 * THIS SCRIPT IS THE STEP THAT WAS NEVER WRITTEN DOWN. The README documents build -> render ->
 * png/<slug>/. Getting those files into `frontend/public/carousel/<slug>/` under different names
 * was a manual copy nobody recorded, which is why the publish set and the render output disagree
 * about what a file is called. This script does not guess at that rename: it takes the assembled
 * publish set as its input and makes the upload reproducible. Fixing the rename belongs upstream,
 * in the renderer, and is not in this step.
 *
 * PATH CONVENTION: <asset-slug>/<name>-<sha256[0:8]>.<ext>
 *
 * THE FIRST SEGMENT IS THE ASSET SLUG, NOT THE DECK SLUG, and `--prefix` is what reconciles them.
 * A deck directory here is `brain-fog`; the content asset it produces is `carousel-brain-fog`. The
 * bucket holds what the machine publishes, and the machine's unit is the asset, so doctor invariant
 * I11 can ask the question that actually matters — does every object in this public bucket belong
 * to something we know about? — by exact match rather than by a fuzzy suffix rule that would rot.
 * It also lines the paths up with `content_media` (plan step 6.2) before anything depends on them.
 *
 * The hash is the embargo, not cache-busting. Slugs are published in the content queue and the run
 * calendar, so `<slug>/slide-03.png` is guessable by anyone reading the plan, and thirty carousels
 * sit in the bucket for up to thirty days before their slot. Anonymous listing is already denied by
 * the bucket having no RLS select policy; the hash closes the guess. It also makes re-publishing
 * idempotent: identical bytes resolve to the identical URL, and changed bytes cannot silently
 * occupy the old one.
 *
 * The manifest IS the recipe and it IS committed. The media is not.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* ----------------------------------------------------------------- env --- */

/* Same layering as scripts/content-engine/_shared.ts, and for the same reason: app + Supabase
 * credentials live in frontend/.env.local, tooling credentials at the repo root. Never overwrite
 * an already-set variable, so real env beats both files. */
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
if (!ROOT) { console.error('Not inside a git repo; cannot locate credentials.'); process.exit(1); }
const FRONTEND = path.join(ROOT, 'andro-prime', '09_website-app', 'frontend');
loadEnvFile(path.join(FRONTEND, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));

const BUCKET = 'content';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/* --------------------------------------------------------------- inputs --- */

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => (has(f) ? argv[argv.indexOf(f) + 1] : undefined);

const DRY = has('--dry');
const deckArg = val('--deck');
const fromArg = val('--from');
/* Prepended to the deck slug to form the object's first path segment. Empty is legal and means
 * "the deck slug already IS the asset slug", which is what a non-carousel lane will want. */
const PREFIX = val('--prefix') || '';

if (!has('--all') && !deckArg) {
  console.error('Usage: node publish-media.js (--all | --deck <slug>) [--dry] [--from <dir>]');
  process.exit(1);
}

/* Default source is the assembled publish set. `--from` exists so the renderer can point here
 * directly once the rename moves upstream. */
const SRC_ROOT = fromArg
  ? path.resolve(process.cwd(), fromArg)
  : path.join(FRONTEND, 'public', 'carousel');

const MANIFEST = path.join(__dirname, 'media-manifest.json');

/* Only what the bucket's mime allowlist admits. A file this map does not know is a REFUSAL rather
 * than an upload with a guessed type: the bucket refuses application/pdf with 415, and the way to
 * keep that control meaningful is to never send a type we are unsure of. */
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4' };

/* -------------------------------------------------------------- resolve --- */

function decks() {
  if (deckArg) return [deckArg];
  if (!fs.existsSync(SRC_ROOT)) return [];
  return fs.readdirSync(SRC_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function filesFor(slug) {
  const dir = path.join(SRC_ROOT, slug);
  if (!fs.existsSync(dir)) throw new Error(`no publish set at ${dir}`);
  return fs.readdirSync(dir)
    .filter((f) => MIME[path.extname(f).toLowerCase()])
    .sort()
    .map((f) => {
      const full = path.join(dir, f);
      const bytes = fs.readFileSync(full);
      const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
      const ext = path.extname(f).toLowerCase();
      const objectPath = `${PREFIX}${slug}/${path.basename(f, path.extname(f))}-${sha256.slice(0, 8)}${ext}`;
      return {
        name: f, full, sha256, size: bytes.length, ext,
        mime: MIME[ext],
        path: objectPath,
        url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`,
      };
    });
}

/* ------------------------------------------------------------- transfer --- */

async function upload(file) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${file.path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': file.mime,
      /* Content-addressed, so an existing object at this path already holds these exact bytes.
       * Overwriting is therefore a no-op by definition, and upsert keeps a re-run from failing
       * on 409 for work it does not need to redo. */
      'x-upsert': 'true',
    },
    body: fs.readFileSync(file.full),
  });
  if (!res.ok) throw new Error(`upload ${file.path}: ${res.status} ${await res.text()}`);
}

/* The done-when for this step is "the assets resolve over the CDN", so verify by FETCHING rather
 * than by trusting the 200 from the upload. Unauthenticated on purpose: that is exactly what
 * Metricool does at schedule time, and a bucket that had quietly stopped being public would still
 * accept every upload. */
async function verify(file) {
  const res = await fetch(file.url, { method: 'GET', headers: { Range: 'bytes=0-0' } });
  if (!res.ok) throw new Error(`verify ${file.path}: fetched ${res.status} anonymously`);
  const total = Number((res.headers.get('content-range') || '').split('/')[1]);
  if (Number.isFinite(total) && total !== file.size) {
    throw new Error(`verify ${file.path}: served ${total} bytes, local file is ${file.size}`);
  }
}

/* ----------------------------------------------------------------- main --- */

(async () => {
  const slugs = decks();
  if (!slugs.length) { console.error(`No decks found under ${SRC_ROOT}`); process.exit(1); }

  console.log(`source : ${SRC_ROOT}`);
  console.log(`bucket : ${BUCKET} at ${SUPABASE_URL || '(no NEXT_PUBLIC_SUPABASE_URL)'}`);
  console.log(`prefix : ${PREFIX || '(none)'}`);
  console.log(`decks  : ${slugs.length}${DRY ? '   [DRY: nothing will be uploaded]' : ''}\n`);

  if (!DRY && (!SUPABASE_URL || !SERVICE_KEY)) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  let uploaded = 0, unchanged = 0, count = 0;

  for (const slug of slugs) {
    const files = filesFor(slug);
    manifest[slug] = manifest[slug] || {};
    for (const f of files) {
      count++;
      const prior = manifest[slug][f.name];
      /* BOTH must match. Comparing the hash alone would call a file "unchanged" when its bytes are
       * the same but its object path has moved (a changed --prefix), so the new path would never
       * be written and the manifest would keep pointing at the old one. */
      const same = prior && prior.sha256 === f.sha256 && prior.path === f.path;
      if (DRY) {
        console.log(`  ${same ? 'unchanged' : 'WOULD PUT'}  ${f.path}`);
        continue;
      }
      if (same) {
        /* Verify anyway. The manifest says we uploaded it once; only a fetch says it is still
         * there. An object deleted out of the bucket would otherwise be invisible to every
         * subsequent run of this script. */
        await verify(f);
        unchanged++;
      } else {
        await upload(f);
        await verify(f);
        uploaded++;
        console.log(`  PUT  ${f.path}`);
      }
      manifest[slug][f.name] = { path: f.path, url: f.url, sha256: f.sha256, bytes: f.size };
    }
  }

  if (DRY) {
    console.log(`\n${count} file(s) resolved across ${slugs.length} deck(s). Nothing uploaded.`);
    return;
  }

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`\n${uploaded} uploaded, ${unchanged} already present and re-verified, ${count} total.`);
  console.log(`manifest: ${path.relative(ROOT, MANIFEST).replace(/\\/g, '/')}`);
})().catch((e) => { console.error(`\n${e.message}`); process.exit(1); });
