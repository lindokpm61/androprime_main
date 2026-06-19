/**
 * Weekly digest — Phase 3b observability. Turns the agent_runs dead-letter table +
 * content_pipeline state into a human summary that LEADS with failures, so nothing
 * the autonomous engine did (or got stuck on) stays silent.
 *
 * Reads the last 7 days of agent_runs (counts + the actual error/blocked rows), the
 * current pipeline stage distribution, what's parked on each human gate (keith/ewa),
 * and what published this week. Writes markdown to stdout and, when running in GitHub
 * Actions, appends it to the job summary ($GITHUB_STEP_SUMMARY).
 *
 * Read-only. Run from frontend/:
 *   npx tsx scripts/content-engine/digest.ts
 *   npx tsx scripts/content-engine/digest.ts --days 14
 */
import fs from 'fs'
import { loadEnvLocal, admin } from './_shared'

loadEnvLocal()

const daysArgIdx = process.argv.indexOf('--days')
const DAYS = daysArgIdx >= 0 ? Math.max(1, parseInt(process.argv[daysArgIdx + 1], 10) || 7) : 7
const LIST_CAP = 25 // cap long lists; we log the overflow rather than truncate silently

const dayMs = 24 * 60 * 60 * 1000
const now = new Date()
const since = new Date(now.getTime() - DAYS * dayMs)
const sinceISO = since.toISOString()
const fmtDay = (d: Date | string) => new Date(d).toISOString().slice(0, 10)
const fmtMin = (d: Date | string) => new Date(d).toISOString().slice(0, 16).replace('T', ' ')

function tally<T extends string>(rows: Array<{ k: T }>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of rows) out[r.k] = (out[r.k] ?? 0) + 1
  return out
}

/** Render up to LIST_CAP lines, then a note for the remainder (never a silent cut). */
function capped(lines: string[]): string[] {
  if (lines.length <= LIST_CAP) return lines
  return [...lines.slice(0, LIST_CAP), `_…and ${lines.length - LIST_CAP} more (raise --days or query agent_runs)._`]
}

async function buildDigest(): Promise<string> {
  // --- agent_runs in window ---
  const { data: runs, error: runsErr } = await admin()
    .from('agent_runs')
    .select('agent, status, item_ref, error, created_at')
    .gte('created_at', sinceISO)
    .order('created_at', { ascending: false })
  if (runsErr) throw new Error(`read agent_runs: ${runsErr.message}`)
  const all = runs ?? []

  const byStatus = tally(all.map((r) => ({ k: r.status as string })))
  const byAgent = tally(all.map((r) => ({ k: r.agent })))
  const errors = all.filter((r) => r.status === 'error')
  const blocked = all.filter((r) => r.status === 'blocked')

  // --- pipeline state (current snapshot) ---
  const { data: pipe, error: pipeErr } = await admin()
    .from('content_pipeline')
    .select('slug, stage, blocked_on')
  if (pipeErr) throw new Error(`read content_pipeline: ${pipeErr.message}`)
  const stageCounts = tally((pipe ?? []).map((r) => ({ k: r.stage })))
  const onEwa = (pipe ?? []).filter((r) => r.blocked_on === 'ewa')
  const onKeith = (pipe ?? []).filter((r) => r.blocked_on === 'keith')

  // --- published this window ---
  const { data: pub, error: pubErr } = await admin()
    .from('blog_articles')
    .select('slug, published_at')
    .eq('status', 'published')
    .gte('published_at', sinceISO)
    .order('published_at', { ascending: false })
  if (pubErr) throw new Error(`read blog_articles: ${pubErr.message}`)

  // --- assemble ---
  const L: string[] = []
  L.push(`# Content Engine — weekly digest`)
  L.push(`_${fmtDay(since)} → ${fmtDay(now)} (${DAYS}d)_`)
  L.push('')

  const nErr = errors.length
  const nBlk = blocked.length
  L.push(nErr || nBlk ? `## ⚠️ ${nErr} run(s) errored, ${nBlk} blocked` : `## ✅ No errors or blocks`)
  L.push('')

  L.push(`## Runs (${all.length} total)`)
  L.push(
    `- status: ${Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join('  ') || 'none'}`
  )
  L.push(`- by agent: ${Object.entries(byAgent).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`)
  L.push('')

  if (nErr) {
    L.push('### ❌ Errors')
    L.push(...capped(errors.map((e) => `- \`${e.agent}\` / ${e.item_ref ?? '—'} — ${e.error ?? 'no message'}  _(${fmtMin(e.created_at)})_`)))
    L.push('')
  }
  if (nBlk) {
    L.push('### ⛔ Blocked')
    L.push(...capped(blocked.map((b) => `- \`${b.agent}\` / ${b.item_ref ?? '—'} — ${b.error ?? 'no message'}  _(${fmtMin(b.created_at)})_`)))
    L.push('')
  }

  L.push('## Pipeline')
  L.push(`- stages: ${Object.entries(stageCounts).map(([k, v]) => `${k} ${v}`).join(', ') || 'empty'}`)
  if (onEwa.length || onKeith.length) {
    L.push('- parked on a gate:')
    if (onEwa.length) L.push(`  - **Ewa** (${onEwa.length}): ${onEwa.map((r) => r.slug).join(', ')}`)
    if (onKeith.length) L.push(`  - **Keith** (${onKeith.length}): ${onKeith.map((r) => r.slug).join(', ')}`)
  } else {
    L.push('- nothing parked on a human gate.')
  }
  L.push('')

  L.push(`## Published this window (${(pub ?? []).length})`)
  if ((pub ?? []).length) {
    L.push(...capped((pub ?? []).map((p) => `- ${p.slug} _(${p.published_at ? fmtDay(p.published_at) : '—'})_`)))
  } else {
    L.push('- none.')
  }

  return L.join('\n')
}

async function main() {
  const md = await buildDigest()
  console.log(md)
  const summaryPath = process.env.GITHUB_STEP_SUMMARY
  if (summaryPath) {
    try {
      fs.appendFileSync(summaryPath, md + '\n')
    } catch (e) {
      console.error('could not write GITHUB_STEP_SUMMARY:', (e as Error).message)
    }
  }
}

export { buildDigest }

if (process.argv[1]?.endsWith('digest.ts')) {
  main().catch((e) => {
    console.error('DIGEST ERROR:', (e as Error).message)
    process.exit(1)
  })
}
