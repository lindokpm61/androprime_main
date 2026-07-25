# Clinical Plugin Post-CQC Workspace Context

## Purpose
This workspace defines the regulated clinical layer that activates after CQC approval.

Use it for:
- regulated intake
- consent flows
- confirmatory testing
- prescribing process
- monitoring process
- records governance
- clinical handoff from wellness to regulated care

## Structure

Seven topic subdirs are scaffolded but not yet populated; file each doc into its matching subdir as it is written:

- `intake/`: regulated intake flow docs
- `consent/`: consent flows and docs
- `confirmatory-testing/`: confirmatory testing process notes
- `prescribing/`: prescribing process design
- `monitoring/`: clinical monitoring process design
- `records-governance/`: records governance notes
- `semble/`: clinical software vendor notes (Semble is the intake/records/prescribing system of record)

The post-CQC workflows are designed against Semble as the intended clinical system of record; `semble/` is a vendor folder, categorically different from the six process-topic folders above.

## What belongs here
- intake flow docs
- consent docs
- confirmatory testing process notes
- prescribing and monitoring process design
- records governance notes
- post-CQC operational workflows

## Good output looks like
- explicit
- regulated-service aware
- operationally clear
- clearly separated from wellness mode
- suitable for later implementation into systems and SOPs

## Do not use this workspace for
- pre-CQC public messaging
- Phase 0 product positioning
- generic campaign planning
- non-regulated supplement or test-kit logic

## Skills, tools & MCPs

MCP servers and tools most relevant when working in this workspace. Repo-wired servers are in the root `.mcp.json` (graphify, context7, dataforseo, supabase, clickup); the rest are claude.ai account connectors, some of which need authorising in an interactive session before use.

**Skills** (repo skills invoke as `/name`; the rest ship with plugins):

- No clinical-specific skill exists yet; this workspace is future/not-live.
- `/compliance-preflight`, `/draft-preflight`: still apply to any external-facing clinical copy once drafting begins (route via `03_compliance`).
- `/decision-sweep`: when a post-CQC process decision lands, propagate it once these docs exist.

**MCPs & tools:**

- No MCP server is wired for clinical operations yet; this workspace is future/not-live.
- **Semble** (external clinical software vendor, not an MCP): the intended intake/records/prescribing system of record. Integration is post-CQC; the `semble/` subdir holds vendor notes.
- Future integrations (post-CQC, not yet wired): e-prescribing/DSP partners (SignatureRx, Healistic, Pharmacierge; see `05_partners`), and any Semble API surface.
- Until CQC registration completes, do NOT wire or exercise clinical tooling against real patient data.
