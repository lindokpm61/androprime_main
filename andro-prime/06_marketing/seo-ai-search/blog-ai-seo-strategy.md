# Andro Prime — Blog & AI SEO Strategy
## Content for AI Search Visibility | April 2026

**Version:** 1.0
**Owner:** Keith Antony
**Status:** Active
**Cross-reference:** `../master-plan/phase0-marketing-plan.md`, `seo-content-context.md`

---

## Why a Blog (AI Search Rationale)

ICPs spend 6–18 months researching before buying. That research now happens on Perplexity and ChatGPT — not just Google. These platforms answer informational queries directly and cite sources visibly. Getting cited in those answers puts Andro Prime content in front of ICP1 and ICP2 at the exact moment they are validating their problem.

This is **GEO — Generative Engine Optimisation** — the practice of structuring content to be cited by AI search systems (ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot).

**Why Andro Prime is well-positioned for AI citation:**
- Keith's first-person, lived-experience voice scores on E-E-A-T "Experience" — something lab-portal competitors cannot replicate
- Dr Ewa Lindo (named GMC-registered GP with credentials) enables expert attribution, which boosts citation probability ~30%
- Specific biomarker data with cited sources = the exact format AI systems extract and repeat (+37–40% visibility boost from statistics)

---

## Priority Articles (Phase 0)

Target informational queries that ICPs type into Perplexity/ChatGPT at the research stage. Every article should link internally to the relevant kit CTA at the end — not throughout.

| Priority | Article Title | Target Query | ICP | Kit CTA |
|----------|--------------|-------------|-----|---------|
| 1 | What does "normal" testosterone actually mean? | `testosterone normal range UK men` | ICP1 | Kit 1 |
| 2 | Why am I always tired even though I sleep enough? | `why always tired male UK` | ICP1 + ICP2 | Kit 2 |
| 3 | Why am I not recovering from the gym like I used to? | `slow recovery after workout men` | ICP2 | Kit 2 |
| 4 | What is free testosterone, and why does it matter more than total T? | `free testosterone vs total testosterone` | ICP1 | Kit 1 |
| 5 | Vitamin D deficiency symptoms in men | `low vitamin D symptoms men UK` | ICP2 | Kit 2 |
| 6 | What blood tests should men over 40 actually get? | `blood tests men over 40 UK` | ICP3 | Kit 3 |
| 7 | Active B12: why the form of B12 you take actually matters | `methylcobalamin vs cyanocobalamin men` | ICP2 | Kit 2 |

---

## Article Structure Requirements (for AI citation)

Every article must include these elements to be extractable by AI systems:

### Required elements
- **Direct answer in opening paragraph** (40–60 words) — this is the passage AI systems pull as a snippet
- **Named byline with credentials:** "Written by Keith Antony, Founder, Andro Prime. Reviewed by Dr Ewa Lindo, GMC-registered GP."
- **Specific numbers with cited sources** — e.g. "The NHS lower reference range is 8 nmol/L, but research suggests symptoms begin below 15 nmol/L (Journal of Clinical Endocrinology, 2022)"
- **FAQ section** — natural-language questions structured for direct AI extraction
- **"Last updated: [date]"** displayed prominently (recency signal)
- **FAQPage schema markup** on every article
- **Article schema** with author, datePublished, dateModified
- **Internal CTA** to the relevant kit — end of article only

### Heading structure
Match headings to how ICPs phrase queries — not to how a medical textbook would frame them.

| Use this | Not this |
|----------|----------|
| "What does 'normal' even mean?" | "Reference Range Interpretation" |
| "Why does free T matter more?" | "Free Testosterone Bioavailability" |
| "What should you actually do about it?" | "Recommended Next Steps" |

---

## AI Bot Access (robots.txt)

Ensure these bots are NOT blocked in robots.txt:

| Bot | Platform |
|-----|---------|
| `GPTBot` | ChatGPT |
| `ChatGPT-User` | ChatGPT |
| `PerplexityBot` | Perplexity |
| `ClaudeBot` | Anthropic |
| `anthropic-ai` | Anthropic |
| `Google-Extended` | Google AI Overviews / Gemini |
| `Bingbot` | Microsoft Copilot |

Block `CCBot` (Common Crawl) to prevent training data scraping if preferred, while keeping search bots open.

---

## GEO Optimisation Summary (Princeton Research, KDD 2024)

| Method | Visibility Boost | Application for Andro Prime |
|--------|:---------------:|-----------------------------|
| Cite sources | +40% | Link to NHS reference ranges, peer-reviewed studies |
| Add statistics | +37% | Specific nmol/L figures, % of men affected, study dates |
| Expert quotations | +30% | Dr Ewa Lindo pull quote in every article |
| Authoritative tone | +25% | Keith's direct voice + clinical backing |
| Keyword stuffing | **-10%** | Never. Plain English only. |

**Optimal combination:** Statistics + fluency = maximum citation rate. Low-domain-authority sites benefit disproportionately — up to 115% visibility increase vs. high-DA competitors when content is properly structured.

---

## Third-Party Presence (amplifies AI citation)

AI systems cite where you appear, not just your own domain. Andro Prime should build presence on:

- **Reddit** — r/UKTRT, r/testosterone, r/malehealth. Keith participates authentically. No direct links unless asked. (See Section 14 of CLAUDE.md for Reddit rules.)
- **YouTube** — Videos for high-intent queries (YouTube is heavily cited in Google AI Overviews)
- **Quora** — Answer testosterone/fatigue questions with depth and attribution

---

## Compliance Reminder

All articles must comply with CLAUDE.md Section 8 rules:
- Never use "diagnose" or "diagnosis"
- Never recommend a course of treatment
- "Your results may show..." not "You have..."
- Supplement copy: EFSA-approved claims only
- Do not mention TRT as currently available

Hedged, evidence-cited language is not just compliant — it is the exact style AI citation systems favour over promotional copy.

---

## Monitoring AI Visibility

Once articles are live, check monthly:

1. Run the article's target query through ChatGPT, Perplexity, and Google
2. Record: Is Andro Prime cited? Who is instead?
3. Log in `10_launch-ops/dashboards/`

**Tools when budget allows:** Otterly AI, Peec AI, or LLMrefs for automated tracking.

---

*Last updated: April 2026*
*Owner: Keith Antony / Andro Prime*
