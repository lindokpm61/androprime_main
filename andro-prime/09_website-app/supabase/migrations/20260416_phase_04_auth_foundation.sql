begin;

create extension if not exists pgcrypto;

create type public.kit_type as enum (
  'testosterone',
  'energy-recovery',
  'hormone-recovery'
);

create type public.order_status as enum (
  'pending',
  'paid',
  'dispatched',
  'sample_registered',
  'processing',
  'results_received',
  'cancelled',
  'refunded'
);

create type public.subscription_status as enum (
  'incomplete',
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'unpaid'
);

create type public.deposit_status as enum (
  'pending',
  'paid',
  'cancelled',
  'refunded'
);

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  age integer check (age is null or age >= 18),
  marketing_consent boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.kit_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  kit_type public.kit_type not null,
  stripe_payment_intent text unique,
  status public.order_status not null default 'pending',
  ordered_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sample_registrations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.kit_orders (id) on delete cascade,
  barcode text not null unique,
  registered_at timestamptz,
  dispatched_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.kit_orders (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  kit_type public.kit_type not null,
  received_at timestamptz not null default timezone('utc', now()),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.biomarker_values (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.lab_results (id) on delete cascade,
  marker_name text not null,
  value numeric(12, 4) not null,
  unit text not null,
  reference_low numeric(12, 4),
  reference_high numeric(12, 4),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.symptom_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  order_id uuid not null references public.kit_orders (id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  captured_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, question_key)
);

create table if not exists public.qualifier_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  result_id uuid not null references public.lab_results (id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  captured_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (result_id, question_key)
);

create table if not exists public.supplement_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  stripe_subscription_id text not null unique,
  product_slug text not null,
  status public.subscription_status not null default 'incomplete',
  started_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.founding_member_deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  stripe_payment_intent text unique,
  paid_at timestamptz,
  status public.deposit_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  emitted_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_kit_orders_user_id on public.kit_orders (user_id);
create index if not exists idx_lab_results_order_id on public.lab_results (order_id);
create index if not exists idx_lab_results_user_id on public.lab_results (user_id);
create index if not exists idx_biomarker_values_result_id on public.biomarker_values (result_id);
create index if not exists idx_symptom_answers_user_id on public.symptom_answers (user_id);
create index if not exists idx_symptom_answers_order_id on public.symptom_answers (order_id);
create index if not exists idx_qualifier_responses_user_id on public.qualifier_responses (user_id);
create index if not exists idx_qualifier_responses_result_id on public.qualifier_responses (result_id);
create index if not exists idx_supplement_subscriptions_user_id on public.supplement_subscriptions (user_id);
create index if not exists idx_founding_member_deposits_user_id on public.founding_member_deposits (user_id);
create index if not exists idx_lifecycle_events_user_id on public.lifecycle_events (user_id);
create index if not exists idx_lifecycle_events_name_emitted_at on public.lifecycle_events (event_name, emitted_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_auth_user_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do update
    set email = excluded.email,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email on auth.users
for each row
execute procedure public.handle_auth_user_change();

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_kit_orders_updated_at on public.kit_orders;
create trigger set_kit_orders_updated_at
before update on public.kit_orders
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_sample_registrations_updated_at on public.sample_registrations;
create trigger set_sample_registrations_updated_at
before update on public.sample_registrations
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_lab_results_updated_at on public.lab_results;
create trigger set_lab_results_updated_at
before update on public.lab_results
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_biomarker_values_updated_at on public.biomarker_values;
create trigger set_biomarker_values_updated_at
before update on public.biomarker_values
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_symptom_answers_updated_at on public.symptom_answers;
create trigger set_symptom_answers_updated_at
before update on public.symptom_answers
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_qualifier_responses_updated_at on public.qualifier_responses;
create trigger set_qualifier_responses_updated_at
before update on public.qualifier_responses
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_supplement_subscriptions_updated_at on public.supplement_subscriptions;
create trigger set_supplement_subscriptions_updated_at
before update on public.supplement_subscriptions
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_founding_member_deposits_updated_at on public.founding_member_deposits;
create trigger set_founding_member_deposits_updated_at
before update on public.founding_member_deposits
for each row
execute procedure public.set_updated_at();

alter table public.users enable row level security;
alter table public.kit_orders enable row level security;
alter table public.sample_registrations enable row level security;
alter table public.lab_results enable row level security;
alter table public.biomarker_values enable row level security;
alter table public.symptom_answers enable row level security;
alter table public.qualifier_responses enable row level security;
alter table public.supplement_subscriptions enable row level security;
alter table public.founding_member_deposits enable row level security;
alter table public.lifecycle_events enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "kit_orders_select_own" on public.kit_orders;
create policy "kit_orders_select_own"
on public.kit_orders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "sample_registrations_select_own" on public.sample_registrations;
create policy "sample_registrations_select_own"
on public.sample_registrations
for select
to authenticated
using (
  exists (
    select 1
    from public.kit_orders
    where public.kit_orders.id = sample_registrations.order_id
      and public.kit_orders.user_id = auth.uid()
  )
);

drop policy if exists "lab_results_select_own" on public.lab_results;
create policy "lab_results_select_own"
on public.lab_results
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "biomarker_values_select_own" on public.biomarker_values;
create policy "biomarker_values_select_own"
on public.biomarker_values
for select
to authenticated
using (
  exists (
    select 1
    from public.lab_results
    where public.lab_results.id = biomarker_values.result_id
      and public.lab_results.user_id = auth.uid()
  )
);

drop policy if exists "symptom_answers_select_own" on public.symptom_answers;
create policy "symptom_answers_select_own"
on public.symptom_answers
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "symptom_answers_insert_own" on public.symptom_answers;
create policy "symptom_answers_insert_own"
on public.symptom_answers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "symptom_answers_update_own" on public.symptom_answers;
create policy "symptom_answers_update_own"
on public.symptom_answers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "qualifier_responses_select_own" on public.qualifier_responses;
create policy "qualifier_responses_select_own"
on public.qualifier_responses
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "qualifier_responses_insert_own" on public.qualifier_responses;
create policy "qualifier_responses_insert_own"
on public.qualifier_responses
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "qualifier_responses_update_own" on public.qualifier_responses;
create policy "qualifier_responses_update_own"
on public.qualifier_responses
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "supplement_subscriptions_select_own" on public.supplement_subscriptions;
create policy "supplement_subscriptions_select_own"
on public.supplement_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "founding_member_deposits_select_own" on public.founding_member_deposits;
create policy "founding_member_deposits_select_own"
on public.founding_member_deposits
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "lifecycle_events_select_own" on public.lifecycle_events;
create policy "lifecycle_events_select_own"
on public.lifecycle_events
for select
to authenticated
using (auth.uid() = user_id);

commit;
