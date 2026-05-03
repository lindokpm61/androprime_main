import Stripe from 'stripe'

let _stripe: Stripe | undefined

export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    if (!_stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
      }
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-03-25.dahlia',
      })
    }
    return _stripe[prop as keyof Stripe]
  },
})
