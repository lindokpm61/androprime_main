-- Plan step 6.3, second half: make "adding a platform is one row" true, instead of true of the gate
-- and false of the table.
--
-- WHAT THE FIRST HALF MISSED, found by actually attempting it rather than reasoning about it.
-- `20260818_generic_publish_gate.sql` moved the media requirement onto the channel row, and the
-- done-when test is the plan's own: "adding Pinterest is one row, one media requirement, board id
-- plus pin title, publisher metricool, and no code." Attempting exactly that got:
--
--   new row for relation "content_renditions" violates check constraint "content_renditions_format_check"
--
-- `format` was a hand-maintained enum of eleven values and `pin` was not among them. So a new
-- platform still cost a migration; the cost had simply moved out of the gate function and into a
-- CHECK constraint, where it was harder to see. `platform` already listed twelve values including
-- `pinterest`, which is the tell: the two lists were maintained by different hands at different
-- times and had already drifted apart.
--
-- THE FIX IS TO STOP KEEPING A SECOND LIST OF CHANNELS. `content_channels` already IS the list, it
-- already has a unique key on (platform, format), and every one of the 91 renditions already
-- resolves to a row in it. So the enum becomes a foreign key, and the question "is this a real
-- channel" gets exactly one answer in exactly one place.
--
-- WHAT THIS BUYS, precisely: adding a platform is now an INSERT into `content_channels` and nothing
-- else. A rendition on an unregistered channel stops being something a gate has to notice and
-- becomes something the database cannot represent.
--
-- ON DELETE RESTRICT: a channel carrying renditions cannot be deleted out from under them.
-- ON UPDATE CASCADE: renaming a channel's key moves its renditions with it, because the alternative
-- is a rename that cannot be completed without hand-editing the rows that point at it.
--
-- THE TRIGGER'S OWN "no channel row" REFUSAL STAYS, and is not made redundant by this. A BEFORE
-- trigger runs ahead of constraint checking, so on the scheduled path the trigger answers first with
-- a message that says what to do; the foreign key is what covers every other path, including a
-- rendition created at `to-produce`, which the trigger ignores entirely.

begin;

-- Proof before the fact, not after: if any rendition does not resolve to a channel, this migration
-- must fail here rather than half-apply.
do $$
declare orphans integer;
begin
  select count(*) into orphans
    from (select distinct platform, format from public.content_renditions) r
   where not exists (
     select 1 from public.content_channels c where c.platform = r.platform and c.format = r.format);
  if orphans > 0 then
    raise exception
      'REFUSING: % (platform, format) pair(s) in content_renditions have no content_channels row. Register them before this key can exist.', orphans;
  end if;
end $$;

alter table public.content_renditions
  drop constraint if exists content_renditions_platform_check;
alter table public.content_renditions
  drop constraint if exists content_renditions_format_check;

alter table public.content_renditions
  drop constraint if exists content_renditions_channel_fk;
alter table public.content_renditions
  add constraint content_renditions_channel_fk
  foreign key (platform, format)
  references public.content_channels (platform, format)
  on update cascade
  on delete restrict;

comment on constraint content_renditions_channel_fk on public.content_renditions is
  'Plan step 6.3. Replaces two hand-maintained enums (platform, format) that had already drifted apart: platform listed pinterest, format did not list pin. content_channels is the list of channels, so it is the only place a channel may be declared, and adding a platform is one row there and no code.';

commit;
