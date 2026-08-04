-- 2026-08-04: mark internal test orders so they stop counting as sales.
--
-- Until now nothing in `kit_orders` distinguished an internal process test from a
-- real purchase, so the three rows placed while wiring up Stripe -> Vitall were
-- counted by every KPI view (`v_gate_tracker.total_kits_sold` in particular).
-- Gate 0A is "50+ kits by Week 6"; starting that count at 3 fake sales is a
-- silently wrong number that only gets harder to unpick as real orders arrive.

alter table public.kit_orders
  add column if not exists is_test boolean not null default false;

comment on column public.kit_orders.is_test is
  'Internal test / process-verification order, not a sale. Excluded from every revenue and gate KPI view. Set by hand; nothing in the app writes it.';

-- Partial index: the flagged set stays tiny, the false set is the whole table.
create index if not exists idx_kit_orders_is_test
  on public.kit_orders (is_test)
  where is_test;

-- The only three rows in the table at the time of this migration are internal
-- tests, matched by their Vitall order ids so this is a no-op anywhere the rows
-- do not exist. No external customer had purchased as of 2026-08-04.
--   322942444  2026-06-25  cancelled
--   322942529  2026-06-25  dispatched
--   322947256  2026-08-04  dispatched (Kit 1 end-to-end process test)
update public.kit_orders
   set is_test = true
 where vitall_order_id in ('322942444', '322942529', '322947256');
