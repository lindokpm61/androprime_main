begin;

alter table public.kit_orders
  add column if not exists kit_activated_at timestamptz;

drop policy if exists "kit_orders_update_own_activate" on public.kit_orders;
create policy "kit_orders_update_own_activate"
on public.kit_orders
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

commit;
