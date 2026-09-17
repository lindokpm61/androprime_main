<!--
The text written to the ClickUp task for CA-050, kept here so the board and the repo
can be diffed. The BOARD is the hub and outranks this file; this is the mirror.
Written by `09_website-app/frontend/scripts/clickup-approval-task.ts`.
-->

**You owe one action: read the record, then sign the business row or send it back.** Nobody else is required. Ewa is not a signer on this one.

**Artefact:** `09_website-app/frontend/lib/membership/subscriptionCopy.ts`, the `membershipEnabled === true` branch. Renders as the `/kits` money block, the homepage membership sentence, two kit-LP FAQ answers, and the slot-2 footnotes across seven routes.

**Record:** `03_compliance/content-approval/approval-record-membership-renewal-copy-c1-2026-09-17.md`
**Register:** `content-approval-register.md`, row CA-050.

## Scope

Re-records **item C1 of CA-026 only**, the `/kits` money block, and supersedes that one item on approval. The rest of CA-026 stands. **The flag-off branch keeps rendering the approved C1 text byte for byte, so nothing currently live changes when you sign.**

Not to be confused with `869erh22k`, the other open CA-026 amendment, which is about `/faq` selling free testosterone via FAI. Different clause, different surface.

## Why Ewa is not a signer

Your ruling of 2026-09-11, CA-021 precedent: what changes is payment terms, so this is business rather than clinical. That holds only while C1's conflict-free GP clause is untouched, and it was verified as a re-runnable script rather than by eye: byte-identical in both flag states, held in one shared `GP_SENTENCE` constant, and now rendered as its own paragraph, so it is more structurally separate than it was.

Two flagged items do belong to her, and they ride the citation-swap pass already owed from 2026-08-21 rather than opening a new packet.

## Pre-flight

**0 HARD / 0 REVIEW on both payloads, delta zero** against the approved baseline. The unit of scan was the extracted copy, dumped by `scripts/dump-subscription-copy.ts`, not the module, which is mostly commentary.

The judgement pass was run by an **independent session** under pre-flight invariant 7, because the session running the pre-flight had written the "Cancel anytime" clause earlier the same day and may not clear its own copy. It returned **1 HARD and 6 flagged**; the pre-flight session added a seventh.

## What it found, all yours, none clinical

- 🔴 **HARD, and it gates the flag flip rather than this signature.** *"On day 31 that card is charged £47 a month"* states a charge date with no starting point, and **day 1 is the day the result lands, not the day of purchase**. A buyer counts 31 days from checkout while the real gap adds dispatch, sampling, return post and lab time. Your homepage sentence already states it correctly, so the fact fits in the house voice.
- 🟠 *"Your first 30 days are included in the price of every kit"* is unconditional, while `startOnResult.ts` refuses a membership outright for a confirmed testosterone under 12 nmol/L, which is your own ruling of 2026-09-17. Kit 2 yields null rather than low and enrols normally, correctly. Naming the exception would put a clinical routing fact on a buy page; a scope word would not.
- 🟠 Five more in section 2 of the record, including the "all-in" chip and the §P substantiation note.

## Conditions recorded against approval

`STRIPE_PRICE_MEMBERSHIP` is unset. The v1.3 Membership section of the terms is still DRAFT and not synced. The Stripe billing-portal configuration behind "Cancel anytime" is unconfirmed.

---

⚠ **Claude created this at `pending` and did not move it.** Only you set it to approved: recording the decision and performing the click are two different acts.

⚠ **This task was created AFTER the record, not before it, and that is backwards.** The convention is board first, repo mirrors. The repo-wired ClickUp MCP server refuses every call without a licence key, reads included, so the hub was unreachable through the route the convention assumes. It turned out `CLICKUP_API_TOKEN` was in `.env.local` all along and `scripts/content-engine/clickup.ts` had been talking to the API directly for months: the account was never locked, one client was. There is now a repo path for this, `scripts/clickup-approval-task.ts`, so the next CA goes to the board first.
