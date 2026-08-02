-- ═══════════════════════════════════════════════════════════════════════════════════════════
-- Business approval gets a home in the database. Phase 1, applied 2026-08-01.
--
-- WHY THIS EXISTS, AND WHY IT IS A SEPARATE FILE FROM THE GUARDS MIGRATION.
-- It was not planned. Phase 1's split listed `approved_by` and `approved_date` as
-- DATABASE-OWNED and therefore due for deletion from asset frontmatter, and `content_assets`
-- had neither column. A validation agent caught it BEFORE the stripper ran: the split named two
-- fields the authoritative store could not hold, so stripping would have deleted the only record
-- of Keith's business approval of `four-things-on-the-sheet` into nowhere.
--
-- It is exactly the failure the phase exists to end, produced by the phase itself: a fact with
-- no single home. One file, two values, and it would have been silent.
--
-- THE ASYMMETRY WITH ewa_signed_at IS DELIBERATE AND IS THE POINT.
-- `ewa_signed_at` is protected by a trigger, because Ewa's sign-off is RESOLVED BY A SYSTEM (her
-- ClickUp task) and must be recorded by that same system in the same write: that is the direct
-- fix for the dead `TODO Ewa` markers, where a human typed a claim about a state a system owned.
-- `approved_by` is the opposite case: Keith's approval to ship is a human act with no system
-- behind it, so a human recording it by hand IS the system of record. Protecting it would be
-- ceremony, and worse, it would imply a sync exists that does not.
--
-- Deliberately NOT added to the approval CHECK constraint. Twelve of the thirteen approved
-- assets predate the convention and carry no `approved_by`; requiring it would either reject
-- them or invite a backfill of invented names, and inventing an approver is the same class of
-- error as inventing a sign-off date. The column records the approval where it was recorded.
-- Tightening it into a gate is a separate decision, for Keith, on a day when the data supports it.
-- ═══════════════════════════════════════════════════════════════════════════════════════════

alter table content_assets
  add column if not exists approved_by text,
  add column if not exists approved_at date;

comment on column content_assets.approved_by is
  'Who gave the BUSINESS approval to ship this asset (plan section 6: "Keith''s approval to ship. '
  'One human decision before anything reaches the public"). Distinct from ewa_signed_at, which is '
  'the CLINICAL sign-off. Deliberately NOT protected by a write trigger, unlike ewa_signed_at: '
  'Keith''s approval is a human act recorded by hand, whereas Ewa''s is resolved by a system (her '
  'ClickUp task) and must therefore be recorded by that same system.';

comment on column content_assets.approved_at is
  'Date of the business approval named in approved_by. NULL is normal: only assets whose approval '
  'was explicitly recorded carry it, and most predate the convention.';

-- The single row that had these values in frontmatter, moved rather than lost.
-- Named explicitly rather than swept, because there is exactly one and a blanket UPDATE here
-- would be a licence to invent approvals for the other twelve.
update content_assets
   set approved_by = 'Keith', approved_at = date '2026-07-31'
 where slug = 'four-things-on-the-sheet'
   and approved_by is null;
