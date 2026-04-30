---
title: Monitoring Setup — Andro Prime
updated: 2026-04-28
---

Three layers: error tracking (Sentry), uptime (UptimeRobot), and logs (Coolify).
Business KPIs are handled separately by the `kpi-weekly-digest` n8n workflow.

---

## 1. Error Tracking — Sentry

Captures unhandled exceptions in Next.js API routes and the browser.

### Setup

1. Create a free Sentry account at sentry.io
2. New project → Platform: **Next.js**
3. Copy the DSN from Project Settings → Client Keys

### Install in codebase

```bash
npx @sentry/wizard@latest -i nextjs
```

This generates `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` in the frontend root. Commit them.

### Environment variables to add in Coolify

| Variable | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Build Argument | Sentry → Project Settings → Client Keys → DSN |
| `SENTRY_AUTH_TOKEN` | Runtime | Sentry → Settings → Auth Tokens → Create token (scope: `project:releases`, `org:read`) |
| `SENTRY_ORG` | Runtime | Your Sentry organisation slug (visible in URL: `sentry.io/organisations/<slug>/`) |
| `SENTRY_PROJECT` | Runtime | Your Sentry project slug |

### What it catches

- All unhandled exceptions in API routes (`/api/checkout`, `/api/webhooks/stripe`, `/api/webhooks/vitall`, `/api/jobs/process-result`)
- Frontend JS errors
- Source maps uploaded at build time (requires `SENTRY_AUTH_TOKEN`) — gives you readable stack traces instead of minified code

### Alert config (recommended)

In Sentry → Alerts → Create Alert Rule:
- **Trigger:** New issue OR issue frequency > 5 in 1 hour
- **Action:** Email keith@andro-prime.com

---

## 2. Uptime Monitoring — UptimeRobot

External ping every 5 minutes. Free tier covers up to 50 monitors.

### Setup

1. Create account at uptimerobot.com
2. Add Monitor → HTTP(s)
3. Configure the monitors below

### Monitors to add

| Name | URL | Alert threshold |
|---|---|---|
| Andro Prime — Home | `https://andro-prime.com` | Down for 5 min |
| Checkout API | `https://andro-prime.com/api/checkout` | Down for 5 min |
| Vitall webhook | `https://andro-prime.com/api/webhooks/vitall` | Down for 5 min |
| Stripe webhook | `https://andro-prime.com/api/webhooks/stripe` | Down for 5 min |
| Results job | `https://andro-prime.com/api/jobs/process-result` | Down for 5 min |

> The API routes return 405 (Method Not Allowed) on GET — UptimeRobot counts 4xx as "up" unless you configure keyword matching. Leave default unless you want a dedicated `/api/health` endpoint.

### Alert contact

Settings → Alert Contacts → Add: keithantony5@gmail.com
Optionally add an SMS number for critical hours.

### `/api/health` endpoint (optional but recommended)

Add a lightweight health route that returns 200 so UptimeRobot gets a clean response:

```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true })
}
```

Then point the "Andro Prime — Home" monitor at `/api/health` instead of `/`.

---

## 3. Application Logs — Coolify

Coolify captures all Docker stdout/stderr automatically. No extra config needed.

### Viewing logs

Coolify dashboard → your service → **Logs** tab. Live-tails the running container.

### Retention

Coolify retains logs in the container until it restarts. For persistent searchable logs, pipe to **Logtail** (free tier: 1GB/month, 3-day retention):

1. Create account at logtail.com → New Source → Docker
2. Follow their Docker logging driver setup
3. All `console.log` / `console.error` in your Next.js API routes will appear in Logtail

This is optional for Phase 0 — Coolify's built-in log viewer is sufficient at low volume.

---

## 4. Business KPIs — n8n (existing)

Handled by `automations/n8n/kpi-weekly-digest.json`.

Triggers every Monday. Queries Supabase for:
- Orders placed (week)
- Revenue (week)
- Supplement subscribers
- Founding member deposits
- Results processed

Posts digest to ClickUp (or email — configure in n8n). Active once QStash + Supabase + n8n are live.

---

## Setup Order

Do these in order on first deployment:

- [ ] Create Sentry project, run `npx @sentry/wizard`, commit generated config files
- [ ] Add Sentry env vars to Coolify (Build Arguments + Runtime)
- [ ] Deploy — verify Sentry receives a test error (Sentry wizard includes a test route)
- [ ] Create UptimeRobot account, add alert contact email
- [ ] Add all 5 monitors listed above
- [ ] Confirm first ping succeeds (green status within 5 minutes of adding)
- [ ] (Optional) Add `/api/health` route and update UptimeRobot monitor URL
- [ ] (Optional) Set up Logtail if persistent log history is needed
- [ ] Activate `kpi-weekly-digest` n8n workflow once Supabase is live

---

## Incident Response

| Signal | First check | Second check |
|---|---|---|
| UptimeRobot alert — site down | Coolify → Logs tab (container crash?) | Coolify → restart service |
| Sentry — checkout API error | Stripe dashboard → recent events | Check `STRIPE_SECRET_KEY` is live key not test |
| Sentry — Vitall webhook error | Webhook log in Sentry | Check `VITALL_WEBHOOK_SECRET` matches Vitall portal |
| Sentry — process-result job error | Sentry stack trace | Check QStash → Logs for job payload |
| No orders but traffic exists | Stripe dashboard → checkout attempts | Sentry for JS errors on checkout page |
