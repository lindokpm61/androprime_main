import { FAI_REPORT_ONLY, PANEL_MARKERS } from '@/lib/kits/panel'

/**
 * THE SAMPLE READOUTS, FOR ALL THREE KITS, IN ONE PLACE.
 *
 * Extracted 2026-09-11 from the three `/kits/*` page files, verbatim and by
 * script rather than by hand, when the `/lp/*` rebuild needed the same data.
 *
 * 🔴 IT MOVED BECAUSE THE ALTERNATIVE WAS A SECOND COPY OF A CLINICAL CLAIM, AND
 * THE FIRST COPY HAD ALREADY DRIFTED. Each `/lp/` kit landing page carries its
 * own hand-typed sample report for the same kit, and they are not the same
 * numbers. DESIGN.md gap 9 records the sweep that fixed the `/kits/*` pages: 8
 * instances of a retired Normal / Borderline / Low vocabulary, and one row where
 * `/kits/testosterone` asserted free testosterone was **Low at 0.244 when the
 * reference low is 0.198**, so the engine returns `ft-normal` and the page was
 * claiming a deficiency the engine does not find. That sweep never reached
 * `/lp/*`. `/lp/testosterone` still carries 0.244 labelled "Low", and the
 * compliance scanner's first run found twelve more live instances on
 * `/lp/energy-recovery` and `/lp/hormone-recovery`.
 *
 * So the landing pages do not get a corrected copy of the readout. They get THE
 * readout. Rebuilding them against a second transcription would have re-created
 * the exact condition that produced the defect, and re-typing a clinical verdict
 * is not a thing a redesign may do.
 *
 * ⚠ EVERY BAND POSITION IS ARITHMETIC FROM `04_products/results-engine/
 * thresholds.md` AND `lib/results/classifier.ts:resolveBarZones`. The working is
 * kept inline against each row, exactly as it was in the page files. **Do not
 * adjust a number here without re-deriving its percentage**: a value moved
 * without its arithmetic is a page that contradicts the results engine, and it
 * now contradicts it on two routes at once.
 *
 * The per-kit header comments below are the ones that sat above each `READOUT`
 * in its page, carried whole. They explain the two-range device, the drawn-to-
 * the-end floors that Ewa ruled on, the lab-normal-by-construction limit and why
 * FAI draws no track.
 */

export type ReadoutRow = {
  name: string
  qualifier: string | null
  value: string
  unit: string
  labLeft: number
  labWidth: number
  oursLeft: number
  oursWidth: number
  you: number
  lab: string
  ours: string
  split: boolean
  noTrack?: boolean
}


/* ---------------------------------------------------------------- READOUT_KIT_1 ---- */

/*
 * The sample report. `band` is what the row's own badge declares, and it drives
 * both the chip underline and the bar fill, so the two cannot disagree.
 * FAI is deliberately bandless: the engine maps it to `fai-reported`, which
 * carries no verdict, and resolveBarZones returns [] for it because a coloured
 * bar IS a verdict. Strings come from lib/kits/panel.ts.
 */
/*
 * THE SAMPLE READOUT, REBUILT AS THE TWO-RANGE DEVICE, 2026-09-04.
 *
 * WHY IT CHANGED. `/` opens on "Two ranges. Nine markers. You should see both",
 * and the page that actually takes the money showed ONE bar, no lab band, no
 * reference range and no needle. The promise was made where nothing is sold and
 * broken where the money is asked for. Same `.f-mk` / `.f-track` / `.f-band` /
 * `.f-you` device as `/` and `/kits/energy-recovery`, from the same geometry.
 *
 * EVERY BAND POSITION IS ARITHMETIC FROM `04_products/results-engine/
 * thresholds.md` AND `lib/results/classifier.ts:resolveBarZones`, WHICH IS THE
 * RATIFIED SOURCE FOR WHAT A BAR DRAWS PER MARKER. The working is kept inline.
 *
 * A FLOOR IS DRAWN TO THE END OF THE TRACK, AND THAT IS RULED, NOT INVENTED.
 * Albumin and Free Testosterone have no upper action threshold: `resolveBarZones`
 * returns `{ color: 'optimal', upTo: null }` for both, and `upTo: null` means "to
 * the end". Ewa was asked for an albumin upper band on 2026-08-07 and answered
 * "No" (approval-record-biomarker-bands-v2, row "Albumin upper band | No | No
 * change"); CA-044 records the bands themselves as APPROVED, with only two
 * states' card WORDING still pending. So on those two rows our band renders
 * WIDER at the top than the lab reference interval. That is the truth of the
 * ruling: above the lab's upper limit we take no action, and the dashboard has
 * been drawing it that way to customers already.
 *
 * EVERY ROW IS LAB-NORMAL BY CONSTRUCTION, and that is a vocabulary limit rather
 * than a flattering choice. "Lab normal" is the ONLY lab-verdict string that
 * exists anywhere in this app; a value the lab would call out-of-range needs a
 * second string nobody has approved. It is also the honest case, because the
 * device's whole argument is "the lab says normal and we do not".
 *
 * FAI DRAWS NO TRACK. `resolveBarZones` returns [] for it (Ewa ruling 8,
 * report-only, not banded in men) because a coloured bar IS a verdict. It keeps
 * the `.f-bar-none` spacer so the row does not read as a rendering fault, and
 * its badge comes from FAI_REPORT_ONLY rather than being written here.
 *
 * Do not adjust a number here without re-deriving its percentage. A value moved
 * without its arithmetic is a page that contradicts the results engine.
 */
export const READOUT_KIT_1: ReadoutRow[] = [
  {
    // CARRIED FROM `/`. thresholds.md Kit 1 Total Testosterone: our bands low
    // <12, normal 12-20, optimal >20-29, high >29 -> GP. Vitall male reference
    // 8.64-29.00 nmol/L (confirmed 2026-08-06). Scale 0-35 nmol/L.
    //   lab    8.64 -> 24.7%,  29.00 -> 82.9%,  width 58.2%
    //   ours     12 -> 34.3%,     20 -> 57.1%,  width 22.8%
    //   marker  14.2 -> 40.6%
    // SPLIT: 14.2 sits inside the lab's 8.64-29.00 so a standard report says
    // normal and stops; it also sits in OUR 12-20 band, the state
    // `normal-testosterone`, which badges Monitor. Same number, two verdicts.
    name: 'Testosterone', qualifier: 'total', value: '14.2', unit: 'nmol/L',
    labLeft: 24.7, labWidth: 58.2, oursLeft: 34.3, oursWidth: 22.8, you: 40.6,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // resolveBarZones SHBG: warning below referenceLow, optimal to
    // referenceHigh, warning above -- i.e. OUR BAND IS THE LAB'S BAND, by Ewa
    // ruling 7 ("match the lab assay, no fixed numbers", 2026-06-16). Vitall
    // male 20.6-76.7 nmol/L, which is also the code fallback. Scale 0-100.
    //   lab    20.6 -> 20.6%, 76.7 -> 76.7%, width 56.1%
    //   ours   identical, which is why `.f-band-ours` is inset 2px vertically
    //   marker 38.5 -> 38.5%
    // No split is possible here by construction: the two ranges are one range.
    // `shbg-normal` badges In range.
    name: 'SHBG', qualifier: 'binding globulin', value: '38.5', unit: 'nmol/L',
    labLeft: 20.6, labWidth: 56.1, oursLeft: 20.6, oursWidth: 56.1, you: 38.5,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // NO TRACK. resolveBarZones returns [] for FAI (Ewa ruling 8: report-only,
    // not banded in men) because a coloured bar IS a verdict, and the generic
    // fallback used to derive one from the lab range while the card text called
    // the same value normal. Vitall does return a male interval (35.0-92.6%),
    // but we do not interpret against it, so nothing is drawn.
    // The badge is read from FAI_REPORT_ONLY, never written here.
    name: PANEL_MARKERS.fai.name, qualifier: 'reported, not interpreted', value: '36.9', unit: '%',
    labLeft: 0, labWidth: 0, oursLeft: 0, oursWidth: 0, you: 0,
    lab: '', ours: FAI_REPORT_ONLY.badge, split: false, noTrack: true,
  },
  {
    // resolveBarZones Albumin: `{critical, upTo: 35}` then `{optimal, upTo: null}`.
    // `upTo: null` is a FLOOR, not a band -- there is no upper action threshold,
    // and that is a ruling: Ewa was asked for an albumin upper band on 2026-08-07
    // and answered "No" (approval-record-biomarker-bands-v2). Vitall male
    // 35-50 g/L. Scale 0-60 g/L.
    //   lab      35 -> 58.3%, 50 -> 83.3%, width 25.0%
    //   ours     35 -> 58.3%, to the track end -> 100%, width 41.7%
    //   marker 42.0 -> 70.0%
    // OUR BAND IS WIDER THAN THE LAB'S AT THE TOP, and that is the ruling drawn
    // honestly: above 50 the lab's interval ends and we still take no action.
    // `normal-albumin` badges In range.
    name: 'Albumin', qualifier: 'transport protein', value: '42.0', unit: 'g/L',
    labLeft: 58.3, labWidth: 25.0, oursLeft: 58.3, oursWidth: 41.7, you: 70.0,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // resolveBarZones Free Testosterone: `{critical, upTo: referenceLow}` then
    // `{optimal, upTo: null}`. A FLOOR again, and dynamic: the cut is whatever
    // referenceLow arrives with the sample (Ewa ruling 7). Vitall male
    // 0.1980-0.6190 nmol/L, confirmed 2026-08-06. Scale 0-0.8 nmol/L.
    //   lab   0.198 -> 24.8%, 0.619 -> 77.4%, width 52.6%
    //   ours  0.198 -> 24.8%, to the track end -> 100%, width 75.2%
    //   marker 0.244 -> 30.5%
    // Illustrative: a real card bands against the range returned with the
    // sample. `ft-normal` badges In range.
    name: 'Free testosterone', qualifier: 'calculated', value: '0.244', unit: 'nmol/L',
    labLeft: 24.8, labWidth: 52.6, oursLeft: 24.8, oursWidth: 75.2, you: 30.5,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
]

/* ---------------------------------------------------------------- READOUT_KIT_2 ---- */

/*
 * The sample report. `band` is what the row's own badge declares, and it drives
 * both the chip underline and the bar fill, so the two cannot disagree.
 *
 * Every row mirrors what the results engine would actually return for these
 * values: `status` is the badge from components/results-engine/StatusBadge.tsx
 * (its BADGES map is the customer-facing vocabulary) and the band is the zone
 * from resolveBarZones in lib/results/classifier.ts. Adopted 2026-08-17 (Keith)
 * after this page's first pre-flight found it speaking Normal / Borderline /
 * Low, a vocabulary the product uses nowhere. Keep the two in step: a value
 * changed here without re-deriving its state is a mockup that contradicts the
 * product.
 */
/*
 * THE SAMPLE READOUT, REBUILT AS THE TWO-RANGE DEVICE, 2026-09-04.
 *
 * WHY IT CHANGED. `/` opens on "Two ranges. Nine markers. You should see both",
 * and then the page that actually takes the money showed ONE bar, no lab band,
 * no reference range and no needle. The promise was made on the page that sells
 * nothing and broken on the page that sells. This row set is now the same
 * `.f-mk` / `.f-track` / `.f-band` / `.f-you` device the homepage uses, from the
 * same geometry, so the argument survives the click.
 *
 * EVERY BAND POSITION IS ARITHMETIC FROM `04_products/results-engine/
 * thresholds.md`, and THREE OF THESE FOUR ROWS ARE CARRIED VERBATIM FROM THE
 * HOMEPAGE, values and verdicts included. That is deliberate: those three have
 * already been rendered to customers with this exact geometry, so porting them
 * adds no new clinical assertion. Only hs-CRP is new here, and its two bands
 * COINCIDE, which is the weakest visual claim the device can make.
 *
 * EVERY ROW IS LAB-NORMAL BY CONSTRUCTION, and that is a compliance choice
 * rather than a flattering one. `f-v-lab` carries the string "Lab normal" on all
 * four rows, byte-identical to `/`. Choosing a value the lab would call
 * out-of-range would have required inventing a second lab verdict string that
 * exists nowhere in the approved set. The device's whole argument is "the lab
 * says normal and we do not", so lab-normal rows are also the honest case.
 *
 * THE RESULT IS NOW MIXED, WHICH IS A DELIBERATE REVERSAL (Keith, 2026-09-04).
 * The previous four rows read Action needed / Monitor / Monitor / Monitor: every
 * marker flagged, so the demonstration of the product was a man for whom nothing
 * is fine. For a reader arriving because he is not recovering, that is
 * fear-shaped and it sits badly beside "we sell certainty and clarity". Two rows
 * now read In range and two read Monitor. Both Monitors are genuine SPLITS, so
 * the page still shows the product finding something a standard report misses.
 *
 * Do not adjust a number here without re-deriving its percentage. A value moved
 * without its arithmetic is a page that contradicts the results engine.
 */
export const READOUT_KIT_2: ReadoutRow[] = [
  {
    // CARRIED FROM `/`. thresholds.md: <25 -> GP, <50 low, 50-250 normal, >250
    // -> GP (Ewa 2026-08-07). Vitall male range 50-250 nmol/L. Scale 0-250.
    //   lab      50 -> 20.0%, 250 -> 100%, width 80.0%
    //   ours     50 -> 20.0%, 250 -> 100%, width 80.0%
    //   marker   58 -> 23.2%
    // The two ranges COINCIDE, which is why `.f-band-ours` is inset 2px
    // vertically: at equal height it covered the lab band exactly.
    // `normal-vitamin-d` badges In range.
    name: 'Vitamin D', qualifier: 'muscle function & energy', value: '58', unit: 'nmol/L',
    labLeft: 20, labWidth: 80, oursLeft: 20, oursWidth: 80, you: 23.2,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // CARRIED FROM `/`. NICE NG239 three-band, <25 low, 25-70 borderline, >70
    // normal; Ewa re-ratified 2026-08-07 with the assay cut visible. Vitall
    // assay cut is >37.5 pmol/L. Scale 0-100.
    //   lab    37.5 -> 37.5%, 100 -> 100%, width 62.5%
    //   ours     25 -> 25.0%,  70 ->  70%, width 45.0%
    //   marker   45 -> 45.0%
    // SPLIT: the assay calls 45 normal, NG239 calls it indeterminate. Same
    // number, two verdicts. `borderline-b12` badges Monitor.
    name: 'Active B12', qualifier: 'cellular energy', value: '45', unit: 'pmol/L',
    labLeft: 37.5, labWidth: 62.5, oursLeft: 25, oursWidth: 45, you: 45,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // THE ONE NEW ROW ON THIS PAGE, and its bands coincide.
    // thresholds.md hs-CRP: <=1 normal, >1-3 elevated, >3-10 moderate, >10 -> GP
    // (AHA/CDC 2003 consensus banding, Ewa 2026-06-16 ruling 6 "no change").
    // Vitall reference is <1.00 mg/L, matching our cut at 1 exactly (line 63 of
    // thresholds.md records the match). Scale 0-10, chosen as the full
    // actionable range up to the GP cut.
    //   lab       0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   ours      0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   marker  0.8 ->  8.0%
    // No split is POSSIBLE here at a lab-normal value: the lab's cut and ours
    // are the same number, so agreement is the only truthful drawing.
    // `normal-crp` badges In range.
    name: 'hs-CRP', qualifier: 'inflammation', value: '0.8', unit: 'mg/L',
    labLeft: 0, labWidth: 10, oursLeft: 0, oursWidth: 10, you: 8,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // CARRIED FROM `/`. thresholds.md: <30 -> GP, 30-100 borderline /
    // indeterminate (Ewa ruling 5, 2026-06-16), 100-300 normal, >300 -> GP.
    // Vitall male range 30-442 ug/L. Scale 0-450.
    //   lab      30 ->  6.7%, 442 -> 98.2%, width 91.5%
    //   ours     30 ->  6.7%, 100 -> 22.2%, width 15.5%
    //   marker   62 -> 13.8%
    // SPLIT. `suboptimal-ferritin` badges Monitor.
    name: 'Ferritin', qualifier: 'iron stores', value: '62', unit: 'µg/L',
    labLeft: 6.7, labWidth: 91.5, oursLeft: 6.7, oursWidth: 15.5, you: 13.8,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
]

/* ---------------------------------------------------------------- READOUT_KIT_3 ---- */

/*
 * The sample report. `band` is what the row's own badge declares, and it drives
 * both the chip underline and the bar fill, so the two cannot disagree.
 *
 * Every row mirrors what the results engine would actually return for these
 * values: `status` is the badge from components/results-engine/StatusBadge.tsx
 * (its BADGES map is the customer-facing vocabulary) and the band is the zone
 * from resolveBarZones in lib/results/classifier.ts. Adopted 2026-08-17 (Keith)
 * after this page's first pre-flight found it speaking Normal / Borderline /
 * Low, a vocabulary the product uses nowhere. Keep the two in step: a value
 * changed here without re-deriving its state is a mockup that contradicts the
 * product, which is a claim we cannot substantiate.
 *
 * FAI is deliberately bandless: the engine maps it to `fai-reported`, which
 * carries no verdict, and resolveBarZones returns [] for it because a coloured
 * bar IS a verdict. K1 (Keith, CA-034, 2026-08-12) settled this for Kit 1; this
 * page graded it Normal with a green bar until 2026-08-17.
 */
/*
 * THE SAMPLE READOUT, REBUILT AS THE TWO-RANGE DEVICE, 2026-09-04.
 *
 * WHY IT CHANGED. `/` opens on "Two ranges. Nine markers. You should see both",
 * and the page that actually takes the money showed ONE bar, no lab band, no
 * reference range and no needle. The promise was made where nothing is sold and
 * broken where the money is asked for. Same `.f-mk` / `.f-track` / `.f-band` /
 * `.f-you` device as `/` and `/kits/energy-recovery`, from the same geometry.
 *
 * EVERY BAND POSITION IS ARITHMETIC FROM `04_products/results-engine/
 * thresholds.md` AND `lib/results/classifier.ts:resolveBarZones`, WHICH IS THE
 * RATIFIED SOURCE FOR WHAT A BAR DRAWS PER MARKER. The working is kept inline.
 *
 * A FLOOR IS DRAWN TO THE END OF THE TRACK, AND THAT IS RULED, NOT INVENTED.
 * Albumin and Free Testosterone have no upper action threshold: `resolveBarZones`
 * returns `{ color: 'optimal', upTo: null }` for both, and `upTo: null` means "to
 * the end". Ewa was asked for an albumin upper band on 2026-08-07 and answered
 * "No" (approval-record-biomarker-bands-v2, row "Albumin upper band | No | No
 * change"); CA-044 records the bands themselves as APPROVED, with only two
 * states' card WORDING still pending. So on those two rows our band renders
 * WIDER at the top than the lab reference interval. That is the truth of the
 * ruling: above the lab's upper limit we take no action, and the dashboard has
 * been drawing it that way to customers already.
 *
 * EVERY ROW IS LAB-NORMAL BY CONSTRUCTION, and that is a vocabulary limit rather
 * than a flattering choice. "Lab normal" is the ONLY lab-verdict string that
 * exists anywhere in this app; a value the lab would call out-of-range needs a
 * second string nobody has approved. It is also the honest case, because the
 * device's whole argument is "the lab says normal and we do not".
 *
 * FAI DRAWS NO TRACK. `resolveBarZones` returns [] for it (Ewa ruling 8,
 * report-only, not banded in men) because a coloured bar IS a verdict. It keeps
 * the `.f-bar-none` spacer so the row does not read as a rendering fault, and
 * its badge comes from FAI_REPORT_ONLY rather than being written here.
 *
 * Do not adjust a number here without re-deriving its percentage. A value moved
 * without its arithmetic is a page that contradicts the results engine.
 */
export const READOUT_KIT_3: ReadoutRow[] = [
  {
    // CARRIED FROM `/`. thresholds.md Kit 1 Total Testosterone: our bands low
    // <12, normal 12-20, optimal >20-29, high >29 -> GP. Vitall male reference
    // 8.64-29.00 nmol/L (confirmed 2026-08-06). Scale 0-35 nmol/L.
    //   lab    8.64 -> 24.7%,  29.00 -> 82.9%,  width 58.2%
    //   ours     12 -> 34.3%,     20 -> 57.1%,  width 22.8%
    //   marker  16.8 -> 48.0%
    // SPLIT: 16.8 sits inside the lab's 8.64-29.00 so a standard report says
    // normal and stops; it also sits in OUR 12-20 band, the state
    // `normal-testosterone`, which badges Monitor. Same number, two verdicts.
    name: 'Testosterone', qualifier: 'total', value: '16.8', unit: 'nmol/L',
    labLeft: 24.7, labWidth: 58.2, oursLeft: 34.3, oursWidth: 22.8, you: 48.0,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // resolveBarZones SHBG: warning below referenceLow, optimal to
    // referenceHigh, warning above -- i.e. OUR BAND IS THE LAB'S BAND, by Ewa
    // ruling 7 ("match the lab assay, no fixed numbers", 2026-06-16). Vitall
    // male 20.6-76.7 nmol/L, which is also the code fallback. Scale 0-100.
    //   lab    20.6 -> 20.6%, 76.7 -> 76.7%, width 56.1%
    //   ours   identical, which is why `.f-band-ours` is inset 2px vertically
    //   marker 34.0 -> 34.0%
    // No split is possible here by construction: the two ranges are one range.
    // `shbg-normal` badges In range.
    name: 'SHBG', qualifier: 'binding globulin', value: '34.0', unit: 'nmol/L',
    labLeft: 20.6, labWidth: 56.1, oursLeft: 20.6, oursWidth: 56.1, you: 34.0,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // NO TRACK. resolveBarZones returns [] for FAI (Ewa ruling 8: report-only,
    // not banded in men) because a coloured bar IS a verdict, and the generic
    // fallback used to derive one from the lab range while the card text called
    // the same value normal. Vitall does return a male interval (35.0-92.6%),
    // but we do not interpret against it, so nothing is drawn.
    // The badge is read from FAI_REPORT_ONLY, never written here.
    name: PANEL_MARKERS.fai.name, qualifier: 'reported, not interpreted', value: '41.0', unit: '%',
    labLeft: 0, labWidth: 0, oursLeft: 0, oursWidth: 0, you: 0,
    lab: '', ours: FAI_REPORT_ONLY.badge, split: false, noTrack: true,
  },
  {
    // resolveBarZones Albumin: `{critical, upTo: 35}` then `{optimal, upTo: null}`.
    // `upTo: null` is a FLOOR, not a band -- there is no upper action threshold,
    // and that is a ruling: Ewa was asked for an albumin upper band on 2026-08-07
    // and answered "No" (approval-record-biomarker-bands-v2). Vitall male
    // 35-50 g/L. Scale 0-60 g/L.
    //   lab      35 -> 58.3%, 50 -> 83.3%, width 25.0%
    //   ours     35 -> 58.3%, to the track end -> 100%, width 41.7%
    //   marker 44.0 -> 73.3%
    // OUR BAND IS WIDER THAN THE LAB'S AT THE TOP, and that is the ruling drawn
    // honestly: above 50 the lab's interval ends and we still take no action.
    // `normal-albumin` badges In range.
    name: 'Albumin', qualifier: 'transport protein', value: '44.0', unit: 'g/L',
    labLeft: 58.3, labWidth: 25.0, oursLeft: 58.3, oursWidth: 41.7, you: 73.3,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // resolveBarZones Free Testosterone: `{critical, upTo: referenceLow}` then
    // `{optimal, upTo: null}`. A FLOOR again, and dynamic: the cut is whatever
    // referenceLow arrives with the sample (Ewa ruling 7). Vitall male
    // 0.1980-0.6190 nmol/L, confirmed 2026-08-06. Scale 0-0.8 nmol/L.
    //   lab   0.198 -> 24.8%, 0.619 -> 77.4%, width 52.6%
    //   ours  0.198 -> 24.8%, to the track end -> 100%, width 75.2%
    //   marker 0.31 -> 38.8%
    // Illustrative: a real card bands against the range returned with the
    // sample. `ft-normal` badges In range.
    name: 'Free testosterone', qualifier: 'calculated', value: '0.31', unit: 'nmol/L',
    labLeft: 24.8, labWidth: 52.6, oursLeft: 24.8, oursWidth: 75.2, you: 38.8,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // CARRIED FROM `/`. thresholds.md: <25 -> GP, <50 low, 50-250 normal, >250
    // -> GP (Ewa 2026-08-07). Vitall male range 50-250 nmol/L. Scale 0-250.
    //   lab      50 -> 20.0%, 250 -> 100%, width 80.0%
    //   ours     50 -> 20.0%, 250 -> 100%, width 80.0%
    //   marker 58 -> 23.2%
    // The two ranges COINCIDE. `normal-vitamin-d` badges In range.
    name: 'Vitamin D', qualifier: '25-OH', value: '58', unit: 'nmol/L',
    labLeft: 20, labWidth: 80, oursLeft: 20, oursWidth: 80, you: 23.2,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // NICE NG239 three-band, <25 low, 25-70 borderline, >70 normal; Ewa
    // re-ratified 2026-08-07. Vitall assay cut >37.5 pmol/L. Scale 0-100.
    //   lab    37.5 -> 37.5%, 100 -> 100%, width 62.5%
    //   ours     25 -> 25.0%,  70 ->  70%, width 45.0%
    //   marker 58 -> 58.0%
    // SPLIT: the assay calls it normal, NG239 calls it indeterminate.
    // `borderline-b12` badges Monitor.
    name: 'Active B12', qualifier: 'holo-TC', value: '58', unit: 'pmol/L',
    labLeft: 37.5, labWidth: 62.5, oursLeft: 25, oursWidth: 45, you: 58.0,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
  {
    // thresholds.md hs-CRP: <=1 normal, >1-3 elevated, >3-10 moderate, >10 -> GP
    // (AHA/CDC 2003 banding, Ewa 2026-06-16 ruling 6 "no change"). Vitall
    // reference <1.00 mg/L, matching our cut at 1 exactly (thresholds.md line
    // 63). Scale 0-10, the full actionable range to the GP cut.
    //   lab       0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   ours      0 ->  0.0%,   1 -> 10.0%, width 10.0%
    //   marker 0.8 -> 8.0%
    // No split is POSSIBLE at a lab-normal value: the lab's cut and ours are the
    // same number. `normal-crp` badges In range.
    name: 'hs-CRP', qualifier: 'inflammation', value: '0.8', unit: 'mg/L',
    labLeft: 0, labWidth: 10, oursLeft: 0, oursWidth: 10, you: 8.0,
    lab: 'Lab normal', ours: 'In range', split: false,
  },
  {
    // thresholds.md: <30 -> GP, 30-100 borderline / indeterminate (Ewa ruling 5,
    // 2026-06-16), 100-300 normal, >300 -> GP. Vitall male 30-442 ug/L.
    // Scale 0-450.
    //   lab      30 ->  6.7%, 442 -> 98.2%, width 91.5%
    //   ours     30 ->  6.7%, 100 -> 22.2%, width 15.5%
    //   marker 39 -> 8.7%
    // SPLIT. `suboptimal-ferritin` badges Monitor.
    name: 'Ferritin', qualifier: 'iron stores', value: '39', unit: 'µg/L',
    labLeft: 6.7, labWidth: 91.5, oursLeft: 6.7, oursWidth: 15.5, you: 8.7,
    lab: 'Lab normal', ours: 'Monitor', split: true,
  },
]
