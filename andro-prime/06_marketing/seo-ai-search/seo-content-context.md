# SEO & Content Context — Andro Prime

*Last updated: April 2026*
*Skills: seo-audit, ai-seo, site-architecture, programmatic-seo, schema-markup, content-strategy*

> Read `../positioning/product-marketing-context.md` first. This file adds SEO and content-specific detail.

---

## Site Architecture

**Domain:** andro-prime.com (custom Next.js site, hosted on Vercel — not Shopify)

**URL structure:**

| Page | URL | Primary keyword |
|---|---|---|
| Homepage | / | men's health blood test UK |
| Test selector quiz | /test-selector/ | which blood test do I need |
| Kit 1 | /kits/testosterone/ | testosterone test at home UK |
| Kit 2 | /kits/energy-recovery/ | men's energy blood test UK |
| Kit 3 | /kits/hormone-recovery/ | men's health check UK |
| Daily Stack supplement | /supplements/daily-stack/ | men's vitamin D B12 zinc supplement UK |
| Collagen supplement | /supplements/collagen/ | joint recovery supplement men |
| Founding member | /founding-member/ | private TRT UK waiting list |
| Waitlist | /waitlist/ | — (email capture, not indexed) |
| PT affiliate landing | /partners/pt-affiliate/ | men's health affiliate uk / personal trainer affiliate programme (low vol, primary purpose is warm-intro link target) |

**Priority crawl order:** Homepage — Kit 2 — Kit 1 — Kit 3 — Test Selector — Supplements — Founding Member

---

## Keyword Strategy

### Tier 1 — Purchase intent (Google Search, Month 1)

**Kit 1 (Testosterone):**
- `testosterone test at home UK` — high intent, moderate volume
- `private testosterone blood test` — high intent
- `finger prick testosterone test` — specific, lower competition
- `GP refused testosterone test` — **highest intent, lowest competition — prioritise**
- `testosterone borderline range UK` — symptomatic, research-intent
- `low testosterone symptoms UK private` — ICP 1 entry

**Kit 2 (Energy & Recovery):**
- `energy blood test UK` — highest volume in category
- `men's energy blood test` — gender-qualified
- `fatigue blood test at home` — symptom-first
- `why am I always tired male` — ICP 2 top-of-funnel
- `slow recovery after gym` — ICP 2 symptom
- `joint inflammation blood test` — Kit 2 hs-CRP angle

**Kit 3 (Hormone & Recovery Check):**
- `men's health check UK` — premium, low competition
- `comprehensive blood test men UK` — research intent
- `men's wellness check at home` — broad, ICP 3
- Note: "MOT" is acceptable in meta descriptions, blog content, and SEO-targeted copy where it matches search intent. Do not use it as primary page framing or hero copy — see `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 2 for rationale.

### Tier 2 — Informational (blog, YouTube, Reddit)

**Validated against UK Semrush, May 2026. See `blog-ai-seo-strategy.md` for the full pillar + spoke map and 12-week sequencing.**

**Pillar A — Vitamin D** (Kit 2 / Daily Stack):
- `low vitamin d symptoms` (9.9k vol, KD 36)
- `14 signs of vitamin d deficiency` (9.9k vol, KD 20 ⭐)
- `how much vitamin d3 should i take daily` (9.9k vol, KD 61)
- `best vitamin d supplement` (6.6k vol, KD 43)
- `vitamin d benefits` (5.4k vol, KD 53)

**Pillar B — Why am I always tired** (Kit 2):
- `why am i always tired` (12.1k vol, KD 47)
- `why am i so tired all the time` (9.9k vol, KD 45)
- `feeling tired all the time` (8.1k vol, KD 70)
- `why am i extremely exhausted` (6.6k vol, KD 75)

**Pillar C — Testosterone & low T** (Kit 1, **high compliance gate**):
- `testosterone test uk` (3.6k vol, KD 57)
- `low testosterone symptoms in men` (8.1k vol, KD 72)
- `testosterone blood test` (2.9k vol, KD 56)

**Pillar D — Blood test markers explained** (Kit 2 + Kit 3):
- `crp blood test` (18.1k vol, KD 47)
- `fbc blood test` (12.1k vol, KD 34)
- `cholesterol test` (9.9k vol, KD 48)
- `full blood count` (8.1k vol, KD 41)
- `nhs blood test` (6.6k vol, KD 27 ⭐)

**Pillar G — Inflammation** (Kit 2 / Collagen):
- `inflammatory markers blood test` (1k vol, KD 23 ⭐)
- `inflammation in the body` (1.6k vol, KD 40)
- `what causes inflammation in the body` (1.6k vol, KD 59)
- `inflammation blood test` (590 vol, KD 42)
- `inflammation symptoms` (590 vol, KD 45)
- `how to reduce inflammation` (880 vol, KD 47)

**Pillar E — Male menopause / andropause** (Kit 1 / FM list, **conditional — pending Keith + Ewa**):
- `andropause` (5.4k vol, KD 42)
- `male menopause` (5.4k vol, KD 55)

**Pillar F — Patient-owned data** (GEO flagship — AI citation KPI, no Google demand):
- No volume targets. Measured by AI citation rate in Perplexity / ChatGPT / Google AI Overviews.

**Queries deprecated from the v1 Tier 2 list** (returned 0 UK vol in May 2026 Semrush validation): `what is a good testosterone level for a man UK`, `testosterone normal range vs optimal range`, `vitamin D deficiency symptoms men`, `how long does it take to recover from vitamin D deficiency`, `methylcobalamin vs cyanocobalamin`, `active B12 deficiency symptoms men UK`, `ferritin levels men fatigue`, `hs-CRP what does it mean`, `NHS testosterone threshold vs private`. Kept here only as a record of what didn't validate.

### Negative keywords (apply to all paid campaigns immediately)
`free, nhs, symptoms of, what is, how to, reddit, forum, diagnosis`

---

## Schema Markup Requirements

**Homepage / product pages:** Product schema (name, price, availability, brand)

**Kit pages:**
```json
{
  "@type": "Product",
  "name": "Testosterone Health Check — At-Home Blood Test Kit",
  "brand": "Andro Prime",
  "offers": { "price": "29.00", "priceCurrency": "GBP" },
  "aggregateRating": { ... }
}
```

**Blog articles:** Article schema + BreadcrumbList

**FAQ sections:** FAQPage schema (use on Kit pages — "Is this the same as an NHS test?", "How does the finger prick work?", "When will I get results?")

**Organisation schema on homepage:** Include GMC registration reference for Dr Ewa Lindo and UKAS accreditation number.

---

## Content Strategy

### Content funnel by ICP

| Stage | Format | ICP | Example topics |
|---|---|---|---|
| Awareness | Blog, YouTube, LinkedIn, Reddit | ICP 1 & 2 | "Why your GP says your testosterone is normal (and why that's not the same as good)" |
| Consideration | Blog, Email | ICP 1 | "What does a testosterone level of 14 nmol/L actually mean?" |
| Decision | Landing page, Email | All | Kit product pages, test selector |
| Retention | Email sequence | Subscribers | Results explainers, retest prompts, supplement science |

### Publishing cadence (Phase 0)

| Channel | Frequency | Owner |
|---|---|---|
| LinkedIn posts | 3–4/week | Keith (personal voice) |
| YouTube scripts | 2/month | Keith (long-form trust-builder) |
| Blog articles | 2/month | SEO-targeted, ICP 1 & 2 |
| Instagram reels | 3–4/week | Repurpose LinkedIn + YouTube |
| Reddit | As needed | Keith (community, never pitching) |

### Blog article rules
1. Start with the target keyword in H1 and first 100 words
2. Informational intent first — rank before you pitch
3. All health claims sourced (reference NICE guidelines, NHS ranges, PubMed)
4. Use exact customer language from `../positioning/product-marketing-context.md` Customer Language section
5. Internal link to the most relevant kit page from every article
6. No use of "diagnose," "treat," "cure" — compliance rules apply to blog too
7. Save to `../content/blog/`

### LinkedIn post format
- Short paragraphs (2–3 lines max)
- Strong hook in line 1 — symptom or counterintuitive statement
- No bullet-point listicles
- End with a question or single CTA
- No stock images — product or real-life only
- Save to `../content/linkedin/`

### YouTube script structure
1. Hook (0–30s): Symptom identification — "If you're watching this, you've probably..."
2. Problem (30s–3min): Why the NHS/GP system fails this cohort
3. Data-led solution (3–8min): What the blood test shows and why it matters
4. CTA (final 60s): Link to specific kit page
5. Save to `../content/youtube-scripts/`

### Reddit rules (non-negotiable)
- Never pitch directly or link to the site unprompted
- Add genuine value — data, experience, nuance
- Keith is identifiable — everything he posts reflects on the brand
- If someone specifically asks for a product recommendation, then and only then mention Andro Prime
- Track reply drafts in `../content/reddit/`

---

## AI Search Optimisation (ai-seo)

Target placements in AI answers for:
- "What's the best testosterone test at home UK?"
- "How do I check my testosterone levels without a GP?"
- "What blood tests should men over 40 get?"
- "What causes fatigue in men over 40?"

**Structured content requirements:**
- FAQ schema on all kit pages
- Clear "What we test" and "What results mean" sections
- Comparison content (Andro Prime vs Medichecks, Andro Prime vs NHS testing)
- Author bio for Ewa Lindo on all clinical-adjacent content

---

## Programmatic SEO Opportunities (post-launch)

Consider at scale for:
- `/results/testosterone-[range]/` — "What does a testosterone level of [X] nmol/L mean for men?"
- `/compare/[competitor]/` — Andro Prime vs Medichecks, Andro Prime vs Balance My Hormones
- `/symptoms/[symptom]/` — "Persistent fatigue men UK — could it be your testosterone?"

Do not build until Kit 1, 2, and 3 product pages are live and indexed.
