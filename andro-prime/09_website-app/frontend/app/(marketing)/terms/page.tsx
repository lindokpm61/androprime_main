import type { Metadata } from 'next'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Andro Prime',
  description: "What you're agreeing to when you buy from us. Written clearly.",
}

async function getCanonicalTermsContent() {
  const canonicalPath = path.join(process.cwd(), 'canonical-site', 'terms', 'index.html')
  const html = await readFile(canonicalPath, 'utf8')

  const match = html.match(/<!-- Hero -->([\s\S]*?)<!-- Footer -->/i)

  if (match?.[1]) {
    return match[1]
  }

  return '<section class="py-24"><div class="max-w-4xl mx-auto px-6"><h1 class="text-5xl font-sans font-black uppercase tracking-tighter mb-6">Terms and Conditions</h1><p class="font-serif text-lg">The canonical terms content could not be loaded.</p></div></section>'
}

export default async function TermsPage() {
  const canonicalContent = await getCanonicalTermsContent()

  return <div dangerouslySetInnerHTML={{ __html: canonicalContent }} />
}
