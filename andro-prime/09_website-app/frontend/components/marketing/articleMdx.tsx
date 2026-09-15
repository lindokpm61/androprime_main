import type { Pluggable } from 'unified'
import remarkGfm from 'remark-gfm'
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
  /*
   * 🔴 GFM TABLES NEED THE SCROLL WRAPPER, AND UNTIL 2026-09-15 NOTHING APPLIED IT.
   *
   * `.fb-tablewrap { overflow-x: auto }` has existed in f-blog.css since the F
   * blog was built, for exactly this: an article table is authored in markdown,
   * its column count is whatever the author needed, and at 390px a wide one has
   * nowhere to go. But remark-gfm emits a bare `<table>` and this map had no
   * `table` entry, so the class was defined and applied to NOTHING — the rule
   * was written, and the wiring was not.
   *
   * The symptom: at 390px `/blog/b12-blood-test` scrolled the whole document
   * horizontally (content 399px against a 390px viewport). One article tripped
   * it by 9px; any table one column wider would do the same. Found the first
   * time the viewport sweep measured all 18 articles instead of one.
   *
   * The wrapper goes OUTSIDE the table, not on it: `overflow-x` on the table
   * itself does not create a scroll container for its own box.
   */
  table: (props: React.ComponentProps<'table'>) => (
    <div className="fb-tablewrap">
      <table {...props} />
    </div>
  ),
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

// remark-gfm enables GFM tables (used in article bodies), strikethrough, and autolinks.
const remarkPlugins: Pluggable[] = [remarkGfm]

export const mdxOptions = {
  mdxOptions: { remarkPlugins, rehypePlugins },
}
