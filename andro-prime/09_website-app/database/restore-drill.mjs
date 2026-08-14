/**
 * Restore drill: prove the database can actually be rebuilt, rather than assuming it.
 *
 *   node restore-drill.mjs --dry            show what it would do, connect to nothing
 *   node restore-drill.mjs                  dump live, restore to a local scratch DB, compare, clean up
 *   node restore-drill.mjs --keep           leave the scratch DB and the dump in place for inspection
 *
 * Needs the LOCAL Postgres password in `LOCAL_PG_PASSWORD` (repo-root .env or real env).
 *
 * PLAN STEP 3.1's UNMET CLAUSE. The done-when is "a backup exists, AND a restore has been tested
 * once rather than assumed". Supabase Pro was bought (the organisation reports plan: pro) and that
 * settled the first half months ago without anyone noticing; nobody has ever tested the second.
 * An untested backup is a belief.
 *
 * WHAT THIS DOES AND DOES NOT PROVE. It proves OUR half: that a dump of production restores into an
 * empty Postgres and comes back complete — every table, view, function, trigger, policy and row
 * accounted for. That is exactly what step 0.1's schema baseline exists for, whose stated reason was
 * that if the backup is what fails, a restore has no schema to restore into.
 *
 * It does NOT prove Supabase's own daily backup restores. That needs their dashboard and a separate
 * project, and conflating the two would be the same mistake as calling a backup tested because a
 * file exists.
 *
 * 🔴 THE DUMP CONTAINS LIVE CUSTOMER DATA — orders, quiz results, biomarker values. Today that is 3
 * users and the practical risk is nil, which is precisely why the handling should be right NOW and
 * not retrofitted at 3,000. So: the dump is written to the OS temp area, never inside the repo (the
 * script refuses), and it is deleted at the end unless --keep is passed. Art 32(1)(d) requires a
 * process for regularly testing the effectiveness of security measures, so running this drill is
 * compliance-supporting; leaving a full copy of health data lying on a laptop afterwards is not.
 *
 * 🔴 CONNECTION: the SESSION POOLER, not what SUPABASE_HOST/PORT in the root .env say. Those are
 * `db.<ref>.supabase.co:6543`, and that pair cannot work here for two independent reasons recorded
 * in 09_website-app/CONTEXT.md: the direct host is IPv6-only and this machine has no IPv6, and 6543
 * is the TRANSACTION pooler, which does not support pg_dump. Only the password is read from .env.
 */
import { execFileSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
const KEEP = argv.includes('--keep')

/* ------------------------------------------------------------------ setup --- */

function repoRoot(from) {
  let dir = path.resolve(from)
  for (;;) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir
    const up = path.dirname(dir)
    if (up === dir) return null
    dir = up
  }
}

function loadEnvFile(p, into) {
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line)
    if (!m) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (into[m[1]] === undefined) into[m[1]] = v
  }
}

const ROOT = repoRoot(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')))
if (!ROOT) { console.error('Not inside a git repo.'); process.exit(1) }
const env = { ...process.env }
loadEnvFile(path.join(ROOT, '.env'), env)
loadEnvFile(path.join(ROOT, 'andro-prime', '09_website-app', 'frontend', '.env.local'), env)

/** Session pooler. See the header: the .env host/port pair cannot serve a dump from this machine. */
const LIVE = {
  host: env.SUPABASE_POOLER_HOST ?? 'aws-0-eu-west-1.pooler.supabase.com',
  port: env.SUPABASE_POOLER_PORT ?? '5432',
  user: env.SUPABASE_POOLER_USER ?? 'postgres.phqrjtnflovicgkngieu',
  db: 'postgres',
  password: env.SUPABASE_PASSWORD,
}
const LOCAL = {
  host: '127.0.0.1', port: '5432', user: env.LOCAL_PG_USER ?? 'postgres',
  password: env.LOCAL_PG_PASSWORD,
}

const PGBIN = env.PG_BIN ?? 'C:/Program Files/PostgreSQL/17/bin'
const bin = (n) => (fs.existsSync(path.join(PGBIN, `${n}.exe`)) ? path.join(PGBIN, `${n}.exe`) : n)

const STAMP = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
const SCRATCH_DB = `restore_drill_${STAMP}`
const DUMP = path.join(os.tmpdir(), `androprime-restore-drill-${STAMP}.dump`)

/* The dump holds customer health data. Refusing to write it into a git working tree is a control,
 * not a tidiness preference: a file inside the repo is one `git add -A` away from being published,
 * and this repo's own rule is that staging is always by explicit path for exactly that reason. */
if (path.resolve(DUMP).toLowerCase().startsWith(path.resolve(ROOT).toLowerCase())) {
  console.error(`REFUSING: the dump path ${DUMP} is inside the repository.`)
  process.exit(1)
}

/* -------------------------------------------------------------- utilities --- */

const run = (cmd, args, password, opts = {}) =>
  execFileSync(cmd, args, {
    encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true,
    env: { ...process.env, PGPASSWORD: password ?? '' }, ...opts,
  })

/** One scalar/row-set out of psql, tab separated, no headers, never prompting for a password. */
function psql(target, sql, dbOverride) {
  const out = run(bin('psql'), [
    '-w', '-h', target.host, '-p', target.port, '-U', target.user,
    '-d', dbOverride ?? target.db, '-At', '-F', '\t', '-c', sql,
  ], target.password)
  return out.trim().split('\n').filter(Boolean).map((l) => l.split('\t'))
}

/**
 * The census a restore has to reproduce.
 *
 * Row counts alone would pass a restore that silently dropped every view, trigger and policy —
 * and the policies are the access control on customer health data, so a "successful" restore that
 * lost them would be worse than a failed one: the data comes back readable by anyone.
 */
const CENSUS_SQL = `
select 'table:'||table_name, (xpath('/row/c/text()',
  query_to_xml(format('select count(*) as c from public.%I', table_name), false, true, '')))[1]::text::bigint
from information_schema.tables where table_schema='public' and table_type='BASE TABLE'
union all select 'object:views',     count(*) from information_schema.views where table_schema='public'
union all select 'object:functions', count(*) from information_schema.routines where routine_schema='public'
union all select 'object:triggers',  count(*) from information_schema.triggers where trigger_schema='public'
union all select 'object:policies',  count(*) from pg_policies where schemaname='public'
union all select 'object:indexes',   count(*) from pg_indexes where schemaname='public'
union all select 'object:rls_on',    count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' and c.relrowsecurity
order by 1`

/* ------------------------------------------------------------------- main --- */

console.log(`restore drill${DRY ? '  [DRY: connects to nothing]' : ''}`)
console.log(`live    : ${LIVE.user}@${LIVE.host}:${LIVE.port}/${LIVE.db}  (session pooler)`)
console.log(`scratch : ${LOCAL.user}@${LOCAL.host}:${LOCAL.port}/${SCRATCH_DB}`)
console.log(`dump    : ${DUMP}${KEEP ? '  [--keep: will NOT be deleted]' : '  (deleted at the end)'}`)
console.log(`pg tools: ${PGBIN}\n`)

if (DRY) { console.log('Dry run: nothing was dumped, created, restored or deleted.'); process.exit(0) }

if (!LIVE.password) { console.error('Missing SUPABASE_PASSWORD in the repo-root .env.'); process.exit(1) }
if (!LOCAL.password) {
  console.error('Missing LOCAL_PG_PASSWORD.\n\nAdd it to the repo-root .env (which is gitignored):\n  LOCAL_PG_PASSWORD=<your local postgres password>')
  process.exit(1)
}

let createdDb = false
try {
  console.log('1/5  census of live...')
  const live = new Map(psql(LIVE, CENSUS_SQL).map(([k, v]) => [k, Number(v)]))
  console.log(`     ${[...live.keys()].filter((k) => k.startsWith('table:')).length} tables, ` +
    `${[...live].filter(([k]) => k.startsWith('table:')).reduce((a, [, v]) => a + v, 0)} rows total`)

  console.log('2/5  dumping live (custom format, whole public schema, data included)...')
  run(bin('pg_dump'), ['-h', LIVE.host, '-p', LIVE.port, '-U', LIVE.user, '-d', LIVE.db,
    '-Fc', '--no-owner', '--no-privileges', '-n', 'public', '-f', DUMP], LIVE.password, { stdio: 'inherit' })
  console.log(`     ${(fs.statSync(DUMP).size / 1048576).toFixed(1)} MB written`)

  console.log(`3/5  creating scratch database ${SCRATCH_DB}...`)
  run(bin('createdb'), ['-w', '-h', LOCAL.host, '-p', LOCAL.port, '-U', LOCAL.user, SCRATCH_DB], LOCAL.password)
  createdDb = true

  console.log('4/5  restoring into the scratch database...')
  try {
    run(bin('pg_restore'), ['-w', '-h', LOCAL.host, '-p', LOCAL.port, '-U', LOCAL.user,
      '-d', SCRATCH_DB, '--no-owner', '--no-privileges', DUMP], LOCAL.password, { stdio: 'pipe' })
  } catch (e) {
    /* pg_restore exits non-zero on warnings that are expected against a plain Postgres — Supabase
     * roles and extensions that do not exist locally. Those are NOT restore failures, and treating
     * them as one would make the drill unpassable; the census below is the real verdict. */
    const msg = `${e.stdout ?? ''}${e.stderr ?? ''}`
    const fatal = msg.split('\n').filter((l) => /error/i.test(l) && !/role|extension|does not exist|already exists/i.test(l))
    console.log(`     pg_restore reported ${msg.split('\n').filter((l) => /error/i.test(l)).length} message(s); ${fatal.length} not attributable to missing Supabase roles/extensions`)
    if (fatal.length) console.log(fatal.slice(0, 10).map((l) => `       ${l}`).join('\n'))
  }

  console.log('5/5  census of the restored copy, compared table by table...\n')
  const restored = new Map(psql(LOCAL, CENSUS_SQL, SCRATCH_DB).map(([k, v]) => [k, Number(v)]))

  const keys = [...new Set([...live.keys(), ...restored.keys()])].sort()
  const bad = []
  for (const k of keys) {
    const a = live.get(k), b = restored.get(k)
    if (a !== b) bad.push({ k, a, b })
  }
  for (const { k, a, b } of bad) {
    console.log(`  ✗ ${k.padEnd(38)} live ${String(a ?? '(absent)').padStart(8)}   restored ${String(b ?? '(absent)').padStart(8)}`)
  }
  console.log(bad.length
    ? `\n🔴 ${bad.length} of ${keys.length} checks differ. The restore is NOT faithful; read the list above before trusting any backup.`
    : `\n🟢 all ${keys.length} checks match: every table, view, function, trigger, policy, index and row came back.`)
  process.exitCode = bad.length ? 1 : 0
} finally {
  if (!KEEP) {
    if (createdDb) {
      try {
        run(bin('psql'), ['-w', '-h', LOCAL.host, '-p', LOCAL.port, '-U', LOCAL.user, '-d', 'postgres',
          '-c', `drop database if exists ${SCRATCH_DB} with (force)`], LOCAL.password)
        console.log(`\ncleanup: dropped ${SCRATCH_DB}`)
      } catch (e) { console.error(`\ncleanup FAILED to drop ${SCRATCH_DB}: ${e.message}`) }
    }
    try {
      if (fs.existsSync(DUMP)) { fs.rmSync(DUMP); console.log(`cleanup: deleted ${DUMP}`) }
    } catch (e) { console.error(`cleanup FAILED to delete the dump at ${DUMP}: ${e.message}`) }
  } else {
    console.log(`\n--keep: ${SCRATCH_DB} and ${DUMP} are still present. The dump contains live customer data; delete it when you are done.`)
  }
}
