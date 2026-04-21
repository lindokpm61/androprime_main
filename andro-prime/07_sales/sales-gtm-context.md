# Sales, GTM & Strategy Context — Andro Prime

*Last updated: April 2026*
*Skills: revops, sales-enablement, launch-strategy, pricing-strategy, competitor-alternatives, marketing-ideas, marketing-psychology, customer-research*

> Read `../../06_marketing/positioning/product-marketing-context.md` first. This file adds GTM, sales, and strategy detail.

---

## Launch Strategy

### Phase 0 — Go-to-market sequence

**Principle:** Affiliate and owned channels first. Paid media follows proof of demand, not the other way around.

| Week | Milestone | Channel priority |
|---|---|---|
| 1 | All three kits launch simultaneously. Google Search live. Affiliates notified, codes active. Keith LinkedIn post. | Affiliate + Google + LinkedIn |
| 2–3 | Influencer content begins going live. Monitor Google CAC. | Organic + Google Search |
| 4 | Meta pixel has 2–4 weeks of data. Meta warm retargeting activates. | Add Meta retargeting |
| 6 | Gate 0A review (25+ supplement pre-orders?). Supplement pre-order gate. Cold Meta test begins (if social proof in place). | Full channel mix |
| 8 | Supplement inventory arrives if Gate 0A passed. Full email sequences live. | Full channel mix |
| 10 | Gate 0B review (≥10% supplement conversion?). | Scale if Gate 0B passed |
| Month 4 | Gate 0C review (200+ kits, 40+ subs, MRR > £1,500). CQC prep begins. | Scale all channels |

> Note: The canonical launch sequence is simultaneous Day 1 launch for all three kits. See `../../06_marketing/master-plan/phase0-acquisition-strategy.md` for full week-by-week detail.

---

## RevOps & Lead Lifecycle

### Customer journey stages

| Stage | Touchpoint | Status in CRM (Customer.io) |
|---|---|---|
| Awareness | Blog, YouTube, LinkedIn, Reddit | Not captured |
| Interest | Waitlist signup | Segment: `waitlist` |
| Consideration | Test selector completion | Segment: `quiz-complete-[kit]` |
| Purchase | Kit order | Segment: `kit-buyer-[kit-number]` |
| Result received | Dashboard login | Segment: `result-received-[outcome]` |
| Supplement subscriber | First subscription payment | Segment: `subscriber-active` |
| Founding member | Deposit paid | Segment: `founding-member` |
| Churned | 90+ days no engagement | Segment: `churned` |
| Re-engaged | Any purchase after churn | Back to `kit-buyer` or `subscriber-active` |

### Customer.io segment priority build order
1. `waitlist` — pre-launch
2. `kit-buyer-kit1`, `kit-buyer-kit2`, `kit-buyer-kit3`
3. `result-received-low-t`, `result-received-energy-deficiency`
4. `subscriber-active`
5. `founding-member`
6. `churned`, `at-risk` (45 days no engagement)

---

## Sales Enablement

### Affiliate sales materials

**For influencers:**
- Product brief (1 page): what Andro Prime is, what the kit does, key facts for scripting
- Messaging guide: approved claims, words to avoid, how to describe the result experience
- Sample kit (sent free)
- Commission tracking link + UTM parameters
- FAQ doc: "What if a follower has a question about their result?"

Save to: `../../06_marketing/affiliates/influencer/`

**For PTs:**
- Why your clients are probably undertesting (1-page brief)
- How the discount code works (15% off for client, 20% for PT)
- Suggested talking points: "I'd recommend getting a baseline before we change your programme"
- Kit product sheet: biomarkers, turnaround, how results are delivered

Save to: `../../06_marketing/affiliates/pt-network/`

---

## Pricing Strategy

### Current pricing (non-negotiable in Phase 0)

| Product | Price | Rationale |
|---|---|---|
| Kit 1 | £29 | Sub-£30 psychological threshold. Impulse-accessible. |
| Kit 2 | £44 | £44.99 would feel more like a supplement. £44 feels like a test. |
| Kit 3 | £69 | Premium. Compared to £200+ private consultation. |
| Daily Stack | £34.95/mo | Below £35 psychological barrier. |
| Collagen | £29.95/mo | Below £30. |
| Complete Stack | £54.95/mo | Saves vs buying individually (£64.90). Anchor: compare to both separate subs. |
| Founding member deposit | £75 | Low enough to be impulsive. High enough to signal commitment. |

### Price presentation rules
- Show price above the fold on all kit pages
- Don't show monthly subscription cost on kit pages — this is a separate funnel step
- On supplement pages: show monthly price prominently, show annual saving as social proof ("Save £X vs monthly")
- Never discount kit prices on ad traffic — it devalues the test and trains for discount-seeking behaviour
- PT affiliate: the client discount (15%) is presented as a professional endorsement, not a sale

### Future pricing (post-CQC)

| Product | Price | When |
|---|---|---|
| TRT Subscription | £185/mo | Post-CQC |
| Tadalafil Add-On | £15/mo | Post-CQC |
| Anastrozole Add-On | £12/mo | Post-CQC |
| Premium Blood Panel | £149 | Post-CQC |
| Peptide Therapy | £200–400/mo | Post-CQC |

Do not publish future pricing on any current page.

---

## Competitor Alternatives Framework

### When to use competitor comparison content

Appropriate channels: blog articles, SEO landing pages, paid search (competitor name targeting with caution)
Not appropriate: ad creative for cold audiences (confuses the message)

### Competitor comparison matrix

| Feature | Andro Prime | Medichecks | Balance My Hormones | Optimale | NHS GP |
|---|---|---|---|---|---|
| Entry price | £29 | £59–£99 | £0 (consult first) | £0 (consult) | Free |
| Branded results dashboard | Yes | No (lab portal) | N/A | N/A | N/A |
| Plain-English interpretation | Yes | Basic | Yes | Yes | Varies |
| Supplement recommendation | Yes (data-led) | No | No | No | No |
| Clinical pathway | Yes (founding member — TRT) | No | Yes (TRT) | Yes (TRT) | Limited |
| Clinical credibility | Ewa Lindo, GMC, UKAS | UKAS lab only | Yes | Yes | Yes |
| Personalised CTA | Yes | No | Yes | Yes | No |
| Founder story | Keith Antony | No | No | No | — |

### Messaging for competitor alternative pages

**vs Medichecks:** "Medichecks gives you a number. We give you a number and tell you what to do with it."

**vs Balance My Hormones:** "They're great if you've already decided you need TRT. We help you find out if you do — and what to do if you're borderline."

**vs NHS:** "The NHS tests for deficiency. We help you optimise. 'Normal' is not the same as good."

---

## Marketing Psychology Principles (by ICP)

### ICP 1 — Symptomatic Achiever

**Primary drivers:** Validation, hope, authority
- They want to be believed. Keith's story = the moment of recognition.
- Social proof: others in the same position who found answers
- Authority: Dr Ewa Lindo. UKAS lab. GMC number visible.
- Loss framing: "How many more years are you going to feel like this before you get the data?"

**Anchoring:** Compare to private GP consultation (£200+) or TRT clinic. £29 feels trivial.

**Commitment & consistency:** Founding member deposit. Once paid, psychologically committed to the TRT pathway.

### ICP 2 — Proactive Optimiser

**Primary drivers:** Data, efficiency, results
- Skip the emotional story — they want the biomarker list and what each means
- Social proof: PT endorsement, training-specific testimonials
- Specificity: "Your Vitamin D, your Magnesium, your inflammation — not a generic men's health panel"
- ROI framing: "Recover faster. Train harder. Know why."

### ICP 3 — Curious Maintainer

**Primary drivers:** Curiosity, control, prevention
- "Baseline" framing: "Know where you stand before something goes wrong"
- FOMO: subtle — "Men who get tested earlier have more options"
- Simplicity: Kit 3 gives everything in one. No decision fatigue.

---

## Customer Research

### Where to find ICP language (primary sources)

| Source | What to extract | Where to look |
|---|---|---|
| r/UKTRT | Exact phrases men use about GP dismissal, symptoms, TRT journey | reddit.com/r/UKTRT |
| r/testosterone | Supplement questions, test interpretation requests | reddit.com/r/Testosterone |
| r/malehealth (UK) | General men's health sentiment | reddit.com/r/malehealth |
| Trustpilot: Medichecks | What customers liked/disliked — language to steal or avoid | trustpilot.com |
| Trustpilot: Balance My Hormones | TRT patient sentiment | trustpilot.com |
| Keith's own story | First-person ICP narrative | Primary source |

**Research tracking:** `../../01_strategy/competitive-landscape/`

### Voice-of-customer capture (ongoing)

After purchase, trigger 1-question survey at Day 7:
> "In your own words, what made you decide to order?"

Open text. No multiple choice. Collect verbatim language. Feed back into copy and ad creative.

Survey tool: Customer.io post-purchase triggered campaign or embedded in results dashboard.
