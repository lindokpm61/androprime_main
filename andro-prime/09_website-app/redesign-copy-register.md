# Redesign copy register: what the final pre-flight has to pick up

_Last updated: 2026-09-03 (Rows 14 and 15: product names collapse onto one source, and `/kits` takes the homepage's CTA label.)_

**The ruling this file exists to serve (Keith, 2026-09-02):** the redesign work on
`redesign/direction-f` is in test and **is not subject to copy pre-flight rules at each step**. The
pre-flight runs once, at the final stage, and picks up everything that needs changing or
re-approving. This is the same shape as the CA-045 ruling of 2026-09-01: **the gate governs
SHIPPING, not creating**, and this branch deploys nothing.

🔴 **THE RISK THE RULING CREATES, AND THE ONLY REASON THIS FILE EXISTS.** Deferring the gate is
fine. Deferring the gate with no record is not, because "we will catch it at the end" silently
becomes "we no longer know what changed". A pre-flight run against the finished branch can only
find what it can see: it reads the copy that is there, not the copy that was moved, shortened or
dropped along the way, and not the questions that were parked. So every step that touches
customer-facing words gets one line here, and the final pre-flight reads this file first.

**What belongs here:** copy moved, shortened, cut, or newly written; a claim whose container or
placement changed; an approved block that was relocated; a clinical or terminology question parked
rather than answered. **What does not:** pure design and layout changes that leave the words alone
(typography, spacing, containment, colour), which need no pre-flight at all.

---

## Open items

| # | Surface | What changed | Words changed? | Owed to |
| --- | --- | --- | --- | --- |
| 1 | `/kits` | The "what arrives in the post" tick list moves from three per-card copies to one line under all three cards. **Built 2026-09-02.** | **No.** Placement only, and it was identical on all three cards. | Pre-flight, sanity check only |
| 2 | `/kits` | **RESOLVED 2026-09-02 by tracing each orphaned field.** Five fields per kit came off the card. Three already have homes: `resultsTo` is absorbed by the new trust line; the conditional (`footLabel`/`footBody`) is covered by `/kits/testosterone`'s "The next step" plus its CA-026 D+ conformity line, and `/how-it-works` states the 12 nmol/L threshold three times; the blurb's ROUTING sentence ("Kit 2 is the better fit") is enforced harder at `/kits/testosterone:312`, a CA-025 scope block marked DO NOT REPOPULATE, and restated on `/kits` by the three parallel `who` lines. **Two are genuinely homeless: the blurb's explanatory half and `rightFor`.** Proposal: render `PANEL_MARKERS[id].why` in the panel alongside `measures`, which is existing approved copy that does the explanatory job better and is currently rendered nowhere on `/kits`; `rightFor` goes to the detail pages in the next pass. | **No new words** under the proposal: `why` is existing customer-facing copy in a new placement. | Pre-flight, placement check |
| 3 | `/kits` | **Built 2026-09-02.** The C1 "One price. Nothing hidden." panel moves from before the kit choice to after it. | **No.** CA-026 C1 carried verbatim, container and position only. | Pre-flight, placement check |
| 4 | `/kits` | **Built 2026-09-02.** Section 01 gains a standfirst: "Nine markers. Three ways to buy a slice of them. Every kit reads on the same lab, in the same units, so a result from one is comparable with a result from another." | **Yes, new.** Written for Frame O2. | Pre-flight |
| 5 | `/kits` | **Built 2026-09-02.** The panel instrument renders each marker's `measures` string from `lib/kits/panel.ts` in a new position (section 01 rather than inside cards). | **No.** Existing customer-facing strings, new placement. | Pre-flight, placement check |
| 6 | All kit surfaces | 🔴 **FAI verdict wording contradicts itself across two documents.** PRODUCT.md says "Not interpreted" was invented and the engine never returns it, and that the six allowed words come from the `BADGES` map, which yields "Reported". `/kits/hormone-recovery`'s header comment says the product's "Not interpreted" beats the frame's "Reported" because it is a clinical ruling (Ewa, `thresholds.md` item 8). Both cannot be current. | n/a, a ruling is missing | **Ewa.** Frame O2 renders no verdict, so it sidesteps rather than settles this |
| 7 | `/kits`, `/test-selector` | Known pre-existing drift, carried as found and flagged in Frame O: "answer 3 questions" and "takes less than a minute" both describe a selector that is now five steps. | **Not yet.** Fixing it is new copy. | Pre-flight |
| 8 | `/kits` | Kit card photographs `img-3`, `img-6`, `img-7` now appear on `/kits` as well as `/`. Already on the CA-045 register; this is a second placement of the same assets, not a new asset. | n/a | CA-045 signers, as a note |
| 9 | `/kits` | Each light card carries a one-line "who it is for", taken **verbatim from the homepage's own kit cards**, matched by slug ("If the question is testosterone." etc). | **No.** Existing live copy, new placement. | Pre-flight, placement check
| 10 | `/` (homepage) | 🔴 **Parked, not answered: whether that line owes the 30-day width of the offer window.** It is drafted without it, on the reading that the window is a TERM and belongs on the terms page, not in homepage fine print. The consequence of the omission is real: a man who declines and returns three months later finds no offer and was not told that could happen. | n/a, a ruling is missing | **Keith**, then pre-flight |
| 11 | `/` (homepage) | ⚠ **Row 12 describes a route that is currently dark.** `/membership` is behind `MEMBERSHIP_ENABLED`, which is unset, so it 404s. The line must not ship ahead of the flag, or the homepage promises an offer that cannot be made. | n/a, a sequencing gate | Whoever merges the branch |
| 12 | `/` (homepage) | **Built 2026-09-02.** The free layer gains a fine-print line naming the membership for the first time on an acquisition surface: "Holding that record over time is an optional membership. It is offered once your first result is back, never before, and you never need it to buy a kit or to read your own results." It exists because the section's approved lede ("what you pay for is the record") alludes to a charge this page is forbidden to sell, so the page named a paid thing and then went silent on it. Shape taken from the approved `/kits` C1 negation ("no subscription unless you choose one"); the words are new. No price, no CTA, no benefit list. | **Yes, new.** | Pre-flight |

| 13 | `/` (homepage) | **Built 2026-09-03.** Keith ruled one section grammar across the F pages and it is `/kits`' labelled one, so the homepage's four heading sections gain a `.f-blab` mono label each: **"The two ranges"** (02), **"Where to start"** (04), **"What's free"** (05), and **"No conflict"** (06, the `.f-blab-lg` lead label on the inverted receipt). Sections 01 and 03 open with an object and take no label. ⚠ Row 12's line sits in section 05, whose new label inherits its prohibitions: **"What's free" is a section name, not an offer**, and carries no price, no CTA, no benefit list, no "join", and does not lead on the trend or the series. ⚠ This row also **supersedes the standing note in two places** (`page.tsx` and `DESIGN.md`) that the invert panel's lead label was "deliberately absent pending a pre-flight"; it was a statement about what a redraw may do, and a critique later misread it as a design ruling. | **Yes, new.** Four labels, two to three words each. No claim in any of them. | Pre-flight |
| 12b | `/` (homepage) | ⚠ **Pointer correction, no copy change.** The disclosure line's own code comment says it is "registered as item 9"; the row describing it is **item 12**, and item 9 is the `/kits` "who it is for" lines. The comment was committed as found in `c746368` and corrected here rather than silently edited. | **No.** | Nothing owed |

| 14 | `/` (homepage) | **Built 2026-09-03.** The three kit cards said **"Testosterone"**, **"Energy & Recovery"** and **"Hormone & Recovery"**; every other surface says **"Testosterone Health Check"**, **"Energy & Recovery Check"** and **"Hormone & Recovery Check"** — `/kits`, the detail-page breadcrumbs, `lib/pricing.ts` (so the checkout), the account, the activation flow and the CIO payload. The homepage was the only dissenter, one click from the page it disagreed with. All three now read from `lib/kits/names.ts`, which already called itself the single source of truth and had **one** consumer. ⚠ The two narrow homepage cards' heading now wraps to two lines at 1440 (one line at 390); cards stay equal height, no overflow. | **Yes, changed** — but TO the already-approved long form, not to new words. The short forms were the unapproved variant. | Pre-flight, consistency check |
| 15 | `/kits` | **Built 2026-09-03.** The three card CTAs said **"Order"**; they now say **"Start a baseline"**, the homepage's label for the same action on the same three products. "Order" also over-promised: it leads to a product page, not a basket. | **No new words.** Existing live approved copy in a new placement. | Pre-flight, placement check |
| 16 | All kit surfaces | ⚠ **Not fixed, recorded so the pre-flight knows the scope.** The three product names have **66 hardcoded literal occurrences across 21 files**. Rows 14 and 15 route `/` and `/kits` through `lib/kits/names.ts`; the other 19 files still restate the strings, including `lib/pricing.ts`, `lib/account/getAccountData.ts`, `lib/account/exportResults.ts`, `lib/activate/getKitActivation.ts`, `lib/content/kitCTA.ts` and the three `/lp/*` pages. They all currently AGREE, which is exactly why the divergence was invisible until the homepage broke it. | n/a, a consolidation | Whoever picks up the naming sweep |

## Closed

_None yet._

---

## How the final pre-flight should use this

1. Read this table first, then run `/compliance-preflight` over the branch diff.
2. Treat every row marked **Yes** or **Not yet** in the "Words changed?" column as copy needing
   sign-off, whatever the scanner says: the scanner grades what is on the page and cannot know that
   a line was shortened from an approved original.
3. Row 6 is a blocker for any surface that renders an FAI verdict, and is independent of the
   redesign: it is wrong on `main` today.
4. Rows marked "placement only" still need a look, because CA-026 approvals attach to a claim **in
   a context**, and moving a claim past the buying decision can change what it reads as.
