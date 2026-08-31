#!/usr/bin/env node
/**
 * reconcile-f-css.js: diff the Direction F component layer against itself.
 *
 * The component layer lives in FOURTEEN independent copies: a <style> block in
 * each of the 13 journey mockups, plus frontend/styles/components/f-primitives.css
 * in the app. Nothing reconciles them, and they have already drifted from each
 * other. This reports the drift. It changes nothing: with 14 copies and no ruling
 * yet on whether the results-* frames are deliberately denser than marketing, a
 * script that FIXED the drift would be picking a winner on Keith's behalf.
 *
 *   node andro-prime/12_operations/automation/reconcile-f-css.js [options]
 *
 * Options
 *   --mockups <dir>     mockup directory   (default design/mockups/journey)
 *   --primitives <file> the app stylesheet (default frontend/styles/components/f-primitives.css)
 *   --selector <name>   report only this selector, app-side name (e.g. .f-btn)
 *   --quiet             summary and exit code only
 *   --json              machine-readable output
 *   --help
 *
 * Exit codes, same shape as .claude/skills/wrap/reconcile-observations.js:
 *   0  the copies agree
 *   2  drift found
 *   1  could not run, which is NEVER a pass
 *
 * WHAT IT CATCHES, AND WHAT IT DOES NOT
 *
 * It compares DECLARATIONS. It found nothing on 2026-08-31 that a human had not
 * already found, because four of the six defects that day were ABSENCES: a class
 * the markup never emitted, a glyph never rendered. A declaration diff cannot see
 * those. The complementary check is a selector-count probe against the BUILT page
 * (does anything actually use .f-ticks li > span[aria-hidden]?), which belongs in
 * the screenshot harness, not here. Two different questions:
 *   this script  - do the copies of the spec agree with each other?
 *   the probe    - does the built page emit the markup the spec styles?
 *
 * NAMING. The mockups use bare class names (.btn, .sub, .step .no); the app
 * prefixes everything (.f-btn, .f-sub, .f-step .f-no). The mapping is mostly
 * mechanical, so it is done mechanically, and the irregulars live in ALIASES
 * below. Anything that cannot be paired is REPORTED rather than dropped: an
 * unpaired selector is either a missing alias or a component the app has not
 * ported yet, and both are worth seeing.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  const src = fs.readFileSync(__filename, 'utf8');
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n');
  process.exit(0);
}
function opt(flag, fallback) {
  const i = argv.indexOf(flag);
  return i === -1 || i === argv.length - 1 ? fallback : argv[i + 1];
}
const flag = (f) => argv.includes(f);

const REPO = path.resolve(__dirname, '../../..');
const WEB = path.join(REPO, 'andro-prime/09_website-app');
const mockupDir = path.resolve(opt('--mockups', path.join(WEB, 'design/mockups/journey')));
const primitivesFile = path.resolve(
  opt('--primitives', path.join(WEB, 'frontend/styles/components/f-primitives.css'))
);
const onlySelector = opt('--selector', null);
const quiet = flag('--quiet');
const asJson = flag('--json');

// Exit 1 is "could not run". Every precondition failure lands here, loudly.
function cannotRun(msg) {
  process.stderr.write(`reconcile-f-css: could not run\n  ${msg}\n`);
  process.exit(1);
}
if (!fs.existsSync(mockupDir)) cannotRun(`mockup directory not found: ${mockupDir}`);
if (!fs.existsSync(primitivesFile)) cannotRun(`primitives file not found: ${primitivesFile}`);

// ------------------------------------------------------------------ tables

/* Mockup token -> app token. The app's token file documents this mapping in its
   own comments ("F's --r", "F's --r-in") and the values are identical, so a
   mismatch here is a real conflict rather than a rename. */
const TOKENS = {
  '--r': '--radius-container',
  '--r-in': '--radius-inset',
  '--amb': '--shadow-ambient',
  '--ok': '--color-status-optimal',
  '--warn': '--color-status-warning',
  '--crit': '--color-status-critical',
};

/* Selector irregulars, applied AFTER the mechanical .x -> .f-x prefixing.
   Grow this list when the script reports an unpaired selector that does have a
   counterpart under a different name. */
const ALIASES = {
  '.f-btn.f-ghost': '.f-btn-ghost',
  '.f-btn.f-sm': '.f-btn-sm',
  '.f-step .f-foot': '.f-step .f-step-foot',
  '.f-step .f-foot b': '.f-step .f-step-foot b',
  '.f-hero .f-grid': '.f-herogrid',
  '.f-tray.f-dark': '.f-tray-dark',
  '.f-core.f-dark': '.f-core-dark',
};

/* The @apply utilities f-primitives.css actually uses. A closed set of 13.
   Unknown utilities are reported, not silently skipped: an unexpanded utility
   makes a property look mockup-only, which reads as drift that is not there. */
const APPLY = {
  flex: 'display:flex',
  'inline-flex': 'display:inline-flex',
  grid: 'display:grid',
  'flex-col': 'flex-direction:column',
  'flex-wrap': 'flex-wrap:wrap',
  'items-center': 'align-items:center',
  'items-start': 'align-items:flex-start',
  'items-baseline': 'align-items:baseline',
  'justify-between': 'justify-content:space-between',
  'justify-center': 'justify-content:center',
  'mx-auto': 'margin-left:auto;margin-right:auto',
  'w-full': 'width:100%',
  'px-5': 'padding-left:1.25rem;padding-right:1.25rem',
  'cursor-pointer': 'cursor:pointer',
  'font-serif': 'font-family:var(--font-serif)',
};
const unknownUtilities = new Set();

/* Deviations that are RULED, not drift. They are printed in their own bucket and
   do not set exit 2, because reporting a ruling as a defect trains the reader to
   ignore the report. Each needs a date and a reason. */
const RULED = [
  {
    match: (sel, prop, appVal) =>
      /(^\.f-h[1-4]$|\bh[1-4]$)/.test(sel) &&
      ['font-family', 'letter-spacing', 'font-weight', 'line-height'].includes(prop),
    reason:
      '2026-08-30 serif ruling: headings moved to --font-display and their tracking, ' +
      'weight and leading were re-judged rather than carried across',
  },
  {
    match: (sel, prop, appVal) => prop === 'font-family' && /--font-display/.test(appVal),
    reason: '2026-08-30 serif ruling: the mockups predate it and name Geist throughout',
  },
];

// ------------------------------------------------------------------ parsing

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Flat rule extraction. These stylesheets are flat plus @media, so the parser is
 * deliberately small: it tracks at-rule context and keys every rule by
 * "selector" or "selector @ condition", which is what stops a 980px override
 * being compared against the base rule it is supposed to override.
 */
function parseRules(css) {
  css = stripComments(css);
  const rules = [];
  let i = 0;
  const context = [];

  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    let head = css.slice(i, open).trim();

    if (head.startsWith('@')) {
      // At-rule with a block: descend, remembering the condition.
      const isConditional = /^@(media|supports|layer|container)/.test(head);
      /* The mockups write (min-width:980px) and the app writes (min-width: 980px).
         Left unnormalised, the two keys never match, and EVERY responsive rule on
         both sides files as unpaired: the tool goes silently blind to media
         queries, which is where a grid ratio drift was found by eye on
         2026-08-31 while this reported nothing. */
      context.push(isConditional ? head.replace(/\s+/g, ' ').replace(/:\s+/g, ':') : null);
      i = open + 1;
      continue;
    }

    // Ordinary rule: find its matching close brace.
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    if (head) {
      const cond = context.filter(Boolean).join(' and ');
      for (const sel of head.split(',')) {
        const s = sel.trim().replace(/\s+/g, ' ');
        if (s) rules.push({ selector: s, condition: cond, body });
      }
    }
    i = j;

    // Close any at-rule blocks that end here.
    while (context.length) {
      const next = css.slice(i).match(/^\s*\}/);
      if (!next) break;
      context.pop();
      i += next[0].length;
    }
  }
  return rules;
}

function parseDeclarations(body) {
  const out = {};
  for (let decl of body.split(';')) {
    decl = decl.trim();
    if (!decl) continue;

    if (decl.startsWith('@apply')) {
      for (const util of decl.replace('@apply', '').trim().split(/\s+/)) {
        if (!util) continue;
        if (!APPLY[util]) {
          unknownUtilities.add(util);
          continue;
        }
        for (const expanded of APPLY[util].split(';')) {
          const [p, v] = expanded.split(':');
          out[p.trim()] = v.trim();
        }
      }
      continue;
    }

    const c = decl.indexOf(':');
    if (c === -1) continue;
    const prop = decl.slice(0, c).trim().toLowerCase();
    const value = decl.slice(c + 1).trim();
    if (prop && value) out[prop] = value;
  }
  return out;
}

// ------------------------------------------------------------ normalisation

function normaliseSelector(sel, { prefix }) {
  let s = sel.replace(/\s+/g, ' ').trim();
  // The mockups write .sub+.sub where the app writes .f-sub + .f-sub. Same rule.
  s = s.replace(/\s*([+>~])\s*/g, ' $1 ');
  if (prefix) {
    // .x -> .f-x for every class token that is not already prefixed.
    s = s.replace(/\.([a-zA-Z][\w-]*)/g, (m, name) => (name.startsWith('f-') ? m : `.f-${name}`));
  }
  return ALIASES[s] || s;
}

/* Mockup presentation chrome. These exist to PRESENT the frames, not to be
   built: the frame labels, the annotation notes, the mockup's own JS hook.
   Reporting them as unported components buries the real candidates. Note that
   .f-wash and .f-grain are deliberately NOT here: whether the app should carry
   the page texture is a real question, so it stays visible. */
const SCAFFOLD = [/^\.f-flabel\b/, /^\.f-note\b/, /^\.f-js\b/, /^\.f-m$/];
const isScaffold = (sel) => SCAFFOLD.some((re) => re.test(sel));

function normaliseValue(prop, value) {
  let v = value.trim().toLowerCase().replace(/\s+/g, ' ');

  // Mockup tokens to app tokens.
  for (const [from, to] of Object.entries(TOKENS)) {
    v = v.split(`var(${from})`).join(`var(${to})`);
  }

  // Font stacks. The mockups spell the family out; the app uses a token.
  if (prop === 'font-family') {
    if (/mono/.test(v)) return 'var(--font-mono)';
    if (/\bgeist\b|\binter\b/.test(v) && !/var\(/.test(v)) return 'var(--font-sans)';
  }

  // A pill is a pill however it is spelled.
  if (/radius/.test(prop)) v = v.replace(/\b999px\b/g, 'var(--radius-pill)');

  // rem to px at a 16px root, so @apply px-5 (1.25rem) meets a mockup's 20px.
  v = v.replace(/(-?[\d.]+)rem\b/g, (m, n) => `${parseFloat(n) * 16}px`);

  // .5 and 0.5 are the same number; 0px and 0 are the same length. The mockups
  // write -.05em where the app writes -0.05em, which is the same tracking.
  v = v.replace(/(^|[\s(,:])(-?)\.(\d)/g, (m, pre, sign, d) => `${pre}${sign}0.${d}`);
  v = v.replace(/\b0(px|em|rem|%)\b/g, '0');

  // Cosmetic spacing inside functions and lists.
  v = v.replace(/\s*,\s*/g, ',').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
  return v.trim();
}

// ------------------------------------------------------------------ loading

function styleBlocks(html) {
  const out = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out.join('\n');
}

/** selector|condition -> { prop -> [{value, source}] } */
function index(rules, source, prefix, store) {
  for (const r of rules) {
    const sel = normaliseSelector(r.selector, { prefix });
    if (sel.startsWith(':root') || sel.startsWith('*') || sel === 'body' || sel === 'html') continue;
    if (!sel.startsWith('.f-')) continue; // components only, not element resets
    if (isScaffold(sel)) continue;
    const key = r.condition ? `${sel}  ${r.condition}` : sel;
    const decls = parseDeclarations(r.body);
    for (const [prop, value] of Object.entries(decls)) {
      const v = normaliseValue(prop, value);
      store[key] = store[key] || {};
      store[key][prop] = store[key][prop] || [];
      store[key][prop].push({ value: v, raw: value, source });
    }
  }
}

const mockupFiles = fs
  .readdirSync(mockupDir)
  .filter((f) => f.endsWith('-F.html'))
  .sort();
if (!mockupFiles.length) cannotRun(`no *-F.html mockups in ${mockupDir}`);

const mockupIndex = {};
for (const f of mockupFiles) {
  const css = styleBlocks(fs.readFileSync(path.join(mockupDir, f), 'utf8'));
  if (!css.trim()) continue;
  index(parseRules(css), f, true, mockupIndex);
}

const appIndex = {};
index(parseRules(fs.readFileSync(primitivesFile, 'utf8')), 'f-primitives.css', false, appIndex);

// ---------------------------------------------------------------- compare

const conflicts = []; // app disagrees with the mockups
const mockupDrift = []; // the mockups disagree with each other
const ruled = []; // deliberate, dated deviations
const unpaired = []; // in the mockups, no counterpart in the app

for (const [key, props] of Object.entries(mockupIndex)) {
  const selector = key.split('  @')[0];
  if (onlySelector && selector !== onlySelector) continue;

  const appProps = appIndex[key];
  if (!appProps) {
    // Only worth reporting when more than one mockup declares it: a one-off is
    // usually page furniture, not a component the app is missing.
    const sources = new Set();
    Object.values(props).forEach((list) => list.forEach((d) => sources.add(d.source)));
    if (sources.size > 1) unpaired.push({ key, files: [...sources].sort() });
    continue;
  }

  for (const [prop, list] of Object.entries(props)) {
    const distinct = [...new Set(list.map((d) => d.value))];
    if (distinct.length > 1) {
      mockupDrift.push({
        key,
        prop,
        variants: distinct.map((v) => ({
          value: v,
          files: list.filter((d) => d.value === v).map((d) => d.source),
        })),
      });
    }

    const appList = appProps[prop];
    if (!appList) continue;
    const appVal = appList[appList.length - 1].value;
    if (distinct.includes(appVal)) continue;

    const rule = RULED.find((r) => r.match(selector, prop, appVal));
    const finding = {
      key,
      prop,
      app: appVal,
      mockups: distinct.map((v) => ({
        value: v,
        files: list.filter((d) => d.value === v).map((d) => d.source),
      })),
    };
    if (rule) ruled.push({ ...finding, reason: rule.reason });
    else conflicts.push(finding);
  }
}

// ----------------------------------------------------------------- report

const drifted = conflicts.length + mockupDrift.length;

if (asJson) {
  process.stdout.write(
    JSON.stringify(
      {
        mockups: mockupFiles,
        primitives: path.relative(REPO, primitivesFile),
        conflicts,
        mockupDrift,
        ruled,
        unpaired,
        unknownUtilities: [...unknownUtilities].sort(),
        exit: drifted ? 2 : 0,
      },
      null,
      2
    ) + '\n'
  );
  process.exit(drifted ? 2 : 0);
}

const B = (s) => `\x1b[1m${s}\x1b[0m`;
const files = (list) => [...new Set(list)].sort().join(', ');

if (!quiet) {
  process.stdout.write(
    `\n${B('Direction F component layer')}\n` +
      `  ${mockupFiles.length} mockups + ${path.basename(primitivesFile)}\n\n`
  );

  if (conflicts.length) {
    process.stdout.write(B(`CONFLICT: the app disagrees with the mockups (${conflicts.length})\n`));
    for (const c of conflicts) {
      process.stdout.write(`\n  ${c.key}  {${c.prop}}\n`);
      process.stdout.write(`    app      ${c.app}\n`);
      for (const m of c.mockups) process.stdout.write(`    mockup   ${m.value}   [${files(m.files)}]\n`);
    }
    process.stdout.write('\n');
  }

  if (mockupDrift.length) {
    process.stdout.write(
      B(`MOCKUP DRIFT: the mockups disagree with each other (${mockupDrift.length})\n`)
    );
    for (const d of mockupDrift) {
      process.stdout.write(`\n  ${d.key}  {${d.prop}}\n`);
      for (const v of d.variants) {
        process.stdout.write(`    ${v.value}   x${v.files.length}   [${files(v.files)}]\n`);
      }
    }
    process.stdout.write('\n');
  }

  if (ruled.length) {
    process.stdout.write(B(`RULED, not drift (${ruled.length})\n`));
    const byReason = {};
    for (const r of ruled) (byReason[r.reason] = byReason[r.reason] || []).push(r);
    for (const [reason, list] of Object.entries(byReason)) {
      process.stdout.write(`\n  ${reason}\n`);
      for (const r of list) process.stdout.write(`    ${r.key} {${r.prop}}\n`);
    }
    process.stdout.write('\n');
  }

  if (unpaired.length) {
    process.stdout.write(
      B(`UNPAIRED: in two or more mockups, no counterpart in the app (${unpaired.length})\n`) +
        `  Either a missing entry in ALIASES, or a component not ported yet.\n\n`
    );
    for (const u of unpaired) process.stdout.write(`  ${u.key}   [${files(u.files)}]\n`);
    process.stdout.write('\n');
  }

  if (unknownUtilities.size) {
    process.stdout.write(
      B(`UNKNOWN @apply utilities (${unknownUtilities.size})\n`) +
        `  Not expanded, so their properties look mockup-only. Add them to APPLY.\n  ` +
        [...unknownUtilities].sort().join(' ') +
        '\n\n'
    );
  }
}

process.stdout.write(
  drifted
    ? `${B('DRIFT')}  ${conflicts.length} conflicts, ${mockupDrift.length} mockup-vs-mockup, ` +
        `${ruled.length} ruled, ${unpaired.length} unpaired\n`
    : `${B('AGREE')}  no conflicting declarations` +
        (ruled.length ? `, ${ruled.length} ruled deviations` : '') +
        (unpaired.length ? `, ${unpaired.length} unpaired` : '') +
        '\n'
);
process.exit(drifted ? 2 : 0);
