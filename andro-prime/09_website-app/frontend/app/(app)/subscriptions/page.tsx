import { AppPlaceholder } from '@/components/app/AppPlaceholder'

export default function SubscriptionsPage() {
  return (
    <AppPlaceholder
      eyebrow="Protected App Route"
      title="Subscriptions"
      description="This route is protected and session-aware now, so Stripe-backed subscription state can be layered in during Phase 6 without revisiting auth plumbing."
    />
  )
}
