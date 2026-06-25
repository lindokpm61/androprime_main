# seq-03c / seq-03d fix — getting result-state signals into Customer.io

**Date:** 2026-06-26
**Owner:** Keith + engineering (+ Ewa/compliance on one decision)
**Tracks:** ClickUp `869dw3ge8` (seq-03 go-live)
**Status:** SPEC — needs the Kit-1 decision (§3) before build

## Problem

seq-03c (Normal) and seq-03d (Borderline) both route on result-state flags that
are **not in Customer.io**, so neither can fire:

- **seq-03c** filters on segment 22 ("all-clear" = none of the six low/elevated
  flags changed to true). Verified live 2026-06-26: an all-clear Kit-1 profile is
  NOT placed in segment 22 → 0 deliveries. The "absent attribute = not-flagged"
  assumption is empirically wrong, and a Kit-1 normal-T profile has **no positive
  all-clear signal in CIO at all** (testosterone flags are withheld).
- **seq-03d** filters on `borderline_testosterone == true`, which `buildCioTraits`
  deliberately never sends → never fires.

seq-03a (energy deficiency, segment 21, positive to-true flags) works because it
keys on flags that ARE sent and DO transition to true. The fix is to give 03c/03d
the same kind of **positive, present signal**.

## The two changes

### 1. `results_all_clear` flag → fixes seq-03c

`process-result` computes a single positive boolean and sends it via
`identifyUser` alongside the existing traits:

- **Kit 2 (energy-recovery):** `all_clear = !low_vitamin_d && !low_b12 && !elevated_crp && !low_ferritin`
- **Kit 1 (testosterone):** `all_clear = (T not low) && (T not borderline)` — known
  server-side; see §3 for the data question.
- **Kit 3 (hormone-recovery / combo):** both of the above.

Redefine **segment 22** = `result_received` (event) AND `results_all_clear == "true"`
(attribute). Drop the six-inverse construction. Positive-presence matching is what
seg-21 already proves works.

> Energy-only routing could alternatively key on the existing `low_* == false`
> flags (they're sent as real booleans), avoiding a new attribute. But a single
> `results_all_clear` is cleaner and is the only option that also covers Kit-1
> normal-T — so it's the recommended unifying signal.

### 2. Borderline consent-gate → fixes seq-03d

Mirror the **already-approved low-T pattern** (seq-03b / `lowt_nurture_consented`):

- `process-result` detects borderline (T 12–<15) but does NOT push the flag.
- Dashboard shows the borderline result + an explicit opt-in ("hear more about a
  lower-end result") → new `POST /api/borderline-nurture/consent` (clone of
  `lowt-nurture/consent`) → sets a minimal `borderline_nurture_consent` flag +
  emits `borderline_nurture_consented`.
- **seq-03d trigger** changes from `result_received` + `borderline_testosterone`
  filter → the `borderline_nurture_consented` event (exactly like seq-03b).
- Copy already reworded (CA-020) to carry no value/number — fits the consented
  framing.

## 3. DECISION NEEDED — Kit-1 / Kit-3 testosterone, the `results_all_clear` flag

To route a **normal-T** customer to seq-03c, CIO must learn their testosterone is
normal. That's a health inference sent to a US processor — the same family of
question as the low-T minimisation. Options:

- **A (recommended): send `results_all_clear` (boolean).** It signals only the
  *absence* of any flag — reassuring, reveals no condition. Far lower sensitivity
  than `low_testosterone` (which we gate behind consent) and lower than the energy
  flags already sent unconditionally. One Ewa sign-off; everything else is wiring.
- **B: route Kit-1-normal without a health flag.** They still get T-03 (results
  ready) + dashboard; seq-03c's normal-result nurture would be energy-kits only,
  or triggered by a non-health signal. Loses the Kit-1-normal nurture/retest push.
- **C: consent-gate all testosterone-result nurture** (normal too), like low-T /
  borderline. Most conservative; adds a consent step for people with a clean
  result who may not want one.

**Recommendation: A.** Treat `results_all_clear` as a low-sensitivity reassurance
signal, Ewa to confirm. It closes Kit-1, Kit-2, and Kit-3 normal routing in one move.

## Build checklist (once §3 is decided)

- [ ] `process-result` / `buildCioTraits`: compute + send `results_all_clear`
      (per-kit logic above); add borderline detection without sending the flag.
- [ ] New `POST /api/borderline-nurture/consent` (clone of lowt-nurture/consent;
      email-keyed CIO identity per the 2026-06-25 fix).
- [ ] Dashboard: borderline opt-in UI (clone the low-T consent component) +
      consent-version constant. Copy needs an Ewa sign-off (cf. CA-014/CA-018).
- [ ] CIO: redefine segment 22 (`result_received` AND `results_all_clear==true`);
      retrigger seq-03d on `borderline_nurture_consented` (drop the
      `borderline_testosterone` filter).
- [ ] Retest live (the routing matrix): Kit-2 low-VitD → seq-03a; Kit-2 all-clear
      → seq-03c; Kit-1 normal → seq-03c; Kit-1 low-T → seq-03b; Kit-1 borderline →
      consent → seq-03d. Confirm each lands in the right sequence and no others.
- [ ] Compliance: Ewa on the `results_all_clear` health-flag (§3) + the borderline
      consent UI copy. DPIA §4 update (this resolves the "energy-marker
      minimisation pending" note for the result-state signals).

## Meanwhile

- seq-03c (campaign 6): **Stop** — running but matches nobody until this lands.
- seq-03a + seq-03b: stay live (verified, unaffected).
- seq-03d (campaign 7): stays draft (already).
