# Unified Content Calendar

**Owner:** Keith Antony | **Status:** Framework v1, 2026-07-06 | **Read first:** `CONTEXT.md`

The manage layer: one cross-channel cadence and one status model, so nothing is tracked in three places at once. This does not replace the blog publication gate (`seo-ai-search/content-calendar.md` stays the source of truth for *which blog article publishes when* and the Mon/Thu flip procedure). It sits above it and adds the founder-brand and atomised channels to the same weekly view.

**Cadence principle (from the platform-reality file):** consistency beats volume. Fewer, better posts out-perform high-frequency dumping on every channel except real-time feeds. The only real penalty is going silent. Keith is the bottleneck, so the cadence below is deliberately sustainable, not maximal. Batch-record to stay ahead.

---

## 1. The weekly rhythm (confirmed by Keith, 2026-07-09)

Anchored on the locked blog cadence (Mon + Thu), with the founder brand and atomised derivatives interleaved. Confirmed as-proposed; revisit only if Keith's recording capacity changes.

| Day | Blog (Spine A) | Founder / social (Spine B) | Email / other |
|---|---|---|---|
| **Mon** | Publish pillar slot (flip per blog calendar) | Reel/Short atomised from the pillar; LinkedIn post | — |
| **Tue** | — | Facebook native post (older segment) | — |
| **Wed** | — | Founder-journey short (series) | Newsletter (when an issue is due) |
| **Thu** | Publish pillar slot (flip per blog calendar) | Reel/Short + LinkedIn post | — |
| **Fri** | — | YouTube long-form explainer (1 per published pillar, as ready) | — |
| **Sat/Sun** | — | Light: one repurposed clip or nothing (do not force it) | — |

**Realistic per-channel weekly volume:** blog 2 (locked); Reels/Shorts ~1-3; LinkedIn ~2-3; Facebook ~2-3; YouTube long-form ~1 per published pillar (not strictly weekly); newsletter per issue. Miss a slot rather than ship off-voice or non-compliant, but do not go dark for a week.

**Guardrails on the mix:**
- **Wellness floor ~40%.** Protect it by interleaving a wellness pillar (A Vitamin D / B Fatigue / Omega-3) for roughly every clinical-curious one (`seo-ai-search/content-calendar.md`).
- **TRT / andropause ~0% until Ewa clears Pillar E.** That is the correct safe state pre-sign-off, not a miss.
- **Every hook maps to a live-kit marker.** No cortisol / thyroid / metabolic promotion until those kits launch.

---

## 2. The status model (one asset, one row, one status)

Every content asset moves through these stages. Track the *task* in ClickUp (workspace `90121729875`; Ewa sign-off on the "Content Review — Ewa" list `901218140081`); track the *plan* here or in the pillar's brief.

```
idea ──► drafted ──► compliance-preflight ──► [Ewa, if net-new claim] ──► scheduled ──► live ──► measured
```

| Status | Meaning | Owner of the next step |
|---|---|---|
| **idea** | on the queue, not yet written | agent drafts |
| **drafted** | script / caption / derivative written, in voice | agent → Keith review |
| **compliance-preflight** | ran `/compliance-preflight`; 🔴 = stop, 🟠 = Ewa, 🟢 = pass | agent / Ewa |
| **Ewa** (conditional) | only if the asset carries a claim not already in a signed canonical asset | Ewa (ClickUp `901218140081`) |
| **scheduled** | cleared, thumbnail attached, CTA routed, queued on a platform | Keith presses go |
| **live** | published / sent | — |
| **measured** | numbers pulled into the KPI view (platform-native until GA4 live) | agent → Keith |

**The gate is inheritance, not repetition.** A derivative of an already-signed canonical asset that adds no claim skips the Ewa step (it inherits the sign-off). A derivative that adds a claim, or any net-new founder script, goes to Ewa. See `sops/sop-compliance-route.md`.

---

## 3. Where each thing is tracked (no duplicate trackers)

| Thing | Tracked in |
|---|---|
| Which blog article publishes when | `seo-ai-search/content-calendar.md` (source of truth) |
| Task status / Ewa queue | ClickUp `90121729875`, list `901218140081` |
| Cross-channel weekly plan | this doc (or the sprint board) |
| Live status / open items | `STATE.md` in this workspace |
| Email sequence state | Customer.io + `07_sales/CONTEXT.md` |
| Per-pillar CTA target | central `kitCTA` config (`content-atomisation-model.md` §4) |

Do not create a parallel calendar or a second status tracker. If this doc and ClickUp disagree, ClickUp is the live task state and this doc is the plan.

---

## 4. Cross-references

- Blog publication gate + Mon/Thu procedure: `seo-ai-search/content-calendar.md`
- Atomisation map + CTA routing: `seo-ai-search/content-atomisation-model.md`
- Compliance route: `sops/sop-compliance-route.md`
- The weekly operating run: `sops/sop-weekly-run.md`
- Measurement dependency (GA4 + consent): `STATE.md`, `content-machine-blueprint.md` §5
