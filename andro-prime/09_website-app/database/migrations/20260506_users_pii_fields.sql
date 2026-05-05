begin;

alter table public.users
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists phone text,
  add column if not exists date_of_birth date,
  add column if not exists sex text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists address_city text,
  add column if not exists address_postal_code text,
  add column if not exists address_country text default 'GB';

alter table public.users
  drop constraint if exists users_sex_check;

alter table public.users
  add constraint users_sex_check
  check (sex is null or sex in ('male', 'female'));

alter table public.users
  drop constraint if exists users_dob_18_plus_check;

alter table public.users
  add constraint users_dob_18_plus_check
  check (date_of_birth is null or date_of_birth <= (current_date - interval '18 years'));

create index if not exists idx_users_postal_code on public.users (address_postal_code);

commit;
