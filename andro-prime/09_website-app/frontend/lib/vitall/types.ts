// Vitall API v2 types — based on API spec v2-01-12-2024

export type VitallOrderStatusCode =
  | 'order-placed'
  | 'kit-sent'
  | 'sample-received'
  | 'tests-analysis'
  | 'results-available'

export interface VitallRawResult {
  code: string
  name: string
  name_simple: string
  result: string       // numeric value as string e.g. "163.0"
  units: string
  reference: string    // range string e.g. "50 - 250" or "<45"
  flag: string         // "H", "L", or ""
  note: string
  comment: string
  created_at: string
}

export interface VitallRawPanel {
  panel_code: string
  panel_name: string
  results: VitallRawResult[]
}

// Webhook payload Vitall POSTs to our endpoint on every order status change.
// When order_status.code is 'results-available', results is a populated array.
// For all other statuses, results is the string "[]".
export interface VitallWebhookPayload {
  vitall_order_id: string
  partner: string
  partner_order_id: string   // matches partnerOrderId we sent on order creation (our kit_orders.id)
  partner_user_id: string    // matches patient.partnerUserId we sent (our users.id)
  laboratory_order_id: string
  order_status: {
    code: VitallOrderStatusCode
    name: string
  }
  comment: string
  warning: string
  user: {
    sex: string
    email: string
    firstname: string
    surname: string
    dob: string     // YYYY/MM/DD
    phone: string
  }
  tests: string[]
  collection: string
  results: VitallRawPanel[] | string   // array when results-available, "[]" otherwise
  results_pdf: string                  // base64 encoded PDF or ""
  results_html: string                 // base64 encoded HTML or ""
}

export interface VitallPatientAddress {
  line1: string
  line2?: string
  city: string
  county: string
  postCode: string
}

export interface VitallOrderCreateBody {
  partnerOrderId?: string
  collection: 'self-collection' | 'clinic-collection' | 'nurse-collection'
  tests: string[]
  patient: {
    partnerUserId?: string
    email: string
    firstName: string
    lastName: string
    sex: 'male' | 'female'
    birthDate: string    // YYYY-MM-DD
    phone?: string
    address: VitallPatientAddress
  }
}

export interface VitallOrderCreateResponse {
  success: string
  order: {
    orderId: string
    partnerOrderId: string
    status: {
      name: string
      slug: string
      description: string
    }
    value: string
    patient: Record<string, unknown>
    collection: Record<string, unknown>
    panels: Array<{
      shortCode: string
      name: string
      title: string
      yourPrice: string
      analysisTime: string
      imageUrl: string
    }>
    createdAt: string
    updatedAt: string
  }
}

export interface VitallTokenResponse {
  token_type: 'Bearer'
  expires_in: number
  access_token: string
}

export interface VitallErrorResponse {
  error: string
  details?: Record<string, string[]>
}
