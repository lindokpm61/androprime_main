export interface CioEvent {
  name: string
  data?: Record<string, unknown>
}

const CIO_TRACK_URL = 'https://track.customer.io/api/v1/track'
const CIO_IDENTIFY_URL = 'https://track.customer.io/api/v1/identify'

function getAuthHeader(): string {
  const siteId = process.env.CUSTOMERIO_SITE_ID ?? ''
  const apiKey = process.env.CUSTOMERIO_API_KEY ?? ''
  return 'Basic ' + Buffer.from(`${siteId}:${apiKey}`).toString('base64')
}

export async function emitEvent(userId: string, event: CioEvent): Promise<void> {
  try {
    await fetch(CIO_TRACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        id: userId,
        name: event.name,
        data: event.data,
        timestamp: Math.floor(Date.now() / 1000),
      }),
    })
  } catch (err) {
    console.error('[customerio] emitEvent failed:', err)
  }
}

export async function identifyUser(userId: string, traits: Record<string, unknown>): Promise<void> {
  try {
    await fetch(CIO_IDENTIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        id: userId,
        ...traits,
      }),
    })
  } catch (err) {
    console.error('[customerio] identifyUser failed:', err)
  }
}
