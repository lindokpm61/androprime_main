# Dashboard Copy

Customer-facing copy on the results dashboard. Bands and routing live in
[`thresholds.md`](./thresholds.md); this file owns how a result is *presented*.

> **Status:** the status-badge vocabulary below is filled in (2026-08-07). The rest of the
> dashboard copy (card headings, empty states, pre-results tracker, qualifier questions) is still
> owed and currently lives only in the components.

---

## Status badge vocabulary

The badge is the most prominent verdict on a result card: one or two words, in the reader's eye
before any sentence. Six labels, each earning its place.

| Label | Fill | Applies to | Says |
|---|---|---|---|
| **Optimal** | outline | `optimal-testosterone` only | The one place a positive band exists |
| **In range** | outline | every `normal-*` state (albumin, vitamin D, CRP, ferritin, B12, SHBG, free T) plus the generic `normal` | The number sits inside the lab's range. Nothing more |
| **Reported** | outline | `fai-reported` | We show this number and draw no conclusion from it |
| **Monitor** | filled | in range but at an end of it, or an indeterminate band (`normal-testosterone`, `shbg-low/high`, `elevated-crp`, `moderate-crp`, `suboptimal-ferritin`, `borderline-b12`) | Worth watching, not acting on |
| **Action Needed** | filled | genuine deficiency the card routes onward (`ft-low`, `low-vitamin-d`, `low-b12`) | There is a next step on this card |
| **See Your GP** | filled | the GP-block set plus every low-testosterone sub-band | The only instruction, reserved for safety routing |

**"Optimal" is deliberately restricted to testosterone (Keith, 2026-08-07).** It used to be the label
for anything in range. That contradicted our own position: [The Myth of the Normal
Range](https://andro-prime.com/blog/myth-of-normal-range) argues in-range is not the same as optimal,
and the badge was saying the opposite on the page where it matters most. "In range" describes the
number and claims nothing. Testosterone keeps "Optimal" because `thresholds.md` records the `>20`
band as a deliberate positive-framing product choice Ewa signed, rather than an accident of
vocabulary. It is still a product claim, not a clinical one.

**Outline versus filled is doing work.** Filled black reads as an alarm at a glance. Only the three
labels that ask something of the reader are filled; the three that do not are outline. A reader
scanning a page of cards should be able to count the filled ones and know how many need him.

### Why this is written down

Until 2026-08-07 the badge was a `switch` with `default: 'Action Needed'`, and **eight of the
twenty-eight result states had no case**. Five of those eight mean the result is fine. A normal
albumin, vitamin D, CRP, ferritin or B12 each rendered **ACTION NEEDED in solid black**, directly
above Ewa-approved copy saying no action was needed. An **all-clear Kit 2**, the most common result
the business will ship, showed **four black alarms on four in-range markers**. Nobody chose that; the
default did.

The fix is structural, not cosmetic. The badge map is now
`Record<ResultState, BadgeConfig>` in `components/results-engine/StatusBadge.tsx`, so **adding a
result state without deciding its badge fails the build**. `BIOMARKER_COPY` in `lib/results` was
already an exhaustive Record, which is precisely why the same class of defect never reached the card
copy: one file forced the decision and the other did not. Verified by adding a throwaway state and
confirming both files refuse to compile.

A runtime fallback remains for a stored result carrying a state this build does not know, and it
**fails quiet** (`Reported`, outline), never loud. The old default failed loud, which is how a clean
bill of health came to read as an alarm.

---

## Still owed

- Card headings and section labels ("What this means", "The evidence", "What we recommend")
- Pre-results tracker copy and the sample-failed state
- Qualifier question wording
- Empty and error states
- The generic `normal` state's card copy still asserts "This marker is within the normal range" for
  any marker the engine does not recognise. Same fail-unsafe shape as the badge default was; worth
  closing.
