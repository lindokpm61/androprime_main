/**
 * The hero field's geometry: six markers as percentages of their own track.
 *
 * Ported from `design/mockups/directions/F-field.html:922-929`, layer 3 of the
 * hero, which the F build left out on 2026-08-31 with the reason recorded as
 * "the field animates real percentages from thresholds.md, which is a data
 * surface rather than a decoration". Keith took it on 2026-09-02.
 *
 * 🔴 WHY THESE NUMBERS LIVE HERE AND NOT IN THE COMPONENT. The claim that makes
 * this layer defensible at all is that every band drawn is a real percentage
 * from `04_products/results-engine/thresholds.md`. If these drift from the
 * readout's own geometry, that claim quietly stops being true and nothing about
 * the rendered page would look wrong, because the field is deliberately
 * illegible. So the four markers the homepage readout also draws are asserted
 * equal to it by `scripts/verify-hero-field.js`. A duplicated fact is invisible
 * exactly while the copies agree.
 *
 * 🔴 IT DRAWS SIX AND THE READOUT DRAWS FOUR. hs-CRP and SHBG appear in the
 * field and nowhere else on this page. That is deliberate and it is the
 * direction's own set, but it is also the reason the compliance question below
 * is open rather than closed: two of the six rows are geometry for markers the
 * page does not otherwise show.
 *
 * ⚠ COMPLIANCE, OPEN AND NOT SELF-CLEARED. Nothing here is labelled, no marker
 * is named, no value is stated, and at the opacities the field paints, no
 * individual band is readable. On that basis it is texture whose generative
 * source happens to be real, rather than a data display. That reading is not
 * ours to ratify. `03_compliance/STATE.md` carries it as an open question
 * against the CA-045 gate, and it must be answered before Direction F merges,
 * not before it is built: Keith ruled on 2026-09-01 that the gate governs
 * SHIPPING, not creating.
 */

export interface FieldRow {
  /** [left, width] as percentages of the track: the laboratory reference band. */
  lab: [number, number]
  /** [left, width] as percentages: our action band. */
  ours: [number, number]
  /** The sample value's position, as a percentage. */
  you: number
  /** Which marker this row's geometry came from. Never rendered. */
  marker: string
  /** True when the homepage readout draws this marker too, so it is checkable. */
  onReadout: boolean
}

export const FIELD_ROWS: readonly FieldRow[] = [
  // Track scale 0-35 nmol/L. lab 8.64-29.00, ours 12-20, value 14.2.
  { marker: 'Testosterone', lab: [24.7, 58.2], ours: [34.3, 22.8], you: 40.6, onReadout: true },
  // Track scale 0-250 nmol/L. The two ranges coincide, both 50-250, value 58.
  { marker: 'Vitamin D', lab: [20.0, 80.0], ours: [20.0, 80.0], you: 23.2, onReadout: true },
  // Track scale 0-100 pmol/L. Assay cut >37.5, NICE NG239 25-70, value 45.
  { marker: 'Active B12', lab: [37.5, 62.5], ours: [25.0, 45.0], you: 45.0, onReadout: true },
  // Track scale 0-450 ug/L. lab 30-442, ours 30-100, value 62.
  { marker: 'Ferritin', lab: [6.7, 91.5], ours: [6.7, 15.5], you: 13.8, onReadout: true },
  // NOT on the homepage readout. Direction's own values, kept as ported.
  { marker: 'hs-CRP', lab: [0.0, 10.0], ours: [0.0, 10.0], you: 8.0, onReadout: false },
  { marker: 'SHBG', lab: [20.6, 56.1], ours: [20.6, 56.1], you: 41.0, onReadout: false },
]
