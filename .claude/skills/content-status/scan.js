#!/usr/bin/env node
/**
 * Andro Prime content asset scanner: exactly what a repo-only reader can still verify.
 *
 * Reads content asset markdown (`06_marketing/content-machine/assets/*.md`) and checks the
 * three things that genuinely live inside the file it is holding:
 *
 *   SCHEMA   the identity + craft frontmatter, and that no state key has crept back in
 *   YAML     values that this flat parser tolerates but gray-matter (the ClickUp mirror) rejects
 *   G5       the compliance HARD table + the em-dash rule, over the body copy
 *
 * Usage (run from repo root):
 *   node .claude/skills/content-status/scan.js [path ...]
 * Each path is an asset .md file or a directory scanned for *.md (README.md skipped).
 * Default: andro-prime/06_marketing/content-machine/assets
 *
 * Exit code: 2 if any HARD hit across all files, 0 otherwise, 1 if the scanner could not run.
 * REVIEW hits are advisories and never fail the gate.
 *
 * ═════════════════════════════════════════════════════════════════════════════════════════
 * GATES G1 TO G4 ARE GONE. THEY LIVE IN THE DATABASE NOW. DO NOT RESTORE THEM HERE.
 * ═════════════════════════════════════════════════════════════════════════════════════════
 *
 * Phase 1 of `06_marketing/content-machine/content-pipeline-automation-plan.md` moved every
 * state field out of asset frontmatter. The file owns IDENTITY and CRAFT; the database owns
 * STATE (`06_marketing/content-machine/CONTEXT.md`, section "The asset file owns IDENTITY and
 * CRAFT. The database owns STATE."). So this scanner can no longer SEE `status`, `preflight`,
 * `ewa_task`, or any rendition's `status` / `url` / `scheduled_for`, and four of its five gates
 * were asserting conditions over fields the file no longer contains.
 *
 * Where each one went, and what now enforces it:
 *
 *   G1  status >= scripted needs a script in the body
 *       NOT REPLACED, and that is stated rather than glossed. The body is in git and the
 *       status is in Postgres, so no single store can check this pair. `content-doctor` is
 *       the only process that reads both and could carry it; it does not today.
 *       An unperformed check must never read as a pass, so this file no longer claims it.
 *
 *   G2  status >= approved needs preflight + canonical_asset
 *       -> `content_assets_approval_gate`, a CHECK constraint, in
 *          `09_website-app/database/migrations/20260801_content_state_guards.sql`.
 *       The DB version is STRICTER than G2 ever was: G2 accepted `amber-ewa` plus a non-empty
 *       `ewa_task`, which proves a question was ASKED, not answered (Keith, 2026-08-01). The
 *       constraint requires `ewa_signed_at`, which only the sign-off sync may write.
 *
 *   G3  rendition >= scheduled needs an approved parent + a confirmed thumb
 *   G4  rendition published/measured needs a url
 *       -> both are `gate_rendition_publish()`, a BEFORE INSERT OR UPDATE trigger, in the same
 *          migration. It also adds a rule G3 never had: a derivative may not outrun its
 *          canonical article's publication.
 *
 * WHY THE DATABASE AND NOT HERE. A CHECK and a trigger fire on INSERT as well as UPDATE, and a
 * gate you can arrive at without passing through is not a gate: every one of these tables is
 * written by scripts that insert. This file is invoked by hand and by skills that may forget.
 *
 * WHY RESTORING THEM HERE WOULD BE WORSE THAN LEAVING THEM OUT. To re-add G1 to G4 you would
 * first have to re-add the state fields to frontmatter, and a second copy of a fact the database
 * owns is this repo's signature defect: `thumb_confirmed` was a boolean a human typed to assert
 * a Drive fact nothing checked, and the `TODO Ewa` markers were eight article bodies asserting a
 * sign-off that had already happened elsewhere. Both were an artefact claiming a state owned by
 * another store. A scanner asserting a gate it cannot verify is the same shape wearing a hat.
 *
 * WHAT REPLACED THEM HERE INSTEAD: the STATE check below. A leftover `status:` or `preflight:`
 * in frontmatter is now a HARD failure, because it is the dual store growing back. That is the
 * one thing this scanner can still do about the gates, and it is the thing worth doing.
 *
 * ── One more reason not to trim this file ──────────────────────────────────────────────────
 * `STATUS_ORDER`, `REND_ORDER`, `PLATFORMS`, `FORMATS` and `THUMBS` are parsed OUT OF THIS
 * SOURCE by `content-doctor` invariant 2 (`parseScannerVocab`), which compares live DB values
 * against them so the scanner can never HARD-fail legitimate rows again. Deleting or renaming
 * any of the five turns invariant 2 UNCHECKED and the nightly doctor run amber. They are the
 * repo's single mirror of the check constraints, not decoration.
 *
 * Conventions mirror `.claude/skills/compliance-preflight/scan.js` (a DIFFERENT scanner, out of
 * scope here): zero-dep Node CJS, regex tables as {re, why, alt, guard}, exit 2 on any HARD hit,
 * emoji report lines. G5 REUSES that scanner's HARD table verbatim.
 */
'use strict';
const fs = require('fs');
const path = require('path');

// ── Gate G5: the compliance HARD table + negation context. Run over the BODY
// only, never the frontmatter.
//
// THE DUPLICATION IS GONE, AND THIS IS WHERE IT WAS (2026-08-05, Observation 97).
// Until now both this file and `compliance-preflight/scan.js` typed out `HARD`
// and `NEG` in full, under a comment reading "copied verbatim". That comment was
// true when written and was not a mechanism: nothing imported, nothing
// checksummed, no test asserted the two agreed, so the first fix applied to one
// side would have diverged them silently — and this is the copy `/wrap` wires
// into the COMMIT GATE, i.e. the one that would have kept gating while the other
// got fixed. Same defect and same remedy as `db-owned-keys.json` above: one
// definition, both sides require it.
//
// The pre-flight scanner additionally carries frontmatter-only suppression
// machinery (`FM_BLOCK` / `foldedMap` / `trailingContrastiveNegation`). It is
// deliberately NOT shared: it reconstructs YAML block scalars, and G5 scans the
// body only, so it could never fire here. Verified 2026-08-05 — the same
// hard-wrapped disclaimer is 🟢 OK in frontmatter and 🔴 HARD in the body from
// the same scanner.
const { HARD, NEG } = require('../compliance-preflight/compliance-tables');

// ── The state vocabularies. NOTHING IN THIS FILE GATES ON THEM ANY MORE, and that is not an
// oversight: `status` no longer appears in frontmatter for either an asset or a rendition, so
// there is no local value left to order. They are kept for two live consumers:
//   1. `content-doctor` invariant 2 parses them out of this source and checks every live
//      `content_assets.status` / `content_renditions.status` against them (see the header).
//   2. the STATE check below quotes them, so a leftover `status:` is told what the vocabulary
//      is and where it now lives, instead of just being refused.
const STATUS_ORDER = { idea: 0, hooked: 1, scripted: 2, recorded: 3, edited: 4, approved: 5, done: 6 };
const REND_ORDER = { 'to-produce': 0, 'thumbnail-done': 1, scheduled: 2, published: 3, measured: 4 };
const CONTENT_TYPES = ['educational', 'personal-story', 'proof-result', 'objection-comparison'];
const FUNNEL_STAGES = ['TOFU', 'MOFU', 'BOFU', 'RETENTION'];
// PLATFORMS and FORMATS MIRROR the Supabase check constraints
// `content_renditions_platform_check` and `content_renditions_format_check`.
// They are not a list of channels currently in use, and must not be trimmed to one:
// a value the DB accepts but this file rejects makes the scanner HARD-fail
// legitimate rows, which is the deterministic floor under every transition failing
// open. That happened: substack, x and newsletter were live in the DB and rejected
// here from 2026-07-19 to 2026-08-01, found by `content-doctor` invariant 2.
// When the constraint changes, change these in the same edit.
const PLATFORMS = ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'substack', 'x', 'threads', 'bluesky', 'pinterest', 'google-business', 'twitch'];
const FORMATS = ['reel', 'short', 'long-form', 'link-post', 'text-post', 'newsletter', 'story', 'carousel', 'thread', 'image-post', 'video'];
const THUMBS = ['9x16', '1280x720', '1200x630', 'none'];

// ── The Phase 1 split, as two tables the scanner can actually apply.
//
// A key on the left is IDENTITY or CRAFT: a human types it while writing, a diff of it is
// meaningful, and review is possible. A key on the right is STATE: an integration writes it
// (the scheduler, the sign-off sync, the publisher webhook), so the database is what those
// integrations read and write, and a copy here is a second home for a fact that has one.
// The test is always the same: WHO CHANGES IT.
const FILE_OWNED = [
  'slug', 'title', 'content_type', 'funnel_stage', 'funnel_job', 'awareness',
  'cta', 'channel', 'marker', 'canonical_asset', 'series', 'renditions',
];
const FILE_OWNED_REND = ['platform', 'format', 'thumb'];

// THE DUPLICATION IS GONE, AND THIS IS WHERE IT WAS. Until 2026-08-01 the list of database-owned
// keys was typed out here, AGAIN in `content-doctor.ts` (`I9_FLAT` / `I9_REND`), and a third time
// in `content-sync.ts`. They had already diverged: the doctor was missing `unipile_account` and
// `thumb_confirmed`, and the doctor is the NIGHTLY AUTOMATED alarm while this file is hand-run, so
// the weaker list was the one nobody has to remember to run. Two copies of one fact, one of them
// updated, no alarm, is the exact defect Phase 1 exists to remove. Keith ruled: consolidate, and
// the strict superset wins.
//
// `db-owned-keys.json` is now the single definition. It is JSON because this file is zero-dep
// CommonJS run by `node`, not tsx, and it cannot import TypeScript out of the frontend; JSON is
// the one format both sides take as a real import rather than by parsing each other's source. It
// sits in this directory because that makes the require a bare relative path with no arithmetic
// to get wrong from an unexpected cwd, which is a failure mode this scanner has already had once.
//
// FOUR NAMES DIFFER BETWEEN THE TWO SPELLINGS, which is why the JSON writes the mapping out rather
// than deriving it: `drive` is `drive_url`, `approved_date` is `approved_at`, `url` is
// `external_url`, `publish_date` is `published_at`. A reader transforming the name themselves gets
// three of the four wrong.
//
// DO NOT RE-TYPE THESE LISTS HERE. `test-content-doctor.ts` runs this scanner over a fixture
// carrying every watched key and fails unless it refuses exactly the doctor's map, owner strings
// included, so a local list that disagrees is caught rather than trusted.
const DB_OWNED_KEYS = require('./db-owned-keys.json');
const DB_OWNED = ownerMap(DB_OWNED_KEYS.asset, 'asset');
const DB_OWNED_REND = ownerMap(DB_OWNED_KEYS.rendition, 'rendition');

// Every spelling of every fact -> the owner a message will name. The doctor's `ownerMap` applies
// the identical rule to the identical file. A `column: null` with no `retiredAs` would print
// "duplicates undefined", a wrong fact inside a report about wrong facts, so it is refused here
// rather than rendered.
function ownerMap(entries, side) {
  if (!Array.isArray(entries) || !entries.length) {
    die(`db-owned-keys.json: "${side}" is missing or empty. An empty watch list refuses nothing, and this scanner would then report a clean board over a dual store.`);
  }
  const out = {};
  for (const e of entries) {
    if (!e || !e.key) die(`db-owned-keys.json: an entry under "${side}" has no key`);
    const owner = e.column
      ? (e.ownerNote ? `${e.column} (${e.ownerNote})` : e.column)
      : e.retiredAs;
    if (!owner) die(`db-owned-keys.json: "${e.key}" has no column and no retiredAs, so nothing can say what owns it`);
    for (const k of [e.key].concat(e.aliases || [])) {
      if (Object.prototype.hasOwnProperty.call(out, k)) die(`db-owned-keys.json: "${k}" is listed twice under "${side}"`);
      out[k] = owner;
    }
  }
  return out;
}

// ── The generated state block. `content-sync` writes it from the database and owns it
// completely; these prefixes are matched exactly as content-sync matches them, on the PREFIX,
// so a reworded opening marker is still found.
const GEN_BEGIN = '<!-- BEGIN GENERATED STATE';
const GEN_END = '<!-- END GENERATED STATE';

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

// ── Locate the generated state block inside the body.
//
// Returns { begin, end } as body indices to SKIP, or nulls plus `damaged`. A damaged or
// duplicated marker pair skips NOTHING and is reported: the failure mode to avoid is a stray
// unclosed BEGIN silently excluding the rest of the file from the compliance pass. Guessing at
// a boundary and going quiet is worse than scanning a block that will be overwritten anyway.
function generatedSpan(body) {
  const begins = [];
  const ends = [];
  for (let i = 0; i < body.length; i++) {
    const t = body[i].text.trimStart();
    if (t.startsWith(GEN_BEGIN)) begins.push(i);
    else if (t.startsWith(GEN_END)) ends.push(i);
  }
  if (!begins.length && !ends.length) return { begin: -1, end: -1, damaged: false, begins: 0, ends: 0 };
  if (begins.length === 1 && ends.length === 1 && ends[0] > begins[0]) {
    return { begin: begins[0], end: ends[0], damaged: false, begins: 1, ends: 1 };
  }
  return { begin: -1, end: -1, damaged: true, begins: begins.length, ends: ends.length };
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

// ── Scan one asset. Returns { hard: [...], review: [...] } message strings.
function scanFile(file) {
  const hard = [];
  const review = [];
  const H = (gate, msg, extra) => hard.push(`\n🔴 HARD  ${file}  [${gate}] ${msg}${extra ? `\n   → ${extra}` : ''}`);
  const R = (msg, extra) => review.push(`\n🟠 REVIEW ${file}  ${msg}${extra ? `\n   ${extra}` : ''}`);

  const raw = fs.readFileSync(file, 'utf8');
  const { flat, renditions, body, hasFrontmatter } = parseAsset(raw);

  // ---- Required keys + enum validation.
  if (!hasFrontmatter) H('SCHEMA', 'No frontmatter block found (expected --- delimited).');

  const slug = flat.slug || '';
  if (!slug) H('SCHEMA', 'Missing required key: slug.');
  // `title` is required alongside `slug` because after Phase 1 they are the only two keys a
  // file cannot do its remaining job without: slug is the sole join to the database row, and
  // title is what every board, mirror and report renders. Nothing else is load-bearing enough.
  if (!(flat.title || '').trim()) H('SCHEMA', 'Missing required key: title.');

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

  if (flat.content_type && !CONTENT_TYPES.includes(flat.content_type)) H('SCHEMA', `Unknown content_type "${flat.content_type}".`, `Allowed: ${CONTENT_TYPES.join(', ')}.`);
  if (flat.funnel_stage && !FUNNEL_STAGES.includes(flat.funnel_stage)) H('SCHEMA', `Unknown funnel_stage "${flat.funnel_stage}".`, `Allowed: ${FUNNEL_STAGES.join(', ')}.`);

  renditions.forEach((r, i) => {
    const tag = `rendition #${i + 1}`;
    if (r.platform && !PLATFORMS.includes(r.platform)) H('SCHEMA', `Unknown platform "${r.platform}" (${tag}).`, `Allowed: ${PLATFORMS.join(', ')}.`);
    if (r.format && !FORMATS.includes(r.format)) H('SCHEMA', `Unknown format "${r.format}" (${tag}).`, `Allowed: ${FORMATS.join(', ')}.`);
    if (r.thumb && !THUMBS.includes(r.thumb)) H('SCHEMA', `Unknown thumb "${r.thumb}" (${tag}).`, `Allowed: ${THUMBS.join(', ')}.`);
  });

  // ---- STATE: a state key in frontmatter is the dual store growing back.
  //
  // This is the check that replaces G1 to G4, and it is the only one of the five that this
  // file can still perform honestly. `in` rather than truthiness on purpose: a bare `ewa_task:`
  // with no value is still a second home for a fact `content_assets` owns, and an empty one is
  // WORSE than a filled one, because it reads as "no Ewa task" to anyone who trusts it.
  //
  // The remedy is always to delete the key, never to correct it. If the value here is the right
  // one and the database is wrong, fix the database: the generated block will then say so on
  // the next `content-sync` run, and the file gets to stay a file about the idea.
  const stateFix = 'Delete the key. Change state in the database; the generated block below the frontmatter is the read-only mirror of it.';
  for (const key of Object.keys(flat)) {
    if (Object.prototype.hasOwnProperty.call(DB_OWNED, key)) {
      const vocab = key === 'status' ? ` Values: ${Object.keys(STATUS_ORDER).join(' | ')}.` : '';
      H('STATE', `frontmatter carries "${key}", which is state the database owns (${DB_OWNED[key]}).${vocab}`, stateFix);
    } else if (!FILE_OWNED.includes(key)) {
      // Cannot be classified, so it is not claimed either way. An unrecognised key is either a
      // new identity field (legitimate: add it to FILE_OWNED in the same edit that introduces
      // it) or a state field being smuggled back in under a name this table does not know.
      // Nothing in the file distinguishes them, so a human decides and this does not block.
      R(`frontmatter key "${key}" is not in the identity/craft schema.`, 'If it is identity or craft, add it to FILE_OWNED in scan.js. If a machine writes it, it is state and belongs in content_assets, not here.');
    }
  }
  renditions.forEach((r, i) => {
    const tag = `rendition #${i + 1}${r.platform ? ` (${r.platform}/${r.format || '?'})` : ''}`;
    for (const key of Object.keys(r)) {
      if (Object.prototype.hasOwnProperty.call(DB_OWNED_REND, key)) {
        const vocab = key === 'status' ? ` Values: ${Object.keys(REND_ORDER).join(' | ')}.` : '';
        H('STATE', `${tag} carries "${key}", which is state the database owns (${DB_OWNED_REND[key]}).${vocab}`, stateFix);
      } else if (!FILE_OWNED_REND.includes(key)) {
        R(`${tag} has key "${key}", which is not in the identity/craft schema.`, 'Which renditions EXIST is craft (platform, format, thumb). What each one is DOING is state and lives in content_renditions.');
      }
    }
  });

  // ---- G5: compliance HARD table + dash checks over the BODY only.
  //
  // The generated state block is skipped. It is written by `content-sync` from the database and
  // never ships anywhere, and a HARD hit inside it would be unfixable by definition: editing it
  // changes nothing and the next sync restores the offending text. A canonical article slug
  // containing "treatment" is enough to trip the table, and the only real remedy would be to
  // rename a published article to appease a scanner. The block is excluded, so the failure and
  // its remedy stay in the same place.
  const gen = generatedSpan(body);
  if (gen.damaged) {
    R(`generated-state markers are damaged (${gen.begins} BEGIN, ${gen.ends} END).`, 'content-sync owns that block and will refuse this file until the markers are a single clean pair. The compliance pass scanned the whole body rather than trusting a broken boundary.');
  }
  for (let i = 0; i < body.length; i++) {
    if (gen.begin >= 0 && i >= gen.begin && i <= gen.end) continue;
    const { n, text } = body[i];
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

  // ---- The stale-asset advisory used to live here and is NOT reimplemented.
  // It listed assets sitting between `hooked` and `edited` for over 14 days. File mtime is
  // still readable, but staleness is mtime AND status, and status is gone: an untouched `done`
  // asset is finished, not stale, and a scanner that cannot tell them apart would report the
  // whole library as stuck. Staleness is now a database question. `content-doctor` invariant 4
  // covers the sharpest case (a scheduled rendition whose slot has passed); the general
  // hooked..edited version is not built anywhere yet, and /content-status computes it from
  // content_assets when it renders the board.

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

// Scanning NOTHING is not passing. The guard used to require `!missing.length` too, so
// running from the wrong cwd populated `missing`, skipped the guard, scanned 0 files and
// exited 0: a green light from a gate that checked nothing. Found 2026-08-01 by running
// this from `09_website-app/frontend`. Same defect `content-doctor` was blocked on before
// it shipped: an unperformed check must never report as a pass.
if (!files.length) {
  die(missing.length
    ? `no *.md asset files found (${missing.length} path(s) did not resolve, first: ${missing[0]}). Run from the repo root: the asset paths are relative to it.`
    : 'no *.md asset files found');
}

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
if (totalHard) console.log('HARD hits block: fix the file. This scanner checks the frontmatter schema, YAML safety and body compliance only.');
if (totalReview) console.log('REVIEW items are advisories; a human decides, they do not block.');
if (!totalHard && !totalReview && files.length) console.log('Schema, YAML and compliance clean. The pipeline gates are in the database (20260801_content_state_guards.sql), not here.');
process.exit(totalHard ? 2 : 0);
