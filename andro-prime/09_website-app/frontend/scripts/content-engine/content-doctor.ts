/**
 * content-doctor — Phase 0 of `06_marketing/content-machine/content-pipeline-automation-plan.md`.
 *
 * Asserts the plan's cross-store invariants (its seven, plus an eighth added after a
 * verification pass found drift all seven missed, plus a ninth added with Phase 1) and reports
 * violations. A DETECTOR, not a fixer.
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
 *   0  every invariant PASS                 — the baseline since 2026-08-01
 *   2  at least one invariant FAIL          — THE ALARM. Same meaning as scan.js exit 2.
 *   3  no FAIL but at least one UNCHECKED   — not clean: something was not measured
 *   1  the doctor itself errored
 *
 * CHANGED 2026-08-01: exit 0 used to be unreachable, because invariant 3 could not run without
 * a Metricool credential and a check that cannot run is UNCHECKED, never PASS. The credential
 * now exists, I3 resolves every Metricool id against the live scheduler, and the baseline is
 * exit 0. Exit 3 is therefore no longer routine — it means a check that normally runs did not.
 * It still only ALARMS when the gap is unexpected, because a nightly job that fires every night
 * trains its reader to ignore it, which is how `12_operations/sops/content-machine-verification.md`
 * came to have never once been run. The alarm is exit 2, or an UNCHECKED that is not expected.
 */
import fs from 'fs'
import path from 'path'
import { loadEnvLocal, admin, logRun } from './_shared'
import { getTask, isApproved, unresolvedRulings, type ReviewTask } from './clickup'
// The ONE definition of which frontmatter keys the database owns lives beside scan.js and is READ
// AT RUNTIME (see DB_OWNED_KEYS below). It was briefly a build-time `import ... from
// '../../../../../.claude/...json'`, and that broke production on 2026-08-02: the Docker build
// context is this `frontend/` directory alone, so `COPY . .` never copies `.claude/` at the repo
// root, and `next build` type-checked this script and could not resolve a path five levels above
// its own context. A local `tsc` passed throughout, because a full checkout has the file and a
// pruned build image does not. **A tooling file outside the app's build context must never be a
// compile-time dependency of anything the app build compiles.** Reading it with `fs` removes the
// dependency entirely rather than relying on the tsconfig exclusion that unblocked the deploy.

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

// ══════════════════════════════════════════════ the database-owned key list, single-sourced
//
// WHAT WENT WRONG, AND WHY THIS IS AN IMPORT RATHER THAN A LIST. Phase 1 handed the state keys to
// the database and then wrote the list of those keys down THREE times on the same day: `DB_OWNED`
// / `DB_OWNED_REND` in `.claude/skills/content-status/scan.js`, `I9_FLAT` / `I9_REND` here, and
// `DB_OWNED_ASSET_KEYS` / `DB_OWNED_RENDITION_KEYS` in `content-sync.ts`. They had ALREADY diverged
// before anyone read them twice: this file watched 8 rendition keys where scan.js watched 10,
// missing `unipile_account` and `thumb_confirmed`. The doctor is the NIGHTLY AUTOMATED alarm and
// scan.js is hand-run, so the WEAKER list was the one nobody has to remember to run. Two copies of
// one fact, one of them updated, no alarm, is the precise defect Phase 1 exists to remove, and
// Phase 1 built it. Keith ruled on 2026-08-01: consolidate, strict superset wins.
//
// WHY A JSON FILE BESIDE scan.js. scan.js is zero-dep CommonJS run by `node`, not tsx, and lives
// under `.claude/skills/`, so it cannot import TypeScript out of the frontend. JSON is the one
// format both sides take as a REAL IMPORT (`require` there, `resolveJsonModule` here) instead of
// re-parsing each other's source the way invariant 2 has to for the enum vocabularies. Parsing is
// the fallback for literals that must stay literals; it is not the goal. There are now no copies,
// which is the only version of "keep these in sync" that has ever held.
//
// WHAT STILL HAS TO BE CHECKED, AND WHERE. Reading one file does not prove the two DERIVATIONS
// below and in scan.js agree, so `test-content-doctor.ts` RUNS scan.js over a fixture carrying
// every watched key in every spelling and fails unless scan.js refuses exactly this map, owner
// strings included. Behaviour, not source text.
export interface DbOwnedKey {
  /** The frontmatter spelling a human once typed. */
  key: string
  /** Other spellings of the SAME fact. A fact copied back under its column's name is still a copy. */
  aliases?: string[]
  /** The qualified column that owns the fact now, or null when nothing does. */
  column: string | null
  /** Appended in brackets after the column when a consumer names the owner. */
  ownerNote?: string
  /** The owner string when `column` is null. Required exactly then. */
  retiredAs?: string
  /** True when content-sync's generated block renders this fact, so a stripper may delete the key. */
  mirrored: boolean
  why?: string
}

/**
 * Validated on load rather than trusted, because a hand-edited data file is exactly as capable of
 * being wrong as the hand-maintained lists it replaces. The one failure this must catch is a
 * `column: null` with no `retiredAs`, which would render every message about that key as
 * `duplicates undefined`: a report about wrong facts, stating a wrong fact.
 */
export function readDbOwnedKeys(raw: unknown): { asset: DbOwnedKey[]; rendition: DbOwnedKey[] } {
  const side = (name: 'asset' | 'rendition'): DbOwnedKey[] => {
    const rows = (raw as Record<string, unknown>)?.[name]
    if (!Array.isArray(rows) || !rows.length) {
      throw new Error(`db-owned-keys.json: "${name}" is missing or empty. An empty watch list refuses nothing and would read as a clean board.`)
    }
    const seen = new Set<string>()
    return rows.map((r: DbOwnedKey) => {
      if (!r?.key) throw new Error(`db-owned-keys.json: an entry under "${name}" has no key`)
      if (r.column === null && !r.retiredAs) {
        throw new Error(`db-owned-keys.json: "${r.key}" has no column and no retiredAs, so nothing can say what owns it`)
      }
      for (const k of [r.key, ...(r.aliases ?? [])]) {
        if (seen.has(k)) throw new Error(`db-owned-keys.json: "${k}" is listed twice under "${name}"`)
        seen.add(k)
      }
      return r
    })
  }
  return { asset: side('asset'), rendition: side('rendition') }
}

/** Beside scan.js, which requires the same file. One file, two readers, no copies. */
export const DB_OWNED_KEYS_PATH = path.join(REPO_ROOT, '.claude/skills/content-status/db-owned-keys.json')

/**
 * Read at load, not imported, for the build-context reason above.
 *
 * IT MUST NOT THROW AT IMPORT TIME, and that is not a style preference. `REPO_ROOT` is
 * cwd-relative, so from the wrong directory this read fails, and an exception here fires while
 * the module is still being evaluated: BEFORE `main()` runs, and therefore before
 * `repoLayoutProblems()` can produce the named, deliberate exit-1 refusal that the wrong-cwd
 * incident exists to guarantee. A first draft did throw, and it silently replaced that refusal
 * with a raw stack trace in every script that imports this one. **A guard that runs at import
 * pre-empts the guard that was designed to run first.** So the failure is captured, reported by
 * `repoLayoutProblems()` as the layout problem it actually is, and turned into UNCHECKED by any
 * invariant that needs it. What it must never become is an empty watch list, which would refuse
 * nothing and render as a clean board.
 */
export function loadDbOwnedKeys(file: string = DB_OWNED_KEYS_PATH):
  { keys: { asset: DbOwnedKey[]; rendition: DbOwnedKey[] } | null; error: string | null } {
  let raw: string
  try {
    raw = fs.readFileSync(file, 'utf-8')
  } catch (e) {
    return {
      keys: null,
      error: `cannot read the database-owned key list at ${file}: ${(e as Error).message}. ` +
        'It is resolved from REPO_ROOT, which is relative to cwd, so the usual cause is the wrong working directory.',
    }
  }
  try {
    return { keys: readDbOwnedKeys(JSON.parse(raw)), error: null }
  } catch (e) {
    return { keys: null, error: `${file} is not usable: ${(e as Error).message}` }
  }
}

const DB_OWNED_LOAD = loadDbOwnedKeys()
/** Non-null on any run that got past `repoLayoutProblems()`, which reports the failure. */
export const DB_OWNED_KEYS_ERROR = DB_OWNED_LOAD.error
export const DB_OWNED_KEYS = DB_OWNED_LOAD.keys ?? { asset: [], rendition: [] }

/**
 * Every spelling of every fact, mapped to the owner a message will name. scan.js derives the same
 * map from the same file with the same rule; the test above proves the two agree by running it.
 */
export function ownerMap(entries: DbOwnedKey[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const e of entries) {
    const owner = e.column ? (e.ownerNote ? `${e.column} (${e.ownerNote})` : e.column) : e.retiredAs!
    for (const k of [e.key, ...(e.aliases ?? [])]) out[k] = owner
  }
  return out
}

/**
 * The stripper's delete list: the canonical spellings whose fact the generated block renders.
 *
 * ALIASES ARE DELIBERATELY EXCLUDED. `approved_at` and `drive_url` are the COLUMN spellings, kept
 * on the refusal list so a fact smuggled back under the database's own name is still caught. They
 * are not frontmatter keys anyone wrote, so putting them on a delete list would invite a stripper
 * to hunt for something that was never there.
 */
export function mirroredKeys(entries: DbOwnedKey[]): string[] {
  return entries.filter((e) => e.mirrored).map((e) => e.key)
}

/**
 * Mirrored frontmatter key -> the BARE column name, for callers that index a fetched row.
 * Qualified here, unqualified there, and the difference is load-bearing: `content_assets.drive_url`
 * is not a property of anything content-sync ever holds in memory.
 */
export function mirroredColumns(entries: DbOwnedKey[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const e of entries.filter((x) => x.mirrored)) out[e.key] = (e.column ?? '').split('.').pop()!
  return out
}

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
  /** The signed claim set version this derivative rides on (step 5.2). Null is correct for anything
   *  whose canonical article belongs to no topic; null WITH a topic is a hole, and I13 says so. */
  claim_set_id: string | null
  /** When classify-claims last read this asset's copy (step 5.3). Distinct from "has verdict rows":
   *  copy with no figure in it classifies fine and writes none. */
  claims_classified_at: string | null
}
export interface RenditionRow {
  id: string; asset_id: string; platform: string; format: string
  thumb_spec: string | null; status: string; scheduled_for: string | null
  published_at: string | null; external_post_id: string | null
  external_url: string | null; publisher: string | null
  /** Last touch of any kind. I13 reads it as "the copy moved", which is what Q13's "re-pinned at
   *  their next edit" and a stale classification are both measured against. */
  updated_at: string | null
  /** Added by the D1 ruling (2026-08-14). Null on every rendition that is not part of a variant set. */
  variant: string | null
}
export interface ChannelRow {
  platform: string; format: string; in_plan: boolean
  lane: string | null
  /** The media spec, which since plan step 6.3 is the ONLY place the requirement lives. */
  media_kind: string; media_min: number; media_max: number | null; thumb_spec: string
  /** Inclusive expiry of a deliberate coverage pause. Null means the channel is expected to produce. */
  coverage_paused_until: string | null
  coverage_pause_reason: string | null
  /**
   * Slots per week this channel owes, from the table in `unified-content-calendar.md`.
   * 1 is the FLOOR ("must not go dark"), not an assertion that the channel ships weekly.
   */
  weekly_slots: number | null
}
export interface ArticleRow { id: string; slug: string; status: string; body: string }

// ── The claim ledger (plan steps 5.1 to 5.4). Read by I13.

export interface TopicArticleRow { topic_id: string; article_id: string }
export interface ClaimSetRow {
  id: string; topic_id: string; version: number; status: string
  /** Null on a draft or signed set. Non-null is what makes "re-pinned at its next edit" checkable. */
  superseded_at: string | null
}
export interface AssetClaimRow {
  asset_id: string; claim_id: string | null; tier: number; resolution: string | null
}

/** One media file linked to one rendition, in a role. Read by I14 (plan step 6.3). */
export interface RenditionMediaRow { rendition_id: string; media_id: string; role: string }

/** A table read. `error` non-null means it was NOT read; `rows` is then meaningless. */
export interface TableRead<T> { rows: T[]; count: number; error: string | null }

export interface Store {
  content_assets: TableRead<AssetRow>
  content_renditions: TableRead<RenditionRow>
  content_channels: TableRead<ChannelRow>
  blog_articles: TableRead<ArticleRow>
  content_topic_articles: TableRead<TopicArticleRow>
  content_claim_sets: TableRead<ClaimSetRow>
  content_asset_claims: TableRead<AssetClaimRow>
  content_rendition_media: TableRead<RenditionMediaRow>
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
 * Blank the `content-sync` GENERATED STATE block, so nothing in this file can read it.
 *
 * Phase 1 mirrors database state back into each asset file inside a marked block, and CONTEXT.md
 * is explicit that the mirror is never an input. A detector that read it would be treating the
 * database's own copy of a fact as independent repo evidence: I1 asks "does any file actually
 * mention this slug", and a mirror answering yes is the row vouching for itself. That is the
 * dual store reappearing inside the thing built to detect it.
 *
 * A BEGIN with no END is blanked to end of file rather than left alone: a half-written mirror is
 * still a mirror, and the conservative reading of a damaged block is that none of it is evidence.
 * (`content-sync` refuses such a file rather than rewriting it, so this case survives on disk.)
 */
export function stripGeneratedState(text: string): string {
  return text
    .replace(/<!--\s*BEGIN GENERATED STATE[\s\S]*?END GENERATED STATE\s*-->/g, ' ')
    .replace(/<!--\s*BEGIN GENERATED STATE[\s\S]*$/, ' ')
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
 *
 * DOUBLE-QUOTED SPANS ARE MASKED TOO, and that is a different reason: a count inside quotation
 * marks is a QUOTATION of a claim, not a claim. Without this, correcting a count in prose
 * re-triggers the very alarm the correction resolves — on 2026-08-16 I7 failed on the sentence
 * `"09_website-app/STATE.md says "all 19 published articles" and the database says 18"`, which is
 * the doc that FOUND the discrepancy. A detector that cannot tell an assertion from a report of an
 * assertion punishes writing the correction down, which is the one behaviour it wants.
 * Only double quotes, straight or curly. Single quotes would swallow every apostrophe.
 */
export function maskRetired(line: string): string {
  const blank = (s: string) => ' '.repeat(s.length)
  return line
    .replace(/~~[\s\S]*?~~/g, blank)
    .replace(/\*{0,2}\[SUPERSEDED[\s\S]*?\]\*{0,2}/gi, blank)
    .replace(/\*\*SUPERSEDED[^*]*\*\*/gi, blank)
    .replace(/"[^"\n]*"/g, blank)
    .replace(/“[^”\n]*”/g, blank)
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
    L.push('EXIT 3, not an alarm: nothing failed, and every gap above is a documented one. The baseline is exit 0, so a gap here is worth reading.')
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
//
// PHASE 1 AUDIT (2026-08-01): state left the frontmatter, so everything this invariant reads out
// of a file was re-checked against the new shape. It survives untouched in substance because the
// only frontmatter key it reads from an asset file is `slug`, which is IDENTITY and stays in the
// file by the split's own test (a human types it while writing). The batch-draft branch reads
// `platform`, `format`, `canonical_asset`, `batch` and `queue_row` from a DRAFT, and drafts are
// not asset files: `content-sync` writes only to assets/, so a draft carries no mirror and those
// keys are still the human's own. What did change is that asset files now contain a generated
// copy of database state, which must never count as evidence: see `stripGeneratedState`.
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
      // Any generated mirror is excluded before asking whether the draft names the slug. The
      // question is whether a HUMAN joined the two stores; a slug that only appears because the
      // database wrote it back would be the row proving its own linkage.
      if (stripGeneratedState(draft.text).includes(a.slug)) {
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

    const hits = ctx.workspaceFiles
      .filter((d) => stripGeneratedState(d.text).includes(a.slug)).map((d) => d.path)
    const unavailable = [!haveRends ? 'content_renditions' : null, !haveArticles ? 'blog_articles' : null]
      .filter(Boolean).join(' and ')
    const clauses = ['no assets/*.md']
    clauses.push(haveRends ? 'no matching batch draft' : `batch-draft matching NOT ATTEMPTED (${unavailable} unavailable)`)
    if (!republishCheckable) {
      clauses.push(`the substack-republish exemption was NOT ATTEMPTED (${unavailable} unavailable), so this row is reported rather than exempted`)
    }
    clauses.push(hits.length
      ? `its slug is mentioned only in ${hits.join(', ')} (generated state blocks excluded: a mirror of this row is not evidence of it)`
      : 'its slug appears in NO file under content-machine/, outside the generated state blocks that mirror the database itself: the row exists only in the database')
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
//
// NARROWED BY PHASE 1, and the narrowing is the honest reading rather than a concession.
// `status`, `preflight`, and the per-rendition `status` and `publisher`, are no longer in any
// frontmatter, so part 2a cannot read them from a file: there is no longer a subject to measure.
// A check whose subject has been removed must stop claiming it, so those keys are out of scope
// here and the title says IDENTITY. They are not unmeasured, they are GONE, and the invariant
// that fails if one comes back is I9.
//
// Part 2b is untouched, and it still measures the two status vocabularies, because its subject
// was never the frontmatter: it compares LIVE DATABASE VALUES against what `scan.js` accepts.
// Anyone assuming the status half died with the frontmatter would be wrong, hence this note.
//
// The one-directional limit is unchanged and load-bearing: this client can prove a value is
// ACCEPTED (a live row holds it) but never that one is REFUSED, because PostgREST with a
// service-role key cannot reach `pg_constraint` (it answers 404 PGRST205).
export const VOCAB_MAP: Array<[string, string]> = [
  ['PLATFORMS', 'content_renditions.platform'],
  ['FORMATS', 'content_renditions.format'],
  ['THUMBS', 'content_renditions.thumb_spec'],
  ['REND_ORDER', 'content_renditions.status'],
  ['STATUS_ORDER', 'content_assets.status'],
  ['CONTENT_TYPES', 'content_assets.content_type'],
  ['FUNNEL_STAGES', 'content_assets.funnel_stage'],
]

/**
 * The frontmatter keys part 2a may still read, and the column each value must be accepted by.
 * IDENTITY and CRAFT only: every key here is one a human types while writing, which is the
 * split's own test for which store owns a fact. Nothing that an integration writes belongs in
 * these tables, and `I9_FLAT` / `I9_REND` are the complement that proves it: the two sets must
 * never intersect, or the doctor would be reading a value out of a file it also fails the file
 * for carrying.
 */
export const FLAT_ENUMS: Record<string, string> = {
  content_type: 'content_assets.content_type',
  funnel_stage: 'content_assets.funnel_stage',
  awareness: 'content_assets.awareness',
  cta: 'content_assets.cta',
}
export const REND_ENUMS: Record<string, string> = {
  platform: 'content_renditions.platform',
  format: 'content_renditions.format',
  thumb: 'content_renditions.thumb_spec',
}

export function inv2(store: Store, ctx: RepoCtx): Invariant {
  const id = 'I2'
  const title = 'Frontmatter IDENTITY enum values are accepted by the DB, and the scanner vocabulary is not narrower than the DB'
  const dep = need(store, ['content_assets', 'content_renditions'])
  const withFm = ctx.assetFiles.filter((f) => parseAsset(f.text).hasFrontmatter)
  const reads = [...dep.reads,
    `assets/ (${ctx.assetFiles.length} files, ${withFm.length} with frontmatter)`,
    `scan.js (${ctx.scannerSrc ? `${ctx.scannerSrc.length} bytes` : 'UNREAD'})`]
  if (!dep.ok) return { id, title, reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const findings: Finding[] = []
  const A = store.content_assets.rows, R = store.content_renditions.rows
  const set = (xs: Array<string | null>) => new Set(xs.filter(Boolean) as string[])
  // Only the columns something below actually compares against. `preflight` and `publisher` were
  // dropped with the frontmatter keys that fed them: an unused live set reads like a column still
  // under test, which is the same species of false reassurance as an unperformed check.
  const live: Record<string, Set<string>> = {
    'content_assets.status': set(A.map((a) => a.status)),
    'content_assets.content_type': set(A.map((a) => a.content_type)),
    'content_assets.funnel_stage': set(A.map((a) => a.funnel_stage)),
    'content_assets.awareness': set(A.map((a) => a.awareness)),
    'content_assets.cta': set(A.map((a) => a.cta)),
    'content_renditions.platform': set(R.map((r) => r.platform)),
    'content_renditions.format': set(R.map((r) => r.format)),
    'content_renditions.thumb_spec': set(R.map((r) => r.thumb_spec)),
    'content_renditions.status': set(R.map((r) => r.status)),
  }

  // 2a: frontmatter value -> DB column. Provable in ONE direction only from this client.
  const unproven = new Map<string, string[]>()
  let compared = 0
  for (const f of ctx.assetFiles) {
    const { flat, renditions } = parseAsset(f.text)
    const pairs: Array<[string, string]> = []
    for (const [k, col] of Object.entries(FLAT_ENUMS)) if (flat[k]) pairs.push([col, flat[k]])
    for (const r of renditions) for (const [k, col] of Object.entries(REND_ENUMS)) if (r[k]) pairs.push([col, r[k]])
    compared += pairs.length
    for (const [col, val] of pairs) {
      if (live[col]?.has(val)) continue
      const key = `${col} = "${val}"`
      unproven.set(key, [...(unproven.get(key) ?? []), f.path])
    }
  }
  reads.push(`identity enum values compared: ${compared}`)
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

  // 2a's denominator, pushed as a finding rather than left on the reads line alone, so it is
  // still visible when 2b or 2c has failed and the verdict is about something else.
  const scope = `part 2a scope after Phase 1: ${Object.keys(FLAT_ENUMS).join(', ')} and each rendition's ${Object.keys(REND_ENUMS).join(', ')}. The state keys are not in these files any more, so they are not read here; I9 is what fails if one returns.`
  findings.push({
    kind: 'note', ref: 'part 2a',
    message: `${compared} identity enum value(s) compared across ${withFm.length} file(s) with frontmatter (${ctx.assetFiles.length} read). ${scope}`,
  })

  const violated = findings.some((f) => f.kind === 'violation')
  // Nothing to compare is not a pass, and this is the shape Phase 1 makes possible: strip the
  // wrong keys, or point the doctor at an empty assets/, and 2a would silently measure nothing
  // while 2b and 2c carried the verdict on their own.
  if (!violated && compared === 0) {
    return {
      id, title, reads,
      ...classify(false, findings,
        `part 2a compared NOTHING: none of the ${ctx.assetFiles.length} asset file(s) carried an identity enum value (${scope}). Parts 2b and 2c were measured and are reported above, but the frontmatter-to-database half of this invariant did not run, and an empty comparison is indistinguishable from a clean one.`),
      expected: false, findings,
    }
  }
  // Part 2a being unprovable is a real gap, and a real gap is not a pass.
  if (!violated && unproven.size > 0) {
    return {
      id, title, reads,
      ...classify(false, findings,
        `${unproven.size} frontmatter value(s) could not be checked against the CHECK constraint FROM THIS CLIENT: PostgREST with a service-role key cannot reach pg_constraint (verified by hand out of band, not by this run: PostgREST answers 404 PGRST205). The constraint definitions ARE readable by another route (a raw SQL session), so this is a limitation of this client, not an unknowable fact. Parts 2b and 2c were measured and clean.`),
      expected: false, findings,
    }
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I3: external_post_id still resolves in Metricool.

export const METRICOOL_VARS = ['METRICOOL_USER_TOKEN', 'METRICOOL_USER_ID', 'METRICOOL_BLOG_ID'] as const

/**
 * One post id's fate. `unresolvable` is NOT `missing`: only the second is drift.
 *
 * `found` carries the ARM FLAGS as well as existence, because those are two different questions
 * and only the first was ever asked. A post can resolve perfectly and still be a draft that will
 * never fire, which is what I12 exists to catch. `armed` is null when the body resolved but the
 * flags could not be read: unknown must never collapse into "armed", or the check reports a pass
 * it did not perform.
 */
export type PostState =
  | { state: 'found'; armed: boolean | null; draft: boolean | null; autoPublish: boolean | null }
  | { state: 'missing' }
  | { state: 'unresolvable'; why: string }
export type MetricoolProbe =
  | { probed: false; why: string; credentialAbsent: boolean }
  | { probed: true; posts: Map<string, PostState> }
export type PostFetcher = (postId: string) => Promise<PostState>

/** Which of the three credentials are actually present. Evaluated, never asserted. */
export function metricoolCreds(env: Record<string, string | undefined> = process.env):
  { ok: boolean; missing: string[]; token: string; userId: string; blogId: string } {
  const missing = METRICOOL_VARS.filter((k) => !env[k]?.trim())
  return {
    ok: missing.length === 0, missing: [...missing],
    token: env.METRICOOL_USER_TOKEN ?? '', userId: env.METRICOOL_USER_ID ?? '', blogId: env.METRICOOL_BLOG_ID ?? '',
  }
}

/**
 * Resolve one scheduler post by id.
 *
 * The per-post endpoint is used deliberately over the date-windowed list endpoint. A window
 * needs a start and an end, and any post scheduled outside whatever window we guessed would
 * read as MISSING, which on this invariant means "drift" — a false alarm on a gate. Asking
 * about one id has no window to get wrong: 200 means it resolves, 404 means Metricool does not
 * have it, and every other outcome means we did not find out. That third case must never
 * collapse into either of the first two.
 */
export function metricoolFetcher(
  creds: ReturnType<typeof metricoolCreds>,
  fetchImpl: typeof fetch = fetch,
): PostFetcher {
  const q = `blogId=${encodeURIComponent(creds.blogId)}&userId=${encodeURIComponent(creds.userId)}&userToken=${encodeURIComponent(creds.token)}`
  return async (postId: string): Promise<PostState> => {
    try {
      const res = await fetchImpl(`https://app.metricool.com/api/v2/scheduler/posts/${encodeURIComponent(postId)}?${q}`)
      if (res.status === 200) {
        // A 200 whose body cannot be read is still FOUND — existence is settled by the status
        // code. Only the arm flags are unknown, and unknown is a state this type carries.
        let body = ''
        try { body = typeof res.text === 'function' ? await res.text() : '' } catch { body = '' }
        return { state: 'found', ...readArmFlags(body) }
      }
      if (res.status === 404) return { state: 'missing' }
      return { state: 'unresolvable', why: `Metricool answered HTTP ${res.status}` }
    } catch (e) {
      return { state: 'unresolvable', why: `Metricool request failed: ${(e as Error).message}` }
    }
  }
}

/**
 * Read `draft` and `autoPublish` out of a scheduler-post body.
 *
 * 🔴 THESE ARE TWO DIFFERENT QUESTIONS AND THIS FUNCTION USED TO CONFLATE THEM. It computed
 * `armed = !draft && autoPublish`, which made every notification-delivery post read as unarmed.
 *
 * `draft` is the arming flag: false means the post is live in the calendar and will be acted on.
 * **`autoPublish` is the DELIVERY METHOD**, and Metricool's own API documentation is explicit:
 * true publishes automatically via the API at the scheduled time, false "sends a push notification
 * to the user's Metricool mobile app instead, so they complete the publication by hand". It is not
 * an approval step and it is not a draft.
 *
 * Proved against live data on 2026-08-18. Keith armed 18 to 29 August; every post in that range
 * came back `draft:false` and 30 August was still `draft:true`, so the boundary matched what he did
 * exactly. `autoPublish` was false across all of them and did not move when he armed, because it
 * is not the flag arming touches.
 *
 * ⚠️ THE OLD READING ALSO HAD THE RISK INVERTED. A manual-delivery post does not fail by sitting
 * inert; it pings a phone at the slot and waits. A missed tap is what dropped day two of the
 * carousel run, and the old rule would have gone GREEN the moment anyone flipped `autoPublish`
 * true, which measures none of that.
 *
 * `armed` is null only when `draft` itself is unreadable: that is a genuine shape change and must
 * never collapse into a pass. An unreadable `autoPublish` leaves delivery unknown, which is a
 * weaker statement and is reported as one.
 */
export function readArmFlags(body: string): { armed: boolean | null; draft: boolean | null; autoPublish: boolean | null } {
  let d: unknown, a: unknown
  try {
    const data = (JSON.parse(body) as { data?: Record<string, unknown> })?.data
    d = data?.draft
    a = data?.autoPublish
  } catch { /* fall through to unknown */ }
  const draft = typeof d === 'boolean' ? d : null
  const autoPublish = typeof a === 'boolean' ? a : null
  const armed = draft === null ? null : !draft
  return { armed, draft, autoPublish }
}

/** Ask Metricool about every id, once each. Never throws: a dead API is `unresolvable`. */
export async function probeMetricool(ids: string[], fetchPost: PostFetcher): Promise<Map<string, PostState>> {
  const posts = new Map<string, PostState>()
  for (const postId of ids) {
    if (posts.has(postId)) continue
    posts.set(postId, await fetchPost(postId))
  }
  return posts
}

export function inv3(store: Store, probe?: MetricoolProbe): Invariant {
  const id = 'I3'
  const title = 'Every rendition carrying an external_post_id still resolves in Metricool'
  const dep = need(store, ['content_renditions', 'content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const withId = store.content_renditions.rows.filter((r) => r.external_post_id?.trim())
  const bySlug = new Map(store.content_assets.rows.map((a) => [a.id, a.slug]))
  const metricool = withId.filter((r) => r.publisher === 'metricool')
  const other = withId.filter((r) => r.publisher !== 'metricool')
  const who = (r: RenditionRow) => `${bySlug.get(r.asset_id) ?? r.asset_id}  ${r.platform}/${r.format}  external_post_id=${r.external_post_id}`

  const findings: Finding[] = []
  // Scoped by publisher on purpose: taken literally the invariant would demand Metricool
  // resolve Unipile and Substack ids, which guarantees false failures.
  for (const r of other) {
    findings.push({
      kind: 'note', ref: r.id,
      message: `OUT OF SCOPE ${who(r)}  publisher=${r.publisher}: not a Metricool id, this invariant cannot cover it`,
    })
  }
  const reads = [...dep.reads,
    `renditions carrying an external_post_id: ${withId.length}`,
    `of those, Metricool-published: ${metricool.length}`]

  // Nothing to resolve is not a pass. Same rule as `need()`: from here, "every id resolves"
  // and "there were no ids" are indistinguishable, and only one of them is a measurement.
  if (metricool.length === 0) {
    return {
      id, title, reads,
      ...classify(false, findings, 'no rendition carries a Metricool external_post_id, so there was nothing to resolve. Not a failure, and not a pass either.'),
      expected: true, findings,
    }
  }

  if (!probe || !probe.probed) {
    const why = probe?.why ?? 'Metricool was not consulted'
    for (const r of metricool) findings.push({ kind: 'note', ref: r.id, message: `UNRESOLVED   ${who(r)}  (status ${r.status})` })
    return {
      id, title, reads,
      ...classify(false, findings, why),
      // An absent credential is the documented structural gap. A credential that is present
      // but did not produce an answer is a check that normally runs and did not: that is an
      // alarm, because it is exactly how a silent gate failure would look.
      expected: probe?.credentialAbsent ?? true,
      findings,
    }
  }

  const unresolvable: string[] = []
  for (const r of metricool) {
    const postId = r.external_post_id!.trim()
    const st = probe.posts.get(postId) ?? { state: 'unresolvable' as const, why: 'no answer was recorded for this id' }
    if (st.state === 'found') continue
    if (st.state === 'unresolvable') {
      unresolvable.push(`${postId} (${bySlug.get(r.asset_id) ?? r.asset_id}): ${st.why}`)
      findings.push({ kind: 'note', ref: r.id, message: `UNRESOLVED   ${who(r)}: ${st.why}` })
      continue
    }
    findings.push({
      kind: 'violation', ref: r.id,
      message: `${who(r)} is "${r.status}" in our database, but Metricool has no post with that id. The id changed under us or the post was deleted, and both stores now disagree about something the outside world owns.`,
      fix: 'find the post in Metricool and correct external_post_id, or clear the id and the rendition status if it no longer exists',
    })
  }

  // A definite violation outranks an unresolvable one, matching I5: it is actionable now.
  if (findings.some((f) => f.kind === 'violation')) {
    return { id, title, reads, ...classify(true, findings), expected: false, findings }
  }
  if (unresolvable.length) {
    return {
      id, title, reads,
      ...classify(false, findings, `${unresolvable.length} of ${metricool.length} Metricool id(s) could not be resolved, so they are unverified rather than confirmed: ${unresolvable.join(' | ')}`),
      expected: false, findings,
    }
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
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
// plan (non-green blocks) and the old scan.js G2 (amber-ewa + a non-empty ewa_task passes).
// Neither was right: a non-empty `ewa_task` proves a question was ASKED, not answered. G2 let an
// asset reach `approved` on the routing alone, G3 then let its rendition reach `scheduled`, and
// the X week-1 renditions are scheduled with autoPublish: true — so an asset merely ROUTED to Ewa
// would publish on a timer before she had ruled.
//
// G2 NO LONGER EXISTS, AND THIS COMMENT USED TO SAY IT DID. It described scan.js G2 as a live,
// deliberately weaker gate that "must NOT be harmonised downward". Phase 1 removed G1 to G4 from
// the scanner on the same day, because the state fields those gates read are no longer in
// frontmatter, and a scanner asserting a gate it cannot see is the `thumb_confirmed` shape wearing
// a hat. Corrected 2026-08-01: a comment claiming a gate that is not there is exactly the drift
// the doctor exists to catch, and it was sitting inside the doctor.
//
// WHERE THE GATE ACTUALLY LIVES NOW, in two layers that do different work:
//   the database, which is the floor. `content_assets_approval_gate` (a CHECK) and
//   `gate_rendition_publish()` (a BEFORE INSERT OR UPDATE trigger), both in
//   `09_website-app/database/migrations/20260801_content_state_guards.sql`. They are STRICTER
//   than G2 ever was: reaching `approved` on the amber route needs `ewa_signed_at`, which only
//   the sign-off sync writes, not merely a routing. They fire on INSERT as well as UPDATE,
//   because every one of these tables is written by scripts that insert, and a gate you can
//   arrive at without passing through is not a gate.
//   THIS INVARIANT, which is the only place the ruling itself is read. The database can see that
//   a timestamp exists; it cannot ask ClickUp whether Ewa's task is complete and whether every
//   named ruling on it was answered. That question needs the network, so it belongs in the
//   nightly doctor and nowhere else. scan.js stays offline and fast and asserts none of it.
//
// `ewa_task` is read from `content_assets`, not from frontmatter, and after Phase 1 frontmatter
// no longer carries it at all: I9 fails any file that grows the key back. The column is also the
// one this invariant can join to the renditions it is gating. Live values come in two shapes, a
// bare id and a full task URL, which is why the id is extracted rather than used as-is.

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

/**
 * I9, added with Phase 1 (2026-08-01). NOT one of the plan's original seven.
 *
 * THIS IS THE ONE THAT STOPS THE DUAL STORE GROWING BACK. Every failure in section 1 of the plan
 * was the same shape: two copies of one fact, one of them updated, no alarm. Phase 1's fix is not
 * a better sync, it is leaving the second copy nowhere to live: the file owns identity and craft,
 * the database owns state. A state key reappearing in frontmatter is that second home being dug
 * again, and it must fail on the day it appears rather than on the day the two copies diverge.
 *
 * IT ASKS THE DATABASE NOTHING, deliberately. Whether the file's value AGREES with the database
 * is beside the point: an agreeing copy is still a copy, and it is the one that quietly stops
 * agreeing later. The key's PRESENCE is the violation, so an empty `ewa_task:` fails too, because
 * an empty slot is an invitation to fill it. `thumb_confirmed` was the ancestor of this whole
 * class: a human typing a description of what a machine had done.
 *
 * SCOPE IS assets/ ONLY. A batch draft under drafts/ is not an asset file, it carries the batch's
 * own working record, and CONTEXT.md places it outside this rule; widening to drafts/ would be
 * this invariant deciding a question Keith has not been asked. Stated on the report rather than
 * left as a silence, so nobody reads a green I9 as covering drafts.
 *
 * The generated state block cannot trip it: `parseAsset` reads only between the frontmatter
 * fences, and the mirror sits below them. That separation is what makes the mirror safe.
 *
 * THE WATCH LIST IS NO LONGER TYPED HERE. It was, until 2026-08-01, and it was already two keys
 * short of scan.js's on the day it was written: `unipile_account` and `thumb_confirmed` were
 * watched by the hand-run scanner and not by this nightly one. Both maps are now derived from
 * `db-owned-keys.json`, the single definition, and the strict superset won. See DB_OWNED_KEYS at
 * the top of this file.
 */
export const I9_FLAT: Record<string, string> = ownerMap(DB_OWNED_KEYS.asset)
export const I9_REND: Record<string, string> = ownerMap(DB_OWNED_KEYS.rendition)

/** One offending key, already resolved to the column that owns the fact it duplicates. */
export interface StateKeyHit { where: string; key: string; column: string; value: string }

/**
 * Every database-owned key in one asset file's frontmatter. Both spellings of each fact are
 * checked: the old frontmatter name AND the database's own column name, because a fact copied
 * back under the column's name is the same second copy wearing the more convincing label.
 */
export function stateKeysIn(text: string): StateKeyHit[] {
  const { flat, renditions, hasFrontmatter } = parseAsset(text)
  if (!hasFrontmatter) return []
  const hits: StateKeyHit[] = []
  for (const [key, column] of Object.entries(I9_FLAT)) {
    if (key in flat) hits.push({ where: 'frontmatter', key, column, value: flat[key] })
  }
  renditions.forEach((r, i) => {
    const who = [r.platform, r.format].filter(Boolean).join('/') || `#${i + 1}`
    for (const [key, column] of Object.entries(I9_REND)) {
      if (key in r) hits.push({ where: `rendition ${who}`, key, column, value: r[key] })
    }
  })
  return hits
}

export function inv9(ctx: RepoCtx): Invariant {
  const id = 'I9'
  const title = 'No asset file carries a frontmatter key the database owns'
  const parsed = ctx.assetFiles.map((f) => ({ ...f, ...parseAsset(f.text) }))
  const withFm = parsed.filter((f) => f.hasFrontmatter)
  const reads = [`assets/ (${ctx.assetFiles.length} files, ${withFm.length} with frontmatter)`,
    `keys watched: ${Object.keys(I9_FLAT).length} asset, ${Object.keys(I9_REND).length} per rendition`,
    `drafts/ (${ctx.draftFiles.length} files, NOT inspected: out of scope by CONTEXT.md, a batch draft is not an asset file)`]

  // No frontmatter to inspect is not a clean board. This is the failure mode that matters here:
  // a wrong cwd, an emptied directory or a rename would otherwise let I9 report "no second copy
  // of any fact" having opened nothing at all.
  if (withFm.length === 0) {
    return {
      id, title, reads,
      ...classify(false, [],
        `none of the ${ctx.assetFiles.length} file(s) in assets/ presented parseable frontmatter, so no file was inspected. Nothing was measured, and an empty inspection must not read as an absence of violations.`),
      expected: false, findings: [],
    }
  }

  const findings: Finding[] = []
  for (const f of withFm) {
    const hits = stateKeysIn(f.text)
    if (!hits.length) continue
    // Truncation is MARKED. A URL cut at 60 characters with no ellipsis reads as a complete
    // value that simply differs from the database's, which is a wrong fact in a report about
    // wrong facts. Same convention as I6.
    const shown = (v: string) => (v.length > 60 ? `${v.slice(0, 60)}…` : v)
    const detail = hits.map((h) =>
      `${h.where} "${h.key}"${h.value ? ` = "${shown(h.value)}"` : ' (empty)'} duplicates ${h.column}`).join('; ')
    findings.push({
      kind: 'violation', ref: f.path,
      message: `${hits.length} database-owned key(s) in the frontmatter: ${detail}. The database owns each of these, so the file now holds a second copy of a fact no diff and no gate can reconcile, and an empty key is a slot waiting to be filled.`,
      fix: 'delete these keys from the frontmatter. The values already live in the database; content-sync mirrors them back below the frontmatter as a generated block, which is read-only and never an input.',
    })
  }
  // Reported, never silent: a file with no frontmatter was NOT inspected, and the reason it has
  // none is scan.js's schema gate to rule on, not this invariant's.
  const noFm = parsed.filter((f) => !f.hasFrontmatter)
  if (noFm.length) {
    findings.push({
      kind: 'note', ref: 'not inspected',
      message: `${noFm.length} file(s) presented no parseable frontmatter and were NOT inspected by this invariant: ${noFm.map((f) => f.path).join(', ')}. A missing or malformed frontmatter block is scan.js's schema gate to rule on.`,
    })
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I10: forward COVERAGE. The only invariant that is not about stores agreeing.

/** How far ahead a lane-1 channel must have something queued. One week of the published rhythm. */
export const COVERAGE_WINDOW_DAYS = 7

/**
 * I10 — every lane-1 channel has something queued in the next week, or a reason on the record.
 *
 * EVERY OTHER INVARIANT HERE CHECKS THAT STORES AGREE WITH EACH OTHER, AND THAT IS WHY THIS ONE
 * EXISTS. On 2026-08-05 the Facebook lane had published nothing for a week, LinkedIn had run at
 * a third of its cadence, and the board was green with all nine passing. Four approved,
 * pre-flight-green assets were sitting unscheduled, and that is a state in which the repo, the
 * database, Metricool and ClickUp agree with one another perfectly. Consistency is trivially
 * satisfiable by producing nothing, so a suite that only checks agreement reports its cleanest
 * result exactly when the pipeline has stopped.
 *
 * SCOPE IS LANE 1 ONLY, and that is the calendar's rule rather than a convenience. Lane 1 (the
 * written channels, atomised from published articles) "runs every week unconditionally". Lane 2
 * is the camera lane, which is batched onto a booked filming day and "may slip; it must never
 * hold Lane 1". Alarming on lane 2 would fire every week there is no shoot, and a check that
 * always alarms is a check nobody reads.
 *
 * A PAUSE IS AN ANSWER, AN EXPIRED PAUSE IS NOT. A channel may record why it is dark
 * (`coverage_pause_reason`) and until when (`coverage_paused_until`). The expiry is the point:
 * an indefinite pause is how a gap becomes invisible again, which is the thing this invariant
 * exists to end. A lapsed pause is a violation naming the reason that has run out.
 */
/**
 * Is this channel's coverage deliberately stood down RIGHT NOW?
 *
 * Extracted 2026-08-16 when the under-cadence check gained a second call site. An unparseable or
 * absent date is NOT a pause: a pause has to be a live, dated decision, and a malformed one
 * silencing the alarm would be the indefinite pause the expiry exists to prevent.
 */
function paused(ch: ChannelRow, now: Date): boolean {
  if (!ch.coverage_paused_until) return false
  const until = new Date(`${ch.coverage_paused_until}T23:59:59Z`)
  return !Number.isNaN(until.getTime()) && until.getTime() >= now.getTime()
}

export function inv10(store: Store, now: Date): Invariant {
  const id = 'I10'
  const title = `Every lane-1 channel has its week's slots filled in the next ${COVERAGE_WINDOW_DAYS} days, or a live reason why not`
  const dep = need(store, ['content_channels', 'content_renditions'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const lane1 = store.content_channels.rows.filter((c) => c.in_plan && c.lane === 'lane-1')
  const horizon = new Date(now.getTime() + COVERAGE_WINDOW_DAYS * 864e5)
  const reads = [
    `content_channels (${store.content_channels.rows.length} rows, ${lane1.length} in-plan lane-1)`,
    `content_renditions (${store.content_renditions.rows.length} rows)`,
    `window: ${now.toISOString().slice(0, 10)} to ${horizon.toISOString().slice(0, 10)}`,
  ]

  // A board with no lane-1 channel is not a covered board; it is an unreadable one. Same rule
  // as I9's empty-frontmatter guard: an empty denominator must never read as zero violations.
  if (lane1.length === 0) {
    return {
      id, title, reads,
      ...classify(false, [], 'no in-plan lane-1 channel was found, so coverage was not measured against anything. An empty plan must not read as full coverage.'),
      expected: false, findings: [],
    }
  }

  const findings: Finding[] = []
  for (const ch of lane1) {
    // Coverage counts BOTH directions from now: something queued ahead, or something that
    // actually went out recently.
    //
    // Forward-only was the first version and it was wrong in the way that matters: on
    // 2026-08-05 this invariant went red on Substack, Keith published the issue it was
    // complaining about, and the invariant stayed red, because a post that has just gone live
    // has no future `scheduled_for`. An alarm that does not clear when you do the thing it
    // asked for is worse than no alarm, because the next red gets ignored.
    const back = new Date(now.getTime() - COVERAGE_WINDOW_DAYS * 864e5)
    const inSpan = (v: string | null, from: Date, to: Date) => {
      if (!v) return false
      const t = new Date(v).getTime()
      return !Number.isNaN(t) && t >= from.getTime() && t <= to.getTime()
    }
    const queued = store.content_renditions.rows.filter((r) => {
      if (r.platform !== ch.platform || r.format !== ch.format) return false
      if (!['scheduled', 'published', 'measured'].includes(r.status)) return false
      return inSpan(r.scheduled_for, now, horizon) || inSpan(r.published_at, back, now)
    })
    const who = `${ch.platform}/${ch.format}`

    // A NON-EMPTY LANE IS NOT NECESSARILY A COVERED ONE, and until 2026-08-16 this branch could
    // not tell the difference. `queued.length > 0` compares against 1, because 1 is the only
    // number available to a check whose question is "is this list non-empty" — so a channel the
    // calendar gives TWO slots passed green on one. Weeks 34 and 35 both ran LinkedIn with the
    // Thursday filled and the Monday empty, at half the documented cadence, and every invariant
    // here was green while it happened. The expected count now lives on the channel row
    // (`weekly_slots`), so the comparison is against what the calendar actually says.
    //
    // THE SHORTFALL IS MEASURED FORWARD ONLY, and that is deliberate. The dark check above
    // deliberately counts backwards too, because of the 2026-08-05 lesson that an alarm which does
    // not clear when you do the thing it asked for is worse than no alarm. That reasoning does not
    // transfer here: publishing a post today says nothing about whether next week's two slots are
    // filled, so crediting a trailing post against a forward cadence would hide exactly the state
    // this is for. Going dark and running under cadence are different faults and are reported as
    // different findings.
    const expected = Math.max(1, ch.weekly_slots ?? 1)
    const forward = queued.filter((r) => inSpan(r.scheduled_for, now, horizon)).length
    if (queued.length > 0) {
      if (expected > 1 && forward < expected && !paused(ch, now)) {
        findings.push({
          kind: 'violation', ref: who,
          message: `${who} is UNDER CADENCE: ${forward} slot(s) filled between now and ${horizon.toISOString().slice(0, 10)}, but the calendar gives it ${expected} a week. The lane is not dark, so every other check here passes — a channel filling one of its two slots looks exactly like a channel that is covered.`,
          fix: `fill the missing slot(s) for ${who}, or correct the expectation: content_channels.weekly_slots is the count from the table in 06_marketing/content-machine/unified-content-calendar.md, and the two are meant to move together. To stand the lane down instead, use coverage_pause_reason + coverage_paused_until.`,
        })
        continue
      }
      findings.push({
        kind: 'note', ref: who,
        message: `${queued.length} post(s) in the window (${forward} scheduled ahead; cadence ${expected}/week)`,
      })
      continue
    }

    if (paused(ch, now)) {
      findings.push({
        kind: 'note', ref: who,
        message: `nothing queued, and that is ON THE RECORD until ${ch.coverage_paused_until}: ${ch.coverage_pause_reason ?? '(no reason given)'}`,
      })
      continue
    }

    const lapsed = ch.coverage_paused_until
      ? ` Its coverage pause EXPIRED on ${ch.coverage_paused_until} and was not renewed; the recorded reason was: ${ch.coverage_pause_reason ?? '(none)'}.`
      : ''
    findings.push({
      kind: 'violation', ref: who,
      message: `${who} has NOTHING queued between now and ${horizon.toISOString().slice(0, 10)}, and no live reason on the record.${lapsed} Every other invariant can pass while this is true, because an empty channel is perfectly consistent with itself.`,
      fix: `schedule something, or record why not: set content_channels.coverage_pause_reason and coverage_paused_until for ${who}. A pause needs a date it dies on, so it cannot become permanent by being forgotten.`,
    })
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I11: the PUBLIC media bucket holds only what we can account for.

/** The bucket D3 ruled into existence. Public, and that is the whole reason this check exists. */
export const MEDIA_BUCKET = 'content'

/**
 * `<asset-slug>/<name>-<8 hex of sha256>.<ext>` — the convention publish-media.js writes.
 *
 * The slug segment is lowercase because slugs are; the NAME segment is not, because the close
 * variants are `close-A`, `close-B`, `close-C` and the variant letter is uppercase everywhere
 * else in this machine (content_renditions.variant, the approval records, the run table).
 */
export const MEDIA_PATH_RE = /^([a-z0-9][a-z0-9-]*)\/([A-Za-z0-9][A-Za-z0-9-]*)-([0-9a-f]{8})\.(png|jpg|jpeg|mp4)$/

/** What the bucket's own mime allowlist must still be. Widening it is a compliance change. */
export const MEDIA_MIME_ALLOWLIST = ['image/png', 'image/jpeg', 'video/mp4']

export interface BucketConfig { public: boolean; allowed_mime_types: string[] | null }
export interface StorageObject { path: string }
export type StorageProbe =
  | { probed: false; why: string }
  | { probed: true; bucket: BucketConfig | null; objects: StorageObject[] }

/**
 * I11 — nothing lives in the public media bucket that this repo cannot account for.
 *
 * THE BUCKET IS PUBLIC, WHICH IS THE POINT AND THE HAZARD. Metricool ingests media by fetching a
 * URL unauthenticated at schedule time, so publishable media has to be readable by anyone holding
 * the path. That same property makes anything landing in there permanent, CDN-cached and
 * crawlable. For a business heading into CQC, the rule about what may never enter it
 * (03_compliance/CONTEXT.md, "Public media bucket") needs something that enforces it.
 *
 * TWO CONTROLS ALREADY SIT BELOW THIS ONE and they are both preventative: the bucket's mime
 * allowlist refuses application/pdf with 415 for every caller including the service role, and
 * storage.objects has RLS enabled with no policy, so anon can neither write nor enumerate. This
 * invariant is the third layer and it is the only DETECTIVE one, because it is the only one that
 * can catch the case the other two are blind to: a correctly-typed, correctly-uploaded PNG that is
 * nonetheless a biomarker chart. No scanner can look at an image and see that. What it CAN see is
 * that the object belongs to nothing — and a results chart, a customer photo, a stray export are
 * all things that no content asset would ever claim.
 *
 * SO THE CHECK IS AN ALLOWLIST, NOT A BLOCKLIST. Every object must match the path convention AND
 * its first segment must be a live content_assets slug. Enumerating forbidden things would only
 * ever catch the ones somebody thought of; requiring that everything be accounted for catches the
 * ones nobody thought of, which is the category that matters.
 *
 * It also asserts the bucket's own configuration, because the two preventative controls are
 * config, and config drifts silently. A bucket quietly made non-public breaks Metricool ingestion
 * for every future run; a widened mime allowlist re-admits the document classes the rule exists to
 * exclude. Both would otherwise be invisible until something published wrong.
 */
export function inv11(store: Store, probe?: StorageProbe): Invariant {
  const id = 'I11'
  const title = 'The public media bucket holds only objects that match the convention and belong to a known asset'
  const dep = need(store, ['content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  if (!probe) {
    return {
      id, title, reads: dep.reads,
      ...classify(false, [], 'Storage was not probed, so the bucket was not measured against anything.'),
      expected: false, findings: [],
    }
  }
  if (!probe.probed) {
    return { id, title, reads: dep.reads, ...classify(false, [], probe.why), expected: false, findings: [] }
  }

  const findings: Finding[] = []
  const reads = [
    ...dep.reads,
    `storage bucket "${MEDIA_BUCKET}" (${probe.bucket ? 'exists' : 'ABSENT'}, ${probe.objects.length} objects)`,
  ]

  if (!probe.bucket) {
    findings.push({
      kind: 'violation', ref: MEDIA_BUCKET,
      message: `the "${MEDIA_BUCKET}" bucket does not exist. Every published media URL resolves out of it, so a future schedule would be emitted pointing at nothing, and Metricool ingests at schedule time — a 404 there produces a post with missing frames rather than an error.`,
      fix: 'reapply 09_website-app/database/migrations/20260814_content_media_bucket.sql',
    })
    return { id, title, reads, ...classify(true, findings), expected: false, findings }
  }

  if (!probe.bucket.public) {
    findings.push({
      kind: 'violation', ref: MEDIA_BUCKET,
      message: `the "${MEDIA_BUCKET}" bucket is NOT public. Metricool fetches these URLs unauthenticated at schedule time, so every future run would fail to ingest its media.`,
      fix: 'set the bucket public again, and find out who changed it and why before assuming it was a mistake.',
    })
  }

  const mimes = probe.bucket.allowed_mime_types
  if (!mimes || mimes.length === 0) {
    findings.push({
      kind: 'violation', ref: `${MEDIA_BUCKET}.allowed_mime_types`,
      message: 'the mime allowlist has been REMOVED, so this public bucket now accepts any file type, including application/pdf. That control is what makes a results PDF structurally unable to enter, for every caller including the service role.',
      fix: `restore allowed_mime_types to exactly ${MEDIA_MIME_ALLOWLIST.join(', ')}`,
    })
  } else {
    const widened = mimes.filter((m) => !MEDIA_MIME_ALLOWLIST.includes(m))
    if (widened.length) {
      findings.push({
        kind: 'violation', ref: `${MEDIA_BUCKET}.allowed_mime_types`,
        message: `the mime allowlist has been WIDENED to admit ${widened.join(', ')}. Widening it is a compliance change, not a config change: 03_compliance/CONTEXT.md names the document classes this bucket exists to exclude.`,
        fix: `restore allowed_mime_types to exactly ${MEDIA_MIME_ALLOWLIST.join(', ')}, or get the change ruled and update the compliance rule with it.`,
      })
    }
  }

  // An empty bucket is not a clean bucket, it is an unmeasured one — the same rule as I10's empty
  // denominator. Zero objects with 110 expected means the origin is gone, not that all is well.
  if (probe.objects.length === 0) {
    findings.push({
      kind: 'note', ref: MEDIA_BUCKET,
      message: 'the bucket is empty. Nothing to check, which is a different statement from nothing being wrong: if media was published here and is now absent, every URL in media-manifest.json is dead.',
    })
  }

  const slugs = new Set(store.content_assets.rows.map((a) => a.slug))
  for (const obj of probe.objects) {
    const m = MEDIA_PATH_RE.exec(obj.path)
    if (!m) {
      findings.push({
        kind: 'violation', ref: obj.path,
        message: `"${obj.path}" does not match the path convention <asset-slug>/<name>-<8 hex>.<png|jpg|jpeg|mp4>. Anything in this bucket is publicly readable forever, and an object that did not come from publish-media.js came from somewhere nobody has accounted for.`,
        fix: 'identify it before deleting it, then: node unpublish-media.js --prefix <path> --yes',
      })
      continue
    }
    if (!slugs.has(m[1])) {
      findings.push({
        kind: 'violation', ref: obj.path,
        message: `"${obj.path}" is in the public bucket under "${m[1]}", which is not a content_assets slug. Nothing in this repo claims it. This is the shape a results PDF, a biomarker chart or a customer photo would take: correctly typed, correctly uploaded, and owned by nothing.`,
        fix: `either register the asset, or remove it: node unpublish-media.js --prefix ${m[1]}/ --yes. If it is user-derived it should never have been here — see the takedown path in 03_compliance/CONTEXT.md.`,
      })
    }
  }

  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I12: a rendition we call "scheduled" is actually ARMED to send.

/**
 * How close a slot has to be before an unarmed post is a violation rather than a note.
 *
 * The standing rule (Keith, 2026-07-31) is that the pipeline creates DRAFTS and a human flips
 * them, so an unarmed post three weeks out is the system working, not a fault. What is a fault is
 * a slot arriving with the flip never made. 72 hours is deliberately more than one overnight run:
 * the doctor gets three chances to say so before the slot is missed, and a single missed nightly
 * run cannot swallow the only warning.
 */
export const ARM_HORIZON_HOURS = 72

/**
 * WHY THIS EXISTS. On 2026-08-16, the evening before a 30-day run began, 29 of its 30 posts
 * carried `draft: true` and would have sat in the calendar looking scheduled and never gone out.
 * Every local check agreed they were fine, because they were all reading `content_renditions.status`
 * — a column written by the job that CREATED the posts. It faithfully recorded that we had sent
 * them; it was read as meaning Metricool would send them. Those are different claims and only one
 * of them was ever measured. I3 already asks Metricool about every id; it just never asked whether
 * the post was armed. This invariant asks.
 */
export function inv12(store: Store, now: Date, probe?: MetricoolProbe): Invariant {
  const id = 'I12'
  const title = 'Every rendition we call scheduled is actually armed to send in Metricool'
  const dep = need(store, ['content_renditions', 'content_assets'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  const bySlug = new Map(store.content_assets.rows.map((a) => [a.id, a.slug]))
  const due = store.content_renditions.rows.filter(
    (r) => r.status === 'scheduled' && r.publisher === 'metricool' && r.external_post_id?.trim(),
  )
  const who = (r: RenditionRow) => `${bySlug.get(r.asset_id) ?? r.asset_id}  ${r.platform}/${r.format}${r.variant ? ` ${r.variant}` : ''}  id=${r.external_post_id}`
  const hoursOut = (r: RenditionRow) =>
    r.scheduled_for ? (new Date(r.scheduled_for).getTime() - now.getTime()) / 3_600_000 : Number.POSITIVE_INFINITY

  const findings: Finding[] = []
  const reads = [...dep.reads, `renditions at status "scheduled" with a Metricool id: ${due.length}`, `horizon: ${ARM_HORIZON_HOURS}h`]

  if (due.length === 0) {
    return {
      id, title, reads,
      ...classify(false, findings, 'no rendition is at status "scheduled" with a Metricool id, so there was nothing to check. Not a failure, and not a pass either.'),
      expected: true, findings,
    }
  }
  if (!probe || !probe.probed) {
    return {
      id, title, reads,
      ...classify(false, findings, probe?.why ?? 'Metricool was not consulted, so no post\'s arm state was read'),
      expected: probe?.credentialAbsent ?? true, findings,
    }
  }

  let armed = 0
  let manual = 0
  const unknown: string[] = []
  for (const r of due) {
    const st = probe.posts.get(r.external_post_id!.trim())
    // Existence is I3's job. Anything that did not resolve is reported there, not twice here.
    if (!st || st.state !== 'found') continue

    if (st.armed === true) {
      armed++
      // Armed, but delivered by push notification: Metricool sends a reminder to the phone and a
      // human posts it BY HAND. It does not go out on its own.
      //
      // THIS WAS A NOTE UNTIL 2026-08-18 AND THE POSTS KEPT NOT GOING OUT. The reasoning for the
      // note was that push delivery is a legitimate method, which it is; what that missed is that
      // nothing in the agreed process ever taps. Keith's standing rule is that the pipeline creates
      // drafts and a human ARMS them: arming is a deliberate act at a time of his choosing, and
      // being present at the slot minute is not part of it. So on a lane published by Metricool,
      // autoPublish=false is a misconfiguration rather than a choice, and inside the horizon it is
      // a VIOLATION. Beyond the horizon it stays a note, exactly like the draft rule above: there
      // is still time to fix it, and an alarm that fires three weeks early gets ignored.
      //
      // Metricool's own record is what makes this invisible without the check: when the reminder
      // fires it marks the provider "Published" while carrying no post id and no public URL, so
      // every store agrees the post shipped and Instagram never saw it.
      //
      // `autoPublish === null` is delivery-UNKNOWN rather than manual: a read failure, not a known
      // misconfiguration, so it stays a note at every distance and says which it is.
      if (st.autoPublish === false || st.autoPublish === null) {
        manual++
        const h0 = hoursOut(r)
        if (st.autoPublish === null) {
          findings.push({
            kind: 'note', ref: r.id,
            message: `DELIVERY UNKNOWN  ${who(r)}  publishes ${r.scheduled_for ?? 'no date'}: armed (draft=false) but autoPublish could not be read, so whether it self-publishes is unverified.`,
          })
        } else if (h0 <= ARM_HORIZON_HOURS) {
          findings.push({
            kind: 'violation', ref: r.id,
            message: `WILL NOT SELF-PUBLISH  ${who(r)}  publishes ${r.scheduled_for ?? 'no date'} (${h0 < 0 ? 'ALREADY PAST' : `in ${h0.toFixed(1)}h`}): ARMED (draft=false) but autoPublish=false, so Metricool will send a push notification and wait for a human to post it by hand. Nothing in the pipeline taps it. When the reminder fires Metricool marks its own record "Published" with no post id and no URL, so this failure leaves every store agreeing it shipped.`,
            fix: 'set autoPublish=true on the post in Metricool (it is the delivery method, NOT the arm state, and the Metricool default is true). For the carousel lane the generator is content/instagram/carousel-prototype/schedule.js. Note that any update rotates the post id, so re-map afterwards with remap-metricool-ids.ts.',
          })
        } else {
          findings.push({
            kind: 'note', ref: r.id,
            message: `NEEDS A TAP  ${who(r)}  publishes ${r.scheduled_for ?? 'no date'}: ARMED, but delivery is a push notification, so it publishes only when a human taps it. Beyond the ${ARM_HORIZON_HOURS}h horizon, so there is still time to switch it to autoPublish; it becomes a violation nearer the slot.`,
          })
        }
      }
      continue
    }

    if (st.armed === null) {
      unknown.push(`${r.external_post_id} (${bySlug.get(r.asset_id) ?? r.asset_id})`)
      findings.push({
        kind: 'note', ref: r.id,
        message: `UNREADABLE   ${who(r)}: the post resolves but draft/autoPublish could not be read as booleans (draft=${String(st.draft)}, autoPublish=${String(st.autoPublish)}). The API shape may have moved.`,
      })
      continue
    }
    const h = hoursOut(r)
    const when = r.scheduled_for ?? 'no date'
    const flags = `draft=${String(st.draft)}, autoPublish=${String(st.autoPublish)}`
    if (h <= ARM_HORIZON_HOURS) {
      findings.push({
        kind: 'violation', ref: r.id,
        message: `${who(r)} is "scheduled" in our database and publishes ${when} (${h < 0 ? 'ALREADY PAST' : `in ${h.toFixed(1)}h`}), but Metricool still has it as a DRAFT (${flags}). A draft is not in the calendar's send path at all, so it will never go out.`,
        fix: 'arm it in Metricool (the standing rule is that this pipeline creates drafts and a human arms them), or, if the slot is genuinely being skipped, move the rendition off "scheduled" so the database stops claiming it will publish',
      })
    } else {
      findings.push({
        kind: 'note', ref: r.id,
        message: `NOT YET ARMED  ${who(r)}  publishes ${when}, ${flags}. Beyond the ${ARM_HORIZON_HOURS}h horizon, so this is the standing draft rule working, not a fault. It becomes a violation if it is still unarmed nearer the slot.`,
      })
    }
  }

  reads.push(`armed: ${armed} of ${due.length}`)
  if (manual) reads.push(`of those, ${manual} deliver by push notification and need a human tap at the slot`)
  if (unknown.length) {
    // A shape change must not read as a pass. Same rule as the scanner-vocabulary gap in I2.
    return {
      id, title, reads,
      ...classify(findings.some((f) => f.kind === 'violation'), findings,
        findings.some((f) => f.kind === 'violation') ? undefined
          : `${unknown.length} post(s) resolved but their arm flags could not be read, so they are unverified rather than confirmed: ${unknown.join(', ')}`),
      expected: false, findings,
    }
  }
  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

/** Read the bucket's config and every object in it. Never throws: an outage is `probed: false`. */
export async function probeStorage(
  client: {
    storage: {
      getBucket: (id: string) => Promise<{ data: unknown; error: { message: string } | null }>
      from: (id: string) => { list: (prefix?: string, opts?: object) => Promise<{ data: unknown; error: { message: string } | null }> }
    }
  } = admin() as never,
): Promise<StorageProbe> {
  try {
    const { data: bucket, error: bErr } = await client.storage.getBucket(MEDIA_BUCKET)
    // A missing bucket is a FINDING, not a failure to measure. Only an error that leaves us not
    // knowing either way is UNCHECKED, and conflating the two is how a real fault reads as an outage.
    if (bErr && !/not found/i.test(bErr.message)) return { probed: false, why: `Storage getBucket failed: ${bErr.message}` }
    const cfg = bucket
      ? {
          public: Boolean((bucket as { public?: boolean }).public),
          allowed_mime_types: ((bucket as { allowed_mime_types?: string[] | null }).allowed_mime_types) ?? null,
        }
      : null

    const objects: StorageObject[] = []
    if (cfg) {
      const root = await client.storage.from(MEDIA_BUCKET).list('', { limit: 1000 })
      if (root.error) return { probed: false, why: `Storage list failed: ${root.error.message}` }
      // Supabase returns a directory as a row with a null id. The convention is exactly one level
      // deep, so one descent covers it; a deeper object surfaces as a convention violation above.
      for (const dir of (root.data as { name: string; id: string | null }[]).filter((r) => r.id === null)) {
        const page = await client.storage.from(MEDIA_BUCKET).list(dir.name, { limit: 1000 })
        if (page.error) return { probed: false, why: `Storage list of "${dir.name}" failed: ${page.error.message}` }
        for (const f of (page.data as { name: string; id: string | null }[])) {
          if (f.id !== null) objects.push({ path: `${dir.name}/${f.name}` })
        }
      }
    }
    return { probed: true, bucket: cfg, objects }
  } catch (e) {
    return { probed: false, why: `Storage probe failed: ${(e as Error).message}` }
  }
}

// ── I13: the claim ledger has no holes, and no pin is left on a version that moved.

/** Asset statuses at which a derivative can actually reach an audience. Below these, an unfinished
 *  asset with no classification is work in progress rather than a gap in the compliance trail. */
export const SHIPPABLE_ASSET_STATUSES = new Set(['approved', 'done'])

/**
 * I13 — plan steps 5.2 to 5.4, and specifically the parts NO GATE CAN SEE.
 *
 * The database refuses what is wrong. It cannot refuse what is missing, and every failure this
 * invariant looks for is an absence:
 *
 *  * A derivative whose canonical article is covered by a signed claim set and which carries no pin
 *    inherits from nothing. Nothing rejects it, because a null column is a legal value.
 *  * A derivative pinned and never classified records which set GOVERNS it and asserts nothing about
 *    its copy. That is 5.2 without 5.3, and a populated `claim_set_id` reads as a checked one.
 *  * A classification older than the copy it describes is evidence about words that have changed.
 *  * A pin left on a SUPERSEDED set after the derivative has moved is Q13's "re-pinned at their next
 *    edit" going unpaid. The edit happened; the re-pin did not.
 *  * An OPEN tier 2 or tier 3 on something already scheduled or live. The gate fires on arrival only
 *    — deliberately, so classification cannot freeze the bookkeeping of a live post — so classifying
 *    after a post is scheduled reaches a state nothing refuses. That is the one this invariant most
 *    exists for: uncleared copy, live, with the ledger's own record saying so and no alarm attached.
 *
 * NOT A FAILURE, and stated as a note instead: a superseded pin on a derivative that has NOT moved.
 * Ruled 2026-08-18 (Q13): those keep running and nothing comes down automatically. Reporting the
 * population as a violation would make the ledger a takedown list, which is the option Ewa was
 * offered explicitly and declined.
 */
export function inv13(store: Store, now: Date): Invariant {
  const id = 'I13'
  const title = 'The claim ledger has no holes, and no pin is left on a set that has moved on'
  const dep = need(store, ['content_assets', 'content_renditions', 'content_topic_articles', 'content_claim_sets'])
  if (!dep.ok) {
    // No topic and no claim set is the state before 5.1 has anything in it, which is a genuine
    // absence of subject rather than a fault. Anything else here is a read failure.
    const empty = store.content_topic_articles.count === 0 || store.content_claim_sets.count === 0
    return {
      id, title, reads: dep.reads, ...classify(false, [], dep.reason),
      expected: empty && !store.content_topic_articles.error && !store.content_claim_sets.error,
      findings: [],
    }
  }
  if (store.content_asset_claims.error) {
    return {
      id, title, reads: [...dep.reads, `content_asset_claims (UNREAD: ${store.content_asset_claims.error})`],
      ...classify(false, [], `content_asset_claims was not read: ${store.content_asset_claims.error}. The tier ladder could not be measured, and an unread table is not an empty one.`),
      expected: false, findings: [],
    }
  }

  const sets = new Map(store.content_claim_sets.rows.map((s) => [s.id, s]))
  const signedTopics = new Set(store.content_claim_sets.rows.filter((s) => s.status === 'signed').map((s) => s.topic_id))
  const topicOfArticle = new Map(store.content_topic_articles.rows.map((t) => [t.article_id, t.topic_id]))
  const assetById = new Map(store.content_assets.rows.map((a) => [a.id, a]))

  const rendsByAsset = new Map<string, RenditionRow[]>()
  for (const r of store.content_renditions.rows) {
    const list = rendsByAsset.get(r.asset_id) ?? []
    list.push(r)
    rendsByAsset.set(r.asset_id, list)
  }
  /** The last time anything about a derivative's shipping copy moved. */
  const lastMoved = (assetId: string): number => {
    const ts = (rendsByAsset.get(assetId) ?? []).flatMap((r) => [r.updated_at, r.published_at])
      .filter(Boolean).map((d) => Date.parse(d as string)).filter((n) => Number.isFinite(n))
    return ts.length ? Math.max(...ts) : 0
  }
  const isLive = (assetId: string) => (rendsByAsset.get(assetId) ?? [])
    .some((r) => r.status === 'scheduled' || r.status === 'published' || r.status === 'measured')

  const openByAsset = new Map<string, AssetClaimRow[]>()
  for (const c of store.content_asset_claims.rows) {
    if (c.resolution !== null || (c.tier !== 2 && c.tier !== 3)) continue
    const list = openByAsset.get(c.asset_id) ?? []
    list.push(c)
    openByAsset.set(c.asset_id, list)
  }

  const covered = store.content_assets.rows.filter(
    (a) => a.canonical_article_id && signedTopics.has(topicOfArticle.get(a.canonical_article_id) ?? ''))
  const pinned = store.content_assets.rows.filter((a) => a.claim_set_id)

  const reads = [
    ...dep.reads,
    `content_asset_claims (${store.content_asset_claims.count} rows)`,
    `derivatives covered by a signed set: ${covered.length}`,
    `pinned: ${pinned.length}`,
  ]
  const findings: Finding[] = []

  // 1. Covered by a signed set, inheriting from nothing.
  for (const a of covered.filter((x) => !x.claim_set_id)) {
    findings.push({
      kind: 'violation', ref: a.slug,
      message: `its canonical article is covered by a topic with a SIGNED claim set, and it carries no pin. It inherits from nothing, and nothing refuses that: a null claim_set_id is a legal value, so this hole is invisible to every gate.`,
      fix: 'pin it to the topic\'s signed set (plan step 5.2), then classify it (5.3).',
    })
  }

  // 2. Pinned, shippable, never classified.
  for (const a of pinned.filter((x) => !x.claims_classified_at)) {
    const shippable = SHIPPABLE_ASSET_STATUSES.has(a.status)
    findings.push({
      kind: shippable ? 'violation' : 'note', ref: a.slug,
      message: shippable
        ? 'pinned to a claim set and NEVER classified against it. The pin records which set governs this derivative and asserts nothing about its copy, which is step 5.2 without step 5.3; a populated claim_set_id reads as a checked one.'
        : `pinned and not yet classified, at status "${a.status}". Not a violation while it cannot ship, but it must be classified before it is approved.`,
      fix: shippable ? 'npx tsx scripts/content-engine/classify-claims.ts --slug ' + a.slug + ' --apply' : undefined,
    })
  }

  // 3. Classified before the copy last moved.
  for (const a of pinned.filter((x) => x.claims_classified_at)) {
    const classifiedAt = Date.parse(a.claims_classified_at!)
    const moved = lastMoved(a.id)
    if (!Number.isFinite(classifiedAt) || !moved || moved <= classifiedAt) continue
    findings.push({
      kind: 'violation', ref: a.slug,
      message: `its classification is dated ${a.claims_classified_at} and its copy last moved ${new Date(moved).toISOString()}. The verdicts on this asset are evidence about words that have since changed.`,
      fix: `re-run classify-claims for ${a.slug}. Verdicts a human resolved are kept; only the classifier's own are rewritten.`,
    })
  }

  // 4. Pinned to a superseded set. A violation ONLY where the derivative has moved since.
  for (const a of pinned) {
    const set = sets.get(a.claim_set_id!)
    if (!set || set.status !== 'superseded') continue
    const supersededAt = set.superseded_at ? Date.parse(set.superseded_at) : NaN
    if (!Number.isFinite(supersededAt)) {
      findings.push({
        kind: 'violation', ref: a.slug,
        message: `pinned to a superseded claim set (v${set.version}) that carries no superseded_at. Q13's rule is about time, so a supersede with no date cannot be checked against anything.`,
        fix: 'set content_claim_sets.superseded_at. The trigger stamps it; a null here means the row predates that trigger.',
      })
      continue
    }
    const moved = lastMoved(a.id)
    if (moved > supersededAt) {
      findings.push({
        kind: 'violation', ref: a.slug,
        message: `pinned to superseded claim set v${set.version} and its copy moved ${new Date(moved).toISOString()}, after the supersede at ${set.superseded_at}. Ruled 2026-08-18 (Q13): a live derivative keeps running and is re-pinned AT ITS NEXT EDIT. That edit has happened and the pin did not move.`,
        fix: 'classify it against the current signed set and re-pin it.',
      })
    } else {
      findings.push({
        kind: 'note', ref: a.slug,
        message: `pinned to superseded claim set v${set.version} and untouched since. Correct, and deliberately not a violation: Q13 says live derivatives keep running and nothing comes down automatically. It is re-pinned at its next edit.`,
      })
    }
  }

  // 5. An open tier 2 or tier 3 on copy that is already out. THE GATE CANNOT SEE THIS ONE.
  for (const [assetId, open] of openByAsset) {
    if (!isLive(assetId)) continue
    const a = assetById.get(assetId)
    const t3 = open.filter((c) => c.tier === 3).length
    findings.push({
      kind: 'violation', ref: a?.slug ?? assetId,
      message: `carries ${open.length} unresolved claim(s) above tier 1${t3 ? ` (${t3} of them tier 3, net-new)` : ''} and is already scheduled or published. The publish gate fires on ARRIVAL only, deliberately, so classifying after a post is scheduled reaches a state nothing refuses. This is live copy with an uncleared claim against it.`,
      fix: t3
        ? 'a tier 3 goes back to the ARTICLE for clearance. Until it is cleared, this is Keith\'s call on whether the live post stands, is edited, or comes down: nothing here removes it automatically.'
        : 'route the tier 2 items to Ewa itemised, then record the clearance on each row.',
    })
  }

  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

// ── I14: the media a LIVE rendition needs, read from its channel (plan step 6.3).

/** Statuses at which a rendition is claiming to be out in the world or on its way. */
export const LIVE_RENDITION_STATUSES = new Set(['scheduled', 'published', 'measured'])

/**
 * I14 — every rendition at scheduled-or-later has the media its channel requires.
 *
 * THIS IS THE HALF OF STEP 6.3 THE GATE CANNOT DO, and it exists because the gate deliberately
 * gave it up. `gate_rendition_publish()` checks media on an UPDATE into scheduled, never on an
 * INSERT, because media links are keyed to a rendition id and cannot exist before the row does: a
 * gate demanding them at INSERT would ban the insert path, and the insert path is how
 * `register-carousel-run.ts` RECORDS a run that is already live in Metricool. Refusing to write
 * down what is already true is worse than writing it down with the media rows still to come.
 *
 * So the gate refuses the transition and this invariant reports the state. A rendition inserted
 * straight to `scheduled` with no media is invisible to the gate by construction and visible here,
 * because an invariant tests what IS rather than what is arriving. Same split as I13 and the claim
 * ladder.
 *
 * IT READS THE REQUIREMENT FROM THE CHANNEL, never from the rendition. That is the whole of 6.3:
 * `content_renditions.thumb_spec` was the rendition's own copy of a channel fact, it could only ever
 * express "a cover is owed", and it had nothing to say about a carousel that needs eight images.
 */
export function inv14(store: Store): Invariant {
  const id = 'I14'
  const title = 'Every rendition at scheduled-or-later has the media its channel requires'
  const dep = need(store, ['content_renditions', 'content_channels'])
  if (!dep.ok) return { id, title, reads: dep.reads, ...classify(false, [], dep.reason), expected: false, findings: [] }

  if (store.content_rendition_media.error) {
    return {
      id, title, reads: [...dep.reads, `content_rendition_media (UNREAD: ${store.content_rendition_media.error})`],
      ...classify(false, [], `content_rendition_media was not read: ${store.content_rendition_media.error}. Nothing below would be a measurement, and an unread link table would make every rendition look medialess.`),
      expected: false, findings: [],
    }
  }

  const chan = new Map(store.content_channels.rows.map((c) => [`${c.platform}/${c.format}`, c]))
  const bySlug = new Map(store.content_assets.rows.map((a) => [a.id, a.slug]))
  const body = new Map<string, number>()
  const thumb = new Map<string, number>()
  for (const m of store.content_rendition_media.rows) {
    const bucket = m.role === 'thumb' ? thumb : body
    bucket.set(m.rendition_id, (bucket.get(m.rendition_id) ?? 0) + 1)
  }

  const live = store.content_renditions.rows.filter((r) => LIVE_RENDITION_STATUSES.has(r.status))
  const needMedia = live.filter((r) => {
    const c = chan.get(`${r.platform}/${r.format}`)
    return c ? (c.media_kind !== 'none' && c.media_min > 0) || c.thumb_spec !== 'none' : false
  })
  const reads = [
    ...dep.reads,
    `content_rendition_media (${store.content_rendition_media.count} rows)`,
    `renditions at scheduled-or-later: ${live.length}, of those on a channel that requires media: ${needMedia.length}`,
  ]

  const findings: Finding[] = []
  const who = (r: RenditionRow) =>
    `${bySlug.get(r.asset_id) ?? r.asset_id}  ${r.platform}/${r.format}${r.variant ? ` ${r.variant}` : ''}`

  for (const r of live) {
    const c = chan.get(`${r.platform}/${r.format}`)
    // Unregistered channel: since 6.3 a foreign key makes this unrepresentable, so its appearance
    // would mean the key was dropped rather than that a row slipped through.
    if (!c) {
      findings.push({
        kind: 'violation', ref: r.id,
        message: `${who(r)} is "${r.status}" on a platform/format with no content_channels row, so there is no spec to check its media against. Since plan step 6.3 a foreign key should make this impossible.`,
        fix: 'register the channel, or check whether content_renditions_channel_fk still exists.',
      })
      continue
    }
    const nBody = body.get(r.id) ?? 0
    const nThumb = thumb.get(r.id) ?? 0

    if (c.media_kind !== 'none' && c.media_min > 0 && nBody < c.media_min) {
      findings.push({
        kind: 'violation', ref: r.id,
        message: `${who(r)} is "${r.status}" carrying ${nBody} of the ${c.media_min} ${c.media_kind} file(s) its channel requires. The publish gate cannot have refused this: it checks media on an UPDATE into scheduled, and a row inserted straight there is exactly the case it gives up.`,
        fix: 'link the media in content_rendition_media, or move the rendition back off scheduled if it did not ship.',
      })
    }
    if (c.media_max !== null && nBody > c.media_max) {
      findings.push({
        kind: 'violation', ref: r.id,
        message: `${who(r)} carries ${nBody} ${c.media_kind} file(s) and its channel accepts at most ${c.media_max}.`,
        fix: 'unlink the surplus, or widen content_channels.media_max if the platform really allows it.',
      })
    }
    if (c.thumb_spec !== 'none' && nThumb === 0) {
      findings.push({
        kind: 'violation', ref: r.id,
        message: `${who(r)} is "${r.status}" and its channel requires a ${c.thumb_spec} thumbnail, of which none is linked.`,
        fix: 'link the thumbnail in content_rendition_media with role=thumb.',
      })
    }
  }

  // Not a violation: production work that has not reached a live status yet. Reported so the number
  // is visible before it becomes a blocker on the day the filming happens.
  const owedAhead = store.content_renditions.rows.filter((r) => {
    if (LIVE_RENDITION_STATUSES.has(r.status)) return false
    const c = chan.get(`${r.platform}/${r.format}`)
    if (!c) return false
    return (c.media_kind !== 'none' && c.media_min > 0 && (body.get(r.id) ?? 0) < c.media_min)
      || (c.thumb_spec !== 'none' && (thumb.get(r.id) ?? 0) === 0)
  })
  if (owedAhead.length) {
    findings.push({
      kind: 'note', ref: 'not yet live',
      message: `${owedAhead.length} rendition(s) below scheduled still owe the media their channel requires. Not a fault: they are production work, and the gate will refuse them at the moment they try to move.`,
    })
  }

  return { id, title, reads, ...classify(true, findings), expected: false, findings }
}

export function runInvariants(
  store: Store, ctx: RepoCtx, now: Date,
  rulings: EwaRulings = new Map(),
  probe?: MetricoolProbe,
  storage?: StorageProbe,
): Invariant[] {
  return [
    inv1(store, ctx), inv2(store, ctx), inv3(store, probe), inv4(store, now),
    inv5(store, rulings), inv6(store), inv7(store, ctx), inv8(store), inv9(ctx),
    inv10(store, now), inv11(store, storage), inv12(store, now, probe),
    inv13(store, now), inv14(store),
  ]
}

/**
 * The Metricool ids I3 would have to resolve. Empty means no network call is owed.
 * I12 reads arm flags off the SAME probe rather than fetching again: its set (scheduled posts) is
 * a subset of this one, so adding the invariant cost zero extra round trips.
 */
export function metricoolIds(store: Store): string[] {
  return [...new Set(store.content_renditions.rows
    .filter((r) => r.publisher === 'metricool' && r.external_post_id?.trim())
    .map((r) => r.external_post_id!.trim()))]
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
  const [content_assets, content_renditions, content_channels, blog_articles,
    content_topic_articles, content_claim_sets, content_asset_claims,
    content_rendition_media] = await Promise.all([
    loadTable<AssetRow>('content_assets',
      'id,slug,status,content_type,funnel_stage,awareness,cta,preflight,ewa_task,canonical_article_id,claim_set_id,claims_classified_at'),
    loadTable<RenditionRow>('content_renditions',
      'id,asset_id,platform,format,thumb_spec,status,scheduled_for,published_at,external_post_id,external_url,publisher,variant,updated_at'),
    loadTable<ChannelRow>('content_channels', 'platform,format,in_plan,lane,coverage_paused_until,coverage_pause_reason,weekly_slots,media_kind,media_min,media_max,thumb_spec'),
    loadTable<ArticleRow>('blog_articles', 'id,slug,status,body'),
    loadTable<TopicArticleRow>('content_topic_articles', 'topic_id,article_id'),
    loadTable<ClaimSetRow>('content_claim_sets', 'id,topic_id,version,status,superseded_at'),
    loadTable<AssetClaimRow>('content_asset_claims', 'asset_id,claim_id,tier,resolution'),
    loadTable<RenditionMediaRow>('content_rendition_media', 'rendition_id,media_id,role'),
  ])
  return {
    content_assets, content_renditions, content_channels, blog_articles,
    content_topic_articles, content_claim_sets, content_asset_claims, content_rendition_media,
  }
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
  // The key list is read at load and deliberately does not throw there, so this is the first
  // place its failure can be reported as what it is: a layout problem, not a crash.
  if (DB_OWNED_KEYS_ERROR) problems.push(DB_OWNED_KEYS_ERROR)
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

  // Same rule as the ClickUp call above: only reach for Metricool when there is an id to
  // resolve, so I3 never goes UNCHECKED for a network call it never needed.
  const ids = metricoolIds(store)
  const creds = metricoolCreds()
  let probe: MetricoolProbe | undefined
  if (ids.length) {
    probe = creds.ok
      ? { probed: true, posts: await probeMetricool(ids, metricoolFetcher(creds)) }
      : {
          probed: false, credentialAbsent: true,
          why: `no Metricool credential is loaded: ${creds.missing.join(', ')} ${creds.missing.length === 1 ? 'is' : 'are'} not set. ${ids.length} id(s) are listed above as UNRESOLVED.`,
        }
  }

  // Unconditional, unlike the ClickUp and Metricool calls above: those are skipped when there is
  // no id to resolve, but "the bucket is empty" and "the bucket is gone" are exactly the states
  // this check exists to tell apart, so it must never be skipped for having nothing to look at.
  const storage = await probeStorage()

  const invariants = runInvariants(store, ctx, now, rulings, probe, storage)
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
