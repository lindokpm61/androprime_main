import type { KitType } from '@/lib/results/types'
import { PRICING } from '@/lib/pricing'

/**
 * Canonical panel definition: which markers each kit measures, and the
 * customer-facing copy for each. Single source of truth for every surface that
 * lists what is in a kit.
 *
 * This file exists because the list was hand-written on six surfaces and three
 * of them had drifted. On 2026-08-29 `/how-it-works` listed Kit 1 as three
 * markers, `/faq`'s table listed seven rows and committed to "the seven", the
 * quiz called Kit 1 three markers and the results dashboard called it two,
 * while `/kits`, `/kits/testosterone`, the homepage and both comparison tables
 * all said five and nine. FAI and Albumin were missing from every understated
 * copy: those pages predate the two markers joining the panel and were never
 * swept. Add a marker here, and every surface picks it up.
 *
 * The panel itself is owned by `04_products`:
 * `kits/kit-1-testosterone-health-check.md` (Kit 1: Total T, SHBG, FAI,
 * Albumin, Free T) and `kits/kit-3-hormone-recovery-check.md`. Do not change a
 * marker set here without changing it there.
 *
 * FAI copy is constrained by a clinical ruling, not by preference: Ewa ruled it
 * report-only and not banded in men (`04_products/results-engine/thresholds.md`
 * item 8, re-sourced 2026-07-30). The wording below is a compression of the
 * live engine strings in `lib/results/biomarker-copy.ts` (`fai-reported`,
 * `FAI_EVIDENCE`), approved 2026-08-07. Do not restore any framing that makes
 * FAI a stand-in for free testosterone in men.
 */

export type PanelMarkerId =
  | 'total-testosterone'
  | 'shbg'
  | 'fai'
  | 'albumin'
  | 'free-testosterone'
  | 'vitamin-d'
  | 'active-b12'
  | 'hs-crp'
  | 'ferritin'

export type PanelMarker = {
  /** Plain marker name. Used where a column or a paragraph explains it. */
  name: string
  /** Parenthetical shown after the name on kit cards, where there is no explanation beside it. */
  gloss?: string
  /** Compact label for a one-line marker string. */
  short: string
  /** What the lab measures. */
  measures: string
  /** Why it is on the panel. */
  why: string
}

export const PANEL_MARKERS: Record<PanelMarkerId, PanelMarker> = {
  'total-testosterone': {
    name: 'Total Testosterone',
    short: 'Total T',
    measures: 'Total circulating testosterone in the blood',
    why: 'The primary male sex hormone. Affects energy, libido, muscle mass, mood, and drive.',
  },
  'shbg': {
    name: 'SHBG',
    short: 'SHBG',
    measures: 'Sex hormone-binding globulin',
    why: 'Binds to testosterone and renders it inactive. High SHBG means less testosterone available to your cells regardless of total T.',
  },
  'fai': {
    name: 'Free Androgen Index',
    gloss: 'FAI',
    short: 'FAI',
    measures: 'Your total testosterone expressed as a percentage of your SHBG',
    why: 'Reported for completeness, because it appears on lab reports you may be given elsewhere. In men we draw no conclusion from it: it tracks calculated free testosterone poorly. Your Free Testosterone result is the figure to work from.',
  },
  'albumin': {
    name: 'Albumin',
    short: 'Albumin',
    measures: 'The most abundant transport protein in the blood',
    why: 'One of the two inputs, with SHBG, used to calculate your free testosterone from your total testosterone reading. Testing it is what makes that figure a calculation rather than an estimate.',
  },
  'free-testosterone': {
    name: 'Free Testosterone',
    gloss: 'Calc',
    short: 'Free T',
    measures: 'Calculated from Total T, SHBG and Albumin',
    why: 'The biologically active fraction. This is what your body actually uses. Total T on its own does not tell you how much of it is available to you.',
  },
  'vitamin-d': {
    name: 'Vitamin D',
    short: 'Vit D',
    measures: '25-hydroxyvitamin D (total)',
    why: 'Supports muscle function, immune response, and energy. Most UK men are below optimal between October and April.',
  },
  'active-b12': {
    name: 'Active B12',
    short: 'Active B12',
    measures: 'Holotranscobalamin (active form)',
    why: 'The form of B12 your cells can actually use. Standard B12 tests measure total serum B12 which includes inactive fractions. Active B12 shows what is truly available. Deficiency is more common in men over 40 and those on plant-based diets.',
  },
  'hs-crp': {
    name: 'hs-CRP',
    gloss: 'Inflammation',
    short: 'hs-CRP',
    measures: 'High-sensitivity C-reactive protein',
    why: 'Systemic inflammation marker. Elevated hs-CRP is directly associated with slower recovery, joint soreness, and reduced training adaptation.',
  },
  'ferritin': {
    name: 'Ferritin',
    gloss: 'Iron Storage',
    short: 'Ferritin',
    measures: 'Iron storage marker',
    why: 'Low ferritin limits oxygen delivery to muscles and tissues. Causes fatigue and stamina decline that is often mistaken for overtraining or low testosterone.',
  },
}

/**
 * The two compressed forms of the FAI verdict, for sample-result cards.
 *
 * FAI is the one marker on the panel the engine deliberately does not grade:
 * `classifier.ts` maps it to `fai-reported`, whose stateLabel is "Reported for
 * reference, not interpreted", and `resolveBarZones` returns [] for it because a
 * coloured bar IS a verdict. Ewa ruled it report-only and not banded in men
 * (`04_products/results-engine/thresholds.md` item 8, re-sourced 2026-07-30).
 *
 * These live here because four sample cards render them and, before 2026-08-29,
 * two of the four badged FAI "Borderline" behind an amber bar, which promises an
 * interpretation the product refuses to give. `sub` states the arithmetic, which
 * is true and claims nothing; never restore "Bioavailable testosterone ratio",
 * which is the free-T stand-in framing the ruling refuses.
 *
 * `badgeShort` exists only for the one card whose badge column is a fixed `w-24`
 * (`/lp/hormone-recovery`), where the long form wraps. Both are compressions of
 * the same engine stateLabel; neither carries a verdict.
 */
export const FAI_REPORT_ONLY = {
  sub: 'Ratio of total T to SHBG',
  badge: 'Not interpreted',
  badgeShort: 'Reported',
} as const

/** The markers each kit measures, in the order every surface presents them. */
export const KIT_PANELS: Record<KitType, readonly PanelMarkerId[]> = {
  'testosterone': ['total-testosterone', 'shbg', 'fai', 'albumin', 'free-testosterone'],
  'energy-recovery': ['vitamin-d', 'active-b12', 'hs-crp', 'ferritin'],
  'hormone-recovery': [
    'total-testosterone', 'shbg', 'fai', 'albumin', 'free-testosterone',
    'vitamin-d', 'active-b12', 'hs-crp', 'ferritin',
  ],
}

/** "Kit 1" / "Kit 2" / "Kit 3", in the order the site numbers them. */
export const KIT_NUMBER_LABELS: Record<KitType, string> = {
  'testosterone': 'Kit 1',
  'energy-recovery': 'Kit 2',
  'hormone-recovery': 'Kit 3',
}

const KIT_ORDER: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']

/** Every marker on the panel, across all kits, in canonical order. */
export const ALL_PANEL_MARKER_IDS = KIT_PANELS['hormone-recovery']

/** The marker objects for one kit, in canonical order. */
export function panelMarkers(kit: KitType): PanelMarker[] {
  return KIT_PANELS[kit].map((id) => PANEL_MARKERS[id])
}

/** How many markers a kit measures. Use this rather than writing the number out. */
export function panelCount(kit: KitType): number {
  return KIT_PANELS[kit].length
}

/** Card labels: the marker name plus its gloss, e.g. "Free Testosterone (Calc)". */
export function panelCardLabels(kit: KitType): string[] {
  return panelMarkers(kit).map((m) => (m.gloss ? `${m.name} (${m.gloss})` : m.name))
}

/** Compact labels for a one-line marker string, e.g. "Total T · SHBG · FAI · Albumin · Free T". */
export function panelShortLabels(kit: KitType): string[] {
  return panelMarkers(kit).map((m) => m.short)
}

/** Which kits a marker appears in, e.g. "Kit 1 & Kit 3". */
export function kitsIncluding(id: PanelMarkerId): string {
  return KIT_ORDER.filter((kit) => KIT_PANELS[kit].includes(id))
    .map((kit) => KIT_NUMBER_LABELS[kit])
    .join(' & ')
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

/**
 * A small count written out, for copy that says "the five markers" rather than
 * "the 5 markers". Keeps a sentence's number tied to the panel it describes.
 */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n)
}

/**
 * The kit's markers as a sentence fragment, e.g. "Total Testosterone, SHBG,
 * Free Androgen Index, Albumin and Free Testosterone". For prose that names the
 * panel, so it uses the full names rather than the compact ones.
 */
export function panelSentenceList(kit: KitType): string {
  const labels = panelMarkers(kit).map((m) => m.name)
  if (labels.length < 2) return labels.join('')
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`
}

/* ------------------------------------------------------------------------- *
 * Coverage: which kit can measure a given set of markers.
 *
 * Added 2026-09-12 for the retest panel rule (defect D1). The nightly sweep
 * used to re-send whatever kit the customer last bought, so a Kit 3 buyer got
 * all nine markers back whatever his result said. The rule is now that the
 * retest panel follows what was FLAGGED, not what was purchased, and that
 * question is answered here because this file already owns which markers each
 * kit measures. `lib/membership/retestPanel.ts` owns the flagging half.
 * ------------------------------------------------------------------------- */

/**
 * The classifier's marker names, mapped onto the panel vocabulary.
 *
 * Two vocabularies exist for the same nine markers: `classifier.ts` switches on
 * the name the lab sends ("Testosterone", "hs-CRP"), and this file keys on a
 * slug ("total-testosterone", "hs-crp"). Nothing joined them until a rule
 * needed to ask "which kit measures the marker this result flagged".
 *
 * ⚠ THIS IS A DUPLICATED FACT and it is guarded rather than trusted:
 * `scripts/test-retest-panel.ts` asserts the map's keys are exactly the marker
 * names `classifier.ts` switches on, and that its values cover every
 * `PanelMarkerId`. A marker added to the panel or renamed by the lab fails that
 * test rather than silently falling out of the retest rule, which would make a
 * flagged marker invisible to it.
 */
export const PANEL_MARKER_ID_BY_RESULT_NAME: Readonly<Record<string, PanelMarkerId>> = {
  'Testosterone': 'total-testosterone',
  'SHBG': 'shbg',
  'Free Androgen Index': 'fai',
  'Albumin': 'albumin',
  'Free Testosterone': 'free-testosterone',
  'Vitamin D': 'vitamin-d',
  'Active B12': 'active-b12',
  'hs-CRP': 'hs-crp',
  'Ferritin': 'ferritin',
}

/** The panel id for a classified result's marker name, or null if unrecognised. */
export function panelMarkerIdFor(markerName: string): PanelMarkerId | null {
  return PANEL_MARKER_ID_BY_RESULT_NAME[markerName] ?? null
}

/**
 * The kits in ascending price, derived from `PRICING` rather than written out.
 *
 * The order is NOT the panel sizes and must not be re-derived from them: Kit 2
 * measures four markers and Kit 1 measures five, but Kit 2 is the dearer of the
 * two (£119 against £99). Sorting by marker count would quietly pick the more
 * expensive kit whenever both could cover the same set.
 */
export const KITS_BY_PRICE: readonly KitType[] = [PRICING.KIT_1, PRICING.KIT_2, PRICING.KIT_3]
  .slice()
  .sort((a, b) => a.rrp - b.rrp)
  .map((k) => k.slug as KitType)

/**
 * The cheapest kit whose panel measures every one of these markers, or null if
 * no kit does.
 *
 * An empty set returns null rather than the cheapest kit. "Nothing was flagged"
 * is a different statement from "anything will do", and the caller has to decide
 * what to send a man with nothing to re-measure; it is not a packing question.
 */
export function cheapestKitCovering(ids: readonly PanelMarkerId[]): KitType | null {
  if (ids.length === 0) return null
  const wanted = new Set(ids)
  return (
    KITS_BY_PRICE.find((kit) => {
      const panel = KIT_PANELS[kit]
      for (const id of wanted) if (!panel.includes(id)) return false
      return true
    }) ?? null
  )
}
