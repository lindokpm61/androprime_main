// Canonical Vitall patient identifier = a SYNTHETIC address derived from our
// Supabase user id. We deliberately do NOT send the customer's real email
// address (or phone number) to Vitall.
//
// Why (Ben Starling, Vitall Commercial Director, 2026-08-21):
// Vitall use email purely as the unique key on the patient account. It does not
// have to be a real mailbox, and Vitall IGNORE anything `@vitall.co.uk` on a
// partner account — it is their existing pattern for in-clinic registrations
// where the client never gets account access.
//
// Sending a real mailbox is what let Vitall-side automations reach our
// customers directly (order confirmation, "received at lab", "results
// available", all observed arriving from Raizel in August 2026). Ben disabled
// those, but two things he CANNOT currently disable are auto account creation
// on andro-prime.vitall.co.uk and existing customer logins on that subdomain.
// A disabled automation is a config flag that a release or a new feature can
// reset; an unreachable mailbox is not. This removes the capability rather than
// switching off the behaviour.
//
// It also closes a latent dispatch failure: Vitall are a direct DTC competitor
// with their own customers and other partners, and `POST /order/create` returns
// 400 (patient "cannot be claimed") when the email is already registered under
// a DIFFERENT partner account. That would fire AFTER the customer has paid.
// A per-user synthetic address cannot collide with anyone else's account.
//
// Nothing in the flow is load-bearing on this value:
//   * kit-to-order linkage is Vitall pre-printing the kit against the order
//     (Ben, 2026-06-03) — the customer never registers a kit
//   * results come back on `partner_order_id` + `partner_user_id`, both ours
//   * our own longitudinal history is keyed on `users.id`, not on Vitall
//
// MUST be derived from the USER id, never the order id: Vitall dedupe patients
// on this address, so a stable per-user value keeps a repeat customer's orders
// consolidated onto one Vitall patient record. Keying it on the order would
// fragment one person into a new patient per kit. It is also MORE stable than
// the real email, which a customer can change between kit 1 and kit 2.
//
// Full context: 05_partners/labs/vitall/correspondence/2026-08-21-keith-disable-customer-touchpoints-draft.md
import type { VitallPatientAddress, VitallOrderCreateBody } from './types'

export function vitallPatientEmail(userId: string): string {
  return `${userId}-andro-prime@vitall.co.uk`
}

// The patient block sent on `POST /order/create`, built in ONE place so the
// "synthetic address, no phone" rule is a named, testable unit rather than a
// line buried in the dispatch route that a later edit can quietly undo.
// Tested by `scripts/test-vitall-patient-payload.ts`.
//
// Note what is NOT a parameter: there is no `email` and no `phone` input. The
// caller cannot pass a real mailbox even by mistake, because there is nowhere
// to put one. That is the point — the rule is enforced by the signature, not by
// a comment asking the next person to remember it.
export interface VitallPatientSource {
  id: string
  first_name: string
  last_name: string
  sex: 'male' | 'female'
  date_of_birth: string
}

export function buildVitallPatient(
  user: VitallPatientSource,
  address: VitallPatientAddress,
): VitallOrderCreateBody['patient'] {
  return {
    partnerUserId: user.id,
    email: vitallPatientEmail(user.id),
    firstName: user.first_name,
    lastName: user.last_name,
    sex: user.sex,
    birthDate: user.date_of_birth,
    address,
  }
}
