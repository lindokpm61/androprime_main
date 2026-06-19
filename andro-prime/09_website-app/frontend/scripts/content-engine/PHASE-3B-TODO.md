# Content Engine — Phase 3b TODO

Working checklist for the remaining autonomous-pipeline build. Phases 1, 2, 3a and the
3b **Signoff-Concierge** are done/merged (`8b3a26d`). Stages below refer to
`content_pipeline.stage`; gates are the human stops (G1 Keith, G2 Ewa, G3 re-opt).

Pipeline:
`keyword_selected → briefed → brief_ready → drafted → in_review → approved → scheduled → published → reoptimising`

Built so far: **Draft-Writer** (`brief_ready → drafted`) + **Signoff-Concierge** (`drafted → in_review`) + **orchestrator** (`in_review → approved → published`). The orchestrator tick now runs draft-writer → signoff-concierge → syncApprovals → publishDue.

---

## A. Close the loop end-to-end (highest leverage)

- [x] **Draft-Writer** — `brief_ready → drafted`. DONE. Deterministic **ingest** of an
  `/article`-produced MDX draft (authorship stays in `/article`: LLM + human source/voice/
  compliance judgement is not run headless). Derives the draft path from `brief_ref`
  (`…/article-briefs/X.md → …/article-drafts/X.mdx`), pre-gates (no unknown MDX components,
  no unresolved citation placeholders; full real-render gate still runs in the concierge),
  `upsert_blog_article(status='draft', editor='draft-writer')`, flips `stage='drafted'`.
  Idempotent, `--dry`, wired as tick step 0. E2E-verified (brief_ready → drafted, revision +
  article_id + agent_runs; idempotent re-tick). `draft-writer.ts`.
- [ ] **Schedule the daily tick in a cloud runtime** — orchestrator only runs via local
  `tsx` today. Choose runner (cron / GitHub Actions / Supabase scheduled fn), provision the
  5 secrets (`SUPABASE_SERVICE_ROLE_KEY`, `CLICKUP_API_TOKEN`, `REVALIDATE_SECRET`,
  `PREVIEW_SECRET`, `CONTENT_ENGINE_BASE_URL`), point `CONTENT_ENGINE_BASE_URL` at prod.
- [ ] **Rotate `CLICKUP_API_TOKEN`** — shared in chat 2026-06-19. Do regardless of the rest.

## B. Automate the top of the funnel

- [ ] **Brief-Architect** — `briefed → brief_ready`. LLM stage: `keyword_queue` row / hub-spoke
  slot → 21-section brief file (`brief_ref`), then stops at **G1 (Keith)**.
- [ ] **Keyword-Scout** — populates `keyword_queue` (DataForSEO → candidate → accepted);
  coverage bookkeeping in the DB, not `keywords.csv`. Top of funnel.

## C. Measurement + ops hygiene

- [ ] **Weekly digest** — reads `agent_runs`, leads with "N items errored", surfaces what's
  parked on each gate (`blocked_on`). No failure stays silent.
- [ ] **Measurement-Analyst** — `published →` rankings / AI-citations / conversions from
  GSC + GA4. Gated on GSC data maturity (**~July**).
- [ ] **Retire the n8n content-review path** — pull-model orchestrator replaces
  `automations/n8n/workflows/content-review-trigger.json`; remove the duplicate mechanism.

---

*Order = build A first (closes the loop), then B (fills the funnel), then C (measures it).*
