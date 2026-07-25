# SOP: Email Triage

**Runs in:** `cadences/daily-ops.md` (daily inbox pass).
**Purpose:** Read the business inbox once a day, route every message to the workspace that owns it, and turn every actionable item into a ClickUp task so nothing lives only in email. This SOP is the durable how-to; the live "what came in today and what was done" is a ClickUp task or comment, not this file.

---

## Source

- Inbox: **`keith@andro-prime.com`** (Google Workspace).
- Access: the **Gmail connector** (needs authorising in an interactive session before use) or the **gws CLI** (`gws`, auth'd to `keith@andro-prime.com`, Gmail + Drive scopes). Call gws from Bash, not PowerShell; if a call 403s right after re-auth, delete `~/.config/gws/token_cache.json` and retry.
- Scope: this is the human/partner/customer inbox. Automated app alerts (Sentry, the `emitOpsAlert()` ops profile for Vitall cancellations) are the daily error/dispatch checks in `daily-ops.md`, not this triage, though the ops-alert email lands in the same inbox and gets routed the same way.

---

## Routing rule

Read each unread thread once and route it by sender/subject to the owning workspace. Do not answer substantively from this workspace; route and (where actionable) task it.

| Email type | Route to | Notes |
| --- | --- | --- |
| Partner / lab reply (Vitall / Ben Starling) | `05_partners` | Update the relevant negotiation log (`labs/vitall/vitall-negotiation-log.md`); apply the middleman-correspondence discipline in `05_partners/CONTEXT.md` before any reply. |
| Supplier / manufacturer reply | `05_partners` | Update `manufacturers/outreach-tracker.md` or the partner dir. |
| Customer support / order / results question | `07_sales` (lifecycle) or `08_customer-journey` (support/journey) | Handling + escalation path: `sops/support-queue.md`. |
| Compliance / legal / regulatory (ASA, ICO, solicitor, Ewa on claims) | `03_compliance` | Anything claim- or law-adjacent. Never action externally without the compliance route. |
| PT / affiliate inbound | `06_marketing/affiliates` | Programme is FROZEN (2026-06-07); log interest, do not restart outreach. |
| Billing / Stripe / subscription dispute | `07_sales` + `09_website-app` | Handling: `sops/subscription-billing-ops.md`. |
| Vendor/admin, newsletters, noise | — | Archive or defer; no task. |

If a message spans two owners (a customer billing dispute that is also a refund request), route to both and note the dependency on the ClickUp task.

---

## Action vs defer

For each routed message decide one of three:

- **Action now:** anything time-sensitive or customer/partner-facing (a customer blocked on an order or result, a partner reply that closes a negotiation round, a compliance or legal notice). Reply or hand to the owner today, and open a ClickUp task capturing it.
- **Defer:** needs a reply but not today (a partner thread mid-cadence, a non-urgent question). Open a ClickUp task with a due date; snooze/label the email so it resurfaces.
- **Archive:** no action needed. No task.

**Every actionable item becomes a ClickUp task** (`workspace_id: "90121729875"`) against the owning workspace. The inbox is not the task list; ClickUp is. Do not leave an actionable email as its own tracker.

---

## What good looks like

- No **unrouted** email older than **[THRESHOLD: Keith to set, e.g. 24/48h]** in the inbox.
- Every actionable item has a ClickUp task; nothing important lives only in email.
- Partner and compliance threads are never the thing sat on: they are the highest-cost to delay (partner round-trips cost a week each; a compliance/legal notice has a clock).

---

## Escalation

- A compliance or legal notice: route to `03_compliance` today and flag to Keith; do not reply externally first.
- A customer blocked by a broken system (checkout down, lost result, a GDPR export/erasure request): open a ClickUp task and jump to `sops/incident-runbook.md`.
- A partner reply that changes a product economic or spec assumption: route to `05_partners` and trigger `/decision-sweep` if it moves a fact stated across docs.
