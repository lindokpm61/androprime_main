# n8n Automation Workflows

Operational automations outside the core Stripe/Vitall/QStash webhook path.

## When to use n8n vs the Next.js API routes

| Use Next.js API routes | Use n8n |
|------------------------|---------|
| Real-time webhooks (Stripe, Vitall) | Scheduled or manual operations |
| Sub-second response required | Multi-step workflows with human review steps |
| Customer-facing checkout flows | Internal ops: content review, KPI reports |
| Auth-gated app functionality | Monitoring + alerting |

## Workflow inventory (authoritative — 2026-05-19)

| File | State | Purpose | Trigger |
|------|-------|---------|---------|
| `workflows/content-review-trigger.json` | **Activate** | Create a ClickUp task when content is submitted for Ewa's review; write the task id back to `content_review_log` | Supabase DB webhook on `content_review_log` INSERT |
| `workflows/kpi-weekly-digest.json` | **Activate** | Pull `v_gate_tracker` + `v_supplement_mrr`, email Keith a KPI digest | Cron, Monday 08:00 GMT |
| `workflows/deposit-gate-alert.json` | **RETIRED — do not import/activate** | (Historical) deposit-gate alert. Deposit mechanic shelved 2026-05-08; watches the frozen `founding_member_deposits` table. `active:false`, has `_RETIRED_NOTE`. | — |
| `workflows/affiliate-onboarding.json` | **Activate (pending creds + Attio trigger)** | Issue a FirstPromoter promoter when a PT/Influencer/Gym deal reaches "approved/activated" in Attio; write the resulting promo code back to the Attio deal's `firstpromoter_code` field (the join key per `attio-config-spec-v2.md`). | Inbound webhook from Attio (or a Next.js forwarder) |

Three workflows can now activate: `content-review-trigger`, `kpi-weekly-digest`, and `affiliate-onboarding` (the last one still needs FirstPromoter + Attio creds bound in n8n and an Attio webhook configured to fire it).

## Configuration — env-free by design

**This n8n install does not expose environment variables**, so the workflows use **no `$env.*` references** (verified: zero in both active workflows). Secrets live in the n8n credential store (encrypted in n8n's own DB — never in this repo or the VPS env); non-secret config is set directly in the nodes.

### Non-secret config baked into the nodes

| Value | Where | Action |
|-------|-------|--------|
| Supabase project URL | `https://phqrjtnflovicgkngieu.supabase.co` — content-review "Write ClickUp Task ID to Supabase" (1×); kpi "Fetch Gate Tracker" + "Fetch Supplement MRR" (2×) | Already baked into the node URLs. No action. Not a secret. |
| ClickUp list id | content-review "Create ClickUp Task" node | Already hardcoded to `901218140081` ("Content Review — Ewa"). No action. |
| Digest recipient | kpi-weekly-digest "Send Digest Email" node | Already hardcoded to `keithantony5@gmail.com`. No action. |

### n8n bound credentials (credential store, NOT env vars)

Created in n8n → Credentials, then bound on the node. The JSON ships placeholder ids; after import, open each node and select the real credential.

| Credential | n8n type | Used by | Contents |
|------------|----------|---------|----------|
| Supabase Service Role | HTTP Custom Auth (`httpCustomAuth`) | content-review "Write ClickUp Task ID to Supabase"; kpi "Fetch Gate Tracker" + "Fetch Supplement MRR" | JSON: `{"headers":{"apikey":"<SERVICE_ROLE_KEY>","Authorization":"Bearer <SERVICE_ROLE_KEY>"}}` — paste the Supabase service-role key in both places. |
| ClickUp API | `clickUpApi` | content-review "Create ClickUp Task" | ClickUp personal API token with access to list 901218140081. |
| SMTP | `smtp` | kpi-weekly-digest "Send Digest Email" | Sender `ops@andro-prime.com`. Any SMTP relay (or swap the node for the Customer.io/transactional sender). |
| FirstPromoter API | HTTP Header Auth (`httpHeaderAuth`) | affiliate-onboarding "Create FirstPromoter Promoter" | Single header — name: `Authorization`, value: `Bearer <FIRSTPROMOTER_API_KEY>` (key from gitignored root `.env`). FirstPromoter API v2 also requires an `ACCOUNT-ID: qj5zoyxs` header — that's **hardcoded directly on the node** (non-secret, same as the public tracking ID), so the credential only carries the Bearer key. Verified 2026-05-20 against `https://api.firstpromoter.com/api/v2/company/promoters`. |
| Attio API | HTTP Header Auth (`httpHeaderAuth`) | affiliate-onboarding "Write Code to Attio Deal" | Single header — name: `Authorization`, value: `Bearer <ATTIO_API_KEY>` (bearer token from gitignored root `.env`; same key used by the partner-CRM scripts). |

## Activation runbook

### 0. Prerequisites
- n8n self-hosted as a separate service on the Coolify VPS, reachable over HTTPS. Instance host: `https://n8ncoolify.keith-antony.com` (production webhooks are served at `/webhook/<path>`; `/webhook-test/<path>` is editor-listen only).
- The three credentials created in n8n (Supabase Service Role, ClickUp API, SMTP). Supabase project URL is already baked into the nodes (`https://phqrjtnflovicgkngieu.supabase.co`). No environment variables — this install does not expose them.
- DB objects present on the **target** Supabase project:
  - `content_review_log` table — migration `20260420_phase_08_content_review_log.sql` (exists).
  - Views `v_gate_tracker`, `v_supplement_mrr` — **apply the updated `database/views/pipeline_overview.sql`** (`psql -f`) so `v_gate_tracker.fm_list_optins` exists. The KPI digest now reads `fm_list_optins` (non-cash founding-member list opt-ins); the old `total_deposits_paid` is historical-only.

### 1. content-review-trigger
List `Content Review — Ewa` (id `901218140081`) already exists and is **hardcoded in the node** — no list config needed. The task uses the list's default open status (review state of record is `content_review_log.status`, not the ClickUp task status).

1. Import the JSON (n8n → Workflows → Import).
2. On "Create ClickUp Task": bind the ClickUp API credential (token with access to list 901218140081).
3. On "Write ClickUp Task ID to Supabase": bind the **Supabase Service Role** (HTTP Custom Auth) credential. (URL already set to `https://phqrjtnflovicgkngieu.supabase.co`.)
4. Activate.
5. Wire the Supabase → n8n webhook. The **production** URL is `https://n8ncoolify.keith-antony.com/webhook/content-review-submitted`. The `/webhook-test/` variant only fires while the editor is open in "listen" mode — do **not** use it. In Supabase → Database → Webhooks, create a webhook on `public.content_review_log` for INSERT that POSTs the row as `{ "record": <row> }` to the `/webhook/` URL.
6. **E2E test:** insert a test row into `content_review_log` (service role). Expect: a task in the `Content Review — Ewa` list, and `clickup_task_id` populated back on that row. Delete the test row + task afterward.

### 2. kpi-weekly-digest

**Topology (rebuilt 2026-05-19):** cron fans out to **both** fetch nodes in parallel → each feeds a **Merge Sources** node (mode: append, waits for both inputs) → Format Digest → Send Digest Email. This replaced the earlier sequential chain (cron → Gate → MRR → Format), which silently sent **no email at all** whenever a view returned zero rows (the empty HTTP node emitted no items and the chain stopped). Both fetch nodes now have `alwaysOutputData` + `continueOnFail`, and Format Digest defaults every figure to 0 and always returns one item, so the digest **always sends even with empty views**. Anyone editing this must keep the Merge join — do not collapse it back to a chain (the chain was a workaround for a fan-in error that the Merge node solves correctly).

1. Apply the updated `pipeline_overview.sql` to the target DB (see prerequisites).
2. Import the JSON. **If a previous version was already imported, re-import and re-save** — the topology and node set changed (new `Merge Sources` node; `Fetch *` nodes gained `alwaysOutputData`/`continueOnFail`).
3. On both "Fetch Gate Tracker" and "Fetch Supplement MRR": bind the **Supabase Service Role** credential. (URLs already set to `https://phqrjtnflovicgkngieu.supabase.co`.)
4. Bind the SMTP credential on "Send Digest Email" (recipient `keithantony5@gmail.com` is hardcoded — no config). `Merge Sources` needs no credential or config.
5. Activate (cron Monday 08:00 GMT).
6. **E2E test:** use n8n "Execute Workflow" (manual run) instead of waiting for Monday. Expect an email showing kit sales, **Founding-member list opt-ins (non-cash)**, supplement MRR, and gate status, ending with a **DATA SOURCES** line (`Gate tracker rows: N | Supplement MRR rows: N`). Confirm there is no "Deposits paid" line. **Empty-state test (important):** the email must still arrive even when the views return zero rows — figures show 0 and an explicit "both queries returned no data" warning appears, instead of the run failing silently. That is the specific failure this rebuild fixes.

### 3. affiliate-onboarding

When a PT/Influencer/Gym deal in Attio is approved, this workflow creates a promoter in FirstPromoter and writes the returned `promo_code` back to the Attio deal as `firstpromoter_code` (the documented join key). Topology: webhook → Format Input (validates `email` + `attio_deal_id`, accepts either `{ record: {...} }` or a flat body) → POST `firstpromoter.com/api/v1/promoters/create` → Extract Promo Code (reads `promotions[0].promo_code`, falls back to `default_ref_id`) → PATCH `api.attio.com/v2/objects/deals/records/{id}`.

1. Import the JSON.
2. Create two credentials in n8n if not present: **FirstPromoter API** (httpHeaderAuth, name `x-api-key`, value = `FIRSTPROMOTER_API_KEY` from `.env`) and **Attio API** (httpHeaderAuth, name `Authorization`, value = `Bearer <ATTIO_API_KEY>`).
3. Bind both on their nodes ("Create FirstPromoter Promoter" / "Write Code to Attio Deal").
4. Activate. Production webhook URL is `https://n8ncoolify.keith-antony.com/webhook/affiliate-onboarding`.
5. Wire the trigger. Two viable options:
   - **Attio webhook** (preferred when Attio's webhook body can be shaped): configure on the `deals` object, filter on stage = "Approved" (or whichever stage means "ready to onboard"), POST to the production webhook URL. If Attio's payload doesn't match the expected shape, the Format Input node may need adjusting — open it and tweak.
   - **Next.js forwarder**: add a small `/api/partners/onboard` route that the Attio "Approved" automation calls (or that an Andro Prime admin triggers manually), which then POSTs `{ record: { email, first_name, last_name, attio_deal_id } }` to the n8n webhook. Use this if Attio's outbound webhook shape is awkward.
6. **E2E test:** create a throwaway Attio deal with a test email + your own Attio person, trigger the webhook (curl with a flat body works), and confirm: (a) the promoter appears in the FirstPromoter dashboard, (b) the Attio deal's `firstpromoter_code` field shows the same code. Delete both afterward.

### 4. deposit-gate-alert
Do **not** import. Retired. If a founding-member-list count alert is wanted later, build a fresh workflow against `founding_member_list` (punch-list item 31) — do not revive this file.

## Blockers / preconditions to clear before "all workflows running" is true

- **n8n instance**: must actually be deployed on Coolify (separate service). Not an app deploy step.
- **Credentials (env-free)**: this n8n install does not expose env vars. The only secret (Supabase service-role key) goes in the `Supabase Service Role` HTTP Custom Auth credential; ClickUp + SMTP are bound credentials too. Never commit any of them. Non-secret config (Supabase URL, list id, digest email) is in the nodes.
- **DB view migration**: `pipeline_overview.sql` must be applied to the same Supabase project n8n points at, or the KPI digest's `fm_list_optins` is null.
- ~~ClickUp list~~ **DONE 2026-05-19**: `Content Review — Ewa` list created, id `901218140081`, hardcoded in the node. No env var, no status config needed.
- **Supabase DB webhook**: content-review only fires once the Supabase → n8n webhook is wired to the **production** `/webhook/content-review-submitted` URL (not `/webhook-test/`) — step 1.5.
- **affiliate-onboarding**: built (2026-05-20). To go live: bind the two new n8n credentials (FirstPromoter API + Attio API), wire the Attio "deal approved" trigger to `https://n8ncoolify.keith-antony.com/webhook/affiliate-onboarding`, and confirm E2E with a throwaway deal.
