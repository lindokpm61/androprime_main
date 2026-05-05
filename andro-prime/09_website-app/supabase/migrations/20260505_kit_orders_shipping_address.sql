alter table public.kit_orders
  add column if not exists shipping_address jsonb;
