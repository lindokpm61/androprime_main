-- 2026-08-05: the sign-off sync that three migrations and five docs already assumed existed.
--
-- `20260801_content_state_guards.sql` gates `content_assets.status = 'approved'` behind one of
-- two routes, and the second is `preflight = 'amber-ewa'` AND `ewa_signed_at is not null`.
-- `20260802_ewa_signed_at_insert_guard.sql` then protects that column with a trigger whose
-- error message says the value is "written only by the sign-off sync", and offers that sync a
-- sanctioned path: `set local app.ewa_sync = 'on'`.
--
-- **No such sync existed for `content_assets`.** Verified 2026-08-04 three ways: `signoff-concierge.ts`
-- contains zero references to `content_assets` (it serves `blog_articles` / `content_pipeline`,
-- the article spine), the orchestrator's `syncApprovals()` is the same, and `app.ewa_sync` appeared
-- in no code anywhere in the repo. Every other occurrence of `ewa_signed_at` outside these
-- migrations was a reader, a TypeScript type, a comment, or a test fixture.
--
-- **So the amber-ewa route was a one-way door.** An asset that went to Ewa could never reach
-- `approved`, however she ruled, because nothing was permitted to write the column the CHECK
-- constraint requires. Found when she ruled on four Pillar E social assets on 2026-08-04 and one
-- of them, `what-time-was-it-taken`, could not advance despite an unambiguous approval.
--
-- This function is that missing writer. `scripts/content-engine/signoff-sync.ts` is its only
-- caller.
--
-- ── The split of responsibility, because it is the whole design ──────────────────────────────
--
-- This function is the AUTHORISED WRITER. It cannot reach the network, so it cannot know whether
-- Ewa actually completed anything; it only holds the privilege to write.
--
-- The SCRIPT is the EVIDENCE GATHERER. It reads the ClickUp task named in `ewa_task`, applies
-- `isApproved()` (status 'complete' AND every rulings-checklist item ticked, the rule added after
-- the andropause hub was approved with two questions never answered), and only then calls here.
--
-- Neither half is sufficient alone and that is deliberate. Do not add a second caller without
-- reproducing the evidence check, and do not weaken the evidence check to make a call succeed.

begin;

create or replace function public.record_ewa_signoff(
  p_slug      text,
  p_signed_at timestamptz default now()
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_signed timestamptz;
begin
  if p_slug is null or btrim(p_slug) = '' then
    raise exception 'record_ewa_signoff: slug is required';
  end if;

  -- The trigger's sanctioned path, and the reason this function exists at all. `true` scopes the
  -- setting to the current transaction, so it cannot leak into an unrelated later statement on a
  -- pooled connection.
  perform set_config('app.ewa_sync', 'on', true);

  update public.content_assets
     set ewa_signed_at = p_signed_at
   where slug = p_slug
     -- Idempotent by construction: a second run is a no-op rather than a re-stamp. The FIRST
     -- recorded signature is the one with the audit trail behind it, so it is never overwritten.
     and ewa_signed_at is null
     -- There must be a review task to have been completed. A slug with no `ewa_task` has no
     -- evidence anywhere, so signing it would record a clinical sign-off that never happened.
     and ewa_task is not null
  returning ewa_signed_at into v_signed;

  -- NULL is a real answer here and the caller distinguishes it: no such slug, already signed, or
  -- no review task. It is deliberately not an exception, because "already signed" is the normal
  -- state on every re-run and an idempotent sync must not fail on it.
  return v_signed;
end;
$$;

comment on function public.record_ewa_signoff(text, timestamptz) is
  'The sign-off sync''s authorised write of content_assets.ewa_signed_at, holding the app.ewa_sync setting the guard trigger requires. Called only by scripts/content-engine/signoff-sync.ts, which supplies the evidence (a completed ClickUp review task with no unresolved rulings). Idempotent: never overwrites an existing signature, and refuses a slug with no ewa_task.';

-- Not callable by the public API roles. The guard is a speed bump rather than a security boundary
-- (the service role can write the column directly either way), but an RPC reachable from an anon
-- key would turn it into a hole rather than a bump.
revoke all on function public.record_ewa_signoff(text, timestamptz) from public;
revoke all on function public.record_ewa_signoff(text, timestamptz) from anon;
revoke all on function public.record_ewa_signoff(text, timestamptz) from authenticated;
grant execute on function public.record_ewa_signoff(text, timestamptz) to service_role;

commit;
