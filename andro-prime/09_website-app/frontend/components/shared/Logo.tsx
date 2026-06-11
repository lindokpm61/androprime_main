// Reusable brand logo. Renders the outlined Refined Monogram lockup.
// Path data lives in ./logoArt (auto-generated); see 02_brand/visual-identity.md.
import type { SVGProps } from 'react'
import { AP_PATH, WORDMARK_PATH } from './logoArt'

type LogoVariant = 'dark' | 'light'

interface LogoProps extends SVGProps<SVGSVGElement> {
  /** 'dark' = black mark on light backgrounds (default). 'light' = for dark backgrounds. */
  variant?: LogoVariant
}

export function Logo({ variant = 'dark', ...props }: LogoProps) {
  const box = variant === 'dark' ? '#000000' : '#ffffff'
  const mark = variant === 'dark' ? '#ffffff' : '#000000'
  const word = variant === 'dark' ? '#000000' : '#ffffff'
  return (
    <svg
      viewBox="0 0 470 100"
      role="img"
      aria-label="Andro Prime"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0" y="0" width="100" height="100" fill={box} />
      <path d={AP_PATH} fill={mark} />
      <path d={WORDMARK_PATH} fill={word} />
    </svg>
  )
}
