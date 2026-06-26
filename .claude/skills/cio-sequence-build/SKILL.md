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
6. **Liquid lint MUST be clean before "done".** CIO accepts broken Liquid at
   upload time and only fails at render — silently drops the message (no inbox,
   no bounce, no campaign-metric "failed", only per-message in Deliveries →
   Activity Log). Run `lint-liquid.js` against local AND live CIO bodies
   (step 6 below). Zero ERRORs is a hard gate; WARNs need a judgement call.
7. **Test-send before activation.** Liquid lint catches the known traps but
   cannot exercise branches with real attribute values. For any template with
   `{% if %}` branches, send a real test message to keith@andro-prime.com
   (App API `POST /v1/send/email`, or the CIO UI Preview → Send Test) with
   representative attribute payloads for each branch BEFORE the human go/no-go
   in step 7. Render failures only become visible here, not in upload.

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

### 6. Verify (CIO MCP, read-only) + Liquid lint
Read the campaign + each email template back and confirm:
`type`, `event`, `state:"draft"`; per email `has_content:true`,
`has_subject:true`, `sending_state:"draft"`, correct `subject`,
`from_identity_id:1`, `preheader_text` set, body length ≈ source file size, and
any expected Liquid markers present (`grep` the body via `jq test()`).

Then run the Liquid linter against both the local HTML and the live CIO bodies:

```
node .claude/skills/cio-sequence-build/lint-liquid.js          # local
node .claude/skills/cio-sequence-build/lint-liquid.js --cio    # pulls every email action body from the App API
```

Zero ERRORs is a hard gate (the linter exits 2 if any). WARNs (`{% if %}`
without `{% else %}`, `customer.first_name` with no `| default:`) require a
judgement call — silence them with an actual fix, never by editing the linter.

### 7. Test-send (for any template with Liquid branches)
The linter catches known traps; it cannot exercise `{% if %}` branches with
real attribute values. Before the activation go/no-go, trigger a real test
send to `keith@andro-prime.com` covering each branch — either via the App API
`POST /v1/send/email` with the relevant attribute payloads, or via the CIO UI
template's "Send Test" with a profile that has each branch's attribute set.
If a send fails to arrive, check Deliveries → Activity Log for the message —
render errors only surface there, not in any campaign-level metric.

### 8. Record
Update memory `reference_customerio.md` (campaign + action + template ids,
delays, stop-goal) and the `project_outstanding_tasks.md` item 29. Report to
Keith: what was built, what was already built, spec conflicts, and
activation-blockers (e.g. missing Stripe coupons, sender domain, Ewa sign-off).

## Editing a LIVE / running campaign (routing changes post-launch)

This skill builds **drafts**; the steps above assume the campaign is draft and
freely editable. Once a campaign is `running`, editing it (trigger/recipients,
templates, state) — and editing any **segment that is in use** by a running
campaign — is a different mode with its own gate. Worked through on the
2026-06-26 seq-03c/03d results-signal go-live.

**THE GATE — `Allow agent to edit live data` (workspace setting).** When OFF,
the agent JWT gets **403** on:

- changing campaign **state** (start/stop/archive/sunset/schedule);
- editing a **running** campaign's config (a `recipients` / trigger / filter PUT
  on a `running` campaign 403s — *only draft/stopped campaigns are config-
  editable*); and
- editing a **segment in use** by a running campaign / unsent newsletter / SQL
  import / another segment (e.g. a seq-03 qualifier segment while its campaign
  runs).

Dry-runs are NOT gated (they only echo the request), so `dry_run:true` always
"passes" — the 403 surfaces only on the real write. **Unblock:** Keith enables
it at `https://eu.fly.customer.io/settings/ai`, **then re-authorizes the
Customer.io connector in claude.ai** so the agent token re-mints — toggling the
setting alone does NOT clear the 403 in the same session (the JWT was minted
pre-toggle). Alternative unblock: Keith **stops** the campaign in the UI (a
stopped campaign's config IS API-editable) or makes the change in the UI
directly. ⚠️ Stopping the campaign may NOT free an in-use segment (a
stopped/archived campaign can still reference it), so for segment edits the
setting+re-auth path is the reliable one.

**Segment redefinition pattern (positive-presence, mirror seg-21).** To route on
a boolean flag, a qualifier segment uses an `attribute_change` leaf keyed by the
attribute **`name`** (the numeric `id` in a read-back is CIO's per-attribute
catalog id — omit it on write, CIO resolves by name):

```
conditions = {"and":[{"or":[{"event":{
  "filters":{"and":[
    {"field":"to","inverse":false,"operator":"eq","value":"true"},
    {"field":"from","inverse":true,"operator":"eq","value":"true"}]},
  "name":"<attr>","type":"attribute_change"},
  "inverse":false,"times":1,"within":0}]}]}
```

`to=true,from!=true` fires on the absent→true transition, so a **brand-new
attribute only starts matching after the first profile sets it** (which
registers it in the catalog). The campaign's event trigger (e.g.
`result_received`) gates entry; the segment only expresses the flag. The old
six-flag `inverse:true` ("has NOT changed to true") construction is BROKEN —
an absent attribute is NOT matched by it (verified 2026-06-26). The segment PUT
body requires `name` (segment name) alongside `conditions`/`type:"dynamic"`.

**Worked example — seq-03c/03d go-live (env 219186, both validated, both gated
on the setting above):**

- Segment 22 (seq-03c qualifier) → the `results_all_clear` attribute_change leaf
  above, replacing the six-flag construction.
- seq-03d (campaign 7) trigger → repoint to the bare event, mirroring seq-03b:
  `PUT /v1/environments/219186/campaigns/7` `update_type:"recipients"`,
  `type:"transactional"`, `event:"borderline_nurture_consented"`,
  `event_type:"event"`, `anchors:"JTVCJTVE"`, `filters:"JTVCJTVE"` (clears the
  old `borderline_testosterone` attribute filter), `attribute_filters:null`,
  `restart_mode:"rematch"`.
- After unblock: execute both, read back (decode `filters`/`conditions`),
  confirm campaign 6 picks up seg-22, then run the live routing-matrix retest
  once the app deploy carrying the new attribute/event has landed.

## CIO API gotchas (also in `reference_customerio.md`)

- **`Allow agent to edit live data` OFF ⇒ 403** on running-campaign config edits
  and in-use-segment edits, not just state changes (see the section above for
  the full list + unblock). Dry-runs don't reveal it.
- `save_action` requires `"type"` in the action object; bare `PUT /actions/:id`
  returns 400.
- `recipients` update is a **full replace** — pass through unchanged
  `filters`/`anchors` verbatim; omitting a populated field clears it.
- `preconditions`/`filters`/`anchors` are double-encoded: JSON →
  `encodeURIComponent` → base64. `"JTVCJTVE"` = empty `[]`.
- `add_actions` may return 500 but still succeed — re-read before retrying.
- Path for all Fly calls: `/v1/environments/219186/...`.
