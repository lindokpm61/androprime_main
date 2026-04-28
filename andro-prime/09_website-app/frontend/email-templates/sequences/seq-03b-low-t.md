# seq-03b — Low Testosterone Result Sequence

**Platform:** Customer.io
**Trigger:** `result_received` where `kit_type = testosterone` OR `kit_type = hormone-recovery` AND `total_testosterone < 12 nmol/L`.
Set `low_testosterone: true` and `testosterone_value: [value]` via `identifyUser()` at result processing.

**Goal:** Founding member deposit. Secondary: Daily Stack subscription.
**Tone:** Empathetic, direct, Keith-personal. This is the most sensitive sequence in the platform. The man receiving this has just found out his testosterone is clinically low. He may be worried, relieved, or both. Do not alarm. Do not pitch immediately. Do not be clinical-cold. Earn the right to ask for the deposit by being genuinely useful first.

**Compliance notes:**
- Do not say "You have low testosterone." Use: "Your results indicate..."
- Do not imply TRT is currently available. Use: "when TRT launches" / "be first when we launch"
- Never trigger this sequence on Kit 2 results alone. Requires confirmed testosterone result.
- Supplement claims must use EFSA-approved language only (see CLAUDE.md).
- Email 3 onward mentions TRT as a future service. Frame consistently as: coming, not live.

---

## Email 1 — Day 0: Results in

**Subject:** Your results: {{ customer.testosterone_value }} nmol/L — the honest picture.
**Preview:** What this number means. No spin.

---

Hi {{ customer.first_name }},

Your {{ event.kit_name }} results are in.

View them here: https://andro-prime.com/account

Your total testosterone came back at {{ customer.testosterone_value }} nmol/L. Dr Ewa Lindo has reviewed your full panel — total testosterone, SHBG, Free Androgen Index, and Albumin — and her notes are alongside your results in the dashboard.

Your results indicate testosterone levels below 12 nmol/L. I'll explain what that threshold means over the next couple of days. For now, I want to be clear about what this result does and doesn't mean.

It doesn't mean something is medically urgent. Your results aren't telling you to go to A&E.

What it does tell you: there's a measurable, specific explanation for what you've likely been experiencing. Not stress. Not age alone. Not "just one of those things." A hormonal picture that has been sitting there, untested, and now has a number attached to it.

That number is the thing you came here to find.

Your results and Dr Ewa's notes are in your dashboard. Read them when you're ready. If anything raises a question, reply to this email. I read every one.

— Keith
Andro Prime

---

_Results are for informational purposes only and do not constitute a diagnosis or medical advice._

---

## Email 2 — +1 day: What this result means

**Subject:** Why {{ customer.testosterone_value }} nmol/L matters — even if your GP says you're fine.
**Preview:** The NHS range, what it's actually measuring, and why the gap exists.

---

Hi {{ customer.first_name }},

Your testosterone is {{ customer.testosterone_value }} nmol/L.

If you've already Googled that, you've probably seen that the NHS reference range runs from around 8 to 29 nmol/L. Technically, anything above 8 clears the "normal" bar. So if you walked into your GP with this result, there's a good chance they'd say there's nothing to treat.

They wouldn't be wrong by their definition. Here's what their definition is measuring.

The NHS reference range is set to identify pathology — specifically, clinical hypogonadism, the point at which testosterone is so low that it causes obvious medical dysfunction. It's a diagnostic threshold designed to flag the floor, not optimise the room.

Most research looking at how men actually feel — energy, drive, recovery, body composition, mood, sexual function — finds that the levels where men report feeling their best tend to cluster between 15 and 25 nmol/L. Below 12 is where the correlation between low testosterone and the symptoms that brought you here becomes significantly stronger.

Your result puts you below that threshold.

This is a known gap between what the NHS measures and what matters for quality of life. Dr Ewa sees it regularly in practice. I experienced it personally before I built this company. "Normal" on a reference range doesn't mean optimal. It means not ill.

You're not imagining it. Your result is showing a specific, measurable cause.

I'll tell you what the options look like from here tomorrow.

— Keith
Andro Prime

---

## Email 3 — +3 days: The founding member programme

**Subject:** TRT is coming. Here's how to be in the first cohort.
**Preview:** What the deposit is, what it isn't, and why it exists.

---

Hi {{ customer.first_name }},

Two things I want to cover today.

**The clinical pathway.**

Testosterone replacement therapy is the clinically appropriate intervention for testosterone levels below 12 nmol/L in men experiencing symptoms. It's not experimental. It's not fringe. It's been prescribed in the UK for decades by NHS endocrinologists and private practitioners alike. The barriers to accessing it aren't clinical — they're structural. NHS reluctance without severe deficiency. Private clinic costs that start at £200 before anyone has even looked at your blood. The gap between having a result and having a prescription.

We're building the shortest, most clinically rigorous path from a result like yours to an actual prescription — under Dr Ewa Lindo's oversight. Not a workaround. A properly registered, CQC-regulated service.

We're currently working through CQC registration. It takes the time it takes. We won't give you a date we can't keep. But when the service opens, we want men with results like yours to be first through the door.

**That's the founding member programme.**

£75 deposit. Fully refundable. No commitment to anything. Applied in full as credit against your first month when TRT launches.

Leaving a deposit doesn't mean you've committed to starting TRT. It doesn't mean you've agreed to anything clinical. It means you've secured your place ahead of men who haven't tested yet.

**Secure your founding member place:** https://andro-prime.com/founding-member

---

**While you wait — support the basics.**

These won't replace TRT. I'll be straight with you about that. But Zinc, Active B12, and Vitamin D are the three building blocks your body needs to function as well as it can with the levels you've got right now. Most men with testosterone below 12 nmol/L are also below optimal on at least one of these — and addressing them makes a measurable difference in how they feel day to day.

The Daily Stack covers all three for £34.95/month. You can cancel any time from your account.

Zinc contributes to the maintenance of normal testosterone levels.
Active B12 contributes to normal energy-yielding metabolism.
Vitamin D contributes to normal muscle function.

**Daily Stack — £34.95/month:** https://andro-prime.com/supplements/daily-stack

No obligation on either. This is just the honest picture of where things stand and what your options are.

— Keith
Andro Prime

---

## Email 4 — +7 days: What TRT looks like in practice

**Subject:** What the TRT service will actually look like — and why the first cohort is limited.
**Preview:** The clinical pathway explained. Founder price. Why places matter.

---

Hi {{ customer.first_name }},

You might be wondering what "founding member" actually means in practice. Here's the honest picture.

**What the service will look like.**

When the clinical service launches, every new patient goes through a structured intake with Dr Ewa Lindo. A confirmatory blood panel — more comprehensive than the wellness kit. A clinical assessment via video. If TRT is appropriate, she prescribes it directly. You receive pharmaceutical-grade testosterone via your preferred delivery method — typically gel or injection — with bloods monitored every 3 months.

It's the same clinical standard you'd get at a Harley Street practice. At a fraction of the cost. No referral. No waiting room. No GP gatekeeping between your result and an actual conversation with a qualified prescriber.

The founding member price will be locked in permanently — below the standard launch price, for as long as you're a patient.

**Why the first cohort is limited.**

Dr Ewa is one clinician. When we open, maintaining clinical quality is the non-negotiable first principle — which means we're onboarding a limited number of new patients at once. Founding members are first. Once those places are filled, new patients join a waiting list.

This isn't artificial scarcity. It's how responsible clinical onboarding works.

If you haven't secured your place and you want to, now is the right time.

**Founding member deposit — £75:** https://andro-prime.com/founding-member

Fully refundable. No strings.

— Keith
Andro Prime

---

## Email 5 — +14 days: Objection handling

**Subject:** Two questions I get asked about TRT. Answered honestly.
**Preview:** "Is it safe?" and "Am I committing to anything?"

---

Hi {{ customer.first_name }},

Two questions that come up most often from men with results like yours. Both worth a straight answer.

**"Is TRT safe?"**

Testosterone replacement therapy has been used clinically for decades. Under proper medical oversight — regular blood monitoring, appropriate dosing, a qualified prescriber — the evidence for safety is well-established. The risks associated with TRT in online forums are almost always connected to unsupervised use: incorrect doses, no monitoring, no medical input.

Our service is built around the opposite of that. Dr Ewa Lindo is the prescribing clinician. She monitors bloods at minimum every 3 months. The dose is adjusted to the individual patient, not a generic protocol. The entire point of CQC registration is that the regulator independently verifies the clinical standards of care — it's not a rubber stamp, it's an inspection regime.

"Is it safe?" is the right question. The answer is: with proper clinical oversight, yes. That's what we're building.

**"Am I committing to anything by leaving a deposit?"**

No. The £75 deposit is fully refundable, any time, no questions asked. Reply to this email and I'll process it personally. When the account portal is live, you'll also be able to request it directly from there.

Leaving a deposit does not commit you to starting TRT. It does not mean you've agreed to anything clinical. It reserves your place ahead of men who haven't tested yet — nothing more.

When TRT launches: first contact, founding member price locked in, £75 applied as credit on month one.

**Secure your place:** https://andro-prime.com/founding-member

If you've already deposited, thank you. A CQC progress update is coming shortly.

— Keith
Andro Prime

---

## Email 6 — +30 days: Personal note from Keith

**Subject:** A word from me — a month on from your result.
**Preview:** No pitch. An honest note on where things stand.

---

Hi {{ customer.first_name }},

It's been about a month since your results came in. I wanted to check in — not to push you toward anything, just to be straight with you.

Getting a result like yours isn't nothing. I know that. When I saw my own numbers for the first time, it was a strange mix of relief — finally a reason — and then a slower realisation that this wasn't going to resolve overnight.

The hardest part isn't the result. It's the gap between knowing and being able to do something about it. That's the gap we're closing, as fast as a regulatory process allows.

CQC registration is moving. I won't give you a date I can't keep. What I will say: founding members will hear about every meaningful milestone before anyone else. Not a press release. A direct email from me.

If you haven't left a deposit and you want to: https://andro-prime.com/founding-member

If you have — thank you. You're the reason this gets built.

If you have questions about your result, about the process, about anything — reply here. I read every one of these.

— Keith
Andro Prime

---

## Email 7 — Monthly: Founding member update

**Subject:** Founding member update — {{ event.month_year }}
**Preview:** Where things stand. What's coming next.

**Note:** This is a recurring template. Replace the placeholder blocks with the relevant update each month before sending. Keep it under 200 words. No pitch. No urgency. Just the honest status.

---

Hi {{ customer.first_name }},

Founding member update for {{ event.month_year }}.

**CQC registration:** [Insert plain-English status update — what stage we're at, what the next milestone is, what the realistic timeline looks like.]

**Founding member count:** [Insert number] men have secured their place.

**Clinical team:** Dr Ewa Lindo is confirmed as our prescribing clinician. [Insert any relevant clinical update if applicable — e.g. confirmatory panel design, monitoring protocol.]

**What this means for you:** [One or two sentences on what this month's progress means for when the service opens and what founding members should expect.]

---

Nothing is being asked of you this month. You've secured your place. We'll be in touch when there's something meaningful to tell you.

If your situation has changed — if you want a refund, if you have questions, if anything is unclear — reply to this email.

— Keith
Andro Prime

---

_Your £75 deposit is held separately from operating revenue and is fully refundable on request._

---

## Customer.io Build Notes

| # | Delay | Subject |
|---|-------|---------|
| 1 | Day 0 | Your results: {{ customer.testosterone_value }} nmol/L — the honest picture. |
| 2 | +1 day | Why {{ customer.testosterone_value }} nmol/L matters — even if your GP says you're fine. |
| 3 | +3 days | TRT is coming. Here's how to be in the first cohort. |
| 4 | +7 days | What the TRT service will actually look like — and why the first cohort is limited. |
| 5 | +14 days | Two questions I get asked about TRT. Answered honestly. |
| 6 | +30 days | A word from me — a month on from your result. |
| 7 | Monthly from Email 6 | Founding member update — {{ event.month_year }} |

**Trigger filter:** `testosterone_value < 12` AND (`kit_type_latest = 'testosterone'` OR `kit_type_latest = 'hormone-recovery'`)

**Stop goal:** `founding_member_deposit` event. Stop sequence at Email 6 — Email 7 is replaced by a dedicated monthly founding member campaign (separate from the result sequence).

**Email 7 implementation:** Build as a separate recurring broadcast or segment-based campaign, not as part of this linear sequence. Audience: `is_founding_member = true`. Send monthly. Drafts need to be created and scheduled each month by Keith or ops — this is not a fully automated send, it requires human input on the CQC update.

**Subject line note:** Emails 1 and 2 use `{{ customer.testosterone_value }}` in the subject line. Customer.io supports attribute interpolation in subject lines. Set a fallback in case the attribute is missing (e.g. "Your results — the honest picture.").

**Parallel sequence handling (Kit 3 only):** If `kit_type_latest = 'hormone-recovery'` AND energy markers are also flagged, seq-03a may also be active. In that case, seq-03b handles the testosterone arm. Do not suppress seq-03a — they address different result categories. Ensure Email 3 does not duplicate the seq-03a supplement recommendation; the Daily Stack secondary CTA in seq-03b Email 3 is the correct and only supplement mention in this sequence.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.testosterone_value }}` — numeric nmol/L, set via identifyUser() at result_received
- `{{ customer.kit_type_latest }}`
- `{{ event.kit_name }}`
- `{{ event.month_year }}` — for Email 7 (e.g. "May 2026")
