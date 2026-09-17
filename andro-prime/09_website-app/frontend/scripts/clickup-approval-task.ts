#!/usr/bin/env tsx
/**
 * Create or update a CA-NNN task on the Approvals & Sign-offs board, from the repo.
 *
 *   npx tsx scripts/clickup-approval-task.ts --ca CA-050 \
 *     --name "Membership renewal copy, the CA-026 C1 re-record" \
 *     --owes "Keith: sign it or send it back" \
 *     --body ../../03_compliance/content-approval/ca-050-task.md \
 *     [--status pending] [--dry-run]
 *
 * ── 🔴 WHY THIS EXISTS, AND IT IS A PROCESS DEFECT RATHER THAN A MISSING FEATURE ──
 * `03_compliance/CONTEXT.md`, the `content-approval/README.md` and the
 * `/compliance-preflight` skill all say the same thing three times: **ClickUp is the
 * hub, the repo is the mirror, log the approval on the board FIRST.** On 2026-09-17
 * CA-050 was written into the register and its approval record with no board task at
 * all, and Keith found out by looking at the board and not finding it.
 *
 * The cause was not forgetfulness. The repo-wired `clickup` MCP server is a licensed
 * wrapper and **every one of its tools refuses without a licence key, reads included**,
 * so the hub was genuinely unreachable through the route the convention assumes. What
 * nobody noticed is that `CLICKUP_API_TOKEN` is in `.env.local` and
 * `scripts/content-engine/clickup.ts` has spoken to the API directly all along. **The
 * account was never locked; one client was.** A convention whose only implementation is
 * a third-party wrapper degrades to "skip it and write the repo" the moment that wrapper
 * fails, and the skip is invisible from the repo side, which is the side you are on.
 *
 * So the board write gets a path that belongs to this repo. Same lesson as
 * `verify-subscription-claims.js`: a rule with no executable form is a promise.
 *
 * ── IT READS BEFORE IT WRITES, AND THAT IS THE POINT ──────────────────────────
 * Hub-first is not only about write order. Every "is this signed off" question is
 * answered from the board, so this refuses to create a second task for a CA that already
 * has one, and with `--dry-run` it does nothing but tell you what the board currently
 * says. Run it that way before asserting anything about approval state.
 *
 * ⚠ **IT NEVER WRITES `approved`.** `content-approval/README.md` hard rule 2: only a
 * named human approves, and on the Keith-only board the drag IS the signature. This
 * creates at `pending` and will refuse an `approved` status outright.
 */
import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createTaskInList, updateTaskContent, APPROVALS_LIST_ID } from './content-engine/clickup'

/**
 * 🔴 THIS LISTS THE WHOLE BOARD, AND IT DOES NOT USE `getListTasks`.
 *
 * `getListTasks` requests `?archived=false&subtasks=false` and passes no
 * `include_closed`, so ClickUp's default drops every CLOSED task. That is right for
 * the content-engine's sign-off poll, which only cares what is still open, and it is
 * wrong for every question this script asks.
 *
 * It produced a false finding on 2026-09-17, an hour after this file was written: the
 * board listed 16 tasks against 50 register rows, which was reported as 41 approved
 * CAs missing from the hub. **The real count was 49 of 50 present.** The 33 that
 * looked absent were closed, because they were approved. An `archived=true` check came
 * back empty and was read as confirming the gap, when it had only ruled out one of the
 * three exclusions in the query.
 *
 * So the rule, and it is the reason this helper exists rather than a flag: **a listing
 * used to decide whether something EXISTS must name every exclusion in its query.** A
 * filter you did not write is still a filter you applied, and its absence is
 * indistinguishable from the thing genuinely not being there.
 */
async function listAllCaTasks(): Promise<Array<{ id: string; name: string; statusName: string }>> {
  const token = process.env.CLICKUP_API_TOKEN
  if (!token) throw new Error('Missing required env: CLICKUP_API_TOKEN')
  const out: Array<{ id: string; name: string; statusName: string }> = []
  for (const archived of [false, true]) {
    for (let page = 0; page < 50; page++) {
      const res = await fetch(
        `https://api.clickup.com/api/v2/list/${APPROVALS_LIST_ID}/task`
        + `?include_closed=true&subtasks=true&archived=${archived}&page=${page}`,
        { headers: { Authorization: token } },
      )
      if (!res.ok) throw new Error(`ClickUp listing -> ${res.status}`)
      const body = (await res.json()) as { tasks?: Array<Record<string, unknown>>; last_page?: boolean }
      const tasks = body.tasks ?? []
      if (!tasks.length) break
      for (const t of tasks) {
        const st = (t.status as { status?: string } | undefined)?.status ?? ''
        out.push({ id: String(t.id), name: String(t.name ?? ''), statusName: st.toLowerCase() })
      }
      if (body.last_page === true) break
    }
  }
  return out
}

/* `next build` loads `.env.local`; a bare tsx script does not, and dotenv does not
   override anything already in the environment, so this matches Next's precedence. */
loadEnv({ path: resolve(process.cwd(), '.env.local') })

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag)
  return i === -1 ? undefined : process.argv[i + 1]
}
const has = (flag: string) => process.argv.includes(flag)

async function main() {
  const ca = arg('--ca')
  const dryRun = has('--dry-run')

  /* `--list` answers the question the convention actually asks: what does the HUB say?
     Run it before reporting any CA as outstanding, and before trusting the register.
     Closed and archived included, because an approved CA is a CLOSED task and a listing
     that drops it reports a signed approval as missing. */
  if (has('--list')) {
    const all = await listAllCaTasks()
    console.log(
      `Approvals & Sign-offs (${APPROVALS_LIST_ID}): ${all.length} task(s) `
      + `(open, closed and archived — every exclusion named).\n`,
    )
    for (const t of all) console.log(`  ${t.id}  [${t.statusName}]  ${t.name}`)
    console.log('\nFor register-vs-board drift: node .claude/skills/wrap/reconcile-approvals.js')
    return
  }

  if (!ca || !/^CA-\d{3}$/.test(ca)) {
    console.error('usage: --ca CA-NNN --name "<artefact>" --owes "<who>: <the one action>" --body <file> [--status pending] [--dry-run]')
    process.exit(1)
  }

  const status = arg('--status') ?? 'pending'
  if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'complete') {
    console.error(
      `REFUSED: this script will not set "${status}".\n` +
      '  Only a named human approves (content-approval/README.md, hard rule 2).\n' +
      '  Recording the decision and performing the click are two different acts.',
    )
    process.exit(2)
  }

  /* ── READ FIRST, AND READ ALL OF IT ─────────────────────────────────────────
     The duplicate check has to see closed tasks or it is worthless: an APPROVED CA
     is a closed task, so a listing that drops closed would report "not on the board"
     for exactly the CAs most likely to already be there, and cheerfully create a
     second one. See the header on `listAllCaTasks`. */
  const tasks = await listAllCaTasks()
  /* A task belongs to the FIRST CA its name carries, never to every CA it mentions.
     `includes(ca)` matched CA-050's own task when asked about CA-026, because that
     task's body line names the CA it re-records — which would have read as a duplicate
     and refused the write. Same rule as `reconcile-approvals.js`, deliberately, so the
     writer and the detector never disagree about which task belongs to which CA. */
  const owningCa = (name: string) => (/CA-\d{3}/.exec(name) ?? [''])[0]
  const existing = tasks.filter((t) => owningCa(t.name) === ca)

  console.log(`Approvals & Sign-offs (${APPROVALS_LIST_ID}): ${tasks.length} task(s) on the board.`)
  if (existing.length) {
    console.log(`\n${ca} is ALREADY on the board:`)
    for (const t of existing) console.log(`  ${t.id}  [${t.statusName}]  ${t.name}`)
  } else {
    console.log(`\n${ca} is NOT on the board.`)
  }

  if (dryRun) {
    console.log('\n--dry-run: nothing written.')
    return
  }

  const bodyFile = arg('--body')
  if (!bodyFile) {
    console.error('\n--body <file> is required to create or update a task.')
    process.exit(1)
  }
  const markdown = readFileSync(resolve(process.cwd(), bodyFile), 'utf8')

  if (existing.length > 1) {
    console.error(`\nREFUSED: ${existing.length} tasks already carry ${ca}. Resolve the duplicate by hand.`)
    process.exit(2)
  }

  if (existing.length === 1) {
    await updateTaskContent({ taskId: existing[0].id, markdown })
    console.log(`\nUPDATED ${existing[0].id} (status left at "${existing[0].statusName}", untouched).`)
    console.log(`  https://app.clickup.com/t/${existing[0].id}`)
    return
  }

  const name = arg('--name')
  const owes = arg('--owes')
  if (!name || !owes) {
    console.error('\n--name and --owes are required to create a task.')
    console.error('  --owes names WHO owes the next action and WHAT it is, in second person.')
    console.error('  A board item nobody is addressed by is how an owed action goes unseen (CA-049, 2026-09-16).')
    process.exit(1)
  }

  const created = await createTaskInList({
    listId: APPROVALS_LIST_ID,
    name: `${ca} · ${name} · ${owes}`,
    markdown,
    status,
  })
  console.log(`\nCREATED ${created.id} at status "${created.statusName}".`)
  console.log(`  https://app.clickup.com/t/${created.id}`)
  console.log('\nNow mirror it into content-approval-register.md, and never the other way round.')
}

main().catch((err) => {
  console.error(String(err instanceof Error ? err.message : err))
  process.exit(1)
})
