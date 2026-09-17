#!/usr/bin/env node
/**
 * Approval register <-> ClickUp Approvals & Sign-offs board reconciliation.
 *
 * WHY THIS EXISTS (2026-09-17). On 2026-07-31 Keith reversed the direction of the
 * approvals mirror: commit 37fe6e1, "ClickUp is the approvals hub, the repo is the
 * copy". Nothing has ever compared the two stores, so the convention has been a
 * promise. The observations board uses the identical convention and reconciles clean,
 * and the only difference is that it has a script like this one. Detection is cheap
 * where the records are enumerable; the expensive part was only ever deciding to
 * compare them.
 *
 * 🔴 THE FINDING THAT PROMPTED IT WAS ITSELF WRONG, TWICE, AND THAT IS THE LESSON
 * THIS FILE IS REALLY FOR. A session reported that CA-050 had reached the register
 * with no board task (true), then that **41 approved CAs existed only in the repo**
 * (false — the listing passed no `include_closed`, and an approved CA is a CLOSED
 * task), then that **CA-039 had no task anywhere** (false — the CA sequence spans TWO
 * boards and CA-039 is on the other one). Three false absences in one session, all one
 * shape: **a scoped enumeration reported as a property of the world.**
 *
 * So the value of this script is not that it counts. It is that it enumerates what it
 * excluded: both boards, closed, archived and subtasks, every filter written down
 * rather than defaulted. An absence is only established when the query that produced
 * it can say what it left out.
 *
 * 🔴 WHAT WOULD MAKE REAL DRIFT WORSE THAN ORDINARY DRIFT. The convention says to
 * answer every "is this signed off?" question from the board first. Any CA genuinely
 * absent from both boards returns nothing to that question, and nothing reads as "not
 * approved". **A mirror that silently stops mirroring turns its own precedence rule
 * into a source of false negatives**, and the more faithfully someone follows the
 * rule, the more wrong they get. That is the state this exists to detect, and as of
 * 2026-09-17 the register and the boards agree on all 50 rows.
 *
 * Usage (run from repo root):
 *   node .claude/skills/wrap/reconcile-approvals.js
 *
 * Exit code: 0 both stores agree, 2 drift found, 1 the check could not run.
 * Exit 1 must NEVER be read as a pass — a comparison that did not happen has
 * cleared nothing. This is read-only; it changes neither store.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * 🔴 THERE ARE TWO APPROVAL BOARDS AND ONE CA SEQUENCE, AND READING ONE OF THEM
 * PRODUCES FALSE ABSENCES.
 *
 * `content-approval/README.md` states it outright: "The CA numbering is one sequence
 * across both approval boards. The board decides WHERE it gets signed, never what it
 * is called: CA-039 sits on the Keith-only list and CA-040 on Approvals & Sign-offs,
 * and both mirror into the same register."
 *
 * The first version of this script read only `901219880207` and reported CA-039 as
 * having no task at all. It has one, `869ek4a8y`, on the Rules & Procedures board,
 * named in its own register row. **Second false absence in one session from the same
 * cause**: a listing whose scope omits a population, reported as the population not
 * existing. The first was closed tasks; this one was a whole board. The rule that
 * covers both: an absence is only established when the query that produced it can
 * enumerate what it left out.
 *
 * An entry-test for which board a CA belongs on is in the README; this script does not
 * need it. It needs only to look in both places before saying "nowhere".
 */
const BOARDS = [
  { id: '901219880207', name: 'Approvals & Sign-offs' },   // folder 901212628113
  { id: '901220442060', name: 'Rules & Procedures' },      // Keith-Only Sign-offs, folder 901213093318
];
const REGISTER = path.join(
  'andro-prime', '03_compliance', 'content-approval', 'content-approval-register.md'
);
const ENV = path.join('andro-prime', '09_website-app', 'frontend', '.env.local');

const DECISION = /^\s*[^A-Za-z]*\s*(APPROVED|PENDING|REJECTED|SUPERSEDED)\b/i;

function die(msg) {
  console.error(`\n🔴 CANNOT RUN: ${msg}`);
  console.error('Exit 1 is not a pass. Nothing was compared, so nothing is cleared.');
  process.exit(1);
}

// ── the register side ────────────────────────────────────────────────────────
function readRegisterSide() {
  if (!fs.existsSync(REGISTER)) die(`register not found at ${REGISTER} — run from the repo root`);
  const rows = new Map(); // "CA-050" -> decision
  const src = fs.readFileSync(REGISTER, 'utf8').replace(/\r\n/g, '\n');
  for (const line of src.split('\n')) {
    const m = /^\|\s*(CA-\d{3})\s*\|/.exec(line);
    if (!m) continue;
    /* The decision lives in its own cell and every one of them opens with a status
       word, usually behind an emoji. Prose elsewhere in the row mentions APPROVED
       constantly (rows cite other CAs), so scanning the whole row would read the
       wrong thing — take the first CELL that starts with a status word. */
    let decision = 'UNKNOWN';
    for (const cell of line.split('|')) {
      const d = DECISION.exec(cell);
      if (d) { decision = d[1].toUpperCase(); break; }
    }
    rows.set(m[1], decision);
  }
  if (rows.size === 0) die('no CA rows parsed from the register — the table shape changed, fix this collector rather than trusting a pass');
  return rows;
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
  const tasks = new Map();  // "CA-050" -> [{status, name, id, board}]
  let total = 0;
  const perBoard = [];
  /* Both boards, and on each: `include_closed` and `subtasks` on, archived fetched
     separately. A task that is closed, archived, a subtask, or simply on the OTHER
     board still IS on the board, and a listing that quietly excludes it reports a
     present CA as missing. */
  for (const board of BOARDS) {
    let count = 0;
    for (const archived of [false, true]) {
      for (let page = 0; page < 50; page++) {
        const url = `https://api.clickup.com/api/v2/list/${board.id}/task`
          + `?include_closed=true&subtasks=true&archived=${archived}&page=${page}`;
        const d = await get(url, auth);
        const batch = d.tasks || [];
        if (!batch.length) break;
        total += batch.length;
        count += batch.length;
        for (const t of batch) {
          const m = /CA-(\d{3})/.exec(t.name || '');
          if (!m) continue;
          const key = `CA-${m[1]}`;
          if (!tasks.has(key)) tasks.set(key, []);
          tasks.get(key).push({
            status: (t.status && t.status.status) || '',
            name: t.name, id: t.id, archived, board: board.name,
          });
        }
        if (d.last_page) break;
      }
    }
    perBoard.push(`${board.name} (${board.id}): ${count}`);
  }
  return { tasks, total, perBoard };
}

/** Board statuses that mean "a human has signed it off". */
const BOARD_SIGNED = new Set(['approved', 'complete', 'closed', 'done']);

async function main() {
  const reg = readRegisterSide();
  const auth = token();
  let board;
  try {
    board = await readBoardSide(auth);
  } catch (e) {
    die(`could not read the board: ${e.message}`);
  }

  const regKeys = [...reg.keys()].sort();
  const boardKeys = [...board.tasks.keys()].sort();

  console.log(`REGISTER : ${regKeys.length} CA rows`);
  console.log(`BOARDS   : ${board.total} task(s) across ${BOARDS.length} boards, ${boardKeys.length} carrying a CA number`);
  for (const line of board.perBoard) console.log(`           ${line}`);

  const missing = regKeys.filter((k) => !board.tasks.has(k));
  const orphans = boardKeys.filter((k) => !reg.has(k));
  const dupes = boardKeys.filter((k) => board.tasks.get(k).length > 1);

  /* A register row saying APPROVED whose board task is not in a signed state.
     The board is the original, so this is the register claiming a signature the
     hub cannot show — the direction that matters. */
  const disagree = [];
  for (const k of boardKeys) {
    if (!reg.has(k)) continue;
    const regSays = reg.get(k);
    for (const t of board.tasks.get(k)) {
      const boardSigned = BOARD_SIGNED.has(t.status.toLowerCase());
      if (regSays === 'APPROVED' && !boardSigned) {
        disagree.push(`${k}  register APPROVED  <->  board [${t.status}]  ${t.id}`);
      }
    }
  }

  let drift = 0;

  if (missing.length) {
    drift += missing.length;
    console.log(`\n🔴 IN THE REGISTER, MISSING FROM THE BOARD (${missing.length})`);
    console.log('   The board is the original. These exist only in the copy.');
    const byDecision = new Map();
    for (const k of missing) {
      const d = reg.get(k);
      if (!byDecision.has(d)) byDecision.set(d, []);
      byDecision.get(d).push(k);
    }
    for (const [d, list] of byDecision) {
      console.log(`   ${d} (${list.length}): ${list.join(' ')}`);
    }
    console.log('\n   -> cd andro-prime/09_website-app/frontend');
    console.log('      npx tsx scripts/clickup-approval-task.ts --ca CA-0NN --name "<artefact>" \\');
    console.log('        --owes "<who>: <the one action left>" --body <file>');
  }

  if (orphans.length) {
    drift += orphans.length;
    console.log(`\n🟠 ON THE BOARD, NO REGISTER ROW (${orphans.length})`);
    console.log('   Not necessarily wrong: the board leads. Mirror it into the register.');
    for (const k of orphans) {
      for (const t of board.tasks.get(k)) console.log(`   ${k}  [${t.status}]  ${t.id}  ${t.board}  ${t.name}`);
    }
  }

  if (dupes.length) {
    drift += dupes.length;
    console.log(`\n🟠 MORE THAN ONE TASK FOR ONE CA (${dupes.length})`);
    for (const k of dupes) {
      for (const t of board.tasks.get(k)) console.log(`   ${k}  [${t.status}]  ${t.id}  ${t.board}  ${t.name}`);
    }
  }

  if (disagree.length) {
    drift += disagree.length;
    console.log(`\n🔴 STATUS DISAGREEMENT (${disagree.length})`);
    console.log('   The register claims a signature the hub does not show.');
    for (const d of disagree) console.log(`   ${d}`);
  }

  console.log('\n' + '─'.repeat(60));
  if (drift) {
    console.log(`🔴 ${drift} discrepanc${drift === 1 ? 'y' : 'ies'}.`);
    console.log('An entry in only one of the two stores is drift, and it is invisible');
    console.log('from whichever side you are standing on. The board is the original.');
    process.exit(2);
  }
  console.log('🟢 The register and the board agree. Both sides compared, nothing assumed.');
}

main().catch((e) => die(e.message));
