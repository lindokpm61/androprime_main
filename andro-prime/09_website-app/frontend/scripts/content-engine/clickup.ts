/**
 * ClickUp helper for the content-engine sign-off gate (PULL model). The orchestrator
 * creates a review task on submit, then reads task status + due date each tick:
 *   - status "complete"  => Ewa approved  => Publisher may ship
 *   - anything else      => still pending (a comment = needs changes)
 * No Edge Function / webhook / Automation — the orchestrator polls via this API.
 */
import { requireEnv } from './_shared'

const API = 'https://api.clickup.com/api/v2'
export const CONTENT_REVIEW_LIST_ID = '901218140081' // "Content Review — Ewa"

function authHeaders(): Record<string, string> {
  return { Authorization: requireEnv('CLICKUP_API_TOKEN'), 'Content-Type': 'application/json' }
}

async function cu(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, { ...init, headers: { ...authHeaders(), ...(init?.headers ?? {}) } })
  const text = await res.text()
  let body: unknown
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }
  if (!res.ok) {
    throw new Error(`ClickUp ${init?.method ?? 'GET'} ${path} -> ${res.status}: ${text.slice(0, 300)}`)
  }
  return body as Record<string, unknown>
}

export interface ChecklistItem {
  id: string
  name: string
  resolved: boolean
}

export interface Checklist {
  id: string
  name: string
  items: ChecklistItem[]
}

export interface ReviewTask {
  id: string
  url: string
  statusName: string // lowercased ClickUp status (e.g. 'to do', 'in progress', 'complete')
  dueDate: string | null // YYYY-MM-DD (UK), or null
  /** Real ClickUp checklists on the task. Machine-readable, unlike checkboxes typed
   * into the description, which is why named ruling requests live here (see
   * RULINGS_CHECKLIST). Empty for tasks created before rulings existed. */
  checklists: Checklist[]
}

function toChecklists(t: Record<string, unknown>): Checklist[] {
  const raw = (t.checklists as Array<Record<string, unknown>> | undefined) ?? []
  return raw.map((c) => ({
    id: String(c.id),
    name: String(c.name ?? ''),
    items: ((c.items as Array<Record<string, unknown>> | undefined) ?? []).map((i) => ({
      id: String(i.id),
      name: String(i.name ?? ''),
      // ClickUp exposes item completion as `resolved` (boolean).
      resolved: i.resolved === true,
    })),
  }))
}

function toReviewTask(t: Record<string, unknown>): ReviewTask {
  const status = (t.status as { status?: string } | undefined)?.status ?? ''
  const dueMs = t.due_date ? Number(t.due_date) : NaN
  const dueDate = Number.isFinite(dueMs) ? new Date(dueMs).toISOString().slice(0, 10) : null
  return {
    id: String(t.id),
    url: String(t.url ?? ''),
    statusName: status.toLowerCase(),
    dueDate,
    checklists: toChecklists(t),
  }
}

/** Create a review task on the Content Review list. dueDateMs = scheduled publish slot (epoch ms). */
export async function createReviewTask(args: {
  name: string
  markdown: string
  dueDateMs?: number | null
  listId?: string
}): Promise<ReviewTask> {
  const body: Record<string, unknown> = {
    name: args.name,
    markdown_content: args.markdown,
  }
  if (args.dueDateMs) {
    body.due_date = args.dueDateMs
    body.due_date_time = false
  }
  const t = await cu(`/list/${args.listId ?? CONTENT_REVIEW_LIST_ID}/task`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return toReviewTask(t)
}

export async function getTask(taskId: string): Promise<ReviewTask> {
  return toReviewTask(await cu(`/task/${taskId}`))
}

export async function addComment(taskId: string, text: string): Promise<void> {
  await cu(`/task/${taskId}/comment`, { method: 'POST', body: JSON.stringify({ comment_text: text }) })
}

export async function deleteTask(taskId: string): Promise<void> {
  await cu(`/task/${taskId}`, { method: 'DELETE' })
}

/** Set a task's status (used in tests to simulate Ewa approving; not used by the tick). */
export async function setTaskStatus(taskId: string, status: string): Promise<void> {
  await cu(`/task/${taskId}`, { method: 'PUT', body: JSON.stringify({ status }) })
}

/** The checklist name the sign-off gate reserves for named ruling requests. */
export const RULINGS_CHECKLIST = 'Rulings required before approval'

/** Create a checklist on a task; returns its id. */
export async function createChecklist(taskId: string, name: string): Promise<string> {
  const body = await cu(`/task/${taskId}/checklist`, { method: 'POST', body: JSON.stringify({ name }) })
  const cl = body.checklist as Record<string, unknown> | undefined
  return String(cl?.id ?? '')
}

/** Append an item to a checklist. Items are created unresolved. */
export async function createChecklistItem(checklistId: string, name: string): Promise<void> {
  await cu(`/checklist/${checklistId}/checklist_item`, { method: 'POST', body: JSON.stringify({ name }) })
}

/** Resolve/unresolve a checklist item (used in tests to simulate Ewa ticking a ruling). */
export async function setChecklistItemResolved(
  checklistId: string,
  itemId: string,
  resolved: boolean,
): Promise<void> {
  await cu(`/checklist/${checklistId}/checklist_item/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ resolved }),
  })
}

/** Create the rulings checklist and one item per named ruling request. */
export async function addRulingsChecklist(taskId: string, rulings: string[]): Promise<string> {
  const id = await createChecklist(taskId, RULINGS_CHECKLIST)
  // Sequential on purpose: ClickUp orders items by creation, and the ruling order
  // matches the order they are stated in the submission.
  for (const r of rulings) await createChecklistItem(id, r)
  return id
}

/** Ruling items still unticked. Empty array = nothing outstanding (including the
 * common case of a task with no rulings checklist at all). */
export function unresolvedRulings(task: ReviewTask): string[] {
  return task.checklists
    .filter((c) => c.name === RULINGS_CHECKLIST)
    .flatMap((c) => c.items.filter((i) => !i.resolved).map((i) => i.name))
}

/** The approval signal: ClickUp status 'complete' == Ewa approved.
 *
 * Status alone is NOT sufficient when the submission asked for named rulings. A
 * binary gate cannot carry a non-boolean answer, so an unanswered ruling used to
 * become a silent yes: the andropause hub (2026-07-29) was approved by completion
 * with two CA-028 rulings asked twice and never answered, and nothing in the
 * pipeline noticed. Ruling requests are now real checklist items, and each must be
 * ticked before completion counts. See `unresolvedRulings`. */
export function isApproved(task: ReviewTask): boolean {
  return task.statusName === 'complete' && unresolvedRulings(task).length === 0
}

// ---------------------------------------------------------------------------
// Hierarchy + generic task helpers (added for the Content Library mirror).
// The block above serves the sign-off gate; the block below serves the one-way
// git -> ClickUp mirror (content-library-sync.ts). Both share the same token,
// auth headers, and cu() request helper. No existing behaviour is changed.
// ---------------------------------------------------------------------------

export interface CuNamed {
  id: string
  name: string
}

/** Spaces under a workspace/team. */
export async function getSpaces(teamId: string): Promise<CuNamed[]> {
  const body = await cu(`/team/${teamId}/space?archived=false`)
  const spaces = (body.spaces as Array<Record<string, unknown>> | undefined) ?? []
  return spaces.map((s) => ({ id: String(s.id), name: String(s.name ?? '') }))
}

/** Folders inside a space. */
export async function getFolders(spaceId: string): Promise<CuNamed[]> {
  const body = await cu(`/space/${spaceId}/folder?archived=false`)
  const folders = (body.folders as Array<Record<string, unknown>> | undefined) ?? []
  return folders.map((f) => ({ id: String(f.id), name: String(f.name ?? '') }))
}

/** Lists inside a folder. */
export async function getFolderLists(folderId: string): Promise<CuNamed[]> {
  const body = await cu(`/folder/${folderId}/list?archived=false`)
  const lists = (body.lists as Array<Record<string, unknown>> | undefined) ?? []
  return lists.map((l) => ({ id: String(l.id), name: String(l.name ?? '') }))
}

/**
 * Create a list in a folder. ClickUp's v2 create-list endpoint takes a name (and
 * optional content) but does NOT accept a custom status set, so the requested
 * plain statuses (idea, hooked, ...) are passed best-effort and may need a one-time
 * manual set-up in the ClickUp UI if the folder's inherited statuses differ.
 */
export async function createFolderList(args: {
  folderId: string
  name: string
  statuses?: string[]
}): Promise<CuNamed> {
  const reqBody: Record<string, unknown> = { name: args.name }
  if (args.statuses && args.statuses.length) reqBody.statuses = args.statuses
  const l = await cu(`/folder/${args.folderId}/list`, {
    method: 'POST',
    body: JSON.stringify(reqBody),
  })
  return { id: String(l.id), name: String(l.name ?? args.name) }
}

export interface CuTask {
  id: string
  name: string
  statusName: string
  description: string // plain-text description body as ClickUp stores it
}

function toCuTask(t: Record<string, unknown>): CuTask {
  const status = (t.status as { status?: string } | undefined)?.status ?? ''
  const desc =
    (typeof t.text_content === 'string' && t.text_content) ||
    (typeof t.description === 'string' && t.description) ||
    ''
  return {
    id: String(t.id),
    name: String(t.name ?? ''),
    statusName: status.toLowerCase(),
    description: String(desc),
  }
}

/** All (non-archived, non-subtask) tasks in a list, paged. */
export async function getListTasks(listId: string): Promise<CuTask[]> {
  const out: CuTask[] = []
  for (let page = 0; page < 50; page++) {
    const body = await cu(`/list/${listId}/task?archived=false&subtasks=false&page=${page}`)
    const tasks = (body.tasks as Array<Record<string, unknown>> | undefined) ?? []
    for (const t of tasks) out.push(toCuTask(t))
    if ((body.last_page as boolean | undefined) === true || tasks.length === 0) break
  }
  return out
}

/** Create a task with a markdown description. */
export async function createTaskInList(args: {
  listId: string
  name: string
  markdown: string
  status?: string
}): Promise<CuTask> {
  const reqBody: Record<string, unknown> = { name: args.name, markdown_content: args.markdown }
  if (args.status) reqBody.status = args.status
  return toCuTask(await cu(`/list/${args.listId}/task`, { method: 'POST', body: JSON.stringify(reqBody) }))
}

/** Update a task's status and/or markdown description (git-wins mirror write). */
export async function updateTaskContent(args: {
  taskId: string
  markdown?: string
  status?: string
}): Promise<void> {
  const reqBody: Record<string, unknown> = {}
  if (args.markdown !== undefined) reqBody.markdown_content = args.markdown
  if (args.status !== undefined) reqBody.status = args.status
  if (Object.keys(reqBody).length === 0) return
  await cu(`/task/${args.taskId}`, { method: 'PUT', body: JSON.stringify(reqBody) })
}
