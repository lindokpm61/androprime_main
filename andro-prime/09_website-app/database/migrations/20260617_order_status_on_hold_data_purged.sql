-- Add 'on_hold' and 'data_purged' to the order_status enum.
--
-- Ben Starling (Vitall, 2026-06-16) confirmed the live webhook occasionally
-- POSTs these lifecycle statuses in addition to the main sequence:
--   * 'order-on-hold'   → 'on_hold'      — manual correction needed (e.g. an
--                                           address formatting issue)
--   * 'order-cancelled' → 'cancelled'    — already in the enum; now wired in the
--                                           webhook STATUS_MAP
--   * 'data-purged'     → 'data_purged'  — a GDPR erasure request was run on the
--                                           lab side. The webhook records this for
--                                           our audit trail and marks the order; it
--                                           does NOT cascade-delete our own retained
--                                           copy (separate, deliberate process).
--
-- Additive + safe: new enum labels only, no data change. ADD VALUE IF NOT EXISTS
-- so the migration is idempotent.
alter type public.order_status add value if not exists 'on_hold';
alter type public.order_status add value if not exists 'data_purged';
