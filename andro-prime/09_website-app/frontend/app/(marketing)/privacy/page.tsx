import type { Metadata } from 'next'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const metadata: Metadata = {
  title: 'Privacy Policy | Andro Prime',
  description: 'We collect health data. That means we take this seriously.',
}

async function getCanonicalPrivacyContent() {
  const canonicalPath = path.join(process.cwd(), 'canonical-site', 'privacy', 'index.html')
  const html = await readFile(canonicalPath, 'utf8')

  const match = html.match(/(<header[\s\S]*?<\/main>)/i)

  if (match?.[1]) {
    return match[1]
  }

  return '<section class="py-24"><div class="max-w-4xl mx-auto px-6"><h1 class="text-5xl font-sans font-black uppercase tracking-tighter mb-6">Privacy Policy</h1><p class="font-serif text-lg">The canonical privacy content could not be loaded.</p></div></section>'
}

export default async function PrivacyPage() {
  const canonicalContent = await getCanonicalPrivacyContent()

  return <div dangerouslySetInnerHTML={{ __html: canonicalContent }} />
}
