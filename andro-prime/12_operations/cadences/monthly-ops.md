# Monthly Ops Cadence

The once-a-month rhythm: step back from the week and read retention, subscription health, and whether anything external drifted out of compliance. Each check names its SOP and the owning workspace. Findings and actions go to **ClickUp** (`workspace_id: "90121729875"`), not this file.

---

## The monthly checks

| Check | SOP | Owner workspace | Why |
| --- | --- | --- | --- |
| Retention / cohort read | (reference below; owner → `08_customer-journey`) | `08_customer-journey` (retention) + Supabase (data) | Attach rate and tenure are the two levers that decide profitability; a month is the right window to read cohort retention and the retest loop, which the weekly glance is too short to show. |
| Subscriptions + dunning review | `sops/subscription-billing-ops.md` | `07_sales` (lifecycle) + `09_website-app` (Stripe) | Read the full subscription base once a month: active vs paused vs cancelled, failed-payment recovery, and any refunds, so involuntary churn and dunning gaps surface. |
| Compliance re-approval sweep | (reference below; owner → `03_compliance`) | `03_compliance` | Anything external that changed since last month (a live page, an email, an affiliate/influencer brief, results-report wording) needs a compliance re-check; a net-new claim needs re-approval. |

---

## How to run each

### 1. Retention / cohort read

- Read cohort retention and subscription tenure in **Supabase** (MCP, read-only): active subscribers by start cohort, cancellations, and the retest loop (the Day-75 `seq-04` retest prompt is the key re-engagement point; retest framing and mechanics are owned by `07_sales` and `08_customer-journey`).
- Cross-read the attach rate (`subscription_started ÷ result_received`, canonical target ≥15% of kit buyers; restructure trigger <10% after 80 results, per `07_sales/CONTEXT.md`). Do not restate the target as canonical here; read it there.
- Journey, onboarding, and retention design decisions route to `08_customer-journey`; open a ClickUp task there for any retention action. Data lives in Supabase; do not write to it from here.

### 2. Subscriptions + dunning review

- Run `sops/subscription-billing-ops.md` over the whole base, not just this week's failures: active / paused / past-due / cancelled counts, failed-payment recovery outcomes, and refunds issued.
- Remember dunning is a Stripe Dashboard-only setting and the Smart-Retries-vs-CIO-emails decision is deferred to Phase 0b (`09_website-app/CONTEXT.md`); until it is locked, the monthly review is where involuntary churn gets caught by hand.
- Lifecycle and save-offer logic (the `seq-05` churn sequence, pause option) is owned by `07_sales`; the Stripe integration by `09_website-app`. Route actions to the owner.

### 3. Compliance re-approval sweep

- List everything external that changed since the last sweep: live pages, sent or edited emails, affiliate/influencer briefs, social posts, and results-report wording.
- For each, run `/compliance-preflight` (Guardrail #1). A change that introduces or alters a health claim goes to `03_compliance` and then Ewa for sign-off; a copy change with no new claim still gets the pre-flight scan.
- Watch the standing rails: no ashwagandha mention anywhere, EFSA-approved claims only, no "diagnose/treat/cure", no TRT-available language, no em dashes in customer-facing copy. Any breach is a `03_compliance` task, not a quiet inline fix.
- If a major decision changed a fact that is stated in multiple docs (pricing, routing, thresholds, a claims rule), run `/decision-sweep` so the doc layer is swept, not just the one place the decision landed.

---

## Escalation

A retention metric past its restructure trigger, a dunning gap bleeding subscribers, or a live compliance breach each opens a ClickUp task against the owning workspace. A live compliance breach on a customer-facing surface is treated as an incident (`sops/incident-runbook.md`) alongside the compliance task.
