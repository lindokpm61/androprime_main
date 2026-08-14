-- 2026-08-14: stop the anon key being able to rewrite or publish blog articles.
--
-- THE EXPOSURE. Three SECURITY DEFINER functions were EXECUTE-able by `anon`:
--
--   upsert_blog_article(text, blog_article_status, text, jsonb, jsonb, text)
--   stage_blog_revision(text, text, jsonb, jsonb, text)
--   promote_proposed_revision(text)
--
-- `anon` is the role behind NEXT_PUBLIC_SUPABASE_ANON_KEY, which ships inside the browser
-- bundle on every page load. So anyone who opened the site could read that key and POST to
-- /rest/v1/rpc/upsert_blog_article to overwrite or publish ANY blog body, including copy that
-- Ewa has signed off clinically. SECURITY DEFINER means the function runs with the definer's
-- rights, so row-level security does not stand in the way of it.
--
-- Found 2026-08-14 by `get_advisors`, then confirmed independently with
-- `has_function_privilege` rather than taken on the linter's word.
--
-- WHY IT IS SAFE TO REVOKE, verified before running rather than assumed:
--
--   1. Every caller in this repo goes through `admin()` in scripts/content-engine/_shared.ts,
--      which authenticates with SUPABASE_SERVICE_ROLE_KEY. `service_role` keeps EXECUTE below.
--      Callers: draft-writer.ts, orchestrator.ts, stage-reopt.ts, scripts/import-blog-to-db.ts.
--   2. No browser or route code calls them. `grep` over app/ and components/ returns nothing;
--      the only other mention is the generated type definitions.
--   3. The grants are EXPLICIT per-role, not the PostgreSQL default of EXECUTE to PUBLIC, so a
--      revoke from these two roles actually removes the access rather than being masked by a
--      PUBLIC grant that remains. Checked: proacl was
--      {postgres=X/postgres, anon=X/postgres, authenticated=X/postgres, service_role=X/postgres}.
--
-- `authenticated` is revoked as well as `anon`. A signed-in customer has no business rewriting
-- an article either, and leaving it would mean the exposure returns the moment the site gains a
-- logged-in surface that leaks a session token.
--
-- THE TARGET SHAPE ALREADY EXISTS IN THIS DATABASE. `record_ewa_signoff` is granted to
-- `postgres` and `service_role` only, which is why it was never flagged. After this migration the
-- three functions above match it exactly. That it was done correctly once suggests these three
-- were an oversight rather than a decision.
--
-- ROLLBACK, should a legitimate anon caller ever be discovered:
--   grant execute on function public.upsert_blog_article(text, public.blog_article_status, text, jsonb, jsonb, text) to anon;
-- and likewise for the others. Prefer routing the call through a server route holding the
-- service-role key instead: these three write the article store, and nothing that writes the
-- article store should be reachable from a browser.

revoke execute on function
  public.upsert_blog_article(text, public.blog_article_status, text, jsonb, jsonb, text)
  from anon, authenticated;

revoke execute on function
  public.stage_blog_revision(text, text, jsonb, jsonb, text)
  from anon, authenticated;

revoke execute on function
  public.promote_proposed_revision(text)
  from anon, authenticated;
