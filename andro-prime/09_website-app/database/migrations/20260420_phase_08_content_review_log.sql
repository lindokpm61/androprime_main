begin;

-- Content review log required by blueprint Section 7.6.
-- Every piece of Mode-A-adjacent content must be submitted to Ewa via ClickUp,
-- and every review must be logged here as an audit trail for CQC and ASA enquiries.

create type public.content_review_status as enum (
  'submitted',
  'approved',
  'rejected',
  'needs_revision'
);

create table if not exists public.content_review_log (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_type text not null,               -- 'landing_page' | 'email' | 'social_post' | 'blog' | 'supplement_label' | 'other'
  channel text,                              -- 'linkedin' | 'email' | 'website' | 'youtube' | 'instagram' | null
  submitted_by uuid references public.users (id) on delete set null,
  submitted_at timestamptz not null default timezone('utc', now()),
  reviewer_name text not null default 'Dr Ewa Lindo',
  reviewed_at timestamptz,
  status public.content_review_status not null default 'submitted',
  notes text,                                -- reviewer comments or revision instructions
  clickup_task_id text,                      -- reference to ClickUp task for the review
  content_url text,                          -- link to the draft content (Google Doc, staging URL, etc.)
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_content_review_log_status
  on public.content_review_log (status);

create index if not exists idx_content_review_log_submitted_at
  on public.content_review_log (submitted_at desc);

create index if not exists idx_content_review_log_submitted_by
  on public.content_review_log (submitted_by);

drop trigger if exists set_content_review_log_updated_at on public.content_review_log;
create trigger set_content_review_log_updated_at
before update on public.content_review_log
for each row
execute procedure public.set_updated_at();

alter table public.content_review_log enable row level security;

-- Only service role can insert/update (done via API routes, not client-side).
-- Authenticated users can read their own submitted items for status tracking.
drop policy if exists "content_review_log_select_own" on public.content_review_log;
create policy "content_review_log_select_own"
on public.content_review_log
for select
to authenticated
using (submitted_by = auth.uid());

commit;
