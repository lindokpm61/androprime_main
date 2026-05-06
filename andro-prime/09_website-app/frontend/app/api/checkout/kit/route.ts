import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getCurrentUser } from '@/lib/auth/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const KIT_PRICE_IDS: Record<string, string | undefined> = {
  testosterone: process.env.STRIPE_PRICE_KIT_1,
  'energy-recovery': process.env.STRIPE_PRICE_KIT_2,
  'hormone-recovery': process.env.STRIPE_PRICE_KIT_3,
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

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

  let body: { kitType?: string; dobIso?: string; sex?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { kitType, dobIso: dobFromBody, sex: sexFromBody } = body
  if (!kitType || !(kitType in KIT_PRICE_IDS)) {
    return NextResponse.json({ error: 'Invalid kitType' }, { status: 400 })
  }

  const priceId = KIT_PRICE_IDS[kitType]
  if (!priceId) {
    return NextResponse.json({ error: `Price ID for ${kitType} is not configured` }, { status: 400 })
  }

  // Resolve DOB + sex: prefer existing user record, fall back to request body
  let dobIso: string | null = null
  let sex: string | null = null

  if (user) {
    const supabase = createSupabaseAdminClient()
    const { data: profile } = await supabase
      .from('users')
      .select('date_of_birth, sex')
      .eq('id', user.id)
      .single()

    if (profile?.date_of_birth && profile?.sex) {
      dobIso = profile.date_of_birth as string
      sex = profile.sex as string
    }
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

  if (!dobIso || !sex) {
    return NextResponse.json({ needsDetails: true }, { status: 200 })
  }

  const metadata: Record<string, string> = {
    kit_type: kitType,
    type: 'kit',
    dob: dobIso,
    sex,
  }
  if (user) metadata.user_id = user.id

  let session
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user?.email ?? undefined,
      metadata,
      line_items: [{ price: priceId, quantity: 1 }],
      shipping_address_collection: { allowed_countries: ['GB'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      success_url: `${SITE_URL}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/kits`,
      currency: 'gbp',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('[checkout/kit]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
