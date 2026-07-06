# SOP — Comment-to-DM (ManyChat)

**Set up and run an Instagram comment-to-DM keyword flow: a user comments a keyword, the tool auto-DMs a link to the test-selector / funnel.** Uses ManyChat (or a similar Meta-approved partner). The map and the DM copy template live in `templates/dm-keyword-map.md`.

**Why it is allowed:** ManyChat is an officially approved Meta Business Partner, and comment-to-DM is **user-initiated** (they comment first), which is the sanctioned use. This is not unsolicited mass-DMing (still not adopted) and it is not a ranking "hack"; it is a conversion mechanism.

**Roles:** agent drafts the map + DM copy and runs pre-flight; Keith approves and presses go; Ewa clears any net-new claim; the data-governance step needs the `03_compliance` workspace (and possibly the solicitor).

---

## Before the first flow goes live (one-time, compliance)

1. **Add ManyChat as a sub-processor.** Per `03_compliance/CONTEXT.md` "Adding a new sub-processor or data partner": add it to the sub-processor schedule, update `data-controller-position.md`, and update the privacy policy's sub-processor list. It stores Instagram contact data, so this is required before any live flow. Route this to `03_compliance` (and the solicitor if the DPA terms need review). **Do not launch a flow until this is done.**
2. **Confirm the destination router.** The DM link points at the test-selector / `kitCTA` router, UTM-tagged. Confirm it exists and points at the current live kit.

## Per flow

3. **Pick the keyword(s) and the feeling** from `templates/dm-keyword-map.md`. Confirm the feeling maps to a **live-kit** marker. If it does not (metabolic, thyroid, andropause), route to **email capture**, not a kit, and do not trigger on Ewa-gated (andropause / libido) keywords at all.
4. **Write the DM message** to the template: feeling-first, plain, GP hedge, "education, not medical advice," link only (no health-data capture in the DM). No em dashes.
5. **Run `sops/sop-compliance-route.md` on the DM copy.** The DM is customer-facing. 🔴 = fix; 🟠 = Ewa; net-new claim = Ewa. Destination grep must be clean of FM-list terms.
6. **Build the flow in ManyChat** (draft): trigger = the keyword on the target post/Reel; response = the approved DM with the UTM link. Keep the trigger list tight to avoid false fires.
7. **On the post itself:** the "comment [keyword]" prompt is fine on Instagram. On Facebook, do **not** use a comment trigger (engagement-bait demotion); use the native in-post link.
8. **Test** with a throwaway comment; confirm the DM fires, the link resolves to the right live destination, and the UTM attributes.
9. **Keith presses go.** Nothing goes live without his go and without the sub-processor step done.

---

## Definition of done

- ManyChat added to the sub-processor schedule + privacy policy (one-time) before any live flow.
- Keyword maps to a live-kit feeling (or email capture); no Ewa-gated triggers.
- DM copy passed the compliance route; link UTM-tagged; routes to test-selector / kit / email, never FM.
- Tested end to end; Keith gave go.

## Anti-checklist (stop if any is true)

- ManyChat not yet in the sub-processor schedule / privacy policy.
- A trigger keyword is andropause / libido / testosterone-booster (Ewa-gated) or a not-live-kit marker routed to a kit rather than email.
- The DM makes a claim beyond the canonical asset, or the link points at the FM list / "priority access to TRT."
- A comment trigger is used on the Facebook feed (engagement-bait demotion).
