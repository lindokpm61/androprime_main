import type { KitType } from '@/lib/results/types'

// Canonical customer-facing kit display names. Single source of truth for
// slug -> display name across the results UI, account, activation, and the
// Customer.io event payloads (result_received -> {{ event.kit_name }}).
export const KIT_NAMES: Record<KitType, string> = {
  'testosterone':     'Testosterone Health Check',
  'energy-recovery':  'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

/** Display name for a kit_type slug. Falls back to the raw slug if unmapped. */
export function kitName(kitType: string | null | undefined): string {
  if (!kitType) return ''
  return KIT_NAMES[kitType as KitType] ?? kitType
}
