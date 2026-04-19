import { Receiver } from '@upstash/qstash'

let receiver: Receiver | null = null

export function getQStashReceiver(): Receiver {
  if (!receiver) {
    if (!process.env.QSTASH_CURRENT_SIGNING_KEY || !process.env.QSTASH_NEXT_SIGNING_KEY) {
      throw new Error('QStash signing keys are not set')
    }
    receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
    })
  }
  return receiver
}

export async function verifyQStashRequest(request: Request): Promise<string> {
  const rawBody = await request.text()
  const signature = request.headers.get('upstash-signature') ?? ''
  const r = getQStashReceiver()
  await r.verify({ signature, body: rawBody })
  return rawBody
}
