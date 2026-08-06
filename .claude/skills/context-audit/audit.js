#!/usr/bin/env node
/**
 * CONTEXT.md drift check: does each workspace's durable doc still match its disk?
 *
 * WHY THIS EXISTS (Observation 13, 2026-07-25). A repo-wide manual audit of all
 * 17 CONTEXT.md files found systemic drift: one listed 16 of 31 files, another
 * omitted whole subtrees, several "this directory does not exist" claims were
 * false, one pointed at a financial model that does not exist, and one labelled
 * the LIVE-SERVED canonical-site/ as "safe to delete" — an active deletion
 * hazard against production pages. Nothing checks any of this, so the drift is
 * invisible until someone pays for a full manual pass.
 *
 * WHAT IT CHECKS (all mechanical, no judgement):
 *   BROKEN    a backticked path the CONTEXT names that does not exist on disk
 *   STALE     a "does not exist / not created yet" claim about a path that DOES exist
 *   UNLISTED  a significant child directory on disk the CONTEXT never mentions
 *
 * WHAT IT DOES NOT CHECK, stated rather than glossed: whether the prose is
 * accurate, whether a described file still does what it says, or whether a
 * pointer is semantically right. A clean run means the paths resolve, not that
 * the document is true. An unperformed check must never read as a pass.
 *
 * Only BACKTICKED paths are checked. Prose mentions are deliberately ignored:
 * scanning them produces false positives faster than anyone will read them, and
 * a checker people learn to dismiss is worse than no checker.
 *
 * Usage (from repo root):
 *   node .claude/skills/context-audit/audit.js [workspace ...]
 * Default: every andro-prime/NN_* workspace with a CONTEXT.md.
 *
 * Exit: 0 clean, 2 drift found, 1 could not run (never read exit 1 as a pass).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = 'andro-prime';
// Directories that are noise in every workspace.
const IGNORE_DIR = new Set(['node_modules', '.git', '.next', 'dist', 'build', '__pycache__']);
// A backticked token is treated as a path only if it looks like one.
const PATHISH = /[\/]/;
const FILE_EXT = /\.(md|mdx|ts|tsx|js|jsx|json|sql|ya?ml|css|html|txt|sh|ps1|cmd)$/i;
// Phrases that assert absence. Checked against the line carrying the path.
const ABSENCE = /\b(does not exist|doesn't exist|not created|not yet created|no longer exists|has been deleted|was removed|not present|does not yet exist)\b/i;

function die(msg) {
  console.error(`\n🔴 CANNOT RUN: ${msg}`);
  console.error('Exit 1 is not a pass. Nothing was audited, so nothing is cleared.');
  process.exit(1);
}

function workspaces(argv) {
  if (argv.length) return argv.map((a) => a.replace(/[\\/]+$/, ''));
  if (!fs.existsSync(ROOT)) die(`${ROOT}/ not found — run from the repo root`);
  return fs.readdirSync(ROOT)
    .filter((d) => /^\d\d_/.test(d))
    .map((d) => path.join(ROOT, d))
    .filter((d) => fs.existsSync(path.join(d, 'CONTEXT.md')));
}

// Every backticked token in the doc that looks like a path, with its line.
function citedPaths(src) {
  const out = [];
  src.split('\n').forEach((line, i) => {
    // Skip fenced-block fences themselves; tree diagrams are prose-ish and are
    // covered by the UNLISTED check rather than the BROKEN one.
    for (const m of line.matchAll(/`([^`\n]+)`/g)) {
      const raw = m[1].trim().replace(/[.,;:)]+$/, '');
      if (!raw || raw.includes(' ') || raw.startsWith('http')) continue;
      if (!PATHISH.test(raw) && !FILE_EXT.test(raw)) continue;
      if (/^[A-Z_]+=/.test(raw)) continue;                 // env assignments
      if (raw.startsWith('--') || raw.startsWith('/')) continue; // flags, absolute routes
      if (PLACEHOLDER.test(raw)) continue;                 // naming patterns, not paths
      if (/^[A-Z][A-Z0-9_]+$/.test(raw.replace(/\.\w+$/, ''))) continue; // CONSTANT_NAME.md
      if (/["'()=]/.test(raw)) continue;                   // code fragments: redirect('/account'
      if (raw.startsWith('@')) continue;                   // npm scope: @supabase/ssr
      // A citation is only checkable as a path if it carries a recognised file
      // extension or is explicitly a directory (trailing slash). Without this,
      // every bare module specifier and MIME type reads as a broken path:
      // `next-mdx-remote/rsc`, `next/font`, `application/json`.
      if (!FILE_EXT.test(raw) && !/\/$/.test(m[1])) continue;
      // An absence claim is attributed to a path only if it appears AFTER that
      // path and close to it. Matching the whole line cannot tell which path a
      // claim is about, and one line routinely carries several: "`checklists/`
      // does not exist; `dashboards/` and `weekly-reviews/` exist but are empty"
      // asserts absence for the first and presence for the other two. Line-level
      // matching flagged all three.
      const after = line.slice(m.index + m[0].length, m.index + m[0].length + 60);
      out.push({ raw, line: i + 1, text: line, claimsAbsent: ABSENCE.test(after) });
    }
  });
  return out;
}

// A cited token that is a NAMING PATTERN or template, not a path on disk.
// Flagging these is the fastest way to make the audit unreadable: the first run
// reported 198 BROKEN, of which the overwhelming majority were placeholders,
// home-relative paths and paths nested one level deeper than the workspace. A
// checker that floods is a checker people learn to dismiss, which is worse than
// no checker at all — the same dynamic that made the old whole-file em-dash
// guard a no-op.
const PLACEHOLDER = /[<>\[\]{}*]|\bNN\b|YYYY|MM-DD|\.\.\./;

// Index every path under a workspace once, as posix-style relative strings, so
// a cited path can be matched as a SUFFIX. This is what makes
// `lib/results/normaliser.ts` resolve when the CONTEXT sits one level above
// `frontend/`, without hardcoding any project's nesting.
const indexCache = new Map();
function pathIndex(ws) {
  if (indexCache.has(ws)) return indexCache.get(ws);
  const all = [];
  const walk = (dir, depth) => {
    if (depth > 8) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (IGNORE_DIR.has(e.name)) continue;
      const full = path.join(dir, e.name);
      all.push(path.relative(ws, full).split(path.sep).join('/'));
      if (e.isDirectory()) walk(full, depth + 1);
    }
  };
  walk(ws, 0);
  indexCache.set(ws, all);
  return all;
}

function resolves(ws, raw) {
  let clean = raw.replace(/^\.\//, '').replace(/[\\/]+$/, '');
  if (!clean) return true;

  // Home-relative paths live outside the repo; resolve them directly.
  if (clean.startsWith('~/')) {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    return fs.existsSync(path.join(home, clean.slice(2)));
  }

  // Repo-rooted citations (andro-prime/..., .claude/..., .github/...).
  if (fs.existsSync(clean)) return true;
  if (fs.existsSync(path.join(ROOT, clean))) return true;
  if (fs.existsSync(path.join(ws, clean))) return true;

  // Otherwise: does any real path under this workspace END WITH the citation?
  const needle = '/' + clean;
  if (pathIndex(ws).some((p) => p === clean || p.endsWith(needle))) return true;

  // Finally, the repo-wide index. CONTEXT files legitimately cite files owned by
  // OTHER workspaces (06_marketing names `draft-writer.ts`, which lives under
  // 09_website-app), and without this every cross-workspace pointer reads as
  // broken. Deliberately the last resort and deliberately permissive: on a drift
  // check a missed finding costs far less than a flood of false ones, because a
  // flood is what stops the check being read at all.
  return pathIndex(ROOT).some((p) => p === clean || p.endsWith(needle));
}

// A gitignored directory is not part of the documented structure, so its absence
// from a CONTEXT is correct rather than drift. `graphify-out/` is generated,
// ignored, and documented in the root CLAUDE.md instead — reporting it trains
// the reader to skim the UNLISTED bucket, which is where the real omissions are.
function notIgnored(ws, names) {
  if (!names.length) return names;
  try {
    const { execFileSync } = require('child_process');
    // Forward slashes are mandatory: git check-ignore silently matches NOTHING
    // for a backslash path on Windows and exits 1, which this function would
    // then read as "nothing is ignored" — failing toward reporting everything.
    const input = names.map((n) => path.join(ws, n).split(path.sep).join('/')).join('\n');
    const out = execFileSync('git', ['check-ignore', '--stdin'], { input, encoding: 'utf8' });
    const ignored = new Set(out.split(/\r?\n/).map((l) => path.basename(l.trim())).filter(Boolean));
    return names.filter((n) => !ignored.has(n));
  } catch (e) {
    // git exits 1 when NOTHING is ignored, which is the common case.
    if (e.status === 1) return names;
    return names;   // git unavailable: report everything rather than silently skipping
  }
}

function childDirs(ws) {
  const names = fs.readdirSync(ws, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !IGNORE_DIR.has(e.name) && !e.name.startsWith('.'))
    .map((e) => e.name);
  return notIgnored(ws, names);
}

const targets = workspaces(process.argv.slice(2));
if (!targets.length) die('no workspaces with a CONTEXT.md were found');

let broken = 0, stale = 0, unlisted = 0, audited = 0;

for (const ws of targets) {
  const ctx = path.join(ws, 'CONTEXT.md');
  if (!fs.existsSync(ctx)) { console.log(`SKIP  ${ws} (no CONTEXT.md)`); continue; }
  const src = fs.readFileSync(ctx, 'utf8').replace(/\r\n/g, '\n');
  audited++;
  const findings = [];

  const cited = citedPaths(src);
  const seen = new Set();
  for (const c of cited) {
    if (seen.has(c.raw)) continue;
    seen.add(c.raw);
    const exists = resolves(ws, c.raw);
    if (!exists && !c.claimsAbsent) {
      broken++;
      findings.push(`🔴 BROKEN   ${ctx}:${c.line}  \`${c.raw}\` does not resolve`);
    }
    if (exists && c.claimsAbsent) {
      stale++;
      findings.push(`🟠 STALE    ${ctx}:${c.line}  \`${c.raw}\` EXISTS, but the line claims it does not\n            ${c.text.trim().slice(0, 120)}`);
    }
  }

  for (const d of childDirs(ws)) {
    if (!src.includes(d)) {
      unlisted++;
      findings.push(`🟠 UNLISTED ${ctx}  directory \`${d}/\` exists on disk and is never mentioned`);
    }
  }

  if (findings.length) {
    console.log(`\n── ${ws} ${'─'.repeat(Math.max(0, 50 - ws.length))}`);
    for (const f of findings) console.log(f);
  }
}

const total = broken + stale + unlisted;
console.log(`\n${'─'.repeat(60)}`);
console.log(`Audited ${audited} CONTEXT.md file(s).  🔴 BROKEN: ${broken}   🟠 STALE: ${stale}   🟠 UNLISTED: ${unlisted}`);
console.log('Checked: do the backticked paths resolve, are absence-claims still true, is any child directory unmentioned.');
console.log('NOT checked: whether the prose is accurate. A clean run means the paths resolve, not that the document is true.');
if (total) {
  console.log(`\n${total} item(s) to review. BROKEN is usually a real fix; STALE and UNLISTED need a human to decide.`);
  process.exit(2);
}
process.exit(0);
