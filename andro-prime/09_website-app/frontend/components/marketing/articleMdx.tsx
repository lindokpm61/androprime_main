import type { Pluggable } from 'unified'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import PullQuote from '@/components/marketing/PullQuote'
import StatBox from '@/components/marketing/StatBox'
import EvidenceBox from '@/components/marketing/EvidenceBox'
import ClinicalInsight from '@/components/marketing/ClinicalInsight'
import SystemAlert from '@/components/marketing/SystemAlert'
import PublishedEvidence from '@/components/marketing/PublishedEvidence'
import InlineKitCTA from '@/components/marketing/InlineKitCTA'
import SysHeading from '@/components/marketing/SysHeading'
import NumberedHeading from '@/components/marketing/NumberedHeading'
import Caveat from '@/components/marketing/Caveat'
import References from '@/components/marketing/References'
import Punchline from '@/components/marketing/Punchline'
import Note from '@/components/marketing/Note'

// Shared MDX render config for blog articles. Used by the public article route
// (app/(marketing)/blog/[slug]) AND the draft preview route
// (app/(marketing)/blog/preview/[slug]) so both render identically — a draft
// previews exactly as it will publish. BlogToc is injected per-page (it needs the
// page's extracted headings), so it is intentionally not in this map.
export const mdxComponents = {
  PullQuote,
  StatBox,
  EvidenceBox,
  ClinicalInsight,
  SystemAlert,
  PublishedEvidence,
  InlineKitCTA,
  SysHeading,
  NumberedHeading,
  Caveat,
  References,
  Punchline,
  Note,
}

const rehypePlugins: Pluggable[] = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'wrap',
      properties: { className: ['heading-anchor'] },
    },
  ],
  [
    rehypeExternalLinks,
    {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
      protocols: ['http', 'https'],
    },
  ],
]

export const mdxOptions = {
  mdxOptions: { rehypePlugins },
}
