-- ═══════════════════════════════════════════════════════════════════════════════════════════
-- Close the INSERT hole in the ewa_signed_at guard. 2026-08-02.
--
-- WHY THIS EXISTS, AND IT IS NOT A FLATTERING REASON.
-- `20260801_content_state_guards.sql` argues at length that "a gate you can arrive at without
-- passing through it is not a gate", drops an UPDATE-only trigger for exactly that reason, and
-- widens `gate_rendition_publish` to fire on INSERT. It then leaves its own
-- `content_assets_ewa_signed_at_guard` firing BEFORE UPDATE only. Found by an adversarial
-- validation pass on 2026-08-02, in the file that made the argument.
--
-- THE HOLE, CONCRETELY. `content_assets_approval_gate` accepts `approved` on the net-new path
-- when `preflight = 'amber-ewa'` AND `ewa_signed_at is not null`. The CHECK trusts that column
-- to mean "Ewa actually ruled". The trigger existed to make that trust earned, by ensuring only
-- the sign-off sync writes it. But an INSERT never invoked the trigger, so a single INSERT
-- carrying `preflight='amber-ewa'`, `ewa_signed_at=now()`, `status='approved'` walked through
-- both the trigger and the CHECK and produced an approved asset whose clinical sign-off was
-- typed by whoever wrote the INSERT. That is the dead `TODO Ewa` marker failure with the
-- database believing it, which is the precise thing this guard was built to prevent.
--
-- Applied as ledger version `20260802003954 ewa_signed_at_insert_guard`. It supersedes SECTION 3
-- of `20260801_content_state_guards.sql`, which now says so in its own header; that file is left
-- otherwise unchanged, because rewriting an applied migration hides the fact that it ran in its
-- weaker form. Replay of `database/migrations/` in filename order reaches this version.
--
-- OLD is not assigned in a BEFORE INSERT trigger, so the condition has to branch on TG_OP
-- rather than reuse the UPDATE comparison. That asymmetry is the whole reason the original was
-- written UPDATE-only, and it is not a good enough reason.
-- ═══════════════════════════════════════════════════════════════════════════════════════════

create or replace function content_assets_protect_ewa_signed_at()
returns trigger
language plpgsql
as $$
declare
  sanctioned boolean := coalesce(current_setting('app.ewa_sync', true), '') = 'on';
  changed    boolean;
begin
  -- An INSERT that arrives already carrying a sign-off is asserting a ruling, exactly as an
  -- UPDATE that sets one does. Treat them the same.
  if tg_op = 'INSERT' then
    changed := new.ewa_signed_at is not null;
  else
    changed := new.ewa_signed_at is distinct from old.ewa_signed_at;
  end if;

  if changed and not sanctioned then
    raise exception
      'ewa_signed_at is written only by the sign-off sync, never by hand (asset %, via %). The '
      'system that resolves the sign-off records it, in the same write. If you are that sync, run '
      'set local app.ewa_sync = ''on'' inside your transaction.', new.slug, tg_op
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists content_assets_ewa_signed_at_guard on content_assets;
create trigger content_assets_ewa_signed_at_guard
  before insert or update on content_assets
  for each row execute function content_assets_protect_ewa_signed_at();
