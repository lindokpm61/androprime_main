# SOP: Incident Runbook

**Runs in:** escalation target for all cadences (`daily`/`weekly`/`monthly`).
**Purpose:** The response steps for a live incident: site down, payment failure / checkout broken, a lost Vitall result (the lab does not retry webhooks), and GDPR requests: data export via `app/api/account/export` and erasure via `app/api/account/erasure-request` (both LIVE 2026-07-19, in `09_website-app`). Covers detect → triage → route → resolve → log, using Sentry, Stripe, Supabase, and the `emitOpsAlert()` ops-profile alerts.
**Owner:** `09_website-app` (technical) + `03_compliance` (GDPR / data-subject requests).

Status: to be drafted.
