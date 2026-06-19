# n8n Automation Workflows

Operational automations outside the core Stripe/Vitall/QStash webhook path.

## When to use n8n vs the Next.js API routes

| Use Next.js API routes | Use n8n |
|------------------------|---------|
| Real-time webhooks (Stripe, Vitall) | Scheduled or manual operations |
| Sub-second response required | Multi-step workflows with human review steps |
| Customer-facing checkout flows | Internal ops: KPI reports, partner onboarding |
| Auth-gated app functionality | Monitoring + alerting |

## Workflow inventory (authoritative — 2026-05-19)

| File | State | Purpose | Trigger |
|------|-------|---------|---------|
| `workflows/kpi-weekly-digest.json` | **Activate** | Pull `v_gate_tracker` + `v_supplement_mrr`, email Keith a KPI digest | Cron, Monday 08:00 GMT |
| `workflows/deposit-gate-alert.json` | **RETIRED — do not import/activate** | (Historical) deposit-gate alert. Deposit mechanic shelved 2026-05-08; watches the frozen `founding_member_deposits` table. `active:false`, has `_RETIRED_NOTE`. | — |
| `workflows/affiliate-onboarding.json` | **Activate (pending creds + Attio webhook)** | When a PT/Influencer/Gym deal hits stage **Onboarded** in Attio: fetch the deal + linked Person from the Attio API, create a FirstPromoter promoter, write the `ref_token` back to the deal's `firstpromoter_code` (+ `code_issued_date`). | Attio **native webhook** (`record.updated` on Deals); n8n gates on stage == Onboarded |

Two workflows can now activate: `kpi-weekly-digest` and `affiliate-onboarding` (the latter still needs FirstPromoter + Attio creds bound in n8n and an Attio webhook configured to fire it).

> **Retired 2026-06-19 — `content-review-trigger`.** The content-review sign-off path is now owned by the **pull-model content-engine orchestrator** (`09_website-app/frontend/scripts/content-engine/`), which the Signoff-Concierge + orchestrator drive via the ClickUp + Supabase APIs each tick — no Supabase→n8n webhook. The workflow JSON was deleted; its ClickUp list (`Content Review — Ewa`, `901218140081`) is reused by the orchestrator. Do not rebuild it in n8n.

## Configuration — env-free by design

**This n8n install does not expose environment variables**, so the workflows use **no `$env.*` references** (verified: zero in both active workflows). Secrets live in the n8n credential store (encrypted in n8n's own DB — never in this repo or the VPS env); non-secret config is set directly in the nodes.

### Non-secret config baked into the nodes

| Value | Where | Action |
|-------|-------|--------|
| Supabase project URL | `https://phqrjtnflovicgkngieu.supabase.co` — kpi "Fetch Gate Tracker" + "Fetch Supplement MRR" (2×) | Already baked into the node URLs. No action. Not a secret. |
| Digest recipient | kpi-weekly-digest "Send Digest Email" node | Already hardcoded to `keithantony5@gmail.com`. No action. |

### n8n bound credentials (credential store, NOT env vars)

Created in n8n → Credentials, then bound on the node. The JSON ships placeholder ids; after import, open each node and select the real credential.

| Credential | n8n type | Used by | Contents |
|------------|----------|---------|----------|
| Supabase Service Role | HTTP Custom Auth (`httpCustomAuth`) | kpi "Fetch Gate Tracker" + "Fetch Supplement MRR" | JSON: `{"headers":{"apikey":"<SERVICE_ROLE_KEY>","Authorization":"Bearer <SERVICE_ROLE_KEY>"}}` — paste the Supabase service-role key in both places. |
| SMTP | `smtp` | kpi-weekly-digest "Send Digest Email" | Sender `ops@andro-prime.com`. Any SMTP relay (or swap the node for the Customer.io/transactional sender). |
| FirstPromoter API | HTTP Header Auth (`httpHeaderAuth`) | affiliate-onboarding "Create FirstPromoter Promoter" | Single header — name: `Authorization`, value: `Bearer <FIRSTPROMOTER_API_KEY>` (key from gitignored root `.env`). FirstPromoter API v2 also requires an `ACCOUNT-ID: qj5zoyxs` header — that's **hardcoded directly on the node** (non-secret, same as the public tracking ID), so the credential only carries the Bearer key. Verified 2026-05-20 against `https://api.firstpromoter.com/api/v2/company/promoters`. |
| Attio API | HTTP Header Auth (`httpHeaderAuth`) | affiliate-onboarding "Write Code to Attio Deal" | Single header — name: `Authorization`, value: `Bearer <ATTIO_API_KEY>` (bearer token from gitignored root `.env`; same key used by the partner-CRM scripts). |

## Activation runbook

### 0. Prerequisites
- n8n self-hosted as a separate service on the Coolify VPS, reachable over HTTPS. Instance host: `https://n8ncoolify.keith-antony.com` (production webhooks are served at `/webhook/<path>`; `/webhook-test/<path>` is editor-listen only).
- The three credentials created in n8n (Supabase Service Role, ClickUp API, SMTP). Supabase project URL is already baked into the nodes (`https://phqrjtnflovicgkngieu.supabase.co`). No environment variables — this install does not expose them.
- DB objects present on the **target** Supabase project:
  - Views `v_gate_tracker`, `v_supplement_mrr` — **apply the updated `database/views/pipeline_overview.sql`** (`psql -f`) so `v_gate_tracker.fm_list_optins` exists. The KPI digest now reads `fm_list_optins` (non-cash founding-member list opt-ins); the old `total_deposits_paid` is historical-only.

### 1. content-review-trigger — RETIRED 2026-06-19

Superseded by the content-engine orchestrator (`09_website-app/frontend/scripts/content-engine/`). The Signoff-Concierge creates the `Content Review — Ewa` ClickUp task and writes the `content_review_log` row directly via API; the orchestrator polls task status each tick. No n8n workflow, no Supabase→n8n webhook. Nothing to activate here.

### 2. kpi-weekly-digest

**Topology (rebuilt 2026-05-19):** cron fans out to **both** fetch nodes in parallel → each feeds a **Merge Sources** node (mode: append, waits for both inputs) → Format Digest → Send Digest Email. This replaced the earlier sequential chain (cron → Gate → MRR → Format), which silently sent **no email at all** whenever a view returned zero rows (the empty HTTP node emitted no items and the chain stopped). Both fetch nodes now have `alwaysOutputData` + `continueOnFail`, and Format Digest defaults every figure to 0 and always returns one item, so the digest **always sends even with empty views**. Anyone editing this must keep the Merge join — do not collapse it back to a chain (the chain was a workaround for a fan-in error that the Merge node solves correctly).

1. Apply the updated `pipeline_overview.sql` to the target DB (see prerequisites).
2. Import the JSON. **If a previous version was already imported, re-import and re-save** — the topology and node set changed (new `Merge Sources` node; `Fetch *` nodes gained `alwaysOutputData`/`continueOnFail`).
3. On both "Fetch Gate Tracker" and "Fetch Supplement MRR": bind the **Supabase Service Role** credential. (URLs already set to `https://phqrjtnflovicgkngieu.supabase.co`.)
4. Bind the SMTP credential on "Send Digest Email" (recipient `keithantony5@gmail.com` is hardcoded — no config). `Merge Sources` needs no credential or config.
5. Activate (cron Monday 08:00 GMT).
6. **E2E test:** use n8n "Execute Workflow" (manual run) instead of waiting for Monday. Expect an email showing kit sales, **Founding-member list opt-ins (non-cash)**, supplement MRR, and gate status, ending with a **DATA SOURCES** line (`Gate tracker rows: N | Supplement MRR rows: N`). Confirm there is no "Deposits paid" line. **Empty-state test (important):** the email must still arrive even when the views return zero rows — figures show 0 and an explicit "both queries returned no data" warning appears, instead of the run failing silently. That is the specific failure this rebuild fixes.

### 3. affiliate-onboarding

When a PT/Influencer/Gym deal in Attio reaches stage **Onboarded**, this workflow creates a promoter in FirstPromoter and writes the returned `ref_token` back to the Attio deal as `firstpromoter_code` + sets `code_issued_date` (the documented join key, `attio-config-spec-v2.md`).

**Trigger = Attio NATIVE webhook, not an Attio workflow.** Attio's no-code workflow "Send HTTP request" block was tried and abandoned — it returns HTTP status 0 (never dispatches) across every body configuration, and it can't resolve linked-record variables or parse responses. Attio's **native webhook** (Settings → Developers → Webhooks) is a separate, reliable mechanism: it POSTs a standard payload and needs no variable wiring. It fires on *every* deal update; n8n filters for Onboarded itself (the `Build FP Payload` node is a stage gate — returns nothing unless `stage == Onboarded` and `firstpromoter_code` is empty).

7-node topology: `Webhook` → `Format Input` (extract `attio_deal_id` from Attio's `events[]` payload) → `Fetch Attio Deal` (GET) → `Fetch Attio Person` (GET, read email + name) → `Build FP Payload` (**stage gate**) → `Create FirstPromoter Promoter` (POST `api.firstpromoter.com/api/v2/company/promoters`) → `Write Code to Attio Deal` (PATCH). Core chain verified against the live Attio + FirstPromoter APIs on 2026-05-21.

1. Import the JSON (delete any earlier copy first — re-import clean).
2. Create two credentials in n8n if not present (both **HTTP Header Auth** / `httpHeaderAuth`, header name `Authorization`):
   - **Attio API** — value `Bearer <ATTIO_API_KEY>` (key from root `.env`)
   - **FirstPromoter API** — value `Bearer <FIRSTPROMOTER_API_KEY>` (key from root `.env`)
3. Bind **Attio API** on three nodes (`Fetch Attio Deal`, `Fetch Attio Person`, `Write Code to Attio Deal`) and **FirstPromoter API** on `Create FirstPromoter Promoter`. The `ACCOUNT-ID: qj5zoyxs` header is already hardcoded on the FirstPromoter node — not a secret, no credential needed for it.
4. Activate. Production webhook URL: `https://n8ncoolify.keith-antony.com/webhook/affiliate-onboarding`.
5. Wire the trigger — an **Attio native webhook** (Attio → Settings → Developers → Webhooks → add webhook):
   - Target URL: the n8n webhook URL above.
   - Event: **`record.updated`**, scoped to the **Deals** object (so it doesn't fire for People/Companies).
   - That's it — no payload shaping. Attio sends `{ events: [ { event_type, id: { record_id }, ... } ] }`; `Format Input` reads `events[0].id.record_id`.
6. **E2E test:** move a throwaway Attio deal (with a linked Person that has an email) to stage **Onboarded**, then confirm: (a) the promoter appears in the FirstPromoter dashboard, (b) the deal's `firstpromoter_code` + `code_issued_date` are populated. n8n in isolation: `curl -X POST <webhook-url> -H 'Content-Type: application/json' -d '{"attio_deal_id":"<deal id>"}'`. Delete the FirstPromoter promoter + clear the deal fields afterward.

**Duplicate / noise safety:** the `Build FP Payload` stage gate ignores every deal update that isn't a fresh move to Onboarded, so the all-updates native webhook is harmless. FirstPromoter also rejects a duplicate email with HTTP 400. Once `firstpromoter_code` is written back, the gate's `firstpromoter_code is empty` check stops any re-fire.

### 4. deposit-gate-alert
Do **not** import. Retired. If a founding-member-list count alert is wanted later, build a fresh workflow against `founding_member_list` (punch-list item 31) — do not revive this file.

## Blockers / preconditions to clear before "all workflows running" is true

- **n8n instance**: must actually be deployed on Coolify (separate service). Not an app deploy step.
- **Credentials (env-free)**: this n8n install does not expose env vars. The only secret (Supabase service-role key) goes in the `Supabase Service Role` HTTP Custom Auth credential; ClickUp + SMTP are bound credentials too. Never commit any of them. Non-secret config (Supabase URL, list id, digest email) is in the nodes.
- **DB view migration**: `pipeline_overview.sql` must be applied to the same Supabase project n8n points at, or the KPI digest's `fm_list_optins` is null.
- ~~Supabase DB webhook (content-review)~~ **N/A from 2026-06-19**: content-review left n8n for the content-engine orchestrator (API pull, no webhook). The `Content Review — Ewa` list (`901218140081`) is now driven by the Signoff-Concierge.
- **affiliate-onboarding**: rebuilt 2026-05-21 as a 7-node fetch-it-yourself workflow; trigger is an Attio **native webhook** (`record.updated` on Deals) — the Attio no-code workflow "Send HTTP request" block was abandoned (HTTP status 0, never dispatches). To go live: bind the two `httpHeaderAuth` credentials (Attio API + FirstPromoter API), add an Attio native webhook (Settings → Developers → Webhooks) for `record.updated` on Deals pointing at `https://n8ncoolify.keith-antony.com/webhook/affiliate-onboarding`, confirm E2E by moving a throwaway deal to Onboarded. n8n core chain pre-verified — see §3.
