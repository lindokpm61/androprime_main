import type { Metadata, Viewport } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
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
      "url": BASE_URL,
      "description": "At-home blood tests for men. UKAS ISO 15189 accredited laboratory. Results in 2 to 5 working days. No GP needed.",
      "areaServed": { "@type": "Country", "name": "United Kingdom" },
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
      className={`scroll-smooth ${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}
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
