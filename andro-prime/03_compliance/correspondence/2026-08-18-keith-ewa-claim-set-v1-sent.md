# Claim set v1 sent to Dr Ewa Lindo, 2026-08-18

**Status:** SENT, **ANSWERED and SIGNED. All four came back A in 50 minutes; Keith countersigned the same
day. Approved as CA-042, and 23 derivatives are pinned.**
**From:** Keith Antony (keith@andro-prime.com)
**To:** Dr Ewa Lindo (ewalindo@live.co.uk)
**Subject:** The first claim set, ready to sign: 40 claims, 4 questions
**Sent:** 2026-08-18 15:10:46 UTC · **Replied:** 16:00:48 UTC (**50 min**)
**Gmail:** sent `1a0156cc9cbc30d9`, reply `1a0159aa3fa38ee0`
**Packet:** `../content-approval/ewa-claim-set-tiredness-and-its-markers-v1-2026-08-18.md`
**Gate task:** ClickUp [`869ekhc68`](https://app.clickup.com/t/869ekhc68) (Approvals & Sign-offs, `901219880207`)
**Pre-flight:** packet 0 HARD / 0 REVIEW; outbound email 0 HARD / 0 REVIEW, **zero em dashes, pure ASCII**.

---

## Why this record exists

This is the **first claim set of the ledger she adopted on 2026-08-18**. Everything before it was a
design question; this is the first thing she is asked to sign under the new model, and the shape of
the ask is itself the thing being tested. Recorded now, before her reply, so the questions as asked
are on file rather than reconstructed from the answer. That is the CA-028 rule and it applies hardest
to the first instance of anything.

## What was sent, and what it is built on

**Topic:** `tiredness-and-its-markers`, the four articles she named when Q9 was re-asked concretely:
`why-am-i-always-tired`, `low-vitamin-d-symptoms`, `b12-blood-test`, `ferritin-blood-test`. They span
three pillars, deliberately.

**Format:** 40 claims, one sentence each, each with its source. That is **Q11 (A)** verbatim: she signs
a list we draft, not prose.

**Scope:** every claim is drawn from copy she has already cleared. **Nothing is net-new.** Per
**Q10 (A)**, forward only, this does **not** re-open or re-sign the four articles; their existing
sign-offs stand exactly as given. The set is the derivative-facing ledger, which is what makes
**Q14 (A)** Tier 1 auto-pass mean anything.

**Database:** `content_claim_sets` `57d5784a-435a-493b-bac6-dc43fe003faa`, version 1, `status = draft`,
40 `content_claims` rows. All 55 `content_assets` carry `claim_set_id` null, and a trigger refuses a
pin to a draft set.

## The four things she was asked to decide

Everything else in the email is a read. These four were flagged rather than resolved unilaterally.

### 1. Claim 7, and this is the one that matters

🔴 **Two articles in this one set state the same NHS advice with different force.**

- `low-vitamin-d-symptoms`, live and signed: *"Public Health England **recommends** 10 micrograms
  (400 IU) daily for the whole UK adult population."*
- the fatigue block she cleared on 2026-08-18: *"government advice is that everyone should
  **consider** taking a daily vitamin D supplement during the autumn and winter."*

The second wording exists because source verification on 2026-08-15 found the NHS page says
**consider**, and recorded at the time that "recommends" overstated it. **Neither article is wrong read
on its own**, and that is precisely why nothing had caught the pair: per-article review holds one
article at a time. **A claim set is the first structure in this repo that reads four articles as one
clinical object**, and it found this on its first outing.

Claim 7 was written neutrally ("the UK population-baseline vitamin D dose is 10 micrograms (400 IU) a
day") specifically so it does not pick for her. Options offered: use "consider" and correct the vitamin
D article; use "recommends" and correct the block; or leave both.

### 2. Claim 18, NICE NG239

Cited by guideline number, with no URL anywhere in the article's reference list. **No link was
invented.** Asked whether the bands (under 25 pmol/L low, 25 to 70 borderline, above 70 target) are
right; the citation gets pinned properly once she confirms.

### 3. Claims 24 and 30, unsourced

Neither has an external citation on the page that carries them. Both read as background rather than as
claims, which is probably why nobody sourced them. **An unsourced line in a signed ledger is exactly
what an ASA substantiation request lands on**, which is the argument for surfacing them rather than
letting them ride. Keep, source, or drop.

### 4. Claims 34 to 40, cleared but not live

The medical-causes block she cleared under Q2 on 2026-08-18. The copy has her clearance; the article is
**staged as a proposed revision and has not been republished**, so those claims are not on the site
today. Including them now avoids a v2 the moment it goes live. Offered the alternative of signing
1 to 33 and adding them later.

## What happens on each answer

- **Signs as it stands:** `content_claim_sets` goes to `signed` with her name and date, and pinning
  starts. The trigger that currently refuses every pin stops refusing.
- **Changes a claim's meaning:** that is a **Q12 (B)** meaning-change, so v1 is superseded and v2 is
  drafted. Nothing is pinned yet, so nothing is stranded.
- **Changes only wording without moving a claim:** stays v1 under Q12.
- **Answers 1 either way:** the losing article gets corrected, which is a re-optimisation staged as a
  proposed revision rather than a live edit.

---

## Her reply, verbatim and in full

**Received 2026-08-18 16:00:48 UTC, 50 minutes after sending.**

> Hi
>
> 1: A
> 2: A
> 3: A
> 4: A
>
> Thanks
> Ewa

Read against the options as they were put to her above, and against nothing else.

### Q1 (A): the set carries "consider", and the article is corrected

Her A was *"use 'consider', and correct the vitamin D article to match"*. So the overstatement is
settled in the restrictive direction: **the NHS page says consider, and `low-vitamin-d-symptoms` said
recommends.**

✅ **The correction is BUILT and STAGED**, proposed revision `069199cf-1fc6-4c5d-ac66-721647c61b00`,
held on Keith, live page untouched. **Two places carry the verb and both changed**: the body paragraph
under the insufficient band, and the FAQ answer in frontmatter. The three remaining references to a
"PHE 10 µg / 400 IU baseline" **stand**, because naming Public Health England as the source of the
figure is accurate and carries no recommendation force; the ruling was about the verb, not the
attribution.

⚠️ **Claim 7 itself did not change.** It was deliberately written neutrally, so her answer settles
which wording the *articles* carry without moving the claim. **Under Q12 that means this is still
version 1**, not a v2: no claim's meaning moved.

### Q2 (A): the NG239 bands are right

Under 25 pmol/L low, 25 to 70 borderline, above 70 target, confirmed as stated. **The citation is
still a guideline number with no URL.** It is now confirmed by the reviewer rather than sourced, and
no link was invented to make the row look tidier.

### Q3 (A): claims 24 and 30 stay, unsourced

*"Keep both, they are uncontroversial."* Recorded on the claim rows themselves so a later reader does
not re-raise it as an oversight: the absence of a citation on those two is now a ruling, not a gap.

### Q4 (A): the cleared-but-not-live block is IN version 1

Claims 34 to 40 stay in this version rather than being held for a v2 when the article goes live. So
the set covers the fatigue block from the moment it is signed, and releasing that article later
creates no new signing work.

---

## What this leaves

| | |
| --- | --- |
| **Ewa** | **Nothing.** All four answered; she has no open item on this set |
| **Keith** | ✅ **Countersigned 2026-08-18 in session.** Approved as **CA-042** |
| **Result** | The set is `signed`. **23 derivatives pinned**, the first in the ledger. 5.2's pin has fired for the first time and 5.3 and 5.4 are no longer blocked on data |

⚠️ **The set is still `draft` in the database, deliberately.** Her answers are recorded against the
claims, but the status was not flipped on her email alone: a `signed` row with a `signed_by` is the
artefact an ASA substantiation request rests on, and this set needs the business countersignature
too. **Flipping it is a one-line change once Keith says so.**

⚠️ **Three articles now sit staged and held on Keith**, and they are best released together:
`why-am-i-always-tired`, `inflammatory-markers-blood-test` and now `low-vitamin-d-symptoms`.

⚠️ **The vitamin D correction touches frontmatter, so it carries the mirror trap from earlier today.**
`sync-mirror.ts` is body-only, so when this revision is promoted the FAQ change will not reach
`content/blog/low-vitamin-d-symptoms.mdx` on its own. Named here because the promotion is a later
action by someone who will not have this session in front of them.

## Related

- `2026-08-18-keith-ewa-d2-claim-ledger.md` — the model itself, signed 08:43 UTC.
- `2026-08-18-keith-ewa-fifteen-rulings.md` — Q9 to Q15, which are the parameters this set is built to.
- `../content-approval/ewa-packet-fatigue-medical-causes-2026-08-15.md` — source of claims 34 to 40.

---

*Nothing here is an approval. Only a named human approves, and only in ClickUp or in writing.*
