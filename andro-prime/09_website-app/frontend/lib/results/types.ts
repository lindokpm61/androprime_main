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

export interface SingleResult {
  resultId: string
  collectedAt: string | null
  markers: ClassifiedResult[]
  hasQualifierPending: boolean
}

export interface KitData {
  kitType: KitType
  results: SingleResult[]  // newest first
}

export interface VitallBiomarker {
  name: string
  value: number
  unit: string
  referenceRange: { low: number | null; high: number | null }
  status: 'optimal' | 'borderline' | 'low' | 'high' | 'critical'
}

export interface VitallWebhookPayload {
  orderId: string
  userId: string
  kitType: KitType
  collectedAt: string
  biomarkers: VitallBiomarker[]
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
  | 'shbg-low'
  | 'shbg-normal'
  | 'shbg-high'
  | 'ft-low'
  | 'ft-normal'
  | 'critically-low-vitamin-d'
  | 'low-vitamin-d'
  | 'normal-vitamin-d'
  | 'elevated-crp'
  | 'moderate-crp'
  | 'high-crp'
  | 'normal-crp'
  | 'low-ferritin'
  | 'suboptimal-ferritin'
  | 'normal-ferritin'
  | 'low-b12'
  | 'normal-b12'
  | 'low-albumin'
  | 'normal-albumin'
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

export interface BarZone {
  color: 'optimal' | 'warning' | 'critical'
  upTo: number | null  // null = extends to bar end
}

export interface ClassifiedResult {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
  displayZones: BarZone[]
  state: ResultState
  stateLabel: string
  explanation: string
  educationContext: string
  recommendation: string
  recommendationStrategy: RecommendationStrategy
  primaryCta: Cta | null
  secondaryCta: Cta | null
  requiresQualifier: boolean
  qualifierKey: string | null
}

export type PreResultsOrderStatus =
  | 'order-placed'
  | 'kit-sent'
  | 'sample-received'
  | 'analysing'

export type DashboardData =
  | { state: 'no-results' }
  | {
      state: 'pre-results'
      orderStatus: PreResultsOrderStatus
      kitType: KitType
    }
  | {
      state: 'ready'
      kits: KitData[]
      userAge: number | null
    }
