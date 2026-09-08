#!/usr/bin/env node
/**
 * Mark observations ACTIONED / DECLINED in BOTH stores, in one pass.
 *
 * WHY THIS EXISTS. The mirror convention says "write both, in the same pass",
 * and the only mechanism behind it was each session remembering to. That works
 * for one entry and collapses for ninety: a review that closes a whole cluster
 * either spends ninety separate board calls or quietly updates one store, and
 * `reconcile-observations.js` then reports drift the review itself created.
 * A destructive-looking bulk edit done by hand is evidence the operation
 * deserved a tool (cross-cutting principle P20).
 *
 * It follows the task-observer log-write safety sequence, which exists because a
 * greedy pattern over this file once overwrote sixteen entries:
 *   · back the log up before touching it
 *   · RE-READ the live log immediately before writing, never a snapshot
 *   · mutate one bounded entry at a time, line-anchored, never across entries
 *   · assert the `### Observation` header count is unchanged
 *   · verify every target's status actually changed, and report any that did not
 *
 * The board is updated only for entries whose LOG write succeeded, and the log
 * is written only after the board write is attempted, so the failure mode is a
 * reported mismatch rather than a log asserting a resolution the board can never
 * show — which is the specific failure reconcile-observations.js was built for.
 *
 * Usage (from repo root):
 *   node .claude/skills/wrap/resolve-observations.js <plan.json>            # dry run
 *   node .claude/skills/wrap/resolve-observations.js <plan.json> --apply
 *   node .claude/skills/wrap/resolve-observations.js <plan.json> --apply --log-only
 *
 * plan.json:  { "287": "ACTIONED (2026-09-08) — Applied to <where>: <what>", … }
 * The value is the WHOLE status line after `**Status:** `, so it carries its own
 * date. Archival is gated on that date, and a dateless mark breaks the
 * cross-session grace period.
 *
 * Exit: 0 everything agreed, 1 could not run, 2 some entries did not update.
 * Exit 1 is never a pass.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT = 'd--Androprime-main';
const LIST_ID = '901220039345';
const OBS_DIR = path.join(process.env.USERPROFILE || process.env.HOME, '.claude', 'projects', PROJECT, 'skill-observations');
const LOG = path.join(OBS_DIR, 'log.md');
const ENV = path.join('andro-prime', '09_website-app', 'frontend', '.env.local');

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const LOG_ONLY = argv.includes('--log-only');
// Repair mode: the log is already marked and the board is not. This is the state
// a rate-limited run leaves behind, and without it the only way back is by hand.
const BOARD_ONLY = argv.includes('--board-only');
const planPath = argv.find((a) => !a.startsWith('--'));

function die(msg) {
  console.error(`\n🔴 CANNOT RUN: ${msg}`);
  console.error('Exit 1 is not a pass. Nothing was changed.');
  process.exit(1);
}

if (!planPath) die('give me a plan JSON: { "<obs number>": "<full status line>" }');
if (!fs.existsSync(planPath)) die(`plan not found: ${planPath}`);
if (!fs.existsSync(LOG)) die(`observation log not found at ${LOG}`);

let plan;
try { plan = JSON.parse(fs.readFileSync(planPath, 'utf8')); } catch (e) { die(`plan is not valid JSON: ${e.message}`); }
const numbers = Object.keys(plan).map(Number).sort((a, b) => a - b);
if (!numbers.length) die('the plan is empty');
for (const n of numbers) {
  if (!/^(ACTIONED|DECLINED) \(\d{4}-\d{2}-\d{2}\) —/.test(plan[String(n)])) {
    die(`#${n}: a status must read "ACTIONED (YYYY-MM-DD) — …" or "DECLINED (YYYY-MM-DD) — …". Archival is gated on that date.`);
  }
}

// ── log side ────────────────────────────────────────────────────────────────
// Split on the header so an edit can never reach past its own entry.
function splitEntries(text) {
  const chunks = text.split(/(?=^### Observation \d+:)/m);
  return chunks.map((c) => {
    const h = /^### Observation (\d+):/.exec(c);
    return { n: h ? Number(h[1]) : null, text: c };
  });
}

const countHeaders = (t) => (t.match(/^### Observation \d+:/gm) || []).length;

function rewriteLog(live) {
  const entries = splitEntries(live);
  const present = new Set(entries.filter((e) => e.n !== null).map((e) => e.n));
  const missing = numbers.filter((n) => !present.has(n));
  const already = [];
  const changed = [];

  const out = entries.map((e) => {
    if (e.n === null || !(String(e.n) in plan)) return e.text;
    const cur = /^\*\*Status:\*\*\s*(.+)$/m.exec(e.text);
    if (!cur) return e.text;                       // no status line; leave it, report below
    if (/^(ACTIONED|DECLINED)\b/.test(cur[1].trim())) { already.push(e.n); return e.text; }
    // Line-anchored: `^…$` under /m cannot cross a newline, so this touches one
    // physical line inside one already-isolated entry.
    changed.push(e.n);
    return e.text.replace(/^\*\*Status:\*\*.*$/m, `**Status:** ${plan[String(e.n)]}`);
  }).join('');

  const statusless = numbers.filter((n) => {
    const e = entries.find((x) => x.n === n);
    return e && !/^\*\*Status:\*\*/m.test(e.text);
  });
  return { out, missing, already, changed, statusless };
}

// ── board side ──────────────────────────────────────────────────────────────
function token() {
  if (!fs.existsSync(ENV)) die(`${ENV} not found — run from the repo root`);
  for (const line of fs.readFileSync(ENV, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('CLICKUP_API_TOKEN')) {
      const t = line.split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (t) return t;
    }
  }
  die('CLICKUP_API_TOKEN not present in the env file');
}

// ClickUp allows ~100 requests a minute and answers 429 for the rest. A 91-entry
// batch is 182 writes, so an unclamped run half-succeeds and leaves the log
// asserting resolutions the board cannot show — which is precisely the drift
// this script exists to avoid, produced by the script itself. Measured on the
// first real run: 43 of 91 succeeded before the wall. Clamp at the source and
// isolate per-item failures rather than retrying the whole batch (P27).
const MIN_GAP_MS = 750;
let lastCall = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function throttle() {
  const wait = MIN_GAP_MS - (Date.now() - lastCall);
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
}

async function reqRetry(method, url, auth, body, tries = 4) {
  for (let attempt = 1; ; attempt++) {
    await throttle();
    try { return await req(method, url, auth, body); } catch (e) {
      const rateLimited = /HTTP 429/.test(e.message);
      if (!rateLimited || attempt >= tries) throw e;
      const back = 5000 * attempt;
      process.stdout.write(`  (429, waiting ${back / 1000}s) `);
      await sleep(back);
    }
  }
}

function req(method, url, auth, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const u = new URL(url);
    const r = https.request({
      method, hostname: u.hostname, path: u.pathname + u.search,
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, (res) => {
      let b = '';
      res.on('data', (d) => { b += d; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error(`HTTP ${res.statusCode}: ${b.slice(0, 200)}`));
        try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function boardTasks(auth) {
  const tasks = new Map();
  for (let page = 0; page < 50; page++) {
    const d = await req('GET', `https://api.clickup.com/api/v2/list/${LIST_ID}/task?include_closed=true&subtasks=true&page=${page}`, auth);
    const batch = d.tasks || [];
    if (!batch.length) break;
    for (const t of batch) {
      const m = /^OBS-(\d+)/.exec(t.name);
      if (!m) continue;
      const n = Number(m[1]);
      if (!tasks.has(n)) tasks.set(n, []);
      tasks.get(n).push({ id: t.id, status: t.status.status, name: t.name });
    }
    if (d.last_page) break;
  }
  if (!tasks.size) die('the board returned no OBS-NNN tasks — refusing to act on an empty read');
  return tasks;
}

// ── run ─────────────────────────────────────────────────────────────────────
(async () => {
  const live0 = fs.readFileSync(LOG, 'utf8');
  const preview = rewriteLog(live0);
  // In repair mode the work list is the entries the log ALREADY carries — the
  // ones a normal run would skip.
  if (BOARD_ONLY) { preview.changed = preview.already.slice(); preview.already = []; }

  console.log(`plan: ${numbers.length} entr${numbers.length === 1 ? 'y' : 'ies'}${BOARD_ONLY ? '  [board-only repair]' : ''}`);
  if (preview.missing.length) console.log(`  NOT IN LOG (${preview.missing.length}): ${preview.missing.join(', ')}`);
  if (preview.already.length) console.log(`  already resolved, left alone (${preview.already.length}): ${preview.already.join(', ')}`);
  if (preview.statusless.length) console.log(`  NO STATUS LINE (${preview.statusless.length}): ${preview.statusless.join(', ')} — fix by hand`);
  console.log(`  would change in the log: ${preview.changed.length}`);

  let auth = null;
  let board = null;
  if (!LOG_ONLY) {
    try { auth = token(); board = await boardTasks(auth); } catch (e) { die(e.message); }
    if (BOARD_ONLY) {
      // Only the tasks the board has NOT already moved. Re-sending a completed
      // one would post a duplicate resolution comment on every entry the first
      // run got through, which is the wrong kind of idempotence.
      const before = preview.changed.length;
      preview.changed = preview.changed.filter((n) => (board.get(n) || []).some((t) => t.status !== 'complete'));
      console.log(`  board already complete for ${before - preview.changed.length}, repairing ${preview.changed.length}`);
    }
    const noTask = preview.changed.filter((n) => !board.has(n));
    const dup = preview.changed.filter((n) => (board.get(n) || []).length > 1);
    if (noTask.length) console.log(`  NO BOARD TASK (${noTask.length}): ${noTask.join(', ')} — these would leave the log asserting a resolution the board cannot show`);
    if (dup.length) console.log(`  DUPLICATE BOARD TASKS (${dup.length}): ${dup.join(', ')}`);
  }

  if (!APPLY) { console.log('\ndry run — pass --apply to write.'); process.exit(0); }

  // Board first: a failed board write must not leave the log claiming a
  // resolution the board can never show.
  const boardDone = new Set();
  const boardFailed = [];
  if (!LOG_ONLY) {
    for (const n of preview.changed) {
      const tasks = board.get(n) || [];
      if (!tasks.length) { boardFailed.push(`${n} (no task)`); continue; }
      try {
        for (const t of tasks) {
          if (t.status !== 'complete') await reqRetry('PUT', `https://api.clickup.com/api/v2/task/${t.id}`, auth, { status: 'complete' });
          await reqRetry('POST', `https://api.clickup.com/api/v2/task/${t.id}/comment`, auth,
            { comment_text: plan[String(n)], notify_all: false });
        }
        boardDone.add(n);
      } catch (e) { boardFailed.push(`${n} (${e.message.slice(0, 60)})`); }
    }
    console.log(`\nboard: ${boardDone.size} updated, ${boardFailed.length} failed`);
    if (boardFailed.length) console.log(`  failed: ${boardFailed.join(', ')}`);
  }

  if (BOARD_ONLY) {
    const left = preview.changed.filter((n) => !boardDone.has(n));
    console.log(left.length ? `\n🟠 still not on the board: ${left.join(', ')}` : '\nboard now agrees with the log for every planned entry.');
    process.exit(left.length ? 2 : 0);
  }

  // Backup, then RE-READ live and rebuild — never write back a snapshot.
  const bak = `${LOG}.bak-resolve-${new Date().toISOString().slice(0, 10)}`;
  fs.copyFileSync(LOG, bak);
  const live = fs.readFileSync(LOG, 'utf8');
  if (live !== live0) console.log('NOTE: the log changed since the preview — rebuilding from the live read');
  const final = rewriteLog(live);

  const before = countHeaders(live);
  const after = countHeaders(final.out);
  if (before !== after) die(`INVARIANT FAIL: header count ${before} -> ${after}. Nothing written. Backup at ${path.basename(bak)}`);

  fs.writeFileSync(LOG, final.out);

  // Verify from disk, not from the string we just built.
  const verify = fs.readFileSync(LOG, 'utf8');
  const entries = splitEntries(verify);
  const notApplied = [];
  for (const n of final.changed) {
    const e = entries.find((x) => x.n === n);
    const s = e && /^\*\*Status:\*\*\s*(.+)$/m.exec(e.text);
    if (!s || s[1].trim() !== plan[String(n)]) notApplied.push(n);
  }
  console.log(`log: ${final.changed.length - notApplied.length} entries marked, header count ${after} unchanged, backup ${path.basename(bak)}`);
  if (notApplied.length) console.log(`  DID NOT APPLY: ${notApplied.join(', ')}`);

  const mismatch = LOG_ONLY ? [] : final.changed.filter((n) => !boardDone.has(n));
  if (mismatch.length) {
    console.log(`\n🟠 ${mismatch.length} entr${mismatch.length === 1 ? 'y is' : 'ies are'} now resolved in the log and NOT on the board: ${mismatch.join(', ')}`);
    console.log('Run reconcile-observations.js and fix before this is read as agreement.');
  }
  process.exit(notApplied.length || mismatch.length || preview.missing.length ? 2 : 0);
})().catch((e) => die(e.message));
