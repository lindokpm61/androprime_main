-- Development seed data. DO NOT run against production.
-- Creates a test user and representative fixture orders, results, and subscriptions
-- to allow the results dashboard, subscriptions page, and founding member screen
-- to be tested without real lab (Vitall) webhooks.
--
-- Usage:  psql $DATABASE_URL -f seeds/dev-fixtures.sql
--
-- The test user must already exist in auth.users (sign up via the app first),
-- then update the UUID below to match.

-- ─── Replace this UUID with your local dev user's auth.users id ───────────────
\set test_user_id '00000000-0000-0000-0000-000000000001'

-- ─── Kit orders ──────────────────────────────────────────────────────────────
insert into public.kit_orders (id, user_id, kit_type, stripe_payment_intent, status, ordered_at)
values
  ('a0000001-0000-0000-0000-000000000001', :'test_user_id', 'testosterone',    'pi_test_001', 'results_received', now() - interval '14 days'),
  ('a0000001-0000-0000-0000-000000000002', :'test_user_id', 'energy-recovery', 'pi_test_002', 'results_received', now() - interval '7 days')
on conflict (id) do nothing;

-- ─── Lab results ─────────────────────────────────────────────────────────────
insert into public.lab_results (id, order_id, user_id, kit_type, raw_payload, received_at)
values
  (
    'b0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    :'test_user_id',
    'testosterone',
    '{"orderId":"a0000001-0000-0000-0000-000000000001","userId":"00000000-0000-0000-0000-000000000001","kitType":"testosterone","results":[{"marker":"total_testosterone","value":11.2,"unit":"nmol/L"},{"marker":"shbg","value":42.0,"unit":"nmol/L"},{"marker":"fai","value":26.7,"unit":"%"},{"marker":"albumin","value":41.5,"unit":"g/L"},{"marker":"free_testosterone","value":0.198,"unit":"nmol/L"}]}'::jsonb,
    now() - interval '12 days'
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000002',
    :'test_user_id',
    'energy-recovery',
    '{"orderId":"a0000001-0000-0000-0000-000000000002","userId":"00000000-0000-0000-0000-000000000001","kitType":"energy-recovery","results":[{"marker":"vitamin_d","value":32.0,"unit":"nmol/L"},{"marker":"active_b12","value":28.5,"unit":"pmol/L"},{"marker":"hs_crp","value":2.8,"unit":"mg/L"},{"marker":"ferritin","value":45.0,"unit":"mcg/L"}]}'::jsonb,
    now() - interval '5 days'
  )
on conflict (id) do nothing;

-- ─── Biomarker values (Kit 1 — low T scenario) ───────────────────────────────
insert into public.biomarker_values (result_id, marker_name, value, unit, reference_low, reference_high)
values
  ('b0000001-0000-0000-0000-000000000001', 'total_testosterone', 11.2,  'nmol/L', 9.0,  29.0),
  ('b0000001-0000-0000-0000-000000000001', 'shbg',               42.0,  'nmol/L', 17.0, 56.0),
  ('b0000001-0000-0000-0000-000000000001', 'fai',                26.7,  '%',      35.0, 90.0),
  ('b0000001-0000-0000-0000-000000000001', 'albumin',            41.5,  'g/L',    35.0, 50.0),
  ('b0000001-0000-0000-0000-000000000001', 'free_testosterone',  0.198, 'nmol/L', 0.2,  0.62)
on conflict do nothing;

-- ─── Biomarker values (Kit 2 — multi-deficiency scenario) ────────────────────
insert into public.biomarker_values (result_id, marker_name, value, unit, reference_low, reference_high)
values
  ('b0000001-0000-0000-0000-000000000002', 'vitamin_d',   32.0, 'nmol/L', 50.0, 200.0),
  ('b0000001-0000-0000-0000-000000000002', 'active_b12',  28.5, 'pmol/L', 37.5, 188.0),
  ('b0000001-0000-0000-0000-000000000002', 'hs_crp',       2.8, 'mg/L',   0.0,   1.0),
  ('b0000001-0000-0000-0000-000000000002', 'ferritin',    45.0, 'mcg/L',  30.0, 300.0)
on conflict do nothing;

-- ─── Founding member deposit (low T triggers this) ────────────────────────────
insert into public.founding_member_deposits (id, user_id, stripe_payment_intent, paid_at, status)
values
  ('c0000001-0000-0000-0000-000000000001', :'test_user_id', 'pi_test_deposit_001', now() - interval '10 days', 'paid')
on conflict (id) do nothing;

-- ─── Supplement subscription (energy deficiency triggers this) ───────────────
insert into public.supplement_subscriptions (id, user_id, stripe_subscription_id, product_slug, status, started_at)
values
  ('d0000001-0000-0000-0000-000000000001', :'test_user_id', 'sub_test_001', 'daily-stack', 'active', now() - interval '5 days')
on conflict (id) do nothing;
