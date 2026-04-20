# n8n Automation Workflows

These workflows handle operational automations that are outside the core Stripe/Thriva/QStash webhook path.

## When to use n8n vs the Next.js API routes

| Use Next.js API routes | Use n8n |
|------------------------|---------|
| Real-time webhooks (Stripe, Thriva) | Scheduled or manual operations |
| Sub-second response required | Multi-step workflows with human review steps |
| Customer-facing checkout flows | Internal ops: affiliate onboarding, content review, KPI reports |
| Auth-gated app functionality | Monitoring + alerting |

## Workflows in this directory

| File | Purpose | Trigger |
|------|---------|---------|
| `workflows/content-review-trigger.json` | Create ClickUp task when content is submitted for Ewa's review | Webhook from Supabase `content_review_log` insert |
| `workflows/affiliate-onboarding.json` | Issue FirstPromoter code after PT affiliate form submission | Webhook from Supabase or manual trigger |
| `workflows/kpi-weekly-digest.json` | Pull KPI views from Supabase, format, send to Keith via email | Cron — every Monday 08:00 GMT |
| `workflows/deposit-alert.json` | Alert Keith when founding member deposits cross 25 / 40 gates | Cron — daily check against `v_deposit_summary` |

## Setup

1. Self-host n8n on the Coolify VPS (separate service, same server)
2. Set credentials:
   - Supabase: service role key
   - ClickUp: personal API token
   - FirstPromoter: API key
   - SMTP / Customer.io for digest emails
3. Import each `.json` workflow via n8n UI → Workflows → Import
4. Activate each workflow after confirming credentials are bound

## n8n environment variables needed

```
N8N_SUPABASE_URL=
N8N_SUPABASE_SERVICE_ROLE_KEY=
N8N_CLICKUP_API_TOKEN=
N8N_FIRSTPROMOTER_API_KEY=
N8N_DIGEST_EMAIL_TO=keithantony5@gmail.com
```
