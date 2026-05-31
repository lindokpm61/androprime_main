# Draft email to Ben (Vitall) — Kit 3 Plus operational feasibility

**Status:** SUPERSEDED (2026-05-31, updated 2026-06-01) — never sent. The Kit 3 Plus feasibility ask now lives in the consolidated draft `2026-06-01-keith-vitall-feasibility-consolidated-draft.md` (Gmail draft `r-7062999967052535170` — liver panel + Omega-3 Index + Kit 3 Plus in one email). The **Kit 1 Prolactin** ask below was kept separate: `2026-05-31-keith-kit-1-prolactin-draft.md` (Gmail draft `r1707074879902833753`).
**From:** Keith Antony
**To:** Ben at Vitall (correspondence contact for kit feasibility)
**Subject (draft):** Kit 3 Plus + small Kit 1 expansion (Prolactin) — operational feasibility check

---

Hi Ben,

Hope all's well. We're in the final stretch on the Phase 0 launch and Kit 3 (the 9-marker hormone & recovery check, `andro-prime-combo-test`) is ready to go as you've built it — no changes there.

Once Phase 0 is stable (so around 1-2 weeks after launch), we're planning to introduce a second SKU under the Kit 3 line — provisionally **Kit 3 Plus** — which keeps the existing 9 markers and adds a metabolic / cardiovascular cluster. The strategic case is closing a panel-breadth gap with Medichecks Well Man Advanced and capturing the cardiometabolic-prevention demand we're seeing in UK search data (HbA1c, ApoB, Homocysteine are the standout queries).

Before we commit, I'd like to check operational feasibility with you. Could you let me know on the following:

1. **Sample type.** Can Vitall run **HbA1c**, **Fasting Insulin**, **ApoB**, **Homocysteine**, and a standard **lipid panel (Total Cholesterol / HDL / LDL / Triglycerides)** on dried blood spot / capillary samples (matching our existing kit collection)? Or does any of this require venous draw?

2. **Fasting requirement.** I assume fasting insulin and the lipid panel need fasted samples. If yes, what's your recommended collection guidance? We'd want to ship clear morning-collection instructions in the box.

3. **Availability + cost.** Are ApoB and Homocysteine routinely available through your lab? What's the per-test cost addition for each? Same question for Fasting Insulin and HbA1c if not already in your standard menu.

4. **All-in COGS at the locked stack.** Once you've confirmed which of the above you can run on capillary, can you quote me the all-in COGS for the full 18-marker panel (the existing Kit 3 nine markers + HbA1c + Fasting Insulin + Fasting Glucose + Total Cholesterol + HDL + LDL + Triglycerides + ApoB + Homocysteine)? We're working a provisional retail price of £239 and want to confirm the unit economics.

5. **Two additional candidates.** We may also include **Lp(a)** (lipoprotein-a — genetic CV risk marker) and **Liver markers (ALT, AST, GGT)** in V1 if cost allows. Can you tell me whether you can run these on capillary, and the per-test cost?

6. **Dispatch integration.** Would Kit 3 Plus need a new Vitall `shortCode`, or can we extend `andro-prime-combo-test`? If new, what's the lead time on Vitall's side to set it up?

7. **API integration.** Will our existing Vitall API integration handle a result payload of ~18 markers in one report, or do we need a code change on our side?

8. **SLA.** Can you confirm Kit 3 Plus would hit the same 2-5 working day turnaround as Kit 1, 2, and 3?

---

**One more, smaller question — Kit 1 expansion.**

Separately from Kit 3 Plus: we're considering adding **Prolactin** to the existing Kit 1 panel (so Kit 1 would go from 5 markers to 6: Total T, SHBG, FAI, Albumin, Free T, **Prolactin**). Strategic case is straightforward — elevated prolactin suppresses testosterone, so a man with hyperprolactinaemia can show normal-looking Total T on a Kit 1 result today while the actual underlying cause goes undiagnosed. Adding prolactin closes that diagnostic gap and tightens Kit 1's "find out if testosterone is the cause" positioning.

Three quick questions:

1. **Can Vitall add Prolactin to the existing `andro-prime-hormone-check` Kit 1 panel on the current capillary sample?** Or does prolactin require a different sample type?
2. **What's the per-test cost addition?** This will set whether we re-price Kit 1 or absorb the increment.
3. **Lead time to add Prolactin to the live Kit 1 dispatch route?** We'd be looking at a post-launch rollout — likely 2-4 weeks after Phase 0 goes live, bundled with the Kit 3 Plus work — but earlier is fine if it's straightforward on your side.

---

No urgency on either question — Phase 0 launch comes first. But knowing where the constraints are (markers that can't run on capillary, COGS at the marker stack, dispatch lead time on Kit 1 + Kit 3 Plus) will let us lock the specs and start the LP / dashboard build in parallel.

Happy to jump on a quick call if easier than a written reply.

Best,
Keith

---

*Drafted 2026-05-26 alongside the Kit 3 Plus spec (`04_products/kits/kit-3-plus.md`). Send when Keith approves.*
