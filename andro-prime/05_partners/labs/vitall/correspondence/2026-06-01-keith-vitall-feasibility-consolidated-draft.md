# Consolidated feasibility + COGS draft to Ben (Vitall) — liver panel, Omega-3 Index, Kit 3 Plus

**Status:** Gmail DRAFT, NOT sent — for Keith review and send.
**Gmail draft id:** `r-7062999967052535170` (thread `19e7b270a7ef1d40`, single message).
**From:** keith@andro-prime.com
**To:** ben.starling@vitall.co.uk
**Subject:** Feasibility + COGS (quick fill-in): liver, Omega-3, Kit 3 Plus

**Background (corrected 2026-06-01):** The 30 May "Liver function panel + Omega-3 Index" message was never sent — it was a draft (a `to:vitall` search matched it, so it was first misread as sent). Kit 3 Plus had never been put to Ben at all. All three asks (liver, Omega-3, Kit 3 Plus) are merged into this one draft; **Ben has received nothing on any of them — this is the first.**

**Design — built for Ben's response cadence (see [[vitall-correspondence-state]]):** Ben averages ~1 week to respond, works ~4 hours, then is gone ~1 week, so every round trip costs a week+ and can burn the spec-lock window. This email is therefore engineered as a **single-pass fill-in**: viability + per-test cost bundled per marker (one reply closes each), the likely follow-up pre-empted ("if it cannot run on capillary, just flag it and I will adjust — no alternatives needed"), the call made optional not default (scheduling across his absences adds latency), and a soft deadline to land it in his next window. Timeline pressure kept vague — not handing a middleman our exact deadline.

**Vendor-spec discipline:** lean throughout, marker lists + operational questions only. See [[feedback-no-strategy-to-middleman-partners]].

---

Hi Ben,

I know your time is tight, so I have set this out as quick fill-in answers rather than anything that needs writing up. A one word or a number against each line is perfect. We are locking these specs over the next couple of weeks, so getting this back in your next window would really help. If anything cannot run on our existing finger-prick / dried-blood-spot collection, just flag it and I will adjust the panel my end. No need to propose alternatives.

Three things we want to quote and build: a liver panel, an Omega-3 Index, and an extended Kit 3 ("Kit 3 Plus").

1. Per marker: can it run on our existing capillary / dried-blood-spot collection, and what is the added per-test cost? Just put Y / venous / cost against each.

Metabolic (for Kit 3 Plus):
- HbA1c -
- Fasting Insulin -
- Fasting Glucose -
- Total Cholesterol -
- HDL -
- LDL -
- Triglycerides -
- ApoB -
- Homocysteine -
- Lp(a) (optional) -

Liver panel (albumin already in Kit 1):
- ALT -
- ALP -
- GGT -
- Bilirubin -
- Total protein -
- Globulin -
- AST (optional, for AST:ALT) -

Omega-3 Index:
- EPA/DHA % of red-cell membrane + omega-6:omega-3 ratio -

The one I am least sure of is Fasting Insulin and Fasting Glucose on a posted dried-blood-spot. If they are not reliable in transit, just say so and I will lean on HbA1c instead.

2. Fasted or non-fasted? I assume lipids, glucose and insulin need fasted, and liver plus the rest are fine non-fasted. Correct me if not, and one line on the collection guidance to ship in the box.

3. All-in COGS (kit, processing, return postage, results, same form as the 58.50 / 63 / 98 for Kits 1 to 3):
- Liver panel, standalone:
- Kit 3 Plus, full 18 markers:
- Omega-3 Index, standalone:
- Liver markers on top of Kit 3 Plus (marginal, vs standalone):

4. Setup, quick ones:
- New shortCode or extend an existing route, per panel?
- Lead time to add to the dispatch route once we say go?
- Same 2 to 5 working day turnaround?
- Will our integration take an 18-marker payload (around 25 with liver) in one report, or is that our side?

That is everything. A one-line answer per point is ideal, or grab 15 minutes on a call if that is genuinely faster for you. Keen to keep this moving.

Best,
Keith

---

*Consolidated + cadence-optimised 2026-06-01. Panel source: `04_products/kits/kit-3-plus.md` + `liver-health-opportunity.md` + `supplements/omega-3-loop-spec.md`. Send is Keith's call.*
