import { stripe } from '@/lib/stripe/client'

export interface CashPosition {
  availableGbp: number
  pendingGbp: number
  totalGbp: number
  fetchedAt: string
  error?: string
}

// Stripe Balance API returns balances as pence-denominated amounts grouped
// by currency. We sum the GBP rows only; ignore any other currency (none
// expected in Phase 0).
function sumGbpPence(arr: { currency: string; amount: number }[]): number {
  return arr
    .filter(b => b.currency === 'gbp')
    .reduce((s, b) => s + b.amount, 0)
}

export async function getCashPosition(): Promise<CashPosition> {
  try {
    const balance = await stripe.balance.retrieve()
    const availablePence = sumGbpPence(balance.available)
    const pendingPence = sumGbpPence(balance.pending)
    return {
      availableGbp: availablePence / 100,
      pendingGbp: pendingPence / 100,
      totalGbp: (availablePence + pendingPence) / 100,
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe Balance API error'
    return {
      availableGbp: 0,
      pendingGbp: 0,
      totalGbp: 0,
      fetchedAt: new Date().toISOString(),
      error: message,
    }
  }
}
