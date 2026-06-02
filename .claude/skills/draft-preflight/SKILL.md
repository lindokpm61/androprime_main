---
name: draft-preflight
description: >
  Before sending (or folding new content into) a Gmail draft via the gws CLI,
  verify it against the LIVE mailbox — drafts, sent, and the thread/inbox — to
  confirm the draft still exists, is in DRAFT state, is threaded onto the latest
  message, has not already been sent, and that no newer reply has arrived. Use
  whenever about to send an Andro Prime email draft, or before acting on a draft
  id from memory or context (which may be stale). Produces a GO / NO-GO report;
  it NEVER sends without explicit confirmation from Keith.
---

# Draft Pre-Flight

Why this exists: a draft id in memory or context is a *hypothesis*, not a fact.
On 2026-06-02 a "queued" post-sign reply to Ben (`r-1199956388281056210`) had
actually already been SENT — folding new content into it failed with "Message
not a draft", and the assumption nearly produced a duplicate email. This skill
catches that whole class of error by checking the live mailbox before any send.

Tooling: the `gws` CLI, authenticated to keith@andro-prime.com (see the
gws-cli reference memory). Every call needs `"userId":"me"` inside `--params`.
gws prints a `Using keyring backend: keyring` line before its JSON — parse from
the first `{`.

## Hard invariants (violating any is a defect)

1. **Never send without an explicit human go.** This skill verifies and reports;
   the send is a separate, Keith-confirmed step. Mirrors compliance-preflight's
   "you do not approve" and the root guardrail on outward-facing actions.
2. **A draft id is a hypothesis until re-resolved.** Always re-check it against a
   live `drafts list` before trusting it — never act on a remembered id blind.
3. **On any HARD failure, STOP and surface it.** Do not recreate, resend, or
   "fix" by guessing. Report the discrepancy to Keith and let him decide.
4. **Channel-specific overlays still apply.** Partner/supplier drafts (Vitall/
   Ben) also get the no-strategy-to-middleman check; customer-facing drafts also
   get compliance-preflight + the no-em-dash rule.

## Workflow

Input: the draft id (e.g. `r-123...`). If only a recipient/subject is known,
find it first via the drafts list in step 1.

### 1. Draft exists AND is a DRAFT
- `gws gmail users drafts list --params '{"userId":"me","maxResults":100}'`
  → the target id MUST appear. **Absent → already sent or deleted = HARD FAIL.**
- `gws gmail users drafts get --params '{"userId":"me","id":"<id>","format":"minimal"}'`
  → `labelIds` MUST include `DRAFT` (and NOT `SENT`). Else **HARD FAIL** (this is
  the exact 2026-06-02 signal).

### 2. Read the draft
- `gws gmail users drafts get --params '{"userId":"me","id":"<id>","format":"full"}'`
  → capture `threadId`, headers (`To`, `Subject`, `In-Reply-To`, `References`),
  and the body. The body is base64url under `payload.body.data` — decode it
  (`base64 -d` in the Bash tool, or Buffer.from(data,'base64url')).
- Body must be non-empty and decode cleanly. Empty/garbled → **HARD FAIL.**

### 3. Pull the whole thread (sent + inbox in one view)
- `gws gmail users threads get --params '{"userId":"me","id":"<threadId>","format":"metadata"}'`
  → list every message with `From`, `Date`, `internalDate`, `Message-ID`,
  `labelIds`, `snippet`.

### 4. Sequence checks
- **a. Latest-message threading.** The draft's `In-Reply-To` should equal the
  `Message-ID` of the most recent NON-draft message in the thread. If a newer
  message exists than the one being replied to → **WARN** (stale reply point).
- **b. They replied after you wrote this.** If the latest non-draft message is
  INBOUND (From the recipient) and its `internalDate` is AFTER the draft's →
  **WARN**: re-read their reply before sending; the draft may answer the wrong
  thing or be moot.
- **c. Already-sent duplicate.** Scan `SENT` messages in the thread. If one
  closely overlaps the draft's opening or asks → **WARN**: you may be repeating
  something already sent (the 2026-06-02 failure). Reframe to acknowledge it, or
  drop the draft.

### 5. Recipient + subject sanity
- `To` resolves to the intended canonical contact. For Vitall it MUST be
  `ben.starling@vitall.co.uk` — the bare alias `ben@vitall.co.uk` is banned (see
  the vitall-contacts reference). Wrong/aliased recipient → **HARD FAIL.**
- `Subject` threads correctly (matches the thread subject, `Re:` preserved).

### 6. Verdict
- **GO** only if all HARD checks pass AND Keith has consciously accepted every
  WARN. Otherwise **NO-GO** with the specific finding(s).
- Report as a short checklist: exists ✓/✗ · DRAFT state ✓/✗ · body ✓/✗ ·
  threading ✓/⚠ · no newer inbound ✓/⚠ · no sent-duplicate ✓/⚠ · recipient ✓/✗.
- To send after a GO **and** Keith's explicit say-so:
  `gws gmail users drafts send --params '{"userId":"me","id":"<id>"}'`.

## Notes / gotchas (learned while building the Ben draft)
- **Windows path trap:** Node's `/tmp` resolves to `D:\tmp` (nonexistent) — use
  `os.tmpdir()`. The Bash tool's `/tmp` is MSYS and fine; read a Windows temp
  path from Bash as `/c/Users/.../AppData/Local/Temp/...`.
- **Replacing/creating a draft body:** build RFC822 with CRLF line endings,
  RFC2047-encode any non-ASCII subject (`=?UTF-8?B?<base64>?=`), base64url the
  whole message, and pass it via `--json '{"message":{"threadId":"...","raw":"..."}}'`.
  Always `--dry-run` first; it returns the decoded request for inspection.
- `drafts update` returns "Message not a draft" if the underlying message was
  already sent — treat that as confirmation of step-1 HARD FAIL, not a transient
  error.
