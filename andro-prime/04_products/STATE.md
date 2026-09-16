# Products: Current State

Volatile status for the products workspace. Durable rules + routing are in `CONTEXT.md`. Update the date on each change.

_Last updated: 2026-09-16 (✅ **CA-048 IS APPROVED, BOTH SIGNERS, AND THE RETEST-CADENCE BUILD CHECKLIST IS NOW ENTIRELY CLOSED.** Keith's business sign-off followed Ewa's the same day (*"CA-48 approved"*); items 1, 2, 2b, 3 closed 2026-09-15, items 4, 5, 6 with the map and its fixture on 2026-09-16, and item 7 with this. ⚠ **A closed checklist is not a shipped feature, and the two halves are honest about it: the map is built and READ BY NOTHING, and the screen is approved and NOT BUILT.** 🔴 **Approval fills the copy and authorises no build:** four conditions ride with the screen, of which the alert container is undecided and **the render obligation is undischarged**. Earlier the same day: ✅ **THE LAST OPEN CHECKLIST ROW IS CLINICALLY SIGNED: CA-048, EWA 5 OF 5, 22 MINUTES.** The symptom-overlay screen, item 7, the one row the cadence build could not close. `1: A 2: B 3: A 4: A 5: A`. 🔴 **Q2 CAME BACK B AND WENT AGAINST THE REVIEW, AND THAT LINE MUST NOT BE 'TIDIED' LATER.** The independent compliance pass called the **"Otherwise,"** option *"the single most useful thing to put in front of her"*: her red-flag list opens with an unqualified **"chest pain"** while the paragraph above routes *sudden or severe* chest pain to 999, so a man matches **both lists**, and the `cholesterol-test` FAQ already resolves that after the word "Otherwise". **The question named the conflict, quoted the precedent, and she chose the drafted line anyway.** A considered ruling, not an oversight: **inserting an "Otherwise," later would reverse a clinical ruling, not tidy a sentence.** ✅ **It is also the case for asking rather than adopting** — both options went to her because the reviewer's argument was strong but was not the reviewer's to make, and adopting it would have shipped an unsigned change into a screen she was about to sign. 🔴 **THE PRE-FLIGHT'S ONE HARD FINDING WAS IN THE TRIGGER CONDITIONS, NOT THE WORDS, SO NO TEXT CHECK COULD HAVE SEEN IT.** An earlier draft scoped both composites to **Kit 3**, which measures all nine markers, so there is no untested panel to widen to and the screen would have offered a man a panel he had just bought and read. **Four rules broke at once**, and ⚠ **`resultMayCarryRetestOffer()` gives ZERO protection here**: it keys on GP-badged states, and on this screen every marker is in range by the trigger condition, so it returns `true`. The protection has to live in the trigger conditions. ⚠ **Correcting my own first write-up of that finding:** I wrote that the Kit 3 case *"has no signed copy and nobody has listed it"* and compared it to `fai-reported`. **False.** §2a's step-1 table lists it, *"Kit 3 (superset) | none left → GP"*, decided by Keith on **2026-07-17** — the routing existed and only the sentence was missing, which is a wording ask and not a clinical one, and materially cheaper. **It was three screens, not the two every document said.** ✅ **Q1 = A carries the 999 paragraph over EXACTLY as it appears on the articles, which includes the live NHS hyperlink** the draft had rendered as plain text. ✅ **Q3 = A keeps reader self-triage, so no red-flag symptom capture is built, no new special-category data is collected and the DPIA is untouched.** ✅ **Q4 = A gives Kit 3 its closing sentence, with nothing to buy.** ✅ **Q5 = A leaves the vitamin D wording alone: blood markers to measure, not an ingredient claim.** **No copy moved on any answer**, so the pre-flight stands against the exact signed text. 🔴 **NOT CLEARED TO BUILD: Keith's business sign-off is owed, plus four build conditions** — the NHS link, the alert container (not put to her), a sweep of every surface for a second **machine-read** copy, and **the render obligation, which is undischarged**. Record: `03_compliance/content-approval/approval-record-symptom-overlay-screen-2026-09-16.md`, ClickUp `869f2jyce`. Earlier the same day: ✅ **THE RETEST CADENCE MAP IS BUILT, AND IT IS CORRECT AND INERT.** `RETEST_CADENCE` in `lib/results/retestCadence.ts`: **30 states, 30 cells, 33 rules**, every cell clinically signed, plus the reduction as Ewa ruled it. **Build-checklist items 4, 5 and 6 are closed**, which leaves item 7 (the copy pre-flight, still failing on the red-flag line) as the only open row. 🔴 **NO MECHANISM READS IT YET, so not one customer's date has moved** — the wiring is a separate piece of work and it is the one that moves real dates. ⚠ **The shape changed by one word and item 5 is why:** it is `Record<ResultState, RetestCell>`, a cell being a NON-EMPTY TUPLE, because the three sub-12 testosterone states carry `clinician-led` **and** `confirm` at once and a single-rule cell cannot hold them; the alternative was a second map of confirm overlays, which is the duplicated-fact shape this repo keeps paying for. The tuple is non-empty by construction because an empty cell reads as "nothing decided" and behaves as "nothing recommended", and **"we recommend nothing" is a real clinical position (`none`) that has to be stated**. ✅ **The fixture is an INDEPENDENT RESTATEMENT, not a read-back** — every expected rule is a literal, never the constant the code uses, so changing `RECHECK_DAYS` to 84 fails the suite instead of quietly agreeing with itself. ⚠ **That property was not assumed: the map was broken four ways and the suite was watched failing each time** (16, 4, 9 and 4 assertions), then the file was restored and the hash checked. 🔴 **`confirm`-always-wins is asserted against a SYNTHETIC 180-day confirm that no fixture produces**, because every real `confirm` is zero days today, so "wins" and "shortest" agree and the branch looks redundant — move the confirmatory recheck off zero and a pure shortest-wins rule silently stops scheduling it. Two cross-checks neither document asked for: **the prepaid-or-included rule expressed over the map** (swept over every 2026 anchor date, no cell contributes a sub-90-day interval except the prepaid `confirm`), and **`clinician-led` asserted to be the same set as the "See Your GP" badge in both directions**, because `resultMayCarryRetestOffer()` derives from the badge and a disagreement would schedule a retest for a man the card just sent to his doctor. ⚠ **The confirmatory `0` is stored twice** (here and `CONFIRMATION_INTERVAL_DAYS` in `lib/bundles/config.ts`) and is deliberately NOT imported — `config.ts` reaches `classifier.ts`, which is where the map gets wired in next — so the duplication is held shut by an assertion instead of a comment. 117 assertions, wired into `npm test`; full suite green, exit 0. Earlier: 2026-09-15 (✅ **THE ANTI-UPSELL GUARD IS RE-HOMED (build item 3), AND IT WAS LIVE RATHER THAN FORWARD-LOOKING.** Rule adopted (Keith): **CA-014 binds the RESULT, not the marker** — when any marker on a result routes to a GP, that result offers no retest to buy. 🔴 **16 retest links across 6 fixtures were suppressed**, each one on a result that had just told a man to see his doctor; a Kit 1 with testosterone at 8–12 was rendering a GP referral on the testosterone card and "Retest in 6–12 months → /kits" on three others. 🔴 **The per-card compliance guard passed the entire time, because a per-item check cannot see a per-collection rule** — the new guard sits beside it, not instead of it. Ewa's Q4 = C ruled whether the retest is **scheduled**; she was never asked whether it may be **sold**, which is why the load had no home. ✅ The retest **interval** survives (Ewa-signed card copy; removing it would recreate defect 3f) and ✅ **complement cross-sells survive** (untested panels), asserted by a synthetic panel no fixture produces. Scoped by property, never by a list of markers. **A scope reading of an existing approval, not a new clinical ruling: nothing was put to Ewa and no approved copy moved.** `resultMayCarryRetestOffer()` in `lib/results/retestGuidance.ts`, enforced in `classify()`, recorded in `03_compliance/CONTEXT.md`. **Build items 1, 2, 2b and 3 are all closed; the reduction is unblocked.** Earlier: ✅ **THE TWO MISSING BUCKET A ROWS ARE IN: T > 29 nmol/L and vitamin D > 250 nmol/L, both `clinician-led`. The table is 28 rows.** ✅ **And checking that claim found a THIRD missing cell nobody had listed — `fai-reported` (Free Androgen Index, report-only per Ewa ruling 8) was in NEITHER the table NOR the rule-kind map — which Keith closed the same day as the sixth kind, `none`.** It had survived two sign-off rounds and three counts of "every row is ruled", because **every one of those counts was of the rows that existed**. It needed a shape decision, not a clinical one (ruling 8 settles the substance), and ⚠ **`clinician-led` was NOT borrowed for it** — that would assert a GP referral on a report-only marker. ⚠ **The cell is DERIVED from ruling 8, not signed as cadence**; giving FAI an actual retest date would be a new claim and needs Ewa. ✅ **30 states, 30 rows, now asserted on every build by `verify-cadence-coverage.js`, which diffs both documents against the engine's own `ResultState` union** — because a document cannot be trusted to notice that it is the thing that is short. Closed with **no new ask**, and checked rather than assumed: the Q3 question **as sent** (Gmail `1a0a69ae55223fe0`) ends with "testosterone above 29 nmol/L, vitamin D above 250 nmol/L", so she was shown both and answered A, and their GP routing was separately signed under CA-044 on 2026-08-07. ⚠ **Her answer covered TEN states and the table offered EIGHT rows** — the gap was in the table, never in the ruling. 🔴 **The answer-count check could not have caught it: the count is of ANSWERS and the shortfall was in ROWS.** Renumbered everywhere: 28 rows not 26, round 1 credited with 23 of 28 not 21 of 26. 🔴 **Still shut and NOT touched by this: card copy for those same two states is drafted, unapproved and live since 2026-08-07 (CA-044 §2 item A, 39 days).** Build checklist items 1, 2, 2b and 3 are all done; **no blockers left on the map itself.** Remaining is ordinary build work (items 4-7), of which 7 is the copy pre-flight that has still not cleared on the red-flag line. Earlier: ✅ **THE `seasonal` RULE KIND IS DESIGNED AND BUILT, closing the cadence build's first blocker.** `normal-vitamin-d` no longer falls through to `clinician-led` and shows a man no retest date on a perfectly normal vitamin D. Shape `{ kind: 'seasonal'; window; minGapDays: 90; minSpanDays: 30 }`, resolving against the result date to a sampling WINDOW rather than a date, because the ruling constrains when the blood is drawn. The 90 is inherited from the prepaid-or-included rule (`seasonal` is inside it; `recheck` is carved out); the 30 is Keith's and is the only number not clinical or inherited. Swept over 1096 anchor dates: gaps run 90 to 302 days, never under 90, never past the 12-month edge of `maintenance`, and the one unavoidable annual cliff is placed in early December rather than on 30 September where the unguarded rule puts it. **No copy moved and no clinical input was owed.** Inert: nothing imports it yet. **Items 2 and 3 of the checklist are now the blockers.** Earlier: ✅ **THE CADENCE PACK IS ANSWERED, AND THE ONE ANSWER THAT WAS NOT "AS DRAFTED" INVERTED THE MIXED-PANEL RULE.** Ewa replied 20:18 UTC, `1: A 2: A 3: A 4: C 5: A`, record **CA-047**. **Q4 = C rejects the proposed GP-suppression rule**: cadence is decided **per marker, never per panel**, so a man with a GP-routed CRP and a low vitamin D gets a GP referral AND a 3-month vitamin D retest. The four other answers came back as drafted, so **no copy sweep anywhere** — but Q2 = A quietly **narrows** two proposed cells to 3 months, and Q5 = A ratifies the red-flag list verbatim, which is on-screen copy for a symptomatic man and **owes a pre-flight**. ✅ **A SECOND PACKET CLOSED THE REST THE SAME EVENING AND THE TABLE IS NOW FULLY RULED, 26 of 26.** *(Superseded above: 28 of 28 — two signed rows were added 2026-09-15.)* Round 1 reached only 21 because its questions enumerated states **in prose rather than by row**; round 2 (sent 21:06, answered 21:33, `1: A 2: A 3: B 4: B 5: A 6: A 7: A 8: A`, eight for eight against a pre-recorded count) closed `ft-low`, the joints = yes branch, both SHBG states, `normal-vitamin-d`, the `normal` fallback, and §4's Q4(a) and Q4(c). 🔴 **Q3/Q4 = B moved both SHBG states off the `maintenance` kind onto `recheck`** at 3 months, which falsified the 75-minute-old carve-out that had enumerated bucket B **by name** (short by four, two of them in-range states); it is now scoped by rule kind. ✅ **Q5 = A preserved a seasonal ruling the lookup had no shape for; the fifth kind (`seasonal`) was designed and built the same day and that blocker is closed.** ⚠ ~~Two signed states still have **no row at all** (T > 29, vitamin D > 250)~~ *(Closed 2026-09-15: both rows added.)*, and **Q7's newly-signed copy does not exist in the product**. ✅ **Rule 1 was the anti-upsell guard and its load was RE-HOMED the same day** as `resultMayCarryRetestOffer()`, after re-reading showed neither the prepaid rule nor CA-014 reached the case — and that read at the result level it was **live, 16 links across 6 fixtures**; and the 90-day boundary is ✅ **SETTLED the same day (Keith): bucket B is scoped OUT of the prepaid rule and the cell stores `{ days: 90 }`, not the phrase.** ⚠ Correcting this line's own earlier claim: **3 months is 89 to 92 days, not exactly 90**, and 58 of 1096 start dates fall under 90, all in late January or February. The map **no longer ships inert**, so building it will move real dates. Full detail in the first section below.) Earlier: 2026-09-08 (🔴 **THE RETEST MAP NOW CARRIES SIX DEFECTS, NOT THREE, AND THE THREE NEW ONES SHARE ONE CAUSE: THERE IS NO CUSTOMER-INITIATED ROUTE TO A RETEST ANYWHERE IN THE PRODUCT.** Added 2026-09-08 from two questions Keith asked about ordering a retest through the app; all three were found by reading the code. **3d — a member cannot claim his retest early, and paying to go early DUPLICATES it rather than consuming it.** `next_retest_due_at` is written once, in `createMembership`, and never updated by any route, job or admin screen; the membership page renders `pending` as prose with no control. His only self-serve option is buying another kit at full price, which does NOT set `retest_claimed_at` — so the nightly sweep still fires on the original date and dispatches a second physical kit. He pays twice and gets two kits. It also sits awkwardly beside `2026-09-07-fast-recheck-must-be-prepaid-or-included.md`: that rule is scoped to system-triggered rechecks, but here the man already HOLDS the entitlement and the software's only answer is a new sale. **The fix is not a "retest now" button** — it is a rule about which result states may pull the date forward, because the system cannot currently tell an impatient member from the low-T case Ewa signed a 0-day recheck for (`CONFIRMATION_INTERVAL_DAYS = 0`, which lives in the Confirmation BUNDLE, a separate purchase a member does not hold). **3e — a non-member has no reorder path at all.** No order history, no repurchase; the account page offers the dashboard, subscriptions and a support mailto. The only pointer is the dashboard CTA "Retest in 6-12 months" → `/kits`, the public catalogue index, where he buys as a brand-new customer. **3f — a flagged result never suggests a retest; only an all-clear does.** `CTAS.retestReminder` is attached to `optimal-testosterone`, the SHBG states and the `normal` fallback — every one a result with nothing to sell. A low or equivocal testosterone gets `gpReferral`, correctly per CA-014, and therefore no retest prompt anywhere; the reminder email is off and only stamps on a whole-result all-clear. **So the man most likely to need a second test is the one the product never invites to take one.** Three decisions are now owed from Keith (items 7, 8, 9 in the map's Owed table); none is a clinical question except the interval wording in 3f, which is Ewa's. 🔴 **SEPARATE AND UNRESOLVED: the rebuilt `/demo` shows a Kit 3 buy with a Kit 2 retest, and the sweep dispatches the same kit the customer last ordered.** Earlier: 🔴 **THE RETEST MECHANISM MAP IS BUILT, AND IT FOUND THREE DEFECTS.** `retest-mechanism-map.md` reconciles the EIGHT mechanisms that stamp a retest date across bundles, membership, Customer.io and copy. The all-clear membership retest at 365 days **cannot fire**, so every all-clear member is sent a 90-day kit the code's own comment forbids; the membership retest is a **one-shot**, while the year-1 forecast sells one retest per year; and **three anchors** are in use (purchase, Stripe checkout, result landing) for what a customer experiences as one date. 🔵 **A design answer is now on the table**, raised by Keith the same day: `2026-09-06-result-driven-retest-cadence.md` proposes that the RESULT picks the interval, via one exhaustive state-keyed lookup every mechanism reads from. Two calls are Keith's (the anchor, and whether a sub-90-day recheck must be prepaid), one is Ewa's (the reduction ordering). See below.) Earlier: 2026-08-27 (thresholds.md sweep correction on Active B12 + ferritin, see below). Earlier: 2026-08-24 (**THE PACKAGING ASSUMPTION UNDER THE UNIT-ECONOMICS MODEL IS NOW VERIFIED, AND IT CONFIRMS THE BUNDLE IS A PARCEL.** Read off the three Nutribl product pages: **all three launch SKUs are the same pack, 150ml Flat Postal, bottle 107 x 79 x 22 mm, label 76 x 60 mm, artwork submitted at 80 x 64 mm with 2 mm bleed** — the 365-tablet D3 included, so tablet count does not change the format and one artwork spec covers the range. **A single bottle at 22 mm clears the Royal Mail Large Letter depth limit of 25 mm; three stacked is 66 mm, which is a parcel in a higher band.** So the model’s single flat GBP 3.00 cannot be right for both, and the direction is now certain: high for a single, low for the bundle. **The GBP 3.00 itself is still unverified and Nutribl did not answer it**: their 24 Aug reply routed back to a 3PL page that publishes no costs at all, so the only route to the number is a booked call. Two of the three label questions did land: **we may supply our own print-ready artwork free of charge**, which makes the GBP 145 design bundle optional and removes the GBP 109 vector-file lock-in, and **Andro Prime is the Food Business Operator**, so the claims printed on every bottle are our legal liability. **The claim-selection question was ignored, and it is the compliance gate.** Also parsed for the first time: Nutribl’s daily inventory feed. The launch three are in stock, but **Brain Support Complex is at -90 and Garcinia Cambogia is down to 5 units**, and those are the only catalogue vehicles for pantothenic acid and chromium, so two of the four Tier 1 asks now carry a supply question as well as a formulation one. Earlier the same day: **THE SEPARATE-BOTTLES DECISION QUIETLY CUT THE REVENUE MODEL BY ABOUT 70 PERCENT, AND NOBODY CHECKED THAT SIDE.** New: `supplements/supplement-unit-economics-2026-08-24.md`, a worked month-by-month model. `daily-stack.md` specifies **60 capsules, 2 a day, a 30-day supply at GBP 34.95/month**, a true monthly consumable. **Stock bottles are 4-month and 12-month packs**, so the GBP 34.95 monthly anchor does not transfer: a bundle at GBP 39.95 per 4 months yields **GBP 119.85 per customer in year one against the modelled GBP 419.40, which is 29 percent**; at GBP 59.95 it is 43 percent. Matching the old model would mean GBP 139.80 for a box of three commodity bottles, which is not sellable. **The blend's commercial value was that it was not price-comparable to anything; three named single nutrients are comparable to everything.** Not an argument against separate bottles, which is the only manufacturable route, but **the LTV/CAC models in 01_strategy are built on GBP 34.95/month and need re-running**. Second finding: **fulfilment costs more than the product** at an assumed GBP 3.00 per shipment against a GBP 2.72 zinc bottle, so the 3PL fee is the single largest open variable in the model and the bundle's real advantage is carrying GBP 6.95 more product for zero extra postage. Both the GBP 3.00 fee and the 3-bottle postage band are UNVERIFIED and belong on the 3PL call. Earlier: **NUTRIBL MOQ AND FULFILMENT ARE BOTH ANSWERED, AND NEITHER WAS ASKED: 10 UNITS PER SKU, AND THEY HAVE A 3PL.** Their Dropship Light 3PL page, flagged unread in the call sheet since 2026-08-22, was read: MOQ 10 per SKU, they label our stock and hand it to a 3PL partner who warehouses and ships it, invoiced monthly. **The launch three cost about £96.70 of stock**, so the last argument for holding inventory ourselves is gone and Gate 0A is sized against a risk that does not exist. **Three unknowns move to the 3PL, not Nutribl**: who they are, what warehousing and per-order fulfilment cost (this sets the retail price), and what interface they expose to a custom cart, since our checkout is not on their integrations list. **New compliance item**: a fulfilment processor holding customer names and addresses, absent from the privacy policy's processor table. Two drafts written, neither sent: the Nutribl 3PL application and the Ewa zinc question. Earlier the same day: **SUPPLEMENT BUY-LIST WRITTEN, and the shop's growth rule is now catalogue-scope-equals-panel-scope.** New: `supplements/supplement-purchase-list.md`, every SKU the shop needs with its claim, its marker and the kit that carries it. Three buyable today (D3/B12/Zinc, £1.92/mo), eight blocked on a kit, and **three single-nutrient SKUs that do not exist at Nutribl — iodine, chromium, pantothenic acid — which are what decide how wide the shop gets.** Kit 3 Plus is the biggest unlock (4 supplements) and that REVERSES the 2026-08-22 read that scored it low; the earlier score screened for deficiency-correction, and the shop sells maintenance claims. Collagen, glucosamine and creatine are all out on the same ground: **no marker.** Earlier: 2026-08-22 (**Placement: a fourth option, D "declared block", is now built and is the recommendation; Keith has not picked yet.** D is B's report grammar with C's honesty: the same "what this means" / "why it never changes" column, but an inverted full-width bar above it reading "This is our shop, not part of your report" and a surface change, so the thin "same on every report" chip is deleted rather than restyled. It also fixes A's mobile failure by construction, because sitting in the report flow means it stacks after the numbers. All four recorded mockup defects fixed across every variant: B's recommend-strip CTA is now a ghost link, the em dash is gone, **no price is printed anywhere** (the 9.95 ladder assumed the still-open separate-bottles architecture; the only live figure is the £34.95 Daily Stack in `pricing.ts`) and **no zinc dose or salt is printed on artwork** pending Ewa. **Ordering: the placement pick does not depend on either open decision and should be made first.** Which of A / B / C / D the block uses is independent of what the products cost and what dose the zinc is; the reverse is not true, since nothing can be printed onto a pack or a price slot until the separate-bottles-versus-blended-Daily-Stack decision and Ewa's zinc ceiling answer land. Artifact `fbab8253-4da1-4cc4-8258-e593a3263908`, ClickUp `869eng0g5`. Earlier: 2026-08-21 (**NO RESULT-CONDITIONAL UPSELLING: the all-clear maintenance offer is SUPERSEDED and every customer will see the complete supplement range regardless of result** (Keith, 2026-08-21). **On a GP-referral result the range does not render at all**. This likely retires Ewa's item 2 below, because if the range does not vary by result then clause 2 is never engaged. ClickUp `869eng0g5`. Also: **Daily Stack cannot be made from Nutribl stock** — no bespoke route in their catalogue, no stock base to tweak, and the four-bottle route is under spec on zinc and ashwagandha, so the Daily Stack as specced does not currently qualify under Gate 0A. **OPEN: sell it as separate bottles** — COGS falls to ≤£1.92/mo, but ashwagandha cannot survive as a separate bottle and CA-026 clause 2 constrains the results page. **FAI: an NHS lab states the test is not valid in men**, and Kit 1 reports it — **RESOLVED the same day, it corroborates rather than contradicts us**: the engine already badges FAI `Reported` (unfilled), labels it "not interpreted", draws no conclusion and offers no CTA, per CA-034 K1. Not a gate. Four other questions owed to Ewa, none sent. Earlier: 2026-08-20 (~~**Joint & Recovery does not fit any Nutribl stock container**~~ — **WRONG, corrected 2026-08-22 against the catalogue export: Nutribl ID 1129 is `Collagen Powder 300g Plus Essential Vitamins — Unflavoured — 1000ml Cylinder Jar`, a Pont 1000 ml HDPE jar, 104 x 141.7 mm, in stock, trade £15.42, ~29 servings at 10.35 g. The container exists.** What actually differs is the FORMULATION (their stock 300 g product is collagen plus B-vitamins and vitamin C, not our hydrolysed + UC-II + MSM + HA spec), so this is a blend question, not a packaging question, and the bespoke-vs-sachets-vs-smaller-serving trilemma below was solving the wrong problem. Original claim retained struck through: 30 servings at ~11 g is ~330 g of powder, near 660 ml of bulk, against a 400 ml PET / 320 ml flat-packer ceiling. Bespoke at MOQ 500, sachets, or a smaller serving: all three are decisions, and the UC-II-versus-hydrolysed call now decides the container too. Earlier: 2026-08-20 (**SUPPLIER AVAILABILITY SOLVED FOR ALL FOUR SUPPLEMENT LOOPS**; the liver "no EFSA claim" assumption CORRECTED; the bottleneck on the loops has moved from the supplement side to the lab. Earlier: **Kit 1 marketing-page scope DECIDED**: split and route, delete nothing; copy drafted and pre-flighted, not shipped. Earlier: kit-1's FAI row corrected: it is returned by the lab, not calculated by us, and is reported without interpretation. Earlier: Vitall cost-vs-retail margin chart filed; stale retail table found in the v7 catalogue).))_

---

## ✅ 2026-09-16 — CA-048 APPROVED, AND THE CADENCE CHECKLIST IS CLOSED END TO END

**Keith, business sign-off, same day as Ewa's, on his direct instruction: *"CA-48 approved"*.** Both
required signers in. ClickUp `869f2jyce` set to `approved`.

✅ **Every row of `2026-09-15-retest-cadence-by-rule-kind.md` §5 is now closed.** Items 1, 2, 2b and
3 on 2026-09-15 (the `seasonal` kind, the two missing signed rows, the `fai-reported` cell, the
re-homed anti-upsell guard); items 4, 5 and 6 on 2026-09-16 (the integer 90, the dual rule, and a
fixture per signed cell); item 7 with CA-048.

⚠ **A CLOSED CHECKLIST IS NOT A SHIPPED FEATURE, AND BOTH HALVES ARE STILL INERT.** The map is built
and **read by nothing** — no mechanism in `retest-mechanism-map.md` imports it, so no customer's
date has moved. The screen is approved and **not built** — no route renders it. Those are two
separate pieces of work, each needing its own verification, and **neither is tracked by that table
any more.** That is worth stating plainly, because a table of ticks is exactly the artefact someone
later reads as "done".

🔴 **Four conditions ride with the screen to whoever builds it:** the NHS citation as a live link
(settled by Q1 = A); **the `SystemAlert` container, undecided and never put to Ewa**; a sweep of
every surface for a second, **machine-read** copy; and **the render obligation, undischarged**.

---

## ✅ 2026-09-16 — ITEM 7 IS CLINICALLY SIGNED (CA-048). Q2 came back B and went against the review

**Ruling:** `1: A 2: B 3: A 4: A 5: A`, Ewa, 2026-09-16 00:04 UTC, thread `1a0a77178beb2d2f`, **22
minutes** after sending. **Five letters against five questions**, expected count written down
before sending, rows counted as well as answers. Record:
`03_compliance/content-approval/approval-record-symptom-overlay-screen-2026-09-16.md`. ClickUp
`869f2jyce`. Artefact: `results-engine/2026-09-16-symptom-overlay-screen-copy.md`.

🔴 **Q2 = B IS THE ONE TO READ BEFORE ANYONE EDITS THAT SCREEN.** The independent compliance pass
called the **"Otherwise,"** option *"the single most useful thing to put in front of her"*, and the
argument was sound: her red-flag list opens with an unqualified **"chest pain"** while the paragraph
above routes *sudden or severe* chest pain to 999, so a man with sudden severe chest pain matches
**both lists** — and the `cholesterol-test` FAQ already resolves exactly that, after the word
"Otherwise". **The question named the conflict, quoted the precedent, and she chose the drafted line
anyway.** ⚠ **A considered ruling, not an oversight, and recorded because no reasoning was given:
inserting an "Otherwise," later reverses a clinical ruling rather than tidying a sentence.**

✅ **AND IT IS THE CASE FOR ASKING RATHER THAN ADOPTING.** Both options went to her because the
reviewer's argument was strong but was not the reviewer's to make. Adopting it on the strength of
that argument would have shipped an unsigned change into a screen she was about to sign, and it
would have looked like diligence.

🔴 **THE PRE-FLIGHT'S ONE HARD FINDING WAS IN THE TRIGGER CONDITIONS, NOT THE WORDS.** An earlier
draft scoped both composites to **Kit 3**, which measures all nine markers (`lib/kits/panel.ts:144`),
so there is no untested panel to widen to and the screen would have offered a man a panel he had
just bought and read. Four rules broke at once: §2a's untested-panel scope limit, CA-047 round 2 Q8
(no early repeat, with **no floor needed because the widen-first path was held to be the whole
answer**), the 2026-07-08 complement rule, and the CA-014 adjacency defence, which relies on the
suggestion being a complement rather than a re-measure. ⚠ **`resultMayCarryRetestOffer()` gives ZERO
protection here**: it keys on GP-badged states, and every marker on this screen is in range by the
trigger condition, so it returns `true`. **It was found by reading the panel definition, not the
copy** — the copy reads perfectly well while being wrong about who is looking at it.

⚠ **CORRECTING MY OWN FIRST WRITE-UP OF THAT FINDING.** I wrote that the Kit 3 case *"has no signed
copy and nobody has listed it"*, and compared it to `fai-reported`, the state that was missing from
every record. **That was false.** §2a's step-1 table lists Kit 3 explicitly — *"Kit 3 (superset) | —
| none left → GP"* — decided by Keith on **2026-07-17**. The routing was decided fourteen months
earlier and only the sentence was missing. **An undecided case needs a ruling; an unworded one needs
wording against a decision that already exists**, and the second is much the cheaper ask.

**The other four came back as drafted, so no copy moved and the pre-flight stands against the exact
signed text.** Q1 = A carries the 999 paragraph over **exactly as it appears on the articles**,
which ⚠ **includes the live NHS hyperlink** the draft had rendered as plain text. Q3 = A keeps
reader self-triage over asking the symptom questions directly, so ✅ **no red-flag symptom capture is
built, no new special-category data is collected, and the DPIA is untouched**. Q4 = A gives Kit 3 a
closing sentence with **nothing to buy**, which is the point of it: that man has spent the most and
has the fewest options left. Q5 = A leaves the vitamin D wording alone as blood markers to measure.

🔴 **NOT CLEARED TO BUILD.** Keith's business sign-off is owed, and four build conditions remain:
the NHS citation as a live link (settled), the `SystemAlert` container (**not** put to her), a sweep
of every surface for a second **machine-read** copy, and **the render obligation, which is
undischarged** — nothing has been rendered, and contrast, truncation and whether the 999 block
clears the fold on a phone all leave the string correct in the DOM.

---

## ✅ 2026-09-16 — THE CADENCE MAP IS BUILT (items 4, 5, 6). Correct, verified, and read by nothing

**Built:** `RETEST_CADENCE` in `09_website-app/frontend/lib/results/retestCadence.ts`, beside the
six rule kinds it was waiting on. **30 states, 30 cells, 33 rules** — the three duals are the
difference. The reduction ships with it, exactly as signed (CA-047 round 1 Q4 = C).
**Fixture:** `scripts/test-retest-cadence-map.ts`, **117 assertions**, in `npm test`.
**Build record with the full reasoning:** `results-engine/2026-09-15-retest-cadence-by-rule-kind.md`
§6. **Checklist items 4, 5 and 6 are closed; item 7 (the copy pre-flight) is the only open row.**

🔴 **NOTHING READS IT. Not one customer's date has moved.** All eight mechanisms in
`retest-mechanism-map.md` still pick their interval exactly the way they did yesterday. The wiring
is the next piece of work and it is the one with consequences; this change is reviewable line by
line against a clinical document, which is why it was kept separate.

⚠ **THE SHAPE CHANGED BY ONE WORD, AND ITEM 5 IS THE REASON.** The design doc proposed
`Record<ResultState, RetestRule>`. What is built is `Record<ResultState, RetestCell>`, a cell being
a **non-empty tuple** of rules, because the three sub-12 testosterone states carry `clinician-led`
**and** `confirm` at once and one rule per state cannot hold them. The alternative was a second map
of confirm overlays — the duplicated-fact shape this repo keeps paying for. **Non-empty by
construction on purpose:** an empty cell reads as "nothing decided" and behaves as "nothing
recommended", and "we recommend nothing" is a real clinical position (`none`) that must be stated.

✅ **THE FIXTURE IS AN INDEPENDENT RESTATEMENT, NOT A READ-BACK, AND THAT WAS PROVED RATHER THAN
CLAIMED.** Every expected rule is written as a literal, never as the constant the code uses, so a
test built from the same values it is testing cannot pass by agreeing with itself. 🔴 **The map was
then broken four ways and the suite watched failing each time** — the interval shortened to 84 days
(16 assertions fired), `shbg-low` moved into the maintenance bucket (4), the `confirm` deleted from
a dual cell (9), `fai-reported` collapsed into `clinician-led` (4) — and the file restored with the
hash compared. **A passing suite is not evidence that an assertion has force; watching it fail is.**

🔴 **`confirm` ALWAYS WINS IS A RULING, NOT AN OPTIMISATION, AND IT IS ASSERTED AGAINST A SYNTHETIC
CASE.** Every real `confirm` is zero days, so today "always wins" and "shortest wins" agree and the
branch looks redundant. It is pinned by a **180-day `confirm` no fixture produces**: if Ewa ever
moves the confirmatory recheck off zero, a 90-day recheck on another marker would start beating it
under shortest-wins and the confirmatory sample would silently stop being scheduled.

**Two cross-checks neither document asked for:**

- **The prepaid-or-included rule, expressed over the map instead of over a list of markers.** Swept
  across every 2026 anchor date: no cell contributes a sub-90-day interval except `confirm`, which
  is prepaid inside the Confirmation bundle. That is `2026-09-07-...` §1 as an assertion rather
  than a promise, and it is scoped by rule kind, which is how that carve-out went wrong last time.
- **`clinician-led` and the "See Your GP" badge are asserted to be the same set, both directions.**
  Two independently maintained maps encode one clinical fact, and `resultMayCarryRetestOffer()`
  derives from the badge — so a disagreement would schedule a retest for a man the card had just
  sent to his doctor, or withhold one from a man it had not.

⚠ **THE CONFIRMATORY `0` IS STORED TWICE AND IS DELIBERATELY NOT IMPORTED.** It lives here and as
`CONFIRMATION_INTERVAL_DAYS` in `lib/bundles/config.ts`, which the bundle dispatch path reads.
Importing it would reach `classifier.ts`, which is where this map gets wired in next, so the import
would build the cycle in advance. **A duplicated fact is invisible exactly while the copies agree**,
so it is held shut by an assertion rather than a comment: divergence is a failing build.

🔴 **Still shut and untouched by any of this:** the two `clinician-led` cards whose copy has been
live and unapproved since 2026-08-07 (CA-044 §2 item A, now 40 days), and item 7's copy pre-flight,
which still fails on the red-flag line's missing 999 escalation.

---

## ✅ 2026-09-15 — THE ANTI-UPSELL GUARD IS RE-HOMED (item 3). It was live, not forward-looking: 16 links on 6 fixtures

**Rule adopted (Keith):** **CA-014 binds the RESULT, not the marker.** When any marker on a result
routes to a GP, that result offers no retest to buy.
**Code:** `resultMayCarryRetestOffer()` in `lib/results/retestGuidance.ts`, enforced by one
cross-marker pass in `classify()`. **Recorded as a durable rule in `03_compliance/CONTEXT.md`.**
⚠ **A scope reading of an existing approval, not a new clinical ruling. Nothing was put to Ewa, and
no approved copy moved** — it removes commercial pressure rather than adding a claim.

🔴 **I told Keith this was forward-looking. It was not, and checking the code is what corrected
it.** Every card already obeyed CA-014 for itself — a GP-routed card returns `gpReferral` and
nothing else. But `classify()` resolves CTAs **per marker with no cross-marker pass**, so the card
next door never knew. A Kit 1 with testosterone at 8–12 rendered a GP referral on the testosterone
card **and "Retest in 6–12 months" pointing at `/kits`** on the SHBG, free-T and albumin cards.
**Measured before and after: 16 such links across 6 fixtures.**

🔴 **THE LESSON, AND IT GENERALISES: A PER-ITEM GUARD CANNOT SEE A PER-COLLECTION RULE.** The
repo's CA-014 regression guard is per card, it is correct, and **it passed the entire time this was
broken** — because every individual card was compliant. The rule it enforces is about the result.
The new guard sits **beside** it rather than replacing it, and the test file says why.

**Why it surfaced now.** Both cadence design docs proposed that a GP-routed marker suppresses the
whole-panel retest. Ewa rejected that (CA-047 Q4 = C) and was right **on the question she was
asked** — whether the retest is *scheduled*. **She was never asked whether it may be *sold*.** The
rejected rule was quietly carrying both; the cadence half went where she put it, and the commercial
half had no home until now. Re-reading the two candidate rules showed **neither reached the case**:
the prepaid rule binds only sub-90-day rechecks and `recheck` is 90 and carved out, while CA-014
was being applied per marker though its wording is per result.

**What it suppresses, and what it deliberately does not:**

- 🔴 **Suppressed:** the retest **offer** (the `retest-reminder` CTA, which points at `/kits`).
- ✅ **The retest INTERVAL survives.** It lives in Ewa-signed card copy. Removing it would recreate
  defect 3f — the man most likely to need a second test being the one never told when to take one.
  This is the information/offer split `retestGuidance.ts` was built around, doing its job.
- ✅ **Complement cross-sells survive** (`kit1CrossSell`, `kit2CrossSell`). They offer a panel we
  have **not** measured, re-test nothing, and the "here is the panel we have not checked" framing is
  the one the 2026-07-17 table endorses. Suppressing them would assert a rule **stricter than the
  one approved** — the exact error `mayCarryPurchaseLink` records itself making in its first draft.
- **Scoped by the PROPERTY** (any GP-routed state), never by a list of markers. The prepaid rule's
  carve-out was enumerated by marker and was wrong within 75 minutes when four states joined the set.

⚠ **No fixture produces a GP referral and a complement cross-sell together**, so the permissive half
of the rule had nothing asserting it and a later "tighten the guard" commit would have looked
correct and passed. **A synthetic panel was built by hand for that assertion alone.** The guard was
also negative-tested: disabling the suppression fails it with the 16 links named individually.

**Build checklist: items 1, 2, 2b and 3 are all closed. The reduction is unblocked.** Remaining on
the cadence work are the ordinary build items (4–7), of which 7 is the copy pre-flight that still
🔴 **has not cleared** on the red-flag line.

---

## ✅ 2026-09-15 — THE TWO MISSING BUCKET A ROWS ARE IN. The table is 28 rows, and checking that claim found a THIRD missing cell

**Rows added:** `high-testosterone` (T > 29 nmol/L) and `high-vitamin-d` (> 250 nmol/L), both
`clinician-led`, in `results-engine/2026-07-17-retest-cadence-table.md` §3 bucket A.
**Closed with NO new ask, and that was checked rather than assumed.**

🔴 **The sign-off already existed. The primary source proves it; nothing here is inferred.** Before
writing the rows I re-read the Q3 question **as sent** (Gmail `1a0a69ae55223fe0`, 19:46 UTC). It
lists the GP-routed bands and **ends with "testosterone above 29 nmol/L, vitamin D above 250
nmol/L"**. Ewa was shown both, by band, and answered **A**. Their GP routing was separately signed
on **2026-08-07** (CA-044: *"over 29+"*, and the vitamin D upper band as *"a high/clinical review
flag rather than just a technical out-of-range result"*). **Two signed rulings, composed — not an
adjacent answer being stretched to cover a third thing.**

⚠ **The defect was two records of one answer disagreeing, and the build was reading the thinner
one.** Her Q3 covered **ten** states. The table offered **eight** rows. The pack was assembled
before the 2026-08-07 upper bands existed and never gained them, so it under-described bucket A at
the moment it was sent.

🔴 **The check that exists could not have caught this, and that is the lesson worth keeping.** Both
rounds matched their expected answer counts exactly, and that was rightly treated as strong
evidence — but **the count is of ANSWERS and the shortfall was in ROWS.** A reply can be complete
against the questions asked while the questions are incomplete against the artefact. **Count both
sides, or the check only proves the reviewer replied.** This is the same failure as round 1's
"enumerated in prose rather than by row", one layer further out: there, the prose under-covered the
table; here, the table under-covered the prose.

✅ **AND THE SAME CHECK FOUND A THIRD MISSING CELL NOBODY HAD LISTED: `fai-reported`. IT IS NOW
ROWED TOO** (Keith, same day: the sixth kind, `none`).
Having written "the `Record` can now be exhaustive", I tested it instead of asserting it, by
diffing the `ResultState` union against both documents. **It was short by one.** Free Androgen
Index was the only state of the thirty appearing in **neither** the sign-off table **nor** the
rule-kind map, and it survived two sign-off rounds and three separate counts of "every row is
ruled" — because **every one of those counts was of the rows that existed.** A state absent from
both records is invisible to any check that reads either one.

✅ **DECIDED THE SAME DAY (Keith): the sixth kind, `none`.** It needed a SHAPE decision, not a
clinical one — Ewa ruling 8 (2026-06-16) already settles the substance: *"report-only, do not band
it in men"*. We draw no conclusion from the number, so we recommend no retest of it.
`retestGuidance.ts` had faced the identical question for guidance and gave it its own
`{ kind: 'none' }` rather than reusing a neighbour, so the map now mirrors that shape for the same
marker and the same reason. Rowed in both documents; `retestCadence.ts` gained the kind and the
suite gained 8 assertions.

🔴 **Most of those assertions guard ONE confusion, because it is the only one that would do
harm.** `none` and `clinician-led` both yield no date, which makes them look like duplicates worth
collapsing. They are opposites: `clinician-led` says **a doctor decides the timing** and renders a
referral, `none` says **we have no verdict at all**. Collapsing them would assert a GP route on a
report-only marker — **the FAI `default:` defect in a new place**, and that is the one this repo
has already paid for.

⚠ **The cell is DERIVED from ruling 8, not signed as cadence, and the table says so in its own
section rather than in a bucket.** Ruling 8 is about banding. The derivation is safe only because
`none` records the ABSENCE of a recommendation and therefore adds no claim. **Giving FAI an actual
retest date would be a new clinical claim and needs Ewa.** Build checklist item **2b**, closed.

**Consequential renumbering, applied everywhere:** the table is **28 rows, not 26**; round 1 is
credited with **23 of 28, not 21 of 26**; coverage reads **28 of 28**. Swept through the table's
banner and sign-off block, the CA-047 approval record (§2 Q3, §4 coverage table and header, §5), the
register's CA-047 row and its changelog, and this file.

🔴 **A SEPARATE GATE ON THESE SAME TWO STATES IS STILL SHUT, and adding a cadence row does not
touch it.** Their **card copy** is drafted and **unapproved** — `biomarker-copy.ts:81` and `:170`
still carry `NOT APPROVED` markers, re-verified 2026-09-15, and both have rendered to customers
since **2026-08-07**. That is **CA-044 §2 item A**, now 39 days open, and it is the oldest live
compliance item on the results engine. A `clinician-led` cell carries no date and no copy, so the
cadence is genuinely unaffected — **but nobody should read "row added" as "these two cards are
clear".**

**Build checklist status:** items 1, 2 and 2b are **done**. 🔴 **One blocker left and it is not
clinical: item 3, re-homing the anti-upsell guard** that Ewa's Q4 = C left unhomed against the
prepaid-or-included rule and CA-014, neither of which was written to carry it alone. ✅ **The map is
now complete over the union — 30 states, 30 rows — and that is asserted on every build rather than
claimed in a document.**

---

## ✅ 2026-09-15 — THE `seasonal` RULE KIND IS DESIGNED AND BUILT. The cadence build's first blocker is closed

**Doc:** `results-engine/2026-09-15-seasonal-retest-rule-kind.md`.
**Code:** `09_website-app/frontend/lib/results/retestCadence.ts`, with
`scripts/test-retest-cadence-seasonal.ts` wired into `npm test`: **36 assertions, full suite green.**
**No clinical input was owed and none was sought.** Ewa's CA-047 round 2 Q5 = A ruling is unchanged,
and her approved card wording is unchanged. **No copy moved.**

🔴 **What it closes is a silent wrong answer, not a gap.** With four kinds, `normal-vitamin-d`
(50–250 nmol/L) fell through to `clinician-led`, so the product **shows a man no retest date at all
on a perfectly normal vitamin D** — the most common in-range result the UK produces. That is why
this was item 1 of the build checklist and why it sat in front of items 2 and 3.

**The shape:** `{ kind: 'seasonal'; window; minGapDays: 90; minSpanDays: 30 }`, resolving against
the result date to a **sampling window**, not a single date. Her ruling constrains **when the blood
is drawn**, so a mechanism has to subtract its own lead time from the window's near edge. The
clinical fact and the dispatch logistics stay in separate layers.

**Two guards. One is inherited, one is Keith's, and the doc says which is which:**

- `minGapDays` = **90**, inherited from `2026-09-07-fast-recheck-must-be-prepaid-or-included.md`.
  ⚠ **`seasonal` is INSIDE that rule and `recheck` is not** — the §2 carve-out was granted to
  `recheck` on the substance, and a seasonal retest of a **normal** result is not that species.
  Without the floor, a result landing on 30 September yields a retest **one day later**.
- `minSpanDays` = **30**, the shortest remaining window in which a mechanism can still land a kit.
  🔴 **The only number in the design that is neither clinical nor inherited.** Without it, a result
  landing on 30 December yields a **two-day** sampling window and the opportunity is lost silently.

🔴 **The unavoidable discontinuity is named and placed, not discovered later.** A window is an arc
and the year is a circle, so a rule of this shape has **exactly one cliff per year**. Swept over all
1096 anchor dates in 2026–2028: an anchor of **2 December gets 90 days, 3 December gets 302**. That
placement is deliberate — the men beyond it were sampled in early winter and already hold an
in-season reading. **The unguarded rule puts the cliff on 30 September, landing it on men with
summer readings: precisely the cohort the ruling exists for.**

⚠ **Same class of defect as `{ days: 90 }` versus "3 months"**, and found the same way: by sweeping
every date rather than checking a few. The sweep is now an assertion in `npm test`, not a paragraph.

✅ **The safety property that makes it cheap to adopt:** gaps run **90 to 302 days**, so the kind can
bring a man forward and can **never push him past the 12-month edge of `maintenance`** he would
otherwise have had. It moves men earlier inside a range already signed, never later.

🔴 **It is the only kind that can FAIL to resolve, and it fails loudly.** `collectedAt` reads
`received_at` and is nullable, so a missing anchor is a real runtime state; the resolver returns
`{ ok: false, reason }` and every caller must handle it. A date anyway, "no date", or a quiet fall
back to `clinician-led` would each reproduce the defect the kind exists to close — the shape this
repo has already paid for twice (the FAI ruling implemented as a missing `case`, and the `BADGES`
`default:`).

**Deliberately NOT done, so this change stays inert:** no `RETEST_CADENCE` map (nothing imports the
module), no customer-facing sentence, no reduction. 🔴 **The remaining blockers are now items 2 and
3: ~~add the T > 29 and vitamin D > 250 rows~~ ✅ **done 2026-09-15** (and a third, `fai-reported`,
found missing from both documents and rowed the same day as the sixth kind, `none`), and re-home the
anti-upsell guard that Ewa's Q4 = C left unhomed.** ⚠ **Surfacing the computed window to a customer
as a date would be new copy owing its own pre-flight.**

---

## ✅ 2026-09-15 — THE CADENCE PACK IS ANSWERED IN TWO ROUNDS. EVERY ROW IS RULED, and the one round-1 answer that was not "as drafted" inverted the mixed-panel rule

**Sent 2026-09-15 19:46 UTC, answered 20:18 UTC.** Ewa's direct written reply from
`ewalindo@live.co.uk`, Gmail thread `1a0791e8fa8ed170`: **`1: A 2: A 3: A 4: C 5: A`**.
Compliance record **CA-047**. Nothing is built, no flag has moved, no copy has changed.

🔴 **Q4 = C IS THE ONE TO READ. THE PROPOSED SUPPRESSION RULE IS REJECTED.** The packet asked what
the engine does when one panel carries a GP-routed marker and a correctable deficiency. The
proposal, in both the design doc §4 and the table §3a, was that **a GP referral suppresses the
whole-panel retest**. Ewa took option (c): *"The vitamin D retest is scheduled normally. The two
markers are unrelated and the GP referral does not conflict with it."* Not the proposal, and not
option (b), which was the author's stated instinct.

**The signed rule is: retest timing is decided PER MARKER, never per panel.** A GP referral removes
the date for the marker that triggered it and touches nothing else. Read with her Q3 = A (GP-routed
markers get no Andro Prime interval at all, the card shows the referral instead of a date), the
worked example resolves as **a GP referral for the CRP and a 3-month vitamin D retest on the same
result**. She also answered the related boundary explicitly in the affirmative: a GP referral is
**not** the end of our involvement for that panel.

⚠ **Rule 1 was carrying something other than cadence, and that load has not been re-homed.** It was
the anti-upsell guard stopping a man being sent to a doctor and scheduled a kit in the same breath.
That now rests **entirely** on `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` plus
CA-014, and neither was written to carry it alone. **Re-read both against this ruling before
building the reduction.**

✅ **THE 90-DAY BOUNDARY IS SETTLED THE SAME DAY (Keith).** Bucket B is scoped **out** of the
prepaid rule, as a third carve-out row beside the complement cross-sell and seq-04 e5, **and the
cell stores `{ days: 90 }` rather than the phrase "3 months"**. Both halves are deliberate: the
carve-out is the principled one and lets the number move later without reopening the commercial
question, while the integer means a reader who never finds the carve-out still lands right, since
90 is not *less than* 90. Doc: `results-engine/2026-09-07-fast-recheck-must-be-prepaid-or-included.md`
§2a and the new third row of §2.

⚠ **Correcting a claim this file made earlier the same day: "3 months is exactly 90 days" is
wrong.** Computed across every start date in 2026 to 2028, three calendar months is **89 to 92
days**, and **58 of 1096 start dates fall under 90, every one in late January or February**. Had
the cell stayed a phrase, the commercial rule would have applied to about 5% of men on the basis of
nothing but the month their blood was drawn, and a leap year would have moved them back out.
**Store the integer, never the phrase.** 🔴 **Guard: any proposal to shorten a bucket B cell below
90 days reopens §2a** — "12 weeks" is 84 days and crosses back under silently.

**Why the alternative was rejected:** treating 3 months as inside the rule would have quietly
undone Ewa's Q4 = C the same day it was given. §8 says a fast recheck for a customer holding no
entitlement outputs the GP route or the long window, so a man with low vitamin D and no membership
would have been given 6 to 12 months instead of his 3 months. She would have preserved the
deficiency follow-up clinically and we would have removed it commercially.

**The other four came back as drafted**, which means no copy sweep anywhere:

| Q | Answer | Effect |
|---|---|---|
| 1 — all-clear interval | **A**, 6 to 12 months as written | **No copy sweep.** The dashboard, FAQ, how-it-works and both LPs already say this. Signing makes it binding rather than incidental |
| 2 — acting on a finding | **A**, 3 months for all of them | ⚠ **Narrows two proposed cells**: normal-testosterone (low half) was 3–6, suboptimal-ferritin was 3–4. Both are now 3 |
| 3 — GP-routed | **A**, no Andro Prime interval, card shows the referral | Fills all 8 bucket A rows as `clinician-led`. Partly answers 3f owed item 9 (the GP-routed 10) |
| 5 — straight-to-GP line | **A**, the red-flag list verbatim | Closes owed item 6. 🔴 **PRE-FLIGHT RAN AND DID NOT CLEAR, see below. The line may not ship as written** |

## ✅ CA-047 APPROVED (with conditions) 2026-09-15, and the pre-flight earned its place

Keith signed off the same day ("CA-47 approved"); ClickUp `869f2hvtd` at `approved`. **The 21
signed interval cells and the Q4 = C reduction rule are approved and buildable.**

🔴 **THE Q5 PRE-FLIGHT RAN AND DID NOT CLEAR. The red-flag line may not ship as written.**
Deterministic floor clean (0 HARD / 0 REVIEW). **The judgement pass found what the scanner cannot
see:** the list Ewa ratified routes **all** chest pain to a GP, contradicting her own standing
ruling of **2026-08-18, "999 for sudden or severe, GP for the rest"**. As written, a man with
sudden severe chest pain is told to speak to his GP.

**Not a reviewer error.** Q5 asked which symptoms skip the "try another panel" step, not 999 versus
GP, so the escalation is a **layer above** her answer rather than a correction to it. Her list is
almost word-for-word the GP half of the two-part block already live on `cholesterol-test`.

✅ **The fix is additive, carries her own signed wording and needs no new ask:** a "Read this part
first. Call 999 now if:" block above the GP list. ⚠ **Carry the 2026-08-18 sweep's derivative
trap:** its frontmatter FAQ needed the line too and was nearly missed, being machine-read into FAQ
schema. 🟢 **This blocks one line and nothing else.**

## 📐 THE BUILD INPUT IS NOW WRITTEN: the signed map, keyed by rule kind (2026-09-15)

**New: `results-engine/2026-09-15-retest-cadence-by-rule-kind.md`.** The same 29 signed states as
the 2026-07-17 table, **re-projected into the shape `RETEST_CADENCE` actually stores**: 10
`clinician-led`, 3 `confirm` (which are also clinician-led, deliberately), 10 `recheck` at
`{ days: 90 }`, 8 `maintenance` at 6-12 months, and 1 `seasonal`. Counts cross-checked against the
sign-off table rather than asserted.

🔴 **It exists because the buckets and the rule kinds stopped agreeing after round 2.** `shbg-low`
and `shbg-high` sit under a heading that says "all-clear / maintenance" and carry 90-day `recheck`
rules; `normal-vitamin-d` sits there and carries a `seasonal` rule. **Anything deriving a kind from
a bucket heading gets those three wrong, silently.** The new file carries the build checklist and
named three blockers: ~~design the `seasonal` kind~~ ✅ **done 2026-09-15**, add the two missing
rows, re-home the anti-upsell guard. **Two left, and both are now the front of the queue.**

---

## ✅ ROUND 2, 21:33 UTC — THE TABLE IS NOW FULLY RULED, AND TWO ANSWERS CHANGED ITS SHAPE

🔴 **Round 1 reached only 21 of 26 rows, and a fully answered email is not a fully signed table.**
Its questions enumerated the states they covered **in prose** rather than by row, so the gap was
invisible from both ends: she answered every question asked, every answer was received, and the
shortfall surfaced only by hand-diffing her prose against the table.

**A follow-up packet closed it the same evening.** Sent 21:06 UTC, answered 21:33, 27 minutes:
`1: A 2: A 3: B 4: B 5: A 6: A 7: A 8: A`. **Eight for eight, against a count recorded before
sending.** Closed: `ft-low` (3 months), the CRP **joints = yes** branch (3 months, asked rather
than inferred), `shbg-low` and `shbg-high`, `normal-vitamin-d`, the `normal` fallback, and §4's
Q4(a) and Q4(c).

🔴 **Q3 and Q4 came back B, and that is a change of RULE KIND, not of value.** Both SHBG states sat
in bucket C at a proposed 6 to 12 months; at **3 months** they are `recheck` (`{ days: n }`), not
`maintenance` (`{ fromMonths, toMonths }`). **They keep in-range band definitions and carry a
bucket B rule kind.** The bucket headings are presentational; the kind is what the lookup stores.

⚠ **This falsified something written 75 minutes earlier.** The prepaid rule's new carve-out
enumerated the bucket B markers **by name** and was short by four: `ft-low`, the joints = yes
branch, `shbg-low`, `shbg-high`. **Two of those are in-range states**, so no amount of re-reading
bucket B would have found them. **The carve-out is now scoped by rule kind**, which is
self-maintaining. A carve-out enumerated by instance goes stale silently, because the list still
reads as complete.

✅ **Q5 = A preserved a ruling the design could not store, and the fifth kind now exists.** "Retest
heading into autumn or winter" is neither `{ days }` nor `{ fromMonths, toMonths }`, so
`RETEST_CADENCE` needed a fifth kind before `normal-vitamin-d` could be filled at all — without it
the cell falls back to `clinician-led` and shows a man no date on a perfectly normal result. A gap
her answer exposed in the design, not a defect in it. **Closed the same day by design, with no
further clinical input:** `results-engine/2026-09-15-seasonal-retest-rule-kind.md`. See the entry
at the top of this file.

⚠ **Q6 = A means there IS a default.** She declined "no default at all", which was the safer
construction and the one §2 of the design doc argues for off the back of the `BADGES` defect. **A
marker added later now inherits 6 to 12 months silently rather than showing no date.**

⚠ **Q7's copy is signed and does not exist.** Two sentences ratified verbatim that were written for
the packet and have never been in the product. Building them is a copy change owing its **own
pre-flight**, on the same screen as the red-flag line. 🔴 **That screen needs the full stack in
order: the 999 block, then the red-flag GP list, then the panel suggestion.**

**The one coverage item neither round closed:** two signed states had **no row** in the table
(T > 29 nmol/L, vitamin D > 250 nmol/L), because that was a missing row rather than an unanswered
question. ✅ **Both rows added 2026-09-15; the table is 28 rows.** See the entry at the top of this
file.

✅ **She had signed two states the table had no rows for**: **T > 29 nmol/L** and **vitamin D >
250 nmol/L**, both `clinician-led`. They existed in `thresholds.md` (added 2026-08-07) but were
never carried into the pack. Rows added, along with `fai-reported` — which was in neither document — as the sixth kind, `none`. ✅ **30 states, 30 rows, asserted on every build.**

**One safety property was lost and needs replacing.** The design doc said the map "ships inert"
because only one cell was signed. With 22 signed, **building it will move real dates**, so the
build needs its own verification that each signed cell does what the table says. Docs updated:
`2026-07-17-retest-cadence-table.md` (all three buckets, §3a, §4, §6), `2026-09-06-result-driven-retest-cadence.md`
(§3, §4, §7, §9), `retest-mechanism-map.md` (§5, owed items 5, 6, 9).

---

## 2026-09-13 — Three of the six retest defects are CLOSED, and the fourth is drafted

Worked in order against `results-engine/retest-mechanism-map.md`. **Keith decided
each one in session; every entry in the map's Owed table below is updated.**

- ✅ **3a CLOSED.** *"Point the check at the results engine instead of the row
  count."* The cadence check asked whether the member had ANY `lab_results` row;
  joining requires one, so the 365-day path was unreachable and every all-clear
  member was posted a 90-day retest at our cost. Now `decideRetestCadence` over
  `isFlaggedState` — the same predicate the panel rule uses — with four
  non-collapsed outcomes and a Sentry alert on a degraded read.
- ✅ **3b CLOSED, migration LIVE IN PRODUCTION.** Keith took the dispatch-table
  option; the table already existed, and the missing half was rolling the date
  forward. **Two latent defects were found in the guard while implementing it** —
  `membership_retest` was never an allowed `bundle_type` (every insert would have
  failed) and the one-open-retest index guarded a status the table has never
  allowed. Both repaired in `20260913_membership_retest_rolls_forward.sql`,
  applied on Keith's go-ahead and verified against the live catalogue.
- 🟡 **3c DRAFTED, not approved.** Copy written, pre-flighted, and built as
  Customer.io campaign 25 in `draft`. Verdict **`amber-ewa`**.
- ⏸ 3d, 3e, 3f untouched (ClickUp `869eyg5b6`).

🔴 **THE SIGN-OFF PACKET BELOW SHOULD GAIN A SIXTH QUESTION BEFORE IT IS SENT.**
It is still unsent, so this is free. The 3c pre-flight found that **CA-022's
approval is scoped to all-clear kit buyers while the new email's audience is the
flagged cohort, See-Your-GP included** — which is 3f, and Owed row 9 already
reserves that wording to Ewa. The Phase-0 confirmatory-testing question (CA-026
audit item F4) belongs in the same packet. **Expected reply then becomes six
letters, not five**; update the expectation wherever it is recorded before
sending, or a complete answer will read as a gap.

---

## 📧 The retest cadence pack is rewritten and a sign-off email is DRAFTED for Keith (2026-09-07)

> ✅ **THIS ENTRY IS HISTORY. The pack was SENT 2026-09-15 19:46 UTC and answered at 20:18, then a
> second pack closed the remaining rows at 21:33. CA-047 is APPROVED.** See the two 2026-09-15
> entries at the top of this file. Kept because the rewrite it describes is why the pack could be
> sent at all.

~~**Gmail draft id `r1901433818987540044`, subject "Retest timing: five questions". NOT SENT.
Sending is Keith's act.**~~ Expected reply: **five letters**. Anything fewer is a gap to chase, never
to infer. **Five came back.**

**Why the pack needed rewriting before it could be sent.** `2026-07-17-retest-cadence-table.md` had
been waiting on Ewa since July, and its §1 justification asked her to resolve a three-way copy
contradiction (dashboard "3 months", cards "3-6 months", site "6 to 12 months") **that has since
been fixed**: the classifier now reads "Retest in 6-12 months", `biomarker-copy.ts` has no "3-6
months" string, and all four marketing surfaces say "6 to 12 months". Its §5 "what changes once you
sign" listed work already done. Sent as written she would have ruled on a world that no longer
exists. §1, §5 and the header are rewritten; **the bucket tables and the §2a symptom overlay, which
are the actual substance, are untouched.**

**The pack's stakes went UP, not down.** It is now the document that fills `RETEST_CADENCE`, the
single state-keyed lookup proposed in `results-engine/2026-09-06-result-driven-retest-cadence.md`
that every retest mechanism would read from. It moved from an alignment exercise to the blocking
clinical input for machinery.

**New section 3a, which did not exist before:** what the engine does when one panel carries both a
GP-routed marker and a correctable deficiency. The table rules one marker at a time and a Kit 3
carries nine. Three options are put to her with a worked example (CRP 14 plus vitamin D 38). This is
the sharpest clinical question in the packet and it changes whole-panel behaviour, not copy.

**The five questions:** the all-clear interval, the acting-on-a-finding interval, what GP-routed
results get, the mixed-panel ordering (3a), and the straight-to-GP red-flag line she flagged in July.
Blast radius is marked on three of them. The preamble states that answering all five **is** the
sign-off, so there is no umbrella question to be silently dropped.

**Deliberately kept out of her way:** Keith's prepaid-or-included rule is mentioned once, at the
end, explicitly as something that constrains what we may do commercially with her answer and not
what her answer should be.

---

## 🔴 The retest mechanism map, and the three defects it exposes (2026-09-06)

**New reference: `results-engine/retest-mechanism-map.md`.** Built by reading the code, not the docs.

**Why it exists.** `results-engine/2026-07-17-retest-cadence-table.md` answers *what interval should we
RECOMMEND per result state*, which is clinical and Ewa's. Nothing answered the other question: **what
date does the system actually STAMP, from which anchor, into which column, behind which flag.** The
emails need the second one, because an email cannot quote a recommendation, only a stored date. Eight
mechanisms compute a retest date: three bundle constants, three membership constants, the Customer.io
`retest_due_at` attribute, and the seq-04 e5 delay.

**Defect 1: the all-clear member gets a 90-day retest and the code says he must not.**
`memberHasMarkerToMove` returns true when the member has ANY `lab_results` row, and the checkout route
only lets him join if a result arrived in the last 30 days. So the predicate is always true,
`ANNUAL_RETEST_DAYS = 365` is unreachable, and every all-clear member is sent the kit `entitlement.ts`
itself calls *"selling a test we do not think he needs"*. It contradicts bucket C of the cadence table.
**The 365 is unit-tested**, which is why nobody noticed: the test passes the boolean in directly, so it
proves the arithmetic and cannot see that the input is impossible.

**Defect 2: the membership retest is a one-shot.** `nextRetestAfter` is never called in production and
`next_retest_due_at` is written exactly once, at signup. Once the sweep stamps `retest_claimed_at` the
entitlement never returns, so a member gets ONE retest ever while paying GBP 47 a month indefinitely.
`../01_strategy/financial-model/2026-08-24-membership-year-1-forecast.md` says *"One retest included
per year."*

**Defect 3: three anchors.** Purchase (timed bundles), Stripe checkout (membership), result landing
(Confirmation, bank, CIO reminder). A slow lab separates them. This is the same anchor decision
`../01_strategy/STATE.md` carries as the next one owed after the 2026-08-27 first-month ruling, and
the map is the argument for settling it: the anchor is not a membership detail, it is the field every
retest email reads from.

✅ **The good news, recorded so it is not re-litigated: the copy layer now agrees with itself.** The
dashboard CTA, `biomarker-copy.ts`, `how-it-works`, `faq` and both landing pages all say 6-12 months.

⚠️ **The 2026-07-17 cadence table must not be chased as written.** Its section 1 asks Ewa to resolve a
three-way contradiction that has since been fixed, and its section 5 lists work already done. The
clinical content and the symptom overlay are still worth her sign-off; **the justification needs
rewriting first**, or she rules on a world that no longer exists.

**Nothing here changes code.** Defects 1 and 2 are build tasks behind `MEMBERSHIP_ENABLED` and need
Keith's call on the anchor first.

🔵 **PROPOSED THE SAME DAY, off the back of the map: `2026-09-06-result-driven-retest-cadence.md`.**
Keith: *"a retest can be fired at any time based on the results. If testosterone is low, a recheck can
be fired within days as opposed to weeks or months."* He is right, and **one mechanism already works
that way**: the Confirmation bundle reads the testosterone value and stamps the recheck due immediately
below 12 nmol/L, which Ewa signed on 2026-07-26. It is the only one; the other seven pick an interval
from a constant that never looks at the result. **The proposal is one exhaustive
`Record<ResultState, RetestRule>` every mechanism reads from**, the same shape as `BADGES` and
`BIOMARKER_COPY`, so adding a biomarker without deciding its retest rule fails the build. The rule
carries a KIND, not just a number (`confirm` / `recheck` / `maintenance` / `clinician-led`), because a
GP-routed result must not fall through to a date: that is the FAI-by-omission bug again. ~~**It ships
inert** (one cell is signed)~~ **CORRECTED 2026-09-15: it no longer ships inert. 22 cells are signed
(CA-047), so building it will move real dates and needs its own verification**; it still **fixes
defect 1 for free**, since `memberHasMarkerToMove`'s own comment says the fix is the classifier's
verdict, which is what the lookup is.

🔴 **Two calls are Keith's and one is Ewa's.** ✅ **The anchor is DECIDED 2026-09-07: the RESULT LANDING** (Keith, `../01_strategy/2026-09-07-anchor-everything-to-the-result.md`), which also opens a new undecided question about timed bundles whose customer never posts a sample. ✅ **The prepaid-or-included constraint is ADOPTED 2026-09-07** (Keith), recorded at `results-engine/2026-09-07-fast-recheck-must-be-prepaid-or-included.md`: **a result-triggered recheck under 90 days must be prepaid or included in an entitlement he already holds, and may never trigger a new sale.** Scoped so it does NOT touch the complement cross-sell (untested markers, governed by the 2026-07-08 rule) or seq-04 e5 (subscription-anchored, measures supplement effect). **Every live CTA was enumerated and nothing violates it**, so no copy moves and there is no Ewa escalation. It completes the set CA-014 and the complement rule started: we do not monetise the moment a result lands. It also gives the membership a proposition it did not have, which is the best answer yet to the "nothing to deliver in months 2 to 12" gap. Originally written as: adopt the RESULT LANDING as the anchor (a
result-driven cadence has no other anchor, and it reaches the same answer the membership anchor
recommendation reached by a different route); and adopt or reject the hard rule that **a recheck under
90 days must be prepaid or included, never a new sale**, which is what keeps a fast recheck from
reading as manufacturing a repeat purchase off bad news. Ewa: the whole-result reduction ordering when
a panel carries both a GP-routed marker and a correctable deficiency.

---

## Results-engine thresholds: two stale sections corrected (2026-08-27)

🔵 **`results-engine/thresholds.md` had two per-marker sections describing decisions as OPEN that
were ratified by Ewa on 2026-06-16 and shipped the same day in `4f05ad6`.** Found while sourcing
numbers for a homepage mockup, not by any sweep.

- **Active B12** carried a "⚠️ CODE CHANGE RECOMMENDED ... Ewa to confirm" banner and a two-band
  `<37.5` / `≥37.5` table. The shipped scheme is the NG239 three-band `<25` low / `25–70`
  `borderline-b12` / `>70` normal (`classifier.ts:325-327`), re-ratified 2026-08-07.
- **Ferritin** said the engine had "no high-ferritin flag at all" and listed two open items for
  Ewa. Both shipped: `>300` → `high-ferritin` → GP referral, and the 30–100 band is relabelled in
  the customer copy ("borderline range", "indeterminate rather than reassuring").

**Why it survived:** in both cases the top-of-file summary table, the locked-decisions line and the
code were all correct, and only the detailed per-marker section was stale. That is the section a
reader lands on when they look up "what are the bands for X", so the single wrong copy sat in the
highest-traffic position. Three stores agreeing is not evidence about a fourth.

**Still open, and cosmetic only:** the internal state id `suboptimal-ferritin` no longer matches the
copy it renders. Rename is a tidy-up, not a gate.



## Daily Stack CANNOT be made from Nutribl stock, and the fix reopens two Ewa rulings (2026-08-21)

Counterpart to the Joint & Recovery container finding below. **Verified** by parsing the full Nutribl trade
catalogue Keith supplied 2026-08-20 (`nutribl_catalogue - Products.csv`, 138 products, his logged-in Tier 1
pricing). **VERIFIED AGAINST THE INBOX 2026-08-22** (`keith@andro-prime.com`, searched by supplier name and by domain). **Nutribl have still never been emailed.** The only Nutribl message in the mailbox is an automated "Thank you for registering" from `orders@nutribl.com`, 2026-08-19 22:05. The catalogue and the Tier 1 pricing came from **self-serve trade-account access**, not from correspondence: no enquiry sent, no human reply, no quote. The account was created via a **web form on their site**, not an email, which is why no sent message exists (Keith, 2026-08-22). **Nutribl remain the SINGULAR LEAD** and are the reason the whole separate-bottles route is costed: theirs is the most reasonable pricing seen anywhere. **The three manufacturers who WERE emailed are ruled out on product fit** (Keith, 2026-08-22): their ranges do not suit our panels. Vita Manufacture and Rawcreation both replied and are parked rather than dead; Synergy Biologics never replied. All four threads are filed under each partner's `correspondence/`. **The supplement launch now reduces to ONE conversation with Nutribl and three questions**: will they private-label print our branding onto the stock bottles, at what MOQ and cost, and can they hold supply. Route offered is the trade counter plus an order line, **0800 061 4487** — no named contact, no account manager, no booking link. **CATALOGUE EXPORT ANALYSED 2026-08-22, and it answers the printing question outright: 136 of 138 SKUs carry "Wholesale private label orders 4-5 working day lead time", and the export publishes a full artwork spec per SKU** (label size, 2 mm bleed, exact submission dimensions, and a `PL-xxx.docx` mandatory label-text file). Private label IS their business model; it does not need asking. **All three single-nutrient SKUs verified in stock at one-a-day dosing, and the £1.92/month COGS is confirmed exactly**: D3 4,000 IU 365 tablets (ID 1152) £3.00 = £0.25/mo, Zinc 15 mg 120 caps £2.72 = £0.68/mo, B12 methylcobalamin 1 mg 120 caps £3.95 = £0.99/mo. **The D3 SKU is exactly the "4,000 IU · 365 tabs" product already drawn in the results-page mockups.** **PDF CATALOGUE 2026-08-22 ANSWERS THE PRINT COST**: the CSV held 138 products, the PDF indexes 164, and the 26-entry difference is the **private-label SERVICE SKUs**. Setup for three bottles is **£80 CORE / £140 CLASSIC / £220 PREMIUM one-off**, and the CLASSIC 5-slot Starter Bundle at £145 beats building three at £140. Design alterations £5-£20; 3D pack-shot renders £20, which retires the CSS pack shots in the mockups. 🔴 **Vector source files cost £109 extra (SER116), so we do not own artwork Nutribl design unless we pay.** Also from the PDF: **the D3 4,000 IU SKU carries the manufacturer's own caution to use it "under guidance of your health professional, or pharmacist"**, which strengthens the D3-above-ceiling carve-out; **it is vegetarian but NOT vegan** (the only vegan D3 is 1,000 IU); **zinc carries a soy allergen declaration**; and the 300 g collagen meets 3 of 5 spec actives, missing only UC-II and MSM, **which Nutribl already blend into their pet joint powder**. ~~**The single remaining unknown is MOQ**~~ **ANSWERED 2026-08-23: MOQ is 10 units per SKU**, from Nutribl's Dropship Light 3PL page, now filed at `../05_partners/manufacturers/nutribl/NutriblDropshipLight3PL.pdf`. **The same page answers fulfilment**: Nutribl label our stock and pass it to a 3PL partner who warehouses it and ships our orders, invoiced monthly. **The launch three therefore cost about £96.70 of stock, so Gate 0A's ~£5,950 capped-exposure figure is two orders of magnitude too large.** ~~What remains open is whether we may submit our own print-ready artwork instead of buying a design tier.~~ **ANSWERED 2026-08-24 by Alison at Nutribl: own artwork is accepted and free**, which also removes the GBP 109 vector-source charge and makes the CLASSIC bundle optional. **Still ignored by them: whether we can choose which authorised claims appear on the label**, which matters more now they have confirmed **we are the Food Business Operator** and carry the legal responsibility for that wording. See `../05_partners/manufacturers/nutribl/correspondence/2026-08-24-alison-nutribl-reply-question-diff.md`. One negotiation lever found: **the Tier 1 discount is close to nothing** — trade price differs from list on only 4 of 138 SKUs — so a better tier at volume is worth raising. Everything else on the supplement side is ours to decide.

**Three routes, and only one survives.**

1. **Closest stock formulation plus a tweak** — the route the 2026-06-26 directive told us to take. **Dead.**
   Only two stock products combine zinc with D3: a 24-ingredient Vegan Multivitamin containing **iron**
   (a deliberate refusal in our range, and the guess-pill we sell against), and a Shilajit Adaptogen Complex
   at D3 200 IU against our 4,000 and zinc 5 mg against our 25. There is no men's multivitamin in the range.
2. **Bespoke blend** — **not offered anywhere in the catalogue.** The 138 products are stock private-label
   only; the words bespoke, custom formulation, MOQ and setup fee do not appear. Whether Nutribl blend at all
   is unknown and is question one on the call.
3. **Four separate stock bottles** — available today, MOQ 10, 4–5 working days.

**Route 3 costs £5.01/month, and that figure is computed at one unit a day of each, which is UNDER SPEC on
two of the four actives.** Zinc 15 mg citrate against 25 mg gluconate (one zinc SKU exists; two capsules is
30 mg, the exact dose Ewa removed on 2026-08-02 for exceeding the supplemental ceiling), and KSM-66 500 mg
against 600 mg. **The specced zinc dose is unreachable on this route at any price.**

Per-active monthly cost, verified from catalogue prices: D3 4,000 IU £0.25 · Zinc 15 mg £0.68 ·
Methylcobalamin 1 mg £0.99 · **KSM-66 500 mg £3.09**. Ashwagandha is **62% of the ingredient cost** and is the
one ingredient we may never name in copy.

**Two consequences for Gate 0A.** Gate 0A requires "stock private-label only, already stability-tested" and
"clean 4-active spec held". Route 3 satisfies the first and breaks the spec; route 2 breaks the first and needs
~£750 of new V7.2 stability testing. **The Daily Stack as specced does not currently qualify under Gate 0A as
written.** Widening 0A to permit one bespoke line is a Keith decision, not a procurement detail.

Notes on Nutribl's zinc, since it changes the shape of the Ewa question: their listing carries the exact EFSA
claim we need ("maintenance of normal testosterone levels in the blood"), so a citrate swap is **not** a
regulatory problem. It is an evidence question — Prasad 1996, the trial our own evidence review cites, used
gluconate at ~30 mg in marginally deficient men.

## DECIDED 2026-08-22 (Keith): sell as SEPARATE SINGLE BOTTLES, not one blended capsule

Raised 2026-08-21, **decided by Keith 2026-08-22**. The arithmetic below stands; what follows is
what the decision settles.

- **The blended Daily Stack is dead.** It cannot be made from Nutribl stock, and no bespoke route
  was ever offered.
- **Ashwagandha goes.** A bottle's statutory front-of-pack name IS the ingredient, so the
  silent-ingredient guardrail cannot be complied with in a bottle configuration. It was also 62% of
  the ingredient cost, so this is a margin win as well as a compliance one.
- **Launch range is Vitamin D3, Active B12, Zinc.** Verified in stock, £1.92/month combined COGS.
- **The range grows with the panels.** Each kit brings its aligned supplements as it launches. This
  is a durable product rule, not a one-off; it belongs in `CONTEXT.md` once the shop ships.
- **Collagen is parked, not killed.** The container exists (Nutribl 1000 ml jar); the gap is
  formulation, missing UC-II and MSM. Separate track, does not block the three bottles.

**Consequence: the whole public supplement surface is built for the dead product.** `/supplements` sells Daily Stack, Joint & Recovery Collagen and a Complete Stack as "coming
soon"; `pricing.ts` carries `DAILY_STACK_MO 34.95`, `COLLAGEN_MO 29.95` and
`COMPLETE_STACK_MO 54.95`; the results classifier routes to `/supplements/collagen`;
the waitlist tagged people `interested_in_product = daily-stack`. **A decision sweep is owed
and has not been run** (Keith deferred it 2026-08-22).

**What it does to the economics.** The modelled £13/month COGS was built for a bespoke blend carrying amortised
MOQ and setup. Stock singles carry neither. Dropping ashwagandha leaves three actives that all hold an
authorised EFSA claim and all have a biomarker trigger: **maximum £1.92/month COGS**, against £34.95 modelled
retail. That holds above 90% margin down to about £19.95 and still clears 80% at £9.95. Verified arithmetic
from the catalogue prices above.

**Why it may be the better product.** `results-engine/results-to-product-mapping.md` already branches on low
vitamin D, low B12 and borderline testosterone. A fixed blend gives every customer all four actives regardless
of which marker fired, which is the same objection that removed magnesium in V7.2. Personalising a *blend*
would need 7 formulations for 3 markers; personalising *bottles* needs 3 SKUs assembled 7 ways.

**Two things that constrain it.**

- **Ashwagandha cannot survive as a separate bottle.** A bottle's statutory front-of-pack name IS the
  ingredient, and consumer law requires a bundle's contents to be described, so the silent-ingredient rule
  (root `CLAUDE.md` guardrail 3) and the description duty meet head-on. The rule works today only because the
  ingredient sits inside one named product; the compliance CONTEXT records it as "Daily Stack (undisclosed)".
  **The four-bottle bundle is the one configuration in which that rule cannot be complied with.**
- **CA-026 clause 2** (`02_brand/messaging-framework.md:13`, adopted 2026-07-22): *"no result changes what we
  offer or what it costs."* A published price list with a multibuy is compliant — the customer's choice moves
  his basket, not his price. Pricing tiered by how many markers came back low is **not**, and was rejected on
  those grounds when proposed this session.

**Unreconciled, and larger than this decision:** `supplements/biomarker-supplement-loops.md` is built entirely
on the mechanic clause 2 forbids (a marker comes back low, a specific supplement is triggered). CA-026 lives in
`01_strategy` and `02_brand`; the loops doc lives here; neither references the other. `01_strategy/STATE.md`
records the conflict-free decision sweep as **deliberately deferred** pending the wording lock with Ewa, which
is why this workspace never got the memo. A defensible reading is that the catalogue and prices never vary
while a result may surface information — that reading has never been written down, and it is the first of the
Ewa questions below.

Placement study for the results page (three options: sidebar rail, report block, full-bleed band), built in
the live page's own design language: <https://claude.ai/code/artifact/fbab8253-4da1-4cc4-8258-e593a3263908>.
Concept only, no copy approved. 🔴 **"Not in the repo" was WRONG and was repeated once before being caught (2026-08-25).** A source had been filed on 2026-08-22 in commit `6361fbb` at `../09_website-app/design/mockups/results-range-placement-study.html`; this line predated it and was never updated. Trusting it produced a **second** source file for the same artifact.

**Resolved, and the two files now have different jobs.** The LIVE source is `../09_website-app/design/mockups/2026-08-21-where-the-range-sits.html` (dual-range card, correct intervals). The 08-22 file is a **frozen audit subject, marked DO NOT REPUBLISH** in commit `35fa8d9`: it draws total testosterone against **6.68 to 25.70** in ten places, against Vitall's confirmed **8.64 to 29.00**, and three Rams-audit files still cited it as "the source", so the next person following that pointer would have republished the wrong clinical interval. It was not deleted because the audit cites it by line number.

### Artifact sweep, 2026-08-25 (app-led decision)

**"The Supplement Shelf"** (<https://claude.ai/code/artifact/76bd093b-8dd4-4f1b-889a-687f0275dfeb>) is
**SWEPT and now has a repo source** at `supplements/2026-08-21-supplement-shelf-mockup.html`. It had none,
which is exactly why it was invisible to every previous sweep: a published page is a store outside version
control, and it carries more authority than the doc it came from while being checked far less often.

Three corrections applied. **Its core argument stands untouched** (the shelf is identical for everyone,
nothing is conditioned on a result, the results tab carries no products; that is decision 2 of 2026-08-22
and the app-led decision explicitly preserved it). What changed: supplements are a **member-priced shop, not
a monthly subscription**; the three products shown are the old range and are now marked as placeholders
rather than priced offers.

🔴 **The third correction was a factual error on the page, and it is the best justification for the
two-range card yet found.** Man B's card read **"Below range"** and *"below the normal range for adult men"*
directly beside a printed reference interval of **8.64 to 29.00**, with a value of **9.1**. He is **inside**
that interval; what he is below is our action cutoff of 12. Telling a man he is below a range while showing
him the range he is inside is wrong on the page and is precisely the "moving the goalposts" charge the brand
positions against. Both numbers are now drawn on one axis.

**Still owed:** the member-discount percentage is illustrative at 25% off list and has never been set, and
the list prices themselves rest on a blended pack that cannot be manufactured. Both need re-deriving from
`supplements/supplement-unit-economics-2026-08-24.md` once the launch range and the 3PL fee are known.

## Free Androgen Index: an NHS lab states the test is NOT VALID IN MEN (2026-08-21)

**Kit 1 reports Free Androgen Index.** An NHS laboratory report seen 2026-08-21 (panel dated 18 Nov 2025)
carries the printed laboratory comment:

> *"Test not vaild [sic] in men due to variation in testosterone levels over the course of the day."*

**Verified** from the report itself, not inferred. This is materially harder evidence than the two prior FAI
findings already in this file (the "calculated vs returned" correction of 2026-08-12, and the July article
that cut across Ewa's June threshold ruling), and unlike those it comes from a laboratory rather than from us.

**RESOLVED 2026-08-21, and it does not change anything: this CORROBORATES the position we already
publish.** The framing above ("implies to the reader that it means something") was written without checking
the live engine, and the live engine already declines to interpret FAI in almost the NHS lab's own words.
Verified in code, not inferred:

- **Badge:** `{ label: 'Reported', filled: false }` (`StatusBadge.tsx:50`) — an unfilled badge, not a verdict colour.
- **State label:** *"Reported for reference, not interpreted"* (`biomarker-copy.ts:311`).
- **Explanation:** *"We report your Free Androgen Index because it is on the panel, but we do not draw a conclusion from it. In men it is not a reliable stand-in for free testosterone, so grading it as high or low would tell you something we cannot stand behind. Read your Free Testosterone result instead."*
- **Recommendation slot:** *"For reference"* (`ResultRecommend.tsx:20`) — no CTA, no retest prompt.
- **All-clear logic:** `fai-reported` is deliberately in `CLEAR_STATES` so it cannot veto an all-clear.

**Keith's position, restated 2026-08-21:** the customer paid for a panel, FAI is on that panel, so we show the
result and make no comment on it beyond the fact that it is one of the results. Withholding a marker the
customer bought would be worse than reporting it uninterpreted. This is CA-034 item K1 (2026-08-12) unchanged.

**The reference range still renders** (`REF: 35.0–92.6`, straight from Vitall). Kept deliberately: it is the
lab's own range shown alongside a badge that explicitly refuses to grade the value, not a verdict.

**Residual, NOT a gate:** worth putting the NHS lab comment to Ewa as confirmatory backing for wording she has
already effectively endorsed, and as a citable source if the position is ever challenged. It is not a
correction and it does not block launch. Owner: Keith, next Ewa sitting.

## Owed to Ewa, all raised 2026-08-21, none sent

Four live, in the order they should be asked, plus one downgraded. Item 2 is the urgent one; the rest are
formulation questions gated on the supplement decisions, not on launch.

1. ~~**FAI validity** — do we keep it on Kit 1?~~ **DOWNGRADED 2026-08-21, not a question and not a gate.**
   The engine already reports FAI uninterpreted, and the NHS lab comment agrees with our published wording
   rather than contradicting it (see the section above). What is left is confirmatory only: show Ewa the lab
   comment so the existing position has a citable external source. Ask it at the sitting, do not wait on it.
2. **CA-026 clause 2, exact reading** — does it forbid *surfacing* a relevant product on a result card, or only
   forbid changing the offer and the price? **LIKELY RETIRED 2026-08-21 by Keith's no-upsell decision:** if every
   customer sees the same complete range whatever their result, nothing is surfaced *because of* a result, so
   clause 2 is not engaged either way. Confirm once the placement is settled (`869eng0g5`) rather than asking her
   a question the design has already answered. **What replaces it on her list** is narrower and real: CA-026 §P
   clause 2 cites the now-superseded maintenance offer as its substantiation and needs that citation swapped,
   which is a re-approval because it is her signature.
3. **Does ashwagandha earn its place at all** — no authorised claim, NIH LiverTox "probable" hepatotoxicity
   (score C), no trial longer than 8–12 weeks against a product designed for indefinite subscription use, 62%
   of ingredient cost, and it moves TSH/T3/T4 and glucose, which are markers Kit 5 and Kit 3 Plus are planned
   to sell. The marker-interference point has never been put to her.
4. **DRAFTED 2026-08-23, still not sent**, together with item 5, at
   `../03_compliance/correspondence/2026-08-23-keith-ewa-zinc-dose-and-ceiling-basis-draft.md`. The two must be
   asked together: if the ceiling turns out to be total intake, the answer to 4 changes shape. **This is the
   item on the critical path** — no zinc dose or salt goes on artwork until she answers, so D3 and B12
   artwork can start now and zinc cannot. **Is 15 mg zinc citrate acceptable** in place of 25 mg gluconate? Note her 2026-08-02 decline of added
   copper was explicitly conditional on 25 mg being "low enough", so any move upward reopens the copper
   question too.
5. **Is the 25 mg zinc ceiling supplemental or total intake?** Recorded across our docs as a bare number. If
   it is a total-intake limit, typical UK male dietary intake of ~9–10 mg/day means the **current 25 mg spec is
   itself non-compliant**. Nobody has checked which basis applies.

## Joint & Recovery: NO STOCK CONTAINER FITS IT (2026-08-20)

Found while mocking the supplement range onto Nutribl's stock containers (see
[`../02_brand/assets/packaging/concept-container-mockups-v1.html`](../02_brand/assets/packaging/concept-container-mockups-v1.html)).

**The arithmetic:** `supplements/joint-recovery-collagen.md` specifies **30 servings at approximately 11 g**, so about
**330 g of powder**. At a typical bulk density near 0.5 g/ml that is roughly **660 ml of volume before headspace**.

**Nutribl's ceilings:** flat mail packer tops out at **320 ml**, PET bottles at **400 ml**. **Neither holds it**, and
that is before headspace for a scoop.

**Three options, all of them decisions rather than details:**

1. **Bespoke container.** Nutribl offers custom packaging at **MOQ 500 units per product line**. That is real committed
   inventory for a product whose formulation is not even settled.
2. **Move to sachets.** The spec already says "1 scoop **or sachet**", so this is inside the existing product
   definition. Sachets also fit a letterbox, which a tub never will.
3. **Cut the serving size.** Only viable if the hydrolysed-collagen lane is dropped, since the 10 g dose is what forces
   the volume. If the **UC-II 40 mg standalone** lane wins, the product becomes a capsule and the problem disappears.

**Note the interaction:** option 3 is not independent of the formulation decision already open in
`supplements/joint-recovery-collagen.md`. **The UC-II-versus-hydrolysed call now also decides the container and the
postage band**, which raises its stakes. Make it before committing any packaging.

---

## Supplement loops: supplier availability SOLVED, bottleneck moved to the lab (2026-08-20)

**Verified** against Nutribl's full trade catalogue (Keith's logged-in Tier 1 pricing, supplied 2026-08-20) and their published product pages. Not yet confirmed by a purchase or a sample: no order has been placed.

Every loop in `supplements/biomarker-supplement-loops.md` now has a stock product, a price and a 4-to-5-working-day lead time at MOQ 10. The full table is in that doc under "Supplier availability: SOLVED for every loop". Headlines:

- **Omega-3 Index → EPA/DHA**, the loop that doc ranks strongest, is available off the shelf: Vegan Omega 3 Algal Oil, 90 softgels, GBP 9.73, giving DHA 400 mg + EPA 200 mg per 2 softgels. This had been assessed as unbuildable the previous day against Rawcreation, who run dry powders only.
- **Two Daily Stack actives match our spec exactly**: B12 Methylcobalamin 1,000 mcg (GBP 3.95 / 120 caps) and Vitamin D3 4,000 IU (GBP 3.00 / 365 tabs). KSM-66 is stocked at 500 mg against our 600 mg. **Zinc is the only gap**: they carry citrate and bisglycinate, never gluconate.
- **Indicative Daily Stack ingredient cost is about GBP 5.01/month** buying the four actives as separate finished private-label products, against a modelled COGS of ~GBP 8. Ashwagandha is ~62% of it. **Inferred from finished-product retail-ready prices, not a blend quote** — a custom blend carries its own setup, MOQ and stability costs and has not been quoted.
- **Selenium is the right form and the wrong dose**: L-selenomethionine at 200 µg against our ~100 µg spec, and the diabetes signal at 200 µg is already noted in the loops doc. Needs a 100 µg run.

**What is now blocking each loop is a marker, not a manufacturer.** Open with Ben at Vitall, draft written this session at `../05_partners/labs/vitall/correspondence/2026-08-20-keith-omega3-index-and-tsh-feasibility-draft.md`, **not sent**:

- **Omega-3 Index on dried blood spot, plus COGS.** Outstanding as next-step (a) in the loops doc since 2026-05-30, never actioned. Now the only blocker on that loop.
- **TSH feasibility for Kit 5 Thyroid.** Bundled into the same draft. Kit 5's sequence was locked 2026-05-27 and **still has no spec doc**.

## Liver Health Check: the "no EFSA liver-supplement claim" assumption was WRONG (2026-08-20)

`kits/liver-health-opportunity.md` recorded the Liver Health Check as "NOT a ... supplement driver (no EFSA liver-supplement claim)". **Choline carries an authorised claim for the maintenance of normal liver function**, at a condition of 82.5 mg per serving, and Nutribl's Liver Support Choline Complex is formulated to exactly that threshold. **Verified** against the product's own nutrition panel; the claim's existence is asserted from the authorised-claims register and should be re-checked by Ewa against the register text before any use.

That line now carries a correction banner. **This is a correction, not a green light**: our stated route for elevated liver markers is a GP referral, only the choline in that 12-ingredient blend carries a claim, and selling a supplement off a raised ALT is an **Ewa gate**. Recorded so the assumption stops propagating, not so the product gets built.

---
## Kit 1 fatigue framing on the marketing pages: DECIDED, split and route (2026-08-15)

Open since 2026-08-02. Full decision, the four located instances and the drafted copy:
[`2026-08-15-kit1-scope-marketing-pages-decision.md`](./2026-08-15-kit1-scope-marketing-pages-decision.md).

- **The contradiction:** `CONTEXT.md` §5 and CA-025 scope Kit 1 to testosterone only, and that rule is
  **live in the results engine** behind `KIT_SCOPE_NOTE_ENABLED`. Four marketing pages sell Kit 1 as
  the fatigue answer anyway: `/kits/testosterone` (L264, L281-282), `/lp/testosterone` (L254,
  L271-272, and it is the **paid-ad** LP), `/kits` (L226), `/` (L358).
- ✅ **Decision: apply the CA-033 remedy one layer up.** Narrow the Kit 1 copy to the hormonal
  presentation and add an explicit routing card handing the fatigue reader to Kit 2, exactly as CA-033
  split the quiz option and added value `d` rather than rewriting the map. **Deleting the words was
  rejected**: it strips the hook from the highest-intent page and leaves the fatigue reader routed to
  Kit 1 anyway, which is the negative-review scenario `CONTEXT.md` names.
- **The replacement wording already ships on our own site.** `/kits` L287, the **Kit 2** row, reads
  *"If the issue is hormones, Kit 1 or Kit 3 is the better fit."* The Kit 1 entries get the mirror of
  it, so this is a claim reduction on approved-direction wording rather than new claims copy.
- **Ewa NOT required**, on the CA-033 reasoning exactly: the remedy removes the out-of-scope outcome
  rather than accepting it, so the CA-025 clinical question does not reopen. `compliance-preflight` on
  the extracted customer copy: **0 HARD / 0 REVIEW**, zero em dashes.
- ✅ **APPLIED AND VERIFIED 2026-08-15 (Keith's go).** All four pages edited, `tsc --noEmit` exit 0,
  `compliance-preflight` **0 HARD** (2 REVIEW, both pre-existing homepage items, confirmed against the
  diff). **Checked in a real browser render, not asserted from the diff**: all four pages 200, the new
  strings present and `exhausted by 3pm` / `brain fog` / `low energy, low drive` / `essential for men
  experiencing fatigue` all gone, 0 failures. Screenshots read as images at 1400px and at a true 390px
  mobile viewport with no horizontal overflow. `test-quiz-routing.ts` 21/21, `test-kit-cta.ts` clean.
  ⚠️ **Working tree only, not pushed, therefore not deployed.**
- 🔴 **Found while verifying, unrelated:** the dev server on `localhost:3000` **500s on every page**,
  including four this change never touched. A clean server on another port serves all four at 200.
- 🔜 **Flagged, not decided:** `/kits/testosterone` L503 offers Kit 3 (£179) as the sideways option
  where Kit 2 (£119) is the complement under the 2026-07-08 complement rule. Offering only the dearer
  kit to a reader we have just sent elsewhere reads as an upsell. Kit-ladder question, not a scope one.
- ⚠️ **The recommendation worth more than the copy fix:** CA-033 shipped 21 assertions so no fatigue
  combination can return Kit 1 again. **Prose has no equivalent guard, and four weeks of drift on an
  approved rule is exactly what that absence looks like.** A string-level check is proposed in the doc.

## kit-1's FAI row said the opposite of what the product does (2026-08-12)

Found by the carousel per-post pre-flight, ruled by Keith the same day (**CA-034 item K1**).

`kit-1-testosterone-health-check.md` line 72 described Free Androgen Index as *"calculated"* and as giving *"clinical picture beyond Total T alone"*. Both halves were wrong, and the second was already recorded in the repo as contradicting `thresholds.md`.

- **It is not calculated by us.** `05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md:26`: *"FAI is returned by Vitall, we do not calculate it"*, reference range 35.0 to 92.6%. It is priced into the Kit 1 all-in lab cost.
- **It is deliberately not interpreted.** `frontend/lib/results/classifier.ts:295` maps it to a dedicated `fai-reported` state whose customer copy reads *"Reported for reference, not interpreted"* and says in terms that in men it is not a reliable stand-in for free testosterone. It returns no CTA and is excluded from vetoing an all-clear.

**Ruling (Keith, 2026-08-12): FAI stays on the panel.** The lab returns it, the customer receives the value, we simply draw no conclusion from it, and it has been advertised. **Nothing was deleted and no marker left the advertised list.** The row now states the arithmetic (ratio of total T to SHBG) and the reporting position, matching the engine's own wording.

> ✅ **AND THE KIT 3 SPEC HAD THE SAME ROW, corrected 2026-08-29.**
> `kit-3-hormone-recovery-check.md:75` carried the identical *"Clinical picture beyond Total T"* cell,
> and called FAI *"calculated"*, which is the same pair of errors ruling C corrected in the Kit 1 spec
> on 2026-07-30. That correction was swept into `kit-1-testosterone-health-check.md` on 2026-08-12 and
> never into its sibling. Found by grepping the fact rather than the file the report named. The row now
> states the arithmetic and the reporting position. The file's stale *"(currently placeholder)"* note
> against `results-engine/thresholds.md` was corrected in the same pass: that has not been true since
> the 2026-06-16 sign-off, and it invited readers to treat the kit doc as the band source.

**The same framing was live on the Kit 1 landing page** and is fixed there too, recorded in `09_website-app/STATE.md`: the sample report card showed FAI with a `Borderline` verdict badge on the one marker the engine refuses to grade.

---

## Vitall cost vs retail margin chart, and a stale price table it exposed (2026-08-09)

**Chart:** [`pricing/2026-08-09-vitall-cost-vs-retail-margins.html`](pricing/2026-08-09-vitall-cost-vs-retail-margins.html).
Published (private) at `https://claude.ai/code/artifact/8856f106-e81d-400d-9e04-129ff29652d8`.
First file in `04_products/pricing/`, which existed empty until now.

**Figures, taken from the two authoritative sources rather than the doc layer.** Lab cost from the signed
Vitall services agreement 2026-06-02, Schedule 1 §5; retail from `09_website-app/frontend/lib/pricing.ts`,
which is what actually charges the customer.

| Kit | Vitall | Retail | Gross | Margin | After 2.5% card fee | Via affiliate code |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Testosterone | £58.50 | £99 | £40.50 | 40.9% | £38.02 (38.4%) | £13.37 (15.0%) |
| 2 Energy & Recovery | £63.00 | £119 | £56.00 | 47.1% | £53.03 (44.6%) | £26.42 (24.7%) |
| 3 Hormone & Recovery | £98.00 | £179 | £81.00 | 45.3% | £76.53 (42.8%) | £34.07 (21.1%) |

**Kit 2 is the best-margin kit, not Kit 3.** Kit 3 earns the most cash per sale (£81) and Kit 2 keeps the
largest share of its price (47.1%). **Affiliate Kit 1 is close to marginal at £13.37**, and a single £12
replacement kit would take almost all of it.

**CLOSED same day by a decision sweep (2026-08-09).** Keith: suspend the old pricing table, and no
reference to the old prices is to be used. Decision doc: [`2026-08-09-v71-pricing-suspended.md`](2026-08-09-v71-pricing-suspended.md).

**The live customer-facing surface was clean and that was verified, not assumed.** A grep for every
suspended figure across `09_website-app/frontend` (excluding build output) returns no kit pricing at all,
only the unrelated £29.95 collagen subscription. The v2.2 site migration is genuinely finished; its audit
doc is history rather than open work.

**One file carried all of it.** `catalogue/non-regulated-tier-v7.md` presented the transitional
£89 / £99 / £149 as current retail in three unmarked tables (§5.1 margins, the 6-month revenue table, and
the V7.1-to-V7.2 variance table) and stated V7.1 prices as bare `Price:` fields in two product sections.
Now carries a file-level suspension banner, and every superseded figure is struck through with the live
value beside it. Struck spans are the existing convention and `content-doctor` I7 already masks them, so a
suspended price cannot be read as a live assertion by a person or by tooling.

**It was also wrong on its own terms, which the sweep only found by reading rather than grepping:** Kit 2's
price was given as £99 (canonical is £119) and described as "updated from £35", which is Kit 1's old
standard price, not Kit 2's £44. Both corrected in place.

**Deliberately left as labelled history**, and flagged for Keith rather than removed: `Was (V7.1)` columns
in `kits/kit-1-launch-guide.md`, and `(was £44 — v2.2)` annotations in `07_sales/sales-gtm-context.md` and
`01_strategy/master-implementation-blueprint.md`. Each leads with the live price and names the old one as
superseded, so it records the change rather than offering a usable price. Say the word if those should go too.

**NOT verifiable from the repo:** two-kit bundle pricing. `lib/bundles/config.ts` holds Stripe price IDs in
env vars by design (single-swap reprice pending the Van Westendorp read), so the live bundle prices are not
in source and are deliberately absent from the chart. A code comment references a "£169/£199/£259 bundle
reprice decision at n≈50"; that is a comment, not a price.

---

## Ewa ruled on all five open band questions, and two new upper bands are built (2026-08-07)

**Decided by Dr Ewa Lindo, 2026-08-07, by email**, put to her with Vitall's per-assay reference ranges
beside each band, which is what she did not have on 2026-06-16. Her answers verbatim:

| Question | Ewa | Outcome |
|---|---|---|
| Active B12: our NG239 25/70 vs the assay's own 37.5 cut | "Keep NICE NG239" | No change; re-ratified with 37.5 visible |
| Ferritin high band: our `>300` vs the lab's 442 ceiling | "Keep 300" | No change; re-ratified with 442 visible |
| High testosterone (no band existed) | "over 29+" | **New band `> 29` → GP referral** |
| The redrafted FAI report-only wording | "wording is fine for now" | Approved. Her "for now" is preserved; treat as provisional |
| Upper bands for Vitamin D / Albumin | Vitamin D yes, Albumin no | **New band `> 250` → GP referral**; albumin left open |

On Vitamin D she specified the shape, not just the number: *"can we treat >250 nmol/L as a high/clinical
review flag rather than just a technical out-of-range result?"* So it is a GP-block state, which also
suppresses every supplement CTA on that card. That matters here more than anywhere, because the card it
suppresses is the one offering our own 4,000 IU D3.

**Card copy for both new states is DRAFTED, NOT APPROVED.** She gave numbers and routing; the wording was
put to her as her call and she sent none. A reply asking for a line on each is drafted in Gmail, unsent.
Both blocks are marked pending in `biomarker-copy.ts` and in `thresholds.md`.

Full record, including the four range-comparison rows that previously read "conflicts" or "no high band
exists": `results-engine/thresholds.md`.

## The results-engine badge vocabulary is written down for the first time (2026-08-07)

`results-engine/dashboard-copy.md` was an empty placeholder ("Placeholder item 1"). It now holds the six
status-badge labels, what each applies to, and the outline-versus-filled rule. **"Optimal" is retired as
the label for merely in-range (Keith, 2026-08-07)** because it contradicted our own `myth-of-normal-range`
article on the page where it matters most; it survives on testosterone alone, where the `>20` band is a
signed positive-framing product choice. In-range markers now read "In range". The rest of the dashboard
copy is still owed and listed in that file.

## `thresholds.md` now carries its assay provenance; the hs-CRP question was re-opened twice for want of it (2026-08-04)

`results-engine/thresholds.md` bands on assay identities (hs-CRP not standard CRP, Active B12 as holotranscobalamin, albumin measured not assumed) that were **confirmed in writing by Vitall on 2026-04-30** and recorded in `05_partners/labs/vitall/correspondence/2026-04-30-ben-service-agreement-thread.md`. The thresholds file cited none of it: zero references to Ben, Vitall, or any correspondence. It said only "confirm against Vitall's assay", with no indication whether that had already happened.

**Consequence:** the CRP assay was surfaced as an open, material risk twice, and on the second occasion was one step from an email asking Vitall to re-confirm something they had answered three months earlier in reply to a question that named the exact distinction ("hs-CRP, not standard CRP"). Keith caught it both times from memory.

- **Added:** an assay-provenance table at the head of `thresholds.md`, citing the 2026-04-30 confirmation and the 2026-07-20/21 unit confirmations, with the Gmail thread ID.
- **Deliberately NOT closed:** the reference-range items. Ben has confirmed marker identity and units; he has **never** supplied per-assay reference ranges. SHBG (code still carries a generic 17–55 fallback against Ewa's 2026-06-16 ruling 7 "match the lab assay"), Active B12's NG239 range, and Vitall's albumin range behind `<35` all remain genuinely owed. The new note says so explicitly so the table is not misread as closing them.
- **Noted, not fixed:** `thresholds.md` still carries the pre-approval sentence "they have never had a documented clinical sign-off, which is why this task is open" directly under a header reading "Status: ✅ APPROVED — Dr Ewa Lindo, 2026-06-16". Same class of stale artifact; left for whoever next touches the file with Ewa.

Sweep context and the parallel shelf-life finding: `01_strategy/STATE.md` (2026-08-04 entry).

---

## Supplement formulation: PROPOSED changes (the two zinc items RULED 2026-08-02; the rest still UNAPPROVED)

From `supplements/formulation-evidence-review-2026-07-02.md` (RCT/meta evidence base). **Except where marked APPROVED or DECLINED below, nothing here is approved.** Live specs stand; every dose/form change needs **Ewa (safety + claims) + manufacturer sign-off**. Trials inform the product, not the claims (EFSA list still governs all copy).

### Daily Stack (capsules)

- ✅ **Zinc 30 mg → 25 mg — APPROVED (Ewa, 2026-08-02, email).** 30 mg exceeds the EU supplemental UL of 25 mg. Gluconate form fine. **Applied the same day** to `supplements/daily-stack.md` and to all three site surfaces (`lp/daily-stack` ×2, `supplements/daily-stack`); the site had been publishing 30 mg. Logged under CA-030.
- ❌ **Add copper — DECLINED (Ewa, 2026-08-02):** _"25mg zinc low enough."_ The depletion rationale was put to her alongside the reduction and she ruled the lower dose removes the need. **Consequence: the clean 4-active spec holds, so Gate 0A's capped-downside condition is undisturbed.** Note this doc said ~1 mg and `supplements/daily-stack.md` said ~2 mg; the discrepancy is now moot, but do not re-propose either figure without new evidence.
- **Vitamin D3: keep 4,000 IU.** Best-evidenced cofactor is **magnesium** (Dai 2018), NOT K2. ⚠️ See the K2 + magnesium open decisions below.
- **Active B12: keep 1,000 mcg methylcobalamin** (already optimal; do NOT upgrade to 5,000 mcg; no added benefit). Keep "active form" positioning but never claim clinical superiority over cyanocobalamin.
- **Ashwagandha KSM-66: keep exactly 600 mg** (validated dose). See the hepatotoxicity safety flag below.

### Joint & Recovery Collagen (powder): biggest fixes

- **Pick one lane (open decision):** **A** = UC-II 40 mg standalone (best-matched evidence for active men + exercise-induced joint discomfort; drop hydrolysed collagen) **or B** = hydrolysed collagen 10 g + fix MSM + HA (remove UC-II). **Do NOT ship both at current doses**: UC-II 20 mg + hydrolysed is the one configuration with a failed RCT behind it (Sci Rep 2025, null).
- If lane B: **MSM 500 mg → 3 g** (500 mg is sub-therapeutic; no RCT supports it) and **HA 5 mg → ~80–120 mg** (5 mg has no oral RCT support).
- Vitamin C 80 mg: keep (adequate cofactor).
- **Free upgrade:** add a **"take ~1 h before training"** usage instruction (Shaw 2017: collagen + vit C pre-exercise drives tendon/ligament synthesis). Evidence-based, costs nothing.

### Pipeline loops (pre-launch, not built)

- **Omega-3:** rTG form, 2 g EPA/DHA, EPA-forward ratio. Frame around triglycerides / Omega-3-Index correction + mood: **NOT** heart-disease prevention (primary-prevention CV trials null). Vegan algal SKU is a softgel (Rawcreation can't make it).
- **Thyroid (Se + I):** **selenomethionine ~100 mcg** (not selenite; 200 mcg has a diabetes signal). **Reconsider/minimise iodine**: high-dose iodine can flare autoimmune thyroiditis in exactly the target population. Ewa gate mandatory.
- **Homocysteine B-complex:** **5-MTHF (methylfolate) 400–800 mcg** + **B12 methylcobalamin 250–500 mcg** + **token B6 only**. Marker/retest framing only: hard clinical endpoints are null.

## Product-safety flags: require Ewa review

These are real product-safety issues (silent externally, but material for formulation/label sign-off):

- **Ashwagandha hepatotoxicity**: NIH LiverTox rates it a "probable" cause of liver injury (score C); 2023 case series; trials only ran 8–12 wks. Consider a liver caution + duration/cycling note.
- **Omega-3 → atrial fibrillation**: dose-dependent (Gencer 2021 meta HR 1.25; >1 g/day HR 1.49). At 2 g the risk is intermediate but non-zero: add a label caution for anyone with prior AFib/palpitations.
- **B6 neuropathy**: EFSA cut the UL to **12 mg/day (2023)**; keep total B6 well under it (the 25–50 mg in old trials is unsafe for chronic use).
- **Folic acid → prostate-cancer signal** (Figueiredo 2009, HR 2.63): a specific reason to use **5-MTHF at modest dose, never high folic acid** in a male product. (Folic acid also masks B12 deficiency; dose B12 adequately.)

## Open decisions (Keith / Ewa)

1. **Collagen lane**: UC-II standalone (A) vs hydrolysed route (B). Biggest single decision; blocks MSM/HA dosing.
2. **⚠️ K2 contradiction in the source doc**: the evidence row says K2 is speculative/marketing with a possible-harm hint and "never claim K2 is needed"; the doc's own Priority-changes list says "add K2 100 mcg." Resolve. Evidence-based default = **do not add K2**; if any D3 cofactor, magnesium is the supported one.
3. **⚠️ Magnesium vs V7.2**: magnesium is the best-evidenced D3 cofactor, but V7.2 *removed* Mg from the Daily Stack (a marketing-logic call: no kit trigger, and Mg is unreliable on finger-prick per the haemolysis constraint). Reconcile the formulation-science case against the removal decision.
4. **Iodine** in the thyroid loop: include at all? Safety liability in the autoimmune-thyroid target population.
5. **Ashwagandha**: duration/cycling policy + liver caution wording.

## Results-engine & product decisions: recent status

Recent swept decisions now reflected in `CONTEXT.md`; live/sign-off status tracked here.

- **2026-07-08: post-result cross-sell = complement, not superset (LIVE in `classifier.ts`).** A normal-T Kit 1 result cross-sells **Kit 2** unconditionally (the old `energy_symptoms` gate was removed); Kit 2 → Kit 1 stays gated (multi-deficiency, or Vit-D/B12 deficiency at age ≥40); Kit 3 carries no post-result kit cross-sell and is now a front-of-funnel default only. Classifier suite green, tsc + build clean. Decision: `results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`.
- **2026-07-09: Gate 0A criteria RESTATED** (canonical in `01_strategy/CONTEXT.md` → "Gates Reference"). The old "25+ supplement pre-orders" bar is retired; 0A is now a capped-downside spend authorisation (first-run exposure capped ~£5,950, small MOQ, clean 4-active spec). The "not ordered until Gate 0A" rule is unchanged; only the criteria that define 0A moved.
- **2026-07-17: retest cadence table drafted (PROPOSED, pending Ewa sign-off).** All-clear (Bucket C) cadence is **6–12 months** (already agreed and live on the marketing site; the dashboard button's "3 months" and card copy's "3–6 months" are drift to correct down to it). Bucket B ("acting on a finding") retest is ~3 months; Bucket A (GP-routed) carries no Andro Prime interval. Two narrow items still need Ewa's tick before the feature is customer-facing: the red-flag GP-first line, and the symptom → panel wordings. Nothing ships against any row until Ewa signs. Table: `results-engine/2026-07-17-retest-cadence-table.md`.
