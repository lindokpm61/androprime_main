# Andro Prime — Database Schema Reference

Supabase (PostgreSQL). EU Frankfurt region — mandatory for UK GDPR (blood biomarker data is special category).

Run migrations with:
```
npm run db:sync   # copy database/migrations/ → supabase/migrations/
npm run db:push   # apply to linked Supabase project
```

---

## Enums

| Enum | Values |
|------|--------|
| `kit_type` | `testosterone`, `energy-recovery`, `hormone-recovery` |
| `order_status` | `pending`, `paid`, `dispatched`, `sample_registered`, `processing`, `results_received`, `cancelled`, `refunded` |
| `subscription_status` | `incomplete`, `trialing`, `active`, `past_due`, `cancelled`, `unpaid` |
| `deposit_status` | `pending`, `paid`, `cancelled`, `refunded` |
| `content_review_status` | `submitted`, `approved`, `rejected`, `needs_revision` |

---

## Tables

### `users`
Synced from `auth.users` via trigger on insert/update of email.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | References `auth.users(id)` |
| `email` | text unique | |
| `age` | integer | Must be ≥ 18 |
| `marketing_consent` | boolean | Default false |

### `kit_orders`
One row per kit purchase. Created by Stripe webhook on `checkout.session.completed`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `kit_type` | kit_type | |
| `stripe_payment_intent` | text unique | |
| `status` | order_status | Default `pending` |
| `ordered_at` | timestamptz | |

### `sample_registrations`
Tracks the physical kit once dispatched. One row per order.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_id` | uuid FK → kit_orders unique | |
| `barcode` | text unique | Lab (Vitall) barcode assigned at dispatch |
| `registered_at` | timestamptz | When sample was registered at lab |
| `dispatched_at` | timestamptz | When kit was dispatched to customer |

### `lab_results`
Raw lab webhook payload + metadata. Created by `/api/jobs/process-result`. (Schema originally shaped for Thriva payloads; Vitall payload format pending verification.)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `order_id` | uuid FK → kit_orders | |
| `user_id` | uuid FK → users | Denormalised for RLS performance |
| `kit_type` | kit_type | |
| `raw_payload` | jsonb | Full lab webhook body (Vitall) |
| `received_at` | timestamptz | |

### `biomarker_values`
Normalised biomarker data extracted from `lab_results.raw_payload`. One row per marker per result.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `result_id` | uuid FK → lab_results | |
| `marker_name` | text | e.g. `total_testosterone`, `vitamin_d`, `hs_crp` |
| `value` | numeric(12,4) | |
| `unit` | text | e.g. `nmol/L`, `pmol/L`, `mg/L` |
| `reference_low` | numeric(12,4) | Lab reference range lower bound |
| `reference_high` | numeric(12,4) | Lab reference range upper bound |

**Andro Prime classification thresholds are in `lib/results/classifier.ts` — not stored in the DB.** Thresholds require Ewa's written sign-off before changing.

### `symptom_answers`
Pre-order symptom quiz responses. Collected at test selector / kit order flow.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `order_id` | uuid FK → kit_orders | |
| `question_key` | text | e.g. `fatigue`, `joint_pain`, `libido` |
| `answer` | jsonb | Free-form or structured answer |

Unique constraint on `(order_id, question_key)`.

### `qualifier_responses`
Post-result questions shown on the results dashboard (e.g. joint symptoms qualifier for collagen recommendation). API: `POST /api/results/qualifier`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `result_id` | uuid FK → lab_results | |
| `question_key` | text | e.g. `joint_symptoms_confirmed` |
| `answer` | jsonb | |

Unique constraint on `(result_id, question_key)`.

### `supplement_subscriptions`
Active and historical supplement subscriptions. Created by Stripe webhook.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `stripe_subscription_id` | text unique | |
| `product_slug` | text | `daily-stack`, `collagen`, `complete-mens-stack` |
| `status` | subscription_status | Updated by Stripe webhooks |
| `started_at` | timestamptz | |

### `founding_member_deposits`
£75 refundable deposits. Created by Stripe webhook on deposit checkout completion.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `stripe_payment_intent` | text unique | |
| `paid_at` | timestamptz | |
| `status` | deposit_status | Default `pending` |

**Trigger:** 40+ paid deposits → begin CQC application. Tracked in KPI dashboard.

### `lifecycle_events`
Audit log of all Customer.io events emitted from the platform. Used for compliance log and KPI reporting.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `event_name` | text | e.g. `purchase`, `result_received`, `waitlist_signup` |
| `payload` | jsonb | |
| `emitted_at` | timestamptz | |

Indexed on `(event_name, emitted_at desc)` for dashboard queries.

### `content_review_log`
Ewa's content compliance audit trail. Required by blueprint Section 7.6 before launch. Every piece of Mode-A-adjacent content must be logged here before publishing.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `title` | text | Content title |
| `content_type` | text | `landing_page`, `email`, `social_post`, `blog`, `supplement_label`, `other` |
| `channel` | text | `linkedin`, `email`, `website`, `youtube`, `instagram`, null |
| `submitted_by` | uuid FK → users | Keith's user ID |
| `submitted_at` | timestamptz | |
| `reviewer_name` | text | Default `Dr Ewa Lindo` |
| `reviewed_at` | timestamptz | |
| `status` | content_review_status | Default `submitted` |
| `notes` | text | Reviewer comments |
| `clickup_task_id` | text | Reference to ClickUp review task |
| `content_url` | text | Link to draft (Google Doc, staging URL) |

---

## Row-Level Security

All tables have RLS enabled. Authenticated users can only read their own rows. Writes (inserts, updates) are performed by API routes using the service role admin client (`lib/supabase/admin.ts`), which bypasses RLS.

---

## Triggers

- `set_updated_at` — fires before update on every table, sets `updated_at = now()`
- `handle_auth_user_change` — fires after insert/update on `auth.users`, upserts into `public.users`

---

## Migrations

| File | Phase | Description |
|------|-------|-------------|
| `20260416_phase_04_auth_foundation.sql` | Phase 4 | Core schema: all tables except content_review_log |
| `20260420_phase_08_content_review_log.sql` | Phase 8 | Content review audit table for Ewa's compliance workflow |
