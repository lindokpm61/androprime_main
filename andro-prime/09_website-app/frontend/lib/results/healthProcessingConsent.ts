import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { HEALTH_PROCESSING_CONSENT_VERSION } from '@/lib/auth/consentVersions'

// Does this user have a recorded CA-018 health-data processing consent (the
// Art 9(2)(a) checkbox captured at checkout — see consentVersions.ts)? Used to
// gate the energy-marker traits sent to Customer.io (a US processor) at
// result-processing time, mirroring how the low-T flag is consent-gated.
//
// FAIL CLOSED: a missing row, a null/mismatched version, a query error, or a
// thrown exception all count as NO consent (returns false). Result processing
// must never crash because of this lookup, so guest checkouts (no users row /
// no consent stamp) and DB errors degrade to "no traits", not an exception.
//
// Version-locked (like LOWT_NURTURE_CONSENT_VERSION): consent is only valid for
// the CURRENT copy version. If the checkout consent copy is re-versioned, prior
// consenters no longer match until they re-consent — the stored version must
// point at exactly the wording the customer agreed to (Art 7(1) accountability).
export async function hasHealthProcessingConsent(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('health_processing_consent_version')
      .eq('id', userId)
      .single()
    if (error || !data) {
      console.error(
        '[process-result] health-processing consent lookup failed for user',
        userId,
        error?.message ?? 'no row',
      )
      return false
    }
    return data.health_processing_consent_version === HEALTH_PROCESSING_CONSENT_VERSION
  } catch (err) {
    // Never let the consent lookup throw out of result processing — fail closed.
    console.error(
      '[process-result] health-processing consent lookup threw for user',
      userId,
      err,
    )
    return false
  }
}
