# Sales: Current State

Volatile sales/lifecycle status for this workspace. Durable funnel logic, routing, lifecycle stages, and rules are in `CONTEXT.md`; task-level status lives in **ClickUp** (workspace `90121729875`). This file holds only dated live status. Update the date on each change.

_Last updated: 2026-09-16 (**the membership-pricing prohibition is NARROWED by a carve-out; the selling prohibition is untouched**; see below). Earlier: 2026-08-27 (site-funnel-model.md rewritten to v2 against the monitoring thesis; the stale "hero CTA pending Keith" line corrected)._

---

## 🔄 The membership-pricing prohibition is narrowed, and the selling one is not (2026-09-16)

**Keith ruled.** `funnel/site-funnel-model.md` §2 listed *"Sell or price the membership"* as one
absolute bullet under "What no acquisition surface may do". **It was one rule covering two different
acts**, and its stated reason (*"it is not purchasable before a result exists"*) is an argument about
selling rather than about stating a price.

- **Selling: unchanged and absolute.** No acquisition surface may sell the membership.
- **Pricing: now governed by a test rather than a prohibition.** *A surface MUST price it where it
  can take money for a kit, and MAY price it where it demonstrably cannot take money at all.*

**The obligation follows the buy button.** That is the discriminator Keith had already applied on
2026-09-11 without naming it, when the `/lp/` pages were brought in because they carry their own buy
buttons and take cold paid traffic.

**Permitted today:** the four `/kits/` routes and three kit `/lp/` pages (2026-09-07 and 2026-09-11
rulings), and **`/demo`** (this ruling). The demo cannot take money at all: both "Manage membership"
buttons are inert, there is no join path, and membership is joinable only inside the 30 days after a
result. It also hides nothing, because GBP 47 goes public on seven routes the moment
`redesign/direction-f` merges.

✅ **AND `/membership` IS NOW RULED TOO (Keith, same day): THE PUBLIC PAGE SHOULD EXIST, AND IT IS
PUBLIC.** Copy-register row 32d, open since 2026-09-15, is closed.

🟢 **The ruling confirms the test rather than excepting it.** `/membership` has **no join button and
cannot have one** (joinable only inside the 30 days after a result, enforced server-side), so every
CTA routes to `/kits` and it *demonstrably cannot take money*, which is the "MAY price it" limb. **The
test predicted the answer before it was given**, which is the argument for writing rules as tests
rather than as lists of permitted pages.

🔴 **IT DOES NOT FLIP THE FLAG, and that distinction is the whole risk.** Row 32b is a sequencing gate
and stands: the page is behind `MEMBERSHIP_ENABLED`, `notFound()`s when off, flag defaults false.
**Re-checked 2026-09-16: `trial_period_days` appears nowhere in the repo except inside the comment on
the membership page asserting its own absence**, `createMembership` charges from checkout, and the
membership terms are still `DRAFT, not synced live`. A live page reading *"GBP 47/month after"* before
the trial mechanic exists would be a mis-statement arriving **by merge rather than by decision**. *May
exist* and *may ship* are two rulings; only the first has been given.

🔴 **Also NOT decided by it:** row 32c's Phase 0 question (**Ewa's**, still open) on whether the *"Ask
the clinician"* benefit may be named on a public surface at all, and whether `/` or `/kits` link to
the page.

⚠ **`09_website-app/frontend/PRODUCT.md` needed no change**: its version of the rule says *"no
acquisition surface may sell it"* and is about selling only, so it stays true as written. Checked
rather than assumed.

⚠ **One wording item is open and it is not a gate.** The demo's plan screen says *"On 13 September
your card is charged GBP 47 and it carries on monthly"*, in the second person, where it is describing
the fictional man. The demonstration notice covers it; it is the one line on those screens that could
read as an offer rather than a depiction.

---

## Stale zinc dose corrected in the all-clear maintenance offer copy (2026-08-07)

`funnel/all-clear-maintenance-offer-copy.md` listed the Kit 1 / Kit 3 in-range trigger as **"Zinc
(Gluconate 30mg)"**. Ewa approved the cut to **25 mg** on 2026-08-02, and `04_products/supplements/daily-stack.md`
records that as applied to "all three site surfaces the same day". This file was not one of the three, and
neither was the results engine, which carried the same 30mg figure in its normal-testosterone card copy
(corrected in the same pass, commit `56f3a5e`). The LP was already right.

Found by reading rendered HTML while checking something else, not by any sweep. Worth noting as a
decision-sweep miss: a formulation change was propagated to the surfaces someone thought of, and the two
that were missed both live outside `09_website-app/app/`.


## Email sequences / campaigns (Customer.io build state)

- **All-clear retest reminder** (`retest-reminder-all-clear.md`, single send): copy **APPROVED 2026-07-18 (CA-022)**; built as **CIO campaign 23, DRAFT**. Fires on the `retest_due_at` date attribute (stamped on any whole-result all-clear); sends to ALL all-clear kit buyers, not just subscribers. Flag-gated on `RETEST_REMINDER_ENABLED`, **currently off**.
- **seq-03b (low-T notification + consent-gated nurture)**: built as **CIO campaign 5, DRAFT**, not activated. Part A result notification fires for all low-T (< 12 nmol/L); Part B education-only nurture fires ONLY on `lowt_nurture_consented`.

## Two-kit bundle funnel

- The two-kit bundle path (Confirmation / Prove-It / Full-picture SKUs, second kit on an automated later dispatch) is **dark behind `BUNDLES_ENABLED`**. The only pre-dispatch customer touchpoint, the **bundle address-check** email (`bundle_address_check` event, `bundle-address-check.md`), is **SPEC/DRAFT, not built**. Gated on the solicitor D2 bundle-terms decision plus an account-area address-update surface; needs Ewa sign-off + compliance pre-flight before build.

## Supplement waitlist capture

- Supplement range is not live in Phase 0, so a waitlist captures intent. Joining fires `supplement_waitlist_joined`, which triggers the transactional confirmation **T-10 (Supplement Waitlist Confirmed)**: a single confirmation send, not a nurture sequence. The waitlist population converts when the range ships.

## Funnel model & routing

- **`funnel/site-funnel-model.md` created 2026-07-25 (PROPOSED).** Reconciles the site to the conflict-free strategy: homepage = position + route the undecided (via the quiz); paid-search LPs (`lp/*`) = direct low-CAC conversion, no quiz; quiz = router plus the WTP/buyer-profile capture. Supersedes the acquisition-half routing assumptions in `kit-purchase.md`.
- 🔵 **`funnel/site-funnel-model.md` REWRITTEN TO v2, 2026-08-27, against the monitoring thesis.** v1 was written when this was a kit business and gave every surface "convert to a kit" as its one job; `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` made the app the product and the thing that gets marketed, so v1 was one thesis out of date and the live homepage is built faithfully to it. **Unchanged in v2: the routing split (broad through the quiz, hot-intent direct), the WTP instrument, every compliance rail.** Changed: the blog moves to the top of the surface table as the front door (thesis §4: 125 winnable sub-queries at 58,990/mo, currently written down in our own docs as a negative); the homepage's job becomes "establish that the product is the record" (🔴 **amended 2026-08-30, ruling A2: "establish the position and SHOW the record as its proof"** — the record demonstrates the position and may not open the page; the speed hero and money-honesty subline are rail 2 and unchanged); the demo account is named as a surface and **does not exist**. New rule binding every acquisition surface: **none may sell or price the membership**, because it cannot be bought before a result exists. New §1b records the cold-start constraint: no surface may lead on "watch your numbers move", because at purchase there is nothing to watch. v1 recoverable from git history.
- ✅ **Homepage hero primary CTA: DONE 2026-07-25** (quiz primary, kits secondary, how-it-works tertiary; commit `03d4bd5`, code comment at `app/(marketing)/page.tsx:113`). **This line previously read "Open decision, pending Keith" and was stale for a month**; the doc and the build had both moved and only this file had not. Corrected 2026-08-27.
- 🔴 **Open, and now the load-bearing homepage question:** the hero _argument_ is still a kit hero ("Know your numbers in days. Five minutes at home." = speed, convenience, postage). Under v2 it should establish the difference between having a number and understanding it. The argument is already on the page at `page.tsx:243` (_"Your results are normal." That's not an answer._), below the fold under the convenience hero. Copy work, then compliance pre-flight.
- 🔴 **Open, gates the redesign scope:** marketing site (4px slab borders, black-on-white, uppercase black sans) versus the app being rebuilt to hairline rules, mono numerals and dark mode. If the app moves and the site does not, a man crosses a visible product boundary at login.
- ⚠️ **New risk to the WTP read:** the block prices the _bundle concept_ (test now + retest later). The membership also carries a retest, and the 2026-08-27 first-month decision puts a month of membership inside the kit price. Whether the bundle and the membership are now the same offer wearing two names is unresolved; it belongs with gap-analysis decision #5.
- **WTP + buyer-profile quiz block (ClickUp `869e74w93`): placement now specified** in the model (inside the quiz, after the symptom questions, un-priced, non-gating); the actual four-question Van Westendorp spec is still to write.
- **Track A launch copy** (`06_marketing/content/track-a-launch-copy.md`) message-matched to conflict-free 2026-07-25 (committed `b559ca8`); still DRAFT pending Ewa tone + claims sign-off (the Ewa sitting, ClickUp `869e7pmu9`).
