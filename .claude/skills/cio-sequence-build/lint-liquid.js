#!/usr/bin/env node
/**
 * Liquid linter for Andro Prime email templates.
 *
 * Catches the specific traps that CIO accepts silently at upload time but then
 * drops at render time (no inbox, no bounce, no campaign metric). Run against
 * the local HTML before uploading, and re-run against the rendered bodies
 * pulled back from CIO before flipping any campaign to live.
 *
 * Usage (from repo root):
 *   node .claude/skills/cio-sequence-build/lint-liquid.js                 # lint all email-templates/html
 *   node .claude/skills/cio-sequence-build/lint-liquid.js path/file.html  # lint a specific file or files
 *   node .claude/skills/cio-sequence-build/lint-liquid.js --cio           # lint live CIO bodies (App API)
 *
 * Exit 0 = no ERRORs (WARNs allowed). Exit 2 = at least one ERROR.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const HTML_DIR = 'andro-prime/09_website-app/frontend/email-templates/html';
const ENV_PATH = 'andro-prime/09_website-app/frontend/.env.local';

// CIO Liquid TAGS (output-only) — using {{ }} silently fails the render.
// Source: hard-won, 2026-05-24. Add to this list when a new CIO output-tag is discovered.
const CIO_TAGS = [
  'unsubscribe_url',
  'unsubscribe_preferences_url',
  'preferences_url',
  'subscription_center_url',
  'view_in_browser_url',
  'liquid_render_error',
];

const args = process.argv.slice(2);
const CIO_MODE = args.includes('--cio');
const targets = args.filter(a => !a.startsWith('--'));

function readFiles() {
  if (targets.length) return targets.map(f => ({ name: f, body: fs.readFileSync(f, 'utf8') }));
  return fs.readdirSync(HTML_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => ({ name: path.join(HTML_DIR, f), body: fs.readFileSync(path.join(HTML_DIR, f), 'utf8') }));
}

function readCioKey() {
  const line = fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/).find(l => l.startsWith('CUSTOMERIO_APP_API_KEY=')) || '';
  return line.split('=').slice(1).join('=').replace(/['"]/g, '').trim();
}

function req(method, p, key) {
  return new Promise((resolve, reject) => {
    const r = https.request({ method, hostname: 'api-eu.customer.io', path: p,
      headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } }, res => {
      let s = ''; res.on('data', d => (s += d));
      res.on('end', () => resolve({ status: res.statusCode, body: s }));
    });
    r.on('error', reject); r.end();
  });
}

async function fetchCioBodies() {
  const key = readCioKey();
  if (!key) { console.error('CUSTOMERIO_APP_API_KEY missing'); process.exit(1); }
  const ids = [];
  for (let cid = 1; cid <= 25; cid++) {
    const r = await req('GET', `/v1/campaigns/${cid}`, key);
    if (r.status !== 200) continue;
    const camp = JSON.parse(r.body).campaign;
    for (const a of (camp.actions || []).filter(x => x.type === 'email')) ids.push({ cid, aid: a.id, name: camp.name });
  }
  const out = [];
  for (const x of ids) {
    const r = await req('GET', `/v1/campaigns/${x.cid}/actions/${x.aid}`, key);
    if (r.status !== 200) continue;
    const a = JSON.parse(r.body).action;
    out.push({ name: `[CIO camp ${x.cid} action ${x.aid}] ${a.name || ''}`, body: a.body || '' });
  }
  return out;
}

function lint(name, body) {
  const findings = [];
  const lines = body.split('\n');

  // ERROR 1: CIO tags used as variables.
  for (const tag of CIO_TAGS) {
    const re = new RegExp(`\\{\\{\\s*${tag}\\s*\\}\\}`, 'g');
    lines.forEach((line, i) => {
      if (re.test(line)) findings.push({ level: 'ERROR', line: i + 1, msg: `'${tag}' is a CIO Liquid TAG — use {% ${tag} %} not {{ ${tag} }}` });
      re.lastIndex = 0;
    });
  }

  // ERROR 2: unbalanced {% if %} / {% endif %}.
  const ifCount = (body.match(/\{%\s*if\b/g) || []).length;
  const endifCount = (body.match(/\{%\s*endif\s*%\}/g) || []).length;
  if (ifCount !== endifCount) findings.push({ level: 'ERROR', line: 0, msg: `unbalanced {% if %}/{% endif %} (${ifCount} ifs, ${endifCount} endifs)` });

  // ERROR 3: unbalanced {% for %} / {% endfor %}.
  const forCount = (body.match(/\{%\s*for\b/g) || []).length;
  const endforCount = (body.match(/\{%\s*endfor\s*%\}/g) || []).length;
  if (forCount !== endforCount) findings.push({ level: 'ERROR', line: 0, msg: `unbalanced {% for %}/{% endfor %} (${forCount} fors, ${endforCount} endfors)` });

  // WARN 1: {% if %} without {% else %} — fallback may be absent.
  const ifBlocks = body.match(/\{%\s*if[^%]*%\}[\s\S]*?\{%\s*endif\s*%\}/g) || [];
  for (const block of ifBlocks) {
    if (!/\{%\s*else\s*%\}/.test(block) && !/\{%\s*elsif\b/.test(block)) {
      const firstLine = body.slice(0, body.indexOf(block)).split('\n').length;
      const head = block.slice(0, block.indexOf('%}') + 2);
      findings.push({ level: 'WARN', line: firstLine, msg: `${head} has no {% else %} — empty output if condition is false / attribute unset` });
    }
  }

  // WARN 2: customer.first_name without | default:
  lines.forEach((line, i) => {
    const m = line.match(/\{\{\s*customer\.first_name\s*\}\}/);
    if (m) findings.push({ level: 'WARN', line: i + 1, msg: `{{ customer.first_name }} has no | default: '…' — renders blank for guests` });
  });

  // WARN 3: bare {{ event.* }} likely needs a default too.
  // (Skipping for now — too noisy on transactional templates where event.* is always present.)

  return findings;
}

(async () => {
  const docs = CIO_MODE ? await fetchCioBodies() : readFiles();
  let errors = 0, warns = 0;
  for (const d of docs) {
    const f = lint(d.name, d.body);
    if (!f.length) continue;
    console.log(`\n${d.name}`);
    for (const x of f) {
      const tag = x.level === 'ERROR' ? '\x1b[31mERROR\x1b[0m' : '\x1b[33mWARN \x1b[0m';
      console.log(`  ${tag} L${x.line}: ${x.msg}`);
      x.level === 'ERROR' ? errors++ : warns++;
    }
  }
  console.log(`\n${docs.length} file(s) scanned. ${errors} error(s), ${warns} warning(s).`);
  process.exit(errors ? 2 : 0);
})().catch(e => { console.error(e); process.exit(1); });
