# Andro Prime

UK men's health business operating in two sequential modes under one customer-facing brand:

1. **Phase 0 — Wellness mode** (current): non-regulated diagnostic kits, supplement subscriptions, founding-member list opt-in (non-cash). Goal: self-sustaining profit centre that funds operations, validates PMF, and builds pre-qualified patient pipeline for clinical — all before CQC registration is complete.
2. **Post-CQC — Clinical mode** (not yet live): regulated intake, confirmatory testing, TRT subscription, clinical monitoring, add-ons.

This repository is the **operating system for the business**, not just a website or code repository. It contains strategy, brand, compliance, products, partners, marketing, sales, customer journey, website/app build, launch operations, and the post-CQC clinical plugin.

**Founders:** Keith Antony (founder, personal brand is a product feature) and Dr Ewa Lindo (GP, Harley Street TRT-trained, GMC-registered prescriber, signs off all results report copy).

---

## Core Principle

**Route to the correct workspace first. Read that workspace's CONTEXT.md (and its STATE.md, if present). Then work.**

Do not treat this as one flat project. Every top-level workspace has its own CONTEXT.md — read it before working in that directory.

---

## Workspace docs: CONTEXT.md (durable) vs STATE.md (volatile)

Each workspace's knowledge is split across two files by how fast it changes:

- **`CONTEXT.md` — durable.** Architecture, rules, routing, source-of-truth pointers, conventions. Changes rarely. Every workspace has one; it is the entry point.
- **`STATE.md` — volatile.** Dated, current status: what is live / verified / deployed / DRAFT / owed **right now** (a deploy, a campaign's running-vs-draft state, a sign-off, an open decision). Read it alongside CONTEXT.md when it exists.
- **Every `CONTEXT.md` ends with a `## Skills, tools & MCPs` section** listing the repo skills (invoked as `/name`), the relevant plugin skills, and the MCP servers / tools for that workspace's work. Include it when scaffolding a new workspace.

**Read rule:** on entering a workspace, read its `CONTEXT.md`, and its `STATE.md` if one exists.

**The STATE half needs a bounded form, or it gets skipped.** CONTEXT.md is an orientation doc with an obvious stopping point; a STATE.md can run past a thousand lines, so "read STATE.md" is open-ended and the expensive half of a two-part rule is the half that silently gets dropped. So the minimum is a **targeted query, not a full read**: before recommending or reporting on any named programme, channel, campaign, partner or feature, `grep -in "<subject>" <workspace>/STATE.md` and read the surrounding block. On 2026-08-20 the PT/affiliate engine was recommended as a primary route while `06_marketing/STATE.md` had recorded it FROZEN for ten weeks; CONTEXT.md was read, STATE.md was not.

**Write rule — file a fact by its half-life.** A durable rule → CONTEXT.md. A dated status ("verified 2026-XX-XX", "DRAFT", "deployed", "still owed") → STATE.md. **When your work changes live status (a deploy, activation, sign-off, or decision), update the owning workspace's STATE.md before you finish, and bump its `_Last updated:_` date.** Stale status is how drift starts. If you find live status accreting inside a CONTEXT.md, split it out into a STATE.md.

**Not every workspace has a STATE.md, and that is deliberate.** A workspace gets one only when it carries live status that moves independently of its code and docs. Omit it when the workspace is rules-only, future/not-live, or its status already lives elsewhere (a partner `*-negotiation-log.md`, the CIO/Stripe config, or ClickUp for launch tasks). A missing STATE.md means "status lives elsewhere or there is none yet," **not** "someone forgot."

**Sweep rule — a decision is not done until the doc layer is swept.** When a major decision lands (pricing, routing, thresholds, channel on/off, claims rule, entity/data change), run the **decision sweep** (`/decision-sweep`, defined in `.claude/skills/decision-sweep/SKILL.md`): find every doc still stating the superseded fact, update or SUPERSEDED-banner each one, and escalate approved/partner-facing copy for re-approval. Recording the decision in one place and implementing it in code is not enough — the 2026-07-05 audit traced every major repo contradiction to an unswept decision.

---

## Top-Level Workspaces

- `/01_strategy` — business model, roadmap, financial planning, entity structure
- `/02_brand` — brand guidelines, voice, messaging, visual identity
- `/03_compliance` — privacy, claims, approvals, governance, deposits
- `/04_products` — kits, supplements, pricing, thresholds, results-engine logic, ICPs
- `/05_partners` — labs, manufacturers, future clinical partners
- `/06_marketing` — campaigns, affiliates, content, AI/SEO, paid media, analytics
- `/07_sales` — funnel logic, lifecycle, CRM, email sequences, referral programme
- `/08_customer-journey` — pre-CQC and post-CQC journey, onboarding, support, retention
- `/09_website-app` — design system, frontend, backend, database, automations, deployment
- `/10_launch-ops` — implementation checklists, QA gates, dashboards, readiness reviews, Gate 0A/0B/0C tracking
- `/11_clinical-plugin_post-cqc` — regulated intake, consent, confirmatory testing, prescribing, monitoring, records governance
- `/12_operations` — ongoing steady-state operational cadences and SOPs (daily/weekly/monthly checks, email triage, Search Console and analytics monitoring, content-machine verification, billing/support, incident runbooks)

---

## Routing Table

For each task type, start in the workspace listed and read its `CONTEXT.md`.

| Task | Workspace |
| ---- | --------- |
| Business strategy, financial model, entity, roadmap, competitor research | `/01_strategy` |
| Brand voice, positioning, visual identity, copy voice rules | `/02_brand` |
| Any copy or marketing task involving health claims, supplements, kits, TRT, or the founding member programme | `/03_compliance` (read BEFORE drafting), then relevant workspace |
| Product specs, pricing, kit biomarkers, ICPs, results-engine logic, supplement formulation | `/04_products` |
| Lab or manufacturer evaluation, partner decisions | `/05_partners` |
| Campaigns, content, LPs, SEO, affiliates, paid media | `/06_marketing` |
| Funnel, lifecycle, CRM, email sequences, referral programme | `/07_sales` |
| Onboarding, support, retention, journey design | `/08_customer-journey` |
| Frontend, backend, database, design system, automations, deployment | `/09_website-app` |
| Weekly KPIs, dashboards, gate tracking, launch readiness, QA | `/10_launch-ops` |
| Post-CQC clinical process design | `/11_clinical-plugin_post-cqc` |
| Recurring day-to-day operations, email/GSC/analytics monitoring, content-machine checks, incident response | `/12_operations` |

---

## Non-Negotiable Guardrails

These apply to every task regardless of workspace. If in doubt, stop and route to compliance.

### 1. Read compliance CONTEXT.md before any external-facing copy

Before drafting ANY copy — email, landing page, ad, social post, affiliate brief, influencer talking points, results report, or internal doc that could become external — **read `/03_compliance/CONTEXT.md` first**. This is not optional. The file contains the Pre-Flight Checklist, EFSA approved claims, red-flag language, and the Phase 0 / post-CQC boundary rules. All copy-compliance logic lives there.

### 2. Respect the wellness / clinical split

Do not blur Phase 0 wellness operations with post-CQC regulated clinical operations. TRT, peptides, and clinical services are NOT currently available. If a task risks crossing the line, stop and route to `/03_compliance/CONTEXT.md` and/or `/11_clinical-plugin_post-cqc`. Full rules in the compliance CONTEXT.md.

### 3. Ashwagandha silent-ingredient rule

Ashwagandha KSM-66 is in the Daily Stack formulation but has no approved EFSA health claim. **Do not mention it in any copy, email, social post, affiliate brief, or influencer talking points — anywhere, ever.** If an affiliate makes a claim about it, the ASA complaint lands on Andro Prime. This rule is kept in the root file because a missing pointer to it is a business-ending error. Full affiliate briefing rules in `/03_compliance/CONTEXT.md`.

### 4. Compliance overrides persuasion

If copy, product, sales, or marketing goals conflict with compliance, compliance wins. Full rule precedence and regulatory framework (ASA, EFSA, UK GDPR, CQC, MHRA, Consumer Rights Act) in `/03_compliance/CONTEXT.md`.

### 5. Canonical site, LPs, and app stay separated

Inside `/09_website-app/frontend`, preserve the distinction between `canonical-site`, `lp`, and `app`. Different purposes. Do not merge casually.

---

## Tool and platform facts — know these BEFORE you act, not at wrap

Prevention rules. Each one has already cost a real failure *because it was filed
in `/wrap`, which loads only when the work is over*. The full procedures stay in
`/wrap`; these facts have to be in context at the moment they apply.

- **The Bash tool is POSIX sh, not PowerShell.** A PowerShell here-string
  (`@'…'@`) does not error there, it silently corrupts the string: the `@` leaks
  into a commit subject and costs a commit-and-amend. Use a heredoc, a
  single-line `-m`, or `git commit -F <file>`. Windows-style switches (`/Query`)
  passed through it get reinterpreted as filesystem paths.
- **Its working directory persists between calls.** A relative path that
  resolved correctly earlier can silently resolve somewhere else later and
  return empty output that reads as a genuine negative result. This rule has
  been in context and been walked into anyway, twice, because the moment of use
  is one argument inside a long command rather than a decision point anyone
  pauses at — so **make the shape of the command carry the guarantee** instead
  of relying on recall: any search meant to be repo-wide either `cd`s to the
  repo root **in the same call** or passes an absolute search path. Where a
  negative result would be load-bearing, echo the resolved working directory
  beside it, so the scope of the negative is visible in the output.
- **It is Git Bash (MSYS), which rewrites leading-slash ARGUMENTS into Windows
  paths before the program sees them.** `--dest /lp/testosterone` reached the
  script as `C:/Program Files/Git/lp/testosterone` and produced a live-looking
  but wrong CTA URL. Only shell-passed leading-slash args are affected, not
  in-script literals or full `http` URLs. Pass site paths without the leading
  slash, as a full URL, or prefix `MSYS_NO_PATHCONV=1`; and give any script that
  takes a path or URL a `--dry` that echoes what it resolved, because otherwise
  the mangling is invisible until it reaches output.
- **Text crossing a process boundary on Windows carries invisible passengers**,
  and each one surfaces as a confident error about something else. Split CLI
  output on a CR-tolerant newline and trim every field — parsing `psql` output on
  `\n` alone left a carriage return on the last column of every row, creating
  database roles with invisible characters in their names and making an unrelated
  restore look broken. Keep any string passed as a command-line argument to a
  database client **pure ASCII**: an em dash inside an SQL comment passed via
  `-c` was rejected as an invalid UTF8 byte sequence. And run a file-writing CLI
  with its cwd set to the intended output directory — the Workspace CLI errors on
  an absolute `--output` path and drops an empty `download.html` into the working
  directory on a rejected download, which lands in the repo.
- **Use the Write tool, not a heredoc, for any file containing backslashes,
  Windows paths or dense escaping.** A quoted heredoc through the Bash tool
  stripped every backslash from a Windows executable path, producing
  `spawn C:Program FilesGoogleChromeApplicationchrome.exe ENOENT` — an error
  pointing at Chrome rather than at the write. Reserve heredocs for prose such as
  commit messages. Escaping bugs introduced while writing a file surface later, at
  run time, disguised as a fault in whatever the file references.
- **Before calling the Workflow tool or spawning parallel agents, read
  `.claude/skills/multi-agent-orchestration/SKILL.md`.** The Workflow tool ships
  its own long, confident authoring guide, which leaves no felt gap for the skill
  to fill, so description matching does not activate it — a four-track fleet was
  launched without it and the pre-flight then found four real defects.
- **A push to `main` IS a deploy.** Coolify auto-builds every non-flag-gated
  change. This is true of every mid-session push, not only the one at close-out.
  Never report "nothing deployed" after a push — the only true statement is "a
  deploy ran and contained no live-served change". Verification: `/wrap` Stage 3.

---

## Decision Priority

When priorities conflict, this order applies:

1. Compliance and regulatory safety
2. Operating-mode integrity (wellness/clinical split)
3. Product and source-of-truth consistency
4. Brand consistency
5. Technical maintainability
6. Marketing and conversion optimisation

---

## File Naming Conventions

- Markdown files: lowercase kebab-case (`phase0-marketing-plan.md`, `results-to-product-mapping.md`)
- Dated strategy decisions: `YYYY-MM-DD-topic.md`
- Product files: `kit-1-testosterone-health-check.md`, `daily-stack.md`
- CSS files: semantic names by layer and purpose, never `new.css` or `final.css`

---

## Working Style

- Structured, practical, maintainable. Prefer systems over one-off output.
- Keep work aligned to the workspace that owns it.
- Check existing source-of-truth docs before drafting new work.
- Prefer updating the correct source file over creating overlapping duplicates.
- Flag conflicts instead of silently guessing.
- Keep durable rules in `CONTEXT.md` and dated live status in `STATE.md`; update `STATE.md` when your work changes what is live (see the CONTEXT-vs-STATE convention above).

---

## Default Behaviour for Any Task

1. Identify the correct workspace (see Routing Table above)
2. Read that workspace's `CONTEXT.md` — and its `STATE.md` if one exists
3. For any copy, marketing, or claim-adjacent task: also read `/03_compliance/CONTEXT.md` (non-negotiable — see Guardrail 1)
4. Check relevant source-of-truth docs
5. Do the work within the workspace's rules
6. Keep output clean, reusable, and correctly named
7. If the work changed live status, update the owning workspace's `STATE.md` (bump its date) before finishing

**Always route first, then work.**

**Skill observation (task-observer):** at the start of any substantive, multi-step session, invoke the `task-observer` skill so skill-improvement friction is captured to `skill-observations/log.md` during the work; `/wrap` flushes and surfaces that log at session close. File each learning by type — **fact/preference → memory or CONTEXT.md; live status → STATE.md; skill-definition improvement → a task-observer observation** (never duplicate one learning across two). Full rule in the `wrap` skill, Stage 1b.

---

## Codebase RAG — graphify-out

A pre-built knowledge graph lives at `graphify-out/` (queried via the graphify MCP tools). It is the **default** code/doc discovery tool — not grep.

**Rule (ordered):**

1. **Graph-first.** For any "where is X / what connects to Y / how does this flow / which files implement Z" question, query the graph first: `mcp__graphify__query_graph` (BFS/DFS by concept), `get_node`, `get_neighbors`. Then read only the source files it points to.
2. **Grep is the exception, not the reflex.** Use `Grep`/`rg` only for: exact string/literal/regex matches, config or env-var values, precise line content, or code edited but not yet committed (see freshness).
3. **Never broad-grep the whole repo** for discovery when the graph maps it. Targeted greps in a known file are fine.

**Freshness model:**

- **Code graph** auto-refreshes on every commit (git `post-commit` hook → `graphify update`, AST-only, no LLM). So committed code is current; **uncommitted edits are not yet indexed** — grep or read those directly.
- **Docs/markdown + the semantic/community layer** only refresh on a manual full `/graphify` run. If a doc was just written/changed this session, don't trust the graph for it yet.

`graphify-out/` is gitignored; never commit it. Full mechanics + limits: see the graphify-autorefresh note.

---

## Tripwire

If this file exceeds 250 lines, or if Claude starts missing compliance rules in output, stop and refactor. The file is currently lean by design — resist the urge to paste reference data, pricing tables, ICP tables, or detailed rule lists into this file. They belong in the relevant workspace's CONTEXT.md.
