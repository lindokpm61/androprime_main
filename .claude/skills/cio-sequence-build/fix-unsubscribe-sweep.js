#!/usr/bin/env node
/**
 * One-shot sweep: re-upload every Andro Prime email action whose CIO body
 * still contains the broken `{{ unsubscribe_url }}` Liquid variable.
 *
 * The local HTML files were already fixed in a single search/replace
 * (`{{ unsubscribe_url }}` -> `{% unsubscribe_url %}`). This script pushes
 * those corrected bodies up to CIO via the App API, preserving each action's
 * existing subject, preheader, and from_id.
 *
 * Usage (run from repo root):
 *   node .claude/skills/cio-sequence-build/fix-unsubscribe-sweep.js          # dry run
 *   node .claude/skills/cio-sequence-build/fix-unsubscribe-sweep.js --go     # execute
 */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const ENV_PATH = 'andro-prime/09_website-app/frontend/.env.local';
const HTML_DIR = 'andro-prime/09_website-app/frontend/email-templates/html';
const HOST = 'api-eu.customer.io';
const GO = process.argv.includes('--go');

const CAMPAIGNS = [
  { id: 1,  prefix: 'seq-01' },
  { id: 3,  prefix: 'seq-02' },
  { id: 4,  prefix: 'seq-03a' },
  { id: 5,  prefix: 'seq-03b' },
  { id: 6,  prefix: 'seq-03c' },
  { id: 7,  prefix: 'seq-03d' },
  { id: 8,  prefix: 'seq-04' },
  { id: 9,  prefix: 'seq-06' },
  { id: 10, prefix: 'seq-05' },
  { id: 11, prefix: 'transactional-t01' },
  { id: 12, prefix: 'transactional-t02' },
  { id: 13, prefix: 'transactional-t03' },
  { id: 14, prefix: 'transactional-t04' },
  { id: 15, prefix: 'transactional-t05' },
  { id: 16, prefix: 'transactional-t06' },
  { id: 17, prefix: 'transactional-t07' },   // 3 sub-emails (1/2/3)
  { id: 18, prefix: 'transactional-t08' },
  { id: 19, prefix: 'transactional-t09' },
  { id: 20, prefix: 'seq-07' },
];

function die(m) { console.error(`ERROR: ${m}`); process.exit(1); }
const KEY = (fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)
  .find(l => l.startsWith('CUSTOMERIO_APP_API_KEY=')) || '')
  .split('=').slice(1).join('=').replace(/['"]/g, '').trim();
if (!KEY) die('CUSTOMERIO_APP_API_KEY missing');

function req(method, p, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      method, hostname: HOST, path: p,
      headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' },
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(body);
    }
    const r = https.request(opts, res => {
      let s = ''; res.on('data', d => (s += d));
      res.on('end', () => resolve({ status: res.statusCode, body: s }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

// For a campaign prefix + action name ("Email 3 — Recommendation" or
// "T-07 (1) Payment Failed"), find the local HTML file.
function findLocalFile(prefix, actionName) {
  const files = fs.readdirSync(HTML_DIR).filter(f => f.startsWith(prefix + '-') || f.startsWith(prefix + '.'));
  // sequence: action name has "Email N"
  let m = actionName.match(/Email\s+(\d+)/i);
  if (m) {
    const n = m[1];
    const hit = files.find(f => f.startsWith(`${prefix}-email-${n}-`));
    if (hit) return hit;
  }
  // T-07 dunning has 3 sub-emails — name contains "E1/E2/E3", "(1)", or "Stage N"
  m = actionName.match(/(?:\bE|\(|stage\s*)(\d)\b/i);
  if (m && prefix === 'transactional-t07') {
    const hit = files.find(f => f.startsWith(`${prefix}-${m[1]}-`));
    if (hit) return hit;
  }
  // single-email transactionals (T-01..T-06, T-08, T-09): just pick the one matching prefix
  if (prefix.startsWith('transactional-')) {
    const singles = files.filter(f => /^transactional-t\d{2}-[^0-9]/.test(f));
    if (singles.length === 1) return singles[0];
    if (files.length === 1) return files[0];
  }
  // seq-07: 1 email
  if (prefix === 'seq-07' && files.length === 1) return files[0];
  return null;
}

(async () => {
  const plan = [];
  for (const c of CAMPAIGNS) {
    const r = await req('GET', `/v1/campaigns/${c.id}`);
    if (r.status !== 200) { console.log(`campaign ${c.id}: HTTP ${r.status}`); continue; }
    const camp = JSON.parse(r.body).campaign;
    const emailActions = (camp.actions || []).filter(a => a.type === 'email');
    for (const a of emailActions) {
      const ar = await req('GET', `/v1/campaigns/${c.id}/actions/${a.id}`);
      if (ar.status !== 200) { console.log(`  action ${a.id}: HTTP ${ar.status}`); continue; }
      const act = JSON.parse(ar.body).action;
      const hasBug = (act.body || '').includes('{{ unsubscribe_url }}');
      const local = findLocalFile(c.prefix, act.name || '');
      plan.push({
        campaign_id: c.id, prefix: c.prefix, action_id: a.id,
        action_name: act.name, subject: act.subject, preheader: act.preheader || '',
        from_id: act.from_id || 1, reply_to: act.reply_to || '',
        local_file: local, has_bug: hasBug,
      });
    }
  }

  console.log('\n=== SWEEP PLAN ===\n');
  for (const p of plan) {
    const tag = !p.has_bug ? 'CLEAN' : !p.local_file ? 'NO-MATCH' : 'WILL-FIX';
    console.log(`[${tag}] camp ${p.campaign_id} (${p.prefix})  action ${p.action_id}  "${p.action_name}"`);
    console.log(`         file: ${p.local_file || '(none found)'}`);
  }
  const toFix = plan.filter(p => p.has_bug && p.local_file);
  const noMatch = plan.filter(p => p.has_bug && !p.local_file);
  const clean = plan.filter(p => !p.has_bug);
  console.log(`\nTotals: ${toFix.length} to fix, ${noMatch.length} buggy with no local match, ${clean.length} already clean.`);

  if (!GO) { console.log('\nDry run. Re-run with --go to execute.'); return; }
  if (noMatch.length) { console.log('\nABORT: cannot proceed while there are NO-MATCH actions. Resolve those first.'); process.exit(2); }

  let ok = 0, fail = 0;
  for (const p of toFix) {
    const body = fs.readFileSync(path.join(HTML_DIR, p.local_file), 'utf8');
    if (body.includes('{{ unsubscribe_url }}')) { console.log(`  SKIP ${p.local_file} — still has bug locally!`); fail++; continue; }
    const payload = JSON.stringify({
      body, subject: p.subject, preheader: p.preheader,
      from_id: p.from_id, reply_to: p.reply_to,
    });
    const r = await req('PUT', `/v1/campaigns/${p.campaign_id}/actions/${p.action_id}`, payload);
    const good = r.status === 200;
    console.log(`  ${good ? 'OK  ' : 'FAIL'} camp ${p.campaign_id} action ${p.action_id}  HTTP ${r.status}  ${good ? '' : r.body.slice(0, 200)}`);
    good ? ok++ : fail++;
  }
  console.log(`\n${ok} uploaded, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
