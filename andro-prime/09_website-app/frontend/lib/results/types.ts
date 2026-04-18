export const MARKER_NAMES = {
  TESTOSTERONE: 'Testosterone',
  SHBG: 'SHBG',
  FREE_TESTOSTERONE: 'Free Testosterone',
  ALBUMIN: 'Albumin',
  FREE_ANDROGEN_INDEX: 'Free Androgen Index',
  VITAMIN_D: 'Vitamin D',
  HS_CRP: 'hs-CRP',
  FERRITIN: 'Ferritin',
  ACTIVE_B12: 'Active B12',
} as const

export type MarkerName = typeof MARKER_NAMES[keyof typeof MARKER_NAMES]

export type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

export type ScenarioName =
  | 'low-testosterone'
  | 'normal-testosterone-energy'
  | 'normal-testosterone-no-energy'
  | 'optimal-testosterone'
  | 'low-vitamin-d'
  | 'elevated-crp'
  | 'high-crp'
  | 'low-ferritin'
  | 'low-b12'
  | 'multi-deficiency'

export interface ThrivaBiomarker {
  name: string
  value: number
  unit: string
  referenceRange: { low: number | null; high: number | null }
  status: 'optimal' | 'borderline' | 'low' | 'high' | 'critical'
}

export interface ThrivaWebhookPayload {
  orderId: string
  userId: string
  kitType: KitType
  collectedAt: string
  biomarkers: ThrivaBiomarker[]
  signature?: string
}

export interface NormalisedBiomarker {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
}

export type ResultState =
  | 'low-testosterone'
  | 'normal-testosterone'
  | 'optimal-testosterone'
  | 'low-vitamin-d'
  | 'elevated-crp'
  | 'high-crp'
  | 'low-ferritin'
  | 'low-b12'
  | 'low-albumin'
  | 'normal'

export type CtaType =
  | 'founding-member-deposit'
  | 'daily-stack-zinc'
  | 'daily-stack-d3'
  | 'daily-stack-b12'
  | 'complete-mens-stack'
  | 'collagen'
  | 'lifestyle-guidance'
  | 'kit-2-cross-sell'
  | 'kit-1-cross-sell'
  | 'retest-reminder'
  | 'gp-referral'

export interface Cta {
  type: CtaType
  label: string
  href: string
}

export type RecommendationStrategy = 'single' | 'multi-deficiency'

export interface ClassifiedResult {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
  state: ResultState
  stateLabel: string
  explanation: string
  educationContext: string
  recommendationStrategy: RecommendationStrategy
  primaryCta: Cta | null
  secondaryCta: Cta | null
  requiresQualifier: boolean
  qualifierKey: string | null
}

export type DashboardData =
  | { state: 'no-results' }
  | {
      state: 'ready'
      resultId: string
      markers: ClassifiedResult[]
      hasQualifierPending: boolean
      userAge: number | null
    }
