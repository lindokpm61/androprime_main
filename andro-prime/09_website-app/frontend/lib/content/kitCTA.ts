/**
 * Central CTA routing map for content derivatives.
 *
 * Source of truth: `06_marketing/seo-ai-search/content-atomisation-model.md` §4.
 * When that table changes, change this file. Nowhere else.
 *
 * WHY THIS EXISTS
 * Content is evergreen and topic-based; it is never hard-wired to a kit. The body of an
 * article explains the symptom or the marker. Only the CTA target changes when a product
 * launches. Redirecting a whole pillar (say, moving inflammation from Kit 2 to Kit 3 Plus
 * the day it goes live) must be a one-line change here, not an edit to every published
 * article, video description, and email.
 *
 * Before this file existed, nine articles hard-coded `ctaHref="/kits/energy-recovery"`.
 *
 * COMPLIANCE INVARIANTS (03_compliance/CONTEXT.md)
 * - A CTA routes to a live kit or to email capture. Never to the founding-member list.
 * - Never imply TRT or any clinical service is available.
 * - Pillar E (andropause) is Ewa-gated: resolving it throws until the claims pack is signed.
 * - Intent-match to the best LIVE product. Where none exists, hold at email capture.
 */

import { PRICING } from '@/lib/pricing'

/** Pillar identifiers from the atomisation model §4. */
export type PillarId =
  | 'A' // Vitamin D
  | 'B' // Fatigue / energy
  | 'C' // Testosterone / the normal range
  | 'D' // Markers explained / CRP
  | 'E' // Andropause / male menopause  (GATED)
  | 'G' // Inflammation / hs-CRP
  | 'metabolic' // Belly / visceral fat
  | 'liver'
  | 'thyroid'

type KitKey = keyof Pick<typeof PRICING, 'KIT_1' | 'KIT_2' | 'KIT_3'>

export interface KitCTATarget {
  /** Internal route. Always an indexable /kits/* page or an email-capture route, never /lp/*. */
  href: string
  /** Button label. The component appends the arrow. */
  label: string
  /** The live kit this routes to, or null when holding at email capture. */
  kit: KitKey | null
  /** Ewa-gated pillars refuse to resolve. */
  gated?: true
  /** Where this pillar moves when the named product launches. Documentation only. */
  redirectWhenLive?: string
}

/**
 * pillar -> current best LIVE target.
 * Mirrors the "Pillar -> product routing (current)" table in the atomisation model §4.
 */
export const KIT_CTA: Record<PillarId, KitCTATarget> = {
  G: {
    href: '/kits/energy-recovery',
    label: 'See the Energy & Recovery Check',
    kit: 'KIT_2', // carries hs-CRP
    redirectWhenLive: 'Kit 3 Plus',
  },
  D: {
    href: '/kits/energy-recovery',
    label: 'See the Energy & Recovery Check',
    kit: 'KIT_2',
    redirectWhenLive: 'Kit 3 Plus',
  },
  A: {
    href: '/kits/energy-recovery',
    label: 'See the Energy & Recovery Check',
    kit: 'KIT_2', // Vitamin D sits in Kit 2
  },
  B: {
    href: '/kits/energy-recovery',
    label: 'See the Energy & Recovery Check',
    kit: 'KIT_2', // B12, ferritin, Vit D, hs-CRP
    redirectWhenLive: 'Kit 5 (thyroid) as an addition, not a replacement',
  },
  C: {
    href: '/kits/testosterone',
    label: 'See the Testosterone Health Check',
    kit: 'KIT_1',
  },

  // No live product match. Hold at email capture rather than mis-routing intent to a
  // hormone kit. Do not "nearly match" these to Kit 2: sending liver-function intent
  // to an energy kit is the mis-route this map exists to prevent.
  metabolic: {
    href: '/waitlist',
    label: 'Join the waitlist',
    kit: null,
    redirectWhenLive: 'Kit 3 Plus',
  },
  liver: {
    href: '/waitlist',
    label: 'Join the waitlist',
    kit: null,
    redirectWhenLive: 'Liver kit',
  },
  thyroid: {
    href: '/waitlist',
    label: 'Join the waitlist',
    kit: null,
    redirectWhenLive: 'Kit 5',
  },

  // GATED. Pillar E content must not exist until Ewa signs the andropause claims pack
  // (03_compliance/claims-and-labels/pillar-E-andropause-claims-pack.md). The throw in
  // resolveKitCTA() is deliberate: it fails the build rather than shipping ungated copy.
  E: {
    href: '/kits/testosterone',
    label: 'See the Testosterone Health Check',
    kit: 'KIT_1',
    gated: true,
  },
}

/**
 * Resolve a pillar to its current CTA target.
 * @throws if the pillar is Ewa-gated, or unknown.
 */
export function resolveKitCTA(pillar: PillarId): KitCTATarget {
  const target = KIT_CTA[pillar]

  if (!target) {
    throw new Error(
      `kitCTA: unknown pillar "${pillar}". Valid pillars: ${Object.keys(KIT_CTA).join(', ')}.`,
    )
  }

  if (target.gated) {
    throw new Error(
      `kitCTA: pillar "${pillar}" is Ewa-gated and must not ship. ` +
        `See 03_compliance/claims-and-labels/pillar-E-andropause-claims-pack.md.`,
    )
  }

  return target
}

/** True when the pillar has no live product and is holding at email capture. */
export function isEmailCapture(pillar: PillarId): boolean {
  return KIT_CTA[pillar]?.kit === null
}
