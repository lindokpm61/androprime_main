import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getCurrentUser } from '@/lib/auth/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { HEALTH_PROCESSING_CONSENT_VERSION } from '@/lib/auth/consentVersions'
import { isBundlesEnabled } from '@/lib/flags'
import type { ComparableCoupon } from '@/lib/membership/pricingRules'
import { resolveBundleCheckout } from '@/lib/bundles/checkout'
import type { BundleConfig } from '@/lib/bundles/config'
import { urlFor } from '@/lib/hosts'

const KIT_PRICE_IDS: Record<string, string | undefined> = {
  testosterone: process.env.STRIPE_PRICE_KIT_1,
  'energy-recovery': process.env.STRIPE_PRICE_KIT_2,
  'hormone-recovery': process.env.STRIPE_PRICE_KIT_3,
}

// Allowlist of customer-facing discount codes → Stripe coupon IDs.
// IDs are mode-specific, so they live in env (set the LIVE coupon IDs in
// Coolify; left unset locally so test-mode checkouts degrade to full price).
// SUBSCRIBER10 = seq-04 E5 retest prompt; LAUNCHDAY10 = seq-01 E4 launch broadcast.
const COUPON_IDS: Record<string, string | undefined> = {
  SUBSCRIBER10: process.env.STRIPE_COUPON_SUBSCRIBER10,
  LAUNCHDAY10: process.env.STRIPE_COUPON_LAUNCHDAY10,
}

// Resolve a `?discount=` code to a usable, currently-valid coupon.
// Returns null (no discount, full price) for unknown codes, unconfigured env, or
// a coupon Stripe reports as invalid — a bad code must never block a sale.
// Returns the raw percent/amount alongside the id, which is the shape
// lib/membership/pricingRules.ts compares. Nothing compares against it on this
// path today: kits are never discounted for members.
async function resolveCoupon(raw: string | undefined): Promise<ComparableCoupon | null> {
  if (!raw) return null
  const couponId = COUPON_IDS[raw.trim().toUpperCase()]
  if (!couponId) return null
  try {
    const coupon = await stripe.coupons.retrieve(couponId)
    if (!coupon.valid) return null
    return { id: coupon.id, percentOff: coupon.percent_off, amountOff: coupon.amount_off }
  } catch {
    return null
  }
}

const VALID_SEX = new Set(['male', 'female'])

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
}

function isAtLeast18(dobIso: string): boolean {
  const dob = new Date(dobIso)
  const eighteenYearsAgo = new Date()
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
  return dob <= eighteenYearsAgo
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  let body: {
    kitType?: string
    dobIso?: string
    sex?: string
    healthConsent?: boolean
    discount?: string
    bundle?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { kitType, dobIso: dobFromBody, sex: sexFromBody, healthConsent, discount, bundle } = body
  if (!kitType || !(kitType in KIT_PRICE_IDS)) {
    return NextResponse.json({ error: 'Invalid kitType' }, { status: 400 })
  }

  // Resolve the Stripe price: a single kit uses its own kit price; a bundle uses
  // the bundle SKU's price. Bundles are dark-launched behind BUNDLES_ENABLED, so
  // a bundle request while the flag is off is rejected (no valid client sends
  // `bundle` in that state). When `bundle` is absent this branch is skipped and
  // behaviour is byte-identical to a plain single-kit purchase.
  let priceId: string | undefined
  let bundleConfig: BundleConfig | null = null
  if (bundle) {
    const resolution = resolveBundleCheckout(bundle, kitType, isBundlesEnabled())
    if (!resolution.ok) {
      return NextResponse.json({ error: resolution.error }, { status: resolution.status })
    }
    bundleConfig = resolution.config
    priceId = process.env[bundleConfig.stripePriceEnv]
    if (!priceId) {
      return NextResponse.json({ error: `Price ID for ${bundle} bundle is not configured` }, { status: 400 })
    }
  } else {
    priceId = KIT_PRICE_IDS[kitType]
    if (!priceId) {
      return NextResponse.json({ error: `Price ID for ${kitType} is not configured` }, { status: 400 })
    }
  }

  // Resolve DOB + sex: prefer existing user record, fall back to request body.
  // Also check whether an explicit health-data processing consent is already on
  // record, so a returning customer who consented on a prior purchase is not asked
  // to re-consent.
  let dobIso: string | null = null
  let sex: string | null = null
  let consentOnRecord = false

  if (user) {
    const supabase = createSupabaseAdminClient()
    const { data: profile } = await supabase
      .from('users')
      .select('date_of_birth, sex, health_processing_consent_version')
      .eq('id', user.id)
      .single()

    if (profile?.date_of_birth && profile?.sex) {
      dobIso = profile.date_of_birth as string
      sex = profile.sex as string
    }
    if (profile?.health_processing_consent_version) consentOnRecord = true
  }

  if (!dobIso && dobFromBody && isValidIsoDate(dobFromBody)) {
    if (!isAtLeast18(dobFromBody)) {
      return NextResponse.json({ error: 'You must be 18 or over to order a kit.' }, { status: 400 })
    }
    dobIso = dobFromBody
  }

  if (!sex && sexFromBody && VALID_SEX.has(sexFromBody)) {
    sex = sexFromBody
  }

  // Explicit health-data processing consent (Art 9(2)(a)) is required to process
  // the kit results. It is captured here, at the point of purchase, where it is
  // freely given (the customer is deciding whether to buy). A customer who already
  // consented does not re-consent. Missing details OR missing consent both route
  // the customer to /checkout/details, which collects all three.
  const consentGiven = consentOnRecord || healthConsent === true

  if (!dobIso || !sex || !consentGiven) {
    return NextResponse.json({ needsDetails: true }, { status: 200 })
  }

  const metadata: Record<string, string> = {
    kit_type: kitType,
    type: 'kit',
    dob: dobIso,
    sex,
  }
  if (user) metadata.user_id = user.id

  // Bundle: keep kit_type = the BASE kit (the webhook's kit branch reads kit_type
  // to insert + dispatch the first kit exactly as today) and ADD the bundle
  // fields the webhook uses to schedule the owed second kit. Only set when a valid
  // bundle was resolved above.
  if (bundleConfig && bundle) {
    metadata.bundle_type = bundle
    metadata.second_kit_type = bundleConfig.secondKitType
  }

  // Carry a newly-given consent through to the Stripe webhook, which stamps it on
  // the user record when the order is created. Omitted when consent is already on
  // record (the original consent + timestamp is preserved).
  if (!consentOnRecord) {
    metadata.health_consent_version = HEALTH_PROCESSING_CONSENT_VERSION
    metadata.health_consented_at = new Date().toISOString()
  }

  // FirstPromoter referral attribution. The `_fprom_tid` cookie is set
  // client-side by fpr.js when the visitor lands on a `?fpr=<code>` URL;
  // we forward it through Stripe metadata so the Stripe webhook can call
  // FirstPromoter's /track/sale on `checkout.session.completed` with the
  // right tid. Absent cookie = organic purchase, nothing to attribute.
  const fpTid = request.cookies.get('_fprom_tid')?.value
  if (fpTid) metadata.fp_tid = fpTid

  // Auto-apply an allowlisted `?discount=` code (e.g. SUBSCRIBER10) as a coupon.
  // Unknown/invalid codes resolve to null and the customer pays full price.
  //
  // KITS ARE NEVER DISCOUNTED FOR MEMBERS (Keith, 2026-08-26). Everyone pays
  // retail for every kit, always. A member's benefit is the INCLUDED retest on
  // its date, and discounting kits on top of that would undercut the economics
  // the offer window exists to protect. Member pricing is for SUPPLEMENTS, and
  // stays dark until there is a supplement shop to attach it to
  // (lib/membership/memberPricing.ts).
  const codeCoupon = await resolveCoupon(discount)
  const couponId = codeCoupon?.id
  if (codeCoupon) metadata.discount_code = discount!.trim().toUpperCase()

  let session
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user?.email ?? undefined,
      metadata,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      shipping_address_collection: { allowed_countries: ['GB'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      // These two now land on DIFFERENT hosts, which is exactly why they go
      // through urlFor: /order/confirmed is an authenticated page on the app
      // host (it resolves the order reference under RLS), while /kits is
      // marketing on the apex. Hardcoding one origin would break one of them.
      success_url: `${urlFor('/order/confirmed')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: urlFor('/kits'),
      currency: 'gbp',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('[checkout/kit]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
