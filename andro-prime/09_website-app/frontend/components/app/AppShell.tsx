import React from 'react'
import { Logo } from '@/components/shared/Logo'

/**
 * THE AUTHENTICATED APP'S PAGE SCAFFOLD.
 *
 * Added 2026-09-11 with the batch-3 rebuild, and it is the app-side answer to
 * what `FPage` does for marketing: the assembly a signed-in screen is made of,
 * composed rather than copy-pasted.
 *
 * 🔴 THE NAME COLLIDES WITH `components/app-shell/AppShell.tsx` AND THEY ARE
 * DIFFERENT THINGS. That one is the `ap-` phone shell `/demo` renders, four tabs
 * and a bezel, typed against the demo's own data model. This one is the `f-`
 * Direction F shell for the real signed-in routes. Keith ruled on 2026-09-11
 * that batch 3 is built in Direction F and that adopting the phone shell for the
 * real app is a separate, product-shaped decision. The two never mix on one
 * element, and neither imports the other.
 *
 * WHY IT IS NOT `FPage`. `FPage` is the marketing PAGE ASSEMBLY: a hero, counted
 * sections, a rhythm, a close. None of those exist here. An app screen is a
 * status strip, a sticky explanatory sidebar and a column of trays, so composing
 * `FPage` would mean an `of={0}` section counter and a hero slot nothing fills.
 * `verify-f-scaffold.js` scopes itself to `app/(marketing)`, `app/lp` and
 * `components/marketing` and names the auth tree as the precedent.
 *
 * WHAT THE SIDEBAR IS FOR, since it is the one part that is net-new rather than
 * a restyle. Every one of these routes arrived at the reader with no statement
 * of what it was for: `/account` opened on the word "Profile", `/subscriptions`
 * on a product name. The sidebar carries that sentence, and it sticks, because
 * the main column is a long scroll of trays and the explanation is what a reader
 * needs when they are three trays down and have lost the frame.
 *
 * Layout source: `design/mockups/journey/account-F.html` (Frames K and L) and
 * `results-F.html` (Frame C). Pictures, not a spec.
 */

/* ---------------------------------------------------------------- AppStrip */

type AppStripProps = {
  /** What this screen is. Rendered uppercase by the stylesheet. */
  label: string
  /**
   * The one fact the page would otherwise repeat in its own body: the signed-in
   * email, the count of active subscriptions, the date a result landed. Optional,
   * and the dot and label stay grouped when it is absent rather than springing
   * apart, which is why the strip is not `space-between`.
   */
  right?: React.ReactNode
}

/**
 * The strip is the app's inverted block, and it is the only one these pages get.
 * Direction F caps a page at one inverted panel; on a marketing route that is
 * spent on a conformity statement, and here it is spent on saying which screen
 * you are on. An app page therefore never also carries `.f-invert`.
 */
export function AppStrip({ label, right }: AppStripProps) {
  return (
    <div className="f-appstrip">
      <div className="f-appstrip-in">
        <span className="f-appdot" aria-hidden="true" />
        <span>{label}</span>
        {right !== undefined && <span className="f-appstrip-r">{right}</span>}
      </div>
    </div>
  )
}
AppStrip.displayName = 'AppStrip'

/* ---------------------------------------------------------------- AppShell */

type AppShellProps = {
  /** The main column: a stack of `.f-tray > .f-core` blocks. */
  children: React.ReactNode
  /** The small mono chip above the heading. A live count, not a slogan. */
  chip?: React.ReactNode
  heading: string
  /** One paragraph. What this screen is for, in the customer's terms. */
  intro: React.ReactNode
}

export function AppShell({ children, chip, heading, intro }: AppShellProps) {
  return (
    <div className="f-appwrap">
      <div className="f-appshell">
        <div className="f-appside">
          {/* No `<i>` marker inside the chip. `.f-chip i` was deliberately
              deleted on 2026-09-02 ("a credential is not a state") and its
              replacement comment asks that it not be restored by accident, so an
              empty <i> here would render an unstyled element for no reason. */}
          {chip !== undefined && <span className="f-chip">{chip}</span>}
          <h1>{heading}</h1>
          <p className="f-appside-p">{intro}</p>
          <div className="f-appside-foot">
            <Logo variant="dark" mark className="h-12 w-auto" />
          </div>
        </div>
        <div className="f-appmain">{children}</div>
      </div>
    </div>
  )
}
AppShell.displayName = 'AppShell'
