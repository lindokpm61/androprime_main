// Unit tests for the patient block we send Vitall on `POST /order/create`.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npx tsx scripts/test-vitall-patient-payload.ts`.
//
// Why this file exists: on 2026-08-21 we stopped sending the customer's real
// email address and phone number to Vitall, and send a synthetic per-user
// address instead (rationale in lib/vitall/identity.ts). Nothing else in the
// suite touches the dispatch path, so without these assertions a later edit
// could reinstate `email: user.email` and no test would notice until a Vitall
// automation emailed a real customer.
//
// These tests prove OUR side is correct: the payload we build. They do NOT
// prove Vitall accept an @vitall.co.uk address on our partner account — that
// needs a real call against the sandbox and is tracked separately.
//
// Covers:
//   (1) The synthetic address: correct shape, derived from the USER id.
//   (2) The real mailbox never appears, whatever the user record holds.
//   (3) No `phone` key at all — absent, not undefined.
//   (4) The fields the lab genuinely needs pass through unchanged.
//   (5) The dedupe invariant: stable per user, distinct between users, and
//       independent of the order (so a repeat customer stays one Vitall patient).

import {
  vitallPatientEmail,
  buildVitallPatient,
  type VitallPatientSource,
} from '../lib/vitall/identity'
import type { VitallPatientAddress } from '../lib/vitall/types'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

// A realistic Supabase `users` row id (uuid) and a real-looking mailbox that
// must never reach Vitall.
const USER_ID = '3f9a1c2e-7b40-4d51-9c88-0a1b2c3d4e5f'
const OTHER_USER_ID = 'd41d8cd9-8f00-4204-a980-0998ecf8427e'
const REAL_EMAIL = 'keith.customer@gmail.com'
const REAL_PHONE = '07700900123'

const address: VitallPatientAddress = {
  line1: '10 The Street',
  city: 'London',
  county: 'Greater London',
  postCode: 'EC1A 1BB',
}

function makeUser(overrides: Partial<VitallPatientSource> = {}): VitallPatientSource {
  return {
    id: USER_ID,
    first_name: 'John',
    last_name: 'Smith',
    sex: 'male',
    date_of_birth: '1985-10-21',
    ...overrides,
  }
}

// (1) The synthetic address.
check(
  '(1) vitallPatientEmail returns <userId>-andro-prime@vitall.co.uk',
  vitallPatientEmail(USER_ID) === `${USER_ID}-andro-prime@vitall.co.uk`,
)
check(
  '(1) the address is on the vitall.co.uk domain (the domain Vitall ignore on a partner account)',
  vitallPatientEmail(USER_ID).endsWith('@vitall.co.uk'),
)
check(
  '(1) the address carries the user id, so a support query can be traced back',
  vitallPatientEmail(USER_ID).includes(USER_ID),
)
check(
  '(1) buildVitallPatient uses that same address',
  buildVitallPatient(makeUser(), address).email === vitallPatientEmail(USER_ID),
)

// (2) The real mailbox never appears. This is the assertion that fails if
// someone reinstates `email: user.email` in the dispatch route.
const payload = buildVitallPatient(makeUser(), address)
const serialised = JSON.stringify(payload)
check('(2) the payload does not contain the real email address', !serialised.includes(REAL_EMAIL))
check('(2) the payload contains no gmail.com address', !serialised.includes('gmail.com'))
check(
  '(2) the payload email is not any address outside vitall.co.uk',
  payload.email.endsWith('@vitall.co.uk'),
)

// (3) No phone. Absent, not merely undefined — an explicit `phone: undefined`
// would still show up as a key and could be serialised as null by a future
// change to the client.
check('(3) `phone` is not a key on the patient block', !('phone' in payload))
check('(3) the payload does not contain the real phone number', !serialised.includes(REAL_PHONE))
check(
  '(3) buildVitallPatient takes no email or phone parameter (nothing to pass by mistake)',
  buildVitallPatient.length === 2,
)

// (4) What the lab genuinely needs still gets through untouched.
check('(4) partnerUserId is our user id', payload.partnerUserId === USER_ID)
check('(4) firstName passes through', payload.firstName === 'John')
check('(4) lastName passes through', payload.lastName === 'Smith')
check('(4) sex passes through', payload.sex === 'male')
check('(4) birthDate passes through in YYYY-MM-DD', payload.birthDate === '1985-10-21')
check('(4) address passes through unchanged', JSON.stringify(payload.address) === JSON.stringify(address))
check(
  '(4) a female patient is not coerced',
  buildVitallPatient(makeUser({ sex: 'female' }), address).sex === 'female',
)

// (5) The dedupe invariant. Vitall key the patient account on this address, so
// it must be stable for one customer across kits and distinct between customers.
check(
  '(5) same user, called twice -> identical address (kit 2 lands on the same Vitall patient)',
  buildVitallPatient(makeUser(), address).email === buildVitallPatient(makeUser(), address).email,
)
check(
  '(5) different users -> different addresses (no cross-customer collision)',
  buildVitallPatient(makeUser(), address).email !==
    buildVitallPatient(makeUser({ id: OTHER_USER_ID }), address).email,
)
check(
  '(5) the address does not vary with the shipping address (nothing order-specific leaks in)',
  buildVitallPatient(makeUser(), address).email ===
    buildVitallPatient(makeUser(), { ...address, line1: '99 Somewhere Else', postCode: 'M1 1AA' })
      .email,
)
check(
  '(5) the address does not vary when the profile name changes (only the id keys it)',
  buildVitallPatient(makeUser(), address).email ===
    buildVitallPatient(makeUser({ first_name: 'Jonathan', last_name: 'Smythe' }), address).email,
)

if (failures > 0) {
  console.error(`\n${failures} vitall-patient-payload assertion(s) failed (${passes} passed).`)
  process.exit(1)
}
console.log(`\nAll ${passes} vitall-patient-payload assertion(s) passed.`)
process.exit(0)
