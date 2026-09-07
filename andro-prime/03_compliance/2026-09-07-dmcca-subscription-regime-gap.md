# GAP: the UK subscription-contracts regime is not recorded anywhere in this workspace

**Raised:** 2026-09-07 · **Status:** 🔴 OPEN GAP, not a ruling · **Owner:** Keith, then a solicitor
**Sits against:** the **membership terms** launch gate (`../01_strategy/STATE.md`, the 2026-08-26
offer-window entry: *"the compliance read plus the membership terms, both still hard launch gates"*).

> **This file asserts a gap, not the law.** Everything below is written to be taken to a solicitor. The
> confidence markers are deliberate and should not be sanded off by a later sweep.

---

## 1. What was found

**Part 4 of the Digital Markets, Competition and Consumers Act 2024 (the DMCC Act) contains a
subscription-contracts regime aimed specifically at free-trial-to-paid conversion.** It appears **nowhere
in `03_compliance`.**

Checked on 2026-09-07 across the whole workspace: no occurrence of "DMCCA", "DMCC", "Digital Markets,
Competition", "subscription contract" or "reminder notice".

**What is here instead.** `terms-and-conditions.md` handles supplement subscriptions under the **Consumer
Contracts Regulations 2013** (§163 billing, §173 the 14-day cooling-off period), and the 2026-07-25 legal
review's item 7 tuned that cooling-off wording against CCRs reg 28(3) and reg 34(9). **That is the right
law for a distance contract and it is not the whole picture for a subscription.**

**There is no membership section in the terms at all.** The document covers supplement subscriptions and
test bundles. Membership is not in it.

## 2. Why it surfaced now

Keith ruled on 2026-09-07 that **the membership auto-renews on day 31** after the included first month
(`../01_strategy/2026-09-07-auto-renew-at-day-30.md`).

That ruling is not in doubt and this gap does not disturb it: **the regime does not ban auto-renew.**
What it does is attach duties to exactly the shape we have just adopted, which is a free introductory
period that converts to a paid subscription.

## 3. What is asserted, and at what confidence

🟢 **High confidence.** The DMCC Act 2024 received Royal Assent on 24 May 2024, and Part 4 contains a
subscription-contracts chapter.

🟠 **Medium confidence, verify.** The regime's duties are broadly: key pre-contract information given
**prominently** before the consumer is bound; **reminder notices before a renewal payment**, with a
specific reminder where a **free or discounted introductory period** is about to convert to full price;
cooling-off rights, including on renewal; and cancellation that is **as easy as sign-up**.

🔴 **Not asserted. Do not build on these.**
- **Whether it is in force.** Commencement was expected around spring 2026 subject to implementing
  regulations. **This has not been checked and must not be assumed either way.**
- **The exact reminder timing.** It sits in implementing regulations, not on the face of the Act. The
  day 23 to 25 proposal in the auto-renew ruling §5 is a **commercial guess, not a legal minimum.**
- **Whether our membership is in scope at all**, given it is bundled into a kit purchase rather than sold
  as a standalone subscription. **That bundling question is genuinely novel here** and connects to the
  VAT characterisation question already owed to the accountant (`../01_strategy/STATE.md`).

**The assistant that raised this has a May 2026 knowledge cutoff**, which is on the wrong side of the
expected commencement window. **That is the single strongest reason this needs a solicitor and not a
better search.**

## 4. What to ask the solicitor

Written as questions, so the answers can be filed as answers.

1. **Is the DMCC Act 2024 Part 4 subscription regime in force**, and if not, on what date does it
   commence?
2. **Is our membership within scope**, given the first 30 days are bundled into a one-off kit purchase
   rather than sold as a standalone subscription?
3. **What reminder is required before the included month converts**, and how many days before day 31 must
   it land?
4. **What must appear at the point of sale**, and does our proposed line satisfy it? Proposed wording:
   *"Includes 30 days of membership. GBP 47/month after. Cancel anytime."*
5. **What cancellation route is required**, and does a self-serve cancel inside the account area satisfy
   the as-easy-as-sign-up duty?
6. **Is there a cooling-off right on the day-31 conversion**, distinct from the CCRs right that
   `terms-and-conditions.md` §173 already covers for supplements?
7. **Does the membership need its own section in the terms**, or does it sit under the existing
   subscription clauses?

## 5. What this blocks, and what it does not

**Does not block:** the auto-renew ruling itself, or the redesign branch continuing.

**Does block:** shipping the kit-page price line to a live surface with a working trial mechanic. That is
already gated by the same coupling recorded in the auto-renew ruling §8, so **this gap adds a reason, not
a new blocker.**

🔴 **Nothing here is customer-visible today.** `MEMBERSHIP_ENABLED` is off, `/membership` `notFound()`s,
and no public page quotes the membership price. **This is a launch gate, not a live defect**, which makes
now the cheapest moment it will ever be closed.

## 6. Why it matters more than it looks

The 2026-08-27 first-month ruling and the auto-renew ruling together create a subscription that **starts
inside a one-off purchase.** A man buying a GBP 99 kit does not think he is subscribing to anything.

That is the fact pattern consumer-protection regimes are written for, and it is also the exact complaint
cluster the conflict-free position is built against. **Getting this wrong would not be a technical breach,
it would be the brand contradicting itself.**
