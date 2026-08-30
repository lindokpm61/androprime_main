import type { Metadata, Viewport } from "next";
import { Inter, Merriweather, JetBrains_Mono, Newsreader } from "next/font/google";
import "@/styles/base/globals.css";
import { JsonLd } from "@/components/shared/JsonLd";
import { SkipToContent } from "@/components/shared/SkipToContent";
import FirstPromoterScript from "@/components/analytics/FirstPromoterScript";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieConsent from "@/components/analytics/CookieConsent";
import { SITE_URL } from "@/lib/site-url";

// Brand fonts: self-hosted by Next at build time (no Google request from the
// visitor's browser). Exposed as CSS variables consumed by tailwind.config.ts
// fontFamily and the typography tokens (--font-sans / --font-serif / --font-mono).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Merriweather (body serif) and JetBrains Mono (data labels) are NOT preloaded:
// only Inter (the hero H1) is. On a throttled mobile connection the preloaded
// fonts were competing with the LCP poster for bandwidth. These still load via
// their @font-face on first use with display:swap (fallback text shows meanwhile,
// CLS stays 0 thanks to next/font metric adjustment), just at a lower priority
// that no longer delays the LCP paint.
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

// DISPLAY / HEADLINE FACE: a STAND-IN, not the brand face (added 2026-08-30).
//
// Keith ruled the type system on 2026-08-30 (02_brand/brand-guidelines.md §4.1):
// a SERIF HEADLINE over a HUMANIST SANS, the sans carrying body copy, UI and all
// data. Direction F was drawn all-sans, so this changes F. The faces are NOT
// chosen: the licensed candidates are Austin (Commercial Type) over a humanist
// sans such as Effra (Dalton Maag), and licensing, self-hosting rights and price
// are all unverified and gate any spend.
//
// Newsreader is the free stand-in the ruling was actually made against, so it
// reproduces the comparison rather than inventing a new one. That comparison was
// a runtime throwaway and left no artefact in the repo.
//
// It feeds --font-display, which is a NEW token. It deliberately does NOT feed
// --font-serif: that token means "Merriweather body copy" in 517 places across 83
// files, and globals.css sets `body { font-family: var(--font-serif) }`, so
// repointing it would silently reset body copy on every page not yet rebuilt.
// Swapping in the licensed face later is one line in typography.css plus the
// import here, but note it will need next/font/local, since neither candidate is
// on Google Fonts.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

// Deliberately the hard-coded production origin, NOT the SITE_URL constant:
// schema.org @id values are stable global identifiers and must not change on a
// preview deployment. `metadataBase` below is the one that follows SITE_URL.
const BASE_URL = "https://andro-prime.com";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Andro Prime",
      // Companies House entity, per 03_compliance/terms-and-conditions.md. NOT a
      // MedicalBusiness/MedicalClinic type: those assert a clinical service and
      // would breach the Phase 0 boundary (see the 2026-08-02 AI-visibility review).
      "legalName": "Andro Prime Ltd",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/icon-512.png`,
        "width": 512,
        "height": 512,
      },
      "description": "At-home blood tests for men. UKAS ISO 15189 accredited laboratory. Results in 2 to 5 working days. No GP needed.",
      "areaServed": { "@type": "Country", "name": "United Kingdom" },
      // Company channels only, per 06_marketing/content/social-channel-setup.md
      // (reconciled against Metricool 2026-08-10). Keith's personal X and
      // LinkedIn are deliberately excluded from the Organization entity.
      "sameAs": [
        "https://www.instagram.com/keithandroprime",
        "https://www.youtube.com/@keithandroprime",
        "https://keithandroprime.substack.com",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "hello@andro-prime.com",
        "areaServed": "GB",
        "availableLanguage": "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Andro Prime",
      "description": "At-home blood tests for men. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.",
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "inLanguage": "en-GB",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Andro Prime | Premium At-Home Blood Tests for Men",
    template: "%s | Andro Prime",
  },
  description:
    "At-home blood tests that tell you exactly what your levels are. No GP needed. UKAS ISO 15189 accredited lab.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "Andro Prime",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Andro Prime: At-home blood tests for men" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning on <html> and <body> ONLY. Sentry
    // JAVASCRIPT-NEXTJS-7 logged 39 hydration mismatches across /blog (11),
    // /blog/preview/:slug (14), /kits/* (6), /checkout/details and
    // /order/confirmed, every one of them Chrome on Windows with no user
    // attached. Pages with no auth branch and no client state fail identically
    // to pages that have both, which rules out our own rendering and leaves the
    // documented cause: a browser extension writing attributes onto the document
    // element before React hydrates. React only suppresses one level deep, so
    // this silences the extension's attributes without hiding a genuine
    // mismatch inside any page.
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`scroll-smooth ${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <head>
        <JsonLd data={siteSchema} />
      </head>
      <body
        suppressHydrationWarning
        className="bg-white text-black antialiased overflow-x-hidden selection:bg-black selection:text-white"
      >
        <SkipToContent />
        {children}
        <FirstPromoterScript />
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
