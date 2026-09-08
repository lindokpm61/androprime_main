'use client'

import { createContext, useContext, useEffect, useState } from 'react'

/*
 * THE DEMO'S THEME, LIFTED ABOVE THE PHONE.
 *
 * 🔴 WHY IT MOVED. The toggle used to be local state inside `DemoStage`, so the
 * attribute it set landed on `.ap-stage` -- which contains the phone and the
 * rail and NOTHING ELSE. The nav above it and the footer below it are rendered
 * by the route's layout, are siblings of the stage, and stayed white while the
 * stage went dark. Keith: *"on the demo page, the header and footer are in light
 * mode."* They were, and no amount of CSS could reach them from inside the
 * element they sit outside of.
 *
 * 🟢 WHAT MADE THE FIX SMALL. The nav and the footer are not styled with literal
 * colours. They are `f-*` classes driven by the Direction F semantic tokens --
 * `--paper`, `--ink`, `--ink-2`, `--ink-3`, `--core`, `--tray`, `--sunk`,
 * `--hair`, `--hair-2` -- which is the SAME vocabulary the demo's own `--ap-*`
 * set uses, role for role. So theming them is not a rewrite of two components;
 * it is one dark table declared on a wrapper that contains all three.
 *
 * ⚠ SCOPED TO THIS ROUTE GROUP, DELIBERATELY. The attribute goes on a wrapper
 * inside `app/(demo)/layout.tsx`, never on `<html>`. Writing it to the document
 * element would leave the whole site dark after a client-side navigation off
 * `/demo`, and the site has no dark mode to be left in. See the note in
 * `styles/pages/app-shell.css` about what a site-wide toggle would actually
 * take.
 */

export type DemoThemeChoice = 'light' | 'dark' | null

interface DemoThemeValue {
  /** null = follow the machine. 'light' / 'dark' = the reader overruled it. */
  choice: DemoThemeChoice
  setChoice: (c: DemoThemeChoice) => void
  /** What is actually on screen right now, choice or system. */
  dark: boolean
}

const Ctx = createContext<DemoThemeValue | null>(null)

export function useDemoTheme(): DemoThemeValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useDemoTheme must be used inside <DemoThemeProvider>')
  return v
}

export function DemoThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<DemoThemeChoice>(null)
  const [systemDark, setSystemDark] = useState(false)

  /*
   * `systemDark` cannot be read during render: there is no `matchMedia` on the
   * server and guessing would hydrate wrong. It is read after mount and only
   * drives the BUTTON LABEL, because the colours themselves are done in CSS by
   * `prefers-color-scheme`, which needs no JavaScript and cannot flash.
   */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const dark = choice ? choice === 'dark' : systemDark

  return (
    <Ctx.Provider value={{ choice, setChoice, dark }}>
      <div className="ap-themed" data-ap-theme={choice ?? undefined}>
        {children}
      </div>
    </Ctx.Provider>
  )
}
