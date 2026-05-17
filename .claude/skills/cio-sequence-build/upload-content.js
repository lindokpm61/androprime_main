#!/usr/bin/env node
/**
 * CIO sequence content uploader.
 *
 * Sets body/subject/from_id on Customer.io campaign email actions via the App
 * API (api-eu.customer.io) — the only channel that accepts CUSTOMERIO_APP_API_KEY
 * as Bearer for content writes. The Fly UI API rejects that key (401); use the
 * CIO MCP for everything else (campaign/trigger/delay wiring, verification, and
 * preheader_text — which does NOT propagate through the App API).
 *
 * Usage (run from repo root):
 *   node .claude/skills/cio-sequence-build/upload-content.js <manifest.json>
 *
 * Manifest:
 *   {
 *     "campaign_id": 8,
 *     "actions": {
 *       "<action_id>": { "file": "<path rel. to repo root>",
 *                        "subject": "...", "preheader": "..." }
 *     }
 *   }
 *
 * `from_id: 1` (Keith Antony) is hard-set. Every email stays draft — this
 * script never changes sending_state or activates anything.
 * preheader is sent best-effort but MUST also be set via the CIO MCP afterward.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ENV_PATH = 'andro-prime/09_website-app/frontend/.env.local';
const HOST = 'api-eu.customer.io';
const FROM_ID = 1;

function die(msg) { console.error(`ERROR: ${msg}`); process.exit(1); }

const manifestPath = process.argv[2];
if (!manifestPath) die('usage: node upload-content.js <manifest.json>');
if (!fs.existsSync(ENV_PATH)) die(`cannot find ${ENV_PATH} (run from repo root)`);

const KEY = (fs.readFileSync(ENV_PATH, 'utf8')
  .split(/\r?\n/)
  .find(l => l.startsWith('CUSTOMERIO_APP_API_KEY=')) || '')
  .split('=').slice(1).join('=').replace(/['"]/g, '').trim();
if (!KEY) die('CUSTOMERIO_APP_API_KEY not found in .env.local');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const { campaign_id, actions } = manifest;
if (!campaign_id || !actions) die('manifest needs campaign_id and actions');

function put(actionId, cfg) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(cfg.file)) return reject(new Error(`missing file ${cfg.file}`));
    const payload = JSON.stringify({
      body: fs.readFileSync(cfg.file, 'utf8'),
      subject: cfg.subject,
      preheader: cfg.preheader || '',
      from_id: FROM_ID,
      reply_to: '',
    });
    const req = https.request({
      method: 'PUT',
      hostname: HOST,
      path: `/v1/campaigns/${campaign_id}/actions/${actionId}`,
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      let s = '';
      res.on('data', d => (s += d));
      res.on('end', () => resolve({ actionId, status: res.statusCode, ok: res.statusCode === 200, snippet: s.slice(0, 200) }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  let failed = 0;
  for (const [actionId, cfg] of Object.entries(actions)) {
    try {
      const r = await put(actionId, cfg);
      console.log(`action ${r.actionId}  HTTP ${r.status}  ${r.ok ? 'OK' : 'FAIL ' + r.snippet}`);
      if (!r.ok) failed++;
    } catch (e) {
      console.log(`action ${actionId}  FAIL  ${e.message}`);
      failed++;
    }
  }
  console.log(failed ? `\n${failed} action(s) failed.` : '\nAll actions uploaded. Now set preheader_text per template via the CIO MCP.');
  process.exit(failed ? 1 : 0);
})();
