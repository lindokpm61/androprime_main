-- 2026-08-04: pin the `order_seq` sequence FLOOR, not just its current value.
--
-- Companion to 20260804_kit_orders_order_seq.sql, which ends with
-- `alter column order_seq restart with 10000`. `restart with N` moves the
-- sequence's current value but does not necessarily move `start_value`, so a
-- later bare `alter ... restart` (no WITH) resets to whatever `start_value`
-- happens to be. If that floor were still 1, the next real customer would be
-- handed AP-1, which both collides with the backfilled internal test rows and
-- reads like one.
--
-- Idempotent and already true in production at the time of writing
-- (`select start_value from pg_sequences where sequencename =
-- 'kit_orders_order_seq_seq'` returns 10000). This file exists so a fresh
-- database reproduces that floor from the migration set alone.
--
-- LEDGER NOTE: `supabase_migrations.schema_migrations` holds MORE 2026-08-04
-- kit_orders entries than this directory holds files. Two sessions applied the
-- same idempotent DDL concurrently, so the ledger carries both an unprefixed and
-- a `20260804_`-prefixed row for `kit_orders_is_test`, `kit_orders_order_seq` and
-- the KPI-view reapply, plus a `kit_orders_order_seq_start` row that this file is
-- the record of. Every statement involved is `if not exists` / `create or replace`
-- / idempotent DDL, and the resulting schema was verified by query, not inferred.
-- Do not try to reconcile the ledger by deleting rows.

alter table public.kit_orders
  alter column order_seq set start with 10000;
