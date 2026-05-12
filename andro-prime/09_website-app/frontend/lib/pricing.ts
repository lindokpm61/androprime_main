export const PRICING = {
  KIT_1: { name: 'Testosterone Health Check', rrp: 99,  ptCoded: 89.10, slug: 'testosterone' },
  KIT_2: { name: 'Energy & Recovery Check',   rrp: 119, ptCoded: 107.10, slug: 'energy-recovery' },
  KIT_3: { name: 'Hormone & Recovery Check',  rrp: 179, ptCoded: 161.10, slug: 'hormone-recovery' },
  DAILY_STACK_MO: 34.95,
  COLLAGEN_MO:    29.95,
  COMPLETE_STACK_MO: 54.95,
} as const;

export const PARTNER_DISCOUNT_PCT = 10;

// SLA confirmed 48h locked 2026-05-12 — pending written confirmation from Vitall. If Vitall confirms 72h, revisit this constant and the affiliate briefs (06_marketing/affiliates/) which were also updated.
export const SLA_HOURS = 48;

export const KIT_PRICE_RANGE = `£${PRICING.KIT_1.rrp} to £${PRICING.KIT_3.rrp}`;
