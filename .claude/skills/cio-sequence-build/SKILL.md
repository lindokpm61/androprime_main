---
name: cio-sequence-build
description: >
  Build or finish an Andro Prime email sequence as a DRAFT Customer.io campaign
  from its copy file. Use when the task is "build seq-NN in CIO", "load the
  sequence into Customer.io", "wire up the <name> campaign", or finishing CIO
  sequence work. Covers recon, campaign+trigger+delay wiring, HTML content
  upload, stop-goals, and verification. Does NOT write copy and NEVER activates
  a campaign.
---

# CIO Sequence Build

Turns a sequence copy file (`09_website-app/frontend/email-templates/sequences/seq-NN-*.md`)
into a built **draft** Customer.io campaign matching the existing seq-03 pattern.

Generic CIO API mechanics live in the CIO MCP's own skills — read them, don't
reinvent them: `cio_skills_read("fly-api/campaigns.md")`, `templates.md`,
`campaign_triggers.md`, `campaign_filters.md`. This skill is the **Andro Prime
orchestration layer** on top of those.

## Hard invariants (violating any of these is a defect)

1. **Draft only.** Every `email_action` MUST be created/confirmed with
   `sending_state: "draft"`. The CIO API defaults email actions to
   `automatic` (would send immediately). Never activate a campaign — that is a
   human go/no-go gate (`03_compliance/pre-launch-checklist.md`).
2. **Compliance pre-flight.** Read `andro-prime/03_compliance/CONTEXT.md`
   before touching copy. Check the copy against the red-flag table. Flag
   efficacy-adjacent phrasing for Ewa; do not silently rewrite Keith's copy.
3. **Copy file is canonical.** If `sequences.md` and the detailed
   `seq-NN-*.md` copy file disagree (delays, email count, content), build from
   the copy file and **flag the spec mismatch** — never silently pick one.
4. **Verify, don't assume.** Sequences may already be built. Always read the
   live campaign before concluding "not built". The punch list lags reality.
5. **Transactional ≠ sequence.** Emails marked `= T-0x` in the copy file are
   transactional sends built separately. They are NOT actions in this campaign.
   Only wire the true sequence emails.

## Workflow

### 1. Recon (read-only, via CIO MCP)
- `cio_auth_status` → confirm workspace (Andro Prime = env/workspace `219186`, EU).
- `GET /v1/environments/219186/campaigns` → does a campaign for this seq exist?
- Read a known-good reference campaign in full (seq-03a = campaign `4`) — it is
  the golden structural template (action types, edges, exit wiring,
  `from_identity_id: 1`, `anchors/filters = "JTVCJTVE"`).
- `GET /v1/environments/219186/segments` → note stop-goal segment IDs. Stable
  ones: `15` Purchased—Any Kit · `16` Waitlist—Not Purchased · `17` Result
  Received · `18` Founding Member Listed · `19` Purchased—Supplement or Kit.

### 2. Reconcile copy ↔ spec
- Read `seq-NN-*.md` (copy, canonical) and the `sequences.md` block.
- Extract per email: subject, preview/preheader, delay, Liquid vars, CTAs.
- Compute **cumulative delays**: a copy "+20 days" after a "+5 days" email is a
  `delay_seconds_action` of 15 days (1296000s), not 20.

### 3. HTML
- **Generate, don't hand-type.** Run the bundled renderer — it emits the exact
  600px house template from the copy file, preserving Liquid verbatim:

  ```bash
  node .claude/skills/cio-sequence-build/render-email.js \
    andro-prime/09_website-app/frontend/email-templates/sequences/seq-NN-*.md [--dry]
  ```

  It parses each `## Email N` section (subject/preview/body), converts
  `**bold**`/links/lists, renders kit blocks as bordered cards + black buttons,
  and sets the footer context line by `seq-NN` prefix (`--context "…"` to
  override; `--email N` for one; `--prefix` for non-`seq` files). Output:
  `email-templates/html/seq-NN-email-X-*.html`.
- Then **review the `REVIEW:` lines it prints** — these are the judgement
  calls it can't make: card-vs-inline-CTA layout, and any `{% if %}` branch
  with no `{% else %}` (add a sane fallback for unset attributes, e.g. unknown
  `kit_type_latest` → test-selector). Eyeball one file before uploading.
- The renderer never touches Customer.io. Transactional copy (`[first_name]`,
  `{{ kit_name }}`) still needs Liquid normalised to `{{ customer.first_name }}`
  / `{{ event.* }}` by hand — the renderer keeps copy verbatim by design.

### 4. Build the campaign (CIO MCP, `dry_run` first on every write)
- If no campaign: `POST /campaigns` with `type: "none"` (create rejects other
  types).
- Set trigger: `PUT /campaigns/:id` `update_type: "recipients"`,
  `type: "transactional"`, `event: "<event from sequences.md>"`,
  `anchors: "JTVCJTVE"`, `filters: "JTVCJTVE"`. This creates the exit action —
  note its id.
- Add actions: `update_type: "add_actions"` with placeholder ids `-k..-1`.
  Event-triggered ⇒ first action is the implicit entry (no entry gate). Order:
  `delay → email → delay → email → … → email`, last edge → exit id. Emails:
  `{type:"email_action", name, sending_state:"draft"}`. Delays:
  `{type:"delay_seconds_action", name, delay:<seconds>}`.
- Stop goal: if the copy specifies one, `update_type: "exit_conditions"`,
  `global_exit_conditions: [{"segment":{"id":N}}]` (e.g. seq-01→15, seq-02→17).
  "Stop goal: None" ⇒ omit, leave `null`.

### 5. Upload content
The Fly UI API (`eu.fly.customer.io`) needs the MCP's OAuth — the
`CUSTOMERIO_APP_API_KEY` gets 401 there. But the **App API**
(`https://api-eu.customer.io/v1/campaigns/:cid/actions/:aid`) accepts that key
as Bearer and takes `body`/`subject`/`from_id`. Use the bundled script — it
reads the HTML files and PUTs them in one shot (no pasting large HTML into tool
calls):

```
node .claude/skills/cio-sequence-build/upload-content.js <manifest.json>
```

Manifest shape:
```json
{
  "campaign_id": 8,
  "actions": {
    "54": { "file": "andro-prime/09_website-app/frontend/email-templates/html/seq-04-email-2-first-weeks.html",
            "subject": "…", "preheader": "…" }
  }
}
```
Get the real `action_id`s from the campaign read in step 4 (email actions
only). `from_id: 1` = Keith Antony — always.

**`preheader_text` does not propagate via the App API.** After the script runs,
set it through the MCP per template:
`cio_write_api PUT /v1/environments/219186/templates/:tid` with
`{"template":{"preheader_text":"…"}}`.

### 6. Verify (CIO MCP, read-only)
Read the campaign + each email template back and confirm:
`type`, `event`, `state:"draft"`; per email `has_content:true`,
`has_subject:true`, `sending_state:"draft"`, correct `subject`,
`from_identity_id:1`, `preheader_text` set, body length ≈ source file size, and
any expected Liquid markers present (`grep` the body via `jq test()`).

### 7. Record
Update memory `reference_customerio.md` (campaign + action + template ids,
delays, stop-goal) and the `project_outstanding_tasks.md` item 29. Report to
Keith: what was built, what was already built, spec conflicts, and
activation-blockers (e.g. missing Stripe coupons, sender domain, Ewa sign-off).

## CIO API gotchas (also in `reference_customerio.md`)
- `save_action` requires `"type"` in the action object; bare `PUT /actions/:id`
  returns 400.
- `recipients` update is a **full replace** — pass through unchanged
  `filters`/`anchors` verbatim; omitting a populated field clears it.
- `preconditions`/`filters`/`anchors` are double-encoded: JSON →
  `encodeURIComponent` → base64. `"JTVCJTVE"` = empty `[]`.
- `add_actions` may return 500 but still succeed — re-read before retrying.
- Path for all Fly calls: `/v1/environments/219186/...`.
