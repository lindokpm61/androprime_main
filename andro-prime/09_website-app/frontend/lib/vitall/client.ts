import type {
  VitallTokenResponse,
  VitallOrderCreateBody,
  VitallOrderCreateResponse,
  VitallErrorResponse,
} from './types'

const IS_SANDBOX = process.env.VITALL_SANDBOX === 'true'
const BASE_URL = IS_SANDBOX
  ? 'https://vitallsync.com/api/v2'
  : 'https://vitall.co.uk/api/v2'
const AUTH_URL = IS_SANDBOX
  ? 'https://vitallsync.com/oauth/token'
  : 'https://vitall.co.uk/oauth/token'

// In-process token cache — tokens are valid for 7 days (604800s).
// We refresh 1 hour before expiry to avoid mid-request failures.
let cachedToken: { token: string; expiresAt: number } | null = null
const REFRESH_BUFFER_MS = 60 * 60 * 1000

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = process.env.VITALL_CLIENT_ID
  const clientSecret = process.env.VITALL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('VITALL_CLIENT_ID or VITALL_CLIENT_SECRET not configured')
  }

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    throw new Error(`Vitall auth failed: ${res.status} ${await res.text()}`)
  }

  const data: VitallTokenResponse = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - REFRESH_BUFFER_MS,
  }

  return data.access_token
}

async function vitallFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })
}

export async function createOrder(body: VitallOrderCreateBody): Promise<VitallOrderCreateResponse> {
  const res = await vitallFetch('/order/create', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const data: VitallOrderCreateResponse | VitallErrorResponse = await res.json()

  if (!res.ok) {
    const err = data as VitallErrorResponse
    throw new Error(
      `Vitall createOrder failed (${res.status}): ${err.error ?? JSON.stringify(data)}`
    )
  }

  return data as VitallOrderCreateResponse
}

export async function getAvailableTests(): Promise<unknown> {
  const res = await vitallFetch('/tests')
  if (!res.ok) throw new Error(`Vitall getTests failed: ${res.status}`)
  return res.json()
}
