# Daily Ops Cadence

The every-working-day rhythm: keep the live business running and catch anything that lost money or a customer overnight. Each check names the SOP that runs it and the workspace that owns any issue it surfaces. Run status (done today, what it found, what was actioned) is a **ClickUp** task or comment, not this file. Every ClickUp call passes `workspace_id: "90121729875"`.

Target: a focused 15-minute pass. If any check turns up an issue, open or update a ClickUp task against the owning workspace and route it (see root `CLAUDE.md` routing table). Do not fix cross-workspace issues inline here.

---

## The daily checks

| Check | SOP | Owner workspace | Why |
| --- | --- | --- | --- |
| Inbox / email triage | `sops/email-triage.md` | routes per rule: partner/supplier → `05_partners`; support → `07_sales` / `08_customer-journey`; compliance/legal → `03_compliance` | Partner replies (Vitall, manufacturers) run on a week+ round-trip, so a same-day read protects the cadence; a missed customer or legal email is a support or compliance failure. |
| Error / alert check | (inline below; deeper triage → `09_website-app`) | `09_website-app` (Sentry owner); incidents → `sops/incident-runbook.md` | Sentry is the live error stack. A spike or a new unhandled error on checkout, the Vitall webhook, or the results job means customers are hitting a broken path right now. |
| New orders + dispatch sanity | (inline below; pipeline owner → `09_website-app`) | `09_website-app` (Vitall + Supabase); lab issues → `05_partners` | The lab does not retry failed webhooks: a silent Vitall webhook failure = a lost result with no recovery path. Confirm orders in = kits dispatched, no stuck rows. |
| Payment failures glance | `sops/subscription-billing-ops.md` | `07_sales` (lifecycle) + `09_website-app` (Stripe integration) | A failed charge is churn-in-progress. Catch failed payments and stuck subscriptions before the customer silently lapses. |

---

## How to run each

### 1. Inbox / email triage

Run `sops/email-triage.md`. Read the `keith@andro-prime.com` inbox, route each item by the rule in that SOP, and turn every actionable item into a ClickUp task. Defer or archive the rest. "Good" = no unrouted email older than the triage SOP's threshold.

### 2. Error / alert check (Sentry)

- Open Sentry (error monitoring for the live app; wired via `instrumentation*.ts` + `next.config.ts`, see `09_website-app/CONTEXT.md`).
- Scan for new issues and volume spikes since yesterday, weighting the money/health paths: `app/api/webhooks/stripe`, `app/api/webhooks/vitall`, `app/api/jobs/process-result`, and the checkout routes.
- A new high-volume or customer-facing error is an incident: open a ClickUp task against `09_website-app` and follow `sops/incident-runbook.md`. Do not debug app code from this workspace; route it.
- Also watch for the `emitOpsAlert()` internal alert (Vitall `order-cancelled` and `sample-issue`/`data-purged` land in the ops profile inbox, default `keith@andro-prime.com`); a cancellation never auto-refunds, so any refund is a deliberate manual Stripe action (→ `sops/subscription-billing-ops.md`).

### 3. New orders + dispatch sanity

- Confirm the flow held end-to-end: order placed (Stripe) → dispatch (Vitall) → result webhook → results job. Reference pipeline: `app/api/webhooks/vitall` → Upstash QStash → `app/api/jobs/process-result` (`09_website-app/CONTEXT.md`).
- Read order/dispatch state in **Supabase** (MCP, read-only): confirm new `kit_orders` rows dispatched and no rows stuck between states. Do not write to Supabase from here.
- A stuck or missing dispatch, or a webhook that never arrived, is a `09_website-app` pipeline issue (lab-side → `05_partners`). Open a ClickUp task and, if customers are affected, treat as an incident (`sops/incident-runbook.md`).

### 4. Payment failures glance

- Glance at Stripe for failed charges and past-due subscriptions since yesterday (Stripe MCP connects to LIVE; note it cannot read unpaid checkout sessions, see `09_website-app/CONTEXT.md`).
- Any failed payment or dunning event: log it and run the handling steps in `sops/subscription-billing-ops.md`. Recovery/dunning wording and lifecycle sit in `07_sales`; the Stripe integration and refund mechanics sit in `09_website-app`.
- Note: Stripe dunning (Smart Retries + failed-payment emails) is a Dashboard-only setting and the retries-vs-CIO-emails decision is deferred to Phase 0b (`09_website-app/CONTEXT.md`); until locked, treat failures as a manual review.

---

## Escalation

Anything customer-facing and broken (site down, checkout failing, a lost result, a GDPR export/erasure request) jumps straight to `sops/incident-runbook.md` and a ClickUp task against the owning workspace, regardless of which daily check surfaced it.
