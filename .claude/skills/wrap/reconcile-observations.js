#!/usr/bin/env node
/**
 * Observation log <-> ClickUp board reconciliation.
 *
 * WHY THIS EXISTS (Observation 158, 2026-08-05). The mirror convention states its
 * own failure mode in its own words — "an entry that exists in only one of the
 * two is drift, and the drift is invisible from whichever side you happen to be
 * on" — and then relied entirely on each writing session remembering to write
 * both. Nothing compared the two stores. On 2026-08-05 three observations (125,
 * 126, 131) turned out to have no board task at all; 131 had been adrift for two
 * days. None surfaced through a check. They surfaced because a bulk action
 * happened to need every task id and the lookups came back empty.
 *
 * The moment a doc says "an entry in only one of the two is drift", that sentence
 * is the specification for a diff that should exist. Detection is cheap where the
 * records are enumerable; the expensive part was only ever deciding to compare
 * them.
 *
 * The failure this prevents is worse than the drift it detects: had that session
 * actioned only the observations it could find tasks for, 131 would have been
 * marked ACTIONED in the log and stayed absent from the board indefinitely — the
 * log asserting a resolution the board could never show.
 *
 * Usage (run from repo root):
 *   node .claude/skills/wrap/reconcile-observations.js
 *
 * Exit code: 0 both stores agree, 2 drift found, 1 the check could not run.
 * Exit 1 must NEVER be read as a pass — a comparison that did not happen has
 * cleared nothing. This is read-only; it changes neither store.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT = 'd--Androprime-main';
const LIST_ID = '901220039345';
const OBS_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME,
  '.claude', 'projects', PROJECT, 'skill-observations'
);
const LOG = path.join(OBS_DIR, 'log.md');
const ARCHIVE_DIR = path.join(OBS_DIR, 'archive');
const ENV = path.join('andro-prime', '09_website-app', 'frontend', '.env.local');

const RESOLVED = /^(ACTIONED|DECLINED)\b/i;

function die(msg) {
  console.error(`\n🔴 CANNOT RUN: ${msg}`);
  console.error('Exit 1 is not a pass. Nothing was compared, so nothing is cleared.');
  process.exit(1);
}

// ── the log side (active + archive; the active file wins on any duplicate) ────
function readLogSide() {
  if (!fs.existsSync(LOG)) die(`observation log not found at ${LOG}`);
  const status = new Map();
  const files = [LOG];
  if (fs.existsSync(ARCHIVE_DIR)) {
    for (const f of fs.readdirSync(ARCHIVE_DIR)) {
      if (f.endsWith('.md')) files.push(path.join(ARCHIVE_DIR, f));
    }
  }
  // Archives first so the active log overwrites them.
  for (const file of files.slice(1).concat([LOG])) {
    const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const chunks = src.split(/(?=^### Observation \d+:)/m);
    for (const c of chunks) {
      const h = /^### Observation (\d+):/.exec(c);
      if (!h) continue;
      const s = /^\*\*Status:\*\*\s*(.+)$/m.exec(c);
      // A missing Status line counts as OPEN, never as absent — the same rule
      // the weekly review uses, so the two never disagree about the work queue.
      status.set(Number(h[1]), s ? s[1].trim() : 'OPEN (no status line)');
    }
  }
  return status;
}

// ── the board side ───────────────────────────────────────────────────────────
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

function get(url, auth) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: auth } }, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function readBoardSide(auth) {
  const tasks = new Map();   // number -> [{status, name, id}]
  for (let page = 0; page < 50; page++) {
    const url = `https://api.clickup.com/api/v2/list/${LIST_ID}/task?include_closed=true&subtasks=true&page=${page}`;
    const d = await get(url, auth);
    const batch = d.tasks || [];
    if (!batch.length) break;
    for (const t of batch) {
      const m = /^OBS-(\d+)/.exec(t.name);
      if (!m) continue;
      const n = Number(m[1]);
      if (!tasks.has(n)) tasks.set(n, []);
      tasks.get(n).push({ status: t.status.status, name: t.name, id: t.id });
    }
    if (d.last_page) break;
  }
  if (!tasks.size) die('the board returned no OBS-NNN tasks — refusing to report every log entry as drift');
  return tasks;
}

(async () => {
  let auth, log, board;
  try {
    auth = token();
    log = readLogSide();
    board = await readBoardSide(auth);
  } catch (e) {
    die(e.message);
  }

  const logOpen = new Set([...log].filter(([, s]) => !RESOLVED.test(s)).map(([n]) => n));
  const boardOpen = new Set([...board].filter(([, v]) => v.some((t) => t.status === 'to do')).map(([n]) => n));

  const missingOnBoard = [...log.keys()].filter((n) => !board.has(n)).sort((a, b) => a - b);
  const missingInLog = [...board.keys()].filter((n) => !log.has(n)).sort((a, b) => a - b);
  const duplicates = [...board].filter(([, v]) => v.length > 1).map(([n]) => n).sort((a, b) => a - b);
  const mismatched = [...log.keys()]
    .filter((n) => board.has(n) && logOpen.has(n) !== boardOpen.has(n))
    .sort((a, b) => a - b);

  console.log(`LOG   : ${log.size} entries | OPEN ${logOpen.size} | resolved ${log.size - logOpen.size}`);
  const boardCount = [...board.values()].reduce((a, v) => a + v.length, 0);
  console.log(`BOARD : ${boardCount} tasks   | to do ${boardOpen.size} | complete ${boardCount - boardOpen.size}`);

  let drift = 0;
  const report = (label, list, fmt) => {
    if (!list.length) return;
    drift += list.length;
    console.log(`\n🔴 ${label} (${list.length})`);
    for (const n of list) console.log(`   ${fmt(n)}`);
  };

  report('IN THE LOG, MISSING FROM THE BOARD', missingOnBoard,
    (n) => `OBS-${n}  ${log.get(n).slice(0, 60)}  -> create the task`);
  report('ON THE BOARD, MISSING FROM THE LOG', missingInLog,
    (n) => `OBS-${n}  ${board.get(n)[0].name.slice(0, 60)}  -> the log is canonical for TEXT; investigate`);
  report('DUPLICATE BOARD TASKS', duplicates,
    (n) => `OBS-${n}  ${board.get(n).length} tasks: ${board.get(n).map((t) => t.id).join(', ')}`);
  report('STATUS MISMATCH', mismatched,
    (n) => `OBS-${n}  log="${log.get(n).slice(0, 40)}"  board="${board.get(n)[0].status}"`);

  console.log(`\n${'─'.repeat(60)}`);
  if (drift) {
    console.log(`🔴 ${drift} discrepanc${drift === 1 ? 'y' : 'ies'}. An entry in only one of the two stores is drift, and it is invisible from whichever side you are on.`);
    process.exit(2);
  }
  console.log('🟢 The log and the board agree. Both sides compared, nothing assumed.');
  process.exit(0);
})();
