# Symptom-First Demand Discovery (product-agnostic) — DataForSEO UK, 2026-05-30

The de-bias pass flagged in `portfolio-demand-gap-map.md`. Seeds were **the customer's own words**
(how men describe problems), NOT our markers/products. 25 symptom/plain-language seeds → 504 real
queries via `suggest`. Purpose: surface real vocabulary + unserved demand the product-anchored map can't.
Raw data: `discovery-symptom-staging.csv`.

## The headline finding

**The market searches symptoms; our portfolio is named in clinical/product language.** Men don't
search "hs-CRP" or "testosterone test" — they search *how they feel*. The portfolio map sized the
clinical terms; this pass reveals the **symptom vocabulary that should drive every kit's content hook
and positioning**. This is mostly a *vocabulary/hook* gap, not a missing-product gap — the bridge
between huge unserved symptom demand and kits we already have.

## Symptom clusters (real customer phrasing, canonical volume — variants collapsed)

| Symptom cluster (their words) | Demand | KD | Maps to | Served today? |
|---|---|---|---|---|
| **Belly fat / visceral fat** | how to lose belly fat 22,200 + visceral fat 18,100 (~40k) | 44–57 | Kit 3 Plus (metabolic) | **Under-hooked** — metabolic kit's real hook is "belly/visceral fat", not "metabolic markers" |
| **Brain fog** | 14,800 (+ "what is brain fog" 6,600) | 33 | Kit 2 (B12), Kit 5 (thyroid) | Under-hooked — we test B12 but don't lead with "brain fog" |
| **Always tired / no energy** | why am i always tired 14,800 | 35 | Kit 2, Kit 5 thyroid | Partly (Pillar B exists) |
| **Male low-testosterone symptoms** | "male with low testosterone symptoms" 12,100 | 59 | Kit 1 | Under-hooked — symptom-language door to Kit 1 |
| **Male menopause / andropause** | ~10k cluster (menopause in male 5,400; "symptoms of male menopause" 1,600; "can/does male have menopause" 1,900 ea) | **12–28 (low!)** | Kit 1 / **Pillar E** | **Compliance-gated, unserved** — the natural narrative wrapper for the whole low-T story |
| **Low sex drive / libido** | low sex drive 2,900 + "low sex drive men/male" 1,900 ×many (~several k) | 42–49 | Kit 1 (testosterone) | **Under-hooked + compliance-sensitive** — the emotional entry to Kit 1 |
| **Night sweats (men)** | night sweats men 8,100 (+ "how to stop night sweats" 1,900) | 16–27 | hormone / thyroid / andropause | **Unserved** — no current hook (note: much "night sweats" volume is illness-related, not hormonal) |
| **Muscle loss / loss of strength** | muscle loss 5,400 | 33 | Kit 1 (T), Kit 3 Plus | Under-hooked |
| Joint pain | large (8,100+) but **mostly exercise/physio + body-part-specific intent** | 20–37 | Collagen | Addressable slice narrower than raw volume |

## What's genuinely new vs the product-anchored map

1. **"Belly fat / visceral fat" (~40k) is the metabolic hook.** Kit 3 Plus content/positioning should lead on belly/visceral fat (the medically-correct driver of the metabolic panel) — a hook we'd never seed from "HbA1c". Biggest vocabulary reframe.
2. **The male-menopause/andropause umbrella (~10k, low KD) is the highest-leverage symptom narrative** — it wraps low-T, tiredness, libido, night sweats, belly fat into one story in the customer's words. It's **Pillar E, compliance-gated** (Ewa) — but the demand and low KD confirm it's worth clearing.
3. **"Low sex drive" is the real Kit 1 front-door**, not "testosterone test." Compliance-sensitive (ASA/sexual-function), but it's how men actually search.
4. **Night sweats in men (8,100)** — a real unserved symptom with no hook (caveat: filter the illness-related "cold night sweats" volume).

## Honest limitations of this pass

- **Seed contamination** is real ("no energy" pulled EDF Energy 40,500; dropped). Discovery needs cleaning, which I did.
- **Much symptom volume is off-model or wrong-intent:** belly fat skews to weight-loss/GLP-1 (off our Phase-0 lane); joint pain is mostly exercise content; some night sweats are illness; some queries are female-skewed. The value is **vocabulary + hooks + unserved-spotting**, NOT "build a kit per symptom."
- **Compliance flags:** sex drive, mood, and male-menopause framing are ASA/medical-claim-sensitive and Pillar-E-gated — internal demand mapping is fine; customer copy needs Ewa.

## So what (actions this unlocks)

- **Re-hook existing kits in symptom language** (no new product): Kit 3 Plus → "belly/visceral fat"; Kit 1 → "low sex drive / low-T symptoms / male menopause"; Kit 2 → "brain fog / always tired". This is a content + LP positioning change, driven by real demand.
- **Pillar E (andropause) is data-justified** — clear the Ewa compliance gate; it's the umbrella narrative, low-KD, ~10k+.
- **Reconcile with `portfolio-demand-gap-map.md`:** that map = product-anchored (what we make, sized); this = demand-first (what they search). Together they're the complete picture. Next: fold the symptom hooks into the kit rows + `keywords.csv`.
