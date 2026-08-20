---
name: signoff-email
description: >
  Draft the clinical-reviewer sign-off email for anything that is NOT a blog
  article — carousel decks and captions, threshold or biomarker band rulings,
  cover headlines, label copy, claim wording, a results-engine routing change.
  Use when the task is "email Ewa for sign-off", "get Ewa to rule on X", "send
  the packet to Ewa", "draft the sign-off email", or when a compliance pre-flight
  ends with items owed to the clinical reviewer. Emits a numbered, lettered email
  in the exact shape she has answered every time, validates the format
  mechanically, and creates a Gmail DRAFT. It never sends, never rules, and never
  infers a sign-off from adjacent answers.
---

# /signoff-email — the clinical-reviewer sign-off email

**Internal skill.** Andro Prime specifics throughout (reviewer, list ids, house
rules). Not for publication.

Articles reach Ewa through a scripted path. **Everything else reaches her by
hand-written email, and that is what this owns.** Before this existed, the format
was reconstructed from prior threads every time, which is how a format drifts —
and the untooled route carries the higher-stakes decisions, because those are
exactly the ones that do not fit the article pipeline.

## What this owns, and what it must not touch

| | |
|---|---|
| **Owns** | Non-article sign-off: decks, captions, cover headlines, threshold and band rulings, label copy, claim wording |
| **Does NOT own** | Blog articles. Those go through `frontend/scripts/content-engine/signoff-concierge.ts`, which creates the ClickUp "Review:" task. Never hand-email an article review |
| **Never** | Sends. Rules. Writes an approval. Infers sign-off from adjacent answers |

## The format is a spec, not a style

Six prior threads all came back same-day in one shape: `1: Yes 2: Yes 3: B 4: A`.
**When one reviewer approves everything and replies in a consistent shape, that
shape is a spec.** These rules are that spec, and each one is here because
breaking it cost a round-trip on copy she was personally signing.

1. **One question = one number = one letter.** Never a sub-letter. An email once
   asked `2a` and `2b`; she replied `1: B / 2: A / 3: A`, collapsing them. Both
   sub-answers happened to agree so nothing was lost, but the ambiguity cost a
   second email. **She answers the numbers she sees, not the sub-structure.** If
   an item holds two decisions it is two numbered items, with the shared context
   above both under a heading.
2. **No trailing approval question.** Flat numbering is not enough on its own: an
   email asked a clean 1, 2, 3 and she answered 1 and 2 and silently dropped 3.
   The difference was kind, not numbering. **1 and 2 were specific and checkable;
   3 was the umbrella that authorised 30 posts to publish.** A reviewer moving
   fast answers what she can evaluate against the text in front of her; an
   umbrella asks her to certify a state rather than judge a thing, which reads as
   a formality and behaves like one. So either:
   - **preferred** — make the specifics constitute the approval and say so in the
     preamble: *"answering 1 to 4 with a letter is your sign-off on all ten"*, so
     the authorising act is the same act as the judgement; or
   - if a separate approval genuinely is needed, **make it question 1**, in the
     same numbered-and-lettered shape as everything else, so it is answered while
     attention is highest.
3. **Quote the exact copy inline. Never a file path.** She rules on text, not on
   links. A path means she cannot answer from the email.
4. **Every item gets at least A and B**, so the answer is always a letter.
5. **Flag blast radius.** Mark any option whose consequence is a live-system
   sweep rather than a copy edit, and say what it sweeps. An option that moves a
   threshold is a different kind of yes from an option that changes a sentence.
6. **No em dashes.** House rule, outbound copy.

## Workflow

### 1. Gather

Read the source packet (`03_compliance/content-approval/approval-record-*.md`) or
the open items from a pre-flight report. The packet already carries the questions
and options; **the email is a mechanical projection of it, so do not re-derive the
decisions.** Resolve anything the repo can answer *before* asking, so her
attention is spent on judgement rather than retrieval.

### 2. Draft the body to a file

Plain text, in the format above. Open with the reply-by-letter instruction and an
example reply string.

### 3. Validate — this is the enforcement step, not a suggestion

```bash
node .claude/skills/signoff-email/validate.js <email-body.txt>
```

Exit **0** clean · **2** at least one HARD · **1** could not run, which is never a
pass. It refuses sub-lettered items, items carrying more than one question,
trailing umbrellas, non-contiguous numbering, items with fewer than two options,
em dashes, and a missing reply-by-letter line. Fix every HARD and re-run. Verified
in both directions on real email bodies before shipping: it exits 2 on the
2026-08-12 email that actually failed, catching all three of its defects, and 0 on
a correct one.

### 4. Create the DRAFT, never send

```bash
gws gmail users drafts create --params '{"userId":"me"}' --json "$(cat body.json)"
```

`body.json` is `{"message":{"raw":"<base64url of the full MIME>"}}`. Build the
MIME with `To: ewalindo@live.co.uk`, `From: keith@andro-prime.com`,
`Content-Type: text/plain; charset="UTF-8"`, then base64 it and translate `+/` to
`-_` with `=` stripped. **Read the draft back and confirm the £ signs and quotes
survived the encoding** before telling Keith it is ready.

Then hand Keith the draft. **Sending is his act, not yours.**

### 5. The reverse leg — parse the reply back

When the letters arrive, write each ruling under its item in the packet, then log
it in ClickUp list `901219880207` (Approvals & Sign-offs) **first**, and mirror to
`03_compliance/content-approval/` after. Never the other way round.

**Count the answers against the questions.** If the reply carries fewer answers
than the email asked, **treat the gap as unanswered and ask again in one line.**
Never close it by inference. Two positive specifics do not constitute a general
approval: on the run that produced this rule, the two answered items covered the
referral lines and the figures, and said nothing about the other eight captions'
bodies. **Inferring sign-off from adjacent answers is precisely the thing sign-off
exists to prevent, and it is invisible afterwards, because the reply looks
complete.**

Worth knowing so a chase does not read as nagging: on that occasion she sent the
missing answer unprompted about an hour later, opening *"Hi I forgot"*, before the
one-line chase had even gone out.

## Pre-flight — run before handing Keith the draft

1. `validate.js` exits 0. Not 1. Not 2.
2. Every question is answerable from the email body alone, with no file opened.
3. No item is an umbrella unless it is item 1.
4. If there is no approval item, the preamble states that the specific answers
   ARE the sign-off.
5. Blast radius is marked on every option that moves a live value.
6. The draft exists in Gmail, has been read back, and **has not been sent**.
7. The answer count you expect is written down, so step 5 can compare against it.

## Hard rails

- **Never send.** Create the draft; Keith sends.
- **Never record a ruling she did not give**, and never convert silence into a
  yes. A missing answer is a finding.
- **Never hand-email an article review** — that is `signoff-concierge.ts`, and a
  second submission duplicates her queue.
- **Never write `ewa_signed_at`** or set an approval status. A separate sync owns
  that, and its refusal is the system working.
