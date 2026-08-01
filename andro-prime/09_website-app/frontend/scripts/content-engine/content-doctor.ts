/**
 * content-doctor — Phase 0 of `06_marketing/content-machine/content-pipeline-automation-plan.md`.
 *
 * Asserts the plan's cross-store invariants (its seven, plus an eighth added after a
 * verification pass found drift all seven missed) and reports violations. A DETECTOR, not a fixer.
 *
 * WRITES. No UPDATE, DELETE or DDL, and no repo file, ever. There is exactly ONE write path:
 * `--log` appends a single row to `agent_runs` via `_shared.logRun()`. That flag is off by
 * default and is pure run telemetry (a fixed-size verdict vector, never the findings). Without
 * `--log` this process issues SELECTs and nothing else. An earlier version of this header
 * claimed "no INSERT" flatly, which was false on exactly the path a nightly cadence would take.
 *
 * WHY IT IS NOT `content-status/scan.js`. That scanner reads repo markdown only, so it can never
 * see a disagreement BETWEEN stores, which is where every hour in the plan's section 1 went.
 *
 * THE RULE THAT MATTERS MOST. An invariant resolves to exactly PASS, FAIL or UNCHECKED, and a
 * measurement that did not happen is UNCHECKED. Two mechanisms enforce it:
 *   - every table read requests an exact server-side count and asserts it received that many
 *     rows, so a truncated, capped or intercepted response fails loudly instead of arriving
 *     as `[]` and reading as a real measurement of nothing;
 *   - a table that returns zero rows makes its dependants UNCHECKED, because there was nothing
 *     to compare. Every invariant prints the row and file counts it actually read, so the
 *     denominator is on the report where a human can see it.
 * This is the 2026-07-28 dashboard failure, where a failed fetch rendered as a confident `0`.
 *
 * NO PARALLEL STATUS STORE (`12_operations/automation/scheduled-agents.md`). Findings go to
 * stdout and the exit code. ClickUp owns the open-item list; opening tasks is out of scope here.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/content-doctor.ts
 *   npx tsx scripts/content-engine/content-doctor.ts --json     # machine-readable, for a cadence
 *   npx tsx scripts/content-engine/content-doctor.ts --log      # opt-in agent_runs telemetry
 *
 * Exit codes (extends the `content-status/scan.js` convention: 0 clean, 2 gate block, 1 error):
 *   0  every invariant PASS
 *   2  at least one invariant FAIL          — THE ALARM. Same meaning as scan.js exit 2.
 *   3  no FAIL but at least one UNCHECKED   — not clean, and the EXPECTED BASELINE today
 *   1  the doctor itself errored
 *
 * Exit 3 is expected, not alarming, until a Metricool credential exists: invariant 3 cannot be
 * measured without one, so exit 0 is currently unreachable. Stated in the output as well as
 * here, deliberately. A nightly job that alarms every night trains its reader to ignore it,
 * which is how `12_operations/sops/content-machine-verification.md` came to have never once
 * been run. The alarm is exit 2, or an UNCHECKED that is not the expected one.
 */
import fs from 'fs'
import path from 'path'
import { loadEnvLocal, admin, logRun } from './_shared'
import { getTask, isApproved, unresolvedRulings, type ReviewTask } from './clickup'

// ── Paths. Same REPO_ROOT hop out of frontend/ that reconcile-coverage.ts uses.
// Exported because that hop is RELATIVE TO cwd, which makes cwd load-bearing: see
// `repoLayoutProblems()` below, and the scanner incident it is named after.
export const REPO_ROOT = path.resolve(process.cwd(), '../../..')
export const MACHINE = path.join(REPO_ROOT, 'andro-prime/06_marketing/content-machine')
const ASSETS_DIR = path.join(MACHINE, 'assets')
const DRAFTS_DIR = path.join(MACHINE, 'drafts')
const SCAN_JS = path.join(REPO_ROOT, '.claude/skills/content-status/scan.js')
const ANDRO_ROOT = path.join(REPO_ROOT, 'andro-prime')

const JSON_MODE = process.argv.includes('--json')
const DO_LOG = process.argv.includes('--log')

// ═══════════════════════════════════════════════════════════════════ types

export type Verdict = 'PASS' | 'FAIL' | 'UNCHECKED'

export interface Finding {
  /** violation = breaks the invariant. note = worth a human's eye, does not fail. */
  kind: 'violation' | 'note'
  ref: string
  message: string
  fix?: string
}

export interface Invariant {
  id: string
  title: string
  /** What was read, WITH counts. The denominator is what makes an empty read visible. */
  reads: string[]
  verdict: Verdict
  /** Required and non-empty whenever verdict is UNCHECKED. */
  reason: string | null
  /** True when UNCHECKED is a known, documented structural gap rather than a new fault. */
  expected: boolean
  findings: Finding[]
}

// ── Rows, and the store they arrive in.

export interface AssetRow {
  id: string; slug: string; status: string; content_type: string | null
  funnel_stage: string | null; awareness: string | null; cta: string | null
  preflight: string; ewa_task: string | null; canonical_article_id: string | null
}
export interface RenditionRow {
  id: string; asset_id: string; platform: string; format: string
  thumb_spec: string | null; status: string; scheduled_for: string | null
  published_at: string | null; external_post_id: string | null
  external_url: string | null; publisher: string | null
}
export interface ChannelRow { platform: string; format: string; in_plan: boolean }
export interface ArticleRow { id: string; slug: string; status: string; body: string }

/** A table read. `error` non-null means it was NOT read; `rows` is then meaningless. */
export interface TableRead<T> { rows: T[]; count: number; error: string | null }

export interface Store {
  content_assets: TableRead<AssetRow>
  content_renditions: TableRead<RenditionRow>
  content_channels: TableRead<ChannelRow>
  blog_articles: TableRead<ArticleRow>
}
export type TableName = keyof Store

export const tableOk = <T>(rows: T[]): TableRead<T> => ({ rows, count: rows.length, error: null })
export const tableFailed = <T>(error: string): TableRead<T> => ({ rows: [], count: 0, error })

/** Files handed to the invariants, already relativised, so every check is testable off-disk. */
export interface RepoFile { path: string; text: string }
export interface RepoCtx {
  assetFiles: RepoFile[]
  draftFiles: RepoFile[]
  /** Every *.md under content-machine/, for "does this slug appear anywhere" sweeps. */
  workspaceFiles: RepoFile[]
  scannerSrc: string | null
  stateDocs: RepoFile[]
}

export const emptyCtx = (): RepoCtx => ({
  assetFiles: [], draftFiles: [], workspaceFiles: [], scannerSrc: null, stateDocs: [],
})

// ═══════════════════════════════════════════════════ pure logic (unit-tested)

/**
 * Verdict classification. Deliberately the only place a verdict is decided, because
 * "an unperformed check silently reads as a pass" is the failure this script exists to stop.
 * `checked === false` ALWAYS wins, even over findings, and demands a reason.
 */
export function classify(checked: boolean, findings: Finding[], reason?: string | null): {
  verdict: Verdict
  reason: string | null
} {
  if (!checked) {
    const r = (reason ?? '').trim()
    if (!r) throw new Error('classify: an UNCHECKED invariant must state why it was not measured')
    return { verdict: 'UNCHECKED', reason: r }
  }
  const violations = findings.filter((f) => f.kind === 'violation')
  return { verdict: violations.length ? 'FAIL' : 'PASS', reason: null }
}

/**
 * Resolve an invariant's table dependencies. An unread table AND a table that returned zero
 * rows both block measurement: zero rows means there was nothing to compare, which is not a
 * pass. `reads` always carries the count, including when the read failed.
 */
export function need(store: Store, names: TableName[]):
  { ok: true; reads: string[]; reason: null } | { ok: false; reads: string[]; reason: string } {
  const reads = names.map((n) => `${n} (${store[n].error ? 'UNREAD' : `${store[n].count} rows`})`)
  const errs = names.filter((n) => store[n].error).map((n) => store[n].error!)
  if (errs.length) return { ok: false, reads, reason: `database not read: ${errs.join('; ')}` }
  const empty = names.filter((n) => store[n].count === 0)
  if (empty.length) {
    return {
      ok: false, reads,
      reason: `${empty.join(', ')} returned 0 rows. There was nothing to compare, so this is not a pass: from here, an empty table and an unmeasured one look identical.`,
    }
  }
  return { ok: true, reads, reason: null }
}

/** Filename -> slug, matching scan.js: drop `.md` and an optional leading `YYYY-MM-DD-`. */
export function fileSlug(file: string): string {
  return path.basename(file).replace(/\.md$/i, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

/** Strip surrounding quotes, then a trailing " #comment". Mirrors scan.js `cleanVal`. */
export function cleanVal(raw: string): string {
  let v = (raw || '').trim()
  if (!v) return ''
  const q = v[0]
  if (q === '"' || q === "'") {
    const end = v.indexOf(q, 1)
    return end > 0 ? v.slice(1, end) : v.slice(1)
  }
  const h = v.search(/\s#/)
  if (h >= 0) v = v.slice(0, h).trim()
  return v
}

export interface ParsedAsset {
  flat: Record<string, string>
  renditions: Array<Record<string, string>>
  hasFrontmatter: boolean
}

/**
 * Parse the asset frontmatter shape: flat `key: value` pairs plus one nested `renditions:` list.
 * Same shape scan.js parses; the doctor needs the VALUES and reimplements none of its gates.
 */
export function parseAsset(text: string): ParsedAsset {
  const lines = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').split('\n')
  const flat: Record<string, string> = {}
  const renditions: Array<Record<string, string>> = []
  if (lines[0]?.trim() !== '---') return { flat, renditions, hasFrontmatter: false }

  let close = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { close = i; break }
  }
  if (close < 0) return { flat, renditions, hasFrontmatter: false }

  let inRend = false
  let cur: Record<string, string> | null = null
  for (const line of lines.slice(1, close)) {
    if (!line.trim()) continue
    const indent = line.length - line.trimStart().length
    if (inRend && indent > 0) {
      const t = line.trim()
      const kv = /^([A-Za-z_][\w-]*):\s?(.*)$/.exec(t.startsWith('- ') ? t.slice(2) : t)
      if (t.startsWith('- ')) { cur = {}; renditions.push(cur) }
      if (kv && cur) cur[kv[1]] = cleanVal(kv[2])
      continue
    }
    inRend = false
    const m = /^([A-Za-z_][\w-]*):\s?(.*)$/.exec(line)
    if (!m) continue
    if (m[1] === 'renditions') { inRend = true; continue }
    flat[m[1]] = cleanVal(m[2])
  }
  return { flat, renditions, hasFrontmatter: true }
}

/**
 * Blank every comment span in JS source, preserving length and newlines so offsets stay valid.
 * String and regex aware, so a `//` inside `'https://x'` or `/a\/b/` is not mistaken for one.
 *
 * This exists because the DECLARATION SEARCH below must not see commented-out code. A human
 * clearing the I2 violations is told by the doctor's own remediation text to go and edit
 * `PLATFORMS` in scan.js, and leaving the old line commented out above the new one is entirely
 * ordinary. Searching raw source would then find the stale literal, silently narrow the
 * vocabulary and produce confident wrong violations: the same failure the balanced scanner was
 * written to kill, just relocated from the literal body to the declaration search.
 */
export function stripComments(src: string): string {
  const out = src.split('')
  let prev = ''
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (c === "'" || c === '"' || c === '`') {
      const q = c
      for (i++; i < src.length; i++) {
        if (src[i] === '\\') { i++; continue }
        if (src[i] === q) break
      }
      prev = q
      continue
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') { out[i] = ' '; i++ }
      i--
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      const stop = end < 0 ? src.length : end + 2
      for (let k = i; k < stop; k++) out[k] = src[k] === '\n' ? '\n' : ' '
      i = stop - 1
      continue
    }
    if (c === '/' && (prev === '' || /[=:,([{!&|?;+\-*%~^<>]/.test(prev))) {
      let inClass = false
      for (i++; i < src.length; i++) {
        const d = src[i]
        if (d === '\\') { i++; continue }
        if (d === '[') inClass = true
        else if (d === ']') inClass = false
        else if (d === '/' && !inClass) break
        else if (d === '\n') break
      }
      prev = '/'
      continue
    }
    if (!/\s/.test(c)) prev = c
  }
  return out.join('')
}

/**
 * Pull one `const NAME = [...]` / `{...}` literal out of JS source with a depth-counting scan
 * that understands strings, comments AND regex literals.
 *
 * A regex cannot do this: `\[([^\]]*)\]` truncates at the first `]` inside the literal and
 * yields a SHORTER vocabulary that then produces confident, wrong violations. Neither can a
 * naive brace counter: `scan.js` holds `const HARD = [{ re: /a]b/ }]`, where the `]` inside a
 * regex character class closes the array early. Comments are stripped FIRST so a commented-out
 * declaration cannot shadow the live one. Every failure points the same way, at a silently
 * narrowed vocabulary, so this returns null rather than a partial literal and the caller turns
 * that into UNCHECKED.
 */
export function extractLiteral(rawSrc: string, name: string): string | null {
  const src = stripComments(rawSrc)
  const decl = new RegExp(`\\bconst\\s+${name}\\s*=\\s*`).exec(src)
  if (!decl) return null
  let i = decl.index + decl[0].length
  const open = src[i]
  if (open !== '[' && open !== '{') return null
  const close = open === '[' ? ']' : '}'
  const start = i
  let depth = 0
  let prev = '' // last significant character, to tell a regex literal from a division
  for (; i < src.length; i++) {
    const c = src[i]
    if (c === "'" || c === '"' || c === '`') {
      const q = c
      for (i++; i < src.length; i++) {
        if (src[i] === '\\') { i++; continue }
        if (src[i] === q) break
      }
      prev = q
      continue
    }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2); if (i < 0) return null; i++; continue }
    if (c === '/' && (prev === '' || /[=:,([{!&|?;+\-*%~^<>]/.test(prev))) {
      // A regex literal. Skip it whole, including any `]` inside a character class.
      let inClass = false
      for (i++; i < src.length; i++) {
        const d = src[i]
        if (d === '\\') { i++; continue }
        if (d === '[') inClass = true
        else if (d === ']') inClass = false
        else if (d === '/' && !inClass) break
        else if (d === '\n') return null // unterminated regex: refuse rather than guess
      }
      prev = '/'
      continue
    }
    if (c === open) depth++
    else if (c === close) { depth--; if (depth === 0) return src.slice(start, i + 1) }
    if (!/\s/.test(c)) prev = c
  }
  return null
}

/**
 * Read the enum vocabularies out of `content-status/scan.js` source, so the doctor compares
 * against what the gate scanner ACTUALLY enforces rather than a second hand-typed copy of it.
 * Reports what it could NOT read, so a partial parse becomes UNCHECKED rather than a silently
 * narrowed vocabulary that manufactures violations.
 */
export function parseScannerVocab(src: string, wanted: string[]): {
  vocab: Record<string, string[]>
  missing: string[]
} {
  const vocab: Record<string, string[]> = {}
  const missing: string[] = []
  for (const name of wanted) {
    const lit = extractLiteral(src, name)
    if (!lit) { missing.push(name); continue }
    const isArray = lit.startsWith('[')
    const vals = isArray
      ? [...lit.matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2])
      : [...lit.matchAll(/(?:'([^']+)'|"([^"]+)"|([A-Za-z][\w-]*))\s*:/g)].map((m) => m[1] ?? m[2] ?? m[3])
    if (!vals.length) { missing.push(name); continue }
    vocab[name] = vals
  }
  return { vocab, missing }
}

/** A scheduled rendition whose slot has already passed. `now` is injected so this is testable. */
export function isPastSchedule(scheduledFor: string | null, now: Date): boolean {
  if (!scheduledFor) return false
  const t = Date.parse(scheduledFor)
  if (Number.isNaN(t)) return false
  return t < now.getTime()
}

/** The asset lifecycle order, from the plan's section 4. */
export const ASSET_RANK: Record<string, number> = {
  idea: 0, hooked: 1, scripted: 2, recorded: 3, edited: 4, approved: 5, done: 6,
}

/**
 * TODO-style markers in a stored body. Two tiers:
 *   hard  — the comment ASSERTS SOMETHING IS OWED. This is the class that kept asserting a
 *           blocking condition for sixteen days after it cleared, and the class I6 found on
 *           eight published articles still claiming their own sign-off was outstanding.
 *   note  — any other authoring comment surviving into a stored body.
 *
 * Obligation phrases are split into two strengths so a false positive is excluded by a
 * POSITIVE counter-signal rather than by deleting obligation verbs. An earlier fix removed
 * "to be added / reviewed / rendered" outright to clear one CTA-block false positive, which
 * opened a hole: `{/* Ewa to be reviewed *␘/}` in a published body then read as benign.
 *   STRONG — never excused. "TODO" inside a CTA block is still a TODO.
 *   WEAK   — excused only when the comment is visibly DESCRIBING a component's own behaviour
 *            ("OR write inline", "auto-render", "rendered by <X>", "prop", "attribute").
 *
 * `placeholder` sits in WEAK deliberately: an unfilled placeholder reaching a reader is
 * exactly what this invariant guards, so it fails hard by default, and the technical sense
 * ("the placeholder prop is set by ArticleLayout") is caught by the component counter-signal
 * rather than by weakening the term.
 */
const OBLIGATION_STRONG =
  /\bTODO\b|\bFIXME\b|\bTBD\b|\bTBC\b|\bXXX\b|lorem ipsum|sign-?off\s+(?:required|owed|pending|needed)|before\s+publish|to\s+review\s+and\s+rewrite|awaiting\s+(?:review|sign-?off|approval)|needs?\s+(?:review|sign-?off|rewriting)|\bto\s+be\s+(?:written|drafted|confirmed|decided|filled\s+in)\b/i
const OBLIGATION_WEAK = /\bto\s+be\s+(?:added|reviewed|rendered)\b|\bplaceholder\b/i
const DESCRIBES_COMPONENT =
  /OR\s+write\s+inline|auto-render(?:ed)?|is\s+auto-|rendered\s+by\s+\w|\bprops?\b|\battributes?\b/i

export function markerTier(commentText: string): 'hard' | 'note' {
  if (OBLIGATION_STRONG.test(commentText)) return 'hard'
  if (OBLIGATION_WEAK.test(commentText) && !DESCRIBES_COMPONENT.test(commentText)) return 'hard'
  return 'note'
}

// `\*\/\s*\}` so `{/* ... */ }` with a space before the brace is not missed.
const COMMENT_BLOCK = /\{\/\*[\s\S]*?\*\/\s*\}|<!--[\s\S]*?-->/g

export function todoMarkers(body: string): Array<{ tier: 'hard' | 'note'; text: string }> {
  const out: Array<{ tier: 'hard' | 'note'; text: string }> = []
  const seen = new Set<string>()
  for (const m of body.matchAll(COMMENT_BLOCK)) {
    const text = m[0].replace(/\s+/g, ' ').trim().slice(0, 160)
    if (seen.has(text)) continue
    seen.add(text)
    out.push({ tier: markerTier(m[0]), text })
  }
  const stripped = body.replace(COMMENT_BLOCK, ' ')
  for (const m of stripped.matchAll(/\b(TODO|FIXME)\b[^\n]{0,120}/g)) {
    const text = m[0].replace(/\s+/g, ' ').trim()
    if (seen.has(text)) continue
    seen.add(text)
    out.push({ tier: 'hard', text })
  }
  return out
}

// ── Count assertions in STATE docs (invariant 7) ──────────────────────────────

export interface CountAssertion {
  id: string
  file: string
  line: number
  quoted: string
  /** The `##` section this line sits under: a date, 'preamble', or 'undated'. */
  sectionDate: string
  /** True when the line is a claim about NOW. */
  current: boolean
  parts: Array<{ label: string; quoted: number }>
}

export const COUNT_PATTERNS: Array<{ id: string; re: RegExp; parts: string[] }> = [
  {
    id: 'grid',
    re: /(\d+)\s+articles?\s*[x×]\s*(\d+)\s+planned channels?\s*=\s*\*{0,2}(\d+)\s+slots?,\s*(\d+)\s+filled(?:,\s*backlog\s+(\d+))?/gi,
    parts: ['publishedArticles', 'plannedChannels', 'gridSlots', 'gridFilled', 'gridBacklog'],
  },
  { id: 'grid-short', re: /the grid is (\d+) slots?,? and (\d+) filled/gi, parts: ['gridSlots', 'gridFilled'] },
  { id: 'published-articles', re: /(\d+)\s+published(?:,\s*Ewa-signed)?\s+articles?\b/gi, parts: ['publishedArticles'] },
  { id: 'thumbs-owed', re: /(\d+)\s+renditions?\s+needs?\s+a\s+(?:thumbnail|cover)\b/gi, parts: ['thumbsOwed'] },
]

/**
 * Blank out only the RETIRED SPANS of a line, not the whole line. A `~~struck~~` phrase or a
 * `[SUPERSEDED ...]` bracket retires its own span; the rest of the line is still a live claim.
 * STATE.md lines here run past 1,800 characters, so suppressing a whole line on one marker
 * silently stopped asserting against live prose sitting beside retired prose.
 */
export function maskRetired(line: string): string {
  const blank = (s: string) => ' '.repeat(s.length)
  return line
    .replace(/~~[\s\S]*?~~/g, blank)
    .replace(/\*{0,2}\[SUPERSEDED[\s\S]*?\]\*{0,2}/gi, blank)
    .replace(/\*\*SUPERSEDED[^*]*\*\*/gi, blank)
}

/**
 * Extract count assertions from one STATE doc. Only claims under the file's NEWEST dated `##`
 * section, or in its pre-heading preamble, are claims about now; older sections are a dated
 * append-log and their numbers are deliberately historical. A section whose heading carries NO
 * date is 'undated' and is explicitly NOT current: it sits somewhere in the log and the doctor
 * cannot tell where, so failing on it would manufacture violations out of history.
 */
export function extractCountAssertions(md: string, file: string): CountAssertion[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const sectionOf: string[] = []
  let cur = 'preamble'
  for (const line of lines) {
    if (/^##\s/.test(line)) cur = /(\d{4}-\d{2}-\d{2})/.exec(line)?.[1] ?? 'undated'
    sectionOf.push(cur)
  }
  const dates = sectionOf.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
  const newest = dates.length ? dates.slice().sort().pop()! : null

  const out: CountAssertion[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = maskRetired(lines[i])
    for (const p of COUNT_PATTERNS) {
      p.re.lastIndex = 0
      for (const m of line.matchAll(p.re)) {
        const parts = p.parts
          .map((label, idx) => ({ label, quoted: Number(m[idx + 1]) }))
          .filter((x) => Number.isFinite(x.quoted))
        if (!parts.length) continue
        const sd = sectionOf[i]
        out.push({
          id: p.id, file, line: i + 1,
          quoted: m[0].replace(/\s+/g, ' ').trim(),
          sectionDate: sd,
          current: sd === 'preamble' || (newest !== null && sd === newest),
          parts,
        })
      }
    }
  }
  return out
}

/**
 * The summary block. Its job is to make an UNCHECKED run impossible to read as a clean one,
 * while distinguishing the EXPECTED structural gap from a new one, so a nightly reader is not
 * trained to ignore a permanent alarm.
 */
export function summarise(invs: Invariant[]): string {
  const n = (v: Verdict) => invs.filter((i) => i.verdict === v).length
  const pass = n('PASS'), fail = n('FAIL'), unchecked = n('UNCHECKED')
  const unexpected = invs.filter((i) => i.verdict === 'UNCHECKED' && !i.expected)
  const L: string[] = []
  L.push('─'.repeat(72))
  L.push(`${invs.length} invariants:   🟢 PASS ${pass}    🔴 FAIL ${fail}    ⚪ UNCHECKED ${unchecked}`)
  if (unchecked) {
    L.push('')
    L.push(`⚪ UNCHECKED IS NOT A PASS. ${unchecked} invariant(s) were NOT measured:`)
    for (const i of invs.filter((x) => x.verdict === 'UNCHECKED')) {
      L.push(`   ${i.id}  ${i.title}${i.expected ? '   [EXPECTED]' : '   [UNEXPECTED — this is new]'}`)
      L.push(`       reason: ${i.reason}`)
    }
    L.push(`   Treat this run as INCOMPLETE. ${pass} pass out of ${invs.length}, not out of ${pass + fail}.`)
  }
  if (fail) {
    const v = invs.reduce((a, i) => a + i.findings.filter((f) => f.kind === 'violation').length, 0)
    L.push('')
    L.push(`🔴 ${fail} invariant(s) FAIL, ${v} violation(s) total. The doctor detects only: nothing above was fixed.`)
    L.push('   Per the plan, a red invariant belongs in ClickUp, not in a file beside this script.')
  }
  L.push('')
  if (!fail && !unchecked) {
    L.push(`🟢 All ${invs.length} invariants hold.`)
  } else if (!fail && !unexpected.length) {
    L.push('EXIT 3, the expected baseline: nothing failed, and the only gaps are the documented ones.')
  } else {
    L.push(fail
      ? 'EXIT 2 is the alarm: something that CAN be measured is wrong.'
      : 'EXIT 3 with an UNEXPECTED gap: a check that normally runs did not. Treat as an alarm.')
  }
  return L.join('\n')
}

export function exitCodeFor(invs: Invariant[]): 0 | 2 | 3 {
  if (invs.some((i) => i.verdict === 'FAIL')) return 2
  if (invs.some((i) => i.verdict === 'UNCHECKED')) return 3
  return 0
}

/**
 * `agent_runs.status` is a Postgres enum of exactly three values (ok | error | blocked), so
 * four outcomes cannot each get their own. `blocked` carries both "violations found" and
 * "could not measure": both mean not-clean, and never `ok`, never `error`. `detail.outcome`
 * is the authoritative discriminator between them. Separating 2 from 3 at the status level
 * needs a one-line enum migration, which the doctor does not make.
 */
export function runStatusFor(code: 0 | 1 | 2 | 3): 'ok' | 'error' | 'blocked' {
  if (code === 0) return 'ok'
  if (code === 1) return 'error'   // the doctor itself crashed
  return 'blocked'                 // 2 = violations, 3 = incomplete
}
export function runOutcomeFor(code: 0 | 1 | 2 | 3): string {
  return ({ 0: 'clean', 1: 'crashed', 2: 'violations', 3: 'incomplete' } as const)[code]
}

// ═══════════════════════════════════════════════════════════ the invariants

// ── I1: every assets/*.md has a row, and every row has a file.
export function inv1(store: Store, ctx: RepoCtx): Invariant {
  const id = 'I1'
  const title = 'Every assets/*.md has a content_assets row, and every row has a file'
  // Only content_assets is required: the file-vs-row halves need nothing else. Renditions and
  // articles sharpen the batch-draft explanation and degrade to a stated note if absent, so a
  // renditions outage no longer takes out the whole invariant.
  const dep = need(store, ['content_assets'])
  const reads = [...dep.reads,
    `content_renditions (${store.content_renditions.error ? 'UNREAD' : `${store.content_renditions.count} rows`})`,
    `assets/ (${ctx.assetFiles.length} files)`,
    `drafts/ (${ctx.draftFiles.length} files)`, `content-machine/ (${ctx.workspaceFiles.length} md)`]
  if (!dep.ok) return { id, title, reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const findings: Finding[] = []
  const fileSlugs = new Map<string, string[]>()
  for (const f of ctx.assetFiles) {
    const slug = parseAsset(f.text).flat.slug || fileSlug(f.path)
    fileSlugs.set(slug, [...(fileSlugs.get(slug) ?? []), f.path])
  }
  for (const [slug, files] of fileSlugs) {
    if (files.length > 1) {
      findings.push({
        kind: 'violation', ref: slug,
        message: `${files.length} asset files declare slug "${slug}": ${files.join(', ')}. Only one can join to the DB row, so the others are invisible in both directions.`,
        fix: 'give each file its own slug, or delete the duplicate',
      })
    }
  }

  const dbSlugs = new Set(store.content_assets.rows.map((a) => a.slug))
  for (const [slug, files] of fileSlugs) {
    if (!dbSlugs.has(slug)) {
      findings.push({
        kind: 'violation', ref: files[0],
        message: `asset file "${slug}" has no content_assets row: invisible to the board and to /content-status`,
        fix: `insert a content_assets row for "${slug}" (the 2026-07-31 four-derivative incident, exactly)`,
      })
    }
  }

  // A row may legitimately be carried by a batch DRAFT rather than its own asset file
  // (CONTEXT.md: "a week of X posts is seven assets"). Matching on the slug does NOT work:
  // the draft identifies posts by `batch` / `queue_row` and never by slug. Match on what is
  // genuinely present in BOTH stores: the canonical article, plus platform/format.
  const articleSlugById = new Map(store.blog_articles.rows.map((a) => [a.id, a.slug]))
  const haveArticles = !store.blog_articles.error && store.blog_articles.count > 0
  const haveRends = !store.content_renditions.error && store.content_renditions.count > 0
  const drafts = ctx.draftFiles.map((d) => ({ file: d.path, text: d.text, ...parseAsset(d.text) }))
  const rendsByAsset = new Map<string, RenditionRow[]>()
  for (const r of store.content_renditions.rows) {
    rendsByAsset.set(r.asset_id, [...(rendsByAsset.get(r.asset_id) ?? []), r])
  }

  let fellBack = false
  for (const a of store.content_assets.rows) {
    if (fileSlugs.has(a.slug)) continue
    const rends = rendsByAsset.get(a.id) ?? []
    const canonical = a.canonical_article_id ? articleSlugById.get(a.canonical_article_id) : undefined
    // Without renditions there is no surface to match on, so batch-draft matching is not
    // ATTEMPTED rather than silently failed. The row still reports as having no file, but the
    // message must not claim a draft was looked for and not found.
    const draft = !haveRends ? undefined : drafts.find((d) => {
      const surfaceMatch = rends.some((r) => r.platform === d.flat.platform && r.format === d.flat.format)
      if (!surfaceMatch) return false
      if (!haveArticles) { fellBack = true; return true }
      return !!canonical && d.flat.canonical_asset === canonical
    })
    if (draft) {
      // Whether the draft NAMES this slug is a fact to evaluate, not to assert. The previous
      // version hardcoded "names no slug anywhere" into this branch, so once the draft was
      // actually fixed the finding could never clear and I1 could never go green on any
      // batch-registered channel. The per-post check must be against the MATCHED draft, not a
      // workspace-wide sweep, or a slug mentioned in some unrelated doc would count as linked.
      const where = `the batch draft ${draft.file} (batch "${draft.flat.batch ?? '?'}", queue row "${draft.flat.queue_row ?? '?'}"), matched on canonical article "${canonical ?? 'unverified'}" plus ${draft.flat.platform}/${draft.flat.format}`
      if (draft.text.includes(a.slug)) {
        findings.push({
          kind: 'note', ref: a.slug,
          message: `no assets/*.md, and none is owed: the row is carried by ${where}, and that draft names this slug, so the two stores are LINKED. CONTEXT.md's batched-channel rule ("a week of X posts is seven assets, not one asset with seven renditions") makes this the correct shape.`,
        })
      } else {
        findings.push({
          kind: 'violation', ref: a.slug,
          message: `no assets/*.md. Its copy IS in ${where}. But that draft does NOT name this slug, so the row and its draft are UNLINKED: neither store can find the other.`,
          fix: 'add the per-post slug to each post in the draft, so the batch and the rows are joinable. This is a LINKAGE defect, not a missing artefact.',
        })
      }
      continue
    }
    // Substack is a REPUBLISH surface, not a /script job (CONTEXT.md, and the atomisation
    // model). A verbatim republish of a published, Ewa-signed article has no craft of its own:
    // the craft IS the canonical article, so no assets/*.md is owed and creating a stub to
    // quiet the check would be inventing an artefact. The control case that proves the rule
    // rather than undermining it: substack-welcome-normal-on-paper DOES have a file, because
    // it is net-new founder copy rather than a republish, and so never reaches this branch.
    //
    // Scoped tightly, and it must never widen: a canonical article that RESOLVES, at least one
    // rendition, and EVERY rendition on substack. A row with no renditions is not a republish
    // of anything. The evidence for conditions 1 and 2 lives in blog_articles and
    // content_renditions, so if either is unread the exemption does NOT fire: an exemption that
    // triggers when its evidence is missing is a hole that opens exactly when things are broken.
    const republishCheckable = haveArticles && haveRends
    if (republishCheckable && canonical && rends.length > 0 && rends.every((r) => r.platform === 'substack')) {
      findings.push({
        kind: 'note', ref: a.slug,
        message: `no assets/*.md, and none is owed: substack republish of the canonical article "${canonical}", whose craft lives in that article (CONTEXT.md treats Substack as a republish surface, not a /script job). ${rends.length} rendition(s), all on substack.`,
      })
      continue
    }

    const hits = ctx.workspaceFiles.filter((d) => d.text.includes(a.slug)).map((d) => d.path)
    const unavailable = [!haveRends ? 'content_renditions' : null, !haveArticles ? 'blog_articles' : null]
      .filter(Boolean).join(' and ')
    const clauses = ['no assets/*.md']
    clauses.push(haveRends ? 'no matching batch draft' : `batch-draft matching NOT ATTEMPTED (${unavailable} unavailable)`)
    if (!republishCheckable) {
      clauses.push(`the substack-republish exemption was NOT ATTEMPTED (${unavailable} unavailable), so this row is reported rather than exempted`)
    }
    clauses.push(hits.length
      ? `its slug is mentioned only in ${hits.join(', ')}`
      : 'its slug appears in NO file under content-machine/: the row exists only in the database')
    findings.push({
      kind: 'violation', ref: a.slug,
      message: clauses.join('; '),
      fix: `create ${path.basename(ASSETS_DIR)}/<date>-${a.slug}.md, or record where its craft actually lives`,
    })
  }

  if (!haveRends) {
    findings.push({
      kind: 'note', ref: 'content_renditions',
      message: 'content_renditions was unavailable, so the batch-draft half of this invariant was not attempted; the file-vs-row halves above are still fully measured',
    })
  }
  if (fellBack) {
    findings.push({
      kind: 'note', ref: 'blog_articles',
      message: 'blog_articles was unavailable, so batch-draft matching fell back to platform/format only and the canonical-article half was NOT verified',
    })
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I2: enum vocabulary agreement between repo and database.
export const VOCAB_MAP: Array<[string, string]> = [
  ['PLATFORMS', 'content_renditions.platform'],
  ['FORMATS', 'content_renditions.format'],
  ['THUMBS', 'content_renditions.thumb_spec'],
  ['REND_ORDER', 'content_renditions.status'],
  ['STATUS_ORDER', 'content_assets.status'],
  ['CONTENT_TYPES', 'content_assets.content_type'],
  ['FUNNEL_STAGES', 'content_assets.funnel_stage'],
]

export function inv2(store: Store, ctx: RepoCtx): Invariant {
  const id = 'I2'
  const title = 'Frontmatter enum values are accepted by the DB, and the scanner vocabulary is not narrower than the DB'
  const dep = need(store, ['content_assets', 'content_renditions'])
  const reads = [...dep.reads, `assets/ (${ctx.assetFiles.length} files)`,
    `scan.js (${ctx.scannerSrc ? `${ctx.scannerSrc.length} bytes` : 'UNREAD'})`]
  if (!dep.ok) return { id, title, reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const findings: Finding[] = []
  const A = store.content_assets.rows, R = store.content_renditions.rows
  const set = (xs: Array<string | null>) => new Set(xs.filter(Boolean) as string[])
  const live: Record<string, Set<string>> = {
    'content_assets.status': set(A.map((a) => a.status)),
    'content_assets.content_type': set(A.map((a) => a.content_type)),
    'content_assets.funnel_stage': set(A.map((a) => a.funnel_stage)),
    'content_assets.awareness': set(A.map((a) => a.awareness)),
    'content_assets.cta': set(A.map((a) => a.cta)),
    'content_assets.preflight': set(A.map((a) => a.preflight)),
    'content_renditions.platform': set(R.map((r) => r.platform)),
    'content_renditions.format': set(R.map((r) => r.format)),
    'content_renditions.thumb_spec': set(R.map((r) => r.thumb_spec)),
    'content_renditions.status': set(R.map((r) => r.status)),
    'content_renditions.publisher': set(R.map((r) => r.publisher)),
  }

  // 2a: frontmatter value -> DB column. Provable in ONE direction only from this client.
  const FLAT_MAP: Record<string, string> = {
    status: 'content_assets.status', content_type: 'content_assets.content_type',
    funnel_stage: 'content_assets.funnel_stage', awareness: 'content_assets.awareness',
    cta: 'content_assets.cta', preflight: 'content_assets.preflight',
  }
  const REND_MAP: Record<string, string> = {
    platform: 'content_renditions.platform', format: 'content_renditions.format',
    thumb: 'content_renditions.thumb_spec', status: 'content_renditions.status',
    publisher: 'content_renditions.publisher',
  }
  const unproven = new Map<string, string[]>()
  for (const f of ctx.assetFiles) {
    const { flat, renditions } = parseAsset(f.text)
    const pairs: Array<[string, string]> = []
    for (const [k, col] of Object.entries(FLAT_MAP)) if (flat[k]) pairs.push([col, flat[k]])
    for (const r of renditions) for (const [k, col] of Object.entries(REND_MAP)) if (r[k]) pairs.push([col, r[k]])
    for (const [col, val] of pairs) {
      if (live[col]?.has(val)) continue
      const key = `${col} = "${val}"`
      unproven.set(key, [...(unproven.get(key) ?? []), f.path])
    }
  }
  for (const [key, files] of unproven) {
    findings.push({
      kind: 'note', ref: files[0],
      message: `UNPROVEN BY THIS CLIENT: ${key} appears in frontmatter but in no live row (${files.length} file(s))`,
      fix: 'read the CHECK constraint by another route (a raw SQL session) and confirm; the value may well be accepted',
    })
  }

  // 2b: the mirror direction, and the only half this client can prove. A value the database
  // HOLDS that the gate scanner rejects means scan.js HARD-fails legitimate data.
  const wanted = VOCAB_MAP.map(([n]) => n)
  const parsed = ctx.scannerSrc ? parseScannerVocab(ctx.scannerSrc, wanted) : { vocab: {}, missing: wanted }
  if (parsed.missing.length) {
    return {
      id, title, reads,
      ...classify(false, findings,
        `the gate scanner vocabulary could not be fully read from scan.js (${parsed.missing.join(', ')} missing or unparseable), so the DB-vs-scanner half was NOT measured. A partially parsed vocabulary looks narrower than it is and would invent violations.`),
      expected: false, findings,
    }
  }
  for (const [name, col] of VOCAB_MAP) {
    const allowed = new Set(parsed.vocab[name])
    for (const val of live[col] ?? []) {
      if (allowed.has(val)) continue
      findings.push({
        kind: 'violation', ref: `scan.js ${name}`,
        message: `the database holds ${col} = "${val}", which scan.js ${name} rejects: the gate scanner HARD-fails legitimate data`,
        fix: `add "${val}" to ${name} in scan.js (the DB check constraint already accepts it)`,
      })
    }
  }

  // 2c: the plan's explicit ask, "assert thumb_spec is not null so it cannot recur".
  for (const r of R.filter((x) => x.thumb_spec === null)) {
    findings.push({
      kind: 'violation', ref: r.id,
      message: `content_renditions.thumb_spec is NULL on ${r.platform}/${r.format}; a "needs a thumbnail unless thumb_spec = 'none'" gate would demand a cover for this rendition`,
      fix: `set thumb_spec = 'none'`,
    })
  }

  // Part 2a being unprovable is a real gap, and a real gap is not a pass.
  if (!findings.some((f) => f.kind === 'violation') && unproven.size > 0) {
    return {
      id, title, reads,
      ...classify(false, findings,
        `${unproven.size} frontmatter value(s) could not be checked against the CHECK constraint FROM THIS CLIENT: PostgREST with a service-role key cannot reach pg_constraint (verified by hand out of band, not by this run: PostgREST answers 404 PGRST205). The constraint definitions ARE readable by another route (a raw SQL session), so this is a limitation of this client, not an unknowable fact. Parts 2b and 2c were measured and clean.`),
      expected: false, findings,
    }
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I3: external_post_id still resolves in Metricool. Structurally UNCHECKED.
export function inv3(store: Store): Invariant {
  const id = 'I3'
  const title = 'Every rendition carrying an external_post_id still resolves in Metricool'
  const MISSING = 'METRICOOL_USER_TOKEN / METRICOOL_USER_ID / METRICOOL_BLOG_ID'
  const dep = need(store, ['content_renditions', 'content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const haveToken = Object.keys(process.env).some((k) => /^METRICOOL_/.test(k) && process.env[k])
  const withId = store.content_renditions.rows.filter((r) => r.external_post_id?.trim())
  const bySlug = new Map(store.content_assets.rows.map((a) => [a.id, a.slug]))
  const metricool = withId.filter((r) => r.publisher === 'metricool')
  const other = withId.filter((r) => r.publisher !== 'metricool')

  const findings: Finding[] = []
  for (const r of metricool) {
    findings.push({
      kind: 'note', ref: r.id,
      message: `WOULD CHECK  ${bySlug.get(r.asset_id) ?? r.asset_id}  ${r.platform}/${r.format}  external_post_id=${r.external_post_id}  (status ${r.status})`,
    })
  }
  for (const r of other) {
    findings.push({
      kind: 'note', ref: r.id,
      message: `OUT OF SCOPE ${bySlug.get(r.asset_id) ?? r.asset_id}  ${r.platform}/${r.format}  external_post_id=${r.external_post_id}  publisher=${r.publisher}: not a Metricool id, this invariant cannot cover it`,
    })
  }

  // Which OTHER credentials are loaded is evaluated, not asserted. An earlier version stated
  // "`.env.local` carries CLICKUP_API_TOKEN and SUPABASE_SERVICE_ROLE_KEY" as fact, which was
  // a hand-observation baked into a runtime message and would have gone stale silently.
  const alsoLoaded = ['SUPABASE_SERVICE_ROLE_KEY', 'CLICKUP_API_TOKEN', 'NEXT_PUBLIC_SUPABASE_URL']
    .filter((k) => process.env[k])
  const reason = haveToken
    ? 'a METRICOOL_* variable is set but no Metricool client is implemented here yet'
    : `no Metricool credential is loaded: no ${MISSING}, and no other METRICOOL_* variable, is present in the environment (of the keys this script knows about, ${alsoLoaded.length ? `${alsoLoaded.join(', ')} ${alsoLoaded.length === 1 ? 'is' : 'are'} loaded` : 'none are loaded'}). Metricool is reachable only through an MCP connector, and a node script is not an MCP client. ${metricool.length} rendition(s) are listed above as WOULD CHECK; wiring a token turns this into one fetch.`

  return {
    id, title,
    reads: [...dep.reads, `renditions carrying an external_post_id: ${withId.length}`],
    ...classify(false, findings, reason),
    expected: !haveToken, // a documented structural gap, not a new fault
    findings,
  }
}

// ── I4: no scheduled rendition has a date in the past.
export function inv4(store: Store, now: Date): Invariant {
  const id = 'I4'
  const title = 'No scheduled rendition has a date in the past'
  const dep = need(store, ['content_renditions', 'content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const bySlug = new Map(store.content_assets.rows.map((a) => [a.id, a.slug]))
  const findings: Finding[] = []
  const scheduled = store.content_renditions.rows.filter((x) => x.status === 'scheduled')
  for (const r of scheduled) {
    const who = `${bySlug.get(r.asset_id) ?? r.asset_id} ${r.platform}/${r.format}`
    if (!r.scheduled_for) {
      findings.push({
        kind: 'note', ref: r.id,
        message: `${who} is "scheduled" with scheduled_for NULL: nothing to compare, so this row is unverifiable rather than clean`,
        fix: 'stamp scheduled_for, or move the rendition back to to-produce',
      })
      continue
    }
    if (isPastSchedule(r.scheduled_for, now)) {
      findings.push({
        kind: 'violation', ref: r.id,
        message: `${who} is still "scheduled" for ${r.scheduled_for}, which has passed: it either published and nothing wrote back, or it silently did not go out`,
        fix: 'read the publisher, then move the rendition to published with its URL, or re-schedule',
      })
    }
  }
  return {
    id, title, reads: [...dep.reads, `scheduled renditions examined: ${scheduled.length}`],
    ...classify(true, findings), expected: false, findings,
  }
}

// ── I5: the real sign-off gate. ───────────────────────────────────────────────
//
// Resolved by Keith 2026-08-01, and it is a THIRD thing rather than a compromise between the
// plan (non-green blocks) and scan.js G2 (amber-ewa + a non-empty ewa_task passes). Neither was
// right: a non-empty `ewa_task` proves a question was ASKED, not answered. G2 lets an asset
// reach `approved` on the routing alone, G3 then lets its rendition reach `scheduled`, and the
// X week-1 renditions are scheduled with autoPublish: true — so an asset merely ROUTED to Ewa
// would publish on a timer before she had ruled.
//
// scan.js G2 is deliberately the weaker of the two and must NOT be harmonised downward: the
// scanner reads only the repo, so it cannot ask ClickUp anything, and it stays offline and fast
// on purpose. The doctor is where the real gate lives.
//
// `ewa_task` is read from `content_assets`, not from frontmatter. Both carry it (scan.js reads
// `flat.ewa_task`), but the DB column is the one this invariant can join to the renditions it
// is gating, it is populated on every asset that has been routed, and the plan's section 2 puts
// state in the database. Live values come in two shapes, a bare id and a full task URL, which
// is why the id is extracted rather than used as-is.

const LIVE_REND = new Set(['scheduled', 'published', 'measured'])

/** Assets whose gate actually needs ClickUp: amber-ewa AND carrying a scheduled-or-later rendition. */
export function assetsNeedingRuling(store: Store): AssetRow[] {
  if (store.content_assets.error || store.content_renditions.error) return []
  const liveAssetIds = new Set(
    store.content_renditions.rows.filter((r) => LIVE_REND.has(r.status)).map((r) => r.asset_id))
  return store.content_assets.rows.filter((a) => a.preflight === 'amber-ewa' && liveAssetIds.has(a.id))
}

/** Extract a ClickUp task id from a bare id or any `.../t/<...>/<id>` URL form. */
export function clickupTaskId(raw: string | null | undefined): string | null {
  const s = (raw ?? '').trim().split(/[?#]/)[0]
  if (!s) return null
  if (/^[A-Za-z0-9]+$/.test(s)) return s
  const parts = s.split('/').filter(Boolean)
  const i = parts.lastIndexOf('t')
  if (i >= 0 && i < parts.length - 1) {
    const tail = parts.slice(i + 1).filter((p) => /^[A-Za-z0-9]+$/.test(p))
    if (tail.length) return tail[tail.length - 1]
  }
  return null
}

export type EwaRuling =
  | { state: 'approved'; taskId: string }
  | { state: 'not-approved'; taskId: string; why: string }
  | { state: 'unresolvable'; taskId: string | null; why: string }
export type EwaRulings = Map<string, EwaRuling>
export type TaskFetcher = (taskId: string) => Promise<ReviewTask>

/**
 * Resolve each routed asset against ClickUp. Approval is `isApproved` from `clickup.ts`, NOT a
 * bare status check: that helper is the repo's single definition of "Ewa approved", and it also
 * requires every named ruling to be answered. On 2026-07-29 the andropause hub was approved by
 * completion with two CA-028 rulings asked twice and never answered; reusing the helper means
 * the doctor cannot drift away from the gate `test-rulings-gate.ts` already protects.
 */
export async function resolveEwaApprovals(
  assets: Array<Pick<AssetRow, 'slug' | 'ewa_task'>>,
  fetchTask: TaskFetcher,
): Promise<EwaRulings> {
  const out: EwaRulings = new Map()
  for (const a of assets) {
    const taskId = clickupTaskId(a.ewa_task)
    if (!taskId) {
      out.set(a.slug, { state: 'unresolvable', taskId: null, why: `ewa_task ${JSON.stringify(a.ewa_task)} is not a recognisable ClickUp task id or URL` })
      continue
    }
    try {
      const task = await fetchTask(taskId)
      if (isApproved(task)) { out.set(a.slug, { state: 'approved', taskId }); continue }
      const outstanding = unresolvedRulings(task)
      out.set(a.slug, {
        state: 'not-approved', taskId,
        why: task.statusName === 'complete'
          ? `the task is complete but ${outstanding.length} named ruling(s) are still unanswered: ${outstanding.join('; ')}`
          : `the task status is "${task.statusName || 'unknown'}", not complete`,
      })
    } catch (e) {
      out.set(a.slug, { state: 'unresolvable', taskId, why: (e as Error).message })
    }
  }
  return out
}

export function inv5(store: Store, rulings: EwaRulings = new Map()): Invariant {
  const id = 'I5'
  const title = 'No rendition is scheduled or later unless its asset is pre-flight green, or amber-ewa with Ewa\'s ClickUp task COMPLETE'
  const dep = need(store, ['content_renditions', 'content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const byId = new Map(store.content_assets.rows.map((a) => [a.id, a]))
  const findings: Finding[] = []
  const unresolvable: string[] = []
  const live = store.content_renditions.rows.filter((r) => LIVE_REND.has(r.status))
  const seen = new Set<string>()

  for (const r of live) {
    const a = byId.get(r.asset_id)
    if (!a) {
      findings.push({ kind: 'violation', ref: r.id, message: `rendition ${r.platform}/${r.format} at "${r.status}" has no parent content_assets row` })
      continue
    }
    if (a.preflight === 'green') continue
    const where = `${r.platform}/${r.format} is "${r.status}"`

    if (a.preflight !== 'amber-ewa') {
      findings.push({
        kind: 'violation', ref: a.slug,
        message: `preflight "${a.preflight}" but ${where}. Only green, or amber-ewa with a completed Ewa task, may ship.`,
        fix: 'run the pre-flight as an owner action, or pull the rendition back to to-produce',
      })
      continue
    }
    // amber-ewa: routing alone is not a ruling.
    if (!a.ewa_task?.trim()) {
      findings.push({
        kind: 'violation', ref: a.slug,
        message: `preflight "amber-ewa" with an EMPTY ewa_task, but ${where}. Nothing was ever routed to Ewa, so there is no ruling to verify and nothing to wait for.`,
        fix: 'open the Content Review task and record its id on the asset, or pull the rendition back to to-produce',
      })
      continue
    }
    const ruling = rulings.get(a.slug)
    if (!ruling || ruling.state === 'unresolvable') {
      const why = ruling?.why ?? 'ClickUp was not consulted for this asset'
      if (!seen.has(a.slug)) {
        seen.add(a.slug)
        unresolvable.push(`${a.slug} (ewa_task ${a.ewa_task}): ${why}`)
      }
      findings.push({
        kind: 'note', ref: a.slug,
        message: `preflight "amber-ewa" and ${where}, but Ewa's ruling could NOT be resolved: ${why}. An unverifiable gate is not a satisfied gate.`,
      })
      continue
    }
    if (ruling.state === 'approved') continue
    findings.push({
      kind: 'violation', ref: a.slug,
      message: `preflight "amber-ewa" and ${where}, but Ewa's task ${ruling.taskId} is NOT approved: ${ruling.why}. A routed question is not an answered one, and these renditions publish on a timer.`,
      fix: 'wait for the ruling, or pull the rendition back to to-produce. Do not advance the asset by hand.',
    })
  }

  const reads = [...dep.reads, `scheduled-or-later renditions examined: ${live.length}`,
    `amber-ewa assets needing a ClickUp ruling: ${assetsNeedingRuling(store).length}`]

  // A definite violation outranks an unresolvable one: it is actionable now, and exit 2 is the
  // louder signal. The unresolvable cases are still listed above as notes, so nothing is lost.
  if (findings.some((f) => f.kind === 'violation')) {
    return { id, title, reads, ...classify(true, findings), expected: false, findings }
  }
  if (unresolvable.length) {
    return {
      id, title, reads,
      ...classify(false, findings,
        `Ewa's ruling could not be resolved for ${unresolvable.length} scheduled amber-ewa asset(s), so the gate is unverified rather than satisfied: ${unresolvable.join(' | ')}`),
      expected: false, findings,
    }
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I6: no TODO-style marker survives in blog_articles.body.
export function inv6(store: Store): Invariant {
  const id = 'I6'
  const title = 'No TODO-style marker survives in blog_articles.body'
  const dep = need(store, ['blog_articles'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const findings: Finding[] = []
  const notes = new Map<string, string[]>()
  for (const a of store.blog_articles.rows) {
    if (typeof a.body !== 'string') {
      findings.push({ kind: 'violation', ref: a.slug, message: 'body is not a string: unreadable, not clean' })
      continue
    }
    for (const m of todoMarkers(a.body)) {
      if (m.tier === 'hard') {
        // "SERVED" is derived from status, not assumed: a draft row's body is stored, not served.
        const where = a.status === 'published' ? 'the SERVED body' : `the stored body (status "${a.status}", not served)`
        findings.push({
          kind: 'violation', ref: `${a.slug} (${a.status})`,
          message: `dead marker in ${where}: ${m.text}`,
          fix: 'if the condition cleared, delete the marker; if it did not, the article should not be published',
        })
      } else {
        notes.set(m.text, [...(notes.get(m.text) ?? []), a.slug])
      }
    }
  }
  for (const [text, slugs] of notes) {
    findings.push({
      kind: 'note', ref: `${slugs.length} article(s)`,
      message: `authoring comment surviving in the stored body: ${text.slice(0, 110)}${text.length > 110 ? '…' : ''}  [${slugs.join(', ')}]`,
    })
  }
  return {
    id, title, reads: [...dep.reads, `bodies scanned: ${store.blog_articles.rows.length}`],
    ...classify(true, findings), expected: false, findings,
  }
}

// ── I7: counts quoted in STATE docs match the database.
export function inv7(store: Store, ctx: RepoCtx): Invariant {
  const id = 'I7'
  const title = 'Counts quoted in STATE docs match the database'
  const dep = need(store, ['blog_articles', 'content_channels', 'content_renditions', 'content_assets'])
  const reads = [...dep.reads, `STATE.md (${ctx.stateDocs.length} docs)`]
  if (!dep.ok) return { id, title, reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const publishedArticles = store.blog_articles.rows.filter((a) => a.status === 'published')
  const publishedIds = new Set(publishedArticles.map((a) => a.id))
  const planned = new Set(store.content_channels.rows.filter((c) => c.in_plan).map((c) => `${c.platform}/${c.format}`))
  const assetById = new Map(store.content_assets.rows.map((a) => [a.id, a]))
  const cells = new Set<string>()
  for (const r of store.content_renditions.rows) {
    const a = assetById.get(r.asset_id)
    if (!a?.canonical_article_id || !publishedIds.has(a.canonical_article_id)) continue
    if (!planned.has(`${r.platform}/${r.format}`)) continue
    cells.add(`${a.canonical_article_id}|${r.platform}/${r.format}`)
  }
  // thumbsOwed EXCLUDES a NULL thumb_spec, matching the SQL a human would write
  // (`thumb_spec is not null and thumb_spec <> 'none'`). A NULL is not "a rendition that needs
  // a cover", it is the data defect I2 part 2c already reports, and counting it here would
  // double-report a schema fault as production work. Zero NULLs today; the choice is recorded
  // because the two definitions diverge the moment one reappears.
  const truth: Record<string, number> = {
    publishedArticles: publishedArticles.length,
    plannedChannels: planned.size,
    gridSlots: publishedArticles.length * planned.size,
    gridFilled: cells.size,
    gridBacklog: publishedArticles.length * planned.size - cells.size,
    thumbsOwed: store.content_renditions.rows.filter(
      (r) => r.status === 'to-produce' && r.thumb_spec !== null && r.thumb_spec !== 'none').length,
  }

  const findings: Finding[] = []
  let asserted = 0
  for (const doc of ctx.stateDocs) {
    for (const a of extractCountAssertions(doc.text, doc.path)) {
      const bad = a.parts.filter((p) => truth[p.label] !== undefined && p.quoted !== truth[p.label])
      if (!bad.length) { if (a.current) asserted++; continue }
      const detail = bad.map((p) => `${p.label} quoted ${p.quoted}, database ${truth[p.label]}`).join('; ')
      if (a.current) {
        asserted++
        findings.push({
          kind: 'violation', ref: `${a.file}:${a.line}`,
          message: `stale count in the current section (${a.sectionDate}): "${a.quoted}" — ${detail}`,
          fix: 'correct the doc, or say what changed; a half-corrected count is the failure the plan records twice',
        })
      } else {
        findings.push({
          kind: 'note', ref: `${a.file}:${a.line}`,
          message: `${a.sectionDate} section: "${a.quoted}" — ${detail} (append-log history, not asserted)`,
        })
      }
    }
  }

  if (asserted === 0) {
    return {
      id, title, reads,
      ...classify(false, findings,
        `no count assertion was found in the current section of any of the ${ctx.stateDocs.length} STATE doc(s). Nothing was compared, so this is not a pass.`),
      expected: false, findings,
    }
  }
  findings.unshift({
    kind: 'note', ref: 'scope',
    message: `database truth: ${Object.entries(truth).map(([k, v]) => `${k}=${v}`).join(', ')}. ` +
      `${asserted} current assertion(s) compared across ${ctx.stateDocs.length} STATE doc(s); ` +
      'struck-through and SUPERSEDED SPANS are masked (spans, not whole lines), and older dated sections are reported as history rather than failed.',
  })
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

/**
 * I8 — added after a verification pass; NOT one of the plan's original seven.
 *
 * An external id or URL is EVIDENCE of publication, written by the outside world. `status` is
 * typed by us, and section 1 of the plan is a list of occasions when what we typed was wrong.
 * So evidence outranks status: a rendition carrying an external id while its asset is below the
 * bar to have shipped is a contradiction that no status-keyed check (I4, I5) can see.
 */
export function inv8(store: Store): Invariant {
  const id = 'I8'
  const title = 'No rendition carries publication evidence while its asset is below the bar to have shipped'
  const dep = need(store, ['content_renditions', 'content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const byId = new Map(store.content_assets.rows.map((a) => [a.id, a]))
  const findings: Finding[] = []
  const withEvidence = store.content_renditions.rows.filter(
    (r) => r.external_post_id?.trim() || r.external_url?.trim())

  for (const r of withEvidence) {
    const a = byId.get(r.asset_id)
    if (!a) {
      findings.push({ kind: 'violation', ref: r.id, message: `rendition ${r.platform}/${r.format} carries publication evidence but has no parent content_assets row` })
      continue
    }
    const rank = ASSET_RANK[a.status]
    const belowBar: string[] = []
    if (a.preflight !== 'green') belowBar.push(`preflight "${a.preflight}"`)
    if (rank === undefined) belowBar.push(`unknown asset status "${a.status}"`)
    else if (rank < ASSET_RANK.approved) belowBar.push(`asset status "${a.status}" is below approved`)
    if (!belowBar.length) continue
    const evidence = [
      r.external_post_id?.trim() ? `external_post_id="${r.external_post_id}"` : null,
      r.external_url?.trim() ? `external_url="${r.external_url}"` : null,
    ].filter(Boolean).join(', ')
    findings.push({
      kind: 'violation', ref: a.slug,
      message: `${r.platform}/${r.format} (rendition status "${r.status}") carries ${evidence}, but the asset is ${belowBar.join(' and ')}. Either it shipped and the asset record is wrong, or the id is spurious.`,
      fix: 'resolve against the platform, not against the status field: if it shipped, correct the asset; if it did not, clear the id',
    })
  }
  return {
    id, title, reads: [...dep.reads, `renditions carrying evidence: ${withEvidence.length}`],
    ...classify(true, findings), expected: false, findings,
  }
}

export function runInvariants(store: Store, ctx: RepoCtx, now: Date, rulings: EwaRulings = new Map()): Invariant[] {
  return [
    inv1(store, ctx), inv2(store, ctx), inv3(store), inv4(store, now),
    inv5(store, rulings), inv6(store), inv7(store, ctx), inv8(store),
  ]
}

// ═══════════════════════════════════════════════════════════ IO

export const PAGE = 1000

/** The minimum shape loadTable needs, so a fake client can be injected in tests. */
export interface QueryResult {
  data: unknown[] | null
  error: { message: string } | null
  count: number | null
}
export interface Queryable {
  from(table: string): {
    select(cols: string, opts: { count: 'exact' }): {
      range(from: number, to: number): PromiseLike<QueryResult>
    }
  }
}

/**
 * Read one table completely. Requests an EXACT server-side count and asserts it received that
 * many rows, so a response truncated by PostgREST's db-max-rows cap, or altered in flight,
 * fails loudly instead of arriving as a short array that reads as a real measurement.
 * Never throws: the failure is captured on the TableRead so each invariant decides for itself.
 *
 * `client` is injectable purely so this — the load-bearing half of the empty-read guard — can
 * be attacked in the test suite rather than only by hand.
 */
export async function loadTable<T>(name: string, cols: string, client?: Queryable): Promise<TableRead<T>> {
  const db = client ?? (admin() as unknown as Queryable)
  try {
    const rows: T[] = []
    let expected: number | null = null
    for (let from = 0; ; from += PAGE) {
      const { data, error, count } = await db
        .from(name)
        .select(cols, { count: 'exact' })
        .range(from, from + PAGE - 1)
      if (error) throw new Error(error.message)
      if (!data) throw new Error('query returned neither rows nor an error')
      if (expected === null) {
        if (typeof count !== 'number') {
          throw new Error('PostgREST returned no exact count, so row completeness cannot be asserted')
        }
        expected = count
      }
      rows.push(...(data as unknown as T[]))
      if (data.length === 0 || rows.length >= expected) break
    }
    if (rows.length !== expected) {
      throw new Error(`row-count mismatch: the server counted ${expected}, ${rows.length} arrived (truncated by db-max-rows, or the response was altered in flight)`)
    }
    return { rows, count: expected, error: null }
  } catch (e) {
    return { rows: [], count: 0, error: `${name}: ${(e as Error).message}` }
  }
}

/** Each table is read independently, so one table's outage cannot blank an unrelated check. */
export async function loadStore(): Promise<Store> {
  const [content_assets, content_renditions, content_channels, blog_articles] = await Promise.all([
    loadTable<AssetRow>('content_assets',
      'id,slug,status,content_type,funnel_stage,awareness,cta,preflight,ewa_task,canonical_article_id'),
    loadTable<RenditionRow>('content_renditions',
      'id,asset_id,platform,format,thumb_spec,status,scheduled_for,published_at,external_post_id,external_url,publisher'),
    loadTable<ChannelRow>('content_channels', 'platform,format,in_plan'),
    loadTable<ArticleRow>('blog_articles', 'id,slug,status,body'),
  ])
  return { content_assets, content_renditions, content_channels, blog_articles }
}

const rel = (p: string) => path.relative(REPO_ROOT, p).replace(/\\/g, '/')

function readFiles(paths: string[]): RepoFile[] {
  const out: RepoFile[] = []
  for (const p of paths) {
    try { out.push({ path: rel(p), text: fs.readFileSync(p, 'utf-8') }) } catch { /* unreadable */ }
  }
  return out
}

function walkFiles(root: string, match: (name: string) => boolean, depth = 5): string[] {
  const out: string[] = []
  const walk = (dir: string, d: number) => {
    if (d > depth) return
    let entries: fs.Dirent[]
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full, d + 1)
      else if (match(e.name)) out.push(full)
    }
  }
  walk(root, 0)
  return out.sort()
}

function dirMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => /\.md$/i.test(f) && f.toLowerCase() !== 'readme.md')
    .map((f) => path.join(dir, f))
}

export function buildCtx(): RepoCtx {
  let scannerSrc: string | null = null
  try { scannerSrc = fs.readFileSync(SCAN_JS, 'utf-8') } catch { scannerSrc = null }
  return {
    assetFiles: readFiles(dirMd(ASSETS_DIR)),
    draftFiles: readFiles(dirMd(DRAFTS_DIR)),
    workspaceFiles: readFiles(walkFiles(MACHINE, (n) => /\.md$/i.test(n))),
    scannerSrc,
    stateDocs: readFiles(walkFiles(ANDRO_ROOT, (n) => n === 'STATE.md', 4)),
  }
}

/**
 * THE WORKING-DIRECTORY GUARD. Every repo path above is resolved from `process.cwd()`, so run
 * from the wrong directory this process still starts, still connects to the database, and still
 * prints a verdict — one computed against ZERO repo files.
 *
 * That is not hypothetical. On 2026-08-01 `.claude/skills/content-status/scan.js` was found to
 * exit 0 having scanned zero assets, because it was invoked from the wrong cwd. It reported a
 * clean board by measuring nothing, which is the exact failure mode this whole script exists to
 * make impossible. A detector that can be silenced by a `cd` is not a detector.
 *
 * Returns a list of problems, empty when the layout is sound. Callers turn a non-empty list into
 * exit 1 (the doctor itself could not run) rather than into a verdict about content.
 */
export function repoLayoutProblems(): string[] {
  const problems: string[] = []
  const must: Array<[string, string]> = [
    [path.join(process.cwd(), 'package.json'), 'the frontend package.json (cwd is not 09_website-app/frontend)'],
    [MACHINE, 'the content-machine workspace'],
    [ASSETS_DIR, 'the assets/ directory'],
    [SCAN_JS, 'the content-status scanner'],
  ]
  for (const [p, what] of must) {
    if (!fs.existsSync(p)) problems.push(`cannot see ${what} at ${p}`)
  }
  return problems
}

// ═══════════════════════════════════════════════ one run, for every caller

/**
 * The verdict vector, computed in ONE place.
 *
 * `unchecked_unexpected` is the field the nightly alarm turns on, so it must be derived from
 * `Invariant.expected` here rather than re-derived by whatever is doing the alarming. Two
 * definitions of "is the board green" is precisely the drift this script was written to detect,
 * and a monitor that recomputes the verdict is a second definition wearing a disguise.
 */
export interface RunSummary {
  pass: number
  fail: number
  unchecked: number
  unchecked_unexpected: number
  violations: number
}

export function summaryOf(invs: Invariant[]): RunSummary {
  return {
    pass: invs.filter((i) => i.verdict === 'PASS').length,
    fail: invs.filter((i) => i.verdict === 'FAIL').length,
    unchecked: invs.filter((i) => i.verdict === 'UNCHECKED').length,
    unchecked_unexpected: invs.filter((i) => i.verdict === 'UNCHECKED' && !i.expected).length,
    violations: invs.reduce((a, i) => a + i.findings.filter((f) => f.kind === 'violation').length, 0),
  }
}

export interface DoctorRun {
  ran_at: string
  now: Date
  invariants: Invariant[]
  exit_code: 0 | 2 | 3
  summary: RunSummary
}

/**
 * ONE complete diagnosis: load both stores, run every invariant, score it.
 *
 * Extracted out of `main()` so an unattended caller (`content-doctor-cron.ts`) can reuse the
 * doctor rather than shell out to it and re-parse its own stdout. Anything that re-parses a
 * report is free to disagree with it; anything that imports this cannot.
 *
 * Reads only. The `--log` row and any ClickUp write belong to the caller, deliberately, so
 * `diagnose()` stays the pure "what is true right now" call.
 */
export async function diagnose(now: Date = new Date()): Promise<DoctorRun> {
  const store = await loadStore()
  const ctx = buildCtx()

  // Only reach for ClickUp when the question actually arises. If no amber-ewa asset has a
  // scheduled-or-later rendition there is nothing to verify, and I5 must PASS without a
  // network call rather than go UNCHECKED for a check it never needed.
  const needRuling = assetsNeedingRuling(store)
  const rulings = needRuling.length ? await resolveEwaApprovals(needRuling, getTask) : new Map()

  const invariants = runInvariants(store, ctx, now, rulings)
  return {
    ran_at: now.toISOString(),
    now,
    invariants,
    exit_code: exitCodeFor(invariants),
    summary: summaryOf(invariants),
  }
}

/**
 * The ONLY write path in this file: one `agent_runs` row. Shared by `main()` and by the cron
 * wrapper so the telemetry shape cannot fork between the manual and scheduled paths.
 * `logRun` never throws; it reports to stderr.
 */
export async function logDoctorRun(run: Pick<DoctorRun, 'exit_code' | 'invariants' | 'ran_at'>): Promise<void> {
  await logRun({
    agent: 'content-doctor',
    status: runStatusFor(run.exit_code),
    detail: {
      exit_code: run.exit_code,
      outcome: runOutcomeFor(run.exit_code),
      verdicts: Object.fromEntries(run.invariants.map((i) => [i.id, i.verdict])),
    },
    startedAt: run.ran_at,
  })
}

// ═══════════════════════════════════════════════════════════════════ main

export function render(invs: Invariant[]): string {
  const L: string[] = []
  const icon = { PASS: '🟢', FAIL: '🔴', UNCHECKED: '⚪' } as const
  L.push('')
  L.push('content-doctor — cross-store invariants (read-only; nothing below was fixed)')
  L.push('')
  for (const i of invs) {
    L.push(`${icon[i.verdict]} ${i.verdict.padEnd(9)} ${i.id}  ${i.title}`)
    L.push(`             reads: ${i.reads.length ? i.reads.join(', ') : '(nothing read)'}`)
    if (i.reason) L.push(`             why not measured${i.expected ? ' (EXPECTED)' : ''}: ${i.reason}`)
    for (const f of i.findings.filter((x) => x.kind === 'violation')) {
      L.push(`   ✗ ${f.ref}`)
      L.push(`       ${f.message}`)
      if (f.fix) L.push(`       fix (NOT applied): ${f.fix}`)
    }
    for (const f of i.findings.filter((x) => x.kind === 'note')) {
      L.push(`   · ${f.ref}: ${f.message}`)
    }
    L.push('')
  }
  L.push(summarise(invs))
  return L.join('\n')
}

async function main() {
  loadEnvLocal()

  // Before anything else: prove this process can actually SEE the repo. Half of every invariant
  // reads files resolved from cwd, so from the wrong directory the run would otherwise report a
  // confident verdict over zero files. Exit 1 (the doctor errored), never a content verdict.
  const layout = repoLayoutProblems()
  if (layout.length) {
    console.error('CONTENT-DOCTOR CANNOT RUN FROM HERE.')
    console.error(`  cwd:       ${process.cwd()}`)
    console.error(`  repo root: ${REPO_ROOT} (resolved ../../.. from cwd)`)
    for (const p of layout) console.error(`  ✗ ${p}`)
    console.error('  Run from 09_website-app/frontend. Refusing to report a board it cannot see.')
    process.exit(1)
  }

  const run = await diagnose()

  if (JSON_MODE) {
    console.log(JSON.stringify({
      tool: 'content-doctor',
      ran_at: run.ran_at,
      writes: DO_LOG ? 'one agent_runs telemetry row' : 'none',
      exit_code: run.exit_code,
      exit_meaning: runOutcomeFor(run.exit_code),
      summary: run.summary,
      invariants: run.invariants,
    }, null, 2))
  } else {
    console.log(render(run.invariants))
  }

  if (DO_LOG) await logDoctorRun(run)

  process.exit(run.exit_code)
}

// Anchored on a path separator so `test-content-doctor.ts` does NOT match. Without the anchor
// the test run entered main(), called loadEnvLocal() and opened a Supabase request, which
// contradicted the test file's own "no network, no credentials" claim.
if (/(^|[\\/])content-doctor\.(ts|js)$/.test(process.argv[1] ?? '')) {
  const startedAt = new Date().toISOString()
  main().catch(async (e) => {
    console.error('CONTENT-DOCTOR ERROR:', (e as Error).message)
    // A crash must be recorded, not swallowed. Still gated on --log so a default run writes
    // nothing at all; logRun never throws (it reports to stderr on failure).
    if (DO_LOG) {
      await logRun({
        agent: 'content-doctor',
        status: runStatusFor(1),
        error: (e as Error).message,
        detail: { exit_code: 1, outcome: runOutcomeFor(1) },
        startedAt,
      })
    }
    process.exit(1)
  })
}
