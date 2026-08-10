/*
 * Mirror observation-log entries onto the ClickUp Skill Observations board.
 *
 * The convention is that every observation exists in BOTH stores; the log is
 * canonical for text, the board is where the backlog is actually read and
 * triaged. reconcile-observations.js reports the drift, this closes it.
 *
 * Scripted rather than done through the MCP connector because that is one
 * round-trip per task: right for a one-off, wrong past about ten. The real cost
 * of the slow path is not the delay, it is that it quietly encourages proposing
 * a subset instead of doing the whole job.
 *
 *   node .claude/skills/wrap/seed-observations.js 184-198        create these
 *   node .claude/skills/wrap/seed-observations.js 184-198 --dry  resolve only
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const LIST_ID = '901220039345';
const LOG = path.join(os.homedir(), '.claude/projects/d--Androprime-main/skill-observations/log.md');
const ENV = path.join(__dirname, '../../../andro-prime/09_website-app/frontend/.env.local');
const DRY = process.argv.includes('--dry');

const range = (process.argv[2] || '').match(/^(\d+)-(\d+)$/);
if (!range) { console.error('Usage: node seed-observations.js <from>-<to> [--dry]'); process.exit(1); }
const [FROM, TO] = [Number(range[1]), Number(range[2])];

function token() {
  if (process.env.CLICKUP_API_TOKEN) return process.env.CLICKUP_API_TOKEN.trim();
  const m = fs.readFileSync(ENV, 'utf8').match(/^CLICKUP_API_TOKEN=(.+)$/m);
  if (!m) { console.error(`CLICKUP_API_TOKEN not found in ${ENV}`); process.exit(1); }
  return m[1].trim().replace(/^["']|["']$/g, '');
}
const TOKEN = token();

/* Split the log into entries and keep the fields the board needs. */
function parseLog() {
  const text = fs.readFileSync(LOG, 'utf8');
  const parts = text.split(/^### Observation (\d+): /m);
  const out = new Map();
  for (let i = 1; i < parts.length; i += 2) {
    const n = Number(parts[i]);
    const body = parts[i + 1];
    const title = body.split('\n')[0].trim();
    const status = /\*\*Status:\*\*\s*(OPEN|ACTIONED|DECLINED)/.exec(body);
    out.set(n, { title, status: status ? status[1] : 'OPEN', body: body.trim() });
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function createTask(n, entry) {
  const name = `OBS-${n} | ${entry.title} | ${entry.status}`;
  const res = await fetch(`https://api.clickup.com/api/v2/list/${LIST_ID}/task`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.slice(0, 250),
      /* the log stays canonical for text; the body is a readable copy so the
       * board is useful on its own without opening the log */
      markdown_description: entry.body.slice(0, 8000),
      status: entry.status === 'OPEN' ? 'to do' : 'complete',
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).id;
}

(async () => {
  const log = parseLog();
  const wanted = [];
  for (let n = FROM; n <= TO; n++) if (log.has(n)) wanted.push(n);

  console.log(`log entries in range : ${wanted.length} (${FROM}-${TO})`);
  console.log(`list                 : ${LIST_ID}`);
  if (DRY) {
    for (const n of wanted) console.log(`  OBS-${n} | ${log.get(n).title.slice(0, 70)} | ${log.get(n).status}`);
    console.log('\n--dry: nothing created.');
    return;
  }

  const map = {}; const failed = [];
  for (const n of wanted) {
    try {
      map[n] = await createTask(n, log.get(n));
      console.log(`  OBS-${n} -> ${map[n]}`);
    } catch (e) {
      failed.push(n);
      console.error(`  OBS-${n} FAILED: ${e.message}`);
    }
    await sleep(700); // stay under the rate limit
  }

  const out = path.join(__dirname, 'seeded-task-ids.json');
  fs.writeFileSync(out, JSON.stringify(map, null, 2));
  console.log(`\ncreated ${Object.keys(map).length}, failed ${failed.length}`);
  if (failed.length) console.log(`failed: ${failed.join(', ')}`);
  console.log(`id map: ${out}`);
})();
