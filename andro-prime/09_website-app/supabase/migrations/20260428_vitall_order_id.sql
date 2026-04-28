begin;

alter table public.kit_orders
  add column if not exists vitall_order_id text unique;

create index if not exists idx_kit_orders_vitall_order_id
  on public.kit_orders (vitall_order_id);

commit;
