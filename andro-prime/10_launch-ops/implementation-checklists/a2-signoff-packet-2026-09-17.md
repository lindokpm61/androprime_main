# A2 sign-off packet — the copy register's owed signatures, in one sitting

**Built:** 2026-09-17 · **For:** Keith · **Discharges:** Gate A item **A2** in `direction-f-go-live.md`
**Source of truth:** `09_website-app/redesign-copy-register.md`. **This file is a reading aid, not the record.**

> **How a decision here gets recorded.** Ticking a box in this file is not a signature. The record is
> the **ClickUp board task** (the board status IS the decision, per
> `03_compliance/content-approval/README.md`), mirrored into the register row. For anything needing a
> fresh CA number, the board task is created **before** the register row —
> `.claude/hooks/approvals-board-guard.js` enforces that order.
>
> ⚠ **None of these rows needs a CA number.** Per that README, webpage sign-off does not live in the
> CA register, and none of them supersedes an approved record: rows 42a, 48 and 12a did, which is why
> those became CA-050/051/052. The precedent for Keith's own closures is the register row carrying
> `(Keith, date)`, as rows 30a, 32a and 32d do. Recorded that way in
> `09_website-app/redesign-copy-register.md`, under the dated sign-off pass.

---

## ✅ ANSWERED 2026-09-17 (Keith)

| Part | Decision | State |
|---|---|---|
| **1** — batch, section labels and names (13, 24, 25, 14, 35f) | **Approved** | ✅ Recorded |
| **2** — new short copy (4, 27, 31, 44, 35d, 35e) | **Approved** | ✅ Recorded |
| **3.1** — row 32, `/membership` | **Approved** | 🟡 Keith's half only, see below |
| **3.2** — row 45, `/subscription/confirmed` | **Approved** | ✅ Recorded |
| **3.3** — row 7, the selector claim | **"fix it"** | 🔧 Fixed, **five** instances |
| **4** — row 38a ruling | **(a) build it** | 🔧 Built |
| **5** — Ewa's packet | **Draft it** | ✉️ Gmail draft `r74807119575631549`, **not sent** |

🟡 **PART 3.1 IS SIGNED BY KEITH AND IS STILL NOT APPROVED, BECAUSE ROW 32 HAS TWO SIGNERS.** Its
"Owed to" cell reads *"Ewa + Keith for anything read as a clinical cadence claim"* — the 90-day and
365-day retest intervals, stated to a customer on a marketing page for the first time. The README is
explicit that a submission is approved only when **all required signers** have signed, so Keith's
signature discharges the business half and nothing else. Her half is **item 6** of the sign-off email
(Gmail draft `r74807119575631549`), next to row 32c's Phase 0 question about the same page.

⚠ **It was absent from the first answer and sat between two approved items, which is exactly the
shape an inferred approval takes.** It was raised as missing rather than assumed, and answered
separately. Worth recording because the same hazard now applies to Ewa's half: **do not read her
letter on item 6 as covering anything but the cadence.**

✅ **With 3.1 answered, every one of Keith's fourteen sign-off rows is resolved** — thirteen signed,
row 7 fixed on his "fix it" ruling — plus his one ruling, 38a, built. **What remains on A2 is not
his:** Ewa's four rows and one ruling (with him as co-signer on 32), and one board click.

🔧 **3.3 was five instances, not the two row 7 names.** The false count was also live on
`/test-selector` itself, the page the claim describes, and on `/go`. Every count and the timing claim
were removed rather than corrected, because the five-step version has never been timed and a
corrected number needs re-checking every time the selector changes.

🔧 **4 is built, with one clause deliberately not claimed.** The control renders only where the host
declares no product. *"You can change your mind later"* still has no self-serve route, only emailing
`hello@andro-prime.com`. Real route, not a control, and not recorded as closed.

---

## 🔴 Read this first: A2 is not 26 signatures and 5 rulings

The go-live checklist quotes **26 rows needing sign-off and 5 needing a ruling**. That count is
correct **as at 2026-09-15**, which is when the row-by-row disposition table was written. **Eight of
those thirty-one have been resolved since, by work that landed on the 16th and 17th, and nobody went
back to decrement the count.** Each was re-tested against the register and the approval records
rather than quoted.

| | 2026-09-15 figure | Actually owed today |
|---|---|---|
| Sign-off | 26 | **18** (14 Keith, 4 Ewa) |
| Rulings | 5 | **2** (1 Keith, 1 Ewa) |
| Admin only | — | **1** (a board flip) |

**What you are actually looking at: 14 sign-offs and 1 ruling.** Five of the fourteen are section
labels with no claim in them and can go as one batch.

### What cleared, and what cleared it

| Row | Now | Cleared by |
|---|---|---|
| **12** | Superseded | Its line was rewritten by row 12a, which is itself now approved |
| **12a** | ✅ Approved | **CA-050**, 2026-09-17 — its scope names "the homepage membership sentence" |
| **29** | ✅ Approved | **CA-046**, 2026-09-16, both signers (q1) |
| **30** | ✅ Approved | **CA-046**, 2026-09-16, both signers (q3 / q3b / q3c) |
| **30a** | ✅ Closed | Keith, 2026-09-16 — bullet removed and the list imported rather than retyped |
| **42a** | ✅ Approved | **CA-050**, **CA-051**, **CA-052**, all 2026-09-17 |
| **48** | ✅ Ruled | **CA-051 J-2**, 2026-09-17 — the two homepage share-card descriptions |
| **10** | Superseded | Row 12a: the disclosure it owed was the renewal, now CA-050-approved |
| **32a** | ✅ Resolved | Keith, 2026-09-16 — the funnel-model bullet split into sell vs price |
| **32d** | ✅ Ruled in full | Keith, 2026-09-16 — a public `/membership` page exists, and is public |

⚠ **Row 48d is not a signature, it is a click.** You approved the M7 SEO commission on 2026-09-14.
What is outstanding is flipping ClickUp **`869f1wwch`** to `approved`, because that list admits only a
named human. Nothing else is owed and the fields surface with the branch.

---

## Part 1 — Batch A: section labels and product names. No claim in any of them.

**Five rows, one decision.** Every string here is either a two-or-three-word section name in the
grammar you already ruled on (2026-09-03), or a move **towards** an already-approved product name.
None carries a price, a benefit, a marker, a threshold or a number.

- [ ] **Row 13** — `/` four section labels: **"The two ranges"**, **"Where to start"**, **"What's free"**, **"No conflict"**.
      ⚠ "What's free" sits above the membership line and inherits its prohibitions: it is a section name, not an offer.
- [ ] **Row 24** — kit detail pages gain **"Questions"** above the FAQ and **"The founders"** on Kit 3.
- [ ] **Row 25** — kit eyebrows become **"Kit 1 // Testosterone Health Check"** and so on. Two fixes: the number is unpadded (Kit 1 was the site's only "Kit 01"), and the name is read from `lib/kits/names.ts` rather than typed.
- [ ] **Row 14** — the homepage's three kit cards move from short names to the long ones every other surface uses. **The short forms were the unapproved variant**, so this moves onto approved copy, not away from it.
- [ ] **Row 35f** — three machine-voice literals retired: the `SYS:` chip, `SYS: On this page`, and `System DB // References`.

**What you are agreeing to:** that these are names and furniture, not claims, and that consistency
with the already-approved long product names is what you want.

---

## Part 2 — Batch B: new short copy, pre-flight clean, no claim

**Six rows.** Each is genuinely new wording, which is why it needs a signature whatever the scanner
says, but none makes a claim about health, price or outcome.

- [ ] **Row 4** — `/kits` section 01 standfirst: *"Nine markers. Three ways to buy a slice of them. Every kit reads on the same lab, in the same units, so a result from one is comparable with a result from another."*
- [ ] **Row 27** — `/how-it-works` photo caption: **"Any postbox, any morning"**. Follows the existing convention (a place and a time, no claim, no product, no number).
- [ ] **Row 31** — the homepage "See the app" card becomes **"Open the demo"** and links to `/demo`. Its body already said *"We never put your data in it"*, which the route now makes structurally true: `lib/results/demo.ts` builds from fixtures with no Supabase client and no user id. Also the demo's closing strip, restating three already-approved facts.
- [ ] **Row 44** — `/how-to-sample`, the only genuinely new page. **Two new sentences** (*"Five steps, about five minutes. No account needed, and nothing to enter."*); the five steps are byte-identical to the retired `/activate` instructions and the rest is carried from `/how-it-works`.
- [ ] **Row 35d** — `/blog` index: hero standfirst, an `{n} articles` chip, and a closing block. Restates the site's existing argument in new words.
- [ ] **Row 35e** — `/blog/[slug]` furniture: *"Frequently asked."*, *"Find out where you actually stand."*, *"The occasional plain-English read."* Retires the brutalist voice (*"System Directive: Baseline Check"*). **The kit price range, the turnaround and the UKAS line are unchanged.**

**What you are agreeing to:** the wording itself. The compliance pre-flight has already run over all
of it and returned no hard finding.

---

## Part 3 — The three that need real attention

### 3.1 · Row 32 — `/membership`, the largest single block of new copy on the branch

- [ ] **Sign off the page.** A public explainer disclosing the £47 price and the day-31 charge, with
      **no join button and no way to add one** (membership is joinable only inside the 30 days after a
      result, enforced server-side with a 409), so every CTA routes to `/kits`.

New copy across seven sections: the hero (*"Your first 30 days are in the kit price. Then it renews."*),
a four-step spine, *"It starts when you learn something. Not when you pay."*, the pull quote
*"Ninety days after a card was charged is not ninety days after a baseline."*, the ink panel
(*"£47 a month, from day 31."*), *"Three things you keep whether you pay us or not."*,
*"You cannot buy this on its own. On purpose."*, six FAQ pairs, and the close.

🟢 **Two things that reduce the risk:** every number is **imported, not typed** (`PRODUCT_MAP`,
`MEMBERSHIP_OFFER_WINDOW_DAYS`, `FIRST_CYCLE_RETEST_DAYS`, `ANNUAL_RETEST_DAYS`, `PRICING`,
`KIT_NAMES`), so a constant moving breaks the build rather than the copy; and the three "includes"
lines plus the entitlement paragraph are **carried verbatim** from the in-app paywall.

🔴 **Deliberately absent, each for a stated reason:** member pricing on supplements (no delivery path,
your 2026-08-26 rule), any kit discount (there is none, and section 05 says so), and "watch your
numbers move" as the lead (the cold-start constraint).

⚠ **This one is also Ewa's, in part.** The 90-day and 365-day retest intervals are stated to a
customer on a marketing page for the first time here, though both are already customer-facing inside
the app. See Part 4.

### 3.2 · Row 45 — `/subscription/confirmed`, rewritten rather than restyled

- [ ] **Sign off the new sentences.**

The page was confirming a product that cannot be bought. It read *"Your stack is starting"*,
*"First box dispatching this week"*, *"Letterbox-friendly"*, *"UK manufactured"* — while all three
supplement subscriptions are `purchasable: false`, and **the only purchasable subscription is the
membership, which has no physical goods**. So the single success page of the subscription checkout
was promising a letterbox box to the only customer who can reach it.

🟢 **It carried no register row and no CA record**, so this is a correctness fix to unregistered copy,
not a rewrite of approved copy. The replacement is assembled from approved strings wherever one
exists (the renewal and cancellation sentences from `/membership`, the retest terms and includes from
the in-app paywall, the clinician qualifier from row 32c). The price is read from `PRODUCT_MAP`.

**New sentences owed to you:** the standfirst, the eyebrow, the retest-date fallback line, and the
whole "nothing to confirm" state for a visitor arriving without a subscription.

⚠ **Not a live mis-statement today** — the flag gates the checkout POST server-side, so no
subscription can be started. It becomes live the moment the flag goes on.

### 3.3 · Row 7 — a claim that is already false, carried as found

- [ ] **Decide: fix it, or carry it knowingly.**

`/kits` and `/test-selector` both say the selector takes **"answer 3 questions"** and
**"takes less than a minute"**. It is now **five steps**. This is pre-existing drift, carried
forward and flagged rather than silently fixed, because fixing it is new copy and needs this
signature.

**Your options:** (a) reword to match the five steps, which is new copy and ships with the merge;
(b) reduce the selector back to three; (c) carry it and log it. Not urgent in compliance terms, but
it is a small factual claim that is currently wrong on a buy surface.

---

## Part 4 — The ruling that is yours

### Row 38a — `/supplement-waitlist` FAQ 4 promises a control that does not exist

FAQ 4 answers *"Can I choose which product I want updates about?"* with *"Yes. The form lets you tell
us whether you are interested in the Daily Stack, the Joint and Recovery Collagen, or both. You can
change your mind later."*

**The form on that page has no such control and never has.** `SupplementWaitlistForm` renders
`interestedInProduct="any"` on this route and forwards it as a **hidden** field. There is no product
selector, and no route by which a reader could "change their mind later". It reads as true because
`/supplements/daily-stack` and `/supplements/collagen` pass real values, so the **field** exists in
the payload while the **control** does not.

The answer is rendered unchanged pending your decision. Logged as OBS-670.

- [ ] **(a) Build the control.** The field already exists and is already forwarded, so this is a form
      control and nothing downstream. Makes the answer true.
- [ ] **(b) Rewrite the answer.** New copy, needs pre-flight, ships with the merge.
- [ ] **(c) Carry it.** It is live on `main` today, so the merge does not make it worse.

**Recommendation: (a).** It is the smallest change that removes a false statement rather than
re-describing one, and the payload already carries the value.

---

## Part 5 — What goes to Ewa, so you can route it in one message

**Four sign-offs and one ruling.** None of these is yours to give.

| Row | What she is being asked |
|---|---|
| **22** | `/kits/energy-recovery` sample panel. Four marker values changed (Vit D 44→58, B12 61→45, hs-CRP 1.2→0.8, Ferritin 38→62) and **verdicts changed with them**, each re-derived from `thresholds.md`. hs-CRP is a **new row**. ⚠ The demonstration is now **MIXED (two In range, two Monitor)**, reversing an all-flagged one: the old panel showed a man for whom nothing is fine. |
| **23** | `/kits/testosterone` and `/kits/hormone-recovery`. **Two Kit 3 values changed** (Vit D 47→58, hs-CRP 2.1→0.8) to satisfy the lab-normal constraint. Consequence worth her eye: **Kit 3's demonstration is now milder, with no Action-needed row.** The band geometry is already ratified and is NOT what is being asked. |
| **32c** | `/membership`. Whether *"Ask the clinician"* may be named on a **public** surface at all, given the live member screen has only ever rendered that block **empty**. ⚠ **This survived CA-046 as an open condition** — Q6 added the Phase 0 qualifier, which is a mitigation, not an answer. |
| **33** | The new `img-9` calendar photograph and its caption **"A date, written down"**. Goes on the CA-045 register as a genuinely new asset. **Not covered by the CA-045 record**, which is why it is still here. Chosen deliberately to have no person in it, so it opens no judgement CA-045 is already asking. |
| **6** *(ruling)* | **FAI verdict wording contradicts itself across two documents.** `PRODUCT.md` says *"Not interpreted"* was invented and the engine never returns it, and that the six allowed words come from the `BADGES` map, which yields *"Reported"*. `/kits/hormone-recovery`'s header says the product's *"Not interpreted"* beats the frame's *"Reported"* because it is a clinical ruling. **Both cannot be current.** Frame O2 renders no verdict, so it sidesteps rather than settles it. |

⚠ **Row 32 (Part 3.1) also needs her**, but only for the 90-day and 365-day cadence intervals being
stated on a marketing page. Worth putting in the same message.

🟢 **She is already owed a citation swap from 2026-08-21** (`869e9fr6x`). Rows 22, 23, 32c, 33 and
ruling 6 should ride that pass rather than opening a new one. Use `/signoff-email` to draft it: it
emits the numbered, lettered format she has answered every time.

---

## Part 6 — The one click

- [ ] **ClickUp `869f1wwch` → `approved`.** Row 48d, the M7 SEO commission you approved on 2026-09-14.
      Only a named human may set that list to approved, which is why it is still open. No copy
      decision attached.

---

## Where this leaves Gate A

A2 is the long pole. **A3 closed on 2026-09-17.** A4 (the screenshot pass) and A5 (the
session-carried sweep) are engineering and do not need you, except for one decision inside A5:
whether `npm run db:seed` may write ten fake customers with fake health results into the
**production** database. Skipping it means nine of the ten results states ship having never been
looked at.
