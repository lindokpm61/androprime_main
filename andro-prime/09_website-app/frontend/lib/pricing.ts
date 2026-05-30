export const PRICING = {
  KIT_1: { name: 'Testosterone Health Check', rrp: 99,  ptCoded: 89.10, slug: 'testosterone' },
  KIT_2: { name: 'Energy & Recovery Check',   rrp: 119, ptCoded: 107.10, slug: 'energy-recovery' },
  KIT_3: { name: 'Hormone & Recovery Check',  rrp: 179, ptCoded: 161.10, slug: 'hormone-recovery' },
  DAILY_STACK_MO: 34.95,
  COLLAGEN_MO:    29.95,
  COMPLETE_STACK_MO: 54.95,
} as const;

export const PARTNER_DISCOUNT_PCT = 10;

// Customer-facing turnaround SLA = "2 to 5 working days" (Ben/Vitall written confirmation 2026-05-22, commit dd3e302). Do not advertise an hours-based SLA — Vitall gives reasonable endeavours, not a guarantee. The internal 48h+24h contract clause stays in 03_compliance, not in customer copy.
export const SLA_COPY = '2 to 5 working days';

export const KIT_PRICE_RANGE = `£${PRICING.KIT_1.rrp} to £${PRICING.KIT_3.rrp}`;
