# Patient-Owned Data — Propagation Checklist

**Version:** 1.0
**Owner:** Keith Antony
**Status:** Awaiting Keith review before any customer-facing rewrite
**Source of truth:** `messaging-framework.md` v1.0 + `brand-description.md` v1.1 (both updated 2026-05-19)
**Tracks:** ClickUp 869d99m77 — "Brand voice update to lead with patient-owned data framing (V7-derived)"

The brand source of truth is updated. This checklist is the propagation plan for LPs and emails. **Nothing on this list is started.** Each item is a Keith-owned, voice-sensitive, compliance-gated rewrite. Do not bulk-rewrite customer surfaces until Keith approves the lead language below.

> ✅ **Re-verified accurate 2026-06-22.** Grepped the LP/email surfaces — none has adopted the new data-ownership lead ("yours to keep" / "you see everything we see" etc.), so every row below is genuinely still **Not started** except #18 (brand-description.md, done). The gate (Keith sign-off on the lead language) has not yet translated into any customer-surface rewrite. ClickUp `869d99m77` correctly sits **in progress** (source docs updated, propagation pending).

---

## The lead change (what every surface must move toward)

- **Old lead:** diagnostic-first — "blood data before any recommendation."
- **New lead:** data-ownership inversion — "your results, in your dashboard, tracked over time, and yours to keep. You see everything we see." Blood-data-first stays as the method beneath it, not the headline.
- **Phase-0 wording rule:** customer-facing copy says *your data / your health record / yours to keep* — never the literal "patient-owned data" (that is the internal pillar name only; Phase 0 has customers, not patients).
- **Feature-truth rule:** "your dashboard" and "yours to keep" are true at launch. "Tracked over time" lands as customers retest / when tracker v1 ships (M3-M4). Do not imply a live longitudinal tracker or any interpretation/insights layer (observation-only).

Every rewritten surface must pass: compliance pre-flight (`compliance-preflight` skill) + Keith voice/pub test + (any email/LP touching health markers or results) Ewa review.

---

## LP surfaces

Priority: P1 = highest-visibility lead surface, do first; P2 = supporting; P3 = low/again-later.

| # | Surface | File | Current lead (approx) | Priority | Status |
|---|---------|------|-----------------------|----------|--------|
| 1 | Homepage hero | `app/(marketing)/page.tsx` | diagnostic-first / GP-gap | P1 | Not started |
| 2 | Homepage meta description | homepage `metadata` | short brand desc (old) | P1 | Not started |
| 3 | About page | `app/(marketing)/about/page.tsx` | long brand desc (old) | P1 | Not started |
| 4 | How it works | `app/(marketing)/how-it-works/page.tsx` | process-first | P2 | Not started |
| 5 | Kits hub | `app/(marketing)/kits/page.tsx` | kit features | P2 | Not started |
| 6 | Kit 1 / 2 / 3 | `app/(marketing)/kits/{testosterone,energy-recovery,hormone-recovery}/page.tsx` | marker/price-first | P2 | Not started |
| 7 | Supplements hub + Daily Stack + Collagen | `app/(marketing)/supplements/…` | product-first | P3 | Not started |
| 8 | Dedicated LPs | `app/lp/{daily-stack,collagen,…}/page.tsx` | product-first | P2 | Not started |
| 9 | Founding member | `app/(marketing)/founding-member/page.tsx` | FM/clinical-future (already compliant, audited) | P3 | Not started |
| 10 | test-selector / waitlist / blog / faq / contact | `app/(marketing)/…` | mixed | P3 | Not started |
| 11 | `public/llms.txt` | `frontend/public/llms.txt` | mirrors old brand desc | P2 | Not started |

## Email surfaces

| # | Surface | File | Note | Priority | Status |
|---|---------|------|------|----------|--------|
| 12 | seq-01 Waitlist E1 (welcome) | `email-templates/sequences/seq-01-waitlist.md` | best email to lead with data-ownership | P1 | Not started |
| 13 | seq-07 Newsletter Welcome | `email-templates/sequences/seq-07-newsletter-welcome.md` | "what this is" para can adopt new lead | P2 | Not started |
| 14 | seq-02 / seq-04 / seq-06 opens | respective `seq-*.md` | reframe opener, keep body | P2 | Not started |
| 15 | seq-03a/b/c/d results | `seq-03*.md` | results copy — Ewa-sensitive; light touch only | P3 | Not started |
| 16 | seq-05 churn | `seq-05-churn-prevention.md` | retention angle aligns with data-ownership | P3 | Not started |
| 17 | Transactional T-01..T-09 | `email-templates/transactional/transactional-emails.md` | mostly operational; T-01/T-03 only if natural | P3 | Not started |

## Social / external (manual, Keith)

| # | Surface | Action | Status |
|---|---------|--------|--------|
| 18 | brand-description.md short/long/one-liner | DONE 2026-05-19 (v1.1) | ✅ |
| 19 | LinkedIn / X / IG bios | Keith updates external profiles from brand-description.md short version | Not started |
| 20 | Affiliate / influencer onboarding packs | reissue from brand-description.md v1.1 | Not started |

---

## Recommended sequence

1. Keith signs off the lead language in `messaging-framework.md` v1.0 + `brand-description.md` v1.1 (gate for everything below).
2. P1 batch: homepage hero + meta, About, seq-01 E1. One commit, compliance pre-flight + Keith voice, before any P2.
3. P2 batch after P1 reviewed live.
4. P3 as polish before paid/affiliate scale.
5. Social/external (18-20) once brand docs signed off — independent of code.

This checklist is the definition-of-done tracker for ClickUp 869d99m77's "across LPs, emails, social bios" clause. Mark items as they land; close the ClickUp task when P1+P2 are done and P3 is either done or explicitly deferred.
