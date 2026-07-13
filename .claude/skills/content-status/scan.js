#!/usr/bin/env node
/**
 * Andro Prime content library gate scanner: the deterministic pipeline floor.
 *
 * Reads content asset markdown files (frontmatter = the tracker, body = the
 * hook + script) and hard-blocks invalid pipeline transitions. Mirrors the
 * conventions of `.claude/skills/compliance-preflight/scan.js`: zero-dep Node
 * CJS, regex tables as {re, why, alt, guard} objects, exit code 2 on any HARD
 * hit, emoji report lines. Gate G5 REUSES that scanner's HARD table verbatim.
 *
 * Usage (run from repo root):
 *   node .claude/skills/content-status/scan.js [path ...]
 * Each path is an asset .md file or a directory scanned for *.md (README.md
 * skipped). Default: andro-prime/06_marketing/content-machine/assets
 *
 * Exit code: 2 if any HARD hit across all files (gate block), 0 otherwise.
 * REVIEW hits are advisories and never fail the gate.
 */
'use strict';
const fs = require('fs');
const path = require('path');

// ── Gate G5: compliance HARD table, copied verbatim from
// compliance-preflight/scan.js. This is the detector, so it necessarily holds
// the banned literals. Run over the BODY only, never the frontmatter.
const HARD = [
  { re: /\bashwagandha\b/i, why: 'Silent ingredient — no approved EFSA claim; ASA exposure lands on Andro Prime.', alt: 'Never mention. Remove entirely, any context.' },
  { re: /\bdiagnos(e|es|is|ed|ing)\b/i, why: 'Implies a medical act.', alt: '"Find out what your levels are"', guard: true },
  { re: /\bcure(s|d)?\b/i, why: 'Medicinal claim.', alt: 'Remove entirely.', guard: true },
  { re: /\btreat(s|ed|ing|ment|ments)?\b/i, why: 'Medicinal claim (verify benign use, e.g. data "treatment").', alt: 'Remove entirely in Phase 0.', guard: true },
  { re: /\bclinically proven\b/i, why: 'Misleading without an RCT reference.', alt: 'Remove, or cite a specific study.' },
  { re: /TRT is (now |currently )?available|available now\b.*TRT/i, why: 'False availability claim — TRT is not live (pre-CQC).', alt: '"Be first when we launch TRT"' },
  { re: /you have low testosterone\b/i, why: 'Definitive medical statement.', alt: '"Your results indicate…"' },
  { re: /\b(heals?|healing)\b.*\b(joints?|cartilage|body|tissue)\b/i, why: 'Medicinal claim ("Collagen heals your joints").', alt: '"Vitamin C contributes to normal collagen formation for the normal function of cartilage"' },
  { re: /\b(1[5-9]|[2-9]\d)\s*%\s*off\b|\bbiggest discount\b|\bexclusive deal\b|\blimited time\b|\bhalf[- ]price\b/i, why: 'Inflated/exaggerated savings claim — the partner code is exactly 10%; ASA polices exaggerated savings.', alt: '"10% off" / "£107 with my code (£119 RRP)" — the exact figure only.' },
];

// Negation / disclaimer context: a guarded HARD term inside one of these is
// the compliant disclaimer ("do not constitute a diagnosis"), not a breach.
// Copied verbatim from compliance-preflight/scan.js.
const NEG = /\b(do(es)?\s+not|don'?t|doesn'?t|not|never|no|cannot|can'?t|isn'?t|aren'?t)\b[^.]{0,40}\b(diagnos|treat|cure)|(diagnos\w*|treatment|cure)\b[^.]{0,30}\b(advice|only|informational|purposes)\b|informational purposes only|do(es)?\s+not\s+constitute|not a substitute/i;

// ── Enums + pipeline orders (typos here would silently skip gates -> HARD).
const STATUS_ORDER = { idea: 0, hooked: 1, scripted: 2, recorded: 3, edited: 4, approved: 5, done: 6 };
const REND_ORDER = { 'to-produce': 0, 'thumbnail-done': 1, scheduled: 2, published: 3, measured: 4 };
const CONTENT_TYPES = ['educational', 'personal-story', 'proof-result', 'objection-comparison'];
const FUNNEL_STAGES = ['TOFU', 'MOFU', 'BOFU', 'RETENTION'];
const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin'];
const FORMATS = ['reel', 'short', 'long-form', 'link-post', 'text-post'];
const THUMBS = ['9x16', '1280x720', '1200x630', 'none'];

const EM_DASH = '—';
const EN_DASH = '–';

// ── Frontmatter value cleaner: strips surrounding quotes, then a trailing
// " #comment" (space-hash so URL fragments survive).
function cleanVal(raw) {
  let v = (raw || '').trim();
  if (!v) return '';
  const q = v[0];
  if (q === '"' || q === "'") {
    const end = v.indexOf(q, 1);
    return end > 0 ? v.slice(1, end) : v.slice(1);
  }
  const h = v.search(/\s#/);
  if (h >= 0) v = v.slice(0, h).trim();
  return v;
}

function addKV(obj, s) {
  const m = s.match(/^([A-Za-z_][\w-]*):\s?(.*)$/);
  if (m) obj[m[1]] = cleanVal(m[2]);
}

// ── Parse exactly our asset shape: flat key: value pairs plus one nested
// `renditions:` list (2-space list items, 4-space continuation keys). Returns
// { flat, renditions, body: [{n, text}], hasFrontmatter }.
function parseAsset(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const flat = {};
  const renditions = [];
  const body = [];
  let hasFrontmatter = false;

  if (lines[0] !== undefined && lines[0].trim() === '---') {
    let close = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') { close = i; break; }
    }
    if (close > 0) {
      hasFrontmatter = true;
      const fm = lines.slice(1, close);
      let inRend = false;
      let cur = null;
      for (const line of fm) {
        if (!line.trim()) continue;
        const indent = line.length - line.trimStart().length;
        if (inRend && indent > 0) {
          const t = line.trim();
          if (t.startsWith('- ')) { cur = {}; renditions.push(cur); addKV(cur, t.slice(2)); }
          else if (cur) { addKV(cur, t); }
          continue;
        }
        inRend = false;
        const m = line.match(/^([A-Za-z_][\w-]*):\s?(.*)$/);
        if (!m) continue;
        if (m[1] === 'renditions') { inRend = true; continue; }
        flat[m[1]] = cleanVal(m[2]);
      }
      // body carries absolute (1-based) line numbers for accurate reports.
      for (let i = close + 1; i < lines.length; i++) body.push({ n: i + 1, text: lines[i] });
      return { flat, renditions, body, hasFrontmatter };
    }
  }
  // No frontmatter: whole file is treated as body for the G5 pass.
  for (let i = 0; i < lines.length; i++) body.push({ n: i + 1, text: lines[i] });
  return { flat, renditions, body, hasFrontmatter };
}

// ── Body helpers.
function hasScriptSection(body) {
  let idx = -1;
  for (let i = 0; i < body.length; i++) {
    if (/^##\s+Script\b/i.test(body[i].text)) { idx = i; break; }
  }
  if (idx < 0) return false;
  for (let j = idx + 1; j < body.length; j++) {
    const t = body[j].text;
    if (/^#{1,2}\s/.test(t)) break; // next heading of same-or-higher level
    if (t.trim()) return true;
  }
  return false;
}

// Extract the expected slug from a filename: strip .md and an optional leading
// YYYY-MM-DD- date prefix.
function fileSlug(file) {
  let base = path.basename(file).replace(/\.md$/i, '');
  base = base.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return base;
}

// ── Collect *.md files from a path (file or directory), skipping README.md.
function collect(p) {
  let st;
  try { st = fs.statSync(p); } catch (e) { return { missing: [p], files: [] }; }
  if (st.isFile()) return { missing: [], files: [p] };
  const files = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const s = fs.statSync(full);
      if (s.isDirectory()) walk(full);
      else if (/\.md$/i.test(name) && name.toLowerCase() !== 'readme.md') files.push(full);
    }
  };
  walk(p);
  return { missing: [], files };
}

function daysSince(ms) {
  return (Date.now() - ms) / 86400000;
}

// ── Scan one asset. Returns { hard: [...], review: [...] } message strings.
function scanFile(file) {
  const hard = [];
  const review = [];
  const H = (gate, msg, extra) => hard.push(`\n🔴 HARD  ${file}  [${gate}] ${msg}${extra ? `\n   → ${extra}` : ''}`);
  const R = (msg, extra) => review.push(`\n🟠 REVIEW ${file}  ${msg}${extra ? `\n   ${extra}` : ''}`);

  const raw = fs.readFileSync(file, 'utf8');
  const { flat, renditions, body, hasFrontmatter } = parseAsset(raw);

  // ---- Required keys + enum validation (typos would silently skip gates).
  if (!hasFrontmatter) H('SCHEMA', 'No frontmatter block found (expected --- delimited).');

  const slug = flat.slug || '';
  const status = flat.status || '';
  if (!slug) H('SCHEMA', 'Missing required key: slug.');
  if (!status) H('SCHEMA', 'Missing required key: status.');

  const fslug = fileSlug(file);
  if (slug && slug !== fslug) H('SCHEMA', `slug "${slug}" does not match filename slug "${fslug}".`, 'Rename the file or fix the slug so they agree.');

  // ---- YAML safety: the ClickUp mirror parses frontmatter with a real YAML
  // parser (gray-matter), which rejects unquoted values containing ": ".
  // This flat parser tolerates them, so catch the divergence here.
  if (hasFrontmatter) {
    const fmBlock = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
    if (fmBlock) {
      const fmLines = fmBlock[1].split('\n');
      for (let i = 0; i < fmLines.length; i++) {
        const kv = fmLines[i].match(/^\s*(?:- )?([A-Za-z_][\w-]*):\s(.+)$/);
        if (!kv) continue;
        const val = kv[2].replace(/\s#.*$/, '').trim(); // ignore trailing comments
        if (val && !/^["']/.test(val) && val.includes(': ')) {
          H('SCHEMA', `Value of "${kv[1]}" contains an unquoted ": " (YAML-unsafe, breaks the ClickUp mirror).`, `Wrap the value in double quotes: ${kv[1]}: "..."`);
        }
      }
    }
  }

  let statusOrd = null;
  if (status) {
    if (!(status in STATUS_ORDER)) H('SCHEMA', `Unknown status "${status}".`, `Allowed: ${Object.keys(STATUS_ORDER).join(', ')}.`);
    else statusOrd = STATUS_ORDER[status];
  }
  if (flat.content_type && !CONTENT_TYPES.includes(flat.content_type)) H('SCHEMA', `Unknown content_type "${flat.content_type}".`, `Allowed: ${CONTENT_TYPES.join(', ')}.`);
  if (flat.funnel_stage && !FUNNEL_STAGES.includes(flat.funnel_stage)) H('SCHEMA', `Unknown funnel_stage "${flat.funnel_stage}".`, `Allowed: ${FUNNEL_STAGES.join(', ')}.`);

  renditions.forEach((r, i) => {
    const tag = `rendition #${i + 1}`;
    if (r.platform && !PLATFORMS.includes(r.platform)) H('SCHEMA', `Unknown platform "${r.platform}" (${tag}).`, `Allowed: ${PLATFORMS.join(', ')}.`);
    if (r.format && !FORMATS.includes(r.format)) H('SCHEMA', `Unknown format "${r.format}" (${tag}).`, `Allowed: ${FORMATS.join(', ')}.`);
    if (r.thumb && !THUMBS.includes(r.thumb)) H('SCHEMA', `Unknown thumb "${r.thumb}" (${tag}).`, `Allowed: ${THUMBS.join(', ')}.`);
    if (r.status && !(r.status in REND_ORDER)) H('SCHEMA', `Unknown rendition status "${r.status}" (${tag}).`, `Allowed: ${Object.keys(REND_ORDER).join(', ')}.`);
  });

  // ---- G1: status >= scripted requires a non-empty "## Script" section.
  if (statusOrd !== null && statusOrd >= STATUS_ORDER.scripted && !hasScriptSection(body)) {
    H('G1', `status "${status}" requires a non-empty "## Script" section in the body.`, 'Add the script, or drop status back to hooked.');
  }

  // ---- G2: status >= approved requires a passed preflight + canonical_asset.
  if (statusOrd !== null && statusOrd >= STATUS_ORDER.approved) {
    const pf = flat.preflight || '';
    const ewa = flat.ewa_task || '';
    const canonical = flat.canonical_asset || '';
    const amberOk = pf === 'amber-ewa' && ewa !== '';
    const pfOk = pf === 'green' || amberOk;
    if (!pfOk) {
      H('G2', `status "${status}" requires preflight green, or amber-ewa with a non-empty ewa_task (found preflight "${pf || 'unset'}", ewa_task "${ewa || 'unset'}").`, 'Run the preflight and set the result, or open the Ewa task.');
    }
    if (!canonical) {
      H('G2', `status "${status}" requires canonical_asset (the source article slug it inherits sign-off from).`, 'Set canonical_asset, or "none" only for a net-new claim that went to Ewa (amber-ewa + ewa_task).');
    } else if (canonical === 'none' && !amberOk) {
      H('G2', 'canonical_asset "none" is only allowed for a net-new claim routed to Ewa (preflight amber-ewa + ewa_task).', 'Set the source article slug, or route the net-new claim to Ewa.');
    }
  }

  // ---- G3 + G4: rendition gates.
  renditions.forEach((r, i) => {
    const tag = `rendition #${i + 1}${r.platform ? ` (${r.platform}/${r.format || '?'})` : ''}`;
    const rOrd = (r.status in REND_ORDER) ? REND_ORDER[r.status] : null;
    if (rOrd === null) return; // unknown/absent status already flagged; can't order.

    // G3: rendition >= scheduled requires parent approved + confirmed thumb.
    if (rOrd >= REND_ORDER.scheduled) {
      if (statusOrd === null || statusOrd < STATUS_ORDER.approved) {
        H('G3', `${tag} is "${r.status}" but parent status "${status || 'unset'}" is below approved.`, 'Get the asset approved before scheduling any rendition.');
      }
      const thumb = r.thumb || '';
      if (thumb && thumb !== 'none' && r.thumb_confirmed !== 'true') {
        H('G3', `${tag} is "${r.status}" with thumb "${thumb}" but thumb_confirmed is not true.`, 'Confirm the thumb file exists in Drive (set thumb_confirmed: true via /content-status).');
      }
    }

    // G4: published or measured requires a non-empty url.
    if (rOrd >= REND_ORDER.published && !(r.url && r.url.trim())) {
      H('G4', `${tag} is "${r.status}" but has no url.`, 'Add the published URL.');
    }
  });

  // ---- G5: compliance HARD table + dash checks over the BODY only.
  for (const { n, text } of body) {
    const t = text.trim();
    if (t) {
      for (const p of HARD) {
        const m = text.match(p.re);
        if (!m) continue;
        if (p.guard && NEG.test(text)) continue; // compliant negation/disclaimer.
        H('G5', `${file.split(path.sep).pop()}:${n} «${m[0]}» ${p.why}`, `${p.alt}  |  ${t.slice(0, 120)}`);
      }
    }
    if (text.indexOf(EM_DASH) >= 0) {
      H('G5', `line ${n}: em dash (U+2014) in body copy is banned (AI tell).`, `Use a colon, comma, semicolon, period or brackets.  |  ${t.slice(0, 120)}`);
    }
    if (text.indexOf(` ${EN_DASH} `) >= 0) {
      R(`line ${n}: spaced en dash used as an em dash; replace with a punctuation mark.`, t.slice(0, 120));
    }
  }

  // ---- Advisories (never block).
  if (statusOrd !== null && statusOrd >= STATUS_ORDER.hooked && statusOrd <= STATUS_ORDER.edited) {
    try {
      const d = daysSince(fs.statSync(file).mtimeMs);
      if (d > 14) R(`stale: not modified for ${Math.floor(d)} days while status "${status}" (hooked..edited).`, 'Advance it or park it.');
    } catch (e) { /* stat failure is non-fatal */ }
  }
  if ((flat.preflight || '') === 'green' && !(flat.preflight_date || '').trim()) {
    R('preflight is green but preflight_date is missing.', 'Stamp the date the preflight was run.');
  }

  return { hard, review };
}

// ── Main.
function die(m) { console.error(`ERROR: ${m}`); process.exit(1); }

const args = process.argv.slice(2);
const targets = args.length ? args : ['andro-prime/06_marketing/content-machine/assets'];

let files = [];
const missing = [];
for (const t of targets) {
  const c = collect(t);
  missing.push(...c.missing);
  files.push(...c.files);
}
files = [...new Set(files)];
for (const m of missing) console.log(`SKIP  ${m} (not found)`);

if (!files.length && !missing.length) die('no *.md asset files found');

let totalHard = 0, totalReview = 0, cleanFiles = 0;
for (const f of files) {
  const { hard, review } = scanFile(f);
  hard.forEach((l) => console.log(l));
  review.forEach((l) => console.log(l));
  if (!hard.length) { console.log(`\n🟢 OK    ${f}`); cleanFiles++; }
  totalHard += hard.length;
  totalReview += review.length;
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Scanned ${files.length} asset(s).  🟢 clean: ${cleanFiles}   🔴 HARD: ${totalHard}   🟠 REVIEW: ${totalReview}`);
if (totalHard) console.log('HARD gate failures block the transition; fix them before advancing status/renditions.');
if (totalReview) console.log('REVIEW items are advisories; a human decides, they do not block.');
if (!totalHard && !totalReview && files.length) console.log('Pipeline gates clean.');
process.exit(totalHard ? 2 : 0);
