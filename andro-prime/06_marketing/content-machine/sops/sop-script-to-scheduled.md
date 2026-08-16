# SOP — Script to scheduled

**How a written post gets from an idea to a slot in Metricool, on every social lane.** Written 2026-08-16, after a session in which two separate steps of this chain failed silently in one evening. It is the runbook for the hand-off points, not for the craft: `/hook`, `/script` and the playbooks own the writing.

**Trigger:** any time a post is being taken from drafted to scheduled, and whenever something in that chain surprises you.

**Roles:** the agent drafts and registers; **Keith approves and arms**; Ewa only for a net-new claim.

**Read first:** `../CONTEXT.md` (the file-owns-craft / database-owns-state split), `../x-channel-plan.md` §6 for the X batch, `03_compliance/CONTEXT.md` before any copy exists.

---

## The one-line version

The **file** owns the copy. The **database** owns what ships. **Metricool owns the calendar.** Every failure this SOP exists to prevent happens at a boundary between those three.

---

## Path A — one post (LinkedIn, Facebook, video)

| # | Step | Who | Writes to the file | Writes to the database |
|---|---|---|---|---|
| 1 | Pick the angle from `content-queue.md` | you | — | — |
| 2 | `/hook <topic>` | agent | mints `assets/YYYY-MM-DD-<slug>.md` | — |
| 3 | `/script <topic> [linkedin\|facebook]` | agent | the post into `## Script`; `renditions:` (platform/format/thumb) | asset row at `scripted`; one rendition per surface at `to-produce`, **body still empty** |
| 4 | `scan.js` | agent, inside `/script` | — | — |
| 5 | `/compliance-preflight` | agent | — | `preflight`, `preflight_date` |
| 6 | Ewa, **only if amber** | Keith submits, Ewa completes in ClickUp | — | `signoff-sync` writes `ewa_signed_at` |
| 7 | Asset reaches `approved` | agent | — | gated by `content_assets_approval_gate` |
| 8 | **`bridge-post-body.ts`** | agent | reads `## Script` | **writes `content_renditions.body`** |
| 9 | Choose the slot | **Keith** | — | `scheduled_for` |
| 10 | `metricool-schedule --dry-run`, then `--log` | agent | — | `external_post_id`, `status='scheduled'` |
| 11 | **Arm it in Metricool** | **Keith** | — | — |
| 12 | It publishes | — | — | — |
| 13 | `metricool-writeback` | **nightly, automatic** | — | `status='published'`, `published_at` |
| 14 | `metricool-metrics` | **nightly, automatic** | — | metric rows |
| 15 | `content-sync` | agent, hand-run | regenerates the mirror block | — |

## Path B — a week of X

No per-post asset file: a week is **one** draft holding seven posts.

| # | Step | Who | Notes |
|---|---|---|---|
| 1 | Take the queue row | you | `X-NN` names the article. Rows carry `[W]` when they count toward the wellness floor: swapping one moves that ratio |
| 2 | Draft seven into `drafts/x-week-<date>.md` | agent | each section needs `slug:`, `slot:`, `title:`. `slot: by-hand` for the Sunday thread |
| 3 | **One** `/compliance-preflight` over the file | agent | scan the **payload** separately from the commentary, or the count measures the document's structure |
| 4 | Keith approves the batch in one read | **Keith** | then `approved_by` / `approved_date` go in the frontmatter |
| 5 | **`register-x-batch <file>`** | agent | `--dry-run` first. Parses the copy out of the blockquotes, never re-typed |
| 6 | `metricool-schedule` | agent | as Path A step 10 |
| 7 | Arm | **Keith** | as Path A step 11 |

---

## What is actually automated

**Four things, all nightly, all after the fact:** `content-doctor`, `doctor-heartbeat`, `metricool-writeback`, `metricool-metrics`. The GitHub workflow serves the *article* spine, not this one.

**Everything from idea to scheduled is hand-run.** That is the design (automate the plumbing, never automate a gate), but it means no step happens because a previous one finished. If nobody runs step 8, nothing anywhere goes red until scheduling refuses.

---

## The five places this chain breaks quietly

Each one has happened. None of them produced an error at the time.

**1. Copy in the file, nothing in the column.** `/script` writes the post into the asset file; the scheduler reads `content_renditions.body` and refuses to guess from markdown. Nothing joined them until `bridge-post-body.ts`. **Symptom:** the scheduler says the body is empty for a post you have read with your own eyes. **It is not missing, it is unbridged.**

**2. A body that is present but is not the post.** Every gate checks presence and shape, and a placeholder has both. A thread rendition reached `scheduled` carrying `"7-unit thread. Full copy in drafts/…"` — 407 characters, an unremarkable post length. **Ask what the body IS, not whether it exists.** `register-x-batch` now refuses a section whose blockquote is empty, and refuses a claimed character count that disagrees with the copy, but neither can tell prose from a note about prose.

**3. A handling rule that lives only in prose.** `x-channel-plan.md` §5 says threads are posted by hand because Metricool cannot split them. A thread was scheduled through Metricool anyway, because **no automated step reads a sentence in a doc.** The remedy is a field: `slot: by-hand` registers `publisher='manual'`, and `metricool-schedule` refuses any rendition whose publisher is not `metricool`, by name. **If a rule matters, make it a column.**

**4. 🔴 Arming replaces the post and its id.** Flipping a draft live in the Metricool UI does not edit it: it creates a new post and destroys the old one. On 2026-08-16 seven ids died within six minutes of being written down. **Everything keyed on `external_post_id` breaks in that instant** — doctor I3, the analytics join, the writeback — and nothing warns you, because the database is perfectly consistent with itself while holding dead keys. **After any arming session, re-read the calendar and re-map by SLOT**, which is the only key that survives. A post created live and never drafted keeps its id, which is why this was invisible until the shared scheduler started making drafts.

**5. A check that only walks one way.** I3 and I12 both start from an id we hold and ask Metricool about it. Neither can see a post that exists in Metricool and not in our database, which is the direction a duplicate arrives from. **To answer "are we double-posting?", list the calendar and diff both ways** — and list **both** brands, because the scheduler list endpoint is brand-scoped and returns an empty array for the wrong one.

---

## Before you call it scheduled

1. `metricool-schedule --dry-run` shows exactly the posts you expect, at the wall-clock times you expect.
2. The run's ids are in the database.
3. **Re-read the calendar** and confirm slot, copy and draft flag from Metricool's own answer, not from the send returning an id.
4. If anyone armed anything, **re-map the ids by slot** and re-run the doctor.
5. `content-doctor` is no worse than it was before you started.

---

## Related

- `../x-channel-plan.md` §5 rotation, §6 the weekly batch
- `sop-linkedin-post.md`, `sop-compliance-route.md`
- `../CONTEXT.md` — the identity/state split, and the id-stability rule
- `../STATE.md` — the dated measurements behind every failure listed above
