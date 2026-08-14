-- Content media bucket (plan step 3.3, gate D3 ruled 2026-08-14).
--
-- D3's one-line rule: git holds the recipe, Drive holds what humans touch, Storage holds what a
-- machine publishes from, and the database holds only the URI. This is the Storage half.
--
-- PUBLIC IS THE POINT AND PUBLIC IS THE HAZARD. Metricool ingests media by fetching a URL at
-- schedule time, unauthenticated, so the bucket has to be readable by anyone who has the path.
-- That same property means anything landing in here is permanent, CDN-cached and crawlable. For a
-- business heading into CQC, the rule about what may never enter it ships WITH the bucket rather
-- than after it: 03_compliance/CONTEXT.md, "Public media bucket".
--
-- Three controls, deliberately at three different layers, because a rule that only exists as prose
-- is enforced by whoever remembers it:
--
--   1. allowed_mime_types (here)      — refuses the dangerous class at upload. A results PDF is
--                                       application/pdf and cannot be written to this bucket at
--                                       all, by any caller, including the service role.
--   2. no RLS policies (here)         — storage.objects has RLS enabled and this migration adds no
--                                       policy, so anon and authenticated can neither write nor
--                                       LIST. Only the service role (which bypasses RLS) writes.
--                                       Public download is a separate route that does not consult
--                                       RLS, which is why reads still work with zero policies.
--   3. doctor invariant I11 (code)    — every object must match the path convention and belong to a
--                                       known content asset. Catches what a mime type cannot see:
--                                       a correctly-typed PNG that is nonetheless a biomarker chart.
--
-- PATH CONVENTION: <asset-slug>/<kind>-<sha256[0:8]>.<ext>
--
-- The eight-hex content hash is not cache-busting, it is the embargo. Slugs are published in the
-- content queue and the run calendar, so <slug>/slide-03.png is guessable by anyone who reads the
-- plan, and thirty carousels sit in this bucket for up to thirty days before their slot. Listing is
-- already denied by control 2; the hash closes the guess. It also makes a re-render idempotent: the
-- same bytes resolve to the same URL, and different bytes cannot silently occupy the old one.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content',
  'content',
  true,
  52428800,  -- 50 MB: the free-tier project ceiling, not a considered editorial limit. Long-form
             -- video (~500 MB/month projected) does NOT fit and must not be forced through here
             -- until D3b is bought and this is raised deliberately.
  array['image/png', 'image/jpeg', 'video/mp4']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- No policies are created on storage.objects for this bucket. That is the control, not an omission.
-- If a future step needs authenticated write, add a policy scoped to bucket_id = 'content' and a
-- specific role; never widen it to `using (true)`, and never add a select policy, because a select
-- policy is what turns "unguessable" into "enumerable".
