// Single source of truth for blog author + reviewer data.
// Populated from andro-prime/02_brand/author-bios.md.
// Consumed by: /authors/[slug] pages, ArticleLayout byline, Article schema author + reviewedBy fields, AuthorBioCard.

export type AuthorSlug = 'keith-antony' | 'dr-ewa-lindo'
export type AuthorRole = 'founder' | 'medical-reviewer'

export interface Author {
  slug: AuthorSlug
  name: string
  role: AuthorRole
  // jobTitle: schema.org Person.jobTitle
  jobTitle: string
  // bylineRole: short label shown on article bylines, e.g. "Founder, Andro Prime" / "GMC-registered GP"
  bylineRole: string
  // bio: ~30 word short bio for Person schema `description` + byline tooltip
  bio: string
  // longBio: ~150-250 word author page body. May contain newlines (one paragraph per blank-line block).
  longBio: string
  initials: string
  // TODO: replace with real photo. Both authors currently fall back to /og/default.png placeholder.
  imgSrc: string
  // credentials: e.g. "GMC 4758565" — rendered on author page and as part of bylineRole when applicable
  credentials?: string
  // sameAs: external profile URLs for schema.org Person.sameAs. Only include URLs with verification content.
  sameAs: string[]
  // knowsLanguage: ISO codes, populates Person.knowsLanguage when set
  knowsLanguage?: string[]
}

export const AUTHORS: Record<AuthorSlug, Author> = {
  'keith-antony': {
    slug: 'keith-antony',
    name: 'Keith Antony',
    role: 'founder',
    jobTitle: 'Founder, Andro Prime',
    bylineRole: 'Founder, Andro Prime',
    bio: 'Founder of Andro Prime. Spent two years being told his test results were "normal" before tracking down what the standard panel was missing. Writes about navigating men’s health diagnostics.',
    longBio: `I spent two years being told I was normal.

My testosterone came back borderline. My GP said it wasn’t worth treating. Probably stress. Within range for my age. I was tired by 2pm every day, training four times a week and getting nowhere, losing focus in meetings I used to run. Not myself. But apparently fine.

I pushed further. Got the full picture. Tested SHBG, Free T, the markers the standard panel skips. That’s when I understood why the first test had missed it — Total testosterone tells you part of the story. It doesn’t tell you how much is actually available to your body. Mine wasn’t.

I got the right support. It changed everything.

I built Andro Prime because I lost two years to a process that should have taken two weeks. Thousands of men are in the same position right now, being told they’re fine when they’re not. The data exists. They just can’t access it easily.

Now they can.

I write for Andro Prime about what I’ve learned navigating men’s health diagnostics — the markers that matter, the questions to ask, and how to read your own results without a medical degree. Clinical content is reviewed by Dr Ewa Lindo, our GMC-registered medical lead.`,
    initials: 'KA',
    imgSrc: '/og/default.png', // TODO: replace with real photo
    sameAs: ['https://www.linkedin.com/in/keithantony'],
  },
  'dr-ewa-lindo': {
    slug: 'dr-ewa-lindo',
    name: 'Dr Ewa Lindo',
    role: 'medical-reviewer',
    jobTitle: 'General Practitioner',
    bylineRole: 'GMC-registered GP',
    bio: 'GMC-registered GP with 20+ years UK clinical experience and Harley Street training in testosterone replacement therapy. Medical lead for Andro Prime; reviews all clinical content and signs off results-report copy.',
    longBio: `Dr Ewa Lindo is a GMC-registered GP with over 20 years of UK clinical experience and additional Harley Street training in testosterone replacement therapy. She currently practises at St James Medical Practice in Croydon, and previously spent nine years at Denmark Road Surgery in South Norwood. Her hospital background spans accident and emergency, paediatrics, obstetrics and gynaecology, dermatology, and surgical and medical house posts at St Helier and Epsom General Hospitals.

She is the medical lead for Andro Prime. Her role is to review the clinical content men receive in their results reports, sign off the recommendation logic the platform uses, and make sure the line between wellness and clinical care is drawn honestly. She will be the prescriber when our clinical programme launches following CQC registration.`,
    initials: 'EL',
    imgSrc: '/og/default.png', // TODO: replace with real photo
    credentials: 'GMC 4758565',
    sameAs: ['https://www.gmc-uk.org/doctors/4758565'],
    knowsLanguage: ['en-GB', 'pl'],
  },
}

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS[slug as AuthorSlug]
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS)
}
