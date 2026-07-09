# Pre-Launch Checklist — Go/No-Go Gate

> **Status: DRAFT — assembled 2026-07-02 from `qa-gates.md` + the content-approval register + DPIA §5.** **Not yet ratified as the launch gate — Keith signs off (clinical items co-signed by Ewa) before it governs go-live.** Until then, live gate status stays in `../10_launch-ops/STATE.md` + ClickUp (sprint `901217968514`).

This is the single cross-workspace go/no-go. **Nothing customer-facing** — a page, email, automation, or paid/affiliate promotion — ships until the relevant gate below passes. No partial launch. Items are checked in ClickUp; this file is the consolidated view.

**Primary blocker for everything: the first live Vitall order** — it unblocks both genuinely-open QA gates (checkout E2E + real-data dashboard).

---

## A. Build gates

Canonical set: `../10_launch-ops/implementation-checklists/qa-gates.md` (Gates 1–5 + 0A).

| Gate | Must pass before | State |
|---|---|---|
| Gate 1 — LP pages ship | affiliate / social promotion | see qa-gates + ClickUp |
| Gate 2 — Canonical pages ship | SEO indexing | see qa-gates + ClickUp |
| Gate 3 — Checkout live | taking real money | **open — checkout E2E, ClickUp `869d99m5a`** (pending first Vitall order) |
| Gate 4 — Results dashboard live | showing real results | **open — real-data dashboard, ClickUp `869d99m6m`** (pending first Vitall order) |
| Gate 5 — Marketing scale | paid / affiliate scale | see qa-gates |
| Gate 0A — Supplement inventory | committing MOQ spend | not met (25+ supplement pre-orders; deposit shelved 2026-05-08) |

---

## B. Compliance sign-offs

Source of truth: `content-approval/content-approval-register.md` (**17 approved / 3 pending** as of this draft — see `STATE.md`).

- [ ] **CA-001** PT-Brief v2.3 — **solicitor** commission clause (Ewa + Keith signed)
- [ ] **CA-002** PT-Attestation v2.3 — **solicitor** clause 9
- [ ] **CA-017** Newsletter #002 — **Ewa + Keith**
- [ ] Every external-facing artefact going live has passed `compliance-preflight` + carries an Ewa sign-off in the register
- [ ] No banned language on any live page ("diagnose / treat / cure", "TRT available now")
- [ ] Ashwagandha silent everywhere; results copy uses "your results indicate…"

---

## C. Data protection (DPIA §5)

Source: `dpia/phase0-dpia.md` §5. **Done:** ICO registration **ZC172852** (2026-06-12); Vitall controller-to-controller agreement **executed 2026-06-02**.

- [x] Supabase region confirmed **Ireland** (EU) + **DPA incorporated via Supabase's standard terms** (no separately signed DPA) — confirmed by the 2026-07-05 audit
- [x] Health-data processing consent (CA-018) **deployed** (built at checkout, prod migration applied; deployment verified via git ancestry, 2026-07-05 audit)
- [ ] Energy-trait CIO emission gated on CA-018 consent (implemented in code 2026-07-07; deployed + verified on a live result — must ship with/after the CA-018 checkout deploy)
- [ ] Separate Art 9(2)(a) opt-in for low-T storage + nurture **built** (gates nurture activation)
- [ ] Privacy policy updated to describe the low-T nurture purpose + lawful basis
- [ ] Data-deletion workflow live (manual process acceptable for launch)
- [ ] All biomarker panels exclude unstable postal markers (Mg/K — haemolysis)

---

## D. Analytics & infrastructure

- [ ] **GA4** live (`G-D5M4J5M3F6`) + cookie-consent banner with a genuine reject path; **Sentry** live (stack is GA4 + Sentry — no ad pixels / Plausible)
- [ ] Cloudflare **AI-crawl bot-block WAF rule confirmed deleted** (Googlebot + bingbot not 403'd — this recurred twice; see `06_marketing/CONTEXT.md`)
- [ ] Deploy pipeline verified (Coolify GitHub webhook registered; push → rebuild → live)
- [ ] SSL active; 404/500 return correct status codes; authenticated app routes excluded from session recording

---

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Go/no-go owner | Keith Lindo | ☐ | — |
| Clinical items | Dr Ewa Lindo | ☐ | — |

_Once ratified, drop the DRAFT flag here and in `CONTEXT.md`, and this becomes the authoritative launch gate._
