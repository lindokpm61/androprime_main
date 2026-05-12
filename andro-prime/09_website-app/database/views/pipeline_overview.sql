-- KPI dashboard views. Apply with: psql -f views/pipeline_overview.sql
-- These are read-only views using the service role — not exposed to RLS users.
--
-- NOTE 2026-05-12: This view reads from `founding_member_deposits` (FROZEN 2026-05-08).
-- The deposit-related columns will reflect historical state only. Going forward,
-- founding-member metrics should be computed from `founding_member_list`. Plan: update
-- this view to include the new table once the metrics design is finalised.

-- ─── Kit pipeline overview ────────────────────────────────────────────────────
create or replace view public.v_kit_pipeline as
select
  ko.kit_type,
  ko.status,
  count(*) as order_count,
  date_trunc('week', ko.ordered_at) as week_start
from public.kit_orders ko
group by ko.kit_type, ko.status, week_start
order by week_start desc, ko.kit_type;

-- ─── Founding member deposit summary ─────────────────────────────────────────
create or replace view public.v_deposit_summary as
select
  count(*) filter (where status = 'paid')        as total_paid,
  count(*) filter (where status = 'pending')     as total_pending,
  count(*) filter (where status = 'refunded')    as total_refunded,
  sum(case when status = 'paid' then 75 else 0 end) as total_revenue_gbp
from public.founding_member_deposits;

-- ─── Active supplement MRR ────────────────────────────────────────────────────
create or replace view public.v_supplement_mrr as
select
  product_slug,
  count(*) as active_subscribers,
  case product_slug
    when 'daily-stack'        then count(*) * 34.95
    when 'collagen'           then count(*) * 29.95
    when 'complete-mens-stack' then count(*) * 54.95
    else 0
  end as mrr_gbp
from public.supplement_subscriptions
where status = 'active'
group by product_slug;

-- ─── Weekly kit sales by type ─────────────────────────────────────────────────
create or replace view public.v_weekly_kit_sales as
select
  date_trunc('week', ordered_at) as week_start,
  kit_type,
  count(*) as units_sold
from public.kit_orders
where status not in ('cancelled', 'refunded')
group by week_start, kit_type
order by week_start desc;

-- ─── Result-to-supplement conversion rate ────────────────────────────────────
-- Counts distinct users who have both a completed result and an active subscription.
create or replace view public.v_result_to_supplement_conversion as
select
  lr.kit_type,
  count(distinct lr.user_id) as users_with_result,
  count(distinct ss.user_id) as users_with_subscription,
  round(
    100.0 * count(distinct ss.user_id) / nullif(count(distinct lr.user_id), 0),
    1
  ) as conversion_pct
from public.lab_results lr
left join public.supplement_subscriptions ss
  on ss.user_id = lr.user_id
  and ss.status = 'active'
group by lr.kit_type;

-- ─── Gate 0 tracker ──────────────────────────────────────────────────────────
-- Single-row view of all gate criteria for the ops dashboard.
create or replace view public.v_gate_tracker as
select
  -- Gate 0A: 50+ total kits AND 25+ founding deposits by Week 6
  (select count(*) from public.kit_orders where status != 'cancelled') as total_kits_sold,
  (select count(*) from public.founding_member_deposits where status = 'paid') as total_deposits_paid,
  -- Gate 0B: 10%+ of Kit 2/3 buyers converting to subscription
  (select conversion_pct from public.v_result_to_supplement_conversion
   where kit_type in ('energy-recovery', 'hormone-recovery')
   limit 1) as kit23_to_sub_conversion_pct,
  -- Gate 0C: 150+ kits, 30+ active subs, MRR > £1,000
  (select coalesce(sum(mrr_gbp), 0) from public.v_supplement_mrr) as supplement_mrr_gbp,
  (select count(*) from public.supplement_subscriptions where status = 'active') as active_sub_count;
