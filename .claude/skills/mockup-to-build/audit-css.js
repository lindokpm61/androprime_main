#!/usr/bin/env node
/**
 * audit-css.js — the four defects a mockup-to-build port keeps producing, each
 * of which is invisible to every check a frontend normally has.
 *
 * All four share one shape: the SOURCE is correct and the OUTPUT is not, so a
 * reviewer reading the stylesheet sees the right instruction and a reviewer
 * looking at the page sees a plausible result. Nothing errors, nothing fails a
 * typecheck, nothing shows in a diff.
 *
 *   1. ORPHAN      a rule whose markup counterpart is never emitted. Silent,
 *                  permanent, and a written record of work someone designed and
 *                  nobody built. (OBS-524, OBS-569)
 *   2. DUPLICATE   two rule blocks for one selector, where the later silently
 *                  wins. Not untidiness: a latent defect whose trigger is the
 *                  next person to edit the wrong copy. (OBS-544)
 *   3. LOSING      an override written at LOWER specificity than the rule it
 *                  exists to overturn — most damagingly inside
 *                  `@media (prefers-reduced-motion)`, where a media query adds
 *                  no specificity and the accessibility branch therefore never
 *                  fires. A branch that cannot win is worse than a missing one:
 *                  the missing branch reads as an absence, the losing branch
 *                  reads as a considered implementation. (OBS-665, OBS-549,
 *                  OBS-530, OBS-366)
 *   4. LITERAL     a hardcoded colour outside the token block. Every literal is
 *                  a permanent opt-out of theming, invisible for exactly as
 *                  long as it happens to match the ramp it sits on. (OBS-640)
 *
 * Usage (from repo root):
 *   node .claude/skills/mockup-to-build/audit-css.js <stylesheet> [--src <dir>]
 *   node .claude/skills/mockup-to-build/audit-css.js <mockup.html>
 *
 *   --src <dir>   where to look for call sites (repeatable). Defaults to the
 *                 frontend app + components tree. Ignored for a .html mockup,
 *                 which is its own call site.
 *   --only <n>    run one check: orphan | duplicate | losing | literal
 *
 * Exit code: 1 on any finding, 0 when clean, 2 on a usage error. THIS TOOL
 * REPORTS; it never edits. Every finding needs a human to decide whether the
 * rule is unbuilt work, dead work, or a real defect.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
  const src = fs.readFileSync(__filename, 'utf8');
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n');
  process.exit(argv.length ? 0 : 2);
}

function optAll(flag) {
  const out = [];
  argv.forEach((a, i) => { if (a === flag && i < argv.length - 1) out.push(argv[i + 1]); });
  return out;
}
const only = (optAll('--only')[0] || '').toLowerCase();
const target = argv[0];
if (!fs.existsSync(target)) { console.error(`no such file: ${target}`); process.exit(2); }

const isHtml = /\.html?$/i.test(target);
const raw = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');

// For a mockup, the stylesheet and its call sites are the same file.
const css = isHtml
  ? (raw.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []).map((b) => b.replace(/<\/?style[^>]*>/gi, '')).join('\n')
  : raw;

let srcDirs = optAll('--src');
if (!srcDirs.length) {
  const fe = 'andro-prime/09_website-app/frontend';
  srcDirs = isHtml ? [] : [`${fe}/app`, `${fe}/components`, `${fe}/content`];
}

// ── source text of every call site ──────────────────────────────────────────
function walk(dir, acc) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|jsx?|mdx?|html?)$/i.test(e.name)) {
      try { acc.push(fs.readFileSync(p, 'utf8')); } catch { /* unreadable, skip */ }
    }
  }
  return acc;
}
const callSiteText = isHtml ? raw : srcDirs.reduce((acc, d) => walk(d, acc), []).join('\n');

// ── a very small CSS reader ─────────────────────────────────────────────────
// Deliberately not a parser: it reads selector text and declaration bodies, and
// records the at-rule context each block sits in. That is everything the four
// checks need, and a real parser would be a dependency this repo does not carry.
function readBlocks(text) {
  const blocks = [];
  const stack = [];
  let buf = '';
  let i = 0;
  const line = (idx) => text.slice(0, idx).split('\n').length;
  while (i < text.length) {
    const c = text[i];
    if (c === '/' && text[i + 1] === '*') { const e = text.indexOf('*/', i + 2); i = e === -1 ? text.length : e + 2; continue; }
    if (c === '{') {
      const head = buf.trim();
      buf = '';
      if (head.startsWith('@')) { stack.push(head); i++; continue; }
      // a declaration block: read to its matching close
      let depth = 1, j = i + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      blocks.push({ selector: head, body: text.slice(i + 1, j - 1), at: stack.slice(), line: line(i) });
      i = j;
      continue;
    }
    if (c === '}') { stack.pop(); buf = ''; i++; continue; }
    buf += c;
    i++;
  }
  return blocks;
}

const blocks = readBlocks(css);

// CSS specificity of a single compound selector, as [ids, classes, elements].
// Pseudo-elements count as elements, pseudo-classes as classes; :not()/:is()
// take the specificity of their argument, which is the case that matters here.
function specificity(sel) {
  let s = sel
    .replace(/::[a-z-]+/gi, ' ELEM ')
    .replace(/:(not|is|has|where)\(([^)]*)\)/gi, (m, fn, inner) => (fn.toLowerCase() === 'where' ? ' ' : ' ' + inner + ' '));
  const ids = (s.match(/#[\w-]+/g) || []).length;
  const classes = (s.match(/\.[\w-]+/g) || []).length
    + (s.match(/\[[^\]]+\]/g) || []).length
    + (s.match(/:[a-z-]+(\([^)]*\))?/gi) || []).length;
  const elems = (s.replace(/[#.][\w-]+|\[[^\]]+\]|:[a-z-]+(\([^)]*\))?/gi, ' ')
    .match(/\b[a-z][\w-]*\b/gi) || []).filter((t) => t !== 'ELEM').length
    + (s.match(/ELEM/g) || []).length;
  return [ids, classes, elems];
}
const specCmp = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);
const specStr = (a) => `(${a[0]},${a[1]},${a[2]})`;

function propsOf(body) {
  const out = new Set();
  for (const m of body.matchAll(/(^|;)\s*([-a-z]+)\s*:/gi)) out.add(m[2].toLowerCase());
  return out;
}

const findings = [];
const want = (name) => !only || only === name;

// ── 1. ORPHAN ───────────────────────────────────────────────────────────────
if (want('orphan') && callSiteText) {
  const declared = new Map();
  for (const b of blocks) {
    for (const part of b.selector.split(',')) {
      for (const m of part.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
        if (!declared.has(m[1])) declared.set(m[1], b.line);
      }
    }
  }
  const orphans = [];
  for (const [cls, ln] of declared) {
    // A class is used if it appears as a whole word anywhere in the call sites.
    const re = new RegExp('(^|[^\\w-])' + cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^\\w-]|$)');
    if (!re.test(callSiteText)) orphans.push({ cls, ln });
  }
  for (const o of orphans) {
    // KNOWN FALSE-POSITIVE MODE, stated rather than silently tolerated: a class
    // assembled at runtime (`f-c-${n}`, clsx with a computed suffix) has no
    // whole-word occurrence to find. Before calling an orphan dead, grep for
    // the stem without its suffix. The check is still worth running because
    // the other direction — a rule nobody built — is silent forever.
    findings.push(`ORPHAN     ${target}:${o.ln}  .${o.cls} is declared and never emitted` +
      (/-\d+$/.test(o.cls) ? '  [numeric suffix: check for a runtime-built class name before ruling it dead]' : ''));
  }
}

// ── 2. DUPLICATE ────────────────────────────────────────────────────────────
if (want('duplicate')) {
  const seen = new Map();
  for (const b of blocks) {
    const key = b.at.join('|') + '::' + b.selector.replace(/\s+/g, ' ').trim();
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(b);
  }
  for (const [key, list] of seen) {
    if (list.length < 2) continue;
    // Only a real hazard when the two blocks set the same property.
    const shared = new Set();
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (const p of propsOf(list[i].body)) if (propsOf(list[j].body).has(p)) shared.add(p);
      }
    }
    if (!shared.size) continue;
    const sel = key.split('::').pop();
    findings.push(
      `DUPLICATE  ${target}:${list.map((b) => b.line).join(',')}  «${sel}» declared ${list.length} times; ` +
      `the later block wins for: ${[...shared].join(', ')}`
    );
  }
}

// ── 3. LOSING ───────────────────────────────────────────────────────────────
if (want('losing')) {
  for (const b of blocks) {
    if (!b.at.some((a) => /@media/i.test(a) && /prefers-reduced-motion|prefers-contrast|forced-colors/i.test(a))) continue;
    const bProps = propsOf(b.body);
    for (const part of b.selector.split(',')) {
      const sel = part.trim();
      if (!sel) continue;
      const mySpec = specificity(sel);
      // Any rule OUTSIDE this media block whose selector ends with the same
      // compound and which sets a property this override is trying to reset.
      for (const other of blocks) {
        if (other === b) continue;
        if (other.at.some((a) => /prefers-reduced-motion|prefers-contrast|forced-colors/i.test(a))) continue;
        for (const op of other.selector.split(',')) {
          const os = op.trim();
          if (!os || os === sel) continue;
          if (!os.endsWith(sel) && !os.endsWith(sel.replace(/^\./, ' .'))) continue;
          const overlap = [...bProps].filter((p) => propsOf(other.body).has(p));
          if (!overlap.length) continue;
          if (specCmp(specificity(os), mySpec) > 0) {
            findings.push(
              `LOSING     ${target}:${b.line}  «${sel}» ${specStr(mySpec)} inside ${b.at.join(' ')}\n` +
              `           loses to «${os}» ${specStr(specificity(os))} at line ${other.line} for: ${overlap.join(', ')}\n` +
              `           A media query adds no specificity. This branch never fires.`
            );
          }
        }
      }
    }
  }
}

// ── 4. LITERAL ──────────────────────────────────────────────────────────────
if (want('literal')) {
  // Colour literals outside a :root / token block are opt-outs of theming.
  const lines = css.split('\n');
  // Comment lines are prose ABOUT colours and are full of them — this file's
  // own rationale comments quote measured contrast ratios. Scanning them
  // reported six literals that were sentences. (The same defect, in the same
  // shape, as the compliance scanner's CODE-COMMENT bucket: a line-local test
  // that cannot see a block comment's continuation lines.)
  const commentLines = new Set();
  {
    let open = false;
    lines.forEach((ln, i) => {
      const n = i + 1;
      if (open) commentLines.add(n);
      let j = 0;
      while (j < ln.length - 1) {
        if (!open && ln[j] === '/' && ln[j + 1] === '*') { open = true; commentLines.add(n); j += 2; continue; }
        if (open && ln[j] === '*' && ln[j + 1] === '/') { open = false; j += 2; continue; }
        j++;
      }
    });
  }
  const tokenBlockLines = new Set();
  for (const b of blocks) {
    if (/^:root|\[data-theme|^html\b/i.test(b.selector.trim())) {
      const start = b.line;
      const len = b.body.split('\n').length;
      for (let k = start; k <= start + len; k++) tokenBlockLines.add(k);
    }
  }
  lines.forEach((ln, i) => {
    const n = i + 1;
    if (tokenBlockLines.has(n)) return;
    if (commentLines.has(n)) return;
    if (/^\s*(\/\*|\*)/.test(ln)) return;
    const m = ln.match(/(#[0-9a-f]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\))/i);
    if (!m) return;
    if (/var\(--/.test(ln)) return;                 // already themed alongside
    if (/transparent|currentColor|inherit/i.test(m[1])) return;
    findings.push(`LITERAL    ${target}:${n}  ${m[1]} outside the token block — a permanent opt-out of theming\n           ${ln.trim().slice(0, 100)}`);
  });
}

// ── report ──────────────────────────────────────────────────────────────────
const order = { LOSING: 0, DUPLICATE: 1, ORPHAN: 2, LITERAL: 3 };
findings.sort((a, b) => order[a.slice(0, 9).trim()] - order[b.slice(0, 9).trim()]);

if (!findings.length) {
  console.log(`audit-css: clean — ${blocks.length} rule blocks read in ${target}` +
    (only ? ` (only: ${only})` : '') +
    (callSiteText ? '' : '  [no call sites searched, so ORPHAN did not run]'));
  process.exit(0);
}
for (const f of findings) console.log(f);
const counts = findings.reduce((a, f) => { const k = f.slice(0, 9).trim(); a[k] = (a[k] || 0) + 1; return a; }, {});
console.log(`\n${findings.length} finding(s) across ${blocks.length} rule blocks: ` +
  Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', '));
console.log('Each needs a human ruling: unbuilt work, dead work, or a live defect. This tool never edits.');
process.exit(1);
