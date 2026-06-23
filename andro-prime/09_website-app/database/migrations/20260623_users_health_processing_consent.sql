-- Add an explicit wellness health-data processing consent stamp to users.
--
-- Task 34 (Half 1) / CA-018: the signup consent page now captures an explicit,
-- required Art 9(2)(a) consent to process the customer's health information
-- (their test results + the answers they provide) in order to deliver the
-- Phase 0 wellness test service. We store the VERSION of the consent copy the
-- customer agreed to, plus when they agreed, for Art 7(1) accountability — the
-- stored record must point at exactly the wording shown on screen
-- (HEALTH_PROCESSING_CONSENT_VERSION in lib/auth/consentVersions.ts).
--
-- Additive + safe: two nullable columns, no data change, idempotent.
alter table public.users
  add column if not exists health_processing_consent_version text,
  add column if not exists health_processing_consented_at timestamptz;
